import cmdchecks = require('../src/checks');
import fs = require('fs');
import calc = require('../src/calc');
import emojis = require('../src/consts/emojis');
import colours = require('../src/consts/colours');
import colourfunc = require('../src/colourcalc');
import osufunc = require('../src/osufunc');
import osumodcalc = require('../src/osumodcalc');
import osuApiTypes = require('../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../src/log');
import func = require('../src/tools');
import def = require('../src/consts/defaults');
import buttonsthing = require('../src/consts/buttons');
import extypes = require('../src/types/extraTypes');
import helpinfo = require('../src/consts/helpinfo');
import msgfunc = require('./msgfunc');
import embedStuff = require('../src/embed');
import replayparser = require('osureplayparser');
import trackfunc = require('../src/trackfunc');
import {
    CatchPerformanceAttributes,
    ManiaPerformanceAttributes, OsuPerformanceAttributes, PerformanceAttributes, TaikoPerformanceAttributes
} from 'rosu-pp';



export async function name(input: extypes.commandInput) {
}

//user stats

/**
 * badge weight seed
 */
export async function bws(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let user;
    let searchid;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

            input.args = cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.options.getString('user');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
        }
            break;
    }

    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('bws', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [{
            name: 'User',
            value: user
        }]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator('osu')) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator('osu'))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator('osu'))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator('osu')
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'bws', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                    })
                }, 1000);
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    let badgecount = 0;
    for (const badge of osudata.badges) {
        badgecount++
    }
    function bwsF(badgenum: number) {
        return badgenum > 0 ?
            osudata.statistics.global_rank ** (0.9937 ** (badgenum ** 2)) :
            osudata.statistics.global_rank

    }

    const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: `${osudata.username} (#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp)`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setTitle(`Badge weighting for ${osudata.username}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setDescription(
            'Current number of badges: ' + badgecount
        )
        .addFields([
            {
                name: `${badgecount == 1 ? badgecount + ' badge' : badgecount + ' badges'}`,
                value: `${Math.floor(bwsF(badgecount))}`,
                inline: true
            },
            {
                name: `${badgecount + 1 == 1 ? badgecount + 1 + ' badge' : badgecount + 1 + ' badges'}`,
                value: `${Math.floor(bwsF(badgecount + 1))}`,
                inline: true
            },
            {
                name: `${badgecount + 2} badges`,
                value: `${Math.floor(bwsF(badgecount + 2))}`,
                inline: true
            },
        ])
    //\nFormula: rank^(0.9937^badges^2)
    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed]
        }
    })
    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )
}

/**
 * number of #1 scores
 */
export async function globals(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user;
    let searchid;
    let page = 0;
    let mode = 'osu';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

            input.args = cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null
            }
            page = 0
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.options.getString('user');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.message.embeds[0].title.split('for ')[1]
            mode = cmdchecks.toAlphaNum(input.obj.message.embeds[0].description.split('\n')[1])
            page = 0;

        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page
        }
    }

    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('firsts', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Mode',
                value: mode
            },
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    const osudataReq: osufunc.apiReturn = await osufunc.apiget({
        type: 'user',
        params: {
            username: cmdchecks.toHexadecimal(user),
            mode: 'osu'
        }
    })
    const osudata: osuApiTypes.User = osudataReq.apiData;
    osufunc.debug(osudataReq, 'command', 'globals', input.obj.guildId, 'osuData');
    if (osudata?.error) {
        if (input.commandType != 'button') (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
            content: `User not found`,
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        }).catch()
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    if (!osudata.id) {
        return input.obj.channel.send('Error - no user found')
            .catch();

    }

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    const scorecount = osudata?.scores_first_count ?? 0;

    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            osufunc.logCall(error)
        }
    }
    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: `${user} has ${scorecount} #1 scores`
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * server leaderboards
 */
export async function lb(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let page = 0;
    let mode = 'osu';
    const guild = input.obj.guild;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            const gamemode = input.args[0];
            if (!input.args[0] || gamemode == 'osu' || gamemode == 'o' || gamemode == '0' || gamemode == 'standard' || gamemode == 'std') {
                mode = 'osu'
            }
            if (gamemode == 'taiko' || gamemode == 't' || gamemode == '1' || gamemode == 'drums') {
                mode = 'taiko'
            }
            if (gamemode == 'fruits' || gamemode == 'c' || gamemode == '2' || gamemode == 'catch' || gamemode == 'ctb') {
                mode = 'fruits'
            }
            if (gamemode == 'mania' || gamemode == 'm' || gamemode == '3' || gamemode == 'piano') {
                mode = 'mania'
            }
            input.args = cleanArgs(input.args);
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            const gamemode = input.obj.options.getString('mode');
            if (!gamemode || gamemode == 'osu' || gamemode == 'o' || gamemode == '0' || gamemode == 'standard' || gamemode == 'std') {
                mode = 'osu'
            }
            if (gamemode == 'taiko' || gamemode == 't' || gamemode == '1' || gamemode == 'drums') {
                mode = 'taiko'
            }
            if (gamemode == 'fruits' || gamemode == 'c' || gamemode == '2' || gamemode == 'catch' || gamemode == 'ctb') {
                mode = 'fruits'
            }
            if (gamemode == 'mania' || gamemode == 'm' || gamemode == '3' || gamemode == 'piano') {
                mode = 'mania'
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
        }
            break;
    }
    // if (input.overrides != null) {

    // }

    //==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-lb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-lb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-lb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-lb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-lb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );

    log.logFile(
        'command',
        log.commandLog('lb', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Mode',
                value: mode
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number') {
        page = 1;
    }
    page--

    const serverlb = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.userlist.dec)
        .setTitle(`server leaderboard for ${guild.name}`)
    const userids = await input.userdata.findAll();
    const useridsarraylen = await input.userdata.count();
    let rtxt = `\n`;
    const rarr = [];

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }


    for (let i = 0; i < useridsarraylen; i++) {
        const user: extypes.dbUser = userids[i].dataValues;

        guild.members.cache.forEach(async member => {
            if (`${member.id}` == `${user.userid}`) {
                if (user != null && !rtxt.includes(`${member.user.id}`)) {
                    let acc: string | number;
                    let pp: string | number;
                    let rank: string | number;
                    switch (mode) {
                        case 'osu':
                        default:
                            {
                                acc = user.osuacc
                                if (isNaN(acc) || acc == null) {
                                    acc = 'null '
                                } else {
                                    acc = user.osuacc.toFixed(2)
                                }
                                pp = user.osupp
                                if (isNaN(pp) || pp == null) {
                                    pp = 'null '
                                } else {
                                    pp = Math.floor(user.osupp)
                                }
                                rank = user.osurank;
                                if (isNaN(rank) || rank == null) {
                                    rank = 'null '
                                }
                                rarr.push(
                                    {
                                        discname:
                                            ((member.displayName.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.displayName.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.displayName.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' '),
                                        osuname:
                                            (user.osuname.padEnd(17 - 2, ' ')).length > 15 ? user.osuname.substring(0, 12) + '...' : user.osuname.padEnd(17 - 2, ' '),
                                        rank:
                                            rank.toString().padEnd(10 - 2, ' ').substring(0, 8),
                                        acc:
                                            acc.toString(),
                                        pp:
                                            (pp.toString() + 'pp').padEnd(9 - 2, ' '),
                                    }
                                )
                            }
                            break;
                        case 'taiko':
                            {
                                acc = user.taikoacc
                                if (isNaN(acc) || acc == null) {
                                    acc = 'null '
                                }
                                pp = user.taikopp
                                if (isNaN(pp) || pp == null) {
                                    pp = 'null '
                                }
                                rank = user.taikorank;
                                if (isNaN(rank) || rank == null) {
                                    rank = 'null '
                                }
                                rarr.push(
                                    {
                                        discname:
                                            ((member.displayName.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.displayName.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.displayName.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' '),
                                        osuname:
                                            (user.osuname.padEnd(17 - 2, ' ')).length > 15 ? user.osuname.substring(0, 12) + '...' : user.osuname.padEnd(17 - 2, ' '),
                                        rank:
                                            rank.toString().padEnd(10 - 2, ' ').substring(0, 8),
                                        acc:
                                            acc.toString(),
                                        pp:
                                            (pp.toString() + 'pp').padEnd(9 - 2, ' '),
                                    }
                                )
                            }
                            break;
                        case 'fruits':
                            {
                                acc = user.fruitsacc
                                if (isNaN(acc) || acc == null) {
                                    acc = 'null '
                                } else {
                                    acc = user.fruitsacc.toFixed(2)
                                }
                                pp = user.fruitspp
                                if (isNaN(pp) || pp == null) {
                                    pp = 'null '
                                } else {
                                    pp = Math.floor(user.fruitspp)
                                }
                                rank = user.fruitsrank;
                                if (isNaN(rank) || rank == null) {
                                    rank = 'null '
                                }
                                rarr.push(
                                    {
                                        discname:
                                            ((member.displayName.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.displayName.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.displayName.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' '),
                                        osuname:
                                            (user.osuname.padEnd(17 - 2, ' ')).length > 15 ? user.osuname.substring(0, 12) + '...' : user.osuname.padEnd(17 - 2, ' '),
                                        rank:
                                            rank.toString().padEnd(10 - 2, ' ').substring(0, 8),
                                        acc:
                                            acc.toString(),
                                        pp:
                                            (pp.toString() + 'pp').padEnd(9 - 2, ' '),
                                    }
                                )
                            }
                            break;
                        case 'mania':
                            {
                                acc = user.maniaacc
                                if (isNaN(acc) || acc == null) {
                                    acc = 'null '
                                } else {
                                    acc = user.maniaacc.toFixed(2)
                                }
                                pp = user.maniapp
                                if (isNaN(pp) || pp == null) {
                                    pp = 'null '
                                } else {
                                    pp = Math.floor(user.maniapp)
                                }
                                rank = user.maniarank;
                                if (isNaN(rank) || rank == null) {
                                    rank = 'null '
                                }
                                rarr.push(
                                    {
                                        discname:
                                            ((member.displayName.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.displayName.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.displayName.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' '),
                                        osuname:
                                            (user.osuname.padEnd(17 - 2, ' ')).length > 15 ? user.osuname.substring(0, 12) + '...' : user.osuname.padEnd(17 - 2, ' '),
                                        rank:
                                            rank.toString().padEnd(10 - 2, ' ').substring(0, 8),
                                        acc:
                                            acc.toString(),
                                        pp:
                                            (pp.toString() + 'pp').padEnd(9 - 2, ' '),
                                    }
                                )
                            }
                            break;
                    }
                }

            }
        })

    }

    // let iterator = 0;

    const another = rarr.slice().sort((b, a) => b.rank - a.rank) //for some reason this doesn't sort even tho it does in testing
    rtxt = `\`Rank    Discord           osu!              Rank       Acc      pp       `
    for (let i = 0; i < rarr.length && i < 10; i++) {
        if (!another[i]) break;
        rtxt += `\n#${i + 1 + ')'.padEnd(5, ' ')} ${another[i].discname}   ${another[i].osuname}   ${another[i].rank.toString().padEnd(10 - 2, ' ').substring(0, 8)}   ${another[i].acc}%   ${another[i].pp}  `
    }

    rtxt += `\n\``
    serverlb.setDescription(rtxt);
    serverlb.setFooter({ text: mode + ` | Page 1/${Math.ceil(rarr.length / 10)}` });
    const endofcommand = new Date().getTime();
    const timeelapsed = endofcommand - input.currentDate.getTime();

    if (page <= 1) {

        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (page + 1 >= Math.ceil(rarr.length / 10)) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [serverlb],
            components: [pgbuttons],
            edit: true
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * global leaderboards
 */
export async function ranking(input: extypes.commandInput & { statsCache: any }) {

    let commanduser: Discord.User;
    let country = 'ALL';
    let mode = 'osu';
    let type: osuApiTypes.RankingType = 'performance';
    let page = 0;
    let spotlight;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            input.args = cleanArgs(input.args);

            input.args[0] && input.args[0].length == 2 ? country = input.args[0].toUpperCase() : country = 'ALL';
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            input.obj.options.getString('country') ? country = input.obj.options.getString('country').toUpperCase() : country = 'ALL';
            input.obj.options.getString('mode') ? mode = input.obj.options.getString('mode').toLowerCase() : mode = 'osu';
            input.obj.options.getString('type') ? type = input.obj.options.getString('type').toLowerCase() as osuApiTypes.RankingType : type = 'performance';
            input.obj.options.getInteger('page') ? page = input.obj.options.getInteger('page') - 1 : page = 0;
            input.obj.options.getInteger('spotlight') ? spotlight = input.obj.options.getInteger('spotlight') : spotlight = undefined;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
            const pageParsed =
                parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0])
            page = pageParsed;
            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1
                    break;
                case 'LeftArrow':
                    page = pageParsed - 1
                    break;
                case 'RightArrow':
                    page = pageParsed + 1
                    break;
                case 'BigRightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])
                    break;
                default:
                    page = pageParsed
                    break;
            }
            let base: string = input.obj.message.embeds[0].title;
            if (base.includes('Global')) {
                base = base.split('Global ')[1];
            }
            if (base.includes('for ')) {
                base = base.split('for ')[0];
                input.obj.message.embeds[0].footer ? country = input.obj.message.embeds[0].footer.text.split('Country: ')[1] : country = 'ALL';
            }
            mode = base.split(' ')[0].toLowerCase().replaceAll('!', '');
            type = base.split(' ')[1].toLowerCase() as osuApiTypes.RankingType;
            if (type == 'charts') {
                spotlight = input.obj.message.embeds[0].description.split('\n')[1].split('?spotlight=')[1].split(')')[0];
            }
        }
            break;
    }
    if (input.overrides != null) {
        page = input.overrides.page ?? page;
    }

    mode = osufunc.modeValidator(mode);

    //==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-ranking-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-ranking-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-ranking-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-ranking-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-ranking-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );
    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-ranking-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        );

    log.logFile(
        'command',
        log.commandLog('ranking', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'country',
                value: country
            },
            {
                name: 'mode',
                value: mode
            },
            {
                name: 'type',
                value: type
            },
            {
                name: 'page',
                value: `${page}`
            },
            {
                name: 'spotlight',
                value: `${spotlight}`
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--

    let url = `rankings/${mode}/${type}`;
    if (country != 'ALL') {
        if (type == 'performance') {
            url += `?country=${country}`
        }
    }
    if (type == 'charts' && !isNaN(+spotlight)) {
        url += '?spotlight=' + spotlight;
    }

    let rankingdataReq: osufunc.apiReturn;
    if (func.findFile(input.absoluteID, 'rankingdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'rankingdata')) &&
        input.button != 'Refresh'
    ) {
        rankingdataReq = func.findFile(input.absoluteID, 'rankingdata')
    } else {
        rankingdataReq = (await osufunc.apiget({
            type: 'custom',
            params: {
                urlOverride: url
            },
            ignoreNonAlphaChar: true,
            version: 2
        }).catch(() => {
            if (country != 'ALL') {
                (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                    content: 'Invalid country code',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            } else {
                (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                    content: 'Error',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        })) as osufunc.apiReturn;
    }
    func.storeFile(rankingdataReq, input.absoluteID, 'rankingdata')

    const rankingdata: osuApiTypes.Rankings = rankingdataReq.apiData;

    if (rankingdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: 'Error - could not fetch rankings',
                        allowedMentions: { repliedUser: false },
                    }).catch()
                }, 1000)
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: 'Error - could not fetch rankings',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not fetch ranking data
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }


    try {
        osufunc.debug(rankingdataReq, 'command', 'ranking', input.obj.guildId, 'rankingData')
    } catch (e) {
        return;
    }
    if (rankingdata.ranking.length == 0) {

        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
            content: 'No data found',
            embeds: [],
            files: [],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        }).catch()
        return;
    }

    let ifchart = '';
    if (type == 'charts') {
        ifchart = `[${rankingdata.spotlight.name}](https://osu.ppy.sh/rankings/${mode}/charts?spotlight=${rankingdata.spotlight.id})`
    }

    if (country == 'ALL' && input.button == null) {
        osufunc.userStatsCache(rankingdata.ranking, input.statsCache, osufunc.modeValidator(mode))
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle(country != 'ALL' ?
            `${mode == 'osu' ? 'osu!' : calc.toCapital(mode)} ${calc.toCapital(type)} Rankings for ${country}` :
            `Global ${mode == 'osu' ? 'osu!' : calc.toCapital(mode)} ${calc.toCapital(type)} Ranking`)
        .setColor(colours.embedColour.userlist.dec)
        .setDescription(`Page: ${page + 1}/${Math.ceil(rankingdata.ranking.length / 5)}\n${ifchart}\n`);
    country != 'ALL' ?
        embed.setThumbnail(`https://osuflags.omkserver.nl${country}`)
            .setFooter({
                text: `Country: ${country}`
            })
        : '';

    if (page > Math.ceil(rankingdata.ranking.length / 5)) {
        page = Math.ceil(rankingdata.ranking.length / 5)
    }

    for (let i = 0; i < 5 && i + (page * 5) < rankingdata.ranking.length; i++) {
        const curuser = rankingdata.ranking[i + (page * 5)];
        if (!curuser) break;
        embed.addFields(
            [
                {
                    name: `${i + 1 + (page * 5)}`,
                    value:
                        `:flag_${curuser.user.country_code.toLowerCase()}: [${curuser.user.username}](https://osu.ppy.sh/u/${curuser.user.id}/${mode})
#${curuser.global_rank == null ?
                            '---' :
                            func.separateNum(curuser.global_rank)
                        }
Score: ${curuser.total_score == null ? '---' : func.numToLetter(curuser.total_score)} (${curuser.ranked_score == null ? '---' : func.numToLetter(curuser.ranked_score)} ranked)
${curuser.hit_accuracy == null ? '---' : curuser.hit_accuracy.toFixed(2)}% | ${curuser.pp == null ? '---' : func.separateNum(curuser.pp)}pp | ${curuser.play_count == null ? '---' : func.separateNum(curuser.play_count)} plays
`
                    ,
                    inline: false
                }
            ]
        )
    }
    if (page + 1 >= Math.ceil(rankingdata.ranking.length / 5)) {

        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);

        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    if (page == 0) {

        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);

        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
            components: [pgbuttons, buttons]
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * estimate rank from pp or vice versa
 */
export async function rankpp(input: extypes.commandInput & { statsCache: any }) {

    let commanduser: Discord.User;

    let type: string = 'rank';
    let value;
    let mode: osuApiTypes.GameMode = 'osu';
    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            input.args = cleanArgs(input.args);

            value = input.args[0] ?? 100;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            value = input.obj.options.getInteger('value') ?? 100;
            mode = input.obj.options.getString('mode') as osuApiTypes.GameMode ?? 'osu';
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
    }
    if (input.overrides != null) {
        type = input?.overrides?.type ?? 'pp';
    }
    //==============================================================================================================================================================================================


    log.logFile(
        'command',
        log.commandLog('rankpp', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Value',
                value: `${value}`
            },
            {
                name: 'Mode',
                value: `${mode}`
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const Embed = new Discord.EmbedBuilder()
        .setTitle('null')
        .setDescription('null')

    let returnval: string | number;

    switch (type) {
        case 'pp': {
            returnval = await osufunc.getRankPerformance('pp->rank', value, input.userdata, mode, input.statsCache);
            if (typeof returnval == 'number') {
                returnval = 'approx. rank #' + func.separateNum(Math.ceil(returnval))
            } else {
                returnval = 'null'
            }
            Embed
                .setTitle(`Approximate rank for ${value}pp`)
        }
            break;
        case 'rank': {

            returnval = await osufunc.getRankPerformance('rank->pp', value, input.userdata, mode, input.statsCache);

            if (typeof returnval == 'number') {
                returnval = 'approx. ' + func.separateNum(returnval) + 'pp'
            } else {
                returnval = 'null'
            }

            Embed
                .setTitle(`Approximate performance for rank #${value}`)
        }
            break;
    }
    Embed
        .setDescription(`${returnval}\n${emojis.gamemodes[mode]}`)


    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embed]
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * return osu! profile
 */
export async function osu(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user = null;
    let mode = null;
    let graphonly = false;
    let detailed;
    let searchid;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-details')) {
                detailed = true;
                input.args.splice(input.args.indexOf('-details'), 1);
            }
            if (input.args.includes('-detailed')) {
                detailed = true;
                input.args.splice(input.args.indexOf('-detailed'), 1);
            }
            if (input.args.includes('-detail')) {
                detailed = true;
                input.args.splice(input.args.indexOf('-detail'), 1);
            }
            if (input.args.includes('-d')) {
                detailed = true;
                input.args.splice(input.args.indexOf('-d'), 1);
            }
            if (input.args.includes('-graph')) {
                graphonly = true;
                input.args.splice(input.args.indexOf('-graph'), 1);
            }
            if (input.args.includes('-g')) {
                graphonly = true;
                input.args.splice(input.args.indexOf('-g'), 1);
            }

            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            input.args = cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = input.obj.member.user.id;

            user = input.obj.options.getString('user');
            detailed = input.obj.options.getBoolean('detailed');
            mode = input.obj.options.getString('mode');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            if (input.obj.message.embeds[0].fields[0]) {
                detailed = true
            }
            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]
            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]

            if (input.button == 'DetailEnable') {
                detailed = true;
            }
            if (input.button == 'DetailDisable') {
                detailed = false;
            }
            if (input.button == 'Refresh') {
                if (input.obj.message.embeds[0].fields[0]) {
                    detailed = true
                } else {
                    detailed = false
                }
            }

            if (!input.obj.message.embeds[0].title) {
                graphonly = true
            }
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;

            const msgnohttp: string = input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '')

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            user = msgnohttp.includes(' ') ? msgnohttp.split('/')[2].split(' ')[0] : msgnohttp.split('/')[2]
            mode = msgnohttp.includes(' ') ?
                msgnohttp.split('/')[3] ?
                    msgnohttp.split('/')[3] : null
                :
                msgnohttp.split('/')[3] ?
                    msgnohttp.split('/')[3] : null
            //u
        }
    }

    //==============================================================================================================================================================================================

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-osu-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        )

    log.logFile(
        'command',
        log.commandLog('osu', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(
            input.absoluteID,
            [{
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Detailed',
                value: detailed
            },
            {
                name: 'Gamemode',
                value: mode
            },
            {
                name: 'Graph',
                value: `${graphonly}`
            }
            ]
        ), {
        guildId: `${input.obj.guildId}`
    }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (detailed == true) {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`DetailDisable-osu-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailed)
        )
    } else {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`DetailEnable-osu-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailed)
        )
    }

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = mode ? osufunc.modeValidator(mode) : null;

    if (input.commandType == 'interaction') {

        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        })
    }

    let osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                    })
                }, 1000);
            } else {

                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    //check for player's default mode if mode is null
    if ((

        (input.commandType == 'interaction' && !(input.obj as Discord.ChatInputCommandInteraction<any>)?.options?.getString('mode'))
        || input.commandType == 'message' || input.commandType == 'link'
    ) &&
        osudata.playmode != 'osu' &&
        typeof mode != 'undefined') {
        mode = osudata.playmode
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        })
        osudata = osudataReq.apiData;
        osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');
    } else {
        mode = mode ?? 'osu'
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode))
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode))

    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            osufunc.logCall(error)
        }
    }

    const osustats = osudata.statistics;
    const grades = osustats.grade_counts;

    const playerrank =
        osudata.statistics.global_rank ?
            func.separateNum(osudata.statistics.global_rank) :
            '---';
    const countryrank =
        osudata.statistics.country_rank ?
            func.separateNum(osudata.statistics.country_rank) :
            '---';

    const rankglobal = ` ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)`

    const peakRank = osudata?.rank_highest.rank ?
        `\n**Peak Rank**: #${func.separateNum(osudata.rank_highest.rank)} (#${'---'} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)` :
        '';

    const onlinestatus = osudata.is_online == true ?
        `**${emojis.onlinestatus.online} Online**` :
        `**${emojis.onlinestatus.offline} Offline** | Last online <t:${(new Date(osudata.last_visit)).getTime() / 1000}:R>`

    const prevnames = osudata.previous_usernames.length > 0 ?
        '**Previous Usernames:** ' + osudata.previous_usernames.join(', ') :
        ''
        ;

    const playcount = osustats.play_count == null ?
        '---' :
        func.separateNum(osustats.play_count);

    const lvl = osustats.level.current != null ?
        osustats.level.progress != null && osustats.level.progress > 0 ?
            `${osustats.level.current}.${Math.floor(osustats.level.progress)}` :
            `${osustats.level.current}` :
        '---'

    const osuEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.user.dec)
        .setTitle(`${osudata.username}'s ${mode ?? 'osu!'} profile`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)

    let useEmbeds = [];
    if (graphonly == true) {
        const dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',')
        const datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',')

        const chartplay = await msgfunc.SendFileToChannel(input.graphChannel, await osufunc.graph(dataplay, osudata.monthly_playcounts.map(x => x.count), 'Playcount graph', false, false, true, true, true, null, true));
        const chartrank = await msgfunc.SendFileToChannel(input.graphChannel, await osufunc.graph(datarank, osudata.rank_history.data, 'Rank graph', null, null, null, null, null, 'rank', true));

        const ChartsEmbedRank = new Discord.EmbedBuilder()
            .setTitle(`${osudata.username}`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
            .setImage(`${chartrank}`);

        const ChartsEmbedPlay = new Discord.EmbedBuilder()
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
            .setImage(`${chartplay}`);

        useEmbeds.push(ChartsEmbedRank, ChartsEmbedPlay);
    } else {
        if (detailed == true) {
            const loading = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.user.dec)
                .setTitle(`${osudata.username}'s ${mode ?? 'osu!'} profile`)
                .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
                .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
                .setDescription(`Loading...`);

            if (input.commandType != 'button') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {

                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            embeds: [loading],
                            allowedMentions: { repliedUser: false },
                        })
                            .catch();
                    }, 1000);
                }
            }
            const dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',')
            const datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',')

            const chartplay = await msgfunc.SendFileToChannel(input.graphChannel, await osufunc.graph(dataplay, osudata.monthly_playcounts.map(x => x.count), 'Playcount graph', false, false, true, true, true, null, true));
            const chartrank = await msgfunc.SendFileToChannel(input.graphChannel, await osufunc.graph(datarank, osudata.rank_history.data, 'Rank graph', null, null, null, null, null, 'rank', true));

            const ChartsEmbedRank = new Discord.EmbedBuilder()
                .setDescription('Click on the image to see the full chart')
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${chartrank}`);

            const ChartsEmbedPlay = new Discord.EmbedBuilder()
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${chartplay}`);

            let osutopdataReq: osufunc.apiReturn;
            if (func.findFile(input.absoluteID, 'osutopdata') &&
                input.commandType == 'button' &&
                !('error' in func.findFile(input.absoluteID, 'osutopdata')) &&
                input.button != 'Refresh'
            ) {
                osutopdataReq = func.findFile(input.absoluteID, 'osutopdata')
            } else {
                osutopdataReq = await osufunc.apiget({
                    type: 'best',
                    params: {
                        userid: osudata.id,
                        mode: mode,
                        opts: ['limit=100']
                    }
                })
            }

            const osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = osutopdataReq.apiData;
            osufunc.debug(osutopdataReq, 'command', 'osu', input.obj.guildId, 'osuTopData');

            if (osutopdata?.error) {
                if (input.commandType != 'button' && input.commandType != 'link') {
                    if (input.commandType == 'interaction') {
                        setTimeout(() => {
                            (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                                content: 'Error - could not fetch user\'s top scores',
                                allowedMentions: { repliedUser: false },
                            }).catch()
                        }, 1000)
                    } else {

                        (input.obj as Discord.Message<any>).reply({
                            content: 'Error - could not fetch user\'s top scores',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
                log.logFile('command',
                    `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not fetch user\'s top scores
----------------------------------------------------
\n\n`,
                    { guildId: `${input.obj.guildId}` }
                )
                return;
            }

            //await osufunc.apiget('most_played', `${osudata.id}`)
            const mostplayeddataReq: osufunc.apiReturn = await osufunc.apiget({
                type: 'most_played',
                params: {
                    userid: osudata.id,
                }
            })
            const mostplayeddata: osuApiTypes.BeatmapPlaycount[] & osuApiTypes.Error = mostplayeddataReq.apiData;
            osufunc.debug(mostplayeddataReq, 'command', 'osu', input.obj.guildId, 'mostPlayedData');

            if (mostplayeddata?.error) {
                if (input.commandType != 'button' && input.commandType != 'link') {
                    if (input.commandType == 'interaction') {
                        setTimeout(() => {
                            (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                                content: 'Error - could not fetch user\'s most played beatmaps',
                                allowedMentions: { repliedUser: false },
                            }).catch()
                        }, 1000)
                    } else {

                        (input.obj as Discord.Message<any>).reply({
                            content: 'Error - could not fetch user\'s most played beatmaps',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
                log.logFile('command',
                    `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not fetch user\'s most played beatmaps
----------------------------------------------------
\n\n`,
                    { guildId: `${input.obj.guildId}` }
                )
                return;
            }
            const secperplay = osudata?.statistics.play_time / parseFloat(playcount.replaceAll(',', ''))

            const highestcombo = func.separateNum((osutopdata.sort((a, b) => b.max_combo - a.max_combo))[0].max_combo);
            const maxpp = ((osutopdata.sort((a, b) => b.pp - a.pp))[0].pp).toFixed(2)
            const minpp = ((osutopdata.sort((a, b) => a.pp - b.pp))[0].pp).toFixed(2)
            let totalpp = 0;
            for (let i2 = 0; i2 < osutopdata.length; i2++) {
                totalpp += osutopdata[i2].pp
            }
            const avgpp = (totalpp / osutopdata.length).toFixed(2)
            let mostplaytxt = ``
            for (let i2 = 0; i2 < mostplayeddata.length && i2 < 10; i2++) {
                const bmpc = mostplayeddata[i2]
                mostplaytxt += `\`${bmpc.count.toString() + ' plays'.padEnd(15, ' ')}\` | [${bmpc.beatmapset.title}[${bmpc.beatmap.version}]](https://osu.ppy.sh/b/${bmpc.beatmap_id})\n`
            }
            osuEmbed.addFields([
                {
                    name: 'Stats',
                    value:
                        `**Global Rank:**${rankglobal}${peakRank}
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}
**Total Play Time:** ${calc.secondsToTime(osudata?.statistics.play_time)} (${calc.secondsToTimeReadable(osudata?.statistics.play_time, true, false)})`,
                    inline: true
                },
                {
                    name: '-',
                    value:
                        `**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>                        
${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}
**Followers:** ${osudata.follower_count}
${prevnames}
${onlinestatus}
**Avg time per play:** ${calc.secondsToTime(secperplay)}`,
                    inline: true
                }
            ])
            osuEmbed.addFields([{
                name: 'Most Played Beatmaps',
                value: mostplaytxt != `` ? mostplaytxt : 'No data',
                inline: false
            }]
            )


            osuEmbed.addFields([
                {
                    name: 'Top play info',
                    value:
                        `**Most common mapper:** ${osufunc.modemappers(osutopdata).beatmapset.creator}
        **Most common mods:** ${osufunc.modemods(osutopdata).mods.toString().replaceAll(',', '')}
        **Gamemode:** ${mode}
        **Highest combo:** ${highestcombo}`,
                    inline: true
                },
                {
                    name: '-',
                    value: `**Highest pp:** ${maxpp}
        **Lowest pp:** ${minpp}
        **Average pp:** ${avgpp}
        **Highest accuracy:** ${((osutopdata.sort((a, b) => b.accuracy - a.accuracy))[0].accuracy * 100).toFixed(2)}%
        **Lowest accuracy:** ${((osutopdata.sort((a, b) => a.accuracy - b.accuracy))[0].accuracy * 100).toFixed(2)}%`,
                    inline: true
                }])

            useEmbeds = [osuEmbed, ChartsEmbedRank, ChartsEmbedPlay]
        } else {
            osuEmbed.setDescription(`
**Global Rank:**${rankglobal}${peakRank}
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}
${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}\n
**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>
**Followers:** ${osudata.follower_count}
${prevnames}
${onlinestatus}
**Total Play Time:** ${calc.secondsToTimeReadable(osudata?.statistics.play_time, true, false)}
        `)
            useEmbeds = [osuEmbed]
        }
    }
    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);


    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: useEmbeds,
            components: graphonly == true ? [] : [buttons],
            edit: true
        }
    })


    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

//scores

/**
 * list of #1 scores
 */
export async function firsts(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user;
    let searchid;
    let page = 0;

    let scoredetailed = false;
    let sort: embedStuff.scoreSort = 'recent';
    let reverse = false;
    let mode = 'osu';

    let filteredMapper = null;
    let filteredMods = null;
    let filterTitle = null;

    let parseScore = false;
    let parseId = null;

    let reachedMaxCount = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true)
                parseId = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            if (input.args.includes('-recent')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-recent'), 1);
            }
            if (input.args.includes('-performance')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-performance'), 1);
            }
            if (input.args.includes('-pp')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-pp'), 1);
            }
            if (input.args.includes('-score')) {
                sort = 'score';
                input.args.splice(input.args.indexOf('-score'), 1);
            }
            if (input.args.includes('-acc')) {
                sort = 'acc';
                input.args.splice(input.args.indexOf('-acc'), 1);
            }
            if (input.args.includes('-combo')) {
                sort = 'combo';
                input.args.splice(input.args.indexOf('-combo'), 1);
            }
            if (input.args.includes('-misses')) {
                sort = 'miss',
                    input.args.splice(input.args.indexOf('-misses'))
            }
            if (input.args.includes('-miss')) {
                sort = 'miss';
                input.args.splice(input.args.indexOf('-miss'), 1);
            }
            if (input.args.includes('-rank')) {
                sort = 'rank';
                input.args.splice(input.args.indexOf('-rank'), 1);
            }
            if (input.args.includes('-r')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', filterTitle, true)
                filterTitle = temp.value;
                input.args = temp.newArgs;
            }

            input.args = cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.options.getString('user');
            page = input.obj.options.getInteger('page');
            scoredetailed = input.obj.options.getBoolean('detailed');
            sort = input.obj.options.getString('sort') as embedStuff.scoreSort;
            reverse = input.obj.options.getBoolean('reverse');
            mode = input.obj.options.getString('mode') ?? 'osu';
            filteredMapper = input.obj.options.getString('mapper');
            filteredMods = input.obj.options.getString('mods');
            filterTitle = input.obj.options.getString('filter');
            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }

            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]
            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]
            page = 0;
            if (input.obj.message.embeds[0].description) {
                if (input.obj.message.embeds[0].description.includes('mapper')) {
                    filteredMapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }
                if (input.obj.message.embeds[0].description.includes('mods')) {
                    filteredMods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }
                if (input.obj.message.embeds[0].description.includes('map')) {
                    filterTitle = input.obj.message.embeds[0].description.split('map: ')[1].split('\n')[0];
                }
                const sort1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                switch (true) {
                    case sort1.includes('score'):
                        sort = 'score'
                        break;
                    case sort1.includes('acc'):
                        sort = 'acc'
                        break;
                    case sort1.includes('pp'):
                        sort = 'pp'
                        break;
                    case sort1.includes('old'): case sort1.includes('recent'):
                        sort = 'recent'
                        break;
                    case sort1.includes('combo'):
                        sort = 'combo'
                        break;
                    case sort1.includes('miss'):
                        sort = 'miss'
                        break;
                    case sort1.includes('rank'):
                        sort = 'rank'
                        break;

                }

                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses')) || (reverse1.includes('worst'))) {
                    reverse = true
                } else {
                    reverse = false
                }
                const pageParsed = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[0])
                page = 0
                switch (input.button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = pageParsed - 1
                        break;
                    case 'RightArrow':
                        page = pageParsed + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])
                        break;
                    default:
                        page = pageParsed
                        break;
                }
            }

        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page
        }
    }

    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('firsts', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Sort',
                value: sort
            },
            {
                name: 'Reverse',
                value: reverse
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Filtered Mapper',
                value: filteredMapper
            },
            {
                name: 'Filtered Mods',
                value: filteredMods
            },
            {
                name: 'Detailed',
                value: scoredetailed
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-firsts-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-firsts-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-firsts-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-firsts-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-firsts-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );
    const buttons = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`Refresh-firsts-${commanduser.id}-${input.absoluteID}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.main.refresh),
    )

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser?.username ?? '';
    }

    mode = osufunc.modeValidator(mode);


    if (input.commandType == 'interaction') {

        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode),
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {

            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                    })
                }, 1000);
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    let firstscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = [];
    async function getScoreCount(cinitnum) {
        if (cinitnum >= 499) {
            reachedMaxCount = true;
            return;
        }

        const fdReq: osufunc.apiReturn = await osufunc.apiget({
            type: 'firsts',
            params: {
                userid: `${osudata.id}`,
                opts: [`offset=${cinitnum}`, 'limit=100', `mode=${mode}`],
            },
            version: 2,

        })
        const fd: osuApiTypes.Score[] & osuApiTypes.Error = fdReq.apiData;
        if (fd?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: 'Error - could not find user\'s #1 scores',
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: 'Error - could not find user\'s #1 scores',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user\'s #1 scores offset by ${cinitnum}
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }

            await firstscoresdata.push(fd[i])
        }
        if (fd.length == 100) {
            await getScoreCount(cinitnum + 100)
        }
        return;
    }
    if (func.findFile(input.absoluteID, 'firstscoresdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'firstscoresdata')) &&
        input.button != 'Refresh'
    ) {
        firstscoresdata = func.findFile(input.absoluteID, 'firstscoresdata')
    } else {
        await getScoreCount(0);
    }
    osufunc.debug(firstscoresdata, 'command', 'firsts', input.obj.guildId, 'firstsScoresData');
    func.storeFile(firstscoresdata, input.absoluteID, 'firstscoresdata');

    if (filterTitle) {
        firstscoresdata = firstscoresdata.filter((array) =>
            (
                array.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                array.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                array.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmap.version.toLowerCase().replaceAll(' ', ''))
        )
    }

    if (parseScore == true) {
        let pid = parseInt(parseId) - 1
        if (pid < 0) {
            pid = 0
        }
        if (pid > firstscoresdata.length) {
            pid = firstscoresdata.length - 1
        }
        input.overrides = {
            mode: firstscoresdata?.[0]?.mode ?? 'osu',
            id: firstscoresdata?.[pid]?.best_id,
            commanduser,
            commandAs: input.commandType
        }
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not find requested score`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not find requested score`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find requested score
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        input.commandType = 'other';
        await scoreparse(input)
        return;
    }

    const firstsEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`#1 scores for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${firstscoresdata?.[0]?.mode ?? osufunc.modeValidator(mode)}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        ;
    if (page >= Math.ceil(firstscoresdata.length / 5)) {
        page = Math.ceil(firstscoresdata.length / 5) - 1
    }

    const scoresarg = await embedStuff.scoreList({
        scores: firstscoresdata,
        detailed: scoredetailed,
        showWeights: false,
        page: page,
        showMapTitle: true,
        showTruePosition: true,
        sort: sort,
        truePosType: 'recent',
        filteredMapper: filteredMapper,
        filteredMods: filteredMods,
        filterMapTitle: filterTitle,
        reverse: reverse,
    })
    firstsEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${Math.ceil(scoresarg.maxPages)}\n${emojis.gamemodes[mode]}\n${reachedMaxCount ? 'Only first 500 scores are shown' : ''}`)

    if (scoresarg.fields.length == 0) {
        firstsEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        for (let i = 0; i < scoresarg.fields.length; i++) {
            firstsEmbed.addFields([scoresarg.fields[i]])
        }
    }

    if (scoresarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            osufunc.logCall(error)
        }
    }
    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [firstsEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    })



    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * leaderboard of a map
 */
export async function maplb(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let mapid;
    let mapmods;
    let page;
    let parseId = null;
    let parseScore = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;

            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true)
                parseId = temp.value
                input.args = temp.newArgs
            }

            if (input.args.join(' ').includes('+')) {
                mapmods = input.args.join(' ').split('+')[1]
                mapmods.includes(' ') ? mapmods = mapmods.split(' ')[0] : null;
                input.args = input.args.join(' ').replace('+', '').replace(mapmods, '').split(' ')
            }
            input.args = cleanArgs(input.args);

            mapid = (await osufunc.mapIdFromLink(input.args.join(' '), true)).map
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            mapid = input.obj.options.getInteger('id');
            page = input.obj.options.getInteger('page');
            mapmods = input.obj.options.getString('mods');
            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            mapid = input.obj.message.embeds[0].url.split('/b/')[1]
            if (input.obj.message.embeds[0].title.includes('+')) {
                mapmods = input.obj.message.embeds[0].title.split('+')[1]
            }
            page = 0
            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1
                    break;
                case 'LeftArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
                    break;
                case 'RightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
                    break;
                case 'BigRightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[1].split('\n')[0])
                    break;
                case 'Refresh':
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1])
                    break;
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page
        }
    }

    //==============================================================================================================================================================================================

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-leaderboard-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        )
    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-maplb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-maplb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-maplb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-maplb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-maplb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );

    log.logFile(
        'command',
        log.commandLog('maplb', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Mods',
                value: mapmods
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number') {
        page = 1;
    }
    page--

    if (!mapid) {
        mapid = osufunc.getPreviousId('map', input.obj.guildId);
    }

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let mapdataReq: osufunc.apiReturn;
    if (func.findFile(mapid, 'mapdata') &&
        !('error' in func.findFile(mapid, 'mapdata')) &&
        input.button != 'Refresh'
    ) {
        mapdataReq = func.findFile(mapid, 'mapdata')
    } else {
        mapdataReq = await osufunc.apiget(
            {
                type: 'map',
                params: {
                    id: mapid
                }
            }
        )
    }
    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;
    osufunc.debug(mapdataReq, 'command', 'maplb', input.obj.guildId, 'mapData');

    if (mapdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                        allowedMentions: { repliedUser: false },
                    }).catch()
                }, 1000)
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not fetch beatmap data for ${mapid}
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(mapdataReq, mapid, 'mapdata')

    let title = 'n';
    let fulltitle = 'n';
    let artist = 'n';
    try {
        title = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title})`;
        artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist_unicode} (${mapdata.beatmapset.artist})`;
    } catch (error) {
        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({ content: 'error - map not found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
            .catch();
        return;
    }
    fulltitle = `${artist} - ${title} [${mapdata.version}]`

    let mods;
    if (mapmods) {
        mods = osumodcalc.OrderMods(mapmods) + ''
    }
    const lbEmbed = new Discord.EmbedBuilder()

    let lbdataReq: osufunc.apiReturn;
    if (mods == null) {
        if (func.findFile(input.absoluteID, 'lbdata') &&
            input.commandType == 'button' &&
            !('error' in func.findFile(input.absoluteID, 'lbdata')) &&
            input.button != 'Refresh'
        ) {
            lbdataReq = func.findFile(input.absoluteID, 'lbdata')
        } else {
            lbdataReq = await osufunc.apiget({
                type: 'scores_get_map',
                params: {
                    id: mapid
                }
            })
        }
        const lbdataf: osuApiTypes.BeatmapScores = lbdataReq.apiData

        osufunc.debug(lbdataReq, 'command', 'maplb', input.obj.guildId, 'lbDataF');

        if (lbdataf?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not fetch leaderboard data for map \`${mapid}\`.`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not fetch leaderboard data for map \`${mapid}\`.`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not fetch leaderboards for ${mapid} (API V2)
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        func.storeFile(lbdataReq, input.absoluteID, 'lbdata')

        const lbdata = lbdataf.scores

        if (parseScore == true) {
            let pid = parseInt(parseId) - 1
            if (pid < 0) {
                pid = 0
            }
            if (pid > lbdata.length) {
                pid = lbdata.length - 1
            }
            input.overrides = {
                mode: lbdata?.[0]?.mode ?? 'osu',
                id: lbdata?.[pid]?.best_id,
                commanduser,
                commandAs: input.commandType
            }
            if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
                if (input.commandType != 'button' && input.commandType != 'link') {
                    if (input.commandType == 'interaction') {
                        setTimeout(() => {
                            (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                                content: `Error - could not find requested score`,
                                allowedMentions: { repliedUser: false },
                            }).catch()
                        }, 1000)
                    } else {
                        (input.obj as Discord.Message<any>).reply({
                            content: `Error - could not find requested score`,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
                log.logFile('command',
                    `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find requested score
----------------------------------------------------
\n\n`,
                    { guildId: `${input.obj.guildId}` }
                )
                return;
            }
            input.commandType = 'other';
            await scoreparse(input)
            return;
        }

        lbEmbed
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Score leaderboard of ${fulltitle}`)
            .setURL(`https://osu.ppy.sh/b/${mapid}`)
            .setThumbnail(osufunc.getMapImages(mapdata.beatmapset_id).list2x)
            ;

        let scoretxt: string;
        if (lbdata.length < 1) {
            scoretxt = 'Error - no scores found '
        }
        if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
            scoretxt = 'Error - map is unranked'
        }

        if (page >= Math.ceil(lbdata.length / 5)) {
            page = Math.ceil(lbdata.length / 5) - 1
        }

        osufunc.debug(lbdataReq, 'command', 'maplb', input.obj.guildId, 'lbData');

        const scoresarg = await embedStuff.scoreList({
            scores: lbdata,
            detailed: false,
            showWeights: false,
            page: page,
            showMapTitle: false,
            showTruePosition: false,
            sort: 'score',
            truePosType: 'score',
            filteredMapper: null,
            filteredMods: null,
            filterMapTitle: null,
            reverse: false,
            mapidOverride: mapdata.id,
            showUserName: true
        })

        if (scoresarg.fields.length == 0) {
            lbEmbed.addFields([{
                name: 'Error',
                value: 'No scores found',
                inline: false
            }]);
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);

        } else {
            for (let i = 0; i < scoresarg.fields.length; i++) {
                lbEmbed.addFields([scoresarg.fields[i]])
            }
        }

        lbEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(scoresarg.maxPages)}`)

        if (scoresarg.isFirstPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }
        if (scoresarg.isLastPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }

        osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`);
    } else {
        if (func.findFile(input.absoluteID, 'lbdata') &&
            input.commandType == 'button' &&
            !('error' in func.findFile(input.absoluteID, 'lbdata')) &&
            input.button != 'Refresh'
        ) {
            lbdataReq = func.findFile(input.absoluteID, 'lbdata')
        } else {
            lbdataReq = await osufunc.apiget(
                {
                    type: 'scores_get_map',
                    params: {
                        id: mapid,
                        mods: mods //function auto converts to id

                    },
                    version: 1
                }
            )
        }
        const lbdata = lbdataReq.apiData
        osufunc.debug(lbdataReq, 'command', 'maplb', input.obj.guildId, 'lbData');

        if (lbdata?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not fetch leaderboard data for map \`${mapid}\`.`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not fetch leaderboard data for map \`${mapid}\`.`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not fetch leaderboards for ${mapid} (API v1)
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }

        func.storeFile(lbdataReq, input.absoluteID, 'lbdata')

        if (parseScore == true) {
            let pid = parseInt(parseId) - 1
            if (pid < 0) {
                pid = 0
            }
            if (pid > lbdata.length) {
                pid = lbdata.length - 1
            }
            input.overrides = {
                mode: lbdata?.[0]?.mode ?? 'osu',
                id: lbdata?.[pid]?.best_id,
                commanduser,
                commandAs: input.commandType
            }
            if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
                if (input.commandType != 'button' && input.commandType != 'link') {
                    if (input.commandType == 'interaction') {
                        setTimeout(() => {
                            (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                                content: `Error - could not find requested score`,
                                allowedMentions: { repliedUser: false },
                            }).catch()
                        }, 1000)
                    } else {
                        (input.obj as Discord.Message<any>).reply({
                            content: `Error - could not find requested score`,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
                log.logFile('command',
                    `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find requested score
----------------------------------------------------
\n\n`,
                    { guildId: `${input.obj.guildId}` }
                )
                return;
            }
            input.commandType = 'other';
            await scoreparse(input)
            return;
        }

        lbEmbed
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Modded score leaderboard of ${fulltitle} + ${mods}`)
            .setURL(`https://osu.ppy.sh/b/${mapid}`)
            .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`);

        let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`

        for (let i = 0; i < (lbdata).length && i < 5; i++) {
            let hitlist;
            let acc;
            const score = lbdata[i + (page * 5)]
            if (!score) break;
            const mode = mapdata.mode
            switch (mode) {
                case 'osu':
                    hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countmiss}`
                    acc = osumodcalc.calcgrade(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy
                    break;
                case 'taiko':
                    hitlist = `${score.count300}/${score.count100}/${score.countmiss}`
                    acc = osumodcalc.calcgradeTaiko(parseInt(score.count300), parseInt(score.count100), parseInt(score.countmiss)).accuracy
                    break;
                case 'fruits':
                    hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countkatu}/${score.countmiss}`
                    acc = osumodcalc.calcgradeCatch(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countkatu), parseInt(score.countmiss)).accuracy
                    break;
                case 'mania':
                    hitlist = `${score.countgeki}/${score.count300}/${score.countkatu}/${score.count100}/${score.count50}/${score.countmiss}`
                    acc = osumodcalc.calcgradeMania(parseInt(score.countgeki), parseInt(score.count300), parseInt(score.countkatu), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy
                    break;
            }
            scoretxt += `
            **[Score #${i + (page * 5) + 1}](https://osu.ppy.sh/scores/${mode}/${score.score_id}) | [${score.username}](https://osu.ppy.sh/u/${score.user_id})**
            Score set on ${score.date}
            ${(acc).toFixed(2)}% | ${score.rank} | ${score.pp}
            ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.maxcombo}x/**${mapdata.max_combo}x**
            ${hitlist}
            Has replay: ${score.replay_available == 1 ? '✅' : '❌'}
            `
        }
        if ((lbdata as any).length < 1 || scoretxt.length < 10) {
            scoretxt = 'Error - no scores found '
        }
        if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
            scoretxt = 'Error - map is unranked'
        }
        lbEmbed.setDescription(`${scoretxt}`)

        osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`);

        if (page <= 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }

        if (page >= (lbdata.length / 5) - 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [lbEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * top plays without misses
 */
export async function nochokes(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user;
    let mode;
    let sort;
    let reverse;
    let page;
    let mapper;
    let mods;
    let searchid;
    let filterTitle = null;

    let parseScore = false;
    let parseId = null;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            mode = null;
            sort = 'pp';
            page = 1;
            mapper = null;
            mods = null;

            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true)
                parseId = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            if (input.args.includes('-recent')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-recent'), 1);
            }
            if (input.args.includes('-performance')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-performance'), 1);
            }
            if (input.args.includes('-pp')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-pp'), 1);
            }
            if (input.args.includes('-score')) {
                sort = 'score';
                input.args.splice(input.args.indexOf('-score'), 1);
            }
            if (input.args.includes('-acc')) {
                sort = 'acc';
                input.args.splice(input.args.indexOf('-acc'), 1);
            }
            if (input.args.includes('-combo')) {
                sort = 'combo';
                input.args.splice(input.args.indexOf('-combo'), 1);
            }
            if (input.args.includes('-misses')) {
                sort = 'miss',
                    input.args.splice(input.args.indexOf('-misses'))
            }
            if (input.args.includes('-miss')) {
                sort = 'miss';
                input.args.splice(input.args.indexOf('-miss'), 1);
            }
            if (input.args.includes('-rank')) {
                sort = 'rank';
                input.args.splice(input.args.indexOf('-rank'), 1);
            }
            if (input.args.includes('-r')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }

            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', filterTitle, true)
                filterTitle = temp.value;
                input.args = temp.newArgs;
            }

            input.args = cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.options.getString('user');
            mode = input.obj.options.getString('mode');
            mapper = input.obj.options.getString('mapper');
            mods = input.obj.options.getString('mods');
            sort = input.obj.options.getString('sort');
            page = input.obj.options.getInteger('page');
            reverse = input.obj.options.getBoolean('reverse');
            filterTitle = input.obj.options.getString('filter');
            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]

            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]

            if (input.obj.message.embeds[0].description) {
                if (input.obj.message.embeds[0].description.includes('mapper')) {

                    mapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }

                if (input.obj.message.embeds[0].description.includes('mods')) {

                    mods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }

                if (input.obj.message.embeds[0].description.includes('map')) {

                    filterTitle = input.obj.message.embeds[0].description.split('map: ')[1].split('\n')[0];
                }

                const sort1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                switch (true) {
                    case sort1.includes('score'):
                        sort = 'score'
                        break;
                    case sort1.includes('acc'):
                        sort = 'acc'
                        break;
                    case sort1.includes('pp'):
                        sort = 'pp'
                        break;
                    case sort1.includes('old'): case sort1.includes('recent'):
                        sort = 'recent'
                        break;
                    case sort1.includes('combo'):
                        sort = 'combo'
                        break;
                    case sort1.includes('miss'):
                        sort = 'miss'
                        break;
                    case sort1.includes('rank'):
                        sort = 'rank'
                        break;

                }


                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses')) || (reverse1.includes('worst'))) {
                    reverse = true
                } else {
                    reverse = false
                }

                const pageParsed = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[0])
                page = 0
                switch (input.button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = pageParsed - 1
                        break;
                    case 'RightArrow':
                        page = pageParsed + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])
                        break;
                    default:
                        page = pageParsed
                        break;
                }
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page
        }
        if (input.overrides.sort != null) {
            sort = input.overrides.sort
        }
        if (input.overrides.reverse != null) {
            reverse = input.overrides.reverse === true;
        }
    }

    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('nochokes', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(
            input.absoluteID,
            [{
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Sort',
                value: sort
            },
            {
                name: 'Reverse',
                value: reverse
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Mapper',
                value: mapper
            },
            {
                name: 'Mods',
                value: mods
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            }
            ]
        ), {
        guildId: `${input.obj.guildId}`
    })

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-nochokes-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        )

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = osufunc.modeValidator(mode);

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-nochokes-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-nochokes-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-nochokes-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-nochokes-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-nochokes-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );

    if (input.commandType == 'interaction') {

        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                    })
                }, 1000);
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    let nochokedataReq: osufunc.apiReturn;
    if (func.findFile(input.absoluteID, 'nochokedata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'nochokedata')) &&
        input.button != 'Refresh'
    ) {
        nochokedataReq = func.findFile(input.absoluteID, 'nochokedata')
    } else {
        nochokedataReq = await osufunc.apiget({
            type: 'best',
            params: {
                userid: osudata.id,
                mode: mode,
                opts: ['limit=100']
            }
        })
    }
    let nochokedata: osuApiTypes.Score[] & osuApiTypes.Error = nochokedataReq.apiData;


    if (nochokedata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {

                    (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                        content: `Error - could not find \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                    })
                }, 1000);
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not find \`${user}\`'s top scores`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user\'s top scores
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(nochokedataReq, input.absoluteID, 'nochokedata');
    osufunc.debug(nochokedataReq, 'command', 'osutop', input.obj.guildId, 'noChokeData');

    try {
        nochokedata[0].user.username
    } catch (error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                        content: `Error - could not fetch \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                    })
                        .catch();
                }, 1000);
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not fetch \`${user}\`'s top scores`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
        }
        return;
    }

    let showtrue = false;
    if (sort != 'pp') {
        showtrue = true;
    }

    if (page >= Math.ceil(nochokedata.length / 5)) {
        page = Math.ceil(nochokedata.length / 5) - 1
    }

    if (filterTitle) {
        nochokedata = nochokedata.filter((array) =>
            (
                array.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                array.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                array.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmap.version.toLowerCase().replaceAll(' ', ''))
        )
    }

    if (parseScore == true) {
        let pid = parseInt(parseId) - 1
        if (pid < 0) {
            pid = 0
        }
        if (pid > nochokedata.length) {
            pid = nochokedata.length - 1
        }
        input.overrides = {
            mode: nochokedata?.[0]?.mode ?? 'osu',
            id: nochokedata?.[pid]?.best_id,
            commanduser,
            commandAs: input.commandType
        }
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not find requested score`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not find requested score`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find requested score
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        input.commandType = 'other';
        await scoreparse(input)
        return;
    }

    const topEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`Top no choke scores of ${osudata.username}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${nochokedata?.[0]?.mode ?? osufunc.modeValidator(mode)}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
    const scoresarg = await embedStuff.scoreList(
        {
            scores: nochokedata.filter(a => a.statistics.count_miss == 0),
            detailed: false,
            showWeights: true,
            page: page,
            showMapTitle: true,
            showTruePosition: showtrue,
            sort: sort,
            truePosType: 'pp',
            filteredMapper: mapper,
            filteredMods: mods,
            filterMapTitle: filterTitle,
            reverse: reverse
        })
    topEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${Math.ceil(scoresarg.maxPages)}\n${emojis.gamemodes[mode]}`)
    if (scoresarg.fields.length == 0) {
        topEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        for (let i = 0; scoresarg.fields.length > i; i++) {
            topEmbed.addFields(scoresarg.fields[i])
        }
    }

    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);

    if (scoresarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            osufunc.logCall(error)
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [topEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * list of top plays
 */
export async function osutop(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user;
    let mode;
    let detailed;
    let sort: embedStuff.scoreSort;
    let reverse;
    let page;
    let mapper;
    let mods;
    let filterTitle;

    let searchid;

    let parseScore = false;
    let parseId = null;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            mode = null;
            sort = 'pp';
            page = 1;

            mapper = null;
            mods = null;
            detailed = false;
            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true)
                parseId = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-mods')) {
                const temp = func.parseArg(input.args, '-mods', 'string', mods);
                mods = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-reverse')) {
                reverse = true
                input.args.splice(input.args.indexOf('-reverse'), 1);
            }

            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            if (input.args.includes('-recent')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-recent'), 1);
            }
            if (input.args.includes('-performance')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-performance'), 1);
            }
            if (input.args.includes('-pp')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-pp'), 1);
            }
            if (input.args.includes('-score')) {
                sort = 'score';
                input.args.splice(input.args.indexOf('-score'), 1);
            }
            if (input.args.includes('-acc')) {
                sort = 'acc';
                input.args.splice(input.args.indexOf('-acc'), 1);
            }
            if (input.args.includes('-combo')) {
                sort = 'combo';
                input.args.splice(input.args.indexOf('-combo'), 1);
            }
            if (input.args.includes('-misses')) {
                sort = 'miss',
                    input.args.splice(input.args.indexOf('-misses'))
            }
            if (input.args.includes('-miss')) {
                sort = 'miss';
                input.args.splice(input.args.indexOf('-miss'), 1);
            }
            if (input.args.includes('-rank')) {
                sort = 'rank';
                input.args.splice(input.args.indexOf('-rank'), 1);
            }
            if (input.args.includes('-r')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }

            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', filterTitle, true)
                filterTitle = temp.value;
                input.args = temp.newArgs;
            }

            user = input.args.join(' ');

            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.options.getString('user');
            mode = input.obj.options.getString('mode');
            mapper = input.obj.options.getString('mapper');
            mods = input.obj.options.getString('mods');
            sort = input.obj.options.getString('sort') as embedStuff.scoreSort;
            page = input.obj.options.getInteger('page');
            detailed = input.obj.options.getBoolean('detailed');
            filterTitle = input.obj.options.getString('filter');
            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true
            }

            reverse = input.obj.options.getBoolean('reverse')
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]//obj.message.embeds[0].title.split('Top plays of ')[1]

            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]

            if (input.obj.message.embeds[0].description) {
                if (input.obj.message.embeds[0].description.includes('mapper')) {
                    mapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }

                if (input.obj.message.embeds[0].description.includes('mods')) {

                    mods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }

                if (input.obj.message.embeds[0].description.includes('map')) {

                    filterTitle = input.obj.message.embeds[0].description.split('map: ')[1].split('\n')[0];
                }

                const sort1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                switch (true) {
                    case sort1.includes('score'):
                        sort = 'score'
                        break;
                    case sort1.includes('acc'):
                        sort = 'acc'
                        break;
                    case sort1.includes('pp'):
                        sort = 'pp'
                        break;
                    case sort1.includes('old'): case sort1.includes('recent'):
                        sort = 'recent'
                        break;
                    case sort1.includes('combo'):
                        sort = 'combo'
                        break;
                    case sort1.includes('miss'):
                        sort = 'miss'
                        break;
                    case sort1.includes('rank'):
                        sort = 'rank'
                        break;

                }


                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses')) || (reverse1.includes('worst'))) {
                    reverse = true
                } else {
                    reverse = false
                }

                if (input.obj.message.embeds[0].fields.length == 7 || input.obj.message.embeds[0].fields.length == 11) {
                    detailed = true
                } else {
                    detailed = false
                }
                const pageParsed = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[0])
                page = 0
                switch (input.button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = pageParsed - 1
                        break;
                    case 'RightArrow':
                        page = pageParsed + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])
                        break;
                    default:
                        page = pageParsed
                        break;
                }
            }
            if (input.button == 'DetailEnable') {
                detailed = true;
            }
            if (input.button == 'DetailDisable') {
                detailed = false;
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page
        }
        if (input.overrides.sort != null) {
            sort = input.overrides.sort
        }
        if (input.overrides.reverse != null) {
            reverse = input.overrides.reverse === true;
        }
        if (input.overrides.mode != null) {
            mode = input.overrides.mode
        }
        if (input.overrides.filterMapper != null) {
            mapper = input.overrides.filterMapper
        }
        if (input.overrides.filterMods != null) {
            mapper = input.overrides.filterMods
        }
    }

    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('osutop', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(
            input.absoluteID,
            [{
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Sort',
                value: sort
            },
            {
                name: 'Reverse',
                value: reverse
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Mapper',
                value: mapper
            },
            {
                name: 'Mods',
                value: mods
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            }
            ],
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-osutop-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        )

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = osufunc.modeValidator(mode);

    if (detailed == true) {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`DetailDisable-osutop-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailed)
        )
    } else {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`DetailEnable-osutop-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailed)
        )
    }

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-osutop-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-osutop-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-osutop-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-osutop-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-osutop-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                    })
                }, 1000);
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    let osutopdataReq: osufunc.apiReturn;
    if (func.findFile(input.absoluteID, 'osutopdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'osutopdata')) &&
        input.button != 'Refresh'
    ) {
        osutopdataReq = func.findFile(input.absoluteID, 'osutopdata')
    } else {
        osutopdataReq = await osufunc.apiget({
            type: 'best',
            params: {
                userid: osudata.id,
                mode: mode,
                opts: ['limit=100', 'offset=0']
            }
        })
    }

    let osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = osutopdataReq.apiData;

    osufunc.debug(osutopdataReq, 'command', 'osutop', input.obj.guildId, 'osuTopData');

    if (osutopdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                        content: `Error - could not find \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                    })
                }, 1000);
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not find \`${user}\`'s top scores`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user\'s top scores
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(osutopdataReq, input.absoluteID, 'osutopdata')

    try {
        osutopdata[0].user.username
    } catch (error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                        content: `Error - could not fetch \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                    })
                        .catch();
                }, 1000);
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not fetch \`${user}\`'s top scores`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
        }
        return;
    }


    let showtrue = false;
    if (sort != 'pp') {
        showtrue = true;
    }

    if (page >= Math.ceil(osutopdata.length / 5)) {
        page = Math.ceil(osutopdata.length / 5) - 1
    }

    if (filterTitle) {
        osutopdata = osutopdata.filter((array) =>
            (
                array.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                array.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                array.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmap.version.toLowerCase().replaceAll(' ', ''))
        )
    }

    if (parseScore == true) {
        let pid = parseInt(parseId) - 1
        if (pid < 0) {
            pid = 0
        }
        if (pid > osutopdata.length) {
            pid = osutopdata.length - 1
        }
        input.overrides = {
            mode: osutopdata?.[0]?.mode ?? 'osu',
            id: osutopdata?.[pid]?.best_id,
            commanduser,
            commandAs: input.commandType
        }
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not find requested score`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not find requested score`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find requested score
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        input.commandType = 'other';

        await scoreparse(input)
        return;
    }

    const topEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`Top plays of ${osudata.username}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osutopdata?.[0]?.mode ?? osufunc.modeValidator(mode)}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
    const scoresarg = await embedStuff.scoreList(
        {
            scores: osutopdata,
            detailed: detailed,
            showWeights: true,
            page: page,
            showMapTitle: true,
            showTruePosition: showtrue,
            sort: sort,
            truePosType: 'pp',
            filteredMapper: mapper,
            filteredMods: mods,
            filterMapTitle: filterTitle,
            reverse: reverse
        })
    topEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${Math.ceil(scoresarg.maxPages)}\n${emojis.gamemodes[mode]}`)
    if (scoresarg.fields.length == 0) {
        topEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        for (let i = 0; scoresarg.fields.length > i; i++) {
            topEmbed.addFields(scoresarg.fields[i])
        }
    }


    if (detailed == true) {
        const highestcombo = func.separateNum((osutopdata.sort((a, b) => b.max_combo - a.max_combo))[0].max_combo);
        const maxpp = ((osutopdata.sort((a, b) => b.pp - a.pp))[0].pp).toFixed(2)
        const minpp = ((osutopdata.sort((a, b) => a.pp - b.pp))[0].pp).toFixed(2)
        let totalpp = 0;
        for (let i2 = 0; i2 < osutopdata.length; i2++) {
            totalpp += osutopdata[i2].pp
        }
        const avgpp = (totalpp / osutopdata.length).toFixed(2)
        let hittype: string;
        if (mode == 'osu') {
            hittype = `hit300/hit100/hit50/miss`
        }
        if (mode == 'taiko') {
            hittype = `Great(300)/Good(100)/miss`
        }
        if (mode == 'fruits' || mode == 'catch') {
            hittype = `Fruit(300)/Drops(100)/Droplets(50)/miss`
        }
        if (mode == 'mania') {
            hittype = `300+(geki)/300/200(katu)/100/50/miss`
        }
        topEmbed.addFields([{
            name: '-',
            value: `
        **Most common mapper:** ${osufunc.modemappers(osutopdata).beatmapset.creator}
        **Most common mods:** ${osufunc.modemods(osutopdata).mods.toString().replaceAll(',', '')}
        **Gamemode:** ${mode}
        **Hits:** ${hittype}
        **Highest combo:** ${highestcombo}
    `,
            inline: true
        },
        {
            name: '-',
            value: `
        **Highest pp:** ${maxpp}
        **Lowest pp:** ${minpp}
        **Average pp:** ${avgpp}
        **Highest accuracy:** ${((osutopdata.sort((a, b) => b.accuracy - a.accuracy))[0].accuracy * 100).toFixed(2)}%
        **Lowest accuracy:** ${((osutopdata.sort((a, b) => a.accuracy - b.accuracy))[0].accuracy * 100).toFixed(2)}%
    `, inline: true
        }])
    }

    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);

    if (scoresarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            osufunc.logCall(error)
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [topEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * list of pinned scores
 */
export async function pinned(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user;
    let searchid;
    let page = 0;

    let scoredetailed = false;
    let sort: embedStuff.scoreSort = 'recent';
    let reverse = false;
    let mode = 'osu';
    let filteredMapper = null;
    let filteredMods = null;
    let filterTitle = null;

    let parseScore = false;
    let parseId = null;

    let reachedMaxCount = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true)
                parseId = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            if (input.args.includes('-recent')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-recent'), 1);
            }
            if (input.args.includes('-performance')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-performance'), 1);
            }
            if (input.args.includes('-pp')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-pp'), 1);
            }
            if (input.args.includes('-score')) {
                sort = 'score';
                input.args.splice(input.args.indexOf('-score'), 1);
            }
            if (input.args.includes('-acc')) {
                sort = 'acc';
                input.args.splice(input.args.indexOf('-acc'), 1);
            }
            if (input.args.includes('-combo')) {
                sort = 'combo';
                input.args.splice(input.args.indexOf('-combo'), 1);
            }
            if (input.args.includes('-misses')) {
                sort = 'miss',
                    input.args.splice(input.args.indexOf('-misses'))
            }
            if (input.args.includes('-miss')) {
                sort = 'miss';
                input.args.splice(input.args.indexOf('-miss'), 1);
            }
            if (input.args.includes('-rank')) {
                sort = 'rank';
                input.args.splice(input.args.indexOf('-rank'), 1);
            }
            if (input.args.includes('-r')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }

            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', filterTitle, true)
                filterTitle = temp.value;
                input.args = temp.newArgs;
            }

            input.args = cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = input.obj.member.user.id;

            user = input.obj.options.getString('user');

            page = input.obj.options.getInteger('page');

            scoredetailed = input.obj.options.getBoolean('detailed');
            sort = input.obj.options.getString('sort') as embedStuff.scoreSort;

            reverse = input.obj.options.getBoolean('reverse');

            mode = input.obj.options.getString('mode') ?? 'osu';

            filteredMapper = input.obj.options.getString('mapper');

            filterTitle = input.obj.options.getString('filter');

            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true
            }

            filteredMods = input.obj.options.getString('mods');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);

            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]

            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]
            page = 0;

            if (input.obj.message.embeds[0].description) {

                if (input.obj.message.embeds[0].description.includes('mapper')) {

                    filteredMapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }

                if (input.obj.message.embeds[0].description.includes('mods')) {

                    filteredMods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }

                if (input.obj.message.embeds[0].description.includes('map')) {

                    filterTitle = input.obj.message.embeds[0].description.split('map: ')[1].split('\n')[0];
                }


                const sort1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                switch (true) {
                    case sort1.includes('score'):
                        sort = 'score'
                        break;
                    case sort1.includes('acc'):
                        sort = 'acc'
                        break;
                    case sort1.includes('pp'):
                        sort = 'pp'
                        break;
                    case sort1.includes('old'): case sort1.includes('recent'):
                        sort = 'recent'
                        break;
                    case sort1.includes('combo'):
                        sort = 'combo'
                        break;
                    case sort1.includes('miss'):
                        sort = 'miss'
                        break;
                    case sort1.includes('rank'):
                        sort = 'rank'
                        break;

                }



                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses'))) {
                    reverse = true
                } else {
                    reverse = false
                }

                const pageParsed = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[0])
                page = 0
                switch (input.button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = pageParsed - 1
                        break;
                    case 'RightArrow':
                        page = pageParsed + 1
                        break;
                    case 'BigRightArrow':

                        page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])
                        break;
                    default:
                        page = pageParsed
                        break;
                }
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = parseInt(`${input.overrides.page}`)
        }
    }

    //==============================================================================================================================================================================================

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-pinned-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        )

    log.logFile(
        'command',
        log.commandLog('pinned', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Sort',
                value: sort
            },
            {
                name: 'Reverse',
                value: reverse
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Filtered Mapper',
                value: filteredMapper
            },
            {
                name: 'Filtered Mods',
                value: filteredMods
            },
            {
                name: 'Detailed',
                value: scoredetailed
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-pinned-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-pinned-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-pinned-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-pinned-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-pinned-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = osufunc.modeValidator(mode);

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'pinned', input.obj.guildId, 'osuData');
    if (osudata?.error || !osudata.id) {
        if (input.commandType == 'interaction') {
            setTimeout(() => {
                (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                })
            }, 1000);
        } else {
            (input.obj as Discord.Message<any>).reply({
                content: `Error - could not find user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    let pinnedscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = []; //= await osufunc.apiget('pinned', `${osudata.id}`, `${mode}`)
    async function getScoreCount(cinitnum) {
        if (cinitnum >= 499) {
            reachedMaxCount = true;
            return;
        }
        const fdReq: osufunc.apiReturn = await osufunc.apiget({
            type: 'pinned',
            params: {
                userid: `${osudata.id}`,
                opts: [`offset=${cinitnum}`, 'limit=100', `mode=${mode}`],
            },
            version: 2,
        })
        const fd: osuApiTypes.Score[] & osuApiTypes.Error = fdReq.apiData;
        if (fd?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: 'Error - could not find user\'s pinned scores',
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: 'Error - could not find user\'s pinned scores',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user's pinned scores offset by ${cinitnum}
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }

            await pinnedscoresdata.push(fd[i])
        }
        if (fd.length == 100) {
            await getScoreCount(cinitnum + 100)
        }

    }
    if (func.findFile(input.absoluteID, 'pinnedscoresdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'pinnedscoresdata')) &&
        input.button != 'Refresh'
    ) {
        pinnedscoresdata = func.findFile(input.absoluteID, 'pinnedscoresdata')
    } else {
        await getScoreCount(0);
    }
    osufunc.debug(pinnedscoresdata, 'command', 'pinned', input.obj.guildId, 'pinnedScoresData');
    func.storeFile(pinnedscoresdata, input.absoluteID, 'pinnedscoresdata');

    if (page >= Math.ceil(pinnedscoresdata.length / 5)) {
        page = Math.ceil(pinnedscoresdata.length / 5) - 1
    }

    if (filterTitle) {
        pinnedscoresdata = pinnedscoresdata.filter((array) =>
            (
                array.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                array.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                array.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmap.version.toLowerCase().replaceAll(' ', ''))
        )
    }

    if (parseScore == true) {
        let pid = parseInt(parseId) - 1
        if (pid < 0) {
            pid = 0
        }
        if (pid > pinnedscoresdata.length) {
            pid = pinnedscoresdata.length - 1
        }
        input.overrides = {
            mode: pinnedscoresdata?.[0]?.mode ?? 'osu',
            id: pinnedscoresdata?.[pid]?.best_id,
            commanduser,
            commandAs: input.commandType
        }
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not find requested score`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not find requested score`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find requested score
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        input.commandType = 'other';
        await scoreparse(input)
        return;
    }

    const pinnedEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`Pinned scores for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${pinnedscoresdata?.[0]?.mode ?? osufunc.modeValidator(mode)}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })

    const scoresarg = await embedStuff.scoreList(
        {
            scores: pinnedscoresdata,
            detailed: scoredetailed,
            showWeights: false,
            page: page,
            showMapTitle: true,
            showTruePosition: true,
            sort: sort,
            truePosType: 'recent',
            filteredMapper: filteredMapper,
            filteredMods: filteredMods,
            filterMapTitle: filterTitle,
            reverse: false
        });
    pinnedEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${scoresarg.maxPages}\n${emojis.gamemodes[mode]}\n${reachedMaxCount ? 'Only first 500 scores are shown' : ''}`)
    if (scoresarg.fields.length == 0) {
        pinnedEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        for (let i = 0; i < scoresarg.fields.length; i++) {
            pinnedEmbed.addFields([scoresarg.fields[i]])
        }
    }
    if (scoresarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            osufunc.logCall(error)
        }
    }

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [pinnedEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    })

    //SEND/EDIT MSG==============================================================================================================================================================================================

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * most recent score or list of recent scores
 */
export async function recent(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user;
    let searchid;
    let page = 0;
    let mode = null;
    let list = false;
    let sort: embedStuff.scoreSort = 'recent';
    let showFails = 1;
    let filterTitle = null;

    let isFirstPage = false;
    let isLastPage = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-list')) {
                list = true;
                input.args.splice(input.args.indexOf('-list'), 1);
            }
            if (input.args.includes('-l')) {
                list = true;
                input.args.splice(input.args.indexOf('-l'), 1);
            }

            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-mode')) {
                mode = (input.args[input.args.indexOf('-mode') + 1]);
                input.args.splice(input.args.indexOf('-mode'), 2);
            }
            if (input.args.includes('-m')) {
                mode = (input.args[input.args.indexOf('-m') + 1]);
                input.args.splice(input.args.indexOf('-m'), 2);
            }
            if (input.args.includes('-passes=true')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-passes=true'), 1);
            }
            if (input.args.includes('-passes')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-passes=true'), 1);
            }
            if (input.args.includes('-pass')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-pass'), 1);
            }
            if (input.args.includes('-nofail')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-nofail'), 1);
            }
            if (input.args.includes('-nf')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-nf'), 1);
            }
            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', filterTitle, true)
                filterTitle = temp.value;
                input.args = temp.newArgs;
            }

            input.args = cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null
            }
            isFirstPage = true;

        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.options.getString('user');
            page = input.obj.options.getNumber('page');
            mode = input.obj.options.getString('mode');
            list = input.obj.options.getBoolean('list');

            filterTitle = input.obj.options.getString('filter');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = (input.obj.message as Discord.Message<any>).embeds[0].author.url.split('u/')[1]
            //title.split('for ')[1]
            const modething = input.obj.message.embeds[0].footer ? input.obj.message.embeds[0].description.split('\n')[1] : input.obj.message.embeds[0].description.split(' | ')[1].split('\n')[0]
            switch (true) {
                case modething.includes('osu'): {
                    mode = 'osu';
                }
                    break;
                case modething.includes('taiko'): {
                    mode = 'taiko';
                }
                    break;
                case modething.includes('fruits'): {
                    mode = 'fruits';
                }
                    break;
                case modething.includes('mania'): {
                    mode = 'mania';
                }
            }

            if (input.obj.message.embeds[0].title.includes('Best')) {
                sort = 'pp'
            }

            page = 0
            if (input.button == 'BigLeftArrow') {
                page = 1
                isFirstPage = true
            }
            if (input.obj.message.embeds[0].title.includes('plays') || input.obj.message.embeds[0].title.includes('passes')) {
                switch (input.button) {
                    case 'LeftArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1
                        break;
                    case 'RightArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n')[0])
                        break;
                    case 'Refresh':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0])
                        break;
                }
                list = true
                if (isNaN(+(input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) || ((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) == 'NaN') {
                    page = 1
                }
                if (page < 2) {
                    isFirstPage = true;
                }
                if (page == parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n')[0])) {
                    isLastPage = true;
                }
            } else {
                switch (input.button) {
                    case 'LeftArrow':
                        page = parseInt((input.obj.message.embeds[0].title).split(' ')[0].split('#')[1]) - 1
                        break;
                    case 'RightArrow':
                        page = parseInt((input.obj.message.embeds[0].title).split(' ')[0].split('#')[1]) + 1
                        break;
                    case 'Refresh':
                        page = parseInt((input.obj.message.embeds[0].title).split(' ')[0].split('#')[1])
                        break;
                }
                if (page < 2) {
                    page == 1
                }
            }

            if (input.obj.message.embeds[0].title.includes('passes')) {
                showFails = 0
            } else {
                showFails = 1
            }

            if (input.obj.message.embeds[0].description.includes('Filter:')) {

                filterTitle = input.obj.message.embeds[0].description.split('Filter: ')[1].split('\n')[0]
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = parseInt(`${input.overrides.page}`)
        }
        if (input.overrides.type != null) {
            if (input.overrides.type == 'list') {
                list = true
            }
            if (input.overrides.type == 'listtaiko') {
                list = true
                mode = 'taiko'
            }
            if (input.overrides.type == 'listfruits') {
                list = true
                mode = 'fruits'
            }
            if (input.overrides.type == 'listmania') {
                list = true
                mode = 'mania'
            }
        }
        if (input?.overrides?.sort != null) {
            sort = input?.overrides?.sort ?? 'recent'
        }
        if (input.overrides.mode != null) {
            mode = input.overrides.mode
        }
    }

    //==============================================================================================================================================================================================

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-recent-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        )
    log.logFile(
        'command',
        log.commandLog('recent', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'List',
                value: list
            },
            {
                name: 'Filter',
                value: filterTitle
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = osufunc.modeValidator(mode);

    if (page < 2 || typeof page != 'number') {
        isFirstPage = true;
        page = 1;
    }
    page--
    let pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-recent-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first)
                .setDisabled(isFirstPage),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-recent-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous)
                .setDisabled(isFirstPage),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-recent-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next)
                .setDisabled(isLastPage),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-recent-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last)
                .setDisabled(isLastPage),
        );

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'recent', input.obj.guildId, 'osuData');

    if (osudata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                content: `Error - could not fetch user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    if (!osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                content: `Error - could not fetch user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
        }
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        })
            .catch()
    }

    let rsdataReq: osufunc.apiReturn;
    if (func.findFile(input.absoluteID, 'rsdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'rsdata')) &&
        input.button != 'Refresh'
    ) {
        rsdataReq = func.findFile(input.absoluteID, 'rsdata')
    } else {
        rsdataReq = await osufunc.apiget({
            type: 'recent',
            params: {
                userid: osudata.id,
                mode,
                opts: [`include_fails=${showFails}`, 'offset=0', 'limit=100']
            }
        })
    }

    let rsdata: osuApiTypes.Score[] & osuApiTypes.Error = rsdataReq.apiData;

    osufunc.debug(rsdataReq, 'command', 'recent', input.obj.guildId, 'rsData');
    if (rsdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: `Error - could not fetch \`${user}\`'s recent scores`,
                        allowedMentions: { repliedUser: false },
                    }).catch()
                }, 1000)
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not fetch \`${user}\`'s recent scores`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }

        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user's recent scores
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(rsdataReq, input.absoluteID, 'rsdata')

    if (filterTitle) {
        rsdata = rsdata.filter((array) =>
            (
                array.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                array.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                array.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmap.version.toLowerCase().replaceAll(' ', ''))
        )
    }

    const rsEmbed = new Discord.EmbedBuilder()
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        });
    if (list != true) {
        rsEmbed.setColor(colours.embedColour.score.dec)

        page = rsdata[page] ? page : 0

        if (input.button == 'BigRightArrow') {
            page = rsdata.length - 1
        }

        const curscore = rsdata[0 + page]
        if (!curscore || curscore == undefined || curscore == null) {
            let err = `Error - \`${user}\` has no recent ${emojis.gamemodes[mode ?? 'osu']} scores`
            if (filterTitle) {
                err = `Error - \`${user}\` has no recent ${emojis.gamemodes[mode ?? 'osu']} scores matching \`${filterTitle}\``
            }

            if (input.button == null) {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: err,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply(
                        {
                            content: err,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                        .catch();
                }
            }
            return;
        }
        const curbm = curscore.beatmap
        const curbms = curscore.beatmapset

        let mapdataReq: osufunc.apiReturn;
        if (func.findFile(curbm.id, 'mapdata') &&
            !('error' in func.findFile(curbm.id, 'mapdata')) &&
            input.button != 'Refresh'
        ) {
            mapdataReq = func.findFile(curbm.id, 'mapdata')
        } else {
            mapdataReq = await osufunc.apiget({
                type: 'map',
                params: {
                    id: curbm.id
                }
            })
        }
        const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData

        osufunc.debug(mapdataReq, 'command', 'recent', input.obj.guildId, 'mapData');
        if (mapdata?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: 'Error - could not find beatmap',
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: 'Error - could not find beatmap',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmap data for ${curbm.id}
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }

        func.storeFile(mapdataReq, curbm.id, 'mapdata')

        let accgr;
        let fcaccgr;
        const gamehits = curscore.statistics;
        switch (rsdata[0].mode) {
            case 'osu': default:
                accgr =
                    osumodcalc.calcgrade(
                        gamehits.count_300,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_miss
                    )
                fcaccgr =
                    osumodcalc.calcgrade(
                        gamehits.count_300,
                        gamehits.count_100,
                        gamehits.count_50,
                        0
                    )
                break;
            case 'taiko':
                accgr =
                    osumodcalc.calcgradeTaiko(
                        gamehits.count_300,
                        gamehits.count_100,
                        gamehits.count_miss
                    )
                fcaccgr =
                    osumodcalc.calcgradeTaiko(
                        gamehits.count_300,
                        gamehits.count_100,
                        0
                    )
                break;
            case 'fruits':
                accgr =
                    osumodcalc.calcgradeCatch(
                        gamehits.count_300,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_katu,
                        gamehits.count_miss
                    )
                fcaccgr =
                    osumodcalc.calcgradeCatch(
                        gamehits.count_300,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_katu,
                        0
                    )
                break;
            case 'mania':
                accgr =
                    osumodcalc.calcgradeMania(
                        gamehits.count_geki,
                        gamehits.count_300,
                        gamehits.count_katu,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_miss
                    )
                fcaccgr =
                    osumodcalc.calcgradeMania(
                        gamehits.count_geki,
                        gamehits.count_300,
                        gamehits.count_katu,
                        gamehits.count_100,
                        gamehits.count_50,
                        0
                    )
                break;
        }
        let rspassinfo = '';
        let totalhits;

        switch (rsdata[0].mode) {
            case 'osu': default:
                totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_50 + gamehits.count_miss;
                break;
            case 'taiko':
                totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_miss;
                break;
            case 'fruits':
                totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_50 + gamehits.count_katu + gamehits.count_miss;
                break;
            case 'mania':
                totalhits = gamehits.count_geki + gamehits.count_300 + gamehits.count_katu + gamehits.count_100 + gamehits.count_50 + gamehits.count_miss;
        }
        const curbmhitobj = mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners;
        const guesspasspercentage = Math.abs((totalhits / curbmhitobj) * 100);
        const curbmpasstime = Math.floor(guesspasspercentage / 100 * curbm.hit_length);

        let rsgrade;
        switch (curscore.rank.toUpperCase()) {
            case 'F':
                rspassinfo = `\n${guesspasspercentage.toFixed(2)}% completed (${calc.secondsToTime(curbmpasstime)}/${calc.secondsToTime(curbm.hit_length)})`
                rsgrade = emojis.grades.F
                break;
            case 'D':
                rsgrade = emojis.grades.D
                break;
            case 'C':
                rsgrade = emojis.grades.C
                break;
            case 'B':
                rsgrade = emojis.grades.B
                break;
            case 'A':
                rsgrade = emojis.grades.A
                break;
            case 'S':
                rsgrade = emojis.grades.S
                break;
            case 'SH':
                rsgrade = emojis.grades.SH
                break;
            case 'X':
                rsgrade = emojis.grades.X
                break;
            case 'XH':
                rsgrade = emojis.grades.XH
                break;
        }
        let totaldiff: string;
        let hitlist: string;
        switch (curscore.mode) {
            case 'osu': default:
                hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                break;
            case 'taiko':
                hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **Miss:** ${gamehits.count_miss}`
                break;
            case 'fruits':
                hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                break;
            case 'mania':
                hitlist = `**300+:** ${gamehits.count_geki} \n **300:** ${gamehits.count_300} \n **200:** ${gamehits.count_katu} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                break;
        }
        let rspp: string | number = 0;
        let ppissue: string = '';
        let ppcalcing: PerformanceAttributes[];
        let fcflag = ''
        try {
            ppcalcing = await osufunc.scorecalc({
                mods: curscore.mods.join('').length > 1 ?
                    curscore.mods.join('') : 'NM',
                gamemode: curscore.mode,
                mapid: curscore.beatmap.id,
                miss: gamehits.count_miss,
                acc: curscore.accuracy,
                maxcombo: curscore.max_combo,
                score: curscore.score,
                calctype: 0,
                passedObj: embedStuff.getTotalHits(curscore.mode, curscore),
            })

            totaldiff = ppcalcing[0].difficulty.stars.toFixed(2)

            rspp =
                curscore.pp ?
                    curscore.pp.toFixed(2) :
                    ppcalcing[0].pp.toFixed(2)
            osufunc.debug(ppcalcing, 'command', 'recent', input.obj.guildId, 'ppCalcing');

            if (curscore.accuracy < 1 && curscore.perfect == true) {
                fcflag = `FC\n**${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
            }
            if (curscore.perfect == false) {
                fcflag =
                    `\n**${ppcalcing[1].pp.toFixed(2)}**pp IF ${fcaccgr.accuracy.toFixed(2)}% FC
                **${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
            }
            if (curscore.perfect == true && curscore.accuracy == 1) {
                fcflag = 'FC'
            }


        } catch (error) {
            rspp =
                curscore.pp ?
                    curscore.pp.toFixed(2) :
                    NaN
            ppissue = 'Error - pp calculator could not calculate beatmap'
            osufunc.logCall(error)
        }
        const title =
            curbms.title == curbms.title_unicode ?
                curbms.title :
                `${curbms.title} (${curbms.title_unicode})`
        const artist =
            curbms.artist == curbms.artist_unicode ?
                curbms.artist :
                `${curbms.artist} (${curbms.artist_unicode})`
        const fulltitle = `${artist} - ${title} [${curbm.version}]`
        let trycount = 1
        for (let i = rsdata.length - 1; i > (page); i--) {
            if (curbm.id == rsdata[i].beatmap.id) {
                trycount++
            }
        }
        const trycountstr = `try #${trycount}`;

        rsEmbed
            .setTitle(`#${page + 1} most recent ${showFails == 1 ? 'play' : 'pass'} for ${curscore.user.username} | <t:${new Date(curscore.created_at).getTime() / 1000}:R>`)
            .setURL(`https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id}`)
            .setAuthor({
                name: `${trycountstr}`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${osudata?.avatar_url ?? def.images.any.url}`
            })
            .setThumbnail(`${curbms.covers.list}`)
            .setDescription(`
[${fulltitle}](https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods.length > 0 ? '+' + osumodcalc.OrderMods(curscore.mods.join('').toUpperCase()) : ''} 
${totaldiff}⭐ | ${emojis.gamemodes[curscore.mode]}
${new Date(curscore.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '')}
${filterTitle ? `Filter: ${filterTitle}` : ''}
`)
            .addFields([
                {
                    name: 'SCORE DETAILS',
                    value: `${(curscore.accuracy * 100).toFixed(2)}% | ${rsgrade}\n ${curscore.replay ? `[REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}` +
                        `${rspassinfo}\n${hitlist}\n${curscore.max_combo}x/**${mapdata.max_combo}x** combo`,
                    inline: true
                },
                {
                    name: 'PP',
                    value: `**${rspp}**pp ${fcflag}\n${ppissue}`,
                    inline: true
                }
            ])

        //if first page, disable previous button
        if (page == 0) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        } else {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(false);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(false);
        }

        //if last page, disable next button
        if (page >= rsdata.length - 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        } else {
            (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(false);
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(false);
        }


        osufunc.writePreviousId('map', input.obj.guildId, `${curbm.id}`)
        osufunc.writePreviousId('score', input.obj.guildId, JSON.stringify(curscore))
        osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`)

    } else if (list == true) {
        pgbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-recent-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.first),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-recent-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.previous),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-recent-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.search),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-recent-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.next),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-recent-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.last),
            )
        rsEmbed
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Recent ${showFails == 1 ? 'plays' : 'passes'} for ${osudata.username}`)
            .setThumbnail(`${osudata.avatar_url ?? def.images.any.url}`)
            ;
        if (sort == 'pp') {
            rsEmbed.setTitle(`Best recent ${showFails == 1 ? 'play' : 'passes'} for ${osudata.username}`)
        }

        const scoresarg = await embedStuff.scoreList(
            {
                scores: rsdata,
                detailed: false,
                showWeights: false,
                page: page,
                showMapTitle: true,
                showTruePosition: (sort != 'recent'),
                sort: sort,
                truePosType: 'recent',
                filteredMapper: null,
                filteredMods: null,
                filterMapTitle: filterTitle,
                reverse: false
            })
        if (scoresarg.fields.length == 0) {
            rsEmbed.addFields([{
                name: 'Error',
                value: 'No scores found',
                inline: false
            }]);
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        } else {
            for (let i = 0; scoresarg.fields.length > i; i++) {
                rsEmbed.addFields(scoresarg.fields[i])
            }
        }
        rsEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(rsdata.length / 5)}
${emojis.gamemodes[mode]}
${filterTitle ? `Filter: ${filterTitle}` : ''}
`)
        rsEmbed.setFooter({ text: `-` })
        if (scoresarg.isFirstPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }
        if (scoresarg.isLastPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }
    }
    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);

    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            osufunc.logCall(error)
        }
    }
    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [rsEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * parse replay file and return data
 */
export async function replayparse(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let replay;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
        } break;
    }


    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('replayparse', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, []),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    try {
        replay = replayparser.parseReplay('./files/replay.osr')
    } catch (err) {
        return;
    }
    osufunc.debug(replay, 'fileparse', 'replay', input.obj.guildId, 'replayData');

    let mapdata: osuApiTypes.Beatmap;
    let mapdataReq: osufunc.apiReturn;

    if (func.findFile(replay.beatmapMD5, `mapdata`) &&

        !('error' in func.findFile(replay.beatmapMD5, `mapdata`)) &&
        input.button != 'Refresh') {
        mapdataReq = func.findFile(replay.beatmapMD5, `mapdata`)
    } else {
        mapdataReq = await osufunc.apiget(
            {
                type: 'map_get_md5',
                params: {
                    md5: replay.beatmapMD5
                }
            })
    }
    mapdata = mapdataReq.apiData;
    func.storeFile(mapdataReq, replay.beatmapMD5, 'mapdata')

    osufunc.debug(mapdataReq, 'fileparse', 'replay', input.obj.guildId, 'mapData');
    if (mapdata?.id) {
        typeof mapdata.id == 'number' ? osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`) : ''
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(replay.playerName, 'osudata', osufunc.modeValidator('osu')) &&
        !('error' in func.findFile(replay.playerName, 'osudata', osufunc.modeValidator('osu'))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(replay.playerName, 'osudata', osufunc.modeValidator('osu'))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: replay.playerName,
                mode: osufunc.modeValidator('osu')
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(replay.gameMode))
    func.storeFile(osudataReq, replay.playerName, 'osudata', osufunc.modeValidator(replay.gameMode))
    osufunc.debug(osudataReq, 'fileparse', 'replay', input.obj.guildId, 'osuData');
    let userid: string | number;
    try {
        userid = osudata.id
    } catch (err) {
        userid = 0
        return
    }
    let mapbg: string;
    let mapcombo: string | number;
    let fulltitle: string;
    let mapdataid: string;
    try {
        mapbg = mapdata.beatmapset.covers['list@2x']
        fulltitle = `${mapdata.beatmapset.artist != mapdata.beatmapset.artist_unicode ? `${mapdata.beatmapset.artist} (${mapdata.beatmapset.artist_unicode})` : mapdata.beatmapset.artist}`
        fulltitle += ` - ${mapdata.beatmapset.title != mapdata.beatmapset.title_unicode ? `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})` : mapdata.beatmapset.title}`
            + ` [${mapdata.version}]`
        mapcombo = mapdata.max_combo ? mapdata.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : NaN
        mapdataid = 'https://osu.ppy.sh/b/' + mapdata.id
    } catch (error) {
        fulltitle = 'Unknown/unavailable map'
        mapbg = 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png';
        mapcombo = NaN
        mapdataid = 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png'
    }

    const mods = replay.mods
    let ifmods: string;
    if (mods != 0) {
        ifmods = `+${osumodcalc.ModIntToString(mods)}`
    } else {
        ifmods = ''
    }
    const gameMode = replay.gameMode
    let accuracy: number;
    let xpp: object;
    let hitlist: string;
    let fcacc: number;
    let ppissue: string;
    let totalhits = 0

    switch (gameMode) {
        case 0:
            hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
            accuracy = osumodcalc.calcgrade(replay.number_300s, replay.number_100s, replay.number_50s, replay.misses).accuracy
            fcacc = osumodcalc.calcgrade(replay.number_300s, replay.number_100s, replay.number_50s, 0).accuracy
            totalhits = replay.number_300s + replay.number_100s + replay.number_50s + replay.misses
            break;
        case 1:

            hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.misses}`
            accuracy = osumodcalc.calcgradeTaiko(replay.number_300s, replay.number_100s, replay.misses).accuracy
            fcacc = osumodcalc.calcgradeTaiko(replay.number_300s, replay.number_100s, 0).accuracy
            totalhits = replay.number_300s + replay.number_100s + replay.misses
            break;
        case 2:

            hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
            accuracy = osumodcalc.calcgradeCatch(replay.number_300s, replay.number_100s, replay.number_50s, replay.katus, replay.misses).accuracy
            fcacc = osumodcalc.calcgradeCatch(replay.number_300s, replay.number_100s, replay.number_50s, replay.katus, 0).accuracy
            totalhits = replay.number_300s + replay.number_100s + replay.number_50s + replay.katus + replay.misses
            break;
        case 3:

            hitlist = `${replay.gekis}/${replay.number_300s}/${replay.katus}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
            accuracy = osumodcalc.calcgradeMania(replay.gekis, replay.number_300s, replay.katus, replay.number_100s, replay.number_50s, replay.misses).accuracy
            fcacc = osumodcalc.calcgradeMania(replay.gekis, replay.number_300s, replay.katus, replay.number_100s, replay.number_50s, 0).accuracy
            totalhits = replay.gekis + replay.number_300s + replay.katus + replay.number_100s + replay.number_50s + replay.misses
            break;
    }
    const failed = totalhits == (mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners) ? false : true

    try {
        xpp = await osufunc.scorecalc({
            mods: osumodcalc.ModIntToString(replay.mods),
            gamemode: osumodcalc.ModeIntToName(replay.gameMode),
            mapid: mapdata.id,
            miss: replay.misses,
            acc: accuracy / 100,
            maxcombo: replay.max_combo,
            score: replay.score,
            calctype: 0,
            passedObj: totalhits,
        })
        ppissue = ''
    } catch (error) {
        xpp = [{
            pp: 0
        },
        {
            pp: 0
        }]
        ppissue = 'Error - could not fetch beatmap'
    }

    const lifebar = replay.life_bar.split('|')
    const lifebarF = []
    for (let i = 0; i < lifebar.length; i++) {
        lifebarF.push(lifebar[i].split(',')[0])
    }
    lifebarF.shift()

    const dataLabel = ['Start']

    for (let i = 0; i < lifebarF.length; i++) {
        dataLabel.push('')

    }

    dataLabel.push('end')

    const passper = Math.abs(totalhits / (mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners)) * 100

    const isfail = failed ?
        `${passper.toFixed(2)}% passed (${calc.secondsToTime(passper / 100 * mapdata.hit_length)}/${calc.secondsToTime(mapdata.hit_length)})`
        : ''

    const chart = await msgfunc.SendFileToChannel(input.graphChannel, await osufunc.graph(dataLabel, lifebarF, 'Health', null, null, null, null, null, 'replay'))
    const Embed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.score.dec)
        .setAuthor({ name: `${replay.playerName}'s replay`, iconURL: `https://a.ppy.sh/${userid}`, url: `https://osu.ppy.sh/users/${userid}` })
        .setTitle(`${fulltitle} ${ifmods}`)
        .setURL(`${mapdataid}`)
        .setThumbnail(mapbg)
        .setDescription(
            `
${replay.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${replay.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x/**${mapcombo}x** | ${accuracy.toFixed(2)}%
\`${hitlist}\`
${xpp[0].pp.toFixed(2)}pp | ${xpp[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC 
${ppissue}
${isfail}
`
        )
        .setImage(`${chart}`);

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embed]
        }
    })


    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * parse score and return data
 */
export async function scoreparse(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let scorelink: string;
    let scoremode: string;
    let scoreid: number | string;


    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
            scorelink = null;
            scoremode = input.args[1] ?? 'osu';
            scoreid = input.args[0];
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
            const messagenohttp = input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '')
            try {
                scorelink = messagenohttp.split('/scores/')[1]
                scoremode = scorelink.split('/')[0]
                scoreid = scorelink.split('/')[1]
            } catch (error) {
                return;
            }
        }
    }

    if (input.overrides != null) {
        if (input.overrides?.id != null) {
            scoreid = input.overrides.id
        }
        if (input.overrides?.mode != null) {
            scoremode = input.overrides.mode
        }
        if (input.overrides?.commanduser != null) {
            commanduser = input.overrides.commanduser
        }
        if (input.overrides?.commandAs != null) {
            input.commandType = input.overrides.commandAs
        }
    }


    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('scoreparse', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Score Link',
                value: `${scorelink}`
            },
            {
                name: 'Score Mode',
                value: `${scoremode}`
            },
            {
                name: 'Score ID',
                value: `${scoreid}`
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let scoredataReq: osufunc.apiReturn;
    let scoredata: osuApiTypes.Score;

    if (func.findFile(scoreid, 'scoredata') &&
        !('error' in func.findFile(scoreid, 'scoredata')) &&
        input.button != 'Refresh'
    ) {
        scoredataReq = func.findFile(scoreid, 'scoredata')
    } else {
        scoredataReq = await osufunc.apiget(
            {
                type: 'score',
                params: {
                    id: scoreid,
                    mode: osufunc.modeValidator(scoremode)
                }
            })
    }

    scoredata = scoredataReq.apiData


    if (scoredata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                content: 'Error - could not fetch score data',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()

        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not fetch score data for ${scoreid}
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }
    try {
        if (typeof scoredata?.error != 'undefined') {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({ content: 'This score is unsubmitted/failed/invalid and cannot be parsed', allowedMentions: { repliedUser: false } })
                .catch();
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Invalid score
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
    } catch (error) {
    }
    func.storeFile(scoredataReq, scoreid, 'scoredata')

    if (input.commandType == 'interaction' && input.overrides == null) {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({ content: "Loading...", allowedMentions: { repliedUser: false } })
            .catch();

    }

    osufunc.debug(scoredataReq, 'command', 'scoreparse', input.obj.guildId, 'scoreData');
    try {
        scoredata.rank.toUpperCase();
    } catch (error) {
        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({ content: 'This score is unsubmitted/failed/invalid and cannot be parsed', allowedMentions: { repliedUser: false } })
            .catch();
        return;
    }
    let mapdataReq: osufunc.apiReturn;
    if (func.findFile(scoredata.beatmap.id, 'mapdata') &&
        !('error' in func.findFile(scoredata.beatmap.id, 'mapdata')) &&
        input.button != 'Refresh') {
        mapdataReq = func.findFile(scoredata.beatmap.id, 'mapdata')
    } else {
        mapdataReq = await osufunc.apiget({
            type: 'map',
            params: {
                id: scoredata.beatmap.id,
            }
        })
    }

    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;

    if (mapdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: 'Error - could not fetch beatmap data',
                        allowedMentions: { repliedUser: false },
                    }).catch()
                }, 1000)
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: 'Error - could not fetch beatmap data',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmap data
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(mapdataReq, scoredata.beatmap.id, 'mapdata');

    const ranking = scoredata.rank ? scoredata.rank : 'f'
    let scoregrade = emojis.grades.F
    switch (ranking.toUpperCase()) {
        case 'F':
            scoregrade = emojis.grades.F
            break;
        case 'D':
            scoregrade = emojis.grades.D
            break;
        case 'C':
            scoregrade = emojis.grades.C
            break;
        case 'B':
            scoregrade = emojis.grades.B
            break;
        case 'A':
            scoregrade = emojis.grades.A
            break;
        case 'S':
            scoregrade = emojis.grades.S
            break;
        case 'SH':
            scoregrade = emojis.grades.SH
            break;
        case 'X':
            scoregrade = emojis.grades.X
            break;
        case 'XH':
            scoregrade = emojis.grades.XH

            break;
    }
    const gamehits = scoredata.statistics

    const mode = scoredata.mode
    let hitlist: string;
    let fcacc: number;
    let ppissue: string;

    if (mode == 'osu') {
        hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
        fcacc = osumodcalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
    }
    if (mode == 'taiko') {
        hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_miss}`
        fcacc = osumodcalc.calcgradeTaiko(gamehits.count_300, gamehits.count_100, gamehits.count_miss).accuracy

    }
    if (mode == 'fruits') {
        hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
        fcacc = osumodcalc.calcgradeCatch(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_katu, gamehits.count_miss).accuracy
    }
    if (mode == 'mania') {
        hitlist = `${gamehits.count_geki}/${gamehits.count_300}/${gamehits.count_katu}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
        fcacc = osumodcalc.calcgradeMania(gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
    }
    let ppcalcing: PerformanceAttributes[];
    try {
        ppcalcing = await osufunc.scorecalc({
            mods: scoredata.mods.join('').length > 1 ?
                scoredata.mods.join('') : 'NM',
            gamemode: scoredata.mode,
            mapid: scoredata.beatmap.id,
            miss: gamehits.count_miss,
            acc: scoredata.accuracy,
            maxcombo: scoredata.max_combo,
            score: scoredata.score,
            calctype: 0,
            passedObj: embedStuff.getTotalHits(scoredata.mode, scoredata),
        })

        ppissue = '';
        osufunc.debug(ppcalcing, 'command', 'scoreparse', input.obj.guildId, 'ppCalcing');
    } catch (error) {
        const ppComputedTemp: PerformanceAttributes = {
            mode: mapdata.mode_int,
            pp: 0,
            difficulty: {
                mode: mapdata.mode_int,
                stars: mapdata.difficulty_rating,
                maxCombo: mapdata.max_combo,
                aim: 0,
                speed: 0,
                flashlight: 0,
                sliderFactor: 0,
                speedNoteCount: 0,
                ar: mapdata.ar,
                od: mapdata.accuracy,
                nCircles: mapdata.count_circles,
                nSliders: mapdata.count_sliders,
                nSpinners: mapdata.count_spinners,
                stamina: 0,
                rhythm: 0,
                color: 0,
                hitWindow: 0,
                nFruits: mapdata.count_circles,
                nDroplets: mapdata.count_sliders,
                nTinyDroplets: mapdata.count_spinners,
            },
            ppAcc: 0,
            ppAim: 0,
            ppDifficulty: 0,
            ppFlashlight: 0,
            ppSpeed: 0,
            effectiveMissCount: 0,

        };
        ppcalcing = [
            ppComputedTemp,
            ppComputedTemp,
            ppComputedTemp
        ]
        ppissue = 'Error - pp calculator could not fetch beatmap'

    }

    let artist = scoredata.beatmapset.artist
    const artistuni = scoredata.beatmapset.artist_unicode
    let title = scoredata.beatmapset.title
    const titleuni = scoredata.beatmapset.title_unicode

    if (artist != artistuni) {
        artist = `${artist} (${artistuni})`
    }

    if (title != titleuni) {
        title = `${title} (${titleuni})`
    }
    let pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC`

    if (scoredata.accuracy == 1) {
        if (scoredata.perfect == true) {
            pptxt = `${ppcalcing[0].pp.toFixed(2)}pp`
        } else {
            pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC`
        }
    } else {
        if (scoredata.perfect == true) {
            pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[2].pp.toFixed(2)}pp if SS`
        } else {
            pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC | ${ppcalcing[2].pp.toFixed(2)}pp if SS`
        }
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(scoredata.user.username, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(scoredata.user.username, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(scoredata.user.username, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: scoredata.user.username,
                mode: osufunc.modeValidator(mode)
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'scoreparse', input.obj.guildId, 'osuData')
    if (osudata?.error) {
        if (input.commandType == 'interaction') {
            setTimeout(() => {
                (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                    content: `Error - could not find user \`${scoredata?.user?.username}\``,
                    allowedMentions: { repliedUser: false },
                })
            }, 1000);
        } else {
            (input.obj as Discord.Message<any>).reply({
                content: `Error - could not find user \`${scoredata?.user?.username}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, scoredata.user.username, 'osudata', osufunc.modeValidator(mode));

    const scoreembed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.score.dec)
        .setAuthor({
            name: `${osudata.username} (#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp)`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${osudata?.avatar_url ?? def.images.any.url}`
        })
        .setTitle(`${artist} - ${title}`)
        .setURL(`https://osu.ppy.sh/b/${scoredata.beatmap.id}`)
        .setThumbnail(`${scoredata.beatmapset.covers['list@2x']}`)
        .setDescription(`${scoredata.rank_global ? `\n#${scoredata.rank_global} global` : ''} ${scoredata.replay ? `| [REPLAY](https://osu.ppy.sh/scores/${scoredata.mode}/${scoredata.id}/download)` : ''}
${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade} ${scoredata.mods.join('').length > 1 ? '| ' + osumodcalc.OrderMods(scoredata.mods.join('') ): ''}
${new Date(scoredata.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '')} | <t:${Math.floor(new Date(scoredata.created_at).getTime() / 1000)}:R>
\`${hitlist}\`
${scoredata.max_combo}x/**${mapdata.max_combo}x**
${pptxt}\n${ppissue}
`)

    osufunc.writePreviousId('score', input.obj.guildId, JSON.stringify(scoredata, null, 2))
    osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`);

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [scoreembed],
            edit: true
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * list of user's scores on a map
 */
export async function scores(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user;
    let searchid;
    let mapid;
    let page = 1;

    const scoredetailed = false;
    let sort: embedStuff.scoreSort = 'recent';
    let reverse = false;
    let mode = 'osu';
    let filteredMapper = null;
    let filteredMods = null;

    let parseScore = false;
    let parseId = null;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true)
                parseId = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }

            input.args = cleanArgs(input.args);

            mapid = (await osufunc.mapIdFromLink(input.args.join(' '), true)).map
            if (mapid != null) {
                input.args.splice(input.args.indexOf(input.args.find(arg => arg.includes('https://osu.ppy.sh/'))), 1)
            }

            user = input.args.join(' ')

            if (!input.args[0] || input.args.join(' ').includes(searchid) || user == undefined) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.options.getString('username');
            mapid = input.obj.options.getNumber('id');
            sort = input.obj.options.getString('sort') as embedStuff.scoreSort;
            reverse = input.obj.options.getBoolean('reverse');

            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            page = 0;
            user = input.obj.message.embeds[0].author.name.split(' (#')[0]
            mapid = input.obj.message.embeds[0].url.split('osu.ppy.sh/')[1].split('/')[1]
            if (input.obj.message.embeds[0].description) {
                if (input.obj.message.embeds[0].description.includes('mapper')) {
                    filteredMapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }
                if (input.obj.message.embeds[0].description.includes('mods')) {
                    filteredMods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }
                const sort1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                switch (true) {
                    case sort1.includes('score'):
                        sort = 'score'
                        break;
                    case sort1.includes('acc'):
                        sort = 'acc'
                        break;
                    case sort1.includes('pp'):
                        sort = 'pp'
                        break;
                    case sort1.includes('old'): case sort1.includes('recent'):
                        sort = 'recent'
                        break;
                    case sort1.includes('combo'):
                        sort = 'combo'
                        break;
                    case sort1.includes('miss'):
                        sort = 'miss'
                        break;
                    case sort1.includes('rank'):
                        sort = 'rank'
                        break;

                }


                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses')) || (reverse1.includes('worst'))) {
                    reverse = true
                } else {
                    reverse = false
                }
                page = 0
                switch (input.button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
                        break;
                    case 'RightArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('/')[1].split('\n')[0])
                        break;
                    case 'Refresh':
                        page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1])
                        break;
                }
                mode = input.obj.message.embeds[0].description.split('mode: ')[1].split('\n')[0]
            }
            const pageParsed = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[0])
            page = 0
            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1
                    break;
                case 'LeftArrow':
                    page = pageParsed - 1
                    break;
                case 'RightArrow':
                    page = pageParsed + 1
                    break;
                case 'BigRightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])

                    break;
                default:
                    page = pageParsed
                    break;
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page
        }
        if (input.overrides.sort != null) {
            sort = input.overrides.sort
        }
        if (input.overrides.reverse != null) {
            reverse = input.overrides.reverse
        }
    }

    //==============================================================================================================================================================================================

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        )

    log.logFile(
        'command',
        log.commandLog('scores', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Sort',
                value: sort
            },
            {
                name: 'Reverse',
                value: reverse
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Parse',
                value: `${parseId}`
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first).setDisabled(false),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );


    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = osufunc.modeValidator(mode);

    if (!mapid || isNaN(mapid)) {
        mapid = osufunc.getPreviousId('map', input.obj.guildId);
    }

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'scores', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType == 'interaction') {
            setTimeout(() => {
                (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                })
            }, 1000);
        } else {
            (input.obj as Discord.Message<any>).reply({
                content: `Error - could not find user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;

    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode))
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode))

    let scoredataReq: osufunc.apiReturn;
    if (func.findFile(input.absoluteID, 'scores') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'scores')) &&
        input.button != 'Refresh'
    ) {
        scoredataReq = func.findFile(input.absoluteID, 'scores')
    } else {
        scoredataReq = await osufunc.apiget({
            type: 'user_get_scores_map',
            params: {
                userid: osudata.id,
                id: mapid,
            }
        })
    }

    const scoredataPresort: osuApiTypes.ScoreArrA = scoredataReq.apiData;

    osufunc.debug(scoredataReq, 'command', 'scores', input.obj.guildId, 'scoreDataPresort');

    if (scoredataPresort?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: 'Error - could not fetch scores',
                        allowedMentions: { repliedUser: false },
                    }).catch()
                }, 1000)
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: 'Error - could not fetch scores',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmap scores
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(scoredataReq, input.absoluteID, 'scores')

    const scoredata: osuApiTypes.Score[] = scoredataPresort.scores
    try {
        scoredata.length < 1
    } catch (error) {
        return (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
            content: `Error - no scores found for \`${user}\` on map \`${mapid}\``,
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        })
            .catch();
    }
    osufunc.debug(scoredataReq, 'command', 'scores', input.obj.guildId, 'scoreData');


    if (parseScore == true) {
        let pid = parseInt(parseId) - 1
        if (pid < 0) {
            pid = 0
        }
        if (pid > scoredata.length) {
            pid = scoredata.length - 1
        }
        input.overrides = {
            mode: scoredata?.[0]?.mode ?? 'osu',
            id: scoredata.slice().sort((a, b) =>
                parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', ''))
            )?.[pid]?.best_id,
            commanduser,
            commandAs: input.commandType
        }
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not find requested score`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not find requested score`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find requested score
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        input.commandType = 'other';
        await scoreparse(input)
        return;
    }

    let mapdataReq: osufunc.apiReturn;
    if (func.findFile(mapid, 'mapdata') &&
        !('error' in func.findFile(mapid, 'mapdata')) &&
        input.button != 'Refresh'
    ) {
        mapdataReq = func.findFile(mapid, 'mapdata')
    } else {
        mapdataReq = await osufunc.apiget({
            type: 'map',
            params: {
                id: mapid
            }
        })
    }
    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData

    osufunc.debug(mapdataReq, 'command', 'scores', input.obj.guildId, 'mapData');
    if (mapdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: 'Error - could not fetch beatmap data',
                        allowedMentions: { repliedUser: false },
                    }).catch()
                }, 1000)
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: 'Error - could not fetch beatmap data',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmap data
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(mapdataReq, mapid, 'mapdata')

    const title = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title})`;
    const artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist_unicode} (${mapdata.beatmapset.artist})`;


    const scoresEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`${artist} - ${title} [${mapdata.version}]`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setImage(`${mapdata.beatmapset.covers['cover@2x']}`)
        .setAuthor({
            name: `${osudata.username} (#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp)`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setURL(`https://osu.ppy.sh/b/${mapid}`)

    scoresEmbed.setFooter({ text: `Page ${page + 1}/${Math.ceil(scoredata.length / 5)}` })

    if (page >= Math.ceil(scoredata.length / 5)) {
        page = Math.ceil(scoredata.length / 5) - 1
    }

    const scoresarg = await embedStuff.scoreList(
        {
            scores: scoredata,
            detailed: scoredetailed,
            showWeights: false,
            page: page,
            showMapTitle: false,
            showTruePosition: false,
            sort: sort,
            truePosType: sort,
            filteredMapper: filteredMapper,
            filteredMods: filteredMods,
            filterMapTitle: null,
            reverse: reverse,
            mapidOverride: mapdata.id
        })
    scoresEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${scoresarg.maxPages}\nmode: ${mode}\n`)
    if (scoresarg.fields.length == 0) {
        scoresEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        for (let i = 0; i < scoresarg.fields.length && i < 5; i++) {
            scoresEmbed.addFields([scoresarg.fields[i]])
        }
    }


    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);
    osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`);

    if (scoresarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [scoresEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * statistics for scores
 */
export async function scorestats(input: extypes.commandInput) {

    let commanduser: Discord.User;
    type scoretypes = 'firsts' | 'best' | 'recent' | 'pinned'
    let scoreTypes: scoretypes = 'best';
    let user = null;
    let searchid;
    let mode: osuApiTypes.GameMode;

    let reachedMaxCount = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            if (input.args.includes('-firsts')) {
                scoreTypes = 'firsts'
                input.args.splice(input.args.indexOf('-firsts'), 1);
            }
            if (input.args.includes('-first')) {
                scoreTypes = 'firsts'
                input.args.splice(input.args.indexOf('-first'), 1);
            }
            if (input.args.includes('-globals')) {
                scoreTypes = 'firsts'
                input.args.splice(input.args.indexOf('-globals'), 1);
            }
            if (input.args.includes('-global')) {
                scoreTypes = 'firsts'
                input.args.splice(input.args.indexOf('-global'), 1);
            }
            if (input.args.includes('-osutop')) {
                scoreTypes = 'best'
                input.args.splice(input.args.indexOf('-osutop'), 1);
            }
            if (input.args.includes('-top')) {
                scoreTypes = 'best'
                input.args.splice(input.args.indexOf('-top'), 1);
            }
            if (input.args.includes('-recent')) {
                scoreTypes = 'recent'
                input.args.splice(input.args.indexOf('-recent'), 1);
            }
            if (input.args.includes('-r')) {
                scoreTypes = 'recent'
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-pinned')) {
                scoreTypes = 'pinned'
                input.args.splice(input.args.indexOf('-pinned'), 1);
            }
            if (input.args.includes('-pins')) {
                scoreTypes = 'pinned'
                input.args.splice(input.args.indexOf('-pins'), 1);
            }
            if (input.args.includes('-pin')) {
                scoreTypes = 'pinned'
                input.args.splice(input.args.indexOf('-pin'), 1);
            }

            input.args = cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            input.obj.options.getString('user') ? user = input.obj.options.getString('user') : null;
            input.obj.options.getString('type') ? scoreTypes = input.obj.options.getString('type') as scoretypes : null;
            input.obj.options.getString('mode') ? mode = input.obj.options.getString('mode') as osuApiTypes.GameMode : null;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.message.embeds[0].author.url.split('/u/')[1].split('/')[0];
            mode = input.obj.message.embeds[0].author.url.split('/u/')[1].split('/')[1] as osuApiTypes.GameMode;
            //user's {type} scores
            scoreTypes = input.obj.message.embeds[0].title.split(' scores')[0].split(' ')[0].toLowerCase() as scoretypes;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
    }
    if (input.overrides != null) {

    }
    //==============================================================================================================================================================================================

    //detailed button

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Details-scorestats-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailed),
        );


    log.logFile(
        'command',
        log.commandLog('scorestats', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Score Type',
                value: scoreTypes
            },
            {
                name: 'User',
                value: user
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Search ID',
                value: searchid
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = mode ? osufunc.modeValidator(mode) : null;

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'scorestats', input.obj.guildId, 'osuData');

    if (osudata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                content: `Error - could not fetch user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    if (!osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                content: `Error - could not fetch user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
        }
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    let scoresdata: osuApiTypes.Score[] & osuApiTypes.Error = [];

    async function getScoreCount(cinitnum) {
        const req: osufunc.apiReturn = await osufunc.apiget({
            type: scoreTypes,
            params: {
                userid: `${osudata.id}`,
                opts: [`offset=${cinitnum}`, 'limit=100', `mode=${osufunc.modeValidator(mode)}`],
            },
            version: 2,

        })
        const fd: osuApiTypes.Score[] & osuApiTypes.Error = req.apiData;
        if (fd?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not find user\'s ${scoreTypes} scores`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not find user\'s ${scoreTypes} scores`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user's ${scoreTypes} scores
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }
            await scoresdata.push(fd[i])
        }
        if (fd.length == 100 && (scoreTypes == 'firsts' || scoreTypes == 'pinned')) {
            reachedMaxCount = true;
        }
    }
    if (func.findFile(input.absoluteID, 'reqdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'reqdata')) &&
        input.button != 'Refresh'
    ) {
        scoresdata = func.findFile(input.absoluteID, 'reqdata')
    } else {
        await getScoreCount(0);
    }
    func.storeFile(scoresdata, input.absoluteID, 'reqdata')

    let useFiles: string[] = [];

    const Embed: Discord.EmbedBuilder = new Discord.EmbedBuilder()
        .setTitle(`Statistics for ${osudata.username}'s ${scoreTypes} scores`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${osudata.id}/${osufunc.modeValidator(mode)}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        });
    if (scoresdata.length == 0) {
        Embed.setDescription('No scores found')
    } else {
        Embed.setDescription(`${func.separateNum(scoresdata.length)} scores found\n${reachedMaxCount ? 'Only first 100 scores are calculated' : ''}`)
        const mappers = osufunc.CommonMappers(scoresdata);
        const mods = osufunc.CommonMods(scoresdata);
        const acc = osufunc.Stats(scoresdata.map(x =>x.accuracy));
        const pp = osufunc.Stats(scoresdata.map(x => x.pp));
        const combo = osufunc.Stats(scoresdata.map(x => x.max_combo));


        if (input.commandType == 'button') {
            let frmappertxt = ''
            let frmodstxt = ''
            for (let i = 0; i < mappers.length; i++) {
                frmappertxt += `#${i + 1}. ${mappers[i].mapper} - ${func.separateNum(mappers[i].count)} | ${mappers[i].percentage.toFixed(2)}%\n`
            }
            for (let i = 0; i < mods.length; i++) {
                frmodstxt += `#${i + 1}. ${mods[i].mods} - ${func.separateNum(mods[i].count)} | ${mods[i].percentage.toFixed(2)}%\n`
            }

            fs.writeFileSync(`cache/commandData/${input.absoluteID}Mappers.txt`, frmappertxt, 'utf-8')
            fs.writeFileSync(`cache/commandData/${input.absoluteID}Mods.txt`, frmodstxt, 'utf-8')
            useFiles = [`cache/commandData/${input.absoluteID}Mappers.txt`, `cache/commandData/${input.absoluteID}Mods.txt`]
        } else {
            let mappersStr = '';
            for (let i = 0; i < mappers.length && i < 5; i++) {
                mappersStr += `#${i + 1}. ${mappers[i].mapper} - ${func.separateNum(mappers[i].count)} | ${mappers[i].percentage.toFixed(2)}%\n`
            }
            let modsStr = '';
            for (let i = 0; i < mods.length && i < 5; i++) {
                modsStr += `#${i + 1}. ${mods[i].mods} - ${func.separateNum(mods[i].count)} | ${mods[i].percentage.toFixed(2)}%\n`
            }

            Embed.addFields([{
                name: 'Mappers',
                value: mappersStr,
                inline: true,
            },
            {
                name: 'Mods',
                value: modsStr,
                inline: true
            },
            {
                name: 'Accuracy',
                value: `
Highest: ${(acc?.highest * 100)?.toFixed(2)}%
Lowest: ${(acc?.lowest * 100)?.toFixed(2)}%
Average: ${(acc?.average * 100)?.toFixed(2)}%
${acc?.ignored > 0 ? `Skipped: ${acc?.ignored}` : ''}
`,
                inline: false
            },
            {
                name: 'PP',
                value: `
Highest: ${pp?.highest?.toFixed(2)}pp
Lowest: ${pp?.lowest?.toFixed(2)}pp
Average: ${pp?.average?.toFixed(2)}pp
${pp?.ignored > 0 ? `Skipped: ${pp?.ignored}` : ''}
`,
                inline: true
            },
            {
                name: 'Combo',
                value: `
Highest: ${combo?.highest}
Lowest: ${combo?.lowest}
Average: ${combo?.average}
${combo?.ignored > 0 ? `Skipped: ${combo?.ignored}` : ''}
`,
                inline: true
            }
            ])
        }
    }



    //SEND/EDIT MSG==============================================================================================================================================================================================
    if (input.commandType == 'button') {
        input.obj = input.obj as Discord.ButtonInteraction<any>;

        input.obj.reply({
            files: useFiles,
            ephemeral: true
        }).catch(error => {
            (input.obj as Discord.ButtonInteraction<any>).editReply({
                files: useFiles,
            })
        })


    } else {

        msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                embeds: [Embed],
                edit: true,
                components: [buttons],
                files: useFiles
            }
        })
    }

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}


/**
 * simulate play on a map
 */
export async function simulate(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let mapid = null;
    let mods = null;
    let acc = null;
    let combo = null;
    let n300 = null;
    let n100 = null;
    let n50 = null;
    let nMiss = null;
    let overrideSpeed = 1;
    let overrideBpm: number = null;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
            const ctn = input.obj.content;
            if (ctn.includes('-mods')) {
                const temp = func.parseArg(input.args, '-mods', 'string', mods);
                mods = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-acc')) {
                acc = parseFloat(input.args[input.args.indexOf('-acc') + 1])
                input.args.splice(input.args.indexOf('-acc'), 2)
                acc = parseFloat(ctn.split('acc=')[1].split(' ')[0])
            }
            if (ctn.includes('-accuracy')) {
                acc = parseFloat(input.args[input.args.indexOf('-accuracy') + 1])
                input.args.splice(input.args.indexOf('-accuracy'), 2)
            }
            if (ctn.includes('-combo')) {
                combo = parseInt(input.args[input.args.indexOf('-combo') + 1])
                input.args.splice(input.args.indexOf('-combo'), 2)
            }
            if (ctn.includes('-n300')) {
                n300 = parseInt(input.args[input.args.indexOf('-n300') + 1])
                input.args.splice(input.args.indexOf('-n300'), 2)
            }
            if (ctn.includes('-300s')) {
                n300 = parseInt(input.args[input.args.indexOf('-300s') + 1])
                input.args.splice(input.args.indexOf('-300s'), 2)
            }
            if (ctn.includes('-n100')) {
                n100 = parseInt(input.args[input.args.indexOf('-n100') + 1])
                input.args.splice(input.args.indexOf('-n100'), 2)
            }
            if (ctn.includes('-100s')) {
                n100 = parseInt(input.args[input.args.indexOf('-100s') + 1])
                input.args.splice(input.args.indexOf('-100s'), 2)
            }
            if (ctn.includes('-n50')) {
                n50 = parseInt(input.args[input.args.indexOf('-n50') + 1])
                input.args.splice(input.args.indexOf('-n50'), 2)
            }
            if (ctn.includes('-50s')) {
                n50 = parseInt(input.args[input.args.indexOf('-50s') + 1])
                input.args.splice(input.args.indexOf('-50s'), 2)
            }
            if (ctn.includes('-miss')) {
                nMiss = parseInt(input.args[input.args.indexOf('-miss') + 1])
                input.args.splice(input.args.indexOf('-miss'), 2)
            }
            if (ctn.includes('-misses')) {
                nMiss = parseInt(input.args[input.args.indexOf('-misses') + 1])
                input.args.splice(input.args.indexOf('-misses'), 2)
            }
            if (input.args.includes('-bpm')) {
                overrideBpm = parseFloat(input.args[input.args.indexOf('-bpm') + 1])
                input.args.splice(input.args.indexOf('-bpm'), 2)
            }
            if (input.args.includes('-speed')) {
                overrideSpeed = parseFloat(input.args[input.args.indexOf('-speed') + 1])
                input.args.splice(input.args.indexOf('-speed'), 2)
            }
            if (ctn.includes('mods=')) {
                mods = ctn.split('mods=')[1].split(' ')[0]
            }
            if (ctn.includes('acc=')) {
                acc = parseFloat(ctn.split('acc=')[1].split(' ')[0])
            }
            if (ctn.includes('accuracy=')) {
                acc = parseFloat(ctn.split('accuracy=')[1].split(' ')[0])
            }
            if (ctn.includes('combo=')) {
                combo = parseInt(ctn.split('combo=')[1].split(' ')[0])
            }
            if (ctn.includes('n300=')) {
                n300 = parseInt(ctn.split('n300=')[1].split(' ')[0])
            }
            if (ctn.includes('300s=')) {
                n300 = parseInt(ctn.split('300s=')[1].split(' ')[0])
            }
            if (ctn.includes('n100=')) {
                n100 = parseInt(ctn.split('n100=')[1].split(' ')[0])
            }
            if (ctn.includes('100s=')) {
                n100 = parseInt(ctn.split('100s=')[1].split(' ')[0])
            }
            if (ctn.includes('n50=')) {
                n50 = parseInt(ctn.split('n50=')[1].split(' ')[0])
            }
            if (ctn.includes('50s=')) {
                n50 = parseInt(ctn.split('50s=')[1].split(' ')[0])
            }
            if (ctn.includes('miss=')) {
                nMiss = parseInt(ctn.split('miss=')[1].split(' ')[0])
            }
            if (ctn.includes('misses=')) {
                nMiss = parseInt(ctn.split('misses=')[1].split(' ')[0])
            }
            if (input.args.includes('bpm=')) {
                overrideBpm = parseFloat(ctn.split('bpm=')[1].split(' ')[0])
            }
            if (input.args.includes('speed=')) {
                overrideSpeed = parseFloat(ctn.split('speed=')[1].split(' ')[0])
            }

            input.args = cleanArgs(input.args);

            if (isNaN(+input.args[0])) {
                mapid = +input.args[0]
            }
            if (ctn.includes('+')) {
                mods = ctn.split('+')[1].split(' ')[0]
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            mapid = input.obj.options.getInteger('id')
            mods = input.obj.options.getString('mods')
            acc = input.obj.options.getNumber('accuracy')
            combo = input.obj.options.getInteger('combo')
            n300 = input.obj.options.getInteger('n300')
            n100 = input.obj.options.getInteger('n100')
            n50 = input.obj.options.getInteger('n50')
            nMiss = input.obj.options.getInteger('miss')
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('simulate', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Mods',
                value: mods
            },
            {
                name: 'Accuracy',
                value: acc
            },
            {
                name: 'Combo',
                value: combo
            },
            {
                name: 'n300',
                value: n300
            },
            {
                name: 'n100',
                value: n100
            },
            {
                name: 'n50',
                value: n50
            },
            {
                name: 'Misses',
                value: nMiss
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (!mapid || isNaN(mapid)) {
        mapid = osufunc.getPreviousId('map', input.obj.guildId);
    }

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({ content: "Loading...", allowedMentions: { repliedUser: false } })
            .catch();

    }

    let mapdataReq: osufunc.apiReturn;

    if (func.findFile(mapid, 'mapdata') &&
        !('error' in func.findFile(mapid, 'mapdata')) &&
        input.button != 'Refresh') {
        mapdataReq = func.findFile(mapid, 'mapdata')
    } else {
        mapdataReq = await osufunc.apiget({
            type: 'map_get',
            params: {
                id: mapid
            }
        })
    }

    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;

    osufunc.debug(mapdataReq, 'command', 'map', input.obj.guildId, 'mapData');

    if (mapdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()

        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmap data
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }
    func.storeFile(mapdataReq, mapid, 'mapdata');



    if (!mods) {
        mods = 'NM'
    }
    if (!combo) {
        combo = mapdata.max_combo
    }

    if (overrideBpm && !overrideSpeed) {
        overrideSpeed = overrideBpm / mapdata.bpm
    }
    if (overrideSpeed && !overrideBpm) {
        overrideBpm = overrideSpeed * mapdata.bpm
    }

    if (mods.includes('DT') || mods.includes('NC')) {
        overrideSpeed = overrideSpeed * 1.5
    }
    if (mods.includes('HT')) {
        overrideSpeed = overrideSpeed * 0.75
    }

    const score = await osufunc.scorecalc({
        mods,
        gamemode: 'osu',
        mapid,
        hit300: n300,
        hit100: n100,
        hit50: n50,
        miss: nMiss,
        acc: acc / 100,
        maxcombo: combo,
        score: null,
        calctype: 0,
        clockRate: overrideSpeed
    });
    osufunc.debug(score, 'command', 'simulate', input.obj.guildId, 'ppCalc');

    const fcaccgr =
        osumodcalc.calcgrade(
            n300,
            n100,
            n50,
            0
        )
    const specAcc = isNaN(fcaccgr.accuracy) ?
        acc ?
            acc :
            100 :
        fcaccgr.accuracy

    const mapPerf = await osufunc.mapcalc({
        mods,
        gamemode: 'osu',
        mapid,
        calctype: 0,
        clockRate: 1
    });

    const title = mapdata.beatmapset?.title ?
        mapdata.beatmapset?.title != mapdata.beatmapset?.title_unicode ?
            `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title}) [${mapdata.version}]` :
            `${mapdata.beatmapset.title_unicode} [${mapdata.version}]` :
        'unknown map'

    const scoreEmbed = new Discord.EmbedBuilder()
        .setTitle(`Simulated play on ${title}`)
        .setURL(`https://osu.ppy.sh/b/${mapid}`)
        .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg` || `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
        .addFields([
            {
                name: 'Score Details',
                value:
                    `${acc ?? 100}% | ${nMiss ?? 0}x misses
${combo ?? mapdata.max_combo}x/**${mapdata.max_combo}**x
${mods ?? 'No mods'}
\`${n300}/${n100}/${n50}/${nMiss}\`
Speed: ${overrideSpeed ?? 1}x (${overrideBpm ?? mapdata.bpm}BPM)
`,
                inline: false
            },
            {
                name: 'Performance',
                value:
                    `
${score[0].pp?.toFixed(2)}pp | ${score[1].pp?.toFixed(2)}pp if ${(specAcc).toFixed(2)}% FC
SS: ${mapPerf[0].pp?.toFixed(2)}
99: ${mapPerf[1].pp?.toFixed(2)}
98: ${mapPerf[2].pp?.toFixed(2)}
97: ${mapPerf[3].pp?.toFixed(2)}
96: ${mapPerf[4].pp?.toFixed(2)}
95: ${mapPerf[5].pp?.toFixed(2)} 
`
            },
            {
                name: 'Map Details',
                value:
                    `
CS${mapdata.cs.toString().padEnd(5, ' ')}
AR${mapdata.ar.toString().padEnd(5, ' ')}
OD${mapdata.accuracy.toString().padEnd(5, ' ')}
HP${mapdata.drain.toString().padEnd(5, ' ')}
${emojis.mapobjs.total_length}${calc.secondsToTime(mapdata.total_length)}
                `,
                inline: true
            },
            {
                name: '-',
                value:
                    `
${emojis.mapobjs.circle}${mapdata.count_circles}
${emojis.mapobjs.slider}${mapdata.count_sliders}
${emojis.mapobjs.spinner}${mapdata.count_spinners}
${emojis.mapobjs.bpm}${mapdata.bpm}
                `,
                inline: true
            },
        ])

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [scoreEmbed],
            edit: true
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

//map

/**
 * parse map and return map data
 */
export async function map(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let mapid;
    let mapmods;
    let maptitleq: string = null;
    let detailed = false;
    let searchRestrict = 'any';
    let overrideSpeed = 1;
    let overrideBpm: number = null;

    const useComponents = [];
    let overwriteModal = null;

    let customCS: 'current' | number = 'current';
    let customAR: 'current' | number = 'current';
    let customOD: 'current' | number = 'current';
    let customHP: 'current' | number = 'current';


    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;

            if (input.args.includes('-detailed')) {
                detailed = true;
                input.args.splice(input.args.indexOf('-detailed'), 1)
            }
            if (input.args.includes('-d')) {
                detailed = true;
                input.args.splice(input.args.indexOf('-d'), 1)
            }
            if (input.args.includes('-bpm')) {
                const temp = func.parseArg(input.args, '-bpm', 'number', overrideBpm);
                overrideBpm = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-speed')) {
                const temp = func.parseArg(input.args, '-speed', 'number', overrideSpeed);
                overrideSpeed = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-cs')) {
                const temp = func.parseArg(input.args, '-cs', 'number', customCS);
                customCS = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-ar')) {
                const temp = func.parseArg(input.args, '-ar', 'number', customAR);
                customAR = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-od')) {
                const temp = func.parseArg(input.args, '-od', 'number', customOD);
                customOD = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-accuracy')) {
                const temp = func.parseArg(input.args, '-accuracy', 'number', customOD);
                customOD = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-hp')) {
                const temp = func.parseArg(input.args, '-hp', 'number', customHP);
                customHP = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-drain')) {
                const temp = func.parseArg(input.args, '-drain', 'number', customHP);
                customHP = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', maptitleq, true)
                maptitleq = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.join(' ').includes('"')) {
                maptitleq = input.args.join(' ').substring(
                    input.args.join(' ').indexOf('"') + 1,
                    input.args.join(' ').lastIndexOf('"')
                )
                input.args = input.args.join(' ').replace(maptitleq, '').split(' ')
            }
            if (input.args.join(' ').includes('+')) {
                mapmods = input.args.join(' ').split('+')[1]
                mapmods.includes(' ') ? mapmods = mapmods.split(' ')[0] : null;
                input.args = input.args.join(' ').replace('+', '').replace(mapmods, '').split(' ')
            }
            input.args = cleanArgs(input.args);

            mapid = (await osufunc.mapIdFromLink(input.args.join(' '), true)).map
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;

            mapid = input.obj.options.getInteger('id');
            mapmods = input.obj.options.getString('mods');
            detailed = input.obj.options.getBoolean('detailed');
            maptitleq = input.obj.options.getString('query');
            input.obj.options.getNumber('bpm') ? overrideBpm = input.obj.options.getNumber('bpm') : null;
            input.obj.options.getNumber('speed') ? overrideSpeed = input.obj.options.getNumber('speed') : null;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            const urlnohttp = input.obj.message.embeds[0].url.split('https://')[1];
            const setid = urlnohttp.split('/')[2].split('#')[0];
            const curid = urlnohttp.split('/')[3];
            mapid = curid;

            if (input.obj.message.embeds[0].fields[1].value.includes('aim') || input.obj.message.embeds[0].fields[0].value.includes('ms')) {
                detailed = true
            }
            mapmods = input.obj.message.embeds[0].title.split('+')[1];
            if (input.button == 'DetailEnable') {
                detailed = true;
            }
            if (input.button == 'DetailDisable') {
                detailed = false;
            }
            if (input.button == 'Refresh') {
                mapid = curid;
                detailed = input.obj.message.embeds[0].fields[1].value.includes('aim') || input.obj.message.embeds[0].fields[0].value.includes('ms')
            }
            if (input.obj.message.embeds[0].fields[0].value.includes('=>')) {
                overrideBpm = parseFloat(input.obj.message.embeds[0].fields[0].value.split('=>')[1].split('\n')[0])
            }
        }
            break;

        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;

            const messagenohttp = input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '')
            mapmods =
                input.obj.content.includes('+') ?
                    messagenohttp.split('+')[1] : 'NM';
            if (input.args[0] && input.args[0].startsWith('query')) {
                maptitleq = input.args[1]
            } else if (
                (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmapsets/') && messagenohttp.includes('#'))) ||
                (!messagenohttp.includes('/s/') && (messagenohttp.includes('/b/'))) ||
                (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmaps/')))
            ) {
                let idfirst;
                try {
                    if (messagenohttp.includes('beatmapsets')) {

                        idfirst = messagenohttp.split('#')[1].split('/')[1]
                    } else if (messagenohttp.includes('?')) {
                        idfirst = messagenohttp.split('beatmaps/')[1].split('?')[0]
                    }
                    else {
                        idfirst = messagenohttp.split('/')[messagenohttp.split('/').length - 1]
                    }
                    if (isNaN(+idfirst)) {
                        mapid = parseInt(idfirst.split(' ')[0])
                    } else {
                        mapid = parseInt(idfirst)
                    }
                } catch (error) {
                    (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                        content: 'Please enter a valid beatmap link.',
                        allowedMentions: { repliedUser: false }
                    })
                        .catch(error => { });
                    return;
                }
            } else if (messagenohttp.includes('q=')) {
                maptitleq =
                    messagenohttp.includes('&') ?
                        messagenohttp.split('q=')[1].split('&')[0] :
                        messagenohttp.split('q=')[1];
            } else {
                let setid = 910392;
                if (!messagenohttp.includes('/beatmapsets/')) {
                    setid = +messagenohttp.split('/s/')[1]

                    if (isNaN(setid)) {
                        setid = +messagenohttp.split('/s/')[1].split(' ')[0]
                    }
                } else if (!messagenohttp.includes('/s/')) {
                    setid = +messagenohttp.split('/beatmapsets/')[1]

                    if (isNaN(setid)) {
                        setid = +messagenohttp.split('/s/')[1].split(' ')[0]
                    }
                }
                let bmsdataReq: osufunc.apiReturn;
                if (func.findFile(setid, `bmsdata`) &&
                    !('error' in func.findFile(setid, `bmsdata`)) &&
                    input.button != 'Refresh') {
                    bmsdataReq = func.findFile(setid, `bmsdata`)
                } else {
                    bmsdataReq = await osufunc.apiget({
                        type: 'mapset_get',
                        params: {
                            id: setid
                        }
                    })
                    // bmsdataReq = await osufunc.apiget('mapset_get', `${setid}`)
                }

                const bmsdata: osuApiTypes.Beatmapset = bmsdataReq.apiData;
                if (bmsdata?.error) {
                    log.logFile('command',
                        `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmapset data
----------------------------------------------------
\n\n`,
                        { guildId: `${input.obj.guildId}` }
                    )
                    return;
                }
                try {
                    mapid = bmsdata.beatmaps[0].id;
                } catch (error) {
                    (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                        content: 'Please enter a valid beatmap link.',
                        allowedMentions: {
                            repliedUser: false
                        }
                    })
                        .catch(error => { });
                    return;
                }
            }
            if (input.args.includes('-bpm')) {
                const temp = func.parseArg(input.args, '-bpm', 'number', overrideBpm);
                overrideBpm = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-speed')) {
                const temp = func.parseArg(input.args, '-speed', 'number', overrideSpeed);
                overrideSpeed = temp.value;
                input.args = temp.newArgs;
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides?.overwriteModal != null) {
            overwriteModal = input?.overrides?.overwriteModal ?? overwriteModal
        }
        if (input.overrides?.id != null) {
            mapid = input?.overrides?.id ?? mapid
        }
        if (input.overrides?.commanduser != null) {
            commanduser = input.overrides.commanduser
        }
        if (input.overrides?.commandAs != null) {
            input.commandType = input.overrides.commandAs
        }
    }

    //==============================================================================================================================================================================================

    const buttons = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`Refresh-map-${commanduser.id}-${input.absoluteID}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.main.refresh),
    )

    log.logFile(
        'command',
        log.commandLog('map', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Map Mods',
                value: mapmods
            },
            {
                name: 'Map Title Query',
                value: maptitleq
            },
            {
                name: 'Detailed',
                value: `${detailed}`
            },
            {
                name: 'BPM',
                value: overrideBpm
            },
            {
                name: 'Speed',
                value: overrideSpeed
            },
            {
                name: 'cs',
                value: customCS
            },
            {
                name: 'ar',
                value: customAR
            },
            {
                name: 'od',
                value: customOD
            },
            {
                name: 'hp',
                value: customHP
            },
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================


    if (!mapid || isNaN(mapid)) {
        mapid = osufunc.getPreviousId('map', input.obj.guildId);
    }
    if (detailed == true) {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`DetailDisable-map-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailed)
        )
    } else {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`DetailEnable-map-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailed)
        )
    }
    let mapdataReq: osufunc.apiReturn;
    let mapdata: osuApiTypes.Beatmap;
    let bmsdataReq: osufunc.apiReturn;
    let bmsdata: osuApiTypes.Beatmapset;

    const inputModal = new Discord.SelectMenuBuilder()
        .setCustomId(`Select-map-${commanduser.id}-${input.absoluteID}`)
        .setPlaceholder('Select a map')

    //fetch map data and mapset data from id
    if (maptitleq == null) {
        if (func.findFile(mapid, 'mapdata') &&
            !('error' in func.findFile(mapid, 'mapdata')) &&
            input.button != 'Refresh') {
            mapdataReq = func.findFile(mapid, 'mapdata')
        } else {
            mapdataReq = await osufunc.apiget({
                type: 'map_get',
                params: {
                    id: mapid
                }
            })
        }

        mapdata = mapdataReq.apiData;


        osufunc.debug(mapdataReq, 'command', 'map', input.obj.guildId, 'mapData');

        if (mapdata?.error || !mapdata.id) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                    content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch();
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmap data
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }

        func.storeFile(mapdataReq, mapid, 'mapdata')

        if (func.findFile(mapdata.beatmapset_id, `bmsdata`) &&
            !('error' in func.findFile(mapdata.beatmapset_id, `bmsdata`)) &&
            input.button != 'Refresh') {
            bmsdataReq = func.findFile(mapdata.beatmapset_id, `bmsdata`)
        } else {
            bmsdataReq = await osufunc.apiget(
                {
                    type: 'mapset_get',
                    params: {
                        id: mapdata.beatmapset_id
                    }
                })
        }
        bmsdata = bmsdataReq.apiData;

        osufunc.debug(bmsdataReq, 'command', 'map', input.obj.guildId, 'bmsData');

        if (bmsdata?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                    content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmap data
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }

        func.storeFile(bmsdataReq, mapdata.beatmapset_id, `bmsdata`)

        //options thing to switch to other maps in the mapset
        if (typeof bmsdata?.beatmaps == 'undefined' || bmsdata?.beatmaps?.length < 2) {
            inputModal.addOptions(
                new Discord.SelectMenuOptionBuilder()
                    .setEmoji(`${mapdata.mode_int == 0 ? emojis.gamemodes.standard :
                        mapdata.mode_int == 1 ? emojis.gamemodes.taiko :
                            mapdata.mode_int == 2 ? emojis.gamemodes.fruits :
                                mapdata.mode_int == 3 ? emojis.gamemodes.mania :
                                    emojis.gamemodes.standard
                        }`)
                    .setLabel(`#${1}`)
                    .setDescription(`${mapdata.version} ${mapdata.difficulty_rating}⭐`)
                    .setValue(`${mapdata.id}`)
            )
        } else {
            for (let i = 0; i < bmsdata.beatmaps.length && i < 25; i++) {
                const curmap = bmsdata.beatmaps.slice().sort((a, b) => b.difficulty_rating - a.difficulty_rating)[i]
                if (!curmap) break;
                inputModal.addOptions(
                    new Discord.SelectMenuOptionBuilder()
                        .setEmoji(`${mapdata.mode_int == 0 ? emojis.gamemodes.standard :
                            mapdata.mode_int == 1 ? emojis.gamemodes.taiko :
                                mapdata.mode_int == 2 ? emojis.gamemodes.fruits :
                                    mapdata.mode_int == 3 ? emojis.gamemodes.mania :
                                        emojis.gamemodes.standard
                            }`)
                        .setLabel(`#${i + 1} | ${bmsdata.title}`)
                        .setDescription(`${curmap.version} ${curmap.difficulty_rating}⭐`)
                        .setValue(`${curmap.id}`)
                )
            }
        }
    }

    //fetch mapdata and mapset data from title query
    if (maptitleq != null) {
        const mapidtestReq = await osufunc.apiget({
            type: 'mapset_search',
            params: {
                searchString: maptitleq,
                opts: [`s=${searchRestrict}`]
            }
        })
        const mapidtest = mapidtestReq.apiData
        osufunc.debug(mapidtestReq, 'command', 'map', input.obj.guildId, 'mapIdTestData');

        if (mapidtest?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                    content: 'Error - could not fetch beatmap search data.',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmap data
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }

        let mapidtest2;

        if (mapidtest.length == 0) {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({ content: 'Error - map not found.\nNo maps found for the parameters: "' + maptitleq + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                .catch();

            return;
        }
        try {
            mapidtest2 = mapidtest.beatmapsets[0].beatmaps.sort((a, b) => a.difficulty_rating - b.difficulty_rating)
        } catch (error) {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({ content: 'Error - map not found.\nNo maps found for the parameters: "' + maptitleq + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                .catch();
            return;
        }
        const allmaps: { mode_int: number, map: osuApiTypes.BeatmapCompact, mapset: osuApiTypes.Beatmapset }[] = [];

        //get maps to add to options menu
        for (let i = 0; i < mapidtest.beatmapsets.length; i++) {
            if (!mapidtest.beatmapsets[i]) break;

            for (let j = 0; j < mapidtest.beatmapsets[i].beatmaps.length; j++) {
                if (!mapidtest.beatmapsets[i].beatmaps[j]) break;
                allmaps.push({
                    mode_int: mapidtest.beatmapsets[i].beatmaps[j].mode_int,
                    map: mapidtest.beatmapsets[i].beatmaps[j],
                    mapset: mapidtest.beatmapsets[i]
                })
            }
        }

        if (func.findFile(mapidtest2[0].id, 'mapdata') &&
            input.commandType == 'button' &&
            !('error' in func.findFile(mapidtest2[0].id, 'mapdata')) &&
            input.button != 'Refresh') {
            mapdataReq = func.findFile(mapidtest2[0].id, 'mapdata')
        } else {
            mapdataReq = await osufunc.apiget({
                type: 'map_get',
                params: {
                    id: mapidtest2[0].id
                }
            })
            // mapdataReq = await osufunc.apiget('map_get', `${mapidtest2[0].id}`)
        }

        mapdata = mapdataReq.apiData

        osufunc.debug(mapdataReq, 'command', 'map', input.obj.guildId, 'mapData');
        if (mapdata?.error || !mapdata.id) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                    content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                });
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find beatmap data
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }

        func.storeFile(mapdataReq, mapidtest2[0].id, 'mapdata')

        //options menu to switch to other maps
        for (let i = 0; i < allmaps.length && i < 25; i++) {
            const curmap = allmaps[i]
            if (!curmap.map) break;
            inputModal.addOptions(
                new Discord.SelectMenuOptionBuilder()
                    .setEmoji(`${curmap.mode_int == 0 ? emojis.gamemodes.standard :
                        curmap.mode_int == 1 ? emojis.gamemodes.taiko :
                            curmap.mode_int == 2 ? emojis.gamemodes.fruits :
                                curmap.mode_int == 3 ? emojis.gamemodes.mania :
                                    emojis.gamemodes.standard
                        }`)
                    .setLabel(`#${i + 1} | ${curmap.mapset?.title} // ${curmap.mapset?.creator}`)
                    .setDescription(`[${curmap.map.version}] ${curmap.map.difficulty_rating}⭐`)
                    .setValue(`${curmap.map.id}`)
            )
        }
    }


    //parsing maps
    if (mapmods == null || mapmods == '') {
        mapmods = 'NM';
    }
    else {
        mapmods = osumodcalc.OrderMods(mapmods.toUpperCase());
    }
    let statusimg = emojis.rankedstatus.graveyard;
    if (input.commandType == 'interaction' && input?.overrides?.commandAs == null) {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: "Loading...",
            allowedMentions: { repliedUser: false }
        })
            .catch();

    }
    switch (mapdata.status) {
        case 'ranked':
            statusimg = emojis.rankedstatus.ranked;
            break;
        case 'approved': case 'qualified':
            statusimg = emojis.rankedstatus.approved;
            break;
        case 'loved':
            statusimg = emojis.rankedstatus.loved;
            break;
    }

    if (customCS == 'current' || isNaN(+customCS)) {
        customCS = mapdata.cs
    }
    if (customAR == 'current' || isNaN(+customAR)) {
        customAR = mapdata.ar
    }
    if (customOD == 'current' || isNaN(+customOD)) {
        customOD = mapdata.accuracy
    }
    if (customHP == 'current' || isNaN(+customHP)) {
        customHP = mapdata.drain
    }

    let hitlength = mapdata.hit_length

    if (overrideBpm != null && isNaN(overrideBpm) == false && (overrideSpeed == null || isNaN(overrideSpeed) == true) && overrideBpm != mapdata.bpm) {
        overrideSpeed = overrideBpm / mapdata.bpm;
    }
    if (overrideSpeed != null && isNaN(overrideSpeed) == false && (overrideBpm == null || isNaN(overrideBpm) == true) && overrideSpeed != 1) {
        overrideBpm = mapdata.bpm * overrideSpeed;
    }
    if (mapmods.includes('DT') || mapmods.includes('NC')) {
        overrideSpeed *= 1.5;
        overrideBpm *= 1.5;
    }
    if (mapmods.includes('HT')) {
        overrideSpeed *= 0.75;
        overrideBpm *= 0.75;
    }
    if (overrideSpeed) {
        hitlength /= overrideSpeed
    }

    const allvals = osumodcalc.calcValues(
        +customCS,
        +customAR,
        +customOD,
        +customHP,
        overrideBpm ?? mapdata.bpm,
        hitlength,
        mapmods
    )
    let modissue = ''
    if (mapmods.includes('TD')) {
        modissue = '\ncalculations aren\'t supported for TD'
    }
    let mapimg = emojis.gamemodes.standard;

    switch (mapdata.mode) {
        case 'taiko':
            mapimg = emojis.gamemodes.taiko;
            break;
        case 'fruits':
            mapimg = emojis.gamemodes.fruits;
            break;
        case 'mania':
            mapimg = emojis.gamemodes.mania;
            break;
    }
    let ppComputed: PerformanceAttributes[];
    let ppissue: string;
    let totaldiff: string | number = mapdata.difficulty_rating;

    try {
        ppComputed = await osufunc.mapcalc({
            mods: mapmods,
            gamemode: mapdata.mode,
            mapid: mapdata.id,
            calctype: 0,
            clockRate: overrideSpeed ?? 1,
            customCS,
            customAR,
            customOD,
            customHP
        });
        ppissue = '';
        try {
            totaldiff = ppComputed[0].difficulty.stars?.toFixed(2)
        } catch (error) {
            totaldiff = mapdata.difficulty_rating;
        }
        osufunc.debug(ppComputed, 'command', 'map', input.obj.guildId, 'ppCalc');

    } catch (error) {
        ppissue = 'Error - pp could not be calculated';
        const tstmods = mapmods.toUpperCase();

        if (tstmods.includes('EZ') || tstmods.includes('HR')) {
            ppissue += '\nInvalid mod combinations: EZ + HR';
        }
        if ((tstmods.includes('DT') || tstmods.includes('NC')) && tstmods.includes('HT')) {
            ppissue += '\nInvalid mod combinations: DT/NC + HT';
        }
        const ppComputedTemp: PerformanceAttributes = {
            mode: mapdata.mode_int,
            pp: 0,
            difficulty: {
                mode: mapdata.mode_int,
                stars: mapdata.difficulty_rating,
                maxCombo: mapdata.max_combo,
                aim: 0,
                speed: 0,
                flashlight: 0,
                sliderFactor: 0,
                speedNoteCount: 0,
                ar: mapdata.ar,
                od: mapdata.accuracy,
                nCircles: mapdata.count_circles,
                nSliders: mapdata.count_sliders,
                nSpinners: mapdata.count_spinners,
                stamina: 0,
                rhythm: 0,
                color: 0,
                hitWindow: 0,
                nFruits: mapdata.count_circles,
                nDroplets: mapdata.count_sliders,
                nTinyDroplets: mapdata.count_spinners,
            },
            ppAcc: 0,
            ppAim: 0,
            ppDifficulty: 0,
            ppFlashlight: 0,
            ppSpeed: 0,
            effectiveMissCount: 0,

        };
        ppComputed = [
            ppComputedTemp,
            ppComputedTemp,
            ppComputedTemp,
            ppComputedTemp,
            ppComputedTemp,
            ppComputedTemp,
        ]
    }
    const baseCS = allvals.cs != mapdata.cs ? `${mapdata.cs}=>${allvals.cs}` : allvals.cs
    const baseAR = allvals.ar != mapdata.ar ? `${mapdata.ar}=>${allvals.ar}` : allvals.ar
    const baseOD = allvals.od != mapdata.accuracy ? `${mapdata.accuracy}=>${allvals.od}` : allvals.od
    const baseHP = allvals.hp != mapdata.drain ? `${mapdata.drain}=>${allvals.hp}` : allvals.hp
    const baseBPM = mapdata.bpm * (overrideSpeed ?? 1) != mapdata.bpm ? `${mapdata.bpm}=>${mapdata.bpm * (overrideSpeed ?? 1)}` : mapdata.bpm

    let basicvals = `CS${baseCS}\n AR${baseAR}\n OD${baseOD}\n HP${baseHP}\n`;
    if (detailed == true) {
        basicvals =
            `CS${baseCS} (${allvals.details.csRadius?.toFixed(2)}r)
AR${baseAR}  (${allvals.details.arMs?.toFixed(2)}ms)
OD${baseOD} (300: ${allvals.details.odMs.hitwindow_300?.toFixed(2)}ms 100: ${allvals.details.odMs.hitwindow_100?.toFixed(2)}ms 50:  ${allvals.details.odMs.hitwindow_50?.toFixed(2)}ms)
HP${baseHP}`
    }

    const mapname = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title})`;
    const artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist_unicode} (${mapdata.beatmapset.artist})`;
    const maptitle: string = mapmods ? `${artist} - ${mapname} [${mapdata.version}] +${mapmods}` : `${artist} - ${mapname} [${mapdata.version}]`

    let mapperdataReq: osufunc.apiReturn;
    let mapperdata: osuApiTypes.User;
    if (func.findFile(mapdata.beatmapset.user_id, `osudata`) &&
        !('error' in func.findFile(mapdata.beatmapset.user_id, `osudata`)) &&
        input.button != 'Refresh') {
        mapperdataReq = func.findFile(mapdata.beatmapset.user_id, `osudata`)
    } else {
        mapperdataReq = await osufunc.apiget(
            {
                type: 'user',
                params: {
                    userid: mapdata.beatmapset.user_id,
                }
            })
    }

    mapperdata = mapperdataReq.apiData;


    osufunc.debug(mapperdataReq, 'command', 'map', input.obj.guildId, 'mapperData');

    if (mapperdata?.error) {
        mapperdata = JSON.parse(fs.readFileSync('./files/defaults/mapper.json', 'utf8'));
        // if (commandType != 'button' && commandType != 'link') {
        //     (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
        //         content: 'Error - could not find mapper',
        //         allowedMentions: { repliedUser: false },
        //         failIfNotExists: true
        //     })
        // }
        // return;
        log.logFile('command',
            `
----------------------------------------------------
Command Error
ID: ${input.absoluteID}
Could not find mapper data
Using default json file
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
    }
    func.storeFile(mapperdataReq, mapperdata.id, `osudata`)

    const strains = await osufunc.straincalc(mapdata.id, mapmods, 0, mapdata.mode)
    try {
        osufunc.debug(strains, 'command', 'map', input.obj.guildId, 'strains');

    } catch (error) {
        osufunc.debug({ error: error }, 'command', 'map', input.obj.guildId, 'strains');
    }
    let mapgraph;
    if (strains) {
        mapgraph = await msgfunc.SendFileToChannel(input.graphChannel, await osufunc.graph(strains.strainTime, strains.value, 'Strains', null, null, null, null, null, 'strains'))
    } else {
        mapgraph = null
    }
    let detailedmapdata = '-';
    if (detailed == true) {
        switch (mapdata.mode) {
            case 'osu': {
                const curattr = ppComputed as OsuPerformanceAttributes[]
                detailedmapdata = `**SS**: ${curattr[0].pp?.toFixed(2)} | Aim: ${curattr[0].ppAim?.toFixed(2)} | Speed: ${curattr[0].ppSpeed?.toFixed(2)} | Acc: ${curattr[0].ppAcc?.toFixed(2)} \n ` +
                    `**99**: ${curattr[1].pp?.toFixed(2)} | Aim: ${curattr[1].ppAim?.toFixed(2)} | Speed: ${curattr[1].ppSpeed?.toFixed(2)} | Acc: ${curattr[1].ppAcc?.toFixed(2)} \n ` +
                    `**97**: ${curattr[3].pp?.toFixed(2)} | Aim: ${curattr[3].ppAim?.toFixed(2)} | Speed: ${curattr[3].ppSpeed?.toFixed(2)} | Acc: ${curattr[3].ppAcc?.toFixed(2)} \n ` +
                    `**95**: ${curattr[5].pp?.toFixed(2)} | Aim: ${curattr[5].ppAim?.toFixed(2)} | Speed: ${curattr[5].ppSpeed?.toFixed(2)} | Acc: ${curattr[5].ppAcc?.toFixed(2)} \n ` +
                    `${modissue}\n${ppissue}`
            }
                break;
            case 'taiko': {
                const curattr = ppComputed as TaikoPerformanceAttributes[]
                detailedmapdata = `**SS**: ${curattr[0].pp?.toFixed(2)} | Acc: ${curattr[0].ppAcc?.toFixed(2)} | Strain: ${curattr[0].ppDifficulty?.toFixed(2)} \n ` +
                    `**99**: ${curattr[1].pp?.toFixed(2)} | Acc: ${curattr[1].ppAcc?.toFixed(2)} | Strain: ${curattr[1]?.ppDifficulty?.toFixed(2)} \n ` +
                    `**97**: ${curattr[3].pp?.toFixed(2)} | Acc: ${curattr[3].ppAcc?.toFixed(2)} | Strain: ${curattr[3]?.ppDifficulty?.toFixed(2)} \n ` +
                    `**95**: ${curattr[5].pp?.toFixed(2)} | Acc: ${curattr[5].ppAcc?.toFixed(2)} | Strain: ${curattr[5]?.ppDifficulty?.toFixed(2)} \n ` +
                    `${modissue}\n${ppissue}`
            }
                break;
            case 'fruits': {
                const curattr = ppComputed as CatchPerformanceAttributes[]
                detailedmapdata = `**SS**: ${curattr[0].pp?.toFixed(2)} | Strain: ${curattr[0].ppDifficulty?.toFixed(2)} \n ` +
                    `**99**: ${curattr[1].pp?.toFixed(2)} | Strain: ${curattr[1]?.ppDifficulty?.toFixed(2)} \n ` +
                    `**97**: ${curattr[3].pp?.toFixed(2)} | Strain: ${curattr[3]?.ppDifficulty?.toFixed(2)} \n ` +
                    `**95**: ${curattr[5].pp?.toFixed(2)} | Strain: ${curattr[5]?.ppDifficulty?.toFixed(2)} \n ` +
                    `${modissue}\n${ppissue}`
            }
                break;
            case 'mania': {
                const curattr = ppComputed as ManiaPerformanceAttributes[]
                detailedmapdata = `**SS**: ${curattr[0].pp?.toFixed(2)} \n ` +
                    `**99**: ${curattr[1].pp?.toFixed(2)} \n ` +
                    `**98**: ${curattr[2].pp?.toFixed(2)} \n ` +
                    `**97**: ${curattr[3].pp?.toFixed(2)} \n ` +
                    `**96**: ${curattr[4].pp?.toFixed(2)} \n ` +
                    `**95**: ${curattr[5].pp?.toFixed(2)} \n ` +
                    `${modissue}\n${ppissue}`
            }
                break;

        }
    }

    const exMapDetails = `${func.separateNum(mapdata.playcount)} plays | ${func.separateNum(mapdata.beatmapset.play_count)} mapset plays | ${func.separateNum(mapdata.passcount)} passes | ${func.separateNum(mapdata.beatmapset.favourite_count)} favourites\n` +
        `Submitted <t:${new Date(mapdata.beatmapset.submitted_date).getTime() / 1000}:R> | Last updated <t:${new Date(mapdata.beatmapset.last_updated).getTime() / 1000}:R>
    ${mapdata.status == 'ranked' ?
            `Ranked <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
        }${mapdata.status == 'approved' || mapdata.status == 'qualified' ?
            `Approved/Qualified <t: ${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
        }${mapdata.status == 'loved' ?
            `Loved <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
        }\n` +
        `${mapdata.beatmapset.video == true ? '📺' : ''} ${mapdata.beatmapset.storyboard == true ? '🎨' : ''}`

    const Embed = new Discord.EmbedBuilder()
        .setColor(0x91ff9a)
        .setTitle(maptitle)
        .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${mapdata.mode}/${mapdata.id}`)
        .setAuthor({
            name: `${mapdata.beatmapset.creator}`,
            url: `https://osu.ppy.sh/u/${mapperdata.id}`,
            iconURL: `${mapperdata?.avatar_url ?? def.images.any.url}`,
        })
        .setThumbnail(osufunc.getMapImages(mapdata.beatmapset_id).list2x)
        .addFields([
            {
                name: 'MAP VALUES',
                value:
                    `${basicvals} ${totaldiff}⭐\n` +
                    `${emojis.mapobjs.bpm}${baseBPM}\n` +
                    `${emojis.mapobjs.circle}${mapdata.count_circles} \n${emojis.mapobjs.slider}${mapdata.count_sliders} \n${emojis.mapobjs.spinner}${mapdata.count_spinners}\n` +
                    `${emojis.mapobjs.total_length}${allvals.length != mapdata.hit_length ? `${allvals.details.lengthFull}(${calc.secondsToTime(mapdata.hit_length)})` : allvals.details.lengthFull}\n` +
                    `${mapdata.max_combo}x combo`,
                inline: true
            },
            {
                name: 'PP',
                value:
                    detailed != true ?
                        `SS: ${ppComputed[0].pp?.toFixed(2)} \n ` +
                        `99: ${ppComputed[1].pp?.toFixed(2)} \n ` +
                        `98: ${ppComputed[2].pp?.toFixed(2)} \n ` +
                        `97: ${ppComputed[3].pp?.toFixed(2)} \n ` +
                        `96: ${ppComputed[4].pp?.toFixed(2)} \n ` +
                        `95: ${ppComputed[5].pp?.toFixed(2)} \n ` +
                        `${modissue}\n${ppissue}` :
                        detailedmapdata
                ,
                inline: true
            },
            {
                name: 'DOWNLOAD',
                value:
                    `[osu!](https://osu.ppy.sh/b/${mapdata.id}) | [Chimu](https://api.chimu.moe/v1/download${mapdata.beatmapset_id}) | [Beatconnect](https://beatconnect.io/b/${mapdata.beatmapset_id}) | [Kitsu](https://kitsu.io/d/${mapdata.beatmapset_id})\n` +
                    `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapdata.id})`,
                inline: true
            },
            {
                name: 'MAP DETAILS',
                value: `${statusimg} | ${mapimg} \n ` +
                    `${detailed == true ?
                        exMapDetails
                        : ''}`

                ,
                inline: false
            }
        ])
    if (mapgraph) {
        Embed.setImage(`${mapgraph}`)
    }
    switch (true) {
        case parseFloat(totaldiff.toString()) >= 8:
            Embed.setColor(colours.diffcolour[7].dec)
            break;
        case parseFloat(totaldiff.toString()) >= 7:
            Embed.setColor(colours.diffcolour[6].dec)
            break;
        case parseFloat(totaldiff.toString()) >= 6:
            Embed.setColor(colours.diffcolour[5].dec)
            break;
        case parseFloat(totaldiff.toString()) >= 4.5:
            Embed.setColor(colours.diffcolour[4].dec)
            break;
        case parseFloat(totaldiff.toString()) >= 3.25:
            Embed.setColor(colours.diffcolour[3].dec)
            break;
        case parseFloat(totaldiff.toString()) >= 2.5:
            Embed.setColor(colours.diffcolour[2].dec)
            break;
        case parseFloat(totaldiff.toString()) >= 2:
            Embed.setColor(colours.diffcolour[1].dec)
            break;
        case parseFloat(totaldiff.toString()) >= 1.5:
            Embed.setColor(colours.diffcolour[0].dec)
            break;
        default:
            Embed.setColor(colours.diffcolour[0].dec)
            break;
    }
    const embeds = [Embed];

    if (detailed == true) {
        const failval = mapdata.failtimes.fail;
        const exitval = mapdata.failtimes.exit;
        const numofval = [];
        for (let i = 0; i < failval.length; i++) {
            numofval.push(i)
        }

        const passurl = await msgfunc.SendFileToChannel(input.graphChannel, await osufunc.graph(numofval, failval, 'Fails', true, false, false, false, true, 'bar', true, exitval, 'Exits'));
        const passEmbed = new Discord.EmbedBuilder()
            .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${mapdata.mode}/${mapdata.id}`)
            .setImage(`${passurl}`);
        await embeds.push(passEmbed);
    }

    osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`);


    useComponents.push(buttons);

    let frmod = inputModal;
    if (overwriteModal != null) {
        frmod = overwriteModal
    }

    const selectrow = new Discord.ActionRowBuilder()
        .addComponents(frmod)

    if (!(inputModal.options.length < 1)) {
        useComponents.push(selectrow);
    }

    osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`);


    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: embeds,
            components: useComponents,
            edit: true
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * parse .osu file and return data
 */
export async function maplocal(input: extypes.commandInput) {

    let commanduser: Discord.User;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
        } break;
    }

    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('localmapparse', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, []),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let map: string = ''
    if (fs.existsSync('./files/tempdiff.osu')) {
        map = fs.readFileSync('./files/tempdiff.osu', 'utf-8')
    } else {
        return;
    }
    const errmap = fs.readFileSync('./files/errmap.osu', 'utf-8')
    let errtxt = '';
    let mods = 'NM'

    if ((input.obj as Discord.Message<any>).content.includes('+')) {
        mods = (input.obj as Discord.Message<any>).content.split('+')[1].split(' ')[0]
    }

    try {
        map.split('[HitObjects]')[1].split('\n')
    } catch (error) {
        errtxt += '\nError - invalid section: [HitObjects]'
    }
    let metadata;
    try {
        metadata = map.split('[Metadata]')[1].split('[')[0]
    } catch (error) {
        errtxt += '\nError - invalid section: [Metadata]'
        metadata = errmap.split('[Metadata]')[1].split('[')[0]
    }
    let ppcalcing: PerformanceAttributes[];
    try {
        ppcalcing = await osufunc.mapcalclocal(mods, 'osu', null, 0)
    } catch (error) {
        ppcalcing = await osufunc.mapcalclocal(mods, 'osu', './files/errmap.osu', 0)
        errtxt += '\nError - pp calculations failed'
    }

    let general;
    let diff;
    try {
        general = map.split('[General]')[1].split('[')[0]
        diff = map.split('[Difficulty]')[1].split('[')[0]
    } catch (error) {
        errtxt += '\nError - invalid section: [General] or [Difficulty]'

        general = errmap.split('[General]')[1].split('[')[0]
        diff = errmap.split('[Difficulty]')[1].split('[')[0]
    }
    let title;
    let artist;
    let creator;
    let version;
    try {
        title = metadata.split('Title:')[1].split('\n')[0]
            ==
            metadata.split('Title:')[1].split('\n')[0]
            ?
            metadata.split('TitleUnicode:')[1].split('\n')[0] :
            `${metadata.split('Title:')[1].split('\n')[0]} (${metadata.split('TitleUnicode:')[1].split('\n')[0]})`
        artist = metadata.split('Artist:')[1].split('\n')[0]
            ==
            metadata.split('ArtistUnicode:')[1].split('\n')[0]
            ?
            metadata.split('ArtistUnicode:')[1].split('\n')[0] :
            `${metadata.split('Artist:')[1].split('\n')[0]} (${metadata.split('ArtistUnicode:')[1].split('\n')[0]})`

        creator = metadata.split('Creator:')[1].split('\n')[0]
        version = metadata.split('Version:')[1].split('\n')[0]
    } catch (error) {
        errtxt += '\nError - invalid section: [Metadata]'

        title = errmap.split('Title:')[1].split('\n')[0]
            == errmap.split('TitleUnicode:')[1].split('\n')[0] ?
            errmap.split('TitleUnicode:')[1].split('\n')[0] :
            `${errmap.split('Title:')[1].split('\n')[0]} (${errmap.split('TitleUnicode:')[1].split('\n')[0]})`
        artist = errmap.split('Artist:')[1].split('\n')[0]
            == errmap.split('ArtistUnicode:')[1].split('\n')[0] ?
            errmap.split('ArtistUnicode:')[1].split('\n')[0] :
            `${errmap.split('Artist:')[1].split('\n')[0]} (${errmap.split('ArtistUnicode:')[1].split('\n')[0]})`
        creator = errmap.split('Creator:')[1].split('\n')[0]
        version = errmap.split('Version:')[1].split('\n')[0]
    }
    const ftstr = `${artist} - ${title} [${version}] //${creator} ${mods ? `+${mods}` : ''}`
    let hitobjs;
    try {
        hitobjs = map.split('[HitObjects]')[1].split('\n')
    } catch (error) {
        errtxt += '\nError - invalid section: [HitObjects]'

        hitobjs = errmap.split('[HitObjects]')[1].split('\n')
    }
    let countcircle = 0
    let countslider = 0
    let countspinner = 0
    //to get count_circle, get every line without a |
    try {
        for (let i = 0; i < hitobjs.length; i++) {
            const curobj = hitobjs[i]
            if (curobj.includes('|')) {
                countslider++
            } else if (curobj.split(',').length > 5) {
                countspinner++
            } else {
                countcircle++
            }
        }
    } catch (error) {
        errtxt += '\nError - invalid section: [HitObjects] (counting objects)'

        for (let i = 0; i < errmap.split('[HitObjects]')[1].split('\n').length; i++) {
            const curobj = errmap.split('[HitObjects]')[1].split('\n')[i]
            if (curobj.includes('|')) {
                countslider++
            } else if (curobj.split(',').length > 5) {
                countspinner++
            } else {
                countcircle++
            }
        }
    }

    let firsttimep;
    let fintimep;
    try {
        firsttimep = hitobjs[1].split(',')[2]
        fintimep = hitobjs[hitobjs.length - 2].split(',')[2] //inaccurate cos of sliders n stuff
    } catch (error) {
        errtxt += '\nError - invalid section: [HitObjects] (getting object timings)'

        firsttimep = errmap.split('[HitObjects]')[1].split('\n')[1].split(',')[2]
        fintimep = errmap.split('[HitObjects]')[1].split('\n')[errmap.split('[HitObjects]').length - 2].split(',')[2] //inaccurate cos of sliders n stuff                                                                            
    }
    const mslen = parseInt(fintimep) - parseInt(firsttimep)

    const nlength = mslen / 1000
    const truelen = nlength > 60 ? // if length over 60
        nlength % 60 < 10 ? //if length over 60 and seconds under 10
            Math.floor(nlength / 60) + ':0' + Math.floor(nlength % 60) : //seconds under 10
            Math.floor(nlength / 60) + ':' + Math.floor(nlength % 60) //seconds over 10
        : //false
        nlength % 60 < 10 ? //length under 60 and 10
            '00:' + Math.floor(nlength) : //true
            '00:' + Math.floor(nlength) //false

    let bpm = NaN

    let timing;
    try {
        timing = map.split('[TimingPoints]')[1].split('[')[0]
    } catch (error) {
        errtxt += '\nError - invalid section: [TimingPoints]'

        timing = errmap.split('[TimingPoints]')[1].split('[')[0]
    }
    function pointToBPM(point: string) {
        const arr = point.split(',')
        //'a,b,c'
        //b is time in milliseconds between each beat
        //https://osu.ppy.sh/community/forums/topics/59274?n=4
        const bpm = 60000 / parseInt(arr[1])
        return bpm;
    }
    let totalpoints = 0
    let bpmmax = 0
    let bpmmin = 0
    for (let i = 0; i < timing.split('\n').length; i++) {
        const curpoint = timing.split('\n')[i]
        if (curpoint.includes(',')) {
            if (curpoint.includes('-')) {
                break;
            }
            bpm = pointToBPM(curpoint)
            totalpoints++
            if (bpm > bpmmax) {
                bpmmax = bpm
            }
            if (bpm < bpmmin || bpmmin == 0) {
                bpmmin = bpm
            }
        }
    }
    const bpmavg = bpm / totalpoints

        ;
    let gm = '0'
    try {
        gm = general.split('Mode:')[1].split('\n')[0].replaceAll(' ', '')
    } catch (error) {
        gm = '0'
    }
    let strains;
    let mapgraph
    try {
        strains = await osufunc.straincalclocal(null, mods, 0, osumodcalc.ModeIntToName(parseInt(gm)))
    } catch (error) {
        errtxt += '\nError - strains calculation failed'

        strains = {
            strainTime: [0, 0],
            value: [0, 0]
        }

        strains = await osufunc.straincalclocal('./files/errmap.osu', mods, 0, osumodcalc.ModeIntToName(parseInt(gm)))

    }

    osufunc.debug(strains, 'fileparse', 'osu', input.obj.guildId, 'strains');
    try {
        mapgraph = await msgfunc.SendFileToChannel(input.graphChannel, await osufunc.graph(strains.strainTime, strains.value, 'Strains', null, null, null, null, null, 'strains'));
    } catch (error) {
        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Error - calculating strain graph.',
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        })
    }
    let osuEmbed;
    try {
        osuEmbed = new Discord.EmbedBuilder()
            .setTitle(`${ftstr}`)
            .addFields([
                {
                    name: 'MAP VALUES',
                    value:
                        `
CS${diff.split('CircleSize:')[1].split('\n')[0]} AR${diff.split('ApproachRate:')[1].split('\n')[0]} OD${diff.split('OverallDifficulty:')[1].split('\n')[0]} HP${diff.split('HPDrainRate:')[1].split('\n')[0]}
${emojis.mapobjs.circle}${countcircle}
${emojis.mapobjs.slider}${countslider}
${emojis.mapobjs.spinner}${countspinner}
${emojis.mapobjs.total_length}${truelen}
${emojis.mapobjs.bpm}${bpmmax.toFixed(2)} - ${bpmmin.toFixed(2)} (${bpmavg.toFixed(2)})
${errtxt.length > 0 ? `${errtxt}` : ''}
`,
                    inline: true
                },
                {
                    name: 'PP',
                    value:
                        `SS: ${ppcalcing[0].pp.toFixed(2)} \n ` +
                        `99: ${ppcalcing[1].pp.toFixed(2)} \n ` +
                        `98: ${ppcalcing[2].pp.toFixed(2)} \n ` +
                        `97: ${ppcalcing[3].pp.toFixed(2)} \n ` +
                        `96: ${ppcalcing[4].pp.toFixed(2)} \n ` +
                        `95: ${ppcalcing[5].pp.toFixed(2)} \n `,
                    inline: true
                }
            ])
            .setImage(`${mapgraph}`)
    } catch (error) {
        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Error - unknown',
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        })
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [osuEmbed]
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )
}

/**
 * list of user's maps
 */
export async function userBeatmaps(input: extypes.commandInput) {
    let filter: 'favourite' | 'graveyard' | 'loved' | 'pending' | 'ranked' | 'nominated' = 'favourite';
    let sort:
        'title' | 'artist' |
        'difficulty' | 'status' |
        'fails' | 'plays' |
        'dateadded' | 'favourites' | 'bpm' |
        'cs' | 'ar' | 'od' | 'hp' | 'length' = 'dateadded';
    let reverse = false;
    let user;
    let searchid;
    let page = 1;
    let parseMap = false;
    let parseId;
    let filterTitle = null;

    let commanduser: Discord.User;
    let reachedMaxCount = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value
                input.args = temp.newArgs
            }

            if (input.args.includes('-ranked')) {
                filter = 'ranked';
                input.args.splice(input.args.indexOf('-ranked'), 1);
            }
            if (input.args.includes('-rank')) {
                filter = 'ranked';
                input.args.splice(input.args.indexOf('-rank'), 1);
            }
            if (input.args.includes('-favourites')) {
                filter = 'favourite';
                input.args.splice(input.args.indexOf('-favourites'), 1);
            }
            if (input.args.includes('-favourite')) {
                filter = 'favourite';
                input.args.splice(input.args.indexOf('-favourite'), 1);
            }
            if (input.args.includes('-fav')) {
                filter = 'favourite';
                input.args.splice(input.args.indexOf('-fav'), 1);
            }
            if (input.args.includes('-graveyard')) {
                filter = 'graveyard';
                input.args.splice(input.args.indexOf('-graveyard'), 1);
            }
            if (input.args.includes('-grave')) {
                filter = 'graveyard';
                input.args.splice(input.args.indexOf('-grave'), 1);
            }
            if (input.args.includes('-loved')) {
                filter = 'loved';
                input.args.splice(input.args.indexOf('-loved'), 1);
            }
            if (input.args.includes('-pending')) {
                filter = 'pending';
                input.args.splice(input.args.indexOf('-pending'), 1);
            }
            if (input.args.includes('-nominated')) {
                filter = 'nominated';
                input.args.splice(input.args.indexOf('-nominated'), 1);
            }
            if (input.args.includes('-bn')) {
                filter = 'nominated';
                input.args.splice(input.args.indexOf('-bn'), 1);
            }

            if (input.args.includes('-reverse')) {
                reverse = true;
                input.args.splice(input.args.indexOf('-reverse'), 1);
            }
            if (input.args.includes('-parse')) {
                parseMap = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true)
                parseId = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', filterTitle, true)
                filterTitle = temp.value;
                input.args = temp.newArgs;
            }

            input.args = cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.options.getString('user') ?? null;
            //@ts-expect-error string not assignable blah blah
            filter = input.obj.options.getString('type') ?? 'favourite';
            //@ts-expect-error string not assignable blah blah
            sort = input.obj.options.getString('sort') ?? 'dateadded';

            reverse = input.obj.options.getBoolean('reverse') ?? false;

            filterTitle = input.obj.options.getString('filter');

            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseMap = true
            }

        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            const curembed: Discord.Embed = input.obj.message.embeds[0];
            if (!curembed) return;
            user = curembed.author.url.split('u/')[1]
            sort = 'dateadded';
            //@ts-expect-error string not assignable blah blah
            filter = curembed.title.split('Maps')[0].split('\'s')[1].toLowerCase().replaceAll(' ', '')
            const curpage = parseInt(
                curembed.description.split('Page: ')[1].split('/')[0]
            )


            curembed.description.includes('Filter:') ?
                filterTitle = curembed.description.split('Filter: ')[1].split('\n')[0] :
                null;

            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1
                    break;
                case 'LeftArrow':
                    page = curpage - 1
                    break;
                case 'RightArrow':
                    page = curpage + 1
                    break;
                case 'BigRightArrow':
                    page = parseInt(
                        curembed.description.split('Page: ')[1].split('/')[1].split('\n')[0]
                    )
                    break;
                default:
                    page = curpage
                    break;
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page) {
            page = input.overrides.page;
        }
    }
    //==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-userbeatmaps-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.first),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-userbeatmaps-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-userbeatmaps-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-userbeatmaps-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-userbeatmaps-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.page.last),
        );

    log.logFile(
        'command',
        log.commandLog('userbeatmaps', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Type',
                value: filter
            },
            {
                name: 'Reverse',
                value: `${reverse}`
            },
            {
                name: 'Page',
                value: `${page}`
            },
            {
                name: 'Sort',
                value: sort
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    if (input.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
        }).catch()
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator('osu')) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator('osu'))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator('osu'))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator('osu')
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    osufunc.debug(osudataReq, 'command', 'userbeatmaps', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType == 'interaction') {
            setTimeout(() => {
                (input.obj as Discord.ChatInputCommandInteraction<any>).reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                })
            }, 1000);
        } else {
            (input.obj as Discord.Message<any>).reply({
                content: `Error - could not find user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator('osu'));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator('osu'));

    let maplistdata: osuApiTypes.Beatmapset[] & osuApiTypes.Error = []

    async function getScoreCount(cinitnum) {
        if (cinitnum >= 499) {
            reachedMaxCount = true;
            return;
        }
        const fdReq: osufunc.apiReturn = await osufunc.apiget({
            type: 'user_get_maps',
            params: {
                userid: osudata.id,
                category: filter,
                opts: [`offset=${cinitnum}`]
            },
            version: 2,

        })
        const fd: osuApiTypes.Beatmapset[] & osuApiTypes.Error = fdReq.apiData;
        if (fd?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not find user's ${calc.toCapital(filter)} maps`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not find user's ${calc.toCapital(filter)} maps`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user's ${calc.toCapital(filter)} maps
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }
            maplistdata.push(fd[i])
        }
        if (fd.length == 100) {
            await getScoreCount(cinitnum + 100)
        }

    }

    if (func.findFile(input.absoluteID, 'maplistdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'maplistdata')) &&
        input.button != 'Refresh'
    ) {
        maplistdata = func.findFile(input.absoluteID, 'maplistdata')
    } else {
        await getScoreCount(0);
    }

    osufunc.debug(maplistdata, 'command', 'userbeatmaps', input.obj.guildId, 'mapListData');
    func.storeFile(maplistdata, input.absoluteID, 'maplistdata');

    if (filterTitle) {
        maplistdata = maplistdata.filter((map) =>
            (
                map.title.toLowerCase().replaceAll(' ', '')
                +
                map.artist.toLowerCase().replaceAll(' ', '')
                +
                map.beatmaps.map(x => x.version).join('').toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            map.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            map.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            map.beatmaps.map(x => x.version).join('').toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(map.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(map.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(map.beatmaps.map(x => x.version).join('').toLowerCase().replaceAll(' ', ''))
        )
    }

    if (parseMap == true) {
        let pid = parseInt(parseId) - 1
        if (pid < 0) {
            pid = 0;
        }
        if (pid > maplistdata.length) {
            pid = maplistdata.length - 1;
        }
        input.overrides = {
            id: maplistdata[pid]?.beatmaps[0]?.id,
            commanduser,
            commandAs: input.commandType
        }
        if (input.overrides.id == null) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                            content: `Error - could not find map`,
                            allowedMentions: { repliedUser: false },
                        }).catch()
                    }, 1000)
                } else {
                    (input.obj as Discord.Message<any>).reply({
                        content: `Error - could not find map`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            log.logFile('command',
                `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find map
----------------------------------------------------
\n\n`,
                { guildId: `${input.obj.guildId}` }
            )
            return;
        }
        input.commandType = 'other';
        await map(input)
        return;
    }

    if (page >= Math.ceil(maplistdata.length / 5)) {
        page = Math.ceil(maplistdata.length / 5) - 1
    }

    const mapList = new Discord.EmbedBuilder()
        .setTitle(`${osudata.username}'s ${calc.toCapital(filter)} Maps`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setColor(colours.embedColour.userlist.dec);

    const mapsarg = await embedStuff.mapList({
        type: 'mapset',
        maps: maplistdata,
        page: page,
        sort,
        reverse,
    })

    if (mapsarg.fields.length == 0) {
        mapList.addFields([{
            name: 'Error',
            value: 'No mapsets found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        for (let i = 0; i < mapsarg.fields.length; i++) {
            mapList.addFields([mapsarg.fields[i]])
        }
    }
    if (mapsarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (mapsarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    mapList.setDescription(`
${mapsarg.filter}
Page: ${page + 1}/${Math.ceil(mapsarg.maxPages)}
${filterTitle ? `Filter: ${filterTitle}` : ''}
${reachedMaxCount ? 'Only the first 500 mapsets are shown' : ''}
`)

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            edit: true,
            embeds: [mapList],
            components: [pgbuttons]
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )


}


//tracking

/**
 * add user to tracking list
 */
export async function trackadd(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user;
    let mode: osuApiTypes.GameMode = 'osu';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'), 1)
            }
            user = input.args[0];
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            user = input.obj.options.getString('user');

        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('track add', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'user',
                value: `${user}`
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const guildsetting = await input.guildSettings.findOne({
        where: { guildId: input.obj.guildId }
    })

    if (!guildsetting.dataValues.trackChannel) {
        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
            content: 'The current guild does not have a tracking channel',
            embeds: [],
            files: [],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        }).catch()
        return;
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', mode) &&
        !('error' in func.findFile(user, 'osudata', mode)) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', mode)
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: mode
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    let replymsg;

    if (osudata?.error || !osudata.id) {
        replymsg = `Error - could not find user \`${user}\``
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
    } else {

        replymsg = `Added \`${osudata.username}\` to the tracking list\nGamemode: \`${mode}\``

        func.storeFile(osudataReq, osudata.id, 'osudata', mode);
        func.storeFile(osudataReq, user, 'osudata', mode);

        trackfunc.editTrackUser({
            database: input.trackDb,
            userid: osudata.id,
            action: 'add',
            guildId: input.obj.guildId,
            guildSettings: input.guildSettings,
            mode: mode
        })
    }
    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: replymsg,
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * remove user from tracking list
 */
export async function trackremove(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let user;
    let mode: osuApiTypes.GameMode = 'osu';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'), 1)
            }
            user = input.args[0];
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            user = input.obj.options.getString('user');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('track remove', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'user',
                value: `${user}`
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    // const guildsetting = await input.guildSettings.findOne({
    //     where: { guildId: input.obj.guildId }
    // })

    // if (!guildsetting.dataValues.trackChannel) {
    //     (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
    //         content: 'The current guild does not have a tracking channel',
    //         embeds: [],
    //         files: [],
    //         allowedMentions: { repliedUser: false },
    //         failIfNotExists: true
    //     }).catch()
    //     return;
    // }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', mode) &&
        !('error' in func.findFile(user, 'osudata', mode)) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', mode)
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    let replymsg;

    if (osudata?.error || !osudata.id) {
        replymsg = `Error - could not find user \`${user}\``
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
    } else {

        replymsg = `Removed \`${osudata.username}\` from the tracking list`

        func.storeFile(osudataReq, osudata.id, 'osudata', mode)
        func.storeFile(osudataReq, user, 'osudata', mode)

        trackfunc.editTrackUser({
            database: input.trackDb,
            userid: osudata.id,
            action: 'remove',
            guildId: input.obj.guildId,
            guildSettings: input.guildSettings,
            mode
        })
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: replymsg,
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * channel to send tracking updates to
 */
export async function trackchannel(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let channelId;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
            channelId = input.args[0];
            if (input.obj.content.includes('<#')) {
                channelId = input.obj.content.split('<#')[1].split('>')[0]
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            channelId = (input.obj.options.getChannel('channel')).id;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('set channel', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Channel id',
                value: `${channelId}`
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const guildsetting = await input.guildSettings.findOne({ where: { guildid: input.obj.guildId } });

    if (!channelId) {
        //the current channel is...
        if (!guildsetting.dataValues.trackChannel) {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                content: 'The current guild does not have a tracking channel',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
            return;
        }
        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
            content: `The current tracking channel is <#${guildsetting.dataValues.trackChannel}>`,
            embeds: [],
            files: [],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        }).catch()
        return;
    }

    if (!channelId || isNaN(+channelId) || !input.client.channels.cache.get(channelId)) {
        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
            content: 'Please provide a valid channel ID',
            embeds: [],
            files: [],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        }).catch()
        return;
    }

    // guildsetting.dataValues.trackChannel = channelId;
    await guildsetting.update({
        trackChannel: channelId
    }, {
        where: { guildid: input.obj.guildId }
    })

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: `Tracking channel set to <#${channelId}>`,
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * list of users being tracked
 */
export async function tracklist(input: extypes.commandInput) {


    let commanduser: Discord.User;


    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
    }
    //==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-tracklist-${commanduser.id}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji('⬅')
            /* .setLabel('Start') */,
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-tracklist-${commanduser.id}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji('◀'),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-tracklist-${commanduser.id}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji('▶')
            /* .setLabel('Next') */,
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-tracklist-${commanduser.id}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji('➡')
            /* .setLabel('End') */,
        );

    log.logFile(
        'command',
        log.commandLog('track list', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, []),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const users = await input.trackDb.findAll();
    const useridsarraylen = await input.trackDb.count();
    // const user: extypes.dbUser = userids[i].dataValues;

    const userList: {
        osuid: string,
        userid: string,
        mode: string,
    }[] = [];


    for (let i = 0; i < useridsarraylen; i++) {
        const user = users[i].dataValues;
        let guilds
        try {
            if (user.guilds.length < 3) throw new Error('no guilds');
            guilds = user.guilds.includes(',')
                ? user.guilds.split(',') :
                [user.guilds];

        } catch (error) {
            guilds = [];
        }

        //check if input.obj.guildId is in guilds
        if (guilds.includes(input.obj.guildId)) {
            userList.push({
                osuid: `${user.osuid}`,
                userid: `${user.userid}`,
                mode: `${user.mode}`
            })
        }
    }
    const userListEmbed = new Discord.EmbedBuilder()
        .setTitle(`All tracked users in ${input.obj.guild.name}`)
        .setColor(colours.embedColour.userlist.dec)
        .setDescription(`There are ${userList.length} users being tracked in this server\n\n` +
            `${userList.map((user, i) => `${i + 1}. [${user.mode}]https://osu.ppy.sh/u/${user.osuid}`).join('\n')}`
        )

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [userListEmbed],
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )
}

//other

/**
 * compare stats/plays
 */
export async function compare(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let type: 'profile' | 'top' | 'mapscore' = 'profile';
    let first = null;
    let second = null;
    let firstsearchid = null;
    let secondsearchid = null;
    let mode = 'osu';
    let page = 0;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            if (input.obj.mentions.users.size > 1) {
                firstsearchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
                secondsearchid = input.obj.mentions.users.size > 1 ? input.obj.mentions.users.at(1).id : null;
            } else if (input.obj.mentions.users.size == 1) {
                firstsearchid = input.obj.author.id;
                secondsearchid = input.obj.mentions.users.at(0).id
            } else {
                firstsearchid = input.obj.author.id
            }
            first = null;
            second = input.args[0] ?? null;
            if (input.args[1]) {
                first = input.args[0];
                second = input.args[1];
            }
            first != null && first.includes(firstsearchid) ? first = null : null;
            second != null && second.includes(secondsearchid) ? second = null : null;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);

            commanduser = input.obj.member.user;
            //@ts-expect-error string not assignable blah blah
            type = input.obj.options.getString('type') ?? 'profile';
            first = input.obj.options.getString('first');
            second = input.obj.options.getString('second');
            firstsearchid = commanduser.id
            mode = input.obj.options.getString('mode') ?? 'osu'
            if (second == null && first != null) {
                second = first;
                first = null;
            }
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);

            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            type = 'top';
            const pawge = parseInt(input.obj.message.embeds[0].description.split('Page: ')[1].split('/')[0])

            const pagefin = parseInt(input.obj.message.embeds[0].description.split('Page: ')[1].split('/')[1])
            switch (input.button) {
                case 'BigLeftArrow': {
                    page = 0;
                }
                    break;
                case 'LeftArrow': {
                    page = pawge - 1;
                }
                    break;
                case 'RightArrow': {
                    page = pawge + 1;
                }
                    break;
                case 'BigRightArrow': {
                    page = pagefin;
                }
                    break;
                case 'Refresh': {
                    page = pawge;
                }
                    break;
            }

            if (page > pagefin) page = pagefin;


            const firsti = input.obj.message.embeds[0].description.split('and')[0]
            const secondi = input.obj.message.embeds[0].description.split('and')[1].split('have')[0]

            //user => [name](url)
            first = firsti.split('u/')[1].split(')')[0];
            second = secondi.split('u/')[1].split(')')[0];
        }
            break;
    }
    if (input.overrides != null) {
        //@ts-expect-error string not assignable blah blah
        if (input.overrides.type != null) type = input.overrides.type;
    }
    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('compare', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'First',
                value: first
            },
            {
                name: 'Second',
                value: second
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'FirstSearchId',
                value: firstsearchid
            },
            {
                name: 'SecondSearchId',
                value: secondsearchid
            },
            {
                name: 'Page',
                value: page
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let fieldFirst: Discord.EmbedField = {
        name: 'First',
        value: 'Loading...',
        inline: true
    }
    let fieldSecond: Discord.EmbedField = {
        name: 'Second',
        value: 'Loading...',
        inline: true
    }
    let fieldComparison: Discord.EmbedField = {
        name: 'Comparison',
        value: 'Loading...',
        inline: false
    }
    let embedTitle: string = 'w';
    const usefields: Discord.EmbedField[] = []

    const useComponents: Discord.ActionRowBuilder[] = []
    let embedescription = null;

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--

    try {
        if (second == null) {
            if (secondsearchid) {
                const cuser = await osufunc.searchUser(secondsearchid, input.userdata, true);
                second = cuser.username;
                if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                    if (input.commandType != 'button') {
                        throw new Error('Second user not found')
                    }
                    return;
                }
            } else {
                if (osufunc.getPreviousId('user', `${input.obj.guildId}`) == null) {
                    throw new Error('Second user not found')
                }
                second = osufunc.getPreviousId('user', `${input.obj.guildId}`)
            }
        }
        if (first == null) {
            if (firstsearchid) {
                const cuser = await osufunc.searchUser(firstsearchid, input.userdata, true);
                first = cuser.username;
                if (mode == null) {
                    mode = cuser.gamemode;
                }
                if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                    if (input.commandType != 'button') {
                        throw new Error('First user not found')
                    }
                    return;
                }
            } else {
                throw new Error('first user not found')
            }
        }

        let firstuserReq: osufunc.apiReturn;
        if (func.findFile(first, 'osudata') &&
            !('error' in func.findFile(first, 'osudata')) &&
            input.button != 'Refresh'
        ) {
            firstuserReq = func.findFile(first, 'osudata')
        } else {
            firstuserReq = await osufunc.apiget(
                {
                    type: 'user',
                    params: {
                        username: first
                    }
                })
        }

        const firstuser = firstuserReq.apiData

        if (firstuser?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                throw new Error('could not fetch first user data')

            }
            return;
        }


        let seconduserReq: osufunc.apiReturn;
        if (func.findFile(second, 'osudata') &&
            !('error' in func.findFile(second, 'osudata')) &&
            input.button != 'Refresh'
        ) {
            seconduserReq = func.findFile(second, 'osudata')
        } else {
            seconduserReq = await osufunc.apiget(
                {
                    type: 'user',
                    params: {
                        username: second
                    }
                })
        }

        const seconduser = seconduserReq.apiData

        if (seconduser?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                throw new Error('could not fetch second user data')
            }
            return;
        }

        func.storeFile(firstuserReq, first, 'osudata')
        func.storeFile(firstuserReq, firstuser.id, 'osudata')
        func.storeFile(seconduserReq, seconduser.id, 'osudata')
        func.storeFile(seconduserReq, second, 'osudata')


        switch (type) {
            case 'profile': {
                embedTitle = 'Comparing profiles'
                fieldFirst = {
                    name: `**${firstuser.username}**`,
                    value:
                        `**Rank:** ${func.separateNum(firstuser?.statistics.global_rank)}
**pp:** ${func.separateNum(firstuser?.statistics.pp)}
**Accuracy:** ${(firstuser?.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${func.separateNum(firstuser?.statistics.play_count)}
**Level:** ${func.separateNum(firstuser.statistics.level.current)}
`,
                    inline: true
                };
                fieldSecond = {
                    name: `**${seconduser.username}**`,
                    value:
                        `**Rank:** ${func.separateNum(seconduser?.statistics.global_rank)}
**pp:** ${func.separateNum(seconduser?.statistics.pp)}
**Accuracy:** ${(seconduser?.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${func.separateNum(seconduser?.statistics.play_count)}
**Level:** ${func.separateNum(seconduser.statistics.level.current)}
`,
                    inline: true
                };
                fieldComparison = {
                    name: `**Difference**`,
                    value:
                        `**Rank:** ${func.separateNum(Math.abs(firstuser.statistics.global_rank - seconduser.statistics.global_rank))}
**pp:** ${func.separateNum(Math.abs(firstuser?.statistics.pp - seconduser?.statistics.pp).toFixed(2))}
**Accuracy:** ${Math.abs((firstuser.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0) - (seconduser.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0)).toFixed(2)}%
**Playcount:** ${func.separateNum(Math.abs(firstuser.statistics.play_count - seconduser.statistics.play_count))}
**Level:** ${func.separateNum(Math.abs(firstuser.statistics.level.current - seconduser.statistics.level.current))}
`,
                    inline: false
                }
                usefields.push(fieldFirst, fieldSecond, fieldComparison)
            }
                break;



            case 'top': {
                page
                let firsttopdataReq: osufunc.apiReturn;
                if (func.findFile(input.absoluteID, 'firsttopdata') &&
                    !('error' in func.findFile(input.absoluteID, 'firsttopdata')) &&
                    input.button != 'Refresh'
                ) {
                    firsttopdataReq = func.findFile(input.absoluteID, 'firsttopdata')
                } else {
                    firsttopdataReq = await osufunc.apiget({
                        type: 'best',
                        params: {
                            userid: firstuser.id,
                            mode: osufunc.modeValidator(mode),
                            opts: ['limit=100']
                        }
                    })
                }

                const firsttopdata: osuApiTypes.Score[] & osuApiTypes.Error = firsttopdataReq.apiData;

                if (firsttopdata?.error) {
                    if (input.commandType != 'button' && input.commandType != 'link') {
                        throw new Error('could not fetch first user\'s top scores')
                    }
                    return;
                }

                let secondtopdataReq: osufunc.apiReturn;
                if (func.findFile(input.absoluteID, 'secondtopdata') &&
                    !('error' in func.findFile(input.absoluteID, 'secondtopdata')) &&
                    input.button != 'Refresh'
                ) {
                    secondtopdataReq = func.findFile(input.absoluteID, 'secondtopdata')
                } else {
                    secondtopdataReq = await osufunc.apiget({
                        type: 'best',
                        params: {
                            userid: seconduser.id,
                            mode: osufunc.modeValidator(mode),
                            opts: ['limit=100']
                        }
                    })
                }

                const secondtopdata: osuApiTypes.Score[] & osuApiTypes.Error = secondtopdataReq.apiData;

                if (secondtopdata?.error) {
                    if (input.commandType != 'button' && input.commandType != 'link') {
                        throw new Error('could not fetch second user\'s top scores')
                    }
                    return;
                }
                func.storeFile(firsttopdataReq, input.absoluteID, 'firsttopdata')
                func.storeFile(secondtopdataReq, input.absoluteID, 'secondtopdata')

                const filterfirst = [];
                //filter so that scores that have a shared beatmap id with the second user are kept
                for (let i = 0; i < firsttopdata.length; i++) {
                    if (secondtopdata.find(score => score.beatmap.id == firsttopdata[i].beatmap.id)) {
                        filterfirst.push(firsttopdata[i])
                    }
                }
                filterfirst.sort((a, b) => b.pp - a.pp)
                embedTitle = 'Comparing top scores'
                const arrscore = [];



                for (let i = 0; i < filterfirst.length && i < 5; i++) {
                    const firstscore: osuApiTypes.Score = filterfirst[i + (page * 5)];
                    if (!firstscore) break;
                    const secondscore: osuApiTypes.Score = secondtopdata.find(score => score.beatmap.id == firstscore.beatmap.id)
                    if (secondscore == null) break;
                    const firstscorestr =
                        `\`${firstscore.pp.toFixed(2)}pp | ${(firstscore.accuracy * 100).toFixed(2)}% ${firstscore.mods.length > 0 ? '| +' + firstscore.mods.join('') : ''}`//.padEnd(30, ' ').substring(0, 30)
                    const secondscorestr =
                        `${secondscore.pp.toFixed(2)}pp | ${(secondscore.accuracy * 100).toFixed(2)}% ${secondscore.mods.length > 0 ? '| +' + secondscore.mods.join('') : ''}\`\n`//.padEnd(30, ' ').substring(0, 30)
                    arrscore.push(
                        `**[${firstscore.beatmapset.title} [${firstscore.beatmap.version}]](https://osu.ppy.sh/b/${firstscore.beatmap.id})**
\`${firstuser.username.padEnd(30, ' ').substring(0, 30)} | ${seconduser.username.padEnd(30, ' ').substring(0, 30)}\`
${firstscorestr.substring(0, 30)} || ${secondscorestr.substring(0, 30)}`
                    )
                }

                const scores = arrscore.length > 0 ? arrscore.slice().join('\n') : 'No shared scores'

                embedescription = `**[${firstuser.username}](https://osu.ppy.sh/u/${firstuser.id})** and **[${seconduser.username}](https://osu.ppy.sh/u/${seconduser.id})** have ${filterfirst.length} shared scores
                Page: ${page + 1}/${Math.ceil(filterfirst.length / 5)}`

                fieldFirst.name = '‎ '
                fieldFirst.value = scores
                usefields.push(fieldFirst)


                const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId(`BigLeftArrow-compare-${commanduser.id}-${input.absoluteID}`)
                            .setStyle(buttonsthing.type.current)
                            .setEmoji(buttonsthing.label.page.first),
                        new Discord.ButtonBuilder()
                            .setCustomId(`LeftArrow-compare-${commanduser.id}-${input.absoluteID}`)
                            .setStyle(buttonsthing.type.current)
                            .setEmoji(buttonsthing.label.page.previous),
                        new Discord.ButtonBuilder()
                            .setCustomId(`Search-compare-${commanduser.id}-${input.absoluteID}`)
                            .setStyle(buttonsthing.type.current)
                            .setEmoji(buttonsthing.label.page.search),
                        new Discord.ButtonBuilder()
                            .setCustomId(`RightArrow-compare-${commanduser.id}-${input.absoluteID}`)
                            .setStyle(buttonsthing.type.current)
                            .setEmoji(buttonsthing.label.page.next),
                        new Discord.ButtonBuilder()
                            .setCustomId(`BigRightArrow-compare-${commanduser.id}-${input.absoluteID}`)
                            .setStyle(buttonsthing.type.current)
                            .setEmoji(buttonsthing.label.page.last),
                    );

                useComponents.push(pgbuttons)
            }
                break;



            case 'mapscore': {
                embedTitle = 'Comparing map scores'
                fieldFirst = {
                    name: `**${firstuser.username}**`,
                    value: '',
                    inline: true
                }
                fieldSecond = {
                    name: `**${seconduser.username}**`,
                    value: 's',
                    inline: true
                }
                fieldComparison = {
                    name: `**Difference**`,
                    value: 'w',
                    inline: false
                }
                usefields.push(fieldFirst, fieldSecond, fieldComparison)
            }
                break;

        }
        osufunc.writePreviousId('user', input.obj.guildId, `${seconduser.id}`)
    } catch (error) {
        embedTitle = 'Error'
        usefields.push({
            name: 'Error',
            value: `${error}`,
            inline: false
        })
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
${error}
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle(embedTitle)
        .addFields(usefields)
    if (embedescription) embed.setDescription(embedescription)

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
            components: useComponents
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * set username/mode/skin
 */
export async function osuset(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let name;
    let mode;
    let skin;

    let type;
    let value;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;
            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            if (input.args.includes('-skin')) {
                const temp = func.parseArg(input.args, '-skin', 'string', skin, true);
                skin = temp.value;
                input.args = temp.newArgs;
            }

            input.args = cleanArgs(input.args);

            name = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            name = input.obj.options.getString('user');
            mode = input.obj.options.getString('mode');
            skin = input.obj.options.getString('skin');
            type = 'interaction';
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
    }

    if (input.overrides != null) {
        if (input.overrides.type != null) {
            switch (input.overrides.type) {
                case 'mode':
                    mode = name
                    break;
                case 'skin':
                    skin = name
                    break;
            }
            name = null
        }
    }

    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('osuset', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Name',
                value: name
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Skin',
                value: skin
            },
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Value',
                value: value
            },
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    // if (typeof name == 'undefined' || name == null) {
    //     (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
    //         content: 'Error - username undefined',
    //         allowedMentions: { repliedUser: false },
    //         failIfNotExists: true
    //     });
    //     return;
    // }

    let txt = 'null'

    if (mode) {
        const thing = osufunc.modeValidatorAlt(mode)
        mode = thing.mode;
        if (thing.isincluded == false) {

            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction<any>).reply({
                content: 'Error - invalid mode given',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            });
            return;
        }
    }

    let updateRows: {
        userid: string | number,
        osuname?: string,
        mode?: string,
        skin?: string,
    } = {
        userid: commanduser.id
    }
    updateRows = {
        userid: commanduser.id,
    }
    if (name != null) {
        updateRows['osuname'] = name;
    }
    if (mode != null) {
        updateRows['mode'] = mode;
    }
    if (skin != null) {
        updateRows['skin'] = skin;
    }

    const findname = await input.userdata.findOne({ where: { userid: commanduser.id } })
    if (findname == null) {
        try {
            await input.userdata.create({
                userid: commanduser.id,
                osuname: name ?? 'undefined',
                mode: mode ?? 'osu',
                skin: skin ?? 'Default - https://osu.ppy.sh/community/forums/topics/129191?n=117'
            })
            txt = 'Added to database'
            if (name) {
                txt += `\nSet your username to \`${name}\``
            }
            if (mode) {
                txt += `\nSet your mode to \`${mode}\``
            }
            if (skin) {
                txt += `\nSet your skin to \`${skin}\``
            }
        } catch (error) {
            txt = 'There was an error trying to update your settings'
            log.errLog('Database error', error, `${input.absoluteID}`)
        }
    } else {
        const affectedRows = await input.userdata.update(
            updateRows,
            { where: { userid: commanduser.id } }
        );

        if (affectedRows.length > 0 || affectedRows[0] > 0) {
            txt = 'Updated your settings:'
            if (name) {
                txt += `\nSet your username to \`${name}\``
            }
            if (mode) {
                txt += `\nSet your mode to \`${mode}\``
            }
            if (skin) {
                txt += `\nSet your skin to \`${skin}\``
            }
        } else {
            txt = 'There was an error trying to update your settings'
            log.errLog('Database error', `${affectedRows}`, `${input.absoluteID}`)
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: txt,
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

/**
 * return saved osu! username/mode/skin
 */
export async function saved(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let searchid;
    let user;
    let show = {
        name: true,
        mode: true,
        skin: true
    };
    let overrideTitle;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
    }

    if (input.overrides) {
        if (input?.overrides?.type != null) {
            switch (input?.overrides?.type) {
                case 'username':
                    show = {
                        name: true,
                        mode: false,
                        skin: false
                    }
                    break;
                case 'mode':
                    show = {
                        name: false,
                        mode: true,
                        skin: false
                    }
                    break;
                case 'skin':
                    show = {
                        name: false,
                        mode: false,
                        skin: true
                    }
                    break;
            }
        }
        if (input?.overrides?.ex != null) {
            overrideTitle = input?.overrides?.ex
        }
    }

    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('saved', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })
    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'User id',
                value: searchid
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let cuser: any = {
        osuname: 'null',
        mode: 'osu! (Default)',
        skin: 'osu! classic'
    };

    let fr;
    if (user == null) {
        fr = input.client.users.cache.get(searchid)?.username ?? 'null';
    }

    const Embed = new Discord.EmbedBuilder()
        .setTitle(`${user != null ? user : fr}'s ${overrideTitle ?? 'saved settings'}`)

    if (user == null) {
        cuser = await input.userdata.findOne({ where: { userid: searchid } });
    } else {
        const allUsers = await input.userdata.findAll();

        cuser = allUsers.filter(x => (`${x.osuname}`.trim().toLowerCase() == `${user}`.trim().toLowerCase()))[0]
    }

    if (cuser) {
        const fields = []
        if (show.name == true) {
            fields.push({
                name: 'Username',
                value: `${cuser.osuname && cuser.mode.length > 1 ? cuser.osuname : 'undefined'}`,
                inline: true
            })
        }
        if (show.mode == true) {
            fields.push({
                name: 'Mode',
                value: `${cuser.mode && cuser.mode.length > 1 ? cuser.mode : 'osu (default)'}`,
            })
        }
        if (show.skin == true) {
            fields.push({
                name: 'Skin',
                value: `${cuser.skin && cuser.skin.length > 1 ? cuser.skin : 'None'}`,
            })
        }
        Embed.addFields(fields)
    } else {
        Embed.setDescription('No saved settings found')
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embed],
        }
    })
    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )
}

/**
 * estimate stats if x pp score
 */
export async function whatif(input: extypes.commandInput & { statsCache: any }) {

    let commanduser: Discord.User;
    let user;
    let pp;
    let searchid;
    let mode;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);

            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

            if (input.args.includes('-osu')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-osu'), 1);
            }
            if (input.args.includes('-o')) {
                mode = 'osu'
                input.args.splice(input.args.indexOf('-o'), 1);
            }
            if (input.args.includes('-taiko')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-taiko'), 1);
            }
            if (input.args.includes('-t')) {
                mode = 'taiko'
                input.args.splice(input.args.indexOf('-t'), 1);
            }
            if (input.args.includes('-catch')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-catch'), 1);
            }
            if (input.args.includes('-fruits')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-fruits'), 1);
            }
            if (input.args.includes('-ctb')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-ctb'), 1);
            }
            if (input.args.includes('-f')) {
                mode = 'fruits'
                input.args.splice(input.args.indexOf('-f'))
            }
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-m')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-m'))
            }

            input.args = cleanArgs(input.args);

            if (!isNaN(+input.args[0])) {
                pp = +input.args[0];
            }

            if ((input.args[0] && input.args[1])) {
                if (input.args[0].includes(searchid)) {
                    user = null
                } else {
                    user = input.args[0]
                }
                pp = input.args[1] ?? null;

            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.options.getString('user');

            mode = input.obj.options.getString('mode');

            pp = input.obj.options.getNumber('pp');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('whatif', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'user',
                value: user
            },
            {
                name: 'pp',
                value: pp
            },
            {
                name: 'mode',
                value: mode
            },
            {
                name: 'searchid',
                value: searchid
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    if (!pp) {
        pp = 100;
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode))
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        })
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;

    if (osudata?.error || !osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                    })
                }, 1000);
            } else {
                (input.obj as Discord.Message<any>).reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not find user
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode))
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode))

    osufunc.debug(osudataReq, 'command', 'whatif', input.obj.guildId, 'osuData');

    if (mode == null) {
        mode = osudata.playmode;
    }

    const osutopdataReq: osufunc.apiReturn = await osufunc.apiget({
        type: 'best',
        params: {
            userid: osudata.id,
            mode: mode,
            opts: ['limit=100']
        }
    })


    const osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = osutopdataReq.apiData; osufunc.debug(osutopdataReq, 'command', 'whatif', input.obj.guildId, 'osuTopData');

    if (osutopdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    (input.obj as Discord.ChatInputCommandInteraction<any>).editReply({
                        content: 'Error - could not fetch user\'s top scores',
                        allowedMentions: { repliedUser: false },
                    }).catch()
                }, 1000)
            } else {

                (input.obj as Discord.Message<any>).reply({
                    content: 'Error - could not fetch user\'s top scores',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        log.logFile('command',
            `
----------------------------------------------------
Command Failed
ID: ${input.absoluteID}
Could not fetch user\'s top scores
----------------------------------------------------
\n\n`,
            { guildId: `${input.obj.guildId}` }
        )
        return;
    }

    const pparr = osutopdata.slice().map(x => x.pp);
    pparr.push(pp);
    pparr.sort((a, b) => b - a);
    const ppindex = pparr.indexOf(pp);

    const weight = osufunc.findWeight(ppindex);

    const newTotal: number[] = [];

    for (let i = 0; i < pparr.length; i++) {
        newTotal.push(pparr[i] * osufunc.findWeight(i));
    }

    const total = newTotal.reduce((a, b) => a + b, 0);
    //     416.6667 * (1 - 0.9994 ** osudata.statistics.play_count);

    const newBonus = [];
    for (let i = 0; i < osutopdata.length; i++) {
        newBonus.push(osutopdata[i].weight.pp/*  ?? (osutopdata[i].pp * osufunc.findWeight(i)) */);
    }

    const bonus = osudata.statistics.pp - newBonus.reduce((a, b) => a + b, 0);

    const guessrank = await osufunc.getRankPerformance('pp->rank', (total + bonus), input.userdata, `${osufunc.modeValidator(mode)}`, input.statsCache)

    const embed = new Discord.EmbedBuilder()
        .setTitle(`What if ${osudata.username} gained ${pp}pp?`)
        .setColor(colours.embedColour.query.dec)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setDescription(
            `A ${pp} score would be their **${calc.toOrdinal(ppindex + 1)}** top play and would be weighted at **${(weight * 100).toFixed(2)}%**.
Their pp would change by **${Math.abs((total + bonus) - osudata.statistics.pp).toFixed(2)}pp** and their new total pp would be **${(total + bonus).toFixed(2)}pp**.
Their new rank would be **${guessrank}** (+${osudata?.statistics?.global_rank - guessrank}).
`
        )

    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed]
        }
    })


    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

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