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
        isnochoke: boolean,
    },
    reverse: boolean,
    detail: number,
    page: number,
    showOriginalIndex: boolean,
    preset?: 'map_leaderboard' | 'single_map',
    overrideMap?: apitypes.Beatmap
): Promise<formatterInfo> {
    const newScores = await filterScores(scores as apitypes.Score[], sort, filter, reverse, overrideMap);
    if (newScores.length == 0) {
        return {
            text: 'No scores were found (check the filter options)',
            curPage: 0,
            maxPage: 0,
        };
    }
    let max = 5;
    if (detail == 2) max = 10;
    const maxPage = Math.ceil(newScores.length / max);
    if (isNaN(page) || page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    const offset = (page - 1) * max;
    let text = '';

    for (let i = 0; i < max && i < newScores.length - offset; i++) {
        let score = newScores[i + offset];
        if (!score) break;
        // let convertedScore = CurrentToLegacyScore(score as apitypes.Score);
        const overrides = helper.tools.calculate.modOverrides(score.mods);
        const perfs = await helper.tools.performance.fullPerformance(
            overrideMap?.id ?? score.beatmap_id,
            score.ruleset_id,
            score.mods.map(x => x.acronym).join(''),
            score.accuracy,
            overrides.speed,
            score.statistics,
            score.max_combo,
            null,
            new Date((overrideMap ?? score.beatmap).last_updated),
            overrides.ar,
            overrides.hp,
            overrides.cs,
            overrides.od,
        );
        let info = `**#${(showOriginalIndex ? score.originalIndex : i) + 1}`;
        let modadjustments = '';
        if (score.mods.filter(x => x?.settings?.speed_change).length > 0) {
            modadjustments += ' (' + score.mods.filter(x => x?.settings?.speed_change)[0].settings.speed_change + 'x)';
        }
        switch (preset) {
            case 'map_leaderboard':
                info += `・[${score.user.username}](https://osu.ppy.sh/${score.id ? `scores/${score.id}` : `u/${score.user_id}`})`;
                break;
            case 'single_map': {
                let t = osumodcalc.OrderMods(score.mods.map(x => x.acronym).join('')).string + modadjustments;
                if(t==''){
                    t = 'NM'
                }
                info += `・[${t}](https://osu.ppy.sh/scores/${score.id})`;
            } break;
            default:
                info += `・[${score.beatmapset.title} [${(overrideMap ?? score.beatmap).version}]](https://osu.ppy.sh/${score.id ? `scores/${score.id}` : `b/${(overrideMap ?? score.beatmap).id}`})`;
                break;
        }
        let combo = `${score?.max_combo}/**${perfs[1].difficulty.maxCombo}x**`;
        if (score.max_combo == perfs[1].difficulty.maxCombo || !score.max_combo) combo = `**${score.max_combo}x**`;
        const tempScore = score as indexedScore<apitypes.Score>;

        info +=
            `** ${dateToDiscordFormat(new Date(tempScore.ended_at))}
${score.passed ? helper.vars.emojis.grades[score.rank] : helper.vars.emojis.grades.F + `(${helper.vars.emojis.grades[score.rank]} if pass)`} | \`${helper.tools.calculate.numberShorthand(helper.tools.other.getTotalScore(score))}\` | ${tempScore.mods.length > 0 && preset != 'single_map' ? ' **' + osumodcalc.OrderMods(tempScore.mods.map(x => x.acronym).join('')).string + modadjustments + '**' : ''} `;
        if (filter.isnochoke && score.statistics.miss > 0) {
            let rm = score.statistics.miss;
            score.statistics.miss = 0;
            let na = osumodcalc.calcgrade(score.statistics.great, score.statistics.ok ?? 0, score.statistics.meh ?? 0, 0).accuracy;
            info +=
                `| **Removed ${rm}❌**\n\`${returnHits(score.statistics, score.ruleset_id).short}\` | ${combo} | ${(score.accuracy * 100).toFixed(2)}% ->  **${na.toFixed(2)}%**`;
        } else {
            info +=
                `\n\`${returnHits(score.statistics, score.ruleset_id).short}\` | **${perfs[1].difficulty.maxCombo}x** | ${(score.accuracy * 100).toFixed(2)}% `;
        }
        info += `\n${(score?.pp ?? perfs[0].pp).toFixed(2)}pp`;

        if (!score?.is_perfect_combo) {
            info += ' (' + perfs[1].pp.toFixed(2) + 'pp if FC)';
        } else if (score?.accuracy < 1) {
            info += ' (' + perfs[2].pp.toFixed(2) + 'pp if SS)';
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

export async function filterScores(
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
        isnochoke: boolean,
    },
    reverse: boolean,
    overrideMap?: apitypes.Beatmap
): Promise<indexedScore<apitypes.Score>[]> {
    let newScores = [] as indexedScore<apitypes.Score>[];
    for (let i = 0; i < scores.length; i++) {
        const newScore = { ...scores[i], ...{ originalIndex: i } };
        newScores.push(newScore);
    }
    if (filter?.mapper) {
        newScores = newScores.filter(score =>
            matchesString(score.beatmapset.user.username, filter.mapper) || matchesString(score.beatmapset.user_id + '', filter.mapper) || matchesString((overrideMap ?? score.beatmap).user_id + '', filter.mapper));
    }
    if (filter?.title) {
        newScores = newScores.filter(score =>
            matchesString(score.beatmapset.title, filter.title) || matchesString(score.beatmapset.title_unicode, filter.title));
    }
    if (filter?.artist) {
        newScores = newScores.filter(score =>
            matchesString(score.beatmapset.artist, filter.artist) || matchesString(score.beatmapset.artist_unicode, filter.artist));
    }
    if (filter?.version) {
        newScores = newScores.filter(score =>
            matchesString((overrideMap ?? score.beatmap).version, filter.version));
    }
    if (filter?.pp) {
        const tempArg = argRange(filter.pp, true);
        newScores = newScores.filter(score => filterArgRange(score.pp, tempArg));
    }
    if (filter?.score) {
        const tempArg = argRange(filter.score, true);
        newScores = newScores.filter(score => filterArgRange(score.total_score, tempArg));
    }
    if (filter?.acc) {
        const tempArg = argRange(filter.acc, true);
        newScores = newScores.filter(score => filterArgRange(score.accuracy, tempArg));
    }
    if (filter?.combo) {
        const tempArg = argRange(filter.combo, true);
        newScores = newScores.filter(score => filterArgRange(score.max_combo, tempArg));
    }
    if (filter?.miss) {
        const tempArg = argRange(filter.miss, true);
        newScores = newScores.filter(score => filterArgRange(score?.statistics?.miss ?? 0, tempArg));
    }
    if (filter?.bpm) {
        const tempArg = argRange(filter.bpm, true);
        newScores = newScores.filter(score => filterArgRange((overrideMap ?? score.beatmap).id, tempArg));
    }
    if (filter?.modsInclude?.includes('NM')) {
        filter.modsExact = filter.modsInclude.replace('NM', '');
        filter.modsInclude = null;
    }
    if (filter?.modsInclude) {
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
    if (filter?.modsExact && !filter.modsInclude) {
        if (['NM', 'NONE', 'NO', 'NOMOD'].some(mod => mod == filter.modsExact.toUpperCase())) {
            newScores = newScores.filter(score => score.mods.length == 0 || score.mods.map(x => x.acronym).join('') == 'CL' || score.mods.map(x => x.acronym).join('') == 'LZ');
        } else {
            newScores = newScores.filter(score => score.mods.map(x => x.acronym).join('') == osumodcalc.modHandler(filter.modsExact, osumodcalc.ModeIntToName(score.ruleset_id)).join(''));
        }
    } else if (filter?.modsExclude) {
        const xlModsArr = osumodcalc.modHandler(filter.modsExclude, osumodcalc.ModeIntToName(newScores?.[0]?.ruleset_id ?? 0));
        if (filter.modsExclude.includes('DT') && filter.modsExclude.includes('NC')) {
            xlModsArr.push('DT');
        }
        if (filter.modsExclude.includes('HT') && filter.modsExclude.includes('DC')) {
            xlModsArr.push('DC');
        }
        newScores = newScores.filter(score => {
            let x: boolean = true;
            score.mods.forEach(mod => {
                if (xlModsArr.includes(mod.acronym as osumodcalc.Mods)) {
                    x = false;
                }
            });
            return x;
        });
    }
    switch (sort) {
        case 'pp': {
            const sc = [];
            for (const score of newScores) {

                if (!score.pp || isNaN(score.pp)) {
                    let perf;
                    if (filter.isnochoke) {
                        let tempmss = score.statistics.miss;
                        let usestats = score.statistics;
                        usestats.miss = 0;
                        let useacc = osumodcalc.calcgrade(usestats.great, usestats.ok, usestats.meh, 0).accuracy;
                        perf = await helper.tools.performance.calcFullCombo({
                            mapid: overrideMap?.id ?? score.beatmap_id,
                            mode: score.ruleset_id,
                            mods: score.mods.map(x => x.acronym).join(''),
                            accuracy: useacc,
                            clockRate: helper.tools.performance.getModSpeed(score.mods),
                            stats: score.statistics,
                            mapLastUpdated: new Date(score.ended_at),
                        });
                        usestats.miss = tempmss;
                    }
                    else {
                        perf = await helper.tools.performance.calcScore({
                            mapid: overrideMap?.id ?? score.beatmap_id,
                            mode: score.ruleset_id,
                            mods: score.mods.map(x => x.acronym).join(''),
                            accuracy: score.accuracy,
                            clockRate: helper.tools.performance.getModSpeed(score.mods),
                            stats: score.statistics,
                            maxcombo: score.max_combo,
                            passedObjects: helper.tools.other.scoreTotalHits(score.statistics),
                            mapLastUpdated: new Date(score.ended_at),
                        });
                    }
                    score.pp = perf.pp;
                }
                sc.push(score);
            }
            newScores = sc;
            newScores.sort((a, b) => b.pp - a.pp);
        }
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

    const maxPage = Math.ceil(mapsets.length / 5);
    if (isNaN(page) || page < 1) page = 1;
    if (page > maxPage) page = maxPage;
    const offset = (page - 1) * 5;

    let text = '';
    for (let i = 0; i < 5 && i < mapsets.length - offset; i++) {
        const mapset = mapsets[i + offset];
        if (!mapset) break;
        const topmap = mapset.beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0];

        let info = `**#${i + offset + 1}・[\`${mapset.artist} - ${mapset.title}\`](https://osu.ppy.sh/s/${mapset.id})**
${helper.vars.emojis.rankedstatus[mapset.status]} | ${helper.vars.emojis.gamemodes[topmap.mode]} | ${helper.tools.calculate.secondsToTime(topmap.total_length)} | ${mapset.bpm}${helper.vars.emojis.mapobjs.bpm}
${helper.tools.calculate.separateNum(mapset.play_count)} plays | ${helper.tools.calculate.separateNum(topmap.passcount)} passes | ${helper.tools.calculate.separateNum(mapset.favourite_count)} favourites
Submitted <t:${new Date(mapset.submitted_date).getTime() / 1000}:R> | ${topmap.status == 'ranked' ?
                `Ranked <t:${Math.floor(new Date(mapset.ranked_date).getTime() / 1000)}:R>` :
                topmap.status == 'approved' || topmap.status == 'qualified' ?
                    `Approved/Qualified <t:${Math.floor(new Date(mapset.ranked_date).getTime() / 1000)}:R>` :
                    topmap.status == 'loved' ?
                        `Loved <t:${Math.floor(new Date(mapset.ranked_date).getTime() / 1000)}:R>` :
                        `Last updated <t:${new Date(mapset.last_updated).getTime() / 1000}:R>`
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
    if (filter?.version) {
        mapsets = mapsets.filter(mapset => {
            let x = false;
            mapset.beatmaps.forEach(beatmap => { x = matchesString(beatmap.version, filter.version); });
            return x;
        });
    }
    if (filter?.mapper) {
        mapsets = mapsets.filter(mapset => {
            let x = false;
            mapset.beatmaps.forEach(beatmap => { x = matchesString(beatmap.user_id + '', filter.mapper); });
            return x || matchesString(mapset.user.username, filter.mapper) || matchesString(mapset.user_id + '', filter.mapper);
        });
    }
    if (filter?.artist) {
        mapsets = mapsets.filter(mapset => matchesString(mapset.artist, filter.artist) || matchesString(mapset.artist_unicode, filter.artist));
    }
    if (filter?.title) {
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

    const maxPage = Math.ceil(mapsets.length / 5);
    if (page > maxPage) page = maxPage;
    if (page < 1) page = 1;
    const offset = (page - 1) * 5;

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
    if (filter?.version) {
        mapsets = mapsets.filter(mapset => matchesString(mapset.beatmap.version, filter.version)
        );
    }
    if (filter?.mapper) {
        mapsets = mapsets.filter(mapset =>
            matchesString(mapset.beatmap.user_id + '', filter.mapper) || matchesString(mapset.beatmapset.user.username, filter.mapper) || matchesString(mapset.beatmapset.user_id + '', filter.mapper)
        );
    }
    if (filter?.artist) {
        mapsets = mapsets.filter(mapset => matchesString(mapset.beatmapset.artist, filter.artist) || matchesString(mapset.beatmapset.artist_unicode, filter.artist));
    }
    if (filter?.title) {
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
    let ignore = false;
    if (arg.includes('>')) {
        min = +(arg.replace('>', ''));
    }
    if (arg.includes('<')) {
        max = +(arg.replace('<', ''));
    }
    if (arg.includes('..')) {
        const arr = arg.split('..');
        const narr = arr.map(x => +x).filter(x => !isNaN(x)).sort((a, b) => +b - +a);
        if (narr.length == 2) {
            max = narr[0];
            min = narr[1];
        }
    }
    if (arg.includes('!')) {
        exact = +(arg.replace('!', ''));
        ignore = true;
    }
    if (isNaN(max) && isNaN(min) && !exact) {
        exact = +arg;
    }
    if (forceAboveZero) {
        return {
            max: max && max >= 0 ? max : Math.abs(max),
            min: min && min >= 0 ? min : Math.abs(min),
            exact: exact && exact >= 0 ? exact : Math.abs(exact),
            ignore
        };
    }
    return {
        max,
        min,
        exact,
        ignore,
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


export function userAuthor(osudata: apitypes.User, embed: Discord.EmbedBuilder, replaceName?: string) {
    let name = replaceName ?? osudata.username;
    if (osudata?.statistics?.global_rank) {
        name += ` | #${helper.tools.calculate.separateNum(osudata?.statistics?.global_rank)}`;
    }
    if (osudata?.statistics?.country_rank) {
        name += ` | #${helper.tools.calculate.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code}`;
    }
    if (osudata?.statistics?.pp) {
        name += ` | ${helper.tools.calculate.separateNum(osudata?.statistics?.pp)}pp`;
    }
    embed.setAuthor({
        name,
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

export function nonNullStats(hits: apitypes.ScoreStatistics): apitypes.ScoreStatistics {
    return {
        perfect: hits?.perfect ?? 0,
        great: hits?.great ?? 0,
        good: hits?.good ?? 0,
        ok: hits?.ok ?? 0,
        meh: hits?.meh ?? 0,
        miss: hits?.miss ?? 0,
        small_tick_hit: hits?.small_tick_hit ?? 0,
        small_tick_miss: hits?.small_tick_miss ?? 0,
        legacy_combo_increase: hits?.legacy_combo_increase ?? 0,
    };
}

export function returnHits(hits: apitypes.ScoreStatistics, mode: apitypes.Ruleset) {
    const object: {
        short: string,
        long: string,
        ex: { name: string, value: string | number; }[];
    } = {
        short: '',
        long: '',
        ex: []
    };
    hits = nonNullStats(hits);
    switch (mode) {
        case apitypes.RulesetEnum.osu:
            object.short = `${hits.great}/${hits.ok}/${hits.meh}/${hits.miss}`;
            object.long = `**300:** ${hits.great} \n **100:** ${hits.ok} \n **50:** ${hits.meh} \n **Miss:** ${hits.miss}`;
            object.ex = [
                {
                    name: '300',
                    value: hits.great
                },
                {
                    name: '100',
                    value: hits.ok
                },
                {
                    name: '50',
                    value: hits.meh
                },
                {
                    name: 'Miss',
                    value: hits.miss
                }
            ];
            break;
        case apitypes.RulesetEnum.taiko:
            object.short = `${hits.great}/${hits.good}/${hits.miss}`;
            object.long = `**Great:** ${hits.great} \n **Good:** ${hits.good} \n **Miss:** ${hits.miss}`;
            object.ex = [
                {
                    name: 'Great',
                    value: hits.great
                },
                {
                    name: 'Good',
                    value: hits.good
                },
                {
                    name: 'Miss',
                    value: hits.miss
                }
            ];
            break;
        case apitypes.RulesetEnum.fruits:
            object.short = `${hits.great}/${hits.ok}/${hits.small_tick_hit}/${hits.miss}/${hits.small_tick_miss}`;
            object.long = `**Fruits:** ${hits.great} \n **Drops:** ${hits.ok} \n **Droplets:** ${hits.small_tick_hit} \n **Miss:** ${hits.miss} \n **Miss(droplets):** ${hits.small_tick_miss}`;
            object.ex = [
                {
                    name: 'Fruits',
                    value: hits.great
                },
                {
                    name: 'Drops',
                    value: hits.ok
                },
                {
                    name: 'Droplets',
                    value: hits.small_tick_hit
                },
                {
                    name: 'Miss',
                    value: hits.miss
                },
                {
                    name: 'Miss(droplets)',
                    value: hits.small_tick_miss
                },
            ];
            break;
        case apitypes.RulesetEnum.mania:
            object.short = `${hits.perfect}/${hits.great}/${hits.good}/${hits.ok}/${hits.meh}/${hits.miss}`;
            object.long = `**300+:** ${hits.perfect} \n **300:** ${hits.great} \n **200:** ${hits.good} \n **100:** ${hits.ok} \n **50:** ${hits.meh} \n **Miss:** ${hits.miss}`;
            object.ex = [
                {
                    name: '300+',
                    value: hits.perfect
                },
                {
                    name: '300',
                    value: hits.great
                },
                {
                    name: '200',
                    value: hits.good
                },
                {
                    name: '100',
                    value: hits.ok
                },
                {
                    name: '50',
                    value: hits.meh
                },
                {
                    name: 'Miss',
                    value: hits.miss
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

export function sortDescription(type: "pp" | "score" | "recent" | "acc" | "combo" | "miss" | "rank", reverse: boolean) {
    let x: string;
    switch (type) {
        case 'pp':
            x = 'highest performance';
            break;
        case 'score':
            x = 'highest score';
            break;
        case 'recent':
            x = 'most recent';
            break;
        case 'acc':
            x = 'highest accuracy';
            break;
        case 'combo':
            x = 'highest combo';
            break;
        case 'miss':
            x = 'lowest miss count';
            break;
        case 'rank':
            x = 'best rank';
            break;
    }
    if (reverse) {
        switch (type) {
            case 'pp':
                x = 'lowest performance';
                break;
            case 'score':
                x = 'lowest score';
                break;
            case 'recent':
                x = 'oldest';
                break;
            case 'acc':
                x = 'lowest accuracy';
                break;
            case 'combo':
                x = 'lowest combo';
                break;
            case 'miss':
                x = 'highest miss count';
                break;
            case 'rank':
                x = 'best rank';
                break;
        }
    }
    return x;
}


const filterArgRange = (value: number, args: {
    max: number;
    min: number;
    exact: number;
    ignore: boolean;
}) => {
    let keep: boolean = true;
    if (args.max) {
        keep = keep && value <= Math.round(args.max);
    }
    if (args.min) {
        keep = keep && value >= Math.round(args.min);
    }
    if (args.exact) {
        keep = Math.round(value) == Math.round(args.exact);
    }
    if (args.exact && args.ignore) {
        keep = Math.round(value) != Math.round(args.exact);
    }
    return keep;
};