import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../calc/osufunc');
import cmdchecks = require('../../calc/commandchecks');
import colours = require('../../configs/colours');

module.exports = {
    name: 'scores',
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
        let id = null;
        let sort = 'recent';
        let reverse = false;
        let compact = false;
        let searchid;
        let page = 1;

        let prevmap;

        if (fs.existsSync(`./debugosu/prevmap${obj.guildId}.json`)) {
            try {
                prevmap = JSON.parse(fs.readFileSync(`./debugosu/prevmap${obj.guildId}.json`, 'utf8'));
            } catch {
                console.log(`no prevmap.json id found for server ${obj.guildId}\nCreating default file...`)
                fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                prevmap = { id: 32345 }
            }
        } else {
            console.log(`no prevmap.json file for server ${obj.guildId}\nCreating default file...`)
            fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
            prevmap = { id: 32345 }
        }

        if (message != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - scores (message)
${currentDate} | ${currentDateISO}
recieved scores command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-scores-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-scores-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-scores')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-scores-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-scores-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            user = args.join(' ')
            if (!args[0]) {
                user = null
            }
            searchid = message.author.id;
            if (message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            id = null
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - scores (interaction)
${currentDate} | ${currentDateISO}
recieved scores command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-scores-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-scores-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-scores')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-scores-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-scores-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            user = interaction.options.getString('username');
            id = interaction.options.getNumber('id');
            sort = interaction.options.getString('sort');
            reverse = interaction.options.getBoolean('reverse');
            compact = interaction.options.getBoolean('compact');
            searchid = interaction.member.user.id;
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - scores (button)
${currentDate} | ${currentDateISO}
recieved scores command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-scores-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-scores-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-scores')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-scores-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-scores-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                /* .setLabel('End') */,
                );
            page = 0;
            user = message.embeds[0].author.name
            id = message.embeds[0].url.split('osu.ppy.sh/')[1].split('/')[1]
            let sorting = message.embeds[0].description.split('Sorted by:')[1].split('\n')[0].toLowerCase()
            switch (true) {
                default: case sorting.includes('recent'): case sorting.includes('old'):
                    sort = 'recent'
                    break;
                case sorting.includes('pp'):
                    sort = 'pp'
                    break;
                case sorting.includes('acc'):
                    sort = 'acc'
                    break;
                case sorting.includes('combo'):
                    sort = 'combo'
                    break;
                case sorting.includes('score'):
                    sort = 'score'
                    break;
                case sorting.includes('miss'):
                    sort = 'miss'
                    break;
                case sorting.includes('rank'):
                    sort = 'rank'
                    break;
            }
            if (sorting.includes('lowest') || sorting.includes('old') || sorting.includes('most miss')) {
                reverse = true
            } else {
                reverse = false
            }
            if (message.embeds[0].description.toLowerCase().includes('compact mode')) {
                compact = true
            }
            page = 0
            if (button == 'BigLeftArrow') {
                page = 0
            } else if (button == 'LeftArrow') {
                page = parseInt((message.embeds[0].footer.text).split('/')[0].split('Page ')[1]) - 1
            } else if (button == 'RightArrow') {
                page = parseInt((message.embeds[0].footer.text).split('/')[0].split('Page ')[1]) + 1
            } else if (button == 'BigRightArrow') {
                page = parseInt((message.embeds[0].footer.text).split('/')[1].split('\n')[0])
            }
        }
        if (user == null || message.mentions.users.size > 0) {
            let findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname == null) {
                return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
                    .catch(error => { });

            } else {
                user = findname.get('osuname')
                if (user.length < 1) {
                    return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
                        .catch(error => { });

                }
            }
        }
        if (id == null) {
            if (fs.existsSync(`./debugosu/prevmap${obj.guildId}.json`)) {
                try {
                    prevmap = JSON.parse(fs.readFileSync(`./debugosu/prevmap${obj.guildId}.json`, 'utf8'));
                } catch {
                    console.log(`no prevmap.json id found for server ${obj.guildId}\nCreating default file...`)
                    fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                    prevmap = { id: 32345 }
                }
            } else {
                console.log(`no prevmap.json file for server ${obj.guildId}\nCreating default file...`)
                fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                prevmap = { id: 32345 }
            }
            id = prevmap.id
        }
        if (sort == null) {
            sort = 'recent'
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    user: ${user}
    id: ${id}
    sort: ${sort}
    reverse: ${reverse}
    compact: ${compact}
----------------------------------------------------
`, 'utf-8')
        let userurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(user)}/osu`
        const osudata = await fetch(userurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
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
            })
        fs.writeFileSync(`debugosu/command-scores=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2));

        osudata.id
        try {
            if (osudata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                if (button == null) {
                    obj.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })

                } else {
                    message.edit({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })

                } return;
            }
        } catch (error) {

        }
        if (!osudata.id) {
            if (button == null) {
                return obj.reply({
                    content: 'Error - no user found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch(error => { });

            } else {
                return message.edit({
                    content: 'Error - no user found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch(error => { });

            }
        }
        if (page == null || page < 1) {
            page = 0
        } else {
            page = page - 1
        }
        let scoreurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(id)}/scores/users/${cmdchecks.toHexadecimal(osudata.id)}/all`
        const scoredataPresort = await fetch(scoreurl, {
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
        fs.writeFileSync(`debugosu/command-scores=scoredataPresort=${obj.guildId}.json`, JSON.stringify(scoredataPresort, null, 2));

        let scoredata = scoredataPresort.scores
        let sortdata = ''
        if (scoredataPresort.scores.length < 1) {
            return obj.reply({
                content: 'Error - no scores found',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (reverse != true) {
            switch (sort) {
                case 'score':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            b.score - a.score
                    )
                    sortdata += 'Sorted by: score'
                    break;
                case 'acc':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            b.accuracy - a.accuracy
                    )
                    sortdata += 'Sorted by: accuracy'
                    break;
                case 'pp':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            b.pp - a.pp
                    )
                    sortdata += 'Sorted by: pp'
                    break;
                case 'recent': default:
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )
                    sortdata += 'Sorted by: most recent'
                    break;
                case 'combo':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            b.max_combo - a.max_combo
                    )
                    sortdata += 'Sorted by: max combo'
                    break;
                case 'miss':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            a.statistics.count_miss - b.statistics.count_miss
                    )
                    sortdata += 'Sorted by: least misses'
                    break;
                case 'rank':
                    scoredata = scoredataPresort.scores.sort((a, b) => a.rank.localeCompare(b.rank))
                    sortdata += `\nsorted by rank`
                    break;
            }
        } else {
            switch (sort) {
                case 'score':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            a.score - b.score
                    )
                    sortdata += 'Sorted by: lowest score'
                    break;
                case 'acc':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            a.accuracy - b.accuracy
                    )
                    sortdata += 'Sorted by: lowest accuracy'
                    break;
                case 'pp':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            a.pp - b.pp
                    )
                    sortdata += 'Sorted by: lowest pp'
                    break;
                case 'recent': default:
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    )
                    sortdata += 'Sorted by: oldest'
                    break;
                case 'combo':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            a.max_combo - b.max_combo
                    )
                    sortdata += 'Sorted by: min combo'
                    break;
                case 'miss':
                    scoredata = scoredataPresort.scores.sort(
                        (a, b) =>
                            b.statistics.count_miss - a.statistics.count_miss
                    )
                    sortdata += 'Sorted by: most misses'
                    break;
                case 'rank':
                    scoredata = scoredataPresort.scores.sort((a, b) => b.rank.localeCompare(a.rank))
                    sortdata += `\nsorted by rank`
                    break;
            }
        }
        fs.writeFileSync(`debugosu/command-scores=scoredata=${obj.guildId}.json`, JSON.stringify(scoredata, null, 2));


        if (compact == true) {
            sortdata += `\nCompact mode`
        }
        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(id)}`
        const mapdata = await fetch(mapurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
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
            })
        fs.writeFileSync(`debugosu/command-scores=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2));

        let title = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ?
            mapdata.beatmapset.title :
            `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})`
        let artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ?
            mapdata.beatmapset.artist :
            `${mapdata.beatmapset.artist} (${mapdata.beatmapset.artist_unicode})`

        let scoresEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.hex)
            .setTitle(`${artist} - ${title} [${mapdata.version}]`)
            .setThumbnail(`${mapdata.beatmapset.covers['list@2x']}`)
            .setAuthor({ name: `${osudata.username}`, url: `https://osu.ppy.sh/u/${osudata.id}`, iconURL: `https://a.ppy.sh/${osudata.id}` })
            .setURL(`https://osu.ppy.sh/b/${id}`)
        let scoretxt = ''
        if (!scoredata || scoredata.length < 1) {
            scoretxt = 'Error - no scores found'
        } else {
            scoretxt += sortdata + '\n\n'
            scoresEmbed.setFooter({ text: `Page ${page + 1}/${Math.ceil(scoredata.length / 5)}` })
            for (let i = 0; i < scoredata.length && i < 5; i++) {
                let curscore = scoredata[i + page * 5]
                if (!curscore) {
                    break;
                }

                let scorestats = curscore.statistics
                let hitlist = ''
                switch (curscore.mode) {
                    case 'osu': default:
                        hitlist = `${scorestats.count_300}/${scorestats.count_100}/${scorestats.count_50}/${scorestats.count_miss}`
                        break;
                    case 'taiko':
                        hitlist = `${scorestats.count_300}/${scorestats.count_50}/${scorestats.count_miss}`
                        break;
                    case 'fruits':
                        hitlist = `${scorestats.count_300}/${scorestats.count_100}/${scorestats.count_50}/${scorestats.count_miss}`
                        break;
                    case 'mania':
                        hitlist = `${scorestats.count_geki}/${scorestats.count_300}/${scorestats.count_katu}/${scorestats.count_100}/${scorestats.count_50}/${scorestats.count_miss}`
                        break;
                }
                let grade;
                switch (curscore.rank) {
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
                if (compact == true) {
                    scoretxt += `
                    **[Score #${i + 1}](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id})**
                    ${(curscore.accuracy * 100).toFixed(2)}% | ${curscore.pp}pp | ${curscore.mods.join('').length > 1 ? curscore.mods.join('') : 'NM'} `


                } else {
                    let ppcalcing = await osufunc.scorecalc(
                        curscore.mods.join('').length > 1 ? curscore.mods.join('').toUpperCase() : 'NM',
                        curscore.mode,
                        mapdata.id,
                        scorestats.count_geki,
                        scorestats.count_300,
                        scorestats.count_katu,
                        scorestats.count_100,
                        scorestats.count_50,
                        scorestats.count_miss,
                        curscore.accuracy,
                        curscore.max_comb,
                        curscore.score,
                        0,
                        null, false
                    )
                    let pptxt;
                    if (curscore.accuracy.toFixed(2) != 100.00) {
                        if (curscore.pp == null || curscore.pp == NaN) {
                            pptxt = `${await ppcalcing[0].pp.toFixed(2)}pp`
                        } else {
                            pptxt = `${curscore.pp.toFixed(2)}pp`
                        }
                        if (curscore.perfect == false) {
                            pptxt += ` (${ppcalcing[1].pp.toFixed(2)}pp if FC)`
                        }
                        pptxt += ` (${ppcalcing[2].pp.toFixed(2)}pp if SS)`
                    } else {
                        if (curscore.pp == null || curscore.pp == NaN) {
                            pptxt =
                                `${await ppcalcing[0].pp.toFixed(2)}pp`
                        } else {
                            pptxt =
                                `${curscore.pp.toFixed(2)}pp`
                        }
                    }
                    scoretxt +=
                        `**[Score #${i + 1 + page * 5}](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}) ${curscore.mods.join('').length > 1 ? '+' + curscore.mods.join('') : ''}** <t:${new Date(curscore.created_at).getTime() / 1000}:R>
                    ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
                    \`${hitlist}\` | ${curscore.max_combo}x/**${mapdata.max_combo}**
                    ${pptxt}
                    `
                    fs.writeFileSync(`debugosu/command-scores=pp_calc=${obj.guildId}.json`, JSON.stringify(ppcalcing, null, 2))
                }
            }
            scoresEmbed.setDescription(scoretxt)


            if (!button) {
                obj.reply({
                    embeds: [scoresEmbed],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true,
                    components: [buttons]
                })
                    .catch(error => { });

            } else {
                message.edit({
                    content: '⠀',
                    embeds: [scoresEmbed],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true,
                    components: [buttons]
                })
                    .catch(error => { });

            }
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