import * as bottypes from '../types/bot.js';

export const defaultGuildSettings = {
    guildid: null,
    guildname: 'null',
    prefix: 'sbr-',
    osuParseLinks: true,
    osuParseScreenshots: true,
    osuParseReplays: true,
};

export const images = {
    user: {
        name: 'user',
        url: 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png',
    },
    any: {
        name: 'any',
        url: 'https://cdn.discordapp.com/attachments/762455063922737174/1022133648578854912/blank.png',
    }
};

export const invisbleChar = '⠀';
