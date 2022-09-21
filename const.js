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
        usage: 'help [command]',
        slashusage: 'help [command]',
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

const osucommands = [
    {
        name: 'bws',
        description: 'Shows the badge weighted rank of a user',
        usage: 'bws [user]',
        slashusage: 'bws [user]',
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
        usage: 'compare [first] [second]',
        slashusage: 'compare [type] [first] [second]',
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
                defaultValue: 'user'
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
        usage: 'firsts [user]',
        slashusage: 'firsts [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed]',
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
        usage: 'maplb [id]',
        slashusage: 'maplb [id] [page] [mods]',
        examples: [
            'sbr-maplb 32345',
            '/maplb mods:HDHR'
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
        description: 'Shows the user\'s top plays without chokes',
        usage: 'nochokes [user]',
        slashusage: 'nochokes [user]',
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
        usage: 'osu [user]',
        slashusage: 'osu [user] [detailed] [mode]',
        aliases: ['o', 'profile', 'user'],
        examples: [
            'sbr-osu mrekk',
            '/osu detailed:true mode:taiko'
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
            }
        ]
    },
    {
        name: 'osuset',
        description: 'Sets your osu! username/mode/skin',
        usage: 'osuset [username]',
        slashusage: 'osuset [username] [mode] [skin]',
        examples: [
            'sbr-osuset SaberStrike',
            '/osuset username:SaberStrike mode:fruits skin:sbr v11'
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
        usage: 'osutop [user]',
        slashusage: 'osutop [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed]',
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
        usage: 'pinned [user]',
        slashusage: 'pinned [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed]',
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
        usage: 'ppifrank [value] [type]',
        slashusage: 'ppifrank [value] [type]',
        examples: [
            'sbr-ppifrank 20000',
            '/ppifrank 2000 rank'
        ],
        aliases: ['rankifpp'],
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
        usage: 'recent [user]',
        slashusage: 'recent [user] [page] [mode] [list]',
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
        name: 'scoreparse',
        description: 'Returns information about a score',
        usage: 'scoreparse [id] [mode]',
        slashusage: 'null',
        examples: [
            'sbr-scoreparse 1234567890',
            'sbr-score 1234567890 mania',
            'https://osu.ppy.sh/scores/osu/1234567890'
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
        usage: 'scores [user] [id]',
        slashusage: 'scores [user] [id] [sort] [reverse] [page] [detailed]',
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
        usage: 'simulate [id] +[mods] misses=[misses] acc=[accuracy] combo=[combo] n300=[n300] n100=[n100] n50=[n50] miss=[misses]',
        slashusage: 'simulate [id] [mods] [accuracy] [combo] [n300] [n100] [n50] [misses]',
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
        name: 'trackadd',
        description: 'Adds a user to the tracklist',
        usage: 'trackadd [id]',
        slashusage: 'trackadd [id]',
        examples: [
            'sbr-trackadd 15222484'
        ],
        aliases: ['ta', 'track'],
        options: [
            {
                name: 'id',
                type: 'integer',
                required: true,
                description: 'The user id to add to the tracklist',
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
            'sbr-trackchannel #tracklist'
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
        usage: 'trackremove [id]',
        slashusage: 'trackremove [id]',
        examples: [
            'sbr-trackremove 15222484'
        ],
        aliases: ['tr', 'trackrm', 'untrack'],
        options: [
            {
                name: 'id',
                type: 'integer',
                required: true,
                description: 'The user id to remove from the tracklist',
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
            'sbr-whatif 1000',
            'sbr-whatif SaberStrike 300'
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
            'sbr-8ball is this a good bot?'
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
            '/gif type:cry about it'
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
            'sbr-image cat',
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
        usage: 'roll [max] [min]',
        slashusage: 'roll [max] [min]',
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
        usage: 'say [message]',
        slashusage: 'say [message] [channel]',
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
        usage: 'ytsearch [query]',
        slashusage: 'ytsearch [query]',
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

const admincommands = [
    {
        name: 'checkperms',
        description: 'Checks the permissions of the user',
        usage: 'checkperms [user]',
        slashusage: 'checkperms [user]',
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
        usage: 'leaveguild [guild]',
        slashusage: 'leaveguild [guild]',
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
        name: 'prefix',
        description: 'Set\'s the prefix of the current server',
        usage: 'prefix [prefix]',
        slashusage: 'prefix [prefix]',
        examples: ['sbr-prefix !'],
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