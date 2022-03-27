const fs = require('fs')
module.exports = {
    name: 'pingperson',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync('cmd.log', "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('ADMINISTRATOR')){ //they need admin
            let user = message.mentions.users.first(); //gets the pinged user's ID
            message.channel.send(`${user} `); //user.username is the pinged user
            message.delete();
            fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
            fs.appendFileSync('cmd.log', "\n" + "command executed - pingperson")
            fs.appendFileSync('cmd.log', "\n" + "category - general")
            let consoleloguserweeee = message.author
            fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            fs.appendFileSync('cmd.log', "\n" + `pinged - ${user}`)
            fs.appendFileSync('cmd.log', "\n" + "")
            }
            else {message.channel.send("Error 401: Unauthorised") 
            fs.appendFileSync('cmd.log', "\n" + `${currentDateISO} | ${currentDate}`) 
                    fs.appendFileSync('cmd.log', "\n" + "command executed - pingperson")
                    fs.appendFileSync('cmd.log', "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync('cmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('cmd.log', "\n" + "command failed - insufficent perms")
        fs.appendFileSync('cmd.log', "\n" + "")}
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)