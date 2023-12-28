import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as buttonsthing from '../src/consts/buttons.js';
import * as errors from '../src/consts/errors.js';
import * as mainconst from '../src/consts/main.js';
import * as embedStuff from '../src/embed.js';
import * as func from '../src/func.js';
import * as log from '../src/log.js';
import * as osumodcalc from '../src/osumodcalc.js';
import * as extypes from '../src/types/extratypes.js';
import * as osuApiTypes from '../src/types/osuApiTypes.js';


export async function sendMessage(input: {
    commandType: extypes.commandType,
    obj: extypes.commandObject,
    args: {
        content?: string,
        embeds?: Discord.EmbedBuilder[] | Discord.Embed[],
        files?: string[] | Discord.AttachmentBuilder[] | Discord.Attachment[],
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
        if (input.args.react == true) {
            switch (input.commandType) {
                case 'message': {
                    (input.obj as Discord.Message<any>).react('✅')
                        .catch();
                }
                    break;

                //==============================================================================================================================================================================================

                case 'interaction': {
                    (input.obj as Discord.CommandInteraction).reply({
                        content: '✅',
                        ephemeral: true,
                        allowedMentions: { repliedUser: false },
                    })
                        .catch();
                }

                    //==============================================================================================================================================================================================

                    break;
                case 'button': {
                    (input.obj as Discord.ButtonInteraction).message.react('✅')
                        .catch();
                }
                    break;
            }
        } else {
            switch (input.commandType) {
                case 'message': case 'link': {
                    if (!canReply) {
                        (input.obj as Discord.Message<any>).channel.send({
                            content: `${input.args.content ?? ''}`,
                            embeds: input.args.embeds ?? [],
                            files: input.args.files ?? [],
                            components: input.args.components ?? [],
                        })
                            .catch(x => console.log(x));
                    } else if (input.args.editAsMsg) {
                        try {
                            (input.obj as Discord.Message<any>).edit({
                                content: `${input.args.content ?? ''}`,
                                embeds: input.args.embeds ?? [],
                                files: input.args.files ?? [],
                                components: input.args.components ?? [],
                            });
                        } catch (err) {

                        }
                    } else {
                        (input.obj as Discord.Message<any>).reply({
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

                //==============================================================================================================================================================================================

                case 'interaction': {
                    if (input.args.edit == true) {
                        setTimeout(() => {
                            (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                                content: `${input.args.content ?? ''}`,
                                embeds: input.args.embeds ?? [],
                                files: input.args.files ?? [],
                                components: input.args.components ?? [],
                                allowedMentions: { repliedUser: false },
                            })
                                .catch();
                        }, 1000);
                    } else {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                            content: `${input.args.content ?? ''}`,
                            embeds: input.args.embeds ?? [],
                            files: input.args.files ?? [],
                            components: input.args.components ?? [],
                            allowedMentions: { repliedUser: false },
                            ephemeral: input.args.ephemeral ?? false
                        })
                            .catch();
                    }
                }

                    //==============================================================================================================================================================================================

                    break;
                case 'button': {
                    (input.obj as Discord.ButtonInteraction).message.edit({
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
        }
    } catch (error) {
        log.errLog('message error', error);
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

export async function SendFileToChannel(channel: Discord.GuildTextBasedChannel, filePath: string) {
    let url = 'https://cdn.discordapp.com/attachments/762455063922737174/1039051414082691112/image.png';
    await new Promise(async (resolve, reject) => {

        if (!filePath.includes('/') || typeof channel == 'undefined' || !fs.existsSync(filePath)) {
            reject('invalid/null path');
        }

        channel.send({
            files: [filePath]
        }).then(message => {
            const attachment = filePath.split('/')[filePath.split('/').length - 1];
            url = message.attachments.at(0).url;
            resolve(1);
        });
    });
    return url;
}

//buttons
export async function pageButtons(command: string, commanduser: Discord.User, commandId: string | number) {
    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-BigLeftArrow-${command}-${commanduser.id}-${commandId}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first).setDisabled(false),
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-LeftArrow-${command}-${commanduser.id}-${commandId}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Search-${command}-${commanduser.id}-${commandId}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-RightArrow-${command}-${commanduser.id}-${commandId}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-BigRightArrow-${command}-${commanduser.id}-${commandId}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );
    return pgbuttons;
}

export async function buttonsAddDetails(command: string, commanduser: Discord.User, commandId: string | number, buttons: Discord.ActionRowBuilder, detailed: number, embedStyle: extypes.osuCmdStyle,
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
                    .setCustomId(`${mainconst.version}-Detail1-${command}-${commanduser.id}-${commandId}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.detailMore),
            );
            embedStyle = embedStyle.replaceAll('E', '').replaceAll('C', '') + 'C' as extypes.osuCmdStyle;
        }
            break;
        case 1: {
            const temp: Discord.RestOrArray<Discord.AnyComponentBuilder> = [];

            const set0 = new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Detail0-${command}-${commanduser.id}-${commandId}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailLess);
            const set2 = new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Detail2-${command}-${commanduser.id}-${commandId}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailMore);

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
            embedStyle = embedStyle.replaceAll('E', '').replaceAll('C', '') as extypes.osuCmdStyle;
        }
            break;
        case 2: {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-Detail1-${command}-${commanduser.id}-${commandId}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.detailLess),
            );
            embedStyle = embedStyle.replaceAll('E', '').replaceAll('C', '') + 'E' as extypes.osuCmdStyle;
        }
            break;
    }
    return { buttons, embedStyle };
}

//ARG HANDLING

export async function parseArgs_scoreList_message(input: extypes.commandInput) {
    let commanduser: Discord.User;

    let user;
    let page = 0;

    let scoredetailed: number = 1;

    let sort: embedStuff.scoreSort = null;
    let reverse = false;
    let mode = 'osu';
    let filteredMapper = null;
    let filteredMods = null;
    let exactMods = null;
    let filterTitle = null;

    let parseScore = false;
    let parseId = null;

    let pp = null;
    let score = null;
    let acc = null;
    let combo = null;
    let miss = null;
    let bpm = null;


    let filterRank: osuApiTypes.Rank = null;

    input.obj = input.obj as Discord.Message;

    const searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
    if (input.args.includes('-parse')) {
        parseScore = true;
        const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true);
        parseId = temp.value;
        input.args = temp.newArgs;
    }

    if (input.args.includes('-page')) {
        const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
        page = temp.value;
        input.args = temp.newArgs;
    }
    if (input.args.includes('-p')) {
        const temp = func.parseArg(input.args, '-p', 'number', page, null, true);
        page = temp.value;
        input.args = temp.newArgs;
    }

    if (input.args.includes('-detailed')) {
        scoredetailed = 2;
        input.args.splice(input.args.indexOf('-detailed'), 1);
    }
    if (input.args.includes('-d')) {
        scoredetailed = 2;
        input.args.splice(input.args.indexOf('-d'), 1);
    }
    if (input.args.includes('-compress')) {
        scoredetailed = 0;
        input.args.splice(input.args.indexOf('-compress'), 1);
    }
    if (input.args.includes('-c')) {
        scoredetailed = 0;
        input.args.splice(input.args.indexOf('-c'), 1);
    }
    {
        const temp = await parseArgsMode(input);
        input.args = temp.args;
        mode = temp.mode;
    }
    if (input.args.includes('-recent')) {
        sort = 'recent';
        input.args.splice(input.args.indexOf('-recent'), 1);
    }
    if (input.args.includes('-r')) {
        sort = 'recent';
        input.args.splice(input.args.indexOf('-r'), 1);
    }
    if (input.args.includes('-performance')) {
        sort = 'pp';
        input.args.splice(input.args.indexOf('-performance'), 1);
    }
    if (input.args.includes('-reverse')) {
        reverse = true;
        input.args.splice(input.args.indexOf('-reverse'), 1);
    }
    if (input.args.includes('-rev')) {
        reverse = true;
        input.args.splice(input.args.indexOf('-rev'), 1);
    }
    if (input.args.includes('-mods')) {
        const temp = func.parseArg(input.args, '-mods', 'string', filteredMods, false);
        filteredMods = temp.value;
        input.args.splice(input.args.indexOf('-mods'), 1);
    }
    if (input.args.includes('-modx')) {
        const temp = func.parseArg(input.args, '-modx', 'string', exactMods, false);
        exactMods = temp.value;
        input.args.splice(input.args.indexOf('-modx'), 1);
    }
    if (input.args.includes('-mx')) {
        const temp = func.parseArg(input.args, '-mx', 'string', exactMods, false);
        exactMods = temp.value;
        input.args.splice(input.args.indexOf('-mx'), 1);
    }
    if (input.args.includes('-mapper')) {
        const temp = func.parseArg(input.args, '-mapper', 'string', filteredMapper, true);
        filteredMapper = temp.value;
        input.args.splice(input.args.indexOf('-mapper'), 1);
    }
    if (input.args.includes('-sort')) {
        const temp = func.parseArg(input.args, '-sort', 'string', sort, false);
        sort = temp.value;
        input.args.splice(input.args.indexOf('-sort'), 1);
    }

    if (input.args.includes('-pp')) {
        const temp = func.parseArg(input.args, '-pp', 'string', pp, false);
        pp = temp.value;
        input.args.splice(input.args.indexOf('-pp'), 1);
    }
    if (input.args.includes('-score')) {
        const temp = func.parseArg(input.args, '-score', 'string', score, false);
        score = temp.value;
    }
    if (input.args.includes('-acc')) {
        const temp = func.parseArg(input.args, '-acc', 'string', acc, false);
        acc = temp.value;
    }
    if (input.args.includes('-combo')) {
        const temp = func.parseArg(input.args, '-combo', 'string', combo, false);
        combo = temp.value;
    }
    if (input.args.includes('-misses')) {
        const temp = func.parseArg(input.args, '-misses', 'string', miss, false);
        miss = temp.value;
    }
    if (input.args.includes('-miss')) {
        const temp = func.parseArg(input.args, '-miss', 'string', miss, false);
        miss = temp.value;
    }
    if (input.args.includes('-rank')) {
        const temp = func.parseArg(input.args, '-rank', 'string', filterRank, false);
        filterRank = osumodcalc.checkGrade(temp.value);
        input.args.splice(input.args.indexOf('-rank'), 1);
    }
    if (input.args.includes('-bpm')) {
        const temp = func.parseArg(input.args, '-bpm', 'string', bpm, false);
        bpm = temp.value;
    }
    if (input.args.includes('-grade')) {
        const temp = func.parseArg(input.args, '-grade', 'string', filterRank, false);
        filterRank = osumodcalc.checkGrade(temp.value);
        input.args = temp.newArgs;
    }

    if (input.args.includes('-?')) {
        const temp = func.parseArg(input.args, '-?', 'string', filterTitle, true);
        filterTitle = temp.value;
        input.args = temp.newArgs;
    }


    input.args = cleanArgs(input.args);

    user = input.args.join(' ');
    if (!input.args[0] || input.args.join(' ').includes(searchid)) {
        user = null;
    }
    return {
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, filterTitle, filterRank,
        parseScore, parseId,
        filteredMods, exactMods,
        pp, score, acc, combo, miss,
        bpm
    };
}

export async function parseArgs_scoreList_interaction(input: extypes.commandInput) {
    input.obj = (input.obj as Discord.ChatInputCommandInteraction);

    const searchid = input.obj.member.user.id;

    const user = input.obj.options.getString('user') ?? undefined;
    const page = input.obj.options.getInteger('page') ?? 0;
    const scoredetailed = input.obj.options.getBoolean('detailed') ? 1 : 0;
    const sort = input.obj.options.getString('sort') as embedStuff.scoreSort ?? null;
    const reverse = input.obj.options.getBoolean('reverse') ?? false;
    const mode = input.obj.options.getString('mode') ?? 'osu';
    const filteredMapper = input.obj.options.getString('mapper') ?? null;
    const filterTitle = input.obj.options.getString('filter') ?? null;
    const parseId = input.obj.options.getInteger('parse') ?? null;
    const parseScore = parseId != null ? true : false;
    const filteredMods = input.obj.options.getString('mods') ?? null;
    const filterRank = input.obj.options.getString('filterRank') ? osumodcalc.checkGrade(input.obj.options.getString('filterRank')) : null;

    return {
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, filteredMods, filterTitle, filterRank,
        parseScore, parseId,
    };
}

export async function parseArgs_scoreList_button(input: extypes.commandInput) {
    let page = 0;

    let scoredetailed: number = 1;

    let sort: embedStuff.scoreSort = null;
    let reverse = false;
    let mode = 'osu';

    let filteredMapper = null;
    let filteredMods = null;
    let exactMods = null;
    let filterTitle = null;
    let filterRank: osuApiTypes.Rank = null;

    const parseScore = false;
    const parseId = null;
    let pp = null;
    let score = null;
    let acc = null;
    let combo = null;
    let miss = null;
    let bpm = null;
    input.obj = (input.obj as Discord.ButtonInteraction);

    if (!input.obj.message.embeds[0]) {
        return;
    }
    const searchid = input.obj.member.user.id;

    const user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0];
    mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1];
    page = 0;

    if (input.obj.message.embeds[0].description) {
        if (input.obj.message.embeds[0].description.includes('mapper')) {
            filteredMapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
        }

        if (input.obj.message.embeds[0].description.includes('include mods')) {
            filteredMods = input.obj.message.embeds[0].description.split('include mods: ')[1].split('\n')[0];
        }

        if (input.obj.message.embeds[0].description.includes('exact mods')) {
            exactMods = input.obj.message.embeds[0].description.split('exact mods: ')[1].split('\n')[0];
        }

        if (input.obj.message.embeds[0].description.includes('map')) {
            filterTitle = input.obj.message.embeds[0].description.split('map: ')[1].split('\n')[0];
        }

        if (input.obj.message.embeds[0].description.includes('rank')) {
            filterRank = osumodcalc.checkGrade(input.obj.message.embeds[0].description.split('rank: ')[1].split('\n')[0]);
        }

        if (input.obj.message.embeds[0].description.includes('rank')) {
            filterRank = osumodcalc.checkGrade(input.obj.message.embeds[0].description.split('rank: ')[1].split('\n')[0]);
        }

        if (input.obj.message.embeds[0].description.includes('pp:')) {
            pp = input.obj.message.embeds[0].description.split('pp: ')[1].split('\n')[0];
        }
        if (input.obj.message.embeds[0].description.includes('score:')) {
            score = input.obj.message.embeds[0].description.split('score: ')[1].split('\n')[0];
        }
        if (input.obj.message.embeds[0].description.includes('acc:')) {
            acc = input.obj.message.embeds[0].description.split('acc: ')[1].split('\n')[0];
        }
        if (input.obj.message.embeds[0].description.includes('combo:')) {
            combo = input.obj.message.embeds[0].description.split('combo: ')[1].split('\n')[0];
        }
        if (input.obj.message.embeds[0].description.includes('miss:')) {
            miss = input.obj.message.embeds[0].description.split('miss: ')[1].split('\n')[0];
        }


        const sort1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0];
        switch (true) {
            case sort1.includes('score'):
                sort = 'score';
                break;
            case sort1.includes('acc'):
                sort = 'acc';
                break;
            case sort1.includes('pp'):
                sort = 'pp';
                break;
            case sort1.includes('old'): case sort1.includes('recent'):
                sort = 'recent';
                break;
            case sort1.includes('combo'):
                sort = 'combo';
                break;
            case sort1.includes('miss'):
                sort = 'miss';
                break;
            case sort1.includes('rank'):
                sort = 'rank';
                break;

        }

        const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0];
        if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses'))) {
            reverse = true;
        } else {
            reverse = false;
        }

        const pageParsed = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[0]);
        page = 0;
        switch (input.button) {
            case 'BigLeftArrow':
                page = 1;
                break;
            case 'LeftArrow':
                page = pageParsed - 1;
                break;
            case 'RightArrow':
                page = pageParsed + 1;
                break;
            case 'BigRightArrow':

                page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0]);
                break;
            default:
                page = pageParsed;
                break;
        }
        switch (input.button) {
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
                if (input.obj.message.embeds[0].footer.text.includes('LE')) {
                    scoredetailed = 2;
                }
                if (input.obj.message.embeds[0].footer.text.includes('LC')) {
                    scoredetailed = 0;
                }
                break;
        }
    }

    return {
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, filteredMods, filterTitle, filterRank,
        parseScore, parseId,
        exactMods, pp, score, acc, combo, miss, bpm

    };
}

export async function parseArgs_scoreList(input: extypes.commandInput) {
    let commanduser: Discord.User;

    let user;
    let searchid;
    let page = 0;

    let scoredetailed: number = 1;

    let sort: embedStuff.scoreSort = null;
    let reverse = false;
    let mode = 'osu';

    let filteredMapper = null;
    let filteredMods = null;
    let filterTitle = null;
    let filterRank: osuApiTypes.Rank = null;

    let parseScore = false;
    let parseId = null;


    let exactMods = null;

    let pp = null;
    let score = null;
    let acc = null;
    let combo = null;
    let miss = null;
    let bpm = null;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            const temp = await parseArgs_scoreList_message(input);
            user = temp.user;
            searchid = temp.searchid;
            page = temp.page;
            scoredetailed = temp.scoredetailed;
            sort = temp.sort;
            reverse = temp.reverse;
            mode = temp.mode;
            filteredMapper = temp.filteredMapper;
            filteredMods = temp.filteredMods;
            filterTitle = temp.filterTitle;
            parseScore = temp.parseScore;
            parseId = temp.parseId;
            filterRank = temp.filterRank;
            exactMods = temp.exactMods;
            pp = temp.pp;
            score = temp.score;
            acc = temp.acc;
            combo = temp.combo;
            miss = temp.miss;
            bpm = temp.bpm;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = input.obj.member.user.id;
            const temp = await parseArgs_scoreList_interaction(input);
            user = temp.user;
            searchid = temp.searchid;
            page = temp.page;
            scoredetailed = temp.scoredetailed;
            sort = temp.sort;
            reverse = temp.reverse;
            mode = temp.mode;
            filteredMapper = temp.filteredMapper;
            filteredMods = temp.filteredMods;
            filterTitle = temp.filterTitle;
            parseScore = temp.parseScore;
            parseId = temp.parseId;
            filterRank = temp.filterRank;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);

            commanduser = input.obj.member.user;
            const temp = await parseArgs_scoreList_button(input);
            user = temp.user;
            searchid = temp.searchid;
            page = temp.page;
            scoredetailed = temp.scoredetailed;
            sort = temp.sort;
            reverse = temp.reverse;
            mode = temp.mode;
            filteredMapper = temp.filteredMapper;
            filteredMods = temp.filteredMods;
            filterTitle = temp.filterTitle;
            parseScore = temp.parseScore;
            parseId = temp.parseId;
            filterRank = temp.filterRank;
            exactMods = temp.exactMods;
            pp = temp.pp;
            score = temp.score;
            acc = temp.acc;
            combo = temp.combo;
            miss = temp.miss;
            bpm = temp.bpm;
        }
            break;
    }
    return {
        commanduser,
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, filterTitle, filterRank,
        parseScore, parseId,
        filteredMods, exactMods,
        pp, score, acc, combo, miss,
        bpm
    };
}

export async function parseArgsMode(input: extypes.commandInput) {
    let mode = null;
    if (input.args.includes('-osu')) {
        mode = 'osu';
        input.args.splice(input.args.indexOf('-osu'), 1);
    }
    if (input.args.includes('-o')) {
        mode = 'osu';
        input.args.splice(input.args.indexOf('-o'), 1);
    }
    if (input.args.includes('-taiko')) {
        mode = 'taiko';
        input.args.splice(input.args.indexOf('-taiko'), 1);
    }
    if (input.args.includes('-t')) {
        mode = 'taiko';
        input.args.splice(input.args.indexOf('-t'), 1);
    }
    if (input.args.includes('-catch')) {
        mode = 'fruits';
        input.args.splice(input.args.indexOf('-catch'), 1);
    }
    if (input.args.includes('-fruits')) {
        mode = 'fruits';
        input.args.splice(input.args.indexOf('-fruits'), 1);
    }
    if (input.args.includes('-ctb')) {
        mode = 'fruits';
        input.args.splice(input.args.indexOf('-ctb'), 1);
    }
    if (input.args.includes('-f')) {
        mode = 'fruits';
        input.args.splice(input.args.indexOf('-f'), 1);
    }
    if (input.args.includes('-mania')) {
        mode = 'mania';
        input.args.splice(input.args.indexOf('-mania'), 1);
    }
    if (input.args.includes('-m')) {
        mode = 'mania';
        input.args.splice(input.args.indexOf('-m'), 1);
    }
    return {
        args: input.args,
        mode
    };
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

export async function missingPrevID_map(input: extypes.commandInput) {
    if (input.commandType != 'button' && input.commandType != 'link') {
        await sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.osu.map.m_msp,
                edit: true
            }
        }, input.canReply);
    }
    log.logCommand({
        event: 'Error',
        commandName: 'scores',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
        customString: errors.uErr.osu.map.m_msp,
        config: input.config
    });
    return;
}

/**
 * @param noLinks ignore "button" and "link" command types
 * logs error, sends error to command user then promptly aborts the command
 */
export async function errorAndAbort(input: extypes.commandInput, commandName: string, interactionEdit: boolean, err: string, noLinks: boolean) {
    if (!err) {
        err = 'undefined error';
    }
    if((noLinks && input.commandType != 'button' && input.commandType != 'link') || !noLinks)
    {
        await sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: err,
                edit: interactionEdit
            }
        }, input.canReply);
    }
    log.logCommand({
        event: 'Error',
        commandName,
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
        customString: err,
        config: input.config
    });
    return;
}