import fs = require('fs')
module.exports = {
    name: 'find',
    description: 'returns name from the id given',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        let Embedr = new Discord.EmbedBuilder()
            .setTitle('Could not find the id')
            .setDescription('Does not exist or bot is not in the same guild')

            ;
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - find (message)\n${currentDate} | ${currentDateISO}\n recieved find by id command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let type = args[0];
            let id = args[1];
            if (!args[0]) {
                message.reply({ content: 'Please specify a type of id to find (user/guild/channel/role/emoji)', allowedMentions: { repliedUser: false } });
                return;
            }
            if(message.mentions.users.size > 0){
                id = message.mentions.users.first().id
            }
            if(message.mentions.channels.size > 0){
                id = message.mentions.channels.first().id
            }
            if(message.mentions.roles.size > 0){
                id = message.mentions.roles.first().id
            }
            if (!args[1] || isNaN(args[1]) || !(message.mentions.users.size = 1 && args[0] == 'user') || !(message.mentions.channels.size = 1 && args[0] == 'channel') || !(message.mentions.roles.size = 1 && args[0] == 'roles')) {
                message.reply({ content: 'Please specify an id to find', allowedMentions: { repliedUser: false } });
                return;
            }
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
                    message.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });

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
                    message.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });
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
                    message.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });

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
                    message.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });

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
                    message.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });
                    break;
                default:
                    message.reply({ content: 'Error - invalid search parameters. Valid params are: user, guild, channel, role', allowedMentions: { repliedUser: false } });
                    break;
            }

        }
        //==============================================================================================================================================================================================
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - find (interaction)\n${currentDate} | ${currentDateISO}\n recieved find by id command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let type = interaction.options.getString('type');
            let id = interaction.options.getString('id');
            if (parseInt(id) == NaN) {
                return interaction.reply({ content: 'IDs must be integers', allowedMentions: { repliedUser: false } });
            }
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



                    interaction.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });

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
                    interaction.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });
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
                    interaction.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });

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
                    interaction.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });

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
                    interaction.reply({ embeds: [Embedr], allowedMentions: { repliedUser: false } });
                    break;
                default:
                    interaction.reply({ content: 'Error - invalid search parameters. Valid params are: user, guild, channel, role', allowedMentions: { repliedUser: false } });
                    break;
            }
        }
    }
}