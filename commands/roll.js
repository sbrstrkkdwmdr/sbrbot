module.exports = {
    name: 'roll',
    description: 'w',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - roll (message)\n${currentDate} | ${currentDateISO}\n recieved roll command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            if (!args[0] || parseInt(args[0]) < 1) {
                message.channels.send(Math.floor(Math.random() * 100 + 1))
            } else {
                message.channels.send(Math.floor(Math.random() * args[0] + 1))
            }
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - roll (message)\n${currentDate} | ${currentDateISO}\n recieved roll command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            let num = interaction.options.getNumber('number')
            if(!num){
                interaction.reply(Math.floor(Math.random() * 100 + 1))
            } else {
                interaction.reply(Math.floor(Math.random() * num + 1))
            }
        }
    }
}