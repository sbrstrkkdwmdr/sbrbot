//https://github.com/Ameobea/osutrack-api
const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const xhr = new XMLHttpRequest();
const GET = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { exec } = require("child_process");
const { access_token } = require('../osuauth.json');
module.exports = {
    name: 'osutop',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
 
        const pickeduserX = args[0];
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osutop")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        if(!pickeduserX) return message.reply("user ID required");
        if(isNaN(pickeduserX)) return message.reply("You must use ID e.g. 15222484 instead of SaberStrike")
      
        try{
            let oauthurl = new URL ("https://osu.ppy.sh/oauth/token");
            let body1 = {
                "client_id": osuclientid,
                "client_secret": osuclientsecret,
                "grant_type": "client_credentials",
                "scope": "public"
            }
            fetch(oauthurl, {
                method: "POST",
                body: JSON.stringify(body1),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(output => fs.writeFileSync("osuauth.json", JSON.stringify(output, null, 2)))
            ;
            const recentactiveurl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/scores/best?mode=osu&limit=58&offset=0`;
            
            let headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };
            fetch(recentactiveurl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output2 => 
                {const osutopdata = output2;
                fs.writeFileSync("osutop.json", JSON.stringify(osutopdata, null, 2));
                let topplayername = JSON.stringify(osutopdata[0]['user'], ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');
                //let mapbg1 = JSON.stringify(osutopdata[0]['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
                let topplayeravatar = JSON.stringify(osutopdata[0]['user'], ['avatar_url']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('avatar_url', '').replace('https', 'https:');
                let maptitle1 = JSON.stringify(osutopdata[0]['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                let mapdiff1 = JSON.stringify(osutopdata[0]['beatmap'], ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('version', '');
                let mapurl1 = JSON.stringify(osutopdata[0]['beatmap'], ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('id', '');
                let maptimeset1 = JSON.stringify(osutopdata[0], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('created_at', '').slice(0, 10);
                let mapacc1 = JSON.stringify(osutopdata[0], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                let mappp1 = JSON.stringify(osutopdata[0]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                let mapmiss1 = JSON.stringify(osutopdata[0]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                let map501 = JSON.stringify(osutopdata[0]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                let map1001 = JSON.stringify(osutopdata[0]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                let map3001 = JSON.stringify(osutopdata[0]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                let maprank1 = JSON.stringify(osutopdata[0], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                let mapscore1 = JSON.stringify(osutopdata[0], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
                let mapmods1 = JSON.stringify(osutopdata[0], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');

                let maptitle2 = JSON.stringify(osutopdata[1]['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                let mapdiff2 = JSON.stringify(osutopdata[1]['beatmap'], ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('version', '');
                let mapurl2 = JSON.stringify(osutopdata[1]['beatmap'], ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('id', '');
                let maptimeset2 = JSON.stringify(osutopdata[1], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('created_at', '').slice(0, 10);
                let mapacc2 = JSON.stringify(osutopdata[1], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                let mappp2 = JSON.stringify(osutopdata[1]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                let mapmiss2 = JSON.stringify(osutopdata[1]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                let map502 = JSON.stringify(osutopdata[1]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                let map1002 = JSON.stringify(osutopdata[1]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                let map3002 = JSON.stringify(osutopdata[1]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                let maprank2 = JSON.stringify(osutopdata[1], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                let mapscore2 = JSON.stringify(osutopdata[1], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
                let mapmods2 = JSON.stringify(osutopdata[1], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');

                let maptitle3 = JSON.stringify(osutopdata[2]['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                let mapdiff3 = JSON.stringify(osutopdata[2]['beatmap'], ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('version', '');
                let mapurl3 = JSON.stringify(osutopdata[2]['beatmap'], ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('id', '');
                let maptimeset3 = JSON.stringify(osutopdata[2], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('created_at', '').slice(0, 10);
                let mapacc3 = JSON.stringify(osutopdata[2], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                let mappp3 = JSON.stringify(osutopdata[2]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                let mapmiss3 = JSON.stringify(osutopdata[2]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                let map503 = JSON.stringify(osutopdata[2]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                let map1003 = JSON.stringify(osutopdata[2]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                let map3003 = JSON.stringify(osutopdata[2]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                let maprank3 = JSON.stringify(osutopdata[2], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                let mapscore3 = JSON.stringify(osutopdata[2], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
                let mapmods3 = JSON.stringify(osutopdata[2], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                
                let maptitle4 = JSON.stringify(osutopdata[3]['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                let mapdiff4 = JSON.stringify(osutopdata[3]['beatmap'], ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('version', '');
                let mapurl4 = JSON.stringify(osutopdata[3]['beatmap'], ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('id', '');
                let maptimeset4 = JSON.stringify(osutopdata[3], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('created_at', '').slice(0, 10);
                let mapacc4 = JSON.stringify(osutopdata[3], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                let mappp4 = JSON.stringify(osutopdata[3]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                let mapmiss4 = JSON.stringify(osutopdata[3]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                let map504 = JSON.stringify(osutopdata[3]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                let map1004 = JSON.stringify(osutopdata[3]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                let map3004 = JSON.stringify(osutopdata[3]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                let maprank4 = JSON.stringify(osutopdata[3], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                let mapscore4 = JSON.stringify(osutopdata[3], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
                let mapmods4 = JSON.stringify(osutopdata[3], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');

                let maptitle5 = JSON.stringify(osutopdata[4]['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                let mapdiff5 = JSON.stringify(osutopdata[4]['beatmap'], ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('version', '');
                let mapurl5 = JSON.stringify(osutopdata[4]['beatmap'], ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('id', '');
                let maptimeset5 = JSON.stringify(osutopdata[4], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('created_at', '').slice(0, 10);
                let mapacc5 = JSON.stringify(osutopdata[4], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                let mappp5 = JSON.stringify(osutopdata[4]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                let mapmiss5 = JSON.stringify(osutopdata[4]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                let map505 = JSON.stringify(osutopdata[4]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                let map1005 = JSON.stringify(osutopdata[4]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                let map3005 = JSON.stringify(osutopdata[4]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                let maprank5 = JSON.stringify(osutopdata[4], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                let mapscore5 = JSON.stringify(osutopdata[4], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
                let mapmods5 = JSON.stringify(osutopdata[4], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');

            let Embed = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("#1 play for " + topplayername)
            //.setImage(mapbg1)
            .setImage(topplayeravatar)
            .setDescription(`[${maptitle1} [${mapdiff1}]](https://osu.ppy.sh/b/${mapurl1}) + ${mapmods1} \nSCORE:${mapscore1} \nScore set on ${maptimeset1} \n${(Math.abs((mapacc1) * 100).toFixed(2))}% | ${map3001}/${map1001}/${map501}/${mapmiss1} | ${maprank1}\n${(Math.abs(mappp1).toFixed(2))}pp` + `\n\n[${maptitle2} [${mapdiff2}]](https://osu.ppy.sh/b/${mapurl2}) + ${mapmods2} \nSCORE:${mapscore2} \nScore set on ${maptimeset2} \n${(Math.abs((mapacc2) * 100).toFixed(2))}% | ${map3002}/${map1002}/${map502}/${mapmiss2} | ${maprank2}\n${(Math.abs(mappp2).toFixed(2))}pp` + `\n\n[${maptitle3} [${mapdiff3}]](https://osu.ppy.sh/b/${mapurl3}) + ${mapmods3} \nSCORE:${mapscore3} \nScore set on ${maptimeset3} \n${(Math.abs((mapacc3) * 100).toFixed(2))}% | ${map3003}/${map1003}/${map503}/${mapmiss3} | ${maprank3}\n${(Math.abs(mappp3).toFixed(2))}pp` + `\n\n[${maptitle4} [${mapdiff4}]](https://osu.ppy.sh/b/${mapurl4}) + ${mapmods4} \nSCORE:${mapscore4} \nScore set on ${maptimeset4} \n${(Math.abs((mapacc4) * 100).toFixed(2))}% | ${map3004}/${map1004}/${map504}/${mapmiss4} | ${maprank4}\n${(Math.abs(mappp4).toFixed(2))}pp` + `\n\n[${maptitle5} [${mapdiff5}]](https://osu.ppy.sh/b/${mapurl5}) + ${mapmods5} \nSCORE:${mapscore5} \nScore set on ${maptimeset5} \n${(Math.abs((mapacc5) * 100).toFixed(2))}% | ${map3005}/${map1005}/${map505}/${mapmiss5} | ${maprank5}\n${Math.abs(mappp5).toFixed(2)}pp`);
            //https://osu.ppy.sh/b/
            message.reply({ embeds: [Embed]})
            //message.reply(mapbg1)
        });
        } catch(err){
            console.log(err)
        }


        /*if (isNaN(pickeduserX)) return message.reply("Error: You must use the user id"); 
//        `https://osutrack-api.ameo.dev/hiscores?user=${pickeduserX}&mode=0`
        let updateurl = `https://osutrack-api.ameo.dev/update?user=${pickeduserX}&mode=0`;
        fetch(updateurl, {
            method: 'POST',
            body: JSON.stringify(updateurl),
    headers: { 'Content-Type': 'application/json' }
        })
        let url = `https://osutrack-api.ameo.dev/hiscores?user=${pickeduserX}&mode=0`;*/
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
   /* try {fetch(url)
    .then(res => res.json())
    .then(out =>
{        out.sort((a, b) => b.pp - a.pp);
    const topHiscores = out.slice(0, 5);
        fs.writeFileSync("w.json", JSON.stringify(topHiscores, null, 2));
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
        let Embeda = new Discord.MessageEmbed()
            .setColor(0xFFC1EC)
            .setTitle("Top plays for https://osu.ppy.sh/u/" + pickeduserX)
            .setImage(`https://a.ppy.sh/${pickeduserX}`);
        let Embedscore1 = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("#1")
            .setDescription(`https://osu.ppy.sh/b/${bmid1}` + "\nScore set on " + sctime1 + "\n **SCORE**: " + sc1 + " | " + perform1 + "**PP**\n" + "+" + modify1 + " | " + grade1);
        let Embedscore2 = new Discord.MessageEmbed()
            .setColor(0x462B72)
            .setTitle("#2")
            .setDescription(`https://osu.ppy.sh/b/${bmid2}` + "\nScore set on " + sctime2 + "\n **SCORE**: " + sc2 + " | " + perform2 + "**PP**\n" + "+" + modify2 + " | " + grade2);
        let Embedscore3 = new Discord.MessageEmbed()
            .setColor(0x462B73)
            .setTitle("#3")
            .setDescription(`https://osu.ppy.sh/b/${bmid3}` + "\nScore set on " + sctime3 + "\n **SCORE**: " + sc3 + " | " + perform3 + "**PP**\n" + "+" + modify3 + " | " + grade3);
        let Embedscore4 = new Discord.MessageEmbed()
            .setColor(0x462B74)
            .setTitle("#4")
            .setDescription(`https://osu.ppy.sh/b/${bmid4}` + "\nScore set on " + sctime4 + "\n **SCORE**: " + sc4 + " | " + perform4 + "**PP**\n" + "+" + modify4 + " | " + grade4);
        let Embedscore5 = new Discord.MessageEmbed()
            .setColor(0x462B75)
            .setTitle("#5")
            .setDescription(`https://osu.ppy.sh/b/${bmid5}` + "\nScore set on " + sctime5 + "\n **SCORE**: " + sc5 + " | " + perform5 + "**PP**\n" + "+" + modify5 + " | " + grade5);
            message.reply({ embeds: [Embeda, Embedscore1, Embedscore2, Embedscore3, Embedscore4, Embedscore5] });
            message.channel.send("currently using https://github.com/Ameobea/osutrack-api instead of osu-api until i figure things out")
        //message.reply("```json\nTOP SCORES FOR " + pickeduserX + "\n" + JSON.stringify(topHiscores, null, 2).replaceAll('"', '').replaceAll('beatmap_id', 'beatmap id').replaceAll('[', '').replaceAll(']', '').replaceAll(',', '').replaceAll('}', '').replaceAll('{', '------------') + "```");
    }
    )} catch (error) {
        message.reply(error)
    }
    

        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osutop")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") */
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
 
*/