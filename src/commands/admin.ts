import Discord from 'discord.js';
import * as fs from 'fs';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';
import { Command } from './command.js';

export class CheckPerms extends Command {
    declare protected params: {
        searchUser: Discord.User | Discord.APIUser;
    };
    constructor() {
        super();
        this.name = 'CheckPerms';
        this.params = {
            searchUser: null,
        };
    }
    async setParamsMsg() {

        if (this.input.args[0]) {
            if (this.input.message.mentions.users.size > 0) {
                this.params.searchUser = this.input.message.mentions.users.first();
            } else {
                this.params.searchUser = helper.vars.client.users.cache.get(this.input.args.join(' '));
            }
        } else {
            this.params.searchUser = this.commanduser;
        }

    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
    }
    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff
        if (this.params.searchUser == null || typeof this.params.searchUser == 'undefined') {
            this.params.searchUser = this.commanduser;
        }

        if (!(helper.tools.checks.isAdmin(this.commanduser.id, this.input.message?.guildId) || helper.tools.checks.isOwner(this.commanduser.id))) {
            this.params.searchUser = this.commanduser;
        }
        const embed = new Discord.EmbedBuilder();
        try {
            const userAsMember = this.input.message.guild.members.cache.get(this.params.searchUser.id);
            //get perms
            const perms = userAsMember.permissions.toArray().join(' **|** ');

            embed
                .setTitle(`${this.params.searchUser.username}'s Permissions`)
                .setDescription(`**${perms}**`)
                .setColor(helper.vars.colours.embedColour.admin.dec);

        } catch (err) {
            embed.setTitle('Error')
                .setDescription('An error occured while trying to get the permissions of the user.')
                .setColor(helper.vars.colours.embedColour.admin.dec);

        }

        this.ctn.embeds = [embed];
        this.send();
    }
}

export class Clear extends Command {
    declare protected params: {
        type: string;
    };
    constructor() {
        super();
        this.name = 'Clear';
        this.params = {
            type: ''
        };
    }
    async setParamsMsg() {
        this.params.type = this.input?.args[0];
    }
    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff
        let embed = new Discord.EmbedBuilder()
            .setTitle('Clearing cache');

        embed = this.clearCache(this.params.type, embed);
        this.ctn.embeds = [embed];
        this.send();
    }
    clearCache(type: string, embed: Discord.EmbedBuilder) {
        switch (type) {
            case 'normal': default: { //clears all temprary files (cache/commandData)
                helper.tools.log.stdout(`manually clearing temporary files in ${helper.vars.path.cache}/commandData/`);
                const curpath = `${helper.vars.path.cache}/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    const keep = ['Approved', 'Ranked', 'Loved', 'Qualified'];
                    if (!keep.some(x => file.includes(x))) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`Deleted file: ${curpath}/` + file);
                    }
                }
                embed.setDescription(`Clearing temporary files in ./cache/commandData/\n(ranked/loved/approved maps are kept)`);
            }
                break;
            case 'all': { //clears all files in commandData
                helper.tools.log.stdout(`manually clearing all files in ${helper.vars.path.cache}/commandData/`);
                const curpath = `${helper.vars.path.cache}/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`Deleted file: ${curpath}/` + file);
                }
                embed.setDescription(`Clearing all files in ./cache/commandData/`);
            }
                break;
            case 'trueall': { //clears everything in cache
                embed = this.clearCache('all', embed);
                embed = this.clearCache('previous', embed);
                embed = this.clearCache('errors', embed);
                embed = this.clearCache('mapall', embed);
                embed = this.clearCache('params', embed);
                embed = this.clearCache('graphs', embed);
                embed.setDescription(`Clearing all files in ./cache/ and ./files/maps`);
            }
                break;
            case 'mapall': case 'mapsall': { // clears all maps and mapset files
                helper.tools.log.stdout(`manually clearing all map and mapset files in ${helper.vars.path.cache}/commandData/ and ${helper.vars.path.files}/maps/`);
                const curpath1 = `${helper.vars.path.cache}/commandData`;
                const files1 = fs.readdirSync(curpath1);
                for (const file of files1) {
                    if (file.includes('bmsdata') || file.includes('mapdata')) {
                        fs.unlinkSync(`${curpath1}/` + file);
                        helper.tools.log.stdout(`Deleted file: ${curpath1}/` + file);
                    }
                }
                const curpath2 = `${helper.vars.path.files}/maps`;
                const files2 = fs.readdirSync(curpath2);
                for (const file of files2) {
                    fs.unlinkSync(`${curpath2}/` + file);
                    helper.tools.log.stdout(`Deleted file: ${curpath2}/` + file);
                }
                embed.setDescription(`Clearing all map-related files in ./cache/commandData/ and ./files/maps/`);
            }
                break;
            case 'mapmeta': {
                helper.tools.log.stdout(`manually clearing all map and mapset files in ${helper.vars.path.cache}/commandData/`);
                const curpath = `${helper.vars.path.cache}/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('bmsdata') || file.includes('mapdata')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`Deleted file: ${curpath}/` + file);
                    }
                }
                embed.setDescription(`Clearing all map-related files in ./cache/commandData/`);
            }
                break;
            case 'mapobjects': case 'pp': {
                helper.tools.log.stdout(`manually clearing all map files in ${helper.vars.path.files}/maps/`);
                const curpath = `${helper.vars.path.files}/maps`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`Deleted file: ${curpath}/` + file);
                }
                embed.setDescription(`Clearing all files in ./files/maps/`);
            }
            case 'users': { //clears all osudata files
                helper.tools.log.stdout(`manually clearing all osudata files in ${helper.vars.path.cache}/commandData/`);
                const curpath = `${helper.vars.path.cache}/commandData`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('osudata')) {
                        fs.unlinkSync(`Deleted file: ${curpath}/` + file);
                        helper.tools.log.stdout(`${curpath}/` + file,);
                    }
                }
                embed.setDescription(`Clearing all user data files in ./cache/commandData/`);
            }
                break;
            case 'previous': { // clears all previous files
                helper.tools.log.stdout(`manually clearing all prev files in ${helper.vars.path.cache}/previous/`,);
                const curpath = `${helper.vars.path.cache}/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`Deleted file: ${curpath}/` + file,);
                }
                embed.setDescription(`Clearing all files in ./cache/previous/`);
            }
                break;
            case 'pmaps': { // clears all previous map files
                helper.tools.log.stdout(`manually clearing all prevmap files in ${helper.vars.path.cache}/previous/`,);
                const curpath = `${helper.vars.path.cache}/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('map')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`Deleted file: ${curpath}/` + file,);
                    }
                }
                embed.setDescription(`Clearing all previous map files in ./cache/previous/`);
            }
                break;
            case 'pscores': { // clears all previous score files
                helper.tools.log.stdout(`manually clearing all prev score files in ${helper.vars.path.cache}/previous/`,);
                const curpath = `${helper.vars.path.cache}/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('score')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`Deleted file: ${curpath}/` + file);
                    }
                }
                embed.setDescription(`Clearing all previous score files in ./cache/previous/`);
            }
            case 'pusers': { // clears all previous user files
                helper.tools.log.stdout(`manually clearing all prev user files in ${helper.vars.path.cache}/previous/`);
                const curpath = `${helper.vars.path.cache}/previous`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    if (file.includes('user')) {
                        fs.unlinkSync(`${curpath}/` + file);
                        helper.tools.log.stdout(`Deleted file: ${curpath}/` + file);
                    }
                }
                embed.setDescription(`Clearing all previous user files in ./cache/previous/`);
            }
                break;
            case 'errors': { //clears all errors
                helper.tools.log.stdout(`manually clearing all err files in ${helper.vars.path.cache}/errors/`);
                const curpath = `${helper.vars.path.cache}/errors`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`Deleted file: ${curpath}/` + file);
                }
                embed.setDescription(`Clearing error files in ./cache/errors/`);
            }
                break;
            case 'graph': {
                helper.tools.log.stdout(`manually clearing all graph files in ${helper.vars.path.cache}/graphs/`);
                const curpath = `${helper.vars.path.cache}/graphs`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`Deleted file: ${curpath}/` + file);
                }
                embed.setDescription(`Clearing graph files in ./cache/graphs/`);
            }
            case 'params': {
                helper.tools.log.stdout(`manually clearing all param files in ${helper.vars.path.cache}/params/`);
                const curpath = `${helper.vars.path.cache}/params`;
                const files = fs.readdirSync(curpath);
                for (const file of files) {
                    fs.unlinkSync(`${curpath}/` + file);
                    helper.tools.log.stdout(`Deleted file: ${curpath}/` + file);
                }
                embed.setDescription(`Clearing param files in ./cache/params/`);
            }
            case 'help': {
                embed.setDescription(
                    [
                        ['help', 'show this list'],
                        ['normal', 'clears all temporary files (maps with leaderboard are kept)'],
                        ['all', 'clears all files in command cache'],
                        ['trueall', 'clears all files in all cache folders and `.osu` files'],
                        ['mapall/mapsall', 'clears all map files and `.osu` files'],
                        ['mapmeta', 'clears all map files in command cache'],
                        ['mapobjects/pp', 'clears all `.osu` files'],
                        ['users', 'clear all osu profile data'],
                        ['previous', 'clear all previous* files'],
                        ['pmaps', 'clear all previous* map files'],
                        ['pscores', 'clear all previous* score files'],
                        ['pusers', 'clear all previous* user files'],
                        ['errors', 'clear cached errors'],
                        ['graph', 'clear cached graphs'],
                        ['params', 'clear command params (such as sorting order, filters etc.)'],
                    ].map(x => `**${x[0]}**: ${x[1]}`).join('\n') + '\n'
                    + '* previous files store the data of the last object used in that given server/guild'
                );
            }
                break;
        }
        return embed;
    }
}

export class Crash extends Command {
    declare protected params: {};
    constructor() {
        super();
        this.name = 'Crash';
    }
    async execute() {
        await this.setParams();
        this.logInput(true);
        // do stuff
        this.ctn.content = 'executing crash command...';
        this.send();
        setTimeout(() => {
            helper.tools.log.stdout(`executed crash command by ${this?.commanduser?.id} - ${this?.commanduser?.username}`);
            process.exit(1);
        }, 1000);
    }
}
type debugtype =
    'commandfile' | 'commandfiletype' |
    'servers' | 'channels' | 'users' | 'maps' |
    'forcetrack' | 'curcmdid' |
    'logs' | 'ls' |
    'clear' |
    'ip' | 'tcp' | 'location' |
    'memory';
export class Debug extends Command {
    declare protected params: {
        type: debugtype;
        inputstr: string;
    };
    constructor() {
        super();
        this.name = 'Debug';
        this.params = {
            type: null,
            inputstr: null,
        };
    }
    async setParamsMsg() {
        if (!this.input.args[0]) {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: 'Error: missing first argument (type)'
                }
            }, this.input.canReply);
            return;

        }
        this.params.type = this.input.args?.[0] as debugtype;

        this.input.args.shift();
        this.params.inputstr = this.input.args?.join(' ');
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
    }

    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff
        switch (this.params.type) {
            //return api files for []
            case 'commandfile': {
                let cmdidcur = `${(+this.input.id) - 1}`;
                if (!this.params.inputstr || isNaN(+this.params.inputstr)) {
                    cmdidcur = fs.readFileSync(`${helper.vars.path.main}/id.txt`, 'utf-8');
                } else {
                    cmdidcur = this.params.inputstr;
                }
                const files = fs.readdirSync(`${helper.vars.path.cache}/commandData/`);
                if (files.length < 1) {
                    this.ctn.content = 'Cache folder is currently empty';

                } else {
                    const searchfiles = files.filter(x => {
                        return (`${x}`.includes(`${cmdidcur}-`))
                            &&
                            `${x}`.indexOf(`${cmdidcur}-`) == 0;
                    }
                    );
                    if (searchfiles.length < 1) {
                        this.ctn.content = `No files found with the id ${cmdidcur}`;
                    } else {
                        this.ctn.content = `Files found matching ${cmdidcur}: `;
                        this.ctn.files = searchfiles.map(x => `${helper.vars.path.cache}/commandData/` + x);
                    };
                }
            }
                break;
            case 'commandfiletype': {
                this.ctn.content = 'txt';
            };
                if (!this.params.inputstr) {
                    this.ctn.content = `No search query given`;
                }
                const files = fs.readdirSync(`${helper.vars.path.cache}/debug/command`);
                if (files.length < 1) {
                    this.ctn.content = 'Cache folder is currently empty';

                } else {
                    //convert to search term
                    let resString: string;
                    let tempId = null;
                    if (this.params.inputstr.includes(' ')) {
                        const temp = this.params.inputstr.split(' ');
                        this.params.inputstr = temp[0];
                        tempId = temp[1];
                    }
                    const cmdftypes = [
                        'Badges',
                        'BadgeWeightSeed',
                        'Compare',
                        'Firsts',
                        'Map',
                        'MapLeaderboard',
                        'MapScores',
                        'OsuTop',
                        'Pinned',
                        'Profile',
                        'Ranking',
                        'Recent',
                        'RecentList',
                        'RecentActivty',
                        'ScoreParse',
                        'ScoreStats',
                        'Simulate',
                        'UserBeatmaps',
                        'WhatIf',
                    ];
                    switch (this.params.inputstr.toLowerCase()) {
                        case 'badgeweightsystem': case 'badgeweight': case 'badgeweightseed': case 'badgerank':case 'bws':
                            resString = 'BadgeWeightSeed';
                            break;
                        case 'firstplaceranks': case 'fpr': case 'fp': case '#1s': case 'first': case '#1': case '1s':
                            resString = 'Firsts';
                            break;
                        case 'osc': case 'osustatscount':
                            resString = 'globals';
                            break;
                        case 'm':
                            resString = 'Map';
                            break;
                        case 'maplb': case 'mapleaderboard': case 'leaderboard':
                            resString = 'MapLeaderboard';
                            break;
                        case 'profile': case 'o': case 'user': case 'osu':
                        case 'taiko': case 'drums':
                        case 'fruits': case 'ctb': case 'catch':
                        case 'mania':
                            resString = 'Profile';
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
                            resString = 'OsuTop';
                            break;
                        case 'rs': case 'r':
                        case 'recenttaiko': case 'rt':
                        case 'recentfruits': case 'rf': case 'rctb':
                        case 'recentmania': case 'rm':
                            resString = 'Recent';
                            break;
                        case 'rs best': case 'recent best':
                        case 'rsbest': case 'recentbest': case 'rb':
                        case 'recentlist': case 'rl':
                        case 'recentlisttaiko': case 'rlt':
                        case 'recentlistfruits': case 'rlf': case 'rlctb': case 'rlc':
                        case 'recentlistmania': case 'rlm':
                            resString = 'RecentList';
                        case 'recentactivity': case 'recentact': case 'rsact':
                            resString = 'RecentActivty';
                            break;
                        case 'score': case 'sp':
                            resString = 'ScoreParse';
                            break;
                        case 'c': case 'scores':
                            resString = 'MapScores';
                            break;
                        case 'ss':
                            resString = 'ScoreStats';
                            break;
                        case 'simulate': case 'sim': case 'simplay':
                            resString = 'Simulate';
                            break;
                        case 'ub': case 'userb': case 'ubm': case 'um': case 'usermaps':
                            resString = 'UserBeatmaps';
                            break;
                        case 'wi':
                            resString = 'WhatIf';
                            break;
                        case 'mapfile': case 'mf':
                            resString = 'map (file)';
                            break;
                        default:
                            resString = this.params.inputstr;
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
                                await this.findAndReturn(`${helper.vars.path.cache}/debug/command`, resString, tempId);
                            }
                            break;
                        case 'map (file)':
                        case 'replay':
                            {
                                await this.findAndReturn(`${helper.vars.path.cache}/debug/fileparse`, resString, tempId);
                            }
                            break;
                        default:
                            this.ctn.content = `${this.params.inputstr && this.params.inputstr?.length > 0 ? `No files found for command "${this.params.inputstr}"\n` : ''}Valid options are: ${cmdftypes.map(x => '`' + x + '`').join(', ')}`;
                            break;
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

                this.ctn.content = `${helper.vars.client.guilds.cache.size} servers connected to the client`;
                this.ctn.files = [`${helper.vars.path.files}/servers.txt`];
            }
                break;
            //list all channels of server x
            case 'channels': {
                let serverId: string;
                if (!this.params.inputstr || isNaN(+this.params.inputstr)) {
                    serverId = this.input.message?.guildId;
                } else {
                    serverId = this.params.inputstr;
                }
                const curServer = helper.vars.client.guilds.cache.get(serverId);
                if (!curServer) {
                    this.ctn.
                        content = `Server ${serverId} not found - does not exist or bot is not in the guild`;

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

                    this.ctn.content = `${curServer.channels.cache.size} channels in guild ${serverId}`;
                    this.ctn.files = [`${helper.vars.path.files}/channels${serverId}.txt`];
                }

            }
                break;
            //list all users of server x
            case 'users': {
                let serverId: string;
                if (!this.params.inputstr || isNaN(+this.params.inputstr)) {
                    serverId = this.input.message?.guildId;
                } else {
                    serverId = this.params.inputstr;
                }
                const curServer = helper.vars.client.guilds.cache.get(serverId);
                if (!curServer) {
                    this.ctn.content = `Server ${serverId} not found - does not exist or bot is not in the guild`;

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


                    this.ctn.content = `${curServer.memberCount} users in guild ${serverId}`;
                    this.ctn.files = [`${helper.vars.path.files}/users${serverId}.txt`];

                }
            }
                break;
            case 'maps': {
                let type;
                if (!this.params.inputstr) {
                    type = 'id';
                } else {
                    type = this.params.inputstr;
                }
                const directory = `${helper.vars.path.cache}/commandData`;
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

                if (acceptFiles.join('\n').length < 4000) {
                    this.ctn.embeds.push(
                        new Discord.EmbedBuilder()
                            .setTitle(`${acceptFiles.length} maps stored in cache.`)
                            .setDescription(acceptFiles.join('\n'))
                    );
                } else {
                    this.ctn.content = `${acceptFiles.length} maps stored in cache.`;
                    this.ctn.files = [`${temppath}`];
                }
            }
                break;
            //force osutrack to update
            case 'forcetrack': {
                helper.tools.track.trackUsers(60 * 1000);
                this.ctn.content = `Running osu!track (total time: 60s)...`;
            }
                break;
            //get id of current cmd
            case 'curcmdid': {
                this.ctn.content = 'Last command\'s ID is ' + `${helper.vars.id - 1}`;
            }
                break;
            //returns command logs for server
            case 'logs': {
                let serverId: string;
                if (!this.params.inputstr || isNaN(+this.params.inputstr)) {
                    serverId = this.input.message?.guildId;
                } else {
                    serverId = this.params.inputstr;
                }
                const curServer = fs.existsSync(`${helper.vars.path.main}/logs/cmd/${serverId}.log`);
                if (!curServer) {
                    this.ctn.content = `Server ${serverId} not found - does not exist or bot is not in the guild`;
                } else {
                    this.ctn.content = `Logs for ${serverId}`,
                        this.ctn.files = [`${helper.vars.path.main}/logs/cmd/${serverId}.log`];
                }
            }
                break;
            case 'ls': {
                const fields: Discord.RestOrArray<Discord.APIEmbedField> = [];
                const files: string[] = [];
                //command data
                const cmdCache = fs.readdirSync(`${helper.vars.path.cache}/commandData`);
                fields.push(this.debugIntoField('Cache', cmdCache, `${helper.vars.path.files}/cmdcache.txt`, files));
                //debug
                const debugCMD = fs.readdirSync(`${helper.vars.path.cache}/debug/command`);
                const debugFP = fs.readdirSync(`${helper.vars.path.cache}/debug/fileparse`);
                const debugCache = debugCMD.concat(debugFP);
                fields.push(this.debugIntoField('Debug', debugCache, `${helper.vars.path.files}/debugcache.txt`, files, true));
                //error files
                const errf = fs.readdirSync(`${helper.vars.path.cache}/errors`);
                fields.push(this.debugIntoField('Error files', errf, `${helper.vars.path.files}/errcache.txt`, files));
                //previous files
                const prevF = fs.readdirSync(`${helper.vars.path.cache}/previous`);
                fields.push(this.debugIntoField('Previous files', prevF, `${helper.vars.path.files}/prevcache.txt`, files));
                //map files
                const mapC = fs.readdirSync(`${helper.vars.path.files}/maps`);
                fields.push(this.debugIntoField('Map files', mapC, `${helper.vars.path.files}/mapcache.txt`, files));

                const embed = new Discord.EmbedBuilder()
                    .setTitle('Files')
                    .setFields(fields);

                this.ctn.embeds = [embed];
                this.ctn.files = files;
            }
                break;
            case 'ip': case 'tcp': case 'location':
                this.ctn.content = helper.vars.responses.decline[Math.floor(Math.random() * helper.vars.responses.decline.length)];
                break;
            case 'memory': {
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
                this.ctn.embeds = [embed];
            }
                break;
            default: {
                const expectArgs = ['commandfile', 'commandfiletype', 'servers', 'channels', 'users', 'forcetrack', 'curcmdid', 'logs', 'clear', 'maps', 'ls', 'ip', 'memory'];
                this.ctn.content = `Valid types are: ${expectArgs.map(x => `\`${x}\``).join(', ')}`;
            }

        }
        this.send();
    }
    async findAndReturn(inpath: string, find: string, serverId: string) {
        const sFiles = fs.readdirSync(`${inpath}`);
        const found = sFiles.find(x => x == find);
        const inFiles = fs.readdirSync(`${inpath}/${found}`);
        this.ctn.content = `Files found for command \`${this.params.inputstr}\``;
        this.ctn.files = inFiles.map(x => `${inpath}/${found}/${x}`);
        if (!isNaN(+serverId)) {
            const tfiles = inFiles.map(x => `${inpath}/${found}/${x}`).filter(x => x.includes(serverId));
            this.ctn.content = `Files found for command \`${this.params.inputstr}\`, matching server ID ${serverId}`;
            this.ctn.files = tfiles;
            if (tfiles.length == 0) {
                this.ctn.files = inFiles.map(x => `${inpath}/${found}/${x}`);
                this.ctn.content = `Files found for command \`${this.params.inputstr}\`. None found matching ${serverId}`;
            }
        }
    }

    debugForm(s: string[], variant?: number) {
        return variant == 1 ?
            s.map(x => `\`${x}\`\n`).join('')
            :
            s.map(x => `\`${x}\`, `).join('');
    }
    debugIntoField(name: string, cache: string[], temppath: string, files: string[], alt?: boolean) {
        let value = `${alt ? 'Folders' : 'Files'}: ${cache.length}`;
        if (cache.length > 25) {
            fs.writeFileSync(temppath, this.debugForm(cache, 1), 'utf-8');
            files.push(temppath);
        } else {
            value += `\n${this.debugForm(cache)}`;
        }
        return {
            name, value
        } as Discord.APIEmbedField;
    }
}

export class Find extends Command {
    declare protected params: {};
    constructor() {
        super();
        this.name = 'Find';

    }
    async setParamsMsg() {
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
    }

    async execute() {
        await this.setParams();
        this.logInput(true);
        // do stuff

        this.send();
    }
}
export class LeaveGuild extends Command {
    declare protected params: {
        guildId: string;
    };
    constructor() {
        super();
        this.name = 'LeaveGuild';
        this.params = {
            guildId: null
        };
    }
    async setParamsMsg() {
        this.params.guildId = this.input.args[0] ?? this.input.message?.guildId;
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
    }

    async execute() {
        await this.setParams();
        this.logInput();
        let allowed = false;
        let success = false;
        // do stuff
        if (helper.tools.checks.isOwner(this.commanduser.id)) {
            allowed = true;
            const guild = helper.vars.client.guilds.cache.get(this.params.guildId);
            if (guild) {
                success = true;
                guild.leave();
            }
        }
        if (helper.tools.checks.isAdmin(this.commanduser.id, this.params.guildId) && !success) {
            allowed = true;
            const guild = helper.vars.client.guilds.cache.get(this.params.guildId);
            if (guild) {
                success = true;
                guild.leave();
            }
        }
        this.ctn.content =
            allowed ?
                success ?
                    `Successfully left guild \`${this.params.guildId}\`` :
                    `Was unable to leave guild`
                :
                'You don\'t have permissions to use this command';
        this.send();
    }
}

export class Prefix extends Command {
    declare protected params: {
        newPrefix: string;
    };
    constructor() {
        super();
        this.name = 'Prefix';
        this.params = {
            newPrefix: null
        };
    }
    async setParamsMsg() {
        this.params.newPrefix = this.input.args.join(' ');
    }

    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff
        const curGuildSettings = await helper.vars.guildSettings.findOne({ where: { guildid: this.input.message?.guildId } }) as any;
        if (curGuildSettings == null) {
            this.ctn.content = 'Error: Guild settings not found';
        } else {
            if (typeof this.params.newPrefix != 'string' || this.params.newPrefix.length < 1 || !(helper.tools.checks.isAdmin(this.commanduser.id, this.input.message?.guildId,) || helper.tools.checks.isOwner(this.commanduser.id))) {
                this.ctn.content = `The current prefix is \`${curGuildSettings?.prefix}\``;
            } else {
                curGuildSettings.update({
                    prefix: this.params.newPrefix
                }, {
                    where: { guildid: this.input.message?.guildId }
                });
                this.ctn.content = `Prefix set to \`${this.params.newPrefix}\``;
            }
        }

        this.send();
    }
}

export class Servers extends Command {
    declare protected params: {};
    constructor() {
        super();
        this.name = 'Servers';
    }
    async execute() {
        await this.setParams();
        this.logInput(true);
        // do stuff

        const servers = (helper.vars.client.guilds.cache.map(guild => ` **${guild.name}** => \`${guild.id}\` | <@${guild.ownerId}> \n`)).join('');
        const embed = new Discord.EmbedBuilder()
            .setTitle(`This client is in ${helper.vars.client.guilds.cache.size} guilds`)
            .setDescription(`${servers}`);
        if (servers.length > 2000) {
            fs.writeFileSync(`${helper.vars.path.main}/debug/guilds.txt`, servers, 'utf-8');
            this.ctn.files = [`${helper.vars.path.main}/debug/guilds.txt`];
        }
        this.ctn.embeds = [embed];
        this.send();
    }
}