const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../osuauth.json');
const calc = require('ojsama');
const { std_ppv2 } = require('booba');
const osuReplayParser = require('osureplayparser');
module.exports = {
    name: 'replayparse',
    description: '',
    execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        try{
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("link detector executed - replayparse")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("");
        const replayPath = "./files/replay.osr";
        const replay = osuReplayParser.parseReplay(replayPath);
        fs.writeFileSync("replay.json", JSON.stringify(replay, null, 2))

        let maphash = JSON.stringify(replay, ['beatmapMD5']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmapMD5', '');
        let playername = JSON.stringify(replay, ['playerName']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('playerName', '');
        let timeset = JSON.stringify(replay, ['timestamp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('timestamp', '');
        let maxcombo = JSON.stringify(replay, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
        let hit300s = JSON.stringify(replay, ['number_300s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_300s', '');
        let hit100s = JSON.stringify(replay, ['number_100s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_100s', '');
        let hit50s = JSON.stringify(replay, ['number_50s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_50s', '');
        let misses = JSON.stringify(replay, ['misses']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('misses', '');
        let hitkatu = JSON.stringify(replay, ['katus']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('katus', '');
        let hitgeki = JSON.stringify(replay, ['gekis']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('gekis', '');
        let mods = JSON.stringify(replay, ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '');
        let bettertimeset = JSON.stringify(replay, ['timestamp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('timestamp', '').slice(0, 10);


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
            .then(output => fs.writeFileSync("osuauth.json", JSON.stringify(output, null, 2)))
            ;
            console.log("writing data to osuauth.json")
            console.log("")
            
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${playername}/osu`;
            
            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output2 => 
                {
                try{const osudata = output2;
                fs.writeFileSync("osu.json", JSON.stringify(osudata, null, 2));
                console.log("writing data to osu.json")
                console.log("")
                console.groupEnd() 
                
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');


            const mapurl = ` https://osu.ppy.sh/api/get_beatmaps?k=${osuapikey}&h=${maphash}`
            fetch(mapurl)
            .then(res => res.json())
            .then(output3 => {
                const mapdata = output3;
                //console.log(mapdata)
            try{let beatmapid = JSON.stringify(mapdata[0], ['beatmap_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmap_id', '');
            const mapurl2 = `https://osu.ppy.sh/api/v2/beatmaps/${beatmapid}`
            fetch(mapurl2, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            .then(res => res.json())
            .then(output4 => {
            const mapdata2 = output4;
            let mapbg = JSON.stringify(mapdata2['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
            let mapper = JSON.stringify(mapdata2['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('creator', '');
            let maptitle = JSON.stringify(mapdata2['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
            let mapdiff = JSON.stringify(mapdata2, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
            let mapcs = JSON.stringify(mapdata2, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
            let mapar = JSON.stringify(mapdata2, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
            let mapod = JSON.stringify(mapdata2, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
            let maphp = JSON.stringify(mapdata2, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
            let mapsr = JSON.stringify(mapdata2, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
            let mapbpm = JSON.stringify(mapdata2, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
            let mapcircle = JSON.stringify(mapdata2, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
            let mapslider = JSON.stringify(mapdata2, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
            let mapspinner = JSON.stringify(mapdata2, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', '');

(async () => {        


    let nochokeacc300 = Math.floor(300 * hit300s);
    let nochokeacc100 = Math.floor(100 * hit100s);
    let nochokeacc50 = Math.floor(50 * hit50s);
    let nochoke300num = parseInt(hit300s);
    let nochoke100num = parseInt(hit100s);
    let nochoke50num = parseInt(hit50s);
    let missnum = parseInt(misses);
    //let rsnochoke0num = parseInt(rs0s);
    let truaccbottom = Math.floor(300 * (nochoke300num + nochoke100num + nochoke50num + missnum));
    let nochokebottom1 = Math.floor(nochoke300num + nochoke100num + nochoke50num);
    let nochokebottom = Math.floor(nochokebottom1 * 300)
    let nochokeacctop = Math.floor(nochokeacc300 + nochokeacc100 + nochokeacc50)
    let nochokeacc1 = Math.abs(nochokeacctop / nochokebottom);
    let nochokeacc = Math.abs(nochokeacc1 * 100).toFixed(2);
    let trueacc = Math.abs((nochokeacctop / truaccbottom) * 100).toFixed(2);

        const score = {
            beatmap_id: beatmapid,
            score: '6795149',
            maxcombo: '630',
            count50: hit50s,
            count100: hit100s,
            count300: hit300s,
            countmiss: '0',
            countkatu: hitkatu,
            countgeki: hitgeki,
            perfect: '0',
            enabled_mods: '64',
            user_id: playerid,
            date: timeset,
            rank: 'S',
            score_id: '4057765057'
          }
          const scorenofc = {
            beatmap_id: beatmapid,
            score: '6795149',
            maxcombo: '630',
            count50: hit50s,
            count100: hit100s,
            count300: hit300s,
            countmiss: misses,
            countkatu: hitkatu,
            countgeki: hitgeki,
            perfect: '0',
            enabled_mods: '64',
            user_id: playerid,
            date: timeset,
            rank: 'S',
            score_id: '4057765057'
          }
          fs.writeFileSync("rsppcalc.json", JSON.stringify(score, null, 2));
                  let ppfc = new std_ppv2().setPerformance(score);
                  let pp =  new std_ppv2().setPerformance(scorenofc);
                  if(mods){
                    pp = new std_ppv2().setPerformance(scorenofc).setMods(`${mods}`)
                    ppfc = new std_ppv2().setPerformance(score).setMods(`${mods}`);
                }
                if(!mods){
                    pp = new std_ppv2().setPerformance(scorenofc).setMods('NM')
                    ppfc = new std_ppv2().setPerformance(score).setMods('NM');
                }
                let ppw = await pp.compute();
                let ppiffc1 = await ppfc.compute(nochokeacc);
                let ppiffc2 = JSON.stringify(ppiffc1['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                let ppiffcw = Math.abs(ppiffc2).toFixed(2).toString();
                let ppiffcfull = Math.abs(ppiffc2).toString(); //fc pp without filters
                let ppwtostring = JSON.stringify(ppw['total']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('total', '');
                let ppwrawtotal = ppw['total'];
                let ppww = Math.abs(ppwrawtotal).toFixed(2);
                let ppwfull = Math.abs(ppwrawtotal).toString(); //the pp without filters
                

        let Embed = new Discord.MessageEmbed()
        .setColor(0x462B71)
        .setTitle(`replay data`)
        //.setURL(`https://osu.ppy.sh/b/` + beatmapid)
        .setImage(mapbg)
        .addField('**SCORE INFO**', `[**${playername}**](https://osu.ppy.sh/u/${playername})\nScore set on ${bettertimeset}\n${hit300s}/${hit100s}/${hit50s}/${misses}\nCombo:**${maxcombo}** | ${trueacc}%`, true)
        .addField('**PP**', `${ppww}**pp**\n${ppiffcw}**pp** if ${nochokeacc}% FC`, true)
        .addField('**MAP**', `[${maptitle} [${mapdiff}]](https://osu.ppy.sh/b/${beatmapid}) mapped by ${mapper}`, false)
        .addField('**MAP DETAILS**', "CS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + "\n" + mapsr + "⭐ \n" +  mapbpm + "BPM \n<:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner, true)
        .setThumbnail(`https://a.ppy.sh/${playerid}`);
        message.reply({embeds: [Embed]})
})();
    })
} catch (error) {
    console.log(error)
    return message.reply('error - map does not exist or is a different version to the osu website')
}
    })
}       catch(error){
            message.channel.send("Error - 1")
            console.log(error)
        }
            })
        }        catch(error){
            message.channel.send("Error - 2")
            console.log(error)
        }
        }   catch(error){
            message.channel.send("Error - 3")
            console.log(error)
        }
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)