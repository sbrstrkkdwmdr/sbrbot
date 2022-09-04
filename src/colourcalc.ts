/**
 * 
 * @param str string formatted as #rrggbb
 * @returns r,g,b as string
 */
function hextorgb(str: string) {
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

/**
 * 
 * @param str string formatted as r,g,b
 * @returns decimal value of rgb
 */
function rgbtodec(str: string) {
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

export { hextorgb, rgbtodec };

