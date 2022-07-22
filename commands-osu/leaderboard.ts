import fs = require('fs')
import osucalc = require('osumodcalculator');
import fetch from 'node-fetch'
import { access_token } from '../configs/osuauth.json';


module.exports = {
    name: 'leaderboard',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button) {
        let prevmap;
        let i: number;
        if (fs.existsSync('./configs/prevmap.json')) {
            //console.log('hello there')
            try {
                prevmap = JSON.parse(fs.readFileSync('./configs/prevmap.json', 'utf8'));
            } catch {
                console.log('no map in prevmap.json\nCreating default file...')
                fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: 32345 }), null, 2));
            }
        } else {
            return console.log('Error - missing prevmap.json in configs folder');
        }

        let buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('BigLeftArrow-leaderboard')
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    .setLabel('Start'),
                new Discord.ButtonBuilder()
                    .setCustomId('LeftArrow-leaderboard')
                    .setStyle('Primary')
                    .setEmoji('◀')
                    .setLabel('Previous'),
/*                 new Discord.ButtonBuilder()
                    .setCustomId('Middle-osutop')
                    .setStyle('Primary')
                    .setLabel('🔍'), */
                new Discord.ButtonBuilder()
                    .setCustomId('RightArrow-leaderboard')
                    .setStyle('Primary')
                    .setEmoji('▶')
                    .setLabel('Next'),
                new Discord.ButtonBuilder()
                    .setCustomId('BigRightArrow-leaderboard')
                    .setStyle('Primary')
                    .setEmoji('➡')
                    .setLabel('Final'),
            );

        if (message != null && button == null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - leaderboard (message)\n${currentDate} | ${currentDateISO}\n recieved map leaderboard command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let mapid = args[0]

            if (!mapid) {
                mapid = prevmap.id
            }

            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}`//?mode=osu`//?mods=${mods}`

            fetch(mapurl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }).then(res => res.json() as any)
                .then(mpdata => {
                    let mapdata = mpdata as any
                    let title = mapdata.beatmapset.title
                    let titleuni = mapdata.beatmapset.title_unicode

                    let artist = mapdata.beatmapset.artist
                    let artistuni = mapdata.beatmapset.artist_unicode

                    if (title != titleuni) {
                        title = `${title} (${titleuni})`
                    }
                    if (artist != artistuni) {
                        artist = `${artist} (${artistuni})`
                    }
                    let fulltitle = `${artist} - ${title} [${mapdata.version}]`

                    let mapscoresurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}/scores`
                    fs.writeFileSync('debugosu/maplbmap.json', JSON.stringify(mapdata, null, 2))

                    fetch(mapscoresurl, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        }
                    }).then(res => res.json() as any)
                        .then(lbdatapresort => {
                            let lbdata = (lbdatapresort as any).scores

                            let sctxt = ''
                            for (i = 0; i < lbdata.length; i++) {
                                sctxt += `\nhttps://osu.ppy.sh/scores/${lbdata[i].mode}/${lbdata[i].id}`
                            }
                            fs.writeFileSync('debugosu/maplbscores.txt', sctxt)
                            if (args[1] && args[1] == 'links' && lbdata.length > 0) {
                                message.reply({ files: ['debugosu/maplbscores.txt'], allowedMentions: { repliedUser: false } })
                                return;
                            }

                            fs.writeFileSync('debugosu/maplb.json', JSON.stringify(lbdata, null, 2))

                            let lbEmbed = new Discord.EmbedBuilder()
                                .setTitle(`TOP 5 SCORES FOR ${fulltitle}`)
                                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                                ;

                            let scoretxt = `Page: 1/${Math.ceil((lbdata as any).length / 5)}`

                            for (i = 0; i < lbdata.length && i < 5; i++) {
                                let score = lbdata[i]

                                let gamestats = score.statistics

                                let hitgeki = gamestats.count_geki
                                let hit300 = gamestats.count_300
                                let hitkatu = gamestats.count_katu
                                let hit100 = gamestats.count_100
                                let hit50 = gamestats.count_50
                                let miss = gamestats.count_miss
                                let mode = score.mode_int
                                let hitlist;
                                switch (mode) {
                                    case 0: //std
                                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                                        break;
                                    case 1: //taiko
                                        hitlist = `${hit300}/${hit100}/${miss}`
                                        break;
                                    case 2: //catch/fruits
                                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                                        break;
                                    case 3: //mania
                                        hitlist = `${hitgeki}/${hit300}/${hitkatu}/${hit100}/${hit50}/${miss}`
                                        break;
                                }
                                let ifmods: string = '';
                                if (score.mods.length > 0) {
                                    ifmods = `+${score.mods.join('')} |`
                                }

                                scoretxt += `
                                   **[Score #${i + 1}](https://osu.ppy.sh/scores/${score.mode}/${score.id}) | [${score.user.username}](https://osu.ppy.sh/u/${score.user.id})**
                                   Score set on ${score.created_at}
                                   ${(score.accuracy * 100).toFixed(2)}% | ${score.rank} | ${score.pp}pp
                                   ${ifmods} ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.max_combo}x/**${mapdata.max_combo}x**
                                   ${hitlist}
                                `
                            }
                            if (lbdata.length < 1 || scoretxt.length < 10) {
                                scoretxt = 'Error - no scores found'
                            }
                            if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {

                                scoretxt = 'Error - map is unranked'
                            }
                            lbEmbed.setDescription(`${scoretxt}`)
                            message.reply({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                            fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));
                        })


                })
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - leaderboard (interaction)\n${currentDate} | ${currentDateISO}\n recieved map leaderboard command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let mapid: any;
            let page: any;
            let mods1: any;


            if (interaction.type != Discord.InteractionType.MessageComponent) {
                mapid = interaction.options.getInteger('id')
                page = interaction.options.getInteger('page')
                mods1 = interaction.options.getString('mods')
            } else {
                mapid = message.embeds[0].url.split('/b/')[1]
                if (message.embeds[0].footer) {
                    mods1 = message.embeds[0].footer.text
                }
                page = 0
                if (button == 'BigLeftArrow') {
                    page = 0
                } else if (button == 'LeftArrow') {
                    page = parseInt((message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
                } else if (button == 'RightArrow') {
                    page = parseInt((message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
                } else if (button == 'BigRightArrow') {
                    page = parseInt((message.embeds[0].description).split('/')[1].split('\n')[0])
                } else if (button == 'Middle') {

                }
            }

            let mods = null
            if (mods1) {
                mods = osucalc.OrderMods(mods1) + ''
            }
            if (page < 2) {
                page = 0
            } else if (!page) {
                page = 0
            }

            else {
                page--
            }
            if (!mapid) {
                mapid = prevmap.id
            }

            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}`//?mode=osu`//?mods=${mods}`

            fetch(mapurl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }).then(res => res.json() as any)
                .then(mpdata => {
                    let mapdata = (mpdata as any)
                    let title = mapdata.beatmapset.title
                    let titleuni = mapdata.beatmapset.title_unicode

                    let artist = mapdata.beatmapset.artist
                    let artistuni = mapdata.beatmapset.artist_unicode

                    if (title != titleuni) {
                        title = `${title} (${titleuni})`
                    }
                    if (artist != artistuni) {
                        artist = `${artist} (${artistuni})`
                    }
                    let fulltitle = `${artist} - ${title} [${mapdata.version}]`

                    fs.writeFileSync('debugosu/maplbmap.json', JSON.stringify(mapdata, null, 2))

                    if (mods == null) {
                        let mapscoresurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}/scores`

                        fetch(mapscoresurl, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            }
                        }).then(res => res.json() as any)
                            .then(lbdatapresort => {
                                let lbdatatoarr = (lbdatapresort as any).scores
                                let filtereddata = lbdatatoarr
                                let lbdata = lbdatatoarr
                                let filterinfo = ''

                                let sctxt = ''
                                for (i = 0; i < lbdata.length; i++) {
                                    sctxt += `\nhttps://osu.ppy.sh/scores/${lbdata[i].mode}/${lbdata[i].id}`
                                }
                                fs.writeFileSync('debugosu/maplbscores.txt', sctxt)
                                let filtermods = mods
                                if (mods == '') {
                                    filtermods = 'NM'
                                }

                                if (mods1 != null && !mods1.includes('any')) {
                                    filtereddata = lbdatatoarr.filter(array => array.mods.toString().replaceAll(',', '') == mods)

                                    filterinfo += `\nmods: ${filtermods} only`
                                }
                                if (mods1 != null && mods1.includes('any')) {
                                    filtereddata = lbdatatoarr.filter(array => array.mods.toString().replaceAll(',', '').includes(mods))
                                    filterinfo += `\nmods: has ${filtermods}`
                                }
                                lbdata = filtereddata

                                fs.writeFileSync('debugosu/maplb.json', JSON.stringify(lbdata, null, 2))

                                let lbEmbed = new Discord.EmbedBuilder()
                                    .setTitle(`TOP 5 SCORES FOR ${fulltitle}`)
                                    .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                    .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                                    ;
                                if (filterinfo != '') {
                                    lbEmbed.setFooter({ text: `filtered by:\n${filterinfo}` })
                                }

                                let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`

                                for (i = 0; i < lbdata.length && i < 5; i++) {
                                    try {
                                        let score = lbdata[i + (page * 5)]

                                        let gamestats = score.statistics

                                        let hitgeki = gamestats.count_geki
                                        let hit300 = gamestats.count_300
                                        let hitkatu = gamestats.count_katu
                                        let hit100 = gamestats.count_100
                                        let hit50 = gamestats.count_50
                                        let miss = gamestats.count_miss
                                        let mode = score.mode_int
                                        let hitlist;
                                        switch (mode) {
                                            case 0: //std
                                                hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                                                break;
                                            case 1: //taiko
                                                hitlist = `${hit300}/${hit100}/${miss}`
                                                break;
                                            case 2: //catch/fruits
                                                hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                                                break;
                                            case 3: //mania
                                                hitlist = `${hitgeki}/${hit300}/${hitkatu}/${hit100}/${hit50}/${miss}`
                                                break;
                                        }
                                        let ifmods: string = ''
                                        if (score.mods.length > 0) {
                                            ifmods = `+${score.mods.join('')} |`
                                        }

                                        scoretxt += `
                                   **[Score #${i + (page * 5) + 1}](https://osu.ppy.sh/scores/${score.mode}/${score.id}) | [${score.user.username}](https://osu.ppy.sh/u/${score.user.id})**
                                   Score set on ${score.created_at}
                                   ${(score.accuracy * 100).toFixed(2)}% | ${score.rank} | ${score.pp}pp
                                   ${ifmods} ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.max_combo}x/**${mapdata.max_combo}x**
                                   ${hitlist}
                                `} catch (error) {

                                    }
                                }
                                if (lbdata.length < 1 || scoretxt.length < 10) {
                                    scoretxt = 'Error - no scores found '
                                }
                                if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
                                    scoretxt = 'Error - map is unranked'
                                }
                                lbEmbed.setDescription(`${scoretxt}`)
                                if (interaction.type != Discord.InteractionType.MessageComponent) {
                                    interaction.reply({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));
                                } else {
                                    message.edit({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                                    //message.edit({ embeds: [lbEmbed], allowedMentions: { repliedUser: false } })
                                }

                            })
                    }
                    else {
                        let oldmsu = `https://osu.ppy.sh/api/get_scores?k=${config.osuApiKey}&b=${mapid}&mods=${osucalc.ModStringToInt(osucalc.shortModName(mods))}&limit=100`
                        fetch(oldmsu, {})
                            .then(res => res.json() as any)
                            .then(lbdata => {

                                fs.writeFileSync('debugosu/maplbapiv1.json', JSON.stringify(lbdata, null, 2))
                                //interaction.reply({ content: 'a...', allowedMentions: { repliedUser: false } })
                                let lbEmbed = new Discord.EmbedBuilder()
                                    .setTitle(`TOP 5 SCORES FOR ${fulltitle}`)
                                    .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                    .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                                    .setFooter({ text: `mods: ${mods}` })
                                    ;

                                let scoretxt = `Page: ${page + 1}/${Math.ceil((lbdata as any).length / 5)}`



                                for (i = 0; i < (lbdata as any).length && i < 5; i++) {
                                    let hitlist;
                                    let acc;
                                    let score = lbdata[i + (page * 5)]
                                    let mode = mapdata.mode
                                    switch (mode) {
                                        case 'osu':
                                            hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countmiss}`
                                            acc = osucalc.calcgrade(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy
                                            break;
                                        case 'taiko':
                                            hitlist = `${score.count300}/${score.count100}/${score.countmiss}`
                                            acc = osucalc.calcgradeTaiko(parseInt(score.count300), parseInt(score.count100), parseInt(score.countmiss)).accuracy
                                            break;
                                        case 'fruits':
                                            hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countkatu}/${score.countmiss}`
                                            acc = osucalc.calcgradeCatch(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countkatu), parseInt(score.countmiss)).accuracy
                                            break;
                                        case 'mania':
                                            hitlist = `${score.countgeki}/${score.count300}/${score.countkatu}/${score.count100}/${score.count50}/${score.countmiss}`
                                            acc = osucalc.calcgradeMania(parseInt(score.countgeki), parseInt(score.count300), parseInt(score.countkatu), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy
                                            break;
                                    }
                                    scoretxt += `
                                    **[Score #${i + (page * 5) + 1}](https://osu.ppy.sh/scores/${mode}/${score.score_id}) | [${score.username}](https://osu.ppy.sh/u/${score.user_id})**
                                    Score set on ${score.date}
                                    ${(acc).toFixed(2)}% | ${score.rank} | ${score.pp}
                                    ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.maxcombo}x/**${mapdata.max_combo}x**
                                    ${hitlist}
                                    Has replay: ${score.replay_available == 1 ? '✅' : '❌'}
                                    `
                                }
                                if ((lbdata as any).length < 1 || scoretxt.length < 10) {
                                    scoretxt = 'Error - no scores found '
                                }
                                if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
                                    scoretxt = 'Error - map is unranked'
                                }
                                lbEmbed.setDescription(`${scoretxt}`)
                                if (interaction.type != Discord.InteractionType.MessageComponent) {
                                    interaction.reply({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));
                                } else {
                                    message.edit({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                                    //message.edit({ embeds: [lbEmbed], allowedMentions: { repliedUser: false } })
                                }

                            }).catch(err => {
                                console.log(err)
                            })
                    }

                })

        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}