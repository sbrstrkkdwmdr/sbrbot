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
                defaultValue: 'N/A',
                examples: ['k', 'from:kelvin'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: ['c', 'to:celsius'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'number',
                type: 'float',
                required: true,
                description: 'The number to convert',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: ['273.15', 'number:273.15'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: ['recent', 'command:osutop'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: ['8/2(2+2)', '2^32'],
                commandTypes: ['message']
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
                defaultValue: 'N/A',
                examples: ['type:pythag'],
                commandTypes: ['interaction']
            },
            {
                name: 'num1',
                type: 'float',
                required: 'true (if using slash command)',
                description: 'The first number',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: ['num1:4'],
                commandTypes: ['interaction']
            },
            {
                name: 'num2',
                type: 'float',
                required: 'true (sometimes)',
                description: 'The second number',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: ['num2:5'],
                commandTypes: ['interaction']
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
                    'format: [number][unit] or hh:mm:ss',
                    'units: s, m, h, d, w, y',
                ],
                defaultValue: '0s',
                examples: ['1h30m30s', '5:23:02'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'reminder',
                type: 'string',
                required: false,
                description: 'The reminder',
                options: ['N/A'],
                defaultValue: 'null',
                examples: ['this is a reminder', 'reminder:this is a reminder'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'sendinchannel',
                type: 'boolean',
                required: false,
                description: 'Whether to send the reminder in the channel or in a DM. Admin only',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['sendinchannel:true'],
                commandTypes: ['interaction']
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
                description: 'The timezone to show the time in (see here - https://stackoverflow.com/a/54500197)',
                options: ['Formatted as [region][city]'],
                defaultValue: 'UTC',
                examples: ['Australia/Melbourne', 'Europe/Warsaw'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'The user who ran the command',
                examples: ['DigitalHypno', 'fieryrage'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'user stats (top plays if using "common")',
                examples: ['type:top'],
                commandTypes: ['interaction']
            },
            {
                name: 'first',
                type: 'string',
                required: false,
                description: 'The first user to compare',
                options: ['N/A'],
                defaultValue: 'The user who ran the command',
                examples: ['SaberStrike', 'first:SaberStrike'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'second',
                type: 'string',
                required: false,
                description: 'The second user to compare',
                options: ['N/A'],
                defaultValue: 'most recent user fetched in the guild',
                examples: ['Soragaton', 'second:Soragaton'],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'firsts',
        description: 'Shows the #1 global scores of a user',
        usage: 'firsts [user] [-page] [-(mode)] [-parse]',
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
            },
            {
                text: 'PREFIXMSGfirsts -parse 3',
                descriptor: 'Returns your 3rd most recent first score'
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
                defaultValue: 'The user who ran the command',
                examples: ['mrekk', 'user:mrekk'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['taiko', 'mode:mania'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The sort order of the scores',
                options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
                defaultValue: 'pp',
                examples: ['sort:score', '-recent'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to reverse the sort order',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['reverse:true', '-reverse'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p'],
                examples: ['page:6', '-p 4'],
                commandTypes: ['message', 'interaction', 'button']
            },
            {
                name: 'mapper',
                type: 'string',
                required: false,
                description: 'The mapper to filter the scores by',
                options: ['N/A'],
                defaultValue: 'null',
                examples: ['mapper:Sotarks'],
                commandTypes: ['interaction']
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to filter the scores by',
                options: mods,
                defaultValue: 'null',
                examples: ['mods:HDHR'],
                commandTypes: ['interaction']
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the scores',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['detailed:true', '-detailed'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'parse',
                type: 'number',
                required: false,
                description: 'Parse the score with the specific index',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['-parse 5'],
                commandTypes: ['message']
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
                description: 'The user to get',
                options: ['N/A'],
                defaultValue: 'The user who ran the command',
                examples: ['mrekk', 'user:mrekk'],
                commandTypes: ['message', 'interaction']
            },
        ]
    },
    {
        name: 'lb',
        description: 'Shows the leaderboard of the current server',
        usage: 'lb',
        slashusage: 'lb',
        examples: [],
        aliases: [],
        options: [
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of users to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p'],
                examples: [''],
                commandTypes: ['button']
            }
        ]
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
            {
                text: 'https://osu.ppy.sh/beatmapsets?q=blue%20dragon%20blue%20dragon',
                descriptor: 'Returns the first result for "blue dragon blue dragon"'
            },
            {
                text: 'https://osu.ppy.sh/beatmapsets/326920#osu/725718 +HDHR',
                descriptor: 'Returns beatmap 725718 with HDHR'
            }
        ],
        aliases: ['m'],
        options: [
            {
                name: 'query',
                type: 'string',
                required: false,
                description: 'The map to search for',
                options: ['N/A'],
                defaultValue: 'null',
                examples: ['"kimi no shiranai monogatari"', 'query:big black blue dragon'],
                commandTypes: ['message', 'interaction', 'link']
            },
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The map ID to search for',
                options: ['N/A'],
                defaultValue: 'the most recent map in the guild',
                examples: ['4204', 'id:4204'],
                commandTypes: ['message', 'interaction', 'link']
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to calculate the map with',
                options: mods,
                defaultValue: 'none',
                examples: ['+HDHR', 'mods:HDDTHR'],
                commandTypes: ['message', 'interaction', 'link']
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the map',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['detailed:true'],
                commandTypes: ['message', 'interaction', 'button']
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
                defaultValue: 'the most recent map in the guild',
                examples: ['4204', 'id:4204'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of the leaderboard to show',
                options: ['N/A'],
                defaultValue: '1',
                examples: ['page:4'],
                commandTypes: ['message', 'interaction', 'button']
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to filter the leaderboard by',
                options: mods,
                defaultValue: 'none',
                examples: ['+HDHR', 'mods:EZFL'],
                commandTypes: ['message', 'interaction']
            },
        ]
    },
    {
        name: 'nochokes',
        description: 'Shows the user\'s top plays without misses',
        usage: 'nochokes [user] [-page] [-(mode)] [-parse]',
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
            },
            {
                text: 'PREFIXMSGnc -parse 2',
                descriptor: 'Returns your 2nd no miss top play'
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
                defaultValue: 'The user who ran the command',
                examples: ['mrekk', 'user:mrekk'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['taiko', 'mode:mania'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The sort order of the scores',
                options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
                defaultValue: 'pp',
                examples: ['sort:score', '-recent'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to reverse the sort order',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['reverse:true', '-reverse'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p'],
                examples: ['page:6', '-p 4'],
                commandTypes: ['message', 'interaction', 'button']
            },
            {
                name: 'mapper',
                type: 'string',
                required: false,
                description: 'The mapper to filter the scores by',
                options: ['N/A'],
                defaultValue: 'null',
                examples: ['mapper:Sotarks'],
                commandTypes: ['interaction']
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to filter the scores by',
                options: mods,
                defaultValue: 'null',
                examples: ['mods:HDHR'],
                commandTypes: ['interaction']
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the scores',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['detailed:true', '-detailed'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'parse',
                type: 'number',
                required: false,
                description: 'Parse the score with the specific index',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['-parse 5'],
                commandTypes: ['message']
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
                descriptor: 'Shows your taiko profile with extra details'
            },
            {
                text: 'PREFIXMSGosu -graph',
                descriptor: 'Shows a graph of your osu! rank and playcount'
            },
            {
                text: 'osu.ppy.sh/u/15222484/osu -d',
                descriptor: 'Shows SaberStrike\'s osu profile with extra details'
            }
        ],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the profile of',
                options: ['N/A'],
                defaultValue: 'The user who ran the command',
                examples: ['SaberStrike', 'user:15222484'],
                commandTypes: ['message', 'interaction', 'link']
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the user',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['-d', '-detailed', 'detailed:true'],
                commandTypes: ['message', 'interaction', 'button', 'link']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The gamemode to show the stats of',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'The user\'s default gamemode',
                examples: ['-taiko', 'mode:mania', '-ctb'],
                commandTypes: ['message', 'interaction', 'link']
            },
            {
                name: 'graph',
                type: 'boolean',
                required: false,
                description: 'Whether to show only user statistics graphs',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['-g', '-graph'],
                commandTypes: ['message']
            }
        ]
    },
    {
        name: 'osuset',
        description: 'Sets your osu! username/mode/skin',
        usage: 'osuset [username] [-(mode)] [-skin]',
        slashusage: 'osuset [username] [mode] [skin]',
        examples: [
            {
                text: 'PREFIXMSGosuset SaberStrike',
                descriptor: 'Sets your username to SaberStrike'
            },
            {
                text: '/osuset username:SaberStrike mode:fruits skin:sbr v11',
                descriptor: 'Sets your username to SaberStrike, mode to fruits, and skin to sbr v11'
            },
            {
                text: 'PREFIXMSGosuset SaberStrike -taiko -skin sbr v11',
                descriptor: 'Sets your username to SaberStrike, mode to taiko, and skin to sbr v11'
            },
            {
                text: 'PREFIXMSGsetmode ctb',
                descriptor: 'Sets your mode to fruits (catch the beat)'
            },
            {
                text: 'PREFIXMSGsetskin sbr v11',
                descriptor: 'Sets your skin to sbr v11'
            },
        ],
        aliases: ['setuser', 'set', 'setmode', 'setskin'],
        options: [
            {
                name: 'username',
                type: 'string',
                required: true,
                description: 'The osu! username to set',
                options: ['N/A'],
                defaultValue: 'null',
                examples: ['username:SaberStrike', 'SaberStrike'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The osu! mode to set',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['-taiko', '-ctb', 'mode:fruits'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'skin',
                type: 'string',
                required: false,
                description: 'The skin to set',
                options: ['N/A'],
                defaultValue: 'osu! default 2014',
                examples: ['-skin sbr v11', 'skin:rafis hddt'],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'osutop',
        description: 'Shows the top scores of a user',
        usage: 'osutop [user] [-page] [-(mode)] [-mapper] [-mods] [-reverse] [-(sort)] [-parse]',
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
            },
            {
                text: 'PREFIXMSGtop -parse 3',
                descriptor: 'Returns your 3rd personal best score'
            }
        ],
        aliases: [
            'top', 't', 'ot',
            'taikotop', 'toptaiko', 'tt',
            'ctbtop', 'fruitstop', 'catchtop', 'topctb', 'topfruits', 'topcatch', 'tc', 'tf', 'tctb',
            'maniatop', 'topmania', 'tm'
        ],
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the scores of',
                options: ['N/A'],
                defaultValue: 'The user who ran the command',
                examples: ['mrekk', 'user:mrekk'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['taiko', 'mode:mania'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The sort order of the scores',
                options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
                defaultValue: 'pp',
                examples: ['sort:score', '-recent'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to reverse the sort order',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['reverse:true', '-reverse'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p'],
                examples: ['page:6', '-p 4'],
                commandTypes: ['message', 'interaction', 'button']
            },
            {
                name: 'mapper',
                type: 'string',
                required: false,
                description: 'The mapper to filter the scores by',
                options: ['N/A'],
                defaultValue: 'null',
                examples: ['mapper:Sotarks'],
                commandTypes: ['interaction']
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to filter the scores by',
                options: mods,
                defaultValue: 'null',
                examples: ['mods:HDHR'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the scores',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['detailed:true', '-detailed'],
                commandTypes: ['message', 'interaction', 'button']
            },
            {
                name: 'parse',
                type: 'number',
                required: false,
                description: 'Parse the score with the specific index',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['-parse 5'],
                commandTypes: ['message']
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
        options: [
            {
                name: 'user',
                type: 'string/integer/user mention',
                required: false,
                description: 'The user to show the scores of',
                options: ['N/A'],
                defaultValue: 'The user who ran the command',
                examples: ['mrekk', 'user:mrekk'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['taiko', 'mode:mania'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The sort order of the scores',
                options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
                defaultValue: 'pp',
                examples: ['sort:score', '-recent'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to reverse the sort order',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['reverse:true', '-reverse'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p'],
                examples: ['page:6', '-p 4'],
                commandTypes: ['message', 'interaction', 'button']
            },
            {
                name: 'mapper',
                type: 'string',
                required: false,
                description: 'The mapper to filter the scores by',
                options: ['N/A'],
                defaultValue: 'null',
                examples: ['mapper:Sotarks'],
                commandTypes: ['interaction']
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to filter the scores by',
                options: mods,
                defaultValue: 'null',
                examples: ['mods:HDHR'],
                commandTypes: ['interaction']
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the scores',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['detailed:true', '-detailed'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'parse',
                type: 'number',
                required: false,
                description: 'Parse the score with the specific index',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['-parse 5'],
                commandTypes: ['message']
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
                defaultValue: 'N/A',
                examples: ['12000', 'value:1000'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to estimate the rank in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['mode:mania', '-ctb'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: ['value:5', '1'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['-fruits', 'mode:mania'],
                commandTypes: ['message', 'interaction']
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
            defaultValue: 'global',
            examples: ['AU', 'US', 'NZ'],
            commandTypes: ['message', 'interaction']
        },
        {
            name: 'mode',
            type: 'string',
            required: false,
            description: 'The mode to show the scores in',
            options: ['osu', 'taiko', 'fruits', 'mania'],
            defaultValue: 'osu',
            examples: ['-fruits', 'mode:mania'],
            commandTypes: ['message', 'interaction']
        },
        {
            name: 'page',
            type: 'integer',
            required: false,
            description: 'The page of scores to show',
            options: ['N/A'],
            defaultValue: '1',
            aliases: ['p'],
            examples: ['-p 4', 'page:3'],
            commandTypes: ['message', 'interaction', 'button']
        },
        {
            name: 'type',
            type: 'string',
            required: false,
            description: 'The type of leaderboard to show',
            options: ['performance', 'charts', 'score', 'country'],
            defaultValue: 'performance',
            examples: ['type:charts'],
            commandTypes: ['message', 'interaction']
        },
        {
            name: 'spotlight',
            type: 'integer',
            required: false,
            description: 'The spotlight to show the scores of. Only works with type charts',
            options: ['N/A'],
            defaultValue: 'latest',
            examples: ['spotlight:227'],
            commandTypes: ['message', 'interaction']
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
                defaultValue: 'The user who ran the command',
                examples: ['SaberStrike', 'user:SaberStrike'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p'],
                examples: ['-p 2', 'page:2'],
                commandTypes: ['message', 'interaction', 'button']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the score(s) in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['-taiko', 'mode:fruits'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'list',
                type: 'boolean',
                required: false,
                description: 'Whether to show multiple scores. If false, only the most recent score will be shown',
                options: ['true', 'false'],
                defaultValue: 'false',
                aliases: ['l'],
                examples: ['-l', 'list:true'],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'saved',
        description: 'Shows a user\'s saved settings',
        usage: 'saved [user]',
        slashusage: 'saved [user]',
        examples: [
            {
                text: 'PREFIXMSGsaved @SaberStrike',
                descriptor: 'Shows SaberStrike\'s saved settings'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'user',
                type: 'user mention',
                required: false,
                description: 'The user to show the saved settings of',
                options: ['N/A'],
                defaultValue: 'The user who ran the command',
                examples: ['@SaberStrike'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'null',
                examples: ['id:727'],
                commandTypes: ['message', 'interaction', 'link']
            },
            {
                name: 'mode',
                type: 'string',
                required: 'false if message command, true if link',
                description: 'The mode of the score',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['mode:osu'],
                commandTypes: ['message', 'interaction', 'link']
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
            },
            {
                text: 'PREFIXMSGscores -parse 5',
                descriptor: 'Returns your fifth most recent score on the most recent beatmap'
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
                defaultValue: 'The user who ran the command',
                examples: ['mrekk', 'user:mrekk'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['taiko', 'mode:mania'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The sort order of the scores',
                options: ['pp', 'score', 'recent', 'accuracy', 'combo', 'miss count', 'rank'],
                defaultValue: 'pp',
                examples: ['sort:score', '-recent'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to reverse the sort order',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['reverse:true', '-reverse'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of scores to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p'],
                examples: ['page:6', '-p 4'],
                commandTypes: ['message', 'interaction', 'button']
            },
            {
                name: 'parse',
                type: 'number',
                required: false,
                description: 'Parse the score with the specific index',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['-parse 5'],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'simulate',
        description: 'Simulates a score on a beatmap',
        usage: 'simulate [id] +[mods] -acc [accuracy] -combo [combo] -n300 [n300] -n100 [n100] -n50 [n50] -miss [misses]',
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
                defaultValue: 'The most recent map in the guild',
                examples: ['4204', 'id:4204'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: 'The mods to simulate the score with',
                options: mods,
                defaultValue: 'none',
                examples: ['+HDDT', 'mods:HDDT'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'accuracy',
                type: 'float',
                required: false,
                description: 'The accuracy to simulate the score with',
                options: ['0-100'],
                defaultValue: '100',
                examples: ['acc=98.79'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'combo',
                type: 'integer',
                required: false,
                description: 'The maximum combo to simulate the score with',
                options: ['N/A'],
                defaultValue: 'map max combo',
                examples: ['combo=999'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'n300',
                type: 'integer',
                required: false,
                description: 'The number of hit 300s to simulate the score with',
                options: ['N/A'],
                defaultValue: 'calculated from accuracy',
                examples: ['n300=1200'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'n100',
                type: 'integer',
                required: false,
                description: 'The number of hit 100s to simulate the score with',
                options: ['N/A'],
                defaultValue: 'calculated from accuracy',
                examples: ['n100=12'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'n50',
                type: 'integer',
                required: false,
                description: 'The number of hit 50s to simulate the score with',
                options: ['N/A'],
                defaultValue: 'calculated from accuracy',
                examples: ['n50=2'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'misses',
                type: 'integer',
                required: false,
                description: 'The number of misses to simulate the score with',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['miss=2'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: ['SaberStrike', 'user:SaberStrike'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: ['#trackchannel', '727'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: ['SaberStrike'],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'userbeatmaps',
        description: 'Shows a user\'s beatmaps (favourites/ranked/pending/graveyard/loved)',
        usage: 'userbeatmaps [user] [-(type)] [-reverse] [-page]',
        slashusage: 'userbeatmaps [user] [type] [reverse] [page] [sort]',
        examples: [
            {
                text: 'PREFIXMSGubm sotarks -p 4 -ranked',
                descriptor: 'Shows sotarks\'s ranked beatmaps on page 4'
            },
            {
                text: '/userbeatmaps user:Mismagius type:Loved reverse:true page:2 sort:Title',
                descriptor: 'Shows Mismagius\'s loved beatmaps on page 2, sorted by title in reverse'
            }
        ],
        aliases: ['ub', 'userb', 'ubm', 'um', 'usermaps'],
        options: [{
            name: 'user',
            type: 'string/integer/user mention',
            required: false,
            description: 'The user to show the beatmaps of',
            options: ['N/A'],
            defaultValue: 'The user who ran the command',
            examples: ['Sotarks', 'user:Mismagius'],
            commandTypes: ['message', 'interaction']
        },
        {
            name: 'type',
            type: 'string',
            required: false,
            description: 'The type of beatmaps to show',
            options: ['Favourites', 'Ranked', 'Pending', 'Graveyard', 'Loved'],
            defaultValue: 'Favourites',
            examples: ['Ranked', 'type:Loved'],
            commandTypes: ['message', 'interaction']
        },
        {
            name: 'reverse',
            type: 'boolean',
            required: false,
            description: 'Whether to sort the beatmaps in reverse',
            options: ['true', 'false'],
            defaultValue: 'false',
            examples: ['-reverse', 'reverse:true'],
            commandTypes: ['message', 'interaction']
        },
        {
            name: 'page',
            type: 'integer',
            required: false,
            description: 'The page of beatmaps to show',
            options: ['N/A'],
            defaultValue: '1',
            examples: ['page:3', '-p 4'],
            commandTypes: ['message', 'interaction', 'button']
        },
        {
            name: 'sort',
            type: 'string',
            required: false,
            description: 'The way to sort the beatmaps',
            options: ['Title', 'Artist', 'Difficulty', 'Status', 'Fails', 'Plays', 'Date Added', 'Favourites', 'BPM', 'CS', 'AR', 'OD', 'HP', 'Length'],
            defaultValue: 'Date Added',
            examples: ['sort:title'],
            commandTypes: ['message', 'interaction']
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
                defaultValue: 'The user who ran the command',
                examples: ['SaberStrike', 'user:SaberStrike'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'pp',
                type: 'float',
                required: true,
                description: 'The amount of raw pp to gain',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['72700', 'pp:72700'],
                commandTypes: ['message', 'interaction']
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
        aliases: ['ask'],
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
                defaultValue: 'N/A',
                examples: [''],
                commandTypes: ['message', 'interaction']
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
        aliases: ['imagesearch'],
        options: [
            {
                name: 'query',
                type: 'string',
                required: true,
                description: 'The image to search for',
                options: [],
                defaultValue: 'N/A',
                examples: ['osus', 'query:osus'],
                commandTypes: ['message', 'interaction']
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
                text: '/poll title:What is your favorite colour? options:red+green+blue',
                descriptor: 'Creates a poll with the question "What is your favorite colour?" and the options "red", "green", and "blue"'
            }
        ],
        aliases: ['vote'],
        options: [
            {
                name: 'question',
                type: 'string',
                required: true,
                description: 'The question/title of the poll',
                options: [],
                defaultValue: 'N/A',
                examples: ['question:what\'s your favourite colour?'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'options',
                type: 'string',
                required: false,
                description: 'The options for the poll',
                options: ['format: option1+option2+option3...'],
                defaultValue: 'yes+no',
                examples: ['red+green+blue'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: '100',
                examples: ['345', 'max:234'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'min',
                type: 'integer',
                required: false,
                description: 'The minimum number to roll',
                options: ['N/A'],
                defaultValue: '1',
                examples: ['12', 'min:34'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: [''],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'channel',
                type: 'channel',
                required: false,
                description: 'The channel to send the message in',
                options: ['N/A'],
                defaultValue: 'current channel',
                examples: [''],
                commandTypes: ['message', 'interaction']
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
        aliases: ['yt'],
        options: [
            {
                name: 'query',
                type: 'string',
                required: true,
                description: 'The video to search for',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: ['osus', 'query:osus'],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'The user who ran the command',
                examples: [''],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: [''],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'id',
                type: 'integer/user mention/channel mention/role mention/emoji',
                required: true,
                description: 'The id of the object to find',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: [''],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'the guild the command was sent in',
                examples: [''],
                commandTypes: ['message', 'interaction']
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
                defaultValue: 'N/A',
                examples: ['!'],
                commandTypes: ['message', 'interaction']
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