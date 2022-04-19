const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const calc = require('ojsama');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const osuReplayParser = require('osureplayparser');
const ChartJsImage = require('chartjs-to-image');
const { linkfetchlogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')

module.exports = {
    name: 'replayparse',
    description: '',
    execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        try{
        fs.appendFileSync(linkfetchlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(linkfetchlogdir, "\n" + "link detector executed - replayparse")
        fs.appendFileSync(linkfetchlogdir, "\n" + "category - osu")
        let consoleloguserweeee = message.author
        fs.appendFileSync(linkfetchlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(linkfetchlogdir, "\n" + "");
        const replayPath = "./files/replay.osr";
        const replay = osuReplayParser.parseReplay(replayPath);
        fs.writeFileSync("debug/replay.json", JSON.stringify(replay, null, 2))

        let lifebar = JSON.stringify(replay, ['life_bar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('life_bar', '');
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
                fs.appendFileSync(linkfetchlogdir, "\n" + "writing data to osu.json")
                fs.appendFileSync(linkfetchlogdir, "\n" + "")
                console.groupEnd() 
                
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');


            const mapurlold = ` https://osu.ppy.sh/api/get_beatmaps?k=${osuapikey}&h=${maphash}`
            const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/lookup?k=${osuapikey}&checksum=${maphash}`
            //fs.appendFileSync(linkfetchlogdir, "\n" + maphash)
            fetch(mapurl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            .then(res => res.json())
            .then(output3 => {
                const mapdata = output3;
                //fs.appendFileSync(linkfetchlogdir, "\n" + mapdata)
                fs.writeFileSync("debug/map.json", JSON.stringify(mapdata, null, 2))
                fs.appendFileSync(linkfetchlogdir, "\n" + "writing data to map.json")
                fs.appendFileSync(linkfetchlogdir, "\n" + "")
            try{
            let beatmapid = JSON.stringify(mapdata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
            let mapbg = JSON.stringify(mapdata['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
            let mapper = JSON.stringify(mapdata['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('creator', '');
            let mapperlink = JSON.stringify(mapper).replaceAll(' ', '%20').replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '')
            let maptitle = JSON.stringify(mapdata['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
            let maptitlenormal = JSON.stringify(mapdata['beatmapset'], ['title']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title', '');
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
           
            fullmaptitle = `${maptitle}`
            if(maptitle != maptitlenormal){
            fullmaptitle = `${maptitle} \n${maptitlenormal}`
            }
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
        mapdiff: mapdiff,
        mapid: beatmapid
    }
    fs.writeFileSync('replaydata.json', JSON.stringify(re, null, 2))
    modenum = 0
    let cpolmods = mods.toLowerCase();
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

    let cpolpp = `https://pp.osuck.net/pp?id=${beatmapid}&mods=${mods}&combo=${maxcombo}&miss=0&acc=${trueacc}`
    //fs.appendFileSync(osulogdir, "\n" + cpolpp)

    fetch(cpolpp, {
    }).then(res => res.json())
    .then(output4 => {
        fs.writeFileSync('cpolppcalc.json', JSON.stringify(output4, null, 2))
        let cppSS = JSON.stringify(output4['pp']['acc'], ['100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('100', '');
        let cpp95 = JSON.stringify(output4['pp']['acc'], ['95']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('95', '');
        let clength = JSON.stringify(output4['stats']['time'], ['full']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('full', '');
        cpp = JSON.stringify(output4['pp'], ['current']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('current', '');
        cppfc = JSON.stringify(output4['pp'], ['fc']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('fc', '');
        SRclean = JSON.stringify(output4['stats']['star'], ['pure']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pure', '');
        let cmods = JSON.stringify(output4['mods'], ['name']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('name', '');
        let cmodbpm = JSON.stringify(output4['stats']['bpm'], ['max']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max', '');
        
        if(cppfc != cpp){
            pptotalthingy = `${cpp}**pp**\n${cppfc}**pp** if ${nochokeacc}% FC`
        }
        if(cppfc == cpp){
            pptotalthingy = `${cpp}**pp** FC`
        }
        modsifthere = ''
        if(!cmods == 'NoMod'){
            modsifthere = `+${cmods}`
        }
        if(cmods == 'NoMod'){
            modsifthere = ''
        }
                lifebar2 = (lifebar.replaceAll('|', ' ')).split(/ +/)
                //fs.appendFileSync(linkfetchlogdir, "\n" + lifebar2)
                lifebarFULL1 = ''
                for(i = 1; i < (lifebar2.length - 1); i++){
                    text = lifebar2[i]
                    lifebarFULL1 += text.substring(0, text.indexOf(',')) + " "
                }
                lifebarFULL2 = lifebarFULL1.split(/ +/).map(function(item) {
                    return Math.floor(parseFloat(item, 10) * 100);
                });
                lifebarFULLEND = lifebarFULL2.pop()
                lifebarFULL = lifebarFULL2
                fs.appendFileSync(linkfetchlogdir, "\n" + lifebarFULL)
                data = 'Start,'
                for(i = 0;i<(lifebarFULL.length - 2);i++){
                    data +=', '
                }
                data += 'Finish'
                datacount = data.split(',')

                const chart = new ChartJsImage();
                                chart.setConfig({
                                    type: 'line',
                                    data: {
                                        labels: datacount,
                                    datasets: [{
                                      label: 'Health',
                                      data: lifebarFULL,
                                      fill: false,
                                      borderColor: 'rgb(75, 192, 192)',
                                      borderWidth: 1,
                                      pointRadius: 0
                                    }],
                                    },
                                  });
                                  chart.setBackgroundColor('color: rgb(0,0,0)')
                                //for some reason min and max values are ignored  
                                chart.toFile('./files/replayhealth.png').then(w => {
        let attachement = new Discord.MessageAttachment('./files/replayhealth.png', 'replayhealth.png')
        let Embed = new Discord.MessageEmbed()
        .setColor(0x462B71)
        .setTitle(`replay data`)
        //.setURL(`https://osu.ppy.sh/b/` + beatmapid)
        .setImage('attachment://files/replayhealth.png')
        .setThumbnail(mapbg)
        .addField('**SCORE INFO**', `[**${playername}**](https://osu.ppy.sh/u/${playerid})\nScore set on ${bettertimeset}\n${hit300s}/${hit100s}/${hit50s}/${misses}\nCombo:**${maxcombo}** | ${trueacc}%`, true)
        .addField('**PP**', `${pptotalthingy}`, true)
        .addField('**MAP**', `[${fullmaptitle} \n[${mapdiff}]](https://osu.ppy.sh/b/${beatmapid}) ${modsifthere} mapped by [${mapper}](https://osu.ppy.sh/u/${mapperlink})`, false)
        .addField('**MAP DETAILS**', "CS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + "\n" + mapsr + "⭐ \n" +  cmodbpm + "BPM \n<:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner, false)
        .setThumbnail(`https://a.ppy.sh/${playerid}`);
        message.reply({embeds: [Embed], files: ['./files/replayhealth.png']})
    })
})
    //})//mapdata2
} catch (error) {
    fs.appendFileSync(linkfetchlogdir, "\n" + error)
    fs.appendFileSync(linkfetchlogdir, "\n" + getStackTrace(error))
    message.reply('error - map does not exist or is a different version to the osu website')
    console.log(error)
}
    })
}       catch(error){
            message.channel.send("Error - 1")
            fs.appendFileSync(linkfetchlogdir, "\n" + error)
            fs.appendFileSync(linkfetchlogdir, "\n" + getStackTrace(error))
        }
            })
        }        catch(error){
            message.channel.send("Error - 2")
            fs.appendFileSync(linkfetchlogdir, "\n" + error)
            fs.appendFileSync(linkfetchlogdir, "\n" + getStackTrace(error))
        }
    }
}
//client.commands.get('').execute(message, args)