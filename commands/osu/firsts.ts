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

        let isFirstPage = false;
        let isLastPage = false;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                user = args.join(' ');
                if (!args[0]) {
                    user = null
                }
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;

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
                (obj.message.embeds[0].description).split('/')[0].replace('Page ', '')
                switch (button) {
                    case 'BigLeftArrow':
                        page = 1
                        break;
                    case 'LeftArrow':
                        page = parseInt((obj.message.embeds[0].description).split('/')[0].replace('Page ', '')) - 1
                        break;
                    case 'RightArrow':
                        page = parseInt((obj.message.embeds[0].description).split('/')[0].replace('Page ', '')) + 1
                        break;
                    case 'BigRightArrow':
                        page = parseInt((obj.message.embeds[0].description).split('/')[1].split('\n')[0])
                        break;
                    case 'Refresh':
                        page = parseInt((obj.message.embeds[0].description).split('/')[0].replace('Page ', ''))
                        break;
                }
                if (button == 'Search') {
                    page = obj.fields.getTextInputValue('search')
                }

                if (page < 2) {
                    isFirstPage = true;
                } else {
                    isFirstPage = false;
                }
                if (page == parseInt((obj.message.embeds[0].description).split('/')[1].split('\n')[0])) {
                    isLastPage = true
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

        if (page < 2 || typeof page != 'number') {
            isFirstPage = true;
            page = 1;
        }
        page--

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀')
                    .setDisabled(isFirstPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`Search-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                    .setDisabled(isLastPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-firsts-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                    .setDisabled(isLastPage)
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
        if (firstscoresdata.length < 1) {
            firstsEmbed.setDescription('Error - no scores found')
            obj.reply({ embeds: [firstsEmbed], allowedMentions: { repliedUser: false }, failIfNotExists: true })
                .catch();

            return;
        }
        if (page >= Math.ceil(firstscoresdata.length / 5)) {
            page = Math.ceil(firstscoresdata.length / 5) - 1
        }

        const scoresarg = await embedStuff.scoreList(firstscoresdata, scoredetailed, false, page, true, true, sort, 'recent', filteredMapper, filteredMods, reverse)

        for (let i = 0; i < scoresarg.fields.length; i++) {
            firstsEmbed.addFields([scoresarg.fields[i]])
        }
        firstsEmbed.setDescription(
            `Page ${page + 1}/${Math.ceil(firstscoresdata.length / 5)}
${mode}
`);

        if (page >= (firstscoresdata.length / 5) - 1) {
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