const fetch = require('node-fetch');
const fs = require('fs')
module.exports = {
    name: 'acccalc',
    description: '',
    async execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', '--- COMMAND EXECUTION ---')
        fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "command executed - accuracy calculator")
        fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "category - osu")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        interaction.reply('calculating...')
        let hit300max =  options.getNumber('300maxes')       
        let hit300 = options.getNumber('300s')
        let hit200 = options.getNumber('200s')
        let hit100 = options.getNumber('100s')
        let hit50 = options.getNumber('50s')
        let miss = options.getNumber('0s')
        let mode = options.getString('mode')
        let mapid = options.getNumber('id')
        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}`
        if(!hit300max){
            hit300max = 0  
        }
        if(!hit300){
            hit300 = 0
        }
        if(!hit200){
            hit200 = 0
        }
        if(!hit100){
            hit100 = 0
        }
        if(!hit50){
            hit50 = 0
        }
        if(!miss){
            miss = 0
        }
        let topequation = Math.floor((300 * hit300) + (100 * hit100) + (50 * hit50) + (miss))
        let bottomequation = Math.floor(300 * (hit300 + hit100 + hit50 + miss))
        if(!mode){
            mode = 'osu'
        }
        
(async () => {
        if(mode == 'osu' || mode == 'o' || mode == '1' || mode == 'std' || mode == 'standard'){
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', 'osu')
            topequation = Math.floor((300 * hit300) + (100 * hit100) + (50 * hit50) + (miss))
            bottomequation = Math.floor(300 * (hit300 + hit100 + hit50 + miss))
            fullequation = (Math.abs((topequation / bottomequation)*100)).toString() + '%'
            shortequation = ((Math.abs((topequation / bottomequation)*100)).toFixed(2)).toString() + '%'
            interaction.channel.send({ content: `**Accuracy:** ${shortequation}\n**Full ver:** ${fullequation}`})//can't use edit reply bcs INTERACTION_NOT_REPLIED error, and cant use reply bcs DiscordAPIError: Interaction has already been acknowledged
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "") 
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "sent")
            console.groupEnd()
        }
        if(mode == 'taiko' || mode == 't' || mode == '2'){
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', 'taiko')
            topequation = Math.abs(hit300 + (hit100 / 2))
            bottomequation = Math.abs(hit300 + hit100 + miss)
            fullequation = (Math.abs((topequation / bottomequation)*100)).toString() + '%'
            shortequation = ((Math.abs((topequation / bottomequation)*100)).toFixed(2)).toString() + '%'
            interaction.channel.send({ content: `**Accuracy:** ${shortequation}\n**Full ver:** ${fullequation}`})
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "") 
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "sent")
            console.groupEnd()
        }
        if(mode == 'catch' || mode == 'c' || mode == '3' || mode == 'ctb' || mode == 'catch the beat'){
            const { access_token } = require('../debug/osuauth.json');
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', 'ctb')
            if(!mapid) return interaction.channel.send('input a valid map id')
            if(mapid){
            fetch(mapurl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            }).then(res => res.json())
            .then(mapdata => 
                {
            //fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', mapdata)
            let fruits = JSON.stringify(mapdata, ['count_circles']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_circles', '');
            let drops = JSON.stringify(mapdata, ['count_sliders']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_sliders', '');
            //let droplets = parseInt(JSON.stringify(mapdata, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', ''));
            topequation = Math.floor(hit300 + hit100 + hit50)
            bottomequation = Math.floor(Math.abs(fruits) + Math.abs(drops))
            fullequation = (Math.abs((topequation / bottomequation)*100)).toString() + '%'
            shortequation = ((Math.abs((topequation / bottomequation)*100)).toFixed(2)).toString() + '%'
            interaction.channel.send({ content: `**Accuracy:** ${shortequation}\n**Full ver:** ${fullequation}`})
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "") 
            console.groupEnd()
            })}
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "") 
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "sent")
            console.groupEnd()
        }
        if(mode == 'mania' || mode == 'm' || mode == '4'){
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', 'mania')
            topequation = Math.floor((300 * (hit300max + hit300)) + (200 * hit200) + (100 * hit100) + (50 * hit50))
            bottomequation = Math.floor(300 * (hit300max + hit300 + hit200 + hit100 + hit50 + miss))
            fullequation = (Math.abs((topequation / bottomequation)*100)).toString() + '%'
            shortequation = ((Math.abs((topequation / bottomequation)*100)).toFixed(2)).toString() + '%'
            interaction.channel.send({ content: `**Accuracy:** ${shortequation}\n**Full ver:** ${fullequation}`})
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "") 
            fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "sent")
            console.groupEnd()
        }
    })();
    }
}
fs.appendFileSync('osu.log', '\n')
fs.appendFileSync('osu.log', "") 
console.groupEnd()
//client.commands.get('').execute(message, args)