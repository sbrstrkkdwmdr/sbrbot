module.exports = {
    name: 'unchi',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        message.channel.send("ウンチ美味しい")   
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - unchi")
        console.log("category - general")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)