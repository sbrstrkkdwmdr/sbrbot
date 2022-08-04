import fs = require('fs')
module.exports = {
    name: 'info',
    description: 'template text\n' +
    'Command: `sbr-command-name`\n' +
    'Options: \n' +
    '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj){
        if(message != null){
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')

        }

//==============================================================================================================================================================================================

        if(interaction != null){
            let Embed = new Discord.EmbedBuilder()
            .setTitle('Important links and information')
            .setDescription(`
            Prefix: ${config.prefix}
            Coded in: TypeScript
            [Github repo](https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts)
            [Creator](https://sbrstrkkdwmdr.github.io/sbr-web/)
            `)
            interaction.reply({ embeds: [Embed], ephemeral: true, allowedMentions: { repliedUser: false } });

        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, 'success\n\n', 'utf-8')
    }
}