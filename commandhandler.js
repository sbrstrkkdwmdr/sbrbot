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
                client.commands.get('help').execute(message, client, Discord, interaction, currentDate, currentDateISO);
                break;
            case 'gif':
                client.commands.get('gif').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;

            //osu commands below

            case 'map':
                client.osucmds.get('map').execute(message, args, client, Discord, interaction, currentDate, currentDateISO, config);
                break;
            case 'rs':case 'recent':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'osu':case 'profile':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
            case 'osutop':case 'top':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
            break;
            case 'scores':case 'c':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
        }


    })
}