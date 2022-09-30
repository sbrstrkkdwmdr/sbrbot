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
import func = require('../../src/other');
import embedStuff = require('../../src/embed');
import def = require('../../src/consts/defaults');
import buttonsthing = require('../../src/consts/buttons')

module.exports = {
    name: 'recent',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user;
        let searchid;
        let page;
        let mode;
        let list;

        let isFirstPage = false;
        let isLastPage = false;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                user = args.join(' ');
                if (!args[0] || args[0].includes(searchid)) {
                    user = null
                }
                page = 0;
                mode = null;
                isFirstPage = true;

            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                searchid = obj.member.user.id;
                user = obj.options.getString('user');
                page = obj.options.getNumber('page');
                mode = obj.options.getString('mode');
                list = obj.options.getBoolean('list');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                if (!obj.message.embeds[0]) {
                    return;
                }
                commanduser = obj.member.user;
                user =
                    obj.message.embeds[0].title.includes('play for') ?
                        obj.message.embeds[0].title.split('most recent play for ')[1].split(' | ')[0] :
                        obj.message.embeds[0].title.split('plays for ')[1]

                const modething = obj.message.embeds[0].description.split(' | ')[1].split('\n')[0]
                switch (true) {
                    case modething.includes('osu'): {
                        mode = 'osu';
                    }
                        break;
                    case modething.includes('taiko'): {
                        mode = 'taiko';
                    }
                        break;
                    case modething.includes('fruits'): {
                        mode = 'fruits';
                    }
                        break;
                    case modething.includes('mania'): {
                        mode = 'mania';
                    }
                }
                if (obj.message.embeds[0].footer) {
                    mode = obj.message.embeds[0].footer.text.split('gamemode: ')[1]
                }

                page = 0
                if (button == 'BigLeftArrow') {
                    page = 1
                    isFirstPage = true
                }
                if (obj.message.embeds[0].title.includes('plays')) {
                    switch (button) {
                        case 'LeftArrow':
                            page = parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1
                            break;
                        case 'RightArrow':
                            page = parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1
                            break;
                        case 'BigRightArrow':
                            page = parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n'[0]))
                            break;
                        case 'Refresh':
                            page = parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0])
                            break;
                    }
                    list = true
                    if (isNaN((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) || ((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) == 'NaN') {
                        page = 1
                    }
                    if (page < 2) {
                        isFirstPage = true;
                    }
                    if (page == parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n'[0]))) {
                        isLastPage = true;
                    }
                } else {
                    switch (button) {
                        case 'LeftArrow':
                            page = parseInt((obj.message.embeds[0].title).split(' ')[0].split('#')[1]) - 1
                            break;
                        case 'RightArrow':
                            page = parseInt((obj.message.embeds[0].title).split(' ')[0].split('#')[1]) + 1
                            break;
                        case 'Refresh':
                            page = parseInt((obj.message.embeds[0].title).split(' ')[0].split('#')[1])
                            break;
                    }
                    if (page < 2) {
                        page == 1
                    }
                }
            }
                break;
        }
        if (overrides != null) {
            if (overrides.page != null) {
                page = overrides.page
            }
        }

        //==============================================================================================================================================================================================

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-recent-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.refresh),
            )
        log.logFile(
            'command',
            log.commandLog('recent', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
            log.optsLog(absoluteID, [
                {
                    name: 'User',
                    value: user
                },
                {
                    name: 'Search ID',
                    value: searchid
                },
                {
                    name: 'Page',
                    value: page
                },
                {
                    name: 'Mode',
                    value: mode
                },
                {
                    name: 'List',
                    value: list
                },
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (user == null) {
            const cuser = await osufunc.searchUser(searchid, userdata, true);
            user = cuser.username;
            if (mode == null) {
                mode = cuser.gamemode;
            }
            if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                if (commandType != 'button') {
                    obj.reply({
                        content: 'User not found',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
                return;
            }
        }
        if (mode == null) {
            mode = 'osu'
        }
        if (page < 2 || typeof page != 'number') {
            isFirstPage = true;
            page = 1;
        }
        page--
        let pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-recent-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.first)
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-recent-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.previous)
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-recent-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.next)
                    .setDisabled(isLastPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-recent-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.last)
                    .setDisabled(isLastPage),
            );
        let osudata: osuApiTypes.User;
        if (func.findFile(user, 'osudata') &&
            !('error' in func.findFile(user, 'osudata')) &&
            button != 'Refresh'
        ) {
            osudata = func.findFile(user, 'osudata')
        } else {
            osudata = await osufunc.apiget('user', `${await user}`, `${mode}`)
        }
        func.storeFile(osudata, osudata.id, 'osudata')
        func.storeFile(osudata, user, 'osudata')
        osufunc.debug(osudata, 'command', 'recent', obj.guildId, 'osuData');

        if (osudata?.error) {
            if (commandType != 'button' && commandType != 'link') {
                obj.reply({
                    content: `Error - could not fetch user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }

        if (!osudata.id) {
            if (commandType != 'button' && commandType != 'link') {
                obj.reply({
                    content: `Error - could not fetch user \`${user}\``,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
            }
            return;
        }

        if (commandType == 'interaction') {
            obj.reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch()
        }

        let rsdata: osuApiTypes.Score[] & osuApiTypes.Error;
        if (func.findFile(absoluteID, 'rsdata') &&
            commandType == 'button' &&
            !('error' in func.findFile(absoluteID, 'rsdata')) &&
            button != 'Refresh'
        ) {
            rsdata = func.findFile(absoluteID, 'rsdata')
        } else {
            rsdata = await osufunc.apiget('recent_alt', `${osudata.id}`, `mode=${mode}&offset=0`, 2, 0, true)
        }
        osufunc.debug(rsdata, 'command', 'recent', obj.guildId, 'rsData');
        func.storeFile(rsdata, absoluteID, 'rsdata')
        if (rsdata?.error) {
            if (commandType != 'button' && commandType != 'link') {
                if (commandType == 'interaction') {
                    setTimeout(() => {
                        obj.editReply({
                            content: `Error - could not fetch \`${user}\`\'s recent scores`,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }, 1000)
                } else {
                    obj.reply({
                        content: `Error - could not fetch \`${user}\`\'s recent scores`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }

            }
            return;
        }

        const rsEmbed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
            });
        if (list != true) {
            rsEmbed.setColor(colours.embedColour.score.dec)

            if (button == 'BigRightArrow') {
                page = rsdata.length - 1
            }

            const curscore = rsdata[0 + page]
            if (!curscore || curscore == undefined || curscore == null) {
                if (button == null) {
                    if (commandType == 'interaction') {
                        setTimeout(() => {
                            obj.editReply({
                                content: `Error - \`${user}\` has no recent ${mode ?? 'osu'} scores`,
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            }).catch()
                        }, 1000)
                    } else {
                        obj.reply(
                            {
                                content: `Error - \`${user}\` has no recent ${emojis.gamemodes[mode ?? 'osu']} scores`,
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            })
                            .catch();
                    }
                }
                return;
            }
            const curbm = curscore.beatmap
            const curbms = curscore.beatmapset

            let mapdata: osuApiTypes.Beatmap;
            if (func.findFile(curbm.id, 'mapdata') &&
                !('error' in func.findFile(curbm.id, 'mapdata')) &&
                button != 'Refresh'
            ) {
                mapdata = func.findFile(curbm.id, 'mapdata')
            } else {
                mapdata = await osufunc.apiget('map', `${curbm.id}`)
            }
            osufunc.debug(mapdata, 'command', 'recent', obj.guildId, 'mapData');
            func.storeFile(mapdata, curbm.id, 'mapdata')
            if (mapdata?.error) {
                if (commandType != 'button' && commandType != 'link') {
                    if (commandType == 'interaction') {
                        setTimeout(() => {
                            obj.editReply({
                                content: 'Error - could not find beatmap',
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            }).catch()
                        }, 1000)
                    } else {
                        obj.reply({
                            content: 'Error - could not find beatmap',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
                return;
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
            const curbmpasstime = Math.floor(guesspasspercentage / 100 * curbm.hit_length);

            let rsgrade;
            switch (curscore.rank.toUpperCase()) {
                case 'F':
                    rspassinfo = `\n${guesspasspercentage.toFixed(2)}% completed (${calc.secondsToTime(curbmpasstime)}/${calc.secondsToTime(curbm.hit_length)})`
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
            let ppcalcing
            try {
                ppcalcing = await osufunc.scorecalc({
                    mods: curscore.mods.join('').length > 1 ?
                        curscore.mods.join('') : 'NM',
                    gamemode: curscore.mode,
                    mapid: curscore.beatmap.id,
                    miss: gamehits.count_miss,
                    acc: curscore.accuracy,
                    maxcombo: curscore.max_combo,
                    score: curscore.score,
                    calctype: 0,
                    passedObj: 0,
                    failed: false
                })
                if (curscore.rank == 'F') {
                    ppcalcing = await osufunc.scorecalc({
                        mods: curscore.mods.join('').length > 1 ?
                            curscore.mods.join('') : 'NM',
                        gamemode: curscore.mode,
                        mapid: curscore.beatmap.id,
                        miss: gamehits.count_miss,
                        acc: curscore.accuracy,
                        maxcombo: curscore.max_combo,
                        score: curscore.score,
                        calctype: 0,
                        passedObj: totalhits,
                        failed: true
                    }
                    )
                }
                totaldiff = ppcalcing[0].stars.toFixed(2)


                rspp =
                    curscore.pp ?
                        curscore.pp.toFixed(2) :
                        ppcalcing[0].pp.toFixed(2)
                osufunc.debug(ppcalcing, 'command', 'recent', obj.guildId, 'ppCalcing');
            } catch (error) {
                rspp =
                    curscore.pp ?
                        curscore.pp.toFixed(2) :
                        NaN
                ppissue = 'Error - pp calculator could not calculate beatmap'
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
                .setURL(`https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id}`)
                .setAuthor({
                    name: `${trycountstr}`,
                    url: `https://osu.ppy.sh/u/${osudata.id}`,
                    iconURL: `${osudata?.avatar_url ?? def.images.any.url}`
                })
                .setThumbnail(`${curbms.covers.list}`)
                .setDescription(`
[${fulltitle}](https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods.length > 0 ? '+' + osumodcalc.OrderMods(curscore.mods.join('').toUpperCase()) : ''} 
${totaldiff}⭐ | ${emojis.gamemodes[curscore.mode]}
${new Date(curscore.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '')}
`)
                .addFields([
                    {
                        name: 'SCORE DETAILS',
                        value: `${(curscore.accuracy * 100).toFixed(2)}% | ${rsgrade}\n ${curscore.replay ? `[REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}` +
                            `${rspassinfo}\n${hitlist}\n${curscore.max_combo}x combo`,
                        inline: true
                    },
                    {
                        name: 'PP',
                        value: `**${rspp}**pp ${fcflag}\n${ppissue}`,
                        inline: true
                    }
                ])

            if (page >= rsdata.length - 1) {
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[2].setDisabled(true)
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[3].setDisabled(true)
            }

            osufunc.writePreviousId('map', obj.guildId, `${curbm.id}`)
            osufunc.writePreviousId('score', obj.guildId, JSON.stringify(curscore))
            osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`)

        } else if (list == true) {
            pgbuttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-recent-${commanduser.id}-${absoluteID}`)
                        .setStyle(buttonsthing.type.current)
                        .setEmoji(buttonsthing.label.page.first),
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-recent-${commanduser.id}-${absoluteID}`)
                        .setStyle(buttonsthing.type.current)
                        .setEmoji(buttonsthing.label.page.previous),
                    new Discord.ButtonBuilder()
                        .setCustomId(`Search-recent-${commanduser.id}-${absoluteID}`)
                        .setStyle(buttonsthing.type.current)
                        .setEmoji(buttonsthing.label.page.search),
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-recent-${commanduser.id}-${absoluteID}`)
                        .setStyle(buttonsthing.type.current)
                        .setEmoji(buttonsthing.label.page.next),
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-recent-${commanduser.id}-${absoluteID}`)
                        .setStyle(buttonsthing.type.current)
                        .setEmoji(buttonsthing.label.page.last),
                )
            rsEmbed
                .setColor(colours.embedColour.scorelist.dec)
                .setTitle(`Recent plays for ${osudata.username}`);
            const scoresarg = await embedStuff.scoreList(
                {
                    scores: rsdata,
                    detailed: false,
                    showWeights: false,
                    page: page,
                    showMapTitle: true,
                    showTruePosition: false,
                    sort: 'recent',
                    truePosType: 'recent',
                    filteredMapper: null,
                    filteredMods: null,
                    reverse: false
                })
            if (scoresarg.fields.length == 0) {
                rsEmbed.addFields([{
                    name: 'Error',
                    value: 'No scores found',
                    inline: false
                }])
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[0].setDisabled(true)
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[1].setDisabled(true)
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[2].setDisabled(true)
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[3].setDisabled(true)
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[4].setDisabled(true)
            } else {
                for (let i = 0; scoresarg.fields.length > i; i++) {
                    rsEmbed.addFields(scoresarg.fields[i])
                }
            }
            rsEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(rsdata.length / 5)}`)
            rsEmbed.setFooter({ text: `gamemode: ${rsdata[0].mode}` })
            if (scoresarg.isFirstPage) {
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[0].setDisabled(true)
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[1].setDisabled(true)
            }
            if (scoresarg.isLastPage) {
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[3].setDisabled(true)
                //@ts-expect-error - checks for AnyComponentBuilder not just ButtonBuilder
                pgbuttons.components[4].setDisabled(true)
            }
        }
        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);

        if (commandType != button || button == 'Refresh') {
            try {
                osufunc.updateUserStats(osudata, osudata.playmode, userdata)
            } catch (error) {
                console.log(error)
            }
        }
        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [rsEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                setTimeout(() => {
                    obj.editReply({
                        content: '',
                        embeds: [rsEmbed],
                        components: [pgbuttons, buttons],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000)
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: [rsEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }



        log.logFile('command',
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`,
            { guildId: `${obj.guildId}` }
        )
    }
}