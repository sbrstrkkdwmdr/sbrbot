import rosu = require('rosu-pp');
import osumodcalc = require('./osumodcalc');
import fs = require('fs');
import charttoimg = require('chartjs-to-image');
import fetch from 'node-fetch';
import perf = require('perf_hooks');
import osuApiTypes = require('./types/osuApiTypes');
import config = require('../config/config.json');
import cmdchecks = require('./checks');
import extypes = require('./types/extratypes');
import Sequelize = require('sequelize');

/**
 * 
 * @param {*} arr array of scores
 * @returns most common mod combinations
 */
export function modemods(arr) {
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
export function modemappers(arr) {
    return arr.sort((a, b) => //swap b and a to make it least common
        arr.filter(v => v.beatmapset.creator === a.beatmapset.creator).length
        - arr.filter(v => v.beatmapset.creator === b.beatmapset.creator).length
    ).pop();
}
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
}


/**
 * 
 * @param mods 
 * @param gamemode 
 * @param mapid 
 * @param calctype 0 = rosu, 1 = booba, 2 = osu api extended
 * @returns 
 */
export async function mapcalc(
    obj: {
        mods: string,
        gamemode: string,
        mapid: number,
        calctype: number | null
    },
    mapIsRank?: string
) {
    let ppl
    let mapscore
    const calctyper = osumodcalc.ModeNameToInt(obj.gamemode)

    switch (calctyper) {
        case 0: default: {
            if (!fs.existsSync('files/maps/')) {
                fs.mkdirSync('files/maps/');
            }
            const mapPath = await dlMap(obj.mapid, mapIsRank);

            if (!(typeof mapPath == 'string')) {
                return mapPath;
            }

            const mods = obj.mods == null || obj.mods.length < 1 ? 'NM' : obj.mods;

            mapscore = {
                path: mapPath,
                params: [
                    {
                        mode: obj.gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 100,

                    },
                    {
                        mode: obj.gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 99,

                    },
                    {
                        mode: obj.gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 98,

                    },
                    {
                        mode: obj.gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 97,

                    },
                    {
                        mode: obj.gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 96
                    },
                    {
                        mode: obj.gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 95,
                    }
                ]
            }

            ppl = await rosu.calculate(mapscore);
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
        calctype?: number | null, passedObj?: number | null, failed?: boolean | null
    },
    mapIsRank?: string
) {
    let ppl;
    let scorenofc;
    let scorefc;
    const failed = obj.failed ?? false;


    const calctyper = osumodcalc.ModeNameToInt(obj.gamemode)
    switch (obj.calctype) {
        case 0: default:
            {
                if (!fs.existsSync('files/maps/')) {
                    console.log('creating files/maps/');
                    fs.mkdirSync('files/maps/');
                }
                const mapPath = await dlMap(obj.mapid, mapIsRank);


                if (!(typeof mapPath == 'string')) {
                    return mapPath;
                }
                const mods = obj.mods == null || obj.mods.length < 1 ? 'NM' : obj.mods;


                let mode;

                let newacc = osumodcalc.calcgrade(obj.hit300, obj.hit100, obj.hit50, 0).accuracy;
                if (obj.hit300 && obj.hit100) {
                    switch (obj.gamemode) {
                        case 'osu': default:
                            mode = 0
                            if (obj.hit50) {
                                osumodcalc.calcgrade(obj.hit300, obj.hit100, obj.hit50, 0).accuracy;
                            } else {
                                newacc = obj.acc
                            }
                            break;
                        case 'taiko':
                            mode = 1
                            newacc = osumodcalc.calcgradeTaiko(obj.hit300, obj.hit100, 0).accuracy;
                            break;
                        case 'fruits':
                            mode = 2
                            if (obj.hit50) {
                                newacc = osumodcalc.calcgradeCatch(obj.hit300, obj.hit100, obj.hit50, 0, obj.hitkatu).accuracy;
                            } else {
                                newacc = obj.acc
                            }
                            break;
                        case 'mania':
                            mode = 3
                            if (obj.hitgeki && obj.hitkatu && obj.hit50) {
                                newacc = osumodcalc.calcgradeMania(obj.hitgeki, obj.hit300, obj.hitkatu, obj.hit100, obj.hit50, 0).accuracy;
                            } else {
                                newacc = obj.acc
                            }
                            break;
                    }
                } else {
                    newacc = obj.acc
                    switch (obj.gamemode) {
                        case 'osu': default:
                            mode = 0
                            break;
                        case 'taiko':
                            mode = 1
                            break;
                        case 'fruits':
                            mode = 2
                            break;
                        case 'mania':
                            mode = 3
                            break;
                    }
                }
                if (isNaN(newacc)) {
                    newacc = obj.acc;
                }
                let basescore: calcScore = {
                    mode,
                    mods: osumodcalc.ModStringToInt(mods),
                    combo: obj.maxcombo,
                    acc: obj?.acc ? obj.acc * 100 : 100,
                    score: obj.score != null && !isNaN(obj.score) ? obj.score : 0,
                }
                if (failed == true) {
                    basescore = {
                        mode,
                        mods: osumodcalc.ModStringToInt(mods),
                        combo: obj.maxcombo,
                        acc: obj?.acc ? obj.acc * 100 : 100,
                        score: obj.score != null && !isNaN(obj.score) ? obj.score : 0,
                        passedObjects: obj.passedObj
                    }
                }
                if (obj.hit300 != null && !isNaN(obj.hit300)) {
                    basescore.n300 = obj.hit300
                }
                if (obj.hit100 != null && !isNaN(obj.hit100)) {
                    basescore.n100 = obj.hit100
                }
                if (obj.hit50 != null && !isNaN(obj.hit50)) {
                    basescore.n50 = obj.hit50
                }
                if (obj.miss != null && !isNaN(obj.miss)) {
                    basescore.nMisses = obj.miss
                }
                if (obj.hitkatu != null && !isNaN(obj.hitkatu)) {
                    basescore.nKatu = obj.hitkatu
                }
                scorenofc = {
                    path: mapPath,
                    params: [
                        basescore,
                        {
                            mode,
                            mods: osumodcalc.ModStringToInt(mods),
                            acc: newacc * 100,
                        },
                        {
                            mode,
                            mods: osumodcalc.ModStringToInt(mods),
                            acc: 100,
                        }
                    ]
                }

                ppl = await rosu.calculate(scorenofc);

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
export async function straincalc(mapid: number, mods: string, calctype: number, mode: string) {
    let strains;
    switch (calctype) {
        case 0: default: {
            const mapPath = await dlMap(mapid);

            if (!(typeof mapPath == 'string')) {
                return mapPath;
            }
            switch (mode) {
                case 'osu': {
                    const strains1 = JSON.parse(JSON.stringify(await rosu.strains(`${mapPath}`, osumodcalc.ModStringToInt(mods)), null, 2));
                    const aimval = strains1.aim;
                    const aimnoslideval = strains1.aimNoSliders;
                    const speedval = strains1.speed;
                    const flashlightval = strains1.flashlight;
                    const straintimes = [];
                    const totalval = [];

                    for (let i = 0; i < aimval.length; i++) {
                        const offset = i
                        const curval = aimval[offset] + aimnoslideval[offset] + speedval[offset] + flashlightval[offset];
                        totalval.push(curval)

                        const curtime = ((strains1.section_length / 1000) * (i + 1))
                        const curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + (curtime % 60).toFixed(2) : (curtime % 60).toFixed(2)}`;
                        straintimes.push(curtimestr);
                    }
                    strains = {
                        strainTime: straintimes,
                        value: totalval,
                    }
                }
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
        path = './files/tempdiff.osu'
    }
    let strains;
    switch (calctype) {
        case 0: default:
            switch (mode) {
                case 'osu': {
                    const strains1 = JSON.parse(JSON.stringify(await rosu.strains(`${path}`, osumodcalc.ModStringToInt(mods)), null, 2));
                    const aimval = strains1.aim;
                    const aimnoslideval = strains1.aimNoSliders;
                    const speedval = strains1.speed;
                    const flashlightval = strains1.flashlight;
                    const straintimes = [];
                    const totalval = [];


                    for (let i = 0; i < aimval.length; i++) {
                        const offset = i
                        const curval = aimval[offset] + aimnoslideval[offset] + speedval[offset] + flashlightval[offset];
                        totalval.push(curval)

                        const curtime = ((strains1.section_length / 1000) * (i + 1))
                        const curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + (curtime % 60).toFixed(2) : (curtime % 60).toFixed(2)}`;
                        straintimes.push(curtimestr);
                    }
                    strains = {
                        strainTime: straintimes,
                        value: totalval,
                    }
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
 * @returns graph url
 */
export async function graph(x: number[] | string[], y: number[], label: string, startzero?: boolean | null, reverse?: boolean | null, showlabelx?: boolean | null, showlabely?: boolean | null, fill?: boolean | null, settingsoverride?: overrideGraph | null, displayLegend?: boolean, secondY?: number[], secondLabel?: string) {

    if (startzero == null || typeof startzero == 'undefined') {
        startzero = true
    }
    if (reverse == null || typeof reverse == 'undefined') {
        reverse = false
    }
    if (showlabelx == null || typeof showlabelx == 'undefined') {
        showlabelx = false
    }
    if (showlabely == null || typeof showlabely == 'undefined') {
        showlabely = false
    }
    if (fill == null || typeof fill == 'undefined') {
        fill = false
    }
    if (displayLegend == null || displayLegend == undefined || typeof displayLegend == 'undefined') {
        displayLegend = false
    }
    let type = 'line'
    switch (settingsoverride) {
        case 'replay':
            showlabely = true
            break;
        case 'rank':
            reverse = true
            startzero = false
            showlabely = true
            break;
        case 'strains':
            fill = true
            showlabely = true
            showlabelx = true
            startzero = true
            displayLegend = true
            break;
        case 'bar':
            type = 'bar'
            showlabely = true
            displayLegend = true
            break;
        case 'health':
            showlabely = true
            fill = false
            startzero = true
            break;
        default:
            break;
    }

    let curx = []
    let cury = []

    if (y.length > 200) {
        const div = y.length / 200;
        for (let i = 0; i < 200; i++) {
            const offset = Math.ceil(i * div);
            const curval = y[offset];
            cury.push(curval)
            curx.push(x[offset]);
        }
    } else {
        curx = x
        cury = y
    }
    const datasets = [{
        label: label,
        data: cury,
        fill: fill,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        pointRadius: 0
    }]
    if (!(secondY == null || secondY == undefined)) {
        datasets.push({
            label: secondLabel,
            data: secondY,
            fill: fill,
            borderColor: 'rgb(255, 0, 0)',
            borderWidth: 1,
            pointRadius: 0
        })
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
        })
    chart.setBackgroundColor('color: rgb(0,0,0)').setWidth(750).setHeight(250)

    return await chart.getShortUrl();

}

type overrideGraph = 'replay' | 'rank' | 'strains' | 'bar' | 'health'

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
    let ppl
    let mapscore
    const calctyper = osumodcalc.ModeNameToInt(gamemode)

    if (path == null) {
        path = `files/tempdiff.osu`
    }

    switch (calctyper) {
        case 0: default:

            mapscore = {
                path: path,
                params: [
                    {
                        mode: gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 100,

                    },
                    {
                        mode: gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 99,

                    },
                    {
                        mode: gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 98,

                    },
                    {
                        mode: gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 97,

                    },
                    {
                        mode: gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 96
                    },
                    {
                        mode: gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: 95,
                    }
                ]
            }

            ppl = await rosu.calculate(mapscore);
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
}

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
        urlOverride?: string
    },
    version?: number,
    callNum?: number,
    ignoreNonAlphaChar?: boolean
}
/**
 * @param input - see apiInput
 * @returns apiReturn
 * @property url
 * @property
 */
export async function apiget(input: apiInput) {
    if (!input.callNum) input.callNum = 0;
    if (input.callNum > 5) throw new Error('Too many calls to api');


    const baseurl = 'https://osu.ppy.sh/api'
    const accessN = fs.readFileSync('config/osuauth.json', 'utf-8');
    let access_token
    try {
        access_token = JSON.parse(accessN).access_token;
    } catch (error) {
        access_token = ''
    }
    const key = config.osuApiKey
    if (!input.version) {
        input.version = 2
    }
    let url = `${baseurl}/v${input.version}/`

    switch (input.version) {
        case 1: {
            url = `${baseurl}/`
            switch (input.type) {
                case 'scores_get_map':
                    url += `get_scores?k=${key}&b=${input.params.id}&mods=${osumodcalc.ModStringToInt(input.params.mods)}&limit=100`
                    break;
            }
        }

        case 2: {
            switch (input.type) {
                case 'custom':
                    url += `${input.params.urlOverride}`
                    break;
                case 'map_get': case 'map':
                    url += `beatmaps/${input.params.id}`
                    break;
                case 'map_get_md5':
                    url += `beatmaps/lookup?checksum=${input.params.md5}`
                    break;
                case 'mapset_get': case 'mapset':
                    url += `beatmapsets/${input.params.id}`
                    break;
                case 'mapset_search':
                    url += `beatmapsets/search?q=${input.params.searchString}`
                    break;
                case 'score_get': case 'score':
                    url += `scores/${input.params.mode ?? 'osu'}/${input.params.id}`
                    break;
                case 'scores_get_best': case 'osutop': case 'best':
                    url += `users/${input.params.username ?? input.params.userid}/scores/best?mode=${input.params.mode ?? 'osu'}&offset=0`
                    break;
                case 'scores_get_first': case 'firsts':
                    url += `users/${input.params.username ?? input.params.userid}/scores/firsts?mode=${input.params.mode ?? 'osu'}`
                    break;
                case 'firsts_alt':
                    url += `users/${input.params.username ?? input.params.userid}/scores/firsts?limit=100`
                    break;
                case 'scores_get_map': case 'maplb':
                    url += `beatmaps/${input.params.id}/scores`
                    break;
                case 'scores_get_pinned': case 'pinned':
                    url += `users/${input.params.username ?? input.params.userid}/scores/pinned?mode=${input.params.mode ?? 'osu'}`
                    break;
                case 'pinned_alt':
                    url += `users/${input.params.username ?? input.params.userid}/scores/pinned?limit=100&${input.params}`
                    break;
                case 'scores_get_recent': case 'recent':
                    url += `users/${input.params.username ?? input.params.userid}/scores/recent?mode=${input.params.mode ?? 'osu'}`
                    break;
                case 'recent_alt':
                    url += `users/${input.params.username ?? input.params.userid}/scores/recent?limit=100`
                    break;
                case 'user_get': case 'user':
                    url += `users/${input.params.username ?? input.params.userid}/${input.params.mode ?? 'osu'}`
                    break;
                case 'user_get_most_played': case 'most_played':
                    url += `users/${input.params.username ?? input.params.userid}/beatmapsets/most_played`
                    break;
                case 'user_get_scores_map':
                    url += `beatmaps/${input.params.id}/scores/users/${input.params.username}/all`
                    break;
                case 'user_get_maps':
                    url += `users/${input.params.username ?? input.params.userid}/beatmapsets/${input.params.category ?? 'favourite'}?limit=100`
                    break;
                case 'user_get_maps_alt':
                    url += `users/${input.params.username ?? input.params.userid}/beatmapsets/${input.params.category ?? 'favourite'}&limit=100`
                    break;
            }
        }
    }

    if (input.params.opts) {
        const urlSplit = url.split('/')[url.split('/').length - 1]
        if (urlSplit.includes('?')) {
            url += `&${input.params.opts.join('&')}`
        } else {
            url += `?${input.params.opts.join('&')}`
        }
    }

    let data: apiReturn = {
        url: null,
        totaltimeNum: null,
        input: input,
        apiData: null,
    };
    let datafirst;
    const before = perf.performance.now();
    datafirst = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    }).then(res => res.json());
    const after = perf.performance.now();
    try {
        if (datafirst?.authentication) {
            await updateToken()
            const tempobj = Object.assign({
                callNum: input.callNum ? input.callNum + 1 : 1
            }, input)
            datafirst = await apiget(tempobj)
        }
        if ('error' in datafirst && !input.type.includes('search')) {
            throw new Error('nullwww')
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
            error
        }
        fs.writeFileSync(`./cache/err${Date.now()}.json`, JSON.stringify(data, null, 2))
    }
    logCall(url)
    return data;
}

export async function updateToken() {
    const clientId = config.osuClientID
    const clientSecret = config.osuClientSecret
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
    `, 'utf-8')
        });
    if (newtoken.access_token) {
        fs.writeFileSync('config/osuauth.json', JSON.stringify(newtoken))
        fs.appendFileSync('logs/updates.log', '\nosu auth token updated at ' + new Date().toLocaleString() + '\n')
    }
    logCall('https://osu.ppy.sh/oauth/token', 'Update token')
}

export function logCall(data: string, title?: string) {
    if (config.LogApiCalls == true) {
        console.log((title ? title : 'Api call') + ': ' + data)
    }
    return;
}

export async function updateUserStats(user: osuApiTypes.User, mode: string, sqlDatabase: any) {
    const allUsers = await sqlDatabase.findAll()

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
                    })
                }
                break;
            case 'taiko':
                await sqlDatabase.update({
                    taikopp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                    taikorank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                    taikoacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                }, {
                    where: { osuname: findname.dataValues.osuname }
                })
                break;
            case 'fruits':
                await sqlDatabase.update({
                    fruitspp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                    fruitsrank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                    fruitsacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                }, {
                    where: { osuname: findname.dataValues.osuname }
                })
                break;
            case 'mania':
                await sqlDatabase.update({
                    maniapp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                    maniarank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                    maniaacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                }, {
                    where: { osuname: findname.dataValues.osuname }
                })
                break;
        }
    }
    return;
}

export async function getUser(username: string) {
    return await apiget({
        type: 'user',
        params: {
            username
        }
        // url: `https://osu.ppy.sh/api/v2/users/${username}`,
    })
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
    'user_get_maps' | 'user_get_maps_alt'

    
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
'notification_connection_read'


export async function searchUser(searchid: string, userdata: any, findMode: boolean) {
    const findname = await userdata.findOne({ where: { userid: searchid } })
    let user;
    let errorValue;
    let mode;
    if (findname != null) {
        user = findname.get('osuname');
        errorValue = null
        if (findMode == true) {
            mode = findname.get('mode')
            if (mode.length < 1 || mode == null) {
                mode = 'osu'
            }
        } else {
            mode = 'osu'
        }
        if (typeof user != 'string') {
            errorValue = 'Username is incorrect type'
        }
    } else {
        user = null
        mode = 'osu'
        errorValue = `no user found with id ${searchid}`
    }
    const object = {
        username: user,
        gamemode: mode,
        error: errorValue,
    }
    return object;
}

export function getPreviousId(type: 'map' | 'user' | 'score', serverId: string) {
    try {
        const init = fs.readFileSync(`cache/previous/${type}${serverId}.json`)
        return `${init}`
    } catch (error) {
        let data;
        switch (type) {
            case 'map':
                data = '4204'
                break;
            case 'user':
                data = '2'
                break;
            case 'score':
                data = JSON.stringify(require('template/score.json'), null, 2)
                break;
        }
        fs.writeFileSync(`cache/previous/${type}${serverId}.json`, data);
        return data;
    }
}
export function writePreviousId(type: 'map' | 'user' | 'score', serverId: string, data: string) {
    if (type == 'score') {
        fs.writeFileSync(`cache/previous/${type}${serverId}.json`, JSON.stringify(data, null, 2));
    } else {
        fs.writeFileSync(`cache/previous/${type}${serverId}.json`, data);
    }
    return;
}

export function debug(data: any, type: string, name: string, serverId: string | number, params: string) {
    const pars = params.replaceAll(',', '=');
    if (!fs.existsSync(`cache/debug/${type}`)) {
        fs.mkdirSync(`cache/debug/${type}`)
    }
    if (!fs.existsSync(`cache/debug/${type}/${name}/`)) {
        fs.mkdirSync(`cache/debug/${type}/${name}`)
    }
    fs.writeFileSync(`cache/debug/${type}/${name}/${pars}_${serverId}.json`, JSON.stringify(data, null, 2))
    return;
}

export function matchScores(initScore: osuApiTypes.Score, scoreList: osuApiTypes.Score[]) {
    //filter out so scores are only from the same map
    const mapScores = scoreList.slice().filter(score => score.beatmap.id == initScore.beatmap.id)

    //filter out so scores are only from the same user
    const userScores = mapScores.slice().filter(score => score.user.id == initScore.user.id)

    //filter out so scores are only from the same gamemode
    const modeScores = userScores.slice().filter(score => score.mode == initScore.mode)

    //filter out so scores are only from the same mods (excluding HD, SO, NF, TD)
    let modScores = modeScores.slice().filter(score => score.mods == initScore.mods)

    let filteredMods = initScore.mods.join('').replace('NC', 'DT').split(/.{1,2}/g)

    if (initScore.mods.includes('HD') || initScore.mods.includes('SO') || initScore.mods.includes('NF') || initScore.mods.includes('TD') || initScore.mods.includes('SD') || initScore.mods.includes('PF')) {
        filteredMods = initScore.mods.join('').replace('HD', '').replace('SO', '').replace('NF', '').replace('TD', '').replace('SD', '').replace('PF', '').split(/.{1,2}/g)
    }

    modScores = modScores.slice().filter(score => score.mods.join('').replace('NC', 'DT').split(/.{1,2}/g).sort().join('') == filteredMods.sort().join(''))

    if (initScore.mods.length == 0) {
        modScores = modeScores.slice().filter(score => score.mods.length == 0)
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

    }
}

export async function dlMap(mapid: number | string, isRanked?: string) {
    const mapFiles = fs.readdirSync('./files/maps')
    let mapDir = '';
    if (mapFiles.some(x => x.includes(`${mapid}`)) == false) {
        let curType = 'temp'
        if (['ranked', 'loved', 'approved'].some(x => x.includes(isRanked ?? 'temp'))) {
            curType = 'perm'
        }

        const url = `https://osu.ppy.sh/osu/${mapid}`
        const path = `./files/maps/${curType}${mapid}.osu`
        mapDir = path;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(`./files/maps/`, { recursive: true })
        }
        const writer = fs.createWriteStream(path)
        const res = await fetch(url)
        logCall(url, 'Beatmap file download')
        res.body.pipe(writer)
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('w');
            }, 1000)
        })
        logCall(mapDir.replace('./', ''), 'saved file')
    } else {
        for (let i = 0; i < mapFiles.length; i++) {
            const curmap = mapFiles[i]
            if (curmap.includes(`${mapid}`)) {
                mapDir = `./files/maps/${curmap}`
            }
        }
        logCall(mapDir.replace('./', ''), 'found file')
    }
    return mapDir.replace('./', '');
}

/**
 * 
 * @param index starts from 0
 * @returns 
 */
export function findWeight(index: number) {
    if (index > 99 || index < 0) return 0;
    return (0.95 ** (index))
}

export function rawToWeighted(pp: number, index: number) {
    return pp * (findWeight(index))
}

export async function getRankPerformance(type: 'pp->rank' | 'rank->pp', value: number, userdata: Sequelize.ModelStatic<any>, mode: osuApiTypes.GameMode,
    statsCache: Sequelize.ModelStatic<any>) {
    const users = await userdata.findAll()
    const cacheUsers = await statsCache.findAll()
    users.push(...cacheUsers)
    const pprankarr: { pp: string, rank: string }[] = [];

    for (let i = 0; i < users.length; i++) {
        const curuser = users[i].dataValues;
        switch (mode) {
            case 'osu': default:
                if (typeof curuser.osupp == 'undefined' || !curuser.osupp) break;
                if (typeof curuser.osurank == 'undefined' || !curuser.osurank) break;
                pprankarr.push({
                    pp: curuser.osupp,
                    rank: curuser.osurank
                })
                break;
            case 'taiko':
                if (typeof curuser.taikopp == 'undefined' || !curuser.taikopp) break;
                if (typeof curuser.taikorank == 'undefined' || !curuser.taikorank) break;
                pprankarr.push({
                    pp: curuser.taikopp,
                    rank: curuser.taikorank
                })
                break;
            case 'fruits':
                if (typeof curuser.fruitspp == 'undefined' || !curuser.fruitspp) break;
                if (typeof curuser.fruitsrank == 'undefined' || !curuser.fruitsrank) break;
                pprankarr.push({
                    pp: curuser.fruitspp,
                    rank: curuser.fruitsrank
                })
                break;
            case 'mania':
                if (typeof curuser.maniapp == 'undefined' || !curuser.maniapp) break;
                if (typeof curuser.maniarank == 'undefined' || !curuser.maniarank) break;
                pprankarr.push({
                    pp: curuser.maniapp,
                    rank: curuser.maniarank
                })
                break;
        }
    }

    //sort by pp
    pprankarr.sort((a, b) => parseFloat(b.pp) - parseFloat(a.pp))

    let returnval: number;

    switch (type) {
        case 'pp->rank': {
            pprankarr.push({ pp: `${value}`, rank: `${0}` })
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
            const pos = pprankarr.findIndex(e => parseFloat(e.pp) == value && e.rank == '0')

            const prev = pprankarr[pos - 1]

            const next = pprankarr[pos + 1]
            //estimate rank
            if (typeof prev == 'undefined' && typeof next != 'undefined') {
                returnval = parseInt(next.rank)
            }
            else if (typeof next == 'undefined' && typeof prev != 'undefined') {
                returnval = parseInt(prev.rank)
            } else {
                // returnval = prev.rank + ((next.rank - prev.rank) / (next.pp - prev.pp)) * (value - prev.pp)
                returnval = (parseInt(prev.rank) + parseInt(next.rank)) / 2
            }
            if (typeof prev == 'undefined' && typeof next == 'undefined') {
                returnval = null;
            }
        }
            break;
        case 'rank->pp': {
            pprankarr.push({ pp: '0', rank: `${value}` })
            pprankarr.sort((a, b) => parseInt(a.rank) - parseInt(b.rank));
            const pos = pprankarr.findIndex(e => parseInt(e.rank) == value && e.pp == '0')
            const prev = pprankarr[pos - 1]
            const next = pprankarr[pos + 1]

            //estimate pp
            if (typeof prev == 'undefined' && typeof next != 'undefined') {
                returnval = parseInt(next.pp)
            }
            else if (typeof next == 'undefined' && typeof prev != 'undefined') {
                returnval = parseInt(prev.pp)
            } else {
                // returnval = prev.pp + ((next.pp - prev.pp) / (next.rank - prev.rank)) * (value - prev.rank)
                returnval = (parseFloat(prev.pp) + parseFloat(next.pp)) / 2
            }
            if (typeof prev == 'undefined' && typeof next == 'undefined') {
                returnval = null;
            }

        }
            break;
    }
    return returnval;
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
    ]

    let isincluded = true
    if (!included.includes(mode)) {
        isincluded = false
    }

    return {
        mode: returnf,
        isincluded
    };
}

export async function userStatsCache(user: osuApiTypes.UserStatistics[], database: Sequelize.ModelStatic<any>, mode: osuApiTypes.GameMode) {
    await (async () => {
        for (let i = 0; i < user.length; i++) {
            const curuser = user[i];
            let findname = await database.findOne({
                where: {
                    osuid: curuser.user.id
                }
            })
            if (findname == Promise<{ pending }>) {
                findname = null;
            }
            switch (mode) {
                case 'osu': default: {
                    if (typeof findname == 'undefined' || !findname) {
                        await database.create({
                            osuid: curuser.user.id,
                            country: curuser.user.country_code,
                            osupp: curuser.pp,
                            osurank: curuser.global_rank,
                            osuacc: curuser.hit_accuracy
                        })
                    } else {
                        await database.update({
                            osupp: curuser.pp,
                            osurank: curuser.global_rank,
                            osuacc: curuser.hit_accuracy
                        },
                            {
                                where: { osuid: curuser.user.id }
                            })
                    }
                }
                    break;
                case 'taiko': {
                    if (typeof findname == 'undefined' || !findname) {
                        await database.create({
                            osuid: curuser.user.id,
                            country: curuser.user.country_code,
                            taikopp: curuser.pp,
                            taikorank: curuser.global_rank,
                            taikoacc: curuser.hit_accuracy
                        })
                    } else {
                        await database.update({
                            taikopp: curuser.pp,
                            taikorank: curuser.global_rank,
                            taikoacc: curuser.hit_accuracy
                        },
                            {
                                where: { osuid: curuser.user.id }
                            })
                    }
                }
                    break;
                case 'fruits': {
                    if (typeof findname == 'undefined' || !findname) {
                        await database.create({
                            osuid: curuser.user.id,
                            country: curuser.user.country_code,
                            fruitspp: curuser.pp,
                            fruitsrank: curuser.global_rank,
                            fruitsacc: curuser.hit_accuracy
                        })
                    } else {
                        await database.update({
                            fruitspp: curuser.pp,
                            fruitsrank: curuser.global_rank,
                            fruitsacc: curuser.hit_accuracy
                        },
                            {
                                where: { osuid: curuser.user.id }
                            })
                    }
                }
                    break;
                case 'mania': {
                    if (typeof findname == 'undefined' || !findname) {
                        await database.create({
                            osuid: curuser.user.id,
                            country: curuser.user.country_code,
                            maniapp: curuser.pp,
                            maniarank: curuser.global_rank,
                            maniaacc: curuser.hit_accuracy
                        })
                    } else {
                        await database.update({
                            maniapp: curuser.pp,
                            maniarank: curuser.global_rank,
                            maniaacc: curuser.hit_accuracy
                        },
                            {
                                where: { osuid: curuser.user.id }
                            })
                    }
                }
                    break;
            }
        }
    })();
    try {
        await userStatsCacheFix(database, mode);
    } catch (error) {
    }
}

export async function userStatsCacheFix(database: Sequelize.ModelStatic<any>, mode: osuApiTypes.GameMode) {
    const users = await database.findAll();
    const actualusers = []
    for (let i = 0; i < users.length; i++) {
        const curuser = {
            pp: users[i].dataValues[`${mode}pp`],
            rank: users[i].dataValues[`${mode}rank`],
            acc: users[i].dataValues[`${mode}acc`],
            uid: users[i].dataValues.osuid
        }
        actualusers.push(curuser)
    }

    actualusers.sort((a, b) => b.pp - a.pp)

    for (let i = 0; i < actualusers.length; i++) {
        const curuser = actualusers[i];
        let givenrank = i + 1;
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
        })
    }
}