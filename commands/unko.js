const fs = require('fs')
module.exports = {
    name: 'unko',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        message.channel.send("ウンコご飯食べたい")   
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - unko")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)