<div align="center">

[![website](https://img.shields.io/badge/website-FFA41C?style=for-the-badge&logoColor=white)](https://sbrstrkkdwmdr.github.io/sbrbot/)</br>
[![CodeFactor](https://www.codefactor.io/repository/github/sbrstrkkdwmdr/sbrbot/badge)](https://www.codefactor.io/repository/github/sbrstrkkdwmdr/sbrbot)
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

install all dependencies with `npm i` in the main directory

in the `./config/` folder rename `tempconfig.json` to `config.json`

`config.json` should look like this:

```json
{
    "important": {
        "token": "create app and get token here => https://discord.com/developers/applications",
        "dbd_license": "ignore this",
        "redirect_uri": "http://localhost/discord/callback",
        "client_secret": "ignore this",
        "client_id": "ignore this"
    },
    "prefix": "string",
    "osuClientID": "create client here => https://osu.ppy.sh/home/account/edit#oauth",
    "osuClientSecret": "create client here => https://osu.ppy.sh/home/account/edit#oauth",
    "osuApiKey": "get api key here => https://osu.ppy.sh/home/account/edit#legacy-api",
    "ownerusers": [
        "user id",
        "user id 2"
    ],
    "google": {
        "apiKey": "tutorial below",
        "engineId": "tutorial below"
    },
    "useScreenshotParse": false,
    "LogApiCalls": true,
    "LogApiCallsToFile": true,
    "enableTracking": true,
    "storeCommandLogs": true
    "useEmojis": {
        "gamemodes": true,
        "scoreGrades": true,
        "mods": false
    }
}
```

change the values in `config.json` </br>
rename `TEMPLATE.sqlite` to `database.sqlite`</br>
check `src/consts/emojis.ts` and `src/consts/buttons.ts` and change the emojis that are formatted as <:name:ID:> (reupload to a private server that the bot is in) </br>
to get the emoji id, type the emoji then put a `\` in front of it</br>
to compile the bot the bot run `tsc` or `npm run build`</br>
to run the compiled code run `npm run run` </br>

to run the bot without checking for errors (or for other debugging purposes) use `npm run test`</br>

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

<!-- - [osu!stats api](https://github.com/respektive/osustats)</br> -->

| Usage | URL |
| --- | --- |
| Discord API Wrapper | [Discord.js](https://discord.js.org/) |
| Performance/SR calculations | [rosu-pp](https://github.com/MaxOhn/rosu-pp-js) |
| Image to text parser | [tesseract.js](https://github.com/naptha/tesseract.js) |
| Youtube search | [yt-search](https://www.npmjs.com/package/yt-search) |
| Database | [Sequelize](https://www.npmjs.com/package/sequelize) |
| Mod calculations | [osumodcalculator](https://www.npmjs.com/package/osumodcalculator) |
| Graph/chart generator | [chartjs-to-image](https://www.npmjs.com/package/chartjs-to-image) |
| osu!api | [osu! api v2](https://osu.ppy.sh/docs/index.html?javascript#introduction) |
| Api caller | [Axios](https://github.com/axios/axios) |
| Api caller | [node-fetch](https://www.npmjs.com/package/node-fetch) |
| osr handler | [osureplayparser](https://www.npmjs.com/package/osureplayparser) |
| Weather API | [open-meteo](https://open-meteo.com) |
| Tropical Weather API | [tidetech](https://docs.tidetech.org/storm-api/) |
| Country API | [REST Countries](https://restcountries.com/) |

### art credits
| Usage | Source |
| --- | --- |
| grades | [Road Rage font by Youssef Habchi](https://www.dafont.com/road-rage.font) |
| details_default button | Page select by Icons Bazaar from [Noun Project](https://thenounproject.com/icon/page-select-596992/) (CC BY 3.0) |
| page select button | Search by Oksana Latysheva from [Noun Project](https://thenounproject.com/icon/search-801015/) (CC BY 3.0) |
| random button | Dice by Arthur Shlain from [Noun Project](https://thenounproject.com/icon/dice-644924/) (CC BY 3.0) |
| map button | Map by Adrien Coquet from [Noun Project](https://thenounproject.com/icon/map-972140/) (CC BY 3.0) |
| graph button | Graph by Setyo Ari Wilbowo from [Noun Project](https://thenounproject.com/icon/graph-1059307/) (CC BY 3.0) |
| leaderboard button | leaderboard by Royyan Wijaya from [Noun Project](https://thenounproject.com/icon/leaderboard-3922525/) (CC BY 3.0) |
| time button | clock by Dong Gyu Yang from [Noun Project](https://thenounproject.com/icon/clock-6280216/) (CC BY 3.0) |
| weather button | cloud by Selot Lo from [Noun Project](https://thenounproject.com/icon/cloud-6285454/) (CC BY 3.0) |
| osu! map icons | [length](https://osu.ppy.sh/images/layout/beatmapset-page/total_length.svg) [bpm](https://osu.ppy.sh/images/layout/beatmapset-page/bpm.svg) [circles](https://osu.ppy.sh/images/layout/beatmapset-page/count_circles.svg) [sliders](https://osu.ppy.sh/images/layout/beatmapset-page/count_sliders.svg) [spinners](https://osu.ppy.sh/images/layout/beatmapset-page/count_spinners.svg) |
| world map | Equirectangular Projection SW (2011-08-15) by [Daniel R. Strebe](https://commons.wikimedia.org/wiki/User:Strebe) [wikimedia commons](https://commons.wikimedia.org/wiki/File:Equirectangular_projection_SW.jpg) [License](https://creativecommons.org/licenses/by-sa/3.0/deed.en) |
| osu! modes | xxx | 

## config properties

"useEmojis": {
"gamemodes": true,
"scoreGrades": true,
"mods": false
}


| Property | Type | Description | Default |
| --- | --- | --- | --- |
| important | object | see below | {} |
| prefix | string | a string at the start of each message to detect if a message is a command. ie `!` => `!ping` would ping the bot and `?ping` or `ping` wouldn't. | sbr- |
| osuClientID | string | the client id of an osu! api v2 app | null |
| osuClientSecret | string | the secret/token of an osu! api v2 app | null |
| osuApiKey | string | the api key used for osu api v1 (only currently used for maplb with mods) | null |
| ownerusers | string[] | an array of user ids stored as strings. users with these ids can use any command | [] |
| google | object | see below | {} |
| useScreenshotParse | boolean | enables/disables the detection of maps in screenshots. Can cause crashes due to high CPU and memory usage | false |
| LogApiCalls | boolean | enables/disables logging output to the console | true |
| LogApiCallsToFile | boolean | enables/disable console output being logged to `logs/console.log`. Still saves logs even if `LogApiCalls` is false | false |
| enableTracking | boolean | enables/disables osutrack. Users can still be added/removed but scores won't be updated. | false |
| storeCommandLogs | boolean | enables/disables logs being stored locally | false |
| useEmojis | object | see below | {} |

### important
| Property | Type | Description | Default |
| --- | --- | --- | --- |
| token | string | application token for bot to connect to discords API. </br>go to https://discord.com/developers/applications, create a new app, and create a new bot under the bot section. copy the token from there | N/A |
| dbd_license | string | ignore this property | null |
| redirect_uri | string | ignore this property | null |
| client_secret | string | ignore this property | null |
| client_id | string | ignore this property | null |
### google
| Property | Type | Description | Default |
| --- | --- | --- | --- |
| apiKey | string |  the api key of a google programmable search engine | null |
| engineId | string | the search engine id of a google programmable search engine | null |
### useEmojis
| Property | Type | Description | Default |
| --- | --- | --- | --- |
| gamemodes | boolean | enables/disables gamemodes being shown as emojis instead of text | true |
| scoreGrades | boolean | enables/disables rank letters shown as emojis instead of text | true |
| mods | boolean | enables/disables mods shown as emojis instead of text | false |