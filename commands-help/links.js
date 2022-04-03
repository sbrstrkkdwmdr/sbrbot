const fs = require('fs')
const { helplogdir } = require('../logconfig.json')

module.exports = {
    name: 'links',
    description: 'links',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync(helplogdir, "\n" + '--- COMMAND EXECUTION ---')
        message.channel.send('here you go! https://sbrstrkkdwmdr.github.io/sbr-web/');  
        fs.appendFileSync(helplogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(helplogdir, "\n" + "command executed - links")
        fs.appendFileSync(helplogdir, "\n" + "category - help")
        let consoleloguserweeee = message.author
        fs.appendFileSync(helplogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(helplogdir, "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)