import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';
import { OsuCommand } from './command.js';

// compare, osuset, rankpp, saved, whatif
type compareType = 'profile' | 'top' | 'mapscore';

export class Compare extends OsuCommand {
    declare protected params: {
        type: compareType;
        first: string;
        second: string;
        firstsearchid: string;
        secondsearchid: string;
        mode: apitypes.GameMode;
        page: number;
    };
    constructor() {
        super();
        this.name = 'Compare';
        this.params = {
            type: 'profile',
            first: null,
            second: null,
            firstsearchid: null,
            secondsearchid: null,
            mode: 'osu',
            page: 0,
        };
    }

    async setParamsMsg() {
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }
        if (this.input.message.mentions.users.size > 1) {
            this.params.firstsearchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
            this.params.secondsearchid = this.input.message.mentions.users.size > 1 ? this.input.message.mentions.users.at(1).id : null;
        } else if (this.input.message.mentions.users.size == 1) {
            this.params.firstsearchid = this.input.message.author.id;
            this.params.secondsearchid = this.input.message.mentions.users.at(0).id;
        } else {
            this.params.firstsearchid = this.input.message.author.id;
        }
        const parseUsers = helper.tools.commands.parseUsers(this.input.args.join(' '));
        this.params.second = parseUsers[0];
        if (parseUsers[1]) {
            this.params.first = parseUsers[0];
            this.params.second = parseUsers[1];
        }
        this.params.first != null && this.params.first.includes(this.params.firstsearchid) ? this.params.first = null : null;
        this.params.second != null && this.params.second.includes(this.params.secondsearchid) ? this.params.second = null : null;
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.type = (interaction.options.getString('type') ?? 'profile') as compareType;
        this.params.first = interaction.options.getString('first');
        this.params.second = interaction.options.getString('second');
        this.params.firstsearchid = this.commanduser.id;
        this.params.mode = (interaction.options.getString('mode') ?? 'osu') as apitypes.GameMode;
        if (this.params.second == null && this.params.first != null) {
            this.params.second = this.params.first;
            this.params.first = null;
        }
    }
    async setParamsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        const temp = helper.tools.commands.getButtonArgs(this.input.id);
        if (temp.error) {
            interaction.followUp({
                content: helper.vars.errors.paramFileMissing,
                flags: Discord.MessageFlags.Ephemeral,
                allowedMentions: { repliedUser: false }
            });
            helper.tools.commands.disableAllButtons(this.input.message);
            return;
        }
        this.params.type = temp.type as compareType;
        this.params.page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, this.input.buttonType);
        this.params.first = temp.compareFirst;
        this.params.second = temp.compareSecond;
        this.params.firstsearchid = temp.searchIdFirst;
        this.params.secondsearchid = temp.searchIdSecond;
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.type != null) {
            this.params.type = this.input.overrides.type as any;
        }
    }
    async execute() {
        await this.setParams();
        this.logInput();
        this.getOverrides();
        // do stuff

        let embedescription: string = null;
        if (this.params.page < 2 || typeof this.params.page != 'number' || isNaN(this.params.page)) {
            this.params.page = 1;
        }
        this.params.page--;
        let footer = '';
        let embed = new Discord.EmbedBuilder();
        try {
            if (this.params.second == null) {
                if (this.params.secondsearchid) {
                    const cuser = await helper.tools.data.searchUser(this.params.secondsearchid, true);
                    this.params.second = cuser.username;
                    if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                        if (this.input.type != 'button') {
                            throw new Error('Second user not found');
                        }
                        return;
                    }
                } else {
                    if (helper.tools.data.getPreviousId('user', `${this.input.message?.guildId ?? this.input.interaction?.guildId}`).id == false) {
                        throw new Error(`Could not find second user - ${helper.vars.errors.uErr.osu.profile.user_msp}`);
                    }
                    this.params.second = helper.tools.data.getPreviousId('user', `${this.input.message?.guildId ?? this.input.interaction?.guildId}`).id as string;
                }
            }
            if (this.params.first == null) {
                if (this.params.firstsearchid) {
                    const cuser = await helper.tools.data.searchUser(this.params.firstsearchid, true);
                    this.params.first = cuser.username;
                    if (this.params.mode == null) {
                        this.params.mode = cuser.gamemode;
                    }
                    if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                        if (this.input.type != 'button') {
                            throw new Error('First user not found');
                        }
                        return;
                    }
                } else {
                    throw new Error('first user not found');
                }
            }
            if (!this.params.first || this.params.first.length == 0 || this.params.first == '') {
                throw new Error('Could not find the first user');
            }
            if (!this.params.second || this.params.second.length == 0 || this.params.second == '') {
                throw new Error('Could not find the second user');
            }
            let firstuser: apitypes.User;
            let seconduser: apitypes.User;
            try {
                firstuser = await this.getProfile(this.params.first, this.params.mode);
                seconduser = await this.getProfile(this.params.second, this.params.mode);
            } catch (e) {
                return;
            }
            switch (this.params.type) {
                case 'profile': {
                    this.profiles(firstuser, seconduser, embed);
                }
                    break;
                case 'top': {
                    embed = await this.plays(firstuser, seconduser, embed);
                }
                    break;

                case 'mapscore': {
                    this.mapscores(firstuser, seconduser, embed);
                }
                    break;

            }
            helper.tools.data.writePreviousId('user', this.input.message?.guildId ?? this.input.interaction?.guildId, { id: `${seconduser.id}`, apiData: null, mods: null });
        } catch (error) {
            embed.setTitle('Error');
            embed.setFields([{
                name: 'Error',
                value: `${error}`,
                inline: false
            }]);
        }
        if (footer.length > 0) {
            embed.setFooter({
                text: footer
            });
        }

        if (embedescription != null && embedescription.length > 0) {
            embed.setDescription(embedescription);
        }
        this.ctn.embeds = [embed];
        this.send();
    }
    async top(user: string, mode: apitypes.GameMode) {
        let req: tooltypes.apiReturn<apitypes.Score[]>;
        if (helper.tools.data.findFile(this.input.id, 'firsttopdata') &&
            !('error' in helper.tools.data.findFile(this.input.id, 'firsttopdata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            req = helper.tools.data.findFile(this.input.id, 'firsttopdata');
        } else {
            req = await helper.tools.api.getScoresBest(user, mode, []);
        }

        if (req?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', user), false);
            return;
        }

        const topdata: apitypes.Score[] & apitypes.Error = req.apiData;
        if (topdata?.hasOwnProperty('error')) {
            if (this.input.type != 'button' && this.input.type != 'link') {
                throw new Error('could not fetch first user\'s top scores');
            }
            return;
        }
        return topdata;
    }
    profiles(firstuser: apitypes.User, seconduser: apitypes.User, embed: Discord.EmbedBuilder) {
        embed.setTitle('Comparing profiles')
            .setFields(
                [
                    {
                        name: `**${firstuser.username}**`,
                        value:
                            `**Rank:** ${helper.tools.calculate.separateNum(firstuser?.statistics.global_rank)}
**pp:** ${helper.tools.calculate.separateNum(firstuser?.statistics.pp)}
**Accuracy:** ${(firstuser?.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${helper.tools.calculate.separateNum(firstuser?.statistics.play_count)}
**Level:** ${helper.tools.calculate.separateNum(firstuser.statistics.level.current)}
`,
                        inline: true
                    },
                    {
                        name: `**${seconduser.username}**`,
                        value:
                            `**Rank:** ${helper.tools.calculate.separateNum(seconduser?.statistics.global_rank)}
**pp:** ${helper.tools.calculate.separateNum(seconduser?.statistics.pp)}
**Accuracy:** ${(seconduser?.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${helper.tools.calculate.separateNum(seconduser?.statistics.play_count)}
**Level:** ${helper.tools.calculate.separateNum(seconduser.statistics.level.current)}
`,
                        inline: true
                    },
                    {
                        name: `**Difference**`,
                        value:
                            `**Rank:** ${helper.tools.calculate.separateNum(Math.abs(firstuser.statistics.global_rank - seconduser.statistics.global_rank))}
**pp:** ${helper.tools.calculate.separateNum(Math.abs(firstuser?.statistics.pp - seconduser?.statistics.pp).toFixed(2))}
**Accuracy:** ${Math.abs((firstuser.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0) - (seconduser.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0)).toFixed(2)}%
**Playcount:** ${helper.tools.calculate.separateNum(Math.abs(firstuser.statistics.play_count - seconduser.statistics.play_count))}
**Level:** ${helper.tools.calculate.separateNum(Math.abs(firstuser.statistics.level.current - seconduser.statistics.level.current))}
`,
                        inline: false
                    }
                ]
            );
        return embed;
    }
    async getTopData(user: number, mode: apitypes.GameMode) {
        let req: tooltypes.apiReturn<apitypes.Score[]>;
        if (helper.tools.data.findFile(this.input.id, 'osutopdata') &&
            !('error' in helper.tools.data.findFile(this.input.id, 'osutopdata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            req = helper.tools.data.findFile(this.input.id, 'osutopdata');
        } else {
            req = await helper.tools.api.getScoresBest(user, mode, []);
        }

        if (req?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', user + ''), false);
            return;
        }
        const topdata: apitypes.Score[] & apitypes.Error = req.apiData;
        if (topdata?.hasOwnProperty('error')) {
            if (this.input.type != 'button' && this.input.type != 'link') {
                throw new Error('could not fetch first user\'s top scores');
            }
            return;
        }
        helper.tools.data.storeFile(req, this.input.id, 'osutopdata');
        return topdata;
    }
    async plays(firstuser: apitypes.User, seconduser: apitypes.User, embed: Discord.EmbedBuilder) {
        let firsttopdata: apitypes.Score[];
        let secondtopdata: apitypes.Score[];
        try {
            firsttopdata = await this.getTopData(firstuser.id, this.params.mode);
            secondtopdata = await this.getTopData(seconduser.id, this.params.mode);
        } catch (e) {
            embed.setDescription('There was an error fetching scores');
            return;
        }

        const filterfirst = [];
        //filter so that scores that have a shared beatmap id with the second user are kept
        for (let i = 0; i < firsttopdata.length; i++) {
            if (secondtopdata.find(score => score.beatmap.id == firsttopdata[i].beatmap.id)) {
                filterfirst.push(firsttopdata[i]);
            }
        }
        filterfirst.sort((a, b) => b.pp - a.pp);
        const arrscore = [];

        for (let i = 0; i < filterfirst.length && i < 5; i++) {
            const firstscore: apitypes.Score = filterfirst[i + (this.params.page * 5)];
            if (!firstscore) break;
            const secondscore: apitypes.Score = secondtopdata.find(score => score.beatmap.id == firstscore.beatmap.id);
            if (secondscore == null) break;
            const format = (score: apitypes.Score) =>
                `\`${score.pp.toFixed(2)}pp | ${(score.accuracy * 100).toFixed(2)}% ${score.mods.length > 0 ? '| +' + score.mods.map(x => x.acronym).join('') : ''}`;
            const firstscorestr = format(firstscore);
            const secondscorestr = format(secondscore);
            arrscore.push(
                `
**[\`${firstscore.beatmapset.title} [${firstscore.beatmap.version}]\`](https://osu.ppy.sh/b/${firstscore.beatmap.id})**
\`${firstuser.username.padEnd(30, ' ').substring(0, 30)} | ${seconduser.username.padEnd(30, ' ').substring(0, 30)}\`
${firstscorestr.substring(0, 30)} || ${secondscorestr.substring(0, 30)}`
            );
        }
        let fields = [];
        for (const score of arrscore) {
            fields.push({
                name: helper.vars.defaults.invisbleChar,
                value: score,
                inline: false
            });
        }
        helper.tools.commands.storeButtonArgs(this.input.id, {
            type: 'top',
            page: this.params.page + 1,
            maxPage: Math.ceil(filterfirst.length / 5),
            compareFirst: this.params.first,
            compareSecond: this.params.second,
            searchIdFirst: this.params.firstsearchid,
            searchIdSecond: this.params.secondsearchid
        });
        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons(this.name, this.commanduser, this.input.id);
        this.ctn.components = [pgbuttons];
        embed.setTitle('Comparing Top Scores')
            .setDescription(`**[${firstuser.username}](https://osu.ppy.sh/users/${firstuser.id})** and **[${seconduser.username}](https://osu.ppy.sh/users/${seconduser.id})** have ${filterfirst.length} shared scores`)
            .setFields(fields)
            .setFooter({ text: `${this.params.page + 1}/${Math.ceil(filterfirst.length / 5)}` });
        return embed;

    }
    mapscores(firstuser: apitypes.User, seconduser: apitypes.User, embed: Discord.EmbedBuilder) {
        embed.setTitle('Comparing map scores')
            .setFields([
                {
                    name: `**${firstuser.username}**`,
                    value: '',
                    inline: true
                },
                {
                    name: `**${seconduser.username}**`,
                    value: 's',
                    inline: true
                },
                {
                    name: `**Difference**`,
                    value: 'w',
                    inline: false
                },
            ]);
        return embed;
    }
}

export class Set extends OsuCommand {
    declare protected params: {
        name: string;
        mode: apitypes.GameMode;
        skin: string;
    };

    constructor() {
        super();
        this.name = 'Set';
        this.params = {
            name: null,
            mode: 'osu',
            skin: null,
        };
    }
    async setParamsMsg() {
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }

        if (this.input.args.includes('-skin')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-skin', 'string', this.params.skin, true);
            this.params.skin = temp.value;
            this.input.args = temp.newArgs;
        }

        this.params.name = this.input.args.join(' ');

    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.name = interaction.options.getString('user');
        this.params.mode = interaction.options.getString('mode') as apitypes.GameMode;
        this.params.skin = interaction.options.getString('skin');
    }
    getOverrides(): void {
        if (this.input.overrides.type != null) {
            switch (this.input.overrides.type) {
                case 'mode':
                    [this.params.mode, this.params.name] = [this.params.name as apitypes.GameMode, this.params.mode];
                    break;
                case 'skin':
                    [this.params.skin, this.params.name] = [this.params.name, this.params.skin];
            }
        }
    }
    async execute() {
        await this.setParams();
        this.logInput();
        this.getOverrides();
        this.ctn.content = 'null';
        // do stuff
        if (this.params.mode) {
            const thing = helper.tools.other.modeValidatorAlt(this.params.mode);
            this.params.mode = thing.mode;
            if (thing.isincluded == false) {
                this.voidcontent();
                this.ctn.content = helper.vars.errors.uErr.osu.set.mode;
                await this.send();
                return;
            }
        }

        let updateRows: {
            userid: string | number,
            osuname?: string,
            mode?: string,
            skin?: string,
        } = {
            userid: this.commanduser.id
        };
        updateRows = {
            userid: this.commanduser.id,
        };
        if (this.params.name != null) {
            updateRows['osuname'] = this.params.name;
        }
        if (this.params.mode != null) {
            updateRows['mode'] = this.params.mode;
        }
        if (this.params.skin != null) {
            updateRows['skin'] = this.params.skin;
        }
        const findname: tooltypes.dbUser = await helper.vars.userdata.findOne({ where: { userid: this.commanduser.id } }) as any;
        if (findname == null) {
            try {
                await helper.vars.userdata.create({
                    userid: this.commanduser.id,
                    osuname: this.params.name ?? 'undefined',
                    mode: this.params.mode ?? 'osu',
                    skin: this.params.skin ?? 'Default - https://osu.ppy.sh/community/forums/topics/129191?n=117',
                    location: '',
                    timezone: '',
                });
                this.ctn.content = 'Added to database';
                if (this.params.name) {
                    this.ctn.content += `\nSet your username to \`${this.params.name}\``;
                }
                if (this.params.mode) {
                    this.ctn.content += `\nSet your mode to \`${this.params.mode}\``;
                }
                if (this.params.skin) {
                    this.ctn.content += `\nSet your skin to \`${this.params.skin}\``;
                }
            } catch (error) {
                this.ctn.content = 'There was an error trying to update your settings';
                helper.tools.log.commandErr('Database error (create) ->' + error, this.input.id, 'osuset', this.input.message, this.input.interaction);
            }
        } else {
            const affectedRows = await helper.vars.userdata.update(
                updateRows,
                { where: { userid: this.commanduser.id } }
            );

            if (affectedRows.length > 0 || affectedRows[0] > 0) {
                this.ctn.content = 'Updated your settings:';
                if (this.params.name) {
                    this.ctn.content += `\nSet your username to \`${this.params.name}\``;
                }
                if (this.params.mode) {
                    this.ctn.content += `\nSet your mode to \`${this.params.mode}\``;
                }
                if (this.params.skin) {
                    this.ctn.content += `\nSet your skin to \`${this.params.skin}\``;
                }
            } else {
                this.ctn.content = 'There was an error trying to update your settings';
                helper.tools.log.commandErr('Database error (update) ->' + affectedRows, this.input.id, 'osuset', this.input.message, this.input.interaction);
            }
        }

        this.send();
    }
}

export class RankPP extends OsuCommand {
    declare protected params: {
        value: number;
        mode: apitypes.GameMode;
        get: 'rank' | 'pp';
    };
    constructor() {
        super();
        this.name = 'RankPP';
        this.params = {
            value: 100,
            mode: 'osu',
            get: 'pp'
        };
    }
    async setParamsMsg() {
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }
        this.params.value = +(this.input.args[0] ?? 100);
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.value = interaction.options.getInteger('value') ?? 100;
        this.params.mode = interaction.options.getString('mode') as apitypes.GameMode ?? 'osu';
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        this.params.get = this.input?.overrides?.type as 'pp' | 'rank' ?? 'pp';
    }
    async execute() {
        await this.setParams();
        this.getOverrides();
        this.logInput();
        // do stuff

        const Embed = new Discord.EmbedBuilder()
            .setTitle('null')
            .setDescription('null');

        let output: string;
        let returnval: {
            value: number;
            isEstimated: boolean;
        } = null;
        switch (this.params.get) {
            case 'pp': {
                returnval = await helper.tools.data.getRankPerformance('pp->rank', this.params.value, this.params.mode);
                output = 'approx. rank #' + helper.tools.calculate.separateNum(Math.ceil(returnval.value));
                Embed
                    .setTitle(`Approximate rank for ${this.params.value}pp`);
            }
                break;
            case 'rank': {
                returnval = await helper.tools.data.getRankPerformance('rank->pp', this.params.value, this.params.mode);
                output = 'approx. ' + helper.tools.calculate.separateNum(returnval.value.toFixed(2)) + 'pp';

                Embed
                    .setTitle(`Approximate performance for rank #${this.params.value}`);
            }
                break;
        };

        const dataSizetxt = await helper.vars.statsCache.count();

        Embed
            .setDescription(`${output}\n${helper.vars.emojis.gamemodes[this.params.mode ?? 'osu']}\n${returnval.isEstimated ? `Estimated from ${dataSizetxt} entries.` : 'Based off matching / similar entry'}`);

        this.ctn.embeds = [Embed];

        this.send();
    }
}

export class Saved extends OsuCommand {
    declare protected params: {
        searchid: string;
        user: string;
    };
    show: {
        name: boolean,
        mode: boolean,
        skin: boolean,
    };
    overrideTitle: string;
    constructor() {
        super();
        this.name = 'Saved';
        this.params = {
            searchid: null,
            user: null,
        };
        this.show = {
            name: true,
            mode: true,
            skin: true,
        };
    }
    async setParamsMsg() {
        this.params.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        this.params.user = this.input.args.join(' ')?.replaceAll('"', '');
        if (!this.input.args[0] || this.input.args[0].includes(this.params.searchid)) {
            this.params.user = null;
        }
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        switch (this.input?.overrides?.type) {
            case 'username':
                this.show = {
                    name: true,
                    mode: false,
                    skin: false,
                };
                break;
            case 'mode':
                this.show = {
                    name: false,
                    mode: true,
                    skin: false,
                };
                break;
            case 'skin':
                this.show = {
                    name: false,
                    mode: false,
                    skin: true,
                };
                break;
        }
    }
    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff
        let cuser: any = {
            osuname: 'null',
            mode: 'osu! (Default)',
            skin: 'osu! classic'
        };

        let fr;
        if (this.params.user == null) {
            fr = helper.vars.client.users.cache.get(this.params.searchid)?.username ?? 'null';
        }

        const Embed = new Discord.EmbedBuilder()
            .setTitle(`${this.params.user != null ? this.params.user : fr}'s ${this.overrideTitle ?? 'saved settings'}`);

        if (this.params.user == null) {
            cuser = await helper.vars.userdata.findOne({ where: { userid: this.params.searchid } });
        } else {
            const allUsers: tooltypes.dbUser[] = await helper.vars.userdata.findAll() as any;

            cuser = allUsers.filter(x => (`${x.osuname}`.trim().toLowerCase() == `${this.params.user}`.trim().toLowerCase()))[0];
        }

        if (cuser) {
            const fields = [];
            if (this.show.name) {
                fields.push({
                    name: 'Username',
                    value: `${cuser.osuname && cuser.mode.length > 1 ? cuser.osuname : 'undefined'}`,
                    inline: true
                });
            }
            if (this.show.mode) {
                fields.push({
                    name: 'Mode',
                    value: `${cuser.mode && cuser.mode.length > 1 ? cuser.mode : 'osu (default)'}`,
                    inline: true
                });
            }
            if (this.show.skin) {
                fields.push({
                    name: 'Skin',
                    value: `${cuser.skin && cuser.skin.length > 1 ? cuser.skin : 'None'}`,
                    inline: true
                });
            }
            Embed.addFields(fields);
        } else {
            Embed.setDescription('No saved settings found');
        }

        this.ctn.embeds = [Embed];
        this.send();
    }
}

export class WhatIf extends OsuCommand {
    declare protected params: {
        user: string;
        searchid: string;
        pp: number;
        mode: apitypes.GameMode;
    };
    constructor() {
        super();
        this.name = 'WhatIf';
        this.params = {
            user: null,
            searchid: null,
            pp: null,
            mode: null,
        };
    }
    async setParamsMsg() {
        this.params.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        if (!isNaN(+this.input.args[0])) {
            this.params.pp = +this.input.args[0];
        }
        this.input.args.forEach(x => {
            if (!isNaN(+x)) {
                this.params.pp = +x;
            }
        });
        for (const x of this.input.args) {
            if (!isNaN(+x)) {
                this.params.pp = +x;
                break;
            }
        }
        if (this.params.pp && !isNaN(this.params.pp)) {
            this.input.args.splice(this.input.args.indexOf(this.params.pp + ''), 1);
        }

        const usertemp = helper.tools.commands.fetchUser(this.input.args);
        this.input.args = usertemp.args;
        this.params.user = usertemp.id;
        if (usertemp.mode && !this.params.mode) {
            this.params.mode = usertemp.mode;
        }
        if (!this.params.user || this.params.user.includes(this.params.searchid)) {
            this.params.user = null;
        }
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.searchid = this.commanduser.id;
        this.params.user = interaction.options.getString('user');
        this.params.mode = interaction.options.getString('mode') as apitypes.GameMode;
        this.params.pp = interaction.options.getNumber('pp');
    }
    async setParamsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.params.searchid = this.commanduser.id;
    }
    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff

        if (!this.params.pp || isNaN(this.params.pp) || this.params.pp > 10000) {
            this.input.message.reply("Please define a valid PP value to calculate");
        }

        {
            const t = await this.validUser(this.params.user, this.params.searchid, this.params.mode);
            this.params.user = t.user;
            this.params.mode = t.mode;
        }

        let osudata: apitypes.User;
        try {
            osudata = await this.getProfile(this.params.user, this.params.mode);
        } catch (e) {
            return;
        }
        if (this.params.mode == null) {
            this.params.mode = osudata.playmode;
        }

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-User-${this.name}-any-${this.input.id}-${osudata.id}+${osudata.playmode}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );

        let osutopdata: apitypes.Score[];
        try {
            osutopdata = await this.getTopData(osudata.id, this.params.mode);
        } catch (e) {
            this.ctn.content = 'There was an error trying to fetch top scores';
            this.send();
            return;
        }

        const pparr = osutopdata.slice().map(x => x.pp);
        pparr.push(this.params.pp);
        pparr.sort((a, b) => b - a);
        const ppindex = pparr.indexOf(this.params.pp);

        const weight = helper.tools.calculate.findWeight(ppindex);

        const newTotal: number[] = [];

        for (let i = 0; i < pparr.length; i++) {
            newTotal.push(pparr[i] * helper.tools.calculate.findWeight(i));
        }

        const total = newTotal.reduce((a, b) => a + b, 0);
        //     416.6667 * (1 - 0.9994 ** osudata.statistics.play_count);

        const newBonus = [];
        for (let i = 0; i < osutopdata.length; i++) {
            newBonus.push(osutopdata[i].weight.pp/*  ?? (osutopdata[i].pp * osufunc.findWeight(i)) */);
        }

        const bonus = osudata.statistics.pp - newBonus.reduce((a, b) => a + b, 0);

        const guessrank = await helper.tools.data.getRankPerformance('pp->rank', (total + bonus), `${helper.tools.other.modeValidator(this.params.mode)}`,);

        const embed = new Discord.EmbedBuilder()
            .setTitle(`What if ${osudata.username} gained ${this.params.pp}pp?`)
            .setColor(helper.vars.colours.embedColour.query.dec)
            .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`);
        helper.tools.formatter.userAuthor(osudata, embed);
        if (ppindex + 1 > 100) {
            embed.setDescription(
                `A ${this.params.pp}pp score would be outside of their top 100 plays and be weighted at 0%.
    Their total pp and rank would not change.
    `);
        } else {
            embed.setDescription(
                `A ${this.params.pp}pp score would be their **${helper.tools.calculate.toOrdinal(ppindex + 1)}** top play and would be weighted at **${(weight * 100).toFixed(2)}%**.
    Their pp would change by **${Math.abs((total + bonus) - osudata.statistics.pp).toFixed(2)}pp** and their new total pp would be **${(total + bonus).toFixed(2)}pp**.
    Their new rank would be **${Math.round(guessrank.value)}** (+${Math.round(osudata?.statistics?.global_rank - guessrank.value)}).
    `
            );
        }

        this.ctn.embeds = [embed];
        this.ctn.components = [buttons];
        this.send();
    }
    async getTopData(user: number, mode: apitypes.GameMode) {
        let req: tooltypes.apiReturn<apitypes.Score[]>;
        if (helper.tools.data.findFile(this.input.id, 'osutopdata') &&
            !('error' in helper.tools.data.findFile(this.input.id, 'osutopdata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            req = helper.tools.data.findFile(this.input.id, 'osutopdata');
        } else {
            req = await helper.tools.api.getScoresBest(user, mode, []);
        }

        if (req?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', user+''), false);
            return;
        }
        const topdata: apitypes.Score[] & apitypes.Error = req.apiData;
        if (topdata?.hasOwnProperty('error')) {
            if (this.input.type != 'button' && this.input.type != 'link') {
                throw new Error('could not fetch first user\'s top scores');
            }
            return;
        }
        helper.tools.data.storeFile(req, this.input.id, 'osutopdata');
        return topdata;
    }
}