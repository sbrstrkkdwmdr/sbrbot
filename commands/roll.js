const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'roll',
    description: 
    'Returns a random number between 0 and 100. the maximum value can be changed' + 
    'Usage: `sbr-roll` or `sbr-roll [number]`',
    execute(message, args, currentDate, currentDateISO) {
        if (message.member.permissions.has('SEND_MESSAGES')) {
            fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
            let user = message.author
            let w = args.slice(0).join(' ')
            if (w > 0) {
                let score = Math.floor(Math.random() * w + 1)
                message.channel.send(` ${user} has rolled a(n) ${score} `)
                fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
                fs.appendFileSync(otherlogdir, "\n" + "command executed - roll")
                fs.appendFileSync(otherlogdir, "\n" + "category - general")
                let consoleloguserweeee = message.author
                fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                fs.appendFileSync(otherlogdir, "\n" + "")
            }
            else {
                let score = Math.floor(Math.random() * 100 + 1)
                message.channel.send(` ${user} has rolled a(n) ${score} `)
                fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
                fs.appendFileSync(otherlogdir, "\n" + "command executed - roll")
                fs.appendFileSync(otherlogdir, "\n" + "category - general")
                let consoleloguserweeee = message.author
                fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                fs.appendFileSync(otherlogdir, "\n" + "")

            }
            console.groupEnd()
        }
    }
}
//client.commands.get('').execute(message, args)