import Discord from 'discord.js';
import fs from 'fs';
import { path } from './path.js';
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

        const allowed = execCommand_checker(command, commandType, obj, overrides, button, absoluteID, currentDate, userid, args, canReply);

        if (allowed == true) {
            execCommand_switch(command, commandType, obj, overrides, button, absoluteID, currentDate, userid, args, canReply);
        }
        fs.appendFileSync(`${path}/logs/totalcommands.txt`, 'x');
        return;
    }

    function execCommand_checker(command: string, commandType: extypes.commandType, obj: Discord.Message | Discord.ChatInputCommandInteraction, overrides: extypes.overrides, button: null, absoluteID: number, currentDate: Date, userid: string | number, args: string[],
        canReply: boolean,
    ) {
        const requireEmbedCommands: string[] = [
            //gen
            'convert', 'help', 'info', 'invite', 'ping', 'remind', 'stats', 'time',
            //misc
            'image', 'imagesearch', 'poll', 'vote', 'ytsearch', 'yt', 'yts',
            //osu
            'bws', 'badgeweightsystem', 'badgeweight', 'badgeweightseed', 'badgerank',
            'compare', 'common',
            'firsts', 'firstplaceranks', 'fpr', 'fp', '#1s', 'first', '#1', '1s',
            'globals',
            'leaderboard', 'maplb', 'mapleaderboard',
            'lb',
            'map', 'm',
            'maprandom', 'f2', 'maprand', 'mapsuggest', 'randommap', 'randmap',
            'osu', 'profile', 'o', 'user', 'taiko', 'drums', 'fruits', 'ctb', 'catch', 'mania',
            'osuseet', 'setuser', 'set', 'setmode', 'setskin',
            'nochokes', 'nc',
            'osutop', 'top', 't', 'ot', 'toposu', 'topo',
            'taikotop', 'toptaiko', 'tt', 'topt',
            'ctbtop', 'fruitstop', 'catchtop', 'topctb', 'topfruits', 'topcatch', 'tctb', 'tf', 'topf', 'topc',
            'maniatop', 'topmania', 'tm', 'topm',
            'sotarks', 'sotarksosu', 'sotarkstaiko', 'taikosotarks', 'sotarkst', 'tsotarks',
            'sotarksfruits', 'fruitssotarks', 'fruitsotarks', 'sotarksfruit', 'sotarkscatch', 'catchsotarks', 'sotarksctb', 'ctbsotarks', 'fsotarks', 'sotarksf', 'csotarks', 'sotarksc',
            'sotarksmania', 'maniasotarks', 'sotarksm', 'msotarks',
            'pinned',
            'ppcalc', 'mapcalc', 'mapperf', 'maperf', 'mappp',
            'pp', 'rank',
            'ranking', 'rankings',
            'rs', 'recent', 'r',
            'rs best', 'recent best', 'rsbest', 'recentbest', 'rb',
            'recentlist', 'rl',
            'recentlisttaiko', 'rlt',
            'recentlistfruits', 'rlf', 'rlctb', 'rlc',
            'recentlistmania', 'rlm',
            'recenttaiko', 'rt',
            'recentfruits', 'rf', 'rctb',
            'recentmania', 'rm',
            'recentactivity', 'recentact', 'rsact',
            'saved',
            'scoreparse', 'score', 'sp',
            'scores', 'c',
            'scorestats', 'ss',
            'simplay', 'simulate', 'sim',
            'skin',
            'trackadd', 'track', 'ta', 'trackremove', 'trackrm', 'tr', 'untrack', 'trackchannel', 'tc', 'tracklist', 'tl',
            'userbeatmaps', 'ub', 'userb', 'ubm', 'um', 'usermaps',
            'whatif', 'wi',
            //admin
            'avatar', 'av', 'pfp',
            'checkperms', 'fetchperms', 'checkpermissions', 'permissions', 'perms',
            'prefix', 'servers', 'userinfo'
        ];
        const requireReactions: string[] = [
            'poll', 'vote'
        ];
        const botRequireAdmin: string[] = [
            'avatar', 'av', 'pfp',
            'checkperms', 'fetchperms', 'checkpermissions', 'permissions', 'perms',
            'userinfo'
        ];
        const userRequireAdminOrOwner: string[] = [
            'checkperms', 'fetchperms', 'checkpermissions', 'permissions', 'perms',
            'userinfo'
        ];

        const userRequireOwner: string[] = [
            'crash', 'debug', 'servers'
        ];

        let allowed = true;
        let missingPermsBot: string[] = [];
        let missingPermsUser: string[] = [];

        if (
            requireEmbedCommands.includes(command) && commandType == 'message' &&
            !checks.botHasPerms(obj, input.client, ['EmbedLinks'])
        ) {
            missingPermsBot.push('EmbedLinks');
        }

        if (requireReactions.includes(command) && !checks.botHasPerms(obj, input.client, ['AddReactions'])) {
            missingPermsBot.push('AddReactions');
        }
        if (botRequireAdmin.includes(command) && !checks.botHasPerms(obj, input.client, ['Administrator'])) {
            missingPermsBot.push('Administrator');
        }
        if (userRequireAdminOrOwner.includes(command) && !(checks.isAdmin(userid, obj.guildId, input.client) || checks.isOwner(userid))) {
            missingPermsUser.push('Administrator');
        }
        if (userRequireOwner.includes(command) && !(checks.isOwner(userid))) {
            missingPermsUser.push('Owner');
        }
        if (missingPermsBot.length > 0) {
            allowed = false;
            checkcmds.noperms(commandType, obj, 'bot', canReply, missingPermsBot.join(', '));
        }
        if (missingPermsUser.length > 0 &&
            !(commandType == 'interaction' && missingPermsBot.length > 0)
        ) {
            checkcmds.noperms(commandType, obj, 'user', canReply, missingPermsUser.join(', '));
            allowed = false;
        }

        return allowed;
    }

    function execCommand_switch(command: string, commandType: extypes.commandType, obj: Discord.Message | Discord.ChatInputCommandInteraction, overrides: extypes.overrides, button: null, absoluteID: number, currentDate: Date, userid: string | number, args: string[],
        canReply: boolean,
    ) {
        switch (command) {
            case 'convert':case 'conv':
                commands.convert({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'help':
                commands.help({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'info':
                commands.info({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   guildSettings: input.guildSettings });
                break;
            case 'invite':
                commands.invite({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'math':
                commands.math({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'ping':
                commands.ping({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'remind':
                commands.remind({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'stats':
                commands.stats({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'time':
                commands.time({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;

            //misc
            case '8ball': case 'ask':
                misccmds._8ball({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'coin':case 'coinflip': case 'flip':
                misccmds.coin({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'image': case 'imagesearch':
                misccmds.image({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'poll': case 'vote':
                misccmds.poll({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'roll':
                misccmds.roll({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'ytsearch': case 'yt': case 'yts':
                misccmds.ytsearch({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;

            //osu commands below

            case 'badges':
                osucmds.badges({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;

            case 'bws': case 'badgeweightsystem': case 'badgeweight': case 'badgeweightseed': case 'badgerank':
                osucmds.bws({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'compare':
                osucmds.compare({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'common': {
                overrides = {
                    type: 'top'
                };
                osucmds.compare({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
            } break;
            case 'firsts': case 'firstplaceranks': case 'fpr': case 'fp': case '#1s': case 'first': case '#1': case '1s':
                osucmds.firsts({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'globals': case 'osc': case 'osustatscount':
                osucmds.globals({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                osucmds.maplb({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'lb':
                osucmds.lb({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'map': case 'm':
                osucmds.map({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'maprandom': case 'f2': case 'maprand': case 'mapsuggest': case 'randommap': case 'randmap':
                osucmds.randomMap({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'osu': case 'profile': case 'o': case 'user':
                osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'taiko': case 'drums': {
                overrides = {
                    mode: 'taiko'
                };
                osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'fruits': case 'ctb': case 'catch': {
                overrides = {
                    mode: 'fruits'
                };
                osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'mania': {
                overrides = {
                    mode: 'mania'
                };
                osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'osuset': case 'setuser': case 'set':
                osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'setmode': {
                overrides = {
                    type: 'mode'
                };
                osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
            } break;
            case 'setskin': {
                overrides = {
                    type: 'skin'
                };
                osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
            } break;
            case 'nochokes': case 'nc': {
                overrides = {
                    miss: true
                };
                osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'osutop': case 'top': case 't': case 'ot': case 'toposu': case 'topo':
                osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'taikotop': case 'toptaiko': case 'tt': case 'topt':
                {
                    overrides = {
                        mode: 'taiko'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                } break;
            case 'ctbtop': case 'fruitstop': case 'catchtop': case 'topctb': case 'topfruits': case 'topcatch': case 'tctb': case 'tf': case 'topf': case 'topc':
                {
                    overrides = {
                        mode: 'fruits'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                } break;
            case 'maniatop': case 'topmania': case 'tm': case 'topm':
                {
                    overrides = {
                        mode: 'mania'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                } break;
            case 'sotarks': case 'sotarksosu':
                {
                    overrides = {
                        filterMapper: 'Sotarks'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                } break;
            case 'sotarkstaiko': case 'taikosotarks': case 'sotarkst': case 'tsotarks':
                {
                    overrides = {
                        filterMapper: 'Sotarks',
                        mode: 'taiko'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                } break;
            case 'sotarksfruits': case 'fruitssotarks': case 'fruitsotarks': case 'sotarksfruit': case 'sotarkscatch': case 'catchsotarks':
            case 'sotarksctb': case 'ctbsotarks': case 'fsotarks': case 'sotarksf': case 'csotarks': case 'sotarksc':
                {
                    overrides = {
                        filterMapper: 'Sotarks',
                        mode: 'fruits'
                    };
                    osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                } break;
            case 'sotarksmania': case 'maniasottarks': case 'sotarksm': case 'msotarks': {
                overrides = {
                    filterMapper: 'Sotarks',
                    mode: 'mania'
                };
                osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;

            case 'pinned': {
                osucmds.pinned({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'ppcalc': case 'mapcalc': case 'mapperf': case 'maperf': case 'mappp': {
                osucmds.ppCalc({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
            } break;
            case 'pp': {
                overrides = {
                    type: 'pp',
                    commandAs: commandType
                };
                osucmds.rankpp({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache  });
            } break;
            case 'rank': {
                overrides = {
                    type: 'rank',
                    commandAs: commandType
                };
                osucmds.rankpp({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache  });
            } break;
            case 'ranking': case 'rankings':
                osucmds.ranking({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache  });
                break;
            case 'rs': case 'recent': case 'r':
                osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'rs best': case 'recent best':
            case 'rsbest': case 'recentbest': case 'rb': {
                overrides = {
                    type: 'list',
                    sort: 'pp'
                };
                osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'recentlist': case 'rl': {
                overrides = {
                    type: 'list'
                };
                osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'recentlisttaiko': case 'rlt': {
                overrides = {
                    type: 'list',
                    mode: 'taiko'
                };
                osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'recentlistfruits': case 'rlf': case 'rlctb': case 'rlc': {
                overrides = {
                    type: 'list',
                    mode: 'fruits'
                };
                osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'recentlistmania': case 'rlm': {
                overrides = {
                    type: 'list',
                    mode: 'mania'
                };
                osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'recenttaiko': case 'rt': {
                overrides = {
                    mode: 'taiko'
                };
                osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'recentfruits': case 'rf': case 'rctb': {
                overrides = {
                    mode: 'fruits'
                };
                osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'recentmania': case 'rm': {
                overrides = {
                    mode: 'mania'
                };
                osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            } break;
            case 'recentactivity': case 'recentact': case 'rsact':
                osucmds.recent_activity({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'saved':
                osucmds.saved({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;

            case 'scoreparse': case 'score': case 'sp':
                osucmds.scoreparse({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'scores': case 'c':
                osucmds.scores({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'scorestats': case 'ss':
                osucmds.scorestats({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'simplay': case 'simulate': case 'sim':
                osucmds.simulate({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'skin': {
                overrides = {
                    type: 'skin',
                    ex: 'skin',
                    commandAs: commandType
                };
                osucmds.saved({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
            } break;
            case 'trackadd': case 'track': case 'ta':
                osucmds.trackadd({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings  });
                break;
            case 'trackremove': case 'trackrm': case 'tr': case 'untrack':
                osucmds.trackremove({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings  });
                break;
            case 'trackchannel': case 'tc':
                osucmds.trackchannel({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings  });
                break;
            case 'tracklist': case 'tl':
                osucmds.tracklist({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings  });
                break;
            case 'userbeatmaps': case 'ub': case 'userb': case 'ubm': case 'um': case 'usermaps':
                osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
                break;
            case 'ranked': {
                overrides = {
                    ex: 'ranked'
                };
                osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            }
                break;
            case 'favourite': case 'favourites': {
                overrides = {
                    ex: 'favourite'
                };
                osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            }
                break;
            case 'graveyard': case 'unranked': {
                overrides = {
                    ex: 'graveyard'
                };
                osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            }
                break;
            case 'loved': {
                overrides = {
                    ex: 'loved'
                };
                osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            }
                break;
            case 'most_played': case 'mostplayed': case 'mp': {
                overrides = {
                    ex: 'most_played'
                };
                osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            }
                break;
            case 'pending': case 'wip': {
                overrides = {
                    ex: 'pending'
                };
                osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            }
                break;
            case 'nominated': case 'bn': {
                overrides = {
                    ex: 'nominated'
                };
                osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            }
                break;
            case 'guest': case 'gd': {
                overrides = {
                    ex: 'guest'
                };
                osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata,   statsCache: input.statsCache });
            }
                break;


            case 'whatif': case 'wi':
                osucmds.whatif({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache  });
                break;

            //admincmds below
            case 'avatar': case 'av': case 'pfp':
                admincmds.getUserAv({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
                admincmds.checkperms({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'crash':
                admincmds.crash({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'debug':
                admincmds.debug({
                    commandType, obj, args, canReply, button,
                    config: input.config, client: input.client,
                    absoluteID, currentDate, overrides,
                    userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings 
                });
                break;
            case 'leaveguild': case 'leave':
                admincmds.leaveguild({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            case 'prefix':
                admincmds.prefix({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, guildSettings: input.guildSettings  });
                break;
            case 'servers':
                admincmds.servers({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
            /* case 'user': */ case 'userinfo':
                admincmds.getUser({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata  });
                break;
        }
        return;
    }
}


