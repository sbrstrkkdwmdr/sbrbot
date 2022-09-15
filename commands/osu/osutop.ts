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

        if (page < 2 || typeof page != 'number' || isNaN(page)) {
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
                    .setDisabled(false),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀')
                    .setDisabled(false),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                    .setDisabled(false),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-osutop-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                    .setDisabled(false),
            );

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`)
        // fs.writeFileSync(`debug/command-otop=osudata=${obj.guildId}`, JSON.stringify(osudata, null, 2))
        osufunc.debug(osudata, 'command', 'osutop', obj.guildId, 'osuData');

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

        const osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
        // fs.writeFileSync(`debug/command-otop=osutopdata=${obj.guildId}`, JSON.stringify(osutopdata, null, 2))
        osufunc.debug(osutopdata, 'command', 'osutop', obj.guildId, 'osuTopData');
        if (osutopdata?.error) {
            obj.reply({
                content: `${osutopdata?.error ? osutopdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        try {
            osutopdata[0].user.username
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

        if (commandType == 'interaction') {
            obj.reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
        }

        // fs.writeFileSync(`debug/command-otop=osutopdata=${obj.guildId}`, JSON.stringify(osutopdata, null, 2))

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
            .setThumbnail(`https://a.ppy.sh/${osutopdata[0].user.id}`)
            .setURL(`https://osu.ppy.sh/users/${osutopdata[0].user.id}`)
            .setAuthor({
                name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
            })
        const scoresarg = await embedStuff.scoreList(osutopdata, detailed, true, page, true, showtrue, sort, 'pp', mapper, mods, reverse)
        topEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${Math.ceil(scoresarg.maxPages)}\nmode: ${mode}\n`)
        if (scoresarg.fields.length == 0) {
            topEmbed.addFields([{
                name: 'Error',
                value: 'No scores found',
                inline: false
            }])
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
            //@ts-ignore
            pgbuttons.components[0].setDisabled(true)
            //@ts-ignore
            pgbuttons.components[1].setDisabled(true)
        }
        if (scoresarg.isLastPage) {
            //@ts-ignore
            pgbuttons.components[3].setDisabled(true)
            //@ts-ignore
            pgbuttons.components[4].setDisabled(true)
        }

        try {
            osufunc.updateUserStats(osudata, osudata.playmode, userdata)
        } catch (error) {
            console.log(error)
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



        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}