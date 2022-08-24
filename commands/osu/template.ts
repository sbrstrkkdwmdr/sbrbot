import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import calc = require('../../calc/calculations');
import emojis = require('../../configs/emojis');
import colours = require('../../configs/colours');
import osufunc = require('../../calc/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../configs/osuApiTypes');


module.exports = {
    name: 'COMMANDNAME',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;


        if (message != null && interaction == null && button == null) {
            commanduser = message.author;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - COMMANDNAME (message)
${currentDate} | ${currentDateISO}
recieved COMMANDNAME command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - COMMANDNAME (interaction)
${currentDate} | ${currentDateISO}
recieved COMMANDNAME command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - COMMANDNAME (interaction)
${currentDate} | ${currentDateISO}
recieved COMMANDNAME command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-COMMANDNAME-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-COMMANDNAME-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-COMMANDNAME-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-COMMANDNAME-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    /* .setLabel('End') */,
            );
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
Options: 
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