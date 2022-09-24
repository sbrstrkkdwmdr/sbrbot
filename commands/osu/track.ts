import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import colourfunc = require('../../src/colourcalc');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');
import trackfunc = require('../../src/trackfunc');

module.exports = {
    name: 'track',
    async add(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings) {
        let commanduser;

        let user;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                user = args[0];

            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                commanduser = obj.member.user;
                user = obj.options.getInteger('user');

            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }
        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-track_add-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-track_add-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-track_add-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-track_add-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                /* .setLabel('End') */,
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'track_add',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                []
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (!user || isNaN(+user)) {
            obj.reply({
                content: 'Please provide a valid user ID',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
            return;
        }

        let guildsetting = await guildSettings.findOne({
            where: { guildId: obj.guildId }
        })

        // if (!guildsetting.dataValues.trackChannel) {
        //     obj.reply({
        //         content: 'The current guild does not have a tracking channel',
        //         embeds: [],
        //         files: [],
        //         allowedMentions: { repliedUser: false },
        //         failIfNotExists: true
        //     }).catch()
        //     return;
        // }

        if(`${guildSettings.dataValues?.trackChannel ?? 'null'}` != `${obj.channelId}`) {
            obj.reply({
                content: 'You can only use this command in the tracking channel',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
            return;
        }

        trackfunc.editTrackUser({
            database: trackDb,
            discuser: commanduser.id,
            user: user,
            action: 'add',
            guildId: obj.guildId,
            guildSettings: guildSettings,
        })

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: 'Added to the tracking list',
                    embeds: [],
                    files: [],
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
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
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
    },

    //==============================================================================================================================================================================================


    async remove(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings) {
        let commanduser;
        let user;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                user = args[0];
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                commanduser = obj.member.user;
                user = obj.options.getInteger('user');
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }
        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-track_remove-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-track_remove-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-track_remove-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-track_remove-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                /* .setLabel('End') */,
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'track_remove',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                []
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (!user || isNaN(+user)) {
            obj.reply({
                content: 'Please provide a valid user ID',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
            return;
        }

        let guildsetting = await guildSettings.findOne({
            where: { guildId: obj.guildId }
        })

        if (!guildsetting.dataValues.trackChannel) {
            obj.reply({
                content: 'The current guild does not have a tracking channel',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
            return;
        }

        trackfunc.editTrackUser({
            database: trackDb,
            discuser: commanduser.id,
            user: user,
            action: 'remove',
            guildId: obj.guildId,
            guildSettings: guildSettings,
        })

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: 'removing user from tracking list',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                obj.reply({
                    content: 'removing user from tracking list',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
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
    },
    async setChannel(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings) {
        let commanduser;
        let channelId;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                channelId = args[0];
                if (obj.content.includes('<#')) {
                    channelId = obj.content.split('<#')[1].split('>')[0]
                }
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                commanduser = obj.member.user;
                channelId = (obj.options.getChannel('channel')).id;
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }
        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-track_remove-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-track_remove-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-track_remove-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-track_remove-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                /* .setLabel('End') */,
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'track_remove',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                []
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const guildsetting = await guildSettings.findOne({ where: { guildid: obj.guildId } });

        if (!channelId) {
            //the current channel is...
            if (!guildsetting.dataValues.trackChannel) {
                obj.reply({
                    content: 'The current guild does not have a tracking channel',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch()
                return;
            }
            obj.reply({
                content: `The current tracking channel is <#${guildsetting.dataValues.trackChannel}>`,
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
            return;
        }

        if (!channelId || isNaN(+channelId) || !client.channels.cache.get(channelId)) {
            obj.reply({
                content: 'Please provide a valid channel ID',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
            return;
        }

        // guildsetting.dataValues.trackChannel = channelId;
        await guildsetting.update({
            trackChannel: channelId
        }, {
            where: { guildid: obj.guildId }
        })

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: 'Tracking channel is now set to <#' + channelId + '>',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                obj.reply({
                    content: 'Tracking channel is now set  to <#' + channelId + '>',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
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
    },
    async userList(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, trackDb, guildSettings) {

        let commanduser;


        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                commanduser = obj.member.user;
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }
        //==============================================================================================================================================================================================

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-COMMANDNAME-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-COMMANDNAME-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-COMMANDNAME-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-COMMANDNAME-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                /* .setLabel('End') */,
            );
        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-COMMANDNAME-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔁'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'COMMANDNAME',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                []
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const users = await trackDb.findAll();
        const useridsarraylen = await trackDb.count();
        // const user: extypes.dbUser = userids[i].dataValues;

        let userList: {
            osuid: string,
            userid: string
        }[] = [];


        for (let i = 0; i < useridsarraylen; i++) {
            const user = users[i].dataValues;
            const guilds = user.guilds.split(',');

            //check if obj.guildId is in guilds
            if (guilds.includes(obj.guildId)) {
                userList.push({
                    osuid: `${user.osuid}`,
                    userid: `${user.userid}`
                })
            }
        }
        const userListEmbed = new Discord.EmbedBuilder()
            .setTitle(`All tracked users in ${obj.guild.name}`)
            .setColor(colours.embedColour.userlist.dec)
            .setDescription(`There are ${userList.length} users being tracked in this server\n\n` +
                `${userList.map((user, i) => `${i + 1}. <@${user.userid}> => https://osu.ppy.sh/u/${user.osuid}`).join('\n')}`
            )

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [userListEmbed],
                    files: [],
                    components: [],
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
                    embeds: [userListEmbed],
                    files: [],
                    components: [],
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
                    embeds: [userListEmbed],
                    files: [],
                    components: [],
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