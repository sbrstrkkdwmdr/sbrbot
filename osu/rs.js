const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2 } = require('booba');
module.exports = {
    name: 'rs',
    description: '',
    async execute(userdatatags, interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        console.group('--- COMMAND EXECUTION ---')
        let pickeduserX = options.getString('user')
        if(!pickeduserX){
            findname = await userdatatags.findOne({ where: { name: interaction.member.user.id } });
            pickeduserX = findname.get('description')
        }
        let offsetflag = options.getNumber('offset')
        if(!offsetflag) {
            offsetflag = '0'
        }
        interaction.reply('getting data...')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - rs")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        if(!pickeduserX) return interaction.reply("user ID required");
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
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                if(!playerid) {
                    interaction.channel.send("Error osu04 - account not found")
                    console.log("error - account not found and/or json sent no data")
                    return;
                }

                const recentactiveurl = `https://osu.ppy.sh/api/v2/users/${playerid}/scores/recent?include_fails=1&mode=osu&offset=${offsetflag}&limit=25`;
                
                fetch(recentactiveurl, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }).then(res => res.json())
                .then(output2 => 
                    {try{const rsdata = output2;//.slice(0, 1);
                    fs.writeFileSync("debug/rs.json", JSON.stringify(rsdata, null, 2))
                    console.log("writing data to rs.json")
                    console.log("")
                try {
                let rsplayerid = JSON.stringify(rsdata[0], ['user_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user_id', '');
                let rsplayername = JSON.stringify(rsdata[0]['user'], ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('username', '');
                let rsmapname = JSON.stringify(rsdata[0]['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                let rsdiffname = JSON.stringify(rsdata[0]['beatmap'], ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('version', '');
                let rsmods = JSON.stringify(rsdata[0], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                let rsacc = JSON.stringify(rsdata[0], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
                let rs0s = JSON.stringify(rsdata[0]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_miss', '');
                let rs50s = JSON.stringify(rsdata[0]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_50', '');
                let rs100s = JSON.stringify(rsdata[0]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_100', '');
                let rs300s = JSON.stringify(rsdata[0]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_300', '');
                let rsgeki = JSON.stringify(rsdata[0]['statistics'], ['count_geki']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_geki', '');
                let rskatu = JSON.stringify(rsdata[0]['statistics'], ['count_katu']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_katu', '');
                
                let rsmapbg = JSON.stringify(rsdata[0]['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
                let rspp1 = JSON.stringify(rsdata[0], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '');
                let rspp = Math.abs(rspp1).toFixed(2);
                let rsmaptime = JSON.stringify(rsdata[0], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('created_at', '').slice(0, 10);
                let rsmapstar = JSON.stringify(rsdata[0]['beatmap'], ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
                let rsgrade = JSON.stringify(rsdata[0], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '');
                let rsmapid = JSON.stringify(rsdata[0]['beatmap'], ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                let rscombo = JSON.stringify(rsdata[0], ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
                let rstime = JSON.stringify(rsdata[0]['beatmap'], ['total_length']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total_length', '');
                
                let rslengthseconds = Math.abs(rstime) % 60;
                let rslengthminutes = Math.trunc(rstime / 60);

                let rspasstime = JSON.stringify(rsdata[0]['beatmap'], ['hit_length']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('hit_length', '');

                let rsfulltime = `${rslengthminutes}:${rslengthseconds}`;
                let rspasspercentage = Math.abs(rspasstime / rstime).toFixed(2);
                //console.log(`total ${rstime} hit ${rspasstime}`)

    
                let rsnochokeacc300 = Math.floor(300 * rs300s);
                let rsnochokeacc100 = Math.floor(100 * rs100s);
                let rsnochokeacc50 = Math.floor(50 * rs50s);
                let rsnochoke300num = parseInt(rs300s);
                let rsnochoke100num = parseInt(rs100s);
                let rsnochoke50num = parseInt(rs50s);
                //let rsnochoke0num = parseInt(rs0s);
                let rsnochokebottom1 = Math.floor(rsnochoke300num + rsnochoke100num + rsnochoke50num);
                let rsnochokebottom = Math.floor(rsnochokebottom1 * 300)
                let rsnochokeacctop = Math.floor(rsnochokeacc300 + rsnochokeacc100 + rsnochokeacc50)
                let rsnochokeacc1 = Math.abs(rsnochokeacctop / rsnochokebottom);
                let rsnochokeacc = Math.abs(rsnochokeacc1 * 100).toFixed(2);

            
                let fulltimeset1 = JSON.stringify(rsdata[0], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('created_at', '').slice(0, 18);
                let fulltimeset2 = JSON.stringify(rsdata[0], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('created_at', '').slice(0, 12);
                let fulltimeset3 = JSON.stringify(fulltimeset1).slice(12, 18)
                //console.log(fulltimeset3)
                let fulltimeset4 = fulltimeset3.replace(/(..?)/g, '$1:').slice(0,-1)
                let fulltimeset5 = fulltimeset4.slice(1, 10)
                let fulltimeset = fulltimeset2 + fulltimeset5 + "Z"

                let playerlasttoint = new Date(fulltimeset)

                let currenttime = new Date()

                let minsincelastvis = (playerlasttoint - currenttime) / (1000 * 60);
                let minlastvisreform = Math.abs(minsincelastvis).toFixed(0);
                //let ww = Math.abs()
                    
                    let lastvishours = (Math.trunc(minlastvisreform/60)) % 24;
                    let lastvisminutes = minlastvisreform % 60;
                    let minlastvisw = (lastvishours + "h " + lastvisminutes + "m");
                
                const fileName = 'debug/storedmap.json';
                const file = require('../debug/storedmap.json');  
                file.prevmap = rsmapid;
                fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                    if (err) return console.log(err);
                    console.log(JSON.stringify(file));
                    console.log('writing to ' + fileName);
                    console.log("");
                    console.groupEnd()
                });
                
                let rsmapidtonum = parseInt(rsmapid);

                var trycount = 0;
                for (var i = 0; i < rsdata.length; i++) {
                    if (rsdata[i].beatmap.id === rsmapidtonum) {
                        trycount++;
                    }
                    }
                var trycountstr = '\n'
                if(trycount > 1)
                    {
                        trycountstr = `\ntry #${trycount}`
                    }
                
                (async () => {
                    const score = {
                        beatmap_id: rsmapid,
                        score: '6795149',
                        maxcombo: '630',
                        count50: rs50s,
                        count100: rs100s,
                        count300: rs300s,
                        countmiss: '0',
                        countkatu: rskatu,
                        countgeki: rsgeki,
                        perfect: '0',
                        enabled_mods: '64',
                        user_id: rsplayerid,
                        date: '2022-02-08 05:24:54',
                        rank: 'S',
                        score_id: '4057765057'
                      }
                      const scorenofc = {
                        beatmap_id: rsmapid,
                        score: '6795149',
                        maxcombo: '630',
                        count50: rs50s,
                        count100: rs100s,
                        count300: rs300s,
                        countmiss: rs0s,
                        countkatu: rskatu,
                        countgeki: rsgeki,
                        perfect: '0',
                        enabled_mods: '64',
                        user_id: rsplayerid,
                        date: '2022-02-08 05:24:54',
                        rank: 'S',
                        score_id: '4057765057'
                      }
                      const scoretd = {
                        beatmap_id: rsmapid,
                        score: '6795149',
                        maxcombo: '630',
                        count50: rs50s,
                        count100: rs100s,
                        count300: rs300s,
                        countmiss: '0',
                        countkatu: rskatu,
                        countgeki: rsgeki,
                        perfect: '0',
                        enabled_mods: '64',
                        user_id: rsplayerid,
                        date: '2022-02-08 05:24:54',
                        rank: 'S',
                        score_id: '4057765057'
                      }
                      const scorefctd = {
                        beatmap_id: rsmapid,
                        score: '6795149',
                        maxcombo: '630',
                        count50: rs50s,
                        count100: rs100s,
                        count300: rs300s,
                        countmiss: rs0s,
                        countkatu: rskatu,
                        countgeki: rsgeki,
                        perfect: '0',
                        enabled_mods: '64',
                        user_id: rsplayerid,
                        date: '2022-02-08 05:24:54',
                        rank: 'S',
                        score_id: '4057765057'
                      }
                    let tdmods = JSON.stringify(rsmods).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rsmods', '').replaceAll('TD');
                    fs.writeFileSync("debug/rsppcalc.json", JSON.stringify(score, null, 2));
                    let ppfc = new std_ppv2().setPerformance(score);
                    let pp =  new std_ppv2().setPerformance(scorenofc);
                    if(rsmods){
                        pp =  new std_ppv2().setPerformance(scorenofc).setMods(`${rsmods}`)
                        ppfc = new std_ppv2().setPerformance(score).setMods(`${rsmods}`)
                        pptd = new std_ppv2().setPerformance(scoretd).setMods(`${tdmods}`)
                        ppfctd = new std_ppv2().setPerformance(scorefctd).setMods(`${tdmods}`)
                    }
                    if(!rsmods){
                        pp =  new std_ppv2().setPerformance(scorenofc).setMods('NM')
                        ppfc = new std_ppv2().setPerformance(score).setMods('NM')
                    }
                    ;

                if(!rsmods.includes('TD')){
                    ppw = await pp.compute();
                    ppiffc1 = await ppfc.compute(rsnochokeacc);
                    ppiffc2 = JSON.stringify(ppiffc1['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                    ppiffcw = Math.abs(ppiffc2).toFixed(2).toString();
                    ppiffcfull = Math.abs(ppiffc2).toString(); //fc pp without filters
                    ppwtostring = JSON.stringify(ppw['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                    ppwrawtotal = ppw['total'];
                    ppww = Math.abs(ppwrawtotal).toFixed(2);
                    ppwfull = Math.abs(ppwrawtotal).toString(); //the pp without filters

                    pprawaim = ppw['aim']
                    pprawspeed = ppw['speed']
                    pprawacc = ppw['acc']
                    pprawfl = ppw['fl']
                    ppcalcacc = ppw['computed_accuracy']
    
                    ppfcrawaim = ppiffc1['aim']
                    ppfcrawspeed = ppiffc1['speed']
                    ppfcrawacc = ppiffc1['acc']
                    ppfcrawfl = ppiffc1['fl']
                    ppfccalcacc = ppiffc1['computed_accuracy']
    
                    ppcalcaccround = Math.abs(ppcalcacc).toFixed(2)
                    ppfccalcaccround = Math.abs(ppfccalcacc).toFixed(2)
                    ppissue = ''
                    }
                    if(rsmods.includes('TD')){
                    ppw = await pptd.compute();
                    ppiffc1 = await ppfctd.compute(rsnochokeacc);
                    ppiffc2 = JSON.stringify(ppiffc1['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                    ppiffcw = Math.abs(ppiffc2).toFixed(2).toString();
                    ppiffcfull = Math.abs(ppiffc2).toString(); //fc pp without filters
                    ppwtostring = JSON.stringify(ppw['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                    ppwrawtotal = ppw['total'];
                    ppww = Math.abs(ppwrawtotal).toFixed(2);
                    ppwfull = Math.abs(ppwrawtotal).toString(); //the pp without filters   

                    pprawaim = ppw['aim']
                    pprawspeed = ppw['speed']
                    pprawacc = ppw['acc']
                    pprawfl = ppw['fl']
                    ppcalcacc = ppw['computed_accuracy']
    
                    ppfcrawaim = ppiffc1['aim']
                    ppfcrawspeed = ppiffc1['speed']
                    ppfcrawacc = ppiffc1['acc']
                    ppfcrawfl = ppiffc1['fl']
                    ppfccalcacc = ppiffc1['computed_accuracy']
    
                    ppcalcaccround = Math.abs(ppcalcacc).toFixed(2)
                    ppfccalcaccround = Math.abs(ppfccalcacc).toFixed(2)
                    ppissue = `\n(calculations **don't** include TD)`
                    }

                //console.log(`${pprawaim} | ${pprawspeed} | ${pprawacc} | ${pprawfl} | ${ppcalcacc}`)
                //console.log(`${ppfcrawaim} | ${ppfcrawspeed} | ${ppfcrawacc} | ${ppfcrawfl} | ${ppfccalcacc}`)

                if(rspp == 'null' || rspp == 'NaN'){
                      rspp = ppww
                  }
                  /* => {
                    aim: 108.36677305976224,
                    speed: 121.39049498160061,
                    fl: 514.2615576494688,
                    acc: 48.88425340242263,
                    total: 812.3689077733752
                  } */
                
               // if(rspp = "null"){
                //if(rsgrade != 'F'){

                if(rsgrade == 'xh' || rsgrade == 'XH'){
                    rsgrade = '<:rankingxh:927797179597357076>'
                }
                if(rsgrade == 'x' || rsgrade == 'X'){
                    rsgrade = '<:rankingX:927797179832229948>'
                }
                if(rsgrade == 'sh' || rsgrade == 'SH'){
                    rsgrade = '<:rankingSH:927797179710570568>'
                }
                if(rsgrade == 's' || rsgrade == 'S'){
                    rsgrade = '<:rankingS:927797179618295838>'
                }
                if(rsgrade == 'a' || rsgrade == 'A'){
                    rsgrade = '<:rankingA:927797179739930634>'
                }
                if(rsgrade == 'b' || rsgrade == 'B'){
                    rsgrade = '<:rankingB:927797179697991700>'
                }
                if(rsgrade == 'c' || rsgrade == 'C'){
                    rsgrade = '<:rankingC:927797179584757842>'
                }
                if(rsgrade == 'd' || rsgrade == 'D'){
                    rsgrade = '<:rankingD:927797179534438421>'
                }
                if(rsgrade == 'f' || rsgrade == 'F' ){
                    rsgrade = '🇫'
                }
                if(!rsmods){
                let Embed = new Discord.MessageEmbed()
                .setColor(0x9AAAC0)
                .setTitle("Most recent play for " + rsplayername)
                .setImage(rsmapbg)
                .setThumbnail(`https://a.ppy.sh/${rsplayerid}`)
                .addField('SCORE TIME', `**${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})**${trycountstr}`, true)
                .addField('MAP DETAILS', `**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** **${rsmapstar}**⭐`, false)
                .addField('SCORE DETAILS', `**${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** \n**300:** ${rs300s} \n**100:** ${rs100s} \n**⠀50:** ${rs50s} \n**⠀⠀X:** ${rs0s} \n**${rscombo}x**`, true)
                .addField('PP', `**${rspp}**pp | **${ppiffcw}**pp IF **${ppfccalcaccround}%** FC ${ppissue}`, true)
                //.setDescription(`Score set **${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})** \n**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**NM** **${rsmapstar}**⭐ \n ${(Math.abs((rsacc) * 100).toFixed(2))}% | **${rsgrade}** | \n**300:**${rs300s} **100:**${rs100s} **50:**${rs50s} **X:**${rs0s} \n${rspp}**pp** (${ppiffcw}**pp IF ${rsnochokeacc}% FC**) | **${rscombo}x**`);
                interaction.editReply({ content: '⠀', embeds: [Embed]})
                }
                if(rsmods){
                    let Embed = new Discord.MessageEmbed()
                .setColor(0x9AAAC0)
                .setTitle("Most recent play for " + rsplayername)
                .setImage(rsmapbg)
                .setThumbnail(`https://a.ppy.sh/${rsplayerid}`)
                .addField('SCORE TIME', `**${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})**${trycountstr}`, true)
                .addField('MAP DETAILS', `**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**${rsmods}** **${rsmapstar}**⭐`, false)
                .addField('SCORE DETAILS', `**${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** \n**300:** ${rs300s} \n**100:** ${rs100s} \n**⠀50:** ${rs50s} \n**⠀⠀X:** ${rs0s} \n**${rscombo}x**`, true)
                .addField('PP', `**${rspp}**pp | **${ppiffcw}**pp IF **${ppfccalcaccround}%** FC ${ppissue}`, true)
                //.setDescription(`Score set **${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})** \n**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**${rsmods}** **${rsmapstar}**⭐ \n **${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** | \n**300:**${rs300s} **100:**${rs100s} **50:**${rs50s} **X:**${rs0s} \n**${rspp}**pp | **${ppiffcw}**pp IF **${rsnochokeacc}%** FC | **${rscombo}x**`);
                interaction.editReply({ content: '⠀', embeds: [Embed]})
                }
            }
            )()
            } catch(error){
                if(error.toString().includes('replaceAll')){
                    interaction.editReply("Error osu03 - account not found (or some other error)")
                    console.log("error osu03 - account not found and/or json sent no data")}
                    else{interaction.channel.send('unknown error')}
                console.log(error)
                console.log("")
            }
            }catch(error){
                if(error.toString().includes('replaceAll')){
                    interaction.channel.send("Error osu03 - account not found (or some other error)")
                    console.log("error osu03 - account not found and/or json sent no data")}
                    else{interaction.channel.send('unknown error')}
                console.log(error)
                console.log("")
            }});
                } catch(error){
                    if(error.toString().includes('replaceAll')){
                        interaction.channel.send("Error osu04 - account not found")
                        console.log("error - account not found and/or json sent no data")}
                        else{interaction.channel.send('unknown error')}
                    console.log(error)
                    console.log("")
                }})
            } catch(err){
                console.log(err)
            }
            
    }
}

//client.commands.get('').execute(interaction, args)