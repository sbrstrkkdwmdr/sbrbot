import commandchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'voice',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let user;
        let type;
        let channel;
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - voice (message)
${currentDate} | ${currentDateISO}
recieved voice command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            user = message.mentions.users.first() || message.author;
            type = args[1];
            channel = message.mentions.channels.first() || message.channel;
            if (!type) {
                return message.reply({ content: 'Please specify the type of setting you want to change', allowedMentions: { repliedUser: false } })
                    .catch(error => { });
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - voice (interaction)
${currentDate} | ${currentDateISO}
recieved voice command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            user = interaction.options.getUser('user');
            type = interaction.options.getString('type');
            channel = interaction.options.getChannel('channel');
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - voice (interaction)
${currentDate} | ${currentDateISO}
recieved voice command
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
user: ${user.id} | ${user.username}
type: ${type}
channel: ${channel ? `${channel.id} | ${channel.name}` : 'unused'}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const guildMember = obj.guild.members.cache.get(user.id);
        let ctx = '---'
        if (guildMember.id == interaction.member.user.id || commandchecks.isOwner(interaction.member.user.id)) {
            if (guildMember.voice.channel === null || guildMember.voice.channel === undefined) {
                ctx = 'Error - user is not in a voice channel'
            } else {
                try {
                    switch (type) {
                        case 'deafen':
                            try {
                                if (guildMember.voice.serverDeaf == false) {
                                    guildMember.voice.setDeaf(true, `Deafened by ${interaction.member.user.id}`)
                                    ctx = `${guildMember.user.tag} is now deafened`
                                } else {
                                    guildMember.voice.setDeaf(false, `Undeafened by ${interaction.member.user.id}`)
                                    ctx = `${guildMember.user.tag} is no longer deafened`

                                }
                            } catch (error) {
                                ctx = `There was an error trying to deafen/undeafen ${guildMember.user.tag}`
                            }
                            break;
                        case 'mute':
                            try {
                                if (guildMember.voice.serverMute == false) {
                                    guildMember.voice.setMute(true, `Muted by ${interaction.member.user.id}`)
                                    ctx = `${guildMember.user.tag} is now muted`

                                } else {
                                    guildMember.voice.setMute(false, `Unmuted by ${interaction.member.user.id}`)
                                    ctx = `${guildMember.user.tag} is no longer muted`

                                }
                            } catch (error) {
                                ctx = `There was an error trying to mute/unmute ${guildMember.user.tag}`

                            }
                            break;
                        case 'disconnect':
                            try {
                                guildMember.voice.disconnect(`Disconnected by ${interaction.member.user.id}`);
                                ctx = `${guildMember.user.tag} has been disconnected`
                            } catch (error) {
                                ctx = `There was an error trying to disconnect ${guildMember.user.tag}`
                            }
                            break;
                        case 'move':
                            if (!channel) {
                                ctx = 'Please specify a channel to move to'
                            } else {

                                const guildChannel = interaction.guild.channels.cache.get(channel.id);
                                if (guildChannel.type != 2) {
                                    ctx = 'Please specify a voice channel'
                                    console.log(guildChannel.type)
                                } else {

                                    try {
                                        guildMember.voice.setChannel(guildChannel, `Moved by ${interaction.member.user.id}`);
                                        ctx = `Moved ${guildMember.user.tag} to ${channel.name}`

                                    } catch (error) {
                                        console.log(error)
                                        ctx = `There was an error trying to move ${guildMember.user.tag} to ${channel.name}`
                                    }
                                }
                            }
                            break;
                    }
                } catch (error) {
                    console.log(error)
                    ctx = `${guildMember.user.tag} is not in a voice channel`

                }
            }


            //SEND/EDIT MSG==============================================================================================================================================================================================
        } else {
            ctx = 'You do not have permission to use this command'
        }
        if ((message != null || interaction != null) && button == null) {
            obj.reply({
                content: ctx,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });
        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
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