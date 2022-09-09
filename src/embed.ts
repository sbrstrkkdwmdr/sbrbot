import osuapitypes = require('./types/osuApiTypes');
import osumodcalc = require('osumodcalculator');
import emojis = require('./consts/emojis');
import osufunc = require('./osufunc');
import fs = require('fs');

export async function scoreList(
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
) {



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
    if (reverse == false || reverse == null) {
        switch (sort) {
            case 'score':
                newData = filtereddata.slice().sort((a, b) => b.score - a.score)
                filterinfo += `\nsorted by score`
                break;
            case 'acc':
                newData = filtereddata.slice().sort((a, b) => b.accuracy - a.accuracy)
                filterinfo += `\nsorted by highest accuracy`
                break;
            case 'pp': default:
                newData = filtereddata.slice().sort((a, b) => b.pp - a.pp)
                filterinfo += `\nsorted by highest pp`
                sort = 'pp'
                break;
            case 'recent':
                newData = filtereddata.slice().sort((a, b) => parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
                filterinfo += `\nsorted by most recent`
                break;
            case 'combo':
                newData = filtereddata.slice().sort((a, b) => b.max_combo - a.max_combo)
                filterinfo += `\nsorted by highest combo`
                break;
            case 'miss':
                newData = filtereddata.slice().sort((a, b) => a.statistics.count_miss - b.statistics.count_miss)
                filterinfo += `\nsorted by least misses`
                break;
            case 'rank':
                newData = filtereddata.slice().sort((a, b) => a.rank.localeCompare(b.rank))
                filterinfo += `\nsorted by rank`
                break;
        }
    } else {
        switch (sort) {
            case 'score':
                newData = filtereddata.slice().sort((a, b) => a.score - b.score)
                filterinfo += `\nsorted by lowest score`
                break;
            case 'acc':
                newData = filtereddata.slice().sort((a, b) => a.accuracy - b.accuracy)
                filterinfo += `\nsorted by lowest accuracy`
                break;
            case 'pp': default:
                newData = filtereddata.slice().sort((a, b) => a.pp - b.pp)
                filterinfo += `\nsorted by lowest pp`
                sort = 'pp'
                break;
            case 'recent':
                newData = filtereddata.slice().sort((a, b) => parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))
                filterinfo += `\nsorted by oldest`
                break;
            case 'combo':
                newData = filtereddata.slice().sort((a, b) => a.max_combo - b.max_combo)
                filterinfo += `\nsorted by lowest combo`
                break;
            case 'miss':
                newData = filtereddata.slice().sort((a, b) => b.statistics.count_miss - a.statistics.count_miss)
                filterinfo += `\nsorted by most misses`
                break;
            case 'rank':
                newData = filtereddata.slice().sort((a, b) => b.rank.localeCompare(a.rank))
                filterinfo += `\nsorted by lowest rank`
                break;
        }
    }
    let scoresAsArrStr = [];
    let scoresAsFields = [];

    fs.writeFileSync('debug.json', JSON.stringify(scores, null, 2));

    let trueIndex: string | number = '';

    let truePosArr = newData.slice()//.sort((a, b) => b.pp - a.pp)

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

        let mapid = mapidOverride ? mapidOverride : curscore.beatmap.id;

        if (detailed === true) {
            const ranking = curscore.rank.toUpperCase()
            let grade: string;
            switch (ranking) {
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
            let hitlist: string;
            const hitstats = curscore.statistics
            switch (curscore.mode) {
                case 'osu':
                default:
                    hitlist = `${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
                case 'taiko':
                    hitlist = `${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
                case 'fruits':
                    hitlist = `${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
                case 'mania':
                    hitlist = `${hitstats.count_geki.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_katu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
            }

            const tempMods = curscore.mods
            let ifmods: string;

            if (!tempMods || tempMods.join('') == '' || tempMods == null || tempMods == undefined) {
                ifmods = ''
            } else {
                ifmods = '+' + tempMods.toString().replaceAll(",", '')
            }

            let pptxt: string;
            const ppcalcing = await osufunc.scorecalc(
                curscore.mods.join('').length > 1 ? curscore.mods.join('').toUpperCase() : 'NM',
                curscore.mode,
                mapid,
                hitstats.count_geki,
                hitstats.count_300,
                hitstats.count_katu,
                hitstats.count_100,
                hitstats.count_50,
                hitstats.count_miss,
                curscore.accuracy,
                curscore.max_combo,
                curscore.score,
                0,
                null, false
            )
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
                showtitle = `[Score #${i + 1 + (page * 5)}](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id}) ${trueIndex != '' ? `(#${trueIndex})` : ''} ${ifmods}`
            }
            let weighted;
            if (showWeights == true) {
                weighted = `${(curscore?.weight.pp).toFixed(2)}pp Weighted at **${(curscore?.weight.percentage).toFixed(2)}%**`
            } else {
                weighted = ''
            }

            scoresAsFields.push({
                name: `#${i + 1 + (page * 5)} ${trueIndex != '' ? `(#${trueIndex})` : ''}`,
                value: `
**${showtitle}**
**Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>
${curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
\`${hitlist}\`
${pptxt} 
${weighted}
`,
                inline: false
            })
            scoresAsArrStr.push(
                `\n**#${i + 1 + (page * 5)} | [${curscore.beatmapset.title} [${curscore.beatmap.version}]](https://osu.ppy.sh/b/${curscore.beatmap.id})**
**Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>
${curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
\`${hitlist}\`
${pptxt}
${weighted}
`
            )
        } else {
            const ranking = curscore.rank.toUpperCase()
            let grade: string;
            switch (ranking) {
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
            let hitlist: string;
            const hitstats = curscore.statistics
            switch (curscore.mode) {
                case 'osu':
                default:
                    hitlist = `${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
                case 'taiko':
                    hitlist = `${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
                case 'fruits':
                    hitlist = `${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
                case 'mania':
                    hitlist = `${hitstats.count_geki.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_300.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_katu.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_100.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_50.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${hitstats.count_miss.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    break;
            }

            const tempMods = curscore.mods
            let ifmods: string;

            if (!tempMods || tempMods.join('') == '' || tempMods == null || tempMods == undefined) {
                ifmods = ''
            } else {
                ifmods = '+' + osumodcalc.OrderMods(tempMods.join(''))
            }

            let pptxt: string;
            const ppcalcing = await osufunc.scorecalc(
                curscore.mods.join('').length > 1 ? curscore.mods.join('').toUpperCase() : 'NM',
                curscore.mode,
                mapid,
                hitstats.count_geki,
                hitstats.count_300,
                hitstats.count_katu,
                hitstats.count_100,
                hitstats.count_50,
                hitstats.count_miss,
                curscore.accuracy,
                curscore.max_combo,
                curscore.score,
                0,
                null, false
            )
            if (curscore.accuracy != 1) {
                if (curscore.pp == null || isNaN(curscore.pp)) {
                    pptxt = `${await ppcalcing[0].pp.toFixed(2)}pp`
                } else {
                    pptxt = `${curscore.pp.toFixed(2)}pp`
                }
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
                showtitle = `[${curscore.beatmapset.title} [${curscore.beatmap.version}]](https://osu.ppy.sh/b/${curscore.beatmap.id}) ${ifmods}\n`
            } else {
                showtitle = `[Score #${i + 1 + (page * 5)}](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id}) ${trueIndex != '' ? `(#${trueIndex})` : ''} ${ifmods} | `
            }

            scoresAsFields.push({
                name: `#${i + 1 + (page * 5)} ${trueIndex != '' ? `(#${trueIndex})` : ''}`,
                value: `
**${showtitle}** **Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>
${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
\`${hitlist}\`${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x
${pptxt}
`,
                inline: false
            })
            scoresAsArrStr.push(
                `\n#${showtitle}
**Score set** <t:${new Date(curscore.created_at.toString()).getTime() / 1000}:R>
${curscore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${curscore.max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}x | ${(curscore.accuracy * 100).toFixed(2)}% | ${grade}
\`${hitlist}\`
${pptxt}
`
            )
        }
    }

    return {
        string: scoresAsArrStr,
        fields: scoresAsFields,
        filter: filterinfo
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

export function user() { }

type scoreSort = 'pp' | 'score' | 'acc' | 'recent' | 'combo' | 'miss' | 'rank'