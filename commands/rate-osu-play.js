module.exports = {
    name: 'rate-osu-play',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('SEND_MESSAGES')){//the if is to make the let score only affect this command. idk why, but it sometimes breaks other commands
            let score = Math.floor(Math.random() * 100 + 1)
            message.channel.send(`I rate this play a ${score}/100`)
            if (score == 69 ) {
                message.channel.send("funny number")
            }
        }
    }
}
//client.commands.get('').execute(message, args)