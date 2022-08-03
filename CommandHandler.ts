import fs = require('fs');
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    const oncooldown = new Set();

    client.on('messageCreate', async (message) => {

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();

        const args = message.content.slice(config.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!message.content.startsWith(config.prefix)) return; //the return is so if its just prefix nothing happens
        if (message.author.bot && message.content.includes("You're on cooldown")) {
            setTimeout(() => {
                message.delete();
            }, 1)
        }
        let timeouttime;
        if (message.author.bot && !(message.author.id == '755220989494951997' || message.author.id == '777125560869978132')) return;
        if (oncooldown.has(message.author.id)) {
            return message.channel.send(`You're on cooldown\nTime left: ${getTimeLeft(timeouttime)}ms`);
        };
        if (!oncooldown.has(message.author.id)) {
            oncooldown.add(message.author.id);
            setTimeout(() => {
                oncooldown.delete(message.author.id)
            }, 3000)
            timeouttime = setTimeout(() => { }, 3000)
        }
        function getTimeLeft(timeout) {
            return '???' //Math.ceil(timeout._idleStart - timeout._idleTimeout)
        }
        let interaction = null;
        let button = null;
        switch (command) {
            case 'convert':
                client.commands.get('convert').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'help':
                client.commands.get('help').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'math':
                client.commands.get('math').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'ping':
                client.commands.get('ping').execute(message, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'remind':
                client.commands.get('remind').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'stats':
                client.commands.get('stats').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'time':
                client.commands.get('time').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;

            case '8ball': case 'ask':
                client.misccmds.get('8ball').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'emojify':
                client.misccmds.get('emojify').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break
            case 'gif':
                client.misccmds.get('gif').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'image': case 'imagesearch':
                client.misccmds.get('image').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'poll': case 'vote':
                client.misccmds.get('poll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'roll':
                client.misccmds.get('roll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'say':
                client.misccmds.get('say').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'ytsearch': case 'yt':
                client.misccmds.get('ytsearch').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            //osu commands below
            case 'firsts':
                client.osucmds.get('firsts').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                break;
            case 'map': case 'm':
                client.osucmds.get('map').execute(message, args, client, Discord, interaction, currentDate, currentDateISO, config);
                break;
            case 'rs': case 'recent': case 'r':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                break;
            case 'osu': case 'profile': case 'o':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'osuset':
                client.osucmds.get('osuset').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction)
                break;
            case 'osutop': case 'top':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                break;
            case 'scores': case 'c':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                break;
            case 'lb':
                client.osucmds.get('lb').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                break;
            case 'pinned':
                client.osucmds.get('pinned').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                break;
            case 'skin':
                client.osucmds.get('skin').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                break;
            case 'simplay':
                client.osucmds.get('simplay').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                break;

            //admincmds below
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
                client.admincmds.get('checkperms').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'leaveguild': case 'leave':
                client.admincmds.get('leaveguild').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'servers':
                client.admincmds.get('servers').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'debug':
                client.admincmds.get('debug').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'voice':
                client.admincmds.get('voice').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'crash':
                client.admincmds.get('crash').execute(message, args, userdata, client, Discord);
                break;
            case 'log':
                client.admincmds.get('log').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'find':
                client.admincmds.get('find').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;



            // music

            // WIP
            case 'compare': case 'whatif': case 'play': case 'pause': case 'np': case 'wip': case 'skip': case 'queue': case 'resume':
                message.reply({ content: 'This command is currently under development. Will be added later.', allowedMentions: { repliedUser: false } });
                break;

        }
        fs.appendFileSync('logs/totalcommands.txt', 'x')


    })
}