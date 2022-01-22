const fs = require('fs');
//const w 

module.exports = {
    name: 'osusave',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) { 
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osusave")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 

        message.reply("WIP (can someone else code this for me pls im dumb)")
        /*let user = message.author.id;
        let osuid = args[0];

        if(isNaN(osuid)) return message.reply("error - NaN");
        if(!osuid) return message.reply("error - not an id (use `sbr-osuid username` to get it)")
        let text = `,    "${user}": "${osuid}`
        fs.copyFileSync("savedusers.json", "savedusersold.json")
        let oldtext = require("")
        let oldtextthing = JSON.stringify(oldtext, null, 2).replace('}', '')
        fs.writeFileSync("savedusers.json", JSON.stringify(oldtextthing, null, 2).replaceAll('\\', '').replace('"', ''))
        fs.appendFileSync("savedusers.json", JSON.stringify(text, null, 2).replaceAll('\\', '').replace('"', ''))
        fs.appendFileSync("savedusers.json", JSON.stringify('}', null, 2))
        message.reply("saved")*/
        
}
}
//client.commands.get('').execute(message, args)