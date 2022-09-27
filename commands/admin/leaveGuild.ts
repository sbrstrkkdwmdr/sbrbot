import cmdchecks = require('../../src/checks');
import fs = require('fs');
import log = require('../../src/log');

module.exports = {
    name: 'leaveguild',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let guildId;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                guildId = obj.guildId;
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                guildId = obj.options.getString('guild') ?? obj.guildId;
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
            log.commandLog('leaveguild', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [
                {
                    name: 'Guild Id',
                    value: guildId
                }
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        if (cmdchecks.isOwner(commanduser.id)) {
            const guild = client.guilds.cache.get(guildId);
            if (guild) {
                guild.leave();
            }
            return;
        }
        if (cmdchecks.isAdmin(commanduser.id, obj.guildId, client)) {
            const guild = client.guilds.cache.get(obj.guildId);
            if (guild) {
                guild.leave();
            }
            return;
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: 'You are not allowed to use this command.',
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
                    content: 'You are not allowed to use this command.',
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