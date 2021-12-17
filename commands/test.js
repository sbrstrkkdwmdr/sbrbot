module.exports = {
    name: 'test',
    description: '',
    execute(message, args) {
        message.channel.send("there's a test?")
        console.log("command executed - test")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)