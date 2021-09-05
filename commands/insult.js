module.exports = {
    name: 'insult',
    description: 'insult',
    execute(message, args) {
        if(message.member.hasPermission('SEND_MESSAGES')){
            let user = message.mentions.users.first();
            message.channel.send(`${user}はキモいです。うんこ食べてくださいｗｗｗ`)
            message.delete();
            }
            else{
                message.channel.send('command error?')
            } 
    }
}
//client.commands.get('').execute(message, args)