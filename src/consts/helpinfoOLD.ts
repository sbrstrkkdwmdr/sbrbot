//just a document for the help command
const template = [
    {
        name: 'name',
        description: 'description',
        usage: 'usage for command using messageCreate event',
        slashusage: 'usage for command using interactionCreate event',
        options: [
            {
                name: 'option name',
                description: 'description name'
            }
        ]
    }
];

type commandInfo = {
    name: string,
    description: string,
    usage?: string,
    slashusage?: string,
    options: { name: string, description: string; }[],
    aliases?: string;
};

const cmds: commandInfo[] = [
    {
        name: 'convert',
        description: 'Converts one value to another',
        usage: 'convert [from] [to] [number]',
        slashusage: '/convert [from] [to] [number]',
        options: [
            {
                name: 'from',
                description: '`string, required`. What to convert the value from (ie km)'
            },
            {
                name: 'to',
                description: '`string, required`. What to convert the value to (ie miles)'
            },
            {
                name: 'number',
                description: '`number, required`. The value to convert'
            }
        ]
    },
    {
        name: 'help',
        description: 'Returns all commands or information of a specific command',
        usage: 'help [command]',
        slashusage: '/help [command]',
        options: [
            {
                name: 'command',
                description: '`string, optional`. Which command to return the information of'
            }
        ]
    },
    {
        name: 'info',
        description: 'Returns information for the bot',
        usage: 'info',
        options: []
    },
    {
        name: 'math',
        description: 'Solves a simple math problem',
        usage: 'math [problem]',
        slashusage: '/math [type] [num1] [num2]',
        options: [
            {
                name: 'problem',
                description: '`string, required`. The math equation to solve i.e `math 1-2+3/4`'
            },
            {
                name: 'type',
                description: '`string, required`. The type of equation to solve '
            },
            {
                name: 'num1',
                description: '`number, required`. The first number to use in the equation'
            },
            {
                name: 'num2',
                description: '`number, optional`. The second number to use in the equation'
            }
        ],
        aliases: 'solve'
    },
    {
        name: 'ping',
        description: 'Pings the bot and returns the latency',
        usage: 'ping',
        slashusage: '/ping',
        options: []
    },
    {
        name: 'remind',
        description: 'Sends a reminder to the user',
        usage: 'remind [time] [reminder]',
        slashusage: '/remind [reminder] [time]',
        options: [
            {
                name: 'time',
                description: '`string, required`. How long to wait to send the reminder. \nFormat: [number][type] i.e 2d3h1m6s\ntypes: `d`(days) `h`(hours) `m`(minutes) `s`(seconds)'
            },
            {
                name: 'reminder',
                description: '`string, optional`. The reminder to set'
            },
            {
                name: 'sendinchannel',
                description: '`boolean, optional`. Whether to send the reminder in the channel or in the DM'
            }
        ]
    },
    {
        name: 'stats',
        description: 'Returns the bot statistics',
        usage: 'stats',
        options: []

    }
];

const othercmds: commandInfo[] = [
    {
        name: '8ball',
        description: 'Responds with a yes or no or maybe answer',
        usage: '8ball',
        slashusage: '/8ball',
        options: [],
        aliases: 'ask'
    },
    {
        name: 'gif',
        description: 'Sends a random gif based on the type given',
        usage: 'gif [type]',
        slashusage: '/gif [type]',
        options: [
            {
                name: 'type',
                description: '`string, optional`. What type to send'
            }
        ]
    },
    {
        name: 'image',
        description: 'Searches the Google API and returns the first five results',
        usage: 'image [query]',
        slashusage: '/image [query]',
        options: [
            {
                name: 'query',
                description: '`string, required`. The parameters for the search'
            }
        ]
    },
    {
        name: 'poll',
        description: 'Creates a poll',
        usage: 'poll title',
        slashusage: '/poll [title] [options]',
        options: [
            {
                name: 'title',
                description: '`string, required`. The title of the poll'
            },
            {
                name: 'options',
                description: '`string, required`. The options of the poll. Each option should be separated with a `+`. Max limit of 26'
            }
        ]
    },
    {
        name: 'roll',
        description: 'Returns between 1-100 or the given number',
        usage: 'roll [number]',
        slashusage: '/roll [number]',
        options: [
            {
                name: 'number',
                description: '`integer, optional`. The maximum number. If omitted, the max will be 100'
            }
        ]
    },
    {
        name: 'say',
        description: 'Sends a message',
        usage: 'say [message]',
        slashusage: '/say [channel] [message]',
        options: [
            {
                name: 'message',
                description: '`string, required`. The message to send'
            },

            {
                name: 'channel',
                description: '`channel, optional`. The channel to send the message to. [#ChannelId]. If omited, sends the message to the current channel'
            }
        ]
    },
    {
        name: 'ytsearch',
        description: 'Searches the YouTube API and returns the first five results',
        usage: 'ytsearch [query]',
        slashusage: '/ytsearch [query]',
        options: [
            {
                name: 'query',
                description: '`string, required`. The parameters for the search'
            }
        ]
    }
];


const osucmds: commandInfo[] = [
    {
        name: 'bws',
        description: 'Returns the badge weighting for a player',
        usage: 'bws [user]',
        slashusage: '/bws [user]',
        options: [
            {
                name: 'user',
                description: '`string, optional`. The username or id of the user to retrieve. If omitted, the database will search for the user\'s name'
            }
        ]
    },
    {
        name: 'compare',
        description: 'Compares two scores. If options are omitted, then the most recent score will be compared with the user\'s best score on that map',
        usage: 'compare',
        slashusage: '/compare [score_id_1] [score_id_2]',
        options: [
            {
                name: 'score_id_1',
                description: 'The id of the first score to compare'
            },
            {
                name: 'score_id_2',
                description: 'The id of the second score to compare'
            }
        ]

    },
    {
        name: 'firsts',
        description: 'Retrieves all #1 scores for a player',
        usage: 'firsts [user]',
        options: [
            {
                name: 'user/mention',
                description: '`string/integer, optional`. The username or id of the user to retrieve. If omitted, the database will search for the user\'s name'
            }
        ]
    },
    {
        name: 'lb',
        description: 'Retrieves the osu! leaderboard for the server',
        options: []
    },
    {
        name: 'leaderboard',
        description: 'Retrieves the top 5 plays on a beatmap',
        usage: 'leaderboard [id]',
        slashusage: '/leaderboard [id] [page] [mods]',
        options: [
            {
                name: 'id',
                description: '`integer, optional`. The id of the beatmap. If omitted, the previous map used will be used instead'
            },
            {
                name: 'page',
                description: '`integer, optional`. What page to show. 1-20'
            },
            {
                name: 'mods',
                description: '`string, optional`. Only show plays with these mods. Uses APIv1 so some values may be incorrect'
            }
        ],
        aliases: 'maplb ,mapleaderboard'
    },
    {
        name: 'map',
        description: 'Retrieves the information of a map',
        usage: 'map "title" [id] +[mods]',
        slashusage: '/map [id] [mods] [detailed]',
        options: [
            {
                name: 'title',
                description: '`string, optional, message command only`. The title of the map to search. Must be placed between two "s.'
            },
            {
                name: 'id',
                description: '`integer, optional`. The id of the beatmap. If omitted, the previous map used will be used instead'
            },
            {
                name: 'mods',
                description: '`string, optional`. The mods to apply on top of the map'
            },
            {
                name: 'detailed',
                description: '`boolean, optional`. Whether to show the detailed information of the map (milliseconds, object radius)'
            }
        ],
        aliases: 'm'
    },
    {
        name: 'nochokes',
        description: 'Retrieves all plays that are not chokes for a player',
        usage: 'nochokes [user]',
        slashusage: '/nochokes [user]',
        options: [
            {
                name: 'user',
                description: '`string, optional`. The username or id of the user to retrieve. If omitted, the database will search for the user\'s name'
            }
        ]
    },
    {
        name: 'osu',
        description: 'Retrieves the information of an osu! profile',
        usage: 'osu [username]',
        slashusage: '/osu [username] [detailed]',
        options: [
            {
                name: 'username',
                description: '`string/integer/mention, optional`. The username or id of the user to retrieve. If omitted, the database will search for the user\'s name'
            },
            {
                name: 'detailed',
                description: '`boolean, optional`. Whether to show the detailed information of the user (graph, avg pp, etc)'
            }
        ],
        aliases: 'profile, o'
    },
    {
        name: 'osuset',
        description: 'Sets the user\'s name for osu! commands (bancho only)',
        /*         usage: 'osuset [username]', */
        slashusage: '/osuset [username] [mode]',
        options: [
            {
                name: 'username',
                description: '`string/integer, required`. The username or id of the user'
            },
            {
                name: 'mode',
                description: '`string, optional`. The mode of the user. Defaults to osu if omitted'
            }
        ],
    },
    {
        name: 'osutop',
        description: 'Retrieves the top 5 plays for the user',
        usage: 'osutop [user]',
        slashusage: '/osutop [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed] [compact]',
        options: [
            {
                name: 'user',
                description: '`string/integer/mention, optional`. The username or id of the user to retrieve. If omitted, the database will search for the user\'s name'
            },
            {
                name: 'mode',
                description: '`string, optional`. Which mode to fetch top plays from. If omitted, the database will search for the user\'s gamemode'
            },
            {
                name: 'sort',
                description: '`string, optional`. How to sort the plays by. If omitted, plays will be sorted by pp'
            },
            {
                name: 'reverse',
                description: '`boolean, optional`. Whether to reverse the order of the plays'
            },
            {
                name: 'page',
                description: '`integer, optional`. What page to show. 1-20'
            },
            {
                name: 'mapper',
                description: '`string, optional`. Filter to only show plays set on maps by this mapper'
            },
            {
                name: 'mods',
                description: '`string, optional`. Filter to only show plays set with these mods. Add the word "any" at the start to show mixed (mods:anyHDDT also shows ezhddt, hddthr etc.)'
            },
            {
                name: 'detailed',
                description: '`boolean, optional. Enables/Disables displaying extra details. Most common mapper, mod combo, max combo, min/avg/max pp'
            },
            {
                name: 'compact',
                description: '`boolean, optional. Enables/Disables compact mode. Displays only the map name, mods, accuracy and pp'
            }
        ],
        aliases: 'top'
    },
    {
        name: 'pinned',
        description: 'Retrieves a user\'s pinned scores',
        usage: 'pinned [user]',
        options: [
            {
                name: 'user',
                description: '`string/integer/mention, optional`. The username or id of the user to retrieve. If omitted, the database will search for the user\'s name'
            }
        ]
    },
    {
        name: 'ppifrank',
        description: 'Returns the pp if x rank or rank if x pp',
        usage: 'ppifrank [value] [type]',
        slashusage: '/ppifrank [value] [type]',
        options: [
            {
                name: 'value',
                description: '`float, required`. The value to set'
            },
            {
                name: 'type',
                description: '`string, optional`. The type of the value. Can be either pp or rank. Defaults to pp'
            }
        ]
    },
    {
        name: 'recent',
        description: 'Retrieves the most recent score for the user',
        usage: 'recent [user]',
        slashusage: '/recent [user] [page] [mode] [list]',
        options: [
            {
                name: 'user',
                description: '`string/integer/mention, optional`. The username or id of the user to retrieve. If omitted, the database will search for the user\'s name'
            },
            {
                name: 'page',
                description: '`integer, optional`. What page to show'
            },
            {
                name: 'mode',
                description: '`string, optional`. Which mode to fetch top plays from. If omitted, the database will search for the user\'s gamemode'
            },
            {
                name: 'list',
                description: '`boolean, optional`. Shows the most 20 recent scores'
            }
        ],
        aliases: 'rs, r'
    },
    {
        name: 'scores',
        description: 'Retrieves the user\'s score for a set map',
        usage: 'scores [user] [id]',
        slashusage: '/scores [user] [id] [sort] [reverse] [compact]',
        options: [
            {
                name: 'user',
                description: '`string/integer/mention, optional`. The username or id of the user to retrieve. If omitted, the database will search for the user\'s name'
            },
            {
                name: 'id',
                description: '`integer, optional`. The id of the beatmap. If omitted, the previous map used will be used instead'
            },
            {
                name: 'sort',
                description: '`string, optional`. How to sort the plays by. If omitted, plays will be sorted by most recent'
            },
            {
                name: 'reverse',
                description: '`boolean, optional`. Whether to reverse the order of the plays'
            },
            {
                name: 'compact',
                description: '`boolean, optional. Enables/Disables compact mode. Displays only the mods, accuracy and pp'
            }
        ],
        aliases: 'c'
    },
    {
        name: 'simulate',
        description: 'simulates a play for a map',
        usage: 'simulate [id] +[mods] misses=[misses] acc=[accuracy] combo=[combo] n300=[n300] n100=[n100] n50=[n50] miss=[misses] ',
        slashusage: '/simulate [id] [mods] [accuracy] [combo] [n300] [n100] [n50] [misses]',
        options: [
            {
                name: 'id',
                description: '`integer, optional`. The id of the beatmap. If omitted, the previous map used will be used instead'
            },
            {
                name: 'mods',
                description: '`string, optional`. The mods to apply on top of the map. Defaults to NM'
            },
            {
                name: 'accuracy',
                description: '`float, optional`. The accuracy for the play. Defaults to 100'
            },
            {
                name: 'combo',
                description: '`integer, optional`. The maximum combo for the play. Defaults to map max combo'
            },
            {
                name: 'n300',
                description: '`integer, optional`. Number of hit 300s.'
            },
            {
                name: 'n100',
                description: '`integer, optional`. Number of hit 100s.'
            },
            {
                name: 'n50',
                description: '`integer, optional`. Number of hit 50s.'
            },
            {
                name: 'misses',
                description: '`integer, optional`. The amount of misses for the play. Defaults to 0'
            },
        ],
        aliases: 'simplay'
    },
    {
        name: 'whatif',
        description: 'Returns the player\'s total pp, rank etc. if they get an x pp score',
        usage: 'whatif [value]',
        slashusage: '/whatif [value]',
        options: [
            {
                name: 'value',
                description: '`float, required`. The amount of pp'
            },
        ]
    }

];

const admincmds: commandInfo[] = [
    {
        name: 'checkperms',
        description: 'Retrieves all permissions of the requested user',
        usage: 'checkperms [user]',
        slashusage: '/checkperms [user]',
        options: [
            {
                name: 'user',
                description: '`user/mention, optional`. The user to retrieve the permissions of. If omitted, the user will be checked instead'
            }
        ],
        aliases: 'fetch perms, checkpermissions, permissions, perms'
    },
    {
        name: 'find',
        description: 'Returns name from the id given',
        usage: 'find [type] [id]',
        slashusage: '/find [type] [id]',
        options: [
            {
                name: 'type',
                description: '`string, required`. The type of id to find. Valid types are: "user", "guild", "channel", "role", "emoji"'
            },
            {
                name: 'id',
                description: '`integer, required`. The id of the object to find'
            }
        ]
    },
    {
        name: 'leaveguild',
        description: 'Leaves the guild. Requires permissions',
        usage: 'leaveguild [id]',
        slashusage: '/leaveguild [id]',
        options: [
            {
                name: 'id',
                description: '`integer, optional`. The id of the guild to leave. If omitted, the guild the message is sent in is left'
            }
        ],
        aliases: 'leave'
    },
    {
        name: 'log',
        description: 'Returns the logs for the current guild',
        usage: 'log',
        slashusage: '/log [guildid]',
        options: [
            {
                name: 'guildid',
                description: '`integer, optional`. The id of the guild to retrieve the logs of. If omitted, the logs of the guild the message is sent in will be returned'
            }
        ]
    },
    {
        name: 'servers',
        description: 'Retrieves a list of all servers the bot is in',
        usage: 'servers',
        slashusage: '/servers',
        options: []
    },
    {
        name: 'voice',
        description: 'Changes voice settings for a user',
        usage: 'voice [user] [type] [channel]',
        slashusage: '/voice [user] [type] [channel]',
        options: [
            {
                name: 'user',
                description: '`user/mention, optional`. The user to change the voice settings of. If omitted, the message author will be used (message command only)'
            },
            {
                name: 'type',
                description: '`string, required`. The type of voice setting to change. Valid types are: "mute", "deafen", "move", "disconnect"'
            },
            {
                name: 'channel',
                description: '`integer/channel, optional`. The channel to move the user to.'
            }
        ]
    }
];

const links = [
    {
        name: 'maplink',
        description: 'Returns information from a map link',
        usage: '`https://osu.ppy.sh/b/[id]` or `https://osu.ppy.sh/s/[setid]#[gamemode]/[id]`',
        params: [
            {
                name: 'id',
                description: '`integer, required`. The ID of the map'
            },
            {
                name: 'setid',
                description: '`integer, required`. The ID of the set. Only needed if using beatmapset link'
            },
            {
                name: 'gamemode',
                description: '`string, required`. The gamemode of the map. Only needed if using beatmapset link. Valid types are: "osu", "taiko", "fruits", "mania"'
            }
        ],
        aliases: 'osu.ppy.sh/beatmaps/[id], osu.ppy.sh/beatmapsets/[setid]#[gamemode]/[id], osu.ppy.sh/s/[setid], osu.ppy.sh/beatmapsets/[setid]'
    },
    {
        name: 'userlink',
        description: 'Returns information from a user link',
        usage: '`https://osu.ppy.sh/u/[id/name]` or `https://osu.ppy.sh/users/[id/name]`',
        params: [
            {
                name: 'id/name',
                description: '`integer/string, required`. The ID or username of the user'
            }
        ]
    },
    {
        name: 'replayparse',
        description: 'Returns information from a replay file',
        usage: '`[replay.osr]`',
        params: [
            {
                name: 'file',
                description: '`.osr file, required`. The replay file to parse'
            }
        ]
    },
    {
        name: 'scoreparse',
        description: 'Returns information from a score link',
        usage: '`https://osu.ppy.sh/scores/[gamemode]/[id]`',
        params: [
            {
                name: 'id',
                description: '`integer, required`. The ID of the score'
            },
            {
                name: 'gamemode',
                description: '`string, required`. The gamemode of the score. Valid types are: "osu", "taiko", "fruits", "mania"'
            }
        ],
        aliases: '`'
    }

];

//module.exports = { cmds, osucmds, admincmds, links, musiccmds }
export { cmds, othercmds, osucmds, admincmds, links };

