import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import calc = require('../../calc/calculations');
import emojis = require('../../configs/emojis');
import colours = require('../../configs/colours');
import osufunc = require('../../calc/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../configs/osuApiTypes');


module.exports = {
    name: 'lb',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;
        let isFirstPage = false;
        let isLastPage = false;
        let page = 1;
        let curserver;
        let mode = 'osu';
        let baseCommandType;

        if (message != null && interaction == null && button == null) {
            commanduser = message.author;
            baseCommandType = 'message';
            curserver = message.guild;
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

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            commanduser = interaction.member.user;
            curserver = interaction.guild;
            baseCommandType = 'interaction';
            const gamemode = interaction.options.getString('mode');
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

        if (button != null) {
            commanduser = interaction.member.user;
            curserver = interaction.guild;
            baseCommandType = 'button';
            const pagef = message.embeds[0].footer.text.split(' | Page ')[1].split('/')[0]

            switch (button) {
                case 'BigLeftArrow':
                    page = 1
                    isFirstPage = true;
                    break;
                case 'LeftArrow':
                    page = parseInt(pagef) - 1
                    if (pagef < 2) {
                        page = 1
                    }
                    break;
                case 'RightArrow':
                    page = parseInt(pagef) + 1
                    if(page == parseInt(message.embeds[0].footer.text.split(' | Page ')[1].split('/')[1])){
                        isLastPage = true;
                    }
                    break;
                case 'BigRightArrow':
                    page = parseInt(message.embeds[0].footer.text.split(' | Page ')[1].split('/')[1])
                    isLastPage = true;
                    break;
            }
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
COMMAND EVENT - lb (${baseCommandType})
${currentDate} | ${currentDateISO}
recieved lb command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        if (page < 2) {
            isFirstPage = true;
        }
        const pgbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-lb-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage)
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-lb-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀')
                    .setDisabled(isFirstPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-lb-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    .setDisabled(isLastPage)
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-lb-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    .setDisabled(isLastPage)
                    /* .setLabel('End') */,
            );

        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
Options: 
    mode: ${mode}
    page: ${page}
----------------------------------------------------
`, 'utf-8')
        if (page < 2) {
            page = 1;
        }
        page--
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const serverlb = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.userlist.hex)
            .setTitle(`server leaderboard for ${curserver.name}`)
        const userids = await userdata.findAll();
        const useridsarraylen = await userdata.count();
        let rtxt = `\n`;
        const rarr = [];

        for (let i = 0; i < useridsarraylen; i++) {
            const searchid = userids[i].dataValues.userid;
            const guild = curserver;
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

            if(page++ >= Math.ceil(rarr.length / 10)){
                pgbuttons.components[2].setDisabled(true)
                pgbuttons.components[2].setDisabled(true)
            }

            //SEND/EDIT MSG==============================================================================================================================================================================================

            if (button == null) {
                obj.reply({
                    embeds: [serverlb],
                    components: [pgbuttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch(error => { });

            }
            if (button != null) {
                message.edit({
                    content: '',
                    embeds: [serverlb],
                    components: [pgbuttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch(error => { });

            }
        }, 1000)

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}