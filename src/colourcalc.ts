import * as clrs from './consts/colours.js';
/**
 * 
 * @param str string formatted as #rrggbb
 * @returns r,g,b as string
 */
function hexToRgb(str: string) {
    const str1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str.replace('#', ''));

    const r = parseInt(str1[1], 16);
    const g = parseInt(str1[2], 16);
    const b = parseInt(str1[3], 16);

    const rgb = `${r},${g},${b}`;
    return rgb;
}
function rgbToHex(str: string) {
    const array = str.split(',');
    const r = parseInt(array[0]);
    const g = parseInt(array[1]);
    const b = parseInt(array[2]);
    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}

/**
 * 
 * @param str string formatted as r,g,b
 * @returns decimal value of rgb
 */
function rgbToDec(str: string) {
    const array = str.split(',');
    const r = parseInt(array[0]);
    const g = parseInt(array[1]);
    const b = parseInt(array[2]);
    const dec = (r * 65536) + (g * 256) + b;
    return dec;

}

/**
 * 
 * @param num number to be converted to rgb 
 * @returns rgb string
 */
function decToRgb(num: number) {
    const r = num >> 16;
    const g = num >> 8 & 255;
    const b = num & 255;
    const rgb = `${r},${g},${b}`;
    return rgb;
}

/**
 * 
 * @param num decimal number to be converted to hex 
 * @returns string formatted as #rrggbb
 */
function decToHex(num: number) {
    const hex = '#' + num.toString(16);
    return hex;
}

/**
 * 
 * @param str string formatted as #rrggbb
 * @returns decimal value of hex
 */
function hexToDec(str: string) {
    const str1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str.replace('#', ''));
    const r = parseInt(str1[1], 16);
    const g = parseInt(str1[2], 16);
    const b = parseInt(str1[3], 16);
    const dec = (r * 65536) + (g * 256) + b;
    return dec;
}

export { hexToRgb, rgbToHex, rgbToDec, decToRgb, decToHex, hexToDec };

//[nm
/**
 * [nm
 */
export function codeBlockColourText(str: string, colour: string, type: 'background' | 'text') {
    return `\`\`\`ansi\n[${clrs.codeBlockColour[type][colour]}m${str}\n\`\`\``;
}