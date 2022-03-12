module.exports = {
    name: 'help2',
    description: '',
    execute(interaction, options, guild, commands, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        let helper = options.getString('command')
        if(!helper){
        interaction.reply('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmd')}

        //client.commands.get('').execute(message, args)

        switch(helper){
            //in alphabetical order, as of the files e.g. stop is referring to musicstop which is why it's not more at the bottom
            case '1100':case 'count100':
                interaction.reply("Counts to 100.\nUsage: `sbr-1100`\nCan get stuck at 50 for a few seconds.")
                break;
            case '8ball':case 'ask':
                interaction.reply("Will reply to a question with an answer between yes and no.\nUsage: `sbr-8ball is among us a good game?`")
                break;
            case 'amoggers':
                interaction.reply("Literally just sends a pictures of amoggers.\nUsage: `sbr-amoggers`")
                break;
            case 'avatar':case 'av':case 'pfp':
                interaction.reply("Sends an embed of the mentioned user's avatar/profile picture.\nUsage: `sbr-avatar @(username)` ")
                break;
            case 'ban':
                interaction.reply("Bans the mentioned user.\nUsage: `sbr-ban @(username) did not enjoy game`\nAdditional note: requires a reason in order to be ban")
                break;
            case 'banid':
                interaction.reply("Bans the targeted user.\nUsage: `sbr-ban (user.id) did not enjoy game`\nAdditional note: requires a reason in order to ban")
                break;
            case 'botstatus':
                interaction.reply("Sets the status of the bot.\nUsage: `sbr-botstatus [n] amogus`\n[n] controls the activity type. \n 0 = watching \n 1 = playing \n 2 = streaming \n 3= listening. Fully custom statuses aren't available")
                break;
            case 'break':
                interaction.reply("Force crashes the bot.\nUsage: `sbr-(command)` \nAdditional note: it might not force a crash this command is intentionally coded bad.")
                break;
            case 'crash':
                interaction.reply("Force crashes the bot.\nUsage: `sbr-crash` \nOnly certain users can crash the bot.")
                break;
            case 'dadjoke':case 'pun':
                interaction.reply("Replies with a random dad joke.\nUsage: `sbr-dadjoke` \nThe dad jokes are limited. pls send me some so I can add them to the bot.")
                break;
            case 'danbooru':
                interaction.reply("Random danbooru image .\nUsage: `sbr-danbooru`\nNSFW channels only")
                break;                
            case 'emojify':
                interaction.reply("Converts message into emojis.\nUsage: `sbr-emojify text` Will change this to emojipasta if I figure out how")
                break;
            case 'ghostping':
                interaction.reply(":troll:.\nUsage: `sbr-ghostping @username`")
                break;
            case 'giveadmin':
                interaction.reply(":troll:.\nUsage: `sbr-giveadmin`")
                break;
            case 'gleave':case 'guildleave':case 'leaveguild':
                interaction.reply("Leaves the mentioned guild.\nUsage: `sbr-gleave [guild.id]`")
                break;
            case 'guildid':
                interaction.reply("Sends the current guild's ID.\nUsage: `sbr-guildid`")
                break;
            case 'help':
                interaction.reply("Sends the list to help commands. Can also be used to find more information on a command.\nUsage 1: `sbr-help` \nUsage 2: `sbr-help amoggers`")
                break;
            case 'hentai':case 'nhentai':
                interaction.reply("Sends an nhentai link.\nUsage: `sbr-hentai` \nNSFW channels only")
                break;
            case 'horny':
                interaction.reply("bonk.\nUsage:`sbr-horny`")
                break;
            case 'hornyjail':
                interaction.reply("bonk.\nUsage:`sbr-hornyjail @username`")
                break;
            case 'idk':
                interaction.reply("???")
                break;
            case 'image':
                interaction.reply("Sends an image using google API.\nUsage:`sbr-image [search]` \n")
                break;
            case 'image5':
                interaction.reply("Sends the top 5 images from google's api.\nUsage: `sbr-image [search]`")
                break;
            case 'info':
                interaction.reply("info.\nUsage:`sbr-info`")
                break;
            case 'insult':
                interaction.reply("Insulting.\nUsage:`sbr-insult @username`")
                break;
            case 'join':
                interaction.reply("Adds the verified role.\nUsage:`sbr-join` \nOnly works in SS.")
                break;                
            case 'kick':
                interaction.reply("Kicks the mentioned user.\nUsage:`sbr-kick @username`")
                break;
            case 'konachangen':
                interaction.reply("Random konachan image.\nUsage:`sbr-konachangen`\nNSFW channels only.")
                break;
            case 'links':
                interaction.reply("Links.\nUsage:`sbr-links`")
                break;
            case 'lolibooru':
                interaction.reply("Random Lolibooru image.\nUsage:`sbr-lolibooru`\nNSFW channels only.")
                break;
            case 'math':case 'calculate':
                interaction.reply("Calculates a math problem.\nUsage:`sbr-math add 5 5`\nArguments: `add`, `subtract`, `multiply`, `divide`, `squareroot`, `square`, `factorial`, `hcf`, `lcm`")
                break;
            case 'measureconvert':case 'convert':
                message.channels.send("Converts one measurement to another\nUsage: `sbr-convert k>c 273.15`\nUse `sbr-convert help` for more information")
                break;    
            case 'play':
                interaction.reply("Plays a song from youtube.\nUsage:`sbr-play https://youtube.com/watch?v=LINK`\n Currently only works using urls.")
                break;
            case 'queue':
                interaction.reply("Displays song queue.\nUsage:`sbr-queue`")
                break;
            case 'skip':
                interaction.reply("Skips the current song.\nUsage:`sbr-skip`")
                break;
            case 'stop':
                interaction.reply("Disconnects the bot from vc.\nUsage:`sbr-stop`")
                break;
            case 'node_modules':
                interaction.reply("A big folder that lets stuff run in nodejs. \n||Still not as big as your mum :kekw: :troll: :pepelaugh:||")
                break;
            case 'paperscissorsrock':
                interaction.reply("Plays paper scissors rock / rock paper scissors.\nUsage:`sbr-paperscissorsrock paper`")
                break;
            case 'ping':
                interaction.reply("Checks the latency/ping of the bot and API and sends back a value in ms.\nUsage:`sbr-ping`")
                break;
            case 'pingperson':
                interaction.reply("Pings someone then deletes the message.\nUsage:`sbr-pingperson @username`")
                break;
            case 'pixiv':
                interaction.reply("Random Pixiv image.\n nUsage:`sbr-pixiv`.\nNSFW channels only")
                break;
            case 'purge':
                interaction.reply("Bulk deletes a certain number of messages.\nUsage:`sbr-purge [n]`\n[n] = number of messages to delete.\nMessages over 2 weeks old cannot be deleted and may cause errors.")
                break;
            case 'refresh':
                interaction.reply("Resets the bot (commands edited or added etc.).\nUsage:`sbr-refresh`")
                break;
            case 'remind':
                interaction.reply("Sends a reminder in x time.\nUsage:`sbr-remind [t] FC yomi yori 240bpm ver.`\nTime can be in days, hours, minutes and seconds. Using multiple values (hours and minutes together) will just send instantly.")
                break;                
            case 'roll':case 'numgen':
                interaction.reply("Generates a random number. The limit is controllable by the user.\nUsage:`sbr-roll` or `sbr-roll 727`")
                break;
            case 'serverlist':case 'servers':
                interaction.reply("Lists all guilds the bot is in including IDs.\nUsage:`sbr-serverlist`")
                break;
            case 'template':
                interaction.reply("a.\nUsage:``")
                break;
            case 'test':
                interaction.reply("Tests something?\nUsage:`sbr-test`")
                break;
            case 'testlog':
                interaction.reply("")
                break;
            case 'time':
                interaction.reply("Sends the current time of whatever is hosting the bot.\nUsage:`sbr-time`")
                break;
            case 'token':
                interaction.reply("Sends the bot token (maybe???).\nUsage:`sbr-token`")
                break;
            case 'unban':
                interaction.reply("Unbans the mentioned user ID.\nUsage:`sbr-unban (user.id)`")
                break;
            case 'unchi':
                interaction.reply("unchi.\nUsage:`sbr-unchi`")
                break;
            case 'unko':
                interaction.reply("unko.\nUsage:`sbr-unko`")
                break;
            case 'unread':
                interaction.reply(":troll: \nUsage:`sbr-unread`")
                break;
            case 'WIP':
                interaction.reply("WIP.\nUsage:`sbr-WIP`")
                break;
            case 'yanderegen':
                interaction.reply("Random yande.re image.\nUsage:`sbr-yanderegen` \nNSFW channels only")
                break;
            case 'ytsearch':
                //interaction.reply("Sends the first result of a search on youtube.\nUsage:`sbr-ytsearch osus` \n")
                interaction.reply("Sends the first five results of a search on youtube. \nUsage: `sbr-ytsearch osus`\nEmbeds are disabled so the channel doesn't get filled up.")
                break;
            //case 'ytsearch5':
                //interaction.reply("Sends the first five results of a search on youtube. \nUsage: `sbr-ytsearch5 osus`\nEmbeds are disabled so the channel doesn't get filled up.")
                //break;    

            //OSUCMD
            case 'ctbrs':
                interaction.reply("Sends information about the user's most recent osu! ctb play.\nUsage:`sbr-ctbrs (ID)`")
                break;
            case 'ctbtop':
                interaction.reply("Sends information about the user's top 5 osu! ctb plays.\nUsage:`sbr-ctbtop (ID)`\nDoesn't work if there's under 5 plays\nArguments: -p (page offset)")
                break;
            case 'danser':
                interaction.reply("Sends links to danser.\nUsage: `sbr-danser`")
                break;
            case 'maniars':
                interaction.reply("Sends information about the user's most recent osu! mania play.\nUsage:`sbr-maniars (ID)`")
                break;
            case 'maniatop':
                interaction.reply("Sends information about the user's top 5 osu! mania plays.\nUsage:`sbr-maniatop (ID)`\nDoesn't work if there's under 5 plays\nArguments: -p (page offset)")
                break;
            case 'map':case 'mapinfo':
                interaction.reply("Sends information about the mentioned map.\nUsage:`sbr-map (ID)` | `sbr-map (ID) (Mods)` `sbr-map (Mods)`")
                break;
            case 'mapsearch':case 'mapget':
                interaction.reply("Sends information about the requested map.\nUsage:`sbr-mapsearch`")
                break;
            case 'osu':
                interaction.reply("Sends information about the user's osu! profile.\nUsage:`sbr-osu (username)`")
                break;
            case 'osubest': 
                interaction.reply("Sends the top 5 plays of all time.\nUsage:`sbr-osubest`")
                break;
            case 'osubestrs':
                interaction.reply("Sends the top 10 plays from the past 24h. \nUsage:`sbr-osubestrs`")
                break;
            case 'osutop':
                interaction.reply("Sends information about the user's top osu! standard 5 plays.\nUsage:`sbr-osutop (ID)`\nDoesn't work if there's under 5 plays\nArguments: -p (page offset)")
                break;
            case 'osutest':
                interaction.reply("Just whatever osu! command api thingy I'm testing.\nUsage:`sbr-osutest`")
                break;
            case 'pastmap':
                interaction.reply("Sends information about the mentioned map with modded values.\nUsage:`sbr-map (MODS)`\nKinda useless as of 2022-02-27.")
                break;
            case 'pp':
                interaction.reply("Sends the pp values for a map.\nUsage: `sbr-pp (MODS)` | `sbr-pp (MAPID)` | `sbr-pp (MAPID) (MODS)`")
                break;
            case 'rs':case 'recent':
                interaction.reply("Sends information about the user's most recent osu! play.\nUsage:`sbr-rs (ID)`\nArguments: -p (page offset)")
                break;
            case 'rsplus':
                interaction.reply("Sends information about the mentioned user's 5 most recent osu! plays.\nUsage:`sbr-rsplus @username`")
                break;
            case 'skin':
                interaction.reply("Sends the link to all skins or a specific skin. \nUsage: `sbr-skin`\nUsage 2:`sbr-skin 10`")
                break;
            case 'taikors':
                interaction.reply("Sends information about the user's most recent osu! taiko play.\nUsage:`sbr-taikors (ID)`")
                break;
            case 'taikotop':
                interaction.reply("Sends information about the user's top 5 osu! taiko plays.\nUsage:`sbr-taikotop (ID)`\nDoesn't work if there's under 5 plays")
                break;
            case 'tsfm':case 'c':
                interaction.reply("Sends the top score for a user for a map. \nUsage:`sbr-tsfm 15222484`\n`sbr-tsfm (playerid)`")
                break;

            //LINKDETECTOR
            case 'osulongmaplink':
                interaction.reply("Sends information about a linked map.\nUsage:`https://osu.ppy.sh/beatmapsets/1124121#taiko/2352956`\nthere can be other text in the message but the link must be first")
                break;
            case 'osumaplink':
                interaction.reply("Sends information about a linked map.\nUsage:`https://osu.ppy.sh/b/1545686`\nthere can be other text in the message but the link must be first")
                break;
            case 'osuprofilelink':
                interaction.reply("Sends information about the a linked osu! profile.\nUsage:`https://osu.ppy.sh/u/15222484`\nthere can be other text in the message but the link must be first")
                break;
            default:
                interaction.reply(`command "${helper}" not found`)
                interaction.reply('commands listed here - https://sbrstrkkdwmdr.github.io/sbr-web/botcmd')
        }


        console.log(`${currentDateISO} | ${currentDate}`)  
        console.log("command executed - help")
        let consoleloguserweeee = interaction.member.user
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)