const fs = require('fs')
const fetch = require('node-fetch')
const ppcalc = require('booba')
const osucalc = require('osumodcalculator')
const { access_token } = require('../configs/osuauth.json')

module.exports = {
    name: 'scoreparse',
    description: 'scoreparse',
    execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO) {
        let messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')

        try {
            scorelink = messagenohttp.split('/scores/')[1]
            scoremode = scorelink.split('/')[0]
            scoreid = scorelink.split('/')[1]
        } catch (error) {
            return;
        }


        let scoreurl = `https://osu.ppy.sh/api/v2/scores/${scoremode}/${scoreid}`
        fetch(scoreurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json())
            .then(scoredata => {
                fs.writeFileSync('debugosu/scoreparse.json', JSON.stringify(scoredata, null, 2));
                fs.appendFileSync('link.log', `LINK DETECT EVENT - scoreparse\n${currentDate} ${currentDateISO}\n${message.author.username}#${message.author.discriminator} (${message.author.id}) used osu!score link: ${message.content}\n`, 'utf-8')
                    ;
                (async () => {

                    let ranking = scoredata.rank

                    switch (ranking) {
                        case 'F':
                            grade = 'F'
                            break;
                        case 'D':
                            grade = '<:rankingD:927797179534438421>'
                            break;
                        case 'C':
                            grade = '<:rankingC:927797179584757842>'
                            break;
                        case 'B':
                            grade = '<:rankingB:927797179697991700>'
                            break;
                        case 'A':
                            grade = '<:rankingA:927797179739930634>'
                            break;
                        case 'S':
                            grade = '<:rankingS:927797179618295838>'
                            break;
                        case 'SH':
                            grade = '<:rankingSH:927797179710570568>'
                            break;
                        case 'X':
                            grade = '<:rankingX:927797179832229948>'
                            break;
                        case 'XH':
                            grade = '<:rankingxh:927797179597357076>'
                            break;
                    };
                    let gamehits = scoredata.statistics

                    let modint = 0
                    if (scoredata.mods) {
                        modint = osucalc.ModStringToInt(scoredata.mods.join(''))
                    }

                    let score = {
                        beatmap_id: scoredata.beatmap.id,
                        score: '6795149',
                        maxcombo: '630',
                        count50: gamehits.count_50,
                        count100: gamehits.count_100,
                        count300: gamehits.count_300,
                        countmiss: '0',
                        countkatu: gamehits.count_katu,
                        countgeki: gamehits.count_geki,
                        perfect: '1',
                        enabled_mods: modint,
                        user_id: scoredata.user_id,
                        date: '2022-02-08 05:24:54',
                        rank: 'S',
                        score_id: '4057765057'
                    }

                    let mode = scoredata.mode

                    if (mode == 'osu') {
                        ppfc = new ppcalc.std_ppv2().setPerformance(score)
                        hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
                        fcacc = osucalc.calcgrade(gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
                    }
                    if (mode == 'taiko') {
                        ppfc = new ppcalc.taiko_ppv2().setPerformance(score)
                        hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_miss}`
                        fcacc = osucalc.calcgradeTaiko(gamehits.count_300, gamehits.count_100, gamehits.count_miss).accuracy

                    }
                    if (mode == 'fruits') {
                        ppfc = new ppcalc.catch_ppv2().setPerformance(score)
                        hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
                        fcacc = osucalc.calcgradeCatch(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
                    }
                    if (mode == 'mania') {
                        ppfc = new ppcalc.mania_ppv2().setPerformance(score)
                        hitlist = `${gamehits.count_geki}/${gamehits.count_300}/${gamehits.count_katu}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
                        fcacc = osucalc.calcgradeMania(gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
                    }
                    try {
                        let ppfc2 = await ppfc.compute()
                        ppiffc = ppfc2.total.toFixed(2)
                        ppissue = ''
                    } catch (error) {
                        ppiffc = NaN
                        ppissue = 'Error - pp calculator could not fetch beatmap'
                        fs.appendFileSync('commands.log', 'ERROR CALCULATING PERFORMANCE: ' + error)

                    }

                    let artist = scoredata.beatmapset.artist
                    let artistuni = scoredata.beatmapset.artist_unicode
                    let title = scoredata.beatmapset.title
                    let titleuni = scoredata.beatmapset.title_unicode

                    if (artist != artistuni) {
                        artist = `${artist} (${artistuni})`
                    }

                    if (title != titleuni) {
                        title = `${title} (${titleuni})`
                    }

                    let scoreembed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setAuthor({ name: `${scoredata.user.username}`, iconURL: `https://a.ppy.sh/${scoredata.user.id}`, url: `https://osu.ppy.sh/users/${scoredata.user.id}` })
                        .setTitle(`${artist} - ${title}`)
                        .setURL(`https://osu.ppy.sh/b/${scoredata.beatmap.beatmap_id}`)
                        .setThumbnail(`${scoredata.beatmapset.covers['list@2x']}`)
                        .setDescription(`
                        ${(scoredata.accuracy * 100).toFixed(2)}% | ${grade}
                        \`${hitlist}\`
                        ${scoredata.max_combo}x
                        ${scoredata.pp.toFixed(2)}pp | ${ppiffc}pp if ${fcacc} FC\n${ppissue}
                        `)
                    message.reply({ embeds: [scoreembed], allowedMentions: { repliedUser: false } })
                })();
            })
    }
}