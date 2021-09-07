module.exports = {
    name: 'join',
    description: '',
    execute(message, args) {
        const channelId = '884598096280027136'
        const { guild } = message

        if(message.member.roles.cache.has('652396229208047619')){
            message.channel.send("Error 403: Forbidden. You already have this role")
        } else {
            let user = message.author
            message.channel.send(`adding role to ${user}`)
            message.member.roles.add('652396229208047619')
            const channel = guild.channels.cache.get(channelId)
            channel.send(`new verified user: ${user}`)
        } 
    }
}
//client.commands.get('').execute(message, args)