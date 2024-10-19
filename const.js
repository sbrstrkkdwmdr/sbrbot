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

const buttonsObjs = {
    label: {
        page: {
            first: '.\\img\\buttons\\page_first.png',
            previous: '.\\img\\buttons\\page_previous.png',
            search: '.\\img\\buttons\\page_select.png',
            next: '.\\img\\buttons\\page_next.png ',
            last: '.\\img\\buttons\\page_last.png',
        },
        main: {
            refresh: '.\\img\\buttons\\refresh.png',
            detailed: '.\\img\\buttons\\details_default.png',
            detailDefault: '.\\img\\buttons\\details_default.png',
            detailMore: '.\\img\\buttons\\details_more.png',
            detailLess: '.\\img\\buttons\\details_less.png',
        },
        extras: {
            random: '.\\img\\buttons\\random.png', //🎲
            graph: '.\\img\\buttons\\graph.png', //'📈',
            map: '.\\img\\buttons\\map.png', //🗺
            user: '.\\img\\buttons\\user.png'
        },
        page_old: {
            first: '⬅',
            previous: '◀',
            search: '🔍',
            next: '▶',
            last: '➡',
        },
    }
}


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

const user = {
    name: 'user',
    type: 'string/integer/user mention',
    required: false,
    description: 'The user to show',
    options: ['N/A'],
    defaultValue: 'The user who ran the command',
    examples: ['mrekk', 'user:mrekk'],
    commandTypes: ['message', 'interaction']
};
const mode = {
    name: 'mode',
    type: 'string',
    required: false,
    description: 'The mode to use',
    options: ['osu', 'taiko', 'fruits', 'mania'],
    defaultValue: 'osu',
    examples: ['taiko', 'mode:mania'],
    commandTypes: ['message', 'interaction']
};
const userTrack = {
    name: 'user',
    type: 'string',
    required: true,
    description: 'The user to use',
    options: ['N/A'],
    defaultValue: 'N/A',
    examples: ['SaberStrike', 'user:SaberStrike'],
    commandTypes: ['message', 'interaction']
};
const userAdmin = {
    name: 'user',
    type: 'integer/user mention',
    required: false,
    description: 'The user to use',
    options: ['N/A'],
    defaultValue: 'The user who ran the command',
    examples: [''],
    commandTypes: ['message', 'interaction']
};

const scoreListCommandOptions = [
    user, mode,
    {
        name: 'sort',
        type: 'string',
        required: false,
        description: 'The sort order of the scores',
        options: ['pp', 'score', 'recent', 'acc', 'combo', 'miss', 'rank'],
        defaultValue: 'pp',
        examples: ['sort:score', '-recent', '-sort acc'],
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
        commandTypes: ['message', 'interaction'],
        aliases: ['-rev']
    },
    {
        name: 'page',
        type: 'integer',
        required: false,
        description: 'The page of scores to show',
        options: ['N/A'],
        defaultValue: '1',
        examples: ['page:6', '-p 4'],
        commandTypes: ['message', 'interaction', 'button'],
        aliases: ['-p'],
    },
    {
        name: 'mapper',
        type: 'string',
        required: false,
        description: 'The mapper to filter the scores by',
        options: ['N/A'],
        defaultValue: 'null',
        examples: ['mapper:Sotarks'],
        commandTypes: ['message', 'interaction']
    },
    {
        name: 'mods',
        type: 'string',
        required: false,
        description: `Filter scores including these mods. ${mods}`,
        options: ['+(mods)', '-mods (mods)'],
        defaultValue: 'null',
        examples: ['mods:HDHR', '-mods HDHR'],
        commandTypes: ['message', 'interaction'],
        aliases: ['-mods']
    },
    {
        name: 'exact mods',
        type: 'string',
        required: false,
        description: `Filter scores with these exact mods. ${mods}`,
        options: ['N/A'],
        defaultValue: 'null',
        examples: ['-modx HDHR'],
        commandTypes: ['message', 'interaction'],
        aliases: ['-modx', '-mx']
    },
    {
        name: 'exclude mods',
        type: 'string',
        required: false,
        description: `Filter scores to exclude these mods. ${mods}`,
        options: ['N/A'],
        defaultValue: 'null',
        examples: ['-me NF'],
        commandTypes: ['message', 'interaction'],
        aliases: ['-me', 'exmod']
    },
    {
        name: 'detailed',
        type: 'integer',
        required: false,
        description: 'How much information to show about the scores. 0 = less details, 2 = more details',
        options: ['-c', '-d',],
        defaultValue: '1',
        examples: ['detailed:true', '-detailed', '-compress'],
        commandTypes: ['message', 'interaction', 'button']
    },
    {
        name: 'parse',
        type: 'integer',
        required: false,
        description: 'Parse the score with the specific index',
        options: ['N/A'],
        defaultValue: '0',
        examples: ['-parse 5', 'parse:5'],
        commandTypes: ['message', 'interaction']
    },
    {
        name: 'filter',
        type: 'string',
        required: false,
        description: 'Filters all scores to only show maps with the specified string',
        options: ['N/A'],
        defaultValue: 'null',
        examples: ['-? "Mismagius The Big Black"', '-? sotarks', 'filter:kira kira days'],
        aliases: ['?'],
        commandTypes: ['message', 'interaction']
    },
    {
        name: 'grade',
        type: 'string',
        required: false,
        description: 'Filters all scores to only show scores matching the given grade/rank',
        options: ['XH', 'SSH', 'X', 'SS', 'SH', 'S', 'A', 'B', 'C', 'D', 'F'],
        defaultValue: 'null',
        examples: ['-grade XH', 'grade:S'],
        commandTypes: ['message', 'interaction']
    },
    {
        name: 'pp',
        type: 'float/range',
        required: false,
        description: 'Filters scores to have more/less pp than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
        examples: ['-pp >100', '-pp <500', '100..500'],
        commandTypes: ['message', 'interaction']
    },
    {
        name: 'score',
        type: 'int/range',
        required: false,
        description: 'Filters scores to have more/less score than this value',
        options: ['>number', '<number', 'min..max', 'number'],
        defaultValue: 'null',
        examples: ['-score >1000000', '-score 1000000'],
        commandTypes: ['message', 'interaction']
    },
    {
        name: 'acc',
        type: 'float/range',
        required: false,
        description: 'Filters scores to have more/less accuracy than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
        examples: ['-acc >98.80', '-acc <90',],
        commandTypes: ['message', 'interaction']
    },
    {
        name: 'combo',
        type: 'integer/range',
        required: false,
        description: 'Filters scores to have more/less maximum combo than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
        examples: ['-combo >2000', '-combo <100'],
        commandTypes: ['message', 'interaction']
    },
    {
        name: 'miss',
        type: 'integer/range',
        required: false,
        description: 'Filters scores to have more/less/equal misses than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
        examples: ['-miss <10', '-miss >20'],
        commandTypes: ['message', 'interaction'],
        aliases: ['-misses']
    },
    {
        name: 'bpm',
        type: 'float/range',
        required: false,
        description: 'Filters scores to have more/less/equal bpm than this value',
        options: ['>(number)', '<(number)', '(min)..(max)', '(number)'],
        defaultValue: 'null',
        examples: ['-bpm <10', '-bpm >20'],
        commandTypes: ['message', 'interaction']
    },
];

const generalcommands = [
    {
        name: 'changelog',
        description: 'Displays the changes for the current version or version requested.',
        usage: 'changelog [version]',
        slashusage: 'changelog [version]',
        examples: [
            {
                text: 'PREFIXMSGchangelog 0.4.0',
                descriptor: 'Returns the changelog for version 0.4.0'
            },
            {
                text: 'PREFIXMSGchangelog first',
                descriptor: 'Returns the changelog for the first version'
            },
            {
                text: 'PREFIXMSGchangelog pending',
                descriptor: 'Returns the changelog for the upcoming version'
            },
            {
                text: 'PREFIXMSGversions',
                descriptor: 'Returns a list of all versions'
            },
        ],
        aliases: ['clog', 'changes', 'versions'],
        options: [
            {
                name: 'version',
                type: 'string',
                required: false,
                description: 'The version',
                options: ['formatted as major.minor.patch (`0.4.1`) or `first`, `second` etc. `pending` shows upcoming changes'],
                defaultValue: 'latest',
                examples: ['0.4.1', 'version:0.4.1', 'first'],
                commandTypes: ['message', 'interaction']
            },
        ]
    },
    {
        name: 'convert',
        description: 'Converts a number from one unit/base to another.',
        usage: 'convert [from] [to] [number]',
        slashusage: 'convert <from> [to] [number]',
        examples: [
            {
                text: 'PREFIXMSGconvert kilometre mi 10',
                descriptor: 'Converts 10 kilometres to miles'
            },
            {
                text: 'PREFIXMSGconvert k c 273.15',
                descriptor: 'Converts 273.15 kelvin to celsius'
            },
        ],
        aliases: ['conv'],
        options: [
            {
                name: 'from',
                type: 'string',
                required: true,
                description: 'The unit to convert from',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: ['k', 'from:kelvin', '-i decimal'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'to',
                type: 'string',
                required: true,
                description: 'The unit to convert to. see [here](https://sbrstrkkdwmdr.github.io/sbrbot/commandtypes.html#conv) for units',
                options: ['help', 'SI units',],
                defaultValue: 'N/A',
                examples: ['c', 'to:celsius', '-o hex'],
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
        name: 'country',
        description: 'Displays information for a given country.',
        usage: '[-type] <search>',
        slashusage: '<search>',
        examples: [
            {
                text: 'PREFIXMSGcountry australia',
                descriptor: 'Shows information for Australia'
            },
            {
                text: 'PREFIXMSGcountry -code DE',
                descriptor: 'Shows information for Germany'
            },
        ],
        aliases: [],
        buttons: [buttonsObjs.label.extras.time, buttonsObjs.label.extras.weather],
        options: [
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'What param to search with',
                options: ['name', 'fullname', 'code', 'codes', 'demonym', 'capital', 'translation'],
                defaultValue: 'name',
                examples: ['-iso',],
                commandTypes: ['message', 'interaction',]
            },
            {
                name: 'search',
                type: 'string',
                required: false,
                description: 'The country to search for',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: ['australia',],
                commandTypes: ['message', 'interaction',]
            },
        ]
    },
    {
        name: 'help',
        description: 'Displays useful information about commands.',
        usage: 'help [command]',
        slashusage: 'help [command]',
        examples: [
            {
                text: 'PREFIXMSGhelp',
                descriptor: 'Shows the general help page'
            },
            {
                text: 'PREFIXMSGhelp convert',
                descriptor: 'Shows information about the convert command'
            },
            {
                text: '/help recent',
                descriptor: 'Shows information about the recent command'
            },
            {
                text: 'PREFIXMSGhelp categoryosu',
                descriptor: 'Lists all commands in the osu category'
            },
            {
                text: 'PREFIXMSGhelp list',
                descriptor: 'Lists all available commands'
            }
        ],
        aliases: ['commands', 'list', 'command', 'h'],
        buttons: [buttonsObjs.label.extras.random, buttonsObjs.label.main.detailed],
        options: [
            {
                name: 'command',
                type: 'string',
                required: false,
                description: 'The command/category to get information about. Categories are always prefixed with `categoryX`.',
                options: ['list', 'category(category)', '(command)'],
                defaultValue: 'N/A',
                examples: ['recent', 'command:osutop'],
                commandTypes: ['message', 'interaction', 'button']
            },
        ]
    },
    {
        name: 'info',
        description: 'Shows information about the bot.',
        usage: 'info [arg]',
        examples: [],
        aliases: ['i', '[arg]'],
        options: [
            {
                name: 'arg',
                type: 'string',
                required: false,
                description: 'Return just that specific value',
                options: ['uptime', 'version', 'server', 'website', 'timezone', 'source'],
                defaultValue: 'null',
                examples: ['N/A'],
                commandTypes: ['message', 'interaction']
            },
        ]
    },
    {
        name: 'invite',
        description: 'Sends the bot\'s public invite.',
        usage: 'invite',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'math',
        description: 'Solves a math problem.',
        usage: 'math <problem>',
        slashusage: 'math <type> <num1> [num2]',
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
                    `Supports:
integers (0-9), floats/decimals (.5, 1.34), negatives (-727), exponential notation (6.022e+23)
operators: *, /, +, -, (, )
`,
                ],
                defaultValue: 'N/A',
                examples: ['8/2(2+2)', '2^32', '2e-2 + .5'],
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
        description: 'Pings the bot and returns the latency.',
        usage: 'ping',
        slashusage: 'ping',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'remind',
        description: 'Sets a reminder. Leave all args blank or use the reminders alias to return a list of reminders',
        usage: 'remind [time] [reminder]',
        slashusage: 'remind <time> <reminder> [sendinchannel]',
        examples: [
            {
                text: 'PREFIXMSGremind',
                descriptor: 'Returns a list of reminders.'
            },
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
        aliases: ['reminders', 'reminder'],
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
        description: 'Shows the bot\'s statistics.',
        usage: 'stats',
        examples: [],
        aliases: [],
        options: []
    },
    {
        name: 'time',
        description: 'Shows the current time in a specific timezone.',
        usage: 'time [timezone] [-showutc]',
        slashusage: 'time [timezone]',
        examples: [
            {
                text: 'PREFIXMSGtime',
                descriptor: 'Shows the user\'s current time. If unset, it displays GMT.'
            },

            {
                text: 'PREFIXMSGtime AEST',
                descriptor: 'Shows the current time in AEST (UTC+10, Australian Eastern Standard Time)'
            },
        ],
        aliases: ['tz'],
        options: [
            {
                name: 'timezone',
                type: 'string',
                required: false,
                description: 'The timezone to show the time in. See [here](https://github.com/sbrstrkkdwmdr/sbrbot/blob/main/src/consts/timezones.ts)',
                options: ['Formatted as (city), UTC(+/-)(hours), country name, country endonym, country ISO codes (eg AU), or abbreviations such as AEST, PST etc.'],
                defaultValue: 'UTC',
                examples: ['Australia/Melbourne', 'Europe/Warsaw'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'showutc',
                type: 'boolean',
                required: false,
                description: 'Whether or not to show the UTC time on top of the requested timezone.',
                options: ['N/A'],
                defaultValue: '`false` if timezone has a value',
                examples: [],
                commandTypes: ['message']
            }
        ]
    },
    {
        name: 'weather',
        description: 'Shows the weather for a specific region.',
        usage: 'weather <region>',
        slashusage: 'weather <region>',
        examples: [
            {
                text: 'PREFIXMSGweather auckland',
                descriptor: 'Returns the weather for Auckland, New Zealand'
            },
        ],
        aliases: ['temperature', 'temp'],
        options: [
            {
                name: 'region',
                type: 'string',
                required: false,
                description: 'The region to search for',
                options: ['Country, city, region'],
                defaultValue: 'UTC',
                examples: ['Auckland', 'Melbourne', 'New York'],
                commandTypes: ['message', 'interaction', 'button']
            }
        ]
    },
];

const osucommands = [
    {
        name: 'badges',
        description: 'Display\'s the user\'s badges.',
        usage: 'badges [user]',
        slashusage: 'badges [user]',
        examples: [
            {
                text: 'PREFIXMSGbadges cookiezi',
                descriptor: 'Shows cookiezi\'s badges'
            }
        ],
        aliases: [],
        buttons: [buttonsObjs.label.extras.user],
        options: [
            user,
        ]
    },
    {
        name: 'bws',
        description: 'Shows the badge weighted rank of a user.',
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
        aliases: ['badgeweightsystem', 'badgeweight', 'badgeweigthseed', 'badgerank'],
        buttons: [buttonsObjs.label.extras.user],
        options: [
            user,
        ]
    },
    {
        name: 'compare',
        description: 'Compares two users\' osu! stats/top plays/scores.',
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
        buttons: [buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last],
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
            },
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of the compared plays to show',
                options: ['N/A'],
                defaultValue: '1',
                examples: [''],
                commandTypes: ['button']
            }
        ]
    },
    {
        name: 'firsts',
        description: 'Shows the #1 global scores of a user.\n' + scoreListString,
        usage: 'firsts [user] [-page/-p] [-(mode)] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        slashusage: 'firsts [user] [mode] [sort] [reverse] [page] [mapper] [mods] [parse] [filter] [grade]',
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
        aliases: ['firstplaceranks', 'first', 'fpr', 'fp', '#1s', '1s', '#1'],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.user],
        options: scoreListCommandOptions
    },
    {
        name: 'lb',
        description: 'Shows the osu! rankings of a server.',
        usage: 'lb [id] [-(mode)]',
        slashusage: 'lb [id] [mode]',
        examples: [],
        aliases: [],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last],
        options: [
            {
                name: 'id',
                type: 'string/integer',
                required: false,
                description: 'The server to get the rankings of. Use global to combine the rankings of all servers the bot is in.',
                options: ['N/A'],
                defaultValue: 'Current server',
                examples: ['global', '1234567'],
                commandTypes: ['message', 'interaction'],
            },
            {
                name: 'mode',
                type: 'string',
                required: false,
                description: 'The mode to show the leaderboard in',
                options: ['osu', 'taiko', 'fruits', 'mania'],
                defaultValue: 'osu',
                examples: ['-taiko', 'mode:mania'],
                commandTypes: ['message', 'interaction']
            },
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
        description: 'Shows information about a beatmap.',
        usage: 'map [-? "(query)"] [id] +[mods] [-detailed] [-bpm] [-speed] [-cs] [-ar] [-od] [-hp] [-ppcalc] [-bg]',
        slashusage: 'map [query] [id] [mods] [detailed] [bpm] [speed] [cs] [ar] [od] [hp]',
        linkusage: [
            'osu.ppy.sh/b/<id> +[mods]',
            'osu.ppy.sh/beatmapsets?q=<query> +[mods]',
            'osu.ppy.sh/beatmapsets/<sid> +[mods]',
            'osu.ppy.sh/beatmapsets/<sid>#<mode>/<id> +[mods]',
            'osu.ppy.sh/s/<sid> +[mods]',
        ],
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
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.user],
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
                commandTypes: ['message', 'interaction', 'link', 'button']
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: `The mods to calculate the map with. ${mods}`,
                options: ['N/A'],
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
            },
            {
                name: 'bpm',
                type: 'float',
                required: false,
                description: 'The BPM to calculate the map with. This value is still affected by mods',
                options: ['1-1000'],
                defaultValue: 'the map\'s BPM',
                examples: ['-bpm 200', 'bpm:200'],
                commandTypes: ['message', 'interaction',]
            },
            {
                name: 'speed',
                type: 'float',
                required: false,
                description: 'The speed multiplier to calculate the map with. Overrides BPM. This value is still affected by mods',
                options: ['0.1-10'],
                defaultValue: '1',
                examples: ['-speed 1.5', 'speed:1.5'],
                commandTypes: ['message', 'interaction',]
            },
            {
                name: 'cs',
                type: 'float',
                required: false,
                description: 'The circle size to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
                examples: ['-cs 5.2', 'cs:10'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'ar',
                type: 'float',
                required: false,
                description: 'The approach rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
                examples: ['-ar 11', 'ar:10'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'od',
                type: 'float',
                required: false,
                description: 'The overall difficulty to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
                examples: ['-od 11', 'od:9'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'hp',
                type: 'float',
                required: false,
                description: 'The drain rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
                examples: ['-hp 3', 'hp:5'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'ppcalc',
                type: 'boolean',
                required: false,
                description: 'Shows only the pp calculations for the map. See [here](https://sbrstrkkdwmdr.github.io/sbrbot/commands.html#osucmd-ppcalc) for more info.',
                options: ['N/A'],
                defaultValue: 'false',
                examples: ['-pp', '-calc'],
                commandTypes: ['message']
            },
            {
                name: 'bg',
                type: 'boolean',
                required: false,
                description: 'Show only the background images of the map',
                options: ['N/A'],
                defaultValue: 'false',
                examples: ['-pp', '-calc'],
                commandTypes: ['message']
            },
        ]
    },
    {
        name: 'maplb',
        description: 'Shows the leaderboard of a map.',
        usage: 'maplb [id] [-page/-p] [-parse]',
        slashusage: 'maplb [id] [page] [mods] [parse]',
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
        aliases: ['leaderboard', 'mapleaderboard', 'ml'],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last,],
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
                description: `The mods to filter the leaderboard by. ${mods}`,
                options: ['N/A'],
                defaultValue: 'none',
                examples: ['+HDHR', 'mods:EZFL'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'parse',
                type: 'integer',
                required: false,
                description: 'Parse the score with the specific index',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['-parse 5', 'parse:5'],
                commandTypes: ['message', 'interaction']
            },
        ]
    },
    {
        name: 'maprandom',
        description: 'Returns the link to a random beatmap. Uses local storage so selection might be limited.',
        usage: 'maprandom [-(type)]',
        slashusage: 'maprandom [type]',
        examples: [
            {
                text: 'PREFIXMSGf2',
                descriptor: 'Returns a random beatmap'
            },
            {
                text: 'PREFIXMSGmaprand -ranked',
                descriptor: 'Returns a random ranked beatmap'
            }
        ],
        aliases: ['f2', 'maprand', 'randommap', 'randmap'],
        options: [{
            name: 'Type',
            type: 'string',
            required: false,
            description: 'Filters to only pick from this type of map',
            options: ['Ranked', 'Loved', 'Approved', 'Qualified', 'Pending', 'WIP', 'Graveyard'],
            defaultValue: 'null',
            examples: ['-ranked', '-wip'],
            commandTypes: ['message', 'interaction']
        }]
    },
    {
        name: 'maprecommend',
        description: 'Recommends a random map based off of your recommended difficulty.',
        usage: 'maprecommend [-range] [user]',
        slashusage: 'maprecommend [range] [user]',
        examples: [
            {
                text: 'PREFIXMSGmaprec -range 2 SaberStrike',
                descriptor: 'Recommends a random map for SaberStrike with a maximum star rating difference of 2'
            }
        ],
        aliases: ['recmap', 'recommendmap', 'maprec', 'mapsuggest', 'suggestmap'],
        options: [
            user, mode,
            {
                name: 'range',
                type: 'float',
                required: false,
                description: 'The maximum difference in star rating the recommended map can be',
                options: ['range', 'r', 'diff'],
                defaultValue: '1',
                examples: ['-range 0.5'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'How to fetch the recommended map',
                options: ['closest', 'random'],
                defaultValue: 'random',
                examples: ['-closest'],
                commandTypes: ['message']
            }
        ]
    },
    {
        name: 'nochokes',
        description: 'Shows the user\'s top plays if no scores had a miss.\n' + scoreListString,
        usage: 'nochokes [user] [-page/-p] [-(mode)] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        slashusage: 'nochokes [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed] [parse] [filter] [grade]',
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
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.user],
        options: scoreListCommandOptions
    },
    {
        name: 'osu',
        description: 'Shows information about a user\'s osu! profile.',
        usage: 'osu [user] [-graph/-g] [-detailed/-d] [-(mode)]',
        slashusage: 'osu [user] [detailed] [mode]',
        linkusage: [
            'osu.ppy.sh/u/<user>',
            'osu.ppy.sh/users/<user>/[(mode)]',
        ],
        aliases: ['o', 'profile', 'user', 'taiko', 'drums', 'fruits', 'ctb', 'catch', 'mania'],
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
                text: 'osu.ppy.sh/u/15222484/osu',
                descriptor: 'Shows SaberStrike\'s osu profile'
            }
        ],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.graph],
        options: [
            user, mode,
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
                name: 'graph',
                type: 'boolean',
                required: false,
                description: 'Whether to show only user statistics graphs',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: ['-g', '-graph'],
                commandTypes: ['message']
            },
        ]
    },
    {
        name: 'osuset',
        description: 'Sets your osu! username/mode/skin or any setting.',
        usage: 'osuset <username> [-(mode)] [-skin] [-timezone] [-location]',
        slashusage: 'osuset <username> [mode] [skin]',
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
        aliases: ['setuser', 'set', 'setmode', 'setskin', 'settime', 'settz', 'setweather', 'setlocation'],
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
            },
            {
                name: 'timezone',
                type: 'string',
                required: false,
                description: 'The timezone to set',
                options: ['N/A'],
                defaultValue: 'null',
                examples: ['-timezone auckland', '-tz UTC+6'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'location',
                type: 'string',
                required: false,
                description: 'The location to set',
                options: ['N/A'],
                defaultValue: 'null',
                examples: ['-location melbourne', '-weather melbourne'],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'osutop',
        description: 'Shows the top scores of a user.\n' + scoreListString,
        usage: 'osutop [user] [-page/-p] [-(mode)] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        slashusage: 'osutop [user] [mode] [sort] [reverse] [page] [mapper] [mods] [detailed] [parse] [filter] [grade]',
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
            },
            {
                text: 'PREFIXMSGsotarks',
                descriptor: 'Returns your top plays mapped by sotarks'
            }
        ],
        aliases: [
            'top', 't', 'ot', 'topo', 'toposu',
            'taikotop', 'toptaiko', 'tt', 'topt',
            'ctbtop', 'fruitstop', 'catchtop', 'topctb', 'topfruits', 'topcatch', 'tf', 'tctb', 'topf', 'topc',
            'maniatop', 'topmania', 'tm', 'topm',
        ],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.user],
        options: scoreListCommandOptions
    },
    {
        name: 'pinned',
        description: 'Shows the pinned scores of a user.\n' + scoreListString,
        usage: 'pinned [user] [-page/-p] [-(mode)] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        slashusage: 'pinned [user] [mode] [sort] [reverse] [page] [mapper] [mods] [parse] [filter] [grade]',
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
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.user],
        options: scoreListCommandOptions
    },
    {
        name: 'ppcalc',
        description: 'Gives the full performance calculations for a map.',
        usage: 'ppcalc [-? "(query)"] [id] +[mods] [-bpm] [-speed] [-cs] [-ar] [-od] [-hp]',
        slashusage: 'ppcalc [query] [id] [mods] [detailed] [bpm] [speed] [cs] [ar] [od] [hp]',
        examples: [
            {
                text: 'PREFIXMSGppcalc +EZHTFL',
                descriptor: 'Calculates the performance for the previous map with easy, halftime and flashlight'
            },
            {
                text: 'PREFIXMSGppcalc 4204 -speed 2 -cs 10',
                descriptor: 'Calculates beatmap 4204 at 2x speed and circle size 10'
            },
            {
                text: 'PREFIXMSGppcalc -bpm 220 -ar 11 -od 11 -cs 5.2',
                descriptor: 'Calculates the previous beatmap at 220bpm, AR11 OD11 and CS5.2'
            }
        ],
        aliases: ['mapcalc', 'mapperf', 'maperf', 'mappp'],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore],
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
                commandTypes: ['message', 'interaction', 'link', 'button']
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: `The mods to calculate the map with. ${mods}`,
                options: ['N/A'],
                defaultValue: 'none',
                examples: ['+HDHR', 'mods:HDDTHR'],
                commandTypes: ['message', 'interaction', 'link']
            },
            {
                name: 'bpm',
                type: 'float',
                required: false,
                description: 'The BPM to calculate the map with. This value is still affected by mods',
                options: ['1-1000'],
                defaultValue: 'the map\'s BPM',
                examples: ['-bpm 200', 'bpm:200'],
                commandTypes: ['message', 'interaction', 'link']
            },
            {
                name: 'speed',
                type: 'float',
                required: false,
                description: 'The speed multiplier to calculate the map with. Overrides BPM. This value is still affected by mods',
                options: ['0.1-10'],
                defaultValue: '1',
                examples: ['-speed 1.5', 'speed:1.5'],
                commandTypes: ['message', 'interaction', 'link']
            },
            {
                name: 'cs',
                type: 'float',
                required: false,
                description: 'The circle size to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
                examples: ['-cs 5.2', 'cs:10'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'ar',
                type: 'float',
                required: false,
                description: 'The approach rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
                examples: ['-ar 11', 'ar:10'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'od',
                type: 'float',
                required: false,
                description: 'The overall difficulty to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
                examples: ['-od 11', 'od:9'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'hp',
                type: 'float',
                required: false,
                description: 'The drain rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                defaultValue: 'The current map\'s value',
                examples: ['-hp 3', 'hp:5'],
                commandTypes: ['message', 'interaction']
            },
        ]
    },
    {
        name: 'pp',
        description: 'Estimates the rank of a user from the pp given. If a value matches the database, that will be used instead of an estimation.',
        usage: 'pp <value> [-(mode)]',
        slashusage: 'pp <value> [mode]',
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
        description: 'Estimates the performance points of a user from the rank given. If a value matches the database, that will be used instead of an estimation.',
        usage: 'rank <value> [-(mode)]',
        slashusage: 'rank <value> [mode]',
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
        description: 'Displays the global leaderboards.',
        usage: 'ranking [country] [-page/-p][-(mode)] [-parse]',
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
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last],
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
        },
        {
            name: 'parse',
            type: 'integer',
            required: false,
            description: 'Parses the user with the given index',
            options: ['N/A'],
            defaultValue: '1',
            examples: ['parse:3', '-parse 727'],
            commandTypes: ['message', 'interaction']
        },
        ]
    },
    {
        name: 'recent',
        description: 'Shows the recent score(s) of a user.\nThe following only applies to list mode:\n' + scoreListString,
        usage: 'recent [user] [-page/-p] [-list/-l] [-(mode)] [-passes/-pass/-nofail/-nf] [-mapper] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        slashusage: 'recent [user] [page] [mode] [list] [filter] [grade]',
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
                descriptor: 'Shows the second page of a list of your recent scores'
            },
            {
                text: 'PREFIXMSGrsbest',
                descriptor: 'Shows a list of your recent scores, sorted by pp'
            },
            {
                text: 'PREFIXMSGrl -mania',
                descriptor: 'Shows a list of your recent mania scores'
            },
            {
                text: 'PREFIXMSGrlm @SaberStrike',
                descriptor: 'Shows a list of SaberStrike\'s recent mania scores'
            },
            {
                text: 'PREFIXMSGrt -p 2',
                descriptor: 'Shows your second most recent taiko score'
            },
            {
                text: 'PREFIXMSGrl -nf -? "Shinbatsu"',
                descriptor: 'Shows your recent scores with the map name/difficulty/artist/creator matching "shinbatsu", excluding fails'
            }
        ],
        aliases: ['rs', 'r', 'rt', 'rf', 'rm', 'rctb', 'rl', 'rlt', 'rlf', 'rlm', 'rlctb', 'rsbest', 'recentbest', 'rb'],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.map, buttonsObjs.label.extras.user],
        options: scoreListCommandOptions.slice(0, 9).concat(
            scoreListCommandOptions.slice(11))
            .concat([
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
                },
                {
                    name: 'passes',
                    type: 'boolean',
                    required: false,
                    description: 'Whether to show only scores that were passed. If false, all scores will be shown',
                    options: ['true', 'false'],
                    defaultValue: 'true',
                    aliases: ['pass', 'nofail', 'nf'],
                    examples: ['-pass',],
                    commandTypes: ['message']
                },
                {
                    name: '-?',
                    type: 'string',
                    required: false,
                    description: 'Filter scores by maps matching the given string',
                    options: [''],
                    defaultValue: 'null',
                    aliases: [],
                    examples: ['-? "shinbatsu o tadori"',],
                    commandTypes: ['message']
                },
                {
                    name: 'passes',
                    type: 'boolean',
                    required: false,
                    description: 'Whether to show only scores that were passed. If false, all scores will be shown',
                    options: ['true', 'false'],
                    defaultValue: 'true',
                    aliases: ['pass', 'nofail', 'nf'],
                    examples: ['-pass',],
                    commandTypes: ['message']
                },
            ])
    },
    {
        name: 'recentactivity',
        description: 'Displays the user\'s most recent activity.',
        usage: 'recentactivity [user] [-page]',
        slashusage: 'recentactivity [user] [page]',
        examples: [],
        aliases: ['recentact', 'rsact'],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last, buttonsObjs.label.extras.user],
        options: [
            user,
            {
                name: 'page',
                type: 'integer',
                required: false,
                description: 'The page of activities to show',
                options: ['N/A'],
                defaultValue: '1',
                aliases: ['p'],
                examples: ['-p 2', 'page:2'],
                commandTypes: ['message', 'interaction', 'button']
            },
        ]
    },
    {
        name: 'saved',
        description: 'Shows a user\'s saved settings.',
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
            userAdmin,
        ]
    },
    {
        name: 'scoreparse',
        description: 'Returns information about a score. Doesn\'t work with new score ID system.',
        usage: 'scoreparse <id> [mode]',
        linkusage: [
            'osu.ppy.sh/scores/<mode>/<id>'
        ],
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
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.map, buttonsObjs.label.extras.user],
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
        description: 'Shows the scores of a user on a beatmap.\n' + scoreListString,
        usage: 'scores [user] [id] [-page/-p] [-mods] [-modx] [-exmod] [-reverse] [-(sort)] [-parse] [-?] [-(detailed)] [-grade] [-pp] [-score] [-acc] [-combo] [-miss] [-bpm]',
        slashusage: 'scores [user] [id] [sort] [reverse] [page] [detailed] [parse] [grade]',
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
            },
            {
                text: 'PREFIXMSGc https://osu.ppy.sh/beatmapsets/3367#osu/21565',
                descriptor: 'Shows your scores on the beatmap with the id 21565'
            },
        ],
        aliases: ['c'],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.user],
        options:
            scoreListCommandOptions.concat([
                {
                    name: 'id',
                    type: 'integer/map link',
                    required: false,
                    description: 'The map ID to search for',
                    options: ['N/A'],
                    defaultValue: 'the most recent map in the guild',
                    examples: ['4204', 'id:4204'],
                    commandTypes: ['message', 'interaction', 'link', 'button']
                },
            ])
    },
    {
        name: 'scorestats',
        description: 'Shows the stats of a user\'s scores.',
        usage: 'scorestats [user] [-(type)] [-(mode)] [all]',
        slashusage: 'scorestats [user] [type] [mode] [all]',
        examples: [
            {
                text: 'PREFIXMSGscorestats @SaberStrike',
                descriptor: 'Shows scorestats for SaberStrike\'s top plays'
            },
            {
                text: 'PREFIXMSGscorestats mrekk -firsts',
                descriptor: 'Shows scorestats for mrekk\'s firsts'
            }
        ],
        aliases: ['ss'],
        buttons: [buttonsObjs.label.main.detailed, buttonsObjs.label.extras.user],
        options: [
            user, mode,
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'The type of scores to use',
                options: ['best', 'firsts', 'recent', 'pinned'],
                defaultValue: 'best',
                examples: ['type:recent', '-firsts'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'details',
                type: 'boolean',
                required: false,
                description: 'Sends two txt files with every mapper and mod combination calculated',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: [],
                commandTypes: ['button']
            },
            {
                name: 'all',
                type: 'boolean',
                required: false,
                description: 'Shows all statistics. May cause the command to lag as it needs to download all maps associated with each score.',
                options: ['true', 'false'],
                defaultValue: 'false',
                examples: [],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'simulate',
        description: 'Simulates a score on a beatmap.',
        usage: 'simulate [id] +[(mods)]  [-acc] [-combo] [-n300] [-n100] [-n50] [-miss] [-bpm] [-speed]',
        slashusage: 'simulate [id] [mods] [accuracy] [combo] [n300] [n100] [n50] [misses] [bpm] [speed]',
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
                description: `The mods to simulate the score with. ${mods}`,
                options: ['N/A'],
                defaultValue: 'none',
                examples: ['+HDDT', 'mods:HDDT'],
                commandTypes: ['message', 'interaction'],
                aliases: ['-mods', '+[mods]']
            },
            {
                name: 'accuracy',
                type: 'float',
                required: false,
                description: 'The accuracy to simulate the score with',
                options: ['0-100'],
                defaultValue: '100',
                examples: ['acc=98.79'],
                commandTypes: ['message', 'interaction'],
                aliases: ['-acc']
            },
            {
                name: 'combo',
                type: 'integer',
                required: false,
                description: 'The maximum combo to simulate the score with',
                options: ['N/A'],
                defaultValue: 'map max combo',
                examples: ['combo=999'],
                commandTypes: ['message', 'interaction'],
                aliases: ['-combo', '-x', 'maxcombo', '']
            },
            {
                name: 'n300',
                type: 'integer',
                required: false,
                description: 'The number of hit 300s to simulate the score with',
                options: ['N/A'],
                defaultValue: 'calculated from accuracy',
                examples: ['n300=1200'],
                commandTypes: ['message', 'interaction'],
                aliases: ['-300s']
            },
            {
                name: 'n100',
                type: 'integer',
                required: false,
                description: 'The number of hit 100s to simulate the score with',
                options: ['N/A'],
                defaultValue: 'calculated from accuracy',
                examples: ['n100=12'],
                commandTypes: ['message', 'interaction'],
                aliases: ['-100s']
            },
            {
                name: 'n50',
                type: 'integer',
                required: false,
                description: 'The number of hit 50s to simulate the score with',
                options: ['N/A'],
                defaultValue: 'calculated from accuracy',
                examples: ['n50=2'],
                commandTypes: ['message', 'interaction'],
                aliases: ['-50s']
            },
            {
                name: 'misses',
                type: 'integer',
                required: false,
                description: 'The number of misses to simulate the score with',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['miss=2'],
                commandTypes: ['message', 'interaction'],
                aliases: ['-miss']
            },
            {
                name: 'bpm',
                type: 'float',
                required: false,
                description: 'The bpm to simulate the score with',
                options: ['N/A'],
                defaultValue: 'map bpm',
                examples: ['-bpm 200'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'speed',
                type: 'float',
                required: false,
                description: 'The speed multiplier to simulate the score with',
                options: ['N/A'],
                defaultValue: '1',
                examples: ['-speed 1.5'],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'trackadd',
        description: 'Adds a user to the tracklist. Only works in the guild\'s set tracking channel.',
        usage: 'trackadd <user>',
        slashusage: 'trackadd <user>',
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
            userTrack,
        ]
    },
    {
        name: 'trackchannel',
        description: 'Sets the channel to send tracklist updates to.',
        usage: 'trackchannel <channel>',
        slashusage: 'trackchannel <channel>',
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
        name: 'tracklist',
        description: 'Displays a list of the currently tracked users in the server.',
        usage: 'tracklist',
        slashusage: 'tracklist',
        examples: [],
        aliases: ['tl'],
        buttons: [buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last,],
        options: []
    },
    {
        name: 'trackremove',
        description: 'Removes a user from the tracklist. Only works in the guild\'s set tracking channel.',
        usage: 'trackremove <user>',
        slashusage: 'trackremove <user>',
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
            userTrack,
        ]
    },
    {
        name: 'userbeatmaps',
        description: 'Shows a user\'s beatmaps. (favourites/ranked/pending/graveyard/loved)',
        usage: 'userbeatmaps [user] [-(type)] [-reverse] [-page/-p] [-parse] [-?]',
        slashusage: 'userbeatmaps [user] [type] [reverse] [page] [sort] [parse] [filter]',
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
        aliases: ['ub', 'userb', 'ubm', 'um', 'usermaps',
            'ranked', 'favourite', 'favourites', 'graveyard', 'unranked', 'loved', 'pending', 'wip', 'nominated', 'bn', 'guest', 'gd', 'most_played', 'mp', 'mostplayed'
        ],
        buttons: [buttonsObjs.label.main.refresh, buttonsObjs.label.page.first, buttonsObjs.label.page.previous, buttonsObjs.label.page.search, buttonsObjs.label.page.next, buttonsObjs.label.page.last, buttonsObjs.label.main.detailLess, buttonsObjs.label.main.detailMore, buttonsObjs.label.extras.user],
        options: [
            user,
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
            },
            {
                name: 'parse',
                type: 'integer',
                required: false,
                description: 'Parses the beatmap with the given index',
                options: ['N/A'],
                defaultValue: '1',
                examples: ['parse:3', '-parse 727'],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'filter',
                type: 'string',
                required: false,
                description: 'Filters the beatmaps by the given string',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: ['filter:hard', '-? "blue dragon"'],
                commandTypes: ['message', 'interaction']
            },
        ]
    },
    {
        name: 'whatif',
        description: 'Estimates user stats if they gain a certain amount of raw pp.',
        usage: 'whatif [user] <pp>',
        slashusage: 'whatif [user] <pp>',
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
        aliases: ['wi'],
        buttons: [buttonsObjs.label.extras.user],
        options: [
            user, mode,
            {
                name: 'pp',
                type: 'float',
                required: true,
                description: 'The amount of raw pp to gain',
                options: ['N/A'],
                defaultValue: '0',
                examples: ['72700', 'pp:72700'],
                commandTypes: ['message', 'interaction']
            },
        ]
    }
];

const misccommands = [
    {
        name: '8ball',
        description: 'Returns a yes/no/maybe answer to a question.',
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
        name: 'coin',
        description: 'Flips a coin.',
        usage: 'coin',
        slashusage: 'coin',
        examples: [],
        aliases: ['coinflip', 'flip'],
        options: []
    },
    {
        name: 'gif',
        description: 'Sends a gif.',
        usage: '<type> [target]',
        slashusage: '<type> <target>',
        examples: [
            {
                text: '/slap @SaberStrike',
                descriptor: 'Sends a random gif matching "slap"'
            }
        ],
        aliases: ['hug', 'kiss', 'lick', 'pet', 'punch', 'slap'],
        options: [
            {
                name: 'type',
                type: 'string',
                required: true,
                description: 'The type of gif to send',
                options: ['hug', 'kiss', 'lick', 'pet', 'punch', 'slap'],
                defaultValue: 'N/A',
                examples: [''],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'target',
                type: 'user mention',
                required: true,
                description: 'The user to target',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: [''],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'image',
        description: 'Sends an image.',
        usage: 'image <query>',
        slashusage: 'image <query>',
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
        name: 'inspire',
        description: 'Sends a randomly generated inspirational quote.',
        usage: 'inspire',
        slashusage: 'inspire',
        examples: [],
        aliases: ['insp'],
        options: [],
    },
    {
        name: 'janken',
        description: 'Plays janken with the bot. (aka paper scissors rock or rock paper scissors or whatever weird order it\'s in).',
        usage: 'janken',
        slashusage: 'janken',
        examples: [],
        aliases: ['paperscissorsrock', 'rockpaperscissors', 'rps', 'psr'],
        options: [
            {
                name: 'choice',
                type: 'string',
                required: true,
                description: 'Paper, scissors or rock.',
                options: ['rock', 'paper', 'scissors', 'グー', 'チョキ', 'パー'],
                defaultValue: 'N/A',
                examples: ['N/A'],
                commandTypes: ['message', 'interaction']
            }
        ],
    },
    {
        name: 'poll',
        description: 'Creates a poll.',
        usage: 'poll <question>',
        slashusage: 'poll <question> [options]',
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
        description: 'Rolls a random number.',
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
        aliases: ['rng', 'randomnumber', 'randomnumbergenerator', 'pickanumber', 'pickanum'],
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
        description: 'Sends a message.',
        usage: 'say <message>',
        slashusage: 'say <message> [channel]',
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
        description: 'Searches youtube for a video.',
        usage: 'ytsearch <query>',
        slashusage: 'ytsearch <query>',
        examples: [
            {
                text: 'PREFIXMSGytsearch never gonna give you up',
                descriptor: 'Searches youtube for "never gonna give you up"'
            }
        ],
        aliases: ['yt', 'yts'],
        options: [
            {
                name: 'query',
                type: 'string',
                required: true,
                description: 'The video to search for.',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: ['osus', 'query:osus'],
                commandTypes: ['message', 'interaction']
            }
        ]
    }
];

const admincommands = [
    {
        name: 'checkperms',
        description: 'Checks the permissions of the user.',
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
            userAdmin,
        ]
    },
    {
        name: 'userinfo',
        description: 'Returns information about a user.',
        usage: 'userinfo [user]',
        slashusage: 'userinfo [user]',
        examples: [
            {
                text: 'PREFIXMSGuser @SSoB',
                descriptor: 'Returns information about the user @SSoB'
            },
            {
                text: '/userinfo user:SSoB',
                descriptor: 'Returns information about the user SSoB'
            }
        ],
        aliases: ['userinfo'],
        options: [
            userAdmin,
        ]
    },
    {
        name: 'avatar',
        description: 'Gets the avatar of a user.',
        usage: 'avatar [user]',
        slashusage: 'avatar [user]',
        examples: [
            {
                text: 'PREFIXMSGavatar @SSoB',
                descriptor: 'Gets information about the user @SSoB'
            },
            {
                text: '/avatar user:SSoB',
                descriptor: 'Gets information about the user SSoB'
            }
        ],
        aliases: ['av', 'pfp'],
        options: [
            userAdmin,
        ]
    },
    {
        name: 'debug',
        description: 'Runs a debugging command.',
        usage: 'debug <type> [arg]',
        slashusage: 'debug <type> [arg]',
        examples: [
            {
                text: 'PREFIXMSGdebug commandfile 1',
                descriptor: 'Returns all files associated with the command matching ID 1'
            },
            {
                text: 'PREFIXMSGdebug commandfiletype map',
                descriptor: 'Returns all files associated with the command "map"'
            },
            {
                text: 'PREFIXMSGdebug servers',
                descriptor: 'Returns a list of all guilds the bot is in'
            },
            {
                text: 'PREFIXMSGdebug channels',
                descriptor: 'Returns a list of all channels in the current guild'
            },
            {
                text: 'PREFIXMSGdebug users',
                descriptor: 'Returns a list of all members in the current guild'
            },
            {
                text: 'PREFIXMSGdebug forcetrack',
                descriptor: 'Forces the osu!track to run a cycle (takes a minute to complete)'
            },
            {
                text: 'PREFIXMSGdebug curcmdid',
                descriptor: 'Returns the current command\'s ID'
            },
            {
                text: 'PREFIXMSGdebug logs',
                descriptor: 'Returns the logs associated with the current guild'
            },
            {
                text: 'PREFIXMSGdebug clear all',
                descriptor: 'Deletes all command-related files cached'
            },
            {
                text: 'PREFIXMSGdebug maps name',
                descriptor: 'Returns all maps stored in the cache, and lists them by name'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'The type of debug to perform',
                options: ['commandfile', 'commandfiletype', 'servers', 'channels', 'users', 'forcetrack', 'curcmdid', 'logs', 'clear', 'maps', 'ls', 'memory'],
                defaultValue: 'list options',
                examples: [''],
                commandTypes: ['message',]
            }, {
                name: 'arg',
                type: 'integer/string',
                required: false,
                description: 'commandfile -> the id of the command to search for\ncommandfiletype -> the name of the command to search\nlogs -> the ID of the guild to send logs from\nclear -> the types of files to clear (read the options section)',
                options: ['normal', 'all (only cmd data)', 'trueall', 'map', 'users', 'previous', 'pmaps', 'pscores', 'pusers', 'errors', 'graph'],
                defaultValue: 'commandfile -> latest command\ncommandfiletype -> list options\nlogs -> current server\n clear -> temporary files only',
                examples: [''],
                commandTypes: ['message',]
            }
        ]
    },
    {
        name: 'find',
        description: 'Finds details of a user/guild/channel/role/emoji/sticker.',
        usage: 'find <type> <ID>',
        slashusage: 'find <type> <ID>',
        examples: [
            {
                text: 'PREFIXMSGfind user 777125560869978132',
                descriptor: 'Returns info for user with id 777125560869978132'
            }
        ],
        aliases: ['get'],
        options: [
            {
                name: 'type',
                type: 'string',
                required: true,
                description: 'The type of info to fetch',
                options: ['user', 'guild', 'channel', 'role', 'emoji', 'sticker'],
                defaultValue: 'N/A',
                examples: [''],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'id',
                type: 'integer',
                required: true,
                description: 'The ID to fetch',
                options: ['N/A'],
                defaultValue: 'N/A',
                examples: [''],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'leaveguild',
        description: 'Makes the bot leave a guild.',
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
        description: 'Set\'s the prefix of the current server.',
        usage: 'prefix <prefix>',
        slashusage: 'prefix <prefix>',
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
        name: 'purge',
        description: 'Deletes a specified amount of messages from the current channel.',
        usage: 'purge [count] [user] [-method]',
        slashusage: 'purge [count] [user] [method]',
        examples: [
            {
                text: 'PREFIXMSGpurge 5 12345689',
                descriptor: 'Deletes 5 messages from the user with the ID 12345689'
            },
            {
                text: 'PREFIXMSGpurge 5 @testsubject',
                descriptor: 'Deletes 5 messages from the user "testsubject"'
            },
            {
                text: 'PREFIXMSGpurge 5 -fetch',
                descriptor: 'Deletes 5 messages using the fetch method'
            },
        ],
        aliases: [],
        options: [
            {
                name: 'count',
                type: 'integer',
                required: false,
                description: 'The amount of messages to delete',
                options: ['0-100'],
                defaultValue: '5',
                examples: [],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'user',
                type: 'string/user mention',
                required: false,
                description: 'The user\'s messages to delete. Deletes messages from any user if unspecified',
                options: [],
                defaultValue: 'N/A',
                examples: [''],
                commandTypes: ['message', 'interaction']
            },
            {
                name: 'method',
                type: 'string',
                required: false,
                description: 'The method to delete messages. Fetch is slower, but can delete messages older than 14 days. Bulk cannot be used if user is specified.',
                options: ['bulk', 'fetch'],
                defaultValue: 'bulk',
                examples: [''],
                commandTypes: ['message', 'interaction']
            }
        ]
    },
    {
        name: 'servers',
        description: 'Shows the servers the bot is in.',
        usage: 'servers',
        slashusage: 'servers',
        examples: [],
        aliases: [],
        options: []
    }
];

const buttons = [
    {
        name: 'Refresh',
        description: 'Refreshes the current embed',
        emoji: buttonsObjs.label.main.refresh,
    }, {
        name: 'BigLeftArrow',
        description: 'Switches to the first page',
        emoji: buttonsObjs.label.page.first,
    }, {
        name: 'LeftArrow',
        description: 'Switches to the previous page',
        emoji: buttonsObjs.label.page.previous,
    }, {
        name: 'Search',
        description: 'Switches to the chosen page',
        emoji: buttonsObjs.label.page.search,
    }, {
        name: 'RightArrow',
        description: 'Switches to the next page',
        emoji: buttonsObjs.label.page.next,
    }, {
        name: 'BigRightArrow',
        description: 'Switches to the last page',
        emoji: buttonsObjs.label.page.last,
    }, {
        name: 'detailMore',
        description: 'Expands the current embed',
        emoji: buttonsObjs.label.main.detailMore,
    }, {
        name: 'detailLess',
        description: 'Collapses the current embed',
        emoji: buttonsObjs.label.main.detailLess,
    }, {
        name: 'Detailed',
        description: 'Toggles the amount of content on the current embed',
        emoji: buttonsObjs.label.main.detailed,
    }, {
        name: 'Random',
        description: 'Picks a random command to display',
        emoji: buttonsObjs.label.extras.random,
    }, {
        name: 'Graph',
        description: 'Displays any graphs related',
        emoji: buttonsObjs.label.extras.graph
    }, {
        name: 'Map',
        description: 'Displays the map of the current score(s)',
        emoji: buttonsObjs.label.extras.map
    }, {
        name: 'User',
        description: 'Displays the user',
        emoji: buttonsObjs.label.extras.user
    }, {
        name: 'Leaderboard',
        description: 'Displays the leaderboard of the map or other scores the user has on that map',
        emoji: buttonsObjs.label.extras.leaderboard
    }, {
        name: 'Time',
        description: 'Displays the time for the given region',
        emoji: buttonsObjs.label.extras.time
    }, {
        name: 'Weather',
        description: 'Displays the weather for the given region',
        emoji: buttonsObjs.label.extras.weather
    }

];

const conversionData = {
    temp_c: ['Celsius', '℃', '°C', 'Celcius', 'Centigrade', 'C',],
    temp_f: ['Fahrenheit', '℉', '°F', 'F'],
    temp_k: ['Kelvin', '°K', 'K'],
    dist_in: ['Inch', 'in', '\'', '`'],
    dist_ft: ['Feet', 'ft', 'foot', '"', "''", '``'],
    dist_m: ['Metre', 'm', 'Meter'],
    dist_mi: ['Mile', 'mi'],
    dist_au: ['Astronomical Unit', 'au'],
    dist_ly: ['Light Year', 'ly'],
    dist_pc: ['Parsec', 'pc'],
    time_s: ['Second', 's', 'sec'],
    time_min: ['Minute', 'min',],
    time_hr: ['Hour', 'h', 'hr'],
    time_d: ['Day', 'd',],
    time_wk: ['Week', 'wk', 'sennight',],
    time_fn: ['Fortnight', 'fn'],
    time_mth: ['Month', 'mth', 'mon'],
    time_qua: ['Quarantine', null, 'quarantina', 'quarentine'],
    time_yr: ['Year', 'yr',],
    time_dec: ['Decade',],
    time_cen: ['Century', 'cent'],
    time_mil: ['Millennium', null, 'Millennia',],
    time_ma: ['Megaannum',],
    time_eon: ['Eon',],
    vol_tsp: ['Teaspoon', 'tsp',],
    vol_tbp: ['Tablespoon', 'tbp',],
    vol_floz: ['Fluid Ounce', 'floz'],
    vol_c: ['Cup', 'c',],
    vol_pt: ['Pint', 'pt',],
    vol_l: ['Litre', 'Liter', 'L'],
    vol_gal: ['Galloon', 'gal',],
    vol_m3: ['Cubic Metre', 'm³', 'm3', 'm^3'],
    mass_g: ['Gram', 'g'],
    mass_oz: ['Ounce', 'oz'],
    mass_lb: ['Pound', 'lb'],
    mass_st: ['Stone', 'st'],
    mass_t: ['US Ton', 't', 'Ton',],
    mass_mt: ['Metric Tonne', 'mt', 'Tonne',],
    pres_pa: ['Pascal', 'Pa', 'N m² ⁻¹', 'N/m^2', 'N/m', 'Nm'],
    pres_mmHg: ['millimetre of Mercury', 'mmHg', 'Torr', 'millimeter of Mercury',],
    pres_psi: ['Pounds per square inch', 'psi'],
    pres_bar: ['Bar'],
    pres_atm: ['Standard Atmosphere', 'atm', 'Atmosphere', 'std atm'],
    nrg_ev: ['Electron Volt', 'eV', 'Electronvolt'],
    nrg_j: ['Joule', 'j'],
    nrg_cal: ['Calorie', 'cal'],
    nrg_btu: ['British Thermal Unit', 'btu'],
    nrg_wh: ['Watt Hour', 'wH'],
    pow_w: ['Watt', 'w'],
    pow_horse: ['Horse Power', 'hp'],
    pow_erg: ['Ergs', 'erg s⁻¹', 'erg/s'],
    pow_ftlbsec: ['Foot-pounds per second', 'ft lb s⁻¹', 'ftlb/s', 'ft lb s', 'ftlbs', 'ftlbsec', 'ft lb sec'],
    pow_dbm: ['Decibel-milliwatts', 'dBm', 'dbmw'],
    pow_btusec: ['BTU per second', 'btu s⁻¹', 'btus', 'btusec',],
    pow_calsec: ['Calories per second', 'cal s⁻¹', 'cals', 'calsec'],
    area_in2: ['Square inch', 'in²', 'in2', 'sqin'],
    area_ft2: ['Square foot', 'ft²', 'ft2', 'sqft'],
    area_m2: ['Square metre', 'm²', 'm2', 'sqm'],
    area_ac: ['Acre', 'ac'],
    area_ha: ['Hectare', 'Ha'],
    area_km2: ['Square kilometre', 'km²', 'km2', 'sqkm'],
    area_mi2: ['Square mile', 'mi²', 'mi2', 'sqmi'],
    angle_grad: ['Gradian', 'grad'],
    angle_deg: ['Degree', 'deg'],
    angle_rad: ['Radian', 'rad'],
    speed_kmh: ['Kilometres per hour', 'km h⁻¹', 'kmh', 'kph', 'km/h'],
    speed_mph: ['Miles per hour', 'mi h⁻¹', 'mph', 'mih', 'mi/h', 'm/h'],
    speed_kt: ['Knot', 'kt', 'nmi h⁻¹', 'nmih', 'nmh', 'Nautical miles per hour'],
    speed_ms: ['Metres per second', 'm s⁻¹', 'ms', 'mps', 'm/s',],
    speed_c: ['Light', 'c', 'lightspeed'],
    base_bin: ['Binary', 'bin', 'base2'],
    base_oct: ['Octal', 'oct', 'base8'],
    base_dec: ['Decimal', 'dec', 'base10'],
    base_hex: ['Hexadecimal', 'hex', 'base16'],
}