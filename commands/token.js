const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'token',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('ADMINISTRATOR')){
            message.channel.send("Admin should already know the bot token.")
        }
        else{
            message.channel.send("the bot token.")
        }
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - token")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "") 
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)