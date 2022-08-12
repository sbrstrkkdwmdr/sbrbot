const checks = require('./calc/commandchecks')
import fs = require('fs');
//MOD LOGS N SHIT

module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {

    client.on('messageCreate', message => {
        if(message.channel.type == Discord.ChannelType.DM){
            fs.appendFileSync('dm.log', 
            `Received a dm from ${message.author.id} | ${message.author.username}#${message.author.discriminator}
            Content: ${message.content}
            `
            )
        }

        //FILE BLOCKING FUNCTION
        if (checks.checkisfileblocked(message.author.id)) {
            let currentDate = new Date();
            let currentDateISO = new Date().toISOString();


            if (message.attachments.size > 0 && (message.attachments.every(a => checks.checkisvideo(a)) || message.attachments.every(a => checks.checkisimage(a)) || message.attachments.every(a => checks.checkisaudio(a) || message.content.has('http')))) {
                message.delete()

                let guild = client.guilds.cache.get(message.guild.id)
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nmessageCreate event\n${currentDate} | ${currentDateISO}\n `);
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Guild Member${message.author.username}#${message.author.discriminator} sent a file:\n ${message.attachments.first().url}\n`)

            }
        }
        //MESSAGE LOGGER
    })
    client.on('messageDelete', message => {
        if (message.author == null || message.author.username == null) return; 
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(message.guild.id)

        let msgref:any = '';

        if (message.reference){
            msgref += `
            Referenced Message URL: https://discord.com/channels/${message.reference.guildId}/${message.reference.channelId}/${message.reference.messageId}
            `
        }
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nmessageDelete event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Guild Member ${message.author.username}#${message.author.discriminator}'s message has been deleted:\nID: ${message.id}\nURL: https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}\n Content:${message.content}\nMessage Type: ${message.type}\n${msgref}`)
    })
    client.on('messageUpdate', (oldMessage, newMessage) => {
        if(oldMessage == newMessage) return;

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(oldMessage.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nmessageUpdate event\n${currentDate} | ${currentDateISO}\n `);
        if(oldMessage.author){
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Guild Member ${oldMessage.author.username}#${oldMessage.author.discriminator}'s message has been updated:\nID: ${oldMessage.id}\n`)
        }
        if (oldMessage.content != newMessage.content) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\n Old Message: ${oldMessage.content}`)
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\n New Message: ${newMessage.content}`)
        }
        if (oldMessage.embeds != newMessage.embeds) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\n Old Message (embeds):`)
            for(let i = 0; i < oldMessage.embeds.length; i++) {
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\n ${JSON.stringify(oldMessage.embeds[i].toJSON(), null, 2)}`)
            }
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\n New Message (embeds):`)
            for(let i = 0; i < newMessage.embeds.length; i++) {
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\n ${JSON.stringify(newMessage.embeds[i].toJSON(), null, 2)}`)
            }
        }
    })



    //GUILD MEMBER LOGGER
    client.on('guildBanAdd', (ban) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(ban.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nguildBanAdd event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Guild Member ${ban.user.username}#${ban.user.discriminator} (${ban.user.id}) was banned`)//by ${ban.client.user.username}#${ban.client.user.discriminator} (${ban.client.user.id})\n
    })
    client.on('guildBanRemove', (ban) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(ban.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nguildBanRemove event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Guild Member ${ban.user.username}#${ban.user.discriminator} (${ban.user.id}) was unbanned\n`)//by ${ban.client.user.username}#${ban.client.user.discriminator} (${ban.client.user.id})
    })
    client.on('guildMemberRemove', (member) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(member.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `guildMemberRemove event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Guild Member ${member.user.username}#${member.user.discriminator} (${member.user.id}) left the server or was kicked\n`)
    })
    client.on('guildMemberUpdate', (oldMember, newMember) => {
        if (oldMember == newMember) return;

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(oldMember.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nguildMemberUpdate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Guild Member ${oldMember.user.username}#${oldMember.user.discriminator} (${oldMember.user.id})has been updated:\n`)
        if (oldMember.avatar != newMember.avatar) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `avatar changed: ${oldMember.displayAvatarURL()} => ${newMember.displayAvatarURL()}\n`)
        }
        if (oldMember.nickname != newMember.nickname) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `nickname changed: ${oldMember.nickname} => ${newMember.nickname}\n`)
        }
        if (oldMember.user.username != newMember.user.username) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `username changed: ${oldMember.user.username} => ${newMember.user.username}\n`)
        }
        if (oldMember.displayName != newMember.displayName) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `display name changed: ${oldMember.displayName} => ${newMember.displayName}\n`)
        }
        if (oldMember.roles.cache != newMember.roles.cache) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `roles changed: ${oldMember.roles.cache.map(r => r.name).join(', ')} => ${newMember.roles.cache.map(r => r.name).join(', ')}\n`)
        }
    })

    //USER LOGGER
    client.on('userUpdate', (oldUser, newUser) => {
        if(oldUser == newUser) return;

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        client.guilds.cache.forEach(guild => {
            if (guild.members.cache.has(oldUser.id)) {
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nuserUpdate event\n${currentDate} | ${currentDateISO}\n `);
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `User ${oldUser.username}#${oldUser.discriminator} (${oldUser.id}) has been updated:\n`)
                if (oldUser.avatar != newUser.avatar) {
                    fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `avatar changed: ${oldUser.avatarURL()} => ${newUser.avatarURL()}\n`)
                }
                if (oldUser.username != newUser.username) {
                    fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `username changed: ${oldUser.username} => ${newUser.username}\n`)
                }
                if (oldUser.discriminator != newUser.discriminator) {
                    fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `discriminator changed: ${oldUser.discriminator} => ${newUser.discriminator}\n`)
                }

            }
        })
    })
    /*     client.on('presenceUpdate', (oldPresence, newPresence) => {
        let guild = client.guilds.cache.get(oldPresence.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nUser ${oldPresence.user.username}#${oldPresence.user.discriminator} (${oldPresence.user.id}) has been updated:\n`)
        if (oldPresence.activities != newPresence.activities) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `activities changed: ${oldPresence.activities.map(a => a.name).join(', ')} => ${newPresence.activities.map(a => a.name).join(', ')}\n`)
        }
        if (oldPresence.status != newPresence.status) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `status changed: ${oldPresence.status} => ${newPresence.status}\n`)
        }
        }) */ //commented out bcs its unneccessary  


    //GENERAL GUILD UPDATE LOGGER
    client.on('channelCreate', (channel) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(channel.guild.id)
        //fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nChannel ${channel.name} (${channel.id}) was created\n`)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nchannelCreate event\n${currentDate} | ${currentDateISO}\n `);
        switch (true) {
            case channel.type == 0 || channel.type.toString() == 'GUILD_TEXT':
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Text Channel ${channel.name} (${channel.id}) was created\n`)
                break;
            case channel.type == 1 || channel.type.toString() == 'DM':
                fs.appendFileSync('dm.log', `DM channel opened`)
            
            case channel.type.toString() == 'GUILD_CATEGORY' || channel.type == 4:
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Category ${channel.name} (${channel.id}) was created\n`)
                break;
            case channel.type == 2 || channel.type.toString() == 'GUILD_VOICE':
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Voice Channel ${channel.name} (${channel.id}) was created\n`)
                break;
            case channel.type == 5 || channel.type.toString() == 'GUILD_NEWS':
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` News Channel ${channel.name} (${channel.id}) was created\n`)
                break;
            /*             case channel.type == 10 || channel.type.toString() == 'GUILD_NEWS_THREAD':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\n News Thread ${channel.name} (${channel.id}) was created\n`)
                            break;
                        case channel.type == 11 || channel.type.toString() == 'GUILD_PUBLIC_THREAD':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nPublic Thread ${channel.name} (${channel.id}) was created\n`)
                            break;
                        case channel.type == 12 || channel.type.toString() == 'GUILD_PRIVATE_THREAD':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nPrivate Thread ${channel.name} (${channel.id}) in channel was created\n`)
                            break; */
            case channel.type == 13 || channel.type.toString() == 'GUILD_STAGE_VOICE':
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Stage Voice Channel ${channel.name} (${channel.id}) was created\n`)
                break;
                
            /*             case channel.type == 14 || channel.type.toString() == 'GUILD_DIRECTORY':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nDirectory Channel ${channel.name} (${channel.id}) was created\n`)
                            break;
                        case channel.type == 15 || channel.type.toString() == 'GUILD_FORUM':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nForum Channel ${channel.name} (${channel.id}) was created\n`)
                            break; */
            default:
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Channel ${channel.name} (${channel.id}) was created\n`)
                break;
        }
    })
    client.on('channelDelete', (channel) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(channel.guild.id)
        //fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nChannel ${channel.name} (${channel.id}) was deleted\n`)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nchannelDelete event\n${currentDate} | ${currentDateISO}\n `);

        switch (true) {
            case channel.type == 0 || channel.type.toString() == 'GUILD_TEXT':
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Text Channel ${channel.name} (${channel.id}) was deleted\n`)
                break;
            case channel.type.toString() == 'GUILD_CATEGORY' || channel.type == 4:
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Category ${channel.name} (${channel.id}) was deleted\n`)
                break;
            case channel.type == 2 || channel.type.toString() == 'GUILD_VOICE':
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Voice Channel ${channel.name} (${channel.id}) was deleted\n`)
                break;
            case channel.type == 5 || channel.type.toString() == 'GUILD_NEWS':
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `  News Channel ${channel.name} (${channel.id}) was deleted\n`)
                break;
            /*            case channel.type == 10 || channel.type.toString() == 'GUILD_NEWS_THREAD':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\n News Thread ${channel.name} (${channel.id}) was deleted\n`)
                            break;
                         case channel.type == 11 || channel.type.toString() == 'GUILD_PUBLIC_THREAD':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nPublic Thread ${channel.name} (${channel.id}) was deleted\n`)
                            break;
                        case channel.type == 12 || channel.type.toString() == 'GUILD_PRIVATE_THREAD':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nPrivate Thread ${channel.name} (${channel.id}) in channel was deleted\n`)
                            break; */
            case channel.type == 13 || channel.type.toString() == 'GUILD_STAGE_VOICE':
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Stage Voice Channel ${channel.name} (${channel.id}) was deleted\n`)
                break;
            /*             case channel.type == 14 || channel.type.toString() == 'GUILD_DIRECTORY':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nDirectory Channel ${channel.name} (${channel.id}) was deleted\n`)
                            break;
                        case channel.type == 15 || channel.type.toString() == 'GUILD_FORUM':
                            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nForum Channel ${channel.name} (${channel.id}) was deleted\n`)
                            break; */
            default:
                fs.appendFileSync(`./logs/moderator/${guild.id}.log`, ` Channel ${channel.name} (${channel.id}) was deleted\n`)
                break;
        }

    })
    client.on('channelUpdate', (oldChannel, newChannel) => {
        if(oldChannel == newChannel) return;

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(oldChannel.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nchannelUpdate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Channel ${oldChannel.name} (${oldChannel.id}) was updated \n`)

        if (oldChannel.name != newChannel.name) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `name changed: ${oldChannel.name} => ${newChannel.name}\n`)
        }
        if (oldChannel.parent != newChannel.parent) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `parent changed: ${oldChannel.parent.name} => ${newChannel.parent.name}\n`)
        }
        if (oldChannel.permissionOverwrites != newChannel.permissionOverwrites) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `permission overwrites changed: \nALLOW: ${oldChannel.permissionOverwrites.cache.map(p => p.allow.toArray().join(', '))} \n DENY: ${oldChannel.permissionOverwrites.cache.map(p => p.deny.toArray().join(', '))} \n=> \nALLOW: ${newChannel.permissionOverwrites.cache.map(p => p.allow.toArray().join(', '))} \n DENY: ${newChannel.permissionOverwrites.cache.map(p => p.deny.toArray().join(', '))}\n`)
        }
        if (oldChannel.topic != newChannel.topic) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `topic changed: ${oldChannel.topic} => ${newChannel.topic}\n`)
        }

    })
    client.on('emojiCreate', (emoji) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(emoji.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nemojiCreate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Emoji ${emoji.name} (${emoji.id}) was created => ${emoji.url}\n`)
    })
    client.on('emojiDelete', (emoji) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(emoji.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nemojiDelete event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nEmoji ${emoji.name} (${emoji.id}) was deleted => ${emoji.url}\n`)
    })
    client.on('emojiUpdate', (oldEmoji, newEmoji) => {
        if(oldEmoji == newEmoji) return;

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(oldEmoji.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nemojiUpdate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nEmoji ${oldEmoji.name} (${oldEmoji.id}) was updated => ${oldEmoji.url}\n`)
        if (oldEmoji.name != newEmoji.name) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `name changed: ${oldEmoji.name} => ${newEmoji.name}\n`)
        }
        if (oldEmoji.identifier != newEmoji.identifier) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `identifier changed: ${oldEmoji.identifier} => ${newEmoji.identifier}\n`)
        }

    })
    client.on('guildScheduledEventCreate', (guildScheduledEvent) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(guildScheduledEvent.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nguildScheduledEventCreate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Scheduled Event ${guildScheduledEvent.name} (${guildScheduledEvent.id}) was created\n`)

    })
    client.on('guildScheduledEventDelete', (guildScheduledEvent) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(guildScheduledEvent.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nguildScheduledEventDelete event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Scheduled Event ${guildScheduledEvent.name} (${guildScheduledEvent.id}) was deleted\n`)
    })
    client.on('guildScheduledEventUpdate', (oldGuildScheduledEvent, newGuildScheduledEvent) => {
        if(oldGuildScheduledEvent == newGuildScheduledEvent) return;
        
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(oldGuildScheduledEvent.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nguildScheduledEventUpdate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Scheduled Event ${oldGuildScheduledEvent.name} (${oldGuildScheduledEvent.id}) was updated\n`)
        if (oldGuildScheduledEvent.name != newGuildScheduledEvent.name) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `name changed: ${oldGuildScheduledEvent.name} => ${newGuildScheduledEvent.name}\n`)
        }
        if (oldGuildScheduledEvent.channel != newGuildScheduledEvent.channel) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `channel changed: ${oldGuildScheduledEvent.channel.name} => ${newGuildScheduledEvent.channel.name}\n`)
        }
        if (oldGuildScheduledEvent.description != newGuildScheduledEvent.description) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `description changed: ${oldGuildScheduledEvent.description} => ${newGuildScheduledEvent.description}\n`)
        }
        if (oldGuildScheduledEvent.privacy != newGuildScheduledEvent.privacy) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `privacy changed: ${oldGuildScheduledEvent.privacy} => ${newGuildScheduledEvent.privacy}\n`)
        }

    })
    client.on('guildScheduledEventUserAdd', (guildScheduledEvent, user) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(guildScheduledEvent.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nguildScheduledEventUserAdd event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `User ${user.username} (${user.id}) was added to Scheduled Event ${guildScheduledEvent.name} (${guildScheduledEvent.id})\n`)

    })
    client.on('guildScheduledEventUserRemove', (guildScheduledEvent, user) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(guildScheduledEvent.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nguildScheduledEventUserRemove event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `User ${user.username} (${user.id}) was removed from Scheduled Event ${guildScheduledEvent.name} (${guildScheduledEvent.id})\n`)
    })
    client.on('guildUnavailable', (guild) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guildlog = client.guilds.cache.get(guild.id)
        fs.appendFileSync(`./logs/moderator/${guildlog.id}.log`, `\nguildUnavailable event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guildlog.id}.log`, `Guild ${guild.name} (${guild.id}) was unavailable\n`)
    })
    client.on('guildUpdate', (oldGuild, newGuild) => {
        if(oldGuild == newGuild) return;

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(oldGuild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nguildUpdate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Guild ${oldGuild.name} (${oldGuild.id}) was updated\n`)
        if (oldGuild.name != newGuild.name) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `name changed: ${oldGuild.name} => ${newGuild.name}\n`)
        }
        /*         if() */

    })
    client.on('inviteCreate', (invite) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(invite.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\ninviteCreate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Invite ${invite.code} was created (${invite.url})\n`)
    })
    client.on('inviteDelete', (invite) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(invite.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\ninviteDelete event\n${currentDate} | ${currentDateISO}\n `);

        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Invite ${invite.code} was deleted (${invite.url})\n`)
    })
    client.on('roleCreate', (role) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(role.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nroleCreate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Role ${role.name} (${role.id}) was created\n`)
    })
    client.on('roleDelete', (role) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(role.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nroleDelete event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Role ${role.name} (${role.id}) was deleted\n`)
    })
    client.on('roleUpdate', (oldRole, newRole) => {
        if(oldRole == newRole) return;

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(oldRole.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nroleUpdate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Role ${oldRole.name} (${oldRole.id}) was updated to ${newRole.name}\n`)
        if(oldRole.name != newRole.name) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `name changed: ${oldRole.name} => ${newRole.name}\n`)
        }
        if(oldRole.color != newRole.color) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `colour changed: ${oldRole.color} => ${newRole.color}\n`)
        }
        if(oldRole.permissions != newRole.permissions) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `permissions changed: ${oldRole.permissions.toArray().join(', ')} => ${newRole.permissions.toArray().join(', ')}\n`)
        }
    })
    client.on('stageInstanceCreate', (stageInstance) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(stageInstance.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nstageInstanceCreate event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Stage Instance ${stageInstance.topic} (${stageInstance.id}) was created in ${stageInstance.channel} (${stageInstance.channel.id})\n`)
    })
    client.on('stageInstanceDelete', (stageInstance) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(stageInstance.guild.id)
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nstageInstanceDelete event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Stage Instance ${stageInstance.topic} (${stageInstance.id}) was deleted in ${stageInstance.channel} (${stageInstance.channel.id})\n`)
    })
    client.on('stageInstanceUpdate', (oldStageInstance, newStageInstance) => {
        if(oldStageInstance == newStageInstance) return;

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let guild = client.guilds.cache.get(oldStageInstance.guild.id)
        if(oldStageInstance == newStageInstance) return;
        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `\nstageInstanceUpdate event\n${currentDate} | ${currentDateISO}\n `);

        fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `Stage Instance ${oldStageInstance.topic} (${oldStageInstance.id}) was updated in ${oldStageInstance.channel} (${oldStageInstance.channel.id})\n`)
        if (oldStageInstance.topic != newStageInstance.topic) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `topic changed: ${oldStageInstance.topic} => ${newStageInstance.topic}\n`)
        }
        if (oldStageInstance.channel != newStageInstance.channel) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `channel changed: ${oldStageInstance.channel} (${oldStageInstance.channel.id}) => ${newStageInstance.channel} (${newStageInstance.channel.id})\n`)
        }
        if (oldStageInstance.privacyLevel != newStageInstance.privacyLevel) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `privacy level changed: ${oldStageInstance.privacyLevel} => ${newStageInstance.privacyLevel}\n`)
        }
        if (oldStageInstance.guildScheduledEvent != newStageInstance.guildScheduledEvent) {
            fs.appendFileSync(`./logs/moderator/${guild.id}.log`, `guild scheduled event changed: ${oldStageInstance.guildScheduledEvent.name} (${oldStageInstance.guildScheduledEvent.id}) => ${newStageInstance.guildScheduledEvent} (${newStageInstance.guildScheduledEvent.id})\n`)
        }
    })
    //MISC
    client.on('debug', info => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        //console.log(info)
        fs.appendFileSync(`./logs/general.log`, `\ndebug event\n${currentDate} | ${currentDateISO}\n `);
        fs.appendFileSync(`./logs/general.log`, `${info}\n`)
    })

}
