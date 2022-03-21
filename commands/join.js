const { joinrole } = require('../config.json');
const { guildid } = require('../config.json');
module.exports = {
    name: 'join',
    description: '',
    execute(message, args, user, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - join")
        console.log("category - general")
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
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)