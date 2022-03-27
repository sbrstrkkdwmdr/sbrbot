const fs = require('fs')
module.exports = {
    name: 'auto',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.author.id == '503794887318044675'){
            message.reply("success")
            fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('admincmd.log', "\n" + "command executed - auto")
        fs.appendFileSync('admincmd.log', "\n" + "category - auto")
        let consoleloguserweeee = message.author
        fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('admincmd.log', "\n" + "")
        console.groupEnd()
        }
        else {
            message.reply("skill issue")
        }
    }
}
//client.commands.get('').execute(message, args)