module.exports = {
    name: 'danser',
    description: '',
    execute(message, args, currentDate) {
        message.channel.send("https://discord.gg/UTPvbe8")
        message.channel.send("https://wieku.me/danser")
        console.log(`${currentDate}`)
        console.log("command executed - danser")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
      /*  if(args[0] == help){
         message.channel.send("ask here")
         message.channel.send
        }
        else{
          
        }*/
    }
}
//client.commands.get('').execute(message, args)