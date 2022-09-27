import fs = require('fs');
import checks = require('./src/checks');
import extypes = require('./src/types/extratypes');
import defaults = require('./src/consts/defaults');
import Discord = require('discord.js');
import cd = require('./src/consts/cooldown');

module.exports = (userdata, client, commandStruct, config, oncooldown, guildSettings, trackDb) => {
    let timeouttime;

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();
        const absoluteID = currentDate.getTime();

        if (message.author.bot && !message.author.id == client.user.id) return;

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const curGuildSettings = await guildSettings.findOne({ where: { guildid: message.guildId } });
            settings = curGuildSettings.dataValues;
        } catch (error) {
            try {
                await guildSettings.create({
                    guildid: message.guildId,
                    guildname: message?.guild?.name ?? 'Unknown',
                    prefix: 'sbr-',
                    osuParseLinks: true,
                    osuParseScreenshots: true,
                    osuParseReplays: true,
                })
            } catch (error) {

            }
            settings = {
                guildid: message.guildId,
                guildname: message?.guild?.name ?? 'Unknown',
                prefix: 'sbr-',
                osuParseLinks: true,
                osuParseScreenshots: true,
                osuParseReplays: true,
            };
        }


        if (!(message.content.startsWith(config.prefix) || message.content.startsWith(settings.prefix))) return;

        let usePrefix = config.prefix;
        if (message.content.startsWith(settings.prefix)) usePrefix = settings.prefix;

        const args = message.content.slice(usePrefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (!oncooldown.has(message.author.id) && cd.cooldownCommands.includes(command)) {
            timeouttime = new Date().getTime() + 3000
        }
        if (oncooldown.has(message.author.id) && cd.cooldownCommands.includes(command)
            && checks.botHasPerms(message, client, ['ManageMessages'])) {
            setTimeout(() => {
                message.delete()
                    .catch()
            }, 3000)
        }
        if (oncooldown.has(message.author.id) && cd.cooldownCommands.includes(command)) {
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
        execCommand(command, 'message', message, overrides, button, absoluteID, currentDate, message.author.id, args);
    });

    client.on('interactionCreate', async (interaction) => {
        if (!(interaction.type === Discord.InteractionType.ApplicationCommand)) return;
        const currentDate = new Date()
        const currentDateISO = new Date().toISOString()
        const absoluteID = currentDate.getTime();

        const message = null;
        const args = null;
        const button = null;
        const obj = interaction;

        if (!oncooldown.has(interaction.member.user.id) && cd.cooldownCommands.includes(interaction.commandName)) {
            timeouttime = new Date().getTime() + 3000
        }
        if (oncooldown.has(interaction.member.user.id) && cd.cooldownCommands.includes(interaction.commandName)) {
            return interaction.reply({
                content: `You're on cooldown!\nTry again in ${getTimeLeft(timeouttime) / 1000}s`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
                ephemeral: true
            });
        }
        if (!oncooldown.has(interaction.member.user.id) && cd.cooldownCommands.includes(interaction.commandName)) {
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
            const curGuildSettings = await guildSettings.findOne({ where: { guildid: currentGuildId } });
            settings = curGuildSettings.dataValues;
        } catch (error) {
            try {
                await guildSettings.create({
                    guildid: interaction.guildId,
                    guildname: interaction?.guild?.name ?? 'Unknown',
                    prefix: 'sbr-',
                    osuParseLinks: true,
                    osuParseScreenshots: true,
                    osuParseReplays: true,
                })
            } catch (error) {
                console.log(error)
            }
            settings = {
                guildid: interaction.guildId,
                guildname: interaction?.guild?.name ?? 'Unknown',
                prefix: 'sbr-',
                osuParseLinks: true,
                osuParseScreenshots: true,
                osuParseReplays: true,
            };
        }
        execCommand(interaction.commandName, 'interaction', interaction, null, button, absoluteID, currentDate, interaction.member.user.id, args);
    });

    function execCommand(command: string, commandType: string, obj: Discord.Message | Discord.Interaction, overrides: null, button: null, absoluteID: number, currentDate: Date, userid: string | number, args: string[]) {
        if (!checks.botHasPerms(obj, client, ['ReadMessageHistory'])) return;
        if (!checks.botHasPerms(obj, client, ['SendMessages', 'ReadMessageHistory', 'ViewChannel']) && commandType == 'message') return;
        //if is thread check if bot has perms
        if (!checks.botHasPerms(obj, client, ['SendMessagesInThreads']) &&
            obj.channel.type == Discord.ChannelType.GuildPublicThread ||
            obj.channel.type == Discord.ChannelType.GuildPrivateThread) return;

        switch (command) {
            case 'convert':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.commands.get('convert').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'help':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.commands.get('help').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'math':
                commandStruct.commands.get('math').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'ping':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.commands.get('ping').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'remind':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.commands.get('remind').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'stats':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.commands.get('stats').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'time':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.commands.get('time').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'info':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.commands.get('info').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;

            case '8ball': case 'ask':
                commandStruct.misccmds.get('8ball').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'gif':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.misccmds.get('gif').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'image': case 'imagesearch':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.misccmds.get('image').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'poll': case 'vote':
                if ((
                    (checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') ||
                    commandType == 'interaction') &&
                    checks.botHasPerms(obj, client, ['AddReactions'])) {
                    commandStruct.misccmds.get('poll').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'roll':
                commandStruct.misccmds.get('roll').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;
            case 'say':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.misccmds.get('say').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'ytsearch': case 'yt':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.misccmds.get('ytsearch').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;

            //osu commands below

            case 'bws':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('bws').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'compare':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('compare').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'firsts':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('firsts').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            // case 'globals':
            //     commandStruct.osucmds.get('globals').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
            //     break;
            case 'ranking':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('ranking').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('maplb').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'lb':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('lb').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'map': case 'm':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('map').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'nochokes': case 'nc':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('nochokes').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'osu': case 'profile': case 'o': case 'user':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('osu').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'osuset':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('osuset').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'osutop': case 'top':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('osutop').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'pinned':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('pinned').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'rs': case 'recent': case 'r':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('recent').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'scoreparse': case 'score': case 'sp':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('scoreparse').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'scores': case 'c':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('scores').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'simplay': case 'simulate':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('simulate').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'skin':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commandStruct.osucmds.get('skin').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'trackadd': case 'track': case 'ta':
                commandStruct.osucmds.get('track').add(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings)
                break;
            case 'trackremove': case 'trackrm': case 'tr': case 'untrack':
                commandStruct.osucmds.get('track').remove(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings)
                break;
            case 'trackchannel': case 'tc':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.osucmds.get('track').setChannel(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings)
                } else {
                    commandStruct.checks.get('noperms').execute(
                        commandType, obj, 'user'
                    )
                }
                break;
            case 'tracklist': case 'tl':
                commandStruct.osucmds.get('track').userList(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings)
                break;
            case 'whatif':
                commandStruct.osucmds.get('whatif').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                break;

            //admincmds below
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
                if (checks.botHasPerms(obj, client, ['Administrator'])) {
                    if ((checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid))) {
                        commandStruct.admincmds.get('checkperms').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                    } else {
                        commandStruct.checks.get('noperms').execute(
                            commandType, obj, 'user'
                        )
                    }
                } else {
                    commandStruct.checks.get('noperms').execute(
                        commandType, obj, 'bot'
                    )
                }
                break;
            case 'crash':
                if (checks.isOwner(userid)) {
                    commandStruct.admincmds.get('crash').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(
                        commandType, obj, 'user'
                    )
                }
                break;
            case 'find':
                if (checks.botHasPerms(obj, client, ['Administrator'])) {
                    commandStruct.admincmds.get('find').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(commandType, obj, 'bot')
                }
                break;
            case 'leaveguild': case 'leave':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('leaveguild').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.commands.get('noperms').execute(
                        commandType, obj
                    )
                }
                break;
            case 'prefix':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    commandStruct.admincmds.get('prefix').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, guildSettings)
                } else {
                    commandStruct.checks.get('noperms').execute(
                        commandType, obj, 'user'
                    )
                }
                break;
            case 'servers':
                if (checks.isOwner(userid)) {
                    commandStruct.admincmds.get('servers').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata)
                } else {
                    commandStruct.checks.get('noperms').execute(
                        commandType, obj, 'user'
                    )
                }
                break;
        }

        fs.appendFileSync('logs/totalcommands.txt', 'x');
        return;
    }
}


