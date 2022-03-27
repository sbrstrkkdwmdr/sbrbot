const fs = require('fs')
module.exports = {
    name: 'token',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('ADMINISTRATOR')){
            message.channel.send("Admin should already know the bot token.")
        }
        else{
            message.channel.send("the bot token.")
        }
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - token")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "") 
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)