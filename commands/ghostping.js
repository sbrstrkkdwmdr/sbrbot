const { User } = require("discord.js")

module.exports = {
    name: 'ghostping',
    description: '',
    execute(message, args) {
        if(message.member.hasPermission('ADMINISTRATOR')){
            let pinged = message.mentions.users.first();
            if(pinged = 'undefined'){
                message.channel.send("user ID undefined")
            }
            else{
            message.delete();
            }
        }
        else{
            let dum = message.author
            message.channel.send(`${dum} that won't work`)
        }  
    }
}
//client.commands.get('').execute(message, args)