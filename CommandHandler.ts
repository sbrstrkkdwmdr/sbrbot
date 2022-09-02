import fs = require('fs');
import cmdchecks = require('./calc/commandchecks');
import extypes = require('./configs/extratypes');
import Discord = require('discord.js');

module.exports = (userdata, client, osuApiKey, osuClientID, osuClientSecret, config, oncooldown) => {

    let timeouttime;

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();
        const currentDateISO = new Date().toISOString();
        const absoluteID = currentDate.getTime()

        const args = message.content.slice(config.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!message.content.startsWith(config.prefix)) return; //the return is so if its just prefix nothing happens
        if (message.author.bot && !(message.author.id == '755220989494951997' || message.author.id == '777125560869978132')) return;
        if (!oncooldown.has(message.author.id)) {
            timeouttime = new Date().getTime() + 3000
        }
        if (oncooldown.has(message.author.id)) {
            setTimeout(() => {
                message.delete()
                    .catch()
            }, 3000)
        }
        if (oncooldown.has(message.author.id)) {
            message.reply({
                content: `You're on cooldown!\nTry again in ${getTimeLeft(timeouttime) / 1000}s`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
                ephemeral: true
            });
            return;
        }
        if (!oncooldown.has(message.author.id)) {
            oncooldown.add(message.author.id);
            setTimeout(() => {
                oncooldown.delete(message.author.id)
            }, 3000)
        }
        function getTimeLeft(timeout) {
            return (timeout - new Date().getTime());
        }

        const interaction = null;
        const button = null;
        const obj = message;
        const overrides = null;

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const settingsfile = fs.readFileSync(`./configs/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile);
        } catch (error) {
            const defaultSettings = {
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
        switch (command) {
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
        switch (command) {
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
            case 'info':
                client.commands.get('info').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
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

            //osu commands below
            case 'firsts':
                client.osucmds.get('firsts').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'map': case 'm':
                client.osucmds.get('map').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'rs': case 'recent': case 'r':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'osu': case 'profile': case 'o':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'osuset':
                client.osucmds.get('osuset').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj)
                break;
            case 'osutop': case 'top':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'scores': case 'c':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'lb':
                client.osucmds.get('lb').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'pinned':
                client.osucmds.get('pinned').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'skin':
                client.osucmds.get('skin').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'simplay': case 'simulate':
                client.osucmds.get('simplay').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;

            //admincmds below
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('checkperms').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'leaveguild': case 'leave':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('leaveguild').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'servers':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('servers').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'debug':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('debug').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'voice':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('voice').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'crash':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('crash').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'log':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('log').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'find':
                client.admincmds.get('find').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'purge':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('purge').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;

            case 'test':
                client.commands.get('test').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;

            // music

            // WIP
            case 'compare': case 'whatif': case 'play': case 'pause': case 'np': case 'wip': case 'skip': case 'queue': case 'resume':
                message.reply({ content: 'This command is currently under development. Will be added later.', allowedMentions: { repliedUser: false } });
                break;

        }
        fs.appendFileSync('logs/totalcommands.txt', 'x')


    })
}