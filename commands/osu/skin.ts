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
    name: 'skin',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let string: string;
        let searchid: string;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;

                string = args.join(' ')

            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                string = obj.options.getString('string')
                if (!string) {
                    string = obj.options.getUser('user');
                }
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
            log.commandLog('skin', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [
                {
                    name: 'String',
                    value: string
                },
                {
                    name: 'Search ID',
                    value: searchid
                }
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        let userF;
        let findType: 'string' | 'id'
        switch (true) {
            case (searchid != commanduser.id): {
                findType = 'id'
            }
                break;
            case (string != null || string.length > 0): {
                findType = 'string'
            }
                break;
            default: {
                findType = 'id'
            }
        }

        const allUsers = await userdata.findAll()

        if (findType == 'id') {
            userF = allUsers.find(user => user.id == searchid)
        } else {
            userF = allUsers.find(user => user.osuname.toLowerCase().includes(string.toLowerCase()))
        }
        let skinstring;
        if (userF) {
            skinstring = `${userF.dataValues.skin}`
        } else {
            skinstring = `User is not saved in the database`
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${userF.osuname}'s skin`)
            .setDescription(skinstring)


        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [embed],
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
                    content: '',
                    embeds: [embed],
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