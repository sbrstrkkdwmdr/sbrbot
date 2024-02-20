import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as jimp from 'jimp';
import * as osuclasses from 'osu-classes';
import * as osuparsers from 'osu-parsers';
import * as replayparser from 'osureplayparser';
import {
    CatchPerformanceAttributes,
    ManiaPerformanceAttributes, OsuPerformanceAttributes, PerformanceAttributes, TaikoPerformanceAttributes
} from 'rosu-pp';
import { filespath, path, precomppath } from '../path.js';
import * as calc from '../src/calc.js';
import * as cmdchecks from '../src/checks.js';
import * as colourfunc from '../src/colourcalc.js';
import * as buttonsthing from '../src/consts/buttons.js';
import * as colours from '../src/consts/colours.js';
import * as def from '../src/consts/defaults.js';
import * as emojis from '../src/consts/emojis.js';
import * as errors from '../src/consts/errors.js';
import * as helpinfo from '../src/consts/helpinfo.js';
import * as mainconst from '../src/consts/main.js';
import * as embedStuff from '../src/embed.js';
import * as func from '../src/func.js';
import * as log from '../src/log.js';
import * as osufunc from '../src/osufunc.js';
import * as osumodcalc from '../src/osumodcalc.js';
import * as formula from '../src/tools.js';
import * as trackfunc from '../src/trackfunc.js';
import * as extypes from '../src/types/extratypes.js';
import * as osuApiTypes from '../src/types/osuApiTypes.js';
import * as othertypes from '../src/types/othertypes.js';
import * as msgfunc from './msgfunc.js';

export async function name(input: extypes.commandInput) {
}

/**
 * main command functions at the top
 * arg handling and other stuff is at the bottom
 */


//user stats

/**
 * display users badges
 */
export async function badges(input: extypes.commandInput & { statsCache: any; }) {
    {

        let commanduser: Discord.User;
        let user;
        let searchid;
        const embedStyle: extypes.osuCmdStyle = 'A';

        switch (input.commandType) {
            case 'message': {
                input.obj = (input.obj as Discord.Message);
                commanduser = input.obj.author;
                searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

                input.args = msgfunc.cleanArgs(input.args);

                user = input.args.join(' ');
                if (!input.args[0] || input.args[0].includes(searchid)) {
                    user = null;
                }
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                input.obj = (input.obj as Discord.ChatInputCommandInteraction);
                commanduser = input.obj.member.user;
                searchid = commanduser.id;
                user = input.obj.options.getString('user');
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                input.obj = (input.obj as Discord.ButtonInteraction);
                commanduser = input.obj.member.user;
                searchid = commanduser.id;
            }
                break;
        }

        //==============================================================================================================================================================================================

        log.logCommand({
            event: 'Command',
            commandType: input.commandType,
            commandId: input.absoluteID,
            commanduser,
            object: input.obj,
            commandName: 'badges',
            options: [],
            config: input.config
        });

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        //if user is null, use searchid
        if (user == null) {
            const cuser = await osufunc.searchUser(searchid, input.userdata, true);
            user = cuser.username;
        }

        //if user is not found in database, use discord username
        if (user == null) {
            const cuser = input.client.users.cache.get(searchid);
            user = cuser.username;
        }

        if (input.commandType == 'interaction') {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: 'Loading...'
                }
            }, input.canReply);
        }

        let osudataReq: osufunc.apiReturn;

        if (func.findFile(user, 'osudata', osufunc.modeValidator('osu')) &&
            !('error' in func.findFile(user, 'osudata', osufunc.modeValidator('osu'))) &&
            input.button != 'Refresh'
        ) {
            osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator('osu'));
        } else {
            osudataReq = await osufunc.apiget({
                type: 'user',
                params: {
                    username: cmdchecks.toHexadecimal(user),
                    mode: osufunc.modeValidator('osu')
                },
                config: input.config
            });
        }

        const osudata: osuApiTypes.User = osudataReq.apiData;

        if (osudataReq?.error) {
            await msgfunc.errorAndAbort(input, 'badges', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
            return;
        }

        osufunc.debug(osudataReq, 'command', 'badges', input.obj.guildId, 'osuData');

        if (osudata?.hasOwnProperty('error') || !osudata.id) {
            await msgfunc.errorAndAbort(input, 'badges', true, errors.noUser(user), true);
            return;
        }

        const cmdbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-User-badges-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.extras.user),
            );

        osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(osudata.playmode), 'User');

        let badgecount = 0;
        for (const badge of osudata.badges) {
            badgecount++;
        }

        const embed = new Discord.EmbedBuilder()
            .setFooter({
                text: `${embedStyle}`
            })
            .setAuthor({
                name: `${osudata.username} | #${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/users/${osudata.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
            })
            .setTitle(`${osudata.username}s Badges`)
            .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
            .setDescription(
                'Current number of badges: ' + badgecount
            );

        const fields: Discord.EmbedField[] = [];

        for (let i = 0; i < 10 && i < osudata.badges.length; i++) {
            const badge = osudata?.badges[i];
            if (!badge) break;
            fields.push(
                {
                    name: badge.description,
                    value:
                        `Awarded <t:${new Date(badge.awarded_at).getTime() / 1000}:R>
${badge.url.length != 0 ? `[Forum post](${badge.url})` : ''}
${badge.image_url.length != 0 ? `[Image](${badge.image_url})` : ''}`,
                    inline: true
                }
            );
        }

        if (fields.length > 0) {
            embed.addFields(fields);
        }


        //SEND/EDIT MSG==============================================================================================================================================================================================
        const finalMessage = await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                embeds: [embed],
                components: [cmdbuttons]
            }
        }, input.canReply);

        if (finalMessage == true) {
            log.logCommand({
                event: 'Success',
                commandName: 'badges',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                config: input.config
            });
        } else {
            log.logCommand({
                event: 'Error',
                commandName: 'badges',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                customString: 'Message failed to send',
                config: input.config
            });
        }
    }
}


/**
 * badge weight seed
 */
export async function bws(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;
    let user;
    let searchid;
    const embedStyle: extypes.osuCmdStyle = 'A';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

            input.args = msgfunc.cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null;
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.options.getString('user');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
        }
            break;
    }

    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'bws (Badge Weight System)',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: 'Loading...'
            }
        }, input.canReply);
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator('osu')) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator('osu'))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator('osu'));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator('osu')
            },
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'bws', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }

    osufunc.debug(osudataReq, 'command', 'bws', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'bws', true, errors.noUser(user), true);
        return;
    }

    const cmdbuttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-User-bws-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.user),
        );

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(osudata.playmode), 'User');

    let badgecount = 0;
    for (const badge of osudata.badges) {
        badgecount++;
    }
    function bwsF(badgenum: number) {
        return badgenum > 0 ?
            osudata.statistics.global_rank ** (0.9937 ** (badgenum ** 2)) :
            osudata.statistics.global_rank;

    }

    const embed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setAuthor({
            name: `${osudata.username} | #${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setTitle(`Badge weighting for ${osudata.username}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setDescription(
            'Current number of badges: ' + badgecount
        )
        .addFields([
            {
                name: `${badgecount == 1 ? badgecount + ' badge' : badgecount + ' badges'}`,
                value: `${Math.floor(bwsF(badgecount))}`,
                inline: true
            },
            {
                name: `${badgecount + 1 == 1 ? badgecount + 1 + ' badge' : badgecount + 1 + ' badges'}`,
                value: `${Math.floor(bwsF(badgecount + 1))}`,
                inline: true
            },
            {
                name: `${badgecount + 2} badges`,
                value: `${Math.floor(bwsF(badgecount + 2))}`,
                inline: true
            },
        ]);
    //\nFormula: rank^(0.9937^badges^2)
    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
            components: [cmdbuttons],
            edit: true,
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'bws',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'bws',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}

/**
 * number of #1 scores
 */
export async function globals(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;

    let user;
    let searchid;
    let page = 0;
    let mode = 'osu';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

            input.args = msgfunc.cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null;
            }
            page = 0;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.options.getString('user');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.message.embeds[0].title.split('for ')[1];
            mode = cmdchecks.toAlphaNum(input.obj.message.embeds[0].description.split('\n')[1]);
            page = 0;

        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page;
        }
    }

    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'globals',
        options: [
            {
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
            }
        ],
        config: input.config
    });
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    const osudataReq: osufunc.apiReturn = await osufunc.apiget({
        type: 'user',
        params: {
            username: cmdchecks.toHexadecimal(user),
            mode: 'osu'
        }, config: input.config
    });
    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'globals', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    osufunc.debug(osudataReq, 'command', 'globals', input.obj.guildId, 'osuData');
    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'globals', true, errors.noUser(user), true);
        return;
    }

    const cmdbuttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-User-globals-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.user),
        );

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    osufunc.writePreviousId('user', input.obj.guildId, { id: `${osudata.id}`, apiData: null, mods: null });
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata);
        } catch (error) {
            log.toOutput(error, input.config);
        }
    }

    const baseURL = `NULL`;
    // `https://osustats.respektive.pw/counts/`;
    // ^^^ offline as of 2023-03-24
    const data =
    {
        top1s: 0,
        top8s: 0,
        top15s: 0,
        top25s: 0,
        top50s: 0,
        top100s: 0,
        top1s_rank: NaN,
        top8s_rank: NaN,
        top15s_rank: NaN,
        top25s_rank: NaN,
        top50s_rank: NaN,
        top100s_rank: NaN,

    };
    //await func.fetch(baseURL + osudata.id) as othertypes.osustatsType;

    const countsEmbed = new Discord.EmbedBuilder()
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setTitle(`Top X leaderboard counts for ${osudata.username}`)
        .setThumbnail(`${osudata.avatar_url ?? def.images.user.url}`)
        .setDescription(`
\`Top 1   | ${`${data.top1s}`.padEnd(6, ' ')} | #${`${data.top1s_rank ?? 'null'}`.padEnd(10, ' ')}\`
\`Top 8   | ${`${data.top8s}`.padEnd(6, ' ')} | #${`${data.top8s_rank ?? 'null'}`.padEnd(10, ' ')}\`
\`Top 15  | ${`${data.top15s}`.padEnd(6, ' ')} | #${`${data.top15s_rank ?? 'null'}`.padEnd(10, ' ')}\`
\`Top 25  | ${`${data.top25s}`.padEnd(6, ' ')} | #${`${data.top25s_rank ?? 'null'}`.padEnd(10, ' ')}\`
\`Top 50  | ${`${data.top50s}`.padEnd(6, ' ')} | #${`${data.top50s_rank ?? 'null'}`.padEnd(10, ' ')}\`
\`Top 100 | ${`${data.top100s}`.padEnd(6, ' ')} | #${`${data.top100s_rank ?? 'null'}`.padEnd(10, ' ')}\`
`)

        ;

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [countsEmbed],
            components: [cmdbuttons]
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'globals',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'globals',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * server leaderboards
 */
export async function lb(input: extypes.commandInput) {

    let commanduser: Discord.User;
    const embedStyle: extypes.osuCmdStyle = 'L';

    let page = 0;
    let mode = 'osu';
    let id = null;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }
            input.args = msgfunc.cleanArgs(input.args);
            id = input.args[0];
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            id = input.obj.options.getString('id');
            const gamemode = input.obj.options.getString('mode');
            if (!gamemode || gamemode == 'osu' || gamemode == 'o' || gamemode == '0' || gamemode == 'standard' || gamemode == 'std') {
                mode = 'osu';
            }
            if (gamemode == 'taiko' || gamemode == 't' || gamemode == '1' || gamemode == 'drums') {
                mode = 'taiko';
            }
            if (gamemode == 'fruits' || gamemode == 'c' || gamemode == '2' || gamemode == 'catch' || gamemode == 'ctb') {
                mode = 'fruits';
            }
            if (gamemode == 'mania' || gamemode == 'm' || gamemode == '3' || gamemode == 'piano') {
                mode = 'mania';
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            if (!input.obj.message.embeds[0]) {
                return;
            }

            id = input.obj.message.embeds[0].author.name;
            mode = input.obj.message.embeds[0].footer.text.split(' | ')[0];

            page = 0;
            if (input.button == 'BigLeftArrow') {
                page = 1;
            }
            let pageFinder = input.obj.message.embeds[0].footer.text.split(' | ')[1].split('Page ')[1];
            switch (input.button) {
                case 'LeftArrow':
                    page = +pageFinder.split('/')[0] - 1;
                    break;
                case 'RightArrow':
                    page = +pageFinder.split('/')[0] + 1;
                    break;
                case 'BigRightArrow':
                    page = +pageFinder.split('/')[1];
                    break;
            }

            if (page < 2) {
                page == 1;
            }
            commanduser = input.obj.member.user;
        }
            break;
    }
    // if (input.overrides != null) {

    // }

    //==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('lb', commanduser, input.absoluteID);

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'lb (Server Leaderboard)',
        options: [
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'ID',
                value: id
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number') {
        page = 1;
    }
    page--;
    let global = false;
    let guild = input.obj.guild;
    if (id == 'global') {
        global = true;
    }
    if (typeof +id == 'number') {
        const tempguild = input.client.guilds.cache.get(id);
        if (tempguild) {
            const isThere = tempguild.members.cache.has(input.obj.member.id);
            guild = isThere ? tempguild : guild;
        }
    }

    const name = global ? "Global SSoB leaderboard" :
        `Server leaderboard for ${guild?.name ?? "null"}`;

    const serverlb = new Discord.EmbedBuilder()
        .setAuthor({ name: `${id ?? guild.id}` })
        .setFooter({
            text: `${embedStyle}`
        }).setColor(colours.embedColour.userlist.dec)
        .setTitle(name);
    const userids = await input.userdata.findAll();
    const useridsarraylen = await input.userdata.count();
    let rtxt = `\n`;
    const rarr = [];


    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let cache: Discord.Collection<string, Discord.GuildMember> | Discord.Collection<string, Discord.User>;

    if (global) {
        cache = input.client.users.cache;
    } else {
        cache = guild.members.cache;
    }
    for (let i = 0; i < useridsarraylen; i++) {
        const user: extypes.dbUser = userids[i].dataValues;
        if (global) {
            (cache as Discord.Collection<string, Discord.User>).forEach(member => {
                if (`${member.id}` == `${user.userid}` && user != null && !rtxt.includes(`${member.id}`)) {
                    addUser({ id: member.id, name: member.username }, user);
                }
            });
        } else {
            (cache as Discord.Collection<string, Discord.GuildMember>).forEach(member => {
                if (`${member.id}` == `${user.userid}` && user != null && !rtxt.includes(`${member.id}`)) {
                    addUser({ id: member.user.id, name: member.displayName }, user);
                }
            });
        }
    }
    function addUser(member: { id: string, name: string; }, user: extypes.dbUser) {
        if (`${member.id}` == `${user.userid}`) {
            if (user != null && !rtxt.includes(`${member.id}`)) {
                let acc: string | number;
                let pp: string | number;
                acc = user[`${mode}acc`];
                if (isNaN(+acc) || acc == null) {
                    return;
                } else {
                    acc = user.osuacc.toFixed(2);
                }
                pp = user[`${mode}pp`];
                if (isNaN(+pp) || pp == null) {
                    return;
                } else {
                    pp = Math.floor(user.osupp);
                }
                const rank = user[`${mode}rank`];
                if (isNaN(+rank) || rank == null) {
                    return;
                }
                rarr.push(
                    {
                        discname:
                            ((member.name.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.name.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.name.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' '),
                        osuname:
                            (user.osuname.padEnd(17 - 2, ' ')).length > 15 ? user.osuname.substring(0, 12) + '...' : user.osuname.padEnd(17 - 2, ' '),
                        rank:
                            `${rank}`.padEnd(10 - 2, ' ').substring(0, 8),
                        acc:
                            `${acc}`.substring(0, 5),
                        pp:
                            `${pp}pp`.padEnd(9 - 2, ' '),
                    }
                );
            }

        }
    }
    // let iterator = 0;

    const another = rarr.slice().sort((b, a) => b.rank - a.rank); //for some reason this doesn't sort even tho it does in testing
    rtxt = `\`Rank    Discord           osu!              Rank       Acc      pp       `;
    let pageOffset = page * 10;
    for (let i = 0; i < rarr.length && i < 10; i++) {
        const cur = another[i + pageOffset];
        if (!cur) break;
        const pad = i + 1 >= 10 ?
            i + 1 >= 100 ?
                3
                : 4
            : 5;
        rtxt += `\n#${i + 1 + pageOffset + ')'.padEnd(pad, ' ')} ${cur.discname}   ${cur.osuname}   ${cur.rank.toString().padEnd(10 - 2, ' ').substring(0, 8)}   ${cur.acc}%   ${cur.pp}  `;
    }

    rtxt += `\n\``;
    serverlb.setDescription(rtxt);
    serverlb.setFooter({ text: mode + ` | Page ${page + 1}/${Math.ceil(rarr.length / 10)}` });
    // const endofcommand = new Date().getTime();
    // const timeelapsed = endofcommand - input.currentDate.getTime();

    if (page < 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (page + 1 >= Math.ceil(rarr.length / 10)) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [serverlb],
            components: [pgbuttons],
            edit: true
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'lb',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'lb',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * global leaderboards
 */
export async function ranking(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;
    let country = 'ALL';
    let mode = 'osu';
    let type: osuApiTypes.RankingType = 'performance';
    let page = 0;
    let spotlight;

    const embedStyle: extypes.osuCmdStyle = 'L';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-p', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = msgfunc.cleanArgs(input.args);

            input.args[0] && input.args[0].length == 2 ? country = input.args[0].toUpperCase() : country = 'ALL';
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            input.obj.options.getString('country') ? country = input.obj.options.getString('country').toUpperCase() : country = 'ALL';
            input.obj.options.getString('mode') ? mode = input.obj.options.getString('mode').toLowerCase() : mode = 'osu';
            input.obj.options.getString('type') ? type = input.obj.options.getString('type').toLowerCase() as osuApiTypes.RankingType : type = 'performance';
            input.obj.options.getInteger('page') ? page = input.obj.options.getInteger('page') - 1 : page = 0;
            input.obj.options.getInteger('spotlight') ? spotlight = input.obj.options.getInteger('spotlight') : spotlight = undefined;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
            const pageParsed =
                parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]);
            page = pageParsed;
            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1;
                    break;
                case 'LeftArrow':
                    page = pageParsed - 1;
                    break;
                case 'RightArrow':
                    page = pageParsed + 1;
                    break;
                case 'BigRightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0]);
                    break;
                default:
                    page = pageParsed;
                    break;
            }
            let base: string = input.obj.message.embeds[0].title;
            if (base.includes('Global')) {
                base = base.split('Global ')[1];
            }
            if (base.includes('for ')) {
                base = base.split('for ')[0];
                input.obj.message.embeds[0].footer ? country = input.obj.message.embeds[0].footer.text.split('Country: ')[1] : country = 'ALL';
            }
            mode = base.split(' ')[0].toLowerCase().replaceAll('!', '');
            type = base.split(' ')[1].toLowerCase() as osuApiTypes.RankingType;
            if (type == 'charts') {
                spotlight = input.obj.message.embeds[0].description.split('\n')[1].split('?spotlight=')[1].split(')')[0];
            }
        }
            break;
    }
    if (input.overrides != null) {
        page = input.overrides.page ?? page;
    }

    mode = osufunc.modeValidator(mode);

    //==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('ranking', commanduser, input.absoluteID);

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Refresh-ranking-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        );

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'ranking',
        options: [
            {
                name: 'Country',
                value: country
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Spotlight',
                value: spotlight
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;

    let url = `rankings/${mode}/${type}`;
    if (country != 'ALL') {
        if (type == 'performance') {
            url += `?country=${country}`;
        }
    }
    if (type == 'charts' && !isNaN(+spotlight)) {
        url += '?spotlight=' + spotlight;
    }

    let rankingdataReq: osufunc.apiReturn;
    if (func.findFile(input.absoluteID, 'rankingdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'rankingdata')) &&
        input.button != 'Refresh'
    ) {
        rankingdataReq = func.findFile(input.absoluteID, 'rankingdata');
    } else {
        rankingdataReq = (await osufunc.apiget({
            type: 'custom',
            config: input.config,
            params: {
                urlOverride: url
            },
            ignoreNonAlphaChar: true,
            version: 2,
        }).catch(async () => {
            if (country != 'ALL') {
                await msgfunc.sendMessage({
                    commandType: input.commandType,
                    obj: input.obj,
                    args: {
                        content: `Invalid country code`,
                        edit: true
                    }
                }, input.canReply);
            } else {
                await msgfunc.sendMessage({
                    commandType: input.commandType,
                    obj: input.obj,
                    args: {
                        content: `Error`,
                        edit: true
                    }
                }, input.canReply);
            }
            return;
        })) as osufunc.apiReturn;
    }
    func.storeFile(rankingdataReq, input.absoluteID, 'rankingdata');

    const rankingdata: osuApiTypes.Rankings = rankingdataReq.apiData;
    if (rankingdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'ranking', true, errors.uErr.osu.rankings, false);
        return;
    }

    if (rankingdata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'ranking', true, errors.uErr.osu.rankings, true);
        return;
    }


    try {
        osufunc.debug(rankingdataReq, 'command', 'ranking', input.obj.guildId, 'rankingData');
    } catch (e) {
        return;
    }
    if (rankingdata.ranking.length == 0) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `No data found`,
                edit: true
            }
        }, input.canReply);
        return;
    }

    let ifchart = '';
    if (type == 'charts') {
        ifchart = `[${rankingdata.spotlight.name}](https://osu.ppy.sh/rankings/${mode}/charts?spotlight=${rankingdata.spotlight.id})`;
    }

    if (country == 'ALL' && input.button == null) {
        osufunc.userStatsCache(rankingdata.ranking, input.statsCache, osufunc.modeValidator(mode), 'Stat');
    }

    const embed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        }).setTitle(country != 'ALL' ?
            `${mode == 'osu' ? 'osu!' : calc.toCapital(mode)} ${calc.toCapital(type)} Rankings for ${country}` :
            `Global ${mode == 'osu' ? 'osu!' : calc.toCapital(mode)} ${calc.toCapital(type)} Ranking`)
        .setColor(colours.embedColour.userlist.dec)
        .setDescription(`Page: ${page + 1}/${Math.ceil(rankingdata.ranking.length / 5)}\n${ifchart}\n`);
    country != 'ALL' ?
        embed.setThumbnail(`https://osuflags.omkserver.nl${country}`)
            .setFooter({
                text: `Country: ${country}`
            })
        : '';

    if (page > Math.ceil(rankingdata.ranking.length / 5)) {
        page = Math.ceil(rankingdata.ranking.length / 5);
    }

    for (let i = 0; i < 5 && i + (page * 5) < rankingdata.ranking.length; i++) {
        const curuser = rankingdata.ranking[i + (page * 5)];
        if (!curuser) break;
        embed.addFields(
            [
                {
                    name: `${i + 1 + (page * 5)}`,
                    value:
                        `:flag_${curuser.user.country_code.toLowerCase()}: [${curuser.user.username}](https://osu.ppy.sh/users/${curuser.user.id}/${mode})
#${curuser.global_rank == null ?
                            '---' :
                            func.separateNum(curuser.global_rank)
                        }
Score: ${curuser.total_score == null ? '---' : func.numToLetter(curuser.total_score)} (${curuser.ranked_score == null ? '---' : func.numToLetter(curuser.ranked_score)} ranked)
${curuser.hit_accuracy == null ? '---' : curuser.hit_accuracy.toFixed(2)}% | ${curuser.pp == null ? '---' : func.separateNum(curuser.pp)}pp | ${curuser.play_count == null ? '---' : func.separateNum(curuser.play_count)} plays
`
                    ,
                    inline: false
                }
            ]
        );
    }
    if (page + 1 >= Math.ceil(rankingdata.ranking.length / 5)) {

        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);

        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    if (page == 0) {

        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);

        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
            components: [pgbuttons, buttons],
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'ranking',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'ranking',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * estimate rank from pp or vice versa
 */
export async function rankpp(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;

    let type: string = 'rank';
    let value;
    let mode: osuApiTypes.GameMode = 'osu';

    const embedStyle: extypes.osuCmdStyle = 'A';


    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = msgfunc.cleanArgs(input.args);

            value = input.args[0] ?? 100;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            value = input.obj.options.getInteger('value') ?? 100;
            mode = input.obj.options.getString('mode') as osuApiTypes.GameMode ?? 'osu';
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }
    if (input.overrides != null) {
        type = input?.overrides?.type ?? 'pp';
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'rank/pp',
        options: [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Value',
                value: value
            },
            {
                name: 'Mode',
                value: mode
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const Embed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        }).setTitle('null')
        .setDescription('null');

    let returnval: string | number;
    const disclaimer = 'Values are very rough estimates (especially pp to rank)';
    switch (type) {
        case 'pp': {
            returnval = await osufunc.getRankPerformance('pp->rank', value, mode, input.statsCache);
            if (typeof returnval == 'number') {
                returnval = 'approx. rank #' + func.separateNum(Math.ceil(returnval));
            } else {
                returnval = 'null';
            }
            Embed
                .setTitle(`Approximate rank for ${value}pp`);
        }
            break;
        case 'rank': {
            returnval = await osufunc.getRankPerformance('rank->pp', value, mode, input.statsCache);
            if (typeof returnval == 'number') {
                returnval = 'approx. ' + func.separateNum(returnval.toFixed(2)) + 'pp';
            } else {
                returnval = 'null';
            }

            Embed
                .setTitle(`Approximate performance for rank #${value}`);
        }
            break;
    }

    const dataSizetxt = await input.statsCache.count();

    Embed
        .setDescription(`${returnval}\n${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode ?? 'osu'] : mode ?? 'osu'}\nEstimated from ${dataSizetxt} entries.`);


    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embed]
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'rank/pp',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'rank/pp',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * return osu! profile
 */
export async function osu(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;

    let user = null;
    let mode = null;
    let graphonly = false;
    let detailed: number = 1;
    let searchid;

    let embedStyle: extypes.osuCmdStyle = 'P';
    let useContent: string = null;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-details')) {
                detailed = 2;
                input.args.splice(input.args.indexOf('-details'), 1);
            }
            if (input.args.includes('-detailed')) {
                detailed = 2;
                input.args.splice(input.args.indexOf('-detailed'), 1);
            }
            if (input.args.includes('-detail')) {
                detailed = 2;
                input.args.splice(input.args.indexOf('-detail'), 1);
            }
            if (input.args.includes('-d')) {
                detailed = 2;
                input.args.splice(input.args.indexOf('-d'), 1);
            }
            if (input.args.includes('-graph')) {
                graphonly = true;
                input.args.splice(input.args.indexOf('-graph'), 1);
            }
            if (input.args.includes('-g')) {
                graphonly = true;
                input.args.splice(input.args.indexOf('-g'), 1);
            }
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = msgfunc.cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = input.obj.member.user.id;

            user = input.obj.options.getString('user');
            detailed = input.obj.options.getBoolean('detailed') ? 2 : 1;
            mode = input.obj.options.getString('mode');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            if (input.obj.message.embeds[0].footer.text.includes('PE')) {
                detailed = 2;
            }
            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0];
            mode = input.obj.message.embeds[0].url.split('users/')[1].split('/')[1];

            switch (input.button) {
                case 'Detail1':
                    detailed = 1;
                    break;
                case 'Detail2':
                    detailed = 2;
                    break;
                case 'Graph':
                    graphonly = true;
                    break;
                default:
                    if (input.obj.message.embeds[0].footer.text.includes('E')) {
                        detailed = 2;
                    } else {
                        detailed = 1;
                    }
                    break;
            }

            if (input.button == 'Detail2') {
                detailed = 2;
            }
            if (input.button == 'Detail1') {
                detailed = 1;
            }
            if (input.button == 'Refresh') {
                if (input.obj.message.embeds[0].fields[0]) {
                    detailed = 2;
                } else {
                    detailed = 1;
                }
            }

            if (!input.obj.message.embeds[0].title) {
                graphonly = true;
            }
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;

            const msgnohttp: string = input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '');

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            user = msgnohttp.includes(' ') ? msgnohttp.split('/')[2].split(' ')[0] : msgnohttp.split('/')[2];
            mode = msgnohttp.includes(' ') ?
                msgnohttp.split('/')[3] ?
                    msgnohttp.split('/')[3].split(' ')[0] : null
                :
                msgnohttp.split('/')[3] ?
                    msgnohttp.split('/')[3] : null;
            //u
        }
    }

    if (input.overrides != null) {
        if (input.overrides.mode) {
            mode = input.overrides.mode;
        }
        if (input.overrides.id) {
            user = input.overrides.id;
        }
        if (input.overrides.commandAs) {
            input.commandType = input.overrides.commandAs;
        }
        if (input.overrides.commanduser) {
            commanduser = input.overrides.commanduser;
            useContent = `Requested by <@${commanduser.id}>`;
        }
    }

    //OPTIONS==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'osu',
        options: [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Detailed',
                value: detailed
            },
            {
                name: 'Gamemode',
                value: mode
            },
            {
                name: 'Graph',
                value: `${graphonly}`
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Refresh-osu-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        );
    if (graphonly != true) {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Graph-osu-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.graph),
        );
        switch (detailed) {
            case 1: {
                buttons.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${mainconst.version}-Detail2-osu-${commanduser.id}-${input.absoluteID}`)
                        .setStyle(buttonsthing.type.current)
                        .setEmoji(buttonsthing.label.main.detailMore),
                );
                embedStyle = 'P';
            }
                break;
            case 2: {
                buttons.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${mainconst.version}-Detail1-osu-${commanduser.id}-${input.absoluteID}`)
                        .setStyle(buttonsthing.type.current)
                        .setEmoji(buttonsthing.label.main.detailLess),
                );
                embedStyle = 'PE';
            }
                break;
        }
    } else {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Detail1-osu-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.user),
        );
    }

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = mode ? osufunc.modeValidator(mode) : null;

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh' && input.commandType == 'button'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        });
    }

    let osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'osu', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }

    osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'osu', true, errors.noUser(user), true);
        return;
    }

    //check for player's default mode if mode is null
    if ((

        (input.commandType == 'interaction' && !(input.obj as Discord.ChatInputCommandInteraction)?.options?.getString('mode'))
        || input.commandType == 'message' || input.commandType == 'link'
    ) &&
        osudata.playmode != 'osu' &&
        typeof mode != 'undefined') {
        mode = osudata.playmode;
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        });
        osudata = osudataReq.apiData;
        if (osudataReq?.error) {
            await msgfunc.errorAndAbort(input, 'osu', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
            return;
        }
        osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');
    } else {
        mode = mode ?? 'osu';
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata);
            osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');
        } catch (error) {
            log.toOutput(error, input.config);
        }
    }

    const osustats = osudata.statistics;
    const grades = osustats.grade_counts;

    const playerrank =
        osudata.statistics?.global_rank ?
            func.separateNum(osudata.statistics.global_rank) :
            '---';

    const countryrank =
        osudata.statistics?.country_rank ?
            func.separateNum(osudata.statistics.country_rank) :
            '---';

    const rankglobal = ` #${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)`;

    const peakRank = osudata?.rank_highest?.rank ?
        `\n**Peak Rank**: #${func.separateNum(osudata.rank_highest.rank)} (<t:${new Date(osudata.rank_highest.updated_at).getTime() / 1000}:R>)` :
        '';

    const onlinestatus = osudata.is_online == true ?
        `**${emojis.onlinestatus.online} Online**` :
        (new Date(osudata.last_visit)).getTime() != 0 ?
            `**${emojis.onlinestatus.offline} Offline** | Last online <t:${(new Date(osudata.last_visit)).getTime() / 1000}:R>`
            : `**${emojis.onlinestatus.offline} Offline**`
        ;

    const prevnames = osudata.previous_usernames.length > 0 ?
        '**Previous Usernames:** ' + osudata.previous_usernames.join(', ') :
        ''
        ;

    const playcount = osustats.play_count == null ?
        '---' :
        func.separateNum(osustats.play_count);

    const lvl = osustats.level.current != null ?
        osustats.level.progress != null && osustats.level.progress > 0 ?
            `${osustats.level.current}.${Math.floor(osustats.level.progress)}` :
            `${osustats.level.current}` :
        '---';

    let supporter = '';
    switch (osudata.support_level) {
        case 0:
            break;
        case 1: default:
            supporter = emojis.supporter.first;
            break;
        case 2:
            supporter = emojis.supporter.second;
            break;
        case 3:
            supporter = emojis.supporter.third;
            break;
    }

    const gradeCounts = input.config.useEmojis.scoreGrades ?
        `${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}` :
        `XH${grades.ssh} X}{grades.ss} SH${grades.sh} S}{grades.s} A}{grades.a}`;

    const osuEmbed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setColor(colours.embedColour.user.dec)
        .setTitle(`${osudata.username}'s ${mode ?? 'osu!'} profile`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`);

    let useEmbeds = [];
    const useFiles = [];

    async function getGraphs() {
        let chartplay;
        let chartrank;

        let nulltext = def.invisbleChar;

        if (
            (!osudata.monthly_playcounts ||
                osudata.monthly_playcounts.length == 0) ||
            (!osudata.rank_history ||
                osudata.rank_history.length == 0)) {
            nulltext = 'Error - Missing data';
            chartplay = def.images.any.url;
            chartrank = chartplay;
        } else {
            const dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',');
            const datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',');

            const play =
                await func.graph(dataplay, osudata.monthly_playcounts.map(x => x.count), 'Playcount', {
                    startzero: true,
                    fill: true,
                    displayLegend: true,
                    pointSize: 0,
                });
            const rank =
                await func.graph(datarank, osudata.rank_history.data, 'Rank', {
                    startzero: false,
                    fill: false,
                    displayLegend: true,
                    reverse: true,
                    pointSize: 0,
                });
            const fileplay = new Discord.AttachmentBuilder(`${play.path}`);
            const filerank = new Discord.AttachmentBuilder(`${rank.path}`);

            useFiles.push(fileplay, filerank);

            chartplay = `attachment://${play.filename}.jpg`;
            chartrank = `attachment://${rank.filename}.jpg`;
        }
        const ChartsEmbedRank = new Discord.EmbedBuilder()
            .setFooter({
                text: `${embedStyle}`
            })
            .setTitle(`${osudata.username}`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
            .setDescription(nulltext)
            .setImage(`${chartrank}`);

        const ChartsEmbedPlay = new Discord.EmbedBuilder()
            .setFooter({
                text: `${embedStyle}`
            })
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
            .setImage(`${chartplay}`);

        return [ChartsEmbedRank, ChartsEmbedPlay];
    }

    if (graphonly == true) {
        embedStyle = 'G';
        const graphembeds = await getGraphs();
        useEmbeds = graphembeds;
    } else {
        if (detailed == 2) {
            const loading = new Discord.EmbedBuilder()
                .setFooter({
                    text: `${embedStyle}`
                })
                .setColor(colours.embedColour.user.dec)
                .setTitle(`${osudata.username}'s ${mode ?? 'osu!'} profile`)
                .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
                .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
                .setDescription(`Loading...`);

            if (input.commandType != 'button') {
                if (input.commandType == 'interaction') {
                    setTimeout(() => {

                        (input.obj as Discord.ChatInputCommandInteraction).editReply({
                            embeds: [loading],
                            allowedMentions: { repliedUser: false },
                        })
                            .catch();
                    }, 1000);
                }
            }
            const graphembeds = await getGraphs();

            let osutopdataReq: osufunc.apiReturn;
            if (func.findFile(input.absoluteID, 'osutopdata') &&
                input.commandType == 'button' &&
                !('error' in func.findFile(input.absoluteID, 'osutopdata')) &&
                input.button != 'Refresh'
            ) {
                osutopdataReq = func.findFile(input.absoluteID, 'osutopdata');
            } else {
                osutopdataReq = await osufunc.apiget({
                    type: 'best',
                    config: input.config,
                    params: {
                        userid: osudata.id,
                        mode: mode,
                        opts: ['limit=100']
                    }
                });
            }

            const osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = osutopdataReq.apiData;
            if (osudataReq?.error) {
                await msgfunc.errorAndAbort(input, 'osu', true, errors.uErr.osu.scores.best.replace('[ID]', user), false);
                return;
            }
            osufunc.debug(osutopdataReq, 'command', 'osu', input.obj.guildId, 'osuTopData');

            if (osutopdata?.hasOwnProperty('error')) {
                await msgfunc.errorAndAbort(input, 'osu', true, errors.uErr.osu.scores.best.replace('[ID]', user), true);
                return;
            }

            //await osufunc.apiget('most_played', `${osudata.id}`)
            const mostplayeddataReq: osufunc.apiReturn = await osufunc.apiget({
                type: 'most_played',
                config: input.config,
                params: {
                    userid: osudata.id,
                }
            });
            const mostplayeddata: osuApiTypes.BeatmapPlaycount[] & osuApiTypes.Error = mostplayeddataReq.apiData;
            if (mostplayeddataReq?.error) {
                await msgfunc.errorAndAbort(input, 'osu', true, errors.uErr.osu.map.group_nf.replace('[TYPE]', 'most played'), false);
                return;
            }
            osufunc.debug(mostplayeddataReq, 'command', 'osu', input.obj.guildId, 'mostPlayedData');

            if (mostplayeddata?.hasOwnProperty('error')) {
                await msgfunc.errorAndAbort(input, 'osu', true, errors.uErr.osu.profile.mostplayed, true);
                return;
            }
            const secperplay = osudata?.statistics.play_time / parseFloat(playcount.replaceAll(',', ''));

            const combostats = osufunc.Stats(osutopdata.map(x => x?.max_combo ?? 0));
            const ppstats = osufunc.Stats(osutopdata.map(x => x?.pp ?? 0));
            const accstats = osufunc.Stats(osutopdata.map(x => (x?.accuracy * 100) ?? 100));

            let mostplaytxt = ``;
            for (let i2 = 0; i2 < mostplayeddata.length && i2 < 10; i2++) {
                const bmpc = mostplayeddata[i2];
                mostplaytxt += `\`${(bmpc.count.toString() + ' plays').padEnd(15, ' ')}\` | [${bmpc.beatmapset.title}[${bmpc.beatmap.version}]](https://osu.ppy.sh/b/${bmpc.beatmap_id})\n`;
            }

            const dailies = (osustats.play_count / (calc.convert('month', 'day', osudata.monthly_playcounts.length).outvalue)).toFixed(2);
            const monthlies =
                (osustats.play_count / osudata.monthly_playcounts.length).toFixed(2);
            // osudata.monthly_playcounts.map(x => x.count).reduce((a, b) => b + a)
            osuEmbed.addFields([
                {
                    name: 'Stats',
                    value:
                        `**Global Rank:**${rankglobal}${peakRank}
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}
**Total Play Time:** ${calc.secondsToTime(osudata?.statistics.play_time)} (${calc.secondsToTimeReadable(osudata?.statistics.play_time, true, false)})`,
                    inline: true
                },
                {
                    name: def.invisbleChar,
                    value:
                        `**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>                        
${gradeCounts}
**Medals**: ${osudata.user_achievements.length}
**Followers:** ${osudata.follower_count}
${prevnames}
${supporter} ${onlinestatus}
**Avg time per play:** ${calc.secondsToTime(secperplay)}
**Avg daily playcount:** ${dailies}
**Avg monthly playcount:** ${monthlies}
`,
                    inline: true
                }
            ]);
            osuEmbed.addFields([{
                name: 'Most Played Beatmaps',
                value: mostplaytxt != `` ? mostplaytxt : 'No data',
                inline: false
            }]
            );


            osuEmbed.addFields([
                {
                    name: 'Top play info',
                    value:
                        `**Most common mapper:** ${osufunc.modemappers(osutopdata)?.beatmapset?.creator ?? 'None'}
        **Most common mods:** ${osufunc.modemods(osutopdata)?.mods?.toString()?.replaceAll(',', '') ?? 'None'}
        **Gamemode:** ${mode}
        **Highest combo:** ${combostats.highest}`,
                    inline: true
                },
                {
                    name: def.invisbleChar,
                    value: `**Highest pp:** ${ppstats.highest?.toFixed(2)}
        **Lowest pp:** ${ppstats.lowest?.toFixed(2)}
        **Average pp:** ${ppstats.mean?.toFixed(2)}
        **Highest accuracy:** ${accstats.highest?.toFixed(2)}%
        **Lowest accuracy:** ${accstats.lowest?.toFixed(2)}%`,
                    inline: true
                }]);

            useEmbeds = [osuEmbed].concat(graphembeds);
        } else {
            osuEmbed.setDescription(`
**Global Rank:**${rankglobal}${peakRank}
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}
**Medals**: ${osudata.user_achievements.length}
${gradeCounts}
**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>
**Followers:** ${osudata.follower_count}
${prevnames}
**Total Play Time:** ${calc.secondsToTimeReadable(osudata?.statistics.play_time, true, false)}
${supporter} ${onlinestatus}
        `);
            useEmbeds = [osuEmbed];
        }
    }
    osufunc.writePreviousId('user', input.obj.guildId, { id: `${osudata.id}`, apiData: null, mods: null });


    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: useContent,
            embeds: useEmbeds,
            components: [buttons],
            files: useFiles,
            edit: true
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'osu',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'osu',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

export async function recent_activity(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;

    let user = 'SaberStrike';
    let searchid;
    let page = 1;
    let filter;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-p', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', filter, true);
                filter = temp.value;
                input.args = temp.newArgs;
            }

            input.args = msgfunc.cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null;
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.options.getString('user');
            page = input.obj.options.getInteger('page');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;

            user = input.obj.message.embeds[0].url.split('users/')[1].split('/')[0];
            page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]);

            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1;
                    break;
                case 'LeftArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1;
                    break;
                case 'RightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1;
                    break;
                case 'BigRightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n')[0]);
                    break;
            }
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = parseInt(`${input.overrides.page}`);
        }
    }
    //==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('recentactivity', commanduser, input.absoluteID);

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Refresh-recentactivity-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        );

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'recentactivity',
        options: [
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
                name: 'Filter',
                value: filter
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    if (page < 2 || typeof page != 'number') {
        page = 1;
    }
    page--;

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', 'osu') &&
        !('error' in func.findFile(user, 'osudata', 'osu')) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', 'osu');
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: 'osu'
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'recent_activity', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }

    osufunc.debug(osudataReq, 'command', 'recent_activity', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'recent_activity', true, errors.noUser(user), true);
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', 'osu');
    func.storeFile(osudataReq, user, 'osudata', 'osu');

    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata);
            osufunc.userStatsCache([osudata], input.statsCache, 'osu', 'User');
        } catch (error) {
            log.toOutput(error, input.config);
        }
    }
    buttons
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-User-recentactivity-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.user),
        );

    let recentActivityReq: osufunc.apiReturn;

    if (func.findFile(input.absoluteID, 'rsactdata') &&
        !('error' in func.findFile(input.absoluteID, 'rsactdata')) &&
        input.button != 'Refresh'
    ) {
        recentActivityReq = func.findFile(input.absoluteID, 'rsactdata');
    } else {
        recentActivityReq = await osufunc.apiget({
            type: 'user_recent_activity',
            config: input.config,
            params: {
                userid: osudata.id,
                opts: ['limit=100']
            }
        });
    }

    const rsactData: osuApiTypes.Event[] & osuApiTypes.Error = recentActivityReq.apiData;
    if (recentActivityReq?.error) {
        await msgfunc.errorAndAbort(input, 'recent_activity', true, errors.uErr.osu.rsact, false);
        return;
    }
    osufunc.debug(recentActivityReq, 'command', 'recent_activity', input.obj.guildId, 'rsactData');

    if (rsactData?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'recent_activity', true, errors.uErr.osu.profile.rsact, true);
        return;
    }

    func.storeFile(recentActivityReq, input.absoluteID, 'rsactData', 'osu');

    const pageLength = 10;

    if (page < 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);

    }
    if (page >= Math.ceil(rsactData.length / pageLength) - 1) {
        page = Math.ceil(rsactData.length / pageLength) - 1;
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);

    }

    const curEmbed = new Discord.EmbedBuilder()
        .setTitle(`Recent Activity for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osudata.playmode}#recent`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setDescription(`Page: ${page + 1}/${Math.ceil(rsactData.length / pageLength)}`)
        ;

    let actText = '';

    for (let i = 0; i < rsactData.length && i < pageLength; i++) {
        const curEv = rsactData[i + (page * pageLength)];
        if (!curEv) break;
        const obj = {
            number: `${i + (page * pageLength) + 1}`,
            desc: 'null',
        };
        switch (curEv.type) {
            case 'achievement': {
                const temp = curEv as osuApiTypes.EventAchievement;
                obj.desc = `Unlocked the **${temp.achievement.name}** medal! <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetApprove': {
                const temp = curEv as osuApiTypes.EventBeatmapsetApprove;
                obj.desc = `Approved **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapPlaycount': {
                const temp = curEv as osuApiTypes.EventBeatmapPlaycount;
                obj.desc =
                    `Achieved ${temp.count} plays on [\`${temp.beatmap.title}\`](https://osu.ppy.sh${temp.beatmap.url}) <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetDelete': {
                const temp = curEv as osuApiTypes.EventBeatmapsetDelete;
                obj.desc = `Deleted **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetRevive': {
                const temp = curEv as osuApiTypes.EventBeatmapsetRevive;
                obj.desc = `Revived **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetUpdate': {
                const temp = curEv as osuApiTypes.EventBeatmapsetUpdate;
                obj.desc = `Updated **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetUpload': {
                const temp = curEv as osuApiTypes.EventBeatmapsetUpload;
                obj.desc = `Submitted **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'rank': {
                const temp = (curEv as osuApiTypes.EventRank);
                obj.desc =
                    `Achieved rank **#${temp.rank}** on [\`${temp.beatmap.title}\`](https://osu.ppy.sh${temp.beatmap.url}) (${input.config.useEmojis.gamemodes ? emojis.gamemodes[temp.mode] : temp.mode}) <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            }
                break;
            case 'rankLost': {
                const temp = curEv as osuApiTypes.EventRankLost;
                obj.desc = `Lost #1 on **[\`${temp.beatmap.title}\`](https://osu.ppy.sh${temp.beatmap.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'userSupportAgain': {
                const temp = curEv as osuApiTypes.EventUserSupportAgain;
                obj.desc = `Purchased supporter <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'userSupportFirst': {
                const temp = curEv as osuApiTypes.EventUserSupportFirst;
                obj.desc = `Purchased supporter for the first time <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'userSupportGift': {
                const temp = curEv as osuApiTypes.EventUserSupportGift;
                obj.desc = `Was gifted supporter <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'usernameChange': {
                const temp = curEv as osuApiTypes.EventUsernameChange;
                obj.desc = `Changed their username from ${temp.user.previousUsername} to ${temp.user.username} <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`
                    ;
            } break;
        }
        actText += `**${obj.number})** ${obj.desc}\n\n`;
    }
    if (actText.length == 0) {
        actText = 'No recent activity found';
    }
    curEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(rsactData.length / pageLength)}

    
${actText}`);


    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [curEmbed],
            components: [pgbuttons, buttons],
            edit: true
        },
    }, input.canReply
    );

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'recent_activity',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'recent_activity',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

//scores

/**
 * list of #1 scores
 */
export async function firsts(input: extypes.commandInput & { statsCache: any; }) {


    const parseArgs = await msgfunc.parseArgs_scoreList(input);
    const commanduser: Discord.User = parseArgs.commanduser;

    let user = parseArgs.user;
    const searchid = parseArgs.searchid;
    let page = parseArgs.page ?? 0;

    const scoredetailed: number = parseArgs.scoredetailed ?? 1;

    const sort: embedStuff.scoreSort = parseArgs.sort ?? 'recent';
    const reverse = parseArgs.reverse ?? false;
    let mode = parseArgs.mode ?? 'osu';

    const filteredMapper = parseArgs.filteredMapper ?? null;
    const filteredMods = parseArgs.filteredMods ?? null;
    const filterTitle = parseArgs.filterTitle ?? null;
    const filterRank = parseArgs.filterRank ?? null;

    const parseScore = parseArgs.parseScore ?? false;
    const parseId = parseArgs.parseId ?? null;

    const exactMods = parseArgs.exactMods;

    const pp = parseArgs.pp;
    const score = parseArgs.score;
    const acc = parseArgs.acc;
    const combo = parseArgs.combo;
    const miss = parseArgs.miss;
    const bpm = parseArgs.bpm;

    let reachedMaxCount = false;
    let embedStyle: extypes.osuCmdStyle = 'L';

    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page;
        }
    }

    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'firsts',
        options: [
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
                name: 'Exact Mods',
                value: exactMods
            },
            {
                name: 'Detailed',
                value: scoredetailed
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            },
            {
                name: 'Rank',
                value: filterRank
            },
            {
                name: 'pp',
                value: pp
            },
            {
                name: 'Score',
                value: score
            },
            {
                name: 'Accuracy',
                value: acc
            },
            {
                name: 'Combo',
                value: combo
            },
            {
                name: 'Miss',
                value: miss
            },
            {
                name: 'BPM',
                value: bpm
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('firsts', commanduser, input.absoluteID);

    let buttons = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-Refresh-firsts-${commanduser.id}-${input.absoluteID}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.main.refresh),
    );

    const checkDetails = await msgfunc.buttonsAddDetails('firsts', commanduser, input.absoluteID, buttons, scoredetailed, embedStyle);
    buttons = checkDetails.buttons;
    embedStyle = checkDetails.embedStyle;

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser?.username ?? '';
    }

    mode = osufunc.modeValidator(mode);


    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode),
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'firsts', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }

    osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'firsts', true, errors.noUser(user), true);
        return;
    }

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-User-firsts-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.extras.user),
    );

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    let firstscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = [];
    async function getScoreCount(cinitnum) {
        if (cinitnum >= 499) {
            reachedMaxCount = true;
            return;
        }

        const fdReq: osufunc.apiReturn = await osufunc.apiget({
            type: 'firsts',
            config: input.config,
            params: {
                userid: `${osudata.id}`,
                opts: [`offset=${cinitnum}`, 'limit=100', `mode=${mode}`],
            },
            version: 2,

        });
        const fd: osuApiTypes.Score[] & osuApiTypes.Error = fdReq.apiData;
        if (fdReq?.error) {
            await msgfunc.errorAndAbort(input, 'firsts', true, errors.uErr.osu.scores.first.replace('[ID]', user), false);
            return;
        }
        if (fd?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'firsts', true, errors.uErr.osu.scores.first.replace('[ID]', user) + ` offset by ${cinitnum}`, true);
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }

            await firstscoresdata.push(fd[i]);
        }
        if (fd.length == 100) {
            await getScoreCount(cinitnum + 100);
        }
        return;
    }
    if (func.findFile(osudata.id, 'firstscoresdata') &&
        !('error' in func.findFile(osudata.id, 'firstscoresdata')) &&
        input.button != 'Refresh'
    ) {
        firstscoresdata = func.findFile(osudata.id, 'firstscoresdata');
    } else {
        await getScoreCount(0);
    }
    osufunc.debug(firstscoresdata, 'command', 'firsts', input.obj.guildId, 'firstsScoresData');
    func.storeFile(firstscoresdata, osudata.id, 'firstscoresdata');

    if (filterTitle) {
        firstscoresdata = firstscoresdata.filter((array) =>
            (
                array.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                array.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                array.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmap.version.toLowerCase().replaceAll(' ', ''))
        );
    }

    if (filterRank) {
        firstscoresdata = firstscoresdata.filter(x => x.rank == filterRank);
    }

    if (parseScore == true) {
        let pid = parseInt(parseId) - 1;
        if (pid < 0) {
            pid = 0;
        }
        if (pid > firstscoresdata.length) {
            pid = firstscoresdata.length - 1;
        }
        input.overrides = {
            mode: firstscoresdata?.[0]?.mode ?? 'osu',
            id: firstscoresdata?.[pid]?.best_id,
            commanduser,
            commandAs: input.commandType
        };
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await msgfunc.errorAndAbort(input, 'firsts', true, `${errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.commandType = 'other';
        await scoreparse(input);
        return;
    }

    const firstsEmbed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`#1 scores for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${firstscoresdata?.[0]?.mode ?? osufunc.modeValidator(mode)}#top_ranks`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        ;
    if (page >= Math.ceil(firstscoresdata.length / 5)) {
        page = Math.ceil(firstscoresdata.length / 5) - 1;
    }

    const scoresarg = await embedStuff.scoreList({
        scores: firstscoresdata,
        detailed: scoredetailed,
        showWeights: false,
        page: page,
        showMapTitle: true,
        showTruePosition: true,
        sort: sort,
        truePosType: 'recent',
        filteredMapper,
        filteredMods,
        filterMapTitle: filterTitle,
        filterRank,
        reverse,
        exactMods,
        pp,
        score,
        acc,
        combo,
        miss,
        bpm
    }, {
        useScoreMap: true
    }, input.config);
    firstsEmbed.setDescription(`${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${Math.ceil(scoresarg.maxPages)}\n${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode] : mode}\n${reachedMaxCount ? 'Only first 500 scores are shown' : ''}`);

    if (scoresarg.fields.length == 0) {
        firstsEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        switch (scoredetailed) {
            case 0: case 2: {
                let temptxt = '\n' + scoresarg.string.join('');
                firstsEmbed.setDescription(
                    `${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${scoresarg.maxPages}\n${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode] : mode}${reachedMaxCount ? '\nOnly first 500 scores are shown' : ''}`
                    + temptxt
                );
            }
                break;
            case 1: default: {
                firstsEmbed.addFields(scoresarg.fields);
            }
                break;
        }
    }

    if (scoresarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    osufunc.writePreviousId('user', input.obj.guildId, { id: `${osudata.id}`, apiData: null, mods: null });
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata);
        } catch (error) {
            log.toOutput(error, input.config);
        }
    }
    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [firstsEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'firsts',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'firsts',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * leaderboard of a map
 */
export async function maplb(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;

    let mapid;
    let mapmods;
    let page;
    let parseId = null;
    let parseScore = false;
    const embedStyle: extypes.osuCmdStyle = 'L';
    const scoredetailed: number = 1;

    let useContent: string = null;
    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;

            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-p', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true);
                parseId = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.join(' ').includes('+')) {
                mapmods = input.args.join(' ').split('+')[1];
                mapmods.includes(' ') ? mapmods = mapmods.split(' ')[0] : null;
                input.args = input.args.join(' ').replace('+', '').replace(mapmods, '').split(' ');
            }
            input.args = msgfunc.cleanArgs(input.args);

            mapid = (await osufunc.mapIdFromLink(input.args.join(' '), true, input.config)).map;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            mapid = input.obj.options.getInteger('id');
            page = input.obj.options.getInteger('page');
            mapmods = input.obj.options.getString('mods');
            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true;
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            mapid = input.obj.message.embeds[0].url.split('/b/')[1];
            if (input.obj.message.embeds[0].title.includes('+')) {
                mapmods = input.obj.message.embeds[0].title.split('+')[1];
            }
            page = 0;
            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1;
                    break;
                case 'LeftArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) - 1;
                    break;
                case 'RightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]) + 1;
                    break;
                case 'BigRightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[1].split('\n')[0]);
                    break;
                case 'Refresh':
                    page = parseInt((input.obj.message.embeds[0].description).split('/')[0].split(': ')[1]);
                    break;
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page;
        }
        if (input.overrides.id) {
            mapid = input.overrides.id;
        }
        if (input.overrides.filterMods) {
            mapmods = input.overrides.filterMods;
        }
        console.log(input.overrides.commandAs);
        if (input.overrides.commandAs) {
            input.commandType = input.overrides.commandAs;
        }
        if (input.overrides.commanduser) {
            commanduser = input.overrides.commanduser;
            useContent = `Requested by <@${commanduser.id}>`;
        }
    }
    //==============================================================================================================================================================================================

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Refresh-maplb-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        );
    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('maplb', commanduser, input.absoluteID);

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'maplb',
        options: [
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Mods',
                value: mapmods
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number') {
        page = 1;
    }
    page--;

    if (!mapid) {
        const temp = osufunc.getPreviousId('map', input.obj.guildId);
        mapid = temp.id;
    }
    if (mapid == false) {
        msgfunc.missingPrevID_map(input);
        return;
    }

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let mapdataReq: osufunc.apiReturn;
    if (func.findFile(mapid, 'mapdata') &&
        !('error' in func.findFile(mapid, 'mapdata')) &&
        input.button != 'Refresh'
    ) {
        mapdataReq = func.findFile(mapid, 'mapdata');
    } else {
        mapdataReq = await osufunc.apiget(
            {
                type: 'map',
                config: input.config,
                params: {
                    id: mapid
                }
            }
        );
    }
    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'maplb', true, errors.uErr.osu.map.m.replace('[ID]', mapid), false);
        return;
    }
    osufunc.debug(mapdataReq, 'command', 'maplb', input.obj.guildId, 'mapData');

    if (mapdata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'maplb', true, errors.uErr.osu.map.m.replace('[ID]', mapid), true);
        return;
    }

    func.storeFile(mapdataReq, mapid, 'mapdata');

    const fulltitle = osufunc.parseUnicodeStrings({
        title: mapdata.beatmapset.title,
        artist: mapdata.beatmapset.artist,
        title_unicode: mapdata.beatmapset.title_unicode,
        artist_unicode: mapdata.beatmapset.artist_unicode,
        ignore: {
            artist: false,
            title: false
        }
    }, 1) + ` [${mapdata.version}]`;

    let mods;
    if (mapmods) {
        mods = osumodcalc.OrderMods(mapmods) + '';
    }
    const lbEmbed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        });

    let lbdataReq: osufunc.apiReturn;
    if (mods == null) {
        if (func.findFile(input.absoluteID, 'lbdata') &&
            input.commandType == 'button' &&
            !('error' in func.findFile(input.absoluteID, 'lbdata')) &&
            input.button != 'Refresh'
        ) {
            lbdataReq = func.findFile(input.absoluteID, 'lbdata');
        } else {
            lbdataReq = await osufunc.apiget({
                type: 'scores_get_map',
                config: input.config,
                params: {
                    id: mapid,
                    mode: mapdata.mode,
                    opts: [`mods=${mapmods}`]
                }
            });
        }
        const lbdataf: osuApiTypes.BeatmapScores = lbdataReq.apiData;
        if (lbdataReq?.error) {
            await msgfunc.errorAndAbort(input, 'maplb', true, errors.uErr.osu.map.lb.replace('[ID]', mapid), false);
            return;
        }

        osufunc.debug(lbdataReq, 'command', 'maplb', input.obj.guildId, 'lbDataF');

        if (lbdataf?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'maplb', true, errors.uErr.osu.map.lb.replace('[ID]', mapid), true);
            return;
        }
        func.storeFile(lbdataReq, input.absoluteID, 'lbdata');

        const lbdata = lbdataf.scores;

        if (parseScore == true) {
            let pid = parseInt(parseId) - 1;
            if (pid < 0) {
                pid = 0;
            }
            if (pid > lbdata.length) {
                pid = lbdata.length - 1;
            }
            input.overrides = {
                mode: lbdata?.[0]?.mode ?? 'osu',
                id: lbdata?.[pid]?.best_id,
                commanduser,
                commandAs: input.commandType
            };
            if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
                await msgfunc.errorAndAbort(input, 'maplb', true, `${errors.uErr.osu.score.nf} at index ${pid}`, true);
                return;
            }
            input.commandType = 'other';
            await scoreparse(input);
            return;
        }

        lbEmbed
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Score leaderboard of \`${fulltitle}\``)
            .setURL(`https://osu.ppy.sh/b/${mapid}`)
            .setThumbnail(osufunc.getMapImages(mapdata.beatmapset_id).list2x)
            ;

        let scoretxt: string;
        if (lbdata.length < 1) {
            scoretxt = 'Error - no scores found ';
        }
        if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
            scoretxt = 'Error - map is unranked';
        }

        if (page >= Math.ceil(lbdata.length / 5)) {
            page = Math.ceil(lbdata.length / 5) - 1;
        }

        osufunc.debug(lbdataReq, 'command', 'maplb', input.obj.guildId, 'lbData');

        const scoresarg = await embedStuff.scoreList({
            scores: lbdata,
            detailed: 1,
            showWeights: false,
            page: page,
            showMapTitle: false,
            showTruePosition: false,
            sort: 'score',
            truePosType: 'score',
            filteredMapper: null,
            filteredMods: null,
            exactMods: null,
            filterMapTitle: null,
            filterRank: null,
            reverse: false,
            mapidOverride: mapdata.id,
            showUserName: true
        }, {
            useScoreMap: false,
            overrideMapLastDate: mapdata.last_updated
        }, input.config);

        if (scoresarg.fields.length == 0) {
            lbEmbed.addFields([{
                name: 'Error',
                value: 'No scores found',
                inline: false
            }]);
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);

        } else {
            lbEmbed.addFields(scoresarg.fields);
        }

        lbEmbed.setDescription(`Page: ${scoresarg.usedPage + 1}/${Math.ceil(scoresarg.maxPages)}`);

        if (scoresarg.isFirstPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }
        if (scoresarg.isLastPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }

        osufunc.writePreviousId('map', input.obj.guildId,
            {
                id: `${mapdata.id}`,
                apiData: null,
                mods: mapmods
            }
        );
    } else {
        if (func.findFile(input.absoluteID, 'lbdata') &&
            input.commandType == 'button' &&
            !('error' in func.findFile(input.absoluteID, 'lbdata')) &&
            input.button != 'Refresh'
        ) {
            lbdataReq = func.findFile(input.absoluteID, 'lbdata');
        } else {
            lbdataReq = await osufunc.apiget(
                {
                    type: 'scores_get_map',
                    config: input.config,
                    params: {
                        id: mapid,
                        mods: mods //function auto converts to id

                    },
                    version: 1
                }
            );
        }
        const lbdata = lbdataReq.apiData;
        if (lbdataReq?.error) {
            await msgfunc.errorAndAbort(input, 'maplb', true, errors.uErr.osu.map.lb.replace('[ID]', mapid), false);
            return;
        }
        osufunc.debug(lbdataReq, 'command', 'maplb', input.obj.guildId, 'lbDataO');

        if (lbdata?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'maplb', true, errors.uErr.osu.map.lb.replace('[ID]', mapid), true);
            return;
        }

        func.storeFile(lbdataReq, input.absoluteID, 'lbdata');

        if (parseScore == true) {
            let pid = parseInt(parseId) - 1;
            if (pid < 0) {
                pid = 0;
            }
            if (pid > lbdata.length) {
                pid = lbdata.length - 1;
            }
            input.overrides = {
                mode: lbdata?.[0]?.mode ?? 'osu',
                id: lbdata?.[pid]?.best_id,
                commanduser,
                commandAs: input.commandType
            };
            if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
                await msgfunc.errorAndAbort(input, 'maplb', true, `${errors.uErr.osu.score.nf} at index ${pid}`, true);
                return;
            }
            input.commandType = 'other';
            await scoreparse(input);
            return;
        }

        lbEmbed
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Modded score leaderboard of ${fulltitle} + ${mods}`)
            .setURL(`https://osu.ppy.sh/b/${mapid}`)
            .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`);

        let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`;

        for (let i = 0; i < (lbdata).length && i < 5; i++) {
            let hitlist;
            let acc;
            const score = lbdata[i + (page * 5)];
            if (!score) break;
            const mode = mapdata.mode;
            switch (mode) {
                case 'osu':
                    hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countmiss}`;
                    acc = osumodcalc.calcgrade(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy;
                    break;
                case 'taiko':
                    hitlist = `${score.count300}/${score.count100}/${score.countmiss}`;
                    acc = osumodcalc.calcgradeTaiko(parseInt(score.count300), parseInt(score.count100), parseInt(score.countmiss)).accuracy;
                    break;
                case 'fruits':
                    hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countkatu}/${score.countmiss}`;
                    acc = osumodcalc.calcgradeCatch(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countkatu), parseInt(score.countmiss)).accuracy;
                    break;
                case 'mania':
                    hitlist = `${score.countgeki}/${score.count300}/${score.countkatu}/${score.count100}/${score.count50}/${score.countmiss}`;
                    acc = osumodcalc.calcgradeMania(parseInt(score.countgeki), parseInt(score.count300), parseInt(score.countkatu), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy;
                    break;
            }
            scoretxt += `
**[Score #${i + (page * 5) + 1}](https://osu.ppy.sh/scores/${mode}/${score.score_id}) | [${score.username}](https://osu.ppy.sh/users/${score.user_id})**
Score set on ${score.date}
${(acc).toFixed(2)}% | ${score.rank} | ${score.pp}
${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.maxcombo}x/**${mapdata.max_combo}x**
${hitlist}
Has replay: ${score.replay_available == 1 ? '✅' : '❌'}
`;
        }
        if ((lbdata as any).length < 1 || scoretxt.length < 10) {
            scoretxt = 'Error - no scores found ';
        }
        if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
            scoretxt = 'Error - map is unranked';
        }
        lbEmbed.setDescription(`${scoretxt}`);

        osufunc.writePreviousId('map', input.obj.guildId,
            {
                id: `${mapdata.id}`,
                apiData: null,
                mods: mapmods
            }
        );

        if (page <= 0) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }

        if (page >= (lbdata.length / 5) - 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }
    }

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-Map-maplb-any-${input.absoluteID}-${mapid}${mapmods && mapmods != 'NM' ? '+' + mapmods : ''}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.extras.map)
    );

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: useContent,
            embeds: [lbEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'maplb',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'maplb',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * list of top plays
 */
export async function osutop(input: extypes.commandInput & { statsCache: any; }) {

    const parseArgs = await msgfunc.parseArgs_scoreList(input);
    const commanduser: Discord.User = parseArgs.commanduser;

    let user = parseArgs.user;
    const searchid = parseArgs.searchid;
    let page = parseArgs.page ?? 0;

    const scoredetailed: number = parseArgs.scoredetailed ?? 1;

    let sort: embedStuff.scoreSort = parseArgs.sort ?? 'pp';
    let reverse = parseArgs.reverse ?? false;
    let mode = parseArgs.mode ?? 'osu';
    let filteredMapper = parseArgs.filteredMapper ?? null;
    let filteredMods = parseArgs.filteredMods ?? null;
    const filterTitle = parseArgs.filterTitle ?? null;
    const filterRank = parseArgs.filterRank ?? null;

    const parseScore = parseArgs.parseScore ?? false;
    const parseId = parseArgs.parseId ?? null;

    const exactMods = parseArgs.exactMods;

    const pp = parseArgs.pp;
    const score = parseArgs.score;
    const acc = parseArgs.acc;
    const combo = parseArgs.combo;
    const miss = parseArgs.miss;
    const bpm = parseArgs.bpm;

    // let reachedMaxCount = false;

    let embedStyle: extypes.osuCmdStyle = 'L';
    let noMiss = false;


    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page;
        }
        if (input.overrides.sort != null) {
            sort = input.overrides.sort;
        }
        if (input.overrides.reverse != null) {
            reverse = input.overrides.reverse === true;
        }
        if (input.overrides.mode != null) {
            mode = input.overrides.mode;
        }
        if (input.overrides.filterMapper != null) {
            filteredMapper = input.overrides.filterMapper;
        }
        if (input.overrides.filterMods != null) {
            filteredMods = input.overrides.filterMods;
        }
        if (input.overrides.miss != null) {
            noMiss = true;
        }
    }

    //==============================================================================================================================================================================================


    const commandButtonName: 'osutop' | 'nochokes' =
        noMiss == true ? 'nochokes' : 'osutop';

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: commandButtonName,
        options: [
            {
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
                value: filteredMapper
            },
            {
                name: 'Mods',
                value: filteredMods
            },
            {
                name: 'Detailed',
                value: scoredetailed
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            },
            {
                name: 'No misses',
                value: noMiss
            },
            {
                name: 'Rank',
                value: filterRank
            },
            {
                name: 'Exact Mods',
                value: exactMods
            },
            {
                name: 'pp',
                value: pp
            },
            {
                name: 'Score',
                value: score
            },
            {
                name: 'Accuracy',
                value: acc
            },
            {
                name: 'Combo',
                value: combo
            },
            {
                name: 'Miss',
                value: miss
            },
            {
                name: 'BPM',
                value: bpm
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;

    let buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Refresh-${commandButtonName}-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        );

    const checkDetails = await msgfunc.buttonsAddDetails(commandButtonName, commanduser, input.absoluteID, buttons, scoredetailed, embedStyle);
    buttons = checkDetails.buttons;
    embedStyle = checkDetails.embedStyle;

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = osufunc.modeValidator(mode);

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons(commandButtonName, commanduser, input.absoluteID);


    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'osutop', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'osutop', true, errors.noUser(user), true);
        return;
    }

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-User-${commandButtonName}-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.extras.user),
    );

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    let osutopdataReq: osufunc.apiReturn;
    if (func.findFile(input.absoluteID, 'osutopdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'osutopdata')) &&
        input.button != 'Refresh'
    ) {
        osutopdataReq = func.findFile(input.absoluteID, 'osutopdata');
    } else {
        osutopdataReq = await osufunc.apiget({
            type: 'best',
            config: input.config,
            params: {
                userid: osudata.id,
                mode: osufunc.modeValidator(mode),
                opts: ['limit=100', 'offset=0']
            }
        });
    }

    let osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = osutopdataReq.apiData;
    if (osutopdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'osutop', true, errors.uErr.osu.scores.best.replace('[ID]', user), false);
        return;
    }

    osufunc.debug(osutopdataReq, 'command', 'osutop', input.obj.guildId, 'osuTopData');

    if (osutopdata?.hasOwnProperty('error') || !osutopdata[0]?.user?.username) {
        await msgfunc.errorAndAbort(input, 'osutop', true, `${errors.uErr.osu.scores.best
            .replace('[ID]', user)
            }`, true);
        return;
    }

    func.storeFile(osutopdataReq, input.absoluteID, 'osutopdata');

    let showtrue = false;
    if (sort != 'pp') {
        showtrue = true;
    }

    if (page >= Math.ceil(osutopdata.length / 5)) {
        page = Math.ceil(osutopdata.length / 5) - 1;
    }

    if (filterTitle) {
        osutopdata = osutopdata.filter((array) =>
            (
                array.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                array.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                array.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmap.version.toLowerCase().replaceAll(' ', ''))
        );
    }

    if (filterRank) {
        osutopdata = osutopdata.filter(x => x.rank == filterRank);
    }

    if (parseScore == true) {
        let pid = parseInt(parseId) - 1;
        if (pid < 0) {
            pid = 0;
        }
        if (pid > osutopdata.length) {
            pid = osutopdata.length - 1;
        }
        input.overrides = {
            mode: osutopdata?.[0]?.mode ?? 'osu',
            id: osutopdata?.[pid]?.best_id,
            commanduser,
            commandAs: input.commandType
        };
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await msgfunc.errorAndAbort(input, 'osutop', true, `${errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.commandType = 'other';

        await scoreparse(input);
        return;
    }

    const topEmbed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`${commandButtonName == 'osutop' ? 'Top' : 'Top no choke'} plays of ${osudata.username}`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osutopdata?.[0]?.mode ?? osufunc.modeValidator(mode)}#top_ranks`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        });

    if (commandButtonName == 'nochokes') {
        for (const score of osutopdata) {
            score.statistics.count_miss = 0;
            score.max_combo = score?.beatmap?.max_combo ?? null;
            score.pp = null;
            score.perfect = true;
        }
    }

    const scoresarg = await embedStuff.scoreList(
        {
            scores: osutopdata,
            detailed: scoredetailed,
            showWeights: true,
            page,
            showMapTitle: true,
            showTruePosition: showtrue,
            sort,
            truePosType: 'pp',
            filteredMapper,
            filteredMods,
            filterMapTitle: filterTitle,
            filterRank,
            reverse,
            exactMods,
            pp,
            score,
            acc,
            combo,
            miss,
            bpm
        },
        {
            useScoreMap: true
        }, input.config
    );
    topEmbed.setDescription(`${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${Math.ceil(scoresarg.maxPages)}\n${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode] : mode}`);
    if (scoresarg.fields.length == 0) {
        topEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        switch (scoredetailed) {
            case 0: case 2: {
                let temptxt = '\n' + scoresarg.string.join('');
                topEmbed.setDescription(
                    `${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${scoresarg.maxPages}\n${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode] : mode}`
                    + temptxt
                );
            }
                break;
            case 1: default: {
                topEmbed.addFields(scoresarg.fields);
            }
                break;
        }
    }

    osufunc.writePreviousId('user', input.obj.guildId, { id: `${osudata.id}`, apiData: null, mods: null });

    if (scoresarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata);
        } catch (error) {
            log.toOutput(error, input.config);
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [topEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: commandButtonName,
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: commandButtonName,
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * list of pinned scores
 */
export async function pinned(input: extypes.commandInput & { statsCache: any; }) {

    const parseArgs = await msgfunc.parseArgs_scoreList(input);
    const commanduser: Discord.User = parseArgs.commanduser;

    let user = parseArgs.user;
    const searchid = parseArgs.searchid;
    let page = parseArgs.page ?? 0;

    const scoredetailed: number = parseArgs.scoredetailed ?? 1;

    const sort: embedStuff.scoreSort = parseArgs.sort ?? 'recent';
    const reverse = parseArgs.reverse ?? false;
    let mode = parseArgs.mode ?? 'osu';

    const filteredMapper = parseArgs.filteredMapper ?? null;
    const filteredMods = parseArgs.filteredMods ?? null;
    const filterTitle = parseArgs.filterTitle ?? null;
    const filterRank = parseArgs.filterRank ?? null;

    const parseScore = parseArgs.parseScore ?? false;
    const parseId = parseArgs.parseId ?? null;

    const exactMods = parseArgs.exactMods;

    const pp = parseArgs.pp;
    const score = parseArgs.score;
    const acc = parseArgs.acc;
    const combo = parseArgs.combo;
    const miss = parseArgs.miss;
    const bpm = parseArgs.bpm;

    let reachedMaxCount = false;
    let embedStyle: extypes.osuCmdStyle = 'L';

    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = parseInt(`${input.overrides.page}`);
        }
    }

    //==============================================================================================================================================================================================

    let buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Refresh-pinned-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        );

    const checkDetails = await msgfunc.buttonsAddDetails('pinned', commanduser, input.absoluteID, buttons, scoredetailed, embedStyle);
    buttons = checkDetails.buttons;
    embedStyle = checkDetails.embedStyle;

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'pinned',
        options: [
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
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            },
            {
                name: 'Rank',
                value: filterRank
            },
            {
                name: 'Exact Mods',
                value: exactMods
            },
            {
                name: 'pp',
                value: pp
            },
            {
                name: 'Score',
                value: score
            },
            {
                name: 'Accuracy',
                value: acc
            },
            {
                name: 'Combo',
                value: combo
            },
            {
                name: 'Miss',
                value: miss
            },
            {
                name: 'BPM',
                value: bpm
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('pinned', commanduser, input.absoluteID);


    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = osufunc.modeValidator(mode);

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'pinned', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    osufunc.debug(osudataReq, 'command', 'pinned', input.obj.guildId, 'osuData');
    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'pinned', true, errors.noUser(user), true);
        return;
    }

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-User-pinned-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.extras.user),
    );

    let pinnedscoresdata: osuApiTypes.Score[] & osuApiTypes.Error = []; //= await osufunc.apiget('pinned', `${osudata.id}`, `${mode}`)
    async function getScoreCount(cinitnum) {
        if (cinitnum >= 499) {
            reachedMaxCount = true;
            return;
        }
        const fdReq: osufunc.apiReturn = await osufunc.apiget({
            type: 'pinned',
            config: input.config,
            params: {
                userid: `${osudata.id}`,
                opts: [`offset=${cinitnum}`, 'limit=100', `mode=${mode}`],
            },
            version: 2,
        });
        const fd: osuApiTypes.Score[] & osuApiTypes.Error = fdReq.apiData;
        if (fdReq?.error) {
            await msgfunc.errorAndAbort(input, 'pinned', true, errors.uErr.osu.scores.pinned.replace('[ID]', user), false);
            return;
        }
        if (fd?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'pinned', true, errors.uErr.osu.scores.pinned.replace('[ID]', user), true);
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }

            await pinnedscoresdata.push(fd[i]);
        }
        if (fd.length == 100) {
            await getScoreCount(cinitnum + 100);
        }

    }
    if (func.findFile(input.absoluteID, 'pinnedscoresdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'pinnedscoresdata')) &&
        input.button != 'Refresh'
    ) {
        pinnedscoresdata = func.findFile(input.absoluteID, 'pinnedscoresdata');
    } else {
        await getScoreCount(0);
    }
    osufunc.debug(pinnedscoresdata, 'command', 'pinned', input.obj.guildId, 'pinnedScoresData');
    func.storeFile(pinnedscoresdata, input.absoluteID, 'pinnedscoresdata');

    if (page >= Math.ceil(pinnedscoresdata.length / 5)) {
        page = Math.ceil(pinnedscoresdata.length / 5) - 1;
    }

    if (filterTitle) {
        pinnedscoresdata = pinnedscoresdata.filter((array) =>
            (
                array.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                array.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                array.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmap.version.toLowerCase().replaceAll(' ', ''))
        );
    }
    if (filterRank) {
        pinnedscoresdata = pinnedscoresdata.filter(x => x.rank == filterRank);
    }
    if (parseScore == true) {
        let pid = parseInt(parseId) - 1;
        if (pid < 0) {
            pid = 0;
        }
        if (pid > pinnedscoresdata.length) {
            pid = pinnedscoresdata.length - 1;
        }
        input.overrides = {
            mode: pinnedscoresdata?.[0]?.mode ?? 'osu',
            id: pinnedscoresdata?.[pid]?.best_id,
            commanduser,
            commandAs: input.commandType
        };
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await msgfunc.errorAndAbort(input, 'pinned', true, `${errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.commandType = 'other';
        await scoreparse(input);
        return;
    }

    const pinnedEmbed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`Pinned scores for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${pinnedscoresdata?.[0]?.mode ?? osufunc.modeValidator(mode)}#top_ranks`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        });

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
            filterMapTitle: filterTitle,
            filterRank,
            reverse: false,
            exactMods,
            pp,
            score,
            acc,
            combo,
            miss,
            bpm
        },
        {
            useScoreMap: true
        }, input.config);
    pinnedEmbed.setDescription(`${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${scoresarg.maxPages}\n${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode] : mode}\n${reachedMaxCount ? 'Only first 500 scores are shown' : ''}`);
    if (scoresarg.fields.length == 0) {
        pinnedEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        switch (scoredetailed) {
            case 0: case 2: {
                let temptxt = '\n' + scoresarg.string.join('');
                pinnedEmbed.setDescription(
                    `${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${scoresarg.maxPages}\n${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode] : mode}${reachedMaxCount ? '\nOnly first 500 scores are shown' : ''}`
                    + temptxt
                );
            }
                break;
            case 1: default: {
                for (let i = 0; i < scoresarg.fields.length; i++) {
                    pinnedEmbed.addFields([scoresarg.fields[i]]);
                }
            }
                break;
        }
    }
    if (scoresarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    osufunc.writePreviousId('user', input.obj.guildId, { id: `${osudata.id}`, apiData: null, mods: null });
    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata);
        } catch (error) {
            log.toOutput(error, input.config);
        }
    }


    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [pinnedEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'pinned',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'pinned',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * most recent score or list of recent scores
 */
export async function recent(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;

    let user;
    let searchid;
    let page = 0;
    let mode = null;
    let list = false;
    let sort: embedStuff.scoreSort = 'recent';
    let showFails = 1;
    let filterTitle = null;
    let filterRank: osuApiTypes.Rank = null;

    let exactMods = null;

    let pp = null;
    let score = null;
    let acc = null;
    let combo = null;
    let miss = null;
    let bpm = null;

    let embedStyle: extypes.osuCmdStyle = 'S';

    let scoredetailed = 1;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-list')) {
                list = true;
                input.args.splice(input.args.indexOf('-list'), 1);
            }
            if (input.args.includes('-l')) {
                list = true;
                input.args.splice(input.args.indexOf('-l'), 1);
            }
            if (input.args.includes('-passes=true')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-passes=true'), 1);
            }
            if (input.args.includes('-passes')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-passes=true'), 1);
            }
            if (input.args.includes('-pass')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-pass'), 1);
            }
            if (input.args.includes('-nofail')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-nofail'), 1);
            }
            if (input.args.includes('-nf')) {
                showFails = 0;
                input.args.splice(input.args.indexOf('-nf'), 1);
            }

            const temp = await msgfunc.parseArgs_scoreList_message(input);

            page = temp.page;
            mode = temp.mode;
            sort = temp.sort;
            filterTitle = temp.filterTitle;
            scoredetailed = temp.scoredetailed;
            filterRank = temp.filterRank;

            exactMods = temp.exactMods;

            pp = temp.pp;
            score = temp.score;
            acc = temp.acc;
            combo = temp.combo;
            miss = temp.miss;
            bpm = temp.bpm;

            input.args = msgfunc.cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.options.getString('user');
            page = input.obj.options.getNumber('page');
            mode = input.obj.options.getString('mode');
            list = input.obj.options.getBoolean('list');

            filterTitle = input.obj.options.getString('filter');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = (input.obj.message as Discord.Message).embeds[0].author.url.split('u/')[1];
            //title.split('for ')[1]
            const modething = input.obj.message.embeds[0].footer ? input.obj.message.embeds[0].description.split('\n')[1] : input.obj.message.embeds[0].description.split(' | ')[1].split('\n')[0];
            switch (true) {
                case modething.includes('osu'): {
                    mode = 'osu';
                }
                    break;
                case modething.includes('taiko'): {
                    mode = 'taiko';
                }
                    break;
                case modething.includes('fruits'): {
                    mode = 'fruits';
                }
                    break;
                case modething.includes('mania'): {
                    mode = 'mania';
                }
            }

            if (input.obj.message.embeds[0].title.includes('Best')) {
                sort = 'pp';
            }

            page = 0;
            if (input.button == 'BigLeftArrow') {
                page = 1;
            }
            if (input.obj.message.embeds[0].footer.text.includes('L')) {
                switch (input.button) {
                    case 'LeftArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1;
                        break;
                    case 'RightArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1;
                        break;
                    case 'BigRightArrow':
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n')[0]);
                        break;
                    default:
                        page = parseInt((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]);
                        break;
                }
                list = true;
                if (isNaN(+(input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) || ((input.obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) == 'NaN') {
                    page = 1;
                }
            } else {
                switch (input.button) {
                    case 'LeftArrow':
                        page = parseInt((input.obj.message.embeds[0].title).split(' ')[0].split('#')[1]) - 1;
                        break;
                    case 'RightArrow':
                        page = parseInt((input.obj.message.embeds[0].title).split(' ')[0].split('#')[1]) + 1;
                        break;
                    default:
                        page = parseInt((input.obj.message.embeds[0].title).split(' ')[0].split('#')[1]);
                        break;
                }
                if (page < 2) {
                    page == 1;
                }
            }
            switch (input.button) {
                case 'Detail0':
                    scoredetailed = 0;
                    break;
                case 'Detail1':
                    scoredetailed = 1;

                    break;
                case 'Detail2':
                    scoredetailed = 2;
                    break;
                default:
                    if (input.obj.message.embeds[0].footer.text.includes('E')) {
                        scoredetailed = 2;
                    }
                    if (input.obj.message.embeds[0].footer.text.includes('C')) {
                        scoredetailed = 0;
                    }
                    break;
            }

            if (input.obj.message.embeds[0].title.includes('passes')) {
                showFails = 0;
            } else {
                showFails = 1;
            }

            if (input.obj.message.embeds[0].description.includes('Filter:')) {
                filterTitle = input.obj.message.embeds[0].description.split('Filter: ')[1].split('\n')[0];
            }
            if (input.obj.message.embeds[0].description.includes('Filter by rank:')) {
                filterRank = osumodcalc.checkGrade(input.obj.message.embeds[0].description.split('Filter by rank: ')[1].split('\n')[0]);
            }

        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = parseInt(`${input.overrides.page}`);
        }
        if (input.overrides.type != null) {
            if (input.overrides.type == 'list') {
                list = true;
            }
            if (input.overrides.type == 'listtaiko') {
                list = true;
                mode = 'taiko';
            }
            if (input.overrides.type == 'listfruits') {
                list = true;
                mode = 'fruits';
            }
            if (input.overrides.type == 'listmania') {
                list = true;
                mode = 'mania';
            }
        }
        if (input?.overrides?.sort != null) {
            sort = input?.overrides?.sort ?? 'recent';
        }
        if (input.overrides.mode != null) {
            mode = input.overrides.mode;
        }
    }

    //==============================================================================================================================================================================================
    let buttons = new Discord.ActionRowBuilder();
    if (scoredetailed != 1) {
        buttons
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-Refresh-recent-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.refresh),
            );
    }

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'recent',
        options: [
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
                name: 'Mode',
                value: mode
            },
            {
                name: 'List',
                value: list
            },
            {
                name: 'Filter',
                value: filterTitle
            },
            {
                name: 'Detailed',
                value: scoredetailed
            },
            {
                name: 'Rank',
                value: filterRank
            },
            {
                name: 'Exact Mods',
                value: exactMods
            },
            {
                name: 'pp',
                value: pp
            },
            {
                name: 'Score',
                value: score
            },
            {
                name: 'Accuracy',
                value: acc
            },
            {
                name: 'Combo',
                value: combo
            },
            {
                name: 'Miss',
                value: miss
            },
            {
                name: 'BPM',
                value: bpm
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = osufunc.modeValidator(mode);

    if (page < 2 || typeof page != 'number') {
        page = 1;
    }
    page--;

    if (list) {
        embedStyle = embedStyle.replace('S', 'L') as extypes.osuCmdStyle;
    }

    const checkDetails = await msgfunc.buttonsAddDetails('recent', commanduser, input.absoluteID, buttons, scoredetailed, embedStyle, {
        compact: true,
        compact_rem: true,
        detailed: true,
        detailed_rem: true
    });
    buttons = checkDetails.buttons;
    embedStyle = checkDetails.embedStyle;

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('recent', commanduser, input.absoluteID);


    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'recent', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    osufunc.debug(osudataReq, 'command', 'recent', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'recent', true, errors.noUser(user), true);
        return;
    }

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-User-recent-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.extras.user),
    );

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let rsdataReq: osufunc.apiReturn;
    if (func.findFile(input.absoluteID, 'rsdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'rsdata')) &&
        input.button != 'Refresh'
    ) {
        rsdataReq = func.findFile(input.absoluteID, 'rsdata');
    } else {
        rsdataReq = await osufunc.apiget({
            type: 'recent',
            config: input.config,
            params: {
                userid: osudata.id,
                mode,
                opts: [`include_fails=${showFails}`, 'offset=0', 'limit=100']
            }
        });
    }

    let rsdata: osuApiTypes.Score[] & osuApiTypes.Error = rsdataReq.apiData;
    if (rsdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'recent', true, errors.uErr.osu.scores.recent.replace('[ID]', user), false);
        return;
    }
    osufunc.debug(rsdataReq, 'command', 'recent', input.obj.guildId, 'rsData');
    if (rsdata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'recent', true, errors.uErr.osu.scores.recent.replace('[ID]', user), true);
        return;
    }

    func.storeFile(rsdataReq, input.absoluteID, 'rsdata');

    if (filterTitle) {
        rsdata = rsdata.filter((array) =>
            (
                array.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                array.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                array.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            array.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.title.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
            ||
            filterTitle.toLowerCase().replaceAll(' ', '').includes(array.beatmap.version.toLowerCase().replaceAll(' ', ''))
        );
    }

    if (filterRank) {
        rsdata = rsdata.filter(x => x.rank == filterRank);
    }

    const rsEmbed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        });

    let useComponents = [pgbuttons, buttons];
    const useFiles = [];

    if (list != true) {
        rsEmbed.setColor(colours.embedColour.score.dec);

        page = rsdata[page] ? page : 0;

        if (input.button == 'BigRightArrow') {
            page = rsdata.length - 1;
        }

        const curscore = rsdata[0 + page];
        if (!curscore || curscore == undefined || curscore == null) {
            let err = `${errors.uErr.osu.scores.recent_ms
                .replace('[ID]', user)
                .replace('[MODE]', input.config.useEmojis.gamemodes ? emojis.gamemodes[osufunc.modeValidator(mode)] : mode)
                }`;
            if (filterTitle) {
                err = `${errors.uErr.osu.scores.recent_ms
                    .replace('[ID]', user)
                    .replace('[MODE]', input.config.useEmojis.gamemodes ? emojis.gamemodes[osufunc.modeValidator(mode)] : mode)
                    } matching \`${filterTitle}\``;
            }

            if (input.button == null) {
                await msgfunc.sendMessage({
                    commandType: input.commandType,
                    obj: input.obj,
                    args: {
                        content: err,
                        edit: true
                    }
                }, input.canReply);
            }
            return;
        }

        if (curscore.replay) {
            curscore.replay;
        }

        const curbm = curscore.beatmap;
        const curbms = curscore.beatmapset;

        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Map-recent-any-${input.absoluteID}-${curscore.beatmap.id}${curscore.mods ? '+' + curscore.mods.join() : ''}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.map),
        );

        let mapdataReq: osufunc.apiReturn;
        if (func.findFile(curbm.id, 'mapdata') &&
            !('error' in func.findFile(curbm.id, 'mapdata')) &&
            input.button != 'Refresh'
        ) {
            mapdataReq = func.findFile(curbm.id, 'mapdata');
        } else {
            mapdataReq = await osufunc.apiget({
                type: 'map',
                config: input.config,
                params: {
                    id: curbm.id
                }
            });
        }
        const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;
        if (mapdataReq?.error) {
            await msgfunc.errorAndAbort(input, 'recent', true, errors.uErr.osu.map.m.replace('[ID]', `${curbm.id}`), false);
            return;
        }
        osufunc.debug(mapdataReq, 'command', 'recent', input.obj.guildId, 'mapData');
        if (mapdata?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'recent', true, errors.uErr.osu.map.m.replace('[ID]', curbm.id.toString()), true);
            return;
        }

        func.storeFile(mapdataReq, curbm.id, 'mapdata');
        let accgr;
        let fcaccgr;
        const gamehits = curscore.statistics;
        switch (rsdata[0].mode) {
            case 'osu': default:
                accgr =
                    osumodcalc.calcgrade(
                        gamehits.count_300,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_miss
                    );
                fcaccgr =
                    osumodcalc.calcgrade(
                        gamehits.count_300 + gamehits.count_miss,
                        gamehits.count_100,
                        gamehits.count_50,
                        0
                    );
                break;
            case 'taiko':
                accgr =
                    osumodcalc.calcgradeTaiko(
                        gamehits.count_300,
                        gamehits.count_100,
                        gamehits.count_miss
                    );
                fcaccgr =
                    osumodcalc.calcgradeTaiko(
                        gamehits.count_300 + gamehits.count_miss,
                        gamehits.count_100,
                        0
                    );
                break;
            case 'fruits':
                accgr =
                    osumodcalc.calcgradeCatch(
                        gamehits.count_300,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_katu,
                        gamehits.count_miss
                    );
                fcaccgr =
                    osumodcalc.calcgradeCatch(
                        gamehits.count_300 + gamehits.count_miss,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_katu,
                        0
                    );
                break;
            case 'mania':
                accgr =
                    osumodcalc.calcgradeMania(
                        gamehits.count_geki,
                        gamehits.count_300,
                        gamehits.count_katu,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_miss
                    );
                fcaccgr =
                    osumodcalc.calcgradeMania(
                        gamehits.count_geki,
                        gamehits.count_300 + gamehits.count_miss,
                        gamehits.count_katu,
                        gamehits.count_100,
                        gamehits.count_50,
                        0
                    );
                break;
        }
        let rspassinfo = '';
        let totalhits;

        switch (rsdata[0].mode) {
            case 'osu': default:
                totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_50 + gamehits.count_miss;
                break;
            case 'taiko':
                totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_miss;
                break;
            case 'fruits':
                totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_50 + gamehits.count_katu + gamehits.count_miss;
                break;
            case 'mania':
                totalhits = gamehits.count_geki + gamehits.count_300 + gamehits.count_katu + gamehits.count_100 + gamehits.count_50 + gamehits.count_miss;
        }
        let totaldiff: string;
        let hitlist: string;

        const getHits = osufunc.returnHits(gamehits, curscore.mode);

        switch (scoredetailed) {
            default: {
                hitlist = getHits.short;
            }
                break;
            case 2: {
                hitlist = getHits.long;
            }
                break;
        }

        let rspp: string | number = 0;
        let ppissue: string = '';
        let ppcalcing: PerformanceAttributes[];
        let fcflag = '';
        try {
            ppcalcing = await osufunc.scorecalc({
                mods: curscore.mods.join('').length > 1 ?
                    curscore.mods.join('') : 'NM',
                gamemode: curscore.mode,
                mapid: curscore.beatmap.id,
                miss: gamehits.count_miss,
                acc: curscore.accuracy,
                maxcombo: curscore.max_combo,
                score: curscore.score,
                calctype: 0,
                passedObj: embedStuff.getTotalHits(curscore.mode, curscore),
            }, new Date(curscore.beatmap.last_updated), input.config);

            totaldiff = ppcalcing[1].difficulty.stars.toFixed(2);

            rspp =
                curscore.pp ?
                    curscore.pp.toFixed(2) :
                    ppcalcing[0].pp.toFixed(2);
            osufunc.debug(ppcalcing, 'command', 'recent', input.obj.guildId, 'ppCalcing');

            const mxCombo = ppcalcing[0].difficulty.maxCombo ?? mapdata?.max_combo;

            if (curscore.accuracy < 1 && curscore.max_combo == mxCombo) {
                fcflag = `FC\n**${ppcalcing[2].pp.toFixed(2)}**pp IF SS`;
            }
            if (curscore.max_combo != mxCombo) {
                fcflag =
                    `\n**${ppcalcing[1].pp.toFixed(2)}**pp IF ${fcaccgr.accuracy.toFixed(2)}% FC
                **${ppcalcing[2].pp.toFixed(2)}**pp IF SS`;
            }
            if (curscore.max_combo == mxCombo && curscore.accuracy == 1) {
                fcflag = 'FC';
            }

        } catch (error) {
            rspp =
                curscore.pp ?
                    curscore.pp.toFixed(2) :
                    NaN;
            ppissue = errors.uErr.osu.performance.crash;
            log.toOutput(error, input.config);
        }

        const curbmhitobj = mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners;
        let msToFail: number, curbmpasstime: number, guesspasspercentage: number;
        if (curscore.rank.toUpperCase() == 'F') {
            msToFail = await osufunc.getFailPoint(totalhits, `${path}/files/maps/${curbm.id}.osu`, input.config);
            curbmpasstime = Math.floor(msToFail / 1000);
            guesspasspercentage = Math.abs((totalhits / curbmhitobj) * 100);
        }

        // let showFailGraph = false;
        // let FailGraph = '';

        let rsgrade;
        rsgrade = input.config.useEmojis.scoreGrades ? emojis.grades[curscore.rank.toUpperCase()] : curscore.rank.toUpperCase();
        if (curscore.rank.toUpperCase() == 'F') {
            rspassinfo = `${guesspasspercentage.toFixed(2)}% completed (${calc.secondsToTime(curbmpasstime)}/${calc.secondsToTime(curbm.total_length)})`;
            rsgrade =
                input.config.useEmojis.scoreGrades ?
                    emojis.grades.F + `(${emojis.grades[osumodcalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_miss).grade]} if pass)` :
                    `F (${osumodcalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_miss).grade})`;
        }

        const fulltitle = `${osufunc.parseUnicodeStrings({
            title: mapdata.beatmapset.title,
            artist: mapdata.beatmapset.artist,
            title_unicode: mapdata.beatmapset.title_unicode,
            artist_unicode: mapdata.beatmapset.artist_unicode,
            ignore: {
                artist: false,
                title: false
            }
        }, 1)} [${curbm.version}]`;
        let trycount = 1;
        for (let i = rsdata.length - 1; i > (page); i--) {
            if (curbm.id == rsdata[i].beatmap.id) {
                trycount++;
            }
        }
        const trycountstr = `try #${trycount}`;
        const mxcombo =
            ppcalcing[0].difficulty.maxCombo;
        mapdata.max_combo;
        rsEmbed
            .setTitle(`#${page + 1} most recent ${showFails == 1 ? 'play' : 'pass'} for ${curscore.user.username} | <t:${new Date(curscore.created_at).getTime() / 1000}:R>`)
            .setURL(`https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id}`)
            .setAuthor({
                name: `${trycountstr} | #${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/users/${osudata.id}`,
                iconURL: `${osudata?.avatar_url ?? def.images.any.url}`
            })
            .setThumbnail(`${curbms.covers.list}`);
        switch (scoredetailed) {
            case 0: {
                rsEmbed
                    .setDescription(`
[\`${fulltitle}\`](https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods.length > 0 ? '+' + osumodcalc.OrderMods(curscore.mods.join('').toUpperCase()) : ''} 
${totaldiff}⭐ | ${input.config.useEmojis.gamemodes ? emojis.gamemodes[curscore.mode] : curscore.mode}
<t:${Math.floor(new Date(curscore.created_at).getTime() / 1000)}:F>
${filterTitle ? `Filter: ${filterTitle}\n` : ''}${filterRank ? `Filter by rank: ${filterRank}\n` : ''}${func.separateNum(curscore.score)} | ${(curscore.accuracy * 100).toFixed(2)}% | ${rsgrade}${curscore.replay ? ` | [REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}
${rspassinfo.length > 1 ? rspassinfo + '\n' : ''}\`${hitlist}\` | ${curscore.max_combo == mxcombo ? `**${curscore.max_combo}x**` : `${curscore.max_combo}x`}/**${mxcombo}x** combo
**${rspp}**pp ${fcflag}\n${ppissue}
`);
            }
                break;
            case 1: default: {
                rsEmbed
                    .setDescription(`
[\`${fulltitle}\`](https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods.length > 0 ? '+' + osumodcalc.OrderMods(curscore.mods.join('').toUpperCase()) : ''} 
${totaldiff}⭐ | ${input.config.useEmojis.gamemodes ? emojis.gamemodes[curscore.mode] : curscore.mode}
<t:${Math.floor(new Date(curscore.created_at).getTime() / 1000)}:F>
${filterTitle ? `Filter: ${filterTitle}\n` : ''}${filterRank ? `Filter by rank: ${filterRank}\n` : ''}
`)
                    .addFields([
                        {
                            name: 'SCORE DETAILS',
                            value: `${func.separateNum(curscore.score)}\n${(curscore.accuracy * 100).toFixed(2)}% | ${rsgrade}\n ${curscore.replay ? `[REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)\n` : ''}` +
                                `${rspassinfo.length > 1 ? rspassinfo + '\n' : ''}\`${hitlist}\`\n${curscore.max_combo == mxcombo ? `**${curscore.max_combo}x**` : `${curscore.max_combo}x`}/**${mxcombo}x** combo`,
                            inline: true
                        },
                        {
                            name: 'PP',
                            value: `**${rspp}**pp ${fcflag}\n${ppissue}`,
                            inline: true
                        }
                    ]);
            }
                break;
            case 2: {
                const newValues = osumodcalc.calcValues(
                    mapdata.cs, mapdata.ar, mapdata.accuracy, mapdata.drain,
                    mapdata.bpm, mapdata.hit_length,
                    curscore.mods.join('')
                );
                const csStr = mapdata.cs == newValues.cs ?
                    `CS${mapdata.cs}` :
                    `CS${mapdata.cs}=>${newValues.cs}`;
                const arStr = mapdata.ar == newValues.ar ?
                    `AR${mapdata.ar}` :
                    `AR${mapdata.ar}=>${newValues.ar}`;
                const odStr = mapdata.accuracy == newValues.od ?
                    `OD${mapdata.accuracy}` :
                    `OD${mapdata.accuracy}=>${newValues.od}`;
                const hpStr = mapdata.drain == newValues.hp ?
                    `HP${mapdata.drain}` :
                    `HP${mapdata.drain}=>${newValues.hp}`;
                const bpmStr = mapdata.bpm == newValues.bpm ?
                    `${emojis.mapobjs.bpm}${mapdata.bpm}` :
                    `${emojis.mapobjs.bpm}${mapdata.bpm}=>${newValues.bpm}`;
                const lenStr = mapdata.hit_length == newValues.length ?
                    `${emojis.mapobjs.total_length}${calc.secondsToTime(mapdata.hit_length)}` :
                    `${emojis.mapobjs.total_length}${calc.secondsToTime(mapdata.hit_length)}=>${calc.secondsToTime(newValues.length)}`;
                const srStr = mapdata.difficulty_rating.toFixed(2) == (ppcalcing[0]?.difficulty?.stars.toFixed(2) ?? mapdata.difficulty_rating.toFixed(2)) ?
                    `${mapdata.difficulty_rating.toFixed(2)}⭐` :
                    `⭐${mapdata.difficulty_rating.toFixed(2)}=>${ppcalcing[0]?.difficulty?.stars?.toFixed(2)}`;


                rsEmbed
                    .setDescription(`
[\`${fulltitle}\`](https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods.length > 0 ? '+' + osumodcalc.OrderMods(curscore.mods.join('').toUpperCase()) : ''} 
${totaldiff}⭐ | ${input.config.useEmojis.gamemodes ? emojis.gamemodes[curscore.mode] : curscore.mode}
<t:${Math.floor(new Date(curscore.created_at).getTime() / 1000)}:F>
${filterTitle ? `Filter: ${filterTitle}\n` : ''}${filterRank ? `Filter by rank: ${filterRank}\n` : ''}`)
                    .addFields([
                        {
                            name: 'SCORE DETAILS',
                            value: `${func.separateNum(curscore.score)}\n${(curscore.accuracy * 100).toFixed(2)}% | ${rsgrade}\n ${curscore.replay ? `[REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)\n` : ''}` +
                                `${rspassinfo.length > 1 ? rspassinfo + '\n' : ''}${hitlist}\n${curscore.max_combo == mxcombo ? `**${curscore.max_combo}x**` : `${curscore.max_combo}x`}/**${mxcombo}x** combo`,
                            inline: true
                        },
                        {
                            name: 'PP',
                            value: `**${rspp}**pp ${fcflag}\n${ppissue}`,
                            inline: true
                        },
                        {
                            name: def.invisbleChar,
                            value: def.invisbleChar,
                            inline: true
                        },
                        {
                            name: 'Map details',
                            value: //CS AR OD HP SR
                                `
${csStr} 
${arStr} 
${odStr} 
${hpStr}
`,
                            inline: true
                        },
                        {
                            name: def.invisbleChar,
                            value: //CS AR OD HP SR
                                `
${bpmStr}
${lenStr} 
${srStr}
`,
                            inline: true
                        }
                    ]);
            }
                break;
        }

        //if first page, disable previous button
        if (page == 0) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        } else {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(false);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(false);
        }

        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);

        //if last page, disable next button
        if (page >= rsdata.length - 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        } else {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(false);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(false);
        }


        osufunc.writePreviousId('map', input.obj.guildId,
            {
                id: `${curbm.id}`,
                apiData: null,
                mods: curscore.mods.join()
            });
        osufunc.writePreviousId('score', input.obj.guildId,
            {
                id: `${curscore.id}`,
                apiData: curscore,
                mods: curscore.mods.join()
            });
        osufunc.writePreviousId('user', input.obj.guildId, { id: `${osudata.id}`, apiData: null, mods: null });

        if (buttons.toJSON().components.length >= 5) {
            const xsbuttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${mainconst.version}-Scores-recent-any-${input.absoluteID}-${curbm.id}+${osudata.id}`)
                        .setStyle(buttonsthing.type.current)
                        .setEmoji(buttonsthing.label.extras.leaderboard),
                );
            useComponents = [pgbuttons, buttons, xsbuttons];
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-Scores-recent-any-${input.absoluteID}-${curbm.id}+${osudata.id}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.extras.leaderboard),
            );
            useComponents = [pgbuttons, buttons];
        }

    } else if (list == true) {
        rsEmbed
            .setColor(colours.embedColour.scorelist.dec)
            .setTitle(`Recent ${showFails == 1 ? 'plays' : 'passes'} for ${osudata.username}`)
            .setThumbnail(`${osudata.avatar_url ?? def.images.any.url}`)
            ;
        if (sort == 'pp') {
            rsEmbed.setTitle(`Best recent ${showFails == 1 ? 'plays' : 'passes'} for ${osudata.username}`);
        }

        const scoresarg = await embedStuff.scoreList(
            {
                scores: rsdata,
                detailed: scoredetailed,
                showWeights: false,
                page,
                showMapTitle: true,
                showTruePosition: (sort != 'recent'),
                sort,
                truePosType: 'recent',
                filteredMapper: null,
                filteredMods: null,
                filterMapTitle: filterTitle,
                filterRank,
                reverse: false,
                exactMods,
                pp,
                score,
                acc,
                combo,
                miss,
                bpm
            },
            {
                useScoreMap: true
            }, input.config);
        if (scoresarg.fields.length == 0) {
            rsEmbed.addFields([{
                name: 'Error',
                value: 'No scores found',
                inline: false
            }]);
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        } else {
            switch (scoredetailed) {
                case 0: case 2: {
                    let txt = `${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${scoresarg.maxPages}
                    ${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode] : mode}` + scoresarg.string.join('');
                    rsEmbed.setDescription(txt);
                }
                    break;
                case 1: default: {
                    rsEmbed.setDescription(`${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${scoresarg.maxPages}
                    ${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode] : mode}
                    `);
                    rsEmbed.addFields(scoresarg.fields);
                }
                    break;
            }
        }
        if (scoresarg.isFirstPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }
        if (scoresarg.isLastPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }
    }
    osufunc.writePreviousId('user', input.obj.guildId, { id: `${osudata.id}`, apiData: null, mods: null });

    if (input.commandType != 'button' || input.button == 'Refresh') {
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, input.userdata);
        } catch (error) {
            log.toOutput(error, input.config);
        }
    }

    rsEmbed.setFooter({ text: `${embedStyle}` });

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [rsEmbed],
            components: useComponents,
            edit: true
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'recent',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'recent',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * parse replay file and return data
 */
export async function replayparse(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let replay: extypes.replay;

    const embedStyle: extypes.osuCmdStyle = 'S';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
        } break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'replay parse',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    try {
        replay = replayparser.parseReplay(`${filespath}/replays/${input.absoluteID}.osr`);
    } catch (err) {
        log.logCommand(
            {
                commandName: 'replayparse',
                event: 'Error',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                customString: 'Could not parse replay\n' + err,
                config: input.config
            }
        );
        return;
    }
    osufunc.debug(replay, 'fileparse', 'replay', input.obj.guildId, 'replayData');

    let mapdataReq: osufunc.apiReturn;

    if (func.findFile(replay.beatmapMD5, `mapdata`) &&

        !('error' in func.findFile(replay.beatmapMD5, `mapdata`)) &&
        input.button != 'Refresh') {
        mapdataReq = func.findFile(replay.beatmapMD5, `mapdata`);
    } else {
        mapdataReq = await osufunc.apiget(
            {
                type: 'map_get_md5',
                config: input.config,
                params: {
                    md5: replay.beatmapMD5
                }
            });
    }
    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'replayparse', true, errors.uErr.osu.map.ms_md5.replace('[ID]', replay.beatmapMD5), false);
        return;
    }
    func.storeFile(mapdataReq, replay.beatmapMD5, 'mapdata');

    osufunc.debug(mapdataReq, 'fileparse', 'replay', input.obj.guildId, 'mapData');
    if (mapdata?.id) {
        typeof mapdata.id == 'number' ? osufunc.writePreviousId('map', input.obj.guildId,
            {
                id: `${mapdata.id}`,
                apiData: null,
                mods: osumodcalc.ModIntToString(replay.mods)
            }
        ) : '';
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(replay.playerName, 'osudata', osufunc.modeValidator('osu')) &&
        !('error' in func.findFile(replay.playerName, 'osudata', osufunc.modeValidator('osu'))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(replay.playerName, 'osudata', osufunc.modeValidator('osu'));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: replay.playerName,
                mode: osufunc.modeValidator('osu')
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'replayparse', true, errors.uErr.osu.profile.user_msp.replace('[ID]', replay.playerName), false);
        return;
    }
    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(replay.gameMode));
    func.storeFile(osudataReq, replay.playerName, 'osudata', osufunc.modeValidator(replay.gameMode));
    osufunc.debug(osudataReq, 'fileparse', 'replay', input.obj.guildId, 'osuData');
    let userid: string | number;
    try {
        userid = osudata.id;
    } catch (err) {
        userid = 0;
        return;
    }
    let mapbg: string;
    let mapcombo: string | number;
    const fulltitle: string = osufunc.parseUnicodeStrings({
        title: mapdata.beatmapset.title,
        artist: mapdata.beatmapset.artist,
        title_unicode: mapdata.beatmapset.title_unicode,
        artist_unicode: mapdata.beatmapset.artist_unicode,
        ignore: {
            artist: false,
            title: false
        }
    }, 1) + ` [${mapdata.version}]`;
    let mapdataid: string;

    const mods = replay.mods;
    let ifmods: string;
    if (mods != 0) {
        ifmods = `+${osumodcalc.ModIntToString(mods)}`;
    } else {
        ifmods = '';
    }
    const gameMode = replay.gameMode;
    let accuracy: number;
    let xpp: PerformanceAttributes[];
    let hitlist: string;
    let fcacc: number;
    let ppissue: string;
    let totalhits = 0;

    switch (gameMode) {
        case 0:
            hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`;
            accuracy = osumodcalc.calcgrade(replay.number_300s, replay.number_100s, replay.number_50s, replay.misses).accuracy;
            fcacc = osumodcalc.calcgrade(replay.number_300s, replay.number_100s, replay.number_50s, 0).accuracy;
            totalhits = replay.number_300s + replay.number_100s + replay.number_50s + replay.misses;
            break;
        case 1:

            hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.misses}`;
            accuracy = osumodcalc.calcgradeTaiko(replay.number_300s, replay.number_100s, replay.misses).accuracy;
            fcacc = osumodcalc.calcgradeTaiko(replay.number_300s, replay.number_100s, 0).accuracy;
            totalhits = replay.number_300s + replay.number_100s + replay.misses;
            break;
        case 2:

            hitlist = `${replay.number_300s}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`;
            accuracy = osumodcalc.calcgradeCatch(replay.number_300s, replay.number_100s, replay.number_50s, replay.katus, replay.misses).accuracy;
            fcacc = osumodcalc.calcgradeCatch(replay.number_300s, replay.number_100s, replay.number_50s, replay.katus, 0).accuracy;
            totalhits = replay.number_300s + replay.number_100s + replay.number_50s + replay.katus + replay.misses;
            break;
        case 3:

            hitlist = `${replay.gekis}/${replay.number_300s}/${replay.katus}/${replay.number_100s}/${replay.number_50s}/${replay.misses}`;
            accuracy = osumodcalc.calcgradeMania(replay.gekis, replay.number_300s, replay.katus, replay.number_100s, replay.number_50s, replay.misses).accuracy;
            fcacc = osumodcalc.calcgradeMania(replay.gekis, replay.number_300s, replay.katus, replay.number_100s, replay.number_50s, 0).accuracy;
            totalhits = replay.gekis + replay.number_300s + replay.katus + replay.number_100s + replay.number_50s + replay.misses;
            break;
    }
    const failed = totalhits == (mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners) ? false : true;

    try {
        if (!mapdata.id) throw new Error('no map');
        xpp = await osufunc.scorecalc({
            mods: osumodcalc.ModIntToString(replay.mods),
            gamemode: osumodcalc.ModeIntToName(replay.gameMode),
            mapid: mapdata.id,
            miss: replay.misses,
            acc: accuracy / 100,
            maxcombo: replay.max_combo,
            score: replay.score,
            calctype: 0,
            passedObj: totalhits,
        }, new Date(mapdata.last_updated), input.config);
        ppissue = '';
    } catch (error) {
        const temp: PerformanceAttributes = {
            mode: replay.gameMode,
            pp: 0,
            difficulty: {
                mode: replay.gameMode,
                stars: mapdata.difficulty_rating,
                maxCombo: mapdata.max_combo ?? 0,
                aim: 0,
                speed: 0,
                flashlight: 0,
                sliderFactor: 0,
                speedNoteCount: 0,
                ar: mapdata.ar,
                od: mapdata.accuracy,
                nCircles: mapdata.count_circles,
                nSliders: mapdata.count_sliders,
                nSpinners: mapdata.count_spinners,
                stamina: 0,
                rhythm: 0,
                color: 0,
                peak: 0,
                hitWindow: mapdata.accuracy,
                nFruits: mapdata.count_circles,
                nDroplets: mapdata.count_sliders,
                nTinyDroplets: mapdata.count_spinners,
            },
            ppAcc: 0,
            ppAim: 0,
            ppFlashlight: 0,
            ppSpeed: 0,
            effectiveMissCount: 0,
            ppDifficulty: 0,
        };
        xpp = [temp, temp];
        ppissue = errors.uErr.osu.performance.mapMissing;
    }

    try {
        mapbg = mapdata.beatmapset.covers['list@2x'];
        mapcombo = xpp[0].difficulty.maxCombo ? xpp[0].difficulty.maxCombo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : NaN;
        mapdataid = 'https://osu.ppy.sh/b/' + mapdata.id;
    } catch (error) {
        mapbg = 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png';
        mapcombo = NaN;
        mapdataid = 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png';
    }

    const lifebar = replay.life_bar.split('|');
    const lifebarF = [];
    for (let i = 0; i < lifebar.length; i++) {
        lifebarF.push(lifebar[i].split(',')[0]);
    }
    lifebarF.shift();

    const dataLabel = [];

    for (let i = 0; i < lifebarF.length; i++) {
        dataLabel.push('');

    }

    const passper = Math.abs(totalhits / (mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners)) * 100;

    const isfail = failed ?
        `${passper.toFixed(2)}% passed (${calc.secondsToTime(passper / 100 * mapdata.hit_length)}/${calc.secondsToTime(mapdata.hit_length)})`
        : '';

    const chartInit = await func.graph(dataLabel, lifebarF, 'Health', {
        fill: false,
        startzero: true,
        pointSize: 0,
        gradient: true
    });

    const chartFile = new Discord.AttachmentBuilder(chartInit.path);

    const chart = chartInit.filename;

    // const UR =
    //     mapdata.id ?
    //         await osufunc.calcUr(
    //             `${filespath}/replays/${input.absoluteID}.osr`,
    //             `${path}/files/maps/${mapdata.id}.osu`
    //         ) : null;

    const Embed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setColor(colours.embedColour.score.dec)
        .setAuthor({ name: `${replay.playerName}'s replay`, iconURL: `https://a.ppy.sh/${userid}`, url: `https://osu.ppy.sh/users/${userid}` })
        .setTitle(`${fulltitle} ${ifmods}`)
        .setURL(`${mapdataid}`)
        .setThumbnail(mapbg)
        .setDescription(
            `
${replay.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${replay.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x/**${mapcombo}x** | ${accuracy.toFixed(2)}%
\`${hitlist}\`
${xpp[0].pp.toFixed(2)}pp | ${xpp[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC 
${ppissue}
${isfail}
`
        )
        .setImage(`attachment://${chart}.jpg`);

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embed],
            files: [chartFile]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'replayparse',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'replayparse',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * parse score and return data
 */
export async function scoreparse(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;

    let scorelink: string;
    let scoremode: string;
    let scoreid: number | string;

    let embedStyle: extypes.osuCmdStyle = 'S';
    let scoredetailed: number = 1;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;

            if (input.args.includes('-detailed')) {
                scoredetailed = 2;
                input.args.splice(input.args.indexOf('-detailed'), 1);
            }
            if (input.args.includes('-d')) {
                scoredetailed = 2;
                input.args.splice(input.args.indexOf('-d'), 1);
            }
            if (input.args.includes('-compress')) {
                scoredetailed = 0;
                input.args.splice(input.args.indexOf('-compress'), 1);
            }
            if (input.args.includes('-c')) {
                scoredetailed = 0;
                input.args.splice(input.args.indexOf('-c'), 1);
            }

            scorelink = null;
            scoremode = input.args[1] ?? 'osu';
            scoreid = input.args[0];
            if (input?.args[0]?.includes('https://')) {
                const messagenohttp = input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '');
                scorelink = messagenohttp.split('/scores/')[1];
                scoremode = scorelink.split('/')[0];
                scoreid = scorelink.split('/')[1];
                scoreid.includes(' ') ?
                    scoreid = scoreid.split(' ')[0] : null;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;

            //osu.ppy.sh/scores/<mode>/<id>
            scoremode = input.obj.message.embeds[0].url.split('scores')[1].split('/')[1];
            scoreid = input.obj.message.embeds[0].url.split('scores')[1].split('/')[2];

            switch (input.button) {
                case 'Detail0':
                    scoredetailed = 0;
                    break;
                case 'Detail1':
                    scoredetailed = 1;
                    break;
                case 'Detail2':
                    scoredetailed = 2;
                    break;
                default:
                    if (input.obj.message.embeds[0].footer.text.includes('LE')) {
                        scoredetailed = 2;
                    }
                    if (input.obj.message.embeds[0].footer.text.includes('LC')) {
                        scoredetailed = 0;
                    }
                    break;
            }
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
            const messagenohttp = input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '');
            try {
                scorelink = messagenohttp.split('/scores/')[1];
                scoremode = scorelink.split('/')[0];
                scoreid = scorelink.split('/')[1];
                scoreid.includes(' ') ?
                    scoreid = scoreid.split(' ')[0] : null;
            } catch (error) {
                return;
            }
        }
    }

    if (input.overrides != null) {
        if (input.overrides?.id != null) {
            scoreid = input.overrides.id;
        }
        if (input.overrides?.mode != null) {
            scoremode = input.overrides.mode;
        }
        if (input.overrides?.commanduser != null) {
            commanduser = input.overrides.commanduser;
        }
        if (input.overrides?.commandAs != null) {
            input.commandType = input.overrides.commandAs;
        }
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'score parse',
        options: [
            {
                name: 'Score Link',
                value: `${scorelink}`
            },
            {
                name: 'Score Mode',
                value: `${scoremode}`
            },
            {
                name: 'Score ID',
                value: `${scoreid}`
            }
        ],
        config: input.config
    });
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (!scoreid) {
        const temp = osufunc.getPreviousId('score', input.obj.guildId);
        if (temp.apiData.best_id && typeof temp.apiData.best_id === 'number') {
            scoreid = temp.apiData.best_id;
        } else {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: errors.uErr.osu.score.ms,
                    edit: true
                }
            }, input.canReply);
            log.logCommand({
                event: 'Error',
                commandName: 'scoreparse',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                customString: errors.uErr.osu.score.ms,
                config: input.config
            });
            return;
        }
    }
    let scoredataReq: osufunc.apiReturn;

    if (func.findFile(scoreid, 'scoredata') &&
        !('error' in func.findFile(scoreid, 'scoredata')) &&
        input.button != 'Refresh'
    ) {
        scoredataReq = func.findFile(scoreid, 'scoredata');
    } else {
        scoredataReq = await osufunc.apiget(
            {
                type: 'score',
                config: input.config,
                params: {
                    id: scoreid,
                    mode: osufunc.modeValidator(scoremode)
                }
            });
    }

    const scoredata: osuApiTypes.Score = scoredataReq.apiData;
    if (scoredataReq?.error) {
        await msgfunc.errorAndAbort(input, 'scoreparse', true, errors.uErr.osu.score.nd
            .replace('[SID]', scoreid.toString())
            .replace('[MODE]', scoremode), false);
        return;
    }

    if (scoredata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'scoreparse', true, errors.uErr.osu.score.nd
            .replace('[SID]', scoreid.toString())
            .replace('[MODE]', scoremode), true);
        return;
    }
    func.storeFile(scoredataReq, scoreid, 'scoredata', osufunc.modeValidator(scoredata.mode));

    let buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Refresh-scoreparse-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Map-scoreparse-any-${input.absoluteID}-${scoredata.beatmap.id}${scoredata.mods ? '+' + scoredata.mods.join() : ''}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.map),
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-User-scoreparse-any-${input.absoluteID}-${scoredata.user_id}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.user),
        );

    const checkDetails = await msgfunc.buttonsAddDetails('scoreparse', commanduser, input.absoluteID, buttons, scoredetailed, embedStyle);
    buttons = checkDetails.buttons;
    embedStyle = checkDetails.embedStyle;

    if (input.commandType == 'interaction' && input.overrides == null) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    osufunc.debug(scoredataReq, 'command', 'scoreparse', input.obj.guildId, 'scoreData');
    try {
        scoredata.rank.toUpperCase();
    } catch (error) {
        await msgfunc.errorAndAbort(input, 'scoreparse', true, errors.uErr.osu.score.wrong + ` - osu.ppy.sh/scores/${scoremode}/${scoreid}`, true);
        return;
    }
    let mapdataReq: osufunc.apiReturn;
    if (func.findFile(scoredata.beatmap.id, 'mapdata') &&
        !('error' in func.findFile(scoredata.beatmap.id, 'mapdata')) &&
        input.button != 'Refresh') {
        mapdataReq = func.findFile(scoredata.beatmap.id, 'mapdata');
    } else {
        mapdataReq = await osufunc.apiget({
            type: 'map',
            config: input.config,
            params: {
                id: scoredata.beatmap.id,
            }
        });
    }

    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'scoreparse', true, errors.uErr.osu.map.m.replace('[ID]', `${scoredata.beatmap.id}`), false);
        return;
    }
    if (mapdata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'scoreparse', true, errors.uErr.osu.map.m.replace('[ID]', scoredata.beatmap.id.toString()), true);
        return;
    }

    func.storeFile(mapdataReq, scoredata.beatmap.id, 'mapdata');

    const scoregrade = input.config.useEmojis.scoreGrades ? emojis.grades[scoredata.rank.toUpperCase()] : scoredata.rank.toUpperCase();

    const gamehits = scoredata.statistics;

    const mode = scoredata.mode;
    let hitlist: string;
    let fcacc: number;
    let ppissue: string;

    const getHits = osufunc.returnHits(gamehits, scoredata.mode);

    switch (scoredetailed) {
        default: {
            hitlist = getHits.short;
        }
            break;
        case 2: {
            hitlist = getHits.long;
        }
            break;
    }

    switch (mode) {
        case 'osu':
            fcacc = osumodcalc.calcgrade(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy;
            break;
        case 'taiko':
            fcacc = osumodcalc.calcgradeTaiko(gamehits.count_300, gamehits.count_100, gamehits.count_miss).accuracy;
            break;
        case 'fruits':
            fcacc = osumodcalc.calcgradeCatch(gamehits.count_300, gamehits.count_100, gamehits.count_50, gamehits.count_katu, gamehits.count_miss).accuracy;
            break;
        case 'mania':
            fcacc = osumodcalc.calcgradeMania(gamehits.count_geki, gamehits.count_300, gamehits.count_katu, gamehits.count_100, gamehits.count_50, gamehits.count_miss).accuracy;
            break;
    }

    let ppcalcing: PerformanceAttributes[];
    try {
        ppcalcing = await osufunc.scorecalc({
            mods: scoredata.mods.join('').length > 1 ?
                scoredata.mods.join('') : 'NM',
            gamemode: scoredata.mode,
            mapid: scoredata.beatmap.id,
            miss: gamehits.count_miss,
            acc: scoredata.accuracy,
            maxcombo: scoredata.max_combo,
            score: scoredata.score,
            calctype: 0,
            passedObj: embedStuff.getTotalHits(scoredata.mode, scoredata),
        }, new Date(mapdata.last_updated), input.config);

        ppissue = '';
        osufunc.debug(ppcalcing, 'command', 'scoreparse', input.obj.guildId, 'ppCalcing');
    } catch (error) {
        const ppComputedTemp: PerformanceAttributes = {
            mode: mapdata.mode_int,
            pp: 0,
            difficulty: {
                mode: mapdata.mode_int,
                stars: mapdata.difficulty_rating,
                maxCombo: mapdata.max_combo,
                aim: 0,
                speed: 0,
                flashlight: 0,
                sliderFactor: 0,
                speedNoteCount: 0,
                ar: mapdata.ar,
                od: mapdata.accuracy,
                nCircles: mapdata.count_circles,
                nSliders: mapdata.count_sliders,
                nSpinners: mapdata.count_spinners,
                stamina: 0,
                rhythm: 0,
                color: 0,
                hitWindow: 0,
                nFruits: mapdata.count_circles,
                nDroplets: mapdata.count_sliders,
                nTinyDroplets: mapdata.count_spinners,
            },
            ppAcc: 0,
            ppAim: 0,
            ppDifficulty: 0,
            ppFlashlight: 0,
            ppSpeed: 0,
            effectiveMissCount: 0,

        };
        ppcalcing = [
            ppComputedTemp,
            ppComputedTemp,
            ppComputedTemp
        ];
        ppissue = 'Error - pp calculator could not fetch beatmap';

    }

    const title = osufunc.parseUnicodeStrings({
        title: mapdata.beatmapset.title,
        artist: mapdata.beatmapset.artist,
        title_unicode: mapdata.beatmapset.title_unicode,
        artist_unicode: mapdata.beatmapset.artist_unicode,
        ignore: {
            artist: false,
            title: false
        }
    }, 1);

    let pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC`;
    const mxCombo = ppcalcing[0].difficulty.maxCombo ?? mapdata?.max_combo;
    if (scoredata.accuracy == 1) {
        if (scoredata.max_combo == mxCombo) {
            pptxt = `${ppcalcing[0].pp.toFixed(2)}pp`;
        } else {
            pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC`;
        }
    } else {
        if (scoredata.max_combo == mxCombo) {
            pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[2].pp.toFixed(2)}pp if SS`;
        } else {
            pptxt = `${ppcalcing[0].pp.toFixed(2)}pp | ${ppcalcing[1].pp.toFixed(2)}pp if ${fcacc.toFixed(2)}% FC | ${ppcalcing[2].pp.toFixed(2)}pp if SS`;
        }
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(scoredata.user.username, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(scoredata.user.username, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(scoredata.user.username, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: scoredata.user.username,
                mode: osufunc.modeValidator(mode)
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'scoreparse', true, errors.uErr.osu.profile.user.replace('[ID]', scoredata.user.username), false);
        return;
    }
    osufunc.debug(osudataReq, 'command', 'scoreparse', input.obj.guildId, 'osuData');
    if (osudata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'scoreparse', true, `${errors.uErr.osu.profile.user
            .replace('[ID]', scoredata?.user?.username)
            } AKA ${scoredata.user.username}`, true);
        return;
    }

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, scoredata.user.username, 'osudata', osufunc.modeValidator(mode));

    const mxcombo =
        ppcalcing[0].difficulty.maxCombo;
    mapdata.max_combo;

    const scoreembed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setColor(colours.embedColour.score.dec)
        .setAuthor({
            name: `${osudata.username} | #${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${osudata?.avatar_url ?? def.images.any.url}`
        })
        .setTitle(`\`${title} [${mapdata.version}]\``)
        .setURL(`https://osu.ppy.sh/scores/${mode}/${scoreid}`)
        .setThumbnail(`${scoredata.beatmapset.covers['list@2x']}`);
    switch (scoredetailed) {
        case 0: {
            embedStyle = 'LC';
            scoreembed
                .setDescription(`${scoredata.rank_global ? `\n#${scoredata.rank_global} global` : ''} ${scoredata.replay ? `| [REPLAY](https://osu.ppy.sh/scores/${scoredata.mode}/${scoredata.id}/download)` : ''}
${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade} ${scoredata.mods.length > 0 ? '| ' + (input.config.useEmojis.mods ? scoredata.mods.map(x => emojis.mods[x.toLowerCase()]).join('') : `**${osumodcalc.OrderMods(scoredata.mods.join(''))}**`) : ''}
<t:${Math.floor(new Date(scoredata.created_at).getTime() / 1000)}:F> | <t:${Math.floor(new Date(scoredata.created_at).getTime() / 1000)}:R>
\`${hitlist}\`
${scoredata?.pp?.toFixed(2) ?? 'null '}pp
`);
        }
            break;
        case 1: default: {
            embedStyle = 'L';
            scoreembed
                .setDescription(`${scoredata.rank_global ? `\n#${scoredata.rank_global} global` : ''} ${scoredata.replay ? `| [REPLAY](https://osu.ppy.sh/scores/${scoredata.mode}/${scoredata.id}/download)` : ''}
${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade} ${scoredata.mods.length > 0 ? '| ' + (input.config.useEmojis.mods ? scoredata.mods.map(x => emojis.mods[x.toLowerCase()]).join('') : `**${osumodcalc.OrderMods(scoredata.mods.join(''))}**`) : ''}
<t:${Math.floor(new Date(scoredata.created_at).getTime() / 1000)}:F> | <t:${Math.floor(new Date(scoredata.created_at).getTime() / 1000)}:R>
[Beatmap](https://osu.ppy.sh/b/${scoredata.beatmap.id})
\`${hitlist}\`
${scoredata.max_combo == mxcombo ? `**${scoredata.max_combo}x**` : `${scoredata.max_combo}x`}/**${mxcombo}x**
${pptxt}\n${ppissue}
`);
        }
            break;
        case 2: {
            embedStyle = 'LE';
            switch (scoredata.mode) {
                case 'osu': default:
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`;
                    break;
                case 'taiko':
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **Miss:** ${gamehits.count_miss}`;
                    break;
                case 'fruits':
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`;
                    break;
                case 'mania':
                    hitlist = `**300+:** ${gamehits.count_geki} \n **300:** ${gamehits.count_300} \n **200:** ${gamehits.count_katu} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`;
                    break;
            }

            const newValues = osumodcalc.calcValues(
                mapdata.cs, mapdata.ar, mapdata.accuracy, mapdata.drain,
                mapdata.bpm, mapdata.hit_length,
                scoredata.mods.join('')
            );
            const csStr = mapdata.cs == newValues.cs ?
                `CS${mapdata.cs}` :
                `CS${mapdata.cs}=>${newValues.cs}`;
            const arStr = mapdata.ar == newValues.ar ?
                `AR${mapdata.ar}` :
                `AR${mapdata.ar}=>${newValues.ar}`;
            const odStr = mapdata.accuracy == newValues.od ?
                `OD${mapdata.accuracy}` :
                `OD${mapdata.accuracy}=>${newValues.od}`;
            const hpStr = mapdata.drain == newValues.hp ?
                `HP${mapdata.drain}` :
                `HP${mapdata.drain}=>${newValues.hp}`;
            const bpmStr = mapdata.bpm == newValues.bpm ?
                `${emojis.mapobjs.bpm}${mapdata.bpm}` :
                `${emojis.mapobjs.bpm}${mapdata.bpm}=>${newValues.bpm}`;
            const lenStr = mapdata.hit_length == newValues.length ?
                `${emojis.mapobjs.total_length}${calc.secondsToTime(mapdata.hit_length)}` :
                `${emojis.mapobjs.total_length}${calc.secondsToTime(mapdata.hit_length)}=>${calc.secondsToTime(newValues.length)}`;
            const srStr = mapdata.difficulty_rating.toFixed(2) == (ppcalcing[0]?.difficulty?.stars.toFixed(2) ?? mapdata.difficulty_rating.toFixed(2)) ?
                `${mapdata.difficulty_rating.toFixed(2)}⭐` :
                `⭐${mapdata.difficulty_rating.toFixed(2)}=>${ppcalcing[0]?.difficulty?.stars?.toFixed(2)}`;

            scoreembed
                .setDescription(`
${scoredata.rank_global ? `\n#${scoredata.rank_global} global` : ''} ${scoredata.replay ? `| [REPLAY](https://osu.ppy.sh/scores/${scoredata.mode}/${scoredata.id}/download)` : ''}
<t:${Math.floor(new Date(scoredata.created_at).getTime() / 1000)}:F> | <t:${Math.floor(new Date(scoredata.created_at).getTime() / 1000)}:R>
`)
                .addFields([
                    {
                        name: 'Score details',
                        value:
                            `
${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade} ${scoredata.mods.length > 0 ? ('| ' + (input.config.useEmojis.mods == true ? scoredata.mods.map(x => emojis.mods[x.toLowerCase()]).join('') : `**${osumodcalc.OrderMods(scoredata.mods.join(''))}**`)) : ''}
${hitlist}
${scoredata.max_combo == mxcombo ? `**${scoredata.max_combo}x**` : `${scoredata.max_combo}x`}/**${mxcombo}x**
`                        ,
                        inline: true
                    },
                    {
                        name: 'PP',
                        value:
                            `**${(scoredata?.pp ?? ppcalcing[0]?.pp ?? NaN).toFixed(2)}**pp
**${(ppcalcing[1]?.pp ?? NaN).toFixed(2)}**pp if FC
**${(ppcalcing[2]?.pp ?? NaN).toFixed(2)}**pp if SS
`,
                        inline: true
                    },
                    {
                        name: def.invisbleChar,
                        value: def.invisbleChar,
                        inline: true
                    },
                    {
                        name: 'Map details',
                        value: //CS AR OD HP SR
                            `
${csStr} 
${arStr} 
${odStr} 
${hpStr}
                        `,
                        inline: true
                    },
                    {
                        name: def.invisbleChar,
                        value: //CS AR OD HP SR
                            `
${bpmStr}
${lenStr} 
${srStr}
[Beatmap](https://osu.ppy.sh/b/${scoredata.beatmap.id})
                        `,
                        inline: true
                    }
                ]);
        }
            break;
    }

    osufunc.writePreviousId('score', input.obj.guildId,
        {
            id: `${scoredata.id}`,
            apiData: scoredata,
            mods: scoredata.mods.join()
        });
    osufunc.writePreviousId('map', input.obj.guildId,
        {
            id: `${mapdata.id}`,
            apiData: null,
            mods: scoredata.mods.join()
        }
    );

    let useComponents = [buttons];

    if (buttons.toJSON().components.length >= 5) {
        const xsbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-Scores-scoreparse-any-${input.absoluteID}-${scoredata.beatmap.id}+${osudata.id}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.extras.leaderboard),
            );
        useComponents = [buttons, xsbuttons];
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [scoreembed],
            components: useComponents,
            edit: true
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'scoreparse',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'scoreparse',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * generates scorepost thumbnail/title
 */
export async function scorepost(input: extypes.commandInput) {
    let commanduser: Discord.User;

    let scoreId: number;
    let customString: string;
    let mode: osuApiTypes.GameMode = 'osu';

    const type: number = 0;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = msgfunc.cleanArgs(input.args);

            //attempt to fetch score id
            if (!isNaN(+input.args[0])) {
                scoreId = +input.args[0];
                input.args.splice(input.args.indexOf(input.args[0]), 1);
            }
            if (!isNaN(+input.args[input.args.length - 1])) {
                scoreId = +input.args[input.args.length - 1];
                input.args.splice(input.args.indexOf(input.args[input.args.length - 1]), 1);
            }

            input.args.length > 0 ? customString = input.args.join(' ') : null;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;

            scoreId = input.obj.options.getInteger('id');
            customString = input.obj.options.getString('custom');
            mode = input.obj.options.getString('mode') as osuApiTypes.GameMode;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'recentactivity',
        options: [
            {
                name: 'Score ID',
                value: scoreId
            },
            {
                name: 'Custom String',
                value: customString
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (!scoreId || isNaN(scoreId)) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.osu.score.wrong,
                edit: true
            }
        }, input.canReply);
        log.logCommand({
            event: 'Error',
            commandName: 'scorepost',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: errors.uErr.osu.score.wrong,
            config: input.config
        });
        return;
    }


    let scoredataReq: osufunc.apiReturn;

    if (func.findFile(scoreId, 'scoredata') &&
        !('error' in func.findFile(scoreId, 'scoredata')) &&
        input.button != 'Refresh'
    ) {
        scoredataReq = func.findFile(scoreId, 'scoredata');
    } else {
        scoredataReq = await osufunc.apiget(
            {
                type: 'score',
                config: input.config,
                params: {
                    id: scoreId,
                    mode: osufunc.modeValidator(mode)
                }
            });
    }

    const scoredata: osuApiTypes.Score = scoredataReq.apiData;
    if (scoredataReq?.error) {
        await msgfunc.errorAndAbort(input, 'scorepost', true, errors.uErr.osu.score.nf, false);
        return;
    }
    if (scoredata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'scorepost', true, errors.uErr.osu.score.nf, true);
        return;
    }

    let mapdataReq: osufunc.apiReturn;
    if (func.findFile(scoredata.beatmap.id, 'mapdata') &&
        !('error' in func.findFile(scoredata.beatmap.id, 'mapdata')) &&
        input.button != 'Refresh'
    ) {
        mapdataReq = func.findFile(scoredata.beatmap.id, 'mapdata');
    } else {
        mapdataReq = await osufunc.apiget(
            {
                type: 'map',
                config: input.config,
                params: {
                    id: scoredata.beatmap.id
                }
            }
        );
    }
    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'scorepost', true, errors.uErr.osu.map.m.replace('[ID]', `${scoredata.beatmap.id}`), false);
        return;
    }
    osufunc.debug(mapdataReq, 'command', 'maplb', input.obj.guildId, 'mapData');

    if (mapdata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'scorepost', true, errors.uErr.osu.map.m.replace('[ID]', `${scoredata.beatmap.id}`), true);
        return;
    }

    func.storeFile(mapdataReq, scoredata.beatmap.id, 'mapdata');

    const ppCalc = await osufunc.scorecalc({
        mods: scoredata.mods.join(''),
        gamemode: mode,
        miss: scoredata.statistics.count_miss,
        acc: scoredata.accuracy,
        maxcombo: scoredata.max_combo,
        mapid: scoredata.beatmap.id
    }, new Date(mapdata.last_updated), input.config);

    let pptxt: string;

    if (scoredata.accuracy == 1) {
        pptxt = `${scoredata.pp}`;
    } else {
        if (scoredata.perfect) {
            pptxt = `${scoredata.pp} (${ppCalc[2].pp} if SS)`;
        } else {
            pptxt = `${scoredata.pp} (${ppCalc[1].pp} if FC)`;
        }
    }

    let nonFcString: string = '';

    scoredata.statistics.count_miss > 0 ?
        nonFcString += `${scoredata.statistics.count_miss}❌` : null;
    scoredata.perfect ? null :
        nonFcString += ` ${scoredata.max_combo}/${ppCalc[0].difficulty.maxCombo}`;

    if (nonFcString.length < 1) {
        nonFcString = 'FC';
    }

    const order = {
        name: scoredata.user.username,
        fullTitle: `${scoredata.beatmapset.artist} - ${scoredata.beatmapset.title}`,
        version: scoredata.beatmap.version,
        mods: osumodcalc.OrderMods(scoredata.mods.join('')),
        acc: scoredata.accuracy * 100,
        diff: ppCalc[0].difficulty.stars,
        mapper: mapdata.beatmapset.creator,
        comboMin: scoredata.max_combo,
        comboMax: ppCalc[0].difficulty.maxCombo,
        pp: ppCalc[0].pp,
        isFullCombo: null,
        unranked: true,
    };

    let titleString = 'null';

    switch (type) {
        case 0: default: {
            titleString = `${order.name} | ${order.fullTitle} [${order.version}] ${order.mods.length > 1 ? '+' + order.mods : ''} `
                + `${order.acc?.toFixed(2)}% ${order.diff?.toFixed(2)}⭐ `
                + `| ${order.pp?.toFixed(2)}pp ${customString ? '| ' + customString : ''}`
                ;
        } break;
        case 1: {
            titleString = `${order.name} | ${order.fullTitle} [${order.version}] + ${order.mods.length > 1 ? '+' + order.mods : ''} `
                + `(${order.diff}, ${order.mapper}) ${order.acc} ${order.comboMin}/${order.comboMax} | ${order.pp}`;
        }
    }
    //download beatmap bg
    await func.downloadIMG(osufunc.getMapImages(scoredata.beatmapset.id).raw, `${path}/cache/graphs/${scoredata.id ?? input.absoluteID}a.jpg`) as unknown as string;
    await func.downloadIMG(`https://a.ppy.sh/${scoredata.user_id}`, `${path}/cache/graphs/${scoredata.id ?? scoredata.user_id ?? input.absoluteID}b.png`) as unknown as string;
    let bimg = `${path}/cache/graphs/${scoredata.id ?? input.absoluteID}a.jpg`;
    let aimg = `${path}/cache/graphs/${scoredata.id ?? scoredata.user_id ?? input.absoluteID}b.png`;
    if (!fs.existsSync(bimg)) {
        bimg = `${precomppath}/files/img/background-1.png`;
    }
    if (!fs.existsSync(aimg)) {
        aimg = `${precomppath}/files/blank.png`;
    }
    //create scorepost img
    let frimg: Discord.AttachmentBuilder = new Discord.AttachmentBuilder(`${precomppath}/files/img/background-1.png`);
    async function doShit() {
        try {
            await jimp.default.read(bimg).then(async (image) => {
                image.background(0x000000);
                image.contain(1280, 720);
                image.brightness(-0.75);
                try {
                    image.blit((await jimp.default.read(aimg).then(async (image) => { image.resize(256, 256); return image; })), (1280 / 2) - 128, (720 / 2) - 128,);
                } catch (error) {
                    console.log(error);
                    aimg = `${precomppath}/files/blank.png`;
                    return await doShit();
                }
                //ctx
                image.print(await jimp.default.loadFont(jimp.default.FONT_SANS_32_WHITE), 1280 / 2, (720 / 2) + 190, {
                    text: `${scoredata.beatmapset.title}`,
                    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
                },
                    1080, 50
                );
                image.print(await jimp.default.loadFont(jimp.default.FONT_SANS_32_WHITE), 1280 / 2, (720 / 2) + 150, {
                    text: `${scoredata.beatmapset.artist}`,
                    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
                },
                    1080, 50
                );
                image.print(await jimp.default.loadFont(jimp.default.FONT_SANS_32_WHITE), 1280 / 2, (720 / 2) + 230, {
                    text: `[${order.version}]`,
                    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
                },
                    1080, 50
                );
                image.print(await jimp.default.loadFont(jimp.default.FONT_SANS_32_WHITE), (1280 / 2) + 128, (720 / 2) - 32, {
                    text: `${order.name}`,
                    alignmentX: jimp.HORIZONTAL_ALIGN_LEFT
                },
                    960, 50
                );
                //stats
                image.print(await jimp.default.loadFont(jimp.default.FONT_SANS_32_WHITE), (1280 / 2) - 128, (720 / 2) - 32, {
                    text: `${order.pp?.toFixed(2)}pp`,
                    alignmentX: jimp.HORIZONTAL_ALIGN_RIGHT
                },
                    960, 50
                );
                image.print(await jimp.default.loadFont(jimp.default.FONT_SANS_32_WHITE), (1280 / 2) - 128, (720 / 2) + 32, {
                    text: `${order.acc?.toFixed(2)}%`,
                    alignmentX: jimp.HORIZONTAL_ALIGN_RIGHT
                },
                    960, 50
                );
                image.print(await jimp.default.loadFont(jimp.default.FONT_SANS_32_WHITE), (1280 / 2) + 128, (720 / 2) + 32, {
                    text: `${order.mods}`,
                    alignmentX: jimp.HORIZONTAL_ALIGN_LEFT
                },
                    960, 50
                );
                let statusimg = `${precomppath}/files/img/osu/status-graveyard.png`;
                let modeimg = `${precomppath}/files/img/osu/modeosu.png`;
                switch (mapdata.status) {
                    case 'ranked':
                        statusimg = `${precomppath}/files/img/osu/status-ranked.png`;
                        break;
                    case 'approved': case 'qualified':
                        statusimg = `${precomppath}/files/img/osu/status-approved.png`;
                        break;
                    case 'loved':
                        statusimg = `${precomppath}/files/img/osu/status-loved.png`;
                        break;
                }
                switch (scoredata.mode) {
                    case 'taiko':
                        modeimg = `${precomppath}/files/img/osu/modetaiko.png`;
                        break;
                    case 'fruits':
                        modeimg = `${precomppath}/files/img/osu/modefruits.png`;
                        break;
                    case 'mania':
                        modeimg = `${precomppath}/files/img/osu/modemania.png`;
                        break;
                }
                try {
                    image.blit((await jimp.default.read(`${precomppath}/files/img/grades/Ranking-${scoredata.rank}.png`).then(async (image) => {
                        image.scale(0.6);
                        return image;
                    })), 0, (720 / 2) - (150 * 0.6));
                } catch (error) {
                    console.log(error);
                    aimg = `${precomppath}/files/blank.png`;
                    return await doShit();
                }
                try {
                    image.blit((await jimp.default.read(statusimg).then(async (image) => {
                        image.scale(0.3);
                        return image;
                    })), 0, 0);
                } catch (error) {
                    console.log(error);
                    aimg = `${precomppath}/files/blank.png`;
                    return await doShit();
                }
                try {
                    image.blit((await jimp.default.read(modeimg).then(async (image) => {
                        image.scale(0.22);
                        return image;
                    })), +128, 0);
                } catch (error) {
                    console.log(error);
                    aimg = `${precomppath}/files/blank.png`;
                    return await doShit();
                }
                image.writeAsync(`${path}/cache/commandData/genThumb-${input.absoluteID}.png`);
            });
        } catch (error) {
            bimg = `${precomppath}/files/img/background-1.png`;
            return await doShit();
        }
    }
    await doShit();
    // await new Promise((resolve, reject) => {
    //     if (fs.existsSync(`${path}/cache/commandData/genThumb-${input.absoluteID}.png`)) {
    //         frimg = new Discord.AttachmentBuilder(`${path}/cache/commandData/genThumb-${input.absoluteID}.png`);
    //         resolve('yes');
    //     } else {
    //         console.log(`${path}/cache/commandData/genThumb-${input.absoluteID}.png`);
    //         reject('err');
    //     }

    // });
    frimg = new Discord.AttachmentBuilder(`${path}/cache/commandData/genThumb-${input.absoluteID}.png`);
    /**
     * formatted as
     * name | artist - title [version] +mods acc% sr | pp mode | custom
     * name | artist - title [version] +mods (sr, mapper) acc% minCombo/maxCombo | pp (if ranked, if fc)
     */

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: titleString,
            files: [frimg]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'scorepost',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'scorepost',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * list of user's scores on a map
 */
export async function scores(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;

    let user;
    let searchid;
    let mapid;
    let page = 1;
    let scoredetailed: number = 1;

    let sort: embedStuff.scoreSort = 'recent';
    let reverse = false;
    let mode = 'osu';
    const filteredMapper = null;
    const filteredMods = null;
    const filterRank = null;

    let parseScore = false;
    let parseId = null;

    const exactMods = null;

    const pp = null;
    const score = null;
    const acc = null;
    const combo = null;
    const miss = null;
    const bpm = null;

    let useContent: string = null;

    let embedStyle: extypes.osuCmdStyle = 'L';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true);
                parseId = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-p', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-detailed')) {
                scoredetailed = 2;
                input.args.splice(input.args.indexOf('-detailed'), 1);
            }
            if (input.args.includes('-d')) {
                scoredetailed = 2;
                input.args.splice(input.args.indexOf('-d'), 1);
            }
            if (input.args.includes('-compress')) {
                scoredetailed = 0;
                input.args.splice(input.args.indexOf('-compress'), 1);
            }
            if (input.args.includes('-c')) {
                scoredetailed = 0;
                input.args.splice(input.args.indexOf('-c'), 1);
            }

            input.args = msgfunc.cleanArgs(input.args);

            mapid = (await osufunc.mapIdFromLink(input.args.join(' '), true, input.config)).map;
            if (mapid != null) {
                input.args.splice(input.args.indexOf(input.args.find(arg => arg.includes('https://osu.ppy.sh/'))), 1);
            }

            user = input.args.join(' ');

            if (!input.args[0] || input.args.join(' ').includes(searchid) || user == undefined) {
                user = null;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.options.getString('username');
            mapid = input.obj.options.getNumber('id');
            sort = input.obj.options.getString('sort') as embedStuff.scoreSort;
            reverse = input.obj.options.getBoolean('reverse');

            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true;
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            page = 0;
            user = input.obj.message.embeds[0].author.url.split('users/')[1].split('/')[0];
            mode = input.obj.message.embeds[0].author.url.split('users/')[1].split('/')[1];
            mapid = input.obj.message.embeds[0].url.split('osu.ppy.sh/')[1].split('/')[1];
            if (input.obj.message.embeds[0].description) {
                const sort1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0];
                switch (true) {
                    case sort1.includes('score'):
                        sort = 'score';
                        break;
                    case sort1.includes('acc'):
                        sort = 'acc';
                        break;
                    case sort1.includes('pp'):
                        sort = 'pp';
                        break;
                    case sort1.includes('old'): case sort1.includes('recent'):
                        sort = 'recent';
                        break;
                    case sort1.includes('combo'):
                        sort = 'combo';
                        break;
                    case sort1.includes('miss'):
                        sort = 'miss';
                        break;
                    case sort1.includes('rank'):
                        sort = 'rank';
                        break;

                }


                const reverse1 = input.obj.message.embeds[0].description.split('sorted by ')[1].split('\n')[0];
                if (reverse1.includes('lowest') || reverse1.includes('oldest') || (reverse1.includes('most misses')) || (reverse1.includes('worst'))) {
                    reverse = true;
                } else {
                    reverse = false;
                }
                page = 0;
            }
            const pageParsed = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[0]);
            page = 0;
            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1;
                    break;
                case 'LeftArrow':
                    page = pageParsed - 1;
                    break;
                case 'RightArrow':
                    page = pageParsed + 1;
                    break;
                case 'BigRightArrow':
                    page = parseInt((input.obj.message.embeds[0].description).split('Page:')[1].split('/')[1].split('\n')[0]);

                    break;
                default:
                    page = pageParsed;
                    break;
            }
            switch (input.button) {
                case 'Detail0':
                    scoredetailed = 0;
                    break;
                case 'Detail1':
                    scoredetailed = 1;
                    break;
                case 'Detail2':
                    scoredetailed = 2;
                    break;
                default:
                    if (input.obj.message.embeds[0].footer.text.includes('LE')) {
                        scoredetailed = 2;
                    }
                    if (input.obj.message.embeds[0].footer.text.includes('LC')) {
                        scoredetailed = 0;
                    }
                    break;
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page;
        }
        if (input.overrides.sort != null) {
            sort = input.overrides.sort;
        }
        if (input.overrides.reverse != null) {
            reverse = input.overrides.reverse;
        }
        if (input.overrides.commandAs) {
            input.commandType = input.overrides.commandAs;
        }
        if (input.overrides.commanduser) {
            commanduser = input.overrides.commanduser;
            useContent = `Requested by <@${commanduser.id}>`;
        }
        if (input.overrides.user) {
            user = input.overrides.user;
        }
        if (input.overrides.id) {
            mapid = input.overrides.id;
        }
    }

    //==============================================================================================================================================================================================

    let buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Refresh-scores-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.refresh),
        );

    const checkDetails = await msgfunc.buttonsAddDetails('scores', commanduser, input.absoluteID, buttons, scoredetailed, embedStyle);
    buttons = checkDetails.buttons;
    embedStyle = checkDetails.embedStyle;

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'scores',
        options: [
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
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Detailed',
                value: scoredetailed
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('scores', commanduser, input.absoluteID);



    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = osufunc.modeValidator(mode);

    if (!mapid) {
        const temp = osufunc.getPreviousId('map', input.obj.guildId);
        mapid = temp.id;
    }
    if (mapid == false) {
        msgfunc.missingPrevID_map(input);
        return;
    }

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'scores', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    osufunc.debug(osudataReq, 'command', 'scores', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'scores', true, errors.noUser(user), true);
        return;

    }

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-User-scores-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.extras.user),
    );

    let mapdataReq: osufunc.apiReturn;
    if (func.findFile(mapid, 'mapdata') &&
        !('error' in func.findFile(mapid, 'mapdata')) &&
        input.button != 'Refresh'
    ) {
        mapdataReq = func.findFile(mapid, 'mapdata');
    } else {
        mapdataReq = await osufunc.apiget({
            type: 'map',
            config: input.config,
            params: {
                id: mapid
            }
        });
    }
    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'scores', true, errors.uErr.osu.map.m.replace('[ID]', mapid), false);
        return;
    }
    osufunc.debug(mapdataReq, 'command', 'scores', input.obj.guildId, 'mapData');
    if (mapdata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'scores', true, errors.uErr.osu.map.m.replace('[ID]', mapid), true);
        return;
    }

    let scoredataReq: osufunc.apiReturn;
    if (func.findFile(input.absoluteID, 'scores') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'scores')) &&
        input.button != 'Refresh'
    ) {
        scoredataReq = func.findFile(input.absoluteID, 'scores');
    } else {
        scoredataReq = await osufunc.apiget({
            type: 'user_get_scores_map',
            config: input.config,
            params: {
                userid: osudata.id,
                id: mapid,
            }
        });
    }

    const scoredataPresort: osuApiTypes.ScoreArrA = scoredataReq.apiData;
    if (scoredataReq?.error) {
        await msgfunc.errorAndAbort(input, 'scores', true, errors.uErr.osu.scores.map.replace('[ID]', user).replace('[MID]', mapid), false);
        return;
    }
    osufunc.debug(scoredataReq, 'command', 'scores', input.obj.guildId, 'scoreDataPresort');

    if (scoredataPresort?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'scores', true, errors.uErr.osu.scores.map.replace('[ID]', user).replace('[MID]', mapid), true);
        return;
    }

    func.storeFile(scoredataReq, input.absoluteID, 'scores');

    const scoredata: osuApiTypes.Score[] = scoredataPresort.scores;

    osufunc.debug(scoredataReq, 'command', 'scores', input.obj.guildId, 'scoreData');

    if (parseScore == true) {
        let pid = parseInt(parseId) - 1;
        if (pid < 0) {
            pid = 0;
        }
        if (pid > scoredata.length) {
            pid = scoredata.length - 1;
        }
        input.overrides = {
            mode: scoredata?.[0]?.mode ?? 'osu',
            id: scoredata.slice().sort((a, b) =>
                parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', ''))
            )?.[pid]?.best_id,
            commanduser,
            commandAs: input.commandType
        };
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await msgfunc.errorAndAbort(input, 'scores', true, `${errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.commandType = 'other';
        await scoreparse(input);
        return;
    }

    func.storeFile(mapdataReq, mapid, 'mapdata');

    const title = osufunc.parseUnicodeStrings({
        title: mapdata.beatmapset.title,
        artist: mapdata.beatmapset.artist,
        title_unicode: mapdata.beatmapset.title_unicode,
        artist_unicode: mapdata.beatmapset.artist_unicode,
        ignore: {
            artist: false,
            title: false
        }
    }, 1);

    const scoresEmbed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setColor(colours.embedColour.scorelist.dec)
        .setTitle(`\`${title} \n[${mapdata.version}]\``)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setImage(`${mapdata.beatmapset.covers['cover@2x']}`)
        .setAuthor({
            name: `${osudata.username} | #${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}/${osufunc.modeValidator(mode)}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setURL(`https://osu.ppy.sh/b/${mapid}`);

    if (page >= Math.ceil(scoredata.length / 5)) {
        page = Math.ceil(scoredata.length / 5) - 1;
    }

    const scoresarg = await embedStuff.scoreList(
        {
            scores: scoredata,
            detailed: scoredetailed,
            showWeights: false,
            page: page,
            showMapTitle: false,
            showTruePosition: false,
            sort: sort,
            truePosType: sort,
            filteredMapper: filteredMapper,
            filteredMods: filteredMods,
            filterMapTitle: null,
            filterRank,
            reverse: reverse,
            mapidOverride: mapdata.id,
            exactMods,
            pp,
            score,
            acc,
            combo,
            miss,
            bpm
        },
        {
            useScoreMap: false,
            overrideMapLastDate: mapdata.last_updated
        }, input.config);
    scoresEmbed.setDescription(`${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${scoresarg.maxPages}\nmode: ${mode}\n`);
    if (scoresarg.fields.length == 0) {
        scoresEmbed.addFields([{
            name: 'Error',
            value: 'No scores found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        switch (scoredetailed) {
            case 0: case 2: {
                let temptxt = '\n' + scoresarg.string.join('');
                scoresEmbed.setDescription(
                    `${scoresarg.filter}\nPage: ${scoresarg.usedPage + 1}/${scoresarg.maxPages}\n${input.config.useEmojis.gamemodes ? emojis.gamemodes[mode] : mode}`
                    + temptxt
                );
            }
                break;
            case 1: default: {
                scoresEmbed.addFields(scoresarg.fields);
            }
                break;
        }
    }


    osufunc.writePreviousId('user', input.obj.guildId, { id: `${osudata.id}`, apiData: null, mods: null });
    osufunc.writePreviousId('map', input.obj.guildId,
        {
            id: `${mapdata.id}`,
            apiData: null,
            mods: filteredMods
        }
    );

    if (scoresarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: useContent,
            embeds: [scoresEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'scores',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'scores',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * statistics for scores
 */
export async function scorestats(input: extypes.commandInput) {

    let commanduser: Discord.User;
    type scoretypes = 'firsts' | 'best' | 'recent' | 'pinned';
    let scoreTypes: scoretypes = 'best';
    let user = null;
    let searchid;
    let mode: osuApiTypes.GameMode;

    let reachedMaxCount = false;

    const embedStyle: extypes.osuCmdStyle = 'A';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            if (input.args.includes('-firsts')) {
                scoreTypes = 'firsts';
                input.args.splice(input.args.indexOf('-firsts'), 1);
            }
            if (input.args.includes('-first')) {
                scoreTypes = 'firsts';
                input.args.splice(input.args.indexOf('-first'), 1);
            }
            if (input.args.includes('-globals')) {
                scoreTypes = 'firsts';
                input.args.splice(input.args.indexOf('-globals'), 1);
            }
            if (input.args.includes('-global')) {
                scoreTypes = 'firsts';
                input.args.splice(input.args.indexOf('-global'), 1);
            }
            if (input.args.includes('-osutop')) {
                scoreTypes = 'best';
                input.args.splice(input.args.indexOf('-osutop'), 1);
            }
            if (input.args.includes('-top')) {
                scoreTypes = 'best';
                input.args.splice(input.args.indexOf('-top'), 1);
            }
            if (input.args.includes('-recent')) {
                scoreTypes = 'recent';
                input.args.splice(input.args.indexOf('-recent'), 1);
            }
            if (input.args.includes('-r')) {
                scoreTypes = 'recent';
                input.args.splice(input.args.indexOf('-r'), 1);
            }
            if (input.args.includes('-pinned')) {
                scoreTypes = 'pinned';
                input.args.splice(input.args.indexOf('-pinned'), 1);
            }
            if (input.args.includes('-pins')) {
                scoreTypes = 'pinned';
                input.args.splice(input.args.indexOf('-pins'), 1);
            }
            if (input.args.includes('-pin')) {
                scoreTypes = 'pinned';
                input.args.splice(input.args.indexOf('-pin'), 1);
            }

            input.args = msgfunc.cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null;
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            input.obj.options.getString('user') ? user = input.obj.options.getString('user') : null;
            input.obj.options.getString('type') ? scoreTypes = input.obj.options.getString('type') as scoretypes : null;
            input.obj.options.getString('mode') ? mode = input.obj.options.getString('mode') as osuApiTypes.GameMode : null;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            user = input.obj.message.embeds[0].author.url.split('/users/')[1].split('/')[0];
            mode = input.obj.message.embeds[0].author.url.split('/users/')[1].split('/')[1] as osuApiTypes.GameMode;
            //user's {type} scores
            scoreTypes = input.obj.message.embeds[0].title.split(' scores')[0].split(' ')[0].toLowerCase() as scoretypes;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
        }
            break;
    }
    //==============================================================================================================================================================================================

    //detailed button

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Details-scorestats-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailed),
        );

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'score stats',
        options: [
            {
                name: 'Score Type',
                value: scoreTypes
            },
            {
                name: 'User',
                value: user
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Search ID',
                value: searchid
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = mode ? osufunc.modeValidator(mode) : null;

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'scorestats', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    osufunc.debug(osudataReq, 'command', 'scorestats', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'scorestats', true, errors.noUser(user), true);
        return;
    }

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-User-scorestats-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.extras.user),
    );

    let scoresdata: osuApiTypes.Score[] & osuApiTypes.Error = [];

    async function getScoreCount(cinitnum) {
        const req: osufunc.apiReturn = await osufunc.apiget({
            type: scoreTypes,
            config: input.config,
            params: {
                userid: `${osudata.id}`,
                opts: [`offset=${cinitnum}`, 'limit=100', `mode=${osufunc.modeValidator(mode)}`],
            },
            version: 2,

        });
        const fd: osuApiTypes.Score[] & osuApiTypes.Error = req.apiData;
        if (req?.error) {
            await msgfunc.errorAndAbort(input, 'scorestats', true, errors.uErr.osu.scores.best.replace('[ID]', user).replace('top', scoreTypes == 'best' ? 'top' : scoreTypes), false);
            return;
        }
        if (fd?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'scorestats', true, errors.uErr.osu.scores.best.replace('[ID]', user).replace('top', scoreTypes == 'best' ? 'top' : scoreTypes), true);
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }
            await scoresdata.push(fd[i]);
        }
        if (fd.length == 100 && (scoreTypes == 'firsts' || scoreTypes == 'pinned')) {
            reachedMaxCount = true;
        }
    }
    if (func.findFile(input.absoluteID, 'reqdata') &&
        input.commandType == 'button' &&
        !('error' in func.findFile(input.absoluteID, 'reqdata')) &&
        input.button != 'Refresh'
    ) {
        scoresdata = func.findFile(input.absoluteID, 'reqdata');
    } else {
        await getScoreCount(0);
    }
    func.storeFile(scoresdata, input.absoluteID, 'reqdata');

    let useFiles: string[] = [];

    const Embed: Discord.EmbedBuilder = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setTitle(`Statistics for ${osudata.username}'s ${scoreTypes} scores`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}/${osufunc.modeValidator(mode)}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        });
    if (scoresdata.length == 0) {
        Embed.setDescription('No scores found');
    } else {
        Embed.setDescription(`${func.separateNum(scoresdata.length)} scores found\n${reachedMaxCount ? 'Only first 100 scores are calculated' : ''}`);
        const mappers = calc.findMode(scoresdata.map(x => x.beatmapset.creator));
        const mods = calc.findMode(scoresdata.map(x => {
            return x.mods.length == 0 ?
                'NM' :
                x.mods.join('');
        }));
        const grades = calc.findMode(scoresdata.map(x => x.rank));
        const acc = osufunc.Stats(scoresdata.map(x => x.accuracy));
        const pp = osufunc.Stats(scoresdata.map(x => x.pp));
        const combo = osufunc.Stats(scoresdata.map(x => x.max_combo));


        if (input.commandType == 'button') {
            let mappersStr = '';
            for (let i = 0; i < mappers.length; i++) {
                mappersStr += `#${i + 1}. ${mappers[i].string} - ${func.separateNum(mappers[i].count)} | ${mappers[i].percentage.toFixed(2)}%\n`;
            }
            let modsStr = '';
            for (let i = 0; i < mods.length; i++) {
                modsStr += `#${i + 1}. ${mods[i].string} - ${func.separateNum(mods[i].count)} | ${mods[i].percentage.toFixed(2)}%\n`;
            }
            let gradesStr = '';
            for (let i = 0; i < grades.length; i++) {
                gradesStr += `#${i + 1}. ${grades[i].string} - ${func.separateNum(grades[i].count)} | ${grades[i].percentage.toFixed(2)}%\n`;
            }

            const MappersPath = `${path}/cache/commandData/${input.absoluteID}Mappers.txt`;
            const ModsPath = `${path}/cache/commandData/${input.absoluteID}Mods.txt`;
            const RanksPath = `${path}/cache/commandData/${input.absoluteID}Ranks.txt`;

            fs.writeFileSync(MappersPath, mappersStr, 'utf-8');
            fs.writeFileSync(ModsPath, modsStr, 'utf-8');
            fs.writeFileSync(RanksPath, gradesStr, 'utf-8');
            useFiles = [MappersPath, ModsPath, RanksPath];
        } else {
            let mappersStr = '';
            for (let i = 0; i < mappers.length && i < 5; i++) {
                mappersStr += `#${i + 1}. ${mappers[i].string} - ${func.separateNum(mappers[i].count)} | ${mappers[i].percentage.toFixed(2)}%\n`;
            }
            let modsStr = '';
            for (let i = 0; i < mods.length && i < 5; i++) {
                modsStr += `#${i + 1}. ${mods[i].string} - ${func.separateNum(mods[i].count)} | ${mods[i].percentage.toFixed(2)}%\n`;
            }
            let gradesStr = '';
            for (let i = 0; i < grades.length && i < 5; i++) {
                gradesStr += `#${i + 1}. ${grades[i].string} - ${func.separateNum(grades[i].count)} | ${grades[i].percentage.toFixed(2)}%\n`;
            }


            Embed.addFields([{
                name: 'Mappers',
                value: mappersStr.length == 0 ?
                    'No data available' :
                    mappersStr,
                inline: true,
            },
            {
                name: 'Mods',
                value: modsStr.length == 0 ?
                    'No data available' :
                    modsStr,
                inline: true
            },
            {
                name: 'Ranks',
                value: gradesStr.length == 0 ?
                    'No data available' :
                    gradesStr,
                inline: true
            },
            {
                name: 'Accuracy',
                value: `
Highest: ${(acc?.highest * 100)?.toFixed(2)}%
Lowest: ${(acc?.lowest * 100)?.toFixed(2)}%
Average: ${(acc?.mean * 100)?.toFixed(2)}%
Median: ${(acc?.median * 100)?.toFixed(2)}%
${acc?.ignored > 0 ? `Skipped: ${acc?.ignored}` : ''}
`,
                inline: true
            },
            {
                name: 'PP',
                value: `
Highest: ${pp?.highest?.toFixed(2)}pp
Lowest: ${pp?.lowest?.toFixed(2)}pp
Average: ${pp?.mean?.toFixed(2)}pp
Median: ${pp?.median?.toFixed(2)}pp
${pp?.ignored > 0 ? `Skipped: ${pp?.ignored}` : ''}
`,
                inline: true
            },
            {
                name: 'Combo',
                value: `
Highest: ${combo?.highest}
Lowest: ${combo?.lowest}
Average: ${Math.floor(combo?.mean)}
Median: ${combo?.median}
${combo?.ignored > 0 ? `Skipped: ${combo?.ignored}` : ''}
`,
                inline: true
            }
            ]);
        }
    }



    //SEND/EDIT MSG==============================================================================================================================================================================================
    if (input.commandType == 'button') {
        input.obj = input.obj as Discord.ButtonInteraction;
        input.obj.reply({
            files: useFiles,
            ephemeral: true
        }).catch(error => {
            (input.obj as Discord.ButtonInteraction).editReply({
                files: useFiles,
            });
        });


    } else {
        const finalMessage = await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                embeds: [Embed],
                edit: true,
                components: [buttons],
                files: useFiles
            }
        }, input.canReply);
        if (finalMessage == true) {
            log.logCommand({
                event: 'Success',
                commandName: 'scorestats',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                config: input.config,
            });
        } else {
            log.logCommand({
                event: 'Error',
                commandName: 'scorestats',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                config: input.config,
                customString: 'Message failed to send'
            });
        }
        return;
    }

    log.logCommand({
        event: 'Success',
        commandName: 'scorestats',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
        config: input.config,
    });

}


/**
 * simulate play on a map
 */
export async function simulate(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let mapid = null;
    let mods = null;
    let acc = null;
    let combo = null;
    let n300 = null;
    let n100 = null;
    let n50 = null;
    let nMiss = null;
    let overrideSpeed = 1;
    let overrideBpm: number = null;

    const embedStyle: extypes.osuCmdStyle = 'S';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
            const ctn = input.obj.content;
            if (ctn.includes('-mods')) {
                const temp = func.parseArg(input.args, '-mods', 'string', mods);
                mods = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-acc')) {
                const temp = func.parseArg(input.args, '-acc', 'number', acc);
                acc = temp.value;
                input.args = temp.newArgs;

            }
            if (ctn.includes('-accuracy')) {
                const temp = func.parseArg(input.args, '-accuracy', 'number', acc);
                acc = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-combo')) {
                const temp = func.parseArg(input.args, '-combo', 'number', combo);
                combo = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-n300')) {
                const temp = func.parseArg(input.args, '-n300', 'number', n300);
                n300 = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-300s')) {
                const temp = func.parseArg(input.args, '-300s', 'number', n300);
                n300 = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-n100')) {
                const temp = func.parseArg(input.args, '-n100', 'number', n100);
                n100 = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-100s')) {
                const temp = func.parseArg(input.args, '-100s', 'number', n100);
                n100 = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-n50')) {
                const temp = func.parseArg(input.args, '-n50', 'number', n50);
                n50 = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-50s')) {
                const temp = func.parseArg(input.args, '-50s', 'number', n50);
                n50 = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-miss')) {
                const temp = func.parseArg(input.args, '-miss', 'number', nMiss);
                nMiss = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('-misses')) {
                const temp = func.parseArg(input.args, '-misses', 'number', nMiss);
                nMiss = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-bpm')) {
                const temp = func.parseArg(input.args, '-bpm', 'number', overrideBpm);
                overrideBpm = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-speed')) {
                const temp = func.parseArg(input.args, '-speed', 'number', overrideSpeed);
                overrideSpeed = temp.value;
                input.args = temp.newArgs;
            }
            if (ctn.includes('mods=')) {
                mods = ctn.split('mods=')[1].split(' ')[0];
            }
            if (ctn.includes('acc=')) {
                acc = parseFloat(ctn.split('acc=')[1].split(' ')[0]);
            }
            if (ctn.includes('accuracy=')) {
                acc = parseFloat(ctn.split('accuracy=')[1].split(' ')[0]);
            }
            if (ctn.includes('combo=')) {
                combo = parseInt(ctn.split('combo=')[1].split(' ')[0]);
            }
            if (ctn.includes('n300=')) {
                n300 = parseInt(ctn.split('n300=')[1].split(' ')[0]);
            }
            if (ctn.includes('300s=')) {
                n300 = parseInt(ctn.split('300s=')[1].split(' ')[0]);
            }
            if (ctn.includes('n100=')) {
                n100 = parseInt(ctn.split('n100=')[1].split(' ')[0]);
            }
            if (ctn.includes('100s=')) {
                n100 = parseInt(ctn.split('100s=')[1].split(' ')[0]);
            }
            if (ctn.includes('n50=')) {
                n50 = parseInt(ctn.split('n50=')[1].split(' ')[0]);
            }
            if (ctn.includes('50s=')) {
                n50 = parseInt(ctn.split('50s=')[1].split(' ')[0]);
            }
            if (ctn.includes('miss=')) {
                nMiss = parseInt(ctn.split('miss=')[1].split(' ')[0]);
            }
            if (ctn.includes('misses=')) {
                nMiss = parseInt(ctn.split('misses=')[1].split(' ')[0]);
            }
            if (input.args.includes('bpm=')) {
                overrideBpm = parseFloat(ctn.split('bpm=')[1].split(' ')[0]);
            }
            if (input.args.includes('speed=')) {
                overrideSpeed = parseFloat(ctn.split('speed=')[1].split(' ')[0]);
            }
            input.args = msgfunc.cleanArgs(input.args);

            if (ctn.includes('+')) {
                mods = ctn.split('+')[1].split(' ')[0];
                let i = 0;
                for (; i < input.args.length; i++) {
                    if (input.args[i].includes('+')) {
                        break;
                    }
                }
                input.args = input.args.slice(0, i).concat(input.args.slice(i + 1, input.args.length));
            }
            mapid = (await osufunc.mapIdFromLink(input.args.join(' '), true, input.config)).map;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            mapid = input.obj.options.getInteger('id');
            mods = input.obj.options.getString('mods');
            acc = input.obj.options.getNumber('accuracy');
            combo = input.obj.options.getInteger('combo');
            n300 = input.obj.options.getInteger('n300');
            n100 = input.obj.options.getInteger('n100');
            n50 = input.obj.options.getInteger('n50');
            nMiss = input.obj.options.getInteger('miss');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        commandName: 'simulate',
        object: input.obj,
        options: [
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Mods',
                value: mods
            },
            {
                name: 'Accuracy',
                value: acc
            },
            {
                name: 'Combo',
                value: combo
            },
            {
                name: 'n300',
                value: n300
            },
            {
                name: 'n100',
                value: n100
            },
            {
                name: 'n50',
                value: n50
            },
            {
                name: 'Misses',
                value: nMiss
            },
            {
                name: 'Override BPM',
                value: overrideBpm
            },
            {
                name: 'Override Speed',
                value: overrideSpeed
            },
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (!mapid) {
        const temp = osufunc.getPreviousId('map', input.obj.guildId);
        mapid = temp.id;
    }
    if (mapid == false) {
        msgfunc.missingPrevID_map(input);
        return;
    }

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    const tempscore = osufunc.getPreviousId('score', input.obj.guildId);
    if (tempscore?.apiData && tempscore?.apiData.beatmap.id == mapid) {
        if (!n300 && !n100 && !n50 && !acc) {
            n300 = tempscore.apiData.statistics.count_300;
            n100 = tempscore.apiData.statistics.count_100;
            n50 = tempscore.apiData.statistics.count_50;
            acc = tempscore.apiData.accuracy * 100;
        }
        if (!nMiss) {
            nMiss = tempscore.apiData.statistics.count_miss;
        }
        if (!combo) {
            combo = tempscore.apiData.max_combo;
        }
        if (!mods) {
            mods = tempscore.apiData.mods.join('');
        }
    }


    let mapdataReq: osufunc.apiReturn;

    if (func.findFile(mapid, 'mapdata') &&
        !('error' in func.findFile(mapid, 'mapdata')) &&
        input.button != 'Refresh') {
        mapdataReq = func.findFile(mapid, 'mapdata');
    } else {
        mapdataReq = await osufunc.apiget({
            type: 'map_get',
            config: input.config,
            params: {
                id: mapid
            }
        });
    }

    const mapdata: osuApiTypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'simulate', true, errors.uErr.osu.map.m.replace('[ID]', mapid), false);
        return;
    }
    osufunc.debug(mapdataReq, 'command', 'map', input.obj.guildId, 'mapData');

    if (mapdata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'simulate', true, errors.uErr.osu.map.m.replace('[ID]', mapid), true);
        return;
    }
    func.storeFile(mapdataReq, mapid, 'mapdata');



    if (!mods) {
        mods = 'NM';
    }
    if (!combo) {
        combo = undefined;
    }

    if (overrideBpm && !overrideSpeed) {
        overrideSpeed = overrideBpm / mapdata.bpm;
    }
    if (overrideSpeed && !overrideBpm) {
        overrideBpm = overrideSpeed * mapdata.bpm;
    }

    if (mods.includes('DT') || mods.includes('NC')) {
        overrideSpeed *= 1.5;
        overrideBpm *= 1.5;
    }
    if (mods.includes('HT')) {
        overrideSpeed *= 0.75;
        overrideBpm *= 1.5;
    }

    const score = await osufunc.scorecalc({
        mods,
        gamemode: 'osu',
        mapid,
        hit300: n300,
        hit100: n100,
        hit50: n50,
        miss: nMiss,
        acc: acc,
        maxcombo: combo,
        score: null,
        calctype: 0,
        clockRate: overrideSpeed
    }, new Date(mapdata.last_updated), input.config);
    osufunc.debug(score, 'command', 'simulate', input.obj.guildId, 'ppCalc');

    let use300s = (n300 ?? 0);
    let gotTot = (n300 ?? 0) + (n100 ?? 0) + (n50 ?? 0) + (nMiss ?? 0);
    if (gotTot != mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners) {
        while (use300s < (mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners)) {
            use300s++;
        }
    }

    const useAcc = osumodcalc.calcgrade(
        use300s,
        n100 ?? 0,
        n50 ?? 0,
        nMiss ?? 0
    );


    const mapPerf = await osufunc.mapcalc({
        mods,
        gamemode: 'osu',
        mapid,
        calctype: 0,
        clockRate: overrideSpeed
    }, new Date(mapdata.last_updated), input.config);

    const title = osufunc.parseUnicodeStrings({
        title: mapdata.beatmapset.title,
        artist: mapdata.beatmapset.artist,
        title_unicode: mapdata.beatmapset.title_unicode,
        artist_unicode: mapdata.beatmapset.artist_unicode,
        ignore: {
            artist: true,
            title: false
        }
    }, 1) + ` [${mapdata.version}]`;
    const mxCombo = score[0].difficulty.maxCombo;
    const scoreEmbed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setTitle(`Simulated play on \n\`${title}\``)
        .setURL(`https://osu.ppy.sh/b/${mapid}`)
        .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg` || `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
        .addFields([
            {
                name: 'Score Details',
                value:
                    `${(acc ?? useAcc?.accuracy)?.toFixed(2)}% | ${nMiss ?? 0}x misses
${combo ?? mxCombo}x/**${mxCombo}**x
${mods ?? 'No mods'}
\`${n300}/${n100}/${n50}/${nMiss}\`
Speed: ${overrideSpeed ?? 1}x (${overrideBpm ?? mapdata.bpm}BPM)
`,
                inline: false
            },
            {
                name: 'Performance',
                value:
                    `
${score[0].pp?.toFixed(2)}pp | ${score[1].pp?.toFixed(2)}pp if ${(acc ?? useAcc?.accuracy)?.toFixed(2)}% FC
SS: ${mapPerf[0].pp?.toFixed(2)}
99: ${mapPerf[1].pp?.toFixed(2)}
98: ${mapPerf[2].pp?.toFixed(2)}
97: ${mapPerf[3].pp?.toFixed(2)}
96: ${mapPerf[4].pp?.toFixed(2)}
95: ${mapPerf[5].pp?.toFixed(2)} 
`
            },
            {
                name: 'Map Details',
                value:
                    `
CS${mapdata.cs.toString().padEnd(5, ' ')}
AR${mapdata.ar.toString().padEnd(5, ' ')}
OD${mapdata.accuracy.toString().padEnd(5, ' ')}
HP${mapdata.drain.toString().padEnd(5, ' ')}
${emojis.mapobjs.total_length}${calc.secondsToTime(mapdata.total_length)}
                `,
                inline: true
            },
            {
                name: def.invisbleChar,
                value:
                    `
${emojis.mapobjs.circle}${mapdata.count_circles}
${emojis.mapobjs.slider}${mapdata.count_sliders}
${emojis.mapobjs.spinner}${mapdata.count_spinners}
${emojis.mapobjs.bpm}${mapdata.bpm}
${emojis.mapobjs.star}${(score[0]?.difficulty?.stars ?? mapdata.difficulty_rating)?.toFixed(2)}
                `,
                inline: true
            },
        ]);

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [scoreEmbed],
            edit: true
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'simulate',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'simulate',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }

}

//map

/**
 * parse map and return map data
 */
export async function map(input: extypes.commandInput) {
    let commanduser: Discord.User;

    let mapid;
    let mapmods: string;
    let maptitleq: string = null;
    let detailed: number = 1;
    let isppCalc: boolean = false;
    const searchRestrict = 'any';
    let overrideSpeed = 1;
    let overrideBpm: number = null;

    const useComponents = [];
    const useFiles = [];
    let overwriteModal = null;

    let customCS: 'current' | number = 'current';
    let customAR: 'current' | number = 'current';
    let customOD: 'current' | number = 'current';
    let customHP: 'current' | number = 'current';

    let useContent: string = '';

    let showBg = false;

    let embedStyle: extypes.osuCmdStyle = 'M';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;

            if (input.args.includes('-detailed')) {
                detailed = 2;
                input.args.splice(input.args.indexOf('-detailed'), 1);
            }
            if (input.args.includes('-d')) {
                detailed = 2;
                input.args.splice(input.args.indexOf('-d'), 1);
            }
            if (input.args.includes('-bpm')) {
                const temp = func.parseArg(input.args, '-bpm', 'number', overrideBpm);
                overrideBpm = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-speed')) {
                const temp = func.parseArg(input.args, '-speed', 'number', overrideSpeed);
                overrideSpeed = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-cs')) {
                const temp = func.parseArg(input.args, '-cs', 'number', customCS);
                customCS = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-ar')) {
                const temp = func.parseArg(input.args, '-ar', 'number', customAR);
                customAR = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-od')) {
                const temp = func.parseArg(input.args, '-od', 'number', customOD);
                customOD = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-accuracy')) {
                const temp = func.parseArg(input.args, '-accuracy', 'number', customOD);
                customOD = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-hp')) {
                const temp = func.parseArg(input.args, '-hp', 'number', customHP);
                customHP = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-drain')) {
                const temp = func.parseArg(input.args, '-drain', 'number', customHP);
                customHP = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', maptitleq, true);
                maptitleq = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.join(' ').includes('"')) {
                maptitleq = input.args.join(' ').substring(
                    input.args.join(' ').indexOf('"') + 1,
                    input.args.join(' ').lastIndexOf('"')
                );
                input.args = input.args.join(' ').replace(maptitleq, '').split(' ');
            }
            if (input.args.join(' ').includes('+')) {
                mapmods = input.args.join(' ').split('+')[1];
                mapmods.includes(' ') ? mapmods = mapmods.split(' ')[0] : null;
                input.args = input.args.join(' ').replace('+', '').replace(mapmods, '').split(' ');
            }

            if (input.args.includes('-bg')) {
                showBg = true;
            }

            if (input.args.includes('-calc')) {
                isppCalc = true;
                input.args.splice(input.args.indexOf('-calc'), 1);
            }
            if (input.args.includes('-pp')) {
                isppCalc = true;
                input.args.splice(input.args.indexOf('-pp'), 1);
            }

            input.args = msgfunc.cleanArgs(input.args);

            mapid = (await osufunc.mapIdFromLink(input.args.join(' '), true, input.config)).map;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;

            mapid = input.obj.options.getInteger('id');
            mapmods = input.obj.options.getString('mods');
            detailed = input.obj.options.getBoolean('detailed') ? 2 : 1;
            maptitleq = input.obj.options.getString('query');
            input.obj.options.getNumber('bpm') ? overrideBpm = input.obj.options.getNumber('bpm') : null;
            input.obj.options.getNumber('speed') ? overrideSpeed = input.obj.options.getNumber('speed') : null;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            const urlnohttp = input.obj.message.embeds[0].url.split('https://')[1];
            const setid = urlnohttp.split('/')[2].split('#')[0];
            const curid = urlnohttp.split('/')[3];
            mapid = curid;

            if (input.obj.message.embeds[0].footer.text.includes('ME')) {
                detailed = 2;
            }

            mapmods = input.obj.message.embeds[0].title.split('+')[1];
            if (input.button == 'DetailEnable') {
                detailed = 2;
            }
            if (input.button == 'DetailDisable') {
                detailed = 1;
            }
            if (input.button == 'Refresh') {
                mapid = curid;
            }
            if (input.obj.message.embeds[0].fields[0].value.includes('=>')) {
                overrideBpm = parseFloat(input.obj.message.embeds[0].fields[0].value.split('=>')[1].split('\n')[0]);
            }
            if (input.obj.message.embeds[0].footer.text.includes('MP')) {
                isppCalc = true;
            }
        }
            break;

        case 'link': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;

            const messagenohttp = input.obj.content.replace('https://', '').replace('http://', '').replace('www.', '');
            mapmods =
                input.obj.content.includes('+') ?
                    messagenohttp.split('+')[1] : 'NM';
            if (input.args[0] && input.args[0].startsWith('query')) {
                maptitleq = input.args[1];
            } else if (
                (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmapsets/') && messagenohttp.includes('#'))) ||
                (!messagenohttp.includes('/s/') && (messagenohttp.includes('/b/'))) ||
                (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmaps/')))
            ) {
                let idfirst;
                try {
                    if (messagenohttp.includes('beatmapsets')) {

                        idfirst = messagenohttp.split('#')[1].split('/')[1];
                    } else if (messagenohttp.includes('?')) {
                        idfirst = messagenohttp.split('beatmaps/')[1].split('?')[0];
                    }
                    else {
                        idfirst = messagenohttp.split('/')[messagenohttp.split('/').length - 1];
                    }
                    if (isNaN(+idfirst)) {
                        mapid = parseInt(idfirst.split(' ')[0]);
                    } else {
                        mapid = parseInt(idfirst);
                    }
                } catch (error) {
                    await msgfunc.sendMessage({
                        commandType: input.commandType,
                        obj: input.obj,
                        args: {
                            content: errors.uErr.osu.map.url,
                            edit: true
                        }
                    }, input.canReply);
                    return;
                }
            } else if (messagenohttp.includes('q=')) {
                maptitleq =
                    messagenohttp.includes('&') ?
                        messagenohttp.split('q=')[1].split('&')[0] :
                        messagenohttp.split('q=')[1];
            } else {
                let setid = 910392;
                if (!messagenohttp.includes('/beatmapsets/')) {
                    setid = +messagenohttp.split('/s/')[1];

                    if (isNaN(setid)) {
                        setid = +messagenohttp.split('/s/')[1].split(' ')[0];
                    }
                } else if (!messagenohttp.includes('/s/')) {
                    setid = +messagenohttp.split('/beatmapsets/')[1];

                    if (isNaN(setid)) {
                        setid = +messagenohttp.split('/s/')[1].split(' ')[0];
                    }
                }
                let bmsdataReq: osufunc.apiReturn;
                if (func.findFile(setid, `bmsdata`) &&
                    !('error' in func.findFile(setid, `bmsdata`)) &&
                    input.button != 'Refresh') {
                    bmsdataReq = func.findFile(setid, `bmsdata`);
                } else {
                    bmsdataReq = await osufunc.apiget({
                        type: 'mapset_get',
                        config: input.config,
                        params: {
                            id: setid
                        }
                    });
                    // bmsdataReq = await osufunc.apiget('mapset_get', `${setid}`)
                }

                const bmsdata: osuApiTypes.Beatmapset = bmsdataReq.apiData;
                if (bmsdataReq?.error) {
                    await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.ms.replace('[ID]', `${setid}`), false);
                    return;
                }
                if (bmsdata?.hasOwnProperty('error')) {
                    await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.ms.replace('[ID]', `${setid}`), false);
                    return;
                }
                try {
                    mapid = bmsdata.beatmaps[0].id;
                } catch (error) {
                    await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.ms.replace('[ID]', `${setid}`), false);
                }
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides?.overwriteModal != null) {
            overwriteModal = input?.overrides?.overwriteModal ?? overwriteModal;
        }
        if (input.overrides?.id != null) {
            mapid = input?.overrides?.id ?? mapid;
        }
        if (input.overrides?.commanduser != null) {
            commanduser = input.overrides.commanduser;
            useContent = `Requested by <@${commanduser.id}>\n`;
        }
        if (input.overrides?.commandAs != null) {
            input.commandType = input.overrides.commandAs;
        }
        if (input.overrides?.filterMods != null) {
            mapmods = input.overrides.filterMods;
        }
        if (input.overrides?.ex != null) {
            useContent += input.overrides?.ex;
        }
        if (input.overrides?.type != null) {
            isppCalc = true;
        }
    }

    //==============================================================================================================================================================================================

    const buttons = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-Refresh-map-${commanduser.id}-${input.absoluteID}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.main.refresh),
    );

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'map',
        options: [
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Map Mods',
                value: mapmods
            },
            {
                name: 'Map Title Query',
                value: maptitleq
            },
            {
                name: 'Detailed',
                value: `${detailed}`
            },
            {
                name: 'BPM',
                value: overrideBpm
            },
            {
                name: 'Speed',
                value: overrideSpeed
            },
            {
                name: 'cs',
                value: customCS
            },
            {
                name: 'ar',
                value: customAR
            },
            {
                name: 'od',
                value: customOD
            },
            {
                name: 'hp',
                value: customHP
            },
            {
                name: 'ppCalc',
                value: isppCalc
            }
        ],
    });
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================


    if (!mapid) {
        const temp = osufunc.getPreviousId('map', input.obj.guildId);
        mapid = temp.id;
        if (!mapmods || osumodcalc.OrderMods(mapmods).length == 0) {
            mapmods = temp.mods;
        }
    }
    if (mapid == false) {
        msgfunc.missingPrevID_map(input);
        return;
    }
    if (isppCalc) {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Map-map-${commanduser.id}-${input.absoluteID}-${mapid}${mapmods && mapmods != 'NM' ? '+' + mapmods : ''}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.map)
        );
    } else {
        if (detailed == 2) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-DetailDisable-map-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.detailLess)
            );
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-DetailEnable-map-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.detailMore)
            );
        }
    }
    let mapdataReq: osufunc.apiReturn;
    let mapdata: osuApiTypes.Beatmap;
    let bmsdataReq: osufunc.apiReturn;
    let bmsdata: osuApiTypes.Beatmapset;

    const inputModalDiff = new Discord.StringSelectMenuBuilder()
        .setCustomId(`${mainconst.version}-Select-map-${commanduser.id}-${input.absoluteID}-diff`)
        .setPlaceholder('Select a difficulty');
    const inputModalSearch = new Discord.StringSelectMenuBuilder()
        .setCustomId(`${mainconst.version}-Select-map-${commanduser.id}-${input.absoluteID}-search`)
        .setPlaceholder('Select a map');

    //fetch map data and mapset data from id
    if (maptitleq == null) {
        if (func.findFile(mapid, 'mapdata') &&
            !('error' in func.findFile(mapid, 'mapdata')) &&
            input.button != 'Refresh') {
            mapdataReq = func.findFile(mapid, 'mapdata');
        } else {
            mapdataReq = await osufunc.apiget({
                type: 'map_get',
                config: input.config,
                params: {
                    id: mapid
                }
            });
        }

        mapdata = mapdataReq.apiData;
        osufunc.debug(mapdataReq, 'command', 'map', input.obj.guildId, 'mapData');
        if (mapdataReq?.error) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.m.replace('[ID]', `${mapid}`), false);
            return;
        }
        if (mapdata?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.m.replace('[ID]', `${mapid}`), false);
            return;
        }

        func.storeFile(mapdataReq, mapid, 'mapdata');

        if (func.findFile(mapdata.beatmapset_id, `bmsdata`) &&
            !('error' in func.findFile(mapdata.beatmapset_id, `bmsdata`)) &&
            input.button != 'Refresh') {
            bmsdataReq = func.findFile(mapdata.beatmapset_id, `bmsdata`);
        } else {
            bmsdataReq = await osufunc.apiget(
                {
                    type: 'mapset_get',
                    config: input.config,
                    params: {
                        id: mapdata.beatmapset_id
                    }
                });
        }
        bmsdata = bmsdataReq.apiData;
        if (bmsdataReq?.error) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.ms.replace('[ID]', `${mapdata.beatmapset_id}`), false);
            return;
        }
        osufunc.debug(bmsdataReq, 'command', 'map', input.obj.guildId, 'bmsData');

        if (bmsdata?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.ms.replace('[ID]', `${mapdata.beatmapset_id}`), true);

            return;
        }

        func.storeFile(bmsdataReq, mapdata.beatmapset_id, `bmsdata`);
    }

    //fetch mapdata and mapset data from title query
    if (maptitleq != null) {
        const mapidtestReq = await osufunc.apiget({
            type: 'mapset_search',
            config: input.config,
            params: {
                searchString: encodeURIComponent(maptitleq),
                opts: [`s=${searchRestrict}`]
            }
        });
        const mapidtest = mapidtestReq.apiData as osuApiTypes.BeatmapsetSearch;
        if (mapidtestReq?.error) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.search, false);
            return;
        }
        osufunc.debug(mapidtestReq, 'command', 'map', input.obj.guildId, 'mapIdTestData');
        func.storeFile(mapidtestReq, maptitleq.replace(/[\W_]+/g, '').replaceAll(' ', '_'), 'mapQuerydata');

        if (mapidtest?.hasOwnProperty('error') && !mapidtest.hasOwnProperty('beatmapsets')) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.search, true);
            return;
        }

        let usemapidpls;
        let mapidtest2;

        if (mapidtest.beatmapsets.length == 0) {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: errors.uErr.osu.map.search_nf.replace('[INPUT]', maptitleq),
                    edit: true
                }
            }, input.canReply);
            log.logCommand({
                event: 'Error',
                commandName: 'map',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                config: input.config,
                customString: errors.uErr.osu.map.search_nf.replace('[INPUT]', maptitleq)
            });
            return;
        }
        try {
            let matchedId = null;
            // first check if any diff name matches the search
            for (let i = 0; i < mapidtest.beatmapsets[0].beatmaps.length; i++) {
                if (maptitleq.includes(mapidtest.beatmapsets[0].beatmaps[i].version)) {
                    matchedId = mapidtest.beatmapsets[0].beatmaps[i].id;
                }
            }

            mapidtest2 = mapidtest.beatmapsets[0].beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating);
            usemapidpls = matchedId ?? mapidtest2[0].id;
        } catch (error) {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: `Error - could not sort maps`,
                    edit: true
                }
            }, input.canReply);
            log.logCommand({
                event: 'Error',
                commandName: 'map',
                commandType: input.commandType,
                commandId: input.absoluteID,
                object: input.obj,
                config: input.config,
                customString: 'Maps failed to sort'
            });
            return;
        }

        if (func.findFile(usemapidpls, 'mapdata') &&
            input.commandType == 'button' &&
            !('error' in func.findFile(usemapidpls, 'mapdata')) &&
            input.button != 'Refresh') {
            mapdataReq = func.findFile(usemapidpls, 'mapdata');
        } else {
            mapdataReq = await osufunc.apiget({
                type: 'map_get',
                config: input.config,
                params: {
                    id: usemapidpls
                }
            });
            // mapdataReq = await osufunc.apiget('map_get', `${mapidtest2[0].id}`)
        }

        mapdata = mapdataReq.apiData;
        if (mapdataReq?.error) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.m.replace('[ID]', usemapidpls), false);
            return;
        }
        osufunc.debug(mapdataReq, 'command', 'map', input.obj.guildId, 'mapData');
        if (mapdata?.hasOwnProperty('error') || !mapdata.id) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.m.replace('[ID]', usemapidpls), true);
            return;
        }

        func.storeFile(mapdataReq, mapidtest2[0].id, 'mapdata');

        //options menu to switch to other maps
        for (let i = 0; i < mapidtest?.beatmapsets?.length && i < 25; i++) {
            const curmapset = mapidtest?.beatmapsets?.[i];
            if (!curmapset) break;
            const curmap = curmapset.beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0];
            inputModalSearch.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(`${curmap.mode_int == 0 ? emojis.gamemodes.standard :
                        curmap.mode_int == 1 ? emojis.gamemodes.taiko :
                            curmap.mode_int == 2 ? emojis.gamemodes.fruits :
                                curmap.mode_int == 3 ? emojis.gamemodes.mania :
                                    emojis.gamemodes.standard
                        }` as Discord.APIMessageComponentEmoji)
                    .setLabel(`${curmapset.title} // ${curmapset.creator}`)
                    .setDescription(`[${curmap.version}] ${curmap.difficulty_rating}⭐`)
                    .setValue(`${curmap.id}`)
            );
        }
        if (func.findFile(mapdata.beatmapset_id, `bmsdata`) &&
            !('error' in func.findFile(mapdata.beatmapset_id, `bmsdata`)) &&
            input.button != 'Refresh') {
            bmsdataReq = func.findFile(mapdata.beatmapset_id, `bmsdata`);
        } else {
            bmsdataReq = await osufunc.apiget(
                {
                    type: 'mapset_get',
                    config: input.config,
                    params: {
                        id: mapdata.beatmapset_id
                    }
                });
        }
        bmsdata = bmsdataReq.apiData;
        if (bmsdataReq?.error) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.ms.replace('[ID]', `${mapdata.beatmapset_id}`), false);
            return;
        }
        osufunc.debug(bmsdataReq, 'command', 'map', input.obj.guildId, 'bmsData');

        if (bmsdata?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.map.ms.replace('[ID]', `${mapdata.beatmapset_id}`), true);
            return;
        }

        func.storeFile(bmsdataReq, mapdata.beatmapset_id, `bmsdata`);
    }

    //options thing to switch to other maps in the mapset (difficulties)
    if (typeof bmsdata?.beatmaps == 'undefined' || bmsdata?.beatmaps?.length < 2) {
        inputModalDiff.addOptions(
            new Discord.StringSelectMenuOptionBuilder()
                .setEmoji(`${mapdata.mode_int == 0 ? emojis.gamemodes.standard :
                    mapdata.mode_int == 1 ? emojis.gamemodes.taiko :
                        mapdata.mode_int == 2 ? emojis.gamemodes.fruits :
                            mapdata.mode_int == 3 ? emojis.gamemodes.mania :
                                emojis.gamemodes.standard
                    }` as Discord.APIMessageComponentEmoji)
                .setLabel(`${mapdata.version}`)
                .setDescription(`${mapdata.difficulty_rating}⭐`)
                .setValue(`${mapdata.id}`)
        );
    } else {
        for (let i = 0; i < bmsdata.beatmaps.length && i < 25; i++) {
            const curmap = bmsdata.beatmaps.slice().sort((a, b) => b.difficulty_rating - a.difficulty_rating)[i];
            if (!curmap) break;
            inputModalDiff.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(`${mapdata.mode_int == 0 ? emojis.gamemodes.standard :
                        mapdata.mode_int == 1 ? emojis.gamemodes.taiko :
                            mapdata.mode_int == 2 ? emojis.gamemodes.fruits :
                                mapdata.mode_int == 3 ? emojis.gamemodes.mania :
                                    emojis.gamemodes.standard
                        }` as Discord.APIMessageComponentEmoji)
                    .setLabel(`${curmap.version}`)
                    .setDescription(`${curmap.difficulty_rating}⭐`)
                    .setValue(`${curmap.id}`)
            );
        }
    }

    let useShit: {
        content?: string,
        embeds?: Discord.EmbedBuilder[] | Discord.Embed[],
        components?: Discord.ActionRowBuilder[],
        files?: string[] | Discord.AttachmentBuilder[] | Discord.Attachment[],
        edit?: boolean,
    } = {
        content: '',
        embeds: [],
        components: [],
        files: [],
        edit: true
    };

    if (showBg) {
        const url = osufunc.getMapImages(mapdata.beatmapset_id);
        const embed = new Discord.EmbedBuilder()
            .setTitle('Beatmap images')
            .addFields([
                {
                    name: 'Thumbnail',
                    value: `${url.thumbnail}\n\n${url.thumbnailLarge}`,
                    inline: true
                },
                {
                    name: 'Full',
                    value: `${url.full}\n\n${url.raw}`,
                    inline: true
                },
                {
                    name: 'Cover',
                    value: `${url.cover}\n\n${url.cover2x}`,
                    inline: true
                },
                {
                    name: 'Card',
                    value: `${url.card}\n\n${url.card2x}`,
                    inline: true
                },
                {
                    name: 'List',
                    value: `${url.list}\n\n${url.list2x}`,
                    inline: true
                },
                {
                    name: 'Slimcover',
                    value: `${url.slimcover}\n\n${url.slimcover2x}`,
                    inline: true
                },
            ])
            .setImage(url.full);
        useShit = {
            embeds: [embed],
            edit: true
        };
    } else {
        switch (detailed) {
            case 0:
                embedStyle = 'MC';
                break;
            case 1: default:
                embedStyle = 'M';
                break;
            case 2:
                embedStyle = 'ME';
                break;
        }

        //parsing maps
        if (mapmods == null || mapmods == '') {
            mapmods = 'NM';
        }
        else {
            mapmods = osumodcalc.modHandler(mapmods.toUpperCase(), mapdata.mode).join();
        }


        let statusimg = emojis.rankedstatus.graveyard;
        if (input.commandType == 'interaction' && input?.overrides?.commandAs == null) {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: `Loading...`,
                }
            }, input.canReply);
        }
        switch (mapdata.status) {
            case 'ranked':
                statusimg = emojis.rankedstatus.ranked;
                break;
            case 'approved': case 'qualified':
                statusimg = emojis.rankedstatus.approved;
                break;
            case 'loved':
                statusimg = emojis.rankedstatus.loved;
                break;
        }

        if (customCS == 'current' || isNaN(+customCS)) {
            customCS = mapdata.cs;
        }
        if (customAR == 'current' || isNaN(+customAR)) {
            customAR = mapdata.ar;
        }
        if (customOD == 'current' || isNaN(+customOD)) {
            customOD = mapdata.accuracy;
        }
        if (customHP == 'current' || isNaN(+customHP)) {
            customHP = mapdata.drain;
        }

        let hitlength = mapdata.hit_length;
        const oldOverrideSpeed = overrideSpeed;

        if (overrideBpm != null && isNaN(overrideBpm) == false && (overrideSpeed == null || isNaN(overrideSpeed) == true) && overrideBpm != mapdata.bpm) {
            overrideSpeed = overrideBpm / mapdata.bpm;
        }
        if (overrideSpeed != null && isNaN(overrideSpeed) == false && (overrideBpm == null || isNaN(overrideBpm) == true) && overrideSpeed != 1) {
            overrideBpm = mapdata.bpm * overrideSpeed;
        }
        if (mapmods.includes('DT') || mapmods.includes('NC')) {
            overrideSpeed *= 1.5;
            overrideBpm *= 1.5;
        }
        if (mapmods.includes('HT')) {
            overrideSpeed *= 0.75;
            overrideBpm *= 0.75;
        }
        if (overrideSpeed) {
            hitlength /= overrideSpeed;
        }

        const inallvals = osumodcalc.calcValues(
            +customCS,
            +customAR,
            +customOD,
            +customHP,
            mapdata.bpm,
            hitlength,
            mapmods
        );

        const allvals = osumodcalc.calcValuesAlt(
            inallvals.cs, inallvals.ar, inallvals.od, inallvals.hp, inallvals.bpm, hitlength, oldOverrideSpeed
        );

        const mapimg = input.config.useEmojis.gamemodes ?
            emojis.gamemodes[mapdata.mode] :
            mapdata.mode;

        let ppComputed: PerformanceAttributes[];
        let ppissue: string;
        let totaldiff: string | number = mapdata.difficulty_rating;

        try {
            ppComputed = await osufunc.mapcalc({
                mods: mapmods,
                gamemode: mapdata.mode,
                mapid: mapdata.id,
                calctype: 0,
                clockRate: overrideSpeed ?? 1,
                customCS,
                customAR,
                customOD,
                customHP,
                maxLimit: 21
            }, new Date(mapdata.last_updated), input.config);
            ppissue = '';
            try {
                totaldiff = mapdata.difficulty_rating.toFixed(2) != ppComputed[0].difficulty.stars?.toFixed(2) ?
                    `${mapdata.difficulty_rating.toFixed(2)}=>${ppComputed[0].difficulty.stars?.toFixed(2)}` :
                    `${mapdata.difficulty_rating.toFixed(2)}`;
            } catch (error) {
                totaldiff = mapdata.difficulty_rating;
            }
            osufunc.debug(ppComputed, 'command', 'map', input.obj.guildId, 'ppCalc');

        } catch (error) {
            ppissue = 'Error - pp could not be calculated';
            const tstmods = mapmods.toUpperCase();

            if (tstmods.includes('EZ') || tstmods.includes('HR')) {
                ppissue += '\nInvalid mod combinations: EZ + HR';
            }
            if ((tstmods.includes('DT') || tstmods.includes('NC')) && tstmods.includes('HT')) {
                ppissue += '\nInvalid mod combinations: DT/NC + HT';
            }
            const ppComputedTemp: PerformanceAttributes = {
                mode: mapdata.mode_int,
                pp: 0,
                difficulty: {
                    mode: mapdata.mode_int,
                    stars: mapdata.difficulty_rating,
                    maxCombo: mapdata.max_combo,
                    aim: 0,
                    speed: 0,
                    flashlight: 0,
                    sliderFactor: 0,
                    speedNoteCount: 0,
                    ar: mapdata.ar,
                    od: mapdata.accuracy,
                    nCircles: mapdata.count_circles,
                    nSliders: mapdata.count_sliders,
                    nSpinners: mapdata.count_spinners,
                    stamina: 0,
                    rhythm: 0,
                    color: 0,
                    hitWindow: 0,
                    nFruits: mapdata.count_circles,
                    nDroplets: mapdata.count_sliders,
                    nTinyDroplets: mapdata.count_spinners,
                },
                ppAcc: 0,
                ppAim: 0,
                ppDifficulty: 0,
                ppFlashlight: 0,
                ppSpeed: 0,
                effectiveMissCount: 0,

            };
            ppComputed = [
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
            ];
        }
        const baseCS = allvals.cs != mapdata.cs ? `${mapdata.cs}=>${allvals.cs}` : allvals.cs;
        const baseAR = allvals.ar != mapdata.ar ? `${mapdata.ar}=>${allvals.ar}` : allvals.ar;
        const baseOD = allvals.od != mapdata.accuracy ? `${mapdata.accuracy}=>${allvals.od}` : allvals.od;
        const baseHP = allvals.hp != mapdata.drain ? `${mapdata.drain}=>${allvals.hp}` : allvals.hp;
        const baseBPM = mapdata.bpm * (overrideSpeed ?? 1) != mapdata.bpm ? `${mapdata.bpm}=>${mapdata.bpm * (overrideSpeed ?? 1)}` : mapdata.bpm;

        let basicvals = `CS${baseCS}\n AR${baseAR}\n OD${baseOD}\n HP${baseHP}\n`;

        const mapname = osufunc.parseUnicodeStrings({
            title: mapdata.beatmapset.title,
            artist: mapdata.beatmapset.artist,
            title_unicode: mapdata.beatmapset.title_unicode,
            artist_unicode: mapdata.beatmapset.artist_unicode,
            ignore: {
                artist: false,
                title: false
            }
        }, 1);
        mapmods = mapmods.replace(',', '');
        const maptitle: string = mapmods ? `\`${mapname} [${mapdata.version}]\` +${mapmods}` : `\`${mapname} [${mapdata.version}]\``;
        const Embed = new Discord.EmbedBuilder()
            .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${mapdata.mode}/${mapdata.id}`)
            .setThumbnail(osufunc.getMapImages(mapdata.beatmapset_id).list2x)
            .setTitle(maptitle);
        const embeds: Discord.EmbedBuilder[] = [];
        switch (true) {
            case parseFloat(totaldiff.toString()) >= 8:
                Embed.setColor(colours.diffcolour[7].dec);
                break;
            case parseFloat(totaldiff.toString()) >= 7:
                Embed.setColor(colours.diffcolour[6].dec);
                break;
            case parseFloat(totaldiff.toString()) >= 6:
                Embed.setColor(colours.diffcolour[5].dec);
                break;
            case parseFloat(totaldiff.toString()) >= 4.5:
                Embed.setColor(colours.diffcolour[4].dec);
                break;
            case parseFloat(totaldiff.toString()) >= 3.25:
                Embed.setColor(colours.diffcolour[3].dec);
                break;
            case parseFloat(totaldiff.toString()) >= 2.5:
                Embed.setColor(colours.diffcolour[2].dec);
                break;
            case parseFloat(totaldiff.toString()) >= 2:
                Embed.setColor(colours.diffcolour[1].dec);
                break;
            case parseFloat(totaldiff.toString()) >= 1.5:
                Embed.setColor(colours.diffcolour[0].dec);
                break;
            default:
                Embed.setColor(colours.diffcolour[0].dec);
                break;
        }
        if (isppCalc) {
            embedStyle = 'MP';
            let extras = '';

            switch (mapdata.mode) {
                case 'osu': {
                    const curattr = ppComputed as OsuPerformanceAttributes[];

                    extras = `
        ---===SS===---  
        \`Aim        ${curattr[0].ppAim?.toFixed(3)}\`
        \`Speed      ${curattr[0].ppSpeed?.toFixed(3)}\`
        \`Acc        ${curattr[0].ppAcc?.toFixed(3)}\`
        ${curattr[0].ppFlashlight > 0 ? `\`Flashlight ${curattr[0].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${curattr[0].pp?.toFixed(3)}\`
        ---===97%===---
        \`Aim        ${curattr[3].ppAim?.toFixed(3)}\`
        \`Speed      ${curattr[3].ppSpeed?.toFixed(3)}\`
        \`Acc        ${curattr[3].ppAcc?.toFixed(3)}\`
        ${curattr[0].ppFlashlight > 0 ? `\`Flashlight ${curattr[3].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${curattr[3].pp?.toFixed(3)}\`
        ---===95%===---
        \`Aim        ${curattr[5].ppAim?.toFixed(3)}\`
        \`Speed      ${curattr[5].ppSpeed?.toFixed(3)}\`
        \`Acc        ${curattr[5].ppAcc?.toFixed(3)}\`
        ${curattr[0].ppFlashlight > 0 ? `\`Flashlight ${curattr[5].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${curattr[5].pp?.toFixed(3)}\`
        ---===93%===---
        \`Aim        ${curattr[7].ppAim?.toFixed(3)}\`
        \`Speed      ${curattr[7].ppSpeed?.toFixed(3)}\`
        \`Acc        ${curattr[7].ppAcc?.toFixed(3)}\`
        ${curattr[0].ppFlashlight > 0 ? `\`Flashlight ${curattr[7].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${curattr[7].pp?.toFixed(3)}\`
        ---===90%===---
        \`Aim        ${curattr[10].ppAim?.toFixed(3)}\`
        \`Speed      ${curattr[10].ppSpeed?.toFixed(3)}\`
        \`Acc        ${curattr[10].ppAcc?.toFixed(3)}\`
        ${curattr[0].ppFlashlight > 0 ? `\`Flashlight ${curattr[10].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${curattr[10].pp?.toFixed(3)}\`
        `;
                }
                    break;
                case 'taiko': {
                    const curattr = ppComputed as TaikoPerformanceAttributes[];
                    extras = `
        ---===SS===---  
        - Strain: ${curattr[0].ppDifficulty}
        - Acc: ${curattr[0].ppAcc}
        - Total: ${curattr[0].pp} 
        ---===97%===---
        - Strain: ${curattr[3].ppDifficulty}
        - Acc: ${curattr[3].ppAcc}
        - Total: ${curattr[3].pp} 
        ---===95%===---
        - Strain: ${curattr[5].ppDifficulty}
        - Acc: ${curattr[5].ppAcc}
        - Total: ${curattr[5].pp} 
        ---===93%===---
        - Strain: ${curattr[7].ppDifficulty}
        - Acc: ${curattr[7].ppAcc}
        - Total: ${curattr[7].pp} 
        ---===90%===---
        - Strain: ${curattr[10].ppDifficulty}
        - Acc: ${curattr[10].ppAcc}
        - Total: ${curattr[10].pp}                 
        `;
                }
                    break;
                case 'fruits': {
                    const curattr = ppComputed as CatchPerformanceAttributes[];
                    extras = `
        ---===SS===---  
        - Strain: ${curattr[0].ppDifficulty}
        - Total: ${curattr[0].pp} 
        ---===97%===---
        - Strain: ${curattr[3].ppDifficulty}
        - Total: ${curattr[3].pp} 
        ---===95%===---
        - Strain: ${curattr[5].ppDifficulty}
        - Total: ${curattr[5].pp} 
        ---===93%===---
        - Strain: ${curattr[7].ppDifficulty}
        - Total: ${curattr[7].pp} 
        ---===90%===---
        - Strain: ${curattr[10].ppDifficulty}
        - Total: ${curattr[10].pp}                 
        `;
                }
                    break;
                case 'mania': {
                    const curattr = ppComputed as ManiaPerformanceAttributes[];
                    extras = `
        ---===SS===---  
        - Total: ${curattr[0].pp} 
        ---===97%===---
        - Total: ${curattr[3].pp} 
        ---===95%===---
        - Total: ${curattr[5].pp} 
        ---===93%===---
        - Total: ${curattr[7].pp} 
        ---===90%===---
        - Total: ${curattr[10].pp}                 
        `;
                }
                    break;
            }

            Embed
                .setTitle(maptitle)
                .addFields([
                    {
                        name: 'MAP VALUES',
                        value:
                            `CS${baseCS} AR${baseAR} OD${baseOD} HP${baseHP} ${totaldiff}⭐\n` +
                            `${emojis.mapobjs.bpm}${baseBPM} | ` +
                            `${emojis.mapobjs.total_length}${allvals.length != mapdata.hit_length ? `${allvals.details.lengthFull}(${calc.secondsToTime(mapdata.hit_length)})` : allvals.details.lengthFull} | ` +
                            `${ppComputed[0].difficulty.maxCombo ?? mapdata.max_combo}x combo\n ` +
                            `${emojis.mapobjs.circle}${mapdata.count_circles} \n${emojis.mapobjs.slider}${mapdata.count_sliders} \n${emojis.mapobjs.spinner}${mapdata.count_spinners}\n`,
                        inline: false
                    },
                    {
                        name: 'PP',
                        value:
                            `SS: ${ppComputed[0].pp?.toFixed(2)} \n ` +
                            `99%: ${ppComputed[1].pp?.toFixed(2)} \n ` +
                            `98%: ${ppComputed[2].pp?.toFixed(2)} \n ` +
                            `97%: ${ppComputed[3].pp?.toFixed(2)} \n ` +
                            `96%: ${ppComputed[4].pp?.toFixed(2)} \n ` +
                            `95%: ${ppComputed[5].pp?.toFixed(2)} \n ` +
                            `94%: ${ppComputed[6].pp?.toFixed(2)} \n ` +
                            `93%: ${ppComputed[7].pp?.toFixed(2)} \n ` +
                            `92%: ${ppComputed[8].pp?.toFixed(2)} \n ` +
                            `91%: ${ppComputed[9].pp?.toFixed(2)} \n ` +
                            `90%: ${ppComputed[10].pp?.toFixed(2)} \n ` +
                            `89%: ${ppComputed[11].pp?.toFixed(2)} \n ` +
                            `88%: ${ppComputed[12].pp?.toFixed(2)} \n ` +
                            `87%: ${ppComputed[13].pp?.toFixed(2)} \n ` +
                            `86%: ${ppComputed[14].pp?.toFixed(2)} \n ` +
                            `85%: ${ppComputed[15].pp?.toFixed(2)} \n ` +
                            `84%: ${ppComputed[16].pp?.toFixed(2)} \n ` +
                            `83%: ${ppComputed[17].pp?.toFixed(2)} \n ` +
                            `82%: ${ppComputed[18].pp?.toFixed(2)} \n ` +
                            `81%: ${ppComputed[19].pp?.toFixed(2)} \n ` +
                            `80%: ${ppComputed[20].pp?.toFixed(2)} \n ` +
                            `\n${ppissue}`
                        ,
                        inline: true
                    },
                    {
                        name: 'Full',
                        value: extras,
                        inline: true
                    }
                ]);
        } else {


            if (detailed == 2) {
                basicvals =
                    `CS${baseCS} (${allvals.details.csRadius?.toFixed(2)}r)
AR${baseAR}  (${allvals.details.arMs?.toFixed(2)}ms)
OD${baseOD} (300: ${allvals.details.odMs.hitwindow_300?.toFixed(2)}ms 100: ${allvals.details.odMs.hitwindow_100?.toFixed(2)}ms 50:  ${allvals.details.odMs.hitwindow_50?.toFixed(2)}ms)
HP${baseHP}`;
            }


            let mapperdataReq: osufunc.apiReturn;
            let mapperdata: osuApiTypes.User;
            if (func.findFile(mapdata.beatmapset.user_id, `osudata`) &&
                !('error' in func.findFile(mapdata.beatmapset.user_id, `osudata`)) &&
                input.button != 'Refresh') {
                mapperdataReq = func.findFile(mapdata.beatmapset.user_id, `osudata`);
            } else {
                mapperdataReq = await osufunc.apiget(
                    {
                        type: 'user',
                        config: input.config,
                        params: {
                            userid: mapdata.beatmapset.user_id,
                        }
                    });
            }

            mapperdata = mapperdataReq.apiData;
            osufunc.debug(mapperdataReq, 'command', 'map', input.obj.guildId, 'mapperData');
            if (mapperdataReq?.error || mapperdata?.hasOwnProperty('error')) {
                mapperdata = JSON.parse(fs.readFileSync(`${precomppath}/files/defaults/mapper.json`, 'utf8'));
                log.logCommand({
                    event: 'Error',
                    commandName: 'map',
                    commandType: input.commandType,
                    commandId: input.absoluteID,
                    object: input.obj,
                    config: input.config,
                    customString: `Could not find user ${mapdata.beatmapset.user_id} (map creator).\nUsing default json file`
                });
            }
            func.storeFile(mapperdataReq, mapperdata.id, `osudata`, 'osu');

            const strains = await osufunc.straincalc(mapdata.id, mapmods, 0, mapdata.mode, new Date(mapdata.last_updated), input.config);
            try {
                osufunc.debug(strains, 'command', 'map', input.obj.guildId, 'strains');

            } catch (error) {
                osufunc.debug({ error: error }, 'command', 'map', input.obj.guildId, 'strains');
            }
            let mapgraph;
            if (strains) {
                const mapgraphInit =
                    await func.graph(strains.strainTime, strains.value, 'Strains', {
                        startzero: true,
                        type: 'bar',
                        fill: true,
                        displayLegend: false,
                        title: 'Strains',
                        imgUrl: osufunc.getMapImages(mapdata.beatmapset_id).full,
                        blurImg: true,
                    });
                useFiles.push(mapgraphInit.path);

                mapgraph = mapgraphInit.filename;
            } else {
                mapgraph = null;
            }
            let detailedmapdata = '-';
            if (detailed == 2) {
                switch (mapdata.mode) {
                    case 'osu': {
                        const curattr = ppComputed as OsuPerformanceAttributes[];
                        detailedmapdata = `**SS**: ${curattr[0].pp?.toFixed(2)} | Aim: ${curattr[0].ppAim?.toFixed(2)} | Speed: ${curattr[0].ppSpeed?.toFixed(2)} | Acc: ${curattr[0].ppAcc?.toFixed(2)} \n ` +
                            `**99**: ${curattr[1].pp?.toFixed(2)} | Aim: ${curattr[1].ppAim?.toFixed(2)} | Speed: ${curattr[1].ppSpeed?.toFixed(2)} | Acc: ${curattr[1].ppAcc?.toFixed(2)} \n ` +
                            `**97**: ${curattr[3].pp?.toFixed(2)} | Aim: ${curattr[3].ppAim?.toFixed(2)} | Speed: ${curattr[3].ppSpeed?.toFixed(2)} | Acc: ${curattr[3].ppAcc?.toFixed(2)} \n ` +
                            `**95**: ${curattr[5].pp?.toFixed(2)} | Aim: ${curattr[5].ppAim?.toFixed(2)} | Speed: ${curattr[5].ppSpeed?.toFixed(2)} | Acc: ${curattr[5].ppAcc?.toFixed(2)} \n ` +
                            `${ppissue}`;
                    }
                        break;
                    case 'taiko': {
                        const curattr = ppComputed as TaikoPerformanceAttributes[];
                        detailedmapdata = `**SS**: ${curattr[0].pp?.toFixed(2)} | Acc: ${curattr[0].ppAcc?.toFixed(2)} | Strain: ${curattr[0].ppDifficulty?.toFixed(2)} \n ` +
                            `**99**: ${curattr[1].pp?.toFixed(2)} | Acc: ${curattr[1].ppAcc?.toFixed(2)} | Strain: ${curattr[1]?.ppDifficulty?.toFixed(2)} \n ` +
                            `**97**: ${curattr[3].pp?.toFixed(2)} | Acc: ${curattr[3].ppAcc?.toFixed(2)} | Strain: ${curattr[3]?.ppDifficulty?.toFixed(2)} \n ` +
                            `**95**: ${curattr[5].pp?.toFixed(2)} | Acc: ${curattr[5].ppAcc?.toFixed(2)} | Strain: ${curattr[5]?.ppDifficulty?.toFixed(2)} \n ` +
                            `${ppissue}`;
                    }
                        break;
                    case 'fruits': {
                        const curattr = ppComputed as CatchPerformanceAttributes[];
                        detailedmapdata = `**SS**: ${curattr[0].pp?.toFixed(2)} | Strain: ${curattr[0].ppDifficulty?.toFixed(2)} \n ` +
                            `**99**: ${curattr[1].pp?.toFixed(2)} | Strain: ${curattr[1]?.ppDifficulty?.toFixed(2)} \n ` +
                            `**97**: ${curattr[3].pp?.toFixed(2)} | Strain: ${curattr[3]?.ppDifficulty?.toFixed(2)} \n ` +
                            `**95**: ${curattr[5].pp?.toFixed(2)} | Strain: ${curattr[5]?.ppDifficulty?.toFixed(2)} \n ` +
                            `${ppissue}`;
                    }
                        break;
                    case 'mania': {
                        const curattr = ppComputed as ManiaPerformanceAttributes[];
                        detailedmapdata = `**SS**: ${curattr[0].pp?.toFixed(2)} \n ` +
                            `**99**: ${curattr[1].pp?.toFixed(2)} \n ` +
                            `**98**: ${curattr[2].pp?.toFixed(2)} \n ` +
                            `**97**: ${curattr[3].pp?.toFixed(2)} \n ` +
                            `**96**: ${curattr[4].pp?.toFixed(2)} \n ` +
                            `**95**: ${curattr[5].pp?.toFixed(2)} \n ` +
                            `${ppissue}`;
                    }
                        break;

                }
            }

            const exMapDetails = `${func.separateNum(mapdata.playcount)} plays | ${func.separateNum(mapdata.beatmapset.play_count)} mapset plays | ${func.separateNum(mapdata.passcount)} passes | ${func.separateNum(mapdata.beatmapset.favourite_count)} favourites\n` +
                `Submitted <t:${new Date(mapdata.beatmapset.submitted_date).getTime() / 1000}:R> | Last updated <t:${new Date(mapdata.beatmapset.last_updated).getTime() / 1000}:R>
    ${mapdata.status == 'ranked' ?
                    `Ranked <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                }${mapdata.status == 'approved' || mapdata.status == 'qualified' ?
                    `Approved/Qualified <t: ${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                }${mapdata.status == 'loved' ?
                    `Loved <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                }\n` +
                `${mapdata.beatmapset.video == true ? '📺' : ''} ${mapdata.beatmapset.storyboard == true ? '🎨' : ''}`;

            Embed
                .setAuthor({
                    name: `${mapdata.beatmapset.creator}`,
                    url: `https://osu.ppy.sh/users/${mapperdata.id}`,
                    iconURL: `${mapperdata?.avatar_url ?? def.images.any.url}`,
                })
                .addFields([
                    {
                        name: 'MAP VALUES',
                        value:
                            `${basicvals} ⭐${totaldiff}\n`,
                        inline: true
                    },
                    {
                        name: def.invisbleChar,
                        value: `${emojis.mapobjs.bpm}${baseBPM}\n` +
                            `${emojis.mapobjs.circle}${mapdata.count_circles} \n${emojis.mapobjs.slider}${mapdata.count_sliders} \n${emojis.mapobjs.spinner}${mapdata.count_spinners}\n` +
                            `${emojis.mapobjs.total_length}${allvals.length != mapdata.hit_length ? `${allvals.details.lengthFull}(${calc.secondsToTime(mapdata.hit_length)})` : allvals.details.lengthFull}\n`,
                        inline: true
                    },
                    {
                        name: 'PP',
                        value:
                            detailed != 2 ?
                                `SS: ${ppComputed[0].pp?.toFixed(2)} \n ` +
                                `99: ${ppComputed[1].pp?.toFixed(2)} \n ` +
                                `98: ${ppComputed[2].pp?.toFixed(2)} \n ` +
                                `97: ${ppComputed[3].pp?.toFixed(2)} \n ` +
                                `96: ${ppComputed[4].pp?.toFixed(2)} \n ` +
                                `95: ${ppComputed[5].pp?.toFixed(2)} \n ` +
                                `${ppissue}` :
                                detailedmapdata
                        ,
                        inline: detailed != 2
                    },
                    {
                        name: 'DOWNLOAD',
                        value: `[osu!](https://osu.ppy.sh/b/${mapdata.id}) | [Chimu](https://api.chimu.moe/v1/download${mapdata.beatmapset_id}) | [Beatconnect](https://beatconnect.io/b/${mapdata.beatmapset_id}) | [Kitsu](https://kitsu.io/d/${mapdata.beatmapset_id})\n` +
                            `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapdata.id})`,
                        inline: false
                    }, // [osu!direct](osu://b/${mapdata.id}) - discord doesn't support schemes other than http, https and discord
                    {
                        name: 'MAP DETAILS',
                        value: `${statusimg} | ${mapimg} | ${ppComputed[0].difficulty.maxCombo ?? mapdata.max_combo}x combo \n ` +
                            `${detailed == 2 ?
                                exMapDetails
                                : ''}`

                        ,
                        inline: false
                    }
                ]);

            if (mapdata.user_id != mapdata.beatmapset.user_id) {
                let gdReq: osufunc.apiReturn;
                let gdData: osuApiTypes.User;
                if (func.findFile(mapdata.user_id, `osudata`) &&
                    !('error' in func.findFile(mapdata.user_id, `osudata`)) &&
                    input.button != 'Refresh') {
                    gdReq = func.findFile(mapdata.user_id, `osudata`);
                } else {
                    gdReq = await osufunc.apiget(
                        {
                            type: 'user',
                            config: input.config,
                            params: {
                                userid: mapdata.user_id,
                            }
                        });
                }

                gdData = gdReq.apiData;
                if (gdReq?.error) {
                    await msgfunc.errorAndAbort(input, 'map', true, errors.uErr.osu.profile.user.replace('[ID]', `${mapdata.user_id}`), false);
                    return;
                }

                osufunc.debug(gdReq, 'command', 'map', input.obj.guildId, 'guestData');

                if (gdData?.hasOwnProperty('error')) {
                    gdData = JSON.parse(fs.readFileSync(`${precomppath}/files/defaults/mapper.json`, 'utf8'));
                    log.logCommand({
                        event: 'Error',
                        commandName: 'map',
                        commandType: input.commandType,
                        commandId: input.absoluteID,
                        object: input.obj,
                        config: input.config,
                        customString: `Could not find user ${mapdata.user_id} (guest mapper).\nUsing default json file.`
                    });
                }
                func.storeFile(gdReq, mapdata.user_id, `osudata`);
                Embed.setDescription(`Guest difficulty by [${gdData?.username}](https://osu.ppy.sh/users/${mapdata.user_id})`);

                buttons
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId(`${mainconst.version}-User-map-any-${input.absoluteID}-${gdData.id}+${gdData.playmode}`)
                            .setStyle(buttonsthing.type.current)
                            .setEmoji(buttonsthing.label.extras.user),
                    );
            } else {
                buttons
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId(`${mainconst.version}-User-map-any-${input.absoluteID}-${mapperdata.id}+${mapperdata.playmode}`)
                            .setStyle(buttonsthing.type.current)
                            .setEmoji(buttonsthing.label.extras.user),
                    );
            }

            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-Leaderboard-map-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.extras.leaderboard)
            );

            if (mapgraph) {
                Embed.setImage(`attachment://${mapgraph}.jpg`);
            }
            switch (true) {
                case parseFloat(totaldiff.toString()) >= 8:
                    Embed.setColor(colours.diffcolour[7].dec);
                    break;
                case parseFloat(totaldiff.toString()) >= 7:
                    Embed.setColor(colours.diffcolour[6].dec);
                    break;
                case parseFloat(totaldiff.toString()) >= 6:
                    Embed.setColor(colours.diffcolour[5].dec);
                    break;
                case parseFloat(totaldiff.toString()) >= 4.5:
                    Embed.setColor(colours.diffcolour[4].dec);
                    break;
                case parseFloat(totaldiff.toString()) >= 3.25:
                    Embed.setColor(colours.diffcolour[3].dec);
                    break;
                case parseFloat(totaldiff.toString()) >= 2.5:
                    Embed.setColor(colours.diffcolour[2].dec);
                    break;
                case parseFloat(totaldiff.toString()) >= 2:
                    Embed.setColor(colours.diffcolour[1].dec);
                    break;
                case parseFloat(totaldiff.toString()) >= 1.5:
                    Embed.setColor(colours.diffcolour[0].dec);
                    break;
                default:
                    Embed.setColor(colours.diffcolour[0].dec);
                    break;
            }

            if (detailed == 2) {
                const failval = mapdata.failtimes.fail;
                const exitval = mapdata.failtimes.exit;
                const numofval = [];
                for (let i = 0; i < failval.length; i++) {
                    numofval.push(`${i}s`);
                }
                const passInit = await func.graph(numofval, mapdata.failtimes.fail, 'Fails', {
                    stacked: true,
                    type: 'bar',
                    showAxisX: false,
                    title: 'Fail times',
                    imgUrl: osufunc.getMapImages(mapdata.beatmapset_id).full,
                    blurImg: true,
                }, [{
                    data: mapdata.failtimes.exit,
                    label: 'Exits',
                    separateAxis: false,
                }]);
                useFiles.push(passInit.path);

                const passurl = passInit.filename;
                const passEmbed = new Discord.EmbedBuilder()
                    .setFooter({
                        text: `${embedStyle}`
                    })
                    .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${mapdata.mode}/${mapdata.id}`)
                    .setImage(`attachment://${passurl}.jpg`);
                await embeds.push(passEmbed);
            }
        }
        Embed
            .setFooter({
                text: `${embedStyle}`
            });
        embeds.push(Embed);
        embeds.reverse();
        osufunc.writePreviousId('map', input.obj.guildId,
            {
                id: `${mapdata.id}`,
                apiData: null,
                mods: mapmods
            }
        );

        useComponents.push(buttons);

        let frmod = inputModalSearch;
        if (overwriteModal != null) {
            frmod = overwriteModal;
        }

        if (!(inputModalDiff.options.length < 1)) {
            useComponents.push(new Discord.ActionRowBuilder()
                .addComponents(inputModalDiff));
        }
        if (!(inputModalSearch.options.length < 1)) {
            useComponents.push(new Discord.ActionRowBuilder()
                .addComponents(frmod));
        }
        if (overwriteModal) {
            useComponents.push(new Discord.ActionRowBuilder()
                .addComponents(overwriteModal));
        }

        useShit = {
            content: useContent,
            embeds: embeds,
            components: useComponents,
            files: useFiles,
            edit: true
        };

    }
    osufunc.writePreviousId('map', input.obj.guildId,
        {
            id: `${mapdata.id}`,
            apiData: null,
            mods: null
        }
    );


    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: useShit,
        // {
        //     content: useContent,
        //     embeds: embeds,
        //     components: useComponents,
        //     files: useFiles,
        //     edit: true
        // }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'map',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'map',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }

}

/**
 * returns a random map
 */
export async function randomMap(input: extypes.commandInput) {

    type thingyFr = 'Ranked' | 'Loved' | 'Approved' | 'Qualified' | 'Pending' | 'WIP' | 'Graveyard';
    let commanduser: Discord.User;
    let mapType: thingyFr = null;
    let useRandomRanked: boolean = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            if (input.args.includes('-ranked')) {
                mapType = 'Ranked';
                input.args.splice(input.args.indexOf('-ranked'), 1);
            }
            if (input.args.includes('-rank')) {
                mapType = 'Ranked';
                input.args.splice(input.args.indexOf('-rank'), 1);
            }
            if (input.args.includes('-leaderboard')) {
                useRandomRanked = true;
                input.args.splice(input.args.indexOf('-leaderboard'), 1);
            }
            if (input.args.includes('-lb')) {
                useRandomRanked = true;
                input.args.splice(input.args.indexOf('-lb'), 1);
            }
            if (input.args.includes('-loved')) {
                mapType = 'Loved';
                input.args.splice(input.args.indexOf('-loved'), 1);
            }
            if (input.args.includes('-love')) {
                mapType = 'Loved';
                input.args.splice(input.args.indexOf('-love'), 1);
            }
            if (input.args.includes('-approved')) {
                mapType = 'Approved';
                input.args.splice(input.args.indexOf('-approved'), 1);
            }
            if (input.args.includes('-approve')) {
                mapType = 'Approved';
                input.args.splice(input.args.indexOf('-approve'), 1);
            }
            if (input.args.includes('-qualified')) {
                mapType = 'Qualified';
                input.args.splice(input.args.indexOf('-qualified'), 1);
            }
            if (input.args.includes('-qualify')) {
                mapType = 'Qualified';
                input.args.splice(input.args.indexOf('-qualify'), 1);
            }
            if (input.args.includes('-qual')) {
                mapType = 'Qualified';
                input.args.splice(input.args.indexOf('-qual'), 1);
            }
            if (input.args.includes('-pending')) {
                mapType = 'Pending';
                input.args.splice(input.args.indexOf('-pending'), 1);
            }
            if (input.args.includes('-pend')) {
                mapType = 'Pending';
                input.args.splice(input.args.indexOf('-pend'), 1);
            }
            if (input.args.includes('-wip')) {
                mapType = 'WIP';
                input.args.splice(input.args.indexOf('-wip'), 1);
            }
            if (input.args.includes('-unfinished')) {
                mapType = 'WIP';
                input.args.splice(input.args.indexOf('-unfinished'), 1);
            }
            if (input.args.includes('-graveyarded')) {
                mapType = 'Graveyard';
                input.args.splice(input.args.indexOf('-graveyarded'), 1);
            }
            if (input.args.includes('-graveyard')) {
                mapType = 'Graveyard';
                input.args.splice(input.args.indexOf('-graveyard'), 1);
            }
            if (input.args.includes('-grave')) {
                mapType = 'Graveyard';
                input.args.splice(input.args.indexOf('-grave'), 1);
            }
            if (input.args.includes('-unranked')) {
                mapType = 'Graveyard';
                input.args.splice(input.args.indexOf('-unranked'), 1);
            }
            input.args = msgfunc.cleanArgs(input.args);
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'map (random)',
        options: [
            {
                name: 'Map type',
                value: mapType
            },
            {
                name: 'Random ranked type',
                value: `${useRandomRanked}`
            }
        ],

    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let txt = '';

    if (useRandomRanked) {
        const arr: ('Ranked' | 'Loved' | 'Approved')[] = ['Ranked', 'Loved', 'Approved'];
        mapType = arr[Math.floor(Math.random() * arr.length)];
    }

    const randomMap = osufunc.randomMap(mapType);
    if (randomMap.err != null) {
        txt = randomMap.err;
    } else {
        txt = `https://osu.ppy.sh/b/${randomMap.returnId}`;
    }
    const embed = new Discord.EmbedBuilder()
        .setTitle('Random map')
        .setDescription(txt);

    if (randomMap.err == null) {
        input.overrides = {
            id: randomMap.returnId,
            commanduser,
            commandAs: input.commandType
        };

        await map(input);
        return;
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'map (random)',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'map (random)',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }
}

export async function recMap(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let searchid: string;
    let user: string;
    let maxRange: number = 1;
    let useType: 'closest' | 'random' = 'random';
    let mode: osuApiTypes.GameMode;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            if (input.args.includes('-range')) {
                const temp = func.parseArg(input.args, '-range', 'number', maxRange, null, true);
                maxRange = temp.value;
                input.args = temp.newArgs;
                useType = 'random';
            }
            if (input.args.includes('-diff')) {
                const temp = func.parseArg(input.args, '-diff', 'number', maxRange, null, true);
                maxRange = temp.value;
                input.args = temp.newArgs;
                useType = 'random';
            }
            if (input.args.includes('-r')) {
                const temp = func.parseArg(input.args, '-r', 'number', maxRange, null, true);
                maxRange = temp.value;
                input.args = temp.newArgs;
                useType = 'random';
            }
            if (input.args.includes('-closest')) {
                useType = 'closest';
                input.args = input.args.splice(input.args.indexOf('-closest'), 1);

            }
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = msgfunc.cleanArgs(input.args);
            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null;
            }
            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = input.obj.member.user.id;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
            searchid = input.obj.member.user.id;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            searchid = input.obj.member.user.id;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'recmap',
        options: [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Range',
                value: maxRange
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'type',
                value: useType
            }
        ],
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    if (maxRange < 0.5 || !maxRange) {
        maxRange = 0.5;
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator('')
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'recmap', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    osufunc.debug(osudataReq, 'command', 'osu', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'recmap', true, errors.noUser(user), true);
        return;
    }

    const randomMap = osufunc.recommendMap(JSON.parse((formula.omc.user.recdiff(osudata.statistics.pp)).toFixed(2)), useType, mode, maxRange ?? 1);
    const exTxt =
        useType == 'closest' ? '' :
            `Random map within ${maxRange}⭐ of ${(formula.omc.user.recdiff(osudata.statistics.pp))?.toFixed(2)}
Pool of ${randomMap.poolSize}
`;

    const embed = new Discord.EmbedBuilder();
    if (!isNaN(randomMap.mapid)) {
        input.overrides = {
            id: randomMap.mapid,
            commanduser,
            commandAs: input.commandType,
            ex: exTxt
        };

        await map(input);
        return;
    } else {
        embed
            .setTitle('Error')
            .setDescription(`${randomMap.err}`);
    }


    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'recmap',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'recmap',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }
}

/**
 * parse .osu file and return data
 */
export async function maplocal(input: extypes.commandInput) {

    let commanduser: Discord.User;

    const embedStyle: extypes.osuCmdStyle = 'M';
    const useFiles = [];
    let mods = 'NM';

    switch (input.commandType) {
        case 'message': case 'link': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            if (input.obj.content.includes('+')) {
                mods = input.obj.content.split('+')[1];
                mods.includes(' ') ? mods = mods.split(' ')[0] : null;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }

    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'map (file)',
        options: [],
    });
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let mapPath: string = '';
    if (fs.existsSync(`${filespath}/localmaps/${input.absoluteID}.osu`)) {
        mapPath = `${filespath}/localmaps/${input.absoluteID}.osu`;
    } else {
        return;
    }

    let errtxt = '';
    const decoder = new osuparsers.BeatmapDecoder();
    const mapParsed: osuclasses.Beatmap = await decoder.decodeFromPath(mapPath, true);
    osufunc.debug(mapParsed, 'fileparse', 'map (file)', input.obj.guildId, 'map');
    let clockRate = 1;
    if (mods.includes('DT') || mods.includes('NC')) {
        clockRate = 1.5;
    } else if (mods.includes('HT') || mods.includes('DC')) {
        clockRate = 0.75;
    }
    /**
     * msperbeat - +mapParsed?.controlPoints?.timingPoints[0]._beatLength
     * s per beat - /1000
     * 60/sperbeat
     * bpm
     * 
     */
    const valCalc = osumodcalc.calcValues(
        +mapParsed?.difficulty?._CS,
        +mapParsed?.difficulty?._AR,
        +mapParsed?.difficulty?._OD,
        +mapParsed?.difficulty?._HP,
        60 / (+mapParsed?.controlPoints?.timingPoints[0]._beatLength / 1000),
        (+mapParsed?.totalLength) / 1000,
        mods
    );

    let circleob = 0;
    let sliderob = 0;
    let spinnerob = 0;
    for (const object of mapParsed?.hitObjects) {
        if (
            object.hasOwnProperty("repeats") ||
            object.hasOwnProperty("velocity") ||
            object.hasOwnProperty("path") ||
            object.hasOwnProperty("legacyLastTickOffset") ||
            object.hasOwnProperty("nodeSamples")
        ) {
            sliderob++;
        } else if (object.hasOwnProperty("endTime")) {
            spinnerob++;
        } else {
            circleob++;
        }
    }

    console.log(mapParsed?.controlPoints?.timingPoints);

    let ppcalcing: PerformanceAttributes[];
    try {
        ppcalcing = await osufunc.mapcalclocal(mods, 'osu', mapPath, 0);
    } catch (error) {
        ppcalcing = await osufunc.mapcalclocal(mods, 'osu', `${filespath}/errmap.osu`, 0);
        errtxt += '\nError - pp calculations failed';
    }
    let strains;
    let mapgraph;
    try {
        strains = await osufunc.straincalclocal(mapPath, mods, 0, osumodcalc.ModeIntToName(mapParsed?.mode));
    } catch (error) {
        errtxt += '\nError - strains calculation failed';

        strains = {
            strainTime: [0, 0],
            value: [0, 0]
        };

        strains = await osufunc.straincalclocal(`${filespath}/errmap.osu`, mods, 0, osumodcalc.ModeIntToName(mapParsed?.mode));
    }
    osufunc.debug(strains, 'fileparse', 'map (file)', input.obj.guildId, 'strains');
    try {
        const mapgraphInit = await
            await func.graph(strains.strainTime, strains.value, 'Strains', {
                startzero: true,
                type: 'bar',
                fill: true,
                displayLegend: true,
                barOutline: true
            });
        useFiles.push(mapgraphInit.path);

        mapgraph = mapgraphInit.filename;
    } catch (error) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.osu.map.strains_graph,
                edit: true
            }
        }, input.canReply);
    }
    let osuEmbed;
    try {
        osuEmbed = new Discord.EmbedBuilder()
            .setFooter({
                text: `${embedStyle}`
            })
            .setTitle(`${mapParsed?.metadata.artist} - ${mapParsed?.metadata.title} [${mapParsed?.metadata?.version}]`)
            .addFields([
                {
                    name: 'MAP VALUES',
                    value:
                        `
CS${valCalc.cs}
AR${valCalc.ar} 
OD${valCalc.od} 
HP${valCalc.hp}
⭐${ppcalcing[0]?.difficulty?.stars?.toFixed(2)}
`,
                    inline: true
                },
                {
                    name: def.invisbleChar,
                    value: `
${emojis.mapobjs.circle}${circleob}
${emojis.mapobjs.slider}${sliderob}
${emojis.mapobjs.spinner}${spinnerob}
${emojis.mapobjs.total_length}${calc.secondsToTime((valCalc.length))}
${emojis.mapobjs.bpm}${valCalc.bpm}
`,
                    inline: true
                },
                {
                    name: 'PP',
                    value:
                        `SS: ${ppcalcing[0].pp.toFixed(2)} \n ` +
                        `99: ${ppcalcing[1].pp.toFixed(2)} \n ` +
                        `98: ${ppcalcing[2].pp.toFixed(2)} \n ` +
                        `97: ${ppcalcing[3].pp.toFixed(2)} \n ` +
                        `96: ${ppcalcing[4].pp.toFixed(2)} \n ` +
                        `95: ${ppcalcing[5].pp.toFixed(2)} \n `,
                    inline: true
                }
            ])
            .setDescription(`
Mapped by ${mapParsed?.metadata?.creator}
Mode: ${input.config.useEmojis.gamemodes ? emojis.gamemodes[osumodcalc.ModeIntToName(mapParsed.mode)] : mapParsed.mode}
File format: ${mapParsed.fileFormat}
Map Creator: ${mapParsed.metadata.creator}
Last Updated: <t:${Math.floor((new Date(mapParsed?.fileUpdateDate)).getTime() / 1000)}:R>
HitObjects: ${mapParsed.hitObjects?.length}
`)
            .setImage(`attachment://${mapgraph}.jpg`);
    } catch (error) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Error - `,
                edit: true
            }
        }, input.canReply);
        console.log(error);
        log.logCommand({
            event: 'Error',
            commandName: 'map (file)',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: error
        });
        return;
    }
    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [osuEmbed],
            files: useFiles
        }
    }, input.canReply
    );

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'map (local)',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'map (local)',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }
}

/**
 * list of user's maps
 */
export async function userBeatmaps(input: extypes.commandInput & { statsCache: any; }) {
    let filter: 'favourite' | 'graveyard' | 'loved' | 'pending' | 'ranked' | 'nominated' | 'guest' | 'most_played' = 'favourite';
    let sort:
        'title' | 'artist' |
        'difficulty' | 'status' |
        'fails' | 'plays' |
        'dateadded' | 'favourites' | 'bpm' |
        'cs' | 'ar' | 'od' | 'hp' | 'length' = 'dateadded';
    let reverse = false;
    let user;
    let searchid;
    let page = 1;
    let parseMap = false;
    let parseId;
    let filterTitle = null;

    let commanduser: Discord.User;
    let reachedMaxCount = false;

    const mode: osuApiTypes.GameMode = 'osu';

    let embedStyle: extypes.osuCmdStyle = 'L';

    let mapDetailed: number = 1;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            if (input.args.includes('-page')) {
                const temp = func.parseArg(input.args, '-page', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-p')) {
                const temp = func.parseArg(input.args, '-p', 'number', page, null, true);
                page = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-detailed')) {
                mapDetailed = 2;
                input.args.splice(input.args.indexOf('-detailed'), 1);
            }
            if (input.args.includes('-d')) {
                mapDetailed = 2;
                input.args.splice(input.args.indexOf('-d'), 1);
            }
            if (input.args.includes('-compress')) {
                mapDetailed = 0;
                input.args.splice(input.args.indexOf('-compress'), 1);
            }
            if (input.args.includes('-c')) {
                mapDetailed = 0;
                input.args.splice(input.args.indexOf('-c'), 1);
            }

            if (input.args.includes('-ranked')) {
                filter = 'ranked';
                input.args.splice(input.args.indexOf('-ranked'), 1);
            }
            if (input.args.includes('-rank')) {
                filter = 'ranked';
                input.args.splice(input.args.indexOf('-rank'), 1);
            }
            if (input.args.includes('-favourites')) {
                filter = 'favourite';
                input.args.splice(input.args.indexOf('-favourites'), 1);
            }
            if (input.args.includes('-favourite')) {
                filter = 'favourite';
                input.args.splice(input.args.indexOf('-favourite'), 1);
            }
            if (input.args.includes('-fav')) {
                filter = 'favourite';
                input.args.splice(input.args.indexOf('-fav'), 1);
            }
            if (input.args.includes('-graveyard')) {
                filter = 'graveyard';
                input.args.splice(input.args.indexOf('-graveyard'), 1);
            }
            if (input.args.includes('-grave')) {
                filter = 'graveyard';
                input.args.splice(input.args.indexOf('-grave'), 1);
            }
            if (input.args.includes('-loved')) {
                filter = 'loved';
                input.args.splice(input.args.indexOf('-loved'), 1);
            }
            if (input.args.includes('-pending')) {
                filter = 'pending';
                input.args.splice(input.args.indexOf('-pending'), 1);
            }
            if (input.args.includes('-nominated')) {
                filter = 'nominated';
                input.args.splice(input.args.indexOf('-nominated'), 1);
            }
            if (input.args.includes('-bn')) {
                filter = 'nominated';
                input.args.splice(input.args.indexOf('-bn'), 1);
            }
            if (input.args.includes('-guest')) {
                filter = 'guest';
                input.args.splice(input.args.indexOf('-guest'), 1);
            }
            if (input.args.includes('-gd')) {
                filter = 'guest';
                input.args.splice(input.args.indexOf('-gd'), 1);
            }
            if (input.args.includes('-mostplayed')) {
                filter = 'most_played';
                input.args.splice(input.args.indexOf('-mostplayed'), 1);
            }
            if (input.args.includes('-most')) {
                filter = 'most_played';
                input.args.splice(input.args.indexOf('-most'), 1);
            }
            if (input.args.includes('-most_played')) {
                filter = 'most_played';
                input.args.splice(input.args.indexOf('-most_played'), 1);
            }
            if (input.args.includes('-mp')) {
                filter = 'most_played';
                input.args.splice(input.args.indexOf('-mp'), 1);
            }
            if (input.args.includes('-reverse')) {
                reverse = true;
                input.args.splice(input.args.indexOf('-reverse'), 1);
            }
            if (input.args.includes('-parse')) {
                parseMap = true;
                const temp = func.parseArg(input.args, '-parse', 'number', 1, null, true);
                parseId = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-?')) {
                const temp = func.parseArg(input.args, '-?', 'string', filterTitle, true);
                filterTitle = temp.value;
                input.args = temp.newArgs;
            }

            input.args = msgfunc.cleanArgs(input.args);

            user = input.args.join(' ');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null;
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.options.getString('user') ?? null;
            //@ts-expect-error string not assignable blah blah
            filter = input.obj.options.getString('type') ?? 'favourite';
            //@ts-expect-error string not assignable blah blah
            sort = input.obj.options.getString('sort') ?? 'dateadded';
            reverse = input.obj.options.getBoolean('reverse') ?? false;
            filterTitle = input.obj.options.getString('filter');

            parseId = input.obj.options.getInteger('parse');
            if (parseId != null) {
                parseMap = true;
            }

        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
            const curembed: Discord.Embed = input.obj.message.embeds[0];
            if (!curembed) return;
            user = curembed.author.url.split('u/')[1];
            sort = 'dateadded';
            //@ts-expect-error string not assignable blah blah
            filter = curembed.title.split('Maps')[0].split('\'s')[1].toLowerCase().replaceAll(' ', '');
            const curpage = parseInt(
                curembed.description.split('Page: ')[1].split('/')[0]
            );


            curembed.description.includes('Filter:') ?
                filterTitle = curembed.description.split('Filter: ')[1].split('\n')[0] :
                null;

            switch (input.button) {
                case 'BigLeftArrow':
                    page = 1;
                    break;
                case 'LeftArrow':
                    page = curpage - 1;
                    break;
                case 'RightArrow':
                    page = curpage + 1;
                    break;
                case 'BigRightArrow':
                    page = parseInt(
                        curembed.description.split('Page: ')[1].split('/')[1].split('\n')[0]
                    );
                    break;
                default:
                    page = curpage;
                    break;
            }
            switch (input.button) {
                case 'Detail0':
                    mapDetailed = 0;
                    break;
                case 'Detail1':
                    mapDetailed = 1;
                    break;
                case 'Detail2':
                    mapDetailed = 2;
                    break;
                default:
                    if (input.obj.message.embeds[0].footer.text.includes('LE')) {
                        mapDetailed = 2;
                    }
                    if (input.obj.message.embeds[0].footer.text.includes('LC')) {
                        mapDetailed = 0;
                    }
                    break;
            }
        }
            break;
    }
    if (input.overrides != null) {
        if (input.overrides.page) {
            page = input.overrides.page;
        }
        if (input.overrides.ex) {
            switch (input.overrides.ex) {
                case 'ranked':
                    filter = 'ranked';
                    break;
                case 'favourite':
                    filter = 'favourite';
                    break;
                case 'graveyard':
                    filter = 'graveyard';
                    break;
                case 'loved':
                    filter = 'loved';
                    break;
                case 'pending':
                    filter = 'pending';
                    break;
                case 'nominated':
                    filter = 'nominated';
                    break;
                case 'guest':
                    filter = 'guest';
                    break;
                case 'most_played':
                    filter = 'most_played';
                    break;
            }
        }
    }
    //==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('userbeatmaps', commanduser, input.absoluteID);


    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'user beatmaps',
        options: [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Type',
                value: filter
            },
            {
                name: 'Reverse',
                value: `${reverse}`
            },
            {
                name: 'Page',
                value: `${page}`
            },
            {
                name: 'Sort',
                value: sort
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            },
            {
                name: 'Detailed',
                value: mapDetailed
            }
        ],
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let buttons = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-Refresh-userbeatmaps-${commanduser.id}-${input.absoluteID}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.main.refresh),
    );

    const checkDetails = await msgfunc.buttonsAddDetails('userbeatmaps', commanduser, input.absoluteID, buttons, mapDetailed, embedStyle);
    buttons = checkDetails.buttons;
    embedStyle = checkDetails.embedStyle;

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    if (input.commandType == 'interaction') {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator('osu')) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator('osu'))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator('osu'));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator('osu')
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'userbeatmaps', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    osufunc.debug(osudataReq, 'command', 'userbeatmaps', input.obj.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'userbeatmaps', true, errors.noUser(user), true);
        return;
    }

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator('osu'));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator('osu'));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${mainconst.version}-User-userbeatmaps-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
            .setStyle(buttonsthing.type.current)
            .setEmoji(buttonsthing.label.extras.user),
    );

    let maplistdata: (osuApiTypes.Beatmapset[] & osuApiTypes.Error | osuApiTypes.BeatmapPlayCountArr) = [];

    async function getScoreCount(cinitnum) {
        if (cinitnum >= 499) {
            reachedMaxCount = true;
            return;
        }
        const fdReq: osufunc.apiReturn = await osufunc.apiget({
            type: 'user_get_maps',
            config: input.config,
            params: {
                userid: osudata.id,
                category: filter,
                opts: [`offset=${cinitnum}`]
            },
            version: 2,

        });
        const fd = fdReq.apiData;
        if (fdReq?.error) {
            await msgfunc.errorAndAbort(input, 'userbeatmaps', true, errors.uErr.osu.map.group_nf.replace('[TYPE]', filter), false);
            return;
        }
        if (fd?.hasOwnProperty('error')) {
            await msgfunc.errorAndAbort(input, 'userbeatmaps', true, errors.uErr.osu.map.group_nf.replace('[TYPE]', filter), true);
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }
            maplistdata.push(fd[i]);
        }
        if (fd.length == 100 && filter != 'most_played') {
            await getScoreCount(cinitnum + 100);
        }

    }

    if (func.findFile(osudata.id, 'maplistdata', null, filter) &&
        !('error' in func.findFile(osudata.id, 'maplistdata', null, filter)) &&
        input.button != 'Refresh'
    ) {
        maplistdata = func.findFile(osudata.id, 'maplistdata', null, filter);
    } else {
        await getScoreCount(0);
    }

    osufunc.debug(maplistdata, 'command', 'userbeatmaps', input.obj.guildId, 'mapListData');
    func.storeFile(maplistdata, osudata.id, 'maplistdata', null, filter);

    if (filterTitle) {
        maplistdata =
            filter == 'most_played' ?
                (maplistdata as osuApiTypes.BeatmapPlayCountArr).filter((x) =>
                    (
                        x.beatmapset.title.toLowerCase().replaceAll(' ', '')
                        +
                        x.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                        +
                        x.beatmap.version.toLowerCase().replaceAll(' ', '')
                    ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
                    ||
                    x.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
                    ||
                    x.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
                    ||
                    x.beatmap.version.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
                    ||
                    filterTitle.toLowerCase().replaceAll(' ', '').includes(x.beatmapset.title.toLowerCase().replaceAll(' ', ''))
                    ||
                    filterTitle.toLowerCase().replaceAll(' ', '').includes(x.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
                    ||
                    filterTitle.toLowerCase().replaceAll(' ', '').includes(x.beatmap.version.toLowerCase().replaceAll(' ', ''))
                ) : (maplistdata as osuApiTypes.Beatmapset[]).filter((x) =>
                    (
                        x.title.toLowerCase().replaceAll(' ', '')
                        +
                        x.artist.toLowerCase().replaceAll(' ', '')
                        +
                        x.beatmaps.map(x => x.version).join('').toLowerCase().replaceAll(' ', '')
                    ).includes(filterTitle.toLowerCase().replaceAll(' ', ''))
                    ||
                    x.title.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
                    ||
                    x.artist.toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
                    ||
                    x.beatmaps.map(x => x.version).join('').toLowerCase().replaceAll(' ', '').includes(filterTitle.toLowerCase().replaceAll(' ', ''))
                    ||
                    filterTitle.toLowerCase().replaceAll(' ', '').includes(x.title.toLowerCase().replaceAll(' ', ''))
                    ||
                    filterTitle.toLowerCase().replaceAll(' ', '').includes(x.artist.toLowerCase().replaceAll(' ', ''))
                    ||
                    filterTitle.toLowerCase().replaceAll(' ', '').includes(x.beatmaps.map(x => x.version).join('').toLowerCase().replaceAll(' ', ''))
                );
    }

    if (parseMap == true) {
        let pid = parseInt(parseId) - 1;
        if (pid < 0) {
            pid = 0;
        }
        if (pid > maplistdata.length) {
            pid = maplistdata.length - 1;
        }
        input.overrides = {
            id:
                filter == 'most_played' ?
                    (maplistdata as osuApiTypes.BeatmapPlayCountArr)[pid]?.beatmap_id :
                    (maplistdata as osuApiTypes.Beatmapset[])[pid]?.beatmaps[0]?.id,
            commanduser,
            commandAs: input.commandType
        };
        if (input.overrides.id == null) {
            await msgfunc.errorAndAbort(input, 'userbeatmaps', true, errors.uErr.osu.map.m_uk + `at index ${pid}`, true);
            return;
        }
        input.commandType = 'other';
        await map(input);
        return;
    }

    if (page >= Math.ceil(maplistdata.length / 5)) {
        page = Math.ceil(maplistdata.length / 5) - 1;
    }

    const mapsarg = await embedStuff.mapList({
        type:
            filter == 'most_played' ?
                'mapsetplays' :
                'mapset',
        maps: maplistdata,
        page: page,
        sort,
        reverse,
        detailed: mapDetailed
    }, input.config);

    const mapList = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setTitle(`${osudata.username}'s ${calc.toCapital(filter)} Maps`)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osudata.playmode}#beatmaps`)
        .setColor(colours.embedColour.userlist.dec)
        .setDescription(`
        ${mapsarg.filter}
        Page: ${page + 1}/${Math.ceil(mapsarg.maxPages)}
        ${filterTitle ? `Filter: ${filterTitle}` : ''}
        ${reachedMaxCount ? 'Only the first 500 mapsets are shown' : ''}
        `);

    if (mapsarg.fields.length == 0) {
        mapList.addFields([{
            name: 'Error',
            value: 'No mapsets found',
            inline: false
        }]);
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    } else {
        switch (mapDetailed) {
            case 0: case 2: {
                let temptxt = '\n' + mapsarg.string.join('');
                mapList.setDescription(
                    `
${mapsarg.filter}
Page: ${page + 1}/${Math.ceil(mapsarg.maxPages)}${filterTitle ? `\nFilter: ${filterTitle}` : ''}${reachedMaxCount ? '\nOnly the first 500 mapsets are shown' : ''}`
                    + temptxt
                );
            }
                break;
            case 1: default: {
                for (let i = 0; i < mapsarg.fields.length; i++) {
                    mapList.addFields([mapsarg.fields[i]]);
                }
            }
                break;
        }
    }
    if (mapsarg.isFirstPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (mapsarg.isLastPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            edit: true,
            embeds: [mapList],
            components: [pgbuttons, buttons]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'userbeatmaps',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'userbeatmaps',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }


}


//tracking

/**
 * add user to tracking list
 */
export async function trackadd(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let user;
    let mode: osuApiTypes.GameMode = 'osu';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }
            user = input.args[0];
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            user = input.obj.options.getString('user');

        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'track add',
        options: [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Mode',
                value: mode
            }
        ],
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (user == null || !user || user.length < 1) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.osu.tracking.nullUser,
                edit: true
            }
        }, input.canReply);
        return;
    }
    const guildsetting = await input.guildSettings.findOne({ where: { guildid: input.obj.guildId } });

    if (!guildsetting?.dataValues?.trackChannel) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.osu.tracking.channel_ms,
                edit: true
            }
        }, input.canReply);
        return;
    } else {
        if (guildsetting?.dataValues?.trackChannel != input.obj.channelId) {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: errors.uErr.osu.tracking.channel_wrong.replace('[CHID]', guildsetting?.dataValues?.trackChannel),
                    edit: true
                }
            }, input.canReply);
            return;
        }
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', mode) &&
        !('error' in func.findFile(user, 'osudata', mode)) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', mode);
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: mode
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'trackadd', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    let replymsg;

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        replymsg = errors.noUser(user);
        log.logCommand({
            event: 'Error',
            commandName: 'track add',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: errors.noUser(user)
        });
    } else {

        replymsg = `Added \`${osudata.username}\` to the tracking list\nGamemode: \`${mode}\``;

        func.storeFile(osudataReq, osudata.id, 'osudata', mode);
        func.storeFile(osudataReq, user, 'osudata', mode);

        trackfunc.editTrackUser({
            database: input.trackDb,
            userid: osudata.id,
            action: 'add',
            guildId: input.obj.guildId,
            guildSettings: input.guildSettings,
            mode: mode
        });
    }
    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: replymsg,
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'track add',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'track add',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }

}

/**
 * remove user from tracking list
 */
export async function trackremove(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let user;
    let mode: osuApiTypes.GameMode = 'osu';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }
            user = input.args[0];
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            user = input.obj.options.getString('user');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'track remove',
        options: [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Mode',
                value: mode
            }
        ],
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (user == null || !user || user.length < 1) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.osu.tracking.nullUser,
                edit: true
            }
        }, input.canReply);
        return;
    }
    const guildsetting = await input.guildSettings.findOne({ where: { guildid: input.obj.guildId } });

    if (!guildsetting?.dataValues?.trackChannel) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.osu.tracking.channel_ms,
                edit: true
            }
        }, input.canReply);
        return;
    } else {
        if (guildsetting?.dataValues?.trackChannel != input.obj.channelId) {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: errors.uErr.osu.tracking.channel_wrong.replace('[CHID]', guildsetting?.dataValues?.trackChannel),
                    edit: true
                }
            }, input.canReply);
            return;
        }
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', mode) &&
        !('error' in func.findFile(user, 'osudata', mode)) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', mode);
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'trackremove', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    let replymsg;

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        replymsg = errors.noUser(user);
        log.logCommand({
            event: 'Error',
            commandName: 'track remove',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: errors.noUser(user)
        });
    } else {

        replymsg = `Removed \`${osudata.username}\` from the tracking list`;

        func.storeFile(osudataReq, osudata.id, 'osudata', mode);
        func.storeFile(osudataReq, user, 'osudata', mode);

        trackfunc.editTrackUser({
            database: input.trackDb,
            userid: osudata.id,
            action: 'remove',
            guildId: input.obj.guildId,
            guildSettings: input.guildSettings,
            mode
        });
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: replymsg,
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'track remove',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'track remove',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }

}

/**
 * channel to send tracking updates to
 */
export async function trackchannel(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let channelId;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
            channelId = input.args[0];
            if (input.obj.content.includes('<#')) {
                channelId = input.obj.content.split('<#')[1].split('>')[0];
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            channelId = (input.obj.options.getChannel('channel')).id;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'track channel',
        options: [
            {
                name: 'Channel id',
                value: `${channelId}`
            }
        ],
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const guildsetting = await input.guildSettings.findOne({ where: { guildid: input.obj.guildId } });

    if (!channelId) {
        if (!guildsetting.dataValues.trackChannel) {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: errors.uErr.osu.tracking.channel_ms,
                    edit: true
                }
            }, input.canReply);
            return;
        }
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `The current tracking channel is <#${guildsetting.dataValues.trackChannel}>`,
                edit: true
            }
        }, input.canReply);
        return;
    }

    if (!channelId || isNaN(+channelId) || !input.client.channels.cache.get(channelId)) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.admin.channel.msid,
                edit: true
            }
        }, input.canReply);
        return;
    }

    // guildsetting.dataValues.trackChannel = channelId;
    await guildsetting.update({
        trackChannel: channelId
    }, {
        where: { guildid: input.obj.guildId }
    });

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: `Tracking channel set to <#${channelId}>`,
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'track channel',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'track channel',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }

}

/**
 * list of users being tracked
 */
export async function tracklist(input: extypes.commandInput) {
    let commanduser: Discord.User;
    const embedStyle: extypes.osuCmdStyle = 'L';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }
    //==============================================================================================================================================================================================

    // const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('tracklist', commanduser, input.absoluteID);


    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'track list',
        options: [],
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const users = await input.trackDb.findAll();
    const useridsarraylen = await input.trackDb.count();
    // const user: extypes.dbUser = userids[i].dataValues;

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

        //check if input.obj.guildId is in guilds
        if (guilds.includes(input.obj.guildId)) {
            userList.push({
                osuid: `${user.osuid}`,
                userid: `${user.userid}`,
                mode: `${user.mode}`
            });
        }
    }
    const userListEmbed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setTitle(`All tracked users in ${input.obj.guild.name}`)
        .setColor(colours.embedColour.userlist.dec)
        .setDescription(`There are ${userList.length} users being tracked in this server\n\n` +
            `${userList.map((user, i) => `${i + 1}. ${input.config.useEmojis.gamemodes ? emojis.gamemodes[user.mode == 'undefined' ? 'osu' : user.mode] : user.mode == 'undefined' ? 'osu' : user.mode} https://osu.ppy.sh/users/${user.osuid}`).join('\n')}`
        );

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [userListEmbed],
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'track list',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'track list',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }
}

//other

/**
 * compare stats/plays
 */
export async function compare(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let type: 'profile' | 'top' | 'mapscore' = 'profile';
    let first = null;
    let second = null;
    let firstsearchid = null;
    let secondsearchid = null;
    let mode = 'osu';
    let page = 0;

    let embedStyle: extypes.osuCmdStyle = 'P';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            if (input.obj.mentions.users.size > 1) {
                firstsearchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
                secondsearchid = input.obj.mentions.users.size > 1 ? input.obj.mentions.users.at(1).id : null;
            } else if (input.obj.mentions.users.size == 1) {
                firstsearchid = input.obj.author.id;
                secondsearchid = input.obj.mentions.users.at(0).id;
            } else {
                firstsearchid = input.obj.author.id;
            }
            first = null;
            second = input.args[0] ?? null;
            if (input.args[1]) {
                first = input.args[0];
                second = input.args[1];
            }
            first != null && first.includes(firstsearchid) ? first = null : null;
            second != null && second.includes(secondsearchid) ? second = null : null;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);

            commanduser = input.obj.member.user;
            //@ts-expect-error string not assignable blah blah
            type = input.obj.options.getString('type') ?? 'profile';
            first = input.obj.options.getString('first');
            second = input.obj.options.getString('second');
            firstsearchid = commanduser.id;
            mode = input.obj.options.getString('mode') ?? 'osu';
            if (second == null && first != null) {
                second = first;
                first = null;
            }
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            if (!input.obj.message.embeds[0]) {
                return;
            }
            commanduser = input.obj.member.user;
            type = 'top';
            const pawge = parseInt(input.obj.message.embeds[0].description.split('Page: ')[1].split('/')[0]);

            const pagefin = parseInt(input.obj.message.embeds[0].description.split('Page: ')[1].split('/')[1]);
            switch (input.button) {
                case 'BigLeftArrow': {
                    page = 0;
                }
                    break;
                case 'LeftArrow': {
                    page = pawge - 1;
                }
                    break;
                case 'RightArrow': {
                    page = pawge + 1;
                }
                    break;
                case 'BigRightArrow': {
                    page = pagefin;
                }
                    break;
                case 'Refresh': {
                    page = pawge;
                }
                    break;
            }

            if (page > pagefin) page = pagefin;

            const firsti = input.obj.message.embeds[0].description.split('and')[0];
            const secondi = input.obj.message.embeds[0].description.split('and')[1].split('have')[0];

            //user => [name](url)
            first = firsti.split('users/')[1].split(')')[0];
            second = secondi.split('users/')[1].split(')')[0];
        }
            break;
    }
    if (input.overrides != null) {
        //@ts-expect-error string not assignable blah blah
        if (input.overrides.type != null) type = input.overrides.type;
    }
    //==============================================================================================================================================================================================
    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'compare',
        options: [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'First',
                value: first
            },
            {
                name: 'Second',
                value: second
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'FirstSearchId',
                value: firstsearchid
            },
            {
                name: 'SecondSearchId',
                value: secondsearchid
            },
            {
                name: 'Page',
                value: page
            }
        ],
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    let fieldFirst: Discord.EmbedField = {
        name: 'First',
        value: 'Loading...',
        inline: true
    };
    let fieldSecond: Discord.EmbedField = {
        name: 'Second',
        value: 'Loading...',
        inline: true
    };
    let fieldComparison: Discord.EmbedField = {
        name: 'Comparison',
        value: 'Loading...',
        inline: false
    };
    let embedTitle: string = 'w';
    const usefields: Discord.EmbedField[] = [];

    const useComponents: Discord.ActionRowBuilder[] = [];
    let embedescription: string = null;

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;
    try {
        if (second == null) {
            if (secondsearchid) {
                const cuser = await osufunc.searchUser(secondsearchid, input.userdata, true);
                second = cuser.username;
                if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                    if (input.commandType != 'button') {
                        throw new Error('Second user not found');
                    }
                    return;
                }
            } else {
                if (osufunc.getPreviousId('user', `${input.obj.guildId}`).id == false) {
                    throw new Error(`Could not find second user - ${errors.uErr.osu.profile.user_msp}`);
                }
                second = osufunc.getPreviousId('user', `${input.obj.guildId}`).id;
            }
        }
        if (first == null) {
            if (firstsearchid) {
                const cuser = await osufunc.searchUser(firstsearchid, input.userdata, true);
                first = cuser.username;
                if (mode == null) {
                    mode = cuser.gamemode;
                }
                if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                    if (input.commandType != 'button') {
                        throw new Error('First user not found');
                    }
                    return;
                }
            } else {
                throw new Error('first user not found');
            }
        }

        let firstuserReq: osufunc.apiReturn;
        if (func.findFile(first, 'osudata') &&
            !('error' in func.findFile(first, 'osudata')) &&
            input.button != 'Refresh'
        ) {
            firstuserReq = func.findFile(first, 'osudata');
        } else {
            firstuserReq = await osufunc.apiget(
                {
                    type: 'user',
                    config: input.config,
                    params: {
                        username: first
                    }
                });
        }

        const firstuser = firstuserReq.apiData;
        if (firstuserReq?.error) {
            await msgfunc.errorAndAbort(input, 'compare', true, errors.uErr.osu.profile.user.replace('[ID]', first), false);
            return;
        }
        if (firstuser?.hasOwnProperty('error')) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                throw new Error('could not fetch first user data');

            }
            return;
        }


        let seconduserReq: osufunc.apiReturn;
        if (func.findFile(second, 'osudata') &&
            !('error' in func.findFile(second, 'osudata')) &&
            input.button != 'Refresh'
        ) {
            seconduserReq = func.findFile(second, 'osudata');
        } else {
            seconduserReq = await osufunc.apiget(
                {
                    type: 'user',
                    config: input.config,
                    params: {
                        username: second
                    }
                });
        }

        const seconduser = seconduserReq.apiData;
        if (seconduserReq?.error) {
            await msgfunc.errorAndAbort(input, 'compare', true, errors.uErr.osu.profile.user.replace('[ID]', second), false);
            return;
        }
        if (seconduser?.hasOwnProperty('error')) {
            if (input.commandType != 'button' && input.commandType != 'link') {
                throw new Error('could not fetch second user data');
            }
            return;
        }
        func.storeFile(firstuserReq, first, 'osudata');
        func.storeFile(firstuserReq, firstuser.id, 'osudata');
        func.storeFile(seconduserReq, seconduser.id, 'osudata');
        func.storeFile(seconduserReq, second, 'osudata');


        switch (type) {
            case 'profile': {
                embedTitle = 'Comparing profiles';
                fieldFirst = {
                    name: `**${firstuser.username}**`,
                    value:
                        `**Rank:** ${func.separateNum(firstuser?.statistics.global_rank)}
**pp:** ${func.separateNum(firstuser?.statistics.pp)}
**Accuracy:** ${(firstuser?.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${func.separateNum(firstuser?.statistics.play_count)}
**Level:** ${func.separateNum(firstuser.statistics.level.current)}
`,
                    inline: true
                };
                fieldSecond = {
                    name: `**${seconduser.username}**`,
                    value:
                        `**Rank:** ${func.separateNum(seconduser?.statistics.global_rank)}
**pp:** ${func.separateNum(seconduser?.statistics.pp)}
**Accuracy:** ${(seconduser?.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${func.separateNum(seconduser?.statistics.play_count)}
**Level:** ${func.separateNum(seconduser.statistics.level.current)}
`,
                    inline: true
                };
                fieldComparison = {
                    name: `**Difference**`,
                    value:
                        `**Rank:** ${func.separateNum(Math.abs(firstuser.statistics.global_rank - seconduser.statistics.global_rank))}
**pp:** ${func.separateNum(Math.abs(firstuser?.statistics.pp - seconduser?.statistics.pp).toFixed(2))}
**Accuracy:** ${Math.abs((firstuser.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0) - (seconduser.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0)).toFixed(2)}%
**Playcount:** ${func.separateNum(Math.abs(firstuser.statistics.play_count - seconduser.statistics.play_count))}
**Level:** ${func.separateNum(Math.abs(firstuser.statistics.level.current - seconduser.statistics.level.current))}
`,
                    inline: false
                };
                usefields.push(fieldFirst, fieldSecond, fieldComparison);
            }
                break;



            case 'top': {
                embedStyle = 'LC';
                page;
                let firsttopdataReq: osufunc.apiReturn;
                if (func.findFile(input.absoluteID, 'firsttopdata') &&
                    !('error' in func.findFile(input.absoluteID, 'firsttopdata')) &&
                    input.button != 'Refresh'
                ) {
                    firsttopdataReq = func.findFile(input.absoluteID, 'firsttopdata');
                } else {
                    firsttopdataReq = await osufunc.apiget({
                        type: 'best',
                        config: input.config,
                        params: {
                            userid: firstuser.id,
                            mode: osufunc.modeValidator(mode),
                            opts: ['limit=100']
                        }
                    });
                }

                const firsttopdata: osuApiTypes.Score[] & osuApiTypes.Error = firsttopdataReq.apiData;
                if (firsttopdataReq?.error) {
                    await msgfunc.errorAndAbort(input, 'compare', true, errors.uErr.osu.scores.best.replace('[ID]', firstuser.id), false);
                    return;
                }
                if (firsttopdata?.hasOwnProperty('error')) {
                    if (input.commandType != 'button' && input.commandType != 'link') {
                        throw new Error('could not fetch first user\'s top scores');
                    }
                    return;
                }

                let secondtopdataReq: osufunc.apiReturn;
                if (func.findFile(input.absoluteID, 'secondtopdata') &&
                    !('error' in func.findFile(input.absoluteID, 'secondtopdata')) &&
                    input.button != 'Refresh'
                ) {
                    secondtopdataReq = func.findFile(input.absoluteID, 'secondtopdata');
                } else {
                    secondtopdataReq = await osufunc.apiget({
                        type: 'best',
                        config: input.config,
                        params: {
                            userid: seconduser.id,
                            mode: osufunc.modeValidator(mode),
                            opts: ['limit=100']
                        }
                    });
                }

                const secondtopdata: osuApiTypes.Score[] & osuApiTypes.Error = secondtopdataReq.apiData;
                if (secondtopdataReq?.error) {
                    await msgfunc.errorAndAbort(input, 'compare', true, errors.uErr.osu.scores.best.replace('[ID]', seconduser.id), false);
                    return;
                }
                if (secondtopdata?.hasOwnProperty('error')) {
                    if (input.commandType != 'button' && input.commandType != 'link') {
                        throw new Error('could not fetch second user\'s top scores');
                    }
                    return;
                }
                func.storeFile(firsttopdataReq, input.absoluteID, 'firsttopdata');
                func.storeFile(secondtopdataReq, input.absoluteID, 'secondtopdata');

                const filterfirst = [];
                //filter so that scores that have a shared beatmap id with the second user are kept
                for (let i = 0; i < firsttopdata.length; i++) {
                    if (secondtopdata.find(score => score.beatmap.id == firsttopdata[i].beatmap.id)) {
                        filterfirst.push(firsttopdata[i]);
                    }
                }
                filterfirst.sort((a, b) => b.pp - a.pp);
                embedTitle = 'Comparing top scores';
                const arrscore = [];

                for (let i = 0; i < filterfirst.length && i < 5; i++) {
                    const firstscore: osuApiTypes.Score = filterfirst[i + (page * 5)];
                    if (!firstscore) break;
                    const secondscore: osuApiTypes.Score = secondtopdata.find(score => score.beatmap.id == firstscore.beatmap.id);
                    if (secondscore == null) break;
                    const firstscorestr =
                        `\`${firstscore.pp.toFixed(2)}pp | ${(firstscore.accuracy * 100).toFixed(2)}% ${firstscore.mods.length > 0 ? '| +' + firstscore.mods.join('') : ''}`;//.padEnd(30, ' ').substring(0, 30)
                    const secondscorestr =
                        `${secondscore.pp.toFixed(2)}pp | ${(secondscore.accuracy * 100).toFixed(2)}% ${secondscore.mods.length > 0 ? '| +' + secondscore.mods.join('') : ''}\`\n`;//.padEnd(30, ' ').substring(0, 30)
                    arrscore.push(
                        `**[\`${firstscore.beatmapset.title} [${firstscore.beatmap.version}]\`](https://osu.ppy.sh/b/${firstscore.beatmap.id})**
\`${firstuser.username.padEnd(30, ' ').substring(0, 30)} | ${seconduser.username.padEnd(30, ' ').substring(0, 30)}\`
${firstscorestr.substring(0, 30)} || ${secondscorestr.substring(0, 30)}`
                    );
                }

                embedescription = `**[${firstuser.username}](https://osu.ppy.sh/users/${firstuser.id})** and **[${seconduser.username}](https://osu.ppy.sh/users/${seconduser.id})** have ${filterfirst.length} shared scores
                Page: ${page + 1}/${Math.ceil(filterfirst.length / 5)}`;
                for (const score of arrscore) {
                    usefields.push({
                        name: def.invisbleChar,
                        value: score,
                        inline: false
                    });
                }

                const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('compare', commanduser, input.absoluteID);


                useComponents.push(pgbuttons);
            }
                break;



            case 'mapscore': {
                embedTitle = 'Comparing map scores';
                fieldFirst = {
                    name: `**${firstuser.username}**`,
                    value: '',
                    inline: true
                };
                fieldSecond = {
                    name: `**${seconduser.username}**`,
                    value: 's',
                    inline: true
                };
                fieldComparison = {
                    name: `**Difference**`,
                    value: 'w',
                    inline: false
                };
                usefields.push(fieldFirst, fieldSecond, fieldComparison);
            }
                break;

        }
        osufunc.writePreviousId('user', input.obj.guildId, { id: `${seconduser.id}`, apiData: null, mods: null });
    } catch (error) {
        embedTitle = 'Error';
        usefields.push({
            name: 'Error',
            value: `${error}`,
            inline: false
        });
        log.logCommand({
            event: 'Error',
            commandName: 'compare',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: `${error}`
        });
    }

    const embed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setTitle(embedTitle)
        .setFields(usefields);
    if (embedescription != null && embedescription.length > 0) { embed.setDescription(embedescription); }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
            components: useComponents,
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'compare',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'compare',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }

}

/**
 * set username/mode/skin
 */
export async function osuset(input: extypes.commandInput) {

    let commanduser: Discord.User;

    let name;
    let mode;
    let skin;
    let location;
    let tz;

    let type;
    let value;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;
            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            if (input.args.includes('-skin')) {
                const temp = func.parseArg(input.args, '-skin', 'string', skin, true);
                skin = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-location')) {
                const temp = func.parseArg(input.args, '-location', 'string', location, true);
                location = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-weather')) {
                const temp = func.parseArg(input.args, '-weather', 'string', location, true);
                location = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-timezone')) {
                const temp = func.parseArg(input.args, '-timezone', 'string', tz, true);
                tz = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-tz')) {
                const temp = func.parseArg(input.args, '-tz', 'string', tz, true);
                tz = temp.value;
                input.args = temp.newArgs;
            }

            input.args = msgfunc.cleanArgs(input.args);

            name = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            name = input.obj.options.getString('user');
            mode = input.obj.options.getString('mode');
            skin = input.obj.options.getString('skin');
            type = 'interaction';
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }

    if (input.overrides != null) {
        if (input.overrides.type != null) {
            switch (input.overrides.type) {
                case 'mode':
                    mode = name;
                    break;
                case 'skin':
                    skin = name;
                    break;
                case 'tz':
                    tz = name;
                    break;
                case 'location':
                    location = name;
                    break;
            }
            name = null;
        }
    }

    //==============================================================================================================================================================================================

    //OPTIONS==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'osuset',
        options: [
            {
                name: 'Name',
                value: name
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Skin',
                value: skin
            },
            {
                name: 'TZ',
                value: tz
            },
            {
                name: 'Location',
                value: location
            },
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Value',
                value: value
            },
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let txt = 'null';

    if (mode) {
        const thing = osufunc.modeValidatorAlt(mode);
        mode = thing.mode;
        if (thing.isincluded == false) {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: errors.uErr.osu.set.mode,
                    edit: true
                }
            }, input.canReply);
            return;
        }
    }

    let updateRows: {
        userid: string | number,
        osuname?: string,
        mode?: string,
        skin?: string,
    } = {
        userid: commanduser.id
    };
    updateRows = {
        userid: commanduser.id,
    };
    if (name != null) {
        updateRows['osuname'] = name;
    }
    if (mode != null) {
        updateRows['mode'] = mode;
    }
    if (skin != null) {
        updateRows['skin'] = skin;
    }
    if (tz != null) {
        updateRows['timezone'] = tz;
    }
    if (location != null) {
        updateRows['location'] = location;
    }

    const findname = await input.userdata.findOne({ where: { userid: commanduser.id } });
    if (findname == null) {
        try {
            await input.userdata.create({
                userid: commanduser.id,
                osuname: name ?? 'undefined',
                mode: mode ?? 'osu',
                skin: skin ?? 'Default - https://osu.ppy.sh/community/forums/topics/129191?n=117',
                location,
                timezone: tz,
            });
            txt = 'Added to database';
            if (name) {
                txt += `\nSet your username to \`${name}\``;
            }
            if (mode) {
                txt += `\nSet your mode to \`${mode}\``;
            }
            if (skin) {
                txt += `\nSet your skin to \`${skin}\``;
            }
            if (location) {
                txt += `\nSet your location to \`${location}\``;
            }
            if (tz) {
                txt += `\nSet your timezone to \`${tz}\``;
            }
        } catch (error) {
            txt = 'There was an error trying to update your settings';
            log.errLog('Database error', error, `${input.absoluteID}`);
        }
    } else {
        const affectedRows = await input.userdata.update(
            updateRows,
            { where: { userid: commanduser.id } }
        );

        if (affectedRows.length > 0 || affectedRows[0] > 0) {
            txt = 'Updated your settings:';
            if (name) {
                txt += `\nSet your username to \`${name}\``;
            }
            if (mode) {
                txt += `\nSet your mode to \`${mode}\``;
            }
            if (skin) {
                txt += `\nSet your skin to \`${skin}\``;
            }
            if (location) {
                txt += `\nSet your location to \`${location}\``;
            }
            if (tz) {
                txt += `\nSet your timezone to \`${tz}\``;
            }
        } else {
            txt = 'There was an error trying to update your settings';
            log.errLog('Database error', `${affectedRows}`, `${input.absoluteID}`);
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: txt,
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'osuset',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'osuset',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }

}

/**
 * return saved osu! username/mode/skin
 */
export async function saved(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let searchid;
    let user;
    let show = {
        name: true,
        mode: true,
        skin: true,
        tz: true,
        weather: true,
    };
    let overrideTitle;

    const embedStyle: extypes.osuCmdStyle = 'A';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;
            user = input.args.join(' ');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null;
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }

    if (input.overrides) {
        if (input?.overrides?.type != null) {
            switch (input?.overrides?.type) {
                case 'username':
                    show = {
                        name: true,
                        mode: false,
                        skin: false,
                        tz: false,
                        weather: false,
                    };
                    break;
                case 'mode':
                    show = {
                        name: false,
                        mode: true,
                        skin: false,
                        tz: false,
                        weather: false,
                    };
                    break;
                case 'skin':
                    show = {
                        name: false,
                        mode: false,
                        skin: true,
                        tz: false,
                        weather: false,
                    };
                    break;
                case 'tz':
                    show = {
                        name: false,
                        mode: false,
                        skin: false,
                        tz: true,
                        weather: false,
                    };
                    break;
                case 'weather':
                    show = {
                        name: false,
                        mode: false,
                        skin: false,
                        tz: false,
                        weather: true,
                    };
                    break;
            }
        }
        if (input?.overrides?.ex != null) {
            overrideTitle = input?.overrides?.ex;
        }
    }

    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'saved',
        options: [
            {
                name: 'User id',
                value: searchid
            }
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let cuser: any = {
        osuname: 'null',
        mode: 'osu! (Default)',
        skin: 'osu! classic'
    };

    let fr;
    if (user == null) {
        fr = input.client.users.cache.get(searchid)?.username ?? 'null';
    }

    const Embed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setTitle(`${user != null ? user : fr}'s ${overrideTitle ?? 'saved settings'}`);

    if (user == null) {
        cuser = await input.userdata.findOne({ where: { userid: searchid } });
    } else {
        const allUsers = await input.userdata.findAll();

        cuser = allUsers.filter(x => (`${x.osuname}`.trim().toLowerCase() == `${user}`.trim().toLowerCase()))[0];
    }

    if (cuser) {
        const fields = [];
        if (show.name == true) {
            fields.push({
                name: 'Username',
                value: `${cuser.osuname && cuser.mode.length > 1 ? cuser.osuname : 'undefined'}`,
                inline: true
            });
        }
        if (show.mode == true) {
            fields.push({
                name: 'Mode',
                value: `${cuser.mode && cuser.mode.length > 1 ? cuser.mode : 'osu (default)'}`,
                inline: true
            });
        }
        if (show.skin == true) {
            fields.push({
                name: 'Skin',
                value: `${cuser.skin && cuser.skin.length > 1 ? cuser.skin : 'None'}`,
                inline: true
            });
        }
        if (show.tz == true) {
            fields.push({
                name: 'Timezone',
                value: `${cuser.timezone && cuser.timezone.length > 1 ? cuser.timezone : 'None'}`,
                inline: true
            });
        }
        if (show.weather == true) {
            fields.push({
                name: 'Location',
                value: `${cuser.location && cuser.location.length > 1 ? cuser.location : 'None'}`,
                inline: true
            });
        }
        Embed.addFields(fields);
    } else {
        Embed.setDescription('No saved settings found');
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embed],
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'saved',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'saved',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }
}

/**
 * estimate stats if x pp score
 */
export async function whatif(input: extypes.commandInput & { statsCache: any; }) {

    let commanduser: Discord.User;
    let user;
    let pp;
    let searchid;
    let mode;

    const embedStyle: extypes.osuCmdStyle = 'A';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);

            commanduser = input.obj.author;

            searchid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : input.obj.author.id;

            {
                const temp = await msgfunc.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = msgfunc.cleanArgs(input.args);

            if (!isNaN(+input.args[0])) {
                pp = +input.args[0];
            }

            if ((input.args[0] && input.args[1])) {
                if (input.args[0].includes(searchid)) {
                    user = null;
                } else {
                    user = input.args[0];
                }
                pp = input.args[1] ?? null;

            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;

            user = input.obj.options.getString('user');

            mode = input.obj.options.getString('mode');

            pp = input.obj.options.getNumber('pp');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
            searchid = commanduser.id;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        config: input.config,
        commandName: 'what if',
        options: [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Performance Points',
                value: pp
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Search ID',
                value: searchid
            }
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //if user is null, use searchid
    if (user == null) {
        const cuser = await osufunc.searchUser(searchid, input.userdata, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = input.client.users.cache.get(searchid);
        user = cuser.username;
    }

    if (!pp) {
        pp = 100;
    }

    let osudataReq: osufunc.apiReturn;

    if (func.findFile(user, 'osudata', osufunc.modeValidator(mode)) &&
        !('error' in func.findFile(user, 'osudata', osufunc.modeValidator(mode))) &&
        input.button != 'Refresh'
    ) {
        osudataReq = func.findFile(user, 'osudata', osufunc.modeValidator(mode));
    } else {
        osudataReq = await osufunc.apiget({
            type: 'user',
            config: input.config,
            params: {
                username: cmdchecks.toHexadecimal(user),
                mode: osufunc.modeValidator(mode)
            }
        });
    }

    const osudata: osuApiTypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await msgfunc.errorAndAbort(input, 'whatif', true, errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await msgfunc.errorAndAbort(input, 'whatif', true, errors.noUser(user), true);
        return;
    }

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-User-whatif-any-${input.absoluteID}-${osudata.id}+${osudata.playmode}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.user),
        );

    osufunc.userStatsCache([osudata], input.statsCache, osufunc.modeValidator(mode), 'User');

    func.storeFile(osudataReq, osudata.id, 'osudata', osufunc.modeValidator(mode));
    func.storeFile(osudataReq, user, 'osudata', osufunc.modeValidator(mode));

    osufunc.debug(osudataReq, 'command', 'whatif', input.obj.guildId, 'osuData');

    if (mode == null) {
        mode = osudata.playmode;
    }

    const osutopdataReq: osufunc.apiReturn = await osufunc.apiget({
        type: 'best',
        config: input.config,
        params: {
            userid: osudata.id,
            mode: mode,
            opts: ['limit=100']
        }
    });


    const osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = osutopdataReq.apiData; osufunc.debug(osutopdataReq, 'command', 'whatif', input.obj.guildId, 'osuTopData');
    if (osutopdataReq?.error) {
        await msgfunc.errorAndAbort(input, 'whatif', true, errors.uErr.osu.scores.best.replace('[ID]', user), false);
        return;
    }
    if (osutopdata?.hasOwnProperty('error')) {
        await msgfunc.errorAndAbort(input, 'whatif', true, errors.uErr.osu.scores.best.replace('[ID]', user), true);
        return;
    }

    const pparr = osutopdata.slice().map(x => x.pp);
    pparr.push(pp);
    pparr.sort((a, b) => b - a);
    const ppindex = pparr.indexOf(pp);

    const weight = osufunc.findWeight(ppindex);

    const newTotal: number[] = [];

    for (let i = 0; i < pparr.length; i++) {
        newTotal.push(pparr[i] * osufunc.findWeight(i));
    }

    const total = newTotal.reduce((a, b) => a + b, 0);
    //     416.6667 * (1 - 0.9994 ** osudata.statistics.play_count);

    const newBonus = [];
    for (let i = 0; i < osutopdata.length; i++) {
        newBonus.push(osutopdata[i].weight.pp/*  ?? (osutopdata[i].pp * osufunc.findWeight(i)) */);
    }

    const bonus = osudata.statistics.pp - newBonus.reduce((a, b) => a + b, 0);

    const guessrank = await osufunc.getRankPerformance('pp->rank', (total + bonus), `${osufunc.modeValidator(mode)}`, input.statsCache);

    const embed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${embedStyle}`
        })
        .setTitle(`What if ${osudata.username} gained ${pp}pp?`)
        .setColor(colours.embedColour.query.dec)
        .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
        .setAuthor({
            name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setDescription(
            `A ${pp} score would be their **${calc.toOrdinal(ppindex + 1)}** top play and would be weighted at **${(weight * 100).toFixed(2)}%**.
Their pp would change by **${Math.abs((total + bonus) - osudata.statistics.pp).toFixed(2)}pp** and their new total pp would be **${(total + bonus).toFixed(2)}pp**.
Their new rank would be **${Math.round(guessrank)}** (+${Math.round(osudata?.statistics?.global_rank - guessrank)}).
`
        );

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
            components: [buttons]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'whatif',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'whatif',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
            customString: 'Message failed to send'
        });
    }

}