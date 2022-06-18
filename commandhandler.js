module.exports = (userdatatags, client, Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, monitorEventLoopDelay, setInterval) => {
    const get = require('node-fetch');
    const { prefix } = require('./config.json')

    const fs = require('fs');


    const oncooldown = new Set();

    client.on('messageCreate', message => {

        const args = message.content.slice(prefix.length).split(/ +/); //args are the message content but without the prefix
        const linkargs = message.content.split(/ +/); //linkargs are the message content
        const command = args.shift().toLowerCase(); //grabs command


        let consoleloguserweeee = message.author
        let currentDate = new Date();
        let currentDateISO = new Date().toISOString();
        let currentDateForSomeApiThing = new Date().toISOString().slice(0, 10);
        let timeStamp = new Date().getTime();
        let curdateyesterdaytimestamp = timeStamp - 24 * 60 * 60 * 1000;
        let curdateyesterday = new Date(curdateyesterdaytimestamp).toISOString().slice(0, 10);
        let curdatetmrtimestamp = timeStamp + 24 * 60 * 60 * 1000;
        let curdatetmr = new Date(curdatetmrtimestamp).toISOString().slice(0, 10);
        let split = new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/);
        let curtimezone = split[split.length - 1]

        if (!message.content.startsWith(prefix)) return; //the return is so if its just prefix nothing happens
        if (message.author.bot && message.content.includes("You're on cooldown")) {
            setTimeout(() => {
                message.delete();
            }, 1)
        }
        if (message.author.bot && !message.author.id == '755220989494951997') return;
        if (oncooldown.has(message.author.id)) {
            return message.channel.send(`You're on cooldown\nTime left: ${getTimeLeft(timeouttime)}ms (this is definitely the wrong number)`)
        };

        if (!oncooldown.has(message.author.id)) {
            oncooldown.add(message.author.id);
            setTimeout(() => {
                oncooldown.delete(message.author.id)
            }, 3000)
            timeouttime = setTimeout(() => { }, 3000)
        }
        function getTimeLeft(timeout) {
            return Math.ceil((timeout._idleStart + timeout._idleTimeout) / 1000);
        }
        switch (command) //variable to check for
        {

            case 'testingtypescript':
                client.commands.get('testingtypescript').execute(message, args, currentDate, currentDateISO)
                break;

            case 'test': //if command = 'test' blahblablah
                client.commands.get('test').execute(client, message, args, currentDate, currentDateISO)
                break;

            /*  case 'replay':
                client.linkdetect.get('replayparse').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret);
                break;
        */
            //HELPFUL ---------------------------------------

            case 'ping':
                client.helpcmds.get('ping').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;
            case 'links':
                client.helpcmds.get('links').execute(message, args, currentDate, currentDateISO)
                break;

            case 'help':
                //client.helpcmds.get('help').execute(message, args, currentDate, currentDateISO)
                client.helpcmds.get('helpalt').execute(message, args, client, currentDate, currentDateISO)
                break;

            case 'info':
                client.helpcmds.get('info').execute(message, args, currentDate, currentDateISO)
                break;

            case 'math': case 'calculate':
                client.helpcmds.get('math').execute(message, args, Discord, currentDate, currentDateISO)
                break;

            case 'measureconvert': case 'convert':
                client.helpcmds.get('measureconvert').execute(message, args, Discord, currentDate, currentDateISO)
                break;


            case 'recordhelp':
                client.linkdetect.get('replayrecordhelp').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;
            //UNCATEGORISED -----GENERAL?-------------------------------------------------
            case 'avatar': case 'av': case 'pfp':
                client.commands.get('avatar').execute(message, args, Discord, currentDate, currentDateISO)
                break;
            case 'roll': case 'numgen':
                client.commands.get('roll').execute(message, args, currentDate, currentDateISO)
                break;


            case 'image':
                client.commands.get('image').execute(message, args, Discord, get, client, currentDate, currentDateISO)
                //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
                break;

            case 'image5':
                client.commands.get('image5').execute(message, args, Discord, get, client, currentDate, currentDateISO)
                break;

            case 'ytsearch':
                client.commands.get('ytsearch').execute(message, args, client, Discord, currentDate, currentDateISO)
                //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
                break;

            /*case 'ytsearch5':
            client.commands.get('ytsearch5').execute(message, args, Discord, client, currentDate, currentDateISO)
            break;*/

            case 'active':
                client.commands.get('active').execute(message, args, Discord, currentDate, currentDateISO)
                break;
            //FUN --------------------------------------------------------------------


            case '8ball': case 'ask':
                client.commands.get('8ball').execute(message, args, currentDate, currentDateISO)
                break;

            case 'dadjoke': case 'pun':
                client.commands.get('dadjoke').execute(message, args, currentDate, currentDateISO)
                break;

            case 'time':
                client.commands.get('time').execute(message, args, Discord, currentDate, currentDateISO)
                break;

            case 'amoggers':
                client.commands.get('amoggers').execute(message, args, Discord, currentDate, currentDateISO)
                break;

            case 'say':
                client.commands.get('say').execute(owners, message, args, currentDate, currentDateISO)
                break;

            case 'sayto':
                client.commands.get('sayto').execute(owners, client, message, args, currentDate, currentDateISO)
                break;

            case 'paperscissorsrock': case 'rockpaperscissors': case 'psr': case 'scissorsrockpaper':
                client.commands.get('psr').execute(message, args, currentDate, currentDateISO)
                break;

            case 'owoify':
                client.commands.get('owoify').execute(message, args, currentDate, currentDateISO)
                break;

            case 'randommsg':
                client.commands.get('randommsg').execute(message, args, currentDate, currentDateISO)
                break;
            case 'addmsg':
                client.commands.get('addmsg').execute(message, args, currentDate, currentDateISO)
                break;
            case 'gif':
                client.commands.get('gif').execute(message, args, currentDate, currentDateISO)
                break;
            //SBR ONLY --------------------------------------------------------
            case 'testlog':
                client.commands.get('testlog').execute(message, args, currentDate, currentDateISO)
                break;
            case 'join':
                client.commands.get('join').execute(message, args, currentDate, currentDateISO)
                break;

            //OSU -----------------------------------------------------------

            case 'rs':
                client.altosucmds.get('rs').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;
            case 'osutop':
                client.altosucmds.get('osutop').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;

            case 'osu':
                client.altosucmds.get('osu').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,)
                break;

            case 'osugraph':
                client.altosucmds.get('osugraph').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;

            case 'osubest':
                client.altosucmds.get('osubest').execute(message, args, Discord, currentDate, currentDateISO)
                break;

            case 'osubestrs':
                client.altosucmds.get('osubestrs').execute(message, args, Discord, currentDate, currentDateISO, curdateyesterday, curdatetmr, curtimezone)
                break;

            case 'tsfm': case 'c':case 'scores':
                client.altosucmds.get('scores').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;

            case 'osuauth':
                client.altosucmds.get('osuauth').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;

            case 'osusave': case 'osuset':
                client.altosucmds.get('osuset').execute(userdatatags, message, args, Discord, currentDate, currentDateISO)
                break;
            case 'leaderboard': case 'lb':
                client.altosucmds.get('leaderboard').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;
            /*
                case 'maniars':case 'maniarecent':case 'rsmania':case 'recentmania':
                    client.altosucmds.get('maniars').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                    break;
                case 'maniatop':case 'topmania':
                    client.altosucmds.get('maniatop').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                    break;
            
                case 'taikors':case 'taikorecent':case 'rstaiko':case 'recenttaiko':
                    client.altosucmds.get('taikors').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                    break;
                case 'taikotop':case 'toptaiko':
                    client.altosucmds.get('taikotop').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                    break;
                    
                case 'ctbrs':case 'ctbrecent':case 'rsctb':case 'recentctb':
                    client.altosucmds.get('ctbrs').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                    break;
                case 'ctbtop':case 'topctb':
                    client.altosucmds.get('ctbtop').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                    break;*/

            case 'pp':
                client.altosucmds.get('pp').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;

            case 'map':
                client.altosucmds.get('map').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;
            case 'mapsearch':
                client.altosucmds.get('mapsearch').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;

            case 'skin':
                client.altosucmds.get('skin').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
                break;

            case 'ctbrs': case 'ctbtop': case 'maniars': case 'maniatop': case 'map': case 'osutop': case 'rs': case 'skin': case 'taikors': case 'taikotop':
                message.reply('use the / command (/rs mode:mode /osutop mode:mode)')
                break;

            //ADMIN-----------------------------------------------------------------------------------------
            case 'purge':
                client.admincmds.get('purge').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;

            case 'unban':
                client.admincmds.get('unban').execute(message, args, currentDate, currentDateISO)
                break;

            case 'break時ｗｗｗワロト':
                client.admincmds.get('break').execute(message, args, currentDate, currentDateISO)
                break;

            case 'crash':
                client.admincmds.get('crash').execute(message, args, currentDate, currentDateISO)
                break;

            case 'ban':
                client.admincmds.get('ban').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;

            case 'kick':
                client.admincmds.get('kick').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;
            /*
            case 'serverlist':case 'servers':
                client.admincmds.get('serverlist').execute(message, args, Discord, client, currentDate, currentDateISO)
                break;
        
            case 'gleave':case 'guildleave':case 'leaveguild':
                client.admincmds.get('gleave').execute(message, args, client, currentDate, currentDateISO)
                break;*/

            case 'guildid':
                client.admincmds.get('guildid').execute(message, args, currentDate, currentDateISO)
                break;

            case 'remind':
                client.commands.get('remind').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;

            case 'banid':
                client.admincmds.get('banid').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;

            case 'botstatus':
                client.admincmds.get('botstatus').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;
            case 'refresh':
                client.admincmds.get('refresh').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;

            case 'auto':
                client.admincmds.get('auto').execute(message, args, currentDate, currentDateISO)
                break;
            case 'infodb':
                client.commands.get('infodb').execute(message, args, Discord, currentDate, currentDateISO)
                break;
            case 'debug':
                client.admincmds.get('debug').execute(message, args, Discord, currentDate, currentDateISO)
                break;

            case 'delcommand':
                client.admincmds.get('delcmd').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;
            case 'timeout':
                client.admincmds.get('timeout').execute(message, args, client, Discord, currentDate, currentDateISO)
                break;
            //MUSIC --------------------
            case 'play':
                //client.musiccmds.get('play').execute(message, args, command, client, Discord, currentDate, currentDateISO)
                client.commands.get('WIP').execute(message, args, currentDate)
                break;
            case 'skip':
                //client.musiccmds.get('skip').execute(message, args, client, Discord, currentDate, currentDateISO)
                client.commands.get('WIP').execute(message, args, currentDate)
                break;

            case 'stop':
                //client.musiccmds.get('stop').execute(message, args, client, Discord, currentDate, currentDateISO)
                client.commands.get('WIP').execute(message, args, currentDate)
                break;

            case `disconnect`:
                //client.musiccmds.get('musicstop').execute(message, args, client, Discord, ytdl, currentDate, currentDateISO)
                client.commands.get('WIP').execute(message, args, currentDate)
                break;

            case 'queue':
                //client.musiccmds.get('musicqueue').execute(message, args, client, Discord, ytdl, currentDate, currentDateISO)
                client.commands.get('WIP').execute(message, args, currentDate)
                break;

            case 'np':
                //client.musiccmds.get('musicnp').execute(message, args, client, Discord, ytdl, currentDate, currentDateISO)
                client.commands.get('WIP').execute(message, args, currentDate)
                break;

            default:
                let undefinedargsbcsmiswrotecmd = args.splice(0, 100).join(" ");
                console.group("debug")
                console.log(`${currentDateISO} | ${currentDate}`)
                console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
                console.log("command executed - default (possible mispelt command)")
                console.log(`attempted command - ${command} ${undefinedargsbcsmiswrotecmd}`)
                console.log("")
                console.groupEnd()
                break;
        }

    });
}