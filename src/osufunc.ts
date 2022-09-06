import rosu = require('rosu-pp');
import osumodcalc = require('osumodcalculator');
import osuapiext = require('osu-api-extended');
import fs = require('fs');
import charttoimg = require('chartjs-to-image');
import fetch from 'node-fetch';
import osuApiTypes = require('./types/osuApiTypes');
import config = require('../config/config.json');
import cmdchecks = require('./checks');
/**
 * 
 * @param {*} arr array of scores
 * @returns most common mod combinations
 */
function modemods(arr) {
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
function modemappers(arr) {
    return arr.sort((a, b) => //swap b and a to make it least common
        arr.filter(v => v.beatmapset.creator === a.beatmapset.creator).length
        - arr.filter(v => v.beatmapset.creator === b.beatmapset.creator).length
    ).pop();
}
/* module.exports = {
    modemods, modemappers
} */
export {
    modemods, modemappers
};
export { mapcalc, scorecalc, straincalc, graph, mapcalclocal, straincalclocal, apiget, updateToken, updateUserStats };




/**
 * 
 * @param mods 
 * @param gamemode 
 * @param mapid 
 * @param calctype 0 = rosu, 1 = booba, 2 = osu api extended
 * @returns 
 */
async function mapcalc(
    mods: string, gamemode: string, mapid: number,
    calctype: number | null
) {
    let ppl
    let mapscore
    const calctyper = osumodcalc.ModeNameToInt(gamemode)

    switch (calctyper) {
        case 0: default:
            if (!fs.existsSync('files/maps/')) {
                fs.mkdirSync('files/maps/');
            }

            if (!fs.existsSync('files/maps/' + mapid + '.osu')) {
                await osuapiext.tools.download.difficulty(mapid, 'files/maps/', mapid); //uses fs btw
            }


            mapscore = {
                path: `files/maps/${mapid}.osu`,
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
 * 
 * @param mods 
 * @param gamemode 
 * @param mapid 
 * @param hitgeki 
 * @param hit300 
 * @param hitkatu 
 * @param hit100 
 * @param hit50 
 * @param miss 
 * @param acc 
 * @param maxcombo 
 * @param score 
 * @param calctype 0 = rosu, 1 = booba, 2 = osu api extended
 * @param passedObj number of objects hit
 * @param failed whether the score is failed or not
 * @returns 
 */
async function scorecalc(
    mods: string, gamemode: string, mapid: number,
    hitgeki: number | null, hit300: number | null, hitkatu: number | null, hit100: number | null, hit50: number | null, miss: number | null,
    acc: number | null, maxcombo: number | null, score: number | null,
    calctype: number | null, passedObj: number | null, failed: boolean | null
) {
    let ppl;
    let scorenofc;
    let scorefc;

    if (failed == null) {
        failed = false
    }

    const calctyper = osumodcalc.ModeNameToInt(gamemode)
    switch (calctype) {
        case 0: default:
            {            //check if 'files/maps/' exists
                if (!fs.existsSync('files/maps/')) {
                    fs.mkdirSync('files/maps/');
                }
                if (!fs.existsSync('files/maps/' + mapid + '.osu')) {
                    await osuapiext.tools.download.difficulty(mapid, 'files/maps/', mapid); //uses fs btw
                }


                let newacc = osumodcalc.calcgrade(hit300, hit100, hit50, 0).accuracy;
                switch (gamemode) {
                    case 'osu':
                        break;
                    case 'taiko':
                        newacc = osumodcalc.calcgradeTaiko(hit300, hit100, 0).accuracy;
                        break;
                    case 'fruits':
                        newacc = osumodcalc.calcgradeCatch(hit300, hit100, hit50, 0, hitkatu).accuracy;
                        break;
                    case 'mania':
                        newacc = osumodcalc.calcgradeMania(hitgeki, hit300, hitkatu, hit100, hit50, 0).accuracy;
                        break;
                }
                if (isNaN(newacc)) {
                    newacc = acc;
                }
                let basescore: any = {
                    mode: gamemode,
                    mods: osumodcalc.ModStringToInt(mods),
                    combo: maxcombo,
                    acc: acc || 100,
                    score: score != null && !isNaN(score) ? score : 0,
                }
                if (failed == true) {
                    basescore = {
                        mode: gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        combo: maxcombo,
                        acc: acc || 100,
                        score: score != null && !isNaN(score) ? score : 0,
                        passedObjects: passedObj
                    }
                }
                if (hit300 != null && !isNaN(hit300)) {
                    basescore.n300 = hit300
                }
                if (hit100 != null && !isNaN(hit100)) {
                    basescore.n100 = hit100
                }
                if (hit50 != null && !isNaN(hit50)) {
                    basescore.n50 = hit50
                }
                if (miss != null && !isNaN(miss)) {
                    basescore.nMisses = miss
                }
                if (hitkatu != null && !isNaN(hitkatu)) {
                    basescore.nKatu = hitkatu
                }
                scorenofc = {
                    path: `files/maps/${mapid}.osu`,
                    params: [
                        basescore,
                        {
                            mode: gamemode,
                            mods: osumodcalc.ModStringToInt(mods),
                            acc: newacc,
                        },
                        {
                            mode: gamemode,
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
async function straincalc(mapid: number, mods: string, calctype: number, mode: string) {
    let strains;
    switch (calctype) {
        case 0: default:
            switch (mode) {
                case 'osu': {
                    const strains1 = JSON.parse(JSON.stringify(await rosu.strains(`files/maps/${mapid}.osu`, osumodcalc.ModStringToInt(mods)), null, 2));
                    const aimval = strains1.aim;
                    const aimnoslideval = strains1.aimNoSliders;
                    const speedval = strains1.speed;
                    const flashlightval = strains1.flashlight;
                    const straintimes = [];
                    const totalval = [];

                    //let div = aimval.length / 200;
                    for (let i = 0; i < aimval.length; i++) {
                        //let offset = Math.ceil(i * div);
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
 * @param mapid 
 * @param mods 
 * @param calctype 
 * @param mode 
 * @returns the strains of a beatmap. times given in milliseconds
 */
async function straincalclocal(path: string | null, mods: string, calctype: number, mode: string) {
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

                    //let div = aimval.length / 200;
                    for (let i = 0; i < aimval.length; i++) {
                        //let offset = Math.ceil(i * div);
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
async function graph(x: number[] | string[], y: number[], label: string, startzero?: boolean | null, reverse?: boolean | null, showlabelx?: boolean | null, showlabely?: boolean | null, fill?: boolean | null, settingsoverride?: string | null, displayLegend?: boolean, secondY?: number[], secondLabel?: string) {

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

/**
 * 
 * @param mods 
 * @param gamemode 
 * @param mapid 
 * @param calctype 0 = rosu, 1 = booba, 2 = osu api extended
 * @returns 
 */
async function mapcalclocal(
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
 * 
 * @param type type of api call to make
 * @param params separate each param with +
 * @param version 1 or 2. defaults to 2
 * @returns data
 */
async function apiget(type: apiGetStrings, mainparam: string, params?: string, version?: number) {
    const baseurl = 'https://osu.ppy.sh/api'
    const accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
    let access_token
    try {
        access_token = JSON.parse(accessN).access_token;
    } catch (error) {
        access_token = ''
    }
    const key = config.osuApiKey
    if (!version) {
        version = 2
    }
    let url = `${baseurl}/v${version}/`
    if (version == 1) {
        url = `${baseurl}/`
        switch (type) {
            case 'scores_get_map':
                url += `get_scores?k=${key}&b=${mainparam}&mods=${params}&limit=100`
                break;
        }
    }
    mainparam = cmdchecks.toHexadecimal(mainparam)
    if (params) params = cmdchecks.toHexadecimal(params);
    if (version == 2) {
        switch (type) {
            case 'map_search':
                break;
            case 'map_get': case 'map':
                url += `beatmaps/${mainparam}`
                break;
            case 'map_get_md5':
                url += `beatmaps/lookup?checksum=${mainparam}`
                break;
            case 'mapset_get': case 'mapset':
                url += `beatmapsets/${mainparam}`
                break;
            case 'mapset_search':
                url += `beatmapsets/search?q=${mainparam}&s=any`
                break;
            case 'score_get': case 'score':
                url += `scores/${params ?? 'osu'}/${mainparam}`
                break;
            case 'scores_get_best': case 'osutop': case 'best':
                url += `users/${mainparam}/scores/best?mode=${params}&limit=100&offset=0`
                break;
            case 'scores_get_first': case 'firsts':
                url += `users/${mainparam}/scores/firsts?mode=${params}&limit=100`
                break;
            case 'scores_get_map': case 'maplb':
                url += `beatmaps/${mainparam}/scores`
                break;
            case 'scores_get_pinned': case 'pinned':
                url += `users/${mainparam}/scores/pinned?mode=${params}&limit=100`
                break;
            case 'scores_get_recent': case 'recent':
                url += `users/${mainparam}/scores/recent?include_fails=1&mode=${params}&limit=100&offset=0`
                break;
            case 'user_get': case 'user':
                url += `users/${mainparam}/${params ? params : 'osu'}`
                break;
            case 'user_get_most_played': case 'most_played':
                url += `users/${mainparam}/beatmapsets/most_played`
                break;
            case 'user_get_scores_map':
                url += `beatmaps/${mainparam}/scores/users/${params}/all`
                break;
        }
    }
    let data;
    let datafirst;
    datafirst = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    }).then(res => res.json())

    try {

        if (datafirst?.authentication) {
            await updateToken()
            throw new Error('token expired. Updating token...')
        }
        if (typeof datafirst?.error != 'undefined' && datafirst?.error == null && typeof datafirst?.error != 'object') {
            throw new Error('null')
        }
        data = datafirst;

    } catch (error) {
        data = {
            error,
            url: url,
            params: {
                type: type,
                mainparam: mainparam,
                params: params,
                version: version,
            },
            apiData: datafirst
        }
        if (params) {
            data.params.params = params
        }
    }
    logCall(url)
    return data;
}


async function updateToken() {
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
        fs.writeFileSync('configs/osuauth.json', JSON.stringify(newtoken))
        fs.appendFileSync('logs/updates.log', '\nosu auth token updated at ' + new Date().toLocaleString() + '\n')
    }
    logCall('https://osu.ppy.sh/oauth/token', 'Update token')
}

function logCall(data: string, title?: string) {
    if (config.LogApiCalls == true) {
        console.log((title ? title : 'Api call') + ': ' + data)
    }
    return;
}

async function updateUserStats(user: osuApiTypes.User, mode: string, sqlDatabase: any) {
    try {
        let findname = await sqlDatabase.findOne({ where: { osuname: user.username } });
        if (findname == null) {
            findname = await sqlDatabase.findOne({ where: { osuname: user.id } });
        }
        if (findname != null) {
            switch (mode) {
                case 'osu':
                default:
                    await sqlDatabase.update({
                        osupp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                        osurank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                        osuacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0,
                    }, {
                        where: { osuname: user }
                    })
                    break;
                case 'taiko':
                    await sqlDatabase.update({
                        taikopp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                        taikorank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                        taikoacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                    }, {
                        where: { osuname: user }
                    })
                    break;
                case 'fruits':
                    await sqlDatabase.update({
                        fruitspp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                        fruitsrank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                        fruitsacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                    }, {
                        where: { osuname: user }
                    })
                    break;
                case 'mania':
                    await sqlDatabase.update({
                        maniapp: !isNaN(user?.statistics?.pp) ? user?.statistics?.pp : 0,
                        maniarank: !isNaN(user?.statistics?.global_rank) ? user?.statistics?.global_rank : 0,
                        maniaacc: !isNaN(user?.statistics?.hit_accuracy) ? user?.statistics?.hit_accuracy : 0
                    }, {
                        where: { osuname: user }
                    })
                    break;
            }
        }
    } catch (error) {
        console.log(`Error updating user stats for ${user?.username}: ` + error)
    }
    return;
}

export async function getUser(username: string) {
    return await apiget('user_get', username);
}

type apiGetStrings =
    'map_search' |
    'map_get' | 'map' |
    'map_get_md5' |
    'mapset_get' | 'mapset' |
    'mapset_search' |

    'score_get' | 'score' |
    'scores_get_best' | 'osutop' | 'best' |
    'scores_get_first' | 'firsts' |
    'scores_get_pinned' | 'pinned' |
    'scores_get_recent' | 'recent' |
    'scores_get_map' | 'maplb' |

    'user_get' | 'user' |
    'user_get_most_played' | 'most_played' |
    'user_get_scores_map'

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
        if(typeof user != 'string'){
            errorValue = 'Username is incorrect type'
        }
    } else {
        user = null
        mode = 'osu'
        errorValue = `no user found with id ${searchid}`
    }
    let object = {
        username: user,
        gamemode: mode,
        error: errorValue,
    }
    return object;
}
