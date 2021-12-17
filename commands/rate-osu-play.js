module.exports = {
    name: 'rate-osu-play',
    description: '',
    execute(message, args, currentDate) {
        if(message.member.hasPermission('SEND_MESSAGES')){//the if is to make the let score only affect this command. idk why, but it sometimes breaks other commands
            let score = Math.floor(Math.random() * 100 + 1)
            message.channel.send(`I rate this play a ${score}/100`)
            console.log(`${currentDate}`)
            console.log("command executed - rate-osu-play")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log(`play rated ${score}/100`)
            console.log("")
            if (score == 69 ) {
                message.channel.send("funny number")
            }
        }
    }
}
//client.commands.get('').execute(message, args)