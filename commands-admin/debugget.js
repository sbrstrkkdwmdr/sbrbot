const fs = require("fs");
module.exports = {
    name: 'debugget',
    description: 'debug files',
    //ownerOnly: true,

    execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
            let debugfile = 'debug/' + args[0] + '.json'
            if (fs.existsSync(debugfile)) {
                if(message.content.includes('osuauth', 'config') && message.author.id != '503794887318044675') return message.channel.send('no')
                message.channel.send({content: `json file "${debugfile}"`, files: [debugfile]})
            }
        else {
            //fs.appendFileSync('admincmd.log', "\n" + 'error')
            message.reply("error - file doesn't exist")
        }
        fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('admincmd.log', "\n" + "command executed - debug get")
        fs.appendFileSync('admincmd.log', "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('admincmd.log', "\n" + "")
        
        //else return message.channel.send('insufficient permissions')
        console.groupEnd()
        }
}
//client.commands.get('').execute(message, args)