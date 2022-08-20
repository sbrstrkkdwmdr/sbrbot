import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'find',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {

        let type;
        let id;

        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - find (message)
${currentDate} | ${currentDateISO}
recieved find command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            type = args[0];
            id = args[1];
            if (message.mentions.users.size > 0) {
                type = 'user';
                id = message.mentions.users.first().id;
            }
            if (message.mentions.channels.size > 0) {
                type = 'channel';
                id = message.mentions.channels.first().id
            }
            if (message.mentions.roles.size > 0) {
                type = 'role';
                id = message.mentions.roles.first().id
            }
            if (isNaN(id) && (!(message.mentions.users.size > 0 && type == 'user') || !(message.mentions.channels.size > 0 && type == 'channel') || !(message.mentions.roles.size == 1 && type == 'roles'))) {
                message.reply({ content: 'Please specify an id to find', allowedMentions: { repliedUser: false } })
                    .catch(error => { });
                return;
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - find (interaction)
${currentDate} | ${currentDateISO}
recieved find command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            type = interaction.options.getString('type');
            id = interaction.options.getString('id');
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - find (interaction)
${currentDate} | ${currentDateISO}
recieved find command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
type: ${type}
id: ${id}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        let Embedr = new Discord.EmbedBuilder();

        switch (type) {
            case 'user':
                let userfind: any = 'User not found'
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
                break;
            case 'guild':
                let guildfind: any = 'No guild found'
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
                break;
            case 'channel':
                let channelfind: any = 'Channel not found'
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

                break;
            case 'role':
                let rolefind: any = 'No role found'
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
                break;
            case 'emoji':
                let emojifind: any = 'No emoji found'
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
                break;
            default:
                Embedr.setTitle('Invalid search parameters')
                Embedr.setDescription(`
                Valid Types: user, guild, channel, role, emoji
                `)
                break;
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        if ((message != null || interaction != null) && button == null) {
            obj.reply({
                embeds: [Embedr],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch(error => {
                obj.reply({
                    content: `Error: ${type} does not exist or bot is not in the same guild as the ${type}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch(error => { });
            });

        }
        if (button != null) {
            message.edit({
                embeds: [Embedr],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
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