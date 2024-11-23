import * as bottypes from '../types/bot.js';

import * as buttonsObjs from './buttons.js';

const mods = 'See [here](https://sbrstrkkdwmdr.github.io/sbrbot/commandtypes.html#mods)';
const scoreListString =
    `Mods can be specified with +[mods], -mx [exact mods] or -me [exclude mods]
The arguments \`pp\`, \`score\`, \`acc\`, \`bpm\` and \`miss\` use the following format:
\`-key value\` to filter by that exact value (ie. -bpm 220)
\`-key >value\` to filter scores below value (ie. -pp >500)
\`-key <value\` to filter scores above value (ie. -acc <90)
\`-key min..max\` to filter scores between min and max (ie. -miss 1..3)
The \`sort\` arg can be specified using -value (ie -recent)
You can also show a single score by using \`-parse <id>\` (ie. -parse 5)
`;

/**
 * <> is required
 * [] is optional
 */

const user: bottypes.commandInfoOption = {
    name: 'user',
    type: 'string/integer/user mention',
    required: false,
    description: 'The user to show',

    defaultValue: 'The user who ran the command',
};
const mode: bottypes.commandInfoOption = {
    name: 'mode',
    type: 'string',
    required: false,
    description: 'The mode to use',
    options: ['osu', 'taiko', 'fruits', 'mania'],
    defaultValue: 'osu',
};
const userTrack: bottypes.commandInfoOption = {
    name: 'user',
    type: 'string',
    required: true,
    description: 'The user to use',

    defaultValue: 'N/A',
};
const userAdmin: bottypes.commandInfoOption = {
    name: 'user',
    type: 'integer/user mention',
    required: false,
    description: 'The user to use',

    defaultValue: 'The user who ran the command',
};

const scoreListCommandOptions: bottypes.commandInfoOption[] = [
    user, mode,
    {
        name: 'sort',
        type: 'string',
        required: false,
        description: 'The sort order of the scores',
        options: ['pp', 'score', 'recent', 'acc', 'combo', 'miss', 'rank'],
        defaultValue: 'pp',
    },
    {
        name: 'reverse',
        type: 'boolean',
        required: false,
        description: 'Whether to reverse the sort order',
        options: ['true', 'false'],
        defaultValue: 'false',
    },
    {
        name: 'page',
        type: 'integer',
        required: false,
        description: 'The page of scores to show',

        defaultValue: '1',
    },
    {
        name: 'mapper',
        type: 'string',
        required: false,
        description: 'The mapper to filter the scores by',

        defaultValue: 'null',
    },
    {
        name: 'mods',
        type: 'string',
        required: false,
        description: `Filter scores including these mods. ${mods}`,
        options: ['+(mods)', '-mods (mods)'],
        defaultValue: 'null',
    },
    {
        name: 'exact mods',
        type: 'string',
        required: false,
        description: `Filter scores with these exact mods. ${mods}`,

        defaultValue: 'null',
    },
    {
        name: 'exclude mods',
        type: 'string',
        required: false,
        description: `Filter scores to exclude these mods. ${mods}`,

        defaultValue: 'null',
    },
    {
        name: 'detailed',
        type: 'integer',
        required: false,
        description: 'How much information to show about the scores. 0 = less details, 2 = more details',
        options: ['-c', '-d',],
        defaultValue: '1',
    },
    {
        name: 'parse',
        type: 'integer',
        required: false,
        description: 'Parse the score with the specific index',

        defaultValue: '0',
    },
    {
        name: 'filter',
        type: 'string',
        required: false,
        description: 'Filters all scores to only show maps with the specified string',

        defaultValue: 'null',
    },
    {
        name: 'grade',
        type: 'string',
        required: false,
        description: 'Filters all scores to only show scores matching the given grade/rank',
        options: ['XH', 'SSH', 'X', 'SS', 'SH', 'S', 'A', 'B', 'C', 'D', 'F'],
        defaultValue: 'null',
    },
    {
        name: 'pp',
        type: 'float/range',
        required: false,
        description: 'Filters scores to have more/less pp than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
    },
    {
        name: 'score',
        type: 'int/range',
        required: false,
        description: 'Filters scores to have more/less score than this value',
        options: ['>number', '<number', 'min..max', 'number'],
        defaultValue: 'null',
    },
    {
        name: 'acc',
        type: 'float/range',
        required: false,
        description: 'Filters scores to have more/less accuracy than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
    },
    {
        name: 'combo',
        type: 'integer/range',
        required: false,
        description: 'Filters scores to have more/less maximum combo than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
    },
    {
        name: 'miss',
        type: 'integer/range',
        required: false,
        description: 'Filters scores to have more/less/equal misses than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
    },
    {
        name: 'bpm',
        type: 'float/range',
        required: false,
        description: 'Filters scores to have more/less/equal bpm than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
    },
];


const cmds: bottypes.commandInfo[] = [
    {
        name: 'changelog',
        description: 'Displays the changes for the current version or version requested.',
        usage: 'changelog [version]',
        examples: [
            {
                text: 'PREFIXMSGchangelog 0.4.0',
                description: 'Returns the changelog for version 0.4.0'
            },
            {
                text: 'PREFIXMSGchangelog first',
                description: 'Returns the changelog for the first version'
            },
            {
                text: 'PREFIXMSGchangelog pending',
                description: 'Returns the changelog for the upcoming version'
            },
            {
                text: 'PREFIXMSGversions',
                description: 'Returns a list of all versions'
            },
        ],
        aliases: ['clog', 'changes', 'versions'],
        args: [
            {
                name: 'version',
                type: 'string',
                required: false,
                description: 'The version',
                options: ['formatted as major.minor.patch (`0.4.1`) or `first`, `second` etc. `pending` shows upcoming changes'],
                defaultValue: 'latest',
            },
        ]
    },
    {
        name: 'convert',
        description: 'Converts a number from one unit/base to another.',
        usage: 'convert [from] [to] [number]',
        examples: [
            {
                text: 'PREFIXMSGconvert kilometre mi 10',
                description: 'Converts 10 kilometres to miles'
            },
            {
                text: 'PREFIXMSGconvert k c 273.15',
                description: 'Converts 273.15 kelvin to celsius'
            },
        ],
        aliases: ['conv'],
        args: [
            {
                name: 'from',
                type: 'string',
                required: true,
                description: 'The unit to convert from',

                defaultValue: 'N/A',
            },
            {
                name: 'to',
                type: 'string',
                required: true,
                description: 'The unit to convert to. see [here](https://sbrstrkkdwmdr.github.io/sbrbot/commandtypes.html#conv) for units',
                options: ['help', 'SI units',],
                defaultValue: 'N/A',
            },
            {
                name: 'number',
                type: 'float',
                required: true,
                description: 'The number to convert',

                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'country',
        description: 'Displays information for a given country.',
        usage: '[-type] <search>',
        aliases: [],
        examples: [
            {
                text: 'PREFIXMSGcountry australia',
                description: 'Shows information for Australia'
            },
            {
                text: 'PREFIXMSGcountry -code DE',
                description: 'Shows information for Germany'
            },
        ],

        args: [
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'What param to search with',
                options: ['name', 'fullname', 'code', 'codes', 'demonym', 'capital', 'translation'],
                defaultValue: 'name',
            },
            {
                name: 'search',
                type: 'string',
                required: false,
                description: 'The country to search for',

                defaultValue: 'N/A',
            },
        ]
    },
    {
        name: 'help',
        description: 'Displays useful information about commands.',
        usage: 'help [command]',
        examples: [
            {
                text: 'PREFIXMSGhelp',
                description: 'Shows the general help page'
            },
            {
                text: 'PREFIXMSGhelp convert',
                description: 'Shows information about the convert command'
            },
            {
                text: '/help recent',
                description: 'Shows information about the recent command'
            },
            {
                text: 'PREFIXMSGhelp categoryosu',
                description: 'Lists all commands in the osu category'
            },
            {
                text: 'PREFIXMSGhelp list',
                description: 'Lists all available commands'
            }
        ],
        aliases: ['commands', 'list', 'command', 'h'],
        args: [
            {
                name: 'command',
                type: 'string',
                required: false,
                description: 'The command/category to get information about. Categories are always prefixed with `categoryX`.',
                options: ['list', 'category(category)', '(command)'],
                defaultValue: 'N/A',
            },
        ]
    },
    {
        name: 'info',
        description: 'Shows information about the bot.',
        usage: 'info [arg]',
        aliases: ['i', '[arg]'],
        args: [
            {
                name: 'arg',
                type: 'string',
                required: false,
                description: 'Return just that specific value',
                options: ['uptime', 'version', 'server', 'website', 'timezone', 'source'],
                defaultValue: 'null',
            },
        ]
    },
    {
        name: 'invite',
        description: 'Sends the bot\'s public invite.',
        usage: 'invite',
        aliases: [],
    },
    {
        name: 'math',
        description: 'Solves a math problem.',
        usage: 'math <problem>',
        aliases: [],
        examples: [
            {
                text: 'PREFIXMSGmath 2+2',
                description: 'Solves 2+2'
            },
            {
                text: '/math type:pythag num1:3 num2:4',
                description: 'Solves the pythagorean theorem with a=3 and b=4'
            },
        ],

        args: [
            {
                name: 'problem',
                type: 'string',
                required: 'true (if using message command)',
                description: 'The math problem to solve',
                options: [
                    `Supports:
integers (0-9), floats/decimals (.5, 1.34), negatives (-727), exponential notation (6.022e+23)
operators: *, /, +, -, (, )
`,
                ],
                defaultValue: 'N/A',
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
            },
            {
                name: 'num1',
                type: 'float',
                required: 'true (if using slash command)',
                description: 'The first number',
                defaultValue: 'N/A',
            },
            {
                name: 'num2',
                type: 'float',
                required: 'true (sometimes)',
                description: 'The second number',

                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'ping',
        description: 'Pings the bot and returns the latency.',
        usage: 'ping',
        aliases: [],
    },
    {
        name: 'remind',
        description: 'Sets a reminder. Leave all args blank or use the reminders alias to return a list of reminders',
        usage: 'remind [time] [reminder]',
        examples: [
            {
                text: 'PREFIXMSGremind',
                description: 'Returns a list of reminders.'
            },
            {
                text: 'PREFIXMSGremind 1h30m30s reminder',
                description: 'Sets a reminder for 1 hour, 30 minutes, and 30 seconds'
            },
            {
                text: 'PREFIXMSGremind 2:05 fc',
                description: 'Sets a reminder for 2 minutes and 5 seconds'
            },
            {
                text: '/remind time:1h30m30s reminder:reminder sendinchannel:true',
                description: 'Sets a reminder for 1 hour, 30 minutes, and 30 seconds and sends it in the channel'
            }
        ],
        aliases: ['reminders', 'reminder'],
        args: [
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
            },
            {
                name: 'reminder',
                type: 'string',
                required: false,
                description: 'The reminder',

                defaultValue: 'null',
            },
            {
                name: 'sendinchannel',
                type: 'boolean',
                required: false,
                description: 'Whether to send the reminder in the channel or in a DM. Admin only',
                options: ['true', 'false'],
                defaultValue: 'false',
            }
        ]
    },
    {
        name: 'stats',
        description: 'Shows the bot\'s statistics.',
        usage: 'stats',
        aliases: [],
    },
    {
        name: 'time',
        description: 'Shows the current time in a specific timezone.',
        usage: 'time [timezone] [-showutc]',
        examples: [
            {
                text: 'PREFIXMSGtime',
                description: 'Shows the user\'s current time. If unset, it displays GMT.'
            },

            {
                text: 'PREFIXMSGtime AEST',
                description: 'Shows the current time in AEST (UTC+10, Australian Eastern Standard Time)'
            },
        ],
        aliases: ['tz'],
        args: [
            {
                name: 'timezone',
                type: 'string',
                required: false,
                description: 'The timezone to show the time in. See [here](https://github.com/sbrstrkkdwmdr/sbrbot/blob/main/src/consts/timezones.ts)',
                options: ['Formatted as (city), UTC(+/-)(hours), country name, country endonym, country ISO codes (eg AU), or abbreviations such as AEST, PST etc.'],
                defaultValue: 'UTC',
            },
            {
                name: 'showutc',
                type: 'boolean',
                required: false,
                description: 'Whether or not to show the UTC time on top of the requested timezone.',

                defaultValue: '`false` if timezone has a value',
            }
        ]
    },
    {
        name: 'weather',
        description: 'Shows the weather for a specific region.',
        usage: 'weather <region>',
        examples: [
            {
                text: 'PREFIXMSGweather auckland',
                description: 'Returns the weather for Auckland, New Zealand'
            },
        ],
        aliases: ['temperature', 'temp'],
        args: [
            {
                name: 'region',
                type: 'string',
                required: false,
                description: 'The region to search for',
                options: ['Country, city, region'],
                defaultValue: 'UTC',
            }
        ]
    },
];

const osucmds: bottypes.commandInfo[] = [
    {
        name: 'badges',
        description: 'Display\'s the user\'s badges.',
        usage: 'badges [user]',
        examples: [
            {
                text: 'PREFIXMSGbadges cookiezi',
                description: 'Shows cookiezi\'s badges'
            }
        ],
        aliases: [],
        args: [
            user,
        ]
    },
    {
        name: 'bws',
        description: 'Shows the badge weighted rank of a user.',
        usage: 'bws [user]',
        examples: [
            {
                text: 'PREFIXMSGbws',
                description: 'Shows your badge weighted rank'
            },
            {
                text: 'PREFIXMSGbws peppy',
                description: 'Shows peppy\'s badge weighted rank'
            },
            {
                text: 'PREFIXMSGbws DigitalHypno',
                description: 'Shows DigitalHypno\'s badge weighted rank'
            },
        ],
        aliases: ['badgeweightsystem', 'badgeweight', 'badgeweigthseed', 'badgerank'],
        args: [
            user,
        ]
    },
    {
        name: 'compare',
        description: 'Compares two users\' osu! stats/top plays/scores.',
        usage: 'compare [first] [second]',
        examples: [
            {
                text: 'PREFIXMSGcompare SaberStrike',
                description: 'Compares your stats to SaberStrike\'s'
            },
            {
                text: 'PREFIXMSGcompare peppy SaberStrike',
                description: 'Compares peppy\'s and SaberStrike\'s stats'
            },
            {
                text: 'PREFIXMSGcommon SaberStrike Soragaton',
                description: 'Compares SaberStrike\'s and Soragaton\'s top plays'
            },
            {
                text: '/compare type:top first:SaberStrike second:Soragaton',
                description: 'Compares SaberStrike\'s and Soragaton\'s top plays'
            }
        ],
        aliases: ['common'],
        args: [
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'The type of comparison',
                options: [
                    'profile', 'top plays'
                ],
                defaultValue: 'user stats (top plays if using "common")',
            },
            {
                name: 'first',
                type: 'string',
                required: false,
                description: 'The first user to compare',
                defaultValue: 'The user who ran the command',
            },
            {
                name: 'second',
                type: 'string',
                required: false,
                description: 'The second user to compare',
                defaultValue: 'most recent user fetched in the guild',
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of the compared plays to show',
                defaultValue: '1',
            }
        ]
    },
    {
        name: 'firsts',
        description: 'Shows the #1 global scores of a user.\n' + scoreListString,
        usage: 'firsts [user] [-page/-p] [-(mode)] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        examples: [
            {
                text: 'PREFIXMSGfirsts SaberStrike',
                description: 'Shows SaberStrike\'s #1 scores'
            },
            {
                text: 'PREFIXMSGfirsts -p 3 ',
                description: 'Shows the 3rd page of your #1 scores'
            },
            {
                text: 'PREFIXMSGfirsts -mania',
                description: 'Shows your #1 mania scores'
            },
            {
                text: '/firsts mods:HDHR sort:recent',
                description: 'Shows your #1 scores with HDHR sorted by recent'
            },
            {
                text: 'PREFIXMSGfirsts -parse 3',
                description: 'Returns your 3rd most recent first score'
            }
        ],
        aliases: ['firstplaceranks', 'first', 'fpr', 'fp', '#1s', '1s', '#1'],
        args: scoreListCommandOptions
    },
    {
        name: 'lb',
        description: 'Shows the osu! rankings of a server.',
        usage: 'lb [id] [-(mode)]',
        aliases: [],
        args: [
            {
                name: 'id',
                type: 'string/integer',
                required: false,
                description: 'The server to get the rankings of. Use global to combine the rankings of all servers the bot is in.',

                defaultValue: 'Current server',
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the leaderboard in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of users to show',

                defaultValue: '1',
            }
        ]
    },
    {
        name: 'map',
        description: 'Shows information about a beatmap.',
        usage: 'map [-? "(query)"] [id] +[mods] [-detailed] [-bpm] [-speed] [-cs] [-ar] [-od] [-hp] [-ppcalc] [-bg]',
        linkUsage: [
            'osu.ppy.sh/b/<id> +[mods]',
            'osu.ppy.sh/beatmapsets?q=<query> +[mods]',
            'osu.ppy.sh/beatmapsets/<sid> +[mods]',
            'osu.ppy.sh/beatmapsets/<sid>#<mode>/<id> +[mods]',
            'osu.ppy.sh/s/<sid> +[mods]',
        ],
        examples: [
            {
                text: 'PREFIXMSGmap "kimi no shiranai monogatari"',
                description: 'Returns the first result for "kimi no shiranai monogatari"'
            },
            {
                text: 'PREFIXMSGmap 3013912 +HDHR',
                description: 'Returns the beatmap with the id 3013912 with HDHR'
            },
            {
                text: 'https://osu.ppy.sh/beatmapsets?q=blue%20dragon%20blue%20dragon',
                description: 'Returns the first result for "blue dragon blue dragon"'
            },
            {
                text: 'https://osu.ppy.sh/beatmapsets/326920#osu/725718 +HDHR',
                description: 'Returns beatmap 725718 with HDHR'
            }
        ],
        aliases: ['m'],
        args: [
            {
                name: 'query',
                type: 'string',
                required: false,
                description: 'The map to search for',
                defaultValue: 'null',
            },
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The map ID to search for',
                defaultValue: 'the most recent map in the guild',
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: `The mods to calculate the map with. ${mods}`,
                defaultValue: 'none',
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the map',
                options: ['true', 'false'],
                defaultValue: 'false',
            },
            {
                name: 'bpm',
                type: 'float',
                required: false,
                description: 'The BPM to calculate the map with. This value is still affected by mods',
                options: ['1-1000'],
                defaultValue: 'the map\'s BPM',
            },
            {
                name: 'speed',
                type: 'float',
                required: false,
                description: 'The speed multiplier to calculate the map with. Overrides BPM. This value is still affected by mods',
                options: ['0.1-10'],
                defaultValue: '1',
            },
            {
                name: 'cs',
                type: 'float',
                required: false,
                description: 'The circle size to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'ar',
                type: 'float',
                required: false,
                description: 'The approach rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'od',
                type: 'float',
                required: false,
                description: 'The overall difficulty to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'hp',
                type: 'float',
                required: false,
                description: 'The drain rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'ppcalc',
                type: 'boolean',
                required: false,
                description: 'Shows only the pp calculations for the map. See [here](https://sbrstrkkdwmdr.github.io/sbrbot/commands.html#osucmd-ppcalc) for more info.',

                defaultValue: 'false',
            },
            {
                name: 'bg',
                type: 'boolean',
                required: false,
                description: 'Show only the background images of the map',

                defaultValue: 'false',
            },
        ]
    },
    {
        name: 'maplb',
        description: 'Shows the leaderboard of a map.',
        usage: 'maplb [id] [-page/-p] [-parse]',
        examples: [
            {
                text: 'PREFIXMSGmaplb 32345',
                description: 'Returns the leaderboard of the map with the id 32345'
            },
            {
                text: '/maplb mods:HDHR',
                description: 'Returns the leaderboard of the most recent map in the guild with HDHR'
            }
        ],
        aliases: ['leaderboard', 'mapleaderboard', 'ml'],
        args: [
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The ID of the map to show the leaderboard of',
                defaultValue: 'the most recent map in the guild',
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of the leaderboard to show',
                defaultValue: '1',
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: `The mods to filter the leaderboard by. ${mods}`,
                defaultValue: 'none',
            },
            {
                name: 'parse',
                type: 'integer',
                required: false,
                description: 'Parse the score with the specific index',
                defaultValue: '0',
            },
        ]
    },
    {
        name: 'maprandom',
        description: 'Returns the link to a random beatmap. Uses local storage so selection might be limited.',
        usage: 'maprandom [-(type)]',
        examples: [
            {
                text: 'PREFIXMSGf2',
                description: 'Returns a random beatmap'
            },
            {
                text: 'PREFIXMSGmaprand -ranked',
                description: 'Returns a random ranked beatmap'
            }
        ],
        aliases: ['f2', 'maprand', 'randommap', 'randmap'],
        args: [{
            name: 'Type',
            type: 'string',
            required: false,
            description: 'Filters to only pick from this type of map',
            options: ['Ranked', 'Loved', 'Approved', 'Qualified', 'Pending', 'WIP', 'Graveyard'],
            defaultValue: 'null',
        }]
    },
    {
        name: 'maprecommend',
        description: 'Recommends a random map based off of your recommended difficulty.',
        usage: 'maprecommend [-range] [user]',
        examples: [
            {
                text: 'PREFIXMSGmaprec -range 2 SaberStrike',
                description: 'Recommends a random map for SaberStrike with a maximum star rating difference of 2'
            }
        ],
        aliases: ['recmap', 'recommendmap', 'maprec', 'mapsuggest', 'suggestmap'],
        args: [
            user, mode,
            {
                name: 'range',
                type: 'float',
                required: false,
                description: 'The maximum difference in star rating the recommended map can be',
                options: ['range', 'r', 'diff'],
                defaultValue: '1',
            },
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'How to fetch the recommended map',
                options: ['closest', 'random'],
                defaultValue: 'random',
            }
        ]
    },
    {
        name: 'nochokes',
        description: 'Shows the user\'s top plays if no scores had a miss.\n' + scoreListString,
        usage: 'nochokes [user] [-page/-p] [-(mode)] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        examples: [
            {
                text: 'PREFIXMSGnochokes SaberStrike',
                description: 'Returns SaberStrike\'s top plays without misses'
            },
            {
                text: 'PREFIXMSGnc -p 3',
                description: 'Returns the third page of your top plays without misses'
            },
            {
                text: 'PREFIXMSGnochokes -mania',
                description: 'Returns your top mania plays without misses'
            },
            {
                text: '/nochokes mods:HDHR sort:recent',
                description: 'Returns your top plays with HDHR sorted by recent without misses'
            },
            {
                text: 'PREFIXMSGnc -parse 2',
                description: 'Returns your 2nd no miss top play'
            }
        ],
        aliases: ['nc'],
        args: scoreListCommandOptions
    },
    {
        name: 'osu',
        description: 'Shows information about a user\'s osu! profile.',
        usage: 'osu [user] [-graph/-g] [-detailed/-d] [-(mode)]',
        linkUsage: [
            'osu.ppy.sh/u/<user>',
            'osu.ppy.sh/users/<user>/[(mode)]',
        ],
        aliases: ['o', 'profile', 'user', 'taiko', 'drums', 'fruits', 'ctb', 'catch', 'mania'],
        examples: [
            {
                text: 'PREFIXMSGosu SaberStrike',
                description: 'Shows SaberStrike\'s osu! profile'
            },
            {
                text: '/osu detailed:true mode:taiko',
                description: 'Shows your taiko profile with extra details'
            },
            {
                text: 'PREFIXMSGosu -graph',
                description: 'Shows a graph of your osu! rank and playcount'
            },
            {
                text: 'osu.ppy.sh/u/15222484/osu',
                description: 'Shows SaberStrike\'s osu profile'
            }
        ],
        args: [
            user, mode,
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the user',
                options: ['true', 'false'],
                defaultValue: 'false',
            },
            {
                name: 'graph',
                type: 'boolean',
                required: false,
                description: 'Whether to show only user statistics graphs',
                options: ['true', 'false'],
                defaultValue: 'false',
            },
        ]
    },
    {
        name: 'osuset',
        description: 'Sets your osu! username/mode/skin or any setting.',
        usage: 'osuset <username> [-(mode)] [-skin] [-timezone] [-location]',
        examples: [
            {
                text: 'PREFIXMSGosuset SaberStrike',
                description: 'Sets your username to SaberStrike'
            },
            {
                text: '/osuset username:SaberStrike mode:fruits skin:sbr v11',
                description: 'Sets your username to SaberStrike, mode to fruits, and skin to sbr v11'
            },
            {
                text: 'PREFIXMSGosuset SaberStrike -taiko -skin sbr v11',
                description: 'Sets your username to SaberStrike, mode to taiko, and skin to sbr v11'
            },
            {
                text: 'PREFIXMSGsetmode ctb',
                description: 'Sets your mode to fruits (catch the beat)'
            },
            {
                text: 'PREFIXMSGsetskin sbr v11',
                description: 'Sets your skin to sbr v11'
            },
        ],
        aliases: ['setuser', 'set', 'setmode', 'setskin', 'settime', 'settz', 'setweather', 'setlocation'],
        args: [
            {
                name: 'username',
                type: 'string',
                required: true,
                description: 'The osu! username to set',
                defaultValue: 'null',
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The osu! mode to set',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
            },
            {
                name: 'skin',
                type: 'string',
                required: false,
                description: 'The skin to set',
                defaultValue: 'osu! default 2014',
            },
            {
                name: 'timezone',
                type: 'string',
                required: false,
                description: 'The timezone to set',
                defaultValue: 'null',
            },
            {
                name: 'location',
                type: 'string',
                required: false,
                description: 'The location to set',
                defaultValue: 'null',
            }
        ]
    },
    {
        name: 'osutop',
        description: 'Shows the top scores of a user.\n' + scoreListString,
        usage: 'osutop [user] [-page/-p] [-(mode)] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        examples: [
            {
                text: 'PREFIXMSGosutop SaberStrike',
                description: 'Shows SaberStrike\'s top osu! scores'
            },
            {
                text: 'PREFIXMSGosutop -p 3',
                description: 'Shows your top 3 pages of osu! scores'
            },
            {
                text: 'PREFIXMSGosutop -mania',
                description: 'Shows your top mania scores'
            },
            {
                text: 'PREFIXMSGosutop -fruits -mods hdhr',
                description: 'Shows your top fruits scores with HDHR'
            },
            {
                text: '/osutop mods:HDHR sort:recent',
                description: 'Shows your top scores with HDHR sorted by recent'
            },
            {
                text: 'PREFIXMSGtop -parse 3',
                description: 'Returns your 3rd personal best score'
            },
            {
                text: 'PREFIXMSGsotarks',
                description: 'Returns your top plays mapped by sotarks'
            }
        ],
        aliases: [
            'top', 't', 'ot', 'topo', 'toposu',
            'taikotop', 'toptaiko', 'tt', 'topt',
            'ctbtop', 'fruitstop', 'catchtop', 'topctb', 'topfruits', 'topcatch', 'tf', 'tctb', 'topf', 'topc',
            'maniatop', 'topmania', 'tm', 'topm',
        ],
        args: scoreListCommandOptions
    },
    {
        name: 'pinned',
        description: 'Shows the pinned scores of a user.\n' + scoreListString,
        usage: 'pinned [user] [-page/-p] [-(mode)] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        examples: [
            {
                text: 'PREFIXMSGpinned SaberStrike',
                description: 'Shows SaberStrike\'s pinned scores'
            },
            {
                text: 'PREFIXMSGpinned -p 3',
                description: 'Shows your pinned scores on page 3'
            },
            {
                text: 'PREFIXMSGpinned -mania',
                description: 'Shows your pinned mania scores'
            },
            {
                text: '/pinned mods:HDHR sort:recent',
                description: 'Shows your pinned scores with HDHR sorted by recent'

            }
        ],
        aliases: [],
        args: scoreListCommandOptions
    },
    {
        name: 'ppcalc',
        description: 'Gives the full performance calculations for a map.',
        usage: 'ppcalc [-? "(query)"] [id] +[mods] [-bpm] [-speed] [-cs] [-ar] [-od] [-hp]',
        examples: [
            {
                text: 'PREFIXMSGppcalc +EZHTFL',
                description: 'Calculates the performance for the previous map with easy, halftime and flashlight'
            },
            {
                text: 'PREFIXMSGppcalc 4204 -speed 2 -cs 10',
                description: 'Calculates beatmap 4204 at 2x speed and circle size 10'
            },
            {
                text: 'PREFIXMSGppcalc -bpm 220 -ar 11 -od 11 -cs 5.2',
                description: 'Calculates the previous beatmap at 220bpm, AR11 OD11 and CS5.2'
            }
        ],
        aliases: ['mapcalc', 'mapperf', 'maperf', 'mappp'],
        args: [
            {
                name: 'query',
                type: 'string',
                required: false,
                description: 'The map to search for',
                defaultValue: 'null',
            },
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The map ID to search for',
                defaultValue: 'the most recent map in the guild',
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: `The mods to calculate the map with. ${mods}`,
                defaultValue: 'none',
            },
            {
                name: 'bpm',
                type: 'float',
                required: false,
                description: 'The BPM to calculate the map with. This value is still affected by mods',
                options: ['1-1000'],
                defaultValue: 'the map\'s BPM',
            },
            {
                name: 'speed',
                type: 'float',
                required: false,
                description: 'The speed multiplier to calculate the map with. Overrides BPM. This value is still affected by mods',
                options: ['0.1-10'],
                defaultValue: '1',
            },
            {
                name: 'cs',
                type: 'float',
                required: false,
                description: 'The circle size to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'ar',
                type: 'float',
                required: false,
                description: 'The approach rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'od',
                type: 'float',
                required: false,
                description: 'The overall difficulty to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'hp',
                type: 'float',
                required: false,
                description: 'The drain rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
            },
        ]
    },
    {
        name: 'pp',
        description: 'Estimates the rank of a user from the pp given. If a value matches the database, that will be used instead of an estimation.',
        usage: 'pp <value> [-(mode)]',
        examples: [
            {
                text: 'PREFIXMSGpp 100000',
                description: 'Estimates your rank with 100,000pp'
            },
            {
                text: 'PREFIXMSGpp 2999 -fruits',
                description: 'Estimates your ctb/fruits rank with 2,999pp'
            },
        ],
        aliases: [],
        args: [
            {
                name: 'value',
                type: 'integer',
                required: true,
                description: 'The pp to estimate the rank of',
                defaultValue: 'N/A',
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to estimate the rank in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
            }
        ]
    },
    {
        name: 'rank',
        description: 'Estimates the performance points of a user from the rank given. If a value matches the database, that will be used instead of an estimation.',
        usage: 'rank <value> [-(mode)]',
        examples: [
            {
                text: 'PREFIXMSGrank 1',
                description: 'Estimates your pp with rank 1'
            },
            {
                text: 'PREFIXMSGrank 1 -taiko',
                description: 'Estimates your taiko pp with rank 1'
            },
        ],
        aliases: [],
        args: [
            {
                name: 'value',
                type: 'integer',
                required: true,
                description: 'The rank to estimate the pp of',
                defaultValue: 'N/A',
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the scores in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
            }
        ]
    },
    {
        name: 'ranking',
        description: 'Displays the global leaderboards.',
        usage: 'ranking [country] [-page/-p][-(mode)] [-parse]',
        examples: [
            {
                text: 'PREFIXMSGranking',
                description: 'Shows the global leaderboards'
            },
            {
                text: '/ranking country:us mode:taiko',
                description: 'Shows the taiko leaderboards for the US'
            },
            {
                text: '/ranking type:charts spotlight:227',
                description: 'Shows the leaderboards for the 227th spotlight'
            }
        ],
        aliases: [],
        args: [{
            name: 'country',
            type: 'string',
            required: false,
            description: 'The country code of the country to use',
            defaultValue: 'global',
        },
        {
            name: 'mode',
            type: 'string',
            required: false,
            description: 'The mode to show the scores in',
            options: ['osu', 'taiko', 'fruits', 'mania'],
            defaultValue: 'osu',
        },
        {
            name: 'page',
            type: 'integer',
            required: false,
            description: 'The page of scores to show',
            defaultValue: '1',
        },
        {
            name: 'type',
            type: 'string',
            required: false,
            description: 'The type of leaderboard to show',
            options: ['performance', 'charts', 'score', 'country'],
            defaultValue: 'performance',
        },
        {
            name: 'spotlight',
            type: 'integer',
            required: false,
            description: 'The spotlight to show the scores of. Only works with type charts',
            defaultValue: 'latest',
        },
        {
            name: 'parse',
            type: 'integer',
            required: false,
            description: 'Parses the user with the given index',
            defaultValue: '1',
        },
        ]
    },
    {
        name: 'recent',
        description: 'Shows the recent score(s) of a user.\nThe following only applies to list mode:\n' + scoreListString,
        usage: 'recent [user] [-page/-p] [-list/-l] [-(mode)] [-passes/-pass/-nofail/-nf] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        examples: [
            {
                text: 'PREFIXMSGrecent',
                description: 'Shows your most recent score'
            },
            {
                text: 'PREFIXMSGr SaberStrike',
                description: 'Shows the most recent score of SaberStrike'
            },
            {
                text: 'PREFIXMSGrs -p 2 -list',
                description: 'Shows the second page of a list of your recent scores'
            },
            {
                text: 'PREFIXMSGrsbest',
                description: 'Shows a list of your recent scores, sorted by pp'
            },
            {
                text: 'PREFIXMSGrl -mania',
                description: 'Shows a list of your recent mania scores'
            },
            {
                text: 'PREFIXMSGrlm @SaberStrike',
                description: 'Shows a list of SaberStrike\'s recent mania scores'
            },
            {
                text: 'PREFIXMSGrt -p 2',
                description: 'Shows your second most recent taiko score'
            },
            {
                text: 'PREFIXMSGrl -nf -? "Shinbatsu"',
                description: 'Shows your recent scores with the map name/difficulty/artist/creator matching "shinbatsu", excluding fails'
            }
        ],
        aliases: ['rs', 'r', 'rt', 'rf', 'rm', 'rctb', 'rl', 'rlt', 'rlf', 'rlm', 'rlctb', 'rsbest', 'recentbest', 'rb'],
        args: scoreListCommandOptions.slice(0, 9).concat(
            scoreListCommandOptions.slice(11))
            .concat([
                {
                    name: 'list',
                    type: 'boolean',
                    required: false,
                    description: 'Whether to show multiple scores. If false, only the most recent score will be shown',
                    options: ['true', 'false'],
                    defaultValue: 'false',
                },
                {
                    name: 'passes',
                    type: 'boolean',
                    required: false,
                    description: 'Whether to show only scores that were passed. If false, all scores will be shown',
                    options: ['true', 'false'],
                    defaultValue: 'true',
                },
                {
                    name: '-?',
                    type: 'string',
                    required: false,
                    description: 'Filter scores by maps matching the given string',
                    defaultValue: 'null',
                },
                {
                    name: 'passes',
                    type: 'boolean',
                    required: false,
                    description: 'Whether to show only scores that were passed. If false, all scores will be shown',
                    options: ['true', 'false'],
                    defaultValue: 'true',
                },
            ])
    },
    {
        name: 'recentactivity',
        description: 'Displays the user\'s most recent activity.',
        usage: 'recentactivity [user] [-page]',
        aliases: ['recentact', 'rsact'],
        args: [
            user,
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of activities to show',
                defaultValue: '1',
            },
        ]
    },
    {
        name: 'saved',
        description: 'Shows a user\'s saved settings.',
        usage: 'saved [user]',
        examples: [
            {
                text: 'PREFIXMSGsaved @SaberStrike',
                description: 'Shows SaberStrike\'s saved settings'
            },
        ],
        aliases: [],
        args: [
            userAdmin,
        ]
    },
    {
        name: 'scoreparse',
        description: 'Returns information about a score. Doesn\'t work with new score ID system.',
        usage: 'scoreparse <id> [mode]',
        linkUsage: [
            'osu.ppy.sh/scores/<mode>/<id>'
        ],
        examples: [
            {
                text: 'PREFIXMSGscoreparse 1234567890',
                description: 'Parses the osu! score with the id 1234567890'
            },
            {
                text: 'PREFIXMSGscore 1234567890 mania',
                description: 'Parses the mania score with the id 1234567890'
            },
            {
                text: 'https://osu.ppy.sh/scores/osu/1234567890',
                description: 'Parses the osu! score with the id 1234567890'
            },
        ],
        aliases: ['score', 'sp'],
        args: [
            {
                name: 'id',
                type: 'integer',
                required: true,
                description: 'The id of the score',
                defaultValue: 'null',
            },
            {
                name: 'mode',
                type: 'string',
                required: 'false if message command, true if link',
                description: 'The mode of the score',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
            }
        ]
    },
    {
        name: 'scores',
        description: 'Shows the scores of a user on a beatmap.\n' + scoreListString,
        usage: 'scores [user] [id] [-page/-p] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        examples: [
            {
                text: 'PREFIXMSGscores saberstrike',
                description: 'Shows SaberStrike\'s scores on the most recent beatmap'
            },
            {
                text: 'PREFIXMSGc',
                description: 'Shows your scores on the most recent beatmap'
            },
            {
                text: 'PREFIXMSGc 4204',
                description: 'Shows your scores on the beatmap with the id 4204'
            },
            {
                text: 'PREFIXMSGscores -parse 5',
                description: 'Returns your fifth most recent score on the most recent beatmap'
            },
            {
                text: 'PREFIXMSGc https://osu.ppy.sh/beatmapsets/3367#osu/21565',
                description: 'Shows your scores on the beatmap with the id 21565'
            },
        ],
        aliases: ['c'],
        args:
            scoreListCommandOptions.concat([
                {
                    name: 'id',
                    type: 'integer/map link',
                    required: false,
                    description: 'The map ID to search for',
                    defaultValue: 'the most recent map in the guild',
                },
            ])
    },
    {
        name: 'scorestats',
        description: 'Shows the stats of a user\'s scores.',
        usage: 'scorestats [user] [-(type)] [-(mode)] [all]',
        examples: [
            {
                text: 'PREFIXMSGscorestats @SaberStrike',
                description: 'Shows scorestats for SaberStrike\'s top plays'
            },
            {
                text: 'PREFIXMSGscorestats mrekk -firsts',
                description: 'Shows scorestats for mrekk\'s firsts'
            }
        ],
        aliases: ['ss'],
        args: [
            user, mode,
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'The type of scores to use',
                options: ['best', 'firsts', 'recent', 'pinned'],
                defaultValue: 'best',
            },
            {
                name: 'details',
                type: 'boolean',
                required: false,
                description: 'Sends two txt files with every mapper and mod combination calculated',
                options: ['true', 'false'],
                defaultValue: 'false',
            },
            {
                name: 'all',
                type: 'boolean',
                required: false,
                description: 'Shows all statistics. May cause the command to lag as it needs to download all maps associated with each score.',
                options: ['true', 'false'],
                defaultValue: 'false',
            }
        ]
    },
    {
        name: 'simulate',
        description: 'Simulates a score on a beatmap.',
        usage: 'simulate [id] +[(mods)]  [-acc] [-combo] [-n300] [-n100] [-n50] [-miss] [-bpm] [-speed]',
        examples: [
            {
                text: 'PREFIXMSGsimulate +HDHR misses=0 acc=97.86',
                description: 'Simulates a score on the most recent beatmap with HDHR, 0 misses, and 97.86% accuracy'
            }
        ],
        aliases: ['sim', 'simplay'],
        args: [
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The beatmap id to simulate the score on',
                defaultValue: 'The most recent map in the guild',
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: `The mods to simulate the score with. ${mods}`,
                defaultValue: 'none',
            },
            {
                name: 'accuracy',
                type: 'float',
                required: false,
                description: 'The accuracy to simulate the score with',
                options: ['0-100'],
                defaultValue: '100',
            },
            {
                name: 'combo',
                type: 'integer',
                required: false,
                description: 'The maximum combo to simulate the score with',
                defaultValue: 'map max combo',
            },
            {
                name: 'n300',
                type: 'integer',
                required: false,
                description: 'The number of hit 300s to simulate the score with',
                defaultValue: 'calculated from accuracy',
            },
            {
                name: 'n100',
                type: 'integer',
                required: false,
                description: 'The number of hit 100s to simulate the score with',
                defaultValue: 'calculated from accuracy',
            },
            {
                name: 'n50',
                type: 'integer',
                required: false,
                description: 'The number of hit 50s to simulate the score with',
                defaultValue: 'calculated from accuracy',
            },
            {
                name: 'misses',
                type: 'integer',
                required: false,
                description: 'The number of misses to simulate the score with',
                defaultValue: '0',
            },
            {
                name: 'bpm',
                type: 'float',
                required: false,
                description: 'The bpm to simulate the score with',
                defaultValue: 'map bpm',
            },
            {
                name: 'speed',
                type: 'float',
                required: false,
                description: 'The speed multiplier to simulate the score with',
                defaultValue: '1',
            }
        ]
    },
    {
        name: 'trackadd',
        description: 'Adds a user to the tracklist. Only works in the guild\'s set tracking channel.',
        usage: 'trackadd <user>',
        examples: [
            {
                text: 'PREFIXMSGtrackadd 15222484',
                description: 'Adds the user with the id 15222484 to the tracklist'
            },
            {
                text: 'PREFIXMSGta SaberStrike',
                description: 'Adds SaberStrike to the tracklist'
            }
        ],
        aliases: ['ta', 'track'],
        args: [
            userTrack,
        ]
    },
    {
        name: 'trackchannel',
        description: 'Sets the channel to send tracklist updates to.',
        usage: 'trackchannel <channel>',
        examples: [
            {
                text: 'PREFIXMSGtrackchannel #tracklist',
                description: 'Sets the channel to send tracklist updates to #tracklist'
            },
            {
                text: 'PREFIXMSGtrackchannel 123456789012345678',
                description: 'Sets the channel to send tracklist updates to the channel with the id 123456789012345678'
            }
        ],
        aliases: ['tc'],
        args: [
            {
                name: 'channel',
                type: 'channel mention',
                required: true,
                description: 'The channel to send tracklist updates to',
                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'tracklist',
        description: 'Displays a list of the currently tracked users in the server.',
        usage: 'tracklist',
        aliases: ['tl'],
    },
    {
        name: 'trackremove',
        description: 'Removes a user from the tracklist. Only works in the guild\'s set tracking channel.',
        usage: 'trackremove <user>',
        examples: [
            {
                text: 'PREFIXMSGtrackremove 15222484',
                description: 'Removes the user with the id 15222484 from the tracklist'
            },
            {
                text: 'PREFIXMSGtr SaberStrike',
                description: 'Removes SaberStrike from the tracklist'
            }
        ],
        aliases: ['tr', 'trackrm', 'untrack'],
        args: [
            userTrack,
        ]
    },
    {
        name: 'userbeatmaps',
        description: 'Shows a user\'s beatmaps. (favourites/ranked/pending/graveyard/loved)',
        usage: 'userbeatmaps [user] [-(type)] [-reverse] [-page/-p] [-parse] [-?]',
        examples: [
            {
                text: 'PREFIXMSGubm sotarks -p 4 -ranked',
                description: 'Shows sotarks\'s ranked beatmaps on page 4'
            },
            {
                text: '/userbeatmaps user:Mismagius type:Loved reverse:true page:2 sort:Title',
                description: 'Shows Mismagius\'s loved beatmaps on page 2, sorted by title in reverse'
            }
        ],
        aliases: ['ub', 'userb', 'ubm', 'um', 'usermaps',
            'ranked', 'favourite', 'favourites', 'graveyard', 'unranked', 'loved', 'pending', 'wip', 'nominated', 'bn', 'guest', 'gd', 'most_played', 'mp', 'mostplayed'
        ],
        args: [
            user,
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'The type of beatmaps to show',
                options: ['Favourites', 'Ranked', 'Pending', 'Graveyard', 'Loved'],
                defaultValue: 'Favourites',
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to sort the beatmaps in reverse',
                options: ['true', 'false'],
                defaultValue: 'false',
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of beatmaps to show',
                defaultValue: '1',
            },
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The way to sort the beatmaps',
                options: ['Title', 'Artist', 'Difficulty', 'Status', 'Fails', 'Plays', 'Date Added', 'Favourites', 'BPM', 'CS', 'AR', 'OD', 'HP', 'Length'],
                defaultValue: 'Date Added',
            },
            {
                name: 'parse',
                type: 'integer',
                required: false,
                description: 'Parses the beatmap with the given index',
                defaultValue: '1',
            },
            {
                name: 'filter',
                type: 'string',
                required: false,
                description: 'Filters the beatmaps by the given string',
                defaultValue: 'N/A',
            },
        ]
    },
    {
        name: 'whatif',
        description: 'Estimates user stats if they gain a certain amount of raw pp.',
        usage: 'whatif [user] <pp>',
        examples: [
            {
                text: 'PREFIXMSGwhatif 1000',
                description: 'Shows the user\'s stats if they achieved a 1000pp score'
            },
            {
                text: 'PREFIXMSGwhatif SaberStrike 300',
                description: 'Shows SaberStrike\'s stats if they achieved a 300pp score'
            }
        ],
        aliases: ['wi'],
        args: [
            user, mode,
            {
                name: 'pp',
                type: 'float',
                required: true,
                description: 'The amount of raw pp to gain',
                defaultValue: '0',
            },
        ]
    }
];

const othercmds: bottypes.commandInfo[] = [
    {
        name: '8ball',
        description: 'Returns a yes/no/maybe answer to a question.',
        usage: '8ball ',
        examples: [
            {
                text: 'PREFIXMSG8ball is this a good bot?',
                description: 'Returns a yes/no/maybe answer to the question'
            }
        ],
        aliases: ['ask'],
    },
    {
        name: 'coin',
        description: 'Flips a coin.',
        usage: 'coin',
        aliases: ['coinflip', 'flip'],
    },
    {
        name: 'gif',
        description: 'Sends a gif.',
        usage: '<type> [target]',
        examples: [
            {
                text: '/slap @SaberStrike',
                description: 'Sends a random gif matching "slap"'
            }
        ],
        aliases: ['hug', 'kiss', 'lick', 'pet', 'punch', 'slap'],
        args: [
            {
                name: 'type',
                type: 'string',
                required: true,
                description: 'The type of gif to send',
                options: ['hug', 'kiss', 'lick', 'pet', 'punch', 'slap'],
                defaultValue: 'N/A',
            },
            {
                name: 'target',
                type: 'user mention',
                required: true,
                description: 'The user to target',
                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'image',
        description: 'Sends an image.',
        usage: 'image <query>',
        examples: [
            {
                text: 'PREFIXMSGimage cat',
                description: 'Sends the first five results of a google image search for "cat"'
            },
        ],
        aliases: ['imagesearch'],
        args: [
            {
                name: 'query',
                type: 'string',
                required: true,
                description: 'The image to search for',
                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'inspire',
        description: 'Sends a randomly generated inspirational quote.',
        usage: 'inspire',
        aliases: ['insp'],
    },
    {
        name: 'janken',
        description: 'Plays janken with the bot. (aka paper scissors rock or rock paper scissors or whatever weird order it\'s in).',
        usage: 'janken',
        aliases: ['paperscissorsrock', 'rockpaperscissors', 'rps', 'psr'],
        args: [
            {
                name: 'choice',
                type: 'string',
                required: true,
                description: 'Paper, scissors or rock.',
                options: ['rock', 'paper', 'scissors', 'グー', 'チョキ', 'パー'],
                defaultValue: 'N/A',
            }
        ],
    },
    {
        name: 'poll',
        description: 'Creates a poll.',
        usage: 'poll <question>',
        examples: [
            {
                text: 'PREFIXMSGpoll djkfhgfbdkgbkfhdjgdkgd',
                description: 'Creates a poll with the question "djkfhgfbdkgbkfhdjgdkgd"'
            },
            {
                text: '/poll title:What is your favorite colour? options:red+green+blue',
                description: 'Creates a poll with the question "What is your favorite colour?" and the options "red", "green", and "blue"'
            }
        ],
        aliases: ['vote'],
        args: [
            {
                name: 'question',
                type: 'string',
                required: true,
                description: 'The question/title of the poll',
                defaultValue: 'N/A',
            },
            {
                name: 'options',
                type: 'string',
                required: false,
                description: 'The options for the poll',
                options: ['format: option1+option2+option3...'],
                defaultValue: 'yes+no',
            }
        ]
    },
    {
        name: 'roll',
        description: 'Rolls a random number.',
        usage: 'roll [max] [min]',
        examples: [
            {
                text: 'PREFIXMSGroll',
                description: 'Rolls a random number between 1 and 100'
            },
            {
                text: 'PREFIXMSGroll 100 50',
                description: 'Rolls a random number between 50 and 100'
            }
        ],
        aliases: ['rng', 'randomnumber', 'randomnumbergenerator', 'pickanumber', 'pickanum'],
        args: [
            {
                name: 'max',
                type: 'integer',
                required: false,
                description: 'The maximum number to roll',
                defaultValue: '100',
            },
            {
                name: 'min',
                type: 'integer',
                required: false,
                description: 'The minimum number to roll',
                defaultValue: '1',
            }
        ]
    },
    {
        name: 'say',
        description: 'Sends a message.',
        usage: 'say <message>',
        examples: [
            {
                text: 'PREFIXMSGsay hello',
                description: 'Says "hello" in the current channel'
            },
        ],
        aliases: [],
        args: [
            {
                name: 'message',
                type: 'string',
                required: true,
                description: 'The message to send',
                defaultValue: 'N/A',
            },
            {
                name: 'channel',
                type: 'channel',
                required: false,
                description: 'The channel to send the message in',
                defaultValue: 'current channel',
            }
        ]
    },
    {
        name: 'ytsearch',
        description: 'Searches youtube for a video.',
        usage: 'ytsearch <query>',
        examples: [
            {
                text: 'PREFIXMSGytsearch never gonna give you up',
                description: 'Searches youtube for "never gonna give you up"'
            }
        ],
        aliases: ['yt', 'yts'],
        args: [
            {
                name: 'query',
                type: 'string',
                required: true,
                description: 'The video to search for.',
                defaultValue: 'N/A',
            }
        ]
    }
];

const admincmds: bottypes.commandInfo[] = [
    {
        name: 'checkperms',
        description: 'Checks the permissions of the user.',
        usage: 'checkperms [user]',
        examples: [
            {
                text: 'PREFIXMSGcheckperms @SSoB',
                description: 'Checks the permissions of the user @SSoB'
            }
        ],
        aliases: ['perms'],
        args: [
            userAdmin,
        ]
    },
    {
        name: 'userinfo',
        description: 'Returns information about a user.',
        usage: 'userinfo [user]',
        examples: [
            {
                text: 'PREFIXMSGuser @SSoB',
                description: 'Returns information about the user @SSoB'
            },
            {
                text: '/userinfo user:SSoB',
                description: 'Returns information about the user SSoB'
            }
        ],
        aliases: ['userinfo'],
        args: [
            userAdmin,
        ]
    },
    {
        name: 'avatar',
        description: 'Gets the avatar of a user.',
        usage: 'avatar [user]',
        examples: [
            {
                text: 'PREFIXMSGavatar @SSoB',
                description: 'Gets information about the user @SSoB'
            },
            {
                text: '/avatar user:SSoB',
                description: 'Gets information about the user SSoB'
            }
        ],
        aliases: ['av', 'pfp'],
        args: [
            userAdmin,
        ]
    },
    {
        name: 'debug',
        description: 'Runs a debugging command.',
        usage: 'debug <type> [arg]',
        examples: [
            {
                text: 'PREFIXMSGdebug commandfile 1',
                description: 'Returns all files associated with the command matching ID 1'
            },
            {
                text: 'PREFIXMSGdebug commandfiletype map',
                description: 'Returns all files associated with the command "map"'
            },
            {
                text: 'PREFIXMSGdebug servers',
                description: 'Returns a list of all guilds the bot is in'
            },
            {
                text: 'PREFIXMSGdebug channels',
                description: 'Returns a list of all channels in the current guild'
            },
            {
                text: 'PREFIXMSGdebug users',
                description: 'Returns a list of all members in the current guild'
            },
            {
                text: 'PREFIXMSGdebug forcetrack',
                description: 'Forces the osu!track to run a cycle (takes a minute to complete)'
            },
            {
                text: 'PREFIXMSGdebug curcmdid',
                description: 'Returns the current command\'s ID'
            },
            {
                text: 'PREFIXMSGdebug logs',
                description: 'Returns the logs associated with the current guild'
            },
            {
                text: 'PREFIXMSGdebug clear all',
                description: 'Deletes all command-related files cached'
            },
            {
                text: 'PREFIXMSGdebug maps name',
                description: 'Returns all maps stored in the cache, and lists them by name'
            },
        ],
        aliases: [],
        args: [
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'The type of debug to perform',
                options: ['commandfile', 'commandfiletype', 'servers', 'channels', 'users', 'forcetrack', 'curcmdid', 'logs', 'clear', 'maps', 'ls', 'memory'],
                defaultValue: 'list options',
            }, {
                name: 'arg',
                type: 'integer/string',
                required: false,
                description: 'commandfile -> the id of the command to search for\ncommandfiletype -> the name of the command to search\nlogs -> the ID of the guild to send logs from\nclear -> the types of files to clear (read the options section)',
                options: ['normal', 'all (only cmd data)', 'trueall', 'map', 'users', 'previous', 'pmaps', 'pscores', 'pusers', 'errors', 'graph'],
                defaultValue: 'commandfile -> latest command\ncommandfiletype -> list options\nlogs -> current server\n clear -> temporary files only',
            }
        ]
    },
    {
        name: 'find',
        description: 'Finds details of a user/guild/channel/role/emoji/sticker.',
        usage: 'find <type> <ID>',
        examples: [
            {
                text: 'PREFIXMSGfind user 777125560869978132',
                description: 'Returns info for user with id 777125560869978132'
            }
        ],
        aliases: ['get'],
        args: [
            {
                name: 'type',
                type: 'string',
                required: true,
                description: 'The type of info to fetch',
                options: ['user', 'guild', 'channel', 'role', 'emoji', 'sticker'],
                defaultValue: 'N/A',
            },
            {
                name: 'id',
                type: 'integer',
                required: true,
                description: 'The ID to fetch',
                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'leaveguild',
        description: 'Makes the bot leave a guild.',
        usage: 'leaveguild [guild]',
        examples: [
            {
                text: 'PREFIXMSGleaveguild 1234567890',
                description: 'Makes the bot leave the guild with the id 1234567890'
            },
        ],
        aliases: ['leave'],
        args: [
            {
                name: 'guild',
                type: 'integer',
                required: false,
                description: 'The id of the guild to leave',
                defaultValue: 'the guild the command was sent in',
            }
        ]
    },
    {
        name: 'prefix',
        description: 'Set\'s the prefix of the current server.',
        usage: 'prefix <prefix>',
        examples: [
            {
                text: 'PREFIXMSGprefix !',
                description: 'Sets the prefix to "!"'
            }
        ],
        aliases: [],
        args: [
            {
                name: 'prefix',
                type: 'string',
                required: true,
                description: 'The prefix to set',
                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'purge',
        description: 'Deletes a specified amount of messages from the current channel.',
        usage: 'purge [count] [user] [-method]',
        examples: [
            {
                text: 'PREFIXMSGpurge 5 12345689',
                description: 'Deletes 5 messages from the user with the ID 12345689'
            },
            {
                text: 'PREFIXMSGpurge 5 @testsubject',
                description: 'Deletes 5 messages from the user "testsubject"'
            },
            {
                text: 'PREFIXMSGpurge 5 -fetch',
                description: 'Deletes 5 messages using the fetch method'
            },
        ],
        aliases: [],
        args: [
            {
                name: 'count',
                type: 'integer',
                required: false,
                description: 'The amount of messages to delete',
                options: ['0-100'],
                defaultValue: '5',
            },
            {
                name: 'user',
                type: 'string/user mention',
                required: false,
                description: 'The user\'s messages to delete. Deletes messages from any user if unspecified',
                defaultValue: 'N/A',
            },
            {
                name: 'method',
                type: 'string',
                required: false,
                description: 'The method to delete messages. Fetch is slower, but can delete messages older than 14 days. Bulk cannot be used if user is specified.',
                options: ['bulk', 'fetch'],
                defaultValue: 'bulk',
            }
        ]
    },
    {
        name: 'servers',
        description: 'Shows the servers the bot is in.',
        usage: 'servers',
        aliases: [],
    }
];

const buttons: {
    name: string,
    description: string,
    emoji: string;
}[] = [
        {
            name: 'Refresh',
            description: 'Refreshes the current embed.',
            emoji: buttonsObjs.label.main.refresh,
        }, {
            name: 'BigLeftArrow',
            description: 'Switches to the first page.',
            emoji: buttonsObjs.label.page.first,
        }, {
            name: 'LeftArrow',
            description: 'Switches to the previous page.',
            emoji: buttonsObjs.label.page.previous,
        }, {
            name: 'Search',
            description: 'Switches to the chosen page.',
            emoji: buttonsObjs.label.page.search,
        }, {
            name: 'RightArrow',
            description: 'Switches to the next page.',
            emoji: buttonsObjs.label.page.next,
        }, {
            name: 'BigRightArrow',
            description: 'Switches to the last page.',
            emoji: buttonsObjs.label.page.last,
        }, {
            name: 'detailMore',
            description: 'Expands the current embed.',
            emoji: buttonsObjs.label.main.detailMore,
        }, {
            name: 'detailLess',
            description: 'Collapses the current embed.',
            emoji: buttonsObjs.label.main.detailLess,
        }, {
            name: 'Detailed',
            description: 'Toggles the amount of content on the current embed.',
            emoji: buttonsObjs.label.main.detailed,
        }, {
            name: 'Random',
            description: 'Picks a random command to display.',
            emoji: buttonsObjs.label.extras.random,
        }, {
            name: 'Graph',
            description: 'Displays any graphs related.',
            emoji: buttonsObjs.label.extras.graph
        }, {
            name: 'Map',
            description: 'Displays the map of the current score(s).',
            emoji: buttonsObjs.label.extras.map
        }, {
            name: 'User',
            description: 'Displays the user',
            emoji: buttonsObjs.label.extras.user
        }, {
            name: 'Leaderboard',
            description: 'Displays the leaderboard of the map or other scores the user has on that map.',
            emoji: buttonsObjs.label.extras.leaderboard
        }, {
            name: 'Time',
            description: 'Displays the time for the given region.',
            emoji: buttonsObjs.label.extras.time
        }, {
            name: 'Weather',
            description: 'Displays the weather for the given region.',
            emoji: buttonsObjs.label.extras.weather
        }

    ];

export { admincmds, buttons, cmds, osucmds, othercmds };

export function getCommand(input: string) {
    let category: string;
    let list: bottypes.commandInfo[];
    let command: bottypes.commandInfo;

    if (input.startsWith('category')) {
        switch (input) {
            case 'gen': default:
                list = cmds;
                category = 'General';
                break;
            case 'osu':
                list = osucmds;
                category = 'osu!';
                break;
            case 'misc':
                list = othercmds;
                category = 'Other';
                break;
            case 'admin':
                list = admincmds;
                category = 'Admin';
                break;
        }
    } else {
        const predicate = (x: bottypes.commandInfo) =>
            x.name == input.toLowerCase() ||
            x.aliases.some(y => y == input.toLowerCase());
        if (cmds.findIndex(predicate)) {
            command = cmds.find(predicate);
            category = 'General';
        }
        if (osucmds.findIndex(predicate)) {
            command = osucmds.find(predicate);
            category = 'osu!';
        }
        if (othercmds.findIndex(predicate)) {
            command = othercmds.find(predicate);
            category = 'Other';
        }
        if (admincmds.findIndex(predicate)) {
            command = admincmds.find(predicate);
            category = 'Admin';
        }
    }
    return {
        category,
        command,
        list,
    };
}