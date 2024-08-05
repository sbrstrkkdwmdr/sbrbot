<div align="center">

[![website](https://img.shields.io/badge/website-FFA41C?style=for-the-badge&logoColor=white)](https://sbrstrkkdwmdr.github.io/sbrbot/)</br>
[![CodeFactor](https://www.codefactor.io/repository/github/sbrstrkkdwmdr/sbrbot/badge)](https://www.codefactor.io/repository/github/sbrstrkkdwmdr/sbrbot)
[![license](https://img.shields.io/github/license/sbrstrkkdwmdr/sbrbot?label=license)](https://github.com/sbrstrkkdwmdr/sbrbot/LICENSE)
[![stars](https://img.shields.io/github/stars/sbrstrkkdwmdr/sbrbot)](https://github.com/sbrstrkkdwmdr/sbrbot)
[![lastcommit](https://img.shields.io/github/last-commit/sbrstrkkdwmdr/sbrbot)](https://github.com/sbrstrkkdwmdr/sbrbot)</br>
[![changelog](https://img.shields.io/badge/Changelog-34A0DB)](https://github.com/sbrstrkkdwmdr/sbrbot/blob/main/changelog/changelog.md)
[![credits](https://img.shields.io/badge/Credits-AEDD35)](https://github.com/sbrstrkkdwmdr/sbrbot/blob/main/CREDITS.md)
[![todo](https://img.shields.io/badge/To_Do_List-E05735)](https://github.com/sbrstrkkdwmdr/sbrbot/blob/main/changelog/todo.md)</br>

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
    "osuClientID": "create client here => https://osu.ppy.sh/home/account/edit#oauth",
    "osuClientSecret": "create client here => https://osu.ppy.sh/home/account/edit#oauth",
    "osuApiKey": "get api key here => https://osu.ppy.sh/home/account/edit#legacy-api"
  },
  "prefix": "string",
  "ownerusers": ["user id", "user id 2"],
  "google": {
    "apiKey": "tutorial below",
    "engineId": "tutorial below"
  },
  "useScreenshotParse": false,
  "LogApiCalls": true,
  "LogApiCallsToFile": true,
  "enableTracking": true,
  "storeCommandLogs": true,
  "useEmojis": {
    "gamemodes": true,
    "scoreGrades": true,
    "mods": false
  }
}
```

change the values in `config.json` </br>
rename `TEMPLATE.sqlite` to `database.sqlite`</br>
check `src/consts/emojis.ts` and `src/consts/buttons.ts` and change the emojis that are formatted as <:name:ID:> (reupload\* to a private server that the bot is in) </br>
emoji images are found under `./files/img/emojis/`
to get the emoji id, type the emoji then put a `\` in front of it</br>
to compile the bot the bot run `tsc` or `npm run build`</br>
to run the compiled code run `npm run run` </br>

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

## required permissions

disabling these permissions will disable the commands listed

| Permission     | Usage                                                     | Affected Commands         |
| -------------- | --------------------------------------------------------- | ------------------------- |
| EmbedLinks     | Most commands display information via the use of _embeds_ | All commands              |
| AddReactions   | The poll/vote command requires reactions for voting       | poll                      |
| ManageMessages | To bulk delete messages                                   | purge                     |
| Administrator  | To access certain data                                    | checkperms, get, userinfo |

## credits

see [here](https://github.com/sbrstrkkdwmdr/sbrbot/CREDITS.md)

## config properties

| Property           | Type     | Description                                                                                                                                     | Default |
| ------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| important          | object   | see below                                                                                                                                       | {}      |
| prefix             | string   | a string at the start of each message to detect if a message is a command. ie `!` => `!ping` would ping the bot and `?ping` or `ping` wouldn't. | sbr-    |
| ownerusers         | string[] | an array of user ids stored as strings. users with these ids can use any command                                                                | []      |
| google             | object   | see below                                                                                                                                       | {}      |
| useScreenshotParse | boolean  | enables/disables the detection of maps in screenshots. Can cause crashes due to high CPU and memory usage                                       | false   |
| LogApiCalls        | boolean  | enables/disables logging output to the console                                                                                                  | true    |
| LogApiCallsToFile  | boolean  | enables/disable console output being logged to `logs/console.log`. Still saves logs even if `LogApiCalls` is false                              | false   |
| enableTracking     | boolean  | enables/disables osutrack. Users can still be added/removed but scores won't be updated.                                                        | false   |
| storeCommandLogs   | boolean  | enables/disables logs being stored locally                                                                                                      | false   |
| useEmojis          | object   | see below                                                                                                                                       | {}      |
| tenorKey           | string   | see [here](https://developers.google.com/tenor/guides/quickstart) (same steps as google api key)                                                | null    |

### important

| Property        | Type   | Description                                                                                                                                                                                           | Default |
| --------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| token           | string | application token for bot to connect to discords API. </br>go to https://discord.com/developers/applications, create a new app, and create a new bot under the bot section. copy the token from there | N/A     |
| osuClientID     | string | the client id of an osu! api v2 app                                                                                                                                                                   | null    |
| osuClientSecret | string | the secret/token of an osu! api v2 app                                                                                                                                                                | null    |
| osuApiKey       | string | the api key used for osu api v1 (only currently used for maplb with mods)                                                                                                                             | null    |

### google

| Property | Type   | Description                                                 | Default |
| -------- | ------ | ----------------------------------------------------------- | ------- |
| apiKey   | string | the api key of a google programmable search engine          | null    |
| engineId | string | the search engine id of a google programmable search engine | null    |

### useEmojis

| Property    | Type    | Description                                                      | Default |
| ----------- | ------- | ---------------------------------------------------------------- | ------- |
| gamemodes   | boolean | enables/disables gamemodes being shown as emojis instead of text | true    |
| scoreGrades | boolean | enables/disables rank letters shown as emojis instead of text    | true    |
| mods        | boolean | enables/disables mods shown as emojis instead of text            | false   |
