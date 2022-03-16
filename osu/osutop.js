//https://github.com/Ameobea/osutrack-api
const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const xhr = new XMLHttpRequest();
const GET = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { exec } = require("child_process");
module.exports = {
    name: 'osutop',
    description: '',
    async execute(userdatatags, interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        console.group('--- COMMAND EXECUTION ---')
        //const pickeduserX = args.splice(0,1000).join(" "); //if it was just args 0 it would only take the first argument, so spaced usernames like "my angel lumine" wouldn't work
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osutop")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 

        let pickeduserX = options.getString('user')
        if(!pickeduserX){
            try{
                findname = await userdatatags.findOne({ where: { name: interaction.member.user.id } });
                pickeduserX = findname.get('description')}
                catch (error) {
                }
        }
        let offsetflag = options.getNumber('offset')
        if(!offsetflag) {
            offsetflag = '0'
        }
        interaction.reply('getting data...')
        if(!pickeduserX) return interaction.channel.send("Error - no user");
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
                .then(output => fs.writeFileSync("debug/osuauth.json", JSON.stringify(output, null, 2)))
                ;
                console.log("writing data to osuauth.json")
                console.log("")
                
                const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
                const { access_token } = require('../debug/osuauth.json');
            
            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output1 => 
                {
                try{const osudata = output1;
                fs.writeFileSync("debug/osuid.json", JSON.stringify(osudata, null, 2));
                console.log("writing data to osuid.json")
                console.log("")
                
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                if(!playerid) {
                    interaction.reply("Error osu04 - account not found")
                    console.log("error - account not found and/or json sent no data")
                    return;
                }
                //interaction.reply(playerid)
                const osutopurl = `https://osu.ppy.sh/api/v2/users/${playerid}/scores/best?mode=osu&limit=58&offset=${offsetflag * 5}`;

                fetch(osutopurl, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }).then(res => res.json())
                .then(output2 => 
                    {const osutopdata = output2;
                    fs.writeFileSync("debug/osutop.json", JSON.stringify(osutopdata, null, 2));
                    console.log("writing data to osutop.json")
                    console.log("")
                    console.groupEnd()
                    try{
                        try{let topplayername = JSON.stringify(osutopdata[0]['user'], ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');
                    }
                    catch(error) {
                            interaction.reply("Error 03 - not enough plays")
                            console.log("error osu03 - not enough plays")
                            return;
                        }
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
                    let mapmods10 = JSON.stringify(osutopdata[0], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                    if(mapmods10){
                        mapmods1 = '+' + mapmods10
                    }
                    else {
                        mapmods1 = ''
                    }

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
                    let mapmods20 = JSON.stringify(osutopdata[1], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                    if(mapmods20){
                        mapmods2 = '+' + mapmods20
                    }
                    else {
                        mapmods2 = ''
                    }

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
                    let mapmods30 = JSON.stringify(osutopdata[2], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                    if(mapmods30){
                        mapmods3 = '+' + mapmods30
                    }
                    else {
                        mapmods3 = ''
                    }
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
                    let mapmods40 = JSON.stringify(osutopdata[3], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                    if(mapmods40){
                        mapmods4 = '+' + mapmods40
                    }    
                    else {
                        mapmods4 = ''
                    }
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
                    let mapmods50 = JSON.stringify(osutopdata[4], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                    if(mapmods50){
                        mapmods5 = '+' + mapmods50
                    }
                    else {
                        mapmods5 = ''
                    }

                let Embed = new Discord.MessageEmbed()
                .setColor(0x462B71)
                .setTitle("Top plays for " + topplayername)
                .setURL(`https://osu.ppy.sh/u/${playerid}`)
                .setThumbnail(topplayeravatar)
                .setDescription(`**[${maptitle1} [${mapdiff1}]](https://osu.ppy.sh/b/${mapurl1}) ${mapmods1}** \nSCORE:${mapscore1} \nScore set on ${maptimeset1} \n${(Math.abs((mapacc1) * 100).toFixed(2))}% | ${map3001}/${map1001}/${map501}/${mapmiss1} | ${maprank1}\n${(Math.abs(mappp1).toFixed(2))}pp` + `\n\n**[${maptitle2} [${mapdiff2}]](https://osu.ppy.sh/b/${mapurl2}) ${mapmods2}** \nSCORE:${mapscore2} \nScore set on ${maptimeset2} \n${(Math.abs((mapacc2) * 100).toFixed(2))}% | ${map3002}/${map1002}/${map502}/${mapmiss2} | ${maprank2}\n${(Math.abs(mappp2).toFixed(2))}pp` + `\n\n**[${maptitle3} [${mapdiff3}]](https://osu.ppy.sh/b/${mapurl3}) ${mapmods3}** \nSCORE:${mapscore3} \nScore set on ${maptimeset3} \n${(Math.abs((mapacc3) * 100).toFixed(2))}% | ${map3003}/${map1003}/${map503}/${mapmiss3} | ${maprank3}\n${(Math.abs(mappp3).toFixed(2))}pp` + `\n\n**[${maptitle4} [${mapdiff4}]](https://osu.ppy.sh/b/${mapurl4}) ${mapmods4}** \nSCORE:${mapscore4} \nScore set on ${maptimeset4} \n${(Math.abs((mapacc4) * 100).toFixed(2))}% | ${map3004}/${map1004}/${map504}/${mapmiss4} | ${maprank4}\n${(Math.abs(mappp4).toFixed(2))}pp` + `\n\n**[${maptitle5} [${mapdiff5}]](https://osu.ppy.sh/b/${mapurl5}) ${mapmods5}** \nSCORE:${mapscore5} \nScore set on ${maptimeset5} \n${(Math.abs((mapacc5) * 100).toFixed(2))}% | ${map3005}/${map1005}/${map505}/${mapmiss5} | ${maprank5}\n${Math.abs(mappp5).toFixed(2)}pp`);
                /*.addField(`[${maptitle1} [${mapdiff1}]](https://osu.ppy.sh/b/${mapurl1}) +${mapmods1}`, `SCORE:${mapscore1} \nScore set on ${maptimeset1} \n${(Math.abs((mapacc1) * 100).toFixed(2))}% | ${map3001}/${map1001}/${map501}/${mapmiss1} | ${maprank1}\n${(Math.abs(mappp1).toFixed(2))}pp`, false)
                .addField(`[${maptitle2} [${mapdiff2}]](https://osu.ppy.sh/b/${mapurl2}) +${mapmods2}`, `SCORE:${mapscore2} \nScore set on ${maptimeset2} \n${(Math.abs((mapacc2) * 100).toFixed(2))}% | ${map3002}/${map1002}/${map502}/${mapmiss2} | ${maprank2}\n${(Math.abs(mappp2).toFixed(2))}pp`, false)
                .addField(`[${maptitle3} [${mapdiff3}]](https://osu.ppy.sh/b/${mapurl3}) +${mapmods3}`, `SCORE:${mapscore3} \nScore set on ${maptimeset3} \n${(Math.abs((mapacc3) * 100).toFixed(2))}% | ${map3003}/${map1003}/${map503}/${mapmiss3} | ${maprank3}\n${(Math.abs(mappp3).toFixed(2))}pp`, false)
                .addField(`[${maptitle4} [${mapdiff4}]](https://osu.ppy.sh/b/${mapurl4}) +${mapmods4}`, `SCORE:${mapscore4} \nScore set on ${maptimeset4} \n${(Math.abs((mapacc4) * 100).toFixed(2))}% | ${map3004}/${map1004}/${map504}/${mapmiss4} | ${maprank4}\n${(Math.abs(mappp4).toFixed(2))}pp`, false)
                .addField(`[${maptitle5} [${mapdiff5}]](https://osu.ppy.sh/b/${mapurl5}) +${mapmods5}`, `SCORE:${mapscore5} \nScore set on ${maptimeset5} \n${(Math.abs((mapacc5) * 100).toFixed(2))}% | ${map3005}/${map1005}/${map505}/${mapmiss5} | ${maprank5}\n${Math.abs(mappp5).toFixed(2)}pp`, false)*/
                //https://osu.ppy.sh/b/
                interaction.editReply({ content: '⠀', embeds: [Embed]})
                //interaction.reply(mapbg1)
            } catch(error){
                if(error.toString().includes('replaceAll')){
                    interaction.channel.send("Error - account not found (or some other error)")
                    console.log("error - account not found and/or json sent no data")}
                    else{interaction.channel.send('unknown error')}
                    console.log(error)
                    console.log("")
                    console.groupEnd()
            }
            } ) 
        } catch(error){
                interaction.channel.send("Error - account not found")
                console.log("Error account not found")
                console.log(error)
                console.log("")
                console.groupEnd()
            }})
            } catch(err){
                console.log(err)
                console.log("")
                console.groupEnd()
            } 
            
    }
}
