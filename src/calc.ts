/**
 * 
 * @param {number} x first number
 * @param {number} y second number
 * @returns the highest common factor between two numbers
 */
 function findHCF(x: number, y: number) {
    if (isNaN(x) || isNaN(y)) return NaN;

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
function findLCM(n1: number, n2: number) {
    if (isNaN(n1) || isNaN(n2)) return NaN;
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
function pythag(a: number, b: number) {
    if (isNaN(a) || isNaN(b)) return NaN;
    const cp = (a ** 2) + (b ** 2);
    const c: number = Math.sqrt(cp)
    return (c)
}
/**
 * 
 * @param {number} a first number
 * @param {number} b number of significant figiures
 * @result converts the number to a significant figure
 */
/* function sigfigold(a: number, b: number) {
    if (isNaN(a)) return NaN;
    let s: number = parseFloat((a / Math.abs(10 ** (a.toString().length - 1))).toFixed(a.toString().length - 1));
    if (b) {
        s = parseFloat((a / (10 ** (a.toString().length - 1))).toFixed(b))
    }
    const c = s + ' x 10^' + (a.toString().length - 1)
    return c;
} */
/**
 * 
 * @param {number} a first number
 * @param {number} b number of significant figiures
 * @result converts the number to a significant figure
 */
function sigfig(a: number, b: number) {
    if (isNaN(a)) return {
        number: a,
        sigfig: NaN,
    };
    const aAsArr = a.toString().replaceAll('.', '').split('')
    if (b < 2 || b == null) { b = aAsArr.length }
    const sigfig = aAsArr.slice(1, b).join('')
    let mult: number = Math.floor(a / parseFloat(aAsArr[0] + '.' + sigfig))//.toString().length - 1
    if (mult < 1 && mult != 0) { mult = mult.toString().length - 1 }
    const answer = aAsArr[0] + '.' + sigfig + '*10^' + mult
    return {
        number: answer,
        sigfig: sigfig.length + 1,
    }
}

/**
 *
 * @param {number} number
 * @returns checks if number is under two decimals, then will return the number with two decimals or less
 */
function fixtoundertwo(number: number) {
    const truenum = number * 100;
    if (!isNaN(truenum)) return number;
    else return number.toFixed(2);
}
/**
 * 
 * @param {*} part1 the number to calculate
 * @returns the factorial of the number. ie 1*2*3...*x
 */
function factorial(part1: number) {
    if (part1 == 0 || part1 == 1) {
        return 1;
    } else {
        return part1 * factorial(part1 - 1);
    }
}
//                                                       ms    s   min hour    day
/**
 * 
 * @param {date} date 
 * @returns to 12 hour time (UTC+00)
 */
function to12htime(date) {
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    let amorpm;
    if (parseInt(hours) >= 12) {
        amorpm = 'PM'
    }
    else {
        amorpm = 'AM'
    }
    hours = hours % 12;
    if (hours == 0) hours = 12 // the hour '0' should be '12'
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    return hours + ':' + minutes + ':' + seconds + amorpm;
}
/**
 * 
 * @param {date} date 
 * @returns relative 12 hour time (non UTC)
 */
function relto12htime(date) { //relative version of above
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let amorpm;
    if (parseInt(hours) >= 12) {
        amorpm = 'PM'
    }
    else {
        amorpm = 'AM'
    }
    hours = hours % 12;
    if (hours == 0) hours = 12 // the hour '0' should be '12'
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds

    }
    return hours + ':' + minutes + ':' + seconds + amorpm;
}

/**
 * 
 * @param {int} weekdaynum 
 * @returns weekdays to shorthand name i.e 1 -> Mon
 */
function dayhuman(weekdaynum: number) { //date.getUTCDay returns an int so this is to convert to its name
    let str: string;
    switch (weekdaynum.toString()) {
        case '0':
            str = 'Sun'
            break;
        case '1':
            str = 'Mon'
            break;
        case '2':
            str = 'Tue'
            break;
        case '3':
            str = 'Wed'
            break;
        case '4':
            str = 'Thu'
            break;
        case '5':
            str = 'Fri'
            break;
        case '6':
            str = 'Sat'
            break;
        default:
            str = 'idk'
            break;
    }
    return str;
}
/**
 * 
 * @param {int} monthnum 
 * @returns name of the month in shorthand i.e 1 -> Feb
 */
function tomonthname(monthnum: number) {//date.getUTCMonth returns an int so this is to convert to its name
    let str: string;
    switch (monthnum.toString()) {
        case '0':
            str = 'Jan'
            break;
        case '1':
            str = 'Feb'
            break;
        case '2':
            str = 'Mar'
            break;
        case '3':
            str = 'Apr'
            break;
        case '4':
            str = 'May'
            break;
        case '5':
            str = 'Jun'
            break;
        case '6':
            str = 'Jul'
            break;
        case '7':
            str = 'Aug'
            break;
        case '8':
            str = 'Sep'
            break;
        case '9':
            str = 'Oct'
            break;
        case '10':
            str = 'Nov'
            break;
        case '11':
            str = 'December'
            break;
        default:
            str = 'idk'
            break;
    }
    return str;
}

/**
 * 
 * @param {date} time 
 * @returns fixes offset i.e. +11:00 being returned as -660.
 */
function fixoffset(time: number) {
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
function timeToMs(str: string) {
    if (str.includes('d') || str.includes('h') || str.includes('m') || str.includes('s')) {
        let daysstr = '0'
        let hoursstr = '0'
        let minutesstr = '0'
        let secondsstr = '0'

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
        //convert to milliseconds
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
function secondsToTime(seconds: number, allowDays?: boolean) {
    //1 * 60 * 60
    //assuming 6000 seconds

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

function secondsToTimeReadable(seconds: number, allowDays?: boolean, showSeconds?: boolean) {
    //1 * 60 * 60
    //assuming 6000 seconds

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

//module.exports = { findHCF, findLCM, pythag, sigfig, fixtoundertwo, factorial, to12htime, relto12htime, dayhuman, tomonthname, fixoffset };
export {
    findHCF, findLCM,
    pythag, sigfig,
    fixtoundertwo, factorial,
    to12htime, relto12htime,
    dayhuman, tomonthname,
    fixoffset, timeToMs,
    secondsToTime, secondsToTimeReadable
};
