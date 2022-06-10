const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')

module.exports = {
    name: '8ball',
    description: '8baleel',
    execute(message, args, currentDate, currentDateISO) {
        let rdm = ["yes", "no clue.", "知らない", "nope", "yeah", "definitely maybe not", "nah", "yeah of course", "絶対!!!", "多分", 
        "i didn't quite catch that, ask again?", "ehhhhhhh", "⠀"];
        let ball = rdm[Math.floor(Math.random() * rdm.length)];
        message.reply(String(`${ball}`))   
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - 8ball")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)