import commandchecks = require('../../calc/commandchecks');
import fs = require('fs')
module.exports = {
    name: 'servers',
    description: 'Lists all servers the bot is in\n' +
        'Command: `sbr-servers`\n' +
        'Slash Command: `/servers`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {

        let servers = client.guilds.cache.map(guild => `\`||\` **${guild.name}** => \`${guild.id}\` | <@${guild.ownerId}> \`||\``)


        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - SERVERS (message)\n${currentDate} | ${currentDateISO}\n recieved SERVERS command\nrequested by ${message.author.id} AKA ${message.author.tag}\n`, 'utf-8')

            message.reply({ content: 'Servers:\n' + servers, allowedMentions: { repliedUser: false } })
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nmessage content: ${message.content}\n`)

        }
        if (interaction != null) {

            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - SERVERS (interaction)\n${currentDate} | ${currentDateISO}\n recieved SERVERS command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')
            if (commandchecks.isOwner(interaction.member.user.id)) {
                interaction.reply({ content: 'Servers:\n ' + servers, ephemeral: true, allowedMentions: { repliedUser: false } })
            } else {
                interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true, allowedMentions: { repliedUser: false } })
            }
        }

    }
}