import rosu = require('rosu-pp');
import booba = require('booba');
import osumodcalc = require('osumodcalculator');
import osuapiext = require('osu-api-extended');
import fs = require('fs');

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

export { mapcalc, scorecalc } 