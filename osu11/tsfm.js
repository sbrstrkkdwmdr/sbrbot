//tsfm shorthand for - top score for map
const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { osulogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')


module.exports = {
    name: 'tsfm',
    description: '',
    async execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        let pickeduserX = args.splice(0, 1000).join(" ");
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - map scores")
        let consoleloguserweeee = message.author
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "")
        if (!pickeduserX || pickeduserX == '' || pickeduserX == ' ') {
            //console.log('pp')
            try {
                findname = await userdatatags.findOne({ where: { name: message.author.id } });
                pickeduserX = findname.get('description')
            }
            catch (error) {
            }
        }
        //if(!pickeduserX) return message.reply("user ID or username required");
        //if(isNaN(pickeduserX)){ //return message.reply("You must use ID e.g. 15222484 instead of SaberStrike")
        const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
        const { access_token } = require('../debug/osuauth.json');

        fetch(userinfourl, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.json())
            .then(output1 => {
                fs.appendFileSync(osulogdir, "\n" + "writing data to osuauth.json")
                fs.appendFileSync(osulogdir, "\n" + "")

                try {
                    const osudata = output1;
                    fs.writeFileSync("debug/osuid.json", JSON.stringify(osudata, null, 2));
                    let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                    //message.reply(playerid)
                    let { prevmap } = require('../debug/storedmap.json');

                    const mapscoreurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}/scores/users/${playerid}/all`;
                    const { access_token } = require('../debug/osuauth.json');

                    fetch(mapscoreurl, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        }
                    }).then(res => res.json())
                        .then(output2 => {
                            if (!output2.scores) return message.reply(`error - unranked map.\nCurrently loaded map: https://osu.ppy.sh/b/${prevmap} \nSend the link to another map to change it.`);
                            const mapscoredata = output2;
                            //let mapdataP2 = JSON.stringify("[\n" + mapdataP1 + "\n]");
                            //const mapdata = JSON.stringify("[\n" + mapdataP1 + "\n]");
                            fs.writeFileSync("debug/mapscore.json", JSON.stringify(mapscoredata, null, 2))
                            fs.appendFileSync(osulogdir, "\n" + "writing data to mapscore.json")
                            fs.appendFileSync(osulogdir, "\n" + "")
                            console.groupEnd()
                            try {
                                text = ''
                                //let playerid = JSON.stringify(mapscoredata['scores'][0]['score'], ['user_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user_id', '');
                                let playername = JSON.stringify(osudata, ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('username', '');

                                let mapdataurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`
                                fetch(mapdataurl, {
                                    method: "GET",
                                    headers: {
                                        "Authorization": `Bearer ${access_token}`,
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                    }
                                }).then(res => res.json())
                                    .then(output3 => {
                                        const mapdata = output3;

                                        let mapbg = (
                                            mapdata.beatmapset.covers.cover
                                        )
                                        let mapdiff = (mapdata.version)
                                        let mapartist = (mapdata.beatmapset.artist)
                                        let mapmaxcombo = (mapdata.max_combo)
                                        let mapcs = (mapdata.cs)
                                        let mapar = (mapdata.ar)
                                        let mapod = (mapdata.accuracy)
                                        let maphp = (mapdata.drain)
                                        let mapsr = (mapdata.difficulty_rating)
                                        let mapbpm = (mapdata.bpm)
                                        let mapper = (mapdata.beatmapset.creator)
                                        let maptitleuni = (mapdata.beatmapset.title_unicode)
                                        let maptitlenorm = (mapdata.beatmapset.title)
                                        let maptitle = maptitleuni;
                                        if (maptitlenorm != maptitleuni) {
                                            maptitle = `${maptitleuni}\n${maptitlenorm}`;
                                        }

                                        for (i = 0; i < mapscoredata.scores.length; i++) {
                                            let pp = mapscoredata.scores[i].pp
                                            let grade = mapscoredata.scores[i].rank
                                            let combo = mapscoredata.scores[i].max_combo
                                            let mods = mapscoredata.scores[i].mods
                                                .replaceAll("[", "")
                                                .replaceAll("]", "");
                                            let acc = mapscoredata.scores[i].accuracy
                                            let mapscore0s = mapscoredata.scores[i].statistics.count_miss
                                            let mapscore50s = mapscoredata.scores[i].statistics.count_50
                                            let mapscore100s = mapscoredata.scores[i].statistics.count_100
                                            let mapscore300s = mapscoredata.scores[i].statistics.count_300
                                            let maptime = mapscoredata.scores[i].created_at
                                                .slice(0, 10);

                                            /*let nochokeacc300 = Math.floor(300 * mapscore300s);
                                            let nochokeacc100 = Math.floor(100 * mapscore100s);
                                            let nochokeacc50 = Math.floor(50 * mapscore50s);
                                            let nochoke300num = parseInt(mapscore300s);
                                            let nochoke100num = parseInt(mapscore100s);
                                            let nochoke50num = parseInt(mapscore50s);
                                            //let rsnochoke0num = parseInt(rs0s);
                                            let nochokebottom1 = Math.floor(nochoke300num + nochoke100num + nochoke50num);
                                            let nochokebottom = Math.floor(nochokebottom1 * 300)
                                            let nochokeacctop = Math.floor(nochokeacc300 + nochokeacc100 + nochokeacc50)
                                            let nochokeacc1 = Math.abs(nochokeacctop / nochokebottom);
                                            let nochokeacc = Math.abs(nochokeacc1 * 100).toFixed(2);*/
                                            if (!mods) {
                                                mods2 = ''
                                            }
                                            if (mods) {
                                                mods2 = '+' + mods
                                            }
                                            text = text + `**${i + 1}**\n ${mods2} | ${maptime}\n**${(acc * 100).toFixed(2)}%** | **${pp}**pp | **${grade}**\n${combo}x/**${mapmaxcombo}**x | ${mapscore300s}/${mapscore100s}/${mapscore50s}/${mapscore0s}\n\n`
                                        }
                                        if (text == '' || text == ' ') {
                                            text = '**no scores found**'
                                        }
                                        let Embed = new Discord.MessageEmbed()
                                            .setTitle(`${mapartist} - ${maptitle}\n[${mapdiff}]`)
                                            //.setThumbnail(`https://a.ppy.sh/${playerid}`)
                                            .setURL('https://osu.ppy.sh/b/' + prevmap)
                                            .setImage(`${mapbg}`)
                                            .setAuthor(`${playername}'s scores on`, `https://a.ppy.sh/${playerid}`, `https://osu.ppy.sh/u/${playerid}`)
                                            .setDescription(`${text}`)
                                            .addField('map info', `${mapsr}⭐\nCS${mapcs} AR${mapar} OD${mapod} HP${maphp} ${mapbpm}BPM`, false)
                                        //.setFooter(`${text}`)
                                        message.reply({ embeds: [Embed] })
                                    })
                            } catch (error) {
                                message.reply("Error - no data")
                                fs.appendFileSync(osulogdir, "\n1" + error)
                                fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                                fs.appendFileSync(osulogdir, "\n" + "")
                                console.log(error)
                            }
                        });
                } catch (error) {
                    message.reply("Error - account not found")
                    fs.appendFileSync(osulogdir, "\n" + "Error account not found")
                    fs.appendFileSync(osulogdir, "\n" + error)
                    fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                    fs.appendFileSync(osulogdir, "\n" + "")
                }
            })

    }
}
