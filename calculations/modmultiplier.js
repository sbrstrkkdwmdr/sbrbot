const { fixtoundertwo } = require("./other.js");
/**
 *
 * @param {number} cs circle size
 * @param {number} ar approach rate
 * @param {number} od overall difficulty
 * @param {number} hp hp
 * @returns an array containing values if the hardrock mod is applied
 */
function hardrockmult(cs, ar, od, hp) {
  hardrockcs = fixtoundertwo(cs * 1.3);
  hardrockar = fixtoundertwo(ar * 1.4);
  hardrockod = fixtoundertwo(od * 1.4);
  hardrockhp = fixtoundertwo(hp * 1.4);
  let hardrockobject = [
    {
      oldCS: cs,
      oldAR: ar,
      oldOD: od,
      oldHP: hp,
    },
    {
      cs: hardrockcs,
      ar: hardrockar,
      od: hardrockod,
      hp: hardrockhp,
    },
  ];

  return hardrockobject;
}
/**
 *
 * @param {number} cs circle size
 * @param {number} ar approach rate
 * @param {number} od overall difficulty
 * @param {number} hp hp
 * @returns an array containing values if the easy mod is applied
 */
function easymult(cs, ar, od, hp) {
  easycs = fixtoundertwo(cs / 2);
  easyar = fixtoundertwo(ar / 2);
  easyod = fixtoundertwo(od / 2);
  easyhp = fixtoundertwo(hp / 2);
  let easyobject = [
    {
      oldCS: cs,
      oldAR: ar,
      oldOD: od,
      oldHP: hp,
    },
    {
      cs: easycs,
      ar: easyar,
      od: easyod,
      hp: easyhp,
    },
  ];

  return easyobject;
}
module.exports = { hardrockmult, easymult };
