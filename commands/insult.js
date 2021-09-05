module.exports = {
    name: 'insult',
    description: 'insult',
    execute(message, args) {
        if(message.member.hasPermission('SEND_MESSAGES')){ //the if is to make the let user only affect this command. idk why, but it sometimes breaks other commands
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