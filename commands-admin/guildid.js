const fs = require('fs')
module.exports = {
    name: 'guildid',
    execute(message, args, currentDate, currentDateISO) {
        message.channel.send("WIP")
        fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('admincmd.log', "\n" + "command executed - guildid")
        fs.appendFileSync('admincmd.log', "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('admincmd.log', "\n" + "")
        console.groupEnd()
        }
    }