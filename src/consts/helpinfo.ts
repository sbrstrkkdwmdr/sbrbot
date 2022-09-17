//just a document for the help command
type commandInfo = {
    name: string,
    description: string,
    usage?: string,
    slashusage?: string,
    options: { name: string, description: string }[],
    aliases?: string
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

const cmds = [
    {
        name: 'convert',
        description: 'Converts a number from one unit to another',
        usage: 'sbr-convert [from] [to] [number]',
        slashusage: '/convert [from] [to] [number]',
        examples: [
            'sbr-convert km mi 10',
            'sbr-convert k c 273.15',
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
        usage: 'sbr-help [command]',
        slashusage: '/help [command]',
        examples: [
            'sbr-help',
            'sbr-help convert',
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
        usage: 'sbr-info',
        slashusage: 'null',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'math',
        description: 'Solves a math problem',
        usage: 'sbr-math [problem]',
        slashusage: '/math [type] [num1] [num2]',
        examples: [
            'sbr-math 2+2',
            '/math type:pythag num1:3 num2:4',
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
        usage: 'sbr-ping',
        slashusage: '/ping',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'remind',
        description: 'Sets a reminder',
        usage: 'sbr-reminder [time] [reminder]',
        slashusage: '/reminder [time] [reminder] [sendinchannel]',
        examples: [
            'sbr-remind 1h30m30s reminder',
            'sbr-remind 2:05 fc'
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
        usage: 'sbr-stats',
        slashusage: 'null',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'time',
        description: 'Shows the current time in a specific timezone as well as UTC and the bot\'s timezone',
        usage: 'sbr-time [timezone]',
        slashusage: '/time [timezone]',
        examples: [
            'sbr-time',
            'sbr-time Australia/Melbourne'
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

const osucmds = [
    {
        name: 'bws',
        description: 'Shows the badge weighted rank of a user',
        usage: 'sbr-bws [user]',
        slashusage: '/bws [user]',
        examples: [
            'sbr-bws',
            'sbr-bws peppy',
            'sbr-bws DigitalHypno'
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
        usage: 'sbr-compare [first] [second]',
        slashusage: '/compare [type] [first] [second]',
        examples: [
            'sbr-compare',
            'sbr-compare peppy SaberStrike',
            '/compare type:score'
        ],
        aliases: [],
        options: [
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'The type of comparison',
                options: [
                    'score', 'user', 'top plays'
                ],
                default: 'user'
            },
            {
                name: 'first',
                type: 'string',
                required: false,
                description: 'The first user to compare',
                options: ['N/A'],
                defaultValue: 'your osu! username/most recent play'
            },
            {
                name: 'second',
                type: 'string',
                required: false,
                description: 'The second user to compare',
                options: ['N/A'],
                defaultValue: 'your osu! username/the most recent play in the guild'
            }
        ]
    },
    {
        name: 'firsts',
        description: 'Shows the #1 global scores of a user',
        usage: 'sbr-firsts [user]',
        slashusage: '/firsts [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed]',
        examples: [
            'sbr-firsts mrekk',
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
                defaultValue: 'osu'
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
        name: 'lb',
        description: 'Shows the leaderboard of the current server',
        usage: 'sbr-lb',
        slashusage: '/lb',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'map',
        description: 'Shows information about a beatmap',
        usage: 'sbr-map "query" [id] +[mods]',
        slashusage: '/map [query] [id] [mods] [detailed]',
        examples: [
            'sbr-map "kimi no shiranai monogatari"',
            'sbr-map 3013912 +HDHR'
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
        usage: 'sbr-maplb [id]',
        slashusage: '/maplb [id] [page] [mods]',
        examples: [],
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
        description: 'Shows the user\'s top plays without chokes',
        usage: 'sbr-nochokes [user]',
        slashusage: '/nochokes [user]',
        examples: [
            'sbr-nochokes SaberStrike'
        ],
        aliases: ['nc'],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the plays of',
                options: ['N/A'],
                defaultValue: 'your osu! username'
            }
        ]
    },
    {
        name: 'osu',
        description: 'Shows information about a user\'s osu! profile',
        usage: 'sbr-osu [user]',
        slashusage: '/osu [user] [detailed]',
        aliases: ['o', 'profile'],
        examples: [],
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
            }
        ]
    },
    {
        name: 'osuset',
        description: 'Sets your osu! username/mode/skin',
        usage: 'sbr-osuset [username]',
        slashusage: '/osuset [username] [mode] [skin]',
        examples: [],
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
        usage: 'sbr-osutop [user]',
        slashusage: '/osutop [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed]',
        examples: [
            'sbr-osutop',
            '/osutop sort:recent'
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
                defaultValue: 'osu'
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
                defaultValue: '1'
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
        usage: 'sbr-pinned [user]',
        slashusage: '/pinned [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed]',
        examples: [
            'sbr-pinned mrekk',
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
                defaultValue: 'osu'
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
        name: 'ppifrank',
        description: 'Shows the total pp if you are at a certain rank and vice versa',
        usage: 'sbr-ppifrank [value] [type]',
        slashusage: '/ppifrank [value] [type]',
        examples: [],
        aliases: [],
        options: [
            {
                name: 'value',
                type: 'integer',
                required: true,
                description: 'The value to use',
                options: ['N/A'],
                defaultValue: 'null'
            },
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'The type of value',
                options: ['rank', 'pp'],
                defaultValue: 'pp'
            }
        ]
    },
    {
        name: 'recent',
        description: 'Shows the recent score(s) of a user',
        usage: 'sbr-recent [user]',
        slashusage: '/recent [user] [page] [mode] [list]',
        examples: [
            'sbr-recent',
            'sbr-rs',
            '/recent list'
        ],
        aliases: ['rs', 'r'],
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
                defaultValue: '1'
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the score(s) in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu'
            },
            {
                name: 'list',
                type: 'boolean',
                required: false,
                description: 'Whether to show multiple scores. If false, only the most recent score will be shown',
                options: ['true', 'false'],
                defaultValue: 'false'
            }
        ]
    },
    {
        name: 'scores',
        description: 'Shows the scores of a user on a beatmap',
        usage: 'sbr-scores [user] [id]',
        slashusage: '/scores [user] [id] [sort] [reverse] [page] [detailed]',
        examples: [
            'sbr-scores saberstrike',
            'sbr-c'
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
        usage: 'sbr-simulate [id] +[mods] misses=[misses] acc=[accuracy] combo=[combo] n300=[n300] n100=[n100] n50=[n50] miss=[misses]',
        slashusage: '/simulate [id] [mods] [accuracy] [combo] [n300] [n100] [n50] [misses]',
        examples: [
            'sbr-simulate +HDHR misses=0 acc=97.86'
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
        name: 'whatif',
        description: 'Shows user stats if you gain a certain amount of raw pp',
        usage: 'sbr-whatif [user] [pp]',
        slashusage: '/whatif [user] [pp]',
        examples: [
            'sbr-whatif 1000'
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

const othercmds = [
    {
        name: '8ball',
        description: 'Returns a yes/no/maybe answer to a question',
        usage: 'sbr-8ball ',
        slashusage: '/8ball ',
        examples: [
            'sbr-8ball is this a good bot?'
        ],
        aliases: [],
        options: [],
    },
    {
        name: 'gif',
        description: 'Sends a gif',
        usage: 'sbr-gif [type]',
        slashusage: '/gif [type]',
        examples: [],
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
        usage: 'sbr-image [query]',
        slashusage: '/image [query]',
        examples: [],
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
        usage: 'sbr-poll [question]',
        slashusage: '/poll [question] [options]',
        examples: [
            'sbr-poll djkfhgfbdkgbkfhdjgdkgd',
            '/poll title:What is your favorite color? options:red+green+blue'
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
        usage: 'sbr-roll [max] [min]',
        slashusage: '/roll [max] [min]',
        examples: [
            'sbr-roll',
            'sbr-roll 100 50'
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
        usage: 'sbr-say [message]',
        slashusage: '/say [message] [channel]',
        examples: [
            'sbr-say hello',
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
        usage: 'sbr-ytsearch [query]',
        slashusage: '/ytsearch [query]',
        examples: [
            'sbr-ytsearch never gonna give you up'
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

const admincmds = [
    {
        name: 'checkperms',
        description: 'Checks the permissions of the user',
        usage: 'sbr-checkperms [user]',
        slashusage: '/checkperms [user]',
        examples: [
            'sbr-checkperms @SSoB'
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
        name: 'find',
        description: 'Finds a user/guild/channel/role/emoji in the database',
        usage: 'sbr-find [type] [id]',
        slashusage: '/find [type] [id]',
        examples: [
            'sbr-find user 1234567890',
            'sbr-find @SSoB'
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
        usage: 'sbr-leaveguild [guild]',
        slashusage: '/leaveguild [guild]',
        examples: [
            'sbr-leaveguild 1234567890',
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
        name: 'servers',
        description: 'Shows the servers the bot is in',
        usage: 'sbr-servers',
        slashusage: '/servers',
        examples: [],
        aliases: [],
        options: []
    }
]
export { cmds, othercmds, osucmds, admincmds }

