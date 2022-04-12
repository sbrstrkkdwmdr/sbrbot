const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2 } = require('booba');
const { calculateStarRating } = require('osu-sr-calculator')
const { osulogdir } = require('../logconfig.json')

module.exports = {
    name: 'rs',
    description: '',
    async execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        let pickeduserX = args.splice(0,1000).join(" ");
        if(!pickeduserX || pickeduserX == '' || pickeduserX == []){
            try{
            findname = await userdatatags.findOne({ where: { name: message.author.id } });
            pickeduserX = findname.get('description')
            }
            catch (error) {
                fs.appendFileSync(osulogdir, "\n" + error)
            }
        }

        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - rs")
        let consoleloguserweeee = message.author
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "") 
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
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                if(!playerid) {
                    message.reply("Error osu04 - account not found")
                    fs.appendFileSync(osulogdir, "\n" + "error - account not found and/or json sent no data")
                    return;
                }

                const recentactiveurl = `https://osu.ppy.sh/api/v2/users/${playerid}/scores/recent?include_fails=1&mode=osu&offset=0&limit=100`;
                
                fetch(recentactiveurl, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }).then(res => res.json())
                .then(output2 => 
                    {try{const rsdata = output2;//.slice(0, 1);
                    fs.writeFileSync("debug/rs.json", JSON.stringify(rsdata, null, 2))
                    fs.appendFileSync(osulogdir, "\n" + "writing data to rs.json")
                    fs.appendFileSync(osulogdir, "\n" + "")
                try {
                let rsplayerid = JSON.stringify(rsdata[0], ['user_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user_id', '');
                let rsplayername = JSON.stringify(rsdata[0]['user'], ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('username', '');
                let rsmapnameunicode = JSON.stringify(rsdata[0]['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title_unicode', '');
                let rsmapnameenglish = JSON.stringify(rsdata[0]['beatmapset'], ['title']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('title', '');
                if(rsmapnameunicode != rsmapnameenglish){
                    rsmapname = `${rsmapnameunicode}\n${rsmapnameenglish}`
                }
                else{
                    rsmapname = rsmapnameenglish
                }
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
                let rsmaptime = JSON.stringify(rsdata[0], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replaceAll('created_at', '').slice(0, 19).replaceAll('T', ' ')
                let rsmapstar = JSON.stringify(rsdata[0]['beatmap'], ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
                let rsgrade = JSON.stringify(rsdata[0], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '');
                let rsmapid = JSON.stringify(rsdata[0]['beatmap'], ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                let rscombo = JSON.stringify(rsdata[0], ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
                let rstime = JSON.stringify(rsdata[0]['beatmap'], ['total_length']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total_length', '');
                let fc = JSON.stringify(rsdata[0], ['perfect']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('perfect', '');

                let rslengthseconds1 = Math.abs(rstime) % 60;
                let rslengthminutes = Math.trunc(rstime / 60);
                if(rslengthseconds1 < 10){
                    rslengthseconds = "0" + rslengthseconds1
                }
                else {
                    rslengthseconds = rslengthseconds1
                }
                let rspasstime = JSON.stringify(rsdata[0]['beatmap'], ['hit_length']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('hit_length', '');

                let rsfulltime = `${rslengthminutes}:${rslengthseconds}`;
                let rspasspercentage = Math.abs((rspasstime / rstime) * 100).toFixed(2) + '%';
                let rspassseconds1 = Math.abs(rspasstime) % 60
                let rspassminutes = Math.trunc(rspasstime / 60)
                if(rspassseconds1 < 10){
                    rspassseconds = "0" + rspassseconds1
                }
                else {
                    rspassseconds = rspassseconds1
                }
                let rspasstimeconverted = `${rspassminutes}:${rspassseconds}`
                //fs.appendFileSync(osulogdir, "\n" + rstime + ` | ${rspasstime}`)
                if(rsgrade == 'f' || rsgrade == 'F' ){
                    rspassinfo = `\n${rspasstimeconverted} / ${rsfulltime} (${rspasspercentage})`
                }
                else{
                    rspassinfo = ''
                }
                //fs.appendFileSync(osulogdir, "\n" + `total ${rstime} hit ${rspasstime}`)

    
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
                //fs.appendFileSync(osulogdir, "\n" + fulltimeset3)
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
                    if (err) return fs.appendFileSync(osulogdir, "\n" + err);
                    fs.appendFileSync(osulogdir, "\n" + JSON.stringify(file));
                    fs.appendFileSync(osulogdir, "\n" + 'writing to ' + fileName);
                    fs.appendFileSync(osulogdir, "\n" + "");
                    console.groupEnd()
                });
                
                let rsmapidtonum = parseInt(rsmapid);

                var trycount = 0;
                for (var i = 0; i < rsdata.length; i++) {
                    if (rsdata[i].beatmap.id === rsmapidtonum) {
                        trycount++;
                    }
                    }
                var trycountstr = ' '
                if(trycount > 1)
                    {
                        trycountstr = `\ntry #${trycount}`
                    }
                
                    modenum = 0
                    let cpolmods = rsmods.toLowerCase();
                    if(cpolmods.includes('nf') || cpolmods.includes('NF')){
                        modenum += 1
                    }
                    if(cpolmods.includes('ez') || cpolmods.includes('EZ') ){
                        modenum += 2
                    }
                    if(cpolmods.includes('td') || cpolmods.includes('TD')){
                        modenum += 4
                    }
                    if(cpolmods.includes('hd') || cpolmods.includes('HD')){
                        modenum += 8
                    }
                    if(cpolmods.includes('hr') || cpolmods.includes('HR')){
                        modenum += 16
                    }
                    if(cpolmods.includes('sd') || cpolmods.includes('SD')){
                        modenum += 32
                    }
                    if(cpolmods.includes('dt') || cpolmods.includes('DT')){
                        modenum += 64
                    }
                    if(cpolmods.includes('rx') || cpolmods.includes('rl') || cpolmods.includes('rlx') || cpolmods.includes('RX') || cpolmods.includes('RL') || cpolmods.includes('RLX')){
                        modenum += 128
                    }
                    if(cpolmods.includes('ht') || cpolmods.includes('HT')){
                        modenum += 256
                    }
                    if(cpolmods.includes('nc') || cpolmods.includes('NC')){
                        modenum += 64//512
                    }
                    if(cpolmods.includes('fl') || cpolmods.includes('FL')){
                        modenum += 1024
                    }
                    if(cpolmods.includes('at') || cpolmods.includes('AT')){
                        modenum += 2048
                    }
                    if(cpolmods.includes('so') || cpolmods.includes('SO')){
                        modenum += 4096
                    }
                    if(cpolmods.includes('ap') || cpolmods.includes('AP')){
                        modenum += 8192
                    }
                    if(cpolmods.includes('pf') || cpolmods.includes('PF')){
                        modenum += 16384
                    }
                    if(cpolmods.includes('1k') || cpolmods.includes('1K')){
                        modenum += 67108864
                    }
                    if(cpolmods.includes('2k') || cpolmods.includes('2K')){
                        modenum += 268435456
                    }
                    if(cpolmods.includes('3k') || cpolmods.includes('3K')){
                        modenum += 134217728
                    }
                    if(cpolmods.includes('4k') || cpolmods.includes('4K')){
                        modenum += 32768
                    }
                    if(cpolmods.includes('5k') || cpolmods.includes('5K')){
                        modenum += 65536
                    }
                    if(cpolmods.includes('6k') || cpolmods.includes('6K')){
                        modenum += 131072
                    }
                    if(cpolmods.includes('7k') || cpolmods.includes('7K')){
                        modenum += 262144
                    }
                    if(cpolmods.includes('8k') || cpolmods.includes('8K')){
                        modenum += 524288
                    }
                    if(cpolmods.includes('9k') || cpolmods.includes('9K')){
                        modenum += 16777216
                    }
                    if(cpolmods.includes('fi') || cpolmods.includes('FI')){
                        modenum += 1048576
                    }
                    if(cpolmods.includes('rdm') || cpolmods.includes('RDM')){
                        modenum += 2097152
                    }
                    if(cpolmods.includes('cn') || cpolmods.includes('CN')){
                        modenum += 4194304
                    }
                    if(cpolmods.includes('tp') || cpolmods.includes('TP')){
                        modenum += 8388608
                    }
                    if(cpolmods.includes('kc') || cpolmods.includes('KC')){
                        modenum += 33554432
                    }
                    if(cpolmods.includes('sv2') || cpolmods.includes('s2') || cpolmods.includes('SV2') || cpolmods.includes('S2')){
                        modenum += 536870912
                    }
                    if(cpolmods.includes('mr') || cpolmods.includes('MR')){
                        modenum += 1073741824
                    }
        
                    let cpolpp = `https://pp.osuck.net/pp?id=${rsmapid}&mods=${modenum}&miss=${rs0s}&acc=${(rsacc * 100).toFixed(2)}&300=${rs300s}&100=${rs100s}&50=${rs50s}&combo=${rscombo}`
        
                    fetch(cpolpp, {
                    }).then(res => res.json())
                    .then(output4 => {
                        fs.writeFileSync('debug/cpolppcalc.json', JSON.stringify(output4, null, 2))
                        rspp = JSON.stringify(output4['pp'], ['current']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('current', '');
                        ppiffcw = JSON.stringify(output4['pp'], ['fc']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('fc', '');
                        
                        SRclean = JSON.stringify(output4['stats']['star'], ['pure']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pure', '');

                    if(fc == 'false'){
                        fcflag = `| **${ppiffcw}**pp IF **${rsnochokeacc}%** FC`
                    }
                    if(fc == 'true'){
                        fcflag = '**FC**'
                    }

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
                    rsmodsembed = ''
                }
                if(rsmods){
                    rsmodsembed = '+**' + rsmods + '**'
                }
                    rscoverlist = JSON.stringify(rsdata[0]['beatmapset']['covers'], ['list']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('list', '').replace('https', 'https:');
                    let Embed = new Discord.MessageEmbed()
                        .setColor(0x9AAAC0)
                        .setTitle("Most recent play for " + rsplayername)
                        .setAuthor(`${minlastvisw} ago on ${rsmaptime}${trycountstr}`, `https://a.ppy.sh/${rsplayerid}`, `https://osu.ppy.sh/u/${rsplayerid}`)
                        //.setImage(rsmapbg)
                        .setThumbnail(rscoverlist)
                        //.setThumbnail(`https://a.ppy.sh/${rsplayerid}`)
                        //.addField('SCORE TIME', `**${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})**${trycountstr}`, true)
                        .addField('MAP DETAILS', `**[${rsmapname} \n[${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** \n${rsmodsembed} **${SRclean}**⭐`, false)
                        .addField('SCORE DETAILS', `**${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** ${rspassinfo}\n**300:** ${rs300s} \n**100:** ${rs100s} \n**⠀50:** ${rs50s} \n**⠀⠀X:** ${rs0s} \n**${rscombo}x**`, true)
                        .addField('PP', `**${rspp}**pp ${fcflag}`, true)
                        //.setDescription(`Score set **${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})** \n**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**${rsmods}** **${rsmapstar}**⭐ \n **${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** | \n**300:**${rs300s} **100:**${rs100s} **50:**${rs50s} **X:**${rs0s} \n**${rspp}**pp | **${ppiffcw}**pp IF **${rsnochokeacc}%** FC | **${rscombo}x**`);
                        message.reply({embeds: [Embed]})
                
                //}
                /*if(rsgrade = 'F'){
                if(!rsmods){
                    let Embed = new Discord.MessageEmbed()
                    .setColor(0x462B71)
                    .setTitle("Most recent play for " + rsplayername)
                    .setImage(rsmapbg)
                    .setThumbnail(`https://a.ppy.sh/${rsplayerid}`)
                    .setDescription(`Score set **${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})** \n**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**NM** **${rsmapstar}**⭐ \n ${(Math.abs((rsacc) * 100).toFixed(2))}% | **${rsgrade}** | **${rspasspercentage}** \n**300:**${rs300s} **100:**${rs100s} **50:**${rs50s} **X:**${rs0s} \n${rspp}**pp** (${ppiffcw}**pp IF ${rsnochokeacc}% FC**) | **${rscombo}x**`);
                    message.reply({ embeds: [Embed]})}
                    if(rsmods){
                        let Embed = new Discord.MessageEmbed()
                    .setColor(0x462B71)
                    .setTitle("Most recent play for " + rsplayername)
                    .setImage(rsmapbg)
                    .setThumbnail(`https://a.ppy.sh/${rsplayerid}`)
                    .setDescription(`Score set **${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})** \n**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**${rsmods}** **${rsmapstar}**⭐ \n **${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** | **${rspasspercentage}** \n**300:**${rs300s} **100:**${rs100s} **50:**${rs50s} **X:**${rs0s} \n**${rspp}**pp | **${ppiffcw}**pp IF **${rsnochokeacc}%** FC | **${rscombo}x**`);
                    message.reply({ embeds: [Embed]})
                    }}*/
            }
            )
            } catch(error){
                if(error.toString().includes('replaceAll')){
                    message.reply("Error - play data not found and/or json sent no data")
                    fs.appendFileSync(osulogdir, "\n" + "Error - play data not found and/or json sent no data")}
                    else{message.reply('unknown error')}
                fs.appendFileSync(osulogdir, "\n" + error)
                fs.appendFileSync(osulogdir, "\n" + "")
            }
            }catch(error){
                if(error.toString().includes('replaceAll')){
                    message.reply("Error - play data not found and/or json sent no data")
                    fs.appendFileSync(osulogdir, "\n" + "Error - play data not found and/or json sent no data")}
                    else{message.reply('unknown error')}
                fs.appendFileSync(osulogdir, "\n" + error)
                fs.appendFileSync(osulogdir, "\n" + "")
            }});
                } catch(error){
                    if(error.toString().includes('replaceAll')){
                        message.reply("Error - account not found")
                        fs.appendFileSync(osulogdir, "\n" + "error - account not found and/or json sent no data")}
                        else{message.reply('unknown error')}
                    fs.appendFileSync(osulogdir, "\n" + error)
                    fs.appendFileSync(osulogdir, "\n" + "")
                }})
            } catch(err){
                fs.appendFileSync(osulogdir, "\n" + err)
            }
            
    }
}

//client.commands.get('').execute(message, args)