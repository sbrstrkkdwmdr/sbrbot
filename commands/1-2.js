module.exports = {
    name: '1-2',
    description: '',
    execute(message, args, currentDate) {
        message.channel.send("+1k pp") 
        console.log(`${currentDate}`)
        console.log("command executed - 1-2")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)