const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
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
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + `command executed - giveadmin`)
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)