import fs = require('fs');
import Sequelize = require('sequelize');
module.exports = {
    name: 'lb',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - lb (message)\n${currentDate} | ${currentDateISO}\n recieved server leaderboard command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let gamemode = args[0];
            let mode: string = '';
            if (!args[0]) {
                mode = 'osu'
            }
            if (gamemode == 'osu' || gamemode == 'o' || gamemode == '0' || gamemode == 'standard' || gamemode == 'std') {
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
            let serverlb = new Discord.EmbedBuilder()
                .setTitle(`server leaderboard for ${message.guild.name}`)
                .setFooter({ text: mode });
            let userids = await userdata.findAll();
            let useridsarraylen = await userdata.count();
            let rtxt = `\n`;
            let rarr: any = [];

            for (let i = 0; i < useridsarraylen; i++) {
                let searchid = userids[i].dataValues.userid;
                let guild = message.guild;
                guild.members.cache.forEach(async member => {
                    if (member.id == searchid) {
                        let user = await userdata.findOne({ where: { userid: member.id } });
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
                                                rank.toString().padEnd(10 - 2, ' ').substring(0, 8),
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
            (() => {
                let playerarr = rarr.sort((a, b) => parseInt(b.rank.replaceAll(' ', '')) - parseInt(a.rank.replaceAll(' ', '')) ); //WHY ISN'T THIS SORTING WTF 
                setTimeout(() => {
                rtxt = `\`Rank    Discord           osu!              Rank       Acc      pp       `
                for (let i = 0; i < playerarr.length && i < 10; i++) {
                    rtxt +=
                        `\n#${i + 1 + ')'.padEnd(5, ' ')} ${playerarr[i].discname}   ${playerarr[i].osuname}   ${playerarr[i].rank}   ${playerarr[i].acc}%   ${playerarr[i].pp}  `
                }

                rtxt += `\n\``
                serverlb.setDescription(rtxt);
                message.reply({ content: '⠀', embeds: [serverlb], allowedMentions: { repliedUser: false }, failIfNotExists: true })
            }, 2000)
            })();
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}