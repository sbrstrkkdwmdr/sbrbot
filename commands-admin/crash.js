module.exports = {
    name: 'crash',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.author.id == '503794887318044675'){
          console.group('--- COMMAND EXECUTION ---')
          //message.reply("✔"); for some reason this line gets skipped
          console.log(`${currentDateISO} | ${currentDate}`)
          console.log("command executed - force crash")
          let consoleloguserweeee = message.author
          console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
          console.log("");
            process.exit();
          }
  
          else {
            message.channel.send("sorry you cannot use this command")
            console.log(`${currentDate}`)
            console.log("command executed - force crash")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - insufficient permissions")
            console.log("")
          }  
          console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)