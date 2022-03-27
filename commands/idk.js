const fs = require('fs')
module.exports = {
    name: 'idk',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('SEND_MESSAGES')){
            message.channel.send("well I don't know either.")
            fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('cmd.log', "\n" + "command executed - idk")
            fs.appendFileSync('cmd.log', "\n" + "category - general")
            let consoleloguserweeee = message.author
            fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('cmd.log', "\n" + "")
        }
        else{
            message.channel.send("well I don't know either. do you?")
            fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('cmd.log', "\n" + "command executed - idk")
            fs.appendFileSync('cmd.log', "\n" + "category - general")
            let consoleloguserweeee = message.author
            fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('cmd.log', "\n" + "")
        }   
    console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)