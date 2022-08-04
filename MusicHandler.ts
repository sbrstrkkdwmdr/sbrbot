import discvoice = require('@discordjs/voice');
import ytaudio = require('youtube-mp3-downloader');
import mp3length = require('get-mp3-duration');
import fs = require('fs');

module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {

    const player = discvoice.createAudioPlayer({
        behaviors: {
            noSubscriber: discvoice.NoSubscriberBehavior.Pause,
        }
    })

    let songqueue = [];

    let yd = new ytaudio({
        "ffmpegPath": ".\\files\\ffmpegbin",
        "outputPath": ".\\files\\music",
        "youtubeVideoQuality": "highestaudio",
        "queueParallelism": 2,
        "progressTimeout": 2000,
        "allowWebm": false
    })

    client.on('messageCreate', async (message) => {

        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let absoluteID = currentDate.getTime();


        const args = message.content.slice(config.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!message.content.startsWith(config.prefix)) return; //the return is so if its just prefix nothing happens

        if (message.author.bot && message.author.id != '755220989494951997') return;

        let interaction = null;
        switch (command) {
            case 'play':
                let url;
                if (args[0] && args[0].includes('youtube.com')) {
                    url = args[0];
                } else {
                    return message.reply({ content: 'Please use a valid youtube url', allowedMentions: { repliedUser: false }, failIfNotExists: true });
                }
                let ytid = url.split('v=')[1];
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