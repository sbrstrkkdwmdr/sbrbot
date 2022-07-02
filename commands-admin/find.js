const fs = require('fs')
module.exports = {
    name: 'find',
    description: 'returns name from the id given',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - find (message)\n${currentDate} | ${currentDateISO}\n recieved find by id command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let type = args[0];
            let id = args[1];
            if (!args[0]) {
                message.reply({ content: 'Please specify a type of id to find', allowedMentions: { repliedUser: false } });
            }
            if (!args[1] || isNaN(args[1])) {
                message.reply({ content: 'Please specify an id to find', allowedMentions: { repliedUser: false } });
            }
            switch (type) {
                case 'user':
                    let userfind = 'User not found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.members.cache.has(id)) {
                            userfind = guild.members.cache.get(id).user.tag
                            return;
                        }
                    })
                    message.reply({ content: `${userfind}`, allowedMentions: { repliedUser: false } });

                    break;
                case 'guild':
                    let guildfind = 'No guild found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.id == id) {
                            guildfind = guild.name
                            return;
                        }
                    })
                    message.reply({ content: `${guildfind}`, allowedMentions: { repliedUser: false } });
                    break;
                case 'channel':
                    let channelfind = 'Channel not found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.channels.cache.has(id)) {
                            channelfind = guild.channels.cache.get(id).name
                            return;
                        }
                    })
                    message.reply({ content: `${channelfind}`, allowedMentions: { repliedUser: false } });

                    break;
                case 'role':
                    let rolefind = 'No role found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.roles.cache.has(id)) {
                            rolefind = guild.roles.cache.get(id).name
                            return;
                        }
                    })
                    message.reply({ content: `${rolefind}`, allowedMentions: { repliedUser: false } });

                    break;
                case 'emoji':
                    let emojifind = 'No emoji found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.emojis.cache.has(id)) {
                            emojifind = guild.emojis.cache.get(id).name + ` <:${guild.emojis.cache.get(id).name}:${id}>`
                            return;
                        }
                    })
                    message.reply({ content: `${emojifind}`, allowedMentions: { repliedUser: false } });
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
            if (parseInt(id) == NaN || parseInt(id) == 'NaN') {
                return interaction.reply({ content: 'IDs must be integers', allowedMentions: { repliedUser: false } });
            }
            switch (type) {
                case 'user':
                    let userfind = 'User not found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.members.cache.has(id)) {
                            userfind = guild.members.cache.get(id).user.tag
                            return;
                        }
                    })
                    interaction.reply({ content: `${userfind}`, allowedMentions: { repliedUser: false } });

                    break;
                case 'guild':
                    let guildfind = 'No guild found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.id == id) {
                            guildfind = guild.name
                            return;
                        }
                    })
                    interaction.reply({ content: `${guildfind}`, allowedMentions: { repliedUser: false } });
                    break;
                case 'channel':
                    let channelfind = 'Channel not found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.channels.cache.has(id)) {
                            channelfind = guild.channels.cache.get(id).name
                            return;
                        }
                    })
                    interaction.reply({ content: `${channelfind}`, allowedMentions: { repliedUser: false } });

                    break;
                case 'role':
                    let rolefind = 'No role found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.roles.cache.has(id)) {
                            rolefind = guild.roles.cache.get(id).name
                            return;
                        }
                    })
                    interaction.reply({ content: `${rolefind}`, allowedMentions: { repliedUser: false } });

                    break;
                case 'emoji':
                    let emojifind = 'No emoji found'
                    client.guilds.cache.forEach(guild => {
                        if (guild.emojis.cache.has(id)) {
                            emojifind = guild.emojis.cache.get(id).name + ` <:${guild.emojis.cache.get(id).name}:${id}>`
                            return;
                        }
                    })
                    interaction.reply({ content: `${emojifind}`, allowedMentions: { repliedUser: false } });
                    break;
                default:
                    interaction.reply({ content: 'Error - invalid search parameters. Valid params are: user, guild, channel, role', allowedMentions: { repliedUser: false } });
                    break;
            }
        }
    }
}