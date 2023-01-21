import * as osumodcalc from './osumodcalc.js';

//badge weight seeding
function bws(badges: number, rank: number) {
    return badges > 0 ?
        rank ** (0.9937 ** (badges ** 2)) :
        rank;
}

//recommended difficulty
function recdiff(pp: number) {
    return (pp ** 0.4) * 0.195;
}

/**
 * @param bws - returns badge weight seeding rank
 * @param recdiff - returns recommended difficulty
 */
export const osu = {
    user: {
        bws,
        recdiff
    },
    map: {
        all: osumodcalc.calcValues,
        arIfDT: osumodcalc.DoubleTimeAR,
        arIfHT: osumodcalc.HalfTimeAR,
        arInMs: osumodcalc.ARtoms,
        arFromMs: osumodcalc.msToAR,
        odIfDT: osumodcalc.odDT,
        odIfHT: osumodcalc.odHT,
        odInMs: osumodcalc.ODtoms,
        odFromMs: osumodcalc.msToOD,
        toEZ: osumodcalc.toEZ,
        toHR: osumodcalc.toHR,
        csToRadius: osumodcalc.csToRadius,
        csFromRadius: osumodcalc.csFromRadius
    },
    grade: {
        std: osumodcalc.calcgrade,
        taiko: osumodcalc.calcgradeTaiko,
        fruits: osumodcalc.calcgradeCatch,
        mania: osumodcalc.calcgradeMania,
        verify: osumodcalc.checkGrade
    },
    mods: {
        modToInt: osumodcalc.ModStringToInt,
        modToString: osumodcalc.ModIntToString,
        order: osumodcalc.OrderMods,
        shorten: osumodcalc.shortModName,
        long: osumodcalc.longModName,
        unranked_stable: osumodcalc.unrankedMods_stable,
        unranked_lazer: osumodcalc.unrankedMods_lazer
    },
    mode: {
        nameToInt: osumodcalc.ModeNameToInt,
        intToName: osumodcalc.ModeIntToName
    }
};
