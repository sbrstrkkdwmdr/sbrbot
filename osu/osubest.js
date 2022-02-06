const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const xhr = new XMLHttpRequest();
const GET = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { exec } = require("child_process");
module.exports = {
    name: 'osubest',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
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
    try {fetch(url)
    .then(res => res.json())
    .then(out =>
{        out.sort((a, b) => b.pp - a.pp);
    const topHiscores = out.slice(0, 5);
        fs.writeFileSync("w.json", JSON.stringify(topHiscores, null, 2));
        console.log("writing data to w.json")
        console.log("")
        let bmid1 = JSON.stringify(topHiscores[0], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid2 = JSON.stringify(topHiscores[1], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid3 = JSON.stringify(topHiscores[2], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid4 = JSON.stringify(topHiscores[3], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid5 = JSON.stringify(topHiscores[4], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')//
        let sc1 = JSON.stringify(topHiscores[0], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc2 = JSON.stringify(topHiscores[1], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc3 = JSON.stringify(topHiscores[2], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc4 = JSON.stringify(topHiscores[3], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc5 = JSON.stringify(topHiscores[4], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')//
        let perform1 = JSON.stringify(topHiscores[0], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform2 = JSON.stringify(topHiscores[1], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform3 = JSON.stringify(topHiscores[2], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform4 = JSON.stringify(topHiscores[3], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform5 = JSON.stringify(topHiscores[4], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')//
        let modify1 = JSON.stringify(topHiscores[0], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify2 = JSON.stringify(topHiscores[1], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify3 = JSON.stringify(topHiscores[2], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify4 = JSON.stringify(topHiscores[3], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify5 = JSON.stringify(topHiscores[4], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')//
        let grade1 = JSON.stringify(topHiscores[0], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade2 = JSON.stringify(topHiscores[1], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade3 = JSON.stringify(topHiscores[2], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade4 = JSON.stringify(topHiscores[3], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade5 = JSON.stringify(topHiscores[4], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')//
        let sctime1 = JSON.stringify(topHiscores[0], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime2 = JSON.stringify(topHiscores[1], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime3 = JSON.stringify(topHiscores[2], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime4 = JSON.stringify(topHiscores[3], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime5 = JSON.stringify(topHiscores[4], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)//
        let user1 = JSON.stringify(topHiscores[0], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user2 = JSON.stringify(topHiscores[1], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user3 = JSON.stringify(topHiscores[2], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user4 = JSON.stringify(topHiscores[3], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user5 = JSON.stringify(topHiscores[4], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)//
        let Embeda = new Discord.MessageEmbed()
            .setColor(0xFFC1EC)
            .setTitle("Top plays of all time")
            .setImage(``);
        let Embedscore1 = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("#1")
            .setDescription(`https://osu.ppy.sh/b/${bmid1}` + "\nScore set on " + sctime1 + " by https://osu.ppy.sh/u/" + user1 + "\n **SCORE**: " + sc1 + " | " + perform1 + "**PP**\n" + "+" + modify1 + " | " + grade1);
        let Embedscore2 = new Discord.MessageEmbed()
            .setColor(0x462B72)
            .setTitle("#2")
            .setDescription(`https://osu.ppy.sh/b/${bmid2}` + "\nScore set on " + sctime2 + " by https://osu.ppy.sh/u/" + user2 + "\n **SCORE**: " + sc2 + " | " + perform2 + "**PP**\n" + "+" + modify2 + " | " + grade2);
        let Embedscore3 = new Discord.MessageEmbed()
            .setColor(0x462B73)
            .setTitle("#3")
            .setDescription(`https://osu.ppy.sh/b/${bmid3}` + "\nScore set on " + sctime3 + " by https://osu.ppy.sh/u/" + user3 + "\n **SCORE**: " + sc3 + " | " + perform3 + "**PP**\n" + "+" + modify3 + " | " + grade3);
        let Embedscore4 = new Discord.MessageEmbed()
            .setColor(0x462B74)
            .setTitle("#4")
            .setDescription(`https://osu.ppy.sh/b/${bmid4}` + "\nScore set on " + sctime4 + "by https://osu.ppy.sh/u/" + user4 + "\n **SCORE**: " + sc4 + " | " + perform4 + "**PP**\n" + "+" + modify4 + " | " + grade4);
        let Embedscore5 = new Discord.MessageEmbed()
            .setColor(0x462B75)
            .setTitle("#5")
            .setDescription(`https://osu.ppy.sh/b/${bmid5}` + "\nScore set on " + sctime5 + " by https://osu.ppy.sh/u/" + user5 + "\n **SCORE**: " + sc5 + " | " + perform5 + "**PP**\n" + "+" + modify5 + " | " + grade5);
            message.reply({ embeds: [Embeda, Embedscore1, Embedscore2, Embedscore3, Embedscore4, Embedscore5] });
            message.channel.send(`info may be outdated. go to https://ameobea.me/osutrack/ to update`)
        //message.reply("```json\nTOP SCORES FOR " + pickeduserX + "\n" + JSON.stringify(topHiscores, null, 2).replaceAll('"', '').replaceAll('beatmap_id', 'beatmap id').replaceAll('[', '').replaceAll(']', '').replaceAll(',', '').replaceAll('}', '').replaceAll('{', '------------') + "```");
    }
    )} catch (error) {
        message.reply(error)
    }
    

        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osubest")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
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