const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { calculateStarRating } = require('osu-sr-calculator')
const { osulogdir } = require('../logconfig.json')
            console.log('pp');

              (async () => {
                const score = {
                    beatmap_id: '2860521',
                    score: '7573665',
                    maxcombo: '551',
                    count50: '0',
                    count100: '0',
                    count300: '383',
                    countmiss: '0',
                    countkatu: '0',
                    countgeki: '0',
                    perfect: '0',
                    enabled_mods: '72',
                    user_id: '4882979',
                    date: '2022-03-15 20:51:54',
                    rank: 'SS',
                    score_id: '3533591671'
                  }

    let pp = new std_ppv2().setPerformance(score);
        let ppSSjson = await pp.compute();

                console.log(ppSSjson)
            })();

//client.commands.get('').execute(message, args)