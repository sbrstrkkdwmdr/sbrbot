module.exports = {
    name: '',
    description: '',
    execute(message, args, currentDate) {
        message.channel.send('');
        console.log(`${currentDate}`)
        console.log("command executed - ")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")   
    }
}
//client.commands.get('').execute(message, args)