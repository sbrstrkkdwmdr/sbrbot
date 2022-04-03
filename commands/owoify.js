const owoify = require('owoify-js').default
const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'owoify',
    description: '',
    execute(message, args, currentDate, currentDateISO) { 
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - owoify")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "") 
        console.groupEnd()
        let text2owo = args.splice(0,1000).join(" ");;
        //owotext = owoify(`hello`, 'uvu');
        message.channel.send(owoify(`${text2owo}`, 'uvu'))

    }
}
//client.commands.get('').execute(message, args)