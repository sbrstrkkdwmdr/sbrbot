import * as Discord from 'discord.js';
import fs from 'fs';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';

export async function sendMessage(input: {
    type: 'message' | 'interaction' | 'link' | 'button' | "other",
    message: Discord.Message<any>,
    interaction: Discord.ChatInputCommandInteraction<any> | Discord.ButtonInteraction<any>;
    args: {
        content?: string,
        embeds?: (Discord.EmbedBuilder | Discord.Embed)[],
        files?: (string | Discord.AttachmentBuilder | Discord.Attachment)[],
        components?: Discord.ActionRowBuilder<any>[],
        ephemeral?: boolean,
        react?: boolean,
        edit?: boolean,
        editAsMsg?: boolean,
    };
},
    canReply: boolean
) {
    if (input.args.files) {
        input.args.files = checkFileLimit(input.args.files);
    }

    try {
        switch (input.type) {
            case 'message': case 'link': {
                if (!canReply) {
                    (input.message.channel as Discord.GuildTextBasedChannel).send({
                        content: `${input.args.content ?? ''}`,
                        embeds: input.args.embeds ?? [],
                        files: input.args.files ?? [],
                        components: input.args.components ?? [],
                    })
                        .catch(x => console.log(x));
                } else if (input.args.editAsMsg) {
                    try {
                        input.message.edit({
                            content: `${input.args.content ?? ''}`,
                            embeds: input.args.embeds ?? [],
                            files: input.args.files ?? [],
                            components: input.args.components ?? [],
                        });
                    } catch (err) {

                    }
                } else {
                    input.message.reply({
                        content: `${input.args.content ?? ''}`,
                        embeds: input.args.embeds ?? [],
                        files: input.args.files ?? [],
                        components: input.args.components ?? [],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch(err => {
                            sendMessage(input, false);
                        });
                }
            }
                break;
            case 'interaction': {
                if (input.args.edit == true) {
                    setTimeout(() => {
                        (input.interaction as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `${input.args.content ?? ''}`,
                            embeds: input.args.embeds ?? [],
                            files: input.args.files ?? [],
                            components: input.args.components ?? [],
                            allowedMentions: { repliedUser: false },
                        })
                            .catch();
                    }, 1000);
                } else {
                    if (input.interaction.replied) {
                        input.args.edit = true;
                        sendMessage(input, canReply);
                    } else {
                        (input.interaction as Discord.ChatInputCommandInteraction<any>).reply({
                            content: `${input.args.content ?? ''}`,
                            embeds: input.args.embeds ?? [],
                            files: input.args.files ?? [],
                            components: input.args.components ?? [],
                            allowedMentions: { repliedUser: false },
                            // ephemeral: input.args.ephemeral ?? false,
                            flags: input.args.ephemeral ? Discord.MessageFlags.Ephemeral : null,
                        })
                            .catch();
                    }
                }
            }
            case 'button': {
                input.message.edit({
                    content: `${input.args.content ?? ''}`,
                    embeds: input.args.embeds ?? [],
                    files: input.args.files ?? [],
                    components: input.args.components ?? [],
                    allowedMentions: { repliedUser: false },
                })
                    .catch();
            }
                break;
        }
    } catch (error) {
        return error;
    }
    return true;
}

export function checkFileLimit(files: any[]) {
    if (files.length > 10) {
        return files.slice(0, 9);
    } else {
        return files;
    }
}
export function parseArg(
    args: string[],
    searchString: string,
    type: 'string' | 'number',
    defaultValue: any,
    multipleWords?: boolean,
    asInt?: boolean,
) {
    let returnArg;
    let temp;
    temp = args[args.indexOf(searchString) + 1];
    if (!temp || temp.startsWith('-')) {
        returnArg = defaultValue;
    } else {
        switch (type) {
            case 'string': {
                returnArg = temp;
                if (multipleWords == true && temp.includes('"')) {
                    temp = args.join(' ').split(searchString)[1].split('"')[1];
                    for (let i = 0; i < args.length; i++) {
                        if (temp.includes(args[i].replaceAll('"', '')) && i > args.indexOf(searchString)) {
                            args.splice(i, 1);
                            i--;
                        }
                    }
                    returnArg = temp;
                } else {
                    args.splice(args.indexOf(searchString), 2);
                }
            }
                break;
            case 'number': {
                returnArg = +temp;
                if (isNaN(+temp)) {
                    returnArg = defaultValue;
                } else if (asInt == true) {
                    returnArg = parseInt(temp);
                }
                args.splice(args.indexOf(searchString), 2);
            }
                break;
        }
    }
    return {
        value: returnArg,
        newArgs: args
    };
}
// export function parseScoreListArgs() { }
// export function parseScoreListArgs_message() { }
// export function parseScoreListArgs_interaction() { }
// export function parseScoreListArgs_button() { }

/**
 * checks url for beatmap id. if url given is just a number, then map id is the number
 * @param url the url to check
 * @param callIfMapIdNull if only set id is found, then send an api request to fetch the map id
 * 
 * patterns: 
 * 
 * osu.ppy.sh/b/{map}
 * 
 * osu.ppy.sh/b/{map}?m={mode}
 * 
 * osu.ppy.sh/beatmaps/{map}
 * 
 * osu.ppy.sh/beatmaps/{map}?m={mode}
 * 
 * osu.ppy.sh/s/{set} //mapset
 * 
 * osu.ppy.sh/s/{set}#{mode}/{map}
 * 
 * osu.ppy.sh/beatmapsets/{set}
 * 
 * osu.ppy.sh/beatmapsets/{set}#{mode}/{map}
 */
export async function mapIdFromLink(url: string, callIfMapIdNull: boolean,) {
    if (url.includes(' ')) {
        const temp = url.split(' ');
        //get arg that has osu.ppy.sh
        for (let i = 0; i < temp.length; i++) {
            const curarg = temp[i];
            if (curarg.includes('osu.ppy.sh')) {
                url = curarg;
                break;
            }
        }
    }

    const object: {
        set: number,
        mode: apitypes.GameMode,
        map: number,
    } = {
        set: null,
        mode: null,
        map: null,
    };

    //patterns: 
    /**
     *
     * osu.ppy.sh/b/{map}
     * osu.ppy.sh/b/{map}?m={mode}
     * osu.ppy.sh/beatmaps/{map}
     * osu.ppy.sh/beatmaps/{map}?m={mode}
     * osu.ppy.sh/s/{set} //mapset
     * osu.ppy.sh/s/{set}#{mode}/{map}
     * osu.ppy.sh/beatmapsets/{set}
     * osu.ppy.sh/beatmapsets/{set}#{mode}/{map}
     */

    switch (true) {
        case url.includes('?m='): {
            const modeTemp = url.split('?m=')[1];
            if (isNaN(+modeTemp)) {
                object.mode = modeTemp as apitypes.GameMode;
            } else {
                object.mode = osumodcalc.ModeIntToName(+modeTemp);
            }
            if (url.includes('/b/')) {
                object.map = +url.split('?m=')[0].split('/b/')[1];
            } else if (url.includes('/beatmaps/')) {
                object.map = +url.split('?m=')[0].split('/beatmaps/')[1];
            }
        }
            break;
        case url.includes('/b/'):
            object.map = +url.split('/b/')[1];
            break;
        case url.includes('beatmaps/'):
            object.map = +url.split('/beatmaps/')[1];
            break;
        case url.includes('beatmapsets') && url.includes('#'): {
            object.set = +url.split('beatmapsets/')[1].split('#')[0];
            const modeTemp = url.split('#')[1].split('/')[0];
            if (isNaN(+modeTemp)) {
                object.mode = modeTemp as apitypes.GameMode;
            } else {
                object.mode = osumodcalc.ModeIntToName(+modeTemp);
            }
            object.map = +url.split('#')[1].split('/')[1];
        } break;
        case url.includes('/s/') && url.includes('#'): {
            object.set = +url.split('/s/')[1].split('#')[0];
            const modeTemp = url.split('#')[1].split('/')[0];
            if (isNaN(+modeTemp)) {
                object.mode = modeTemp as apitypes.GameMode;
            } else {
                object.mode = osumodcalc.ModeIntToName(+modeTemp);
            }
            object.map = +url.split('#')[1].split('/')[1];
        } break;
        case url.includes('/s/'):
            object.set = +url.split('/s/')[1];
            break;
        case url.includes('beatmapsets/'):
            object.set = +url.split('/beatmapsets/')[1];
            break;
        case !isNaN(+url):
            object.map = +url;
            break;
    }
    // if (callIfMapIdNull && object.map == null && object.set) {
    //     const bmsdataReq = await helper.tools.api.getMapset(object.set, []);
    //     object.map = (bmsdataReq.apiData as apitypes.Beatmapset)?.beatmaps?.[0]?.id ?? null;
    // }
    return object;
}

/**
 * get user id/name from a given string
 * 
 * patterns:
 * 
 * osu.ppy.sh/u/{id}
 * 
 * osu.ppy.sh/users/{id}
 * 
 * osu.ppy.sh/users/{id}/{mode}
 * 
 * "{username}"
 * 
 * {username}
 * 
 */
export function fetchUser(args: string[]) {
    let url = args.join(' ');
    if (url.includes(' ')) {
        const temp = url.split(' ');
        //get arg that has osu.ppy.sh
        for (let i = 0; i < temp.length; i++) {
            const curarg = temp[i];
            if (curarg.includes('osu.ppy.sh')) {
                url = curarg;
                break;
            }
        }
    }
    const object: {
        id: string,
        mode: apitypes.GameMode,
        args: string[];
    } = {
        id: null,
        mode: null,
        args
    };
    /**
     * patterns:
     * osu.ppy.sh/u/{id}
     * osu.ppy.sh/users/{id}
     * osu.ppy.sh/users/{id}/{mode}
     * "{username}"
     * {username}
     * -u
     */
    const userArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.user, args, true, 'string', true, false);
    switch (true) {
        case userArgFinder.found:
            if (userArgFinder.found) {
                object.id = userArgFinder.output;
                object.args = userArgFinder.args;
            }
        case url.includes('osu.ppy.sh'):
            switch (true) {
                case url.includes('/u/'):
                    object.id = url.split('/u/')[1];
                    break;
                case url.includes('/users/'):
                    object.id = url.split('/users/')[1];
                    if (url.split('/users/')[1].includes('/')) {
                        object.id = url.split('/users/')[1].split('/')[0];
                        object.mode = (url.split('/users/')[1].split('/')[1]) as apitypes.GameMode;
                    }
                    break;
            }
            break;
        case url.includes("\""):
            object.id = url.split('"')[1];
            break;
        default:
            object.id = url;
            break;
    }
    if (object.id.trim() == "") {
        object.id = null;
    }
    return object;
}

/**
 * fetchUser(), but explicitly for 2 users
 */
export function parseUsers(input: string): [string | null, string | null] {
    let foo: string | null = null;
    let bar: string | null = null;
    /**
     * patterns:
     * osu.ppy.sh/u/{id}
     * osu.ppy.sh/users/{id}
     * osu.ppy.sh/users/{id}/{mode}
     * "{username}"
     * {username}
     */
    let tempString;
    let continues = false;
    for (const string of input.split(' ')) {
        if (continues) {
            tempString += string + ' ';
            if (string.includes('"')) {
                continues = false;
                tempString = tempString.replaceAll('"', '').trim();
            } else {
                continue;
            }
        } else {
            switch (true) {
                case string.includes('osu.ppy.sh/u/'):
                    tempString = string.split('osu.ppy.sh/u/')[1];
                    break;
                case string.includes('osu.ppy.sh/users/'):
                    tempString = string.split('osu.ppy.sh/users/')[1];
                    if (tempString.includes('/')) {
                        tempString = tempString.split('/')[0];
                    }
                    break;
                case string.startsWith('"'):
                    continues = true;
                    tempString = string + ' ';
                    continue;
                    break;
                default:
                    tempString = string;
                    break;
            }
        }
        if (foo && bar) break;
        if (foo) {
            bar = tempString;
        } else {
            foo = tempString;
        }

    }

    return [foo, bar];
}

/**
 * NOTE - using mode requires old ids, without mode uses new ids 
 * 
 * patterns:
 * 
 * osu.ppy.sh/scores/{mode}/{id}
 * 
 * osu.ppy.sh/scores/{id}
 */
export function scoreIdFromLink(url: string) {
    if (url.includes(' ')) {
        const temp = url.split(' ');
        //get arg that has osu.ppy.sh
        for (let i = 0; i < temp.length; i++) {
            const curarg = temp[i];
            if (curarg.includes('osu.ppy.sh')) {
                url = curarg;
                break;
            }
        }
    }
    const object: {
        id: string,
        mode: apitypes.GameMode,
    } = {
        id: null,
        mode: null,
    };
    if (!(url.includes('osu.ppy.sh') && url.includes('/scores/'))) {
        return object;
    }

    object.id = url.split('/scores/')[1];
    if (url.split('/scores/')[1].includes('/')) {
        object.id = url.split('/scores/')[1].split('/')[1];
        object.mode = helper.tools.other.modeValidator(url.split('/scores/')[1].split('/')[0]);
    }
    if (object.id.trim() == "") {
        object.id = null;
    }
    return object;
}

/**
 * @param noLinks ignore "button" and "link" command types
 * logs error, sends error to command user then promptly aborts the command
 */
export async function errorAndAbort(input: bottypes.commandInput, commandName: string, interactionEdit: boolean, err: string, noLinks: boolean) {
    if (!err) {
        err = 'undefined error';
    }
    await sendMessage({
        type: 'message',
        message: input.message,
        interaction: input.interaction,
        args: {
            content: err,
            edit: interactionEdit
        }
    }, input.canReply);
    return;
}

export function matchArgMultiple(argFlags: string[], inargs: string[], match: boolean, matchType: 'string' | 'number', isMultiple: boolean, isInt: boolean) {
    let found = false;
    let args: string[] = inargs;
    let matchedValue = null;
    let output = null;
    if (inargs.some(x => {
        if (argFlags.includes(x)) {
            matchedValue = x;
            return true;
        }
        return false;
    })) {
        found = true;
        if (match) {
            const temp = parseArg(inargs, matchedValue, matchType ?? 'number', null, isMultiple, isInt);
            output = temp.value;
            args = temp.newArgs;
        } else {
            output = true;
            inargs.splice(inargs.indexOf(matchedValue), 1);
            args = inargs;
        }
    }
    return {
        found, args, output,
    };
}

export type params = {
    error?: boolean,
    searchid?: string,
    user?: string,
    page?: number,
    maxPage?: number,
    mode?: apitypes.GameMode,
    userId?: string,
    mapId?: number,
    spotlight?: string | number,
    detailed?: number,
    filter?: string,
    list?: boolean, //recent
    fails?: number, //recent
    nochokes?: boolean, //top
    rankingtype?: apitypes.RankingType, //ranking
    country?: string, //ranking
    //scorelist AND ubm
    parse?: boolean,
    parseId?: number,
    filterTitle?: string,
    //scorelist
    sortScore?: "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss",
    reverse?: boolean,
    filterMapper?: string,
    filterMods?: string,
    filterRank?: apitypes.Rank,
    modsInclude?: string,
    modsExact?: string,
    modsExclude?: string,
    filterPp?: string,
    filterScore?: string,
    filterAcc?: string,
    filterCombo?: string,
    filterMiss?: string,
    filterBpm?: string,

    sort?: "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss" | bottypes.ubmSort,

    //map
    overrideSpeed?: number,
    overrideBpm?: number,
    ppCalc?: boolean,
    maptitleq?: string,

    //ubm
    sortMap?: bottypes.ubmSort,
    mapType?: bottypes.ubmFilter,
    //compare
    searchIdFirst?: string,
    searchIdSecond?: string,
    compareFirst?: string,
    compareSecond?: string,
    type?: string,
};

export function getButtonArgs(commandId: string | number) {
    if (fs.existsSync(`${helper.vars.path.main}/cache/params/${commandId}.json`)) {
        const x = fs.readFileSync(`${helper.vars.path.main}/cache/params/${commandId}.json`, 'utf-8');
        return JSON.parse(x) as params;
    }
    return {
        error: true
    };
}

export function storeButtonArgs(commandId: string | number, params: params) {
    if (params?.page < 1) {
        params.page = 1;
    }
    fs.writeFileSync(`${helper.vars.path.main}/cache/params/${commandId}.json`, JSON.stringify(params, null, 2));
}

export function buttonPage(page: number, max: number, button: bottypes.buttonType) {
    switch (button) {
        case 'BigLeftArrow':
            page = 1;
            break;
        case 'LeftArrow':
            page--;
            break;
        case 'RightArrow':
            page++;
            break;
        case 'BigRightArrow':
            page = max;
            break;
    }
    return page;
}

export function buttonDetail(level: number, button: bottypes.buttonType) {
    switch (button) {
        case 'Detail0':
            level = 0;
            break;
        case 'Detail1': case 'DetailDisable':
            level = 1;
            break;
        case 'Detail2': case 'DetailEnable':
            level = 2;
            break;
    }
    return level;
}

export async function pageButtons(command: string, commanduser: Discord.User | Discord.APIUser, commandId: string | number) {
    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-BigLeftArrow-${command}-${commanduser.id}-${commandId}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.page.first).setDisabled(false),
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-LeftArrow-${command}-${commanduser.id}-${commandId}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Search-${command}-${commanduser.id}-${commandId}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-RightArrow-${command}-${commanduser.id}-${commandId}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-BigRightArrow-${command}-${commanduser.id}-${commandId}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.page.last),
        );
    return pgbuttons;
}

export async function buttonsAddDetails(command: string, commanduser: Discord.User | Discord.APIUser, commandId: string | number, buttons: Discord.ActionRowBuilder, detailed: number,
    disabled?: {
        compact: boolean,
        compact_rem: boolean,
        detailed: boolean,
        detailed_rem: boolean,
    }
) {
    switch (detailed) {
        case 0: {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Detail1-${command}-${commanduser.id}-${commandId}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.main.detailMore),
            );
        }
            break;
        case 1: {
            const temp: Discord.RestOrArray<Discord.AnyComponentBuilder> = [];

            const set0 = new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Detail0-${command}-${commanduser.id}-${commandId}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.main.detailLess);
            const set2 = new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Detail2-${command}-${commanduser.id}-${commandId}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.main.detailMore);

            if (disabled) {
                if (disabled.compact == false) {
                    disabled.compact_rem ?
                        null :
                        temp.push(set0.setDisabled(true));
                } else {
                    temp.push(set0);
                }
                if (disabled.detailed == false) {
                    disabled.detailed_rem ?
                        null :
                        temp.push(set2.setDisabled(true));
                } else {
                    temp.push(set2);
                }
            } else {
                temp.push(set0, set2);
            }



            buttons.addComponents(temp);
        }
            break;
        case 2: {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Detail1-${command}-${commanduser.id}-${commandId}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.main.detailLess),
            );
        }
            break;
    }
    return { buttons };
}

/**
 * 
 * @param args 
 * @returns args with 0 length strings and args starting with the - prefix removed
 */
export function cleanArgs(args: string[]) {
    const newArgs: string[] = [];
    for (let i = 0; i < args.length; i++) {
        if (args[i] != '' && !args[i].startsWith('-')) {
            newArgs.push(args[i]);
        }
    }
    return newArgs;
}

export async function parseArgs_scoreList_message(input: bottypes.commandInput) {
    let commanduser: Discord.User | Discord.APIUser;

    let user;
    let page = 0;

    let scoredetailed: number = 1;

    let sort: "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss" = null;
    let reverse = false;
    let mode: apitypes.GameMode = 'osu';
    let modsInclude = null;
    let modsExact = null;
    let modsExclude = null;
    let filteredMapper = null;
    let filterTitle = null;
    let filterArtist = null;
    let filterDifficulty = null;

    let parseScore = false;
    let parseId = null;

    let pp = null;
    let score = null;
    let acc = null;
    let combo = null;
    let miss = null;
    let bpm = null;


    let filterRank: apitypes.Rank = null;

    const searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
    if (input.args.includes('-parse')) {
        parseScore = true;
        const temp = parseArg(input.args, '-parse', 'number', 1, null, true);
        parseId = temp.value;
        input.args = temp.newArgs;
    }

    const pageArgFinder = matchArgMultiple(helper.vars.argflags.pages, input.args, true, 'number', false, true);
    if (pageArgFinder.found) {
        page = pageArgFinder.output;
        input.args = pageArgFinder.args;
    }
    const detailArgFinder = matchArgMultiple(helper.vars.argflags.details, input.args, false, null, false, false);
    if (detailArgFinder.found) {
        scoredetailed = 2;
        input.args = detailArgFinder.args;
    }
    const lessDetailArgFinder = matchArgMultiple(helper.vars.argflags.compress, input.args, false, null, false, false);
    if (lessDetailArgFinder.found) {
        scoredetailed = 0;
        input.args = lessDetailArgFinder.args;
    }
    {
        const temp = await parseArgsMode(input);
        input.args = temp.args;
        mode = temp.mode;
    }
    const reverseArgFinder = matchArgMultiple(helper.vars.argflags.toFlag(['rev', 'reverse',]), input.args, false, null, false, false);
    if (reverseArgFinder.found) {
        reverse = true;
        input.args = reverseArgFinder.args;
    }
    if (input.args.includes('-mods')) {
        const temp = parseArg(input.args, '-mods', 'string', modsInclude, false);
        modsInclude = temp.value;
        input.args = temp.newArgs;
    }
    const mxmodArgFinder = matchArgMultiple(helper.vars.argflags.toFlag(['mx', 'modx',]), input.args, true, 'string', false, false);
    if (mxmodArgFinder.found) {
        modsExact = mxmodArgFinder.output;
        input.args = mxmodArgFinder.args;
    }
    if (input.args.includes('-exmod')) {
        const temp = parseArg(input.args, '-exmod', 'string', modsExclude, false);
        modsExclude = temp.value;
        input.args = temp.newArgs;
    }
    if (input.args.includes('-me')) {
        const temp = parseArg(input.args, '-me', 'string', modsExclude, false);
        modsExclude = temp.value;
        input.args = temp.newArgs;
    }
    const exmodArgFinder = matchArgMultiple(helper.vars.argflags.toFlag(['me', 'exmod',]), input.args, true, 'string', false, false);
    if (exmodArgFinder.found) {
        modsExclude = exmodArgFinder.output;
        input.args = exmodArgFinder.args;
    }

    if (input.args.includes('-sort')) {
        const temp = parseArg(input.args, '-sort', 'string', sort, false);
        sort = temp.value;
        input.args = temp.newArgs;
    }
    const recentArgFinder = matchArgMultiple(helper.vars.argflags.toFlag(['r', 'recent',]), input.args, false, null, false, false);
    if (recentArgFinder.found) {
        sort = 'recent';
        input.args = recentArgFinder.args;
    }
    if (input.args.includes('-performance')) {
        sort = 'pp';
        input.args.splice(input.args.indexOf('-performance'), 1);
    }
    if (input.args.includes('-pp')) {
        const temp = parseArg(input.args, '-pp', 'string', pp, false);
        pp = temp.value;
        input.args = temp.newArgs;
    }
    if (input.args.includes('-score')) {
        const temp = parseArg(input.args, '-score', 'string', score, false);
        score = temp.value;
        input.args = temp.newArgs;
    }
    if (input.args.includes('-acc')) {
        const temp = parseArg(input.args, '-acc', 'string', acc, false);
        acc = temp.value;
        input.args = temp.newArgs;
    }
    const filterComboArgFinder = matchArgMultiple(helper.vars.argflags.toFlag(['combo', 'maxcombo']), input.args, true, 'string', false, true);
    if (filterComboArgFinder.found) {
        combo = filterComboArgFinder.output;
        input.args = filterComboArgFinder.args;
    }
    const filterMissArgFinder = matchArgMultiple(helper.vars.argflags.toFlag(['miss', 'misses']), input.args, true, 'string', false, true);
    if (filterMissArgFinder.found) {
        miss = filterMissArgFinder.output;
        input.args = filterMissArgFinder.args;
    }
    const fcArgFinder = matchArgMultiple(helper.vars.argflags.toFlag(['fc', 'fullcombo',]), input.args, false, null, false, false);
    if (fcArgFinder.found) {
        miss = '0';
        input.args = fcArgFinder.args;
    }
    const filterRankArgFinder = matchArgMultiple(helper.vars.argflags.toFlag(['rank', 'grade', 'letter']), input.args, true, 'string', false, false);
    if (filterRankArgFinder.found) {
        filterRank = filterRankArgFinder.output;
        input.args = filterRankArgFinder.args;
    }
    if (input.args.includes('-bpm')) {
        const temp = parseArg(input.args, '-bpm', 'string', bpm, false);
        bpm = temp.value;
        input.args = temp.newArgs;
    }

    const titleArgFinder = matchArgMultiple(helper.vars.argflags.filterTitle, input.args, true, 'string', true, false);
    if (titleArgFinder.found) {
        filterTitle = titleArgFinder.output;
        input.args = titleArgFinder.args;
    }
    const mapperArgFinder = matchArgMultiple(helper.vars.argflags.filterCreator, input.args, true, 'string', true, false);
    if (mapperArgFinder.found) {
        filteredMapper = mapperArgFinder.output;
        input.args = mapperArgFinder.args;
    }
    const artistArgFinder = matchArgMultiple(helper.vars.argflags.filterArtist, input.args, true, 'string', true, false);
    if (artistArgFinder.found) {
        filterArtist = artistArgFinder.output;
        input.args = artistArgFinder.args;
    }
    const versionArgFinder = matchArgMultiple(helper.vars.argflags.filterVersion, input.args, true, 'string', true, false);
    if (versionArgFinder.found) {
        filterDifficulty = versionArgFinder.output;
        input.args = filterDifficulty.args;
    }
    input.args = cleanArgs(input.args);
    if (input.args.join(' ').includes('+')) {
        modsInclude = input.args.join(' ').split('+')[1];
        modsInclude.includes(' ') ? modsInclude = modsInclude.split(' ')[0] : null;
        input.args = input.args.join(' ').replace('+', '').replace(modsInclude, '').split(' ');
    }
    const usertemp = fetchUser(input.args);
    user = usertemp.id;
    if (usertemp.mode && !mode) {
        mode = usertemp.mode;
    }
    if (!user || user.includes(searchid)) {
        user = null;
    }
    return {
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, filterTitle, filterArtist, filterDifficulty, filterRank,
        parseScore, parseId,
        modsInclude, modsExact, modsExclude,
        pp, score, acc, combo, miss,
        bpm
    };
}

export async function parseArgs_scoreList_interaction(input: bottypes.commandInput) {
    let interaction = input.interaction as Discord.ChatInputCommandInteraction;

    const searchid = interaction?.member?.user ?? interaction?.user.id;

    const user = interaction.options.getString('user') ?? undefined;
    const page = interaction.options.getInteger('page') ?? 0;
    const scoredetailed = interaction.options.getBoolean('detailed') ? 1 : 0;
    const sort = interaction.options.getString('sort') as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
    const reverse = interaction.options.getBoolean('reverse') ?? false;
    const mode = (interaction.options.getString('mode') ?? 'osu') as apitypes.GameMode;
    const filteredMapper = interaction.options.getString('mapper') ?? null;
    const filterTitle = interaction.options.getString('filter') ?? null;
    const parseId = interaction.options.getInteger('parse') ?? null;
    const parseScore = parseId != null ? true : false;
    const modsInclude = interaction.options.getString('mods') ?? null;
    const modsExact = interaction.options.getString('modsExact') ?? null;
    const modsExclude = interaction.options.getString('modsExclude') ?? null;
    const filterRank = interaction.options.getString('filterRank') ? osumodcalc.checkGrade(interaction.options.getString('filterRank')) : null;
    const pp = interaction.options.getString('pp') ?? null;
    const score = interaction.options.getString('score') ?? null;
    const acc = interaction.options.getString('acc') ?? null;
    const combo = interaction.options.getString('combo') ?? null;
    const miss = interaction.options.getString('miss') ?? null;
    const bpm = interaction.options.getString('bpm') ?? null;
    return {
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, modsInclude, filterTitle, filterRank,
        modsExact, modsExclude,
        parseScore, parseId,
        pp, score, acc, combo, miss, bpm,
    };
}

export async function parseArgs_scoreList_button(input: bottypes.commandInput) {
    let scoredetailed: number = 1;
    if (!input.message.embeds[0]) {
        return;
    }

    const temp = getButtonArgs(input.id);
    const user = temp?.user;
    const searchid = temp?.searchid;
    let page = temp?.page;
    const mode = temp?.mode;
    const filteredMapper = temp?.filterMapper;
    const modsInclude = temp?.modsInclude;
    const modsExact = temp?.modsExact;
    const modsExclude = temp?.modsExclude;
    const filterTitle = temp?.filterTitle;
    const filterRank = temp?.filterRank;
    const parseId = null;
    const parseScore = null;
    const pp = temp?.filterPp;
    const score = temp?.filterScore;
    const acc = temp?.filterAcc;
    const combo = temp?.filterCombo;
    const miss = temp?.filterMiss;
    const bpm = temp?.filterBpm;
    const sort = temp?.sort;
    const reverse = temp?.reverse;

    switch (input.buttonType) {
        case 'BigLeftArrow':
            page = 1;
            break;
        case 'LeftArrow':
            page -= 1;
            break;
        case 'RightArrow':
            page += 1;
            break;
        case 'BigRightArrow':
            page = temp?.maxPage ?? page;
            break;
    }

    switch (input.buttonType) {
        case 'Detail0':
            scoredetailed = 0;
            break;
        case 'Detail1':
            scoredetailed = 1;
            break;
        case 'Detail2':
            scoredetailed = 2;
            break;
        default:
            if (input.message.embeds[0].footer.text.includes('LE')) {
                scoredetailed = 2;
            }
            if (input.message.embeds[0].footer.text.includes('LC')) {
                scoredetailed = 0;
            }
            break;
    }

    return {
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, modsInclude, filterTitle, filterRank,
        parseScore, parseId,
        modsExact, modsExclude, pp, score, acc, combo, miss, bpm
    };
}

export async function parseArgs_scoreList(input: bottypes.commandInput) {
    let commanduser: Discord.User | Discord.APIUser;

    let user;
    let searchid;
    let page = 0;

    let scoredetailed: number = 1;

    let sort: "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss" = null;
    let reverse = false;
    let mode: apitypes.GameMode = 'osu';

    let filterTitle = null;
    let filterArtist = null;
    let filterDifficulty = null;
    let filteredMapper = null;
    let filterRank: apitypes.Rank = null;

    let parseScore = false;
    let parseId = null;


    let modsInclude = null;
    let modsExact = null;
    let modsExclude = null;

    let pp = null;
    let score = null;
    let acc = null;
    let combo = null;
    let miss = null;
    let bpm = null;
    const error = false;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
            const temp = await parseArgs_scoreList_message(input);
            user = temp.user;
            searchid = temp.searchid;
            page = temp.page;
            scoredetailed = temp.scoredetailed;
            sort = temp.sort;
            reverse = temp.reverse;
            mode = temp.mode;
            filteredMapper = temp.filteredMapper;
            modsInclude = temp.modsInclude;
            filterTitle = temp.filterTitle;
            filterArtist = temp.filterArtist;
            filterDifficulty = temp.filterDifficulty;
            parseScore = temp.parseScore;
            parseId = temp.parseId;
            filterRank = temp.filterRank;
            modsExact = temp.modsExact;
            modsExclude = temp.modsExclude;
            pp = temp.pp;
            score = temp.score;
            acc = temp.acc;
            combo = temp.combo;
            miss = temp.miss;
            bpm = temp.bpm;
        }
            break;
        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
            const temp = await parseArgs_scoreList_interaction(input);
            user = temp.user;
            searchid = temp.searchid;
            page = temp.page;
            scoredetailed = temp.scoredetailed;
            sort = temp.sort;
            reverse = temp.reverse;
            mode = temp.mode;
            filteredMapper = temp.filteredMapper;
            modsInclude = temp.modsInclude;
            filterTitle = temp.filterTitle;
            parseScore = temp.parseScore;
            parseId = temp.parseId;
            filterRank = temp.filterRank;
            modsExact = temp.modsExact;
            modsExclude = temp.modsExclude;
            pp = temp.pp;
            score = temp.score;
            acc = temp.acc;
            combo = temp.combo;
            miss = temp.miss;
            bpm = temp.bpm;
        }
            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = input.interaction?.member?.user ?? input.interaction?.user;
            let scoredetailed: number = 1;
            const temp = getButtonArgs(input.id);
            user = temp?.user;
            searchid = temp?.searchid;
            page = temp?.page;
            mode = temp?.mode;
            filteredMapper = temp?.filterMapper;
            modsInclude = temp?.modsInclude;
            modsExact = temp?.modsExact;
            modsExclude = temp?.modsExclude;
            filterTitle = temp?.filterTitle;
            filterRank = temp?.filterRank;
            parseId = null;
            parseScore = null;
            pp = temp?.filterPp;
            score = temp?.filterScore;
            acc = temp?.filterAcc;
            combo = temp?.filterCombo;
            miss = temp?.filterMiss;
            bpm = temp?.filterBpm;
            sort = temp?.sort as any;
            reverse = temp?.reverse;

            switch (input.buttonType) {
                case 'BigLeftArrow':
                    page = 1;
                    break;
                case 'LeftArrow':
                    page -= 1;
                    break;
                case 'RightArrow':
                    page += 1;
                    break;
                case 'BigRightArrow':
                    page = temp?.maxPage ?? page;
                    break;
            }

            switch (input.buttonType) {
                case 'Detail0':
                    scoredetailed = 0;
                    break;
                case 'Detail1':
                    scoredetailed = 1;
                    break;
                case 'Detail2':
                    scoredetailed = 2;
                    break;
                default:
                    if (input.message.embeds[0].footer.text.includes('LE')) {
                        scoredetailed = 2;
                    }
                    if (input.message.embeds[0].footer.text.includes('LC')) {
                        scoredetailed = 0;
                    }
                    break;
            }
        }
            break;
    }

    return {
        commanduser,
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, filterTitle, filterArtist, filterDifficulty, filterRank,
        parseScore, parseId,
        modsInclude, modsExact, modsExclude,
        pp, score, acc, combo, miss,
        bpm, error
    };
}

export async function parseArgsMode(input: bottypes.commandInput) {
    let mode: apitypes.GameMode;
    const otemp = matchArgMultiple(['-o', '-osu'], input.args, false, null, false, false);
    if (otemp.found) {
        mode = 'osu';
        input.args = otemp.args;
    }
    const ttemp = matchArgMultiple(['-t', '-taiko'], input.args, false, null, false, false);
    if (ttemp.found) {
        mode = 'taiko';
        input.args = ttemp.args;
    }
    const ftemp = matchArgMultiple(['-f', '-fruits', '-ctb', '-catch'], input.args, false, null, false, false);
    if (ftemp.found) {
        mode = 'fruits';
        input.args = ftemp.args;
    }
    const mtemp = matchArgMultiple(['-m', '-mania'], input.args, false, null, false, false);
    if (mtemp.found) {
        mode = 'mania';
        input.args = mtemp.args;
    }
    return {
        args: input.args,
        mode
    };
}

export function getCmdId() {
    helper.vars.id++;
    return helper.vars.id;
}

export function startType(object: Discord.Message | Discord.Interaction) {
    try {
        (object.channel as Discord.GuildTextBasedChannel).sendTyping();
        setTimeout(() => {
            return;
        }, 1000);
    } catch (error) {

    }
}

export async function missingPrevID_map(input: bottypes.commandInput, name: string) {
    if (input.type != 'button' && input.type != 'link') {
        await sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: helper.vars.errors.uErr.osu.map.m_msp,
                edit: true
            }
        }, input.canReply);
    }
    helper.tools.log.commandErr(
        helper.vars.errors.uErr.osu.map.m_msp,
        input.id,
        name,
        input.message,
        input.interaction
    );
    return;
}

export function disableAllButtons(msg: Discord.Message) {
    let components: Discord.ActionRowBuilder<any>[] = [];
    for (const actionrow of msg.components) {
        let newActionRow = new Discord.ActionRowBuilder();
        // @ts-expect-error TS2339: Property 'components' does not exist on type 'FileComponent'.
        for (let button of actionrow.components) {
            let newbutton: Discord.ButtonBuilder
                | Discord.StringSelectMenuBuilder
                | Discord.UserSelectMenuBuilder
                | Discord.RoleSelectMenuBuilder
                | Discord.MentionableSelectMenuBuilder
                | Discord.ChannelSelectMenuBuilder;
            switch (button.type) {
                case Discord.ComponentType.Button: {
                    newbutton = Discord.ButtonBuilder.from(button);
                }
                    break;
                case Discord.ComponentType.StringSelect: {
                    newbutton = Discord.StringSelectMenuBuilder.from(button);
                }
                    break;
                case Discord.ComponentType.UserSelect: {
                    newbutton = Discord.UserSelectMenuBuilder.from(button);
                }
                    break;
                case Discord.ComponentType.RoleSelect: {
                    newbutton = Discord.RoleSelectMenuBuilder.from(button);
                }
                    break;
                case Discord.ComponentType.MentionableSelect: {
                    newbutton = Discord.MentionableSelectMenuBuilder.from(button);
                }
                    break;
                case Discord.ComponentType.ChannelSelect: {
                    newbutton = Discord.ChannelSelectMenuBuilder.from(button);
                }
                    break;
            }
            newbutton.setDisabled();
            newActionRow.addComponents(newbutton);
        }

        components.push(newActionRow);
    }
    msg.edit({
        components,
        allowedMentions: { repliedUser: false }
    });
}

export function getCommand(query: string): bottypes.commandInfo {
    return helper.vars.commandData.cmds.find(
        x => x.aliases.concat([x.name]).includes(query)
    );


}

export function getCommands(query?: string): bottypes.commandInfo[] {
    return helper.vars.commandData.cmds.filter(
        x => x.category.includes(query)
    ) ?? helper.vars.commandData.cmds;
}