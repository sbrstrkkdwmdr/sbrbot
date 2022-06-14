const fs = require('fs')
const { helplogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')

module.exports = {
    name: 'helpalt',
    description: 'Usage: sbr-help [commandname]',
    execute(message, args, client, currentDate, currentDateISO) {
        fs.appendFileSync(helplogdir, "\n" + '--- COMMAND EXECUTION ---')
        let helper = args[0]
        if (!helper) {
            message.channel.send('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmd')
        }
        else {

            let desc = `command "${helper}" not found\ncommands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmd\nNote: some commands have different module names so they may not show up with the help command\nFor slash commands try [name]slash`
            try {
                if (client.commands.get(`${args[0]}`)) {
                    desc = client.commands.get(`${args[0]}`).description

                } else if (client.linkdetect.get(`${args[0]}`)) {
                    desc = client.linkdetect.get(`${args[0]}`).description
                }
                else if (client.osucmds.get(`${args[0]}`)) {
                    desc = client.osucmds.get(`${args[0]}`).description
                }
                else if (client.altosucmds.get(`${args[0]}`)) {
                    desc = client.altosucmds.get(`${args[0]}`).description

                }
                else if (client.admincmds.get(`${args[0]}`)) {
                    desc = client.admincmds.get(`${args[0]}`).description

                }
                else if (client.helpcmds.get(`${args[0]}`)) {
                    desc = client.helpcmds.get(`${args[0]}`).description

                }
                else if (client.musiccmds.get(`${args[0]}`)) {
                    desc = client.musiccmds.get(`${args[0]}`).description

                }
                else if (client.otherstuff.get(`${args[0]}`)) {
                    desc = client.otherstuff.get(`${args[0]}`).description

                } else {
                }
            } catch (e) {
                fs.appendFileSync(helplogdir, "\n" + `${currentDateISO} | ${currentDate}`)
                fs.appendFileSync(helplogdir, "\n" + "command executed - help")
                fs.appendFileSync(helplogdir, "\n" + "category - help")
                let consoleloguserweeee = message.author
                fs.appendFileSync(helplogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                fs.appendFileSync(helplogdir, "\n" + getStackTrace(e))
                fs.appendFileSync(helplogdir, "\n" + e)
                fs.appendFileSync(helplogdir, "\n" + "")
            }
            message.channel.send(desc)
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