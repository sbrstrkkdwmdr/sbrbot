module.exports = {
    name: 'idk',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('SEND_MESSAGES')){
            message.channel.send("well I don't know either.")
        }
        else{
            message.channel.send("well I don't know either. do you?")
        }   
    }
}
//client.commands.get('').execute(message, args)