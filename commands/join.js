module.exports = {
    name: 'join',
    description: '',
    execute(message, args) {
        if(message.member.roles.cache.has('652396229208047619')){
            message.channel.send("Error 403: Forbidden. You already have this role")
        } else {
            message.channel.send('adding role to user')
            message.member.roles.add('652396229208047619')
        }  
    }
}
//client.commands.get('').execute(message, args)