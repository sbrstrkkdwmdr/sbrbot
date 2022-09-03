import fs = require('fs');
//const { Constants } = require('discord.js');
const { ApplicationCommandOptionType, InteractionType } = require('discord.js');
const cmdconfig = require('./configs/commandopts');
import cmdchecks = require('./calc/commandchecks');
import extypes = require('./configs/extratypes');
import Discord = require('discord.js');

module.exports = (userdata, client, osuApiKey, osuClientID, osuClientSecret, config, oncooldown) => {

    let timeouttime;

    client.on('interactionCreate', async (interaction) => {
        if (!(interaction.type === InteractionType.ApplicationCommand)) return;
        //make a variable that is the current date
        const currentDate = new Date()
        const currentDateISO = new Date().toISOString()
        const absoluteID = currentDate.getTime();

        const message = null;
        const args = null;
        const button = null;
        const obj = interaction;

        if (!oncooldown.has(interaction.member.user.id)) {
            timeouttime = new Date().getTime() + 3000
        }
        if (oncooldown.has(interaction.member.user.id)) {
            return interaction.reply({
                content: `You're on cooldown!\nTry again in ${getTimeLeft(timeouttime) / 1000}s`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
                ephemeral: true
            });
        }
        if (!oncooldown.has(interaction.member.user.id)) {
            oncooldown.add(interaction.member.user.id);
            timeouttime = new Date().getTime()
            setTimeout(() => {
                oncooldown.delete(interaction.member.user.id)
            }, 3000)
        }
        function getTimeLeft(timeout) {
            const timeLeft = timeout - new Date().getTime();
            return Math.floor(timeLeft);
        }


        const currentGuildId = interaction.guildId
        let settings: extypes.guildSettings;
        try {
            const settingsfile = fs.readFileSync(`./configs/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile)
        } catch (error) {
            const defaultSettings = {
                prefix: 'sbr-',
                enabledModules: {
                    admin: false,
                    osu: true,
                    general: true,
                    links: true,
                    misc: true,
                    music: true,
                },
                admin: {
                    basic: 'n',
                    limited: false,
                    channels: [],
                    log: {
                        messageUpdates: true,
                        guildUpdates: true,
                        channelUpdates: true,
                        roleUpdates: true,
                        emojiUpdates: true,
                        userUpdates: true,
                        presenceUpdates: false,
                        voiceUpdates: true,
                    }
                },
                osu: {
                    basic: 'n',
                    limited: false,
                    channels: [],
                    parseLinks: true,
                    parseReplays: true,
                    parseScreenshots: true,
                },
                general: {
                    basic: 'n',
                    limited: false,
                    channels: []
                },
                misc: {
                    basic: 'n',
                    limited: false,
                    channels: []
                },
                music: {
                    basic: 'n',
                    limited: false,
                    channels: []
                }
            }
            fs.writeFileSync(`./configs/guilds/${currentGuildId}.json`, JSON.stringify(defaultSettings, null, 2), 'utf-8')
            settings = defaultSettings
        }

        switch (interaction.commandName) {
            case 'convert': case 'help': case 'math': case 'ping': case 'remind': case 'stats': case 'time': case 'info':
                if (settings.enabledModules.general == false) {
                    return;
                }
                else if (settings.general.limited == true) {
                    if (!settings.general.channels.includes(obj.channelId)) {
                        return;
                    }
                } 
                break;
            case '8ball': case 'ask': case 'emojify': case 'gif': case 'image': case 'imagesearch': case 'poll': case 'vote': case 'roll': case 'say': case 'ytsearch': case 'yt':
                if (settings.enabledModules.misc == false) {
                    return;
                }
                else if (settings.misc.limited == true) {
                    if (!settings.misc.channels.includes(obj.channelId)) {
                        return;
                    }
                } 
                break;
            case 'compare': case 'firsts': case 'map': case 'm': case 'rs': case 'recent': case 'r': case 'osu': case 'profile': case 'o': case 'osuset': case 'osutop': case 'top': case 'scores': case 'c': case 'leaderboard': case 'maplb': case 'mapleaderboard': case 'lb': case 'pinned': case 'skin': case 'simplay': case 'simulate': case 'whatif':
                if (settings.enabledModules.osu == false) {
                    return;
                }
                else if (settings.osu.limited == true) {
                    if (!settings.osu.channels.includes(obj.channelId)) {
                        return;
                    }
                } 
                break;
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms': case 'leaveguild': case 'leave': case 'servers': case 'debug': case 'voice': case 'crash': case 'log': case 'find': case 'purge':
                if (settings.enabledModules.admin == false) {
                    return;
                }
                else if (settings.admin.limited == true) {
                    if (!settings.admin.channels.includes(obj.channelId)) {
                        return;
                    }
                } 
                break;
            case 'play': case 'pause': case 'np': case 'skip': case 'queue': case 'resume':
                if (settings.enabledModules.music == false) {
                    return;
                }
                else if (settings.music.limited == true) {
                    if (!settings.music.channels.includes(obj.channelId)) {
                        return;
                    }
                } 
                break;

        }

        switch (interaction.commandName) {
            case 'convert':
                client.commands.get('convert').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'help':
                client.commands.get('help').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'math':
                client.commands.get('math').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'ping':
                client.commands.get('ping').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'remind':
                client.commands.get('remind').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'stats':
                client.commands.get('stats').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'time':
                client.commands.get('time').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case '8ball': case 'ask':
                client.misccmds.get('8ball').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'emojify':
                client.misccmds.get('emojify').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break
            case 'gif':
                client.misccmds.get('gif').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'image': case 'imagesearch':
                client.misccmds.get('image').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'poll': case 'vote':
                client.misccmds.get('poll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'roll':
                client.misccmds.get('roll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'say':
                client.misccmds.get('say').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'ytsearch': case 'yt':
                client.misccmds.get('ytsearch').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;

            //osu below

            case 'osu': case 'profile': case 'o':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'osuset':
                client.osucmds.get('osuset').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'osutop': case 'top':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'map': case 'm':
                client.osucmds.get('map').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'rs': case 'recent': case 'r':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'scores': case 'c':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'lb':
                client.osucmds.get('lb').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'compare':
                client.osucmds.get('compare').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            /*             case 'osumodcalc':
                            client.osucmds.get('osumodcalc').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                            break; */


            //admin 



            case 'checkperms':
                if (cmdchecks.isAdmin(interaction.member.user.id, interaction.guildId, client) || cmdchecks.isOwner(interaction.member.user.id))
                    client.admincmds.get('checkperms').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'servers':
                if (cmdchecks.isAdmin(interaction.member.user.id, interaction.guildId, client) || cmdchecks.isOwner(interaction.member.user.id))
                    client.admincmds.get('servers').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'leaveguild':
                if (cmdchecks.isAdmin(interaction.member.user.id, interaction.guildId, client) || cmdchecks.isOwner(interaction.member.user.id))
                    client.admincmds.get('leaveguild').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'voice':
                if (cmdchecks.isAdmin(interaction.member.user.id, interaction.guildId, client) || cmdchecks.isOwner(interaction.member.user.id))
                    client.admincmds.get('voice').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'find':
                if (cmdchecks.isAdmin(interaction.member.user.id, interaction.guildId, client) || cmdchecks.isOwner(interaction.member.user.id))
                    client.admincmds.get('find').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'log':
                if (cmdchecks.isAdmin(interaction.member.user.id, interaction.guildId, client) || cmdchecks.isOwner(interaction.member.user.id))
                    client.admincmds.get('log').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'Links':
                client.commands.get('info').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'Bookmark':
                client.commands.get('bookmark').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            default:
                interaction.reply({ content: 'Command not found - no longer exists or is currently being rewritten', ephemeral: true })
                break;
        }
        fs.appendFileSync('logs/totalcommands.txt', 'x')

    })

}