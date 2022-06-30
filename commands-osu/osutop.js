const fs = require('fs');
const osucalc = require('osumodcalculator')
const { access_token } = require('../configs/osuauth.json')
const fetch = require('node-fetch')

module.exports = {
    name: 'osutop',
    description: 'Displays the top plays of the user\n' +
        'Command: `sbr-osutop <user>`\n' +
        'Slash Command: `/osutop [user] [mode] [sort] [page] [mapper] [mods] [detailed]`\n' +
        'Options:\n' +
        '⠀⠀`user`: string, optional. The user to display the top plays of\n' +
        '⠀⠀`mode`: string, optional. The mode of the user\n' +
        '⠀⠀`sort`: string, optional. Sort plays by this value\n' +
        '⠀⠀`page`: integer, optional. The page to display the top plays of\n' +
        '⠀⠀`mapper`: string, optional. Filter the top plays to show maps from this mapper\n' +
        '⠀⠀`mods`: string, optional. Filter the top plays to show only plays with these mods\n' +
        '⠀⠀`detailed`: boolean, optional. Whether to display extra details\n'
    ,

    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - osutop (message)\n${currentDate} | ${currentDateISO}\n recieved osu! top plays command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            let user = args.join(' ')
            if (user.length < 1) {
                findname = await userdata.findOne({ where: { userid: message.author.id } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return message.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false } })
                }
            }

            let gamemode = null
            if (gamemode == null) {
                findname = await userdata.findOne({ where: { userid: message.author.id } })
                if (findname != null) {
                    gamemode = findname.get('mode');
                } else {
                    gamemode = 'osu'
                }
            }

            let sort = null
            let page = null
            if (page == null || page < 1) {
                page = 0
            } else {
                page = page - 1
            }
            let mapper = null
            let mods = null
            let detailed = null

            let userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`;
            fetch(userurl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(osudata => {
                    fs.writeFileSync('debugosu/osutopname.json', JSON.stringify(osudata, null, 2))
                    try {
                        let userid = osudata.id
                        let usertopurl = `https://osu.ppy.sh/api/v2/users/${userid}/scores/best?mode=${gamemode}&limit=100&offset=0`;
                        fetch(usertopurl, {
                            headers: {
                                Authorization: `Bearer ${access_token}`
                            }
                        }).then(res => res.json())
                            .then(osutopdata => {
                                fs.writeFileSync('debugosu/osutop.json', JSON.stringify(osutopdata, null, 2))
                                try {
                                    let usernametesting = osutopdata[0].user.username
                                } catch (error) {
                                    return message.reply({ content: 'failed to get osu! top plays', allowedMentions: { repliedUser: false } })
                                }
                                let topEmbed = new Discord.MessageEmbed()
                                    .setColor(0x462B71)
                                    .setTitle(`Top plays of ${osutopdata[0].user.username}`)
                                    .setThumbnail(`https://a.ppy.sh/${osutopdata[0].user.id}`)
                                for (let i = 0; i < 5 && i < osutopdata.length; i++) {
                                    let scoreoffset = page * 5 + i

                                    let score = osutopdata[scoreoffset].score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hitgeki = osutopdata[scoreoffset].statistics.count_geki.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hit300 = osutopdata[scoreoffset].statistics.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hitkatu = osutopdata[scoreoffset].statistics.count_katu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hit100 = osutopdata[scoreoffset].statistics.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hit50 = osutopdata[scoreoffset].statistics.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let miss = osutopdata[scoreoffset].statistics.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let combo = osutopdata[scoreoffset].max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let maptimeset = osutopdata[scoreoffset].created_at.toString().slice(0, 19).replace("T", " ")

                                    let ranking = osutopdata[scoreoffset].rank.toUpperCase()
                                    if (ranking == 'F') {
                                        grade = '---'
                                    } else if (ranking == 'D') {
                                        grade = '<:rankingD:927797179534438421>'
                                    } else if (ranking == 'C') {
                                        grade = '<:rankingC:927797179584757842>'
                                    }
                                    else if (ranking == 'B') {
                                        grade = '<:rankingB:927797179697991700>'
                                    }
                                    else if (ranking == 'A') {
                                        grade = '<:rankingA:927797179739930634>'
                                    }
                                    else if (ranking == 'S') {
                                        grade = '<:rankingS:927797179618295838>'
                                    }
                                    else if (ranking == 'SH') {
                                        grade = '<:rankingSH:927797179710570568>'
                                    }
                                    else if (ranking == 'X') {
                                        grade = '<:rankingX:927797179832229948>'
                                    }
                                    else if (ranking == 'XH') {
                                        grade = '<:rankingxh:927797179597357076>'
                                    }


                                    let hitlist = ''
                                    if (gamemode == 'osu') {
                                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                                    }
                                    if (gamemode == 'taiko') {
                                        hitlist = `${hit300}/${hit100}/${miss}`
                                    }
                                    if (gamemode == 'fruits' || gamemode == 'catch') {
                                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                                    }
                                    if (gamemode == 'mania') {
                                        hitlist = `${hitgeki}/${hit300}/${hitkatu}/${hit100}/${hit50}/${miss}`
                                    }
                                    topmods = osutopdata[scoreoffset].mods

                                    if (!topmods || topmods == '' || topmods == 'undefined' || topmods == null || topmods == undefined) {
                                        ifmods = ''
                                    } else {
                                        ifmods = '+' + topmods.toString().replaceAll(",", '')
                                    }
                                    topEmbed.addField(`#${scoreoffset + 1}`,
                                        `
                                [**${osutopdata[scoreoffset].beatmapset.title} [${osutopdata[scoreoffset].beatmap.version}]**](https://osu.ppy.sh/b/${osutopdata[scoreoffset].beatmap.id}) ${ifmods}
                                **Score set on** ${maptimeset}
                                **SCORE:** ${score} | x${combo} | ${Math.abs(osutopdata[scoreoffset].accuracy * 100).toFixed(2)}% | ${grade}
                                \`${hitlist}\`
                                ${(osutopdata[scoreoffset].pp).toFixed(2)}pp | ${(osutopdata[scoreoffset].weight.pp).toFixed(2)}pp (Weighted at **${(osutopdata[scoreoffset].weight.percentage).toFixed(2)}%**)
                                `, false)
                                }
                                message.reply({ content: '⠀', embeds: [topEmbed], allowedMentions: { repliedUser: false } })
                                fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                            })
                    } catch (error) {
                        message.reply('user ' + user + ' not found')
                        fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                    }
                })

        }

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - osutop (interaction)\n${currentDate} | ${currentDateISO}\n recieved osu! top plays command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let user = interaction.options.getString('user')
            if (user == null) {
                findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return interaction.reply('no osu! username found')
                }
            }
            let gamemode = interaction.options.getString('mode')
            if (gamemode == null) {
                findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname != null) {
                    gamemode = findname.get('mode');
                } else {
                    gamemode = 'osu'
                }
            }

            let sort = interaction.options.getString('sort')
            let page = interaction.options.getInteger('page')
            if (page == null || page < 1) {
                page = 0
            } else {
                page = page - 1
            }
            let mapper = interaction.options.getString('mapper')
            let mods = interaction.options.getString('mods')
            let detailed = interaction.options.getBoolean('detailed')

            let userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`;
            fetch(userurl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(osudata => {
                    fs.writeFileSync('debugosu/osutopname.json', JSON.stringify(osudata, null, 2))
                    try {
                        let userid = osudata.id
                        //interaction.reply('Loading...')
                        let usertopurl = `https://osu.ppy.sh/api/v2/users/${userid}/scores/best?mode=${gamemode}&limit=100&offset=0`;
                        fetch(usertopurl, {
                            headers: {
                                Authorization: `Bearer ${access_token}`
                            }
                        }).then(res => res.json())
                            .then(osutopdataPreSort => {
                                fs.writeFileSync('debugosu/osutop.json', JSON.stringify(osutopdataPreSort, null, 2))
                                try {
                                    let usernametesting = osutopdataPreSort[0].user.username
                                } catch (error) {
                                    return interaction.reply('failed to get osu! top plays')
                                }
                                filtereddata = osutopdataPreSort
                                filterinfo = ''
                                if (mapper != null) {
                                    //filter by mapper
                                    filtereddata = osutopdataPreSort.filter(array => array.beatmapset.creator.toLowerCase() == mapper.toLowerCase())
                                    filterinfo += `\nmapper: ${mapper}`
                                }
                                calcmods = osucalc.OrderMods(mods + '')
                                if (calcmods.length < 1) {
                                    calcmods = 'NM'
                                    mods == null
                                }
                                if (mods != null && !mods.includes('any')) {
                                    filtereddata = osutopdataPreSort.filter(array => array.mods.toString().replaceAll(',', '') == calcmods)
                                    filterinfo += `\nmods: ${mods}`
                                }
                                if (mods != null && mods.includes('any')) {
                                    filtereddata = osutopdataPreSort.filter(array => array.mods.toString().replaceAll(',', '').includes(calcmods))
                                    filterinfo += `\nmods: ${mods}`
                                }
                                osutopdata = filtereddata
                                if (sort == 'score') {
                                    osutopdata = filtereddata.sort((a, b) => b.score - a.score)
                                    filterinfo += `\nsorted by score`
                                }
                                if (sort == 'acc') {
                                    osutopdata = filtereddata.sort((a, b) => b.accuracy - a.accuracy)
                                    filterinfo += `\nsorted by accuracy`
                                }
                                if (sort == 'combo') {
                                    osutopdata = filtereddata.sort((a, b) => b.max_combo - a.max_combo)
                                    filterinfo += `\nsorted by combo`
                                }
                                if (sort == 'pp' || sort == null) {
                                    osutopdata = filtereddata.sort((a, b) => b.pp - a.pp)
                                    filterinfo += `\nsorted by pp`
                                }
                                if (sort == 'recent') {
                                    osutopdata = filtereddata.sort((a, b) => Math.abs(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - Math.abs(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
                                    filterinfo += `\nsorted by recent`
                                }
                                try {
                                    let usernamefortests = osutopdata[0].user.username

                                } catch (error) {
                                    return interaction.reply('no plays found for the options given')
                                }
                                let topEmbed = new Discord.MessageEmbed()
                                    .setColor(0x462B71)
                                    .setTitle(`Top plays of ${osutopdata[0].user.username}`)
                                    .setThumbnail(`https://a.ppy.sh/${osutopdata[0].user.id}`)
                                    .setDescription(`${filterinfo}\nPage: ${page + 1}/${Math.ceil(osutopdata.length / 5)}`)
                                for (let i = 0; i < 5 && i < osutopdata.length; i++) {
                                    let scoreoffset = page * 5 + i

                                    let score = osutopdata[scoreoffset].score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hitgeki = osutopdata[scoreoffset].statistics.count_geki.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hit300 = osutopdata[scoreoffset].statistics.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hitkatu = osutopdata[scoreoffset].statistics.count_katu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hit100 = osutopdata[scoreoffset].statistics.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let hit50 = osutopdata[scoreoffset].statistics.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let miss = osutopdata[scoreoffset].statistics.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let combo = osutopdata[scoreoffset].max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let maptimeset = osutopdata[scoreoffset].created_at.toString().slice(0, 19).replace("T", " ")

                                    let ranking = osutopdata[scoreoffset].rank.toUpperCase()
                                    if (ranking == 'F') {
                                        grade = '---'
                                    } else if (ranking == 'D') {
                                        grade = '<:rankingD:927797179534438421>'
                                    } else if (ranking == 'C') {
                                        grade = '<:rankingC:927797179584757842>'
                                    }
                                    else if (ranking == 'B') {
                                        grade = '<:rankingB:927797179697991700>'
                                    }
                                    else if (ranking == 'A') {
                                        grade = '<:rankingA:927797179739930634>'
                                    }
                                    else if (ranking == 'S') {
                                        grade = '<:rankingS:927797179618295838>'
                                    }
                                    else if (ranking == 'SH') {
                                        grade = '<:rankingSH:927797179710570568>'
                                    }
                                    else if (ranking == 'X') {
                                        grade = '<:rankingX:927797179832229948>'
                                    }
                                    else if (ranking == 'XH') {
                                        grade = '<:rankingxh:927797179597357076>'
                                    }


                                    let hitlist = ''
                                    if (gamemode == 'osu') {
                                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                                    }
                                    if (gamemode == 'taiko') {
                                        hitlist = `${hit300}/${hit100}/${miss}`
                                    }
                                    if (gamemode == 'fruits' || gamemode == 'catch') {
                                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                                    }
                                    if (gamemode == 'mania') {
                                        hitlist = `${hitgeki}/${hit300}/${hitkatu}/${hit100}/${hit50}/${miss}`
                                    }
                                    topmods = osutopdata[scoreoffset].mods

                                    if (!topmods || topmods == '' || topmods == 'undefined' || topmods == null || topmods == undefined) {
                                        ifmods = ''
                                    } else {
                                        ifmods = '+' + topmods.toString().replaceAll(",", '')
                                    }
                                    topEmbed.addField(`#${scoreoffset + 1}`,
                                        `
                                [**${osutopdata[scoreoffset].beatmapset.title} [${osutopdata[scoreoffset].beatmap.version}]**](https://osu.ppy.sh/b/${osutopdata[scoreoffset].beatmap.id}) ${ifmods}
                                **Score set on** ${maptimeset}
                                **SCORE:** ${score} | x${combo} | ${Math.abs(osutopdata[scoreoffset].accuracy * 100).toFixed(2)}% | ${grade}
                                \`${hitlist}\`
                                ${(osutopdata[scoreoffset].pp).toFixed(2)}pp | ${(osutopdata[scoreoffset].weight.pp).toFixed(2)}pp (Weighted at **${(osutopdata[scoreoffset].weight.percentage).toFixed(2)}%**)
                                `, false)
                                }
                                if (detailed == true) {
                                    let highestcombo = (osutopdata.sort((a, b) => b.max_combo - a.max_combo))[0].max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let maxpp = ((osutopdata.sort((a, b) => b.pp - a.pp))[0].pp).toFixed(2)
                                    let minpp = ((osutopdata.sort((a, b) => a.pp - b.pp))[0].pp).toFixed(2)
                                    let avgpp;
                                    let totalpp = 0;
                                    for (i2 = 0; i2 < osutopdata.length; i2++) {
                                        totalpp += osutopdata[i2].pp
                                    }
                                    avgpp = (totalpp / osutopdata.length).toFixed(2)
                                    if (gamemode == 'osu') {
                                        hittype = `hit300/hit100/hit50/miss`
                                    }
                                    if (gamemode == 'taiko') {
                                        hitlist = `Great(300)/Good(100)/miss`
                                    }
                                    if (gamemode == 'fruits' || gamemode == 'catch') {
                                        hitlist = `Fruit(300)/Drops(100)/Droplets(50)/miss`
                                    }
                                    if (gamemode == 'mania') {
                                        hitlist = `300+(geki)/300/200(katu)/100/50/miss`
                                    }
                                    topEmbed.addField(
                                        '-', `
                                    **Most common mapper:** ${modemappers(osutopdata).beatmapset.creator}
                                    **Most common mods:** ${modemods(osutopdata).mods.toString().replaceAll(',', '')}
                                    **Gamemode:** ${gamemode}
                                    **Hits:** ${hittype}
                                    **Highest combo:** ${highestcombo}
                                `, true)
                                    topEmbed.addField(
                                        '-', `
                                    **Highest pp:** ${maxpp}
                                    **Lowest pp:** ${minpp}
                                    **Average pp:** ${avgpp}
                                    **Highest accuracy:** ${((osutopdata.sort((a, b) => b.accuracy - a.accuracy))[0].accuracy * 100).toFixed(2)}%
                                    **Lowest accuracy:** ${((osutopdata.sort((a, b) => a.accuracy - b.accuracy))[0].accuracy * 100).toFixed(2)}%
                                `, true)
                                } else {

                                }
                                function modemods(arr) {
                                    return arr.sort((a, b) => //swap b and a to make it least common
                                        arr.filter(v => v.mods === a.mods).length
                                        - arr.filter(v => v.mods === b.mods).length
                                    ).pop();
                                }
                                function modemappers(arr) {
                                    return arr.sort((a, b) => //swap b and a to make it least common
                                        arr.filter(v => v.beatmapset.creator === a.beatmapset.creator).length
                                        - arr.filter(v => v.beatmapset.creator === b.beatmapset.creator).length
                                    ).pop();
                                }
                                interaction.reply({ content: '⠀', embeds: [topEmbed] })
                                fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}\nsort: ${sort}\nmapperfilter: ${mapper}\nmode: ${gamemode}\nmods filter: ${mods}\npage: ${page}\ndetailed: ${detailed}`)
                            })
                    } catch (error) {
                        interaction.reply('user ' + user + ' not found')
                        fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}\nsort: ${sort}\nmapperfilter: ${mapper}\nmode: ${gamemode}\nmods filter: ${mods}\npage: ${page}\ndetailed: ${detailed}`)

                    }
                })
        }
    }
}