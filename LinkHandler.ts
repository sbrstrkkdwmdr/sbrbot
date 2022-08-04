import fs = require('fs');
const https = require('https')
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    client.on('messageCreate', async (message) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let absoluteID = currentDate.getTime();


        let messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')
        if (messagenohttp.startsWith('osu.ppy.sh/b/') || messagenohttp.startsWith('osu.ppy.sh/beatmaps/') || messagenohttp.startsWith('osu.ppy.sh/beatmapsets/') || messagenohttp.startsWith('osu.ppy.sh/s/')) {
            client.links.get('osumaplink').execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO);
        }
        if (messagenohttp.startsWith('osu.ppy.sh/u/') || messagenohttp.startsWith('osu.ppy.sh/users/')) {
            client.links.get('osuuserlink').execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO);
        }

        if (message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.osr'))) {
            let attachosr = message.attachments.first().url
            let osrdlfile = fs.createWriteStream('./files/replay.osr')
            let requestw = https.get(`${attachosr}`, function (response) {
                response.pipe(osrdlfile);

                //console.log('success')
            });
            setTimeout(() => {
                client.links.get('replayparse').execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO);
            }, 1500)
        }
        if (messagenohttp.startsWith('osu.ppy.sh/scores/')) {
            client.links.get('scoreparse').execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO);
        }
    })
}