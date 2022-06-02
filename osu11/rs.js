const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { calculateStarRating } = require('osu-sr-calculator')
const { osulogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')


module.exports = {
    name: 'rs',
    description: '',
    async execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        let pickeduserX = args.splice(0, 1000).join(" ");
        if (!pickeduserX || pickeduserX == '' || pickeduserX == []) {
            try {
                findname = await userdatatags.findOne({ where: { name: message.author.id } });
                pickeduserX = findname.get('description')
            }
            catch (error) {
                fs.appendFileSync(osulogdir, "\n" + error)
                fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                pickedmodex = ''
            }
        }
        try {
        findname = await userdatatags.findOne({ where: { description: pickeduserX } });
        pickedmodex = findname.get('mode')}
        catch(error) {
            fs.appendFileSync(osulogdir, "\n" + error)
            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
            pickedmodex = 'osu'
        }
        if (!pickedmodex || pickedmodex == null || pickedmodex == '') {
            pickedmodex = 'osu'
        }

        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - rs")
        let consoleloguserweeee = message.author
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "")

        const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
        const { access_token } = require('../debug/osuauth.json');

        fetch(userinfourl, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.json())
            .then(output1 => {
                try {
                    const osudata = output1;
                    fs.writeFileSync("debug/osuid.json", JSON.stringify(osudata, null, 2));
                    let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                    if (!playerid) {
                        message.reply("Error osu04 - account not found")
                        fs.appendFileSync(osulogdir, "\n" + "error - account not found and/or json sent no data")
                        return;
                    }

                    const recentactiveurl = `https://osu.ppy.sh/api/v2/users/${playerid}/scores/recent?include_fails=1&mode=${pickedmodex}&offset=0&limit=100`;

                    fetch(recentactiveurl, {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        }
                    }).then(res => res.json())
                        .then(output2 => {
                            try {
                                const rsdata = output2;//.slice(0, 1);
                                fs.writeFileSync("debug/rs.json", JSON.stringify(rsdata, null, 2))
                                fs.appendFileSync(osulogdir, "\n" + "writing data to rs.json")
                                fs.appendFileSync(osulogdir, "\n" + "")
                                try {
                                    let rsplayerid = rsdata[0].user_id
                                    let rsplayername = rsdata[0].user.username
                                    let rsmapnameunicode = rsdata[0].beatmapset.title_unicode
                                    let rsmapnameenglish = rsdata[0].beatmapset.title
                                    if (rsmapnameunicode != rsmapnameenglish) {
                                        rsmapname = `${rsmapnameunicode}\n${rsmapnameenglish}`
                                    }
                                    else {
                                        rsmapname = rsmapnameenglish
                                    }
                                    let rsdiffname = rsdata[0].beatmap.version
                                    let rsmods = rsdata[0].mods.toString().replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                            
                                    let rsacc = rsdata[0].accuracy
                                    let rs0s = rsdata[0].statistics.count_miss
                                    let rs50s = rsdata[0].statistics.count_50
                                    let rs100s = rsdata[0].statistics.count_100
                                    let rs300s = rsdata[0].statistics.count_300
                                    let rsgeki = rsdata[0].statistics.count_geki
                                    let rskatu = rsdata[0].statistics.count_katu

                                    let rsmapbg = rsdata[0].beatmapset.covers.cover
                                    let rspp1 = rsdata[0].pp
                                    let rspp = Math.abs(rspp1).toFixed(2);
                                    let rsmaptime = rsdata[0].created_at.toString().slice(0, 19).replace('T', ' ')
                                    let rsmapstar = rsdata[0].beatmap.difficulty_rating
                                    let rsgrade = rsdata[0].rank
                                    let rsmapid = rsdata[0].beatmap.id
                                    let rscombo = rsdata[0].max_combo
                                    let rstime = rsdata[0].beatmap.total_length
                                    let fc = rsdata[0].perfect

                                    let rslengthseconds1 = Math.abs(rstime) % 60;
                                    let rslengthminutes = Math.trunc(rstime / 60);
                                    if (rslengthseconds1 < 10) {
                                        rslengthseconds = "0" + rslengthseconds1
                                    }
                                    else {
                                        rslengthseconds = rslengthseconds1
                                    }
                                    let rspasstime = rsdata[0].beatmap.hit_length.toString().replaceAll('hit_length', '');

                                    let rsfulltime = `${rslengthminutes}:${rslengthseconds}`;
                                    let rspasspercentage = Math.abs((rspasstime / rstime) * 100).toFixed(2) + '%';
                                    let rspassseconds1 = Math.abs(rspasstime) % 60
                                    let rspassminutes = Math.trunc(rspasstime / 60)
                                    if (rspassseconds1 < 10) {
                                        rspassseconds = "0" + rspassseconds1
                                    }
                                    else {
                                        rspassseconds = rspassseconds1
                                    }
                                    let rspasstimeconverted = `${rspassminutes}:${rspassseconds}`
                                    //fs.appendFileSync(osulogdir, "\n" + rstime + ` | ${rspasstime}`)
                                    if (rsgrade == 'f' || rsgrade == 'F') {
                                        rspassinfo = `\n${rspasstimeconverted} / ${rsfulltime} (${rspasspercentage})`
                                    }
                                    else {
                                        rspassinfo = ''
                                    }
                                    //^percentage and time of map passed. doesn't work sometimes idk why
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
                                    //^accuracy without misses 

                                    let fulltimeset = (rsdata[0].created_at).toString().slice(0, -6) + "Z";

                                    let playerlasttoint = new Date(fulltimeset)

                                    let currenttime = new Date()

                                    let minsincelastvis = (playerlasttoint - currenttime) / (1000 * 60);
                                    let minlastvisreform = Math.abs(minsincelastvis).toFixed(0);
                                    //let ww = Math.abs()

                                    let lastvishours = (Math.trunc(minlastvisreform / 60)) % 24;
                                    let lastvisminutes = minlastvisreform % 60;
                                    let minlastvisw = (lastvishours + "h " + lastvisminutes + "m");
                                    //^how many mins ago play was set
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
                                    if (trycount > 1) {
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
                                        //^score info for pp calculations.
                                        let tdmods = JSON.stringify(rsmods).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rsmods', '').replaceAll('TD');
                                        fs.writeFileSync("debug/rsppcalc.json", JSON.stringify(score, null, 2));
                                        let ppfc = new std_ppv2().setPerformance(score);
                                        let pp = new std_ppv2().setPerformance(scorenofc);
                                        if (pickedmodex == 'osu') {
                                            if (rsmods) {
                                                pp = new std_ppv2().setPerformance(scorenofc).setMods(`${tdmods}`)
                                                ppfc = new std_ppv2().setPerformance(score).setMods(`${tdmods}`)
                                            }
                                            if (!rsmods) {
                                                pp = new std_ppv2().setPerformance(scorenofc).setMods('NM')
                                                ppfc = new std_ppv2().setPerformance(score).setMods('NM')
                                            }
                                        }
                                        if (pickedmodex == 'taiko') {
                                            if (rsmods) {
                                                pp = new taiko_ppv2().setPerformance(scorenofc).setMods(`${tdmods}`)
                                                ppfc = new taiko_ppv2().setPerformance(score).setMods(`${tdmods}`)
                                            }
                                            if (!rsmods) {
                                                pp = new taiko_ppv2().setPerformance(scorenofc).setMods('NM')
                                                ppfc = new taiko_ppv2().setPerformance(score).setMods('NM')
                                            }
                                        }
                                        if (pickedmodex == 'fruits') {
                                            if (rsmods) {
                                                pp = new catch_ppv2().setPerformance(scorenofc).setMods(`${tdmods}`)
                                                ppfc = new catch_ppv2().setPerformance(score).setMods(`${tdmods}`)
                                            }
                                            if (!rsmods) {
                                                pp = new catch_ppv2().setPerformance(scorenofc).setMods('NM')
                                                ppfc = new catch_ppv2().setPerformance(score).setMods('NM')
                                            }
                                        }
                                        if (pickedmodex == 'mania') {
                                            if (rsmods) {
                                                pp = new mania_ppv2().setPerformance(scorenofc).setMods(`${tdmods}`)
                                                ppfc = new mania_ppv2().setPerformance(score).setMods(`${tdmods}`)
                                            }
                                            if (!rsmods) {
                                                pp = new mania_ppv2().setPerformance(scorenofc).setMods('NM')
                                                ppfc = new mania_ppv2().setPerformance(score).setMods('NM')
                                            }
                                        }
                                        ;
                                        ppw = await pp.compute();
                                        ppiffc1 = await ppfc.compute(rsnochokeacc);
                                        ppiffc2 = ppiffc1.total
                                        ppiffcw = Math.abs(ppiffc2).toFixed(2).toString();
                                        ppiffcfull = Math.abs(ppiffc2).toString(); //fc pp without filters
                                        ppwtostring = JSON.stringify(ppw.total).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                                        ppwrawtotal = ppw.total;
                                        ppww = Math.abs(ppwrawtotal).toFixed(2);
                                        ppwfull = Math.abs(ppwrawtotal).toString(); //the pp without filters

                                        fs.writeFileSync("debug/rsppcalcpp.json", JSON.stringify(ppw, null, 2))

                                        pprawaim = ppw.aim
                                        pprawspeed = ppw.speed
                                        pprawacc = ppw.acc
                                        pprawfl = ppw.fl
                                        ppcalcacc = ppw.computed_accuracy

                                        ppfcrawaim = ppiffc1.aim
                                        ppfcrawspeed = ppiffc1.speed
                                        ppfcrawacc = ppiffc1.acc
                                        ppfcrawfl = ppiffc1.fl
                                        ppfccalcacc = ppiffc1.computed_accuracy

                                        ppcalcaccround = Math.abs(ppcalcacc).toFixed(2)
                                        ppfccalcaccround = Math.abs(ppfccalcacc).toFixed(2)
                                        ppissue = ''
                                        if (pickedmodex == 'mania') {
                                            ppww = Math.abs(ppww / 1000).toFixed(2)
                                            ppiffcw = Math.abs(ppiffcw / 1000).toFixed(2)
                                        }


                                        if (rspp == null || rspp == NaN  || rspp == 0) {
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
                                        if (fc == false) {
                                            fcflag = `| **${ppiffcw}**pp IF **${rsnochokeacc}%** FC ${ppissue}`
                                        }
                                        if (fc == true) {
                                            fcflag = '**FC**'
                                        }

                                        if (rsgrade == 'xh' || rsgrade == 'XH') {
                                            rsgrade = '<:rankingxh:927797179597357076>'
                                        }
                                        if (rsgrade == 'x' || rsgrade == 'X') {
                                            rsgrade = '<:rankingX:927797179832229948>'
                                        }
                                        if (rsgrade == 'sh' || rsgrade == 'SH') {
                                            rsgrade = '<:rankingSH:927797179710570568>'
                                        }
                                        if (rsgrade == 's' || rsgrade == 'S') {
                                            rsgrade = '<:rankingS:927797179618295838>'
                                        }
                                        if (rsgrade == 'a' || rsgrade == 'A') {
                                            rsgrade = '<:rankingA:927797179739930634>'
                                        }
                                        if (rsgrade == 'b' || rsgrade == 'B') {
                                            rsgrade = '<:rankingB:927797179697991700>'
                                        }
                                        if (rsgrade == 'c' || rsgrade == 'C') {
                                            rsgrade = '<:rankingC:927797179584757842>'
                                        }
                                        if (rsgrade == 'd' || rsgrade == 'D') {
                                            rsgrade = '<:rankingD:927797179534438421>'
                                        }
                                        if (rsgrade == 'f' || rsgrade == 'F') {
                                            rsgrade = '🇫'
                                        }
                                        if (!rsmods) {
                                            rsmodsembed = ''
                                        }
                                        if (rsmods) {
                                            rsmodsembed = '+**' + rsmods + '**'
                                        }

                                        if (rsmods != null || rsmods != undefined || rsmods != 'TD') {
                                            calcmods = rsmods.replace('TD', '')
                                            modtoarray1 = calcmods.replace(/(.{2})/g, "$1 ");
                                            modtoarray2 = modtoarray1.slice(0, -1)
                                            modsforsr = modtoarray2.split(/ +/)
                                            starRating = await calculateStarRating(rsmapid, modsforsr);
                                            SR = JSON.stringify(starRating).replace('{', '').replace(':', '').replace('}', '').replace(calcmods, '').replace('nomod', '').replaceAll('"', '')
                                            SRclean = Math.abs(SR).toFixed(2)
                                        }
                                        else if (!rsmods || rsmods == 'TD' || rsmods == null) {
                                            SRclean = rsmapstar
                                        } else {
                                            SRclean = rsmapstar
                                        }
                                        rscoverlist = JSON.stringify(rsdata[0]['beatmapset']['covers'], ['list']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('list', '').replace('https', 'https:');
                                        let Embed = new Discord.MessageEmbed()
                                            .setColor(0x9AAAC0)
                                            .setTitle("Most recent play for " + rsplayername)
                                            .setAuthor({name: `${minlastvisw} ago on ${rsmaptime}${trycountstr}`, url:`https://osu.ppy.sh/u/${rsplayerid}`, iconURL: `https://a.ppy.sh/${rsplayerid}`})
                                            //.setImage(rsmapbg)
                                            .setThumbnail(rscoverlist)
                                            //.setThumbnail(`https://a.ppy.sh/${rsplayerid}`)
                                            //.addField('SCORE TIME', `**${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})**${trycountstr}`, true)
                                            .addField('MAP DETAILS', `**[${rsmapname} \n[${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** \n${rsmodsembed} **${SRclean}**⭐`, false)
                                            .addField('SCORE DETAILS', `**${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** ${rspassinfo}\n**300:** ${rs300s} \n**100:** ${rs100s} \n**⠀50:** ${rs50s} \n**⠀⠀X:** ${rs0s} \n**${rscombo}x**`, true)
                                            .addField('PP', `**${rspp}**pp ${fcflag}`, true)
                                        //.setDescription(`Score set **${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})** \n**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**${rsmods}** **${rsmapstar}**⭐ \n **${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** | \n**300:**${rs300s} **100:**${rs100s} **50:**${rs50s} **X:**${rs0s} \n**${rspp}**pp | **${ppiffcw}**pp IF **${rsnochokeacc}%** FC | **${rscombo}x**`);
                                        message.reply({ embeds: [Embed] })

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
                                    )()
                                } catch (error) {
                                    if (error.message.includes('user_id')) {
                                        message.reply("Error - play data not found and/or json sent no data")
                                        fs.appendFileSync(osulogdir, "\n" + "Error - play data not found and/or json sent no data")
                                    }
                                    else { 
                                    message.reply('unknown error') 
                                    console.log(error)
                                    fs.appendFileSync(osulogdir, "\n" + error)
                                    fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                                    fs.appendFileSync(osulogdir, "\n" + "")
                                    }
                                }
                            } catch (error) {
                                if (error.message.includes('user_id')) {
                                    message.reply("Error - play data not found and/or json sent no data")
                                    fs.appendFileSync(osulogdir, "\n" + "Error - play data not found and/or json sent no data")
                                }
                                else { message.reply('unknown error') 
                                console.log(error)

                                fs.appendFileSync(osulogdir, "\n" + error)
                                fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                                fs.appendFileSync(osulogdir, "\n" + "")
                            }
                            }
                        });
                } catch (error) {
                    if (error.toString().includes('replaceAll')) {
                        message.reply("Error - account not found")
                        fs.appendFileSync(osulogdir, "\n" + "error - account not found and/or json sent no data")
                    }
                    else { message.reply('unknown error') }
                    fs.appendFileSync(osulogdir, "\n" + error)
                    fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                    fs.appendFileSync(osulogdir, "\n" + "")
                }
            })

    }
}

//client.commands.get('').execute(message, args)