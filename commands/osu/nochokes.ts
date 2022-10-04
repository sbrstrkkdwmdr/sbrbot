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
import embedStuff = require('../../src/embed');
import func = require('../../src/other');
import def = require('../../src/consts/defaults');
import buttonsthing = require('../../src/consts/buttons');
import extypes = require('../../src/types/extraTypes');

module.exports = {
    name: 'nochokes',
    async execute(commandType: extypes.commandType, obj, args: string[], button: string, config: extypes.config, client: Discord.Client, absoluteID: number, currentDate: Date, overrides, userdata) {
        let commanduser;

        let user;
        let mode;
        let sort;
        let reverse;
        let page;
        let mapper;
        let mods;
        let searchid

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                if (args.includes('-page')) {
                    page = parseInt(args[args.indexOf('-page') + 1]);
                    args.splice(args.indexOf('-page'), 2);
                }
                if (args.includes('-p')) {
                    page = parseInt(args[args.indexOf('-p') + 1]);
                    args.splice(args.indexOf('-p'), 2);
                }
                mode = null;
                sort = 'pp';
                page = 1;
                mapper = null;
                mods = null;
                if (args.includes('-page')) {
                    page = parseInt(args[args.indexOf('-page') + 1]);
                    args.splice(args.indexOf('-page'), 2);
                }
                if (args.includes('-p')) {
                    page = parseInt(args[args.indexOf('-p') + 1]);
                    args.splice(args.indexOf('-p'), 2);
                }
                if (args.includes('-mode')) {
                    mode = (args[args.indexOf('-mode') + 1]);
                    args.splice(args.indexOf('-mode'), 2);
                }
                if (args.includes('-m')) {
                    mode = (args[args.indexOf('-m') + 1]);
                    args.splice(args.indexOf('-m'), 2);
                }
                user = args.join(' ');
                if (!args[0] || args.includes(searchid)) {
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
                reverse = obj.options.getBoolean('reverse')
                searchid = obj.member.user.id
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                if (!obj.message.embeds[0]) {
                    return;
                }
                commanduser = obj.member.user;

                user = obj.message.embeds[0].url.split('users/')[1].split('/')[0]//obj.message.embeds[0].title.split('Top no choke scores of ')[1]
                mode = obj.message.embeds[0].url.split('users/')[1].split('/')[1]

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
                    if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses')) || (reverse1.includes('worst'))) {
                        reverse = true
                    } else {
                        reverse = false
                    }

                    const pageParsed =
                        parseInt((obj.message.embeds[0].description).split('Page:')[1].split('/')[0])
                    page = 0
                    switch (button) {
                        case 'BigLeftArrow':
                            page = 1
                            break;
                        case 'LeftArrow':
                            page = pageParsed - 1
                            break;
                        case 'RightArrow':
                            page = pageParsed + 1
                            break;
                        case 'BigRightArrow':
                            page = parseInt((obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0])
                            break;
                        default:
                            page = pageParsed
                            break;
                    }
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

        log.logFile(
            'command',
            log.commandLog('nochokes', commandType, absoluteID, commanduser
            ),
            {
                guildId: `${obj.guildId}`
            })

        //OPTIONS==============================================================================================================================================================================================

        log.logFile('command',
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
            ), {
            guildId: `${obj.guildId}`
        })

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (page < 2 || typeof page != 'number' || isNaN(page)) {
            page = 1;
        }
        page--

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-nochokes-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.refresh),
            )

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

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-nochokes-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.first),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-nochokes-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.previous),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-nochokes-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.search),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-nochokes-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.next),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-nochokes-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.last),
            );

        if (commandType == 'interaction') {
            obj.reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
        }

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

        osufunc.debug(osudata, 'command', 'osu', obj.guildId, 'osuData');

        if (osudata?.error) {
            if (commandType != 'button' && commandType != 'link') {
                if (commandType == 'interaction') {
                    setTimeout(() => {
                        obj.reply({
                            content: `Error - could not find user \`${user}\``,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                    }, 1000);
                } else {
                    obj.reply({
                        content: `Error - could not find user \`${user}\``,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }
            }
            return;
        }

        let nochokedata: osuApiTypes.Score[] & osuApiTypes.Error
        if (func.findFile(absoluteID, 'nochokedata') &&
            commandType == 'button' &&
            !('error' in func.findFile(absoluteID, 'nochokedata')) &&
            button != 'Refresh'
        ) {
            nochokedata = func.findFile(absoluteID, 'nochokedata')
        } else {
            nochokedata = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
        }

        osufunc.debug(nochokedata, 'command', 'osutop', obj.guildId, 'noChokeData');
        func.storeFile(nochokedata, absoluteID, 'nochokedata')

        if (nochokedata?.error) {
            if (commandType != 'button' && commandType != 'link') {
                if (commandType == 'interaction') {
                    setTimeout(() => {
                        obj.reply({
                            content: `Error - could not find \`${user}\`'s top scores`,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                    }, 1000);
                } else {
                    obj.reply({
                        content: `Error - could not find \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }
            }
            return;
        }

        try {
            nochokedata[0].user.username
        } catch (error) {
            if (commandType != 'button' && commandType != 'link') {
                if (commandType == 'interaction') {
                    setTimeout(() => {
                        obj.reply({
                            content: `Error - could not fetch \`${user}\`'s top scores`,
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                            .catch();
                    }, 1000);
                } else {
                    obj.reply({
                        content: `Error - could not fetch \`${user}\`'s top scores`,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }
            }
            return;
        }

        let showtrue = false;
        if (sort != 'pp') {
            showtrue = true;
        }

        if (page >= Math.ceil(nochokedata.length / 5)) {
            page = Math.ceil(nochokedata.length / 5) - 1
        }

        const topEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Top no choke scores of ${nochokedata[0].user.username}`)
            .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
            .setURL(`https://osu.ppy.sh/users/${nochokedata[0].user.id}/${nochokedata[0].mode}`)
            .setAuthor({
                name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
            })
        const scoresarg = await embedStuff.scoreList(
            {
                scores: nochokedata.filter(a => a.statistics.count_miss == 0),
                detailed: false,
                showWeights: true,
                page: page,
                showMapTitle: true,
                showTruePosition: showtrue,
                sort: sort,
                truePosType: 'pp',
                filteredMapper: mapper,
                filteredMods: mods,
                reverse: reverse
            })
        topEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${Math.ceil(scoresarg.maxPages)}`)
        if (scoresarg.fields.length == 0) {
            topEmbed.addFields([{
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
                topEmbed.addFields(scoresarg.fields[i])
            }
        }

        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);

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
        if (commandType != 'button' || button == 'Refresh') {
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
                setTimeout(() => {
                    obj.editReply({
                        content: '',
                        embeds: [topEmbed],
                        components: [pgbuttons, buttons],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000);
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