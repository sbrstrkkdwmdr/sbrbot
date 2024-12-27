import * as Discord from 'discord.js';
import * as helper from './helper.js';
import * as bottypes from './types/bot.js';

let command: bottypes.command = null;
let overrides: bottypes.overrides = {};
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
    interaction.reply({
        content: 'Interaction based commands are currently unsupported in this version',
        allowedMentions: { repliedUser: false },
        ephemeral: true
    });
    return;
    // let args = [];
    // const cmd = interaction.commandName;
    // runCommand(cmd, null, interaction, args, true, 'interaction');
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
    if (userRequireAdminOrOwner.includes(cmd) && !(helper.tools.checks.isAdmin(message?.author?.id ?? interaction.member.user.id, message?.guildId ?? interaction.guildId) || helper.tools.checks.isOwner(message?.author?.id ?? interaction.member.user.id))) {
        missingPermsUser.push('Administrator');
    }
    if (userRequireOwner.includes(cmd) && !helper.tools.checks.isOwner(message?.author?.id ?? interaction.member.user.id)) {
        missingPermsUser.push('Owner');
    }

    if (missingPermsBot.length > 0) {
        helper.tools.commands.sendMessage({
            type: "message",
            message,
            interaction,
            args: {
                content: 'You do not have permission to use this command.\nMissing permissions: ' + missingPermsBot.join(', ')
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
    switch (cmd) {
        // gen
        case 'changelog': case 'clog': case 'changes':
            command = helper.commands.gen.changelog;
            break;
        case 'versions':
            args.unshift('versions');
            command = helper.commands.gen.changelog;
            break;
        case 'convert': case 'conv':
            command = helper.commands.gen.convert;
            break;
        case 'country':
            command = helper.commands.gen.country;
            break;
        case 'list':
            args.unshift('list');
        case 'help': case 'commands': case 'command': case 'h':
            command = helper.commands.gen.help;
            break;
        case 'info': case 'i':
            command = helper.commands.gen.info;
            break;
        case 'invite':
            command = helper.commands.gen.invite;
            break;
        case 'math':
            command = helper.commands.gen.math;
            break;
        case 'ping':
            command = helper.commands.gen.ping;
            break;
        case 'remind': case 'reminder':
            command = helper.commands.gen.remind;
            break;
        case 'stats':
            command = helper.commands.gen.stats;
            break;
        case 'time': case 'tz':
            command = helper.commands.gen.time;
            break;
        case 'weather': case 'temperature': case 'temp':
            command = helper.commands.gen.weather;
            break;

        // osu (profiles)
        case 'badges':
            command = helper.commands.osu.profiles.badges;
            break;
        case 'bws': case 'badgeweightsystem': case 'badgeweight': case 'badgeweightseed': case 'badgerank':
            command = helper.commands.osu.profiles.bws;
            break;
        case 'lb':
            command = helper.commands.osu.profiles.lb;
            break;
        case 'osu': case 'profile': case 'o': case 'user':
            command = helper.commands.osu.profiles.osu;
            break;
        case 'taiko': case 'drums': {
            overrides = {
                mode: 'taiko'
            };
            command = helper.commands.osu.profiles.osu;
        }
            break;
        case 'fruits': case 'ctb': case 'catch': {
            overrides = {
                mode: 'fruits'
            };
            command = helper.commands.osu.profiles.osu;
        }
            break;
        case 'mania': {
            overrides = {
                mode: 'mania'
            };
            command = helper.commands.osu.profiles.osu;
        }
            break;
        case 'ranking': case 'rankings':
            command = helper.commands.osu.profiles.ranking;
            break;
        case 'recentactivity': case 'recentact': case 'rsact':
            command = helper.commands.osu.profiles.recent_activity;
            break;

        // osu (maps)
        case 'ppcalc': case 'mapcalc': case 'mapperf': case 'maperf': case 'mappp': {
            overrides = {
                type: 'ppcalc'
            };
        }
        case 'map': case 'm':
            command = helper.commands.osu.maps.map;
            break;
        case 'maprandom': case 'f2': case 'maprand': case 'randommap': case 'randmap':
            command = helper.commands.osu.maps.randomMap;
            break;
        case 'recommendmap': case 'recmap': case 'maprec': case 'mapsuggest': case 'suggestmap': case 'maprecommend':
            command = helper.commands.osu.maps.recMap;
            break;
        case 'userbeatmaps': case 'ub': case 'userb': case 'ubm': case 'um': case 'usermaps':
            command = helper.commands.osu.maps.userBeatmaps;
            break;
        case 'ranked': {
            overrides = {
                ex: 'ranked'
            };
            command = helper.commands.osu.maps.userBeatmaps;
        }
            break;
        case 'favourite': case 'favourites': {
            overrides = {
                ex: 'favourite'
            };
            command = helper.commands.osu.maps.userBeatmaps;
        }
            break;
        case 'graveyard': case 'unranked': {
            overrides = {
                ex: 'graveyard'
            };
            command = helper.commands.osu.maps.userBeatmaps;
        }
            break;
        case 'loved': {
            overrides = {
                ex: 'loved'
            };
            command = helper.commands.osu.maps.userBeatmaps;
        }
            break;
        case 'most_played': case 'mostplayed': case 'mp': {
            overrides = {
                ex: 'most_played'
            };
            command = helper.commands.osu.maps.userBeatmaps;
        }
            break;
        case 'pending': case 'wip': {
            overrides = {
                ex: 'pending'
            };
            command = helper.commands.osu.maps.userBeatmaps;
        }
            break;
        case 'nominated': case 'bn': {
            overrides = {
                ex: 'nominated'
            };
            command = helper.commands.osu.maps.userBeatmaps;
        }
            break;
        case 'guest': case 'gd': {
            overrides = {
                ex: 'guest'
            };
            command = helper.commands.osu.maps.userBeatmaps;
        }
            break;
        // osu (scores)
        case 'firsts': case 'firstplaceranks': case 'fpr': case 'fp': case '#1s': case 'first': case '#1': case '1s':
            command = helper.commands.osu.scores.firsts;
            break;
        case 'leaderboard': case 'maplb': case 'mapleaderboard': case 'ml':
            command = helper.commands.osu.scores.maplb;
            break;
        case 'nochokes': case 'nc': {
            overrides = {
                miss: true
            };
        }
        case 'osutop': case 'top': case 't': case 'ot': case 'toposu': case 'topo':
            command = helper.commands.osu.scores.osutop;
            break;
        case 'taikotop': case 'toptaiko': case 'tt': case 'topt':
            {
                overrides = {
                    mode: 'taiko'
                };
                command = helper.commands.osu.scores.osutop;
            }
            break;
        case 'ctbtop': case 'fruitstop': case 'catchtop': case 'topctb': case 'topfruits': case 'topcatch': case 'tctb': case 'tf': case 'topf': case 'topc':
            {
                overrides = {
                    mode: 'fruits'
                };
                command = helper.commands.osu.scores.osutop;
            }
            break;
        case 'maniatop': case 'topmania': case 'tm': case 'topm':
            {
                overrides = {
                    mode: 'mania'
                };
                command = helper.commands.osu.scores.osutop;
            }
            break;
        case 'pinned':
            command = helper.commands.osu.scores.pinned;
            break;
        case 'recent': case 'rs': case 'recentscore': case 'r':
            command = helper.commands.osu.scores.recent;
            break;
        case 'recenttaiko': case 'rt': {
            overrides = {
                mode: 'taiko'
            };
            command = helper.commands.osu.scores.recent;
        }
            break;
        case 'recentfruits': case 'rf': case 'rctb': {
            overrides = {
                mode: 'fruits'
            };
            command = helper.commands.osu.scores.recent;
        }
            break;
        case 'recentmania': case 'rm': {
            overrides = {
                mode: 'mania'
            };
            command = helper.commands.osu.scores.recent;
        }
            break;
        case 'recentbest': case 'rsbest': case 'rb': {
            overrides = {
                type: 'list',
                sort: 'pp'
            };
            command = helper.commands.osu.scores.recent;
        }
            break;
        case 'recentlist': case 'rl': case 'rslist': {
            overrides = {
                type: 'list',
                sort: 'recent'
            };
            command = helper.commands.osu.scores.recent;
        }
            break;
        case 'recentlisttaiko': case 'rlt': {
            overrides = {
                type: 'list',
                mode: 'taiko',
                sort: 'recent'
            };
            command = helper.commands.osu.scores.recent;
        }
            break;
        case 'recentlistfruits': case 'rlf': case 'rlctb': case 'rlc': {
            overrides = {
                type: 'list',
                mode: 'fruits',
                sort: 'recent'
            };
            command = helper.commands.osu.scores.recent;
        }
            break;
        case 'recentlistmania': case 'rlm': {
            overrides = {
                type: 'list',
                mode: 'mania',
                sort: 'recent'
            };
            command = helper.commands.osu.scores.recent;
        }
            break;
        case 'scoreparse': case 'score': case 'sp':
            command = helper.commands.osu.scores.scoreparse;
            break;
        case 'scores': case 'c':
            command = helper.commands.osu.scores.scores;
            break;
        case 'scorestats': case 'ss':
            command = helper.commands.osu.scores.scorestats;
            break;
        case 'simplay': case 'simulate': case 'sim':
            command = helper.commands.osu.scores.simulate;
            break;
        // osu (track)
        case 'trackadd': case 'track': case 'ta':
            command = helper.commands.osu.track.add;
            break;
        case 'trackremove': case 'trackrm': case 'tr': case 'untrack':
            command = helper.commands.osu.track.remove;
            break;
        case 'trackchannel': case 'tc':
            command = helper.commands.osu.track.channel;
            break;
        case 'tracklist': case 'tl':
            command = helper.commands.osu.track.list;
            break;

        // osu (other)
        case 'common': {
            overrides = {
                type: 'top'
            };
        }
        case 'compare':
            command = helper.commands.osu.other.compare;
            break;
        case 'osuset': case 'setuser': case 'set':
            command = helper.commands.osu.other.osuset;
            break;
        case 'setmode': {
            overrides = {
                type: 'mode'
            };
            command = helper.commands.osu.other.osuset;
        }
            break;
        case 'setskin': {
            overrides = {
                type: 'skin'
            };
            command = helper.commands.osu.other.osuset;
        }
            break;
        case 'settime': case 'settz': {
            overrides = {
                type: 'tz'
            };
            command = helper.commands.osu.other.osuset;
        }
            break;
        case 'setlocation': case 'setweather': {
            overrides = {
                type: 'location'
            };
            command = helper.commands.osu.other.osuset;
        }
            break;
        case 'pp': {
            overrides = {
                type: 'pp',
            };
            command = helper.commands.osu.other.rankpp;
        }
            break;
        case 'rank': {
            overrides = {
                type: 'rank',
            };
            command = helper.commands.osu.other.rankpp;
        }
            break;
        case 'saved':
            command = helper.commands.osu.other.saved;
            break;
        case 'whatif': case 'wi':
            command = helper.commands.osu.other.whatif;
            break;

        // admin
        case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
            command = helper.commands.admin.checkperms;
            break;
        case 'crash':
            command = helper.commands.admin.crash;
            break;
        case 'clear':
            command = helper.commands.admin.clear;
            break;
        case 'debug':
            command = helper.commands.admin.debug;
            break;
        case 'find': case 'get':
            command = helper.commands.admin.find;
            break;
            /* case 'user': */ case 'userinfo':
            command = helper.commands.admin.getUser;
            break;
        case 'avatar': case 'av': case 'pfp':
            command = helper.commands.admin.getUserAv;
            break;
        case 'leaveguild': case 'leave':
            command = helper.commands.admin.leaveguild;
            break;
        case 'prefix':
            command = helper.commands.admin.prefix;
            break;
        case 'purge':
            command = helper.commands.admin.purge;
            break;
        case 'servers':
            command = helper.commands.admin.servers;
            break;


        // misc
        case '8ball': case 'ask':
            command = helper.commands.fun._8ball;
            break;
        case 'coin': case 'coinflip': case 'flip':
            command = helper.commands.fun.coin;
            break;
        case 'hug':
            overrides = {
                ex: 'hug'
            };
            command = helper.commands.fun.gif;
            break;
        case 'kiss':
            overrides = {
                ex: 'kiss'
            };
            command = helper.commands.fun.gif;
            break;
        case 'lick':
            overrides = {
                ex: 'lick'
            };
            command = helper.commands.fun.gif;
            break;
        case 'pet':
            overrides = {
                ex: 'pet'
            };
            command = helper.commands.fun.gif;
            break;
        case 'punch':
            overrides = {
                ex: 'punch'
            };
            command = helper.commands.fun.gif;
            break;
        case 'slap':
            overrides = {
                ex: 'slap'
            };
            command = helper.commands.fun.gif;
            break;
        case 'inspire': case 'insp':
            command = helper.commands.fun.inspire;
            break;
        case 'janken': case 'paperscissorsrock': case 'rockpaperscissors': case 'rps': case 'psr':
            command = helper.commands.fun.janken;
            break;
        case 'poll': case 'vote':
            command = helper.commands.fun.poll;
            break;
        case 'roll': case 'rng': case 'randomnumber': case 'randomnumbergenerator': case 'pickanumber': case 'pickanum':
            command = helper.commands.fun.roll;
            break;
        default:
            command = null;
            break;
    }
}

function runCommand(cmd: string, message: Discord.Message, interaction: Discord.ChatInputCommandInteraction, args: string[], canReply: boolean, type: "message" | "interaction") {
    const isValid = commandCheck(cmd, message, interaction, canReply);
    if (isValid) {
        const helpOverrides: string[] = ['-h', '-help', '--h', '--help'];
        if (helpOverrides.some(x => args?.includes(x))) {
            args = [cmd];
            cmd = 'help';
        }
        commandSelect(cmd, args);
        if (command) {
            startType(message ?? interaction);
            command({
                message,
                interaction,
                args,
                date: new Date(),
                id: helper.tools.commands.getCmdId(),
                overrides,
                canReply,
                type,
            });
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