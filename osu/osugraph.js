const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const ChartJsImage = require('chartjs-to-image');
module.exports = {
    name: 'osugraph',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,) {
        console.group('--- COMMAND EXECUTION ---')
        const pickeduserX = args.splice(0,1000).join(" ");
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - osu graph")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        if(!pickeduserX) return message.reply("user ID required");
        //if(isNaN(pickeduserX)) return message.reply("You must use ID e.g. 15222484 instead of SaberStrike")
      
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
            
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;
            
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
                let playername = JSON.stringify(osudata, ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                let playeravatar = JSON.stringify(osudata, ['avatar_url']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('avatar_url', '').replaceAll('https', 'https:');
                //let playerranks = JSON.stringify(osudata['rankHistory'], ['data']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('data', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                // let playerranks = JSON.stringify(osudata['rankHistory'], ['data']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('data', '').replaceAll('[', '').replaceAll(']', '');
                //let playerrank0 = JSON.stringify(osudata['rankHistory']['data'][0]).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('data', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');

                let playerranks = osudata['rankHistory']['data'];
                let playerrankschronological = playerranks.reverse();

                let playerworstrank = Math.abs((playerrankschronological[0]) + 10);
                let playerbestrank = Math.abs((playerranks[0]) - 10);

                //console.log(playerrankschronological)
                //console.log


               
                  /*const graphconfig = {
                    type: 'line',
                    data: graphdata,
                  };*/
//                console.log(playerrank0)
                const chart = new ChartJsImage();
                chart.setConfig({
                    type: 'line',
                    data: {
                        labels: ['90 days ago', '60 days ago', '30 days ago', 'Today'],
                    datasets: [{
                      label: 'Rank',
                      data: playerrankschronological,
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                    }],
                    options: {
                        scales: {
                            type: 'linear',
                            alignToPixels: false,
                            backgroundColor: '#000',
                            display: true,
                            //min: playerworstrank,
                            //max: playerbestrank
                            grace: 5,
                            beginAtZero: false,
                            weight: 1,
                            /* y: {
                                type: 'linear',
                                alignToPixels: false,
                                backgroundColor: '#000',
                                display: true,
                                //min: playerworstrank,
                                //max: playerbestrank
                                grace: 5,
                                beginAtZero: false,
                                weight: 1
                            } */
                    }
                }
                    },
                  });

                //for some reason min and max values are ignored  
                chart.toFile('./files/mychart.png').then(w => {
                //console.log(graphasimg)

                let Embed = new Discord.MessageEmbed()
                .setColor(0x462B71)
                .setTitle(`${playername}'s osu! profile graph`)
                .setURL(`https://osu.ppy.sh/u/${playerid}`)
                .setThumbnail(playeravatar)
                //.attachFiles(['./chart/mychart.png'])

                message.reply({ embeds: [Embed], files: ['./files/mychart.png']})
            })
                
            } catch(error){
                    message.reply("Error - account not found (or some other error)")
                    console.log("Error account not found")
                    console.log(error)
                    console.log("")
                    
                }
        });
        } catch(err){
            console.log(err)
        } 
        
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}

//client.commands.get('').execute(message, args)