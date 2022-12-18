import fs = require('fs');
// import truepath = require('../path').path
import { path } from '../path.js';
import * as osuApiTypes from '../src/types/osuApiTypes.js';
import * as calc from './calc.js';
import * as osufunc from './osufunc.js';
const truepath = `${path}`;
// truepath.path

export function generateId() {
    const lid = fs.readFileSync(`${path}/id.txt`, 'utf8');
    if (+lid == null || isNaN(+lid)) {
        fs.writeFileSync(`${path}/id.txt`, `1`);
        return 0;
    }
    fs.writeFileSync(`${path}/id.txt`, `${+lid + 1}`, 'utf-8');
    return +lid + 1;

}

export function readAllFiles(directory: string) {
    const filesArr = [];
    const init = fs.readdirSync(directory);
    //add init to filesArr
    //add all files in subdirectories to filesArr
    for (let i = 0; i < init.length; i++) {
        if (fs.statSync(directory + '/' + init[i]).isDirectory()) {
            const sub = fs.readdirSync(directory + '/' + init[i]);
            for (let j = 0; j < sub.length; j++) {
                //add sub-sub-directories to filesArr, and so on and so on
                if (fs.statSync(directory + '/' + init[i] + '/' + sub[j]).isDirectory()) {
                    const subsub = fs.readdirSync(directory + '/' + init[i] + '/' + sub[j]);
                    for (let k = 0; k < subsub.length; k++) {
                        filesArr.push(init[i] + '/' + sub[j] + '/' + subsub[k]);
                    }
                } else {
                    filesArr.push(init[i] + '/' + sub[j]);
                }
            }
        } else {
            filesArr.push(init[i]);
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
    let cursep = ',';
    if (separator) {
        cursep = separator;
    }
    let ans = `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, cursep);
    if (`${number}`.includes('.')) {
        const init = number.toString().split('.')[0];
        const after = number.toString().split('.')[1];
        ans = init.replace(/\B(?=(\d{3})+(?!\d))/g, cursep) + `.${after}`;
    }
    return ans;
}

/**
 * shortens numbers to their letter form ie
 * 1,254,123 => 1.25M
 */
export function numToLetter(number: number, decimals?: number) {
    let newnum: string;
    const temp = separateNum(number).split(',');
    switch (temp.length) {
        case 1:
            newnum = `${number}`;
            break;
        case 2:
            newnum = `${(number / 1000 ** 1).toFixed(decimals ?? 2)}k`;
            break;
        case 3:
            newnum = `${(number / 1000 ** 2).toFixed(decimals ?? 2)}M`;
            break;
        case 4:
            newnum = `${(number / 1000 ** 3).toFixed(decimals ?? 2)}B`;
            break;
        case 5:
            newnum = `${(number / 1000 ** 4).toFixed(decimals ?? 2)}T`;
            break;
        case 6:
            newnum = `${(number / 1000 ** 5).toFixed(decimals ?? 2)}Quad`;
            break;
        case 7:
            newnum = `${(number / 1000 ** 6).toFixed(decimals ?? 2)}Quint`;
            break;
    }
    return newnum;
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
    'maplistdata',
    'firstscoresdata'
];

/**
 * 
 * @param data
 * @param id command id. if storing a map use the map id/md5 or user id if storing a user
 * @param name 
 */
export function storeFile(data: osufunc.apiReturn | ((osuApiTypes.Score[] | osuApiTypes.Beatmapset[] | osuApiTypes.Beatmap[]) & osuApiTypes.Error), id: string | number, name: string, mode?: osuApiTypes.GameMode, type?: string) {
    try {
        if (cacheById.some(x => name.includes(x))) {
            switch (true) {
                case (name.includes('mapdata')): {
                    const datamap: osuApiTypes.Beatmap = (data as osufunc.apiReturn).apiData as any;
                    let status = '';
                    switch (datamap.status) {
                        case 'ranked':
                            status = 'Ranked';
                            break;
                        case 'loved':
                            status = 'Loved';
                            break;
                        case 'approved':
                            status = 'Approved';
                            break;
                        case 'pending':
                            status = 'Pending';
                            break;
                        default: case 'graveyard':
                            status = 'Graveyard';
                            break;
                    }
                    fs.writeFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${calc.toCapital(status)}${id}.json`, JSON.stringify(data, null, 2));
                } break;
                case (name.includes('bmsdata')): {
                    const datamap: osuApiTypes.Beatmapset = (data as osufunc.apiReturn).apiData as any;
                    let status = '';
                    switch (datamap.status) {
                        case 'ranked':
                            status = 'Ranked';
                            break;
                        case 'loved':
                            status = 'Loved';
                            break;
                        case 'approved':
                            status = 'Approved';
                            break;
                        case 'pending':
                            status = 'Pending';
                            break;
                        default: case 'graveyard':
                            status = 'Graveyard';
                            break;
                    }
                    fs.writeFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${calc.toCapital(status)}${id}.json`, JSON.stringify(data, null, 2));
                } break;
                case (name.includes('osudata')):case (name.includes('scoredata')): {
                    fs.writeFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`, JSON.stringify(data, null, 2));
                } break;
                case (name.includes('maplistdata')): {
                    fs.writeFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}_${type}.json`, JSON.stringify(data, null, 2));
                } break;
                // case (name.includes('scoredata')): {
                //     fs.writeFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}_${type}.json`, JSON.stringify(data, null, 2));
                // } break;
                default: {
                    fs.writeFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}.json`, JSON.stringify(data, null, 2));
                } break;
            }
        } else {
            fs.writeFileSync(`${truepath}\\cache\\commandData\\${id}-${name.toLowerCase()}.json`, JSON.stringify(data, null, 2));
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
export function findFile(id: string | number, name: string, mode?: osuApiTypes.GameMode, type?: string) {
    if (cacheById.some(x => name.includes(x))) {
        if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}.json`)) {
            return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}.json`, 'utf-8'));
        }
        if (name.includes('osudata')) {
            if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`, 'utf-8'));
            }
        }
        else if (name.includes('mapdata')) {
            if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`, 'utf-8'));
            }
        } else if (name.includes('bmsdata')) {
            if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`, 'utf-8'));
            }
        } else if (name.includes('maplistdata')) {
            if (fs.existsSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}_${type}.json`)) {
                return JSON.parse(fs.readFileSync(`${truepath}\\cache\\commandData\\${name.toLowerCase()}${id}_${type}.json`, 'utf-8'));
            }
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

/**
 * 
 * @param args arguments to search through
 * @param searchString string to search for (ie. -?)
 * @param type string or number
 * @param defaultValue value if failed
 * @param multipleWords if a string arg can be multiple words (ie. -? "yomi yori")
 * @param asInt returns an integer instead of a float
 */
export function parseArg(
    args: string[],
    searchString: string,
    type: 'string' | 'number',
    defaultValue: any,
    multipleWords?: boolean,
    asInt?: boolean,
) {
    let returnArg;
    let temp;
    temp = args[args.indexOf(searchString) + 1];
    if (!temp || temp.startsWith('-')) {
        returnArg = defaultValue;
    } else {
        switch (type) {
            case 'string': {
                returnArg = temp;
                if (multipleWords == true && temp.includes('"')) {
                    temp = args.join(' ').split(searchString)[1].split('"')[1];
                    for (let i = 0; i < args.length; i++) {
                        if (temp.includes(args[i].replaceAll('"', '')) && i > args.indexOf(searchString)) {
                            args.splice(i, 1);
                            i--;
                        }
                    }
                    returnArg = temp;
                } else {
                    args.splice(args.indexOf(searchString), 2);
                }
            }
                break;
            case 'number': {
                returnArg = +temp;
                if (isNaN(+temp)) {
                    returnArg = defaultValue;
                } else if (asInt == true) {
                    returnArg = parseInt(temp);
                }
                args.splice(args.indexOf(searchString), 2);
            }
                break;
        }
    }
    return {
        value: returnArg,
        newArgs: args
    };

}