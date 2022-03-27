const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
module.exports = {
    name: 'osuid',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,) {
        fs.appendFileSync('osu.log', "\n" + '--- COMMAND EXECUTION ---')
        const pickeduserX = args.splice(0,1000).join(" ");
        fs.appendFileSync('osu.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('osu.log', "\n" + "command executed - get osu id")
        fs.appendFileSync('osu.log', "\n" + "category - osu")
        let consoleloguserweeee = message.author
        fs.appendFileSync('osu.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('osu.log', "\n" + "") 
        if(!pickeduserX) return message.reply("username required");
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
            fs.appendFileSync('osu.log', "\n" + "writing data to osuauth.json")
            fs.appendFileSync('osu.log', "\n" + "")
            
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
            const { access_token } = require('../debug/osuauth.json');

            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output2 => 
                {
                try{const osudata = output2;
                fs.writeFileSync("debug/osuid.json", JSON.stringify(osudata, null, 2));
                fs.appendFileSync('osu.log', "\n" + "writing data to osuid.json")
                fs.appendFileSync('osu.log', "\n" + "")
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                message.reply(playerid)
                fs.appendFileSync('osu.log', "\n" + "sent")
                } catch(error){
                    message.reply("Error - account not found")
                    fs.appendFileSync('osu.log', "\n" + "Error account not found")
                    fs.appendFileSync('osu.log', "\n" + error)
                    fs.appendFileSync('osu.log', "\n" + "")
                    console.groupEnd()
                }
        });
        } catch(err){
            fs.appendFileSync('osu.log', "\n" + err)
            console.groupEnd()
        } 
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  

    }
}
//client.commands.get('').execute(message, args)