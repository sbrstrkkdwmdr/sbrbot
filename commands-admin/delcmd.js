module.exports = {
    name: 'delcmd',
    description: 'delete a command',
    execute(message, args, client, Discord, currentDate, currentDateISO) {
        command = `${args[0]}`
        console.group('--- COMMAND EXECUTION ---')
        console.log(`Fetched command ${command.name}`)
        command.delete()
        console.log(`Deleted command ${command.name}`)
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - ping")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
  }
  
  
  
  