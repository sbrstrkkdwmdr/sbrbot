import fs = require('fs')
import fetch from 'node-fetch';
import ppcalc = require('booba')
import osucalc = require('osumodcalculator')
import { access_token } from '../../configs/osuauth.json';
import emojis = require('../../configs/emojis');
import cmdchecks = require('../../configs/commandchecks');
import osugame = require('../../configs/osugame');

module.exports = {
    name: 'scoreparse',
    description: 'scoreparse',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
            `
----------------------------------------------------
LINK PARSE EVENT - score parse
${currentDate} | ${currentDateISO}
recieved score link
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')

        let messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')
        let scorelink: any;
        let scoremode: any;
        let scoreid: any;
        try {
            scorelink = messagenohttp.split('/scores/')[1]
            scoremode = scorelink.split('/')[0]
            scoreid = scorelink.split('/')[1]
        } catch (error) {
            return;
        }


        let scoreurl = `https://osu.ppy.sh/api/v2/scores/${cmdchecks.toHexadecimal(scoremode)}/${cmdchecks.toHexadecimal(scoreid)}`
        const scoredata = await fetch(scoreurl, {
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
                }
                fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error: ${error}
----------------------------------------------------
`, 'utf-8')
            })

        fs.writeFileSync(`debugosu/link-scoreparse=scoredata=${message.guildId}.json`, JSON.stringify(scoredata, null, 2));
        fs.appendFileSync(`logs/cmd/link${message.guildId}.log`, `\nLINK DETECT EVENT - scoreparse\n${currentDate} ${currentDateISO}\n${message.author.username}#${message.author.discriminator} (${message.author.id}) used osu!score link: ${message.content}\nID:${absoluteID}\n`, 'utf-8')
            ;
        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(scoredata.beatmap.id)}`

            ;
        (async () => {
            try {
                let ranking = scoredata.rank.toUpperCase()
            } catch (error) {
                return message.reply({ content: 'This score is unsubmitted/failed/invalid and cannot be parsed', allowedMentions: { repliedUser: false } })

            }
            let mapdata = await fetch(mapurl, {
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
                    }
                    fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                        `
----------------------------------------------------
cmd ID: ${absoluteID}
Error: ${error}
----------------------------------------------------
`, 'utf-8')
                })
            fs.appendFileSync('debugosu/link-scoreparse=map.json', JSON.stringify(mapdata, null, 2));

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

            let mode = scoredata.mode
            let ppfc: any;
            let hitlist: any;
            let fcacc: any;
            let ppiffc: any;
            let ppissue: any;
            if (mode == 'osu') {
                hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
                fcacc = osucalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
            }
            if (mode == 'taiko') {
                hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_miss}`
                fcacc = osucalc.calcgradeTaiko(gamehits.count_300, gamehits.count_100, gamehits.count_miss).accuracy

            }
            if (mode == 'fruits') {
                hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
                fcacc = osucalc.calcgradeCatch(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_katu, gamehits.count_miss).accuracy
            }
            if (mode == 'mania') {
                hitlist = `${gamehits.count_geki}/${gamehits.count_300}/${gamehits.count_katu}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
                fcacc = osucalc.calcgradeMania(gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
            }
            let ppcalcing;
            try {
                ppcalcing = await osugame.scorecalc(scoredata.mods.join('').length > 1 ? scoredata.mods.join('') : 'NM', scoredata.mode, scoredata.beatmap.id, gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, gamehits.count_miss, scoredata.accuracy, scoredata.max_combo, scoredata.score, 0)
                ppissue = ''
                fs.writeFileSync(`debugosu/link-scoreparse=ppcalc=${obj.guildId}.json`, JSON.stringify(ppcalcing, null, 2));
            } catch (error) {
                ppcalcing = [{
                    pp: 0.000
                }, {
                    pp: 0.000
                }]
                ppissue = 'Error - pp calculator could not fetch beatmap'
                fs.appendFileSync(`logs/cmd/link${message.guildId}.log`, 'ERROR CALCULATING PERFORMANCE: ' + error)

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

            let scoreembed = new Discord.EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({ name: `${scoredata.user.username}`, iconURL: `https://a.ppy.sh/${scoredata.user.id}`, url: `https://osu.ppy.sh/users/${scoredata.user.id}` })
                .setTitle(`${artist} - ${title}`)
                .setURL(`https://osu.ppy.sh/b/${scoredata.beatmap.id}`)
                .setThumbnail(`${scoredata.beatmapset.covers['list@2x']}`)
                .setDescription(`
                        ${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade}

                        \`${hitlist}\`
                        ${scoredata.max_combo}x
                        ${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC\n${ppissue}
                        `)
            message.reply({ embeds: [scoreembed], allowedMentions: { repliedUser: false } })
            fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: scoredata.beatmap.id }), null, 2));
            let endofcommand = new Date().getTime();
            let timeelapsed = endofcommand - currentDate.getTime();
            fs.appendFileSync(`logs/cmd/link${message.guildId}.log`, `\nCommand Latency (score parse) - ${timeelapsed}ms\nID:${absoluteID}\n`)
        })();

    }
}