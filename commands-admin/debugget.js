const fs = require("fs");
module.exports = {
    name: 'debugget',
    description: 'debug files',
    //ownerOnly: true,

    execute(message, args, client, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
            let debugfile = 'debug/' + args[0] + '.json'
            if (fs.existsSync(debugfile)) {
                if(message.content.includes('osuauth', 'config') && message.author.id != '503794887318044675') return message.channel.send('no')
                message.channel.send({content: `json file "${debugfile}"`, files: [debugfile]})
            }
        else {
            //console.log('error')
            message.reply("error - file doesn't exist")
        }
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - debug get")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        
        //else return message.channel.send('insufficient permissions')
        console.groupEnd()
        }
}
//client.commands.get('').execute(message, args)