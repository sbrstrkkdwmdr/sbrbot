const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { osulogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')


module.exports = {
    name: 'pp',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        const pickeduserX = args[0];
        if (args[1]) {
            modsmaybe = args[1];
        }
        //fs.appendFileSync(osulogdir, "\n" + args[1])

        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - map pp")
        let consoleloguserweeee = message.author
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "")

        const modsarray = ["EZ", "NF", "HT", "HR", "SD", "PF", "DT", "NC", "HD", "FL", "RX", "AP", "SO", "TD", "NM"];
        //fs.appendFileSync(osulogdir, "\n" + modsarray)
        //fs.appendFileSync(osulogdir, "\n" + modsarray.length)
        let { prevmap } = require('../debug/storedmap.json');
        if (!pickeduserX) {
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`
        }
        if (pickeduserX && !isNaN(pickeduserX)) {
            //if(isNaN(pickeduserX)) return message.reply("You must use the ID e.g. 3305367 instead of Weekend Whip")
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${pickeduserX}`;
        }
        if (pickeduserX && isNaN(pickeduserX) && !modsarray.some(v => pickeduserX.includes(v))) return message.reply("error");
        if (args[1] && modsarray.some(v => args[1].includes(v))) {
            moddetect = args[1]
        }
        if (args[1] && !modsarray.some(v => args[1].includes(v))) {
            moddetect = 'NM'
        }
        if (!args[1]) {
            moddetect = 'NM'
        }
        if (pickeduserX && isNaN(pickeduserX) && modsarray.some(v => pickeduserX.includes(v))) {
            moddetect = pickeduserX;
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`
            //fs.appendFileSync(osulogdir, "\n" + "1")
        }
        try {
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
                    fs.appendFileSync(osulogdir, "\n" + "writing data to map.json")
                    fs.appendFileSync(osulogdir, "\n" + "")
                    try {
                        let mapbg = (
                            mapdata.beatmapset.covers["cover@2x"]
                        ).replaceAll('"', "");
                        let maplink = (mapdata.id);
                        let mapsetlink = (mapdata.beatmapset_id);
                        let mapper = (mapdata.beatmapset.creator)
                        let maptitleuni = (
                            mapdata.beatmapset.title_unicode
                        );
                        let maptitlenorm = (
                            mapdata.beatmapset.title
                        );
                        let maptitle = maptitleuni;
                        if (maptitlenorm != maptitleuni) {
                            maptitle = `${maptitleuni}\n${maptitlenorm}`;
                        }

                        let mapdiff = (mapdata.version);
                        let mapartist = (
                            mapdata.beatmapset.artist
                        );
                        let mapmaxcombo = (mapdata.max_combo);
                        let mapmode = (mapdata.mode);
                        let mapperlink = (mapper)
                        let mapstatus = (mapdata.status).toString();
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

                        let mapid = Math.abs(maplink)
                        const fileName = 'debug/storedmap.json';
                        const file = require('../debug/storedmap.json');
                        file.prevmap = maplink;
                        fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                            if (err) return fs.appendFileSync(osulogdir, "\n" + err);
                            fs.appendFileSync(osulogdir, "\n" + JSON.stringify(file));
                            fs.appendFileSync(osulogdir, "\n" + 'writing to ' + fileName);
                            fs.appendFileSync(osulogdir, "\n" + "");
                            console.groupEnd()
                        });//all this stuff is to write it to a temporary save file

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
                            perfect: '1',
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

                        let userinfourl = `https://osu.ppy.sh/api/v2/users/${mapperlink}/osu`
                        fetch(userinfourl, {
                            headers: {
                                Authorization: `Bearer ${access_token}`
                            }
                        }).then(res => res.json())
                            .then(output3 => {
                                let mapperid = JSON.stringify(output3, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');

                                modenum = 0
                                let cpolmods = moddetect.toLowerCase();
                                if (cpolmods.includes('nf') || cpolmods.includes('NF')) {
                                    modenum += 1
                                }
                                if (cpolmods.includes('ez') || cpolmods.includes('EZ')) {
                                    modenum += 2
                                }
                                if (cpolmods.includes('td') || cpolmods.includes('TD')) {
                                    modenum += 4
                                }
                                if (cpolmods.includes('hd') || cpolmods.includes('HD')) {
                                    modenum += 8
                                }
                                if (cpolmods.includes('hr') || cpolmods.includes('HR')) {
                                    modenum += 16
                                }
                                if (cpolmods.includes('sd') || cpolmods.includes('SD')) {
                                    modenum += 32
                                }
                                if (cpolmods.includes('dt') || cpolmods.includes('DT')) {
                                    modenum += 64
                                }
                                if (cpolmods.includes('rx') || cpolmods.includes('rl') || cpolmods.includes('rlx') || cpolmods.includes('RX') || cpolmods.includes('RL') || cpolmods.includes('RLX')) {
                                    modenum += 128
                                }
                                if (cpolmods.includes('ht') || cpolmods.includes('HT')) {
                                    modenum += 256
                                }
                                if (cpolmods.includes('nc') || cpolmods.includes('NC')) {
                                    modenum += 64//512
                                }
                                if (cpolmods.includes('fl') || cpolmods.includes('FL')) {
                                    modenum += 1024
                                }
                                if (cpolmods.includes('at') || cpolmods.includes('AT')) {
                                    modenum += 2048
                                }
                                if (cpolmods.includes('so') || cpolmods.includes('SO')) {
                                    modenum += 4096
                                }
                                if (cpolmods.includes('ap') || cpolmods.includes('AP')) {
                                    modenum += 8192
                                }
                                if (cpolmods.includes('pf') || cpolmods.includes('PF')) {
                                    modenum += 16384
                                }
                                if (cpolmods.includes('1k') || cpolmods.includes('1K')) {
                                    modenum += 67108864
                                }
                                if (cpolmods.includes('2k') || cpolmods.includes('2K')) {
                                    modenum += 268435456
                                }
                                if (cpolmods.includes('3k') || cpolmods.includes('3K')) {
                                    modenum += 134217728
                                }
                                if (cpolmods.includes('4k') || cpolmods.includes('4K')) {
                                    modenum += 32768
                                }
                                if (cpolmods.includes('5k') || cpolmods.includes('5K')) {
                                    modenum += 65536
                                }
                                if (cpolmods.includes('6k') || cpolmods.includes('6K')) {
                                    modenum += 131072
                                }
                                if (cpolmods.includes('7k') || cpolmods.includes('7K')) {
                                    modenum += 262144
                                }
                                if (cpolmods.includes('8k') || cpolmods.includes('8K')) {
                                    modenum += 524288
                                }
                                if (cpolmods.includes('9k') || cpolmods.includes('9K')) {
                                    modenum += 16777216
                                }
                                if (cpolmods.includes('fi') || cpolmods.includes('FI')) {
                                    modenum += 1048576
                                }
                                if (cpolmods.includes('rdm') || cpolmods.includes('RDM')) {
                                    modenum += 2097152
                                }
                                if (cpolmods.includes('cn') || cpolmods.includes('CN')) {
                                    modenum += 4194304
                                }
                                if (cpolmods.includes('tp') || cpolmods.includes('TP')) {
                                    modenum += 8388608
                                }
                                if (cpolmods.includes('kc') || cpolmods.includes('KC')) {
                                    modenum += 33554432
                                }
                                if (cpolmods.includes('sv2') || cpolmods.includes('s2') || cpolmods.includes('SV2') || cpolmods.includes('S2')) {
                                    modenum += 536870912
                                }
                                if (cpolmods.includes('mr') || cpolmods.includes('MR')) {
                                    modenum += 1073741824
                                }

                                let cpolpp = `https://pp.osuck.net/pp?id=${mapid}&mods=${modenum}&combo=${mapmaxcombo}&miss=0&acc=100`
                                //fs.appendFileSync(osulogdir, "\n" + cpolpp)

                                fetch(cpolpp, {
                                }).then(res => res.json())
                                    .then(output4 => {
                                        fs.writeFileSync('cpolppcalc.json', JSON.stringify(output4, null, 2))
                                        let cppSS = JSON.stringify(output4['pp'], ['fc']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('fc', '');
                                        let cpp95 = JSON.stringify(output4['pp']['acc'], ['95']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('95', '');
                                        (async () => {
                                            modissue = ''
                                            let moddetectnotd = moddetect
                                            if (moddetect.includes('TD')) {
                                                moddetectnotd = JSON.stringify(moddetect).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('moddetect', '').replaceAll('TD').replaceAll('undefined');
                                                modissue = `\n^^^^\n(these calculations **don't** include TD)`
                                            }
                                            if (moddetect == 'TD') {
                                                moddetectnotd = 'NM'
                                            }
                                            let pp = new std_ppv2().setPerformance(score).setMods(moddetectnotd);
                                            let ppcalc95 = new std_ppv2().setPerformance(score95).setMods(moddetectnotd);
                                            let mapimg = '<:modeosu:944181096868884481>'
                                            if (mapmode == 'osu') {
                                                pp = new std_ppv2().setPerformance(score).setMods(moddetectnotd);
                                                ppcalc95 = new std_ppv2().setPerformance(score95).setMods(moddetectnotd);
                                                mapimg = '<:modeosu:944181096868884481>'
                                            }
                                            if (mapmode == 'taiko') {
                                                pp = new taiko_ppv2().setPerformance(score).setMods(moddetectnotd);
                                                ppcalc95 = new taiko_ppv2().setPerformance(score95).setMods(moddetectnotd);
                                                mapimg = '<:modetaiko:944181097053442068>'
                                            }
                                            if (mapmode == 'fruits') {
                                                pp = new catch_ppv2().setPerformance(score).setMods(moddetectnotd);
                                                ppcalc95 = new catch_ppv2().setPerformance(score95).setMods(moddetectnotd);
                                                mapimg = '<:modefruits:944181096206176326>'
                                            }
                                            if (mapmode == 'mania') {
                                                pp = new mania_ppv2().setPerformance(score).setMods(moddetectnotd);
                                                ppcalc95 = new mania_ppv2().setPerformance(score95).setMods(moddetectnotd);
                                                mapimg = '<:modemania:944181095874834453>'
                                            }
                                            let ppSSjson = await pp.compute();
                                            let pp95json = await ppcalc95.compute();

                                            let ppSSstr = JSON.stringify(ppSSjson['total']);
                                            let pp95str = JSON.stringify(pp95json['total']);

                                            let ppSS = Math.abs(ppSSstr).toFixed(2)
                                            let pp95 = Math.abs(pp95str).toFixed(2)

                                            if (moddetect == 'NM') {
                                                maptitle = `${mapartist} - ${maptitle} [${mapdiff}]`
                                            }
                                            if (moddetect != 'NM') {
                                                maptitle = `${mapartist} - ${maptitle} [${mapdiff}] +${moddetect}`
                                            }
                                            let Embed = new Discord.MessageEmbed()
                                                .setColor(0x91FF9A)
                                                .setTitle(`pp values for ${maptitle}`)
                                                .setAuthor({ name: `${mapper}`, url: `https://osu.ppy.sh/u/${mapperlink}`, iconURL: `https://a.ppy.sh/${mapperid}` })
                                                .setURL(`https://osu.ppy.sh/b/${maplink}`)
                                                .setImage(mapbg)
                                                .addField('**PP VALUES**', `\n**SS:** ${ppSS} \n**95:** ${pp95} ${modissue}`, true)
                                                .addField('**PP VALUES (CPOL)**', `\n**SS:** ${cppSS} \n**95:** ${cpp95}`, true)
                                                .addField('**DOWNLOAD**', `[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`, true)
                                            message.reply({ embeds: [Embed] })
                                        })();
                                    })//output4
                            })
                    } catch (error) {
                        message.reply("error")
                        fs.appendFileSync(osulogdir, "\n" + error)
                        fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                        fs.appendFileSync(osulogdir, "\n" + "")
                        console.groupEnd()
                        console.groupEnd()
                        console.groupEnd()
                    }
                });
        } catch (error) {
            fs.appendFileSync(osulogdir, "\n" + error)
            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
            console.groupEnd()
            console.groupEnd()
            console.groupEnd()
        }

    }
}
//client.commands.get('').execute(message, args)