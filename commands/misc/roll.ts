import fs = require('fs')

module.exports = {
    name: 'roll',
    description: 'w',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let roll:string;
        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - roll (message)\n${currentDate} | ${currentDateISO}\n recieved roll command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            if (!args[0] || parseInt(args[0]) < 1) {
                roll = `${Math.floor(Math.random() * 100 + 1)}`
            } else {
                roll = `${Math.floor(Math.random() * args[0] + 1)}`
            }
            message.reply({ content: `${roll}`, allowedMentions: { repliedUser: false } })
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nMessage content: ${message.content}\n`)

        }
        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - roll (interaction)\n${currentDate} | ${currentDateISO}\n recieved roll command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let num = interaction.options.getNumber('number')
            if (!num) {
                roll = `${Math.floor(Math.random() * 100 + 1)}`
            } else {
                roll = `${Math.floor(Math.random() * num + 1)}`
            }
            interaction.reply({ content: roll, allowedMentions: { repliedUser: false } })
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nnum: ${num}\n`)
        }
    }
}