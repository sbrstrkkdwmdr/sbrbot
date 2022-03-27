const fs = require('fs')
module.exports = {
    name: 'triggers',
    description: '',
    execute(message, logchannel, linkargs, Discord, client, currentDate, currentDateISO) {
        message.delete()
        fs.appendFileSync('checker.log', "\n" + '--- TRIGGERED WORD ---')
        fs.appendFileSync('checker.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('checker.log', "\n" + `MESSAGE - ${message}`)
        fs.appendFileSync('checker.log', "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync('checker.log', "\n" + `${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('checker.log', "\n" + "")
        console.groupEnd()
        logchannel.send(`TRIGGER ACTIVATED - ${message} by ${consoleloguserweeee.id} | <@${consoleloguserweeee.id}>`)
        
    }
}

//if (substrings.some(v => str.includes(v))) {
    // There's at least one
//}
//client.commands.get('').execute(message, args)