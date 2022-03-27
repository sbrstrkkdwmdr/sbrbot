const { DiscordAPIError } = require("discord.js");
const fs = require('fs')
module.exports = {
    name: 'infodb',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
if (message.author.id == '503794887318044675' || message.author.id == '755220989494951997'){        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - infodb")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "")
        console.groupEnd()
        message.delete();
            message.channel.send({ files: ['./info.db'] });}
    }
}
//client.commands.get('').execute(message, args)