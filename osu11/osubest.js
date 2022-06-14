const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const xhr = new XMLHttpRequest();
const GET = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { exec } = require("child_process");
const { osulogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')


module.exports = {
    name: 'osubest',
    description: 'Returns the current top five pp plays' +
    '\nUsage: `sbr-osubest`',
    execute(message, args, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        //        `https://osutrack-api.ameo.dev/hiscores?user=${pickeduserX}&mode=0`
        let url = `https://osutrack-api.ameo.dev/bestplays?mode=0`;
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
        try {
            fetch(url)
                .then(res => res.json())
                .then(out => {
                    out.sort((a, b) => b.pp - a.pp);
                    const topHiscores = out.slice(0, 5);
                    fs.writeFileSync("debug/osubest.json", JSON.stringify(topHiscores, null, 2));
                    fs.appendFileSync(osulogdir, "\n" + "writing data to w.json")
                    fs.appendFileSync(osulogdir, "\n" + "")
                    let Embedpenis = new Discord.MessageEmbed()
                        .setColor(0xFFC1EC)
                        .setTitle("Top plays of all time")
                        .setImage(``)
                    for (i = 0; i < 5; i++) {
                        let bmid = topHiscores[i].beatmap_id
                        let sc = topHiscores[i].score
                        let perform = topHiscores[i].pp
                        let modify = topHiscores[i].mods
                        if (modify) {
                            mods = modify
                        } else {
                            mods = ''
                        }
                        let grade = topHiscores[i].rank
                        let sctime = topHiscores[i].score_time.toString().slice(0, 10)
                        let user = topHiscores[i].user
                        Embedpenis.addField(`#${i + 1} | Score set on ${sctime} by https://osu.ppy.sh/u/${user}`, `https://osu.ppy.sh/b/${bmid} \n**SCORE**: ${sc} | ${perform}**pp**\n+${mods} | ${grade}`, false)
                    }

                    message.reply({ embeds: [Embedpenis] });
                    //message.reply("```json\nTOP SCORES FOR " + pickeduserX + "\n" + JSON.stringify(topHiscores, null, 2).replaceAll('"', '').replaceAll('beatmap_id', 'beatmap id').replaceAll('[', '').replaceAll(']', '').replaceAll(',', '').replaceAll('}', '').replaceAll('{', '------------') + "```");
                }
                )
        } catch (error) {
            message.reply(error)
            fs.appendFileSync(osulogdir, "\n" + error)
            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
        }


        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - osubest")
        let consoleloguserweeee = message.author
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "")
        console.groupEnd()

    }
}
//client.commands.get('').execute(message, args)
/*
note for mods
HDNC=584
EZHDDT=74
HDDT=72
DT=64
HDNCHR=600
    TouchDevice    = 4,
    Hidden         = 8,
    HardRock       = 16,
    SuddenDeath    = 32,
    DoubleTime     = 64,
    Relax          = 128,
    HalfTime       = 256,
    Nightcore      = 512, // Only set along with DoubleTime. i.e: NC only gives 576
    Flashlight     = 1024,
    Autoplay       = 2048,
    SpunOut        = 4096,
    Relax2         = 8192,    // Autopilot
    Perfect        = 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416  
    Key4           = 32768,
    Key5           = 65536,
    Key6           = 131072,
    Key7           = 262144,
    Key8           = 524288,
    FadeIn         = 1048576,
    Random         = 2097152,
    Cinema         = 4194304,
    Target         = 8388608,
    Key9           = 16777216,
    KeyCoop        = 33554432,
    Key1           = 67108864,
    Key3           = 134217728,
    Key2           = 268435456,
    ScoreV2        = 536870912,
    Mirror         = 1073741824,
*/