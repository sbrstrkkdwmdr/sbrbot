const fs = require('fs')
const { helplogdir } = require('../logconfig.json')
module.exports = {
    name: 'helpalt',
    description: '',
    execute(message, args, client, currentDate, currentDateISO) {
        fs.appendFileSync(helplogdir, "\n" + '--- COMMAND EXECUTION ---')
        let helper = args[0]
        if(!helper){
        message.channel.send('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmd')}
        else{
            console.log(`${args[0]}`)
            console.log(client.commands.get(`${args[0]}`))

            if(client.commands.get(`${args[0]}`)){
                let desc = client.commands.get(`${args[0]}`).description
                console.log(desc)
                console.log(client.commands.get(`${args[0]}`))
            } else if (client.linkdetect.get(`${args[0]}`)){
                let desc = client.commands.get(`${args[0]}`).description
                console.log(desc)
                console.log(client.commands.get(`${args[0]}`))
            }
            else if (client.osucmds.get(`${args[0]}`)){
                let desc = client.commands.get(`${args[0]}`).description
                console.log(desc)
                console.log(client.commands.get(`${args[0]}`))
            }
            else if (client.altosucmds.get(`${args[0]}`)){}
            else if (client.admincmds.get(`${args[0]}`)){}
            else if (client.helpcmds.get(`${args[0]}`)){}
            else if (client.musiccmds.get(`${args[0]}`)){}
            else if (client.otherstuff.get(`${args[0]}`)){}

            else {
                message.channel.send(`command "${helper}" not found\ncommands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmd\nNote: some commands have different module names so they may not show up with the help command\nFor slash commands try [name]slash`)
            }
            }


        fs.appendFileSync(helplogdir, "\n" + `${currentDateISO} | ${currentDate}`)  
        fs.appendFileSync(helplogdir, "\n" + "command executed - help")
        fs.appendFileSync(helplogdir, "\n" + "category - help")
        let consoleloguserweeee = message.author
        fs.appendFileSync(helplogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(helplogdir, "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)