import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../calc/osufunc');
import cmdchecks = require('../../calc/commandchecks');
import calc = require('../../calc/calculations');
import colours = require('../../configs/colours');
import osuApiTypes = require('../../configs/osuApiTypes');

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
            fs.appendFileSync(`logs/cmd/commands${message.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
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
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

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
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (button)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
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
        if (user == null || message.mentions.users.size > 0) {
            let findname;
            findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname == null) {
                return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    .catch(error => { });

            } else {
                user = findname.get('osuname')
                if (user.length < 1) {
                    return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch(error => { });

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
                .catch(error => { });

        }
        let userinfourl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(user)}/osu`

        const osudata: osuApiTypes.User = await fetch(userinfourl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)
        fs.writeFileSync(`debugosu/commands-rs=user=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        try {
            if (osudata.authentication) {
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
                .catch(error => { });

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

        const rsdata: osuApiTypes.Score[] = await fetch(recentplayurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any).catch(error => {
            if (button == null) {
                try {
                    message.edit({
                        content: 'Error',
                        allowedMentions: { repliedUser: false },
                    })


                } catch (err) {

                }
            } else {
                obj.reply({
                    content: 'Error',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch(error => { });

            }
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
            return;
        });

        fs.writeFileSync(`debugosu/commands-rs=rsdata=${obj.guildId}.json`, JSON.stringify(rsdata, null, 2))

        let rsEmbed = new Discord.EmbedBuilder();

        if (list != true) {
            rsEmbed.setColor(colours.embedColour.score.hex)

            let curscore = rsdata[0 + page]
            if (!curscore || curscore == undefined || curscore == null) {
                if (interaction && button == null) {
                    interaction.editReply(
                        {
                            content: ' Error - no score found',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                        .catch(error => { });

                }
                if (message && button == null) {
                    message.reply(
                        {
                            content: ' Error - no score found',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                        .catch(error => { });

                }
                return;
            }
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

            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(curbm.id)}?`;

            const mapdata: osuApiTypes.Beatmap = await fetch(mapurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any).catch(error => {
                if (button == null) {
                    try {
                        message.edit({
                            content: 'Error',
                            allowedMentions: { repliedUser: false },
                        })

                    } catch (err) {

                    }
                } else {
                    obj.reply({
                        content: 'Error',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch(error => { });

                }
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
                return;
            });

            fs.writeFileSync(`debugosu/commands-rs=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))

            let accgr;
            let fcaccgr;
            let gamehits = curscore.statistics;
            switch (rsdata[0].mode) {
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
            let totalhits;

            switch (rsdata[0].mode) {
                case 'osu': default:
                    totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_50 + gamehits.count_miss;
                    break;
                case 'taiko':
                    totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_miss;
                    break;
                case 'fruits':
                    totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_50 + gamehits.count_katu + gamehits.count_miss;
                    break;
                case 'mania':
                    totalhits = gamehits.count_geki + gamehits.count_300 + gamehits.count_katu + gamehits.count_100 + gamehits.count_50 + gamehits.count_miss;
            }
            let curbmhitobj = mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners;
            let guesspasspercentage = Math.abs((totalhits / curbmhitobj) * 100);
            let curbmpasstime = Math.floor(guesspasspercentage / 100 * curbm.total_length);

            let rsgrade;
            switch (curscore.rank.toUpperCase()) {
                case 'F':
                    rspassinfo = `\n${guesspasspercentage.toFixed(2)}% completed (${calc.secondsToTime(curbmpasstime)}/${calc.secondsToTime(curbm.total_length)})`
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
            let totaldiff: any;
            let pp: any;
            let ppfc: any;
            let hitlist: any;
            switch (curscore.mode) {
                case 'osu': default:
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                    break;
                case 'taiko':
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **Miss:** ${gamehits.count_miss}`
                    break;
                case 'fruits':
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                    break;
                case 'mania':
                    hitlist = `**300+:** ${gamehits.count_geki} \n **300:** ${gamehits.count_300} \n **200:** ${gamehits.count_katu} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                    break;
            }
            let rspp: string | number = 0;
            let ppissue: any = '';
            let ppiffc = NaN;
            let ppcalcing
            try {
                ppcalcing = await osufunc.scorecalc(
                    curscore.mods.join('').length > 1 ?
                        curscore.mods.join('') : 'NM',
                    curscore.mode,
                    curscore.beatmap.id,
                    gamehits.count_geki,
                    gamehits.count_300,
                    gamehits.count_katu,
                    gamehits.count_100,
                    gamehits.count_50,
                    gamehits.count_miss,
                    curscore.accuracy,
                    curscore.max_combo,
                    curscore.score,
                    0,
                    0, false
                )
                if (curscore.rank == 'F') {
                    ppcalcing = await osufunc.scorecalc(
                        curscore.mods.join('').length > 1 ?
                            curscore.mods.join('') : 'NM',
                        curscore.mode,
                        curscore.beatmap.id,
                        gamehits.count_geki,
                        gamehits.count_300,
                        gamehits.count_katu,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_miss,
                        curscore.accuracy,
                        curscore.max_combo,
                        curscore.score,
                        0,
                        totalhits,
                        true
                    )
                }
                totaldiff = ppcalcing[0].stars.toFixed(2)


                rspp =
                    curscore.pp ?
                        curscore.pp.toFixed(2) :
                        ppcalcing[0].pp.toFixed(2)
                fs.writeFileSync(`debugosu/command-rs=pp_calc=${obj.guildId}.json`, JSON.stringify(ppcalcing, null, 2))
            } catch (error) {
                rspp =
                    curscore.pp ?
                        curscore.pp.toFixed(2) :
                        NaN
                ppissue = 'Error - pp calculator could not fetch beatmap'
            }
            let fcflag = '**FC**'
            if (curscore.perfect) {
            }
            if (curscore.accuracy != 100) {
                fcflag = `**${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
            }
            if (curscore.perfect == false) {
                fcflag =
                    `**${ppcalcing[1].pp.toFixed(2)}**pp IF ${fcaccgr.accuracy.toFixed(2)}% FC
                **${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
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
                        value: `[${fulltitle}](https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods ? '+' + curscore.mods.join('').toUpperCase() : ''} \n${totaldiff}⭐ | ${curscore.mode}`,
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

            fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: curbm.id }), null, 2));
        } else if (list == true) {
            rsEmbed
                .setColor(colours.embedColour.scorelist.hex)
                .setTitle(`Recent plays for ${osudata.username}`);
            let txt = '';
            for (let i = 0; i < rsdata.length - (page * 20) && i < 20; i++) {
                let curscore = rsdata[i + page * 20]
                txt +=
                    `**${1 + i + page * 20} | <t:${new Date(curscore.created_at).getTime() / 1000}:R>**
[${curscore.beatmapset.title}](https://osu.ppy.sh/b/${curscore.beatmap.id}) | [score link](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id})
${curscore.mods.join('').length > 1 ? '+' + curscore.mods.join('') + ' | ' : ''}${(curscore.accuracy * 100).toFixed(2)}% | ${curscore.rank}
`
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
                .catch(error => { });

        }
        if (message && button == null) {
            obj.reply({
                embeds: [rsEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons],
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (button != null) {
            message.edit({
                embeds: [rsEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons],
                failIfNotExists: true
            })
                .catch(error => { });

        }

        let endofcommand = new Date().getTime();
        let timeelapsed = endofcommand - currentDate.getTime();
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}