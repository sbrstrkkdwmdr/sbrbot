const { DiscordAPIError } = require("discord.js");
const { otherlogdir } = require('../logconfig.json')

const fs = require('fs')
module.exports = {
    name: 'active',
    description: 'no description',
    execute(message, args, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - active")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        let user = message.mentions.users.first();
        console.groupEnd()

        //use search function (`from:${user} during:week`)\
        //let resultcount = results
        //message.channel.send(resultcount)

    }
}
//client.commands.get('').execute(message, args)