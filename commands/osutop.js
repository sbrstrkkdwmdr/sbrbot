const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const xhr = new XMLHttpRequest();
const GET = require('node-fetch');
const fs = require('fs');
module.exports = {
    name: 'osutop',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        const pickeduserX = args[0];
//        `https://osutrack-api.ameo.dev/hiscores?user=${pickeduserX}&mode=0`
        let url = `https://osutrack-api.ameo.dev/hiscores?user=${pickeduserX}&mode=0&limit=5`;
       /* const hiscores = [
            {
              "beatmap_id": 49977,
              "score": 57002,
              "pp": 1.87718,
              "mods": 0,
              "rank": "C",
              "score_time": "2011-01-09T02:21:38.000Z",
              "update_time": "2020-03-13T08:44:01.000Z"
            },
            {
              "beatmap_id": 11515,
              "score": 78210,
              "pp": 1.01566,
              "mods": 0,
              "rank": "C",
              "score_time": "2011-01-09T13:54:35.000Z",
              "update_time": "2020-03-13T08:44:01.000Z"
            },
            {
              "beatmap_id": 41227,
              "score": 31416,
              "pp": 0.357312,
              "mods": 0,
              "rank": "D",
              "score_time": "2011-01-09T13:56:51.000Z",
              "update_time": "2020-03-13T08:44:01.000Z"
            },
            ];*/
    try {fetch(url)
    .then(res => res.json())
    .then(out =>
{        out.sort((a, b) => b.pp - a.pp);
    const topHiscores = out.slice(0, 5);
        fs.writeFileSync("w.json", JSON.stringify(topHiscores));
        message.reply(JSON.stringify(topHiscores));
    }
    )} catch (error) {
        message.reply(error)
    }
    

        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osutop")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
    }
}
//client.commands.get('').execute(message, args)