import Discord from 'discord.js';
import * as fs from 'fs';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';


/**
 * return permissions of user
 */
export const checkperms = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let searchUser: Discord.User | Discord.APIUser;
    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;

            if (input.args[0]) {
                if (input.message.mentions.users.size > 0) {
                    searchUser = input.message.mentions.users.first();
                } else {
                    searchUser = helper.vars.client.users.cache.get(input.args.join(' '));
                }
            } else {
                searchUser = commanduser;
            }
        }
            break;
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'user',
                value: searchUser.id
            }
        ],
        input.id,
        'checkperms',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    if (searchUser == null || typeof searchUser == 'undefined') {
        searchUser = commanduser;
    }

    if (!(helper.tools.checks.isAdmin(commanduser.id, input.message.guildId) || helper.tools.checks.isOwner(commanduser.id))) {
        searchUser = commanduser;
    }


    const embed = new Discord.EmbedBuilder();
    try {
        const userAsMember = input.message.guild.members.cache.get(searchUser.id);
        //get perms
        const perms = userAsMember.permissions.toArray().join(' **|** ');

        embed
            .setTitle(`${searchUser.username}'s Permissions`)
            .setDescription(`**${perms}**`)
            .setColor(helper.vars.colours.embedColour.admin.dec);

    } catch (err) {
        embed.setTitle('Error')
            .setDescription('An error occured while trying to get the permissions of the user.')
            .setColor(helper.vars.colours.embedColour.admin.dec);

    }




    //SEND/EDIT MSG==============================================================================================================================================================================================

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed],
        }
    }, input.canReply);
};

/**
 * force crash bot
 */
export const crash = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let baseCommandType;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
        }
            break;

        //==============================================================================================================================================================================================
    }

    helper.tools.log.commandOptions(
        [],
        input.id,
        'crash',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: 'executing crash command...'
        }
    }, input.canReply);
    setTimeout(() => {
        helper.tools.log.stdout(`executed crash command by ${commanduser.id} - ${commanduser.username}`);
        process.exit(1);
    }, 1000);
};

export const getUser = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let id;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            id = input.args[0];
            if (input.message.mentions.users.size > 0) {
                id = input.message.mentions.users.first().id;
            }

            if (isNaN(id) && !(input.message.mentions.users.size > 0)) {
                id = commanduser.id;
            }
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'userID',
                value: id
            }
        ],
        input.id,
        'getuser',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    const Embedr = new Discord.EmbedBuilder()
        .setTitle(`Error`)
        .setThumbnail(`https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
        .setDescription(`user does not exist or bot is not in the same guild as the user`);

    let userfind;
    helper.vars.client.guilds.cache.forEach(guild => {
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

            Embedr.setTitle(`${userfind.user.tag} ${userfind.user.bot ? helper.vars.emojis.discord.bot : ''}`)
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

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [Embedr]
        }
    }, input.canReply);
};

export const getUserAv = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let id;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            id = input.args[0];

            if (input.message.mentions.users.size > 0) {

                id = input.message.mentions.users.first().id;
            }

            if (isNaN(id) && !(input.message.mentions.users.size > 0)) {
                id = commanduser.id;
            }
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'id',
                value: id
            }
        ],
        input.id,
        'getuseravatar',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    const Embedr = new Discord.EmbedBuilder()
        .setTitle(`Error`)
        .setImage(`https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
        .setDescription(`user does not exist or bot is not in the same guild as the user`);
    let userfind;
    helper.vars.client.guilds.cache.forEach(guild => {
        if (guild.members.cache.has(id)) {
            userfind = guild.members.cache.get(id);//.user.tag
            Embedr.setTitle(`${userfind.user.tag} ${userfind.user.bot ? '<:bot:958289108147523584>' : ''}`)
                .setImage(`${userfind.user.avatarURL()}?size=512`)
                .setDescription('_');
            return;
        }
    });

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [Embedr]
        }
    }, input.canReply);
};

/**
 * return debug stuff ie command files, server list, etc.
 */
export const debug = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;

    type debugtype =
        'commandfile' | 'commandfiletype' |
        'servers' | 'channels' | 'users' | 'maps' |
        'forcetrack' | 'curcmdid' |
        'logs' | 'ls' |
        'clear' |
        'ip' | 'tcp' | 'location' |
        'memory';

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

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            if (!input.args[0]) {
                failed = true;
                errorstr = 'Error: missing first argument (type)';
            }
            type = input.args?.[0] as debugtype;

            input.args.shift();
            inputstr = input.args?.join(' ');
        }
            break;
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'debugtype',
                value: type
            },
            {
                name: 'Other args',
                value: inputstr
            }
        ],
        input.id,
        'xxx',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    if (failed == true) {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
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
        'maps' | 'map' | 'pp' |
        'graph'
        ;

    switch (type) {
        //return api files for []
        case 'commandfile': {
            let cmdidcur = `${(+input.id) - 1}`;
            if (!inputstr || isNaN(+inputstr)) {
                cmdidcur = fs.readFileSync(`${helper.vars.path.main}/id.txt`, 'utf-8');
            } else {
                cmdidcur = inputstr;
            }
            const files = fs.readdirSync(`${helper.vars.path.main}/cache/commandData/`);
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
                        files: searchfiles.map(x => `${helper.vars.path.main}/cache/commandData/` + x)
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
            const files = fs.readdirSync(`${helper.vars.path.main}/cache/debug/command`);
            if (files.length < 1) {
                usemsgArgs = {
                    content: 'Cache folder is currently empty'
                };
            } else {
                //convert to search term
                let resString;
                let tempId = null;
                if (inputstr.includes(' ')) {
                    const temp = inputstr.split(' ');
                    inputstr = temp[0];
                    tempId = temp[1];
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
                    case 'weather':
                        resString = 'weather';
                        break;
                    case 'tropicalweather': case 'ts':
                        resString = 'tropicalweather';
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
                    case 'weather':
                    case 'tropicalweather':
                        {
                            await findAndReturn(`${helper.vars.path.main}/cache/debug/command`, resString, tempId);
                        }
                        break;
                    case 'map (file)':
                    case 'replay':
                        {
                            await findAndReturn(`${helper.vars.path.main}/cache/debug/fileparse`, resString, tempId);
                        }
                        break;
                    default:
                        usemsgArgs = {
                            content: `${inputstr && inputstr?.length > 0 ? `No files found for command "${inputstr}"\n` : ''}Valid options are: \`badges\`,\`bws\`,\`firsts\`,\`globals\`,\`map\`,\`maplb\`,\`osu\`,\`osutop\`,\`pinned\`,\`recent\`,\`recent_activity\`,\`scoreparse\`,\`scores\`,\`scorestats\`,\`simplay\`,\`userbeatmaps\`,\`whatif\`, \`weather\`, \`tropicalweather\``
                        };
                        break;
                }
            }
        }
            break;
        //list all servers
        case 'servers': {
            {
                const servers = ((helper.vars.client.guilds.cache.map((guild) => {
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
                fs.writeFileSync(`${helper.vars.path.files}/servers.txt`, servers, 'utf-8');
            }
            usemsgArgs = {
                content: `${helper.vars.client.guilds.cache.size} servers connected to the client`,
                files: [`${helper.vars.path.files}/servers.txt`]
            };

        }
            break;
        //list all channels of server x
        case 'channels': {
            let serverId: string;
            if (!inputstr || isNaN(+inputstr)) {
                serverId = input.message.guildId;
            } else {
                serverId = inputstr;
            }
            const curServer = helper.vars.client.guilds.cache.get(serverId);
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
                fs.writeFileSync(`${helper.vars.path.files}/channels${serverId}.txt`, channels, 'utf-8');

                usemsgArgs = {
                    content: `${curServer.channels.cache.size} channels in guild ${serverId}`,
                    files: [`${helper.vars.path.files}/channels${serverId}.txt`]
                };
            }

        }
            break;
        //list all users of server x
        case 'users': {
            let serverId: string;
            if (!inputstr || isNaN(+inputstr)) {
                serverId = input.message.guildId;
            } else {
                serverId = inputstr;
            }
            const curServer = helper.vars.client.guilds.cache.get(serverId);
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
                fs.writeFileSync(`${helper.vars.path.files}/users${serverId}.txt`, users, 'utf-8');

                usemsgArgs = {
                    content: `${curServer.memberCount} users in guild ${serverId}`,
                    files: [`${helper.vars.path.files}/users${serverId}.txt`]
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
            const directory = `${helper.vars.path.main}/cache/commandData`;
            const dirFiles = fs.readdirSync(directory);
            const acceptFiles: string[] = [];
            for (const file of dirFiles) {
                if (file.includes('mapdata')) {
                    const tempdata = (JSON.parse(fs.readFileSync(directory + '/' + file, 'utf-8'))) as tooltypes.apiReturn;
                    const data = tempdata.apiData as apitypes.Beatmap;
                    if (type.includes('name')) {
                        acceptFiles.push(`[\`${(data.beatmapset.title)} [${data.version}]\`](https://osu.ppy.sh/b/${data.id}) (${data.status})`);
                    } else {
                        acceptFiles.push(`[${data.id}](https://osu.ppy.sh/b/${data.id}) (${data.status})`);
                    }
                }
            }
            const temppath = `${helper.vars.path.files}/maps.md`;
            fs.writeFileSync(temppath, acceptFiles.join('\n').replaceAll('[\`', '[').replaceAll('\`]', ']'), 'utf-8');
            const embeds = [];
            let content = '';
            let files = [];
            if (acceptFiles.join('\n').length < 4000) {
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
            helper.tools.track.trackUsers(60 * 1000);
            usemsgArgs = {
                content: `Running osu!track (total time: 60s)...`
            };
        }
            break;
        //get id of current cmd
        case 'curcmdid': {
            usemsgArgs = {
                content: 'Last command\'s ID is ' + `${helper.vars.id - 1}`
            };
        }
            break;
        //returns command logs for server
        case 'logs': {
            let serverId: string;
            if (!inputstr || isNaN(+inputstr)) {
                serverId = input.message.guildId;
            } else {
                serverId = inputstr;
            }
            const curServer = fs.existsSync(`${helper.vars.path.main}/logs/cmd/${serverId}.log`);
            if (!curServer) {
                usemsgArgs = {
                    content: `Server ${serverId} not found - does not exist or bot is not in the guild`
                };
            } else {
                usemsgArgs = {
                    content: `Logs for ${serverId}`,
                    files: [`${helper.vars.path.main}/logs/cmd/${serverId}.log`]
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
        case 'ls': {
            const fields: Discord.RestOrArray<Discord.APIEmbedField> = [];
            const files: string[] = [];
            //command data
            const cmdCache = fs.readdirSync(`${helper.vars.path.main}/cache/commandData`);
            fields.push(intofield('Cache', cmdCache, `${helper.vars.path.files}/cmdcache.txt`));
            //debug
            const debugCMD = fs.readdirSync(`${helper.vars.path.main}/cache/debug/command`);
            const debugFP = fs.readdirSync(`${helper.vars.path.main}/cache/debug/fileparse`);
            const debugCache = debugCMD.concat(debugFP);
            fields.push(intofield('Debug', debugCache, `${helper.vars.path.files}/debugcache.txt`, true));
            //error files
            const errf = fs.readdirSync(`${helper.vars.path.main}/cache/errors`);
            fields.push(intofield('Error files', errf, `${helper.vars.path.files}/errcache.txt`));
            //previous files
            const prevF = fs.readdirSync(`${helper.vars.path.main}/cache/previous`);
            fields.push(intofield('Previous files', prevF, `${helper.vars.path.files}/prevcache.txt`));
            //map files
            const mapC = fs.readdirSync(`${helper.vars.path.files}/maps`);
            fields.push(intofield('Map files', mapC, `${helper.vars.path.files}/mapcache.txt`));

            const embed = new Discord.EmbedBuilder()
                .setTitle('Files')
                .setFields(fields);
            function form(s: string[], variant?: number) {
                return variant == 1 ?
                    s.map(x => `\`${x}\`\n`).join('')
                    :
                    s.map(x => `\`${x}\`, `).join('');
            }
            function intofield(name: string, cache: string[], temppath: string, alt?: boolean) {
                let value = `${alt ? 'Folders' : 'Files'}: ${cache.length}`;
                if (cache.length > 25) {
                    fs.writeFileSync(temppath, form(cache, 1), 'utf-8');
                    files.push(temppath);
                } else {
                    value += `\n${form(cache)}`;
                }
                return {
                    name, value
                } as Discord.APIEmbedField;
            }
            usemsgArgs = {
                embeds: [embed],
                files
            };
        }
            break;
        case 'ip': case 'tcp': case 'location':
            usemsgArgs = {
                content: helper.vars.responses.decline[Math.floor(Math.random() * helper.vars.responses.decline.length)]
            };
            break;
        case 'memory':
            const tomb = (into: number) => Math.round(into / 1024 / 1024 * 100) / 100;
            const memdat = process.memoryUsage();

            const embed = new Discord.EmbedBuilder()
                .setTitle('Current Memory Usage')
                .setDescription(`
RSS:        ${tomb(memdat.rss)} MiB
Heap Total: ${tomb(memdat.heapTotal)} MiB
Heap Used:  ${tomb(memdat.heapUsed)} MiB
External:   ${tomb(memdat.external)} MiB
`);
            usemsgArgs = {
                embeds: [embed]
            };
            break;
        default: {
            const expectArgs = [
                'commandfile', 'commandfiletype', 'servers', 'channels', 'users', 'forcetrack', 'curcmdid', 'logs', 'clear', 'maps', 'ls', 'ip', 'memory'];
            usemsgArgs = {
                content: `Valid types are: ${expectArgs.map(x => `\`${x}\``).join(', ')}`
            };
        }

    }

    async function findAndReturn(inpath: string, find: string, serverId: string) {
        const sFiles = fs.readdirSync(`${inpath}`);
        const found = sFiles.find(x => x == find);
        const inFiles = fs.readdirSync(`${inpath}/${found}`);
        let content = `Files found for command \`${inputstr}\``;
        let files = inFiles.map(x => `${inpath}/${found}/${x}`);
        if (!isNaN(+serverId)) {
            const tfiles = inFiles.map(x => `${inpath}/${found}/${x}`).filter(x => x.includes(serverId));
            content = `Files found for command \`${inputstr}\`, matching server ID ${serverId}`;
            files = tfiles;
            if (tfiles.length == 0) {
                files = inFiles.map(x => `${inpath}/${found}/${x}`);
                content = `Files found for command \`${inputstr}\`. None found matching ${serverId}`;
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
                helper.tools.log.stdout(`manually clearing temporary files in ${helper.vars.path.main}/cache/commandData/`);
                const curpath = `${helper.vars.path.main}/cache/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    const keep = ['Approved', 'Ranked', 'Loved', 'Qualified'];
                    if (!keep.some(x => file.includes(x))) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`${curpath}/` + file);
                    }
                }
                usemsgArgs = {
                    content: `Clearing temporary files in ./cache/commandData/`
                };
            }
                break;
            case 'all': { //clears all files in commandData
                helper.tools.log.stdout(`manually clearing all files in ${helper.vars.path.main}/cache/commandData/`);
                const curpath = `${helper.vars.path.main}/cache/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`${curpath}/` + file);
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
            case 'pp':
                helper.tools.log.stdout(`manually clearing all map files in ${helper.vars.path.files}/maps/`,);
                const curpath = `${helper.vars.path.files}/maps`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`${curpath}/` + file,);
                }
                break;
            case 'map': case 'maps': { // clears all maps and mapset files
                helper.tools.log.stdout(`manually clearing all map and mapset files in ${helper.vars.path.main}/cache/commandData/ and ${helper.vars.path.files}/maps/`);
                const curpath1 = `${helper.vars.path.main}/cache/commandData`;
                const files1 = fs.readdirSync(curpath1);
                for (const file of files1) {
                    if (file.includes('bmsdata') || file.includes('mapdata')) {
                        fs.unlinkSync(`${curpath1}/` + file);
                        helper.tools.log.stdout(`${curpath1}/` + file);
                    }
                }
                const curpath2 = `${helper.vars.path.files}/maps`;
                const files2 = fs.readdirSync(curpath2);
                for (const file of files2) {
                    fs.unlinkSync(`${curpath2}/` + file);
                    helper.tools.log.stdout(`${curpath2}/` + file);
                }
                usemsgArgs = {
                    content: `Clearing all map-related files in ./cache/commandData/ and ./files/maps/`
                };
            }
                break;
            case 'users': { //clears all osudata files
                helper.tools.log.stdout(`manually clearing all osudata files in ${helper.vars.path.main}/cache/commandData/`);
                const curpath = `${helper.vars.path.main}/cache/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('osudata')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`${curpath}/` + file,);
                    }
                }
                usemsgArgs = {
                    content: `Clearing all osudata files in ./cache/commandData/`
                };
            }
                break;
            case 'previous': { // clears all previous files
                helper.tools.log.stdout(`manually clearing all prev files in ${helper.vars.path.main}/cache/previous/`,);
                const curpath = `${helper.vars.path.main}/cache/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`${curpath}/` + file,);
                }
                usemsgArgs = {
                    content: `Clearing all previous files in ./cache/previous/`
                };
            }
                break;
            case 'pmaps': { // clears all previous map files
                helper.tools.log.stdout(`manually clearing all prevmap files in ${helper.vars.path.main}/cache/previous/`,);
                const curpath = `${helper.vars.path.main}/cache/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('map')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`${curpath}/` + file,);
                    }
                }
                usemsgArgs = {
                    content: `Clearing all previous map files in ./cache/previous/`
                };
            }
                break;
            case 'pscores': { // clears all previous score files
                helper.tools.log.stdout(`manually clearing all prev score files in ${helper.vars.path.main}/cache/previous/`,);
                const curpath = `${helper.vars.path.main}/cache/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('score')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`${curpath}/` + file);
                    }
                }
                usemsgArgs = {
                    content: `Clearing all previous score files in ./cache/previous/`
                };
            }
            case 'pusers': { // clears all previous user files
                helper.tools.log.stdout(`manually clearing all prev user files in ${helper.vars.path.main}/cache/previous/`);
                const curpath = `${helper.vars.path.main}/cache/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('user')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`${curpath}/` + file);
                    }
                }
                usemsgArgs = {
                    content: `Clearing all previous user files in ./cache/previous/`
                };
            }
                break;
            case 'errors': { //clears all errors
                helper.tools.log.stdout(`manually clearing all err files in ${helper.vars.path.main}/cache/errors/`);
                const curpath = `${helper.vars.path.main}/cache/errors`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`${curpath}/` + file);
                }
                usemsgArgs = {
                    content: `Clearing error files in ./cache/errors/`
                };
            }
                break;
            case 'graph': {
                helper.tools.log.stdout(`manually clearing all graph files in ${helper.vars.path.main}/cache/graphs/`);
                const curpath = `${helper.vars.path.main}/cache/graphs`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`${curpath}/` + file);
                }
                usemsgArgs = {
                    content: `Clearing graph files in ./cache/graphs/`
                };
            }
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: usemsgArgs
    }, input.canReply);
};

/**
 * find user/role/channel/guild/emoji from id 
 */
export const find = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let type;
    let id;

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;

            type = input.args[0];
            id = input.args[1];
            if (input.message.mentions.users.size > 0) {
                type = 'user';
                id = input.message.mentions.users.first().id;
            }
            if (input.message.mentions.channels.size > 0) {
                type = 'channel';
                id = input.message.mentions.channels.first().id;
            }
            if (input.message.mentions.roles.size > 0) {
                type = 'role';
                id = input.message.mentions.roles.first().id;
            }
            if (input.message.content.includes('<:') && !isNaN(+input.message.content.split('<:')[1].split('>')[0].split(':')[1])) {
                type = 'emoji';
                id = input.message.content.split('<:')[1].split('>')[0].split(':')[1];
            }
            if (isNaN(id) && (!(input.message.mentions.users.size > 0 && type == 'user') || !(input.message.mentions.channels.size > 0 && type == 'channel') || !(input.message.mentions.roles.size == 1 && type == 'roles'))) {

                await helper.tools.commands.sendMessage({
                    type: input.type,
                    message: input.message,
                    interaction: input.interaction,
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
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'type',
                value: type
            },
            {
                name: 'id',
                value: id
            }
        ],
        input.id,
        'find',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    const Embedr = new Discord.EmbedBuilder()
        .setTitle(`Error`)
        .setDescription(`${type} does not exist or bot is not in the same guild as the ${type}`);
    let nullIMG = true;
    let tempCheckErr = true;
    const useFiles = [];

    switch (type) {
        case 'user':
            {
                let userfind: Discord.GuildMember;
                helper.vars.client.guilds.cache.forEach(guild => {
                    if (guild.members.cache.has(id)) {
                        userfind = guild.members.cache.get(id);//.user.tag
                        let up = 'null or offline status';
                        if (userfind.presence) {
                            up = '';
                            for (let i = 0; i < userfind.presence.activities.length; i++) {
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
                        if (userfind?.user?.avatarURL()) {
                            nullIMG = false;
                            Embedr
                                .setThumbnail(`${userfind?.user?.avatarURL()}`);
                        }

                        Embedr
                            .setAuthor({ name: `USER ${id}` })
                            .setTitle(`${userfind.user.tag} ${userfind.user.bot ? '<:bot:958289108147523584>' : ''}`)
                            .setDescription(
                                `Account created ${helper.tools.formatter.dateToDiscordFormat(userfind.user?.createdAt)}
Status: ${up}
Bot: ${userfind.user.bot}
Flags/badges: ${helper.tools.other.userbitflagsToEmoji(userfind.user?.flags)}
`);
                        tempCheckErr = false;
                        return;
                    }
                });
                if (tempCheckErr) {
                    helper.tools.commands.errorAndAbort(input, 'find', false, helper.vars.errors.uErr.arg.nf.replace('arg', `${type} with ID`).replace('[ID]', id), true);
                    return;
                }
            }
            break;
        case 'guild':
            {
                if (!(helper.tools.checks.isOwner(commanduser.id) || (id == input.message.guildId && helper.tools.checks.isAdmin(commanduser.id, input.message.guildId)))) {
                    Embedr.setDescription('You don\'t have permissions to use this command');
                } else {
                    const guildfind = helper.vars.client.guilds.cache.get(id);
                    if (guildfind) {
                        const owner = await guildfind?.fetchOwner();
                        Embedr
                            .setAuthor({ name: `GUILD ${id}` })
                            .setTitle(`${guildfind.name}`);
                        if (guildfind.iconURL()) {
                            nullIMG = false;
                            Embedr.setThumbnail(`${guildfind.iconURL()}`);
                        }
                        if (guildfind.bannerURL()) {
                            Embedr.setImage(`${guildfind.bannerURL()}`);
                        }
                        Embedr.setDescription(`
Created ${helper.tools.formatter.dateToDiscordFormat(guildfind.createdAt)}
Owner: <@${guildfind.ownerId}> | ${guildfind.ownerId} | ${owner?.displayName}
Members: ${guildfind.members.cache.size}
Channels: ${guildfind.channels.cache.size}
Roles: ${guildfind.roles.cache.size}
Emojis: ${guildfind.emojis.cache.size}
Stickers: ${guildfind.stickers.cache.size}
`);
                    } else {
                        helper.tools.commands.errorAndAbort(input, 'find', false, helper.vars.errors.uErr.arg.nf.replace('arg', `${type} with ID`).replace('[ID]', id), true);
                        return;
                    }
                }
            }
            break;
        case 'channel':
            {
                if (!(helper.tools.checks.isOwner(commanduser.id,) || helper.tools.checks.isAdmin(commanduser.id, input.message.guildId,))) {
                    Embedr.setDescription('You don\'t have permissions to use this command');
                } else {
                    nullIMG = false;
                    let channelfind;
                    helper.vars.client.guilds.cache.forEach(guild => {
                        if (guild.channels.cache.has(id)) {
                            channelfind = guild.channels.cache.get(id);
                            Embedr
                                .setAuthor({ name: `CHANNEL ${id}` })
                                .setTitle(`Channel: #${channelfind.name}`);
                            if (guild.iconURL()) {
                                Embedr.setThumbnail(`${guild.iconURL()}`);
                            }
                            let txt = `
Created ${helper.tools.formatter.dateToDiscordFormat(channelfind.createdAt)}
Type: ${Discord.ChannelType[channelfind.type]}
Topic: ${channelfind.topic}
Parent: ${channelfind.parent ? channelfind.parent.name : 'No parent'} ${channelfind.parent ? '| ' + channelfind.parent.id + ' | Type ' + channelfind.parent.type : ''}
Guild: ${guild.name} | ${guild.id}
`;
                            if (Discord.ChannelType[channelfind.type].toLowerCase().includes('text')) {
                                const tempchan = channelfind as Discord.TextBasedChannel;
                                txt += `Messages: ${tempchan.messages.cache.size} \n(Only messages sent while bot is online are cached)`;
                            }
                            if (Discord.ChannelType[channelfind.type].toLowerCase().includes('voice')) {
                                const tempchan = channelfind as Discord.VoiceBasedChannel;
                                txt += `User limit: ${tempchan.userLimit == 0 ? '∞' : tempchan.userLimit}
Messages: ${tempchan.messages.cache.size} \n(Only messages sent while bot is online are cached)`;
                            }
                            Embedr.setDescription(txt);
                            tempCheckErr = false;
                            return;
                        }
                    });
                    if (tempCheckErr) {
                        helper.tools.commands.errorAndAbort(input, 'find', false, helper.vars.errors.uErr.arg.nf.replace('arg', `${type} with ID`).replace('[ID]', id), true);
                        return;
                    }
                }
            }
            break;
        case 'role':
            {
                if (!(helper.tools.checks.isOwner(commanduser.id,) || helper.tools.checks.isAdmin(commanduser.id, input.message.guildId,))) {
                    Embedr.setDescription('You don\'t have permissions to use this command');
                } else {
                    let rolefind: Discord.Role;
                    helper.vars.client.guilds.cache.forEach(guild => {
                        if (guild.roles.cache.has(id)) {
                            nullIMG = false;
                            rolefind = guild.roles.cache.get(id);
                            Embedr
                                .setAuthor({ name: `ROLE ${id}` })
                                .setTitle(`Role: ${rolefind.name}`);
                            if (guild.iconURL()) {
                                Embedr.setThumbnail(`${guild.iconURL()}`);
                            }
                            const clr = rolefind.color ?
                                `${rolefind.color} | ${helper.tools.colourcalc.decToHex(rolefind.color)} | RGB ${helper.tools.colourcalc.decToRgb(rolefind.color)}` : 'null';
                            Embedr.setDescription(`
Created ${helper.tools.formatter.dateToDiscordFormat(rolefind.createdAt)}
Colour: ${clr}
Emoji: ${rolefind.unicodeEmoji ? rolefind.unicodeEmoji : 'null'}
Guild: ${guild.name} | ${guild.id}
`);
                            Embedr.setColor(rolefind.color);
                            tempCheckErr = false;
                            return;
                        }
                    });
                    if (tempCheckErr) {
                        helper.tools.commands.errorAndAbort(input, 'find', false, helper.vars.errors.uErr.arg.nf.replace('arg', `${type} with ID`).replace('[ID]', id), true);
                        return;
                    }
                }
            }
            break;
        case 'emoji': {
            let emojifind = helper.vars.client.emojis.cache.get(id);
            if (emojifind) {
                Embedr
                    .setAuthor({ name: `EMOJI ${id}` })
                    .setTitle(`Emoji: ${emojifind.name}`);
                if (emojifind.url) {
                    nullIMG = false;
                    Embedr.setThumbnail(`${emojifind.imageURL()}`);
                }
                Embedr.setDescription(`
Created ${helper.tools.formatter.dateToDiscordFormat(emojifind.createdAt)}
Emoji: \`<:${emojifind.name}:${id}>\`
Guild: ${emojifind.guild.name} | ${emojifind.guild.id}
`);
            } else {
                helper.tools.commands.errorAndAbort(input, 'find', false, helper.vars.errors.uErr.arg.nf.replace('arg', `${type} with ID`).replace('[ID]', id), true);
                return;
            }
        }
            break;
        case 'sticker': {
            let stickerfind: Discord.Sticker;
            helper.vars.client.guilds.cache.forEach(guild => {
                if (guild.stickers.cache.has(id)) {
                    stickerfind = guild.stickers.cache.get(id);
                    nullIMG = false;
                    Embedr
                        .setAuthor({ name: `STICKER ${id}` })
                        .setTitle(`Sticker: ${stickerfind.name}`)
                        .setThumbnail(stickerfind.url)
                        .setDescription(`
Created ${helper.tools.formatter.dateToDiscordFormat(stickerfind.createdAt)}
Guild: ${stickerfind.guild.name} | ${stickerfind.guildId}
`);
                    tempCheckErr = false;
                    return;
                }
            });
            if (tempCheckErr) {
                helper.tools.commands.errorAndAbort(input, 'find', false, helper.vars.errors.uErr.arg.nf.replace('arg', `${type} with ID`).replace('[ID]', id), true);
                return;
            }
        }
            break;
        default:
            Embedr.setTitle('Invalid search parameters');
            Embedr.setDescription(`
Valid Types: user, guild, channel, role, emoji
`);
            break;
    }
    if (nullIMG) {
        useFiles.push(new Discord.AttachmentBuilder(helper.vars.path.precomp + '/files/blank.png'));
        Embedr
            .setThumbnail(`attachment://blank.png`);
    }
    //SEND/EDIT MSG==============================================================================================================================================================================================

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [Embedr],
            files: useFiles
        }
    }, input.canReply);
};

/**
 * leave guild/server matching id given (or cur guild)
 */
export const leaveguild = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    let guildId;

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
            guildId = input.message.guildId;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'id',
                value: guildId
            }
        ],
        input.id,
        'leaveguild',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    if (helper.tools.checks.isOwner(commanduser.id)) {
        const guild = helper.vars.client.guilds.cache.get(guildId);
        if (guild) {
            guild.leave();
        }
        return;
    }
    if (helper.tools.checks.isAdmin(commanduser.id, input.message.guildId)) {
        const guild = helper.vars.client.guilds.cache.get(input.message.guildId);
        if (guild) {
            guild.leave();
        }
        return;
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: 'You don\'t have permissions to use this command'
        }
    }, input.canReply);
};

/**
 * set bot prefix for current guild
 */
export const prefix = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let newPrefix;

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
            newPrefix = input.args.join(' ');
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'prefix',
                value: newPrefix
            }
        ],
        input.id,
        'prefix',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    const curGuildSettings = await helper.vars.guildSettings.findOne({ where: { guildid: input.message.guildId } }) as any;
    let replymsg;
    if (curGuildSettings == null) {
        replymsg = 'Error: Guild settings not found';
    } else {
        if (typeof newPrefix != 'string' || newPrefix.length < 1 || !(helper.tools.checks.isAdmin(commanduser.id, input.message.guildId,) || helper.tools.checks.isOwner(commanduser.id))) {
            replymsg = `The current prefix is \`${curGuildSettings?.prefix}\``;
        } else {
            curGuildSettings.update({
                prefix: newPrefix
            }, {
                where: { guildid: input.message.guildId }
            });
            replymsg = `Prefix set to \`${newPrefix}\``;
        }
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: replymsg
        }
    }, input.canReply);
};

/**
 * delete mass amounts of messages at once
 */
export const purge = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    let purgeCount: number = 5;
    const filter: {
        byUser: boolean,
        userid: string;
    } = {
        byUser: false,
        userid: null,
    };
    let method: 'bulk' | 'fetch' = 'bulk';

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message<any>);
            commanduser = input.message.author;

            if (input.args.includes('-fetch')) {
                method = 'fetch';
                input.args.splice(input.args.indexOf('-fetch'), 1);
            }
            if (input.args.includes('-bulk')) {
                method = 'bulk';
                input.args.splice(input.args.indexOf('-bulk'), 1);
            }

            filter.userid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : null;
            purgeCount = input.args[0] ? +input.args[0] : 5;
            if (!isNaN(+input.args[1])) {
                filter.userid = input.args[1];
            }
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'count',
                value: purgeCount
            },
            {
                name: 'user',
                value: filter.userid
            },
            {
                name: 'method',
                value: method
            }
        ],
        input.id,
        'purge',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    
    let user: Discord.GuildMember;
    if (filter.userid) {
        filter.byUser = true;
        user = input.message.guild.members.cache.get(filter.userid);
        if (!user) {
            await helper.tools.commands.sendMessage({
                type: input.type,
                message: input.message,
                interaction: input.interaction,
                args: {
                    content: helper.vars.errors.uErr.admin.purge.unf
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

    const channel = helper.vars.client.channels.cache.get(input.message.channelId) as Discord.TextChannel;
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
                content = helper.vars.errors.uErr.admin.purge.fail
                    .replace('[COUNT]', `${purgeCount}`) + `\n${helper.vars.errors.uErr.admin.purge.failTime}`
                    ;
                helper.tools.log.commandErr(helper.vars.errors.uErr.admin.purge.fail
                    .replace('[COUNT]', `${purgeCount}`) + `\n${helper.vars.errors.uErr.admin.purge.failTime}`,
                    input.id, 'purge', input.message, input.interaction
                );
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
    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content
        }
    }, input.canReply);
};

/**
 * list of guilds bot is in
 */
export const servers = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [],
        input.id,
        'servers',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    

    const servers = (helper.vars.client.guilds.cache.map(guild => ` **${guild.name}** => \`${guild.id}\` | <@${guild.ownerId}> \n`)).join('');
    const embed = new Discord.EmbedBuilder()
        .setTitle(`This client is in ${helper.vars.client.guilds.cache.size} guilds`)
        .setDescription(`${servers}`);


    let rw: {
        content?: string,
        embeds?: Discord.EmbedBuilder[],
        files?: string[];
    } = {
        embeds: [embed],
    };
    if (servers.length > 2000) {
        fs.writeFileSync(`${helper.vars.path.main}/debug/guilds.txt`, servers, 'utf-8');
        rw = {
            files: [`${helper.vars.path.main}/debug/guilds.txt`],
        };
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: rw
    }, input.canReply);
};