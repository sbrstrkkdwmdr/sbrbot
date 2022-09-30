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
import buttonsthing = require('../../src/consts/buttons')

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

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                user = args.join(' ');
                if (!args[0] || args[0].includes(searchid)) {
                    user = null
                }
                mode = null;
                sort = 'pp';
                page = 1;

                mapper = null;
                mods = null;
                detailed = false;
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
                if (!obj.message.embeds[0]) {
                    return;
                }
                commanduser = obj.member.user;

                user = obj.message.embeds[0].url.split('users/')[1].split('/')[0]//obj.message.embeds[0].title.split('Top plays of ')[1]
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

                    if (obj.message.embeds[0].fields.length == 7 || obj.message.embeds[0].fields.length == 11) {
                        detailed = true
                    } else {
                        detailed = false
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
                if (button == 'DetailEnable') {
                    detailed = true;
                }
                if (button == 'DetailDisable') {
                    detailed = false;
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
            log.commandLog('osutop', commandType, absoluteID, commanduser
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
                ],
            ),
            {
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
                    .setCustomId(`Refresh-osutop-${commanduser.id}-${absoluteID}`)
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

        if (detailed == true) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailDisable-osutop-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.detailed)
            )
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailEnable-osutop-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.detailed)
            )
        }

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-osutop-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.first),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-osutop-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.previous),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-osutop-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.search),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-osutop-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.next),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-osutop-${commanduser.id}-${absoluteID}`)
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

        if (osudata?.error || !osudata.id) {
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

        let osutopdata: osuApiTypes.Score[] & osuApiTypes.Error
        if (func.findFile(absoluteID, 'osutopdata') &&
            commandType == 'button' &&
            !('error' in func.findFile(absoluteID, 'osutopdata')) &&
            button != 'Refresh'
        ) {
            osutopdata = func.findFile(absoluteID, 'osutopdata')
        } else {
            osutopdata = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
        }

        osufunc.debug(osutopdata, 'command', 'osutop', obj.guildId, 'osuTopData');
        func.storeFile(osutopdata, absoluteID, 'osutopdata')

        if (osutopdata?.error) {
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
            osutopdata[0].user.username
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

        if (page >= Math.ceil(osutopdata.length / 5)) {
            page = Math.ceil(osutopdata.length / 5) - 1
        }

        const topEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Top plays of ${osutopdata[0].user.username}`)
            .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
            .setURL(`https://osu.ppy.sh/users/${osutopdata[0].user.id}/${osutopdata[0].mode}`)
            .setAuthor({
                name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
            })
        const scoresarg = await embedStuff.scoreList(
            {
                scores: osutopdata,
                detailed: detailed,
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


        if (detailed == true) {
            const highestcombo = func.separateNum((osutopdata.sort((a, b) => b.max_combo - a.max_combo))[0].max_combo);
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