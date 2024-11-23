import * as helper from '../helper.js';

/**
 * 
 * @param str string formatted as #rrggbb
 * @returns string as r,g,b
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
 * @returns string as r,g,b
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

/**
 * 
 * @returns 
 */
function rgbToHsv(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h: number;

    if (delta === 0) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / delta) % 6;
    } else if (max === g) {
        h = (b - r) / delta + 2;
    } else {
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }

    const s = Math.round((max === 0 ? 0 : delta / max) * 100);
    const v = Math.round(max * 100);

    return { h, s, v };
}

/**
 * s and v are percentages
 * @returns string as r,g,b
 */
function hsvToRgb(h: number, s: number, v: number) {
    h /= 60;
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = v - c;

    let r, g, b;

    if (h >= 0 && h < 1) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 1 && h < 2) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 2 && h < 3) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 3 && h < 4) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 4 && h < 5) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `${r},${g},${b}`;
}

export { decToHex, decToRgb, hexToDec, hexToRgb, hsvToRgb, rgbToDec, rgbToHex, rgbToHsv };

//[nm
/**
 * [nm
 */
export function codeBlockColourText(str: string, colour: string, type: 'background' | 'text') {
    return `\`\`\`ansi\n[${helper.vars.colours.codeBlockColour[type][colour]}m${str}\n\`\`\``;
}