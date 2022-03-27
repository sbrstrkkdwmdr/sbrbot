//tsfm shorthand for - top score for map
const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
module.exports = {
    name: 'tsfm',
    description: '',
    async execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync('osu.log', "\n" + '--- COMMAND EXECUTION ---')
        let pickeduserX = args.splice(0,1000).join(" ");
        fs.appendFileSync('osu.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('osu.log', "\n" + "command executed - top score for map")
        let consoleloguserweeee = message.author
        fs.appendFileSync('osu.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('osu.log', "\n" + "") 
        if(!pickeduserX || pickeduserX == '' || pickeduserX == ' '){
            //console.log('pp')
            try{
                findname = await userdatatags.findOne({ where: { name: message.author.id } });
                pickeduserX = findname.get('description')}
                catch (error) {
                }
        }
        //if(!pickeduserX) return message.reply("user ID or username required");
        //if(isNaN(pickeduserX)){ //return message.reply("You must use ID e.g. 15222484 instead of SaberStrike")
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
                const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
                const { access_token } = require('../debug/osuauth.json');
            
            fetch(userinfourl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output1 => 
                {
                    fs.appendFileSync('osu.log', "\n" + "writing data to osuauth.json")
                    fs.appendFileSync('osu.log', "\n" + "")
                    
                try{const osudata = output1;
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
                .then(output2 => 
                    {
                        const mapscoredata = output2;
                        //let mapdataP2 = JSON.stringify("[\n" + mapdataP1 + "\n]");
                        //const mapdata = JSON.stringify("[\n" + mapdataP1 + "\n]");
                    fs.writeFileSync("debug/mapscore.json", JSON.stringify(mapscoredata, null, 2))
                    fs.appendFileSync('osu.log', "\n" + "writing data to mapscore.json")
                    fs.appendFileSync('osu.log', "\n" + "")
                    console.groupEnd()
                try{
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
                    .then(output3 => 
                        {
            const mapdata = output3;

            let mapbg = JSON.stringify(mapdata['beatmapset']['covers'], ['cover']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('cover', '').replace('https', 'https:');
            let mapdiff = JSON.stringify(mapdata, ['version']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('version', '');
            let mapartist = JSON.stringify(mapdata['beatmapset'], ['artist']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('artist', '');
            let mapmaxcombo = JSON.stringify(mapdata, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replace('}', '').replace(':', '').replace('max_combo', '');
            let mapcs = JSON.stringify(mapdata, ['cs']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('cs', '');
            let mapar = JSON.stringify(mapdata, ['ar']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ar', '');
            let mapod = JSON.stringify(mapdata, ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
            let maphp = JSON.stringify(mapdata, ['drain']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('drain', '');
            let mapsr = JSON.stringify(mapdata, ['difficulty_rating']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('difficulty_rating', '');
            let mapbpm = JSON.stringify(mapdata, ['bpm']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('bpm', '');
            let mapper = JSON.stringify(mapdata['beatmapset'], ['creator']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('creator', '');
            let maptitleuni = JSON.stringify(mapdata['beatmapset'], ['title_unicode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title_unicode', '');
            let maptitlenorm = JSON.stringify(mapdata['beatmapset'], ['title']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('title', '');
            let maptitle = maptitleuni
            if(maptitlenorm != maptitleuni){
                maptitle = `${maptitleuni}\n${maptitlenorm}`
            }
            
            for(i = 0; i < mapscoredata.scores.length; i++){
                let pp = JSON.stringify(mapscoredata['scores'][i], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '');
                let grade = JSON.stringify(mapscoredata['scores'][i], ['rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '');
                let combo = JSON.stringify(mapscoredata['scores'][i], ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
                let mods = JSON.stringify(mapscoredata['scores'][i], ['mods']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('mods', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                let acc = JSON.stringify(mapscoredata['scores'][i], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('accuracy', '');
                let mapscore0s = JSON.stringify(mapscoredata['scores'][i]['statistics'], ['count_miss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_miss', '');
                let mapscore50s = JSON.stringify(mapscoredata['scores'][i]['statistics'], ['count_50']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_50', '');
                let mapscore100s = JSON.stringify(mapscoredata['scores'][i]['statistics'], ['count_100']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_100', '');
                let mapscore300s = JSON.stringify(mapscoredata['scores'][i]['statistics'], ['count_300']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_300', '');
                let maptime = JSON.stringify(mapscoredata['scores'][i], ['created_at']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('created_at', '').slice(0, 10);
        
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
                if(!mods){
                    mods2 = ''
                }
                if(mods){
                    mods2 = '+' + mods
                }
                text = text + `**${i+1}**\n ${mods2} | ${maptime}\n**${(acc*100).toFixed(2)}%** | **${pp}**pp | **${grade}**\n${combo}x/**${mapmaxcombo}**x | ${mapscore300s}/${mapscore100s}/${mapscore50s}/${mapscore0s}\n\n`
            }
                    let Embed = new Discord.MessageEmbed()
                    .setTitle(`${mapartist} - ${maptitle}\n[${mapdiff}]`)
                    //.setThumbnail(`https://a.ppy.sh/${playerid}`)
                    .setURL('https://osu.ppy.sh/b/' + prevmap)
                    .setImage(`${mapbg}`)
                    .setAuthor(`${playername}'s scores on`, `https://a.ppy.sh/${playerid}`,`https://osu.ppy.sh/u/${playerid}`)
                    .setDescription(`${text}`)
                    .addField('map info', `${mapsr}⭐\nCS${mapcs} AR${mapar} OD${mapod} HP${maphp} ${mapbpm}BPM`, false)
                    //.setFooter(`${text}`)
                    message.reply({ embeds: [Embed]})
                       })
            } catch(error){
                    message.reply("Error - no data")
                    fs.appendFileSync('osu.log', "\n1" + error)
                    fs.appendFileSync('osu.log', "\n" + error.columnNumber)
                    //error.columnNumber 
                    fs.appendFileSync('osu.log', "\n" + "")
                    console.log(error)
                }
                });
            } catch(error){
                message.reply("Error - account not found")
                fs.appendFileSync('osu.log', "\n" + "Error account not found")
                fs.appendFileSync('osu.log', "\n" + error)
                fs.appendFileSync('osu.log', "\n" + "")
            }})
        }   catch(err){
                fs.appendFileSync('osu.log', "\n2" + err)
            }
        
    }
}
