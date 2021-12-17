module.exports = {
    name: 'token',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('ADMINISTRATOR')){
            message.channel.send("Admin should already know the bot token.")
        }
        else{
            message.channel.send("the bot token.")
        }
        console.log("command executed - token")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
    }
}
//client.commands.get('').execute(message, args)