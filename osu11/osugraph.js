const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const ChartJsImage = require('chartjs-to-image');
const { osulogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')


module.exports = {
    name: 'osugraph',
    description: 'e',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        const pickeduserX = args.splice(0,1000).join(" ");
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - osu graph")
        let consoleloguserweeee = message.author
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "") 
        if(!pickeduserX) return message.reply("user ID required");
        //if(isNaN(pickeduserX)) return message.reply("You must use ID e.g. 15222484 instead of SaberStrike")
            
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
                fs.appendFileSync(osulogdir, "\n" + "writing data to osu.json")
                fs.appendFileSync(osulogdir, "\n" + "")
                console.groupEnd()
                let playername = JSON.stringify(osudata, ['username']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('username', '');
                let playerid = JSON.stringify(osudata, ['id']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('id', '');
                let playeravatar = JSON.stringify(osudata, ['avatar_url']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('avatar_url', '').replaceAll('https', 'https:');
                //let playerranks = JSON.stringify(osudata['rankHistory'], ['data']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('data', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
                // let playerranks = JSON.stringify(osudata['rankHistory'], ['data']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('data', '').replaceAll('[', '').replaceAll(']', '');
                //let playerrank0 = JSON.stringify(osudata['rankHistory']['data'][0]).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('data', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');

                let playerranks = osudata['rankHistory']['data'];
                let playerrankschronological = playerranks.reverse();
                let playerranksredo = playerrankschronological.map(function(x) {
                    return parseInt(x, 10)
                })

                let playerrankminval = Math.min(playerranksredo);

                fs.appendFileSync(osulogdir, "\n" + playerrankminval)

                playerranksredo.map(function(element){
                    return element - playerrankminval;
                 });

                let playerworstrank = Math.abs((playerranksredo[0]) + 10);
                let playerbestrank = Math.abs((playerranks[0]) - 10);

                //fs.appendFileSync(osulogdir, "\n" + playerrankschronological)
                //console.log


               
                  /*const graphconfig = {
                    type: 'line',
                    data: graphdata,
                  };*/
//                fs.appendFileSync(osulogdir, "\n" + playerrank0)
                const chart = new ChartJsImage();
                chart.setConfig({
                    type: 'line',
                    data: {
                        labels: ['90 days ago', '60 days ago', '30 days ago', 'Today'],
                    datasets: [{
                      label: 'Rank',
                      data: playerranksredo,
                      fill: false,
                      borderColor: 'rgb(75, 192, 192)',
                    }],
                    options: {
                        scales: {
                            type: 'linear',
                            alignToPixels: false,
                            backgroundColor: '#000',
                            display: true,
                            min: playerworstrank,
                            max: playerbestrank,
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
                //fs.appendFileSync(osulogdir, "\n" + graphasimg)

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
                    fs.appendFileSync(osulogdir, "\n" + "Error account not found")
                    fs.appendFileSync(osulogdir, "\n" + error)
                    fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                    fs.appendFileSync(osulogdir, "\n" + "")
                    
                }
        });
        
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}

//client.commands.get('').execute(message, args)