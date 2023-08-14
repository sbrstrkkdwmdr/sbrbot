import * as fs from 'fs';
import fetch from 'node-fetch';
// const config = JSON.parse(fs.readFileSync('../config/config.json', 'utf-8'));
import * as extypes from './types/extratypes.js';
import Discord = require('discord.js');

export function checkConfig(config: object): extypes.config {
    console.log(`
====================================================
CHECKING CONFIG FOR ANY ERRORS
----------------------------------------------------
`);
    if (config.hasOwnProperty("important")) {
        if (!config["important"].hasOwnProperty("token") && typeof config["important"]["token"] != "string") {
            console.log("Property `token` is invalid or an incorrect type");
            console.log("The bot cannot run without this property");
            process.exit(0);
        }
        if (!config["important"].hasOwnProperty("dbd_license") && typeof config["important"]["dbd_license"] != "string") {
            console.log("Property `important.dbd_license` is invalid or an incorrect type");
            console.log("The default value of `null` will be used as a placeholder");
            config["important"]["dbd_license"] = null;
        }
        if (!config["important"].hasOwnProperty("redirect_uri") && typeof config["redirect_uri"] != "string") {
            console.log("Property `important.redirect_uri` is invalid or an incorrect type");
            console.log("The default redirect_uri of `null` will be used as a placeholder");
            config["important"]["dbd_license"] = null;
        }
        if (!config["important"].hasOwnProperty("client_secret") && typeof config["important"]["client_secret"] != "string") {
            console.log("Property `important.client_secret` is invalid or an incorrect type");
            console.log("The default value of `null` will be used as a placeholder");
            config["important"]["client_secret"] = null;
        }
        if (!config["important"].hasOwnProperty("client_id") && typeof config["important"]["client_id"] != "string") {
            console.log("Property `important.client_id` is invalid or an incorrect type");
            console.log("The default value of `null` will be used as a placeholder");
            config["important"]["client_id"] = null;
        }
    } else {
        console.log("Property `important` is missing");
        console.log("The bot cannot run without this property");
        process.exit(0);
    }
    if (!config.hasOwnProperty("prefix") && typeof config["prefix"] != "string") {
        console.log("Property `prefix` is invalid or an incorrect type");
        console.log("The default value of `sbr-` will be used as a placeholder");
        config["prefix"] = "sbr-";
    }
    if (!config.hasOwnProperty("osuClientID") && typeof config["osuClientID"] != "string") {
        console.log("Property `osuClientID` is invalid or an incorrect type");
        console.log("osu! commands will not work until this property is added/fixed");
        config["osuClientID"] = "null";
    }
    if (!config.hasOwnProperty("osuClientSecret") && typeof config["osuClientSecret"] != "string") {
        console.log("Property `osuClientSecret` is invalid or an incorrect type");
        console.log("osu! commands will not work until this property is added/fixed");
        console.log("The default value of `null` will be used as a placeholder");
        config["osuClientSecret"] = "";
    }
    if (!config.hasOwnProperty("osuApiKey") && typeof config["osuApiKey"] != "string") {
        console.log("Property `osuApiKey` is invalid or an incorrect type");
        console.log("map leaderboards will not work until this property is added/fixed");
        console.log("The default value of `null` will be used as a placeholder");
        config["osuApiKey"] = "";
    }
    if (config.hasOwnProperty("ownerusers")) {
        let tempIsArr = false;
        let smthWrong: boolean = false;
        if (Array.isArray(config["ownerusers"])) {
            tempIsArr = true;
            config["ownerusers"].forEach(x => {
                if (typeof x !== "string") { smthWrong = true; };
            });
        }
        if (tempIsArr === false && smthWrong) {
            console.log("Property `ownerusers` is invalid or an incorrect type");
            console.log("Some admin related commands will not work with this property");
            console.log("The default value of `[]` will be used as a placeholder");
            config["ownerusers"] = [];
        }
    } else {
        console.log("Property `ownerusers` is missing");
        console.log("Some admin related commands will not work with this property");
        console.log("The default value of `[]` will be used as a placeholder");
        config["ownerusers"] = [];
    }
    if (!config.hasOwnProperty("google") && typeof config["google"] != "string") {
        if (!config["google"].hasOwnProperty("apiKey") && typeof config["google"]["apiKey"] != "string") {
            console.log("Property `google.apiKey` is invalid or an incorrect type");
            console.log("image search commands will not work until this property is added/fixed");
            config["google"]["apiKey"] = "null";
        }
        if (!config["google"].hasOwnProperty("engineId") && typeof config["google"]["engineId"] != "string") {
            console.log("Property `google.engineId` is invalid or an incorrect type");
            console.log("image search commands will not work until this property is added/fixed");
            config["google"]["engineId"] = "null";
        }
    } else {
        console.log("Property `google` is missing");
        console.log("image search commands will not work until this property is added/fixed");
        config["google"] = {};
        config["google"]["apiKey"] = "null";
        config["google"]["engineId"] = "null";

    }
    if (!config.hasOwnProperty("useScreenshotParse") && typeof config["useScreenshotParse"] != "boolean") {
        console.log("Property `useScreenshotParse` is invalid or an incorrect type");
        console.log("The default value of `false` will be used as a placeholder");
        config["useScreenshotParse"] = false;
    }
    if (!config.hasOwnProperty("LogApiCalls") && typeof config["LogApiCalls"] != "boolean") {
        console.log("Property `LogApiCalls` is invalid or an incorrect type");
        console.log("The default value of `true` will be used as a placeholder");
        config["LogApiCalls"] = true;
    }
    if (!config.hasOwnProperty("LogApiCallsToFile") && typeof config["LogApiCallsToFile"] != "boolean") {
        console.log("Property `LogApiCallsToFile` is invalid or an incorrect type");
        console.log("The default value of `false` will be used as a placeholder");
        config["LogApiCallsToFile"] = false;
    }
    if (!config.hasOwnProperty("enableTracking") && typeof config["enableTracking"] != "boolean") {
        console.log("Property `enableTracking` is invalid or an incorrect type");
        console.log("The default value of `false` will be used as a placeholder");
        config["enableTracking"] = false;
    }
    if (!config.hasOwnProperty("storeCommandLogs") && typeof config["storeCommandLogs"] != "boolean") {
        console.log("Property `storeCommandLogs` is invalid or an incorrect type");
        console.log("The default value of `false` will be used as a placeholder");
        config["storeCommandLogs"] = false;
    }
    console.log(`
----------------------------------------------------
CHECKS COMPLETE
====================================================
`);
    return config as extypes.config;
};



/**
 * 
 * @param {number} userid 
 * @returns true if the user is an owner
 */
function isOwner(userid: string | number, config: extypes.config) {
    for (let i = 0; i < config.ownerusers.length; i++) {
        if (`${config.ownerusers[i]}` == `${userid}`) {
            return true;
        }
    }
    return false;
}

/**
 * @param userid user ID
 * @param guildid ID of the current guild
 * @param client client object
 * @returns true if user is admin in the current guild
 */
function isAdmin(userid: string | number, guildid: string | number, client: Discord.Client) {
    try {
        if (client.guilds.cache.has(`${guildid}`)) {
            const curguild = client.guilds.cache.get(`${guildid}`);
            const curmem = curguild.members.cache.has(`${userid}`) ? curguild.members.cache.get(`${userid}`) : null;
            if (curmem != null) {
                if (curmem.permissions.toArray().includes('Administrator')) {
                    return true;
                }
            }
        }
    } catch (error) {
        return false;
    }
    return false;
}

/**
 * 
 * @param object message/interaction called
 * @param client bot client
 */
function botHasPerms(object: Discord.Interaction | Discord.Message, client: Discord.Client, requiredPerms: Discord.PermissionsString[]) {
    const guild = client.guilds.cache.get(object.guildId);
    const botmember = guild.members.cache.get(client.user.id);
    const botperms = botmember.permissions.toArray();
    //if all of the elements in requiredPerms are in botperms return true
    const len = requiredPerms.length;
    let newLen = 0;
    for (const i in requiredPerms) {
        if (botperms.includes(requiredPerms[i])) {
            newLen++;
        }
    }
    const channel = client.channels.cache.get(object.channelId) as Discord.TextChannel | Discord.ThreadChannel;
    const botchannelperms = channel.permissionsFor(client.user.id).toArray();
    let channelPermLen = 0;
    for (const i in requiredPerms) {
        if (botchannelperms.includes(requiredPerms[i])) {
            channelPermLen++;
        }
    }

    return newLen == len && channelPermLen == len ? true : false;
}

/**
 * 
 * @param mentions mentions cache
 * @param type user/channel/role
 * @returns ID of first mention
 */
function getMentionId(mentions, type: 'user' | 'channel' | 'role') {
    let x = null;
    switch (type) {
        case 'user': {
            x = mentions.users.cache.first().id;
        }
            break;
        case 'channel': {
            x = mentions.channels.cache.first().id;
        }
            break;
        case 'role': {
            x = mentions.roles.cache.first().id;
        }
            break;
    }
    return x;
}

/**
 * 
 * @param {string} cmd 
 * @param {*} handler 
 * @returns exec('console input')
 * @info use it to put input into the console
 */
function exec(cmd: string, handler = function (error, stdout, stderr) { console.log(stdout); if (error !== null) { console.log(stderr); } }) {
    const childfork = require('child_process');
    return childfork.exec(cmd, handler);
}
/**
 * 
 * @param {string} txt 
 * @returns shortens to under 65 characters
 */
function shorten(txt: string) {
    let newtxt: string;
    if (txt.length > 65) {
        newtxt = txt.substring(0, 64) + '...';
    } else {
        newtxt = txt;
    }

    return newtxt;
}
/**
 * 
 * @param {string} txt 
 * @returns shorten to under 150 characters
 */
function lengthshorten(txt: string) {
    const newtxt = txt.length > 150 ? txt.substring(0, 149) + '...' : txt;
    return newtxt;
}
/**
 * 
 * @param {string} txt 
 * @returns shortened string to under 4000 characters to avoid discord message errors
 */
function discshort(txt: string) {
    const newtxt = txt.length > 4000 ? txt.substring(0, 3999) : txt;
    return newtxt;
}
//file extensions for videos
const vidfiletypes: string[] = [
    "3g2",
    "3gp",
    "amv",
    "asf",
    "avi",
    "drc",
    "f4a",
    "f4b",
    "f4p",
    "f4v",
    "flv",
    "gif",
    "gifv",
    "M2TS",
    "m2v",
    "m4p",
    "m4v",
    "mkv",
    "mng",
    "mov",
    "mp2",
    "mp4",
    "mpe",
    "mpeg",
    "mpg",
    "mpv",
    "MTS",
    "mxf",
    "nsv",
    "ogg",
    "ogv",
    "qv",
    "rm",
    "rmvb",
    "roq",
    "svi",
    "TS",
    "viv",
    "vob",
    "webm",
    "wmv",
    "yuv"
];

//file types of images
const imgfiletype: string[] = [
    'apng',
    'gif',
    'jpeg',
    'jpg',
    'pdn',
    'png'
];

const audiofiletype: string[] = [
    'aac',
    'flac',
    'mp3',
    'ogg',
    'wav'
];

/**
 * 
 * @param {string} filename the name of the file as a discord attachment (including extension)
 * @returns whether or not a file is a video
 */
function checkisvideo(filename: Discord.Attachment) {
    for (let i = 0; i < vidfiletypes.length; i++) {
        if (filename.url.indexOf(vidfiletypes[i], filename.url.length - vidfiletypes.length) !== -1) {
            return true;
        }

    }

    return false;
}
/**
 * 
 * @param {string} filename the name of the file as a discord attachment (including extension) 
 * @returns whether or not a file is a video
 */
function checkisimage(filename: Discord.Attachment) {
    for (let i = 0; i < imgfiletype.length; i++) {
        if (filename.url.indexOf(imgfiletype[i], filename.url.length - imgfiletype.length) !== -1) {
            return true;
        }

    }

    return false;
}
/**
 * 
 * @param {string} filename the name of the file as a discord attachement (including extension)
 * @returns whether or not a file is a video
 */
function checkisaudio(filename: Discord.Attachment) {
    for (let i = 0; i < audiofiletype.length; i++) {
        if (filename.url.indexOf(audiofiletype[i], filename.url.length - audiofiletype.length) !== -1) {
            return true;
        }

    }

    return false;
}
/**
 * 
 * @param {string} str string to check for
 * @param {string} pat part of string to check for
 * @param {number} n the nth time to check for as in 2 = second time it appears
 * @returns the index of the nth time a substring appears in a string
 */
function nthIndex(str: string, pat: string, n: number) {
    const L = str.length;
    let i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}// got from https://stackoverflow.com/a/14482123

/**
 * 
 * @param {string} str string to check for
 * @param {string} pat part of string to check for
 * @param {number} n the nth time to check for as in 2 = second time it appears
 * @returns the index of the nth time a substring appears in a string but from the end
 */
function nthIndexLast(str: string, pat: string, n: number) {
    const L = str.length;
    let i = -1;
    while (n-- && i++ < L) {
        i = str.lastIndexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

/**
 * 
 * @param str input string
 * @returns a string with special characters converted to versions that won't break URLs
 */
function toHexadecimal(str: string | number) {
    const newstr = `${str}`
        .replaceAll('%', '%25')
        .replaceAll('`', '%60')
        .replaceAll('~', '%7E')
        .replaceAll('!', '%21')
        .replaceAll('@', '%40')
        .replaceAll('#', '%23')
        .replaceAll('$', '%24')
        .replaceAll('^', '%5E')
        .replaceAll('&', '%26')
        .replaceAll('*', '%2A')
        .replaceAll('(', '%28')
        .replaceAll(')', '%29')
        .replaceAll('-', '%2D')
        .replaceAll('_', '%5F')
        .replaceAll('=', '%3D')
        .replaceAll('+', '%2B')
        .replaceAll('[', '%5B')
        .replaceAll(']', '%5D')
        .replaceAll('{', '%7B')
        .replaceAll('}', '%7D')
        .replaceAll('|', '%7C')
        .replaceAll('\\', '%5C')
        .replaceAll(':', '%3A')
        .replaceAll(';', '%3B')
        .replaceAll('\'', '%27')
        .replaceAll('"', '%22')
        .replaceAll(',', '%2C')
        .replaceAll('.', '%2E')
        .replaceAll('<', '%3C')
        .replaceAll('>', '%3E')
        .replaceAll('?', '%3F')
        .replaceAll('/', '%2F')
        .replaceAll(' ', '%20')
        .replace(/([^A-Za-z0-9 %])/g, '');
    return newstr;
}

/**
 * 
 * @param str input string
 * @returns non alpha numeric characters removed
 */
function toAlphaNum(str: string | number) {
    const newstr: string = str.toString().replace(/([^A-Za-z 0-9])/g, '');
    return newstr;
}

function toMath(str: string) {
    const newstr: string = str.toString().replace(/([^0-9pi^+-/*])/g, '');
    return newstr;
}

export function isNotNull(property: string) {
    //(`${user.guildstaiko}` != 'null' || `${user.guildstaiko}` != 'undefined' || user.guildstaiko != null || user.guildstaiko != undefined)
    if (`${property}`.toLowerCase() != 'null' && `${property}`.toLowerCase() != 'undefined' && property != null && property != undefined) {
        return true;
    }
    return false;
}

/* module.exports = {
    audiofiletype,
    checkisfileblocked,
    checkisaudio,
    checkisimage,
    checkisvideo,
    discshort,
    exec,
    imgfiletype,
    isOwner,
    lengthshorten,
    shorten,
    vidfiletypes,
    nthIndex,
    nthIndexLast
} */
export {
    audiofiletype,
    checkisaudio,
    checkisimage,
    checkisvideo,
    discshort,
    exec,
    imgfiletype,
    isAdmin,
    isOwner,
    botHasPerms,
    getMentionId,
    lengthshorten,
    shorten,
    vidfiletypes,
    nthIndex,
    nthIndexLast,
    toHexadecimal,
    toAlphaNum,
    toMath
};

