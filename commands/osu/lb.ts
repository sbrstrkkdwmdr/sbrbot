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
import extypes = require('../../src/types/extratypes');
import buttonsthing = require('../../src/consts/buttons');

module.exports = {
    name: 'lb',
    async execute(commandType: extypes.commandType, obj, args: string[], button: string, config: extypes.config, client: Discord.Client, absoluteID: number, currentDate:Date, overrides, userdata) {
        let commanduser;

        let page = 0;
        let mode = 'osu';
        const guild = obj.guild;

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
                if (!obj.message.embeds[0]) {
                    return;
                }
                commanduser = obj.member.user;
            }
                break;
        }
        // if (overrides != null) {

        // }

        //==============================================================================================================================================================================================

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-lb-${commanduser.id}-${absoluteID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji(buttonsthing.label.page.first),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-lb-${commanduser.id}-${absoluteID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji(buttonsthing.label.page.previous),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-lb-${commanduser.id}-${absoluteID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji(buttonsthing.label.page.search),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-lb-${commanduser.id}-${absoluteID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji(buttonsthing.label.page.next),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-lb-${commanduser.id}-${absoluteID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji(buttonsthing.label.page.last),
            );

        log.logFile(
            'command',
            log.commandLog('lb', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [
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
                guildId: `${obj.guildId}`
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
        const userids = await userdata.findAll();
        const useridsarraylen = await userdata.count();
        let rtxt = `\n`;
        const rarr = [];


        for (let i = 0; i < useridsarraylen; i++) {
            const user: extypes.dbUser = userids[i].dataValues;
            guild.members.cache.forEach(async member => {
                if (member.id == user.userid) {
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
        const timeelapsed = endofcommand - currentDate.getTime();

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

        log.logFile('command',
`
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`,
{ guildId: `${obj.guildId}` }
)
    }
}