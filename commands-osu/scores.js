const fetch = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../configs/osuauth.json')

module.exports = {
    name: 'scores',
    description: 'Displays the scores of the user on a specified beatmap\n' +
        'Command: `sbr-scores [user] [id]`\n' +
        'Slash Command: `/sbr scores [user] [id] [sort]`\n' +
        'Options:\n' +
        '⠀⠀`user`: string/integer, optional. The username or id of the player\n' +
        '⠀⠀`id`: integer, optional. The id of the beatmap to display the scores of. If omitted, the last requested map will be used\n' +
        '⠀⠀`sort`: string, optional. The sort to display the top plays of. Valid values: `score`, `accuracy`, `pp`, `recent`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
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
            let user = args.join(' ')
            let id = null
            if (user == null || user.length == 0) {
                findname = await userdata.findOne({ where: { userid: message.author.id } })
                if (findname == null) {
                    return message.reply('Error - no username found')
                } else {
                    user = findname.get('osuname')
                    if (user.length < 1) {
                        return message.reply('Error - no username found')
                    }
                }
            }
            if (id == null) {
                id = prevmap.id
            }
            const userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`

            fetch(userurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(userdata => {
                    if (userdata.length < 1) {
                        return message.reply('Error - no user found')
                    }
                    let userid = userdata.id

                    const scoreurl = `https://osu.ppy.sh/api/v2/beatmaps/${id}/scores/users/${userid}/all`
                    fetch(scoreurl, {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        }
                    }).then(res => res.json())
                        .then(scoredataPreSort => {
                            fs.writeFileSync('debugosu/scorespresort.json', JSON.stringify(scoredataPreSort, null, 2));
                            const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${id}`
                            scoredata = scoredataPreSort
                            let sortdata

                            scoredata = scoredataPreSort.scores.sort((a, b) =>
                                Math.abs(b.created_at.slice(0, 19).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "").replaceAll("+", "")) -
                                Math.abs(a.created_at.slice(0, 19).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "").replaceAll("+", "")))
                            sortdata = 'Sorted by: Most recent'





                            fetch(mapurl, {
                                headers: {
                                    'Authorization': `Bearer ${access_token}`
                                }
                            }).then(res => res.json())
                                .then(mapdata => {
                                    fs.writeFileSync('debugosu/scoresmap.json', JSON.stringify(mapdata, null, 2));
                                    fs.writeFileSync('debugosu/scores.json', JSON.stringify(scoredata, null, 2));
                                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));


                                    maptitle = mapdata.beatmapset.title
                                    if (mapdata.beatmapset.title != mapdata.beatmapset.title_unicode) {
                                        maptitle = `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})`
                                    }

                                    let Embed = new Discord.MessageEmbed()
                                        .setColor('#0099ff')
                                        .setTitle(`${maptitle} [${mapdata.version}]`)
                                        .setThumbnail(`${mapdata.beatmapset.covers['list@2x']}`)
                                        .setAuthor({ name: `${userdata.username}`, url: `https://osu.ppy.sh/u/${userdata.id}`, iconURL: `https://a.ppy.sh/${userdata.id}` })
                                    let scoretxt = ''
                                    if (!scoredata || scoredata.length == 0) {
                                        scoretxt = 'Error - no scores found.'
                                    } else {
                                        scoretxt += sortdata + '\n'
                                        for (let i = 0; i < scoredata.length; i++) {
                                            let score = scoredata[i]
                                            let scorestats = score.statistics
                                            let scoremode = score.mode_int
                                            let mods = score.mods
                                            if (mods.toString().length != 0) {
                                                ifmods = '**+' + mods.toString().replaceAll(',', '') + '**'
                                            } else {
                                                ifmods = ''
                                            }
                                            let hitlist = ''
                                            switch (scoremode) {
                                                case 0: //osu
                                                    hitlist = `${scorestats.count_300}/${scorestats.count_100}/${scorestats.count_50}/${scorestats.count_miss}`
                                                    break;
                                                case 1: //taiko
                                                    hitlist = `${scorestats.count_300}/${scorestats.count_50}/${scorestats.count_miss}`
                                                    break;
                                                case 2: //fruits catch
                                                    hitlist = `${scorestats.count_300}/${scorestats.count_100}/${scorestats.count_50}/${scorestats.count_miss}`
                                                    break;
                                                case 3: //mania
                                                    hitlist = `${scorestats.count_geki}/${scorestats.count_300}/${scorestats.count_katu}/${scorestats.count_100}/${scorestats.count_50}/${scorestats.count_miss}`
                                                    break;
                                            }
                                            let ranking = score.rank
                                            switch (ranking) {
                                                case 'D':
                                                    grade = '<:rankingD:927797179534438421>'
                                                    break;
                                                case 'C':
                                                    grade = '<:rankingC:927797179584757842>'
                                                    break;
                                                case 'B':
                                                    grade = '<:rankingB:927797179697991700>'
                                                    break;
                                                case 'A':
                                                    grade = '<:rankingA:927797179739930634>'
                                                    break;
                                                case 'S':
                                                    grade = '<:rankingS:927797179618295838>'
                                                    break;
                                                case 'SH':
                                                    grade = '<:rankingSH:927797179710570568>'
                                                    break;
                                                case 'X':
                                                    grade = '<:rankingX:927797179832229948>'
                                                    break;
                                                case 'XH':
                                                    grade = '<:rankingxh:927797179597357076>'
                                                    break;
                                            };


                                            scoretxt +=
                                                `-
                                                **[Score #${i + 1}](https://osu.ppy.sh/scores/${score.id})** ${ifmods} | ${score.created_at.toString()}
                                                ${(score.accuracy * 100).toFixed(2)} | ${grade} | ${score.pp.toFixed(2)}pp
                                                \`${hitlist}\` | ${score.max_combo}x/**${mapdata.max_combo}x**\n`

                                        }
                                    }
                                    Embed.setDescription(scoretxt)
                                    message.reply({ embeds: [Embed] })
                                })
                        })
                })

        }

        if (interaction != null) {
            let user = interaction.options.getString('username')

            let id = interaction.options.getNumber('id')
            let sort = interaction.options.getString('sort')

            if (user == null || user.length == 0) {
                findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname == null) {
                    return interaction.reply('Error - no username found')
                } else {
                    user = findname.get('osuname')
                    if (user.length < 1) {
                        return interaction.reply('Error - no username found')
                    }
                }
            }
            if (id == null) {
                id = prevmap.id
            }
            if (sort == null) {
                sort = 'recent'
            }
            const userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`

            fetch(userurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(userdata => {
                    if (userdata.length < 1) {
                        return interaction.reply('Error - no user found')
                    }
                    let userid = userdata.id

                    const scoreurl = `https://osu.ppy.sh/api/v2/beatmaps/${id}/scores/users/${userid}/all`
                    fetch(scoreurl, {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        }
                    }).then(res => res.json())
                        .then(scoredataPreSort => {
                            fs.writeFileSync('debugosu/scorespresort.json', JSON.stringify(scoredataPreSort, null, 2));
                            const mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${id}`
                            scoredata = scoredataPreSort
                            let sortdata = ''
                            if (sort == 'score') {
                                scoredata = scoredataPreSort.scores.sort((a, b) => b.score - a.score)
                                sortdata = 'Sorted by: score'
                            }
                            if (sort == 'acc') {
                                scoredata = scoredataPreSort.scores.sort((a, b) => b.accuracy - a.accuracy)
                                sortdata = 'Sorted by: accuracy'
                            }
                            if (sort == 'pp') {
                                scoredata = scoredataPreSort.scores.sort((a, b) => b.pp - a.pp)
                                sortdata = 'Sorted by: pp'
                            }
                            if (sort == 'recent') {
                                scoredata = scoredataPreSort.scores.sort((a, b) =>
                                    Math.abs(b.created_at.slice(0, 19).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "").replaceAll("+", "")) -
                                    Math.abs(a.created_at.slice(0, 19).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "").replaceAll("+", "")))
                                sortdata = 'Sorted by: Most recent'
                            }




                            fetch(mapurl, {
                                headers: {
                                    'Authorization': `Bearer ${access_token}`
                                }
                            }).then(res => res.json())
                                .then(mapdata => {
                                    fs.writeFileSync('debugosu/scoresmap.json', JSON.stringify(mapdata, null, 2));
                                    fs.writeFileSync('debugosu/scores.json', JSON.stringify(scoredata, null, 2));
                                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapdata.id }), null, 2));


                                    maptitle = mapdata.beatmapset.title
                                    if (mapdata.beatmapset.title != mapdata.beatmapset.title_unicode) {
                                        maptitle = `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})`
                                    }

                                    let Embed = new Discord.MessageEmbed()
                                        .setColor('#0099ff')
                                        .setTitle(`${maptitle} [${mapdata.version}]`)
                                        .setThumbnail(`${mapdata.beatmapset.covers['list@2x']}`)
                                        .setAuthor({ name: `${userdata.username}`, url: `https://osu.ppy.sh/u/${userdata.id}`, iconURL: `https://a.ppy.sh/${userdata.id}` })
                                    let scoretxt = ''
                                    if (!scoredata || scoredata.length == 0) {
                                        scoretxt = 'Error - no scores found.'
                                    } else {
                                        scoretxt += sortdata + '\n'
                                        for (let i = 0; i < scoredata.length; i++) {
                                            let score = scoredata[i]
                                            let scorestats = score.statistics
                                            let scoremode = score.mode_int
                                            let mods = score.mods
                                            if (mods.toString().length != 0) {
                                                ifmods = '**+' + mods.toString().replaceAll(',', '') + '**'
                                            } else {
                                                ifmods = ''
                                            }
                                            let hitlist = ''
                                            switch (scoremode) {
                                                case 0: //osu
                                                    hitlist = `${scorestats.count_300}/${scorestats.count_100}/${scorestats.count_50}/${scorestats.count_miss}`
                                                    break;
                                                case 1: //taiko
                                                    hitlist = `${scorestats.count_300}/${scorestats.count_50}/${scorestats.count_miss}`
                                                    break;
                                                case 2: //fruits catch
                                                    hitlist = `${scorestats.count_300}/${scorestats.count_100}/${scorestats.count_50}/${scorestats.count_miss}`
                                                    break;
                                                case 3: //mania
                                                    hitlist = `${scorestats.count_geki}/${scorestats.count_300}/${scorestats.count_katu}/${scorestats.count_100}/${scorestats.count_50}/${scorestats.count_miss}`
                                                    break;
                                            }
                                            let ranking = score.rank
                                            switch (ranking) {
                                                case 'D':
                                                    grade = '<:rankingD:927797179534438421>'
                                                    break;
                                                case 'C':
                                                    grade = '<:rankingC:927797179584757842>'
                                                    break;
                                                case 'B':
                                                    grade = '<:rankingB:927797179697991700>'
                                                    break;
                                                case 'A':
                                                    grade = '<:rankingA:927797179739930634>'
                                                    break;
                                                case 'S':
                                                    grade = '<:rankingS:927797179618295838>'
                                                    break;
                                                case 'SH':
                                                    grade = '<:rankingSH:927797179710570568>'
                                                    break;
                                                case 'X':
                                                    grade = '<:rankingX:927797179832229948>'
                                                    break;
                                                case 'XH':
                                                    grade = '<:rankingxh:927797179597357076>'
                                                    break;
                                            };


                                            scoretxt +=
                                                `-
                                                **[Score #${i + 1}](https://osu.ppy.sh/scores/${score.id})** ${ifmods} | ${score.created_at.toString()}
                                                ${(score.accuracy * 100).toFixed(2)} | ${grade} | ${score.pp.toFixed(2)}pp
                                                \`${hitlist}\` | ${score.max_combo}x/**${mapdata.max_combo}x**\n`

                                        }
                                    }
                                    Embed.setDescription(scoretxt)
                                    interaction.reply({ embeds: [Embed] })
                                })
                        })
                })

        }
    }
}