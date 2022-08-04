import fs = require('fs')
import commandchecks = require('../../configs/commandchecks')
module.exports = {
    name: 'voice',
    description: 'changes voice state settings for a user',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button) {

        if (message != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - voice (message)\n${currentDate} | ${currentDateISO}\n recieved alter voice state command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let user = message.mentions.users.first() || message.author;
            let type = args[1]
            let channel = args[2]
            if (user.id == message.author.id) {
                type = args[0]
                channel = args[1]
            }
            if (!type) {
                return message.reply({ content: 'Please specify the type of setting you want to change', allowedMentions: { repliedUser: false } })
            }

            let guildMember = message.guild.members.cache.get(user.id);
            if (guildMember.id == message.author.id || commandchecks.isOwner(message.author.id)) {
                if (guildMember.voice.channel === null || guildMember.voice.channel === undefined) return message.reply({ content: `User is not in a voice channel`, allowedMentions: { repliedUser: false } })
                try {
                    switch (type) {
                        case 'deafen':case 'undeafen':
                            try {
                                if (guildMember.voice.serverDeaf == false) {
                                    guildMember.voice.setDeaf(true, `Deafened by ${message.author.id}`)
                                    message.reply({ content: `${guildMember.user.tag} is now deafened`, allowedMentions: { repliedUser: false } })
                                } else {
                                    guildMember.voice.setDeaf(false, `Undeafened by ${message.author.id}`)
                                    message.reply({ content: `${guildMember.user.tag} is no longer deafened`, allowedMentions: { repliedUser: false } })
                                }
                            } catch (error) {
                                return message.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                            }
                            break;
                        case 'mute':case 'unmute':
                            try {
                                if (guildMember.voice.serverMute == false) {
                                    guildMember.voice.setMute(true, `Muted by ${message.author.id}`)
                                    message.reply({ content: `${guildMember.user.tag} is now muted`, allowedMentions: { repliedUser: false } })
                                } else {
                                    guildMember.voice.setMute(false, `Unmuted by ${message.author.id}`)
                                    message.reply({ content: `${guildMember.user.tag} is no longer muted`, allowedMentions: { repliedUser: false } })
                                }
                            } catch (error) {
                                return message.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                            }
                            break;
                        case 'disconnect':
                            try {
                                guildMember.voice.disconnect(`Disconnected by ${message.author.id}`);
                                message.reply({ content: `${guildMember.user.tag} has been disconnected`, allowedMentions: { repliedUser: false } })
                            } catch (error) {
                                return message.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                            }
                            break;
                        case 'move': case 'moveto':
                            if (!channel) return message.reply({ content: 'Please specify a channel to move to', allowedMentions: { repliedUser: false } });
                            if (isNaN(channel)) return message.reply({ content: 'Please use the channel ID', allowedMentions: { repliedUser: false } })
                            let guildChannel = message.guild.channels.cache.get(channel);
                            if (guildChannel.type != 'GUILD_VOICE') return message.reply({ content: 'Please specify a voice channel', allowedMentions: { repliedUser: false } });
                            try {
                                guildMember.voice.setChannel(guildChannel, `Moved by ${message.author.id}`);
                                message.reply({ content: `Moved ${guildMember.user.tag} to ${channel.name}`, allowedMentions: { repliedUser: false } });
                            } catch (error) {
                                console.log(error)
                                return message.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                            }
                            break;
                    }
                } catch (error) {
                    console.log(error)
                    return message.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                }
            } else {
                interaction.reply({ content: `You do not have permission to alter ${guildMember.user.tag}'s voice state`, allowedMentions: { repliedUser: false } });
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - voice (interaction)\n${currentDate} | ${currentDateISO}\n recieved alter voice state command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let user = interaction.options.getUser('user');
            let type = interaction.options.getString('type');
            let channel = interaction.options.getChannel('channel');

            let guildMember = interaction.guild.members.cache.get(user.id);
            if (guildMember.id == interaction.member.user.id || commandchecks.isOwner(interaction.member.user.id)) {
                if (guildMember.voice.channel === null || guildMember.voice.channel === undefined) return interaction.reply({ content: `User is not in a voice channel`, allowedMentions: { repliedUser: false } })
                try {
                    switch (type) {
                        case 'deafen':
                            try {
                                if (guildMember.voice.serverDeaf == false) {
                                    guildMember.voice.setDeaf(true, `Deafened by ${interaction.member.user.id}`)
                                    interaction.reply({ content: `${guildMember.user.tag} is now deafened`, allowedMentions: { repliedUser: false } })
                                } else {
                                    guildMember.voice.setDeaf(false, `Undeafened by ${interaction.member.user.id}`)
                                    interaction.reply({ content: `${guildMember.user.tag} is no longer deafened`, allowedMentions: { repliedUser: false } })
                                }
                            } catch (error) {
                                return interaction.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                            }
                            break;
                        case 'mute':
                            try {
                                if (guildMember.voice.serverMute == false) {
                                    guildMember.voice.setMute(true, `Muted by ${interaction.member.user.id}`)
                                    interaction.reply({ content: `${guildMember.user.tag} is now muted`, allowedMentions: { repliedUser: false } })
                                } else {
                                    guildMember.voice.setMute(false, `Unmuted by ${interaction.member.user.id}`)
                                    interaction.reply({ content: `${guildMember.user.tag} is no longer muted`, allowedMentions: { repliedUser: false } })
                                }
                            } catch (error) {
                                return interaction.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                            }
                            break;
                        case 'disconnect':
                            try {
                                guildMember.voice.disconnect(`Disconnected by ${interaction.member.user.id}`);
                                interaction.reply({ content: `${guildMember.user.tag} has been disconnected`, allowedMentions: { repliedUser: false } })
                            } catch (error) {
                                return interaction.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                            }
                            break;
                        case 'move':
                            if (!channel) return interaction.reply({ content: 'Please specify a channel to move to', allowedMentions: { repliedUser: false } });
                            let guildChannel = interaction.guild.channels.cache.get(channel.id);
                            if (guildChannel.type != 'GUILD_VOICE') return interaction.reply({ content: 'Please specify a voice channel', allowedMentions: { repliedUser: false } });
                            try {
                                guildMember.voice.setChannel(guildChannel, `Moved by ${interaction.member.user.id}`);
                                interaction.reply({ content: `Moved ${guildMember.user.tag} to ${channel.name}`, allowedMentions: { repliedUser: false } });
                            } catch (error) {
                                console.log(error)
                                return interaction.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                            }
                            break;
                    }
                } catch (error) {
                    console.log(error)
                    return interaction.reply({ content: `${guildMember.user.tag} is not in a voice channel`, allowedMentions: { repliedUser: false } });
                }
            } else {
                interaction.reply({ content: `You do not have permission to alter ${guildMember.user.tag}'s voice state`, allowedMentions: { repliedUser: false } });
            }

        }

        fs.appendFileSync(`commands.log`, 'success\n\n', 'utf-8')


    }
}