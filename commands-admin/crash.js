const fs = require('fs')
module.exports = {
    name: 'crash',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.author.id == '503794887318044675'){
            fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
            //message.reply("✔"); for some reason this line gets skipped
            fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('admincmd.log', "\n" + "command executed - force crash")
            fs.appendFileSync('admincmd.log', "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('admincmd.log', "\n" + "");
            process.exit();
            }
  
        else {
            message.channel.send("sorry you cannot use this command")
            fs.appendFileSync('admincmd.log', "\n" + `${currentDate}`)
            fs.appendFileSync('admincmd.log', "\n" + "command executed - force crash")
            fs.appendFileSync('admincmd.log', "\n" + "category - admin")
            let consoleloguserweeee = message.author
            fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('admincmd.log', "\n" + "command failed - insufficient permissions")
            fs.appendFileSync('admincmd.log', "\n" + "")
        }  
          console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)