import * as helper from '../helper.js';
import * as apitypes from '../types/osuapi.js';
import * as conversions from '../vars/conversions.js';
/**
 * eg 1,000 -> 1k
 * 1,000,000 -> 1m
 * 1,111,111 -> 1.111m
 * 111,111 -> 111.1k
 */
export function numberShorthand(input: number) {
    let value = +scientificNotation(input, 3);
    let output = input + '';
    switch (true) {
        case value >= 1e9:
            output = value / 1e9 + 'B';
        case value >= 1e8:
        case value >= 1e7:
        case value >= 1e6:
            output = value / 1e6 + 'M';
            break;
        case value >= 1e5:
        case value >= 1e4:
        case value >= 1e3:
            output = value / 1e3 + 'K';
            break;
    }
    return output;
}

/**
 * 
 * @param {number} a first number
 * @param {number} b number of significant figiures
 * @result converts the number to a significant figure
 */
export function sigfig(a: number, b: number) {
    if (isNaN(a)) return {
        number: a,
        sigfig: NaN,
    };
    const aAsArr = `${a}`.replaceAll('.', '').split('');
    if (b < 2 || b == null) { b = aAsArr.length; }
    const sigfig = aAsArr.slice(1, b).join('');
    let mult: number = Math.floor(a / parseFloat(aAsArr[0] + '.' + sigfig));
    if (mult < 1 && mult != 0) { mult = mult.toString().length - 1; }
    const answer = aAsArr[0] + '.' + sigfig + 'e' + sigfig.length + 1;
    return {
        number: answer,
        sigfig: sigfig.length + 1,
    };
}

export function scientificNotation(input: number, significantFigures: number) {
    let tNum: string = null;
    const numString = input.toString().replace(/[-.]/g, ''); // Remove "-" and "."
    const eIndex = numString.indexOf('e');
    const numLength = eIndex !== -1 ? eIndex : numString.length;

    if (numLength <= significantFigures) {
        tNum = `${input}`;
    } else if (input !== 0) {
        let exponent = 0;
        let i = 0;
        while (Math.abs(input) < 1 || Math.abs(input) >= 10) {
            i++;
            if (Math.abs(input) < 1) {
                input *= 10;
                exponent--;
            } else if (Math.abs(input) >= 10) {
                input /= 10;
                exponent++;
            }
        }
        let mantissa = input.toFixed(significantFigures - 1);
        // Code to ensure the number has the correct number of significant figures
        const xFig = significantFigures + (mantissa.match(/[-.]/g) || []).length;
        mantissa = mantissa.slice(0, xFig);
        mantissa = mantissa.slice(0, xFig);
        if (exponent !== 0) {
            tNum = `${mantissa}e${exponent}`;
        } else {
            tNum = mantissa;
        }
    } else {
        tNum = '0';
    }


    if (tNum.endsWith('.')) {
        tNum = tNum.replace('.', '');
    }

    return tNum;
}

/**
 * @info separates numbers eg. 3000000 -> 3,000,000
 * @param number 
 * @param separator default is ,
 * @returns string with numbers separated. Doesn't separate values after the decimal point.
 */
export function separateNum(number: string | number, separator?: string) {
    let cursep = ',';
    if (separator) {
        cursep = separator;
    }
    let ans = `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, cursep);
    if (`${number}`.includes('.')) {
        const init = `${number}`.split('.')[0];
        const after = `${number}`.split('.')[1];
        ans = init.replace(/\B(?=(\d{3})+(?!\d))/g, cursep) + `.${after}`;
    }
    return ans;
}

export function convert(input: string, output: string, value: number) {
    const tcat1 = helper.tools.other.removeSIPrefix(input);
    const tcat2 = helper.tools.other.removeSIPrefix(output);
    let hasErr = false;
    let usePre1 = true;
    let usePre2 = true;
    let formula: string = 'Conversion not found';
    let type: string = 'Invalid';
    let extra: string;
    let otherUnits: string = '-';
    let significantFigures: string = 'NaN';
    let change: string = 'Error';
    const numAsStr: string = value.toString();
    function inval() {
        hasErr = true;
    }
    function toName(x: conversions.convVal | conversions.convValCalc) {
        return x.names[1] ? `${x.names[0]} (${x.names[1]})` : x.names[0];
    }
    for (let i = 0; i < conversions.values.length; i++) {
        const curObject = conversions.values[i];
        if (!curObject) {
            inval();
            break;
        }

        const names: string[] = [];
        curObject.names.forEach(x => {
            if (x !== null) {
                names.push(x.toUpperCase());
            }
        });

        if (names.includes(tcat1.originalValue.toUpperCase()) || names.includes(input.toUpperCase())) {
            if (names.includes(input.toUpperCase()) && !names.includes(tcat1.originalValue.toUpperCase())) {
                usePre1 = false;
            }
            for (let j = 0; j < curObject.calc.length; j++) {
                const curCalc = curObject.calc[j];
                if (!curCalc) {
                    inval();
                    break;
                }
                const calcNames: string[] = [];
                curCalc.names.forEach(x => {
                    if (x !== null) {
                        calcNames.push(x.toUpperCase());
                    }
                });
                if (calcNames.includes(tcat2.originalValue.toUpperCase()) || calcNames.includes(output.toUpperCase())) {
                    let secondaryMetric = false;
                    formula = curCalc.text;

                    if (calcNames.includes(output.toUpperCase()) && !calcNames.includes(tcat2.originalValue.toUpperCase())) {
                        usePre2 = false;
                    }

                    for (let i = 0; i < conversions.values.length; i++) {
                        const curObject2 = conversions.values[i];
                        if (!curObject2) {
                            inval();
                            break;
                        }
                        const names2: string[] = [];
                        curObject2.names.forEach(x => {
                            if (x !== null) {
                                names2.push(x.toUpperCase());
                            }
                        });
                        if (names2.includes(tcat2.originalValue.toUpperCase()) && curObject2.system == 'Metric') {
                            secondaryMetric = true;
                        }
                    }
                    let fromType = curObject.name;
                    let toType = curCalc.to;
                    if (curObject.system == 'Metric' && tcat1.prefix.removed.length > 0 && usePre1) {
                        value *= tcat1.power;
                        fromType = tcat1.prefix?.long?.length > 0 ? helper.tools.formatter.toCapital(tcat1.prefix.long) + curObject.name.toLowerCase() : curObject.name;
                        const formStart = `${tcat1.power}`;
                        formula = `${formStart}*(${formula})`;
                    }

                    let outvalue = curCalc.func(value);
                    if (secondaryMetric && tcat2.prefix.removed.length > 0 && usePre2) {
                        outvalue /= tcat2.power;
                        toType = tcat2.prefix?.long?.length > 0 ? helper.tools.formatter.toCapital(tcat2.prefix.long) + curCalc.to.toLowerCase() : curCalc.to;
                        const formEnd = `${tcat2.power}`;
                        formula = `(${formula})/${formEnd}`;
                    }
                    type = curObject.type;
                    change = `${fromType} => ${toType}`;
                    significantFigures = scientificNotation(outvalue, helper.tools.calculate.getSigFigs(numAsStr));
                    const usVol = [];
                    otherUnits = curObject.calc
                        .filter(x => !x.names.includes('Arbitrary units'))
                        .map(x => toName(x))
                        .join(', ');
                    if (curObject.type == 'Volume' && (usVol.includes(curObject.name) || usVol.includes(curCalc.to))) {
                        extra = 'Using US measurements not Imperial';
                    }
                    return {
                        formula,
                        outvalue,
                        type,
                        hasErr,
                        extra,
                        significantFigures,
                        change,
                        otherUnits,
                    };
                    break;
                }
            }
        }
    }
    return {
        formula,
        NaN,
        type,
        hasErr,
        extra,
        significantFigures,
        change,
        otherUnits,
    };
}

export function toOrdinal(num: number) {
    let txt: string;
    if (num.toString().endsWith('1') && !num.toString().endsWith('11')) {
        txt = num + 'st';
    }
    else if (num.toString().endsWith('2') && !num.toString().endsWith('12')) {
        txt = num + 'nd';
    }
    else if (num.toString().endsWith('3') && !num.toString().endsWith('13')) {
        txt = num + 'rd';
    }
    else {
        txt = num + 'th';
    }
    return txt;
}

export function getSigFigs(number: string) {
    return `${number.includes('e') ? number.split('e')[0] : number}`.replace(/[\.\-]/gm, '').length;
}

export function numBaseToInt(input: "Binary" | "Octal" | "Decimal" | "Hexadecimal"): number {
    let out: number;
    switch (input) {
        case 'Binary':
            out = 2;
            break;
        case 'Octal':
            out = 8;
            break;
        case 'Decimal':
            out = 10;
            break;
        case 'Hexadecimal':
            out = 16;
            break;
    }
    return out;
}

export function numConvert(value: string, inBase: number, outBase: number) {
    const init = parseInt(value as string, inBase);
    const outVal = init.toString(outBase);
    return outVal;
}

export function numConvertTyping(string): "Binary" | "Octal" | "Decimal" | "Hexadecimal" {
    const nList = conversions.namesListBaseNum;
    let t: "Binary" | "Octal" | "Decimal" | "Hexadecimal" = null;
    switch (true) {
        case nList.bin.includes(string):
            t = 'Binary';
            break;
        case nList.oct.includes(string):
            t = 'Octal';
            break;
        case nList.dec.includes(string):
            t = 'Decimal';
            break;
        case nList.hex.includes(string):
            t = 'Hexadecimal';
            break;
    }
    return t;
}

/**
 * 
 * @param seconds seconds
 * @param allowDays whether or not to use days
 * @returns the time in hh:mm:ss format
 */
export function secondsToTime(seconds: number, allowDays?: boolean) {
    const days = Math.floor(seconds / 60 / 60 / 24).toString();
    const hours =
        allowDays == true ?
            (seconds / 60 / 60 % 24 < 10 ? '0' + Math.floor(seconds / 60 / 60 % 24) : Math.floor(seconds / 60 / 60 % 24)).toString()
            : (seconds / 60 / 60 < 10 ? '0' + Math.floor(seconds / 60 / 60) : Math.floor(seconds / 60 / 60)).toString();
    const minutes = seconds / 60 % 60 < 10 ? '0' + Math.floor(seconds / 60 % 60) : Math.floor(seconds / 60 % 60);
    const secs = seconds % 60 < 10 ? '0' + Math.floor(seconds % 60) : Math.floor(seconds % 60);
    let str;
    if (allowDays == true) {
        str =
            parseInt(days) > 0 ?
                `${days}:${hours}:${minutes}:${secs}` :
                parseInt(hours) > 0 ?
                    `${hours}:${minutes}:${secs}` :
                    `${minutes}:${secs}`;
    } else {
        str = parseInt(hours) > 0 ?
            `${hours}:${minutes}:${secs}` :
            `${minutes}:${secs}`;
    }
    return str;
}

/**
 * EDITED VERSION OF STRING-MATH.JS
 * @source https://www.npmjs.com/package/string-math
 * @param eq 
 * @param callback 
 * @returns 
 */
export async function stringMath(eq: string, callback?) {
    if (typeof eq !== 'string') return handleCallback(new TypeError('The [String] argument is expected.'), null);
    const mulDiv = /([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*([*/])\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)/;
    const plusMin = /([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*([+-])\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)/;
    const parentheses = /(\d)?\s*\(([^()]*)\)\s*/;
    let current;
    while (eq.search(/^\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*$/) === -1) {
        eq = fParentheses(eq);
        if (eq === current) return handleCallback(new SyntaxError('The equation is invalid.'), null);
        current = eq;
    }
    return handleCallback(null, +eq);

    function fParentheses(eq) {
        while (eq.search(parentheses) !== -1) {
            eq = eq.replace(parentheses, function (a, b, c) {
                c = fMulDiv(c);
                c = fPlusMin(c);
                return typeof b === 'string' ? b + '*' + c : c;
            });
        }
        eq = fMulDiv(eq);
        eq = fPlusMin(eq);
        return eq;
    }

    function fMulDiv(eq) {
        while (eq.search(mulDiv) !== -1) {
            eq = eq.replace(mulDiv, function (a) {
                const sides = mulDiv.exec(a);
                //@ts-expect-error types or smth idk
                const result = sides[2] === '*' ? sides[1] * sides[3] : sides[1] / sides[3];
                return result >= 0 ? '+' + result : result;
            });
        }
        return eq;
    }

    function fPlusMin(eq) {
        eq = eq.replace(/([+-])([+-])(\d|\.)/g, function (a, b, c, d) { return (b === c ? '+' : '-') + d; });
        while (eq.search(plusMin) !== -1) {
            eq = eq.replace(plusMin, function (a) {
                const sides = plusMin.exec(a);
                //@ts-expect-error types or smth idk
                return sides[2] === '+' ? +sides[1] + +sides[3] : sides[1] - sides[3];
            });
        }
        return eq;
    }

    function handleCallback(errObject, result) {
        if (typeof callback !== 'function') {
            if (errObject !== null) throw errObject;
        } else {
            callback(errObject, result);
        }
        return result;

    }
}

/**
 * 
 * @param {number} x first number
 * @param {number} y second number
 * @returns the highest common factor between two numbers
 */
export function findHCF(x: number, y: number) {
    if (isNaN(x) || isNaN(y)) return NaN;
    if (x == 0 || y == 0) return 0;

    while (Math.max(x, y) % Math.min(x, y) != 0) {
        if (x > y) {
            x %= y;
        }
        else {
            y %= x;
        }
    }
    return Math.min(x, y);
}
/**
 * 
 * @param {number} n1 first number
 * @param {number} n2 second number
 * @returns the lowest common multiple between two numbers
 */
export function findLCM(n1: number, n2: number) {
    if (isNaN(n1) || isNaN(n2)) return NaN;
    if (n1 == 0 || n2 == 0) return 0;
    const lar = Math.max(n1, n2);
    const small = Math.min(n1, n2);


    let i = lar;
    while (i % small !== 0) {
        i += lar;
    }


    return i;
}
/**
 * 
 * @param {number} a first number
 * @param {number} b second number
 * @returns the length of the hypotenuse (longest side) on a right-angle triange
 */
export function pythag(a: number, b: number) {
    if (isNaN(a) || isNaN(b)) return NaN;
    const cp = (a ** 2) + (b ** 2);
    const c: number = Math.sqrt(cp);
    return (c);
}

export function factorial(part1: number) {
    if (part1 == 0 || part1 == 1) {
        return 1;
    } else {
        return part1 * factorial(part1 - 1);
    }
}

/**
 * 
 * @param str input string. formatted as hh:mm:ss._ms or ?d?h?m?s
 * @returns string converted to milliseconds
 */
export function timeToMs(str: string) {
    if (str.includes('d') || str.includes('h') || str.includes('m') || str.includes('s')) {
        let daysstr = '0';
        let hoursstr = '0';
        let minutesstr = '0';
        let secondsstr = '0';

        if (str.includes('d')) {
            daysstr = str.split('d')[0];
            if (str.includes('h')) {
                hoursstr = str.split('d')[1].split('h')[0];
                if (str.includes('m')) {
                    minutesstr = str.split('d')[1].split('h')[1].split('m')[0];
                }
                if (str.includes('s')) {
                    secondsstr = str.split('d')[1].split('h')[1].split('m')[1].split('s')[0];
                }
            }
            if (str.includes('m') && !str.includes('h')) {
                minutesstr = str.split('d')[1].split('m')[0];
                if (str.includes('s')) {
                    secondsstr = str.split('d')[1].split('m')[1].split('s')[0];
                }
            }
            if (str.includes('s') && !str.includes('m') && !str.includes('h')) {
                secondsstr = str.split('d')[1].split('s')[0];
            }
        }
        if (str.includes('h') && !str.includes('d')) {
            hoursstr = str.split('h')[0];
            if (str.includes('m')) {
                minutesstr = str.split('h')[1].split('m')[0];
                if (str.includes('s')) {
                    secondsstr = str.split('h')[1].split('m')[1].split('s')[0];
                }
            }
            if (str.includes('s') && !str.includes('m')) {
                secondsstr = str.split('h')[1].split('s')[0];
            }
        }
        if (str.includes('m') && !str.includes('h') && !str.includes('d')) {
            minutesstr = str.split('m')[0];
            if (str.includes('s')) {
                secondsstr = str.split('m')[1].split('s')[0];
            }
        }
        if (str.includes('s') && !str.includes('m') && !str.includes('h') && !str.includes('d')) {
            secondsstr = str.split('s')[0];
        }


        const days = parseInt(daysstr);
        const hours = parseInt(hoursstr);
        const minutes = parseInt(minutesstr);
        const seconds = parseInt(secondsstr);
        const ms = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);

        return ms;
    } else if (str.includes(':') || str.includes('.')) {
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let milliseconds = 0;
        let coloncount = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === ':') {
                coloncount++;
            }
        }
        if (coloncount === 2) {
            hours = parseInt(str.split(':')[0]);
            minutes = parseInt(str.split(':')[1]);
            seconds = parseInt(str.split(':')[2]);
        }
        if (coloncount === 1) {
            minutes = parseInt(str.split(':')[0]);
            seconds = parseInt(str.split(':')[1]);
        }
        if (str.includes('.')) {
            milliseconds = parseInt(str.split('.')[1]);
            if (coloncount === 0) {
                seconds = parseInt(str.split('.')[0]);
            }
        }
        const ms = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
        return ms;

    } else {
        return NaN;
    }
}

// 
export function findMode(input: string[]) {
    const array: {
        string: string,
        count: number,
        percentage: number;
    }[] = [];
    input.forEach(x => {
        const indx = array.findIndex(y => y.string == x);
        if (indx == -1) {
            array.push({
                string: x,
                count: 1,
                percentage: 0
            });
        } else {
            array[indx].count++;
        }
    });
    array.sort((a, b) => b.count - a.count);
    array.forEach(x => x.percentage = (x.count / input.length) * 100);
    return array;
}

export function stats(arr: number[]) {
    const init = arr.slice();
    arr = arr.filter(x => x != null);
    arr.sort((a, b) => b - a);
    let median = 0;
    //if even, else
    if (arr.length % 2 == 1) {
        median = arr[Math.floor(arr.length / 2)];
    } else {
        const temp1 = arr[arr.length / 2];
        const temp2 = arr[(arr.length / 2) - 1];
        median = (temp1 + temp2) / 2;
    }

    return {
        highest: arr[0],
        mean: arr.reduce((b, a) => b + a, 0) / arr.length,
        lowest: arr[arr.length - 1],
        median: median,
        ignored: init.length - arr.length,
        calculated: arr.length,
        total: init.length,
    };
}

export function weightPerformance(pp: number[]) {
    pp = pp.sort((a, b) => b - a);
    const numLen = [];
    for (let i = 0; i < pp.length; i++) {
        numLen.push(pp[i] * (0.95 ** i));
    }
    return numLen;
}

export function findWeight(index: number) {
    if (index > 99 || index < 0) return 0;
    return (0.95 ** (index));
}

export function isWithinPercentage(input: number, percentage: number, against: number) {
    if (percentage < 0 || percentage > 100) {
        throw new Error('Percentage should be between 0 and 100.');
    }
    const lowerBound = against - ((against * percentage) / 100);
    const upperBound = against + ((against * percentage) / 100);
    return input >= lowerBound && input <= upperBound;
}

export function isWithinValue(input: number, value: number, against: number) {
    const lowerBound = against - value;
    const upperBound = against + value;
    return input >= lowerBound && input <= upperBound;
}


export function modOverrides(mods: apitypes.Mod[]) { 
    let speed:number;
    let cs:number;
    let ar:number;
    let od:number;
    let hp:number;
    mods.forEach(mod => {
        if(mod?.settings?.speed_change){
            speed = mod?.settings?.speed_change
        }
        if(mod?.settings?.circle_size){
            cs = mod?.settings?.circle_size
        }
        if(mod?.settings?.approach_rate){
            ar = mod?.settings?.approach_rate
        }
        if(mod?.settings?.overall_difficulty){
            od = mod?.settings?.overall_difficulty
        }
        if(mod?.settings?.drain_rate){
            hp = mod?.settings?.drain_rate
        }
    });

    return {
        cs, ar, hp, od, speed
    }

}
