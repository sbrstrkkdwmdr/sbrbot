const { User } = require("discord.js")
let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'ghostping',
    description: '',
    execute(message, args) {
        if(message.member.permissions.has('ADMINISTRATOR')){
            let pinged = message.mentions.users.first();
            if(!pinged){
                message.channel.send("⠀")
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