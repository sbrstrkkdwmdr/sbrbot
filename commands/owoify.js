const owoify = require('owoify-js').default
const fs = require('fs')
module.exports = {
    name: 'owoify',
    description: '',
    execute(message, args, currentDate, currentDateISO) { 
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + "command executed - owoify")
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "") 
        console.groupEnd()
        let text2owo = args.splice(0,1000).join(" ");;
        //owotext = owoify(`hello`, 'uvu');
        message.channel.send(owoify(`${text2owo}`, 'uvu'))

    }
}
//client.commands.get('').execute(message, args)