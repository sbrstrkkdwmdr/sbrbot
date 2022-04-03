const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'say',
    description: "say",
    execute(message, args, currentDate, currentDateISO) {
        const saythis = args.splice(0,1000).join(" ");
        message.delete();
        message.channel.send(saythis)
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - say")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
    }
}