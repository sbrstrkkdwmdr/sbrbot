import fs = require('fs');
import checks = require('./src/checks');
import extypes = require('./src/types/extratypes');
import defaults = require('./src/consts/defaults');
import Discord = require('discord.js');

module.exports = (userdata, client, commandStruct, config, oncooldown) => {
    let timeouttime;

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();
        const absoluteID = currentDate.getTime();

        if (message.author.bot && !message.author.id == client.user.id) return;

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const settingsfile = fs.readFileSync(`./config/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile);
        } catch (error) {
            fs.writeFileSync(`./config/guilds/${currentGuildId}.json`, JSON.stringify(defaults.defaultGuildSettings, null, 2), 'utf-8')
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
        execCommand(command, 'message', message, overrides, button, absoluteID, currentDate, message.author.id, args);
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
            const settingsfile = fs.readFileSync(`./config/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile)
        } catch (error) {
            fs.writeFileSync(`./config/guilds/${currentGuildId}.json`, JSON.stringify(defaults.defaultGuildSettings, null, 2), 'utf-8')
            settings = defaults.defaultGuildSettings;
        }
        execCommand(interaction.commandName, 'interaction', interaction, null, button, absoluteID, currentDate, interaction.member.user.id, args);
    });

    function execCommand(command: string, commandType: string, obj: any, overrides: any, button, absoluteID: number, currentDate, userid: any, args: string[]) {
        switch (command) {
            case 'convert':
                commandStruct.commands.get('convert').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'help':
                commandStruct.commands.get('help').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'math':
                commandStruct.commands.get('math').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'ping':
                commandStruct.commands.get('ping').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'remind':
                commandStruct.commands.get('remind').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'stats':
                commandStruct.commands.get('stats').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'time':
                commandStruct.commands.get('time').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'info':
                commandStruct.commands.get('info').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;

            case '8ball': case 'ask':
                commandStruct.misccmds.get('8ball').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'emojify':
                commandStruct.misccmds.get('emojify').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break
            case 'gif':
                commandStruct.misccmds.get('gif').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'image': case 'imagesearch':
                commandStruct.misccmds.get('image').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'poll': case 'vote':
                commandStruct.misccmds.get('poll').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'roll':
                commandStruct.misccmds.get('roll').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'say':
                commandStruct.misccmds.get('say').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'ytsearch': case 'yt':
                commandStruct.misccmds.get('ytsearch').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;

            //osu commands below
            case 'firsts':
                commandStruct.osucmds.get('firsts').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'map': case 'm':
                commandStruct.osucmds.get('map').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'rs': case 'recent': case 'r':
                commandStruct.osucmds.get('recent').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'osu': case 'profile': case 'o':
                commandStruct.osucmds.get('osu').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'osuset':
                commandStruct.osucmds.get('osuset').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'osutop': case 'top':
                commandStruct.osucmds.get('osutop').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'scores': case 'c':
                commandStruct.osucmds.get('scores').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                commandStruct.osucmds.get('maplb').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'lb':
                commandStruct.osucmds.get('lb').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'pinned':
                commandStruct.osucmds.get('pinned').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'skin':
                commandStruct.osucmds.get('skin').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'simplay': case 'simulate':
                commandStruct.osucmds.get('simplay').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;

            //admincmds below
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('checkperms').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                }
                break;
            case 'leaveguild': case 'leave':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('leaveguild').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                };
                break;
            case 'servers':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('servers').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                };
                break;
            case 'debug':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('debug').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                };
                break;
            case 'voice':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('voice').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                };
                break;
            case 'crash':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('crash').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                };
                break;
            case 'log':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('log').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                };
                break;
            case 'find':
                commandStruct.admincmds.get('find').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'purge':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('purge').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                };
                break;

            case 'test':
                commandStruct.commands.get('test').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;

            // music

            // WIP
            case 'compare': case 'whatif': case 'play': case 'pause': case 'np': case 'wip': case 'skip': case 'queue': case 'resume':
                obj.reply({ content: 'This command is currently under development. Will be added later.', allowedMentions: { repliedUser: false } })
                    .catch()
                break;

        }

        fs.appendFileSync('logs/totalcommands.txt', 'x');
        return;
    }
}


