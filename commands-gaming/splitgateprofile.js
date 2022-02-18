const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { Message } = require('discord.js');
module.exports = {
    name: 'splitgateprofile',
    description: '',
    execute(message, args, client, Discord, currentDate, currentDateISO, trnkey) {
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - get splitgate profile")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        let platform = 'steam'
        /*if (args.includes('xbox')){
            platform = 'xbl'
        }
        if (args.includes('playstation')){
            platform = 'psn'
        }
        if (args.includes('steam')){
            platform = 'steam'
        }*/

        let platformUserIdentifier = args[0];
        if(isNaN(platformUserIdentifier)) return message.reply("you must use your SteamID64");

        console.log(platformUserIdentifier)
        console.log(platform)
        //let segmentType = 'overview'

        const profileurl =  `https://public-api.tracker.gg/v2/splitgate/standard/profile/${platform}/${platformUserIdentifier} `

        fetch(profileurl, {
            method: 'GET',
            headers: {
                'TRN-Api-Key': `${trnkey}`,
                'Accept': application/json,
                'Accept-Encoding': gzip
            }
        })
        .then(profileoutput => {
            fs.writeFileSync("splitgateprofile.json", JSON.stringify(profileoutput, null, 2))
            let username = JSON.stringify(profileoutput['data']['platformInfo'], ['platformUserHandle']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('platformUserHandle', '');
            let avatar = JSON.stringify(profileoutput['data']['platformInfo'], ['avatarUrl']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('avatarUrl', '');
            let country = JSON.stringify(profileoutput['data']['userInfo'], ['countryCode']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('avatarUrl', '');
            //let kills = JSON.stringify(profileoutput['data']['segments'][0]['stats']['rank'], ['value']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('rank', '');
            let kills = JSON.stringify(profileoutput['data']['segments'][0]['stats']['kills'], ['value']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('value', '');
            let deaths = JSON.stringify(profileoutput['data']['segments'][0]['stats']['deaths'], ['value']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('value', '');
            let assists = JSON.stringify(profileoutput['data']['segments'][0]['stats']['assists'], ['value']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('value', '');
            let totaldmg = JSON.stringify(profileoutput['data']['segments'][0]['stats']['damageDealt'], ['value']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('value', '');
            let totalmatches = JSON.stringify(profileoutput['data']['segments'][0]['stats']['matchesPlayed'], ['value']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('value', '');
            let wins = JSON.stringify(profileoutput['data']['segments'][0]['stats']['wins'], ['value']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('value', '');
            let losses = JSON.stringify(profileoutput['data']['segments'][0]['stats']['losses'], ['value']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('value', '');


            let KDAd = Math.abs(deaths/kills);
            let KDAa = Math.abs(assists/kills);
            let KDA = `1/${KDAd}/${KDAa}`;

            let winloss1 = Math.abs((wins/losses)*100).toFixed(2)

            let ProfileEmbed = new Discord.MessageEmbed()
            .setImage(avatar)
            .setTitle(`INFORMATION FOR ${username}`)
            .addField('PROFILE INFO', `Country: ${country} ${country.toLowerCase()}\n`, false)
            .addField('PROFILE STATS', `**Kills**:${kills} | **Deaths**:${deaths} | **Assists**:${assists}\n**KDA** ${KDA}\n **Damage dealt**:${totaldmg} | **Matches played**: ${totalmatches}\n**Wins**:${wins} | **Losses**: ${losses} | ${winloss1}% winrate`, false)
            message.reply({ embeds: {ProfileEmbed}});

        })


    }
}