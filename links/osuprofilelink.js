const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../osuauth.json');
module.exports = {
    name: 'osuprofilelink',
    description: '',
    execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,) {
        console.group('--- LINK DETECTED ---')
        //const pickeduserX = args.splice(0,1000).join(" ");
        const w = JSON.stringify(linkargs[0]).replaceAll("https", '').replaceAll(":", "").replaceAll("//", '').replaceAll('osu.ppy.sh', '').replaceAll('users', '').replaceAll('u').replaceAll('/', '').replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').replaceAll('undefined', '');
        const pickeduserX = w;
        console.log(w)
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osu profile link")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        //if(!pickeduserX) return message.reply("user ID required");
        //if(isNaN(pickeduserX)) return message.reply("You must use ID e.g. 15222484 instead of SaberStrike")
      
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
            console.log("writing data to osuauth.json")
            console.log("")
            
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
            
            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output2 => 
                {
                try{const osudata = output2;
                fs.writeFileSync("osu.json", JSON.stringify(osudata, null, 2));
                console.log("writing data to osu.json")
                console.log("")
                let playername = JSON.stringify(osudata, ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');
                let playeravatar = JSON.stringify(osudata, ['avatar_url']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('avatar_url', '').replaceAll('https', 'https:');
                let playerrank = JSON.stringify(osudata['statistics'], ['global_rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('global_rank', '');
                let playercountryrank = JSON.stringify(osudata['statistics'], ['country_rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('country_rank', '');
                let playercountry = JSON.stringify(osudata, ['country_code']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('country_code', '');
                let playerpp = JSON.stringify(osudata['statistics'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '');
                let playerplays = JSON.stringify(osudata['statistics'], ['play_count']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('play_count', '');
                let playerlevel = JSON.stringify(osudata['statistics']['level'], ['current']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('current', '');
                let playerlevelprogress = JSON.stringify(osudata['statistics']['level'], ['progress']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('progress', '');
               // let playerplaystyle = JSON.stringify(osudata, ['playstyle']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('playstyle', '');
                let playerstatus = osudata['is_online'];
                let playeraccuracy = JSON.stringify(osudata['statistics'], ['hit_accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('hit_accuracy', '').slice(0, 5);
                let playeracount = JSON.stringify(osudata['statistics']['grade_counts'], ['a']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('a', '');
                let playerscount = JSON.stringify(osudata['statistics']['grade_counts'], ['s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('s', '');
                let playershcount = JSON.stringify(osudata['statistics']['grade_counts'], ['sh']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('sh', '');
                let playerxcount = JSON.stringify(osudata['statistics']['grade_counts'], ['ss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ss', '');
                let playerxhcount = JSON.stringify(osudata['statistics']['grade_counts'], ['ssh']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ssh', '');
                let playerjoined = JSON.stringify(osudata, ['join_date']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('join_date', '').slice(0, 10);
                let playerfollowers = JSON.stringify(osudata, ['follower_count']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('follower_count', '');
                let playerprevname = JSON.stringify(osudata, ['previous_usernames']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('previous_usernames', '').replaceAll('[', '').replaceAll(']', '');
                
                //
                let playerlast = JSON.stringify(osudata, ['last_visit']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replaceAll('last_visit', '').replaceAll('[', '').replaceAll(']', '');
                let playerlastbetterformat = playerlast.substring(0,19)
                let playerlasttoint = new Date(playerlastbetterformat)
                //let currentTime = new Date();
                //console.log(currentDate)
                let minsincelastvis = (playerlasttoint - currentDate) / (1000 * 60);
                let minlastvisreform = Math.abs(minsincelastvis).toFixed(0);
                //let ww = Math.abs()
                    let lastvishours = Math.trunc(minlastvisreform/60);
                    let lastvisminutes = minlastvisreform % 60;
                    let minlastvisredo = (lastvishours +"h, "+ lastvisminutes + "m");
            
            if(playerstatus == true ){let Embed = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle(playername + "'s osu! profile")
            .setThumbnail(playeravatar)
            .setDescription("**Global Rank:** " + playerrank + " (#" + playercountryrank + " " + playercountry + ")\n" + playerpp + "**pp**\n**Accuracy:** " + playeraccuracy + "%\n**Level:** " + playerlevel + "+" + playerlevelprogress + "%\n**Playcount:** " + playerplays + "\n **<:osu_online:927800818445455421> Online**\n**Player joined on** " + playerjoined + "\n**Followers:** " + playerfollowers + "\n**Previous names:** " + playerprevname + "\n<:rankingxh:927797179597357076>" + playerxhcount + " <:rankingX:927797179832229948>" + playerxcount + " <:rankingSH:927797179710570568>" + playershcount + " <:rankingS:927797179618295838>" + playerscount + " <:rankingA:927797179739930634>" + playeracount);
            message.reply({ embeds: [Embed]})
            //message.reply(mapbg1)
            }
            if(playerstatus == false ){let Embed = new Discord.MessageEmbed()
                .setColor(0x462B71)
                .setTitle(playername + "'s osu! profile")
                .setThumbnail(playeravatar)
                .setDescription("**Global Rank:** " + playerrank + " (#" + playercountryrank + " " + playercountry + ")\n" + playerpp + "**pp**\n**Accuracy:** " + playeraccuracy + "%\n**Level:** " + playerlevel + "+" + playerlevelprogress + "%\n**Playcount:** " + playerplays + `\n **<:osu_offline:927800829153513472> Offline** | Last online ${minlastvisredo} ago\n**Player joined on** ` + playerjoined + "\n**Followers:** " + playerfollowers + "\n**Previous names:** " + playerprevname + "\n<:rankingxh:927797179597357076>" + playerxhcount + " <:rankingX:927797179832229948>" + playerxcount + " <:rankingSH:927797179710570568>" + playershcount + " <:rankingS:927797179618295838>" + playerscount + " <:rankingA:927797179739930634>" + playeracount);
                message.reply({ embeds: [Embed]})
                //message.reply(mapbg1)
                }} catch(error){
                    message.reply("Error - account not found (or some other error)")
                    console.log("Error account not found")
                    console.log(error)
                    console.log("")
                }
        });
        } catch(err){
            console.log(err)
        } 
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)