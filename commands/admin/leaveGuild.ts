import commandchecks = require('../../calc/commandchecks');
import fs = require('fs')
module.exports = {
    name: 'leaveguild',
    description: 'Leaves the guild\n' +
        'Command: `sbr-leaveguild <id>`\n' +
        'Slash Command: `/leaveguild [id]`\n' +
        'Options: \n' +
        '    `guild`: integer, required. The id of the guild to leave\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        //config.ownerusers
        if (message != null) {
            let guild;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - LEAVEGUILD (message)\n${currentDate} | ${currentDateISO}\n recieved LEAVEGUILD command\nrequested by ${message.author.id} AKA ${message.author.tag}\n`, 'utf-8')
            if (args[0]) {
                guild = client.guilds.cache.get(args[0])
            }
            else {
                guild = message.guild
            }
            if (commandchecks.isOwner(message.author.id)) {

                message.reply({ content: 'Leaving guild...', allowedMentions: { repliedUser: false } })
                    .catch(error => { });

                guild.leave()
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, 'success\n\n', 'utf-8')
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `left guild ${guild.name} | ${guild.id}\n`, 'utf-8')
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nmessage content: ${message.content}\n`)

            } else {
                message.reply('Error - you do not have the permissions to use this command')
                    .catch(error => { });

                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, 'failed\n\n', 'utf-8')
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `${message.author.id} is not an owner\n`, 'utf-8')
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nmessage content: ${message.content}\n`)

            }
        }
        if (interaction != null) {
            /*             interaction.reply('command error - guild IDs are too long to be used in interactions. Please use the message version of this command.')
                        return */
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - LEAVEGUILD (interaction)\n${currentDate} | ${currentDateISO}\n recieved LEAVEGUILD command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')
            let guildid = interaction.options.getString('guild')
            if (isNaN(guildid)) {
                interaction.reply({ content: 'Error - invalid guild id', allowedMentions: { repliedUser: false } })
                    .catch(error => { });

                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, 'failed\n\n', 'utf-8')
            }
            let guild = client.guilds.cache.get(guildid)
            //leave guild
            if (commandchecks.isOwner(interaction.member.user.id)) {
                interaction.reply({ content: 'Leaving guild...', allowedMentions: { repliedUser: false } })
                    .catch(error => { });

                guild.leave()
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, 'success\n\n', 'utf-8')
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `left guild ${guild.name} | ${guild.id}\n`, 'utf-8')
            } else {
                interaction.reply('Error - you do not have the permissions to use this command')
                    .catch(error => { });

                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, 'failed\n\n', 'utf-8')
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `${interaction.member.user.id} is not an owner\n`, 'utf-8')
            }


        }
    }
}