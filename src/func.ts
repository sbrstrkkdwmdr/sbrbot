import fs = require('fs');
import axios from 'axios';
import charttoimg from 'chartjs-to-image';
import * as Discord from 'discord.js';
import https from 'https';
import * as jimp from 'jimp';
import * as quickchart from 'quickchart-js';
import { filespath, path, precomppath } from '../path.js';
import * as calc from './calc.js';
import * as clr from './colourcalc.js';
import * as clrs from './consts/colours.js';
import * as emojis from './consts/emojis.js';
import * as mainconst from './consts/main.js';
import * as log from './log.js';
import * as osufunc from './osufunc.js';
import * as extypes from './types/extratypes.js';
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
 * @returns string with numbers separated. Doesn't separate values after the decimal point.
 */
export function separateNum(number: string | number, separator?: string) {
    let cursep = ',';
    if (separator) {
        cursep = separator;
    }
    let ans = `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, cursep);
    if (`${number}`.includes('.')) {
        const init = `${number}`.split('.')[0];
        const after = `${number}`.split('.')[1];
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
export function storeFile(data: string | osufunc.apiReturn | ((osuApiTypes.Score[] | osuApiTypes.Beatmapset[] | osuApiTypes.Beatmap[]) & osuApiTypes.Error) | osuApiTypes.BeatmapPlayCountArr | othertypes.geoLocale | othertypes.weatherData | othertypes.geoResults | othertypes.tropicalData | othertypes.tsData | othertypes.tsFeatureData, id: string | number, name: string, mode?: osuApiTypes.GameMode, type?: string) {
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
                    fs.writeFileSync(`${path}/cache/commandData/${name.toLowerCase()}${calc.toCapital(status)}${id}.json`, JSON.stringify(data, null, 2));
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
                    fs.writeFileSync(`${path}/cache/commandData/${name.toLowerCase()}${calc.toCapital(status)}${id}.json`, JSON.stringify(data, null, 2));
                } break;
                case (name.includes('osudata')): case (name.includes('scoredata')): {
                    fs.writeFileSync(`${path}/cache/commandData/${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`, JSON.stringify(data, null, 2));
                } break;
                case (name.includes('maplistdata')): {
                    fs.writeFileSync(`${path}/cache/commandData/${name.toLowerCase()}${id}_${type}.json`, JSON.stringify(data, null, 2));
                } break;
                // case (name.includes('scoredata')): {
                //     fs.writeFileSync(`${path}/cache/commandData/${name.toLowerCase()}${id}_${type}.json`, JSON.stringify(data, null, 2));
                // } break;
                default: {
                    fs.writeFileSync(`${path}/cache/commandData/${name.toLowerCase()}${id}.json`, JSON.stringify(data, null, 2));
                } break;
            }
        } else {
            fs.writeFileSync(`${path}/cache/commandData/${id}-${name.toLowerCase()}.json`, JSON.stringify(data, null, 2));
        }
        return true;
    } catch (error) {
        console.log(error);
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
        if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}${id}.json`)) {
            return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}${id}.json`, 'utf-8'));
        }
        if (name.includes('osudata')) {
            if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}${id}_${mode ?? 'osu'}.json`, 'utf-8'));
            }
        }
        else if (name.includes('mapdata')) {
            if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}Ranked${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}Ranked${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}Loved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}Loved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}Approved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}Approved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}Graveyard${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}Graveyard${id}.json`, 'utf-8'));
            }
        } else if (name.includes('bmsdata')) {
            if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}Ranked${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}Ranked${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}Loved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}Loved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}Approved${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}Approved${id}.json`, 'utf-8'));
            } else if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}Graveyard${id}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}Graveyard${id}.json`, 'utf-8'));
            }
        } else if (name.includes('maplistdata')) {
            if (fs.existsSync(`${path}/cache/commandData/${name.toLowerCase()}${id}_${type}.json`)) {
                return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${name.toLowerCase()}${id}_${type}.json`, 'utf-8'));
            }
        }
        else {
            return false;
        }
    } else {
        if (fs.existsSync(`${path}/cache/commandData/${id}-${name.toLowerCase()}.json`)) {
            return JSON.parse(fs.readFileSync(`${path}/cache/commandData/${id}-${name.toLowerCase()}.json`, 'utf-8'));
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
        //@ts-expect-error Argument of type 'WriteStream' is not assignable to parameter of type 'WritableStream'.ts(2345)
        response.pipe(file);
    });

    return output;
}

/**
 * 
 * @param input URL to the file
 * @param output where to save the file once finished (INCLUDE FILE EXTENSIONS)
 */
export function downloadIMG(
    url: string,
    filepath: string,
) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);

        https.get(url, response => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(filepath); // Remove incomplete file
                console.log('Failed to fetch the image');
                reject(new Error('Failed to fetch the image'));
                return;
            }
            //@ts-expect-error Argument of type 'WriteStream' is not assignable to parameter of type 'WritableStream'.ts(2345)
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve('Image downloaded successfully!');
            });
        }).on('error', error => {
            file.close();
            fs.unlinkSync(filepath); // Remove incomplete file
            reject(error);
        });
    });
}

export async function fetch(url: string) {
    return ((await axios.get(url)).data);
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
            '{', '}', '[', ']', '|', '/', ';', ':', '\'', '"', ',', '.', '<', '>', '/', '?'
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

export async function getLocation(name: string, config: extypes.config) {
    if (mainconst.isTesting) {
        const init = fs.readFileSync(`${precomppath}/files/testfiles/weatherlocationdata.json`, 'utf-8');
        return JSON.parse(init) as {
            results: othertypes.geoLocale[];
        };
    }
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${name.replaceAll(' ', '+')}&count=10&language=en&format=json`;
    log.toOutput(url, config);
    const data = await axios.get(url)
        .then(x => x.data)
        .catch(err => {
            console.log(err);
            return { error: true };
        }
        );


    return data as { results: othertypes.geoLocale[]; };
}

export async function getWeather(
    latitude: number,
    longitude: number,
    location: othertypes.geoLocale,
    config: extypes.config
) {
    if (mainconst.isTesting) {
        const init = fs.readFileSync(`${precomppath}/files/testfiles/weatherdata.json`, 'utf-8');
        return JSON.parse(init) as othertypes.weatherData;
    } else {
        if (isNaN(latitude) || isNaN(longitude)) {
            return 'error - NaN values given';
        }
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`
            + "&hourly=temperature_2m,precipitation,rain,pressure_msl,windspeed_10m,windgusts_10m,precipitation_probability,showers,snowfall"
            + "&current_weather=true&forecast_days=3&past_days=2"
            + "&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,precipitation_probability_min,precipitation_probability_mean,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant"
            + `&timezone=${location.timezone}`;
        log.toOutput(url, config);
        const data = await axios.get(url)
            .then(x => x.data)
            .catch(err => {
                console.log(err);
                return { error: true, reason: "timeout" };
            });
        return data as othertypes.weatherData;
    }
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
export function windToDirection(angle: number, reverse?: boolean) {
    //thank you chatGPT

    // Define an array of wind directions in clockwise order
    const directions = [
        { name: 'North', travels: 'South', emoji: '⬇', short: 'N', },
        { name: 'North-Northeast', travels: 'South-Southwest', emoji: '↙', short: 'NNE', },
        { name: 'Northeast', travels: 'Southwest', emoji: '↙', short: 'NE', },
        { name: 'East-Northeast', travels: 'West-Southwest', emoji: '↙', short: 'ENE', },
        { name: 'East', travels: 'West', emoji: '⬅', short: 'E', },
        { name: 'East-Southeast', travels: 'West-Northwest', emoji: '↖', short: 'ESE', },
        { name: 'Southeast', travels: 'Northwest', emoji: '↖', short: 'SE', },
        { name: 'South-Southeast', travels: 'North-Northwest', emoji: '↖', short: 'SSE', },
        { name: 'South', travels: 'North', emoji: '⬆', short: 'S', },
        { name: 'South-Southwest', travels: 'North-Northeast', emoji: '↗', short: 'SSW', },
        { name: 'Southwest', travels: 'Northeast', emoji: '↗', short: 'SW', },
        { name: 'West-Southwest', travels: 'East-Northeast', emoji: '↗', short: 'WSW', },
        { name: 'West', travels: 'East', emoji: '➡', short: 'W', },
        { name: 'West-Northwest', travels: 'East-Southeast', emoji: '↘', short: 'WNW', },
        { name: 'Northwest', travels: 'Southeast', emoji: '↘', short: 'NW', },
        { name: 'North-Northwest', travels: 'South-Southeast', emoji: '↘', short: 'NNW', },
        { name: 'North', travels: 'South', emoji: '⬇', short: 'N', },
        { name: 'North-Northeast', travels: 'South-Southwest', emoji: '↙', short: 'NNE', },
        { name: 'Northeast', travels: 'Southwest', emoji: '↙', short: 'NE', },
        { name: 'East-Northeast', travels: 'West-Southwest', emoji: '↙', short: 'ENE', },
        { name: 'East', travels: 'West', emoji: '⬅', short: 'E', },
        { name: 'East-Southeast', travels: 'West-Northwest', emoji: '↖', short: 'ESE', },
        { name: 'Southeast', travels: 'Northwest', emoji: '↖', short: 'SE', },
        { name: 'South-Southeast', travels: 'North-Northwest', emoji: '↖', short: 'SSE', },
        { name: 'South', travels: 'North', emoji: '⬆', short: 'S', },
        { name: 'South-Southwest', travels: 'North-Northeast', emoji: '↗', short: 'SSW', },
        { name: 'Southwest', travels: 'Northeast', emoji: '↗', short: 'SW', },
        { name: 'West-Southwest', travels: 'East-Northeast', emoji: '↗', short: 'WSW', },
        { name: 'West', travels: 'East', emoji: '➡', short: 'W', },
        { name: 'West-Northwest', travels: 'East-Southeast', emoji: '↘', short: 'WNW', },
        { name: 'Northwest', travels: 'Southeast', emoji: '↘', short: 'NW', },
        { name: 'North-Northwest', travels: 'South-Southeast', emoji: '↘', short: 'NNW', },
    ];

    // Normalize the angle to the range 0 to 359 degrees
    const normalizedAngle = (angle % 360 + 360) % 360;

    // Calculate the index corresponding to the wind direction
    const index =
        reverse == true ? Math.floor(normalizedAngle / 22.5) + directions.length / 4 :
            Math.floor(normalizedAngle / 22.5);

    // Retrieve the wind direction from the array
    return directions[index];
}

export async function getTropical(config: extypes.config, type: 'active' | 'storm' | 'features', request?: string) {
    const baseURL = 'https://storm.tidetech.org/v1/';

    const reqURL = type == 'active' ?
        baseURL + 'active' :
        type == 'storm' ?
            baseURL + 'storm/' + request :
            baseURL + 'storm/' + request + '/features';

    if (mainconst.isTesting) {
        let data;
        switch (type) {
            case 'active':
                data = fs.readFileSync(`${precomppath}/files/testfiles/tropicalweatherdata.json`, 'utf-8');
                break;
            case 'storm': {
                const list = ['05e', '06w', '07w'];
                const opt = list[Math.floor(Math.random() * list.length)];
                data = fs.readFileSync(`${precomppath}/files/testfiles/tropicalweatherdata2023${opt}.json`, 'utf-8');
            }
                break;
        }
        return JSON.parse(data) as othertypes.tropicalData;
    } else {
        log.toOutput(reqURL, config);
        const data = (await axios.get(reqURL)).data;
        return data as othertypes.tropicalData;
    }
}

export function tsCatToString(input: string) {
    let cat = {
        name: '',
        name_asia: '',
        name_auid: '',
        category: input,
        colour: '',
        speed: {
            max: '', //in km/h
            min: '',
        }
    };
    switch (input) {
        case 'td': default:
            cat = {
                name: 'Tropical Depression',
                name_asia: 'Tropical Depression',
                name_auid: 'Tropical Depression',
                category: input,
                colour: '00CCFF',
                speed: {
                    max: '63',
                    min: '0',
                }
            };
            break;
        case 'ts':
            cat = {
                name: 'Tropical Storm',
                name_asia: 'Tropical Storm',
                name_auid: 'Tropical Storm',
                category: input,
                colour: '00FF00',
                speed: {
                    max: '118',
                    min: '63',
                }
            };
            break;
        case 'cat1':
            cat = {
                name: 'Category 1 Hurricane',
                name_asia: 'Category 1 Typhoon',
                name_auid: 'Category 1 Cyclone',
                category: input,
                colour: 'FFFF00',
                speed: {
                    max: '153',
                    min: '119',
                }
            };
            break;
        case 'cat2':
            cat = {
                name: 'Category 2 Hurricane',
                name_asia: 'Category 2 Typhoon',
                name_auid: 'Category 2 Cyclone',
                category: input,
                colour: 'FFCC00',
                speed: {
                    max: '177',
                    min: '154',
                }
            };
            break;
        case 'cat3':
            cat = {
                name: 'Category 3 Hurricane',
                name_asia: 'Category 3 Typhoon',
                name_auid: 'Category 3 Cyclone',
                category: input,
                colour: 'FF6600',
                speed: {
                    max: '208',
                    min: '178',
                }
            };
            break;
        case 'cat4':
            cat = {
                name: 'Category 4 Hurricane',
                name_asia: 'Category 4 Typhoon',
                name_auid: 'Category 4 Cyclone',
                category: input,
                colour: 'FF0000',
                speed: {
                    max: '251',
                    min: '209',
                }
            };
            break;
        case 'cat5':
            cat = {
                name: 'Category 5 Hurricane',
                name_asia: 'Category 5 Typhoon',
                name_auid: 'Category 5 Cyclone',
                category: input,
                colour: 'CC00CC',
                speed: {
                    max: '∞',
                    min: '251',
                }
            };
            break;
    }
    return cat;
}

export type basins =
    'North Atlantic' |
    'Northeast Pacific' |
    'Northwest Pacific' |
    'Southwest Pacific' |
    'South Indian Ocean' |
    'North Indian Ocean' |
    'North Atlantic' |
    'Northwest Pacific' |
    'Arabian Sea' |
    'Bay of Bengal' |
    'Northeast Pacific' |
    'Central Pacific' |
    'Southwest Pacific' |
    'South Indian Ocean';

export function tsBasinToString(string: string) {
    let basin: basins = null;
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
        case 'N':
            basin = 'North Atlantic';
            break;
        case 'W':
            basin = 'Northwest Pacific';
            break;
        case 'A':
            basin = 'Arabian Sea';
            break;
        case 'B':
            basin = 'Bay of Bengal';
            break;
        case 'E':
            basin = 'Northeast Pacific';
            break;
        case 'C':
            basin = 'Central Pacific';
            break;
        case 'P':
            basin = 'Southwest Pacific';
            break;
        case 'S':
            basin = 'South Indian Ocean';
            break;
    }
    return basin;
}

/**
 * cyclone, hurricane, or typhoon
 */
export function tsBasinToType(string: string) {
    let basin: 'Hurricane' | 'Typhoon' | 'Cyclone' = 'Hurricane';
    switch (string) {
        case 'ATL': case 'N': case 'NEP': case 'E': case 'C': default:
            basin = 'Hurricane';
            break;
        case 'NWP': case 'W':
            basin = 'Typhoon';
            break;
        case 'SWP': case 'SIO': case 'NIO': case 'A': case 'B': case 'P': case 'S':
            basin = 'Cyclone';
            break;
    }
    return basin;
}

/**
 * Saffir-Simpson Hurricane Wind Scale
 * @param maxwsp sustained wind speed in km/h
 */
export function tsNameSSHWS(maxwsp: number) {
    let name = '';
    switch (true) {
        case maxwsp < 62:
            name = 'Tropical Depression';
            break;
        case maxwsp < 118:
            name = 'Tropical Storm';
            break;
        case maxwsp < 153:
            name = 'Category 1';
            break;
        case maxwsp < 177:
            name = 'Category 2';
            break;
        case maxwsp < 208:
            name = 'Category 3';
            break;
        case maxwsp < 251:
            name = 'Category 4';
            break;
        default:
            name = 'Category 5';
            break;

    }
    return name;
}

/**
 * India Meteorological Department
 * @param maxwsp sustained wind speed in km/h
 */
export function tsNameIMD(maxwsp: number) {
    let name = '';
    switch (true) {
        case maxwsp < 31:
            name = 'Low-pressure area';
            break;
        case maxwsp < 49:
            name = 'Depression';
            break;
        case maxwsp < 61:
            name = 'Deep depression';
            break;
        case maxwsp < 88:
            name = 'Cyclonic storm';
            break;
        case maxwsp < 117:
            name = 'Severe cyclonic storm';
            break;
        case maxwsp < 167:
            name = 'Very severe cyclonic storm';
            break;
        case maxwsp < 221:
            name = 'Extremely severe cyclonic storm';
            break;
        default:
            name = 'Super cyclonic storm';
            break;

    }
    return name;
}

/**
 * Japan Meteorological Agency
 * @param maxwsp sustained wind speed in km/h
 */
export function tsNameJMA(maxwsp: number) {
    let name = '';
    switch (true) {
        case maxwsp < 62:
            name = 'Tropical depression';
            break;
        case maxwsp < 89:
            name = 'Tropical storm';
            break;
        case maxwsp < 118:
            name = 'Severe tropical storm';
            break;
        case maxwsp < 157:
            name = 'Typhoon';
            break;
        case maxwsp < 194:
            name = 'Very strong typhoon';
            break;
        default:
            name = 'Violent typhoon';
            break;

    }
    return name;
}

/**
 * Météo-France
 * @param maxwsp sustained wind speed in km/h
 */
export function tsNameMFR(maxwsp: number) {
    let name = '';
    switch (true) {
        case maxwsp < 51:
            name = 'Tropical disturbance';
            break;
        case maxwsp < 63:
            name = 'Tropical depression';
            break;
        case maxwsp < 89:
            name = 'Moderate tropical storm';
            break;
        case maxwsp < 118:
            name = 'Severe tropical storm';
            break;
        case maxwsp < 166:
            name = 'Tropical cyclone';
            break;
        case maxwsp < 212:
            name = 'Intense tropical cyclone';
            break;
        default:
            name = 'Very intense tropical cyclone';
            break;

    }
    return name;
}

/**
 * Australian Tropical Cyclone Intensity Scale
 * @param maxwsp sustained wind speed in km/h
 */
export function tsNameATCIS(maxwsp: number) {
    let name = '';
    switch (true) {
        case maxwsp < 91:
            name = 'Tropical storm';
            break;
        case maxwsp < 126:
            name = 'One';
            break;
        case maxwsp < 167:
            name = 'Two';
            break;
        case maxwsp < 226:
            name = 'Three';
            break;
        case maxwsp < 280:
            name = 'Four';
            break;
        default:
            name = 'Five';
            break;

    }
    return name;
}


/**
 * 
 * @param x 
 * @param y 
 * @param label name of graph
 * @param lineColour colour of graph line written as rgb(x, y, z)
 * @returns path to the graph
 */
export async function graph(
    x: number[] | string[],
    y: number[],
    label: string,
    other: {
        startzero?: boolean,
        fill?: boolean,
        displayLegend?: boolean,
        lineColour?: string,
        pointSize?: number;
        gradient?: boolean;
        type?: 'line' | 'bar';
        stacked?: boolean;
        title?: string;
        showAxisX?: boolean;
        showAxisY?: boolean;
        stacksSeparate?: boolean;
        reverse?: boolean;
        imgUrl?: string;
        blurImg?: boolean;
        barOutline?: true;
    },
    extra?: {
        data: number[];
        label: string;
        separateAxis: boolean;
        customStack?: number;
        reverse?: boolean;
    }[]
) {

    if (other.startzero == null || typeof other.startzero == 'undefined') {
        other.startzero = true;
    }
    if (other.fill == null || typeof other.fill == 'undefined') {
        other.fill = false;
    }
    if (other.displayLegend == null || other.displayLegend == undefined || typeof other.displayLegend == 'undefined') {
        other.displayLegend = false;
    }
    if (other.type == null || other.type == undefined || typeof other.displayLegend == 'undefined') {
        other.type = 'line';
    }

    let curx = [];
    let cury = [];

    if (y.length > 200) {
        const div = y.length / 200;
        for (let i = 0; i < 200; i++) {
            const offset = Math.ceil(i * div);
            const curval = y[offset];
            cury.push(curval);
            curx.push(x[offset]);
        }
    } else {
        curx = x;
        cury = y;
    }

    let secondReverse = false;
    // gradients just make the line invis for some reason
    // if (other.gradient) {
    //     const tmp = clrs.rainbow;
    //     const gradient = `__BEGINFUNCTION__getGradientFillHelper("vertical", ${JSON.stringify([tmp.red, tmp.orange, tmp.yellow, tmp.green, tmp.blue, tmp.indigo, tmp.violet])})__ENDFUNCTION__`;
    //     // other.lineColour = gradient
    //     // //@ts-expect-error ts wants "quickchart.default.default" but the second default is undefined when compiled to js
    //     // other.lineColour = quickchart.default.getGradientFillHelper('vertical', [tmp.red, tmp.orange, tmp.yellow, tmp.green, tmp.blue, tmp.indigo, tmp.violet]);
    //     // //@ts-expect-error bro
    //     // console.log(quickchart.default.getGradientFillHelper('vertical', [tmp.red, tmp.orange, tmp.yellow, tmp.green, tmp.blue, tmp.indigo, tmp.violet]));
    //     // //`__BEGINFUNCTION__getGradientFillHelper(${JSON.stringify(direction)}, ${JSON.stringify(colors)}, ${JSON.stringify(dimensions)})__ENDFUNCTION__`;
    // }

    const datasets = [{
        label: label,
        data: cury,
        fill: other.fill,
        borderColor: other.lineColour ?? 'rgb(101, 101, 135)',
        borderWidth: 1,
        pointRadius: other.pointSize ?? 2,
        yAxisID: '1y'
    }];
    if (other?.stacked == true) {
        datasets[0]['stack'] = 'Stack 0';
    }
    let showSecondAxis = false;
    if (!(extra == null || extra == undefined)) {
        const diff = 360 / Math.floor(extra.length);
        let i = 1;
        for (const newData of extra) {
            if (newData?.data?.length > 0) {
                const nHSV = clr.rgbToHsv(101, 101, 135);
                const newclr = clr.hsvToRgb(nHSV.h + (diff * i), nHSV.s, nHSV.v);
                const xData = {
                    label: newData.label,
                    data: newData.data,
                    fill: other.fill,
                    borderColor: other.lineColour ?? `rgb(${newclr})`,
                    borderWidth: 1,
                    pointRadius: other.pointSize ?? 2,
                    yAxisID: newData.separateAxis ? '2y' : '1y'
                };
                newData.reverse ? secondReverse = true : null;
                if (other?.type == 'bar' && other?.stacked == true && other?.stacksSeparate == true) {
                    newData.customStack ?
                        xData['stack'] = `Stack ${newData.customStack}` :
                        xData['stack'] = 'Stack 0';
                }
                datasets.push(xData);
                if (newData.separateAxis) showSecondAxis = true;
                i++;
            }
        }
    }

    const cfgopts = {
        legend: {
            display: other.displayLegend
        },
        title: {
            display: other?.title ? true : false,
            title: other?.title ?? 'No title'
        },
        scales: {
            x: {
                ticks: {
                    color: 'rgb(128, 128, 128)'
                },
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: 'rgb(64, 64, 64)'
                }
            },
            y: {
                ticks: {
                    color: 'rgb(128, 128, 128)'
                },
                grid: {
                    display: true,
                    drawOnChartArea: true,
                    drawTicks: true,
                    color: 'rgb(64, 64, 64)'
                }
            },
            xAxes: [
                {
                    display: true,
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                }
            ],
            yAxes: [
                {
                    id: '1y',
                    type: 'linear',
                    position: 'left',
                    display: true,
                    ticks: {
                        reverse: other.reverse,
                        beginAtZero: other.startzero
                    },
                }, {
                    id: '2y',
                    type: 'linear',
                    position: 'right',
                    display: showSecondAxis,
                    ticks: {
                        reverse: secondReverse,
                        beginAtZero: other.startzero
                    },
                }
            ]
        },
        plugins: {
            backgroundImageUrl: other?.imgUrl ?? 'https://github.com/sbrstrkkdwmdr/sbrstrkkdwmdr/blob/main/blank.jpg?raw=true',
            // customCanvasBackgroundColor: {
            //     color: 'rgba(64, 64, 64, 25)',
            // }
        },
    };
    // const plugin = {
    //     id: 'customCanvasBackgroundColor',
    //     beforeDraw: (chart, args, options) => {
    //         const { ctx } = chart;
    //         ctx.save();
    //         ctx.globalCompositeOperation = 'destination-over';
    //         ctx.fillStyle = options.color || '#99ffff';
    //         ctx.fillRect(0, 0, chart.width, chart.height);
    //         ctx.restore();
    //     }
    // };


    if (other?.type == 'bar') {
        cfgopts['elements'] = {
            backgroundColor: other.lineColour ?? 'rgb(101, 101, 135)',
            borderColor: other?.barOutline ? 'rgb(255, 255, 255)' : other.lineColour ?? 'rgb(101, 101, 135)',
            borderWidth: 2
        };
    }
    if (other?.type == 'bar' && other?.stacked == true) {
        for (const elem of cfgopts['scales']['xAxes']) {
            elem['stacked'] = other.stacked ?? false;
        }
        for (const elem of cfgopts['scales']['yAxes']) {
            elem['stacked'] = other.stacked ?? false;
        }
    }
    const chart = new charttoimg()
        .setConfig({
            type: other?.type ?? 'line',
            data: {
                labels: curx,
                datasets: datasets
            },
            options: cfgopts,
            // plugins: [plugin]
        });

    chart.setBackgroundColor('rgb(255,255,255)').setWidth(1500).setHeight(500);
    const filename = `${(new Date).getTime()}`;
    let curt = `${path}/cache/graphs/${filename}.jpg`;
    try {
        await chart.toFile(curt);
    } catch (err) {
        console.log(err);
        curt = `${precomppath}/files/blank_graph.png`;
    }

    return {
        path: curt,
        filename
    };
}

export function censorConfig(config: extypes.config) {
    return {
        "important": {
            "token": "CENSORED",
            "osuClientID": "CENSORED",
            "osuClientSecret": "CENSORED",
            "osuApiKey": "CENSORED",
        },
        "prefix": config.prefix,
        "ownerusers": [
            `${config?.ownerusers?.length} users`
        ],
        "google": {
            "apiKey": "CENSORED",
            "engineId": "CENSORED"
        },
        "useScreenshotParse": config.useScreenshotParse,
        "LogApiCalls": config.LogApiCalls,
        "LogApiCallsToFile": config.LogApiCallsToFile,
        "enableTracking": config.enableTracking,
        "storeCommandLogs": config.storeCommandLogs,
        "useEmojis": config.useEmojis
    } as extypes.config;
}

/**
 * remove all bits after the "?" in a url
 */
export function removeURLparams(url: string) {
    if (url.includes('?')) {
        return url.split('?')[0];
    }
    return url;
}

/**
 * sort list by closest match to input
 */
export function searchMatch(input: string, list: string[]) {
    const sort: {
        factor: number,
        text: string;
    }[] = [];
    for (const word of list) {
        let tempFactor = 0;
        //if length match add 1
        if (input.length == word.length) {
            tempFactor += 1;
        }
        //for each letter in the word that is found in the word, add 1, dont repeat
        const tempArr = word.split('');
        const tempArrIn = input.split('');
        for (let i = 0; i < tempArr.length; i++) {
            for (let j = 0; j < tempArrIn.length; j++) {
                if (tempArr[i] == tempArrIn[j]) {
                    tempFactor += 1;
                    tempArr.splice(tempArr.indexOf(tempArr[i]), 1);
                    tempArrIn.splice(tempArrIn.indexOf(tempArrIn[j]), 1);
                }
            }
        }
        //for each letter with same pos add 1, dont repeat
        for (let i = 0; i < input.length; i++) {
            if (input.trim().toLowerCase().charAt(i) == word.trim().toLowerCase().charAt(i)) {
                tempFactor += 2;
            }
        }
        if (word.trim().toLowerCase().includes(input.trim().toLowerCase()) || input.trim().toLowerCase().includes(word.trim().toLowerCase())) {
            tempFactor += 4;
        }
        const tempWordArr = word.split(' ');
        word.includes(' ') ? word.split(' ') : [word];
        const tempWordArrIn = input.split(' ');
        input.includes(' ') ? input.split(' ') : [input];
        for (const sub of tempWordArr) {
            if (tempWordArrIn.includes(sub)) {
                tempFactor += 3;
                tempWordArrIn.splice(tempWordArrIn.indexOf(sub), 1);
            }
        }

        if (word.trim().toLowerCase() == input.trim().toLowerCase()) {
            tempFactor += 1e10;
        }
        sort.push({ factor: tempFactor, text: word });
    }
    sort.sort((a, b) => b.factor - a.factor);
    return sort.map(x => x.text);
}

/**
 * remove duplicate elements from an array
 */
export function removeDupes(arr: any[]) {
    return arr.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
}

/**
 * times formatted as yyyy-mm-ddThh:mm
 */
export function timeForGraph(times: string[]) {
    const reformattedTimes: string[] = [];
    for (const time of times) {
        if (time.includes('T')) {
            if (time.includes('00:00')) {
                reformattedTimes.push(time.split('T')[0]);

            } else {
                reformattedTimes.push(time.split('T')[1]);
            }
        } else {
            reformattedTimes.push(time);
        }
    }
    return reformattedTimes;
}

//thanks chatgpt
export function formatHours(arr: string[]) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return "";
    }

    arr = arr.map(time => time.trim()).sort();
    const formattedHours = [];
    let startHour = arr[0];
    let endHour = arr[0];

    for (let i = 1; i < arr.length; i++) {
        const currentHour = arr[i];
        const previousHour = arr[i - 1];

        const currentTimestamp = new Date(`2000-01-01T${currentHour}:00`).getTime();
        const previousTimestamp = new Date(`2000-01-01T${previousHour}:00`).getTime();

        if (currentTimestamp - previousTimestamp === 3600000) {
            endHour = currentHour;
        } else {
            formattedHours.push(startHour === endHour ? startHour : `${startHour} - ${endHour}`);
            startHour = endHour = currentHour;
        }
    }

    formattedHours.push(startHour === endHour ? startHour : `${startHour} - ${endHour}`);

    return formattedHours.join(", ");
}

/**
 * replaces special characters such as "&" with their unicode form to not ruin api requests
 */
export function fixSearchInURL(search: string) {
    return encodeURIComponent(search);
}

export async function getCountryData(search: string, type: othertypes.countryDataSearchTypes, config) {
    let baseURL = `https://restcountries.com/v3.1/`;
    search = encodeURI(search);
    switch (type) {
        case 'all':
            baseURL += `all`;
            break;
        case 'name': case 'fullname':
            baseURL += `name/${search}`;
            if (type == 'fullname') {
                baseURL += `?fullText=true`;
            }
            break;
        case 'calling': //not yet supported in v3 as of 2023-11-15
            baseURL += `all`;
            break;
        case 'capital':
        case 'currency':
        case 'demonym':
        case 'language':
        case 'region':
        case 'subregion':
        case 'translation':
            baseURL += `${type}/${search}`;
            break;
        case 'code':
            baseURL += `alpha/${search}`;
            break;
        case 'codes':
            baseURL += `alpha?codes=${search}`;
            break;
    }
    log.toOutput(baseURL, config);
    const data = await axios.get(baseURL);
    return data;
}

export function dateToDiscordFormat(date: Date, type?: 'R' | 'F') {
    return `<t:${Math.floor(date.getTime() / 1000)}:${type ?? 'R'}>`;
}

export function ubitflagsAsName(flags: Discord.UserFlagsBitField) {
    console.log(flags);
    const fl = flags.toArray();
    console.log(fl);
    return 'aa';
}

export function userbitflagsToEmoji(flags: Discord.UserFlagsBitField) {
    const temp = flags.toArray();
    const tempMap = temp.map(x => emojis.discord.flags[x]);
    const newArr: string[] = [];
    for (let i = 0; i < temp.length; i++) {
        let a = '';
        if (!tempMap[i] || tempMap[i].length == 0) {
            a = temp[i];
        } else {
            a = tempMap[i];
        }
        newArr.push(a);
    }
    return newArr;
}

export function jankenConvert(str: string) {
    let out = 'INVALID';
    switch (str) {
        case 'paper': case 'p': case '✂': case 'パー':
            out = 'paper';
            break;
        case 'scissors': case 's': case '📃': case 'チョキ':
            out = 'scissors';
            break;
        case 'rock': case 'r': case '🪨': case 'グー':
            out = 'rock';
            break;
    }
    return out;
}