import cmdchecks = require('../src/checks');
import fs = require('fs');
import calc = require('../src/calc');
import emojis = require('../src/consts/emojis');
import colours = require('../src/consts/colours');
import colourfunc = require('../src/colourcalc');
import osufunc = require('../src/osufunc');
import osumodcalc = require('osumodcalculator');
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

export async function name(input: extypes.commandInput) {
}

//user stats

export async function bws(input: extypes.commandInput) {

    let commanduser;
    let user;
    let searchid;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            //@ts-expect-error mentions property does not exist on interaction
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            commanduser = input.obj.member.user;
            searchid = commanduser.id
            //@ts-expect-error options property does not exist on message
            user = input.options.getString('user');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
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

    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {
                //@ts-expect-error
                //This expression is not callable.
                //Each member of the union type '((options: string | MessagePayload | MessageReplyOptions) => Promise<Message<any>>) | { (options: InteractionReplyOptions & { ...; }): Promise<...>; (options: string | ... 1 more ... | InteractionReplyOptions): Promise<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.ts(2349)
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
    }

    if (input.commandType == 'interaction') {
        //@ts-expect-error
        //This expression is not callable.
        //Each member of the union type '((options: string | MessagePayload | MessageReplyOptions) => Promise<Message<any>>) | { (options: InteractionReplyOptions & { ...; }): Promise<...>; (options: string | ... 1 more ... | InteractionReplyOptions): Promise<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.ts(2349)
        input.obj.reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        }).catch()
    }

    const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`, `osu`)
    osufunc.debug(osudata, 'command', 'bws', input.obj.guildId, 'osuData');
    if (osudata?.error || !osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    //@ts-expect-error editReply does not exist on message
                    input.obj.editReply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }, 1000);
            } else {
                //@ts-expect-error
                //This expression is not callable.
                //Each member of the union type '((options: string | MessagePayload | MessageReplyOptions) => Promise<Message<any>>) | { (options: InteractionReplyOptions & { ...; }): Promise<...>; (options: string | ... 1 more ... | InteractionReplyOptions): Promise<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.ts(2349)
                input.obj.reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
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

export async function globals(input: extypes.commandInput) {

    let commanduser;

    let user;
    let searchid;
    let page = 0;
    let mode = 'osu';

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;//@ts-ignore
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null
            }
            page = 0
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            user = input.obj.options.getString('user');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {//@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }

            commanduser = input.obj.member.user;//@ts-ignore
            user = input.obj.message.embeds[0].title.split('for ')[1]//@ts-ignore
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

    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {//@ts-ignore
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
    }

    const osudata: osuApiTypes.User = await osufunc.apiget('user', `${user}`)
    osufunc.debug(osudata, 'command', 'globals', input.obj.guildId, 'osuData');
    if (osudata?.error) {//@ts-ignore
        if (input.commandType != 'button') input.obj.reply({
            content: `User not found`,
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        }).catch()
        return;
    }

    if (!osudata.id) {
        return input.obj.channel.send('Error - no user found')
            .catch();

    }

    if (input.commandType == 'interaction') {//@ts-ignore
        input.obj.reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        }).catch()
    }

    const scorecount = osudata?.scores_first_count ?? 0;

    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            console.log(error)
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

export async function lb(input: extypes.commandInput) {

    let commanduser;

    let page = 0;
    let mode = 'osu';
    const guild = input.obj.guild;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
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
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
            //@ts-expect-error options property does not exist on message
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
            //@ts-expect-error message property does not exist on message
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
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji(buttonsthing.label.page.first),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-lb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-lb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-lb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-lb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
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
        //@ts-ignore
        input.obj.reply('loading...')
    }


    for (let i = 0; i < useridsarraylen; i++) {
        const user: extypes.dbUser = userids[i].dataValues;

        guild.members.cache.forEach(async member => {
            if (`${member.id}` == `${user.userid}`) {
                if (user != null && !rtxt.includes(`${member.user.id}`)) {
                    let acc: any;
                    let pp: any;
                    let rank: any;
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
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
    }
    if (page + 1 >= Math.ceil(rarr.length / 10)) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
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

export async function ranking(input: extypes.commandInput & { statsCache: any }) {

    let commanduser;
    let country = 'ALL';
    let mode = 'osu';
    let type: osuApiTypes.RankingType = 'performance';
    let page = 0;
    let spotlight;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            if (input.args.includes('-page')) {
                page = parseInt(input.args[input.args.indexOf('-page') + 1]);
                input.args.splice(input.args.indexOf('-page'), 2);
            }
            if (input.args.includes('-p')) {
                page = parseInt(input.args[input.args.indexOf('-p') + 1]);
                input.args.splice(input.args.indexOf('-p'), 2);
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
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            input.args[0] && input.args[0].length == 2 ? country = input.args[0].toUpperCase() : country = 'ALL';
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            input.obj.options.getString('country') ? country = input.obj.options.getString('country').toUpperCase() : country = 'ALL';//@ts-ignore
            input.obj.options.getString('mode') ? mode = input.obj.options.getString('mode').toLowerCase() : mode = 'osu';//@ts-ignore
            input.obj.options.getString('type') ? type = input.obj.options.getString('type').toLowerCase() : type = 'performance';//@ts-ignore
            input.obj.options.getInteger('page') ? page = input.obj.options.getInteger('page') - 1 : page = 0;//@ts-ignore
            input.obj.options.getInteger('spotlight') ? spotlight = input.obj.options.getInteger('spotlight') : spotlight = undefined;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
            const pageParsed =//@ts-ignore
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
                case 'BigRightArrow'://@ts-ignore
                    page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])
                    break;
                default:
                    page = pageParsed
                    break;
            }//@ts-ignore
            let base: string = input.obj.message.embeds[0].title;
            if (base.includes('Global')) {
                base = base.split('Global ')[1];
            }
            if (base.includes('for ')) {
                base = base.split('for ')[0];//@ts-ignore
                input.obj.message.embeds[0].footer ? country = input.obj.message.embeds[0].footer.text.split('Country: ')[1] : country = 'ALL';
            }
            mode = base.split(' ')[0].toLowerCase().replaceAll('!', '');
            //@ts-expect-error - type string not assignable to type RankingType
            type = base.split(' ')[1].toLowerCase();
            if (type == 'charts') {//@ts-ignore
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

    let rankingdata: osuApiTypes.Rankings;
    if (func.findFile(input.absoluteID, 'rankingdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'rankingdata')) &&
        input.button != 'Refresh'
    ) {
        rankingdata = func.findFile(input.absoluteID, 'rankingdata')
    } else {
        rankingdata = await osufunc.apiget('custom', url, null, 2, 0, true).catch(() => {
            if (country != 'ALL') {//@ts-ignore
                input.obj.reply({
                    content: 'Invalid country code',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            } else {//@ts-ignore
                input.obj.reply({
                    content: 'Error',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        })
    }
    func.storeFile(rankingdata, input.absoluteID, 'rankingdata')

    if (rankingdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.editReply({
                        content: 'Error - could not fetch rankings',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }, 1000)
            } else {//@ts-ignore
                input.obj.reply({
                    content: 'Error - could not fetch rankings',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        return;
    }

    try {
        osufunc.debug(rankingdata, 'command', 'ranking', input.obj.guildId, 'rankingData')
    } catch (e) {
        return;
    }
    if (rankingdata.ranking.length == 0) {//@ts-ignore
        input.obj.reply({
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
        //@ts-ignore
        osufunc.userStatsCache(rankingdata.ranking, input.statsCache, mode)
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
Score: ${curuser.total_score == null ? '---' : func.separateNum(curuser.total_score)} (${curuser.ranked_score == null ? '---' : func.separateNum(curuser.ranked_score)} ranked)
${curuser.hit_accuracy == null ? '---' : curuser.hit_accuracy.toFixed(2)}% | ${curuser.pp == null ? '---' : func.separateNum(curuser.pp)}pp | ${curuser.play_count == null ? '---' : func.separateNum(curuser.play_count)} plays
`
                    ,
                    inline: false
                }
            ]
        )
    }
    if (page + 1 >= Math.ceil(rankingdata.ranking.length / 5)) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true);
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true);
    }
    if (page == 0) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true);
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true);
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

export async function rankpp(input: extypes.commandInput & { statsCache: any }) {

    let commanduser;
    let type: string = 'rank';
    let value;
    let mode: osuApiTypes.GameMode = 'osu';
    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            value = input.args[0] ?? 100;
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
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            value = input.obj.options.getInteger('value') ?? 100;//@ts-ignore
            mode = input.obj.options.getString('mode') ?? 'osu';
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }
    if (input.overrides != null) {//@ts-ignore
        type = input.overrides.type ?? 'pp';
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
        log.optsLog(input.absoluteID, []),
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

export async function osu(input: extypes.commandInput) {

    let commanduser;

    let user = null;
    let mode = null;
    let graphonly = false;
    let detailed;
    let searchid;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            //@ts-expect-error mentions property does not exist on interaction
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
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            user = input.args.join(' ');
            if (!input.args[0] || input.args.includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
            //@ts-expect-error options property does not exist on message
            user = input.obj.options.getString('user');
            //@ts-expect-error options property does not exist on message
            detailed = input.obj.options.getBoolean('detailed');
            //@ts-expect-error options property does not exist on message
            mode = input.obj.options.getString('mode');
            searchid = input.obj.member.user.id;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            //@ts-expect-error message property does not exist on interaction
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            //@ts-expect-error message property does not exist on interaction
            if (input.obj.message.embeds[0].fields[0]) {
                detailed = true
            }


            //@ts-expect-error message property does not exist on interaction
            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]
            //@ts-expect-error message property does not exist on interaction
            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]

            if (input.button == 'DetailEnable') {
                detailed = true;
            }
            if (input.button == 'DetailDisable') {
                detailed = false;
            }
            if (input.button == 'Refresh') {
                //@ts-expect-error message property does not exist on interaction
                if (input.obj.message.embeds[0].fields[0]) {
                    detailed = true
                } else {
                    detailed = false
                }
            }

            //@ts-expect-error message property does not exist on interaction
            if (!input.obj.message.embeds[0].title) {
                graphonly = true
            }
        }
            break;
        case 'link': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;

            //@ts-expect-error mentions property does not exist on interaction
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            //@ts-expect-error content property does not exist on interaction
            user = input.obj.content.includes(' ') ? input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[2].split(' ')[0] : input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[2]
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

    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {
                //@ts-expect-error reply smth smth signature invalid not compatible
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
    }

    mode = mode ? osufunc.modeValidator(mode) : null;

    if (input.commandType == 'interaction') {
        //@ts-expect-error reply smth smth signature invalid not compatible
        input.obj.reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        }).catch()
    }

    let osudata: osuApiTypes.User;

    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`, mode)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, user, 'osudata')

    osufunc.debug(osudata, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    //@ts-expect-error reply smth smth signature invalid not compatible
                    input.obj.editReply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }, 1000);
            } else {
                //@ts-expect-error reply smth smth signature invalid not compatible
                input.obj.reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        return;
    }

    if ((
        //@ts-expect-error options property does not exist on message
        (input.commandType == 'interaction' && !input.obj?.options?.getString('mode'))
        || input.commandType == 'message'
    ) &&
        osudata.playmode != 'osu' &&
        typeof mode != 'undefined') {
        mode = osudata.playmode
        osudata = await osufunc.apiget('user', `${user}`, `${mode}`);
        osufunc.debug(osudata, 'command', 'osu', input.obj.guildId, 'osuData');
    }

    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            console.log(error)
        }
    }

    const osustats = osudata.statistics;
    const grades = osustats.grade_counts;

    const playerrank =
        osudata.statistics.global_rank == null ?
            '---' :
            func.separateNum(osudata.statistics.global_rank);
    const countryrank =
        osudata.statistics.country_rank == null ?
            '---' :
            func.separateNum(osudata.statistics.country_rank);

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
        .setTitle(`${osudata.username}'s ${mode} profile`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)

    let useEmbeds = [];
    if (graphonly == true) {
        const dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',')
        const datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',')

        const chartplay = await osufunc.graph(dataplay, osudata.monthly_playcounts.map(x => x.count), 'Playcount graph', false, false, true, true, true);
        const chartrank = await osufunc.graph(datarank, osudata.rank_history.data, 'Rank graph', null, null, null, null, null, 'rank');

        const ChartsEmbedRank = new Discord.EmbedBuilder()
            .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
            .setImage(`${chartrank}`);

        const ChartsEmbedPlay = new Discord.EmbedBuilder()
            .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
            .setImage(`${chartplay}`);

        useEmbeds.push(ChartsEmbedRank, ChartsEmbedPlay);
    } else {
        if (detailed == true) {
            const loading = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.user.dec)
                .setTitle(`${osudata.username}'s ${mode} profile`)
                .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode}`)
                .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
                .setDescription(`Loading...`);

            if (input.commandType != 'button') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {
                        //@ts-expect-error reply smth smth signature invalid not compatible
                        input.obj.editReply({
                            embeds: [loading],
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                            .catch();
                    }, 1000);
                }
            }
            const dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',')
            const datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',')

            const chartplay = await osufunc.graph(dataplay, osudata.monthly_playcounts.map(x => x.count), 'Playcount graph', false, false, true, true, true);
            const chartrank = await osufunc.graph(datarank, osudata.rank_history.data, 'Rank graph', null, null, null, null, null, 'rank');

            const ChartsEmbedRank = new Discord.EmbedBuilder()
                .setDescription('Click on the image to see the full chart')
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${chartrank}`);

            const ChartsEmbedPlay = new Discord.EmbedBuilder()
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${chartplay}`);

            const osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
            osufunc.debug(osutopdata, 'command', 'osu', input.obj.guildId, 'osuTopData');

            if (osutopdata?.error) {
                if (input.commandType != 'button' && input.commandType != 'link') {
                    if (input.commandType == 'interaction') {
                        setTimeout(() => {
                            //@ts-expect-error reply smth smth signature invalid not compatible
                            input.obj.editReply({
                                content: 'Error - could not fetch user\'s top scores',
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            }).catch()
                        }, 1000)
                    } else {
                        //@ts-expect-error reply smth smth signature invalid not compatible
                        input.obj.reply({
                            content: 'Error - could not fetch user\'s top scores',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
                return;
            }

            const mostplayeddata: osuApiTypes.BeatmapPlaycount[] & osuApiTypes.Error = await osufunc.apiget('most_played', `${osudata.id}`)
            osufunc.debug(mostplayeddata, 'command', 'osu', input.obj.guildId, 'mostPlayedData');

            if (mostplayeddata?.error) {
                if (input.commandType != 'button' && input.commandType != 'link') {
                    if (input.commandType == 'interaction') {
                        setTimeout(() => {
                            //@ts-expect-error reply smth smth signature invalid not compatible
                            input.obj.editReply({
                                content: 'Error - could not fetch user\'s most played beatmaps',
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            }).catch()
                        }, 1000)
                    } else {
                        //@ts-expect-error reply smth smth signature invalid not compatible
                        input.obj.reply({
                            content: 'Error - could not fetch user\'s most played beatmaps',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
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
                        `**Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)
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
**Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)
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
            components: [buttons],
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

export async function firsts(input: extypes.commandInput) {

    let commanduser;

    let user;
    let searchid;
    let page = 0;

    let scoredetailed = false;
    let sort: embedStuff.scoreSort = 'recent';
    let reverse = false;
    let mode = 'osu';
    let filteredMapper = null;
    let filteredMods = null;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            //@ts-expect-error mentions property does not exist on interaction
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-page')) {
                page = parseInt(input.args[input.args.indexOf('-page') + 1]);
                input.args.splice(input.args.indexOf('-page'), 2);
            }
            if (input.args.includes('-p')) {
                page = parseInt(input.args[input.args.indexOf('-p') + 1]);
                input.args.splice(input.args.indexOf('-p'), 2);
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
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-recent')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-performance')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-pp')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-score')) {
                sort = 'score';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-acc')) {
                sort = 'acc';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-combo')) {
                sort = 'combo';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-miss')) {
                sort = 'miss';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-rank')) {
                sort = 'rank';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-r')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;

            //@ts-ignore
            user = input.obj.options.getString('user');
            //@ts-ignore
            page = input.obj.options.getInteger('page');
            //@ts-ignore
            scoredetailed = input.obj.options.getBoolean('detailed');
            //@ts-ignore
            sort = input.obj.options.getString('sort');
            //@ts-ignore
            reverse = input.obj.options.getBoolean('reverse');
            //@ts-ignore
            mode = input.obj.options.getString('mode') ?? 'osu';
            //@ts-ignore
            filteredMapper = input.obj.options.getString('mapper');
            //@ts-ignore
            filteredMods = input.obj.options.getString('mods');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            //@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }

            commanduser = input.obj.member.user;
            //@ts-ignore
            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]
            //@ts-ignore
            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]
            page = 0;
            //@ts-ignore
            if (input.obj.message.embeds[0].description) {
                //@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mapper')) {//@ts-ignore
                    filteredMapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }//@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mods')) {//@ts-ignore
                    filteredMods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }//@ts-ignore
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

                //@ts-ignore
                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses')) || (reverse1.includes('worst'))) {
                    reverse = true
                } else {
                    reverse = false
                }
                //@ts-ignore
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
                        //@ts-ignore
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
            //@ts-ignore
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
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {
                //@ts-ignore
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
    }

    mode = osufunc.modeValidator(mode);


    if (input.commandType == 'interaction') {
        //@ts-ignore
        input.obj.reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        }).catch()
    }

    let osudata: osuApiTypes.User;

    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`, `${mode}`)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, user, 'osudata')

    osufunc.debug(osudata, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {

            if (input.commandType == 'interaction') {
                setTimeout(() => {
                    //@ts-ignore
                    input.obj.reply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }, 1000);
            } else {
                //@ts-ignore
                input.obj.reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        return;
    }

    let firstscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = []
    async function getScoreCount(cinitnum) {
        const fd: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('firsts_alt', `${osudata.id}`, `mode=${mode}&offset=${cinitnum}`, 2, 0, true)
        if (fd?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {//@ts-ignore
                        input.obj.editReply({
                            content: 'Error - could not find user\'s #1 scores',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }, 1000)
                } else {//@ts-ignore
                    input.obj.reply({
                        content: 'Error - could not find user\'s #1 scores',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }

            await firstscoresdata.push(fd[i])
        }
        if (fd.length == 100) {
            await getScoreCount(cinitnum + 100)
        }

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
    func.storeFile(firstscoresdata, input.absoluteID, 'firstscoresdata')

    const firstsEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`#1 scores for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${firstscoresdata?.[0]?.mode ?? 'osu'}`)
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
        reverse: reverse
    })
    firstsEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${Math.ceil(scoresarg.maxPages)}\n${emojis.gamemodes[mode]}\n`)

    if (scoresarg.fields.length == 0) {
        firstsEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }])
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[2].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
    } else {
        for (let i = 0; i < scoresarg.fields.length; i++) {
            firstsEmbed.addFields([scoresarg.fields[i]])
        }
    }

    if (scoresarg.isFirstPage) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
    }
    if (scoresarg.isLastPage) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
    }

    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            console.log(error)
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

export async function maplb(input: extypes.commandInput) {

    let commanduser;

    let mapid;
    let mapmods;
    let page;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            mapid = input.args[0]
            if (isNaN(mapid)) {
                mapid = undefined;
            }
            if (input.args.join(' ').includes('+')) {
                mapmods = input.args.join(' ').split('+')[1];
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            mapid = input.obj.options.getInteger('id');//@ts-ignore
            page = input.obj.options.getInteger('page');//@ts-ignore
            mapmods = input.obj.options.getString('mods');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {//@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;//@ts-ignore
            mapid = input.obj.message.embeds[0].url.split('/b/')[1]//@ts-ignore
            if (input.obj.message.embeds[0].title.includes('+')) {//@ts-ignore
                mapmods = input.obj.message.embeds[0].title.split('+')[1]
            }
            page = 0
            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1
                    break;
                case 'LeftArrow'://@ts-ignore
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
                    break;
                case 'RightArrow'://@ts-ignore
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
                    break;
                case 'BigRightArrow'://@ts-ignore
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[1].split('\n')[0])
                    break;
                case 'Refresh'://@ts-ignore
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

    if (!mapid) {
        mapid = osufunc.getPreviousId('map', input.obj.guildId);
    }

    if (input.commandType == 'interaction') {
        //@ts-ignore
        input.obj.reply({
            content: 'Loading...',
            allowMentions: { repliedUser: false },
            failIfNotExists: true
        }).catch()
    }

    let mapdata: osuApiTypes.Beatmap;
    if (func.findFile(mapid, 'mapdata') &&
        !('error' in func.findFile(mapid, 'mapdata')) &&
        input.button != 'Refresh'
    ) {
        mapdata = func.findFile(mapid, 'mapdata')
    } else {
        mapdata = await osufunc.apiget('map', `${mapid}`)
    }
    func.storeFile(mapdata, mapid, 'mapdata')
    osufunc.debug(mapdata, 'command', 'maplb', input.obj.guildId, 'mapData');

    if (mapdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.editReply({
                        content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }, 1000)
            } else {//@ts-ignore
                input.obj.reply({
                    content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        return;
    }

    let title = 'n';
    let fulltitle = 'n';
    let artist = 'n';
    try {
        title = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title})`;
        artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist_unicode} (${mapdata.beatmapset.artist})`;
    } catch (error) {//@ts-ignore
        input.obj.reply({ content: 'error - map not found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
            .catch();
        return;
    }
    fulltitle = `${artist} - ${title} [${mapdata.version}]`

    let mods;
    if (mapmods) {
        mods = osumodcalc.OrderMods(mapmods) + ''
    }
    const lbEmbed = new Discord.EmbedBuilder()

    if (mods == null) {
        let lbdataf: osuApiTypes.BeatmapScores;
        if (func.findFile(input.absoluteID, 'lbdata') &&
            input.commandType == 'button' &&
            !('error' in func.findFile(input.absoluteID, 'lbdata')) &&
            input.button != 'Refresh'
        ) {
            lbdataf = func.findFile(input.absoluteID, 'lbdata')
        } else {
            lbdataf = await osufunc.apiget('scores_get_map', `${mapid}`)
        }
        func.storeFile(lbdataf, input.absoluteID, 'lbdata')
        osufunc.debug(lbdataf, 'command', 'maplb', input.obj.guildId, 'lbDataF');

        if (lbdataf?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {//@ts-ignore
                        input.obj.editReply({
                            content: `Error - could not fetch leaderboard data for map \`${mapid}\`.`,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }, 1000)
                } else {//@ts-ignore
                    input.obj.reply({
                        content: `Error - could not fetch leaderboard data for map \`${mapid}\`.`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            return;
        }

        const lbdata = lbdataf.scores
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

        osufunc.debug(lbdata, 'command', 'maplb', input.obj.guildId, 'lbData');

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
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[0].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[1].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[2].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[3].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[4].setDisabled(true)

        } else {
            for (let i = 0; i < scoresarg.fields.length; i++) {
                lbEmbed.addFields([scoresarg.fields[i]])
            }
        }

        lbEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(scoresarg.maxPages)}`)

        if (scoresarg.isFirstPage) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[0].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[1].setDisabled(true)
        }
        if (scoresarg.isLastPage) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[3].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[4].setDisabled(true)
        }

        osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`);
    } else {
        let lbdata;
        if (func.findFile(input.absoluteID, 'lbdata') &&
            input.commandType == 'button' &&
            !('error' in func.findFile(input.absoluteID, 'lbdata')) &&
            input.button != 'Refresh'
        ) {
            lbdata = func.findFile(input.absoluteID, 'lbdata')
        } else {
            lbdata = await osufunc.apiget('scores_get_map', `${mapid}`, `${osumodcalc.ModStringToInt(mods)}`, 1)
        }
        func.storeFile(lbdata, input.absoluteID, 'lbdata')
        osufunc.debug(lbdata, 'command', 'maplb', input.obj.guildId, 'lbData');

        if (lbdata?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {//@ts-ignore
                        input.obj.editReply({
                            content: `Error - could not fetch leaderboard data for map \`${mapid}\`.`,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }, 1000)
                } else {//@ts-ignore
                    input.obj.reply({
                        content: `Error - could not fetch leaderboard data for map \`${mapid}\`.`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
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
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[0].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[1].setDisabled(true)
        }

        if (page >= (lbdata.length / 5) - 1) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[3].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[4].setDisabled(true)
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

export async function nochokes(input: extypes.commandInput) {

    let commanduser;

    let user;
    let mode;
    let sort;
    let reverse;
    let page;
    let mapper;
    let mods;
    let searchid

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            //@ts-expect-error mentions property does not exist on interaction
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-page')) {
                page = parseInt(input.args[input.args.indexOf('-page') + 1]);
                input.args.splice(input.args.indexOf('-page'), 2);
            }
            if (input.args.includes('-p')) {
                page = parseInt(input.args[input.args.indexOf('-p') + 1]);
                input.args.splice(input.args.indexOf('-p'), 2);
            }
            mode = null;
            sort = 'pp';
            page = 1;
            mapper = null;
            mods = null;
            if (input.args.includes('-page')) {
                page = parseInt(input.args[input.args.indexOf('-page') + 1]);
                input.args.splice(input.args.indexOf('-page'), 2);
            }
            if (input.args.includes('-p')) {
                page = parseInt(input.args[input.args.indexOf('-p') + 1]);
                input.args.splice(input.args.indexOf('-p'), 2);
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
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-recent')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-performance')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-pp')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-score')) {
                sort = 'score';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-acc')) {
                sort = 'acc';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-combo')) {
                sort = 'combo';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-miss')) {
                sort = 'miss';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-rank')) {
                sort = 'rank';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-r')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            user = input.args.join(' ');
            if (!input.args[0] || input.args.includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            user = input.obj.options.getString('user')//@ts-ignore
            mode = input.obj.options.getString('mode')//@ts-ignore
            mapper = input.obj.options.getString('mapper')//@ts-ignore
            mods = input.obj.options.getString('mods')//@ts-ignore
            sort = input.obj.options.getString('sort')//@ts-ignore
            page = input.obj.options.getInteger('page')//@ts-ignore
            reverse = input.obj.options.getBoolean('reverse')
            searchid = input.obj.member.user.id
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {//@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            //@ts-ignore
            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]//obj.message.embeds[0].title.split('Top no choke scores of ')[1]
            //@ts-ignore
            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]
            //@ts-ignore
            if (input.obj.message.embeds[0].description) {//@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mapper')) {//@ts-ignore
                    mapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }//@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mods')) {//@ts-ignore
                    mods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }//@ts-ignore
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

                //@ts-ignore
                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses')) || (reverse1.includes('worst'))) {
                    reverse = true
                } else {
                    reverse = false
                }
                //@ts-ignore
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
                    case 'BigRightArrow'://@ts-ignore
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

    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {//@ts-ignore
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
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

    if (input.commandType == 'interaction') {//@ts-ignore
        input.obj.reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        }).catch()
    }

    let osudata: osuApiTypes.User;

    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`, `${mode}`)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, user, 'osudata')

    osufunc.debug(osudata, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.reply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }, 1000);
            } else {//@ts-ignore
                input.obj.reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        return;
    }

    let nochokedata: osuApiTypes.Score[] & osuApiTypes.Error
    if (func.findFile(input.absoluteID, 'nochokedata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'nochokedata')) &&
        input.button != 'Refresh'
    ) {
        nochokedata = func.findFile(input.absoluteID, 'nochokedata')
    } else {
        nochokedata = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
    }

    osufunc.debug(nochokedata, 'command', 'osutop', input.obj.guildId, 'noChokeData');
    func.storeFile(nochokedata, input.absoluteID, 'nochokedata')

    if (nochokedata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.reply({
                        content: `Error - could not find \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }, 1000);
            } else {//@ts-ignore
                input.obj.reply({
                    content: `Error - could not find \`${user}\`'s top scores`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        return;
    }

    try {
        nochokedata[0].user.username
    } catch (error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.reply({
                        content: `Error - could not fetch \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000);
            } else {//@ts-ignore
                input.obj.reply({
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

    const topEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`Top no choke scores of ${nochokedata[0].user.username}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setURL(`https://osu.ppy.sh/users/${nochokedata[0].user.id}/${nochokedata[0].mode}`)
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
            reverse: reverse
        })
    topEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${Math.ceil(scoresarg.maxPages)}\n${emojis.gamemodes[mode]}`)
    if (scoresarg.fields.length == 0) {
        topEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }])
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[2].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
    } else {
        for (let i = 0; scoresarg.fields.length > i; i++) {
            topEmbed.addFields(scoresarg.fields[i])
        }
    }

    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);

    if (scoresarg.isFirstPage) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
    }
    if (scoresarg.isLastPage) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
    }
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            console.log(error)
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

export async function osutop(input: extypes.commandInput) {

    let commanduser;

    let user;
    let mode;
    let detailed;
    let sort: embedStuff.scoreSort;
    let reverse;
    let page;
    let mapper;
    let mods;
    let searchid

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            //@ts-expect-error mentions property does not exist on interaction
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            mode = null;
            sort = 'pp';
            page = 1;

            mapper = null;
            mods = null;
            detailed = false;
            if (input.args.includes('-page')) {
                page = parseInt(input.args[input.args.indexOf('-page') + 1]);
                input.args.splice(input.args.indexOf('-page'), 2);
            }
            if (input.args.includes('-p')) {
                page = parseInt(input.args[input.args.indexOf('-p') + 1]);
                input.args.splice(input.args.indexOf('-p'), 2);
            }
            if (input.args.includes('-mapper')) {
                mapper = (input.args[input.args.indexOf('-mapper') + 1]);
                input.args.splice(input.args.indexOf('-mapper'), 2);
            }
            if (input.args.includes('-mods')) {
                mods = (input.args[input.args.indexOf('-mods') + 1]);
                input.args.splice(input.args.indexOf('-mods'), 2);
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
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-recent')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-performance')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-pp')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-score')) {
                sort = 'score';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-acc')) {
                sort = 'acc';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-combo')) {
                sort = 'combo';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-miss')) {
                sort = 'miss';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-rank')) {
                sort = 'rank';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-r')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            user = input.args.join(' ');
            if (!input.args[0] || input.args.includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            user = input.obj.options.getString('user')//@ts-ignore
            mode = input.obj.options.getString('mode')//@ts-ignore
            mapper = input.obj.options.getString('mapper')//@ts-ignore
            mods = input.obj.options.getString('mods')//@ts-ignore
            sort = input.obj.options.getString('sort')//@ts-ignore
            page = input.obj.options.getInteger('page')//@ts-ignore
            detailed = input.obj.options.getBoolean('detailed')//@ts-ignore
            reverse = input.obj.options.getBoolean('reverse')
            searchid = input.obj.member.user.id
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {//@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            //@ts-ignore
            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]//obj.message.embeds[0].title.split('Top plays of ')[1]
            //@ts-ignore
            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]
            //@ts-ignore
            if (input.obj.message.embeds[0].description) {//@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mapper')) {//@ts-ignore
                    mapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }//@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mods')) {//@ts-ignore
                    mods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }//@ts-ignore
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

                //@ts-ignore
                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses')) || (reverse1.includes('worst'))) {
                    reverse = true
                } else {
                    reverse = false
                }
                //@ts-ignore
                if (input.obj.message.embeds[0].fields.length == 7 || input.obj.message.embeds[0].fields.length == 11) {
                    detailed = true
                } else {
                    detailed = false
                }//@ts-ignore
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
                    case 'BigRightArrow'://@ts-ignore
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
        if (input.overrides.sort != null) {//@ts-ignore
            sort = input.overrides.sort
        }
        if (input.overrides.reverse != null) {
            reverse = input.overrides.reverse === true;
        }
        if (input.overrides.mode != null) {
            mode = input.overrides.mode
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

    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {//@ts-ignore
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
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

    if (input.commandType == 'interaction') {//@ts-ignore
        input.obj.reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        }).catch()
    }

    let osudata: osuApiTypes.User;

    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`, `${mode}`)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, user, 'osudata')

    osufunc.debug(osudata, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.reply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }, 1000);
            } else {//@ts-ignore
                input.obj.reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        return;
    }

    let osutopdata: osuApiTypes.Score[] & osuApiTypes.Error
    if (func.findFile(input.absoluteID, 'osutopdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'osutopdata')) &&
        input.button != 'Refresh'
    ) {
        osutopdata = func.findFile(input.absoluteID, 'osutopdata')
    } else {
        osutopdata = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
    }

    osufunc.debug(osutopdata, 'command', 'osutop', input.obj.guildId, 'osuTopData');
    func.storeFile(osutopdata, input.absoluteID, 'osutopdata')

    if (osutopdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.reply({
                        content: `Error - could not find \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }, 1000);
            } else {//@ts-ignore
                input.obj.reply({
                    content: `Error - could not find \`${user}\`'s top scores`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }
        return;
    }

    try {
        osutopdata[0].user.username
    } catch (error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.reply({
                        content: `Error - could not fetch \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000);
            } else {//@ts-ignore
                input.obj.reply({
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

    const topEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`Top plays of ${osutopdata[0].user.username}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setURL(`https://osu.ppy.sh/users/${osutopdata[0].user.id}/${osutopdata[0].mode}`)
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
            reverse: reverse
        })
    topEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${Math.ceil(scoresarg.maxPages)}\n${emojis.gamemodes[mode]}`)
    if (scoresarg.fields.length == 0) {
        topEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }])
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[2].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
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
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
    }
    if (scoresarg.isLastPage) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
    }
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            console.log(error)
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

export async function pinned(input: extypes.commandInput) {

    let commanduser;

    let user;
    let searchid;
    let page = 0;

    let scoredetailed = false;
    let sort: embedStuff.scoreSort = 'recent';
    let reverse = false;
    let mode = 'osu';
    let filteredMapper = null;
    let filteredMods = null;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            //@ts-expect-error mentions property does not exist on interaction
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-page')) {
                page = parseInt(input.args[input.args.indexOf('-page') + 1]);
                input.args.splice(input.args.indexOf('-page'), 2);
            }
            if (input.args.includes('-p')) {
                page = parseInt(input.args[input.args.indexOf('-p') + 1]);
                input.args.splice(input.args.indexOf('-p'), 2);
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
            if (input.args.includes('-mania')) {
                mode = 'mania'
                input.args.splice(input.args.indexOf('-mania'), 1);
            }
            if (input.args.includes('-recent')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-performance')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-pp')) {
                sort = 'pp';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-score')) {
                sort = 'score';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-acc')) {
                sort = 'acc';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-combo')) {
                sort = 'combo';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-miss')) {
                sort = 'miss';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-rank')) {
                sort = 'rank';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-r')) {
                sort = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            user = input.args.join(' ');
            if (!input.args[0] || input.args.includes(searchid)) {
                user = null
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
            searchid = input.obj.member.user.id;//@ts-ignore
            user = input.obj.options.getString('user');//@ts-ignore
            page = input.obj.options.getInteger('page');//@ts-ignore
            scoredetailed = input.obj.options.getBoolean('detailed');//@ts-ignore
            sort = input.obj.options.getString('sort');//@ts-ignore
            reverse = input.obj.options.getBoolean('reverse');//@ts-ignore
            mode = input.obj.options.getString('mode') ?? 'osu';//@ts-ignore
            filteredMapper = input.obj.options.getString('mapper');//@ts-ignore
            filteredMods = input.obj.options.getString('mods');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {//@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;//@ts-ignore
            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0]//@ts-ignore
            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1]
            page = 0;//@ts-ignore
            if (input.obj.message.embeds[0].description) {//@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mapper')) {//@ts-ignore
                    filteredMapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }//@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mods')) {//@ts-ignore
                    filteredMods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }//@ts-ignore
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

                //@ts-ignore
                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses'))) {
                    reverse = true
                } else {
                    reverse = false
                }//@ts-ignore
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
                    case 'BigRightArrow'://@ts-ignore
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
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {//@ts-ignore
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
    }

    mode = osufunc.modeValidator(mode);

    if (input.commandType == 'interaction') {//@ts-ignore
        input.obj.reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        }).catch()
    }

    let osudata: osuApiTypes.User;

    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`, `${mode}`)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, user, 'osudata')

    osufunc.debug(osudata, 'command', 'pinned', input.obj.guildId, 'osuData');
    if (osudata?.error || !osudata.id) {
        if (input.commandType == 'interaction') {
            setTimeout(() => {//@ts-ignore
                input.obj.reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }, 1000);
        } else {//@ts-ignore
            input.obj.reply({
                content: `Error - could not find user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        return;
    }

    let pinnedscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = []; //= await osufunc.apiget('pinned', `${osudata.id}`, `${mode}`)
    async function getScoreCount(cinitnum) {
        const fd: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('pinned_alt', `${osudata.id}`, `mode=${mode}&offset=${cinitnum}`, 2, 0, true)
        if (fd?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {//@ts-ignore
                        input.obj.editReply({
                            content: 'Error - could not fetch user\'s pinned scores',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }, 1000)
                } else {//@ts-ignore
                    input.obj.reply({
                        content: 'Error - could not fetch user\'s pinned scores',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
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

    const pinnedEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`Pinned scores for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${pinnedscoresdata[0].mode}`)
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
            reverse: false
        });
    pinnedEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${scoresarg.maxPages}\n${emojis.gamemodes[mode]}\n`)
    if (scoresarg.fields.length == 0) {
        pinnedEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }])
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[2].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
    } else {
        for (let i = 0; i < scoresarg.fields.length; i++) {
            pinnedEmbed.addFields([scoresarg.fields[i]])
        }
    }
    if (scoresarg.isFirstPage) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
    }
    if (scoresarg.isLastPage) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
    }

    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            console.log(error)
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

export async function recent(input: extypes.commandInput) {

    let commanduser;

    let user;
    let searchid;
    let page = 0;
    let mode = null;
    let list;

    let isFirstPage = false;
    let isLastPage = false;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            //@ts-expect-error mentions property does not exist on interaction
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
                page = parseInt(input.args[input.args.indexOf('-page') + 1]);
                input.args.splice(input.args.indexOf('-page'), 2);
            }
            if (input.args.includes('-p')) {
                page = parseInt(input.args[input.args.indexOf('-p') + 1]);
                input.args.splice(input.args.indexOf('-p'), 2);
            }
            if (input.args.includes('-mode')) {
                mode = (input.args[input.args.indexOf('-mode') + 1]);
                input.args.splice(input.args.indexOf('-mode'), 2);
            }
            if (input.args.includes('-m')) {
                mode = (input.args[input.args.indexOf('-m') + 1]);
                input.args.splice(input.args.indexOf('-m'), 2);
            }
            user = input.args.join(' ');
            if (!input.args[0] || input.args.includes(searchid)) {
                user = null
            }
            isFirstPage = true;

        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
            searchid = input.obj.member.user.id;//@ts-ignore
            user = input.obj.options.getString('user');//@ts-ignore
            page = input.obj.options.getNumber('page');//@ts-ignore
            mode = input.obj.options.getString('mode');//@ts-ignore
            list = input.obj.options.getBoolean('list');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {//@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            user =//@ts-ignore
                input.obj.message.embeds[0].title.includes('play for') ?//@ts-ignore
                    input.obj.message.embeds[0].title.split('most recent play for ')[1].split(' | ')[0] ://@ts-ignore
                    input.obj.message.embeds[0].title.split('plays for ')[1]
            //@ts-ignore
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

            page = 0
            if (input.button == 'BigLeftArrow') {
                page = 1
                isFirstPage = true
            }//@ts-ignore
            if (input.obj.message.embeds[0].title.includes('plays')) {
                switch (input.button) {
                    case 'LeftArrow'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1
                        break;
                    case 'RightArrow'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1
                        break;
                    case 'BigRightArrow'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n'[0]))
                        break;
                    case 'Refresh'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0])
                        break;
                }
                list = true//@ts-ignore
                if (isNaN((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) || ((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) == 'NaN') {
                    page = 1
                }
                if (page < 2) {
                    isFirstPage = true;
                }//@ts-ignore
                if (page == parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n'[0]))) {
                    isLastPage = true;
                }
            } else {
                switch (input.button) {
                    case 'LeftArrow'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].title).split(' ')[0].split('#')[1]) - 1
                        break;
                    case 'RightArrow'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].title).split(' ')[0].split('#')[1]) + 1
                        break;
                    case 'Refresh'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].title).split(' ')[0].split('#')[1])
                        break;
                }
                if (page < 2) {
                    page == 1
                }
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
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {//@ts-ignore
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
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
    let osudata: osuApiTypes.User;
    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`, `${mode}`)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, user, 'osudata')
    osufunc.debug(osudata, 'command', 'recent', input.obj.guildId, 'osuData');

    if (osudata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {//@ts-ignore
            input.obj.reply({
                content: `Error - could not fetch user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
        }
        return;
    }

    if (!osudata.id) {
        if (input.commandType != 'button' && input.commandType != 'link') {//@ts-ignore
            input.obj.reply({
                content: `Error - could not fetch user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
        }
        return;
    }

    if (input.commandType == 'interaction') {//@ts-ignore
        input.obj.reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        })
            .catch()
    }

    let rsdata: osuApiTypes.Score[] & osuApiTypes.Error;
    if (func.findFile(input.absoluteID, 'rsdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'rsdata')) &&
        input.button != 'Refresh'
    ) {
        rsdata = func.findFile(input.absoluteID, 'rsdata')
    } else {
        rsdata = await osufunc.apiget('recent_alt', `${osudata.id}`, `mode=${mode}&offset=0`, 2, 0, true)
    }
    osufunc.debug(rsdata, 'command', 'recent', input.obj.guildId, 'rsData');
    func.storeFile(rsdata, input.absoluteID, 'rsdata')
    if (rsdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.editReply({
                        content: `Error - could not fetch \`${user}\`\'s recent scores`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }, 1000)
            } else {//@ts-ignore
                input.obj.reply({
                    content: `Error - could not fetch \`${user}\`\'s recent scores`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }

        }
        return;
    }

    const rsEmbed = new Discord.EmbedBuilder()
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        });
    if (list != true) {
        rsEmbed.setColor(colours.embedColour.score.dec)

        if (input.button == 'BigRightArrow') {
            page = rsdata.length - 1
        }

        const curscore = rsdata[0 + page]
        if (!curscore || curscore == undefined || curscore == null) {
            if (input.button == null) {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {//@ts-ignore
                        input.obj.editReply({
                            content: `Error - \`${user}\` has no recent ${mode ?? 'osu'} scores`,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }, 1000)
                } else {//@ts-ignore
                    input.obj.reply(
                        {
                            content: `Error - \`${user}\` has no recent ${emojis.gamemodes[mode ?? 'osu']} scores`,
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

        let mapdata: osuApiTypes.Beatmap;
        if (func.findFile(curbm.id, 'mapdata') &&
            !('error' in func.findFile(curbm.id, 'mapdata')) &&
            input.button != 'Refresh'
        ) {
            mapdata = func.findFile(curbm.id, 'mapdata')
        } else {
            mapdata = await osufunc.apiget('map', `${curbm.id}`)
        }
        osufunc.debug(mapdata, 'command', 'recent', input.obj.guildId, 'mapData');
        func.storeFile(mapdata, curbm.id, 'mapdata')
        if (mapdata?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {//@ts-ignore
                        input.obj.editReply({
                            content: 'Error - could not find beatmap',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }, 1000)
                } else {//@ts-ignore
                    input.obj.reply({
                        content: 'Error - could not find beatmap',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            return;
        }

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
        let ppcalcing
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
                passedObj: 0,
                failed: false
            })
            if (curscore.rank == 'F') {
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
                    passedObj: totalhits,
                    failed: true
                }
                )
            }
            totaldiff = ppcalcing[0].stars.toFixed(2)


            rspp =
                curscore.pp ?
                    curscore.pp.toFixed(2) :
                    ppcalcing[0].pp.toFixed(2)
            osufunc.debug(ppcalcing, 'command', 'recent', input.obj.guildId, 'ppCalcing');
        } catch (error) {
            rspp =
                curscore.pp ?
                    curscore.pp.toFixed(2) :
                    NaN
            ppissue = 'Error - pp calculator could not calculate beatmap'
        }
        let fcflag = 'FC'
        if (curscore.accuracy != 100) {
            fcflag += `\n**${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
        }
        if (curscore.perfect == false) {
            fcflag =
                `\n**${ppcalcing[1].pp.toFixed(2)}**pp IF ${fcaccgr.accuracy.toFixed(2)}% FC
            **${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
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
            .setTitle(`#${page + 1} most recent play for ${curscore.user.username} | <t:${new Date(curscore.created_at).getTime() / 1000}:R>`)
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
`)
            .addFields([
                {
                    name: 'SCORE DETAILS',
                    value: `${(curscore.accuracy * 100).toFixed(2)}% | ${rsgrade}\n ${curscore.replay ? `[REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}` +
                        `${rspassinfo}\n${hitlist}\n${curscore.max_combo}x combo`,
                    inline: true
                },
                {
                    name: 'PP',
                    value: `**${rspp}**pp ${fcflag}\n${ppissue}`,
                    inline: true
                }
            ])

        if (page >= rsdata.length - 1) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[2].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[3].setDisabled(true)
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
            .setTitle(`Recent plays for ${osudata.username}`);
        const scoresarg = await embedStuff.scoreList(
            {
                scores: rsdata,
                detailed: false,
                showWeights: false,
                page: page,
                showMapTitle: true,
                showTruePosition: false,
                sort: 'recent',
                truePosType: 'recent',
                filteredMapper: null,
                filteredMods: null,
                reverse: false
            })
        if (scoresarg.fields.length == 0) {
            rsEmbed.addFields([{
                name: 'Error',
                value: 'No scores found',
                inline: false
            }])
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[0].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[1].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[2].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[3].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[4].setDisabled(true)
        } else {
            for (let i = 0; scoresarg.fields.length > i; i++) {
                rsEmbed.addFields(scoresarg.fields[i])
            }
        }
        rsEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(rsdata.length / 5)}\n${emojis.gamemodes[mode]}`)
        rsEmbed.setFooter({ text: `-` })
        if (scoresarg.isFirstPage) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[0].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[1].setDisabled(true)
        }
        if (scoresarg.isLastPage) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[3].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[4].setDisabled(true)
        }
    }
    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);

    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata)
        } catch (error) {
            console.log(error)
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

export async function replayparse(input: extypes.commandInput) {

    let commanduser;
    let replay;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            //@ts-expect-error author property does not exist on interaction
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
    if (func.findFile(replay.beatmapMD5, `mapdata`) &&

        !('error' in func.findFile(replay.beatmapMD5, `mapdata`)) &&
        input.button != 'Refresh') {
        mapdata = func.findFile(replay.beatmapMD5, `mapdata`)
    } else {
        mapdata = await osufunc.apiget('map_get_md5', replay.beatmapMD5)
    }
    func.storeFile(mapdata, replay.beatmapMD5, 'mapdata')

    osufunc.debug(mapdata, 'fileparse', 'replay', input.obj.guildId, 'mapData');
    if (mapdata?.id) {
        typeof mapdata.id == 'number' ? osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`) : ''
    }
    let osudata: osuApiTypes.User;
    if (func.findFile(replay.playerName, 'osudata') &&
        !('error' in func.findFile(replay.playerName, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(replay.playerName, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await replay.playerName}`)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, replay.playerName, 'osudata')
    osufunc.debug(osudata, 'fileparse', 'replay', input.obj.guildId, 'osuData');
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
            failed: failed
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

    const chart = await osufunc.graph(dataLabel, lifebarF, 'Health', null, null, null, null, null, 'replay')
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

export async function scoreparse(input: extypes.commandInput) {

    let commanduser;

    let scorelink: string;
    let scoremode: string;
    let scoreid: number | string;


    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            scorelink = null;
            scoremode = input.args[1] ?? 'osu';
            scoreid = input.args[0];
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;//@ts-ignore
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

    let scoredata: osuApiTypes.Score;

    if (func.findFile(scoreid, 'scoredata') &&
        !('error' in func.findFile(scoreid, 'scoredata')) &&
        input.button != 'Refresh'
    ) {
        scoredata = func.findFile(scoreid, 'scoredata')
    } else {
        scoredata = await osufunc.apiget('score', `${scoreid}`, `${scoremode}`)
    }
    func.storeFile(scoredata, scoreid, 'scoredata')

    if (scoredata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {//@ts-ignore
            input.obj.reply({
                content: 'Error - could not fetch score data',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()

        }
        return;
    }
    try {
        if (typeof scoredata?.error != 'undefined') {//@ts-ignore
            input.obj.reply({ content: 'This score is unsubmitted/failed/invalid and cannot be parsed', allowedMentions: { repliedUser: false } })
                .catch();
            return;
        }
    } catch (error) {
    }

    if (input.commandType == 'interaction') {//@ts-ignore
        input.obj.reply({ content: "Loading...", allowedMentions: { repliedUser: false } })
            .catch();

    }

    osufunc.debug(scoredata, 'command', 'scoreparse', input.obj.guildId, 'scoreData');
    try {
        scoredata.rank.toUpperCase();
    } catch (error) {//@ts-ignore
        input.obj.reply({ content: 'This score is unsubmitted/failed/invalid and cannot be parsed', allowedMentions: { repliedUser: false } })
            .catch();
        return;
    }
    let mapdata: osuApiTypes.Beatmap;
    if (func.findFile(scoredata.beatmap.id, 'mapdata') &&
        !('error' in func.findFile(scoredata.beatmap.id, 'mapdata')) &&
        input.button != 'Refresh') {
        mapdata = func.findFile(scoredata.beatmap.id, 'mapdata')
    } else {
        mapdata = await osufunc.apiget('map_get', `${scoredata.beatmap.id}`)
    }
    func.storeFile(mapdata, scoredata.beatmap.id, 'mapdata')

    if (mapdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.editReply({
                        content: 'Error - could not fetch beatmap data',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }, 1000)
            } else {//@ts-ignore
                input.obj.reply({
                    content: 'Error - could not fetch beatmap data',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
    }

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
    let ppcalcing;
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
            passedObj: 0,
            failed: false
        })

        ppissue = '';
        osufunc.debug(ppcalcing, 'command', 'scoreparse', input.obj.guildId, 'ppCalcing');
    } catch (error) {
        ppcalcing = [{
            pp: 0.000
        }, {
            pp: 0.000
        }]
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

    let osudata: osuApiTypes.User;
    if (func.findFile(scoredata.user.username, 'osudata') &&
        !('error' in func.findFile(scoredata.user.username, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(scoredata.user.username, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await scoredata.user.username}`, `${mode}`)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, scoredata.user.username, 'osudata')
    osufunc.debug(osudata, 'command', 'scoreparse', input.obj.guildId, 'osuData')
    if (osudata?.error) {
        if (input.commandType == 'interaction') {
            setTimeout(() => {//@ts-ignore
                input.obj.reply({
                    content: `Error - could not find user \`${scoredata?.user?.username}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }, 1000);
        } else {//@ts-ignore
            input.obj.reply({
                content: `Error - could not find user \`${scoredata?.user?.username}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        return;
    }
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
${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade} ${scoredata.mods.join('').length > 1 ? '| ' + scoredata.mods.join('') : ''}
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
            embeds: [scoreembed]
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

export async function scores(input: extypes.commandInput) {

    let commanduser;

    let user;
    let searchid;
    let mapid;
    let page = 1;

    const scoredetailed = false;
    let sort: any = 'recent';
    let reverse = false;
    let mode = 'osu';
    let filteredMapper = null;
    let filteredMods = null;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;//@ts-ignore
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-page')) {
                page = parseInt(input.args[input.args.indexOf('-page') + 1]);
                input.args.splice(input.args.indexOf('-page'), 2);
            }
            if (input.args.includes('-p')) {
                page = parseInt(input.args[input.args.indexOf('-p') + 1]);
                input.args.splice(input.args.indexOf('-p'), 2);
            }
            user = input.args.join(' ');
            if (!input.args[0] || input.args.includes(searchid) || isNaN(+input.args[0])) {
                user = null
            }
            mapid = null;
            if (!isNaN(+input.args[0])) {
                mapid = +input.args[0];
            }
            //find if any string in input.args is a number
            const number = input.args.find(arg => !isNaN(+arg));
            if (number) {
                mapid = +number;
            }

        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
            searchid = input.obj.member.user.id;//@ts-ignore
            user = input.obj.options.getString('username');//@ts-ignore
            mapid = input.obj.options.getNumber('id');//@ts-ignore
            sort = input.obj.options.getString('sort');//@ts-ignore
            reverse = input.obj.options.getBoolean('reverse');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {//@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            page = 0;//@ts-ignore
            user = input.obj.message.embeds[0].author.name.split(' (#')[0]//@ts-ignore
            mapid = input.obj.message.embeds[0].url.split('osu.ppy.sh/')[1].split('/')[1]//@ts-ignore
            if (input.obj.message.embeds[0].description) {//@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mapper')) {//@ts-ignore
                    filteredMapper = input.obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                }//@ts-ignore
                if (input.obj.message.embeds[0].description.includes('mods')) {//@ts-ignore
                    filteredMods = input.obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                }//@ts-ignore
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

                //@ts-ignore
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
                    case 'LeftArrow'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
                        break;
                    case 'RightArrow'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
                        break;
                    case 'BigRightArrow'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].description).split('/')[1].split('\n')[0])
                        break;
                    case 'Refresh'://@ts-ignore
                        page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1])
                        break;
                }//@ts-ignore
                mode = input.obj.message.embeds[0].description.split('mode: ')[1].split('\n')[0]
            }//@ts-ignore
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
                case 'BigRightArrow'://@ts-ignore
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
                .setStyle(Discord.ButtonStyle.Primary)
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
                .setCustomId(`BigLeftArrow-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji(buttonsthing.label.page.first).setDisabled(false),
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji(buttonsthing.label.page.previous),
            new Discord.ButtonBuilder()
                .setCustomId(`Search-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji(buttonsthing.label.page.search),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji(buttonsthing.label.page.next),
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji(buttonsthing.label.page.last),
        );

    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {//@ts-ignore
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
    }

    mode = osufunc.modeValidator(mode);

    if (!mapid || isNaN(mapid)) {
        mapid = osufunc.getPreviousId('map', input.obj.guildId);
    }

    if (input.commandType == 'interaction') {//@ts-ignore
        input.obj.reply({
            content: 'Loading...',
            allowedMentions: { repliedUser: false },
            failIfNotExists: false,
        }).catch()
    }

    let osudata: osuApiTypes.User;

    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`, `${mode}`)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, user, 'osudata')

    osufunc.debug(osudata, 'command', 'scores', input.obj.guildId, 'osuData');

    if (osudata?.error || !osudata.id) {
        if (input.commandType == 'interaction') {
            setTimeout(() => {//@ts-ignore
                input.obj.reply({
                    content: `Error - could not find user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }, 1000);
        } else {//@ts-ignore
            input.obj.reply({
                content: `Error - could not find user \`${user}\``,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        return;

    }

    if (page == null || page < 1) {
        page = 0
    } else {
        page = page - 1
    }
    let scoredataPresort: osuApiTypes.ScoreArrA;
    if (func.findFile(input.absoluteID, 'scores') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'scores')) &&
        input.button != 'Refresh'
    ) {
        scoredataPresort = func.findFile(input.absoluteID, 'scores')
    } else {
        scoredataPresort = await osufunc.apiget('user_get_scores_map', `${mapid}`, `${osudata.id}`)
    }
    osufunc.debug(scoredataPresort, 'command', 'scores', input.obj.guildId, 'scoreDataPresort');
    func.storeFile(scoredataPresort, input.absoluteID, 'scores')

    if (scoredataPresort?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.editReply({
                        content: 'Error - could not fetch scores',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }, 1000)
            } else {//@ts-ignore
                input.obj.reply({
                    content: 'Error - could not fetch scores',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        return;
    }

    const scoredata: osuApiTypes.Score[] = scoredataPresort.scores
    try {
        scoredata.length < 1
    } catch (error) {//@ts-ignore
        return input.obj.reply({
            content: `Error - no scores found for \`${user}\` on map \`${mapid}\``,
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        })
            .catch();
    }
    osufunc.debug(scoredata, 'command', 'scores', input.obj.guildId, 'scoreData');

    let mapdata: osuApiTypes.Beatmap;
    if (func.findFile(mapid, 'mapdata') &&
        !('error' in func.findFile(mapid, 'mapdata')) &&
        input.button != 'Refresh'
    ) {
        mapdata = func.findFile(mapid, 'mapdata')
    } else {
        mapdata = await osufunc.apiget('map', `${mapid}`)
    }
    osufunc.debug(mapdata, 'command', 'scores', input.obj.guildId, 'mapData');
    func.storeFile(mapdata, mapid, 'mapdata')
    if (mapdata?.error) {
        if (input.commandType != 'button' && input.commandType != 'link') {
            if (input.commandType == 'interaction') {
                setTimeout(() => {//@ts-ignore
                    input.obj.editReply({
                        content: 'Error - could not fetch beatmap data',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }, 1000)
            } else {//@ts-ignore
                input.obj.reply({
                    content: 'Error - could not fetch beatmap data',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
        }
        return;
    }

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
            reverse: reverse,
            mapidOverride: mapdata.id
        })
    scoresEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${scoresarg.maxPages}\nmode: ${mode}\n`)
    if (scoresarg.fields.length == 0) {
        scoresEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }])
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[2].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
    } else {
        for (let i = 0; i < scoredata.length && i < 5; i++) {
            scoresEmbed.addFields([scoresarg.fields[i]])
        }
    }


    osufunc.writePreviousId('user', input.obj.guildId, `${osudata.id}`);
    osufunc.writePreviousId('map', input.obj.guildId, `${mapdata.id}`);

    if (scoresarg.isFirstPage) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[0].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[1].setDisabled(true)
    }
    if (scoresarg.isLastPage) {
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[3].setDisabled(true)
        //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
        pgbuttons.components[4].setDisabled(true)
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

export async function simulate(input: extypes.commandInput) {

    let commanduser;
    let mapid = null;
    let mods = null;
    let acc = null;
    let combo = null;
    let n300 = null;
    let n100 = null;
    let n50 = null;
    let nMiss = null;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;//@ts-ignore
            const ctn = input.obj.content;
            if (isNaN(+input.args[0])) {
                mapid = +input.args[0]
            }
            if (ctn.includes('+')) {
                mods = ctn.split('+')[1].split(' ')[0]
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
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            mapid = input.obj.options.getInteger('id')//@ts-ignore
            mods = input.obj.options.getString('mods')//@ts-ignore
            acc = input.obj.options.getNumber('accuracy')//@ts-ignore
            combo = input.obj.options.getInteger('combo')//@ts-ignore
            n300 = input.obj.options.getInteger('n300')//@ts-ignore
            n100 = input.obj.options.getInteger('n100')//@ts-ignore
            n50 = input.obj.options.getInteger('n50')//@ts-ignore
            nMiss = input.obj.options.getInteger('miss')
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
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

    if (input.commandType == 'interaction') {//@ts-ignore
        input.obj.reply({ content: "Loading...", allowedMentions: { repliedUser: false } })
            .catch();

    }

    const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${mapid}`)
    osufunc.debug(mapdata, 'command', 'map', input.obj.guildId, 'mapData');

    if (!mods) {
        mods = 'NM'
    }
    if (!combo) {
        combo = mapdata.max_combo
    }

    const score = await osufunc.scorecalc({
        mods,
        gamemode: 'osu',
        mapid,
        hit300: n300,
        hit100: n100,
        hit50: n50,
        miss: nMiss,
        acc,
        maxcombo: combo,
        score: null,
        calctype: 0,
        failed: false
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
        calctype: 0
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

export async function map(input: extypes.commandInput) {

    let commanduser;

    let mapid;
    let mapmods;
    let maptitleq = null;
    let detailed = false;

    const useComponents = [];
    let overwriteModal = null;


    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            if (!isNaN(+input.args[0])) {
                mapid = input.args[0];
            }

            if (input.args.join(' ').includes('+')) {
                mapmods = input.args.join(' ').split('+')[1]
            }
            if (input.args.join(' ').includes('"')) {
                maptitleq = input.args.join(' ').split('"')[1]
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
            //@ts-ignore
            mapid = input.obj.options.getInteger('id');//@ts-ignore
            mapmods = input.obj.options.getString('mods');//@ts-ignore
            detailed = input.obj.options.getBoolean('detailed');//@ts-ignore
            maptitleq = input.obj.options.getString('query');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {//@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;//@ts-ignore
            const urlnohttp = input.obj.message.embeds[0].url.split('https://')[1];
            const setid = urlnohttp.split('/')[2].split('#')[0];
            const curid = urlnohttp.split('/')[3];
            mapid = curid;
            let bmsdata: osuApiTypes.Beatmapset;
            if (func.findFile(setid, `bmsdata`) &&
                !('error' in func.findFile(setid, `bmsdata`)) &&
                input.button != 'Refresh') {
                bmsdata = func.findFile(setid, `bmsdata`)
            } else {
                bmsdata = await osufunc.apiget('mapset_get', `${setid}`)
            }
            func.storeFile(bmsdata, setid, `bmsdata`)

            osufunc.debug(bmsdata, 'command', 'map', input.obj.guildId, 'bmsData');

            if (bmsdata?.error) {
                return;
            }
            const bmstosr = bmsdata.beatmaps.sort((a, b) => a.difficulty_rating - b.difficulty_rating);
            osufunc.debug(bmstosr, 'command', 'map', input.obj.guildId, 'bmsToSr');

            const curmapindex = bmstosr.findIndex(x => x.id == curid);
            if (input.button == `RightArrow`) {
                if (curmapindex == bmstosr.length - 1) {
                    mapid = curid;
                } else {
                    mapid = bmstosr[curmapindex + 1].id;
                }
            }
            if (input.button == `LeftArrow`) {
                if (curmapindex == 0) {
                    mapid = curid;
                } else {
                    mapid = bmstosr[curmapindex - 1].id;
                }
            }
            if (input.button == `BigRightArrow`) {
                mapid = bmstosr[bmstosr.length - 1].id;
            }
            if (input.button == `BigLeftArrow`) {
                mapid = bmstosr[0].id;
            }
            //@ts-ignore
            if (input.obj.message.embeds[0].fields[1].value.includes('aim') || input.obj.message.embeds[0].fields[0].value.includes('ms')) {
                detailed = true
            }//@ts-ignore
            mapmods = input.obj.message.embeds[0].title.split('+')[1];
            if (input.button == 'DetailEnable') {
                detailed = true;
            }
            if (input.button == 'DetailDisable') {
                detailed = false;
            }
            if (input.button == 'Refresh') {
                mapid = curid;//@ts-ignore
                detailed = input.obj.message.embeds[0].fields[1].value.includes('aim') || input.obj.message.embeds[0].fields[0].value.includes('ms')
            }
        }
            break;

        case 'link': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            //@ts-ignore
            const messagenohttp = input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '')
            mapmods =//@ts-ignore
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
                } catch (error) {//@ts-ignore
                    input.obj.reply({
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
                    setid = messagenohttp.split('/s/')[1]

                    if (isNaN(setid)) {
                        setid = messagenohttp.split('/s/')[1].split(' ')[0]
                    }
                } else if (!messagenohttp.includes('/s/')) {
                    setid = messagenohttp.split('/beatmapsets/')[1]

                    if (isNaN(setid)) {
                        setid = messagenohttp.split('/s/')[1].split(' ')[0]
                    }
                }
                const bmsdata: osuApiTypes.Beatmapset = await osufunc.apiget('mapset_get', `${setid}`)
                if (bmsdata?.error) {
                    return;
                }
                try {
                    mapid = bmsdata.beatmaps[0].id;
                } catch (error) {//@ts-ignore
                    input.obj.reply({
                        content: 'Please enter a valid beatmap link.',
                        allowedMentions: {
                            repliedUser: false
                        }
                    })
                        .catch(error => { });
                    return;
                }
            }
        }
            break;
    }
    if (input.overrides != null) {
        overwriteModal = input.overrides.overwriteModal ?? overwriteModal
        mapid = input.overrides.id ?? mapid
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
                value: detailed
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
    let mapdata: osuApiTypes.Beatmap;

    const inputModal = new Discord.SelectMenuBuilder()
        .setCustomId(`Select-map-${commanduser.id}-${input.absoluteID}`)
        .setPlaceholder('Select a map')

    if (maptitleq == null) {
        if (func.findFile(mapid, 'mapdata') &&
            !('error' in func.findFile(mapid, 'mapdata')) &&
            input.button != 'Refresh') {
            mapdata = func.findFile(mapid, 'mapdata')
        } else {
            mapdata = await osufunc.apiget('map_get', `${mapid}`)
        }
        func.storeFile(mapdata, mapid, 'mapdata')

        osufunc.debug(mapdata, 'command', 'map', input.obj.guildId, 'mapData');

        if (mapdata?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                //@ts-ignore
                input.obj.reply({
                    content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()

            }
            return;
        }
        let bmsdata: osuApiTypes.Beatmapset;
        if (func.findFile(mapdata.beatmapset_id, `bmsdata`) &&
            !('error' in func.findFile(mapdata.beatmapset_id, `bmsdata`)) &&
            input.button != 'Refresh') {
            bmsdata = func.findFile(mapdata.beatmapset_id, `bmsdata`)
        } else {
            bmsdata = await osufunc.apiget('mapset_get', `${mapdata.beatmapset_id}`)
        }
        func.storeFile(bmsdata, mapdata.beatmapset_id, `bmsdata`)

        osufunc.debug(bmsdata, 'command', 'map', input.obj.guildId, 'bmsData');

        if (typeof bmsdata.beatmaps == 'undefined' || bmsdata.beatmaps.length < 2) {
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

    if (maptitleq != null) {
        const mapidtest = await osufunc.apiget('mapset_search', `${maptitleq}`)
        osufunc.debug(mapidtest, 'command', 'map', input.obj.guildId, 'mapIdTestData');

        if (mapidtest?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {//@ts-ignore
                input.obj.reply({
                    content: 'Error - could not fetch beatmap search data.',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }

        let mapidtest2;

        if (mapidtest.length == 0) {//@ts-ignore
            input.obj.reply({ content: 'Error - map not found.\nNo maps found for the parameters: "' + maptitleq + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                .catch();

            return;
        }
        try {
            mapidtest2 = mapidtest.beatmapsets[0].beatmaps.sort((a, b) => a.difficulty_rating - b.difficulty_rating)
        } catch (error) {//@ts-ignore
            input.obj.reply({ content: 'Error - map not found.\nNo maps found for the parameters: "' + maptitleq + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                .catch();
            return;
        }
        const allmaps: { mode_int: number, map: osuApiTypes.BeatmapCompact, mapset: osuApiTypes.Beatmapset }[] = [];

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
            mapdata = func.findFile(mapidtest2[0].id, 'mapdata')
        } else {
            mapdata = await osufunc.apiget('map_get', `${mapidtest2[0].id}`)
        }
        func.storeFile(mapdata, mapidtest2[0].id, 'mapdata')

        osufunc.debug(mapdata, 'command', 'map', input.obj.guildId, 'mapData');
        if (mapdata?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                //@ts-ignore
                input.obj.reply({
                    content: `Error - could not fetch beatmap data for map \`${mapid}\`.`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
            return;
        }

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

    if (mapmods == null || mapmods == '') {
        mapmods = 'NM';
    }
    else {
        mapmods = osumodcalc.OrderMods(mapmods.toUpperCase());
    }
    let statusimg = emojis.rankedstatus.graveyard;
    if (input.commandType == 'interaction') {//@ts-ignore
        input.obj.reply({ content: "Loading...", allowedMentions: { repliedUser: false } })
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

    const allvals = osumodcalc.calcValues(
        mapdata.cs,
        mapdata.ar,
        mapdata.accuracy,
        mapdata.drain,
        mapdata.bpm,
        mapdata.hit_length,
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
    let ppComputed: object;
    let ppissue: string;
    let totaldiff = mapdata.difficulty_rating;
    try {
        ppComputed = await osufunc.mapcalc({
            mods: mapmods,
            gamemode: mapdata.mode,
            mapid: mapdata.id,
            calctype: 0
        })
        ppissue = '';
        try {
            totaldiff = ppComputed[0].stars?.toFixed(2)
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
        const ppComputedTemp = {
            "mode": 0,
            "stars": 1.00,
            "pp": 0.0,
            "ppAcc": 0.0,
            "ppAim": 0.0,
            "ppFlashlight": 0.0,
            "ppSpeed": 0.0,
            "ppStrain": 0.0,
            "ar": 1,
            "cs": 1,
            "hp": 1,
            "od": 1,
            "bpm": 1,
            "clockRate": 1,
            "timePreempt": null,
            "greatHitWindow": 0,
            "nCircles": 0,
            "nSliders": 0
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
    let basicvals = `CS${allvals.cs} AR${allvals.ar} OD${allvals.od} HP${allvals.hp}`;
    if (detailed == true) {
        basicvals =
            `CS${allvals.cs} (${allvals.details.csRadius?.toFixed(2)}r)
            AR${allvals.ar}  (${allvals.details.arMs?.toFixed(2)}ms)
            OD${allvals.od} (300: ${allvals.details.odMs.hitwindow_300?.toFixed(2)}ms 100: ${allvals.details.odMs.hitwindow_100?.toFixed(2)}ms 50:  ${allvals.details.odMs.hitwindow_50?.toFixed(2)}ms)
            HP${allvals.hp}`
    }

    const mapname = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title})`;
    const artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist_unicode} (${mapdata.beatmapset.artist})`;
    const maptitle: string = mapmods ? `${artist} - ${mapname} [${mapdata.version}] +${mapmods}` : `${artist} - ${mapname} [${mapdata.version}]`

    let mapperdata: osuApiTypes.User;
    if (func.findFile(mapdata.beatmapset.user_id, `osudata`) &&
        !('error' in func.findFile(mapdata.beatmapset.user_id, `osudata`)) &&
        input.button != 'Refresh') {
        mapperdata = func.findFile(mapdata.beatmapset.user_id, `osudata`)
    } else {
        mapperdata = await osufunc.apiget('user', `${mapdata.beatmapset.user_id}`)
    }
    func.storeFile(mapperdata, mapperdata.id, `osudata`)

    osufunc.debug(mapperdata, 'command', 'map', input.obj.guildId, 'mapperData');

    if (mapperdata?.error) {
        mapperdata = JSON.parse(fs.readFileSync('./files/defaults/mapper.json', 'utf8'));
        // if (commandType != 'button' && commandType != 'link') {
        //     input.obj.reply({
        //         content: 'Error - could not find mapper',
        //         allowedMentions: { repliedUser: false },
        //         failIfNotExists: true
        //     })
        // }
        // return;
    }

    const strains = await osufunc.straincalc(mapdata.id, mapmods, 0, mapdata.mode)
    try {
        osufunc.debug(strains, 'command', 'map', input.obj.guildId, 'strains');

    } catch (error) {
        osufunc.debug({ error: error }, 'command', 'map', input.obj.guildId, 'strains');
    }
    let mapgraph;
    if (strains) {
        mapgraph = await osufunc.graph(strains.strainTime, strains.value, 'Strains', null, null, null, null, null, 'strains')
    } else {
        mapgraph = null
    }
    let detailedmapdata = '-';
    if (detailed == true) {
        switch (mapdata.mode) {
            case 'osu': {
                detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} | Aim: ${ppComputed[0].ppAim?.toFixed(2)} | Speed: ${ppComputed[0].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[0].ppAcc?.toFixed(2)} \n ` +
                    `**99**: ${ppComputed[1].pp?.toFixed(2)} | Aim: ${ppComputed[1].ppAim?.toFixed(2)} | Speed: ${ppComputed[1].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[1].ppAcc?.toFixed(2)} \n ` +
                    `**97**: ${ppComputed[3].pp?.toFixed(2)} | Aim: ${ppComputed[3].ppAim?.toFixed(2)} | Speed: ${ppComputed[3].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[3].ppAcc?.toFixed(2)} \n ` +
                    `**95**: ${ppComputed[5].pp?.toFixed(2)} | Aim: ${ppComputed[5].ppAim?.toFixed(2)} | Speed: ${ppComputed[5].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[5].ppAcc?.toFixed(2)} \n ` +
                    `${modissue}\n${ppissue}`
            }
                break;
            case 'taiko': {
                detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} | Acc: ${ppComputed[0].ppAcc?.toFixed(2)} | Strain: ${ppComputed[0].ppStrain?.toFixed(2)} \n ` +
                    `**99**: ${ppComputed[1].pp?.toFixed(2)} | Acc: ${ppComputed[1].ppAcc?.toFixed(2)} | Strain: ${ppComputed[1]?.ppStrain?.toFixed(2)} \n ` +
                    `**97**: ${ppComputed[3].pp?.toFixed(2)} | Acc: ${ppComputed[3].ppAcc?.toFixed(2)} | Strain: ${ppComputed[3]?.ppStrain?.toFixed(2)} \n ` +
                    `**95**: ${ppComputed[5].pp?.toFixed(2)} | Acc: ${ppComputed[5].ppAcc?.toFixed(2)} | Strain: ${ppComputed[5]?.ppStrain?.toFixed(2)} \n ` +
                    `${modissue}\n${ppissue}`
            }
                break;
            case 'fruits': {
                detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} \n ` +
                    `**99**: ${ppComputed[1].pp?.toFixed(2)} \n ` +
                    `**98**: ${ppComputed[2].pp?.toFixed(2)} \n ` +
                    `**97**: ${ppComputed[3].pp?.toFixed(2)} \n ` +
                    `**96**: ${ppComputed[4].pp?.toFixed(2)} \n ` +
                    `**95**: ${ppComputed[5].pp?.toFixed(2)} \n ` +
                    `${modissue}\n${ppissue}`
            }
                break;
            case 'mania': {
                detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} | Acc: ${ppComputed[0].ppAcc?.toFixed(2)} | Strain: ${ppComputed[0].ppStrain?.toFixed(2)} \n ` +
                    `**99**: ${ppComputed[1].pp?.toFixed(2)} | Acc: ${ppComputed[1].ppAcc?.toFixed(2)} | Strain: ${ppComputed[1].ppStrain?.toFixed(2)} \n ` +
                    `**97**: ${ppComputed[3].pp?.toFixed(2)} | Acc: ${ppComputed[3].ppAcc?.toFixed(2)} | Strain: ${ppComputed[3].ppStrain?.toFixed(2)} \n ` +
                    `**95**: ${ppComputed[5].pp?.toFixed(2)} | Acc: ${ppComputed[5].ppAcc?.toFixed(2)} | Strain: ${ppComputed[5].ppStrain?.toFixed(2)} \n ` +
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
                    `${basicvals}\n` +
                    `${totaldiff}⭐ ${emojis.mapobjs.bpm}${allvals.bpm}\n` +
                    `${emojis.mapobjs.circle}${mapdata.count_circles} \n${emojis.mapobjs.slider}${mapdata.count_sliders} \n${emojis.mapobjs.spinner}${mapdata.count_spinners}\n` +
                    `${emojis.mapobjs.total_length}${allvals.details.lengthFull}\n` +
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

        const passurl = await osufunc.graph(numofval, failval, 'Fails', true, false, false, false, true, 'bar', true, exitval, 'Exits');
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

export async function maplocal(input: extypes.commandInput) {

    let commanduser;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            //@ts-expect-error author property does not exist on interaction
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
    //@ts-ignore
    if (input.obj.content.includes('+')) {//@ts-ignore
        mods = input.obj.content.split('+')[1].split(' ')[0]
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
    let ppcalcing;
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
        mapgraph = await osufunc.graph(strains.strainTime, strains.value, 'Strains', null, null, null, null, null, 'strains')
    } catch (error) {//@ts-ignore
        input.obj.reply({
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
    } catch (error) {//@ts-ignore
        input.obj.reply({
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

export async function userBeatmaps(input: extypes.commandInput) {

}


//tracking

export async function trackadd(input: extypes.commandInput) {

    let commanduser;

    let user;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            user = input.args[0];

        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            user = input.obj.options.getInteger('user');

        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }
    if (input.overrides != null) {

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
        log.optsLog(input.absoluteID, []),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let guildsetting = await input.guildSettings.findOne({
        where: { guildId: input.obj.guildId }
    })

    if (!guildsetting.dataValues.trackChannel) {//@ts-ignore
        input.obj.reply({
            content: 'The current guild does not have a tracking channel',
            embeds: [],
            files: [],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        }).catch()
        return;
    }

    let osudata: osuApiTypes.User;

    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata'))
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`)
    }

    let replymsg;

    if (osudata?.error || !osudata.id) {
        replymsg = `Error - could not find user \`${user}\``
    } else {

        replymsg = `Added \`${osudata.username}\` to the tracking list`

        func.storeFile(osudata, osudata.id, 'osudata')
        func.storeFile(osudata, user, 'osudata')

        trackfunc.editTrackUser({
            database: input.trackDb,
            userid: osudata.id,
            action: 'add',
            guildId: input.obj.guildId,
            guildSettings: input.guildSettings,
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

export async function trackremove(input: extypes.commandInput) {
    let commanduser;
    let user;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            user = input.args[0];
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            user = input.obj.options.getInteger('user');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }
    if (input.overrides != null) {

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
        log.optsLog(input.absoluteID, []),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let guildsetting = await input.guildSettings.findOne({
        where: { guildId: input.obj.guildId }
    })

    // if (!guildsetting.dataValues.trackChannel) {//@ts-ignore
    //     input.obj.reply({
    //         content: 'The current guild does not have a tracking channel',
    //         embeds: [],
    //         files: [],
    //         allowedMentions: { repliedUser: false },
    //         failIfNotExists: true
    //     }).catch()
    //     return;
    // }

    let osudata: osuApiTypes.User;

    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata'))
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`)
    }

    let replymsg;

    if (osudata?.error || !osudata.id) {
        replymsg = `Error - could not find user \`${user}\``
    } else {

        replymsg = `Removed \`${osudata.username}\` from the tracking list`

        func.storeFile(osudata, osudata.id, 'osudata')
        func.storeFile(osudata, user, 'osudata')

        trackfunc.editTrackUser({
            database: input.trackDb,
            userid: osudata.id,
            action: 'remove',
            guildId: input.obj.guildId,
            guildSettings: input.guildSettings,
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

export async function trackchannel(input: extypes.commandInput) {

    let commanduser;
    let channelId;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            channelId = input.args[0];//@ts-ignore
            if (input.obj.content.includes('<#')) {//@ts-ignore
                channelId = input.obj.content.split('<#')[1].split('>')[0]
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            channelId = (input.obj.options.getChannel('channel')).id;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }
    if (input.overrides != null) {

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
        log.optsLog(input.absoluteID, []),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const guildsetting = await input.guildSettings.findOne({ where: { guildid: input.obj.guildId } });

    if (!channelId) {
        //the current channel is...
        if (!guildsetting.dataValues.trackChannel) {//@ts-ignore
            input.obj.reply({
                content: 'The current guild does not have a tracking channel',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
            return;
        }//@ts-ignore
        input.obj.reply({
            content: `The current tracking channel is <#${guildsetting.dataValues.trackChannel}>`,
            embeds: [],
            files: [],
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        }).catch()
        return;
    }

    if (!channelId || isNaN(+channelId) || !input.client.channels.cache.get(channelId)) {//@ts-ignore
        input.obj.reply({
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

export async function tracklist(input: extypes.commandInput) {


    let commanduser;


    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }
    if (input.overrides != null) {

    }
    //==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-COMMANDNAME-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('⬅')
            /* .setLabel('Start') */,
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-COMMANDNAME-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('◀'),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-COMMANDNAME-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('▶')
            /* .setLabel('Next') */,
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-COMMANDNAME-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('➡')
            /* .setLabel('End') */,
        );
    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-COMMANDNAME-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('🔁'),
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

    let userList: {
        osuid: string,
        userid: string
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
                userid: `${user.userid}`
            })
        }
    }
    const userListEmbed = new Discord.EmbedBuilder()
        .setTitle(`All tracked users in ${input.obj.guild.name}`)
        .setColor(colours.embedColour.userlist.dec)
        .setDescription(`There are ${userList.length} users being tracked in this server\n\n` +
            `${userList.map((user, i) => `${i + 1}. https://osu.ppy.sh/u/${user.osuid}`).join('\n')}`
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

export async function compare(input: extypes.commandInput) {

    let commanduser;
    let type: 'profile' | 'top' | 'mapscore' = 'profile';
    let first = null;
    let second = null;
    let firstsearchid = null;
    let secondsearchid = null;
    let mode = 'osu';
    let page = 0;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;//@ts-ignore
            if (input.obj.mentions.users.size > 1) {//@ts-ignore
                firstsearchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;//@ts-ignore
                secondsearchid = input.obj.mentions.users.size > 1 ? input.obj.mentions.users.at(1).id : null;//@ts-ignore
            } else if (input.obj.mentions.users.size == 1) {//@ts-ignore
                firstsearchid = input.obj.author.id;//@ts-ignore
                secondsearchid = input.obj.mentions.users.at(0).id
            } else {//@ts-ignore
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
            commanduser = input.obj.member.user;//@ts-ignore
            type = input.obj.options.getString('type') ?? 'profile';//@ts-ignore
            first = input.obj.options.getString('first');//@ts-ignore
            second = input.obj.options.getString('second');
            firstsearchid = commanduser.id//@ts-ignore
            mode = input.obj.options.getString('mode') ?? 'osu'
            if (second == null && first != null) {
                second = first;
                first = null;
            }
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            //@ts-ignore
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            type = 'top';//@ts-ignore
            const pawge = parseInt(input.obj.message.embeds[0].description.split('Page: ')[1].split('/')[0])
            //@ts-ignore
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

            //@ts-ignore
            const firsti = input.obj.message.embeds[0].description.split('and')[0]//@ts-ignore
            const secondi = input.obj.message.embeds[0].description.split('and')[1].split('have')[0]

            //user => [name](url)
            first = firsti.split('u/')[1].split(')')[0];
            second = secondi.split('u/')[1].split(')')[0];
        }
            break;
    }
    if (input.overrides != null) {//@ts-ignore
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
    let usefields: Discord.EmbedField[] = []

    let useComponents: Discord.ActionRowBuilder[] = []
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

        let firstuser: osuApiTypes.User;
        if (func.findFile(first, 'osudata') &&
            !('error' in func.findFile(first, 'osudata')) &&
            input.button != 'Refresh'
        ) {
            firstuser = func.findFile(first, 'osudata')
        } else {
            firstuser = await osufunc.apiget('user', `${await first}`)
        }

        if (firstuser?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                throw new Error('could not fetch first user data')

            }
            return;
        }


        let seconduser: osuApiTypes.User;
        if (func.findFile(second, 'osudata') &&
            !('error' in func.findFile(second, 'osudata')) &&
            input.button != 'Refresh'
        ) {
            seconduser = func.findFile(second, 'osudata')
        } else {
            seconduser = await osufunc.apiget('user', `${await second}`)
        }

        if (seconduser?.error) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                throw new Error('could not fetch second user data')
            }
            return;
        }

        func.storeFile(firstuser, firstuser.id, 'osudata')
        func.storeFile(firstuser, first, 'osudata')
        func.storeFile(seconduser, seconduser.id, 'osudata')
        func.storeFile(seconduser, second, 'osudata')


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
                let firsttopdata: osuApiTypes.Score[] & osuApiTypes.Error;
                if (func.findFile(input.absoluteID, 'firsttopdata') &&
                    !('error' in func.findFile(input.absoluteID, 'firsttopdata')) &&
                    input.button != 'Refresh'
                ) {
                    firsttopdata = func.findFile(input.absoluteID, 'firsttopdata')
                } else {
                    firsttopdata = await osufunc.apiget('best', `${firstuser.id}`, `${mode}`)
                }

                if (firsttopdata?.error) {
                    if (input.commandType != 'button' && input.commandType != 'link') {
                        throw new Error('could not fetch first user\'s top scores')
                    }
                    return;
                }

                let secondtopdata: osuApiTypes.Score[] & osuApiTypes.Error;
                if (func.findFile(input.absoluteID, 'secondtopdata') &&
                    !('error' in func.findFile(input.absoluteID, 'secondtopdata')) &&
                    input.button != 'Refresh'
                ) {
                    secondtopdata = func.findFile(input.absoluteID, 'secondtopdata')
                } else {
                    secondtopdata = await osufunc.apiget('best', `${seconduser.id}`, `${mode}`)
                }

                func.storeFile(firsttopdata, input.absoluteID, 'firsttopdata')
                func.storeFile(secondtopdata, input.absoluteID, 'secondtopdata')

                if (secondtopdata?.error) {
                    if (input.commandType != 'button' && input.commandType != 'link') {
                        throw new Error('could not fetch second user\'s top scores')
                    }
                    return;
                }
                let filterfirst = [];
                //filter so that scores that have a shared beatmap id with the second user are kept
                for (let i = 0; i < firsttopdata.length; i++) {
                    if (secondtopdata.find(score => score.beatmap.id == firsttopdata[i].beatmap.id)) {
                        filterfirst.push(firsttopdata[i])
                    }
                }
                filterfirst.sort((a, b) => b.pp - a.pp)
                embedTitle = 'Comparing top scores'
                let arrscore = [];



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

export async function osuset(input: extypes.commandInput) {

    let commanduser;

    let name;
    let mode;
    let skin;

    let type;
    let value;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
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

            if (input.args.includes('-skin')) {
                skin = input.args.slice(input.args.indexOf('-skin') + 1).join(' ')
                input.args.splice(input.args.indexOf('-skin'))
            }
            name = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            name = input.obj.options.getString('user');//@ts-ignore
            mode = input.obj.options.getString('mode');//@ts-ignore
            skin = input.obj.options.getString('skin');
            type = 'interaction';
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
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

    if (typeof name == 'undefined' || name == null) {//@ts-ignore
        input.obj.reply({
            content: 'Error - username undefined',
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        });
        return;
    }

    let txt = 'null'

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
            txt = 'Updated the database'
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
            txt = 'Updated the database'
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

export async function skin(input: extypes.commandInput) {

    let commanduser;
    let string: string;
    let searchid: string;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;//@ts-ignore
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

            string = input.args.join(' ')

        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            string = input.obj.options.getString('string')
            if (!string) {//@ts-ignore
                string = input.obj.options.getUser('user');
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('skin', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'String',
                value: string
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
    let userF;
    let findType: 'string' | 'id'
    switch (true) {
        case (searchid != commanduser.id): {
            findType = 'id'
        }
            break;
        case (string != null || string.length > 0): {
            findType = 'string'
        }
            break;
        default: {
            findType = 'id'
        }
    }

    const allUsers = await input.userdata.findAll()

    if (findType == 'id') {
        userF = allUsers.find(user => user.id == searchid)
    } else {
        userF = allUsers.find(user => user.osuname.toLowerCase().includes(string.toLowerCase()))
    }
    let skinstring;
    if (userF) {
        skinstring = `${userF.dataValues.skin}`
    } else {
        skinstring = `User is not saved in the database`
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle(`${userF?.osuname ?? `<@${searchid}>`}'s skin`)
        .setDescription(skinstring)


    //SEND/EDIT MSG==============================================================================================================================================================================================
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
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

export async function whatif(input: extypes.commandInput & { statsCache: any }) {

    let commanduser;
    let user;
    let pp;
    let searchid;
    let mode;

    switch (input.commandType) {
        case 'message': {
            //@ts-expect-error author property does not exist on interaction
            commanduser = input.obj.author;
            //@ts-ignore
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

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
            commanduser = input.obj.member.user;//@ts-ignore
            user = input.obj.options.getString('user');
            searchid = input.obj.member.user.id;//@ts-ignore
            mode = input.obj.options.getString('mode');//@ts-ignore
            pp = input.obj.options.getNumber('pp');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
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
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
        if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
            if (input.commandType != 'button') {//@ts-ignore
                input.obj.reply({
                    content: 'User not found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }
    }
    if (!pp) {
        pp = 100;
    }

    let osudata: osuApiTypes.User;

    if (func.findFile(user, 'osudata') &&
        !('error' in func.findFile(user, 'osudata')) &&
        input.button != 'Refresh'
    ) {
        osudata = func.findFile(user, 'osudata')
    } else {
        osudata = await osufunc.apiget('user', `${await user}`)
    }
    func.storeFile(osudata, osudata.id, 'osudata')
    func.storeFile(osudata, user, 'osudata')

    osufunc.debug(osudata, 'command', 'whatif', input.obj.guildId, 'osuData');

    if (mode == null) {
        mode = osudata.playmode;
    }

    const osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
    osufunc.debug(osutopdata, 'command', 'whatif', input.obj.guildId, 'osuTopData');

    let pparr = osutopdata.slice().map(x => x.pp);
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

    const guessrank = await osufunc.getRankPerformance('pp->rank', (total + bonus), input.userdata, 'osu', input.statsCache)

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

