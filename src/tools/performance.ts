import * as fs from 'fs';
import * as osumodcalc from 'osumodcalculator';
import * as rosu from 'rosu-pp-js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';

/** */
export async function calcScore(input: {
    mapid: number,
    mode: apitypes.GameMode,
    mods: string,
    accuracy: number,
    clockRate?: number,
    hit300?: number;
    hit100?: number;
    hit50?: number;
    miss?: number;
    hitkatu?: number;
    maxcombo?: number,
    passedObjects?: number,
    mapLastUpdated: Date,
    customCS?: number,
    customAR?: number,
    customOD?: number,
    customHP?: number,
}) {
    if (!fs.existsSync(helper.vars.path.main + '/files/maps/')) {
        helper.tools.log.stdout('creating files/maps/');
        fs.mkdirSync(helper.vars.path.main + '/files/maps/');
    }
    const mapPath = await helper.tools.api.dlMap(input.mapid, 0, input.mapLastUpdated);
    const map = new rosu.Beatmap(fs.readFileSync(mapPath, 'utf-8'));
    const mods = input.mods ?
        input.mods.length < 1 ?
            'NM' :
            input.mods :
        'NM';

    if (isNaN(input.accuracy)) {
        input.accuracy = 100;
    }
    if (input.accuracy <= 1) {
        input.accuracy *= 100;
    }
    if (input.accuracy > 100) {
        input.accuracy /= 100;
    }
    const baseScore: rosu.PerformanceArgs = {
        mods: osumodcalc.ModStringToInt(mods),
        accuracy: input.accuracy ?? 100,
        clockRate: input.clockRate ?? 1,
    };
    if (input.maxcombo != null && !isNaN(input.maxcombo)) {
        baseScore['combo'] = input.maxcombo;
    }
    if (input.passedObjects != null && !isNaN(input.passedObjects)) {
        baseScore['passedObjects'] = input.passedObjects;
    }
    if (input.hit300 != null && !isNaN(input.hit300)) {
        baseScore['n300'] = input.hit300;
    }
    if (input.hit100 != null && !isNaN(input.hit100)) {
        baseScore['n100'] = input.hit100;
    }
    if (input.hit50 != null && !isNaN(input.hit50)) {
        baseScore['n50'] = input.hit50;
    }
    if (input.miss != null && !isNaN(input.miss)) {
        baseScore['misses'] = input.miss;
    }
    if (input.hitkatu != null && !isNaN(input.hitkatu)) {
        baseScore['nKatu'] = input.hitkatu;
    }
    if (input.customCS != null && !isNaN(input.customCS)) {
        baseScore['cs'] = input.customCS;
    }
    if (input.customAR != null && !isNaN(input.customAR)) {
        baseScore['ar'] = input.customAR;
    }
    if (input.customOD != null && !isNaN(input.customOD)) {
        baseScore['od'] = input.customOD;
    }
    if (input.customHP != null && !isNaN(input.customHP)) {
        baseScore['hp'] = input.customHP;
    }
    const perf: rosu.Performance = new rosu.Performance(baseScore);
    const final = perf.calculate(map);
    perf.free();
    map.free();
    return final;
}
export async function calcFullCombo(input: {
    mapid: number,
    mode: apitypes.GameMode,
    mods: string,
    accuracy: number,
    clockRate?: number,
    hit300?: number;
    hit100?: number;
    hit50?: number;
    hitkatu?: number;
    maxcombo?: number,
    mapLastUpdated: Date,
    customCS?: number,
    customAR?: number,
    customOD?: number,
    customHP?: number,
}) {
    input['miss'] = 0;
    return await calcScore(input);
}
export async function calcMap(input: {
    mapid: number,
    mode: apitypes.GameMode,
    mods: string,
    mapLastUpdated: Date,
    clockRate: number,
    customCS?: number,
    customAR?: number,
    customOD?: number,
    customHP?: number,
}) {
    const values: rosu.PerformanceAttributes[] = [];
    for (let i = 0; i < 10; i++) {
        let temp = {
            mapid: input.mapid,
            mode: input.mode,
            mods: input.mods,
            mapLastUpdated: input.mapLastUpdated,
            clockRate: input.clockRate,
            accuracy: 100 - i,
            miss: 0,
            customCS: input.customCS,
            customAR: input.customAR,
            customHP: input.customHP,
            customOD: input.customOD,
        };
        const calc = await calcScore(temp);
        values.push(calc);
    }
    return values;
}
export async function calcStrains(input: {
    mapid: number,
    mode: apitypes.GameMode,
    mods: string,
    mapLastUpdated: Date,
}) {
    if (!fs.existsSync(helper.vars.path.main + '/files/maps/')) {
        helper.tools.log.stdout('creating files/maps/');
        fs.mkdirSync(helper.vars.path.main + '/files/maps/');
    }
    const mapPath = await helper.tools.api.dlMap(input.mapid, 0, input.mapLastUpdated);
    const map = new rosu.Beatmap(fs.readFileSync(mapPath, 'utf-8'));
    map.convert(osumodcalc.ModeNameToInt(input.mode));
    let strainValues =
        new rosu.Difficulty({
            mods: osumodcalc.ModStringToInt(input.mods),
        })
            .strains(map);
    let strains: {
        strainTime: string[],
        value: number[],
    };
    const straintimes = [];
    const totalval = [];

    for (let i = 0; i < strainValues.aim.length; i++) {
        const offset = i;
        let curval: number;
        switch (input.mode) {
            case 'osu': default: {
                curval = strainValues.aim[offset] + strainValues.aimNoSliders[offset] + strainValues.speed[offset] + strainValues.flashlight[offset];
            } break;
            case 'taiko': {
                curval = strainValues.color[offset] + strainValues.rhythm[offset] + strainValues.stamina[offset];
            } break;
            case 'fruits': {
                curval = strainValues.movement[offset];
            } break;
            case 'mania': {
                curval = strainValues.strains[offset];
            } break;
        }
        totalval.push(curval);

        const curtime = ((strainValues.sectionLength / 1000) * (i + 1));
        const curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + Math.floor(curtime % 60) : Math.floor(curtime % 60)}`;
        straintimes.push(curtimestr);
    }
    strains = {
        strainTime: straintimes,
        value: totalval,
    };
    map.free();
    return strains;
}
let x:rosu.GameMode;
export function template(mapdata: apitypes.Beatmap) {
    return {
        pp: 0,
        difficulty: {
            mode: 0,
            stars: mapdata.difficulty_rating,
            maxCombo: mapdata.max_combo ?? 0,
            aim: 0,
            speed: 0,
            flashlight: 0,
            sliderFactor: 0,
            speedNoteCount: 0,
            ar: mapdata.ar,
            od: mapdata.accuracy,
            nCircles: mapdata.count_circles,
            nSliders: mapdata.count_sliders,
            nSpinners: mapdata.count_spinners,
            stamina: 0,
            rhythm: 0,
            color: 0,
            peak: 0,
            hitWindow: mapdata.accuracy,
            nFruits: mapdata.count_circles,
            nDroplets: mapdata.count_sliders,
            nTinyDroplets: mapdata.count_spinners,
            toJSON() {
                return { x: 'Hello world!' };
            },
            free() {
                return;
            },
            hp: mapdata.drain,
            isConvert: mapdata.convert,
            nObjects: mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners
        },
        ppAccuracy: 0,
        ppAim: 0,
        ppFlashlight: 0,
        ppSpeed: 0,
        effectiveMissCount: 0,
        ppDifficulty: 0,
        toJSON() {
            return { x: 'Hello world!' };
        },
        free() {
            return;
        },
        state: null
    } as rosu.PerformanceAttributes;
}