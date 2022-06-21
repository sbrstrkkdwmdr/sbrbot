const fs = require('fs')

let config = 
{
    "token": "null",
    "prefix": "sbr-",
    "osuClientID": "null",
    "osuClientSecret": "null",
    "osuApiKey": "null",
    "testGuildID": "null",
    "ownerusers": []
}
fs.writeFileSync('./configs/config.json', JSON.stringify(config, null, 2), 'utf-8')
fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: 32345 }), null, 2), 'utf-8');
fs.writeFileSync('./files/replay.osr', '', 'utf-8');
