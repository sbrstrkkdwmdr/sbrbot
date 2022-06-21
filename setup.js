const fs = require('fs')

let config = 
{
    "token": "NzU1MjIwOTg5NDk0OTUxOTk3.X2AIWw.xEf7CivYo01i9M43L4sR49VlVuc",
    "prefix": "sbr-",
    "osuClientID": "11846",
    "osuClientSecret": "upPsof8kuujr0rXDXs0eCtnrfl7iKF1j48ejCChc",
    "osuApiKey": "d084ee2ffccb5c3317a686852442aec1cb04b657",
    "testGuildID": "724514625005158400",
    "ownerusers": []
}
fs.writeFileSync('./configs/config.json', JSON.stringify(config, null, 2), 'utf-8')
fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: 32345 }), null, 2), 'utf-8');
