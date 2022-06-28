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
        if (message.author.bot && !message.author.id == '755220989494951997') return;
        if (oncooldown.has(message.author.id)) {
            return message.channel.send(`You're on cooldown\nTime left: ${getTimeLeft(timeouttime)}ms (this is definitely the wrong number)`)
        };

        if (!oncooldown.has(message.author.id)) {
            oncooldown.add(message.author.id);
            setTimeout(() => {
                oncooldown.delete(message.author.id)
            }, 3000)
            timeouttime = setTimeout(() => { }, 3000)
        }
        function getTimeLeft(timeout) {
            return Math.ceil((timeout._idleStart + timeout._idleTimeout) / 1000);
        }
        let interaction = null;
        switch (command) {
            case 'ping':
                client.commands.get('ping').execute(message, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'help':
                client.commands.get('help').execute(message, args, client, Discord, interaction, currentDate, currentDateISO);
                break;
            case 'gif':
                client.commands.get('gif').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'image': case 'imagesearch':
                client.commands.get('image').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'ytsearch': case 'yt':
                client.commands.get('ytsearch').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'math':
                client.commands.get('math').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'convert':
                client.commands.get('convert').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case '8ball': case 'ask':
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
            case 'poll': case 'vote':
                client.commands.get('poll').execute(message, args, client, Discord, interaction, currentDate, currentDateISO, config);
                break;

            //osu commands below

            case 'map': case 'm':
                client.osucmds.get('map').execute(message, args, client, Discord, interaction, currentDate, currentDateISO, config);
                break;
            case 'rs': case 'recent':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'osu': case 'profile':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'osutop': case 'top':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'scores': case 'c':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'leaderboard': case 'lb': case 'maplb': case 'mapleaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
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


            // music

            case 'sfx':
                client.musiccmds.get('sfx').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
        }


    })
}