const fs = require('fs')
const osucalc = require('osumodcalculator');
const fetch = require('node-fetch')
const { access_token } = require('../configs/osuauth.json')


module.exports = {
    name: 'leaderboard',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
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



        if (message != null) {
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
            }).then(res => res.json())
                .then(mapdata => {
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
                    }).then(res => res.json())
                        .then(lbdatapresort => {
                            let lbdata = lbdatapresort.scores

                            sctxt = ''
                            for (i = 0; i < lbdata.length; i++) {
                                sctxt += `\nhttps://osu.ppy.sh/scores/${lbdata[i].mode}/${lbdata[i].id}`
                            }
                            fs.writeFileSync('debugosu/maplbscores.txt', sctxt)
                            if (args[1] && args[1] == 'links' && lbdata.length > 0) {
                                message.reply({ files: ['debugosu/maplbscores.txt'], allowedMentions: { repliedUser: false } })
                                return;
                            }

                            fs.writeFileSync('debugosu/maplb.json', JSON.stringify(lbdata, null, 2))

                            let lbEmbed = new Discord.MessageEmbed()
                                .setTitle(`TOP 5 SCORES FOR ${fulltitle}`)
                                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                                ;

                            let scoretxt = ''

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
                                if (score.mods) {
                                    ifmods = `+${score.mods.join('')}`
                                } else {
                                    ifmods = ''
                                }

                                scoretxt += `
                                   **#${i + 1} | [${score.user.username}](https://osu.ppy.sh/u/${score.user.id})**
                                   Score set on ${score.created_at}
                                   ${(score.accuracy * 100).toFixed(2)}% | ${score.rank} | ${score.pp}pp
                                   ${ifmods} | ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.max_combo}x/**${mapdata.max_combo}x**
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
                            message.reply({ embeds: [lbEmbed], allowedMentions: { repliedUser: false } })
                            fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));
                        })


                })
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - leaderboard (interaction)\n${currentDate} | ${currentDateISO}\n recieved map leaderboard command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let mapid = interaction.options.getInteger('id')
            let page = interaction.options.getInteger('page')
            let mods1 = interaction.options.getString('mods')
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
            }).then(res => res.json())
                .then(mapdata => {
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
                        }).then(res => res.json())
                            .then(lbdatapresort => {
                                let lbdatatoarr = lbdatapresort.scores
                                let filtereddata = lbdatatoarr
                                let lbdata = lbdatatoarr
                                let filterinfo = ''

                                sctxt = ''
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

                                let lbEmbed = new Discord.MessageEmbed()
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
                                        if (score.mods) {
                                            ifmods = `+${score.mods.join('')}`
                                        } else {
                                            ifmods = ''
                                        }

                                        scoretxt += `
                                   **[#${i + page + 1}](https://osu.ppy.sh/scores/${score.mode}/${score.id}) | [${score.user.username}](https://osu.ppy.sh/u/${score.user.id})**
                                   Score set on ${score.created_at}
                                   ${(score.accuracy * 100).toFixed(2)}% | ${score.rank} | ${score.pp}pp
                                   ${ifmods} | ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.max_combo}x/**${mapdata.max_combo}x**
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
                                interaction.reply({ embeds: [lbEmbed], allowedMentions: { repliedUser: false } })
                                fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));

                            })
                    }
                    else {
                        let oldmsu = `https://osu.ppy.sh/api/get_scores?k=${config.osuApiKey}&b=${mapid}&mods=${osucalc.ModStringToInt(osucalc.shortModName(mods))}&limit=100`
                        fetch(oldmsu, {})
                            .then(res => res.json())
                            .then(lbdata => {

                                fs.writeFileSync('debugosu/maplbapiv1.json', JSON.stringify(lbdata, null, 2))
                                //interaction.reply({ content: 'a...', allowedMentions: { repliedUser: false } })
                                let lbEmbed = new Discord.MessageEmbed()
                                    .setTitle(`TOP 5 SCORES FOR ${fulltitle}`)
                                    .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                    .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                                    .setFooter({ text: `mods: ${mods}` })
                                    ;

                                let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`



                                for (i = 0; i < lbdata.length && i < 5; i++) {
                                    let score = lbdata[i + (page * 5)]
                                    let mode = mapdata.mode
                                    switch (mode) {
                                        case 'osu':
                                            hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countmiss}`
                                            acc = osucalc.calcgrade(score.count300, score.count100, score.count50, score.countmiss).accuracy
                                            break;
                                        case 'taiko':
                                            hitlist = `${score.count300}/${score.count100}/${score.countmiss}`
                                            acc = osucalc.calcgradeTaiko(score.count300, score.count100, score.countmiss).accuracy
                                            break;
                                        case 'fruits':
                                            hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countkatu}/${score.countmiss}`
                                            acc = osucalc.calcgradeCatch(score.count300, score.count100, score.count50, score.countkatu, score.countmiss).accuracy
                                            break;
                                        case 'mania':
                                            hitlist = `${score.countgeki}/${score.count300}/${score.countkatu}/${score.count100}/${score.count50}/${score.countmiss}`
                                            acc = osucalc.calcgradeMania(score.countgeki, score.count300, score.countkatu, score.count100, score.count50, score.countmiss).accuracy
                                            break;
                                    }
                                    scoretxt += `
                                    **[#${i + page + 1}](https://scores/${mode}/${score.score_id}) | [${score.username}](https://osu.ppy.sh/u/${score.user_id})**
                                    Score set on ${score.date}
                                    ${(acc).toFixed(2)}% | ${score.rank} | ${score.pp}
                                    ${score.score} | ${score.maxcombo}x/**${mapdata.max_combo}x**
                                    ${hitlist}
                                    `
                                }
                                if (lbdata.length < 1 || scoretxt.length < 10) {
                                    scoretxt = 'Error - no scores found '
                                }
                                if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
                                    scoretxt = 'Error - map is unranked'
                                }
                                lbEmbed.setDescription(`${scoretxt}`)
                                interaction.reply({ embeds: [lbEmbed], allowedMentions: { repliedUser: false } })
                                fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));

                            }).catch(err => {
                                console.log(err)
                            })
                    }
                    let mapscoresurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}/scores`
                    fs.writeFileSync('debugosu/maplbmap.json', JSON.stringify(mapdata, null, 2))
                    fetch(mapscoresurl, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        }
                    }).then(res => res.json())
                        .then(lbdatapresort => {
                            let lbdatatoarr = lbdatapresort.scores
                            let filtereddata = lbdatatoarr
                            let lbdata = lbdatatoarr
                            let filterinfo = ''


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

                            let lbEmbed = new Discord.MessageEmbed()
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
                                    if (score.mods) {
                                        ifmods = `+${score.mods.join('')}`
                                    } else {
                                        ifmods = ''
                                    }

                                    scoretxt += `
                                   **#${i + page + 1} | [${score.user.username}](https://osu.ppy.sh/u/${score.user.id})**
                                   Score set on ${score.created_at}
                                   ${(score.accuracy * 100).toFixed(2)}% | ${score.rank} | ${score.pp}pp
                                   ${ifmods} | ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.max_combo}x/**${mapdata.max_combo}x**
                                   ${hitlist}
                                `} catch (error) {

                                }
                            }
                            if (lbdata.length < 1 || scoretxt.length < 10) {
                                scoretxt = 'Error - no scores found '
                            }
                            if (mapdata.status == 'graveyard' || mapdata.status == 'pending'){
                                scoretxt = 'Error - map is unranked'
                            }
                            lbEmbed.setDescription(`${scoretxt}`)
                            interaction.reply({ embeds: [lbEmbed], allowedMentions: { repliedUser: false } })
                            fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));

                        })

                })

        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}