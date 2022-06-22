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
                description: '`string, optional`. The title of the map to search. Must be placed between two "s.'
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
        slashusage: '/osutop [user] [mode] [sort] [page] [mapper] [mods] [detailed]',
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
        ],
        aliases: 'recent'
    },
    {
        name: 'scores',
        description: 'Retrieves the user\'s score for a set map',
        usage: 'sbr-scores <user> <id>',
        slashusage: '/scores [user] [id] [sort]',
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
    }
]

let linkcmds = [
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



module.exports = { cmds, osucmds, admincmds, linkcmds }