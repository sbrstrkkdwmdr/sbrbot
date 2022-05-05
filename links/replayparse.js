const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const calc = require('ojsama');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const osuReplayParser = require('osureplayparser');
const ChartJsImage = require('chartjs-to-image');
const { linkfetchlogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')

module.exports = {
    name: 'replayparse',
    description: '',
    execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        try {
            fs.appendFileSync(linkfetchlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(linkfetchlogdir, "\n" + "link detector executed - replayparse")
            fs.appendFileSync(linkfetchlogdir, "\n" + "category - osu")
            let consoleloguserweeee = message.author
            fs.appendFileSync(linkfetchlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(linkfetchlogdir, "\n" + "");
            const replayPath = "./files/replay.osr";
            const replay = osuReplayParser.parseReplay(replayPath);
            fs.writeFileSync("debug/replay.json", JSON.stringify(replay, null, 2))

            let lifebar = JSON.stringify(replay, ['life_bar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('life_bar', '');
            let maphash = JSON.stringify(replay, ['beatmapMD5']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmapMD5', '');
            let playername = JSON.stringify(replay, ['playerName']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('playerName', '');
            let timeset = JSON.stringify(replay, ['timestamp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('timestamp', '');
            let maxcombo = JSON.stringify(replay, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
            let hit300s = JSON.stringify(replay, ['number_300s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_300s', '').replaceAll('-', '');
            let hit100s = JSON.stringify(replay, ['number_100s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_100s', '');
            let hit50s = JSON.stringify(replay, ['number_50s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_50s', '');
            let misses = JSON.stringify(replay, ['misses']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('misses', '');
            let hitkatu = JSON.stringify(replay, ['katus']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('katus', '');
            let hitgeki = JSON.stringify(replay, ['gekis']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('gekis', '');
            let mods = JSON.stringify(replay, ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '');
            let bettertimeset = JSON.stringify(replay, ['timestamp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('timestamp', '').slice(0, 10);
            let gamemode = JSON.stringify(replay, ['gameMode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('gameMode', '')

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
                                    let beatmapid = JSON.stringify(mapdata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                                    let mapbg = JSON.stringify(mapdata['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
                                    let mapper = JSON.stringify(mapdata['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('creator', '');
                                    let mapperlink = JSON.stringify(mapper).replaceAll(' ', '%20').replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '')
                                    let maptitle = JSON.stringify(mapdata['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
                                    let maptitlenormal = JSON.stringify(mapdata['beatmapset'], ['title']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title', '');
                                    let mapdiff = JSON.stringify(mapdata, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
                                    let mapcs = JSON.stringify(mapdata, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
                                    let mapar = JSON.stringify(mapdata, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
                                    let mapod = JSON.stringify(mapdata, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
                                    let maphp = JSON.stringify(mapdata, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
                                    let mapsr = JSON.stringify(mapdata, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
                                    let mapbpm = JSON.stringify(mapdata, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
                                    let mapcircle = JSON.stringify(mapdata, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
                                    let mapslider = JSON.stringify(mapdata, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
                                    let mapspinner = JSON.stringify(mapdata, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', '');

                                    fullmaptitle = `${maptitle}`
                                    if (maptitle != maptitlenormal) {
                                        fullmaptitle = `${maptitle} \n${maptitlenormal}`
                                    }
                                    /*const mapurl2 = `https://osu.ppy.sh/api/v2/beatmaps/${beatmapid}`
                                    fetch(mapurl2, {
                                        headers: {
                                            Authorization: `Bearer ${access_token}`
                                        }
                                    })
                                    .then(res => res.json())
                                    .then(output4 => {
                                    const mapdata2 = output4;
                                    let mapbg = JSON.stringify(mapdata2['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
                                    let mapper = JSON.stringify(mapdata2['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('creator', '');
                                    let mapperlink = JSON.stringify(mapper).replaceAll(' ', '%20')
                                    let maptitle = JSON.stringify(mapdata2['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
                                    let mapdiff = JSON.stringify(mapdata2, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
                                    let mapcs = JSON.stringify(mapdata2, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
                                    let mapar = JSON.stringify(mapdata2, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
                                    let mapod = JSON.stringify(mapdata2, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
                                    let maphp = JSON.stringify(mapdata2, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
                                    let mapsr = JSON.stringify(mapdata2, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
                                    let mapbpm = JSON.stringify(mapdata2, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
                                    let mapcircle = JSON.stringify(mapdata2, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
                                    let mapslider = JSON.stringify(mapdata2, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
                                    let mapspinner = JSON.stringify(mapdata2, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', '');
                        */
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

                                    (async () => {

                                        const re = {
                                            playername: playername,
                                            trueacc: trueacc,
                                            maptitle: maptitle,
                                            mapdiff: mapdiff,
                                            mapid: beatmapid
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
                                        let ppiffc2 = JSON.stringify(ppiffc1['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                                        let ppiffcw = Math.abs(ppiffc2).toFixed(2).toString();
                                        let ppiffcfull = Math.abs(ppiffc2).toString(); //fc pp without filters
                                        let ppwtostring = JSON.stringify(ppw['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                                        let ppwrawtotal = ppw['total'];
                                        let ppww = Math.abs(ppwrawtotal).toFixed(2);
                                        let ppwfull = Math.abs(ppwrawtotal).toString(); //the pp without filters
                                        //fs.appendFileSync(linkfetchlogdir, "\n" + ppw)
                                        //fs.appendFileSync(linkfetchlogdir, "\n" + ppfc)

                                        if (ppww != ppiffcw) {
                                            pptotalthingy = `${ppww}**pp**\n${ppiffcw}**pp** if ${nochokeacc}% FC`
                                        }
                                        else {
                                            pptotalthingy = `${ppww}**pp** FC`
                                        }
                                        modsifthere = ''
                                        if (!mods.toUpperCase() == 'NM') {
                                            modsifthere = `+${mods}`
                                        }
                                        if (mods.toUpperCase() == 'NM') {
                                            modsifthere = ''
                                        }

                                        /**
                                        *lifebar
                                        *
                                        *converts hp string into an array for chartjs
                                        */
                                        let lifebar2;

                                        /**
                                 * data 
                                 * - sets column thingies so that chartjs actually shows all the values
                                 */
                                        let data;
                                        lifebar2 = (lifebar.replaceAll('|', ' ')).split(/ +/)
                                        //fs.appendFileSync(linkfetchlogdir, "\n" + lifebar2)
                                        lifebarFULL1 = ''
                                        for (i = 1; i < (lifebar2.length - 1); i++) {
                                            text = lifebar2[i]
                                            lifebarFULL1 += text.substring(0, text.indexOf(',')) + " "
                                        }
                                        lifebarFULL2 = lifebarFULL1.split(/ +/).map(function (item) {
                                            return Math.floor(parseFloat(item, 10) * 100);
                                        });
                                        lifebarFULLEND = lifebarFULL2.pop()
                                        lifebarFULL = lifebarFULL2
                                        fs.appendFileSync(linkfetchlogdir, "\n" + lifebarFULL)

                                        data = 'Start,'
                                        for (i = 0; i < (lifebarFULL.length - 2); i++) {
                                            data += ', '
                                        }
                                        data += 'Finish'
                                        datacount = data.split(',')

                                        let Embed = new Discord.MessageEmbed()
                                            .setColor(0x462B71)
                                            .setTitle(`replay data`)
                                            //.setURL(`https://osu.ppy.sh/b/` + beatmapid)
                                            .setImage('attachment://files/replayhealth.png')
                                            .setThumbnail(mapbg)
                                            .addField('**SCORE INFO**', `[**${playername}**](https://osu.ppy.sh/u/${playerid})\nScore set on ${bettertimeset}\n${hit300s}/${hit100s}/${hit50s}/${misses}\nCombo:**${maxcombo}** | ${trueacc}%`, true)
                                            .addField('**PP**', `${pptotalthingy}`, true)
                                            .addField('**MAP**', `[${fullmaptitle} \n[${mapdiff}]](https://osu.ppy.sh/b/${beatmapid}) ${modsifthere} mapped by [${mapper}](https://osu.ppy.sh/u/${mapperlink})`, false)
                                            .addField('**MAP DETAILS**', "CS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + "\n" + mapsr + "⭐ \n" + mapbpm + "BPM \n<:circle:927478586028474398>" + mapcircle + " <:slider:927478585701330976>" + mapslider + " 🔁" + mapspinner, false)
                                            .setThumbnail(`https://a.ppy.sh/${playerid}`);
                                        const chart = new ChartJsImage();
                                        chart.setConfig({
                                            type: 'line',
                                            data: {
                                                labels: datacount,
                                                datasets: [{
                                                    label: 'Health',
                                                    data: lifebarFULL,
                                                    fill: false,
                                                    borderColor: 'rgb(75, 192, 192)',
                                                    borderWidth: 1,
                                                    pointRadius: 0
                                                }],
                                            },
                                        });
                                        chart.setBackgroundColor('color: rgb(0,0,0)')
                                        //for some reason min and max values are ignored  
                                        chart.toFile('./files/replayhealth.png').then(w => {
                                            let attachement = new Discord.MessageAttachment('./files/replayhealth.png', 'replayhealth.png')
                                            message.reply({ embeds: [Embed], files: ['./files/replayhealth.png'] })
                                        })
                                            .catch(error => {
                                                fs.appendFileSync(linkfetchlogdir, "\n" + error)
                                                fs.appendFileSync(linkfetchlogdir, "\n" + getStackTrace(error))
                                                message.reply({ content: "There was an error creating the health chart", embeds: [Embed], files: ['./files/error.png'] })
                                            })
                                    })()
                                    //})//mapdata2
                                } catch (error) {
                                    fs.appendFileSync(linkfetchlogdir, "\n" + error)
                                    fs.appendFileSync(linkfetchlogdir, "\n" + getStackTrace(error))
                                    message.reply('error - map does not exist or is a different version to the osu website')
                                    console.log(error)
                                }
                            })
                    } catch (error) {
                        message.channel.send("Error - 1")
                        fs.appendFileSync(linkfetchlogdir, "\n" + error)
                        fs.appendFileSync(linkfetchlogdir, "\n" + getStackTrace(error))
                    }
                })
        } catch (error) {
            message.channel.send("Error - 2")
            fs.appendFileSync(linkfetchlogdir, "\n" + error)
            fs.appendFileSync(linkfetchlogdir, "\n" + getStackTrace(error))
        }
    }
}
//client.commands.get('').execute(message, args)