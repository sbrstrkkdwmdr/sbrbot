import * as Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as apitypes from '../types/osuapi.js';

type formatterInfo = {
    text: string,
    curPage: number,
    maxPage: number,
};

const ranks = [
    'XH',
    'X',
    'SH',
    'S',
    'A',
    'B',
    'C',
    'D',
    'F',
];

export async function scoreList(
    scores: apitypes.ScoreLegacy[] | apitypes.Score[],
    scoretype: 'legacy' | 'current',
    sort: 'pp' | 'score' | 'recent' | 'acc' | 'combo' | 'miss' | 'rank',
    filter: {
        mapper: string,
        title: string,
        artist: string,
        version: string,
        modsInclude: string,
        modsExact: string,
        modsExclude: string,
        rank: string,
        pp: string,
        score: string,
        acc: string,
        combo: string,
        miss: string,
        bpm: string,
    },
    reverse: boolean,
    detail: number,
    page: number,
    showOriginalIndex: boolean,
    showUsername?: boolean,
    showMap?: boolean,
    overrideMap?: apitypes.Beatmap
): Promise<formatterInfo> {
    const newScores =
        scoretype == 'legacy' ?
            filterScoresLegacy(scores as apitypes.ScoreLegacy[], sort, filter, reverse, overrideMap) :
            filterScores(scores as apitypes.Score[], sort, filter, reverse, overrideMap);
    if (newScores.length == 0) {
        return {
            text: 'No scores were found (check the filter options)',
            curPage: 0,
            maxPage: 0,
        };
    }
    let max = 5;
    if (detail == 2) max = 10;
    let maxPage = Math.ceil(newScores.length / max);
    if (isNaN(page) || page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    let offset = (page - 1) * max;
    let text = '';

    for (let i = 0; i < max && i < newScores.length - offset; i++) {
        let score = newScores[i + offset];
        if (!score) break;
        let convertedScore = score as apitypes.ScoreLegacy;
        if (scoretype == 'current') {
            convertedScore = CurrentToLegacyScore(score as apitypes.Score);
        }
        const perf = await helper.tools.performance.calcScore({
            mapid: (overrideMap ?? convertedScore.beatmap).id,
            mode: convertedScore.mode,
            mods: convertedScore.mods.join(''),
            accuracy: score.accuracy,
            hit300: convertedScore.statistics.count_300,
            hit100: convertedScore.statistics.count_100,
            hit50: convertedScore.statistics.count_50,
            miss: convertedScore.statistics.count_miss,
            hitkatu: convertedScore.statistics.count_katu,
            maxcombo: convertedScore.max_combo,
            mapLastUpdated: new Date((overrideMap ?? convertedScore.beatmap).last_updated),
        });
        const fc = await helper.tools.performance.calcFullCombo({
            mapid: (overrideMap ?? score.beatmap).id,
            mode: convertedScore.mode,
            mods: convertedScore.mods.join(''),
            accuracy: convertedScore.accuracy,
            hit300: convertedScore.statistics.count_300,
            hit100: convertedScore.statistics.count_100,
            hit50: convertedScore.statistics.count_50,
            hitkatu: convertedScore.statistics.count_katu,
            mapLastUpdated: new Date((overrideMap ?? score.beatmap).last_updated),
        });
        let info = `**#${(showOriginalIndex ? score.originalIndex : i) + 1}`;
        if (showMap != false) {
            if (scoretype == 'legacy') {
                score = score as indexedScore<apitypes.ScoreLegacy>;
                info += `・[${score.beatmapset.title} [${(overrideMap ?? score.beatmap).version}]](https://osu.ppy.sh/scores/${score.mode}/${score.id})`;
            } else {
                score = score as indexedScore<apitypes.Score>;
                info += `・[${score.beatmapset.title} [${(overrideMap ?? score.beatmap).version}]](https://osu.ppy.sh/scores/${score.id})`;
            }
        }
        if (showUsername) {
            info += `・[${score.user.username}](https://osu.ppy.sh/u/${score.user_id})`;
        }
        let combo = `${score.max_combo}/**${fc.difficulty.maxCombo}x**`;
        if (score.max_combo == fc.difficulty.maxCombo) combo = `**${score.max_combo}x**`;
        if (scoretype == 'legacy') {
            score = score as indexedScore<apitypes.ScoreLegacy>;
            info +=
                `**
    \`${helper.tools.calculate.numberShorthand(score.score)}\` |${score.mods.length > 0 ? ' **' + score.mods.join('') + '** |' : ''} ${dateToDiscordFormat(new Date(score.created_at))}
    \`${hitList(score.mode, score.statistics)}\` | ${combo} | ${(score.accuracy * 100).toFixed(2)}% | ${helper.vars.emojis.grades[score.rank]}
    ${(score?.pp ?? perf.pp).toFixed(2)}pp`;
        } else {
            const tempScore = score as indexedScore<apitypes.Score>;
            info +=
                `**
    \`${helper.tools.calculate.numberShorthand(tempScore.total_score)}\` |${tempScore.mods.length > 0 ? ' **' + tempScore.mods.map(x => x.acronym).join('') + '** |' : ''} ${dateToDiscordFormat(new Date(tempScore.ended_at))}
    \`${hitList(convertedScore.mode, convertedScore.statistics)}\` | ${combo} | ${(score.accuracy * 100).toFixed(2)}% | ${helper.vars.emojis.grades[score.rank]}
    ${(score?.pp ?? perf.pp).toFixed(2)}pp`;
        }
        if (!convertedScore?.perfect) {
            info += ' (' + fc.pp.toFixed(2) + 'pp if FC)';
        }
        info += '\n\n';
        text += info;
    }
    if (text == '') {
        switch (0) {
            case scores.length:
                text = '**ERROR**\nNo scores found';
                break;
            case newScores.length:
                text = '**ERROR**\nNo scores found matching the given filters';
                break;
        }
        text = '**ERROR**\nNo scores found';
    }
    return {
        text,
        curPage: page,
        maxPage
    };
}

type indexedScore<T> = T & {
    originalIndex: number,
};

export function filterScoresLegacy(
    scores: apitypes.ScoreLegacy[],
    sort: 'pp' | 'score' | 'recent' | 'acc' | 'combo' | 'miss' | 'rank',
    filter: {
        mapper: string,
        title: string,
        artist: string,
        version: string,
        modsInclude: string,
        modsExact: string,
        modsExclude: string,
        rank: string,
        pp: string,
        score: string,
        acc: string,
        combo: string,
        miss: string,
        bpm: string,
    },
    reverse: boolean,
    overrideMap?: apitypes.Beatmap
): indexedScore<apitypes.ScoreLegacy>[] {
    let newScores = [] as indexedScore<apitypes.ScoreLegacy>[];
    for (let i = 0; i < scores.length; i++) {
        const newScore = { ...scores[i], ...{ originalIndex: i } };
        newScores.push(newScore);
    }
    if (filter.mapper) {
        newScores = newScores.filter(score =>
            matchesString(score.beatmapset.user.username, filter.mapper) || matchesString(score.beatmapset.user_id + '', filter.mapper) || matchesString((overrideMap ?? score.beatmap).user_id + '', filter.mapper));
    }
    if (filter.title) {
        newScores = newScores.filter(score =>
            matchesString(score.beatmapset.title, filter.title) || matchesString(score.beatmapset.title_unicode, filter.title));
    }
    if (filter.artist) {
        newScores = newScores.filter(score =>
            matchesString(score.beatmapset.artist, filter.artist) || matchesString(score.beatmapset.artist_unicode, filter.artist));
    }
    if (filter.version) {
        newScores = newScores.filter(score =>
            matchesString((overrideMap ?? score.beatmap).version, filter.version));
    }
    if (filter.pp) {
        const tempArg = argRange(filter.pp, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    score.pp <= tempArg.max :
                    tempArg.min ?
                        score.pp >= tempArg.min :
                        score.pp == tempArg.exact : true);
    }
    if (filter.score) {
        const tempArg = argRange(filter.score, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    score.score <= tempArg.max :
                    tempArg.min ?
                        score.score >= tempArg.min :
                        score.score == tempArg.exact : true);
    }
    if (filter.acc) {
        const tempArg = argRange(filter.acc, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    score.accuracy * 100 <= tempArg.max :
                    tempArg.min ?
                        score.accuracy * 100 >= tempArg.min :
                        score.accuracy * 100 == tempArg.exact : true);
    }
    if (filter.combo) {
        const tempArg = argRange(filter.combo, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    score.max_combo <= tempArg.max :
                    tempArg.min ?
                        score.max_combo >= tempArg.min :
                        score.max_combo == tempArg.exact : true);
    }
    if (filter.miss) {
        const tempArg = argRange(filter.miss, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    score.statistics.count_miss <= tempArg.max :
                    tempArg.min ?
                        score.statistics.count_miss >= tempArg.min :
                        score.statistics.count_miss == tempArg.exact : true);
    }
    if (filter.bpm) {
        const tempArg = argRange(filter.bpm, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    (overrideMap ?? score.beatmap).bpm <= tempArg.max :
                    tempArg.min ?
                        (overrideMap ?? score.beatmap).bpm >= tempArg.min :
                        (overrideMap ?? score.beatmap).bpm == tempArg.exact : true);
    }
    if (filter.modsInclude?.includes('NM')) {
        filter.modsExact = filter.modsInclude.replace('NM', '');
        filter.modsInclude = null;
    }
    if (filter.modsInclude) {
        newScores = newScores.filter(score => {
            let x: boolean = true;
            score.mods.forEach(mod => {
                if (!osumodcalc.modHandler(filter.modsInclude, score.mode).includes(mod as osumodcalc.Mods)) {
                    x = false;
                }
            });
            return x;
        });
    }
    if (filter.modsExact && !filter.modsInclude) {
        if (['NM', 'NONE', 'NO', 'NOMOD'].some(mod => mod == filter.modsExact.toUpperCase())) {
            newScores = newScores.filter(score => score.mods.length == 0);
        } else {
            newScores = newScores.filter(score => score.mods.join('') == osumodcalc.modHandler(filter.modsExact, score.mode).join(''));
        }
    } else if (filter.modsExclude) {
        newScores = newScores.filter(score => {
            let x: boolean = true;
            score.mods.forEach(mod => {
                if (osumodcalc.modHandler(filter.modsInclude, score.mode).includes(mod as osumodcalc.Mods)) {
                    x = false;
                }
            });
            return x;
        });
    }
    switch (sort) {
        case 'pp':
            newScores.sort((a, b) => b.pp - a.pp);
            break;
        case 'score':
            newScores.sort((a, b) => b.score - a.score);
            break;
        case 'recent':
            newScores.sort((a, b) => (new Date(b.created_at)).getTime() - (new Date(a.created_at)).getTime());
            break;
        case 'acc':
            newScores.sort((a, b) => b.accuracy - a.accuracy);
            break;
        case 'combo':
            newScores.sort((a, b) => b.max_combo - a.max_combo);
            break;
        case 'miss':
            newScores.sort((a, b) => a.statistics.count_miss - b.statistics.count_miss);
            break;
        case 'rank':
            newScores.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank));
            break;
    }
    if (reverse) newScores.reverse();

    return newScores;
}

export function filterScores(
    scores: apitypes.Score[],
    sort: 'pp' | 'score' | 'recent' | 'acc' | 'combo' | 'miss' | 'rank',
    filter: {
        mapper: string,
        title: string,
        artist: string,
        version: string,
        modsInclude: string,
        modsExact: string,
        modsExclude: string,
        rank: string,
        pp: string,
        score: string,
        acc: string,
        combo: string,
        miss: string,
        bpm: string,
    },
    reverse: boolean,
    overrideMap?: apitypes.Beatmap
): indexedScore<apitypes.Score>[] {
    let newScores = [] as indexedScore<apitypes.Score>[];
    for (let i = 0; i < scores.length; i++) {
        const newScore = { ...scores[i], ...{ originalIndex: i } };
        newScores.push(newScore);
    }
    if (filter.mapper) {
        newScores = newScores.filter(score =>
            matchesString(score.beatmapset.user.username, filter.mapper) || matchesString(score.beatmapset.user_id + '', filter.mapper) || matchesString((overrideMap ?? score.beatmap).user_id + '', filter.mapper));
    }
    if (filter.title) {
        newScores = newScores.filter(score =>
            matchesString(score.beatmapset.title, filter.title) || matchesString(score.beatmapset.title_unicode, filter.title));
    }
    if (filter.artist) {
        newScores = newScores.filter(score =>
            matchesString(score.beatmapset.artist, filter.artist) || matchesString(score.beatmapset.artist_unicode, filter.artist));
    }
    if (filter.version) {
        newScores = newScores.filter(score =>
            matchesString((overrideMap ?? score.beatmap).version, filter.version));
    }
    if (filter.pp) {
        const tempArg = argRange(filter.pp, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    score.pp <= tempArg.max :
                    tempArg.min ?
                        score.pp >= tempArg.min :
                        score.pp == tempArg.exact : true);
    }
    if (filter.score) {
        const tempArg = argRange(filter.score, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    score.total_score <= tempArg.max :
                    tempArg.min ?
                        score.total_score >= tempArg.min :
                        score.total_score == tempArg.exact : true);
    }
    if (filter.acc) {
        const tempArg = argRange(filter.acc, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    score.accuracy * 100 <= tempArg.max :
                    tempArg.min ?
                        score.accuracy * 100 >= tempArg.min :
                        score.accuracy * 100 == tempArg.exact : true);
    }
    if (filter.combo) {
        const tempArg = argRange(filter.combo, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    score.max_combo <= tempArg.max :
                    tempArg.min ?
                        score.max_combo >= tempArg.min :
                        score.max_combo == tempArg.exact : true);
    }
    if (filter.miss) {
        const tempArg = argRange(filter.miss, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    (score.statistics.miss ?? 0) <= tempArg.max :
                    tempArg.min ?
                        (score.statistics.miss ?? 0) >= tempArg.min :
                        (score.statistics.miss ?? 0) == tempArg.exact : true);
    }
    if (filter.bpm) {
        const tempArg = argRange(filter.bpm, true);
        newScores = newScores.filter(score =>
            !isNaN(tempArg.max) && !isNaN(tempArg.min) && !isNaN(tempArg.exact) ?
                tempArg.max ?
                    (overrideMap ?? score.beatmap).bpm <= tempArg.max :
                    tempArg.min ?
                        (overrideMap ?? score.beatmap).bpm >= tempArg.min :
                        (overrideMap ?? score.beatmap).bpm == tempArg.exact : true);
    }
    if (filter.modsInclude?.includes('NM')) {
        filter.modsExact = filter.modsInclude.replace('NM', '');
        filter.modsInclude = null;
    }
    if (filter.modsInclude) {
        newScores = newScores.filter(score => {
            let x: boolean = true;
            score.mods.forEach(mod => {
                if (!osumodcalc.modHandler(filter.modsInclude, osumodcalc.ModeIntToName(score.ruleset_id)).includes(mod.acronym as osumodcalc.Mods)) {
                    x = false;
                }
            });
            return x;
        });
    }
    if (filter.modsExact && !filter.modsInclude) {
        if (['NM', 'NONE', 'NO', 'NOMOD'].some(mod => mod == filter.modsExact.toUpperCase())) {
            newScores = newScores.filter(score => score.mods.length == 0);
        } else {
            newScores = newScores.filter(score => score.mods.map(x => x.acronym).join('') == osumodcalc.modHandler(filter.modsExact, osumodcalc.ModeIntToName(score.ruleset_id)).join(''));
        }
    } else if (filter.modsExclude) {
        newScores = newScores.filter(score => {
            let x: boolean = true;
            score.mods.forEach(mod => {
                if (osumodcalc.modHandler(filter.modsInclude, osumodcalc.ModeIntToName(score.ruleset_id)).includes(mod.acronym as osumodcalc.Mods)) {
                    x = false;
                }
            });
            return x;
        });
    }
    switch (sort) {
        case 'pp':
            newScores.sort((a, b) => b.pp - a.pp);
            break;
        case 'score':
            newScores.sort((a, b) => b.total_score - a.total_score);
            break;
        case 'recent':
            newScores.sort((a, b) => (new Date(b.ended_at ?? b.started_at)).getTime() - (new Date(a.ended_at ?? a.started_at)).getTime());
            break;
        case 'acc':
            newScores.sort((a, b) => b.accuracy - a.accuracy);
            break;
        case 'combo':
            newScores.sort((a, b) => b.max_combo - a.max_combo);
            break;
        case 'miss':
            newScores.sort((a, b) => (a.statistics.miss ?? 0) - (b.statistics.miss ?? 0));
            break;
        case 'rank':
            newScores.sort((a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank));
            break;
    }
    if (reverse) newScores.reverse();

    return newScores;
}


export function mapList(
    mapsets: apitypes.Beatmapset[],
    sort: 'combo' | 'title' | 'artist' | 'difficulty' | 'status' | 'failcount' | 'plays' | 'date' | 'favourites' | 'bpm' | 'cs' | 'ar' | 'od' | 'hp' | 'length',
    filter: {
        mapper?: string,
        title?: string,
        artist?: string,
        version?: string,
    },
    reverse: boolean,
    page: number,
): formatterInfo {
    mapsets = filterMaps(mapsets, sort, filter, reverse);

    let maxPage = Math.ceil(mapsets.length / 5);
    if (isNaN(page) || page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    let offset = (page - 1) * 5;

    let text = '';
    for (let i = 0; i < 5 && i < mapsets.length - offset; i++) {
        const mapset = mapsets[i + offset];
        if (!mapset) break;
        const topmap = mapset.beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0];

        let info = `**#${i + 1}・[\`${mapset.artist} - ${mapset.title}\`](https://osu.ppy.sh/s/${mapset.id})**
${helper.vars.emojis.rankedstatus[mapset.status]} | ${helper.vars.emojis.gamemodes[topmap.mode]}
${helper.tools.calculate.secondsToTime(topmap.total_length)} | ${mapset.bpm}${helper.vars.emojis.mapobjs.bpm}
${helper.tools.calculate.separateNum(mapset.play_count)} plays | ${helper.tools.calculate.separateNum(topmap.passcount)} passes | ${helper.tools.calculate.separateNum(mapset.favourite_count)} favourites
Submitted <t:${new Date(mapset.submitted_date).getTime() / 1000}:R> | Last updated <t:${new Date(mapset.last_updated).getTime() / 1000}:R>
${topmap.status == 'ranked' ?
                `Ranked <t:${Math.floor(new Date(mapset.ranked_date).getTime() / 1000)}:R>` : ''
            }${topmap.status == 'approved' || topmap.status == 'qualified' ?
                `Approved/Qualified <t:${Math.floor(new Date(mapset.ranked_date).getTime() / 1000)}:R>` : ''
            }${topmap.status == 'loved' ?
                `Loved <t:${Math.floor(new Date(mapset.ranked_date).getTime() / 1000)}:R>` : ''
            }`;
        info += '\n\n';
        text += info;
    }

    return {
        text,
        curPage: page,
        maxPage
    };
}

export function filterMaps(
    mapsets: apitypes.Beatmapset[],
    sort: 'combo' | 'title' | 'artist' | 'difficulty' | 'status' | 'failcount' | 'plays' | 'date' | 'favourites' | 'bpm' | 'cs' | 'ar' | 'od' | 'hp' | 'length',
    filter: {
        mapper?: string,
        title?: string,
        artist?: string,
        version?: string,
    },
    reverse: boolean,
) {
    if (filter.version) {
        mapsets = mapsets.filter(mapset => {
            let x = false;
            mapset.beatmaps.forEach(beatmap => { x = matchesString(beatmap.version, filter.version); });
            return x;
        });
    }
    if (filter.mapper) {
        mapsets = mapsets.filter(mapset => {
            let x = false;
            mapset.beatmaps.forEach(beatmap => { x = matchesString(beatmap.user_id + '', filter.mapper); });
            return x || matchesString(mapset.user.username, filter.mapper) || matchesString(mapset.user_id + '', filter.mapper);
        });
    }
    if (filter.artist) {
        mapsets = mapsets.filter(mapset => matchesString(mapset.artist, filter.artist) || matchesString(mapset.artist_unicode, filter.artist));
    }
    if (filter.title) {
        mapsets = mapsets.filter(mapset => matchesString(mapset.title, filter.title) || matchesString(mapset.title_unicode, filter.title));
    }
    switch (sort) {
        case 'title':
            mapsets.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'artist':
            mapsets.sort((a, b) => a.artist.localeCompare(b.artist));
            break;
        case 'difficulty':
            mapsets.sort((a, b) =>
                b.beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0].difficulty_rating -
                a.beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0].difficulty_rating
            );
            break;
        case 'plays':
            mapsets.sort((a, b) => b.play_count - a.play_count);
            break;
        case 'date':
            mapsets.sort((a, b) => new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime());
            break;
        case 'favourites':
            mapsets.sort((a, b) => b.favourite_count - a.favourite_count);
            break;
        case 'bpm':
            mapsets.sort((a, b) => b.bpm - a.bpm);
            break;
        case 'cs':
            mapsets.sort((a, b) =>
                b.beatmaps.sort((a, b) => b.cs - a.cs)[0].cs -
                a.beatmaps.sort((a, b) => b.cs - a.cs)[0].cs
            );
            break;
        case 'ar':
            mapsets.sort((a, b) =>
                b.beatmaps.sort((a, b) => b.ar - a.ar)[0].ar -
                a.beatmaps.sort((a, b) => b.ar - a.ar)[0].ar
            );
            break;
        case 'od':
            mapsets.sort((a, b) =>
                b.beatmaps.sort((a, b) => b.accuracy - a.accuracy)[0].accuracy -
                a.beatmaps.sort((a, b) => b.accuracy - a.accuracy)[0].accuracy
            );
            break;
        case 'hp':
            mapsets.sort((a, b) =>
                b.beatmaps.sort((a, b) => b.drain - a.drain)[0].drain -
                a.beatmaps.sort((a, b) => b.drain - a.drain)[0].drain
            );
            break;
        case 'length':
            mapsets.sort((a, b) =>
                b.beatmaps[0].total_length -
                a.beatmaps[0].total_length
            );
            break;
        default:
            break;
    }

    if (reverse == true) {
        mapsets.reverse();
    }
    return mapsets;
}

export function mapPlaysList(
    mapsets: apitypes.BeatmapPlaycount[],
    sort: 'combo' | 'title' | 'artist' | 'difficulty' | 'status' | 'failcount' | 'plays' | 'date' | 'favourites' | 'bpm' | 'cs' | 'ar' | 'od' | 'hp' | 'length',
    filter: {
        mapper?: string,
        title?: string,
        artist?: string,
        version?: string,
    },
    reverse: boolean,
    page: number,
): formatterInfo {
    mapsets = filterMapPlays(mapsets, sort, filter, reverse);

    let maxPage = Math.ceil(mapsets.length / 5);
    if (page > maxPage) page = maxPage;
    if (page < 1) page = 1;
    let offset = (page - 1) * 5;

    let text = '';
    for (let i = 0; i < 5 && i < mapsets.length - offset; i++) {
        const map = mapsets[i + offset];
        if (!map) break;
        map.beatmapset;
        let info = `**#${i + 1}・[\`${map.beatmapset.artist} - ${map.beatmapset.title} [${map.beatmap.version}]\`](https://osu.ppy.sh/b/${map.beatmap.id})**
**${helper.tools.calculate.separateNum(map.count)}x plays**
${helper.vars.emojis.rankedstatus[map.beatmapset.status]} | ${helper.vars.emojis.gamemodes[map.beatmap.mode]}
${helper.tools.calculate.secondsToTime(map.beatmap.total_length)} | ${helper.tools.calculate.separateNum(map.beatmapset.favourite_count)} favourites`;
        info += '\n\n';
        text += info;
    }

    return {
        text,
        curPage: page,
        maxPage
    };
}

export function filterMapPlays(
    mapsets: apitypes.BeatmapPlaycount[],
    sort: 'combo' | 'title' | 'artist' | 'difficulty' | 'status' | 'failcount' | 'plays' | 'date' | 'favourites' | 'bpm' | 'cs' | 'ar' | 'od' | 'hp' | 'length',
    filter: {
        mapper?: string,
        title?: string,
        artist?: string,
        version?: string,
    },
    reverse: boolean,
) {
    if (filter.version) {
        mapsets = mapsets.filter(mapset => matchesString(mapset.beatmap.version, filter.version)
        );
    }
    if (filter.mapper) {
        mapsets = mapsets.filter(mapset =>
            matchesString(mapset.beatmap.user_id + '', filter.mapper) || matchesString(mapset.beatmapset.user.username, filter.mapper) || matchesString(mapset.beatmapset.user_id + '', filter.mapper)
        );
    }
    if (filter.artist) {
        mapsets = mapsets.filter(mapset => matchesString(mapset.beatmapset.artist, filter.artist) || matchesString(mapset.beatmapset.artist_unicode, filter.artist));
    }
    if (filter.title) {
        mapsets = mapsets.filter(mapset => matchesString(mapset.beatmapset.title, filter.title) || matchesString(mapset.beatmapset.title_unicode, filter.title));
    }
    switch (sort) {
        case 'title':
            mapsets.sort((a, b) => a.beatmapset.title.localeCompare(b.beatmapset.title));
            break;
        case 'artist':
            mapsets.sort((a, b) => a.beatmapset.artist.localeCompare(b.beatmapset.artist));
            break;
        case 'difficulty':
            mapsets.sort((a, b) =>
                b.beatmap.difficulty_rating -
                a.beatmap.difficulty_rating
            );
            break;
        case 'plays':
            mapsets.sort((a, b) => b.count - a.count);
            break;
        // case 'date':
        //     mapsets.sort((a, b) => new Date(b.beatmapset.submitted_date).getTime() - new Date(a.beatmapset.submitted_date).getTime());
        //     break;
        case 'favourites':
            mapsets.sort((a, b) => b.beatmapset.favourite_count - a.beatmapset.favourite_count);
            break;
        // case 'bpm':
        //     mapsets.sort((a, b) => b.beatmap.bpm - a.beatmap.bpm);
        //     break;
        // case 'cs':
        //     mapsets.sort((a, b) =>
        //         b.beatmap.cs -
        //         a.beatmap.cs
        //     );
        //     break;
        // case 'ar':
        //     mapsets.sort((a, b) =>
        //         b.beatmap.ar -
        //         a.beatmap.ar
        //     );
        //     break;
        // case 'od':
        //     mapsets.sort((a, b) =>
        //         b.beatmap.accuracy -
        //         a.beatmap.accuracy
        //     );
        //     break;
        // case 'hp':
        //     mapsets.sort((a, b) =>
        //         b.beatmap.drain -
        //         a.beatmap.drain
        //     );
        //     break;
        case 'length':
            mapsets.sort((a, b) =>
                b.beatmap.total_length -
                a.beatmap.total_length
            );
            break;
        default:
            break;
    }

    if (reverse == true) {
        mapsets.reverse();
    }
    return mapsets;
}

export function userList(
    users: apitypes.User[],
    sort: 'pp' | 'score' | 'acc',
    filter: {
        country: string;
    },
    reverse: boolean,
): formatterInfo {
    return {
        text: 'string',
        curPage: 1,
        maxPage: 1,
    };
}


export function matchesString(first: string, second: string) {
    first = first.toLowerCase();
    second = second.toLowerCase();
    return first == second ||
        first.includes(second) ||
        second.includes(first);
}

export function argRange(arg: string, forceAboveZero: boolean) {
    let max = NaN;
    let min = NaN;
    let exact = NaN;
    if (arg.includes('>')) {
        min = +arg.replace('>', '');
    }
    if (arg.includes('<')) {
        max = +arg.replace('<', '');
    }
    if (arg.includes('..')) {
        const arr = arg.split('..');
        const narr = arr.map(x => +x).filter(x => !isNaN(x)).sort((a, b) => +b - +a);
        if (narr.length = 2) {
            max = narr[0];
            min = narr[1];
        }
    }
    if (isNaN(max) && isNaN(min)) {
        exact = +exact;
    }
    if (forceAboveZero) {
        return {
            max: max && max >= 0 ? max : Math.abs(max),
            min: min && min >= 0 ? min : Math.abs(min),
            exact: exact && exact >= 0 ? exact : Math.abs(exact),
        };
    }
    return {
        max,
        min,
        exact,
    };
}

export function hitList(
    mode: apitypes.GameMode,
    obj: apitypes.Statistics
) {
    let hitList: string;
    switch (mode) {
        case 'osu':
        default:
            hitList = `${helper.tools.calculate.separateNum(obj.count_300)}/${helper.tools.calculate.separateNum(obj.count_100)}/${helper.tools.calculate.separateNum(obj.count_50)}/${helper.tools.calculate.separateNum(obj.count_miss)}`;
            break;
        case 'taiko':
            hitList = `${helper.tools.calculate.separateNum(obj.count_300)}/${helper.tools.calculate.separateNum(obj.count_100)}/${helper.tools.calculate.separateNum(obj.count_miss)}`;
            break;
        case 'fruits':
            hitList = `${helper.tools.calculate.separateNum(obj.count_300)}/${helper.tools.calculate.separateNum(obj.count_100)}/${helper.tools.calculate.separateNum(obj.count_50)}/${helper.tools.calculate.separateNum(obj.count_miss)}`;
            break;
        case 'mania':
            hitList = `${helper.tools.calculate.separateNum(obj.count_geki)}/${helper.tools.calculate.separateNum(obj.count_300)}/${helper.tools.calculate.separateNum(obj.count_katu)}/${helper.tools.calculate.separateNum(obj.count_100)}/${helper.tools.calculate.separateNum(obj.count_50)}/${helper.tools.calculate.separateNum(obj.count_miss)}`;
            break;
    }
    return hitList;
}

export function gradeToEmoji(str: string) {
    return helper.vars.emojis.grades[str];
}


export function userAuthor(osudata: apitypes.User, embed: Discord.EmbedBuilder) {
    embed.setAuthor({
        name: `${osudata.username} | #${helper.tools.calculate.separateNum(osudata?.statistics?.global_rank)} | #${helper.tools.calculate.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${helper.tools.calculate.separateNum(osudata?.statistics?.pp)}pp`,
        url: `https://osu.ppy.sh/users/${osudata.id}`,
        iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
    });
    return embed;

}

/**
 * 
 * @param str the string to convert
 * @returns string with the first letter capitalised
 */
export function toCapital(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function dateToDiscordFormat(date: Date, type?: 'R' | 'F') {
    return `<t:${Math.floor(date.getTime() / 1000)}:${type ?? 'R'}>`;
}

/**
 * parses a string that has a unicode and "romanised" version
 * @style 1 artist title (artist title). uses style 2 if only title or artist is different
 * @style 2 artist (artist) title (title)
 */
export function parseUnicodeStrings(
    input: {
        title: string,
        artist: string,
        title_unicode: string,
        artist_unicode: string,
        ignore: {
            artist: boolean,
            title: boolean,
        };
    },
    style?: 1 | 2
) {
    let fullTitle: string;
    switch (style) {
        case 1: default: {

            if (
                (input.title != input.title_unicode && input.artist == input.artist_unicode)
                ||
                (input.title == input.title_unicode && input.artist != input.artist_unicode)
                ||
                (input.title == input.title_unicode && input.artist == input.artist_unicode)
                ||
                (input.ignore.artist == true || input.ignore.title == true)
            ) {
                return parseUnicodeStrings(input, 2);
            } else {
                fullTitle =
                    `${input.artist} - ${input.title}
${input.artist_unicode} - ${input.title_unicode}`;
            }
        }
            break;
        case 2: {
            const title = input.title == input.title_unicode ? input.title : `${input.title_unicode} (${input.title})`;
            const artist = input.artist == input.artist_unicode ? input.artist : `${input.artist_unicode} (${input.artist})`;
            if (input.ignore.artist) {
                fullTitle = `${title}`;
            } else if (input.ignore.title) {
                fullTitle = `${artist}`;
            } else {
                fullTitle = `${artist} - ${title}`;
            }
        }
            break;
    }

    return fullTitle;
}

/**
 * get colour based on difficulty/sr
 */
export function difficultyColour(difficulty: number) {
    switch (true) {
        case difficulty >= 8:
            return helper.vars.colours.diffcolour[7];
        case difficulty >= 7:
            return helper.vars.colours.diffcolour[6];
        case difficulty >= 6:
            return helper.vars.colours.diffcolour[5];
        case difficulty >= 4.5:
            return helper.vars.colours.diffcolour[4];
        case difficulty >= 3.25:
            return helper.vars.colours.diffcolour[3];
        case difficulty >= 2.5:
            return helper.vars.colours.diffcolour[2];
        case difficulty >= 2:
            return helper.vars.colours.diffcolour[1];
        case difficulty >= 1.5: default:
            return helper.vars.colours.diffcolour[0];
    }
}

export function returnHits(hits: apitypes.Statistics, mode: apitypes.GameMode) {
    const object: {
        short: string,
        long: string,
        ex: { name: string, value: string | number; }[];
    } = {
        short: '',
        long: '',
        ex: []
    };
    switch (mode) {
        case 'osu':
            object.short = `${hits.count_300}/${hits.count_100}/${hits.count_50}/${hits.count_miss}`;
            object.long = `**300:** ${hits.count_300} \n **100:** ${hits.count_100} \n **50:** ${hits.count_50} \n **Miss:** ${hits.count_miss}`;
            object.ex = [
                {
                    name: '300',
                    value: hits.count_300
                },
                {
                    name: '100',
                    value: hits.count_100
                },
                {
                    name: '50',
                    value: hits.count_50
                },
                {
                    name: 'Miss',
                    value: hits.count_miss
                }
            ];
            break;
        case 'taiko':
            object.short = `${hits.count_300}/${hits.count_100}/${hits.count_miss}`;
            object.long = `**Great:** ${hits.count_300} \n **Good:** ${hits.count_100} \n **Miss:** ${hits.count_miss}`;
            object.ex = [
                {
                    name: 'Great',
                    value: hits.count_300
                },
                {
                    name: 'Good',
                    value: hits.count_100
                },
                {
                    name: 'Miss',
                    value: hits.count_miss
                }
            ];
            break;
        case 'fruits':
            object.short = `${hits.count_300}/${hits.count_100}/${hits.count_50}/${hits.count_miss}/${hits.count_katu}`;
            object.long = `**Fruits:** ${hits.count_300} \n **Drops:** ${hits.count_100} \n **Droplets:** ${hits.count_50} \n **Miss:** ${hits.count_miss} \n **Miss(droplets):** ${hits.count_katu}`;
            object.ex = [
                {
                    name: 'Fruits',
                    value: hits.count_300
                },
                {
                    name: 'Drops',
                    value: hits.count_100
                },
                {
                    name: 'Droplets',
                    value: hits.count_50
                },
                {
                    name: 'Miss',
                    value: hits.count_miss
                },
                {
                    name: 'Miss(droplets)',
                    value: hits.count_katu
                },
            ];
            break;
        case 'mania':
            object.short = `${hits.count_geki}/${hits.count_300}/${hits.count_katu}/${hits.count_100}/${hits.count_50}/${hits.count_miss}`;
            object.long = `**300+:** ${hits.count_geki} \n **300:** ${hits.count_300} \n **200:** ${hits.count_katu} \n **100:** ${hits.count_100} \n **50:** ${hits.count_50} \n **Miss:** ${hits.count_miss}`;
            object.ex = [
                {
                    name: '300+',
                    value: hits.count_geki
                },
                {
                    name: '300',
                    value: hits.count_300
                },
                {
                    name: '200',
                    value: hits.count_katu
                },
                {
                    name: '100',
                    value: hits.count_100
                },
                {
                    name: '50',
                    value: hits.count_50
                },
                {
                    name: 'Miss',
                    value: hits.count_miss
                }
            ];
            break;
    }
    return object;
}

export function removeURLparams(url: string) {
    if (url.includes('?')) {
        return url.split('?')[0];
    }
    return url;
}

/**
 * converts a lazer score to legacy score (for compatibility reasons)
 */
export function CurrentToLegacyScore(score: apitypes.Score): apitypes.ScoreLegacy {
    return {
        accuracy: score.accuracy,
        beatmap: score.beatmap,
        beatmapset: score.beatmapset,
        best_id: score.best_id,
        created_at: score.ended_at ?? score.started_at,
        id: score.legacy_score_id,
        match: null,
        max_combo: score.max_combo,
        mode_int: score.ruleset_id,
        mode: osumodcalc.ModeIntToName(score.ruleset_id),
        mods: score.mods.map(x => x.acronym),
        passed: score.passed,
        perfect: score.is_perfect_combo,
        pp: score.pp,
        preserve: score.preserve,
        processed: score.processed,
        rank_country: score.rank_country,
        rank_global: score.rank_global,
        rank: score.rank,
        replay: score.has_replay,
        room_id: score.room_id,
        ruleset_id: score.ruleset_id,
        score: score.legacy_total_score,
        scores_around: score.scores_around,
        statistics: {
            count_100: score.statistics?.ok ?? 0,
            count_300: score.statistics.great,
            count_50: score.statistics?.meh ?? 0,
            count_geki: 0,
            count_katu: 0,
            count_miss: score.statistics?.miss ?? 0,
        },
        type: score.type,
        user_id: score.user_id,
        current_user_attributes: score.current_user_attributes,
        user: score.user,
        weight: score.weight
    };
}