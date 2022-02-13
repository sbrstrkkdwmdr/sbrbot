/*"statistics": {
    "count_50": 9,
    "count_100": 45,
    "count_300": 324,
    "count_geki": 38,
    "count_katu": 22,
    "count_miss": 3
    },*/
    //accuracy is 0.8937007874015748
  let rs50s = 3
  let rs100s = 5
  let rs300s = 305
  let rs300max = 765
  let rs200s = 30
  let rsmiss = 7
  


  let rsnochokeacc300p = Math.floor(rs300s + rs300max);
  let rsnochokeacc300 = Math.floor(300 * rsnochokeacc300p);
  let rsnochokeacc200 = Math.floor(200 * rs200s);
  let rsnochokeacc100 = Math.floor(100 * rs100s);
  let rsnochokeacc50 = Math.floor(50 * rs50s);
  let rsnochoke300max = Math.floor(rs300max);
  let rsnochoke300num = Math.floor(rs300s);
  let rsnochoke200num = Math.floor(rs200s);
  let rsnochoke100num = Math.floor(rs100s);
  let rsnochoke50num = Math.floor(rs50s);
  let rsnochokebottom1 = Math.floor(rsnochoke300max + rsnochoke300num + rsnochoke200num + rsnochoke100num + rsnochoke50num);
  let rsnochokebottom = Math.floor(rsnochokebottom1 * 300)
  let rsnochokeacctop = Math.floor(rsnochokeacc300 + rsnochokeacc200 + rsnochokeacc100 + rsnochokeacc50)
  let rsnochokeacc1 = Math.abs(rsnochokeacctop / rsnochokebottom);
  let rsnochokeacc = Math.abs(rsnochokeacc1 * 100).toFixed(2);

  console.log(rsnochokeacc + '|' + rsnochokeacctop + '/' + rsnochokebottom)
  console.log(rsnochokeacc300p + ' | ' + rsnochokeacc300 + ' | ' + rsnochokeacc200 + ' | ' + rsnochokeacc100 + ' | ' + rsnochokeacc50)