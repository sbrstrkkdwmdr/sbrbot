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
    name: 'osutop',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user;
        let mode;
        let detailed;
        let sort;
        let reverse;
        let page;
        let mapper;
        let mods;
        let searchid

        let isFirstPage = false;
        let isLastPage = false;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                if (args[0] && searchid == obj.author.id) {
                    args.join(' ')
                }
                user = args.join(' ')
                mode = null;
                sort = 'pp';
                page = 1;

                mapper = null;
                mods = null;
                detailed = false;
                if (!args[0]) {
                    user = null
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                user = obj.options.getString('user')
                mode = obj.options.getString('mode')
                mapper = obj.options.getString('mapper')
                mods = obj.options.getString('mods')
                sort = obj.options.getString('sort')
                page = obj.options.getInteger('page')
                detailed = obj.options.getBoolean('detailed')
                reverse = obj.options.getBoolean('reverse')
                searchid = obj.member.user.id
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;

                user = obj.message.embeds[0].title.split('Top plays of ')[1]

                if (obj.message.embeds[0].description) {
                    if (obj.message.embeds[0].description.includes('mapper')) {
                        mapper = obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                    }
                    if (obj.message.embeds[0].description.includes('mods')) {
                        mods = obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
                    }
                    const sort1 = obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
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
                        case sort1.includes('rank'):
                            sort = 'rank'
                            break;

                    }


                    const reverse1 = obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0]
                    if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses'))) {
                        reverse = true
                    } else {
                        reverse = false
                    }

                    if (obj.message.embeds[0].fields.length == 7 || obj.message.embeds[0].fields.length == 11) {
                        detailed = true
                    } else {
                        detailed = false
                    }
                    page = 0
                    switch (button) {
                        case 'BigLeftArrow':
                            page = 1
                            break;
                        case 'LeftArrow':
                            page = parseInt((obj.message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
                            break;
                        case 'RightArrow':
                            page = parseInt((obj.message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
                            break;
                        case 'BigRightArrow':
                            page = parseInt((obj.message.embeds[0].description).split('/')[1].split('\n')[0])
                            break;
                        case 'Refresh':
                            page = parseInt((obj.message.embeds[0].description).split('/')[0].split(': ')[1])
                            break;
                    }

                    mode = obj.message.embeds[0].description.split('mode: ')[1].split('\n')[0]
                }
                if (button == 'DetailEnable') {
                    detailed = true;
                }
                if (button == 'DetailDisable') {
                    detailed = false;
                }
                if (page < 2) {
                    isFirstPage = true;
                }
                if (page == parseInt((obj.message.embeds[0].description).split('/')[1].split('\n')[0])) {
                    isLastPage = true;
                }
            }
                break;
        }
        if (overrides != null) {
            if (overrides.page != null) {
                page = overrides.page
            }
            if (overrides.sort != null) {
                sort = overrides.sort
            }
            if (overrides.reverse != null) {
                reverse = overrides.reverse === true;
            }
        }

        //==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'osutop',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'User',
                    value: user
                },
                {
                    name: 'Search ID',
                    value: searchid
                },
                {
                    name: 'Mode',
                    value: mode
                },
                {
                    name: 'Detailed',
                    value: detailed
                },
                {
                    name: 'Sort',
                    value: sort
                },
                {
                    name: 'Reverse',
                    value: reverse
                },
                {
                    name: 'Page',
                    value: page
                },
                {
                    name: 'Mapper',
                    value: mapper
                },
                {
                    name: 'Mods',
                    value: mods
                }

                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (page < 2 || typeof page != 'number') {
            isFirstPage = true;
            page = 1;
        }
        page--

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔁'),
                new Discord.ButtonBuilder()
                    .setCustomId(`Sort-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔀'),
            )

        if (user == null) {
            let cuser = await osufunc.searchUser(searchid, userdata, true);
            user = cuser.username;
            if (mode == null) {
                mode = cuser.gamemode;
            }
            if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                return;
            }
        }
        if (mode == null) {
            mode = 'osu'
        }

        if (detailed == true) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailDisable-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('ℹ')
                /* .setLabel('End') */
            )
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailEnable-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('ℹ')
                /* .setLabel('End') */
            )
        }

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀')
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                    .setDisabled(isLastPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                    .setDisabled(isLastPage),
            );

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`)
        fs.writeFileSync(`debug/command-otop=osudata=${obj.guildId}`, JSON.stringify(osudata, null, 2))
        if (osudata?.error) {
            obj.reply({
                content: `${osudata?.error ? osudata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        try {
            osufunc.updateUserStats(osudata, mode, userdata)
        } catch (error) {
            console.log(error)
        }

        const osutopdataPreSort: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
        fs.writeFileSync(`debug/command-otop=osutopdataPreSort=${obj.guildId}`, JSON.stringify(osutopdataPreSort, null, 2))
        if (osutopdataPreSort?.error) {
            obj.reply({
                content: `${osutopdataPreSort?.error ? osutopdataPreSort?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        try {
            osutopdataPreSort[0].user.username
        } catch (error) {
            console.log(error)
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
            ----------------------------------------------------
            cmd ID: ${absoluteID}
            Error - no scores found
            ----------------------------------------------------`)
            return obj.reply({ content: 'failed to get osu! top plays', allowedMentions: { repliedUser: false } })
                .catch();

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
            switch (sort) {
                case 'score':
                    osutopdata = filtereddata.sort((a, b) => b.score - a.score)
                    filterinfo += `\nsorted by score`
                    break;
                case 'acc':
                    osutopdata = filtereddata.sort((a, b) => b.accuracy - a.accuracy)
                    filterinfo += `\nsorted by highest accuracy`
                    break;
                case 'pp': default:
                    osutopdata = filtereddata.sort((a, b) => b.pp - a.pp)
                    filterinfo += `\nsorted by highest pp`
                    sort = 'pp'
                    break;
                case 'recent':
                    osutopdata = filtereddata.sort((a, b) => parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
                    filterinfo += `\nsorted by most recent`
                    break;
                case 'combo':
                    osutopdata = filtereddata.sort((a, b) => b.max_combo - a.max_combo)
                    filterinfo += `\nsorted by highest combo`
                    break;
                case 'miss':
                    osutopdata = filtereddata.sort((a, b) => a.statistics.count_miss - b.statistics.count_miss)
                    filterinfo += `\nsorted by least misses`
                    break;
                case 'rank':
                    osutopdata = filtereddata.sort((a, b) => a.rank.localeCompare(b.rank))
                    filterinfo += `\nsorted by rank`
                    break;
            }
        } else {
            switch (sort) {
                case 'score':
                    osutopdata = filtereddata.sort((a, b) => a.score - b.score)
                    filterinfo += `\nsorted by lowest score`
                    break;
                case 'acc':
                    osutopdata = filtereddata.sort((a, b) => a.accuracy - b.accuracy)
                    filterinfo += `\nsorted by lowest accuracy`
                    break;
                case 'pp': default:
                    osutopdata = filtereddata.sort((a, b) => a.pp - b.pp)
                    filterinfo += `\nsorted by lowest pp`
                    sort = 'pp'
                    break;
                case 'recent':
                    osutopdata = filtereddata.sort((a, b) => parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
                    filterinfo += `\nsorted by oldest`
                    break;
                case 'combo':
                    osutopdata = filtereddata.sort((a, b) => a.max_combo - b.max_combo)
                    filterinfo += `\nsorted by lowest combo`
                    break;
                case 'miss':
                    osutopdata = filtereddata.sort((a, b) => b.statistics.count_miss - a.statistics.count_miss)
                    filterinfo += `\nsorted by most misses`
                    break;
                case 'rank':
                    osutopdata = filtereddata.sort((a, b) => b.rank.localeCompare(a.rank))
                    filterinfo += `\nsorted by lowest rank`
                    break;
            }
        }
        fs.writeFileSync(`debug/command-otop=osutopdata=${obj.guildId}`, JSON.stringify(osutopdata, null, 2))

        try {
            osutopdata[0].user.username
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
                .catch();

        }

        if (page >= Math.ceil(osutopdata.length / 5)) {
            page = Math.ceil(osutopdata.length / 5) - 1
        }

        const topEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Top plays of ${osutopdata[0].user.username}`)
            .setThumbnail(`https://a.ppy.sh/${osutopdata[0].user.id}`)
            .setURL(`https://osu.ppy.sh/users/${osutopdata[0].user.id}`)
        topEmbed.setDescription(`${filterinfo}\nPage: ${page + 1}/${Math.ceil(osutopdata.length / 5)}\nmode: ${mode}\n`)
        for (let i = 0; i < 5 && i < osutopdata.length; i++) {

            const scoreoffset = page * 5 + i

            const curscore = osutopdata[scoreoffset]
            if (!curscore) {
                break;
            }
            const score = curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const hitgeki = curscore.statistics.count_geki.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const hit300 = curscore.statistics.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const hitkatu = curscore.statistics.count_katu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const hit100 = curscore.statistics.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const hit50 = curscore.statistics.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const miss = curscore.statistics.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const combo = curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            const ranking = curscore.rank.toUpperCase()
            let grade: string;
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
            }


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
            const topmods = curscore.mods
            let ifmods: string;

            if (!topmods || topmods.join('') == '' || topmods == null || topmods == undefined) {
                ifmods = ''
            } else {
                ifmods = '+' + topmods.toString().replaceAll(",", '')
            }
            let scorenum;
            if (reverse == true) {
                scorenum = osutopdata.length - scoreoffset
            } else {
                scorenum = scoreoffset + 1
            }

            let ifnopp = '';
            let trueppindex: number;
            const indexdata = osutopdata.sort((a, b) => b.pp - a.pp)

            if (sort != 'pp') {
                trueppindex = await indexdata.indexOf(curscore)
                ifnopp = await `(#${trueppindex + 1})`
                if (reverse == false || reverse == null) {
                    switch (sort) {
                        case 'score':
                            osutopdata = filtereddata.sort((a, b) => b.score - a.score)
                            filterinfo += `\nsorted by score`
                            break;
                        case 'acc':
                            osutopdata = filtereddata.sort((a, b) => b.accuracy - a.accuracy)
                            filterinfo += `\nsorted by highest accuracy`
                            break;
                        case 'pp': default:
                            osutopdata = filtereddata.sort((a, b) => b.pp - a.pp)
                            filterinfo += `\nsorted by highest pp`
                            break;
                        case 'recent':
                            osutopdata = filtereddata.sort((a, b) => parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
                            filterinfo += `\nsorted by most recent`
                            break;
                        case 'combo':
                            osutopdata = filtereddata.sort((a, b) => b.max_combo - a.max_combo)
                            filterinfo += `\nsorted by highest combo`
                            break;
                        case 'miss':
                            osutopdata = filtereddata.sort((a, b) => a.statistics.count_miss - b.statistics.count_miss)
                            filterinfo += `\nsorted by least misses`
                            break;
                        case 'rank':
                            osutopdata = filtereddata.sort((a, b) => a.rank.localeCompare(b.rank))
                            filterinfo += `\nsorted by rank`
                            break;
                    }
                } else {
                    switch (sort) {
                        case 'score':
                            osutopdata = filtereddata.sort((a, b) => a.score - b.score)
                            filterinfo += `\nsorted by lowest score`
                            break;
                        case 'acc':
                            osutopdata = filtereddata.sort((a, b) => a.accuracy - b.accuracy)
                            filterinfo += `\nsorted by lowest accuracy`
                            break;
                        case 'pp': default:
                            osutopdata = filtereddata.sort((a, b) => a.pp - b.pp)
                            filterinfo += `\nsorted by lowest pp`
                            break;
                        case 'recent':
                            osutopdata = filtereddata.sort((a, b) => parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
                            filterinfo += `\nsorted by oldest`
                            break;
                        case 'combo':
                            osutopdata = filtereddata.sort((a, b) => a.max_combo - b.max_combo)
                            filterinfo += `\nsorted by lowest combo`
                            break;
                        case 'miss':
                            osutopdata = filtereddata.sort((a, b) => b.statistics.count_miss - a.statistics.count_miss)
                            filterinfo += `\nsorted by most misses`
                            break;
                        case 'rank':
                            osutopdata = filtereddata.sort((a, b) => b.rank.localeCompare(a.rank))
                            filterinfo += `\nsorted by lowest rank`
                            break;
                    }
                } //added this cos it keeps re-sorting back to pp
            }
            topEmbed.addFields([{
                name: `#${scorenum} ${ifnopp}`,
                value: `
                    [**${curscore.beatmapset.title} [${curscore.beatmap.version}]**](https://osu.ppy.sh/b/${curscore.beatmap.id}) ${ifmods}
                    **Score set ** <t:${new Date(curscore.created_at).getTime() / 1000}:R>
                    **SCORE:** ${score} | x${combo} | ${Math.abs(curscore.accuracy * 100).toFixed(2)}% | ${grade}
                    \`${hitlist}\` | ${(curscore.pp).toFixed(2)}pp 
                    ${(curscore.weight.pp).toFixed(2)}pp (Weighted at **${(curscore.weight.percentage).toFixed(2)}%**)
                    `,
                inline: false
            }])

        }

        if (detailed == true) {
            const highestcombo = (osutopdata.sort((a, b) => b.max_combo - a.max_combo))[0].max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const maxpp = ((osutopdata.sort((a, b) => b.pp - a.pp))[0].pp).toFixed(2)
            const minpp = ((osutopdata.sort((a, b) => a.pp - b.pp))[0].pp).toFixed(2)
            let totalpp = 0;
            for (let i2 = 0; i2 < osutopdata.length; i2++) {
                totalpp += osutopdata[i2].pp
            }
            const avgpp = (totalpp / osutopdata.length).toFixed(2)
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
        }

        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);

        if (page >= (osutopdata.length / 5) - 1) {
            //@ts-ignore
            pgbuttons.components[3].setDisabled(true)
            //@ts-ignore
            pgbuttons.components[4].setDisabled(true)
        }
        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [topEmbed],
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
                    embeds: [topEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: [topEmbed],
                    components: [pgbuttons, buttons],
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