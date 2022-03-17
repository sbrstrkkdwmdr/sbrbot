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
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        const lib = require('lib')({token: haloapikey})
        let username = args[0]
        if(!username){
            username = 'sbrstrkkdw'
        }
        //let url = `https://halo.api.stdlib.com/infinite@0.3.9/appearance/${username}`
        let result = await lib.halo.infinite['@0.3.9'].stats['service-record'].multiplayer({
            gamertag: `${username}`
        });
        fs.writeFileSync("debug/haloinfdata.json", JSON.stringify(result, null, 2));
        //console.log(result)
        let kills = JSON.stringify(result['data']['core']['summary'], ['kills']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('kills', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let deaths = JSON.stringify(result['data']['core']['summary'], ['deaths']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('deaths', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let assists = JSON.stringify(result['data']['core']['summary'], ['assists']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('assists', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let betrayals = JSON.stringify(result['data']['core']['summary'], ['betrayals']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('betrayals', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let suicides = JSON.stringify(result['data']['core']['summary'], ['suicides']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('suicides', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        //vehicle
        let hijacks = JSON.stringify(result['data']['core']['summary']['vehicles'], ['hijacks']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('hijacks', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let vehicledestroy = JSON.stringify(result['data']['core']['summary']['vehicles'], ['destroys']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('destroys', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        //breakdown
        let melee = JSON.stringify(result['data']['core']['breakdowns']['kills'], ['melee']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('melee', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let grenades = JSON.stringify(result['data']['core']['breakdowns']['kills'], ['grenades']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('grenades', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let headshots = JSON.stringify(result['data']['core']['breakdowns']['kills'], ['headshots']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('headshots', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let powershots = JSON.stringify(result['data']['core']['breakdowns']['kills'], ['power_weapons']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('power_weapons', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        //shots
        let damageshot = JSON.stringify(result['data']['core']['damage'], ['dealt']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('dealt', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let damagetaken = JSON.stringify(result['data']['core']['damage'], ['taken']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('taken', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        //let shotfired = JSON.stringify(result['data']['core']['breakdowns']['kills'], ['power_weapons']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('power_weapons', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let shotsmiss = JSON.stringify(result['data']['core']['shots'], ['missed']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('missed', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let shotland = JSON.stringify(result['data']['core']['shots'], ['landed']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('landed', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let shotacc1 = JSON.stringify(result['data']['core']['shots'], ['accuracy']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replace('accuracy', '').replaceAll(',', '').replaceAll('[', '').replaceAll(']', '');
        let shotacc = Math.abs(shotacc1).toFixed(2)

        let haloembed = new Discord.MessageEmbed()
            .setTitle(`Stats for ${username}`)
            .addField('Basic Stats', ` <:kill:953930612471894076> **Kills:** ${kills}\n💀**Deaths:** ${deaths}\n <:assist:953930611993759795> **Assists:** ${assists}\n <:betrayal:953930612396408832> **Betrayals:** ${betrayals}\n <:suicide:953930612199284808> **Suicides:** ${suicides}`, true)
            .addField('Kills', ` <:melee:953930612497059890> **Melee**: ${melee}\n <:grenadier:953930612320911401> **Grenades:** ${grenades}\n <:headshot:953930612522246205> **Headshots:** ${headshots}\n <:powerweapon:953930612299923477> **Power Weapons:** ${powershots}`, true)
            .addField('Other Stats', ` <:destroyvehicle:953930612388003850> **Vehicles destroyed:** ${vehicledestroy} | <:hijack:953930612413202442> **Vehicles Hijacked:** ${hijacks}
            **Damage Dealt:** ${damageshot} | **Damage Taken:** ${damagetaken}
            **Hit Shots:** ${shotland} | **Missed Shots:** ${shotsmiss} | **Accuracy**: ${shotacc}`, false)
            
            message.reply({ embeds: [haloembed]})
    }
}