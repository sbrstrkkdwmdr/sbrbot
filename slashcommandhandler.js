const { Constants } = require('discord.js');
const cmdconfig = require('./configs/commandopts')
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    const guildID = config.testGuildID;
    const guild = client.guilds.cache.get(guildID);
    let commands
    settoguild = 0
    if (settoguild == 1 && guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'ping',
        description: 'Pong!',
    })
    commands?.create({
        name: 'help',
        description: 'Displays all commands',
        options: [
            {
                name: 'command',
                description: 'Displays help for a specific command',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
            }
        ]
    })
    commands?.create({
        name: 'gif',
        description: 'Sends a random gif',
        options: [
            {
                name: 'type',
                description: 'The type of gif to send',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                choices: cmdconfig.gifopts
            }
        ]
    })
    commands?.create({
        name: 'image',
        description: 'Searches the Google API and returns the first five results',
        options: [
            {
                name: 'query',
                description: 'The parameters for the search',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            }
        ]
    })
    commands?.create({
        name: 'ytsearch',
        description: 'Searches the YouTube API and returns the first five results',
        options: [
            {
                name: 'query',
                description: 'The parameters for the search',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            }
        ]
    })
    commands?.create({
        name: 'math',
        description: 'Solves a simple math problem',
        options: [
            {
                name: 'type',
                description: 'The parameters for the search',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                choices: cmdconfig.mathcmdopts
            },
            {
                name: 'num1',
                description: 'The first number',
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
                required: true
            },
            {
                name: 'num2',
                description: 'The second number',
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
                required: false
            }
        ]
    })
    commands?.create({
        name: 'convert',
        description: 'Converts one value to another',
        options: [
            {
                name: 'type1',
                description: 'What to convert the value from',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                choices: cmdconfig.conversionopts
            },
            {
                name: 'type2',
                description: 'What to convert the value to',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                choices: cmdconfig.conversionopts
            },
            {
                name: 'number',
                description: 'The value to convert',
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
                required: true
            }
        ]
    })
    commands?.create({
        name: '8ball',
        description: 'Responds to a question',
    })
    commands?.create({
        name: 'roll',
        description: 'Returns a random number',
        options: [
            {
                name: 'number',
                description: 'The maximum number to get',
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
                required: false
            }
        ]
    })
    commands?.create({
        name: 'remind',
        description: 'Reminds the user of something',
        options: [
            {
                name: 'time',
                description: 'How long to wait before sending the reminder. Must end in d, h, m, or s',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            },
            {
                name: 'reminder',
                description: 'The reminder',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            },
            {
                name: 'sendinchannel',
                description: 'If true, the reminder will be sent into the channel',
                type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
                required: false
            }
        ]
    })
    commands?.create({
        name: 'say',
        description: 'Send a message to a channel',
        options: [
            {
                name: 'message',
                description: 'The message to send',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            },
            {
                name: 'channel',
                description: 'The channel to send the message to',
                type: Constants.ApplicationCommandOptionTypes.CHANNEL,
                required: false
            }
        ]
    })
    commands?.create({
        name: 'poll',
        description: 'Creates a poll',
        options: [
            {
                name: 'title',
                description: 'The title of the poll',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: 'options',
                description: 'The options. SEPARATE WITH +',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            }

        ]
    })

    //below are osu related commands
    commands?.create({
        name: 'osu',
        description: 'Displays the user\'s osu! profile',
        options: [
            {
                name: 'user',
                description: 'The user to display the profile of',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
            }
        ]
    })
    commands?.create({
        name: 'osuset',
        description: 'Sets the user\'s osu! profile',
        options: [
            {
                name: 'user',
                description: 'The user to set the profile of',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: 'mode',
                description: 'The mode to set the profile to',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                choices: cmdconfig.modeopts
            }
        ]
    })
    commands?.create({
        name: 'osutop',
        description: 'Displays the top plays of the user',
        options: [
            {
                name: 'user',
                description: 'The user to display the top plays of',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
            },
            {
                name: 'mode',
                description: 'The mode to display the top plays of',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
                choices: cmdconfig.modeopts
            },
            {
                name: 'sort',
                description: 'The sort to display the top plays of',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
                choices: cmdconfig.playsortopts
            },
            {
                name: 'page',
                description: 'The page to display the top plays of',
                type: Constants.ApplicationCommandOptionTypes.INTEGER,
                required: false,
            },
            {
                name: 'mapper',
                description: 'Filter the top plays to show maps from this mapper',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
            },
            {
                name: 'mods',
                description: 'Filter the top plays to show only plays with these mods',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
            },
            {
                name: 'detailed',
                description: 'Show all details',
                type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
                required: false,
            },
            {
                name: 'compact',
                description: 'Whether or not to show the compact version of the top plays',
                type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
                required: false,
            }
        ]
    })
    commands?.create({
        name: 'map',
        description: 'Displays the map info of the map',
        options: [
            {
                name: 'id',
                description: 'The id of the map to display',
                type: Constants.ApplicationCommandOptionTypes.INTEGER,
                required: false,
                minValue: 1
            },
            {
                name: 'mods',
                description: 'The mods to display the map info of',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
            }]
    })
    commands?.create({
        name: 'rs',
        description: 'Displays the user\'s most recent score',
        options: cmdconfig.useroffsetmodeopts
    })
    commands?.create({
        name: 'scores',
        description: 'Displays the user\'s scores for a set map',
        options: cmdconfig.useridsortopts
    })
    commands?.create({
        name: 'leaderboard',
        description: 'Displays the top five plays on a specific map',
        options: [
            {
                name: 'id',
                description: 'The id of the map to display',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.INTEGER
            },
            {
                name: 'page',
                description: 'Which page to display',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.INTEGER
            },
            {
                name: 'mods',
                description: 'What mods to sort',
                required: false,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    })


    //below are admin related commands
    commands?.create({
        name: 'checkperms',
        description: 'Checks the permissions of a user',
        options: [
            {
                name: 'user',
                description: 'The user to check the permissions of',
                type: Constants.ApplicationCommandOptionTypes.USER,
                required: true,
            }
        ]
    })
    commands?.create({
        name: 'servers',
        description: 'Displays all servers the bot is in',

    })
    commands?.create({
        name: 'leaveguild',
        description: 'Leaves a server',
        options: [
            {
                name: 'guild',
                description: 'The server to leave',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                minValue: 1
            }
        ],
        //channelTypes: ['GuildText']

    })
    commands?.create({
        name: 'voice',
        description: 'Controls a user\'s voice settings',
        options: [
            {
                name: 'user',
                description: 'The user to control',
                type: Constants.ApplicationCommandOptionTypes.USER,
                required: true,
            },
            {
                name: 'type',
                description: 'The type of voice control to perform',
                type: Constants.ApplicationCommandOptionTypes.STRING,
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
                type: Constants.ApplicationCommandOptionTypes.CHANNEL,
                required: false,
            }
        ],
        //channelTypes: ['GuildText']
    })
    commands?.create({
        name: 'find',
        description: 'Returns the name of something from the id given',
        options: [
            {
                name: 'type',
                description: 'The type of thing to find',
                type: Constants.ApplicationCommandOptionTypes.STRING,
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
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                minValue: 1
            }
        ]
    })
    commands?.create({
        name: 'log',
        description: 'Displays the log of a server',
        options: [
            {
                name: 'guildid',
                description: 'The guild to display the log of',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
                minValue: 1
            },
        ]
    })

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        //make a variable that is the current date
        let currentDate = new Date()
        let currentDateISO = new Date().toISOString()
        let message = null;
        let args = null

        switch (interaction.commandName) {
            case 'ping':
                client.commands.get('ping').execute(message, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'help':
                client.commands.get('help').execute(message, args, client, Discord, interaction, currentDate, currentDateISO)
                break;
            case 'gif':
                client.commands.get('gif').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'image':
                client.commands.get('image').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'ytsearch':
                client.commands.get('ytsearch').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'math':
                client.commands.get('math').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'convert':
                client.commands.get('convert').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case '8ball':
                client.commands.get('8ball').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'roll':
                client.commands.get('roll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'remind':
                client.commands.get('remind').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'say':
                client.commands.get('say').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'poll':
                client.commands.get('poll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;

            //osu below

            case 'osu':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'osuset':
                client.osucmds.get('osuset').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'osutop':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'map':
                client.osucmds.get('map').execute(message, args, client, Discord, interaction, currentDate, currentDateISO, config)
                break;
            case 'rs':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'scores':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'leaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;


            //admin 



            case 'checkperms':
                client.admincmds.get('checkperms').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'servers':
                client.admincmds.get('servers').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'leaveguild':
                client.admincmds.get('leaveguild').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'voice':
                client.admincmds.get('voice').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'find':
                client.admincmds.get('find').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'log':
                client.admincmds.get('log').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            default:
                interaction.reply({ content: 'Command not found - no longer exists or is currently being rewritten', ephemeral: true })
                break;
        }
    })

}