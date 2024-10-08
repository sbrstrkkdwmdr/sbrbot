import https from 'https';
import tesseract from 'tesseract.js';

import * as Discord from 'discord.js';
import fs from 'fs';
import { filespath, path } from './path.js';
import * as checks from './src/checks.js';
import * as func from './src/func.js';

import * as osucmds from './commands/cmdosu.js';
import * as extypes from './src/types/extratypes.js';

let imgParseCooldown = false;

export async function onMessage(
    input: extypes.input,
    message: Discord.Message
) {
    let canReply = true;
    if (!checks.botHasPerms(message, input.client, ['ReadMessageHistory'])) {
        canReply = false;
    }
    const currentDate = new Date();
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
        const curGuildSettings = await input.guildSettings.findOne({ where: { guildid: message.guildId } });
        settings = curGuildSettings.dataValues;
    } catch (error) {
        try {
            await input.guildSettings.create({
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
            osuParseScreenshots: false,
            osuParseReplays: true,
        };
    }
    //disabled for now
    if (/* false && */ input.config.useScreenshotParse == true && settings.osuParseScreenshots == true) {
        //warning: uses a lot of memory

        //if message attachments size > 0
        if (imgParseCooldown == false) {
            if (message.attachments.size > 0) {
                if (message.attachments.first().url.includes('.png') || message.attachments.first().url.includes('.jpg')) {
                    //                         const worker = tesseract.createWorker({
                    //                             logger: m => {
                    //                                 fs.appendFileSync(`${path}/logs/gen/imagerender${obj.guildId}.log`,
                    //                                     `
                    // ================================
                    // ${currentDate.toISOString()}
                    // ID: ${absoluteID}
                    // workerID: ${m.workerId}
                    // jobID: ${m.jobId}
                    // userjobID: ${m.userJobId}
                    // status: ${m.status ? m.status : 'none/completed'}
                    // progress: ${m.progress ? m.progress : 'none'}
                    // ================================
                    // `
                    //                                 );
                    //                             }
                    //                         });
                    imgParseCooldown = true;
                    await (async () => {
                        await tesseract.recognize(message.attachments.first().url, 'eng', {
                            logger: m => {
                                fs.appendFileSync(`${path}/logs/gen/imagerender${obj.guildId}.log`,
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
                        const { data: { text } } = await tesseract.recognize(message.attachments.first().url, 'eng', {
                            logger: m => {
                                fs.appendFileSync(`${path}/logs/gen/imagerender${obj.guildId}.log`,
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
    if (messagenohttp.startsWith('osu.ppy.sh/b/') || messagenohttp.startsWith('osu.ppy.sh/beatmaps/') || messagenohttp.startsWith('osu.ppy.sh/beatmapsets/') || messagenohttp.startsWith('osu.ppy.sh/s/') || parse != null) {
        overrides.ex = 'link';
        if (absoluteID == null) {
            absoluteID = func.generateId();
        }
        osucmds.map({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
    }
    if (messagenohttp.startsWith('osu.ppy.sh/u/') || messagenohttp.startsWith('osu.ppy.sh/users/')) {
        if (absoluteID == null) {
            absoluteID = func.generateId();
        }
        osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
    }
    if (message.attachments.size > 0 && message.attachments.every(attachment => func.removeURLparams(attachment.url).endsWith('.osr'))) {
        if (settings.osuParseReplays == false) {
            return;
        }
        if (absoluteID == null) {
            absoluteID = func.generateId();
        }
        const attachosr = message.attachments.first().url;
        const osrdlfile = fs.createWriteStream(`${filespath}/replays/${absoluteID}.osr`);
        https.get(`${attachosr}`, function (response) {
            response.pipe(osrdlfile);
        });
        setTimeout(() => {
            osucmds.replayparse({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, });
        }, 1500);
    }
    if (messagenohttp.startsWith('osu.ppy.sh/scores/')) {
        osucmds.scoreparse({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
    }
    if (message.attachments.size > 0 && message.attachments.every(attachment => func.removeURLparams(attachment.url).endsWith('.osu'))) {
        // return;
        if (absoluteID == null) {
            absoluteID = func.generateId();
        }
        const attachosu = message.attachments.first().url;
        const osudlfile = fs.createWriteStream(`${filespath}/localmaps/${absoluteID}.osu`);
        https.get(`${attachosu}`, function (response) {
            response.pipe(osudlfile);
        });
        setTimeout(() => {
            osucmds.maplocal({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
        }, 1500);
    }
};