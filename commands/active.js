const { DiscordAPIError } = require("discord.js");
const fs = require('fs')
module.exports = {
    name: 'active',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - active")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "")
        let user = message.mentions.users.first();
        console.groupEnd()

        //use search function (`from:${user} during:week`)\
        //let resultcount = results
        //message.channel.send(resultcount)

    }
}
//client.commands.get('').execute(message, args)