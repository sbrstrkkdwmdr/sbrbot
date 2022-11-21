import fs = require('fs');
import checks = require('./src/checks');
import extypes = require('./src/types/extratypes');
import defaults = require('./src/consts/defaults');
import Discord = require('discord.js');
import cd = require('./src/consts/cooldown');
import func = require('./src/tools');

import commands = require('./commands/cmdGeneral');
import osucmds = require('./commands/cmdosu');
import admincmds = require('./commands/cmdAdmin');
import misccmds = require('./commands/cmdMisc');
import checkcmds = require('./commands/cmdChecks');

module.exports = (userdata, client: Discord.Client, config: extypes.config, oncooldown, guildSettings, trackDb, statsCache) => {
    let timeouttime;
    const graphChannel = client.channels.cache.get(config.graphChannelId) as Discord.TextChannel;

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();

        if (message.author.bot && !(message.author.id == client.user.id)) return;

        const currentGuildId = message.guildId
        let settings;//: extypes.guildSettings;
        try {
            const curGuildSettings = await guildSettings.findOne({ where: { guildid: message.guildId } });
            settings = curGuildSettings.dataValues;
        } catch (error) {
            try {
                await guildSettings.create({
                    guildid: message.guildId,
                    guildname: message?.guild?.name ?? 'Unknown',
                    prefix: 'sbr-',
                })
            } catch (error) {

            }
            settings = {
                guildid: message.guildId,
                guildname: message?.guild?.name ?? 'Unknown',
                prefix: 'sbr-',
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

        const absoluteID = func.generateId();
        const interaction = null;
        const button = null;
        const obj = message;
        const overrides = null;
        execCommand(command, 'message', message, overrides, button, absoluteID, currentDate, message.author.id, args);
    });

    //@ts-expect-error interaction => promise msg/interaction not assignable to interaction => awaitable void
    client.on('interactionCreate', async (interaction) => {
        if (!(interaction.type === Discord.InteractionType.ApplicationCommand)) { return; }
        interaction = interaction as Discord.ChatInputCommandInteraction;

        const currentDate = new Date()
        const currentDateISO = new Date().toISOString()
        const absoluteID = func.generateId();

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
        let settings;//: extypes.guildSettings;
        try {
            const curGuildSettings = await guildSettings.findOne({ where: { guildid: currentGuildId } });
            settings = curGuildSettings.dataValues;
        } catch (error) {
            try {
                await guildSettings.create({
                    guildid: interaction.guildId,
                    guildname: interaction?.guild?.name ?? 'Unknown',
                    prefix: 'sbr-',
                })
            } catch (error) {
                console.log(error)
            }
            settings = {
                guildid: interaction.guildId,
                guildname: interaction?.guild?.name ?? 'Unknown',
                prefix: 'sbr-',
            };
        }
        execCommand(interaction.commandName, 'interaction', interaction, null, button, absoluteID, currentDate, interaction.member.user.id, args);
    });

    function execCommand(command: string, commandType: extypes.commandType, obj: Discord.Message | Discord.ChatInputCommandInteraction, overrides: extypes.overrides, button: null, absoluteID: number, currentDate: Date, userid: string | number, args: string[]) {
        if (!checks.botHasPerms(obj, client, ['ReadMessageHistory'])) return;
        if (!checks.botHasPerms(obj, client, ['SendMessages', 'ReadMessageHistory', 'ViewChannel']) && commandType == 'message') return;
        //if is thread check if bot has perms
        if (!checks.botHasPerms(obj, client, ['SendMessagesInThreads']) &&
            obj.channel.type == Discord.ChannelType.GuildPublicThread ||
            obj.channel.type == Discord.ChannelType.GuildPrivateThread) return;
        const input: extypes.commandInput = { commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel }
        switch (command) {
            case 'convert':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commands.convert({
                        commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel
                    })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'help':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('help').execute({commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata})
                    commands.help({
                        commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel
                    })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'math':
                commands.math({
                    commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel
                })
                // commandStruct.commands.get('math').execute({commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata})
                break;
            case 'ping':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commands.ping({
                        commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel
                    })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'remind':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('remind').execute({commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata})
                    commands.remind({
                        commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel
                    })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'stats':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('stats').execute({commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata})
                    commands.stats({
                        commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel
                    })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'time':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('time').execute({commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata})
                    commands.time({
                        commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel
                    })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'info':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('info').execute({commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata})
                    commands.info({
                        commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel
                    })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;

            case '8ball': case 'ask':
                misccmds._8ball({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                break;
            // case 'gif':
            //     if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
            //         misccmds.gif({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
            //     } else {
            //         checkcmds.noperms(commandType, obj, 'bot')
            //     }
            //     break;
            case 'image': case 'imagesearch':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    misccmds.image({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'poll': case 'vote':
                if ((
                    (checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') ||
                    commandType == 'interaction') &&
                    checks.botHasPerms(obj, client, ['AddReactions'])) {
                    misccmds.poll({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'roll':
                misccmds.roll({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                break;
            // case 'say':
            //     if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
            //         misccmds.say({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
            //     } else {
            //         checkcmds.noperms(commandType, obj, 'bot')
            //     }
            //     break;
            case 'ytsearch': case 'yt':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    misccmds.ytsearch({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;

            //osu commands below

            case 'bws': case 'badgeweightsystem': case 'badgeweight': case 'badgeweightseed': case 'badgerank':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.bws({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'compare':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.compare({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'common':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'top'
                    }
                    osucmds.compare({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'firsts': case 'firstplaceranks': case 'fpr': case 'fp': case '#1s': case 'first': case '#1': case '1s':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.firsts({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'globals':
                osucmds.globals({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.maplb({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'lb':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.lb({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'map': case 'm':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.map({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'maprandom': case 'f2': case 'maprand': case 'mapsuggest': case 'randommap': case 'randmap':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.randomMap({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'nochokes': case 'nc':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.nochokes({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'osu': case 'profile': case 'o':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.osu({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'osuset': case 'setuser': case 'set':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.osuset({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'setmode':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'mode'
                    }
                    osucmds.osuset({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'setskin':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'skin'
                    }
                    osucmds.osuset({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'osutop': case 'top': case 't': case 'ot': case 'toposu': case 'topo':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'taikotop': case 'toptaiko': case 'tt': case 'topt':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'taiko'
                    }
                    osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'ctbtop': case 'fruitstop': case 'catchtop': case 'topctb': case 'topfruits': case 'topcatch': case 'tctb': case 'tf': case 'topf': case 'topc':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'fruits'
                    }
                    osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'maniatop': case 'topmania': case 'tm': case 'topm':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'mania'
                    }
                    osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'sotarks': case 'sotarksosu':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        filterMapper: 'Sotarks'
                    }
                    osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'sotarkstaiko': case 'taikosotarks': case 'sotarkst': case 'tsotarks':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        filterMapper: 'Sotarks',
                        mode: 'taiko'
                    }
                    osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'sotarksfruits': case 'fruitssotarks': case 'fruitsotarks': case 'sotarksfruit': case 'sotarkscatch': case 'catchsotarks':
            case 'sotarksctb': case 'ctbsotarks': case 'fsotarks': case 'sotarksf': case 'csotarks': case 'sotarksc':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        filterMapper: 'Sotarks',
                        mode: 'fruits'
                    }
                    osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'sotarksmania': case 'maniasottarks': case 'sotarksm': case 'msotarks':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        filterMapper: 'Sotarks',
                        mode: 'mania'
                    }
                    osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;

            case 'pinned':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.pinned({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'pp':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    const overrides = {
                        type: 'pp',
                        commandAs: commandType
                    }
                    osucmds.rankpp({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, statsCache, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'rank':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    const overrides = {
                        type: 'rank',
                        commandAs: commandType
                    }
                    osucmds.rankpp({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, statsCache, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'ranking': case 'rankings':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.ranking({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, statsCache, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'rs': case 'recent': case 'r':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'rs best': case 'recent best':
            case 'rsbest': case 'recentbest': case 'rb':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list',
                        sort: 'pp'
                    }
                    osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'recentlist': case 'rl':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list'
                    }
                    osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'recentlisttaiko': case 'rlt':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list',
                        mode: 'taiko'
                    }
                    osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'recentlistfruits': case 'rlf': case 'rlctb': case 'rlc':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list',
                        mode: 'fruits'
                    }
                    osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'recentlistmania': case 'rlm':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list',
                        mode: 'mania'
                    }
                    osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'recenttaiko': case 'rt':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'taiko'
                    }
                    osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'recentfruits': case 'rf': case 'rctb':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'fruits'
                    }
                    osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'recentmania': case 'rm':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'mania'
                    }
                    osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'saved':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.saved({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;

            case 'scoreparse': case 'score': case 'sp':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.scoreparse({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'scores': case 'c':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.scores({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'scorestats': case 'ss':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.scorestats({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'simplay': case 'simulate': case 'sim':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.simulate({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'skin':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'skin',
                        ex: 'skin',
                        commandAs: commandType
                    }
                    osucmds.saved({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'trackadd': case 'track': case 'ta':
                osucmds.trackadd({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings, graphChannel })
                break;
            case 'trackremove': case 'trackrm': case 'tr': case 'untrack':
                osucmds.trackremove({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings, graphChannel })
                break;
            case 'trackchannel': case 'tc':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    osucmds.trackchannel({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings, graphChannel })
                } else {
                    checkcmds.noperms(
                        commandType, obj, 'user'
                    )
                }
                break;
            case 'tracklist': case 'tl':
                osucmds.tracklist({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings, graphChannel })
                break;
            case 'userbeatmaps': case 'ub': case 'userb': case 'ubm': case 'um': case 'usermaps':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.userBeatmaps({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'whatif': case 'wi':
                if ((checks.botHasPerms(obj, client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.whatif({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, statsCache, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;

            //admincmds below
            case 'avatar': case 'av': case 'pfp':
                if (checks.botHasPerms(obj, client, ['Administrator'])) {
                    admincmds.getUserAv({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
                if (checks.botHasPerms(obj, client, ['Administrator'])) {
                    if ((checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid))) {
                        admincmds.checkperms({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                    } else {
                        checkcmds.noperms(
                            commandType, obj, 'user'
                        )
                    }
                } else {
                    checkcmds.noperms(
                        commandType, obj, 'bot'
                    )
                }
                break;
            case 'crash':
                if (checks.isOwner(userid)) {
                    admincmds.crash({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(
                        commandType, obj, 'user'
                    )
                }
                break;
            case 'debug':
                if (checks.isOwner(userid)) {
                    admincmds.debug({
                        commandType, obj, args, button,
                        config, client,
                        absoluteID, currentDate, overrides,
                        userdata, trackDb, guildSettings, graphChannel
                    })
                } else {
                    checkcmds.noperms(
                        commandType, obj, 'user'
                    )
                }
                break;
            // case 'find':
            //     if (checks.botHasPerms(obj, client, ['Administrator'])) {
            //         admincmds.find({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
            //     } else {
            //         checkcmds.noperms(commandType, obj, 'bot')
            //     }
            //     break;
            case 'leaveguild': case 'leave':
                if (checks.isAdmin(userid, obj.guildId, client) || checks.isOwner(userid)) {
                    admincmds.leaveguild({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'user')
                }
                break;
            case 'prefix':
                admincmds.prefix({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, guildSettings, graphChannel })
                break;
            case 'servers':
                if (checks.isOwner(userid)) {
                    admincmds.servers({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(
                        commandType, obj, 'user'
                    )
                }
                break;
            case 'user': case 'userinfo':
                if (checks.botHasPerms(obj, client, ['Administrator'])) {
                    admincmds.getUser({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel })
                } else {
                    checkcmds.noperms(commandType, obj, 'bot')
                }
                break;
        }

        fs.appendFileSync('logs/totalcommands.txt', 'x');
        return;
    }
}


