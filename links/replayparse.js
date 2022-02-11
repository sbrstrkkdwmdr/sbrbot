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
        const replayPath = "./replays/replay.osr";
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
            const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/lookup?h=${maphash}`
(async () => {        
        const score = {
            beatmap_id: 2134,
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
            user_id: rsplayerid,
            date: timeset,
            rank: 'S',
            score_id: '4057765057'
          }
          const scorenofc = {
            beatmap_id: rsmapid,
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
            user_id: rsplayerid,
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

        let Embed = new Discord.MessageEmbed()
        .setColor(0x462B71)
        .setTitle("Information for replay (HEAVILY WIP)")
        //.setImage(mapbg)
        .setDescription(`***${playername}***\nScore set on ${timeset}\n${hit300s}/${hit100s}/${hit50s}/${misses}\nCombo:***${maxcombo}***`);
        message.reply({embeds: [Embed]})
})();
    }       catch(error){
            message.channel.send("Error - 1")
            console.log(error)
        }
            })
        }        catch(error){
            message.channel.send("Error - 1")
            console.log(error)
        }
        }   catch(error){
            message.channel.send("Error - 1")
            console.log(error)
        }
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)