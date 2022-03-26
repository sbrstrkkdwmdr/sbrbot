module.exports = {
    name: 'triggers',
    description: '',
    execute(message, logchannel, linkargs, Discord, client, currentDate, currentDateISO) {
        message.delete()
        console.group('--- TRIGGERED WORD ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log(`MESSAGE - ${message}`)
        console.log("category - admin")
        let consoleloguserweeee = message.author
        console.log(`${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
        logchannel.send(`TRIGGER ACTIVATED - ${message} by ${consoleloguserweeee.id} | <@${consoleloguserweeee.id}>`)
        
    }
}

//if (substrings.some(v => str.includes(v))) {
    // There's at least one
//}
//client.commands.get('').execute(message, args)