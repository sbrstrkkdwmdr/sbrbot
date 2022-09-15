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

export function flagImgUrl(string: string, ver?: 'osu') {
    let flagUrl: string = 'https://osu.ppy.sh/assets/images/flags/';

    //sorted by two letter codes

    switch (string.toLowerCase()) {
        case 'ar': case 'argentina':
            flagUrl += '';
            break;
        case 'at': case 'austria':
            flagUrl += '';
            break;
        case 'az': case 'azerbaijan':
            flagUrl += '';
            break;
        case 'au': case 'australia':
            flagUrl += '1f1e6-1f1fa.svg';
            break;
        case 'bh': case 'bahrain':
            flagUrl += '';
            break;
        case 'bb': case 'barbados':
            flagUrl += '';
            break;
        case 'bd': case 'bangladesh':
            flagUrl += '';
            break;
        case 'be': case 'belgium':
            flagUrl += '';
            break;
        case 'bn': case 'brunei':
            flagUrl += '';
            break;
        case 'br': case 'brazil':
            flagUrl += '';
            break;
        case 'bt': case 'bhutan':
            flagUrl += '';
            break;
        case 'bw': case 'botswana':
            flagUrl += '';
            break;
        case 'by': case 'belarus':
            flagUrl += '';
            break;
        case 'de': case 'germany':
            flagUrl += '';
            break;
        case 'dz': case 'algeria':
            flagUrl += '';
            break;
        case 'fr': case 'france':
            flagUrl += '';
            break;
        case 'id': case 'indonesia':
            flagUrl += '';
            break;
        case 'kr': case 'south korea': case 'republic of korea':
            flagUrl += '';
            break;
        case 'my': case 'malaysia':
            flagUrl += '';
            break;
        case 'ru': case 'russia':
            flagUrl += '1f1f7-1f1fa.svg';
            break;
        case 'se': case 'sweden':
            flagUrl += '';
            break;
        case 'sg': case 'singapore':
            flagUrl += '';
            break;
        case 'us': case 'usa': case 'america': case 'united states': case 'united states of america':
            flagUrl += '1f1fa-1f1f8.svg';
            break;
        case 'vn':
            break;
    }

    return flagUrl;
    // uk
    // ----us
    // ----algeria
    // ----argentina
    // ----australia
    // ----austria
    // ----azerbaijan
    // --bahrain
    // --bangladesh
    // --barbados
    // --belarus
    // --belgium
    // --bhutan
    // --botswana
    // brazil
    // brunei
    // bulgaria
    // cambodia
    // canda
    // chile
    // china
    // colombia
    // costa rica
    // cote d'lvoire
    // croatia
    // cuba
    // curacao
    // cyprus
    // czech
    // denmark
    // djibouti
    // ecuador
    // egypt
    // el salvador
    // estonia
    // ethiopia
    // fiji
    // finland
    // ----france
    // gabon
    // ghana
    // greece
    // guam
    // honduras
    // hong kong
    // hungary
    // iceland
    // india
    // ----indonesia
    // iraq
    // ireland
    // islamic rep. o. iran
    // israel
    // italy
    // jamaica
    // japan
    // jordan
    // kenya
    // kosov
    // kuwait
    // latvia
    // liechtenstein
    // lithuania
    // luxembourg
    // madagascar
    // maldives
    // malta
    // ----malaysia
    // mauritius
    // mexico
    // monaco
    // mongolia
    // morocco
    // myanmar
    // nepal
    // netherlands
    // new caledonia
    // new zealand
    // nigeria
    // north macedonia
    // norway
    // oman
    // pakistan
    // panama
    // papua new guinea
    // paraguay
    // peru
    // philippines
    // poland
    // portugal
    // qatar
    // romania
    // ----russia
    // saudi arabia
    // senegal
    // sierra leone
    // ----singapore
    // slovakia
    // slovenia 
    // south africa
    // ----south korea
    // spain
    // sri lanka
    // sudan
    // ----sweden
    // switzerland
    // syrian arab rep.
    // taiwan
    // thailand
    // togo
    // trinidad and tobago
    // tunisia
    // turkey
    // ukraine
    // uae
    // united rep. o. tanzania
    // uruguay
    // venezuala 
    // ----vietnam
    // zimbabwe

}