const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')

module.exports = {
    name: 'crash',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.author.id == '503794887318044675'){
            fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
            //message.reply("✔"); for some reason this line gets skipped
            fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(adminlogdir, "\n" + "command executed - force crash")
            fs.appendFileSync(adminlogdir, "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(adminlogdir, "\n" + "");
            process.exit();
            }
  
        else {
            message.channel.send("sorry you cannot use this command")
            fs.appendFileSync(adminlogdir, "\n" + `${currentDate}`)
            fs.appendFileSync(adminlogdir, "\n" + "command executed - force crash")
            fs.appendFileSync(adminlogdir, "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(adminlogdir, "\n" + "command failed - insufficient permissions")
            fs.appendFileSync(adminlogdir, "\n" + "")
        }  
          console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)