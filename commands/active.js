const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'active',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - active")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        let user = message.mentions.users.first();

        //use search function (`from:${user} during:week`)\
        //let resultcount = results
        //message.channel.send(resultcount)

    }
}
//client.commands.get('').execute(message, args)