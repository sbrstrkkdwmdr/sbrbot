const fs = require('fs')
module.exports = {
    name: 'info',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync('help.log', "\n" + '--- COMMAND EXECUTION ---')
        message.channel.send('bot coded by SaberStrike in node js\nsource code - https://github.com/sbrstrkkdwmdr/sbrbot\nhttps://discord.js.org/#/docs/discord.js/stable/general/welcome')
        fs.appendFileSync('help.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('help.log', "\n" + "command executed - info")
        fs.appendFileSync('help.log', "\n" + "category - help")
        let consoleloguserweeee = message.author
        fs.appendFileSync('help.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('help.log', "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)