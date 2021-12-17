module.exports = {
    name: 'unread',
    description: '',
    execute(message, args, currentDate) {
        message.delete();
        console.log(`${currentDate}`)
        console.log("command executed - unread")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)