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
 
        const pickeduserX = args.splice(0,1000).join(" "); //if it was just args 0 it would only take the first argument, so spaced usernames like "my angel lumine" wouldn't work
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osutop")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        if(!pickeduserX) return message.reply("Error - no user");
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
                const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
            
            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output1 => 
                {
                try{const osudata = output1;
                fs.writeFileSync("osuid.json", JSON.stringify(osudata, null, 2));
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                //message.reply(playerid)
                const osutopurl = `https://osu.ppy.sh/api/v2/users/${playerid}/scores/best?mode=osu&limit=58&offset=0`;

                fetch(osutopurl, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }).then(res => res.json())
                .then(output2 => 
                    {const osutopdata = output2;
                    fs.writeFileSync("osutop.json", JSON.stringify(osutopdata, null, 2));
                    try{
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
                .setTitle("Top plays for " + topplayername)
                //.setImage(mapbg1)
                .setThumbnail(topplayeravatar)
                .setDescription(`[${maptitle1} [${mapdiff1}]](https://osu.ppy.sh/b/${mapurl1}) +${mapmods1} \nSCORE:${mapscore1} \nScore set on ${maptimeset1} \n${(Math.abs((mapacc1) * 100).toFixed(2))}% | ${map3001}/${map1001}/${map501}/${mapmiss1} | ${maprank1}\n${(Math.abs(mappp1).toFixed(2))}pp` + `\n\n[${maptitle2} [${mapdiff2}]](https://osu.ppy.sh/b/${mapurl2}) +${mapmods2} \nSCORE:${mapscore2} \nScore set on ${maptimeset2} \n${(Math.abs((mapacc2) * 100).toFixed(2))}% | ${map3002}/${map1002}/${map502}/${mapmiss2} | ${maprank2}\n${(Math.abs(mappp2).toFixed(2))}pp` + `\n\n[${maptitle3} [${mapdiff3}]](https://osu.ppy.sh/b/${mapurl3}) +${mapmods3} \nSCORE:${mapscore3} \nScore set on ${maptimeset3} \n${(Math.abs((mapacc3) * 100).toFixed(2))}% | ${map3003}/${map1003}/${map503}/${mapmiss3} | ${maprank3}\n${(Math.abs(mappp3).toFixed(2))}pp` + `\n\n[${maptitle4} [${mapdiff4}]](https://osu.ppy.sh/b/${mapurl4}) +${mapmods4} \nSCORE:${mapscore4} \nScore set on ${maptimeset4} \n${(Math.abs((mapacc4) * 100).toFixed(2))}% | ${map3004}/${map1004}/${map504}/${mapmiss4} | ${maprank4}\n${(Math.abs(mappp4).toFixed(2))}pp` + `\n\n[${maptitle5} [${mapdiff5}]](https://osu.ppy.sh/b/${mapurl5}) +${mapmods5} \nSCORE:${mapscore5} \nScore set on ${maptimeset5} \n${(Math.abs((mapacc5) * 100).toFixed(2))}% | ${map3005}/${map1005}/${map505}/${mapmiss5} | ${maprank5}\n${Math.abs(mappp5).toFixed(2)}pp`);
                //https://osu.ppy.sh/b/
                message.reply({ embeds: [Embed]})
                //message.reply(mapbg1)
            } catch(error){
                message.reply("Error - no data")
                console.log("Error")
                console.log(error)
                console.log("")
            }
            } ) 
        } catch(error){
                message.reply("Error - account not found")
                console.log("Error account not found")
                console.log(error)
                console.log("")
            }})
            } catch(err){
                console.log(err)
            } 
    }
}