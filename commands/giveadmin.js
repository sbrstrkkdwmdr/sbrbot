const fs = require('fs')
module.exports = {
    name: 'giveadmin',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.member.permissions.has("ADMINISTRATOR")){
            message.channel.send("bro u already have it...")
        }
        else{
        message.channel.send("haha no")
        }//if(user.ID = 503794887318044675){
        //roles.create        
        //let rName =("admin")
        //message.channel.send(`${rNew.ID}`)
        //} 
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('cmd.log', "\n" + `command executed - giveadmin`)
        fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)