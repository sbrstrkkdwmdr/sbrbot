import fs = require('fs');
import colours = require('../../src/consts/colours');
import Discord = require('discord.js');
import log = require('../../src/log');
import def = require('../../src/consts/defaults');

module.exports = {
    name: 'say',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let msg;
        let channel;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                channel = obj.channel;
                msg = args.join(' ')
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                channel = obj.options.getChannel('channel');
                if (channel == null || channel == undefined) {
                    channel = obj.channel;
                }
                msg = obj.options.getString('message');
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
            log.commandLog('say', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [
                {
                    name: 'Message',
                    value: msg
                },
                {
                    name: 'Channel',
                    value: channel.id
                }
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )


        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (msg.length < 1) {
            msg = def.chocoMOF
        }
        if (msg == def.chocoMOF) {
            channel.send({
                embeds: [new Discord.EmbedBuilder()
                    .setDescription(msg)
                    .setColor(colours.embedColour.info.dec)
                ]
            })
        } else {
            channel.send({ content: msg })
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                //literally do nothing
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: 'success!',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true,
                    ephemeral: true
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