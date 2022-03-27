const fs = require('fs')
module.exports = {
    name: 'delcmd',
    description: 'delete a command',
    execute(message, args, client, Discord, currentDate, currentDateISO) {
        command = `${args[0]}`
        fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('admincmd.log', "\n" + `Fetched command ${command.name}`)
        command.delete()
        fs.appendFileSync('admincmd.log', "\n" + `Deleted command ${command.name}`)
        fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('admincmd.log', "\n" + "command executed - deleted command")
        fs.appendFileSync('admincmd.log', "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('admincmd.log', "\n" + "")
        console.groupEnd()
    }
  }
  
  
  
  