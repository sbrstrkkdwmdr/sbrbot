//tsfm shorthand for - top score for map
const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../osuauth.json');
const { Player } = require('discord-player');
let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'tsfm',
    description: '',
    execute(message, args, Discord, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        const pickeduserX = args[0];
        const pickedmap = args[1];
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - map get")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        if(!pickedmap) return message.reply("beatmap ID required");
        if(isNaN(pickedmap)) return message.reply("You must use ID e.g. 3305367 instead of Weekend Whip")
        if(!pickeduserX) return message.reply("user ID required");
        if(isNaN(pickeduserX)) return message.reply("You must use ID e.g. 15222484 instead of SaberStrike")
      
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
            const mapscoreurl = `https://osu.ppy.sh/api/v2/beatmaps/${pickedmap}/scores/users/${pickeduserX}`;
            
            let headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };
            fetch(mapscoreurl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            }).then(res => res.json())
            .then(output2 => 
                {
					const mapscoredata = output2;
					//let mapdataP2 = JSON.stringify("[\n" + mapdataP1 + "\n]");
					//const mapdata = JSON.stringify("[\n" + mapdataP1 + "\n]");
                fs.writeFileSync("mapscore.json", JSON.stringify(mapscoredata, null, 2))
            try{
                let playerid = JSON.stringify(mapscoredata['score'], ['user_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user_id', '');
                let playername = JSON.stringify(mapscoredata['score']['user'], ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('username', '');
                //let mapname = JSON.stringify(mapscoredata['score']['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                let diffname = JSON.stringify(mapscoredata['score']['beatmap'], ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('version', '');
                //let fullmapname = `${mapname} [${diffname}]`
                let mods = JSON.stringify(mapscoredata['score'], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                let acc = JSON.stringify(mapscoredata['score'], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
                let mapscore0s = JSON.stringify(mapscoredata['score']['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_miss', '');
                let mapscore50s = JSON.stringify(mapscoredata['score']['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_50', '');
                let mapscore100s = JSON.stringify(mapscoredata['score']['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_100', '');
                let mapscore300s = JSON.stringify(mapscoredata['score']['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_300', '');
                //let mapbg = JSON.stringify(mapscoredata['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
                let maplink = JSON.stringify(mapscoredata['score']['beatmap'], ['beatmapset_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmapset_id', '');
                let mapbg = `https://assets.ppy.sh/beatmaps/${maplink}/covers/cover.jpg`;
                let pp = JSON.stringify(mapscoredata['score'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '');
              //  let rsppw = mapscoredata['pp'];
                let maptime = JSON.stringify(mapscoredata['score'], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('created_at', '').slice(0, 10);
                let mapstar = JSON.stringify(mapscoredata['score']['beatmap'], ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
                let grade = JSON.stringify(mapscoredata['score'], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '');
                let mapid = JSON.stringify(mapscoredata['score']['beatmap'], ['beatmapset_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmapset_id', '');
                let combo = JSON.stringify(mapscoredata['score'], ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
                     
    
                let nochokeacc300 = Math.floor(300 * mapscore300s);
                let nochokeacc100 = Math.floor(100 * mapscore100s);
                let nochokeacc50 = Math.floor(50 * mapscore50s);
                let nochoke300num = parseInt(mapscore300s);
                let nochoke100num = parseInt(mapscore100s);
                let nochoke50num = parseInt(mapscore50s);
                //let rsnochoke0num = parseInt(rs0s);
                let nochokebottom1 = Math.floor(nochoke300num + nochoke100num + nochoke50num);
                let nochokebottom = Math.floor(nochokebottom1 * 300)
                let nochokeacctop = Math.floor(nochokeacc300 + nochokeacc100 + nochokeacc50)
                let nochokeacc1 = Math.abs(nochokeacctop / nochokebottom);
                let nochokeacc = Math.abs(nochokeacc1 * 100).toFixed(2);

              //  const API_KEY = osuapikey; // osu! api v1 key
                //const USER = args[0];
                
                /*(async () => {
                  
                  const json = await output2.json();
                  const [score] = json;
                  //fs.writeFileSync("rsppcalc.json", JSON.stringify(score, null, 2));
                  const pp = new std_ppv2().setPerformance(score);

                let ppw = await pp.compute();
                let ppiffc1 = await pp.compute(rsnochokeacc);
                let ppiffc2 = JSON.stringify(ppiffc1['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                let ppiffcw = Math.abs(ppiffc2).toFixed(2).toString();
                let ppiffcfull = Math.abs(ppiffc2).toString(); //fc pp without filters
                let ppwtostring = JSON.stringify(ppw['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                let ppwrawtotal = ppw['total'];
                let ppww = Math.abs(ppwrawtotal).toFixed(2);
                let ppwfull = Math.abs(ppwrawtotal).toString(); //the pp without filters
*/
                let Embed = new Discord.MessageEmbed()
                .setTitle(`${playername}'s highest score on title_unicode [${diffname}]`)
                .setThumbnail(`https://a.ppy.sh/${playerid}`)
                .setImage(`${mapbg}`)
                .setDescription(`Score set on **${maptime}** by **[${playername}](https://osu.ppy.sh/u/${playerid})** \n**[title_unicode [${diffname}]](https://osu.ppy.sh/s/${mapid})** +**${mods}** **${mapstar}**⭐ \n **${(Math.abs((acc) * 100).toFixed(2))}%** | **${grade}** | \n300: **${mapscore300s}** / 100: **${mapscore100s}** / 50: **${mapscore50s}** / X: **${mapscore0s}** \n**${pp}**pp | **${combo}x**`)
                message.reply({ embeds: [Embed]})
                //    })
        } catch(error){
				message.reply("Error - no data")
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