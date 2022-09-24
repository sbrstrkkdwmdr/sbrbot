import fs = require('fs')
export function readAllFiles(directory: string) {
    const filesArr = []
    const init = fs.readdirSync(directory)
    //add init to filesArr
    //add all files in subdirectories to filesArr
    for (let i = 0; i < init.length; i++) {
        if (fs.statSync(directory + '/' + init[i]).isDirectory()) {
            const sub = fs.readdirSync(directory + '/' + init[i])
            for (let j = 0; j < sub.length; j++) {
                //add sub-sub-directories to filesArr, and so on and so on
                if (fs.statSync(directory + '/' + init[i] + '/' + sub[j]).isDirectory()) {
                    const subsub = fs.readdirSync(directory + '/' + init[i] + '/' + sub[j])
                    for (let k = 0; k < subsub.length; k++) {
                        filesArr.push(init[i] + '/' + sub[j] + '/' + subsub[k])
                    }
                } else {
                    filesArr.push(init[i] + '/' + sub[j])
                }
            }
        } else {
            filesArr.push(init[i])
        }
    }
    return filesArr;
}

/**
 * @info separates numbers ie 3000000 -> 3,000,000
 * @param number 
 * @param separator default is ,
 * @returns string
 */
export function separateNum(number:string|number, separator?:string){
    let cursep = ','
    if(separator){
        cursep = separator
    }
    let ans = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, cursep)
    if(number.toString().includes('.')){
    const init = number.toString().split('.')[0];
    const after = number.toString().split('.')[1];
    ans = init.replace(/\B(?=(\d{3})+(?!\d))/g, cursep) + `.${after}`
    }
    return ans;
}

export function flagImgUrl(string: string, ver?: 'osu') {
    const flagUrl: string = `https://osuflags.omkserver.nl/${string}`;
return flagUrl;
}