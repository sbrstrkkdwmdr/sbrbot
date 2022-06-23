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
            },
            {
                name: 'type2',
                description: 'What to convert the value to',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
            },
            {
                name: 'number',
                description: 'The value to convert',
                type: Constants.ApplicationCommandOptionTypes.NUMBER,
                required: true
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
                type: Constants.ApplicationCommandOptionTypes.INTEGER,
                required: true,
            }
        ]

    })

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;
        //make a variable that is the current date
        let currentDate = new Date()
        let currentDateISO = new Date().toISOString()
        let message = null;
        let args = null

        const { commandName, options } = interaction
        switch (commandName) {
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
            default:
                interaction.reply({ content: 'Command not found - no longer exists or is currently being rewritten', ephemeral: true })
                break;
        }
    })

}