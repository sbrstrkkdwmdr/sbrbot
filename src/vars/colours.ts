import * as colourcalc from '../tools/colourcalc.js';

const diffcolour = [
    {
        dec: 5554943,
        hex: '#54C2FF',
        rgb: '61,186,255', //0-255,0-255,0-255
        hsv: '201,76,100', //0-360, 0-100, 0-100
        cym: ''
    }, //s>1.5>s
    {
        dec: 5373909,
        hex: '#51FFD5',
        rgb: '81,255,213',
        hsv: '165,68,100',
        cym: ''
    }, //s>2.0
    {
        dec: 7601987,
        hex: '#73FF43',
        rgb: '115,255,67',
        hsv: '104,73,100',
        cym: ''
    }, //s>2.5
    {
        dec: 16183392,
        hex: '#F6F060',
        rgb: '246,240,96',
        hsv: '57,60,96',
        cym: ''
    }, //s>3.25
    {
        dec: 16744809,
        hex: '#FF8169',
        rgb: '255,129,105',
        hsv: '9,58,100',
        cym: ''
    }, //s>4.5
    {
        dec: 16726640,
        hex: '#FF3A70',
        rgb: '255,58,112',
        hsv: '343,77,100',
        cym: ''
    }, //s>6.0
    {
        dec: 6644702,
        hex: '#6563DE',
        rgb: '101,99,222',
        hsv: '240,55,87',
        cym: ''
    }, //s>7.0
    {
        dec: 0,
        hex: '#000000',
        rgb: '0,0,0',
        hsv: '0,0,0',
        cym: ''
    }, //s>8.0

];

const embedColour = {
    score: {
        hex: '#DF7FFF',
        dec: colourcalc.hexToDec('#DF7FFF'),
    },
    scorelist: {
        hex: '#8A7FFF',
        dec: colourcalc.hexToDec('#8A7FFF'),
    },
    user: {
        hex: '#16D8FF',
        dec: colourcalc.hexToDec('#16D8FF'),
    },
    userlist: {
        hex: '#0099FF',
        dec: colourcalc.hexToDec('#0099FF'),
    },
    query: {
        hex: '#000099',
        dec: colourcalc.hexToDec('#000099'),
    },
    admin: {
        hex: '#BF9AB2',
        dec: colourcalc.hexToDec('#BF9AB2'),
    },
    info: {
        hex: '#9AAAC0',
        dec: colourcalc.hexToDec('#9AAAC0'),
    },
    misc: {
        hex: '#91BC5C',
        dec: colourcalc.hexToDec('#91BC5C'),
    },
};
/**
 * [nm
 * eg. [31m
 */
export const codeBlockColour = {
    text: {
        grey: 30,
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        pink: 35,
        cyan: 36,
        white: 37,
        default: 38,
    },
    background: {
        darkBlue: 40,
        red: 41,
        lightGrey: 42,
        lighterGrey: 43,
        lightestGrey: 44,
        indigo: 45,
        gray: 46,
        white: 47,
        none: 48,
    }
};

/**
 * all hex
 */
export const rainbow = {
    red: '#FF0000',
    orange: '#FF7F00',
    yellow: '#FFFF00',
    green: '#00FF00',
    blue: '#0000FF',
    indigo: '#4B0082',
    violet: '#9400D3',
};

export { diffcolour, embedColour };

