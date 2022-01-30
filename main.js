const Discord = require('discord.js'); //uses discord.js to run
const { ALL } = require('dns');
const { create } = require('domain');
const fetch = require('node-fetch');
const get = require('node-fetch2');
const wait = require('util').promisify(setTimeout);
//added in discordjs 13
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { osuauthtoken } = require('./config.json');
const { osuapikey } = require('./config.json');
const { osuclientid } = require('./config.json');
const { osuclientsecret } = require('./config.json');
process.on('warning', e => console.warn(e.stack));
const oncooldown = new Set();
const https = require('http'); // or 'https' for https:// URLs
const sql = require('sqlite')

//MUSIC
const ytdl = require("ytdl-core");

//const client = new Discord.Client();
const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    ] });

const { prefix } = require('./config.json')
//const prefix = insertvaluehere; //prefix

const fs = require('fs');
const { monitorEventLoopDelay } = require('perf_hooks');
const { setInterval } = require('timers/promises');

client.commands = new Discord.Collection();
client.linkdetect = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}
const linkFiles = fs.readdirSync('./links/').filter(file => file.endsWith('.js'));
for(const file of linkFiles){
    const link = require(`./links/${file}`);

    client.linkdetect.set(link.name, link);
}
const osucmdFiles = fs.readdirSync('./osu/').filter(file => file.endsWith('.js'));
for(const file of osucmdFiles){
    const osucmd = require(`./osu/${file}`);

    client.osucmds.set(osucmd.name, osucmd);
}
    //const modLogs = require('./modlogs/')
    /*if (!Date.prototype.toISOString) {
    (function() {
  
    function pad(number) {
        var r = String(number);
            if (r.length === 1) {
            r = '0' + r;
        }
        return r;
        }
  
    Date.prototype.toISOString = function() {
        return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate()) +
        'T' + pad(this.getUTCHours()) +
        'h' + pad(this.getUTCMinutes()) +
        'm' + pad(this.getUTCSeconds()) +
        's' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) +
        'ms';
    };

    }());
    }*/
    //const curtimezone = new Date().getTimezoneOffset();

client.once('ready', () => {
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log('kwsmrksnsm is online!'); //message shown when bot turns on
    console.log(`API Latency is ${Math.round(client.ws.ping)}ms`);
    console.log("")

    //modLogs(client)
client.user.setPresence({ activities: [{ name: "you", type: 'WATCHING', video_url: 'https://youtube.com/saberstrkkdwmdr'}], status: `dnd`,});
})

client.on('messageCreate', message =>{

    const args = message.content.slice(prefix.length).split(/ +/);
    const linkargs = message.content.split(/ +/);
    const command = args.shift().toLowerCase(); //grabs command

    const owner = require('./botowners.json');

    let consoleloguserweeee = message.author
    let currentDate = new Date();
    let currentDateISO = new Date().toISOString();
    let currentDateForSomeApiThing = new Date().toISOString().slice(0,10);
    let timeStamp = new Date().getTime();
    let curdateyesterdaytimestamp = timeStamp - 24*60*60*1000;
    let curdateyesterday = new Date(curdateyesterdaytimestamp).toISOString().slice(0,10);
    let curdatetmrtimestamp = timeStamp + 24*60*60*1000;
    let curdatetmr = new Date(curdatetmrtimestamp).toISOString().slice(0,10);
    let split = new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/);
    let curtimezone = split[split.length - 1]
   
    if (message.content.startsWith('https://osu.ppy.sh/b/') || message.content.startsWith('osu.ppy.sh/b/')){
        client.linkdetect.get('osumaplink').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret);
    } 
    if (message.content.startsWith('https://osu.ppy.sh/beatmapsets/') || message.content.startsWith('osu.ppy.sh/beatmapsets')){
        client.linkdetect.get('osulongmaplink').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret);
    }
    if(!message.content.startsWith(prefix) || message.author.bot) return; //the return is so if its just prefix nothing happens

    if(oncooldown.has(message.author.id)) return message.reply("You're on cooldown");
     if(!oncooldown.has(message.author.id)) {
        oncooldown.add(message.author.id);
        setTimeout(() => {
            oncooldown.delete(message.author.id)
        }, 3000)
    }

    if (message.attachments == true) {
        for (var key in message.attachments) {
            let attachment = message.attachments[key];
            download(attachment.url);
            client.linkdetect.get('replayparse').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret);
        }
    }

    switch (command)
    {

    case 'test':
        client.commands.get('test').execute(message, args, currentDate, currentDateISO)
        break;

    /*  case 'replay':
        client.linkdetect.get('replayparse').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret);
        break;
*/
    //HELPFUL ---------------------------------------

    case 'ping':
        client.commands.get('ping').execute(message, args, client, Discord, currentDate, currentDateISO)
        break; 
    case  'links':
        client.commands.get('links').execute(message, args, currentDate, currentDateISO)
        break;
    
    case 'help':
        client.commands.get('help').execute(message, args, currentDate, currentDateISO)
        break;  
        
    case 'info':
        client.commands.get('info').execute(message, args, currentDate, currentDateISO)
        break;
    //UNCATEGORISED -----GENERAL?-------------------------------------------------
     case 'avatar':case 'av':case 'pfp':
         client.commands.get('avatar').execute(message, args, Discord, currentDate, currentDateISO)
         break;
    case 'giveadmin':
        client.commands.get('giveadmin').execute(message, args, currentDate, currentDateISO)
        break;
    case 'token':
        client.commands.get('token').execute(message, args, currentDate, currentDateISO)
        break;
    case 'roll':case 'numgen':
        client.commands.get('roll').execute(message, args, currentDate, currentDateISO)
        break; 

    case 'pingperson':
        client.commands.get('pingperson').execute(message, args, currentDate, currentDateISO)
        break;

    case 'unread':
        client.commands.get('unread').execute(message, args, currentDate, currentDateISO)
        break;

    case 'idk':
        client.commands.get('idk').execute(message, args, currentDate, currentDateISO)
        break;

    case 'image':
        client.commands.get('image').execute(message, args, Discord, get, client, currentDate, currentDateISO)
        //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'image5':
      client.commands.get('image5').execute(message, args, Discord, get, client, currentDate, currentDateISO)
      break;

    case 'ytsearch':
        client.commands.get('ytsearch').execute(message, args, Discord, client, currentDate, currentDateISO)
        //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    /*case 'ytsearch5':
    client.commands.get('ytsearch5').execute(message, args, Discord, client, currentDate, currentDateISO)
    break;*/
    
    case 'active':
        client.commands.get('active').execute(message, args, Discord, currentDate, currentDateISO)
        break;

    case 'math':case 'calculate':
        client.commands.get('math').execute(message, args, Discord, currentDate, currentDateISO)
        break;
    //FUN --------------------------------------------------------------------
    case 'ghostping':
        client.commands.get('ghostping').execute(message, args, currentDate, currentDateISO)
        break;
    case 'insult':
        client.commands.get('insult').execute(message, args, currentDate, currentDateISO)
        break;
    case 'unchi':
        client.commands.get('unchi').execute(message, args, currentDate, currentDateISO)
        break;       
 
    case 'unko':
        client.commands.get('unko').execute(message, args, currentDate, currentDateISO)
        break;      
    
    case '8ball':case 'ask':
        client.commands.get('8ball').execute(message, args, currentDate, currentDateISO)
        break;

    case 'emojify':
        client.commands.get('emojify').execute(message, args, currentDate, currentDateISO)
        break;

    case 'dadjoke':case 'pun':
        client.commands.get('dadjoke').execute(message, args, currentDate, currentDateISO)
        break;

    case 'time':
        client.commands.get('time').execute(message, args, currentDate, currentDateISO)
        break;

    case 'amoggers':
        client.commands.get('amoggers').execute(message, args, Discord, currentDate, currentDateISO)
        break;

    case '1100':case 'count100':
      client.commands.get('1100').execute(message, args, currentDate, currentDateISO)
      break;
    
    case 'say':
        client.commands.get('say').execute(message, args, currentDate, currentDateISO)
        break;
    
    case 'paperscissorsrock':case 'rockpaperscissors': case 'psr':case 'scissorsrockpaper':
        client.commands.get('psr').execute(message, args, currentDate, currentDateISO)
        break;

    case '4k':
        client.commands.get('4k').execute(message, args, currentDate, currentDateISO)
        break;

    case 'owoify':
        client.commands.get('owoify').execute(message, args, currentDate, currentDateISO)
        break;
        //SBR ONLY --------------------------------------------------------
    case 'testlog':
        client.commands.get('testlog').execute(message, args, currentDate, currentDateISO)
        break;
    case 'join':
        client.commands.get('join').execute(message, args, currentDate, currentDateISO)
        break;

    //OSU -----------------------------------------------------------
    /*case '1-2':
        client.commands.get('1-2').execute(message, args, currentDate, currentDateISO)
        break;

    case '727':
       client.commands.get('727').execute(message, args, currentDate, currentDateISO)
        break;

    case 'rate-osu-play-else':
        client.commands.get('rate-osu-play-else').execute(message, args, currentDate, currentDateISO)
        break;
    case 'enjoygame':
        client.commands.get('enjoygame').execute(message, args, currentDate, currentDateISO)
        break;
    
    case 'rate-osu-play':
        client.commands.get('rate-osu-play').execute(message, args, currentDate, currentDateISO)
        break;
    
    case 'osuhow':
        client.commands.get('osuhow').execute(message, args, currentDate, currentDateISO)
        break;*/

    case 'rs':case 'recent':
        client.osucmds.get('rs').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'osu':
        client.osucmds.get('osu').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,)
        //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,)
        break;

    case 'osutop':
        client.osucmds.get('osutop').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'osutest':
        client.osucmds.get('osutest').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;
    case 'osubest':
        client.osucmds.get('osubest').execute(message, args, Discord, currentDate, currentDateISO)
        break;

    case 'map':case 'mapinfo':
        client.osucmds.get('map').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;

    case 'osuid':
        client.osucmds.get('osuid').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;

    case 'osubestrs':
      client.osucmds.get('osubestrs').execute(message, args, Discord, currentDate, currentDateISO, curdateyesterday, curdatetmr, curtimezone)
      break;

    case 'danser':
        client.osucmds.get('danser').execute(message, args, currentDate, currentDateISO)
        break;

    case 'skin':
        client.osucmds.get('skin').execute(message, args, currentDate, currentDateISO)
        break;

    case 'tsfm':case 'c':
        client.osucmds.get('tsfm').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
    
    case 'osuauth':
        client.osucmds.get('osuauth').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;  

    case 'osusave':case 'osuset':
        client.osucmds.get('osusave').call(message, args, Discord, currentDate, currentDateISO)
        break;
    
    /*case 'mapsearch':case 'mapget':
      client.commands.get('mapsearch').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
      break;*/
    //HENTAI-----------------------------------------------------------------------------------------


    case 'hentai':case 'nhentai':
        client.commands.get('hentai').execute(message, args, currentDate, currentDateISO)
        break;

    case 'horny':
        client.commands.get('horny').execute(message, args, currentDate, currentDateISO)
        break;

    case 'hornyjail':
        client.commands.get('hornyjail').execute(message, args, currentDate, currentDateISO)
        break;

    case 'danbooru':
        client.commands.get('danbooru').execute(message, args, currentDate, currentDateISO)
        break;
    case 'lolibooru':
        client.commands.get('lolibooru').execute(message, args, currentDate, currentDateISO)
        break;

    case 'yanderegen':
        client.commands.get('yanderegen').execute(message, args, currentDate, currentDateISO)
        break;

    case 'konachangen':
        client.commands.get('konachangen').execute(message, args, currentDate, currentDateISO)
        break;
        
    case 'pixiv':
        client.commands.get('pixiv').execute(message, args, currentDate, currentDateISO)
        break;

    //ADMIN-----------------------------------------------------------------------------------------
    case 'purge':
        client.commands.get('purge').execute(message, args, client, Discord, currentDate, currentDateISO)
        break;

    case 'unban':
        client.commands.get('unban').execute(message, args, currentDate, currentDateISO)
        break;

    case 'break時ｗｗｗワロト':
        client.commands.get('break').execute(message, args, currentDate, currentDateISO)
        break;

    case 'crash':
        client.commands.get('crash').execute(message, args, currentDate, currentDateISO)
        break;
    
    case 'ban':
        client.commands.get('ban').execute(message, args, client, Discord, currentDate, currentDateISO)
        break; 

    case 'kick':
        client.commands.get('kick').execute(message, args, client, Discord, currentDate, currentDateISO)
        break;   

    case 'serverlist':case 'servers':
        client.commands.get('serverlist').execute(message, args, Discord, client, currentDate, currentDateISO)
        break;

    case 'gleave':case 'guildleave':case 'leaveguild':
        client.commands.get('gleave').execute(message, args, client, currentDate, currentDateISO)
        break;

    case 'guildid':
        client.commands.get('guildid').execute(message, args, currentDate, currentDateISO)
        break;
    
    case 'remind':
        client.commands.get('remind').execute(message, args, client, Discord, currentDate, currentDateISO)
        break;

    case 'banid':
        client.commands.get('banid').execute(message, args, client, Discord, currentDate, currentDateISO)
        break;

    case 'botstatus':
        client.commands.get('botstatus').execute(message, args, client, Discord, currentDate, currentDateISO)
        break;
    case 'refresh':
        client.commands.get('refresh').execute(message, args, client, Discord, currentDate, currentDateISO)
        break;

    case 'auto':
    client.commands.get('auto').execute(message, args, currentDate, currentDateISO)
    break;
    //MUSIC --------------------
    case 'play':
        client.commands.get('play').execute(message, args, command, client, Discord, currentDate, currentDateISO)
        //execute(message, serverQueue);
        /*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music play")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)*/
        break; 
    case 'skip':
        client.commands.get('skip').execute(message, args, client, Discord, currentDate, currentDateISO)
        //skip(message, serverQueue);
        /*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music skip")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)*/
        break;
        
    case 'stop':
        client.commands.get('stop').execute(message, args, client, Discord, currentDate, currentDateISO)
        //stop(message, serverQueue);
        /*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music stop")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)*/
        break;

    case `disconnect`:
        client.commands.get('musicstop').execute(message, args, client, Discord, ytdl, currentDate, currentDateISO)
        //stop(message, serverQueue);
        /*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music disconnect")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)*/
        break;

    case 'queue':
        client.commands.get('musicqueue').execute(message, args, client, Discord, ytdl, currentDate, currentDateISO)
/*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music queue")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate)*/
        break;

    case 'np':
        client.commands.get('musicnp').execute(message, args, client, Discord, ytdl, currentDate, currentDateISO)
        break;

    default:
      let undefinedargsbcsmiswrotecmd = args.splice(0,100).join(" ");
      console.log(`${currentDateISO} | ${currentDate}`)
      console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("command executed - default (possible mispelt command)")
        console.log(`attempted command - ${command} ${undefinedargsbcsmiswrotecmd}`)
        console.log("")
        break;
    }
    //NON COMMAND STUFF--------------------------

});

try{
client.login(token)
console.log(`--------------------------------------------------------------------------------------`)
    //
    let oauthurl = new URL ("https://osu.ppy.sh/oauth/token");
    let body1 = {
        "client_id": osuclientid,
        "client_secret": osuclientsecret,
        "grant_type": "client_credentials",
        "scope": "public"
    }
    fetch(oauthurl, {
        method: "POST",
        body: JSON.stringify(body1),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(output => fs.writeFileSync("osuauth.json", JSON.stringify(output, null, 2)))
    console.log("saved osuauth")
//
} //turns on the bot
catch (error) {
    console.log("login error")
    console.log(error)
}