import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
import calc = require('../../calc/calculations');
import emojis = require('../../configs/emojis');
import extypes = require('../../configs/extratypes');

module.exports = {
    name: 'settings',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;
        let baseCommandType;

        let commandToEdit;

        if (message != null && interaction == null && button == null) {
            commanduser = message.author;
            baseCommandType = 'message';
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            commanduser = interaction.member.user;
            baseCommandType = 'interaction';
            const commandModal = new Discord.ModalBuilder()
                .setTitle(`${interaction.options.getString('setting')} settings for ${interaction.guild.name}`)
                .setCustomId(`${interaction.options.getString('setting')}-settings-${commanduser.id}`)
            switch (interaction.options.getString('setting')) {
                case 'prefix': {
                    commandModal
                        .addComponents(
                            new Discord.ActionRowBuilder()
                                .addComponents(
                                    new Discord.TextInputBuilder()
                                        .setCustomId('prefix-input')
                                        .setPlaceholder('sbr-')
                                        .setMinLength(1)
                                        .setMaxLength(10)
                                        .setStyle(Discord.TextInputStyle.Short)
                                )
                        )
                }
                    break;
                case 'admin': {
                    commandModal
                        .addComponents(
                            new Discord.ActionRowBuilder()
                                .addComponents(

                            )
                        )
                } break;
                case 'osu': { } break;
                case 'general': { } break;
                case 'misc': { } break;
                case 'music': { } break;
            }
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            baseCommandType = 'button';
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
COMMAND EVENT - settings (${baseCommandType})
${currentDate} | ${currentDateISO}
recieved settings command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')

        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
Options: 
    opts: ${JSON.stringify(commandToEdit, null, 2)}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================



        //SEND/EDIT MSG==============================================================================================================================================================================================

        if (message != null && interaction == null && button == null) {
            message.reply({
                content: 'fr',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                content: 'fr',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
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