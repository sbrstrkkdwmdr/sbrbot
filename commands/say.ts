import fs = require('fs')
import commandchecks = require('../configs/commandchecks');
const defaulttext = require('../configs/w').chocomint

module.exports = {
    name: 'say',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - say (message)\n${currentDate} | ${currentDateISO}\n recieved say command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            if (commandchecks.isOwner(message.author.id)) {
                message.delete();
                if(!args[0]){
                    message.channel.send(defaulttext.substring(0, defaulttext.length / 2))
                    message.channel.send(defaulttext.substring(defaulttext.length / 2, defaulttext.length))
                    return
                }

                message.channel.send(args.join(' '))
            } else {
                message.reply({ content: 'L + ratio + no + you do not have permissions + no bitches + L', allowedMentions: { repliedUser: false } })
            }
            return;
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - say (interaction)\n${currentDate} | ${currentDateISO}\n recieved say command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let msg = interaction.options.getString('message')
            let channel = interaction.options.getChannel('channel')
            //console.log(channel)
            if (!channel) {
                channel = interaction.channel
            }
            if (commandchecks.isOwner(interaction.member.user.id)) {
                interaction.reply({ content: 'success', ephemeral: true, allowedMentions: { repliedUser: false } })
                channel.send(`${msg}`)
            } else {
                interaction.reply({ content: 'L + ratio + no permissions 🥺🥺🥺', ephemeral: true, allowedMentions: { repliedUser: false } })
            }
        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}