
export type OverallDifficultyObj = {
    hitwindow_300: number,
    hitwindow_100: number,
    hitwindow_50: number,
    od_num?: number,
}
export type ApproachRateObj = {
    ar: number,
    ms: number,
}
export type AccGra = {
    grade: string,
    accuracy: number
}
export type ValObj = {
    cs: number,
    ar: number,
    od: number,
    hp: number,
    bpm?: number,
    length?: number,
    mods?: string,
    error?: string | boolean,
    details?: {
        csRadius: number,
        arMs: number,
        odMs: OverallDifficultyObj,
        lengthFull: string,
    }
}
export type ModList =
    'EZ' | 'HD' | 'FI' | 'HT' | 'DT' | 'NC' | 'HR' | 'SD' | 'PF' | 'FL' | 'NF' | 'AT' | 'RX' | 'AP' | 'TP' | 'SO' | 'TD' | '1K' | '2K' | '3K' | '4K' | '5K' | '6K' | '7K' | '8K' | '9K' | 'CP' | 'RD' | 'MR'


/**
 * 
 * @param ar approach rate
 * @returns approach rate if the double time mod is applied
 */
function DoubleTimeAR(ar: number) {
    /*     if (ar > 5) {
            ms = 200 + (11 - ar) * 100;
        }
        else {
            ms = 800 + (5 - ar) * 80;
        } */
    const ms = ar > 5 ? 200 + (11 - ar) * 100 : 800 + (5 - ar) * 80;
    let newAR: number;
    if (ms < 300) {
        newAR = 11
    }
    else if (ms < 1200) {
        newAR = Math.round((11 - (ms - 300) / 150) * 100) / 100;
    }
    else {
        newAR = Math.round((5 - (ms - 1200) / 120) * 100) / 100;
    }
    const arobj: ApproachRateObj = {
        ar: newAR,
        ms: ms,
    }
    return arobj;
}
/**
 * 
 * @param ar approach rate
 * @returns approach rate if the half time mod is applied
 */
function HalfTimeAR(ar: number) {
    let newAR: number;
    /*     if (ar > 5) {
            ogtoms = 1200 - (((ar - 5) * 10) * 15)
        }
        else {
            ogtoms = 1800 - (((ar) * 10) * 12)
        } */
    const ogtoms = ar > 5 ? 200 + (11 - ar) * 100 : 800 + (5 - ar) * 80;
    const ms = ogtoms * (4 / 3);

    if (ms < 300) {
        newAR = 11
    }
    else if (ms < 1200) {
        newAR = Math.round((11 - (ms - 300) / 150) * 100) / 100;
    }
    else {
        newAR = Math.round((5 - (ms - 1200) / 120) * 100) / 100;
    }
    const arobj: ApproachRateObj = {
        ar: newAR,
        ms: ms,
    }
    return arobj;
}
/**
 * 
 * @param od overall difficulty / accuracy
 * @returns hitwindow values in milliseconds
 */
function ODtoms(od: number) {
    const rangeobj: OverallDifficultyObj = {
        hitwindow_300: 79 - (od * 6) + 0.5,
        hitwindow_100: 139 - (od * 8) + 0.5,
        hitwindow_50: 199 - (od * 10) + 0.5,
    }
    return rangeobj;
}
/**
 * 
 * @param ar approach rate
 * @returns approach rate converted to milliseconds
 */
function ARtoms(ar: number) {
    /*     if (ar > 5) {
            ogtoms = 1200 - (((ar - 5) * 10) * 15)
        }
        else {
            ogtoms = 1800 - (((ar) * 10) * 12)
        } */
    const ogtoms = ar > 5 ? 1200 - (((ar - 5) * 10) * 15) : 1800 - (((ar) * 10) * 12)
    return ogtoms;
}
/**
 * 
 * @param hitwindow300 300 hit window in milliseconds
 * @param hitwindow100 100 hit window in milliseconds
 * @param hitwindow50 50 hit window in milliseconds
 * @info set a value to a string to ignore
 * @returns od (overall difficulty)
 */
function msToOD(hitwindow300: number, hitwindow100: number, hitwindow50: number) {
    let od: string;
    if (!isNaN(hitwindow300)) {
        od = ((79.5 - hitwindow300) / 6).toFixed(2)
    }
    else if (!isNaN(hitwindow100)) {
        od = ((139.5 - hitwindow100) / 8).toFixed(2)
    }
    else if (!isNaN(hitwindow50)) {
        od = ((199.5 - hitwindow50) / 10).toFixed(2)
    } else {
        od = '???'
    }
    if (parseFloat(od) > 11) {
        od = '11'
    }
    return parseFloat(od);
}
/**
 * 
 * @param ms milliseconds
 * @returns ar (approach rate)
 */
function msToAR(ms: number) {
    let ar: number
    if (ms < 300) {
        ar = 11
    }
    else if (ms < 1200) {
        ar = Math.round((11 - (ms - 300) / 150) * 100) / 100;
    }
    else {
        ar = Math.round((5 - (ms - 1200) / 120) * 100) / 100;
    }
    return ar
}



/**
 * 
 * @param od overall difficulty / accuracy
 * @returns ms values for the od hitwindows and converts to double time
 */
function odDT(od: number) {
    const range300 = (79 - (od * 6) + 0.5) * 2 / 3
    const odobj: OverallDifficultyObj = {
        hitwindow_300: range300,
        hitwindow_100: (139 - (od * 8) + 0.5) * 2 / 3,
        hitwindow_50: (199 - (od * 10) + 0.5) * 2 / 3,
        od_num: parseFloat(((79.5 - range300) / 6).toFixed(2)) > 11 ? 11 : parseFloat(((79.5 - range300) / 6).toFixed(2)),
    }

    return odobj;

}
/**
 * 
 * @param od overall difficulty / accuracy
 * @returns ms values for the od hitwindows and converts to half time
 */
function odHT(od: number) {
    const range300 = (79 - (od * 6) + 0.5) * 4 / 3
    const odobj = {
        hitwindow_300: range300,
        hitwindow_100: (139 - (od * 8) + 0.5) * 4 / 3,
        hitwindow_50: (199 - (od * 10) + 0.5) * 4 / 3,
        od_num: parseFloat(((79.5 - range300) / 6).toFixed(2)) > 11 ? 11 : parseFloat(((79.5 - range300) / 6).toFixed(2)),
    }

    return odobj;
}
//https://osu.ppy.sh/wiki/en/Gameplay/Accuracy
/**
 * 
 * @param hit300 - hit 300s (100%)
 * @param hit100 - hit 100s (33.33%)
 * @param hit50  - hit 50s (16.66%)
 * @param miss - hit 0s/misses (0%)
 * @returns an array containing grades and accuracy
 */
function calcgrade(hit300: number, hit100: number, hit50: number, miss: number) {
    const totalhits = hit300 + hit100 + hit50 + miss
    const equation = ((Math.floor((300 * hit300) + (100 * hit100) + (50 * hit50))) / (Math.floor(300 * (hit300 + hit100 + hit50 + miss)))) * 100
    //https://osu.ppy.sh/wiki/en/FAQ#grades
    let grade = 'D';
    if (hit300 / totalhits > 0.6) {
        grade = 'C'
    }
    if ((hit300 / totalhits > 0.7 && miss == 0) || (hit300 / totalhits > 0.8)) {
        grade = 'B'
    }
    if ((hit300 / totalhits > 0.8 && miss == 0) || (hit300 / totalhits > 0.9)) {
        grade = 'A'
    }
    if (Math.abs(hit300 / totalhits) > 0.9 && miss == 0 && Math.abs(hit50 / totalhits) < 0.01) {
        grade = 'S'
    }
    if (hit100 < 1 && hit50 < 1 && miss == 0) {
        grade = 'SS'
    }
    const finalarr: AccGra = {
        grade: grade,
        accuracy: equation,
    }

    return finalarr;
}
/**
 * 
 * @param hit300 - hit 300s/greats (100%)
 * @param hit100 - hit 100s/good (50%)
 * @param miss - misses (0%)
 * @returns an array containing grades and accuracy
 */
function calcgradeTaiko(hit300: number, hit100: number, miss: number) {
    const equation = (Math.abs(hit300 + (hit100 / 2))) / (Math.abs(hit300 + hit100 + miss))
    //grade = 'https://osu.ppy.sh/wiki/en/FAQ#grades'
    let grade = 'D';
    if (equation > 0.8) {
        grade = 'B'
    }
    if (equation > 0.9) {
        grade = 'A'
    }
    if (equation > 0.95) {
        grade = 'S'
    }
    if (equation == 1) {
        grade = 'SS'
    }
    const finalarr: AccGra = {
        grade: grade,
        accuracy: equation * 100,
    }
    return finalarr;

}
/**
 * 
 * @param hit300 - fruits caught
 * @param hit100 - drops caught
 * @param hit50 - droplets caught
 * @param miss - misses
 * @param hitkatu - droplets missed
 * @returns an array containing grades and accuracy
 */
function calcgradeCatch(hit300: number, hit100: number, hit50: number, hitkatu: number, miss: number) {
    const equation = Math.floor(hit300 + hit100 + hit50) / Math.floor(hit300 + hit100 + hit50 + hitkatu + miss)
    let grade = 'D'
    if (equation > 0.85) {
        grade = 'C'
    }
    if (equation > 0.9) {
        grade = 'B'
    }
    if (equation > 0.94) {
        grade = 'A'
    }
    if (equation > 0.98) {
        grade = 'S'
    }
    if (equation == 1) {
        grade = 'SS'
    }

    const finalarr: AccGra = {
        grade: grade,
        accuracy: equation * 100,
    }
    return finalarr;
}
/**
 * 
 * @param hit300max - hit max/300+ (100%)
 * @param hit300 - hit 300 (100%)
 * @param hit200 - hit 200 (66.66%)
 * @param hit100 - hit 100 (33.33%)
 * @param hit50 - hit 50 (16.66%)
 * @param miss - miss (0%)
 * @returns an array containing grades and accuracy
 */
function calcgradeMania(hit300max: number, hit300: number, hit200: number, hit100: number, hit50: number, miss: number) {
    const equation = Math.floor((300 * (hit300max + hit300)) + (200 * hit200) + (100 * hit100) + (50 * hit50)) / Math.floor(300 * (hit300max + hit300 + hit200 + hit100 + hit50 + miss))
    let grade = 'D'
    if (equation > 0.7) {
        grade = 'C'
    }
    if (equation > 0.8) {
        grade = 'B'
    }
    if (equation > 0.9) {
        grade = 'A'
    }
    if (equation > 0.95) {
        grade = 'S'
    }
    if (equation == 1) {
        grade = 'SS'
    }
    const finalarr: AccGra = {
        grade: grade,
        accuracy: equation * 100,
    }
    return finalarr;


}
/**
 * 
 * @param cs circle size
 * @param ar approach rate
 * @param od overall difficulty
 * @param hp health
 * @returns values converted to HR
 */
function toHR(cs: number, ar: number, od: number, hp: number) {

    const hrobj: ValObj = {
        cs: cs * 1.3 > 10 ? 10 : cs * 1.3,
        ar: ar * 1.4 > 10 ? 10 : ar * 1.4,
        od: od * 1.4 > 10 ? 10 : od * 1.4,
        hp: hp * 1.4 > 10 ? 10 : hp * 1.4,
    }
    return hrobj;
}
/**
 * 
 * @param cs circle size
 * @param ar approach rate
 * @param od overall difficulty
 * @param hp health
 * @returns values converted to EZ
 */
function toEZ(cs: number, ar: number, od: number, hp: number) {

    const ezobj: ValObj = {
        cs: cs / 2 > 10 ? 10 : cs / 2,
        ar: ar / 2 > 10 ? 10 : ar / 2,
        od: od / 2 > 10 ? 10 : od / 2,
        hp: hp / 2 > 10 ? 10 : hp / 2,
    }
    return ezobj;
}

export enum ModsLong {
    None = 0,
    NoFail = 1,
    Easy = 2,
    TouchDevice = 4,
    Hidden = 8,
    HardRock = 16,
    SuddenDeath = 32,
    DoubleTime = 64,
    Relax = 128,
    HalfTime = 256,
    Nightcore = 512, // Only set along with DoubleTime. i.e: NC only gives 576
    Flashlight = 1024,
    Autoplay = 2048,
    SpunOut = 4096,
    AutoPilot = 8192,
    Perfect = 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416
    Key4 = 32768,
    Key5 = 65536,
    Key6 = 131072,
    Key7 = 262144,
    Key8 = 524288,
    FadeIn = 1048576,
    Random = 2097152,
    Cinema = 4194304,
    Target = 8388608,
    Key9 = 16777216,
    KeyCoop = 33554432,
    Key1 = 67108864,
    Key3 = 134217728,
    Key2 = 268435456,
    ScoreV2 = 536870912,
    Mirror = 1073741824
}
export enum ModShort {
    NM = 0,
    NF = 1,
    EZ = 2,
    TD = 4,
    HD = 8,
    HR = 16,
    SD = 32,
    DT = 64,
    RX = 128,
    HT = 256,
    NC = 512,
    FL = 1024,
    AT = 2048,
    SO = 4096,
    AP = 8192,
    PF = 16384,
    '4K' = 32768,
    '5K' = 65536,
    '6K' = 131072,
    '7K' = 262144,
    '8K' = 524288,
    FI = 1048576,
    RD = 2097152,
    CN = 4194304,
    TP = 8388608,
    '9K' = 16777216,
    CP = 33554432,
    '1K' = 67108864,
    '3K' = 134217728,
    '2K' = 268435456,
    V2 = 536870912,
    MR = 1073741824
}

/**
 * 
 * @param mods 
 * @returns {int} converts mods to an integer (HDDTHR = 88)
 */
function ModStringToInt(mods: string) {
    let modInt = 0;

    modInt += mods.toUpperCase().includes('NF') ? 1 : 0;
    modInt += mods.toUpperCase().includes('EZ') ? 2 : 0;
    modInt += mods.toUpperCase().includes('TD') ? 4 : 0;
    modInt += mods.toUpperCase().includes('HD') ? 8 : 0;
    modInt += mods.toUpperCase().includes('HR') ? 16 : 0;
    modInt += mods.toUpperCase().includes('SD') ? 32 : 0;
    modInt += mods.toUpperCase().includes('DT') ? 64 : 0;
    modInt += mods.toUpperCase().includes('RX') || mods.toUpperCase().includes('RL') || mods.toUpperCase().includes('RLX') ? 128 : 0;
    modInt += mods.toUpperCase().includes('HT') ? 256 : 0;
    modInt += mods.toUpperCase().includes('NC') ? 512 + 64 : 0;
    modInt += mods.toUpperCase().includes('FL') ? 1024 : 0;
    modInt += mods.toUpperCase().includes('AT') ? 2048 : 0;
    modInt += mods.toUpperCase().includes('SO') ? 4096 : 0;
    modInt += mods.toUpperCase().includes('AP') || mods.toUpperCase().includes('RX2') ? 8192 : 0;
    modInt += mods.toUpperCase().includes('PF') ? 16384 + 32 : 0;
    modInt += mods.toUpperCase().includes('1K') ? 67108864 : 0;
    modInt += mods.toUpperCase().includes('2K') ? 268435456 : 0;
    modInt += mods.toUpperCase().includes('3K') ? 134217728 : 0;
    modInt += mods.toUpperCase().includes('4K') ? 32768 : 0;
    modInt += mods.toUpperCase().includes('5K') ? 65536 : 0;
    modInt += mods.toUpperCase().includes('6K') ? 131072 : 0;
    modInt += mods.toUpperCase().includes('7K') ? 262144 : 0;
    modInt += mods.toUpperCase().includes('8K') ? 524288 : 0;
    modInt += mods.toUpperCase().includes('9K') ? 16777216 : 0;
    modInt += mods.toUpperCase().includes('FI') ? 1048576 : 0;
    modInt += mods.toUpperCase().includes('RDM') ? 2097152 : 0;
    modInt += mods.toUpperCase().includes('CN') ? 4194304 : 0;
    modInt += mods.toUpperCase().includes('TP') ? 8388608 : 0;
    modInt += mods.toUpperCase().includes('KC') ? 33554432 : 0;
    modInt += mods.toUpperCase().includes('SV2') || mods.toUpperCase().includes('S2') ? 536870912 : 0;
    modInt += mods.toUpperCase().includes('MR') ? 1073741824 : 0;
    return modInt;
}

/**
 * 
 * @param modInt 
 * @returns converts mod integers to a string (88 = HDDTHR)
 */
function ModIntToString(modInt: number) {
    let modString = '';
    modString += modInt & 1 ? 'NF' : '';
    modString += modInt & 2 ? 'EZ' : '';
    modString += modInt & 4 ? 'TD' : '';
    modString += modInt & 8 ? 'HD' : '';
    modString += modInt & 16 ? 'HR' : '';
    modString += modInt & 32 ? 'SD' : '';
    modString += modInt & 64 ? 'DT' : '';
    modString += modInt & 128 ? 'RX' : '';
    modString += modInt & 256 ? 'HT' : '';
    modString += modInt & 512 ? 'NC' : '';
    modString += modInt & 1024 ? 'FL' : '';
    modString += modInt & 2048 ? 'AT' : '';
    modString += modInt & 4096 ? 'SO' : '';
    modString += modInt & 8192 ? 'AP' : '';
    modString += modInt & 16384 ? 'PF' : '';
    modString += modInt & 67108864 ? '1K' : '';
    modString += modInt & 268435456 ? '2K' : '';
    modString += modInt & 134217728 ? '3K' : '';
    modString += modInt & 32768 ? '4K' : '';
    modString += modInt & 65536 ? '5K' : '';
    modString += modInt & 131072 ? '6K' : '';
    modString += modInt & 262144 ? '7K' : '';
    modString += modInt & 524288 ? '8K' : '';
    modString += modInt & 16777216 ? '9K' : '';
    modString += modInt & 1048576 ? 'FI' : '';
    modString += modInt & 2097152 ? 'RD' : '';
    modString += modInt & 4194304 ? 'CN' : '';
    modString += modInt & 8388608 ? 'TP' : '';
    modString += modInt & 33554432 ? 'KC' : '';
    modString += modInt & 536870912 ? 'SV2' : '';
    modString += modInt & 1073741824 ? 'MR' : '';
    if (modString.includes('DT') && modString.includes('NC')) {
        modString = modString.replace('DT', '')
    }
    if (modString.includes('SD') && modString.includes('PF')) {
        modString = modString.replace('SD', '')
    }
    return OrderMods(modString);
}
/**
 * 
 * @param modString 
 * @returns reorders mods to be in the correct order and removes duplicates.
 */
function OrderMods(modString: string) {
    const ModsOrder: ModList[] = ['EZ', 'HD', 'FI', 'HT', 'DT', 'NC', 'HR', 'SD', 'PF', 'FL', 'NF', 'AT', 'RX', 'AP', 'TP', 'SO', 'TD', '1K', '2K', '3K', '4K', '5K', '6K', '7K', '8K', '9K', 'CP', 'RD', 'MR']
    const modStringArray = modString.toUpperCase().replaceAll(' ', '').replaceAll(',', '').replace(/(.{2})/g, "$1 ")
        .replaceAll('RLX', 'RX')
        .replaceAll('RL', 'RX')
        .replaceAll('AU', 'AT')
        .split(' ')
    const modStringArrayOrdered = []
    const modStringArrayOrderedtest = []
    for (let i = 0; i < ModsOrder.length; i++) {
        for (let j = 0; j < modStringArray.length; j++) {
            if (ModsOrder[i] === modStringArray[j]) {
                modStringArrayOrderedtest.push(modStringArray[j])
            }
        }
    }
    for (let i = 0; i < modStringArrayOrderedtest.length; i++) {
        if (modStringArrayOrderedtest.indexOf(modStringArrayOrderedtest[i]) === i) {
            modStringArrayOrdered.push(modStringArrayOrderedtest[i])
        }
    }

    return modStringArrayOrdered.join('')
}


/**
 * 
 * @param modstring 
 * @returns converts mod strings to their shorthand name ie nightcore -> NC
 */
function shortModName(modstring: string) {
    return OrderMods(modstring.toLowerCase()
        .replaceAll(' ', '')
        .replaceAll('-', '')
        .replaceAll('nofail', 'NF')
        .replaceAll('easy', 'EZ')
        .replaceAll('touchdevice', 'TD')
        .replaceAll('touchscreen', 'TD')
        .replaceAll('touch', 'TD')
        .replaceAll('hidden', 'HD')
        .replaceAll('hardrock', 'HR')
        .replaceAll('suddendeath', 'SD')
        .replaceAll('doubletime', 'DT')
        .replaceAll('relax', 'RX')
        .replaceAll('halftime', 'HT')
        .replaceAll('nightcore', 'NC')
        .replaceAll('flashlight', 'FL')
        .replaceAll('auto', 'AT')
        .replaceAll('spunout', 'SO')
        .replaceAll('autopilot', 'AP')
        .replaceAll('perfect', 'PF')
        .replaceAll('key1', '1K')
        .replaceAll('key2', '2K')
        .replaceAll('key3', '3K')
        .replaceAll('key4', '4K')
        .replaceAll('key5', '5K')
        .replaceAll('key6', '6K')
        .replaceAll('key7', '7K')
        .replaceAll('key8', '8K')
        .replaceAll('key9', '9K')
        .replaceAll('fadein', 'FI')
        .replaceAll('random', 'RD')
        .replaceAll('cinema', 'CN')
        .replaceAll('targetpractice', 'TP')
        .replaceAll('keycoop', 'KC')
        .replaceAll('coop', 'KC')
        .replaceAll('co-op', 'KC')
        .replaceAll('scorev2', 'S2')
        .replaceAll('mirror', 'MR'))
        ;
}
/**
 * 
 * @param modstring 
 * @returns converts mod strings to their full name ie NC -> nightcore
 */
// do the opposite of above
function longModName(modstring: string) {
    return (OrderMods(modstring))
        .replaceAll(' ', '')
        .replaceAll('-', '')
        .replaceAll('NF', 'NoFail ')
        .replaceAll('EZ', 'Easy ')
        .replaceAll('TD', 'TouchDevice ')
        .replaceAll('HD', 'Hidden ')
        .replaceAll('HR', 'HardRock ')
        .replaceAll('SD', 'SuddenDeath ')
        .replaceAll('DT', 'DoubleTime ')
        .replaceAll('RX', 'Relax ')
        .replaceAll('HT', 'HalfTime ')
        .replaceAll('NC', 'Nightcore ')
        .replaceAll('FL', 'Flashlight ')
        .replaceAll('AT', 'Auto ')
        .replaceAll('SO', 'SpunOut ')
        .replaceAll('AP', 'AutoPilot ')
        .replaceAll('PF', 'Perfect ')
        .replaceAll('1K', 'Key1 ')
        .replaceAll('2K', 'Key2 ')
        .replaceAll('3K', 'Key3 ')
        .replaceAll('4K', 'Key4 ')
        .replaceAll('5K', 'Key5 ')
        .replaceAll('6K', 'Key6 ')
        .replaceAll('7K', 'Key7 ')
        .replaceAll('8K', 'Key8 ')
        .replaceAll('9K', 'Key9 ')
        .replaceAll('FI', 'FadeIn ')
        .replaceAll('RD', 'Random ')
        .replaceAll('CN', 'Cinema ')
        .replaceAll('TP', 'TargetPractice ')
        .replaceAll('KC', 'Co-op ')
        .replaceAll('S2', 'ScoreV2 ')
        .replaceAll('MR', 'Mirror ')
        ;
}

/**
 * 
 * @param cs circle size
 * @returns the radius of the circle
 */
function csToRadius(cs: number) {
    return (0.00005556 * cs ** 2 - 4.483 * cs + 54.42)
}

/**
 * 
 * @param radius the radius of the circle
 * @returns cs circle size
 */

function csFromRadius(radius: number) {
    return (5000 / 8104533921) * radius ** 2 - (1808448550 / 8104533921) * radius + (8582285633270972 / 706821088118109)
}

/**
 * 
 * @param cs circle size
 * @param ar approach rate
 * @param od overall difficulty
 * @param hp health
 * @param bpm beats per minute
 * @param length length in seconds
 * @param mods mods
 */
function calcValues(cs: number, ar: number, od: number, hp: number, bpm: number, length: number, mods: string) {
    let ncs: number = cs;
    let nar: number = ar;
    let nod: number = od;
    let nhp: number = hp;
    let nbpm: number = bpm;
    let nlength: number = length;
    let error: string | boolean = false;
    const nmods = mods.includes('NC') ? mods.toUpperCase().replace('NC', 'DT') : mods.toUpperCase();


    switch (true) {
        case ((nmods.includes('HR') && nmods.includes('EZ')) || (nmods.includes('DT') && nmods.includes('HT'))):
            ncs = cs
            nar = ar
            nod = od
            nhp = hp
            nbpm = bpm
            nlength = length
            if (nmods.includes('HR') && nmods.includes('EZ')) {
                error = 'HR and EZ are not compatible'
            } else if (nmods.includes('DT') && nmods.includes('HT')) {
                error = 'DT and HT are not compatible'
            } else {
                error = 'Invalid mod combination'
            }
            break;
        case (nmods.includes('HR') && !nmods.includes('DT') && !nmods.includes('HT')):
            ncs = cs * 1.3 > 10 ? 10 : cs * 1.3;
            nar = ar * 1.4 > 10 ? 10 : ar * 1.4;
            nod = od * 1.4 > 10 ? 10 : od * 1.4;
            nhp = hp * 1.4 > 10 ? 10 : hp * 1.4;
            break;
        case (nmods.includes('EZ') && !nmods.includes('DT') && !nmods.includes('HT')):
            ncs = cs * 0.5 > 10 ? 10 : cs * 0.5;
            nar = ar * 0.5 > 10 ? 10 : ar * 0.5;
            nod = od * 0.5 > 10 ? 10 : od * 0.5;
            nhp = hp * 0.5 > 10 ? 10 : hp * 0.5;
            break;
        case (nmods.includes('DT') && !nmods.includes('HR') && !nmods.includes('EZ')):
            ncs = cs
            nar = DoubleTimeAR(ar).ar
            nod = odDT(od).od_num
            nhp = hp

            nbpm = bpm * 1.5
            nlength = length / 1.5
            break;
        case (nmods.includes('HT') && !nmods.includes('HR') && !nmods.includes('EZ')):
            ncs = cs
            nar = HalfTimeAR(ar).ar
            nod = odHT(od).od_num
            nhp = hp

            nbpm = bpm * 0.75
            nlength = length / 0.75
            break;
        case (nmods.includes('DT') && nmods.includes('EZ')):
            ncs = cs * 0.5
            nar = DoubleTimeAR(ar * 0.5).ar
            nod = odDT(od * 0.5).od_num
            nhp = hp * 0.5

            nbpm = bpm * 1.5
            nlength = length / 1.5
            break;
        case (nmods.includes('DT') && nmods.includes('HR')):
            ncs = cs * 1.3 > 10 ? 10 : cs * 1.3;
            nar = DoubleTimeAR(ar * 1.4 > 10 ? 10 : ar * 1.4).ar
            nod = odDT(od * 1.4 > 10 ? 10 : od * 1.4).od_num
            nhp = hp * 1.4 > 10 ? 10 : hp * 1.4;

            nbpm = bpm * 1.5
            nlength = length / 1.5
            break;
        case (nmods.includes('HT') && nmods.includes('EZ')):
            ncs = cs * 0.5
            nar = HalfTimeAR(ar * 0.5).ar
            nod = odHT(od * 0.5).od_num
            nhp = hp * 0.5

            nbpm = bpm * 0.75
            nlength = length / 0.75
            break;
        case (nmods.includes('HT') && nmods.includes('HR')):
            ncs = cs * 1.3 > 10 ? 10 : cs * 1.3;
            nar = HalfTimeAR(ar * 1.4 > 10 ? 10 : ar * 1.4).ar
            nod = odHT(od * 1.4 > 10 ? 10 : od * 1.4).od_num
            nhp = hp * 1.4 > 10 ? 10 : hp * 1.4;

            nbpm = bpm * 0.75
            nlength = length / 0.75
            break;
        default:
            ncs = cs
            nar = ar
            nod = od
            nhp = hp
            nbpm = bpm
            nlength = length
            break;
    }

    const obj: ValObj = {
        cs: parseFloat(ncs.toFixed(2)),
        ar: parseFloat(nar.toFixed(2)),
        od: parseFloat(nod.toFixed(2)),
        hp: parseFloat(nhp.toFixed(2)),
        bpm: parseFloat(nbpm.toFixed(2)),
        length: parseFloat(nlength.toFixed(2)),
        mods: mods,
        error: error,
        details: {
            csRadius: csToRadius(ncs),
            arMs: ARtoms(nar),
            odMs: ODtoms(nod),
            //mm:ss
            lengthFull: nlength > 60 ?
                nlength % 60 < 10 ?
                    Math.floor(nlength / 60) + ':0' + Math.floor(nlength % 60) :
                    Math.floor(nlength / 60) + ':' + Math.floor(nlength % 60)
                :
                nlength % 60 < 10 ?
                    Math.floor(nlength / 60) + ':0' + Math.floor(nlength % 60) :
                    Math.floor(nlength / 60) + ':' + Math.floor(nlength % 60)
        }
    }
    return obj;
}
/**
 * 
 * @param mode mode to convert to its corresponding integer value
 * @returns integer value of the mode 
 */
function ModeNameToInt(mode: string): number {
    switch (mode) {
        case 'osu!std': case 'std': case 'osu': case 'o': case 'standard':
            return 0;
        case 'osu!taiko': case 'taiko': case 't':
            return 1;
        case 'osu!catch': case 'catch': case 'c': case 'fruits': case 'ctb': case 'catch the beat':
            return 2;
        case 'osu!mania': case 'mania': case 'm':
            return 3;
        default:
            return 0;
    }
}

/**
 * 
 * @param mode the gamemode to convert to a string
 * @returns osu standard, taiko, catch, or mania.
 */
function ModeIntToName(mode: number): string {
    switch (mode) {
        case 0:
            return 'osu';
        case 1:
            return 'taiko';
        case 2:
            return 'fruits';
        case 3:
            return 'mania';
        default:
            return 'osu';
    }
}

//module.exports = { DoubleTimeAR, HalfTimeAR, calcgrade, calcgradeTaiko, calcgradeCatch, calcgradeMania, odDT, odHT, ODtoms, ARtoms, msToAR, msToOD, toEZ, toHR, ModStringToInt, ModIntToString, OrderMods, shortModName, longModName, csToRadius, csFromRadius }
export {
    DoubleTimeAR, HalfTimeAR,
    calcgrade, calcgradeTaiko, calcgradeCatch, calcgradeMania,
    odDT, odHT,
    ODtoms, ARtoms, msToAR, msToOD,
    toEZ, toHR,
    ModStringToInt, ModIntToString, OrderMods, shortModName, longModName,
    csToRadius, csFromRadius,
    calcValues,
    ModeNameToInt, ModeIntToName
}

