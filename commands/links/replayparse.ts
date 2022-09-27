import fs = require('fs');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');
import replayparse = require('osureplayparser');
import func = require('../../src/other');

module.exports = {
    name: 'replayparse',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides) {
        let commanduser;
        let replay;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
            case 'link': {
                commanduser = obj.author;
            } break;
        }


        //==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'replayparse',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                []
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        try {
            replay = replayparse.parseReplay('./files/replay.osr')
        } catch (err) {
            return;
        }
        osufunc.debug(replay, 'fileparse', 'replay', obj.guildId, 'replayData');

        let mapdata: osuApiTypes.Beatmap;
        if (func.findFile(replay.beatmapMD5, `mapdata`) &&
            commandType == 'button' &&
            !('error' in func.findFile(replay.beatmapMD5, `mapdata`)) &&
            button != 'Refresh') {
            mapdata = func.findFile(replay.beatmapMD5, `mapdata`)
        } else {
            mapdata = await osufunc.apiget('map_get_md5', replay.beatmapMD5)
        }
        func.storeFile(mapdata, replay.beatmapMD5, 'mapdata')

        osufunc.debug(mapdata, 'fileparse', 'replay', obj.guildId, 'mapData');
        if (mapdata?.id) {
            typeof mapdata.id == 'number' ? osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`) : ''
        }
        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${replay.playerName}`)
        osufunc.debug(osudata, 'fileparse', 'replay', obj.guildId, 'osuData');
        let userid: string | number;
        try {
            userid = osudata.id
        } catch (err) {
            userid = 0
            return
        }
        let mapbg: string;
        let mapcombo: string | number;
        let fulltitle: string;
        let mapdataid: string;
        try {
            mapbg = mapdata.beatmapset.covers['list@2x']
            fulltitle = `${mapdata.beatmapset.artist != mapdata.beatmapset.artist_unicode ? `${mapdata.beatmapset.artist} (${mapdata.beatmapset.artist_unicode})` : mapdata.beatmapset.artist}`
            fulltitle += ` - ${mapdata.beatmapset.title != mapdata.beatmapset.title_unicode ? `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})` : mapdata.beatmapset.title}`
                + ` [${mapdata.version}]`
            mapcombo = mapdata.max_combo ? mapdata.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : NaN
            mapdataid = 'https://osu.ppy.sh/b/' + mapdata.id
        } catch (error) {
            fulltitle = 'Unknown/unavailable map'
            mapbg = 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png';
            mapcombo = NaN
            mapdataid = 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png'
        }

        const mods = replay.mods
        let ifmods: string;
        if (mods != 0) {
            ifmods = `+${osumodcalc.ModIntToString(mods)}`
        } else {
            ifmods = ''
        }
        const gameMode = replay.gameMode
        let accuracy: number;
        let xpp: object;
        let hitlist: string;
        let fcacc: number;
        let ppissue: string;
        let totalhits = 0

        switch (gameMode) {
            case 0:
                hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
                accuracy = osumodcalc.calcgrade(replay.number_300s, replay.number_100s, replay.number_50s, replay.misses).accuracy
                fcacc = osumodcalc.calcgrade(replay.number_300s, replay.number_100s, replay.number_50s, 0).accuracy
                totalhits = replay.number_300s + replay.number_100s + replay.number_50s + replay.misses
                break;
            case 1:

                hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.misses}`
                accuracy = osumodcalc.calcgradeTaiko(replay.number_300s, replay.number_100s, replay.misses).accuracy
                fcacc = osumodcalc.calcgradeTaiko(replay.number_300s, replay.number_100s, 0).accuracy
                totalhits = replay.number_300s + replay.number_100s + replay.misses
                break;
            case 2:

                hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
                accuracy = osumodcalc.calcgradeCatch(replay.number_300s, replay.number_100s, replay.number_50s, replay.katus, replay.misses).accuracy
                fcacc = osumodcalc.calcgradeCatch(replay.number_300s, replay.number_100s, replay.number_50s, replay.katus, 0).accuracy
                totalhits = replay.number_300s + replay.number_100s + replay.number_50s + replay.katus + replay.misses
                break;
            case 3:

                hitlist = `${replay.gekis}/${replay.number_300s}/${replay.katus}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
                accuracy = osumodcalc.calcgradeMania(replay.gekis, replay.number_300s, replay.katus, replay.number_100s, replay.number_50s, replay.misses).accuracy
                fcacc = osumodcalc.calcgradeMania(replay.gekis, replay.number_300s, replay.katus, replay.number_100s, replay.number_50s, 0).accuracy
                totalhits = replay.gekis + replay.number_300s + replay.katus + replay.number_100s + replay.number_50s + replay.misses
                break;
        }
        const failed = totalhits == (mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners) ? false : true

        try {
            xpp = await osufunc.scorecalc({
                mods: osumodcalc.ModIntToString(replay.mods),
                gamemode: osumodcalc.ModeIntToName(replay.gameMode),
                mapid: mapdata.id,
                miss: replay.misses,
                acc: accuracy / 100,
                maxcombo: replay.max_combo,
                score: replay.score,
                calctype: 0,
                passedObj: totalhits,
                failed: failed
            })
            ppissue = ''
        } catch (error) {
            xpp = [{
                pp: 0
            },
            {
                pp: 0
            }]
            ppissue = 'Error - could not fetch beatmap'
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, 'ERROR CALCULATING PERFORMANCE: ' + error)

        }

        const lifebar = replay.life_bar.split('|')
        const lifebarF = []
        for (let i = 0; i < lifebar.length; i++) {
            lifebarF.push(lifebar[i].split(',')[0])
        }
        lifebarF.shift()

        const dataLabel = ['Start']

        for (let i = 0; i < lifebarF.length; i++) {
            dataLabel.push('')

        }

        dataLabel.push('end')

        const chart = await osufunc.graph(dataLabel, lifebarF, 'Health', null, null, null, null, null, 'replay')
        const Embed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.score.dec)
            .setAuthor({ name: `${replay.playerName}'s replay`, iconURL: `https://a.ppy.sh/${userid}`, url: `https://osu.ppy.sh/users/${userid}` })
            .setTitle(`${fulltitle} ${ifmods}`)
            .setURL(`${mapdataid}`)
            .setThumbnail(mapbg)
            .setDescription(
                `
${replay.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${replay.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x/**${mapcombo}x** | ${accuracy.toFixed(2)}%
\`${hitlist}\`
${xpp[0].pp.toFixed(2)}pp | ${xpp[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC 
${ppissue}
`
            )
            .setImage(`${chart}`);

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [Embed],
                    files: [],
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
                    embeds: [Embed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [Embed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
            case 'link': {
                obj.reply({
                    content: '',
                    embeds: [Embed],
                    files: [],
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