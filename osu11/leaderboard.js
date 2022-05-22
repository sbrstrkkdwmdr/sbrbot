const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { calculateStarRating } = require('osu-sr-calculator')
const { osulogdir } = require('../logconfig.json')
const { doubletimear, halftimear, easymultiplier, hardrockmultiplier } = require('../calculations/approachrate')
const { getStackTrace } = require('../somestuffidk/log')
const { access_token } = require('../debug/osuauth.json');
//            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))


module.exports = {
    name: 'leaderboard',
    description: '',
    async execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        let offsetnum = 0
        let mode = 'osu'
        const users = await userdatatags.findAll();

        if (args[0]) {
            switch (args.join(" ")) {
                case 'osu': case '1': case 'o': case 'standard': case 'circle': case 'circles':
                    mode = 'osu'
                    break;
                case 'taiko': case '2': case 't': case 'drums': case 'don':
                    mode = 'taiko'
                    break;
                case 'fruits': case '3': case 'f': case 'catch': case 'c': case 'catchthebeat': case 'catch the beat':
                    mode = 'fruits'
                    break;
                case 'mania': case '4': case 'm': case 'piano':
                    mode = 'mania'
                    break;
                default:
                    mode = 'osu'
                    break;
            }
        }

        let leaderboardEmbed = new Discord.MessageEmbed()
            .setTitle(`Local server leaderboards`)



        for (let i = 0; i < 10 && i < users.length; i++) {
            let curuser = users[i].description//.toString()
            if(curuser == null || curuser == 'null'){

            }
            else {
                let userreq = `https://osu.ppy.sh/api/v2/users/${curuser}/${mode}`
            fetch(userreq, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
            .then(output => {
                //console.log(JSON.stringify(output, null, 2))
                if(output.timeout == 0){}
                else{
                username = output.username
                pp = output.statistics.pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                id = output.id
                rank = output.statistics.global_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                country = output.country_code

                //console.log(`[${username}](https://osu.ppy.sh/u/${id}) | ${country} :flag_${country.toLowerCase()}:\n Rank: #${rank} \n Performance: ${pp}pp\n`)

                leaderboardEmbed
                    .addField(`${i + 1}`, `[${username}](https://osu.ppy.sh/u/${id}) | ${country} :flag_${country.toLowerCase()}:\n Rank: #${rank} \n Performance: ${pp}pp\n`, false)
                    //message.channel.send({ embeds: [leaderboardEmbed] })
}
            })}

        }
        message.channel.send({ embeds: [leaderboardEmbed] })

        /*
        let users = await userdatatags.findAll({ 
                where: {
                description: String
            }

        })

        for (i = 0; i < x && i < 10; i++) {

        } 

        const firstuser = users[0].description
        console.log(firstuser)
        */


        //console.log(users.every(username => username instanceof userdatatags)); // true
        //console.log("All users:", JSON.stringify(users, null, 2));
    }
}