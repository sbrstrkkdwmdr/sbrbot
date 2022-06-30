module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    client.on('messageCreate', message => {
        const discvoice = require('@discordjs/voice')
        const ytaudio = require('youtube-audio-stream')

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();

        const args = message.content.slice(config.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!message.content.startsWith(config.prefix)) return; //the return is so if its just prefix nothing happens

        if (message.author.bot && !message.author.id == '755220989494951997') return;

        let interaction = null;
        switch (command) {
            case 'play':
                client.musiccmds.get('play').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction);
                break;
        }
    })
}