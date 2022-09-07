import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'lb',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let page = 0;
        let mode = 'osu';
        const guild = obj.guild;

        let isFirstPage = false;
        let isLastPage = false;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                const gamemode = args[0];
                if (!args[0] || gamemode == 'osu' || gamemode == 'o' || gamemode == '0' || gamemode == 'standard' || gamemode == 'std') {
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
                commanduser = obj.member.user;
                const gamemode = obj.options.getString('mode');
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
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const pgbuttons: any = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-lb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-lb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-lb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-lb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-lb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'lb',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'Page',
                    value: `${page}`
                },
                {
                    name: 'Mode',
                    value: `${mode}`
                }
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (page < 2 || typeof page != 'number') {
            isFirstPage = true;
            page = 1;
        }
        page--

        const serverlb = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.userlist.dec)
            .setTitle(`server leaderboard for ${guild.name}`)
        const userids = await userdata.findAll();
        const useridsarraylen = await userdata.count();
        let rtxt = `\n`;
        const rarr = [];

        for (let i = 0; i < useridsarraylen; i++) {
            const searchid = userids[i].dataValues.userid;
            guild.members.cache.forEach(async member => {
                if (member.id == searchid) {
                    const user = await userdata.findOne({ where: { userid: member.id } });
                    if (user != null && !rtxt.includes(`${member.user.id}`)) {
                        let acc: any;
                        let pp: any;
                        let rank: any;
                        switch (mode) {
                            case 'osu':
                            default:
                                acc = user.get('osuacc');
                                if (isNaN(acc) || acc == null) {
                                    acc = 'null '
                                } else {
                                    acc = user.get('osuacc').toFixed(2)
                                }
                                pp = user.get('osupp')
                                if (isNaN(pp) || pp == null) {
                                    pp = 'null '
                                } else {
                                    pp = Math.floor(user.get('osupp'))
                                }
                                rank = user.get('osurank');
                                if (isNaN(rank) || rank == null) {
                                    rank = 'null '
                                }
                                rarr.push(
                                    {
                                        discname:
                                            ((member.displayName.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.displayName.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.displayName.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' '),
                                        osuname:
                                            (user.get('osuname').padEnd(17 - 2, ' ')).length > 15 ? user.get('osuname').substring(0, 12) + '...' : user.get('osuname').padEnd(17 - 2, ' '),
                                        rank:
                                            rank.toString().padEnd(10 - 2, ' ').substring(0, 8),
                                        acc:
                                            acc.toString(),
                                        pp:
                                            (pp.toString() + 'pp').padEnd(9 - 2, ' '),
                                    }
                                )
                                break;
                            case 'taiko':
                                acc = user.get('taikoacc');
                                if (isNaN(acc) || acc == null) {
                                    acc = 'null '
                                } else {
                                    acc = user.get('taikoacc').toFixed(2)
                                }
                                pp = user.get('taikopp')
                                if (isNaN(pp) || pp == null) {
                                    pp = 'null '
                                } else {
                                    pp = Math.floor(user.get('taikopp'))
                                }
                                rank = user.get('taikorank');
                                if (isNaN(rank) || rank == null) {
                                    rank = 'null '
                                }
                                rarr.push(
                                    {
                                        discname:
                                            ((member.displayName.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.displayName.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.displayName.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' '),
                                        osuname:
                                            (user.get('osuname').padEnd(17 - 2, ' ')).length > 15 ? user.get('osuname').substring(0, 12) + '...' : user.get('osuname').padEnd(17 - 2, ' '),
                                        rank:
                                            rank.toString().padEnd(10 - 2, ' ').substring(0, 8),
                                        acc:
                                            acc.toString(),
                                        pp:
                                            (pp.toString() + 'pp').padEnd(9 - 2, ' '),
                                    }
                                )
                                break;
                            case 'fruits':
                                acc = user.get('fruitsacc');
                                if (isNaN(acc) || acc == null) {
                                    acc = 'null '
                                } else {
                                    acc = user.get('fruitsacc').toFixed(2)
                                }
                                pp = user.get('fruitspp')
                                if (isNaN(pp) || pp == null) {
                                    pp = 'null '
                                } else {
                                    pp = Math.floor(user.get('fruitspp'))
                                }
                                rank = user.get('fruitsrank');
                                if (isNaN(rank) || rank == null) {
                                    rank = 'null '
                                }
                                rarr.push(
                                    {
                                        discname:
                                            member.user ?
                                                ((member.user.username.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.user.username.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.user.username.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' ')
                                                :
                                                ((member.displayName.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.displayName.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.displayName.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' ')
                                        ,
                                        osuname:
                                            (user.get('osuname').padEnd(17 - 2, ' ')).length > 15 ? user.get('osuname').substring(0, 12) + '...' : user.get('osuname').padEnd(17 - 2, ' '),
                                        rank:
                                            rank.toString().padEnd(10 - 2, ' ').substring(0, 8),
                                        acc:
                                            acc.toString(),
                                        pp:
                                            (pp.toString() + 'pp').padEnd(9 - 2, ' '),
                                    }
                                )
                                break;
                            case 'mania':
                                acc = user.get('maniaacc');
                                if (isNaN(acc) || acc == null) {
                                    acc = 'null '
                                } else {
                                    acc = user.get('maniaacc').toFixed(2)
                                }
                                pp = user.get('maniapp')
                                if (isNaN(pp) || pp == null) {
                                    pp = 'null '
                                } else {
                                    pp = Math.floor(user.get('maniapp'))
                                }
                                rank = user.get('maniarank');
                                if (isNaN(rank) || rank == null) {
                                    rank = 'null '
                                }
                                rarr.push(
                                    {
                                        discname:
                                            ((member.displayName.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.displayName.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.displayName.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' '),
                                        osuname:
                                            (user.get('osuname').padEnd(17 - 2, ' ')).length > 15 ? user.get('osuname').substring(0, 12) + '...' : user.get('osuname').padEnd(17 - 2, ' '),
                                        rank:
                                            rank,
                                        acc:
                                            acc.toString(),
                                        pp:
                                            (pp.toString() + 'pp').padEnd(9 - 2, ' '),
                                    }
                                )
                                break;
                        }
                    }

                }
            })

        }
        // let another = rarr.sort((b, a) => b.rank - a.rank) //for some reason this doesn't sort even tho it does in testing
        await setTimeout(() => {
            rtxt = `\`Rank    Discord           osu!              Rank       Acc      pp       `
            for (let i = 0; i < rarr.length && i < 10; i++) {
                rtxt += `\n#${i + 1 + ')'.padEnd(5, ' ')} ${rarr.sort((b, a) => b.rank - a.rank)[i].discname}   ${rarr.sort((b, a) => b.rank - a.rank)[i].osuname}   ${rarr.sort((b, a) => b.rank - a.rank)[i].rank.toString().padEnd(10 - 2, ' ').substring(0, 8)}   ${rarr.sort((b, a) => b.rank - a.rank)[i].acc}%   ${rarr.sort((b, a) => b.rank - a.rank)[i].pp}  `
            }

            rtxt += `\n\``
            serverlb.setDescription(rtxt);
            serverlb.setFooter({ text: mode + ` | Page 1/${Math.ceil(rarr.length / 10)}` });
            const endofcommand = new Date().getTime();
            const timeelapsed = endofcommand - currentDate.getTime();
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Latency (message command => lb server) - ${timeelapsed}ms\n`)

            if (page++ >= Math.ceil(rarr.length / 10)) {
                pgbuttons.components[2].setDisabled(true)
                pgbuttons.components[3].setDisabled(true)
            }

            //SEND/EDIT MSG==============================================================================================================================================================================================
            switch (commandType) {
                case 'message': {
                    obj.reply({
                        content: '',
                        embeds: [serverlb],
                        components: [pgbuttons],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }
                    break;

                //==============================================================================================================================================================================================

                case 'interaction': {
                    obj.reply({
                        content: '',
                        embeds: [serverlb],
                        components: [pgbuttons],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }

                    //==============================================================================================================================================================================================

                    break;
                case 'button': {
                    obj.edit({
                        content: '',
                        embeds: [serverlb],
                        components: [pgbuttons],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }
                    break;
            }
        });


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}