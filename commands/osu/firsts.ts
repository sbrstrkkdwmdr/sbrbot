import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'firsts',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user;
        let searchid;
        let page = 0;
        let sort = 'recent';
        let reverse = false;
        let mode = 'osu';

        let isFirstPage = false;
        let isLastPage = false;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                user = args.join(' ');
                if (!args[0]) {
                    user = null
                }
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                page = 0
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                user = obj.options.getString('user');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
                user = obj.message.embeds[0].title.split('for ')[1]
                mode = cmdchecks.toAlphaNum(obj.message.embeds[0].description.split('\n')[1])
                page = 0;
                (obj.message.embeds[0].description).split('/')[0].replace('Page ', '')
                switch (button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = parseInt((obj.message.embeds[0].description).split('/')[0].replace('Page ', '')) - 1
                        break;
                    case 'RightArrow':
                        page = parseInt((obj.message.embeds[0].description).split('/')[0].replace('Page ', '')) + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((obj.message.embeds[0].description).split('/')[1].split('\n')[0])
                        break;
                    case 'Refresh':
                        page = parseInt((obj.message.embeds[0].description).split('/')[0].replace('Page ', ''))
                        break;
                }
                if (button == 'Search') {
                    page = obj.fields.getTextInputValue('search')
                }

                if (page < 2) {
                    isFirstPage = true;
                } else {
                    isFirstPage = false;
                }
                if (page == parseInt((obj.message.embeds[0].description).split('/')[1].split('\n')[0])) {
                    isLastPage = true
                }
            }
                break;
        }
        if (overrides != null) {
            if (overrides.page != null) {
                page = overrides.page
            }
        }

        //==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'firsts',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'User',
                    value: user
                },
                {
                    name: 'Search ID',
                    value: searchid
                },
                {
                    name: 'Page',
                    value: page
                },
                {
                    name: 'Sort',
                    value: sort
                },
                {
                    name: 'Reverse',
                    value: reverse
                },
                {
                    name: 'Mode',
                    value: mode
                }
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (page < 2 || typeof page != 'number') {
            isFirstPage = true;
            page = 1;
        }
        page--

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀')
                    .setDisabled(isFirstPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                    .setDisabled(isLastPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                    .setDisabled(isLastPage)
                ,
            );
        const buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-firsts-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('🔁'),
        )
        if (user == null) {
            let cuser = await osufunc.searchUser(searchid, userdata, true);
            user = cuser.username;
        }

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${user}`)
        fs.writeFileSync(`debug/command-firsts=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        if (osudata?.error) {
            obj.reply({
                content: `${osudata?.error ? osudata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        if (!osudata.id) {
            return obj.channel.send('Error - no user found')
                .catch();

        }

        const firstscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('firsts', `${osudata.id}`, `${mode}`)
        fs.writeFileSync(`debug/command-firsts=firstscoresdata=${obj.guildId}.json`, JSON.stringify(firstscoresdata, null, 2))
        if (firstscoresdata?.error) {
            obj.reply({
                content: `${firstscoresdata?.error ? firstscoresdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        const firstsEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.dec)
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
        if (page >= Math.ceil(firstscoresdata.length / 5)) {
            page = Math.ceil(firstscoresdata.length / 5) - 1
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
            fs.writeFileSync(`debug/command-firsts=ppcalc=${obj.guildId}`, JSON.stringify(ppcalcing, null, 2))

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

        if (page >= (firstscoresdata.length / 5) - 1) {
            //@ts-ignore
            pgbuttons.components[3].setDisabled(true)
            //@ts-ignore
            pgbuttons.components[4].setDisabled(true)
        }

        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [firstsEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: '',
                    embeds: [firstsEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: [firstsEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }



        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}