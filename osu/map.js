const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { calculateStarRating } = require('osu-sr-calculator')
const { osulogdir } = require('../logconfig.json')

module.exports = {
    name: 'map',
    description: '',
    execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        let mapid = options.getNumber('id')
        let mods = options.getString('mods')
        if(!mods){
            mods = 'NM'
        }
        let { prevmap } = require('../debug/storedmap.json');
        if(!mapid){
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${prevmap}`
        }
        if(mapid){
            mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}`
        }
        const modsarray = ["EZ", "NF", "HT", "HR", "SD", "PF", "DT", "NC", "HD", "FL", "RX", "AP", "SO", "TD", "NM"];
        if(modsarray.some(v => mods.includes(v))){
            moddetect = mods
        }
        if(!mods || !modsarray.some(v => mods.includes(v))){
            moddetect = 'NM'
        }
        interaction.reply('getting data...')
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - map get")
        fs.appendFileSync(osulogdir, "\n" + "category - osu")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "") 
        
        try {
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
            fs.appendFileSync(osulogdir, "\n" + "writing data to osuauth.json")
            fs.appendFileSync(osulogdir, "\n" + "")
            try{
            const { access_token } = require('../debug/osuauth.json');
            
            fetch(mapurl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            }).then(res => res.json())
            .then(output2 => 
                {
					const mapdata = output2;
					//let mapdataP2 = JSON.stringify("[\n" + mapdataP1 + "\n]");
					//const mapdata = JSON.stringify("[\n" + mapdataP1 + "\n]");
                fs.writeFileSync("debug/map.json", JSON.stringify(mapdata, null, 2))
                fs.appendFileSync(osulogdir, "\n" + "writing data to map.json")
                fs.appendFileSync(osulogdir, "\n" + "")
            try{
            let mapbg = JSON.stringify(mapdata['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');;
            let maplink = JSON.stringify(mapdata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
            let mapsetlink = JSON.stringify(mapdata, ['beatmapset_id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('beatmapset_id', '');
            let mapcs = JSON.stringify(mapdata, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
            let mapar = JSON.stringify(mapdata, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
            let mapod = JSON.stringify(mapdata, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
            let maphp = JSON.stringify(mapdata, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
            let mapsr = JSON.stringify(mapdata, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
            let mapbpm = JSON.stringify(mapdata, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
            
            let mapcsNM = JSON.stringify(mapdata, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
            let maparNM = JSON.stringify(mapdata, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
            let mapodNM = JSON.stringify(mapdata, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
            let maphpNM = JSON.stringify(mapdata, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
            let mapsrNM = JSON.stringify(mapdata, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
            let mapbpmNM = JSON.stringify(mapdata, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
            
            let mapcircle = JSON.stringify(mapdata, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
            let mapslider = JSON.stringify(mapdata, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
            let mapspinner = JSON.stringify(mapdata, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', '');
            let mapper = JSON.stringify(mapdata['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('creator', '');
            let maptitleuni = JSON.stringify(mapdata['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
            let maptitlenorm = JSON.stringify(mapdata['beatmapset'], ['title']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title', '');
            let maptitle = maptitleuni
            if(maptitlenorm != maptitleuni){
                maptitle = `${maptitleuni}\n${maptitlenorm}`
            }
            
            let mapdiff = JSON.stringify(mapdata, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
            let mapartist = JSON.stringify(mapdata['beatmapset'], ['artist']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('artist', '');
            let mapmaxcombo = JSON.stringify(mapdata, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('max_combo', '');
            let maplength = JSON.stringify(mapdata, ['total_length']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('total_length', '');
            let maphitonly = JSON.stringify(mapdata, ['hit_length']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('hit_length', '');
            let mapmode = JSON.stringify(mapdata, ['mode']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('mode', '');
            let mapperlink = JSON.stringify(mapper).replaceAll(' ', '%20').replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '');

            let maphit1 = Math.floor(maphitonly / 60);
            let maphit2 = Math.abs(maphitonly % 60);
            if(maphit2<10){
                maphit2 = '0' + maphit2
            }
            if(maphit2==0){
                maphit2 = '00'
            }
            let mapplaylength = maphit1 + ':' + maphit2;
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

            let mapstatus = JSON.stringify(mapdata, ['status']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('status', '');
            statusimg = '<:statusgraveyard:944512765282897940>'
            if(mapstatus == 'ranked'){
                statusimg = '<:statusranked:944512775579926609>';
            }
            if(mapstatus == 'approved' || mapstatus == 'qualified'){
                statusimg = '<:statusapproved:944512764913811467>'
            }
            if(mapstatus == 'loved'){
                statusimg = '<:statusloved:944512775810588733>'
            }
            if(mapstatus == 'graveyard' || mapstatus == 'pending' || mapstatus == 'wip'){
                statusimg = '<:statusgraveyard:944512765282897940>'
            }
            if(mapmode == 'osu'){
                mapimg = '<:modeosu:944181096868884481>'
            }
            if(mapmode == 'taiko'){
                mapimg = '<:modetaiko:944181097053442068>'
            }
            if(mapmode == 'fruits'){
                mapimg = '<:modefruits:944181096206176326>'
            }
            if(mapmode == 'mania'){
            mapimg = '<:modemania:944181095874834453>'
            }

            let mapid = Math.abs(maplink)
            const fileName = 'debug/storedmap.json';
            const file = require('../debug/storedmap.json');  
            file.prevmap = maplink;
            fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                if (err) return fs.appendFileSync(osulogdir, "\n" + err);
                fs.appendFileSync(osulogdir, "\n" + JSON.stringify(file));
                fs.appendFileSync(osulogdir, "\n" + 'writing to ' + fileName);
                fs.appendFileSync(osulogdir, "\n" + "");
                console.groupEnd()
              });//all this stuff is to write it to a temporary save file
                
                modenum = 0
                let cpolmods = moddetect.toLowerCase();
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
    
                let cpolpp = `https://pp.osuck.net/pp?id=${mapid}&mods=${modenum}&combo=${mapmaxcombo}&miss=0&acc=100`
                //fs.appendFileSync(osulogdir, "\n" + cpolpp)
    
                fetch(cpolpp, {
                }).then(res => res.json())
                .then(output4 => {
                    fs.writeFileSync('cpolppcalc.json', JSON.stringify(output4, null, 2))
                    let cppSS = JSON.stringify(output4['pp']['acc'], ['100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('100', '');
                    let cpp95 = JSON.stringify(output4['pp']['acc'], ['95']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('95', '');
                    let clength = JSON.stringify(output4['stats']['time'], ['full']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('full', '');
                    let cmodbpm = JSON.stringify(output4['stats']['bpm'], ['max']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max', '');
                    let cmodcs = JSON.stringify(output4['stats'] ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
                    let cmodar = JSON.stringify(output4['stats'] ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
                    let cmodod = JSON.stringify(output4['stats'] ['od']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('od', '');
                    let cmodhp = JSON.stringify(output4['stats'] ['hp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('hp', '');
                    SRclean = JSON.stringify(output4['stats']['star'], ['pure']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pure', '');
                    clengthseconds = clength % 60
                    if(clengthseconds < 10){
                        clengthseconds = '0' + clengthseconds
                    }
                    clengthminutes = Math.floor(clength / 60)
                    recordedmaplength = clengthminutes + ':' + clengthseconds
                if(moddetect == 'NM'){
                    maptitle = `${mapartist} - ${maptitle} [${mapdiff}]`
                }
                if(moddetect != 'NM'){
                    maptitle = `${mapartist} - ${maptitle} [${mapdiff}] +${moddetect}`
                }
                let userinfourl = `https://osu.ppy.sh/api/v2/users/${mapperlink}/osu`
            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output3 => {

            let mapperid = JSON.stringify(output3, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
            let Embed = new Discord.MessageEmbed()
            .setColor(0x91FF9A)
            .setTitle(`${maptitle}`)
            .setAuthor(`${mapper}`, `https://a.ppy.sh/${mapperid}`,`https://osu.ppy.sh/u/${mapperlink}`)
            .setURL(`https://osu.ppy.sh/b/${maplink}`)
            .setImage(mapbg)
            //.setDescription(`[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper + "\n\nCS" + mapcs + " AR" + mapar + " OD" + mapod + " HP" + maphp + " | " + mapsr + "⭐ \n" +  mapbpm + "BPM | <:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\n\n--**PP VALUES**--\nSS: ${ppSS} | 95: ${pp95} \n\n**DOWNLOAD**\n[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`);
            //.addField('', `[${mapartist} - ` + maptitle + ` [${mapdiff}]](https://osu.ppy.sh/b/` + maplink + `)\n mapped by `+ mapper)
            .addField('**MAP DETAILS**', `${statusimg} | ${mapimg} \n` + "CS" + cmodcs + " AR" + cmodar + " OD" + cmodod + " HP" + cmodhp + "\n" + SRclean + "⭐ \n" +  mapbpm + "BPM \n<:circle:927478586028474398>" +  mapcircle + " <:slider:927478585701330976>" +  mapslider + " 🔁" +  mapspinner + `\n🕐${recordedmaplength}`, true)
            .addField('**PP VALUES**', `\n**SS:** ${cppSS} \n**95:** ${cpp95}`, true)
            .addField('**DOWNLOAD**', `[Bancho](https://osu.ppy.sh/beatmapsets/` + mapsetlink + `/download) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}?n=1) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.moe/d/${mapsetlink})\n\n[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${maplink})`, true)
            interaction.editReply({ content: '⠀', embeds: [Embed]})
            fs.appendFileSync(osulogdir, "\n" + "sent")
            })
              })
    } catch(error){
				interaction.editReply("error")
				fs.appendFileSync(osulogdir, "\n" + error)
				fs.appendFileSync(osulogdir, "\n" + "")
                console.groupEnd()
                console.groupEnd()
                console.groupEnd()
			}
            });
        } catch(error){
            fs.appendFileSync(osulogdir, "\n" + error)
            console.groupEnd()
            console.groupEnd()
            console.groupEnd()
        } } catch(error) {
            fs.appendFileSync(osulogdir, "\n" + error)
            console.groupEnd()
            console.groupEnd()
            console.groupEnd()
        }
        
    }
}
//client.commands.get('').execute(message, args)