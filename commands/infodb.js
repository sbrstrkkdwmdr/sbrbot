const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'infodb',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
if (message.author.id == '503794887318044675' || message.author.id == '755220989494951997'){        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - infodb")
        console.log("category - general")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
        message.delete();
            message.channel.send({ files: ['./info.db'] });}
    }
}
//client.commands.get('').execute(message, args)