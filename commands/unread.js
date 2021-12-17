module.exports = {
    name: 'unread',
    description: '',
    execute(message, args) {
        message.delete();
        console.log("command executed - unread")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)