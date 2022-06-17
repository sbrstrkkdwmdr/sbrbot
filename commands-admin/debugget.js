const fs = require("fs");
const { adminlogdir } = require('../logconfig.json')
const path = require('path')

module.exports = {
    name: 'debugget',
    description: 
    'Returns debug files' + 
    '\nUsage: `sbr-debugget [name.json]`' + 
    '\nExample: `sbr-debugget rs.json`',
    //ownerOnly: true,

    execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
            let debugfile = 'debug/' + args[0] + '.json'
            if (fs.existsSync(debugfile)) {
                if(message.content.includes('osuauth', 'config') && message.author.id != '503794887318044675') return message.channel.send('no')
                message.channel.send({content: `json file "${debugfile}"`, files: [debugfile]})
            }
        else {
            //fs.appendFileSync(adminlogdir, "\n" + 'error')
            let debugdir = fs.readdirSync('debug')
            let alldebugfiles = debugdir.toString().replaceAll(',', ', ')
            message.channel.send(
                'error - file doesn\'t exist' + 
                `\nAll files:\n${alldebugfiles}`
            )
        }
        fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(adminlogdir, "\n" + "command executed - debug get")
        fs.appendFileSync(adminlogdir, "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(adminlogdir, "\n" + "")
        
        //else return message.channel.send('insufficient permissions')
        console.groupEnd()
        }
}
//client.commands.get('').execute(message, args)