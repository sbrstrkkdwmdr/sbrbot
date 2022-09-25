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
import def = require('../../src/consts/defaults');

module.exports = {
    name: 'scoreparse',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let scorelink: string;
        let scoremode: string;
        let scoreid: number | string;


        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                scorelink = null;
                scoremode = args[1] ?? 'osu';
                scoreid = args[0];
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
                const messagenohttp = obj.content.replace('https://', '').replace('http://', '').replace('www.', '')
                try {
                    scorelink = messagenohttp.split('/scores/')[1]
                    scoremode = scorelink.split('/')[0]
                    scoreid = scorelink.split('/')[1]
                } catch (error) {
                    return;
                }
            }
        }


        //==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'scoreparse',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'Score Link',
                    value: `${scorelink}`
                },
                {
                    name: 'Score Mode',
                    value: `${scoremode}`
                },
                {
                    name: 'Score ID',
                    value: `${scoreid}`
                }
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const scoredata: osuApiTypes.Score = await osufunc.apiget('score', `${scoreid}`, `${scoremode}`)
        if (scoredata?.error) {
            if (commandType != 'button' && commandType != 'link') {
                obj.reply({
                    content: 'Error - could not fetch score data',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()

            }
            return;
        }
        try {
            if (typeof scoredata?.error != 'undefined') {
                obj.reply({ content: 'This score is unsubmitted/failed/invalid and cannot be parsed', allowedMentions: { repliedUser: false } })
                    .catch();
                return;
            }
        } catch (error) {
        }

        if (commandType == 'interaction') {
            obj.reply({ content: "Loading...", allowedMentions: { repliedUser: false } })
                .catch();

        }

        osufunc.debug(scoredata, 'command', 'scoreparse', obj.guildId, 'scoreData');
        try {
            scoredata.rank.toUpperCase();
        } catch (error) {
            obj.reply({ content: 'This score is unsubmitted/failed/invalid and cannot be parsed', allowedMentions: { repliedUser: false } })
                .catch();
            return;
        }
        const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${scoredata.beatmap.id}`)
        fs.appendFileSync('debug/command-scoreparse=map.json', JSON.stringify(mapdata, null, 2));

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
        }

        const ranking = scoredata.rank ? scoredata.rank : 'f'
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
        }
        const gamehits = scoredata.statistics

        const mode = scoredata.mode
        let hitlist: string;
        let fcacc: number;
        let ppissue: string;

        if (mode == 'osu') {
            hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
            fcacc = osumodcalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
        }
        if (mode == 'taiko') {
            hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_miss}`
            fcacc = osumodcalc.calcgradeTaiko(gamehits.count_300, gamehits.count_100, gamehits.count_miss).accuracy

        }
        if (mode == 'fruits') {
            hitlist = `${gamehits.count_300}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
            fcacc = osumodcalc.calcgradeCatch(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_katu, gamehits.count_miss).accuracy
        }
        if (mode == 'mania') {
            hitlist = `${gamehits.count_geki}/${gamehits.count_300}/${gamehits.count_katu}/${gamehits.count_100}/${gamehits.count_50}/${gamehits.count_miss}`
            fcacc = osumodcalc.calcgradeMania(gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy
        }
        let ppcalcing;
        try {
            ppcalcing = await osufunc.scorecalc({
                mods: scoredata.mods.join('').length > 1 ?
                    scoredata.mods.join('') : 'NM',
                gamemode: scoredata.mode,
                mapid: scoredata.beatmap.id,
                miss: gamehits.count_miss,
                acc: scoredata.accuracy,
                maxcombo: scoredata.max_combo,
                score: scoredata.score,
                calctype: 0,
                passedObj: 0,
                failed: false
            })

            ppissue = '';
            osufunc.debug(ppcalcing, 'command', 'scoreparse', obj.guildId, 'ppCalcing');
        } catch (error) {
            ppcalcing = [{
                pp: 0.000
            }, {
                pp: 0.000
            }]
            ppissue = 'Error - pp calculator could not fetch beatmap'
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, 'ERROR CALCULATING PERFORMANCE: ' + error)

        }

        let artist = scoredata.beatmapset.artist
        const artistuni = scoredata.beatmapset.artist_unicode
        let title = scoredata.beatmapset.title
        const titleuni = scoredata.beatmapset.title_unicode

        if (artist != artistuni) {
            artist = `${artist} (${artistuni})`
        }

        if (title != titleuni) {
            title = `${title} (${titleuni})`
        }
        let pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC`

        if (scoredata.accuracy == 1) {
            if (scoredata.perfect == true) {
                pptxt = `${ppcalcing[0].pp.toFixed(2)}pp`
            } else {
                pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC`
            }
        } else {
            if (scoredata.perfect == true) {
                pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[2].pp.toFixed(2)}pp if SS`
            } else {
                pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC | ${ppcalcing[2].pp.toFixed(2)}pp if SS`
            }
        }

        const osudata = await osufunc.apiget('user', `${scoredata.user.username}`);
        osufunc.debug(osudata, 'command', 'scoreparse', obj.guildId, 'osuData')
        if (osudata?.error) {
            if (commandType != 'button' && commandType != 'link') {
                if (commandType == 'interaction') {
                    setTimeout(() => {
                        obj.editReply({
                            content: 'Error - could not fetch user data',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }, 1000)
                } else {
                    obj.reply({
                        content: 'Error - could not fetch user data',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
            }
            return;
        }
        const scoreembed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.score.dec)
            .setAuthor({
                name: `${osudata.username} (#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp)`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${osudata?.avatar_url ?? def.images.any.url}`
            })
            .setTitle(`${artist} - ${title}`)
            .setURL(`https://osu.ppy.sh/b/${scoredata.beatmap.id}`)
            .setThumbnail(`${scoredata.beatmapset.covers['list@2x']}`)
            .setDescription(`${scoredata.rank_global ? `\n#${scoredata.rank_global} global` : ''} ${scoredata.replay ? `| [REPLAY](https://osu.ppy.sh/scores/${scoredata.mode}/${scoredata.id}/download)` : ''}
${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade} ${scoredata.mods.join('').length > 1 ? '| ' + scoredata.mods.join('') : ''}
${new Date(scoredata.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '')} | <t:${Math.floor(new Date(scoredata.created_at).getTime() / 1000)}:R>
\`${hitlist}\`
${scoredata.max_combo}x/**${mapdata.max_combo}x**
${pptxt}\n${ppissue}
`)

        osufunc.writePreviousId('score', obj.guildId, JSON.stringify(scoredata, null, 2))
        osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`);

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [scoreembed],
                    files: [],
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
                        embeds: [],
                        files: [],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000)
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
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
                    embeds: [scoreembed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
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