import commandchecks = require('../../calc/commandchecks');
import fs = require('fs')
import colours = require('../../configs/colours');
module.exports = {
    name: 'checkperms',
    description: 'Checks the permissions of a user\n' +
        'Command: `sbr-checkperms <user>`\n' +
        'Slash Command: `/checkperms [user]`' +
        'Options: \n' +
        '⠀⠀`user`: user/mention, optional. The user to check permissions of',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        if (message != null) {
            let user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - checkperms (message)\n${currentDate} | ${currentDateISO}\n recieved checkperms command\nrequested by ${message.author.id} AKA ${message.author.tag}\n`, 'utf-8')
            if (args[0]) {
                user = message.mentions.users.first() || message.guild.members.cache.get(args.join(' '))
            } else {
                user = message.author
            }
            let member = message.guild.members.cache.get(user.id)
            let permissions = member.permissions.toArray().join(' **|** ').replace('ADMINISTRATOR', '***!!!ADMINISTRATOR!!!***')



            let embed = new Discord.EmbedBuilder()
                .setTitle(`Permissions for \`${user.username}\``)
                .setDescription(`${permissions}`)
                .setColor(colours.embedColour.admin.hex)
                ;
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                .catch(error => { });
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nmessage content: ${message.content}\n`)

        }
        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - checkperms (interaction)\n${currentDate} | ${currentDateISO}\n recieved checkperms command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')
            if (interaction.options.getUser('user')) {
                let user = interaction.options.getUser('user')
                let member = interaction.guild.members.cache.get(user.id)
                let permissions = member.permissions.toArray().join(' **|** ').replace('ADMINISTRATOR', '***!!!ADMINISTRATOR!!!***')



                let embed = new Discord.EmbedBuilder()
                    .setTitle(`Permissions for \`${user.username}\``)
                    .setDescription(`${permissions}`)
                    .setColor(colours.embedColour.admin.hex)
                    ;
                if (commandchecks.isOwner(interaction.member.user.id)) {
                    interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
                        .catch(error => { });
                } else {
                    interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                        .catch(error => { });
                }
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nuser: ${user} AKA ${user.tag}\n`)
            }
            else {
                interaction.reply({ content: 'Error', allowedMentions: { repliedUser: false } })
                    .catch(error => { });
            }

        }
    }
}