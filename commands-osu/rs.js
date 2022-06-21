const { access_token } = require('../configs/osuauth.json');
const fs = require('fs');
const osucalc = require('osumodcalculator')
const ppcalc = require('booba')
const fetch = require('node-fetch')

module.exports = {
    name: 'rs',
    description: 'Displays the most recent score for the user\n' + 
    'Command: `sbr-rs <user>`\n' +
    'Slash command: `/rs [user][page][mode]`\n' + 
    'Options:\n' +
    '⠀⠀`user`: The user to display the most recent score of\n' +
    '⠀⠀`page`: The page to display the most recent score of\n' +
    '⠀⠀`mode`: The mode to display the most recent score of\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - rs (message)\n${currentDate} | ${currentDateISO}\n recieved osu! recent play command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')

            let user = args.join(' ');
            let page = 0
            let mode = null

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
            if (mode == null) {
                findname = await userdata.findOne({ where: { userid: message.author.id } })
                if (findname == null) {
                    mode = 'osu'
                } else {
                    mode = findname.get('mode')
                    if (mode.length < 1) {
                        mode = 'osu'
                    }
                }
            }

            const userinfourl = `https://osu.ppy.sh/api/v2/users/${user}/osu`

            fetch(userinfourl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(osudata => {
                    let userid = osudata.id
                    if (!userid) {
                        return message.channel.send('Error - no user found')
                    }
                    const recentplayurl = `https://osu.ppy.sh/api/v2/users/${userid}/scores/recent?include_fails=1&mode=${mode}&limit=100&offset=${page}`
                    fetch(recentplayurl, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    }).then(res => res.json())
                        .then(rsdata => {
                            try {
                                fs.writeFileSync('debugosu/rs.json', JSON.stringify(rsdata, null, 2))

                                let hittime = rsdata[0].beatmap.hit_length
                                let hitseconds = (hittime % 60)
                                let hitminutes = Math.floor(hittime / 60)
                                if (hitseconds < 10) {
                                    hitseconds = '0' + hitseconds
                                }
                                let hitstr = `${hitminutes}:${hitseconds}`

                                let totaltime = rsdata[0].beatmap.total_length
                                let totalseconds = totaltime % 60
                                let totalminutes = Math.floor(totaltime / 60)
                                if (totalseconds < 10) {
                                    totalseconds = '0' + totalseconds
                                }
                                let totalstr = `${totalminutes}:${totalseconds}`

                                let gamehits = rsdata[0].statistics

                                if (mode == 'osu') {
                                    accgrade = osucalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, 0)
                                } else if (mode == 'taiko') {
                                    accgrade = osucalc.calcgradeTaiko(gamehits.count_300, gamehits.count_100, 0)
                                } else if (mode == 'fruits') {
                                    accgrade = osucalc.calcgradeCatch(gamehits.count_300, gamehits.count_100, gamehits.count_50, 0)
                                } else if (mode == 'mania') {
                                    accgrade = osucalc.calcgradeMania(gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, 0)
                                }
                                let fcacc = accgrade.accuracy
                                let grade = (rsdata[0].rank).toUpperCase();
                                let rspassinfo = ''
                                switch (grade) {
                                    case 'F':
                                        rspassinfo = `\n${hitstr}/${totalstr} (${(hittime / totaltime * 100).toFixed(2)}%)`
                                        rsgrade = 'F'
                                        break;
                                    case 'D':
                                        rsgrade = '<:rankingD:927797179534438421>'
                                        break;
                                    case 'C':
                                        rsgrade = '<:rankingC:927797179584757842>'
                                        break;
                                    case 'B':
                                        rsgrade = '<:rankingB:927797179697991700>'
                                        break;
                                    case 'A':
                                        rsgrade = '<:rankingA:927797179739930634>'
                                        break;
                                    case 'S':
                                        rsgrade = '<:rankingS:927797179618295838>'
                                        break;
                                    case 'SH':
                                        rsgrade = '<:rankingSH:927797179710570568>'
                                        break;
                                    case 'X':
                                        rsgrade = '<:rankingX:927797179832229948>'
                                        break;
                                    case 'XH':
                                        rsgrade = '<:rankingxh:927797179597357076>'
                                        break;
                                };

                                (async () => {

                                    let mods = rsdata[0].mods.toString().replaceAll(',', '').replace('[', '').replace(']', '')
                                    //let modint = osucalc.ModStringToInt(mods)

                                    let modstr = ''

                                    if (mods) {
                                        modint = osucalc.ModStringToInt(mods)
                                        modstr = `+${mods}`
                                    } else {
                                        modint = 0
                                    }

                                    const score = {
                                        beatmap_id: rsdata[0].beatmap.id,
                                        score: '6795149',
                                        maxcombo: '630',
                                        count50: gamehits.count_50,
                                        count100: gamehits.count_100,
                                        count300: gamehits.count_300,
                                        countmiss: '0',
                                        countkatu: gamehits.count_katu,
                                        countgeki: gamehits.count_geki,
                                        perfect: '1',
                                        enabled_mods: modint,
                                        user_id: userid,
                                        date: '2022-02-08 05:24:54',
                                        rank: 'S',
                                        score_id: '4057765057'
                                    }
                                    const scorenofc = {
                                        beatmap_id: rsdata[0].beatmap.id,
                                        score: '6795149',
                                        maxcombo: '630',
                                        count50: gamehits.count_50,
                                        count100: gamehits.count_100,
                                        count300: gamehits.count_300,
                                        countmiss: gamehits.count_miss,
                                        countkatu: gamehits.count_katu,
                                        countgeki: gamehits.count_geki,
                                        perfect: '0',
                                        enabled_mods: modint,
                                        user_id: userid,
                                        date: '2022-02-08 05:24:54',
                                        rank: 'S',
                                        score_id: '4057765057'
                                    }

                                    if (mode == 'osu') {
                                        pp = new ppcalc.std_ppv2().setPerformance(scorenofc)
                                        ppfc = new ppcalc.std_ppv2().setPerformance(score)
                                        hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                                    }
                                    if (mode == 'taiko') {
                                        pp = new ppcalc.taiko_ppv2().setPerformance(scorenofc)
                                        ppfc = new ppcalc.taiko_ppv2().setPerformance(score)
                                        hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **Miss:** ${gamehits.count_miss}`
                                    }
                                    if (mode == 'fruits') {
                                        pp = new ppcalc.catch_ppv2().setPerformance(scorenofc)
                                        ppfc = new ppcalc.catch_ppv2().setPerformance(score)
                                        hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                                    }
                                    if (mode == 'mania') {
                                        pp = new ppcalc.mania_ppv2().setPerformance(scorenofc)
                                        ppfc = new ppcalc.mania_ppv2().setPerformance(score)
                                        hitlist = `**300+:** ${gamehits.count_geki} \n **300:** ${gamehits.count_300} \n **200:** ${gamehits.count_katu} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                                    }

                                    let rspp = rsdata[0].pp

                                    let ppc = await pp.compute()
                                    let ppfcd = await ppfc.compute()

                                    let ppiffc = ppfcd.total.toFixed(2)

                                    if (rspp == null) {
                                        rspp = ppc.total.toFixed(2)
                                    } else {
                                        rspp = rspp.toFixed(2)
                                    }

                                    if (rsdata[0].perfect == true) {
                                        fcflag = '**FC**'
                                    } else if (rsdata[0].perfect == false) {
                                        fcflag = `**${ppiffc}**pp IF **${fcacc}** FC`
                                    }
                                    let title = rsdata[0].beatmapset.title
                                    let titleunicode = rsdata[0].beatmapset.title_unicode
                                    let titlediff = rsdata[0].beatmap.version
                                    if (title != titleunicode) {
                                        titlestring = `${title} (${titleunicode}) [${titlediff}]`
                                    }
                                    else {
                                        titlestring = `${title} [${titlediff}]`
                                    }
                                    let trycount = 0
                                    for (i = 0; i < rsdata.length; i++) {
                                        if (rsdata[i].beatmap.id == rsdata[0].beatmap.id) {
                                            trycount++
                                        }
                                    }
                                    trycountstr = ''
                                    if (trycount > 1) {
                                        trycountstr = `try #${trycount}`
                                    }

                                    let scoretimestampdate = new Date((rsdata[0].created_at).toString().slice(0, -6) + "Z")
                                    let curtime = new Date()
                                    let minsincelastvis = Math.abs((scoretimestampdate - curtime) / (1000 * 60)).toFixed(0)
                                    let lastvismin = minsincelastvis % 60
                                    let lastvishour = Math.trunc(minsincelastvis / 60) % 24
                                    let timeago = `${lastvishour}h ${lastvismin}m`



                                    let Embed = new Discord.MessageEmbed()
                                        .setColor(0x9AAAC0)
                                        .setTitle(`Most recent play for ${rsdata[0].user.username}`)
                                        .setAuthor({ name: `${timeago} Ago on ${rsdata[0].created_at} ${trycountstr} `, url: `https://osu.ppy.sh/u/${userid}`, iconURL: `https://a.ppy.sh/${userid}` })
                                        .setThumbnail(`${rsdata[0].beatmapset.covers.list}`)
                                        .addField('MAP DETAILS',
                                            `[${titlestring}](https://osu.ppy.sh/b/${rsdata[0].beatmap.id}) ${modstr} ${rsdata[0].beatmap.difficulty_rating}⭐`, false)
                                        .addField('SCORE DETAILS',
                                            `${(rsdata[0].accuracy * 100).toFixed(2)}% | ${rsgrade}\n` +
                                            `${rspassinfo}\n${hitlist}\n${rsdata[0].max_combo}x`, true)
                                        .addField('PP',
                                            `**${rspp}**pp \n${fcflag}`, true);
                                    message.reply({ content: '⠀', embeds: [Embed] })
                                    fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')

                                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: rsdata.beatmap.id }), null, 2));

                                })();
                            } catch (error) {
                                return message.reply('Error - no score found')
                            }

                        })
                })


        }

        if (interaction != null) {
            let user = interaction.options.getString('user')
            let page = interaction.options.getNumber('page')
            let mode = interaction.options.getString('mode')

            if (user == null) {
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
            if (mode == null) {
                findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname == null) {
                    mode = 'osu'
                } else {
                    mode = findname.get('mode')
                    if (mode.length < 1) {
                        mode = 'osu'
                    }
                }
            }
            if (page == null) {
                page = 0
            } else {
                page = page - 1
                if (page < 1) {
                    page = 0
                }
            }

            interaction.reply('Fetching data...')
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - rs (interaction)\n${currentDate} | ${currentDateISO}\n recieved osu! recent play command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            const userinfourl = `https://osu.ppy.sh/api/v2/users/${user}/osu`

            fetch(userinfourl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(osudata => {
                    let userid = osudata.id
                    if (!userid) {
                        return interaction.channel.send('Error - no user found')
                    }
                    const recentplayurl = `https://osu.ppy.sh/api/v2/users/${userid}/scores/recent?include_fails=1&mode=${mode}&limit=100&offset=${page}`
                    fetch(recentplayurl, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    }).then(res => res.json())
                        .then(rsdata => {
                            try {
                                fs.writeFileSync('debugosu/rs.json', JSON.stringify(rsdata, null, 2))

                                let hittime = rsdata[0].beatmap.hit_length
                                let hitseconds = (hittime % 60)
                                let hitminutes = Math.floor(hittime / 60)
                                if (hitseconds < 10) {
                                    hitseconds = '0' + hitseconds
                                }
                                let hitstr = `${hitminutes}:${hitseconds}`

                                let totaltime = rsdata[0].beatmap.total_length
                                let totalseconds = totaltime % 60
                                let totalminutes = Math.floor(totaltime / 60)
                                if (totalseconds < 10) {
                                    totalseconds = '0' + totalseconds
                                }
                                let totalstr = `${totalminutes}:${totalseconds}`

                                let gamehits = rsdata[0].statistics

                                if (mode == 'osu') {
                                    accgrade = osucalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, 0)
                                } else if (mode == 'taiko') {
                                    accgrade = osucalc.calcgradeTaiko(gamehits.count_300, gamehits.count_100, 0)
                                } else if (mode == 'fruits') {
                                    accgrade = osucalc.calcgradeCatch(gamehits.count_300, gamehits.count_100, gamehits.count_50, 0)
                                } else if (mode == 'mania') {
                                    accgrade = osucalc.calcgradeMania(gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, 0)
                                }
                                let fcacc = accgrade.accuracy
                                let grade = (rsdata[0].rank).toUpperCase();
                                let rspassinfo = ''
                                switch (grade) {
                                    case 'F':
                                        rspassinfo = `\n${hitstr}/${totalstr} (${(hittime / totaltime * 100).toFixed(2)}%)`
                                        rsgrade = 'F'
                                        break;
                                    case 'D':
                                        rsgrade = '<:rankingD:927797179534438421>'
                                        break;
                                    case 'C':
                                        rsgrade = '<:rankingC:927797179584757842>'
                                        break;
                                    case 'B':
                                        rsgrade = '<:rankingB:927797179697991700>'
                                        break;
                                    case 'A':
                                        rsgrade = '<:rankingA:927797179739930634>'
                                        break;
                                    case 'S':
                                        rsgrade = '<:rankingS:927797179618295838>'
                                        break;
                                    case 'SH':
                                        rsgrade = '<:rankingSH:927797179710570568>'
                                        break;
                                    case 'X':
                                        rsgrade = '<:rankingX:927797179832229948>'
                                        break;
                                    case 'XH':
                                        rsgrade = '<:rankingxh:927797179597357076>'
                                        break;
                                };

                                (async () => {

                                    let mods = rsdata[0].mods.toString().replaceAll(',', '').replace('[', '').replace(']', '')
                                    //let modint = osucalc.ModStringToInt(mods)

                                    let modstr = ''

                                    if (mods) {
                                        modint = osucalc.ModStringToInt(mods)
                                        modstr = `+${mods}`
                                    } else {
                                        modint = 0
                                    }

                                    const score = {
                                        beatmap_id: rsdata[0].beatmap.id,
                                        score: '6795149',
                                        maxcombo: '630',
                                        count50: gamehits.count_50,
                                        count100: gamehits.count_100,
                                        count300: gamehits.count_300,
                                        countmiss: '0',
                                        countkatu: gamehits.count_katu,
                                        countgeki: gamehits.count_geki,
                                        perfect: '1',
                                        enabled_mods: modint,
                                        user_id: userid,
                                        date: '2022-02-08 05:24:54',
                                        rank: 'S',
                                        score_id: '4057765057'
                                    }
                                    const scorenofc = {
                                        beatmap_id: rsdata[0].beatmap.id,
                                        score: '6795149',
                                        maxcombo: '630',
                                        count50: gamehits.count_50,
                                        count100: gamehits.count_100,
                                        count300: gamehits.count_300,
                                        countmiss: gamehits.count_miss,
                                        countkatu: gamehits.count_katu,
                                        countgeki: gamehits.count_geki,
                                        perfect: '0',
                                        enabled_mods: modint,
                                        user_id: userid,
                                        date: '2022-02-08 05:24:54',
                                        rank: 'S',
                                        score_id: '4057765057'
                                    }

                                    if (mode == 'osu') {
                                        pp = new ppcalc.std_ppv2().setPerformance(scorenofc)
                                        ppfc = new ppcalc.std_ppv2().setPerformance(score)
                                        hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                                    }
                                    if (mode == 'taiko') {
                                        pp = new ppcalc.taiko_ppv2().setPerformance(scorenofc)
                                        ppfc = new ppcalc.taiko_ppv2().setPerformance(score)
                                        hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **Miss:** ${gamehits.count_miss}`
                                    }
                                    if (mode == 'fruits') {
                                        pp = new ppcalc.catch_ppv2().setPerformance(scorenofc)
                                        ppfc = new ppcalc.catch_ppv2().setPerformance(score)
                                        hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                                    }
                                    if (mode == 'mania') {
                                        pp = new ppcalc.mania_ppv2().setPerformance(scorenofc)
                                        ppfc = new ppcalc.mania_ppv2().setPerformance(score)
                                        hitlist = `**300+:** ${gamehits.count_geki} \n **300:** ${gamehits.count_300} \n **200:** ${gamehits.count_katu} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                                    }

                                    let rspp = rsdata[0].pp

                                    let ppc = await pp.compute()
                                    let ppfcd = await ppfc.compute()

                                    let ppiffc = ppfcd.total.toFixed(2)

                                    if (rspp == null) {
                                        rspp = ppc.total.toFixed(2)
                                    } else {
                                        rspp = rspp.toFixed(2)
                                    }

                                    if (rsdata[0].perfect == true) {
                                        fcflag = '**FC**'
                                    } else if (rsdata[0].perfect == false) {
                                        fcflag = `**${ppiffc}**pp IF **${fcacc}** FC`
                                    }
                                    let title = rsdata[0].beatmapset.title
                                    let titleunicode = rsdata[0].beatmapset.title_unicode
                                    let titlediff = rsdata[0].beatmap.version
                                    if (title != titleunicode) {
                                        titlestring = `${title} (${titleunicode}) [${titlediff}]`
                                    }
                                    else {
                                        titlestring = `${title} [${titlediff}]`
                                    }
                                    let trycount = 0
                                    for (i = 0; i < rsdata.length; i++) {
                                        if (rsdata[i].beatmap.id == rsdata[0].beatmap.id) {
                                            trycount++
                                        }
                                    }
                                    trycountstr = ''
                                    if (trycount > 1) {
                                        trycountstr = `try #${trycount}`
                                    }

                                    let scoretimestampdate = new Date((rsdata[0].created_at).toString().slice(0, -6) + "Z")
                                    let curtime = new Date()
                                    let minsincelastvis = Math.abs((scoretimestampdate - curtime) / (1000 * 60)).toFixed(0)
                                    let lastvismin = minsincelastvis % 60
                                    let lastvishour = Math.trunc(minsincelastvis / 60) % 24
                                    let timeago = `${lastvishour}h ${lastvismin}m`



                                    let Embed = new Discord.MessageEmbed()
                                        .setColor(0x9AAAC0)
                                        .setTitle(`Most recent play for ${rsdata[0].user.username}`)
                                        .setAuthor({ name: `${timeago} Ago on ${rsdata[0].created_at} ${trycountstr} `, url: `https://osu.ppy.sh/u/${userid}`, iconURL: `https://a.ppy.sh/${userid}` })
                                        .setThumbnail(`${rsdata[0].beatmapset.covers.list}`)
                                        .addField('MAP DETAILS',
                                            `[${titlestring}](https://osu.ppy.sh/b/${rsdata[0].beatmap.id}) ${modstr} ${rsdata[0].beatmap.difficulty_rating}⭐`, false)
                                        .addField('SCORE DETAILS',
                                            `${(rsdata[0].accuracy * 100).toFixed(2)}% | ${rsgrade}\n` +
                                            `${rspassinfo}\n${hitlist}\n${rsdata[0].max_combo}x`, true)
                                        .addField('PP',
                                            `**${rspp}**pp \n${fcflag}`, true);
                                    interaction.editReply({ content: '⠀', embeds: [Embed] })
                                    fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')

                                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: rsdata.beatmap.id }), null, 2));

                                })();
                            } catch (error) {
                                return interaction.editReply('Error - no score found')
                            }

                        })
                })

        }
    }
}