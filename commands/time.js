module.exports = {
    name: 'time',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        message.channel.send(`${currentDateISO} | ${currentDate}`) 
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - time")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)