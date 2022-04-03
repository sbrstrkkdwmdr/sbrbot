const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const { linkfetchlogdir } = require('../logconfig.json')

module.exports = {
    name: 'osuprofilelink',
    description: '',
    execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,) {
        console.group('--- LINK DETECTED ---')
        //const pickeduserX = args.splice(0,1000).join(" ");
        const w = JSON.stringify(linkargs[0]).replaceAll("https", '').replaceAll(":", "").replaceAll("//", '').replaceAll('osu.ppy.sh', '').replace('users', '').replace('u').replaceAll('/', '').replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').replaceAll('undefined', '');
        const pickeduserX = w;
        fs.appendFileSync(linkfetchlogdir, "\n" + w)
        fs.appendFileSync(linkfetchlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(linkfetchlogdir, "\n" + "command executed - osu profile link")
        fs.appendFileSync(linkfetchlogdir, "\n" + "category - osu")
        let consoleloguserweeee = message.author
        fs.appendFileSync(linkfetchlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(linkfetchlogdir, "\n" + "") 
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
            .then(output => fs.writeFileSync("debug/osuauth.json", JSON.stringify(output, null, 2)))
            ;
            fs.appendFileSync(linkfetchlogdir, "\n" + "writing data to osuauth.json")
            fs.appendFileSync(linkfetchlogdir, "\n" + "")
            
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
            
            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output2 => 
                {
                try{const osudata = output2;
                fs.writeFileSync("debug/osu.json", JSON.stringify(osudata, null, 2));
                fs.appendFileSync(linkfetchlogdir, "\n" + "writing data to osu.json")
                fs.appendFileSync(linkfetchlogdir, "\n" + "")
                let playername = JSON.stringify(osudata, ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                let playeravatar = JSON.stringify(osudata, ['avatar_url']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('avatar_url', '').replaceAll('https', 'https:');
                let playerrank1 = JSON.stringify(osudata['statistics'], ['global_rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('global_rank', '');
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
                
                let playerrank = JSON.stringify(osudata['statistics'], ['global_rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('global_rank', '');

                if(playerrank1 < 1000000000 && playerrank1 > 999999){
                    playerrankp1 = Math.floor(playerrank1 / 1000000);
                    playerrankp2 = Math.floor(playerrank1 / 1000) % 1000;
                    playerrankp3 = playerrank1 % 1000;
                    playerrank = `${playerrankp1},${playerrankp2},${playerrankp3}`
                }

                if(playerrank1 < 1000000 && playerrank1 > 999){
                    playerrankp1 = Math.floor(playerrank1 / 1000);
                    playerrankp2 = playerrank1 % 1000;
                    playerrank = `${playerrankp1},${playerrankp2}`
                }
                if(playerrank1 < 1000){
                    playerrank = playerrank1
                }
                
                if(playerrank1 == 'null'){
                    playerrank == '---'
                }
                if(playercountryrank == 'null'){
                    playercountryrank == '---'
                }


                let playerlast = JSON.stringify(osudata, ['last_visit']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replaceAll('last_visit', '').replaceAll('[', '').replaceAll(']', '');

                let playerlasttoint = new Date(playerlast)

                let currenttime = new Date()

                let minsincelastvis = (playerlasttoint - currenttime) / (1000 * 60);
                let minlastvisreform = Math.abs(minsincelastvis).toFixed(0);
                    
                    let lastvishours = (Math.trunc(minlastvisreform/60)) % 24;
                    let lastvisminutes = minlastvisreform % 60;
                    let lastvisdays = Math.trunc((minlastvisreform/60)/24) % 30;
                    let lastvismonths = Math.trunc(minlastvisreform/60/24/30) % 12;
                    let lastvisyears = Math.trunc(minlastvisreform/60/24/30/12);
                    let minlastvisredo = (lastvisyears + "y " + lastvismonths + "m " +  lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
            
            if(playerstatus == true ){let Embed = new Discord.MessageEmbed()
            .setColor(0x6DDAFF)
            .setTitle(`${playername}'s osu! profile`)
            .setURL(`https://osu.ppy.sh/u/${playerid}`)
            .setThumbnail(playeravatar)
            .setDescription("**Global Rank:** " + playerrank + " (#" + playercountryrank + " " + playercountry + ")\n" + playerpp + "**pp**\n**Accuracy:** " + playeraccuracy + "%\n**Level:** " + playerlevel + "+" + playerlevelprogress + "%\n**Playcount:** " + playerplays + "\n **<:osu_online:927800818445455421> Online**\n**Player joined on** " + playerjoined + "\n**Followers:** " + playerfollowers + "\n**Previous names:** " + playerprevname + "\n<:rankingxh:927797179597357076>" + playerxhcount + " <:rankingX:927797179832229948>" + playerxcount + " <:rankingSH:927797179710570568>" + playershcount + " <:rankingS:927797179618295838>" + playerscount + " <:rankingA:927797179739930634>" + playeracount);
            message.reply({ embeds: [Embed]})
            //message.reply(mapbg1)
            }
            if(playerstatus == false ){let Embed = new Discord.MessageEmbed()
                .setColor(0x6DDAFF)
                .setTitle(`${playername}'s osu! profile`)
                .setURL(`https://osu.ppy.sh/u/${playerid}`)
                .setThumbnail(playeravatar)
                .setDescription("**Global Rank:** " + playerrank + " (#" + playercountryrank + " " + playercountry + ")\n" + playerpp + "**pp**\n**Accuracy:** " + playeraccuracy + "%\n**Level:** " + playerlevel + "+" + playerlevelprogress + "%\n**Playcount:** " + playerplays + `\n **<:osu_offline:927800829153513472> Offline** | Last online ${minlastvisredo} ago\n**Player joined on** ` + playerjoined + "\n**Followers:** " + playerfollowers + "\n**Previous names:** " + playerprevname + "\n<:rankingxh:927797179597357076>" + playerxhcount + " <:rankingX:927797179832229948>" + playerxcount + " <:rankingSH:927797179710570568>" + playershcount + " <:rankingS:927797179618295838>" + playerscount + " <:rankingA:927797179739930634>" + playeracount);
                message.reply({ embeds: [Embed]})
                //message.reply(mapbg1)
                }} catch(error){
                    message.reply("Error - account not found (or some other error)")
                    fs.appendFileSync(linkfetchlogdir, "\n" + "Error account not found")
                    fs.appendFileSync(linkfetchlogdir, "\n" + error)
                    fs.appendFileSync(linkfetchlogdir, "\n" + "")
                }
        });
        } catch(err){
            fs.appendFileSync(linkfetchlogdir, "\n" + err)
        } 
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
console.groupEnd()
//client.commands.get('').execute(message, args)