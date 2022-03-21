module.exports = {
    name: 'time',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        message.channel.send(`${currentDateISO} | ${currentDate}`) 
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - time")
        console.log("category - general")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)