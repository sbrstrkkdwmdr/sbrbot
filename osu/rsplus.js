const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { calculateStarRating } = require('osu-sr-calculator')
const { osulogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')


module.exports = {
    name: 'rsplus',
    description: '',
    async execute(userdatatags, interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        let pickeduserX = options.getString('user')
        let pickedmode = options.getString('mode')
        if (!pickeduserX) {
            try {
                findname = await userdatatags.findOne({ where: { name: interaction.member.user.id } });
                pickeduserX = findname.get('description')
            }
            catch (error) {
            }
            try {
                findname = await userdatatags.findOne({ where: { name: interaction.member.user.id } });
                pickedmode = findname.get('mode')
            }
            catch (error) {
                pickedmode = 'osu'
            }
        }
        if (pickeduserX) {
            try {
                findname = await userdatatags.findOne({ where: { description: pickeduserX } })
                pickedmode = findname.get('mode')
            } catch (error) {
                fs.appendFileSync(osulogdir, "\n" + error)
            }
        }
        if (!pickedmode) {
            pickedmodex = 'osu'
        }
        else if (pickedmode == 'osu' || pickedmode == 'o' || pickedmode == 'standard' || options.getString('mode') == 'std') {
            pickedmodex = 'osu'
        }
        else if (pickedmode == 'catch the beat' || pickedmode == 'ctb' || pickedmode == 'c' || pickedmode == 'catch') {
            pickedmodex = 'fruits'
        }
        else if (pickedmode == 'mania' || pickedmode == 'm') {
            pickedmodex = 'mania'
        }
        else if (pickedmode == 'taiko' || pickedmode == 't') {
            pickedmodex = 'taiko'
        }
        else {
            pickedmodex = 'osu'
        }
        let offsetflag = options.getNumber('offset')
        if (offsetflag) {
            offsetflag = offsetflag * 5
            //playnumber = (offsetflag + 1).toString();
            //recenttitlestring = "#" + (offsetflag + 1) + " most recent play for "
        }
        if (!offsetflag) {
            offsetflag = 0
            //playnumber = ''
            //recenttitlestring = 'Most recent play for '
        }
        interaction.reply('getting data...')
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - rsplus")
        fs.appendFileSync(osulogdir, "\n" + "category - osu")
        fs.appendFileSync(osulogdir, "\n" + pickedmodex + ' from ' + pickedmode)
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "")
        if (!pickeduserX) return interaction.channel.send("user ID required");

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
                    let playerid = (osudata.id)
                    if (!playerid) {
                        interaction.channel.send("Error - account not found")
                        fs.appendFileSync(osulogdir, "\n" + "error - account not found and/or json sent no data")
                        return;
                    }

                    const recentactiveurl = `https://osu.ppy.sh/api/v2/users/${playerid}/scores/recent?include_fails=1&mode=${pickedmodex}&offset=${offsetflag}&limit=25`;

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
                                    /*
                                                    const fileName = 'debug/storedmap.json';
                                                    const file = require('../debug/storedmap.json');  
                                                    file.prevmap = rsmapid;
                                                    fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                                                        if (err) return fs.appendFileSync(osulogdir, "\n" + err);
                                                        fs.appendFileSync(osulogdir, "\n" + JSON.stringify(file));
                                                        fs.appendFileSync(osulogdir, "\n" + 'writing to ' + fileName);
                                                        fs.appendFileSync(osulogdir, "\n" + "");
                                                        console.groupEnd()
                                                    });*/

                                    fulltext = ''
                                    let underamount = 5
                                    if (rsdata.length < 5) {
                                        underamount = rsdata.length
                                    }
                                    for (i = 0; i < underamount; i++) {
                                        //console.log(i)
                                        i = parseInt(i)
                                        rsmapnameunicode = JSON.stringify(rsdata[i].beatmapset.title_unicode).slice(1, -1)
                                        rsmapnameenglish = JSON.stringify(rsdata[i].beatmapset.title).slice(1, -1)
                                        if (rsmapnameunicode != rsmapnameenglish) {
                                            rsmapname = `${rsmapnameunicode} | ${rsmapnameenglish}`
                                        }
                                        else {
                                            rsmapname = rsmapnameenglish
                                        }
                                        let rsdiffname = JSON.stringify(rsdata[i].beatmap.version).slice(1, -1)
                                        let maptitles = `${rsmapname} [${rsdiffname}]`
                                        let rsmods = JSON.stringify(rsdata[i].mods).replaceAll(',', '').replaceAll('[', '').replaceAll(']', '').replaceAll('"', '');
                                        let rsacc = JSON.parse(rsdata[i].accuracy)
                                        let rs0s = JSON.parse(rsdata[i].statistics.count_miss)
                                        let rs50s = JSON.parse(rsdata[i].statistics.count_50)
                                        let rs100s = JSON.parse(rsdata[i].statistics.count_100)
                                        let rs300s = JSON.parse(rsdata[i].statistics.count_300)
                                        let rsgeki = JSON.parse(rsdata[i].statistics.count_geki)
                                        let rskatu = JSON.parse(rsdata[i].statistics.count_katu)
                                        let rsmaptime = JSON.stringify(rsdata[i].created_at).slice(1, -1).slice(0, 19).replaceAll('T', ' ')
                                        let rspp1 = rsdata[i].pp
                                        let rspp = Math.abs(rspp1).toFixed(2);
                                        let rsmapstar = JSON.stringify(rsdata[i].beatmap.difficulty_rating)
                                        let rsgrade = rsdata[i].rank.toString()
                                        rsmapid = rsdata[i].beatmap.id
                                        let rscombo = rsdata[i].max_combo
                                        let fc = rsdata[i].perfect
                                        //console.log(rsmapid)
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
                                        if (rsmods) {
                                            rsmods2 = `+**${rsmods}**`
                                        }
                                        if (!rsmods) {
                                            rsmods2 = ''
                                        }
                                        if (pickedmodex == 'osu') {
                                            hitlist = `**300:** ${rs300s} | **100:** ${rs100s} | **50:** ${rs50s} | **X:** ${rs0s}`
                                        }
                                        if (pickedmodex == 'taiko') {
                                            hitlist = `**300(GREAT):** ${rs300s} | **100(GOOD):** ${rs100s} | **X:** ${rs0s}`
                                        }
                                        if (pickedmodex == 'fruits') {
                                            hitlist = `**300(Fruits):**${rs300s} | **100(Drops):**${rs100s} | **50(Droplets):**${rs50s} | **X:**${rs0s}`
                                        }
                                        if (pickedmodex == 'mania') {
                                            hitlist = `**300+**:${rsgeki} | **300:** ${rs300s} | **200:** ${rskatu} | **100:** ${rs100s} | **50:** ${rs50s} | **X:** ${rs0s}`
                                        }
                                        if (fc == false) {
                                            fcflag = `⠀`
                                        }
                                        if (fc == true) {
                                            fcflag = '**FC**'
                                        }
                                        let fulltimeset = (rsdata[i].created_at).toString().slice(0, -6) + "Z";

                                        let playerlasttoint = new Date(fulltimeset)

                                        let currenttime = new Date()

                                        let minsincelastvis = (playerlasttoint - currenttime) / (1000 * 60);
                                        let minlastvisreform = Math.abs(minsincelastvis).toFixed(0);
                                        //let ww = Math.abs()

                                        let lastvishours = (Math.trunc(minlastvisreform / 60)) % 24;
                                        let lastvisminutes = minlastvisreform % 60;
                                        let minlastvisw = (lastvishours + "h " + lastvisminutes + "m");
                                        fulltext += `**${offsetflag + i + 1}** | [${maptitles}](https://osu.ppy.sh/b/${rsmapid}) ${rsmods2}\n${rsmaptime} (${minlastvisw} ago) \n**${(rsacc * 100).toFixed(2)}%** | **${rspp}**pp ${fcflag} | **${rsgrade}** | **${rscombo}x**\n${hitlist}\n\n`
                                    }
                                    rscoverlist = (rsdata[0].beatmapset.covers.list)
                                    let Embed = new Discord.MessageEmbed()
                                        .setColor(0x9AAAC0)
                                        //.setTitle("Recent plays for ")
                                        .setAuthor(`Recent plays for ${rsplayername}`, `https://a.ppy.sh/${rsplayerid}`, `https://osu.ppy.sh/u/${rsplayerid}`)
                                        //.setImage(rsmapbg)
                                        //.setThumbnail(rscoverlist)
                                        .setDescription(fulltext)
                                    //.setDescription(`Score set **${minlastvisw}** ago on **${rsmaptime}** by **[${rsplayername}](https://osu.ppy.sh/u/${rsplayerid})** \n**[${rsmapname} [${rsdiffname}]](https://osu.ppy.sh/b/${rsmapid})** +**${rsmods}** **${rsmapstar}**⭐ \n **${(Math.abs((rsacc) * 100).toFixed(2))}%** | **${rsgrade}** | \n**300:**${rs300s} **100:**${rs100s} **50:**${rs50s} **X:**${rs0s} \n**${rspp}**pp | **${ppiffcw}**pp IF **${rsnochokeacc}%** FC | **${rscombo}x**`);
                                    interaction.editReply({ content: '⠀', embeds: [Embed] })
                                    fs.appendFileSync(osulogdir, "\n" + "sent")
                                } catch (error) {
                                    if (error.toString().includes('replaceAll')) {
                                        interaction.editReply("Error - play data not found (or some other error)")
                                        fs.appendFileSync(osulogdir, "\n" + "Error - play data not found and/or json sent no data")
                                    }
                                    else { interaction.channel.send('unknown error') }
                                    fs.appendFileSync(osulogdir, "\n" + error)
                                    fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                                    fs.appendFileSync(osulogdir, "\n" + "")
                                    console.groupEnd()
                                }
                            } catch (error) {
                                if (error.toString().includes('replaceAll')) {
                                    interaction.channel.send("Error - account not found (or some other error)")
                                    fs.appendFileSync(osulogdir, "\n" + "error - account not found and/or json sent no data")
                                }
                                else { interaction.channel.send('unknown error') }
                                fs.appendFileSync(osulogdir, "\n" + error)
                                fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                                fs.appendFileSync(osulogdir, "\n" + "")
                                console.groupEnd()
                            }
                        });
                } catch (error) {
                    if (error.toString().includes('replaceAll')) {
                        interaction.channel.send("Error osu04 - account not found")
                        fs.appendFileSync(osulogdir, "\n" + "error - account not found and/or json sent no data")
                    }
                    else { interaction.channel.send('unknown error') }
                    fs.appendFileSync(osulogdir, "\n" + error)
                    fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                    fs.appendFileSync(osulogdir, "\n" + "")
                    console.groupEnd()
                }
            })

    }
}

//client.commands.get('').execute(interaction, args)