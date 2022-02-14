const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'amoggers',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - amoggers")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
            message.reply({ files: ['./files/amoggers.png'] });
    }
}
//client.commands.get('').execute(message, args)