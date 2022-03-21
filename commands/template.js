module.exports = {
    name: '',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        message.channel.send('');
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - ")
        console.log("category - general")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")   
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)