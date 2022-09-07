import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'scores',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user;
        let searchid;
        let mapid;
        let sort = 'recent';
        let reverse = false;
        let page = 1;

        let isFirstPage = false;
        let isLastPage = false;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                if (!args[0]) {
                    user = null
                }
                user = args.join(' ')
                if (!args[0]) {
                    user = null
                }
                mapid = null;
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                searchid = obj.member.user.id;
                user = obj.options.getString('username');
                mapid = obj.options.getNumber('id');
                sort = obj.options.getString('sort');
                reverse = obj.options.getBoolean('reverse');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );
        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔁'),
            )

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'scores',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [
                    {
                        name: 'User',
                        value: user
                    },
                    {
                        name: 'Search ID',
                        value: searchid
                    },
                    {
                        name: 'Map ID',
                        value: mapid
                    },
                    {
                        name: 'Page',
                        value: page
                    },
                    {
                        name: 'Sort',
                        value: sort
                    },
                    {
                        name: 'Reverse',
                        value: reverse
                    },
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (page < 2) {
            isFirstPage = true;
        }
        if (page < 2) {
            page = 1;
        }
        page--

        if (user == null) {
            let cuser = await osufunc.searchUser(searchid, userdata, true);
            user = cuser.username;
            if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                return;
            }
        }
        if (!mapid || isNaN(mapid)) {
            mapid = osufunc.getPreviousId('map', obj.guildId);
        }


        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`)
        fs.writeFileSync(`debug/command-scores=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2));
        if (osudata?.error) {
            obj.reply({
                content: `${osudata?.error ? osudata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
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
                return obj.edit({
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
        const scoredataPresort: osuApiTypes.ScoreArrA = await osufunc.apiget('user_get_scores_map', `${mapid}`, `${osudata.id}`)
        fs.writeFileSync(`debug/command-scores=scoredataPresort=${obj.guildId}.json`, JSON.stringify(scoredataPresort, null, 2));
        if (scoredataPresort?.error) {
            obj.reply({
                content: `${scoredataPresort?.error ? scoredataPresort?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        let scoredata: osuApiTypes.Score[] = scoredataPresort.scores
        let sortdata = ''
        try {
            scoredata.length < 1
        } catch (error) {
            return obj.reply({
                content: 'Error - no scores found',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();
        }
        // if (scoredata.length < 1) {
        //     return obj.reply({
        //         content: 'Error - no scores found',
        //         allowedMentions: { repliedUser: false },
        //         failIfNotExists: true
        //     })
        //         .catch();

        // }
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
        fs.writeFileSync(`debug/command-scores=scoredata=${obj.guildId}.json`, JSON.stringify(scoredata, null, 2));

        const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${mapid}`)
        fs.writeFileSync(`debug/command-scores=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2));
        if (mapdata?.error) {
            obj.reply({
                content: `${mapdata?.error ? mapdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        const title = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title})`;
        const artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist_unicode} (${mapdata.beatmapset.artist})`;

        const scoresEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`${artist} - ${title} [${mapdata.version}]`)
            .setThumbnail(`${mapdata.beatmapset.covers['list@2x']}`)
            .setAuthor({ name: `${osudata.username}`, url: `https://osu.ppy.sh/u/${osudata.id}`, iconURL: `https://a.ppy.sh/${osudata.id}` })
            .setURL(`https://osu.ppy.sh/b/${mapid}`)
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
                fs.writeFileSync(`debug/command-scores=pp_calc=${obj.guildId}.json`, JSON.stringify(ppcalcing, null, 2))
            }
        }
        scoresEmbed.setDescription(scoretxt)

        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);
        osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`);

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [scoresEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: '',
                    embeds: [scoresEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }



        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}