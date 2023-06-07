//functions
import * as calc from './calc.js';
import * as checks from './checks.js';
import * as colour from './colourcalc.js';
import * as embed from './embed.js';
import * as func from './func.js';
import * as log from './log.js';
import * as osufunc from './osufunc.js';
import * as osumodcalc from './osumodcalc.js';
import * as osutrack from './trackfunc.js';
//


/**
 */
export const osu = {
    user: {
        bws: osumodcalc.bws,
        recdiff: osumodcalc.recdiff
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

export const functions = {
    osu,
    calc,
    checks,
    embed,
    func,
    log,
    osufunc,
    osutrack,
};

import * as extratypes from './types/extratypes.js';
import * as osuapitypes from './types/osuApiTypes.js';
import * as osuparsertypes from './types/osuparsertypes.js';
import * as osutrackertypes from './types/osutrackertypes.js';
import * as othertypes from './types/othertypes.js';

export const types = {
    ex: extratypes,
    osu: {
        api: osuapitypes,
        parser: osuparsertypes,
        tracker: osutrackertypes,
    },
    other: othertypes
};

import * as achievements from './consts/achievements.js';
import * as buttons from './consts/buttons.js';
import * as colours from './consts/colours.js';
import * as commandopts from './consts/commandopts.js';
import * as conversions from './consts/conversions.js';
import * as cooldown from './consts/cooldown.js';
import * as countries from './consts/countries.js';
import * as defaults from './consts/defaults.js';
import * as emojis from './consts/emojis.js';
import * as errors from './consts/errors.js';
import * as gif from './consts/gif.js';
import * as helpinfo from './consts/helpinfo.js';
import * as inspire from './consts/inspire.js';
import * as main from './consts/main.js';
import * as perms from './consts/permissions.js';
import * as tz from './consts/timezones.js';

export const consts = {
    achievements,
    colours,
    commandopts,
    conversions,
    cooldown,
    countries,
    defaults,
    emojis,
    errors,
    gif,
    helpinfo,
    inspire,
    main,
    perms,
    tz,
};