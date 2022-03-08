const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
module.exports = {
    name: 'map',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        console.group('--- COMMAND EXECUTION ---')
        const pickeduserX = args[0];
        if(args[1]){
        modsmaybe = args[1];
        }
        //console.log(args[1])

        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - map get")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        
        try {
        let oauthurl = new URL ("https://osu.ppy.sh/oauth/token");
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
            console.log("writing data to osuauth.json")
            console.log("")
        const modsarray = ["EZ", "NF", "HT", "HR", "SD", "PF", "DT", "NC", "HD", "FL", "RX", "AP", "SO", "TD", "NM"];
        //console.log(modsarray)
        //console.log(modsarray.length)
        let { prevmap } = require('../debug/storedmap.json');
        if(!pickeduserX){
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`
        }
        if(pickeduserX && !isNaN(pickeduserX)){
            //if(isNaN(pickeduserX)) return message.reply("You must use the ID e.g. 3305367 instead of Weekend Whip")
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${pickeduserX}`;
        }
        if(pickeduserX && isNaN(pickeduserX) && !modsarray.some(v => pickeduserX.includes(v))) return message.reply("error");
        if(args[1] && modsarray.some(v => args[1].includes(v))){
            moddetect = args[1]
        }
        if(args[1] && !modsarray.some(v => args[1].includes(v))){
            moddetect = 'NM'
        }
        if(!args[1]){
            moddetect = 'NM'
        }
        if(pickeduserX && isNaN(pickeduserX) && modsarray.some(v => pickeduserX.includes(v))){
            moddetect = pickeduserX;
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`
            //console.log("1")
        }
            try{
            const { access_token } = require('../debug/osuauth.json');
            
            fetch(mapurl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            }).then(res => res.json())
            .then(output2 => 
                {
					const mapdata = output2;
					//let mapdataP2 = JSON.stringify("[\n" + mapdataP1 + "\n]");
					//const mapdata = JSON.stringify("[\n" + mapdataP1 + "\n]");
                fs.writeFileSync("debug/map.json", JSON.stringify(mapdata, null, 2))
                console.log("writing data to map.json")
                console.log("")
            try{
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
            if(maptitlenorm != maptitleuni){
                maptitle = `${maptitleuni}\n${maptitlenorm}`
            }
            
            let mapdiff = JSON.stringify(mapdata, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
            let mapartist = JSON.stringify(mapdata['beatmapset'], ['artist']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('artist', '');
            let mapmaxcombo = JSON.stringify(mapdata, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('max_combo', '');
            let maplength = JSON.stringify(mapdata, ['total_length']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('total_length', '');
            let maphitonly = JSON.stringify(mapdata, ['hit_length']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('hit_length', '');
            let mapmode = JSON.stringify(mapdata, ['mode']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('mode', '');
            let mapperlink = JSON.stringify(mapper).replaceAll(' ', '%20').replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '');

            let maphit1 = Math.floor(maphitonly / 60);
            let maphit2 = Math.abs(maphitonly % 60);
            let mapplaylength = maphit1 + ':' + maphit2;
            let mapmaxcombotoint = Math.abs(mapmaxcombo);
            let slidertonum = Math.abs(mapslider);
            let circletonum = Math.abs(mapcircle);
            let spinnertonum = Math.abs(mapspinner);
            let totalobjcount = Math.abs(mapcircle + mapslider + mapspinner);
            //let totalobjcount2 = JSON.stringify(totalobjcount);
            let mapcstoint = Math.abs(mapcs);
            let mapartoint = Math.abs(mapar);
            let maphptoint = Math.abs(maphp);
            let mapodtoint = Math.abs(mapod);

            let mapstatus = JSON.stringify(mapdata, ['status']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('status', '');
            if(mapstatus == 'ranked'){
                statusimg = '<:statusranked:944512775579926609>';
            }
            if(mapstatus == 'approved' || mapstatus == 'qualified'){
                statusimg = '<:statusapproved:944512764913811467>'
            }
            if(mapstatus == 'loved'){
                statusimg = '<:statusloved:944512775810588733>'
            }
            if(mapstatus == 'graveyard' || mapstatus == 'pending'){
                statusimg = '<:statusgraveyard:944512765282897940>'
            }

            let mapid = Math.abs(maplink)
            const fileName = 'debug/storedmap.json';
            const file = require('../debug/storedmap.json');  
            file.prevmap = maplink;
            fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
                console.log("");
                console.groupEnd()
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
            let modissue = ''
            let moddetectnotd = moddetect
    if(moddetect.includes('TD')){
        moddetectnotd = JSON.stringify(moddetect).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('moddetect', '').replaceAll('TD').replaceAll('undefined');
        modissue = `\n(calculations don't include TD)`
    }
    if(moddetect == 'TD'){
        moddetectnotd = 'NM'
    }
    let pp = new std_ppv2().setPerformance(score).setMods(moddetectnotd);
    let ppcalc95 = new std_ppv2().setPerformance(score95).setMods(moddetectnotd);
    let mapimg = '<:modeosu:944181096868884481>'
    if(mapmode == 'osu'){
        pp = new std_ppv2().setPerformance(score).setMods(moddetectnotd);
        ppcalc95 = new std_ppv2().setPerformance(score95).setMods(moddetectnotd);
        mapimg = '<:modeosu:944181096868884481>'
        }
        if(mapmode == 'taiko'){
            pp = new taiko_ppv2().setPerformance(score).setMods(moddetectnotd);
            ppcalc95 = new taiko_ppv2().setPerformance(score95).setMods(moddetectnotd);
            mapimg = '<:modetaiko:944181097053442068>'
        }
        if(mapmode == 'fruits'){
            pp = new catch_ppv2().setPerformance(score).setMods(moddetectnotd);
            ppcalc95 = new catch_ppv2().setPerformance(score95).setMods(moddetectnotd);
            mapimg = '<:modefruits:944181096206176326>'
        }
        if(mapmode == 'mania'){
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

                if(moddetect == 'NM'){
                    maptitle = `${mapartist} - ${maptitle} [${mapdiff}]`
                }
                if(moddetect != 'NM'){
                    maptitle = `${mapartist} - ${maptitle} [${mapdiff}] +${moddetect}`
                }

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
            .setTitle(`${maptitle}`)
            .setAuthor(`${mapper}`, `https://a.ppy.sh/${mapperid}`,`https://osu.ppy.sh/u/${mapperlink}`)
            .setURL(`https://osu.ppy.sh/b/${maplink}`)
            .setImage(mapbg)
            //.setDescription(`[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper + "\n\nCS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + " | " + mapsr + "⭐ \n" +  mapbpm + "BPM | <:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\n\n--**PP VALUES**--\nSS: ${ppSS} | 95: ${pp95} \n\n**DOWNLOAD**\n[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`);
            //.addField('', `[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper)
            .addField('**MAP DETAILS**', `${statusimg} | ${mapimg} \n` + "CS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + "\n" + mapsr + "⭐ \n" +  mapbpm + "BPM \n<:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\n🕐${mapplaylength}`, true)
            .addField('**PP VALUES**', `\nSS: ${ppSS} \n95: ${pp95} ${modissue}`, true)
            .addField('**DOWNLOAD**', `[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`, true)
            message.reply({ embeds: [Embed]})
            })
              })();
    } catch(error){
				message.reply("error")
				console.log(error)
				console.log("")
                console.groupEnd()
                console.groupEnd()
                console.groupEnd()
			}
            });
        } catch(error){
            console.log(error)
            console.groupEnd()
            console.groupEnd()
            console.groupEnd()
        } } catch(error) {
            console.log(error)
            console.groupEnd()
            console.groupEnd()
            console.groupEnd()
        }
        
    }
}
//client.commands.get('').execute(message, args)