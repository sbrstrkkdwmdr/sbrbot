module.exports = {
    name: 'rate-osu-play-else',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('SEND_MESSAGES')){//the if is to make the let user only affect this command. idk why, but it sometimes breaks other commands
            let user = message.mentions.users.first()
            let score = Math.floor(Math.random() * 100 + 1)
            message.channel.send(`I rate ${user}'s play a ${score}/100`)
            if (score == 69 ) {
                message.channel.send("funny number")
            }
        }
    }
}
//client.commands.get('').execute(message, args)