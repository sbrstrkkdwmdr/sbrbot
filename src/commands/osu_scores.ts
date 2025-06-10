import Discord from 'discord.js';
import fs from 'fs';
import moment from 'moment';
import * as osuclasses from 'osu-classes';
import * as osuparsers from 'osu-parsers';
import * as osumodcalc from 'osumodcalculator';
import * as rosu from 'rosu-pp-js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';
import { OsuCommand } from './command.js';

export class ScoreListCommand extends OsuCommand {
    declare protected params: {
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
        this.params = {
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
    async setParamsMsg() {
        this.params.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        if (this.input.args.includes('-parse')) {
            this.params.parseScore = true;
            const temp = helper.tools.commands.parseArg(this.input.args, '-parse', 'number', 1, null, true);
            this.params.parseId = temp.value;
            this.input.args = temp.newArgs;
        }

        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, this.input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.params.page = pageArgFinder.output;
            this.input.args = pageArgFinder.args;
        }
        const detailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.details, this.input.args, false, null, false, false);
        if (detailArgFinder.found) {
            this.params.detailed = 2;
            this.input.args = detailArgFinder.args;
        }
        const lessDetailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.compress, this.input.args, false, null, false, false);
        if (lessDetailArgFinder.found) {
            this.params.detailed = 0;
            this.input.args = lessDetailArgFinder.args;
        }
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }
        const reverseArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['rev', 'reverse',]), this.input.args, false, null, false, false);
        if (reverseArgFinder.found) {
            this.params.reverse = true;
            this.input.args = reverseArgFinder.args;
        }
        if (this.input.args.includes('-mods')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-mods', 'string', this.params.modsInclude, false);
            this.params.modsInclude = temp.value;
            this.input.args = temp.newArgs;
        }
        const mxmodArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['mx', 'modx',]), this.input.args, true, 'string', false, false);
        if (mxmodArgFinder.found) {
            this.params.modsExact = mxmodArgFinder.output;
            this.input.args = mxmodArgFinder.args;
        }
        if (this.input.args.includes('-exmod')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-exmod', 'string', this.params.modsExclude, false);
            this.params.modsExclude = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-me')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-me', 'string', this.params.modsExclude, false);
            this.params.modsExclude = temp.value;
            this.input.args = temp.newArgs;
        }
        const exmodArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['me', 'exmod',]), this.input.args, true, 'string', false, false);
        if (exmodArgFinder.found) {
            this.params.modsExclude = exmodArgFinder.output;
            this.input.args = exmodArgFinder.args;
        }

        if (this.input.args.includes('-sort')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-sort', 'string', this.params.sort, false);
            this.params.sort = temp.value;
            this.input.args = temp.newArgs;
        }
        const recentArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['r', 'recent',]), this.input.args, false, null, false, false);
        if (recentArgFinder.found) {
            this.params.sort = 'recent';
            this.input.args = recentArgFinder.args;
        }
        if (this.input.args.includes('-performance')) {
            this.params.sort = 'pp';
            this.input.args.splice(this.input.args.indexOf('-performance'), 1);
        }
        if (this.input.args.includes('-pp')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-pp', 'string', this.params.pp, false);
            this.params.pp = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-score')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-score', 'string', this.params.score, false);
            this.params.score = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-acc')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-acc', 'string', this.params.acc, false);
            this.params.acc = temp.value;
            this.input.args = temp.newArgs;
        }
        const filterComboArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['combo', 'maxcombo']), this.input.args, true, 'string', false, true);
        if (filterComboArgFinder.found) {
            this.params.combo = filterComboArgFinder.output;
            this.input.args = filterComboArgFinder.args;
        }
        const filterMissArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['miss', 'misses']), this.input.args, true, 'string', false, true);
        if (filterMissArgFinder.found) {
            this.params.miss = filterMissArgFinder.output;
            this.input.args = filterMissArgFinder.args;
        }
        const fcArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['fc', 'fullcombo',]), this.input.args, false, null, false, false);
        if (fcArgFinder.found) {
            this.params.miss = '0';
            this.input.args = fcArgFinder.args;
        }
        const filterRankArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['rank', 'grade', 'letter']), this.input.args, true, 'string', false, false);
        if (filterRankArgFinder.found) {
            this.params.filterRank = filterRankArgFinder.output;
            this.input.args = filterRankArgFinder.args;
        }
        if (this.input.args.includes('-bpm')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-bpm', 'string', this.params.bpm, false);
            this.params.bpm = temp.value;
            this.input.args = temp.newArgs;
        }

        const titleArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.filterTitle, this.input.args, true, 'string', true, false);
        if (titleArgFinder.found) {
            this.params.filterTitle = titleArgFinder.output;
            this.input.args = titleArgFinder.args;
        }
        const mapperArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.filterCreator, this.input.args, true, 'string', true, false);
        if (mapperArgFinder.found) {
            this.params.filteredMapper = mapperArgFinder.output;
            this.input.args = mapperArgFinder.args;
        }
        const artistArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.filterArtist, this.input.args, true, 'string', true, false);
        if (artistArgFinder.found) {
            this.params.filterArtist = artistArgFinder.output;
            this.input.args = artistArgFinder.args;
        }
        const versionArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.filterVersion, this.input.args, true, 'string', true, false);
        if (versionArgFinder.found) {
            this.params.filterDifficulty = versionArgFinder.output;
            this.input.args = versionArgFinder.args;
        }
        this.input.args = helper.tools.commands.cleanArgs(this.input.args);
        if (this.input.args.join(' ').includes('+')) {
            this.params.modsInclude = this.input.args.join(' ').split('+')[1];
            this.params.modsInclude.includes(' ') ? this.params.modsInclude = this.params.modsInclude.split(' ')[0] : null;
            this.input.args = this.input.args.join(' ').replace('+', '').replace(this.params.modsInclude, '').split(' ');
        }

        await this.paramsMsgExtra();

        const usertemp = helper.tools.commands.fetchUser(this.input.args);
        this.params.user = usertemp.id;
        if (usertemp.mode && !this.params.mode) {
            this.params.mode = usertemp.mode;
        }
        // if (!this.params.user || this.params.user.includes(this.params.searchid)) {
        //     this.params.user = null;
        // }
    }
    async setParamsInteract() {
        let interaction = this.input.interaction as Discord.ChatInputCommandInteraction;

        this.params.searchid = interaction?.member?.user?.id ?? interaction?.user.id;
        this.params.user = interaction.options.getString('user') ?? undefined;
        this.params.page = interaction.options.getInteger('page') ?? 0;
        this.params.detailed = interaction.options.getBoolean('detailed') ? 1 : 0;
        this.params.sort = interaction.options.getString('sort') as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
        this.params.reverse = interaction.options.getBoolean('reverse') ?? false;
        this.params.mode = (interaction.options.getString('mode') ?? 'osu') as apitypes.GameMode;
        this.params.filteredMapper = interaction.options.getString('mapper') ?? null;
        this.params.filterTitle = interaction.options.getString('filter') ?? null;
        this.params.parseId = interaction.options.getInteger('parse') ?? null;
        this.params.parseScore = this.params.parseId != null ? true : false;
        this.params.modsInclude = interaction.options.getString('mods') ?? null;
        this.params.modsExact = interaction.options.getString('modsExact') ?? null;
        this.params.modsExclude = interaction.options.getString('modsExclude') ?? null;
        this.params.filterRank = interaction.options.getString('filterRank') ? osumodcalc.checkGrade(interaction.options.getString('filterRank')) : null;
        this.params.pp = interaction.options.getString('pp') ?? null;
        this.params.score = interaction.options.getString('score') ?? null;
        this.params.acc = interaction.options.getString('acc') ?? null;
        this.params.combo = interaction.options.getString('combo') ?? null;
        this.params.miss = interaction.options.getString('miss') ?? null;
        this.params.bpm = interaction.options.getString('bpm') ?? null;
        await this.paramsInteractExtra();
    }
    async setParamsBtn() {
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

        this.params.user = temp?.user;
        this.params.searchid = temp?.searchid;
        this.params.page = temp?.page;
        this.params.mode = temp?.mode;
        this.params.filteredMapper = temp?.filterMapper;
        this.params.modsInclude = temp?.modsInclude;
        this.params.modsExact = temp?.modsExact;
        this.params.modsExclude = temp?.modsExclude;
        this.params.filterTitle = temp?.filterTitle;
        this.params.filterRank = temp?.filterRank;
        this.params.parseId = null;
        this.params.parseScore = null;
        this.params.pp = temp?.filterPp;
        this.params.score = temp?.filterScore;
        this.params.acc = temp?.filterAcc;
        this.params.combo = temp?.filterCombo;
        this.params.miss = temp?.filterMiss;
        this.params.bpm = temp?.filterBpm;
        this.params.sort = temp?.sort as any;
        this.params.reverse = temp?.reverse;

        switch (this.input.buttonType) {
            case 'BigLeftArrow':
                this.params.page = 1;
                break;
            case 'LeftArrow':
                this.params.page -= 1;
                break;
            case 'RightArrow':
                this.params.page += 1;
                break;
            case 'BigRightArrow':
                this.params.page = temp?.page;
                break;
        }

        switch (this.input.buttonType) {
            case 'Detail0':
                this.params.detailed = 0;
                break;
            case 'Detail1':
                this.params.detailed = 1;
                break;
            case 'Detail2':
                this.params.detailed = 2;
                break;
            default:
                if (this.input.message.embeds[0].footer.text.includes('LE')) {
                    this.params.detailed = 2;
                }
                if (this.input.message.embeds[0].footer.text.includes('LC')) {
                    this.params.detailed = 0;
                }
                break;
        }
        await this.paramsButtonsExtra();
    }
    paramsMsgExtra() { };
    paramsInteractExtra() { };
    paramsButtonsExtra() { };

    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page != null) {
            this.params.page = this.input.overrides.page;
        }
        if (this.input.overrides.sort != null) {
            this.params.sort = this.input.overrides.sort as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
        }
        if (this.input.overrides.reverse != null) {
            this.params.reverse = this.input.overrides.reverse;
        }
        if (this.input.overrides.commandAs) {
            this.input.type = this.input.overrides.commandAs;
        }
        if (this.input.overrides.user) {
            this.params.user = this.input.overrides.user;
        }
        if (this.input.overrides.mode) {
            this.params.mode = this.input.overrides.mode;
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
                fname = 'recentscoresdata';
                getid = this.input.id + '';
                break;
            case 'map':
                fname = 'mapscoresdata';
                getid = this.input.id + '';
                break;
            case 'firsts':
                fname = 'firstsdata';
                getid = this.input.id + '';
                break;
            case 'pinned':
                fname = 'pinneddata';
                break;
        }
        if (this.type == 'map') {
            try {
                this.map = await this.getMap(+this.params.mapid);
            } catch (e) {
                return;
            }
        }
        if (helper.tools.data.findFile(getid, fname) &&
            this.input.type == 'button' &&
            !('error' in helper.tools.data.findFile(getid, fname)) &&
            this.input.buttonType != 'Refresh'
        ) {
            req = helper.tools.data.findFile(getid, fname);
        } else {
            switch (this.type) {
                case 'osutop': case 'nochokes':
                    req = await helper.tools.api.getScoresBest(this.osudata.id, this.params.mode, []);
                    break;
                case 'recent':
                    req = await helper.tools.api.getScoresRecent(this.osudata.id, this.params.mode, [`include_fails=1`]);
                    break;
                case 'map': {
                    req = await helper.tools.api.getUserMapScores(this.osudata.id, this.params.mapid as number, []);
                }
                    break;
                case 'firsts':
                    req = await helper.tools.api.getScoresFirst(this.osudata.id, this.params.mode, []);
                    break;
                case 'pinned':
                    req = await helper.tools.api.getScoresPinned(this.osudata.id, this.params.mode, []);
                    break;
            }
        }

        if (req?.error) {
            await commitError(this.type, this.input, this.params);
        }

        const tempscores: apitypes.Score[] & apitypes.Error =
            this.type == 'map' ?
                (req.apiData as apitypes.ScoreArrA).scores
                :
                req.apiData as apitypes.Score[];

        helper.tools.data.debug(req, 'command', this.type, this.input.message?.guildId ?? this.input.interaction?.guildId, this.type + 'data');
        helper.tools.data.storeFile(req, getid, fname);

        if (tempscores?.hasOwnProperty('error') || !(tempscores[0]?.user?.username || tempscores[0]?.user_id)) {
            await commitError(this?.type, this.input, this.params);
        }

        if (this.type == 'nochokes') {
            for (let i = 0; i < tempscores.length; i++) {
                if (tempscores[i]?.statistics?.miss > 0) {
                    const curscore = tempscores[i];
                    curscore.pp = null;
                    curscore.is_perfect_combo = true;
                    curscore.legacy_perfect = true;
                    tempscores[i] = curscore;
                }
            }
        }

        this.scores = tempscores;

        async function commitError(type: string, input, args) {
            switch (type) {
                case 'osutop': case 'nochokes':
                    await helper.tools.commands.errorAndAbort(input, type, true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', args.user), true);
                    break;
                case 'recent':
                    await helper.tools.commands.errorAndAbort(input, type, true, helper.vars.errors.uErr.osu.scores.recent.replace('[ID]', args.user), true);
                    break;
                case 'map':
                    await helper.tools.commands.errorAndAbort(input, type, true, helper.vars.errors.uErr.osu.scores.map.replace('[ID]', args.user).replace('[MID]', args.mapid + ''), true);
                    break;
                case 'firsts':
                    await helper.tools.commands.errorAndAbort(input, type, true, helper.vars.errors.uErr.osu.scores.first.replace('[ID]', args.user), true);
                    break;
                case 'pinned':
                    await helper.tools.commands.errorAndAbort(input, type, true, helper.vars.errors.uErr.osu.scores.pinned.replace('[ID]', args.user), true);
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
                if (this.params.sort == 'pp') {
                    return 'Recent best scores for ' + this.osudata.username;
                }
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
        let seturl = '';
        switch (this.type) {
            case 'recent':
                seturl = `https://osu.ppy.sh/users/${this.osudata.id}/${osumodcalc.ModeIntToName(this.scores?.[0]?.ruleset_id)}#historical`;
                break;
            case 'map':
                seturl = `https://osu.ppy.sh/b/${this.map.id}`;
                break;
            default:
                seturl = `https://osu.ppy.sh/users/${this.osudata.id}/${osumodcalc.ModeIntToName(this.scores?.[0]?.ruleset_id)}#top_ranks`;
                break;
        }
        const scoresEmbed = new Discord.EmbedBuilder()
            .setColor(helper.vars.colours.embedColour.scorelist.dec)
            .setTitle(this.toName(map))
            .setThumbnail(`${this.osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
            .setURL(seturl);
        helper.tools.formatter.userAuthor(this.osudata, scoresEmbed);

        const scoresFormat = await helper.tools.formatter.scoreList(this.scores, this.params.sort,
            {
                mapper: this.params.filteredMapper,
                modsInclude: this.params.modsInclude,
                title: this.params.filterTitle,
                artist: this.params.filterArtist,
                version: this.params.filterDifficulty,
                rank: this.params.filterRank,
                modsExact: this.params.modsExact,
                modsExclude: this.params.modsExclude,
                pp: this.params.pp,
                score: this.params.score,
                acc: this.params.acc,
                combo: this.params.combo,
                miss: this.params.miss,
                bpm: this.params.bpm,
                isnochoke: this.type == 'nochokes'
            }, this.params.reverse, this.params.detailed, this.params.page, true,
            this.type == 'map' ? 'single_map' : undefined, map ?? undefined
        );

        helper.tools.commands.storeButtonArgs(this.input.id + '', {
            user: this.params.user,
            searchid: this.params.searchid,
            page: this.params.page,
            mode: this.params.mode,
            filterMapper: this.params.filteredMapper,
            modsInclude: this.params.modsInclude,
            modsExact: this.params.modsExact,
            modsExclude: this.params.modsExclude,
            filterTitle: this.params.filterTitle,
            filterRank: this.params.filterRank,
            filterPp: this.params.pp,
            filterScore: this.params.score,
            filterAcc: this.params.acc,
            filterCombo: this.params.combo,
            filterMiss: this.params.miss,
            filterBpm: this.params.bpm,
            sort: this.params.sort,
            reverse: this.params.reverse,
            ...{ maxPage: scoresFormat.maxPage }
        });

        scoresEmbed.setFooter({
            text: `${scoresFormat.curPage}/${scoresFormat.maxPage} | ${this.params.mode ?? osumodcalc.ModeIntToName(this.scores?.[0]?.ruleset_id)}`
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
        await this.setParams();
        this.getOverrides();
        this.logInput();

        {
            const t = await this.validUser(this.params.user, this.params.searchid, this.params.mode);
            this.params.user = t.user;
            this.params.mode = t.mode;
        }

        this.params.mode = helper.tools.other.modeValidator(this.params.mode);

        if (this.type == 'map') {
            if (!this.params.mapid) {
                const temp = helper.tools.data.getPreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId);
                this.params.mapid = temp.id;
            }
            if (this.params.mapid == false) {
                helper.tools.commands.missingPrevID_map(this.input, this.name);
                return;
            }
        }


        this.pgbuttons = await helper.tools.commands.pageButtons(this.name, this.commanduser, this.input.id);
        this.buttons = new Discord.ActionRowBuilder();

        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        if (this.params.page < 2 || typeof this.params.page != 'number' || isNaN(this.params.page)) {
            this.params.page = 1;
        }

        try {
            const u = await this.getProfile(this.params.user, this.params.mode);
            this.osudata = u;
        } catch (e) {
            return;
        }

        this.buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-User-${this.name}-any-${this.input.id}-${this.osudata.id}+${this.osudata.playmode}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.user),
        );
        try {
            await this.getScores();
        } catch (e) {
            console.log(e);
            return;
        }

        if (this.params.parseScore) {
            let pid = +(this.params.parseId) - 1;
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
                    this.input.overrides.ex = `${user}'s #${helper.tools.calculate.toOrdinal(pid + 1)} ${this.params.sort == 'pp' ? helper.tools.formatter.sortDescription(this.params.sort ?? 'pp', this.params.reverse) + ' ' : ''}top score`;
                    break;
                case 'nochokes':
                    this.input.overrides.ex = `${user}'s #${helper.tools.calculate.toOrdinal(pid + 1)} ${this.params.sort == 'pp' ? helper.tools.formatter.sortDescription(this.params.sort ?? 'pp', this.params.reverse) + ' ' : ''}no choke score`;
                    this.input.overrides.type = 'nochoke';
                    break;
                case 'firsts':
                    this.input.overrides.ex = `${user}'s ${helper.tools.calculate.toOrdinal(pid + 1)} ${this.params.sort == 'recent' ? helper.tools.formatter.sortDescription(this.params.sort ?? 'recent', this.params.reverse) + ' ' : ''}#1 score`;
                    break;
                case 'pinned':
                    this.input.overrides.ex = `${user}'s ${helper.tools.calculate.toOrdinal(pid + 1)} ${this.params.sort == 'recent' ? helper.tools.formatter.sortDescription(this.params.sort ?? 'recent', this.params.reverse) + ' ' : ''}pinned score`;
                    break;
            }
            if (this.input.overrides.id == null || typeof this.input.overrides.id == 'undefined') {
                await helper.tools.commands.errorAndAbort(this.input, this.name, true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
                return;
            }
            this.input.type = 'other';
            const cmd = new ScoreParse();
            cmd.setInput(this.input);
            await cmd.execute();
            return;
        }

        await this.list(this?.map);
        this.ctn.edit = true;

        this.send();
    }
}

export class Firsts extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'firsts';
        this.name = 'Firsts';
    }
}

export class OsuTop extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'osutop';
        this.name = 'OsuTop';
    }
}

export class NoChokes extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'nochokes';
        this.name = 'NoChokes';
        this.params.sort = 'pp';
    }
}

export class Pinned extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'pinned';
        this.name = 'Pinned';
    }
}
export class RecentList extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'recent';
        this.name = 'RecentList';
    }
    async argsMsgExtra(): Promise<void> {

    }
}

export class MapScores extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'map';
        this.name = 'MapScores';
    }
    async argsMsgExtra(): Promise<void> {
        this.params.mapid = (await helper.tools.commands.mapIdFromLink(this.input.args.join(' '), true,)).map;
        if (this.params.mapid != null) {
            this.input.args.splice(this.input.args.indexOf(this.input.args.find(arg => arg.includes('https://osu.ppy.sh/'))), 1);
        }
    }
    async argsInteractExtra(): Promise<void> {
        let interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.mapid = interaction.options.getNumber('id');
    }
    async argsButtonsExtra(): Promise<void> {

    }

    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page != null) {
            this.params.page = this.input.overrides.page;
        }
        if (this.input.overrides.sort != null) {
            this.params.sort = this.input.overrides.sort as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
        }
        if (this.input.overrides.reverse != null) {
            this.params.reverse = this.input.overrides.reverse;
        }
        if (this.input.overrides.commandAs) {
            this.input.type = this.input.overrides.commandAs;
        }
        if (this.input.overrides.commanduser) {
            this.commanduser = this.input.overrides.commanduser;
            this.ctn.content = `Requested by <@${this.commanduser.id}>`;
        }
        if (this.input.overrides.user) {
            this.params.user = this.input.overrides.user;
        }
        if (this.input.overrides.id) {
            this.params.mapid = this.input.overrides.id;
        }
    }
}

export class SingleScoreCommand extends OsuCommand {
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
        switch (this.params.detailed) {
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
        let perfs: rosu.PerformanceAttributes[];
        let fcflag = '';
        try {
            const overrides = helper.tools.calculate.modOverrides(this.score.mods);
            perfs = await helper.tools.performance.fullPerformance(
                this.score.beatmap.id,
                this.score.ruleset_id,
                this.score.mods.map(x => x.acronym).join('').length > 1 ?
                    this.score.mods.map(x => x.acronym).join('') : 'NM',
                this.score.accuracy,
                overrides.speed,
                this.score.statistics,
                this.score.max_combo,
                failed.objectsHit,
                new Date(this.score.beatmap.last_updated),
                overrides.cs,
                overrides.ar,
                overrides.od,
                overrides.hp,
            );
            rspp =
                this.score.pp ?
                    this.score.pp.toFixed(2) :
                    perfs[0].pp.toFixed(2);
            helper.tools.data.debug(perfs, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'ppCalcing');

            const mxCombo = perfs[0].difficulty.maxCombo ?? this.map?.max_combo;

            if (this.score.accuracy < 1 && this.score.max_combo == mxCombo) {
                fcflag = `FC\n**${perfs[2].pp.toFixed(2)}**pp IF SS`;
            }
            if (this.score.max_combo != mxCombo) {
                fcflag =
                    `\n**${perfs[1].pp.toFixed(2)}**pp IF FC
                **${perfs[2].pp.toFixed(2)}**pp IF SS`;
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
            perfs[0].difficulty.maxCombo;
        // map.max_combo;
        let modadjustments = '';
        if (this.score.mods.filter(x => x?.settings?.speed_change).length > 0) {
            modadjustments += ' (' + this.score.mods.filter(x => x?.settings?.speed_change)[0].settings.speed_change + 'x)';
        }

        let scorerank =

            (this?.score?.rank_global ? ` #${this.score.rank_global} global` : '') +
            (this?.score?.rank_country ? ` #${this.score.rank_country} ${this.osudata.country_code.toUpperCase()} :flag_${this.osudata.country_code.toLowerCase()}:` : '')
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
${(perfs[0].difficulty.stars ?? 0).toFixed(2)}⭐ | ${helper.vars.emojis.gamemodes[this.score.ruleset_id]}
`);
                helper.tools.formatter.userAuthor(this.osudata, embed, this.params.overrideAuthor);
                break;
            case 'recent':
                embed.setTitle(`#${this.params.page + 1} most recent ${this.params.showFails == 1 ? 'play' : 'pass'} for ${this.score.user.username} | <t:${new Date(this.score.ended_at).getTime() / 1000}:R>`)
                    .setDescription(`[\`${fulltitle}\`](https://osu.ppy.sh/b/${this.map.id}) ${this.score.mods.length > 0 ? '+' + osumodcalc.OrderMods(this.score.mods.map(x => x.acronym).join('').toUpperCase()).string + modadjustments : ''} 
${(perfs[0].difficulty.stars ?? 0).toFixed(2)}⭐ | ${helper.vars.emojis.gamemodes[this.score.ruleset_id]}
${helper.tools.formatter.dateToDiscordFormat(new Date(this.score.ended_at), 'F')}
`);

                break;
        }

        this.ctn.embeds = [embed];
        return embed;
    }
    async getStrains(map: apitypes.Beatmap, score: apitypes.Score) {
        const strains = await helper.tools.performance.calcStrains({
            mapid: map.id,
            mode: score.ruleset_id,
            mods: score.mods.map(x => x.acronym).join(''),
            mapLastUpdated: new Date(map.last_updated)
        });
        try {
            helper.tools.data.debug(strains, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'strains');
        } catch (error) {
            helper.tools.data.debug({ error: error }, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'strains');
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
        return strainsgraph.filename + '.jpg';
    }
    getTryCount(scores: apitypes.Score[], mapid: number) {
        let trycount = 1;
        for (let i = scores.length - 1; i > (this.params.page); i--) {
            if (mapid == scores[i].beatmap.id) {
                trycount++;
            }
        }
        return trycount;
    }
}

export class ScoreParse extends SingleScoreCommand {

    declare protected params: {
        mode: apitypes.GameMode;
        scoreid: number | string;
        nochoke: boolean;
        overrideAuthor: string;
    };
    constructor() {
        super();
        this.name = 'ScoreParse';
        this.type = 'default';
        this.params = {
            mode: null,
            scoreid: null,
            nochoke: false,
            overrideAuthor: null,
        };
    }
    async setParamsMsg() {
        this.params.mode = this.input.args[1] as apitypes.GameMode;
        this.params.scoreid = this.input.args[0];
        if (this.input?.args[0]?.includes('https://')) {
            const temp = helper.tools.commands.scoreIdFromLink(this.input.args[0]);
            this.params.mode = temp.mode;
            this.params.scoreid = temp.id;
        }
    }
    async setParamsLink() {
        const messagenohttp = this.input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
        const temp = helper.tools.commands.scoreIdFromLink(messagenohttp);
        this.params.mode = temp.mode;
        this.params.scoreid = temp.id;
    }

    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides?.id != null) {
            this.params.scoreid = this.input.overrides.id;
        }
        if (this.input.overrides?.mode != null) {
            this.params.mode = this.input.overrides.mode;
        }
        if (this.input.overrides?.commanduser != null) {
            this.commanduser = this.input.overrides.commanduser;
        }
        if (this.input.overrides?.commandAs != null) {
            this.input.type = this.input.overrides.commandAs;
        }
        if (this.input.overrides?.ex != null) {
            this.params.overrideAuthor = this.input.overrides.ex as string;
        }
        if (this.input.overrides?.type == 'nochoke') {
            this.params.nochoke = true;
        }
    }
    async execute() {
        await this.setParams();
        this.getOverrides();
        this.logInput();
        // do stuff

        if (!this.params.scoreid) {
            const temp = helper.tools.data.getPreviousId('score', this.input.message?.guildId ?? this.input.interaction?.guildId);
            if (temp?.apiData?.best_id && typeof temp?.apiData?.best_id === 'number') {
                this.params.scoreid = temp?.apiData?.best_id;
            } else {
                this.voidcontent();
                this.ctn.content = helper.vars.errors.uErr.osu.score.ms;
                await this.send();
                return;
            }
        }

        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        let scoredataReq: tooltypes.apiReturn<apitypes.Score>;

        if (helper.tools.data.findFile(this.params.scoreid, 'scoredata') &&
            !('error' in helper.tools.data.findFile(this.params.scoreid, 'scoredata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            scoredataReq = helper.tools.data.findFile(this.params.scoreid, 'scoredata');
        } else {
            scoredataReq = await (this.params.mode ?
                helper.tools.api.getScoreWithMode(this.params.scoreid, this.params.mode, []) :
                helper.tools.api.getScore(this.params.scoreid, []));

        }

        this.score = scoredataReq.apiData;
        if (scoredataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.score.nd
                .replace('[SID]', this.params.scoreid.toString())
                .replace('[MODE]', this.params.mode), false);
            return;
        }

        if (this.score?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.score.nd
                .replace('[SID]', this.params.scoreid.toString())
                .replace('[MODE]', this.params.mode), true);
            return;
        }
        helper.tools.data.storeFile(scoredataReq, this.params.scoreid, 'scoredata', helper.tools.other.modeValidator(this.score.ruleset_id));

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Map-${this.name}-any-${this.input.id}-${this.score?.beatmap?.id}${this.score.mods ? '+' + this.score.mods.map(x => x.acronym).join() : ''}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.map),
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-User-${this.name}-any-${this.input.id}-${this.score.user_id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );

        this.ctn.components = [buttons];

        helper.tools.data.debug(scoredataReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'scoreData');
        try {
            this.score.rank.toUpperCase();
        } catch (error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.score.wrong + ` - osu.ppy.sh/scores/${this.params.mode}/${this.params.scoreid}`, true);
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
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', `${this.score.beatmap.id}`), false);
            return;
        }
        if (this.map?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', this.score.beatmap.id.toString()), true);
            return;
        }

        helper.tools.data.storeFile(mapdataReq, this.score.beatmap.id, 'mapdata');

        this.mapset = this.map.beatmapset;

        try {
            const u = await this.getProfile(this.score.user_id + '', helper.tools.other.modeValidator(this.score.ruleset_id));
            this.osudata = u;
        } catch (e) {
            return;
        }

        const e = await this.renderEmbed();
        const s = await this.getStrains(this.map, this.score);
        e.setImage(`attachment://${s}`);

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

        this.send();
    }


}

export class Recent extends SingleScoreCommand {
    declare protected params: {
        user: string;
        searchid: string;
        page: number;
        mode: apitypes.GameMode;
        showFails: number;
        filter: string;
    };
    constructor() {
        super();
        this.name = 'Recent';
        this.type = 'recent';
        this.params = {
            user: undefined,
            searchid: undefined,
            page: 0,
            mode: null,
            showFails: 1,
            filter: null,
        };
    }

    async setParamsMsg() {
        this.params.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        const passArgFinder = helper.tools.commands.matchArgMultiple(['-nf', '-nofail', '-pass', '-passes', 'passes=true'], this.input.args, false, null, false, false);
        if (passArgFinder.found) {
            this.params.showFails = 0;
            this.input.args = passArgFinder.args;
        }
        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, this.input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.params.page = pageArgFinder.output;
            this.input.args = pageArgFinder.args;
        }
        const titleArgFinder = helper.tools.commands.matchArgMultiple(["-?"], this.input.args, true, 'string', true, false);
        if (titleArgFinder.found) {
            this.params.filter = titleArgFinder.output;
            this.input.args = titleArgFinder.args;
        }

        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        const usertemp = helper.tools.commands.fetchUser(this.input.args);
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
        this.params.user = interaction.options.getString('user');
        this.params.page = interaction.options.getNumber('page');
        this.params.mode = interaction.options.getString('mode') as apitypes.GameMode;
        this.params.filter = interaction.options.getString('filter');
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
        this.params.searchid = temp.searchid;
        this.params.user = temp.user;
        this.params.mode = temp.mode;
        this.params.page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, this.input.buttonType);
        this.params.showFails = temp.fails;
        this.params.filter = temp.filterTitle;
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page != null) {
            this.params.page = +(`${this.input.overrides.page}`);
        }
        if (this.input.overrides.mode != null) {
            this.params.mode = this.input.overrides.mode;
        }
    }
    async execute() {
        await this.setParams();
        this.getOverrides();
        this.logInput();
        // do stuff

        const buttons = new Discord.ActionRowBuilder();

        {
            const t = await this.validUser(this.params.user, this.params.searchid, this.params.mode);
            this.params.user = t.user;
            this.params.mode = t.mode;
        }

        this.params.mode = helper.tools.other.modeValidator(this.params.mode);

        if (this.params.page < 2 || typeof this.params.page != 'number') {
            this.params.page = 1;
        }
        this.params.page--;

        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons(this.name, this.commanduser, this.input.id);

        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        try {
            const u = await this.getProfile(this.params.user, this.params.mode);
            this.osudata = u;
        } catch (e) {
            return;
        }

        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-User-${this.name}-any-${this.input.id}-${this.osudata.id}+${this.osudata.playmode}`)
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
            rsdataReq = await helper.tools.api.getScoresRecent(this.osudata.id, this.params.mode, [`include_fails=${this.params.showFails}`]);
        }

        this.scores = rsdataReq.apiData;
        if (rsdataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.scores.recent.replace('[ID]', this.params.user), false);
            return;
        }
        helper.tools.data.debug(rsdataReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'rsData');
        if (this.scores?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.scores.recent.replace('[ID]', this.params.user), true);
            return;
        }

        helper.tools.data.storeFile(rsdataReq, this.input.id, 'rsdata');

        if (this.params.filter) {
            this.scores = helper.tools.other.filterScoreQuery(this.scores, this.params.filter);
        }

        this.ctn.components = [pgbuttons, buttons];

        this.params.page = this.scores[this.params.page] ? this.params.page : 0;

        if (this.input.buttonType == 'BigRightArrow') {
            this.params.page = this.scores.length - 1;
        }

        this.score = this.scores[this.params.page];
        if (!this.score || this.score == undefined || this.score == null) {
            let err = `${helper.vars.errors.uErr.osu.scores.recent_ms
                .replace('[ID]', this.params.user)
                .replace('[MODE]', helper.vars.emojis.gamemodes[helper.tools.other.modeValidator(this.params.mode)])
                }`;
            if (this.params.filter) {
                err = `${helper.vars.errors.uErr.osu.scores.recent_ms
                    .replace('[ID]', this.params.user)
                    .replace('[MODE]', helper.vars.emojis.gamemodes[helper.tools.other.modeValidator(this.params.mode)])
                    } matching \`${this.params.filter}\``;
            }

            if (this.input.buttonType == null) {
                this.voidcontent();
                this.ctn.content = err;
                this.ctn.edit = true;
                await this.send();
            }
            return;
        }
        this.map = this.score.beatmap;
        this.mapset = this.score.beatmapset;

        try {
            const m = await this.getMap(this.score.beatmap_id + '');
            this.map = m;
        } catch (e) {
            return;
        }

        const e = await this.renderEmbed();
        const s = await this.getStrains(this.map, this.score);
        e.setImage(`attachment://${s}`);

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
        helper.tools.commands.storeButtonArgs(this.input.id, {
            user: this.params.user,
            searchid: this.params.searchid,
            page: this.params.page + 1,
            maxPage: this.scores.length,
            mode: this.params.mode,
            fails: this.params.showFails,
            filterTitle: this.params.filter,
        });

        this.ctn.edit = true;

        this.send();
    }

}

export class MapLeaderboard extends OsuCommand {
    declare protected params: {
        mapid: number;
        mapmods: string;
        page: number;
        parseId: number;
        parseScore: boolean;
    };
    constructor() {
        super();
        this.name = 'MapLeaderboard';
        this.params = {
            mapid: undefined,
            mapmods: undefined,
            page: undefined,
            parseId: undefined,
            parseScore: false,
        };
    }
    async setParamsMsg() {
        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, this.input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.params.page = pageArgFinder.output;
            this.input.args = pageArgFinder.args;
        }

        if (this.input.args.includes('-parse')) {
            this.params.parseScore = true;
            const temp = helper.tools.commands.parseArg(this.input.args, '-parse', 'number', 1, null, true);
            this.params.parseId = temp.value;
            this.input.args = temp.newArgs;
        }

        if (this.input.args.join(' ').includes('+')) {
            this.params.mapmods = this.input.args.join(' ').split('+')[1];
            this.params.mapmods.includes(' ') ? this.params.mapmods = this.params.mapmods.split(' ')[0] : null;
            this.input.args = this.input.args.join(' ').replace('+', '').replace(this.params.mapmods, '').split(' ');
        }
        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        this.params.mapid = (await helper.tools.commands.mapIdFromLink(this.input.args.join(' '), true)).map;
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;
        this.params.mapid = interaction.options.getInteger('id');
        this.params.page = interaction.options.getInteger('page');
        this.params.mapmods = interaction.options.getString('mods');
        this.params.parseId = interaction.options.getInteger('parse');
        if (this.params.parseId != null) {
            this.params.parseScore = true;
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
        this.params.mapid = +temp.mapId;
        this.params.mapmods = temp.modsInclude;
        this.params.page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, this.input.buttonType);
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page != null) {
            this.params.page = this.input.overrides.page;
        }
        if (this.input.overrides.id) {
            this.params.mapid = +this.input.overrides.id;
        }
        if (this.input.overrides.filterMods) {
            this.params.mapmods = this.input.overrides.filterMods;
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
        this.logInput();
        // do stuff
        const buttons = new Discord.ActionRowBuilder();
        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('maplb', this.commanduser, this.input.id);

        if (!this.params.mapid) {
            const temp = helper.tools.data.getPreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId);
            this.params.mapid = +temp?.id;
        }
        if (this.params.mapid == 0) {
            helper.tools.commands.missingPrevID_map(this.input, 'maplb');
            return;
        }
        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        let mapdata: apitypes.Beatmap;

        try {
            const m = await this.getMap(this.params.mapid + '');
            mapdata = m;
        } catch (e) {
            return;
        }

        const fulltitle = `${mapdata.beatmapset.artist} - ${mapdata.beatmapset.title} [${mapdata.version}]`;

        let mods: string;
        if (this.params.mapmods) {
            mods = osumodcalc.OrderMods(this.params.mapmods).string + '';
        }
        const lbEmbed = new Discord.EmbedBuilder();

        let lbdataReq: tooltypes.apiReturn<apitypes.BeatmapScores<apitypes.Score>>;
        if (helper.tools.data.findFile(this.input.id, 'lbdata') &&
            this.input.type == 'button' &&
            !('error' in helper.tools.data.findFile(this.input.id, 'lbdata')) &&
            this.input.buttonType != 'Refresh'
        ) {
            lbdataReq = helper.tools.data.findFile(this.input.id, 'lbdata');
        } else {
            lbdataReq = await helper.tools.api.getMapLeaderboardNonLegacy(this.params.mapid, mapdata.mode, mods, []);
        }
        const lbdataf: apitypes.BeatmapScores<apitypes.Score> = lbdataReq.apiData;
        if (lbdataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.map.lb.replace('[ID]', this.params.mapid + ''), false);
            return;
        }

        helper.tools.data.debug(lbdataReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'lbDataF');

        if (lbdataf?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.map.lb.replace('[ID]', this.params.mapid + ''), true);
            return;
        }
        helper.tools.data.storeFile(lbdataReq, this.input.id, 'lbdata');

        const lbdata = lbdataf.scores;

        if (this.params.parseScore) {
            let pid = +(this.params.parseId) - 1;
            if (isNaN(pid) || pid < 0) {
                pid = 0;
            }
            if (pid > lbdata.length) {
                pid = lbdata.length - 1;
            }
            this.input.overrides = {
                id: lbdata?.[pid]?.id,
                commanduser: this.commanduser,
                commandAs: this.input.type,
            };
            if (this.input.overrides.id == null || typeof this.input.overrides.id == 'undefined') {
                await helper.tools.commands.errorAndAbort(this.input, this.name, true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
                return;
            }
            this.input.type = 'other';

            const cmd = new ScoreParse();
            cmd.setInput(this.input);
            await cmd.execute();
            return;
        }

        lbEmbed
            .setColor(helper.vars.colours.embedColour.scorelist.dec)
            .setTitle(`Score leaderboard of \`${fulltitle}\``)
            .setURL(`https://osu.ppy.sh/b/${this.params.mapid}`)
            .setThumbnail(helper.tools.api.mapImages(mapdata.beatmapset_id).list2x);

        let scoretxt: string;
        if (lbdata.length < 1) {
            scoretxt = 'Error - no scores found ';
        }
        if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
            scoretxt = 'Error - map is unranked';
        }

        if (this.params.page >= Math.ceil(lbdata.length / 5)) {
            this.params.page = Math.ceil(lbdata.length / 5) - 1;
        }

        helper.tools.data.debug(lbdataReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'lbData');

        const scoresarg = await helper.tools.formatter.scoreList(lbdata, 'score', null, false, 1, this.params.page, true, 'map_leaderboard', mapdata);

        helper.tools.commands.storeButtonArgs(this.input.id + '', {
            mapId: this.params.mapid,
            page: scoresarg.curPage,
            maxPage: scoresarg.maxPage,
            sortScore: 'score',
            reverse: false,
            mode: mapdata.mode,
            parse: this.params.parseScore,
            parseId: this.params.parseId,
        });
        if (scoresarg.text.includes('ERROR')) {

            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);

        }
        lbEmbed.setDescription(scoresarg.text)
            .setFooter({ text: `${scoresarg.curPage}/${scoresarg.maxPage}` });

        if (scoresarg.curPage <= 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }
        if (scoresarg.curPage >= scoresarg.maxPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }

        helper.tools.data.writePreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId,
            {
                id: `${mapdata.id}`,
                apiData: null,
                mods: this.params.mapmods
            }
        );


        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Map-${this.name}-any-${this.input.id}-${this.params.mapid}${this.params.mapmods && this.params.mapmods != 'NM' ? '+' + this.params.mapmods : ''}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.map)
        );

        this.ctn.embeds = [lbEmbed];
        this.ctn.components = [pgbuttons, buttons];
        this.ctn.edit = true;
        this.send();
    }
}

export class ReplayParse extends SingleScoreCommand {
    constructor() {
        super();
        this.name = 'ReplayParse';
    }

    async execute() {
        this.logInput(true);
        // do stuff

        const decoder = new osuparsers.ScoreDecoder();
        const score = await decoder.decodeFromPath(`${helper.vars.path.files}/replays/${this.input.id}.osr`);
        helper.tools.data.debug(score, 'fileparse', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'replayData');
        this.setScore(score);
        try {
            this.map = await this.getMap(score?.info?.beatmapHashMD5);
        } catch (e) {
            return;
        }

        if (this.map?.id) {
            typeof this.map.id == 'number' ? helper.tools.data.writePreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId,
                {
                    id: `${this.map.id}`,
                    apiData: null,
                    mods: osumodcalc.ModIntToString(score.info?.mods?.bitwise ?? 0)
                }
            ) : '';
        }
        this.mapset = this.map.beatmapset;

        try {
            this.osudata = await this.getProfile(score.info.username, osumodcalc.ModeIntToName(score.info.rulesetId));
        } catch (e) {
            return;
        }
        let userid: string | number;
        try {
            userid = this.osudata.id;
        } catch (err) {
            userid = 0;
            return;
        }


        const chartInit = await helper.tools.other.graph(score.replay.lifeBar.map(x => helper.tools.calculate.secondsToTime(x.startTime / 1000)), score.replay.lifeBar.map(x => Math.floor(x.health * 100)), 'Health', {
            fill: false,
            startzero: true,
            pointSize: 0,
            gradient: true
        });

        const chartFile = new Discord.AttachmentBuilder(chartInit.path);

        const e = await this.renderEmbed();
        e.setImage(`attachment://${chartInit.filename}.jpg`);
        this.ctn.files = [chartFile];
        this.send();
    }
    /**
     * mapid should be beatmapHash
     */
    async getMap(mapid: string | number) {
        let req: tooltypes.apiReturn<apitypes.Beatmap>;
        if (helper.tools.data.findFile(mapid, 'mapdata') &&
            !('error' in helper.tools.data.findFile(mapid, 'mapdata')) &&
            this.input.buttonType != 'Refresh') {
            req = helper.tools.data.findFile(mapid, 'mapdata');
        } else {
            req = await helper.tools.api.getMapSha(mapid + '', []);
        }
        const mapdata: apitypes.Beatmap = req.apiData;
        if (req?.error) {
            const err = helper.vars.errors.uErr.osu.map.ms_md5.replace('[ID]', mapid + '');
            await helper.tools.commands.errorAndAbort(this.input, 'replayparse', true, helper.vars.errors.uErr.osu.map.ms_md5.replace('[ID]', mapid + ''), false);
            throw new Error(err);
        }
        if (mapdata?.hasOwnProperty('error')) {
            const err = helper.vars.errors.uErr.osu.map.m.replace('[ID]', mapid + '');
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, err, true);
            throw new Error(err);
        }
        helper.tools.data.debug(req, 'fileparse', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'mapData');
        helper.tools.data.storeFile(req, mapid, 'mapdata');
        return mapdata;
    }
    setScore(score: osuclasses.Score) {
        const tmods =
            typeof score.info.rawMods == 'string' ? osumodcalc.OrderMods(score.info.rawMods) :
                osumodcalc.OrderMods(osumodcalc.ModIntToString(score.info.rawMods));
        const mods: apitypes.Mod[] = tmods.array.map(x => {
            return { acronym: x };
        });
        this.score = {
            accuracy: score.info.accuracy,
            classic_total_score: score.info.totalScore,
            ended_at: score.info.date.toISOString() as any,
            has_replay: false,
            id: score.info.id,
            is_perfect_combo: score.info.perfect,
            legacy_perfect: score.info.perfect,
            legacy_score_id: score.info.id,
            legacy_total_score: score.info.totalScore,
            max_combo: score.info.maxCombo,
            maximum_statistics: {
                perfect: score.info.countGeki, // geki/300+
                great: score.info.count300, // 300
                good: score.info.countKatu, // katu/200
                ok: score.info.count100, // 100
                meh: score.info.count50, // 50
                miss: score.info.countMiss, // miss
                small_tick_miss: 0, // katu
                small_tick_hit: 0, // count 50
                legacy_combo_increase: 0, // max stats
            },
            mods,
            passed: score.info.passed,
            playlist_item_id: 0,
            preserve: false,
            processed: false,
            rank: score.info.rank,
            ruleset_id: score.info.rulesetId,
            started_at: score.info.date.toISOString() as any,
            statistics: {
                perfect: score.info.countGeki, // geki/300+
                great: score.info.count300, // 300
                good: score.info.countKatu, // katu/200
                ok: score.info.count100, // 100
                meh: score.info.count50, // 50
                miss: score.info.countMiss, // miss
                small_tick_miss: 0, // katu
                small_tick_hit: 0, // count 50
                legacy_combo_increase: 0, // max stats
            },
            total_score: score.info.totalScore,
            type: 'recent',
            user_id: score.info.userId ?? 2,
        };
    }
}

type scoretypes = 'firsts' | 'best' | 'recent' | 'pinned';

export class ScoreStats extends OsuCommand {

    declare protected params: {
        scoreTypes: scoretypes;
        user: string;
        searchid: string;
        mode: apitypes.GameMode;
        all: boolean;
        reachedMaxCount: boolean;
    };
    constructor() {
        super();
        this.name = 'ScoreStats';
        this.params = {
            scoreTypes: 'best',
            user: null,
            searchid: undefined,
            mode: undefined,
            all: false,
            reachedMaxCount: false,
        };
    }
    async setParamsMsg() {
        this.params.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.params.mode = temp.mode;
        }
        const firstArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['first', 'firsts', 'globals', 'global', 'f', 'g']), this.input.args, false, null, false, false);
        if (firstArgFinder.found) {
            this.params.scoreTypes = 'firsts';
            this.input.args = firstArgFinder.args;
        }
        const topArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['osutop', 'top', 'best', 't', 'b']), this.input.args, false, null, false, false);
        if (topArgFinder.found) {
            this.params.scoreTypes = 'best';
            this.input.args = topArgFinder.args;
        }
        const recentArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['r', 'recent', 'rs']), this.input.args, false, null, false, false);
        if (recentArgFinder.found) {
            this.params.scoreTypes = 'recent';
            this.input.args = recentArgFinder.args;
        }
        const pinnedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['pinned', 'pins', 'pin', 'p']), this.input.args, false, null, false, false);
        if (pinnedArgFinder.found) {
            this.params.scoreTypes = 'pinned';
            this.input.args = pinnedArgFinder.args;
        }
        const allFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['all', 'd', 'a', 'detailed']), this.input.args, false, null, false, false);
        if (allFinder.found) {
            this.params.all = true;
            this.input.args = allFinder.args;
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
        this.params.searchid = this.commanduser.id;
        interaction.options.getString('user') ? this.params.user = interaction.options.getString('user') : null;
        interaction.options.getString('type') ? this.params.scoreTypes = interaction.options.getString('type') as scoretypes : null;
        interaction.options.getString('mode') ? this.params.mode = interaction.options.getString('mode') as apitypes.GameMode : null;
        interaction.options.getBoolean('all') ? this.params.all = interaction.options.getBoolean('all') : null;

    }
    async setParamsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.params.searchid = this.commanduser.id;
        this.params.user = this.input.message.embeds[0].author.url.split('/users/')[1].split('/')[0];
        this.params.mode = this.input.message.embeds[0].author.url.split('/users/')[1].split('/')[1] as apitypes.GameMode;
        //user's {type} scores
        this.params.scoreTypes = this.input.message.embeds[0].title.split(' scores')[0].split(' ')[0].toLowerCase() as scoretypes;

    }
    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff

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
            const u = await this.getProfile(this.params.user, this.params.mode);
            osudata = u;
        } catch (e) {
            return;
        }

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-User-${this.name}-any-${this.input.id}-${osudata.id}+${osudata.playmode}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );

        let scoresdata: apitypes.Score[] & apitypes.Error = [];

        async function getScoreCount(cinitnum: number, args = this.params, input = this.input): Promise<boolean> {
            let req: tooltypes.apiReturn<apitypes.Score[]>;
            switch (args.scoreTypes) {
                case 'firsts':
                    req = await helper.tools.api.getScoresFirst(osudata.id, helper.tools.other.modeValidator(args.mode), [`offset=${cinitnum}`]);
                    break;
                case 'best':
                    req = await helper.tools.api.getScoresBest(osudata.id, helper.tools.other.modeValidator(args.mode), []);
                    break;
                case 'recent':
                    req = await helper.tools.api.getScoresRecent(osudata.id, helper.tools.other.modeValidator(args.mode), []);
                    break;
                case 'pinned':
                    req = await helper.tools.api.getScoresPinned(osudata.id, helper.tools.other.modeValidator(args.mode), []);
                    break;
            }
            const fd: apitypes.Score[] & apitypes.Error = req.apiData;
            if (req?.error) {
                await helper.tools.commands.errorAndAbort(input, this.name, true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', this.params.user).replace('top', this.params.scoreTypes == 'best' ? 'top' : this.params.scoreTypes), false);
                return;
            }
            if (fd?.hasOwnProperty('error')) {
                await helper.tools.commands.errorAndAbort(input, this.name, true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', args.user).replace('top', args.scoreTypes == 'best' ? 'top' : args.scoreTypes), true);
                return;
            }
            for (let i = 0; i < fd.length; i++) {
                if (!fd[i] || typeof fd[i] == 'undefined') { break; }
                scoresdata.push(fd[i]);
            }
            if (scoresdata.length == 500 && args.scoreTypes == 'firsts') {
                args.reachedMaxCount = true;
            } else if (args.scoreTypes == 'firsts') {
                return await getScoreCount(cinitnum + 100, args);
            }
            return args.reachedMaxCount;
        }

        const dataFilename =
            this.params.scoreTypes == 'firsts' ?
                'firstscoresdata' :
                `${this.params.scoreTypes}scoresdata`;

        if (helper.tools.data.findFile(osudata.id, dataFilename) &&
            !('error' in helper.tools.data.findFile(osudata.id, dataFilename)) &&
            this.input.buttonType != 'Refresh'
        ) {
            scoresdata = helper.tools.data.findFile(osudata.id, dataFilename);
        } else {
            this.params.reachedMaxCount = await getScoreCount(0, this.params, this.input);
        }
        helper.tools.data.storeFile(scoresdata, osudata.id, dataFilename);

        // let useFiles: string[] = [];

        const Embed: Discord.EmbedBuilder = new Discord.EmbedBuilder()
            .setTitle(`Statistics for ${osudata.username}'s ${this.params.scoreTypes} scores`)
            .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`);
        helper.tools.formatter.userAuthor(osudata, Embed);
        if (scoresdata.length == 0) {
            Embed.setDescription('No scores found');
        } else {
            Embed.setDescription(`${helper.tools.calculate.separateNum(scoresdata.length)} scores found\n${this.params.reachedMaxCount ? 'Only first 100 scores are calculated' : ''}`);
            const mappers = helper.tools.calculate.findMode(scoresdata.map(x => x.beatmapset.creator));
            const mods = helper.tools.calculate.findMode(scoresdata.map(x => {
                return x.mods.length == 0 ?
                    'NM' :
                    x.mods.map(x => x.acronym).join('');
            }));
            const grades = helper.tools.calculate.findMode(scoresdata.map(x => x.rank));
            const acc = helper.tools.calculate.stats(scoresdata.map(x => x.accuracy));
            const combo = helper.tools.calculate.stats(scoresdata.map(x => x.max_combo));
            let pp = helper.tools.calculate.stats(scoresdata.map(x => x.pp));
            let totpp = '';
            let weighttotpp = '';

            if (this.params.all) {
                //do pp calc
                const calculations: rosu.PerformanceAttributes[] = [];
                for (const score of scoresdata) {
                    calculations.push(
                        await helper.tools.performance.calcScore({
                            mods: score.mods.map(x => x.acronym).join('').length > 1 ?
                                score.mods.map(x => x.acronym).join('') : 'NM',
                            mode: score.ruleset_id,
                            mapid: score.beatmap.id,
                            stats: score.statistics,
                            accuracy: score.accuracy,
                            maxcombo: score.max_combo,
                            mapLastUpdated: new Date(score.beatmap.last_updated)
                        }));
                }

                pp = helper.tools.calculate.stats(calculations.map(x => x.pp));
                calculations.sort((a, b) => b.pp - a.pp);

                const ppcalc = {
                    total: calculations.map(x => x.pp).reduce((a, b) => a + b, 0),
                    acc: calculations.map(x => x.ppAccuracy).reduce((a, b) => a + b, 0),
                    aim: calculations.map(x => x.ppAim).reduce((a, b) => a + b, 0),
                    diff: calculations.map(x => x.ppDifficulty).reduce((a, b) => a + b, 0),
                    speed: calculations.map(x => x.ppSpeed).reduce((a, b) => a + b, 0),
                };
                const weightppcalc = {
                    total: helper.tools.calculate.weightPerformance(calculations.map(x => x.pp)).reduce((a, b) => a + b, 0),
                    acc: helper.tools.calculate.weightPerformance(calculations.map(x => x.ppAccuracy)).reduce((a, b) => a + b, 0),
                    aim: helper.tools.calculate.weightPerformance(calculations.map(x => x.ppAim)).reduce((a, b) => a + b, 0),
                    diff: helper.tools.calculate.weightPerformance(calculations.map(x => x.ppDifficulty)).reduce((a, b) => a + b, 0),
                    speed: helper.tools.calculate.weightPerformance(calculations.map(x => x.ppSpeed)).reduce((a, b) => a + b, 0),
                };
                totpp = `Total: ${ppcalc.total.toFixed(2)}`;
                ppcalc.acc ? totpp += `\nAccuracy: ${ppcalc.acc.toFixed(2)}` : '';
                ppcalc.aim ? totpp += `\nAim: ${ppcalc.aim.toFixed(2)}` : '';
                ppcalc.diff ? totpp += `\nDifficulty: ${ppcalc.diff.toFixed(2)}` : '';
                ppcalc.speed ? totpp += `\nSpeed: ${ppcalc.speed.toFixed(2)}` : '';

                weighttotpp = `Total: ${weightppcalc.total.toFixed(2)}`;
                ppcalc.acc ? weighttotpp += `\nAccuracy: ${weightppcalc.acc.toFixed(2)}` : '';
                ppcalc.aim ? weighttotpp += `\nAim: ${weightppcalc.aim.toFixed(2)}` : '';
                ppcalc.diff ? weighttotpp += `\nDifficulty: ${weightppcalc.diff.toFixed(2)}` : '';
                ppcalc.speed ? weighttotpp += `\nSpeed: ${weightppcalc.speed.toFixed(2)}` : '';
            }
            if (this.input.type == 'button') {
                let mappersStr = '';
                for (let i = 0; i < mappers.length; i++) {
                    mappersStr += `#${i + 1}. ${mappers[i].string} - ${helper.tools.calculate.separateNum(mappers[i].count)} | ${mappers[i].percentage.toFixed(2)}%\n`;
                }
                let modsStr = '';
                for (let i = 0; i < mods.length; i++) {
                    modsStr += `#${i + 1}. ${mods[i].string} - ${helper.tools.calculate.separateNum(mods[i].count)} | ${mods[i].percentage.toFixed(2)}%\n`;
                }
                let gradesStr = '';
                for (let i = 0; i < grades.length; i++) {
                    gradesStr += `#${i + 1}. ${grades[i].string} - ${helper.tools.calculate.separateNum(grades[i].count)} | ${grades[i].percentage.toFixed(2)}%\n`;
                }

                // const Mapperspath = `${helper.vars.path.cache}/commandData/${input.id}Mappers.txt`;
                // const Modspath = `${helper.vars.path.cache}/commandData/${input.id}Mods.txt`;
                // const Rankspath = `${helper.vars.path.cache}/commandData/${input.id}Ranks.txt`;

                // fs.writeFileSync(Mapperspath, mappersStr, 'utf-8');
                // fs.writeFileSync(Modspath, modsStr, 'utf-8');
                // fs.writeFileSync(Rankspath, gradesStr, 'utf-8');
                // useFiles = [Mapperspath, Modspath, Rankspath];
            } else {
                let mappersStr = '';
                for (let i = 0; i < mappers.length && i < 5; i++) {
                    mappersStr += `#${i + 1}. ${mappers[i].string} - ${helper.tools.calculate.separateNum(mappers[i].count)} | ${mappers[i].percentage.toFixed(2)}%\n`;
                }
                let modsStr = '';
                for (let i = 0; i < mods.length && i < 5; i++) {
                    modsStr += `#${i + 1}. ${mods[i].string} - ${helper.tools.calculate.separateNum(mods[i].count)} | ${mods[i].percentage.toFixed(2)}%\n`;
                }
                let gradesStr = '';
                for (let i = 0; i < grades.length && i < 5; i++) {
                    gradesStr += `#${i + 1}. ${grades[i].string} - ${helper.tools.calculate.separateNum(grades[i].count)} | ${grades[i].percentage.toFixed(2)}%\n`;
                }


                Embed.setFields([{
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
                    name: 'Combo',
                    value: `
                    Highest: ${combo?.highest}
                    Lowest: ${combo?.lowest}
                    Average: ${Math.floor(combo?.mean)}
                    Median: ${combo?.median}
                    ${combo?.ignored > 0 ? `Skipped: ${combo?.ignored}` : ''}
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
                ]);
                if (this.params.all) {
                    Embed.addFields([
                        {
                            name: 'Total PP',
                            value: totpp,
                            inline: true
                        },
                        {
                            name: '(Weighted)',
                            value: weighttotpp,
                            inline: true
                        },
                    ]);
                }
            }
        }

        this.ctn.embeds = [Embed];
        this.ctn.components = [buttons];

        this.send();
    }


}

export class Simulate extends OsuCommand {

    declare protected params: {
        mapid: number;
        mods: string;
        acc: number;
        combo: number;
        n300: number;
        n100: number;
        n50: number;
        nMiss: number;
        overrideSpeed: number;
        overrideBpm: number;
        customCS: number;
        customAR: number;
        customOD: number;
        customHP: number;
    };
    constructor() {
        super();
        this.name = 'Simulate';
        this.params = {
            mapid: null,
            mods: null,
            acc: null,
            combo: null,
            n300: null,
            n100: null,
            n50: null,
            nMiss: null,
            overrideSpeed: 1,
            overrideBpm: null,
            customCS: null,
            customAR: null,
            customOD: null,
            customHP: null,
        };
    }
    async setParamsMsg() {
        const ctn = this.input.message.content;
        if (ctn.includes('-mods')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-mods', 'string', this.params.mods);
            this.params.mods = temp.value;
            this.input.args = temp.newArgs;
        }
        const accArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['acc', 'accuracy', '%',]), this.input.args, true, 'number', false, false);
        if (accArgFinder.found) {
            this.params.acc = accArgFinder.output;
            this.input.args = accArgFinder.args;
        }
        const comboArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['x', 'combo', 'maxcombo',]), this.input.args, true, 'number', false, true);
        if (comboArgFinder.found) {
            this.params.combo = comboArgFinder.output;
            this.input.args = comboArgFinder.args;
        }
        const n300ArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['n300', '300s',]), this.input.args, true, 'number', false, true);
        if (n300ArgFinder.found) {
            this.params.n300 = n300ArgFinder.output;
            this.input.args = n300ArgFinder.args;
        }
        const n100ArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['n100', '100s',]), this.input.args, true, 'number', false, true);
        if (n100ArgFinder.found) {
            this.params.n100 = n100ArgFinder.output;
            this.input.args = n100ArgFinder.args;
        }
        const n50ArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['n50', '50s',]), this.input.args, true, 'number', false, true);
        if (n50ArgFinder.found) {
            this.params.n50 = n50ArgFinder.output;
            this.input.args = n50ArgFinder.args;
        }
        const nMissArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['miss', 'misses', 'n0', '0s',]), this.input.args, true, 'number', false, true);
        if (nMissArgFinder.found) {
            this.params.nMiss = nMissArgFinder.output;
            this.input.args = nMissArgFinder.args;
        }
        if (this.input.args.includes('-bpm')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-bpm', 'number', this.params.overrideBpm);
            this.params.overrideBpm = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-speed')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-speed', 'number', this.params.overrideSpeed);
            this.params.overrideSpeed = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-cs')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-cs', 'number', this.params.customCS);
            this.params.customCS = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-ar')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-ar', 'number', this.params.customAR);
            this.params.customAR = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-od')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-od', 'number', this.params.customOD);
            this.params.customOD = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-hp')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-hp', 'number', this.params.customHP);
            this.params.customHP = temp.value;
            this.input.args = temp.newArgs;
        }
        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        if (ctn.includes('+')) {
            this.params.mods = ctn.split('+')[1].split(' ')[0];
            let i = 0;
            for (; i < this.input.args.length; i++) {
                if (this.input.args[i].includes('+')) {
                    break;
                }
            }
            this.input.args = this.input.args.slice(0, i).concat(this.input.args.slice(i + 1, this.input.args.length));
        }
        this.params.mapid = (await helper.tools.commands.mapIdFromLink(this.input.args.join(' '), true)).map;
    }
    async setParamsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.params.mapid = interaction.options.getInteger('id');
        this.params.mods = interaction.options.getString('mods');
        this.params.acc = interaction.options.getNumber('accuracy');
        this.params.combo = interaction.options.getInteger('combo');
        this.params.n300 = interaction.options.getInteger('n300');
        this.params.n100 = interaction.options.getInteger('n100');
        this.params.n50 = interaction.options.getInteger('n50');
        this.params.nMiss = interaction.options.getInteger('miss');
    }
    async execute() {
        await this.setParams();
        this.logInput();
        // do stuff
        if (!this.params.mapid) {
            try {
                const temp = this.getLatestMap().mapid;
                if (temp == false) {
                    helper.tools.commands.missingPrevID_map(this.input, this.name);
                    return;
                }
                this.params.mapid = +temp;
            } catch (e) {
                return;
            }
        }

        if (this.input.type == 'interaction') {
            this.ctn.content = 'Loading...';
            this.send();
            this.voidcontent();
            this.ctn.edit = true;
        }

        const tempscore = helper.tools.data.getPreviousId('score', this.input.message?.guildId ?? this.input.interaction?.guildId);
        if (tempscore?.apiData && tempscore?.apiData.beatmap.id == this.params.mapid) {
            if (!this.params.n300 && !this.params.n100 && !this.params.n50 && !this.params.acc) {
                this.params.n300 = tempscore.apiData.statistics.great;
                this.params.n100 = tempscore.apiData.statistics.ok;
                this.params.n50 = tempscore.apiData.statistics.meh;
                this.params.acc = tempscore.apiData.accuracy * 100;
            }
            if (!this.params.nMiss) {
                this.params.nMiss = tempscore.apiData.statistics.miss;
            }
            if (!this.params.combo) {
                this.params.combo = tempscore.apiData.max_combo;
            }
            if (!this.params.mods) {
                this.params.mods = tempscore.apiData.mods.map(x => x.acronym).join('');
            }
        }

        let mapdata: apitypes.Beatmap;
        try {
            const m = await this.getMap(this.params.mapid);
            mapdata = m;
        } catch (e) {
            return;
        }
        if (!this.params.mods) {
            this.params.mods = 'NM';
        }
        if (!this.params.combo) {
            this.params.combo = undefined;
        }

        if (this.params.overrideBpm && !this.params.overrideSpeed) {
            this.params.overrideSpeed = this.params.overrideBpm / mapdata.bpm;
        }
        if (this.params.overrideSpeed && !this.params.overrideBpm) {
            this.params.overrideBpm = this.params.overrideSpeed * mapdata.bpm;
        }

        if (this.params.mods.includes('DT') || this.params.mods.includes('NC')) {
            this.params.overrideSpeed *= 1.5;
            this.params.overrideBpm *= 1.5;
        }
        if (this.params.mods.includes('HT')) {
            this.params.overrideSpeed *= 0.75;
            this.params.overrideBpm *= 1.5;
        }
        const scorestat: apitypes.ScoreStatistics = {
            great: this.params.n300,
            ok: this.params.n100,
            meh: this.params.n50,
            miss: this.params.nMiss ?? 0,
        };

        const perfs = await helper.tools.performance.fullPerformance(
            this.params.mapid,
            0,
            this.params.mods,
            this.params.acc,
            this.params.overrideSpeed,
            scorestat,
            this.params.combo,
            null,
            new Date(mapdata.last_updated),
            this.params.customCS,
            this.params.customAR,
            this.params.customOD,
            this.params.customHP,
        );
        helper.tools.data.debug(perfs, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'ppCalc');

        let use300s = (this.params.n300 ?? 0);
        const gotTot = use300s + (this.params.n100 ?? 0) + (this.params.n50 ?? 0) + (this.params.nMiss ?? 0);
        if (gotTot != mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners) {
            use300s += (mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners) - use300s;
        }

        const useAcc = osumodcalc.calcgrade(
            use300s,
            this.params.n100 ?? 0,
            this.params.n50 ?? 0,
            this.params.nMiss ?? 0
        );

        const mapPerf = await helper.tools.performance.calcMap({
            mods: this.params.mods,
            mode: 0,
            mapid: this.params.mapid,
            clockRate: this.params.overrideSpeed,
            mapLastUpdated: new Date(mapdata.last_updated)
        });

        const title = `${mapdata.beatmapset.artist} - ${mapdata.beatmapset.title} [${mapdata.version}]`;
        const mxCombo = perfs[0].difficulty.maxCombo;
        const scoreEmbed = new Discord.EmbedBuilder()
            .setTitle(`Simulated play on \n\`${title}\``)
            .setURL(`https://osu.ppy.sh/b/${this.params.mapid}`)
            .setThumbnail(mapdata?.beatmapset_id ? `https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg` : `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
            .addFields([
                {
                    name: 'Score Details',
                    value:
                        `${(this.params.acc ?? useAcc?.accuracy)?.toFixed(2)}% | ${this.params.nMiss ?? 0}x misses
    ${this.params.combo ?? mxCombo}x/**${mxCombo}**x
    ${this.params.mods ?? 'No mods'}
    \`${this.params.n300}/${this.params.n100}/${this.params.n50}/${this.params.nMiss}\`
    Speed: ${this.params.overrideSpeed ?? 1}x @ ${this.params.overrideBpm ?? mapdata.bpm}BPM
    `,
                    inline: false
                },
                {
                    name: 'Performance',
                    value:
                        `
    ${perfs[0].pp?.toFixed(2)}pp | ${perfs[1].pp?.toFixed(2)}pp if ${(this.params.acc ?? useAcc?.accuracy)?.toFixed(2)}% FC
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
    ${helper.vars.emojis.mapobjs.total_length}${helper.tools.calculate.secondsToTime(mapdata.total_length)}
                    `,
                    inline: true
                },
                {
                    name: helper.vars.defaults.invisbleChar,
                    value:
                        `
    ${helper.vars.emojis.mapobjs.circle}${mapdata.count_circles}
    ${helper.vars.emojis.mapobjs.slider}${mapdata.count_sliders}
    ${helper.vars.emojis.mapobjs.spinner}${mapdata.count_spinners}
    ${helper.vars.emojis.mapobjs.bpm}${mapdata.bpm}
    ${helper.vars.emojis.mapobjs.star}${(perfs[0]?.difficulty?.stars ?? mapdata.difficulty_rating)?.toFixed(2)}
                    `,
                    inline: true
                },
            ]);

        this.ctn.embeds = [scoreEmbed];

        this.send();
    }
}