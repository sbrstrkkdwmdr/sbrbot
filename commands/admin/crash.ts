import commandchecks = require('../../configs/commandchecks');
import fs = require('fs')
module.exports = {
    name: 'crash',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - crash (message)\n${currentDate} | ${currentDateISO}\n recieved crash command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}\n`, 'utf-8')
            if (commandchecks.isOwner(message.author.id)) {
                console.log('crash command triggered')
                message.channel.send('crashing')
                setTimeout(() => {
                for (let i = 0; i < 100; i++) {
                    message.reply('Running crash command...')
                    message.delete();
                    message.reply('balls??')
                }
            }, 1000)
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - crash (interaction)\n${currentDate} | ${currentDateISO}\n recieved crash command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')

        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, 'success\n\n', 'utf-8')
    }
}