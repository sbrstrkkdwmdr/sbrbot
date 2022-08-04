import fs = require('fs')
import osucalc = require('osumodcalculator')
import replayparse = require('osureplayparser')
import fetch from 'node-fetch';
import { access_token } from '../../configs/osuauth.json';
import ppcalc = require('booba')
import chartjsimg = require('chartjs-to-image');
import cmdchecks = require('../../configs/commandchecks');

module.exports = {
    name: 'replayparse',
    description: 'replayparse',
    execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO) {
        //console.log('true')
        fs.appendFileSync(`link.log`, `LINK DETECT EVENT - replayparse\n${currentDate} ${currentDateISO}\n${message.author.username}#${message.author.discriminator} (${message.author.id}) used osu!score link: ${message.content}\n`, 'utf-8')
        let replay: any;
        try {
            replay = replayparse.parseReplay('./files/replay.osr')
        } catch (err) {
            console.log(err)
            return
        }
        fs.writeFileSync('debugosu/link-replay.json', JSON.stringify(replay, null, 2))

        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/lookup?checksum=${cmdchecks.toHexadecimal(replay.beatmapMD5)}`
        fetch(mapurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any).then(mapdata => {
            fs.writeFileSync('debugosu/link-replay=map.json', JSON.stringify(mapdata, null, 2))
            fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));

            const userurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(replay.playerName)}`

            fetch(userurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any).then(userdata => {

                fs.writeFileSync('debugosu/link-replay=user.json', JSON.stringify(userdata, null, 2))
                let userid: any;
                try {
                    userid = userdata.id
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
                let hitlist: any;
                let accuracy: any;
                switch (gameMode) {
                    case 0:
                        hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
                        accuracy = osucalc.calcgrade(replay.number_300s, replay.number_100s, replay.number_50s, replay.misses).accuracy
                        break;
                    case 1:
                        hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.misses}`
                        accuracy = osucalc.calcgradeTaiko(replay.number_300s, replay.number_100s, replay.misses).accuracy
                        break;
                    case 2:
                        hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
                        accuracy = osucalc.calcgradeCatch(replay.number_300s, replay.number_100s, replay.number_50s, replay.misses).accuracy
                        break;
                    case 3:
                        hitlist = `${replay.gekis}/${replay.number_300s}/${replay.katus}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`
                        accuracy = osucalc.calcgradeMania(replay.gekis, replay.number_300s, replay.katus, replay.number_100s, replay.number_50s, replay.misses).accuracy
                        break;

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
                chart.toFile('./debugosu/replaygraph.jpg').then(() => {
                    (async () => {
                        let Embed = new Discord.EmbedBuilder()
                            .setColor('#0099ff')
                            .setAuthor({ name: `${replay.playerName}'s replay`, iconURL: `https://a.ppy.sh/${userid}`, url: `https://osu.ppy.sh/users/${userid}` })
                            .setTitle(`Replay`)
                            .setThumbnail(mapbg)
                            .setDescription(
                                `[${fulltitle}](${mapdataid}) ${ifmods}
                    ${replay.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${replay.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x/**${mapcombo}x** | ${accuracy.toFixed(2)}%
                    \`${hitlist}\`
                    `
                            )
                            .setImage(`${await chart.getShortUrl()}`);

                        message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } })
                        let endofcommand = new Date().getTime();
                        let timeelapsed = endofcommand - currentDate.getTime();
                        fs.appendFileSync(`link.log`, `\nCommand Latency (replay parse) - ${timeelapsed}ms\n`)
                    })();
                })
            })

        })
    }
}