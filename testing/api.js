const fetch = require('node-fetch')

let url = 'https://'

fetch(url)
.then(response => response.json)
.then(output1 => {
    let owo = output1
    console.log(owo)
})