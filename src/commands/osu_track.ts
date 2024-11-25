import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';


/**
 * add user to tracking list
 */
export const add = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let user;
    let mode: apitypes.GameMode = 'osu';

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }
            user = input.args[0];
        }
            break;

        case 'interaction': {
            input.interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = input.interaction.member.user;
            user = input.interaction.options.getString('user');

        }
            break;
        case 'button': {

            commanduser = input.interaction.member.user;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [{
            name: 'User',
            value: user
        },
        {
            name: 'Mode',
            value: mode
        }],
        input.id,
        'trackadd',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


    if (user == null || !user || user.length < 1) {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: helper.vars.errors.uErr.osu.tracking.nullUser,
                edit: true
            }
        }, input.canReply);
        return;
    }
    const guildsetting = await helper.vars.guildSettings.findOne({ where: { guildid: input.message?.guildId ?? input.interaction.guildId } });

    if (!guildsetting?.dataValues?.trackChannel) {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: helper.vars.errors.uErr.osu.tracking.channel_ms,
                edit: true
            }
        }, input.canReply);
        return;
    } else if (guildsetting?.dataValues?.trackChannel != (input?.message?.channelId ?? input?.interaction?.channelId)) {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: helper.vars.errors.uErr.osu.tracking.channel_wrong.replace('[CHID]', guildsetting?.dataValues?.trackChannel),
                edit: true
            }
        }, input.canReply);
        return;

    }

    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(user, 'osudata', mode) &&
        !('error' in helper.tools.data.findFile(user, 'osudata', mode)) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', mode);
    } else {
        osudataReq = await helper.tools.api.getUser(user, mode, []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'trackadd', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    let replymsg;

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        replymsg = helper.vars.errors.noUser(user);
        helper.tools.log.commandErr(helper.vars.errors.noUser(user), input.id, 'trackadd', input.message, input.interaction);
    } else {

        replymsg = `Added \`${osudata.username}\` to the tracking list\nGamemode: \`${mode}\``;

        helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', mode);
        helper.tools.data.storeFile(osudataReq, user, 'osudata', mode);

        helper.tools.track.editTrackUser({
            userid: osudata.id,
            action: 'add',
            guildId: input.message?.guildId ?? input.interaction.guildId,
            mode: mode
        });
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: replymsg,
        }
    }, input.canReply);
};

/**
 * remove user from tracking list
 */
export const remove = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    let user;
    let mode: apitypes.GameMode = 'osu';

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }
            user = input.args[0];
        }
            break;

        case 'interaction': {
            input.interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = input.interaction.member.user;
            user = input.interaction.options.getString('user');
        }


            break;
        case 'button': {
            commanduser = input.interaction.member.user;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [{
            name: 'User',
            value: user
        },
        {
            name: 'Mode',
            value: mode
        }],
        input.id,
        'trackremove',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


    if (user == null || !user || user.length < 1) {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: helper.vars.errors.uErr.osu.tracking.nullUser,
                edit: true
            }
        }, input.canReply);
        return;
    }
    // const guildsetting = await helper.vars.guildSettings.findOne({ where: { guildid: input.message?.guildId ?? input.interaction.guildId } });

    // if (!guildsetting?.dataValues?.trackChannel) {
    //     await helper.tools.commands.sendMessage({
    //         type: input.type,
    //         message: input.message,
    //         interaction: input.interaction,
    //         args: {
    //             content: helper.vars.errors.uErr.osu.tracking.channel_ms,
    //             edit: true
    //         }
    //     }, input.canReply);
    //     return;
    // } else if (guildsetting?.dataValues?.trackChannel != (input.obj.channelId)) {
    //     await helper.tools.commands.sendMessage({
    //         type: input.type,
    //         message: input.message,
    //         interaction: input.interaction,
    //         args: {
    //             content: helper.vars.errors.uErr.osu.tracking.channel_wrong.replace('[CHID]', guildsetting?.dataValues?.trackChannel),
    //             edit: true
    //         }
    //     }, input.canReply);
    //     return;
    // }

    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(user, 'osudata', mode) &&
        !('error' in helper.tools.data.findFile(user, 'osudata', mode)) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', mode);
    } else {
        osudataReq = await helper.tools.api.getUser(user, mode, []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'trackremove', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    let replymsg;

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        replymsg = helper.vars.errors.noUser(user);
        helper.tools.log.commandErr(helper.vars.errors.noUser(user), input.id, 'trackremove', input.message, input.interaction);
    } else {
        replymsg = `Removed \`${osudata.username}\` from the tracking list`;

        helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', mode);
        helper.tools.data.storeFile(osudataReq, user, 'osudata', mode);

        helper.tools.track.editTrackUser({
            userid: osudata.id,
            action: 'remove',
            guildId: input.message?.guildId ?? input.interaction.guildId,
            mode
        });
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: replymsg,
        }
    }, input.canReply);
};

/**
 * channel to send tracking updates to
 */
export const channel = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let channelId;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            channelId = input.args[0];
            if (input.message.content.includes('<#')) {
                channelId = input.message.content.split('<#')[1].split('>')[0];
            }
        }
            break;

        case 'interaction': {
            input.interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = input.interaction.member.user;
            channelId = (input.interaction.options.getChannel('channel')).id;
        }


            break;
        case 'button': {

            commanduser = input.interaction.member.user;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [{
            name: 'Channel id',
            value: `${channelId}`
        }],
        input.id,
        'trackchannel',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    const guildsetting = await helper.vars.guildSettings.findOne({ where: { guildid: input.message?.guildId ?? input.interaction.guildId } });

    if (!channelId) {
        if (!guildsetting.dataValues.trackChannel) {
            await helper.tools.commands.sendMessage({
                type: input.type,
                message: input.message,
                interaction: input.interaction,
                args: {
                    content: helper.vars.errors.uErr.osu.tracking.channel_ms,
                    edit: true
                }
            }, input.canReply);
            return;
        }
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: `The current tracking channel is <#${guildsetting.dataValues.trackChannel}>`,
                edit: true
            }
        }, input.canReply);
        return;
    }

    if (!channelId || isNaN(+channelId) || !helper.vars.client.channels.cache.get(channelId)) {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: helper.vars.errors.uErr.admin.channel.msid,
                edit: true
            }
        }, input.canReply);
        return;
    }

    // guildsetting.dataValues.trackChannel = channelId;
    await guildsetting.update({
        trackChannel: channelId
    }, {
        where: { guildid: input.message?.guildId ?? input.interaction.guildId }
    });



    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: `Tracking channel set to <#${channelId}>`,
        }
    }, input.canReply);

};

/**
 * list of users being tracked
 */
export const list = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
        }
            break;

        case 'interaction': {
            commanduser = input.interaction.member.user;
        }


            break;
        case 'button': {
            commanduser = input.interaction.member.user;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [],
        input.id,
        'tracklist',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    const users = await helper.vars.trackDb.findAll();
    const useridsarraylen = await helper.vars.trackDb.count();
    // const user: tooltypes.dbUser = userids[i].dataValues;

    const userList: {
        osuid: string,
        userid: string,
        mode: string,
    }[] = [];


    for (let i = 0; i < useridsarraylen; i++) {
        const user = users[i].dataValues;
        let guilds;
        try {
            if (user.guilds.length < 3) throw new Error('no guilds');
            guilds = user.guilds.includes(',')
                ? user.guilds.split(',') :
                [user.guilds];

        } catch (error) {
            guilds = [];
        }

        //check if input.message?.guildId ?? input.interaction.guildId is in guilds
        if (guilds.includes(input.message?.guildId)) {
            userList.push({
                osuid: `${user.osuid}`,
                userid: `${user.userid}`,
                mode: `${user.mode}`
            });
        }
    }
    const userListEmbed = new Discord.EmbedBuilder()
        .setTitle(`All tracked users in ${input.message.guild.name}`)
        .setColor(helper.vars.colours.embedColour.userlist.dec)
        .setDescription(`There are ${userList.length} users being tracked in this server\n\n` +
            `${userList.map((user, i) => `${i + 1}. ${helper.vars.emojis.gamemodes[user.mode == 'undefined' ? 'osu' : user.mode]} https://osu.ppy.sh/users/${user.osuid}`).join('\n')}`
        );


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [userListEmbed],
        }
    }, input.canReply);
};