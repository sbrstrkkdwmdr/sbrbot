import Discord from 'discord.js';
import fs from 'fs';
import * as osuclasses from 'osu-classes';
import * as osuparsers from 'osu-parsers';
import * as osumodcalc from 'osumodcalculator';
import * as rosu from 'rosu-pp-js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';
import { Command } from './command.js';

export class ScoreListCommand extends Command {
    declare protected args: {
        user: string;
        searchid: string;
        mode: apitypes.GameMode,
        page: number;
        detailed: number;
        sort: "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
        reverse: boolean;
        filterTitle: string;
        filterArtist: string;
        filterDifficulty: string;
        filteredMapper: string;
        filterRank: apitypes.Rank;
        parseScore: boolean;
        parseId: string | number;
        modsInclude: string;
        modsExact: string;
        modsExclude: string;
        pp: string;
        score: string;
        acc: string;
        combo: string;
        miss: string;
        bpm: string;
        mapid: string | number | boolean;
    };
    protected type: 'osutop' | 'nochokes' | 'recent' | 'map' | 'firsts' | 'pinned';
    constructor() {
        super();
        this.args = {
            user: null,
            searchid: null,
            page: 0,
            mode: null,
            detailed: 1,
            sort: null,
            reverse: false,
            filterTitle: null,
            filterArtist: null,
            filterDifficulty: null,
            filteredMapper: null,
            filterRank: null,
            parseScore: null,
            parseId: null,
            modsInclude: null,
            modsExact: null,
            modsExclude: null,
            pp: null,
            score: null,
            acc: null,
            combo: null,
            miss: null,
            bpm: null,
            mapid: null,
        };
    }
    async setArgsMsg() {
        this.args.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        if (this.input.args.includes('-parse')) {
            this.args.parseScore = true;
            const temp = helper.tools.commands.parseArg(this.input.args, '-parse', 'number', 1, null, true);
            this.args.parseId = temp.value;
            this.input.args = temp.newArgs;
        }

        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, this.input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.args.page = pageArgFinder.output;
            this.input.args = pageArgFinder.args;
        }
        const detailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.details, this.input.args, false, null, false, false);
        if (detailArgFinder.found) {
            this.args.detailed = 2;
            this.input.args = detailArgFinder.args;
        }
        const lessDetailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.compress, this.input.args, false, null, false, false);
        if (lessDetailArgFinder.found) {
            this.args.detailed = 0;
            this.input.args = lessDetailArgFinder.args;
        }
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.args.mode = temp.mode;
        }
        const reverseArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['rev', 'reverse',]), this.input.args, false, null, false, false);
        if (reverseArgFinder.found) {
            this.args.reverse = true;
            this.input.args = reverseArgFinder.args;
        }
        if (this.input.args.includes('-mods')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-mods', 'string', this.args.modsInclude, false);
            this.args.modsInclude = temp.value;
            this.input.args = temp.newArgs;
        }
        const mxmodArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['mx', 'modx',]), this.input.args, true, 'string', false, false);
        if (mxmodArgFinder.found) {
            this.args.modsExact = mxmodArgFinder.output;
            this.input.args = mxmodArgFinder.args;
        }
        if (this.input.args.includes('-exmod')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-exmod', 'string', this.args.modsExclude, false);
            this.args.modsExclude = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-me')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-me', 'string', this.args.modsExclude, false);
            this.args.modsExclude = temp.value;
            this.input.args = temp.newArgs;
        }
        const exmodArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['me', 'exmod',]), this.input.args, true, 'string', false, false);
        if (exmodArgFinder.found) {
            this.args.modsExclude = exmodArgFinder.output;
            this.input.args = exmodArgFinder.args;
        }

        if (this.input.args.includes('-sort')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-sort', 'string', this.args.sort, false);
            this.args.sort = temp.value;
            this.input.args = temp.newArgs;
        }
        const recentArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['r', 'recent',]), this.input.args, false, null, false, false);
        if (recentArgFinder.found) {
            this.args.sort = 'recent';
            this.input.args = recentArgFinder.args;
        }
        if (this.input.args.includes('-performance')) {
            this.args.sort = 'pp';
            this.input.args.splice(this.input.args.indexOf('-performance'), 1);
        }
        if (this.input.args.includes('-pp')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-pp', 'string', this.args.pp, false);
            this.args.pp = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-score')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-score', 'string', this.args.score, false);
            this.args.score = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-acc')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-acc', 'string', this.args.acc, false);
            this.args.acc = temp.value;
            this.input.args = temp.newArgs;
        }
        const filterComboArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['combo', 'maxcombo']), this.input.args, true, 'string', false, true);
        if (filterComboArgFinder.found) {
            this.args.combo = filterComboArgFinder.output;
            this.input.args = filterComboArgFinder.args;
        }
        const filterMissArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['miss', 'misses']), this.input.args, true, 'string', false, true);
        if (filterMissArgFinder.found) {
            this.args.miss = filterMissArgFinder.output;
            this.input.args = filterMissArgFinder.args;
        }
        const fcArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['fc', 'fullcombo',]), this.input.args, false, null, false, false);
        if (fcArgFinder.found) {
            this.args.miss = '0';
            this.input.args = fcArgFinder.args;
        }
        const filterRankArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['rank', 'grade', 'letter']), this.input.args, true, 'string', false, false);
        if (filterRankArgFinder.found) {
            this.args.filterRank = filterRankArgFinder.output;
            this.input.args = filterRankArgFinder.args;
        }
        if (this.input.args.includes('-bpm')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-bpm', 'string', this.args.bpm, false);
            this.args.bpm = temp.value;
            this.input.args = temp.newArgs;
        }

        const titleArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.filterTitle, this.input.args, true, 'string', true, false);
        if (titleArgFinder.found) {
            this.args.filterTitle = titleArgFinder.output;
            this.input.args = titleArgFinder.args;
        }
        const mapperArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.filterCreator, this.input.args, true, 'string', true, false);
        if (mapperArgFinder.found) {
            this.args.filteredMapper = mapperArgFinder.output;
            this.input.args = mapperArgFinder.args;
        }
        const artistArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.filterArtist, this.input.args, true, 'string', true, false);
        if (artistArgFinder.found) {
            this.args.filterArtist = artistArgFinder.output;
            this.input.args = artistArgFinder.args;
        }
        const versionArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.filterVersion, this.input.args, true, 'string', true, false);
        if (versionArgFinder.found) {
            this.args.filterDifficulty = versionArgFinder.output;
            this.input.args = versionArgFinder.args;
        }
        this.input.args = helper.tools.commands.cleanArgs(this.input.args);
        if (this.input.args.join(' ').includes('+')) {
            this.args.modsInclude = this.input.args.join(' ').split('+')[1];
            this.args.modsInclude.includes(' ') ? this.args.modsInclude = this.args.modsInclude.split(' ')[0] : null;
            this.input.args = this.input.args.join(' ').replace('+', '').replace(this.args.modsInclude, '').split(' ');
        }

        await this.argsMsgExtra();

        const usertemp = helper.tools.commands.fetchUser(this.input.args);
        this.args.user = usertemp.id;
        if (usertemp.mode && !this.args.mode) {
            this.args.mode = usertemp.mode;
        }
        // if (!this.args.user || this.args.user.includes(this.args.searchid)) {
        //     this.args.user = null;
        // }
    }
    async setArgsInteract() {
        let interaction = this.input.interaction as Discord.ChatInputCommandInteraction;

        this.args.searchid = interaction?.member?.user?.id ?? interaction?.user.id;
        this.args.user = interaction.options.getString('user') ?? undefined;
        this.args.page = interaction.options.getInteger('page') ?? 0;
        this.args.detailed = interaction.options.getBoolean('detailed') ? 1 : 0;
        this.args.sort = interaction.options.getString('sort') as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
        this.args.reverse = interaction.options.getBoolean('reverse') ?? false;
        this.args.mode = (interaction.options.getString('mode') ?? 'osu') as apitypes.GameMode;
        this.args.filteredMapper = interaction.options.getString('mapper') ?? null;
        this.args.filterTitle = interaction.options.getString('filter') ?? null;
        this.args.parseId = interaction.options.getInteger('parse') ?? null;
        this.args.parseScore = this.args.parseId != null ? true : false;
        this.args.modsInclude = interaction.options.getString('mods') ?? null;
        this.args.modsExact = interaction.options.getString('modsExact') ?? null;
        this.args.modsExclude = interaction.options.getString('modsExclude') ?? null;
        this.args.filterRank = interaction.options.getString('filterRank') ? osumodcalc.checkGrade(interaction.options.getString('filterRank')) : null;
        this.args.pp = interaction.options.getString('pp') ?? null;
        this.args.score = interaction.options.getString('score') ?? null;
        this.args.acc = interaction.options.getString('acc') ?? null;
        this.args.combo = interaction.options.getString('combo') ?? null;
        this.args.miss = interaction.options.getString('miss') ?? null;
        this.args.bpm = interaction.options.getString('bpm') ?? null;
        await this.argsInteractExtra();
    }
    async setArgsBtn() {
        let interaction = (this.input.interaction as Discord.ButtonInteraction);
        if (!this.input.message.embeds[0]) return;

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

        this.args.user = temp?.user;
        this.args.searchid = temp?.searchid;
        this.args.page = temp?.page;
        this.args.mode = temp?.mode;
        this.args.filteredMapper = temp?.filterMapper;
        this.args.modsInclude = temp?.modsInclude;
        this.args.modsExact = temp?.modsExact;
        this.args.modsExclude = temp?.modsExclude;
        this.args.filterTitle = temp?.filterTitle;
        this.args.filterRank = temp?.filterRank;
        this.args.parseId = null;
        this.args.parseScore = null;
        this.args.pp = temp?.filterPp;
        this.args.score = temp?.filterScore;
        this.args.acc = temp?.filterAcc;
        this.args.combo = temp?.filterCombo;
        this.args.miss = temp?.filterMiss;
        this.args.bpm = temp?.filterBpm;
        this.args.sort = temp?.sort as any;
        this.args.reverse = temp?.reverse;

        switch (this.input.buttonType) {
            case 'BigLeftArrow':
                this.args.page = 1;
                break;
            case 'LeftArrow':
                this.args.page -= 1;
                break;
            case 'RightArrow':
                this.args.page += 1;
                break;
            case 'BigRightArrow':
                this.args.page = temp?.page;
                break;
        }

        switch (this.input.buttonType) {
            case 'Detail0':
                this.args.detailed = 0;
                break;
            case 'Detail1':
                this.args.detailed = 1;
                break;
            case 'Detail2':
                this.args.detailed = 2;
                break;
            default:
                if (this.input.message.embeds[0].footer.text.includes('LE')) {
                    this.args.detailed = 2;
                }
                if (this.input.message.embeds[0].footer.text.includes('LC')) {
                    this.args.detailed = 0;
                }
                break;
        }
        await this.argsButtonsExtra();
    }
    argsMsgExtra() { };
    argsInteractExtra() { };
    argsButtonsExtra() { };

    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page != null) {
            this.args.page = this.input.overrides.page;
        }
        if (this.input.overrides.sort != null) {
            this.args.sort = this.input.overrides.sort as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
        }
        if (this.input.overrides.reverse != null) {
            this.args.reverse = this.input.overrides.reverse;
        }
        if (this.input.overrides.commandAs) {
            this.input.type = this.input.overrides.commandAs;
        }
        if (this.input.overrides.user) {
            this.args.user = this.input.overrides.user;
        }
        if (this.input.overrides.mode) {
            this.args.mode = this.input.overrides.mode;
        }
    }

    osudata: apitypes.User;
    scores: apitypes.Score[];
    map: apitypes.Beatmap;

    pgbuttons: Discord.ActionRowBuilder;
    buttons: Discord.ActionRowBuilder;

    protected async getScores() {
        let req: tooltypes.apiReturn<apitypes.Score[] | apitypes.ScoreArrA>;
        let fname = '';
        let getid = this.osudata.id + '';
        switch (this.type) {
            case 'osutop':
                fname = 'osutopdata';
                break;
            case 'nochokes':
                fname = 'nochokesdata';
                break;
            case 'recent':
                fname = 'recentthis.score';
                break;
            case 'map':
                fname = 'mapscoresdata';
                break;
            case 'firsts':
                fname = 'firstsdata';
                getid = this.input.id + '';
                break;
            case 'pinned':
                fname = 'pinneddata';
                break;
        }
        // scores = req.
        if (helper.tools.data.findFile(getid, fname) &&
            this.input.type == 'button' &&
            !('error' in helper.tools.data.findFile(getid, fname)) &&
            this.input.buttonType != 'Refresh'
        ) {
            req = helper.tools.data.findFile(getid, fname);
        } else {
            switch (this.type) {
                case 'osutop': case 'nochokes':
                    req = await helper.tools.api.getScoresBest(this.osudata.id, this.args.mode, []);
                    break;
                case 'recent':
                    req = await helper.tools.api.getScoresRecent(this.osudata.id, this.args.mode, []);
                    break;
                case 'map': {
                    let mapReq: tooltypes.apiReturn<apitypes.Beatmap>;
                    if (helper.tools.data.findFile(this.args.mapid as string | number, 'map') &&
                        !('error' in helper.tools.data.findFile(this.args.mapid as string | number, 'map')) &&
                        this.input.buttonType != 'Refresh'
                    ) {
                        mapReq = helper.tools.data.findFile(this.args.mapid as string | number, 'map');
                    } else {
                        mapReq = await helper.tools.api.getMap(this.args.mapid as number, []);
                    }
                    if (mapReq?.error) {
                        await helper.tools.commands.errorAndAbort(this.input, 'scores', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', this.args.mapid + ''), false);
                        return;
                    }
                    helper.tools.data.debug(mapReq, 'command', 'scores', this.input.message?.guildId ?? this.input.interaction?.guildId, 'map');
                    this.map = mapReq.apiData;
                    if (this.map?.hasOwnProperty('error')) {
                        await helper.tools.commands.errorAndAbort(this.input, 'scores', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', this.args.mapid + ''), true);
                        return;
                    }

                    req = await helper.tools.api.getUserMapScores(this.osudata.id, this.args.mapid as number, []);
                }
                    break;
                case 'firsts':
                    req = await helper.tools.api.getScoresFirst(this.osudata.id, this.args.mode, []);
                    break;
                case 'pinned':
                    req = await helper.tools.api.getScoresPinned(this.osudata.id, this.args.mode, []);
                    break;
            }
        }

        if (req?.error) {
            await commitError(this.type);
        }

        const tempscores: apitypes.Score[] & apitypes.Error =
            this.type == 'map' ?
                (req.apiData as apitypes.ScoreArrA).scores
                :
                req.apiData as apitypes.Score[];

        helper.tools.data.debug(req, 'command', this.type, this.input.message?.guildId ?? this.input.interaction?.guildId, this.type + 'data');

        if (tempscores?.hasOwnProperty('error') || !(tempscores[0]?.user?.username || tempscores[0].user_id)) {
            await commitError(this?.type);
        }

        this.scores = tempscores;
        async function commitError(type: string) {
            switch (type) {
                case 'osutop': case 'nochokes':
                    await helper.tools.commands.errorAndAbort(this.input, this.type, true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', this.args.user), true);
                    break;
                case 'recent':
                    await helper.tools.commands.errorAndAbort(this.input, this.type, true, helper.vars.errors.uErr.osu.scores.recent.replace('[ID]', this.args.user), true);
                    break;
                case 'map':
                    await helper.tools.commands.errorAndAbort(this.input, this.type, true, helper.vars.errors.uErr.osu.scores.map.replace('[ID]', this.args.user).replace('[MID]', this.args.mapid + ''), true);
                    break;
                case 'firsts':
                    await helper.tools.commands.errorAndAbort(this.input, this.type, true, helper.vars.errors.uErr.osu.scores.first.replace('[ID]', this.args.user), true);
                    break;
                case 'pinned':
                    await helper.tools.commands.errorAndAbort(this.input, this.type, true, helper.vars.errors.uErr.osu.scores.pinned.replace('[ID]', this.args.user), true);
                    break;
            }
            throw new Error('Get scores error');
        }
    };
    protected toName(map?: apitypes.Beatmap) {
        switch (this.type) {
            case 'osutop':
                return 'Best scores for ' + this.osudata.username;
            case 'nochokes':
                return 'Best no-choke scores for ' + this.osudata.username;
            case 'recent':
                return 'Recent scores for ' + this.osudata.username;
            case 'map':
                return `\`${map?.beatmapset?.artist} - ${map?.beatmapset?.title} [${map?.version}]\``;
            case 'firsts':
                return '#1 scores for ' + this.osudata.username;
            case 'pinned':
                return 'Pinned scores for ' + this.osudata.username;
        }
    }
    protected async list(map?: apitypes.Beatmap) {
        let scoresEmbed = new Discord.EmbedBuilder()
            .setColor(helper.vars.colours.embedColour.scorelist.dec)
            .setTitle(this.toName(map))
            .setThumbnail(`${this.osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
            .setURL(`https://osu.ppy.sh/users/${this.osudata.id}/${osumodcalc.ModeIntToName(this.scores?.[0]?.ruleset_id)}#top_ranks`);
        scoresEmbed = helper.tools.formatter.userAuthor(this.osudata, scoresEmbed);

        const scoresFormat = await helper.tools.formatter.scoreList(this.scores, this.args.sort,
            {
                mapper: this.args.filteredMapper,
                modsInclude: this.args.modsInclude,
                title: this.args.filterTitle,
                artist: this.args.filterArtist,
                version: this.args.filterDifficulty,
                rank: this.args.filterRank,
                modsExact: this.args.modsExact,
                modsExclude: this.args.modsExclude,
                pp: this.args.pp,
                score: this.args.score,
                acc: this.args.acc,
                combo: this.args.combo,
                miss: this.args.miss,
                bpm: this.args.bpm
            }, this.args.reverse, this.args.detailed, this.args.page, true,
            this.type == 'map' ? 'single_map' : undefined, map ?? undefined
        );
        scoresEmbed.setFooter({
            text: `${scoresFormat.curPage}/${scoresFormat.maxPage} | ${this.args.mode ?? osumodcalc.ModeIntToName(this.scores?.[0]?.ruleset_id)}`
        });
        if (scoresFormat.text.includes('ERROR')) {
            scoresEmbed.setDescription('**ERROR**\nNo scores found');
            (this.pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (this.pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
            (this.pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
            (this.pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (this.pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }
        scoresEmbed.setDescription(scoresFormat.text);
        helper.tools.data.writePreviousId('user', this.input.message?.guildId ?? this.input.interaction?.guildId, { id: `${this.osudata.id}`, apiData: null, mods: null });
        if (this.type == 'map') {
            helper.tools.data.writePreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId,
                {
                    id: `${map.id}`,
                    apiData: null,
                    mods: null
                }
            );
        }
        if (scoresFormat.curPage <= 1) {
            (this.pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (this.pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }
        if (scoresFormat.curPage >= scoresFormat.maxPage) {
            (this.pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (this.pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }

        this.ctn.embeds = [scoresEmbed];
        this.ctn.components = [this.pgbuttons, this.buttons];
    }

    async execute() {
        await this.setArgs();
        this.getOverrides();
        this.logInput();

        //if user is null, use searchid
        if (this.args.user == null) {
            const cuser = await helper.tools.data.searchUser(this.args.searchid, true);
            this.args.user = cuser.username;
            if (this.args.mode == null) {
                this.args.mode = cuser.gamemode;
            }
        }

        //if user is not found in database, use discord username
        if (this.args.user == null) {
            const cuser = helper.vars.client.users.cache.get(this.args.searchid);
            this.args.user = cuser.username;
        }
        this.args.mode = helper.tools.other.modeValidator(this.args.mode);

        if (this.type == 'map') {
            if (!this.args.mapid) {
                const temp = helper.tools.data.getPreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId);
                this.args.mapid = temp.id;
            }
            if (this.args.mapid == false) {
                helper.tools.commands.missingPrevID_map(this.input, 'scores');
                return;
            }
        }


        this.pgbuttons = await helper.tools.commands.pageButtons('scores', this.commanduser, this.input.id);
        this.buttons = new Discord.ActionRowBuilder();

        if (this.input.type == 'interaction') {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: `Loading...`,
                }
            }, this.input.canReply);
        }

        if (this.args.page < 2 || typeof this.args.page != 'number' || isNaN(this.args.page)) {
            this.args.page = 1;
        }

        let osudataReq: tooltypes.apiReturn<apitypes.User>;

        if (helper.tools.data.findFile(this.args.user, 'osudata', helper.tools.other.modeValidator(this.args.mode)) &&
            !('error' in helper.tools.data.findFile(this.args.user, 'osudata', helper.tools.other.modeValidator(this.args.mode))) &&
            this.input.buttonType != 'Refresh'
        ) {
            osudataReq = helper.tools.data.findFile(this.args.user, 'osudata', helper.tools.other.modeValidator(this.args.mode));
        } else {
            osudataReq = await helper.tools.api.getUser(this.args.user, this.args.mode, []);
        }

        if (osudataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, 'scores', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', this.args.user), false);
            return;
        }
        helper.tools.data.debug(osudataReq, 'command', 'scores', this.input.message?.guildId ?? this.input.interaction?.guildId, 'osuData');

        this.osudata = osudataReq.apiData;
        if (this.osudata?.hasOwnProperty('error') || !this.osudata.id) {
            await helper.tools.commands.errorAndAbort(this.input, 'scores', true, helper.vars.errors.noUser(this.args.user), true);
            return;

        }

        helper.tools.data.userStatsCache([this.osudata], helper.tools.other.modeValidator(this.args.mode), 'User');

        helper.tools.data.storeFile(osudataReq, this.osudata.id, 'osudata', helper.tools.other.modeValidator(this.args.mode));
        helper.tools.data.storeFile(osudataReq, this.args.user, 'osudata', helper.tools.other.modeValidator(this.args.mode));

        this.buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-User-scores-any-${this.input.id}-${this.osudata.id}+${this.osudata.playmode}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.user),
        );
        try {
            await this.getScores();
        } catch (e) {
            console.log(e);
            return;
        }

        if (this.args.parseScore) {
            let pid = +(this.args.parseId) - 1;
            if (isNaN(pid) || pid < 0) {
                pid = 0;
            }
            if (pid > this.scores.length) {
                pid = this.scores.length - 1;
            }
            this.input.overrides = {
                id: this.scores?.[pid]?.id,
                commanduser: this.commanduser,
                commandAs: this.input.type
            };
            const user = this.osudata.username;
            switch (this.type) {
                case 'osutop':
                    this.input.overrides.ex = `${user}'s #${helper.tools.calculate.toOrdinal(pid+1)} ${this.args.sort == 'pp' ? helper.tools.formatter.sortDescription(this.args.sort ?? 'pp', this.args.reverse) + ' ' : ''}top score`
                    break;
                case 'nochokes':
                    this.input.overrides.ex = `${user}'s #${helper.tools.calculate.toOrdinal(pid+1)} ${this.args.sort == 'pp' ? helper.tools.formatter.sortDescription(this.args.sort ?? 'pp', this.args.reverse) + ' ' : ''}no choke score`
                    this.input.overrides.type = 'nochoke';
                    break;
                case 'firsts':
                    this.input.overrides.ex = `${user}'s ${helper.tools.calculate.toOrdinal(pid + 1)} ${this.args.sort == 'recent' ? helper.tools.formatter.sortDescription(this.args.sort ?? 'recent', this.args.reverse) + ' ' : ''}#1 score`
                    break;
                case 'pinned':
                    this.input.overrides.ex = `${user}'s ${helper.tools.calculate.toOrdinal(pid + 1)} ${this.args.sort == 'recent' ? helper.tools.formatter.sortDescription(this.args.sort ?? 'recent', this.args.reverse) + ' ' : ''}pinned score`
                    break;
            }
            if (this.input.overrides.id == null || typeof this.input.overrides.id == 'undefined') {
                await helper.tools.commands.errorAndAbort(this.input, 'scores', true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
                return;
            }
            this.input.type = 'other';
            const cmd = new ScoreParse();
            cmd.setInput(this.input);
            await cmd.execute();
            return;
        }

        await this.list(this?.map);

        this.send();
    }
}

export class Firsts extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'firsts';
    }
}

export class OsuTop extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'osutop';
    }
}

export class NoChokes extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'nochokes';
    }
}

export class Pinned extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'pinned';
    }
}
export class RecentList extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'recent';
    }
    async argsMsgExtra(): Promise<void> {

    }
}

export class MapScores extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'map';
    }
    async argsMsgExtra(): Promise<void> {
        this.args.mapid = (await helper.tools.commands.mapIdFromLink(this.input.args.join(' '), true,)).map;
        if (this.args.mapid != null) {
            this.input.args.splice(this.input.args.indexOf(this.input.args.find(arg => arg.includes('https://osu.ppy.sh/'))), 1);
        }
    }
    async argsInteractExtra(): Promise<void> {
        let interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.args.mapid = interaction.options.getNumber('id');
    }
    async argsButtonsExtra(): Promise<void> {

    }

    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page != null) {
            this.args.page = this.input.overrides.page;
        }
        if (this.input.overrides.sort != null) {
            this.args.sort = this.input.overrides.sort as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
        }
        if (this.input.overrides.reverse != null) {
            this.args.reverse = this.input.overrides.reverse;
        }
        if (this.input.overrides.commandAs) {
            this.input.type = this.input.overrides.commandAs;
        }
        if (this.input.overrides.commanduser) {
            this.commanduser = this.input.overrides.commanduser;
            this.ctn.content = `Requested by <@${this.commanduser.id}>`;
        }
        if (this.input.overrides.user) {
            this.args.user = this.input.overrides.user;
        }
        if (this.input.overrides.id) {
            this.args.mapid = this.input.overrides.id;
        }
    }

}

export class SingleScoreCommand extends Command {
    protected type: 'recent' | 'default';
    constructor() {
        super();
        this.type = 'default';
        this.scores = [];
    }
    osudata: apitypes.User;
    scores: apitypes.Score[];
    score: apitypes.Score;
    map: apitypes.Beatmap;
    mapset: apitypes.Beatmapset;

    async renderEmbed() {
        let cg: osumodcalc.AccGrade;
        const gamehits = this.score.statistics;
        apitypes.RulesetEnum.osu;
        switch (this.score.ruleset_id) {
            case apitypes.RulesetEnum.osu: default:
                cg = osumodcalc.calcgrade(
                    gamehits.great,
                    (gamehits.ok ?? 0),
                    (gamehits.meh ?? 0),
                    (gamehits.miss ?? 0)
                );
                break;
            case apitypes.RulesetEnum.taiko:
                cg = osumodcalc.calcgradeTaiko(
                    gamehits.great,
                    (gamehits.good ?? 0),
                    (gamehits.miss ?? 0)
                );
                break;
            case apitypes.RulesetEnum.fruits:
                cg = osumodcalc.calcgradeCatch(
                    gamehits.great,
                    (gamehits.ok ?? 0),
                    (gamehits.meh ?? 0),
                    gamehits.small_tick_hit,
                    (gamehits.miss ?? 0)
                );
                break;
            case apitypes.RulesetEnum.mania:
                cg = osumodcalc.calcgradeMania(
                    (gamehits.perfect ?? 0),
                    gamehits.great,
                    gamehits.good,
                    (gamehits.ok ?? 0),
                    (gamehits.meh ?? 0),
                    (gamehits.miss ?? 0)
                );
                break;
        }
        let rspassinfo = '';
        let totalhits;

        switch (this.score.ruleset_id) {
            case apitypes.RulesetEnum.osu: default:
                totalhits = gamehits.great + (gamehits.ok ?? 0) + (gamehits.meh ?? 0) + (gamehits.miss ?? 0);
                break;
            case apitypes.RulesetEnum.taiko:
                totalhits = gamehits.great + (gamehits.good ?? 0) + (gamehits.miss ?? 0);
                break;
            case apitypes.RulesetEnum.fruits:
                totalhits = gamehits.great + (gamehits.ok ?? 0) + (gamehits.meh ?? 0) + gamehits.small_tick_hit + (gamehits.miss ?? 0);
                break;
            case apitypes.RulesetEnum.mania:
                totalhits = (gamehits.perfect ?? 0) + gamehits.great + gamehits.good + (gamehits.ok ?? 0) + (gamehits.meh ?? 0) + (gamehits.miss ?? 0);
        }
        let hitlist: string;

        const getHits = helper.tools.formatter.returnHits(gamehits, this.score.ruleset_id);
        const failed = helper.tools.other.scoreIsComplete(
            this.score.statistics,
            this.map.count_circles,
            this.map.count_sliders,
            this.map.count_spinners,
        );
        switch (this.args.detailed) {
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
        let perf: rosu.PerformanceAttributes;
        let fcperf: rosu.PerformanceAttributes;
        let ssperf: rosu.PerformanceAttributes;
        let fcflag = '';
        try {
            const overrides = helper.tools.calculate.modOverrides(this.score.mods);
            perf = await helper.tools.performance.calcScore({
                mods: this.score.mods.map(x => x.acronym).join('').length > 1 ?
                    this.score.mods.map(x => x.acronym).join('') : 'NM',
                mode: this.score.ruleset_id,
                mapid: this.score.beatmap.id,
                stats: this.score.statistics,
                accuracy: this.score.accuracy,
                maxcombo: this.score.max_combo,
                passedObjects: failed.objectsHit,
                mapLastUpdated: new Date(this.score.beatmap.last_updated),
                customAR: overrides.ar,
                customHP: overrides.hp,
                customCS: overrides.cs,
                customOD: overrides.od,
                clockRate: overrides.speed,
            });
            fcperf = await helper.tools.performance.calcFullCombo({
                mods: this.score.mods.map(x => x.acronym).join('').length > 1 ?
                    this.score.mods.map(x => x.acronym).join('') : 'NM',
                mode: this.score.ruleset_id,
                mapid: this.score.beatmap.id,
                accuracy: this.score.accuracy,
                stats: this.score.statistics,
                mapLastUpdated: new Date(this.score.beatmap.last_updated),
                customAR: overrides.ar,
                customHP: overrides.hp,
                customCS: overrides.cs,
                customOD: overrides.od,
                clockRate: overrides.speed,
            });
            ssperf = await helper.tools.performance.calcFullCombo({
                mods: this.score.mods.map(x => x.acronym).join('').length > 1 ?
                    this.score.mods.map(x => x.acronym).join('') : 'NM',
                mode: this.score.ruleset_id,
                mapid: this.score.beatmap.id,
                accuracy: 1,
                mapLastUpdated: new Date(this.score.beatmap.last_updated),
                customAR: overrides.ar,
                customHP: overrides.hp,
                customCS: overrides.cs,
                customOD: overrides.od,
                clockRate: overrides.speed,
            });
            rspp =
                this.score.pp ?
                    this.score.pp.toFixed(2) :
                    perf.pp.toFixed(2);
            helper.tools.data.debug([perf, fcperf, ssperf], 'command', 'recent', this.input.message?.guildId ?? this.input.interaction?.guildId, 'ppCalcing');

            const mxCombo = perf.difficulty.maxCombo ?? this.map?.max_combo;

            if (this.score.accuracy < 1 && this.score.max_combo == mxCombo) {
                fcflag = `FC\n**${ssperf.pp.toFixed(2)}**pp IF SS`;
            }
            if (this.score.max_combo != mxCombo) {
                fcflag =
                    `\n**${fcperf.pp.toFixed(2)}**pp IF FC
                **${ssperf.pp.toFixed(2)}**pp IF SS`;
            }
            if (this.score.max_combo == mxCombo && this.score.accuracy == 1) {
                fcflag = 'FC';
            }

        } catch (error) {
            rspp =
                this.score.pp ?
                    this.score.pp.toFixed(2) :
                    NaN;
            ppissue = helper.vars.errors.uErr.osu.performance.crash;
            helper.tools.log.commandErr(error, this.input.id, 'firsts', this.input.message, this.input.interaction);
        }

        const curbmhitobj = this.map.count_circles + this.map.count_sliders + this.map.count_spinners;
        let msToFail: number, curbmpasstime: number, guesspasspercentage: number;
        if (!this.score.passed) {
            msToFail = await helper.tools.other.getFailPoint(totalhits, `${helper.vars.path.files}/maps/${this.map.id}.osu`);
            curbmpasstime = Math.floor(msToFail / 1000);
            guesspasspercentage = Math.abs((totalhits / curbmhitobj) * 100);
        }

        // let showFailGraph = false;
        // let FailGraph = '';

        let rsgrade;
        rsgrade = helper.vars.emojis.grades[this.score.rank.toUpperCase()];
        if (!this.score.passed) {
            rspassinfo = `${guesspasspercentage.toFixed(2)}% completed (${helper.tools.calculate.secondsToTime(curbmpasstime)}/${helper.tools.calculate.secondsToTime(this.map.total_length)})`;
            rsgrade =
                helper.vars.emojis.grades.F + `(${helper.vars.emojis.grades[this.score.rank.toUpperCase()]} if pass)`;
        }

        const fulltitle = `${this.mapset.artist} - ${this.mapset.title} [${this.map.version}]`;
        const trycountstr = `try #${this.getTryCount(this.scores, this.map.id)}`;
        const mxcombo =
            perf.difficulty.maxCombo;
        // map.max_combo;
        let modadjustments = '';
        if (this.score.mods.filter(x => x?.settings?.speed_change).length > 0) {
            modadjustments += ' (' + this.score.mods.filter(x => x?.settings?.speed_change)[0].settings.speed_change + 'x)';
        }

        let scorerank =

            this?.score?.rank_global ? ` #${this.score.rank_global} global` : '' +
                this?.score?.rank_country ? ` #${this.score.rank_country} ${this.osudata.country_code.toUpperCase()} :flag_${this.osudata.country_code.toLowerCase()}:` : ''
            ;
        if (scorerank != '') {
            scorerank = '| ' + scorerank;
        }

        let embed = new Discord.EmbedBuilder()
            .setColor(helper.vars.colours.embedColour.score.dec)
            .setAuthor({
                name: `${trycountstr} | #${helper.tools.calculate.separateNum(this.osudata?.statistics?.global_rank)} | #${helper.tools.calculate.separateNum(this.osudata?.statistics?.country_rank)} ${this.osudata.country_code} | ${helper.tools.calculate.separateNum(this.osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/users/${this.osudata.id}`,
                iconURL: `${this.osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`
            })
            .setURL(this.score.id ? `https://osu.ppy.sh/scores/${this.score.id}` : `https://osu.ppy.sh/b/${this.map.id}`)
            .setThumbnail(`${this.mapset.covers.list}`);
        embed
            .addFields([
                {
                    name: 'SCORE DETAILS',
                    value: `${helper.tools.calculate.separateNum(helper.tools.other.getTotalScore(this.score))} ${scorerank}
${(this.score.accuracy * 100).toFixed(2)}% | ${rsgrade}
${this.score.has_replay ? `[REPLAY](https://osu.ppy.sh/scores/${this.score.id}/download)\n` : ''}` +
                        `${rspassinfo.length > 1 ? rspassinfo + '\n' : ''}\`${hitlist}\`
${this.score.max_combo == mxcombo ? `**${this.score.max_combo}x**` : `${this.score.max_combo}x`}/**${mxcombo}x** combo`,
                    inline: true
                },
                {
                    name: 'PP',
                    value: `**${rspp}**pp ${fcflag}\n${ppissue}`,
                    inline: true
                }
            ]);
        switch (this.type) {
            case 'default':
                embed.setTitle(fulltitle)
                    .setDescription(`${this.score.mods.length > 0 ? '+' + osumodcalc.OrderMods(this.score.mods.map(x => x.acronym).join('').toUpperCase()).string + modadjustments + ' |' : ''} <t:${new Date(this.score.ended_at).getTime() / 1000}:R>
${(perf.difficulty.stars ?? 0).toFixed(2)}⭐ | ${helper.vars.emojis.gamemodes[this.score.ruleset_id]}
`);
                embed = helper.tools.formatter.userAuthor(this.osudata, embed, this.args.overrideAuthor);
                break;
            case 'recent':
                embed.setTitle(`#${this.args.page + 1} most recent ${this.args.showFails == 1 ? 'play' : 'pass'} for ${this.score.user.username} | <t:${new Date(this.score.ended_at).getTime() / 1000}:R>`)
                    .setDescription(`[\`${fulltitle}\`](https://osu.ppy.sh/b/${this.map.id}) ${this.score.mods.length > 0 ? '+' + osumodcalc.OrderMods(this.score.mods.map(x => x.acronym).join('').toUpperCase()).string + modadjustments : ''} 
${(perf.difficulty.stars ?? 0).toFixed(2)}⭐ | ${helper.vars.emojis.gamemodes[this.score.ruleset_id]}
${helper.tools.formatter.dateToDiscordFormat(new Date(this.score.ended_at), 'F')}
`);

                break;
        }

        this.ctn.embeds = [embed];
    }
    async getStrains(map: apitypes.Beatmap, score: apitypes.Score) {
        const strains = await helper.tools.performance.calcStrains({
            mapid: map.id,
            mode: score.ruleset_id,
            mods: score.mods.map(x => x.acronym).join(''),
            mapLastUpdated: new Date(map.last_updated)
        });
        try {
            helper.tools.data.debug(strains, 'command', 'recent', this.input.message?.guildId ?? this.input.interaction?.guildId, 'strains');
        } catch (error) {
            helper.tools.data.debug({ error: error }, 'command', 'recent', this.input.message?.guildId ?? this.input.interaction?.guildId, 'strains');
            helper.tools.log.stdout(error);
        }
        let strainsgraph =
            await helper.tools.other.graph(strains.strainTime, strains.value, 'Strains', {
                startzero: true,
                type: 'bar',
                fill: true,
                displayLegend: false,
                title: 'Strains',
                imgUrl: helper.tools.api.mapImages(map.beatmapset_id).full,
                blurImg: true,
            });
        this.ctn.files = [strainsgraph.path];
    }
    getTryCount(scores: apitypes.Score[], mapid: number) {
        let trycount = 1;
        for (let i = scores.length - 1; i > (this.args.page); i--) {
            if (mapid == scores[i].beatmap.id) {
                trycount++;
            }
        }
        return trycount;
    }
}

export class ScoreParse extends SingleScoreCommand {

    declare protected args: {
        mode: apitypes.GameMode;
        scoreid: number | string;
        nochoke: boolean;
        overrideAuthor: string;
    };
    constructor() {
        super();
        this.type = 'default';
        this.args = {
            mode: null,
            scoreid: null,
            nochoke: false,
            overrideAuthor: null,
        };
    }
    async setArgsMsg() {
        this.args.mode = this.input.args[1] as apitypes.GameMode;
        this.args.scoreid = this.input.args[0];
        if (this.input?.args[0]?.includes('https://')) {
            const temp = helper.tools.commands.scoreIdFromLink(this.input.args[0]);
            this.args.mode = temp.mode;
            this.args.scoreid = temp.id;
        }
    }
    async setArgsLink() {
        const messagenohttp = this.input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
        const temp = helper.tools.commands.scoreIdFromLink(messagenohttp);
        this.args.mode = temp.mode;
        this.args.scoreid = temp.id;
    }

    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides?.id != null) {
            this.args.scoreid = this.input.overrides.id;
        }
        if (this.input.overrides?.mode != null) {
            this.args.mode = this.input.overrides.mode;
        }
        if (this.input.overrides?.commanduser != null) {
            this.commanduser = this.input.overrides.commanduser;
        }
        if (this.input.overrides?.commandAs != null) {
            this.input.type = this.input.overrides.commandAs;
        }
        if (this.input.overrides?.ex != null) {
            this.args.overrideAuthor = this.input.overrides.ex as string;
        }
        if (this.input.overrides?.type == 'nochoke') {
            this.args.nochoke = true;
        }
    }
    async execute() {
        await this.setArgs();
        this.getOverrides();
        this.logInput();
        // do stuff

        if (!this.args.scoreid) {
            const temp = helper.tools.data.getPreviousId('score', this.input.message?.guildId ?? this.input.interaction?.guildId);
            if (temp?.apiData?.best_id && typeof temp?.apiData?.best_id === 'number') {
                this.args.scoreid = temp?.apiData?.best_id;
            } else {
                await helper.tools.commands.sendMessage({
                    type: this.input.type,
                    message: this.input.message,
                    interaction: this.input.interaction,
                    args: {
                        content: helper.vars.errors.uErr.osu.score.ms,
                        edit: true
                    }
                }, this.input.canReply);
                return;
            }
        }

        if (this.input.type == 'interaction') {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: 'Loading...'
                }
            }, this.input.canReply);
        }

        let scoredataReq: tooltypes.apiReturn<apitypes.Score>;

        if (helper.tools.data.findFile(this.args.scoreid, 'scoredata') &&
            !('error' in helper.tools.data.findFile(this.args.scoreid, 'scoredata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            scoredataReq = helper.tools.data.findFile(this.args.scoreid, 'scoredata');
        } else {
            scoredataReq = await (this.args.mode ?
                helper.tools.api.getScoreWithMode(this.args.scoreid, this.args.mode, []) :
                helper.tools.api.getScore(this.args.scoreid, []));

        }

        this.score = scoredataReq.apiData;
        if (scoredataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, 'scoreparse', true, helper.vars.errors.uErr.osu.score.nd
                .replace('[SID]', this.args.scoreid.toString())
                .replace('[MODE]', this.args.mode), false);
            return;
        }

        if (this.score?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, 'scoreparse', true, helper.vars.errors.uErr.osu.score.nd
                .replace('[SID]', this.args.scoreid.toString())
                .replace('[MODE]', this.args.mode), true);
            return;
        }
        helper.tools.data.storeFile(scoredataReq, this.args.scoreid, 'scoredata', helper.tools.other.modeValidator(this.score.ruleset_id));

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Map-scoreparse-any-${this.input.id}-${this.score?.beatmap?.id}${this.score.mods ? '+' + this.score.mods.map(x => x.acronym).join() : ''}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.map),
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-User-scoreparse-any-${this.input.id}-${this.score.user_id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );

        this.ctn.components = [buttons];

        helper.tools.data.debug(scoredataReq, 'command', 'scoreparse', this.input.message?.guildId ?? this.input.interaction?.guildId, 'scoreData');
        try {
            this.score.rank.toUpperCase();
        } catch (error) {
            await helper.tools.commands.errorAndAbort(this.input, 'scoreparse', true, helper.vars.errors.uErr.osu.score.wrong + ` - osu.ppy.sh/scores/${this.args.mode}/${this.args.scoreid}`, true);
            return;
        }
        let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
        if (helper.tools.data.findFile(this.score.beatmap.id, 'mapdata') &&
            !('error' in helper.tools.data.findFile(this.score.beatmap.id, 'mapdata')) &&
            this.input.buttonType != 'Refresh') {
            mapdataReq = helper.tools.data.findFile(this.score.beatmap.id, 'mapdata');
        } else {
            mapdataReq = await helper.tools.api.getMap(this.score.beatmap.id);
        }

        this.map = mapdataReq.apiData;
        if (mapdataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, 'scoreparse', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', `${this.score.beatmap.id}`), false);
            return;
        }
        if (this.map?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, 'scoreparse', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', this.score.beatmap.id.toString()), true);
            return;
        }

        helper.tools.data.storeFile(mapdataReq, this.score.beatmap.id, 'mapdata');

        this.mapset = this.map.beatmapset;

        let osudataReq: tooltypes.apiReturn<apitypes.User>;

        if (helper.tools.data.findFile(this.score.user.username, 'osudata', helper.tools.other.modeValidator(this.score.ruleset_id)) &&
            !('error' in helper.tools.data.findFile(this.score.user.username, 'osudata', helper.tools.other.modeValidator(this.score.ruleset_id))) &&
            this.input.buttonType != 'Refresh'
        ) {
            osudataReq = helper.tools.data.findFile(this.score.user.username, 'osudata', helper.tools.other.modeValidator(this.score.ruleset_id));
        } else {
            osudataReq = await helper.tools.api.getUser(this.score.user.username, helper.tools.other.modeValidator(this.score.ruleset_id), []);
        }

        this.osudata = osudataReq.apiData;
        if (osudataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, 'scoreparse', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', this.score.user.username), false);
            return;
        }
        helper.tools.data.debug(osudataReq, 'command', 'scoreparse', this.input.message?.guildId ?? this.input.interaction?.guildId, 'osuData');
        if (this.osudata?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, 'scoreparse', true, `${helper.vars.errors.uErr.osu.profile.user
                .replace('[ID]', this.score?.user?.username)
                } AKA ${this.score.user.username}`, true);
            return;
        }

        helper.tools.data.userStatsCache([this.osudata], helper.tools.other.modeValidator(this.score.ruleset_id), 'User');

        helper.tools.data.storeFile(osudataReq, this.osudata.id, 'osudata', helper.tools.other.modeValidator(this.score.ruleset_id));
        helper.tools.data.storeFile(osudataReq, this.score.user.username, 'osudata', helper.tools.other.modeValidator(this.score.ruleset_id));

        await this.renderEmbed();

        helper.tools.data.writePreviousId('score', this.input.message?.guildId ?? this.input.interaction?.guildId,
            {
                id: `${this.score.id}`,
                apiData: this.score,
                mods: this.score.mods.map(x => x.acronym).join()
            });
        helper.tools.data.writePreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId,
            {
                id: `${this.map.id}`,
                apiData: null,
                mods: this.score.mods.map(x => x.acronym).join()
            }
        );
        this.getStrains(this.map, this.score);
        this.send();
    }


}

export class Recent extends SingleScoreCommand {
    declare protected args: {
        user: string;
        searchid: string;
        page: number;
        mode: apitypes.GameMode;
        showFails: boolean;
        filter: string;
        filterRank: apitypes.Rank;
    };
    constructor() {
        super();
        this.type = 'recent';
        this.args = {
            user: undefined,
            searchid: undefined,
            page: 0,
            mode: null,
            showFails: true,
            filter: null,
            filterRank: null,
        };
    }

    async setArgsMsg() {
        this.args.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        const passArgFinder = helper.tools.commands.matchArgMultiple(['-nf', '-nofail', '-pass', '-passes', 'passes=true'], this.input.args, false, null, false, false);
        if (passArgFinder.found) {
            this.args.showFails = false;
            this.input.args = passArgFinder.args;
        }
        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, this.input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.args.page = pageArgFinder.output;
            this.input.args = pageArgFinder.args;
        }
        const titleArgFinder = helper.tools.commands.matchArgMultiple(["-?"], this.input.args, true, 'string', true, false);
        if (titleArgFinder.found) {
            this.args.filter = titleArgFinder.output;
            this.input.args = titleArgFinder.args;
        }

        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.args.mode = temp.mode;
        }

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        const usertemp = helper.tools.commands.fetchUser(this.input.args);
        this.args.user = usertemp.id;
        if (usertemp.mode && !this.args.mode) {
            this.args.mode = usertemp.mode;
        }
        if (!this.args.user || this.args.user.includes(this.args.searchid)) {
            this.args.user = null;
        }
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.args.user = interaction.options.getString('user');
        this.args.page = interaction.options.getNumber('page');
        this.args.mode = interaction.options.getString('mode') as apitypes.GameMode;
        this.args.filter = interaction.options.getString('filter');
    }
    async setArgsBtn() {
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
        this.args.searchid = temp.searchid;
        this.args.user = temp.user;
        this.args.mode = temp.mode;
        this.args.page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, this.input.buttonType);
        this.args.showFails = temp.fails;
        this.args.filter = temp.filterTitle;
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page != null) {
            this.args.page = +(`${this.input.overrides.page}`);
        }
        if (this.input.overrides.mode != null) {
            this.args.mode = this.input.overrides.mode;
        }
    }
    async execute() {
        await this.setArgs();
        this.getOverrides();
        this.logInput();
        // do stuff

        const buttons = new Discord.ActionRowBuilder();



        //if user is null, use searchid
        if (this.args.user == null) {
            const cuser = await helper.tools.data.searchUser(this.args.searchid, true);
            this.args.user = cuser.username;
            if (this.args.mode == null) {
                this.args.mode = cuser.gamemode;
            }
        }

        //if user is not found in database, use discord username
        if (this.args.user == null) {
            const cuser = helper.vars.client.users.cache.get(this.args.searchid);
            this.args.user = cuser.username;
        }

        this.args.mode = helper.tools.other.modeValidator(this.args.mode);

        if (this.args.page < 2 || typeof this.args.page != 'number') {
            this.args.page = 1;
        }
        this.args.page--;

        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('recent', this.commanduser, this.input.id);

        if (this.input.type == 'interaction') {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: 'Loading...'
                }
            }, this.input.canReply);
        }
        let osudataReq: tooltypes.apiReturn<apitypes.User>;

        if (helper.tools.data.findFile(this.args.user, 'osudata', helper.tools.other.modeValidator(this.args.mode)) &&
            !('error' in helper.tools.data.findFile(this.args.user, 'osudata', helper.tools.other.modeValidator(this.args.mode))) &&
            this.input.buttonType != 'Refresh'
        ) {
            osudataReq = helper.tools.data.findFile(this.args.user, 'osudata', helper.tools.other.modeValidator(this.args.mode));
        } else {
            osudataReq = await helper.tools.api.getUser(this.args.user, this.args.mode, []);
        }

        this.osudata = osudataReq.apiData;
        if (osudataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, 'recent', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', this.args.user), false);
            return;
        }
        helper.tools.data.debug(osudataReq, 'command', 'recent', this.input.message?.guildId ?? this.input.interaction?.guildId, 'osuData');

        if (this.osudata?.hasOwnProperty('error') || !this.osudata.id) {
            await helper.tools.commands.errorAndAbort(this.input, 'recent', true, helper.vars.errors.noUser(this.args.user), true);
            return;
        }

        helper.tools.data.userStatsCache([this.osudata], helper.tools.other.modeValidator(this.args.mode), 'User');

        helper.tools.data.storeFile(osudataReq, this.osudata.id, 'osudata', helper.tools.other.modeValidator(this.args.mode));
        helper.tools.data.storeFile(osudataReq, this.args.user, 'osudata', helper.tools.other.modeValidator(this.args.mode));

        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-User-recent-any-${this.input.id}-${this.osudata.id}+${this.osudata.playmode}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.user),
        );

        let rsdataReq: tooltypes.apiReturn<apitypes.Score[]>;
        if (helper.tools.data.findFile(this.input.id, 'rsdata') &&
            this.input.type == 'button' &&
            !('error' in helper.tools.data.findFile(this.input.id, 'rsdata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            rsdataReq = helper.tools.data.findFile(this.input.id, 'rsdata');
        } else {
            rsdataReq = await helper.tools.api.getScoresRecent(this.osudata.id, this.args.mode, [`include_fails=${+this.args.showFails}`]);
        }

        this.scores = rsdataReq.apiData;
        if (rsdataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, 'recent', true, helper.vars.errors.uErr.osu.scores.recent.replace('[ID]', this.args.user), false);
            return;
        }
        helper.tools.data.debug(rsdataReq, 'command', 'recent', this.input.message?.guildId ?? this.input.interaction?.guildId, 'rsData');
        if (this.scores?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, 'recent', true, helper.vars.errors.uErr.osu.scores.recent.replace('[ID]', this.args.user), true);
            return;
        }

        helper.tools.data.storeFile(rsdataReq, this.input.id, 'rsdata');

        if (this.args.filter) {
            this.scores = helper.tools.other.filterScoreQuery(this.scores, this.args.filter);
        }

        this.ctn.components = [pgbuttons, buttons];

        this.args.page = this.scores[this.args.page] ? this.args.page : 0;

        if (this.input.buttonType == 'BigRightArrow') {
            this.args.page = this.scores.length - 1;
        }

        this.score = this.scores[this.args.page];
        if (!this.score || this.score == undefined || this.score == null) {
            let err = `${helper.vars.errors.uErr.osu.scores.recent_ms
                .replace('[ID]', this.args.user)
                .replace('[MODE]', helper.vars.emojis.gamemodes[helper.tools.other.modeValidator(this.args.mode)])
                }`;
            if (this.args.filter) {
                err = `${helper.vars.errors.uErr.osu.scores.recent_ms
                    .replace('[ID]', this.args.user)
                    .replace('[MODE]', helper.vars.emojis.gamemodes[helper.tools.other.modeValidator(this.args.mode)])
                    } matching \`${this.args.filter}\``;
            }

            if (this.input.buttonType == null) {
                await helper.tools.commands.sendMessage({
                    type: this.input.type,
                    message: this.input.message,
                    interaction: this.input.interaction,
                    args: {
                        content: err,
                        edit: true
                    }
                }, this.input.canReply);
            }
            return;
        }
        this.map = this.score.beatmap;
        this.mapset = this.score.beatmapset;

        let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
        if (helper.tools.data.findFile(this.map.id, 'mapdata') &&
            !('error' in helper.tools.data.findFile(this.map.id, 'mapdata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            mapdataReq = helper.tools.data.findFile(this.map.id, 'mapdata');
        } else {
            mapdataReq = await helper.tools.api.getMap(this.map.id);
        }
        const mapdata: apitypes.Beatmap = mapdataReq.apiData;
        if (mapdataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, 'recent', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', `${this.map.id}`), false);
            return;
        }
        helper.tools.data.debug(mapdataReq, 'command', 'recent', this.input.message?.guildId ?? this.input.interaction?.guildId, 'mapData');
        if (mapdata?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, 'recent', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', this.map.id + ''), true);
            return;
        }

        helper.tools.data.storeFile(mapdataReq, this.map.id, 'mapdata');

        await this.renderEmbed();
        await this.getStrains(this.map, this.score);

        this.send();
    }

}