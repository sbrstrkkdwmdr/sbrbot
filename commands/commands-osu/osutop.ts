import fs = require('fs');
import osucalc = require('osumodcalculator')
import { access_token } from '../configs/osuauth.json';
import fetch from 'node-fetch';
import emojis = require('../configs/emojis')
import osufunc = require('../configs/osufunc')

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

    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button) {

        if (message != null && button == null) {

            let buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-osutop-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-osutop-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀')
                    /* .setLabel('Previous') */,
                /*                 new Discord.ButtonBuilder()
                                    .setCustomId('Middle-osutop')
                                    .setStyle('Primary')
                                    .setLabel('🔍')
                                , */
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-osutop-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-osutop-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    /* .setLabel('End') */,
            );


            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - osutop (message)\n${currentDate} | ${currentDateISO}\n recieved osu! top plays command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            let user = args.join(' ')
            let searchid = message.author.id
            if (message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            if (user.length < 1 || message.mentions.users.size > 0) {
                let findname;
                findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return message.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                }
            }

            let gamemode = null
            if (gamemode == null) {
                let findname = await userdata.findOne({ where: { userid: message.author.id } })
                if (findname != null) {
                    gamemode = findname.get('mode');
                } else {
                    gamemode = 'osu'
                }
            }
            if (!(gamemode == 'osu' || gamemode == 'taiko' || gamemode == 'fruits' || gamemode == 'mania')){
                gamemode = 'osu'
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
            }).then(res => res.json() as any)
                .then(osudata => {
                    fs.writeFileSync('debugosu/command-osutopname.json', JSON.stringify(osudata, null, 2))
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

                        let userid = osudata.id
                        let usertopurl = `https://osu.ppy.sh/api/v2/users/${userid}/scores/best?mode=${gamemode}&limit=100&offset=0`;
                        fetch(usertopurl, {
                            headers: {
                                Authorization: `Bearer ${access_token}`
                            }
                        }).then(res => res.json() as any)
                            .then(osutopdata => {
                                fs.writeFileSync('debugosu/command-osutop.json', JSON.stringify(osutopdata, null, 2))
                                try {
                                    let usernametesting = osutopdata[0].user.username
                                } catch (error) {
                                    console.log(error)
                                    fs.writeFileSync('commands.log', JSON.stringify(error, null, 2))
                                    return message.reply({ content: 'failed to get osu! top plays', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                                }
                                let topEmbed = new Discord.EmbedBuilder()
                                    .setColor(0x462B71)
                                    .setTitle(`Top plays of ${osutopdata[0].user.username}`)
                                    .setThumbnail(`https://a.ppy.sh/${osutopdata[0].user.id}`)
                                    .setURL(`https://osu.ppy.sh/users/${osutopdata[0].user.id}`)
                                    .setDescription(`sorted by highest pp\nPage: 1/${Math.ceil(osutopdata.length / 5)}\nmode: ${gamemode}\n`)
                                for (let i = 0; i < 5 && i < osutopdata.length; i++) {
                                    let scoreoffset = page * 5 + i

                                    let tstscore = osutopdata[scoreoffset]
                                    if (!tstscore) {
                                        break;
                                    }

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
                                    let grade: any;
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
                                    let topmods: any = osutopdata[scoreoffset].mods
                                    let ifmods: any;
                                    if (!topmods || topmods == '' || topmods == 'undefined' || topmods == null || topmods == undefined) {
                                        ifmods = ''
                                    } else {
                                        ifmods = '+' + topmods.toString().replaceAll(",", '')
                                    }
                                    topEmbed.addFields([{
                                        name: `#${scoreoffset + 1}`,
                                        value: `
                                [**${osutopdata[scoreoffset].beatmapset.title} [${osutopdata[scoreoffset].beatmap.version}]**](https://osu.ppy.sh/b/${osutopdata[scoreoffset].beatmap.id}) ${ifmods}
                                **Score set on** ${maptimeset}
                                **SCORE:** ${score} | x${combo} | ${Math.abs(osutopdata[scoreoffset].accuracy * 100).toFixed(2)}% | ${grade}
                                \`${hitlist}\`
                                ${(osutopdata[scoreoffset].pp).toFixed(2)}pp | ${(osutopdata[scoreoffset].weight.pp).toFixed(2)}pp (Weighted at **${(osutopdata[scoreoffset].weight.percentage).toFixed(2)}%**)
                                `,
                                        inline: false
                                    }])
                                }
                                message.reply({ content: '⠀', embeds: [topEmbed], allowedMentions: { repliedUser: false }, components: [buttons], failIfNotExists: true })
                                fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                            })
                    } catch (error) {
                        message.reply({ content: 'user ' + user + ' not found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                    }
                })

        }

        if (interaction != null) {

            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-osutop-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-osutop-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-osutop')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-osutop-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-osutop-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );

            let user;
            let gamemode;
            let mapper;
            let mods;
            let sort;
            let page;
            let detailed;
            let reverse;
            let compact;

            if (interaction.type == Discord.InteractionType.ApplicationCommand) {
                fs.appendFileSync('commands.log', `\nCOMMAND EVENT - osutop (interaction)\n${currentDate} | ${currentDateISO}\n recieved osu! top plays command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
                fs.appendFileSync('commands.log', `\nInteraction ID: ${interaction.id}`)
                fs.appendFileSync('commands.log',
                    `\noptions:
                user: ${interaction.options.getString('user')}
                mode: ${interaction.options.getString('mode')}
                sort: ${interaction.options.getString('sort')}
                reverse: ${interaction.options.getBoolean('reverse')}
                page: ${interaction.options.getInteger('page')}
                mapper: ${interaction.options.getString('mapper')}
                mods: ${interaction.options.getString('mods')}
                detailed: ${interaction.options.getBoolean('detailed')}
                compact: ${interaction.options.getBoolean('compact')}
                `
                )
                user = interaction.options.getString('user')
                gamemode = interaction.options.getString('mode')
                mapper = interaction.options.getString('mapper')
                mods = interaction.options.getString('mods')
                sort = interaction.options.getString('sort')
                page = interaction.options.getInteger('page')
                detailed = interaction.options.getBoolean('detailed')
                reverse = interaction.options.getBoolean('reverse')
                compact = interaction.options.getBoolean('compact')
            } else {
                fs.appendFileSync('commands.log', `\nBUTTON EVENT - osutop (interaction)\n${currentDate} | ${currentDateISO}\n recieved osu! top plays command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
                fs.appendFileSync('commands.log', `\nInteraction ID: ${interaction.id}`)
                fs.appendFileSync('commands.log', `\n${button}`);

                user = message.embeds[0].title.split('Top plays of ')[1]

                if (message.embeds[0].description) {
                    if (message.embeds[0].description.includes('mapper')) {
                        mapper = message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                    }
                    if (message.embeds[0].description.includes('mods')) {
                        mods = message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                    }
                    let sort1 = message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                    switch (true) {
                        case sort1.includes('score'):
                            sort = 'score'
                            break;
                        case sort1.includes('acc'):
                            sort = 'acc'
                            break;
                        case sort1.includes('pp'):
                            sort = 'pp'
                            break;
                        case sort1.includes('old'): case sort1.includes('recent'):
                            sort = 'recent'
                            break;
                        case sort1.includes('combo'):
                            sort = 'combo'
                            break;
                        case sort1.includes('miss'):
                            sort = 'miss'
                            break;

                    }


                    let reverse1 = message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                    if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses'))) {
                        reverse = true
                    } else {
                        reverse = false
                    }

                    if (message.embeds[0].fields.length == 7 || message.embeds[0].fields.length == 11) {
                        detailed = true
                    } else {
                        detailed = false
                    }
                    page = 0
                    if (button == 'BigLeftArrow') {
                        page = 0
                    } else if (button == 'LeftArrow') {
                        page = parseInt((message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
                    } else if (button == 'RightArrow') {
                        page = parseInt((message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
                    } else if (button == 'BigRightArrow') {
                        page = parseInt((message.embeds[0].description).split('/')[1].split('\n')[0])
                    }
                    if (message.embeds[0].fields.length > 8) {
                        compact = true
                    } else {
                        compact = false
                    }
                    gamemode = message.embeds[0].description.split('mode: ')[1].split('\n')[0]
                }
            }
            if (user == null) {
                let findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return interaction.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false } })
                }
            }
            if (gamemode == null) {
                let findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname != null) {
                    gamemode = findname.get('mode');
                } else {
                    gamemode = 'osu'
                }
            }
            if (!(gamemode == 'osu' || gamemode == 'taiko' || gamemode == 'fruits' || gamemode == 'mania')){
                gamemode = 'osu'
            }
            if (page == null || page < 1) {
                page = 0
            } else {
                page = page - 1
            }
            let userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`;
            fs.appendFileSync('commands.log',
                `\noptions(2):
            user: ${user}
            mode: ${gamemode}
            sort: ${sort}
            reverse: ${reverse}
            page: ${page}
            mapper: ${mapper}
            mods: ${mods}
            detailed: ${detailed}
            compact: ${compact}
            `)
            fetch(userurl, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    fs.writeFileSync('debugosu/command-osutopname.json', JSON.stringify(osudata, null, 2))
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
                        let userid = osudata.id
                        //interaction.reply('Loading...')
                        let usertopurl = `https://osu.ppy.sh/api/v2/users/${userid}/scores/best?mode=${gamemode}&limit=100&offset=0`;
                        fetch(usertopurl, {
                            headers: {
                                Authorization: `Bearer ${access_token}`
                            }
                        }).then(res => res.json() as any)
                            .then(osutopdataPreSort => {
                                fs.writeFileSync('debugosu/command-osutop.json', JSON.stringify(osutopdataPreSort, null, 2))
                                try {
                                    let usernametesting = osutopdataPreSort[0].user.username
                                } catch (error) {
                                    console.log(error)
                                    fs.writeFileSync('commands.log', JSON.stringify(error, null, 2))
                                    return interaction.reply({ content: 'failed to get osu! top plays', allowedMentions: { repliedUser: false } })
                                }
                                let filtereddata = osutopdataPreSort
                                let filterinfo = ''
                                if (mapper != null) {
                                    //filter by mapper
                                    filtereddata = osutopdataPreSort.filter(array => array.beatmapset.creator.toLowerCase() == mapper.toLowerCase())
                                    filterinfo += `\nmapper: ${mapper}`
                                }
                                let calcmods = osucalc.OrderMods(mods + '')
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
                                let osutopdata = filtereddata
                                if (reverse != true) {
                                    if (sort == 'score') {
                                        osutopdata = filtereddata.sort((a, b) => b.score - a.score)
                                        filterinfo += `\nsorted by score`
                                    }
                                    if (sort == 'acc') {
                                        osutopdata = filtereddata.sort((a, b) => b.accuracy - a.accuracy)
                                        filterinfo += `\nsorted by highest accuracy`
                                    }
                                    if (sort == 'pp' || sort == null) {
                                        osutopdata = filtereddata.sort((a, b) => b.pp - a.pp)
                                        filterinfo += `\nsorted by highest pp`
                                    }
                                    if (sort == 'recent') {
                                        osutopdata = filtereddata.sort((a, b) => Math.abs(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - Math.abs(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
                                        filterinfo += `\nsorted by most recent`
                                    }
                                    if (sort == 'combo') {
                                        osutopdata = filtereddata.sort((a, b) => b.max_combo - a.max_combo)
                                        filterinfo += `\nsorted by highest combo`
                                    }
                                    if (sort == 'miss') {
                                        osutopdata = filtereddata.sort((a, b) => a.statistics.count_miss - b.statistics.count_miss)
                                        filterinfo += `\nsorted by least misses`
                                    }
                                } else {
                                    if (sort == 'score') {
                                        osutopdata = filtereddata.sort((a, b) => a.score - b.score)
                                        filterinfo += `\nsorted by lowest score`
                                    }
                                    if (sort == 'acc') {
                                        osutopdata = filtereddata.sort((a, b) => a.accuracy - b.accuracy)
                                        filterinfo += `\nsorted by lowest accuracy`
                                    }
                                    if (sort == 'pp' || sort == null) {
                                        osutopdata = filtereddata.sort((a, b) => a.pp - b.pp)
                                        filterinfo += `\nsorted by lowest pp`
                                    }
                                    if (sort == 'recent') {
                                        osutopdata = filtereddata.sort((a, b) => Math.abs(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - Math.abs(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
                                        filterinfo += `\nsorted by oldest`
                                    }
                                    if (sort == 'combo') {
                                        osutopdata = filtereddata.sort((a, b) => a.max_combo - b.max_combo)
                                        filterinfo += `\nsorted by lowest combo`
                                    }
                                    if (sort == 'miss') {
                                        osutopdata = filtereddata.sort((a, b) => b.statistics.count_miss - a.statistics.count_miss)
                                        filterinfo += `\nsorted by most misses`
                                    }
                                }
                                if (compact == true) {
                                    filterinfo += `\ncompact mode`
                                }
                                try {
                                    let usernamefortests = osutopdata[0].user.username

                                } catch (error) {
                                    return interaction.reply({ content: 'no plays found for the options given', allowedMentions: { repliedUser: false } })
                                }
                                let topEmbed = new Discord.EmbedBuilder()
                                    .setColor(0x462B71)
                                    .setTitle(`Top plays of ${osutopdata[0].user.username}`)
                                    .setThumbnail(`https://a.ppy.sh/${osutopdata[0].user.id}`)
                                    .setURL(`https://osu.ppy.sh/users/${osutopdata[0].user.id}`)
                                if (compact != true) {
                                    topEmbed.setDescription(`${filterinfo}\nPage: ${page + 1}/${Math.ceil(osutopdata.length / 5)}\nmode: ${gamemode}\n`)

                                    for (let i = 0; i < 5 && i < osutopdata.length; i++) {

                                        let scoreoffset = page * 5 + i

                                        let tstscore = osutopdata[scoreoffset]
                                        if (!tstscore) {
                                            break;
                                        }

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
                                        let grade: any;
                                        switch (ranking) {
                                            case 'F':
                                                grade = 'F'
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
                                        let topmods = osutopdata[scoreoffset].mods
                                        let ifmods: any;

                                        if (!topmods || topmods == '' || topmods == 'undefined' || topmods == null || topmods == undefined) {
                                            ifmods = ''
                                        } else {
                                            ifmods = '+' + topmods.toString().replaceAll(",", '')
                                        }
                                        let scorenum;
                                        if (reverse == true && sort == 'pp') {
                                            scorenum = osutopdata.length - scoreoffset
                                        } else {
                                            scorenum = scoreoffset + 1
                                        }

                                        topEmbed.addFields([{
                                            name: `#${scorenum}`,
                                            value: `
                                            [**${osutopdata[scoreoffset].beatmapset.title} [${osutopdata[scoreoffset].beatmap.version}]**](https://osu.ppy.sh/b/${osutopdata[scoreoffset].beatmap.id}) ${ifmods}
                                            **Score set on** ${maptimeset}
                                            **SCORE:** ${score} | x${combo} | ${Math.abs(osutopdata[scoreoffset].accuracy * 100).toFixed(2)}% | ${grade}
                                            \`${hitlist}\`
                                            ${(osutopdata[scoreoffset].pp).toFixed(2)}pp | ${(osutopdata[scoreoffset].weight.pp).toFixed(2)}pp (Weighted at **${(osutopdata[scoreoffset].weight.percentage).toFixed(2)}%**)
                                            `,
                                            inline: false
                                        }])

                                    }
                                } else {
                                    topEmbed.setDescription(`${filterinfo}\nPage: ${page + 1}/${Math.ceil(osutopdata.length / 9)}\nmode: ${gamemode}\n`)
                                    for (let i = 0; i < 9 && i < osutopdata.length; i++) {
                                        let scoreoffset = page * 9 + i
                                        let score = osutopdata[scoreoffset]
                                        if (!score) {
                                            break;
                                        }
                                        let ifmods;
                                        if (!score.mods || score.mods == '' || score.mods == 'undefined' || score.mods == null || score.mods == undefined) {
                                            ifmods = ''
                                        } else {
                                            ifmods = '+' + score.mods.join('').toString()
                                        }
                                        topEmbed.addFields([{
                                            name: `#${scoreoffset + 1}`,
                                            value: ` 
                                        [**${score.beatmapset.title} [${score.beatmap.version}]**](https://osu.ppy.sh/b/${score.beatmap.id}) ${ifmods} | ${Math.abs(score.accuracy * 100).toFixed(2)}% | ${(score.pp).toFixed(2)}pp
                                        `,
                                            inline: true
                                        }
                                        ])
                                    }
                                }
                                if (detailed == true) {
                                    let highestcombo = (osutopdata.sort((a, b) => b.max_combo - a.max_combo))[0].max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    let maxpp = ((osutopdata.sort((a, b) => b.pp - a.pp))[0].pp).toFixed(2)
                                    let minpp = ((osutopdata.sort((a, b) => a.pp - b.pp))[0].pp).toFixed(2)
                                    let avgpp;
                                    let totalpp = 0;
                                    for (let i2 = 0; i2 < osutopdata.length; i2++) {
                                        totalpp += osutopdata[i2].pp
                                    }
                                    avgpp = (totalpp / osutopdata.length).toFixed(2)
                                    let hittype: string;
                                    if (gamemode == 'osu') {
                                        hittype = `hit300/hit100/hit50/miss`
                                    }
                                    if (gamemode == 'taiko') {
                                        hittype = `Great(300)/Good(100)/miss`
                                    }
                                    if (gamemode == 'fruits' || gamemode == 'catch') {
                                        hittype = `Fruit(300)/Drops(100)/Droplets(50)/miss`
                                    }
                                    if (gamemode == 'mania') {
                                        hittype = `300+(geki)/300/200(katu)/100/50/miss`
                                    }
                                    topEmbed.addFields([{
                                        name: '-',
                                        value: `
                                    **Most common mapper:** ${osufunc.modemappers(osutopdata).beatmapset.creator}
                                    **Most common mods:** ${osufunc.modemods(osutopdata).mods.toString().replaceAll(',', '')}
                                    **Gamemode:** ${gamemode}
                                    **Hits:** ${hittype}
                                    **Highest combo:** ${highestcombo}
                                `,
                                        inline: true
                                    },
                                    {
                                        name: '-',
                                        value: `
                                    **Highest pp:** ${maxpp}
                                    **Lowest pp:** ${minpp}
                                    **Average pp:** ${avgpp}
                                    **Highest accuracy:** ${((osutopdata.sort((a, b) => b.accuracy - a.accuracy))[0].accuracy * 100).toFixed(2)}%
                                    **Lowest accuracy:** ${((osutopdata.sort((a, b) => a.accuracy - b.accuracy))[0].accuracy * 100).toFixed(2)}%
                                `, inline: true
                                    }])
                                } else {

                                }
                                if (interaction.type == Discord.InteractionType.ApplicationCommand) {
                                    interaction.reply({ content: '⠀', embeds: [topEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                                    fs.appendFileSync('commands.log', `\nsuccess - Interaction ID: ${interaction.id}\n\n`, 'utf-8')
                                    fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}\nsort: ${sort}\nmapperfilter: ${mapper}\nmode: ${gamemode}\nmods filter: ${mods}\npage: ${page}\ndetailed: ${detailed}`)
                                }
                                else if (interaction.type == Discord.InteractionType.MessageComponent) {
                                    message.edit({ content: '⠀', embeds: [topEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                                    fs.appendFileSync('commands.log', `\nsuccess - Interaction ID: ${interaction.id}\n\n`, 'utf-8')
                                }
                            })
                    } catch (error) {
                        interaction.reply({ content: 'user ' + user + ' not found', allowedMentions: { repliedUser: false } })
                        fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}\nsort: ${sort}\nmapperfilter: ${mapper}\nmode: ${gamemode}\nmods filter: ${mods}\npage: ${page}\ndetailed: ${detailed}`)

                    }
                })
        }
    }
}