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

module.exports = {
    name: 'maplb',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let mapid;
        let mapmods;
        let page;

        let isFirstPage = false;
        let isLastPage = false;

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
                if(!obj.message.embeds[0]){
                    return;
                }
                commanduser = obj.member.user;
                mapid = obj.message.embeds[0].url.split('/b/')[1]
                if (obj.message.embeds[0].footer) {
                    mapmods = obj.message.embeds[0].footer.text
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
                if (page < 2) {
                    isFirstPage = true;
                } else {
                    isFirstPage = false;
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
            isFirstPage = true;
            page = 1;
        }
        page--

        if (!mapid) {
            mapid = osufunc.getPreviousId('map', obj.guildId);
        }

        const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${mapid}`)
        // fs.writeFileSync(`debug/command-leaderboard=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))
        osufunc.debug(mapdata, 'command', 'maplb', obj.guildId, 'mapData');

        if (mapdata?.error) {
            obj.reply({
                content: `${mapdata?.error ? mapdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
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
            // fs.writeFileSync(`debug/command-leaderboard=lbdataf=${obj.guildId}.json`, JSON.stringify(lbdataf, null, 2))
            osufunc.debug(lbdataf, 'command', 'maplb', obj.guildId, 'lbDataF');

            if (lbdataf?.error) {
                obj.reply({
                    content: `${lbdataf?.error ? lbdataf?.error : 'Error: null'}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                }).catch()
                return;
            }

            const lbdata = lbdataf.scores
            // fs.writeFileSync(`debug/command-leaderboard=lbdata=${obj.guildId}.json`, JSON.stringify(lbdata, null, 2))
            osufunc.debug(lbdata, 'command', 'maplb', obj.guildId, 'lbData');


            if (page >= Math.ceil(lbdata.length / 5)) {
                page = Math.ceil(lbdata.length / 5) - 1
            }
            lbEmbed
                .setColor(colours.embedColour.scorelist.dec)
                .setTitle(`Score leaderboard of ${fulltitle}`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                ;

            let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`

            for (let i = 0; i < lbdata.length && i < 5; i++) {
                const score = lbdata[i + (page * 5)]
                if (!score) {
                    break;
                }
                const gamestats = score.statistics

                const hitgeki = gamestats.count_geki
                const hit300 = gamestats.count_300
                const hitkatu = gamestats.count_katu
                const hit100 = gamestats.count_100
                const hit50 = gamestats.count_50
                const miss = gamestats.count_miss
                const mode = score.mode_int
                let hitlist;
                switch (mode) {
                    case 0: //std
                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                        break;
                    case 1: //taiko
                        hitlist = `${hit300}/${hit100}/${miss}`
                        break;
                    case 2: //catch/fruits
                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                        break;
                    case 3: //mania
                        hitlist = `${hitgeki}/${hit300}/${hitkatu}/${hit100}/${hit50}/${miss}`
                        break;
                }
                let ifmods: string = ''
                if (score.mods.length > 0) {
                    ifmods = `+${score.mods.join('')} |`
                }

                scoretxt += `
**[Score #${i + (page * 5) + 1}](https://osu.ppy.sh/scores/${score.mode}/${score.id}) | [${score.user.username}](https://osu.ppy.sh/u/${score.user.id})**
Score set <t:${new Date(score.created_at).getTime() / 1000}:R>
${(score.accuracy * 100).toFixed(2)}% | ${score.rank} | ${score.pp}pp
${ifmods} ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.max_combo}x/**${mapdata.max_combo}x**
${hitlist}
`
            }

            if (lbdata.length < 1 || scoretxt.length < 10) {
                scoretxt = 'Error - no scores found '
            }
            if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
                scoretxt = 'Error - map is unranked'
            }
            lbEmbed.setDescription(`${scoretxt}`)
            if (page >= (lbdata.length / 5) - 1) {
                //@ts-ignore
                pgbuttons.components[3].setDisabled(true)
                //@ts-ignore
                pgbuttons.components[4].setDisabled(true)
            }
            osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`);
        } else {
            const lbdata = await osufunc.apiget('scores_get_map', `${mapid}`, `${osumodcalc.ModStringToInt(mods)}`, 1);
            // fs.writeFileSync(`debug/command-leaderboard=lbdata_apiv1=${obj.guildId}.json`, JSON.stringify(lbdata, null, 2))
            osufunc.debug(lbdata, 'command', 'maplb', obj.guildId, 'lbData');

            if (lbdata?.error) {
                obj.reply({
                    content: `${lbdata?.error ? lbdata?.error : 'Error: null'}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                }).catch()
                return;
            }

            lbEmbed
                .setColor(colours.embedColour.scorelist.dec)
                .setTitle(`Modded score leaderboard of ${fulltitle}`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                .setFooter({ text: `mods: ${mods}` })
                ;

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

            if (page >= (lbdata.length / 5) - 1) {
                //@ts-ignore
                pgbuttons.components[3].setDisabled(true)
                //@ts-ignore
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
                obj.reply({
                    content: '',
                    embeds: [lbEmbed],
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