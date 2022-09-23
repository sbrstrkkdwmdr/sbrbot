https://sbrstrkkdwmdr.github.io/sbrbot/

### install/setup

install rust [here](https://www.rust-lang.org/tools/install)

install all dependencies with `npm i`

create a `./config/` folder and put `config.json` inside it

`config.json` should look like this:

```json
{
  "token": "discord bot token",
  "prefix": "discord bot command prefix",
  "osuClientID": "osu api v2 client id https://osu.ppy.sh/home/account/edit#oauth",
  "osuClientSecret": "osu api v2 client secret https://osu.ppy.sh/home/account/edit#oauth",
  "osuApiKey": "osu api v1 key https://osu.ppy.sh/p/api",
  "ownerusers": ["user id 1", "user id 2"],
  "fileblockedusers": ["just leave this blank"],
  "google": {
    "apiKey": "wip",
    "cx": "wip"
  },
  "youtube": {
    "apiKey": "wip"
  },
  "twitch": {
    "clientID": "wip",
    "clientSecret": "wip"
  },
  "useScreenshotParse": false, //uses a lot of memory/cpu
  "LogApiCalls": false
}
```

to run the bot just use `ts-node main.ts`