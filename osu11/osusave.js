const fs = require('fs');
module.exports = {
    name: 'osusave',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) { 
      console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osusave")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        let userid = message.author.id

        message.reply("WIP (can someone else code this for me pls im dumb)")
console.groupEnd()
}
}
//client.commands.get('').execute(message, args)