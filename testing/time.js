const ms = require('ms')
let time = ('10d 3m 3h').split(/ +/);
let totaltime = 0
for(let i = 0; i < time.length; i++){
    totaltime += ms(time[i])
}
console.log(totaltime)