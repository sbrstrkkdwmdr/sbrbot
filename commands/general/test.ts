import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
import calc = require('../../calc/calculations');
import emojis = require('../../configs/emojis');
import disc = require('discord.js');

module.exports = {
    name: 'test',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser

        if (message != null && interaction == null && button == null) {
            commanduser = message.author
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - COMMANDNAME (message)
${currentDate} | ${currentDateISO}
recieved COMMANDNAME command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            commanduser = interaction.member.user
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - COMMANDNAME (interaction)
${currentDate} | ${currentDateISO}
recieved COMMANDNAME command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - COMMANDNAME (interaction)
${currentDate} | ${currentDateISO}
recieved COMMANDNAME command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')

            const menu: disc.ModalBuilder = new Discord.ModalBuilder()
                .setTitle('Test')
                .setCustomId('myModal')
                .addComponents(new Discord.ActionRowBuilder()
                .addComponents(new Discord.TextInputBuilder()
                    .setCustomId('favoriteColorInput')
                    .setLabel("What's your favorite color?")
                    .setStyle(Discord.TextInputStyle.Short)
                    ));
            interaction.showModal(menu);
            return;
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}

----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`search-test-${commanduser.id}`)
                    .setLabel('test')
                    .setStyle('Primary')
                    .setEmoji('🔍')
            )

        const embed = new Discord.EmbedBuilder()
            .setTitle('test')
            .setDescription('test L')

        //SEND/EDIT MSG==============================================================================================================================================================================================

        if (message != null && interaction == null && button == null) {
            message.reply({
                content: '',
                embeds: [embed],
                components: [buttons],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                content: '',
                embeds: [embed],
                components: [buttons],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [embed],
                components: [buttons],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}