import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../configs/osufunc');
import cmdchecks = require('../../configs/commandchecks');
module.exports = {
    name: 'firsts',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        //let absoluteID = new Date().getTime()
        let accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
        let access_token = JSON.parse(accessN).access_token;
        let buttons;

        let user = '';
        let searchid = 1;
        let mode = null;
        let page = 0;

        if (message != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${message.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-firsts-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-firsts-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-firsts')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-firsts-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-firsts-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            user = await args.join(' ');
            searchid = await message.author.id
            if (message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            if (user.length < 1 || message.mentions.users.size > 0) {
                let findname;
                findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return message.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                }
            }
            if (mode == null && (!args[0] || message.mentions.users.size > 0)) {
                let findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname == null) {
                    mode = 'osu'
                } else {
                    mode = findname.get('mode')
                    if (mode.length < 1) {
                        mode = 'osu'
                    }
                }
            } else {
                mode = 'osu'
            }

        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-cmd')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            user = await interaction.options.getString('user');
            mode = await interaction.options.getString('mode');


            if (user.length < 1) {
                let findname;
                findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return message.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                }
            }
            if (mode == null) {
                let findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname == null) {
                    mode = 'osu'
                } else {
                    mode = findname.get('mode')
                    if (mode.length < 1) {
                        mode = 'osu'
                    }
                }
            } else {
                mode = 'osu'
            }
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (button)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-firsts-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-firsts-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-firsts')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-firsts-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-firsts-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                /* .setLabel('End') */,
                );
            user = message.embeds[0].title.split('for ')[1]
            mode = message.embeds[0].description.split('\n')[1]
            page = 0;
            (message.embeds[0].description).split('/')[0].replace('Page ', '')
            if (button == 'BigLeftArrow') {
                page = 0
            } else if (button == 'LeftArrow') {
                page = parseInt((message.embeds[0].description).split('/')[0].replace('Page ', '')) - 1
            } else if (button == 'RightArrow') {
                page = parseInt((message.embeds[0].description).split('/')[0].replace('Page ', '')) + 1
            } else if (button == 'BigRightArrow') {
                page = parseInt((message.embeds[0].description).split('/')[1].split('\n')[0])
            }
            if (user.length < 1) {
                let findname;
                findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return message.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                }
            }
            if (mode == null) {
                let findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname == null) {
                    mode = 'osu'
                } else {
                    mode = findname.get('mode')
                    if (mode.length < 1) {
                        mode = 'osu'
                    }
                }
            } else {
                mode = 'osu'
            }
        }
        if (page > 0) {
            page = page - 1
        }
        const userinfourl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(user)}/osu`
        const osudata = await fetch(userinfourl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)
        try {
            if (osudata.authentication) {
                obj.reply({ content: 'error - osu auth out of date', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                return;
            }
        } catch (error) {
        }
        if (!osudata.id) {
            return obj.channel.send('Error - no user found')
        };
        fs.writeFileSync('debugosu/command-firsts=scores_username.json', JSON.stringify(osudata, null, 2), 'utf-8')
        let userfirstsurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(osudata.id)}/scores/firsts?mode=${cmdchecks.toHexadecimal(mode)}&limit=100`
        const firstscoresdata = await fetch(userfirstsurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)

        fs.writeFileSync('debugosu/command-firsts=scores.json', JSON.stringify(firstscoresdata, null, 2), 'utf-8')
        let firstsEmbed = new Discord.EmbedBuilder()
            .setTitle(`#1 scores for ${osudata.username}`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
            .setThumbnail(`https://a.ppy.sh/${osudata.id}`)
            ;
        if (firstscoresdata.length < 1) {
            firstsEmbed.setDescription('Error - no scores found')
            obj.reply({ embeds: [firstsEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: true })
            return;
        }
        firstsEmbed.setDescription(
            `Page ${page + 1}/${Math.ceil(firstscoresdata.length / 5)}
            ${mode}
            `);
        for (let i = 0; i < firstscoresdata.length && i < 5; i++) {
            let curscore = firstscoresdata[i + (page * 5)]
            if (!curscore) break;
            let ranking = curscore.rank.toUpperCase()
            let grade: any;
            switch (ranking) {
                case 'F':
                    grade = emojis.grades.F
                    break;
                case 'D':
                    grade = emojis.grades.D
                    break;
                case 'C':
                    grade = emojis.grades.C
                    break;
                case 'B':
                    grade = emojis.grades.B
                    break;
                case 'A':
                    grade = emojis.grades.A
                    break;
                case 'S':
                    grade = emojis.grades.S
                    break;
                case 'SH':
                    grade = emojis.grades.SH
                    break;
                case 'X':
                    grade = emojis.grades.X
                    break;
                case 'XH':
                    grade = emojis.grades.XH
                    break;
            };
            let hitlist: string;
            let hitstats = curscore.statistics
            switch (mode) {
                case 'osu':
                default:
                    hitlist = `${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
                case 'taiko':
                    hitlist = `${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
                case 'fruits':
                    hitlist = `${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
                case 'mania':
                    hitlist = `${hitstats.count_geki.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_katu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
            }

            let fmods: any = curscore.mods
            let ifmods: any = '';
            if (!fmods) {
                ifmods = ''
            } else {
                ifmods = '+' + fmods.join('').toUpperCase()
            }
            firstsEmbed.addFields([{
                name: `#${i + 1 + (page * 5)}`,
                value: `
                [${curscore.beatmapset.title} [${curscore.beatmap.version}]](https://osu.ppy.sh/b/${curscore.beatmap.id})
                **Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>
                ${curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
                \`${hitlist}\`
                ${curscore.pp}pp
                `,
                inline: false
            }])

        }
        if (interaction != null && interaction.message != null) {
            message.edit({
                embeds: [firstsEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons]
            })
        }
        else {
            obj.reply({
                embeds: [firstsEmbed],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
                components: [buttons]
            })
        }


        let endofcommand = new Date().getTime();
        let timeelapsed = endofcommand - currentDate.getTime();
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}