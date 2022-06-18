const { Constants } = require('discord.js');
const { modeopts, playsortopts, skincmdopts, mathcmdopts, conversionopts, gifopts, timezoneopts, useridsortopts, useroffsetmodeopts } = require('./configs/commandopts.js')

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
                choices: gifopts
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
                required: true,
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
                required: false,

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
            },
            {
                name: 'sort',
                description: 'The sort to display the top plays of',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: false,
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
        options: useroffsetmodeopts
    })
    commands?.create({
        name: 'scores',
        description: 'Displays the user\'s scores for a set map',
        options: useridsortopts
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
        name: 'leaveGuild',
        description: 'Leaves a server',
        options: [
            {
                name: 'guild',
                description: 'The server to leave',
                type: Constants.ApplicationCommandOptionTypes.GUILD,
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

        const { commandName, options } = interaction
        switch (commandName) {
            case 'ping':
                client.commands.get('ping').execute(message, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'help':
                client.commands.get('help').execute(client, Discord, interaction, currentDate, currentDateISO)
                break;
            case 'osu':
                client.osucmds.get('osu').execute(client, Discord, interaction, currentDate, currentDateISO, osuApiKey, osuClientID, osuClientSecret)

                break;
            case 'osuset':
                client.osucmds.get('osuset').execute(client, Discord, interaction, currentDate, currentDateISO, osuApiKey, osuClientID, osuClientSecret)
                break;
            case 'osutop':
                client.osucmds.get('osutop').execute(client, Discord, interaction, currentDate, currentDateISO, osuApiKey, osuClientID, osuClientSecret)
                break;
            case 'map':
                client.osucmds.get('map').execute(client, Discord, interaction, currentDate, currentDateISO, osuApiKey, osuClientID, osuClientSecret)
                break;
            case 'rs':
                client.osucmds.get('rs').execute(client, Discord, interaction, currentDate, currentDateISO, osuApiKey, osuClientID, osuClientSecret)
                break;
            case 'mapscores':
                client.osucmds.get('mapscores').execute(client, Discord, interaction, currentDate, currentDateISO, osuApiKey, osuClientID, osuClientSecret)
                break;
            case 'checkperms':
                client.admincmds.get('checkperms').execute(client, Discord, interaction, currentDate, currentDateISO)
                break;
            case 'servers':
                client.admincmds.get('servers').execute(client, Discord, interaction, currentDate, currentDateISO)
                break;
            case 'leaveGuild':
                client.admincmds.get('leaveGuild').execute(client, Discord, interaction, currentDate, currentDateISO)
                break;
            default:
                interaction.reply({content: 'Command not found', ephemeral: true})
                break;
            }
    })

}