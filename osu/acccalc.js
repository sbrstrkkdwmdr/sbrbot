const fetch = require('node-fetch');
const fs = require('fs')
const { osulogdir } = require('../logconfig.json')
module.exports = {
    name: 'acccalc',
    description: '',
    async execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(osulogdir, "\n" + "command executed - accuracy calculator")
        fs.appendFileSync(osulogdir, "\n" + "category - osu")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
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
        let totalhits = hit300max + hit300 + hit200 + hit100 + hit50 + miss
        let topequation = Math.floor((300 * hit300) + (100 * hit100) + (50 * hit50) + (miss))
        let bottomequation = Math.floor(300 * (hit300 + hit100 + hit50 + miss))
        if(!mode){
            mode = 'osu'
        }
        
(async () => {
        if(mode == 'osu' || mode == 'o' || mode == '1' || mode == 'std' || mode == 'standard'){
            fs.appendFileSync(osulogdir, "\n" + 'osu')
            topequation = Math.floor((300 * hit300) + (100 * hit100) + (50 * hit50) + (miss))
            bottomequation = Math.floor(300 * (hit300 + hit100 + hit50 + miss))
            fullequation = (Math.abs((topequation / bottomequation)*100)).toString() + '%'
            shortequation = ((Math.abs((topequation / bottomequation)*100)).toFixed(2)).toString() + '%'
            //https://osu.ppy.sh/wiki/en/FAQ#grades
            grade = 'D'
            if(hit300 / totalhits > 0.6 && miss == 0){
                grade = 'C'
            }
            if((hit300 / totalhits > 0.7 && miss == 0) || (hit300 / totalhits > 0.8)){
                grade = 'B'
            }
            if((hit300 / totalhits > 0.8 && miss == 0) || (hit300 / totalhits > 0.9)){
                grade = 'A'
            }
            if(Math.abs(hit300 / totalhits) > 0.9 && miss == 0 && Math.abs(hit50 / totalhits) < 0.01){
                grade = 'S'
            }
            if(hit100 < 1 && hit50 < 1 && miss == 0){
                grade = 'SS'
            }


            interaction.channel.send({ content: `**Accuracy:** ${shortequation}\n**Full ver:** ${fullequation}\n**Grade:** ${grade}`})//can't use edit reply bcs INTERACTION_NOT_REPLIED error, and cant use reply bcs DiscordAPIError: Interaction has already been acknowledged
            fs.appendFileSync(osulogdir, "\n" + "") 
            fs.appendFileSync(osulogdir, "\n" + "sent")
            console.groupEnd()
        }
        if(mode == 'taiko' || mode == 't' || mode == '2'){
            fs.appendFileSync(osulogdir, "\n" + 'taiko')
            topequation = Math.abs(hit300 + (hit100 / 2))
            bottomequation = Math.abs(hit300 + hit100 + miss)
            fullequation = (Math.abs((topequation / bottomequation)*100)).toString() + '%'
            shortequation = ((Math.abs((topequation / bottomequation)*100)).toFixed(2)).toString() + '%'
            grade = 'https://osu.ppy.sh/wiki/en/FAQ#grades'
            if(topequation / bottomequation > 0.8){
                grade = 'B'
            }
            if(topequation / bottomequation > 0.9){
                grade = 'A'
            }
            if(topequation / bottomequation > 0.95){
                grade = 'S'
            }
            if(topequation / bottomequation == 1){
                grade = 'SS'
            }
            interaction.channel.send({ content: `**Accuracy:** ${shortequation}\n**Full ver:** ${fullequation}\n**Grade:** ${grade}`})
            fs.appendFileSync(osulogdir, "\n" + "") 
            fs.appendFileSync(osulogdir, "\n" + "sent")
            console.groupEnd()
        }
        if(mode == 'catch' || mode == 'c' || mode == '3' || mode == 'ctb' || mode == 'catch the beat'){
            fs.appendFileSync(osulogdir, "\n" + 'ctb')
            
            //fs.appendFileSync(osulogdir, "\n" + mapdata)
            let hits = hit300 + hit100 + hit50 + hit0

//let droplets = parseInt(JSON.stringify(mapdata, ['count_spinners']).replaceAll('{', '').replaceAll('"', '').replaceAll('}', '').replaceAll(':', '').replaceAll('count_spinners', ''));
            topequation = Math.floor(hit300 + hit100 + hit50)
            bottomequation = Math.floor(Math.abs(hits))
            fullequation = (Math.abs((topequation / bottomequation)*100)).toString() + '%'
            shortequation = ((Math.abs((topequation / bottomequation)*100)).toFixed(2)).toString() + '%'
            
            grade = 'D'
            if(topequation / bottomequation > 0.85){
                grade = 'C'
            }
            if(topequation / bottomequation > 0.9){
                grade = 'B'
            }
            if(topequation / bottomequation > 0.94){
                grade = 'A'
            }
            if(topequation / bottomequation > 0.98){
                grade = 'S'
            }
            if(topequation / bottomequation == 1){
                grade = 'SS'
            }
            interaction.channel.send({ content: `**Accuracy:** ${shortequation}\n**Full ver:** ${fullequation}\n**Grade:** ${grade}`})
            fs.appendFileSync(osulogdir, "\n" + "") 
            console.groupEnd()
            fs.appendFileSync(osulogdir, "\n" + "") 
            fs.appendFileSync(osulogdir, "\n" + "sent")
            console.groupEnd()
        }
        if(mode == 'mania' || mode == 'm' || mode == '4'){
            fs.appendFileSync(osulogdir, "\n" + 'mania')
            topequation = Math.floor((300 * (hit300max + hit300)) + (200 * hit200) + (100 * hit100) + (50 * hit50))
            bottomequation = Math.floor(300 * (hit300max + hit300 + hit200 + hit100 + hit50 + miss))
            fullequation = (Math.abs((topequation / bottomequation)*100)).toString() + '%'
            shortequation = ((Math.abs((topequation / bottomequation)*100)).toFixed(2)).toString() + '%'
            grade = 'D'
            if(topequation / bottomequation == 0.7){
                grade = 'C'
            }
            if(topequation / bottomequation == 0.8){
                grade = 'B'
            }
            if(topequation / bottomequation > 0.9){
                grade = 'A'
            }
            if(topequation / bottomequation > 0.95){
                grade = 'S'
            }
            if(topequation / bottomequation == 1){
                grade = 'SS'
            }
            interaction.channel.send({ content: `**Accuracy:** ${shortequation}\n**Full ver:** ${fullequation}\n**Grade:** ${grade}`})
            fs.appendFileSync(osulogdir, "\n" + "") 
            fs.appendFileSync(osulogdir, "\n" + "sent")
            console.groupEnd()
        }
    })();
    }
}
fs.appendFileSync(osulogdir, "\n" + "") 
console.groupEnd()
//client.commands.get('').execute(message, args)