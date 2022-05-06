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
    name: 'osubestrs',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, curdateyesterday, curdatetmr, curtimezone) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        //        `https://osutrack-api.ameo.dev/hiscores?user=${pickeduserX}&mode=0`
        let url = `https://osutrack-api.ameo.dev/bestplays?mode=0&from=${curdateyesterday}&to=${curdatetmr}`;
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
                    const topHiscores = out.slice(0, 10);
                    fs.writeFileSync("debug/osubest.json", JSON.stringify(topHiscores, null, 2));

                    let Embeda = new Discord.MessageEmbed()
                        .setColor(0xFFC1EC)
                        .setTitle("Top plays from the past 24h")
                        .setImage(``)
                    for (i = 0; i < 10; i++) {
                        let bmid = topHiscores[i].beatmap_id
                        let sc = topHiscores[i].score
                        let perform = topHiscores.pp
                        let modify = topHiscores.mods
                        if (modify) {
                            mods = modify
                        } else {
                            mods = ''
                        }
                        let grade = topHiscores.rank
                        let sctime = topHiscores.score_time.toString().slice(0, 10)
                        let user = topHiscores.user
                        Embedpenis.addField(`#${i + 1} | Score set on ${sctime} by https://osu.ppy.sh/u/${user}`, `https://osu.ppy.sh/b/${bmid} \n**SCORE**: ${sc} | ${perform}**pp**\n+${mods} | ${grade}`, false)
                    }



                    /*let EmbedScores = new Discord.MessageEmbed()
                       .setColor(0x462B75)
                       .setTitle("The top 10 highest pp scores over the past 24h: from " + curdateyesterday + " to " + curdatetmr + ` | ${curtimezone}`)
                       .setDescription(" ")
                       .addField(`https://osu.ppy.sh/b/${bmid1} \nScore set on ${sctime1} by https://osu.ppy.sh/u/${user1} \n **SCORE**: ${sc1} | ${perform1} **PP**\n + ${modify1} | ${grade1}`)*/
                    message.reply({ content: `The top 10 highest pp scores over the past 24h: from ${curdateyesterday} to ${curdatetmr} | ${curtimezone}`, embeds: [Embeda] })
                    //message.reply("```json\nTOP SCORES FOR " + pickeduserX + "\n" + JSON.stringify(topHiscores, null, 2).replaceAll('"', '').replaceAll('beatmap_id', 'beatmap id').replaceAll('[', '').replaceAll(']', '').replaceAll(',', '').replaceAll('}', '').replaceAll('{', '------------') + "```");
                }
                )
        } catch (error) {
            fs.appendFileSync(osulogdir, "\n" + error)
            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
            console.groupEnd()
        }


        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - osubest past 24h")
        let consoleloguserweeee = message.author
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "")
        console.groupEnd()

    }
}
//client.commands.get('').execute(message, args)
/*
note for mods
NM=0
EZ=
NF=
HT=
HR=
SD=
PF=
DT=64
NC=
HD=
FL=
RX=
AP=
TP=
SO=
AT=
CN=
S2=
HDNC=584
EZHDDT=74
HDDT=72
DT=64
HDNCHR=600
*/