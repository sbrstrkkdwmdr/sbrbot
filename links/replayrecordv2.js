const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const calc = require('ojsama');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const osuReplayParser = require('osureplayparser');
const { linkfetchlogdir } = require('../logconfig.json')
const { danserpath } = require('../config.json')

module.exports = {
    name: 'replayrecordv2',
    description: '',
    execute(exec, linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        try {
            fs.appendFileSync(linkfetchlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(linkfetchlogdir, "\n" + "link detector executed - replayparse")
            let consoleloguserweeee = message.author
            fs.appendFileSync(linkfetchlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(linkfetchlogdir, "\n" + "");
            const replayPath = "./files/replay.osr";
            const replay = osuReplayParser.parseReplay(replayPath);
            fs.writeFileSync("debug/replay.json", JSON.stringify(replay, null, 2))

            let maphash = replay.beatmapMD5
            let playername = replay.playerName
            let timeset = replay.timestamp
            let maxcombo = replay.max_combo
            let hit300s = replay.number_300s
            let hit100s = replay.number_100s
            let hit50s = replay.number_50s
            let misses = replay.misses
            let hitkatu = replay.katus
            let hitgeki = replay.gekis
            let mods = replay.mods.toString()
            let bettertimeset = replay.timestamp.toString().slice(0, 10);
            let gamemode = replay.gameMode

            try {
                let oauthurl = new URL("https://osu.ppy.sh/oauth/token");
                let body1 = {
                    "client_id": osuclientid,
                    "client_secret": osuclientsecret,
                    "grant_type": "client_credentials",
                    "scope": "public"
                }
                fetch(oauthurl, {
                    method: "POST",
                    body: JSON.stringify(body1),
                    headers: { 'Content-Type': 'application/json' }
                })
                    .then(res => res.json())
                    .then(output => fs.writeFileSync("debug/osuauth.json", JSON.stringify(output, null, 2)))
                    ;
                fs.appendFileSync(linkfetchlogdir, "\n" + "writing data to osuauth.json")
                fs.appendFileSync(linkfetchlogdir, "\n" + "")

                const userinfourl = `https://osu.ppy.sh/api/v2/users/${playername}/osu`;

                fetch(userinfourl, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }).then(res => res.json())
                    .then(output2 => {
                        try {
                            const osudata = output2;
                            fs.writeFileSync("debug/osu.json", JSON.stringify(osudata, null, 2));
                            fs.appendFileSync(linkfetchlogdir, "\n" + "writing data to osu.json")
                            fs.appendFileSync(linkfetchlogdir, "\n" + "")
                            console.groupEnd()

                            let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');


                            const mapurlold = ` https://osu.ppy.sh/api/get_beatmaps?k=${osuapikey}&h=${maphash}`
                            const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/lookup?k=${osuapikey}&checksum=${maphash}`
                            //fs.appendFileSync(linkfetchlogdir, "\n" + maphash)
                            fetch(mapurl, {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${access_token}`
                                }
                            })
                                .then(res => res.json())
                                .then(output3 => {
                                    const mapdata = output3;
                                    //fs.appendFileSync(linkfetchlogdir, "\n" + mapdata)
                                    fs.writeFileSync("debug/map.json", JSON.stringify(mapdata, null, 2))
                                    fs.appendFileSync(linkfetchlogdir, "\n" + "writing data to map.json")
                                    fs.appendFileSync(linkfetchlogdir, "\n" + "")
                                    try {
                                        let beatmapid = mapdata.id
                                        let mapbg = mapdata.beatmapset.covers.cover
                                        let mapper = mapdata.beatmapset.creator
                                        let mapperlink = mapper.replaceAll(' ', '%20')
                                        let maptitle = mapdata.beatmapset.title_unicode
                                        let mapdiff = mapdata.version
                                        let mapcs = mapdata.cs
                                        let mapar = mapdata.ar
                                        let mapod = mapdata.accuracy
                                        let maphp = mapdata.drain
                                        let mapsr = mapdata.difficulty_rating
                                        let mapbpm = mapdata.bpm
                                        let mapcircle = mapdata.count_circles
                                        let mapslider = mapdata.count_sliders
                                            //let mapspinner = mapdata.count_spinners *///this causes an error 
                                            ;
                                        (async () => {


                                            let nochokeacc300 = Math.floor(300 * hit300s);
                                            let nochokeacc100 = Math.floor(100 * hit100s);
                                            let nochokeacc50 = Math.floor(50 * hit50s);
                                            let nochoke300num = parseInt(hit300s);
                                            let nochoke100num = parseInt(hit100s);
                                            let nochoke50num = parseInt(hit50s);
                                            let missnum = parseInt(misses);
                                            //let rsnochoke0num = parseInt(rs0s);
                                            let truaccbottom = Math.floor(300 * (nochoke300num + nochoke100num + nochoke50num + missnum));
                                            let nochokebottom1 = Math.floor(nochoke300num + nochoke100num + nochoke50num);
                                            let nochokebottom = Math.floor(nochokebottom1 * 300)
                                            let nochokeacctop = Math.floor(nochokeacc300 + nochokeacc100 + nochokeacc50)
                                            let nochokeacc1 = Math.abs(nochokeacctop / nochokebottom);
                                            let nochokeacc = Math.abs(nochokeacc1 * 100).toFixed(2);
                                            let trueacc = Math.abs((nochokeacctop / truaccbottom) * 100).toFixed(2);

                                            const re = {
                                                playername: playername,
                                                trueacc: trueacc,
                                                maptitle: maptitle,
                                                mapdiff: mapdiff
                                            }
                                            fs.writeFileSync('replaydata.json', JSON.stringify(re, null, 2))

                                            const score = {
                                                beatmap_id: beatmapid,
                                                score: '6795149',
                                                maxcombo: '630',
                                                count50: hit50s,
                                                count100: hit100s,
                                                count300: hit300s,
                                                countmiss: '0',
                                                countkatu: '0',
                                                countgeki: '0',
                                                perfect: '0',
                                                enabled_mods: '0',
                                                user_id: '15222484',
                                                date: '2022-02-08 05:24:54',
                                                rank: 'S',
                                                score_id: '4057765057'
                                            }
                                            const scorenofc = {
                                                beatmap_id: beatmapid,
                                                score: '6795149',
                                                maxcombo: '630',
                                                count50: hit50s,
                                                count100: hit100s,
                                                count300: hit300s,
                                                countmiss: misses,
                                                countkatu: '0',
                                                countgeki: '0',
                                                perfect: '0',
                                                enabled_mods: '0',
                                                user_id: '15222484',
                                                date: '2022-02-08 05:24:54',
                                                rank: 'A',
                                                score_id: '4057765057'
                                            }
                                            fs.writeFileSync("debug/rsppcalc.json", JSON.stringify(score, null, 2));
                                            //let ppfc = new std_ppv2().setPerformance(score);
                                            //let pp =  new std_ppv2().setPerformance(scorenofc);
                                            if (gamemode == '0') {
                                                pp = new std_ppv2().setPerformance(scorenofc)
                                                ppfc = new std_ppv2().setPerformance(score)
                                            }
                                            if (gamemode == '1') {
                                                pp = new taiko_ppv2().setPerformance(scorenofc)
                                                ppfc = new taiko_ppv2().setPerformance(score)
                                            }
                                            if (gamemode == '2') {
                                                pp = new catch_ppv2().setPerformance(scorenofc)
                                                ppfc = new catch_ppv2().setPerformance(score)
                                            }
                                            if (gamemode == '3') {
                                                pp = new mania_ppv2().setPerformance(scorenofc)
                                                ppfc = new mania_ppv2().setPerformance(score)
                                            }
                                            let ppw = await pp.compute();
                                            let ppiffc1 = await ppfc.compute(nochokeacc);
                                            let ppiffc2 = ppiffc1.total
                                            let ppiffcw = Math.abs(ppiffc2).toFixed(2).toString();
                                            let ppiffcfull = Math.abs(ppiffc2).toString(); //fc pp without filters
                                            let ppwtostring = ppw.total.toString()
                                            let ppwrawtotal = ppw.total;
                                            let ppww = Math.abs(ppwrawtotal).toFixed(2);
                                            let ppwfull = Math.abs(ppwrawtotal).toString(); //the pp without filters

                                            let currentDatefileformat = JSON.stringify(currentDate).replaceAll(':', ';').replaceAll('|', '').replaceAll('{', '').replaceAll('"', '').replaceAll('}', '')
                                            //fs.appendFileSync(linkfetchlogdir, "\n" + currentDatefileformat)


                                            let output1 = `${playername}s play at ${bettertimeset} - ${maptitle}[${mapdiff}] - ${ppww}pp - ${ppiffcw} if ${nochokeacc} FC`;
                                            let output = output1.toString().replaceAll(' ', '_').replaceAll('|', '');
                                            //fs.appendFileSync(linkfetchlogdir, "\n" + output)
                                            exec(danserpath + 'danser.exe -skip -settings=' + linkargs + ' -r="files/replay.osr" -out=' + output)
                                            fs.appendFileSync(linkfetchlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
                                            fs.appendFileSync(linkfetchlogdir, "\n" + "command executed - replayrecord")
                                            fs.appendFileSync(linkfetchlogdir, "\n" + "category - osu")
                                            let consoleloguserweeee = message.author
                                            fs.appendFileSync(linkfetchlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                                            fs.appendFileSync(linkfetchlogdir, "\n" + "")
                                            console.groupEnd()
                                            message.channel.send('retrieving osr')
                                        })();
                                        //})//mapdata2
                                    } catch (error) {
                                        fs.appendFileSync(linkfetchlogdir, "\n" + error)
                                        return message.reply('error - map does not exist or is a different version to the osu website')
                                    }
                                })
                        } catch (error) {
                            message.channel.send("Error - 1")
                            fs.appendFileSync(linkfetchlogdir, "\n" + error)
                        }
                    })
            } catch (error) {
                message.channel.send("Error - 2")
                fs.appendFileSync(linkfetchlogdir, "\n" + error)
            }
        } catch (error) {
            message.channel.send("Error - 3\nmap doesn't exist or isn't available")
            fs.appendFileSync(linkfetchlogdir, "\n" + error)
        }
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)