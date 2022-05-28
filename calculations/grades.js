/**
 * 
 * @param {*} hit300 - hit 300s (100%)
 * @param {*} hit100 - hit 100s (33.33%)
 * @param {*} hit50  - hit 50s (16.66%)
 * @param {*} miss - hit 0s/misses (0%)
 * @returns an array containing grades and accuracy
 */
function calcgrade(hit300, hit100, hit50, miss) {
    topequation = Math.floor((300 * hit300) + (100 * hit100) + (50 * hit50))
    bottomequation = Math.floor(300 * (hit300 + hit100 + hit50 + miss))
    fullequation = (Math.abs((topequation / bottomequation) * 100)).toString() + '%'
    shortequation = ((Math.abs((topequation / bottomequation) * 100)).toFixed(2)).toString() + '%'
    //https://osu.ppy.sh/wiki/en/FAQ#grades
    grade = 'D'
    if (hit300 / totalhits > 0.6 && miss == 0) {
        grade = 'C'
    }
    if ((hit300 / totalhits > 0.7 && miss == 0) || (hit300 / totalhits > 0.8)) {
        grade = 'B'
    }
    if ((hit300 / totalhits > 0.8 && miss == 0) || (hit300 / totalhits > 0.9)) {
        grade = 'A'
    }
    if (Math.abs(hit300 / totalhits) > 0.9 && miss == 0 && Math.abs(hit50 / totalhits) < 0.01) {
        grade = 'S'
    }
    if (hit100 < 1 && hit50 < 1 && miss == 0) {
        grade = 'SS'
    }
    let finalarr = {
        grade: grade,
        accuracy: shortequation,
        fullacc: fullequation
    }

    return finalarr;
}
/**
 * 
 * @param {*} hit300 - hit 300s/greats (100%)
 * @param {*} hit100 - hit 100s/good (50%)
 * @param {*} miss - misses (0%)
 * @returns an array containing grades and accuracy
 */
function calcgradetaiko(hit300, hit100, miss) {
    topequation = Math.abs(hit300 + (hit100 / 2))
    bottomequation = Math.abs(hit300 + hit100 + miss)
    fullequation = (Math.abs((topequation / bottomequation) * 100)).toString() + '%'
    shortequation = ((Math.abs((topequation / bottomequation) * 100)).toFixed(2)).toString() + '%'
    grade = 'https://osu.ppy.sh/wiki/en/FAQ#grades'
    if (topequation / bottomequation > 0.8) {
        grade = 'B'
    }
    if (topequation / bottomequation > 0.9) {
        grade = 'A'
    }
    if (topequation / bottomequation > 0.95) {
        grade = 'S'
    }
    if (topequation / bottomequation == 1) {
        grade = 'SS'
    }
    let finalarr = {
        grade: grade,
        accuracy: shortequation,
        fullacc: fullequation
    }
    return finalarr;

}
/**
 * 
 * @param {*} hit300 - fruits caught
 * @param {*} hit100 - drops caught
 * @param {*} hit50 - droplets caught
 * @param {*} miss - misses
 * @returns an array containing grades and accuracy
 */
function calcgradecatch(hit300, hit100, hit50, miss) {
    let hits = hit300 + hit100 + hit50 + miss

    topequation = Math.floor(hit300 + hit100 + hit50)
    bottomequation = Math.floor(Math.abs(hits))
    fullequation = (Math.abs((topequation / bottomequation) * 100)).toString() + '%'
    shortequation = ((Math.abs((topequation / bottomequation) * 100)).toFixed(2)).toString() + '%'

    grade = 'D'
    if (topequation / bottomequation > 0.85) {
        grade = 'C'
    }
    if (topequation / bottomequation > 0.9) {
        grade = 'B'
    }
    if (topequation / bottomequation > 0.94) {
        grade = 'A'
    }
    if (topequation / bottomequation > 0.98) {
        grade = 'S'
    }
    if (topequation / bottomequation == 1) {
        grade = 'SS'
    }

    let finalarr = {
        grade: grade,
        accuracy: shortequation,
        fullacc: fullequation
    }
    return finalarr;
}
/**
 * 
 * @param {*} hit300max - hit max/300+ (100%)
 * @param {*} hit300 - hit 300 (100%)
 * @param {*} hit200 - hit 200 (66.66%)
 * @param {*} hit100 - hit 100 (33.33%)
 * @param {*} hit50 - hit 50 (16.66%)
 * @param {*} miss - miss (0%)
 * @returns an array containing grades and accuracy
 */
function calcgrademania(hit300max, hit300, hit200, hit100, hit50, miss) {
    topequation = Math.floor((300 * (hit300max + hit300)) + (200 * hit200) + (100 * hit100) + (50 * hit50))
    bottomequation = Math.floor(300 * (hit300max + hit300 + hit200 + hit100 + hit50 + miss))
    fullequation = (Math.abs((topequation / bottomequation) * 100)).toString() + '%'
    shortequation = ((Math.abs((topequation / bottomequation) * 100)).toFixed(2)).toString() + '%'
    grade = 'D'
    if (topequation / bottomequation == 0.7) {
        grade = 'C'
    }
    if (topequation / bottomequation == 0.8) {
        grade = 'B'
    }
    if (topequation / bottomequation > 0.9) {
        grade = 'A'
    }
    if (topequation / bottomequation > 0.95) {
        grade = 'S'
    }
    if (topequation / bottomequation == 1) {
        grade = 'SS'
    }
    let finalarr = {
        grade: grade,
        accuracy: shortequation,
        fullacc: fullequation
    }
    return finalarr;


}

module.exports = { calcgrade, calcgradetaiko, calcgradecatch, calcgrademania, }