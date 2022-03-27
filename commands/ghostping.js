const { User } = require("discord.js")
const fs = require('fs')
module.exports = {
    name: 'ghostping',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('ADMINISTRATOR')){
            let pinged = message.mentions.users.first();
            if(!pinged){
                message.channel.send("⠀")
                fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
                fs.appendFileSync('cmd.log', "\n" + "command executed - ghostping")
                fs.appendFileSync('cmd.log', "\n" + "category - general")
                let consoleloguserweeee = message.author
                fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                fs.appendFileSync('cmd.log', "\n" + "command failed - no user ID")
                fs.appendFileSync('cmd.log', "\n" + "")
            }
            else{
            message.delete();
            fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('cmd.log', "\n" + "command executed - ghostping")
            fs.appendFileSync('cmd.log', "\n" + "category - general")
            let consoleloguserweeee = message.author
            fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('cmd.log', "\n" + "")
            }
        }
        else{
            let dum = message.author
            message.channel.send(`${dum} that won't work`)
            fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('cmd.log', "\n" + "command executed - ghostping")
            fs.appendFileSync('cmd.log', "\n" + "category - general")
            let consoleloguserweeee = message.author
            fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('cmd.log', "\n" + "command failed - insufficient permissions")
            fs.appendFileSync('cmd.log', "\n" + "")
        }  
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)