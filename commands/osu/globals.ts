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
    name: 'globals',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
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
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                if (!obj.message.embeds[0]) {
                    return;
                }

                commanduser = obj.member.user;
                user = obj.message.embeds[0].title.split('for ')[1]
                mode = cmdchecks.toAlphaNum(obj.message.embeds[0].description.split('\n')[1])
                page = 0;

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

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${user}`)
        // fs.writeFileSync(`debug/command-firsts=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        osufunc.debug(osudata, 'command', 'globals', obj.guildId, 'osuData');
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
        const firstscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('firsts_alt', `${osudata.id}`, `mode=${mode}&offset=0`)

        // fs.writeFileSync(`debug/command-firsts=firstscoresdata=${obj.guildId}.json`, JSON.stringify(firstscoresdata, null, 2))
        osufunc.debug(firstscoresdata, 'command', 'globals', obj.guildId, 'firstsScoresData');
        if (firstscoresdata?.error) {
            obj.reply({
                content: `${firstscoresdata?.error ? firstscoresdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        let scorecount = 0
        async function getScoreCount(cinitnum) {
            const fd = await osufunc.apiget('firsts_alt', `${osudata.id}`, `mode=${mode}&offset=${cinitnum}`, 2, 0, true)
            scorecount += fd.length
            if (fd.length == 100) {
                await getScoreCount(cinitnum+100)
            }

        } 
        await getScoreCount(0);

        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, userdata)
        } catch (error) {
            console.log(error)
        }
        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: `${user} has ${scorecount} #1 scores`,
                    embeds: [],
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
                        content: `${user} has ${scorecount} #1 scores`,
                        embeds: [],
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
                    embeds: [],
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