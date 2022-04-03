const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name: 'pingperson',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('ADMINISTRATOR')){ //they need admin
            let user = message.mentions.users.first(); //gets the pinged user's ID
            message.channel.send(`${user} `); //user.username is the pinged user
            message.delete();
            fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync(otherlogdir, "\n" + "command executed - pingperson")
            fs.appendFileSync(otherlogdir, "\n" + "category - general")
            let consoleloguserweeee = message.author
            fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync(otherlogdir, "\n" + `pinged - ${user}`)
            fs.appendFileSync(otherlogdir, "\n" + "")
            }
            else {message.channel.send("Error 401: Unauthorised") 
            fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`) 
                    fs.appendFileSync(otherlogdir, "\n" + "command executed - pingperson")
                    fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "command failed - insufficent perms")
        fs.appendFileSync(otherlogdir, "\n" + "")}
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)