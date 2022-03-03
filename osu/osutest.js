const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../osuauth.json');
const { std_ppv2 } = require('booba');
module.exports = {
    name: 'osutest',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        console.group('--- COMMAND EXECUTION (osutest) ---')
        if(message.author.id == '503794887318044675'){//<test
            const pickeduserX = args[0];
        try {
        let oauthurl = new URL ('https://osu.ppy.sh/oauth/token');
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
            .then(output => fs.writeFileSync("osuauth.json", JSON.stringify(output, null, 2)))
            ;
            console.log("writing data to osuauth.json")
            console.log("")
        const modsarray = ["EZ", "NF", "HT", "HR", "SD", "PF", "DT", "NC", "HD", "FL", "RX", "AP", "SO"];
        //console.log(modsarray)
        //console.log(modsarray.length)
        let { prevmap } = require('../storedmap.json');
        if(!pickeduserX){
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`
            bg1 = prevmap
        }
        if(pickeduserX && !isNaN(pickeduserX)){
            //if(isNaN(pickeduserX)) return message.reply("You must use the ID e.g. 3305367 instead of Weekend Whip")
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${pickeduserX}`
            bg1 = pickeduserX
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
            bg1 = prevmap
            //console.log("1")
        }
            try{
            const { access_token } = require('../osuauth.json');
            
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
                fs.writeFileSync("map.json", JSON.stringify(mapdata, null, 2))
                console.log("writing data to map.json")
                console.log("")
            try{
            let mapbgOLD = JSON.stringify(mapdata['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
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
            const fileName = 'storedmap.json';
            const file = require('../storedmap.json');  
            file.prevmap = maplink;
            fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
                console.log("");
                console.groupEnd()
                });//all this stuff is to write it to a temporary save file
                modenum = 0
                let cpolmods = moddetect.toLowerCase();
                if(cpolmods.includes('nf')){
                    modenum+1
                }
                if(cpolmods.includes('ez')){
                    modenum+2
                }
                if(cpolmods.includes('td')){
                    modenum+4
                }
                if(cpolmods.includes('hd')){
                    modenum+8
                }
                if(cpolmods.includes('hr')){
                    modenum+16
                }
                if(cpolmods.includes('sd')){
                    modenum+32
                }
                if(cpolmods.includes('dt')){
                    modenum+64
                }
                if(cpolmods.includes('rx') || cpolmods.includes('rl') || cpolmods.includes('rlx')){
                    modenum+128
                }
                if(cpolmods.includes('ht')){
                    modenum+256
                }
                if(cpolmods.includes('nc')){
                    modenum+64//512
                }
                if(cpolmods.includes('fl')){
                    modenum+1024
                }
                if(cpolmods.includes('at')){
                    modenum+2048
                }
                if(cpolmods.includes('so')){
                    modenum+4096
                }
                if(cpolmods.includes('ap')){
                    modenum+8192
                }
                if(cpolmods.includes('pf')){
                    modenum+16384
                }
                if(cpolmods.includes('1k')){
                    modenum+67108864
                }
                if(cpolmods.includes('2k')){
                    modenum+268435456
                }
                if(cpolmods.includes('3k')){
                    modenum+134217728
                }
                if(cpolmods.includes('4k')){
                    modenum+32768
                }
                if(cpolmods.includes('5k')){
                    modenum+65536
                }
                if(cpolmods.includes('6k')){
                    modenum+131072
                }
                if(cpolmods.includes('7k')){
                    modenum+262144
                }
                if(cpolmods.includes('8k')){
                    modenum+524288
                }
                if(cpolmods.includes('9k')){
                    modenum+16777216
                }
                if(cpolmods.includes('fi')){
                    modenum+1048576
                }
                if(cpolmods.includes('rdm')){
                    modenum+2097152
                }
                if(cpolmods.includes('cn')){
                    modenum+4194304
                }
                if(cpolmods.includes('tp')){
                    modenum+8388608
                }
                if(cpolmods.includes('kc')){
                    modenum+33554432
                }
                if(cpolmods.includes('sv2') || cpolmods.includes('s2')){
                    modenum+536870912
                }
                if(cpolmods.includes('mr')){
                    modenum+1073741824
                }

                if(mapmode == 'osu'){
                    mapimg = '<:modeosu:944181096868884481>'
                    }
                    if(mapmode == 'taiko'){
                        mapimg = '<:modetaiko:944181097053442068>'
                    }
                    if(mapmode == 'fruits'){
                        mapimg = '<:modefruits:944181096206176326>'
                    }
                    if(mapmode == 'mania'){ 
                    mapimg = '<:modemania:944181095874834453>'
                    }


                let cpolpp = `https://pp.osuck.net/pp?id=${mapid}&mods=${modenum}&combo=${mapmaxcombo}&miss=0&acc=100`
            fetch(cpolpp, {
            }).then(res => res.json())
            .then(output3 => {
                fs.writeFileSync('cpolppcalc.json', JSON.stringify(output3, null, 2))
                let ppSS = JSON.stringify(output3['pp'], ['fc']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('fc', '');
                let pp95 = JSON.stringify(output3['pp']['acc'], ['95']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('95', '');
                let mapbg = JSON.stringify(output3['other']['bg'], ['full']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('full', '').replace('https', 'https:');

            let mapperid = JSON.stringify(output3, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
            let Embed = new Discord.MessageEmbed()
            .setColor(0x91FF9A)
            .setTitle(`${maptitle}`)
            .setAuthor(`${mapper}`, `https://a.ppy.sh/${mapperid}`,`https://osu.ppy.sh/u/${mapperlink}`)
            .setURL(`https://osu.ppy.sh/b/${maplink}`)
            .setImage(mapbg)
            //.setDescription(`[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper + "\n\nCS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + " | " + mapsr + "⭐ \n" +  mapbpm + "BPM | <:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\n\n--**PP VALUES**--\nSS: ${ppSS} | 95: ${pp95} \n\n**DOWNLOAD**\n[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`);
            //.addField('', `[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper)
            .addField('**MAP DETAILS**', `${statusimg} | ${mapimg} \n` + "CS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + "\n" + mapsr + "⭐ \n" +  mapbpm + "BPM \n<:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\n${mapplaylength}`, true)
            .addField('**PP VALUES**', `\nSS: ${ppSS} \n95: ${pp95}`, true)
            .addField('**DOWNLOAD**', `[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`, true)
            message.reply({ embeds: [Embed]})
            });
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
//client.commands.get('').execute(message, args)
        
        }//<test
    }
}
//client.commands.get('').execute(message, args)