import Discord from 'discord.js';
import fs from 'fs';
import * as calc from './calc.js';
import * as cmdchecks from './checks.js';
import * as emojis from './consts/emojis.js';
import * as func from './func.js';
import * as osufunc from './osufunc.js';
import * as osumodcalc from './osumodcalc.js';
import * as extypes from './types/extratypes.js';
import * as osuapitypes from './types/osuApiTypes.js';

export async function scoreList(
    asObj: {
        scores: osuapitypes.Score[],
        detailed: number,
        showWeights: boolean,
        page: number,
        showMapTitle: boolean,
        showTruePosition: boolean,
        sort: scoreSort,
        truePosType: scoreSort,
        filteredMapper: string,
        filteredMods: string,
        exactMods: string,
        excludeMods: string,
        filterMapTitle: string,
        filterRank: osuapitypes.Rank,
        reverse: boolean,
        mapidOverride?: number,
        showUserName?: boolean,
        pp?: string,
        score?: string,
        acc?: string,
        combo?: string,
        miss?: string,
        bpm?: string,
    },
    mapping: {
        useScoreMap: boolean,
        overrideMapLastDate?: string;
    },
    config: extypes.config
) {
    let filtereddata: extypes.SortedScore[] = [];
    let filterinfo = '';
    //convert scores into "sorted scores" in order to preserve their index number
    for (let i = 0; i < asObj.scores.length; i++) {
        filtereddata.push({
            index: i + 1,
            score: asObj.scores[i]
        });
    }

    if (asObj.filteredMapper != null) {
        filtereddata = filtereddata.filter(array => array.score.beatmapset.creator.toLowerCase() == asObj.filteredMapper.toLowerCase());
        filterinfo += `\nmapper: ${asObj.filteredMapper}`;
    }
    if (asObj.exactMods?.toUpperCase() == 'NM') {
        filtereddata = filtereddata.filter(array => array.score.mods.length == 0);
        filterinfo += `\nexact mods: NM`;
    }
    const modOrder = osumodcalc.OrderMods(asObj.filteredMods + '');
    let calcmods = modOrder.string;
    const modOrderX = osumodcalc.OrderMods(asObj.exactMods + '');
    let calcmodsx = modOrderX.string;
    const modOrderEx = osumodcalc.OrderMods(asObj.excludeMods + '');
    let calcmodsex = modOrderEx.string;
    if (calcmods.length < 1) {
        calcmods = 'NM';
        asObj.filteredMods = null;
    }
    if (calcmodsx.length < 1) {
        calcmodsx = 'NM';
        asObj.exactMods = null;
    }
    if (calcmodsex.length < 1) {
        calcmodsex = 'NM';
        asObj.excludeMods = null;
    }
    if (asObj.exactMods != null) {
        filtereddata = filtereddata.filter(array => array.score.mods.join('').toUpperCase() == calcmodsx.toUpperCase());
        filterinfo += `\nexact mods: ${calcmodsx}`;
    }
    if (asObj.filteredMods != null) {
        filtereddata = filtereddata.filter(array => array.score.mods.some(x => modOrder.array.includes(x)));
        filterinfo += `\ninclude mods: ${calcmods}`;
    }
    if (asObj.excludeMods != null) {
        filtereddata = filtereddata.filter(array => !array.score.mods.some(x => modOrderEx.array.includes(x)));
        filterinfo += `\nexclude mods: ${calcmodsex}`;
    }

    if (asObj.filterMapTitle != null) {
        filtereddata = filtereddata.filter(y => {
            const x = y.score;
            return (
                x.beatmapset.title.toLowerCase().replaceAll(' ', '')
                +
                x.beatmapset.artist.toLowerCase().replaceAll(' ', '')
                +
                x.beatmap.version.toLowerCase().replaceAll(' ', '')
            ).includes(asObj.filterMapTitle.toLowerCase().replaceAll(' ', ''))
                ||
                x.beatmapset.title.toLowerCase().replaceAll(' ', '').includes(asObj.filterMapTitle.toLowerCase().replaceAll(' ', ''))
                ||
                x.beatmapset.artist.toLowerCase().replaceAll(' ', '').includes(asObj.filterMapTitle.toLowerCase().replaceAll(' ', ''))
                ||
                x.beatmap.version.toLowerCase().replaceAll(' ', '').includes(asObj.filterMapTitle.toLowerCase().replaceAll(' ', ''))
                ||
                asObj.filterMapTitle.toLowerCase().replaceAll(' ', '').includes(x.beatmapset.title.toLowerCase().replaceAll(' ', ''))
                ||
                asObj.filterMapTitle.toLowerCase().replaceAll(' ', '').includes(x.beatmapset.artist.toLowerCase().replaceAll(' ', ''))
                ||
                asObj.filterMapTitle.toLowerCase().replaceAll(' ', '').includes(x.beatmap.version.toLowerCase().replaceAll(' ', ''));
        });

        filterinfo += `\nmap: ${asObj.filterMapTitle}`;
    }
    if (asObj.filterRank != null) {
        filtereddata = filtereddata.filter(array => array.score.mods.toString().replaceAll(',', '').includes(calcmods));
        filterinfo += `\nrank: ${asObj.filterRank}`;
    }
    if (asObj.pp != null) {
        filterinfo += `\npp: ${asObj.pp}`;
        const tempType: 'l' | 'g' = asObj.pp.includes('<') ? 'l' : 'g';
        const tempValue = +(asObj.pp.replace('<', '').replace('>', '')) ?? 0;
        filtereddata = filtereddata.filter(array =>
            tempType == 'g' ?
                array.score.pp > tempValue :
                array.score.pp < tempValue);
    }
    if (asObj.score != null) {
        filterinfo += `\nscore: ${asObj.score}`;
        const tempType: 'l' | 'g' = asObj.score.includes('<') ? 'l' : 'g';
        const tempValue = +(asObj.score.replace('<', '').replace('>', '')) ?? 0;
        filtereddata = filtereddata.filter(array =>
            tempType == 'g' ?
                array.score.score > tempValue :
                array.score.score < tempValue);
    }
    if (asObj.acc != null) {
        filterinfo += `\nacc: ${asObj.acc}`;
        const tempType: 'l' | 'g' = asObj.acc.includes('<') ? 'l' : 'g';
        const tempValue = +(asObj.acc.replace('<', '').replace('>', '')) ?? 0;
        filtereddata = filtereddata.filter(array =>
            tempType == 'g' ?
                array.score.accuracy > tempValue :
                array.score.accuracy < tempValue);
    }
    if (asObj.combo != null) {
        filterinfo += `\ncombo: ${asObj.combo}`;
        const tempType: 'l' | 'g' = asObj.combo.includes('<') ? 'l' : 'g';
        const tempValue = +(asObj.combo.replace('<', '').replace('>', '')) ?? 0;
        filtereddata = filtereddata.filter(array =>
            tempType == 'g' ?
                array.score.max_combo > tempValue :
                array.score.max_combo < tempValue);
    }
    if (asObj.miss != null) {
        filterinfo += `\nmiss: ${asObj.miss}`;
        const tempType: 'l' | 'g' = asObj.miss.includes('<') ? 'l' : 'g';
        const tempValue = +(asObj.miss.replace('<', '').replace('>', '')) ?? 0;
        filtereddata = filtereddata.filter(array =>
            tempType == 'g' ?
                array.score.statistics.count_miss > tempValue :
                array.score.statistics.count_miss < tempValue);
    }
    if (asObj.bpm != null) {
        filterinfo += `\nbpm: ${asObj.bpm}`;
        const tempType: 'l' | 'g' = asObj.bpm.includes('<') ? 'l' : 'g';
        const tempValue = +(asObj.bpm.replace('<', '').replace('>', '')) ?? 0;
        filtereddata = filtereddata.filter(array =>
            tempType == 'g' ?
                array.score.beatmap.bpm > tempValue :
                array.score.beatmap.bpm < tempValue);
    }


    let newData = filtereddata.slice();
    let sortinfo;
    switch (asObj.sort) {
        case 'score':
            newData = await filtereddata.slice().sort((a, b) => b.score.score - a.score.score);
            sortinfo = `\nsorted by highest score`;
            break;
        case 'acc':
            newData = await filtereddata.slice().sort((a, b) => b.score.accuracy - a.score.accuracy);
            sortinfo = `\nsorted by highest accuracy`;
            break;
        case 'pp': default:
            newData = await filtereddata.slice().sort((a, b) => b.score.pp - a.score.pp);
            sortinfo = `\nsorted by highest pp`;
            asObj.sort = 'pp';
            break;
        case 'recent':
            newData = await filtereddata.slice().sort((a, b) =>
                parseFloat(b.score.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', ''))
                -
                parseFloat(a.score.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')));
            sortinfo = `\nsorted by most recent`;
            break;
        case 'combo':
            newData = await filtereddata.slice().sort((a, b) => b.score.max_combo - a.score.max_combo);
            sortinfo = `\nsorted by highest combo`;
            break;
        case 'miss':
            newData = await filtereddata.slice().sort((a, b) => a.score.statistics.count_miss - b.score.statistics.count_miss);
            sortinfo = `\nsorted by least misses`;
            break;
        case 'rank':
            newData = await filtereddata.slice().sort((a, b) => a.score.rank.localeCompare(b.score.rank));
            sortinfo = `\nsorted by best rank`;
            break;
        case 'bpm':
            newData = await filtereddata.slice().sort((a, b) => b.score.beatmapset.bpm - a.score.beatmapset.bpm);
            sortinfo = `\nsorted by highest bpm`;
            break;
    }
    if (asObj.reverse == true) {
        newData.reverse();
        switch (asObj.sort) {
            case 'score':
                sortinfo = `\nsorted by lowest score`;
                break;
            case 'acc':
                sortinfo = `\nsorted by lowest accuracy`;
                break;
            case 'pp': default:
                sortinfo = `\nsorted by lowest pp`;
                break;
            case 'recent':
                sortinfo = `\nsorted by oldest`;
                break;
            case 'combo':
                sortinfo = `\nsorted by lowest combo`;
                break;
            case 'miss':
                sortinfo = `\nsorted by most misses`;
                break;
            case 'rank':
                sortinfo = `\nsorted by worst rank`;
                break;
        }
    }
    filterinfo += sortinfo;

    const scoresAsArrStr = [];
    const scoresAsFields: Discord.EmbedField[] = [];

    fs.writeFileSync('debug.json', JSON.stringify(asObj.scores, null, 2));

    let perPage = 5;
    switch (asObj.detailed) {
        case 0:
        case 1:
            perPage = 5;
            break;
        case 2:
            perPage = 10;
            break;
        case 3:
            break;
        case 4:
            break;
    }

    if (asObj.page >= Math.ceil(newData.length / perPage)) {
        asObj.page = Math.ceil(newData.length / perPage) - 1;
    }

    for (let i = 0; i < newData.length && i < perPage; i++) {
        const scoreoffset = asObj.page * perPage + i;
        const curscore = newData[scoreoffset]?.score;

        if (!curscore) {
            break;
        }

        // const trueIndex = newData[scoreoffset].index;
        const scoreID =
            //  `${scoreoffset + 1} ${trueIndex != scoreoffset + 1 ? `(${trueIndex})` : ''}`;
            `${newData[scoreoffset].index}`;

        const mapid = asObj.mapidOverride ?? curscore.beatmap.id;

        const ranking = curscore.rank.toUpperCase();
        const grade: string = gradeToEmoji(ranking);

        const hitstats = curscore.statistics;

        const hitlist: string = hitList(
            {
                gamemode: curscore.mode,
                count_geki: hitstats.count_geki,
                count_300: hitstats.count_300,
                count_katu: hitstats.count_katu,
                count_100: hitstats.count_100,
                count_50: hitstats.count_50,
                count_miss: hitstats.count_miss,
            }
        );

        let ifmods: string;

        if (!curscore.mods || curscore.mods.join('') == '' || curscore.mods == null || curscore.mods == undefined) {
            ifmods = '';
        } else {
            ifmods = `**${osumodcalc.OrderMods(curscore.mods.join('')).string}**`;
        }

        let pptxt: string;
        const ppcalcing =
            await osufunc.scorecalc({
                mods: curscore.mods.join('').length > 1 ?
                    curscore.mods.join('') : 'NM',
                gamemode: curscore.mode,
                mapid,
                miss: hitstats.count_miss,
                acc: curscore.accuracy,
                maxcombo: curscore.max_combo,
                score: curscore.score,
                calctype: 0,
                passedObj: getTotalHits(curscore.mode, curscore),
                failed: false
            },
                mapping.useScoreMap ?
                    new Date(curscore.beatmap.last_updated)
                    :
                    new Date(mapping.overrideMapLastDate),
                config
            );
        let tempMainpp = null;
        const mxCombo = ppcalcing[0].difficulty.maxCombo ?? curscore?.beatmap?.max_combo;

        if (curscore.accuracy != 1) {
            if (!curscore.pp || isNaN(curscore.pp) || curscore.pp == 0) {
                pptxt = `${ppcalcing[0].pp.toFixed(2)}pp`;
                tempMainpp = ppcalcing[0].pp;
            } else {
                pptxt = `${curscore.pp.toFixed(2)}pp`;
                tempMainpp = curscore.pp;
            }
            if (curscore.max_combo != mxCombo) {
                pptxt += ` (${ppcalcing[1].pp.toFixed(2)}pp if FC)`;
            }
            pptxt += ` (${ppcalcing[2].pp.toFixed(2)}pp if SS)`;
        } else {
            if (!curscore.pp || isNaN(curscore.pp) || curscore.pp == 0) {
                pptxt =
                    `${ppcalcing[0].pp.toFixed(2)}pp`;
                tempMainpp = ppcalcing[0].pp;
            } else {
                pptxt =
                    `${curscore.pp.toFixed(2)}pp`;
                tempMainpp = curscore.pp;
            }
        }

        let showtitle: string;

        if (asObj.showMapTitle == true) {
            showtitle = `[\`${curscore.beatmapset.title} [${curscore.beatmap.version}]\`](https://osu.ppy.sh/b/${curscore.beatmap.id})`;
        } else {
            showtitle = `[Score #${scoreID}](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id})`;
        }
        if (asObj.showUserName == true) {
            showtitle = `:flag_${curscore?.user?.country_code.toLowerCase()}: [${curscore?.user?.username ?? 'null'}](https://osu.ppy.sh/u/${curscore.user_id})`;
        }

        let weighted;
        if (asObj.showWeights == true) {
            (0.95 ** scoreoffset);
            weighted = `\n${(tempMainpp * (curscore?.weight?.percentage / 100)).toFixed(2)}pp Weighted at **${(curscore?.weight?.percentage)?.toFixed(2)}%**`;
        } else {
            weighted = '';
        }


        switch (asObj.detailed) {
            case 0: case 2: {
                let useTitle = `**#${scoreID}** | ${showtitle ? '**' + showtitle + '**' : ''}`;
                if (showtitle.includes('Score #')) {
                    useTitle = `**${showtitle}**`;
                }
                scoresAsFields.push({
                    name: `#${scoreID}`,
                    value: `
${showtitle ? '**' + showtitle + '**' : ''}
\`${hitlist}\` | ${curscore.max_combo == mxCombo ? `**${func.separateNum(curscore.max_combo)}x**` : `${func.separateNum(curscore.max_combo)}x`} | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade} ${curscore?.pp ? `| ` + curscore.pp.toFixed(2) + 'pp' : ''}
`,
                    inline: false
                });

                scoresAsArrStr.push(`
${useTitle}
\`${hitlist}\` | ${curscore.max_combo == mxCombo ? `**${func.separateNum(curscore.max_combo)}x**` : `${func.separateNum(curscore.max_combo)}x`} | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade} ${curscore?.pp ? `| ` + curscore.pp.toFixed(2) + 'pp' : ''}`);
            }
                break;
            default: case 1: {
                scoresAsFields.push({
                    name: `#${scoreID}`,
                    value: `
${showtitle ? '**' + showtitle + '**\n' : ''} **<t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>** | [Score](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id}) ${curscore.replay ? `| [REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}
\`${hitlist}\` | ${curscore.max_combo == mxCombo ? `**${func.separateNum(curscore.max_combo)}x**` : `${func.separateNum(curscore.max_combo)}x`} | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade} ${curscore.mods.length > 0 ? '| ' + ifmods : ''}
${pptxt} ${weighted}`,
                    inline: false
                });
                scoresAsArrStr.push(
                    `#${scoreID}
${showtitle ? '**' + showtitle + '**\n' : ''} **<t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>** | [Score](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id}) ${curscore.replay ? `| [REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}
\`${hitlist}\` | ${curscore.max_combo == mxCombo ? `**${func.separateNum(curscore.max_combo)}x**` : `${func.separateNum(curscore.max_combo)}x`} | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
${pptxt} ${weighted}
`
                );
            }
                break;

        }
    }

    return {
        string: scoresAsArrStr,
        fields: scoresAsFields,
        filter: `\n${newData.length} scores` + filterinfo,
        maxPages: Math.ceil(newData.length / perPage),
        isFirstPage: asObj.page == 0,
        isLastPage: asObj.page >= Math.ceil(newData.length / perPage) - 1,
        usedPage: asObj.page
    };

}

export function score(score: osuapitypes.Score, map: osuapitypes.Beatmap, detailed: boolean) {

    let fields;

    if (detailed) {
        //like rs
    } else {
        //like scoreparse
    }

    return fields;
}

export type scoreSort = 'pp' | 'score' | 'acc' | 'recent' | 'combo' | 'miss' | 'rank' | 'bpm';

export function user() { }

export function userList(data: {
    userdata: osuapitypes.User[],
    sort: userSort,
    page: number,
    reverseSort: boolean,
}) {

}

export type userSort = 'pp' | 'rank' | 'acc' | 'playcount' | 'level' | 'joindate' | 'countryrank' | 'countrypp' | 'score' | 'score_ranked';

export function gradeToEmoji(str: string) {
    return emojis.grades[str];
}

export function hitList(
    obj: {
        gamemode: osuapitypes.GameMode,
        count_geki?: number;
        count_300: number,
        count_katu?: number;
        count_100: number,
        count_50?: number,
        count_miss: number,
    }
) {
    let hitList: string;
    switch (obj.gamemode) {
        case 'osu':
        default:
            hitList = `${func.separateNum(obj.count_300)}/${func.separateNum(obj.count_100)}/${func.separateNum(obj.count_50)}/${func.separateNum(obj.count_miss)}`;
            break;
        case 'taiko':
            hitList = `${func.separateNum(obj.count_300)}/${func.separateNum(obj.count_100)}/${func.separateNum(obj.count_miss)}`;
            break;
        case 'fruits':
            hitList = `${func.separateNum(obj.count_300)}/${func.separateNum(obj.count_100)}/${func.separateNum(obj.count_50)}/${func.separateNum(obj.count_miss)}`;
            break;
        case 'mania':
            hitList = `${func.separateNum(obj.count_geki)}/${func.separateNum(obj.count_300)}/${func.separateNum(obj.count_katu)}/${func.separateNum(obj.count_100)}/${func.separateNum(obj.count_50)}/${func.separateNum(obj.count_miss)}`;
            break;
    }
    return hitList;
}

export async function mapList(
    data: {
        type: 'mapset' | 'map' | 'mapsetplays',
        maps: osuapitypes.Beatmap[] | osuapitypes.Beatmapset[] | osuapitypes.BeatmapPlayCountArr,
        page: number,
        sort: mapSort,
        reverse: boolean,
        detailed: number,
    },
    config: extypes.config
) {
    let filterinfo: string = '';
    let newData = [];
    const mapsArr: Discord.EmbedField[] = [];
    const mapsArrStr: string[] = [];
    let page = data.page;
    let sortinfo = '';

    let usePage = 5;

    switch (data.detailed) {
        case 0:
            break;
        case 2:
            usePage = 10;
            break;
    }

    switch (data.type) {
        case 'mapset': {
            const maps = data.maps as osuapitypes.Beatmapset[];
            switch (data.sort) {
                case 'title':
                    maps.sort((a, b) => a.title.localeCompare(b.title));
                    sortinfo = 'Sorted by title';
                    break;
                case 'artist':
                    maps.sort((a, b) => a.artist.localeCompare(b.artist));
                    sortinfo = 'Sorted by artist';
                    break;
                case 'difficulty':
                    maps.sort((a, b) =>
                        b.beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0].difficulty_rating -
                        a.beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0].difficulty_rating
                    );
                    sortinfo = 'Sorted by difficulty';
                    break;
                case 'plays':
                    maps.sort((a, b) => b.play_count - a.play_count);
                    sortinfo = 'Sorted by playcount';
                    break;
                case 'dateadded':
                    maps.sort((a, b) => new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime());
                    sortinfo = 'Sorted by date added';
                    break;
                case 'favourites':
                    maps.sort((a, b) => b.favourite_count - a.favourite_count);
                    sortinfo = 'Sorted by favourites';
                    break;
                case 'bpm':
                    maps.sort((a, b) => b.bpm - a.bpm);
                    sortinfo = 'Sorted by bpm';
                    break;
                case 'cs':
                    maps.sort((a, b) =>
                        b.beatmaps.sort((a, b) => b.cs - a.cs)[0].cs -
                        a.beatmaps.sort((a, b) => b.cs - a.cs)[0].cs
                    );
                    sortinfo = 'Sorted by circle size';
                    break;
                case 'ar':
                    maps.sort((a, b) =>
                        b.beatmaps.sort((a, b) => b.ar - a.ar)[0].ar -
                        a.beatmaps.sort((a, b) => b.ar - a.ar)[0].ar
                    );
                    sortinfo = 'Sorted by approach rate';
                    break;
                case 'od':
                    maps.sort((a, b) =>
                        b.beatmaps.sort((a, b) => b.accuracy - a.accuracy)[0].accuracy -
                        a.beatmaps.sort((a, b) => b.accuracy - a.accuracy)[0].accuracy
                    );
                    sortinfo = 'Sorted by overall difficulty';
                    break;
                case 'hp':
                    maps.sort((a, b) =>
                        b.beatmaps.sort((a, b) => b.drain - a.drain)[0].drain -
                        a.beatmaps.sort((a, b) => b.drain - a.drain)[0].drain
                    );
                    sortinfo = 'Sorted by hp';
                    break;
                case 'length':
                    maps.sort((a, b) =>
                        b.beatmaps[0].total_length -
                        a.beatmaps[0].total_length
                    );
                    sortinfo = 'Sorted by length';
                    break;
                default:
                    break;
            }

            if (data.reverse == true) {
                maps.reverse();
                sortinfo += ' (reversed)';
            }

            filterinfo += sortinfo;
            if (page >= Math.ceil(maps.length / usePage)) {
                page = Math.ceil(maps.length / usePage) - 1;
            }
            if (page < 0) {
                page = 0;
            }

            newData = maps;

            for (let i = 0; i < usePage && i < maps.length; i++) {
                const offset = page * usePage + i;
                const curmapset = maps[offset];
                if (!curmapset) {
                    break;
                }
                /**
                 * artist - title (url)
                 * status | mode
                 * length | bpm
                 * top diff combo
                 * playcount | passes
                 * submitted date | last updated
                 * ranked date
                 * favourite count
                 */
                const topmap = curmapset.beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0];

                switch (data.detailed) {
                    case 0: case 2:
                        mapsArr.push({
                            name: '',
                            value: '',
                            inline: false,
                        });
                        mapsArrStr.push(
                            `
**#${offset + 1} | [\`${curmapset.artist} - ${curmapset.title}\`](https://osu.ppy.sh/s/${curmapset.id})**
${calc.secondsToTime(topmap.total_length)} | ${curmapset.bpm}${emojis.mapobjs.bpm} | ${calc.secondsToTime(topmap.total_length)} | ${curmapset.bpm}${emojis.mapobjs.bpm}`
                        );
                        break;
                    case 1: default:
                        mapsArr.push({
                            name: `${offset + 1}`,
                            value:
                                `
[\`${curmapset.artist} - ${curmapset.title}\`](https://osu.ppy.sh/s/${curmapset.id})
${emojis.rankedstatus[curmapset.status]} | ${config.useEmojis.gamemodes ? emojis.gamemodes[topmap.mode] : topmap.mode}
${calc.secondsToTime(topmap.total_length)} | ${curmapset.bpm}${emojis.mapobjs.bpm}
${func.separateNum(curmapset.play_count)} plays | ${func.separateNum(topmap.passcount)} passes | ${func.separateNum(curmapset.favourite_count)} favourites
Submitted <t:${new Date(curmapset.submitted_date).getTime() / 1000}:R> | Last updated <t:${new Date(curmapset.last_updated).getTime() / 1000}:R>
${topmap.status == 'ranked' ?
                                    `Ranked <t:${Math.floor(new Date(curmapset.ranked_date).getTime() / 1000)}:R>` : ''
                                }${topmap.status == 'approved' || topmap.status == 'qualified' ?
                                    `Approved/Qualified <t:${Math.floor(new Date(curmapset.ranked_date).getTime() / 1000)}:R>` : ''
                                }${topmap.status == 'loved' ?
                                    `Loved <t:${Math.floor(new Date(curmapset.ranked_date).getTime() / 1000)}:R>` : ''
                                }`,
                            inline: false
                        });
                        mapsArrStr.push(
                            `**#${offset + 1} | [\`${curmapset.artist} - ${curmapset.title}\`](https://osu.ppy.sh/s/${curmapset.id})**
${emojis.rankedstatus[curmapset.status]} | ${config.useEmojis.gamemodes ? emojis.gamemodes[topmap.mode] : topmap.mode}
${calc.secondsToTime(topmap.total_length)} | ${curmapset.bpm}${emojis.mapobjs.bpm}
${func.separateNum(curmapset.play_count)} plays | ${func.separateNum(topmap.passcount)} passes | ${func.separateNum(curmapset.favourite_count)} favourites
Submitted <t:${new Date(curmapset.submitted_date).getTime() / 1000}:R> | Last updated <t:${new Date(curmapset.last_updated).getTime() / 1000}:R>
${topmap.status == 'ranked' ?
                                `Ranked <t:${Math.floor(new Date(curmapset.ranked_date).getTime() / 1000)}:R>` : ''
                            }${topmap.status == 'approved' || topmap.status == 'qualified' ?
                                `Approved/Qualified <t: ${Math.floor(new Date(curmapset.ranked_date).getTime() / 1000)}:R>` : ''
                            }${topmap.status == 'loved' ?
                                `Loved <t:${Math.floor(new Date(curmapset.ranked_date).getTime() / 1000)}:R>` : ''
                            }`
                        );
                        break;
                }
            }
        }
            break;
        case 'mapsetplays': {
            const maps = data.maps as osuapitypes.BeatmapPlayCountArr;
            if (data.reverse == true) {
                maps.reverse();
                sortinfo += ' (reversed)';
            }
            filterinfo += sortinfo;
            if (page >= Math.ceil(maps.length / usePage)) {
                page = Math.ceil(maps.length / usePage) - 1;
            }
            if (page < 0) {
                page = 0;
            }

            newData = maps;

            for (let i = 0; i < usePage && i < maps.length; i++) {
                const offset = page * usePage + i;
                const current = maps[offset];
                const curmapset = current.beatmapset;
                const topmap = current.beatmap;
                if (!curmapset) {
                    break;
                }
                switch (data.detailed) {
                    case 0: case 2:
                        mapsArr.push({
                            name: '',
                            value: '',
                            inline: false,
                        });
                        mapsArrStr.push(
                            `
**#${offset + 1} | [\`${curmapset.artist} - ${curmapset.title} [${current.beatmap.version}]\`](https://osu.ppy.sh/s/${curmapset.id})**
**${current.count}x plays**
`
                        );
                        break;
                    case 1: default:
                        mapsArr.push({
                            name: `${offset + 1}`,
                            value:
                                `
[\`${curmapset.artist} - ${curmapset.title} [${current.beatmap.version}]\`](https://osu.ppy.sh/s/${curmapset.id})
**${current.count}x plays**
${emojis.rankedstatus[curmapset.status]} | ${config.useEmojis.gamemodes ? emojis.gamemodes[topmap.mode] : topmap.mode}
${calc.secondsToTime(topmap.total_length)} | ${func.separateNum(curmapset.favourite_count)} favourites
`,
                            inline: false
                        });
                        mapsArrStr.push(
                            `**#${offset + 1} | [\`${curmapset.artist} - ${curmapset.title} [${current.beatmap.version}]\`](https://osu.ppy.sh/s/${curmapset.id})**
**${current.count}x plays**
${emojis.rankedstatus[curmapset.status]} | ${config.useEmojis.gamemodes ? emojis.gamemodes[topmap.mode] : topmap.mode}
${calc.secondsToTime(topmap.total_length)} | ${func.separateNum(curmapset.favourite_count)} favourites`
                        );
                        break;
                }
            }
        }
            // case 'map': {

            // }
            break;
    }

    return {
        fields: mapsArr,
        string: mapsArrStr,
        filter: filterinfo,
        maxPages: Math.ceil(newData.length / usePage),
        isFirstPage: page == 0,
        isLastPage: page >= Math.ceil(newData.length / usePage) - 1
    };
}

export async function sortScores(input: {
    scores: osuapitypes.Score[],
    detailed: boolean,
    showWeights: boolean,
    page: number,
    showMapTitle: boolean,
    showTruePosition: boolean,
    sort: scoreSort,
    truePosType: scoreSort,
    filteredMapper: string,
    filteredMods: string,
    reverse: boolean,
    mapidOverride?: number,
    showUserName?: boolean,
    pp?: string,
    score?: string,
    acc?: string,
    combo?: string,
    miss?: string;
}) {

}

export type mapSort = 'title' | 'artist' |
    'difficulty' | 'status' | 'rating' |
    'fails' | 'plays' |
    'dateadded' | 'favourites' | 'bpm' |
    'cs' | 'ar' | 'od' | 'hp' | 'length';

export function getTotalHits(mode: osuapitypes.GameMode, score: osuapitypes.Score) {
    let totalHits = 0;
    const stats = score.statistics;
    switch (mode) {
        case 'osu': default:
            totalHits = stats.count_300 + stats.count_100 + stats.count_50 + stats.count_miss;
            break;
        case 'taiko':
            totalHits = stats.count_300 + stats.count_100 + stats.count_miss;
            break;
        case 'fruits':
            totalHits = stats.count_300 + stats.count_100 + stats.count_50 + stats.count_miss;
            break;
        case 'mania':
            totalHits = stats.count_geki + stats.count_300 + stats.count_katu + stats.count_100 + stats.count_50 + stats.count_miss;
            break;
    }
    return totalHits;
}