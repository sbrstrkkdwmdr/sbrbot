const fs = require('fs')
const { joinrole } = require('../config.json');
const { guildid } = require('../config.json');
module.exports = {
    name: 'join',
    description: '',
    execute(message, args, user, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - join")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "")
        let we = message.guild.id
        if(we != guildid){ //if guild is ss
            message.reply("that command does not work here.")
 } else {
            //some variables
    
            if(message.member.roles.cache.has(joinrole)){
                message.reply("You already have this role") //if has role
                user.reply("ms")
            } else {
                let user = message.author
                message.channel.send(`adding role to ${user}`)
                message.member.roles.add(joinrole)
                fs.appendFileSync('cmd.log', "\n" + `added role to ${user}`)
                fs.appendFileSync('cmd.log', "\n" + "")
            }
        }
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)