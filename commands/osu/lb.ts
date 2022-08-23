import fs = require('fs');
import Sequelize = require('sequelize');
import colours = require('../../configs/colours');

module.exports = {
    name: 'lb',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {

        if (message != null && button == null) {
            const buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-lb-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-lb-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-lb')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-lb-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-lb-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - lb (message)\n${currentDate} | ${currentDateISO}\n recieved server leaderboard command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            const gamemode = args[0];

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
            const serverlb = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.userlist.hex)
                .setTitle(`server leaderboard for ${message.guild.name}`)
            const userids = await userdata.findAll();
            const useridsarraylen = await userdata.count();
            let rtxt = `\n`;
            const rarr: any = [];

            for (let i = 0; i < useridsarraylen; i++) {
                const searchid = userids[i].dataValues.userid;
                const guild = message.guild;
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
            setTimeout(() => {
                rtxt = `\`Rank    Discord           osu!              Rank       Acc      pp       `
                for (let i = 0; i < rarr.length && i < 10; i++) {
                    rtxt +=
                        `\n#${i + 1 + ')'.padEnd(5, ' ')} ${rarr.sort((b, a) => b.rank - a.rank)[i].discname}   ${rarr.sort((b, a) => b.rank - a.rank)[i].osuname}   ${rarr.sort((b, a) => b.rank - a.rank)[i].rank.toString().padEnd(10 - 2, ' ').substring(0, 8)}   ${rarr.sort((b, a) => b.rank - a.rank)[i].acc}%   ${rarr.sort((b, a) => b.rank - a.rank)[i].pp}  `
                }

                rtxt += `\n\``
                serverlb.setDescription(rtxt);
                serverlb.setFooter({ text: mode + ` | Page 1/${Math.ceil(rarr.length / 10)}` });

                message.reply({ content: '⠀', embeds: [serverlb], allowedMentions: { repliedUser: false }, failIfNotExists: true, components: [buttons] })
                    .catch(error => { });

                const endofcommand = new Date().getTime();
                const timeelapsed = endofcommand - currentDate.getTime();
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Latency (message command => lb server) - ${timeelapsed}ms\n`)
            }, 2000) //setting the timeout alllows enough time for the array to be sorted
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - lb (interaction)\n${currentDate} | ${currentDateISO}\n recieved server lb command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            const buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-lb-${interaction.member.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-lb-${interaction.member.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-lb')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-lb-${interaction.member.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-lb-${interaction.member.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );

            const mode = message.embeds[0].footer.text.split(' | ')[0].replaceAll(' ', '')
            const pagef = message.embeds[0].footer.text.split(' | Page ')[1].split('/')[0]
            let page

            const serverlb = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.userlist.hex)
                .setTitle(`server leaderboard for ${message.guild.name}`)
                .setFooter({ text: mode });
            const userids = await userdata.findAll();
            const useridsarraylen = await userdata.count();
            let rtxt = `\n`;
            const rarr: any = [];

            for (let i = 0; i < useridsarraylen; i++) {
                const searchid = userids[i].dataValues.userid;
                const guild = message.guild;
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
            switch (button) {
                case 'BigLeftArrow':
                    page = 0
                    break;
                case 'LeftArrow':
                    page = parseInt(pagef) - 1
                    if (pagef < 0) {
                        page = 0
                    }
                    break;
                case 'RightArrow':
                    page = parseInt(pagef) + 1
                    if (pagef > Math.ceil(rarr.length / 10)) {
                        page = Math.ceil(rarr.length / 10)
                    }
                    break;
                case 'BigRightArrow':
                    page = Math.ceil(rarr.length / 10)
                    break;
            }

            setTimeout(() => {
                rtxt = `\`Rank    Discord           osu!              Rank       Acc      pp       `
                for (let i = 0; i + (page * 5) < rarr.length && i < 10; i++) {
                    if (i + (page * 5) > rarr.length) {
                        break;
                    }

                    rtxt +=
                        `\n#${i + 1 + (page * 5) + ')'.padEnd(5, ' ')} ${rarr.sort((b, a) => b.rank - a.rank)[i + (page * 5)].discname}   ${rarr.sort((b, a) => b.rank - a.rank)[i + (page * 5)].osuname}   ${rarr.sort((b, a) => b.rank - a.rank)[i + (page * 5)].rank.toString().padEnd(10 - 2, ' ').substring(0, 8)}   ${rarr.sort((b, a) => b.rank - a.rank)[i + (page * 5)].acc}%   ${rarr.sort((b, a) => b.rank - a.rank)[i + (page * 5)].pp}  `
                }

                rtxt += `\n\``
                serverlb.setDescription(rtxt);
                serverlb.setFooter({ text: mode + ` | Page ${page + 1}/${Math.ceil(rarr.length / 10)}` });
                message.edit({ content: '⠀', embeds: [serverlb], allowedMentions: { repliedUser: false }, failIfNotExists: true, components: [buttons] })
                    .catch(error => { });

                const endofcommand = new Date().getTime();
                const timeelapsed = endofcommand - currentDate.getTime();
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Latency (interaction command => lb server) - ${timeelapsed}ms\n`)
            }, 2000) //setting the timeout alllows enough time for the array to be sorted

        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}