import * as Discord from 'discord.js';
import { Command } from './commands/command.js';
import * as helper from './helper.js';
import * as bottypes from './types/bot.js';

let command: Command = null;
let overrides: bottypes.overrides = {};
const disableSlashCommands = false;
export function onMessage(message: Discord.Message) {
    command = null;
    overrides = null;
    if (validateMessage(message)) {
        const args = message.content.slice(helper.vars.config.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        runCommand(cmd, message, null, args, true, 'message');
    }
}

// validate prefix, cooldowns, etc.
function validateMessage(message: Discord.Message) {
    if (!(message.content.startsWith(helper.vars.config.prefix))) return false;
    return true;
}
export async function onInteraction(interaction: Discord.Interaction) {
    command = null;
    overrides = null;
    if (!(interaction.type === Discord.InteractionType.ApplicationCommand)) { return; }
    interaction = interaction as Discord.ChatInputCommandInteraction;
    if (disableSlashCommands) {
        interaction.reply({
            content: 'Interaction based commands are currently unsupported in this version',
            allowedMentions: { repliedUser: false },
            flags: Discord.MessageFlags.Ephemeral,
        });
        return;
    }
    let args = [];
    const cmd = interaction.commandName;
    runCommand(cmd, null, interaction, args, true, 'interaction');
}

const rslist = [
    'recent', 'recentscore', 'rs', 'r',
    'recenttaiko', 'rt',
    'recentfruits', 'rf', 'rctb',
    'recentmania', 'rm',
    'rslist', 'recentlist', 'rl',
    'recentlisttaiko', 'rlt',
    'recentlistfruits', 'rlf', 'rlctb', 'rlc',
    'recentlistmania', 'rlm',
    'rb', 'recentbest', 'rsbest',
];
const scorelist = [
    'firsts', 'firstplaceranks', 'fpr', 'fp', '#1s', 'first', '#1', '1s',
    'leaderboard', 'maplb', 'mapleaderboard', 'ml',
    'nochokes', 'nc',
    'osutop', 'top', 't', 'ot', 'topo', 'toposu',
    'taikotop', 'toptaiko', 'tt', 'topt',
    'ctbtop', 'fruitstop', 'catchtop', 'topctb', 'topfruits', 'topcatch', 'tf', 'tctb', 'topf', 'topc',
    'maniatop', 'topmania', 'tm', 'topm',
    'scores', 'c',
    'pinned', 'pins'
].concat(rslist).sort((a, b) => b.length - a.length);

const infoArgs = ['uptime', 'server', 'website', 'timezone', 'version', 'v', 'dependencies', 'deps', 'source'];

// permissions
function commandCheck(cmd: string, message: Discord.Message, interaction: Discord.ChatInputCommandInteraction, canReply: boolean) {
    //perms bot needs
    const requireEmbedCommands: string[] = [
        //gen
        'changelog', 'clog',
        'convert', 'conv',
        'country',
        'help', 'commands', 'list', 'command', 'h',
        'info', 'i',
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
        'inspire', 'insp',
        'poll', 'vote',
        //osu
        'bws', 'badgeweightsystem', 'badgeweight', 'badgeweightseed', 'badgerank',
        'compare', 'common',
        'lb',
        'map', 'm',
        'maprandom', 'f2', 'maprand', 'mapsuggest', 'randommap', 'randmap',
        'osu', 'profile', 'o', 'user', 'taiko', 'drums', 'fruits', 'ctb', 'catch', 'mania',
        'osuseet', 'setuser', 'set', 'setmode', 'setskin',
        'nochokes', 'nc',
        'ppcalc', 'mapcalc', 'mapperf', 'maperf', 'mappp',
        'pp', 'rank',
        'ranking', 'rankings',
        'recentactivity', 'recentact', 'rsact',
        'saved',
        'scoreparse', 'score', 'sp',
        'scorestats', 'ss',
        'simplay', 'simulate', 'sim',
        'skin',
        'trackadd', 'track', 'ta', 'trackremove', 'trackrm', 'tr', 'untrack', 'trackchannel', 'tc', 'tracklist', 'tl',
        'userbeatmaps', 'ub', 'userb', 'ubm', 'um', 'usermaps',
        'whatif', 'wi',
        //admin
        'avatar', 'av', 'pfp',
        'checkperms', 'fetchperms', 'checkpermissions', 'permissions', 'perms',
        'clear',
        'find', 'get',
        'prefix', 'servers', 'userinfo'
    ].concat(scorelist);
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
        'crash', 'clear', 'debug', 'servers'
    ];

    const disabled: string[] = [
    ];

    const missingPermsBot: Discord.PermissionsString[] = [];
    const missingPermsUser: string[] = [];
    if (requireEmbedCommands.includes(cmd) && !helper.tools.checks.botHasPerms(message ?? interaction, ['EmbedLinks'])) {
        missingPermsBot.push('EmbedLinks');
    }
    if (requireReactions.includes(cmd) && !helper.tools.checks.botHasPerms(message ?? interaction, ['AddReactions'])) {
        missingPermsBot.push('AddReactions');
    }
    if (requireMsgManage.includes(cmd) && !helper.tools.checks.botHasPerms(message ?? interaction, ['ManageMessages'])) {
        missingPermsBot.push('ManageMessages');
    }
    if (botRequireAdmin.includes(cmd) && !helper.tools.checks.botHasPerms(message ?? interaction, ['Administrator'])) {
        missingPermsBot.push('Administrator');
    }
    if (userRequireAdminOrOwner.includes(cmd) && !(helper.tools.checks.isAdmin(message?.author?.id ?? interaction.member.user.id, message?.guildId ?? interaction?.guildId) || helper.tools.checks.isOwner(message?.author?.id ?? interaction.member.user.id))) {
        missingPermsUser.push('Administrator');
    }
    if (userRequireOwner.includes(cmd) && !helper.tools.checks.isOwner(message?.author?.id ?? interaction.member.user.id)) {
        missingPermsUser.push('Owner');
    }

    if (missingPermsBot.length > 0 && !(message ?? interaction).channel.isDMBased) {
        helper.tools.commands.sendMessage({
            type: "message",
            message,
            interaction,
            args: {
                content: 'The bot is missing permissions.\nMissing permissions: ' + missingPermsBot.join(', ')
            },

        },
            canReply);
        return false;
    }
    if (missingPermsUser.length > 0) {
        helper.tools.commands.sendMessage({
            type: "message",
            message,
            interaction,
            args: {
                content: 'You do not have permission to use this command.\nMissing permissions: ' + missingPermsUser.join(', ')
            },
        },
            canReply);
        return false;
    }

    if (disabled.includes(cmd)) {
        helper.tools.commands.sendMessage({
            type: "message",
            message,
            interaction,
            args: {
                content: 'That command is currently disabled and cannot be used.'
            },
        },
            canReply);
        return false;
    }
    if (['hug', 'kiss', 'lick', 'pet', 'punch', 'slap',].includes(cmd) && helper.vars.config.tenorKey == 'INVALID_ID') {
        helper.tools.commands.sendMessage({
            type: "message",
            message,
            interaction,
            args: {
                content: 'gif commands cannot be currently used (error: unset tenor key)'
            },
        },
            canReply);
        return false;
    }
    return true;
}

function commandSelect(cmd: string, args: string[]) {
    let tnum: string;
    if (scorelist.some(x => cmd.startsWith(x)) && !scorelist.some(x => cmd == x)) {
        let cont: boolean = true;
        scorelist.some(x => {
            if (cmd.startsWith(x) && cont) {
                tnum = cmd.replace(x, '');
                if (!isNaN(+tnum)) {
                    cmd = x;
                    cont = false;
                }
            }
            return null;
        });
    }
    if (!isNaN(+tnum)) {
        if (rslist.includes(cmd)) args.push('-p', tnum);
        else args.push('-parse', tnum);
    }
    if (infoArgs.some(x => x.toLowerCase() == cmd.toLowerCase())) {
        args = [cmd];
        cmd = 'info';
    }

    switch (cmd) {
        // gen
        case 'changelog': case 'clog': case 'changes':
            command = new helper.commands.gen.Changelog();
            break;
        case 'versions':
            args.unshift('versions');
            command = new helper.commands.gen.Changelog();
            break;
        case 'list':
            args.unshift('list');
        case 'help': case 'commands': case 'command': case 'h':
            command = new helper.commands.gen.Help();
            break;
        case 'info': case 'i':
            command = new helper.commands.gen.Info();
            break;
        case 'invite':
            command = new helper.commands.gen.Invite();
            break;
        case 'ping':
            command = new helper.commands.gen.Ping();
            break;
        case 'remind': case 'reminder':
            command = new helper.commands.gen.Remind();
            break;
        case 'stats':
            command = new helper.commands.gen.Stats();
            break;

        // osu (profiles)
        case 'badges':
            command = new helper.commands.osu.profiles.Badges();
            break;
        case 'bws': case 'badgeweightsystem': case 'badgeweight': case 'badgeweightseed': case 'badgerank':
            command = new helper.commands.osu.profiles.BadgeWeightSeed();
            break;
        case 'lb':
            command = new helper.commands.osu.profiles.Leaderboard();
            break;
        case 'osu': case 'profile': case 'o': case 'user':
            command = new helper.commands.osu.profiles.Profile();
            break;
        case 'taiko': case 'drums': {
            overrides = {
                mode: 'taiko'
            };
            command = new helper.commands.osu.profiles.Profile();
        }
            break;
        case 'fruits': case 'ctb': case 'catch': {
            overrides = {
                mode: 'fruits'
            };
            command = new helper.commands.osu.profiles.Profile();
        }
            break;
        case 'mania': {
            overrides = {
                mode: 'mania'
            };
            command = new helper.commands.osu.profiles.Profile();
        }
            break;
        case 'ranking': case 'rankings':
            command = new helper.commands.osu.profiles.Ranking();
            break;
        case 'recentactivity': case 'recentact': case 'rsact':
            command = new helper.commands.osu.profiles.RecentActivity();
            break;

        // osu (maps)
        case 'ppcalc': case 'mapcalc': case 'mapperf': case 'maperf': case 'mappp': {
            overrides = {
                type: 'ppcalc'
            };
        }
        case 'map': case 'm':
            command = new helper.commands.osu.maps.Map();
            break;
        case 'maprandom': case 'f2': case 'maprand': case 'randommap': case 'randmap':
            command = new helper.commands.osu.maps.RandomMap();
            break;
        case 'recommendmap': case 'recmap': case 'maprec': case 'mapsuggest': case 'suggestmap': case 'maprecommend':
            command = new helper.commands.osu.maps.RecommendMap();
            break;
        case 'userbeatmaps': case 'ub': case 'userb': case 'ubm': case 'um': case 'usermaps':
            command = new helper.commands.osu.maps.UserBeatmaps();
            break;
        case 'ranked': {
            overrides = {
                ex: 'ranked'
            };
            command = new helper.commands.osu.maps.UserBeatmaps();
        }
            break;
        case 'favourite': case 'favourites': {
            overrides = {
                ex: 'favourite'
            };
            command = new helper.commands.osu.maps.UserBeatmaps();
        }
            break;
        case 'graveyard': case 'unranked': {
            overrides = {
                ex: 'graveyard'
            };
            command = new helper.commands.osu.maps.UserBeatmaps();
        }
            break;
        case 'loved': {
            overrides = {
                ex: 'loved'
            };
            command = new helper.commands.osu.maps.UserBeatmaps();
        }
            break;
        case 'most_played': case 'mostplayed': case 'mp': {
            overrides = {
                ex: 'most_played'
            };
            command = new helper.commands.osu.maps.UserBeatmaps();
        }
            break;
        case 'pending': case 'wip': {
            overrides = {
                ex: 'pending'
            };
            command = new helper.commands.osu.maps.UserBeatmaps();
        }
            break;
        case 'nominated': case 'bn': {
            overrides = {
                ex: 'nominated'
            };
            command = new helper.commands.osu.maps.UserBeatmaps();
        }
            break;
        case 'guest': case 'gd': {
            overrides = {
                ex: 'guest'
            };
            command = new helper.commands.osu.maps.UserBeatmaps();
        }
            break;
        // // osu (scores)
        case 'firsts': case 'firstplaceranks': case 'fpr': case 'fp': case '#1s': case 'first': case '#1': case '1s':
            command = new helper.commands.osu.scores.Firsts();
            break;
        case 'leaderboard': case 'maplb': case 'mapleaderboard': case 'ml':
            command = new helper.commands.osu.scores.MapLeaderboard();
            break;
        case 'nochokes': case 'nc': {
            overrides = {
                miss: true
            };
            command = new helper.commands.osu.scores.NoChokes();
        }
            break;
        case 'osutop': case 'top': case 't': case 'ot': case 'toposu': case 'topo':
            command = new helper.commands.osu.scores.OsuTop();
            break;
        case 'taikotop': case 'toptaiko': case 'tt': case 'topt':
            {
                overrides = {
                    mode: 'taiko'
                };
                command = new helper.commands.osu.scores.OsuTop();
            }
            break;
        case 'ctbtop': case 'fruitstop': case 'catchtop': case 'topctb': case 'topfruits': case 'topcatch': case 'tctb': case 'tf': case 'topf': case 'topc':
            {
                overrides = {
                    mode: 'fruits'
                };
                command = new helper.commands.osu.scores.OsuTop();
            }
            break;
        case 'maniatop': case 'topmania': case 'tm': case 'topm':
            {
                overrides = {
                    mode: 'mania'
                };
                command = new helper.commands.osu.scores.OsuTop();
            }
            break;
        case 'pinned': case 'pins':
            command = new helper.commands.osu.scores.Pinned();
            break;
        case 'recent': case 'rs': case 'recentscore': case 'r':
            command = new helper.commands.osu.scores.Recent();
            break;
        case 'recenttaiko': case 'rt': {
            overrides = {
                mode: 'taiko'
            };
            command = new helper.commands.osu.scores.Recent();
        }
            break;
        case 'recentfruits': case 'rf': case 'rctb': {
            overrides = {
                mode: 'fruits'
            };
            command = new helper.commands.osu.scores.Recent();
        }
            break;
        case 'recentmania': case 'rm': {
            overrides = {
                mode: 'mania'
            };
            command = new helper.commands.osu.scores.Recent();
        }
            break;
        case 'recentbest': case 'rsbest': case 'rb': {
            overrides = {

                sort: 'pp'
            };
            command = new helper.commands.osu.scores.RecentList();
        }
            break;
        case 'recentlist': case 'rl': case 'rslist': {
            overrides = {

                sort: 'recent'
            };
            command = new helper.commands.osu.scores.RecentList();
        }
            break;
        case 'recentlisttaiko': case 'rlt': {
            overrides = {

                mode: 'taiko',
                sort: 'recent'
            };
            command = new helper.commands.osu.scores.RecentList();
        }
            break;
        case 'recentlistfruits': case 'rlf': case 'rlctb': case 'rlc': {
            overrides = {

                mode: 'fruits',
                sort: 'recent'
            };
            command = new helper.commands.osu.scores.RecentList();
        }
            break;
        case 'recentlistmania': case 'rlm': {
            overrides = {

                mode: 'mania',
                sort: 'recent'
            };
            command = new helper.commands.osu.scores.RecentList();
        }
            break;
        case 'scoreparse': case 'score': case 'sp':
            command = new helper.commands.osu.scores.ScoreParse();
            break;
        case 'scores': case 'c': case 'mapscores':
            command = new helper.commands.osu.scores.MapScores();
            break;
        case 'scorestats': case 'ss':
            command = new helper.commands.osu.scores.ScoreStats();
            break;
        case 'simplay': case 'simulate': case 'sim':
            command = new helper.commands.osu.scores.Simulate();
            break;

        // // osu (track)
        case 'trackadd': case 'track': case 'ta':
            command = new helper.commands.osu.track.TrackAdd();
            break;
        case 'trackremove': case 'trackrm': case 'tr': case 'untrack':
            command = new helper.commands.osu.track.TrackRemove();
            break;
        case 'trackchannel': case 'tc':
            command = new helper.commands.osu.track.TrackChannel();
            break;
        case 'tracklist': case 'tl':
            command = new helper.commands.osu.track.TrackList();
            break;

        // // osu (other)
        case 'common': {
            overrides = {
                type: 'top'
            };
        }
        case 'compare':
            command = new helper.commands.osu.other.Compare();
            break;
        case 'osuset': case 'setuser': case 'set':
            command = new helper.commands.osu.other.Set();
            break;
        case 'setmode': {
            overrides = {
                type: 'mode'
            };
            command = new helper.commands.osu.other.Set();
        }
            break;
        case 'setskin': {
            overrides = {
                type: 'skin'
            };
            command = new helper.commands.osu.other.Set();
        }
            break;
        case 'pp': {
            overrides = {
                type: 'pp',
            };
            command = new helper.commands.osu.other.RankPP();
        }
            break;
        case 'rank': {
            overrides = {
                type: 'rank',
            };
            command = new helper.commands.osu.other.RankPP();
        }
            break;
        case 'saved':
            command = new helper.commands.osu.other.Saved();
            break;
        case 'whatif': case 'wi':
            command = new helper.commands.osu.other.WhatIf();
            break;

        // // admin
        case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
            command = new helper.commands.admin.CheckPerms();
            break;
        case 'crash':
            command = new helper.commands.admin.Crash();
            break;
        case 'clear':
            command = new helper.commands.admin.Clear();
            break;
        case 'debug':
            command = new helper.commands.admin.Debug();
            break;
        case 'find': case 'get':
            command = new helper.commands.admin.Find();
            break;
        case 'leaveguild': case 'leave':
            command = new helper.commands.admin.LeaveGuild();
            break;
        case 'prefix':
            command = new helper.commands.admin.Prefix();
            break;
        case 'servers':
            command = new helper.commands.admin.Servers();
            break;


        // // misc
        case '8ball': case 'ask':
            command = new helper.commands.fun._8Ball();
            break;
        case 'coin': case 'coinflip': case 'flip':
            command = new helper.commands.fun.CoinFlip();
            break;
        case 'hug':
            overrides = {
                ex: 'hug'
            };
            command = new helper.commands.fun.Gif();
            break;
        case 'kiss':
            overrides = {
                ex: 'kiss'
            };
            command = new helper.commands.fun.Gif();
            break;
        case 'lick':
            overrides = {
                ex: 'lick'
            };
            command = new helper.commands.fun.Gif();
            break;
        case 'pet':
            overrides = {
                ex: 'pet'
            };
            command = new helper.commands.fun.Gif();
            break;
        case 'punch':
            overrides = {
                ex: 'punch'
            };
            command = new helper.commands.fun.Gif();
            break;
        case 'slap':
            overrides = {
                ex: 'slap'
            };
            command = new helper.commands.fun.Gif();
            break;
        case 'janken': case 'paperscissorsrock': case 'rockpaperscissors': case 'rps': case 'psr':
            command = new helper.commands.fun.Janken();
            break;
        case 'roll': case 'rng': case 'randomnumber': case 'randomnumbergenerator': case 'pickanumber': case 'pickanum':
            command = new helper.commands.fun.Roll();
            break;
        default:
            command = null;
            break;
    }
    return args;
}

function runCommand(cmd: string, message: Discord.Message, interaction: Discord.ChatInputCommandInteraction, args: string[], canReply: boolean, type: "message" | "interaction") {
    const isValid = commandCheck(cmd, message, interaction, canReply);
    if (isValid) {
        const helpOverrides: string[] = ['-h', '-help', '--h', '--help'];
        if (helpOverrides.some(x => args?.includes(x))) {
            args = [cmd];
            cmd = 'help';
        }
        args = commandSelect(cmd, args);
        if (command) {
            startType(message ?? interaction);
            command.setInput({
                message,
                interaction,
                args,
                date: new Date(),
                id: helper.tools.commands.getCmdId(),
                overrides,
                canReply,
                type,
            });
            command.execute();
        }
    }
}

function startType(object: Discord.Message | Discord.Interaction) {
    try {
        (object.channel as Discord.GuildTextBasedChannel).sendTyping();
        setTimeout(() => {
            return;
        }, 1000);
    } catch (error) {
    }
}