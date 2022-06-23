module.exports = {
    name: '8ball',
    description: 'w',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {

        let responses = [
            'yes', 'no', 'What? no', '知らない', 'nope', 'yeahhh', 'a strong maybe', 'definitely maybe not', 'nah', 'yeah of course', '多分', '絶対!!!',
            'come again?', 'ehhhh', '⠀', '💀', '🥺', 'bruhhh', 'splish splash your question is trash'
        ]

        let q = responses[Math.floor(Math.random() * responses.length)]

        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - 8ball (message)\n${currentDate} | ${currentDateISO}\n recieved 8ball command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            message.channel.send(q)
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - 8ball (message)\n${currentDate} | ${currentDateISO}\n recieved 8ball command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            interaction.reply(q)
        }
    }
}