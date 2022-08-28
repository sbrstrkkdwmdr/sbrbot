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
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;

        let user = null;
        let searchid = null;
        let mode = 'osu';
        let page = 1;

        let isFirstPage = false;
        let isLastPage = false;

        let baseCommandType: string;

        if (message != null && button == null) {
            commanduser = message.author;
            baseCommandType = 'message'
            user = args.join(' ')
            searchid = message.author.id
            isFirstPage = true;
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
            commanduser = interaction.member.user;
            baseCommandType = 'interaction'
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user
            baseCommandType = 'button'
            user = message.embeds[0].title.split('for ')[1]
            mode = message.embeds[0].description.split('\n')[1]
            page = 0;
            (message.embeds[0].description).split('/')[0].replace('Page ', '')
            switch (button) {
                case 'BigLeftArrow':
                    page = 1
                    break;
                case 'LeftArrow':
                    page = parseInt((message.embeds[0].description).split('/')[0].replace('Page ', '')) - 1
                    break;
                case 'RightArrow':
                    page = parseInt((message.embeds[0].description).split('/')[0].replace('Page ', '')) + 1
                    break;
                case 'BigRightArrow':
                    page = parseInt((message.embeds[0].description).split('/')[1].split('\n')[0])
                    break;
                case 'Refresh':
                    page = parseInt((message.embeds[0].description).split('/')[0].replace('Page ', ''))
                    break;
            }
            if (page < 2) {
                isFirstPage = true;
            }
            if (page == parseInt((message.embeds[0].description).split('/')[1].split('\n')[0])) {
                isLastPage = true;
            }
        }
        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-pinned-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('🔁'),
            )

        const pgbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-pinned-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage)
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-pinned-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀')
                    .setDisabled(isFirstPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-pinned-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    .setDisabled(isLastPage)
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-pinned-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    .setDisabled(isLastPage)
                /* .setLabel('End') */,
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
COMMAND EVENT - pinned (${baseCommandType})
${currentDate} | ${currentDateISO}
recieved pinned command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8');
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options:
    user: ${user}
    page: ${page}
----------------------------------------------------
`, 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        if (page < 2) {
            isFirstPage = true;
        }

        if (user == null || searchid != commanduser.id) {
            const findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname != null) {
                user = findname.get('osuname');
            } else {
                return message.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    .catch();

            }
        }
        if (mode == null) {
            const findname = await userdata.findOne({ where: { userid: searchid } })
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
Options(2): 
    user: ${user}
    mode: ${mode}
    page: ${page}
----------------------------------------------------
`, 'utf-8')

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`)
        fs.writeFileSync(`debugosu/command-pinned=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        if (osudata?.error) {
            obj.reply({
                content: `${osudata?.error ? osudata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        if (!osudata.id) {
            obj.reply({
                content: 'Error - user could not be found',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();

            return;
        }

        const pinnedscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('pinned', `${osudata.id}`, `${mode}`)
        fs.writeFileSync(`debugosu/command-pinned=pinnedscoresdata=${obj.guildId}.json`, JSON.stringify(pinnedscoresdata, null, 2))
        if (pinnedscoresdata?.error) {
            obj.reply({
                content: `${pinnedscoresdata?.error ? pinnedscoresdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        const pinnedEmbed = new Discord.EmbedBuilder()
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
                const curscore = pinnedscoresdata[i + page * 5]
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
                const hitstats = curscore.statistics
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
                const ifmods =
                    curscore.mods.join('').length > 1 ?
                        '+' + curscore.mods.join('').toUpperCase() :
                        ''
                const title =
                    curscore.beatmapset.title == curscore.beatmapset.title_unicode ?
                        curscore.beatmapset.title :
                        `${curscore.beatmapset.title} (${curscore.beatmapset.title_unicode})`

                const artist =
                    curscore.beatmapset.artist == curscore.beatmapset.artist_unicode ?
                        curscore.beatmapset.artist :
                        `${curscore.beatmapset.artist} (${curscore.beatmapset.artist_unicode})`
                const fulltitle = `${artist} - ${title} [${curscore.beatmap.version}]`

                let pptxt: string;
                const ppcalcing = await osufunc.scorecalc(
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
                    if (curscore.pp == null || isNaN(curscore.pp)) {
                        pptxt = `${await ppcalcing[0].pp.toFixed(2)}pp`
                    } else {
                        pptxt = `${curscore.pp.toFixed(2)}pp`
                    }
                    if (curscore.perfect == false) {
                        pptxt += ` (${ppcalcing[1].pp.toFixed(2)}pp if FC)`
                    }
                    pptxt += ` (${ppcalcing[2].pp.toFixed(2)}pp if SS)`
                } else {
                    if (curscore.pp == null || isNaN(curscore.pp)) {
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

        fs.writeFileSync(`debugosu/prevuser${obj.guildId}.json`, JSON.stringify({ id: osudata.id }, null, 2))

        if (button == null) {
            obj.reply({
                embeds: [pinnedEmbed],
                allowedMentions: { repliedUser: false },
                components: [pgbuttons, buttons]
            })
                .catch();

        } else {
            message.edit({
                embeds: [pinnedEmbed],
                allowedMentions: { repliedUser: false },
                components: [pgbuttons, buttons]
            })
                .catch();

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