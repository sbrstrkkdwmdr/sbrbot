import fs = require('fs');
const https = require('https');
import tesseract = require('tesseract.js');

module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    client.on('messageCreate', async (message) => {
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let absoluteID = currentDate.getTime();
        let interaction = null
        let button = null
        let args = null
        let obj = message
        let parse = null

        const worker = tesseract.createWorker({
            logger: m => {
                fs.appendFileSync(`logs/gen/imagerender${obj.guildId}.log`,
                    `
================================
${currentDateISO}
ID: ${absoluteID}
workerID: ${m.workerId}
jobID: ${m.jobId}
userjobID: ${m.userJobId}
status: ${m.status ? m.status : 'none/completed'}
progress: ${m.progress ? m.progress : 'none'}
================================
`
                )
            }
        });
        //if message attachments size > 0
        if (message.attachments.size > 0) {
            if (message.attachments.first().url.includes('.png') || message.attachments.first().url.includes('.jpg')) {
                await (async () => {
                    await worker.load();
                    await worker.loadLanguage('eng');
                    await worker.initialize('eng');
                    const { data: { text } } = await worker.recognize(message.attachments.first().url);
                    if (text.includes('Beatmap by')) {
                        let txttitle = text.split('\n')[0]
                        let txtcreator = text.split('Beatmap by ')[1].split('\n')[0]

                        parse = `${txttitle}//${txtcreator}`

                    }
                    if (text.includes('Mapped by')){
                        let txttitle = text.split('\n')[0]
                        let txtcreator = text.split('Mapped by ')[1].split('\n')[0]

                        parse = `${txttitle}//${txtcreator}`
                    }
                })();
            }
        } if (message.content.includes('.png') || message.content.includes('.jpg')) {
            await (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(message.content);
                if (text.includes('Beatmap by')) {
                    let txttitle = text.split('\n')[0]
                    let txtcreator = text.split('Beatmap by ')[1].split('\n')[0]

                    parse = `${txttitle}//${txtcreator}`
                }
            })();
        }
        let messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')
        if (messagenohttp.startsWith('osu.ppy.sh/b/') || messagenohttp.startsWith('osu.ppy.sh/beatmaps/') || messagenohttp.startsWith('osu.ppy.sh/beatmapsets/') || messagenohttp.startsWith('osu.ppy.sh/s/') || parse != null) {
            client.links.get('osumaplink').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, parse, worker);
        }
        if (messagenohttp.startsWith('osu.ppy.sh/u/') || messagenohttp.startsWith('osu.ppy.sh/users/')) {
            client.links.get('osuuserlink').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
        }

        if (message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.osr'))) {
            let attachosr = message.attachments.first().url
            let osrdlfile = fs.createWriteStream('./files/replay.osr')
            let requestw = https.get(`${attachosr}`, function (response) {
                response.pipe(osrdlfile);
            });
            setTimeout(() => {
                client.links.get('replayparse').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
            }, 1500)
        }
        if (messagenohttp.startsWith('osu.ppy.sh/scores/')) {
            client.links.get('scoreparse').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
        }
    })
}