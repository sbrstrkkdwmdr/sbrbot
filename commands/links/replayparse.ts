import fs = require('fs')
import osucalc = require('osumodcalculator')
import replayparse = require('osureplayparser')
import fetch from 'node-fetch';
import { access_token } from '../../configs/osuauth.json';
import ppcalc = require('booba')
import chartjsimg = require('chartjs-to-image');
import cmdchecks = require('../../calc/commandchecks');
import osugame = require('../../calc/osugame');
import colours = require('../../configs/colours');


module.exports = {
    name: 'replayparse',
    description: 'replayparse',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
            `
----------------------------------------------------
LINK PARSE EVENT - replay parse
${currentDate} | ${currentDateISO}
recieved .osr file
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        //console.log('true')
        fs.appendFileSync(`logs/cmd/link${message.guildId}.log`, `\nLINK DETECT EVENT - replayparse\n${currentDate} ${currentDateISO}\n${message.author.username}#${message.author.discriminator} (${message.author.id}) used osu!score link: ${message.content}\nID:${absoluteID}\n`, 'utf-8')
        let replay: any;
        try {
            replay = replayparse.parseReplay('./files/replay.osr')
        } catch (err) {
            console.log(err)
            return
        }
        fs.writeFileSync(`debugosu/link-replay=replay=${message.guildId}.json`, JSON.stringify(replay, null, 2))

        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/lookup?checksum=${cmdchecks.toHexadecimal(replay.beatmapMD5)}`
        const mapdata = await fetch(mapurl, {
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
                fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error: ${error}
----------------------------------------------------
`, 'utf-8')
            })

        fs.writeFileSync(`debugosu/link-replay=mapdata=${message.guildId}.json`, JSON.stringify(mapdata, null, 2))
        fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));

        const userurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(replay.playerName)}`

        const osudata = await fetch(userurl, {
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
                fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error: ${error}
----------------------------------------------------
`, 'utf-8')
            })

        fs.writeFileSync(`debugosu/link-replay=osudata=${message.guildId}.json`, JSON.stringify(osudata, null, 2))
        let userid: any;
        try {
            userid = osudata.id
        } catch (err) {
            userid = 0
            console.log(err)
            return
        }
        let mapbg: any;
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

        let mods = replay.mods
        let ifmods: any;
        if (mods != 0) {
            ifmods = `+${osucalc.ModIntToString(mods)}`
        } else {
            ifmods = ''
        }
        let gameMode = replay.gameMode
        let accuracy: any;

        let score = {
            beatmap_id: mapdata.id,
            score: '6795149',
            maxcombo: `${mapdata.max_combo}`,
            count50: `${replay.number_50s}`,
            count100: `${replay.number_100s}`,
            count300: `${replay.number_300s}`,
            countmiss: `0`,
            countkatu: `${replay.katus}`,
            countgeki: `${replay.gekis}`,
            perfect: '1',
            enabled_mods: replay.mods,
            user_id: osudata.id,
            date: '2022-02-08 05:24:54',
            rank: 'A',

            score_id: '4057765057'
        }
        let scorenofc = {
            beatmap_id: mapdata.id,
            score: '6795149',
            maxcombo: `${mapdata.max_combo}`,
            count50: `${replay.number_50s}`,
            count100: `${replay.number_100s}`,
            count300: `${replay.number_300s}`,
            countmiss: `${replay.misses}`,
            countkatu: `${replay.katus}`,
            countgeki: `${replay.gekis}`,
            perfect: '0',
            enabled_mods: `${replay.mods}`,
            user_id: '15222484',
            date: '2022-02-08 05:24:54',
            rank: 'A',

            score_id: '4057765057'
        }
        let xpp: any;
        let hitlist: any;
        let fcacc: any;
        let ppiffc: any;
        let ppissue: any;
        let totalhits = 0

        switch (gameMode) {
            case 0:
                hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
                accuracy = osucalc.calcgrade(replay.number_300s, replay.number_100s, replay.number_50s, replay.misses).accuracy
                fcacc = osucalc.calcgrade(replay.number_300s, replay.number_100s, replay.number_50s, 0).accuracy
                totalhits = replay.number_300s + replay.number_100s + replay.number_50s + replay.misses
                break;
            case 1:

                hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.misses}`
                accuracy = osucalc.calcgradeTaiko(replay.number_300s, replay.number_100s, replay.misses).accuracy
                fcacc = osucalc.calcgradeTaiko(replay.number_300s, replay.number_100s, 0).accuracy
                totalhits = replay.number_300s + replay.number_100s + replay.misses
                break;
            case 2:

                hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
                accuracy = osucalc.calcgradeCatch(replay.number_300s, replay.number_100s, replay.number_50s, replay.katus, replay.misses).accuracy
                fcacc = osucalc.calcgradeCatch(replay.number_300s, replay.number_100s, replay.number_50s, replay.katus, 0).accuracy
                totalhits = replay.number_300s + replay.number_100s + replay.number_50s + replay.katus + replay.misses
                break;
            case 3:

                hitlist = `${replay.gekis}/${replay.number_300s}/${replay.katus}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
                accuracy = osucalc.calcgradeMania(replay.gekis, replay.number_300s, replay.katus, replay.number_100s, replay.number_50s, replay.misses).accuracy
                fcacc = osucalc.calcgradeMania(replay.gekis, replay.number_300s, replay.katus, replay.number_100s, replay.number_50s, 0).accuracy
                totalhits = replay.gekis + replay.number_300s + replay.katus + replay.number_100s + replay.number_50s + replay.misses
                break;
        }
        let failed = totalhits == (mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners) ? false : true

        try {
            xpp = await osugame.scorecalc(
                osucalc.ModIntToString(replay.mods),
                osucalc.ModeIntToName(replay.gameMode),
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
            ppiffc = NaN
            ppissue = 'Error - pp calculator could not fetch beatmap'
            fs.appendFileSync(`logs/cmd/link${message.guildId}.log`, 'ERROR CALCULATING PERFORMANCE: ' + error)

        }

        let lifebar = replay.life_bar.split('|')
        let lifebarF: any[] = []
        for (let i = 0; i < lifebar.length; i++) {
            lifebarF.push(lifebar[i].split(',')[0])
        }
        lifebarF.shift()

        let dataLabel = ['Start']

        for (let i = 0; i < lifebarF.length; i++) {
            dataLabel.push('')

        }

        dataLabel.push('end')

        const chart = new chartjsimg()
            .setConfig({
                type: 'line',
                data: {
                    labels: dataLabel,
                    datasets: [{
                        label: 'Health',
                        data: lifebarF,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 1,
                        pointRadius: 0
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [
                            {
                                display: false
                            }
                        ],
                        yAxes: [
                            {
                                display: true,
                                type: 'linear',
                                ticks: {
                                    beginAtZero: true
                                },
                            }
                        ]
                    }
                }
            })
        chart.setBackgroundColor('color: rgb(0,0,0)').setWidth(750).setHeight(250)
        await chart.toFile('./debugosu/replaygraph.jpg')
        let graphul = await osugame.graph(dataLabel, lifebarF, 'Health', null, null, null, null, null, 'replay')
        let Embed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.score.hex)
            .setAuthor({ name: `${replay.playerName}'s replay`, iconURL: `https://a.ppy.sh/${userid}`, url: `https://osu.ppy.sh/users/${userid}` })
            .setTitle(`Replay`)
            .setThumbnail(mapbg)
            .setDescription(
                `[${fulltitle}](${mapdataid}) ${ifmods}
                    ${replay.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${replay.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x/**${mapcombo}x** | ${accuracy.toFixed(2)}%
                    \`${hitlist}\`
                    ${xpp[0].pp.toFixed(2)}pp | ${xpp[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC 
                    ${ppissue}
                    `
            )
            .setImage(`${await graphul}`);

        message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } })
            .catch(error => { });

        let endofcommand = new Date().getTime();
        let timeelapsed = endofcommand - currentDate.getTime();
        fs.appendFileSync(`logs/cmd/link${message.guildId}.log`, `\nCommand Latency (replay parse) - ${timeelapsed}ms\nID:${absoluteID}\n`)


    }
}