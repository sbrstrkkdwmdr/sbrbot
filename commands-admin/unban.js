module.exports = {
    name: 'unban',
    description: 'unban',
    async execute(message, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        if(message.member.permissions.has('BAN_MEMBERS')){
            console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - unban")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        const user = args[0]
        
        if(!user){
        message.reply("no user mentioned")
        }
        else {
        const member = message.guild.members.cache.get(user)
        if(member) {
        message.guild.members.unban(user)
        message.reply(`unbanned ${user} aka <@${user}>`)
        console.log(`unbanned user ${user}`)
        console.log("")}
        else {
            message.reply("User not found")
            console.log("command failed - no user")
            console.log("")
        }
    }
    } else {
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log("command executed - unban")
    let consoleloguserweeee = message.author
    console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    console.log("command failed - insufficient permissions")
    console.log("")}
    console.groupEnd()
    }
}