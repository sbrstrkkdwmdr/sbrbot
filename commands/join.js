module.exports = {
    name: 'join',
    description: '',
    execute(message, args) {
        console.log("command executed - join")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        let we = message.guild.id
        if(we != 652388389529714709){

 } else {
            const channelId = '884598096280027136'
            const { guild } = message
    
            if(message.member.roles.cache.has('652396229208047619')){
                message.channel.send("Error 403: Forbidden. You already have this role")
            } else {
                let user = message.author
                message.channel.send(`adding role to ${user}`)
                message.member.roles.add('652396229208047619')
                console.log(`added role to ${user}`)
                console.log("")
            }
        }
    }
}
//client.commands.get('').execute(message, args)