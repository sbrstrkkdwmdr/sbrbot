import fs = require('fs');
import checks = require('./src/checks');
import extypes = require('./src/types/extratypes');
import defaults = require('./src/consts/defaults');
import Discord = require('discord.js');

module.exports = (userdata, client, config, oncooldown) => {
    let timeouttime;

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();
        const absoluteID = currentDate.getTime();

        if (message.author.bot && !message.author.id == client.user.id) return;

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const settingsfile = fs.readFileSync(`./configs/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile);
        } catch (error) {
            fs.writeFileSync(`./configs/guilds/${currentGuildId}.json`, JSON.stringify(defaults.defaultGuildSettings, null, 2), 'utf-8')
            settings = defaults.defaultGuildSettings;
        }

        if (!(message.content.startsWith(config.prefix) || message.content.startsWith(settings.prefix))) return; //the return is so if its just prefix nothing happens

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

        const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const interaction = null;
        const button = null;
        const obj = message;
        const overrides = null;
        execCommand(command, 'message', message, overrides, button, absoluteID, currentDate, message.author.id);
    });

    client.on('interactionCreate', async (interaction) => {
        if (!(interaction.type === Discord.InteractionType.ApplicationCommand)) return;
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
            fs.writeFileSync(`./configs/guilds/${currentGuildId}.json`, JSON.stringify(defaults.defaultGuildSettings, null, 2), 'utf-8')
            settings = defaults.defaultGuildSettings;
        }
        execCommand(interaction.commandName, 'interaction', interaction, null, button, absoluteID, currentDate, interaction.member.user.id);
    });

    function execCommand(command: string, commandType: string, obj: any, overrides: any, button, absoluteID, currentDate, userid: any) {
        switch (command) {
            case 'convert':
                client.commands.get('convert').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'help':
                client.commands.get('help').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'math':
                client.commands.get('math').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'ping':
                client.commands.get('ping').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'remind':
                client.commands.get('remind').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'stats':
                client.commands.get('stats').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'time':
                client.commands.get('time').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'info':
                client.commands.get('info').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;

            case '8ball': case 'ask':
                client.misccmds.get('8ball').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'emojify':
                client.misccmds.get('emojify').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break
            case 'gif':
                client.misccmds.get('gif').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'image': case 'imagesearch':
                client.misccmds.get('image').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'poll': case 'vote':
                client.misccmds.get('poll').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'roll':
                client.misccmds.get('roll').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'say':
                client.misccmds.get('say').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'ytsearch': case 'yt':
                client.misccmds.get('ytsearch').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;

            //osu commands below
            case 'firsts':
                client.osucmds.get('firsts').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'map': case 'm':
                client.osucmds.get('map').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'rs': case 'recent': case 'r':
                client.osucmds.get('rs').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'osu': case 'profile': case 'o':
                client.osucmds.get('osu').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'osuset':
                client.osucmds.get('osuset').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'osutop': case 'top':
                client.osucmds.get('osutop').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'scores': case 'c':
                client.osucmds.get('scores').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                client.osucmds.get('leaderboard').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'lb':
                client.osucmds.get('lb').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'pinned':
                client.osucmds.get('pinned').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'skin':
                client.osucmds.get('skin').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'simplay': case 'simulate':
                client.osucmds.get('simplay').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;

            //admincmds below
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    client.admincmds.get('checkperms').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                }
                break;
            case 'leaveguild': case 'leave':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    client.admincmds.get('leaveguild').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                };
                break;
            case 'servers':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    client.admincmds.get('servers').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                };
                break;
            case 'debug':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    client.admincmds.get('debug').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                };
                break;
            case 'voice':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    client.admincmds.get('voice').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                };
                break;
            case 'crash':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    client.admincmds.get('crash').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                };
                break;
            case 'log':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    client.admincmds.get('log').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                };
                break;
            case 'find':
                client.admincmds.get('find').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;
            case 'purge':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    client.admincmds.get('purge').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                };
                break;

            case 'test':
                client.commands.get('test').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides)
                break;

            // music

            // WIP
            case 'compare': case 'whatif': case 'play': case 'pause': case 'np': case 'wip': case 'skip': case 'queue': case 'resume':
                obj.reply({ content: 'This command is currently under development. Will be added later.', allowedMentions: { repliedUser: false } })
                    .catch()
                break;

        }
        return;
    }
}


