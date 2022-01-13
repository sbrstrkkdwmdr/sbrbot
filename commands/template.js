module.exports = {
    name: '',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        message.channel.send('');
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - ")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")   
    }
}
//client.commands.get('').execute(message, args)