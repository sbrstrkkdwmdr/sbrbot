module.exports = {
    name: 'test',
    description: '',
    execute(message, args, currentDate) {
        message.channel.send("there's a test?")
        console.log(`${currentDate}`)
        console.log(`${currentDate}`)
        console.log("command executed - test")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)