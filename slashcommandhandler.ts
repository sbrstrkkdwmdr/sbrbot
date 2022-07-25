//const { Constants } = require('discord.js');
const { ApplicationCommandOptionType, InteractionType } = require('discord.js');
const cmdconfig = require('./configs/commandopts')
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {

    client.on('interactionCreate', async (interaction) => {
        if (!(interaction.type === InteractionType.ApplicationCommand)) return;
        //make a variable that is the current date
        let currentDate = new Date()
        let currentDateISO = new Date().toISOString()
        let message = null;
        let args = null;
        let button = null;

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
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button)
                break;
            case 'map':
                client.osucmds.get('map').execute(message, args, client, Discord, interaction, currentDate, currentDateISO, config)
                break;
            case 'rs':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button)
                break;
            case 'scores':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button)
                break;
            case 'leaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'osumodcalc':
                client.osucmds.get('osumodcalc').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
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
            case 'Links':
                client.commands.get('info').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'Bookmark':
                client.commands.get('bookmark').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            default:
                interaction.reply({ content: 'Command not found - no longer exists or is currently being rewritten', ephemeral: true })
                break;
        }
    })

}