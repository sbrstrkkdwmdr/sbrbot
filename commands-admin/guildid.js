const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')

module.exports = {
    name: 'guildid',
    description: 'WIP',
    execute(message, args, currentDate, currentDateISO) {
        message.channel.send("WIP")
        fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(adminlogdir, "\n" + "command executed - guildid")
        fs.appendFileSync(adminlogdir, "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(adminlogdir, "\n" + "")
        console.groupEnd()
    }
}