import fs = require('fs');
const https = require('https');
import tesseract = require('tesseract.js');
import extypes = require('./src/types/extratypes');
import defaults = require('./src/consts/defaults');
import Discord = require('discord.js');

module.exports = (userdata, client, commandStruct, config, oncooldown, guildSettings) => {
    let imgParseCooldown = false;

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();
        const absoluteID = currentDate.getTime();
        const interaction = null
        const button = null
        let args = null
        const obj = message
        let parse = null
        const commandType = 'link'
        if(!(message.content.startsWith('http') || message.content.includes('osu.') || message.attachments.size > 0)){
            return;
        }

        let overrides = {
            user: null,
            page: null,
            mode: null,
            sort: null,
            reverse: null,
            ex: null,
        }

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const curGuildSettings = await guildSettings.findOne({ where: { guildid: message.guildId } });
            settings = curGuildSettings.dataValues;
        } catch (error) {
            try {
                await guildSettings.create({
                    guildid: message.guildId,
                    guildname: message?.guild?.name ?? 'Unknown',
                    prefix: 'sbr-',
                    osuParseLinks: true,
                    osuParseScreenshots: true,
                    osuParseReplays: true,
                })
            } catch (error) {

            }
            settings = {
                guildid: message.guildId,
                guildname: message?.guild?.name ?? 'Unknown',
                prefix: 'sbr-',
                osuParseLinks: true,
                osuParseScreenshots: true,
                osuParseReplays: true,
            };
        }
        if (config.useScreenshotParse == true && settings.osuParseScreenshots == true) {
            //warning: uses a lot of memory

            const worker = tesseract.createWorker({
                logger: m => {
                    fs.appendFileSync(`logs/gen/imagerender${obj.guildId}.log`,
                        `
================================
${currentDate.toISOString()}
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
            if (imgParseCooldown == false) {
                if (message.attachments.size > 0) {
                    if (message.attachments.first().url.includes('.png') || message.attachments.first().url.includes('.jpg')) {
                        imgParseCooldown = true
                        await (async () => {
                            await worker.load();
                            await worker.loadLanguage('eng');
                            await worker.initialize('eng');
                            const { data: { text } } = await worker.recognize(message.attachments.first().url);
                            if (text.includes('Beatmap by')) {
                                const txttitle = text.split('\n')[0]
                                const txtcreator = text.split('Beatmap by ')[1].split('\n')[0]

                                parse = `${txttitle}//${txtcreator}`

                            }
                            if (text.includes('Mapped by')) {
                                const txttitle = text.split('\n')[0]
                                const txtcreator = text.split('Mapped by ')[1].split('\n')[0]

                                parse = `${txttitle}//${txtcreator}`
                            }
                        })();
                    }
                } if (message.content.includes('.png') || message.content.includes('.jpg')) {
                    imgParseCooldown = true
                    await (async () => {
                        await worker.load();
                        await worker.loadLanguage('eng');
                        await worker.initialize('eng');
                        const { data: { text } } = await worker.recognize(message.content);
                        if (text.includes('Beatmap by')) {
                            const txttitle = text.split('\n')[0]
                            const txtcreator = text.split('Beatmap by ')[1].split('\n')[0]

                            parse = `${txttitle}//${txtcreator}`
                        }
                    })();
                }
            }
            if (imgParseCooldown == true) {
                setTimeout(() => {
                    imgParseCooldown = false
                }, 5000);
            }
        }

        const messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')

        if (messagenohttp.startsWith('osu.ppy.sh/b/') || messagenohttp.startsWith('osu.ppy.sh/beatmaps/') || messagenohttp.startsWith('osu.ppy.sh/beatmapsets/') || messagenohttp.startsWith('osu.ppy.sh/s/') || parse != null) {
            overrides.ex = 'link'
            commandStruct.osucmds.get('map').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides);
        }
        if (messagenohttp.startsWith('osu.ppy.sh/u/') || messagenohttp.startsWith('osu.ppy.sh/users/')) {
            overrides.user = messagenohttp.split('/')[2]
            commandStruct.osucmds.get('osu').execute(commandType, obj, button, config, client, absoluteID, currentDate, overrides);
        }

        if (message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.osr'))) {
            if (settings.osuParseReplays == false) {
                return;
            }
            const attachosr = message.attachments.first().url
            const osrdlfile = fs.createWriteStream('./files/replay.osr')
            https.get(`${attachosr}`, function (response) {
                response.pipe(osrdlfile);
            });
            setTimeout(() => {
                commandStruct.links.get('replayparse').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides);
            }, 1500)
        }
        if (messagenohttp.startsWith('osu.ppy.sh/scores/')) {
            commandStruct.osucmds.get('scoreparse').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides);
        }
        if (message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.osu'))) {
            const attachosu = message.attachments.first().url
            const osudlfile = fs.createWriteStream('./files/tempdiff.osu')
            https.get(`${attachosu}`, function (response) {
                response.pipe(osudlfile);
            });
            setTimeout(() => {
                commandStruct.links.get('localmapparse').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides);
            }, 1500)
        }

    });
}