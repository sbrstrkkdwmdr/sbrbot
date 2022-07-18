//just a document for the help command
let template = [
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
]

let cmds = [
    {
        name: 'help',
        description: 'Returns all commands or information of a specific command',
        usage: 'sbr-help',
        slashusage: '/help [command]',
        options: [
            {
                name: 'command',
                description: '`string, optional`. Which command to return the information of'
            }
        ]
    },
    {
        name: 'gif',
        description: 'Sends a random gif based on the type given',
        usage: 'sbr-gif <type>',
        slashusage: '/gif [type]',
        options: [
            {
                name: 'type',
                description: '`string, optional`. What type to send'
            }
        ]
    },
    {
        name: 'ping',
        description: 'Pings the bot and returns the latency',
        usage: 'sbr-ping',
        slashusage: '/ping',
        options: []
    },
    {
        name: 'image',
        description: 'Searches the Google API and returns the first five results',
        usage: 'sbr-image <query>',
        slashusage: '/image [query]',
        options: [
            {
                name: 'query',
                description: '`string, required`. The parameters for the search'
            }
        ]
    },
    {
        name: 'ytsearch',
        description: 'Searches the YouTube API and returns the first five results',
        usage: 'sbr-ytsearch <query>',
        slashusage: '/ytsearch [query]',
        options: [
            {
                name: 'query',
                description: '`string, required`. The parameters for the search'
            }
        ]
    },
    {
        name: 'math',
        description: 'Solves a simple math problem',
        usage: 'sbr-math <problem>',
        slashusage: '/math [type] [num1] [num2]',
        options: [
            {
                name: 'problem',
                description: '`string, required, message command only`. The math equation to solve i.e `sbr-math 1-2+3/4`'
            },
            {
                name: 'type',
                description: '`string, required, / command only`. The type of equation to solve '
            },
            {
                name: 'num1',
                description: '`number, required, / command only`. The first number to use in the equation'
            },
            {
                name: 'num2',
                description: '`number, optional, / command only`. The second number to use in the equation'
            }
        ],
        aliases: 'solve'
    },
    {
        name: 'convert',
        description: 'Converts one value to another',
        usage: 'sbr-convert <type1> <type2> <number>',
        slashusage: '/convert [type1] [type2] [number]',
        options: [
            {
                name: 'type1',
                description: '`string, required`. What to convert the value from (ie km)'
            },
            {
                name: 'type2',
                description: '`string, required`. What to convert the value to (ie miles)'
            },
            {
                name: 'number',
                description: '`number, required`. The value to convert'
            }
        ]
    },
    {
        name: '8ball',
        description: 'Responds with a yes or no or maybe answer',
        usage: 'sbr-8ball',
        slashusage: '/8ball',
        options: [],
        aliases: 'ask'
    },
    {
        name: 'roll',
        description: 'Returns between 1-100 or the given number',
        usage: 'sbr-roll <number>',
        slashusage: '/roll [number]',
        options: [
            {
                name: 'number',
                description: '`integer, optional`. The maximum number. If omitted, the max will be 100'
            }
        ]
    },
    {
        name: 'remind',
        description: 'Sends a reminder to the user',
        usage: 'sbr-remind <time> <reminder>',
        slashusage: '/remind [reminder] [time]',
        options: [
            {
                name: 'time',
                description: '`string, required`. How long to wait to send the reminder. \nFormat: <number><type> i.e 2d3h1m6s\ntypes: `d`(days) `h`(hours) `m`(minutes) `s`(seconds)'
            },
            {
                name: 'reminder',
                description: '`string, optional (only in msg command)`. The reminder to set'
            }
        ]
    },
    {
        name: 'say',
        description: 'Sends a message',
        usage: 'sbr-say <message>',
        slashusage: '/say [channel] [message]',
        options: [
            {
                name: 'message',
                description: '`string, required`. The message to send'
            },

            {
                name: 'channel',
                description: '`channel, optional`. The channel to send the message to. <#ChannelId>. If omited, sends the message to the current channel'
            }
        ]
    },
    {
        name: 'poll',
        description: 'Creates a poll',
        usage: 'sbr-poll title',
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

    }
]


let osucmds = [
    {
        name: 'map',
        description: 'Retrieves the information of a map',
        usage: 'sbr-map "title" <id> +<mods>',
        slashusage: '/map [id] [mods]',
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
            }
        ],
        aliases: 'm'
    },
    {
        name: 'osu',
        description: 'Retrieves the information of an osu! profile',
        usage: 'sbr-osu <username>',
        slashusage: '/osu [username]',
        options: [
            {
                name: 'username',
                description: '`string/integer, optional`. The username or id of the user to retrieve. If omitted, the database will searched for the user\'s name'
            }
        ],
        aliases: 'profile'
    },
    {
        name: 'osuset',
        description: 'Sets the user\'s name for osu! commands (bancho only)',
        /*         usage: 'sbr-osuset <username>', */
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
        usage: 'sbr-osutop <user>',
        slashusage: '/osutop [user] [mode] [sort] [page] [mapper] [mods] [detailed] [compact]',
        options: [
            {
                name: 'user',
                description: '`string/integer, optional`. The username or id of the user to retrieve. If omitted, the database will searched for the user\'s name'
            },
            {
                name: 'mode',
                description: '`string, optional`. Which mode to fetch top plays from. If omitted, the database will searched for the user\'s gamemode'
            },
            {
                name: 'sort',
                description: '`string, optional`. How to sort the plays by. If omitted, plays will be sorted by pp'
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
        name: 'rs',
        description: 'Retrieves the most recent score for the user',
        usage: 'sbr-rs <user>',
        slashusage: '/rs [user] [page] [mode]',
        options: [
            {
                name: 'user',
                description: '`string/integer, optional`. The username or id of the user to retrieve. If omitted, the database will searched for the user\'s name'
            },
            {
                name: 'page',
                description: '`integer, optional`. What page to show'
            },
            {
                name: 'mode',
                description: '`string, optional`. Which mode to fetch top plays from. If omitted, the database will searched for the user\'s gamemode'
            },
            {
                name: 'list',
                description: '`boolean, optional`. Shows the most 20 recent scores'
            }
        ],
        aliases: 'recent'
    },
    {
        name: 'scores',
        description: 'Retrieves the user\'s score for a set map',
        usage: 'sbr-scores <user> <id>',
        slashusage: '/scores [user] [id] [sort] [compact]',
        options: [
            {
                name: 'user',
                description: '`string/integer, optional`. The username or id of the user to retrieve. If omitted, the database will searched for the user\'s name'
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
                name: 'compact',
                description: '`boolean, optional. Enables/Disables compact mode. Displays only the mods, accuracy and pp'
            }
        ],
        aliases: 'c'
    }
]

let admincmds = [
    {
        name: 'checkperms',
        description: 'Retrieves all permissions of the requested user',
        usage: 'sbr-checkperms <user>',
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
        name: 'leaveguild',
        description: 'Leaves the guild. Requires permissions',
        usage: 'sbr-leaveguild <id>',
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
        name: 'servers',
        description: 'Retrieves a list of all servers the bot is in',
        usage: 'sbr-servers',
        slashusage: '/servers',
        options: []
    },
    {
        name: 'voice',
        description: 'Changes voice settings for a user',
        usage: 'sbr-voice <user> <type> <channel>',
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
    },
    {
        name: 'log',
        description: 'Returns the logs for the current guild',
        usage: 'sbr-log',
        slashusage: '/log [guildid]',
        options: [
            {
                name: 'guildid',
                description: '`integer, optional`. The id of the guild to retrieve the logs of. If omitted, the logs of the guild the message is sent in will be returned'
            }
        ]
    },
    {
        name: 'find',
        description: 'Returns name from the id given',
        usage: 'sbr-find <type> <id>',
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
    }
]

let links = [
    {
        name: 'osumaplink',
        description: 'Returns information from a map link',
        usage: '`https://osu.ppy.sh/b/<id>` or `https://osu.ppy.sh/s/<setid>#<gamemode>/<id>`',
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
        aliases: 'osu.ppy.sh/beatmaps/<id>, osu.ppy.sh/beatmapsets/<setid>#<gamemode>/<id>, osu.ppy.sh/s/<setid>, osu.ppy.sh/beatmapsets/<setid>'
    },
    {
        name: 'osuuserlink',
        description: 'Returns information from a user link',
        usage: '`https://osu.ppy.sh/u/<id/name>` or `https://osu.ppy.sh/users/<id/name>`',
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
        usage: '`<file>`',
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
        usage: '`https://osu.ppy.sh/scores/<gamemode>/<id>`',
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

]
let musiccmds = [
    {
        name: 'play',
        description: 'Plays a song',
        usage: 'sbr-play <url>',
        slashusage: '/play [url]',
        options: [
            {
                name: 'url',
                description: '`string, required`. The url of the song to play'
            }
        ]
    },
    {
        name: 'skip',
        description: 'Skips the current song',
        usage: 'sbr-skip',
        slashusage: '/skip',
        options: []
    },
    {
        name: 'stop',
        description: 'Stops the current song',
        usage: 'sbr-stop',
        slashusage: '/stop',
        options: [],
        aliases: 'pause'
    },
    {
        name: 'resume',
        description: 'Resumes the current song',
        usage: 'sbr-resume',
        slashusage: '/resume',
        options: [],
        aliases: 'unpause'
    },
    {
        name: 'np',
        description: 'Retrieves the current song',
        usage: 'sbr-np',
        slashusage: '/np',
        options: [],
        aliases: 'nowplaying'
    },
    {
        name: 'queue',
        description: 'Retrieves the current queue',
        usage: 'sbr-queue',
        slashusage: '/queue',
        options: [],
        aliases: 'q'
    }
]


module.exports = { cmds, osucmds, admincmds, links, musiccmds }