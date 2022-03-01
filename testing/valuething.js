let json = [{
    "thing": 5,
},
{"thing": 5,},
{"thing": 5,},
{"thing": 6,},
{"thing": "l;kfjlsjskldfsdlkjfsdf",},
{"thing": 5},
{"thing": 5}
]

var counter = 0;

for (var i = 0; i < json.length; i++) {
   if (json[i].thing === 5) {
      counter++;
   }
}
console.log(counter)
/*
var trycount = 0;
for (var i = 0; i < rsdata.beatmap.id.length; i++) {
    if (rsdata[i].beatmap.id === rsmapid) {
        trycount++;
    }
    }
    console.log(trycount)
 */