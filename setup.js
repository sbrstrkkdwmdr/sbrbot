const fs = require('fs')

let config = 
{
    "token": "null",
    "prefix": "sbr-",
    "osuClientID": "null",
    "osuClientSecret": "null",
    "osuApiKey": "null",
    "testGuildID": "null",
    "ownerusers": [], //add your ID to the array to access admin commands
    "googlecx": "null", //https://cdn.discordapp.com/attachments/824898253005914112/892674375646584862/HowTo.mp4 to get it
    "googlekey": "null", //https://cdn.discordapp.com/attachments/824898253005914112/892674375646584862/HowTo.mp4 to get it
    "fileblockedusers": [] // add user id here to auto-delete any audio, videos or images they send
}
if (fs.existsSync('./configs/config.json')){
    try {
        let configtest = JSON.parse(fs.readFileSync('./configs/config.json', 'utf-8'))
        configtoken = configtest.token 
        configprefix = configtest.prefix
        configosuid = configtest.osuClientID
        configosusecret = configtest.osuClientSecret
        configosuapikey = configtest.osuApiKey
        configtestguild = configtest.testGuildID
        configowner = configtest.ownerusers
        configgooglecx = configtest.googlecx
        configgooglekey = configtest.googlekey
        console.log('Config file already exists')
        return;
    } catch (error){

    }
}
fs.writeFileSync('./configs/config.json', JSON.stringify(config, null, 2), 'utf-8')
fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: 32345 }), null, 2), 'utf-8');
fs.writeFileSync('./files/replay.osr', '', 'utf-8');
