module.exports = {
    name: 'idk',
    description: '',
    execute(message, args, currentDate) {
        if(message.member.hasPermission('SEND_MESSAGES')){
            message.channel.send("well I don't know either.")
            console.log(`${currentDate}`)
            console.log("command executed - idk")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("")
        }
        else{
            message.channel.send("well I don't know either. do you?")
            console.log(`${currentDate}`)
            console.log("command executed - idk")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("")
        }   
    }
}
//client.commands.get('').execute(message, args)