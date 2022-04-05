const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { osulogdir } = require('../logconfig.json')

module.exports = {
    name: 'osuauth',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - osuauth")
        let consoleloguserweeee = message.author
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "") 
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
            fs.appendFileSync(osulogdir, "\n" + "writing data to osuauth.json")
            fs.appendFileSync(osulogdir, "\n" + "")
            console.groupEnd()
            ;
        } catch(error){
            fs.appendFileSync(osulogdir, "\n" + error)
            message.reply("error")
            console.groupEnd()
        }
        
    }
}
//client.commands.get('').execute(message, args)