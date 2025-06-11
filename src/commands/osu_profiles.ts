import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';
import { OsuCommand } from './command.js';

export class Badges extends OsuCommand {
    declare protected params: {
        user: string;
        searchid: string;
    };
    constructor() {
        super();
        this.name = 'Badges';
        this.params = {
            user: null,
            searchid: null,
        };
    }
    async setParamsMsg() {
        this.params.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        const usertemp = helper.tools.commands.fetchUser(this.input.args);
        this.input.args = usertemp.args;
        this.params.user = usertemp.id;
        if (!this.params.user || this.params.user.includes(this.params.searchid)) {
            this.params.user = null;
        }

    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.searchid = this.commanduser.id;
        this.params.user = interaction.options.getString('user');
    }
    async setParamsBtn() {
        if (!this.input.message.embeds[0]) return;
        this.params.searchid = this.commanduser.id;
    }
    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff

        {
            const t = await this.validUser(this.params.user, this.params.searchid, 'osu');
            this.params.user = t.user;
        }

        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        let osudata: apitypes.User;

        try {
            const t = await this.getProfile(this.params.user, 'osu');
            osudata = t;
        } catch (e) {
            return;
        }

        const cmdbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-User-${this.name}-any-${this.input.id}-${osudata.id}+${osudata.playmode}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );

        const badgecount = osudata?.badges?.length ?? 0;

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${osudata.username}s Badges`)
            .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
            .setDescription(
                'Current number of badges: ' + badgecount
            );
        helper.tools.formatter.userAuthor(osudata, embed);

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
        this.ctn.embeds = [embed];
        this.ctn.components = [cmdbuttons];
        this.send();
    }
}

export class BadgeWeightSeed extends OsuCommand {
    declare protected params: {
        user: string;
        searchid: string;
    };
    constructor() {
        super();
        this.name = 'BadgeWeightSeed';
        this.params = {
            user: null,
            searchid: null,
        };
    }
    async setParamsMsg() {
        this.params.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        const usertemp = helper.tools.commands.fetchUser(this.input.args);
        this.input.args = usertemp.args;
        this.params.user = usertemp.id;
        if (!this.params.user || this.params.user.includes(this.params.searchid)) {
            this.params.user = null;
        }

    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.searchid = this.commanduser.id;
        this.params.user = interaction.options.getString('user');
    }
    async setParamsBtn() {
        if (!this.input.message.embeds[0]) return;
        this.params.searchid = this.commanduser.id;
    }
    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff

        {
            const t = await this.validUser(this.params.user, this.params.searchid, 'osu');
            this.params.user = t.user;
        }

        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        let osudata: apitypes.User;

        try {
            const t = await this.getProfile(this.params.user, 'osu');
            osudata = t;
        } catch (e) {
            return;
        }

        const cmdbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-User-${this.name}-any-${this.input.id}-${osudata.id}+${osudata.playmode}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );

        const badgecount = osudata?.badges?.length ?? 0;

        const embed = new Discord.EmbedBuilder()
            .setTitle(`Badge weighting for ${osudata.username}`)
            .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
            .setDescription(
                'Current number of badges: ' + badgecount
            )
            .addFields([
                {
                    name: `${badgecount == 1 ? badgecount + ' badge' : badgecount + ' badges'}`,
                    value: `${Math.floor(this.bwsF(badgecount, osudata))}`,
                    inline: true
                },
                {
                    name: `${badgecount + 1 == 1 ? badgecount + 1 + ' badge' : badgecount + 1 + ' badges'}`,
                    value: `${Math.floor(this.bwsF(badgecount + 1, osudata))}`,
                    inline: true
                },
                {
                    name: `${badgecount + 2} badges`,
                    value: `${Math.floor(this.bwsF(badgecount + 2, osudata))}`,
                    inline: true
                },
            ]);
        helper.tools.formatter.userAuthor(osudata, embed);

        this.ctn.embeds = [embed];
        this.ctn.components = [cmdbuttons];
        this.send();
    }

    bwsF(badgenum: number, osudata: apitypes.User) {
        return badgenum > 0 ?
            osudata.statistics.global_rank ** (0.9937 ** (badgenum ** 2)) :
            osudata.statistics.global_rank;
    }
}

export class Leaderboard extends OsuCommand {
    declare protected params: {
        page: number;
        mode: apitypes.GameMode;
        id: string;
    };
    constructor() {
        super();
        this.name = 'Leaderboard';
        this.params = {
            page: 0,
            mode: 'osu',
            id: null,
        };
    }
    async setParamsMsg() {
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }
        this.input.args = helper.tools.commands.cleanArgs(this.input.args);
        this.params.id = this.input.args[0];
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.id = interaction.options.getString('id');
        const gamemode = interaction.options.getString('mode');
        if (!gamemode || gamemode == 'osu' || gamemode == 'o' || gamemode == '0' || gamemode == 'standard' || gamemode == 'std') {
            this.params.mode = 'osu';
        }
        if (gamemode == 'taiko' || gamemode == 't' || gamemode == '1' || gamemode == 'drums') {
            this.params.mode = 'taiko';
        }
        if (gamemode == 'fruits' || gamemode == 'c' || gamemode == '2' || gamemode == 'catch' || gamemode == 'ctb') {
            this.params.mode = 'fruits';
        }
        if (gamemode == 'mania' || gamemode == 'm' || gamemode == '3' || gamemode == 'piano') {
            this.params.mode = 'mania';
        }
    }
    async setParamsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.params.id = this.input.message.embeds[0].author.name;
        this.params.mode = this.input.message.embeds[0].footer.text.split(' | ')[0] as apitypes.GameMode;

        this.params.page = 0;
        if (this.input.buttonType == 'BigLeftArrow') {
            this.params.page = 1;
        }
        const pageFinder = this.input.message.embeds[0].footer.text.split(' | ')[1].split('Page ')[1];
        switch (this.input.buttonType) {
            case 'LeftArrow':
                this.params.page = +pageFinder.split('/')[0] - 1;
                break;
            case 'RightArrow':
                this.params.page = +pageFinder.split('/')[0] + 1;
                break;
            case 'BigRightArrow':
                this.params.page = +pageFinder.split('/')[1];
                break;
        }

        if (this.params.page < 2) {
            this.params.page == 1;
        }
    }
    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff
        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons(this.name, this.commanduser, this.input.id);

        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        if (this.params.page < 2 || typeof this.params.page != 'number') {
            this.params.page = 1;
        }
        this.params.page--;
        let global = false;
        let guild = this.input.message.guild ?? this.input.interaction.guild;
        if (this.params.id == 'global') {
            global = true;
        }
        if (typeof + this.params.id == 'number') {
            const tempguild = helper.vars.client.guilds.cache.get(this.params.id);
            if (tempguild) {
                const isThere = tempguild.members.cache.has(this.commanduser.id);
                guild = isThere ? tempguild : guild;
            }
        }

        const name = global ? "Global SSoB leaderboard" :
            `Server leaderboard for ${guild?.name ?? "null"}`;

        const serverlb = new Discord.EmbedBuilder()
            .setAuthor({ name: `${this.params.id ?? guild.id}` })
            .setColor(helper.vars.colours.embedColour.userlist.dec)
            .setTitle(name);
        const userids = await helper.vars.userdata.findAll();
        const useridsarraylen = await helper.vars.userdata.count();
        let rtxt = `\n`;
        const rarr = [];
        let cache: Discord.Collection<string, Discord.GuildMember> | Discord.Collection<string, Discord.User>;

        if (global) {
            cache = helper.vars.client.users.cache;
        } else {
            cache = guild.members.cache;
        }
        for (let i = 0; i < useridsarraylen; i++) {
            const user: tooltypes.dbUser = userids[i].dataValues as any;
            if (global) {
                (cache as Discord.Collection<string, Discord.User>).forEach(member => {
                    if (`${member.id}` == `${user.userid}` && user != null) {
                        this.addUser({ id: member.id, name: member.username }, user);
                    }
                });
            } else {
                (cache as Discord.Collection<string, Discord.GuildMember>).forEach(member => {
                    if (`${member.id}` == `${user.userid}` && user != null) {
                        this.addUser({ id: member.user.id, name: member.displayName }, user);
                    }
                });
            }
        }

        const another = rarr.slice().sort((b, a) => b.rank - a.rank); //for some reason this doesn't sort even tho it does in testing
        rtxt = `\`Rank    Discord           osu!              Rank       Acc      pp       `;
        const pageOffset = this.params.page * 10;
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
        serverlb.setFooter({ text: this.params.mode + ` | Page ${this.params.page + 1}/${Math.ceil(rarr.length / 10)}` });
        // const endofcommand = new Date().getTime();
        // const timeelapsed = endofcommand - input.currentDate.getTime();

        if (this.params.page < 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }
        if (this.params.page + 1 >= Math.ceil(rarr.length / 10)) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }

        this.ctn.embeds = [serverlb];
        this.ctn.components = [pgbuttons];

        this.send();
    }
    rarr: {
        discname: string;
        osuname: string;
        rank: string;
        acc: string;
        pp: string;
    }[];
    addUser(member: { id: string, name: string; }, user: tooltypes.dbUser) {
        if (`${member.id}` == `${user.userid}`) {
            if (user != null) {
                let acc: string | number;
                let pp: string | number;
                acc = user[`${this.params.mode}acc`];
                if (isNaN(+acc) || acc == null) {
                    return;
                } else {
                    acc = user.osuacc.toFixed(2);
                }
                pp = user[`${this.params.mode}pp`];
                if (isNaN(+pp) || pp == null) {
                    return;
                } else {
                    pp = Math.floor(user.osupp);
                }
                const rank = user[`${this.params.mode}rank`];
                if (isNaN(+rank) || rank == null) {
                    return;
                }
                this.rarr.push(
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
}

export class Ranking extends OsuCommand {
    declare protected params: {
        country: string;
        mode: apitypes.GameMode;
        type: apitypes.RankingType;
        page: number;
        spotlight: number;
        parse: boolean;
        parseId: string;
    };
    constructor() {
        super();
        this.name = 'Ranking';
        this.params = {
            country: 'ALL',
            mode: 'osu',
            type: 'performance',
            page: 0,
            spotlight: null,
            parse: false,
            parseId: null,
        };

    }
    async setParamsMsg() {
        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, this.input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.params.page = pageArgFinder.output;
            this.input.args = pageArgFinder.args;
        }
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }
        if (this.input.args.includes('-parse')) {
            this.params.parse = true;
            const temp = helper.tools.commands.parseArg(this.input.args, '-parse', 'number', 1, null, true);
            this.params.parseId = temp.value;
            this.input.args = temp.newArgs;
        }

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        this.input.args[0] && this.input.args[0].length == 2 ? this.params.country = this.input.args[0].toUpperCase() : this.params.country = 'ALL';
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.country = interaction.options.getString('country') ?? 'ALL';
        this.params.mode = (interaction.options.getString('mode') ?? 'osu') as apitypes.GameMode;
        this.params.type = (interaction.options.getString('type') ?? 'performance') as apitypes.RankingType;
        this.params.page = interaction.options.getInteger('page') ?? 0;
        this.params.spotlight = interaction.options.getInteger('spotlight') ?? undefined;
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
        this.params.page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, this.input.buttonType);
        this.params.country = temp.country;
        this.params.mode = temp.mode;
        this.params.type = temp.rankingtype;
        if (this.params.type == 'charts') {
            this.params.spotlight = +temp.spotlight;
        }
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page) {
            this.params.page = this.input.overrides.page;
        }
    }
    async execute() {
        await this.setParams();
        this.logInput();
        this.getOverrides();
        // do stuff
        this.params.mode = helper.tools.other.modeValidator(this.params.mode);
        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons(this.name, this.commanduser, this.input.id);

        if (this.params.page < 2 || typeof this.params.page != 'number' || isNaN(this.params.page)) {
            this.params.page = 1;
        }
        this.params.page--;

        const extras = [];
        if (this.params.country != 'ALL') {
            // validate country
            if (!helper.tools.other.validCountryCodeA2(this.params.country)) {
                this.voidcontent();
                this.ctn.content = `Invalid country code. Must be a valid [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) code.`;
                this.ctn.edit = true;
                await this.send();
                return;
            }
            if (this.params.type == 'performance') {
                extras.push(`country=${this.params.country}`);
            }
        }
        if (this.params.type == 'charts' && !isNaN(+this.params.spotlight)) {
            extras.push(`spotlight=${this.params.spotlight}`);

        }

        let rankingdataReq: tooltypes.apiReturn<apitypes.Rankings>;
        if (helper.tools.data.findFile(this.input.id, 'rankingdata') &&
            this.input.type == 'button' &&
            !('error' in helper.tools.data.findFile(this.input.id, 'rankingdata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            rankingdataReq = helper.tools.data.findFile(this.input.id, 'rankingdata');
        } else {
            rankingdataReq = await helper.tools.api.getRankings(this.params.mode, this.params.type, extras);
        }
        helper.tools.data.storeFile(rankingdataReq, this.input.id, 'rankingdata');

        const rankingdata: apitypes.Rankings = rankingdataReq.apiData;
        if (rankingdataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.rankings, false);
            return;
        }

        if (rankingdata?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.rankings, true);
            return;
        }


        try {
            helper.tools.data.debug(rankingdataReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'rankingData');
        } catch (e) {
            return;
        }
        if (rankingdata.ranking.length == 0) {
            this.voidcontent();
            this.ctn.content = `No data found`;
            this.ctn.edit = true;
            await this.send();
            return;
        }

        let ifchart = '';
        if (this.params.type == 'charts') {
            ifchart = `[${rankingdata.spotlight.name}](https://osu.ppy.sh/rankings/${this.params.mode}/charts?spotlight=${rankingdata.spotlight.id})`;
        }

        if (this.input.buttonType == null) {
            helper.tools.data.userStatsCache(rankingdata.ranking, helper.tools.other.modeValidator(this.params.mode), 'Stat');
        }

        if (this.params.parse) {
            let pid = parseInt(this.params.parseId) - 1;
            if (pid < 0) {
                pid = 0;
            }
            if (pid > rankingdata.ranking.length) {
                pid = rankingdata.ranking.length - 1;
            }

            this.input.overrides = {
                mode: this.params.mode,
                id: rankingdata?.ranking[pid]?.user.id,
                commanduser: this.commanduser,
                commandAs: this.input.type
            };
            if (this.input.overrides.id == null || typeof this.input.overrides.id == 'undefined') {
                await helper.tools.commands.errorAndAbort(this.input, 'osu', true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
                return;
            }
            this.input.type = 'other';
            const cmd = new Profile();
            cmd.setInput(this.input);
            await cmd.execute();
            return;
        }

        const embed = new Discord.EmbedBuilder()
            .setFooter({
                text: `${this.params.page + 1}/${Math.ceil(rankingdata.ranking.length / 5)}`
            }).setTitle(this.params.country != 'ALL' ?
                `${this.params.mode == 'osu' ? 'osu!' : helper.tools.formatter.toCapital(this.params.mode)} ${helper.tools.formatter.toCapital(this.params.type)} Rankings for ${this.params.country}` :
                `Global ${this.params.mode == 'osu' ? 'osu!' : helper.tools.formatter.toCapital(this.params.mode)} ${helper.tools.formatter.toCapital(this.params.type)} Ranking`)
            .setColor(helper.vars.colours.embedColour.userlist.dec)
            .setDescription(`${ifchart}\n`);
        this.params.country != 'ALL' ?
            embed.setThumbnail(`https://osuhelper.vars.argflags.omkserver.nl${this.params.country}`)
            : '';

        if (this.params.page > Math.ceil(rankingdata.ranking.length / 5)) {
            this.params.page = Math.ceil(rankingdata.ranking.length / 5);
        }
        helper.tools.calculate.numberShorthand;
        for (let i = 0; i < 5 && i + (this.params.page * 5) < rankingdata.ranking.length; i++) {
            const curuser = rankingdata.ranking[i + (this.params.page * 5)];
            if (!curuser) break;
            embed.addFields(
                [
                    {
                        name: `${i + 1 + (this.params.page * 5)}`,
                        value:
                            `:flag_${curuser.user.country_code.toLowerCase()}: [${curuser.user.username}](https://osu.ppy.sh/users/${curuser.user.id}/${this.params.mode})
    #${curuser.global_rank == null ?
                                '---' :
                                helper.tools.calculate.separateNum(curuser.global_rank)
                            }
    Score: ${curuser.total_score == null ? '---' : helper.tools.calculate.numberShorthand(curuser.total_score)} (${curuser.ranked_score == null ? '---' : helper.tools.calculate.numberShorthand(curuser.ranked_score)} ranked)
    ${curuser.hit_accuracy == null ? '---' : curuser.hit_accuracy.toFixed(2)}% | ${curuser.pp == null ? '---' : helper.tools.calculate.separateNum(curuser.pp)}pp | ${curuser.play_count == null ? '---' : helper.tools.calculate.separateNum(curuser.play_count)} plays
    `
                        ,
                        inline: false
                    }
                ]
            );
        }
        helper.tools.commands.storeButtonArgs(this.input.id, {
            page: this.params.page + 1,
            maxPage: Math.ceil(rankingdata.ranking.length / 5),
            country: this.params.country,
            mode: this.params.mode,
            rankingtype: this.params.type,
            spotlight: this.params.spotlight
        });

        if (this.params.page + 1 >= Math.ceil(rankingdata.ranking.length / 5)) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }
        if (this.params.page == 0) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }

        this.ctn.embeds = [embed];
        this.ctn.components = [pgbuttons];
        this.send();
    }
}

export class Profile extends OsuCommand {
    declare protected params: {
        user: string;
        mode: apitypes.GameMode;
        graphonly: boolean;
        detailed: number;
        searchid: string;
    };
    constructor() {
        super();
        this.name = 'Profile';
        this.params = {
            user: null,
            mode: null,
            graphonly: false,
            detailed: 1,
            searchid: null,
        };
    }
    async setParamsMsg() {
        this.params.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        const detailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.details, this.input.args, false, null, false, false);
        if (detailArgFinder.found) {
            this.params.detailed = 2;
            this.input.args = detailArgFinder.args;
        }
        const graphArgFinder = helper.tools.commands.matchArgMultiple(['-g', '-graph',], this.input.args, false, null, false, false);
        if (graphArgFinder.found) {
            this.params.graphonly = true;
            this.input.args = graphArgFinder.args;
        }
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

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
        this.params.searchid = (interaction?.member?.user ?? interaction?.user).id;

        this.params.user = interaction.options.getString('user');
        this.params.detailed = interaction.options.getBoolean('detailed') ? 2 : 1;
        this.params.mode = interaction.options.getString('mode') as apitypes.GameMode;
    }
    async setParamsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.params.searchid = this.commanduser.id;

        this.params.user = this.input.message.embeds[0].url.split('users/')[1].split('/')[0];
        this.params.mode = this.input.message.embeds[0].url.split('users/')[1].split('/')[1] as apitypes.GameMode;

        switch (this.input.buttonType) {
            case 'Detail1':
                this.params.detailed = 1;
                break;
            case 'Detail2':
                this.params.detailed = 2;
                break;
            case 'Graph':
                this.params.graphonly = true;
                break;
        }

        if (this.input.buttonType == 'Detail2') {
            this.params.detailed = 2;
        }
        if (this.input.buttonType == 'Detail1') {
            this.params.detailed = 1;
        }
        if (this.input.buttonType == 'Refresh') {
            if (this.input.message.embeds[0].fields[0]) {
                this.params.detailed = 2;
            } else {
                this.params.detailed = 1;
            }
        }

        if (!this.input.message.embeds[0].title) {
            this.params.graphonly = true;
        }
    }
    async setParamsLink() {
        const usertemp = helper.tools.commands.fetchUser([this.input.message.content]);
        this.params.user = usertemp.id;
        if (usertemp.mode && !this.params.mode) {
            this.params.mode = usertemp.mode;
        }
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.mode) {
            this.params.mode = this.input.overrides.mode;
        }
        if (this.input.overrides.id) {
            this.params.user = this.input.overrides.id + '';
        }
        if (this.input.overrides.commandAs) {
            this.input.type = this.input.overrides.commandAs;
        }
        if (this.input.overrides.commanduser) {
            this.commanduser = this.input.overrides.commanduser;
            this.ctn.content = `Requested by <@${this.commanduser.id}>`;
        }
    }
    async execute() {
        await this.setParams();
        this.getOverrides();
        this.logInput();
        // do stuff

        const buttons = new Discord.ActionRowBuilder();
        if (this.params.graphonly != true) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Graph-${this.name}-${this.commanduser.id}-${this.input.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.graph),
            );
            switch (this.params.detailed) {
                case 1: {
                    buttons.addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId(`${helper.vars.versions.releaseDate}-Detail2-${this.name}-${this.commanduser.id}-${this.input.id}`)
                            .setStyle(helper.vars.buttons.type.current)
                            .setEmoji(helper.vars.buttons.label.main.detailMore),
                    );
                }
                    break;
                case 2: {
                    buttons.addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId(`${helper.vars.versions.releaseDate}-Detail1-${this.name}-${this.commanduser.id}-${this.input.id}`)
                            .setStyle(helper.vars.buttons.type.current)
                            .setEmoji(helper.vars.buttons.label.main.detailLess),
                    );
                }
                    break;
            }
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Detail1-${this.name}-${this.commanduser.id}-${this.input.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );
        }

        {
            const t = await this.validUser(this.params.user, this.params.searchid, this.params.mode);
            this.params.user = t.user;
            this.params.mode = t.mode;
        }

        this.params.mode = this.params.mode ? helper.tools.other.modeValidator(this.params.mode) : null;
        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        let osudata: apitypes.User;

        try {
            const t = await this.getProfile(this.params.user, this.params.mode);
            osudata = t;
        } catch (e) {
            return;
        }
        //check for player's default mode if mode is null
        if ((

            (this.input.type == 'interaction' && !(this.input.interaction as Discord.ChatInputCommandInteraction)?.options?.getString('mode'))
            || this.input.type == 'message' || this.input.type == 'link'
        ) &&
            osudata.playmode != 'osu' &&
            typeof this.params.mode != 'undefined') {
            try {
                const t = await this.getProfile(this.params.user, this.params.mode);
                osudata = t;
            } catch (e) {
                return;
            }
        } else {
            this.params.mode = this.params.mode ?? 'osu';
        }

        if (this.input.type != 'button' || this.input.buttonType == 'Refresh') {
            try {
                helper.tools.data.updateUserStats(osudata, osudata.playmode,);
                helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(this.params.mode), 'User');
            } catch (error) {
            }
        }

        const osustats = osudata.statistics;
        const grades = osustats.grade_counts;

        const playerrank =
            osudata.statistics?.global_rank ?
                helper.tools.calculate.separateNum(osudata.statistics.global_rank) :
                '---';

        const countryrank =
            osudata.statistics?.country_rank ?
                helper.tools.calculate.separateNum(osudata.statistics.country_rank) :
                '---';

        const rankglobal = ` #${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)`;

        const peakRank = osudata?.rank_highest?.rank ?
            `\n**Peak Rank**: #${helper.tools.calculate.separateNum(osudata.rank_highest.rank)} (<t:${new Date(osudata.rank_highest.updated_at).getTime() / 1000}:R>)` :
            '';
        const onlinestatus = osudata.is_online ?
            `**${helper.vars.emojis.onlinestatus.online} Online**` :
            (new Date(osudata.last_visit)).getTime() != 0 ?
                `**${helper.vars.emojis.onlinestatus.offline} Offline** | Last online <t:${(new Date(osudata.last_visit)).getTime() / 1000}:R>`
                : `**${helper.vars.emojis.onlinestatus.offline} Offline**`;

        const prevnames = osudata.previous_usernames.length > 0 ?
            '**Previous Usernames:** ' + osudata.previous_usernames.join(', ') :
            '';

        const playcount = osustats.play_count == null ?
            '---' :
            helper.tools.calculate.separateNum(osustats.play_count);

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
                supporter = helper.vars.emojis.supporter.first;
                break;
            case 2:
                supporter = helper.vars.emojis.supporter.second;
                break;
            case 3:
                supporter = helper.vars.emojis.supporter.third;
                break;
        }

        const gradeCounts =
            `${helper.vars.emojis.grades.XH}${grades.ssh} ${helper.vars.emojis.grades.X}${grades.ss} ${helper.vars.emojis.grades.SH}${grades.sh} ${helper.vars.emojis.grades.S}${grades.s} ${helper.vars.emojis.grades.A}${grades.a}`;
        // `XH${grades.ssh} X}{grades.ss} SH${grades.sh} S}{grades.s} A}{grades.a}`;

        const osuEmbed = new Discord.EmbedBuilder()
            .setColor(helper.vars.colours.embedColour.user.dec)
            .setTitle(`${osudata.username}'s ${this.params.mode ?? 'osu!'} profile`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${this.params.mode ?? ''}`)
            .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`);
        if (this.params.graphonly) {
            const graphembeds = await this.getGraphs(osudata);
            this.ctn.embeds = graphembeds;
        } else {
            if (this.params.detailed == 2) {
                const loading = new Discord.EmbedBuilder()
                    .setColor(helper.vars.colours.embedColour.user.dec)
                    .setTitle(`${osudata.username}'s ${this.params.mode ?? 'osu!'} profile`)
                    .setURL(`https://osu.ppy.sh/users/${osudata.id}/${this.params.mode ?? ''}`)
                    .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
                    .setDescription(`Loading...`);

                if (this.input.type != 'button') {
                    if (this.input.type == 'interaction') {
                        setTimeout(() => {
                            (this.input.interaction as Discord.ChatInputCommandInteraction).editReply({
                                embeds: [loading],
                                allowedMentions: { repliedUser: false },
                            })
                                .catch();
                        }, 1000);
                    }
                }
                const graphembeds = await this.getGraphs(osudata);

                const mostplayeddataReq: tooltypes.apiReturn<apitypes.BeatmapPlayCountArr> = await helper.tools.api.getUserMostPlayed(osudata.id, []);
                const mostplayeddata: apitypes.BeatmapPlayCountArr = mostplayeddataReq.apiData;
                if (mostplayeddataReq?.error) {
                    await helper.tools.commands.errorAndAbort(this.input, 'osu', true, helper.vars.errors.uErr.osu.map.group_nf.replace('[TYPE]', 'most played'), false);
                    return;
                }
                helper.tools.data.debug(mostplayeddataReq, 'command', 'osu', this.input.message?.guildId ?? this.input.interaction?.guildId, 'mostPlayedData');

                if (mostplayeddata?.hasOwnProperty('error')) {
                    await helper.tools.commands.errorAndAbort(this.input, 'osu', true, helper.vars.errors.uErr.osu.profile.mostplayed, true);
                    return;
                }
                const secperplay = osudata?.statistics.play_time / parseFloat(playcount.replaceAll(',', ''));

                let mostplaytxt = ``;
                for (let i2 = 0; i2 < mostplayeddata.length && i2 < 10; i2++) {
                    const bmpc = mostplayeddata[i2];
                    mostplaytxt += `\`${(bmpc.count.toString() + ' plays').padEnd(15, ' ')}\` | [${bmpc.beatmapset.title}[${bmpc.beatmap.version}]](https://osu.ppy.sh/b/${bmpc.beatmap_id})\n`;
                }

                const dailies = (osustats.play_count / (helper.tools.calculate.convert('month', 'day', osudata.monthly_playcounts.length).outvalue)).toFixed(2);
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
    **Total Play Time:** ${helper.tools.calculate.secondsToTime(osudata?.statistics.play_time)} (${helper.tools.calculate.secondsToTime(osudata?.statistics.play_time, true,)})`,
                        inline: true
                    },
                    {
                        name: helper.vars.defaults.invisbleChar,
                        value:
                            `**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>                        
    ${gradeCounts}
    **Medals**: ${osudata.user_achievements.length}
    **Followers:** ${osudata.follower_count}
    ${prevnames}
    ${supporter} ${onlinestatus}
    **Avg time per play:** ${helper.tools.calculate.secondsToTime(secperplay)}
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

                this.ctn.embeds = [osuEmbed].concat(graphembeds);
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
    **Total Play Time:** ${helper.tools.calculate.secondsToTime(osudata?.statistics.play_time, true)}
    ${supporter} ${onlinestatus}
            `);
                this.ctn.embeds = [osuEmbed];
            }
        }
        helper.tools.data.writePreviousId('user', this.input.message?.guildId ?? this.input.interaction?.guildId, { id: `${osudata.id}`, apiData: null, mods: null });
        this.ctn.components = [buttons];
        this.send();
    }

    async getGraphs(osudata: apitypes.User) {
        let chartplay;
        let chartrank;

        let nulltext = helper.vars.defaults.invisbleChar;

        if (
            (!osudata.monthly_playcounts ||
                osudata.monthly_playcounts.length == 0) ||
            (!osudata.rank_history ||
                osudata.rank_history.length == 0)) {
            nulltext = 'Error - Missing data';
            chartplay = helper.vars.defaults.images.any.url;
            chartrank = chartplay;
        } else {
            const dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',');
            const datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',');

            const play =
                await helper.tools.other.graph(dataplay, osudata.monthly_playcounts.map(x => x.count), 'Playcount', {
                    startzero: true,
                    fill: true,
                    displayLegend: true,
                    pointSize: 0,
                });
            const rank =
                await helper.tools.other.graph(datarank, osudata.rank_history.data, 'Rank', {
                    startzero: false,
                    fill: false,
                    displayLegend: true,
                    reverse: true,
                    pointSize: 0,
                });
            const fileplay = new Discord.AttachmentBuilder(`${play.path}`);
            const filerank = new Discord.AttachmentBuilder(`${rank.path}`);

            this.ctn.files.push(fileplay, filerank);

            chartplay = `attachment://${play.filename}.jpg`;
            chartrank = `attachment://${rank.filename}.jpg`;
        }
        const ChartsEmbedRank = new Discord.EmbedBuilder()
            .setTitle(`${osudata.username}`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${this.params.mode ?? ''}`)
            .setDescription(nulltext)
            .setImage(`${chartrank}`);

        const ChartsEmbedPlay = new Discord.EmbedBuilder()
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${this.params.mode ?? ''}`)
            .setImage(`${chartplay}`);

        return [ChartsEmbedRank, ChartsEmbedPlay];
    }
}

export class RecentActivity extends OsuCommand {
    declare protected params: {
        user: string;
        searchid: string;
        page: number;
    };
    constructor() {
        super();
        this.name = 'RecentActivity';
        this.params = {
            user: null,
            searchid: null,
            page: 1,
        };
    }
    async setParamsMsg() {
        this.params.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, this.input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.params.page = pageArgFinder.output;
            this.input.args = pageArgFinder.args;
        }

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        const usertemp = helper.tools.commands.fetchUser(this.input.args);
        this.input.args = usertemp.args;
        this.params.user = usertemp.id;
        if (!this.params.user || this.params.user.includes(this.params.searchid)) {
            this.params.user = null;
        }
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.searchid = this.commanduser.id;
        this.params.user = interaction.options.getString('user');
        this.params.page = interaction.options.getInteger('page');
    }
    async setParamsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.params.user = this.input.message.embeds[0].url.split('users/')[1].split('/')[0];
        this.params.page = parseInt((this.input.message.embeds[0].description).split('Page: ')[1].split('/')[0]);

        switch (this.input.buttonType) {
            case 'BigLeftArrow':
                this.params.page = 1;
                break;
            case 'LeftArrow':
                this.params.page = parseInt((this.input.message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1;
                break;
            case 'RightArrow':
                this.params.page = parseInt((this.input.message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1;
                break;
            case 'BigRightArrow':
                this.params.page = parseInt((this.input.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n')[0]);
                break;
        }
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page != null) {
            this.params.page = this.input.overrides.page;
        }
    }
    async execute() {
        await this.setParams();
        this.logInput();
        this.getOverrides();
        // do stuff
        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons(this.name, this.commanduser, this.input.id);

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder();
        {
            const t = await this.validUser(this.params.user, this.params.searchid, 'osu');
            this.params.user = t.user;
        }

        if (this.params.page < 2 || typeof this.params.page != 'number') {
            this.params.page = 1;
        }
        this.params.page--;
        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        let osudataReq: tooltypes.apiReturn<apitypes.User>;

        if (helper.tools.data.findFile(this.params.user, 'osudata', 'osu') &&
            !('error' in helper.tools.data.findFile(this.params.user, 'osudata', 'osu')) &&
            this.input.buttonType != 'Refresh'
        ) {
            osudataReq = helper.tools.data.findFile(this.params.user, 'osudata', 'osu');
        } else {
            osudataReq = await helper.tools.api.getUser(this.params.user, 'osu', []);

        }

        const osudata: apitypes.User = osudataReq.apiData;
        if (osudataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', this.params.user), false);
            return;
        }

        helper.tools.data.debug(osudataReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'osuData');

        if (osudata?.hasOwnProperty('error') || !osudata.id) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.noUser(this.params.user), true);
            return;
        }

        helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', 'osu');
        helper.tools.data.storeFile(osudataReq, this.params.user, 'osudata', 'osu');

        if (this.input.type != 'button' || this.input.buttonType == 'Refresh') {
            try {
                helper.tools.data.updateUserStats(osudata, osudata.playmode,);
                helper.tools.data.userStatsCache([osudata], 'osu', 'User');
            } catch (error) {
            }
        }
        buttons
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-User-${this.name}-any-${this.input.id}-${osudata.id}+${osudata.playmode}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );

        let recentActivityReq: tooltypes.apiReturn<apitypes.Event[]>;

        if (helper.tools.data.findFile(this.input.id, 'rsactdata') &&
            !('error' in helper.tools.data.findFile(this.input.id, 'rsactdata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            recentActivityReq = helper.tools.data.findFile(this.input.id, 'rsactdata');
        } else {
            recentActivityReq = await helper.tools.api.getUserActivity(osudata.id, []);
        }

        const rsactData: apitypes.Event[] & apitypes.Error = recentActivityReq.apiData;
        if (recentActivityReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.rsact, false);
            return;
        }
        helper.tools.data.debug(recentActivityReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'rsactData');

        if (rsactData?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.profile.rsact, true);
            return;
        }

        helper.tools.data.storeFile(recentActivityReq, this.input.id, 'rsactData', 'osu');

        const pageLength = 10;

        if (this.params.page < 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);

        }
        if (this.params.page >= Math.ceil(rsactData.length / pageLength) - 1) {
            this.params.page = Math.ceil(rsactData.length / pageLength) - 1;
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);

        }

        const curEmbed = new Discord.EmbedBuilder()
            .setTitle(`Recent Activity for ${osudata.username}`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osudata.playmode}#recent`)
            .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
            .setDescription(`Page: ${this.params.page + 1}/${Math.ceil(rsactData.length / pageLength)}`);

        helper.tools.formatter.userAuthor(osudata, curEmbed);

        let actText = '';

        for (let i = 0; i < rsactData.length && i < pageLength; i++) {
            const curEv = rsactData[i + (this.params.page * pageLength)];
            if (!curEv) break;
            const obj = {
                number: `${i + (this.params.page * pageLength) + 1}`,
                desc: 'null',
            };
            switch (curEv.type) {
                case 'achievement': {
                    const temp = curEv as apitypes.EventAchievement;
                    obj.desc = `Unlocked the **${temp.achievement.name}** medal! <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'beatmapsetApprove': {
                    const temp = curEv as apitypes.EventBeatmapsetApprove;
                    obj.desc = `Approved **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'beatmapPlaycount': {
                    const temp = curEv as apitypes.EventBeatmapPlaycount;
                    obj.desc =
                        `Achieved ${temp.count} plays on [\`${temp.beatmap.title}\`](https://osu.ppy.sh${temp.beatmap.url}) <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'beatmapsetDelete': {
                    const temp = curEv as apitypes.EventBeatmapsetDelete;
                    obj.desc = `Deleted **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'beatmapsetRevive': {
                    const temp = curEv as apitypes.EventBeatmapsetRevive;
                    obj.desc = `Revived **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'beatmapsetUpdate': {
                    const temp = curEv as apitypes.EventBeatmapsetUpdate;
                    obj.desc = `Updated **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'beatmapsetUpload': {
                    const temp = curEv as apitypes.EventBeatmapsetUpload;
                    obj.desc = `Submitted **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'rank': {
                    const temp = (curEv as apitypes.EventRank);
                    obj.desc =
                        `Achieved rank **#${temp.rank}** on [\`${temp.beatmap.title}\`](https://osu.ppy.sh${temp.beatmap.url}) (${helper.vars.emojis.gamemodes[temp.mode]}) <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                }
                    break;
                case 'rankLost': {
                    const temp = curEv as apitypes.EventRankLost;
                    obj.desc = `Lost #1 on **[\`${temp.beatmap.title}\`](https://osu.ppy.sh${temp.beatmap.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'userSupportAgain': {
                    const temp = curEv as apitypes.EventUserSupportAgain;
                    obj.desc = `Purchased supporter <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'userSupportFirst': {
                    const temp = curEv as apitypes.EventUserSupportFirst;
                    obj.desc = `Purchased supporter for the first time <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'userSupportGift': {
                    const temp = curEv as apitypes.EventUserSupportGift;
                    obj.desc = `Was gifted supporter <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
                case 'usernameChange': {
                    const temp = curEv as apitypes.EventUsernameChange;
                    obj.desc = `Changed their username from ${temp.user.previousUsername} to ${temp.user.username} <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
                } break;
            }
            actText += `**${obj.number})** ${obj.desc}\n\n`;
        }
        if (actText.length == 0) {
            actText = 'No recent activity found';
        }
        curEmbed.setDescription(`Page: ${this.params.page + 1}/${Math.ceil(rsactData.length / pageLength)}


${actText}`);
        this.ctn.embeds = [curEmbed];
        this.ctn.components = [pgbuttons, buttons];

        this.send();
    }
}