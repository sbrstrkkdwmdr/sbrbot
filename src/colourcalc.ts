/**
 * 
 * @param str string formatted as #rrggbb
 * @returns r,g,b as string
 */
function hexToRgb(str: string) {
    // #0000FF = 0,0,255
    // #FFFFFF = 255,255,255
    // #FF0000 = 255,0,0
    // #00FF00 = 0,255,0
    // #0001FF = 0,1,
    const str1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str.replace('#', ''))

    const r = parseInt(str1[1], 16);
    const g = parseInt(str1[2], 16);
    const b = parseInt(str1[3], 16);

    const rgb = `${r},${g},${b}`;
    return rgb;
}
function rgbToHex(str: string) {
    //255,255,255 = #FFFFFF
    //255,0,0 = #FF0000
    //0,255,0 = #00FF00
    //0,1,255 = #0001FF
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
    //000,000,255 = 255
    //255,255,255 = 16777215
    //255,000,000 = 16711680
    //0,255,0 = 65280
    //0,1,255 = 511

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
    //16777215 = 255,255,255
    //16711680 = 255,0,0
    //65280 = 0,255,0
    //511 = 0,1,255
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
    //16777215 = #FFFFFF
    //16711680 = #FF0000
    //65280 = #00FF00
    //511 = #0001FF
    const hex = '#' + num.toString(16);
    return hex;
}

/**
 * 
 * @param str string formatted as #rrggbb
 * @returns decimal value of hex
 */
function hexToDec(str: string) {
    // #0000FF = 255
    // #FFFFFF = 16777215
    // #FF0000 = 16711680
    // #00FF00 = 65280
    // #0001FF = 511
    const str1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str.replace('#', ''));
    const r = parseInt(str1[1], 16);
    const g = parseInt(str1[2], 16);
    const b = parseInt(str1[3], 16);
    const dec = (r * 65536) + (g * 256) + b;
    return dec;
}

export { hexToRgb, rgbToHex, rgbToDec, decToRgb, decToHex, hexToDec };

