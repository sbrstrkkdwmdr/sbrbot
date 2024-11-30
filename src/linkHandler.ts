import * as Discord from 'discord.js';
import fs from 'fs';
import https from 'https';
import * as helper from './helper.js';
import * as bottypes from './types/bot.js';
import * as tooltypes from './types/tools.js';

let command: bottypes.command;
const overrides: bottypes.overrides = {

};
let id:number;
export async function onMessage(message: Discord.Message) {
    if (!(message.content.startsWith('http') || message.content.includes('osu.') || message.attachments.size > 0)) {
        return;
    }
    let canReply = true;
    if (!helper.tools.checks.botHasPerms(message, ['ReadMessageHistory'])) {
        canReply = false;
    }


    let settings: tooltypes.guildSettings;
    try {
        const curGuildSettings = await helper.vars.guildSettings.findOne({ where: { guildid: message.guildId } });
        settings = curGuildSettings.dataValues;
    } catch (error) {
        try {
            await helper.vars.guildSettings.create({
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

    const messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '');
    if (messagenohttp.startsWith('osu.ppy.sh/b/') || messagenohttp.startsWith('osu.ppy.sh/beatmaps/') || messagenohttp.startsWith('osu.ppy.sh/beatmapsets/') || messagenohttp.startsWith('osu.ppy.sh/s/')) {
        id = helper.tools.commands.getCmdId();
        command = helper.commands.osu.maps.map;
        runCommand(message);
        return;
    }
    if (messagenohttp.startsWith('osu.ppy.sh/u/') || messagenohttp.startsWith('osu.ppy.sh/users/')) {
        command = helper.commands.osu.profiles.osu;
        id = helper.tools.commands.getCmdId();
        runCommand(message);
        return;
    }
    if (message.attachments.size > 0 && message.attachments.every(attachment => helper.tools.formatter.removeURLparams(attachment.url).endsWith('.osr'))) {
        if (settings.osuParseReplays == false) {
            return;
        }
        const attachosr = message.attachments.first().url;
        id = helper.tools.commands.getCmdId();
        const osrdlfile = fs.createWriteStream(`${helper.vars.path.files}/replays/${id}.osr`);
        https.get(`${attachosr}`, function (response) {
            response.pipe(osrdlfile);
        });
        setTimeout(() => {
            command = helper.commands.osu.scores.replayparse;
            runCommand(message);
        }, 1500);
    }
    if (messagenohttp.startsWith('osu.ppy.sh/scores/')) {
        id = helper.tools.commands.getCmdId();
        command = helper.commands.osu.scores.scoreparse;
        runCommand(message);
    }
    // if (message.attachments.size > 0 && message.attachments.every(attachment => func.removeURLparams(attachment.url).endsWith('.osu'))) {
    //     const attachosu = message.attachments.first().url;
    //     const osudlfile = fs.createWriteStream(`${helper.vars.path.files}/localmaps/${id}.osu`);
    //     https.get(`${attachosu}`, function (response) {
    //         response.pipe(osudlfile);
    //     });
    //     setTimeout(() => {
    //         // command = helper.commands.osu.maps.maplocal;
    //         // runCommand(message);
    //     }, 1500);
    // }
}

function runCommand(message: Discord.Message,) {
    command({
        message,
        interaction: null,
        args: [],
        date: new Date(),
        id,
        overrides,
        canReply: true,
        type: "link",
    });
}