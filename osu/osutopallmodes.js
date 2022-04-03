//https://github.com/Ameobea/osutrack-api
const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const xhr = new XMLHttpRequest();
const GET = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { exec } = require("child_process");
const { osulogdir } = require('../logconfig.json')

module.exports = {
    name: 'osutop',
    description: '',
    async execute(userdatatags, interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        //const pickeduserX = args.splice(0,1000).join(" "); //if it was just args 0 it would only take the first argument, so spaced usernames like "my angel lumine" wouldn't work
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - osutop")
        fs.appendFileSync(osulogdir, "\n" + "category - osu")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "") 

        let pickeduserX = options.getString('user')
        if(!pickeduserX){
            try{
                findname = await userdatatags.findOne({ where: { name: interaction.member.user.id } });
                pickeduserX = findname.get('description')}
                catch (error) {
                }
                try{
                    findname = await userdatatags.findOne({ where: { name: interaction.member.user.id } });
                    pickedmode = findname.get('mode')}
                    catch (error) {
                    pickedmode = 'osu'
                    }
            }
            if(pickeduserX){
                try{
                    findname = await userdatatags.findOne({ where: { description: pickeduserX}})
                    pickedmode = findname.get('mode')
                } catch (error) {
                    fs.appendFileSync(osulogdir, "\n" + error)
                }
            }
            if(!pickedmode){
                pickedmodex = 'osu'
            }
            else if(pickedmode == 'osu' || pickedmode == 'o' || pickedmode == 'standard' || options.getString('mode') == 'std'){
                pickedmodex = 'osu'
            }
            else if(pickedmode == 'catch the beat' || pickedmode == 'ctb' || pickedmode == 'c' || pickedmode == 'catch') {
                pickedmodex = 'fruits'
            }
            else if(pickedmode == 'mania' || pickedmode == 'm') {
                pickedmodex = 'mania'
            }
            else if(pickedmode == 'taiko' || pickedmode == 't') {
                pickedmodex = 'taiko'
            }
            else{
                pickedmodex = 'osu'
            }
            let offsetflag = options.getNumber('offset')
        if(!offsetflag) {
            offsetflag = '0'
        }
        interaction.reply('getting data...')
        fs.appendFileSync(osulogdir, "\n" + pickedmodex + ' from ' + pickedmode)
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
                fs.appendFileSync(osulogdir, "\n" + "writing data to osuauth.json")
                fs.appendFileSync(osulogdir, "\n" + "")
                
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
                fs.appendFileSync(osulogdir, "\n" + "writing data to osuid.json")
                fs.appendFileSync(osulogdir, "\n" + "")
                
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                if(!playerid) {
                    interaction.channel.send("Error osu04 - account not found")
                    fs.appendFileSync(osulogdir, "\n" + "error - account not found and/or json sent no data")
                    return;
                }
                //interaction.reply(playerid)
                const osutopurl = `https://osu.ppy.sh/api/v2/users/${playerid}/scores/best?mode=${pickedmodex}&limit=100&offset=${offsetflag * 5}`;

                fetch(osutopurl, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }).then(res => res.json())
                .then(output2 => 
                    {
                    let sort = options.getString('sort')//.toLowerCase();
                    if(sort){
                        sort = sort.toLowerCase();
                    }
                    if(sort == 'acc' || sort == 'accuracy'){
                        osutopdata = output2.sort((a, b) => b.accuracy - a.accuracy);
                        sortedby = 'Sorted by: Accuracy'
                    }
                    else if(sort == 'time' || sort == 'date' || sort == 'recent' || sort == 'r'){
                        //osutopdata = output2.sort((a, b) => b.created_at.toLowerCase().slice(0, 10).replaceAll('-', '') - a.created_at.toLowerCase().slice(0, 10).replaceAll('-', ''));
                        osutopdata = output2.sort((a, b) => Math.abs(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - Math.abs(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')));
                        //fs.appendFileSync(osulogdir, "\n" + osutopdata[0]['created_at'].slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', ''))
                        
                        sortedby = 'Sorted by: Most Recent'
                    }
                    else if(sort == 'score'){
                        osutopdata = output2.sort((a, b) => b.score - a.score);
                        sortedby = 'Sorted by: Score'
                    }
                    /*if(sort == 'score'){
                        osutopdata = output2.sort((a, b) => a.pp - b.pp);
                    }*/
                    else{
                        osutopdata = output2.sort((a, b) => b.pp - a.pp);
                        sortedby = '⠀'
                    }
                    //osutopdata = output2;

                    fs.writeFileSync("debug/osutop.json", JSON.stringify(osutopdata, null, 2));
                    fs.appendFileSync(osulogdir, "\n" + "writing data to osutop.json")
                    fs.appendFileSync(osulogdir, "\n" + "")
                    console.groupEnd()
                    try{
                        try{let topplayername = JSON.stringify(osutopdata[0]['user'], ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');
                    }
                    catch(error) {
                            interaction.channel.send("Error 03 - not enough plays")
                            fs.appendFileSync(osulogdir, "\n" + "error osu03 - not enough plays")
                            return;
                        }
                    let topplayername = JSON.stringify(osutopdata[0]['user'], ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');
                    //let mapbg1 = JSON.stringify(osutopdata[0]['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
                    let topplayeravatar = JSON.stringify(osutopdata[0]['user'], ['avatar_url']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('avatar_url', '').replace('https', 'https:');
                    
                    let maptitle1 = JSON.stringify(osutopdata[0]['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                    let mapdiff1 = JSON.stringify(osutopdata[0]['beatmap'], ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('version', '');
                    let mapurl1 = JSON.stringify(osutopdata[0]['beatmap'], ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('id', '');
                    let maptimeset1 = JSON.stringify(osutopdata[0], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replace('created_at', '').slice(0, 19).replaceAll('T', ' ');
                    let mapacc1 = JSON.stringify(osutopdata[0], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                    let weightedmappp1 = JSON.stringify(osutopdata[0]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    let weightedpppercent1 = JSON.stringify(osutopdata[0]['weight'], ['percentage']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('percentage', '');
                    let mappp1 = JSON.stringify(osutopdata[0], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    
                    let mapmiss1 = JSON.stringify(osutopdata[0]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                    let map501 = JSON.stringify(osutopdata[0]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                    let map1001 = JSON.stringify(osutopdata[0]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                    let map3001 = JSON.stringify(osutopdata[0]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                    let map2001 = JSON.stringify(osutopdata[0]['statistics'], ['count_katu']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_katu', '');
                    let map300max1 = JSON.stringify(osutopdata[0]['statistics'], ['count_geki']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_geki', '');
                    let maprank1 = JSON.stringify(osutopdata[0], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                    let mapscore11 = JSON.stringify(osutopdata[0], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
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
                    let maptimeset2 = JSON.stringify(osutopdata[1], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replace('created_at', '').slice(0, 19).replaceAll('T', ' ');
                    let mapacc2 = JSON.stringify(osutopdata[1], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                    let weightedmappp2 = JSON.stringify(osutopdata[1]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    let weightedpppercent2 = JSON.stringify(osutopdata[1]['weight'], ['percentage']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('percentage', '');
                    let mappp2 = JSON.stringify(osutopdata[1], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    let mapmiss2 = JSON.stringify(osutopdata[1]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                    let map502 = JSON.stringify(osutopdata[1]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                    let map1002 = JSON.stringify(osutopdata[1]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                    let map3002 = JSON.stringify(osutopdata[1]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                    let map2002 = JSON.stringify(osutopdata[1]['statistics'], ['count_katu']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_katu', '');
                    let map300max2 = JSON.stringify(osutopdata[1]['statistics'], ['count_geki']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_geki', '');

                    let maprank2 = JSON.stringify(osutopdata[1], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                    let mapscore21 = JSON.stringify(osutopdata[1], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
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
                    let maptimeset3 = JSON.stringify(osutopdata[2], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replace('created_at', '').slice(0, 19).replaceAll('T', ' ');
                    let mapacc3 = JSON.stringify(osutopdata[2], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                    let weightedmappp3 = JSON.stringify(osutopdata[2]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    let weightedpppercent3 = JSON.stringify(osutopdata[2]['weight'], ['percentage']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('percentage', '');
                    let mappp3 = JSON.stringify(osutopdata[2], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    let mapmiss3 = JSON.stringify(osutopdata[2]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                    let map503 = JSON.stringify(osutopdata[2]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                    let map1003 = JSON.stringify(osutopdata[2]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                    let map3003 = JSON.stringify(osutopdata[2]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                    let map2003 = JSON.stringify(osutopdata[2]['statistics'], ['count_katu']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_katu', '');
                    let map300max3 = JSON.stringify(osutopdata[2]['statistics'], ['count_geki']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_geki', '');

                    let maprank3 = JSON.stringify(osutopdata[2], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                    let mapscore31 = JSON.stringify(osutopdata[2], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
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
                    let maptimeset4 = JSON.stringify(osutopdata[3], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replace('created_at', '').slice(0, 19).replaceAll('T', ' ');
                    let mapacc4 = JSON.stringify(osutopdata[3], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                    let weightedmappp4 = JSON.stringify(osutopdata[3]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    let weightedpppercent4 = JSON.stringify(osutopdata[3]['weight'], ['percentage']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('percentage', '');
                    let mappp4 = JSON.stringify(osutopdata[3], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    let mapmiss4 = JSON.stringify(osutopdata[3]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                    let map504 = JSON.stringify(osutopdata[3]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                    let map1004 = JSON.stringify(osutopdata[3]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                    let map3004 = JSON.stringify(osutopdata[3]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                    let map2004 = JSON.stringify(osutopdata[3]['statistics'], ['count_katu']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_katu', '');
                    let map300max4 = JSON.stringify(osutopdata[3]['statistics'], ['count_geki']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_geki', '');
                    let maprank4 = JSON.stringify(osutopdata[3], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                    let mapscore41 = JSON.stringify(osutopdata[3], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
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
                    let maptimeset5 = JSON.stringify(osutopdata[4], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replace('created_at', '').slice(0, 19).replaceAll('T', ' ');
                    let mapacc5 = JSON.stringify(osutopdata[4], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '');
                    let weightedmappp5 = JSON.stringify(osutopdata[4]['weight'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    let weightedpppercent5 = JSON.stringify(osutopdata[4]['weight'], ['percentage']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('percentage', '');
                    let mappp5 = JSON.stringify(osutopdata[4], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('pp', '');
                    let mapmiss5 = JSON.stringify(osutopdata[4]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_miss', '');
                    let map505 = JSON.stringify(osutopdata[4]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_50', '');
                    let map1005 = JSON.stringify(osutopdata[4]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_100', '');
                    let map3005 = JSON.stringify(osutopdata[4]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_300', '');
                    let map2005 = JSON.stringify(osutopdata[4]['statistics'], ['count_katu']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_katu', '');
                    let map300max5 = JSON.stringify(osutopdata[4]['statistics'], ['count_geki']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('count_geki', '');
                    let maprank5 = JSON.stringify(osutopdata[4], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('rank', '');
                    let mapscore51 = JSON.stringify(osutopdata[4], ['score']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('score', '');
                    let mapmods50 = JSON.stringify(osutopdata[4], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                    
                    mapscore1 = mapscore11.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    mapscore2 = mapscore21.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    mapscore3 = mapscore31.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    mapscore4 = mapscore41.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    mapscore5 = mapscore51.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    if(mapmods50){
                        mapmods5 = '+' + mapmods50
                    }
                    else {
                        mapmods5 = ''
                    }
                    if(pickedmodex == 'osu'){
                        hitlist1 = `**300:** ${map3001} **100:** ${map1001} **50:** ${map501} **X:** ${mapmiss1}`
                        hitlist2 = `**300:** ${map3002} **100:** ${map1002} **50:** ${map502} **X:** ${mapmiss2}`
                        hitlist3 = `**300:** ${map3003} **100:** ${map1003} **50:** ${map503} **X:** ${mapmiss3}`
                        hitlist4 = `**300:** ${map3004} **100:** ${map1004} **50:** ${map504} **X:** ${mapmiss4}`
                        hitlist5 = `**300:** ${map3005} **100:** ${map1005} **50:** ${map505} **X:** ${mapmiss5}`
                    }
                    if(pickedmodex == 'taiko'){
                        hitlist1 = `**300(GREAT):** ${map3001} **100(GOOD):** ${map1001} **X:** ${mapmiss1}`
                        hitlist2 = `**300(GREAT):** ${map3002} **100(GOOD):** ${map1002} **X:** ${mapmiss2}`
                        hitlist3 = `**300(GREAT):** ${map3003} **100(GOOD):** ${map1003} **X:** ${mapmiss3}`
                        hitlist4 = `**300(GREAT):** ${map3004} **100(GOOD):** ${map1004} **X:** ${mapmiss4}`
                        hitlist5 = `**300(GREAT):** ${map3005} **100(GOOD):** ${map1005} **X:** ${mapmiss5}`
                    }
                    if(pickedmodex == 'fruits'){
                        hitlist1 = `**300:** ${map3001} **100(Drops):** ${map1001} **50(Droplets):** ${map501} **X:** ${mapmiss1}`
                        hitlist2 = `**300:** ${map3002} **100(Drops):** ${map1002} **50(Droplets):** ${map502} **X:** ${mapmiss2}`
                        hitlist3 = `**300:** ${map3003} **100(Drops):** ${map1003} **50(Droplets):** ${map503} **X:** ${mapmiss3}`
                        hitlist4 = `**300:** ${map3004} **100(Drops):** ${map1004} **50(Droplets):** ${map504} **X:** ${mapmiss4}`
                        hitlist5 = `**300:** ${map3005} **100(Drops):** ${map1005} **50(Droplets):** ${map505} **X:** ${mapmiss5}`
                    }
                    if(pickedmodex == 'mania'){
                        hitlist1 = `**300+**: ${map300max1} **300:** ${map3001} **200:** ${map2001} **100:** ${map1001} **50:** ${map501} **X:** ${mapmiss1}`
                        hitlist2 = `**300+**: ${map300max2} **300:** ${map3002} **200:** ${map2002} **100:** ${map1002} **50:** ${map502} **X:** ${mapmiss2}`
                        hitlist3 = `**300+**: ${map300max3} **300:** ${map3003} **200:** ${map2003} **100:** ${map1003} **50:** ${map503} **X:** ${mapmiss3}`
                        hitlist4 = `**300+**: ${map300max4} **300:** ${map3004} **200:** ${map2004} **100:** ${map1004} **50:** ${map504} **X:** ${mapmiss4}`
                        hitlist5 = `**300+**: ${map300max5} **300:** ${map3005} **200:** ${map2005} **100:** ${map1005} **50:** ${map505} **X:** ${mapmiss5}`
                    }
                let Embed = new Discord.MessageEmbed()
                .setColor(0x462B71)
                .setTitle("Top plays for " + topplayername)
                .setURL(`https://osu.ppy.sh/u/${playerid}`)
                .setThumbnail(topplayeravatar)
                .setDescription(`${sortedby}`)
                .addField(`---`, `**[${maptitle1} [${mapdiff1}]](https://osu.ppy.sh/b/${mapurl1}) ${mapmods1}**\nSCORE: ${mapscore1} \nScore set on ${maptimeset1} \n${(Math.abs((mapacc1) * 100).toFixed(2))}% | ${maprank1}\n${hitlist1} \n**${(Math.abs(mappp1).toFixed(2))}**pp | **${(Math.abs(weightedmappp1).toFixed(2))}**pp weighted **${Math.abs(weightedpppercent1).toFixed(2)}**%`, false)
                .addField(`---`, `**[${maptitle2} [${mapdiff2}]](https://osu.ppy.sh/b/${mapurl2}) ${mapmods2}**\nSCORE: ${mapscore2} \nScore set on ${maptimeset2} \n${(Math.abs((mapacc2) * 100).toFixed(2))}% | ${maprank2}\n${hitlist2} \n**${(Math.abs(mappp2).toFixed(2))}**pp | **${(Math.abs(weightedmappp2).toFixed(2))}**pp weighted **${Math.abs(weightedpppercent2).toFixed(2)}**%`, false)
                .addField(`---`, `**[${maptitle3} [${mapdiff3}]](https://osu.ppy.sh/b/${mapurl3}) ${mapmods3}**\nSCORE: ${mapscore3} \nScore set on ${maptimeset3} \n${(Math.abs((mapacc3) * 100).toFixed(2))}% | ${maprank3}\n${hitlist3} \n**${(Math.abs(mappp3).toFixed(2))}**pp | **${(Math.abs(weightedmappp3).toFixed(2))}**pp weighted **${Math.abs(weightedpppercent3).toFixed(2)}**%`, false)
                .addField(`---`, `**[${maptitle4} [${mapdiff4}]](https://osu.ppy.sh/b/${mapurl4}) ${mapmods4}**\nSCORE: ${mapscore4} \nScore set on ${maptimeset4} \n${(Math.abs((mapacc4) * 100).toFixed(2))}% | ${maprank4}\n${hitlist4} \n**${(Math.abs(mappp4).toFixed(2))}**pp | **${(Math.abs(weightedmappp4).toFixed(2))}**pp weighted **${Math.abs(weightedpppercent4).toFixed(2)}**%`, false)
                .addField(`---`, `**[${maptitle5} [${mapdiff5}]](https://osu.ppy.sh/b/${mapurl5}) ${mapmods5}**\nSCORE: ${mapscore5} \nScore set on ${maptimeset5} \n${(Math.abs((mapacc5) * 100).toFixed(2))}% | ${maprank5}\n${hitlist5} \n**${(Math.abs(mappp5).toFixed(2))}**pp | **${(Math.abs(weightedmappp5).toFixed(2))}**pp weighted **${Math.abs(weightedpppercent5).toFixed(2)}**%`, false)                
                interaction.editReply({ content: '⠀', embeds: [Embed]})
                fs.appendFileSync(osulogdir, "\n" + "sent")
            } catch(error){
                if(error.toString().includes('replaceAll')){
                    interaction.channel.send("Error - account not found (or some other error)")
                    fs.appendFileSync(osulogdir, "\n" + "error - account not found and/or json sent no data")}
                    else{interaction.channel.send('unknown error')}
                    fs.appendFileSync(osulogdir, "\n" + error)
                    fs.appendFileSync(osulogdir, "\n" + "")
                    console.groupEnd()
            }
            } ) 
        } catch(error){
                interaction.channel.send("Error - account not found")
                fs.appendFileSync(osulogdir, "\n" + "Error account not found")
                fs.appendFileSync(osulogdir, "\n" + error)
                fs.appendFileSync(osulogdir, "\n" + "")
                console.groupEnd()
            }})
            } catch(err){
                fs.appendFileSync(osulogdir, "\n" + err)
                fs.appendFileSync(osulogdir, "\n" + "")
                console.groupEnd()
            } 
            
    }
}
