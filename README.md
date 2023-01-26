<div align="center">

[![website](https://img.shields.io/badge/website-FFA41C?style=for-the-badge&logoColor=white)](https://sbrstrkkdwmdr.github.io/sbrbot/)</br>
![codefactor](https://www.codefactor.io/Content/badges/C.svg)
[![license](https://img.shields.io/github/license/sbrstrkkdwmdr/sbrbot?label=license)](https://github.com/sbrstrkkdwmdr/sbrbot/LICENSE)
[![stars](https://img.shields.io/github/stars/sbrstrkkdwmdr/sbrbot)](https://github.com/sbrstrkkdwmdr/sbrbot)
[![lastcommit](https://img.shields.io/github/last-commit/sbrstrkkdwmdr/sbrbot)](https://github.com/sbrstrkkdwmdr/sbrbot)
</br>

[![discordjs](https://img.shields.io/badge/DiscordJS-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/#/)
[![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://github.com/microsoft/TypeScript)
[![sequelize](https://img.shields.io/badge/Sequelize-02AFEF?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![nodejs](https://img.shields.io/badge/NodeJS-83CD29?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![chartjs](https://img.shields.io/badge/chartjs-FE777B?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

</div>

## install/setup

install nodejs (v16) [here](https://nodejs.org/en/download/)

install rust [here](https://www.rust-lang.org/tools/install)

install all dependencies with `npm i`

create a `./config/` folder and put `config.json` inside it

`config.json` should look like this:

```json
{
  "token": "create app here => https://discord.com/developers/applications",
  "prefix": "string",
  "osuClientID": "create client here => https://osu.ppy.sh/home/account/edit#oauth",
  "osuClientSecret": "create client here => https://osu.ppy.sh/home/account/edit#oauth",
  "osuApiKey": "get api key here => https://osu.ppy.sh/p/api",
  "ownerusers": ["user id"],
  "google": {
    "apiKey": "tutorial below",
    "engineId": "id_here"
  },
  "useScreenshotParse": false,
  "LogApiCalls": false,
  "LogApiCallsToFile": true,
  "enableTracking": true,
  "graphChannelId": "channel ID"
}
```

to compile the bot the bot run `tsc` or `npm run build`
to run the compiled code run `npm run run` 

to run the bot without checking for errors (or for other debugging purposes) use `npm run test`


## image search setup

go to https://cse.google.com/cse/all or https://programmablesearchengine.google.com/controlpanel/all </br>
press "Add"</br>
in "what to search" enter "www.google.com/imghp"</br>
in search settings, set enable "image search" and "search entire web"</br>
press customise </br>
copy the search engine id and paste it in the google.engineId field</br>
scroll down and press "Get Started" on "Custom Search JSON API" (limited)</br>
press "Get a Key" and create a new project </br>
copy the key and paste it into the google.apiKey field </br>

## credits n stuff

- Discord API wrapper: [Discord.js](https://discord.js.org/)</br>
- Performance/SR calculations: [rosu-pp](https://github.com/MaxOhn/rosu-pp-js)</br>
- Image to text parser: [tesseract.js](https://github.com/naptha/tesseract.js)</br>
- Youtube search: [yt-search](https://www.npmjs.com/package/yt-search)</br>
- Database: [Sequelize](https://www.npmjs.com/package/sequelize)</br>
- Mod calculations: [osumodcalculator](https://www.npmjs.com/package/osumodcalculator)</br>
- Graph/chart generator: [chartjs-to-image](https://www.npmjs.com/package/chartjs-to-image)</br>
- [osu! api v2](https://osu.ppy.sh/docs/index.html?javascript#introduction) </br>
- [osu!stats api](https://github.com/respektive/osustats)</br>
- [node-fetch](https://www.npmjs.com/package/node-fetch)</br>
- [osureplayparser](https://www.npmjs.com/package/osureplayparser)</br>


## config properties

</br></br>token: bot token. go to https://discord.com/developers/applications, create a new app, and create a new bot under the bot section. copy the token from there
</br></br>prefix: a string at the start of each message to detect if a message is a command. ie `!` => `!ping` would ping the bot and `?ping` or `ping` wouldn't.
</br></br>osuClientID: the client id of an osu! api v2 app
</br></br>osuClientSecret: the secret/token of an osu! api v2 app
</br></br>ownerusers: an array of user ids stored as strings. users with these ids can use any command
</br></br>google.apiKey: the api key of a google programmable search engine
</br></br>google.engineId: the search engine id of a google programmable search engine
</br></br>useScreenshotParse: enables/disables the detection of maps in screenshots. Can cause crashes due to high CPU and memory usage
</br></br>LogApiCalls: enables/disables logging output to the console
</br></br>LogApiCallsToFile: enables/disable console output being logged to `logs/console.log`. Still saves logs even if `LogApiCalls` is false
</br></br>enableTracking: enables/disables osutrack. Users can still be added/removed but scores won't be updated.
</br></br>graphChannelId: sends all graphs to this channel (profile rank history, map strains etc.)
