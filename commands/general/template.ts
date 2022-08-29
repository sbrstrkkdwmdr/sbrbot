import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
import calc = require('../../calc/calculations');
import emojis = require('../../configs/emojis');

module.exports = {
    name: 'COMMANDNAME',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;
        let baseCommandType;
        if (message != null && interaction == null && button == null) {
            commanduser = message.author;
            baseCommandType = 'message';
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            commanduser = interaction.member.user;
            baseCommandType = 'interaction';
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            baseCommandType = 'button';
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
        `
----------------------------------------------------
COMMAND EVENT - COMMANDNAME (${baseCommandType})
${currentDate} | ${currentDateISO}
recieved COMMANDNAME command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')

        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}

----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================



        //SEND/EDIT MSG==============================================================================================================================================================================================

        if (message != null && interaction == null && button == null) {
            message.reply({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                content: '',
                embeds: [],
                files: [],
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