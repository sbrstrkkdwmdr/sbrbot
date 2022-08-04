import fs = require('fs')
module.exports = {
    name: 'bookmark',
    description: 'template text\n' +
    'Command: `sbr-command-name`\n' +
    'Options: \n' +
    '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj){
        if(message != null){
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}\n`, 'utf-8')

        }

//==============================================================================================================================================================================================

        if(interaction != null){
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - Bookmark (interaction, message)\n${currentDate} | ${currentDateISO}\n recieved bookmark command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')
            //console.log(interaction)
            let link = interaction.guild.id && interaction.channel.id ? `https://discordapp.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.targetId}` : ''
            interaction.member.user.send({content: `Bookmarked message: \n${link}\n${interaction.targetId}\nContent:\`${interaction.targetMessage.content}\``})
            interaction.reply({content: 'Bookmarked!', ephemeral: true})
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `Message ID: ${interaction.targetId}\n`)
        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}