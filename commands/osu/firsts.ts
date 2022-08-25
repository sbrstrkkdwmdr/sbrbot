import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import cmdchecks = require('../../calc/commandchecks');
import osufunc = require('../../calc/osufunc');
import colours = require('../../configs/colours');
import osuApiTypes = require('../../configs/osuApiTypes');

module.exports = {
    name: 'firsts',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;
        let user = '';
        let searchid = 1;
        let mode = null;
        let page = 0;

        let isFirstPage = false;
        let isLastPage = false;

        if (message != null && button == null) {
            commanduser = message.author;
            fs.appendFileSync(`logs/cmd/commands${message.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - firsts (message)
${currentDate} | ${currentDateISO}
recieved firsts command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            user = await args.join(' ');
            searchid = await message.author.id
            if (mode == null && (!args[0] || message.mentions.users.size > 0)) {
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
            }
            isFirstPage = true;
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - firsts (interaction)
${currentDate} | ${currentDateISO}
recieved firsts command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            user = await interaction.options.getString('user');
            mode = await interaction.options.getString('mode');
            isFirstPage = true;
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - firsts (button)
${currentDate} | ${currentDateISO}
recieved firsts command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
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
                isLastPage = true
            }

        }
        if (user.length < 1 || message.mentions.users.size > 0) {
            const findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname != null) {
                user = findname.get('osuname');
            } else {
                return obj.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
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
        }
        if (page > 0) {
            page--
        }
        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-firsts-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage)
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-firsts-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀')
                    .setDisabled(isFirstPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-firsts-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    .setDisabled(isLastPage)
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-firsts-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    .setDisabled(isLastPage)
                /* .setLabel('End') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-firsts-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('🔁'),
            );
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    user: ${user}
    mode: ${mode}
    page: ${page}
    searchid: ${searchid}
----------------------------------------------------
`, 'utf-8')

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${user}`)

        fs.writeFileSync(`debugosu/command-firsts=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        try {
            if (osudata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                if (button == null) {
                    obj.reply({ content: 'error - osu auth out of date. Updating token...', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                await osufunc.updateToken();
                return;
            }
            if (typeof osudata.error != 'undefined' && osudata.error == null) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - ${osudata.error}
----------------------------------------------------`)
                if (button == null) {
                    await obj.reply({ content: `error - ${osudata.error}`, allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                return;
            }
        } catch (error) {
        }
        if (!osudata.id) {
            return obj.channel.send('Error - no user found')
                .catch();

        }
        const firstscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('firsts', `${osudata.id}`, `${mode}`)
        fs.writeFileSync(`debugosu/command-firsts=firstscoresdata=${obj.guildId}.json`, JSON.stringify(firstscoresdata, null, 2))
        try {
            if (firstscoresdata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                if (button == null) {
                    obj.reply({ content: 'error - osu auth out of date. Updating token...', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                await osufunc.updateToken();
                return;
            }
            if (typeof firstscoresdata.error != 'undefined' && firstscoresdata.error == null) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - ${firstscoresdata.error}
----------------------------------------------------`)
                if (button == null) {
                    await obj.reply({ content: `error - ${firstscoresdata.error}`, allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                return;
            }
        } catch (error) {
        }


        const firstsEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.hex)
            .setTitle(`#1 scores for ${osudata.username}`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
            .setThumbnail(`https://a.ppy.sh/${osudata.id}`)
            ;
        if (firstscoresdata.length < 1) {
            firstsEmbed.setDescription('Error - no scores found')
            obj.reply({ embeds: [firstsEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: true })
                .catch();

            return;
        }
        firstsEmbed.setDescription(
            `Page ${page + 1}/${Math.ceil(firstscoresdata.length / 5)}
            ${mode}
            `);
        for (let i = 0; i < firstscoresdata.length && i < 5; i++) {
            const curscore = firstscoresdata[i + (page * 5)]
            if (!curscore) break;
            const ranking = curscore.rank.toUpperCase()
            let grade: string;
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
            }
            let hitlist: string;
            const hitstats = curscore.statistics
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

            /*             const fmods: string[] = curscore.mods
                        let ifmods: string = '';
                        if (!fmods) {
                            ifmods = ''
                        } else {
                            ifmods = '+' + fmods.join('').toUpperCase()
                        } */

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
            fs.writeFileSync(`debugosu/command-firsts=ppcalc=${obj.guildId}`, JSON.stringify(ppcalcing, null, 2))

            firstsEmbed.addFields([{
                name: `#${i + 1 + (page * 5)}`,
                value: `
                [${curscore.beatmapset.title} [${curscore.beatmap.version}]](https://osu.ppy.sh/b/${curscore.beatmap.id})
                **Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>
                ${curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
                \`${hitlist}\`
                ${pptxt}
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
                .catch();

        }
        else {
            obj.reply({
                embeds: [firstsEmbed],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
                components: [buttons]
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