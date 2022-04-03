const { DiscordAPIError } = require("discord.js");
const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'infodb',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
if (message.author.id == '503794887318044675' || message.author.id == '755220989494951997'){        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - infodb")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
        message.delete();
            message.channel.send({ files: ['./info.db'] });}
    }
}
//client.commands.get('').execute(message, args)