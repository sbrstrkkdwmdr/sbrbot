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
    name: 'pinned',
    async execute(commandType: extypes.commandType, obj, args: string[], button: string, config: extypes.config, client: Discord.Client, absoluteID: number, currentDate:Date, overrides, userdata) {
        let commanduser;

        let user;
        let searchid;
        let page = 0;

        let scoredetailed = false;
        let sort: embedStuff.scoreSort = 'recent';
        let reverse = false;
        let mode = 'osu';
        let filteredMapper = null;
        let filteredMods = null;

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
                searchid = obj.member.user.id;
                user = obj.options.getString('user');
                page = obj.options.getInteger('page');
                scoredetailed = obj.options.getBoolean('detailed');
                sort = obj.options.getString('sort');
                reverse = obj.options.getBoolean('reverse');
                mode = obj.options.getString('mode') ?? 'osu';
                filteredMapper = obj.options.getString('mapper');
                filteredMods = obj.options.getString('mods');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                if (!obj.message.embeds[0]) {
                    return;
                }
                commanduser = obj.member.user;
                user = obj.message.embeds[0].title.split('for ')[1]
                mode = obj.message.embeds[0].description.split('\n')[1]
                page = 0;
                if (obj.message.embeds[0].description) {
                    if (obj.message.embeds[0].description.includes('mapper')) {
                        filteredMapper = obj.message.embeds[0].description.split('mapper: ')[1].split('\n')[0];
                    }
                    if (obj.message.embeds[0].description.includes('mods')) {
                        filteredMods = obj.message.embeds[0].description.split('mods: ')[1].split('\n')[0];
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
                    mode = obj.message.embeds[0].description.split('mode: ')[1].split('\n')[0]
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
                    .setCustomId(`Refresh-pinned-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.refresh),
            )

            log.logFile(
                'command',
                log.commandLog('pinned', commandType, absoluteID, commanduser
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
                    name: 'Sort',
                    value: sort
                },
                {
                    name: 'Reverse',
                    value: reverse
                },
                {
                    name: 'Mode',
                    value: mode
                },
                {
                    name: 'Filtered Mapper',
                    value: filteredMapper
                },
                {
                    name: 'Filtered Mods',
                    value: filteredMods
                },
                {
                    name: 'Detailed',
                    value: scoredetailed
                }
            ]),
            {
                guildId: `${obj.guildId}`
            }
        )

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (page < 2 || typeof page != 'number' || isNaN(page)) {
            page = 1;
        }
        page--

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-pinned-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.first),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-pinned-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.previous),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-pinned-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.search),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-pinned-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.next),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-pinned-${commanduser.id}-${absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.page.last),
            );
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

        mode = osufunc.modeValidator(mode);

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

        osufunc.debug(osudata, 'command', 'pinned', obj.guildId, 'osuData');
        if (osudata?.error || !osudata.id) {
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
            return;
        }

        let pinnedscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = []; //= await osufunc.apiget('pinned', `${osudata.id}`, `${mode}`)
        async function getScoreCount(cinitnum) {
            const fd: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('pinned_alt', `${osudata.id}`, `mode=${mode}&offset=${cinitnum}`, 2, 0, true)
            if (fd?.error) {
                if (commandType != 'button' && commandType != 'link') {
                    if (commandType == 'interaction') {
                        setTimeout(() => {
                            obj.editReply({
                                content: 'Error - could not fetch user\'s pinned scores',
                                allowedMentions: { repliedUser: false },
                                failIfNotExists: true
                            }).catch()
                        }, 1000)
                    } else {
                        obj.reply({
                            content: 'Error - could not fetch user\'s pinned scores',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        }).catch()
                    }
                }
                return;
            }
            for (let i = 0; i < fd.length; i++) {
                if (!fd[i] || typeof fd[i] == 'undefined') { break; }
                await pinnedscoresdata.push(fd[i])
            }
            if (fd.length == 100) {
                await getScoreCount(cinitnum + 100)
            }

        }
        if (func.findFile(absoluteID, 'pinnedscoresdata') &&
            commandType == 'button' &&
            !('error' in func.findFile(absoluteID, 'pinnedscoresdata')) &&
            button != 'Refresh'
        ) {
            pinnedscoresdata = func.findFile(absoluteID, 'pinnedscoresdata')
        } else {
            await getScoreCount(0);
        }
        osufunc.debug(pinnedscoresdata, 'command', 'pinned', obj.guildId, 'pinnedScoresData');
        func.storeFile(pinnedscoresdata, absoluteID, 'pinnedscoresdata');

        if (page >= Math.ceil(pinnedscoresdata.length / 5)) {
            page = Math.ceil(pinnedscoresdata.length / 5) - 1
        }

        const pinnedEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Pinned scores for ${osudata.username}`)
            .setURL(`https://osu.ppy.sh/u/${osudata.id}`)
            .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
            .setAuthor({
                name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
            })

        const scoresarg = await embedStuff.scoreList(
            {
                scores: pinnedscoresdata,
                detailed: scoredetailed,
                showWeights: false,
                page: page,
                showMapTitle: true,
                showTruePosition: true,
                sort: sort,
                truePosType: 'recent',
                filteredMapper: filteredMapper,
                filteredMods: filteredMods,
                reverse: false
            });
        pinnedEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${scoresarg.maxPages}\nmode: ${mode}\n`)
        if (scoresarg.fields.length == 0) {
            pinnedEmbed.addFields([{
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
            for (let i = 0; i < scoresarg.fields.length; i++) {
                pinnedEmbed.addFields([scoresarg.fields[i]])
            }
        }
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

        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);
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
                    embeds: [pinnedEmbed],
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
                        embeds: [pinnedEmbed],
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
                    embeds: [pinnedEmbed],
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