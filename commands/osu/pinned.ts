import fs = require('fs');
import osucalc = require('osumodcalculator');
import { access_token } from '../../configs/osuauth.json';
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
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button) {
        if (message != null && button == null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')

            let buttons = new Discord.ActionRowBuilder()
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

            let user = args.join(' ')
            let searchid = message.author.id
            let mode = null
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
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(user)}/osu`

            fetch(userinfourl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    try {
                        if (osudata.authentication) {
                            message.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            return;
                        }
                    } catch (error) {

                    }
                    let userid = osudata.id
                    if (!userid) {
                        return message.channel.send('Error - no user found')
                    };
                    fs.writeFileSync('debugosu/command-pinned=scores_username.json', JSON.stringify(osudata, null, 2), 'utf-8')

                    let userpinnedurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(userid)}/scores/pinned?mode=${cmdchecks.toHexadecimal(mode)}&limit=100`
                    fetch(userpinnedurl, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    }).then(res => res.json() as any)
                        .then(pinnedcoresdata => {
                            fs.writeFileSync('debugosu/command-pinned=scores.json', JSON.stringify(pinnedcoresdata, null, 2), 'utf-8')

                            let pinnedEmbed = new Discord.EmbedBuilder()
                                .setTitle(`Pinned scores for ${osudata.username}`)
                                .setURL(`https://osu.ppy.sh/u/${userid}`)
                                .setThumbnail(`https://a.ppy.sh/${userid}`);
                                ;

                            if (pinnedcoresdata.length < 1) {
                                pinnedEmbed.setDescription('Error - no scores found')
                                message.reply({ embeds: [pinnedEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: true })
                                return;
                            }

                            pinnedEmbed.setDescription(
                                `Page 1/${Math.ceil(pinnedcoresdata.length / 5)}
                                ${mode}
                                `);
                            for (let i = 0; i < pinnedcoresdata.length && i < 5; i++) {
                                let curscore = pinnedcoresdata[i]
                                if (!curscore) break;
                                let ranking = pinnedcoresdata[i].rank.toUpperCase()
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
                                pinnedEmbed.addFields([{
                                    name: `#${i + 1}`,
                                    value: `
                                    [${curscore.beatmapset.title} [${curscore.beatmap.version}]](https://osu.ppy.sh/b/${curscore.beatmap.id})
                                    **Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>
                                    ${curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
                                    \`${hitlist}\`
                                    ${curscore.pp}pp
                                    `,
                                    inline: false
                                }])

                            }
                            message.reply({
                                embeds: [pinnedEmbed],
                                allowedMentions: { repliedUser: false }, 
                                components: [buttons]
                            })
                            let endofcommand = new Date().getTime();
                            let timeelapsed = endofcommand - currentDate.getTime();
                            fs.appendFileSync(`commands.log`, `\nCommand Latency (message command => pinned) - ${timeelapsed}ms\n`)
                        })
                })
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-pinned-${interaction.member.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-pinned-${interaction.member.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-pinned')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-pinned-${interaction.member.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-pinned-${interaction.member.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            let user:any;
            let searchid = interaction.member.user.id
            let mode:any;
            let page:any;
            if (interaction.type == Discord.InteractionType.ApplicationCommand) {

                user = interaction.options.getString('user')
                mode = interaction.options.getString('mode')
            } else {
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
            fs.appendFileSync(`commands.log`,
            `\noptions(2):
            user: ${user}
            mode: ${mode}
            page: ${page}
            `)
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(user)}/osu`
            if (page < 2) {
                page = 0
            } else if (!page) {
                page = 0
            }

            else {
                page--
            }
            fetch(userinfourl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    try {
                        if (osudata.authentication) {
                            interaction.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            return;
                        }
                    } catch (error) {

                    }
                    let userid = osudata.id
                    if (!userid) {
                        return message.channel.send('Error - no user found')
                    };
                    fs.writeFileSync('debugosu/command-pinned=scores_username.json', JSON.stringify(osudata, null, 2), 'utf-8')
                    let userpinnedurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(userid)}/scores/pinned?mode=${cmdchecks.toHexadecimal(mode)}&limit=100`
                    fetch(userpinnedurl, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    }).then(res => res.json() as any)
                        .then(pinnedcoresdata => {
                            fs.writeFileSync('debugosu/command-pinned=scores.json', JSON.stringify(pinnedcoresdata, null, 2), 'utf-8')
                            let pinnedEmbed = new Discord.EmbedBuilder()
                                .setTitle(`Pinned scores for ${osudata.username}`)
                                .setURL(`https://osu.ppy.sh/u/${userid}`)
                                .setThumbnail(`https://a.ppy.sh/${userid}`);

                            if (pinnedcoresdata.length < 1) {
                                pinnedEmbed.setDescription('Error - no scores found')
                                message.reply({ embeds: [pinnedEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: true })
                                return;
                            }

                            pinnedEmbed.setDescription(
                                `Page ${page + 1}/${Math.ceil(pinnedcoresdata.length / 5)}
                                ${mode}
                                `);
                            for (let i = 0; i < pinnedcoresdata.length && i < 5; i++) {
                                let curscore = pinnedcoresdata[i + (page * 5)]
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
                                pinnedEmbed.addFields([{
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
                            if(interaction.type == Discord.InteractionType.ApplicationCommand){

                            } else if (interaction.type == Discord.InteractionType.MessageComponent) {
                            message.edit({
                                embeds: [pinnedEmbed],
                                allowedMentions: { repliedUser: false }, 
                                components: [buttons]
                            })
                            let endofcommand = new Date().getTime();
                            let timeelapsed = endofcommand - currentDate.getTime();
                            fs.appendFileSync(`commands.log`, `\nCommand Latency (interaction command => pinned) - ${timeelapsed}ms\n`)
                        }
                        })
                })
        }

        fs.appendFileSync(`commands.log`, '\nsuccess\n\n', 'utf-8')
    }
}