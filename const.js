// const constants = require('./const');

const template = {
    name: '',
    description: '',
    usage: '',
    slashusage: '',
    examples: [],
    aliases: [],
    options: {
        name: '',
        type: '',
        required: false,
        description: '',
        options: [],
        defaultValue: 'N/A'
    }
}

const mods = [
    'NM',
    'NF',
    'EZ',
    'TD',
    'HD',
    'HR',
    'SD',
    'DT',
    'RX',
    'HT',
    'NC',
    'FL',
    'AT',
    'SO',
    'AP',
    'PF',
    '1K',
    '2K',
    '3K',
    '4K',
    '5K',
    '6K',
    '7K',
    '8K',
    '9K',
    'FI',
    'RD',
    'CN',
    'TP',
    'KC',
    'S2', 'V2', 'SV2',
    'MR'
]

const generalcommands = [
    {
        name: 'convert',
        description: 'Converts a number from one unit to another',
        usage: 'convert [from] [to] [number]',
        slashusage: 'convert [from] [to] [number]',
        examples: [
            {
                text: 'PREFIXMSGconvert km mi 10',
                descriptor: 'Converts 10 kilometers to miles'
            },
            {
                text: 'PREFIXMSGconvert k c 273.15',
                descriptor: 'Converts 273.15 kelvin to celsius'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'from',
                type: 'string',
                required: true,
                description: 'The unit to convert from',
                options: ['N/A'],
                defaultValue: 'N/A'
            },
            {
                name: 'to',
                type: 'string',
                required: true,
                description: 'The unit to convert to',
                options: [
                    'celsius', 'fahrenheit', 'kelvin',
                    'inches', 'feet', 'metres', 'miles',
                    'seconds', 'minutes', 'hours', 'days', 'years',
                    'fluid ounces', 'cups', 'pints', 'litres', 'gallons', 'cubic metres',
                    'grams', 'Newtons(WIP)', 'kilograms(WIP)', 'ounces', 'pounds', 'metric tonnes',
                    'help', 'SI units'
                ],
                defaultValue: 'N/A'
            },
            {
                name: 'number',
                type: 'float',
                required: true,
                description: 'The number to convert',
                options: ['N/A'],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'help',
        description: 'Shows a list of commands or information about a specific command',
        usage: 'help [command]',
        slashusage: 'help [command]',
        examples: [
            {
                text: 'PREFIXMSGhelp',
                descriptor: 'Shows a list of all commands'
            },
            {
                text: 'PREFIXMSGhelp convert',
                descriptor: 'Shows information about the convert command'
            },
            {
                text: '/help recent',
                descriptor: 'Shows information about the recent command'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'command',
                type: 'string',
                required: false,
                description: 'The command to get information about',
                options: ['N/A'],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'info',
        description: 'Shows information about the bot',
        usage: 'info',
        slashusage: 'null',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'math',
        description: 'Solves a math problem',
        usage: 'math [problem]',
        slashusage: 'math [type] [num1] [num2]',
        examples: [
            {
                text: 'PREFIXMSGmath 2+2',
                descriptor: 'Solves 2+2'
            },
            {
                text: '/math type:pythag num1:3 num2:4',
                descriptor: 'Solves the pythagorean theorem with a=3 and b=4'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'problem',
                type: 'string',
                required: 'true (if using message command)',
                description: 'The math problem to solve',
                options: [
                    'non numerical characters are ignored (excluding pi)',
                ],
                defaultValue: 'N/A'
            },
            {
                name: 'type',
                type: 'string',
                required: 'true (if using slash command)',
                description: 'The type of math problem',
                options: [
                    'square', 'square root',
                    'factorial',
                    'highest common factor', 'lowest common multiple',
                    'approach rate +dt', 'approach rate +ht', 'approach rate(ms)',
                    'circumference', 'area of a circle',
                    'pythag',
                    'conversion to significant figures',
                    'od+dt', 'od+ht', 'od(ms)',
                    'mod int to string'
                ],
                defaultValue: 'N/A'
            },
            {
                name: 'num1',
                type: 'float',
                required: 'true (if using slash command)',
                description: 'The first number',
                options: ['N/A'],
                defaultValue: 'N/A'
            },
            {
                name: 'num2',
                type: 'float',
                required: 'true (sometimes)',
                description: 'The second number',
                options: ['N/A'],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'ping',
        description: 'Pings the bot and returns the latency',
        usage: 'ping',
        slashusage: 'ping',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'remind',
        description: 'Sets a reminder',
        usage: 'reminder [time] [reminder]',
        slashusage: 'reminder [time] [reminder] [sendinchannel]',
        examples: [
            {
                text: 'PREFIXMSGremind 1h30m30s reminder',
                descriptor: 'Sets a reminder for 1 hour, 30 minutes, and 30 seconds'
            },
            {
                text: 'PREFIXMSGremind 2:05 fc',
                descriptor: 'Sets a reminder for 2 minutes and 5 seconds'
            },
            {
                text: '/remind time:1h30m30s reminder:reminder sendinchannel:true',
                descriptor: 'Sets a reminder for 1 hour, 30 minutes, and 30 seconds and sends it in the channel'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'time',
                type: 'string',
                required: true,
                description: 'The time until the reminder',
                options: [
                    'format: [number][unit]',
                    'units: s, m, h, d, w, y',
                    'example: 1h30m30s'
                ],
                defaultValue: '0s'
            },
            {
                name: 'reminder',
                type: 'string',
                required: false,
                description: 'The reminder',
                options: ['N/A'],
                defaultValue: 'null'
            },
            {
                name: 'sendinchannel',
                type: 'boolean',
                required: false,
                description: 'Whether to send the reminder in the channel or in a DM. Admin only',
                options: ['true', 'false'],
                defaultValue: 'false'
            }
        ]
    },
    {
        name: 'stats',
        description: 'Shows the bot\'s statistics',
        usage: 'stats',
        slashusage: 'null',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'time',
        description: 'Shows the current time in a specific timezone as well as UTC and the bot\'s timezone',
        usage: 'time [timezone]',
        slashusage: 'time [timezone]',
        examples: [
            {
                text: 'PREFIXMSGtime',
                descriptor: 'Shows the current time in UTC and the bot\'s timezone'
            },

            {
                text: 'PREFIXMSGtime Australia/Melbourne',
                descriptor: 'Shows the current time in Australia/Melbourne'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'timezone',
                type: 'string',
                required: false,
                description: 'The timezone to show the time in',
                options: ['N/A'],
                defaultValue: 'UTC'
            }
        ]
    }
]

const osucommands = [
    {
        name: 'bws',
        description: 'Shows the badge weighted rank of a user',
        usage: 'bws [user]',
        slashusage: 'bws [user]',
        examples: [
            {
                text: 'PREFIXMSGbws',
                descriptor: 'Shows your badge weighted rank'
            },
            {
                text: 'PREFIXMSGbws peppy',
                descriptor: 'Shows peppy\'s badge weighted rank'
            },
            {
                text: 'PREFIXMSGbws DigitalHypno',
                descriptor: 'Shows DigitalHypno\'s badge weighted rank'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the badge weighting of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            }
        ]
    },
    {
        name: 'compare',
        description: 'Compares two users\' osu! stats/top plays/scores',
        usage: 'compare [first] [second]',
        slashusage: 'compare [type] [first] [second]',
        examples: [
            {
                text: 'PREFIXMSGcompare SaberStrike',
                descriptor: 'Compares your stats to SaberStrike\'s'
            },
            {
                text: 'PREFIXMSGcompare peppy SaberStrike',
                descriptor: 'Compares peppy\'s and SaberStrike\'s stats'
            },
            {
                text: 'PREFIXMSGcommon SaberStrike Soragaton',
                descriptor: 'Compares SaberStrike\'s and Soragaton\'s top plays'
            },
            {
                text: '/compare type:top first:SaberStrike second:Soragaton',
                descriptor: 'Compares SaberStrike\'s and Soragaton\'s top plays'
            }
        ],
        aliases: ['common'],
        options: [
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'The type of comparison',
                options: [
                    'profile', 'top plays'
                ],
                defaultValue: 'user'
            },
            {
                name: 'first',
                type: 'string',
                required: false,
                description: 'The first user to compare',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            },
            {
                name: 'second',
                type: 'string',
                required: false,
                description: 'The second user to compare',
                options: ['N/A'],
                defaultValue: 'most recent user fetched in the guild'
            }
        ]
    },
    {
        name: 'firsts',
        description: 'Shows the #1 global scores of a user',
        usage: 'firsts [user] [-page] [-(mode)]',
        slashusage: 'firsts [user] [mode] [sort] [reverse] [page] [mapper] [mods]',
        examples: [
            {
                text: 'PREFIXMSGfirsts SaberStrike',
                descriptor: 'Shows SaberStrike\'s #1 scores'
            },
            {
                text: 'PREFIXMSGfirsts -p 3 ',
                descriptor: 'Shows the 3rd page of your #1 scores'
            }
            ,
            {
                text: 'PREFIXMSGfirsts -mania',
                descriptor: 'Shows your #1 mania scores'
            },
            {
                text: '/firsts mods:HDHR sort:recent',
                descriptor: 'Shows your #1 scores with HDHR sorted by recent'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the scores of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                aliases: ['m']
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The sort order of the scores',
                options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
                defaultValue: 'pp'
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to reverse the sort order',
                options: ['true', 'false'],
                defaultValue: 'false'
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p']
            },
            {
                name: 'mapper',
                type: 'string',
                required: false,
                description: 'The mapper to filter the scores by',
                options: ['N/A'],
                defaultValue: 'null'
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to filter the scores by',
                options: mods,
                defaultValue: 'null'
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the scores',
                options: ['true', 'false'],
                defaultValue: 'false'
            }
        ]
    },
    {
        name: 'globals',
        description: 'Shows the number of #1 scores a player has',
        usage: 'globals [username]',
        slashusage: 'globals [username]',
        examples: [],
        aliases: [],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the scores of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            }
        ]
    },
    {
        name: 'lb',
        description: 'Shows the leaderboard of the current server',
        usage: 'lb',
        slashusage: 'lb',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'map',
        description: 'Shows information about a beatmap',
        usage: 'map "query" [id] +[mods]',
        slashusage: 'map [query] [id] [mods] [detailed]',
        examples: [
            {
                text: 'PREFIXMSGmap "kimi no shiranai monogatari"',
                descriptor: 'Returns the first result for "kimi no shiranai monogatari"'
            },
            {
                text: 'PREFIXMSGmap 3013912 +HDHR',
                descriptor: 'Returns the beatmap with the id 3013912 with HDHR'
            },
        ],
        aliases: ['m'],
        options: [
            {
                name: 'query',
                type: 'string',
                required: false,
                description: 'The map to search for',
                options: ['N/A'],
                defaultValue: 'null'
            },
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The map ID to search for',
                options: ['N/A'],
                defaultValue: 'the most recent map in the guild'
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to calculate the map with',
                options: mods,
                defaultValue: 'none'
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the map',
                options: ['true', 'false'],
                defaultValue: 'false'
            }
        ]
    },
    {
        name: 'maplb',
        description: 'Shows the leaderboard of a map',
        usage: 'maplb [id]',
        slashusage: 'maplb [id] [page] [mods]',
        examples: [
            {
                text: 'PREFIXMSGmaplb 32345',
                descriptor: 'Returns the leaderboard of the map with the id 32345'
            },
            {
                text: '/maplb mods:HDHR',
                descriptor: 'Returns the leaderboard of the most recent map in the guild with HDHR'
            }
        ],
        aliases: ['leaderboard', 'mapleaderboard'],
        options: [
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The ID of the map to show the leaderboard of',
                options: ['N/A'],
                defaultValue: 'the most recent map in the guild'
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of the leaderboard to show',
                options: ['N/A'],
                defaultValue: '1'
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to filter the leaderboard by',
                options: mods,
                defaultValue: 'none'
            },
        ]
    },
    {
        name: 'nochokes',
        description: 'Shows the user\'s top plays without misses',
        usage: 'nochokes [user] [-page] [-(mode)]',
        slashusage: 'nochokes [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed]',
        examples: [
            {
                text: 'PREFIXMSGnochokes SaberStrike',
                descriptor: 'Returns SaberStrike\'s top plays without misses'
            },
            {
                text: 'PREFIXMSGnc -p 3',
                descriptor: 'Returns the third page of your top plays without misses'
            },
            {
                text: 'PREFIXMSGnochokes -mania',
                descriptor: 'Returns your top mania plays without misses'
            },
            {
                text: '/nochokes mods:HDHR sort:recent',
                descriptor: 'Returns your top plays with HDHR sorted by recent without misses'
            }
        ],
        aliases: ['nc'],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the scores of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                aliases: ['m']
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The sort order of the scores',
                options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
                defaultValue: 'pp'
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to reverse the sort order',
                options: ['true', 'false'],
                defaultValue: 'false'
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p']
            },
            {
                name: 'mapper',
                type: 'string',
                required: false,
                description: 'The mapper to filter the scores by',
                options: ['N/A'],
                defaultValue: 'null'
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to filter the scores by',
                options: mods,
                defaultValue: 'null'
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the scores',
                options: ['true', 'false'],
                defaultValue: 'false'
            }
        ]
    },
    {
        name: 'osu',
        description: 'Shows information about a user\'s osu! profile',
        usage: 'osu [user] [-graph] [-detailed] [-(mode)]',
        slashusage: 'osu [user] [detailed] [mode]',
        aliases: ['o', 'profile', 'user'],
        examples: [
            {
                text: 'PREFIXMSGosu SaberStrike',
                descriptor: 'Shows SaberStrike\'s osu! profile'
            },
            {
                text: '/osu detailed:true mode:taiko',
                descriptor: 'Shows your taiko profile with detailed information'
            },
            {
                text: 'PREFIXMSGosu -graph',
                descriptor: 'Shows a graph of your osu! rank and playcount'
            }
        ],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the profile of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the user',
                options: ['true', 'false'],
                defaultValue: 'false'
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The gamemode to show the stats of',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'your playmode'
            },
            {
                name: 'graph',
                type: 'boolean',
                required: false,
                description: 'Whether to show only user statistics graphs',
                options: ['true', 'false'],
                defaultValue: 'false'
            }
        ]
    },
    {
        name: 'osuset',
        description: 'Sets your osu! username/mode/skin',
        usage: 'osuset [username]',
        slashusage: 'osuset [username] [mode] [skin]',
        examples: [
            {
                text: 'PREFIXMSGosuset SaberStrike',
                descriptor: 'Sets your osu! username to SaberStrike'
            },
            {
                text: '/osuset username:SaberStrike mode:fruits skin:sbr v11',
                descriptor: 'Sets your osu! username to SaberStrike, mode to fruits, and skin to sbr v11'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'username',
                type: 'string',
                required: true,
                description: 'The osu! username to set',
                options: ['N/A'],
                defaultValue: 'null'
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The osu! mode to set',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu'
            },
            {
                name: 'skin',
                type: 'string',
                required: false,
                description: 'The skin to set',
                options: ['N/A'],
                defaultValue: 'osu! default 2014'
            }
        ]
    },
    {
        name: 'osutop',
        description: 'Shows the top scores of a user',
        usage: 'osutop [user] [-page] [-(mode)] [-mapper] [-mods] [-reverse] [-(sort)]',
        slashusage: 'osutop [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed]',
        examples: [
            {
                text: 'PREFIXMSGosutop SaberStrike',
                descriptor: 'Shows SaberStrike\'s top osu! scores'
            },
            {
                text: 'PREFIXMSGosutop -p 3',
                descriptor: 'Shows your top 3 pages of osu! scores'
            },
            {
                text: 'PREFIXMSGosutop -mania',
                descriptor: 'Shows your top mania scores'
            },
            {
                text: 'PREFIXMSGosutop -fruits -mods hdhr',
                descriptor: 'Shows your top fruits scores with HDHR'
            },
            {
                text: '/osutop mods:HDHR sort:recent',
                descriptor: 'Shows your top scores with HDHR sorted by recent'
            }
        ],
        aliases: ['top'],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the scores of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                aliases: ['m']
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The sort order of the scores',
                options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
                defaultValue: 'pp'
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to reverse the sort order',
                options: ['true', 'false'],
                defaultValue: 'false'
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p']
            },
            {
                name: 'mapper',
                type: 'string',
                required: false,
                description: 'The mapper to filter the scores by',
                options: ['N/A'],
                defaultValue: 'null'
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to filter the scores by',
                options: mods,
                defaultValue: 'null'
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the scores',
                options: ['true', 'false'],
                defaultValue: 'false'
            }
        ]
    },
    {
        name: 'pinned',
        description: 'Shows the pinned scores of a user',
        usage: 'pinned [user] [-page] [-(mode)]',
        slashusage: 'pinned [user] [mode] [sort] [reverse] [page] [mapper] [mods]',
        examples: [
            {
                text: 'PREFIXMSGpinned SaberStrike',
                descriptor: 'Shows SaberStrike\'s pinned scores'
            },
            {
                text: 'PREFIXMSGpinned -p 3',
                descriptor: 'Shows your pinned scores on page 3'
            },
            {
                text: 'PREFIXMSGpinned -mania',
                descriptor: 'Shows your pinned mania scores'
            },
            {
                text: '/pinned mods:HDHR sort:recent',
                descriptor: 'Shows your pinned scores with HDHR sorted by recent'

            }
        ],
        aliases: [],
        options: [{
            name: 'user',
            type: 'string/integer/user mention',
            required: false,
            description: 'The user to show the scores of',
            options: ['N/A'],
            defaultValue: 'your osu! username'
        },
        {
            name: 'mode',
            type: 'string',
            required: false,
            description: 'The mode to show the scores in',
            options: ['osu', 'taiko', 'fruits', 'mania'],
            defaultValue: 'osu',
            aliases: ['m']
        },
        {
            name: 'sort',
            type: 'string',
            required: false,
            description: 'The sort order of the scores',
            options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
            defaultValue: 'pp'
        },
        {
            name: 'reverse',
            type: 'boolean',
            required: false,
            description: 'Whether to reverse the sort order',
            options: ['true', 'false'],
            defaultValue: 'false'
        },
        {
            name: 'page',
            type: 'integer',
            required: false,
            description: 'The page of scores to show',
            options: ['N/A'],
            defaultValue: '1',
            aliases: ['p']
        },
        {
            name: 'mapper',
            type: 'string',
            required: false,
            description: 'The mapper to filter the scores by',
            options: ['N/A'],
            defaultValue: 'null'
        },
        {
            name: 'mods',
            type: 'string',
            required: false,
            description: 'The mods to filter the scores by',
            options: mods,
            defaultValue: 'null'
        },
        {
            name: 'detailed',
            type: 'boolean',
            required: false,
            description: 'Whether to show detailed information about the scores',
            options: ['true', 'false'],
            defaultValue: 'false'
        }
        ]
    },
    {
        name: 'pp',
        description: 'Estimates the rank of a user from the pp given',
        usage: 'pp [value] [-(mode)]',
        slashusage: 'pp [value] [mode]',
        examples: [
            {
                text: 'PREFIXMSGpp 100000',
                descriptor: 'Estimates your rank with 100,000pp'
            },
            {
                text: 'PREFIXMSGpp 2999 -fruits',
                descriptor: 'Estimates your ctb/fruits rank with 2,999pp'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'value',
                type: 'integer',
                required: true,
                description: 'The pp to estimate the rank of',
                options: ['N/A'],
                defaultValue: 'N/A'
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to estimate the rank in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu'
            }
        ]
    },
    {
        name: 'rank',
        description: 'Estimates the performance points of a user from the rank given',
        usage: 'rank [value] [-(mode)]',
        slashusage: 'rank [value] [mode]',
        examples: [
            {
                text: 'PREFIXMSGrank 1',
                descriptor: 'Estimates your pp with rank 1'
            },
            {
                text: 'PREFIXMSGrank 1 -taiko',
                descriptor: 'Estimates your taiko pp with rank 1'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'value',
                type: 'integer',
                required: true,
                description: 'The rank to estimate the pp of',
                options: ['N/A'],
                defaultValue: 'N/A'
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu'
            }
        ]
    },
    {
        name: 'ranking',
        description: 'Displays the global leaderboards',
        usage: 'ranking [country] [-page][-(mode)]',
        slashusage: 'ranking [country] [mode] [page] [type] [spotlight]',
        examples: [
            {
                text: 'PREFIXMSGranking',
                descriptor: 'Shows the global leaderboards'
            },
            {
                text: '/ranking country:us mode:taiko',
                descriptor: 'Shows the taiko leaderboards for the US'
            },
            {
                text: '/ranking type:charts spotlight:227',
                descriptor: 'Shows the leaderboards for the 227th spotlight'
            }
        ],
        aliases: [],
        options: [{
            name: 'country',
            type: 'string',
            required: false,
            description: 'The country code of the country to use',
            options: ['N/A'],
            defaultValue: 'global'
        },
        {
            name: 'mode',
            type: 'string',
            required: false,
            description: 'The mode to show the scores in',
            options: ['osu', 'taiko', 'fruits', 'mania'],
            defaultValue: 'osu',
            aliases: ['m']
        },
        {
            name: 'page',
            type: 'integer',
            required: false,
            description: 'The page of scores to show',
            options: ['N/A'],
            defaultValue: '1',
            aliases: ['p']
        },
        {
            name: 'type',
            type: 'string',
            required: false,
            description: 'The type of leaderboard to show',
            options: ['performance', 'charts', 'score', 'country'],
            defaultValue: 'performance'
        },
        {
            name: 'spotlight',
            type: 'integer',
            required: false,
            description: 'The spotlight to show the scores of. Only works with type charts',
            options: ['N/A'],
            defaultValue: 'latest'
        }
        ]
    },
    {
        name: 'recent',
        description: 'Shows the recent score(s) of a user',
        usage: 'recent [user] [-page] [-list] [-(mode)]',
        slashusage: 'recent [user] [page] [mode] [list]',
        examples: [
            {
                text: 'PREFIXMSGrecent',
                descriptor: 'Shows your most recent score'
            },
            {
                text: 'PREFIXMSGr SaberStrike',
                descriptor: 'Shows the most recent score of SaberStrike'
            },
            {
                text: 'PREFIXMSGrs -p 2 -list',
                descriptor: 'Shows the second page of your recent scores in a list'
            },
            {
                text: '/recent list:true',
                descriptor: 'Shows your recent scores in a list'
            },
            {
                text: 'PREFIXMSGrl -mania',
                descriptor: 'Shows your recent mania scores in a list'
            },
            {
                text: 'PREFIXMSGrlm @SaberStrike',
                descriptor: 'Shows SaberStrike\'s recent mania scores in a list'
            },
            {
                text: 'PREFIXMSGrt -p 2',
                descriptor: 'Shows your second most recent taiko score'
            }
        ],
        aliases: ['rs', 'r', 'rt', 'rf', 'rm', 'rctb', 'rl', 'rlt', 'rlf', 'rlm', 'rlctb'],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the score(s) of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the score(s) in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                aliases: ['m']
            },
            {
                name: 'list',
                type: 'boolean',
                required: false,
                description: 'Whether to show multiple scores. If false, only the most recent score will be shown',
                options: ['true', 'false'],
                defaultValue: 'false',
                aliases: ['l']
            }
        ]
    },
    {
        name: 'scoreparse',
        description: 'Returns information about a score',
        usage: 'scoreparse [id] [mode]',
        slashusage: 'null',
        examples: [
            {
                text: 'PREFIXMSGscoreparse 1234567890',
                descriptor: 'Parses the osu! score with the id 1234567890'
            },
            {
                text: 'PREFIXMSGscore 1234567890 mania',
                descriptor: 'Parses the mania score with the id 1234567890'
            },
            {
                text: 'https://osu.ppy.sh/scores/osu/1234567890',
                descriptor: 'Parses the osu! score with the id 1234567890'
            },
        ],
        aliases: ['score', 'sp'],
        options: [
            {
                name: 'id',
                type: 'integer',
                required: true,
                description: 'The id of the score',
                options: ['N/A'],
                defaultValue: 'null'
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode of the score',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu'
            }
        ]
    },
    {
        name: 'scores',
        description: 'Shows the scores of a user on a beatmap',
        usage: 'scores [user] [id] [-page]',
        slashusage: 'scores [user] [id] [sort] [reverse] [page] [detailed]',
        examples: [
            {
                text: 'PREFIXMSGscores saberstrike',
                descriptor: 'Shows SaberStrike\'s scores on the most recent beatmap'
            },
            {
                text: 'PREFIXMSGc',
                descriptor: 'Shows your scores on the most recent beatmap'
            },
            {
                text: 'PREFIXMSGc 4204',
                descriptor: 'Shows your scores on the beatmap with the id 4204'
            }
        ],
        aliases: ['c'],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the scores of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            },
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The beatmap id to show the scores of',
                options: ['N/A'],
                defaultValue: 'The most recent map in the guild'
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The sort order of the scores',
                options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
                defaultValue: 'recent'
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to reverse the sort order',
                options: ['true', 'false'],
                defaultValue: 'false'
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1'
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the scores',
                options: ['true', 'false'],
                defaultValue: 'false'
            }
        ]
    },
    {
        name: 'simulate',
        description: 'Simulates a score on a beatmap',
        usage: 'simulate [id] +[mods] misses=[misses] acc=[accuracy] combo=[combo] n300=[n300] n100=[n100] n50=[n50] miss=[misses]',
        slashusage: 'simulate [id] [mods] [accuracy] [combo] [n300] [n100] [n50] [misses]',
        examples: [
            {
                text: 'PREFIXMSGsimulate +HDHR misses=0 acc=97.86',
                descriptor: 'Simulates a score on the most recent beatmap with HDHR, 0 misses, and 97.86% accuracy'
            }
        ],
        aliases: ['sim', 'simplay'],
        options: [
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The beatmap id to simulate the score on',
                options: ['N/A'],
                defaultValue: 'The most recent map in the guild'
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to simulate the score with',
                options: mods,
                defaultValue: 'none'
            },
            {
                name: 'accuracy',
                type: 'float',
                required: false,
                description: 'The accuracy to simulate the score with',
                options: ['0-100'],
                defaultValue: '100'
            },
            {
                name: 'combo',
                type: 'integer',
                required: false,
                description: 'The maximum combo to simulate the score with',
                options: ['N/A'],
                defaultValue: 'map max combo'
            },
            {
                name: 'n300',
                type: 'integer',
                required: false,
                description: 'The number of hit 300s to simulate the score with',
                options: ['N/A'],
                defaultValue: 'calculated from accuracy'
            },
            {
                name: 'n100',
                type: 'integer',
                required: false,
                description: 'The number of hit 100s to simulate the score with',
                options: ['N/A'],
                defaultValue: 'calculated from accuracy'
            },
            {
                name: 'n50',
                type: 'integer',
                required: false,
                description: 'The number of hit 50s to simulate the score with',
                options: ['N/A'],
                defaultValue: 'calculated from accuracy'
            },
            {
                name: 'misses',
                type: 'integer',
                required: false,
                description: 'The number of misses to simulate the score with',
                options: ['N/A'],
                defaultValue: '0'
            }
        ]
    },
    {
        name: 'trackadd',
        description: 'Adds a user to the tracklist',
        usage: 'trackadd [user]',
        slashusage: 'trackadd [user]',
        examples: [
            {
                text: 'PREFIXMSGtrackadd 15222484',
                descriptor: 'Adds the user with the id 15222484 to the tracklist'
            },
            {
                text: 'PREFIXMSGta SaberStrike',
                descriptor: 'Adds SaberStrike to the tracklist'
            }
        ],
        aliases: ['ta', 'track'],
        options: [
            {
                name: 'user',
                type: 'string',
                required: true,
                description: 'The user to add to the tracklist',
                options: ['N/A'],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'trackchannel',
        description: 'Sets the channel to send tracklist updates to',
        usage: 'trackchannel [channel]',
        slashusage: 'trackchannel [channel]',
        examples: [
            {
                text: 'PREFIXMSGtrackchannel #tracklist',
                descriptor: 'Sets the channel to send tracklist updates to #tracklist'
            },
            {
                text: 'PREFIXMSGtrackchannel 123456789012345678',
                descriptor: 'Sets the channel to send tracklist updates to the channel with the id 123456789012345678'
            }
        ],
        aliases: ['tc'],
        options: [
            {
                name: 'channel',
                type: 'channel mention',
                required: true,
                description: 'The channel to send tracklist updates to',
                options: ['N/A'],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'trackremove',
        description: 'Removes a user from the tracklist',
        usage: 'trackremove [user]',
        slashusage: 'trackremove [id]',
        examples: [
            {
                text: 'PREFIXMSGtrackremove 15222484',
                descriptor: 'Removes the user with the id 15222484 from the tracklist'
            },
            {
                text: 'PREFIXMSGtr SaberStrike',
                descriptor: 'Removes SaberStrike from the tracklist'
            }
        ],
        aliases: ['tr', 'trackrm', 'untrack'],
        options: [
            {
                name: 'user',
                type: 'string',
                required: true,
                description: 'The user to remove from the tracklist',
                options: ['N/A'],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'whatif',
        description: 'Shows user stats if you gain a certain amount of raw pp',
        usage: 'whatif [user] [pp]',
        slashusage: 'whatif [user] [pp]',
        examples: [
            {
                text: 'PREFIXMSGwhatif 1000',
                descriptor: 'Shows the user\'s stats if they achieved a 1000pp score'
            },
            {
                text: 'PREFIXMSGwhatif SaberStrike 300',
                descriptor: 'Shows SaberStrike\'s stats if they achieved a 300pp score'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the stats of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            },
            {
                name: 'pp',
                type: 'float',
                required: true,
                description: 'The amount of raw pp to gain',
                options: ['N/A'],
                defaultValue: '0'
            }
        ]
    }
]

const misccommands = [
    {
        name: '8ball',
        description: 'Returns a yes/no/maybe answer to a question',
        usage: '8ball ',
        slashusage: '8ball ',
        examples: [
            {
                text: 'PREFIXMSG8ball is this a good bot?',
                descriptor: 'Returns a yes/no/maybe answer to the question'
            }
        ],
        aliases: [],
        options: [],
    },
    {
        name: 'gif',
        description: 'Sends a gif',
        usage: 'gif [type]',
        slashusage: 'gif [type]',
        examples: [
            {
                text: '/gif type:cry about it',
                descriptor: 'Sends a random gif in the category "cry about it"'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'type',
                type: 'string',
                required: true,
                description: 'The type of gif to send',
                options: [],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'image',
        description: 'Sends an image',
        usage: 'image [query]',
        slashusage: 'image [query]',
        examples: [
            {
                text: 'PREFIXMSGimage cat',
                descriptor: 'Sends the first five results of a google image search for "cat"'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'query',
                type: 'string',
                required: true,
                description: 'The image to search for',
                options: [],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'poll',
        description: 'Creates a poll',
        usage: 'poll [question]',
        slashusage: 'poll [question] [options]',
        examples: [
            {
                text: 'PREFIXMSGpoll djkfhgfbdkgbkfhdjgdkgd',
                descriptor: 'Creates a poll with the question "djkfhgfbdkgbkfhdjgdkgd"'
            },
            {
                text: '/poll title:What is your favorite color? options:red+green+blue',
                descriptor: 'Creates a poll with the question "What is your favorite color?" and the options "red", "green", and "blue"'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'question',
                type: 'string',
                required: true,
                description: 'The question/title of the poll',
                options: [],
                defaultValue: 'N/A'
            },
            {
                name: 'options',
                type: 'string',
                required: false,
                description: 'The options for the poll',
                options: ['format: option1+option2+option3...'],
                defaultValue: 'yes+no'
            }
        ]
    },
    {
        name: 'roll',
        description: 'Rolls a random number',
        usage: 'roll [max] [min]',
        slashusage: 'roll [max] [min]',
        examples: [
            {
                text: 'PREFIXMSGroll',
                descriptor: 'Rolls a random number between 1 and 100'
            },
            {
                text: 'PREFIXMSGroll 100 50',
                descriptor: 'Rolls a random number between 50 and 100'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'max',
                type: 'integer',
                required: false,
                description: 'The maximum number to roll',
                options: ['N/A'],
                defaultValue: '100'
            },
            {
                name: 'min',
                type: 'integer',
                required: false,
                description: 'The minimum number to roll',
                options: ['N/A'],
                defaultValue: '1'
            }
        ]
    },
    {
        name: 'say',
        description: 'Sends a message',
        usage: 'say [message]',
        slashusage: 'say [message] [channel]',
        examples: [
            {
                text: 'PREFIXMSGsay hello',
                descriptor: 'Says "hello" in the current channel'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'message',
                type: 'string',
                required: true,
                description: 'The message to send',
                options: ['N/A'],
                defaultValue: 'N/A'
            },
            {
                name: 'channel',
                type: 'channel',
                required: false,
                description: 'The channel to send the message in',
                options: ['N/A'],
                defaultValue: 'current channel'
            }
        ]
    },
    {
        name: 'ytsearch',
        description: 'Searches youtube for a video',
        usage: 'ytsearch [query]',
        slashusage: 'ytsearch [query]',
        examples: [
            {
                text: 'PREFIXMSGytsearch never gonna give you up',
                descriptor: 'Searches youtube for "never gonna give you up"'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'query',
                type: 'string',
                required: true,
                description: 'The video to search for',
                options: ['N/A'],
                defaultValue: 'N/A'
            }
        ]
    }
]

const admincommands = [
    {
        name: 'checkperms',
        description: 'Checks the permissions of the user',
        usage: 'checkperms [user]',
        slashusage: 'checkperms [user]',
        examples: [
            {
                text: 'PREFIXMSGcheckperms @SSoB',
                descriptor: 'Checks the permissions of the user @SSoB'
            }
        ],
        aliases: ['perms'],
        options: [
            {
                name: 'user',
                type: 'integer/user mention',
                required: false,
                description: 'The user to check the permissions of',
                options: ['N/A'],
                defaultValue: 'your discord account'
            }
        ]
    },
    {
        name: 'debug',
        description: 'Returns the debug files for a command',
        usage: 'debug [command]',
        slashusage: 'debug [command]',
        examples: [],
        aliases: [],
        options: [
            {
                name: 'command',
                type: 'string',
                required: false,
                description: 'The command',
                options: [''],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'find',
        description: 'Finds a user/guild/channel/role/emoji in the database',
        usage: 'find [type] [id]',
        slashusage: 'find [type] [id]',
        examples: [
            {
                text: 'PREFIXMSGfind user 1234567890',
                descriptor: 'Finds the user with the id 1234567890'
            },
            {
                text: 'PREFIXMSGfind @SSoB',
                descriptor: 'Finds the user @SSoB'
            },
            {
                text: 'PREFIXMSGfind emoji 944181096868884481',
                descriptor: 'Finds the emoji with the id 944181096868884481'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'type',
                type: 'string',
                required: 'true (if id is not a mention)',
                description: 'The type of object to find',
                options: ['user', 'guild', 'channel', 'role', 'emoji'],
                defaultValue: 'N/A'
            },
            {
                name: 'id',
                type: 'integer/user mention/channel mention/role mention/emoji',
                required: true,
                description: 'The id of the object to find',
                options: ['N/A'],
                defaultValue: 'N/A'
            },
        ]
    },
    {
        name: 'leaveguild',
        description: 'Makes the bot leave a guild',
        usage: 'leaveguild [guild]',
        slashusage: 'leaveguild [guild]',
        examples: [
            {
                text: 'PREFIXMSGleaveguild 1234567890',
                descriptor: 'Makes the bot leave the guild with the id 1234567890'
            },
        ],
        aliases: ['leave'],
        options: [
            {
                name: 'guild',
                type: 'integer',
                required: false,
                description: 'The id of the guild to leave',
                options: ['N/A'],
                defaultValue: 'the guild the command was sent in'
            }
        ]
    },
    {
        name: 'prefix',
        description: 'Set\'s the prefix of the current server',
        usage: 'prefix [prefix]',
        slashusage: 'prefix [prefix]',
        examples: [
            {
                text: 'PREFIXMSGprefix !',
                descriptor: 'Sets the prefix to "!"'
            }
        ],
        aliases: [],
        options: [
            {
                name: 'prefix',
                type: 'string',
                required: true,
                description: 'The prefix to set',
                options: [],
                defaultValue: 'N/A'
            }
        ]
    },
    {
        name: 'servers',
        description: 'Shows the servers the bot is in',
        usage: 'servers',
        slashusage: 'servers',
        examples: [],
        aliases: [],
        options: []
    }
]