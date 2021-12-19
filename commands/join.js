module.exports = {
    name: 'join',
    description: '',
    execute(message, args, user, currentDate, currentDateISO) {
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - join")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        let we = message.guild.id
        if(we != 652388389529714709){ //if guild is ss
            let user = message.author
            message.reply("that command does not work here.")
            message.reply("if you want to use the music bot, `try sbr-play`")
 } else {
            const channelId = '884598096280027136'
            const { guild } = message
            //some variables
    
            if(message.member.roles.cache.has('652396229208047619')){
                message.reply("You already have this role") //if has role
                user.reply("ms")
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