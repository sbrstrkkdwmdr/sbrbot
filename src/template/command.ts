import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../consts/emojis');
import colours = require('../consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');


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
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
COMMAND EVENT - COMMANDNAME (${baseCommandType})
${currentDate} | ${currentDateISO}
recieved COMMANDNAME command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
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
                .catch();

        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();

        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();

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