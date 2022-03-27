const fs = require('fs')
module.exports = {
    name: 'unban',
    description: 'unban',
    async execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('BAN_MEMBERS')){
            fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('admincmd.log', "\n" + "command executed - unban")
        fs.appendFileSync('admincmd.log', "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        const user = args[0]
        
        if(!user){
        message.reply("no user mentioned")
        }
        else {
        const member = message.guild.members.cache.get(user)
        if(member) {
        message.guild.members.unban(user)
        message.reply(`unbanned ${user} aka <@${user}>`)
        fs.appendFileSync('admincmd.log', "\n" + `unbanned user ${user}`)
        fs.appendFileSync('admincmd.log', "\n" + "")}
        else {
            message.reply("User not found")
            fs.appendFileSync('admincmd.log', "\n" + "command failed - no user")
            fs.appendFileSync('admincmd.log', "\n" + "")
        }
    }
    } else {
    fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
    fs.appendFileSync('admincmd.log', "\n" + "command executed - unban")
    let consoleloguserweeee = message.author
    fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    fs.appendFileSync('admincmd.log', "\n" + "command failed - insufficient permissions")
    fs.appendFileSync('admincmd.log', "\n" + "")}
    console.groupEnd()
    }
}