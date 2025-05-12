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
        mapid: number;
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
        this.commanduser = this.input.message.author;
        const searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
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
        const usertemp = helper.tools.commands.fetchUser(this.input.args);
        this.args.user = usertemp.id;
        if (usertemp.mode && !this.args.mode) {
            this.args.mode = usertemp.mode;
        }
        if (!this.args.user || this.args.user.includes(searchid)) {
            this.args.user = null;
        }
        this.argsMsgExtra();
    }
    async setArgsInteract() {
        let interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;

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
        this.argsInteractExtra();
    }
    async setArgsBtn() {
        let interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.commanduser = interaction?.member?.user ?? this.input.interaction?.user;
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
        this.argsButtonsExtra();
    }
    argsMsgExtra() { };
    argsInteractExtra() { };
    argsButtonsExtra() { };


    osudata: apitypes.User;
    scores: apitypes.Score[];
    map: apitypes.Beatmap;

    pgbuttons: Discord.ActionRowBuilder;
    buttons: Discord.ActionRowBuilder;

    protected async getScores() {
        let req: tooltypes.apiReturn<apitypes.Score[] | apitypes.ScoreArrA>;
        let fname = '';
        switch (this.type) {
            case 'osutop':
                fname = 'osutopdata';
                break;
        }
        // scores = req.
        if (helper.tools.data.findFile(this.osudata.id, fname) &&
            this.input.type == 'button' &&
            !('error' in helper.tools.data.findFile(this.osudata.id, fname)) &&
            this.input.buttonType != 'Refresh'
        ) {
            req = helper.tools.data.findFile(this.osudata.id, fname);
        } else {
            switch (this.type) {
                case 'osutop': case 'nochokes':
                    req = await helper.tools.api.getScoresBest(this.osudata.id, this.args.mode, []);
                    break;
                case 'recent':
                    req = await helper.tools.api.getScoresRecent(this.osudata.id, this.args.mode, []);
                    break;
                case 'map': {
                    let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
                    if (helper.tools.data.findFile(this.args.mapid, 'mapdata') &&
                        !('error' in helper.tools.data.findFile(this.args.mapid, 'mapdata')) &&
                        this.input.buttonType != 'Refresh'
                    ) {
                        mapdataReq = helper.tools.data.findFile(this.args.mapid, 'mapdata');
                    } else {
                        mapdataReq = await helper.tools.api.getMap(this.args.mapid, []);
                    }
                    this.map = mapdataReq.apiData;
                    if (mapdataReq?.error) {
                        await helper.tools.commands.errorAndAbort(this.input, 'scores', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', this.args.mapid + ''), false);
                        return;
                    }
                    helper.tools.data.debug(mapdataReq, 'command', 'scores', this.input.message?.guildId ?? this.input.interaction?.guildId, 'mapData');
                    if (this.map?.hasOwnProperty('error')) {
                        await helper.tools.commands.errorAndAbort(this.input, 'scores', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', this.args.mapid + ''), true);
                        return;
                    }

                    req = await helper.tools.api.getUserMapScores(this.osudata.id, this.args.mapid, []);
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
            await commitError();
        }

        const tempscores: apitypes.Score[] & apitypes.Error =
            this.type == 'map' ?
                (req.apiData as apitypes.ScoreArrA).scores
                :
                req.apiData as apitypes.Score[];

        helper.tools.data.debug(req, 'command', this.type, this.input.message?.guildId ?? this.input.interaction?.guildId, this.type + 'data');

        if (tempscores?.hasOwnProperty('error') || !tempscores[0]?.user?.username) {
            await commitError();
        }

        this.scores = tempscores;

        async function commitError() {
            switch (this.type) {
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
                return `\`${map.beatmapset.artist} - ${map.beatmapset.title} [${map.version}]\``;
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
        this.setArgs();
        this.logInput();

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
            this.getScores();
        } catch (e) {
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

        this.list();

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
export class Recent extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'recent';
    }
}
export class Scores extends ScoreListCommand {
    constructor() {
        super();
        this.type = 'map';
    }
}

export class ScoreParse extends Command {

}