const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const calc = require('ojsama');
const { std_ppv2 } = require('booba');
const {Beatmap, Osu: {DifficultyCalculator, PerformanceCalculator}} = require('osu-bpdpc')
const request = require('request-promise-native')
module.exports = {
    name: 'osulongmaplink',
    description: '',
    execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        try{const w = JSON.stringify(linkargs).replaceAll("https", '').replaceAll(":", "").replaceAll("//", '').replaceAll('osu.ppy.sh', '').replaceAll('beatmapsets').replaceAll('/', '').replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').replaceAll('undefined', '');
        const grab = JSON.stringify(w.split('#')[1].split('/'))
        const pickeduserX = JSON.stringify(grab).replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').replaceAll('osu', '').replaceAll("\\", '');
        console.log(`${w}\n${pickeduserX}\n${grab}`)
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("link detector executed - map get (long)")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") ;
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
            let mapcircle = JSON.stringify(mapdata, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
            let mapslider = JSON.stringify(mapdata, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
            let mapspinner = JSON.stringify(mapdata, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', '');
            let mapper = JSON.stringify(mapdata['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('creator', '');
            let maptitle = JSON.stringify(mapdata['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
            let mapdiff = JSON.stringify(mapdata, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
            let mapartist = JSON.stringify(mapdata['beatmapset'], ['artist']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('artist', '')
            let mapmaxcombo = JSON.stringify(mapdata, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('max_combo', '')
            let mapmaxcombotoint = Math.abs(mapmaxcombo);
            let mapmiss = Math.abs(0)
            let topacc = Math.abs(100.00)
            let midacc = Math.abs(95.00)
            let slidertonum = Math.abs(mapcircle)
            let circletonum = Math.abs(mapslider)
            let totalobjcount = Math.abs(mapcircle + mapslider + mapspinner)
            let aimstars = 1
            let speedstars = 1
            request.get(`https://osu.ppy.sh/osu/${maplink}`).then(osu => {
  let beatmap = Beatmap.fromOsu(osu)
  let score = {
    maxcombo: mapmaxcombotoint,
    count50: 0,
    count100: 3,
    count300: 337,
    countMiss: 0,
    countKatu: 2,
    countGeki: 71,
    perfect: 1,
    mods: 0,
    pp: 725.814
  }
  let diffCalc = DifficultyCalculator.use(beatmap).setMods(score.mods).calculate()
  let perfCalc = PerformanceCalculator.use(diffCalc).calculate(score)
  let totalpp1 = perfCalc.totalPerformance
  let totalpp = Math.abs(totalpp1).toFixed(2);

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
            
          /*  (async () => {
              const response = mapdata//await fetch(`https://osu.ppy.sh/api/get_user_recent?k=${API_KEY}&u=15222484&limit=1`);
              const json = await response.json();
              const [score] = json;
            //  fs.writeFileSync("mapppcalc.json", JSON.stringify(score, null, 2));
              const pp = new std_ppv2().setPerformance(score);
            
              let ppSS = await pp.compute("100");
              //let pp95 = await pp.compute("95.00");
            */

            let Embed = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("Information for " + maptitle)
            .setImage(mapbg)
            .setDescription(`[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper + "\nCS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + " | " + mapsr + "⭐ \n" +  mapbpm + "BPM | <:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\nSS: ${totalpp}\n**DOWNLOAD**\n[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`);
            message.reply({ embeds: [Embed]})})
            
        //})
    } catch(error){
				message.reply("error - map not found")
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
        } catch(error){
            console.log(error)
            message.channel.send("Error - ")
        } } 
        
        catch(error){
            message.channel.send("Error - insufficient link\nmap links should be either `osu.ppy.sh/b/map_id` or `osu.ppy.sh/beatmapsets/mapset_id#osu/map_id`")
            console.log(error)
        }
    }
}
//client.commands.get('').execute(message, args)