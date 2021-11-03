module.exports = {
    name: 'unban',
    description: 'ERADICATE',
    async execute(message, args) {
        let userID = args[0]
        message.guild.members.unban(userID)
        message.reply(`unbanned ${userID}`)
    }
}