const fs = require('fs');

fs.readFile('testing\\arrayconvert.txt', function(err, data) {
    if(err) throw err;

    const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
    console.log(arr)
    for(let i of arr) {
        console.log(i);
    }
});