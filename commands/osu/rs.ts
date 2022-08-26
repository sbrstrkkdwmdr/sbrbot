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
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;

        let user = null;
        let page = 1;
        let mode = null;
        let list = false;
        let searchid;
        let isFirstPage = false;
        let isLastPage = false;

        if (message != null && button == null) {
            commanduser = message.author;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - rs (message)
${currentDate} | ${currentDateISO}
recieved rs command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
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
            isFirstPage = true;
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - rs (interaction)
${currentDate} | ${currentDateISO}
recieved rs command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            user = interaction.options.getString('user');
            page = interaction.options.getNumber('page');
            mode = interaction.options.getString('mode');
            list = interaction.options.getBoolean('list');
            searchid = interaction.member.user.id;
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - rs (interaction)
${currentDate} | ${currentDateISO}
recieved rs command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            user =
                message.embeds[0].title.includes('play for') ?
                    message.embeds[0].title.split('most recent play for ')[1].split(' | ')[0] :
                    message.embeds[0].title.split('plays for ')[1]
            try {
                mode = message.embeds[0].fields[0].value.split(' | ')[1].split('\n')[0]
            } catch (error) {
                mode = message.embeds[0].footer.text.split('gamemode: ')[1]
            }
            page = 0
            if (button == 'BigLeftArrow') {
                page = 1
            }
            if (message.embeds[0].title.includes('plays')) {
                switch (button) {
                    case 'LeftArrow':
                        page = parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1
                        break;
                    case 'RightArrow':
                        page = parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n'[0]))
                        break;
                    case 'Refresh':
                        page = parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[0])
                        break;
                }
                list = true
                if (isNaN((message.embeds[0].description).split('Page: ')[1].split('/')[0]) || ((message.embeds[0].description).split('Page: ')[1].split('/')[0]) == 'NaN') {
                    page = 1
                }
                if (page < 2) {
                    isFirstPage = true;
                }
                if (page == parseInt((message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n'[0]))) {
                    isLastPage = true;
                }
            } else {
                switch (button) {
                    case 'LeftArrow':
                        page = parseInt((message.embeds[0].title).split(' ')[0].split('#')[1]) - 1
                        break;
                    case 'RightArrow':
                        page = parseInt((message.embeds[0].title).split(' ')[0].split('#')[1]) + 1
                        break;
                    case 'Refresh':
                        page = parseInt((message.embeds[0].title).split(' ')[0].split('#')[1])
                        break;
                }
                if (page < 2) {
                    page == 1
                }
            }
            searchid == interaction.member.user.id;
        }

        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
Options:
    user: ${user}
    page: ${page}
    mode: ${mode}
    list: ${list}
----------------------------------------------------
`, 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================


        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-rs-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage)
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-rs-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀')
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-rs-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    .setDisabled(isLastPage)
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-rs-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    .setDisabled(isLastPage)
                    /* .setLabel('End') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-rs-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('🔁')
            );

        if (user == null || message.mentions.users.size > 0) {
            const findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname == null) {
                return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    .catch();

            } else {
                user = findname.get('osuname')
                if (user.length < 1) {
                    return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();

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
            const findname = await userdata.findOne({ where: { userid: searchid } })
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
                .catch();

        }
        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${user}`)
        fs.writeFileSync(`debugosu/commands-rs=user=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        try {
            if (osudata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                if (button == null) {
                    obj.reply({ content: 'error - osu auth out of date. Updating token...', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                await osufunc.updateToken();
                return;
            }
            if (typeof osudata.error != 'undefined' && osudata.error == null) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - ${osudata.error}
----------------------------------------------------`)
                if (button == null) {
                    await obj.reply({ content: `error - ${osudata.error}`, allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                return;
            }
        } catch (error) {
        }

        if (!osudata.id) {
            return obj.channel.send(
                'Error - no user found'
            )
                .catch();

        }
        const findname = await userdata.findOne({ where: { osuname: user } })
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
        }
        const rsdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('recent', `${osudata.id}`, `${mode}`)
        fs.writeFileSync(`debugosu/commands-rs=rsdata=${obj.guildId}.json`, JSON.stringify(rsdata, null, 2))
        try {
            if (rsdata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                if (button == null) {
                    obj.reply({ content: 'error - osu auth out of date. Updating token...', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                await osufunc.updateToken();
                return;
            }
            if (typeof rsdata.error != 'undefined' && rsdata.error == null) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - ${rsdata.error}
----------------------------------------------------`)
                if (button == null) {
                    await obj.reply({ content: `error - ${rsdata.error}`, allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                return;
            }
        } catch (error) {
        }


        const rsEmbed = new Discord.EmbedBuilder();

        if (list != true) {
            rsEmbed.setColor(colours.embedColour.score.hex)

            if (button == 'BigRightArrow') {
                page = rsdata.length - 1
            }
            if (page >= rsdata.length - 1){
                buttons.components[2].setDisabled(true)
                buttons.components[3].setDisabled(true)
            }

            const curscore = rsdata[0 + page]
            if (!curscore || curscore == undefined || curscore == null) {
                if (interaction && button == null) {
                    interaction.editReply(
                        {
                            content: ' Error - no score found',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                        .catch();

                }
                if (message && button == null) {
                    message.reply(
                        {
                            content: ' Error - no score found',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                        .catch();

                }
                return;
            }
            const curbm = curscore.beatmap
            const curbms = curscore.beatmapset
            // const hittime = curbm.hit_length
            // let totalstr;


            const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${curbm.id}`)
            fs.writeFileSync(`debugosu/commands-rs=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))
            try {
                if (mapdata.authentication) {
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
    ----------------------------------------------------
    cmd ID: ${absoluteID}
    Error - authentication
    ----------------------------------------------------`)
                    if (button == null) {
                        obj.reply({ content: 'error - osu auth out of date. Updating token...', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            .catch();
                    }
                    await osufunc.updateToken();
                    return;
                }
                if (typeof mapdata.error != 'undefined' && mapdata.error == null) {
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
    ----------------------------------------------------
    cmd ID: ${absoluteID}
    Error - ${mapdata.error}
    ----------------------------------------------------`)
                    if (button == null) {
                        await obj.reply({ content: `error - ${mapdata.error}`, allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            .catch();
                    }
                    return;
                }
            } catch (error) {
            }

            let accgr;
            let fcaccgr;
            const gamehits = curscore.statistics;
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
            const curbmhitobj = mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners;
            const guesspasspercentage = Math.abs((totalhits / curbmhitobj) * 100);
            const curbmpasstime = Math.floor(guesspasspercentage / 100 * curbm.total_length);

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
            let totaldiff: string;
            let hitlist: string;
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
            let ppissue: string = '';
            // const ppiffc = NaN;
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
            let fcflag = 'FC'
            if (curscore.accuracy != 100) {
                fcflag += `\n**${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
            }
            if (curscore.perfect == false) {
                fcflag =
                    `\n**${ppcalcing[1].pp.toFixed(2)}**pp IF ${fcaccgr.accuracy.toFixed(2)}% FC
                **${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
            }
            const title =
                curbms.title == curbms.title_unicode ?
                    curbms.title :
                    `${curbms.title} (${curbms.title_unicode})`
            const artist =
                curbms.artist == curbms.artist_unicode ?
                    curbms.artist :
                    `${curbms.artist} (${curbms.artist_unicode})`
            const fulltitle = `${artist} - ${title} [${curbm.version}]`
            let trycount = 1
            for (let i = rsdata.length - 1; i > (page); i--) {
                if (curbm.id == rsdata[i].beatmap.id) {
                    trycount++
                }
            }
            const trycountstr = `try #${trycount}`;

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
                        value:
                            `
[${fulltitle}](https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods.length > 0 ? '+' + osumodcalc.OrderMods(curscore.mods.join('').toUpperCase()) : ''} 
${totaldiff}⭐ | ${curscore.mode}
${new Date(curscore.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '')}
                        `,
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
                        value: `**${rspp}**pp ${fcflag}\n${ppissue}`,
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
                const curscore = rsdata[i + page * 20]
                txt +=
                    `**${1 + i + page * 20} | <t:${new Date(curscore.created_at).getTime() / 1000}:R>**
[${curscore.beatmapset.title}](https://osu.ppy.sh/b/${curscore.beatmap.id}) | [score link](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id})
${curscore.mods.length > 0 ? '+' + curscore.mods.join('') + ' | ' : ''}${(curscore.accuracy * 100).toFixed(2)}% | ${curscore.rank}
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
                .catch();

        }
        if (message && button == null) {
            obj.reply({
                embeds: [rsEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons],
                failIfNotExists: true
            })
                .catch();

        }
        if (button != null) {
            message.edit({
                embeds: [rsEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons],
                failIfNotExists: true
            })
                .catch();

        }

        const endofcommand = new Date().getTime();
        const timeelapsed = endofcommand - currentDate.getTime();
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}