const fetch = require("node-fetch");
const POST = require("node-fetch");
const fs = require("fs");
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require("booba");
const { calculateStarRating } = require("osu-sr-calculator");
const { osulogdir } = require("../logconfig.json");
const {
  doubletimear,
  halftimear,
  easymultiplier,
  hardrockmultiplier,
} = require("../calculations/approachrate");
const { getStackTrace } = require("../somestuffidk/log");
//            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))

module.exports = {
  name: "map",
  description: "",
  execute(
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
    fs.appendFileSync(osulogdir, "\n" + "--- COMMAND EXECUTION ---");
    let mapid = options.getNumber("id");
    let mods = options.getString("mods");
    if (!mods) {
      mods = "NM";
    }
    let { prevmap } = require("../debug/storedmap.json");
    if (!mapid) {
      mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`;
    }
    if (mapid) {
      mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}`;
    }
    const modsarray = [
      "EZ",
      "NF",
      "HT",
      "HR",
      "SD",
      "PF",
      "DT",
      "NC",
      "HD",
      "FL",
      "RX",
      "AP",
      "SO",
      "TD",
      "NM",
    ];
    if (modsarray.some((v) => mods.includes(v))) {
      moddetect = mods;
    }
    if (!mods || !modsarray.some((v) => mods.includes(v))) {
      moddetect = "NM";
    }
    interaction.reply("getting data...");
    fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`);
    fs.appendFileSync(osulogdir, "\n" + "command executed - map get");
    fs.appendFileSync(osulogdir, "\n" + "category - osu");
    let consoleloguserweeee = interaction.member.user;
    fs.appendFileSync(
      osulogdir,
      "\n" +
        `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`
    );
    fs.appendFileSync(osulogdir, "\n" + "");

    try {
      const { access_token } = require("../debug/osuauth.json");

      fetch(mapurl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((output2) => {
          const mapdata = output2;
          //let mapdataP2 = JSON.stringify("[\n" + mapdataP1 + "\n]");
          //const mapdata = JSON.stringify("[\n" + mapdataP1 + "\n]");
          fs.writeFileSync("debug/map.json", JSON.stringify(mapdata, null, 2));
          fs.appendFileSync(osulogdir, "\n" + "writing data to map.json");
          fs.appendFileSync(osulogdir, "\n" + "");
          try {
            let mapbg = JSON.stringify(
              mapdata.beatmapset.covers["cover@2x"]
            ).replaceAll('"', "");
            let maplink = JSON.stringify(mapdata.id);
            let mapsetlink = JSON.stringify(mapdata.beatmapset_id);
            let mapcs = JSON.stringify(mapdata.cs);
            let mapar = JSON.stringify(mapdata.ar);
            let mapod = JSON.stringify(mapdata.accuracy);
            let maphp = JSON.stringify(mapdata.drain);
            let mapsr = JSON.stringify(mapdata.difficulty_rating);
            let mapbpm = JSON.stringify(mapdata.bpm);

            let mapcsNM = JSON.stringify(mapdata.cs);
            let maparNM = JSON.stringify(mapdata.ar);
            let mapodNM = JSON.stringify(mapdata.accuracy);
            let maphpNM = JSON.stringify(mapdata.drain);
            //let mapsrNM = JSON.stringify(mapdata.difficulty_rating);
            let mapbpmNM = JSON.stringify(mapdata.bpm);

            let mapcircle = JSON.stringify(mapdata.count_circles);
            let mapslider = JSON.stringify(mapdata.count_sliders);
            let mapspinner = JSON.stringify(mapdata.count_spinners);
            let mapper = JSON.stringify(mapdata.beatmapset.creator).replaceAll(
              '"',
              ""
            );
            let maptitleuni = JSON.stringify(
              mapdata.beatmapset.title_unicode
            ).replaceAll('"', "");
            let maptitlenorm = JSON.stringify(
              mapdata.beatmapset.title
            ).replaceAll('"', "");
            let maptitle = maptitleuni;
            if (maptitlenorm != maptitleuni) {
              maptitle = `${maptitleuni}\n${maptitlenorm}`;
            }

            let mapdiff = JSON.stringify(mapdata.version).replaceAll('"', "");
            let mapartist = JSON.stringify(
              mapdata.beatmapset.artist
            ).replaceAll('"', "");
            let mapmaxcombo = JSON.stringify(mapdata.max_combo);
            let maplength = JSON.stringify(mapdata.total_length);
            let maphitonly = JSON.stringify(mapdata.hit_length);
            let mapmode = JSON.stringify(mapdata.mode);
            let mapperlink = JSON.stringify(mapper)
              .replaceAll(" ", "%20")
              .replaceAll('"', ""); //.replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '');

            let maphit1 = Math.floor(maphitonly / 60);
            let maphit2 = Math.abs(maphitonly % 60);
            if (maphit2 < 10) {
              maphit2 = "0" + maphit2;
            }
            if (maphit2 == 0) {
              maphit2 = "00";
            }
            let mapplaylength = maphit1 + ":" + maphit2;
            let recordedmaplength = mapplaylength;
            let mapmaxcombotoint = Math.abs(mapmaxcombo);
            let slidertonum = Math.abs(mapslider);
            let circletonum = Math.abs(mapcircle);
            let spinnertonum = Math.abs(mapspinner);
            let totalobjcount = Math.abs(mapcircle + mapslider + mapspinner);
            //let totalobjcount2 = JSON.stringify(totalobjcount);
            let mapcstoint = Math.abs(mapcs);
            let mapartoint = Math.abs(mapar);
            let maphptoint = Math.abs(maphp);
            let mapodtoint = Math.abs(mapod);

            let mapstatus = JSON.stringify(mapdata, ["status"])
              .replaceAll("{", "")
              .replaceAll('"', "")
              .replace("}", "")
              .replace(":", "")
              .replace("status", "");
            if (mapstatus == "ranked") {
              statusimg = "<:statusranked:944512775579926609>";
            }
            if (mapstatus == "approved" || mapstatus == "qualified") {
              statusimg = "<:statusapproved:944512764913811467>";
            }
            if (mapstatus == "loved") {
              statusimg = "<:statusloved:944512775810588733>";
            }
            if (mapstatus == "graveyard" || mapstatus == "pending") {
              statusimg = "<:statusgraveyard:944512765282897940>";
            }

            let mapid = Math.abs(maplink);
            const fileName = "debug/storedmap.json";
            const file = require("../debug/storedmap.json");
            file.prevmap = maplink;
            fs.writeFile(
              fileName,
              JSON.stringify(file, null, 2),
              function writeJSON(err) {
                if (err) return fs.appendFileSync(osulogdir, "\n" + err);
                fs.appendFileSync(osulogdir, "\n" + JSON.stringify(file));
                fs.appendFileSync(osulogdir, "\n" + "writing to " + fileName);
                fs.appendFileSync(osulogdir, "\n" + "");
                console.groupEnd();
              }
            ); //all this stuff is to write it to a temporary save file

            (async () => {
              if (
                moddetect.includes("DT") &&
                !moddetect.includes("HR") &&
                !moddetect.includes("EZ")
              ) {
                mapar = doubletimear(maparNM);
                mapod = mapodNM + "^";
                maphp = maphpNM + "^";
                mapbpm = Math.abs(mapbpmNM * 1.5).toFixed(2);
                maphit1 = Math.floor(maphitonly / 1.5 / 60);
                maphit2 = Math.floor((maphitonly / 1.5) % 60);
                if (maphit2 < 10) {
                  maphit2 = "0" + maphit2;
                }
                if (maphit2 == 0) {
                  maphit2 = "00";
                }
                recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
              }
              if (
                moddetect.includes("HT") &&
                !moddetect.includes("HR") &&
                !moddetect.includes("EZ")
              ) {
                mapar = halftimear(maparNM);
                mapod = mapodNM + "⌄";
                maphp = maphpNM + "⌄";
                mapbpm = Math.abs(mapbpmNM * 0.75).toFixed(2);
                maphit1 = Math.floor(maphitonly / 0.75 / 60);
                maphit2 = Math.floor((maphitonly / 0.75) % 60);
                if (maphit2 < 10) {
                  maphit2 = "0" + maphit2;
                }
                if (maphit2 == 0) {
                  maphit2 = "00";
                }
                recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
              }
              if (
                moddetect.includes("HR") &&
                !moddetect.includes("HT") &&
                !moddetect.includes("DT")
              ) {
                mapcs = Math.abs(mapcsNM * 1.3).toFixed(2);
                mapar = Math.abs(maparNM * 1.4).toFixed(2);
                maphp = Math.abs(maphpNM * 1.4).toFixed(2);
                mapod = Math.abs(mapodNM * 1.4).toFixed(2);
                if (mapar > 10) {
                  mapar = 10;
                }
                if (maphp > 10) {
                  maphp = 10;
                }
                if (mapod > 10) {
                  mapod = 10;
                }
              }
              if (
                moddetect.includes("EZ") &&
                !moddetect.includes("HT") &&
                !moddetect.includes("DT")
              ) {
                mapcs = Math.abs(mapcsNM / 2).toFixed(2);
                mapar = Math.abs(maparNM / 2).toFixed(2);
                maphp = Math.abs(maphpNM / 2).toFixed(2);
                mapod = Math.abs(mapodNM / 2).toFixed(2);
              }

              if (moddetect.includes("EZ") && moddetect.includes("HR"))
                return message.reply("invalid mods!");
              if (moddetect.includes("DT") && moddetect.includes("HT"))
                return message.reply("invalid mods!");

              if (moddetect.includes("EZ") && moddetect.includes("HT")) {
                mapcs = Math.abs(mapcsNM / 2);
                mapar = Math.abs(halftimear(maparNM / 2));

                maphp = Math.abs(maphpNM / 2) + "⌄";
                mapod = Math.abs(mapodNM / 2) + "⌄";
                mapbpm = Math.abs(mapbpmNM * 0.75);
                if (Number.isInteger(mapbpm * 100) == false) {
                  mapbpm = mapbpm.toFixed(2);
                }
                maphit1 = Math.floor(maphitonly / 0.75 / 60);
                maphit2 = Math.floor((maphitonly / 0.75) % 60);
                recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
              }
              if (moddetect.includes("EZ") && moddetect.includes("DT")) {
                mapcs = Math.abs(mapcsNM / 2);
                mapar = Math.abs(doubletimear(maparNM / 2));

                maphp = Math.abs(maphpNM / 2) + "^";
                mapod = Math.abs(mapodNM / 2) + "^";
                mapbpm = Math.abs(mapbpmNM * 1.5);
                if (Number.isInteger(mapbpm * 100) == false) {
                  mapbpm = mapbpm.toFixed(2);
                }
                maphit1 = Math.floor(maphitonly / 1.5 / 60);
                maphit2 = Math.floor((maphitonly / 1.5) % 60);
                if (maphit2 < 10) {
                  maphit2 = "0" + maphit2;
                }
                if (maphit2 == 0) {
                  maphit2 = "00";
                }
                recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
              }
              if (moddetect.includes("HR") && moddetect.includes("HT")) {
                mapcs = Math.abs(mapcsNM * 1.3);
                mapar = Math.abs(halftimear(maparNM * 1.4));
                maphp = Math.abs(maphpNM * 1.4); //.toFixed(2) //+ "⌄";
                mapod = Math.abs(mapodNM * 1.4); //.toFixed(2) //+ "⌄";

                if (maphp >= 10) {
                  maphp = 10 + "⌄";
                }
                if (mapod >= 10) {
                  mapod = 10 + "⌄";
                }
                if (maphp < 10) {
                  maphp = maphp + "⌄";
                }
                if (mapod < 10) {
                  mapod = mapod + "⌄";
                }
                mapbpm = Math.abs(mapbpmNM * 0.75);
                if (Number.isInteger(mapbpm * 100) == false) {
                  mapbpm = mapbpm.toFixed(2);
                }
                maphit1 = Math.floor(maphitonly / 0.75 / 60);
                maphit2 = Math.floor((maphitonly / 0.75) % 60);
                if (maphit2 < 10) {
                  maphit2 = "0" + maphit2;
                }
                if (maphit2 == 0) {
                  maphit2 = "00";
                }
                recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
              }
              if (moddetect.includes("HR") && moddetect.includes("DT")) {
                mapcs = Math.abs(mapcsNM * 1.3);
                mapar = Math.abs(doubletimear(maparNM * 1.4));

                //fs.appendFileSync(osulogdir, "\n" + Number.isInteger(mapar * 100))
                maphp = Math.abs(maphpNM * 1.4).toFixed(2); // + "^";
                mapod = Math.abs(mapodNM * 1.4).toFixed(2); // + "^";
                mapbpm = Math.abs(mapbpmNM * 1.4).toFixed(2);
                if (Number.isInteger(mapbpm * 100) == false) {
                  mapbpm = mapbpm.toFixed(2);
                }
                maphit1 = Math.floor(maphitonly / 1.5 / 60);
                maphit2 = Math.floor((maphitonly / 1.5) % 60);
                if (maphit2 < 10) {
                  maphit2 = "0" + maphit2;
                }
                if (maphit2 == 0) {
                  maphit2 = "00";
                }
                recordedmaplength = `${maphit1}:${maphit2} (${mapplaylength})`;
                if (maphp >= 10) {
                  maphp = 10 + "^";
                }
                if (mapod >= 10) {
                  mapod = 10 + "^";
                }
                if (maphp < 10) {
                  maphp = maphp + "^";
                }
                if (mapod < 10) {
                  mapod = mapod + "^";
                }
                if (mapar > 11) {
                  mapar = 11;
                }
              }

              const score = {
                beatmap_id: maplink,
                score: "6795149",
                maxcombo: mapmaxcombo,
                count50: "0",
                count100: "0",
                count300: "374",
                countmiss: "0",
                countkatu: "0",
                countgeki: "0",
                perfect: "1",
                enabled_mods: "0",
                user_id: "13780464",
                date: "2022-02-08 05:24:54",
                rank: "S",
                score_id: "4057765057",
              };
              //const score = scorew
              const score95 = {
                beatmap_id: maplink,
                score: "6795149",
                maxcombo: mapmaxcombo,
                count50: "0",
                count100: "266",
                count300: "3740",
                countmiss: "0",
                countkatu: "0",
                countgeki: "0",
                perfect: "0",
                enabled_mods: "0",
                user_id: "13780464",
                date: "2022-02-08 05:24:54",
                rank: "S",
                score_id: "4057765057",
              };
              let modissue = "";
              let moddetectnotd = moddetect;
              if (moddetect.includes("TD")) {
                moddetectnotd = JSON.stringify(moddetect)
                  .replaceAll("{", "")
                  .replaceAll('"', "")
                  .replaceAll("}", "")
                  .replaceAll(":", "")
                  .replaceAll("moddetect", "")
                  .replaceAll("TD")
                  .replaceAll("undefined");
                modissue = `\n(calculations **don't** include TD)`;
              }
              if (moddetect == "TD") {
                moddetectnotd = "NM";
              }
              let pp = new std_ppv2()
                .setPerformance(score)
                .setMods(moddetectnotd);
              let ppcalc95 = new std_ppv2()
                .setPerformance(score95)
                .setMods(moddetectnotd);
              let mapimg = "<:modeosu:944181096868884481>";
              if (mapmode == "osu") {
                pp = new std_ppv2()
                  .setPerformance(score)
                  .setMods(moddetectnotd);
                ppcalc95 = new std_ppv2()
                  .setPerformance(score95)
                  .setMods(moddetectnotd);
                mapimg = "<:modeosu:944181096868884481>";
              }
              if (mapmode == "taiko") {
                pp = new taiko_ppv2()
                  .setPerformance(score)
                  .setMods(moddetectnotd);
                ppcalc95 = new taiko_ppv2()
                  .setPerformance(score95)
                  .setMods(moddetectnotd);
                mapimg = "<:modetaiko:944181097053442068>";
              }
              if (mapmode == "fruits") {
                pp = new catch_ppv2()
                  .setPerformance(score)
                  .setMods(moddetectnotd);
                ppcalc95 = new catch_ppv2()
                  .setPerformance(score95)
                  .setMods(moddetectnotd);
                mapimg = "<:modefruits:944181096206176326>";
              }
              if (mapmode == "mania") {
                pp = new mania_ppv2()
                  .setPerformance(score)
                  .setMods(moddetectnotd);
                ppcalc95 = new mania_ppv2()
                  .setPerformance(score95)
                  .setMods(moddetectnotd);
                mapimg = "<:modemania:944181095874834453>";
              }
              let ppSSjson = await pp.compute();
              let pp95json = await ppcalc95.compute();

              let ppSSstr = JSON.stringify(ppSSjson["total"]);
              let pp95str = JSON.stringify(pp95json["total"]);

              let ppSS = Math.abs(ppSSstr).toFixed(2);
              let pp95 = Math.abs(pp95str).toFixed(2);

              if (moddetect == "NM") {
                maptitle = `${mapartist} - ${maptitle} [${mapdiff}]`;
              }
              if (moddetect != "NM") {
                maptitle = `${mapartist} - ${maptitle} [${mapdiff}] +${moddetect}`;
              }
              if (moddetectnotd.includes("NM")) {
                moddetectforsr = "";
                SRclean = mapsr;
              }
              if (!moddetectnotd.includes("NM")) {
                modtoarray1 = moddetectnotd.replace(/(.{2})/g, "$1 ");
                modtoarray2 = modtoarray1.slice(0, -1);
                moddetectforsr = modtoarray2.split(/ +/);
                starRating = await calculateStarRating(maplink, moddetectforsr);
                //fs.appendFileSync(osulogdir, "\n" + starRating)
                SR = JSON.stringify(starRating)
                  .replace("{", "")
                  .replace(":", "")
                  .replace("}", "")
                  .replace(moddetectnotd, "")
                  .replace("nomod", "")
                  .replaceAll('"', "");
                SRclean = Math.abs(SR).toFixed(2);
              }
              let userinfourl = `https://osu.ppy.sh/api/v2/users/${mapperlink}/osu`;
              fetch(userinfourl, {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              })
                .then((res) => res.json())
                .then((output3) => {
                  let mapperid = JSON.stringify(output3, ["id"])
                    .replaceAll("{", "")
                    .replaceAll('"', "")
                    .replaceAll("}", "")
                    .replaceAll(":", "")
                    .replaceAll("id", "");
                  let Embed = new Discord.MessageEmbed()
                    .setColor(0x91ff9a)
                    .setTitle(`${maptitle}`)
                    .setAuthor(
                      `${mapper}`,
                      `https://a.ppy.sh/${mapperid}`,
                      `https://osu.ppy.sh/u/${mapperlink}`
                    )
                    .setURL(`https://osu.ppy.sh/b/${maplink}`)
                    .setImage(mapbg)
                    //.setDescription(`[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper + "\n\nCS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + " | " + mapsr + "⭐ \n" +  mapbpm + "BPM | <:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\n\n--**PP VALUES**--\nSS: ${ppSS} | 95: ${pp95} \n\n**DOWNLOAD**\n[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`);
                    //.addField('', `[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper)
                    .addField(
                      "**MAP DETAILS**",
                      `${statusimg} | ${mapimg} \n` +
                        "CS" +
                        mapcs +
                        " AR" +
                        mapar +
                        " OD" +
                        mapod +
                        " HP" +
                        maphp +
                        "\n" +
                        SRclean +
                        "⭐ \n" +
                        mapbpm +
                        "BPM \n<:circle:927478586028474398>" +
                        mapcircle +
                        " <:slider:927478585701330976>" +
                        mapslider +
                        " 🔁" +
                        mapspinner +
                        `\n🕐${recordedmaplength}`,
                      true
                    )
                    .addField(
                      "**PP VALUES**",
                      `\n**SS:** ${ppSS} \n**95:** ${pp95} ${modissue}`,
                      true
                    )
                    .addField(
                      "**DOWNLOAD**",
                      `[Bancho](https://osu.ppy.sh/beatmapsets/` +
                        mapsetlink +
                        `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`,
                      true
                    );
                  interaction.editReply({ content: "⠀", embeds: [Embed] });
                  fs.appendFileSync(osulogdir, "\n" + "sent");
                });
            })();
          } catch (error) {
            interaction.editReply("error");
            fs.appendFileSync(osulogdir, "\n" + error);
            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error));
            fs.appendFileSync(osulogdir, "\n" + "");
            console.groupEnd();
            console.groupEnd();
            console.groupEnd();
          }
        });
    } catch (error) {
      fs.appendFileSync(osulogdir, "\n" + error);
      fs.appendFileSync(osulogdir, "\n" + getStackTrace(error));
      console.groupEnd();
      console.groupEnd();
      console.groupEnd();
    }
  },
};
//client.commands.get('').execute(message, args)
