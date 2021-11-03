module.exports = {
    name: 'unban',
    description: 'unban',
    async execute(message, args) {
        if(message.member.hasPermission('ADMINISTRATOR')){
        let userID = args[0]
        message.guild.members.unban(userID)
        message.reply(`unbanned ${userID}`)
    }
    }
}