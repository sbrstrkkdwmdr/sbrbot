import fs = require('fs');
const https = require('https');
import tesseract = require('tesseract.js');
import extypes = require('./configs/extratypes');
import Discord = require('discord.js');

module.exports = (userdata, client, osuApiKey, osuClientID, osuClientSecret, config) => {
    let imgParseCooldown = false

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();
        const currentDateISO = new Date().toISOString();
        const absoluteID = currentDate.getTime();
        const interaction = null
        const button = null
        let args = null
        const obj = message
        let parse = null


        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        try {
            const settingsfile = fs.readFileSync(`./configs/guilds/${currentGuildId}.json`, 'utf-8')
            settings = JSON.parse(settingsfile)
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

        if (config.useScreenshotParse == true && settings.osu.parseScreenshots == true) {
            //warning: uses a lot of memory

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
        if (messagenohttp.startsWith(x =>
            'osu.ppy.sh/b/' || 'osu.ppy.sh/beatmaps/' || 'osu.ppy.sh/beatmapsets/' || 'osu.ppy.sh/s/'
            || 'osu.ppy.sh/u/' || 'osu.ppy.sh/users/'
        )) {
            if (settings.enabledModules.osu == false || settings.osu.parseLinks == false) {
                return;
            } else if (settings.osu.limited == true) {
                if (!settings.osu.channels.includes(obj.channelId)) {
                    return;
                }
            } else {

            }
        }
        if (messagenohttp.startsWith('osu.ppy.sh/b/') || messagenohttp.startsWith('osu.ppy.sh/beatmaps/') || messagenohttp.startsWith('osu.ppy.sh/beatmapsets/') || messagenohttp.startsWith('osu.ppy.sh/s/') || parse != null) {
            const overrideID = null
            client.links.get('osumaplink').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, parse, overrideID);
        }
        if (messagenohttp.startsWith('osu.ppy.sh/u/') || messagenohttp.startsWith('osu.ppy.sh/users/')) {
            const user = messagenohttp.split('/')[2]
            args = [user]
            client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
            //client.links.get('osuuserlink').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
        }

        if (message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.osr'))) {
            if (settings.enabledModules.osu == false || settings.osu.parseReplays == false) {
                return;
            }
            else if (settings.osu.limited == true) {
                if (!settings.osu.channels.includes(obj.channelId)) {
                    return;
                }
            } else {

            }
            const attachosr = message.attachments.first().url
            const osrdlfile = fs.createWriteStream('./files/replay.osr')
            https.get(`${attachosr}`, function (response) {
                response.pipe(osrdlfile);
            });
            setTimeout(() => {
                client.links.get('replayparse').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
            }, 1500)
        }
        if (messagenohttp.startsWith('osu.ppy.sh/scores/')) {
            client.links.get('scoreparse').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
        }
        if (message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.osu'))) {
            const attachosu = message.attachments.first().url
            const osudlfile = fs.createWriteStream('./files/tempdiff.osu')
            https.get(`${attachosu}`, function (response) {
                response.pipe(osudlfile);
            });
            setTimeout(() => {
                client.links.get('localmapparse').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj);
            }, 1500)
        }
    })
}