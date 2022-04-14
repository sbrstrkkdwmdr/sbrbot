const fs = require('fs')

let errormsg = 'oh no!\noh no!!'
let infomsg = 'info penis penis \n hhglhl\nlele'
fs.appendFileSync('info.log', infomsg)
fs.appendFileSync('error.log', errormsg)