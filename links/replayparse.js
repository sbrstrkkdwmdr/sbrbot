const fs = require('fs')
const osucalc = require('osumodcalculator')
const replayparse = require('osureplayparser')
const fetch = require('node-fetch')
const { access_token } = require('../configs/osuauth.json')
const ppcalc = require('booba')

module.exports = {
    name: 'replayparse',
    description: 'replayparse',
    execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO) {
        //console.log('true')
        fs.appendFileSync('link.log', `LINK DETECT EVENT - replayparse\n${currentDate} ${currentDateISO}\n${message.author.username}#${message.author.discriminator} (${message.author.id}) used osu!score link: ${message.content}\n`, 'utf-8')

        try {
            replay = replayparse.parseReplay('./files/replay.osr')
        } catch (err) {
            console.log(err)
            return
        }
        fs.writeFileSync('debugosu/replay.json', JSON.stringify(replay, null, 2))

        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/lookup?checksum=${replay.beatmapMD5}`
        fetch(mapurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json()).then(mapdata => {
            fs.writeFileSync('debugosu/replaymap.json', JSON.stringify(mapdata, null, 2))
            fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));

            const userurl = `https://osu.ppy.sh/api/v2/users/${replay.playerName}`

            fetch(userurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json()).then(userdata => {

                fs.writeFileSync('debugosu/replayuser.json', JSON.stringify(userdata, null, 2))

                try {
                    userid = userdata.id
                } catch (err) {
                    userid = 0
                    console.log(err)
                    return
                }

                let title = mapdata.beatmapset.title
                let titleuni = mapdata.beatmapset.title_unicode
                let artist = mapdata.beatmapset.artist
                let artistuni = mapdata.beatmapset.artist_unicode

                if (title != titleuni) {
                    title = `${title} (${titleuni})`
                }
                if (artist != artistuni) {
                    artist = `${artist} (${artistuni})`
                }

                let mods = replay.mods
                if (mods != 0) {
                    ifmods = `+${osucalc.ModIntToString(mods)}`
                } else {
                    ifmods = ''
                }
                let gameMode = replay.gameMode
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

                let Embed = new Discord.EmbedBuilder()
                    .setColor('#0099ff')
                    .setAuthor({ name: `${replay.playerName}'s replay`, iconURL: `https://a.ppy.sh/${userid}`, url: `https://osu.ppy.sh/users/${userid}` })
                    .setTitle(`Replay`)
                    .setThumbnail(mapdata.beatmapset.covers['list@2x'])
                    .setDescription(
                        `[${artist} - ${title} [${mapdata.version}]](https://osu.ppy.sh/b/${mapdata.id}) ${ifmods}
                    ${replay.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${replay.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x/**${mapdata.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x** | ${accuracy.toFixed(2)}%
                    \`${hitlist}\`
                    `
                    )

                message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } })

            })

        })
    }
}