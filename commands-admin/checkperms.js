const commandchecks = require('../configs/commandchecks.js');
const fs = require('fs')
module.exports = {
    name: 'checkperms',
    description: 'Checks the permissions of a user\n' +
        'Command: `sbr-checkperms <user>`\n' +
        'Slash Command: `/checkperms [user]`' +
        'Options: \n' +
        '⠀⠀`user`: user/mention, optional. The user to check permissions of',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - checkperms (message)\n${currentDate} | ${currentDateISO}\n recieved checkperms command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            if (args[0]) {
                user = message.mentions.users.first() || message.guild.members.cache.get(args.join(' '))
            } else {
                user = message.author
            }


            /*             else {
                            return message.reply({content: 'Error'})
                        }  */
            let member = message.guild.members.cache.get(user.id)
            let permissions = member.permissions.toArray().join(' **|** ').replace('ADMINISTRATOR', '***!!!ADMINISTRATOR!!!***')



            let embed = new Discord.EmbedBuilder()
                .setTitle(`Permissions for \`${user.username}\``)
                .setDescription(`${permissions}`)
                .setColor('#C9FF93')
                ;
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
            fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - checkperms (interaction)\n${currentDate} | ${currentDateISO}\n recieved checkperms command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            if (interaction.options.getUser('user')) {
                let user = interaction.options.getUser('user')
                let member = interaction.guild.members.cache.get(user.id)
                let permissions = member.permissions.toArray().join(' **|** ').replace('ADMINISTRATOR', '***!!!ADMINISTRATOR!!!***')



                let embed = new Discord.EmbedBuilder()
                    .setTitle(`Permissions for \`${user.username}\``)
                    .setDescription(`${permissions}`)
                    .setColor('#C9FF93')
                    ;
                if (commandchecks.isOwner(interaction.member.user.id)) {
                    interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
                } else {
                    interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                }
                fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user} AKA ${user.tag}`)
            }
            else {
                interaction.reply({ content: 'Error', allowedMentions: { repliedUser: false } })
            }

        }
    }
}