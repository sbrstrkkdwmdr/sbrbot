import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../configs/osufunc');
import cmdchecks = require('../../configs/commandchecks');
module.exports = {
    name: 'pinned',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        //let absoluteID = new Date().getTime()
        let accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
        let access_token = JSON.parse(accessN).access_token;
        let buttons;

        let user = null;
        let searchid = null;
        let mode = 'osu';
        let page = 1;


        if (message != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${message.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-pinned-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-pinned-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-pinned')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-pinned-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-pinned-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            user = args.join(' ')
            searchid = message.author.id
            mode = null;
            if (message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            if(!args[0]){
                user = null;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-pinned-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-pinned-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-pinned')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-pinned-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-pinned-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (button)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-pinned-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-pinned-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-pinned')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-pinned-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-pinned-${interaction.user.id}`)
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
        } if (!(mode == 'osu' || mode == 'taiko' || mode == 'fruits' || mode == 'mania')) {
            mode = 'osu'
        }
        if (page == null || page < 1) {
            page = 0
        } else {
            page = page - 1
        }

        let userinfourl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(user)}/osu`

        const osudata = await fetch(userinfourl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)

        try {
            if (osudata.authentication) {
                message.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                return;
            }
        } catch (error) {

        }
        if (!osudata.id) {
            obj.reply({
                content: 'Error - user could not be found',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
            return;
        }

        let userpinnedurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(osudata.id)}/scores/pinned?mode=${cmdchecks.toHexadecimal(mode)}&limit=100`
        const pinnedscoresdata = await fetch(userpinnedurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any);

        let pinnedEmbed = new Discord.EmbedBuilder()
            .setTitle(`Pinned scores for ${osudata.username}`)
            .setURL(`https://osu.ppy.sh/u/${osudata.id}`)
            .setThumbnail(`https://a.ppy.sh/${osudata.id}`)
            ;
        if (pinnedscoresdata.length < 1) {
            pinnedEmbed.setDescription('Error - no pinned scores found')
        } else {
            pinnedEmbed.setDescription(`Page ${page + 1}/${Math.ceil(pinnedscoresdata.length / 5)}
${mode}`
            )
            for (let i = 0; i < 5 && i < pinnedscoresdata.length; i++) {
                let curscore = pinnedscoresdata[i + page * 5]
                if (!curscore) break;
                let grade;
                switch (pinnedscoresdata[i].rank.toUpperCase()) {
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
                }
                let hitlist: string;
                let hitstats = curscore.statistics
                switch (mode) {
                    case 'osu':
                    default:
                        hitlist = (`${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
                        ${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
                        ${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
                        ${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        `).replaceAll(' ', '').replaceAll('\n', '')
                        break;
                    case 'taiko':
                        hitlist =
                            (`${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
                        ${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
                        ${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        `).replaceAll(' ', '').replaceAll('\n', '')
                        break;
                    case 'fruits':
                        hitlist = (`${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
                        ${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
                        ${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/
                        ${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        `).replaceAll(' ', '').replaceAll('\n', '')
                        break;
                    case 'mania':
                        hitlist =
                            (`${hitstats.count_geki.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        ${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        ${hitstats.count_katu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        ${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        ${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        ${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        `).replaceAll(' ', '').replaceAll('\n', '')
                        break;
                }
                let ifmods =
                    curscore.mods.join('').length > 1 ?
                        '+' + curscore.mods.join('').toUpperCase() :
                        ''
                let title =
                    curscore.beatmapset.title == curscore.beatmapset.title_unicode ?
                        curscore.beatmapset.title :
                        `${curscore.beatmapset.title} (${curscore.beatmapset.title_unicode})`

                let artist =
                    curscore.beatmapset.artist == curscore.beatmapset.artist_unicode ?
                        curscore.beatmapset.artist :
                        `${curscore.beatmapset.artist} (${curscore.beatmapset.artist_unicode})`
                let fulltitle = `${artist} - ${title} [${curscore.beatmap.version}]`


                pinnedEmbed.addFields([
                    {
                        name: `#${i + 1 + page * 5}`,
                        value: `
                        [${fulltitle}](https://osu.ppy.sh/b/${curscore.beatmap.id})
                        ${curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
                        \`${hitlist}\`
                        ${curscore.pp}pp
                        `,
                        inline: false
                    }
                ])
            }
        }
        if (button == null) {
            obj.reply({
                embeds: [pinnedEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons]
            })
        } else {
            message.edit({
                embeds: [pinnedEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons]
            })
        }


        let endofcommand = new Date().getTime();
        let timeelapsed = endofcommand - currentDate.getTime();
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}