import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../calc/osufunc');
import cmdchecks = require('../../calc/commandchecks');
import colours = require('../../configs/colours');
import osuApiTypes = require('../../configs/osuApiTypes');

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
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - pinned (message)
${currentDate} | ${currentDateISO}
recieved pinned command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
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
            if (!args[0]) {
                user = null;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - pinned (interaction)
${currentDate} | ${currentDateISO}
recieved pinned command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
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
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - pinned (button)
${currentDate} | ${currentDateISO}
recieved pinned command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
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
        if (user == null || message.mentions.users.size > 0) {
            let findname;
            findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname != null) {
                user = findname.get('osuname');
            } else {
                return message.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    .catch(error => { });

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
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    user: ${user}
    mode: ${mode}
    page: ${page}
----------------------------------------------------
`, 'utf-8')
        let userinfourl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(user)}/osu`

        const osudata:osuApiTypes.User = await fetch(userinfourl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)
            .catch(error => {
                if (button == null) {
                    try {
                        message.edit({
                            content: 'Error',
                            allowedMentions: { repliedUser: false },
                        })

                    } catch (err) {

                    }
                } else {
                    obj.reply({
                        content: 'Error',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch(error => { });

                }
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
                return;
            });
        fs.writeFileSync(`debugosu/command-pinned=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))

        try {
            if (osudata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                obj.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })

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
            .catch(error => { });

            return;
        }

        let userpinnedurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(osudata.id)}/scores/pinned?mode=${cmdchecks.toHexadecimal(mode)}&limit=100`
        const pinnedscoresdata:osuApiTypes.Score[] = await fetch(userpinnedurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)
            .catch(error => {
                if (button == null) {
                    try {
                        message.edit({
                            content: 'Error',
                            allowedMentions: { repliedUser: false },
                        })

                    } catch (err) {

                    }
                } else {
                    obj.reply({
                        content: 'Error',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                    .catch(error => { });

                }
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
                return;
            });
        fs.writeFileSync(`debugosu/command-pinned=pinnedscoresdata=${obj.guildId}.json`, JSON.stringify(pinnedscoresdata, null, 2))

        let pinnedEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.hex)
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

                let pptxt: any;
                let ppcalcing = await osufunc.scorecalc(
                    curscore.mods.join('').length > 1 ? curscore.mods.join('').toUpperCase() : 'NM',
                    curscore.mode,
                    curscore.beatmap.id,
                    hitstats.count_geki,
                    hitstats.count_300,
                    hitstats.count_katu,
                    hitstats.count_100,
                    hitstats.count_50,
                    hitstats.count_miss,
                    curscore.accuracy,
                    curscore.max_combo,
                    curscore.score,
                    0,
                    null, false
                )
                if (curscore.accuracy != 1) {
                    if (curscore.pp == null || curscore.pp == NaN) {
                        pptxt = `${await ppcalcing[0].pp.toFixed(2)}pp`
                    } else {
                        pptxt = `${curscore.pp.toFixed(2)}pp`
                    }
                    if (curscore.perfect == false) {
                        pptxt += ` (${ppcalcing[1].pp.toFixed(2)}pp if FC)`
                    }
                    pptxt += ` (${ppcalcing[2].pp.toFixed(2)}pp if SS)`
                } else {
                    if (curscore.pp == null || curscore.pp == NaN) {
                        pptxt =
                            `${await ppcalcing[0].pp.toFixed(2)}pp`
                    } else {
                        pptxt =
                            `${curscore.pp.toFixed(2)}pp`
                    }
                }
                fs.writeFileSync(`debugosu/command-pinned=ppcalc=${obj.guildId}`, JSON.stringify(ppcalcing, null, 2))

                pinnedEmbed.addFields([
                    {
                        name: `#${i + 1 + page * 5}`,
                        value: `
                        [${fulltitle}](https://osu.ppy.sh/b/${curscore.beatmap.id})
                        ${curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
                        \`${hitlist}\`
                        ${pptxt}
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
                .catch(error => { });

        } else {
            message.edit({
                embeds: [pinnedEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons]
            })
            .catch(error => { });

        }


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Command Latency - ${new Date().getTime() - currentDate.getTime()}ms
success
----------------------------------------------------
`, 'utf-8')
    }
}