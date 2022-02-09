const { std_ppv2 } = require('booba');

let pickedmods = 'NM';

(async () => {
    //const response = await fetch(`https://osu.ppy.sh/api/get_user_recent?k=${API_KEY}&u=${USER}&limit=1`);
    //const json = await response.json();
    //const [score] = json;

    const score = {
        beatmap_id: '1962676',
        score: '6795149',
        maxcombo: '630',
        count50: '0',
        count100: '0',
        count300: '374',
        countmiss: '0',
        countkatu: '0',
        countgeki: '71',
        perfect: '0',
        enabled_mods: '0',
        user_id: '13780464',
        date: '2022-02-08 05:24:54',
        rank: 'S',
        score_id: '4057765057'
      }
    //const score = scorew
    const score95 = {
        beatmap_id: '1962676',
        score: '6795149',
        maxcombo: '630',
        count50: '0',
        count100: '64',
        count300: '374',
        countmiss: '0',
        countkatu: '3',
        countgeki: '71',
        perfect: '0',
        enabled_mods: '0',
        user_id: '13780464',
        date: '2022-02-08 05:24:54',
        rank: 'S',
        score_id: '4057765057'
    }
    let acc95 = Math.abs('91.02').toFixed(2);
  
    const pp = new std_ppv2().setPerformance(score).setMods(pickedmods);
    const ppcalc95 = new std_ppv2().setPerformance(score95).setMods(pickedmods);
    let ppSSjson = await pp.compute(100);

    let pp95json = await ppcalc95.compute(95.00);

    console.log(ppSSjson)
    //let ppSSstr = JSON.stringify(ppSSjson['total']);
    //let pp95str = JSON.stringify(pp95json['total']);

    //let ppSS = Math.abs(ppSSstr).toFixed(2)
    //let pp95 = Math.abs(pp95str).toFixed(2)

    
    console.log(pp95json)

    })();