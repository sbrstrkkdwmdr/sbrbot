const fs = require('fs')
const { helplogdir } = require('../logconfig.json')

module.exports = {
    name: 'info',
    description: 'info',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync(helplogdir, "\n" + '--- COMMAND EXECUTION ---')
        message.channel.send('bot coded by SaberStrike in node js\nsource code - https://github.com/sbrstrkkdwmdr/sbrbot\nhttps://discord.js.org/#/docs/discord.js/stable/general/welcome')
        fs.appendFileSync(helplogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(helplogdir, "\n" + "command executed - info")
        fs.appendFileSync(helplogdir, "\n" + "category - help")
        let consoleloguserweeee = message.author
        fs.appendFileSync(helplogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(helplogdir, "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)