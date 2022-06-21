const fs = require('fs')
module.exports = {
    name: 'checkperms',
    description: 'Checks the permissions of a user',
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



            let embed = new Discord.MessageEmbed()
                .setTitle(`Permissions for \`${user.username}\``)
                .setDescription(`${permissions}`)
                .setColor('#C9FF93')
                ;
            message.reply({ embeds: [embed] })
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - checkperms (interaction)\n${currentDate} | ${currentDateISO}\n recieved checkperms command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            if (interaction.options.getUser('user')) {
                let user = interaction.options.getUser('user')
                let member = interaction.guild.members.cache.get(user.id)
                let permissions = member.permissions.toArray().join(' **|** ').replace('ADMINISTRATOR', '***!!!ADMINISTRATOR!!!***')



                let embed = new Discord.MessageEmbed()
                    .setTitle(`Permissions for \`${user.username}\``)
                    .setDescription(`${permissions}`)
                    .setColor('#C9FF93')
                    ;
                interaction.reply({ embeds: [embed] })
            }
            else {
                interaction.reply({ content: 'Error' })
            }

        }
    }
}