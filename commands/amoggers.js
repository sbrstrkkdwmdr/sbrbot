const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'amoggers',
    description: 'Amoggers',
    execute(message, args, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - amoggers")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
        message.reply({ files: ['./files/amoggers.png'] });
    }
}
//client.commands.get('').execute(message, args)