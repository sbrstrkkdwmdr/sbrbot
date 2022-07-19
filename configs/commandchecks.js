const fs = require('fs')
const config = require('./config.json')

/**
 * 
 * @param {integer} userid 
 * @returns boolean
 * @info checks whether or not the user is an owner
 */
function isOwner(userid) {
    for (let i = 0; i < config.ownerusers.length; i++) {
        if (config.ownerusers[i] == userid) {
            return true
        }
    }
    return false
}

/**
 * 
 * @param {string} cmd 
 * @param {*} handler 
 * @returns exec('console input')
 * @info use it to put input into the console
 */
function exec(cmd, handler = function (error, stdout, stderr) { console.log(stdout); if (error !== null) { console.log(stderr) } }) {
    const childfork = require('child_process');
    return childfork.exec(cmd, handler);
}
/**
 * 
 * @param {string} txt 
 * @returns shortens to under 65 characters
 */
function shorten(txt) {
    let newtxt;
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
function lengthshorten(txt) {
    let newtxt;
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
function discshort(txt) {
    let newtxt;
    if (txt.length > 4000) {
        newtxt = txt.substring(0, 3999)
    } else {
        newtxt = txt
    }

    return newtxt
}
//file extensions for videos
let vidfiletypes = [
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
let imgfiletype = [
    'apng',
    'gif',
    'jpeg',
    'jpg',
    'pdn',
    'png'
]

let audiofiletype = [
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
function checkisvideo(filename) {
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
function checkisimage(filename) {
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
function checkisaudio(filename) {
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
function checkisfileblocked(userid) {
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
function nthIndex(str, pat, n) {
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
function nthIndexLast(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.lastIndexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

module.exports = {
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
} 