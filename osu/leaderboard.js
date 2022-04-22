const fetch = require('node-fetch');
const POST = require('node-fetch');
const fs = require('fs');
const { std_ppv2, taiko_ppv2, catch_ppv2, mania_ppv2 } = require('booba');
const { calculateStarRating } = require('osu-sr-calculator')
const { osulogdir } = require('../logconfig.json')
const { doubletimear, halftimear, easymultiplier, hardrockmultiplier } = require('../calculations/approachrate')
const { getStackTrace } = require('../somestuffidk/log')
//            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))


module.exports = {
    name: 'leaderboard',
    description: '',
    execute(userdatatags, interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
        fs.appendFileSync(osulogdir, "\n" + '--- COMMAND EXECUTION ---')
        interaction.reply('getting data...')
        fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(osulogdir, "\n" + "command executed - map get")
        fs.appendFileSync(osulogdir, "\n" + "category - osu")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(osulogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(osulogdir, "\n" + "") 
        
        let type = options.getString('type')

        let mapid;
        let { prevmap } = require('../debug/storedmap.json');
        id1 = options.getNumber('id')
        if(id1){
            mapid = id1
        }
        else {
            mapid = prevmap
        }
        offset = options.getNumber('offset')
        if(!offset){
            offset = 0
        }
        let pageoffset = offset * 5
        /*
        let mods;
        let input = options.getString('input')
        if(type) type2 = type.toLowerCase()
        if(input && type2 == ('mod' || 'mods')){
            mods = input
        }
        else {
            mods = 'NM'
        }*/ //will add when ranking types get added to osu!api v2 https://osu.ppy.sh/docs/index.html?javascript#get-beatmap-scores

        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}`//?mods=${mods}`
            try{
            const { access_token } = require('../debug/osuauth.json');
            
            fetch(mapurl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            }).then(res => res.json())
            .then(output1 => 
                {
                    fs.writeFileSync("debug/map.json", JSON.stringify(output1, null, 2))
                    let title = ((output1.beatmapset.title)).toString()
                    let titleunicode = ((output1.beatmapset.title_unicode)).toString()
                    if(title != titleunicode){
                        fulltitle = `${title}\n${titleunicode}`
                    }
                    else{
                        fulltitle = titleunicode
                    }
                    let diff = ((output1.version)).toString()
                    let fulltitletext = `${fulltitle} [${diff}]`
                    let maxcombo = ((output1.max_combo)).toString()

                    let mapscoreurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}/scores`
                    let mapper = ((output1.beatmapset.creator)).toString()
                    let mapbg = ((output1.beatmapset.covers.cover)).toString()
                    let mode = (output1.mode_int).toString()
                    fetch(mapscoreurl, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        }
                    }).then(res => res.json())
                    .then(output2 =>
                        {
                            fs.writeFileSync("debug/mapscore.json", JSON.stringify(output2, null, 2))
                            let scores = '';
                            if(offset > 0){
                                scores += 'Page #' + (offset+1)
                            }
                            for(i=0;i<5;i++){
                                let name = (output2.scores[i+pageoffset].user.username).toString()
                                let pp = parseFloat((output2.scores[i+pageoffset].pp).toString()).toFixed(2)
                                let score = (output2.scores[i+pageoffset].score).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                let acc = Math.abs(((output2.scores[i+pageoffset].accuracy).toString()) * 100).toFixed(2)
                                let mods = (output2.scores[i+pageoffset].mods).toString().replaceAll(',', '').replaceAll('[', '').replaceAll(']', '')
                                let date1 = (output2.scores[i+pageoffset].created_at).toString().slice(0, 10);
                                let datetime = (output2.scores[i+pageoffset].created_at).toString().slice(11,19)
                                let date = date1 + ' ' + datetime
                                let grade = (output2.scores[i+pageoffset].rank)
                                let combo = (output2.scores[i+pageoffset].max_combo).toString()
                                let hitmax = (output2.scores[i+pageoffset].statistics.count_geki).toString()
                                let hit300 = (output2.scores[i+pageoffset].statistics.count_300).toString()
                                let hit200 = (output2.scores[i+pageoffset].statistics.count_katu).toString()
                                let hit100 = (output2.scores[i+pageoffset].statistics.count_100).toString()
                                let hit50 = (output2.scores[i+pageoffset].statistics.count_50).toString()
                                let miss = (output2.scores[i+pageoffset].statistics.count_miss).toString()

                                if(mode == '0'){
                                    hits = `${hit300}/${hit100}/${hit50}/${miss}`
                                }
                                if(mode == '1'){
                                    hits = `${hit300}/${hit100}/${miss}`
                                }
                                if(mode == '2'){
                                    hits = `${hit300}/${hit100}/${hit50}/${miss}`
                                }
                                if(mode == '3'){
                                    hits = `${hitmax}/${hit300}/${hit200}/${hit100}/${hit50}/${miss}`
                                }


                                if(mods){
                                    ifmods = '+' + mods + ' | '
                                } 
                                else {
                                    ifmods = ''
                                }

                                scores += `\n\n#${i+pageoffset+1} | **Score set by ${name}**\n${ifmods} ${date}\n${acc} | ${pp} | ${grade}\n${combo}x/**${maxcombo}x** | ${hits}\n${score}`

                            }
                            scores += '⠀'

                            let embed = new Discord.MessageEmbed()
                            .setAuthor(`mapped by ${mapper}`)
                            .setTitle(`Top 5 scores for ${fulltitletext}`)
                            .setURL(`https://osu.ppy.sh/b/${mapid}`)
                            .setDescription(scores)
                            .setImage(mapbg)

                            interaction.editReply({ content: '⠀', embeds: [embed]})
                            fs.appendFileSync(osulogdir, "\n" + 'sent')
                        }
                        )
            })

        } catch(error){
            fs.appendFileSync(osulogdir, "\n" + error)
            fs.appendFileSync(osulogdir, "\n" + getStackTrace(error))
            console.groupEnd()
            console.groupEnd()
            console.groupEnd()
        }
        
    }
}
//client.commands.get('').execute(message, args)