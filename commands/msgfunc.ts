//for parsing args and sending messages

import * as Discord from 'discord.js';
import * as fs from 'fs';
import { path } from '../path.js';
import * as flags from '../src/consts/argflags.js';
import * as buttonsthing from '../src/consts/buttons.js';
import * as errors from '../src/consts/errors.js';
import * as mainconst from '../src/consts/main.js';
import * as embedStuff from '../src/embed.js';
import * as func from '../src/func.js';
import * as log from '../src/log.js';
import * as osufunc from '../src/osufunc.js';
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
                        ((input.obj as Discord.Message<any>).channel as Discord.GuildTextBasedChannel).send({
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
    let mode: osuApiTypes.GameMode = 'osu';
    let filteredMapper = null;
    let filteredMods = null;
    let exactMods = null;
    let excludeMods = null;
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

    const pageArgFinder = matchArgMultiple(flags.pages, input.args, true);
    if (pageArgFinder.found) {
        page = pageArgFinder.output;
        input.args = pageArgFinder.args;
    }
    const detailArgFinder = matchArgMultiple(flags.details, input.args);
    if (detailArgFinder.found) {
        scoredetailed = 2;
        input.args = detailArgFinder.args;
    }
    const lessDetailArgFinder = matchArgMultiple(flags.compress, input.args);
    if (lessDetailArgFinder.found) {
        scoredetailed = 0;
        input.args = lessDetailArgFinder.args;
    }
    {
        const temp = await parseArgsMode(input);
        input.args = temp.args;
        mode = temp.mode;
    }
    const reverseArgFinder = matchArgMultiple(flags.toFlag(['rev', 'reverse',]), input.args);
    if (reverseArgFinder.found) {
        reverse = true;
        input.args = reverseArgFinder.args;
    }
    if (input.args.includes('-mods')) {
        const temp = func.parseArg(input.args, '-mods', 'string', filteredMods, false);
        filteredMods = temp.value;
        input.args = temp.newArgs;
    }
    const mxmodArgFinder = matchArgMultiple(flags.toFlag(['mx', 'modx',]), input.args, true, 'string');
    if (mxmodArgFinder.found) {
        exactMods = mxmodArgFinder.output;
        input.args = mxmodArgFinder.args;
    }
    if (input.args.includes('-exmod')) {
        const temp = func.parseArg(input.args, '-exmod', 'string', excludeMods, false);
        excludeMods = temp.value;
        input.args = temp.newArgs;
    }
    if (input.args.includes('-me')) {
        const temp = func.parseArg(input.args, '-me', 'string', excludeMods, false);
        excludeMods = temp.value;
        input.args = temp.newArgs;
    }
    const exmodArgFinder = matchArgMultiple(flags.toFlag(['me', 'exmod',]), input.args, true, 'string');
    if (exmodArgFinder.found) {
        excludeMods = exmodArgFinder.output;
        input.args = exmodArgFinder.args;
    }
    if (input.args.includes('-mapper')) {
        const temp = func.parseArg(input.args, '-mapper', 'string', filteredMapper, true);
        filteredMapper = temp.value;
        input.args = temp.newArgs;
    }

    if (input.args.includes('-sort')) {
        const temp = func.parseArg(input.args, '-sort', 'string', sort, false);
        sort = temp.value;
        input.args = temp.newArgs;
    }
    const recentArgFinder = matchArgMultiple(flags.toFlag(['r', 'recent',]), input.args);
    if (recentArgFinder.found) {
        sort = 'recent';
        input.args = recentArgFinder.args;
    }
    if (input.args.includes('-performance')) {
        sort = 'pp';
        input.args.splice(input.args.indexOf('-performance'), 1);
    }
    if (input.args.includes('-pp')) {
        const temp = func.parseArg(input.args, '-pp', 'string', pp, false);
        pp = temp.value;
        input.args = temp.newArgs;
    }
    if (input.args.includes('-score')) {
        const temp = func.parseArg(input.args, '-score', 'string', score, false);
        score = temp.value;
        input.args = temp.newArgs;
    }
    if (input.args.includes('-acc')) {
        const temp = func.parseArg(input.args, '-acc', 'string', acc, false);
        acc = temp.value;
        input.args = temp.newArgs;
    }
    const filterComboArgFinder = matchArgMultiple(flags.toFlag(['combo', 'maxcombo']), input.args, true, 'string');
    if (filterComboArgFinder.found) {
        combo = filterComboArgFinder.output;
        input.args = filterComboArgFinder.args;
    }
    const filterMissArgFinder = matchArgMultiple(flags.toFlag(['miss', 'misses']), input.args, true, 'string');
    if (filterMissArgFinder.found) {
        miss = filterMissArgFinder.output;
        input.args = filterMissArgFinder.args;
    }
    const fcArgFinder = matchArgMultiple(flags.toFlag(['fc', 'fullcombo',]), input.args);
    if (fcArgFinder.found) {
        miss = '0';
        input.args = fcArgFinder.args;
    }
    const filterRankArgFinder = matchArgMultiple(flags.toFlag(['rank', 'grade', 'letter']), input.args, true, 'string');
    if (filterRankArgFinder.found) {
        miss = filterRankArgFinder.output;
        input.args = filterRankArgFinder.args;
    }
    if (input.args.includes('-bpm')) {
        const temp = func.parseArg(input.args, '-bpm', 'string', bpm, false);
        bpm = temp.value;
        input.args = temp.newArgs;
    }

    if (input.args.includes('-?')) {
        const temp = func.parseArg(input.args, '-?', 'string', filterTitle, true);
        filterTitle = temp.value;
        input.args = temp.newArgs;
    }
    input.args = cleanArgs(input.args);
    if (input.args.join(' ').includes('+')) {
        filteredMods = input.args.join(' ').split('+')[1];
        filteredMods.includes(' ') ? filteredMods = filteredMods.split(' ')[0] : null;
        input.args = input.args.join(' ').replace('+', '').replace(filteredMods, '').split(' ');
    }
    const usertemp = fetchUser(input.args.join(' '));
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
        filteredMapper, filterTitle, filterRank,
        parseScore, parseId,
        filteredMods, exactMods, excludeMods,
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
    const mode = (input.obj.options.getString('mode') ?? 'osu') as osuApiTypes.GameMode;
    const filteredMapper = input.obj.options.getString('mapper') ?? null;
    const filterTitle = input.obj.options.getString('filter') ?? null;
    const parseId = input.obj.options.getInteger('parse') ?? null;
    const parseScore = parseId != null ? true : false;
    const filteredMods = input.obj.options.getString('mods') ?? null;
    const exactMods = input.obj.options.getString('exactmods') ?? null;
    const excludeMods = input.obj.options.getString('excludemods') ?? null;
    const filterRank = input.obj.options.getString('filterRank') ? osumodcalc.checkGrade(input.obj.options.getString('filterRank')) : null;

    return {
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, filteredMods, filterTitle, filterRank,
        exactMods, excludeMods,
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
    let excludeMods = null;
    let filterTitle = null;
    let filterRank: osuApiTypes.Rank = null;

    const parseScore = false;
    const parseId = null;
    let pp = null;
    let score = null;
    let acc = null;
    let combo = null;
    let miss = null;
    const bpm = null;
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
        if (input.obj.message.embeds[0].description.includes('exclude mods')) {
            excludeMods = input.obj.message.embeds[0].description.split('exclude mods: ')[1].split('\n')[0];
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
        exactMods, excludeMods, pp, score, acc, combo, miss, bpm
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
    let mode: osuApiTypes.GameMode = 'osu';

    let filteredMapper = null;
    let filterTitle = null;
    let filterRank: osuApiTypes.Rank = null;

    let parseScore = false;
    let parseId = null;


    let filteredMods = null;
    let exactMods = null;
    let excludeMods = null;

    let pp = null;
    let score = null;
    let acc = null;
    let combo = null;
    let miss = null;
    let bpm = null;
    let error = false;

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
            excludeMods = temp.excludeMods;
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
            exactMods = temp.exactMods;
            excludeMods = temp.excludeMods;
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
            const temp = getButtonArgs(input.absoluteID);
            if (temp.error) {
                input.obj.reply({
                    content: errors.paramFileMissing,
                    ephemeral: true,
                    allowedMentions: { repliedUser: false }
                });
                error = true;
            }
            user = temp.user;
            searchid = temp.searchid;
            page = buttonPage(temp.page, temp.maxPage, input.button);
            scoredetailed = buttonDetail(temp.detailed, input.button);
            sort = temp.sortScore;
            reverse = temp.reverse;
            mode = temp.mode;
            filteredMapper = temp.filterMapper;
            filterTitle = temp.filterTitle;
            filterRank = temp.filterRank;
            parseScore = temp.parse;
            parseId = temp.parseId;
            filteredMods = temp.modsInclude;
            exactMods = temp.modsExact;
            excludeMods = temp.modsExclude;
            pp = temp.filterPp;
            score = temp.filterScore;
            acc = temp.filterAcc;
            combo = temp.filterCombo;
            miss = temp.filterMiss;
            bpm = temp.filterBpm;
        }
            break;
    }

    return {
        commanduser,
        user, searchid, page, scoredetailed,
        sort, reverse, mode,
        filteredMapper, filterTitle, filterRank,
        parseScore, parseId,
        filteredMods, exactMods, excludeMods,
        pp, score, acc, combo, miss,
        bpm, error
    };
}

export async function parseArgsMode(input: extypes.commandInput) {
    let mode: osuApiTypes.GameMode = 'osu';
    const otemp = matchArgMultiple(['-o', '-osu'], input.args);
    if (otemp.found) {
        mode = 'osu';
        input.args = otemp.args;
    }
    const ttemp = matchArgMultiple(['-t', '-taiko'], input.args);
    if (ttemp.found) {
        mode = 'taiko';
        input.args = ttemp.args;
    }
    const ftemp = matchArgMultiple(['-f', '-fruits', '-ctb', '-catch'], input.args);
    if (ftemp.found) {
        mode = 'fruits';
        input.args = ftemp.args;
    }
    const mtemp = matchArgMultiple(['-m', '-mania'], input.args);
    if (mtemp.found) {
        mode = 'mania';
        input.args = mtemp.args;
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
    if ((noLinks && input.commandType != 'button' && input.commandType != 'link') || !noLinks) {
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

export function matchArgMultiple(argFlags: string[], inargs: string[], match?: boolean, matchType?: 'string' | 'number') {
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
            const temp = func.parseArg(inargs, matchedValue, matchType ?? 'number', null);
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

export function argRange(arg: string, forceAboveZero: boolean) {
    let max = NaN;
    let min = NaN;
    let exact = NaN;
    if (arg.includes('>')) {
        min = +arg.replace('>', '');
    }
    if (arg.includes('<')) {
        max = +arg.replace('<', '');
    }
    if (arg.includes('..')) {
        const arr = arg.split('..');
        const narr = arr.map(x => +x).filter(x => !isNaN(x)).sort((a, b) => +b - +a);
        if (narr.length = 2) {
            max = narr[0];
            min = narr[1];
        }
    }
    if (isNaN(max) && isNaN(min)) {
        exact = +exact;
    }
    if (forceAboveZero) {
        return {
            max: max && max >= 0 ? max : Math.abs(max),
            min: min && min >= 0 ? min : Math.abs(min),
            exact: exact && exact >= 0 ? exact : Math.abs(exact),
        };
    }
    return {
        max,
        min,
        exact,
    };
}

export type params = {
    error?: boolean,
    searchid?: string,
    user?: string,
    page?: number,
    maxPage?: number,
    mode?: osuApiTypes.GameMode,
    userId?: string,
    mapId?: string,
    spotlight?: string,
    detailed?: number,
    filter?: string,
    list?: boolean, //recent
    fails?: number, //recent
    nochokes?: boolean, //top
    rankingtype?: osuApiTypes.RankingType, //ranking
    country?: string, //ranking
    //scorelist AND ubm
    parse?: boolean,
    parseId?: string,
    filterTitle?: string,
    //scorelist
    sortScore?: embedStuff.scoreSort,
    reverse?: boolean,
    filterMapper?: string,
    filterMods?: string,
    filterRank?: osuApiTypes.Rank,
    modsInclude?: string,
    modsExact?: string,
    modsExclude?: string,
    filterPp?: string,
    filterScore?: string,
    filterAcc?: string,
    filterCombo?: string,
    filterMiss?: string,
    filterBpm?: string,


    //map
    overrideSpeed?: number,
    overrideBpm?: number,
    ppCalc?: boolean,
    maptitleq?: string,

    //ubm
    sortMap?: extypes.ubmSort,
    mapType?: extypes.ubmFilter,
    //compare
    searchIdFirst?: string,
    searchIdSecond?: string,
    compareFirst?: string,
    compareSecond?: string,
    type?: string,
};

export function getButtonArgs(commandId: string | number) {
    if (fs.existsSync(`${path}/cache/params/${commandId}.json`)) {
        const x = fs.readFileSync(`${path}/cache/params/${commandId}.json`, 'utf-8');
        return JSON.parse(x) as params;
    }
    return {
        error: true
    };
}

export function storeButtonArgs(commandId: string | number, params: params) {
    fs.writeFileSync(`${path}/cache/params/${commandId}.json`, JSON.stringify(params, null, 2));
}

export function buttonPage(page: number, max: number, button: extypes.commandButtonTypes) {
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

export function buttonDetail(level: number, button: extypes.commandButtonTypes) {
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

/**
 * checks url for beatmap id. if url given is just a number, then map id is the number
 * @param url the url to check
 * @param callIfMapIdNull if only set id is found, then send an api request to fetch the map id
 */
export async function mapIdFromLink(url: string, callIfMapIdNull: boolean, config: extypes.config) {
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
        mode: osuApiTypes.GameMode,
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
                object.mode = modeTemp as osuApiTypes.GameMode;
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
                object.mode = modeTemp as osuApiTypes.GameMode;
            } else {
                object.mode = osumodcalc.ModeIntToName(+modeTemp);
            }
            object.map = +url.split('#')[1].split('/')[1];
        } break;
        case url.includes('/s/') && url.includes('#'): {
            object.set = +url.split('/s/')[1].split('#')[0];
            const modeTemp = url.split('#')[1].split('/')[0];
            if (isNaN(+modeTemp)) {
                object.mode = modeTemp as osuApiTypes.GameMode;
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
    if (callIfMapIdNull && object.map == null && object.set) {
        const bmsdataReq = await osufunc.apiget({
            type: 'mapset_get',
            params: {
                id: object.set
            },
            config
        });
        object.map = (bmsdataReq.apiData as osuApiTypes.Beatmapset)?.beatmaps?.[0]?.id ?? null;
    }
    return object;
}

export function fetchUser(url: string) {
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
        mode: osuApiTypes.GameMode,
    } = {
        id: null,
        mode: null,
    };
    /**
     * patterns:
     * osu.ppy.sh/u/{id}
     * osu.ppy.sh/users/{id}
     * osu.ppy.sh/users/{id}/{mode}
     * "{username}"
     * {username}
     */
    switch (true) {
        case url.includes('osu.ppy.sh'):
            switch (true) {
                case url.includes('/u/'):
                    object.id = url.split('/u/')[1];
                    break;
                case url.includes('/users/'):
                    object.id = url.split('/users/')[1];
                    if (url.split('/users/')[1].includes('/')) {
                        object.id = url.split('/users/')[1].split('/')[0];
                        object.mode = (url.split('/users/')[1].split('/')[1]) as osuApiTypes.GameMode;
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