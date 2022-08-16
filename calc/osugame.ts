import rosu = require('rosu-pp');
import booba = require('booba');
import osumodcalc = require('osumodcalculator');
import osuapiext = require('osu-api-extended');
import fs = require('fs');
import charttoimg = require('chartjs-to-image');

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
    let calctyper = osumodcalc.ModeNameToInt(gamemode)

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

    let calctyper = osumodcalc.ModeNameToInt(gamemode)
    switch (calctype) {
        case 0: default:
            //check if 'files/maps/' exists
            if (!fs.existsSync('files/maps/')) {
                fs.mkdirSync('files/maps/');
            }
            if (!fs.existsSync('files/maps/' + mapid + '.osu')) {
                await osuapiext.tools.download.difficulty(mapid, 'files/maps/', mapid); //uses fs btw
            }


            let newacc = osumodcalc.calcgrade(hit300, hit100, hit50, miss).accuracy;
            switch (gamemode) {
                case 'osu':
                    break;
                case 'taiko':
                    newacc = osumodcalc.calcgradeTaiko(hit300, hit100, miss).accuracy;
                    break;
                case 'fruits':
                    newacc = osumodcalc.calcgradeCatch(hit300, hit100, hit50, miss, hitkatu).accuracy;
                    break;
                case 'mania':
                    newacc = osumodcalc.calcgradeMania(hitgeki, hit300, hit100, hit50, miss, hitkatu).accuracy;
                    break;
            }
            let basescore:any = {
                mode: gamemode,
                mods: osumodcalc.ModStringToInt(mods),
                combo: maxcombo,
                acc: acc || 100,
                n300: hit300 != null || hit300 != NaN ? hit300 : 0,
                n100: hit100 != null || hit100 != NaN ? hit100 : 0,
                n50: hit50 != null || hit50 != NaN ? hit50 : 0,
                nMisses: miss != null || miss != NaN ? miss : 0,
                nKatu: hitkatu != null || hitkatu != NaN ? hitkatu : 0,
                score: score != null || score != NaN ? score : 0,
            }
            if (failed == true) {
                basescore = {
                    mode: gamemode,
                    mods: osumodcalc.ModStringToInt(mods),
                    combo: maxcombo,
                    acc: acc || 100,
                    n300: hit300 != null || hit300 != NaN ? hit300 : 0,
                    n100: hit100 != null || hit100 != NaN ? hit100 : 0,
                    n50: hit50 != null || hit50 != NaN ? hit50 : 0,
                    nMisses: miss != null || miss != NaN ? miss : 0,
                    nKatu: hitkatu != null || hitkatu != NaN ? hitkatu : 0,
                    score: score != null || score != NaN ? score : 0,
                    passedObjects: passedObj
                }
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


            break;
        case 1:
            scorenofc = {
                beatmap_id: `${mapid}`,
                score: `${score}`,
                max_combo: `${maxcombo}`,
                count50: `${hit50}`,
                count100: `${hit100}`,
                count300: `${hit300}`,
                countmiss: `${miss}`,
                countkatu: `${hitkatu}`,
                countgeki: `${hitgeki}`,
                perfect: '1',
                enabled_mods: `${osumodcalc.ModStringToInt(mods)}`,
                user_id: '1',
                date: '2022-01-01 00:00:00',
                rank: 'S',
                score_id: '1',
            }
            scorefc = {
                beatmap_id: `${mapid}`,
                score: `${score}`,
                max_combo: `${maxcombo}`,
                count50: `${hit50}`,
                count100: `${hit100}`,
                count300: `${hit300}`,
                countmiss: `0`,
                countkatu: `${hitkatu}`,
                countgeki: `${hitgeki}`,
                perfect: '1',
                enabled_mods: `${osumodcalc.ModStringToInt(mods)}`,
                user_id: '1',
                date: '2022-01-01 00:00:00',
                rank: 'S',
                score_id: '1',
            }
            let ppint;
            let ppfcint;

            switch (calctyper) {
                case 0:
                    ppint = new booba.std_ppv2().setPerformance(scorenofc)
                    ppfcint = new booba.std_ppv2().setPerformance(scorefc)
                    break;
                case 1:
                    ppint = new booba.taiko_ppv2().setPerformance(scorenofc)
                    ppfcint = new booba.taiko_ppv2().setPerformance(scorefc)
                    break;
                case 2:
                    ppint = new booba.catch_ppv2().setPerformance(scorenofc)
                    ppfcint = new booba.catch_ppv2().setPerformance(scorefc)
                    break;
                case 3:
                    ppint = new booba.mania_ppv2().setPerformance(scorenofc)
                    ppfcint = new booba.mania_ppv2().setPerformance(scorefc)
                    break;
            }
            try {
                ppl = {
                    pp: await ppint.compute(),
                    ppfc: await ppfcint.compute(),
                    error: null
                }
            } catch (error) {
                ppl = {
                    pp: NaN,
                    ppfc: NaN,
                    error: error
                }
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
    let strains: any;
    switch (calctype) {
        case 0: default:
            switch (mode) {
                case 'osu':
                    let strains1 = JSON.parse(JSON.stringify(await rosu.strains(`files/maps/${mapid}.osu`, osumodcalc.ModStringToInt(mods)), null, 2));
                    let aimval = strains1.aim;
                    let aimnoslideval = strains1.aimNoSliders;
                    let speedval = strains1.speed;
                    let flashlightval = strains1.flashlight;
                    let straintimes = [];
                    let totalval = [];

                    //let div = aimval.length / 200;
                    for (let i = 0; i < aimval.length; i++) {
                        //let offset = Math.ceil(i * div);
                        let offset = i
                        let curval = aimval[offset] + aimnoslideval[offset] + speedval[offset] + flashlightval[offset];
                        totalval.push(curval)

                        let curtime = ((strains1.section_length / 1000) * (i + 1))
                        let curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + (curtime % 60).toFixed(2) : (curtime % 60).toFixed(2)}`;
                        straintimes.push(curtimestr);
                    }
                    strains = {
                        strainTime: straintimes,
                        value: totalval,
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
 * @returns graph url
 */
async function graph(x: number[] | string[], y: number[], label: string, startzero: boolean | null, reverse: boolean | null, showlabelx: boolean | null, showlabely: boolean | null, fill: boolean | null, settingsoverride: string | null) {

    if (startzero == null) {
        startzero = true
    }
    if (reverse == null) {
        reverse = false
    }
    if (showlabelx == null) {
        showlabelx = false
    }
    if (showlabely == null) {
        showlabely = false
    }
    if (fill == null) {
        fill = false
    }
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
            showlabely = false
            showlabelx = true
            startzero = true
            break;
        default:
            break;
    }

    let curx = []
    let cury = []

    if (y.length > 200) {
        let div = y.length / 200;
        for (let i = 0; i < 200; i++) {
            let offset = Math.ceil(i * div);
            let curval = y[offset];
            cury.push(curval)
            curx.push(x[offset]);
        }
    } else {
        curx = x
        cury = y
    }

    const chart = new charttoimg()
        .setConfig({
            type: 'line',
            data: {
                labels: curx,
                datasets: [{
                    label: label,
                    data: cury,
                    fill: fill,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                    pointRadius: 0
                }]
            },
            options: {
                legend: {
                    display: false
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
    mods: string, gamemode: string, path: string|null,
    calctype: number | null
) {
    let ppl
    let mapscore
    let calctyper = osumodcalc.ModeNameToInt(gamemode)

    if(path == null){
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

export { mapcalc, scorecalc, straincalc, graph, mapcalclocal } 