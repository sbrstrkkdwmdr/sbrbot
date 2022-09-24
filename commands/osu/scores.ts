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
import embedStuff = require('../../src/embed');
import func = require('../../src/other');
import def = require('../../src/consts/defaults');
module.exports = {
    name: 'scores',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user;
        let searchid;
        let mapid;
        let page = 1;

        const scoredetailed = false;
        let sort: any = 'recent';
        let reverse = false;
        let mode = 'osu';
        let filteredMapper = null;
        let filteredMods = null;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                user = args.join(' ');
                if (!args[0] || args[0].includes(searchid)) {
                    user = null
                }
                mapid = null;
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                searchid = obj.member.user.id;
                user = obj.options.getString('username');
                mapid = obj.options.getNumber('id');
                sort = obj.options.getString('sort');
                reverse = obj.options.getBoolean('reverse');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                if (!obj.message.embeds[0]) {
                    return;
                }
                commanduser = obj.member.user;
                page = 0;
                user = obj.message.embeds[0].author.name.split(' (#')[0]
                mapid = obj.message.embeds[0].url.split('osu.ppy.sh/')[1].split('/')[1]
                if (obj.message.embeds[0].description) {
                    if (obj.message.embeds[0].description.includes('mapper')) {
                        filteredMapper = obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                    }
                    if (obj.message.embeds[0].description.includes('mods')) {
                        filteredMods = obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                    }
                    const sort1 = obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                    switch (true) {
                        case sort1.includes('score'):
                            sort = 'score'
                            break;
                        case sort1.includes('acc'):
                            sort = 'acc'
                            break;
                        case sort1.includes('pp'):
                            sort = 'pp'
                            break;
                        case sort1.includes('old'): case sort1.includes('recent'):
                            sort = 'recent'
                            break;
                        case sort1.includes('combo'):
                            sort = 'combo'
                            break;
                        case sort1.includes('miss'):
                            sort = 'miss'
                            break;
                        case sort1.includes('rank'):
                            sort = 'rank'
                            break;

                    }


                    const reverse1 = obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                    if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses'))) {
                        reverse = true
                    } else {
                        reverse = false
                    }
                    page = 0
                    switch (button) {
                        case 'BigLeftArrow':
                            page = 1
                            break;
                        case 'LeftArrow':
                            page = parseInt((obj.message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
                            break;
                        case 'RightArrow':
                            page = parseInt((obj.message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
                            break;
                        case 'BigRightArrow':
                            page = parseInt((obj.message.embeds[0].description).split('/')[1].split('\n')[0])
                            break;
                        case 'Refresh':
                            page = parseInt((obj.message.embeds[0].description).split('/')[0].split(': ')[1])
                            break;
                    }
                    mode = obj.message.embeds[0].description.split('mode: ')[1].split('\n')[0]
                }
                const pageParsed =
                    parseInt((obj.message.embeds[0].description).split('Page:')[1].split('/')[0])
                page = 0
                switch (button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = pageParsed - 1
                        break;
                    case 'RightArrow':
                        page = pageParsed + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])

                        break;
                    default:
                        page = pageParsed
                        break;
                }
            }
                break;
        }
        if (overrides != null) {
            if (overrides.page != null) {
                page = overrides.page
            }
            if (overrides.sort != null) {
                sort = overrides.sort
            }
            if (overrides.reverse != null) {
                reverse = overrides.reverse
            }
        }

        //==============================================================================================================================================================================================

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔁'),
            )

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'scores',
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
                        name: 'Map ID',
                        value: mapid
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

        if (page < 2 || typeof page != 'number' || isNaN(page)) {
            page = 1;
        }
        page--

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅').setDisabled(false),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        if (user == null) {
            const cuser = await osufunc.searchUser(searchid, userdata, true);
            user = cuser.username;
            if (mode == null) {
                mode = cuser.gamemode;
            }
            if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                if (commandType != 'button') {
                    obj.reply({
                        content: 'User not found',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
                return;
            }
        }
        if (!mapid || isNaN(mapid)) {
            mapid = osufunc.getPreviousId('map', obj.guildId);
        }


        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`)
        osufunc.debug(osudata, 'command', 'scores', obj.guildId, 'osuData');
        if (osudata?.error) {
            obj.reply({
                content: `${osudata?.error ? osudata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        if (commandType == 'interaction') {
            obj.reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
        }

        if (!osudata.id) {
            if (button == null) {
                return obj.reply({
                    content: 'Error - no user found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch()
                    ;

            } else {
                return obj.message.edit({
                    content: 'Error - no user found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch()
                    ;

            }
        }
        if (page == null || page < 1) {
            page = 0
        } else {
            page = page - 1
        }
        const scoredataPresort: osuApiTypes.ScoreArrA = await osufunc.apiget('user_get_scores_map', `${mapid}`, `${osudata.id}`)
        osufunc.debug(scoredataPresort, 'command', 'scores', obj.guildId, 'scoreDataPresort');
        if (scoredataPresort?.error) {
            obj.reply({
                content: `${scoredataPresort?.error ? scoredataPresort?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        const scoredata: osuApiTypes.Score[] = scoredataPresort.scores
        try {
            scoredata.length < 1
        } catch (error) {
            return obj.reply({
                content: 'Error - no scores found',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();
        }
        osufunc.debug(scoredata, 'command', 'scores', obj.guildId, 'scoreData');
        const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${mapid}`)
        osufunc.debug(mapdata, 'command', 'scores', obj.guildId, 'mapData');
        if (mapdata?.error) {
            obj.reply({
                content: `${mapdata?.error ? mapdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        const title = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title})`;
        const artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist_unicode} (${mapdata.beatmapset.artist})`;


        const scoresEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`${artist} - ${title} [${mapdata.version}]`)
            .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
            .setImage(`${mapdata.beatmapset.covers['cover@2x']}`)
            .setAuthor({
                name: `${osudata.username} (#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp)`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
            })
            .setURL(`https://osu.ppy.sh/b/${mapid}`)

        scoresEmbed.setFooter({ text: `Page ${page + 1}/${Math.ceil(scoredata.length / 5)}` })

        if (page >= Math.ceil(scoredata.length / 5)) {
            page = Math.ceil(scoredata.length / 5) - 1
        }

        const scoresarg = await embedStuff.scoreList(
            {
                scores: scoredata,
                detailed: scoredetailed,
                showWeights: false,
                page: page,
                showMapTitle: false,
                showTruePosition: false,
                sort: sort,
                truePosType: sort,
                filteredMapper: filteredMapper,
                filteredMods: filteredMods,
                reverse: reverse,
                mapidOverride: mapdata.id
            })
        scoresEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${scoresarg.maxPages}\nmode: ${mode}\n`)
        if (scoresarg.fields.length == 0) {
            scoresEmbed.addFields([{
                name: 'Error',
                value: 'No scores found',
                inline: false
            }])
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[0].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[1].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[2].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[3].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[4].setDisabled(true)
        } else {
            for (let i = 0; i < scoredata.length && i < 5; i++) {
                scoresEmbed.addFields([scoresarg.fields[i]])
            }
        }


        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);
        osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`);

        if (scoresarg.isFirstPage) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[0].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[1].setDisabled(true)
        }
        if (scoresarg.isLastPage) {
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[3].setDisabled(true)
            //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
            pgbuttons.components[4].setDisabled(true)
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [scoresEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                setTimeout(() => {
                    obj.editReply({
                        content: '',
                        embeds: [scoresEmbed],
                        components: [pgbuttons, buttons],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000);
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: [scoresEmbed],
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