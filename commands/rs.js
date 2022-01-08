const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../osuauth.json');
module.exports = {
    name: 'rs',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        const pickeduserX = args[0];
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - rs")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
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
            const recentactiveurl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/scores/recent?include_fails=1&mode=osu&limit=18&offset=0`;
            
            let headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };
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
            let rsmapbg = JSON.stringify(rsdata[0]['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
            let rspp = JSON.stringify(rsdata[0], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '');
            let rsmaptime = JSON.stringify(rsdata[0], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('created_at', '').slice(0, 10);
            let rsmapstar = JSON.stringify(rsdata[0]['beatmap'], ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
            let rsgrade = JSON.stringify(rsdata[0], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '');
            let rsmapid = JSON.stringify(rsdata[0]['beatmap'], ['beatmapset_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmapset_id', '');
            let rscombo = JSON.stringify(rsdata[0], ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
                 

            let rsnochokeacc300 = Math.floor(300 * rs300s);
            let rsnochokeacc100 = Math.floor(100 * rs100s);
            let rsnochokeacc50 = Math.floor(50 * rs50s);
            let rsnochoke300num = parseInt(rs300s);
            let rsnochoke100num = parseInt(rs100s);
            let rsnochoke50num = parseInt(rs50s);
            //let rsnochoke0num = parseInt(rs0s);
            let rsnochokebottom1 = Math.floor(rsnochoke300num + rsnochoke100num + rsnochoke50num);
            let rsnochokebottom = Math.floor(rsnochokebottom1 * 300)
            let rsnochokeacctop = Math.floor(rsnochokeacc300 + rsnochokeacc100 + rsnochokeacc50)
            let rsnochokeacc1 = Math.abs(rsnochokeacctop / rsnochokebottom);
            let rsnochokeacc = Math.abs(rsnochokeacc1 * 100).toFixed(2);

            if(!rsmods){
            let Embed = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("Most recent play for " + rsplayername)
            .setThumbnail(rsmapbg)
            .setDescription(`Score set on ${rsmaptime} by [${rsplayername}](https://osu.ppy.sh/u/${rsplayerid}) \n[${rsmapname}](https://osu.pp.sh/b/${rsmapid}) [${rsdiffname}] +NM ${rsmapstar}⭐ \n ${(Math.abs((rsacc) * 100).toFixed(2))}% (${rsnochokeacc}% if FC) **${rsgrade}** | 300:${rs300s} 100:${rs100s} 50:${rs50s} X:${rs0s} \n${rspp}**pp** | Combo:${rscombo}`);
            message.reply({ embeds: [Embed]})}
            if(rsmods){
                let Embed = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("Most recent play for " + rsplayername)
            .setImage(rsmapbg)
            .setDescription(`Score set on ${rsmaptime} by [${rsplayername}](https://osu.ppy.sh/u/${rsplayerid}) \n[${rsmapname}](https://osu.pp.sh/b/${rsmapid}) [${rsdiffname}]+${rsmods} ${rsmapstar}⭐\n ${(Math.abs((rsacc) * 100).toFixed(2))}% (${rsnochokeacc}% if FC) **${rsgrade}** | 300:${rs300s} 100:${rs100s} 50:${rs50s} 0:${rs0s} \n${rspp}***pp*** | Combo:${rscombo}`);
            message.reply({ embeds: [Embed]})
            }
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
        } catch(err){
            console.log(err)
        } 
    }
}
//client.commands.get('').execute(message, args)