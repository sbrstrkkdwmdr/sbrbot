const {Beatmap, Osu: {DifficultyCalculator, PerformanceCalculator}} = require('osu-bpdpc')
const request = require('request-promise-native')

request.get('https://osu.ppy.sh/osu/1262832').then(osu => {
  let beatmap = Beatmap.fromOsu(osu)
  let score = {
    maxcombo: 476,
    count50: 0,
    count100: 3,
    count300: 337,
    countMiss: 0,
    countKatu: 2,
    countGeki: 71,
    perfect: 1,
    mods: 88,
    pp: 725.814
  }
  let diffCalc = DifficultyCalculator.use(beatmap).setMods(score.mods).calculate()
  let perfCalc = PerformanceCalculator.use(diffCalc).calculate(score)
  console.log(diffCalc)
  console.log(perfCalc)
  console.log(perfCalc.totalPerformance)
})