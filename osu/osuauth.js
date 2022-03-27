const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
module.exports = {
    name: 'osuauth',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync('osu.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('osu.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('osu.log', "\n" + "command executed - osuauth")
        fs.appendFileSync('osu.log', "\n" + "category - osu")
        let consoleloguserweeee = message.author
        fs.appendFileSync('osu.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('osu.log', "\n" + "") 
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
            .then(message.reply("success"))
            fs.appendFileSync('osu.log', "\n" + "writing data to osuauth.json")
            fs.appendFileSync('osu.log', "\n" + "")
            fs.appendFileSync('osu.log', "\n" + "sent")
            console.groupEnd()
            ;
        } catch(error){
            fs.appendFileSync('osu.log', "\n" + error)
            message.reply("error")
            console.groupEnd()
        }
        
    }
}
//client.commands.get('').execute(message, args)