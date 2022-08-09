import fs = require('fs')
import checks = require('../../calc/commandchecks')
module.exports = {
    name: 'log',
    description: 'returns the logs of the guild',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - log (message)\n${currentDate} | ${currentDateISO}\n recieved get guild logs command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}\n`, 'utf-8')
            if (checks.isOwner(message.author.id) || message.author.permissions.has('ADMINISTRATOR')) {
                let guildname = client.guilds.cache.has(message.guild.id) ? client.guilds.cache.get(message.guild.id).name : 'unknown name';
                let guildid = client.guilds.cache.has(message.guild.id) ? client.guilds.cache.get(message.guild.id).id : 'unknown id'
                message.reply({ content: `Logs for **${guildname}** \`${guildid}\``, files: [`./logs/moderator/${message.guild.id}.log`], allowedMentions: { repliedUser: false } });
            } else {
                message.reply('you do not have permission to use this command')
            }
        }
        //==============================================================================================================================================================================================
        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - log (interaction)\n${currentDate} | ${currentDateISO}\n recieved get guild logs command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')
            let guildidA = interaction.options.getString('guildid')
            if (checks.isOwner(interaction.member.user.id) && guildidA) {
                //check if log file exists
                if (isNaN(guildidA)) {
                    interaction.reply({ content: 'please enter a valid guild id', allowedMentions: { repliedUser: false } })
                }
                else if (fs.existsSync(`./logs/moderator/${guildidA}.log`)) {
                    let guildname = client.guilds.cache.has(guildidA) ? client.guilds.cache.get(guildidA).name : 'unknown name';
                    let guildid = client.guilds.cache.has(guildidA) ? client.guilds.cache.get(guildidA).id : 'unknown id'

                    interaction.reply({ content: `Logs for **${guildname}** \`${guildid}\``, files: [`./logs/moderator/${guildid}.log`], allowedMentions: { repliedUser: false } });
                } else {
                    interaction.reply('there is no log file for this guild')
                }
            }
            else if (checks.isOwner(interaction.member.user.id) || interaction.member.permissions.has('ADMINISTRATOR')) {
                let guildname = client.guilds.cache.has(interaction.guild.id) ? client.guilds.cache.get(interaction.guild.id).name : 'unknown name';
                let guildid = client.guilds.cache.has(interaction.guild.id) ? client.guilds.cache.get(interaction.guild.id).id : 'unknown id'
                interaction.reply({ content: `Logs for **${guildname}** \`${guildid}\``, files: [`./logs/moderator/${interaction.guild.id}.log`], allowedMentions: { repliedUser: false } });
            } else {
                interaction.reply('you do not have permission to use this command')
            }
        }
    }
}