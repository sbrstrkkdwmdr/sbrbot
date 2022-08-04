import fs = require('fs')
module.exports = {
    name: 'template',
    description: 'template text\n' +
    'Command: `sbr-command-name`\n' +
    'Options: \n' +
    '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button){

        if(message != null){
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')

        }

//==============================================================================================================================================================================================

        if(interaction != null){
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

        }

        fs.appendFileSync(`commands.log`, '\nsuccess\n\n', 'utf-8')
    }
}