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
    const answer = aAsArr[0] + '.' + sigfig + '*10^' + mult;
    return {
        number: answer,
        sigfig: sigfig.length + 1,
    };
}

/**
 *
 * @param {number} number
 * @returns checks if number is under two decimals, then will return the number with two decimals or less
 */
export function fixtoundertwo(number: number) {
    const truenum = number * 100;
    if (!isNaN(truenum)) return number;
    else return number.toFixed(2);
}
/**
 * 
 * @param {*} part1 the number to calculate
 * @returns the factorial of the number. ie 1*2*3...*x
 */
export function factorial(part1: number) {
    if (part1 == 0 || part1 == 1) {
        return 1;
    } else {
        return part1 * factorial(part1 - 1);
    }
}
/**
 * 
 * @param {date} date 
 * @returns to 12 hour time (UTC+00)
 */
export function to12htime(date) {
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    let amorpm;
    if (parseInt(hours) >= 12) {
        amorpm = 'PM';
    }
    else {
        amorpm = 'AM';
    }
    hours = hours % 12;
    if (hours == 0) hours = 12;
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds + amorpm;
}
/**
 * 
 * @param {date} date 
 * @returns relative 12 hour time (non UTC)
 */
export function relto12htime(date) { //relative version of above
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let amorpm;
    if (parseInt(hours) >= 12) {
        amorpm = 'PM';
    }
    else {
        amorpm = 'AM';
    }
    hours = hours % 12;
    if (hours == 0) hours = 12;
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;

    }
    return hours + ':' + minutes + ':' + seconds + amorpm;
}

/**
 * 
 * @param {int} weekdaynum 
 * @returns weekdays to shorthand name i.e 1 -> Mon
 */
export function dayhuman(weekdaynum: number) { //date.getUTCDay returns an int so this is to convert to its name
    let str: string;
    switch (weekdaynum.toString()) {
        case '0':
            str = 'Sun';
            break;
        case '1':
            str = 'Mon';
            break;
        case '2':
            str = 'Tue';
            break;
        case '3':
            str = 'Wed';
            break;
        case '4':
            str = 'Thu';
            break;
        case '5':
            str = 'Fri';
            break;
        case '6':
            str = 'Sat';
            break;
        default:
            str = 'idk';
            break;
    }
    return str;
}
/**
 * 
 * @param {int} monthnum 
 * @returns name of the month in shorthand i.e 1 -> Feb
 */
export function tomonthname(monthnum: number) {//date.getUTCMonth returns an int so this is to convert to its name
    let str: string;
    switch (monthnum.toString()) {
        case '0':
            str = 'Jan';
            break;
        case '1':
            str = 'Feb';
            break;
        case '2':
            str = 'Mar';
            break;
        case '3':
            str = 'Apr';
            break;
        case '4':
            str = 'May';
            break;
        case '5':
            str = 'Jun';
            break;
        case '6':
            str = 'Jul';
            break;
        case '7':
            str = 'Aug';
            break;
        case '8':
            str = 'Sep';
            break;
        case '9':
            str = 'Oct';
            break;
        case '10':
            str = 'Nov';
            break;
        case '11':
            str = 'December';
            break;
        default:
            str = 'idk';
            break;
    }
    return str;
}

/**
 * 
 * @param {date} time 
 * @returns fixes offset i.e. +11:00 being returned as -660.
 */
export function fixoffset(time: number) {
    const offsettype = time.toString().includes('-') ?
        '+' : '-';
    const current = Math.abs(time / 60).toFixed(2);
    const actualoffset = (offsettype + current).replace('.', ':');
    return actualoffset;
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

export function secondsToTimeReadable(seconds: number, allowDays?: boolean, showSeconds?: boolean) {
    const days = Math.floor(seconds / 60 / 60 / 24).toString();
    const hours =
        allowDays == true ?
            (seconds / 60 / 60 % 24 < 10 ? '0' + Math.floor(seconds / 60 / 60 % 24) : Math.floor(seconds / 60 / 60 % 24)).toString()
            : (seconds / 60 / 60 < 10 ? '0' + Math.floor(seconds / 60 / 60) : Math.floor(seconds / 60 / 60)).toString();
    const minutes = seconds / 60 % 60 < 10 ? '0' + Math.floor(seconds / 60 % 60) : Math.floor(seconds / 60 % 60);
    const secs = seconds % 60 < 10 ? '0' + Math.floor(seconds % 60) : Math.floor(seconds % 60);
    let str;
    if (allowDays == true) {
        if (showSeconds == true) {
            str =
                parseInt(days) > 0 ?
                    `${days}d ${hours}h ${minutes}m ${secs}s` :
                    parseInt(hours) > 0 ?
                        `${hours}d ${minutes}m ${secs}s` :
                        `${minutes}m ${secs}s`;
        } else {
            str =
                parseInt(days) > 0 ?
                    `${days}d ${hours}h ${minutes}m` :
                    parseInt(hours) > 0 ?
                        `${hours}d ${minutes}m` :
                        `${minutes}m`;
        }
    } else {
        if (showSeconds == true) {
            str = parseInt(hours) > 0 ?
                `${hours}h ${minutes}m ${secs}s` :
                `${minutes}m ${secs}s `;
        } else {
            str = parseInt(hours) > 0 ?
                `${hours}h ${minutes}m` :
                `${minutes}m`;
        }
    }
    return str;
}

/**
 * 
 * @param str the string to convert
 * @returns string with the first letter capitalised
 */
export function toCapital(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toOrdinal(num: number) {
    let txt;
    if (num.toString().endsWith('1')) {
        txt = num + 'st';
    }
    else if (num.toString().endsWith('2')) {
        txt = num + 'nd';
    }
    else if (num.toString().endsWith('3')) {
        txt = num + 'rd';
    }
    else {
        txt = num + 'th';
    }
    return txt;
}

/**
 * 
 * @param number number to parse
 * @param decimal how many decimals to show
 * @returns shorthand ie 1000 -> 1k, 1254 -> 1.25k
 */
export function shorthandNumber(number: number, decimal?: number) {
    let newNum: string = `0`;
    if (!decimal) {
        decimal = 2;
    }
    if (number > 10 ** 12) {
        newNum = (number / 1000).toFixed(decimal) + 'T';
    }
    if (number > 10 ** 9) {
        newNum = (number / 1000).toFixed(decimal) + 'B';
    }
    if (number > 10 ** 6) {
        newNum = (number / 1000).toFixed(decimal) + 'M';
    }
    if (number > 10 ** 3) {
        newNum = (number / 1000).toFixed(decimal) + 'k';
    }
    return newNum;
}

export async function waitPls(func: () => any, seconds: number) {
    await new Promise(resolve => {
        setTimeout(() => {
            func();
            resolve('success');
        }, seconds);
    });
    return;
}

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
 * checks if the string is a number
 */
export function checkIsNumber(str: string) {
    const numbers = [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
        'thirty', 'forty', 'fifty', 'sixty', 'eighty', 'ninety', 'hundred', 'thousand', 'million', 'billion', 'trillion'
    ];
    let bool = false;
    for (let i = 0; i < numbers.length; i++) {
        if (str.toLowerCase().trim().includes(numbers[i])) {
            bool = true;
            break;
        }
    }
    return bool;
}

//module.exports = { findHCF, findLCM, pythag, sigfig, fixtoundertwo, factorial, to12htime, relto12htime, dayhuman, tomonthname, fixoffset };
// export {
//     findHCF, findLCM,
//     pythag, sigfig,
//     fixtoundertwo, factorial,
//     to12htime, relto12htime,
//     dayhuman, tomonthname,
//     fixoffset, timeToMs,
//     secondsToTime, secondsToTimeReadable,
//     toCapital, toOrdinal
// };

