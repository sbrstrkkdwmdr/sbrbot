const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../osuauth.json');
module.exports = {
    name: 'osuid',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,) {
        const pickeduserX = args[0];
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - get osu id")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        if(!pickeduserX) return message.reply("user ID required");
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
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
            
            let headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };
            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output2 => 
                {
                try{const osudata = output2;
                fs.writeFileSync("osu.json", JSON.stringify(osudata, null, 2));
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                message.reply(playerid)
                } catch(error){
                    message.reply("Error - account not found")
                    console.log("Error account not found")
                    console.log(error)
                    console.log("")
                }
        });
        } catch(err){
            console.log(err)
        } 
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}
//client.commands.get('').execute(message, args)