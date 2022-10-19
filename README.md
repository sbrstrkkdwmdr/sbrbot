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
  "prefix": "sbr-",
  "osuClientID": "create client here => https://osu.ppy.sh/home/account/edit#oauth",
  "osuClientSecret": "create client here => https://osu.ppy.sh/home/account/edit#oauth",
  "osuApiKey": "get api key here => https://osu.ppy.sh/p/api",
  "ownerusers": ["user id"],
  "google": {
    "apiKey": "tutorial below",
    "cx": "e"
  },
  "useScreenshotParse": false,
  "LogApiCalls": false
}
```

to run the bot just use `ts-node main.ts`


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
