# sbrbot
just a discord bot for personal use

### features
osu! map/map leaderboard/profile/scores commands</br>
Map link, osr, profile link, score link parsing</br>
Mod logging (user, role, channel, guild, etc. updates)</br>
Rest of the commands can be found using `sbr-help` or `/help [command]`</br>

## setup
### pre requisites
[Node js v16](https://nodejs.org/en/blog/release/v16.13.0/)</br>
[osu! oauth app](https://osu.ppy.sh/home/account/edit#new-oauth-application) => New OAuth Application > set the app name as whatever and ignore the callback URL part</br>
[Discord bot app](https://discord.com/developers/applications) => follow [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)</br>
[Google search api app](https://cse.google.com/cse/all) => follow [this guide](https://cdn.discordapp.com/attachments/824898253005914112/892674375646584862/HowTo.mp4) to get the key/id

### setup
Open up any terminal in the bot's directory by clicking on the address bar, type `cmd` (powershell or any other terminal works too), then press enter</br>You should get a screen that looks like this <img src=https://cdn.discordapp.com/attachments/724514625005158403/993119861649715280/unknown.png>
</br>

First, install all the dependencies by running `npm i`</br>
Then, setup the bot by running `node setup.js`</br>
Once the bot has been setup, you can run it anytime by using `node main` or `node main.js`.</br> 
To stop the bot, use ctrl+c while the window is in focus (or you can just close it)