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
 * @returns 
 */
async function scorecalc(
    mods: string, gamemode: string, mapid: number,
    hitgeki: number, hit300: number, hitkatu: number, hit100: number, hit50: number, miss: number,
    acc: number, maxcombo: number, score: number,
    calctype: number | null
) {
    let ppl;
    let scorenofc;
    let scorefc;
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


            scorenofc = {
                path: `files/maps/${mapid}.osu`,
                params: [
                    {
                        mode: gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        combo: maxcombo,
                        acc: acc,
                        n300: hit300 + hitgeki,
                        n100: hit100,
                        n50: hit50,
                        nMisses: miss,
                        nKatu: hitkatu,
                        score: score,

                    },
                    {
                        mode: gamemode,
                        mods: osumodcalc.ModStringToInt(mods),
                        acc: acc,
                        n300: hit300 + hitgeki,
                        n100: hit100,
                        n50: hit50,
                        nMisses: 0,
                        nKatu: hitkatu,
                        score: score,
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
                    let strains1 = await rosu.strains(`files/maps/${mapid}.osu`, osumodcalc.ModStringToInt(mods))
                    let aimval = strains1.aim;
                    let aimnoslideval = strains1.aimNoSliders;
                    let speedval = strains1.speed;
                    let flashlightval = strains1.flashlight;
                    let straintimes = [];
                    let totalval = [];

                    for (let i = 0; i < aimval.length; i++) {
                        let curval = aimval[i] + aimnoslideval[i] + speedval[i] + flashlightval[i] != NaN ? flashlightval[i] : 0
                        totalval.push(curval)
                        straintimes.push((strains1.sectionLength / 1000) * (i + 1))
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
            showlabely = true
            showlabelx = true
            break;
        default:
            break;
    }

    const chart = new charttoimg()
        .setConfig({
            type: 'line',
            data: {
                labels: x,
                datasets: [{
                    label: label,
                    data: y,
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
                            display: showlabelx
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
export { mapcalc, scorecalc, straincalc, graph } 