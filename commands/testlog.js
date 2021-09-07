module.exports = {
    name: 'testlog',
    description: '',
    execute(message, args) {
        const channelId = '884598096280027136'
        const { guild } = message

        if(message.member.hasPermission('ADMINISTRATOR')){
            const channel = guild.channels.cache.get(channelId)
            let user = message.author
            channel.send(`a ${user}`)
        }  
    }
}
//client.commands.get('').execute(message, args)