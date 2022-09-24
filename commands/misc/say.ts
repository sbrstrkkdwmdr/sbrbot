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

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'say',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'Message',
                    value: msg
                },
                {
                    name: 'Channel',
                    value: channel.id
                }]
            ), 'utf-8')

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



        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}