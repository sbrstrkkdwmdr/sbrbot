import fs = require('fs')
module.exports = {
    name: 'bookmark',
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
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - Bookmark (interaction, message)\n${currentDate} | ${currentDateISO}\n recieved bookmark command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            //console.log(interaction)
            let link = interaction.guild.id && interaction.channel.id ? `https://discordapp.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.targetId}` : ''
            interaction.member.user.send({content: `Bookmarked message: \n${link}\n${interaction.targetId}\nContent:\`${interaction.targetMessage.content}\``})
            interaction.reply({content: 'Bookmarked!', ephemeral: true})
            fs.appendFileSync(`commands.log`, `Message ID: ${interaction.targetId}`)
        }

        fs.appendFileSync(`commands.log`, 'success\n\n', 'utf-8')
    }
}