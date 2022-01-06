const { joinrole } = require('../osuauth.json');
const { guildid } = require('../osuauth.json');
module.exports = {
    name: 'join',
    description: '',
    execute(message, args, user, currentDate, currentDateISO) {
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - join")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        let we = message.guild.id
        if(we != guildid){ //if guild is ss
            message.reply("that command does not work here.")
 } else {
            //some variables
    
            if(message.member.roles.cache.has(joinrole)){
                message.reply("You already have this role") //if has role
                user.reply("ms")
            } else {
                let user = message.author
                message.channel.send(`adding role to ${user}`)
                message.member.roles.add(joinrole)
                console.log(`added role to ${user}`)
                console.log("")
            }
        }
    }
}
//client.commands.get('').execute(message, args)