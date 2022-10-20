import fs = require('fs')
// import truepath = require('../path').path
import { path } from '../path';
const truepath = `${path}`
import osuApiTypes = require('../src/types/osuApiTypes');
import calc = require('./calc');
// truepath.path

export function generateId() {
    const lid = fs.readFileSync(`id.txt`, 'utf8');
    if (+lid == null) {
        fs.writeFileSync(`id.txt`, `1`);
        return 0;
    }
    fs.writeFileSync(`id.txt`, `${+lid + 1}`);
    return +lid + 1;

}

export function readAllFiles(directory: string) {
    const filesArr = []
    const init = fs.readdirSync(directory)
    //add init to filesArr
    //add all files in subdirectories to filesArr
    for (let i = 0; i < init.length; i++) {
        if (fs.statSync(directory + '/' + init[i]).isDirectory()) {
            const sub = fs.readdirSync(directory + '/' + init[i])
            for (let j = 0; j < sub.length; j++) {
                //add sub-sub-directories to filesArr, and so on and so on
                if (fs.statSync(directory + '/' + init[i] + '/' + sub[j]).isDirectory()) {
                    const subsub = fs.readdirSync(directory + '/' + init[i] + '/' + sub[j])
                    for (let k = 0; k < subsub.length; k++) {
                        filesArr.push(init[i] + '/' + sub[j] + '/' + subsub[k])
                    }
                } else {
                    filesArr.push(init[i] + '/' + sub[j])
                }
            }
        } else {
            filesArr.push(init[i])
        }
    }
    return filesArr;
}

/**
 * @info separates numbers ie 3000000 -> 3,000,000
 * @param number 
 * @param separator default is ,
 * @returns string
 */
export function separateNum(number: string | number, separator?: string) {
    let cursep = ','
    if (separator) {
        cursep = separator
    }
    let ans = `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, cursep)
    if (`${number}`.includes('.')) {
        const init = number.toString().split('.')[0];
        const after = number.toString().split('.')[1];
        ans = init.replace(/\B(?=(\d{3})+(?!\d))/g, cursep) + `.${after}`
    }
    return ans;
}

export function flagImgUrl(string: string, ver?: 'osu') {
    const flagUrl: string = `https://osuflags.omkserver.nl/${string}`;
    return flagUrl;
}

const cacheById = [
    'bmsdata',
    'mapdata',
    'osudata',
    'scoredata',
]

/**
 * 
 * @param data
 * @param id command id. if storing a map use the map id/md5 or user id if storing a user
 * @param name 
 */
export function storeFile(data: {}, id: string | number, name: string) {
    try {
        if (cacheById.some(x => name.includes(x))) {
            if (name.includes('mapdata')) {
                const datamap: osuApiTypes.Beatmap = data as any
                let status = '';
                switch (datamap.status) {
                    case 'ranked':
                        status = 'Ranked'
                        break;
                    case 'loved':
                        status = 'Loved'
                        break;
                    case 'approved':
                        status = 'Approved'
                        break;
                    case 'pending':
                        status = 'Pending'
                        break;
                    default: case 'graveyard':
                        status = 'Graveyard'
                        break;
                }
                fs.writeFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${calc.toCapital(status)}${id}.json`, JSON.stringify(data, null, 2))
            } else {
                fs.writeFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}.json`, JSON.stringify(data, null, 2))
            }
        } else {
            fs.writeFileSync(`${truepath}\\cache\\commandData\\${id}-${name.toLowerCase()}.json`, JSON.stringify(data, null, 2))
        }
        return true;
    } catch (error) {
        return error;
    }
}

/**
 * 
 * @param id command id. If fetching a map use the map id/md5 or user id if fetching a user
 * @param name 
 * @returns 
 */
export function findFile(id: string | number, name: string) {
    if (cacheById.some(x => name.includes(x))) {
        if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}.json`)) {
            return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}.json`, 'utf-8'));
        }
        else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`)) {
            return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`, 'utf-8'));
        } else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`)) {
            return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`, 'utf-8'));
        } else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`)) {
            return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`, 'utf-8'));
        } else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`)) {
            return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`, 'utf-8'));
        }
        else {
            return false;
        }
    } else {
        if (fs.existsSync(`${truepath}\\cache\\commandData\\${id}-${name.toLowerCase()}.json`)) {
            return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${id}-${name.toLowerCase()}.json`, 'utf-8'));
        } else {
            return false;
        }
    }
}