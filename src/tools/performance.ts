import * as fs from 'fs';
import * as osumodcalc from 'osumodcalculator';
import * as rosu from 'rosu-pp-js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';

/** */
export async function calcScore(input: {
    mapid: number,
    mode: rosu.GameMode,
    mods: string,
    accuracy: number,
    clockRate?: number,
    stats?: apitypes.ScoreStatistics,
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
    if (input.mode != map.mode && map.mode == rosu.GameMode.Osu) {
        map.convert(input.mode);
    }
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
    };
    const oldStats = helper.tools.other.lazerToOldStatistics(input.stats, input.mode);
    if (input.maxcombo != null && !isNaN(input.maxcombo)) {
        baseScore.combo = input.maxcombo;
    }
    if (input.passedObjects != null && !isNaN(input.passedObjects)) {
        baseScore.passedObjects = input.passedObjects;
    }
    if (oldStats.count_300 != null && !isNaN(oldStats.count_300)) {
        baseScore.n300 = oldStats.count_300;
    }
    if (oldStats.count_100 != null && !isNaN(oldStats.count_100)) {
        baseScore.n100 = oldStats.count_100;
    }
    if (oldStats.count_50 != null && !isNaN(oldStats.count_50)) {
        baseScore.n50 = oldStats.count_50;
    }
    if (oldStats.count_miss != null && !isNaN(oldStats.count_miss)) {
        baseScore.misses = oldStats.count_miss;
    }
    if (oldStats.count_katu != null && !isNaN(oldStats.count_katu)) {
        baseScore.nKatu = oldStats.count_katu;
    }
    if (input.customCS != null && !isNaN(input.customCS)) {
        baseScore.cs = input.customCS;
    }
    if (input.customAR != null && !isNaN(input.customAR)) {
        baseScore.ar = input.customAR;
    }
    if (input.customOD != null && !isNaN(input.customOD)) {
        baseScore.od = input.customOD;
    }
    if (input.customHP != null && !isNaN(input.customHP)) {
        baseScore.hp = input.customHP;
    }
    if (input.clockRate != null && !isNaN(input.clockRate)) {
        baseScore.clockRate = input.clockRate;
    }
    if (input.mods.includes('CL')) {
        baseScore.lazer = false;
    }
    const perf: rosu.Performance = new rosu.Performance(baseScore);

    const final = perf.calculate(map);
    perf.free();
    map.free();
    return final;
}
export async function calcFullCombo(input: {
    mapid: number,
    mode: rosu.GameMode,
    mods: string,
    accuracy: number,
    clockRate?: number,
    stats?: apitypes.ScoreStatistics,
    mapLastUpdated: Date,
    customCS?: number,
    customAR?: number,
    customOD?: number,
    customHP?: number,
}) {
    if(!input.stats){
        input.stats = helper.tools.formatter.nonNullStats(input.stats);
    }
    if(input.stats.great == 0 && input.stats.perfect == 0){
        input.stats.great = NaN
    }
    input.stats.miss = 0;
    return await calcScore({
        mapid: input.mapid,
        mode: input.mode,
        mods: input.mods,
        accuracy: input.accuracy,
        clockRate: input.clockRate,
        stats: input.stats,
        mapLastUpdated: input.mapLastUpdated,
        customCS: input.customCS,
        customAR: input.customAR,
        customOD: input.customOD,
        customHP: input.customHP
    });
}
export async function calcMap(input: {
    mapid: number,
    mode: rosu.GameMode,
    mods: string,
    mapLastUpdated: Date,
    clockRate: number,
    customCS?: number,
    customAR?: number,
    customOD?: number,
    customHP?: number,
}) {
    const values: rosu.PerformanceAttributes[] = [];
    for (let i = 0; i < 11; i++) {
        const temp = {
            mapid: input.mapid,
            mode: input.mode,
            mods: input.mods,
            mapLastUpdated: input.mapLastUpdated,
            clockRate: input.clockRate,
            accuracy: 100 - i,
            stats: {
                great: NaN,
                miss: 0,
            },
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
    mode: rosu.GameMode,
    mods: string,
    mapLastUpdated: Date,
}) {
    if (!fs.existsSync(helper.vars.path.main + '/files/maps/')) {
        helper.tools.log.stdout('creating files/maps/');
        fs.mkdirSync(helper.vars.path.main + '/files/maps/');
    }
    const mapPath = await helper.tools.api.dlMap(input.mapid, 0, input.mapLastUpdated);
    const map = new rosu.Beatmap(fs.readFileSync(mapPath, 'utf-8'));
    if (input.mode != map.mode && map.mode == rosu.GameMode.Osu) {
        map.convert(input.mode);
    }
    const strainValues =
        new rosu.Difficulty({
            mods: osumodcalc.ModStringToInt(input.mods),
        })
            .strains(map);
    const straintimes = [];
    const totalval = [];

    for (let i = 0; i < (strainValues?.aim ?? strainValues?.color ?? strainValues?.movement ?? strainValues?.strains).length; i++) {
        const offset = i;
        let curval: number;
        switch (input.mode) {
            case rosu.GameMode.Osu: default: {
                curval = strainValues.aim[offset] + strainValues.aimNoSliders[offset] + strainValues.speed[offset] + strainValues.flashlight[offset];
            } break;
            case rosu.GameMode.Taiko: {
                curval = strainValues.color[offset] + strainValues.rhythm[offset] + strainValues.stamina[offset];
            } break;
            case rosu.GameMode.Catch: {
                curval = strainValues.movement[offset];
            } break;
            case rosu.GameMode.Mania: {
                curval = strainValues.strains[offset];
            } break;
        }
        totalval.push(curval);

        const curtime = ((strainValues.sectionLength / 1000) * (i + 1));
        const curtimestr = Math.floor(curtime / 60) + ':' + `${(curtime % 60) < 10 ? '0' + Math.floor(curtime % 60) : Math.floor(curtime % 60)}`;
        straintimes.push(curtimestr);
    }
    const strains = {
        strainTime: straintimes,
        value: totalval,
    };
    map.free();
    return strains;
}
let x: rosu.GameMode;
export function template(mapdata: apitypes.Beatmap): rosu.PerformanceAttributes {
    return {
        pp: 0,
        estimatedUnstableRate: 0,
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
            nObjects: mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners,
            aimDifficultStrainCount: null,
            speedDifficultStrainCount: null,
            greatHitWindow: 0,
            nHoldNotes: 0,
            nLargeTicks: 0,
            monoStaminaFactor: 0,
            okHitWindow: 0
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