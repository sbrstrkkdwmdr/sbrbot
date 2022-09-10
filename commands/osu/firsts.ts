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

module.exports = {
    name: 'firsts',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user;
        let searchid;
        let page = 0;

        let scoredetailed = false;
        let sort: any = 'recent';
        let reverse = false;
        let mode = 'osu';
        let filteredMapper = null;
        let filteredMods = null;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                user = args.join(' ');
                if (!args[0] || args[0].includes(searchid)) {
                    user = null
                }
                page = 0
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
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
                commanduser = obj.member.user;
                user = obj.message.embeds[0].title.split('for ')[1]
                mode = cmdchecks.toAlphaNum(obj.message.embeds[0].description.split('\n')[1])
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

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'firsts',
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
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (page < 2 || typeof page != 'number' || isNaN(page)) {
            page = 1;
        }
        page--

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                    .setDisabled(false)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀')
                    .setDisabled(false)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                    .setDisabled(false)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                    .setDisabled(false)
                ,
            );
        const buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-firsts-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('🔁'),
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

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${user}`)
        fs.writeFileSync(`debug/command-firsts=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        if (osudata?.error) {
            obj.reply({
                content: `${osudata?.error ? osudata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        if (!osudata.id) {
            return obj.channel.send('Error - no user found')
                .catch();

        }

        if (commandType == 'interaction') {
            obj.reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
        }

        const firstscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('firsts', `${osudata.id}`, `${mode}`)
        fs.writeFileSync(`debug/command-firsts=firstscoresdata=${obj.guildId}.json`, JSON.stringify(firstscoresdata, null, 2))
        if (firstscoresdata?.error) {
            obj.reply({
                content: `${firstscoresdata?.error ? firstscoresdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        const firstsEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`#1 scores for ${osudata.username}`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
            .setThumbnail(`https://a.ppy.sh/${osudata.id}`)
            ;
        if (page >= Math.ceil(firstscoresdata.length / 5)) {
            page = Math.ceil(firstscoresdata.length / 5) - 1
        }

        const scoresarg = await embedStuff.scoreList(firstscoresdata, scoredetailed, false, page, true, true, sort, 'recent', filteredMapper, filteredMods, reverse)
        firstsEmbed.setDescription(`${scoresarg.filter}\nPage: ${page + 1}/${Math.ceil(scoresarg.maxPages)}\nmode: ${mode}\n`)

        if (scoresarg.fields.length == 0) {
            firstsEmbed.addFields([{
                name: 'Error',
                value: 'No scores found',
                inline: false
            }])
        } else {
            for (let i = 0; i < scoresarg.fields.length; i++) {
                firstsEmbed.addFields([scoresarg.fields[i]])
            }
        }

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

        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [firstsEmbed],
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
                        embeds: [firstsEmbed],
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
                    embeds: [firstsEmbed],
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