const { User } = require("discord.js")

module.exports = {
    name: 'ghostping',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        if(message.member.hasPermission('ADMINISTRATOR')){
            let pinged = message.mentions.users.first();
            if(pinged = 'undefined'){
                message.channel.send("user ID undefined")
                console.log(`${currentDateISO} | ${currentDate}`)
                console.log("command executed - ghostping")
                let consoleloguserweeee = message.author
                console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                console.log("command failed - no user ID")
                console.log("")
            }
            else{
            message.delete();
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - ghostping")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log(`pinged user - ${pinged}`)
            console.log("")
            }
        }
        else{
            let dum = message.author
            message.channel.send(`${dum} that won't work`)
            console.log(`${currentDateISO} | ${currentDate}`)
            console.log("command executed - ghostping")
            let consoleloguserweeee = message.author
            console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
            console.log("command failed - insufficient permissions")
            console.log("")
        }  
    }
}
//client.commands.get('').execute(message, args)