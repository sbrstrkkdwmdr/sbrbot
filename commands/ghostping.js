const { User } = require("discord.js")
const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'ghostping',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('ADMINISTRATOR')){
            let pinged = message.mentions.users.first();
            if(!pinged){
                message.channel.send("⠀")
                fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
                fs.appendFileSync(otherlogdir, "\n" + "command executed - ghostping")
                fs.appendFileSync(otherlogdir, "\n" + "category - general")
                let consoleloguserweeee = message.author
                fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                fs.appendFileSync(otherlogdir, "\n" + "command failed - no user ID")
                fs.appendFileSync(otherlogdir, "\n" + "")
            }
            else{
            message.delete();
            fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(otherlogdir, "\n" + "command executed - ghostping")
            fs.appendFileSync(otherlogdir, "\n" + "category - general")
            let consoleloguserweeee = message.author
            fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(otherlogdir, "\n" + "")
            }
        }
        else{
            let dum = message.author
            message.channel.send(`${dum} that won't work`)
            fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(otherlogdir, "\n" + "command executed - ghostping")
            fs.appendFileSync(otherlogdir, "\n" + "category - general")
            let consoleloguserweeee = message.author
            fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(otherlogdir, "\n" + "command failed - insufficient permissions")
            fs.appendFileSync(otherlogdir, "\n" + "")
        }  
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)