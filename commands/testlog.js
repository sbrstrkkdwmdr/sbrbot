module.exports = {
    name: 'testlog',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        let we = message.guild.id
        if(we != 652388389529714709){
  } else {
            message.channel.send("wee")
            if(message.member.permissions.has('ADMINISTRATOR')){
                const channel = guild.channels.cache.get(channelId)
                let user = message.author
                message.channel.send(`a ${user}`)
            }
        }
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - testlog")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)