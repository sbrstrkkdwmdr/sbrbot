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
/**
 * list of #1 scores
 */
export const firsts = async (input: bottypes.commandInput) => {
    const parseArgs = await helper.tools.commands.parseArgs_scoreList(input);
    if (parseArgs.error) {
        scoresParseFail(input);
        return;
    }


    let reachedMaxCount = false;


    if (input.overrides) {
        if (input.overrides.page != null) {
            parseArgs.page = input.overrides.page;
        }
    }
    helper.tools.log.commandOptions(
        helper.tools.log.objectLoggable(parseArgs),
        input.id,
        'firsts',
        input.type,
        parseArgs.commanduser,
        input.message,
        input.interaction,
    );

    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('firsts', parseArgs.commanduser, input.id);

    const buttons = new Discord.ActionRowBuilder();


    //if user is null, use searchid
    if (parseArgs.user == null) {
        const cuser = await helper.tools.data.searchUser(parseArgs.searchid, true);
        parseArgs.user = cuser.username;
        if (parseArgs.mode == null) {
            parseArgs.mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (parseArgs.user == null) {
        const cuser = helper.vars.client.users.cache.get(parseArgs.searchid);
        parseArgs.user = cuser?.username ?? '';
    }

    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: 'Loading...'
            }
        }, input.canReply);
    }

    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(parseArgs.user, 'osudata', parseArgs.mode) &&
        !('error' in helper.tools.data.findFile(parseArgs.user, 'osudata', parseArgs.mode)) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(parseArgs.user, 'osudata', parseArgs.mode);
    } else {
        osudataReq = await helper.tools.api.getUser(parseArgs.user, parseArgs.mode, []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'firsts', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', parseArgs.user), false);
        return;
    }

    helper.tools.data.debug(osudataReq, 'command', 'osu', input.message?.guildId ?? input.interaction?.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'firsts', true, helper.vars.errors.noUser(parseArgs.user), true);
        return;
    }

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-User-firsts-any-${input.id}-${osudata.id}+${osudata.playmode}`)
            .setStyle(helper.vars.buttons.type.current)
            .setEmoji(helper.vars.buttons.label.extras.user),
    );

    helper.tools.data.userStatsCache([osudata], parseArgs.mode, 'User');

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', parseArgs.mode);
    helper.tools.data.storeFile(osudataReq, parseArgs.user, 'osudata', parseArgs.mode);

    let firstscoresdata: apitypes.Score[] & apitypes.Error = [];
    async function getScoreCount(cinitnum) {
        if (cinitnum >= 499) {
            reachedMaxCount = true;
            return;
        }

        const fdReq: tooltypes.apiReturn = await helper.tools.api.getScoresFirst(osudata.id, parseArgs.mode, ['offset=' + cinitnum]);
        const fd: apitypes.Score[] & apitypes.Error = fdReq.apiData;
        if (fdReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'firsts', true, helper.vars.errors.uErr.osu.scores.first.replace('[ID]', parseArgs.user), false);
            return;
        }
        if (fd?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(input, 'firsts', true, helper.vars.errors.uErr.osu.scores.first.replace('[ID]', parseArgs.user) + ` offset by ${cinitnum}`, true);
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }

            await firstscoresdata.push(fd[i]);
        }
        if (fd.length == 100) {
            await getScoreCount(cinitnum + 100);
        }
        return;
    }
    if (helper.tools.data.findFile(osudata.id, 'firstscoresdata') &&
        !('error' in helper.tools.data.findFile(osudata.id, 'firstscoresdata')) &&
        input.buttonType != 'Refresh'
    ) {
        firstscoresdata = helper.tools.data.findFile(osudata.id, 'firstscoresdata');
    } else {
        await getScoreCount(0);
    }
    helper.tools.data.debug(firstscoresdata, 'command', 'firsts', input.message?.guildId ?? input.interaction?.guildId, 'firstsScoresData');
    helper.tools.data.storeFile(firstscoresdata, osudata.id, 'firstscoresdata');

    if (parseArgs.parseScore) {
        const newScores = helper.tools.formatter.filterScores(firstscoresdata, parseArgs.sort ?? 'pp',
            {
                mapper: parseArgs.filteredMapper,
                modsInclude: parseArgs.modsInclude,
                title: parseArgs.filterTitle,
                artist: null,
                version: null,
                rank: parseArgs.filterRank,
                modsExact: parseArgs.modsExact,
                modsExclude: parseArgs.modsExclude,
                pp: parseArgs.pp,
                score: parseArgs.score,
                acc: parseArgs.acc,
                combo: parseArgs.combo,
                miss: parseArgs.miss,
                bpm: parseArgs.bpm
            }, parseArgs.reverse,) as apitypes.Score[];
        let pid = +parseArgs.parseId - 1;
        if (isNaN(pid) || pid < 0) {
            pid = 0;
        }
        if (pid > newScores.length) {
            pid = newScores.length - 1;
        }
        input.overrides = {
            id: newScores?.[pid]?.id,
            commanduser: parseArgs.commanduser,
            commandAs: input.type,
            ex: `${osudata.username}'s ${helper.tools.calculate.toOrdinal(pid + 1)} ${parseArgs.sort == 'pp' ? helper.tools.formatter.sortDescription(parseArgs.sort ?? 'pp', parseArgs.reverse) + ' ' : ''}#1 score`
        };

        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await helper.tools.commands.errorAndAbort(input, 'firsts', true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.type = 'other';
        await scoreparse(input);
        return;
    }

    let firstsEmbed = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.scorelist.dec)
        .setTitle(`#1 scores for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osumodcalc.ModeIntToName(firstscoresdata?.[0]?.ruleset_id)}#top_ranks`)
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`);
    firstsEmbed = helper.tools.formatter.userAuthor(osudata, firstsEmbed);

    const scoresarg = await helper.tools.formatter.scoreList(
        firstscoresdata, parseArgs.sort ?? 'recent',
        {
            mapper: parseArgs.filteredMapper,
            modsInclude: parseArgs.modsInclude,
            title: parseArgs.filterTitle,
            artist: parseArgs.filterArtist,
            version: parseArgs.filterDifficulty,
            rank: parseArgs.filterRank,
            modsExact: parseArgs.modsExact,
            modsExclude: parseArgs.modsExclude,
            pp: parseArgs.pp,
            score: parseArgs.score,
            acc: parseArgs.acc,
            combo: parseArgs.combo,
            miss: parseArgs.miss,
            bpm: parseArgs.bpm
        }, parseArgs.reverse, parseArgs.scoredetailed, parseArgs.page, true);
    helper.tools.commands.storeButtonArgs(input.id + '', { ...parseArgs, ...{ maxPage: scoresarg.maxPage } });

    firstsEmbed.setFooter({
        text: `${scoresarg.curPage}/${scoresarg.maxPage} | ${parseArgs?.mode ?? osumodcalc.ModeIntToName(firstscoresdata?.[0]?.ruleset_id)} | ${reachedMaxCount ? ' | Only first 500 scores are shown' : ''}`
    });
    if (scoresarg.text.includes('ERROR')) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    firstsEmbed.setDescription(scoresarg.text);

    if (scoresarg.curPage <= 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.curPage >= scoresarg.maxPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    helper.tools.data.writePreviousId('user', input.message?.guildId ?? input.interaction?.guildId, { id: `${osudata.id}`, apiData: null, mods: null });
    if (input.type != 'button' || input.buttonType == 'Refresh') {
        try {
            helper.tools.data.updateUserStats(osudata, osudata.playmode,);
        } catch (error) {
            helper.tools.log.commandErr(error, input.id, 'firsts', input.message, input.interaction);
        }
    }

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [firstsEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);
};

/**
 * leaderboard of a map
 */
export const maplb = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let mapid;
    let mapmods;
    let page;
    let parseId = null;
    let parseScore = false;

    let useContent: string = null;
    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;

            const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, input.args, true, 'number', false, true);
            if (pageArgFinder.found) {
                page = pageArgFinder.output;
                input.args = pageArgFinder.args;
            }

            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = helper.tools.commands.parseArg(input.args, '-parse', 'number', 1, null, true);
                parseId = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.join(' ').includes('+')) {
                mapmods = input.args.join(' ').split('+')[1];
                mapmods.includes(' ') ? mapmods = mapmods.split(' ')[0] : null;
                input.args = input.args.join(' ').replace('+', '').replace(mapmods, '').split(' ');
            }
            input.args = helper.tools.commands.cleanArgs(input.args);

            mapid = (await helper.tools.commands.mapIdFromLink(input.args.join(' '), true)).map;
        }
            break;



        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
            mapid = interaction.options.getInteger('id');
            page = interaction.options.getInteger('page');
            mapmods = interaction.options.getString('mods');
            parseId = interaction.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true;
            }
        }



            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;
            mapid = input.message.embeds[0].url.split('/b/')[1];
            if (input.message.embeds[0].title.includes('+')) {
                mapmods = input.message.embeds[0].title.split('+')[1];
            }
            const temp = helper.tools.commands.getButtonArgs(input.id);
            if (temp.error) {
                interaction.followUp({
                    content: helper.vars.errors.paramFileMissing,
                    flags: Discord.MessageFlags.Ephemeral,
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            mapid = temp.mapId;
            mapmods = temp.modsInclude;
            page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, input.buttonType);
        }
            break;
    }
    if (input.overrides) {
        if (input.overrides.page != null) {
            page = input.overrides.page;
        }
        if (input.overrides.id) {
            mapid = input.overrides.id;
        }
        if (input.overrides.filterMods) {
            mapmods = input.overrides.filterMods;
        }
        if (input.overrides.commandAs) {
            input.type = input.overrides.commandAs;
        }
        if (input.overrides.commanduser) {
            commanduser = input.overrides.commanduser;
            useContent = `Requested by <@${commanduser.id}>`;
        }
    }


    const buttons = new Discord.ActionRowBuilder();
    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('maplb', commanduser, input.id);

    helper.tools.log.commandOptions(
        [{
            name: 'Map ID',
            value: mapid
        },
        {
            name: 'Mods',
            value: mapmods
        },
        {
            name: 'Page',
            value: page
        },
        {
            name: 'Parse',
            value: `${parseId}`
        },],
        input.id,
        'maplb',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    if (!mapid) {
        const temp = helper.tools.data.getPreviousId('map', input.message?.guildId ?? input.interaction?.guildId);
        mapid = temp.id;
    }
    if (mapid == false) {
        helper.tools.commands.missingPrevID_map(input, 'maplb');
        return;
    }
    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: 'Loading...'
            }
        }, input.canReply);
    }
    let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
    if (helper.tools.data.findFile(mapid, 'mapdata') &&
        !('error' in helper.tools.data.findFile(mapid, 'mapdata')) &&
        input.buttonType != 'Refresh'
    ) {
        mapdataReq = helper.tools.data.findFile(mapid, 'mapdata');
    } else {
        mapdataReq = await helper.tools.api.getMap(mapid, []);
    }
    const mapdata: apitypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'maplb', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', mapid), false);
        return;
    }
    helper.tools.data.debug(mapdataReq, 'command', 'maplb', input.message?.guildId ?? input.interaction?.guildId, 'mapData');

    if (mapdata?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'maplb', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', mapid), true);
        return;
    }

    helper.tools.data.storeFile(mapdataReq, mapid, 'mapdata');

    const fulltitle = `${mapdata.beatmapset.artist} - ${mapdata.beatmapset.title} [${mapdata.version}]`;

    let mods: string;
    if (mapmods) {
        mods = osumodcalc.OrderMods(mapmods).string + '';
    }
    const lbEmbed = new Discord.EmbedBuilder();

    let lbdataReq: tooltypes.apiReturn<apitypes.BeatmapScores<apitypes.Score>>;
    if (helper.tools.data.findFile(input.id, 'lbdata') &&
        input.type == 'button' &&
        !('error' in helper.tools.data.findFile(input.id, 'lbdata')) &&
        input.buttonType != 'Refresh'
    ) {
        lbdataReq = helper.tools.data.findFile(input.id, 'lbdata');
    } else {
        lbdataReq = await helper.tools.api.getMapLeaderboardNonLegacy(mapid, mapdata.mode, mods, []);
    }
    const lbdataf: apitypes.BeatmapScores<apitypes.Score> = lbdataReq.apiData;
    if (lbdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'maplb', true, helper.vars.errors.uErr.osu.map.lb.replace('[ID]', mapid), false);
        return;
    }

    helper.tools.data.debug(lbdataReq, 'command', 'maplb', input.message?.guildId ?? input.interaction?.guildId, 'lbDataF');

    if (lbdataf?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'maplb', true, helper.vars.errors.uErr.osu.map.lb.replace('[ID]', mapid), true);
        return;
    }
    helper.tools.data.storeFile(lbdataReq, input.id, 'lbdata');

    const lbdata = lbdataf.scores;

    if (parseScore) {
        let pid = +(parseId) - 1;
        if (isNaN(pid) || pid < 0) {
            pid = 0;
        }
        if (pid > lbdata.length) {
            pid = lbdata.length - 1;
        }
        input.overrides = {
            id: lbdata?.[pid]?.id,
            commanduser,
            commandAs: input.type,
        };
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await helper.tools.commands.errorAndAbort(input, 'maplb', true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.type = 'other';
        await scoreparse(input);
        return;
    }

    lbEmbed
        .setColor(helper.vars.colours.embedColour.scorelist.dec)
        .setTitle(`Score leaderboard of \`${fulltitle}\``)
        .setURL(`https://osu.ppy.sh/b/${mapid}`)
        .setThumbnail(helper.tools.api.mapImages(mapdata.beatmapset_id).list2x);

    let scoretxt: string;
    if (lbdata.length < 1) {
        scoretxt = 'Error - no scores found ';
    }
    if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
        scoretxt = 'Error - map is unranked';
    }

    if (page >= Math.ceil(lbdata.length / 5)) {
        page = Math.ceil(lbdata.length / 5) - 1;
    }

    helper.tools.data.debug(lbdataReq, 'command', 'maplb', input.message?.guildId ?? input.interaction?.guildId, 'lbData');

    const scoresarg = await helper.tools.formatter.scoreList(lbdata, 'score', null, false, 1, page, true, 'map_leaderboard', mapdata);

    helper.tools.commands.storeButtonArgs(input.id + '', {
        mapId: mapid,
        page: scoresarg.curPage,
        maxPage: scoresarg.maxPage,
        sortScore: 'score',
        reverse: false,
        mode: mapdata.mode,
        parse: parseScore,
        parseId,
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

    helper.tools.data.writePreviousId('map', input.message?.guildId ?? input.interaction?.guildId,
        {
            id: `${mapdata.id}`,
            apiData: null,
            mods: mapmods
        }
    );


    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-Map-maplb-any-${input.id}-${mapid}${mapmods && mapmods != 'NM' ? '+' + mapmods : ''}`)
            .setStyle(helper.vars.buttons.type.current)
            .setEmoji(helper.vars.buttons.label.extras.map)
    );


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: useContent,
            embeds: [lbEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);
};

/**
 * list of top plays
 */
export const osutop = async (input: bottypes.commandInput) => {

    const parseArgs = await helper.tools.commands.parseArgs_scoreList(input);
    if (parseArgs.error) {
        scoresParseFail(input);
        return;
    }

    let noMiss = false;


    if (input.overrides) {
        if (input.overrides.page != null) {
            parseArgs.page = input.overrides.page;
        }
        if (input.overrides.sort != null) {
            parseArgs.sort = input.overrides.sort as any;
        }
        if (input.overrides.reverse != null) {
            parseArgs.reverse = input.overrides.reverse;
        }
        if (input.overrides.mode != null) {
            parseArgs.mode = input.overrides.mode;
        }
        if (input.overrides.filterMapper != null) {
            parseArgs.filteredMapper = input.overrides.filterMapper;
        }
        if (input.overrides.filterMods != null) {
            parseArgs.modsInclude = input.overrides.filterMods;
        }
        if (input.overrides.miss != null) {
            noMiss = true;
        }
    }




    const commandButtonName: 'osutop' | 'nochokes' =
        noMiss ? 'nochokes' : 'osutop';

    helper.tools.log.commandOptions(
        helper.tools.log.objectLoggable(parseArgs),
        input.id,
        commandButtonName,
        input.type,
        parseArgs.commanduser,
        input.message,
        input.interaction,
    );

    const buttons = new Discord.ActionRowBuilder();

    //if user is null, use searchid
    if (parseArgs.user == null) {
        const cuser = await helper.tools.data.searchUser(parseArgs.searchid, true);
        parseArgs.user = cuser.username;
        if (parseArgs.mode == null) {
            parseArgs.mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (parseArgs.user == null) {
        const cuser = helper.vars.client.users.cache.get(parseArgs.searchid);
        parseArgs.user = cuser.username;
    }

    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons(commandButtonName, parseArgs.commanduser, input.id);
    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: 'Loading...'
            }
        }, input.canReply);
    }
    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(parseArgs.user, 'osudata', helper.tools.other.modeValidator(parseArgs.mode)) &&
        !('error' in helper.tools.data.findFile(parseArgs.user, 'osudata', helper.tools.other.modeValidator(parseArgs.mode))) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(parseArgs.user, 'osudata', helper.tools.other.modeValidator(parseArgs.mode));
    } else {
        osudataReq = await helper.tools.api.getUser(parseArgs.user, parseArgs.mode, []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'osutop', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', parseArgs.user), false);
        return;
    }
    helper.tools.data.debug(osudataReq, 'command', 'osu', input.message?.guildId ?? input.interaction?.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'osutop', true, helper.vars.errors.noUser(parseArgs.user), true);
        return;
    }

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-User-${commandButtonName}-any-${input.id}-${osudata.id}+${osudata.playmode}`)
            .setStyle(helper.vars.buttons.type.current)
            .setEmoji(helper.vars.buttons.label.extras.user),
    );

    helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(parseArgs.mode), 'User');

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(parseArgs.mode));
    helper.tools.data.storeFile(osudataReq, parseArgs.user, 'osudata', helper.tools.other.modeValidator(parseArgs.mode));

    let osutopdataReq: tooltypes.apiReturn<apitypes.Score[]>;
    if (helper.tools.data.findFile(osudata.id, 'topscoresdata') &&
        input.type == 'button' &&
        !('error' in helper.tools.data.findFile(osudata.id, 'topscoresdata')) &&
        input.buttonType != 'Refresh'
    ) {
        osutopdataReq = helper.tools.data.findFile(osudata.id, 'topscoresdata');
    } else {
        osutopdataReq = await helper.tools.api.getScoresBest(osudata.id, parseArgs.mode, []);
    }

    const osutopdata: apitypes.Score[] & apitypes.Error = osutopdataReq.apiData;
    if (osutopdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'osutop', true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', parseArgs.user), false);
        return;
    }

    helper.tools.data.debug(osutopdataReq, 'command', 'osutop', input.message?.guildId ?? input.interaction?.guildId, 'osuTopData');

    if (osutopdata?.hasOwnProperty('error') || !osutopdata[0]?.user?.username) {
        await helper.tools.commands.errorAndAbort(input, 'osutop', true, `${helper.vars.errors.uErr.osu.scores.best
            .replace('[ID]', parseArgs.user)
            }`, true);
        return;
    }

    helper.tools.data.storeFile(osutopdataReq, osudata.id, 'topscoresdata');

    if (commandButtonName == 'nochokes') {
        for (const score of osutopdata) {
            score.statistics.miss = 0;
            score.max_combo = null;
            score.pp = null;
            score.is_perfect_combo = true;
        }
    }

    if (parseArgs.parseScore) {
        const newScores = helper.tools.formatter.filterScores(osutopdata, parseArgs.sort ?? 'pp',
            {
                mapper: parseArgs.filteredMapper,
                modsInclude: parseArgs.modsInclude,
                title: parseArgs.filterTitle,
                artist: null,
                version: null,
                rank: parseArgs.filterRank,
                modsExact: parseArgs.modsExact,
                modsExclude: parseArgs.modsExclude,
                pp: parseArgs.pp,
                score: parseArgs.score,
                acc: parseArgs.acc,
                combo: parseArgs.combo,
                miss: parseArgs.miss,
                bpm: parseArgs.bpm
            }, parseArgs.reverse,) as apitypes.Score[];
        let pid = +(parseArgs.parseId) - 1;
        if (pid < 0) {
            pid = 0;
        }
        if (pid > newScores.length) {
            pid = newScores.length - 1;
        }
        input.overrides = {
            id: newScores?.[pid]?.id,
            commanduser: parseArgs.commanduser,
            commandAs: input.type,
            ex: `${osudata.username}'s ${helper.tools.calculate.toOrdinal(pid + 1)} ${parseArgs.sort == 'pp' ? helper.tools.formatter.sortDescription(parseArgs.sort ?? 'pp', parseArgs.reverse) + ' ' : ''}${commandButtonName == 'nochokes' ? 'no choke' : 'top'} score`,
            type: commandButtonName == 'nochokes' ? 'nochoke' : null,
        };
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await helper.tools.commands.errorAndAbort(input, 'osutop', true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.type = 'other';

        await scoreparse(input);
        return;
    }

    let topEmbed = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.scorelist.dec)
        .setTitle(`${commandButtonName == 'osutop' ? 'Top' : 'Top no choke'} plays of ${osudata.username}`)
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osumodcalc.ModeIntToName(osutopdata?.[0]?.ruleset_id)}#top_ranks`);
    topEmbed = helper.tools.formatter.userAuthor(osudata, topEmbed);

    const scoresarg = await helper.tools.formatter.scoreList(
        osutopdata, parseArgs.sort ?? 'pp',
        {
            mapper: parseArgs.filteredMapper,
            modsInclude: parseArgs.modsInclude,
            title: parseArgs.filterTitle,
            artist: parseArgs.filterArtist,
            version: parseArgs.filterDifficulty,
            rank: parseArgs.filterRank,
            modsExact: parseArgs.modsExact,
            modsExclude: parseArgs.modsExclude,
            pp: parseArgs.pp,
            score: parseArgs.score,
            acc: parseArgs.acc,
            combo: parseArgs.combo,
            miss: parseArgs.miss,
            bpm: parseArgs.bpm
        }, parseArgs.reverse, parseArgs.scoredetailed, parseArgs.page, true);
    helper.tools.commands.storeButtonArgs(input.id + '', { ...parseArgs, ...{ maxPage: scoresarg.maxPage } });
    topEmbed.setFooter({
        text: `${scoresarg.curPage}/${Math.ceil(scoresarg.maxPage)} | ${parseArgs?.mode ?? osumodcalc.ModeIntToName(osutopdata?.[0]?.ruleset_id)}`
    });
    if (scoresarg.text.includes('ERROR')) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    topEmbed.setDescription(scoresarg.text);

    helper.tools.data.writePreviousId('user', input.message?.guildId ?? input.interaction?.guildId, { id: `${osudata.id}`, apiData: null, mods: null });

    if (scoresarg.curPage <= 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.curPage >= scoresarg.maxPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    if (input.type != 'button' || input.buttonType == 'Refresh') {
        try {
            helper.tools.data.updateUserStats(osudata, osudata.playmode);
        } catch (error) {
            helper.tools.log.commandErr(error, input.id, commandButtonName, input.message, input.interaction);
        }
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [topEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);
};

/**
 * list of pinned scores
 */
export const pinned = async (input: bottypes.commandInput) => {

    const parseArgs = await helper.tools.commands.parseArgs_scoreList(input);
    if (parseArgs.error) {
        scoresParseFail(input);
        return;
    }


    if (input.overrides) {
        if (input.overrides.page != null) {
            parseArgs.page = +(`${input.overrides.page}`);
        }
    }



    const buttons = new Discord.ActionRowBuilder();

    helper.tools.log.commandOptions(
        helper.tools.log.objectLoggable(parseArgs),
        input.id,
        'pinned',
        input.type,
        parseArgs.commanduser,
        input.message,
        input.interaction,
    );
    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('pinned', parseArgs.commanduser, input.id);

    //if user is null, use searchid
    if (parseArgs.user == null) {
        const cuser = await helper.tools.data.searchUser(parseArgs.searchid, true);
        parseArgs.user = cuser.username;
        if (parseArgs.mode == null) {
            parseArgs.mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (parseArgs.user == null) {
        const cuser = helper.vars.client.users.cache.get(parseArgs.searchid);
        parseArgs.user = cuser?.username ?? '';
    }

    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: 'Loading...'
            }
        }, input.canReply);
    }

    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(parseArgs.user, 'osudata', parseArgs.mode) &&
        !('error' in helper.tools.data.findFile(parseArgs.user, 'osudata', parseArgs.mode)) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(parseArgs.user, 'osudata', parseArgs.mode);
    } else {
        osudataReq = await helper.tools.api.getUser(parseArgs.user, parseArgs.mode, []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'firsts', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', parseArgs.user), false);
        return;
    }

    helper.tools.data.debug(osudataReq, 'command', 'pinned', input.message?.guildId ?? input.interaction?.guildId, 'osuData');
    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'pinned', true, helper.vars.errors.noUser(parseArgs.user), true);
        return;
    }

    helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(parseArgs.mode), 'User');

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(parseArgs.mode));
    helper.tools.data.storeFile(osudataReq, parseArgs.user, 'osudata', helper.tools.other.modeValidator(parseArgs.mode));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-User-pinned-any-${input.id}-${osudata.id}+${osudata.playmode}`)
            .setStyle(helper.vars.buttons.type.current)
            .setEmoji(helper.vars.buttons.label.extras.user),
    );

    let pinnedscoresdataReq: tooltypes.apiReturn<apitypes.Score[]>;
    if (helper.tools.data.findFile(osudata.id, 'topscoresdata') &&
        input.type == 'button' &&
        !('error' in helper.tools.data.findFile(osudata.id, 'topscoresdata')) &&
        input.buttonType != 'Refresh'
    ) {
        pinnedscoresdataReq = helper.tools.data.findFile(osudata.id, 'topscoresdata');
    } else {
        pinnedscoresdataReq = await helper.tools.api.getScoresPinned(osudata.id, parseArgs.mode, []);
    }

    const pinnedscoresdata: apitypes.Score[] & apitypes.Error = pinnedscoresdataReq.apiData;
    if (pinnedscoresdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'pinned', true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', parseArgs.user), false);
        return;
    }

    helper.tools.data.debug(pinnedscoresdataReq, 'command', 'pinned', input.message?.guildId ?? input.interaction?.guildId, 'osuTopData');

    if (pinnedscoresdata?.hasOwnProperty('error') || !pinnedscoresdata[0]?.user?.username) {
        await helper.tools.commands.errorAndAbort(input, 'pinned', true, `${helper.vars.errors.uErr.osu.scores.pinned
            .replace('[ID]', parseArgs.user)
            }`, true);
        return;
    }

    helper.tools.data.storeFile(pinnedscoresdataReq, osudata.id, 'pinnedscoresdata');

    if (parseArgs.parseScore) {
        const newScores = helper.tools.formatter.filterScores(pinnedscoresdata, parseArgs.sort ?? 'pp',
            {
                mapper: parseArgs.filteredMapper,
                modsInclude: parseArgs.modsInclude,
                title: parseArgs.filterTitle,
                artist: null,
                version: null,
                rank: parseArgs.filterRank,
                modsExact: parseArgs.modsExact,
                modsExclude: parseArgs.modsExclude,
                pp: parseArgs.pp,
                score: parseArgs.score,
                acc: parseArgs.acc,
                combo: parseArgs.combo,
                miss: parseArgs.miss,
                bpm: parseArgs.bpm
            }, parseArgs.reverse,) as apitypes.Score[];
        let pid = +(parseArgs.parseId) - 1;
        if (pid < 0) {
            pid = 0;
        }
        if (pid > newScores.length) {
            pid = newScores.length - 1;
        }
        input.overrides = {
            id: newScores?.[pid]?.id,
            commanduser: parseArgs.commanduser,
            commandAs: input.type,
            ex: `${osudata.username}'s ${helper.tools.calculate.toOrdinal(pid + 1)} ${parseArgs.sort == 'pp' ? helper.tools.formatter.sortDescription(parseArgs.sort ?? 'pp', parseArgs.reverse) + ' ' : ''}pinned score`
        };
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await helper.tools.commands.errorAndAbort(input, 'pinned', true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.type = 'other';
        await scoreparse(input);
        return;
    }

    let pinnedEmbed = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.scorelist.dec)
        .setTitle(`Pinned scores for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osumodcalc.ModeIntToName(pinnedscoresdata?.[0]?.ruleset_id)}#top_ranks`)
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`);
    pinnedEmbed = helper.tools.formatter.userAuthor(osudata, pinnedEmbed);
    const scoresarg = await helper.tools.formatter.scoreList(
        pinnedscoresdata, parseArgs.sort ?? 'recent',
        {
            mapper: parseArgs.filteredMapper,
            modsInclude: parseArgs.modsInclude,
            title: parseArgs.filterTitle,
            artist: parseArgs.filterArtist,
            version: parseArgs.filterDifficulty,
            rank: parseArgs.filterRank,
            modsExact: parseArgs.modsExact,
            modsExclude: parseArgs.modsExclude,
            pp: parseArgs.pp,
            score: parseArgs.score,
            acc: parseArgs.acc,
            combo: parseArgs.combo,
            miss: parseArgs.miss,
            bpm: parseArgs.bpm
        }, parseArgs.reverse, parseArgs.scoredetailed, parseArgs.page, true);
    helper.tools.commands.storeButtonArgs(input.id + '', { ...parseArgs, ...{ maxPage: scoresarg.maxPage } });
    helper.tools.commands.storeButtonArgs(input.id + '', { ...parseArgs, ...{ maxPage: scoresarg.maxPage } });
    pinnedEmbed.setFooter({
        text: `${scoresarg.curPage}/${Math.ceil(scoresarg.maxPage)} | ${parseArgs?.mode ?? osumodcalc.ModeIntToName(pinnedscoresdata?.[0]?.ruleset_id)}`
    });
    if (scoresarg.text.includes('ERROR')) {
        pinnedEmbed.setDescription('**ERROR**\nNo scores found');
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    pinnedEmbed.setDescription(scoresarg.text);

    if (scoresarg.curPage <= 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.curPage >= scoresarg.maxPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    helper.tools.data.writePreviousId('user', input.message?.guildId ?? input.interaction?.guildId, { id: `${osudata.id}`, apiData: null, mods: null });
    if (input.type != 'button' || input.buttonType == 'Refresh') {
        try {
            helper.tools.data.updateUserStats(osudata, osudata.playmode);
        } catch (error) {
            helper.tools.log.commandErr(error, input.id, 'firsts', input.message, input.interaction);
        }
    }



    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [pinnedEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);
};

/**
 * most recent score or list of recent scores
 */
export const recent = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let user;
    let searchid;
    let page = 0;
    let mode = null;
    let list = false;
    let sort: "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss" = 'recent';
    let showFails = 1;
    let filterTitle = null;
    let filterRank: apitypes.Rank = null;

    let includeMods = null;
    let modsExact = null;
    let modsExclude = null;

    let pp = null;
    let score = null;
    let acc = null;
    let combo = null;
    let miss = null;
    let bpm = null;



    let scoredetailed = 1;

    switch (input.type) {
        case 'message': {


            commanduser = input.message.author;

            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
            const listArgFinder = helper.tools.commands.matchArgMultiple(['-l', '-list', '-detailed'], input.args, false, null, false, false);
            if (listArgFinder.found) {
                list = true;
                input.args = listArgFinder.args;
            }
            const passArgFinder = helper.tools.commands.matchArgMultiple(['-nf', '-nofail', '-pass', '-passes', 'passes=true'], input.args, false, null, false, false);
            if (passArgFinder.found) {
                showFails = 0;
                input.args = passArgFinder.args;
            }

            const temp = await helper.tools.commands.parseArgs_scoreList_message(input);

            page = temp.page;
            mode = temp.mode;
            sort = temp.sort;
            filterTitle = temp.filterTitle;
            scoredetailed = temp.scoredetailed;
            filterRank = temp.filterRank;

            includeMods = temp.modsInclude;
            modsExact = temp.modsExact;
            modsExclude = temp.modsExclude;

            pp = temp.pp;
            score = temp.score;
            acc = temp.acc;
            combo = temp.combo;
            miss = temp.miss;
            bpm = temp.bpm;

            input.args = helper.tools.commands.cleanArgs(input.args);

            user = input.args.join(' ')?.replaceAll('"', '');
            if (!input.args[0] || input.args.join(' ').includes(searchid)) {
                user = null;
            }
        }
            break;



        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;

            commanduser = interaction?.member?.user ?? interaction?.user;
            searchid = commanduser.id;
            user = interaction.options.getString('user');
            page = interaction.options.getNumber('page');
            mode = interaction.options.getString('mode');
            list = interaction.options.getBoolean('list');

            filterTitle = interaction.options.getString('filter');
        }



            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;
            const temp = helper.tools.commands.getButtonArgs(input.id);
            if (temp.error) {
                interaction.followUp({
                    content: helper.vars.errors.paramFileMissing,
                    flags: Discord.MessageFlags.Ephemeral,
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            searchid = temp.searchid;
            user = temp.user;
            mode = temp.mode;
            sort = temp.sortScore;
            page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, input.buttonType);
            list = temp.list;
            scoredetailed = helper.tools.commands.buttonDetail(temp.detailed, input.buttonType);
            showFails = temp.fails;
            filterTitle = temp.filterTitle;
            filterRank = temp.filterRank;

        }
            break;
    }
    if (input.overrides) {
        if (input.overrides.page != null) {
            page = +(`${input.overrides.page}`);
        }
        if (input.overrides.type != null) {
            if (input.overrides.type == 'list') {
                list = true;
            }
            if (input.overrides.type == 'listtaiko') {
                list = true;
                mode = 'taiko';
            }
            if (input.overrides.type == 'listfruits') {
                list = true;
                mode = 'fruits';
            }
            if (input.overrides.type == 'listmania') {
                list = true;
                mode = 'mania';
            }
        }
        if (input?.overrides?.sort != null) {
            sort = (input?.overrides?.sort ?? 'recent') as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
        }
        if (input.overrides.mode != null) {
            mode = input.overrides.mode;
        }
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'List',
                value: list
            },
            {
                name: 'Filter',
                value: filterTitle
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Sort',
                value: sort
            },

            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Exact Mods',
                value: modsExact
            },
            {
                name: 'Detailed',
                value: scoredetailed
            },
            {
                name: 'Filter',
                value: filterTitle
            },
            {
                name: 'Rank',
                value: filterRank
            },
            {
                name: 'pp',
                value: pp
            },
            {
                name: 'Score',
                value: score
            },
            {
                name: 'Accuracy',
                value: acc
            },
            {
                name: 'Combo',
                value: combo
            },
            {
                name: 'Miss',
                value: miss
            },
            {
                name: 'BPM',
                value: bpm
            },
            {
                name: 'Show fails',
                value: showFails
            }
        ],
        input.id,
        'recent',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    const buttons = new Discord.ActionRowBuilder();



    //if user is null, use searchid
    if (user == null) {
        const cuser = await helper.tools.data.searchUser(searchid, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = helper.vars.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = helper.tools.other.modeValidator(mode);

    if (page < 2 || typeof page != 'number') {
        page = 1;
    }
    page--;

    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('recent', commanduser, input.id);

    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: 'Loading...'
            }
        }, input.canReply);
    }
    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode)) &&
        !('error' in helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode))) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode));
    } else {
        osudataReq = await helper.tools.api.getUser(user, mode, []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'recent', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    helper.tools.data.debug(osudataReq, 'command', 'recent', input.message?.guildId ?? input.interaction?.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'recent', true, helper.vars.errors.noUser(user), true);
        return;
    }

    helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(mode), 'User');

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(mode));
    helper.tools.data.storeFile(osudataReq, user, 'osudata', helper.tools.other.modeValidator(mode));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-User-recent-any-${input.id}-${osudata.id}+${osudata.playmode}`)
            .setStyle(helper.vars.buttons.type.current)
            .setEmoji(helper.vars.buttons.label.extras.user),
    );

    let rsdataReq: tooltypes.apiReturn<apitypes.Score[]>;
    if (helper.tools.data.findFile(input.id, 'rsdata') &&
        input.type == 'button' &&
        !('error' in helper.tools.data.findFile(input.id, 'rsdata')) &&
        input.buttonType != 'Refresh'
    ) {
        rsdataReq = helper.tools.data.findFile(input.id, 'rsdata');
    } else {
        rsdataReq = await helper.tools.api.getScoresRecent(osudata.id, mode, [`include_fails=${showFails}`]);
    }

    let rsdata: apitypes.Score[] & apitypes.Error = rsdataReq.apiData;
    if (rsdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'recent', true, helper.vars.errors.uErr.osu.scores.recent.replace('[ID]', user), false);
        return;
    }
    helper.tools.data.debug(rsdataReq, 'command', 'recent', input.message?.guildId ?? input.interaction?.guildId, 'rsData');
    if (rsdata?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'recent', true, helper.vars.errors.uErr.osu.scores.recent.replace('[ID]', user), true);
        return;
    }

    helper.tools.data.storeFile(rsdataReq, input.id, 'rsdata');

    if (filterTitle) {
        rsdata = helper.tools.other.filterScoreQuery(rsdata, filterTitle);
    }

    if (filterRank) {
        rsdata = rsdata.filter(x => x.rank == filterRank);
    }


    let rsEmbed = new Discord.EmbedBuilder();
    rsEmbed = helper.tools.formatter.userAuthor(osudata, rsEmbed);

    let useComponents = [pgbuttons, buttons];
    const useFiles = [];

    if (list != true) {
        rsEmbed.setColor(helper.vars.colours.embedColour.score.dec);

        page = rsdata[page] ? page : 0;

        if (input.buttonType == 'BigRightArrow') {
            page = rsdata.length - 1;
        }

        const curscore = rsdata[page];
        if (!curscore || curscore == undefined || curscore == null) {
            let err = `${helper.vars.errors.uErr.osu.scores.recent_ms
                .replace('[ID]', user)
                .replace('[MODE]', helper.vars.emojis.gamemodes[helper.tools.other.modeValidator(mode)])
                }`;
            if (filterTitle) {
                err = `${helper.vars.errors.uErr.osu.scores.recent_ms
                    .replace('[ID]', user)
                    .replace('[MODE]', helper.vars.emojis.gamemodes[helper.tools.other.modeValidator(mode)])
                    } matching \`${filterTitle}\``;
            }

            if (input.buttonType == null) {
                await helper.tools.commands.sendMessage({
                    type: input.type,
                    message: input.message,
                    interaction: input.interaction,
                    args: {
                        content: err,
                        edit: true
                    }
                }, input.canReply);
            }
            return;
        }

        const curbm = curscore.beatmap;
        const curbms = curscore.beatmapset;

        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Map-recent-any-${input.id}-${curscore.beatmap.id}${curscore.mods ? '+' + curscore.mods.map(x => x.acronym).join() : ''}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.map),
        );

        let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
        if (helper.tools.data.findFile(curbm.id, 'mapdata') &&
            !('error' in helper.tools.data.findFile(curbm.id, 'mapdata')) &&
            input.buttonType != 'Refresh'
        ) {
            mapdataReq = helper.tools.data.findFile(curbm.id, 'mapdata');
        } else {
            mapdataReq = await helper.tools.api.getMap(curbm.id);
        }
        const mapdata: apitypes.Beatmap = mapdataReq.apiData;
        if (mapdataReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'recent', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', `${curbm.id}`), false);
            return;
        }
        helper.tools.data.debug(mapdataReq, 'command', 'recent', input.message?.guildId ?? input.interaction?.guildId, 'mapData');
        if (mapdata?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(input, 'recent', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', curbm.id.toString()), true);
            return;
        }

        helper.tools.data.storeFile(mapdataReq, curbm.id, 'mapdata');
        let cg: osumodcalc.AccGrade;
        const gamehits = curscore.statistics;
        apitypes.RulesetEnum.osu;
        switch (rsdata[0].ruleset_id) {
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

        switch (rsdata[0].ruleset_id) {
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

        const getHits = helper.tools.formatter.returnHits(gamehits, curscore.ruleset_id);
        const failed = helper.tools.other.scoreIsComplete(
            curscore.statistics,
            mapdata.count_circles,
            mapdata.count_sliders,
            mapdata.count_spinners,
        );
        switch (scoredetailed) {
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
            const overrides = helper.tools.calculate.modOverrides(curscore.mods);
            perf = await helper.tools.performance.calcScore({
                mods: curscore.mods.map(x => x.acronym).join('').length > 1 ?
                    curscore.mods.map(x => x.acronym).join('') : 'NM',
                mode: curscore.ruleset_id,
                mapid: curscore.beatmap.id,
                stats: curscore.statistics,
                accuracy: curscore.accuracy,
                maxcombo: curscore.max_combo,
                passedObjects: failed.objectsHit,
                mapLastUpdated: new Date(curscore.beatmap.last_updated),
                customAR: overrides.ar,
                customHP: overrides.hp,
                customCS: overrides.cs,
                customOD: overrides.od,
                clockRate: overrides.speed,
            });
            fcperf = await helper.tools.performance.calcFullCombo({
                mods: curscore.mods.map(x => x.acronym).join('').length > 1 ?
                    curscore.mods.map(x => x.acronym).join('') : 'NM',
                mode: curscore.ruleset_id,
                mapid: curscore.beatmap.id,
                accuracy: curscore.accuracy,
                stats: curscore.statistics,
                mapLastUpdated: new Date(curscore.beatmap.last_updated),
                customAR: overrides.ar,
                customHP: overrides.hp,
                customCS: overrides.cs,
                customOD: overrides.od,
                clockRate: overrides.speed,
            });
            ssperf = await helper.tools.performance.calcFullCombo({
                mods: curscore.mods.map(x => x.acronym).join('').length > 1 ?
                    curscore.mods.map(x => x.acronym).join('') : 'NM',
                mode: curscore.ruleset_id,
                mapid: curscore.beatmap.id,
                accuracy: 1,
                mapLastUpdated: new Date(curscore.beatmap.last_updated),
                customAR: overrides.ar,
                customHP: overrides.hp,
                customCS: overrides.cs,
                customOD: overrides.od,
                clockRate: overrides.speed,
            });
            rspp =
                curscore.pp ?
                    curscore.pp.toFixed(2) :
                    perf.pp.toFixed(2);
            helper.tools.data.debug([perf, fcperf, ssperf], 'command', 'recent', input.message?.guildId ?? input.interaction?.guildId, 'ppCalcing');

            const mxCombo = perf.difficulty.maxCombo ?? mapdata?.max_combo;

            if (curscore.accuracy < 1 && curscore.max_combo == mxCombo) {
                fcflag = `FC\n**${ssperf.pp.toFixed(2)}**pp IF SS`;
            }
            if (curscore.max_combo != mxCombo) {
                fcflag =
                    `\n**${fcperf.pp.toFixed(2)}**pp IF FC
                **${ssperf.pp.toFixed(2)}**pp IF SS`;
            }
            if (curscore.max_combo == mxCombo && curscore.accuracy == 1) {
                fcflag = 'FC';
            }

        } catch (error) {
            rspp =
                curscore.pp ?
                    curscore.pp.toFixed(2) :
                    NaN;
            ppissue = helper.vars.errors.uErr.osu.performance.crash;
            helper.tools.log.commandErr(error, input.id, 'firsts', input.message, input.interaction);
        }

        const curbmhitobj = mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners;
        let msToFail: number, curbmpasstime: number, guesspasspercentage: number;
        if (!curscore.passed) {
            msToFail = await helper.tools.other.getFailPoint(totalhits, `${helper.vars.path.files}/maps/${curbm.id}.osu`);
            curbmpasstime = Math.floor(msToFail / 1000);
            guesspasspercentage = Math.abs((totalhits / curbmhitobj) * 100);
        }

        // let showFailGraph = false;
        // let FailGraph = '';

        let rsgrade;
        rsgrade = helper.vars.emojis.grades[curscore.rank.toUpperCase()];
        if (!curscore.passed) {
            rspassinfo = `${guesspasspercentage.toFixed(2)}% completed (${helper.tools.calculate.secondsToTime(curbmpasstime)}/${helper.tools.calculate.secondsToTime(curbm.total_length)})`;
            rsgrade =
                helper.vars.emojis.grades.F + `(${helper.vars.emojis.grades[curscore.rank.toUpperCase()]} if pass)`;
        }

        const fulltitle = `${mapdata.beatmapset.artist} - ${mapdata.beatmapset.title} [${mapdata.version}]`;
        let trycount = 1;
        for (let i = rsdata.length - 1; i > (page); i--) {
            if (curbm.id == rsdata[i].beatmap.id) {
                trycount++;
            }
        }
        const trycountstr = `try #${trycount}`;
        const mxcombo =
            perf.difficulty.maxCombo;
        // mapdata.max_combo;
        let modadjustments = '';
        if (curscore.mods.filter(x => x?.settings?.speed_change).length > 0) {
            modadjustments += ' (' + curscore.mods.filter(x => x?.settings?.speed_change)[0].settings.speed_change + 'x)';
        }

        rsEmbed
            .setAuthor({
                name: `${trycountstr} | #${helper.tools.calculate.separateNum(osudata?.statistics?.global_rank)} | #${helper.tools.calculate.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${helper.tools.calculate.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/users/${osudata.id}`,
                iconURL: `${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`
            })
            .setTitle(`#${page + 1} most recent ${showFails == 1 ? 'play' : 'pass'} for ${curscore.user.username} | <t:${new Date(curscore.ended_at).getTime() / 1000}:R>`)
            .setURL(curscore.id ? `https://osu.ppy.sh/scores/${curscore.id}` : `https://osu.ppy.sh/b/${curbm.id}`)
            .setThumbnail(`${curbms.covers.list}`);
        rsEmbed
            .setDescription(`
[\`${fulltitle}\`](https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods.length > 0 ? '+' + osumodcalc.OrderMods(curscore.mods.map(x => x.acronym).join('').toUpperCase()).string + modadjustments : ''} 
${(perf.difficulty.stars ?? 0).toFixed(2)}⭐ | ${helper.vars.emojis.gamemodes[curscore.ruleset_id]}
${helper.tools.formatter.dateToDiscordFormat(new Date(curscore.ended_at), 'F')}
${filterTitle ? `Filter: ${filterTitle}\n` : ''}${filterRank ? `Filter by rank: ${filterRank}\n` : ''}
`)
            .addFields([
                {
                    name: 'SCORE DETAILS',
                    value: `${helper.tools.calculate.separateNum(helper.tools.other.getTotalScore(curscore))}\n${(curscore.accuracy * 100).toFixed(2)}% | ${rsgrade}\n ${curscore.has_replay ? `[REPLAY](https://osu.ppy.sh/scores/${curscore.id}/download)\n` : ''}` +
                        `${rspassinfo.length > 1 ? rspassinfo + '\n' : ''}\`${hitlist}\`\n${curscore.max_combo == mxcombo ? `**${curscore.max_combo}x**` : `${curscore.max_combo}x`}/**${mxcombo}x** combo`,
                    inline: true
                },
                {
                    name: 'PP',
                    value: `**${rspp}**pp ${fcflag}\n${ppissue}`,
                    inline: true
                }
            ]);

        helper.tools.commands.storeButtonArgs(input.id, {
            user,
            searchid,
            page: page + 1,
            maxPage: rsdata.length,
            mode,
            sortScore: sort,
            fails: showFails,
            filterTitle,
            filterRank,
            modsInclude: includeMods,
            modsExact: modsExact,
            modsExclude: modsExclude,
            filterPp: pp,
            filterScore: score,
            filterAcc: acc,
            filterCombo: combo,
            filterMiss: miss,
            filterBpm: bpm,
            detailed: scoredetailed
        });

        //if first page, disable previous button
        if (page == 0) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        } else {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(false);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(false);
        }

        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);

        //if last page, disable next button
        if (page >= rsdata.length - 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        } else {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(false);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(false);
        }
        helper.tools.data.writePreviousId('map', input.message?.guildId ?? input.interaction?.guildId,
            {
                id: `${curbm.id}`,
                apiData: null,
                mods: curscore.mods.map(x => x.acronym).join()
            });
        helper.tools.data.writePreviousId('score', input.message?.guildId ?? input.interaction?.guildId,
            {
                id: `${curscore.id}`,
                apiData: curscore,
                mods: curscore.mods.map(x => x.acronym).join()
            });
        helper.tools.data.writePreviousId('user', input.message?.guildId ?? input.interaction?.guildId, { id: `${osudata.id}`, apiData: null, mods: null });

        if (buttons.toJSON().components.length >= 5) {
            const xsbuttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-Scores-recent-any-${input.id}-${curbm.id}+${osudata.id}`)
                        .setStyle(helper.vars.buttons.type.current)
                        .setEmoji(helper.vars.buttons.label.extras.leaderboard),
                );
            useComponents = [pgbuttons, buttons, xsbuttons];
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Scores-recent-any-${input.id}-${curbm.id}+${osudata.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.leaderboard),
            );
            useComponents = [pgbuttons, buttons];
        }

        // strains graph
        const strains = await helper.tools.performance.calcStrains({
            mapid: mapdata.id,
            mode: curscore.ruleset_id,
            mods: curscore.mods.map(x => x.acronym).join(''),
            mapLastUpdated: new Date(mapdata.last_updated)
        });
        try {
            helper.tools.data.debug(strains, 'command', 'recent', input.message?.guildId ?? input.interaction?.guildId, 'strains');
        } catch (error) {
            helper.tools.data.debug({ error: error }, 'command', 'recent', input.message?.guildId ?? input.interaction?.guildId, 'strains');
            helper.tools.log.stdout(error);
        }
        let strainsgraph = {
            path: '',
            filename: '',
        };
        // for when i figure out how to add fail point to strains graph
        /* if (curscore.rank.toUpperCase() == 'F' && false) {
            strainsgraph =
                await helper.tools.other.graph(
                    strains.strainTime, strains.value, 'Strains', {
                    startzero: true,
                    type: 'bar',
                    fill: true,
                    displayLegend: false,
                    title: 'Strains',
                    imgUrl: helper.tools.api.mapImages(mapdata.beatmapset_id).full,
                    blurImg: true,
                },
                    null,
                    [totalhits - 1]
                );
        } else */ {
            strainsgraph =
                await helper.tools.other.graph(strains.strainTime, strains.value, 'Strains', {
                    startzero: true,
                    type: 'bar',
                    fill: true,
                    displayLegend: false,
                    title: 'Strains',
                    imgUrl: helper.tools.api.mapImages(mapdata.beatmapset_id).full,
                    blurImg: true,
                });
        }
        useFiles.push(strainsgraph.path);
        rsEmbed.setImage(`attachment://${strainsgraph.filename}.jpg`);
    } else if (list) {
        rsEmbed
            .setColor(helper.vars.colours.embedColour.scorelist.dec)
            .setTitle(`Recent ${showFails == 1 ? 'plays' : 'passes'} for ${osudata.username}`)
            .setThumbnail(`${osudata.avatar_url ?? helper.vars.defaults.images.any.url}`);
        if (sort == 'pp') {
            rsEmbed.setTitle(`Best recent ${showFails == 1 ? 'plays' : 'passes'} for ${osudata.username}`);
        }
        page++;
        const scoresarg = await helper.tools.formatter.scoreList(rsdata, sort,
            {
                mapper: null,
                artist: null,
                title: null,
                version: null,
                rank: null,
                modsInclude: includeMods,
                modsExact: modsExact,
                modsExclude: modsExclude,
                pp,
                score,
                acc,
                combo,
                miss,
                bpm
            }, false, scoredetailed, page, true,);
        helper.tools.commands.storeButtonArgs(input.id, {
            user,
            searchid,
            page: scoresarg.curPage - 1,
            maxPage: scoresarg.maxPage,
            mode,
            sortScore: sort,
            fails: showFails,
            filterTitle,
            filterRank,
            modsInclude: includeMods,
            modsExact: modsExact,
            modsExclude: modsExclude,
            filterPp: pp,
            filterScore: score,
            filterAcc: acc,
            filterCombo: combo,
            filterMiss: miss,
            filterBpm: bpm,
            detailed: scoredetailed,
            list: true,
        });
        rsEmbed.setFooter({
            text: `${scoresarg.curPage}/${scoresarg.maxPage} | ${mode ?? osumodcalc.ModeIntToName(rsdata?.[0]?.ruleset_id)}`
        });
        if (scoresarg.text.includes('ERROR')) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }
        rsEmbed.setDescription(scoresarg.text);
        if (scoresarg.curPage <= 1) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }
        if (scoresarg.curPage >= scoresarg.maxPage) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }
    }
    helper.tools.data.writePreviousId('user', input.message?.guildId ?? input.interaction?.guildId, { id: `${osudata.id}`, apiData: null, mods: null });

    if (input.type != 'button' || input.buttonType == 'Refresh') {
        try {
            helper.tools.data.updateUserStats(osudata, osudata.playmode);
        } catch (error) {
            helper.tools.log.commandErr(error, input.id, 'firsts', input.message, input.interaction);
        }
    }

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [rsEmbed],
            components: useComponents,
            files: useFiles,
            edit: true
        }
    }, input.canReply);
};

/**
 * parse replay file and return data
 */
export const replayparse = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    switch (input.type) {
        case 'link': {
            commanduser = input.message.author;
        } break;
    }
    helper.tools.log.commandOptions(
        [],
        input.id,
        'replayparse',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    const decoder = new osuparsers.ScoreDecoder();
    const score = await decoder.decodeFromPath(`${helper.vars.path.files}/replays/${input.id}.osr`);
    helper.tools.data.debug(score, 'fileparse', 'replay', input.message?.guildId ?? input.interaction?.guildId, 'replayData');

    let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;

    if (helper.tools.data.findFile(score.info.beatmapHashMD5, `mapdata`) &&

        !('error' in helper.tools.data.findFile(score.info.beatmapHashMD5, `mapdata`)) &&
        input.buttonType != 'Refresh') {
        mapdataReq = helper.tools.data.findFile(score.info.beatmapHashMD5, `mapdata`);
    } else {
        mapdataReq = await
            helper.tools.api.getMapSha(score.info.beatmapHashMD5, []);
    }
    const mapdata: apitypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'replayparse', true, helper.vars.errors.uErr.osu.map.ms_md5.replace('[ID]', score.info.beatmapHashMD5), false);
        return;
    }
    helper.tools.data.storeFile(mapdataReq, score.info.beatmapHashMD5, 'mapdata');

    helper.tools.data.debug(mapdataReq, 'fileparse', 'replay', input.message?.guildId ?? input.interaction?.guildId, 'mapData');
    if (mapdata?.id) {
        typeof mapdata.id == 'number' ? helper.tools.data.writePreviousId('map', input.message?.guildId ?? input.interaction?.guildId,
            {
                id: `${mapdata.id}`,
                apiData: null,
                mods: osumodcalc.ModIntToString(score.info?.mods?.bitwise ?? 0)
            }
        ) : '';
    }

    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(score.info.username, 'osudata', helper.tools.other.modeValidator('osu')) &&
        !('error' in helper.tools.data.findFile(score.info.username, 'osudata', helper.tools.other.modeValidator('osu'))) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(score.info.username, 'osudata', helper.tools.other.modeValidator('osu'));
    } else {
        osudataReq = await helper.tools.api.getUser(score.info.username, 'osu', []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'replayparse', true, helper.vars.errors.uErr.osu.profile.user_msp.replace('[ID]', score.info.username), false);
        return;
    }
    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(score.replay.mode));
    helper.tools.data.storeFile(osudataReq, score.info.username, 'osudata', helper.tools.other.modeValidator(score.replay.mode));
    helper.tools.data.debug(osudataReq, 'fileparse', 'replay', input.message?.guildId ?? input.interaction?.guildId, 'osuData');
    let userid: string | number;
    try {
        userid = osudata.id;
    } catch (err) {
        userid = 0;
        return;
    }
    let mapbg: string;
    let mapcombo: string | number;
    const fulltitle: string = `${mapdata.beatmapset.artist} - ${mapdata.beatmapset.title} [${mapdata.version}]`;
    let mapdataid: string;

    const mods = score.info?.mods?.bitwise ?? 0;
    let ifmods: string;
    if (mods != 0) {
        ifmods = `+${osumodcalc.ModIntToString(mods)}`;
    } else {
        ifmods = '';
    }
    const hitlist = helper.tools.formatter.hitList(osumodcalc.ModeIntToName(score.replay.mode),
        {
            count_geki: score.info.countGeki,
            count_300: score.info.count300,
            count_katu: score.info.countKatu,
            count_100: score.info.count100,
            count_50: score.info.count50,
            count_miss: score.info.countMiss,
        }
    );
    let cg: osumodcalc.AccGrade;
    switch (osumodcalc.ModeIntToName(score.replay.mode)) {
        case 'osu': default:
            cg = osumodcalc.calcgrade(score.info.count300, score.info.count100, score.info.count50, score.info.countMiss);
            break;
        case 'taiko':
            cg = osumodcalc.calcgradeTaiko(score.info.count300, score.info.count100, score.info.countMiss);
            break;
        case 'fruits':
            cg = osumodcalc.calcgradeCatch(score.info.count300, score.info.count100, score.info.count50, score.info.countKatu, score.info.countMiss);
            break;
        case 'mania':
            cg = osumodcalc.calcgradeMania(score.info.countGeki, score.info.count300, score.info.countKatu, score.info.count100, score.info.count50, score.info.countMiss);
            break;
    }
    const failed = helper.tools.other.scoreIsComplete(
        score.info as any,
        mapdata.count_circles,
        mapdata.count_sliders,
        mapdata.count_spinners,
    );
    let ppissue: string;
    let perf: rosu.PerformanceAttributes = helper.tools.performance.template(mapdata);
    let fcperf: rosu.PerformanceAttributes = helper.tools.performance.template(mapdata);
    try {
        if (!mapdata.id) throw new Error('no map');
        perf = await helper.tools.performance.calcScore(
            {
                mods: osumodcalc.ModIntToString(score.info?.mods?.bitwise ?? 0),
                mode: score.replay.mode,
                mapid: mapdata.id,
                stats: {
                    great: score.info.count300,
                    miss: score.info.countMiss
                },
                accuracy: cg.accuracy,
                maxcombo: score.info.maxCombo,
                passedObjects: failed.objectsHit,
                mapLastUpdated: new Date(mapdata.last_updated)
            }
        );
        fcperf = await helper.tools.performance.calcFullCombo({
            mods: osumodcalc.ModIntToString(score.info?.mods?.bitwise ?? 0),
            mode: score.replay.mode,
            mapid: mapdata.id,
            accuracy: cg.accuracy,
            stats: {
                great: score.info.count300,
                miss: score.info.countMiss
            },
            mapLastUpdated: new Date(mapdata.last_updated)
        });
        ppissue = '';
    } catch (error) {
        ppissue = helper.vars.errors.uErr.osu.performance.mapMissing;
        helper.tools.log.stdout(error);
    }

    try {
        mapbg = mapdata.beatmapset.covers['list@2x'];
        mapcombo = perf.difficulty.maxCombo ? perf.difficulty.maxCombo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : NaN;
        mapdataid = 'https://osu.ppy.sh/b/' + mapdata.id;
    } catch (error) {
        mapbg = 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png';
        mapcombo = NaN;
        mapdataid = 'https://osu.ppy.sh/images/layout/avatar-guest@2x.png';
    }

    const isfail = failed ?
        `${failed.percentage.toFixed(2)}% passed (${helper.tools.calculate.secondsToTime(failed.percentage / 100 * mapdata.hit_length)}/${helper.tools.calculate.secondsToTime(mapdata.hit_length)})`
        : '';
    const chartInit = await helper.tools.other.graph(score.replay.lifeBar.map(x => helper.tools.calculate.secondsToTime(x.startTime / 1000)), score.replay.lifeBar.map(x => Math.floor(x.health * 100)), 'Health', {
        fill: false,
        startzero: true,
        pointSize: 0,
        gradient: true
    });

    const chartFile = new Discord.AttachmentBuilder(chartInit.path);

    const chart = chartInit.filename;

    const Embed = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.score.dec)
        .setAuthor({ name: `${score.info.username}'s replay`, iconURL: `https://a.ppy.sh/${userid}`, url: `https://osu.ppy.sh/users/${userid}` })
        .setTitle(`${fulltitle} ${ifmods}`)
        .setURL(`${mapdataid}`)
        .setThumbnail(mapbg)
        .setDescription(
            `
${score.info.maxCombo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x/**${mapcombo}x** | ${cg.accuracy.toFixed(2)}%
\`${hitlist}\`
${perf.pp.toFixed(2)}pp | ${fcperf.pp.toFixed(2)}pp if FC 
${ppissue}
${isfail}
`
        )
        .setImage(`attachment://${chart}.jpg`);



    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [Embed],
            files: [chartFile]
        }
    }, input.canReply);
};

/**
 * parse score and return data
 */
export const scoreparse = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;

    let scoremode: apitypes.GameMode;
    let scoreid: number | string;
    let nochoke: boolean = false;
    let overrideAuthor: string;

    let scoredetailed: number = 1;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;

            scoremode = input.args[1] as apitypes.GameMode;
            scoreid = input.args[0];
            if (input?.args[0]?.includes('https://')) {
                const temp = helper.tools.commands.scoreIdFromLink(input.args[0]);
                scoremode = temp.mode;
                scoreid = temp.id;
            }
        }
            break;



        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;
            //osu.ppy.sh/scores/<mode>/<id>
            scoremode = input.message.embeds[0].url.split('scores')[1].split('/')[1] as apitypes.GameMode;
            scoreid = input.message.embeds[0].url.split('scores')[1].split('/')[2];

            switch (input.buttonType) {
                case 'Detail0':
                    scoredetailed = 0;
                    break;
                case 'Detail1':
                    scoredetailed = 1;
                    break;
                case 'Detail2':
                    scoredetailed = 2;
                    break;
            }
        }
            break;
        case 'link': {
            commanduser = input.message.author;
            let scorelink = input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
            const temp = helper.tools.commands.scoreIdFromLink(scorelink);
            scoremode = temp.mode;
            scoreid = temp.id;
        }
    }

    if (input.overrides) {
        if (input.overrides?.id != null) {
            scoreid = input.overrides.id;
        }
        if (input.overrides?.mode != null) {
            scoremode = input.overrides.mode;
        }
        if (input.overrides?.commanduser != null) {
            commanduser = input.overrides.commanduser;
        }
        if (input.overrides?.commandAs != null) {
            input.type = input.overrides.commandAs;
        }
        if (input.overrides?.ex != null) {
            overrideAuthor = input.overrides.ex as string;
        }
        if (input.overrides?.type == 'nochoke') {
            nochoke = true;
        }
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'Score Mode',
                value: `${scoremode}`
            },
            {
                name: 'Score ID',
                value: `${scoreid}`
            }
        ],
        input.id,
        'scoreparse',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    if (!scoreid) {
        const temp = helper.tools.data.getPreviousId('score', input.message?.guildId ?? input.interaction?.guildId);
        if (temp?.apiData?.best_id && typeof temp?.apiData?.best_id === 'number') {
            scoreid = temp?.apiData?.best_id;
        } else {
            await helper.tools.commands.sendMessage({
                type: input.type,
                message: input.message,
                interaction: input.interaction,
                args: {
                    content: helper.vars.errors.uErr.osu.score.ms,
                    edit: true
                }
            }, input.canReply);
            return;
        }
    }

    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: 'Loading...'
            }
        }, input.canReply);
    }
    let scoredataReq: tooltypes.apiReturn<apitypes.Score>;

    if (helper.tools.data.findFile(scoreid, 'scoredata') &&
        !('error' in helper.tools.data.findFile(scoreid, 'scoredata')) &&
        input.buttonType != 'Refresh'
    ) {
        scoredataReq = helper.tools.data.findFile(scoreid, 'scoredata');
    } else {
        scoredataReq = await (scoremode ?
            helper.tools.api.getScoreWithMode(scoreid, scoremode, []) :
            helper.tools.api.getScore(scoreid, []));

    }

    const scoredata: apitypes.Score = scoredataReq.apiData;
    if (scoredataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'scoreparse', true, helper.vars.errors.uErr.osu.score.nd
            .replace('[SID]', scoreid.toString())
            .replace('[MODE]', scoremode), false);
        return;
    }

    if (scoredata?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'scoreparse', true, helper.vars.errors.uErr.osu.score.nd
            .replace('[SID]', scoreid.toString())
            .replace('[MODE]', scoremode), true);
        return;
    }
    helper.tools.data.storeFile(scoredataReq, scoreid, 'scoredata', helper.tools.other.modeValidator(scoredata.ruleset_id));

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Map-scoreparse-any-${input.id}-${scoredata?.beatmap?.id}${scoredata.mods ? '+' + scoredata.mods.map(x => x.acronym).join() : ''}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.map),
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-User-scoreparse-any-${input.id}-${scoredata.user_id}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.user),
        );


    helper.tools.data.debug(scoredataReq, 'command', 'scoreparse', input.message?.guildId ?? input.interaction?.guildId, 'scoreData');
    try {
        scoredata.rank.toUpperCase();
    } catch (error) {
        await helper.tools.commands.errorAndAbort(input, 'scoreparse', true, helper.vars.errors.uErr.osu.score.wrong + ` - osu.ppy.sh/scores/${scoremode}/${scoreid}`, true);
        return;
    }
    let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
    if (helper.tools.data.findFile(scoredata.beatmap.id, 'mapdata') &&
        !('error' in helper.tools.data.findFile(scoredata.beatmap.id, 'mapdata')) &&
        input.buttonType != 'Refresh') {
        mapdataReq = helper.tools.data.findFile(scoredata.beatmap.id, 'mapdata');
    } else {
        mapdataReq = await helper.tools.api.getMap(scoredata.beatmap.id);
    }

    const mapdata: apitypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'scoreparse', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', `${scoredata.beatmap.id}`), false);
        return;
    }
    if (mapdata?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'scoreparse', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', scoredata.beatmap.id.toString()), true);
        return;
    }

    helper.tools.data.storeFile(mapdataReq, scoredata.beatmap.id, 'mapdata');

    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(scoredata.user.username, 'osudata', helper.tools.other.modeValidator(scoredata.ruleset_id)) &&
        !('error' in helper.tools.data.findFile(scoredata.user.username, 'osudata', helper.tools.other.modeValidator(scoredata.ruleset_id))) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(scoredata.user.username, 'osudata', helper.tools.other.modeValidator(scoredata.ruleset_id));
    } else {
        osudataReq = await helper.tools.api.getUser(scoredata.user.username, helper.tools.other.modeValidator(scoredata.ruleset_id), []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'scoreparse', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', scoredata.user.username), false);
        return;
    }
    helper.tools.data.debug(osudataReq, 'command', 'scoreparse', input.message?.guildId ?? input.interaction?.guildId, 'osuData');
    if (osudata?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'scoreparse', true, `${helper.vars.errors.uErr.osu.profile.user
            .replace('[ID]', scoredata?.user?.username)
            } AKA ${scoredata.user.username}`, true);
        return;
    }

    helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(scoredata.ruleset_id), 'User');

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(scoredata.ruleset_id));
    helper.tools.data.storeFile(osudataReq, scoredata.user.username, 'osudata', helper.tools.other.modeValidator(scoredata.ruleset_id));


    const scoregrade = helper.vars.emojis.grades[scoredata.rank.toUpperCase()];

    const gamehits = scoredata.statistics;

    const mode = scoredata.ruleset_id;
    let hitlist: string;
    let ppissue: string = '';

    const getHits = helper.tools.formatter.returnHits(gamehits, scoredata.ruleset_id);

    switch (scoredetailed) {
        default: {
            hitlist = getHits.short;
        }
            break;
        case 2: {
            hitlist = getHits.long;
        }
            break;
    }

    let perf: rosu.PerformanceAttributes;
    let fcperf: rosu.PerformanceAttributes;
    let ssperf: rosu.PerformanceAttributes;
    try {
        const overrides = helper.tools.calculate.modOverrides(scoredata.mods);
        perf = await helper.tools.performance.calcScore({
            mods: scoredata.mods.map(x => x.acronym).join('').length > 1 ?
                scoredata.mods.map(x => x.acronym).join('') : 'NM',
            mode: scoredata.ruleset_id,
            mapid: scoredata.beatmap.id,
            stats: scoredata.statistics,
            accuracy: scoredata.accuracy,
            maxcombo: scoredata.max_combo,
            mapLastUpdated: new Date(scoredata.beatmap.last_updated),
            customAR: overrides.ar,
            customHP: overrides.hp,
            customCS: overrides.cs,
            customOD: overrides.od,
            clockRate: overrides.speed,
        });
        fcperf = await helper.tools.performance.calcFullCombo({
            mods: scoredata.mods.map(x => x.acronym).join('').length > 1 ?
                scoredata.mods.map(x => x.acronym).join('') : 'NM',
            mode: scoredata.ruleset_id,
            stats: scoredata.statistics,
            mapid: scoredata.beatmap.id,
            accuracy: scoredata.accuracy,
            mapLastUpdated: new Date(scoredata.beatmap.last_updated),
            customAR: overrides.ar,
            customHP: overrides.hp,
            customCS: overrides.cs,
            customOD: overrides.od,
            clockRate: overrides.speed,
        });
        ssperf = await helper.tools.performance.calcFullCombo({
            mods: scoredata.mods.map(x => x.acronym).join('').length > 1 ?
                scoredata.mods.map(x => x.acronym).join('') : 'NM',
            stats: scoredata.statistics,
            mode: scoredata.ruleset_id,
            mapid: scoredata.beatmap.id,
            accuracy: 1,
            mapLastUpdated: new Date(scoredata.beatmap.last_updated),
            customAR: overrides.ar,
            customHP: overrides.hp,
            customCS: overrides.cs,
            customOD: overrides.od,
            clockRate: overrides.speed,
        });

        helper.tools.data.debug([perf, fcperf, ssperf], 'command', 'scoreparse', input.message?.guildId ?? input.interaction?.guildId, 'ppCalcing');
    } catch (error) {
        const temp = helper.tools.performance.template(mapdata);
        perf = temp;
        fcperf = temp;
        ssperf = temp;
        ppissue = 'Error - pp calculator could not fetch beatmap';
        helper.tools.log.stdout(error);
    }

    const fulltitle = `${mapdata.beatmapset.artist} - ${mapdata.beatmapset.title} [${mapdata.version}]`;

    const mxCombo = perf.difficulty.maxCombo ?? mapdata?.max_combo;
    let fcflag = '';

    if (nochoke) {
        perf = fcperf;
        scoredata.max_combo = mxCombo;
        scoredata.pp = null;
        scoredata.statistics.miss = 0;
        scoredata.is_perfect_combo = true;
    }

    if (scoredata.accuracy < 1 && scoredata.max_combo == mxCombo) {
        fcflag = ` FC | **${ssperf.pp.toFixed(2)}**pp IF SS`;
    }
    if (scoredata.max_combo != mxCombo) {
        fcflag =
            ` | **${fcperf.pp.toFixed(2)}**pp IF FC | **${ssperf.pp.toFixed(2)}**pp IF SS`;
    }
    if (scoredata.max_combo == mxCombo && scoredata.accuracy == 1) {
        fcflag = 'FC';
    }

    let scorerank =
        scoredata.rank_global ? ` #${scoredata.rank_global} global` : '' +
            scoredata.rank_country ? ` #${scoredata.rank_country} ${osudata.country_code.toUpperCase()} :flag_${osudata.country_code.toLowerCase()}:` : ''
        ;
    if (scorerank != '') {
        scorerank = '| ' + scorerank;
    }

    let scoreembed = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.score.dec)
        .setTitle(fulltitle)
        .setURL(scoredata.id ? `https://osu.ppy.sh/scores/${scoredata.id}` : `https://osu.ppy.sh/b/${scoredata.id}`)
        .setThumbnail(`${scoredata.beatmapset.covers['list@2x']}`);
    scoreembed = helper.tools.formatter.userAuthor(osudata, scoreembed, overrideAuthor);


    scoreembed
        .setDescription(`${helper.tools.calculate.separateNum(helper.tools.other.getTotalScore(scoredata))} ${scorerank} ${scoredata.has_replay ? `| [REPLAY](https://osu.ppy.sh/scores/${scoredata.ruleset_id}/${scoredata.id}/download)` : ''}
${(scoredata.accuracy * 100).toFixed(2)}% | ${scoregrade} ${scoredata.mods.length > 0 ? '| ' + `**${osumodcalc.OrderMods(scoredata.mods.map(x => x.acronym).join('')).string}**` : ''}
<t:${Math.floor(new Date(scoredata.ended_at).getTime() / 1000)}:F> | ${helper.tools.formatter.dateToDiscordFormat(new Date(scoredata.ended_at))}
[Beatmap](https://osu.ppy.sh/b/${scoredata.beatmap.id})
\`${hitlist}\`
${scoredata.max_combo == mxCombo ? `**${scoredata.max_combo}x**` : `${scoredata.max_combo}x`}/**${mxCombo}x**
${`${(scoredata?.pp ?? perf.pp).toFixed(2)}pp` + fcflag}\n${ppissue}
`);

    helper.tools.data.writePreviousId('score', input.message?.guildId ?? input.interaction?.guildId,
        {
            id: `${scoredata.id}`,
            apiData: scoredata,
            mods: scoredata.mods.map(x => x.acronym).join()
        });
    helper.tools.data.writePreviousId('map', input.message?.guildId ?? input.interaction?.guildId,
        {
            id: `${mapdata.id}`,
            apiData: null,
            mods: scoredata.mods.map(x => x.acronym).join()
        }
    );

    let useComponents = [buttons];

    if (buttons.toJSON().components.length >= 5) {
        const xsbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Scores-scoreparse-any-${input.id}-${scoredata.beatmap.id}+${osudata.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.leaderboard),
            );
        useComponents = [buttons, xsbuttons];
    }

    // strains graph
    const strains = await helper.tools.performance.calcStrains({
        mapid: mapdata.id,
        mode: scoredata.ruleset_id,
        mods: scoredata.mods.map(x => x.acronym).join(''),
        mapLastUpdated: new Date(mapdata.last_updated),
    });
    try {
        helper.tools.data.debug(strains, 'command', 'recent', input.message?.guildId ?? input.interaction?.guildId, 'strains');
    } catch (error) {
        helper.tools.data.debug({ error: error }, 'command', 'recent', input.message?.guildId ?? input.interaction?.guildId, 'strains');
        helper.tools.log.stdout(error);
    }
    const strainsgraph =
        await helper.tools.other.graph(strains.strainTime, strains.value, 'Strains', {
            startzero: true,
            type: 'bar',
            fill: true,
            displayLegend: false,
            title: 'Strains',
            imgUrl: helper.tools.api.mapImages(mapdata.beatmapset_id).full,
            blurImg: true,
        });
    scoreembed.setImage(`attachment://${strainsgraph.filename}.jpg`);



    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [scoreembed],
            components: useComponents,
            files: [strainsgraph.path],
            edit: true
        }
    }, input.canReply);
};

/**
 * list of user's scores on a map
 */
export const scores = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let user;
    let searchid;
    let mapid;
    let page = 1;
    let scoredetailed: number = 1;

    let sort: "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss" = 'recent';
    let reverse = false;
    let mode: apitypes.GameMode = 'osu';

    let parseScore = false;
    let parseId = null;

    let useContent: string = null;



    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
            if (input.args.includes('-parse')) {
                parseScore = true;
                const temp = helper.tools.commands.parseArg(input.args, '-parse', 'number', 1, null, true);
                parseId = temp.value;
                input.args = temp.newArgs;
            }

            const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, input.args, true, 'number', false, true);
            if (pageArgFinder.found) {
                page = pageArgFinder.output;
                input.args = pageArgFinder.args;
            }
            const detailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.details, input.args, false, null, false, false);
            if (detailArgFinder.found) {
                scoredetailed = 2;
                input.args = detailArgFinder.args;
            }
            const lessDetailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.compress, input.args, false, null, false, false);
            if (lessDetailArgFinder.found) {
                scoredetailed = 0;
                input.args = lessDetailArgFinder.args;
            }
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = helper.tools.commands.cleanArgs(input.args);

            mapid = (await helper.tools.commands.mapIdFromLink(input.args.join(' '), true,)).map;
            if (mapid != null) {
                input.args.splice(input.args.indexOf(input.args.find(arg => arg.includes('https://osu.ppy.sh/'))), 1);
            }

            const usertemp = helper.tools.commands.fetchUser(input.args.join(' '));
            user = usertemp.id;
            if (usertemp.mode && !mode) {
                mode = usertemp.mode;
            }
            if (!user || user.includes(searchid)) {
                user = null;
            }
        }
            break;



        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;

            commanduser = interaction?.member?.user ?? interaction?.user;
            searchid = commanduser.id;
            user = interaction.options.getString('username');
            mapid = interaction.options.getNumber('id');
            sort = interaction.options.getString('sort') as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
            reverse = interaction.options.getBoolean('reverse');

            parseId = interaction.options.getInteger('parse');
            if (parseId != null) {
                parseScore = true;
            }
        }



            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;
            const temp = helper.tools.commands.getButtonArgs(input.id);
            if (temp.error) {
                interaction.followUp({
                    content: helper.vars.errors.paramFileMissing,
                    flags: Discord.MessageFlags.Ephemeral,
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            user = temp.user;
            searchid = temp.searchid;
            page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, input.buttonType);
            scoredetailed = helper.tools.commands.buttonDetail(temp.detailed, input.buttonType);
            sort = temp.sortScore;
            reverse = temp.reverse;
            mode = temp.mode;
            parseScore = temp.parse;
            parseId = temp.parseId;
        }
            break;
    }
    if (input.overrides) {
        if (input.overrides.page != null) {
            page = input.overrides.page;
        }
        if (input.overrides.sort != null) {
            sort = input.overrides.sort as "score" | "rank" | "pp" | "recent" | "acc" | "combo" | "miss";
        }
        if (input.overrides.reverse != null) {
            reverse = input.overrides.reverse;
        }
        if (input.overrides.commandAs) {
            input.type = input.overrides.commandAs;
        }
        if (input.overrides.commanduser) {
            commanduser = input.overrides.commanduser;
            useContent = `Requested by <@${commanduser.id}>`;
        }
        if (input.overrides.user) {
            user = input.overrides.user;
        }
        if (input.overrides.id) {
            mapid = input.overrides.id;
        }
    }



    const buttons = new Discord.ActionRowBuilder();

    helper.tools.log.commandOptions(
        [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Sort',
                value: sort
            },
            {
                name: 'Reverse',
                value: reverse
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Detailed',
                value: scoredetailed
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
        ],
        input.id,
        'scores',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('scores', commanduser, input.id);



    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }

    //if user is null, use searchid
    if (user == null) {
        const cuser = await helper.tools.data.searchUser(searchid, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = helper.vars.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = helper.tools.other.modeValidator(mode);

    if (!mapid) {
        const temp = helper.tools.data.getPreviousId('map', input.message?.guildId ?? input.interaction?.guildId);
        mapid = temp.id;
    }
    if (mapid == false) {
        helper.tools.commands.missingPrevID_map(input, 'scores');
        return;
    }

    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode)) &&
        !('error' in helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode))) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode));
    } else {
        osudataReq = await helper.tools.api.getUser(user, mode, []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'scores', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    helper.tools.data.debug(osudataReq, 'command', 'scores', input.message?.guildId ?? input.interaction?.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'scores', true, helper.vars.errors.noUser(user), true);
        return;

    }

    helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(mode), 'User');

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(mode));
    helper.tools.data.storeFile(osudataReq, user, 'osudata', helper.tools.other.modeValidator(mode));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-User-scores-any-${input.id}-${osudata.id}+${osudata.playmode}`)
            .setStyle(helper.vars.buttons.type.current)
            .setEmoji(helper.vars.buttons.label.extras.user),
    );

    let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
    if (helper.tools.data.findFile(mapid, 'mapdata') &&
        !('error' in helper.tools.data.findFile(mapid, 'mapdata')) &&
        input.buttonType != 'Refresh'
    ) {
        mapdataReq = helper.tools.data.findFile(mapid, 'mapdata');
    } else {
        mapdataReq = await helper.tools.api.getMap(mapid, []);
    }
    const mapdata: apitypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'scores', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', mapid), false);
        return;
    }
    helper.tools.data.debug(mapdataReq, 'command', 'scores', input.message?.guildId ?? input.interaction?.guildId, 'mapData');
    if (mapdata?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'scores', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', mapid), true);
        return;
    }

    let scoredataReq: tooltypes.apiReturn<apitypes.ScoreArrA>;
    if (helper.tools.data.findFile(input.id, 'scores') &&
        input.type == 'button' &&
        !('error' in helper.tools.data.findFile(input.id, 'scores')) &&
        input.buttonType != 'Refresh'
    ) {
        scoredataReq = helper.tools.data.findFile(input.id, 'scores');
    } else {
        scoredataReq = await helper.tools.api.getUserMapScores(osudata.id, mapid, []);
    }

    const scoredataPresort: apitypes.ScoreArrA = scoredataReq.apiData;
    if (scoredataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'scores', true, helper.vars.errors.uErr.osu.scores.map.replace('[ID]', user).replace('[MID]', mapid), false);
        return;
    }
    helper.tools.data.debug(scoredataReq, 'command', 'scores', input.message?.guildId ?? input.interaction?.guildId, 'scoreDataPresort');

    if (scoredataPresort?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'scores', true, helper.vars.errors.uErr.osu.scores.map.replace('[ID]', user).replace('[MID]', mapid), true);
        return;
    }

    helper.tools.data.storeFile(scoredataReq, input.id, 'scores');

    const scoredata: apitypes.Score[] = scoredataPresort.scores;

    helper.tools.data.debug(scoredataReq, 'command', 'scores', input.message?.guildId ?? input.interaction?.guildId, 'scoreData');

    if (parseScore) {
        let pid = +(parseId) - 1;
        if (isNaN(pid) || pid < 0) {
            pid = 0;
        }
        if (pid > scoredata.length) {
            pid = scoredata.length - 1;
        }
        input.overrides = {
            id: scoredata?.[pid]?.id,
            commanduser,
            commandAs: input.type
        };
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await helper.tools.commands.errorAndAbort(input, 'scores', true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.type = 'other';
        await scoreparse(input);
        return;
    }

    helper.tools.data.storeFile(mapdataReq, mapid, 'mapdata');

    const title = `${mapdata.beatmapset.artist} - ${mapdata.beatmapset.title} [${mapdata.version}]`;

    let scoresEmbed = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.scorelist.dec)
        .setTitle(`\`${title} \n[${mapdata.version}]\``)
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
        .setImage(`${mapdata.beatmapset.covers['cover@2x']}`)
        .setURL(`https://osu.ppy.sh/b/${mapid}`);
    scoresEmbed = helper.tools.formatter.userAuthor(osudata, scoresEmbed);
    if (page > Math.ceil(scoredata.length / 5)) {
        page = Math.ceil(scoredata.length / 5) - 1;
    }
    const scoresarg = await helper.tools.formatter.scoreList(scoredata, sort,
        {
            mapper: null,
            artist: null,
            title: null,
            version: null,
            rank: null,
            modsInclude: null,
            modsExact: null,
            modsExclude: null,
            pp: null,
            score: null,
            acc: null,
            combo: null,
            miss: null,
            bpm: null
        }, reverse, scoredetailed, page, false, 'single_map', mapdata);
    helper.tools.commands.storeButtonArgs(input.id + '', {
        user,
        searchid,
        mapId: mapid,
        page: scoresarg.curPage,
        maxPage: scoresarg.maxPage,
        detailed: scoredetailed,
        sortScore: sort,
        reverse,
        mode,
        parse: parseScore,
        parseId,
    });
    scoresEmbed.setFooter({
        text: `${scoresarg.curPage}/${scoresarg.maxPage} | ${mode ?? osumodcalc.ModeIntToName(scoredata?.[0]?.ruleset_id)}`
    });
    if (scoresarg.text.includes('ERROR')) {
        scoresEmbed.setDescription('**ERROR**\nNo scores found');
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    scoresEmbed.setDescription(scoresarg.text);

    helper.tools.data.writePreviousId('user', input.message?.guildId ?? input.interaction?.guildId, { id: `${osudata.id}`, apiData: null, mods: null });
    helper.tools.data.writePreviousId('map', input.message?.guildId ?? input.interaction?.guildId,
        {
            id: `${mapdata.id}`,
            apiData: null,
            mods: null
        }
    );

    if (scoresarg.curPage <= 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (scoresarg.curPage >= scoresarg.maxPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }



    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: useContent,
            embeds: [scoresEmbed],
            components: [pgbuttons, buttons],
            edit: true
        }
    }, input.canReply);

};

/**
 * statistics for scores
 */
export const scorestats = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    type scoretypes = 'firsts' | 'best' | 'recent' | 'pinned';
    let scoreTypes: scoretypes = 'best';
    let user = null;
    let searchid;
    let mode: apitypes.GameMode;
    let all: boolean = false;

    let reachedMaxCount = false;


    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;
            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }
            const firstArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['first', 'firsts', 'globals', 'global', 'f', 'g']), input.args, false, null, false, false);
            if (firstArgFinder.found) {
                scoreTypes = 'firsts';
                input.args = firstArgFinder.args;
            }
            const topArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['osutop', 'top', 'best', 't', 'b']), input.args, false, null, false, false);
            if (topArgFinder.found) {
                scoreTypes = 'best';
                input.args = topArgFinder.args;
            }
            const recentArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['r', 'recent', 'rs']), input.args, false, null, false, false);
            if (recentArgFinder.found) {
                scoreTypes = 'recent';
                input.args = recentArgFinder.args;
            }
            const pinnedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['pinned', 'pins', 'pin', 'p']), input.args, false, null, false, false);
            if (pinnedArgFinder.found) {
                scoreTypes = 'pinned';
                input.args = pinnedArgFinder.args;
            }
            const allFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['all', 'd', 'a', 'detailed']), input.args, false, null, false, false);
            if (allFinder.found) {
                all = true;
                input.args = allFinder.args;
            }

            input.args = helper.tools.commands.cleanArgs(input.args);

            const usertemp = helper.tools.commands.fetchUser(input.args.join(' '));
            user = usertemp.id;
            if (usertemp.mode && !mode) {
                mode = usertemp.mode;
            }
            if (!user || user.includes(searchid)) {
                user = null;
            }
        }
            break;

        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;

            commanduser = interaction?.member?.user ?? interaction?.user;
            searchid = commanduser.id;
            interaction.options.getString('user') ? user = interaction.options.getString('user') : null;
            interaction.options.getString('type') ? scoreTypes = interaction.options.getString('type') as scoretypes : null;
            interaction.options.getString('mode') ? mode = interaction.options.getString('mode') as apitypes.GameMode : null;
            interaction.options.getBoolean('all') ? all = interaction.options.getBoolean('all') : null;
        }


            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;
            searchid = commanduser.id;
            user = input.message.embeds[0].author.url.split('/users/')[1].split('/')[0];
            mode = input.message.embeds[0].author.url.split('/users/')[1].split('/')[1] as apitypes.GameMode;
            //user's {type} scores
            scoreTypes = input.message.embeds[0].title.split(' scores')[0].split(' ')[0].toLowerCase() as scoretypes;
        }
            break;
        case 'link': {

            commanduser = input.message.author;
        }
            break;
    }


    //detailed button

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder();
    // .addComponents(
    //     new Discord.ButtonBuilder()
    //         .setCustomId(`${helper.vars.versions.releaseDate}-Details-scorestats-${commanduser.id}-${input.id}`)
    //         .setStyle(helper.vars.buttons.type.current)
    //         .setEmoji(helper.vars.buttons.label.main.detailed),
    // );

    helper.tools.log.commandOptions(
        [{
            name: 'Score Type',
            value: scoreTypes
        },
        {
            name: 'User',
            value: user
        },
        {
            name: 'Mode',
            value: mode
        },
        {
            name: 'Search ID',
            value: searchid
        },
        {
            name: 'All',
            value: all,
        }],
        input.id,
        'scorestats',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


    //if user is null, use searchid
    if (user == null) {
        const cuser = await helper.tools.data.searchUser(searchid, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = helper.vars.client.users.cache.get(searchid);
        user = cuser.username;
    }

    mode = mode ? helper.tools.other.modeValidator(mode) : null;

    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode)) &&
        !('error' in helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode))) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode));
    } else {
        osudataReq = await helper.tools.api.getUser(user, mode, []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'scorestats', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    helper.tools.data.debug(osudataReq, 'command', 'scorestats', input.message?.guildId ?? input.interaction?.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'scorestats', true, helper.vars.errors.noUser(user), true);
        return;
    }

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(mode));
    helper.tools.data.storeFile(osudataReq, user, 'osudata', helper.tools.other.modeValidator(mode));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-User-scorestats-any-${input.id}-${osudata.id}+${osudata.playmode}`)
            .setStyle(helper.vars.buttons.type.current)
            .setEmoji(helper.vars.buttons.label.extras.user),
    );

    let scoresdata: apitypes.Score[] & apitypes.Error = [];

    async function getScoreCount(cinitnum: number) {
        let req: tooltypes.apiReturn<apitypes.Score[]>;
        switch (scoreTypes) {
            case 'firsts':
                req = await helper.tools.api.getScoresBest(osudata.id, helper.tools.other.modeValidator(mode), [`offset=${cinitnum}`]);
                break;
            case 'best':
                req = await helper.tools.api.getScoresBest(osudata.id, helper.tools.other.modeValidator(mode), []);
                break;
            case 'recent':
                req = await helper.tools.api.getScoresBest(osudata.id, helper.tools.other.modeValidator(mode), []);
                break;
            case 'pinned':
                req = await helper.tools.api.getScoresBest(osudata.id, helper.tools.other.modeValidator(mode), []);
                break;
        }
        const fd: apitypes.Score[] & apitypes.Error = req.apiData;
        if (req?.error) {
            await helper.tools.commands.errorAndAbort(input, 'scorestats', true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', user).replace('top', scoreTypes == 'best' ? 'top' : scoreTypes), false);
            return;
        }
        if (fd?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(input, 'scorestats', true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', user).replace('top', scoreTypes == 'best' ? 'top' : scoreTypes), true);
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }
            scoresdata.push(fd[i]);
        }
        if (scoresdata.length == 500 && scoreTypes == 'firsts') {
            reachedMaxCount = true;
        } else if (scoreTypes == 'firsts') {
            await getScoreCount(cinitnum + 100);
        }
    }

    const dataFilename =
        scoreTypes == 'firsts' ?
            'firstscoresdata' :
            `${scoreTypes}scoresdata`;

    if (helper.tools.data.findFile(osudata.id, dataFilename) &&
        !('error' in helper.tools.data.findFile(osudata.id, dataFilename)) &&
        input.buttonType != 'Refresh'
    ) {
        scoresdata = helper.tools.data.findFile(osudata.id, dataFilename);
    } else {
        await getScoreCount(0);
    }
    helper.tools.data.storeFile(scoresdata, osudata.id, dataFilename);

    // let useFiles: string[] = [];

    let Embed: Discord.EmbedBuilder = new Discord.EmbedBuilder()
        .setTitle(`Statistics for ${osudata.username}'s ${scoreTypes} scores`)
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`);
    Embed = helper.tools.formatter.userAuthor(osudata, Embed);
    if (scoresdata.length == 0) {
        Embed.setDescription('No scores found');
    } else {
        Embed.setDescription(`${helper.tools.calculate.separateNum(scoresdata.length)} scores found\n${reachedMaxCount ? 'Only first 100 scores are calculated' : ''}`);
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

        if (all) {
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
        if (input.type == 'button') {
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
            if (all) {
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

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [Embed],
            edit: true,
            components: [buttons],
            // files: useFiles
        }
    }, input.canReply);

};

/**
 * simulate play on a map
 */
export const simulate = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let mapid = null;
    let mods = null;
    let acc = null;
    let combo = null;
    let n300 = null;
    let n100 = null;
    let n50 = null;
    let nMiss = null;
    let overrideSpeed = 1;
    let overrideBpm: number = null;
    let customCS;
    let customAR;
    let customOD;
    let customHP;

    switch (input.type) {
        case 'message': {


            commanduser = input.message.author;
            const ctn = input.message.content;
            if (ctn.includes('-mods')) {
                const temp = helper.tools.commands.parseArg(input.args, '-mods', 'string', mods);
                mods = temp.value;
                input.args = temp.newArgs;
            }
            const accArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['acc', 'accuracy', '%',]), input.args, true, 'number', false, false);
            if (accArgFinder.found) {
                acc = accArgFinder.output;
                input.args = accArgFinder.args;
            }
            const comboArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['x', 'combo', 'maxcombo',]), input.args, true, 'number', false, true);
            if (comboArgFinder.found) {
                combo = comboArgFinder.output;
                input.args = comboArgFinder.args;
            }
            const n300ArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['n300', '300s',]), input.args, true, 'number', false, true);
            if (n300ArgFinder.found) {
                n300 = n300ArgFinder.output;
                input.args = n300ArgFinder.args;
            }
            const n100ArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['n100', '100s',]), input.args, true, 'number', false, true);
            if (n100ArgFinder.found) {
                n100 = n100ArgFinder.output;
                input.args = n100ArgFinder.args;
            }
            const n50ArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['n50', '50s',]), input.args, true, 'number', false, true);
            if (n50ArgFinder.found) {
                n50 = n50ArgFinder.output;
                input.args = n50ArgFinder.args;
            }
            const nMissArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['miss', 'misses', 'n0', '0s',]), input.args, true, 'number', false, true);
            if (nMissArgFinder.found) {
                nMiss = nMissArgFinder.output;
                input.args = nMissArgFinder.args;
            }
            if (input.args.includes('-bpm')) {
                const temp = helper.tools.commands.parseArg(input.args, '-bpm', 'number', overrideBpm);
                overrideBpm = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-speed')) {
                const temp = helper.tools.commands.parseArg(input.args, '-speed', 'number', overrideSpeed);
                overrideSpeed = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-cs')) {
                const temp = helper.tools.commands.parseArg(input.args, '-cs', 'number', customCS);
                customCS = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-ar')) {
                const temp = helper.tools.commands.parseArg(input.args, '-ar', 'number', customAR);
                customAR = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-od')) {
                const temp = helper.tools.commands.parseArg(input.args, '-od', 'number', customOD);
                customOD = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-hp')) {
                const temp = helper.tools.commands.parseArg(input.args, '-hp', 'number', customHP);
                customHP = temp.value;
                input.args = temp.newArgs;
            }
            input.args = helper.tools.commands.cleanArgs(input.args);

            if (ctn.includes('+')) {
                mods = ctn.split('+')[1].split(' ')[0];
                let i = 0;
                for (; i < input.args.length; i++) {
                    if (input.args[i].includes('+')) {
                        break;
                    }
                }
                input.args = input.args.slice(0, i).concat(input.args.slice(i + 1, input.args.length));
            }
            mapid = (await helper.tools.commands.mapIdFromLink(input.args.join(' '), true)).map;
        }
            break;
        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
            mapid = interaction.options.getInteger('id');
            mods = interaction.options.getString('mods');
            acc = interaction.options.getNumber('accuracy');
            combo = interaction.options.getInteger('combo');
            n300 = interaction.options.getInteger('n300');
            n100 = interaction.options.getInteger('n100');
            n50 = interaction.options.getInteger('n50');
            nMiss = interaction.options.getInteger('miss');
        }



            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Mods',
                value: mods
            },
            {
                name: 'Accuracy',
                value: acc
            },
            {
                name: 'Combo',
                value: combo
            },
            {
                name: 'n300',
                value: n300
            },
            {
                name: 'n100',
                value: n100
            },
            {
                name: 'n50',
                value: n50
            },
            {
                name: 'Misses',
                value: nMiss
            },
            {
                name: 'Override BPM',
                value: overrideBpm
            },
            {
                name: 'Override Speed',
                value: overrideSpeed
            },
        ],
        input.id,
        'simulate',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


    if (!mapid) {
        const temp = helper.tools.data.getPreviousId('map', input.message?.guildId ?? input.interaction?.guildId);
        mapid = temp.id;
    }
    if (mapid == false) {
        helper.tools.commands.missingPrevID_map(input, 'simulate');
        return;
    }

    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }

    const tempscore = helper.tools.data.getPreviousId('score', input.message?.guildId ?? input.interaction?.guildId);
    if (tempscore?.apiData && tempscore?.apiData.beatmap.id == mapid) {
        if (!n300 && !n100 && !n50 && !acc) {
            n300 = tempscore.apiData.statistics.great;
            n100 = tempscore.apiData.statistics.ok;
            n50 = tempscore.apiData.statistics.meh;
            acc = tempscore.apiData.accuracy * 100;
        }
        if (!nMiss) {
            nMiss = tempscore.apiData.statistics.miss;
        }
        if (!combo) {
            combo = tempscore.apiData.max_combo;
        }
        if (!mods) {
            mods = tempscore.apiData.mods.map(x => x.acronym).join('');
        }
    }

    let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;

    if (helper.tools.data.findFile(mapid, 'mapdata') &&
        !('error' in helper.tools.data.findFile(mapid, 'mapdata')) &&
        input.buttonType != 'Refresh') {
        mapdataReq = helper.tools.data.findFile(mapid, 'mapdata');
    } else {
        mapdataReq = await helper.tools.api.getMap(mapid, []);
    }

    const mapdata: apitypes.Beatmap = mapdataReq.apiData;
    if (mapdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'simulate', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', mapid), false);
        return;
    }
    helper.tools.data.debug(mapdataReq, 'command', 'map', input.message?.guildId ?? input.interaction?.guildId, 'mapData');

    if (mapdata?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'simulate', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', mapid), true);
        return;
    }
    helper.tools.data.storeFile(mapdataReq, mapid, 'mapdata');



    if (!mods) {
        mods = 'NM';
    }
    if (!combo) {
        combo = undefined;
    }

    if (overrideBpm && !overrideSpeed) {
        overrideSpeed = overrideBpm / mapdata.bpm;
    }
    if (overrideSpeed && !overrideBpm) {
        overrideBpm = overrideSpeed * mapdata.bpm;
    }

    if (mods.includes('DT') || mods.includes('NC')) {
        overrideSpeed *= 1.5;
        overrideBpm *= 1.5;
    }
    if (mods.includes('HT')) {
        overrideSpeed *= 0.75;
        overrideBpm *= 1.5;
    }
    const scorestat: apitypes.ScoreStatistics = {
        great: n300,
        ok: n100,
        meh: n50,
        miss: nMiss ?? 0,
    };
    const perf = await helper.tools.performance.calcScore({
        mods,
        mode: 0,
        mapid,
        stats: scorestat,
        accuracy: acc,
        maxcombo: combo,
        clockRate: overrideSpeed,
        mapLastUpdated: new Date(mapdata.last_updated),
        customCS,
        customAR,
        customOD,
        customHP,
    });
    const fcperf = await helper.tools.performance.calcFullCombo({
        mods,
        mode: 0,
        mapid,
        stats: scorestat,
        accuracy: acc,
        clockRate: overrideSpeed,
        mapLastUpdated: new Date(mapdata.last_updated),
        customCS,
        customAR,
        customOD,
        customHP,
    });
    helper.tools.data.debug([perf, fcperf], 'command', 'simulate', input.message?.guildId ?? input.interaction?.guildId, 'ppCalc');

    let use300s = (n300 ?? 0);
    const gotTot = use300s + (n100 ?? 0) + (n50 ?? 0) + (nMiss ?? 0);
    if (gotTot != mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners) {
        while (use300s < (mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners)) {
            use300s++;
        }
    }

    const useAcc = osumodcalc.calcgrade(
        use300s,
        n100 ?? 0,
        n50 ?? 0,
        nMiss ?? 0
    );


    const mapPerf = await helper.tools.performance.calcMap({
        mods,
        mode: 0,
        mapid,
        clockRate: overrideSpeed,
        mapLastUpdated: new Date(mapdata.last_updated)
    });

    const title = `${mapdata.beatmapset.artist} - ${mapdata.beatmapset.title} [${mapdata.version}]`;
    const mxCombo = perf.difficulty.maxCombo;
    const scoreEmbed = new Discord.EmbedBuilder()
        .setTitle(`Simulated play on \n\`${title}\``)
        .setURL(`https://osu.ppy.sh/b/${mapid}`)
        .setThumbnail(mapdata?.beatmapset_id ? `https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg` : `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
        .addFields([
            {
                name: 'Score Details',
                value:
                    `${(acc ?? useAcc?.accuracy)?.toFixed(2)}% | ${nMiss ?? 0}x misses
${combo ?? mxCombo}x/**${mxCombo}**x
${mods ?? 'No mods'}
\`${n300}/${n100}/${n50}/${nMiss}\`
Speed: ${overrideSpeed ?? 1}x (${overrideBpm ?? mapdata.bpm}BPM)
`,
                inline: false
            },
            {
                name: 'Performance',
                value:
                    `
${perf.pp?.toFixed(2)}pp | ${fcperf.pp?.toFixed(2)}pp if ${(acc ?? useAcc?.accuracy)?.toFixed(2)}% FC
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
${helper.vars.emojis.mapobjs.star}${(perf?.difficulty?.stars ?? mapdata.difficulty_rating)?.toFixed(2)}
                `,
                inline: true
            },
        ]);


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [scoreEmbed],
            edit: true
        }
    }, input.canReply);
};

function scoresParseFail(input: bottypes.commandInput) {
    helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: 'There was an error trying to parse'
        }
    }, input.canReply);
}