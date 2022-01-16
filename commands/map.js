const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../osuauth.json');
const { std_ppv2 } = require('booba');
module.exports = {
    name: 'map',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        const pickeduserX = args[0];
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - map get")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        if(!pickeduserX) return message.reply("beatmap ID required");
        if(isNaN(pickeduserX)) return message.reply("You must use ID e.g. 3305367 instead of Weekend Whip")
      
        try{
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
            const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${pickeduserX}`;
            
            let headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };
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
            let mapcircle = JSON.stringify(mapdata, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
            let mapslider = JSON.stringify(mapdata, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
            let mapspinner = JSON.stringify(mapdata, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', '');
            let mapper = JSON.stringify(mapdata['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('creator', '');
            let maptitle = JSON.stringify(mapdata['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
            let mapdiff = JSON.stringify(mapdata, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
            let mapartist = JSON.stringify(mapdata['beatmapset'], ['artist']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('artist', '')
            let mapmaxcombo = JSON.stringify(mapdata, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('max_combo', '')
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
            let mapid = Math.abs(maplink)
            const fileName = 'storedmap.json';
            const file = require('../storedmap.json');  
            file.prevmap = maplink;
            fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
              });//all this stuff is to write it to a temporary save file
//            const API_KEY = osuapikey; // osu! api v1 key
  //          const USER = args[0];
            
  const API_KEY = osuapikey; // osu! api v1 key
  const thigngig = args[0];

        //    (async () => {
                console.log("wow")
       //         const response = await fetch(mapurl);
     //   const json = await response.json();
       // const [score] = json;
      /* const setmap = {
        beatmap_id: maplink
       };
       const score = {
           beatmap_id: mapid,
           count300: totalobjcount,
           count100: 0,
           count50: 0,
           countmiss: 0,
           maxcombo: mapmaxcombotoint
       };
       let totalfodiff = new std_ppv2().computeTotal
       let aimfodiff = new std_ppv2()
       let speedfodiff = new std_ppv2().comp
       const difficulty = {
        maxcombo: mapmaxcombotoint,
        aim:
        speed:
        total:
        ar: mapartoint,
        od: mapodtoint,
        count_circles: circletonum,
        count_sliders: slidertonum,
        count_spinners: spinnertonum
    };
      let speedstars = new std_ppv2().setBeatmap(setmap).setDifficulty(difficulty).computeSpeedValue();
       let aimstars = new std_ppv2().setBeatmap(setmap).setDifficulty(difficulty).computeAimValue();
       let accstars = new std_ppv2().setBeatmap(setmap).setDifficulty(difficulty).computeAccValue();
       let flashlightstars = new std_ppv2().setBeatmap(setmap).setDifficulty(difficulty).computeFlashlightValue();
       let totalstars = new std_ppv2().setBeatmap(setmap).setDifficulty(difficulty).computeTotal();

        let pp = new std_ppv2().setDifficulty().setBeatmap(setmap);
        //let pp
       new std_ppv2().computeAccValue

        let ppSS1 = pp.compute();
        let ppSS = JSON.stringify(ppSS1);
      //  let pp951 = await pp.compute(Math.abs(95.00));
        //let pp95 = JSON.stringify(pp951);*/

let ppSS = "undefined";
let pp95 = "undefined";
            let Embed = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("Information for " + maptitle)
            .setImage(mapbg)
            .setDescription(`[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper + "\nCS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + " | " + mapsr + "⭐ \n" +  mapbpm + "BPM | <:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\nSS: ${ppSS} | 95: ${pp95} \n**DOWNLOAD**\n[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`);
            message.reply({ embeds: [Embed]})
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
        } catch(err){
            console.log(err)
        } 
    }
}
//client.commands.get('').execute(message, args)