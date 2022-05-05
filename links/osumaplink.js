const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { linkfetchlogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')

module.exports = {
    name: 'osumaplink',
    description: '',
    execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        if (message.content.includes("mania") || message.content.includes("fruits") || message.content.includes("taiko")) return;
        const w = JSON.stringify(linkargs[0]).replaceAll("https", '').replaceAll(":", "").replaceAll("//", '').replaceAll('osu.ppy.sh', '').replaceAll('beatmaps').replaceAll('b').replaceAll('/', '').replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').replaceAll('undefined', '');
        const pickeduserX = w;
        fs.appendFileSync(linkfetchlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(linkfetchlogdir, "\n" + "link detector executed - map get (short)")
        fs.appendFileSync(linkfetchlogdir, "\n" + "category - osu")
        let consoleloguserweeee = message.author
        fs.appendFileSync(linkfetchlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(linkfetchlogdir, "\n" + "");
        const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${pickeduserX}`;
        const { access_token } = require('../debug/osuauth.json');

        fetch(mapurl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        }).then(res => res.json())
            .then(output2 => {
                const mapdata = output2;
                //let mapdataP2 = JSON.stringify("[\n" + mapdataP1 + "\n]");
                //const mapdata = JSON.stringify("[\n" + mapdataP1 + "\n]");
                fs.writeFileSync("debug/map.json", JSON.stringify(mapdata, null, 2))
                try {
                    let mapbg = JSON.stringify(mapdata['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');;
                    let maplink = JSON.stringify(mapdata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                    let mapsetlink = JSON.stringify(mapdata, ['beatmapset_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmapset_id', '');
                    let mapcs = JSON.stringify(mapdata, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
                    let mapar = JSON.stringify(mapdata, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
                    let mapod = JSON.stringify(mapdata, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
                    let maphp = JSON.stringify(mapdata, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
                    let mapsr = JSON.stringify(mapdata, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
                    let mapbpm = JSON.stringify(mapdata, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
                    let mapcircle = JSON.stringify(mapdata, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
                    let mapslider = JSON.stringify(mapdata, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
                    let mapspinner = JSON.stringify(mapdata, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', '');
                    let mapper = JSON.stringify(mapdata['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('creator', '');
                    let maptitleuni = JSON.stringify(mapdata['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
                    let maptitlenorm = JSON.stringify(mapdata['beatmapset'], ['title']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title', '');
                    let maptitle = maptitleuni
                    if (maptitlenorm != maptitleuni) {
                        maptitle = `${maptitleuni}\n${maptitlenorm}`
                    } let mapdiff = JSON.stringify(mapdata, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
                    let mapartist = JSON.stringify(mapdata['beatmapset'], ['artist']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('artist', '');
                    let mapmode = JSON.stringify(mapdata, ['mode']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('mode', '');
                    let mapmaxcombo = JSON.stringify(mapdata, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('max_combo', '');
                    let maplength = JSON.stringify(mapdata, ['total_length']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('total_length', '');
                    let maphitonly = JSON.stringify(mapdata, ['hit_length']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('hit_length', '');
                    let mapperlink = JSON.stringify(mapper).replaceAll(' ', '%20').replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '');

                    let maphit1 = Math.floor(maphitonly / 60);
                    let maphit2 = Math.abs(maphitonly % 60);
                    if (maphit2 < 10) {
                        maphit2 = '0' + maphit2
                    }
                    let mapplaylength = maphit1 + ':' + maphit2;
                    let mapmaxcombotoint = Math.abs(mapmaxcombo);
                    let mapmiss = Math.abs(0)
                    let topacc = Math.abs(100.00)
                    let midacc = Math.abs(95.00)
                    let slidertonum = Math.abs(mapcircle)
                    let circletonum = Math.abs(mapslider)
                    let totalobjcount = Math.abs(mapcircle + mapslider + mapspinner)
                    let aimstars = 1
                    let speedstars = 1

                    let mapstatus = JSON.stringify(mapdata, ['status']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('status', '');
                    if (mapstatus == 'ranked') {
                        statusimg = '<:statusranked:944512775579926609>';
                    }
                    if (mapstatus == 'approved' || mapstatus == 'qualified') {
                        statusimg = '<:statusapproved:944512764913811467>'
                    }
                    if (mapstatus == 'loved') {
                        statusimg = '<:statusloved:944512775810588733>'
                    }
                    if (mapstatus == 'graveyard' || mapstatus == 'pending') {
                        statusimg = '<:statusgraveyard:944512765282897940>'
                    }
                    if (mapmode == 'osu') {
                        mapimg = '<:modeosu:944181096868884481>'
                    }
                    if (mapmode == 'taiko') {
                        mapimg = '<:modetaiko:944181097053442068>'
                    }
                    if (mapmode == 'fruits') {
                        mapimg = '<:modefruits:944181096206176326>'
                    }
                    if (mapmode == 'mania') {
                        mapimg = '<:modemania:944181095874834453>'
                    }


                    const fileName = 'debug/storedmap.json';
                    const file = require('../debug/storedmap.json');
                    file.prevmap = maplink;
                    fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                        if (err) return fs.appendFileSync(linkfetchlogdir, "\n" + err);
                        fs.appendFileSync(linkfetchlogdir, "\n" + JSON.stringify(file));
                        fs.appendFileSync(linkfetchlogdir, "\n" + 'writing to ' + fileName);
                        fs.appendFileSync(linkfetchlogdir, "\n" + "");
                    });//all this stuff is to write it to a temporary save file
                    (async () => {

                        const score = {
                            beatmap_id: maplink,
                            score: '6795149',
                            maxcombo: mapmaxcombo,
                            count50: '0',
                            count100: '0',
                            count300: '374',
                            countmiss: '0',
                            countkatu: '0',
                            countgeki: '0',
                            perfect: '0',
                            enabled_mods: '0',
                            user_id: '13780464',
                            date: '2022-02-08 05:24:54',
                            rank: 'S',
                            score_id: '4057765057'
                        }
                        //const score = scorew
                        const score95 = {
                            beatmap_id: maplink,
                            score: '6795149',
                            maxcombo: mapmaxcombo,
                            count50: '0',
                            count100: '30',
                            count300: '374',
                            countmiss: '0',
                            countkatu: '0',
                            countgeki: '0',
                            perfect: '0',
                            enabled_mods: '0',
                            user_id: '13780464',
                            date: '2022-02-08 05:24:54',
                            rank: 'S',
                            score_id: '4057765057'
                        }
                        let pp = new std_ppv2().setPerformance(score)
                        let ppcalc95 = new std_ppv2().setPerformance(score95)
                        let mapimg = '<:modeosu:944181096868884481>'
                        if (mapmode == 'osu') {
                            pp = new std_ppv2().setPerformance(score)
                            ppcalc95 = new std_ppv2().setPerformance(score95)
                            mapimg = '<:modeosu:944181096868884481>'
                        }
                        if (mapmode == 'taiko') {
                            pp = new taiko_ppv2().setPerformance(score)
                            ppcalc95 = new taiko_ppv2().setPerformance(score95)
                            mapimg = '<:modetaiko:944181097053442068>'
                        }
                        if (mapmode == 'fruits') {
                            pp = new catch_ppv2().setPerformance(score)
                            ppcalc95 = new catch_ppv2().setPerformance(score95)
                            mapimg = '<:modefruits:944181096206176326>'
                        }
                        if (mapmode == 'mania') {
                            pp = new mania_ppv2().setPerformance(score)
                            ppcalc95 = new mania_ppv2().setPerformance(score95)
                            mapimg = '<:modemania:944181095874834453>'
                        }
                        let ppSSjson = await pp.compute();
                        let pp95json = await ppcalc95.compute();

                        let ppSSstr = parseFloat(JSON.stringify(ppSSjson['total'])).toFixed(2);
                        let pp95str = parseFloat(JSON.stringify(pp95json['total'])).toFixed(2);

                        let userinfourl = `https://osu.ppy.sh/api/v2/users/${mapperlink}/osu`
                        fetch(userinfourl, {
                            headers: {
                                Authorization: `Bearer ${access_token}`
                            }
                        }).then(res => res.json())
                            .then(output3 => {
                                let mapperid = JSON.stringify(output3, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                                let Embed = new Discord.MessageEmbed()
                                    .setColor(0x91FF9A)
                                    .setTitle(`${mapartist} - ${maptitle} [${mapdiff}]`)
                                    .setAuthor(`${mapper}`, `https://a.ppy.sh/${mapperid}`, `https://osu.ppy.sh/u/${mapperlink}`)
                                    .setURL(`https://osu.ppy.sh/b/${maplink}`)
                                    .setImage(mapbg)
                                    .addField('**MAP DETAILS**', `${statusimg} | ${mapimg} \n` + "CS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + "\n" + mapsr + "⭐ \n" + mapbpm + "BPM \n<:circle:927478586028474398>" + mapcircle + " <:slider:927478585701330976>" + mapslider + " 🔁" + mapspinner + `\n🕐${mapplaylength}`, true)
                                    .addField('**PP VALUES**', `\nSS: ${ppSSstr} \n95: ${pp95str}`, true)
                                    .addField('**DOWNLOAD**', `[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`, true)
                                message.reply({ embeds: [Embed] })
                                console.groupEnd()
                                console.groupEnd()
                                console.groupEnd()
                            })
                    })();

                    //})
                } catch (error) {
                    message.reply("error")
                    fs.appendFileSync(linkfetchlogdir, "\n" + error)
                    fs.appendFileSync(linkfetchlogdir, "\n" + getStackTrace(error))
                    fs.appendFileSync(linkfetchlogdir, "\n" + "")
                    console.groupEnd()
                    console.groupEnd()
                    console.groupEnd()
                }


                /*	let { version } = require('../map.json');
                    let { cover } = require('../map.json');
                    let { url }
                    fs.appendFileSync(linkfetchlogdir, "\n" + version)*/



                /*   let Embed = new Discord.MessageEmbed()
               .setColor(0x462B71)
               .setTitle("Information for " + maptitle)
               .setImage(mapbg)
               .setDescription(``);
               message.reply({ embeds: [Embed]})*/
            });

    }
}
console.groupEnd()
//client.commands.get('').execute(message, args)