const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const calc = require('ojsama');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const osuReplayParser = require('osureplayparser');
module.exports = {
    name: 'replayrecordv2',
    description: '',
    execute(exec, linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        try{
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("link detector executed - replayparse")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("");
        const replayPath = "./files/replay.osr";
        const replay = osuReplayParser.parseReplay(replayPath);
        fs.writeFileSync("debug/replay.json", JSON.stringify(replay, null, 2))

        let maphash = JSON.stringify(replay, ['beatmapMD5']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmapMD5', '');
        let playername = JSON.stringify(replay, ['playerName']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('playerName', '');
        let timeset = JSON.stringify(replay, ['timestamp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('timestamp', '');
        let maxcombo = JSON.stringify(replay, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
        let hit300s = JSON.stringify(replay, ['number_300s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_300s', '').replaceAll('-', '');
        let hit100s = JSON.stringify(replay, ['number_100s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_100s', '');
        let hit50s = JSON.stringify(replay, ['number_50s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_50s', '');
        let misses = JSON.stringify(replay, ['misses']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('misses', '');
        let hitkatu = JSON.stringify(replay, ['katus']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('katus', '');
        let hitgeki = JSON.stringify(replay, ['gekis']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('gekis', '');
        let mods = JSON.stringify(replay, ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '');
        let bettertimeset = JSON.stringify(replay, ['timestamp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('timestamp', '').slice(0, 10);
        let gamemode = JSON.stringify(replay, ['gameMode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('gameMode', '')

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
            
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${playername}/osu`;
            
            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output2 => 
                {
                try{const osudata = output2;
                fs.writeFileSync("debug/osu.json", JSON.stringify(osudata, null, 2));
                console.log("writing data to osu.json")
                console.log("")
                console.groupEnd() 
                
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');


            const mapurlold = ` https://osu.ppy.sh/api/get_beatmaps?k=${osuapikey}&h=${maphash}`
            const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/lookup?k=${osuapikey}&checksum=${maphash}`
            //console.log(maphash)
            fetch(mapurl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            .then(res => res.json())
            .then(output3 => {
                const mapdata = output3;
                //console.log(mapdata)
                fs.writeFileSync("debug/map.json", JSON.stringify(mapdata, null, 2))
                console.log("writing data to map.json")
                console.log("")
            try{
            let beatmapid = JSON.stringify(mapdata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
            let mapbg = JSON.stringify(mapdata['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
            let mapper = JSON.stringify(mapdata['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('creator', '');
            let mapperlink = JSON.stringify(mapper).replaceAll(' ', '%20').replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '')
            let maptitle = JSON.stringify(mapdata['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
            let mapdiff = JSON.stringify(mapdata, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
            let mapcs = JSON.stringify(mapdata, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
            let mapar = JSON.stringify(mapdata, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
            let mapod = JSON.stringify(mapdata, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
            let maphp = JSON.stringify(mapdata, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
            let mapsr = JSON.stringify(mapdata, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
            let mapbpm = JSON.stringify(mapdata, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
            let mapcircle = JSON.stringify(mapdata, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
            let mapslider = JSON.stringify(mapdata, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
            let mapspinner = JSON.stringify(mapdata, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', '');
            /*const mapurl2 = `https://osu.ppy.sh/api/v2/beatmaps/${beatmapid}`
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
            let mapperlink = JSON.stringify(mapper).replaceAll(' ', '%20')
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
*/
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

    const re = {
        playername: playername,
        trueacc: trueacc,
        maptitle: maptitle,
        mapdiff: mapdiff
    }
    fs.writeFileSync('replaydata.json', JSON.stringify(re, null, 2))

        const score = {
            beatmap_id: beatmapid,
            score: '6795149',
            maxcombo: '630',
            count50: hit50s,
            count100: hit100s,
            count300: hit300s,
            countmiss: '0',
            countkatu: '0',
            countgeki: '0',
            perfect: '0',
            enabled_mods: '0',
            user_id: '15222484',
            date: '2022-02-08 05:24:54',
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
            countkatu: '0',
            countgeki: '0',
            perfect: '0',
            enabled_mods: '0',
            user_id: '15222484',
            date: '2022-02-08 05:24:54',
            rank: 'A',
            score_id: '4057765057'
          }
          fs.writeFileSync("debug/rsppcalc.json", JSON.stringify(score, null, 2));
                  //let ppfc = new std_ppv2().setPerformance(score);
                  //let pp =  new std_ppv2().setPerformance(scorenofc);
                  if(gamemode == '0'){
                    pp = new std_ppv2().setPerformance(scorenofc)
                    ppfc = new std_ppv2().setPerformance(score)
                }
                if(gamemode == '1'){
                    pp = new taiko_ppv2().setPerformance(scorenofc)
                    ppfc = new taiko_ppv2().setPerformance(score)
                }
                if(gamemode == '2'){
                    pp = new catch_ppv2().setPerformance(scorenofc)
                    ppfc = new catch_ppv2().setPerformance(score)
                }
                if(gamemode == '3'){
                    pp = new mania_ppv2().setPerformance(scorenofc)
                    ppfc = new mania_ppv2().setPerformance(score)
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

                let currentDatefileformat = JSON.stringify(currentDate).replaceAll(':', ';').replaceAll('|', '').replaceAll('{', '').replaceAll('"', '').replaceAll('}', '')
                //console.log(currentDatefileformat)
                
            
                let output1 = `${playername}s play at ${bettertimeset} - ${maptitle}[${mapdiff}] - ${ppww}pp - ${ppiffcw} if ${nochokeacc} FC`;
                let output = JSON.stringify(output1).replaceAll(' ', '_').replaceAll('|', '').replaceAll('{', '').replaceAll('"', '').replaceAll('}', '');
                //console.log(output)
                exec('C:/Users/saber/Desktop/danser-go-dev/danser-go-dev-OTHERS/danser.exe -skip -settings=' + linkargs + ' -r="C:/Users/saber/Desktop/kusa/bot/sbrbot/files/replay.osr" -out=' + output)
                console.group('--- COMMAND EXECUTION ---')
                console.log(`${currentDateISO} | ${currentDate}`)
                console.log("command executed - replayrecord")
                console.log("category - osu")
                let consoleloguserweeee = message.author
                console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                console.log("")
                console.groupEnd()
                message.channel.send('retrieving osr')
})();
    //})//mapdata2
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
            message.channel.send("Error - 3\nmap doesn't exist or isn't available")
            console.log(error)
        }
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)