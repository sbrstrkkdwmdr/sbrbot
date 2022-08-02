import cmdconfig = require('./configs/commandopts')

module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    
    const guildID = config.testGuildID;
    const guild = client.guilds.cache.get(guildID);
    let commands;
    let settoguild = 0
    if (settoguild == 1 && guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

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
                minValue: 1,
                maxValue: 100
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
                name: 'number',
                description: 'The maximum number to get',
                type: Discord.ApplicationCommandOptionType.Number,
                required: false
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
        options: [
            {
                name: 'user',
                description: 'The user to display the top plays of',
                type: Discord.ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: 'mode',
                description: 'The mode to display the top plays of',
                type: Discord.ApplicationCommandOptionType.String,
                required: false,
                choices: cmdconfig.modeopts
            },
            {
                name: 'sort',
                description: 'The sort to display the top plays of',
                type: Discord.ApplicationCommandOptionType.String,
                required: false,
                choices: cmdconfig.playsortopts
            },
            {
                name: 'reverse',
                description: 'If true, the top plays will be displayed in reverse',
                type: Discord.ApplicationCommandOptionType.Boolean,
                required: false,
            },
            {
                name: 'page',
                description: 'The page to display the top plays of',
                type: Discord.ApplicationCommandOptionType.Integer,
                required: false,
                default: 1,
                minValue: 1,
                maxValue: 20
            },
            {
                name: 'mapper',
                description: 'Filter the top plays to show maps from this mapper',
                type: Discord.ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: 'mods',
                description: 'Filter the top plays to show only plays with these mods',
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
                name: 'compact',
                description: 'Whether or not to show the compact version of the top plays',
                type: Discord.ApplicationCommandOptionType.Boolean,
                required: false,
                default: false
            }
        ]
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
            }
        ]
    },
    {
        name: 'rs',
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
    {
        name: 'leaderboard',
        description: 'Displays the top five plays on a specific map',
        dmPermission: false,
        options: [
            {
                name: 'id',
                description: 'The id of the map to display',
                required: false,
                type: Discord.ApplicationCommandOptionType.Integer
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
        name: 'Links',
        type: 2,
    },
    {
        name: 'Bookmark',
        type: 3,
        dmPermission: false,
    }
    ])
}