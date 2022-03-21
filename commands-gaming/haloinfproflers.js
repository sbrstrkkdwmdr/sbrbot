const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { haloapikey } = require('../config.json')
module.exports = {
    name: 'haloinfprofile',
    description: '',
    async execute(message, args, client, Discord, currentDate, currentDateISO, trnkey) {
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - get halo profile")
        console.log("category - gaming")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        const lib = require('lib')({token: haloapikey})
        let username = args.splice(/ +/).join(' ')
        if(!username){
            username = 'Mint Blitz'
        }
        //let url = `https://halo.api.stdlib.com/infinite@0.3.9/appearance/${username}`
        try{result = await lib.halo.infinite['@0.3.9'].stats.matches.retrieve({
            gamertag: `${username}`
        });
        profileresult = await lib.halo.infinite['@0.3.9'].appearance({
            gamertag: `${username}`
        });
        } catch(error){
            message.reply("error - profile not found")
            return console.log(error)
        }
        let pfp = JSON.stringify(profileresult['data'], ['emblem_url']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replace(':', '').replace('emblem_url', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let servicetag = JSON.stringify(profileresult['data'], ['service_tag']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('service_tag', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let map = JSON.stringify(result['data']['map'], ['name']).replaceAll('{', '').replaceAll('}').replaceAll(',','').replaceAll(':', '').replaceAll('name', '').replaceAll('[', '').replaceAll(']', '');
        let mapimage = JSON.stringify(result['data']['map']['asset'], ['thumbnail_url']).replaceAll('{', '').replaceAll('}').replaceAll(',','').replace(':', '').replaceAll('thumbnail_url', '').replaceAll('[', '').replaceAll(']', '');
        let playlist = JSON.stringify(result['data']['playlist'], ['name']).replaceAll('{', '').replaceAll('}').replaceAll(',','').replaceAll(':', '').replaceAll('name', '').replaceAll('[', '').replaceAll(']', '');

        let haloembed = new Discord.MessageEmbed()
            .setTitle(`Stats for ${username} [${servicetag}]`)
            .setThumbnail(pfp)
            .setImage(mapimage)
            .addField('Basic Stats', `**Gamemode:** ${playlist}`, true)
            .addField('Other Stats', `**Map:**${map}`, false)
            
            message.reply({ embeds: [haloembed]})
    }
}