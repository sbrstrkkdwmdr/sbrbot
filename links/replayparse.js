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

        let playername = JSON.stringify(replay, ['playerName']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('playerName', '');
        let timeset = JSON.stringify(replay, ['timestamp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('timestamp', '');
        let maxcombo = JSON.stringify(replay, ['max_combo']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('max_combo', '');
        let hit300s = JSON.stringify(replay, ['number_300s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_300s', '');
        let hit100s = JSON.stringify(replay, ['number_100s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_100s', '');
        let hit50s = JSON.stringify(replay, ['number_50s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('number_50s', '');
        let misses = JSON.stringify(replay, ['misses']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('misses', '');
        
        let Embed = new Discord.MessageEmbed()
        .setColor(0x462B71)
        .setTitle("Information for replay")
        //.setImage(mapbg)
        .setDescription(`***${playername}***\nScore set on ${timeset}\n${hit300s}/${hit100s}/${hit50s}/${misses}\nCombo:***${maxcombo}***`);
        message.reply({embeds: [Embed]})
        //console.log(replay);
        /*try{
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
            const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${pickeduserX}`;
            
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
                fs.writeFileSync("map.json", JSON.stringify(mapdata, null, 2))
            try{
            fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
                if (err) return console.log(err);
                console.log(JSON.stringify(file));
                console.log('writing to ' + fileName);
              });

            let Embed = new Discord.MessageEmbed()
            .setColor(0x462B71)
            .setTitle("Information for " + maptitle)
            .setImage(mapbg)
            .setDescription(``);
            message.reply({ embeds: [Embed]})
            
    } catch(error){
				message.reply("error - map not found")
				console.log(error)
				console.log("")
			}
			
			
		
            });
        } catch(error){
            console.log(error)
            message.channel.send("Error - 2")
        }*/
    } 
        
        catch(error){
            message.channel.send("Error - 1")
            console.log(error)
        }
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)