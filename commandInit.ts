import cmdconfig = require('./src/consts/commandopts');
import Discord = require('discord.js');
module.exports = (userdata, client, config, oncooldown) => {

    const guildID = config.testGuildID;
    //const guild = client.guilds.cache.get(guildID);
    //let commands;
    /*     let settoguild = 0
        if (settoguild == 1 && guild) {
            commands = guild.commands
        } else { */
    const commands = client.application?.commands
    //}

    commands?.set([{
        name: 'ping',
        description: 'Pong!',
        dmPermission: false,
    },
    {
        name: 'help',
        description: 'Displays all commands',
        dmPermission: false,
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
        name: 'gif',
        description: 'Sends a random gif',
        dmPermission: false,
        options: [
            {
                name: 'type',
                description: 'The type of gif to send',
                type: Discord.ApplicationCommandOptionType.String,
                required: true,
                choices: cmdconfig.gifopts
            }
        ]
    },
    {
        name: 'image',
        description: 'Searches the Google API and returns the first five results',
        dmPermission: false,
        options: [
            {
                name: 'query',
                description: 'The parameters for the search',
                type: Discord.ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'ytsearch',
        description: 'Searches the YouTube API and returns the first five results',
        dmPermission: false,
        options: [
            {
                name: 'query',
                description: 'The parameters for the search',
                type: Discord.ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'math',
        description: 'Solves a simple math problem',
        dmPermission: false,
        options: [
            {
                name: 'type',
                description: 'The parameters for the search',
                type: Discord.ApplicationCommandOptionType.String,
                required: true,
                choices: cmdconfig.mathcmdopts
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
        name: 'convert',
        description: 'Converts one value to another',
        dmPermission: false,
        options: [
            {
                name: 'from',
                description: 'What to convert the value from',
                type: Discord.ApplicationCommandOptionType.String,
                required: true,
                choices: cmdconfig.conversionopts
            },
            {
                name: 'to',
                description: 'What to convert the value to',
                type: Discord.ApplicationCommandOptionType.String,
                required: true,
                choices: cmdconfig.conversionopts
            },
            {
                name: 'number',
                description: 'The value to convert',
                type: Discord.ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: '8ball',
        description: 'Responds to a question',
        dmPermission: false,
    },
    {
        name: 'roll',
        description: 'Returns a random number',
        dmPermission: false,
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
    {
        name: 'remind',
        description: 'Reminds the user of something',
        dmPermission: false,
        options: [
            {
                name: 'time',
                description: 'How long to wait before sending the reminder. Must end in d, h, m, or s',
                type: Discord.ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'reminder',
                description: 'The reminder',
                type: Discord.ApplicationCommandOptionType.String,
                required: true
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
        name: 'say',
        description: 'Send a message to a channel',
        dmPermission: false,
        options: [
            {
                name: 'message',
                description: 'The message to send',
                type: Discord.ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'channel',
                description: 'The channel to send the message to',
                type: Discord.ApplicationCommandOptionType.Channel,
                required: false
            }
        ]
    },
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

    //below are osu related commands
    {
        name: 'osu',
        description: 'Displays the user\'s osu! profile',
        dmPermission: false,
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
                default: false
            },
            {
                name: 'mode',
                description: 'The mode to display the profile in',
                type: Discord.ApplicationCommandOptionType.String,
                required: false,
                choices: cmdconfig.modeopts
            }
        ]
    },
    {//alternate command for osu
        name: 'o',
        description: 'Displays the user\'s osu! profile',
        dmPermission: false,
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
                default: false
            },
            {
                name: 'mode',
                description: 'The mode to display the profile in',
                type: Discord.ApplicationCommandOptionType.String,
                required: false,
                choices: cmdconfig.modeopts
            }
        ]
    },
    {
        name: 'osuset',
        description: 'Sets the user\'s osu! profile',
        dmPermission: false,
        options: [
            {
                name: 'user',
                description: 'The user to set the profile of',
                type: Discord.ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'mode',
                description: 'The mode to set the profile to',
                type: Discord.ApplicationCommandOptionType.String,
                required: false,
                choices: cmdconfig.modeopts,
                default: 'osu'
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
        dmPermission: false,
        options: cmdconfig.playArrayOpts
    },
    {
        name: 'map',
        description: 'Displays the map info of the map',
        dmPermission: false,
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
                default: false
            },
            {
                name: 'name',
                description: 'The name of the map to display',
                type: Discord.ApplicationCommandOptionType.String,
                required: false,
            }
        ]
    },
    {//alternate command for map
        name: 'm',
        description: 'Displays the map info of the map',
        dmPermission: false,
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
                default: false
            }
        ]
    },
    {
        name: 'rs',
        description: 'Displays the user\'s most recent score',
        dmPermission: false,
        options: cmdconfig.rsopts
    },
    {//alternate command for rs
        name: 'recent',
        description: 'Displays the user\'s most recent score',
        dmPermission: false,
        options: cmdconfig.rsopts
    },
    {
        name: 'scores',
        description: 'Displays the user\'s scores for a set map',
        dmPermission: false,
        options: cmdconfig.useridsortopts
    },
    {//alternate command for scores
        name: 'c',
        description: 'Displays the user\'s scores for a set map',
        dmPermission: false,
        options: cmdconfig.useridsortopts
    },
    {
        name: 'firsts',
        description: 'Displays the user\'s #1 scores',
        dmPermission: false,
        options: cmdconfig.playArrayOpts
    },
    {
        name: 'pinned',
        description: 'Displays the user\'s pinned scores',
        dmPermission: false,
        options: cmdconfig.playArrayOpts
    },
    {
        name: 'leaderboard',
        description: 'Displays the top five plays on a specific map',
        dmPermission: false,
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
                default: 1,
                minValue: 1,
                maxValue: 20

            },
            {
                name: 'mods',
                description: 'What mods to sort',
                required: false,
                type: Discord.ApplicationCommandOptionType.String
            }
        ]
    },
    {//alternate command for leaderboard
        name: 'maplb',
        description: 'Displays the top five plays on a specific map',
        dmPermission: false,
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
                default: 1,
                minValue: 1,
                maxValue: 20

            },
            {
                name: 'mods',
                description: 'What mods to sort',
                required: false,
                type: Discord.ApplicationCommandOptionType.String
            }
        ]
    },
    {
        name: 'lb',
        description: 'Displays the server leaderboard',
        dmPermission: false,
    },
    {
        name: 'compare',
        description: 'Compares two users/scores',
        dmPermission: false,
        options: [
            {
                name: 'type',
                description: 'The type of comparison',
                required: false,
                type: Discord.ApplicationCommandOptionType.String,
            },
            {
                name: 'first',
                description: 'The first user/score to compare',
                required: false,
                type: Discord.ApplicationCommandOptionType.String,
            },
            {
                name: 'second',
                description: 'The second user/score to compare',
                required: false,
                type: Discord.ApplicationCommandOptionType.String,
            }
        ]
    },
    {
        name: 'simulate',
        description: 'Simulates a play on a map',
        dmPermission: false,
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
    /* {
        name: 'osumodcalc',
        description: 'Calculates the values for a map based on the values given',
        dmPermission: false,
        options: [
            {
                name: 'mods',
                description: 'The mods to calculate the values for',
                required: true,
                type: Discord.ApplicationCommandOptionType.String
            },
            {
                name: 'cs',
                description: 'The circle size to calculate the values for',
                required: true,
                type: Discord.ApplicationCommandOptionType.Number,
                minValue: 0,
                maxValue: 11
            },
            {
                name: 'ar',
                description: 'The approach rate to calculate the values for',
                required: true,
                type: Discord.ApplicationCommandOptionType.Number,
                minValue: 0,
                maxValue: 11
            },
            {
                name: 'od',
                description: 'The overall difficulty to calculate the values for',
                required: true,
                type: Discord.ApplicationCommandOptionType.Number,
                minValue: 0,
                maxValue: 11
            },
            {
                name: 'hp',
                description: 'The HP to calculate the values for',
                required: true,
                type: Discord.ApplicationCommandOptionType.Number,
                minValue: 0,
                maxValue: 11
            },
            {
                name: 'bpm',
                description: 'The BPM to calculate the values for',
                required: true,
                type: Discord.ApplicationCommandOptionType.Number,
                minValue: 1

            }
        ]


    }, */

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
                minValue: 1
            }
        ],
        //channelTypes: ['GuildText']

    },
    {
        name: 'voice',
        description: 'Controls a user\'s voice settings',
        dmPermission: false,
        options: [
            {
                name: 'user',
                description: 'The user to control',
                type: Discord.ApplicationCommandOptionType.User,
                required: true,
            },
            {
                name: 'type',
                description: 'The type of voice control to perform',
                type: Discord.ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: 'Mute', value: 'mute' },
                    { name: 'Deafen', value: 'deafen' },
                    { name: 'Move to another channel', value: 'move' },
                    { name: 'Disconnect', value: 'disconnect' }
                ]
            },
            {
                name: 'channel',
                description: 'The channel to move the user to',
                type: Discord.ApplicationCommandOptionType.Channel,
                required: false,
            }
        ],
        //channelTypes: ['GuildText']
    },
    {
        name: 'find',
        description: 'Returns the name of something from the id given',
        dmPermission: false,
        options: [
            {
                name: 'type',
                description: 'The type of thing to find',
                type: Discord.ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: 'User', value: 'user' },
                    { name: 'Channel', value: 'channel' },
                    { name: 'Guild', value: 'guild' },
                    { name: 'Role', value: 'role' },
                    { name: 'Emoji', value: 'emoji' },
                ]
            },
            {
                name: 'id',
                description: 'The id of the thing to find',
                type: Discord.ApplicationCommandOptionType.String,
                required: true,
                minValue: 1
            }
        ]
    },
    {
        name: 'log',
        description: 'Displays the log of a server',
        dmPermission: false,
        options: [
            {
                name: 'guildid',
                description: 'The guild to display the log of',
                type: Discord.ApplicationCommandOptionType.String,
                required: false,
                minValue: 1
            },
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
    // {
    //     name: 'settings',
    //     description: 'Opens the settings menu',
    //     dmPermission: false,
    //     options: [
    //         {
    //             name: 'setting',
    //             description: 'The setting to change',
    //             type: Discord.ApplicationCommandOptionType.String,
    //             required: true,
    //             choices: [
    //                 { name: 'Prefix', value: 'prefix' },
    //                 { name: 'admin', value: 'admin' },
    //                 { name: 'osu', value: 'osu' },
    //                 { name: 'general', value: 'general' },
    //                 { name: 'misc', value: 'misc' },
    //                 { name: 'music', value: 'music' },
    //             ]
    //         }
    //     ]
    // },

    // {
    //     name: 'settings',
    //     description: 'Displays/edits the settings of a server',
    //     dmPermission: false,
    //     options: [
    //         {
    //             name: 'setting',
    //             description: 'The setting to edit',
    //             type: Discord.ApplicationCommandOptionType.SubcommandGroup,
    //             options: [
    //                 {
    //                     name: 'admin',
    //                     description: 'The admin setting to edit',
    //                     type: Discord.ApplicationCommandOptionType.SubcommandGroup,
    //                     required: false,
    //                     options: [
    //                         {
    //                             name: 'basic',
    //                             description: 'The basic setting to edit',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'enabled',
    //                                     description: 'Whether or not admin commands are enabled',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'limited',
    //                                     description: 'Whether or not to limit admin commands to specific channels',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                             ]
    //                         },
    //                         {
    //                             name: 'channels',
    //                             description: 'The channels to limit admin commands to',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'add',
    //                                     description: 'Adds a channel to the list of channels to limit admin commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'remove',
    //                                     description: 'Removes a channel from the list of channels to limit admin commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'clear',
    //                                     description: 'Clears the list of channels to limit admin commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             name: 'log',
    //                             description: 'The log setting to edit',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'messages',
    //                                     description: 'Whether or not to log messages edits/deletions',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'guild',
    //                                     description: 'Whether or not to log guild events',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'channel',
    //                                     description: 'Whether or not to log channel events',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'role',
    //                                     description: 'Whether or not to log role events',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'emoji',
    //                                     description: 'Whether or not to log emoji events',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'user',
    //                                     description: 'Whether or not to log user events',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'voice',
    //                                     description: 'Whether or not to log voice events',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'presence',
    //                                     description: 'Whether or not to log user presence events',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: 'osu',
    //                     description: 'The osu! setting to edit',
    //                     type: Discord.ApplicationCommandOptionType.SubcommandGroup,
    //                     required: false,
    //                     options: [
    //                         {
    //                             name: 'basic',
    //                             description: 'The basic setting to edit',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'enabled',
    //                                     description: 'Whether or not osu! commands are enabled',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'limited',
    //                                     description: 'Whether or not to limit the osu! commands to specific channels',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                             ]
    //                         },
    //                         {
    //                             name: 'channels',
    //                             description: 'The channels to limit osu! commands to',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'add',
    //                                     description: 'Adds a channel to the list of channels to limit osu! commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'remove',
    //                                     description: 'Removes a channel from the list of channels to limit osu! commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'clear',
    //                                     description: 'Clears the list of channels to limit osu! commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             name: 'parsing',
    //                             description: 'The parsing setting to edit',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'parselinks',
    //                                     description: 'Whether or not to parse osu! links',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'parsereplays',
    //                                     description: 'Whether or not to parse osu! replays',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'parsescreenshots',
    //                                     description: 'Whether or not to parse osu! screenshots',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 }
    //                             ]
    //                         }
    //                     ]

    //                 },
    //                 {
    //                     name: 'general',
    //                     description: 'The setting to edit',
    //                     type: Discord.ApplicationCommandOptionType.SubcommandGroup,
    //                     required: false,
    //                     options: [
    //                         {
    //                             name: 'basic',
    //                             description: 'The basic setting to edit',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'enabled',
    //                                     description: 'Whether or not general commands are enabled',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'limited',
    //                                     description: 'Whether or not to limit general commands to specific channels',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                             ]
    //                         },
    //                         {
    //                             name: 'channels',
    //                             description: 'The channels to limit general commands to',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'add',
    //                                     description: 'Adds a channel to the list of channels to limit general commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'remove',
    //                                     description: 'Removes a channel from the list of channels to limit general commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'clear',
    //                                     description: 'Clears the list of channels to limit general commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: 'misc',
    //                     description: 'The misc setting to edit',
    //                     type: Discord.ApplicationCommandOptionType.SubcommandGroup,
    //                     required: false,
    //                     options: [
    //                         {
    //                             name: 'basic',
    //                             description: 'The basic setting to edit',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'enabled',
    //                                     description: 'Whether or not misc commands are enabled',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'limited',
    //                                     description: 'Whether or not to limit misc commands to specific channels',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                             ]
    //                         },
    //                         {
    //                             name: 'channels',
    //                             description: 'The channels to limit misc commands to',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'add',
    //                                     description: 'Adds a channel to the list of channels to limit misc commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'remove',
    //                                     description: 'Removes a channel from the list of channels to limit misc commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'clear',
    //                                     description: 'Clears the list of channels to limit misc commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: 'music',
    //                     description: 'The music setting to edit',
    //                     type: Discord.ApplicationCommandOptionType.SubcommandGroup,
    //                     required: false,
    //                     options: [
    //                         {
    //                             name: 'basic',
    //                             description: 'The basic setting to edit',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'enabled',
    //                                     description: 'Whether or not music commands are enabled',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'limited',
    //                                     description: 'Whether or not to limit music commands to specific channels',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 },
    //                             ]
    //                         },
    //                         {
    //                             name: 'channels',
    //                             description: 'The channels to limit music commands to',
    //                             type: Discord.ApplicationCommandOptionType.Subcommand,
    //                             required: false,
    //                             options: [
    //                                 {
    //                                     name: 'add',
    //                                     description: 'Adds a channel to the list of channels to limit music commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'remove',
    //                                     description: 'Removes a channel from the list of channels to limit music commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Channel,
    //                                     required: false,
    //                                 },
    //                                 {
    //                                     name: 'clear',
    //                                     description: 'Clears the list of channels to limit music commands to',
    //                                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                                     required: false,
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     name: 'reset',
    //                     description: 'Resets the settings of a server',
    //                     type: Discord.ApplicationCommandOptionType.Boolean,
    //                     required: false,
    //                 }
    //             ]
    //         }
    //     ]
    // },

    {
        name: 'Bookmark',
        type: 3,
        dmPermission: false,
    }
    ])
}