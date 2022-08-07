import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../configs/osufunc');
import cmdchecks = require('../../configs/commandchecks');
import calc = require('../../configs/calculations');
module.exports = {
    name: 'rs',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        //let absoluteID = new Date().getTime()
        let accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
        let access_token = JSON.parse(accessN).access_token;
        let buttons;

        let user = null;
        let page = 1;
        let mode = null;
        let list = false;
        let searchid;

        if (message != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - rs (message)
${currentDate} | ${currentDateISO}
recieved recent play command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
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
            user = args.join(' ');
            page = 0;
            mode = null;
            searchid = message.author.id
            if (message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            if (!args[0]) {
                user = null
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - rs (interaction)
${currentDate} | ${currentDateISO}
recieved recent play command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
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
            user = interaction.options.getString('user');
            page = interaction.options.getNumber('page');
            mode = interaction.options.getString('mode');
            list = interaction.options.getBoolean('list');
            searchid = interaction.member.user.id;
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - rs (button)
${currentDate} | ${currentDateISO}
recieved recent play command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
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
            user =
                message.embeds[0].title.includes('play for') ?
                    message.embeds[0].title.split('most recent play for ')[1].split(' | ')[0] :
                    message.embeds[0].title.split('plays for ')[1]
            try {
                mode = message.embeds[0].fields[0].value.split(' | ')[1]
            } catch (error) {
                mode = message.embeds[0].footer.text.split('gamemode: ')[1]
            }
            page = 0
            if (button == 'BigLeftArrow') {
                page = 0
            }
            if (message.embeds[0].title.includes('plays')) {
                if (button == 'LeftArrow') {
                    page = parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1
                } else if (button == 'RightArrow') {
                    page = parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1
                } else if (button == 'BigRightArrow') {
                    page = parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n'[0]))
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
            searchid == interaction.member.user.id;
        }
        if (user == null) {
            let findname;
            findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname == null) {
                return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
            } else {
                user = findname.get('osuname')
                if (user.length < 1) {
                    return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
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
        if (mode == null) {
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
        if (interaction && button == null) {
            obj.reply({
                content: 'Fetching data...',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    user: ${user}
    page: ${page}
    mode: ${mode}
    list: ${list}
----------------------------------------------------
`, 'utf-8')
        let userinfourl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(user)}/osu`

        const osudata = await fetch(userinfourl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)
        fs.writeFileSync(`debugosu/command-rs=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))

        try {
            if (osudata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
`
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                setTimeout(() => {

                    obj.channel.send({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                }, 100)
                return;
            }
        } catch (error) {

        }
        if (!osudata.id) {
            return obj.channel.send(
                'Error - no user found'
            )
        }
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
        } else { }
        let recentplayurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(osudata.id)}/scores/recent?include_fails=1&mode=${cmdchecks.toHexadecimal(mode)}&limit=100&offset=0`

        const rsdata = await fetch(recentplayurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any);
        fs.writeFileSync(`debugosu/command-rs=rsdata=${obj.guildId}.json`, JSON.stringify(rsdata, null, 2))

        let rsEmbed = new Discord.EmbedBuilder();

        if (list != true) {
            if (!rsdata[0 + page] && interaction && button == null) {
                return interaction.editReply(
                    {
                        content: ' Error - no score found',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
            }
            if (!rsdata[0 + page] && message && button == null) {
                return message.reply(
                    {
                        content: ' Error - no score found',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
            }
            let curscore = rsdata[0 + page]
            let curbm = curscore.beatmap
            let curbms = curscore.beatmapset
            let hittime = curbm.hit_length
            let totalstr;

            let values = osumodcalc.calcValues(
                curbm.cs,
                curbm.ar,
                curbm.accuracy,
                curbm.drain,
                curbm.bpm,
                curbm.hit_length,
                osumodcalc.OrderMods(curscore.mods.join(''))
            );


            let accgr;
            let fcaccgr;
            let gamehits = curscore.statistics;
            switch (rsdata.mode) {
                case 'osu': default:
                    accgr =
                        osumodcalc.calcgrade(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_50,
                            gamehits.count_miss
                        )
                    fcaccgr =
                        osumodcalc.calcgrade(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_50,
                            0
                        )
                    break;
                case 'taiko':
                    accgr =
                        osumodcalc.calcgradeTaiko(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_miss
                        )
                    fcaccgr =
                        osumodcalc.calcgradeTaiko(
                            gamehits.count_300,
                            gamehits.count_100,
                            0
                        )
                    break;
                case 'fruits':
                    accgr =
                        osumodcalc.calcgradeCatch(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_50,
                            gamehits.count_katu,
                            gamehits.count_miss
                        )
                    fcaccgr =
                        osumodcalc.calcgradeCatch(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_50,
                            gamehits.count_katu,
                            0
                        )
                    break;
                case 'mania':
                    accgr =
                        osumodcalc.calcgradeMania(
                            gamehits.count_geki,
                            gamehits.count_300,
                            gamehits.count_katu,
                            gamehits.count_100,
                            gamehits.count_50,
                            gamehits.count_miss
                        )
                    fcaccgr =
                        osumodcalc.calcgradeMania(
                            gamehits.count_geki,
                            gamehits.count_300,
                            gamehits.count_katu,
                            gamehits.count_100,
                            gamehits.count_50,
                            0
                        )
                    break;
            }
            let rspassinfo = '';
            let rsgrade;
            switch (curscore.rank.toUpperCase()) {
                case 'F':
                    rspassinfo = `\n??:??/${calc.secondsToTime(curbm.total_length)} (NaN% completed)`
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
            }
            let iftherearemodsasint = JSON.stringify({
                "ruleset": mode
            });
            if (curscore.mods.join('') != 'NM' && curscore.mods.join('').length > 1) {
                iftherearemodsasint =
                    JSON.stringify({
                        "ruleset": mode,
                        "mods": osumodcalc.ModStringToInt(curscore.mods.join(''))
                    })
            }
            let beatattrurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(curbm.id)}/attributes`;
            const mapattrdata = await fetch(beatattrurl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                },
                body: iftherearemodsasint
            }).then(res => res.json() as any);
            fs.writeFileSync(`debugosu/command-rs=mapattrdata=${obj.guildId}.json`, JSON.stringify(mapattrdata, null, 2))

            let totaldiff = '?'
            if (mapattrdata.error) {
                totaldiff = curbm.difficulty_rating.toFixed(2);
            } else if (mapattrdata.attributes) {
                totaldiff = mapattrdata.attributes.star_rating.toFixed(2);
            }
            if (totaldiff == '?') {
                totaldiff = curbm.difficulty_rating.toFixed(2);
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
                enabled_mods: osumodcalc.ModStringToInt(curscore.mods.join('')),
                user_id: osudata.id,
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
                enabled_mods: osumodcalc.ModStringToInt(curscore.mods.join('')),
                user_id: osudata.id,
                date: '2022-02-08 05:24:54',
                rank: 'S',
                score_id: '4057765057'
            }
            let pp: any;
            let ppfc: any;
            let hitlist: any;
            switch (curscore.mode) {
                case 'osu': default:
                    pp = new ppcalc.std_ppv2().setPerformance(scorenofc)
                    ppfc = new ppcalc.std_ppv2().setPerformance(score)
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                    break;
                case 'taiko':
                    pp = new ppcalc.taiko_ppv2().setPerformance(scorenofc)
                    ppfc = new ppcalc.taiko_ppv2().setPerformance(score)
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **Miss:** ${gamehits.count_miss}`
                    break;
                case 'fruits':
                    pp = new ppcalc.catch_ppv2().setPerformance(scorenofc)
                    ppfc = new ppcalc.catch_ppv2().setPerformance(score)
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                    break;
                case 'mania':
                    pp = new ppcalc.mania_ppv2().setPerformance(scorenofc)
                    ppfc = new ppcalc.mania_ppv2().setPerformance(score)
                    hitlist = `**300+:** ${gamehits.count_geki} \n **300:** ${gamehits.count_300} \n **200:** ${gamehits.count_katu} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                    break;
            }
            let rspp = 0;
            let ppissue: any = '';
            let ppiffc = NaN;
            try {
                let ppc = await pp.compute();
                let ppfcd = await ppfc.compute();

                ppiffc = curscore.perfect == true ?
                    '' :
                    ppfcd.total.toFixed(2)

                rspp =
                    curscore.pp ?
                        curscore.pp.toFixed(2) :
                        ppc.total.toFixed(2)
            } catch (error) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
`
----------------------------------------------------
cmd ID: ${absoluteID}
Error - pp calculation failed
${error}
----------------------------------------------------`)
                rspp =
                    curscore.pp ?
                        curscore.pp.toFixed(2) :
                        NaN
                ppissue = 'Error - pp calculator could not fetch beatmap'
            }
            let fcflag = '**FC**'
            if (curscore.perfect) {

            }
            if (curscore.perfect == false) {
                fcflag = `**${ppiffc}**p IF ${fcaccgr.accuracy.toFixed(2)}% FC`
            }
            let title =
                curbms.title == curbms.title_unicode ?
                    curbms.title :
                    `${curbms.title} (${curbms.title_unicode})`
            let artist =
                curbms.artist == curbms.artist_unicode ?
                    curbms.artist :
                    `${curbms.artist} (${curbms.artist_unicode})`
            let fulltitle = `${artist} - ${title} [${curbm.version}]`
            let trycount = 1
            for (let i = rsdata.length - 1; i > (page); i--) {
                if (curbm.id == rsdata[i].beatmap.id) {
                    trycount++
                }
            }
            let trycountstr = `try #${trycount}`;

            rsEmbed
                .setColor(0x9AAAC0)
                .setTitle(`#${page + 1} most recent play for ${curscore.user.username} | <t:${new Date(curscore.created_at).getTime() / 1000}:R>`)
                .setURL(`https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}`)
                .setAuthor({
                    name: `${trycountstr}`,
                    url: `https://osu.ppy.sh/${osudata.id}`,
                    iconURL: `https://a.ppy.sh/${osudata.id}`
                })
                .setThumbnail(`${curbms.covers.list}`)
                .addFields([
                    {
                        name: 'MAP DETAILS',
                        value: `${fulltitle}(https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods ? '+' + curscore.mods.join('').toUpperCase() : ''} ${totaldiff}⭐ | ${curscore.mode}`,
                        inline: false
                    },
                    {
                        name: 'SCORE DETAILS',
                        value: `${(curscore.accuracy * 100).toFixed(2)}% | ${rsgrade}\n` +
                            `${rspassinfo}\n${hitlist}\n${curscore.max_combo}x combo`,
                        inline: true
                    },
                    {
                        name: 'PP',
                        value: `**${rspp}**pp \n${fcflag}\n${ppissue}`,
                        inline: true
                    }
                ])
        } else if (list == true) {
            rsEmbed
                .setColor(0x9AAAC0)
                .setTitle(`Recent plays for ${osudata.username}`);
            let txt = '';
            for (let i = 0; i < rsdata.length - (page * 20) && i < 20; i++) {
                let curscore = rsdata[i + page * 20]
                txt +=
                    `${1 + i + page * 20} | [${curscore.beatmapset.title}](https://osu.ppy.sh/b/${curscore.beatmap.id}) | [score](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id})
                ${curscore.mods.join('').length > 1 ? '+' + curscore.mods.join('') + ' | ' : ''}${(curscore.accuracy * 100).toFixed(2)}% | ${curscore.rank}\n`
            }
            if (txt == '') {
                txt = 'No recent plays found'
            }
            if (txt.length > 4000) {
                txt = txt.substring(0, 4000)
            }
            rsEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(rsdata.length / 20)}\n` + txt)
            rsEmbed.setFooter({ text: `gamemode: ${rsdata[0].mode}` })
        }

        if (interaction && button == null) {
            obj.editReply({
                content: '⠀',
                embeds: [rsEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons],
                failIfNotExists: true
            })
        }
        if (message && button == null) {
            obj.reply({
                embeds: [rsEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons],
                failIfNotExists: true
            })
        }
        if (button != null) {
            message.edit({
                embeds: [rsEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons],
                failIfNotExists: true
            })
        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Command Latency - ${new Date().getTime() - currentDate.getTime()}ms
success
----------------------------------------------------
`, 'utf-8')
    }
}