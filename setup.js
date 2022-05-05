const fs = require('fs')
const prompt = require("prompt-sync")();
console.log("Setting up config file...")
console.log("If you don't want to set an option, just put 'null' or press enter")

prefix = prompt("Prefix  | insert some string like ! or -. you can set the prefix to penis if you want) |=>", "null");
console.log("")
token = prompt("Bot token  | https://discord.com/developers/applications create an application, go to bot, create bot and copy the token) |=>", "null")
console.log("")
googlecx = prompt("Google cx  |  https://cdn.discordapp.com/attachments/824898253005914112/892674375646584862/HowTo.mp4 to get it |=>", "null")
console.log("")
googlekey = prompt("Google key |  https://cdn.discordapp.com/attachments/824898253005914112/892674375646584862/HowTo.mp4 to get it |=>", "null")
console.log("")
oapi = prompt("osu! api key |  grab it from https://osu.ppy.sh/p/api | just put anything as the name and url |=>", "null");
console.log("")
oclientid = prompt("osu! client ID | In osu! profile settings, create an OAuth application and just set the name to whatever | copy the ID here |=>", "null");
console.log("")
oclientsecret = prompt("osu! client secret | In osu! profile settings, create an OAuth application and just set the name to whatever | copy the client secret here |=>", "null");
console.log("")
joinroll = prompt("Server verified role | Server settings > Roles > 3 dots >copy ID |=>", "null");
console.log("")
mainguildid = prompt("Server ID | Right click on server > copy ID |=>", "null");
console.log("")
logchnl = prompt("Channel to send logs to | Right click on channel > copy ID |=>", "null");
console.log("")
danserpath = prompt("path to Danser | Double click on the address bar on the top and ctrl c |=>", "null");
console.log("")
recordchannel = prompt("recording channel | Right click on channel > copy ID |=>", "null");
console.log("")
testguildid = prompt("testguild ID |=>", "null");
console.log("")
haloapikey = prompt("token for https://autocode.com/lib/halo/infinite/ |  Go to https://autocode.com/lib/halo/infinite/, press Link and Authenticate, then copy Secret Token |=>", "null")
console.log("")
let template = {
    "prefix": prefix,
    "token": token,
    "cx": googlecx,
    "key": googlekey,
    "osuapikey": oapi,
    "osuauthtoken": "just-leave-this-blank-the-commands-generate-these-itself",
    "osuclientid": oclientid,
    "osuclientsecret": oclientsecret,
    "joinrole": joinroll,
    "guildid": mainguildid,
    "loggingchannel": logchnl,
    "trnkey": "unused atm",
    "danserpath": danserpath,
    "recordingchannel": recordchannel,
    "testguild": testguildid,
    "haloapikey": haloapikey
}

fs.writeFileSync("config.json", JSON.stringify(template, null, 2))
/*
let template = {
    "prefix": "insert some string like ! or -. you can set the prefix to penis if you want",
    "token": "https://discord.com/developers/applications create an application, go to bot, create bot and copy the token",
    "cx": "googleapicxkey from https://cdn.discordapp.com/attachments/824898253005914112/892674375646584862/HowTo.mp4",
    "key": "https://cdn.discordapp.com/attachments/824898253005914112/892674375646584862/HowTo.mp4",
    "osuapikey": "https://osu.ppy.sh/p/api", 
    "osuauthtoken": "just-leave-this-blank-the-commands-generate-these-itself",
    "osuclientid": "https://osu.ppy.sh/docs/index.html?javascript#api-versions",
    "osuclientsecret": "https://osu.ppy.sh/docs/index.html?javascript#api-versions",
    "joinrole": "role-to-add-for-join-command",
    "guildid": "id-for-main-guild",
    "loggingchannel": "id for channel to log to (right click on the channel, press copy id and paste it here)",
    "trnkey": "unused atm",
    "danserpath": "path to danser (e.g.)",
    "testguild": "id-for-guild-for-testing-stuff(right click on the server, press copy id and paste id here)",
    "haloapikey": "api key for https://autocode.com/lib/halo/infinite/"
}

fs.writeFileSync("config.json", JSON.stringify(template, null, 2))
*/