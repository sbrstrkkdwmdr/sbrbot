const fs = require('fs')

module.exports = {
    name: '8ball',
    description: 'w',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {

        let responses = [
            'yes', 'no', 'What? no', '知らない', 'nope', 'yeahhh', 'a strong maybe', 'definitely maybe not', 'nah', 'yeah of course', '多分', '絶対!!!',
            'come again?', 'ehhhh', '⠀', '💀', '🥺', 'bruhhh', 'splish splash your question is trash', 3
        ]

        let q = responses[Math.floor(Math.random() * responses.length)]

        if (q == 3) {
            if (message != null) return message.channel.send('sbr-gif speech bubble')
            if (interaction != null) {
                interaction.channel.send('sbr-gif speech bubble')
                interaction.reply({ content: ';)', ephemeral: true })
                return;
            }
        }

        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - 8ball (message)\n${currentDate} | ${currentDateISO}\n recieved 8ball command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            message.channel.send(q)
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - 8ball (message)\n${currentDate} | ${currentDateISO}\n recieved 8ball command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            interaction.reply(q)
        }
    }
}