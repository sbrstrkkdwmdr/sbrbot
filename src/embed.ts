import osuapitypes = require('./types/osuApiTypes');
import osumodcalc = require('osumodcalculator');
import emojis = require('./consts/emojis');
import osufunc = require('./osufunc');
import fs = require('fs');
import func = require('./tools');

export async function scoreList(
    asObj: {
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
    }
) {

    const scores = asObj.scores
    const detailed = asObj.detailed
    const showWeights = asObj.showWeights
    let page = asObj.page
    const showMapTitle = asObj.showMapTitle
    const showTruePosition = asObj.showTruePosition
    let sort = asObj.sort
    const truePosType = asObj.truePosType
    const filteredMapper = asObj.filteredMapper
    let filteredMods = asObj.filteredMods
    const reverse = asObj.reverse
    const mapidOverride = asObj.mapidOverride


    let filtereddata = scores.slice()
    let filterinfo = '';

    if (filteredMapper != null) {
        filtereddata = scores.slice().filter(array => array.beatmapset.creator.toLowerCase() == filteredMapper.toLowerCase())
        filterinfo += `\nmapper: ${filteredMapper}`
    }
    let calcmods = osumodcalc.OrderMods(filteredMods + '')
    if (calcmods.length < 1) {
        calcmods = 'NM'
        filteredMods = null
    }
    if (filteredMods != null && !filteredMods.includes('any')) {
        filtereddata = scores.slice().filter(array => array.mods.toString().replaceAll(',', '') == calcmods)
        filterinfo += `\nmods: ${filteredMods}`
    }
    if (filteredMods != null && filteredMods.includes('any')) {
        filtereddata = scores.slice().filter(array => array.mods.toString().replaceAll(',', '').includes(calcmods))
        filterinfo += `\nmods: ${filteredMods}`
    }

    let newData = filtereddata.slice()
    let sortinfo;
    switch (sort) {
        case 'score':
            newData = filtereddata.slice().sort((a, b) => b.score - a.score)
            sortinfo = `\nsorted by highest score`
            break;
        case 'acc':
            newData = filtereddata.slice().sort((a, b) => b.accuracy - a.accuracy)
            sortinfo = `\nsorted by highest accuracy`
            break;
        case 'pp': default:
            newData = filtereddata.slice().sort((a, b) => b.pp - a.pp)
            sortinfo = `\nsorted by highest pp`
            sort = 'pp'
            break;
        case 'recent':
            newData = filtereddata.slice().sort((a, b) => parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
            sortinfo = `\nsorted by most recent`
            break;
        case 'combo':
            newData = filtereddata.slice().sort((a, b) => b.max_combo - a.max_combo)
            sortinfo = `\nsorted by highest combo`
            break;
        case 'miss':
            newData = filtereddata.slice().sort((a, b) => a.statistics.count_miss - b.statistics.count_miss)
            sortinfo = `\nsorted by least misses`
            break;
        case 'rank':
            newData = filtereddata.slice().sort((a, b) => a.rank.localeCompare(b.rank))
            sortinfo = `\nsorted by best rank`
            break;
    }
    if (reverse == true) {
        newData.reverse()
        switch (sort) {
            case 'score':
                sortinfo = `\nsorted by lowest score`
                break;
            case 'acc':
                sortinfo = `\nsorted by lowest accuracy`
                break;
            case 'pp': default:
                sortinfo = `\nsorted by lowest pp`
                break;
            case 'recent':
                sortinfo = `\nsorted by oldest`
                break;
            case 'combo':
                sortinfo = `\nsorted by lowest combo`
                break;
            case 'miss':
                sortinfo = `\nsorted by most misses`
                break;
            case 'rank':
                sortinfo = `\nsorted by worst rank`
                break;
        }
    }
    filterinfo += sortinfo

    if (page >= Math.ceil(newData.length / 5)) {
        page = Math.ceil(newData.length / 5) - 1
    }

    const scoresAsArrStr = [];
    const scoresAsFields = [];

    fs.writeFileSync('debug.json', JSON.stringify(scores, null, 2));

    let trueIndex: string | number = '';

    let truePosArr = newData.slice()

    if (showTruePosition && sort != truePosType) {
        truePosArr = await scores.slice().sort((a, b) => b.pp - a.pp)
    }

    for (let i = 0; i < 5 && i < newData.length; i++) {
        const scoreoffset = page * 5 + i
        const curscore = newData[scoreoffset]

        if (!curscore) {
            break;
        }
        if (showTruePosition && sort != truePosType) {
            if (curscore.id != truePosArr[scoreoffset].id) {
                trueIndex = await truePosArr.indexOf(curscore) + 1
            } else {
                trueIndex = ''
            }
        }

        const mapid = mapidOverride ?? curscore.beatmap.id;

        if (detailed === true) {
            const ranking = curscore.rank.toUpperCase()
            let grade: string = gradeToEmoji(ranking);
            const hitstats = curscore.statistics
            let hitlist: string = hitList(
                {
                    gamemode: curscore.mode,
                    count_geki: hitstats.count_geki,
                    count_300: hitstats.count_300,
                    count_katu: hitstats.count_katu,
                    count_100: hitstats.count_100,
                    count_50: hitstats.count_50,
                    count_miss: hitstats.count_miss,
                }
            )

            const tempMods = curscore.mods
            let ifmods: string;

            if (!tempMods || tempMods.join('') == '' || tempMods == null || tempMods == undefined) {
                ifmods = ''
            } else {
                ifmods = '+' + tempMods.toString().replaceAll(",", '')
            }

            let pptxt: string;
            const ppcalcing =
                await osufunc.scorecalc({
                    mods: curscore.mods.join('').length > 1 ?
                        curscore.mods.join('') : 'NM',
                    gamemode: curscore.mode,
                    mapid: curscore.beatmap.id,
                    miss: hitstats.count_miss,
                    acc: curscore.accuracy,
                    maxcombo: curscore.max_combo,
                    score: curscore.score,
                    calctype: 0,
                    passedObj: 0,
                    failed: false
                })
            if (curscore.accuracy != 1) {
                if (curscore.pp == null || isNaN(curscore.pp)) {
                    pptxt = `${await ppcalcing[0].pp.toFixed(2)}pp`
                } else {
                    pptxt = `${curscore.pp.toFixed(2)}pp`
                }
                if (curscore.perfect == false) {
                    pptxt += ` (${ppcalcing[1].pp.toFixed(2)}pp if FC)`
                }
                pptxt += ` (${ppcalcing[2].pp.toFixed(2)}pp if SS)`
            } else {
                if (curscore.pp == null || isNaN(curscore.pp)) {
                    pptxt =
                        `${await ppcalcing[0].pp.toFixed(2)}pp`
                } else {
                    pptxt =
                        `${curscore.pp.toFixed(2)}pp`
                }
            }
            let showtitle: string;

            if (showMapTitle == true) {
                showtitle = `[${curscore.beatmapset.title} [${curscore.beatmap.version}]](https://osu.ppy.sh/b/${curscore.beatmap.id}) ${ifmods}`
            } else {
                showtitle = `Score #${i + 1 + (page * 5)}${trueIndex != '' ? `(#${trueIndex})` : ''} ${ifmods}`
            }
            if(asObj.showUserName == true){
                showtitle = `[${curscore.user.username}](https://osu.ppy.sh/u/${curscore.user.id})`
            }
            let weighted;
            if (showWeights == true) {
                weighted = `${(curscore?.weight?.pp)?.toFixed(2)}pp Weighted at **${(curscore?.weight?.percentage)?.toFixed(2)}%**`
            } else {
                weighted = ''
            }

            scoresAsFields.push({
                name: `#${i + 1 + (page * 5)} ${trueIndex != '' ? `(#${trueIndex})` : ''}`,
                value: `
**${showtitle}**
[**Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id})${curscore.replay ? ` | [REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}
${func.separateNum(curscore.score)} | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade} | \`${hitlist}\` | ${func.separateNum(curscore.max_combo)}x
${pptxt} | ${weighted}
`,
                inline: false
            })
            scoresAsArrStr.push(
                `\n**#${i + 1 + (page * 5)} | **${showtitle}**
[**Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id})${curscore.replay ? ` | [REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}
${func.separateNum(curscore.score)} | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade} | \`${hitlist}\` | ${func.separateNum(curscore.max_combo)}x
${pptxt} | ${weighted}

`
            )
        } else {
            const ranking = curscore.rank.toUpperCase()
            let grade: string = gradeToEmoji(ranking);

            const hitstats = curscore.statistics

            let hitlist: string = hitList(
                {
                    gamemode: curscore.mode,
                    count_geki: hitstats.count_geki,
                    count_300: hitstats.count_300,
                    count_katu: hitstats.count_katu,
                    count_100: hitstats.count_100,
                    count_50: hitstats.count_50,
                    count_miss: hitstats.count_miss,
                }
            )

            const tempMods = curscore.mods
            let ifmods: string;

            if (!tempMods || tempMods.join('') == '' || tempMods == null || tempMods == undefined) {
                ifmods = ''
            } else {
                ifmods = '+' + osumodcalc.OrderMods(tempMods.join(''))
            }

            let pptxt: string;


            if (curscore.pp == null || isNaN(curscore.pp)) {
                const ppcalcing = await osufunc.scorecalc({
                    mods: curscore.mods.join('').length > 1 ?
                        curscore.mods.join('') : 'NM',
                    gamemode: curscore.mode,
                    mapid: curscore.beatmap.id,
                    miss: hitstats.count_miss,
                    acc: curscore.accuracy,
                    maxcombo: curscore.max_combo,
                    score: curscore.score,
                    calctype: 0,
                    passedObj: 0,
                    failed: false
                })
                pptxt =
                    `${await ppcalcing[0].pp.toFixed(2)}pp`
            } else {
                pptxt =
                    `${curscore.pp.toFixed(2)}pp`
            }

            let showtitle: string;

            if (showMapTitle == true) {
                showtitle = `[${curscore.beatmapset.title} [${curscore.beatmap.version}]](https://osu.ppy.sh/b/${curscore.beatmap.id}) ${ifmods}\n`
            } else {
                showtitle = `[Score #${i + 1 + (page * 5)}](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id}) ${trueIndex != '' ? `(#${trueIndex})` : ''} ${ifmods} | `
            }
            if(asObj.showUserName == true){
                showtitle = `[${curscore?.user?.username ?? 'null'}](https://osu.ppy.sh/u/${curscore.user_id}) ${trueIndex != '' ? `(#${trueIndex})` : ''} ${ifmods} | `
            }

            scoresAsFields.push({
                name: `#${i + 1 + (page * 5)} ${trueIndex != '' ? `(#${trueIndex})` : ''}`,
                value: `
**${showtitle}** [**Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id})${curscore.replay ? ` | [REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}
${(curscore.accuracy * 100).toFixed(2)}% | ${grade} | ${pptxt}
\`${hitlist}\` | ${func.separateNum(curscore.max_combo)}x
`,
                inline: false
            })
            scoresAsArrStr.push(
                `#${i + 1 + (page * 5)} ${trueIndex != '' ? `(#${trueIndex})` : ''}
**${showtitle}** [**Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id})${curscore.replay ? ` | [REPLAY](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.id}/download)` : ''}
${(curscore.accuracy * 100).toFixed(2)}% | ${grade} | ${pptxt}
\`${hitlist}\` | ${func.separateNum(curscore.max_combo)}x
`
            )
        }
    }

    return {
        string: scoresAsArrStr,
        fields: scoresAsFields,
        filter: filterinfo,
        maxPages: Math.ceil(newData.length / 5),
        isFirstPage: page == 0,
        isLastPage: page >= Math.ceil(newData.length / 5) - 1
    }

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

export type scoreSort = 'pp' | 'score' | 'acc' | 'recent' | 'combo' | 'miss' | 'rank'

export function user() { }

export function userList(data: {
    userdata: osuapitypes.User[],
    sort: userSort,
    page: number,
    reverseSort: boolean,
}) {

}

export type userSort = 'pp' | 'rank' | 'acc' | 'playcount' | 'level' | 'joindate' | 'countryrank' | 'countrypp' | 'score' | 'score_ranked'

export function gradeToEmoji(str: string) {
    let grade;
    switch (str) {
        case 'F':
            grade = emojis.grades.F
            break;
        case 'D':
            grade = emojis.grades.D
            break;
        case 'C':
            grade = emojis.grades.C
            break;
        case 'B':
            grade = emojis.grades.B
            break;
        case 'A':
            grade = emojis.grades.A
            break;
        case 'S':
            grade = emojis.grades.S
            break;
        case 'SH':
            grade = emojis.grades.SH
            break;
        case 'X':
            grade = emojis.grades.X
            break;
        case 'XH':
            grade = emojis.grades.XH
            break;
    }
    return grade;
}

export function hitList(
    obj: {
        gamemode: osuapitypes.GameMode,
        count_geki?: number
        count_300: number,
        count_katu?: number
        count_100: number,
        count_50?: number,
        count_miss: number,
    }
) {
    let hitList: string;
    switch (obj.gamemode) {
        case 'osu':
        default:
            hitList = `${func.separateNum(obj.count_300)}/${func.separateNum(obj.count_100)}/${func.separateNum(obj.count_50)}/${func.separateNum(obj.count_miss)}`
            break;
        case 'taiko':
            hitList = `${func.separateNum(obj.count_300)}/${func.separateNum(obj.count_100)}/${func.separateNum(obj.count_miss)}`
            break;
        case 'fruits':
            hitList = `${func.separateNum(obj.count_300)}/${func.separateNum(obj.count_100)}/${func.separateNum(obj.count_50)}/${func.separateNum(obj.count_miss)}`
            break;
        case 'mania':
            hitList = `${func.separateNum(obj.count_geki)}/${func.separateNum(obj.count_300)}/${func.separateNum(obj.count_katu)}/${func.separateNum(obj.count_100)}/${func.separateNum(obj.count_50)}/${func.separateNum(obj.count_miss)}`
            break;
    }
    return hitList;
}