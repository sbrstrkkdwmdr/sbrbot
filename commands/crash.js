module.exports = {
    name: 'crash',
    description: '',
    execute(message, args) {
        if(message.author.id == '503794887318044675'){
            message.channel.send("force crashing bot...")
            process.exit();
          }
  
          else {
            message.channel.send("sorry you cannot use this command")
          }  
    }
}
//client.commands.get('').execute(message, args)