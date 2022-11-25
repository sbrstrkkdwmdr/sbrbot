import fs = require('fs');
const https = require('https');
import tesseract = require('tesseract.js');
import extypes = require('./src/types/extratypes');
import defaults = require('./src/consts/defaults');
import Discord = require('discord.js');
import func = require('./src/tools');

import commands = require('./commands/cmdGeneral');
import osucmds = require('./commands/cmdosu');
import admincmds = require('./commands/cmdAdmin');
import misccmds = require('./commands/cmdMisc');
import checkcmds = require('./commands/cmdChecks');

module.exports = (userdata, client: Discord.Client, config: extypes.config, oncooldown, guildSettings) => {
    let imgParseCooldown = false;
    const graphChannel = client.channels.cache.get(config.graphChannelId) as Discord.TextChannel;

    client.on('messageCreate', async (message) => {
        const currentDate = new Date();
        const interaction = null;
        const button = null;
        const args = [];
        const obj = message;
        let parse = null;
        const commandType: extypes.commandType = 'link';
        if (!(message.content.startsWith('http') || message.content.includes('osu.') || message.attachments.size > 0)) {
            return;
        }
        const overrides = {
            user: null,
            page: null,
            mode: null,
            sort: null,
            reverse: null,
            ex: null,
            commandAs: commandType
        };
        let absoluteID = func.generateId();

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
                });
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

            //if message attachments size > 0
            if (imgParseCooldown == false) {

                if (message.attachments.size > 0) {
                    if (message.attachments.first().url.includes('.png') || message.attachments.first().url.includes('.jpg')) {
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
                                );
                            }
                        });
                        imgParseCooldown = true;
                        await (async () => {
                            await worker.load();
                            await worker.loadLanguage('eng');
                            await worker.initialize('eng');
                            const { data: { text } } = await worker.recognize(message.attachments.first().url);
                            if (text.includes('Beatmap by')) {
                                const txttitle = text.split('\n')[0];
                                const txtcreator = text.split('Beatmap by ')[1].split('\n')[0];

                                parse = `${txttitle} ${txtcreator}`;

                            }
                            if (text.includes('Mapped by')) {
                                const txttitle = text.split('\n')[0];
                                const txtcreator = text.split('Mapped by ')[1].split('\n')[0];

                                parse = `${txttitle} ${txtcreator}`;
                            }
                        })();
                    }
                }
            }
            if (imgParseCooldown == true) {
                setTimeout(() => {
                    imgParseCooldown = false;
                }, 5000);
            }
        }

        if (parse) {
            args.push('query', parse);
        }

        const messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '');

        if (messagenohttp.startsWith('osu.ppy.sh/b/') || messagenohttp.startsWith('osu.ppy.sh/beatmaps/') || messagenohttp.startsWith('osu.ppy.sh/beatmapsets') || messagenohttp.startsWith('osu.ppy.sh/s/') || parse != null) {
            overrides.ex = 'link';
            if (absoluteID == null) {
                absoluteID = func.generateId();
            }
            osucmds.map({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
        }
        if (messagenohttp.startsWith('osu.ppy.sh/u/') || messagenohttp.startsWith('osu.ppy.sh/users/')) {
            if (absoluteID == null) {
                absoluteID = func.generateId();
            }
            osucmds.osu({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
        }

        if (message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.osr'))) {
            if (settings.osuParseReplays == false) {
                return;
            }
            if (absoluteID == null) {
                absoluteID = func.generateId();
            }
            const attachosr = message.attachments.first().url;
            const osrdlfile = fs.createWriteStream('./files/replay.osr');
            https.get(`${attachosr}`, function (response) {
                response.pipe(osrdlfile);
            });//
            setTimeout(() => {
                osucmds.replayparse({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
            }, 1500);
        }
        if (messagenohttp.startsWith('osu.ppy.sh/scores/')) {
            osucmds.scoreparse({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
        }
        if (message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.osu'))) {
            return;
            if (absoluteID == null) {
                absoluteID = func.generateId();
            }
            const attachosu = message.attachments.first().url;
            const osudlfile = fs.createWriteStream('./files/tempdiff.osu');
            https.get(`${attachosu}`, function (response) {
                response.pipe(osudlfile);
            });
            setTimeout(() => {
                osucmds.maplocal({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
            }, 1500);
        }

    });
};