const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const ChartJsImage = require('chartjs-to-image');
const { osulogdir } = require('../logconfig.json')
const { getStackTrace } = require('../somestuffidk/log')

module.exports = {
    name: 'osu',
    description: '',
    async execute(userdatatags, interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        let pickeduserX = options.getString('user')
        if(!pickeduserX){
            try{
                findname = await userdatatags.findOne({ where: { name: interaction.member.user.id } });
                pickeduserX = findname.get('description')}
                catch (error) {
                }
        }
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - osu profile")
        fs.appendFileSync(osulogdir, "\n" + "category - osu")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "") 

        interaction.reply('getting data...')
        if(!pickeduserX) return interaction.channel.send("user ID required");
      
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
            fs.appendFileSync(osulogdir, "\n" + "writing data to osuauth.json")
            fs.appendFileSync(osulogdir, "\n" + "")
            
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
                let playerrank1 = JSON.stringify(osudata['statistics'], ['global_rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('global_rank', '');
                let playercountryrank1 = JSON.stringify(osudata['statistics'], ['country_rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('country_rank', '');
                let playercountry = JSON.stringify(osudata, ['country_code']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('country_code', '');
                let playerpp = JSON.stringify(osudata['statistics'], ['pp']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('pp', '');
                let playerplays = JSON.stringify(osudata['statistics'], ['play_count']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('play_count', '');
                let playerlevel = JSON.stringify(osudata['statistics']['level'], ['current']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('current', '');
                let playerlevelprogress = JSON.stringify(osudata['statistics']['level'], ['progress']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('progress', '');
               // let playerplaystyle = JSON.stringify(osudata, ['playstyle']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('playstyle', '');
                let playerstatus = osudata['is_online'];
                let playeraccuracy = JSON.stringify(osudata['statistics'], ['hit_accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('hit_accuracy', '').slice(0, 5);
                let playeracount = JSON.stringify(osudata['statistics']['grade_counts'], ['a']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('a', '');
                let playerscount = JSON.stringify(osudata['statistics']['grade_counts'], ['s']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('s', '');
                let playershcount = JSON.stringify(osudata['statistics']['grade_counts'], ['sh']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('sh', '');
                let playerxcount = JSON.stringify(osudata['statistics']['grade_counts'], ['ss']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ss', '');
                let playerxhcount = JSON.stringify(osudata['statistics']['grade_counts'], ['ssh']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('ssh', '');
                let playerjoined = JSON.stringify(osudata, ['join_date']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('join_date', '').slice(0, 10);
                let playerfollowers = JSON.stringify(osudata, ['follower_count']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('follower_count', '');
                let playerprevname = JSON.stringify(osudata, ['previous_usernames']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('previous_usernames', '').replaceAll('[', '').replaceAll(']', '');
                let playcountgraph1 = JSON.stringify(osudata.monthly_playcounts)//.replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('previous_usernames', '').replaceAll('[', '').replaceAll(']', '');
                //console.log(osudata.monthly_playcounts)
                let playcountgraph = JSON.parse(playcountgraph1)
                //let playerrank = JSON.stringify(osudata['statistics'], ['global_rank']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('global_rank', '');

                if(isNaN(playerrank1)){
                    playerrank1 = '---'
                }
                if(isNaN(playercountryrank1)){
                    playercountryrank1 = '---'
                }
                if(playercountryrank1 == 'null'){
                    playercountryrank1 == '---'
                }
                if(playerrank1 == 'null'){
                    playerrank1 == '---'
                }
                let playerrank = playerrank1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let playercountryrank = playercountryrank1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
                let playerflag = playercountry.toLowerCase();


                //
                let playerlast = JSON.stringify(osudata, ['last_visit']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replaceAll('last_visit', '').replaceAll('[', '').replaceAll(']', '');
                /*let fulltimeset = JSON.stringify(osudata, ['last_visit']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replaceAll('last_visit', '').replaceAll('[', '').replaceAll(']', '').slice(0, 18);
                let fulltimeset2 = JSON.stringify(osudata, ['last_visit']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replaceAll('last_visit', '').replaceAll('[', '').replaceAll(']', '').slice(0, 12);
                let fulltimeset3 = JSON.stringify(fulltimeset1).slice(12, 18)
                fs.appendFileSync(osulogdir, "\n" + playerlast)
                let fulltimeset4 = fulltimeset3.replace(/(..?)/g, '$1:').slice(0,-1)
                let fulltimeset5 = fulltimeset4.slice(1, 10)
                let fulltimeset = fulltimeset2 + fulltimeset5 + "Z"*/

                let playerlasttoint = new Date(playerlast)

                let currenttime = new Date()

                let minsincelastvis = (playerlasttoint - currenttime) / (1000 * 60);
                let minlastvisreform = Math.abs(minsincelastvis).toFixed(0);
                //let ww = Math.abs()
                    
                    let lastvishours = (Math.trunc(minlastvisreform/60)) % 24;
                    let lastvisminutes = minlastvisreform % 60;
                    let lastvisdays = Math.trunc((minlastvisreform/60)/24) % 30;
                    let lastvismonths = Math.trunc(minlastvisreform/60/24/30.437) % 12;
                    let lastvisyears = Math.trunc(minlastvisreform/525600); //(60/24/30/12)
                    //fs.appendFileSync(osulogdir, "\n" + minlastvisreform)
                    let minlastvisredo = (lastvisyears + "y " + lastvismonths + "m " +  lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
            if(lastvishours = 0) {
                minlastvisredo = (lastvisminutes + "m");
            } //check if under an hour
            if(lastvisdays = 0) {
                minlastvisredo = (lastvishours + "h " + lastvisminutes + "m");
            } //check if under an day
            if(lastvismonths = 0) {
                minlastvisredo = (lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
            } //check if under an month
            if(lastvisyears = 0) {
                minlastvisredo = (lastvismonths + "m " +  lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
            } //check if under an year
                    playcounts = ''
                    for(i = 0;i<playcountgraph.length;i++){
                        playcounts += osudata.monthly_playcounts[i].count + ','
                    }
                    playcounts = playcounts.split(',')
                    data = 'Start,'
                    for(i = 0;i<(playcountgraph.length - 2);i++){
                        data +=',' + osudata.monthly_playcounts[i].start_date
                    }
                    datacount = data.split(',')
                    const chart = new ChartJsImage();
                    chart.setConfig({
                        type: 'line',
                        data: {
                            labels: datacount,
                        datasets: [{
                          label: 'Monthly playcounts',
                          data: playcounts,
                          fill: false,
                          borderColor: 'rgb(75, 192, 192)',
                          borderWidth: 1,
                          pointRadius: 0
                        }],
                        },
                      });
                    chart.setBackgroundColor('color: rgb(0,0,0)')
    
                    //for some reason min and max values are ignored  
                    chart.toFile('./files/playcount.png').then(w => {
                let attachement = new Discord.MessageAttachment('./files/playcount.png', 'playcount.png')

                if(playerstatus == true ){
                    offlinestat = `**<:osu_online:927800818445455421> Online**`
                }
                if(playerstatus == false ){
                    offlinestat = `**<:osu_offline:927800829153513472> Offline** | Last online ${minlastvisredo} ago`
                }
                    let Embed = new Discord.MessageEmbed()
                    .setColor(0x6DDAFF)
                    .setTitle(`${playername}'s osu! profile`)
                    .setURL(`https://osu.ppy.sh/u/${playerid}`)
                    .setThumbnail(playeravatar)
                    .setDescription("**Global Rank:** " + playerrank + " (#" + playercountryrank + " " + playercountry + ` :flag_${playerflag}:)\n`+ playerpp + "**pp**\n**Accuracy:** " + playeraccuracy + "%\n**Level:** " + playerlevel + "+" + playerlevelprogress + "%\n**Playcount:** " + playerplays + `\n ${offlinestat}\n**Player joined on** ` + playerjoined + "\n**Followers:** " + playerfollowers + "\n**Previous names:** " + playerprevname + "\n<:rankingxh:927797179597357076>" + playerxhcount + " <:rankingX:927797179832229948>" + playerxcount + " <:rankingSH:927797179710570568>" + playershcount + " <:rankingS:927797179618295838>" + playerscount + " <:rankingA:927797179739930634>" + playeracount);
                    interaction.editReply({ content: '⠀', embeds: [Embed], files: ['./files/playcount.png']})
                    fs.appendFileSync(osulogdir, "\n" + "sent")
                    //interaction.editReply(mapbg1)
                    
                
            })
                
            } catch(error){
                    interaction.channel.send("Error - account not found (or some other error)")
                    fs.appendFileSync(osulogdir, "\n" + "Error account not found")
                    fs.appendFileSync(osulogdir, "\n" + error)
                    fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
                    console.log(error)
                    fs.appendFileSync(osulogdir, "\n" + "")
                    console.groupEnd()
                }
        });
        } catch(error){
            fs.appendFileSync(osulogdir, "\n" + error)
            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
            fs.appendFileSync(osulogdir, "\n" + "")
            console.log(err)
            console.groupEnd()
        } 
        
//        message.channel.send("I'm not an osu! bot. go use owobot or something")  
    }
}

//client.commands.get('').execute(message, args)