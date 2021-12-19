module.exports = {
    name: 'unban',
    description: 'unban',
    async execute(message, args, currentDate, currentDateISO) {
        if(message.member.permissions.has('ADMINISTRATOR')){
            console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - unban")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        let userID = args[0]
        if(!userID){
        message.reply("no user mentioned")
        }
        else {
        message.guild.members.unban(userID)
        message.reply(`unbanned ${userID}`)
        console.log(`unbanned user ${userID}`)}
        console.log("")
    }
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log("command executed - unban")
    let consoleloguserweeee = message.author
    console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    console.log("command failed - insufficient permissions")
    console.log("")
    }
}