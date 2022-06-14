const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const { linkfetchlogdir } = require('../logconfig.json')
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { calculateStarRating } = require('osu-sr-calculator')
const { getStackTrace } = require('../somestuffidk/log')

module.exports = {
    name: 'osuscorelink',
    description: 'Returns score information from the link given',
    execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,) {
        let mode = 'osu' //osu, fruits, taiko, mania
        if (linkargs[0].includes('osu')) {
            mode = 'osu'
        }
        if (linkargs[0].includes('fruits') || linkargs[0].includes('catch')) {
            mode = 'fruits'
        }
        if (linkargs[0].includes('taiko')) {
            mode = 'taiko'
        }
        if (linkargs[0].includes('mania')) {
            mode = 'mania'
        }
        let pickeduserX = linkargs[0].replace('https://', '').replace('osu.ppy.sh/scores/', '').replace('osu/', '').replace('fruits/', '').replace('taiko/', '').replace('mania/', '')

        //fs.appendFileSync(linkfetchlogdir, "\n" + w)
        fs.appendFileSync(linkfetchlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(linkfetchlogdir, "\n" + "command executed - osu score link")
        fs.appendFileSync(linkfetchlogdir, "\n" + "category - osu")
        let consoleloguserweeee = message.author
        fs.appendFileSync(linkfetchlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(linkfetchlogdir, "\n" + "")
        //if(!pickeduserX) return message.reply("user ID required");
        //if(isNaN(pickeduserX)) return message.reply("You must use ID e.g. 15222484 instead of SaberStrike")

        const getscoreurl = `https://osu.ppy.sh/api/v2/scores/${mode}/${pickeduserX}`;

        fetch(getscoreurl, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.json())
            .then(output2 => {
                try {
                    const scoredata = output2;
                    fs.writeFileSync("debug/score.json", JSON.stringify(scoredata, null, 2));
                    fs.appendFileSync(linkfetchlogdir, "\n" + "writing data to score.json")
                    fs.appendFileSync(linkfetchlogdir, "\n" + "")

                    let playername = scoredata.user.username.toString()
                    let playerid = scoredata.user.id
                    let hitmax = scoredata.statistics.count_geki
                    let hit300 = scoredata.statistics.count_300
                    let hit200 = scoredata.statistics.count_katu
                    let hit100 = scoredata.statistics.count_100
                    let hit50 = scoredata.statistics.count_50
                    let hit0 = scoredata.statistics.count_miss
                    let timeset = scoredata.created_at
                    let mapid = scoredata.beatmap.id
                    let maptitle = scoredata.beatmapset.title.toString()
                    let maptitleunicode = scoredata.beatmapset.title_unicode.toString()
                    let mapdiff = scoredata.beatmap.version.toString()
                    let scoremods = scoredata.mods.toString()
                    let scorepp = scoredata.pp
                    let acc = scoredata.accuracy
                    let scorecombo = scoredata.max_combo
                    let fc = scoredata.perfect
                    let grade = scoredata.rank
                    let mapsr = scoredata.beatmap.difficulty_rating
                    let mapbg = scoredata.beatmapset.covers.cover.toString()

                    if (maptitle != maptitleunicode) {
                        mapname = `${maptitleunicode}\n${maptitle}`
                    }
                    else {
                        mapname = maptitle
                    }

                    const fileName = 'debug/storedmap.json';
                    const file = require('../debug/storedmap.json');
                    file.prevmap = mapid;
                    fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                        if (err) return fs.appendFileSync(linkfetchlogdir, "\n" + err);
                        fs.appendFileSync(linkfetchlogdir, "\n" + JSON.stringify(file));
                        fs.appendFileSync(linkfetchlogdir, "\n" + 'writing to ' + fileName);
                        fs.appendFileSync(linkfetchlogdir, "\n" + "");
                        console.groupEnd()
                    });
                    (async () => {
                        const score = {
                            beatmap_id: mapid,
                            score: '6795149',
                            maxcombo: '630',
                            count50: hit50,
                            count100: hit100,
                            count300: hit300,
                            countmiss: '0',
                            countkatu: hitmax,
                            countgeki: hit200,
                            perfect: '0',
                            enabled_mods: '64',
                            user_id: playerid,
                            date: '2022-02-08 05:24:54',
                            rank: 'S',
                            score_id: '4057765057'
                        }
                        const scorenofc = {
                            beatmap_id: mapid,
                            score: '6795149',
                            maxcombo: '630',
                            count50: hit50,
                            count100: hit100,
                            count300: hit300,
                            countmiss: hit0,
                            countkatu: hitmax,
                            countgeki: hit200,
                            perfect: '0',
                            enabled_mods: '64',
                            user_id: playerid,
                            date: '2022-02-08 05:24:54',
                            rank: 'S',
                            score_id: '4057765057'
                        }
                        let tdmods = scoremods.replace('TD');
                        let ppfc = new std_ppv2().setPerformance(score);
                        let pp = new std_ppv2().setPerformance(scorenofc);
                        if (mode == 'osu') {
                            if (scoremods) {
                                pp = new std_ppv2().setPerformance(scorenofc).setMods(`${tdmods}`)
                                ppfc = new std_ppv2().setPerformance(score).setMods(`${tdmods}`)
                                /*pptd = new std_ppv2().setPerformance(scorenofc).setMods(`${tdmods}`)
                                ppfctd = new std_ppv2().setPerformance(score).setMods(`${tdmods}`)*/
                            }
                            if (!scoremods) {
                                pp = new std_ppv2().setPerformance(scorenofc).setMods('NM')
                                ppfc = new std_ppv2().setPerformance(score).setMods('NM')
                            }
                        }
                        if (mode == 'taiko') {
                            if (scoremods) {
                                pp = new taiko_ppv2().setPerformance(scorenofc).setMods(`${scoremods}`)
                                ppfc = new taiko_ppv2().setPerformance(score).setMods(`${scoremods}`)
                            }
                            if (!scoremods) {
                                pp = new taiko_ppv2().setPerformance(scorenofc).setMods('NM')
                                ppfc = new taiko_ppv2().setPerformance(score).setMods('NM')
                            }
                        }
                        if (mode == 'fruits') {
                            if (scoremods) {
                                pp = new catch_ppv2().setPerformance(scorenofc).setMods(`${scoremods}`)
                                ppfc = new catch_ppv2().setPerformance(score).setMods(`${scoremods}`)
                            }
                            if (!scoremods) {
                                pp = new catch_ppv2().setPerformance(scorenofc).setMods('NM')
                                ppfc = new catch_ppv2().setPerformance(score).setMods('NM')
                            }
                        }
                        if (mode == 'mania') {
                            if (scoremods) {
                                pp = new mania_ppv2().setPerformance(scorenofc).setMods(`${scoremods}`)
                                ppfc = new mania_ppv2().setPerformance(score).setMods(`${scoremods}`)
                            }
                            if (!scoremods) {
                                pp = new mania_ppv2().setPerformance(scorenofc).setMods('NM')
                                ppfc = new mania_ppv2().setPerformance(score).setMods('NM')
                            }
                        }
                        ppw = await pp.compute();
                        ppiffc1 = await ppfc.compute();

                        ppiffc2 = ppiffc1.total
                        ppiffcw = Math.abs(ppiffc2).toFixed(2).toString();
                        ppiffcfull = Math.abs(ppiffc2).toString(); //fc pp without filters
                        ppwtostring = ppw.total.toString()
                        ppwrawtotal = ppw.total
                        ppww = Math.abs(ppwrawtotal).toFixed(2);
                        ppwfull = Math.abs(ppwrawtotal).toString(); //the pp without filters   


                        fcflag = '**FC**'
                        if (fc == false) {
                            fcflag = `| **${ppiffcw}**pp IF FC`
                        }
                        if (fc == true) {
                            fcflag = '**FC**'
                        }

                        if (grade == 'xh' || grade == 'XH') {
                            grade = '<:rankingxh:927797179597357076>'
                        }
                        if (grade == 'x' || grade == 'X') {
                            grade = '<:rankingX:927797179832229948>'
                        }
                        if (grade == 'sh' || grade == 'SH') {
                            grade = '<:rankingSH:927797179710570568>'
                        }
                        if (grade == 's' || grade == 'S') {
                            grade = '<:rankingS:927797179618295838>'
                        }
                        if (grade == 'a' || grade == 'A') {
                            grade = '<:rankingA:927797179739930634>'
                        }
                        if (grade == 'b' || grade == 'B') {
                            grade = '<:rankingB:927797179697991700>'
                        }
                        if (grade == 'c' || grade == 'C') {
                            grade = '<:rankingC:927797179584757842>'
                        }
                        if (grade == 'd' || grade == 'D') {
                            grade = '<:rankingD:927797179534438421>'
                        }
                        if (grade == 'f' || grade == 'F') {
                            grade = '🇫'
                        }
                        if (mode == 'osu') {
                            hitlist = `**300:** ${hit300} \n**100:** ${hit100} \n**50:** ${hit50} \n**X:** ${hit0}`
                        }
                        if (mode == 'taiko') {
                            hitlist = `**300(GREAT):** ${hit300} \n**100(GOOD):** ${hit100} \n**X:** ${hit0}`
                        }
                        if (mode == 'fruits') {
                            hitlist = `**300(Fruits):**${hit300} \n**100(Drops):**${hit100} \n**50(Droplets):**${hit50} \n**X:**${hit0}`
                        }
                        if (mode == 'mania') {
                            hitlist = `**300+**:${hitmax} \n**300:** ${hit300} \n**200:** ${hit200} \n**100:** ${hit100} \n**50:** ${hit50} \n**X:** ${hit0}`
                        }
                        if (scoremods) {
                            modsz = `**+${scoremods}**`
                        }
                        if (!scoremods || scoremods == 'null') {
                            modsz = ''
                        }
                        if (scorepp == 'null' || !scorepp) {
                            finalscorepp = ppww
                        }
                        if (scorepp) {
                            finalscorepp = parseFloat(scorepp).toFixed(2)
                        }
                        if (scoremods) {
                            calcmods = scoremods.replace('TD', '')
                            modtoarray1 = calcmods.replace(/(.{2})/g, "$1 ");
                            modtoarray2 = modtoarray1.slice(0, -1)
                            modsforsr = modtoarray2.split(/ +/)
                            starRating = await calculateStarRating(mapid, modsforsr);
                            SR = JSON.stringify(starRating).replace('{', '').replace(':', '').replace('}', '').replace(calcmods, '').replace('nomod', '').replaceAll('"', '')
                            SRclean = Math.abs(SR).toFixed(2)
                        }
                        if (!scoremods || scoremods == 'TD') {
                            SRclean = mapsr
                        }
                        let embed = new Discord.MessageEmbed()
                            .setTitle('Score Information')
                            .setAuthor(`Set by ${playername}`, `https://a.ppy.sh/${playerid}`, `https://osu.ppy.sh/u/${playerid}`)
                            .setURL(`https://osu.ppy.sh/scores/${mode}/${pickeduserX}`)
                            .addField('MAP DETAILS', `**[${mapname} [${mapdiff}]](https://osu.ppy.sh/b/${mapid})** ${modsz} ${SRclean}⭐`, false)
                            .addField('SCORE DETAILS', `**${(acc * 100).toFixed(2)}%** | ${grade}\n${hitlist}\n**${scorecombo}x**`, false)
                            .addField('PP', `**${finalscorepp}**pp ${fcflag}`, false)
                            .setImage(mapbg)
                            ;
                        message.reply({ embeds: [embed] })
                    })();
                } catch (error) {
                    message.reply("Error - account not found (or some other error)")
                    fs.appendFileSync(linkfetchlogdir, "\n" + "Error account not found")
                    fs.appendFileSync(linkfetchlogdir, "\n" + error)
                    fs.appendFileSync(linkfetchlogdir, "\n" + getStackTrace(error))
                    fs.appendFileSync(linkfetchlogdir, "\n" + "")
                    console.log(error)
                }
            });
        //        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
console.groupEnd()
//client.commands.get('').execute(message, args)