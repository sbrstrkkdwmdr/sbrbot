const fs = require('fs');
module.exports = {
    name: 'osusave',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) { 
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osusave")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        let user = message.author;
        let osuid = args[0];

        if(isNaN(osuid)) return message.reply("error - NaN");
        if(!osuid) return message.reply("error - no id")
        let text = `"${user}": "${osuid}"`
        fs.readFileSync("savedusers.json")
        fs.appendFileSync("savedusers.json", JSON.stringify(text, null, 2))
        message.reply("saved")
}
}
//client.commands.get('').execute(message, args)