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
function sigfig(a, b) {
    if (isNaN(a)) return NaN;
    let s = a / (10 ** (a.toString().length - 1)).toFixed(a.toString().length - 1)
    if (parseInt(b)) {
        s = (a / (10 ** (a.toString().length - 1))).toFixed(parseInt(b))
    }
    let c = s + ' x 10^' + (a.toString().length - 1)
    return c;
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
module.exports = { findHCF, findLCM, pythag, sigfig, fixtoundertwo };
