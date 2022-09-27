import cmdchecks = require('../../src/checks');
import fs = require('fs');
import colours = require('../../src/consts/colours');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'checkperms',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let searchUser;
        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                if (args[0]) {
                    if (obj.mentions.users.size > 0) {
                        searchUser = obj.mentions.users.first();
                    } else {
                        searchUser = client.users.cache.get(args.join(' '))
                    }
                } else {
                    searchUser = commanduser;
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                if (obj.options.getUser('user')) {
                    searchUser = obj.options.getUser('user');
                } else {
                    searchUser = commanduser;
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
            log.commandLog('checkperms', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [
                {
                    name: 'User',
                    value: searchUser.id ?? commanduser.id
                }
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )


        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (searchUser == null || typeof searchUser == 'undefined') {
            searchUser = commanduser;
        }
        if (!(cmdchecks.isAdmin(commanduser.id, obj.guildId, client) || cmdchecks.isOwner(commanduser.id))) {
            searchUser = commanduser;
        }


        const embed = new Discord.EmbedBuilder()
        try {
            const userAsMember = obj.guild.members.cache.get(searchUser.id);
            //get perms
            const perms = userAsMember.permissions.toArray().join(' **|** ');

            embed
                .setTitle(`${searchUser.username}'s Permissions`)
                .setDescription(`**${perms}**`)
                .setColor(colours.embedColour.admin.dec)

        } catch (err) {
            embed.setTitle('Error')
                .setDescription('An error occured while trying to get the permissions of the user.')
                .setColor(colours.embedColour.admin.dec)

        }




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