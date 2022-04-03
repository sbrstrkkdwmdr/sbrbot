const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')
module.exports = {
    name: 'unban',
    description: 'unban',
    async execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('BAN_MEMBERS')){
            fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(adminlogdir, "\n" + "command executed - unban")
        fs.appendFileSync(adminlogdir, "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        const user = args[0]
        
        if(!user){
        message.reply("no user mentioned")
        }
        else {
        const member = message.guild.members.cache.get(user)
        if(member) {
        message.guild.members.unban(user)
        message.reply(`unbanned ${user} aka <@${user}>`)
        fs.appendFileSync(adminlogdir, "\n" + `unbanned user ${user}`)
        fs.appendFileSync(adminlogdir, "\n" + "")}
        else {
            message.reply("User not found")
            fs.appendFileSync(adminlogdir, "\n" + "command failed - no user")
            fs.appendFileSync(adminlogdir, "\n" + "")
        }
    }
    } else {
    fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
    fs.appendFileSync(adminlogdir, "\n" + "command executed - unban")
    let consoleloguserweeee = message.author
    fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    fs.appendFileSync(adminlogdir, "\n" + "command failed - insufficient permissions")
    fs.appendFileSync(adminlogdir, "\n" + "")}
    console.groupEnd()
    }
}