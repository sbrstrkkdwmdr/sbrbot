import * as Discord from 'discord.js';
import * as fs from 'fs';
import { filespath, path } from '../path.js';
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
import * as trackfunc from '../src/trackfunc.js';
import * as extypes from '../src/types/extratypes.js';
import * as osuapitypes from '../src/types/osuApiTypes.js';
import * as msgfunc from './msgfunc.js';

export async function name(input: extypes.commandInput) {

}

/**
 * return permissions of user
 */
export async function checkperms(input: extypes.commandInput) {

    let commanduser;
    let searchUser;
    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;

            if (input.args[0]) {
                if (input.obj.mentions.users.size > 0) {
                    searchUser = input.obj.mentions.users.first();
                } else {
                    searchUser = input.client.users.cache.get(input.args.join(' '));
                }
            } else {
                searchUser = commanduser;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;

            if (input.obj.options.getUser('user')) {
                searchUser = input.obj.options.getUser('user');
            } else {
                searchUser = commanduser;
            }
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
        commandName: 'checkperms',
        options: [
            {
                name: 'User',
                value: searchUser.id ?? commanduser.id
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (searchUser == null || typeof searchUser == 'undefined') {
        searchUser = commanduser;
    }
    if (!(cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client) || cmdchecks.isOwner(commanduser.id, input.config))) {
        searchUser = commanduser;
    }


    const embed = new Discord.EmbedBuilder();
    try {
        const userAsMember = input.obj.guild.members.cache.get(searchUser.id);
        //get perms
        const perms = userAsMember.permissions.toArray().join(' **|** ');

        embed
            .setTitle(`${searchUser.username}'s Permissions`)
            .setDescription(`**${perms}**`)
            .setColor(colours.embedColour.admin.dec);

    } catch (err) {
        embed.setTitle('Error')
            .setDescription('An error occured while trying to get the permissions of the user.')
            .setColor(colours.embedColour.admin.dec);

    }




    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'checkperms',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'checkperms',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * force crash bot
 */
export async function crash(input: extypes.commandInput) {

    let commanduser;
    let baseCommandType;

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
    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'crash',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    console.log('executed crash command');
    process.exit(1);
}

export async function get(input: extypes.commandInput) {
    let commanduser: Discord.User;
    type typex = 'server' | 'user' | 'channel';
    let type: typex;
    let searchid;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            type = (input.args[0]?.toLowerCase().trim() ?? null) as typex;
            searchid = input.args[1] ?? null;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            type = input.obj.options.get('type') as unknown as typex;
            searchid = input.obj.options.get('id')
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
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
        commandName: 'COMMANDNAME',
        options: [],
        config: input.config,
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    if (!type) {
        msgfunc.errorAndAbort(input, 'get', false, errors.uErr.arg.ms.replace('[ID]', 'TYPE'), false);
        return;
    }
    if (!searchid) {
        msgfunc.errorAndAbort(input, 'get', false, errors.uErr.arg.ms.replace('[ID]', 'ID'), false);
        return;
    }
    if (!['server', 'user', 'channel'].includes(type)) {
        msgfunc.errorAndAbort(input, 'get', false, errors.uErr.arg.type.replace('[ID]', 'TYPE') + `.\nValid types are: \`server\`, \`user\`, \`channel\``, false);
        return;
    }
    if (isNaN(+searchid)) {
        msgfunc.errorAndAbort(input, 'get', false, errors.uErr.arg.type.replace('[ID]', 'ID'), false);
        return;
    }

    const embed = new Discord.EmbedBuilder();

    switch (type) {
        case 'user': {
            const user = input.client.users.cache.get(searchid);
            if (user) {
                embed.setAuthor({ name: 'USER ' + searchid })
                    .setTitle(
                        (user?.username && user?.username?.trim() != user?.displayName?.trim() ? `${user?.displayName} (${user?.username})` : user?.displayName)
                        + (user?.bot ? emojis.discord.bot : '')
                    )
                    .setDescription(`<@${searchid}>
Account created ${func.dateToDiscordFormat(user?.createdAt)}
Badges: ${func.userbitflagsToEmoji(user?.flags)}
`
                    )
                    .setThumbnail(user?.avatarURL()+'?size=512');
            } else {
                msgfunc.errorAndAbort(input, 'get', false, errors.uErr.arg.inaccess.replaceAll('[ID]', searchid).replaceAll('[TYPE]', type), false);
                return;
            }
        }
            break;
        case 'server': {
            const server = input.client.guilds.cache.get(searchid);
            if (server) {
                const owner = await server.fetchOwner();
                embed.setAuthor({ name: 'SERVER ' + searchid })
                    .setTitle(`${server.name}`)
                    .setDescription(`
Guild created ${func.dateToDiscordFormat(server.createdAt)}
Owner: ${owner.id} || ${owner.displayName}
Members: ${server.memberCount}
Channels: ${server.channels.cache.size}
Roles: ${server.roles.cache.size}
Emojis: ${server.emojis.cache.size}
Stickers: ${server.stickers.cache.size}
`)
                    .setThumbnail(server.iconURL()+'?size=512')
                    ;
            } else {
                msgfunc.errorAndAbort(input, 'get', false, errors.uErr.arg.inaccess.replaceAll('[ID]', searchid).replaceAll('[TYPE]', type), false);
                return;
            }
        } break;
        case 'channel': {
            const channel = input.client.channels.cache.get(searchid);
            if (channel) {
                embed.setAuthor({ name: 'CHANNEL ' + searchid })
                    .setTitle(`${(channel as Discord.GuildTextBasedChannel)?.name ?? 'No name'}`);
                let text = `<#${searchid}>
Channel created ${func.dateToDiscordFormat(channel.createdAt)}
Type: ${Discord.ChannelType[channel.type]}
`;
                if (Discord.ChannelType[channel.type].toLowerCase().includes('text')) {
                    const tempchan = channel as Discord.TextBasedChannel;
                    text += `Messages: ${tempchan.messages.cache.size} \n(Only messages sent while bot is online are cached)`;
                }
                if (Discord.ChannelType[channel.type].toLowerCase().includes('voice')) {
                    const tempchan = channel as Discord.VoiceBasedChannel;
                    text += `User limit: ${tempchan.userLimit == 0 ? '∞' : tempchan.userLimit}
Messages: ${tempchan.messages.cache.size} \n(Only messages sent while bot is online are cached)`;
                }
                embed.setDescription(text)
            } else {
                msgfunc.errorAndAbort(input, 'get', false, errors.uErr.arg.inaccess.replaceAll('[ID]', searchid).replaceAll('[TYPE]', type), false);
                return;
            }

        } break;
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
            commandName: 'COMMANDNAME',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'COMMANDNAME',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config,
        });
    }
}

export async function getUser(input: extypes.commandInput) {

    let commanduser;
    let id;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            id = input.args[0];
            if (input.obj.mentions.users.size > 0) {

                id = input.obj.mentions.users.first().id;
            }

            if (isNaN(id) && !(input.obj.mentions.users.size > 0)) {
                id = commanduser.id;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            id = input.obj.options.getUser('user')?.id ?? commanduser.id;
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
        commandName: 'get user',
        options: [
            {
                name: 'Id',
                value: id
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================



    const Embedr = new Discord.EmbedBuilder()
        .setTitle(`Error`)
        .setThumbnail(`https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
        .setDescription(`user does not exist or bot is not in the same guild as the user`);

    let userfind;
    input.client.guilds.cache.forEach(guild => {
        if (guild.members.cache.has(id)) {
            userfind = guild.members.cache.get(id);//.user.tag
            let up = 'null or offline status';
            if (userfind.presence) {
                up = '';
                for (let i = 0; i < userfind.presence.activities.length; i++) {
                    /*                                     up += `
                                                    ${userfind.presence.status}
                                                    ${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].name : ''}
                                                    ${userfind.presence.activities.length > 0 ? 'Activity Type: [' + userfind.presence.activities[i].type + '](https://discord.com/developers/docs/topics/gateway#activity-object-activity-types)': ''}
                                                    \`${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].state : ''}\`
                                                    ` */
                    let t;
                    switch (userfind.presence.activities[i].type) {
                        case 0:
                            t = 'Playing';
                            break;
                        case 1:
                            t = 'Streaming';
                            break;
                        case 2:
                            t = 'Listening';
                            break;
                        case 3:
                            t = 'Watching';
                            break;
                        case 4:
                            t = 'Custom Status';
                            break;
                        case 5:
                            t = 'Competing in';
                            break;
                        default:
                            t = 'Unknown Activity Type';
                            break;

                    }
                    up += `
                    ${t} ${userfind.presence.activities.length > 0 && t != 'Custom Status' ? `\`${userfind.presence.activities[i].name}\`` : ''}
                    \`${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].state : ''}\`
                    `;
                }
            }

            Embedr.setTitle(`${userfind.user.tag} ${userfind.user.bot ? emojis.discord.bot : ''}`)
                .setThumbnail(`${userfind.user.avatarURL()}?size=512`)
                .setDescription(
                    `ID: ${userfind.user.id}
                    Status: ${up}
                    Account creation date: ${userfind.user.createdAt}
                    Bot: ${userfind.user.bot}
                    Flags: ${userfind.user.flags.toArray().join(',')}
                    `);
            return;
        }
    });


    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embedr]
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'get user',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'get user',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

export async function getUserAv(input: extypes.commandInput) {

    let commanduser;
    let id;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            id = input.args[0];

            if (input.obj.mentions.users.size > 0) {

                id = input.obj.mentions.users.first().id;
            }

            if (isNaN(id) && !(input.obj.mentions.users.size > 0)) {
                id = commanduser.id;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            id = input.obj.options.getUser('user')?.id ?? commanduser.id;
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
        commandName: 'get user avatar',
        options: [
            {
                name: 'Id',
                value: id
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================



    const Embedr = new Discord.EmbedBuilder()
        .setTitle(`Error`)
        .setImage(`https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
        .setDescription(`user does not exist or bot is not in the same guild as the user`);
    let userfind;
    input.client.guilds.cache.forEach(guild => {
        if (guild.members.cache.has(id)) {
            userfind = guild.members.cache.get(id);//.user.tag
            Embedr.setTitle(`${userfind.user.tag} ${userfind.user.bot ? '<:bot:958289108147523584>' : ''}`)
                .setImage(`${userfind.user.avatarURL()}?size=512`)
                .setDescription('_');
            return;
        }
    });


    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embedr]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'get user avatar',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'get user avatar',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * return debug stuff ie command files, server list, etc.
 */
export async function debug(input: extypes.commandInput) {
    let commanduser: Discord.User;

    type debugtype = 'commandfile' | 'commandfiletype' | 'servers' | 'channels' | 'users' | 'forcetrack' | 'curcmdid' | 'logs' | 'clear' | 'maps';

    let type: debugtype;
    let inputstr;
    let failed = false;
    let errorstr = 'Error: null';
    if (inputstr == 1) {
        type = inputstr;
    }

    let usemsgArgs: any = {
        content: 'null'
    };

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            if (!input.args[0]) {
                failed = true;
                errorstr = 'Error: missing first argument (type)';
            }
            type = input.args?.[0] as debugtype;

            input.args.shift();
            inputstr = input.args?.join(' ');
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
        commandName: 'debug',
        options: [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Input String',
                value: inputstr
            },
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (failed == true) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errorstr
            }
        }, input.canReply);
        return;
    }

    type clearTypes = 'all' | 'normal' | 'permanent' |
        'previous' |
        'pmaps' | 'prevmap' |
        'pscores' | 'prevscore' |
        'pusers' | 'prevuser' |
        'users' | 'errors' | 'trueall' |
        'maps' | 'map' |
        'graph'
        ;

    switch (type) {
        //return api files for []
        case 'commandfile': {
            let cmdidcur = `${(+input.absoluteID) - 1}`;
            if (!inputstr || isNaN(+inputstr)) {
                cmdidcur = fs.readFileSync(`${path}/id.txt`, 'utf-8');
            } else {
                cmdidcur = inputstr;
            }
            const files = fs.readdirSync(`${path}/cache/commandData/`);
            if (files.length < 1) {
                usemsgArgs = {
                    content: 'Cache folder is currently empty'
                };
            } else {
                const searchfiles = files.filter(x => {
                    return (`${x}`.includes(`${cmdidcur}-`))
                        &&
                        `${x}`.indexOf(`${cmdidcur}-`) == 0;
                }
                );
                if (searchfiles.length < 1) {
                    usemsgArgs = {
                        content: `No files found with the id ${cmdidcur}`
                    };
                } else {
                    usemsgArgs = {
                        content: `Files found matching ${cmdidcur}: `,
                        files: searchfiles.map(x => `${path}/cache/commandData/` + x)
                    };
                }
            }
        }
            break;
        case 'commandfiletype': {
            usemsgArgs = { content: 'txt' };
            if (!inputstr) {
                usemsgArgs = {
                    content: `No search query given`
                };
            }
            const files = fs.readdirSync(`${path}/cache/debug/command`);
            if (files.length < 1) {
                usemsgArgs = {
                    content: 'Cache folder is currently empty'
                };
            } else {
                //convert to search term
                let resString;
                let cmdid = null;
                if (inputstr.includes(' ')) {
                    const temp = inputstr.split(' ');
                    inputstr = temp[0];
                    cmdid = temp[1];
                }
                switch (inputstr) {
                    case 'badgeweightsystem': case 'badgeweight': case 'badgeweightseed': case 'badgerank':
                        resString = 'bws';
                        break;
                    case 'firstplaceranks': case 'fpr': case 'fp': case '#1s': case 'first': case '#1': case '1s':
                        resString = 'firsts';
                        break;
                    case 'osc': case 'osustatscount':
                        resString = 'globals';
                        break;
                    case 'm':
                        resString = 'map';
                        break;
                    case 'maplb': case 'mapleaderboard': case 'leaderboard':
                        resString = 'maplb';
                        break;
                    case 'profile': case 'o': case 'user':
                    case 'taiko': case 'drums':
                    case 'fruits': case 'ctb': case 'catch':
                    case 'mania':
                        resString = 'osu';
                        break;
                    case 'top': case 't': case 'ot': case 'toposu': case 'topo':
                    case 'taikotop': case 'toptaiko': case 'tt': case 'topt':
                    case 'ctbtop': case 'fruitstop': case 'catchtop': case 'topctb': case 'topfruits': case 'topcatch': case 'tctb': case 'tf': case 'topf': case 'topc':
                    case 'maniatop': case 'topmania': case 'tm': case 'topm':
                    case 'sotarks': case 'sotarksosu':
                    case 'sotarkstaiko': case 'taikosotarks': case 'sotarkst': case 'tsotarks':
                    case 'sotarksfruits': case 'fruitssotarks': case 'fruitsotarks': case 'sotarksfruit': case 'sotarkscatch': case 'catchsotarks':
                    case 'sotarksctb': case 'ctbsotarks': case 'fsotarks': case 'sotarksf': case 'csotarks': case 'sotarksc':
                    case 'sotarksmania': case 'maniasottarks': case 'sotarksm': case 'msotarks':
                        resString = 'osutop';
                        break;
                    case 'rs': case 'r':
                    case 'rs best': case 'recent best':
                    case 'rsbest': case 'recentbest': case 'rb':
                    case 'recentlist': case 'rl':
                    case 'recentlisttaiko': case 'rlt':
                    case 'recentlistfruits': case 'rlf': case 'rlctb': case 'rlc':
                    case 'recentlistmania': case 'rlm':
                    case 'recenttaiko': case 'rt':
                    case 'recentfruits': case 'rf': case 'rctb':
                    case 'recentmania': case 'rm':
                        resString = 'recent';
                        break;
                    case 'recentactivity': case 'recentact': case 'rsact':
                        resString = 'recent_activity';
                        break;
                    case 'score': case 'sp':
                        resString = 'scoreparse';
                        break;
                    case 'c':
                        resString = 'scores';
                        break;
                    case 'ss':
                        resString = 'scorestats';
                        break;
                    case 'simulate': case 'sim':
                        resString = 'simulate';
                        break;
                    case 'ub': case 'userb': case 'ubm': case 'um': case 'usermaps':
                        resString = 'userbeatmaps';
                        break;
                    case 'wi':
                        resString = 'whatif';
                        break;
                    case 'mapfile': case 'mf':
                        resString = 'map (file)';
                        break;
                    default:
                        resString = inputstr;
                        break;
                }
                switch (resString) {
                    case 'badges':
                    case 'bws':
                    case 'firsts':
                    case 'globals':
                    case 'map':
                    case 'maplb':
                    case 'osu':
                    case 'osutop':
                    case 'pinned':
                    case 'recent':
                    case 'recent_activity':
                    case 'scoreparse':
                    case 'scores':
                    case 'scorestats':
                    case 'simplay':
                    case 'userbeatmaps':
                    case 'whatif':
                        {
                            await findAndReturn(`${path}/cache/debug/command`, resString, cmdid);
                        }
                        break;
                    case 'map (file)':
                    case 'replay':
                        {
                            await findAndReturn(`${path}/cache/debug/fileparse`, resString, cmdid);
                        }
                        break;
                    default:
                        usemsgArgs = {
                            content: `${inputstr && inputstr?.length > 0 ? `No files found for command "${inputstr}"\n` : ''}Valid options are: \`badges\`,\`bws\`,\`firsts\`,\`globals\`,\`map\`,\`maplb\`,\`osu\`,\`osutop\`,\`pinned\`,\`recent\`,\`recent_activity\`,\`scoreparse\`,\`scores\`,\`scorestats\`,\`simplay\`,\`userbeatmaps\`,\`whatif\`,`
                        };
                        break;
                }
            }
        }
            break;
        //list all servers
        case 'servers': {
            {
                const servers = ((input.client.guilds.cache.map((guild) => {
                    return `
----------------------------------------------------
Name:     ${guild.name}
ID:       ${guild.id}
Owner ID: ${guild.ownerId}
----------------------------------------------------
`;
                }
                )))
                    .join('\n');
                fs.writeFileSync(`${filespath}/servers.txt`, servers, 'utf-8');
            }
            usemsgArgs = {
                content: `${input.client.guilds.cache.size} servers connected to the client`,
                files: [`${filespath}/servers.txt`]
            };

        }
            break;
        //list all channels of server x
        case 'channels': {
            let serverId: string;
            if (!inputstr || isNaN(+inputstr)) {
                serverId = input.obj.guildId;
            } else {
                serverId = inputstr;
            }
            const curServer = input.client.guilds.cache.get(serverId);
            if (!curServer) {
                usemsgArgs = {
                    content: `Server ${serverId} not found - does not exist or bot is not in the guild`
                };
            } else {
                const channels = curServer.channels.cache.map(channel =>
                    `
----------------------------------------------------
Name:      ${channel.name}
ID:        ${channel.id}
Type:      ${channel.type}
Parent:    ${channel.parent}
Parent ID: ${channel.parentId}
Created:   ${channel.createdAt}
----------------------------------------------------
`
                ).join('\n');
                fs.writeFileSync(`${filespath}/channels${serverId}.txt`, channels, 'utf-8');

                usemsgArgs = {
                    content: `${curServer.channels.cache.size} channels in guild ${serverId}`,
                    files: [`${filespath}/channels${serverId}.txt`]
                };
            }

        }
            break;
        //list all users of server x
        case 'users': {
            let serverId: string;
            if (!inputstr || isNaN(+inputstr)) {
                serverId = input.obj.guildId;
            } else {
                serverId = inputstr;
            }
            const curServer = input.client.guilds.cache.get(serverId);
            if (!curServer) {
                usemsgArgs = {
                    content: `Server ${serverId} not found - does not exist or bot is not in the guild`
                };
            } else {
                const users = curServer.members.cache.map(member =>
                    `
----------------------------------------------------
Username:       ${member.user.username}
ID:             ${member.id}
Tag:            ${member.user.tag}
Discriminator:  ${member.user.discriminator}
Nickname:       ${member.displayName}
AvatarURL:      ${member.avatarURL()}
Created:        ${member.user.createdAt}
Created(EPOCH): ${member.user.createdTimestamp}
Joined:         ${member.joinedAt}
Joined(EPOCH):  ${member.joinedTimestamp}
----------------------------------------------------
`
                ).join('\n');
                fs.writeFileSync(`${filespath}/users${serverId}.txt`, users, 'utf-8');

                usemsgArgs = {
                    content: `${curServer.memberCount} users in guild ${serverId}`,
                    files: [`${filespath}/users${serverId}.txt`]
                };
            }
        }
            break;
        case 'maps': {
            let type;
            if (!inputstr) {
                type = 'id';
            } else {
                type = inputstr;
            }
            const directory = `${path}/cache/commandData`;
            const dirFiles = fs.readdirSync(directory);
            const acceptFiles: string[] = [];
            for (const file of dirFiles) {
                if (file.includes('mapdata')) {
                    const tempdata = (JSON.parse(fs.readFileSync(directory + '/' + file, 'utf-8'))) as osufunc.apiReturn;
                    const data = tempdata.apiData as osuapitypes.Beatmap;
                    if (type.includes('name')) {
                        acceptFiles.push(`[\`${(data.beatmapset.title)} [${data.version}]\`](https://osu.ppy.sh/b/${data.id}) (${data.status})`);
                    } else {
                        acceptFiles.push(`[${data.id}](https://osu.ppy.sh/b/${data.id}) (${data.status})`);
                    }
                }
            }
            const temppath = `${filespath}/maps.txt`;
            fs.writeFileSync(temppath, acceptFiles.join('\n'), 'utf-8');
            const embeds = [];
            let content = '';
            let files = [];
            if (acceptFiles.join('\n').length < 2000) {
                embeds.push(
                    new Discord.EmbedBuilder()
                        .setTitle(`${acceptFiles.length} maps stored in cache.`)
                        .setDescription(acceptFiles.join('\n'))
                );
            } else {
                content = `${acceptFiles.length} maps stored in cache.`;
                files = [`${temppath}`];
            }
            usemsgArgs = {
                content,
                embeds,
                files
            };
        }
            break;
        //force osutrack to update
        case 'forcetrack': {
            trackfunc.trackUsers(input.trackDb, input.client, input.guildSettings, 60 * 1000, input.config);
            usemsgArgs = {
                content: `Running osu!track...`
            };
        }
            break;
        //get id of current cmd
        case 'curcmdid': {
            usemsgArgs = {
                content: 'Last command\'s ID is ' + `${(+input.absoluteID) - 1}`
            };
        }
            break;
        //returns command logs for server
        case 'logs': {
            let serverId: string;
            if (!inputstr || isNaN(+inputstr)) {
                serverId = input.obj.guildId;
            } else {
                serverId = inputstr;
            }
            const curServer = fs.existsSync(`${path}/logs/cmd/commands${serverId}.log`);
            if (!curServer) {
                usemsgArgs = {
                    content: `Server ${serverId} not found - does not exist or bot is not in the guild`
                };
            } else {
                usemsgArgs = {
                    content: `Logs for ${serverId}`,
                    files: [`logs/cmd/commands${serverId}.log`]
                };
            }
        }
            break;
        case 'clear': {
            //all in command data, temporary files, permanent files, all in previous
            const ctype = input.args[0] as clearTypes;
            usemsgArgs = {
                content: `Clearing files...`
            };
            clear(ctype);
        }
            break;
        default: {
            const expectArgs = [
                'commandfile', 'commandfiletype', 'servers', 'channels', 'users', 'forcetrack', 'curcmdid', 'logs', 'clear', 'maps',];
            usemsgArgs = {
                content: `Valid types are: ${expectArgs.map(x => `\`${x}\``).join(', ')}`
            };
        }

    }

    async function findAndReturn(inpath: string, find: string, cmdid: string) {
        const sFiles = fs.readdirSync(`${inpath}`);
        const found = sFiles.find(x => x == find);
        const inFiles = fs.readdirSync(`${inpath}/${found}`);
        let content = `Files found for command \`${inputstr}\``;
        let files = inFiles.map(x => `${inpath}/${found}/${x}`);
        if (!isNaN(+cmdid)) {
            const tfiles = inFiles.map(x => `${inpath}/${found}/${x}`).filter(x => x.includes(cmdid));
            content = `Files found for command \`${inputstr}\`, matching server ID ${cmdid}`;
            if (tfiles.length == 0) {
                files = inFiles.map(x => `${inpath}/${found}/${x}`);
                content = `Files found for command \`${inputstr}\`. None found matching ${cmdid}`;
            }
        }

        usemsgArgs = {
            content,
            files,
        };
    }

    function clear(tincan: clearTypes) {
        switch (tincan) {
            case 'normal': default: { //clears all temprary files (cache/commandData)
                log.toOutput(`manually clearing temporary files in ${path}/cache/commandData/`, input.config);
                const curpath = `${path}/cache/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    const keep = ['Approved', 'Ranked', 'Loved', 'Qualified'];
                    if (!keep.some(x => file.includes(x))) {
                        fs.unlinkSync(`${curpath}/` + file);
                        log.toOutput(`${curpath}/` + file, input.config);
                    }
                }
                usemsgArgs = {
                    content: `Clearing temporary files in ./cache/commandData/`
                };
            }
                break;
            case 'all': { //clears all files in commandData
                log.toOutput(`manually clearing all files in ${path}/cache/commandData/`, input.config);
                const curpath = `${path}/cache/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    log.toOutput(`${curpath}/` + file, input.config);
                }
                usemsgArgs = {
                    content: `Clearing all files in ./cache/commandData/`
                };
            }
                break;
            case 'trueall': { //clears everything in cache
                clear('all');
                clear('previous');
                clear('errors');
                clear('map');
                usemsgArgs = {
                    content: `Clearing all files in ./cache/commandData/`
                };
            }
                break;
            case 'map': case 'maps': { // clears all maps and mapset files
                log.toOutput(`manually clearing all map and mapset files in ${path}/cache/commandData/ and ${path}/files/maps/`, input.config);
                const curpath1 = `${path}/cache/commandData`;
                const files1 = fs.readdirSync(curpath1);
                for (const file of files1) {
                    if (file.includes('bmsdata') || file.includes('mapdata')) {
                        fs.unlinkSync(`${curpath1}/` + file);
                        log.toOutput(`${curpath1}/` + file, input.config);
                    }
                }
                const curpath2 = `${path}/files/maps`;
                const files2 = fs.readdirSync(curpath2);
                for (const file of files2) {
                    fs.unlinkSync(`${curpath2}/` + file);
                    log.toOutput(`${curpath2}/` + file, input.config);
                }
                usemsgArgs = {
                    content: `Clearing all map-related files in ./cache/commandData/ and ./files/maps/`
                };
            }
                break;
            case 'users': { //clears all osudata files
                log.toOutput(`manually clearing all osudata files in ${path}/cache/commandData/`, input.config);
                const curpath = `${path}/cache/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('osudata')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        log.toOutput(`${curpath}/` + file, input.config);
                    }
                }
                usemsgArgs = {
                    content: `Clearing all osudata files in ./cache/commandData/`
                };
            }
                break;
            case 'previous': { // clears all previous files
                log.toOutput(`manually clearing all prev files in ${path}/cache/previous/`, input.config);
                const curpath = `${path}/cache/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    log.toOutput(`${curpath}/` + file, input.config);
                }
                usemsgArgs = {
                    content: `Clearing all previous files in ./cache/previous/`
                };
            }
                break;
            case 'pmaps': { // clears all previous map files
                log.toOutput(`manually clearing all prevmap files in ${path}/cache/previous/`, input.config);
                const curpath = `${path}/cache/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('map')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        log.toOutput(`${curpath}/` + file, input.config);
                    }
                }
                usemsgArgs = {
                    content: `Clearing all previous map files in ./cache/previous/`
                };
            }
                break;
            case 'pscores': { // clears all previous score files
                log.toOutput(`manually clearing all prev score files in ${path}/cache/previous/`, input.config);
                const curpath = `${path}/cache/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('score')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        log.toOutput(`${curpath}/` + file, input.config);
                    }
                }
                usemsgArgs = {
                    content: `Clearing all previous score files in ./cache/previous/`
                };
            }
            case 'pusers': { // clears all previous user files
                log.toOutput(`manually clearing all prev user files in ${path}/cache/previous/`, input.config);
                const curpath = `${path}/cache/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('user')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        log.toOutput(`${curpath}/` + file, input.config);
                    }
                }
                usemsgArgs = {
                    content: `Clearing all previous user files in ./cache/previous/`
                };
            }
                break;
            case 'errors': { //clears all errors
                log.toOutput(`manually clearing all err files in ${path}/cache/errors/`, input.config);
                const curpath = `${path}/cache/errors`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    log.toOutput(`${curpath}/` + file, input.config);
                }
                usemsgArgs = {
                    content: `Clearing error files in ./cache/errors/`
                };
            }
                break;
            case 'graph': {
                log.toOutput(`manually clearing all graph files in ${path}/cache/graphs/`, input.config);
                const curpath = `${path}/cache/graphs`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    log.toOutput(`${curpath}/` + file, input.config);
                }
                usemsgArgs = {
                    content: `Clearing graph files in ./cache/graphs/`
                };
            }
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: usemsgArgs
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'debug',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'debug',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}

/**
 * find user/role/channel/guild/emoji from id 
 */
export async function find(input: extypes.commandInput) {

    let commanduser;
    let type;
    let id;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;

            type = input.args[0];
            id = input.args[1];
            if (input.obj.mentions.users.size > 0) {
                type = 'user';
                id = input.obj.mentions.users.first().id;
            }
            if (input.obj.mentions.channels.size > 0) {
                type = 'channel';
                id = input.obj.mentions.channels.first().id;
            }
            if (input.obj.mentions.roles.size > 0) {
                type = 'role';
                id = input.obj.mentions.roles.first().id;
            }
            if (input.obj.content.includes('<:') && !isNaN(+input.obj.content.split('<:')[1].split('>')[0].split(':')[1])) {
                type = 'emoji';
                id = input.obj.content.split('<:')[1].split('>')[0].split(':')[1];
            }
            if (isNaN(id) && (!(input.obj.mentions.users.size > 0 && type == 'user') || !(input.obj.mentions.channels.size > 0 && type == 'channel') || !(input.obj.mentions.roles.size == 1 && type == 'roles'))) {

                await msgfunc.sendMessage({
                    commandType: input.commandType,
                    obj: input.obj,
                    args: {
                        content: `Please specify an ID to find`,
                        edit: true
                    }
                }, input.canReply)
                    .catch(error => { });
                return;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            type = input.obj.options.getString('type');
            id = input.obj.options.getString('id');
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
        commandName: 'find',
        options: [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Id',
                value: id
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================



    const Embedr = new Discord.EmbedBuilder()
        .setTitle(`Error`)
        .setThumbnail(`https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
        .setDescription(`${type} does not exist or bot is not in the same guild as the ${type}`);

    switch (type) {
        case 'user':
            {
                let userfind;
                input.client.guilds.cache.forEach(guild => {
                    if (guild.members.cache.has(id)) {
                        userfind = guild.members.cache.get(id);//.user.tag
                        let up = 'null or offline status';
                        if (userfind.presence) {
                            up = '';
                            for (let i = 0; i < userfind.presence.activities.length; i++) {
                                /*                                     up += `
                                                                ${userfind.presence.status}
                                                                ${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].name : ''}
                                                                ${userfind.presence.activities.length > 0 ? 'Activity Type: [' + userfind.presence.activities[i].type + '](https://discord.com/developers/docs/topics/gateway#activity-object-activity-types)': ''}
                                                                \`${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].state : ''}\`
                                                                ` */
                                let t;
                                switch (userfind.presence.activities[i].type) {
                                    case 0:
                                        t = 'Playing';
                                        break;
                                    case 1:
                                        t = 'Streaming';
                                        break;
                                    case 2:
                                        t = 'Listening';
                                        break;
                                    case 3:
                                        t = 'Watching';
                                        break;
                                    case 4:
                                        t = 'Custom Status';
                                        break;
                                    case 5:
                                        t = 'Competing in';
                                        break;
                                    default:
                                        t = 'Unknown Activity Type';
                                        break;

                                }
                                up += `
                    ${t} ${userfind.presence.activities.length > 0 && t != 'Custom Status' ? `\`${userfind.presence.activities[i].name}\`` : ''}
                    \`${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].state : ''}\`
                    `;
                            }
                        }

                        Embedr.setTitle(`${userfind.user.tag} ${userfind.user.bot ? '<:bot:958289108147523584>' : ''}`);
                        Embedr.setThumbnail(`${userfind.user.avatarURL()}`);
                        Embedr.setDescription(
                            `ID: ${userfind.user.id}
Status: ${up}
Account creation date: ${userfind.user.createdAt}
Bot: ${userfind.user.bot}
Flags: ${userfind.user.flags.toArray().join(',')}
`);
                        return;
                    }
                });
            }
            break;
        case 'guild':
            {
                if (!(cmdchecks.isOwner(commanduser.id, input.config) || (id == input.obj.guildId && cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client)))) {
                    Embedr.setDescription('You don\'t have permissions to use this command');
                } else {
                    let guildfind;
                    input.client.guilds.cache.forEach(guild => {
                        if (guild.id == id) {
                            guildfind = guild;
                            Embedr.setTitle(`${guildfind.name}`);
                            if (guildfind.iconURL()) {
                                Embedr.setThumbnail(`${guildfind.iconURL()}`);
                            }
                            if (guildfind.bannerURL()) {
                                Embedr.setImage(`${guildfind.bannerURL()}`);
                            }
                            Embedr.setDescription(`
ID: ${guildfind.id}
Owner: <@${guildfind.ownerId}>
Total user count: ${guildfind.members.cache.size}
Total channel count: ${guildfind.channels.cache.size}
Creation date: ${guildfind.createdAt}
`);
                            return;
                        }
                    });
                }
            }
            break;
        case 'channel':
            {
                if (!(cmdchecks.isOwner(commanduser.id, input.config) || cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client))) {
                    Embedr.setDescription('You don\'t have permissions to use this command');
                } else {
                    let channelfind;
                    input.client.guilds.cache.forEach(guild => {
                        if (guild.channels.cache.has(id)) {
                            channelfind = guild.channels.cache.get(id);
                            Embedr.setTitle(`Channel: #${channelfind.name}`);
                            if (guild.iconURL()) {
                                Embedr.setThumbnail(`${guild.iconURL()}`);
                            }
                            Embedr.setDescription(`
ID: ${channelfind.id}
Topic: ${channelfind.topic}
[Type: ${channelfind.type}](https://discord-api-types.dev/api/discord-api-types-v10/enum/ChannelType)
Parent: ${channelfind.parent ? channelfind.parent.name : 'No parent'} ${channelfind.parent ? '| ' + channelfind.parent.id + ' | Type ' + channelfind.parent.type : ''}
Guild: ${guild.name} | ${guild.id}
`);
                            return;
                        }
                    });
                }
            }
            break;
        case 'role':
            {
                if (!(cmdchecks.isOwner(commanduser.id, input.config) || cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client))) {
                    Embedr.setDescription('You don\'t have permissions to use this command');
                } else {
                    let rolefind;
                    input.client.guilds.cache.forEach(guild => {
                        if (guild.roles.cache.has(id)) {
                            rolefind = guild.roles.cache.get(id);
                            Embedr.setTitle(`Role: ${rolefind.name}`);
                            if (guild.iconURL()) {
                                Embedr.setThumbnail(`${guild.iconURL()}`);
                            }
                            Embedr.setDescription(`
ID: ${rolefind.id}
Colour: [${rolefind.color ? rolefind.color : 'null'}](https://discord.js.org/#/docs/discord.js/main/class/Role?scrollTo=color)
Emoji: ${rolefind.unicodeEmoji ? rolefind.unicodeEmoji : 'null'}
Guild: ${guild.name} | ${guild.id}
`);
                            Embedr.setColor(rolefind.color);
                            return;
                        }
                    });
                }
            }
            break;
        case 'emoji': {
            let emojifind;
            input.client.guilds.cache.forEach(guild => {
                if (guild.emojis.cache.has(id)) {
                    emojifind = guild.emojis.cache.get(id);
                    Embedr.setTitle(`Emoji: ${emojifind.name}`);
                    if (emojifind.url) {
                        Embedr.setThumbnail(`${emojifind.url}`);
                    }
                    Embedr.setDescription(`
ID: ${emojifind.id}
Emoji: \`<:${guild.emojis.cache.get(id).name}:${id}>\`
Guild: ${guild.name} | ${guild.id}
`);
                    return;
                }
            });
        }
            break;
        default:
            Embedr.setTitle('Invalid search parameters');
            Embedr.setDescription(`
Valid Types: user, guild, channel, role, emoji
`);
            break;
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embedr]
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'find',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'find',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * leave guild/server matching id given (or cur guild)
 */
export async function leaveguild(input: extypes.commandInput) {

    let commanduser;
    let guildId;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            guildId = input.obj.guildId;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            guildId = input.obj.options.getString('guild') ?? input.obj.guildId;
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
        commandName: 'leave guild',
        options: [
            {
                name: 'Guild Id',
                value: guildId
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    if (cmdchecks.isOwner(commanduser.id, input.config)) {
        const guild = input.client.guilds.cache.get(guildId);
        if (guild) {
            guild.leave();
        }
        return;
    }
    if (cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client)) {
        const guild = input.client.guilds.cache.get(input.obj.guildId);
        if (guild) {
            guild.leave();
        }
        return;
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: 'You don\'t have permissions to use this command'
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'leave guild',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'leave guild',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * set bot prefix for current guild
 */
export async function prefix(input: extypes.commandInput) {

    let commanduser;
    let newPrefix;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            newPrefix = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            newPrefix = input.obj.options.getString('prefix');
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
        commandName: 'prefix',
        options: [
            {
                name: 'Prefix',
                value: newPrefix
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const curGuildSettings = await input.guildSettings.findOne({ where: { guildid: input.obj.guildId } });
    let replymsg;
    if (curGuildSettings == null) {
        replymsg = 'Error: Guild settings not found';
    } else {
        if (typeof newPrefix != 'string' || newPrefix.length < 1 || !(cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client) || cmdchecks.isOwner(commanduser.id, input.config))) {
            replymsg = `The current prefix is \`${curGuildSettings.prefix}\``;
        } else {
            curGuildSettings.update({
                prefix: newPrefix
            }, {
                where: { guildid: input.obj.guildId }
            });
            replymsg = `Prefix set to \`${newPrefix}\``;
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: replymsg
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'prefix',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'prefix',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * delete mass amounts of messages at once
 */
export async function purge(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let purgeCount: number = 5;
    const filter: {
        byUser: boolean,
        userid: string;
    } = {
        byUser: false,
        userid: null,
    };
    let method: 'bulk' | 'fetch' = 'bulk';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;

            if (input.args.includes('-fetch')) {
                method = 'fetch';
                input.args.splice(input.args.indexOf('-fetch'), 1);
            }
            if (input.args.includes('-bulk')) {
                method = 'bulk';
                input.args.splice(input.args.indexOf('-bulk'), 1);
            }

            filter.userid = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first().id : null;
            purgeCount = input.args[0] ? +input.args[0] : 5;
            if (!isNaN(+input.args[1])) {
                filter.userid = input.args[1];
            }
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
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
        commandName: 'purge',
        options: [
            {
                name: 'Count',
                value: purgeCount
            },
            {
                name: 'User',
                value: filter.userid
            },
            {
                name: 'Method',
                value: method
            }
        ],
        config: input.config,
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    let user: Discord.GuildMember;
    if (filter.userid) {
        filter.byUser = true;
        user = input.obj.guild.members.cache.get(filter.userid);
        if (!user) {
            await msgfunc.sendMessage({
                commandType: input.commandType,
                obj: input.obj,
                args: {
                    content: errors.uErr.admin.purge.unf
                        .replace('[ID]', filter.userid),
                    edit: true
                }
            }, input.canReply);
            return;
        }
    }

    if (purgeCount > 100) {
        purgeCount = 100;
    } else if (purgeCount < 2) {
        purgeCount = 5;
    }

    const channel = input.client.channels.cache.get(input.obj.channelId) as Discord.TextChannel;
    let amt = 0;
    let content = `Purged ${amt} message(s)${filter.byUser ? ` from user ${user?.displayName}(${user?.id})` : ''}.`;

    if (filter.byUser == true) {
        const messages = channel.messages.cache;
        let i = 0;
        messages.forEach(message => {
            if (message.author.id.trim() == filter.userid.trim() && message.deletable && i < purgeCount) {
                message.delete();
                i++;
            }
        });
        content = `Purged ${i} message(s)${filter.byUser ? ` from user ${user?.displayName}(${user?.id})` : ''}.`;
    } else {
        if (method == 'bulk') {
            await channel.bulkDelete(purgeCount).then(x => {
                amt = x.size;
                content = `Purged ${amt} message(s)${filter.byUser ? ` from user ${user?.displayName}(${user?.id})` : ''}.`;
            }).catch(x => {
                content = errors.uErr.admin.purge.fail
                    .replace('[COUNT]', `${purgeCount}`) + `\n${errors.uErr.admin.purge.failTime}`
                    ;
                log.logCommand({
                    event: 'Error',
                    commandName: 'purge',
                    commandType: input.commandType,
                    commandId: input.absoluteID,
                    object: input.obj,
                    customString: errors.uErr.admin.purge.fail
                        .replace('[COUNT]', `${purgeCount}`) + `\n${errors.uErr.admin.purge.failTime}`,
                    config: input.config
                });
            });
        } else if (method == 'fetch') {
            const messages = channel.messages.cache;
            let i = 0;
            messages.forEach(message => {
                if (message.deletable && i < purgeCount) {
                    message.delete();
                    i++;
                }
            });
            content = `Purged ${i} message(s)${filter.byUser ? ` from user ${user?.displayName}(${user?.id})` : ''}.`;
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'purge',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'purge',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config,
        });
    }
}

/**
 * list of guilds bot is in
 */
export async function servers(input: extypes.commandInput) {

    let commanduser;

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

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'servers',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const servers = (input.client.guilds.cache.map(guild => ` **${guild.name}** => \`${guild.id}\` | <@${guild.ownerId}> \`||\``)).join('');
    const embed = new Discord.EmbedBuilder()
        .setTitle(`This client is in ${input.client.guilds.cache.size} guilds`)
        .setDescription(`${servers}`);


    let rw: {
        content?: string,
        embeds?: Discord.EmbedBuilder[],
        files?: string[];
    } = {
        embeds: [embed],
    };
    if (servers.length > 2000) {
        fs.writeFileSync(`${path}/debug/guilds.txt`, servers, 'utf-8');
        rw = {
            files: [`${path}/debug/guilds.txt`],
        };
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: rw
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'servers',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'servers',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}