module.exports = {
    name: 'testlog',
    description: '',
    execute(message, args) {
        let we = message.guild.id
        if(we != 652388389529714709){

  } else {
            message.channel.send("wee")
            if(message.member.hasPermission('ADMINISTRATOR')){
                const channel = guild.channels.cache.get(channelId)
                let user = message.author
                message.channel.send(`a ${user}`)
            }
        }
    }
}
//client.commands.get('').execute(message, args)