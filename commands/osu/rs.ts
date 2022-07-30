import { access_token } from '../../configs/osuauth.json';
import fs = require('fs');
import osucalc = require('osumodcalculator')
import ppcalc = require('booba')
import fetch from 'node-fetch'
import emojis = require('../../configs/emojis')
import checks = require('../../configs/commandchecks')

module.exports = {
    name: 'rs',
    description: 'Displays the most recent score for the user\n' +
        'Command: `sbr-rs <user>`\n' +
        'Slash command: `/rs [user][page][mode]`\n' +
        'Options:\n' +
        '⠀⠀`user`: The user to display the most recent score of\n' +
        '⠀⠀`page`: The page to display the most recent score of\n' +
        '⠀⠀`mode`: The mode to display the most recent score of\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button) {

        if (message != null && button == null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - rs (message)\n${currentDate} | ${currentDateISO}\n recieved osu! recent play command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')

            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-rs-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-rs-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-rs')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-rs-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-rs-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );

            let user = args.join(' ');
            let page = 0
            let mode = null
            let searchid = message.author.id
            if (message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            if (user.length < 1 || message.mentions.users.size > 0) {
                let findname;
                findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname == null) {
                    return message.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                } else {
                    user = findname.get('osuname')
                    if (user.length < 1) {
                        return message.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    }
                }
            }
            if (mode == null && (!args[0] || message.mentions.users.size > 0)) {
                let findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname == null) {
                    mode = 'osu'
                } else {
                    mode = findname.get('mode')
                    if (mode.length < 1) {
                        mode = 'osu'
                    }
                }
            } else {
                mode = 'osu'
            }
            if (!(mode == 'osu' || mode == 'taiko' || mode == 'fruits' || mode == 'mania')) {
                mode = 'osu'
            }
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${user}/osu`

            fetch(userinfourl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    let userid = osudata.id
                    if (!userid) {
                        return message.channel.send('Error - no user found')
                    };
                    (async () => {
                        let findname;
                        findname = await userdata.findOne({ where: { osuname: user } })
                        if (findname != null) {
                            switch (mode) {
                                case 'osu':
                                default:
                                    await userdata.update({
                                        osupp: osudata.statistics.pp,
                                        osurank: osudata.statistics.global_rank,
                                        osuacc: osudata.statistics.hit_accuracy
                                    }, {
                                        where: { osuname: user }
                                    })
                                    break;
                                case 'taiko':
                                    await userdata.update({
                                        taikopp: osudata.statistics.pp,
                                        taikorank: osudata.statistics.global_rank,
                                        taikoacc: osudata.statistics.hit_accuracy
                                    }, {
                                        where: { osuname: user }
                                    })
                                    break;
                                case 'fruits':
                                    await userdata.update({
                                        fruitspp: osudata.statistics.pp,
                                        fruitsrank: osudata.statistics.global_rank,
                                        fruitsacc: osudata.statistics.hit_accuracy
                                    }, {
                                        where: { osuname: user }
                                    })
                                    break;
                                case 'mania':
                                    await userdata.update({
                                        maniapp: osudata.statistics.pp,
                                        maniarank: osudata.statistics.global_rank,
                                        maniaacc: osudata.statistics.hit_accuracy
                                    }, {
                                        where: { osuname: user }
                                    })
                                    break;
                            }
                        } else {
                        }
                    })();
                    fs.writeFileSync('debugosu/command-rs=name.json', JSON.stringify(osudata, null, 2))

                    const recentplayurl = `https://osu.ppy.sh/api/v2/users/${userid}/scores/recent?include_fails=1&mode=${mode}&limit=100&offset=${page}`
                    fetch(recentplayurl, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    }).then(res => res.json() as any)
                        .then(rsdata => {
                            try {
                                (async () => {
                                    let findname;
                                    findname = await userdata.findOne({ where: { osuname: user } })
                                    if (findname != null) {
                                        await userdata.update({
                                            osupp: osudata.statistics.pp,
                                            osurank: osudata.statistics.global_rank,
                                            osuacc: osudata.statistics.hit_accuracy
                                        }, {
                                            where: { osuname: user }
                                        })
                                    } else {
                                    }
                                })();
                                fs.writeFileSync('debugosu/command-rs.json', JSON.stringify(rsdata, null, 2))

                                let hittime = rsdata[0].beatmap.hit_length
                                let hitseconds: any = (hittime % 60)
                                let hitminutes = Math.floor(hittime / 60)
                                if (hitseconds < 10) {
                                    hitseconds = '0' + hitseconds
                                }
                                let hitstr = `${hitminutes}:${hitseconds}`

                                let totaltime = rsdata[0].beatmap.total_length
                                let totalseconds: any = totaltime % 60
                                let totalminutes = Math.floor(totaltime / 60)
                                if (totalseconds < 10) {
                                    totalseconds = '0' + totalseconds
                                }
                                let totalstr = `${totalminutes}:${totalseconds}`

                                let gamehits = rsdata[0].statistics
                                let accgrade;
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
                                let rsgrade;
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
                                let mods = rsdata[0].mods.toString().replaceAll(',', '').replace('[', '').replace(']', '')

                                let iftherearemodsasint = JSON.stringify({
                                    "ruleset": mode
                                });
                                if (mods != 'NM') {
                                    iftherearemodsasint =
                                        JSON.stringify({
                                            "ruleset": mode,
                                            "mods": osucalc.ModStringToInt(mods)
                                        })
                                }
                                let beatattrurl = `https://osu.ppy.sh/api/v2/beatmaps/${rsdata[0].beatmap.id}/attributes`;
                                fetch(beatattrurl, {
                                    method: 'POST',
                                    headers: {
                                        Authorization: `Bearer ${access_token}`,
                                        "Content-Type": "application/json",
                                        Accept: "application/json"
                                    },
                                    body: iftherearemodsasint,

                                }).then(res => res.json() as any)
                                    .then(mapattrdata => {
                                        fs.writeFileSync('debugosu/command-rs=attr_data.json', JSON.stringify(mapattrdata, null, 2));
                                        let totaldiff = mapattrdata.attributes.star_rating
                                        if (totaldiff == null || totaldiff == undefined || totaldiff == NaN) {
                                            totaldiff = rsdata[0].beatmap.difficulty_rating;
                                        } else {
                                            totaldiff = mapattrdata.attributes.star_rating.toFixed(2);
                                        }


                                        (async () => {
                                            //let modint = osucalc.ModStringToInt(mods)

                                            let modstr = ''
                                            let modint: number;
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
                                            let pp: any;
                                            let ppfc: any;
                                            let hitlist: any;

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
                                            let ppiffc: any;
                                            let ppissue: string;
                                            try {
                                                let ppc = await pp.compute()
                                                let ppfcd = await ppfc.compute()

                                                ppiffc = ppfcd.total.toFixed(2)
                                                fs.writeFileSync(`debugosu/command-rs=pp.json`, `[\n${JSON.stringify(ppc, null, 2)},\n ${JSON.stringify(ppfcd, null, 2)}\n]`)

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
                                            let fcflag;
                                            if (rsdata[0].perfect == true) {
                                                fcflag = '**FC**'
                                            } else if (rsdata[0].perfect == false) {
                                                fcflag = `**${ppiffc}**pp IF **${fcacc}** FC`
                                            }
                                            let title = rsdata[0].beatmapset.title
                                            let titleunicode = rsdata[0].beatmapset.title_unicode
                                            let titlediff = rsdata[0].beatmap.version
                                            let titlestring;
                                            if (title != titleunicode) {
                                                titlestring = `${title} (${titleunicode}) [${titlediff}]`
                                            }
                                            else {
                                                titlestring = `${title} [${titlediff}]`
                                            }
                                            let trycount = 0
                                            for (let i = 0; i < rsdata.length; i++) {
                                                if (rsdata[i].beatmap.id == rsdata[0].beatmap.id) {
                                                    trycount++
                                                }
                                            }
                                            let trycountstr: string;
                                            trycountstr = ''
                                            if (trycount > 1) {
                                                trycountstr = `try #${trycount}`
                                            }

                                            let scoretimestampdate: any = new Date((rsdata[0].created_at).toString().slice(0, -6) + "Z")
                                            let curtime: any = new Date()
                                            let minsincelastvis: any = Math.abs((scoretimestampdate - curtime) / (1000 * 60)).toFixed(0)
                                            let lastvismin = minsincelastvis % 60
                                            let lastvishour = Math.trunc(minsincelastvis / 60) % 24
                                            let timeago = `${lastvishour}h ${lastvismin}m`



                                            let Embed = new Discord.EmbedBuilder()
                                                .setColor(0x9AAAC0)
                                                .setTitle(`#1 most recent play for ${rsdata[0].user.username}`)
                                                .setURL(`https://osu.ppy.sh/scores/${rsdata[0].mode}/${rsdata[0].id}`)
                                                .setAuthor({ name: `${timeago} Ago on ${rsdata[0].created_at.substring(0, rsdata[0].created_at.length - 6).replace('T', ' ')} ${trycountstr} `, url: `https://osu.ppy.sh/u/${userid}`, iconURL: `https://a.ppy.sh/${userid}` })
                                                .setThumbnail(`${rsdata[0].beatmapset.covers.list}`)
                                                .addFields([
                                                    {
                                                        name: 'MAP DETAILS',
                                                        value: `[${titlestring}](https://osu.ppy.sh/b/${rsdata[0].beatmap.id}) ${modstr} ${totaldiff}⭐ | ${rsdata[0].mode}`,
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
                                            message.reply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false }, components: [buttons], failIfNotExists: true })
                                            fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                            let endofcommand = new Date().getTime();
                                            let timeelapsed = endofcommand - currentDate.getTime();
                                            fs.appendFileSync('commands.log', `\nCommand Latency - ${timeelapsed}ms\n`)

                                            fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: rsdata[0].beatmap.id }), null, 2));
                                            fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                                        })();
                                    })
                            } catch (error) {
                                if (mode == 'osu') {
                                    message.reply({ content: 'Error - no score found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                                }
                                else if (mode != 'osu' && user) {
                                    message.reply({ content: 'Error - no score found. Maybe try changing your mode with `/osuset` or use `/rs` instead', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                                }
                                fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)
                                return;
                            }

                        })
                })


        }

        if (interaction != null) {

            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-rs-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-rs-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-rs')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-rs-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-rs-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );

            let user;
            let page;
            let mode;
            let list = false;

            if (interaction.type == Discord.InteractionType.ApplicationCommand) {
                fs.appendFileSync('commands.log', `\nCOMMAND EVENT - rs (interaction)\n${currentDate} | ${currentDateISO}\n recieved osu! recent play command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
                fs.appendFileSync('commands.log', `\nInteraction ID: ${interaction.id}`)
                fs.appendFileSync('commands.log',
                    `\noptions:
                user: ${interaction.options.getString('user')}
                page: ${interaction.options.getNumber('page')}
                mode: ${interaction.options.getString('mode')}
                list: ${interaction.options.getBoolean('list')}
                `
                )
                user = interaction.options.getString('user')
                page = interaction.options.getNumber('page')
                mode = interaction.options.getString('mode')
                list = interaction.options.getBoolean("list")
            } else {
                fs.appendFileSync('commands.log', `\nBUTTON EVENT - rs (interaction)\n${currentDate} | ${currentDateISO}\n recieved osu! recent play command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
                fs.appendFileSync('commands.log', `\nInteraction ID: ${interaction.id}`)
                fs.appendFileSync('commands.log', `\n${button}`)

                user = 
                message.embeds[0].title.includes('play for') ?
                message.embeds[0].title.split('most recent play for ')[1] : 
                message.embeds[0].title.split('plays for ')[1]
                try{
                    mode = message.embeds[0].fields[0].value.split(' | ')[1]
                } catch(error){
                    message.embeds[0].footer.text.split('gamemode: ')[1]
                }
                ;
                page = 0
                if (button == 'BigLeftArrow') {
                    page = 0
                }
                if (message.embeds[0].title.includes('plays')) {
                    if (button == 'LeftArrow') {
                        page = parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1
                    } else if (button == 'RightArrow') {
                        page = parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1
                    }
                    list = true
                    if (((message.embeds[0].description).split('Page: ')[1].split('/')[0]) == NaN || ((message.embeds[0].description).split('Page: ')[1].split('/')[0]) == 'NaN') {
                        page = 1
                    }

                } else {
                    if (button == 'LeftArrow') {
                        page = parseInt((message.embeds[0].title).split(' ')[0].split('#')[1]) - 1
                    } else if (button == 'RightArrow') {
                        page = parseInt((message.embeds[0].title).split(' ')[0].split('#')[1]) + 1
                    }
                }

            }
            if (user == null) {
                let findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
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
                let findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname == null) {
                    mode = 'osu'
                } else {
                    mode = findname.get('mode')
                    if (mode.length < 1) {
                        mode = 'osu'
                    }
                }
            }
            if (!(mode == 'osu' || mode == 'taiko' || mode == 'fruits' || mode == 'mania')) {
                mode = 'osu'
            }

            if (page == null) {
                page = 0
            } else {
                page = page - 1
                if (page < 1) {
                    page = 0
                }
            }
            if (button == null) {
                interaction.reply({ content: 'Fetching data...' })
            }
            fs.appendFileSync('commands.log',
                `\noptions(2):
            user: ${user}
            page: ${page}
            mode: ${mode}
            list: ${list}
            `)
            const userinfourl = `https://osu.ppy.sh/api/v2/users/${user}/osu`

            fetch(userinfourl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    let userid = osudata.id
                    if (!userid) {
                        return interaction.channel.send('Error - no user found')
                    };
                    (async () => {
                        let findname;
                        findname = await userdata.findOne({ where: { osuname: user } })
                        if (findname != null) {
                            switch (mode) {
                                case 'osu':
                                default:
                                    await userdata.update({
                                        osupp: osudata.statistics.pp,
                                        osurank: osudata.statistics.global_rank,
                                        osuacc: osudata.statistics.hit_accuracy
                                    }, {
                                        where: { osuname: user }
                                    })
                                    break;
                                case 'taiko':
                                    await userdata.update({
                                        taikopp: osudata.statistics.pp,
                                        taikorank: osudata.statistics.global_rank,
                                        taikoacc: osudata.statistics.hit_accuracy
                                    }, {
                                        where: { osuname: user }
                                    })
                                    break;
                                case 'fruits':
                                    await userdata.update({
                                        fruitspp: osudata.statistics.pp,
                                        fruitsrank: osudata.statistics.global_rank,
                                        fruitsacc: osudata.statistics.hit_accuracy
                                    }, {
                                        where: { osuname: user }
                                    })
                                    break;
                                case 'mania':
                                    await userdata.update({
                                        maniapp: osudata.statistics.pp,
                                        maniarank: osudata.statistics.global_rank,
                                        maniaacc: osudata.statistics.hit_accuracy
                                    }, {
                                        where: { osuname: user }
                                    })
                                    break;
                            }
                        } else {
                        }
                    })();
                    fs.writeFileSync('debugosu/command-rs=name.json', JSON.stringify(osudata, null, 2))

                    const recentplayurl = `https://osu.ppy.sh/api/v2/users/${userid}/scores/recent?include_fails=1&mode=${mode}&limit=100&offset=0`
                    fetch(recentplayurl, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    }).then(res => res.json() as any)
                        .then(rsdata => {
                            try {
                                fs.writeFileSync('debugosu/command-rs.json', JSON.stringify(rsdata, null, 2))
                                if (list != true) {
                                    if (interaction.type == Discord.InteractionType.MessageComponent && button == 'BigRightArrow') {
                                        page = rsdata.length
                                    }
                                    (async () => {
                                        let findname;
                                        findname = await userdata.findOne({ where: { osuname: user } })
                                        if (findname != null) {
                                            await userdata.update({
                                                osupp: osudata.statistics.pp,
                                                osurank: osudata.statistics.global_rank,
                                                osuacc: osudata.statistics.hit_accuracy
                                            }, {
                                                where: { osuname: user }
                                            })
                                        } else {
                                        }
                                    })();

                                    let hittime = rsdata[0 + page].beatmap.hit_length
                                    let hitseconds: any = (hittime % 60)
                                    let hitminutes = Math.floor(hittime / 60)
                                    if (hitseconds < 10) {
                                        hitseconds = '0' + hitseconds
                                    }
                                    let hitstr = `${hitminutes}:${hitseconds}`

                                    let totaltime = rsdata[0 + page].beatmap.total_length
                                    let totalseconds: any = totaltime % 60
                                    let totalminutes = Math.floor(totaltime / 60)
                                    if (totalseconds < 10) {
                                        totalseconds = '0' + totalseconds
                                    }
                                    let totalstr = `${totalminutes}:${totalseconds}`

                                    let gamehits = rsdata[0 + page].statistics
                                    let accgrade: any;

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
                                    let rsgrade: any;
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
                                    let mods = rsdata[0 + page].mods.toString().replaceAll(',', '').replace('[', '').replace(']', '')
                                    let iftherearemodsasint = JSON.stringify({
                                        "ruleset": mode
                                    });
                                    if (mods != 'NM') {
                                        iftherearemodsasint =
                                            JSON.stringify({
                                                "ruleset": mode,
                                                "mods": osucalc.ModStringToInt(mods)
                                            })
                                    }
                                    let beatattrurl = `https://osu.ppy.sh/api/v2/beatmaps/${rsdata[0 + page].beatmap.id}/attributes`;
                                    fetch(beatattrurl, {
                                        method: 'POST',
                                        headers: {
                                            Authorization: `Bearer ${access_token}`,
                                            "Content-Type": "application/json",
                                            Accept: "application/json"
                                        },
                                        body: iftherearemodsasint,

                                    }).then(res => res.json() as any)
                                        .then(mapattrdata => {
                                            fs.writeFileSync('debugosu/command-rs=attr_data.json', JSON.stringify(mapattrdata, null, 2));
                                            let totaldiff: string;
                                            if (mapattrdata.error) {
                                                totaldiff = rsdata[0 + page].beatmap.difficulty_rating;
                                            }
                                            if (mapattrdata.attributes.star_rating) {
                                                totaldiff = mapattrdata.attributes.star_rating.toFixed(2);
                                            }
                                            (async () => {
                                                //let modint = osucalc.ModStringToInt(mods)

                                                let modstr = ''
                                                let modint: any;
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
                                                let pp: any;
                                                let ppfc: any;
                                                let hitlist: any;
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
                                                let ppiffc: any;
                                                let ppissue: any;
                                                try {
                                                    let ppc = await pp.compute()
                                                    let ppfcd = await ppfc.compute()

                                                    ppiffc = ppfcd.total.toFixed(2)
                                                    fs.writeFileSync(`debugosu/command-rs=pp.json`, `[\n${JSON.stringify(ppc, null, 2)},\n ${JSON.stringify(ppfcd, null, 2)}\n]`)
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
                                                let fcflag: any;
                                                if (rsdata[0 + page].perfect == true) {
                                                    fcflag = '**FC**'
                                                } else if (rsdata[0 + page].perfect == false) {
                                                    fcflag = `**${ppiffc}**pp IF **${fcacc}** FC`
                                                }
                                                let title = rsdata[0 + page].beatmapset.title
                                                let titleunicode = rsdata[0 + page].beatmapset.title_unicode
                                                let titlediff = rsdata[0 + page].beatmap.version
                                                let titlestring: any;
                                                if (title != titleunicode) {
                                                    titlestring = `${title} (${titleunicode}) [${titlediff}]`
                                                }
                                                else {
                                                    titlestring = `${title} [${titlediff}]`
                                                }
                                                let trycount = 0
                                                for (let i = 0; i < rsdata.length; i++) {
                                                    if (rsdata[i].beatmap.id == rsdata[0 + page].beatmap.id) {
                                                        trycount++
                                                    }
                                                }
                                                let trycountstr = ''
                                                if (trycount > 1) {
                                                    trycountstr = `try #${trycount}`
                                                }

                                                let scoretimestampdate: any = new Date((rsdata[0 + page].created_at).toString().slice(0, -6) + "Z")
                                                let curtime: any = new Date()
                                                let minsincelastvis: any = Math.abs((scoretimestampdate - curtime) / (1000 * 60)).toFixed(0)
                                                let lastvismin = minsincelastvis % 60
                                                let lastvishour = Math.trunc(minsincelastvis / 60) % 24
                                                let timeago = `${lastvishour}h ${lastvismin}m`



                                                let Embed = new Discord.EmbedBuilder()
                                                    .setColor(0x9AAAC0)
                                                    .setTitle(`#${page + 1} most recent play for ${rsdata[0 + page].user.username}`)
                                                    .setURL(`https://osu.ppy.sh/scores/${rsdata[0 + page].mode}/${rsdata[0 + page].id}`)
                                                    .setAuthor({ name: `${timeago} Ago on ${rsdata[0 + page].created_at.substring(0, rsdata[0 + page].created_at.length - 6).replace('T', ' ')} ${trycountstr} `, url: `https://osu.ppy.sh/u/${userid}`, iconURL: `https://a.ppy.sh/${userid}` })
                                                    .setThumbnail(`${rsdata[0 + page].beatmapset.covers.list}`)
                                                    .addFields([
                                                        {
                                                            name: 'MAP DETAILS',
                                                            value: `[${titlestring}](https://osu.ppy.sh/b/${rsdata[0 + page].beatmap.id}) ${modstr} ${totaldiff}⭐ | ${rsdata[0 + page].mode}`,
                                                            inline: false
                                                        },
                                                        {
                                                            name: 'SCORE DETAILS',
                                                            value: `${(rsdata[0 + page].accuracy * 100).toFixed(2)}% | ${rsgrade}\n` +
                                                                `${rspassinfo}\n${hitlist}\n${rsdata[0 + page].max_combo}x combo`,
                                                            inline: true
                                                        },
                                                        {
                                                            name: 'PP',
                                                            value: `**${rspp}**pp \n${fcflag}\n${ppissue}`,
                                                            inline: true
                                                        }]);
                                                if (interaction.type == Discord.InteractionType.ApplicationCommand) {

                                                    interaction.editReply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false }, components: [buttons] })
                                                    fs.appendFileSync('commands.log', `\nsuccess - Interaction ID: ${interaction.id}\n\n`, 'utf-8')
                                                    fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}\npage: ${page}\nmode: ${mode}`)
                                                    let endofcommand = new Date().getTime();
                                                    let timeelapsed = endofcommand - currentDate.getTime();
                                                    fs.appendFileSync('commands.log', `\nCommand Latency - ${timeelapsed}ms\n`)

                                                    fs.writeFileSync(`./debugosu/prevmap${interaction.guildId}.json`, JSON.stringify(({ id: rsdata[0 + page].beatmap.id }), null, 2));
                                                } else if (interaction.type == Discord.InteractionType.MessageComponent) {
                                                    message.edit({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false }, components: [buttons] })
                                                    fs.appendFileSync('commands.log', `\nsuccess - Interaction ID: ${interaction.id}\n\n`, 'utf-8')
                                                    let endofcommand = new Date().getTime();
                                                    let timeelapsed = endofcommand - currentDate.getTime();
                                                    fs.appendFileSync('commands.log', `\nCommand Latency - ${timeelapsed}ms\n`)
                                                }
                                            })();
                                        })
                                } else {
                                    let Embed = new Discord.EmbedBuilder()
                                        .setColor(0x9AAAC0)
                                        .setTitle(`Recent plays for ${rsdata[0].user.username}`)
                                    let txt = ''
                                    for (let i = 0; i < (rsdata.length - (page * 20)) && i < 20; i++) {
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
                                    Embed.setDescription(`Page: ${page + 1}/${Math.ceil(rsdata.length / 20)}\n` + txt)
                                    Embed.setFooter({ text: `gamemode: ${rsdata[0].mode}` })
                                    interaction.editReply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false }, components: [buttons] })
                                }
                            } catch (error) {
                                fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}\nPage: ${page}\nmode: ${mode}`)
                                if (interaction.type == Discord.InteractionType.ApplicationCommand) {
                                    return interaction.editReply({ content: 'Error - no score found', allowedMentions: { repliedUser: false } })
                                }
                            }

                        })
                })

        }
    }
}