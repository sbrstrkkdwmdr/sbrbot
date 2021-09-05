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
    }
}
//client.commands.get('').execute(message, args)