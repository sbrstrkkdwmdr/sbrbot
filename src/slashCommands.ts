// initialise client commands
import * as Discord from 'discord.js';
import * as helper from './helper.js';

export async function main() {
    const docommands: boolean = true;
    if (docommands) run();
    else helper.vars.client.application?.commands.set([]);
}

function run() {
    const commands = helper.vars.client.application?.commands;
    commands?.set([
        // gen
        {
            name: 'changelog',
            description: 'Displays the changes for the current version or version requested',
            dmPermission: true,
            options: [
                {
                    name: 'version',
                    description: 'What version to check',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                }
            ]
        },
        {
            name: 'convert',
            description: 'Converts one value to another',
            dmPermission: true,
            options: [
                {
                    name: 'from',
                    description: 'What to convert the value from',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                    choices: helper.vars.commandopts.conversionopts
                },
                {
                    name: 'to',
                    description: 'What to convert the value to',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: helper.vars.commandopts.conversionopts
                },
                {
                    name: 'number',
                    description: 'The value to convert',
                    type: Discord.ApplicationCommandOptionType.Number,
                    required: false
                }
            ]
        },
        {
            name: 'help',
            description: 'Displays all commands',
            dmPermission: true,
            options: [
                {
                    name: 'command',
                    description: 'Displays help for a specific command',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                }
            ]
        },
        {
            name: 'math',
            description: 'Solves a simple math problem',
            dmPermission: true,
            options: [
                {
                    name: 'type',
                    description: 'The parameters for the search',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                    choices: helper.vars.commandopts.mathcmdopts
                },
                {
                    name: 'num1',
                    description: 'The first number',
                    type: Discord.ApplicationCommandOptionType.Number,
                    required: true
                },
                {
                    name: 'num2',
                    description: 'The second number',
                    type: Discord.ApplicationCommandOptionType.Number,
                    required: false,
                }
            ]
        },
        {
            name: 'ping',
            description: 'Pong!',
            dmPermission: true,
        },
        {
            name: 'remind',
            description: 'Reminds the user of something. If no args are given, a list of pending reminders is returned.',
            dmPermission: true,
            options: [
                {
                    name: 'time',
                    description: 'How long to wait before sending the reminder. Formatted as ?d?h?m?s or hh:mm:ss',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: 'reminder',
                    description: 'The reminder',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: 'sendinchannel',
                    description: 'If true, the reminder will be sent into the channel',
                    type: Discord.ApplicationCommandOptionType.Boolean,
                    required: false
                }
            ]
        },
        {
            name: 'stats',
            description: 'Displays stats about the bot',
            dmPermission: true,
        },
        {
            name: 'time',
            description: 'Displays the current time',
            dmPermission: true,
            options: [
                {
                    name: 'timezone',
                    description: 'The timezone to display the time in',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                }
            ]
        },
        {
            name: 'weather',
            description: 'Displays the weather for a given location',
            dmPermission: true,
            options: [
                {
                    name: 'location',
                    description: 'The location to get the weather for',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        // osu
        {
            name: 'bws',
            description: 'Shows the badge weighted rank of a user',
            dmPermission: true,
            options: [
                {
                    name: 'user',
                    description: 'The user to show the badge weighted rank of',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                }
            ]
        },
        {
            name: 'compare',
            description: 'Compares two users/top plays',
            dmPermission: true,
            options: [
                {
                    name: 'type',
                    description: 'The type of comparison',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String,
                    choices: [
                        {
                            name: 'profile',
                            value: 'profile'
                        },
                        {
                            name: 'top plays',
                            value: 'top'
                        },
                        // {
                        //     name: 'map scores',
                        //     value: 'mapscore'
                        // },
                    ]
                },
                {
                    name: 'first',
                    description: 'The first user to compare',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String,
                },
                {
                    name: 'second',
                    description: 'The second user to compare',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String,
                },
                {
                    name: 'mode',
                    description: 'The gamemode to use',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String,
                    choices: helper.vars.commandopts.modeopts
                }
            ]
        },
        {//alias for compare
            name: 'common',
            description: 'Compares two user\'s top plays',
            dmPermission: true,
            options: [
                {
                    name: 'first',
                    description: 'The first user to compare',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String,
                },
                {
                    name: 'second',
                    description: 'The second user to compare',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String,
                },
                {
                    name: 'mode',
                    description: 'The gamemode to use',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String,
                    choices: helper.vars.commandopts.modeopts
                }
            ]
        },
        {
            name: 'firsts',
            description: 'Displays the user\'s #1 scores',
            dmPermission: true,
            options: helper.vars.commandopts.playArrayOpts
        },
        {
            name: 'lb',
            description: 'Displays the server leaderboard',
            dmPermission: false,
            options: [
                {
                    name: 'id',
                    description: 'The server to get the rankings of. Use global to combine the rankings of all servers the bot is in.',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'mode',
                    description: 'The mode to display the plays of',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: helper.vars.commandopts.modeopts
                },
            ]
        },
        {
            name: 'map',
            description: 'Displays the map info of the map',
            dmPermission: true,
            options: [
                {
                    name: 'id',
                    description: 'The id of the map to display',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: false,
                    minValue: 1
                },
                {
                    name: 'mods',
                    description: 'The mods to display the map info of',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'detailed',
                    description: 'Show all details',
                    type: Discord.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
                {
                    name: 'query',
                    description: 'The name of the map to display',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'bpm',
                    description: 'The BPM to calculate the map with',
                    type: Discord.ApplicationCommandOptionType.Number,
                    required: false,
                    minValue: 1,
                    maxValue: 1000
                },
                {
                    name: 'speed',
                    description: 'The speed to calculate the map with',
                    type: Discord.ApplicationCommandOptionType.Number,
                    required: false,
                    minValue: 0.1,
                    maxValue: 10
                }
            ]
        },
        {
            name: 'maplb',
            description: 'Displays the top five plays on a specific map',
            dmPermission: true,
            options: [
                {
                    name: 'id',
                    description: 'The id of the map to display',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Integer,
                },
                {
                    name: 'page',
                    description: 'Which page to display',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Integer,
                    minValue: 1,
                    maxValue: 20

                },
                {
                    name: 'mods',
                    description: 'What mods to sort',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String
                },
                {
                    name: 'parse',
                    description: 'Parse the score with the specified index',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: false,
                }
            ]
        },
        {
            name: 'nochokes',
            description: 'Displays the user\'s top scores without misses',
            dmPermission: true,
            options: helper.vars.commandopts.osutopOpts
        },
        {
            name: 'osu',
            description: 'Displays the user\'s osu! profile',
            dmPermission: true,
            options: [
                {
                    name: 'user',
                    description: 'The user to display the profile of',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'detailed',
                    description: 'Displays extra information',
                    type: Discord.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
                {
                    name: 'mode',
                    description: 'The mode to display the profile in',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: helper.vars.commandopts.modeopts
                }
            ]
        },
        {
            name: 'osuset',
            description: 'Sets the user\'s osu! profile',
            dmPermission: true,
            options: [
                {
                    name: 'user',
                    description: 'The user to set the profile of',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'mode',
                    description: 'The mode to set the profile to',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: helper.vars.commandopts.modeopts,
                },
                {
                    name: 'skin',
                    description: 'The player\'s skin',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,

                }
            ]
        },
        {
            name: 'osutop',
            description: 'Displays the top plays of the user',
            dmPermission: true,
            options: helper.vars.commandopts.osutopOpts
        },
        {
            name: 'pinned',
            description: 'Displays the user\'s pinned scores',
            dmPermission: true,
            options: helper.vars.commandopts.playArrayOpts
        },
        {
            name: 'pp',
            description: 'Estimates the rank of a user from the pp given',
            dmPermission: true,
            options: [
                {
                    name: 'value',
                    description: 'The pp to estimate the rank of',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: true,
                    minValue: 1
                },
                {
                    name: 'mode',
                    description: 'The mode to estimate the rank in',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: helper.vars.commandopts.modeopts
                },
            ]
        },
        {
            name: 'rank',
            description: 'Estimates the pp of a user from the rank given',
            dmPermission: true,
            options: [
                {
                    name: 'value',
                    description: 'The rank to estimate the pp of',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: true,
                    minValue: 1
                },
                {
                    name: 'mode',
                    description: 'The mode to estimate the pp in',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: helper.vars.commandopts.modeopts
                }
            ]
        },
        {
            name: 'ranking',
            description: 'Displays the global leaderboards',
            dmPermission: true,
            options: [
                {
                    name: 'country',
                    description: 'The country code of the country to use (defaults to global)',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    maxLength: 2,
                },
                {
                    name: 'mode',
                    description: 'The mode to display the leaderboards in',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: helper.vars.commandopts.modeopts
                },
                {
                    name: 'page',
                    description: 'The page to display',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: false,
                    minValue: 1
                },
                {
                    name: 'type',
                    description: 'The type of leaderboards to display',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        { name: 'performance', value: 'performance' },
                        { name: 'charts (spotlights)', value: 'charts' },
                        { name: 'score', value: 'score' },
                        { name: 'country', value: 'country' },
                    ]
                },
                {
                    name: 'spotlight',
                    description: 'The spotlight to display the leaderboards of',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: false,
                }
            ]
        },
        {
            name: 'recent',
            description: 'Displays the user\'s most recent score',
            dmPermission: true,
            options: helper.vars.commandopts.rsopts
        },
        {
            name: 'recentactivity',
            description: 'Displays the user\'s most recent activity',
            dmPermission: true,
            options: [
                {
                    name: 'user',
                    description: 'the username or id',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String
                },
                {
                    name: 'page',
                    description: 'the page to show',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Integer,
                },
            ]
        },
        {
            name: 'scores',
            description: 'Displays the user\'s scores for a set map',
            dmPermission: true,
            options: helper.vars.commandopts.useridsortopts
        },
        {
            name: 'scorestats',
            description: 'Displays statistics for a user\'s scores',
            dmPermission: true,
            options: [
                {
                    name: 'user',
                    description: 'The user to display the statistics of',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'mode',
                    description: 'The mode to display the statistics in',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'type',
                    description: 'The type of scores to use',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        { name: 'firsts', value: 'firsts' },
                        { name: 'top', value: 'best' },
                        { name: 'recent', value: 'recent' },
                        { name: 'pinned', value: 'pinned' },
                    ]
                },
                {
                    name: 'all',
                    description: 'Shows all statistics',
                    type: Discord.ApplicationCommandOptionType.Boolean,
                    required: false,
                }
            ]
        },
        {
            name: 'simulate',
            description: 'Simulates a play on a map',
            dmPermission: true,
            options: [
                {
                    name: 'id',
                    description: 'The id of the map',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Integer,
                },
                {
                    name: 'mods',
                    description: 'The mods to use',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.String,
                },
                {
                    name: 'accuracy',
                    description: 'The accuracy to use',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Number,
                },
                {
                    name: 'combo',
                    description: 'The maximum combo',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Integer,
                },
                {
                    name: 'n300',
                    description: 'The number of hit 300s',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Integer,
                },
                {
                    name: 'n100',
                    description: 'The number of hit 100s',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Integer,
                },
                {
                    name: 'n50',
                    description: 'The number of hit 50s',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Integer,
                },
                {
                    name: 'miss',
                    description: 'The number of misses',
                    required: false,
                    type: Discord.ApplicationCommandOptionType.Integer,
                },
            ]
        },
        {
            name: 'userbeatmaps',
            description: 'Displays the user\'s beatmaps',
            dmPermission: true,
            options: [
                {
                    name: 'user',
                    description: 'The user to display the beatmaps of',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'type',
                    description: 'The type of beatmaps to display',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        { name: 'ranked', value: 'ranked' },
                        { name: 'loved', value: 'loved' },
                        { name: 'favourites', value: 'favourite' },
                        { name: 'pending', value: 'pending' },
                        { name: 'graveyard', value: 'graveyard' },
                        { name: 'nominated', value: 'nominated' }
                    ]
                },
                {
                    name: 'reverse',
                    description: 'Whether to reverse the order of the beatmaps',
                    type: Discord.ApplicationCommandOptionType.Boolean,
                    required: false,
                },
                {
                    name: 'page',
                    description: 'The page to display',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: false,
                    minValue: 1
                },
                {
                    name: 'sort',
                    description: 'The sort order to use',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        { name: 'Title', value: 'title' },
                        { name: 'Artist', value: 'artist' },
                        { name: 'Difficulty', value: 'difficulty' },
                        { name: 'Ranked Status', value: 'status' },
                        { name: 'Fail Count', value: 'fails' },
                        { name: 'Play Count', value: 'plays' },
                        { name: 'Date Submitted', value: 'dateadded' },
                        { name: 'Favourites', value: 'favourites' },
                        { name: 'BPM', value: 'bpm' },
                        { name: 'CS', value: 'cs' },
                        { name: 'AR', value: 'ar' },
                        { name: 'OD', value: 'od' },
                        { name: 'HP', value: 'hp' },
                        { name: 'Song Length', value: 'length' },
                    ]
                },
                {
                    name: 'filter',
                    description: 'Show maps matching this string',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'parse',
                    description: 'Parse the map matching this index',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: false,
                    minValue: 1
                }
            ]
        },
        {
            name: 'whatif',
            description: 'Estimates user stats if they gain a certain amount of raw pp',
            dmPermission: true,
            options: [
                {
                    name: 'pp',
                    description: 'The amount of pp to gain',
                    type: Discord.ApplicationCommandOptionType.Number,
                    required: true,
                },
                {
                    name: 'user',
                    description: 'The user to estimate the stats of',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: 'mode',
                    description: 'The mode to use',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: false,
                    choices: helper.vars.commandopts.modeopts
                }
            ]
        },
        {
            name: 'hug',
            description: 'Sends a gif',
            dmPermission: false,
            options: [
                {
                    name: 'target',
                    description: 'The user to target',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'kiss',
            description: 'Sends a gif',
            dmPermission: false,
            options: [
                {
                    name: 'target',
                    description: 'The user to target',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'lick',
            description: 'Sends a gif',
            dmPermission: false,
            options: [
                {
                    name: 'target',
                    description: 'The user to target',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'pet',
            description: 'Sends a gif',
            dmPermission: false,
            options: [
                {
                    name: 'target',
                    description: 'The user to target',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'punch',
            description: 'Sends a gif',
            dmPermission: false,
            options: [
                {
                    name: 'target',
                    description: 'The user to target',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: 'slap',
            description: 'Sends a gif',
            dmPermission: false,
            options: [
                {
                    name: 'target',
                    description: 'The user to target',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true
                }
            ]
        },
        {
            name: '8ball',
            description: 'Responds to a question',
            dmPermission: true,
        },
        {
            name: 'roll',
            description: 'Returns a random number',
            dmPermission: true,
            options: [
                {
                    name: 'max',
                    description: 'The maximum number to get',
                    type: Discord.ApplicationCommandOptionType.Number,
                    required: false
                },
                {
                    name: 'min',
                    description: 'The minimum number to get',
                    type: Discord.ApplicationCommandOptionType.Number,
                    required: false,
                    minValue: 0
                }
            ]
        },
        // {
        //     name: 'say',
        //     description: 'Send a message to a channel',
        //     dmPermission: false,
        //     options: [
        //         {
        //             name: 'message',
        //             description: 'The message to send',
        //             type: Discord.ApplicationCommandOptionType.String,
        //             required: true
        //         },
        //         {
        //             name: 'channel',
        //             description: 'The channel to send the message to',
        //             type: Discord.ApplicationCommandOptionType.Channel,
        //             required: false
        //         }
        //     ]
        // },
        {
            name: 'poll',
            description: 'Creates a poll',
            dmPermission: false,
            options: [
                {
                    name: 'title',
                    description: 'The title of the poll',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: 'options',
                    description: 'The options. SEPARATE WITH +',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                }

            ]
        },


        //below are admin related commands
        {
            name: 'checkperms',
            description: 'Checks the permissions of a user',
            dmPermission: false,
            options: [
                {
                    name: 'user',
                    description: 'The user to check the permissions of',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: true,
                }
            ]
        },
        {
            name: 'find',
            description: 'Finds details of a user/guild/channel/role/emoji/sticker',
            dmPermission: false,
            options: [
                {
                    name: 'type',
                    description: 'The type of info to fetch',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: 'User', value: 'user' },
                        { name: 'Guild (server)', value: 'guild' },
                        { name: 'Channel', value: 'channel' },
                        { name: 'Role', value: 'role' },
                        { name: 'Emoji', value: 'emoji' },
                        { name: 'Sticker', value: 'sticker' },
                    ]
                },
                {
                    name: 'id',
                    description: 'The ID to fetch',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        },
        {
            name: 'servers',
            description: 'Displays all servers the bot is in',
            dmPermission: false,

        },
        {
            name: 'leaveguild',
            description: 'Leaves a server',
            dmPermission: false,
            options: [
                {
                    name: 'guild',
                    description: 'The server to leave',
                    type: Discord.ApplicationCommandOptionType.String,
                    required: true,
                }
            ],

        },
        // {
        //     name: 'voice',
        //     description: 'Controls a user\'s voice settings',
        //     dmPermission: false,
        //     options: [
        //         {
        //             name: 'user',
        //             description: 'The user to control',
        //             type: Discord.ApplicationCommandOptionType.User,
        //             required: true,
        //         },
        //         {
        //             name: 'type',
        //             description: 'The type of voice control to perform',
        //             type: Discord.ApplicationCommandOptionType.String,
        //             required: true,
        //             choices: [
        //                 { name: 'Mute', value: 'mute' },
        //                 { name: 'Deafen', value: 'deafen' },
        //                 { name: 'Move to another channel', value: 'move' },
        //                 { name: 'Disconnect', value: 'disconnect' }
        //             ]
        //         },
        //         {
        //             name: 'channel',
        //             description: 'The channel to move the user to',
        //             type: Discord.ApplicationCommandOptionType.Channel,
        //             required: false,
        //         }
        //     ],
        // },
        // {
        //     name: 'find',
        //     description: 'Returns the name of something from the id given',
        //     dmPermission: false,
        //     options: [
        //         {
        //             name: 'type',
        //             description: 'The type of thing to find',
        //             type: Discord.ApplicationCommandOptionType.String,
        //             required: true,
        //             choices: [
        //                 { name: 'User', value: 'user' },
        //                 { name: 'Channel', value: 'channel' },
        //                 { name: 'Guild', value: 'guild' },
        //                 { name: 'Role', value: 'role' },
        //                 { name: 'Emoji', value: 'emoji' },
        //             ]
        //         },
        //         {
        //             name: 'id',
        //             description: 'The id of the thing to find',
        //             type: Discord.ApplicationCommandOptionType.String,
        //             required: true,
        //             minValue: 1
        //         }
        //     ]
        // },
        {
            name: 'userinfo',
            description: 'Returns information about a user',
            dmPermission: false,
            options: [
                {
                    name: 'user',
                    description: 'The user to get information about',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: false,
                }
            ]
        },
        {
            name: 'avatar',
            description: 'Returns the avatar of a user',
            dmPermission: false,
            options: [
                {
                    name: 'user',
                    description: 'The user to get the avatar of',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: false,
                }
            ]
        },
        {
            name: 'purge',
            description: 'Purges a channel',
            dmPermission: false,
            options: [
                {
                    name: 'count',
                    description: 'The amount of messages to purge',
                    type: Discord.ApplicationCommandOptionType.Integer,
                    required: true,
                    minValue: 1,
                },
                {
                    name: 'user',
                    description: 'The user to purge messages from',
                    type: Discord.ApplicationCommandOptionType.User,
                    required: false,
                }
            ]
        },
    ]);

}