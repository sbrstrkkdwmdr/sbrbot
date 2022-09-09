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
    name: 'scores',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user;
        let searchid;
        let mapid;
        let page = 1;

        let scoredetailed = false;
        let sort:any = 'recent';
        let reverse = false;
        let mode = 'osu';
        let filteredMapper = null;
        let filteredMods = null;

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
                page = 0;
                user = obj.message.embeds[0].author.name
                mapid = obj.message.embeds[0].url.split('osu.ppy.sh/')[1].split('/')[1]
                const sorting = obj.message.embeds[0].description.split('Sorted by:')[1].split('\n')[0].toLowerCase()
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
                page = 0
                switch (button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = parseInt((obj.message.embeds[0].footer.text).split('/')[0].split('Page ')[1]) - 1
                        break;
                    case 'RightArrow':
                        page = parseInt((obj.message.embeds[0].footer.text).split('/')[0].split('Page ')[1]) + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((obj.message.embeds[0].footer.text).split('/')[1].split('\n')[0])
                        break;
                    case 'Refresh':
                        page = parseInt((obj.message.embeds[0].footer.text).split('/')[0].split('Page ')[1])
                        break;
                }
                if (page < 2) {
                    isFirstPage = true;
                }
                if (page == parseInt((obj.message.embeds[0].footer.text).split('/')[1].split('\n')[0])) {
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
                reverse = overrides.reverse
            }
        }

        //==============================================================================================================================================================================================

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

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀')
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                    .setDisabled(isLastPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-scores-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                    .setDisabled(isLastPage),
            );

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

        if (commandType == 'interaction') {
            obj.reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
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
                return obj.message.edit({
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

            if (page >= Math.ceil(scoredata.length / 5)) {
                page = Math.ceil(scoredata.length / 5) - 1
            }

            const scorearg = await embedStuff.scoreList(scoredata, scoredetailed, false, page, false, false, sort, sort, filteredMapper, filteredMods, reverse, mapdata.id)

            for (let i = 0; i < scoredata.length && i < 5; i++) {
                scoresEmbed.addFields([scorearg.fields[i]])
            }
        }
        scoresEmbed.setDescription(scoretxt)

        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);
        osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`);

        if (page >= (scoredata.length / 5) - 1) {
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
                setTimeout(() => {
                    obj.editReply({
                        content: '',
                        embeds: [scoresEmbed],
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
                    embeds: [scoresEmbed],
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