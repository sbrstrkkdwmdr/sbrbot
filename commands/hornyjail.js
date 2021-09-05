    module.exports = {
        name: 'hornyjail',
        description: '',
        execute(message, args) {
            if(message.member.hasPermission('ADMINISTRATOR')){ //need admin
                let user = message.mentions.users.first(); //gets the pinged user's ID
                message.channel.send(`go to horny jail ${user}`); //user.username is the pinged user
                message.channel.send('https://cdn.discordapp.com/attachments/544104638904008704/761896640956203018/Screen_Shot_2020-04-28_at_12.png')
                message.delete();
                }
                else message.channel.send("insufficient permissions")
        }
    }
    //client.commands.get('').execute(message, args)