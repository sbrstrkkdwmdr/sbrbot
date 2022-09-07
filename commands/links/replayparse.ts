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
import replayparse = require('osureplayparser')

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
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-replayparse-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-replayparse-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-replayparse-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-replayparse-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

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
        fs.writeFileSync(`debug/command-replay=replay=${obj.guildId}.json`, JSON.stringify(replay, null, 2))

        const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map_get_md5', replay.beatmapMD5)
        fs.writeFileSync(`debug/command-replay=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))
        fs.writeFileSync(`./debug/prevmap${obj.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${replay.playerName}`)
        fs.writeFileSync(`debug/command-replay=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
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
        // let ppiffc: any;
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
            xpp = await osufunc.scorecalc(
                osumodcalc.ModIntToString(replay.mods),
                osumodcalc.ModeIntToName(replay.gameMode),
                mapdata.id,
                replay.gekis,
                replay.number_300s,
                replay.katus,
                replay.number_100s,
                replay.number_50s,
                replay.misses,
                accuracy,
                replay.max_combo,
                replay.score,
                0,
                totalhits, failed
            )
            ppissue = ''
        } catch (error) {
            xpp = [{
                pp: 0
            },
            {
                pp: 0
            }]
            // ppiffc = NaN
            ppissue = 'Error - pp calculator could not fetch beatmap'
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