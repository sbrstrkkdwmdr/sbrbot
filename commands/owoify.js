const owoify = require('owoify-js').default

module.exports = {
    name: 'owoify',
    description: '',
    execute(message, args, currentDate, currentDateISO) { 
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - owoify")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        console.groupEnd()
        let text2owo = args.splice(0,1000).join(" ");;
        //owotext = owoify(`hello`, 'uvu');
        message.channel.send(owoify(`${text2owo}`, 'uvu'))

    }
}
//client.commands.get('').execute(message, args)