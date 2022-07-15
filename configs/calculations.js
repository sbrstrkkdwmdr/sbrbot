/**
 * 
 * @param {number} x first number
 * @param {number} y second number
 * @returns the highest common factor between two numbers
 */
function findHCF(x, y) {
    if (isNaN(x, y)) return NaN;

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
function findLCM(n1, n2) {
    if (isNaN(n1, n2)) return NaN;
    let lar = Math.max(n1, n2);
    let small = Math.min(n1, n2);


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
function pythag(a, b) {
    if (isNaN(a, b)) return NaN;
    let cp = (a ** 2) + (b ** 2);
    c = Math.sqrt(cp)
    return (c)
}
/**
 * 
 * @param {number} a first number
 * @param {number} b number of significant figiures
 * @result converts the number to a significant figure
 */
function sigfigold(a, b) {
    if (isNaN(a)) return NaN;
    let s = a / (10 ** (a.toString().length - 1)).toFixed(a.toString().length - 1)
    if (parseInt(b)) {
        s = (a / (10 ** (a.toString().length - 1))).toFixed(parseInt(b))
    }
    let c = s + ' x 10^' + (a.toString().length - 1)
    return c;
}

function sigfig(a, b) {
    if (isNaN(a)) return NaN;
    aAsArr = a.toString().replaceAll('.', '').split('')
    if (isNaN(b)) b = aAsArr.length;
    let sigfig = aAsArr.slice(1, b).join('')
    let mult = (a/(aAsArr[0]+ '.' + sigfig)).toString().length - 1
    if (mult < 1 && mult != 0) { mult = mult.toString().length - 1 }
    let answer = aAsArr[0] + '.' + sigfig + '*10^' + mult
    console.log(mult)
    return answer

}

/**
 *
 * @param {number} number
 * @returns checks if number is under two decimals, then will return the number with two decimals or less
 */
function fixtoundertwo(number) {
    truenum = number * 100
    parsed = parseInt(truenum)
    if (truenum == parsed) return number;
    else return number.toFixed(2);
}
/**
 * 
 * @param {*} part1 the number to calculate
 * @returns the factorial of the number. ie 1*2*3...*x
 */
function factorial(part1) {
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
    var strTime = hours + ':' + minutes + ':' + seconds + amorpm;
    return strTime;
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
    var strTime = hours + ':' + minutes + ':' + seconds + amorpm;
    return strTime;
}
/**
 * 
 * @param {int} weekdaynum 
 * @returns weekdays to shorthand name i.e 1 -> Mon
 */
function dayhuman(weekdaynum) { //date.getUTCDay returns an int so this is to convert to its name
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
function tomonthname(monthnum) {//date.getUTCMonth returns an int so this is to convert to its name
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
function fixoffset(time) {
    let offsettype;
    if (time.toString().includes('-')) {
        offsettype = '+'
    } else {
        offsettype = '-'
    }
    let current;
    let actualoffset;
    current = Math.abs(time / 60).toFixed(2)
    actualoffset = (offsettype + current).replace('.', ':')
    return actualoffset;
}

module.exports = { findHCF, findLCM, pythag, sigfig, fixtoundertwo, factorial, to12htime, relto12htime, dayhuman, tomonthname, fixoffset };
