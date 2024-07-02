import * as Discord from 'discord.js';
import fs from 'fs';
import { path } from './path.js';
import * as checks from './src/checks.js';
import * as cd from './src/consts/cooldown.js';
import * as func from './src/func.js';

import * as admincmds from './commands/cmdAdmin.js';
import * as checkcmds from './commands/cmdChecks.js';
import * as commands from './commands/cmdGeneral.js';
import * as misccmds from './commands/cmdMisc.js';
import * as osucmds from './commands/cmdosu.js';
import * as log from './src/log.js';
import * as extypes from './src/types/extratypes.js';

let timeouttime;
const reminders: extypes.reminder[] = [];

export async function onMessage(
    input: extypes.input,
    message: Discord.Message<boolean>
) {
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
        //@ts-expect-error message<boolean> is not assignable to message<boolean> (why)
        && checks.botHasPerms(message as Discord.Message<boolean>, input.client, ['ManageMessages'])) {
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
    if (!input.oncooldown.has(message.author.id) && cd.cooldownCommands.includes(command)) {
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
    execCommand(input, command, 'message', message, {}, button, absoluteID, currentDate, message.author.id, args, input.config);
};

export async function onInteraction(
    input: {
        userdata,
        client: Discord.Client,
        config: extypes.config,
        oncooldown,
        guildSettings,
        trackDb,
        statsCache;
    },
    interaction: Discord.Interaction<Discord.CacheType>
) {
    if (!(interaction.type === Discord.InteractionType.ApplicationCommand)) { return; }
    interaction = interaction as Discord.ChatInputCommandInteraction;
    const currentDate = new Date();
    const absoluteID = func.generateId();
    const args = [];
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
    execCommand(input, interaction.commandName, 'interaction', interaction, {}, button, absoluteID, currentDate, interaction.member.user.id, args, input.config);
}

function execCommand(input: extypes.input, command: string, commandType: extypes.commandType, obj: Discord.Message | Discord.ChatInputCommandInteraction, overrides: extypes.overrides, button: null, absoluteID: number, currentDate: Date, userid: string | number, args: string[], config: extypes.config) {
    let canReply = true;
    //@ts-expect-error message<boolean> is not assignable to message<boolean> (why)
    if (!checks.botHasPerms(obj, input.client, ['ReadMessageHistory'])) {
        canReply = false;
    }
    //@ts-expect-error message<boolean> is not assignable to message<boolean> (why)
    if (!checks.botHasPerms(obj, input.client, ['SendMessages', /* 'ViewChannel' */]) && commandType == 'message') return;
    //if is thread check if bot has perms
    //@ts-expect-error message<boolean> is not assignable to message<boolean> (why)
    if (!checks.botHasPerms(obj, input.client, ['SendMessagesInThreads']) &&
        (obj.channel.type == Discord.ChannelType.PublicThread ||
            obj.channel.type == Discord.ChannelType.PrivateThread)) return;

    /**
     * help mode?
     * ie
     * sbr-conv -help -> sbr-help conv
     */
    const helpOverrides: string[] = ['-h', '-help', '--h', '--help'];
    if (helpOverrides.some(x => args?.includes(x))) {
        args = [command];
        command = 'help';
    }

    if (['list', 'commands'].some(x => command == x)) {
        overrides['ex'] = 'list';
    }

    const statCommands: string[] = ['uptime', 'version', 'server', 'website', 'timezone',];
    if (statCommands.some(x => command == x)) {
        args = [command];
        command = 'info';
    }

    const allowed = execCommand_checker(input, command, commandType, obj, overrides, button, absoluteID, currentDate, userid, args, canReply, config);
    if (allowed == true) {
        execCommand_switch(input, command, commandType, obj, overrides, button, absoluteID, currentDate, userid, args, canReply);
    }
    fs.appendFileSync(`${path}/logs/totalcommands.txt`, 'x');
    return;
}

function execCommand_checker(input:extypes.input, command: string, commandType: extypes.commandType, obj: Discord.Message | Discord.ChatInputCommandInteraction, overrides: extypes.overrides, button: null, absoluteID: number, currentDate: Date, userid: string | number, args: string[],
    canReply: boolean, config: extypes.config
) {

    //perms bot needs
    const requireEmbedCommands: string[] = [
        //gen
        'changelog', 'clog',
        'convert', 'conv',
        'country',
        'help', 'commands', 'list', 'command', 'h',
        'info',
        'invite',
        'ping',
        'remind', 'reminders', 'reminder',
        'stats',
        'time', 'tz',
        'weather', 'temperature', 'temp',
        'tropicalweather', 'ts',
        //misc
        'coin', 'coinflip', 'flip',
        'hug', 'kiss', 'lick', 'pet', 'punch', 'slap',
        'image', 'imagesearch',
        'inspire', 'insp',
        'poll', 'vote',
        'ytsearch', 'yt', 'yts',
        //osu
        'bws', 'badgeweightsystem', 'badgeweight', 'badgeweightseed', 'badgerank',
        'compare', 'common',
        'firsts', 'firstplaceranks', 'fpr', 'fp', '#1s', 'first', '#1', '1s',
        'globals', 'osc', 'osustatscount',
        'leaderboard', 'maplb', 'mapleaderboard', 'ml',
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
        'find', 'get',
        'prefix', 'servers', 'userinfo'
    ];
    const requireReactions: string[] = [
        'poll', 'vote'
    ];
    const requireMsgManage: string[] = [
        'purge'
    ];

    const botRequireAdmin: string[] = [
        'checkperms', 'fetchperms', 'checkpermissions', 'permissions', 'perms',
        'get',
        'userinfo',
    ];

    //perms user needs
    const userRequireAdminOrOwner: string[] = [
        'checkperms', 'fetchperms', 'checkpermissions', 'permissions', 'perms',
        'userinfo',
        'purge',
    ];

    const userRequireOwner: string[] = [
        'crash', 'debug', 'servers'
    ];

    const disabled = [
        'globals', 'osc', 'osustatscount',
        'render', 'rdr'
    ];

    let allowed = true;
    const missingPermsBot: Discord.PermissionsString[] = [];
    const missingPermsUser: string[] = [];
    //@ts-expect-error Argument of type 'Message<boolean> | ChatInputCommandInteraction<CacheType>' is not assignable to parameter of type 'Interaction<CacheType> | Message<boolean>'.ts(2345)
    if (requireEmbedCommands.includes(command) && commandType == 'message' && !checks.botHasPerms(obj, input.client, ['EmbedLinks'])) {
        missingPermsBot.push('EmbedLinks');
    }
    //@ts-expect-error message<boolean> is not assignable to message<boolean> (why)
    if (requireReactions.includes(command) && !checks.botHasPerms(obj, input.client, ['AddReactions'])) {
        missingPermsBot.push('AddReactions');
    }
    //@ts-expect-error message<boolean> is not assignable to message<boolean> (why)
    if (requireMsgManage.includes(command) && !checks.botHasPerms(obj, input.client, ['ManageMessages'])) {
        missingPermsBot.push('ManageMessages');
    }
    //@ts-expect-error message<boolean> is not assignable to message<boolean> (why)
    if (botRequireAdmin.includes(command) && !checks.botHasPerms(obj, input.client, ['Administrator'])) {
        missingPermsBot.push('Administrator');
    }
    //@ts-expect-error client<boolean> is not assignable to client<boolean> (why)
    if (userRequireAdminOrOwner.includes(command) && !(checks.isAdmin(userid, obj.guildId, input.client) || checks.isOwner(userid, config))) {
        missingPermsUser.push('Administrator');
    }
    if (userRequireOwner.includes(command) && !(checks.isOwner(userid, config), config)) {
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

    if (disabled.includes(command)) {
        checkcmds.disabled(commandType, obj, 'command');
        allowed = false;
    }

    return allowed;
}

function execCommand_switch(input: extypes.input, command: string, commandType: extypes.commandType, obj: Discord.Message | Discord.ChatInputCommandInteraction, overrides: extypes.overrides, button: null, absoluteID: number, currentDate: Date, userid: string | number, args: string[],
    canReply: boolean,
) {
    switch (command) {
        case 'changelog': case 'clog': case 'changes':
            commands.changelog({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'versions':
            args = ['versions'];
            commands.changelog({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'convert': case 'conv':
            commands.convert({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'country':
            commands.country({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides });
            break;
        case 'help': case 'commands': case 'list': case 'command': case 'h':
            commands.help({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'info':
            commands.info({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, guildSettings: input.guildSettings });
            break;
        case 'invite':
            commands.invite({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'math':
            commands.math({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'ping':
            commands.ping({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'remind': case 'reminder':
            commands.remind({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, reminders });
            break;
        case 'reminders': {
            commands.remind({ commandType, obj, args: [], canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, reminders });
        } break;
        case 'stats':
            commands.stats({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        // case 'settime':
        //     commands.timeset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        //     break;
        // case 'setlocation': case 'setweather':
        //     startType(obj);
        //     commands.locationset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        //     break;
        case 'time': case 'tz':
            commands.time({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'weather': case 'temperature': case 'temp':
            startType(obj);
            commands.weather({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'tropicalweather': case 'ts':
            startType(obj);
            commands.tropicalWeather({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;

        //misc
        case '8ball': case 'ask':
            misccmds._8ball({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'coin': case 'coinflip': case 'flip':
            misccmds.coin({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'hug':
            overrides = {
                ex: 'hug'
            };
            misccmds.gif({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'kiss':
            overrides = {
                ex: 'kiss'
            };
            misccmds.gif({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'lick':
            overrides = {
                ex: 'lick'
            };
            misccmds.gif({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'pet':
            overrides = {
                ex: 'pet'
            };
            misccmds.gif({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'punch':
            overrides = {
                ex: 'punch'
            };
            misccmds.gif({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'slap':
            overrides = {
                ex: 'slap'
            };
            misccmds.gif({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;

        case 'image': case 'imagesearch':
            startType(obj);
            misccmds.image({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'inspire': case 'insp':
            misccmds.inspire({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'janken': case 'paperscissorsrock': case 'rockpaperscissors': case 'rps': case 'psr':
            misccmds.janken({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'poll': case 'vote':
            misccmds.poll({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'roll': case 'rng': case 'randomnumber': case 'randomnumbergenerator': case 'pickanumber': case 'pickanum':
            misccmds.roll({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'sex':
            misccmds.sex({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'ytsearch': case 'yt': case 'yts':
            startType(obj);
            misccmds.ytsearch({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;

        //osu commands below

        case 'badges':
            startType(obj);
            osucmds.badges({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;

        case 'bws': case 'badgeweightsystem': case 'badgeweight': case 'badgeweightseed': case 'badgerank':
            startType(obj);
            osucmds.bws({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'compare':
            startType(obj);
            osucmds.compare({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'common': {
            overrides = {
                type: 'top'
            };
            startType(obj);
            osucmds.compare({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        }
            break;
        case 'firsts': case 'firstplaceranks': case 'fpr': case 'fp': case '#1s': case 'first': case '#1': case '1s':
            startType(obj);
            osucmds.firsts({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'globals': case 'osc': case 'osustatscount':
            // startType(obj);
            osucmds.globals({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'leaderboard': case 'maplb': case 'mapleaderboard': case 'ml':
            startType(obj);
            osucmds.maplb({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'lb':
            // startType(obj);
            osucmds.lb({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'map': case 'm':
            startType(obj);
            osucmds.map({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'ppcalc': case 'mapcalc': case 'mapperf': case 'maperf': case 'mappp': {
            startType(obj);
            overrides = {
                type: 'ppcalc'
            };
            osucmds.map({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        }
            break;
        case 'maprandom': case 'f2': case 'maprand': case 'randommap': case 'randmap':
            startType(obj);
            osucmds.randomMap({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'recommendmap': case 'recmap': case 'maprec': case 'mapsuggest': case 'suggestmap': case 'maprecommend':
            startType(obj);
            osucmds.recMap({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'osu': case 'profile': case 'o': case 'user':
            startType(obj);
            osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'taiko': case 'drums': {
            overrides = {
                mode: 'taiko'
            };
            startType(obj);
            osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'fruits': case 'ctb': case 'catch': {
            overrides = {
                mode: 'fruits'
            };
            startType(obj);
            osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'mania': {
            overrides = {
                mode: 'mania'
            };
            startType(obj);
            osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'osuset': case 'setuser': case 'set':
            // startType(obj);
            osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'setmode': {
            overrides = {
                type: 'mode'
            };
            // startType(obj);
            osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        }
            break;
        case 'setskin': {
            overrides = {
                type: 'skin'
            };
            // startType(obj);
            osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        }
            break;
        case 'settime': case 'settz': {
            overrides = {
                type: 'tz'
            };
            // startType(obj);
            osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        }
            break;
        case 'setlocation': case 'setweather': {
            overrides = {
                type: 'location'
            };
            // startType(obj);
            osucmds.osuset({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        }
            break;
        case 'nochokes': case 'nc': {
            overrides = {
                miss: true
            };
            startType(obj);
            osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'osutop': case 'top': case 't': case 'ot': case 'toposu': case 'topo':
            startType(obj);
            osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'taikotop': case 'toptaiko': case 'tt': case 'topt':
            {
                overrides = {
                    mode: 'taiko'
                };
                startType(obj);
                osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            }
            break;
        case 'ctbtop': case 'fruitstop': case 'catchtop': case 'topctb': case 'topfruits': case 'topcatch': case 'tctb': case 'tf': case 'topf': case 'topc':
            {
                overrides = {
                    mode: 'fruits'
                };
                startType(obj);
                osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            }
            break;
        case 'maniatop': case 'topmania': case 'tm': case 'topm':
            {
                overrides = {
                    mode: 'mania'
                };
                startType(obj);
                osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            }
            break;
        case 'sotarks': case 'sotarksosu':
            {
                overrides = {
                    filterMapper: 'Sotarks'
                };
                startType(obj);
                osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            }
            break;
        case 'sotarkstaiko': case 'taikosotarks': case 'sotarkst': case 'tsotarks':
            {
                overrides = {
                    filterMapper: 'Sotarks',
                    mode: 'taiko'
                };
                startType(obj);
                osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            }
            break;
        case 'sotarksfruits': case 'fruitssotarks': case 'fruitsotarks': case 'sotarksfruit': case 'sotarkscatch': case 'catchsotarks':
        case 'sotarksctb': case 'ctbsotarks': case 'fsotarks': case 'sotarksf': case 'csotarks': case 'sotarksc':
            {
                overrides = {
                    filterMapper: 'Sotarks',
                    mode: 'fruits'
                };
                startType(obj);
                osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            }
            break;
        case 'sotarksmania': case 'maniasottarks': case 'sotarksm': case 'msotarks': {
            overrides = {
                filterMapper: 'Sotarks',
                mode: 'mania'
            };
            startType(obj);
            osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;

        case 'pinned': {
            startType(obj);
            osucmds.pinned({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'pp': {
            overrides = {
                type: 'pp',
                commandAs: commandType
            };
            // startType(obj);
            osucmds.rankpp({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'rank': {
            overrides = {
                type: 'rank',
                commandAs: commandType
            };
            // startType(obj);
            osucmds.rankpp({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'ranking': case 'rankings':
            startType(obj);
            osucmds.ranking({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'rs': case 'recent': case 'r':
            startType(obj);
            osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'rs best': case 'recent best':
        case 'rsbest': case 'recentbest': case 'rb': {
            overrides = {
                type: 'list',
                sort: 'pp'
            };
            startType(obj);
            osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'recentlist': case 'rl': {
            overrides = {
                type: 'list',
                sort: 'recent'
            };
            startType(obj);
            osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'recentlisttaiko': case 'rlt': {
            overrides = {
                type: 'list',
                mode: 'taiko',
                sort: 'recent'
            };
            startType(obj);
            osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'recentlistfruits': case 'rlf': case 'rlctb': case 'rlc': {
            overrides = {
                type: 'list',
                mode: 'fruits',
                sort: 'recent'
            };
            startType(obj);
            osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'recentlistmania': case 'rlm': {
            overrides = {
                type: 'list',
                mode: 'mania',
                sort: 'recent'
            };
            startType(obj);
            osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'recenttaiko': case 'rt': {
            overrides = {
                mode: 'taiko'
            };
            startType(obj);
            osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'recentfruits': case 'rf': case 'rctb': {
            overrides = {
                mode: 'fruits'
            };
            startType(obj);
            osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'recentmania': case 'rm': {
            overrides = {
                mode: 'mania'
            };
            startType(obj);
            osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'recentactivity': case 'recentact': case 'rsact':
            startType(obj);
            osucmds.recent_activity({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'saved':
            // startType(obj);
            osucmds.saved({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;

        case 'scoreparse': case 'score': case 'sp':
            startType(obj);
            osucmds.scoreparse({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'scorepost':
            // startType(obj);
            osucmds.scorepost({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'scores': case 'c':
            startType(obj);
            osucmds.scores({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'scorestats': case 'ss':
            startType(obj);
            osucmds.scorestats({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'simplay': case 'simulate': case 'sim':
            startType(obj);
            osucmds.simulate({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'skin': {
            overrides = {
                type: 'skin',
                ex: 'skin',
                commandAs: commandType
            };
            // startType(obj);
            osucmds.saved({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        }
            break;
        case 'trackadd': case 'track': case 'ta':
            // startType(obj);
            osucmds.trackadd({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings });
            break;
        case 'trackremove': case 'trackrm': case 'tr': case 'untrack':
            // startType(obj);
            osucmds.trackremove({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings });
            break;
        case 'trackchannel': case 'tc':
            // startType(obj);
            osucmds.trackchannel({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings });
            break;
        case 'tracklist': case 'tl':
            // startType(obj);
            osucmds.tracklist({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings });
            break;
        case 'userbeatmaps': case 'ub': case 'userb': case 'ubm': case 'um': case 'usermaps':
            startType(obj);
            osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;
        case 'ranked': {
            overrides = {
                ex: 'ranked'
            };
            startType(obj);
            osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'favourite': case 'favourites': {
            overrides = {
                ex: 'favourite'
            };
            startType(obj);
            osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'graveyard': case 'unranked': {
            overrides = {
                ex: 'graveyard'
            };
            startType(obj);
            osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'loved': {
            overrides = {
                ex: 'loved'
            };
            startType(obj);
            osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'most_played': case 'mostplayed': case 'mp': {
            overrides = {
                ex: 'most_played'
            };
            startType(obj);
            osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'pending': case 'wip': {
            overrides = {
                ex: 'pending'
            };
            startType(obj);
            osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'nominated': case 'bn': {
            overrides = {
                ex: 'nominated'
            };
            startType(obj);
            osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'guest': case 'gd': {
            overrides = {
                ex: 'guest'
            };
            startType(obj);
            osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
        }
            break;
        case 'whatif': case 'wi':
            startType(obj);
            osucmds.whatif({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            break;

        //admincmds below
        case 'avatar': case 'av': case 'pfp':
            admincmds.getUserAv({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            // startType(obj);
            break;
        case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
            // startType(obj);
            admincmds.checkperms({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'crash':
            // startType(obj);
            admincmds.crash({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'debug':
            // startType(obj);
            admincmds.debug({
                commandType, obj, args, canReply, button,
                config: input.config, client: input.client,
                absoluteID, currentDate, overrides,
                userdata: input.userdata, trackDb: input.trackDb, guildSettings: input.guildSettings
            });
            break;
        case 'find': case 'get':
            admincmds.find({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        // case 'get':
        //     admincmds.get({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        //     break;
        case 'leaveguild': case 'leave':
            // startType(obj);
            admincmds.leaveguild({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
        case 'prefix':
            // startType(obj);
            admincmds.prefix({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, guildSettings: input.guildSettings });
            break;
        case 'purge':
            admincmds.purge({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, guildSettings: input.guildSettings });
            break;
        case 'servers':
            // startType(obj);
            admincmds.servers({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;
            /* case 'user': */ case 'userinfo':
            // startType(obj);
            admincmds.getUser({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            break;

        case 'render':
            // startType(obj);
            checkcmds.disabled(commandType, obj, "command");
            break;
    }
    return;
}

function startType(object: Discord.Message | Discord.Interaction) {
    try {
        object.channel.sendTyping();
        setTimeout(() => {
            return;
        }, 1000);
    } catch (error) {
        console.log('typing error');
        log.logFile('',
            log.errLog('typing', error)
        );
        setTimeout(() => {
            return;
        }, 1000);
    }
}