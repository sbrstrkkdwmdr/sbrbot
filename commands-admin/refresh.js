module.exports = {
    name: 'refresh',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
      console.group('--- COMMAND EXECUTION ---')
        if(message.author.id == '503794887318044675'){
          message.delete();
          console.log(`${currentDateISO} | ${currentDate}`)
          console.log("command executed - refresh")
          let consoleloguserweeee = message.author
          console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
          console.log("")
            process.exit();
            //client.login('NzU1MjIwOTg5NDk0OTUxOTk3.X2AIWw.ebo8K60jWyQ1XL-HophjRma_J9c')
          }
  
          else {
            message.channel.send("sorry you cannot use this command")
            console.log(`${currentDate}`)
            console.log("command executed - refresh")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - insufficient permissions")
            console.log("")
          }  
          console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)