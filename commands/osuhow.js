module.exports = {
    name: 'osuhow',
    description: '',
    execute(message, args, currentDate) {
        message.channel.send(":osuHOW:")
        message.delete();
        console.log(`${currentDate}`)
        console.log("command executed - osuhow")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)