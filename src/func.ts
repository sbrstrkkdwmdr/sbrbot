import fs = require('fs');
import https from 'https';
// import * as nfetch from 'node-fetch';
import nfetch from 'node-fetch';
import { filespath, path } from '../path.js';
import * as calc from './calc.js';
import * as log from './log.js';
import * as osufunc from './osufunc.js';
import * as osuApiTypes from './types/osuApiTypes.js';
import * as othertypes from './types/othertypes.js';

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
export function storeFile(data: string | osufunc.apiReturn | ((osuApiTypes.Score[] | osuApiTypes.Beatmapset[] | osuApiTypes.Beatmap[]) & osuApiTypes.Error) | osuApiTypes.BeatmapPlayCountArr | othertypes.geoLocale | othertypes.weatherData | othertypes.geoResults, id: string | number, name: string, mode?: osuApiTypes.GameMode, type?: string) {
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
                    fs.writeFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${calc.toCapital(status)}${id}.json`, JSON.stringify(data, null, 2));
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
                    fs.writeFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${calc.toCapital(status)}${id}.json`, JSON.stringify(data, null, 2));
                } break;
                case (name.includes('osudata')): case (name.includes('scoredata')): {
                    fs.writeFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`, JSON.stringify(data, null, 2));
                } break;
                case (name.includes('maplistdata')): {
                    fs.writeFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}_${type}.json`, JSON.stringify(data, null, 2));
                } break;
                // case (name.includes('scoredata')): {
                //     fs.writeFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}_${type}.json`, JSON.stringify(data, null, 2));
                // } break;
                default: {
                    fs.writeFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}.json`, JSON.stringify(data, null, 2));
                } break;
            }
        } else {
            fs.writeFileSync(`${path}\\cache\\commandData\\${id}-${name.toLowerCase()}.json`, JSON.stringify(data, null, 2));
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
        if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}.json`)) {
            return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}.json`, 'utf-8'));
        }
        if (name.includes('osudata')) {
            if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`, 'utf-8'));
            }
        }
        else if (name.includes('mapdata')) {
            if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`, 'utf-8'));
            }
        } else if (name.includes('bmsdata')) {
            if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Ranked${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Loved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Approved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}Graveyard${id}.json`, 'utf-8'));
            }
        } else if (name.includes('maplistdata')) {
            if (fs.existsSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}_${type}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${name.toLowerCase()}${id}_${type}.json`, 'utf-8'));
            }
        }
        else {
            return false;
        }
    } else {
        if (fs.existsSync(`${path}\\cache\\commandData\\${id}-${name.toLowerCase()}.json`)) {
            return JSON.parse(fs.readFileSync(`${path}\\cache\\commandData\\${id}-${name.toLowerCase()}.json`, 'utf-8'));
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

/**
 * 
 * @param input URL to the file
 * @param output where to save the file once finished (INCLUDE FILE EXTENSIONS)
 */
export async function downloadFile(
    input: string,
    output: string,
) {
    const file = fs.createWriteStream(`${output}`);
    await https.get(`${input}`, function (response) {
        response.pipe(file);
    });

    return output;
}

export async function fetch(url: string) {
    const data = await nfetch(url, {
        method: 'GET',
    }).then(res => res.json());
    return data;
}

export function appendUrlParams(url: string, params: { name: string, value: string; }[]) {
    let temp = url;
    for (let i = 0; i < params.length; i++) {
        const cur = params[i];
        if (!cur) { break; }
        temp.includes('?') ?
            temp += `&${cur.name}=${cur.value}` :
            `?${cur.name}=${cur.value}`;
    }
    return temp;
}

export function appendUrlParamsString(url: string, params: string[]) {
    let temp = url;
    for (let i = 0; i < params.length; i++) {
        const cur = params[i];
        if (!cur) { break; }
        temp.includes('?') ?
            temp += `&${cur}` :
            `?${cur}`;
    }
    return temp;
}

export function randomString(useSymbols: boolean, length?: number, string?: string) {
    if (!string) {
        string = '';
    }
    if (!useSymbols) {
        useSymbols = false;
    }
    if (length == 0) {
        return string;
    }
    if (!length) {
        length = 10;
    }

    const list = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    ];

    if (useSymbols) {
        const symbols = [
            '`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+',
            '{', '}', '[', ']', '|', '\\', ';', ':', '\'', '"', ',', '.', '<', '>', '/', '?'
        ];
        symbols.forEach(x =>
            list.push(x)
        );
    }

    string += list[Math.floor(Math.random() * list.length)];

    randomString(useSymbols, length--, string);
}

/**
 * filters array by search. 
 * 
 * returns array with items that include the search string
 */
export function filterSearchArray(arr: string[], search: string) {
    return arr.filter((el) => el.toLowerCase().includes(search.toLowerCase()));
}

export function removeSIPrefix(str: string) {
    const SIPrefixes = [
        { prefix: 'Q', name: 'quetta', value: 1e27 },
        { prefix: 'R', name: 'ronna', value: 1e27 },
        { prefix: 'Y', name: 'yotta', value: 1e24 },
        { prefix: 'Z', name: 'zetta', value: 1e21 },
        { prefix: 'E', name: 'exa', value: 1e18 },
        { prefix: 'P', name: 'peta', value: 1e15 },
        { prefix: 'T', name: 'tera', value: 1e12 },
        { prefix: 'G', name: 'giga', value: 1e9 },
        { prefix: 'M', name: 'mega', value: 1e6 },
        { prefix: 'k', name: 'kilo', value: 1e3 },
        { prefix: 'h', name: 'hecto', value: 1e2 },
        { prefix: 'da', name: 'deca', value: 1e1 },
        { prefix: 'd', name: 'deci', value: 1e-1 },
        { prefix: 'c', name: 'centi', value: 1e-2 },
        { prefix: 'm', name: 'milli', value: 1e-3 },
        { prefix: 'µ', name: 'micro', value: 1e-6 },
        { prefix: 'n', name: 'nano', value: 1e-9 },
        { prefix: 'p', name: 'pico', value: 1e-12 },
        { prefix: 'f', name: 'femto', value: 1e-15 },
        { prefix: 'a', name: 'atto', value: 1e-18 },
        { prefix: 'z', name: 'zepto', value: 1e-21 },
        { prefix: 'y', name: 'yocto', value: 1e-24 },
        { prefix: 'r', name: 'ronto', value: 1e27 },
        { prefix: 'q', name: 'quecto', value: 1e27 },
    ];

    let removedPrefix = '';
    let value = parseFloat(str);
    let power = 1;
    let foundPrefix = { prefix: '', name: '', value: 1e0 };

    if (isNaN(value)) {
        foundPrefix = SIPrefixes.find(p => str.startsWith(p.name) || str.startsWith(p.prefix));
        if (foundPrefix) {
            power = foundPrefix.value;
            removedPrefix = str.startsWith(foundPrefix.name) ?
                foundPrefix.name : foundPrefix.prefix;
        } else {
            value = parseFloat(str);
        }
    }

    return {
        prefix: {
            removed: removedPrefix,
            short: foundPrefix?.prefix,
            long: foundPrefix?.name,
        },
        power,
        originalValue: str.replace(removedPrefix, ''),
    };
}

export async function getLocation(name: string) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name.replaceAll(' ', '+')}&count=10&language=en&format=json`;
    log.toOutput(url);
    const data = await nfetch(url).then(x => x.json());
    return data as { results: othertypes.geoLocale[]; };
}

export async function getWeather(
    latitude: number,
    longitude: number,
    location: othertypes.geoLocale,
) {
    if (isNaN(latitude) || isNaN(longitude)) {
        return 'error - NaN values given';
    }
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`
        + "&hourly=temperature_2m,precipitation,rain,pressure_msl,windspeed_10m&current_weather=true&forecast_days=1"
        + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,precipitation_probability_min,precipitation_probability_mean,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant"
        + `&timezone=${location.timezone}`;
    log.toOutput(url);

    const data = await nfetch(url).then(x => x.json());
    return data as othertypes.weatherData;
}

export function weatherCodeToString(code: number) {
    let string = 'Clear';
    let icon = '';
    switch (code) {
        case 0: default:
            string = 'Clear sky';
            icon = '☀';
            break;
        case 1:
            string = 'Mostly clear';
            icon = '🌤';
            break;
        case 2:
            string = 'Partly Cloudy';
            icon = '⛅';
            break;
        case 3:
            string = 'Overcast';
            icon = '☁';
            break;
        case 45:
            string = 'Fog';
            icon = '🌁';
            break;
        case 48:
            string = 'Fog'; //wtf is deposting rime fog
            icon = '🌁';
            break;
        case 51:
            string = 'Light drizzle';
            icon = '🌧';
            break;
        case 53:
            string = 'Moderate drizzle';
            icon = '🌧';
            break;
        case 55:
            string = 'Heavy drizzle';
            icon = '🌧';
            break;
        case 56:
            string = 'Light freezing drizzle';
            icon = '🌧';
            break;
        case 57:
            string = 'Heavy freezing drizzle';
            icon = '🌧';
            break;
        case 61:
            string = 'Light rain';
            icon = '🌧';
            break;
        case 63:
            string = 'Moderate rain';
            icon = '🌧';
            break;
        case 65:
            string = 'Heavy rain';
            icon = '🌧';
            break;
        case 66:
            string = 'Light freezing rain';
            icon = '🌧';
            break;
        case 67:
            string = 'Heavy freezing rain';
            icon = '🌧';
            break;
        case 71:
            string = 'Light snow';
            icon = '❄';
            break;
        case 73:
            string = 'Moderate snow';
            icon = '❄';
            break;
        case 75:
            string = 'Heavy snow';
            icon = '❄';
            break;
        case 77:
            string = 'Snow grains';
            icon = '❄';
            break;
        case 80:
            string = 'Light showers';
            icon = '🌧';
            break;
        case 81:
            string = 'Moderate showers';
            icon = '🌧';
            break;
        case 82:
            string = 'Heavy showers';
            icon = '🌧';
            break;
        case 85:
            string = 'Light snow showers';
            icon = '❄';
            break;
        case 86:
            string = 'Heavy snow showers';
            icon = '❄';
            break;
        case 95:
            string = 'Thunderstorms';
            icon = '⛈';
            break;
        case 96:
            string = 'Thunderstorms and light hail';
            icon = '⛈';
            break;
        case 99:
            string = 'Thunderstorms and heavy hail';
            icon = '⛈';
            break;
    }
    return {
        string, icon
    };

}

/**
 * converts an angle to a wind direction (north, north east, north east east whatever)
 * @returns direction the wind is coming from 
*/
export function windToDirection(angle: number) {
    //thank you chatGPT

    // Define an array of wind directions in clockwise order
    const directions = [
        { name: 'North', travels: 'South', emoji: '⬇' },
        { name: 'North-Northeast', travels: 'South-Southwest', emoji: '↙' },
        { name: 'Northeast', travels: 'Southwest', emoji: '↙' },
        { name: 'East-Northeast', travels: 'West-Southwest', emoji: '↙' },
        { name: 'East', travels: 'West', emoji: '⬅' },
        { name: 'East-Southeast', travels: 'West-Northwest', emoji: '↖' },
        { name: 'Southeast', travels: 'Northwest', emoji: '↖' },
        { name: 'South-Southeast', travels: 'North-Northwest', emoji: '↖' },
        { name: 'South', travels: 'North', emoji: '⬆' },
        { name: 'South-Southwest', travels: 'North-Northeast', emoji: '↗' },
        { name: 'Southwest', travels: 'Northeast', emoji: '↗' },
        { name: 'West-Southwest', travels: 'East-Northeast', emoji: '↗' },
        { name: 'West', travels: 'East', emoji: '➡' },
        { name: 'West-Northwest', travels: 'East-Southeast', emoji: '↘' },
        { name: 'Northwest', travels: 'Southeast', emoji: '↘' },
        { name: 'North-Northwest', travels: 'South-Southeast', emoji: '↘' },
    ];

    // Normalize the angle to the range 0 to 359 degrees
    const normalizedAngle = (angle % 360 + 360) % 360;

    // Calculate the index corresponding to the wind direction
    const index = Math.floor(normalizedAngle / 22.5);

    // Retrieve the wind direction from the array
    return directions[index];
}

export async function getTropical(type: 'active' | 'storm' | 'features', request?: string) {
    const baseURL = 'https://storm.tidetech.org/v1/';

    const reqURL = type != 'active' ? baseURL + request : baseURL + 'active';

    const data = await nfetch(reqURL).then(x => x.json());
    return data as othertypes.tropicalData;
}

export function tsCatToString(input: string) {
    let cat = {
        name: '',
        category: input,
        colour: '',
        speed: {
            kts: '',
            mph: '',
            kph: '',
        }
    };
    switch (input) {
        case 'TD':
            cat = {
                name: 'Tropical Depression',
                category: input,
                colour: '',
                speed: {
                    kts: '',
                    mph: '',
                    kph: '',
                }
            };
            break;
        case 'TS':
            cat = {
                name: 'Tropical Storm',
                category: input,
                colour: '',
                speed: {
                    kts: '',
                    mph: '',
                    kph: '',
                }
            };
            break;
        case 'Cat1':
            cat = {
                name: 'Hurricane',
                category: input,
                colour: '',
                speed: {
                    kts: '',
                    mph: '',
                    kph: '',
                }
            };
            break;
        case 'Cat2':
            cat = {
                name: '',
                category: input,
                colour: '',
                speed: {
                    kts: '',
                    mph: '',
                    kph: '',
                }
            };
            break;
        case 'Cat3':
            cat = {
                name: '',
                category: input,
                colour: '',
                speed: {
                    kts: '',
                    mph: '',
                    kph: '',
                }
            };
            break;
        case 'Cat4':
            cat = {
                name: '',
                category: input,
                colour: '',
                speed: {
                    kts: '',
                    mph: '',
                    kph: '',
                }
            };
            break;
        case 'Cat5':
            cat = {
                name: '',
                category: input,
                colour: '',
                speed: {
                    kts: '',
                    mph: '',
                    kph: '',
                }
            };
            break;
    }
    return cat;
}

export function tsBasinToString(string: string) {
    let basin: string = 'null';
    switch (string) {
        case 'ATL':
            basin = 'North Atlantic';
            break;
        case 'NEP':
            basin = 'Northeast Pacific';
            break;
        case 'NWP':
            basin = 'Northwest Pacific';
            break;
        case 'SWP':
            basin = 'Southwest Pacific';
            break;
        case 'SIO':
            basin = 'South Indian Ocean';
            break;
        case 'NIO':
            basin = 'North Indian Ocean';
            break;
    }
    return basin;
}