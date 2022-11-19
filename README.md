https://sbrstrkkdwmdr.github.io/sbrbot/

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

to run the bot just use `ts-node main.ts`</br>
to run the bot without checking for errors (or for other debugging purposes) use `ts-node-transpile-only main.ts`

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

Discord API wrapper: [Discord.js](discord.js.org/)</br>
Performance/SR calculations: [rosu](https://github.com/MaxOhn/rosu-pp-js)</br>
Fetch: [node-fetch](https://www.npmjs.com/package/node-fetch)</br>
Database: [Sequelize](https://www.npmjs.com/package/sequelize)</br>
Mod calculations: [osumodcalculator](https://www.npmjs.com/package/osumodcalculator)</br>
Image to text parser: [tesseract.js](https://github.com/naptha/tesseract.js)</br>
Youtube search: [yt-search](https://www.npmjs.com/package/yt-search)</br>
Graph/chart generator: [chartjs-to-image](https://www.npmjs.com/package/chartjs-to-image)</br>
osr file parser: [osureplayparser](https://www.npmjs.com/package/osureplayparser)</br>

## config properties

</br>token: bot token. go to https://discord.com/developers/applications, create a new app, and create a new bot under the bot section. copy the token from there
</br>prefix: a string at the start of each message to detect if a message is a command. ie `!` => `!ping` would ping the bot and `?ping` or `ping` wouldn't.
</br>osuClientID: the client id of an osu! api v2 app
</br>osuClientSecret: the secret/token of an osu! api v2 app
</br>ownerusers: an array of user ids stored as strings. users with these ids can use any command
</br>google.apiKey: the api key of a google programmable search engine
</br>google.engineId: the search engine id of a google programmable search engine
</br>useScreenshotParse: enables/disables the detection of maps in screenshots. Can cause crashes due to high CPU and memory usage
</br>LogApiCalls: enables/disables logging output to the console
</br>LogApiCallsToFile: enables/disable console output being logged to `logs/console.log`. Still saves logs even if `LogApiCalls` is false
</br>enableTracking: enables/disables osutrack. Users can still be added/removed.
</br>graphChannelId: sends all graphs to this channel (profile rank history, map strains etc.)

