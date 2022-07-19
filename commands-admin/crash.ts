const commandchecks = require('../configs/commandchecks.js');
const fs = require('fs')
module.exports = {
    name: 'crash',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - crash (message)\n${currentDate} | ${currentDateISO}\n recieved crash command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            if (commandchecks.isOwner(message.author.id)) {
                message.reply('oihnsofhujofsdjfsdlkf')
                message.delete();
                message.reply('balls??')
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - crash (interaction)\n${currentDate} | ${currentDateISO}\n recieved crash command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}