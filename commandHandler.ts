import Discord from 'discord.js';
import fs from 'fs';
import * as checks from './src/checks.js';
import * as cd from './src/consts/cooldown.js';
import * as defaults from './src/consts/defaults.js';
import * as func from './src/tools.js';

import * as admincmds from './commands/cmdAdmin.js';
import * as checkcmds from './commands/cmdChecks.js';
import * as commands from './commands/cmdGeneral.js';
import * as misccmds from './commands/cmdMisc.js';
import * as osucmds from './commands/cmdosu.js';
import * as mainconst from './src/consts/main.js';
import * as embedStuff from './src/embed.js';
import * as extypes from './src/types/extratypes.js';

export default (input: {
    userdata,
    client: Discord.Client,
    config: extypes.config,
    oncooldown,
    guildSettings,
    trackDb,
    statsCache;
}) => {
    let timeouttime;
    const graphChannel = input.client.channels.cache.get(input.config.graphChannelId) as Discord.TextChannel;

    input.client.on('messageCreate', async (message) => {
        const currentDate = new Date();

        if (message.author.bot && !(message.author.id == input.client.user.id)) return;

        const currentGuildId = message.guildId;
        let settings;//: extypes.guildSettings;
        try {
            const curGuildSettings = await input.guildSettings.findOne({ where: { guildid: message.guildId } });
            settings = curGuildSettings.dataValues;
        } catch (error) {
            try {
                await input.guildSettings.create({
                    guildid: message.guildId,
                    guildname: message?.guild?.name ?? 'Unknown',
                    prefix: 'sbr-',
                });
            } catch (error) {

            }
            settings = {
                guildid: message.guildId,
                guildname: message?.guild?.name ?? 'Unknown',
                prefix: 'sbr-',
            };
        }


        if (!(message.content.startsWith(input.config.prefix) || message.content.startsWith(settings.prefix))) return;

        let usePrefix = input.config.prefix;
        if (message.content.startsWith(settings.prefix)) usePrefix = settings.prefix;

        const args = message.content.slice(usePrefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (!input.oncooldown.has(message.author.id) && cd.cooldownCommands.includes(command)) {
            timeouttime = new Date().getTime() + 3000;
        }
        if (input.oncooldown.has(message.author.id) && cd.cooldownCommands.includes(command)
            && checks.botHasPerms(message, input.client, ['ManageMessages'])) {
            setTimeout(() => {
                message.delete()
                    .catch();
            }, 3000);
        }
        if (input.oncooldown.has(message.author.id) && cd.cooldownCommands.includes(command)) {
            message.reply({
                content: `You're on cooldown!\nTry again in ${getTimeLeft(timeouttime) / 1000}s`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
            });
            return;
        }
        if (!input.oncooldown.has(message.author.id)) {
            input.oncooldown.add(message.author.id);
            setTimeout(() => {
                input.oncooldown.delete(message.author.id);
            }, 3000);
        }
        function getTimeLeft(timeout) {
            return (timeout - new Date().getTime());
        }

        const absoluteID = func.generateId();
        const button = null;
        const overrides = null;
        execCommand(command, 'message', message, overrides, button, absoluteID, currentDate, message.author.id, args);
    });

    input.client.on('interactionCreate', async (interaction) => {
        if (!(interaction.type === Discord.InteractionType.ApplicationCommand)) { return; }
        interaction = interaction as Discord.ChatInputCommandInteraction;

        const currentDate = new Date();
        const absoluteID = func.generateId();

        const args = null;
        const button = null;

        if (!input.oncooldown.has(interaction.member.user.id) && cd.cooldownCommands.includes(interaction.commandName)) {
            timeouttime = new Date().getTime() + 3000;
        }
        if (input.oncooldown.has(interaction.member.user.id) && cd.cooldownCommands.includes(interaction.commandName)) {
            interaction.reply({
                content: `You're on cooldown!\nTry again in ${getTimeLeft(timeouttime) / 1000}s`,
                allowedMentions: { repliedUser: false },
                ephemeral: true
            });
            return;
        }
        if (!input.oncooldown.has(interaction.member.user.id) && cd.cooldownCommands.includes(interaction.commandName)) {
            input.oncooldown.add(interaction.member.user.id);
            timeouttime = new Date().getTime();
            setTimeout(() => {
                input.oncooldown.delete(interaction.member.user.id);
            }, 3000);
        }
        function getTimeLeft(timeout) {
            const timeLeft = timeout - new Date().getTime();
            return Math.floor(timeLeft);
        }


        const currentGuildId = interaction.guildId;
        let settings;//: extypes.guildSettings;
        try {
            const curGuildSettings = await input.guildSettings.findOne({ where: { guildid: currentGuildId } });
            settings = curGuildSettings.dataValues;
        } catch (error) {
            try {
                await input.guildSettings.create({
                    guildid: interaction.guildId,
                    guildname: interaction?.guild?.name ?? 'Unknown',
                    prefix: 'sbr-',
                });
            } catch (error) {
                console.log(error);
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
        let canReply = true;
        if (!checks.botHasPerms(obj, input.client, ['ReadMessageHistory'])) {
            canReply = false;
        }
        if (!checks.botHasPerms(obj, input.client, ['SendMessages', /* 'ViewChannel' */]) && commandType == 'message') return;

        //if is thread check if bot has perms
        if (!checks.botHasPerms(obj, input.client, ['SendMessagesInThreads']) &&
            (obj.channel.type == Discord.ChannelType.PublicThread ||
                obj.channel.type == Discord.ChannelType.PrivateThread)) return;

        const missembed = 'EmbedLinks';

        // const input: extypes.commandInput = { commandType, obj, args, canReply, button,config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel };
        switch (command) {
            case 'convert':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commands.convert({
                        commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel
                    });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'help':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('help').execute({commandType, obj, args, canReply, button,config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata})
                    commands.help({
                        commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel
                    });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'info':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('info').execute({commandType, obj, args, canReply, button,config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata})
                    commands.info({
                        commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel,
                        guildSettings: input.guildSettings
                    });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'invite':
                commands.invite({
                    commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel
                });
                break;
            case 'math':
                commands.math({
                    commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel
                });
                // commandStruct.commands.get('math').execute({commandType, obj, args, canReply, button,config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata})
                break;
            case 'ping':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    commands.ping({
                        commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel
                    });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'remind':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('remind').execute({commandType, obj, args, canReply, button,config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata})
                    commands.remind({
                        commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel
                    });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'stats':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('stats').execute({commandType, obj, args, canReply, button,config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata})
                    commands.stats({
                        commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel
                    });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'time':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    // commandStruct.commands.get('time').execute({commandType, obj, args, canReply, button,config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata})
                    commands.time({
                        commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel
                    });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;

            case '8ball': case 'ask':
                misccmds._8ball({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                break;
            // case 'gif':
            //     if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
            //         misccmds.gif({ commandType, obj, args, canReply, button,config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel })
            //     } else {
            //         checkcmds.noperms(commandType, obj, 'bot', canReply)
            //     }
            //     break;
            case 'image': case 'imagesearch':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    misccmds.image({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'poll': case 'vote':
                if ((
                    (checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') ||
                    commandType == 'interaction') &&
                    checks.botHasPerms(obj, input.client, ['AddReactions'])) {
                    misccmds.poll({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed + ', AddReactions');
                }
                break;
            case 'roll':
                misccmds.roll({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                break;
            // case 'say':
            //     if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
            //         misccmds.say({ commandType, obj, args, canReply, button,config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel })
            //     } else {
            //         checkcmds.noperms(commandType, obj, 'bot', canReply)
            //     }
            //     break;
            case 'ytsearch': case 'yt':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    misccmds.ytsearch({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;

            //osu commands below

            case 'bws': case 'badgeweightsystem': case 'badgeweight': case 'badgeweightseed': case 'badgerank':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.bws({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'compare':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.compare({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'common':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'top'
                    };
                    osucmds.compare({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'firsts': case 'firstplaceranks': case 'fpr': case 'fp': case '#1s': case 'first': case '#1': case '1s':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.firsts({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'globals':
                osucmds.globals({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.maplb({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'lb':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.lb({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'map': case 'm':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.map({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'maprandom': case 'f2': case 'maprand': case 'mapsuggest': case 'randommap': case 'randmap':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.randomMap({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'osu': case 'profile': case 'o': case 'user':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'taiko': case 'drums':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'taiko'
                    };
                    osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'fruits': case 'ctb': case 'catch':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'fruits'
                    };
                    osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'mania':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'mania'
                    };
                    osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'osuset': case 'setuser': case 'set':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'setmode':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'mode'
                    };
                    osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'setskin':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'skin'
                    };
                    osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'nochokes': case 'nc':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        miss: true
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'osutop': case 'top': case 't': case 'ot': case 'toposu': case 'topo':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'taikotop': case 'toptaiko': case 'tt': case 'topt':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'taiko'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'ctbtop': case 'fruitstop': case 'catchtop': case 'topctb': case 'topfruits': case 'topcatch': case 'tctb': case 'tf': case 'topf': case 'topc':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'fruits'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'maniatop': case 'topmania': case 'tm': case 'topm':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'mania'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'sotarks': case 'sotarksosu':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        filterMapper: 'Sotarks'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'sotarkstaiko': case 'taikosotarks': case 'sotarkst': case 'tsotarks':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        filterMapper: 'Sotarks',
                        mode: 'taiko'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'sotarksfruits': case 'fruitssotarks': case 'fruitsotarks': case 'sotarksfruit': case 'sotarkscatch': case 'catchsotarks':
            case 'sotarksctb': case 'ctbsotarks': case 'fsotarks': case 'sotarksf': case 'csotarks': case 'sotarksc':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        filterMapper: 'Sotarks',
                        mode: 'fruits'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'sotarksmania': case 'maniasottarks': case 'sotarksm': case 'msotarks':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        filterMapper: 'Sotarks',
                        mode: 'mania'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;

            case 'pinned':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.pinned({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'ppcalc': case 'mapcalc': case 'mapperf': case 'maperf': case 'mappp':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.ppCalc({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'pp':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    const overrides = {
                        type: 'pp',
                        commandAs: commandType
                    };
                    osucmds.rankpp({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'rank':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    const overrides = {
                        type: 'rank',
                        commandAs: commandType
                    };
                    osucmds.rankpp({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'ranking': case 'rankings':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.ranking({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'rs': case 'recent': case 'r':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'rs best': case 'recent best':
            case 'rsbest': case 'recentbest': case 'rb':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list',
                        sort: 'pp'
                    };
                    osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'recentlist': case 'rl':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list'
                    };
                    osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'recentlisttaiko': case 'rlt':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list',
                        mode: 'taiko'
                    };
                    osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'recentlistfruits': case 'rlf': case 'rlctb': case 'rlc':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list',
                        mode: 'fruits'
                    };
                    osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'recentlistmania': case 'rlm':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'list',
                        mode: 'mania'
                    };
                    osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'recenttaiko': case 'rt':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'taiko'
                    };
                    osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'recentfruits': case 'rf': case 'rctb':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'fruits'
                    };
                    osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'recentmania': case 'rm':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        mode: 'mania'
                    };
                    osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'recentactivity':case 'recentact': case 'rsact':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.recent_activity({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'saved':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.saved({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;

            case 'scoreparse': case 'score': case 'sp':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.scoreparse({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'scores': case 'c':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.scores({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'scorestats': case 'ss':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.scorestats({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'simplay': case 'simulate': case 'sim':
                // checkcmds.disabled(commandType, obj, 'command');
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.simulate({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'skin':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    overrides = {
                        type: 'skin',
                        ex: 'skin',
                        commandAs: commandType
                    };
                    osucmds.saved({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'trackadd': case 'track': case 'ta':
                osucmds.trackadd({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings, graphChannel });
                break;
            case 'trackremove': case 'trackrm': case 'tr': case 'untrack':
                osucmds.trackremove({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings, graphChannel });
                break;
            case 'trackchannel': case 'tc':
                if (checks.isAdmin(userid, obj.guildId, input.client) || checks.isOwner(userid)) {
                    osucmds.trackchannel({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'user', canReply, '');
                }
                break;
            case 'tracklist': case 'tl':
                osucmds.tracklist({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings, graphChannel });
                break;
            case 'userbeatmaps': case 'ub': case 'userb': case 'ubm': case 'um': case 'usermaps':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel, statsCache: input.statsCache });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;
            case 'whatif': case 'wi':
                if ((checks.botHasPerms(obj, input.client, ['EmbedLinks']) && commandType == 'message') || commandType == 'interaction') {
                    osucmds.whatif({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, missembed);
                }
                break;

            //admincmds below
            case 'avatar': case 'av': case 'pfp':
                if (checks.botHasPerms(obj, input.client, ['Administrator'])) {
                    admincmds.getUserAv({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, 'Administrator');
                }
                break;
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
                if (checks.botHasPerms(obj, input.client, ['Administrator'])) {
                    if ((checks.isAdmin(userid, obj.guildId, input.client) || checks.isOwner(userid))) {
                        admincmds.checkperms({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                    } else {
                        checkcmds.noperms(commandType, obj, 'user', canReply, 'Administrator');
                    }
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, 'Administrator');
                }
                break;
            case 'crash':
                if (checks.isOwner(userid)) {
                    admincmds.crash({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'user', canReply, 'Administrator');
                }
                break;
            case 'debug':
                if (checks.isOwner(userid)) {
                    admincmds.debug({
                        commandType, obj, args, canReply, button,
                        config: input.config, client: input.client,
                        absoluteID, currentDate, overrides,
                        userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings, graphChannel
                    });
                } else {
                    checkcmds.noperms(commandType, obj, 'user', canReply, 'Administrator');
                }
                break;
            case 'leaveguild': case 'leave':
                if (checks.isAdmin(userid, obj.guildId, input.client) || checks.isOwner(userid)) {
                    admincmds.leaveguild({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'user', canReply, 'Administrator');
                }
                break;
            case 'prefix':
                admincmds.prefix({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, guildSettings: input.guildSettings, graphChannel });
                break;
            case 'servers':
                if (checks.isOwner(userid)) {
                    admincmds.servers({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'user', canReply, 'Administrator');
                }
                break;
            /* case 'user': */ case 'userinfo':
                if (checks.botHasPerms(obj, input.client, ['Administrator'])) {
                    admincmds.getUser({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, graphChannel });
                } else {
                    checkcmds.noperms(commandType, obj, 'bot', canReply, 'Administrator');
                }
                break;
        }

        fs.appendFileSync('logs/totalcommands.txt', 'x');
        return;
    }
}


