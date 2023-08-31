import charttoimg from 'chartjs-to-image';
import fs from 'fs';
import fetch from 'node-fetch';
import * as osuparsers from 'osu-parsers';
import * as replayparser from 'osureplayparser';
import perf from 'perf_hooks';
import rosu from 'rosu-pp';
import Sequelize from 'sequelize';
import * as stats from 'simple-statistics';
import * as msgfunc from '../commands/msgfunc.js';
import { path, precomppath } from '../path.js';
import * as calc from './calc.js';
import * as cmdchecks from './checks.js';
import * as emojis from './consts/emojis.js';
import * as errors from './consts/errors.js';
import * as mainconst from './consts/main.js';
import * as tools from './func.js';
import * as log from './log.js';
import * as mapParser from './mapParser.js';
import * as osumodcalc from './osumodcalc.js';
import * as extypes from './types/extratypes.js';
import * as osuApiTypes from './types/osuApiTypes.js';
import * as osuparsertypes from './types/osuparsertypes.js';
/* module.exports = {
    modemods, modemappers
} */

export type calcScore = {
    mode?: rosu.GameMode;
    mods?: number;
    acc?: number;
    n300?: number;
    n100?: number;
    n50?: number;
    nMisses?: number;
    nKatu?: number;
    combo?: number;
    score?: number;
    passedObjects?: number;
    clockRate?: number;
    ar?: number;
    cs?: number;
    hp?: number;
    od?: number;
};


/**
 * 
 * @param mods 
 * @param gamemode 
 * @param mapid 
 * @param calctype 0 = rosu, 1 = booba, 2 = osu api extended
 * @param clockRate modify map speed. uses mods if null
 * @returns 
 */
export async function mapcalc(
    obj: {
        mods: string,
        gamemode: string,
        mapid: number,
        calctype: number | null,
        clockRate: number | null,
        customCS?: number,
        customAR?: number,
        customOD?: number,
        customHP?: number,
        maxLimit?: number,
    },
    lastUpdated: Date,
    config: extypes.config,
) {
    let ppl: rosu.PerformanceAttributes[];

    if (!obj.maxLimit || isNaN(obj.maxLimit) || obj.maxLimit < 1) {
        obj.maxLimit = 10;
    }

    switch (obj.calctype) {
        case 0: default: {
            if (!fs.existsSync('files/maps/')) {
                fs.mkdirSync('files/maps/');
            }
            const mapPath = await dlMap(obj.mapid, 0, lastUpdated, config);

            if (!(typeof mapPath == 'string')) {
                return mapPath;
            }

            const mods = obj.mods == null || obj.mods.length < 1 ? 'NM' : obj.mods;

            const map = new rosu.Beatmap({
                path: mapPath,
                cs: obj.customCS
            });
            if (obj.customCS) {
                map.cs(obj.customCS);
            }
            if (obj.customAR) {
                map.ar(obj.customAR);
            }
            if (obj.customOD) {
                map.od(obj.customOD);
            }
            if (obj.customHP) {
                map.hp(obj.customHP);
            }

            ppl = [];

            for (let i = 0; i < obj.maxLimit; i++) {
                ppl.push((
                    new rosu.Calculator({
                        mode: osumodcalc.ModeNameToInt(obj.gamemode),
                        mods: osumodcalc.ModStringToInt(mods),
                        clockRate: obj.clockRate ?? 1,
                        acc: 100 - i
                    })
                ).performance(map)
                );
            }
        }
            break;
        case 1:
            break;
        case 2:
            break;
    }
    return ppl;
}

/**
 * 
 * @param obj.mods 
 * @param obj.gamemode 
 * @param obj.mapid 
 * @param obj.hitgeki 
 * @param obj.hit300 
 * @param obj.hitkatu 
 * @param obj.hit100 
 * @param obj.hit50 
 * @param obj.miss 
 * @param obj.acc accuracy (IN DECIMAL) 88.64% acc = 0.8864
 * @param obj.maxcombo 
 * @param obj.score 
 * @param obj.calctype 0 = rosu, 1 = booba, 2 = osu api extended
 * @param obj.passedObj number of objects hit
 * @param obj.failed whether the score is failed or not
 * @returns 
 */
export async function scorecalc(
    obj: {
        mods: string, gamemode: string, mapid: number,
        hitgeki?: number | null, hit300?: number | null, hitkatu?: number | null, hit100?: number | null, hit50?: number | null, miss: number | null,
        acc: number | null, maxcombo?: number | null, score?: number | null,
        calctype?: number | null, passedObj?: number | null, failed?: boolean | null,
        clockRate?: number | null,
    },
    lastUpdated: Date,
    config: extypes.config,
) {
    let ppl: rosu.PerformanceAttributes[];

    if (obj.clockRate == null) {
        obj.clockRate = 1;
    }
    if (obj.mods.includes('DT') || obj.mods.includes('NC')) {
        obj.clockRate = 1.5;
    }
    if (obj.mods.includes('HT')) {
        obj.clockRate = 0.75;
    }


    switch (obj.calctype) {
        case 0: default:
            {
                if (!fs.existsSync('files/maps/')) {
                    console.log('creating files/maps/');
                    fs.mkdirSync('files/maps/');
                }
                const mapPath = await dlMap(obj.mapid, 0, lastUpdated, config);


                if (!(typeof mapPath == 'string')) {
                    return mapPath;
                }

                const map = new rosu.Beatmap({
                    path: mapPath
                });

                const mods =
                    obj.mods ?
                        obj.mods.length < 1 ? 'NM' : obj.mods
                        : 'NM'
                    ;
                let mode;
                let newacc = osumodcalc.calcgrade(obj.hit300, obj.hit100, obj.hit50, 0).accuracy;
                if (obj.hit300 && obj.hit100) {
                    switch (obj.gamemode) {
                        case 'osu': default:
                            mode = 0;
                            if (obj.hit50) {
                                osumodcalc.calcgrade(obj.hit300, obj.hit100, obj.hit50, 0).accuracy;
                            } else {
                                newacc = obj.acc;
                            }
                            break;
                        case 'taiko':
                            mode = 1;
                            newacc = osumodcalc.calcgradeTaiko(obj.hit300, obj.hit100, 0).accuracy;
                            break;
                        case 'fruits':
                            mode = 2;
                            if (obj.hit50) {
                                newacc = osumodcalc.calcgradeCatch(obj.hit300, obj.hit100, obj.hit50, 0, obj.hitkatu).accuracy;
                            } else {
                                newacc = obj.acc;
                            }
                            break;
                        case 'mania':
                            mode = 3;
                            if (obj.hitgeki && obj.hitkatu && obj.hit50) {
                                newacc = osumodcalc.calcgradeMania(obj.hitgeki, obj.hit300, obj.hitkatu, obj.hit100, obj.hit50, 0).accuracy;
                            } else {
                                newacc = obj.acc;
                            }
                            break;
                    }
                } else {
                    newacc = obj.acc;
                    switch (obj.gamemode) {
                        case 'osu': default:
                            mode = 0;
                            break;
                        case 'taiko':
                            mode = 1;
                            break;
                        case 'fruits':
                            mode = 2;
                            break;
                        case 'mania':
                            mode = 3;
                            break;
                    }
                }
                if (isNaN(newacc)) {
                    newacc = obj.acc * 100;
                }
                if (newacc == 0) {
                    newacc = 100;
                }
                if (newacc <= 1) {
                    newacc *= 100;
                }

                const baseScore: calcScore = {
                    mode,
                    mods: osumodcalc.ModStringToInt(mods),
                    combo: obj.maxcombo,
                    acc: obj?.acc ? obj.acc * 100 : 100,
                    passedObjects: obj.passedObj,
                    clockRate: obj.clockRate ?? 1,
                };

                if (obj.hit300 != null && !isNaN(obj.hit300)) {
                    baseScore.n300 = obj.hit300;
                }
                if (obj.hit100 != null && !isNaN(obj.hit100)) {
                    baseScore.n100 = obj.hit100;
                }
                if (obj.hit50 != null && !isNaN(obj.hit50)) {
                    baseScore.n50 = obj.hit50;
                }
                if (obj.miss != null && !isNaN(obj.miss)) {
                    baseScore.nMisses = obj.miss;
                }
                if (obj.hitkatu != null && !isNaN(obj.hitkatu)) {
                    baseScore.nKatu = obj.hitkatu;
                }

                ppl = [
                    new rosu.Calculator(baseScore).performance(map),
                    new rosu.Calculator({
                        mode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: newacc,
                        clockRate: obj.clockRate ?? 1,
                    }).performance(map),
                    new rosu.Calculator({
                        mode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 100,
                        clockRate: obj.clockRate ?? 1,
                        nMisses: 0,
                    }).performance(map)
                ];


            }
            break;
        case 2: //osu api extended
            break;
    }
    return ppl;

}

/**
 * 
 * @param mapid 
 * @param mods 
 * @param calctype 
 * @param mode 
 * @returns the strains of a beatmap. times given in milliseconds
 */
export async function straincalc(mapid: number, mods: string, calctype: number, mode: osuApiTypes.GameMode, lastUpdated: Date, config: extypes.config,) {
    let strains;
    switch (calctype) {
        case 0: default: {
            const mapPath = await dlMap(mapid, 0, lastUpdated, config);

            if (!(typeof mapPath == 'string')) {
                return mapPath;
            }

            let strains1 =
                new rosu.Calculator({
                    mods: osumodcalc.ModStringToInt(mods)
                }).strains(new rosu.Beatmap({ path: mapPath }));

            switch (mode) {
                case 'osu': {
                    strains1 = strains1 as rosu.OsuStrains;
                    const straintimes = [];
                    const totalval = [];

                    for (let i = 0; i < strains1.aim.length; i++) {
                        const offset = i;
                        const curval = strains1.aim[offset] + strains1.aimNoSliders[offset] + strains1.speed[offset] + strains1.flashlight[offset];
                        totalval.push(curval);

                        const curtime = ((strains1.sectionLength / 1000) * (i + 1));
                        const curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + Math.floor(curtime % 60) : Math.floor(curtime % 60)}`;
                        straintimes.push(curtimestr);
                    }
                    strains = {
                        strainTime: straintimes,
                        value: totalval,
                    };
                }
                    break;
                case 'taiko': {
                    strains1 = strains1 as rosu.TaikoStrains;
                    const straintimes = [];
                    const totalval = [];

                    for (let i = 0; i < strains1.stamina.length; i++) {
                        const offset = i;
                        const curval = strains1.color[offset] + strains1.rhythm[offset] + strains1.stamina[offset];
                        totalval.push(curval);

                        const curtime = ((strains1.sectionLength / 1000) * (i + 1));
                        const curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + Math.floor(curtime % 60) : Math.floor(curtime % 60)}`;
                        straintimes.push(curtimestr);
                    }
                    strains = {
                        strainTime: straintimes,
                        value: totalval,
                    };
                }
                    break;
                case 'fruits': {
                    strains1 = strains1 as rosu.CatchStrains;
                    const straintimes = [];
                    const totalval = [];

                    for (let i = 0; i < strains1.movement.length; i++) {
                        const offset = i;
                        const curval = strains1.movement[offset];
                        totalval.push(curval);

                        const curtime = ((strains1.sectionLength / 1000) * (i + 1));
                        const curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + Math.floor(curtime % 60) : Math.floor(curtime % 60)}`;
                        straintimes.push(curtimestr);
                    }
                    strains = {
                        strainTime: straintimes,
                        value: totalval,
                    };
                }
                    break;
                case 'mania': {
                    strains1 = strains1 as rosu.ManiaStrains;
                    const straintimes = [];
                    const totalval = [];

                    for (let i = 0; i < strains1.strains.length; i++) {
                        const offset = i;
                        const curval = strains1.strains[offset];
                        totalval.push(curval);

                        const curtime = ((strains1.sectionLength / 1000) * (i + 1));
                        const curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + Math.floor(curtime % 60) : Math.floor(curtime % 60)}`;
                        straintimes.push(curtimestr);
                    }
                    strains = {
                        strainTime: straintimes,
                        value: totalval,
                    };
                }
                    break;
            }
            break;
        }



            break;
    }
    return strains;

}

/**
 * 
 * @param mapid 
 * @param mods 
 * @param calctype 
 * @param mode 
 * @returns the strains of a beatmap. times given in milliseconds
 */
export async function straincalclocal(path: string | null, mods: string, calctype: number, mode: string) {
    if (path == null) {
        path = `${path}/files/tempdiff.osu`;
    }
    let strains;
    switch (calctype) {
        case 0: default:
            switch (mode) {
                case 'osu': {
                    const strains1 = JSON.parse(JSON.stringify(
                        new rosu.Calculator({
                            mods: osumodcalc.ModStringToInt(mods)
                        }).strains(new rosu.Beatmap({ path })), null, 2));
                    const aimval = strains1.aim;
                    const aimnoslideval = strains1.aimNoSliders;
                    const speedval = strains1.speed;
                    const flashlightval = strains1.flashlight;
                    const straintimes = [];
                    const totalval = [];


                    for (let i = 0; i < aimval.length; i++) {
                        const offset = i;
                        const curval = aimval[offset] + aimnoslideval[offset] + speedval[offset] + flashlightval[offset];
                        totalval.push(curval);

                        const curtime = ((strains1.section_length / 1000) * (i + 1));
                        const curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + (curtime % 60).toFixed(2) : (curtime % 60).toFixed(2)}`;
                        straintimes.push(curtimestr);
                    }
                    strains = {
                        strainTime: straintimes,
                        value: totalval,
                    };
                }
                    break;
            }



            break;
    }
    return strains;

}
/**
 * 
 * @param x 
 * @param y 
 * @param label name of graph
 * @param startzero whether or not graph starts at zero
 * @param reverse y-value goes up or down (useful for rank graphs)
 * @param showlabelx show names of x axes
 * @param showlabely show names of y axes
 * @param fill fill under the line
 * @param settingsoverride override the given settings
 * @param displayLegend whether or not to display the legend
 * @param secondY second set of data
 * @param secondYlabel label for second set of data
 * @returns path to the graph
 */
export async function graph(x: number[] | string[], y: number[], label: string, startzero?: boolean | null, reverse?: boolean | null, showlabelx?: boolean | null, showlabely?: boolean | null, fill?: boolean | null, settingsoverride?: overrideGraph | null, displayLegend?: boolean, secondY?: number[], secondLabel?: string) {

    if (startzero == null || typeof startzero == 'undefined') {
        startzero = true;
    }
    if (reverse == null || typeof reverse == 'undefined') {
        reverse = false;
    }
    if (showlabelx == null || typeof showlabelx == 'undefined') {
        showlabelx = false;
    }
    if (showlabely == null || typeof showlabely == 'undefined') {
        showlabely = false;
    }
    if (fill == null || typeof fill == 'undefined') {
        fill = false;
    }
    if (displayLegend == null || displayLegend == undefined || typeof displayLegend == 'undefined') {
        displayLegend = false;
    }
    let type = 'line';
    switch (settingsoverride) {
        case 'replay':
            showlabely = true;
            break;
        case 'rank':
            reverse = true;
            startzero = false;
            showlabely = true;
            break;
        case 'strains':
            fill = true;
            showlabely = true;
            showlabelx = true;
            startzero = true;
            displayLegend = true;
            break;
        case 'bar':
            type = 'bar';
            showlabely = true;
            displayLegend = true;
            break;
        case 'health':
            showlabely = true;
            fill = false;
            startzero = true;
            break;
        default:
            break;
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
    const datasets = [{
        label: label,
        data: cury,
        fill: fill,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        pointRadius: 0
    }];
    if (!(secondY == null || secondY == undefined)) {
        datasets.push({
            label: secondLabel,
            data: secondY,
            fill: fill,
            borderColor: 'rgb(255, 0, 0)',
            borderWidth: 1,
            pointRadius: 0
        });
    }
    const chart = new charttoimg()
        .setConfig({
            type: type,
            data: {
                labels: curx,
                datasets: datasets
            },
            options: {
                legend: {
                    display: displayLegend
                },
                scales: {
                    xAxes: [
                        {
                            display: showlabelx,
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: showlabely,
                            type: 'linear',
                            ticks: {
                                reverse: reverse,
                                beginAtZero: startzero
                            },
                        }
                    ]
                }
            }
        });
    chart.setBackgroundColor('color: rgb(0,0,0)').setWidth(750).setHeight(250);

    const filename = `${(new Date).getTime()}`;
    const curt = `${path}/cache/graphs/${filename}.jpg`;

    await chart.toFile(curt);

    return {
        path: curt,
        filename
    };
}

export async function failGraph(
    mapdata: {
        x: [],
        y: [],
    },
    point: {
        time: number,
        objectNumber: number,
    }
) {

    let curx = [];
    let cury = [];

    if (mapdata.y.length > 200) {
        const div = mapdata.y.length / 200;
        for (let i = 0; i < 200; i++) {
            const offset = Math.ceil(i * div);
            const curval = mapdata.y[offset];
            cury.push(curval);
            curx.push(mapdata.x[offset]);
        }
    } else {
        curx = mapdata.x;
        cury = mapdata.y;
    }

    const datasets = [{
        label: '',
        data: cury,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        pointRadius: 0
    }];

    const chart = new charttoimg()
        .setConfig({
            type: 'line',
            data: {
                labels: curx,
                datasets: datasets
            },
            options: {
                legend: {
                    display: false
                },
                elements: {
                    point: {
                        radius: customRadius,
                        display: true,
                    }
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10
                            }
                        }
                    ],
                    yAxes: [
                        {
                            display: false,
                            type: 'linear',
                            ticks: {
                                reverse: false,
                                beginAtZero: true
                            },
                        }
                    ]
                }
            }
        });

    function customRadius(context) {
        const index = context.dataIndex;
        const value = context.dataset.data[index];
        return index === point.objectNumber || value >= 8 ?
            10 : 0;
    }

    chart.setBackgroundColor('color: rgb(0,0,0)').setWidth(750).setHeight(250);

    const curt = `${path}/cache/graphs/${(new Date).getTime()}.jpg`;

    await chart.toFile(curt);

    return curt;
}

type overrideGraph = 'replay' | 'rank' | 'strains' | 'bar' | 'health';

/**
 * 
 * @param mods 
 * @param gamemode 
 * @param mapid 
 * @param calctype 0 = rosu, 1 = booba, 2 = osu api extended
 * @returns 
 */
export async function mapcalclocal(
    mods: string, gamemode: string, path: string | null,
    calctype: number | null,
) {
    let ppl: rosu.PerformanceAttributes[];
    let mapscore;

    if (path == null) {
        path = `files/tempdiff.osu`;
    }

    switch (calctype) {
        case 0: default:

            ppl = [];
            for (let i = 0; i < 10; i++) {
                ppl.push((
                    new rosu.Calculator({
                        mode: osumodcalc.ModeNameToInt(gamemode),
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 100 - i
                    })
                ).performance(new rosu.Beatmap({ path }))
                );
            }
            break;
        case 1:
            break;
        case 2:
            break;
    }
    return ppl;
}

/**
 * @param url url used in the api call
 * @param totaltimeNum total time taken in seconds 
 * @param input input to the api call 
 * @param apiData data returned from the api call
 * @param error error returned from the api call
 */
export type apiReturn = {
    url: string,
    totaltimeNum: number,
    input: apiInput,
    apiData: any,
    error?: Error,
};

/**
 * @param url url used in the api call
 * @param totaltimeNum total time taken in seconds 
 * @param input input to the api call 
 * @param apiData data returned from the api call
 * @param error error returned from the api call
 */
export type apiReturnOT = {
    url: string,
    totaltimeNum: number,
    input: any,
    apiData: any,
    error?: Error,
};

/**
 * @param type type of api call to make
 * @param params params to pass to the api call
 * @param params.username username to get data for
 * @param params.id map id or score id
 * @param params.md5 map md5 hash string
 * @param params.searchString if using search, the string to search for
 * @param params.mode osu gamemode
 * @param params.category map category
 * @param params.opts options to pass to the api call. formnat as ['x=y', 'x=y']                                        
 * @param params.urlOverride force api call to use this url and ignore other params
 * @param version 1 or 2. defaults to 2
 * @param callNum number of times this function has been called (used for recursion/error handling)
 * @param ignoreNonAlphaChar if true, will ignore non-alphanumeric characters in the username. Otherwise, they will be converted to hexadecimals */
export type apiInput = {
    type: apiGetStrings,
    params: {
        username?: string,
        userid?: string | number,
        id?: string | number,
        md5?: string,
        searchString?: string,
        mode?: osuApiTypes.GameMode,
        category?: string,
        mods?: string,
        opts?: string[],
        urlOverride?: string;
    },
    config: extypes.config,
    version?: number,
    callNum?: number,
    ignoreNonAlphaChar?: boolean,
};
/**
 * @param input - see apiInput
 * @returns apiReturn
 * @property url
 * @property
 */
export async function apiget(input: apiInput) {
    if (!input.callNum) input.callNum = 0;

    const baseurl = 'https://osu.ppy.sh/api';
    const accessN = fs.readFileSync(`${path}/config/osuauth.json`, 'utf-8');
    let access_token;
    try {
        access_token = JSON.parse(accessN).access_token;
    } catch (error) {
        access_token = '';
    }
    const key = input.config.osuApiKey;
    if (!input.version) {
        input.version = 2;
    }
    let url = `${baseurl}/v${input.version}/`;

    switch (input.version) {
        case 1: {
            url = `${baseurl}/`;
            switch (input.type) {
                case 'scores_get_map':
                    url += `get_scores?k=${key}&b=${input.params.id}&mods=${osumodcalc.ModStringToInt(input.params.mods)}&limit=100`;
                    break;
            }
        }

        case 2: {
            switch (input.type) {
                case 'custom':
                    url += `${input.params.urlOverride}`;
                    break;
                case 'map_get': case 'map':
                    url += `beatmaps/${input.params.id}`;
                    break;
                case 'map_get_md5':
                    url += `beatmaps/lookup?checksum=${input.params.md5}`;
                    break;
                case 'mapset_get': case 'mapset':
                    url += `beatmapsets/${input.params.id}`;
                    break;
                case 'mapset_search':
                    url += `beatmapsets/search?q=${input.params.searchString}`;
                    break;
                case 'score_get': case 'score':
                    url += `scores/${input.params.mode ?? 'osu'}/${input.params.id}`;
                    break;
                case 'scores_get_best': case 'osutop': case 'best':
                    url += `users/${input.params.username ?? input.params.userid}/scores/best?mode=${input.params.mode ?? 'osu'}`;
                    break;
                case 'scores_get_first': case 'firsts':
                    url += `users/${input.params.username ?? input.params.userid}/scores/firsts?mode=${input.params.mode ?? 'osu'}`;
                    break;
                case 'firsts_alt':
                    url += `users/${input.params.username ?? input.params.userid}/scores/firsts?limit=100`;
                    break;
                case 'scores_get_map': case 'maplb':
                    url += `beatmaps/${input.params.id}/scores?mode=${input.params.mode ?? 'osu'}`;
                    break;
                case 'scores_get_pinned': case 'pinned':
                    url += `users/${input.params.username ?? input.params.userid}/scores/pinned?mode=${input.params.mode ?? 'osu'}`;
                    break;
                case 'pinned_alt':
                    url += `users/${input.params.username ?? input.params.userid}/scores/pinned?limit=100&${input.params}`;
                    break;
                case 'scores_get_recent': case 'recent':
                    url += `users/${input.params.username ?? input.params.userid}/scores/recent?mode=${input.params.mode ?? 'osu'}`;
                    break;
                case 'recent_alt':
                    url += `users/${input.params.username ?? input.params.userid}/scores/recent?limit=100`;
                    break;
                case 'user_get': case 'user':
                    url += `users/${input.params.username ?? input.params.userid}/${input.params.mode ?? 'osu'}`;
                    break;
                case 'user_get_most_played': case 'most_played':
                    url += `users/${input.params.username ?? input.params.userid}/beatmapsets/most_played`;
                    break;
                case 'user_get_scores_map':
                    url += `beatmaps/${input.params.id}/scores/users/${input.params.username ?? input.params.userid}/all`;
                    break;
                case 'user_get_maps':
                    url += `users/${input.params.username ?? input.params.userid}/beatmapsets/${input.params.category ?? 'favourite'}?limit=100`;
                    break;
                case 'user_get_maps_alt':
                    url += `users/${input.params.username ?? input.params.userid}/beatmapsets/${input.params.category ?? 'favourite'}&limit=100`;
                    break;
                case 'user_recent_activity':
                    url += `users/${input.params.username ?? input.params.userid}/recent_activity?limit=100`;
                    break;
            }
        }
    }

    if (input.params.opts) {
        url = tools.appendUrlParamsString(url, input.params.opts);
        // const urlSplit = url.split('/')[url.split('/').length - 1];

        // if (urlSplit.includes('?')) {
        //     url += `&${input.params.opts.join('&')}`;
        // } else {
        //     url += `?${input.params.opts.join('&')}`;
        // }
    }

    if (input.callNum > 3) {
        return {
            url,
            input,
            totaltimeNum: NaN,
            apiData: {
                error: 'Too many calls made to the api'
            },
        };
    }

    let data: apiReturn = {
        url: null,
        totaltimeNum: null,
        input: input,
        apiData: null,
    };
    let datafirst;
    const before = perf.performance.now();
    try {
        if (mainconst.isTesting) {
            datafirst = apigetOffline(input);
        } else {
            datafirst = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }).then(res => res.json());
            log.toOutput(url, input.config);
        }
    } catch (error) {
        data = {
            url,
            input,
            totaltimeNum: perf.performance.now() - before,
            apiData: datafirst,
            error
        };
        fs.writeFileSync(`${path}\\cache\\errors\\osuapiV${input.version ?? 2}${Date.now()}.json`, JSON.stringify(data, null, 2));
    }
    const after = perf.performance.now();
    try {
        if (datafirst?.authentication) {
            await updateToken(input.config);
            input.callNum ? input.callNum = input.callNum + 1 : input.callNum = 1;
            datafirst = await apiget(input);

        }
        if ('error' in datafirst && !input.type.includes('search')) {
            throw new Error(errors.apiError);
        }
        data = {
            url,
            input,
            totaltimeNum: after - before,
            apiData: datafirst
        };
    } catch (error) {
        data = {
            url,
            input,
            totaltimeNum: after - before,
            apiData: datafirst,
            error: error ?? 'Unknown error'
        };
        fs.writeFileSync(`${path}\\cache\\errors\\osuapiV${input.version ?? 2}${Date.now()}.json`, JSON.stringify(data, null, 2));
    }

    if (data?.apiData?.apiData) {
        data = data?.apiData;
    }
    return data;
}

export async function apigetOT(input: {
    param: {
        type: 'countries_all' | 'countries_limitedAll' | 'countries_number' |
        'country_users' | 'country_details' | 'country_stats' | 'country_topplayers' | 'country_plays' | 'country_short' |
        'users_all' | 'users_limitedAll' | 'users_number' | 'users_top' |
        'user_details' | 'user_stats' | 'user_plays' | 'user_id' | 'user_name' |
        'stats_all' | 'stats_commonSets' | 'stats_HistoricTop',
        country?: string,
        id?: string | number,
        name?: string,
        else?: string,
    };
    callNum: number;
}) {
    let baseurl = 'https://osutracker.com/api';
    type apiReturn = null;

    if (!input.callNum) {
        input.callNum = 0;
    }

    switch (input.param.type) {
        case 'countries_all': //returns => (interface Country + extras)[]
            baseurl += `/countries/all`;
            break;
        case 'countries_limitedAll': //returns => (interface Country)[]
            baseurl += `/countries/limitedAll`;
            break;
        case 'countries_number': //returns => type number
            baseurl += `/countries/number`;
            break;
        case 'country_details': //returns => interface Country
            baseurl += `/countries/${input.param.country ?? input.param.name}/details`;
            break;
        case 'country_plays': //returns interface CountryPlays[]
            baseurl += `/countries/${input.param.country ?? input.param.name}/plays`;
            break;
        case 'country_short': //returns type string
            baseurl += `/countries/${input.param.else}`;
            break;
        case 'country_stats': //returns => interface interface CountryStat[]
            baseurl += `/countries/${input.param.country ?? input.param.name}/stats`;
            break;
        case 'country_topplayers': //returns interface countryPlayers[]
            baseurl += `/countries/${input.param.else}/players`;
            break;
        case 'country_users': //returns {data:any[], numberResults:number}
            baseurl += `/countries/allFilter/${input.param.country ?? input.param.name}`;
            break;
        case 'users_all': //returns (interface User + extras)[]
            baseurl += `/users/all`;
            break;
        case 'users_limitedAll': //returns interface User[]
            baseurl += `/users/limitedAll`;
            break;
        case 'users_number': //returns type number
            baseurl += `/users/number`;
            break;
        case 'users_top': //returns 
            baseurl += `/users/topUserIds`;
            break;
        case 'user_details'://returns 
            baseurl += `/users/${input.param.id}`;
            break;
        case 'user_id'://returns 
            baseurl += `/users/${input.param.name}/getId`;
            break;
        case 'user_name'://returns 
            baseurl += `/users/${input.param.id}/getName`;
            break;
        case 'user_plays'://returns 
            baseurl += `/users/${input.param.id}/plays`;
            break;
        case 'user_stats'://returns 
            baseurl += `/users/${input.param.id}/stats`;
            break;
        case 'stats_all'://returns 
            baseurl += `/stats/`;
            break;
        case 'stats_commonSets'://returns 
            baseurl += `/stats/farmSets`;
            break;
        case 'stats_HistoricTop'://returns 
            baseurl += `/stats/historicTop`;
            break;
    }

    let data: apiReturnOT = {
        url: baseurl,
        totaltimeNum: null,
        input: input,
        apiData: null
    };

    let datafirst;

    const before = perf.performance.now();
    try {
        datafirst = await fetch(baseurl, {
        }).then(res => res.json());
    } catch (error) {
        data = {
            url: baseurl,
            input,
            totaltimeNum: perf.performance.now() - before,
            apiData: datafirst,
            error
        };
        fs.writeFileSync(`${path}/cache/err_osutrackerapi${Date.now()}.json`, JSON.stringify(data, null, 2));
    }
    const after = perf.performance.now();
    try {
        if ('error' in datafirst) {
            throw new Error('nullwww');
        }
        data = {
            url: baseurl,
            input,
            totaltimeNum: after - before,
            apiData: datafirst
        };
    } catch (error) {
        data = {
            url: baseurl,
            input,
            totaltimeNum: after - before,
            apiData: datafirst,
            error
        };
        fs.writeFileSync(`${path}/cache/errr_osutrackerapi${Date.now()}.json`, JSON.stringify(data, null, 2));
    }

    if (data.apiData.apiData) {
        data = data.apiData;
    }
    return data;
}



export async function updateToken(config: extypes.config) {
    const clientId = config.osuClientID;
    const clientSecret = config.osuClientSecret;
    const newtoken: osuApiTypes.OAuth = await fetch('https://osu.ppy.sh/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
        ,
        body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'public'
        })

    }).then(res => res.json() as any)
        .catch(error => {
            fs.appendFileSync(`logs/updates.log`,
                `
    ----------------------------------------------------
    ERROR
    node-fetch error: ${error}
    ----------------------------------------------------
    `, 'utf-8');
        });
    if (newtoken.access_token) {
        fs.writeFileSync(`${path}/config/osuauth.json`, JSON.stringify(newtoken));
        fs.appendFileSync(`${path}/logs/updates.log`, '\nosu auth token updated at ' + new Date().toLocaleString() + '\n');
    }
    log.toOutput('Update token: https://osu.ppy.sh/oauth/token', config);
}

// export function log.toOutput(data: string, title?: string) {
//     if (config.LogApiCalls == true) {
//         console.log((title ? title : 'Api call') + ': ' + data);
//     }
//     if (config.LogApiCallsToFile == true) {
//         fs.appendFileSync(`${path}/logs/console.log`, `${(title ? title : 'Api call') + ': ' + data}\n`);
//     }
//     return;
// }

export async function updateUserStats(user: osuApiTypes.User, mode: string, sqlDatabase: any) {
    const allUsers = await sqlDatabase.findAll();

    let findname;
    try {
        findname = allUsers.find((u: extypes.dbUser) => u.osuname.toLowerCase() == user.username.toLowerCase());
    } catch (error) {

    }
    if (findname == null) {
        findname = allUsers.find((u: extypes.dbUser) => `${u.osuname}`.toLowerCase() == `${user.id}`.toLowerCase());
    }
    if (findname != null) {
        switch (mode) {
            case 'osu':
            default:
                {

                    await sqlDatabase.update({
                        osupp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                        osurank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                        osuacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0,
                    }, {
                        where: { osuname: findname.dataValues.osuname }
                    });
                }
                break;
            case 'taiko':
                await sqlDatabase.update({
                    taikopp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                    taikorank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                    taikoacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                }, {
                    where: { osuname: findname.dataValues.osuname }
                });
                break;
            case 'fruits':
                await sqlDatabase.update({
                    fruitspp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                    fruitsrank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                    fruitsacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                }, {
                    where: { osuname: findname.dataValues.osuname }
                });
                break;
            case 'mania':
                await sqlDatabase.update({
                    maniapp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                    maniarank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                    maniaacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                }, {
                    where: { osuname: findname.dataValues.osuname }
                });
                break;
        }
    }
    return;
}

export async function getUser(username: string, config: extypes.config) {
    return await apiget({
        type: 'user',
        params: {
            username
        },
        config,
        // url: `https://osu.ppy.sh/api/v2/users/${username}`,
    });
    //apiget('user_get', username);
}

export type apiGetStringsDep =
    'custom' |

    'map_search' |
    'map_get' | 'map' |
    'map_get_md5' |
    'mapset_get' | 'mapset' |
    'mapset_search' |

    'score_get' | 'score' |
    'scores_get_best' | 'osutop' | 'best' | 'osutop_alt' |
    'scores_get_first' | 'firsts' | 'firsts_alt' |
    'scores_get_pinned' | 'pinned' | 'pinned_alt' |
    'scores_get_recent' | 'recent' | 'recent_alt' |
    'scores_get_map' | 'maplb' |

    'user_get' | 'user' |
    'user_get_most_played' | 'most_played' |
    'user_get_scores_map' |
    'user_get_maps' | 'user_get_maps_alt';


export type apiGetStrings =
    //custom
    'custom' |
    'map_get' | 'map' | //beatmap
    'map_get_md5' | //beatmap_lookup
    'mapset_get' | 'mapset' | //beatmapset
    'mapset_search' | //beatmapset search
    'score_get' | //score
    'scores_get_best' | 'osutop' | 'best' | 'osutop_alt' | //user scores best
    'scores_get_first' | 'firsts' | 'firsts_alt' | //user scores first
    'scores_get_pinned' | 'pinned' | 'pinned_alt' | //user scores pinned
    'scores_get_recent' | 'recent' | 'recent_alt' | //user scores recent
    'scores_get_map' | 'maplb' | //scores map
    'user_get' | //user
    'user_get_most_played' | 'most_played' | //user most played
    'user_get_scores_map' | //user scores map
    'user_get_maps' | 'user_get_maps_alt' | //user maps

    //beatmaps
    'beatmap_lookup' | //returns Beatmap
    'beatmap_user_score' | //returns BeatmapUserScore
    'beatmap_user_scores' | //returns Score[]
    'beatmap_scores' | //returns BeatmapScores (CHANGING)
    'beatmaps' | //returns Beatmap[]
    'beatmap' | //returns Beatmap
    'beatmap_attributes' | //returns DifficultyAttributes
    'beatmapset_discussion_posts' | //returns (WIP)
    'beatmapset_discussion_votes' | //returns (WIP)
    'beatmapset_discussions' | //returns (WIP)
    'beatmaps_solo_scores' | //(UNDOCUMENTED) (LAZER ONLY) 
    'beatmaps_solo_scores_token' | //(UNDOCUMENTED) (LAZER ONLY)
    'beatmapset_events' | //returns (UNDOCUMENTED) (WIP)
    'beatmapset_favourites' | //returns (UNDOCUMENTED) (LAZER ONLY)
    'beatmapset_search' | //returns (UNDOCUMENTED)
    'beatmapset_lookup' | //returns Beatmapset (UNDOCUMENTED)
    'beatmapset' | //returns Beatmapset (UNDOCUMENTED)


    //changelog
    'changelog_build' | //returns Build
    'changelog_listing' | //returns {Build[],search{from?:string,limit:number,max_id?:number,stream?:string,to?:string},streams:UpdateStream[]}
    'changelog_build_lookup' | //returns Build (???)

    //chat
    'chat_tdl' |

    //comments
    'comments_tdl' |

    //forums
    'forum_tdl' |

    //home
    'home_tdl' |

    //multiplayer
    'multiplayer_tdl' |

    //news
    'news_tdl' |

    //notifications
    'notifications_tdl' |

    //oauth
    'oauth_tdl' |

    //rankings
    'rankings' | //returns Rankings
    'spotlights' | //returns Spotlights

    //score
    'score' | //returns Score (UNDOCUMENTED)
    'score_download' | //returns `.osr` file (UNDOCUMENTED)

    //users
    'me' | //returns User
    'kudosu' | //returns KudosuHistory[]
    'user_scores' | //returns Score[]
    'user_beatmaps' | //returns Beatmap[] or BeatmapPlaycount[]
    'user_recent_activity' | //returns Event[]
    'user' | //returns User
    'users' | //returns UserCompact[]

    //wiki
    'wiki_tdl' |

    //Websocket
    'notification_connection' |
    'notification_connection_logout' |
    'notification_connection_new' |
    'notification_connection_read';


export async function searchUser(searchid: string, userdata: any, findMode: boolean) {
    const findname = await userdata.findOne({ where: { userid: searchid ?? '0' } });
    let user;
    let errorValue;
    let mode;
    if (findname != null) {
        user = findname.get('osuname');
        errorValue = null;
        if (findMode == true) {
            mode = findname.get('mode');
            if (mode.length < 1 || mode == null) {
                mode = 'osu';
            }
        } else {
            mode = 'osu';
        }
        if (typeof user != 'string') {
            errorValue = 'Username is incorrect type';
        }
    } else {
        user = null;
        mode = 'osu';
        errorValue = `no user found with id ${searchid}`;
    }
    const object = {
        username: user,
        gamemode: mode,
        error: errorValue,
    };
    return object;
}

/**
 * similar to searchUser, but it returns ALL data values (excluding pp,acc,rank)
 */
export async function searchUserFull(searchid: string, userdata: any) {
    const findname = await userdata.findOne({ where: { userid: searchid ?? '0' } });
    let user;
    let mode;
    let tz;
    let skin;
    let errorValue;
    let location;
    if (findname != null) {
        user = findname.get('osuname');
        errorValue = null;
        mode = findname.get('mode');
        tz = findname.get('timezone');
        location = findname.get('location');
        skin = findname.get('skin');
        if (mode.length < 1 || mode == null) {
            mode = 'osu';
        }
        if (typeof user != 'string') {
            errorValue = 'Username is incorrect type';
        }
    } else {
        user = null;
        mode = 'osu';
        tz = null;
        skin = null;
        errorValue = `no user found with id ${searchid}`;
    }
    const object = {
        username: user,
        gamemode: mode,
        tz,
        skin,
        location,
        error: errorValue,
    };
    return object;
}

export function getPreviousId(type: 'map' | 'user' | 'score', serverId: string) {
    try {
        const init = JSON.parse(fs.readFileSync(`${path}/cache/previous/${type}${serverId}.json`, 'utf-8')) as {
            id: string | false,
            apiData: object,
            mods: string,
            default: boolean,
        };
        return init;
    } catch (error) {
        const data: {
            id: string | false,
            apiData: object,
            mods: string;
            default: boolean,
        } = {
            id: false,
            apiData: null,
            mods: null,
            default: true,
        };

        /*         switch (type) {
                    case 'map':
                        data = {
                            id: '4204',
                            apiData: null,
                            mods: 'EZHDFL',
                            default: true,
                        };
                        break;
                    case 'user':
                        data = {
                            id: '2',
                            apiData: null,
                            mods: null,
                            default: true,
                        };
                        break;
                    case 'score':
                        data = {
                            id: null,
                            apiData: JSON.parse(fs.readFileSync(`${precomppath}\\src\\template\\score.json`, 'utf-8')),
                            mods: null,
                            default: true,
                        };
                        break;
                } */

        fs.writeFileSync(`${path}/cache/previous/${type}${serverId}.json`, JSON.stringify(data, null, 2));
        return data;
    }
}
export function writePreviousId(type: 'map' | 'user' | 'score', serverId: string, data: {
    id: string,
    apiData: object,
    mods: string,
    default?: boolean;
}) {
    if (!data.mods || data.mods.length == 0) {
        data.mods = 'NM';
    }
    data['default'] = false;

    fs.writeFileSync(`${path}/cache/previous/${type}${serverId}.json`, JSON.stringify(data, null, 2));
    return;
}

export function debug(data: any, type: string, name: string, serverId: string | number, params: string) {
    const pars = params.replaceAll(',', '=');
    if (!fs.existsSync(`${path}/cache/debug/${type}`)) {
        fs.mkdirSync(`${path}/cache/debug/${type}`);
    }
    if (!fs.existsSync(`${path}/cache/debug/${type}/${name}/`)) {
        fs.mkdirSync(`${path}/cache/debug/${type}/${name}`);
    }
    try {
        fs.writeFileSync(`${path}/cache/debug/${type}/${name}/${pars}_${serverId}.json`, JSON.stringify(data, null, 2));
    } catch (error) {
    }
    return;
}

export function matchScores(initScore: osuApiTypes.Score, scoreList: osuApiTypes.Score[]) {
    //filter out so scores are only from the same map
    const mapScores = scoreList.slice().filter(score => score.beatmap.id == initScore.beatmap.id);

    //filter out so scores are only from the same user
    const userScores = mapScores.slice().filter(score => score.user.id == initScore.user.id);

    //filter out so scores are only from the same gamemode
    const modeScores = userScores.slice().filter(score => score.mode == initScore.mode);

    //filter out so scores are only from the same mods (excluding HD, SO, NF, TD)
    let modScores = modeScores.slice().filter(score => score.mods == initScore.mods);

    let filteredMods = initScore.mods.join('').replace('NC', 'DT').split(/.{1,2}/g);

    if (initScore.mods.includes('HD') || initScore.mods.includes('SO') || initScore.mods.includes('NF') || initScore.mods.includes('TD') || initScore.mods.includes('SD') || initScore.mods.includes('PF')) {
        filteredMods = initScore.mods.join('').replace('HD', '').replace('SO', '').replace('NF', '').replace('TD', '').replace('SD', '').replace('PF', '').split(/.{1,2}/g);
    }

    modScores = modScores.slice().filter(score => score.mods.join('').replace('NC', 'DT').split(/.{1,2}/g).sort().join('') == filteredMods.sort().join(''));

    if (initScore.mods.length == 0) {
        modScores = modeScores.slice().filter(score => score.mods.length == 0);
    }

    return modScores;
}

export function getMapImages(mapSetId: string | number) {

    return {
        //smaller res of full/raw
        thumbnail: `https://b.ppy.sh/thumb/${mapSetId}l.jpg`,
        thumbnailLarge: `https://b.ppy.sh/thumb/${mapSetId}l.jpg`,

        //full res of map bg
        full: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/fullsize.jpg`,
        raw: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/raw.jpg`,

        //same width but shorter height
        cover: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/cover.jpg`,
        cover2x: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/cover@2x.jpg`,

        //smaller ver of cover
        card: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/card.jpg`,
        card2x: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/card@2x.jpg`,

        //square
        list: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/list.jpg`,
        list2x: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/list@2x.jpg`,

        //shorter height ver of cover
        slimcover: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/slimcover.jpg`,
        slimcover2x: `https://assets.ppy.sh/beatmaps/${mapSetId}/covers/slimcover@2x.jpg`,

    };
}

/**
 * 
 * @param mapid - map id
 * @param isRanked ranked status - ranked, loved, approved, pending, graveyard
 * @param curCall - start at 0
 * @returns 
 */
export async function dlMap(mapid: number | string, curCall: number, lastUpdated: Date, config: extypes.config) {
    const mapFiles = fs.readdirSync(`${path}/files/maps`);
    let isFound = false;
    let mapDir = '';
    if (mapFiles.some(x => x.includes(`${mapid}`)) == false) {
        const url = `https://osu.ppy.sh/osu/${mapid}`;
        const thispath = `${path}/files/maps/${mapid}.osu`;
        mapDir = thispath;
        if (!fs.existsSync(thispath)) {
            fs.mkdirSync(`${path}/files/maps/`, { recursive: true });
        }
        const writer = fs.createWriteStream(thispath);
        const res = await fetch(url);
        log.toOutput(`Beatmap file download: ${url}`, config);
        res.body.pipe(writer);
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('w');
            }, 1000);
        });
        log.toOutput(`Saved file: ${mapDir.replace(`${path}/`, '')}`, config);
    } else {
        for (let i = 0; i < mapFiles.length; i++) {
            const curmap = mapFiles[i];
            if (curmap.includes(`${mapid}`)) {
                mapDir = `${path}/files/maps/${curmap}`;
            }
        }
        isFound = true;
        log.toOutput(`Found file: ${mapDir.replace(`${path}/`, '')}`, config);
    }
    const fileStat = fs.statSync(mapDir);
    if (fileStat.size < 500) {
        await fs.unlinkSync(mapDir);
        if (!curCall) {
            curCall = 0;
        }
        if (curCall > 3) {
            throw new Error('Map file size is too small. Deleting file...');
        } else {
            return await dlMap(mapid, curCall + 1, lastUpdated, config);
        }
    }
    if (fileStat.birthtimeMs < lastUpdated.getTime() && isFound == true) {
        await fs.unlinkSync(mapDir);
        return await dlMap(mapid, curCall + 1, lastUpdated, config);
    }
    return mapDir;
}

export function mapStatus(map: osuApiTypes.Beatmapset | osuApiTypes.Beatmap) {
    if (map.ranked > 0 && map.ranked != 3) return true;
}

/**
 * 
 * @param index starts from 0
 * @returns 
 */
export function findWeight(index: number) {
    if (index > 99 || index < 0) return 0;
    return (0.95 ** (index));
}

export function rawToWeighted(pp: number, index: number) {
    return pp * (findWeight(index));
}

/**
 * OLD VERSION
 */
export async function getRankPerformanceOld(type: 'pp->rank' | 'rank->pp', value: number, mode: osuApiTypes.GameMode,
    statsCache: Sequelize.ModelStatic<any>, useRegr?: boolean) {
    const users = await statsCache.findAll();
    const pprankarr: { pp: string, rank: string; }[] = [];

    for (let i = 0; i < users.length; i++) {
        const curuser = users[i].dataValues;
        switch (mode) {
            case 'osu': default:
                if (typeof curuser.osupp == 'undefined' || !curuser.osupp) break;
                if (typeof curuser.osurank == 'undefined' || !curuser.osurank) break;
                pprankarr.push({
                    pp: curuser.osupp,
                    rank: curuser.osurank
                });
                break;
            case 'taiko':
                if (typeof curuser.taikopp == 'undefined' || !curuser.taikopp) break;
                if (typeof curuser.taikorank == 'undefined' || !curuser.taikorank) break;
                pprankarr.push({
                    pp: curuser.taikopp,
                    rank: curuser.taikorank
                });
                break;
            case 'fruits':
                if (typeof curuser.fruitspp == 'undefined' || !curuser.fruitspp) break;
                if (typeof curuser.fruitsrank == 'undefined' || !curuser.fruitsrank) break;
                pprankarr.push({
                    pp: curuser.fruitspp,
                    rank: curuser.fruitsrank
                });
                break;
            case 'mania':
                if (typeof curuser.maniapp == 'undefined' || !curuser.maniapp) break;
                if (typeof curuser.maniarank == 'undefined' || !curuser.maniarank) break;
                pprankarr.push({
                    pp: curuser.maniapp,
                    rank: curuser.maniarank
                });
                break;
        }
    }

    //sort by pp
    pprankarr.sort((a, b) => parseFloat(b.pp) - parseFloat(a.pp));

    let returnval: number;

    if (useRegr) {
        let redo: number[][] = [];
        switch (type) {
            case 'pp->rank':
                redo = pprankarr.map(x => [+x.pp, +x.rank]);
                break;
            case 'rank->pp':
                redo = pprankarr.map(x => [+x.rank, +x.pp]);
                break;
        }
        const regress = stats.linearRegressionLine(stats.linearRegression(redo));
        returnval = regress(value);
    } else {
        switch (type) {
            case 'pp->rank': {
                pprankarr.push({ pp: `${value}`, rank: `${0}` });
                pprankarr.sort((a, b) => parseFloat(b.pp) - parseFloat(a.pp));

                /** val = 4503
                 *  3000, 68987
                 *  6000, 22
                 * 1000, 500000
                 * 
                 * 4503, null
                 */

                /**
                 * 6000, 22
                 * 4503, null
                 * 3000, 68987  
                 * 1000, 500000
                 * 
                 */

                //get position
                const pos = pprankarr.findIndex(e => parseFloat(e.pp) == value && e.rank == '0');

                const prev = pprankarr[pos - 1];

                const next = pprankarr[pos + 1];
                //estimate rank
                if (typeof prev == 'undefined' && typeof next != 'undefined') {
                    returnval = parseInt(next.rank);
                }
                else if (typeof next == 'undefined' && typeof prev != 'undefined') {
                    returnval = parseInt(prev.rank);
                } else {
                    // returnval = prev.rank + ((next.rank - prev.rank) / (next.pp - prev.pp)) * (value - prev.pp)
                    returnval = (parseInt(prev.rank) + parseInt(next.rank)) / 2;
                }
                if (typeof prev == 'undefined' && typeof next == 'undefined') {
                    returnval = null;
                }
            }
                break;
            case 'rank->pp': {
                pprankarr.push({ pp: '0', rank: `${value}` });
                pprankarr.sort((a, b) => parseInt(a.rank) - parseInt(b.rank));
                const pos = pprankarr.findIndex(e => parseInt(e.rank) == value && e.pp == '0');
                const prev = pprankarr[pos - 1];
                const next = pprankarr[pos + 1];

                //estimate pp
                if (typeof prev == 'undefined' && typeof next != 'undefined') {
                    returnval = parseInt(next.pp);
                }
                else if (typeof next == 'undefined' && typeof prev != 'undefined') {
                    returnval = parseInt(prev.pp);
                } else {
                    // returnval = prev.pp + ((next.pp - prev.pp) / (next.rank - prev.rank)) * (value - prev.rank)
                    returnval = (parseFloat(prev.pp) + parseFloat(next.pp)) / 2;
                }
                if (typeof prev == 'undefined' && typeof next == 'undefined') {
                    returnval = null;
                }

            }
                break;
        }
    }
    return returnval;
}

export async function getRankPerformance(type: 'pp->rank' | 'rank->pp', value: number, mode: osuApiTypes.GameMode,
    statsCache: Sequelize.ModelStatic<any>,) {
    const users = await statsCache.findAll();
    let pprankarr: { pp: number, rank: number; }[] = [];
    for (let i = 0; i < users.length; i++) {
        const curuser = users[i].dataValues;
        if (!(isNaN(+curuser[`${mode ?? 'osu'}pp`]) || typeof curuser[`${mode ?? 'osu'}pp`] == 'undefined' || !curuser[`${mode ?? 'osu'}pp`] ||
            isNaN(+curuser[`${mode ?? 'osu'}rank`]) || typeof curuser[`${mode ?? 'osu'}rank`] == 'undefined' || !curuser[`${mode ?? 'osu'}rank`]
            //||   +curuser[`${mode ?? 'osu'}rank`] < 5
        )) {
            pprankarr.push({
                pp: +curuser[`${mode ?? 'osu'}pp`],
                rank: +curuser[`${mode ?? 'osu'}rank`]
            });
        }
    }
    let data: number[][] = [];
    //find if a value is in the dataset then use it otherwise use predict
    const tempChecking = pprankarr.filter((x) => {
        switch (type) {
            case 'pp->rank': {
                //pp within 10
                return (calc.isWithinPercentage(+x.pp, +x.pp * 0.000001, +value) || calc.isWithinValue(+x.pp, 1, +value)) ?? false;
            } break;
            case 'rank->pp': {
                //rank within 1%
                return calc.isWithinPercentage(+x.rank, 1, +value) ?? false;
            } break;
        }
    });
    if (tempChecking.length > 0) {
        const rankData = Stats(tempChecking.map(x => x.rank));
        const ppData = Stats(tempChecking.map(x => x.pp));
        switch (type) {
            case 'pp->rank': {
                return rankData.median ?? rankData.mean;
            } break;
            case 'rank->pp': {
                return ppData.median ?? ppData.mean;
            } break;
        }
    }
    pprankarr = pprankarr.filter(x => x.rank > 5);
    switch (type) {
        case 'pp->rank': {
            data = pprankarr.map(x => [x.pp, Math.log10(x.rank)]);
            const line = stats.linearRegressionLine(stats.linearRegression(data));
            return (10 ** line(value));
            //log y
        }
            break;
        case 'rank->pp': {
            data = pprankarr.map(x => [Math.log10(x.rank), x.pp]);
            const line = stats.linearRegressionLine(stats.linearRegression(data));
            return line(Math.log10(value));
            //log x
        }
            break;
    }
}

export function modeValidator(mode: string | number) {
    let returnf: osuApiTypes.GameMode = 'osu';

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
    return returnf;
}

export function modeValidatorAlt(mode: string | number) {
    let returnf: osuApiTypes.GameMode = 'osu';

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

export async function userStatsCache(user: osuApiTypes.UserStatistics[] | osuApiTypes.User[], database: Sequelize.ModelStatic<any>, mode: osuApiTypes.GameMode, type: 'Stat' | 'User') {
    await (async () => {
        switch (type) {
            case 'Stat': {
                user = user as osuApiTypes.UserStatistics[];
                for (let i = 0; i < user.length; i++) {
                    const curuser = user[i];
                    if (!(curuser?.pp || !curuser?.global_rank)) {
                        break;
                    }
                    let findname = await database.findOne({
                        where: {
                            osuid: curuser.user.id
                        }
                    });
                    if (findname == Promise<{ pending; }>) {
                        findname = null;
                    }
                    if (typeof findname == 'undefined' || !findname) {
                        await database.create({
                            osuid: curuser.user.id,
                            country: curuser.user.country_code,
                            [mode + 'pp']: curuser.pp,
                            [mode + 'rank']: curuser.global_rank,
                            [mode + 'acc']: curuser.hit_accuracy
                        });
                    } else {
                        await database.update({
                            [mode + 'pp']: curuser.pp,
                            [mode + 'rank']: curuser.global_rank,
                            [mode + 'acc']: curuser.hit_accuracy
                        },
                            {
                                where: { osuid: curuser.user.id }
                            });
                    }
                }
            } break;
            case 'User': {
                user = user as osuApiTypes.User[];
                for (let i = 0; i < user.length; i++) {
                    const curuser = user[i];
                    if (!(curuser?.statistics?.pp || !curuser?.statistics?.global_rank)) {
                        break;
                    }
                    let findname = await database.findOne({
                        where: {
                            osuid: curuser.id
                        }
                    });
                    if (findname == Promise<{ pending; }>) {
                        findname = null;
                    }

                    if (typeof findname == 'undefined' || !findname) {
                        await database.create({
                            osuid: `${curuser.id}`,
                            country: `${curuser.country_code}`,
                            [mode + 'pp']: `${curuser?.statistics?.pp ?? NaN}`,
                            [mode + 'rank']: `${curuser?.statistics?.global_rank ?? NaN}`,
                            [mode + 'acc']: `${curuser?.statistics?.hit_accuracy ?? NaN}`
                        });
                    } else {
                        await database.update({
                            [mode + 'pp']: `${curuser?.statistics?.pp ?? NaN}`,
                            [mode + 'rank']: `${curuser?.statistics?.global_rank ?? NaN}`,
                            [mode + 'acc']: `${curuser?.statistics?.hit_accuracy ?? NaN}`
                        },
                            {
                                where: { osuid: `${curuser.id}` }
                            });
                    }
                }
            } break;
        }
    })();
    try {
        await userStatsCacheFix(database, mode);
    } catch (error) {
    }
}

export async function userStatsCacheFix(database: Sequelize.ModelStatic<any>, mode: osuApiTypes.GameMode) {
    const users = await database.findAll();
    const actualusers: {
        pp: string,
        rank: string,
        acc: string,
        uid: string;
    }[] = [];
    for (let i = 0; i < users.length; i++) {
        const curuser = {
            pp: users[i].dataValues[`${mode}pp`],
            rank: users[i].dataValues[`${mode}rank`],
            acc: users[i].dataValues[`${mode}acc`],
            uid: users[i].dataValues.osuid
        };
        actualusers.push(curuser);
    }

    actualusers.sort((a, b) => (+b.pp) - (+a.pp));

    for (let i = 0; i < actualusers.length; i++) {
        const curuser = actualusers[i];
        let givenrank = curuser.rank;
        //if user doesn't have a rank, make it null
        if (typeof curuser.pp == 'undefined' || !curuser.pp) {
            givenrank = null;
        }
        await database.update({
            [`${mode}pp`]: curuser.pp,
            [`${mode}rank`]: givenrank,
            [`${mode}acc`]: curuser.acc,
        }, {
            where: { osuid: curuser.uid }
        });
    }
}

/**
 * checks url for beatmap id. if url given is just a number, then map id is the number
 * @param url the url to check
 * @param callIfMapIdNull if only set id is found, then send an api request to fetch the map id
 */
export async function mapIdFromLink(url: string, callIfMapIdNull: boolean, config: extypes.config) {

    if (url.includes(' ')) {
        const temp = url.split(' ');
        //get arg that has osu.ppy.sh
        for (let i = 0; i < temp.length; i++) {
            const curarg = temp[i];
            if (curarg.includes('osu.ppy.sh')) {
                url = curarg;
                break;
            }
        }
    }

    const object = {
        set: null,
        mode: null,
        map: null,
    };

    //patterns: 
    /**
     *
     * osu.ppy.sh/b/{map}
     * osu.ppy.sh/beatmaps/{map}
     * osu.ppy.sh/b/{map}?m={mode}
     * osu.ppy.sh/beatmaps/{map}?m={mode}
     * osu.ppy.sh/s/{set} //mapset
     * osu.ppy.sh/beatmapsets/{set}#{mode}/{map}
     * osu.ppy.sh/beatmapsets/{set}
     */

    switch (true) {
        case url.includes('?m='):
            object.mode = url.split('?m=')[1];
            object.map = url.split('?m=')[0];
            break;
        case url.includes('/b/'):
            object.map = url.split('/b/')[1];
            break;
        case url.includes('beatmaps/'):
            object.map = url.split('/beatmaps/')[1];
            break;
        case url.includes('beatmapsets') && url.includes('#'):
            object.set = url.split('beatmapsets/')[1].split('#')[0];
            object.mode = url.split('#')[1].split('/')[0];
            object.map = url.split('#')[1].split('/')[1];
            break;
        case url.includes('/s/'):
            object.set = url.split('/s/')[1];
            break;
        case url.includes('beatmapsets/'):
            object.set = url.split('/beatmapsets/')[1];
            break;
        case !isNaN(+url):
            object.map = url;
            break;
    }
    if (callIfMapIdNull && object.map == null) {
        const bmsdataReq = await apiget({
            type: 'mapset_get',
            params: {
                id: object.set
            },
            config
        });
        object.map = (bmsdataReq.apiData as osuApiTypes.Beatmapset)?.beatmaps?.[0]?.id ?? null;
    }
    return object;
}



/**
 * 
 * @param {*} arr array of scores
 * @returns most common mod combinations
 */
export function modemods(arr: osuApiTypes.Score[]) {
    return arr.sort((a, b) => //swap b and a to make it least common
        arr.filter(v => v.mods === a.mods).length
        - arr.filter(v => v.mods === b.mods).length
    ).pop();
}
/**
 * 
 * @param {*} arr array of scores
 * @returns most common mapper
 */
export function modemappers(arr: osuApiTypes.Score[]) {
    return arr.sort((a, b) => //swap b and a to make it least common
        arr.filter(v => v.beatmapset.creator === a.beatmapset.creator).length
        - arr.filter(v => v.beatmapset.creator === b.beatmapset.creator).length
    ).pop();
}

type stat = {
    highest: number,
    mean: number,
    lowest: number,
    median: number,
    ignored?: number,
    calculated?: number,
    total?: number,
};

/**
 * 
 * @param arr array of numbers
 * @returns stats
 */
export function Stats(arr: number[]) {
    const init = arr.slice();
    arr = arr.filter(x => x != null);
    arr.sort((a, b) => b - a);
    let median = 0;
    //if even, else
    if (arr.length % 2 == 1) {
        median = arr[Math.floor(arr.length / 2)];
    } else {
        const temp1 = arr[arr.length / 2];
        const temp2 = arr[(arr.length / 2) - 1];
        median = (temp1 + temp2) / 2;
    }

    const stats: stat = {
        highest: arr[0],
        mean: arr.reduce((b, a) => b + a, 0) / arr.length,
        lowest: arr[arr.length - 1],
        median: median,
        ignored: init.length - arr.length,
        calculated: arr.length,
        total: init.length,
    };
    return stats;
}

/**
 * 
 * @param arr array of scores
 * @returns mappers of scores in order of most common to least common, with percentage
 */
export function CommonMappers(arr: osuApiTypes.Score[]) {
    const mapperArray: {
        mapper: string,
        count: number,
        percentage: number;
    }[] = [];
    arr.forEach(score => {
        const mapper = score.beatmapset.creator;
        const mapperIndex = mapperArray.findIndex(x => x.mapper == mapper);
        if (mapperIndex == -1) {
            mapperArray.push({
                mapper,
                count: 1,
                percentage: 0
            });
        } else {
            mapperArray[mapperIndex].count++;
        }
    });
    mapperArray.sort((a, b) => b.count - a.count);
    mapperArray.forEach(x => x.percentage = (x.count / arr.length) * 100);
    return mapperArray;
}

export function CommonMods(arr: osuApiTypes.Score[]) {
    const modComboArray: {
        mods: string,
        count: number,
        percentage: number;
    }[] = [];
    arr.forEach(score => {
        const mods = score.mods.length != 0 ? score.mods.join('') : 'NM';
        const modComboIndex = modComboArray.findIndex(x => x.mods == mods);
        if (modComboIndex == -1) {
            modComboArray.push({
                mods,
                count: 1,
                percentage: 0
            });
        } else {
            modComboArray[modComboIndex].count++;
        }
    });
    modComboArray.sort((a, b) => b.count - a.count);
    modComboArray.forEach(x => x.percentage = (x.count / arr.length) * 100);
    return modComboArray;
}

export function ModToEmojis(mods: string[], canEmoji?: boolean) {
    if (canEmoji) {
        const modEmojis: string[] = [];
        for (let i = 0; i < mods.length; i++) {
            let current: string = '';
            //find
            current = emojis.mods[mods[i]];
            //push
            current ? modEmojis.push(current) : null;
        }
    } else {
        return mods;
    }
}

export function randomMap(type?: 'Ranked' | 'Loved' | 'Approved' | 'Qualified' | 'Pending' | 'WIP' | 'Graveyard') {
    let returnId = 4204;
    let errormsg = null;
    //check if cache exists
    const cache = fs.existsSync(`${path}\\cache\\commandData`);
    if (cache) {
        let mapsExist = fs.readdirSync(`${path}\\cache\\commandData`).filter(x => x.includes('mapdata'));
        const maps: apiReturn[] = [];
        if (type) {
            mapsExist = mapsExist.filter(x => x.includes(type));
        }

        for (let i = 0; i < mapsExist.length; i++) {
            if (mapsExist[i].includes('.json')) {
                const dataAsStr = fs.readFileSync(`${path}\\cache\\commandData\\${mapsExist[i]}`, 'utf-8');
                maps.push(JSON.parse(dataAsStr) as apiReturn);
            }
        }
        if (maps.length > 0) {
            try {
                const curmap = maps[Math.floor(Math.random() * maps.length)];
                returnId = curmap?.apiData?.id ?? 4204;
            } catch (error) {
                errormsg = `There was an error while trying to parse the map ID`;
            }
        } else {
            errormsg = `No ${type ?? ''} maps found`;
        }
    } else {
        errormsg = 'No maps found';
    }
    return {
        returnId,
        err: errormsg
    };
}

export function recommendMap(baseRating: number, maxDifference: number) {
    let returnId = 4204;
    let errormsg = null;
    //check if cache exists
    const cache = fs.existsSync(`${path}\\cache\\commandData`);
    if (cache) {
        const mapsExist = fs.readdirSync(`${path}\\cache\\commandData`).filter(x => x.includes('mapdata'));
        const maps: apiReturn[] = [];

        for (let i = 0; i < mapsExist.length; i++) {
            if (mapsExist[i].includes('.json')) {
                const dataAsStr = fs.readFileSync(`${path}\\cache\\commandData\\${mapsExist[i]}`, 'utf-8');
                maps.push(JSON.parse(dataAsStr) as apiReturn);
            }
        }

        const filteredMaps = maps.filter(x => (x?.apiData?.difficulty_rating > baseRating - maxDifference && x?.apiData?.difficulty_rating < baseRating + maxDifference));
        if (filteredMaps.length < 1) {
            errormsg =
                `No maps within ${maxDifference?.toFixed(2)}⭐ of ${baseRating}⭐ were found
total maps: ${maps.length}`;
        } else {
            try {
                const curmap = filteredMaps[Math.floor(Math.random() * filteredMaps.length)];
                returnId = curmap?.apiData?.id;
            } catch (error) {
                errormsg = `There was an error while trying to parse the map ID`;
            }
        }
    } else {
        errormsg = 'No maps were found';
    }
    return {
        returnId,
        err: errormsg
    };
}

/**
 * 
 * @param osr path to replay file
 * @param osu path to .osu file (map)
 * @returns unstable rate - the unstable rate
 * @returns averageoffset - the avg ms off from a "perfect" hit. negatives are early
 */
export async function calcUr(
    osr: string,
    osu: string,
    config: extypes.config,
) {
    const unstableRate: number[] = [];

    let replay: extypes.replay = await replayparser.parseReplay(osr);
    let map = await mapParser.mapObject_Alt(osu);

    try {
        replay = await replayparser.parseReplay(osr);
        map = await mapParser.mapObject_Alt(osu);
    } catch (error) {
        return {
            unstablerate: 0,
            averageOffset: 0,
        };
    }

    console.log(map.HitObjects);

    //get offset
    const pixeloffset = osumodcalc.csToRadius(map.Difficulty.CircleSize);
    const hitOffset = osumodcalc.ODtoms(map.Difficulty.OverallDifficulty).hitwindow_50;

    //get every hitobject
    const hitObjectTimings: {
        x: number,
        y: number,
        time: number,
    }[] = [];
    for (let i = 0; i < map.HitObjects.length; i++) {
        const curObj = map.HitObjects[i];
        hitObjectTimings.push({
            x: curObj.position.x,
            y: curObj.position.y,
            time: curObj.time
        });
    }



    //get every tap
    const taps: {
        x: number,
        y: number,
        time: number,
    }[] = [];
    for (let i = 0; i < replay.replay_data.length; i++) {
        const curHit = replay.replay_data[i];
        const lastHit = replay.replay_data[i - 1];
        let tapTime: number;

        let tapCounts = false;

        if (!curHit) {
            tapCounts = false;
        } else {
            if (!lastHit) {
                console.log('no last hit');
                if (curHit.keysPressed.K1 ||
                    curHit.keysPressed.K2 ||
                    curHit.keysPressed.M1 ||
                    curHit.keysPressed.M2
                ) {
                    tapCounts = true;
                    const tempArr = replay.replay_data.slice(0, i).map(x => x.timeSinceLastAction);
                    tapTime = tempArr.reduce((a, b) => a + b, 0);
                }
            } else {
                //check if a key was pressed that wasn't pressed before
                if ((curHit.keysPressed.K1 && lastHit.keysPressed.K1 == false) ||
                    (curHit.keysPressed.K2 && lastHit.keysPressed.K2 == false) ||
                    (curHit.keysPressed.M1 && lastHit.keysPressed.M1 == false) ||
                    (curHit.keysPressed.M2 && lastHit.keysPressed.M2 == false)
                ) {
                    tapCounts = true;
                    const tempArr = replay.replay_data.slice(0, i).map(x => x.timeSinceLastAction);
                    tapTime = tempArr.reduce((a, b) => a + b, 0);
                }
            }
        }
        if (tapCounts) {
            taps.push(
                {
                    x: curHit.x,
                    y: curHit.y,
                    time: tapTime
                }
            );
        }
    }

    log.toOutput(JSON.stringify(hitObjectTimings, null, 2), config);

    const hitObjectsforAvg = hitObjectTimings.slice();

    //gets avg. from the absolute perfect hit;
    const unstableRateF: number[] = [];

    for (let i = 0; i < taps.length; i++) {
        const curHit = taps[i];
        const curHitObj = hitObjectsforAvg[0];
        let doable = true;
        let missaim = false;
        let mistap = false;
        let objectGONE = false;

        console.log(i);
        console.log(curHit);
        console.log(curHitObj);

        if (hitObjectsforAvg.length == 0) {
            break;
        }

        if (!curHitObj) {
            hitObjectsforAvg.shift();
        } else {

            if (Math.abs(curHit.x - curHitObj.x) < pixeloffset && Math.abs(curHit.y - curHitObj.y) < pixeloffset) {
                doable = true;
                objectGONE = true;
            } else {
                missaim = true;
                doable = false;
            }

            if (Math.abs(curHit.time - curHitObj.time) < hitOffset) {
                doable = true;
                objectGONE = true;
            } else {
                mistap = true;
                doable = false;
            }
            if ((curHit.time - curHitObj.time) > hitOffset) {
                objectGONE = true;
            }

            if (objectGONE) {
                hitObjectsforAvg.shift();
            }
            if (doable) {
                unstableRateF.push(curHit.time - curHitObj.time);
            }
        }
    }
    const avg = (unstableRateF.filter(x => x).reduce((prev, cur) => prev + cur, 0)) / unstableRateF.filter(x => x).length;

    //now does the same as before with avg factored in
    for (let i = 0; i < taps.length; i++) {
        const curHit = taps[i];
        const curHitObj = hitObjectTimings[0];
        let doable = true;
        let missaim = false;
        let mistap = false;
        let objectGONE = false;

        if (hitObjectTimings.length == 0) {
            break;
        }

        if (!curHitObj) {
            hitObjectTimings.shift();
        } else {

            if (Math.abs(curHit.x - curHitObj.x) < pixeloffset && Math.abs(curHit.y - curHitObj.y) < pixeloffset) {
                doable = true;
                objectGONE = true;
            } else {
                missaim = true;
                doable = false;
            }

            if (Math.abs(curHit.time - curHitObj.time) < hitOffset) {
                doable = true;
                objectGONE = true;
            } else {
                mistap = true;
                doable = false;
            }

            if ((curHit.time - curHitObj.time) > hitOffset) {
                objectGONE = true;
            }

            if (objectGONE) {
                hitObjectTimings.shift();
            }
            if (doable) {
                unstableRate.push((curHit.time - curHitObj.time) - avg);
            }
        }
    }

    console.log(unstableRate);
    console.log((unstableRate.reduce((prev, cur) => Math.abs(prev) + Math.abs(cur), 0)));
    console.log(unstableRate.length);

    return {
        unstablerate: ((unstableRate.reduce((prev, cur) => Math.abs(prev) + Math.abs(cur), 0)) / unstableRate.length) * 10,
        averageOffset: avg,
        averageEarly: (unstableRateF.filter(x => x < 0).reduce((prev, cur) => prev + cur, 0)) / unstableRateF.filter(x => x).length,
        averageLate: (unstableRateF.filter(x => x > 0).reduce((prev, cur) => prev + cur, 0)) / unstableRateF.filter(x => x).length
    };
}

/**
 * 
 * @param objectsPassed total number of hits
 * @param mapPath path to the map file
 * @returns the point of fail in a map in milliseconds
 */
export async function getFailPoint(
    objectsPassed: number,
    mapPath: string
) {
    let time = 1000;
    if (fs.existsSync(mapPath)) {
        try {
            const decoder = new osuparsers.BeatmapDecoder();
            const beatmap = await decoder.decodeFromPath(mapPath, false) as osuparsertypes.Beatmap;
            if (objectsPassed == null || objectsPassed < 1) {
                objectsPassed = 1;
            }
            const objectOfFail = beatmap.hitObjects[objectsPassed - 1];
            time = objectOfFail.startTime;
        } catch (error) {
            console.log("passed: " + objectsPassed);
            console.log("path: " + mapPath);
            console.log(error);
        }
    } else {
        console.log("Path does not exist:" + mapPath);
    }
    return time;
}

/**
 * @param hits score statistics (api v2)
 * @param mode osu, taiko, fruits (ctb), mania
 * @returns 
 */
export function returnHits(hits: osuApiTypes.Score['statistics'], mode: osuApiTypes.GameMode) {
    const object: {
        short: string,
        long: string,
        ex: { name: string, value: string | number; }[];
    } = {
        short: '',
        long: '',
        ex: []
    };
    switch (mode) {
        case 'osu':
            object.short = `${hits.count_300}/${hits.count_100}/${hits.count_50}/${hits.count_miss}`;
            object.long = `**300:** ${hits.count_300} \n **100:** ${hits.count_100} \n **50:** ${hits.count_50} \n **Miss:** ${hits.count_miss}`;
            object.ex = [
                {
                    name: '300',
                    value: hits.count_300
                },
                {
                    name: '100',
                    value: hits.count_100
                },
                {
                    name: '50',
                    value: hits.count_50
                },
                {
                    name: 'Miss',
                    value: hits.count_miss
                }
            ];
            break;
        case 'taiko':
            object.short = `${hits.count_300}/${hits.count_100}/${hits.count_miss}`;
            object.long = `**Great:** ${hits.count_300} \n **Good:** ${hits.count_100} \n **Miss:** ${hits.count_miss}`;
            object.ex = [
                {
                    name: 'Great',
                    value: hits.count_300
                },
                {
                    name: 'Good',
                    value: hits.count_100
                },
                {
                    name: 'Miss',
                    value: hits.count_miss
                }
            ];
            break;
        case 'fruits':
            object.short = `${hits.count_300}/${hits.count_100}/${hits.count_50}/${hits.count_miss}/${hits.count_katu}`;
            object.long = `**Fruits:** ${hits.count_300} \n **Drops:** ${hits.count_100} \n **Droplets:** ${hits.count_50} \n **Miss:** ${hits.count_miss} \n **Miss(droplets):** ${hits.count_katu}`;
            object.ex = [
                {
                    name: 'Fruits',
                    value: hits.count_300
                },
                {
                    name: 'Drops',
                    value: hits.count_100
                },
                {
                    name: 'Droplets',
                    value: hits.count_50
                },
                {
                    name: 'Miss',
                    value: hits.count_miss
                },
                {
                    name: 'Miss(droplets)',
                    value: hits.count_katu
                },
            ];
            break;
        case 'mania':
            object.short = `${hits.count_geki}/${hits.count_300}/${hits.count_katu}/${hits.count_100}/${hits.count_50}/${hits.count_miss}`;
            object.long = `**300+:** ${hits.count_geki} \n **300:** ${hits.count_300} \n **200:** ${hits.count_katu} \n **100:** ${hits.count_100} \n **50:** ${hits.count_50} \n **Miss:** ${hits.count_miss}`;
            object.ex = [
                {
                    name: '300+',
                    value: hits.count_geki
                },
                {
                    name: '300',
                    value: hits.count_300
                },
                {
                    name: '200',
                    value: hits.count_katu
                },
                {
                    name: '100',
                    value: hits.count_100
                },
                {
                    name: '50',
                    value: hits.count_50
                },
                {
                    name: 'Miss',
                    value: hits.count_miss
                }
            ];
            break;
    }
    return object;
}

/**
 * parses a string that has a unicode and "romanised" version
 * @style 1 artist title (artist title). uses style 2 if only title or artist is different
 * @style 2 artist (artist) title (title)
 */
export function parseUnicodeStrings(
    input: {
        title: string,
        artist: string,
        title_unicode: string,
        artist_unicode: string,
        ignore: {
            artist: boolean,
            title: boolean,
        };
    },
    style?: 1 | 2
) {
    let fullTitle: string;
    switch (style) {
        case 1: default: {

            if (
                (input.title != input.title_unicode && input.artist == input.artist_unicode)
                ||
                (input.title == input.title_unicode && input.artist != input.artist_unicode)
                ||
                (input.title == input.title_unicode && input.artist == input.artist_unicode)
                ||
                (input.ignore.artist == true || input.ignore.title == true)
            ) {
                return parseUnicodeStrings(input, 2);
            } else {
                fullTitle =
                    `${input.artist} - ${input.title}
${input.artist_unicode} - ${input.title_unicode}`;
            }
        }
            break;
        case 2: {
            const title = input.title == input.title_unicode ? input.title : `${input.title_unicode} (${input.title})`;
            const artist = input.artist == input.artist_unicode ? input.artist : `${input.artist_unicode} (${input.artist})`;
            if (input.ignore.artist) {
                fullTitle = `${title}`;
            } else if (input.ignore.title) {
                fullTitle = `${artist}`;
            } else {
                fullTitle = `${artist} - ${title}`;
            }
        }
            break;
    }

    return fullTitle;
}

/**
 * @param input - see apiInput
 * @returns apiReturn
 * @property url
 * @property
 */
export async function apigetOffline(input: apiInput) {
    const basePath = `${path}\\cache\\debug`;
    let ipath = basePath;
    let spath = basePath;
    switch (input.version) {
        case 1: {
            switch (input.type) {
                case 'scores_get_map':
                    spath = `${basePath}\\command\\maplb\\lbDataO`;
                    break;
            }
        }

        case 2: {
            switch (input.type) {
                case 'map_get': case 'map':
                    spath = `${basePath}\\command\\map\\mapData`;
                    break;
                case 'map_get_md5':
                    spath = `${basePath}\\command\\map\\mapData`;
                    break;
                case 'mapset_get': case 'mapset':
                    spath = `${basePath}\\command\\map\\bmsData`;
                    break;
                case 'mapset_search':
                    spath = `${basePath}\\command\\map\\mapIdTestData`;
                    break;
                case 'score_get': case 'score':
                    spath = `${basePath}\\command\\scoreparse\\scoreData`;
                    break;
                case 'scores_get_best': case 'osutop': case 'best':
                    spath = `${basePath}\\command\\osutop\\osuTopData`;
                    break;
                case 'scores_get_first': case 'firsts':
                    spath = `${basePath}\\command\\firsts\\firstsScoresData`;
                    break;
                case 'firsts_alt':
                    spath = `${basePath}\\command\\firsts\\firstsScoresData`;
                    break;
                case 'scores_get_map': case 'maplb':
                    spath = `${basePath}\\command\\maplb\\lbData`;
                    break;
                case 'scores_get_pinned': case 'pinned':
                    spath = `${basePath}\\command\\pinned\\pinnedScoresData`;
                    break;
                case 'pinned_alt':
                    spath = `${basePath}\\command\\pinned\\pinnedScoresData`;
                    break;
                case 'scores_get_recent': case 'recent':
                    spath = `${basePath}\\command\\recent\\rsData`;
                    break;
                case 'recent_alt':
                    spath = `${basePath}\\command\\recent\\rsData`;
                    break;
                case 'user_get': case 'user':
                    spath = `${basePath}\\command\\osu\\osuData`;
                    break;
                case 'user_get_most_played': case 'most_played':
                    spath = `${basePath}\\command\\osu\\mostPlayedData`;
                    break;
                case 'user_get_scores_map':
                    spath = `${basePath}\\command\\scores\\scoreDataPresort`;
                    break;
                case 'user_get_maps':
                    spath = `${basePath}\\command\\userbeatmaps\\mapListData`;
                    break;
                case 'user_get_maps_alt':
                    spath = `${basePath}\\command\\userbeatmaps\\mapListDataF`;
                    break;
                case 'user_recent_activity':
                    spath = `${basePath}\\command\\recent_activity\\rsactData`;
                    break;
            }
        }
            let skillissue = false;
            //using spath find file
            const full = spath.split('\\');
            const file = full.pop();
            console.log(full.join('\\'));
            const dir = fs.readdirSync(full.join('\\'));
            console.log(dir);
            const isPresent = dir.filter(x => x.includes(file));
            console.log(isPresent);
            console.log(file);
            if (isPresent.length > 0) {
                ipath = full.join('\\') + `\\${isPresent[Math.floor(Math.random() * isPresent.length)]}`;
            } else {
                skillissue = true;
            }
            console.log(skillissue);
            //else return err

            const d = skillissue ? '{ error: "null" }' : fs.readFileSync(ipath, 'utf-8');
            return JSON.parse(d) as object;
    }

}