import fs = require('fs');
import osucalc = require('osumodcalculator')
import { access_token } from '../configs/osuauth.json';
import fetch from 'node-fetch';
import emojis = require('../configs/emojis')
import osufunc = require('../configs/osufunc')
module.exports = {
    name: 'firsts',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')

            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-first-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-first-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-rs')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-first-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-first-${message.author.id}`)
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
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${user}/osu`

            fetch(userinfourl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    let userid = osudata.id
                    if (!userid) {
                        return message.channel.send('Error - no user found')
                    };
                    let userfirstsurl = `https://osu.ppy.sh/api/v2/users/${userid}/scores/firsts?mode=${mode}&limit=100`
                    fetch(userfirstsurl, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    }).then(res => res.json() as any)
                        .then(firstscoresdata => {

                            let firstsEmbed = new Discord.EmbedBuilder()
                                .setTitle(`#1 Scores for ${osudata.username}`)
                                .setURL(`https://osu.ppy.sh/u/${userid}`);

                            if (firstscoresdata.length < 1) {
                                firstsEmbed.setDescription('Error - no scores found')
                                message.reply({ embeds: [firstsEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            }

                            firstsEmbed.setDescription(
                                `Page 1/${Math.ceil(firstscoresdata.length / 5)}
                                `);
                            for (let i = 0; i < firstscoresdata.length && i < 5; i++) {
                                let curscore = firstscoresdata[i]
                                if (!curscore) break;
                                let ranking = firstscoresdata[i].rank.toUpperCase()
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
                                let hitlist:string;
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
                                if(!fmods){
                                    ifmods = ''
                                } else {
                                    ifmods = '+' + fmods.join('').toUpperCase()
                                }
                                firstsEmbed.addFields([{
                                    name: `#${i + 1}`,
                                    value: `
                                    [${curscore.beatmapset.title} [${curscore.beatmap.version}]](https://osu.ppy.sh/b/${curscore.beatmap.id})
                                    **Score set on** ${curscore.created_at.toString().slice(0, 19).replace('T', ' ')}
                                    ${curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${(curscore.accuracy * 100).toFixed(2)} | ${grade}
                                    \`${hitlist}\`
                                    ${curscore.pp.toFixed(2)}pp
                                    `,
                                    inline: false
                                }])

                            }
                            message.reply({
                                embeds: [firstsEmbed],
                                allowedMentions: { repliedUser: false }
                            })
                        })
                })
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}