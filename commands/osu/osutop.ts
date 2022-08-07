import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../configs/osufunc');
import cmdchecks = require('../../configs/commandchecks');
module.exports = {
    name: 'osutop',
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
        let mode = null;
        let sort = 'pp';
        let page = 1;
        let mapper = null;
        let mods = '';
        let detailed = false;
        let searchid = null;
        let reverse = false;
        let compact = false;

        if (message != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - osutop (message)
${currentDate} | ${currentDateISO}
recieved osutop command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
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
            user = args.join(' ')
            searchid = message.author.id;
            mode = null;
            sort = 'pp';
            page = 1;
            mapper = null;
            mods = null;
            detailed = false;
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
COMMAND EVENT - osutop (interaction)
${currentDate} | ${currentDateISO}
recieved osutop command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
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
            user = interaction.options.getString('user')
            mode = interaction.options.getString('mode')
            mapper = interaction.options.getString('mapper')
            mods = interaction.options.getString('mods')
            sort = interaction.options.getString('sort')
            page = interaction.options.getInteger('page')
            detailed = interaction.options.getBoolean('detailed')
            reverse = interaction.options.getBoolean('reverse')
            compact = interaction.options.getBoolean('compact')
            searchid = interaction.member.user.id
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - osutop (button)
${currentDate} | ${currentDateISO}
recieved osutop command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
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
                mode = message.embeds[0].description.split('mode: ')[1].split('\n')[0]
            }
        }


        if (user == null) {
            let findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname != null) {
                user = findname.get('osuname');
            } else {
                return obj.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false } })
            }
        }
        if (mode == null) {
            let findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname != null) {
                mode = findname.get('mode');
            } else {
                mode = 'osu'
            }
        }
        if (!(mode == 'osu' || mode == 'taiko' || mode == 'fruits' || mode == 'mania')) {
            mode = 'osu'
        }
        if (page == null || page < 1) {
            page = 0
        } else {
            page = page - 1
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    user: ${user}
    mapper: ${mapper}
    mods: ${mods}
    sort: ${sort}
    reverse: ${reverse}
    detailed: ${detailed}
    compact: ${compact}
    page: ${page}
    mode: ${mode}

----------------------------------------------------
`, 'utf-8')
        let userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`;
        const osudata = await fetch(userurl, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)
            .catch(error => {
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
        fs.writeFileSync(`debugosu/command-otop=osudata=${obj.guildId}`, JSON.stringify(osudata, null, 2))

        try {
            if (osudata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                obj.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                return;
            }
        } catch (error) {

        }
        try {
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
        } catch (error) {

        }
        let usertopurl = `https://osu.ppy.sh/api/v2/users/${osudata.id}/scores/best?mode=${mode}&limit=100&offset=0`;
        const osutopdataPreSort = await fetch(usertopurl, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }
        ).then(res => res.json() as any)
            .catch(error => {
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
        fs.writeFileSync(`debugosu/command-otop=osutopdataPreSort=${obj.guildId}`, JSON.stringify(osutopdataPreSort, null, 2))

        try {
            let usernametesting = osutopdataPreSort[0].user.username
        } catch (error) {
            console.log(error)
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
            ----------------------------------------------------
            cmd ID: ${absoluteID}
            Error - no scores found
            ----------------------------------------------------`)
            return obj.reply({ content: 'failed to get osu! top plays', allowedMentions: { repliedUser: false } })
        }
        let filtereddata = osutopdataPreSort;
        let filterinfo = '';
        if (mapper != null) {
            filtereddata = osutopdataPreSort.filter(array => array.beatmapset.creator.toLowerCase() == mapper.toLowerCase())
            filterinfo += `\nmapper: ${mapper}`
        }
        let calcmods = osumodcalc.OrderMods(mods + '')
        if (calcmods.length < 1) {
            calcmods = 'NM'
            mods = null
        }
        if (mods != null && !mods.includes('any')) {
            filtereddata = osutopdataPreSort.filter(array => array.mods.toString().replaceAll(',', '') == calcmods)
            filterinfo += `\nmods: ${mods}`
        }
        if (mods != null && mods.includes('any')) {
            filtereddata = osutopdataPreSort.filter(array => array.mods.toString().replaceAll(',', '').includes(calcmods))
            filterinfo += `\nmods: ${mods}`
        }
        let osutopdata = filtereddata;
        if (reverse == false || reverse == null) {
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
        fs.writeFileSync(`debugosu/command-otop=osutopdata=${obj.guildId}`, JSON.stringify(osutopdata, null, 2))

        if (compact == true) {
            filterinfo += `\ncompact mode`
        }
        try {
            let usernamefortests = osutopdata[0].user.username

        } catch (error) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - no scores found (filtered)
params: ${sort} | ${reverse} | ${mods} | ${mapper}
${error}
----------------------------------------------------`)
            return obj.reply({ content: 'no plays found for the options given', allowedMentions: { repliedUser: false } })
        }
        let topEmbed = new Discord.EmbedBuilder()
            .setColor(0x462B71)
            .setTitle(`Top plays of ${osutopdata[0].user.username}`)
            .setThumbnail(`https://a.ppy.sh/${osutopdata[0].user.id}`)
            .setURL(`https://osu.ppy.sh/users/${osutopdata[0].user.id}`)
        if (compact != true) {
            topEmbed.setDescription(`${filterinfo}\nPage: ${page + 1}/${Math.ceil(osutopdata.length / 5)}\nmode: ${mode}\n`)
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
                if (mode == 'osu') {
                    hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                }
                if (mode == 'taiko') {
                    hitlist = `${hit300}/${hit100}/${miss}`
                }
                if (mode == 'fruits' || mode == 'catch') {
                    hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                }
                if (mode == 'mania') {
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
                    **Score set ** <t:${new Date(osutopdata[scoreoffset].created_at).getTime() / 1000}:R>
                    **SCORE:** ${score} | x${combo} | ${Math.abs(osutopdata[scoreoffset].accuracy * 100).toFixed(2)}% | ${grade}
                    \`${hitlist}\`
                    ${(osutopdata[scoreoffset].pp).toFixed(2)}pp | ${(osutopdata[scoreoffset].weight.pp).toFixed(2)}pp (Weighted at **${(osutopdata[scoreoffset].weight.percentage).toFixed(2)}%**)
                    `,
                    inline: false
                }])

            }
        } else {
            topEmbed.setDescription(`${filterinfo}\nPage: ${page + 1}/${Math.ceil(osutopdata.length / 9)}\nmode: ${mode}\n`)
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
            if (mode == 'osu') {
                hittype = `hit300/hit100/hit50/miss`
            }
            if (mode == 'taiko') {
                hittype = `Great(300)/Good(100)/miss`
            }
            if (mode == 'fruits' || mode == 'catch') {
                hittype = `Fruit(300)/Drops(100)/Droplets(50)/miss`
            }
            if (mode == 'mania') {
                hittype = `300+(geki)/300/200(katu)/100/50/miss`
            }
            topEmbed.addFields([{
                name: '-',
                value: `
            **Most common mapper:** ${osufunc.modemappers(osutopdata).beatmapset.creator}
            **Most common mods:** ${osufunc.modemods(osutopdata).mods.toString().replaceAll(',', '')}
            **Gamemode:** ${mode}
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
        if (button == null) {
            obj.reply({
                content: '⠀',
                embeds: [topEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons]
            })
        } else {
            message.edit({
                content: '⠀',
                embeds: [topEmbed],
                allowedMentions: { repliedUser: false },
                components: [buttons]
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