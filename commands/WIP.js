module.exports = {
    name: 'WIP',
    description: '',
    execute(message, args) {
        message.channel.send("the current command is unavailable")
        console.log("command executed - WIP")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)