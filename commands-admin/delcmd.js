const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')

module.exports = {
    name: 'delcmd',
    description: 'delete a command',
    execute(message, args, client, Discord, currentDate, currentDateISO) {
        command = `${args[0]}`
        fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(adminlogdir, "\n" + `Fetched command ${command.name}`)
        command.delete()
        fs.appendFileSync(adminlogdir, "\n" + `Deleted command ${command.name}`)
        fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(adminlogdir, "\n" + "command executed - deleted command")
        fs.appendFileSync(adminlogdir, "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(adminlogdir, "\n" + "")
        console.groupEnd()
    }
  }
  
  
  
  