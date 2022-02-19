const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2 } = require('booba');
const {Beatmap, Osu: {DifficultyCalculator, PerformanceCalculator}} = require('osu-bpdpc')
const request = require('request-promise-native')
module.exports = {
    name: 'pastmap',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        console.group('--- COMMAND EXECUTION ---')
        let pickedmods = args[0];
        //let pickedmods = JSON.stringify(pickedmods1).replaceAll('"', '');
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - map get (past)")
        let consoleloguserweeee = message.author
        console.log(pickedmods)
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 

        //if(!pickedmods) return message.channel.send("no mods have been picked!\nuse `sbr-map` if you want NM")

        if(!pickedmods) {
            pickedmods = 'NM'
        }

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
            .then(output => fs.writeFileSync("osuauth.json", JSON.stringify(output, null, 2)))
            ;
            console.log("writing data to osuauth.json")
            console.log("")
            
        
            
            
            let { prevmap } = require('../storedmap.json');
            const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`;
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
            try{let mapbg = JSON.stringify(mapdata['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');;
            let maplink = JSON.stringify(mapdata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
            let mapsetlink = JSON.stringify(mapdata, ['beatmapset_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmapset_id', '');
            let mapcs = JSON.stringify(mapdata, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
            let mapar = JSON.stringify(mapdata, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
            let mapod = JSON.stringify(mapdata, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
            let maphp = JSON.stringify(mapdata, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
            let mapsr = JSON.stringify(mapdata, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
            let mapbpm = JSON.stringify(mapdata, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
            
            let mapcsNM = JSON.stringify(mapdata, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
            let maparNM = JSON.stringify(mapdata, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
            let mapodNM = JSON.stringify(mapdata, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
            let maphpNM = JSON.stringify(mapdata, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
            let mapsrNM = JSON.stringify(mapdata, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
            let mapbpmNM = JSON.stringify(mapdata, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
           
            let mapcircle = JSON.stringify(mapdata, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
            let mapslider = JSON.stringify(mapdata, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
            let mapspinner = JSON.stringify(mapdata, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', '');
            let mapper = JSON.stringify(mapdata['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('creator', '');
            let maptitle = JSON.stringify(mapdata['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
            let mapdiff = JSON.stringify(mapdata, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
            let mapartist = JSON.stringify(mapdata['beatmapset'], ['artist']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('artist', '')
            let mapmaxcombo = JSON.stringify(mapdata, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('max_combo', '')
            let mapmode = JSON.stringify(mapdata, ['mode']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('mode', '');
            let mapperlink = JSON.stringify(mapper).replaceAll(' ', '%20')
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
            let mapid = Math.abs(maplink);

            let maplength = JSON.stringify(mapdata, ['total_length']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('total_length', '');
            let maphitonly = parseInt(JSON.stringify(mapdata, ['hit_length']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('hit_length', ''));

            let maphit1 = Math.floor(maphitonly / 60);
            let maphit2 = Math.floor(maphitonly % 60);
            let mapplaylength = maphit1 + ':' + maphit2;

            let recordedmaplength = mapplaylength;

            const fileName = 'storedmap.json';
            const file = require('../storedmap.json');  
            file.prevmap = maplink;
            fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
              });
            
              //const API_KEY = 'put api key here'; // osu! api v1 key
              //const USER = '15222484';
              
              (async () => {
                //const response = await fetch(`https://osu.ppy.sh/api/get_user_recent?k=${API_KEY}&u=${USER}&limit=1`);
                //const json = await response.json();
                //const [score] = json;

                const score = {
                    beatmap_id: prevmap,
                    score: '6795149',
                    maxcombo: '630',
                    count50: '0',
                    count100: '0',
                    count300: '374',
                    countmiss: '0',
                    countkatu: '0',
                    countgeki: '71',
                    perfect: '0',
                    enabled_mods: '64',
                    user_id: '13780464',
                    date: '2022-02-08 05:24:54',
                    rank: 'S',
                    score_id: '4057765057'
                  }
                //const score = scorew
                const score95 = {
                    beatmap_id: prevmap,
                    score: '6795149',
                    maxcombo: '630',
                    count50: '0',
                    count100: '72',
                    count300: '374',
                    countmiss: '0',
                    countkatu: '0',
                    countgeki: '71',
                    perfect: '0',
                    enabled_mods: '64',
                    user_id: '13780464',
                    date: '2022-02-08 05:24:54',
                    rank: 'S',
                    score_id: '4057765057'
                }
                //let acc95 = Math.abs('91.02').toFixed(2);

                

                if(pickedmods.includes('DT')) {
                    mapar = Math.abs(((maparNM*2)+13)/3).toFixed(2);
                    mapod = mapodNM + "^";
                    maphp = maphpNM + "^";
                    mapbpm = Math.abs(mapbpmNM * 1.5).toFixed(2);
                    maphit1 = Math.floor((maphitonly / 1.5) /60);
                    maphit2 = Math.floor((maphitonly / 1.5) % 60);
                    recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
                }
                if(pickedmods.includes('HT')) {
                    mapar = Math.abs(((maparNM*1.33)-4.3)).toFixed(2);
                    mapod = mapodNM + "⌄";
                    maphp = maphpNM + "⌄";
                    mapbpm = Math.abs(mapbpmNM * 0.75).toFixed(2);
                    maphit1 = Math.floor((maphitonly / 0.75) /60);
                    maphit2 = Math.floor((maphitonly / 0.75) % 60);
                    recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
                }
                if(pickedmods.includes('HR')) {
                    mapcs = Math.abs(mapcsNM * 1.5)
                    mapar = Math.abs(maparNM * 1.5)
                    maphp = Math.abs(maphpNM * 1.5)
                    mapod = Math.abs(mapodNM * 1.5)
                    if(mapar > 10) {
                        mapar = 10
                        maparhr = 10
                    }
                    if(maphp > 10) {
                        maphp = 10
                        maphphr = 10
                    }
                    if(mapod > 10) {
                        mapod = 10
                        mapodhr = 10
                    }

                }
                if(pickedmods.includes('EZ')) {
                    mapcs = Math.abs(mapcsNM / 2)
                    mapar = Math.abs(maparNM / 2)
                    maphp = Math.abs(maphpNM / 2)
                    mapod = Math.abs(mapodNM / 2)
                }

                if(pickedmods.includes('EZ') && pickedmods.includes('HR')) return message.reply('invalid mods!');
                if(pickedmods.includes('DT') && pickedmods.includes('HT')) return message.reply('invalid mods!');

                if(pickedmods.includes('EZ') && pickedmods.includes('HT')) {
                    mapcs = Math.abs(mapcsNM / 2);
                    mapar = Math.abs(((maparNM / 2)*1.33)-4.3).toFixed(2);
                    maphp = Math.abs(maphpNM / 2) + "⌄";
                    mapod = Math.abs(mapodNM / 2) + "⌄";
                    mapbpm = Math.abs(mapbpmNM * 0.75).toFixed(2);
                    maphit1 = Math.floor((maphitonly / 0.75) /60);
                    maphit2 = Math.floor((maphitonly / 0.75) % 60);
                    recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
                }
                if(pickedmods.includes('EZ') && pickedmods.includes('DT')) {
                    mapcs = Math.abs(mapcsNM / 2);
                    mapar = Math.abs(((maparNM / 2)+13)/3).toFixed(2);
                    maphp = Math.abs(maphpNM / 2) + "⌄";
                    mapod = Math.abs(mapodNM / 2) + "⌄";
                    mapbpm = Math.abs(mapbpmNM * 1.5).toFixed(2);
                    maphit1 = Math.floor((maphitonly / 1.5) /60);
                    maphit2 = Math.floor((maphitonly / 1.5) % 60);
                    recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
                }
                if(pickedmods.includes('HR') && pickedmods.includes('HT')) {
                    mapcs = Math.abs(mapcsNM * 1.5);
                    mapar = Math.abs(((maparNM * 1.5)*1.33)-4.3).toFixed(2);
                    maphp = Math.abs(maphpNM * 1.5) + "^";
                    mapod = Math.abs(mapodNM * 1.5) + "^";
                    mapbpm = Math.abs(mapbpmNM * 0.75).toFixed(2);
                    maphit1 = Math.floor((maphitonly / 0.75) /60);
                    maphit2 = Math.floor((maphitonly / 0.75) % 60);
                    recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;

                    if(maphp > 10) {
                        maphp = 10
                        maphphr = 10
                    }
                    if(mapod > 10) {
                        mapod = 10
                        mapodhr = 10
                    }

                }
                if(pickedmods.includes('HR') && pickedmods.includes('DT')) {
                    mapcs = Math.abs(mapcsNM * 1.5);
                    mapar = Math.abs(((maparNM * 1.5)+13)/3).toFixed(2);
                    maphp = Math.abs(maphpNM * 1.5) + "^";
                    mapod = Math.abs(mapodNM * 1.5) + "^";
                    mapbpm = Math.abs(mapbpmNM * 1.5).toFixed(2);
                    maphit1 = Math.floor((maphitonly / 1.5) /60);
                    maphit2 = Math.floor((maphitonly / 1.5) % 60);
                    recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
                    if(maphp > 10) {
                        maphp = 10
                        maphphr = 10
                    }
                    if(mapod > 10) {
                        mapod = 10
                        mapodhr = 10
                    }

                }

                /*else{
                    mapcs = mapcsNM
                    mapar = maparNM
                    mapod = mapodNM
                    maphp = maphpNM
                    mapbpm = mapbpmNM
                }*/
                console.log(mapcs + mapar + mapod + mapod + mapbpm)
              
                let pp = new std_ppv2().setPerformance(score).setMods(pickedmods);
                let ppcalc95 = new std_ppv2().setPerformance(score95).setMods(pickedmods);
    let mapimg = '<:modeosu:944181096868884481>'
    if(mapmode == 'osu'){
        pp = new std_ppv2().setPerformance(score)
        ppcalc95 = new std_ppv2().setPerformance(score95)
        mapimg = '<:modeosu:944181096868884481>'
        }
        if(mapmode == 'taiko'){
            pp = new taiko_ppv2().setPerformance(score)
            ppcalc95 = new taiko_ppv2().setPerformance(score95)
            mapimg = '<:modetaiko:944181097053442068>'
        }
        if(mapmode == 'fruits'){
            pp = new catch_ppv2().setPerformance(score)
            ppcalc95 = new catch_ppv2().setPerformance(score95)
            mapimg = '<:modefruits:944181096206176326>'
        }
        if(mapmode == 'mania'){
        pp = new mania_ppv2().setPerformance(score)
        ppcalc95 = new mania_ppv2().setPerformance(score95)
        mapimg = '<:modemania:944181095874834453>'
        }

                let ppSSjson = await pp.compute(100); 
                let pp95json = await ppcalc95.compute(95.00);

                let ppSSstr = JSON.stringify(ppSSjson['total']);
                let pp95str = JSON.stringify(pp95json['total']);

                let ppSS = Math.abs(ppSSstr).toFixed(2)
                let pp95 = Math.abs(pp95str).toFixed(2)


                //console.log(await pp.compute(100))
                /* => {
                  aim: 108.36677305976224,
                  speed: 121.39049498160061,
                  fl: 514.2615576494688,
                  acc: 48.88425340242263,
                  total: 812.3689077733752
                } */
              

//let ppSS = "undefined";
//let pp95 = "undefined";
            let Embed = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("Information for " + maptitle + " with " + pickedmods)
            .setURL(`https://osu.ppy.sh/b/` + maplink)
            .setImage(mapbg)
            .addField('**MAP DETAILS**', `${mapimg} | mapped by [${mapper}](https://osu.ppy.sh/u/${mapperlink})\n` + "CS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + "\n" + mapsr + "⭐ \n" +  mapbpm + "BPM \n<:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\n🕐${recordedmaplength}`, true)
            .addField('**PP VALUES**', `\nSS: ${ppSS} \n95: ${pp95}`, true)
            .addField('**DOWNLOAD**', `[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`, true)
            message.reply({ embeds: [Embed]})
        })();
        //    })
    } catch(error){
				message.reply("error")
				console.log(error)
				console.log("")
			}
			
			
		/*	let { version } = require('../map.json');
			let { cover } = require('../map.json');
			let { url }
			console.log(version)*/
	

            
             /*   let Embed = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("Information for " + maptitle)
            .setImage(mapbg)
            .setDescription(``);
            message.reply({ embeds: [Embed]})*/
            });
        

      
    
        
    }
}
//client.commands.get('').execute(message, args)