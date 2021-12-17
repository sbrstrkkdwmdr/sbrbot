module.exports = {
    name: 'enjoygame',
    description: '',
    execute(message, args) {
        message.channel.send("farm bad enjoy game good 😎")
        console.log("command executed - enjoygame")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")  
    }
}
//client.commands.get('').execute(message, args)