import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'checkperms',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let user;
        let commanduser;
        if (message != null && interaction == null && button == null) {
            commanduser = message.author;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - checkperms (message)
${currentDate} | ${currentDateISO}
recieved check permissions command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            if (args[0]) {
                user = message.mentions.users.first() || message.guild.members.cache.get(args.join(' '))
            } else {
                user = message.author
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - checkperms (interaction)
${currentDate} | ${currentDateISO}
recieved check permissions command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            user = interaction.options.getUser('user')
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
ID: ${absoluteID}
userID: ${user.id}
----------------------------------------------------
`, 'utf-8')
        }

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        const embed = new Discord.EmbedBuilder()

        try {
            const member = obj.guild.members.cache.get(user.id)
            const permissions = member.permissions.toArray().join(' **|** ').replace('ADMINISTRATOR', '***!!!ADMINISTRATOR!!!***')

            embed
                .setTitle(`Permissions for \`${user.username}\``)
                .setDescription(`${permissions}`)
                .setColor(colours.embedColour.admin.hex)

            if (!(cmdchecks.isAdmin(commanduser.id, obj.guildId, client) || cmdchecks.isOwner(commanduser.id))) {
                embed.setTitle(`Error`)
                embed.setDescription(`You do not have permission to use this command`)
            }
        } catch (error) { 
            embed.setTitle(`Error`)
            embed.setDescription(`An error occured while trying to get the permissions for \`${user.username}\``)
            embed.setColor(colours.embedColour.admin.hex)
        }

        if (message != null) {
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                .catch(error => { });
        }
        if (interaction != null) {
            if (cmdchecks.isOwner(interaction.member.user.id)) {
                interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false }, ephemeral: true })
                    .catch(error => { });
            } else {
                interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                    .catch(error => { });
            }
        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
success
ID: ${absoluteID}
\n\n`, 'utf-8')
    }
}