const fetch = require('node-fetch');
const fs = require('fs');
const { access_token } = require('../configs/osuauth.json')
const emojis = require('../configs/emojis.js')

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
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - scores (message)\n${currentDate} | ${currentDateISO}\n recieved map scores command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            let user = args.join(' ')
            let id = null
            if (user == null || user.length == 0) {
                findname = await userdata.findOne({ where: { userid: message.author.id } })
                if (findname == null) {
                    return message.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
                } else {
                    user = findname.get('osuname')
                    if (user.length < 1) {
                        return message.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
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
                        return message.reply({ content: 'Error - no user found', allowedMentions: { repliedUser: false } })
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

                            try {
                                scoredata = scoredataPreSort.scores.sort((a, b) =>
                                    Math.abs(b.created_at.slice(0, 19).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "").replaceAll("+", "")) -
                                    Math.abs(a.created_at.slice(0, 19).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "").replaceAll("+", "")))
                                sortdata = 'Sorted by: Most recent'
                            } catch (error) {
                                return message.reply({ content: 'Error - no scores found', allowedMentions: { repliedUser: false } })
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
                                                case 'F':
                                                    grade = emojis.grades.F
                                                    break;
                                                case 'D':
                                                    grade = emojis.grades.D
                                                    break;
                                                case 'C':
                                                    grade = emojis.grades.C
                                                    break;
                                                case 'B':
                                                    grade = emojis.grades.B
                                                    break;
                                                case 'A':
                                                    grade = emojis.grades.A
                                                    break;
                                                case 'S':
                                                    grade = emojis.grades.S
                                                    break;
                                                case 'SH':
                                                    grade = emojis.grades.SH
                                                    break;
                                                case 'X':
                                                    grade = emojis.grades.X
                                                    break;
                                                case 'XH':
                                                    grade = emojis.grades.XH
                                                    break;
                                            };


                                            scoretxt +=
                                                `-
                                                **[Score #${i + 1}](https://osu.ppy.sh/scores/${score.mode}/${score.id})** ${ifmods} | ${score.created_at.toString()}
                                                ${(score.accuracy * 100).toFixed(2)} | ${grade} | ${score.pp.toFixed(2)}pp
                                                \`${hitlist}\` | ${score.max_combo}x/**${mapdata.max_combo}x**\n`

                                        }
                                    }
                                    Embed.setDescription(scoretxt)
                                    message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } })
                                    fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                    fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                                })
                        })
                })

        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - scores (interaction)\n${currentDate} | ${currentDateISO}\n recieved map scores command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let user = interaction.options.getString('username')

            let id = interaction.options.getNumber('id')
            let sort = interaction.options.getString('sort')

            if (user == null || user.length == 0) {
                findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname == null) {
                    return interaction.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
                } else {
                    user = findname.get('osuname')
                    if (user.length < 1) {
                        return interaction.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
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
                        return interaction.reply({ content: 'Error - no user found', allowedMentions: { repliedUser: false } })
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
                            try {
                                if (interaction.options.getBoolean("reverse") != true) {
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
                                    if (sort == 'combo') {
                                        scoredata = scoredataPreSort.scores.sort((a, b) => b.max_combo - a.max_combo)
                                        sortdata = 'Sorted by: highest combo'
                                    }
                                    if (sort == 'miss') {
                                        scoredata = scoredataPreSort.scores.sort((a, b) => a.statistics.count_miss - b.statistics.count_miss)
                                        sortdata = 'Sorted by: least misses'
                                    }
                                } else {
                                    if (sort == 'score') {
                                        scoredata = scoredataPreSort.scores.sort((a, b) => a.score - b.score)
                                        sortdata = 'Sorted by: lowest score'
                                    }
                                    if (sort == 'acc') {
                                        scoredata = scoredataPreSort.scores.sort((a, b) => a.accuracy - b.accuracy)
                                        sortdata = 'Sorted by: lowest accuracy'
                                    }
                                    if (sort == 'pp') {
                                        scoredata = scoredataPreSort.scores.sort((a, b) => a.pp - b.pp)
                                        sortdata = 'Sorted by: lowest pp'
                                    }
                                    if (sort == 'recent') {
                                        scoredata = scoredataPreSort.scores.sort((a, b) =>
                                            Math.abs(a.created_at.slice(0, 19).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "").replaceAll("+", "")) -
                                            Math.abs(b.created_at.slice(0, 19).replaceAll("-", "").replaceAll("T", "").replaceAll(":", "").replaceAll("+", "")))
                                        sortdata = 'Sorted by: oldest'
                                    }
                                    if (sort == 'combo') {
                                        scoredata = scoredataPreSort.scores.sort((a, b) => a.max_combo - b.max_combo)
                                        sortdata = 'Sorted by: lowest combo'
                                    }
                                    if (sort == 'miss') {
                                        scoredata = scoredataPreSort.scores.sort((a, b) => b.statistics.count_miss - a.statistics.count_miss)
                                        sortdata = 'Sorted by: highest misses'
                                    }
                                }
                                if (interaction.options.getBoolean('compact') == true) {
                                    filterinfo += `\ncompact mode`
                                }
                            } catch (error) {
                                return interaction.reply({ content: 'Error - no scores found', allowedMentions: { repliedUser: false } })
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
                                                case 'F':
                                                    grade = emojis.grades.F
                                                    break;
                                                case 'D':
                                                    grade = emojis.grades.D
                                                    break;
                                                case 'C':
                                                    grade = emojis.grades.C
                                                    break;
                                                case 'B':
                                                    grade = emojis.grades.B
                                                    break;
                                                case 'A':
                                                    grade = emojis.grades.A
                                                    break;
                                                case 'S':
                                                    grade = emojis.grades.S
                                                    break;
                                                case 'SH':
                                                    grade = emojis.grades.SH
                                                    break;
                                                case 'X':
                                                    grade = emojis.grades.X
                                                    break;
                                                case 'XH':
                                                    grade = emojis.grades.XH
                                                    break;
                                            };

                                            if (interaction.options.getBoolean('compact') == true) {
                                                scoretxt += `
                                            **[Score #${i + 1}](https://osu.ppy.sh/scores/${score.mode}/${score.id})**
                                            ${(score.accuracy * 100).toFixed(2)}% | ${score.pp}pp | ${ifmods}`
                                            }
                                            else {
                                                scoretxt +=
                                                    `-
                                                **[Score #${i + 1}](https://osu.ppy.sh/scores/${score.mode}/${score.id})** ${ifmods} | ${score.created_at.toString()}
                                                ${(score.accuracy * 100).toFixed(2)}% | ${grade} | ${score.pp}pp
                                                \`${hitlist}\` | ${score.max_combo}x/**${mapdata.max_combo}x**\n`
                                            }
                                        }
                                    }
                                    Embed.setDescription(scoretxt)
                                    interaction.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } })
                                    fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                    fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}\nmap id: ${id}\nsort: ${sort}`)

                                })
                        })
                })

        }
    }
}