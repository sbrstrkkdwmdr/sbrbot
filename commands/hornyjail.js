    module.exports = {
        name: 'hornyjail',
        description: '',
        execute(message, args, currentDate) {
            if(message.member.hasPermission("ADMINISTRATOR")){ //need admin
                let user = message.mentions.users.first(); //gets the pinged user's ID
                message.channel.send(`go to horny jail ${user}`); //user.username is the pinged user
                message.channel.send('https://cdn.discordapp.com/attachments/544104638904008704/761896640956203018/Screen_Shot_2020-04-28_at_12.png')
                message.delete();
                console.log(`${currentDate}`)
                console.log("command executed - hornyjail")
                let consoleloguserweeee = message.author
                console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                console.log("")
                }
                else {message.channel.send("insufficient permissions")
                console.log(`${currentDate}`)
                console.log("command executed - hornyjail")
                let consoleloguserweeee = message.author
                console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                console.log("")}
        }
    }
    //client.commands.get('').execute(message, args)