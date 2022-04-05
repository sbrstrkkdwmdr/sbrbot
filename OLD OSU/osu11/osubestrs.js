const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const xhr = new XMLHttpRequest();
const GET = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { exec } = require("child_process");
const { osulogdir } = require('../logconfig.json')

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
    try {fetch(url)
    .then(res => res.json())
    .then(out =>
{        out.sort((a, b) => b.pp - a.pp);
    const topHiscores = out.slice(0, 10);
        fs.writeFileSync("debug/osubest.json", JSON.stringify(topHiscores, null, 2));
        let bmid1 = JSON.stringify(topHiscores[0], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid2 = JSON.stringify(topHiscores[1], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid3 = JSON.stringify(topHiscores[2], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid4 = JSON.stringify(topHiscores[3], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid5 = JSON.stringify(topHiscores[4], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid6 = JSON.stringify(topHiscores[5], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid7 = JSON.stringify(topHiscores[6], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid8 = JSON.stringify(topHiscores[7], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid9 = JSON.stringify(topHiscores[8], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')
        let bmid10 = JSON.stringify(topHiscores[9], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '')//
        let sc1 = JSON.stringify(topHiscores[0], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc2 = JSON.stringify(topHiscores[1], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc3 = JSON.stringify(topHiscores[2], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc4 = JSON.stringify(topHiscores[3], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc5 = JSON.stringify(topHiscores[4], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc6 = JSON.stringify(topHiscores[5], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc7 = JSON.stringify(topHiscores[6], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc8 = JSON.stringify(topHiscores[7], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc9 = JSON.stringify(topHiscores[8], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')
        let sc10 = JSON.stringify(topHiscores[9], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score', '')//
        let perform1 = JSON.stringify(topHiscores[0], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform2 = JSON.stringify(topHiscores[1], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform3 = JSON.stringify(topHiscores[2], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform4 = JSON.stringify(topHiscores[3], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform5 = JSON.stringify(topHiscores[4], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform6 = JSON.stringify(topHiscores[5], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform7 = JSON.stringify(topHiscores[6], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform8 = JSON.stringify(topHiscores[7], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform9 = JSON.stringify(topHiscores[8], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')
        let perform10 = JSON.stringify(topHiscores[9], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '')//
        let modify1 = JSON.stringify(topHiscores[0], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify2 = JSON.stringify(topHiscores[1], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify3 = JSON.stringify(topHiscores[2], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify4 = JSON.stringify(topHiscores[3], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify5 = JSON.stringify(topHiscores[4], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify6 = JSON.stringify(topHiscores[5], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify7 = JSON.stringify(topHiscores[6], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify8 = JSON.stringify(topHiscores[7], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify9 = JSON.stringify(topHiscores[8], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')
        let modify10 = JSON.stringify(topHiscores[9], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '')//
        let grade1 = JSON.stringify(topHiscores[0], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade2 = JSON.stringify(topHiscores[1], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade3 = JSON.stringify(topHiscores[2], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade4 = JSON.stringify(topHiscores[3], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade5 = JSON.stringify(topHiscores[4], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade6 = JSON.stringify(topHiscores[5], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade7 = JSON.stringify(topHiscores[6], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade8 = JSON.stringify(topHiscores[7], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade9 = JSON.stringify(topHiscores[8], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')
        let grade10 = JSON.stringify(topHiscores[9], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '')//
        let sctime1 = JSON.stringify(topHiscores[0], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime2 = JSON.stringify(topHiscores[1], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime3 = JSON.stringify(topHiscores[2], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime4 = JSON.stringify(topHiscores[3], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime5 = JSON.stringify(topHiscores[4], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime6 = JSON.stringify(topHiscores[5], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime7 = JSON.stringify(topHiscores[6], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime8 = JSON.stringify(topHiscores[7], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime9 = JSON.stringify(topHiscores[8], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)
        let sctime10 = JSON.stringify(topHiscores[9], ['score_time']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('score_time', '').slice(0, 10)//
        let user1 = JSON.stringify(topHiscores[0], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user2 = JSON.stringify(topHiscores[1], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user3 = JSON.stringify(topHiscores[2], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user4 = JSON.stringify(topHiscores[3], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user5 = JSON.stringify(topHiscores[4], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user6 = JSON.stringify(topHiscores[5], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user7 = JSON.stringify(topHiscores[6], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user8 = JSON.stringify(topHiscores[7], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user9 = JSON.stringify(topHiscores[8], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)
        let user10 = JSON.stringify(topHiscores[9], ['user']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user', '').slice(0, 10)//
        let Embeda = new Discord.MessageEmbed()
            .setColor(0xFFC1EC)
            .setTitle("Top plays of all today")
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
        let Embedscore6 = new Discord.MessageEmbed()
            .setColor(0x462B76)
            .setTitle("#6")
            .setDescription(`https://osu.ppy.sh/b/${bmid6}` + "\nScore set on " + sctime6 + " by https://osu.ppy.sh/u/" + user6 + "\n **SCORE**: " + sc6 + " | " + perform6 + "**PP**\n" + "+" + modify6 + " | " + grade6);
        let Embedscore7 = new Discord.MessageEmbed()
            .setColor(0x462B77)
            .setTitle("#7")
            .setDescription(`https://osu.ppy.sh/b/${bmid7}` + "\nScore set on " + sctime7 + " by https://osu.ppy.sh/u/" + user7 + "\n **SCORE**: " + sc7 + " | " + perform7 + "**PP**\n" + "+" + modify7 + " | " + grade7);
            let Embedscore8 = new Discord.MessageEmbed()
            .setColor(0x462B78)
            .setTitle("#8")
            .setDescription(`https://osu.ppy.sh/b/${bmid8}` + "\nScore set on " + sctime8 + " by https://osu.ppy.sh/u/" + user8 + "\n **SCORE**: " + sc8 + " | " + perform8 + "**PP**\n" + "+" + modify8 + " | " + grade8);
            let Embedscore9 = new Discord.MessageEmbed()
            .setColor(0x462B79)
            .setTitle("#9")
            .setDescription(`https://osu.ppy.sh/b/${bmid9}` + "\nScore set on " + sctime9 + " by https://osu.ppy.sh/u/" + user9 + "\n **SCORE**: " + sc9 + " | " + perform9 + "**PP**\n" + "+" + modify9 + " | " + grade9);
            let Embedscore10 = new Discord.MessageEmbed()
            .setColor(0x462B70)
            .setTitle("#10")
            .setDescription(`https://osu.ppy.sh/b/${bmid10}` + "\nScore set on " + sctime10 + " by https://osu.ppy.sh/u/" + user10 + "\n **SCORE**: " + sc10 + " | " + perform10 + "**PP**\n" + "+" + modify10 + " | " + grade10);

    
       
         /*let EmbedScores = new Discord.MessageEmbed()
            .setColor(0x462B75)
            .setTitle("The top 10 highest pp scores over the past 24h: from " + curdateyesterday + " to " + curdatetmr + ` | ${curtimezone}`)
            .setDescription(" ")
            .addField(`https://osu.ppy.sh/b/${bmid1} \nScore set on ${sctime1} by https://osu.ppy.sh/u/${user1} \n **SCORE**: ${sc1} | ${perform1} **PP**\n + ${modify1} | ${grade1}`)*/
            message.reply({ embeds: [Embedscore1, Embedscore2, Embedscore3, Embedscore4, Embedscore5, Embedscore6, Embedscore7, Embedscore8, Embedscore9, Embedscore10 /*EmbedScores*/] });
            message.channel.send("The top 10 highest pp scores over the past 24h: from " + curdateyesterday + " to " + curdatetmr + ` | ${curtimezone}`)
            //message.reply("```json\nTOP SCORES FOR " + pickeduserX + "\n" + JSON.stringify(topHiscores, null, 2).replaceAll('"', '').replaceAll('beatmap_id', 'beatmap id').replaceAll('[', '').replaceAll(']', '').replaceAll(',', '').replaceAll('}', '').replaceAll('{', '------------') + "```");
    }
    )} catch (error) {
        fs.appendFileSync(osulogdir, "\n" + error)
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