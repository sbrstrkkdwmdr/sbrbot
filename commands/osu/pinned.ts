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
    name: 'pinned',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user;
        let searchid;
        let page;
        let sort = 'pp';
        let reverse = false;
        let mode;

        let isFirstPage = false;
        let isLastPage = false;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                user = args.join(' ');
                if (!args[0]) {
                    user = null
                }
                page = 1;
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                searchid = obj.member.user.id;
                user = obj.options.getString('user');
                page = obj.options.getInteger('page');
                sort = obj.options.getString('sort');
                reverse = obj.options.getBoolean('reverse');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
                user = obj.message.embeds[0].title.split('for ')[1]
                mode = obj.message.embeds[0].description.split('\n')[1]
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
                if (page < 2) {
                    isFirstPage = true;
                }
                if (page == parseInt((obj.message.embeds[0].description).split('/')[1].split('\n')[0])) {
                    isLastPage = true;
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

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-pinned-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔁'),
            )

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'pinned',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [
                    {
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
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (page < 2) {
            isFirstPage = true;
            page = 1;
        }
        page--
        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-pinned-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-pinned-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀')
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-pinned-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-pinned-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                    .setDisabled(isLastPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-pinned-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                    .setDisabled(isLastPage),
            );
        if (user == null) {
            let cuser = await osufunc.searchUser(searchid, userdata, true);
            user = cuser.username;
            if (mode == null) {
                mode = cuser.gamemode;
            }
            if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                return;
            }
        }
        if (mode == null) {
            mode = 'osu'
        }
        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`)
        fs.writeFileSync(`debug/command-pinned=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
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
        fs.writeFileSync(`debug/command-pinned=pinnedscoresdata=${obj.guildId}.json`, JSON.stringify(pinnedscoresdata, null, 2))
        if (pinnedscoresdata?.error) {
            obj.reply({
                content: `${pinnedscoresdata?.error ? pinnedscoresdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        if (page >= Math.ceil(pinnedscoresdata.length / 5)) {
            page = Math.ceil(pinnedscoresdata.length / 5) - 1
        }

        const pinnedEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.dec)
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
                fs.writeFileSync(`debug/command-pinned=ppcalc=${obj.guildId}`, JSON.stringify(ppcalcing, null, 2))

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
        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);

        if (page >= (pinnedscoresdata.length / 5) - 1) {
            //@ts-ignore
            pgbuttons.components[3].setDisabled(true)
            //@ts-ignore
            pgbuttons.components[4].setDisabled(true)
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [pinnedEmbed],
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
                    embeds: [pinnedEmbed],
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
                    embeds: [pinnedEmbed],
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