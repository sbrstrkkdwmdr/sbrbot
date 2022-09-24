import fs = require('fs');
import log = require('../../src/log');
import func = require('../../src/other');

module.exports = {
    name: 'debug',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let command;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                command = args[0]
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                command = obj.options.getString('command')
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        //==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'debug',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [
                    {
                        name: 'command',
                        value: command
                    }
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const files = [];
        const readfiles = func.readAllFiles('debug/');
        let input = 'w';
        switch (command) {
            case 'compare':
                input = 'compare';
                break;
            case 'firsts':
                input = 'firsts';
                break;
            case 'map': case 'm':
                input = 'map';
                break;
            case 'maplb': case 'leaderboard': case 'mapleaderboard':
                input = 'maplb';
                break;
            case 'osu': case 'o': case 'profile':
                input = 'osu';
                break;
            case 'osutop': case 'top':
                input = 'osutop';
                break;
            case 'pinned':
                input = 'pinned';
                break;
            case 'recent': case 'rs': case 'r':
                input = 'recent';
                break;
            case 'scoreparse':
                input = 'scoreparse';
                break;
            case 'scores': case 'c':
                input = 'scores';
                break;
        }

        for (let i = 0; i < readfiles.length; i++) {
            if (readfiles[i].includes(obj.guildId) && readfiles[i].startsWith('command/' + input + '/')) {
                files.push('debug/' + readfiles[i])
            }
        }

        if (files.length == 0) {
            obj.reply({
                content: 'No debug files found',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch()
            return;
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [],
                    files: files,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: '',
                    embeds: [],
                    files: files,
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