import fs = require('fs');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'roll',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
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


        //==============================================================================================================================================================================================

        log.logFile(
            'command',
            log.commandLog('roll', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [
                {
                    name: 'Maximum number',
                    value: maxNum
                },
                {
                    name: 'Minimum number',
                    value: minNum
                }
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )

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



        log.logFile('command',
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`,
            { guildId: `${obj.guildId}` }
        )
    }
}