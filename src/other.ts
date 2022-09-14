import fs = require('fs')
export function readAllFiles(directory: string) {
    let filesArr = []
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

    // function x(string) {
    //     if (fs.statSync(string).isDirectory()){
    //         const sub = fs.readdirSync(string)
    //         if(fs.statSync(string + '/' + sub[0]).isDirectory()){
    //             x(string + '/' + sub[0])
    //         }
    //     }
    // }

    return filesArr;
}