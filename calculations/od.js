/**
 * 
 * @param {number} od 
 * @returns ms values for the od hitwindows and converts to double time
 */
function oddt(od) {
    let oldrange300 = 79 - (od * 6) + 0.5
    let oldrange100 = 139 - (od * 8) + 0.5
    let oldrange50 = 199 - (od * 10) + 0.5

    let range300 = (79 - (od * 6) + 0.5) * 2 / 3
    let range100 = (139 - (od * 8) + 0.5) * 2 / 3
    let range50 = (199 - (od * 10) + 0.5) * 2 / 3
    let odnew = od * 4 / 3

    //rangetood = (79 - od * 6 - 0.5)
    odnew = Math.abs(((79.5 - range300) / 6).toFixed(2))

    let odobj = {
        hitwindow_300: range300,
        hitwindow_100: range100,
        hitwindow_50: range50,
        od_num: odnew,
        hitwin_300_old: oldrange300,
        hitwin_100_old: oldrange100,
        hitwin_50_old: oldrange50,
        od_old: od
    }

    return odobj;

}
/**
 * 
 * @param {number} od 
 * @returns ms values for the od hitwindows and converts to half time
 */
function odht(od) {
    let oldrange300 = 79 - (od * 6) + 0.5
    let oldrange100 = 139 - (od * 8) + 0.5
    let oldrange50 = 199 - (od * 10) + 0.5

    let range300 = (79 - (od * 6) + 0.5) * 4 / 3 
    let range100 = (139 - (od * 8) + 0.5) * 4 / 3
    let range50 = (199 - (od * 10) + 0.5) * 4 / 3
    let odnew = od * 2 / 3

    /*
    convert 300 range to od
    eg hitwindow = 25.5
    25.5 = 79 - (od * 6) + 0.5
    25.5 = 79.5 - (6 * od)
    0 = 79.5-25.5 (6*od)
    od = (79.5 - range300) / 6
    */
    ;  
    odnew = Math.abs(((79.5 - range300) / 6).toFixed(2))

    

    let odobj = {
        hitwindow_300: range300,
        hitwindow_100: range100,
        hitwindow_50: range50,
        od_num: odnew,
        hitwin_300_old: oldrange300,
        hitwin_100_old: oldrange100,
        hitwin_50_old: oldrange50,
        od_old: od
    }

    return odobj;
}

console.log(oddt(9))

module.exports = { oddt, odht }
/*
{
  hitwindow_300: 34,
  hitwindow_100: 90,
  hitwindow_50: 146,
  od_num: 7.583333333333333,
  hitwin_300_old: 25.5,
  hitwin_100_old: 67.5,
  hitwin_50_old: 109.5,
  od_old: 9
}
*/
/*
{
  hitwindow_300: 34,
  hitwindow_100: 90,
  hitwindow_50: 146,
  od_num: 7.583333333333333,
  hitwin_300_old: 25.5,
  hitwin_100_old: 67.5,
  hitwin_50_old: 109.5,
  od_old: 9
}
*/