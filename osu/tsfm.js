//tsfm shorthand for - top score for map
const fetch = require("node-fetch");
const POST = require("node-fetch");
const fs = require("fs");
const { osulogdir } = require("../logconfig.json");
const { getStackTrace } = require("../somestuffidk/log");

module.exports = {
    name: "tsfm",
    description: "",
    async execute(
        userdatatags,
        interaction,
        options,
        Discord,
        currentDate,
        currentDateISO,
        osuapikey,
        osuauthtoken,
        osuclientid,
        osuclientsecret
    ) {
        interaction.reply("getting data...");
        fs.appendFileSync(osulogdir, "\n" + "--- COMMAND EXECUTION ---");
        let pickeduserX = options.getString("username");
        let map = options.getNumber("id");
        let sort = options.getString("sort") + "".toLowerCase();
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`);
        fs.appendFileSync(osulogdir, "\n" + "command executed - top score for map");
        let consoleloguserweeee = interaction.member.user;
        fs.appendFileSync(
            osulogdir,
            "\n" +
            `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`
        );
        fs.appendFileSync(osulogdir, "\n" + "");
        if (!pickeduserX) {
            try {
                findname = await userdatatags.findOne({
                    where: { name: interaction.member.user.id },
                });
                pickeduserX = findname.get("description");
            } catch (error) { }
        }
        if (!pickeduserX) return interaction.reply("user ID or username required");
        //if(isNaN(pickeduserX)){ //return interaction.reply("You must use ID e.g. 15222484 instead of SaberStrike")
        //let mapid = Math.abs(maplink)
        const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
        const { access_token } = require("../debug/osuauth.json");

        fetch(userinfourl, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
            .then((res) => res.json())
            .then((output1) => {
                let { prevmap } = require("../debug/storedmap.json");

                fs.appendFileSync(osulogdir, "\n" + "writing data to osuauth.json");
                fs.appendFileSync(osulogdir, "\n" + "");

                try {
                    const osudata = output1;
                    fs.writeFileSync(
                        "debug/osuid.json",
                        JSON.stringify(osudata, null, 2)
                    );
                    let playerid = JSON.stringify(osudata, ["id"])
                        .replaceAll("{", "")
                        .replaceAll('"', "")
                        .replaceAll("}", "")
                        .replaceAll(":", "")
                        .replaceAll("id", "");
                    //interaction.reply(playerid)

                    if (!map) {
                        mapscoreurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}/scores/users/${playerid}/all`;
                        mapdataurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`;
                        mapid = prevmap;
                    }
                    if (map) {
                        mapscoreurl = `https://osu.ppy.sh/api/v2/beatmaps/${map}/scores/users/${playerid}/all`;
                        mapdataurl = `https://osu.ppy.sh/api/v2/beatmaps/${map}`;
                        mapid = map;
                    }
                    const { access_token } = require("../debug/osuauth.json");

                    fetch(mapscoreurl, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    })
                        .then((res) => res.json())
                        .then((output2) => {
                            /*       No switches?
                                  ⠀⣞⢽⢪⢣⢣⢣⢫⡺⡵⣝⡮⣗⢷⢽⢽⢽⣮⡷⡽⣜⣜⢮⢺⣜⢷⢽⢝⡽⣝
                                  ⠸⡸⠜⠕⠕⠁⢁⢇⢏⢽⢺⣪⡳⡝⣎⣏⢯⢞⡿⣟⣷⣳⢯⡷⣽⢽⢯⣳⣫⠇
                                  ⠀⠀⢀⢀⢄⢬⢪⡪⡎⣆⡈⠚⠜⠕⠇⠗⠝⢕⢯⢫⣞⣯⣿⣻⡽⣏⢗⣗⠏⠀
                                  ⠀⠪⡪⡪⣪⢪⢺⢸⢢⢓⢆⢤⢀⠀⠀⠀⠀⠈⢊⢞⡾⣿⡯⣏⢮⠷⠁⠀⠀
                                  ⠀⠀⠀⠈⠊⠆⡃⠕⢕⢇⢇⢇⢇⢇⢏⢎⢎⢆⢄⠀⢑⣽⣿⢝⠲⠉⠀⠀⠀⠀
                                  ⠀⠀⠀⠀⠀⡿⠂⠠⠀⡇⢇⠕⢈⣀⠀⠁⠡⠣⡣⡫⣂⣿⠯⢪⠰⠂⠀⠀⠀⠀
                                  ⠀⠀⠀⠀⡦⡙⡂⢀⢤⢣⠣⡈⣾⡃⠠⠄⠀⡄⢱⣌⣶⢏⢊⠂⠀⠀⠀⠀⠀⠀
                                  ⠀⠀⠀⠀⢝⡲⣜⡮⡏⢎⢌⢂⠙⠢⠐⢀⢘⢵⣽⣿⡿⠁⠁⠀⠀⠀⠀⠀⠀⠀
                                  ⠀⠀⠀⠀⠨⣺⡺⡕⡕⡱⡑⡆⡕⡅⡕⡜⡼⢽⡻⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                  ⠀⠀⠀⠀⣼⣳⣫⣾⣵⣗⡵⡱⡡⢣⢑⢕⢜⢕⡝⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                  ⠀⠀⠀⣴⣿⣾⣿⣿⣿⡿⡽⡑⢌⠪⡢⡣⣣⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                  ⠀⠀⠀⡟⡾⣿⢿⢿⢵⣽⣾⣼⣘⢸⢸⣞⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                                  ⠀⠀⠀⠀⠁⠇⠡⠩⡫⢿⣝⡻⡮⣒⢽⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀*/

                            if (!output2.scores)
                                return message.reply(
                                    `error - unranked map.\nCurrently loaded map: https://osu.ppy.sh/b/${prevmap} \nSend the link to another map to change it.`
                                );
                            if (sort == "acc" || sort == "accuracy") {
                                osutopdata = output2.scores.sort(
                                    (a, b) => b.accuracy - a.accuracy
                                );
                                sortedby = "Sorted by: Accuracy";
                            } else if (
                                sort == "time" ||
                                sort == "date" ||
                                sort == "recent" ||
                                sort == "r"
                            ) {
                                //osutopdata = output2.sort((a, b) => b.created_at.toLowerCase().slice(0, 10).replaceAll('-', '') - a.created_at.toLowerCase().slice(0, 10).replaceAll('-', ''));
                                osutopdata = output2.scores.sort(
                                    (a, b) =>
                                        Math.abs(
                                            b.created_at
                                                .slice(0, 19)
                                                .replaceAll("-", "")
                                                .replaceAll("T", "")
                                                .replaceAll(":", "")
                                                .replaceAll("+", "")
                                        ) -
                                        Math.abs(
                                            a.created_at
                                                .slice(0, 19)
                                                .replaceAll("-", "")
                                                .replaceAll("T", "")
                                                .replaceAll(":", "")
                                                .replaceAll("+", "")
                                        )
                                );
                                //fs.appendFileSync(osulogdir, "\n" + osutopdata[0]['created_at'].slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', ''))

                                sortedby = "Sorted by: Most Recent";
                            } else if (sort == "pp" || sort == "performance") {
                                osutopdata = output2.scores.sort((a, b) => b.pp - a.pp);
                                sortedby = "Sorted by: pp (performance points)";
                            } else if (sort == "score") {
                                osutopdata = output2.scores.sort((a, b) => a.score - b.score);
                                sortedby = "Sorted by: Score";
                            } else {
                                osutopdata = output2.scores.sort(
                                    (a, b) =>
                                        Math.abs(
                                            a.created_at
                                                .slice(0, 19)
                                                .replaceAll("-", "")
                                                .replaceAll("T", "")
                                                .replaceAll(":", "")
                                                .replaceAll("+", "")
                                        ) -
                                        Math.abs(
                                            b.created_at
                                                .slice(0, 19)
                                                .replaceAll("-", "")
                                                .replaceAll("T", "")
                                                .replaceAll(":", "")
                                                .replaceAll("+", "")
                                        )
                                );
                                sortedby = "⠀";
                            }
                            const mapscoredata = output2;
                            //let mapdataP2 = JSON.stringify("[\n" + mapdataP1 + "\n]");
                            //const mapdata = JSON.stringify("[\n" + mapdataP1 + "\n]");
                            fs.writeFileSync(
                                "debug/mapscore.json",
                                JSON.stringify(mapscoredata, null, 2)
                            );
                            fs.appendFileSync(
                                osulogdir,
                                "\n" + "writing data to mapscore.json"
                            );
                            fs.appendFileSync(osulogdir, "\n" + "");
                            console.groupEnd();
                            try {
                                text = "";
                                //let playerid = JSON.stringify(mapscoredata['scores'][0]['score'], ['user_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('user_id', '');
                                let playername = JSON.stringify(osudata, ["username"])
                                    .replaceAll("{", "")
                                    .replaceAll('"', "")
                                    .replaceAll("}", "")
                                    .replaceAll(":", "")
                                    .replace("username", "");

                                //let mapdataurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`
                                fetch(mapdataurl, {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${access_token}`,
                                        "Content-Type": "application/json",
                                        Accept: "application/json",
                                    },
                                })
                                    .then((res) => res.json())
                                    .then((output3) => {
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
                                                mods2 = "";
                                            }
                                            if (mods) {
                                                mods2 = "+" + mods + " |";
                                            }
                                            if (grade == "xh" || grade == "XH") {
                                                grade = "<:rankingxh:927797179597357076>";
                                            }
                                            if (grade == "x" || grade == "X") {
                                                grade = "<:rankingX:927797179832229948>";
                                            }
                                            if (grade == "sh" || grade == "SH") {
                                                grade = "<:rankingSH:927797179710570568>";
                                            }
                                            if (grade == "s" || grade == "S") {
                                                grade = "<:rankingS:927797179618295838>";
                                            }
                                            if (grade == "a" || grade == "A") {
                                                grade = "<:rankingA:927797179739930634>";
                                            }
                                            if (grade == "b" || grade == "B") {
                                                grade = "<:rankingB:927797179697991700>";
                                            }
                                            if (grade == "c" || grade == "C") {
                                                grade = "<:rankingC:927797179584757842>";
                                            }
                                            if (grade == "d" || grade == "D") {
                                                grade = "<:rankingD:927797179534438421>";
                                            }
                                            if (grade == "f" || grade == "F") {
                                                grade = "🇫";
                                            }
                                            text =
                                                text +
                                                `**${i + 1}**\n ${mods2} ${maptime}\n**${(
                                                    acc * 100
                                                ).toFixed(
                                                    2
                                                )}%** | **${pp}**pp | **${grade}**\n${combo}x/**${mapmaxcombo}**x | ${mapscore300s}/${mapscore100s}/${mapscore50s}/${mapscore0s}\n\n`;
                                        }
                                        if (text == "" || text == " ") {
                                            text = "**no scores found**";
                                        }
                                        const fileName = "debug/storedmap.json";
                                        const file = require("../debug/storedmap.json");
                                        file.prevmap = mapid;
                                        fs.writeFile(
                                            fileName,
                                            JSON.stringify(file, null, 2),
                                            function writeJSON(err) {
                                                if (err)
                                                    return fs.appendFileSync(osulogdir, "\n" + err);
                                                fs.appendFileSync(
                                                    osulogdir,
                                                    "\n" + JSON.stringify(file)
                                                );
                                                fs.appendFileSync(
                                                    osulogdir,
                                                    "\n" + "writing to " + fileName
                                                );
                                                fs.appendFileSync(osulogdir, "\n" + "");
                                                console.groupEnd();
                                            }
                                        );
                                        let Embed = new Discord.MessageEmbed()
                                            .setTitle(`${mapartist} - ${maptitle}\n[${mapdiff}]`)
                                            //.setThumbnail(`https://a.ppy.sh/${playerid}`)
                                            .setURL("https://osu.ppy.sh/b/" + prevmap)
                                            .setImage(`${mapbg}`)
                                            .setAuthor(
                                                `${playername}'s scores on`,
                                                `https://a.ppy.sh/${playerid}`,
                                                `https://osu.ppy.sh/u/${playerid}`
                                            )
                                            .setDescription(`${sortedby}\n${text}`)
                                            .addField(
                                                "map info",
                                                `${mapsr}⭐\nCS${mapcs} AR${mapar} OD${mapod} HP${maphp} ${mapbpm}BPM`,
                                                false
                                            );
                                        //.setFooter(`${text}`)
                                        interaction.editReply({ content: "⠀", embeds: [Embed] });
                                    });
                            } catch (error) {
                                interaction.channel.send("Error - no data");
                                fs.appendFileSync(osulogdir, "\n1" + error);
                                fs.appendFileSync(osulogdir, "\n" + getStackTrace(error));
                                fs.appendFileSync(osulogdir, "\n" + "");
                                console.log(error);
                            }
                        });
                } catch (error) {
                    interaction.channel.send("Error - account not found");
                    fs.appendFileSync(osulogdir, "\n" + "Error account not found");
                    fs.appendFileSync(osulogdir, "\n" + error);
                    fs.appendFileSync(osulogdir, "\n" + getStackTrace(error));
                    fs.appendFileSync(osulogdir, "\n" + "");
                }
            });
    },
};
