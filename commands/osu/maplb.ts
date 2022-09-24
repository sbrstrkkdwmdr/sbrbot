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
import func = require('../../src/other');
import embedStuff = require('../../src/embed');

module.exports = {
    name: 'maplb',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let mapid;
        let mapmods;
        let page;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                mapid = args[0]
                if (isNaN(mapid)) {
                    mapid = undefined;
                }
                if (args.join(' ').includes('+')) {
                    mapmods = args.join(' ').split('+')[1];
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                mapid = obj.options.getInteger('id');
                page = obj.options.getInteger('page');
                mapmods = obj.options.getString('mods');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                if (!obj.message.embeds[0]) {
                    return;
                }
                commanduser = obj.member.user;
                mapid = obj.message.embeds[0].url.split('/b/')[1]
                if (obj.message.embeds[0].title.includes('+')) {
                    mapmods = obj.message.embeds[0].title.split('+')[1]
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
                    .setCustomId(`Refresh-leaderboard-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔁'),
            )
        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-maplb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-maplb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-maplb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-maplb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-maplb-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'maplb',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'Map ID',
                    value: mapid
                },
                {
                    name: 'Mods',
                    value: mapmods
                },
                {
                    name: 'Page',
                    value: page
                }
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (page < 2 || typeof page != 'number') {
            page = 1;
        }
        page--

        if (!mapid) {
            mapid = osufunc.getPreviousId('map', obj.guildId);
        }

        if (commandType == 'interaction') {
            obj.reply({
                content: 'Loading...',
                allowMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
        }

        const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${mapid}`)
        osufunc.debug(mapdata, 'command', 'maplb', obj.guildId, 'mapData');

        if (mapdata?.error) {
            if (commandType != 'button' && commandType != 'link') {
                if (commandType == 'interaction') {
                    setTimeout(() => {
                        obj.editReply({
                            content: 'Error - could not fetch beatmap data',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }, 1000)
                } else {
                    obj.reply({
                        content: 'Error - could not fetch beatmap data',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            return;
        }

        let title = 'n';
        let fulltitle = 'n';
        let artist = 'n';
        try {
            title = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title})`;
            artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist_unicode} (${mapdata.beatmapset.artist})`;
        } catch (error) {
            obj.reply({ content: 'error - map not found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                .catch();
            return;
        }
        fulltitle = `${artist} - ${title} [${mapdata.version}]`

        let mods;
        if (mapmods) {
            mods = osumodcalc.OrderMods(mapmods) + ''
        }
        const lbEmbed = new Discord.EmbedBuilder()

        if (mods == null) {
            const lbdataf: osuApiTypes.BeatmapScores = await osufunc.apiget('scores_get_map', `${mapid}`)
            osufunc.debug(lbdataf, 'command', 'maplb', obj.guildId, 'lbDataF');

            if (lbdataf?.error) {
                if (commandType != 'button' && commandType != 'link') {
                    if (commandType == 'interaction') {
                        setTimeout(() => {
                            obj.editReply({
                                content: 'Error - could not fetch leaderboard data',
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            }).catch()
                        }, 1000)
                    } else {
                        obj.reply({
                            content: 'Error - could not fetch leaderboard data',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
                return;
            }

            const lbdata = lbdataf.scores
            lbEmbed
                .setColor(colours.embedColour.scorelist.dec)
                .setTitle(`Score leaderboard of ${fulltitle}`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .setThumbnail(osufunc.getMapImages(mapdata.beatmapset_id).list2x)
                ;

            let scoretxt: string;
            if (lbdata.length < 1) {
                scoretxt = 'Error - no scores found '
            }
            if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
                scoretxt = 'Error - map is unranked'
            }

            if (page >= Math.ceil(lbdata.length / 5)) {
                page = Math.ceil(lbdata.length / 5) - 1
            }

            osufunc.debug(lbdata, 'command', 'maplb', obj.guildId, 'lbData');

            const scoresarg = await embedStuff.scoreList({
                scores: lbdata,
                detailed: false,
                showWeights: false,
                page: page,
                showMapTitle: false,
                showTruePosition: false,
                sort: 'score',
                truePosType: 'score',
                filteredMapper: null,
                filteredMods: null,
                reverse: false,
                mapidOverride: mapdata.id
            })

            if (scoresarg.fields.length == 0) {
                lbEmbed.addFields([{
                    name: 'Error',
                    value: 'No scores found',
                    inline: false
                }]);
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
                for (let i = 0; i < scoresarg.fields.length; i++) {
                    lbEmbed.addFields([scoresarg.fields[i]])
                }
            }

            lbEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(scoresarg.maxPages)}`)

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

            osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`);
        } else {
            const lbdata = await osufunc.apiget('scores_get_map', `${mapid}`, `${osumodcalc.ModStringToInt(mods)}`, 1);
            osufunc.debug(lbdata, 'command', 'maplb', obj.guildId, 'lbData');

            if (lbdata?.error) {
                if (commandType != 'button' && commandType != 'link') {
                    if (commandType == 'interaction') {
                        setTimeout(() => {
                            obj.editReply({
                                content: 'Error - could not fetch leaderboard data',
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            }).catch()
                        }, 1000)
                    } else {
                        obj.reply({
                            content: 'Error - could not fetch leaderboard data',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
                return;
            }

            lbEmbed
                .setColor(colours.embedColour.scorelist.dec)
                .setTitle(`Modded score leaderboard of ${fulltitle} + ${mods}`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`);

            let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`

            for (let i = 0; i < (lbdata).length && i < 5; i++) {
                let hitlist;
                let acc;
                const score = lbdata[i + (page * 5)]
                if (!score) break;
                const mode = mapdata.mode
                switch (mode) {
                    case 'osu':
                        hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countmiss}`
                        acc = osumodcalc.calcgrade(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy
                        break;
                    case 'taiko':
                        hitlist = `${score.count300}/${score.count100}/${score.countmiss}`
                        acc = osumodcalc.calcgradeTaiko(parseInt(score.count300), parseInt(score.count100), parseInt(score.countmiss)).accuracy
                        break;
                    case 'fruits':
                        hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countkatu}/${score.countmiss}`
                        acc = osumodcalc.calcgradeCatch(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countkatu), parseInt(score.countmiss)).accuracy
                        break;
                    case 'mania':
                        hitlist = `${score.countgeki}/${score.count300}/${score.countkatu}/${score.count100}/${score.count50}/${score.countmiss}`
                        acc = osumodcalc.calcgradeMania(parseInt(score.countgeki), parseInt(score.count300), parseInt(score.countkatu), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy
                        break;
                }
                scoretxt += `
                **[Score #${i + (page * 5) + 1}](https://osu.ppy.sh/scores/${mode}/${score.score_id}) | [${score.username}](https://osu.ppy.sh/u/${score.user_id})**
                Score set on ${score.date}
                ${(acc).toFixed(2)}% | ${score.rank} | ${score.pp}
                ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.maxcombo}x/**${mapdata.max_combo}x**
                ${hitlist}
                Has replay: ${score.replay_available == 1 ? '✅' : '❌'}
                `
            }
            if ((lbdata as any).length < 1 || scoretxt.length < 10) {
                scoretxt = 'Error - no scores found '
            }
            if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
                scoretxt = 'Error - map is unranked'
            }
            lbEmbed.setDescription(`${scoretxt}`)

            osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`);

            if (page <= 1) {
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[0].setDisabled(true)
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[1].setDisabled(true)
            }

            if (page >= (lbdata.length / 5) - 1) {
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[3].setDisabled(true)
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[4].setDisabled(true)
            }
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [lbEmbed],
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
                    obj.reply({
                        content: '',
                        embeds: [lbEmbed],
                        components: [pgbuttons, buttons],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000)
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: [lbEmbed],
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