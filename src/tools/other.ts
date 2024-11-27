import * as canvas from 'canvas';
// @ts-expect-error thinks this file (other.ts) is commonjs so i cant import ecmascript bffr
import * as chartjs from 'chart.js/auto';
import Discord from 'discord.js';
import fs from 'fs';
import * as osuclasses from 'osu-classes';
import * as osuparsers from 'osu-parsers';
import Sequelize from 'sequelize';
import * as helper from '../helper.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';
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

export function debug(data: any, type: string, name: string, serverId: string | number, params: string) {
    const pars = params.replaceAll(',', '=');
    if (!fs.existsSync(`${helper.vars.path.main}/cache/debug/${type}`)) {
        fs.mkdirSync(`${helper.vars.path.main}/cache/debug/${type}`);
    }
    if (!fs.existsSync(`${helper.vars.path.main}/cache/debug/${type}/${name}/`)) {
        fs.mkdirSync(`${helper.vars.path.main}/cache/debug/${type}/${name}`);
    }
    try {
        if (data?.input?.config) {
            data.helper.vars.config = helper.tools.other.censorConfig();
        }
        fs.writeFileSync(`${helper.vars.path.main}/cache/debug/${type}/${name}/${pars}_${serverId}.json`, JSON.stringify(data, null, 2));
    } catch (error) {
    }
    return;
}

export function modeValidator(mode: string | number) {
    let returnf: apitypes.GameMode = 'osu';
    switch (mode) {
        case 0: case 'osu': default: case 'o': case 'std': case 'standard':
            returnf = 'osu';
            break;
        case 1: case 'taiko': case 't': case 'drums':
            returnf = 'taiko';
            break;
        case 2: case 'fruits': case 'f': case 'c': case 'ctb': case 'catch': case 'catch the beat': case 'catchthebeat':
            returnf = 'fruits';
            break;
        case 3: case 'mania': case 'm': case 'piano': case 'key': case 'keys':
            returnf = 'mania';
            break;
    }
    return returnf;
}

export function modeValidatorAlt(mode: string | number) {
    let returnf: apitypes.GameMode = 'osu';

    if (typeof mode == 'number') {
        switch (mode) {
            case 0: default:
                returnf = 'osu';
                break;
            case 1:
                returnf = 'taiko';
                break;
            case 2:
                returnf = 'fruits';
                break;
            case 3:
                returnf = 'mania';
                break;
        }
    } else if (typeof mode == 'string') {
        switch (mode) {
            case 'osu': default: case 'o': case 'std': case 'standard':
                returnf = 'osu';
                break;
            case 'taiko': case 't': case 'drums':
                returnf = 'taiko';
                break;
            case 'fruits': case 'f': case 'c': case 'ctb': case 'catch': case 'catch the beat': case 'catchthebeat':
                returnf = 'fruits';
                break;
            case 'mania': case 'm': case 'piano': case 'key': case 'keys':
                returnf = 'mania';
                break;
        }
    }

    const included = [
        0, 'osu', 'o', 'std', 'standard',
        1, 'taiko', 't', 'drums',
        2, 'fruits', 'f', 'c', 'ctb', 'catch', 'catch the beat', 'catchthebeat',
        3, 'mania', 'm', 'piano', 'key', 'keys'
    ];

    let isincluded = true;
    if (!included.includes(mode)) {
        isincluded = false;
    }

    return {
        mode: returnf,
        isincluded
    };
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
 * filters array by search. 
 * 
 * returns array with items that include the search string
 */
export function filterSearchArray(arr: string[], search: string) {
    return arr.filter((el) => el.toLowerCase().includes(search.toLowerCase()));
}

export function censorConfig() {
    return {
        "token": "!!!",
        "osu": {
            "clientId": "!!!",
            "clientSecret": "!!!"
        },
        "prefix": "!!!",
        "owners": ["!!!"],
        "tenorKey": "!!!",
        "enableTracking": null,
        "logs": null
    };
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
    }[],
    highlightPoints?: number[],
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

    let curx: (string | number)[] = [];
    let cury: number[] = [];

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
    type dataset = {
        label: string,
        data: number[];
        fill: boolean,
        borderColor: string | ((colour) => string),
        borderWidth: number,
        pointRadius: number,
        yAxisID: string,
    };

    const datasets: dataset[] = [{
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
                const nHSV = helper.tools.colourcalc.rgbToHsv(101, 101, 135);
                const newclr = helper.tools.colourcalc.hsvToRgb(nHSV.h + (diff * i), nHSV.s, nHSV.v);
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

    // if (highlightPoints && highlightPoints.length > 0) {
    //     datasets[0].borderColor = (colour) => {
    //         console.log(colour.index);
    //         return highlightPoints.includes(colour.index) ?
    //             'rgb(255, 106, 0)' :
    //             other.lineColour ?? 'rgb(101, 101, 135)';
    //     };
    // }

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
    };

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

    const tc = canvas.createCanvas(1500, 500);
    const ctx = tc.getContext("2d");
    const image = new canvas.Image();

    const chart = new chartjs.Chart(ctx, {
        type: other?.type ?? 'line',
        data: {
            labels: curx,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'rgb(128, 128, 128)',
                        backdropColor: 'rgb(128, 128, 128)',
                        callback: function (value, index, values) {
                            // if (highlightPoints && highlightPoints.includes(index)) {
                            //     this.backgroundColor = 'rgb(128, 128, 128)';
                            // }
                            // this.backgroundColor = 'rgb(255, 0, 0)';
                            return '';
                        }
                    },
                    grid: {
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: true,
                        color: 'rgb(64, 64, 64)'
                    }
                },
                y: {
                    position: 'left',
                    reverse: other.reverse,
                    beginAtZero: other.startzero,
                    ticks: {
                        color: 'rgb(128, 128, 128)',
                        // beginAtZero: other.startzero
                    },
                    grid: {
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: true,
                        color: 'rgb(64, 64, 64)'
                    }
                },
                y1: {
                    position: 'right',
                    display: showSecondAxis,
                    reverse: secondReverse,
                    ticks: {
                        // beginAtZero: other.startzero,
                    },
                }
                // xAxes: [
                //     {
                //         display: true,
                //         ticks: {
                //             autoSkip: true,
                //             maxTicksLimit: 10
                //         },
                //     }
                // ],
                // yAxes: [
                //     {
                //         id: '1y',
                //         type: 'linear',
                //         position: 'left',
                //         display: true,
                //         ticks: {
                //             reverse: other.reverse,
                //             beginAtZero: other.startzero
                //         },
                //     }, {
                //         id: '2y',
                //         type: 'linear',
                //         position: 'right',
                //         display: showSecondAxis,
                //         ticks: {
                //             reverse: secondReverse,
                //             beginAtZero: other.startzero
                //         },
                //     }
                // ]
            },
        },
        plugins: [{
            id: 'customImage',
            beforeDraw: (chart) => {
                // console.log(chart.chartArea);
            }
        }]
    });

    // issue - background image covers chart
    // await new Promise(resolve => {
    //     image.onload = function () {
    //         const {
    //             top,
    //             left,
    //             width,
    //             height
    //         } = chart.chartArea;
    //         const x = left + width - image.width;
    //         const y = top + height - image.height;
    //         ctx.drawImage(image, x, y);
    //         resolve(null);
    //     };
    //     image.src = other?.imgUrl ?? 'https://github.com/sbrstrkkdwmdr/sbrstrkkdwmdr/blob/main/blank.jpg?raw=true';
    // })

    const filename = `${(new Date).getTime()}`;
    let curt = `${helper.vars.path.main}/cache/graphs/${filename}.jpg`;
    try {
        const buffer = tc.toBuffer();
        fs.writeFileSync(curt, buffer);
    } catch (err) {
        helper.tools.log.stdout(err);
        curt = `${helper.vars.path.precomp}/files/blank_graph.png`;
    }

    return {
        path: curt,
        filename
    };
}

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

export function ubitflagsAsName(flags: Discord.UserFlagsBitField) {
    helper.tools.log.stdout(flags);
    const fl = flags.toArray();
    helper.tools.log.stdout(fl);
    return 'aa';
}

export function userbitflagsToEmoji(flags: Discord.UserFlagsBitField) {
    const temp = flags.toArray();
    const tempMap = temp.map(x => helper.vars.emojis.discord.flags[x]);
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

export function scoreIsComplete(
    mode: apitypes.GameMode,
    obj: apitypes.Statistics,
    circles: number,
    sliders: number,
    spinners: number,
) {
    let total = 0;
    switch (mode) {
        case 'osu': default:
            total = obj.count_300 + obj.count_100 + obj.count_50 + obj.count_miss;
            break;
        case 'taiko':
            total = obj.count_300 + obj.count_100 + obj.count_miss;
            break;
        case 'fruits':
            total = obj.count_300 + obj.count_100 + obj.count_50 + obj.count_miss;
            break;
        case 'mania':
            total = obj.count_geki + obj.count_300 + obj.count_katu + obj.count_100 + obj.count_50 + obj.count_miss;
            break;
    }
    return {
        passed: total == circles + sliders + spinners,
        objectsHit: total,
        percentage: Math.abs(total / (circles + sliders + spinners)) * 100
    };
}

export function filterScoreQuery(scores: apitypes.Score[], search: string) {
    return scores.filter((score) =>
        (
            score.beatmapset.title.toLowerCase().replaceAll(' ', '')
            +
            score.beatmapset.artist.toLowerCase().replaceAll(' ', '')
            +
            score.beatmap.version.toLowerCase().replaceAll(' ', '')
        ).includes(search.toLowerCase().replaceAll(' ', ''))
        ||
        score.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(search.toLowerCase().replaceAll(' ', ''))
        ||
        score.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(search.toLowerCase().replaceAll(' ', ''))
        ||
        score.beatmap.version.toLowerCase().replaceAll(' ', '').includes(search.toLowerCase().replaceAll(' ', ''))
        ||
        search.toLowerCase().replaceAll(' ', '').includes(score.beatmapset.title.toLowerCase().replaceAll(' ', ''))
        ||
        search.toLowerCase().replaceAll(' ', '').includes(score.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
        ||
        search.toLowerCase().replaceAll(' ', '').includes(score.beatmap.version.toLowerCase().replaceAll(' ', ''))
    );
}

export async function getFailPoint(
    objectsPassed: number,
    mapPath: string,
) {
    let time = 1000;
    if (fs.existsSync(mapPath)) {
        try {
            const decoder = new osuparsers.BeatmapDecoder();
            const beatmap = await decoder.decodeFromPath(mapPath, false) as any as osuclasses.Beatmap;
            if (objectsPassed == null || objectsPassed < 1) {
                objectsPassed = 1;
            }
            const objectOfFail = beatmap.hitObjects[objectsPassed - 1];
            time = objectOfFail.startTime;
        } catch (error) {

        }
    } else {
        helper.tools.log.stdout("Path does not exist:" + mapPath);
    }
    return time;
}
// checks if code is a valid iso 3166-1 alpha-2 code
export function validCountryCodeA2(code: string) {
    return helper.vars.iso._3166_1_alpha2.some(x => x == code.toUpperCase());
}