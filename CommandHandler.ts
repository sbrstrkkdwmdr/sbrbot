import fs = require('fs');
import cmdchecks = require('./calc/commandchecks');
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config, oncooldown) => {

    let timeouttime;

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();
        const currentDateISO = new Date().toISOString();
        const absoluteID = currentDate.getTime()

        const args = message.content.slice(config.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!message.content.startsWith(config.prefix)) return; //the return is so if its just prefix nothing happens
        if (message.author.bot && !(message.author.id == '755220989494951997' || message.author.id == '777125560869978132')) return;
        if (!oncooldown.has(message.author.id)) {
            timeouttime = new Date().getTime() + 3000
        }
        if (oncooldown.has(message.author.id)) {
            setTimeout(() => {
                message.delete()
                .catch()
            }, 3000)
        }
        if (oncooldown.has(message.author.id)) {
            message.reply({
                content: `You're on cooldown!\nTry again in ${getTimeLeft(timeouttime) / 1000}s`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
                ephemeral: true
            });
            return;
        }
        if (!oncooldown.has(message.author.id)) {
            oncooldown.add(message.author.id);
            setTimeout(() => {
                oncooldown.delete(message.author.id)
            }, 3000)
        }
        function getTimeLeft(timeout) {
            return (timeout - new Date().getTime());
        }

        const interaction = null;
        const button = null;
        const obj = message;
        const overrides = null;
        switch (command) {
            case 'convert':
                client.commands.get('convert').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'help':
                client.commands.get('help').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'math':
                client.commands.get('math').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'ping':
                client.commands.get('ping').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'remind':
                client.commands.get('remind').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'stats':
                client.commands.get('stats').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'time':
                client.commands.get('time').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'info':
                client.commands.get('info').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;

            case '8ball': case 'ask':
                client.misccmds.get('8ball').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'emojify':
                client.misccmds.get('emojify').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break
            case 'gif':
                client.misccmds.get('gif').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'image': case 'imagesearch':
                client.misccmds.get('image').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'poll': case 'vote':
                client.misccmds.get('poll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'roll':
                client.misccmds.get('roll').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'say':
                client.misccmds.get('say').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'ytsearch': case 'yt':
                client.misccmds.get('ytsearch').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;

            //osu commands below
            case 'firsts':
                client.osucmds.get('firsts').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'map': case 'm':
                client.osucmds.get('map').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'rs': case 'recent': case 'r':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'osu': case 'profile': case 'o':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                break;
            case 'osuset':
                client.osucmds.get('osuset').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj)
                break;
            case 'osutop': case 'top':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'scores': case 'c':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'leaderboard': case 'maplb': case 'mapleaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'lb':
                client.osucmds.get('lb').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'pinned':
                client.osucmds.get('pinned').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'skin':
                client.osucmds.get('skin').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'simplay': case 'simulate':
                client.osucmds.get('simplay').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;

            //admincmds below
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('checkperms').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'leaveguild': case 'leave':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('leaveguild').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'servers':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('servers').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'debug':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('debug').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'voice':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('voice').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'crash':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('crash').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'log':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('log').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'find':
                client.admincmds.get('find').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
                break;
            case 'purge':
                if (cmdchecks.isAdmin(message.author.id, message.guildId, client) || cmdchecks.isOwner(message.author.id))
                    client.admincmds.get('purge').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
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