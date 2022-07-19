const { access_token } = require('../configs/osuauth.json');
const fs = require('fs');
const osucalc = require('osumodcalculator')
const ppcalc = require('booba')
const fetch = require('node-fetch')
const emojis = require('../configs/emojis.js')
const checks = require('../configs/commandchecks.js')

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
                    return message.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
                } else {
                    user = findname.get('osuname')
                    if (user.length < 1) {
                        return message.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
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
                                let fcacc = accgrade.accuracy.toFixed(2) + "%"
                                let grade = (rsdata[0].rank).toUpperCase();
                                let rspassinfo = ''
                                switch (grade) {
                                    case 'F':
                                        rspassinfo = `\n${hitstr}/${totalstr} (${(hittime / totaltime * 100).toFixed(2)}% completed)`
                                        rsgrade = emojis.grades.F
                                        break;
                                    case 'D':
                                        rsgrade = emojis.grades.D
                                        break;
                                    case 'C':
                                        rsgrade = emojis.grades.C
                                        break;
                                    case 'B':
                                        rsgrade = emojis.grades.B
                                        break;
                                    case 'A':
                                        rsgrade = emojis.grades.A
                                        break;
                                    case 'S':
                                        rsgrade = emojis.grades.S
                                        break;
                                    case 'SH':
                                        rsgrade = emojis.grades.SH
                                        break;
                                    case 'X':
                                        rsgrade = emojis.grades.X
                                        break;
                                    case 'XH':
                                        rsgrade = emojis.grades.XH
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
                                    try {
                                        let ppc = await pp.compute()
                                        let ppfcd = await ppfc.compute()

                                        ppiffc = ppfcd.total.toFixed(2)
                                        fs.writeFileSync(`debugosu/rspp.json`, `[\n${JSON.stringify(ppc, null, 2)},\n ${JSON.stringify(ppfcd, null, 2)}\n]`)

                                        if (rspp == null) {
                                            rspp = ppc.total.toFixed(2)
                                        } else {
                                            rspp = rspp.toFixed(2)
                                        }

                                        ppissue = ''

                                    } catch (error) {
                                        if (rspp == null) {
                                            rspp = NaN
                                        }
                                        ppiffc = NaN
                                        ppissue = 'Error - pp calculator could not fetch beatmap'
                                        fs.appendFileSync('commands.log', 'ERROR CALCULATING PERFORMANCE: ' + error)
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



                                    let Embed = new Discord.EmbedBuilder()
                                        .setColor(0x9AAAC0)
                                        .setTitle(`Most recent play for ${rsdata[0].user.username}`)
                                        .setURL(`https://osu.ppy.sh/scores/${rsdata[0].mode}/${rsdata[0].id}`)
                                        .setAuthor({ name: `${timeago} Ago on ${rsdata[0].created_at} ${trycountstr} `, url: `https://osu.ppy.sh/u/${userid}`, iconURL: `https://a.ppy.sh/${userid}` })
                                        .setThumbnail(`${rsdata[0].beatmapset.covers.list}`)
                                        .addFields([
                                            {
                                                name: 'MAP DETAILS',
                                                value: `[${titlestring}](https://osu.ppy.sh/b/${rsdata[0].beatmap.id}) ${modstr} ${rsdata[0].beatmap.difficulty_rating}⭐`,
                                                inline: false
                                            },
                                            {
                                                name: 'SCORE DETAILS',
                                                value: `${(rsdata[0].accuracy * 100).toFixed(2)}% | ${rsgrade}\n` +
                                                    `${rspassinfo}\n${hitlist}\n${rsdata[0].max_combo}x combo`,
                                                inline: true
                                            },
                                            {
                                                name: 'PP',
                                                value: `**${rspp}**pp \n${fcflag}\n${ppissue}`,
                                                inline: true
                                            }]);
                                    message.reply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false } })
                                    fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')

                                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: rsdata[0].beatmap.id }), null, 2));
                                    fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                                })();
                            } catch (error) {
                                message.reply({ content: 'Error - no score found', allowedMentions: { repliedUser: false } })
                                fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)
                                return;
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
                    return interaction.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
                } else {
                    user = findname.get('osuname')
                    if (user.length < 1) {
                        return interaction.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
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

            interaction.reply({ content: 'Fetching data...' })
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
                                if (interaction.options.getBoolean("list") != true) {
                                    let hittime = rsdata[0 + page].beatmap.hit_length
                                    let hitseconds = (hittime % 60)
                                    let hitminutes = Math.floor(hittime / 60)
                                    if (hitseconds < 10) {
                                        hitseconds = '0' + hitseconds
                                    }
                                    let hitstr = `${hitminutes}:${hitseconds}`

                                    let totaltime = rsdata[0 + page].beatmap.total_length
                                    let totalseconds = totaltime % 60
                                    let totalminutes = Math.floor(totaltime / 60)
                                    if (totalseconds < 10) {
                                        totalseconds = '0' + totalseconds
                                    }
                                    let totalstr = `${totalminutes}:${totalseconds}`

                                    let gamehits = rsdata[0 + page].statistics

                                    if (mode == 'osu') {
                                        accgrade = osucalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, 0)
                                    } else if (mode == 'taiko') {
                                        accgrade = osucalc.calcgradeTaiko(gamehits.count_300, gamehits.count_100, 0)
                                    } else if (mode == 'fruits') {
                                        accgrade = osucalc.calcgradeCatch(gamehits.count_300, gamehits.count_100, gamehits.count_50, 0)
                                    } else if (mode == 'mania') {
                                        accgrade = osucalc.calcgradeMania(gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, 0)
                                    }
                                    let fcacc = accgrade.accuracy.toFixed(2) + "%"
                                    let grade = (rsdata[0 + page].rank).toUpperCase();
                                    let rspassinfo = ''
                                    switch (grade) {
                                        case 'F':
                                            rspassinfo = `\n${hitstr}/${totalstr} (${(hittime / totaltime * 100).toFixed(2)}% completed)`
                                            rsgrade = emojis.grades.F
                                            break;
                                        case 'D':
                                            rsgrade = emojis.grades.D
                                            break;
                                        case 'C':
                                            rsgrade = emojis.grades.C
                                            break;
                                        case 'B':
                                            rsgrade = emojis.grades.B
                                            break;
                                        case 'A':
                                            rsgrade = emojis.grades.A
                                            break;
                                        case 'S':
                                            rsgrade = emojis.grades.S
                                            break;
                                        case 'SH':
                                            rsgrade = emojis.grades.SH
                                            break;
                                        case 'X':
                                            rsgrade = emojis.grades.X
                                            break;
                                        case 'XH':
                                            rsgrade = emojis.grades.XH
                                            break;
                                    };

                                    (async () => {

                                        let mods = rsdata[0 + page].mods.toString().replaceAll(',', '').replace('[', '').replace(']', '')
                                        //let modint = osucalc.ModStringToInt(mods)

                                        let modstr = ''

                                        if (mods) {
                                            modint = osucalc.ModStringToInt(mods)
                                            modstr = `+${mods}`

                                        } else {
                                            modint = 0
                                        }

                                        const score = {
                                            beatmap_id: rsdata[0 + page].beatmap.id,
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
                                            beatmap_id: rsdata[0 + page].beatmap.id,
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

                                        let rspp = rsdata[0 + page].pp
                                        try {
                                            let ppc = await pp.compute()
                                            let ppfcd = await ppfc.compute()

                                            ppiffc = ppfcd.total.toFixed(2)
                                            fs.writeFileSync(`debugosu/rspp.json`, `[\n${JSON.stringify(ppc, null, 2)},\n ${JSON.stringify(ppfcd, null, 2)}\n]`)
                                            if (rspp == null) {
                                                rspp = ppc.total.toFixed(2)
                                            } else {
                                                rspp = rspp.toFixed(2)
                                            }

                                            ppissue = ''

                                        } catch (error) {
                                            if (rspp == null) {
                                                rspp = NaN
                                            }
                                            ppiffc = NaN
                                            ppissue = 'Error - pp calculator could not fetch beatmap'
                                            fs.appendFileSync('commands.log', 'ERROR CALCULATING PERFORMANCE: ' + error)
                                        }

                                        if (rsdata[0 + page].perfect == true) {
                                            fcflag = '**FC**'
                                        } else if (rsdata[0 + page].perfect == false) {
                                            fcflag = `**${ppiffc}**pp IF **${fcacc}** FC`
                                        }
                                        let title = rsdata[0 + page].beatmapset.title
                                        let titleunicode = rsdata[0 + page].beatmapset.title_unicode
                                        let titlediff = rsdata[0 + page].beatmap.version
                                        if (title != titleunicode) {
                                            titlestring = `${title} (${titleunicode}) [${titlediff}]`
                                        }
                                        else {
                                            titlestring = `${title} [${titlediff}]`
                                        }
                                        let trycount = 0
                                        for (i = 0; i < rsdata.length; i++) {
                                            if (rsdata[i].beatmap.id == rsdata[0 + page].beatmap.id) {
                                                trycount++
                                            }
                                        }
                                        trycountstr = ''
                                        if (trycount > 1) {
                                            trycountstr = `try #${trycount}`
                                        }

                                        let scoretimestampdate = new Date((rsdata[0 + page].created_at).toString().slice(0, -6) + "Z")
                                        let curtime = new Date()
                                        let minsincelastvis = Math.abs((scoretimestampdate - curtime) / (1000 * 60)).toFixed(0)
                                        let lastvismin = minsincelastvis % 60
                                        let lastvishour = Math.trunc(minsincelastvis / 60) % 24
                                        let timeago = `${lastvishour}h ${lastvismin}m`



                                        let Embed = new Discord.EmbedBuilder()
                                            .setColor(0x9AAAC0)
                                            .setTitle(`Most recent play for ${rsdata[0 + page].user.username}`)
                                            .setURL(`https://osu.ppy.sh/scores/${rsdata[0 + page].mode}/${rsdata[0 + page].id}`)
                                            .setAuthor({ name: `${timeago} Ago on ${rsdata[0 + page].created_at} ${trycountstr} `, url: `https://osu.ppy.sh/u/${userid}`, iconURL: `https://a.ppy.sh/${userid}` })
                                            .setThumbnail(`${rsdata[0 + page].beatmapset.covers.list}`)
                                            .addFields([
                                                {
                                                    name: 'MAP DETAILS',
                                                    value: `[${titlestring}](https://osu.ppy.sh/b/${rsdata[0].beatmap.id}) ${modstr} ${rsdata[0].beatmap.difficulty_rating}⭐`,
                                                    inline: false
                                                },
                                                {
                                                    name: 'SCORE DETAILS',
                                                    value: `${(rsdata[0].accuracy * 100).toFixed(2)}% | ${rsgrade}\n` +
                                                        `${rspassinfo}\n${hitlist}\n${rsdata[0].max_combo}x combo`,
                                                    inline: true
                                                },
                                                {
                                                    name: 'PP',
                                                    value: `**${rspp}**pp \n${fcflag}\n${ppissue}`,
                                                    inline: true
                                                }]);
                                        interaction.editReply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false } })
                                        fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                        fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}\npage: ${page}\nmode: ${mode}`)

                                        fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: rsdata[0 + page].beatmap.id }), null, 2));

                                    })();
                                } else {
                                    let Embed = new Discord.EmbedBuilder()
                                        .setColor(0x9AAAC0)
                                        .setTitle(`All recent plays for ${rsdata[0 + page].user.username}`)
                                    let txt = ''
                                    for (let i = 0; i < (rsdata.length - (page * 20)) && i < 20; i++) {
                                        //fetch pp, accuracy, score, score id
                                        let score = rsdata[i + (page * 20)]
                                        txt += `${i + (page * 20) + 1} | [${score.beatmapset.title}](${score.beatmap.url}) | [score](https://osu.ppy.sh/scores/${score.mode}/${score.id})\n${(score.accuracy * 100).toFixed(2)}% | ${score.rank}\n`
                                    }
                                    if (txt == '') {
                                        txt = 'No recent plays'
                                    }
                                    if (txt.length > 4000) {
                                        txt = txt.substring(0, 4000)
                                        //txt = txt.substring(0, checks.nthIndexLast(txt, '\n', txt.match(/\n/g).length - 3))
                                        /* while(txt.length > 4000){
                                            txt = txt.substring(0, checks.nthIndexLast(txt, '\n', txt.match(/\n/g).length - 3))
                                        } */
                                    }
                                    Embed.setDescription(txt)
                                    interaction.editReply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false } })
                                }
                            } catch (error) {
                                fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}\npage: ${page}\nmode: ${mode}`)
                                return interaction.editReply({ content: 'Error - no score found', allowedMentions: { repliedUser: false } })
                            }

                        })
                })

        }
    }
}