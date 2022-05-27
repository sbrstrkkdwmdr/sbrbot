//https://github.com/Ameobea/osutrack-api
const fetch = require('node-fetch');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//const xhr = new XMLHttpRequest();
const GET = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { exec } = require("child_process");
const { osulogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log');
const { isNullOrUndefined } = require('util');

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
        let altpickedmode = options.getString('mode')
        let pickedmode;
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
        if (isNullOrUndefined(altpickedmode)) {
            pickedmodex = 'osu'
        }
        if (!pickedmode && !altpickedmode) {
            pickedmodex = 'osu'
        }
        else if (altpickedmode) {
            pickedmode = altpickedmode
            pickedmodex = altpickedmode
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
        if (!offsetflag) {
            offsetflag = '0'
        }
        interaction.reply('getting data...')
        fs.appendFileSync(osulogdir, "\n" + pickedmodex + ' from ' + pickedmode)
        if (!pickeduserX) return interaction.channel.send("Error - no user");

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
                    fs.appendFileSync(osulogdir, "\n" + "writing data to osuid.json")
                    fs.appendFileSync(osulogdir, "\n" + "")

                    let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                    if (!playerid) {
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
                        .then(output2 => {
                            resortdata = output2
                            filterby = '⠀'
                            let mappersort = options.getString('mapper')
                            if (mappersort) {
                                resortdata = output2.filter(word => word.beatmapset.creator.toLowerCase() == mappersort.toLowerCase());
                                filterby = 'Filtered by:\nMapper: ' + mappersort
                                //fs.write(resortdata)
                                //console.log('pe')
                            }
                            let modsort = options.getString('mods')
                            if (modsort) {

                                if (modsort.includes('exact')) {
                                    modsort2 = modsort.toLowerCase().slice(5)
                                    resortdata = resortdata.filter(word => word.mods.toString().replaceAll(",", '').toLowerCase() == modsort2)
                                    filterby += `\nMods: ${modsort2.toUpperCase()} (hard filter)`
                                }
                                else {
                                    resortdata = resortdata.filter(word => word.mods.toString().replaceAll(",", '').toLowerCase().includes(modsort2))
                                    filterby += `\nMods: ${modsort2.toUpperCase()}`
                                }

                            }

                            let sort = options.getString('sort')//.toLowerCase();
                            if (sort) {
                                sort = sort.toLowerCase();
                            }
                            if (sort == 'acc' || sort == 'accuracy') {
                                osutopdata = resortdata.sort((a, b) => b.accuracy - a.accuracy);
                                sortedby = 'Sorted by: Accuracy'
                            }
                            else if (sort == 'time' || sort == 'date' || sort == 'recent' || sort == 'r') {
                                //osutopdata = resortdata.sort((a, b) => b.created_at.toLowerCase().slice(0, 10).replaceAll('-', '') - a.created_at.toLowerCase().slice(0, 10).replaceAll('-', ''));
                                osutopdata = resortdata.sort((a, b) => Math.abs(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - Math.abs(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')));
                                //fs.appendFileSync(osulogdir, "\n" + osutopdata[0]['created_at'].slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', ''))

                                sortedby = 'Sorted by: Most Recent'
                            }
                            else if (sort == 'score') {
                                osutopdata = resortdata.sort((a, b) => b.score - a.score);
                                sortedby = 'Sorted by: Score'
                            }
                            /*if(sort == 'score'){
                                osutopdata = output2.sort((a, b) => a.pp - b.pp);
                            }*/
                            else {
                                osutopdata = resortdata.sort((a, b) => b.pp - a.pp);
                                sortedby = '⠀'
                            }
                            //osutopdata = output2;

                            fs.writeFileSync("debug/osutop.json", JSON.stringify(osutopdata, null, 2));
                            fs.appendFileSync(osulogdir, "\n" + "writing data to osutop.json")
                            fs.appendFileSync(osulogdir, "\n" + "")
                            console.groupEnd()
                            try {
                                try {
                                    let topplayername = JSON.stringify(osutopdata[0]['user'], ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');
                                }
                                catch (error) {
                                    interaction.channel.send("Error 03 - not enough plays")
                                    fs.appendFileSync(osulogdir, "\n" + "error osu03 - not enough plays")
                                    return;
                                }
                                let topplayername = (osutopdata[0].user.username)
                                let topplayeravatar = (osutopdata[0].user.avatar_url)

                                let Embed = new Discord.MessageEmbed()
                                    .setColor(0x462B71)
                                    .setTitle("Top plays for " + topplayername)
                                    .setURL(`https://osu.ppy.sh/u/${playerid}`)
                                    .setThumbnail(topplayeravatar)
                                    .setDescription(`${filterby}\n${sortedby}`)
                                for (i = 0; i < 5 && i < osutopdata.length; i++) {
                                    maptitle = osutopdata[i].beatmapset.title_unicode.toString()
                                    mapdiff = osutopdata[i].beatmap.version
                                    mapurl = osutopdata[i].beatmap.id
                                    mapmods1 = osutopdata[i].mods

                                    if (!mapmods1 || mapmods1 == '' || mapmods1 == 'undefined' || mapmods1 == null || mapmods1 == undefined) {
                                        mapmods = ''
                                    } else {
                                        mapmods = '+' + mapmods1.toString().replaceAll(",", '')
                                    }

                                    mapscore = osutopdata[i].score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    maptimeset = osutopdata[i].created_at.toString().slice(0, 19).replace("T", " ")
                                    mapacc = Math.abs(osutopdata[i].accuracy * 100).toFixed(2)
                                    maprank = osutopdata[i].rank
                                    map300max = osutopdata[i].statistics.count_geki
                                    map300 = osutopdata[i].statistics.count_300
                                    map200 = osutopdata[i].statistics.count_katu
                                    map100 = osutopdata[i].statistics.count_100
                                    map50 = osutopdata[i].statistics.count_50
                                    mapmiss = osutopdata[i].statistics.count_miss
                                    hitlist = ''
                                    if (pickedmodex == 'osu') {
                                        hitlist = `**300:** ${map300} **00:** ${map100} **50:** ${map50} **X:** ${mapmiss}`
                                    }
                                    if (pickedmodex == 'taiko') {
                                        hitlist = `**300(GREAT):** ${map300} **00(GOOD):** ${map100} **X:** ${mapmiss}`
                                    }
                                    if (pickedmodex == 'fruits') {
                                        hitlist = `**300:** ${map300} **00(Drops):** ${map100} **50(Droplets):** ${map50} **X:** ${mapmiss}`
                                    }
                                    if (pickedmodex == 'mania') {
                                        hitlist = `**300+**: ${map300max} **300:** ${map300} **200:** ${map200} **00:** ${map100} **50:** ${map50} **X:** ${mapmiss}`
                                    }
                                    mappp = osutopdata[i].pp
                                    weightedmappp = osutopdata[i].weight.pp
                                    weightedpppercent = Math.abs(osutopdata[i].weight.percentage).toFixed(2)
                                    Embed.addField(`---`, `**[${maptitle} [${mapdiff}]](https://osu.ppy.sh/b/${mapurl}) ${mapmods}**\nSCORE: ${mapscore} \nScore set on ${maptimeset} \n${mapacc}% | ${maprank}\n${hitlist} \n**${(Math.abs(mappp).toFixed(2))}**pp | **${Math.abs(weightedmappp).toFixed(2)}**pp weighted **${weightedpppercent}**%`, false)
                                }
                                interaction.editReply({ content: '⠀', embeds: [Embed] })
                                fs.appendFileSync(osulogdir, "\n" + "sent")
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
                        })
                } catch (error) {
                    interaction.channel.send("Error - account not found")
                    fs.appendFileSync(osulogdir, "\n" + "Error account not found")
                    fs.appendFileSync(osulogdir, "\n" + error)
                    fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                    fs.appendFileSync(osulogdir, "\n" + "")
                    console.groupEnd()
                }
            })

    }
}
