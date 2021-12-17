module.exports = {
    name: 'unban',
    description: 'unban',
    async execute(message, args) {
        if(message.member.hasPermission('ADMINISTRATOR')){
        let userID = args[0]
        message.guild.members.unban(userID)
        message.reply(`unbanned ${userID}`)
        console.log("command executed - unban")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log(`unbanned user ${userID}`)
        console.log("")
    }
    console.log("command executed - unban")
    let consoleloguserweeee = message.author
    console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    console.log("command failed - insufficient permissions")
    console.log("")
    }
}