import discvoice = require('@discordjs/voice');
import ytaudio = require('youtube-mp3-downloader');
import mp3length = require('get-mp3-duration');
import fs = require('fs');
import extypes = require('./configs/extratypes');

module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {

    const player = discvoice.createAudioPlayer({
        behaviors: {
            noSubscriber: discvoice.NoSubscriberBehavior.Pause,
        }
    })

    const songqueue = [];

    const yd = new ytaudio({
        "ffmpegPath": ".\\files\\ffmpegbin",
        "outputPath": ".\\files\\music",
        "youtubeVideoQuality": "highestaudio",
        "queueParallelism": 2,
        "progressTimeout": 2000,
        "allowWebm": false
    })

    client.on('messageCreate', async (message) => {

        const currentDate = new Date();
        const currentDateISO = new Date().toISOString();
        const absoluteID = currentDate.getTime();


        const args = message.content.slice(config.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!message.content.startsWith(config.prefix)) return; //the return is so if its just prefix nothing happens

        if (message.author.bot && message.author.id != '755220989494951997') return;

        const interaction = null;
        const obj = message;

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const settingsfile = fs.readFileSync(`./configs/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile);
        } catch (error) {
            const defaultSettings: extypes.guildSettings = {
                serverName: message.guild.name,
                prefix: 'sbr-',
                enabledModules: {
                    admin: false,
                    osu: true,
                    general: true,
                    links: true,
                    misc: true,
                    music: true,
                },
                admin: {
                    basic: 'n',
                    limited: false,
                    channels: [],
                    log: {
                        messageUpdates: true,
                        guildUpdates: true,
                        channelUpdates: true,
                        roleUpdates: true,
                        emojiUpdates: true,
                        userUpdates: true,
                        presenceUpdates: false,
                        voiceUpdates: true,
                    }
                },
                osu: {
                    basic: 'n',
                    limited: false,
                    channels: [],
                    parseLinks: true,
                    parseReplays: true,
                    parseScreenshots: true,
                },
                general: {
                    basic: 'n',
                    limited: false,
                    channels: []
                },
                misc: {
                    basic: 'n',
                    limited: false,
                    channels: []
                },
                music: {
                    basic: 'n',
                    limited: false,
                    channels: []
                }
            }
            fs.writeFileSync(`./configs/guilds/${currentGuildId}.json`, JSON.stringify(defaultSettings, null, 2), 'utf-8')
            settings = defaultSettings
        }
        switch (command) {
            case 'convert': case 'help': case 'math': case 'ping': case 'remind': case 'stats': case 'time': case 'info':
                if (settings.enabledModules.general == false) {
                    return;
                }
                else if (settings.general.limited == true) {
                    if (!settings.general.channels.includes(obj.channelId)) {
                        return;
                    }
                }
                break;
            case '8ball': case 'ask': case 'emojify': case 'gif': case 'image': case 'imagesearch': case 'poll': case 'vote': case 'roll': case 'say': case 'ytsearch': case 'yt':
                if (settings.enabledModules.misc == false) {
                    return;
                }
                else if (settings.misc.limited == true) {
                    if (!settings.misc.channels.includes(obj.channelId)) {
                        return;
                    }
                }
                break;
            case 'compare': case 'firsts': case 'map': case 'm': case 'rs': case 'recent': case 'r': case 'osu': case 'profile': case 'o': case 'osuset': case 'osutop': case 'top': case 'scores': case 'c': case 'leaderboard': case 'maplb': case 'mapleaderboard': case 'lb': case 'pinned': case 'skin': case 'simplay': case 'simulate': case 'whatif':
                if (settings.enabledModules.osu == false) {
                    return;
                }
                else if (settings.osu.limited == true) {
                    if (!settings.osu.channels.includes(obj.channelId)) {
                        return;
                    }
                }
                break;
            case 'checkperms': case 'fetchperms': case 'checkpermissions': case 'permissions': case 'perms': case 'leaveguild': case 'leave': case 'servers': case 'debug': case 'voice': case 'crash': case 'log': case 'find': case 'purge':
                if (settings.enabledModules.admin == false) {
                    return;
                }
                else if (settings.admin.limited == true) {
                    if (!settings.admin.channels.includes(obj.channelId)) {
                        return;
                    }
                }
                break;
            case 'play': case 'pause': case 'np': case 'skip': case 'queue': case 'resume':
                if (settings.enabledModules.music == false) {
                    return;
                }
                else if (settings.music.limited == true) {
                    if (!settings.music.channels.includes(obj.channelId)) {
                        return;
                    }
                }
                break;
        }

        switch (command) {
            case 'play':
                {
                    let url;
                    if (args[0] && args[0].includes('youtube.com')) {
                        url = args[0];
                    } else {
                        return message.reply({ content: 'Please use a valid youtube url', allowedMentions: { repliedUser: false }, failIfNotExists: true });
                    }
                    const ytid = url.split('v=')[1];
                    await yd.download(ytid, `${ytid}`);

                    yd.on('finished', (err, data) => {
                        if (err) {
                            console.log('fin error\n');
                            console.log(err);
                        } else {
                            console.log(JSON.stringify(data, null, 2));
                        }
                    })
                    yd.on('error', (error) => {
                        if (error) {
                            console.log('error\n');
                            console.log(error);
                        }
                    })
                    yd.on('progress', (progress) => {
                        console.log(JSON.stringify(progress, null, 2));
                    })
                    songqueue.push(`./files/music/${ytid}.mp3`);
                }
                break;
            case 'np':
                break;
            case 'stop':
                player.stop();
                break;
            case 'pause':
                break;
            case 'resume':
                break;
            case 'skip':
                break;
            case 'sfx':
                break;
            case 'queue':
                break;
        }
        player.play(discvoice.createAudioResource(songqueue[0]));

        //get the song length of songqueue[0]

        //let songlength = await mp3length(fs.readFileSync(songqueue[0]));

        //console.log(songlength)

        /*         setInterval(() => {
                    player.play(discvoice.createAudioResource(songqueue[0]));
        
                }, ) */
    })
}