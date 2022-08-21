import * as fs from 'fs';
import fetch from 'node-fetch';
const config = require('../configs/config.json')
let accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
let access_token
try {
    access_token = JSON.parse(accessN).access_token;
} catch (error) {
    access_token = ''
}
/**
 * 
 * @param {number} userid 
 * @returns boolean
 * @info checks whether or not the user is an owner
 */
function isOwner(userid: number) {
    for (let i = 0; i < config.ownerusers.length; i++) {
        if (config.ownerusers[i] == userid) {
            return true
        }
    }
    return false
}

/**
 * @param userid user ID
 * @param guildid ID of the current guild
 * @param client client object
 * @returns true if user is admin in the current guild
 */
function isAdmin(userid: number, guildid: number, client: any) {
    if (client.guilds.cache.has(guildid)) {
        let curguild = client.guilds.cache.get(guildid)
        let curmem = curguild.members.cache.has(userid) ? curguild.members.cache.get(userid) : null
        if (curmem != null) {
            return true;
        }
    }
    return false;
}
/**
 * 
 * @param {string} cmd 
 * @param {*} handler 
 * @returns exec('console input')
 * @info use it to put input into the console
 */
function exec(cmd: string, handler = function (error, stdout, stderr) { console.log(stdout); if (error !== null) { console.log(stderr) } }) {
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
        newtxt = txt.substring(0, 64) + '...'
    } else {
        newtxt = txt
    }

    return newtxt;
}
/**
 * 
 * @param {string} txt 
 * @returns shorten to under 150 characters
 */
function lengthshorten(txt: string) {
    let newtxt: string;
    if (txt.length > 150) {
        newtxt = txt.substring(0, 149) + '...'
    } else {
        newtxt = txt
    }

    return newtxt;
}
/**
 * 
 * @param {string} txt 
 * @returns shortened string to under 4000 characters to avoid discord message errors
 */
function discshort(txt: string) {
    let newtxt: string;
    if (txt.length > 4000) {
        newtxt = txt.substring(0, 3999)
    } else {
        newtxt = txt
    }

    return newtxt
}
//file extensions for videos
let vidfiletypes: string[] = [
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
]

//file types of images
let imgfiletype: string[] = [
    'apng',
    'gif',
    'jpeg',
    'jpg',
    'pdn',
    'png'
]

let audiofiletype: string[] = [
    'aac',
    'flac',
    'mp3',
    'ogg',
    'wav'
]

/**
 * 
 * @param {string} filename the name of the file as a discord attachment (including extension)
 * @returns whether or not a file is a video
 */
function checkisvideo(filename: any) {
    for (let i = 0; i < vidfiletypes.length; i++) {
        if (filename.url.indexOf(vidfiletypes[i], filename.url.length - vidfiletypes.length) !== -1) {
            return true;
        };

    }

    return false;
}
/**
 * 
 * @param {string} filename the name of the file as a discord attachment (including extension) 
 * @returns whether or not a file is a video
 */
function checkisimage(filename: any) {
    for (let i = 0; i < imgfiletype.length; i++) {
        if (filename.url.indexOf(imgfiletype[i], filename.url.length - imgfiletype.length) !== -1) {
            return true;
        };

    }

    return false;
}
/**
 * 
 * @param {string} filename the name of the file as a discord attachement (including extension)
 * @returns whether or not a file is a video
 */
function checkisaudio(filename: any) {
    for (let i = 0; i < audiofiletype.length; i++) {
        if (filename.url.indexOf(audiofiletype[i], filename.url.length - audiofiletype.length) !== -1) {
            return true;
        };

    }

    return false;
}
/**
 * 
 * @param {int} userid 
 * @returns check if user is banned from sending videos
 */
function checkisfileblocked(userid: number) {
    for (let i = 0; i < config.fileblockedusers.length; i++) {
        if (config.fileblockedusers[i] == userid) {
            return true
        }
    }
    return false
}
/**
 * 
 * @param {string} str string to check for
 * @param {string} pat part of string to check for
 * @param {number} n the nth time to check for as in 2 = second time it appears
 * @returns the index of the nth time a substring appears in a string
 */
function nthIndex(str: string, pat: string, n: number) {
    var L = str.length, i = -1;
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
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.lastIndexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}
/**
 * 
 * @param userid the user id to check for
 * @param type best/firsts/pinned/recent
 * @returns the users top plays 
 */
function trackScore(userid: number, type: string) {
    fetch(`https://osu.ppy/api/v2/users/${userid}/scores/${type}?`,
        {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)
        .then(json => {
            return json;
        })
}

/**
 * 
 * @param str input string
 * @returns a string with special characters converted to versions that won't break URLs
 */
function toHexadecimal(str: string | number) {
    let newstr: string;
    newstr = str.toString()
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


        .replace(/([^A-Za-z0-9 %])/g, '')

    return newstr;
}

/**
 * 
 * @param str input string
 * @returns non alpha numeric characters removed
 */
function toAlphaNum(str: string | number) {
    let newstr: string;
    newstr = str.toString().replace(/([^A-Za-z 0-9])/g, '')
    return newstr;
}

function toMath(str: string) {
    let newstr: string;
    newstr = str.toString().replace(/([^0-9pi^+-/*])/g, '')
    return newstr;
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
    checkisfileblocked,
    checkisaudio,
    checkisimage,
    checkisvideo,
    discshort,
    exec,
    imgfiletype,
    isAdmin,
    isOwner,
    lengthshorten,
    shorten,
    vidfiletypes,
    nthIndex,
    nthIndexLast,
    trackScore,
    toHexadecimal,
    toAlphaNum,
    toMath
}