import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../calc/osufunc');
import cmdchecks = require('../../calc/commandchecks');
import colours = require('../../configs/colours');
import osuApiTypes = require('../../configs/osuApiTypes');

module.exports = {
    name: 'scores',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;

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
            commanduser = message.author;
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
            commanduser = interaction.member.user;
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
            user = interaction.options.getString('username');
            id = interaction.options.getNumber('id');
            sort = interaction.options.getString('sort');
            reverse = interaction.options.getBoolean('reverse');
            compact = interaction.options.getBoolean('compact');
            searchid = interaction.member.user.id;
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
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
            page = 0;
            user = message.embeds[0].author.name
            id = message.embeds[0].url.split('osu.ppy.sh/')[1].split('/')[1]
            const sorting = message.embeds[0].description.split('Sorted by:')[1].split('\n')[0].toLowerCase()
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
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
Options:
    username: ${user}
    id: ${id}
    sort: ${sort}
    reverse: ${reverse}
    compact: ${compact}
----------------------------------------------------
`, 'utf-8')
        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-scores-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-scores-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-scores-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-scores-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    /* .setLabel('End') */,
            );

        if (user == null || message.mentions.users.size > 0) {
            const findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname == null) {
                return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
                    .catch()
                    ;

            } else {
                user = findname.get('osuname')
                if (user.length < 1) {
                    return obj.reply({ content: 'Error - no username found', allowedMentions: { repliedUser: false } })
                        .catch()
                        ;

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
        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`)
        fs.writeFileSync(`debugosu/command-scores=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2));

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
        } catch (error) {
        }
        if (!osudata.id) {
            if (button == null) {
                return obj.reply({
                    content: 'Error - no user found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch()
                    ;

            } else {
                return message.edit({
                    content: 'Error - no user found',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch()
                    ;

            }
        }
        if (page == null || page < 1) {
            page = 0
        } else {
            page = page - 1
        }
        const scoredataPresort: osuApiTypes.ScoreArrA = await osufunc.apiget('user_get_scores_map', `${id}`, `${osudata.id}`)
        fs.writeFileSync(`debugosu/command-scores=scoredataPresort=${obj.guildId}.json`, JSON.stringify(scoredataPresort, null, 2));
        try {
            if (scoredataPresort.authentication) {
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
        } catch (error) {
        }


        let scoredata: osuApiTypes.Score[] = scoredataPresort.scores
        let sortdata = ''
        if (scoredataPresort.scores.length < 1) {
            return obj.reply({
                content: 'Error - no scores found',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();

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
        const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${id}`)
        fs.writeFileSync(`debugosu/command-scores=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2));
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
        } catch (error) {
        }

        const title = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ?
            mapdata.beatmapset.title :
            `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})`
        const artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ?
            mapdata.beatmapset.artist :
            `${mapdata.beatmapset.artist} (${mapdata.beatmapset.artist_unicode})`

        const scoresEmbed = new Discord.EmbedBuilder()
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
                const curscore = scoredata[i + page * 5]
                if (!curscore) {
                    break;
                }

                const scorestats = curscore.statistics
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
                }
                if (compact == true) {
                    scoretxt += `
                    **[Score #${i + 1}](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id})**
                    ${(curscore.accuracy * 100).toFixed(2)}% | ${curscore.pp}pp | ${curscore.mods.join('').length > 1 ? curscore.mods.join('') : 'NM'} `


                } else {
                    const ppcalcing = await osufunc.scorecalc(
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
                        curscore.max_combo,
                        curscore.score,
                        0,
                        null, false
                    )
                    let pptxt;
                    if (curscore.accuracy != 1) {
                        if (curscore.pp == null || isNaN(curscore.pp)) {
                            pptxt = `${await ppcalcing[0].pp.toFixed(2)}pp`
                        } else {
                            pptxt = `${curscore.pp.toFixed(2)}pp`
                        }
                        if (curscore.perfect == false) {
                            pptxt += ` (${ppcalcing[1].pp.toFixed(2)}pp if FC)`
                        }
                        pptxt += ` (${ppcalcing[2].pp.toFixed(2)}pp if SS)`
                    } else {
                        if (curscore.pp == null || isNaN(curscore.pp)) {
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
                    \`${hitlist}\` | ${curscore.max_combo}x/**${mapdata.max_combo}x**
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
                    .catch()
                    ;

            } else {
                message.edit({
                    content: '⠀',
                    embeds: [scoresEmbed],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true,
                    components: [buttons]
                })
                    .catch()
                    ;

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