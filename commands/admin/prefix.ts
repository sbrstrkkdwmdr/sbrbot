import fs = require('fs');
import log = require('../../src/log');

module.exports = {
    name: 'prefix',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, guildSettings) {
        let commanduser;
        let newPrefix;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                newPrefix = args.join(' ');
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                newPrefix = obj.options.getString('prefix');
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
            log.commandLog('prefix', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================
        log.logFile('command',
            log.optsLog(absoluteID, [{
                name: 'Prefix',
                value: newPrefix
            }]),
            {
                guildId: `${obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const curGuildSettings = await guildSettings.findOne({ where: { guildid: obj.guildId } });
        let replymsg;
        if (curGuildSettings == null) {
            replymsg = 'Error: Guild settings not found';
        } else {
            if (typeof newPrefix != 'string' || newPrefix.length < 1) {
                newPrefix = 'sbr-';
            }
            curGuildSettings.update({
                prefix: newPrefix
            }, {
                where: { guildid: obj.guildId }
            })
            replymsg = `Prefix set to \`${newPrefix}\``;
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: replymsg,
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
                    content: replymsg,
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