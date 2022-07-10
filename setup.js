const fs = require('fs')
const prompt = require("prompt-sync")();

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
        configfileblockedusers = configtest.fileblockedusers
        console.log('Config file already exists')
        return;
    } catch (error){
        console.log(error)
        console.log('Config file exists but is invalid')
    }
}
fs.writeFileSync('./configs/config.json', JSON.stringify(config, null, 2), 'utf-8')
fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: 32345 }), null, 2), 'utf-8');
fs.writeFileSync('./files/replay.osr', '', 'utf-8');
fs.mkdirSync('./debug')
fs.mkdirSync('./debugosu')
if(fs.existsSync('./debug/timesince.txt')){

} else {
    fs.writeFileSync('./debug/timesince.txt', (new Date()).toString())
}
console.log('If you don\'t want to set an option, just press enter' )
let bottoken = prompt('Bot Token: ', "null")
let botprefix = prompt('Bot Prefix: ', "sbr-")
let botosuid = prompt('osu! Client ID: ', "null")   
let botosusecret = prompt('osu! Client Secret: ', "null")
let botosuapikey = prompt('osu! API Key: ', "null")
let bottestguild = prompt('Test Guild ID: ', "null")
let botowner = prompt('Bot Owner ID: ', ['owner id', 'another owner id'])
let botgooglecx = prompt('Google CX: ', 'string')
let botgooglekey = prompt('Google Key: ', 'string')
let botfileblockedusers = prompt('Blocked User IDs: ', ['user id', 'another user id'])

let configg = {
    "token": bottoken,
    "prefix": botprefix,
    "osuClientID": botosuid,
    "osuClientSecret": botosusecret,
    "osuApiKey": botosuapikey,
    "testGuildID": bottestguild,
    "ownerusers": botowner,
    "googlecx": botgooglecx,
    "googlekey": botgooglekey,
    "fileblockedusers": botfileblockedusers
}
fs.writeFileSync('./configs/config.json', JSON.stringify(configg, null, 2), 'utf-8')