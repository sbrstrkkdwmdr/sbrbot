module.exports = {
    name: 'help',
    description: '',
    execute(message, args, currentDate, currentDateISO) {

        let helper = args[0]
        if(!helper){
        message.channel.send('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmd')}
        else{
        switch(helper){
            //in alphabetical order, as of the files e.g. stop is referring to musicstop which is why it's not more at the bottom
            case '1100':case 'count100':
                message.channel.send("Counts to 100.\nUsage: `sbr-1100`\nCan get stuck at 50 for a few seconds.")
                break;
            case '8ball':case 'ask':
                message.channel.send("Will reply to a question with an answer between yes and no.\nUsage: `sbr-8ball is among us a good game?`")
                break;
            case 'amoggers':
                message.channel.send("Literally just sends a pictures of amoggers.\nUsage: `sbr-amoggers`")
                break;
            case 'avatar':case 'av':case 'pfp':
                message.channel.send("Sends an embed of the mentioned user's avatar/profile picture.\nUsage: `sbr-avatar @(username)` ")
                break;
            case 'ban':
                message.channel.send("Bans the mentioned user.\nUsage: `sbr-ban @(username) did not enjoy game`\nAdditional note: requires a reason in order to be ban")
                break;
            case 'banid':
                message.channel.send("Bans the targeted user.\nUsage: `sbr-ban (user.id) did not enjoy game`\nAdditional note: requires a reason in order to ban")
                break;
            case 'botstatus':
                message.channel.send("Sets the status of the bot.\nUsage: `sbr-botstatus [n] amogus`\n[n] controls the activity type. \n 0 = watching \n 1 = playing \n 2 = streaming \n 3= listening. Fully custom statuses aren't available")
                break;
            case 'break':
                message.channel.send("Force crashes the bot.\nUsage: `sbr-(command)` \nAdditional note: it might not force a crash this command is intentionally coded bad.")
                break;
            case 'crash':
                message.channel.send("Force crashes the bot.\nUsage: `sbr-crash` \nOnly certain users can crash the bot.")
                break;
            case 'dadjoke':case 'pun':
                message.channel.send("Replies with a random dad joke.\nUsage: `sbr-dadjoke` \nThe dad jokes are limited. pls send me some so I can add them to the bot.")
                break;
            case 'danbooru':
                message.channel.send("Random danbooru image .\nUsage: `sbr-danbooru`\nNSFW channels only")
                break;                
            case 'danser':
                message.channel.send("Sends links to danser.\nUsage: `sbr-danser`")
                break;
            case 'emojify':
                message.channel.send("Converts message into emojis.\nUsage: `sbr-emojify text` Will change this to emojipasta if I figure out how")
                break;
            case 'ghostping':
                message.channel.send(":troll:.\nUsage: `sbr-ghostping @username`")
                break;
            case 'giveadmin':
                message.channel.send(":troll:.\nUsage: `sbr-giveadmin`")
                break;
            case 'gleave':case 'guildleave':case 'leaveguild':
                message.channel.send("Leaves the mentioned guild.\nUsage: `sbr-gleave [guild.id]`")
                break;
            case 'guildid':
                message.channel.send("Sends the current guild's ID.\nUsage: `sbr-guildid`")
                break;
            case 'help':
                message.channel.send("Sends the list to help commands. Can also be used to find more information on a command.\nUsage 1: `sbr-help` \nUsage 2: `sbr-help amoggers`")
                break;
            case 'hentai':case 'nhentai':
                message.channel.send("Sends an nhentai link.\nUsage: `sbr-hentai` \nNSFW channels only")
                break;
            case 'horny':
                message.channel.send("bonk.\nUsage:`sbr-horny`")
                break;
            case 'hornyjail':
                message.channel.send("bonk.\nUsage:`sbr-hornyjail @username`")
                break;
            case 'idk':
                message.channel.send("???")
                break;
            case 'image':
                message.channel.send("Sends an image using google API.\nUsage:`sbr-image [search]` \n")
                break;
            case 'image5':
                message.channel.send("Sends the top 5 images from google's api.\nUsage: `sbr-image [search]`")
                break;
            case 'info':
                message.channel.send("info.\nUsage:`sbr-info`")
                break;
            case 'insult':
                message.channel.send("Insulting.\nUsage:`sbr-insult @username`")
                break;
            case 'join':
                message.channel.send("Adds the verified role.\nUsage:`sbr-join` \nOnly works in SS.")
                break;                
            case 'kick':
                message.channel.send("Kicks the mentioned user.\nUsage:`sbr-kick @username`")
                break;
            case 'konachangen':
                message.channel.send("Random konachan image.\nUsage:`sbr-konachangen`\nNSFW channels only.")
                break;
            case 'links':
                message.channel.send("Links.\nUsage:`sbr-links`")
                break;
            case 'lolibooru':
                message.channel.send("Random Lolibooru image.\nUsage:`sbr-lolibooru`\nNSFW channels only.")
                break;
            case 'map':case 'mapinfo':
                message.channel.send("Sends information about the mentioned map.\nUsage:`sbr-map (ID)`")
                break;
            case 'mapsearch':case 'mapget':
                message.channel.send("Sends information about the requested map.\nUsage:`sbr-mapsearch`")
                break;
            case 'math':case 'calculate':
                message.channel.send("Calculates a math problem.\nUsage:`sbr-math add 5 5`\nArguments: `add`, `subtract`, `multiply`, `divide`, `squareroot`, `square`, `factorial`, `hcf`, `lcm`")
                break;
            case 'play':
                message.channel.send("Plays a song from youtube.\nUsage:`sbr-play https://youtube.com/watch?v=LINK`\n Currently only works using urls.")
                break;
            case 'queue':
                message.channel.send("Displays song queue.\nUsage:`sbr-queue`")
                break;
            case 'skip':
                message.channel.send("Skips the current song.\nUsage:`sbr-skip`")
                break;
            case 'stop':
                message.channel.send("Disconnects the bot from vc.\nUsage:`sbr-stop`")
                break;
            case 'node_modules':
                message.channel.send("A big folder that lets stuff run in nodejs. \n||Still not as big as your mum :kekw: :troll: :pepelaugh:||")
                break;
            case 'osu':
                message.channel.send("Sends information about the user's osu! profile.\nUsage:`sbr-osu (username)`")
                break;
            case 'osubest': 
                message.channel.send("Sends the top 5 plays of all time.\nUsage:`sbr-osubest`")
                break;
            case 'osubestrs':
                message.channel.send("Sends the top 10 plays from the past 24h. \nUsage:`sbr-osubestrs`")
                break;
            case 'osutop':
                message.channel.send("Sends information about the user's osu! top plays.\nUsage:`sbr-osutop (ID)`")
                break;
            case 'osutest':
                message.channel.send("Just whatever osu! command api thingy I'm testing.\nUsage:`sbr-osutest`")
                break;
            case 'ping':
                message.channel.send("Checks the latency/ping of the bot and API and sends back a value in ms.\nUsage:`sbr-ping`")
                break;
            case 'pingperson':
                message.channel.send("Pings someone then deletes the message.\nUsage:`sbr-pingperson @username`")
                break;
            case 'pixiv':
                message.channel.send("Random Pixiv image.\n nUsage:`sbr-pixiv`.\nNSFW channels only")
                break;
            case 'purge':
                message.channel.send("Bulk deletes a certain number of messages.\nUsage:`sbr-purge [n]`\n[n] = number of messages to delete.\nMessages over 2 weeks old cannot be deleted and may cause errors.")
                break;
            case 'refresh':
                message.channel.send("Resets the bot (commands edited or added etc.).\nUsage:`sbr-refresh`")
                break;
            case 'remind':
                message.channel.send("Sends a reminder in x time.\nUsage:`sbr-remind [t] FC yomi yori 240bpm ver.`\nTime can be in days, hours, minutes and seconds. Using multiple values (hours and minutes together) will just send instantly.")
                break;                
            case 'roll':case 'numgen':
                message.channel.send("Generates a random number. The limit is controllable by the user.\nUsage:`sbr-roll` or `sbr-roll 727`")
                break;
            case 'rs':case 'recent':
                message.channel.send("Sends information about the user's most recent osu! play.\nUsage:`sbr-rs (ID)`")
                break;
            case 'rsplus':
                message.channel.send("Sends information about the mentioned user's 5 most recent osu! plays.\nUsage:`sbr-rsplus @username`")
                break;
            case 'serverlist':case 'servers':
                message.channel.send("Lists all guilds the bot is in including IDs.\nUsage:`sbr-serverlist`")
                break;
            case 'skin':
                message.channel.send("Sends the link to all skins or a specific skin. \nUsage: `sbr-skin`\nUsage 2:`sbr-skin 10`")
                break;
            case 'template':
                message.channel.send("a.\nUsage:``")
                break;
            case 'test':
                message.channel.send("Tests something?\nUsage:`sbr-test`")
                break;
            case 'testlog':
                message.channel.send("")
                break;
            case 'time':
                message.channel.send("Sends the current time of whatever is hosting the bot.\nUsage:`sbr-time`")
                break;
            case 'token':
                message.channel.send("Sends the bot token (maybe???).\nUsage:`sbr-token`")
                break;
            case 'tsfm':case 'c':
                message.channel.send("Sends the top score for a user for a map. \nUsage:`sbr-tsfm 15222484 1186443`\n`sbr-tsfm (playerid) (beatmap id)`")
                break;
            case 'unban':
                message.channel.send("Unbans the mentioned user ID.\nUsage:`sbr-unban (user.id)`")
                break;
            case 'unchi':
                message.channel.send("unchi.\nUsage:`sbr-unchi`")
                break;
            case 'unko':
                message.channel.send("unko.\nUsage:`sbr-unko`")
                break;
            case 'unread':
                message.channel.send(":troll: \nUsage:`sbr-unread`")
                break;
            case 'WIP':
                message.channel.send("WIP.\nUsage:`sbr-WIP`")
                break;
            case 'yanderegen':
                message.channel.send("Random yande.re image.\nUsage:`sbr-yanderegen` \nNSFW channels only")
                break;
            case 'ytsearch':
                //message.channel.send("Sends the first result of a search on youtube.\nUsage:`sbr-ytsearch osus` \n")
                message.channel.send("Sends the first five results of a search on youtube. \nUsage: `sbr-ytsearch osus`\nEmbeds are disabled so the channel doesn't get filled up.")
                break;
            //case 'ytsearch5':
                //message.channel.send("Sends the first five results of a search on youtube. \nUsage: `sbr-ytsearch5 osus`\nEmbeds are disabled so the channel doesn't get filled up.")
                //break;    
            default:
                message.channel.send(`command "${helper}" not found`)
                message.channel.send('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmd')
        }}


        console.log(`${currentDateISO} | ${currentDate}`)  
        console.log("command executed - help")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)