import * as bottypes from '../types/bot.js';

import * as buttonsObjs from './buttons.js';

const mods = 'See [here](https://sbrstrkkdwmdr.github.io/projects/ssob_docs/types.html#mods)';
const scoreListString =
    `Mods can be specified with +[mods], -mx [exact mods] or -me [exclude mods]
The arguments \`pp\`, \`score\`, \`acc\`, \`bpm\` and \`miss\` use the following format:
\`-key value\` to filter by that exact value (eg. -bpm 220)
\`-key >value\` to filter scores above that value (eg. -pp >500)
\`-key <value\` to filter scores below that value (eg. -acc <90)
\`-key min..max\` to filter scores between min and max (eg. -miss 1..3)
\`-key !value\` to filter scores that dont equal that value (eg. -bpm !200)
The \`sort\` arg can be specified using -value (ie -recent)
You can also show a single score by using \`-parse <id>\` (eg. -parse 5)
`;

const range = (key: string): string[] => {
    const temp = ['>foo', '<foo', 'foo..bar', '!foo'];
    const temp2: string[] = [];
    temp.forEach(t => temp2.push('-' + key + ' ' + t));
    return temp2;
};

/**
 * <> is required
 * [] is optional
 */

const user: bottypes.commandInfoOption = {
    name: 'user',
    type: 'string/integer/user mention',
    required: false,
    description: 'The user to show',
    format: ['foo', '@foo', '-u foo', '-user foo', '-uid foo', 'osu.ppy.sh/u/foo', 'osu.ppy.sh/users/foo'],
    defaultValue: 'The user who ran the command',
};
const mode: bottypes.commandInfoOption = {
    name: 'mode',
    type: 'string',
    required: false,
    description: 'The mode to use',
    options: ['osu', 'taiko', 'fruits', 'mania'],
    format: ['-foo'],
    defaultValue: 'osu',
};
const page: bottypes.commandInfoOption = {
    name: 'page',
    type: 'integer',
    required: false,
    description: 'The page to show',
    format: ['-p foo', '-page foo'],
    defaultValue: '1',
};
const userTrack: bottypes.commandInfoOption = {
    name: 'user',
    type: 'string',
    required: true,
    description: 'The user to use',
    format: user.format,
    defaultValue: 'N/A',
};
const userAdmin: bottypes.commandInfoOption = {
    name: 'user',
    type: 'integer/user mention',
    required: false,
    description: 'The user to use',
    format: user.format,
    defaultValue: 'The user who ran the command',
};

const scoreListArgs = '[user] [page] [mode] [mapper] [mods] [modx] [exmod] [reverse] [sort] [parse] [query] [detailed] [-grade] [pp] [score] [acc] [combo] [miss] [bpm]';
const mapformat = ['foo',
    'osu.ppy.sh/b/foo',
    'osu.ppy.sh/s/SETID',
    'osu.ppy.sh/beatmaps/foo',
    'osu.ppy.sh/beatmapsets/SETID',
    'osu.ppy.sh/beatmapsets/SETID#MODE/foo'
];
const scoreListCommandOptions: bottypes.commandInfoOption[] = [
    user, mode,
    {
        name: 'sort',
        type: 'string',
        required: false,
        description: 'The sort order of the scores',
        options: ['pp', 'score', 'recent', 'acc', 'combo', 'miss', 'rank'],
        format: ['-foo'],
        defaultValue: 'pp',
    },
    {
        name: 'reverse',
        type: 'boolean',
        required: false,
        description: 'Whether to reverse the sort order',
        options: ['true', 'false (omit)'],
        format: ['-rev', '-reverse'],
        defaultValue: 'false',
    },
    page,
    {
        name: 'mapper',
        type: 'string',
        required: false,
        description: 'The mapper to filter the scores by',
        format: ['-mapper foo'],
        defaultValue: 'null',
    },
    {
        name: 'mods',
        type: 'string',
        required: false,
        description: `Filter scores including these mods. ${mods}`,
        format: ['-mods foo', '+foo'],
        defaultValue: 'null',
    },
    {
        name: 'exact mods',
        type: 'string',
        required: false,
        description: `Filter scores with these exact mods. ${mods}`,
        defaultValue: 'null',
        format: ['-mx foo'],
    },
    {
        name: 'exclude mods',
        type: 'string',
        required: false,
        description: `Filter scores to exclude these mods. ${mods}`,
        format: ['-me foo'],
        defaultValue: 'null',
    },
    {
        name: 'detailed',
        type: 'integer',
        required: false,
        description: 'How much information to show about the scores. 0 = less details, 2 = more details',
        format: ['-d', '-detailed'],
        defaultValue: '1',
    },
    {
        name: 'parse',
        type: 'integer',
        required: false,
        description: 'Parse the score with the specific index',
        format: ['-parse foo'],
        defaultValue: '0',
    },
    {
        name: 'query',
        type: 'string',
        required: false,
        description: 'Filters all scores to only show maps with the specified string',
        format: ['-? "foo"'],
        defaultValue: 'null',
    },
    {
        name: 'grade',
        type: 'string',
        required: false,
        description: 'Filters all scores to only show scores matching the given grade/rank',
        options: ['XH', 'SSH', 'X', 'SS', 'SH', 'S', 'A', 'B', 'C', 'D', 'F'],
        format: ['-foo'],
        defaultValue: 'null',
    },
    {
        name: 'pp',
        type: 'float/range',
        required: false,
        description: 'Filters scores to have more/less/equal/not equal pp than/to this value',
        format: range('pp'),
        defaultValue: 'null',
    },
    {
        name: 'score',
        type: 'int/range',
        required: false,
        description: 'Filters scores to have more/less/equal/not equal total score than/to this value',
        format: range('score'),
        defaultValue: 'null',
    },
    {
        name: 'acc',
        type: 'float/range',
        required: false,
        description: 'Filters scores to have more/less/equal/not equal accuracy than/to this value',
        format: range('acc'),
        defaultValue: 'null',
    },
    {
        name: 'combo',
        type: 'integer/range',
        required: false,
        description: 'Filters scores to have more/less/equal/not equal max combo than/to this value',
        format: range('combo'),
        defaultValue: 'null',
    },
    {
        name: 'miss',
        type: 'integer/range',
        required: false,
        description: 'Filters scores to have more/less/equal/not equal misses than/to this value',
        format: range('miss'),
        defaultValue: 'null',
    },
    {
        name: 'bpm',
        type: 'float/range',
        required: false,
        description: 'Filters scores to have more/less/equal/not equal bpm than/to this value',
        format: range('bpm'),
        defaultValue: 'null',
    },
];


export const cmds: bottypes.commandInfo[] = [
    {
        name: 'Changelog',
        description: 'Displays the changes for the current version or version requested.',
        usage: 'changelog [version]',
        category: 'general',
        examples: [
            {
                text: 'changelog 0.4.0',
                description: 'Returns the changelog for version 0.4.0'
            },
            {
                text: 'changelog first',
                description: 'Returns the changelog for the first version'
            },
            {
                text: 'changelog pending',
                description: 'Returns the changelog for the upcoming version'
            },
            {
                text: 'versions',
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
                format: ['major.minor.patch (`0.4.1`) or `first`, `second` etc. `pending` shows upcoming changes'],
                defaultValue: 'latest',
            },
        ]
    },
    {
        name: 'Convert',
        description: 'DEPRECATED. [use this instead](https://sbrstrkkdwmdr.github.io/tools/convert)',
        usage: 'convert',
        category: 'general',
        examples: [
        ],
        aliases: [],
        args: []
    },
    {
        name: 'Help',
        description: 'Displays useful information about commands.',
        usage: 'help [command]',
        category: 'general',
        examples: [
            {
                text: 'help',
                description: 'Shows the general help page'
            },
            {
                text: 'help convert',
                description: 'Shows information about the convert command'
            },
            {
                text: 'help recent',
                description: 'Shows information about the recent command'
            },
            {
                text: 'help categoryosu',
                description: 'Lists all commands in the osu category'
            },
            {
                text: 'list',
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
                format: ['foo'],
                defaultValue: 'N/A',
            },
        ]
    },
    {
        name: 'Info',
        description: 'Shows information about the bot.',
        usage: 'info [arg]',
        aliases: ['i', '[arg]'],
        category: 'general',
        args: [
            {
                name: 'arg',
                type: 'string',
                required: false,
                description: 'Return just that specific value',
                options: ['uptime', 'version', 'server', 'website', 'timezone', 'source'],
                format: ['foo'],
                defaultValue: 'null',
            },
        ]
    },
    {
        name: 'Invite',
        description: 'Sends the bot\'s public invite.',
        usage: 'invite',
        aliases: [],
        category: 'general',
    },
    {
        name: 'Ping',
        description: 'Pings the bot and returns the latency.',
        usage: 'ping',
        aliases: [],
        category: 'general',
    },
    {
        name: 'Remind',
        description: 'Sets a reminder. Leave all args blank or use the reminders alias to return a list of reminders',
        usage: 'remind [time] [reminder]',
        category: 'general',
        examples: [
            {
                text: 'remind',
                description: 'Returns a list of reminders.'
            },
            {
                text: 'remind 1h30m30s reminder',
                description: 'Sets a reminder for 1 hour, 30 minutes, and 30 seconds'
            },
            {
                text: 'remind 2:05 fc',
                description: 'Sets a reminder for 2 minutes and 5 seconds'
            },
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
                format: ['[number][unit]...', 'hh:mm:ss'],
                defaultValue: '0s',
            },
            {
                name: 'reminder',
                type: 'string',
                required: false,
                description: 'The reminder',
                format: ['foo'],
                defaultValue: 'null',
            },
            {
                name: 'sendinchannel',
                type: 'boolean',
                required: false,
                description: 'Whether to send the reminder in the channel or in a DM. Admin only',
                options: ['true', 'false'],
                format: ['foo'],
                defaultValue: 'false',
            }
        ]
    },
    {
        name: 'Stats',
        description: 'Shows the bot\'s statistics.',
        usage: 'stats',
        category: 'general',
        aliases: [],
    },
    {
        name: 'Badges',
        description: 'Display\'s the user\'s badges.',
        usage: 'badges [user]',
        category: 'osu_profile',
        examples: [
            {
                text: 'badges cookiezi',
                description: 'Shows cookiezi\'s badges'
            }
        ],
        aliases: [],
        args: [
            user,
        ]
    },
    {
        name: 'BadgeWeightSeed',
        description: 'Shows the badge weighted rank of a user.',
        usage: 'badgeweightseed [user]',
        category: 'osu_profile',
        examples: [
            {
                text: 'bws',
                description: 'Shows your badge weighted rank'
            },
            {
                text: 'bws peppy',
                description: 'Shows peppy\'s badge weighted rank'
            },
            {
                text: 'bws DigitalHypno',
                description: 'Shows DigitalHypno\'s badge weighted rank'
            },
        ],
        aliases: ['bws', 'badgeweightsystem', 'badgeweight', 'badgeweigthseed', 'badgerank'],
        args: [
            user,
        ]
    },
    {
        name: 'Compare',
        description: 'Compares two users\' osu! stats/top plays/scores.',
        usage: 'compare [first] [second]',
        category: 'osu_other',
        examples: [
            {
                text: 'compare SaberStrike',
                description: 'Compares your stats to SaberStrike\'s'
            },
            {
                text: 'compare peppy SaberStrike',
                description: 'Compares peppy\'s and SaberStrike\'s stats'
            },
            {
                text: 'common SaberStrike Soragaton',
                description: 'Compares SaberStrike\'s and Soragaton\'s top plays'
            },
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
                format: ['foo'],
                defaultValue: 'user stats (top plays if using "common")',
            },
            {
                name: 'first',
                type: 'string',
                required: false,
                description: 'The first user to compare',
                format: ['foo', '@foo', 'osu.ppy.sh/u/foo', 'osu.ppy.sh/users/foo'],
                defaultValue: 'The user who ran the command',
            },
            {
                name: 'second',
                type: 'string',
                required: false,
                description: 'The second user to compare',
                format: ['foo', '@foo', 'osu.ppy.sh/u/foo', 'osu.ppy.sh/users/foo'],
                defaultValue: 'most recent user fetched in the guild',
            },
            page
        ]
    },
    {
        name: 'Firsts',
        description: 'Shows the #1 global scores of a user.\n' + scoreListString,
        usage: 'firsts ' + scoreListArgs,
        category: 'osu_scores',
        examples: [
            {
                text: 'firsts SaberStrike',
                description: 'Shows SaberStrike\'s #1 scores'
            },
            {
                text: 'firsts -p 3 ',
                description: 'Shows the 3rd page of your #1 scores'
            },
            {
                text: 'firsts -mania',
                description: 'Shows your #1 mania scores'
            },
            {
                text: 'firsts +HDHR -recent',
                description: 'Shows your #1 scores with HDHR sorted by recent'
            },
            {
                text: 'firsts -parse 3',
                description: 'Returns your 3rd most recent first score'
            }
        ],
        aliases: ['firstplaceranks', 'first', 'fpr', 'fp', '#1s', '1s', '#1'],
        args: scoreListCommandOptions
    },
    {
        name: 'Leaderboard',
        description: 'Shows the osu! rankings of a server.',
        usage: 'lb [id] [mode]',
        category: 'osu_other',
        aliases: [],
        args: [
            {
                name: 'id',
                type: 'string/integer',
                required: false,
                description: 'The server to get the rankings of. Use global to combine the rankings of all servers the bot is in.',
                format: ['foo'],
                defaultValue: 'Current server',
            },
            mode,
            page,
        ]
    },
    {
        name: 'Map',
        description: 'Shows information about a beatmap.',
        usage: 'map [query] [id] +[mods] [detailed] [bpm] [speed] [cs] [ar] [od] [hp] [ppcalc] [bg]',
        category: 'osu_map',
        linkUsage: [
            'osu.ppy.sh/b/<id> +[mods]',
            'osu.ppy.sh/beatmapsets?q=<query> +[mods]',
            'osu.ppy.sh/beatmapsets/<sid> +[mods]',
            'osu.ppy.sh/beatmapsets/<sid>#<mode>/<id> +[mods]',
            'osu.ppy.sh/s/<sid> +[mods]',
        ],
        examples: [
            {
                text: 'map "kimi no shiranai monogatari"',
                description: 'Returns the first result for "kimi no shiranai monogatari"'
            },
            {
                text: 'map 3013912 +HDHR',
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
                format: ['-? "foo"'],
                defaultValue: 'null',
            },
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The map ID to search for',
                format: mapformat,
                defaultValue: 'the most recent map in the guild',
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: `The mods to calculate the map with. ${mods}`,
                format: ['+foo'],
                defaultValue: 'none',
            },
            {
                name: 'detailed',
                type: 'boolean',
                required: false,
                description: 'Whether to show detailed information about the map',
                options: ['true', 'false'],
                format: ['-d', '-detailed'],
                defaultValue: 'false',
            },
            {
                name: 'bpm',
                type: 'float',
                required: false,
                description: 'The BPM to calculate the map with. This value is still affected by mods',
                options: ['1-1000'],
                format: ['-bpm foo'],
                defaultValue: 'the map\'s BPM',
            },
            {
                name: 'speed',
                type: 'float',
                required: false,
                description: 'The speed multiplier to calculate the map with. Overrides BPM. This value is still affected by mods',
                options: ['0.1-10'],
                format: ['-speed foo'],
                defaultValue: '1',
            },
            {
                name: 'cs',
                type: 'float',
                required: false,
                description: 'The circle size to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                format: ['-cs foo'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'ar',
                type: 'float',
                required: false,
                description: 'The approach rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                format: ['-ar foo'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'od',
                type: 'float',
                required: false,
                description: 'The overall difficulty to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                format: ['-od foo'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'hp',
                type: 'float',
                required: false,
                description: 'The drain rate to calculate the map with. This value is still affected by mods',
                options: ['0-11'],
                format: ['-hp foo'],
                defaultValue: 'The current map\'s value',
            },
            {
                name: 'ppcalc',
                type: 'boolean',
                required: false,
                description: 'Shows only the pp calculations for the map. See [here](https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands.html#osucmd-ppcalc) for more info.',
                format: ['-ppcalc'],
                defaultValue: 'false',
            },
            {
                name: 'bg',
                type: 'boolean',
                required: false,
                description: 'Show only the background images of the map',
                format: ['-bg'],
                defaultValue: 'false',
            },
        ]
    },
    {
        name: 'MapLeaderboard',
        description: 'Shows the leaderboard of a map.',
        usage: 'mapleaderboard [id] [page] [parse]',
        category: 'osu_scores',
        examples: [
            {
                text: 'maplb 32345',
                description: 'Returns the leaderboard of the map with the id 32345'
            },
            {
                text: 'maplb +HDHR',
                description: 'Returns the leaderboard of the most recent map in the guild with HDHR'
            }
        ],
        aliases: ['leaderboard', 'maplb', 'ml'],
        args: [
            {
                name: 'id',
                type: 'integer',
                required: false,
                description: 'The ID of the map to show the leaderboard of',
                defaultValue: 'the most recent map in the guild',
                format: mapformat,
            },
            page,
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: `The mods to filter the leaderboard by. ${mods}`,
                format: ['+foo'],
                defaultValue: 'none',
            },
            {
                name: 'parse',
                type: 'integer',
                required: false,
                description: 'Parse the score with the specific index',
                format: ['-parse foo'],
                defaultValue: '0',
            },
        ]
    },
    {
        name: 'RandomMap',
        description: 'Returns the link to a random beatmap. Uses local storage so selection might be limited.',
        usage: 'randommap [type]',
        category: 'osu_map',
        examples: [
            {
                text: 'f2',
                description: 'Returns a random beatmap'
            },
            {
                text: 'maprand -ranked',
                description: 'Returns a random ranked beatmap'
            }
        ],
        aliases: ['f2', 'maprand', 'maprandom', 'randmap'],
        args: [{
            name: 'Type',
            type: 'string',
            required: false,
            description: 'Filters to only pick from this type of map',
            options: ['ranked', 'loved', 'approved', 'qualified', 'pending', 'wip', 'graveyard'],
            format: ['-foo'],
            defaultValue: 'null',
        }]
    },
    {
        name: 'RecommendMap',
        description: 'Recommends a random map based off of your recommended difficulty.',
        usage: 'recommendmap [range] [user]',
        category: 'osu_map',
        examples: [
            {
                text: 'maprec -range 2 SaberStrike',
                description: 'Recommends a random map for SaberStrike with a maximum star rating difference of 2'
            }
        ],
        aliases: ['recmap', 'maprecommend', 'maprec', 'mapsuggest', 'suggestmap'],
        args: [
            user, mode,
            {
                name: 'range',
                type: 'float',
                required: false,
                description: 'The maximum difference in star rating the recommended map can be',
                options: ['range', 'r', 'diff'],
                format: ['-range foo', '-r foo', '-diff foo'],
                defaultValue: '1',
            },
            {
                name: 'type',
                type: 'string',
                required: false,
                description: 'How to fetch the recommended map',
                options: ['closest', 'random'],
                format: ['-foo'],
                defaultValue: 'random',
            }
        ]
    },
    {
        name: 'NoChokes',
        description: 'Shows the user\'s top plays if no scores had a miss.\n' + scoreListString,
        usage: 'nochokes ' + scoreListArgs,
        category: 'osu_scores',
        examples: [
            {
                text: 'nochokes SaberStrike',
                description: 'Returns SaberStrike\'s top plays without misses'
            },
            {
                text: 'nc -p 3',
                description: 'Returns the third page of your top plays without misses'
            },
            {
                text: 'nochokes -mania',
                description: 'Returns your top mania plays without misses'
            },
            {
                text: 'nochokes +HDHR -recent',
                description: 'Returns your top plays with HDHR sorted by recent without misses'
            },
            {
                text: 'nc -parse 2',
                description: 'Returns your 2nd no miss top play'
            }
        ],
        aliases: ['nc'],
        args: scoreListCommandOptions
    },
    {
        name: 'Profile',
        description: 'Shows information about a user\'s osu! profile.',
        usage: 'profile [user] [graph] [detailed] [mode]',
        category: 'osu_profile',
        linkUsage: [
            'osu.ppy.sh/u/<user>',
            'osu.ppy.sh/users/<user>/[(mode)]',
        ],
        aliases: ['osu', 'o', 'profile', 'user', 'taiko', 'drums', 'fruits', 'ctb', 'catch', 'mania'],
        examples: [
            {
                text: 'profile SaberStrike',
                description: 'Shows SaberStrike\'s osu! profile'
            },
            {
                text: 'profile -d -taiko',
                description: 'Shows your taiko profile with extra details'
            },
            {
                text: 'osu -g',
                description: 'Shows a graph of your osu! rank and playcount'
            },
            {
                text: 'osu.ppy.sh/u/2',
                description: 'Shows Peppy\'s osu profile'
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
                format: ['-detailed', '-d'],
                defaultValue: 'false',
            },
            {
                name: 'graph',
                type: 'boolean',
                required: false,
                description: 'Whether to show only user statistics graphs',
                options: ['true', 'false'],
                format: ['-g'],
                defaultValue: 'false',
            },
        ]
    },
    {
        name: 'Set',
        description: 'Sets your osu! username/mode/skin or any setting.',
        usage: 'set <username> [mode] [skin] [timezone] [location]',
        category: 'osu_other',
        examples: [
            {
                text: 'osuset SaberStrike',
                description: 'Sets your username to SaberStrike'
            },
            {
                text: 'osuset SaberStrike -fruits -skin rafis',
                description: 'Sets your username to SaberStrike, mode to fruits, and skin to rafis'
            },
            {
                text: 'set SaberStrike -taiko -skin rafis',
                description: 'Sets your username to SaberStrike, mode to taiko, and skin to rafis'
            },
            {
                text: 'setmode ctb',
                description: 'Sets your mode to fruits (catch the beat)'
            },
            {
                text: 'setskin rafis',
                description: 'Sets your skin to rafis'
            },
        ],
        aliases: ['setuser', 'set', 'setmode', 'setskin', 'settime', 'settz', 'setweather', 'setlocation'],
        args: [
            {
                name: 'username',
                type: 'string',
                required: true,
                description: 'The osu! username to set',
                format: ['foo'],
                defaultValue: 'null',
            },
            mode,
            {
                name: 'skin',
                type: 'string',
                required: false,
                description: 'The skin to set',
                format: ['-skin foo'],
                defaultValue: 'osu! default 2014',
            },
            {
                name: 'timezone',
                type: 'string',
                required: false,
                description: 'The timezone to set',
                format: ['-tz foo'],
                defaultValue: 'null',
            },
            {
                name: 'location',
                type: 'string',
                required: false,
                description: 'The location to set',
                format: ['-location foo'],
                defaultValue: 'null',
            }
        ]
    },
    {
        name: 'OsuTop',
        description: 'Shows the top scores of a user.\n' + scoreListString,
        usage: 'osutop ' + scoreListArgs,
        category: 'osu_scores',
        examples: [
            {
                text: 'osutop SaberStrike',
                description: 'Shows SaberStrike\'s top osu! scores'
            },
            {
                text: 'osutop -p 3',
                description: 'Shows your top 3 pages of osu! scores'
            },
            {
                text: 'osutop -mania',
                description: 'Shows your top mania scores'
            },
            {
                text: 'osutop -fruits -mods hdhr',
                description: 'Shows your top fruits scores with HDHR'
            },
            {
                text: 'osutop +HDHR -recent',
                description: 'Shows your top scores with HDHR sorted by recent'
            },
            {
                text: 'top -parse 3',
                description: 'Returns your 3rd personal best score'
            },
            {
                text: 'sotarks',
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
        name: 'Pinned',
        description: 'Shows the pinned scores of a user.\n' + scoreListString,
        usage: 'pinned ' + scoreListArgs,
        category: 'osu_scores',
        examples: [
            {
                text: 'pinned SaberStrike',
                description: 'Shows SaberStrike\'s pinned scores'
            },
            {
                text: 'pinned -p 3',
                description: 'Shows your pinned scores on page 3'
            },
            {
                text: 'pinned -mania',
                description: 'Shows your pinned mania scores'
            },
            {
                text: 'pinned +HDHR -recent',
                description: 'Shows your pinned scores with HDHR sorted by recent'

            }
        ],
        aliases: ['pins'],
        args: scoreListCommandOptions
    },
    {
        name: 'PP',
        description: 'Estimates the rank of a user from the pp given. If a value matches the database, that will be used instead of an estimation.',
        usage: 'pp <value> [mode]',
        category: 'osu_other',
        examples: [
            {
                text: 'pp 100000',
                description: 'Estimates your rank with 100,000pp'
            },
            {
                text: 'pp 2999 -fruits',
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
                format: ['foo'],
                defaultValue: 'N/A',
            },
            mode
        ]
    },
    {
        name: 'Rank',
        description: 'Estimates the performance points of a user from the rank given. If a value matches the database, that will be used instead of an estimation.',
        usage: 'rank <value> [mode]',
        category: 'osu_other',
        examples: [
            {
                text: 'rank 1',
                description: 'Estimates your pp with rank 1'
            },
            {
                text: 'rank 1 -taiko',
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
                format: ['foo'],
                defaultValue: 'N/A',
            },
            mode
        ]
    },
    {
        name: 'Ranking',
        description: 'Displays the global leaderboards.',
        usage: 'ranking [country] [page] [mode] [parse]',
        category: 'osu_profile',
        examples: [
            {
                text: 'ranking',
                description: 'Shows the global leaderboards'
            },
            {
                text: 'ranking -country us -taiko',
                description: 'Shows the taiko leaderboards for the US'
            },
            {
                text: 'ranking -charts -spotlight 227',
                description: 'Shows the leaderboards for the 227th spotlight'
            }
        ],
        aliases: [],
        args: [{
            name: 'country',
            type: 'string',
            required: false,
            description: 'The country code of the country to use',
            format: ['+foo'],
            defaultValue: 'global',
        },
            mode,
            page,
        {
            name: 'type',
            type: 'string',
            required: false,
            description: 'The type of leaderboard to show',
            options: ['performance', 'charts', 'score', 'country'],
            defaultValue: 'performance',
            format: ['type:foo'],
        },
        {
            name: 'spotlight',
            type: 'integer',
            required: false,
            description: 'The spotlight to show the scores of. Only works with type charts',
            format: ['spotlight:foo'],
            defaultValue: 'latest',
        },
        {
            name: 'parse',
            type: 'integer',
            required: false,
            description: 'Parses the user with the given index',
            format: ['-parse foo'],
            defaultValue: '1',
        },
        ]
    },
    {
        name: 'Recent',
        description: 'Shows the recent score(s) of a user',
        usage: 'recent [user] [page] [mode] [showfails] [filter]',
        category: 'osu_scores',
        examples: [
            {
                text: 'recent',
                description: 'Shows your most recent score'
            },
            {
                text: 'r SaberStrike',
                description: 'Shows the most recent score of SaberStrike'
            },
            {
                text: 'rt -p 2',
                description: 'Shows your second most recent taiko score'
            },
        ],
        aliases: [
            'recentscore', 'rs', 'r',
            'recenttaiko', 'rt',
            'recentfruits', 'rf', 'rctb',
            'recentmania', 'rm',
        ],
        args: [
            user,
            page,
            mode,
            {
                name: 'showfails',
                type: 'boolean',
                required: false,
                description: 'Whether to show only scores that were passed. If false, all scores will be shown',
                options: ['true', 'false'],
                format: ['-passes', '-nf', '-nofail'],
                defaultValue: 'true',
            },
            {
                name: 'filter',
                type: 'string',
                required: false,
                description: 'Filter scores by maps matching the given string',
                format: ['-? "foo"'],
                defaultValue: 'null',
            },
        ]
    },
    {
        name: 'RecentList',
        description: 'Shows the recent scores of a user.\n' + scoreListString,
        usage: 'recentlist ' + scoreListArgs,
        category: 'osu_scores',
        examples: [
            {
                text: 'rsbest',
                description: 'Shows a list of your recent scores, sorted by pp'
            },
            {
                text: 'rl -mania',
                description: 'Shows a list of your recent mania scores'
            },
            {
                text: 'rlm @SaberStrike',
                description: 'Shows a list of SaberStrike\'s recent mania scores'
            },
            {
                text: 'rl -nf -? "Shinbatsu"',
                description: 'Shows your recent scores with the map name/difficulty/artist/creator matching "shinbatsu", excluding fails'
            }
        ],
        aliases: [
            'rb', 'recentbest', 'rsbest',
            'rslist', 'rl',
            'recentlisttaiko', 'rlt',
            'recentlistfruits', 'rlf', 'rlctb', 'rlc',
            'recentlistmania', 'rlm',
        ],
        args: scoreListCommandOptions
    },
    {
        name: 'RecentActivity',
        category: 'osu_profile',
        description: 'Displays the user\'s most recent activity.',
        usage: 'recentactivity [user] [page]',
        aliases: ['recentact', 'rsact'],
        args: [
            user,
            page,
        ]
    },
    {
        name: 'Saved',
        description: 'Shows a user\'s saved settings.',
        usage: 'saved [user]',
        category: 'osu_other',
        examples: [
            {
                text: 'saved @SaberStrike',
                description: 'Shows SaberStrike\'s saved settings'
            },
        ],
        aliases: [],
        args: [
            userAdmin,
        ]
    },
    {
        name: 'ScoreParse',
        description: 'Returns information about a score. Doesn\'t work with new score ID system.',
        usage: 'scoreparse <id> [mode]',
        linkUsage: [
            'osu.ppy.sh/scores/<mode>/<id>'
        ],
        category: 'osu_scores',
        examples: [
            {
                text: 'scoreparse 1234567890',
                description: 'Parses the osu! score with the id 1234567890'
            },
            {
                text: 'score 1234567890 mania',
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
                format: ['foo', 'osu.ppy.sh/scores/foo'],
                defaultValue: 'null',
            },
            mode
        ]
    },
    {
        name: 'MapScores',
        description: 'Shows the scores of a user on a beatmap.\n' + scoreListString,
        usage: 'mapscores [user] [id] [page] [mods] [modx] [exmod] [reverse] [sort] [parse] [query] [detailed] [-grade] [pp] [score] [acc] [combo] [miss] [bpm]',
        category: 'osu_scores',
        examples: [
            {
                text: 'scores saberstrike',
                description: 'Shows SaberStrike\'s scores on the most recent beatmap'
            },
            {
                text: 'c',
                description: 'Shows your scores on the most recent beatmap'
            },
            {
                text: 'c 4204',
                description: 'Shows your scores on the beatmap with the id 4204'
            },
            {
                text: 'scores -parse 5',
                description: 'Returns your fifth most recent score on the most recent beatmap'
            },
            {
                text: 'c https://osu.ppy.sh/beatmapsets/3367#osu/21565',
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
                    format: mapformat,
                    defaultValue: 'the most recent map in the guild',
                },
            ])
    },
    {
        name: 'ScoreStats',
        description: 'Shows the stats of a user\'s scores.',
        usage: 'scorestats [user] [type] [mode] [all]',
        category: 'osu_scores',
        examples: [
            {
                text: 'scorestats @SaberStrike',
                description: 'Shows scorestats for SaberStrike\'s top plays'
            },
            {
                text: 'scorestats mrekk -firsts',
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
                format: ['-foo',],
            },
            {
                name: 'all',
                type: 'boolean',
                required: false,
                description: 'Shows all statistics. May cause the command to lag as it needs to download all maps associated with each score.',
                options: ['true', 'false'],
                format: ['-all',],
                defaultValue: 'false',
            }
        ]
    },
    {
        name: 'Simulate',
        description: 'Simulates a score on a beatmap.',
        usage: 'simulate [id] +[mods]  [acc] [combo] [n300] [n100] [n50] [miss] [bpm] [speed] [cs] [ar] [od] [hp]',
        category: 'osu_scores',
        examples: [
            {
                text: 'simulate +HDHR misses=0 acc=97.86',
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
                format: mapformat,
            },
            {
                name: 'mods',
                type: 'string',
                required: false,
                description: `The mods to simulate the score with. ${mods}`,
                defaultValue: 'none',
                format: ['+foo',],
            },
            {
                name: 'accuracy',
                type: 'float',
                required: false,
                description: 'The accuracy to simulate the score with',
                options: ['0-100'],
                format: ['-acc foo', '-accuracy foo', '-% foo'],
                defaultValue: '100',
            },
            {
                name: 'combo',
                type: 'integer',
                required: false,
                description: 'The maximum combo to simulate the score with',
                format: ['-combo foo', '-x foo', '-maxcombo foo'],
                defaultValue: 'map max combo',
            },
            {
                name: 'n300',
                type: 'integer',
                required: false,
                description: 'The number of hit 300s to simulate the score with',
                format: ['-n300 foo', '-300s foo'],
                defaultValue: 'calculated from accuracy',
            },
            {
                name: 'n100',
                type: 'integer',
                required: false,
                description: 'The number of hit 100s to simulate the score with',
                format: ['-n100 foo', '-100s foo'],
                defaultValue: 'calculated from accuracy',
            },
            {
                name: 'n50',
                type: 'integer',
                required: false,
                description: 'The number of hit 50s to simulate the score with',
                format: ['-n50 foo', '-50s foo'],
                defaultValue: 'calculated from accuracy',
            },
            {
                name: 'misses',
                type: 'integer',
                required: false,
                description: 'The number of misses to simulate the score with',
                format: ['-miss foo', '-misses foo', '-n0 foo', '-0s foo'],
                defaultValue: '0',
            },
            {
                name: 'bpm',
                type: 'float',
                required: false,
                description: 'The bpm to simulate the score with',
                format: ['-bpm foo',],
                defaultValue: 'map bpm',
            },
            {
                name: 'speed',
                type: 'float',
                required: false,
                description: 'The speed multiplier to simulate the score with',
                format: ['-speed foo',],
                defaultValue: '1 (or mod)',
            },
            {
                name: 'cs',
                type: 'float',
                required: false,
                description: 'The circle size to simulate the score with',
                format: ['-cs foo',],
                defaultValue: 'Map CS',
            },
            {
                name: 'ar',
                type: 'float',
                required: false,
                description: 'The approach to simulate the score with',
                format: ['-ar foo',],
                defaultValue: 'Map AR',
            },
            {
                name: 'od',
                type: 'float',
                required: false,
                description: 'The overall difficulty to simulate the score with',
                format: ['-od foo',],
                defaultValue: 'Map OD',
            },
            {
                name: 'hp',
                type: 'float',
                required: false,
                description: 'The hp/drain to simulate the score with',
                format: ['-hp foo',],
                defaultValue: 'Map HP',
            },
        ]
    },
    {
        name: 'TrackAdd',
        description: 'Adds a user to the tracklist. Only works in the guild\'s set tracking channel.',
        usage: 'trackadd <user>',
        category: 'osu_track',
        examples: [
            {
                text: 'trackadd 15222484',
                description: 'Adds the user with the id 15222484 to the tracklist'
            },
            {
                text: 'ta SaberStrike',
                description: 'Adds SaberStrike to the tracklist'
            }
        ],
        aliases: ['ta', 'track'],
        args: [
            userTrack,
        ]
    },
    {
        name: 'TrackChannel',
        description: 'Sets the channel to send tracklist updates to.',
        category: 'osu_track',
        usage: 'trackchannel <channel>',
        examples: [
            {
                text: 'trackchannel #tracklist',
                description: 'Sets the channel to send tracklist updates to #tracklist'
            },
            {
                text: 'trackchannel 123456789012345678',
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
                format: ['foo',],
                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'TrackList',
        description: 'Displays a list of the currently tracked users in the server.',
        category: 'osu_track',
        usage: 'tracklist',
        aliases: ['tl'],
    },
    {
        name: 'TrackRemove',
        description: 'Removes a user from the tracklist. Only works in the guild\'s set tracking channel.',
        category: 'osu_track',
        usage: 'trackremove <user>',
        examples: [
            {
                text: 'trackremove 15222484',
                description: 'Removes the user with the id 15222484 from the tracklist'
            },
            {
                text: 'tr SaberStrike',
                description: 'Removes SaberStrike from the tracklist'
            }
        ],
        aliases: ['tr', 'trackrm', 'untrack'],
        args: [
            userTrack,
        ]
    },
    {
        name: 'UserBeatmaps',
        description: 'Shows a user\'s beatmaps. (favourites/ranked/pending/graveyard/loved)',
        category: 'osu_map',
        usage: 'userbeatmaps [user] [type] [reverse] [page] [parse] [query]',
        examples: [
            {
                text: 'ubm sotarks -p 4 -ranked',
                description: 'Shows sotarks\'s ranked beatmaps on page 4'
            },
            {
                text: 'userbeatmaps Mismagius -loved -reverse -p 2 -title',
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
                options: ['favourites', 'ranked', 'pending', 'graveyard', 'loved', 'most_played'],
                format: ['-foo',],
                defaultValue: 'Favourites',
            },
            {
                name: 'reverse',
                type: 'boolean',
                required: false,
                description: 'Whether to sort the beatmaps in reverse',
                options: ['true', 'false'],
                format: ['-rev', '-reverse'],
                defaultValue: 'false',
            },
            page,
            {
                name: 'sort',
                type: 'string',
                required: false,
                description: 'The way to sort the beatmaps',
                options: ['Title', 'Artist', 'Difficulty', 'Status', 'Fails', 'Plays', 'Date Added', 'Favourites', 'BPM', 'CS', 'AR', 'OD', 'HP', 'Length'],
                format: ['sort:foo',],
                defaultValue: 'Date Added',
            },
            {
                name: 'parse',
                type: 'integer',
                required: false,
                description: 'Parses the beatmap with the given index',
                format: ['-parse foo',],
                defaultValue: '1',
            },
            {
                name: 'filter',
                type: 'string',
                required: false,
                description: 'Filters the beatmaps by the given string',
                format: ['-foo',],
                defaultValue: 'N/A',
            },
        ]
    },
    {
        name: 'WhatIf',
        description: 'Estimates user stats if they gain a certain amount of raw pp.',
        category: 'osu_other',
        usage: 'whatif [user] <pp>',
        examples: [
            {
                text: 'whatif 1000',
                description: 'Shows the user\'s stats if they achieved a 1000pp score'
            },
            {
                text: 'whatif SaberStrike 300',
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
                format: ['foo',],
                defaultValue: '0',
            },
        ]
    },

    {
        name: '8Ball',
        description: 'Returns a yes/no/maybe answer to a question.',
        category: 'misc',
        usage: '8ball ',
        examples: [
            {
                text: '8ball is this a good bot?',
                description: 'Returns a yes/no/maybe answer to the question'
            }
        ],
        aliases: ['ask'],
    },
    {
        name: 'CoinFlip',
        description: 'Flips a coin.',
        category: 'misc',
        usage: 'coinflip',
        aliases: ['coin', 'flip'],
    },
    {
        name: 'Gif',
        description: 'Sends a gif.',
        category: 'misc',
        usage: '<type> [target]',
        examples: [
            {
                text: 'slap @SaberStrike',
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
                format: [],
                defaultValue: 'N/A',
            },
            {
                name: 'target',
                type: 'user mention',
                required: true,
                description: 'The user to target',
                format: ['<@foo>',],
                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'Janken',
        description: 'Plays janken with the bot. (aka paper scissors rock or rock paper scissors or whatever weird order it\'s in).',
        category: 'misc',
        usage: 'janken',
        aliases: ['paperscissorsrock', 'rockpaperscissors', 'rps', 'psr'],
        args: [
            {
                name: 'choice',
                type: 'string',
                required: true,
                description: 'Paper, scissors or rock.',
                options: ['rock', 'paper', 'scissors', 'グー', 'チョキ', 'パー'],
                format: ['foo',],
                defaultValue: 'N/A',
            }
        ],
    },
    {
        name: 'Roll',
        description: 'Rolls a random number.',
        category: 'misc',
        usage: 'roll [max] [min]',
        examples: [
            {
                text: 'roll',
                description: 'Rolls a random number between 1 and 100'
            },
            {
                text: 'roll 100 50',
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
                format: ['foo',],
                defaultValue: '100',
            },
            {
                name: 'min',
                type: 'integer',
                required: false,
                description: 'The minimum number to roll',
                format: ['bar',],
                defaultValue: '1',
            }
        ]
    },
    {
        name: 'CheckPerms',
        description: 'Checks the permissions of the user.',
        category: 'admin',
        usage: 'checkperms [user]',
        examples: [
            {
                text: 'checkperms @SSoB',
                description: 'Checks the permissions of the user @SSoB'
            }
        ],
        aliases: ['perms'],
        args: [
            userAdmin,
        ]
    },
    {
        name: 'Clear',
        description: 'Clears cached data within the bot',
        usage: 'clear <arg>',
        category: 'admin',
        examples: [],
        aliases: [],
        args: [
            {
                name: 'arg',
                type: 'integer/string',
                required: false,
                description: 'the types of files to clear (read the options section)',
                options: ['normal', 'all (only cmd data)', 'trueall', 'map', 'users', 'previous', 'pmaps', 'pscores', 'pusers', 'errors', 'graph'],
                format: ['foo',],
                defaultValue: 'temporary files only',
            }
        ]
    },
    {
        name: 'Debug',
        description: 'Runs a debugging command.',
        category: 'admin',
        usage: 'debug <type> [arg]',
        examples: [
            {
                text: 'debug commandfile 1',
                description: 'Returns all files associated with the command matching ID 1'
            },
            {
                text: 'debug commandfiletype map',
                description: 'Returns all files associated with the command "map"'
            },
            {
                text: 'debug servers',
                description: 'Returns a list of all guilds the bot is in'
            },
            {
                text: 'debug channels',
                description: 'Returns a list of all channels in the current guild'
            },
            {
                text: 'debug users',
                description: 'Returns a list of all members in the current guild'
            },
            {
                text: 'debug forcetrack',
                description: 'Forces the osu!track to run a cycle (takes a minute to complete)'
            },
            {
                text: 'debug curcmdid',
                description: 'Returns the current command\'s ID'
            },
            {
                text: 'debug logs',
                description: 'Returns the logs associated with the current guild'
            },
            {
                text: 'debug clear all',
                description: 'Deletes all command-related files cached'
            },
            {
                text: 'debug maps name',
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
                format: ['foo',],
                defaultValue: 'list options',
            }, {
                name: 'arg',
                type: 'integer/string',
                required: false,
                description: 'commandfile -> the id of the command to search for\ncommandfiletype -> the name of the command to search\nlogs -> the ID of the guild to send logs from',
                options: ['normal', 'all (only cmd data)', 'trueall', 'map', 'users', 'previous', 'pmaps', 'pscores', 'pusers', 'errors', 'graph'],
                format: ['bar',],
                defaultValue: 'commandfile -> latest command\ncommandfiletype -> list options\nlogs -> current server',
            }
        ]
    },
    {
        name: 'Find',
        description: 'Finds details of a user/guild/channel/role/emoji/sticker.',
        usage: 'find <type> <ID>',
        category: 'admin',
        examples: [
            {
                text: 'find user 777125560869978132',
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
                format: ['foo',],
                defaultValue: 'N/A',
            },
            {
                name: 'id',
                type: 'integer',
                required: true,
                description: 'The ID to fetch',
                format: ['bar',],
                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'LeaveGuild',
        description: 'Makes the bot leave a guild.',
        usage: 'leaveguild [guild]',
        category: 'admin',
        examples: [
            {
                text: 'leaveguild 1234567890',
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
                format: ['foo',],
                defaultValue: 'the guild the command was sent in',
            }
        ]
    },
    {
        name: 'Prefix',
        description: 'Set\'s the prefix of the current server.',
        usage: 'prefix [prefix]',
        category: 'admin',
        examples: [
            {
                text: 'prefix !',
                description: 'Sets the prefix to "!"'
            }
        ],
        aliases: [],
        args: [
            {
                name: 'prefix',
                type: 'string',
                required: false,
                description: 'The prefix to set',
                format: ['foo',],
                defaultValue: 'N/A',
            }
        ]
    },
    {
        name: 'Servers',
        description: 'Shows the servers the bot is in.',
        usage: 'servers',
        category: 'admin',
        aliases: [],
    },
];




export const buttons: {
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