import cmdchecks = require('../../src/checks');
import fs = require('fs');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'find',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let type;
        let id;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                type = args[0];
                id = args[1];
                if (obj.mentions.users.size > 0) {
                    type = 'user';
                    id = obj.mentions.users.first().id;
                }
                if (obj.mentions.channels.size > 0) {
                    type = 'channel';
                    id = obj.mentions.channels.first().id
                }
                if (obj.mentions.roles.size > 0) {
                    type = 'role';
                    id = obj.mentions.roles.first().id
                }
                if (obj.content.includes('<:') && !isNaN(obj.content.split('<:')[1].split('>')[0].split(':')[1])) {
                    type = 'emoji';
                    id = obj.content.split('<:')[1].split('>')[0].split(':')[1]
                }
                if (isNaN(id) && (!(obj.mentions.users.size > 0 && type == 'user') || !(obj.mentions.channels.size > 0 && type == 'channel') || !(obj.mentions.roles.size == 1 && type == 'roles'))) {
                    obj.reply({ content: 'Please specify an id to find', allowedMentions: { repliedUser: false } })
                        .catch(error => { });
                    return;
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                type = obj.options.getString('type');
                id = obj.options.getString('id');
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
                'find',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                []
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================



        const Embedr = new Discord.EmbedBuilder()
            .setTitle(`Error`)
            .setThumbnail(`https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
            .setDescription(`${type} does not exist or bot is not in the same guild as the ${type}`);

        switch (type) {
            case 'user':
                {
                    let userfind;
                    client.guilds.cache.forEach(guild => {
                        if (guild.members.cache.has(id)) {
                            userfind = guild.members.cache.get(id)//.user.tag
                            let up = 'null or offline status';
                            if (userfind.presence) {
                                up = '';
                                for (let i = 0; i < userfind.presence.activities.length; i++) {
                                    /*                                     up += `
                                                                    ${userfind.presence.status}
                                                                    ${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].name : ''}
                                                                    ${userfind.presence.activities.length > 0 ? 'Activity Type: [' + userfind.presence.activities[i].type + '](https://discord.com/developers/docs/topics/gateway#activity-object-activity-types)': ''}
                                                                    \`${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].state : ''}\`
                                                                    ` */
                                    let t
                                    switch (userfind.presence.activities[i].type) {
                                        case 0:
                                            t = 'Playing'
                                            break;
                                        case 1:
                                            t = 'Streaming'
                                            break;
                                        case 2:
                                            t = 'Listening'
                                            break;
                                        case 3:
                                            t = 'Watching'
                                            break;
                                        case 4:
                                            t = 'Custom Status'
                                            break;
                                        case 5:
                                            t = 'Competing in'
                                            break;
                                        default:
                                            t = 'Unknown Activity Type'
                                            break;

                                    }
                                    up += `
                        ${t} ${userfind.presence.activities.length > 0 && t != 'Custom Status' ? `\`${userfind.presence.activities[i].name}\`` : ''}
                        \`${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].state : ''}\`
                        `
                                }
                            }

                            Embedr.setTitle(`${userfind.user.tag} ${userfind.user.bot ? '<:bot:958289108147523584>' : ''}`)
                            Embedr.setThumbnail(`${userfind.user.avatarURL()}`);
                            Embedr.setDescription(
                                `ID: ${userfind.user.id}
                        Status: ${up}
                        Account creation date: ${userfind.user.createdAt}
                        Bot: ${userfind.user.bot}
                        Flags: ${userfind.user.flags.toArray().join(',')}
                        `);
                            return;
                        }
                    })
                }
                break;
            case 'guild':
                {
                    if (!(cmdchecks.isOwner(commanduser.id) || (id == obj.guildId && cmdchecks.isAdmin(commanduser.id, obj.guildId, client)))) {
                        Embedr.setDescription('You don\'t have permissions to use this command')
                    } else {
                        let guildfind;
                        client.guilds.cache.forEach(guild => {
                            if (guild.id == id) {
                                guildfind = guild
                                Embedr.setTitle(`${guildfind.name}`);
                                if (guildfind.iconURL()) {
                                    Embedr.setThumbnail(`${guildfind.iconURL()}`);
                                }
                                if (guildfind.bannerURL()) {
                                    Embedr.setImage(`${guildfind.bannerURL()}`);
                                }
                                Embedr.setDescription(`
                    ID: ${guildfind.id}
                    Owner: <@${guildfind.ownerId}>
                    Total user count: ${guildfind.members.cache.size}
                    Total channel count: ${guildfind.channels.cache.size}
                    Creation date: ${guildfind.createdAt}
                    `)
                                return;
                            }
                        })
                    }
                }
                break;
            case 'channel':
                {
                    if (!(cmdchecks.isOwner(commanduser.id) || cmdchecks.isAdmin(commanduser.id, obj.guildId, client))) {
                        Embedr.setDescription('You don\'t have permissions to use this command')
                    } else {
                        let channelfind;
                        client.guilds.cache.forEach(guild => {
                            if (guild.channels.cache.has(id)) {
                                channelfind = guild.channels.cache.get(id)
                                Embedr.setTitle(`Channel: #${channelfind.name}`);
                                if (guild.iconURL()) {
                                    Embedr.setThumbnail(`${guild.iconURL()}`);
                                }
                                Embedr.setDescription(`
                    ID: ${channelfind.id}
                    Topic: ${channelfind.topic}
                    [Type: ${channelfind.type}](https://discord-api-types.dev/api/discord-api-types-v10/enum/ChannelType)
                    Parent: ${channelfind.parent ? channelfind.parent.name : 'No parent'} ${channelfind.parent ? '| ' + channelfind.parent.id + ' | Type ' + channelfind.parent.type : ''}
                    Guild: ${guild.name} | ${guild.id}
                    `)
                                return;
                            }
                        })
                    }
                }
                break;
            case 'role':
                {
                    if (!(cmdchecks.isOwner(commanduser.id) || cmdchecks.isAdmin(commanduser.id, obj.guildId, client))) {
                        Embedr.setDescription('You don\'t have permissions to use this command')
                    } else {
                        let rolefind;
                        client.guilds.cache.forEach(guild => {
                            if (guild.roles.cache.has(id)) {
                                rolefind = guild.roles.cache.get(id)
                                Embedr.setTitle(`Role: ${rolefind.name}`);
                                if (guild.iconURL()) {
                                    Embedr.setThumbnail(`${guild.iconURL()}`);
                                }
                                Embedr.setDescription(`
                    ID: ${rolefind.id}
                    Colour: [${rolefind.color ? rolefind.color : 'null'}](https://discord.js.org/#/docs/discord.js/main/class/Role?scrollTo=color)
                    Emoji: ${rolefind.unicodeEmoji ? rolefind.unicodeEmoji : 'null'}
                    Guild: ${guild.name} | ${guild.id}
                    `)
                                Embedr.setColor(rolefind.color);
                                return;
                            }
                        })
                    }
                }
                break;
            case 'emoji': {
                let emojifind;
                client.guilds.cache.forEach(guild => {
                    if (guild.emojis.cache.has(id)) {
                        emojifind = guild.emojis.cache.get(id)
                        Embedr.setTitle(`Emoji: ${emojifind.name}`);
                        if (emojifind.url) {
                            Embedr.setThumbnail(`${emojifind.url}`);
                        }
                        Embedr.setDescription(`
                    ID: ${emojifind.id}
                    Emoji: \`<:${guild.emojis.cache.get(id).name}:${id}>\`
                    Guild: ${guild.name} | ${guild.id}
                    `)
                        return;
                    }
                })
            }
                break;
            default:
                Embedr.setTitle('Invalid search parameters')
                Embedr.setDescription(`
            Valid Types: user, guild, channel, role, emoji
            `)
                break;
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': case 'interaction': {
                obj.reply({
                    content: '',
                    embeds: [Embedr],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

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