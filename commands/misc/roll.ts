import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'roll',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides) {
        let commanduser;
        let maxNum: number;
        let minNum: number;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                maxNum = parseInt(args[0])
                minNum = parseInt(args[1])
                if (isNaN(maxNum) || !args[0]) {
                    maxNum = 100;
                }
                if (isNaN(minNum) || !args[1]) {
                    minNum = 0
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                maxNum = obj.options.getNumber('max') ? Math.floor(obj.options.getNumber('max')) : 100;
                minNum = obj.options.getNumber('min') ? Math.floor(obj.options.getNumber('min')) : 0;
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-roll-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-roll-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-roll-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-roll-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                /* .setLabel('End') */,
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'roll',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'Maximum number',
                    value: `${maxNum}`
                },
                {
                    name: 'Minimum number',
                    value: `${minNum}`
                }]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        if (isNaN(maxNum)) {
            maxNum = 100;
        }
        if (isNaN(minNum)) {
            minNum = 0
        }
        const eq = Math.floor(Math.random() * (maxNum - minNum)) + minNum

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: `${eq}`,
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: `${eq}`,
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
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