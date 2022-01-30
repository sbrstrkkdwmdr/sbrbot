
const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2 } = require('booba');
module.exports = {
    name: 'maniars',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        const pickeduserX = args.splice(0,1000).join(" "); //if it was just args 0 it would only take the first argument, so spaced usernames like "my angel lumine" wouldn't work
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - maniars")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        if(!pickeduserX) return message.reply("user ID required");
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

                const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/mania`;
                const { access_token } = require('../osuauth.json');

            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output1 => 
                {
                try{const osudata = output1;
                fs.writeFileSync("osuid.json", JSON.stringify(osudata, null, 2));
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                //message.reply(playerid)
                const recentactiveurl = `https://osu.ppy.sh/api/v2/users/${playerid}/scores/recent?include_fails=1&mode=mania&limit=18&offset=0`;
                
                fetch(recentactiveurl, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }).then(res => res.json())
                .then(output2 => 
                    {try{const rsdata = output2.slice(0, 1);
                    fs.writeFileSync("rs.json", JSON.stringify(rsdata, null, 2))
                try {
                let rsplayerid = JSON.stringify(rsdata[0], ['user_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user_id', '');
                let rsplayername = JSON.stringify(rsdata[0]['user'], ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('username', '');
                let rsmapname = JSON.stringify(rsdata[0]['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                let rsdiffname = JSON.stringify(rsdata[0]['beatmap'], ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('version', '');
                let rsmods = JSON.stringify(rsdata[0], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                let rsacc = JSON.stringify(rsdata[0], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
                let rs0s = JSON.stringify(rsdata[0]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_miss', '');
                let rs50s = JSON.stringify(rsdata[0]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_50', '');
                let rs100s = JSON.stringify(rsdata[0]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_100', '');
                let rs300s = JSON.stringify(rsdata[0]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_300', '');
                let rs300max = JSON.stringify(rsdata[0]['statistics'], ['count_geki']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_geki', '');
                let rs200s = JSON.stringify(rsdata[0]['statistics'], ['count_katu']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_katu', '');
                let rsmapbg = JSON.stringify(rsdata[0]['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
                let rspp = JSON.stringify(rsdata[0], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '');
              //  let rsppw = rsdata[0]['pp'];
                let rsmaptime = JSON.stringify(rsdata[0], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('created_at', '').slice(0, 10);
                let rsmapstar = JSON.stringify(rsdata[0]['beatmap'], ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
                let rsgrade = JSON.stringify(rsdata[0], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '');
                let rsmapid = JSON.stringify(rsdata[0]['beatmap'], ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                let rscombo = JSON.stringify(rsdata[0], ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
                     
                let rsnochokeacc300p = Math.floor(rs300s + rs300max);
                let rsnochokeacc300 = Math.floor(300 * rsnochokeacc300p);
                let rsnochokeacc200 = Math.floor(200 * rs200s);
                let rsnochokeacc100 = Math.floor(100 * rs100s);
                let rsnochokeacc50 = Math.floor(50 * rs50s);
                let rsnochoke300max = parseInt(rs300max);
                let rsnochoke300num = parseInt(rs300s);
                let rsnochoke200num = parseInt(rs200s);
                let rsnochoke100num = parseInt(rs100s);
                let rsnochoke50num = parseInt(rs50s);
                //let rsnochoke0num = parseInt(rs0s);
                let rsnochokebottom1 = Math.floor(rsnochoke300max + rsnochoke300num + rsnochoke200num + rsnochoke100num + rsnochoke50num);
                let rsnochokebottom = Math.floor(rsnochokebottom1 * 300)
                let rsnochokeacctop = Math.floor(rsnochokeacc300 + rsnochokeacc200 + rsnochokeacc100 + rsnochokeacc50)
                let rsnochokeacc1 = Math.abs(rsnochokeacctop / rsnochokebottom);
                let rsnochokeacc = Math.abs(rsnochokeacc1 * 100).toFixed(2);
                
                const fileName = 'storedmap.json';
                const file = require('../storedmap.json');  
                file.prevmap = rsmapid;
                fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                    if (err) return console.log(err);
                    console.log(JSON.stringify(file));
                    console.log('writing to ' + fileName);
                    console.log("");
                });
    
                const API_KEY = osuapikey; // osu! api v1 key
                const USER = pickeduserX;
                
                (async () => {
                  const response = await fetch(`https://osu.ppy.sh/api/get_user_recent?k=${API_KEY}&u=${USER}&limit=1`);
                  const json = await response.json();
                  const [score] = json;
                  fs.writeFileSync("rsppcalc.json", JSON.stringify(score, null, 2));
                  const pp = new std_ppv2().setPerformance(score);
                
               /*   try {
                    let testpp = await pp.compute();
    
                } catch(error){
                      message.reply("possible pp calculation error (if an embed is sent anyway it's probably fine)")
                      console.log(error)
                  } */
                  let ppw = await pp.compute();
                  let ppiffc1 = await pp.compute(rsnochokeacc);
                  let ppiffc2 = JSON.stringify(ppiffc1['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                  let ppiffcw = Math.abs(ppiffc2).toFixed(2).toString();
                  let ppiffcfull = Math.abs(ppiffc2).toString(); //fc pp without filters
                  let ppwtostring = JSON.stringify(ppw['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                  let ppwrawtotal = ppw['total'];
                  let ppww = Math.abs(ppwrawtotal).toFixed(2);
                  let ppwfull = Math.abs(ppwrawtotal).toString(); //the pp without filters
                  /* => {
                    aim: 108.36677305976224,
                    speed: 121.39049498160061,
                    fl: 514.2615576494688,
                    acc: 48.88425340242263,
                    total: 812.3689077733752
                  } */
                
               // if(rspp = "null"){
                if(!rsmods){
                let Embed = new Discord.MessageEmbed()
                .setColor(0x462B71)
                .setTitle("Most recent play for " + rsplayername)
                .setImage(rsmapbg)
                .setThumbnail(`https://a.ppy.sh/${rsplayerid}`)
                .setDescription(`Score set on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})** \n**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**NM** **${rsmapstar}**⭐ \n ${(Math.abs((rsacc) * 100).toFixed(2))}% | **${rsgrade}** | \n**300+**:${rs300max} **300:**${rs300s} **200:**${rs200s} **100:**${rs100s} **50:**${rs50s} **X:**${rs0s} \n${ppww}**pp** (${ppiffcw}**pp IF ${rsnochokeacc}% FC**) | **${rscombo}x**`);
                message.reply({ embeds: [Embed]})}
                if(rsmods){
                    let Embed = new Discord.MessageEmbed()
                .setColor(0x462B71)
                .setTitle("Most recent play for " + rsplayername)
                .setImage(rsmapbg)
                .setThumbnail(`https://a.ppy.sh/${rsplayerid}`)
                .setDescription(`Score set on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})** \n**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**${rsmods}** **${rsmapstar}**⭐ \n **${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** | \n**300+**:${rs300max} **300:**${rs300s} **200:**${rs200s} **100:**${rs100s} **50:**${rs50s} **X:**${rs0s} \n**${ppww}**pp | **${ppiffcw}**pp IF **${rsnochokeacc}%** FC | **${rscombo}x**`);
                message.reply({ embeds: [Embed]})
                }
            }
            )()
            } catch(error){
                message.reply("Error - no recent plays for this user")
                console.log("error - no recent plays found and/or json sent no data")
                console.log(error)
                console.log("")
            }
            }catch(error){
                message.reply("Error - account not found (or some other error)")
                console.log("error - account not found and/or json sent no data")
                console.log(error)
                console.log("")
            }});
                } catch(error){
                    message.reply("Error - account not found")
                    console.log("Error account not found")
                    console.log(error)
                    console.log("")
                }})
            } catch(err){
                console.log(err)
            }
    }
}
//client.commands.get('').execute(message, args)