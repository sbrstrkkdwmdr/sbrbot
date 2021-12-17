module.exports = {
    name: 'crash',
    description: '',
    execute(message, args) {
        if(message.author.id == '503794887318044675'){
          console.log("command executed - force crash")
          let consoleloguserweeee = message.author
          console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
          console.log("")
            message.channel.send("force crashing bot...")
            process.exit();
          }
  
          else {
            message.channel.send("sorry you cannot use this command")
            console.log("command executed - force crash")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - insufficient permissions")
            console.log("")
          }  
    }
}
//client.commands.get('').execute(message, args)