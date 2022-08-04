import fs = require('fs');
//const { Constants } = require('discord.js');
const { ApplicationCommandOptionType, InteractionType } = require('discord.js');
const cmdconfig = require('./configs/commandopts')
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {

    client.on('interactionCreate', async (interaction) => {
        if (!(interaction.type === InteractionType.ApplicationCommand)) return;
        //make a variable that is the current date
        let currentDate = new Date()
        let currentDateISO = new Date().toISOString()
        let absoluteID = currentDate.getTime();

        let message = null;
        let args = null;
        let button = null;

        switch (interaction.commandName) {
            case 'convert':
                client.commands.get('convert').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'help':
                client.commands.get('help').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'math':
                client.commands.get('math').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'ping':
                client.commands.get('ping').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'remind':
                client.commands.get('remind').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'stats':
                client.commands.get('stats').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'time':
                client.commands.get('time').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case '8ball': case 'ask':
                client.misccmds.get('8ball').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'emojify':
                client.misccmds.get('emojify').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break
            case 'gif':
                client.misccmds.get('gif').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'image': case 'imagesearch':
                client.misccmds.get('image').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'poll': case 'vote':
                client.misccmds.get('poll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'roll':
                client.misccmds.get('roll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'say':
                client.misccmds.get('say').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'ytsearch': case 'yt':
                client.misccmds.get('ytsearch').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;

            //osu below

            case 'osu':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'osuset':
                client.osucmds.get('osuset').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'osutop':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'map':
                client.osucmds.get('map').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'rs':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'scores':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'leaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'osumodcalc':
                client.osucmds.get('osumodcalc').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;


            //admin 



            case 'checkperms':
                client.admincmds.get('checkperms').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'servers':
                client.admincmds.get('servers').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'leaveguild':
                client.admincmds.get('leaveguild').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'voice':
                client.admincmds.get('voice').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'find':
                client.admincmds.get('find').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'log':
                client.admincmds.get('log').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'Links':
                client.commands.get('info').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            case 'Bookmark':
                client.commands.get('bookmark').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button);
                break;
            default:
                interaction.reply({ content: 'Command not found - no longer exists or is currently being rewritten', ephemeral: true })
                break;
        }
        fs.appendFileSync('logs/totalcommands.txt', 'x')

    })

}