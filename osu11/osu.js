const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../debug/osuauth.json');
const { osulogdir } = require('../logconfig.json')
//                fs.appendFileSync(osulogdir, "\n" + error)
const { getStackTrace } = require('../somestuffidk/log')


module.exports = {
    name: 'osu',
    description: '',
    async execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        let pickeduserX = args.splice(0, 1000).join(" ");
        if (!pickeduserX) {
            try {
                findname = await userdatatags.findOne({ where: { name: message.author.id } });
                pickeduserX = findname.get('description')
            }
            catch (error) {
            }
        }
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - osu profile")
        let consoleloguserweeee = message.author
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "")
        //if(isNaN(pickeduserX)) return message.reply("You must use ID e.g. 15222484 instead of SaberStrike")
        const userinfourl = `https://osu.ppy.sh/api/v2/users/${pickeduserX}/osu`;

        fetch(userinfourl, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.json())
            .then(output2 => {
                try {
                    const osudata = output2;
                    fs.writeFileSync("debug/osu.json", JSON.stringify(osudata, null, 2));
                    fs.appendFileSync(osulogdir, "\n" + "writing data to osu.json")
                    fs.appendFileSync(osulogdir, "\n" + "")
                    console.groupEnd()
                    let playername = (osudata.username)
                    let playerid = (osudata.id)
                    let playeravatar = (osudata.avatar_url)
                    let playerrank1 = (osudata.statistics.global_rank)
                    let playercountryrank1 = (osudata.statistics.country_rank)
                    let playercountry = (osudata.country_code)
                    let playerpp = (osudata.statistics.pp)
                    let playerplays = (osudata.statistics.play_count)
                    let playerlevel = (osudata.statistics.level.current)
                    let playerlevelprogress = (osudata.statistics.level.progress)
                    // let playerplaystyle = (osudata.playstyle).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('playstyle', '');
                    let playerstatus = (osudata.is_online);
                    let playeraccuracy = (osudata.statistics.hit_accuracy).toString().slice(0, 5);
                    let playeracount = (osudata.statistics.grade_counts.a)
                    let playerscount = (osudata.statistics.grade_counts.s)
                    let playershcount = (osudata.statistics.grade_counts.sh)
                    let playerxcount = (osudata.statistics.grade_counts.ss)
                    let playerxhcount = (osudata.statistics.grade_counts.ssh)
                    let playerjoined = (osudata.join_date).toString().slice(0, 10);
                    let playerfollowers = (osudata.follower_count)
                    let playerprevname = (osudata.previous_usernames).toString().replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').replaceAll(",", ', ')
                    let playcountgraph1 = (osudata.monthly_playcounts)//.replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('previous_usernames', '').replaceAll('[', '').replaceAll(']', '');
                    //console.log(osudata.monthly_playcounts)
                    let playcountgraph = (playcountgraph1)

                    if (isNaN(playerrank1)) {
                        playerrank1 = '---'
                    }
                    if (isNaN(playercountryrank1)) {
                        playercountryrank1 = '---'
                    }
                    if (playercountryrank1 == 'null') {
                        playercountryrank1 == '---'
                    }
                    if (playerrank1 == 'null') {
                        playerrank1 == '---'
                    }
                    let playerrank = playerrank1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    let playercountryrank = playercountryrank1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                    let playerflag = playercountry.toLowerCase();


                    //
                    let playerlast = osudata.last_visit
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

                    let lastvishours = (Math.trunc(minlastvisreform / 60)) % 24;
                    let lastvisminutes = minlastvisreform % 60;
                    let lastvisdays = Math.trunc((minlastvisreform / 60) / 24) % 30;
                    let lastvismonths = Math.trunc(minlastvisreform / 60 / 24 / 30.437) % 12;
                    let lastvisyears = Math.trunc(minlastvisreform / 525600); //(60/24/30/12)
                    //fs.appendFileSync(osulogdir, "\n" + minlastvisreform)
                    let minlastvisredo = (lastvisyears + "y " + lastvismonths + "m " + lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                    if (lastvishours = 0) {
                        minlastvisredo = (lastvisminutes + "m");
                    } //check if under an hour
                    if (lastvisdays = 0) {
                        minlastvisredo = (lastvishours + "h " + lastvisminutes + "m");
                    } //check if under an day
                    if (lastvismonths = 0) {
                        minlastvisredo = (lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                    } //check if under an month
                    if (lastvisyears = 0) {
                        minlastvisredo = (lastvismonths + "m " + lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                    } //check if under an year

                    if (playerstatus == true) {
                        let Embed = new Discord.MessageEmbed()
                            .setColor(0x6DDAFF)
                            .setTitle(`${playername}'s osu! profile`)
                            .setURL(`https://osu.ppy.sh/u/${playerid}`)
                            .setThumbnail(playeravatar)
                            .setDescription("**Global Rank:** " + playerrank + " (#" + playercountryrank + " " + playercountry + ` :flag_${playerflag}:)\n` + playerpp + "**pp**\n**Accuracy:** " + playeraccuracy + "%\n**Level:** " + playerlevel + "+" + playerlevelprogress + "%\n**Playcount:** " + playerplays + "\n **<:osu_online:927800818445455421> Online**\n**Player joined on** " + playerjoined + "\n**Followers:** " + playerfollowers + "\n**Previous names:** " + playerprevname + "\n<:rankingxh:927797179597357076>" + playerxhcount + " <:rankingX:927797179832229948>" + playerxcount + " <:rankingSH:927797179710570568>" + playershcount + " <:rankingS:927797179618295838>" + playerscount + " <:rankingA:927797179739930634>" + playeracount);
                        message.reply({ embeds: [Embed] })
                        //message.reply(mapbg1)
                    }
                    if (playerstatus == false) {
                        let Embed = new Discord.MessageEmbed()
                            .setColor(0x6DDAFF)
                            .setTitle(`${playername}'s osu! profile`)
                            .setURL(`https://osu.ppy.sh/u/${playerid}`)
                            .setThumbnail(playeravatar)
                            .setDescription("**Global Rank:** " + playerrank + " (#" + playercountryrank + " " + playercountry + ` :flag_${playerflag}:)\n` + playerpp + "**pp**\n**Accuracy:** " + playeraccuracy + "%\n**Level:** " + playerlevel + "+" + playerlevelprogress + "%\n**Playcount:** " + playerplays + `\n **<:osu_offline:927800829153513472> Offline** | Last online ${minlastvisredo} ago\n**Player joined on** ` + playerjoined + "\n**Followers:** " + playerfollowers + "\n**Previous names:** " + playerprevname + "\n<:rankingxh:927797179597357076>" + playerxhcount + " <:rankingX:927797179832229948>" + playerxcount + " <:rankingSH:927797179710570568>" + playershcount + " <:rankingS:927797179618295838>" + playerscount + " <:rankingA:927797179739930634>" + playeracount);
                        message.reply({ embeds: [Embed] })
                        //message.reply(mapbg1)
                    }

                } catch (error) {
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