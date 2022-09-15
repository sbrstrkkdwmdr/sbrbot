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
    let flagUrl: string = `https://osuflags.omkserver.nl/${string}`;
return flagUrl;
}
    // forgor https://osuflags.omkserver.nl/ was a thing

    


//     //sorted by alphabetically

//     switch (string.toLowerCase()) {
//         case 'argentina': case 'ar': case 'arg':
//             flagUrl += '';
//             break;
//         case 'algeria': case 'dz': case 'dza':
//             flagUrl += '';
//             break;
//         case 'australia': case 'au': case 'aus':
//             flagUrl += '1f1e6-1f1fa.svg';
//             break;
//         case 'austria': case 'at': case 'aut':
//             flagUrl += '';
//             break;
//         case 'azerbaijan': case 'az': case 'aze':
//             flagUrl += '';
//             break;
//         case 'bahrain': case 'bh': case 'bhr':
//             flagUrl += '';
//             break;
//         case 'bangladesh': case 'bd': case 'bgd':
//             flagUrl += '';
//             break;
//         case 'barbados': case 'bb': case 'brb':
//             flagUrl += '';
//             break;
//         case 'belarus': case 'by': case 'blr':
//             flagUrl += '';
//             break;
//         case 'belgium': case 'be': case 'bel':
//             flagUrl += '';
//             break;
//         case 'bhutan': case 'bt': case 'btn':
//             flagUrl += '';
//             break;
//         case 'brazil': case 'br': case 'bra':
//             flagUrl += '';
//             break;
//         case 'brunei': case 'bn': case 'brn':
//             flagUrl += '';
//             break;
//         case 'botswana': case 'bw': case 'bwa':
//             flagUrl += '';
//             break;
//         case 'bulgaria': case 'bg': case 'bgr':
//             flagUrl += '';
//             break;
//         case 'cambodia': case 'kh': case 'khm':
//             flagUrl += '';
//             break;
//         case 'canada': case 'ca': case 'can':
//             flagUrl += '';
//             break;
//         case 'chile': case 'cl': case 'chl':
//             flagUrl += '';
//             break;
//         case 'china': case 'cn': case 'chn':
//             flagUrl += '';
//             break;
//         case 'colombia': case 'co': case 'col':
//             flagUrl += '';
//             break;
//         case 'costa rica': case 'cr': case 'cri':
//             flagUrl += '';
//             break;
//         case 'cote d\'ivoire': case 'ci': case 'civ': case 'ivory coast':
//             flagUrl += '';
//             break;
//         case 'croatia': case 'hr': case 'hrv':
//             flagUrl += '';
//             break;
//         case 'cuba': case 'cu': case 'cub':
//             flagUrl += '';
//             break;
//         case 'curaçao': case 'cw': case 'cuw':
//             flagUrl += '';
//             break;
//         case 'cyprus': case 'cy': case 'cyp':
//             flagUrl += '';
//             break;
//         case 'czech republic': case 'cz': case 'cze': case 'czechia':
//             flagUrl += '';
//             break;
//         case 'denmark': case 'dk': case 'dnk':
//             flagUrl += '';
//             break;
//         case 'djibouti': case 'dj': case 'dji':
//             flagUrl += '';
//             break;
//         case 'ecuador': case 'ec': case 'ecu':
//             flagUrl += '';
//             break;
//         case 'egypt': case 'eg': case 'egy':
//             flagUrl += '';
//             break;
//         case 'el salvador': case 'sv': case 'slv':
//             flagUrl += '';
//             break;
//         case 'estonia': case 'ee': case 'est':
//             flagUrl += '';
//             break;
//         case 'ethiopia': case 'et': case 'eth':
//             flagUrl += '';
//             break;
//         case 'fiji': case 'fj': case 'fji':
//             flagUrl += '';
//             break;
//         case 'finland': case 'fi': case 'fin':
//             flagUrl += '';
//             break;
//         case 'france': case 'fr': case 'fra':
//             flagUrl += '';
//             break;
//         case 'gabon': case 'ga': case 'gab':
//             flagUrl += '';
//             break;
//         case 'germany': case 'de': case 'deu':
//             flagUrl += '';
//             break;
//         case 'ghana': case 'gh': case 'gha':
//             flagUrl += '';
//             break;
//         case 'greece': case 'gr': case 'grc':
//             flagUrl += '';
//             break;
//         case 'guam': case 'gu': case 'gum':
//             flagUrl += '';
//             break;
//         case 'honduras': case 'hn': case 'hnd':
//             flagUrl += '';
//             break;
//         case 'hong kong': case 'hk': case 'hkg':
//             flagUrl += '';
//             break;
//         case 'hungary': case 'hu': case 'hun':
//             flagUrl += '';
//             break;
//         case 'iceland': case 'is': case 'isl':
//             flagUrl += '';
//             break;
//         case 'india': case 'in': case 'ind':
//             flagUrl += '';
//             break;
//         case 'indonesia': case 'id': case 'idn':
//             flagUrl += '';
//             break;
//         case 'iran': case 'ir': case 'irn':
//             flagUrl += '';
//             break;
//         case 'iraq': case 'iq': case 'irq':
//             flagUrl += '';
//             break;
//         case 'ireland': case 'ie': case 'irl':
//             flagUrl += '';
//             break;
//         case 'israel': case 'il': case 'isr':
//             flagUrl += '';
//             break;
//         case 'italy': case 'it': case 'ita':
//             flagUrl += '';
//             break;
//         case 'malaysia': case 'my':
//             flagUrl += '';
//             break;
//         case 'south korea': case 'republic of korea': case 'kr':
//             flagUrl += '';
//             break;
//         case 'russia': case 'ru':
//             flagUrl += '1f1f7-1f1fa.svg';
//             break;
//         case 'sweden': case 'se':
//             flagUrl += '';
//             break;
//         case 'singapore': case 'sg':
//             flagUrl += '';
//             break;
//         case 'usa': case 'america': case 'united states': case 'united states of america': case 'us':
//             flagUrl += '1f1fa-1f1f8.svg';
//             break;
//         case 'vn':
//             break;
//     }

//     return flagUrl;
//     // uk
//     // ----us
//     // ----algeria
//     // ----argentina
//     // ----australia
//     // ----austria
//     // ----azerbaijan
//     // --bahrain
//     // --bangladesh
//     // --barbados
//     // --belarus
//     // --belgium
//     // --bhutan
//     // --botswana
//     // --brazil
//     // --brunei
//     // --bulgaria
//     // --cambodia
//     // --canda
//     // --chile
//     // --china
//     // --colombia
//     // --costa rica
//     // --cote d'lvoire
//     // --croatia
//     // --cuba
//     // --curacao
//     // --cyprus
//     // --czech
//     // --denmark
//     // --djibouti
//     // --ecuador
//     // --egypt
//     // --el salvador
//     // --estonia
//     // --ethiopia
//     // --fiji
//     // --finland
//     // --france
//     // --gabon
//     // --ghana
//     // --greece
//     // --guam
//     // --honduras
//     // --hong kong
//     // --hungary
//     // --iceland
//     // --india
//     // ----indonesia
//     // --iraq
//     // --ireland
//     // --islamic rep. o. iran
//     // --israel
//     // italy
//     // jamaica
//     // japan
//     // jordan
//     // kenya
//     // kosov
//     // kuwait
//     // latvia
//     // liechtenstein
//     // lithuania
//     // luxembourg
//     // madagascar
//     // maldives
//     // malta
//     // ----malaysia
//     // mauritius
//     // mexico
//     // monaco
//     // mongolia
//     // morocco
//     // myanmar
//     // nepal
//     // netherlands
//     // new caledonia
//     // new zealand
//     // nigeria
//     // north macedonia
//     // norway
//     // oman
//     // pakistan
//     // panama
//     // papua new guinea
//     // paraguay
//     // peru
//     // philippines
//     // poland
//     // portugal
//     // qatar
//     // romania
//     // ----russia
//     // saudi arabia
//     // senegal
//     // sierra leone
//     // ----singapore
//     // slovakia
//     // slovenia 
//     // south africa
//     // ----south korea
//     // spain
//     // sri lanka
//     // sudan
//     // ----sweden
//     // switzerland
//     // syrian arab rep.
//     // taiwan
//     // thailand
//     // togo
//     // trinidad and tobago
//     // tunisia
//     // turkey
//     // ukraine
//     // uae
//     // united rep. o. tanzania
//     // uruguay
//     // venezuala 
//     // ----vietnam
//     // zimbabwe

// }