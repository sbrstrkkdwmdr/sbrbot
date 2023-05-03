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
import * as helpinfo from '../src/consts/helpinfo.js';
import * as mainconst from '../src/consts/main.js';
import * as embedStuff from '../src/embed.js';
import * as log from '../src/log.js';
import * as osufunc from '../src/osufunc.js';
import * as func from '../src/tools.js';
import * as trackfunc from '../src/trackfunc.js';
import * as extypes from '../src/types/extraTypes.js';
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
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (searchUser == null || typeof searchUser == 'undefined') {
        searchUser = commanduser;
    }
    if (!(cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client) || cmdchecks.isOwner(commanduser.id))) {
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'checkperms',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        options: []
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    console.log('executed crash command');
    process.exit(1);
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
        ]
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

            Embedr.setTitle(`${userfind.user.tag} ${userfind.user.bot ? '<:bot:958289108147523584>' : ''}`)
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'get user',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        ]
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'get user avatar',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
        });
    }

}

/**
 * return debug stuff ie command files, server list, etc.
 */
export async function debug(input: extypes.commandInput) {
    let commanduser: Discord.User;

    type debugtype = 'commandfile' | 'servers' | 'channels' | 'users' | 'forcetrack' | 'curcmdid' | 'logs' | 'clear';

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
        ]
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
                console.log(servers);
                fs.writeFileSync(`${filespath}/servers.txt`, servers, 'utf-8');
            }
            usemsgArgs = {
                content: 'All servers connected to the client',
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
                    content: `Channels in guild ${serverId}`,
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
                    content: `Users in guild ${serverId}`,
                    files: [`${filespath}/users${serverId}.txt`]
                };
            }
        }
            break;
        //force osutrack to update
        case 'forcetrack': {
            trackfunc.trackUsers(input.trackDb, input.client, input.guildSettings, 60 * 1000);
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
            type clearTypes = 'all' | 'normal' | 'permanent' | 'previous' | 'pmaps' | 'pscores' | 'pusers' | 'users' | 'errors' | 'trueall';
            //all in command data, temporary files, permanent files, all in previous
            const ctype = input.args[1] as clearTypes;

            function clear(input: clearTypes) {
                switch (ctype) {
                    case 'normal': default: { //clears all temprary files (cache/commandData)
                        log.toOutput(`manually clearing temporary files in ${path}\\cache\\commandData\\`);
                        const curpath = `${path}\\cache\\commandData`;
                        const files = fs.readdirSync(curpath);

                    }
                        break;
                    case 'all': { //clears all files in commandData
                        log.toOutput(`manually clearing all files in ${path}\\cache\\commandData\\`);
                        const curpath = `${path}\\cache\\commandData`;
                        const files = fs.readdirSync(curpath);
                        for (const file of files) {
                            fs.unlinkSync(`${path}\\cache\\commandData\\` + file);
                            log.toOutput(`${path}\\cache\\commandData\\` + file);
                        }
                    }
                    case 'trueall': { //clears everything in cache
                        clear('all');
                        clear('previous');
                        clear('errors');
                    }
                    case 'permanent': { // clears all permanent files (maps and mapsets)

                    }
                    case 'users': { //clears all osudata files

                    }
                    case 'previous': { // clears all previous files

                    }
                    case 'pmaps': { //clears previous maps

                    }
                    case 'pscores': { //clears previous scores

                    }
                    case 'errors': { //clears all errors
                        log.toOutput(`manually clearing all err files in ${path}\\cache\\err\\`);
                        const curpath = `${path}\\cache\\errors`;
                        const files = fs.readdirSync(curpath);
                        for (const file of files) {
                            fs.unlinkSync(`${path}\\cache\\errors\\` + file);
                            log.toOutput(`${path}\\cache\\errors\\` + file);
                        }
                    }
                }
            }
            clear(ctype);
        }
            break;
        default: {
            usemsgArgs = {
                content: 'Valid types are: `commandfile`,`servers`,`channels`,`users`,`forcetrack`,`curcmdid`,`logs`, `clear`'
            };
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'debug',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        ]
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
                if (!(cmdchecks.isOwner(commanduser.id) || (id == input.obj.guildId && cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client)))) {
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
                if (!(cmdchecks.isOwner(commanduser.id) || cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client))) {
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
                if (!(cmdchecks.isOwner(commanduser.id) || cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client))) {
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'find',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    if (cmdchecks.isOwner(commanduser.id)) {
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'leave guild',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const curGuildSettings = await input.guildSettings.findOne({ where: { guildid: input.obj.guildId } });
    let replymsg;
    if (curGuildSettings == null) {
        replymsg = 'Error: Guild settings not found';
    } else {
        if (typeof newPrefix != 'string' || newPrefix.length < 1 || !(cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client) || cmdchecks.isOwner(commanduser.id))) {
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'prefix',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        options: []
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const servers = (input.client.guilds.cache.map(guild => ` **${guild.name}** => \`${guild.id}\` | <@${guild.ownerId}> \`||\``)).join('');
    const embed = new Discord.EmbedBuilder()
        .setTitle('Guilds')
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'servers',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
        });
    }

}