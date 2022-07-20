import fs = require('fs')
import fetch from 'node-fetch';
import ppcalc = require('booba')
import osucalc = require('osumodcalculator')
import { access_token } from '../configs/osuauth.json';
import emojis = require('../configs/emojis')

module.exports = {
    name: 'scoreparse',
    description: 'scoreparse',
    execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO) {
        let messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')
        let scorelink:any;
        let scoremode:any;
        let scoreid:any;
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
        }).then(res => res.json() as any)
            .then(scoredata => {
                fs.writeFileSync('debugosu/scoreparse.json', JSON.stringify(scoredata, null, 2));
                fs.appendFileSync('link.log', `LINK DETECT EVENT - scoreparse\n${currentDate} ${currentDateISO}\n${message.author.username}#${message.author.discriminator} (${message.author.id}) used osu!score link: ${message.content}\n`, 'utf-8')
                    ;
                (async () => {
                    try {
                        let ranking = scoredata.rank.toUpperCase()
                    } catch (error) {
                        return message.reply({ content: 'This score is unsubmitted/failed and cannot be parsed', allowedMentions: { repliedUser: false } })

                    }
                    let ranking = scoredata.rank ? scoredata.rank : 'f'
                    let scoregrade = emojis.grades.F
                    switch (ranking.toUpperCase()) {
                        case 'F':
                            scoregrade = emojis.grades.F
                            break;
                        case 'D':
                            scoregrade = emojis.grades.D
                            break;
                        case 'C':
                            scoregrade = emojis.grades.C
                            break;
                        case 'B':
                            scoregrade = emojis.grades.B
                            break;
                        case 'A':
                            scoregrade = emojis.grades.A
                            break;
                        case 'S':
                            scoregrade = emojis.grades.S
                            break;
                        case 'SH':
                            scoregrade = emojis.grades.SH
                            break;
                        case 'X':
                            scoregrade = emojis.grades.X
                            break;
                        case 'XH':
                            scoregrade = emojis.grades.XH

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
                        rank: ranking,

                        score_id: '4057765057'
                    }

                    let mode = scoredata.mode
                    let ppfc:any;
                    let hitlist:any;
                    let fcacc:any;
                    let ppiffc:any;
                    let ppissue:any;
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

                    let scorepp = scoredata.pp
                    if (isNaN(scorepp)) {
                        scorepp = 'N/A'
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
                        ${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade}

                        \`${hitlist}\`
                        ${scoredata.max_combo}x
                        ${scorepp}pp | ${ppiffc}pp if ${fcacc} FC\n${ppissue}
                        `)
                    message.reply({ embeds: [scoreembed], allowedMentions: { repliedUser: false } })
                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: scoredata.beatmap.id }), null, 2));

                })();
            })
    }
}