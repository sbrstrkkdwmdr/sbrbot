const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')

module.exports = {
    name: 'auto',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.author.id == '503794887318044675'){
            message.reply("success")
            fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(adminlogdir, "\n" + "command executed - auto")
        fs.appendFileSync(adminlogdir, "\n" + "category - auto")
        let consoleloguserweeee = message.author
        fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(adminlogdir, "\n" + "")
        console.groupEnd()
        }
        else {
            message.reply("skill issue")
        }
    }
}
//client.commands.get('').execute(message, args)