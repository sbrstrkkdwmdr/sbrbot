import cmdchecks = require('../src/checks');
import fs = require('fs');
import calc = require('../src/calc');
import emojis = require('../src/consts/emojis');
import colours = require('../src/consts/colours');
import colourfunc = require('../src/colourcalc');
import osufunc = require('../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../src/log');
import func = require('../src/other');
import def = require('../src/consts/defaults');
import buttonsthing = require('../src/consts/buttons');
import extypes = require('../src/types/extraTypes');
import helpinfo = require('../src/consts/helpinfo');
import msgfunc = require('./msgfunc');

export function name(input: extypes.commandInput) {

}

export function checkperms(input: extypes.commandInput) {

    let commanduser;
    let searchUser;
    switch (input.commandType) {
        case 'message': {
            //@ts-ignore
            commanduser = input.obj.author;
            if (input.args[0]) {//@ts-ignore
                if (input.obj.mentions.users.size > 0) {//@ts-ignore
                    searchUser = input.obj.mentions.users.first();
                } else {
                    searchUser = input.client.users.cache.get(input.args.join(' '))
                }
            } else {
                searchUser = commanduser;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            if (input.obj.options.getUser('user')) {//@ts-ignore
                searchUser = input.obj.options.getUser('user');
            } else {
                searchUser = commanduser;
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('checkperms', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'User',
                value: searchUser.id ?? commanduser.id
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )


    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (searchUser == null || typeof searchUser == 'undefined') {
        searchUser = commanduser;
    }
    if (!(cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client) || cmdchecks.isOwner(commanduser.id))) {
        searchUser = commanduser;
    }


    const embed = new Discord.EmbedBuilder()
    try {
        const userAsMember = input.obj.guild.members.cache.get(searchUser.id);
        //get perms
        const perms = userAsMember.permissions.toArray().join(' **|** ');

        embed
            .setTitle(`${searchUser.username}'s Permissions`)
            .setDescription(`**${perms}**`)
            .setColor(colours.embedColour.admin.dec)

    } catch (err) {
        embed.setTitle('Error')
            .setDescription('An error occured while trying to get the permissions of the user.')
            .setColor(colours.embedColour.admin.dec)

    }




    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

export function crash(input: extypes.commandInput) {

    let commanduser;
    let baseCommandType;

    switch (input.commandType) {
        case 'message': {//@ts-ignore
            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================
    log.logFile(
        'command',
        log.commandLog('crash', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, []),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    console.log('executed crash command')
    process.exit(1)
}

export function find(input: extypes.commandInput) {

    let commanduser;
    let type;
    let id;

    switch (input.commandType) {
        case 'message': {//@ts-ignore
            commanduser = input.obj.author;
            type = input.args[0];
            id = input.args[1];//@ts-ignore
            if (input.obj.mentions.users.size > 0) {
                type = 'user';//@ts-ignore
                id = input.obj.mentions.users.first().id;
            }//@ts-ignore
            if (input.obj.mentions.channels.size > 0) {
                type = 'channel';//@ts-ignore
                id = input.obj.mentions.channels.first().id
            }//@ts-ignore
            if (input.obj.mentions.roles.size > 0) {
                type = 'role';//@ts-ignore
                id = input.obj.mentions.roles.first().id
            }//@ts-ignore
            if (input.obj.content.includes('<:') && !isNaN(input.obj.content.split('<:')[1].split('>')[0].split(':')[1])) {
                type = 'emoji';//@ts-ignore
                id = input.obj.content.split('<:')[1].split('>')[0].split(':')[1]
            }//@ts-ignore
            if (isNaN(id) && (!(input.obj.mentions.users.size > 0 && type == 'user') || !(input.obj.mentions.channels.size > 0 && type == 'channel') || !(input.obj.mentions.roles.size == 1 && type == 'roles'))) {
                //@ts-ignore 
                input.obj.reply({ content: 'Please specify an id to find', allowedMentions: { repliedUser: false } })
                    .catch(error => { });
                return;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            type = input.obj.options.getString('type');//@ts-ignore
            id = input.obj.options.getString('id');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('find', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Id',
                value: id
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )


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
                        userfind = guild.members.cache.get(id)//.user.tag
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
                                let t
                                switch (userfind.presence.activities[i].type) {
                                    case 0:
                                        t = 'Playing'
                                        break;
                                    case 1:
                                        t = 'Streaming'
                                        break;
                                    case 2:
                                        t = 'Listening'
                                        break;
                                    case 3:
                                        t = 'Watching'
                                        break;
                                    case 4:
                                        t = 'Custom Status'
                                        break;
                                    case 5:
                                        t = 'Competing in'
                                        break;
                                    default:
                                        t = 'Unknown Activity Type'
                                        break;

                                }
                                up += `
                    ${t} ${userfind.presence.activities.length > 0 && t != 'Custom Status' ? `\`${userfind.presence.activities[i].name}\`` : ''}
                    \`${userfind.presence.activities.length > 0 ? userfind.presence.activities[i].state : ''}\`
                    `
                            }
                        }

                        Embedr.setTitle(`${userfind.user.tag} ${userfind.user.bot ? '<:bot:958289108147523584>' : ''}`)
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
                })
            }
            break;
        case 'guild':
            {
                if (!(cmdchecks.isOwner(commanduser.id) || (id == input.obj.guildId && cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client)))) {
                    Embedr.setDescription('You don\'t have permissions to use this command')
                } else {
                    let guildfind;
                    input.client.guilds.cache.forEach(guild => {
                        if (guild.id == id) {
                            guildfind = guild
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
                `)
                            return;
                        }
                    })
                }
            }
            break;
        case 'channel':
            {
                if (!(cmdchecks.isOwner(commanduser.id) || cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client))) {
                    Embedr.setDescription('You don\'t have permissions to use this command')
                } else {
                    let channelfind;
                    input.client.guilds.cache.forEach(guild => {
                        if (guild.channels.cache.has(id)) {
                            channelfind = guild.channels.cache.get(id)
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
                `)
                            return;
                        }
                    })
                }
            }
            break;
        case 'role':
            {
                if (!(cmdchecks.isOwner(commanduser.id) || cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client))) {
                    Embedr.setDescription('You don\'t have permissions to use this command')
                } else {
                    let rolefind;
                    input.client.guilds.cache.forEach(guild => {
                        if (guild.roles.cache.has(id)) {
                            rolefind = guild.roles.cache.get(id)
                            Embedr.setTitle(`Role: ${rolefind.name}`);
                            if (guild.iconURL()) {
                                Embedr.setThumbnail(`${guild.iconURL()}`);
                            }
                            Embedr.setDescription(`
                ID: ${rolefind.id}
                Colour: [${rolefind.color ? rolefind.color : 'null'}](https://discord.js.org/#/docs/discord.js/main/class/Role?scrollTo=color)
                Emoji: ${rolefind.unicodeEmoji ? rolefind.unicodeEmoji : 'null'}
                Guild: ${guild.name} | ${guild.id}
                `)
                            Embedr.setColor(rolefind.color);
                            return;
                        }
                    })
                }
            }
            break;
        case 'emoji': {
            let emojifind;
            input.client.guilds.cache.forEach(guild => {
                if (guild.emojis.cache.has(id)) {
                    emojifind = guild.emojis.cache.get(id)
                    Embedr.setTitle(`Emoji: ${emojifind.name}`);
                    if (emojifind.url) {
                        Embedr.setThumbnail(`${emojifind.url}`);
                    }
                    Embedr.setDescription(`
                ID: ${emojifind.id}
                Emoji: \`<:${guild.emojis.cache.get(id).name}:${id}>\`
                Guild: ${guild.name} | ${guild.id}
                `)
                    return;
                }
            })
        }
            break;
        default:
            Embedr.setTitle('Invalid search parameters')
            Embedr.setDescription(`
        Valid Types: user, guild, channel, role, emoji
        `)
            break;
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embedr]
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

export function leaveguild(input: extypes.commandInput) {

    let commanduser;
    let guildId;

    switch (input.commandType) {
        case 'message': {//@ts-ignore
            commanduser = input.obj.author;
            guildId = input.obj.guildId;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            guildId = input.obj.options.getString('guild') ?? input.obj.guildId;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('leaveguild', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    log.logFile('command',
        log.optsLog(input.absoluteID, [
            {
                name: 'Guild Id',
                value: guildId
            }
        ]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

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

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: 'You don\'t have permissions to use this command'
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

export async function prefix(input: extypes.commandInput) {

    let commanduser;
    let newPrefix;

    switch (input.commandType) {
        case 'message': {//@ts-ignore
            commanduser = input.obj.author;
            newPrefix = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;//@ts-ignore
            newPrefix = input.obj.options.getString('prefix');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logFile(
        'command',
        log.commandLog('prefix', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================
    log.logFile('command',
        log.optsLog(input.absoluteID, [{
            name: 'Prefix',
            value: newPrefix
        }]),
        {
            guildId: `${input.obj.guildId}`
        }
    )

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const curGuildSettings = await input.guildSettings.findOne({ where: { guildid: input.obj.guildId } });
    let replymsg;
    if (curGuildSettings == null) {
        replymsg = 'Error: Guild settings not found';
    } else {
        if (typeof newPrefix != 'string' || newPrefix.length < 1 || !(cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client) || cmdchecks.isOwner(commanduser.id))) {
            replymsg = `The current prefix is \`${curGuildSettings.prefix}\``
        } else {
            curGuildSettings.update({
                prefix: newPrefix
            }, {
                where: { guildid: input.obj.guildId }
            })
            replymsg = `Prefix set to \`${newPrefix}\``;
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: replymsg
        }
    })

    log.logFile('command',
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`,
        { guildId: `${input.obj.guildId}` }
    )

}

export function servers(input: extypes.commandInput) {

    let commanduser;

    switch (input.commandType) {
        case 'message': {//@ts-ignore
            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`BigLeftArrow-servers-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('⬅')
            /* .setLabel('Start') */,
            new Discord.ButtonBuilder()
                .setCustomId(`LeftArrow-servers-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('◀'),
            new Discord.ButtonBuilder()
                .setCustomId(`RightArrow-servers-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('▶')
            /* .setLabel('Next') */,
            new Discord.ButtonBuilder()
                .setCustomId(`BigRightArrow-servers-${commanduser.id}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('➡')
            /* .setLabel('End') */,
        );

    log.logFile(
        'command',
        log.commandLog('servers', input.commandType, input.absoluteID, commanduser
        ),
        {
            guildId: `${input.obj.guildId}`
        })

    //OPTIONS==============================================================================================================================================================================================

    fs.appendFileSync(`logs/cmd/commands${input.obj.guildId}.log`,
        log.optsLog(
            input.absoluteID,
            []
        ), 'utf-8')

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const servers = (input.client.guilds.cache.map(guild => ` **${guild.name}** => \`${guild.id}\` | <@${guild.ownerId}> \`||\``)).join('')
    const embed = new Discord.EmbedBuilder()
        .setTitle('Guilds')
        .setDescription(`${servers}`)


    let rw: {
        content?: string,
        embeds?: Discord.EmbedBuilder[],
        files?: string[]
    } = {
        embeds: [embed],
    }
    if (servers.length > 2000) {
        fs.writeFileSync('debug/guilds.txt', servers, 'utf-8')
        rw = {
            files: ['./debug/guilds.txt'],
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: rw
    })

    fs.appendFileSync(`logs/cmd/commands${input.obj.guildId}.log`,
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')

}