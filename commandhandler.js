module.exports = (userdatatags, client, Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, monitorEventLoopDelay, setInterval) => {
    const get = require('node-fetch');
const { prefix } = require('./config.json')

const fs = require('fs');


const oncooldown = new Set();

client.commands = new Discord.Collection();
client.linkdetect = new Discord.Collection();
client.osucmds = new Discord.Collection();
client.altosucmds = new Discord.Collection();
client.admincmds = new Discord.Collection();
client.helpcmds = new Discord.Collection();
client.musiccmds = new Discord.Collection();
client.ecchicmds = new Discord.Collection();
client.gamingcmds = new Discord.Collection();

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
const altosucmdFiles = fs.readdirSync('./osu11/').filter(file => file.endsWith('.js'));
for(const file of altosucmdFiles){
    const altosucmd = require(`./osu11/${file}`);

    client.altosucmds.set(altosucmd.name, altosucmd);
}
const admincmdfiles = fs.readdirSync('./commands-admin/').filter(file => file.endsWith('.js'));
for(const file of admincmdfiles){
    const admincmd = require(`./commands-admin/${file}`);

    client.admincmds.set(admincmd.name, admincmd);
}
const helpcmdfiles = fs.readdirSync('./commands-help/').filter(file => file.endsWith('.js'));
for(const file of helpcmdfiles){
    const helpcmd = require(`./commands-help/${file}`);

    client.helpcmds.set(helpcmd.name, helpcmd);
}
const musiccmdfiles = fs.readdirSync('./commands-music/').filter(file => file.endsWith('.js'));
for(const file of musiccmdfiles){
    const musiccmd = require(`./commands-music/${file}`);

    client.musiccmds.set(musiccmd.name, musiccmd);
}
const ecchicmdfiles = fs.readdirSync('./commands-ecchi/').filter(file => file.endsWith('.js'));
for(const file of ecchicmdfiles){
    const ecchicmd = require(`./commands-ecchi/${file}`);

    client.ecchicmds.set(ecchicmd.name, ecchicmd);
}
const gamingcmdfiles = fs.readdirSync('./commands-gaming/').filter(file => file.endsWith('.js'));
for(const file of gamingcmdfiles){
    const gamingcmd = require(`./commands-gaming/${file}`);

    client.gamingcmds.set(gamingcmd.name, gamingcmd);
}

client.on('messageCreate', message =>{

    const args = message.content.slice(prefix.length).split(/ +/); //args are the message content but without the prefix
    const linkargs = message.content.split(/ +/); //linkargs are the message content
    const command = args.shift().toLowerCase(); //grabs command

    const owners = ['503794887318044675']

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

    //
    if(!message.content.startsWith(prefix)) return; //the return is so if its just prefix nothing happens
    if(message.author.bot){
        if(!message.author.id == '755220989494951997') return;
    }
    if(oncooldown.has(message.author.id)) return message.reply("You're on cooldown");
     if(!oncooldown.has(message.author.id)) {
        oncooldown.add(message.author.id);
        setTimeout(() => {
            oncooldown.delete(message.author.id)
        }, 3000)
    }

    switch (command) //variable to check for
    {

    case 'test': //if command = 'test' blahblablah
        client.commands.get('test').execute(message, args, currentDate, currentDateISO)
        break;

    /*  case 'replay':
        client.linkdetect.get('replayparse').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret);
        break;
*/
    //HELPFUL ---------------------------------------

    case 'ping':
        client.helpcmds.get('ping').execute(message, args, client, Discord, currentDate, currentDateISO)
        break; 
    case  'links':
        client.helpcmds.get('links').execute(message, args, currentDate, currentDateISO)
        break;
    
    case 'help':
        client.helpcmds.get('help').execute(message, args, currentDate, currentDateISO)
        break;  
        
    case 'info':
        client.helpcmds.get('info').execute(message, args, currentDate, currentDateISO)
        break;
        
    case 'math':case 'calculate':
        client.helpcmds.get('math').execute(message, args, Discord, currentDate, currentDateISO)
        break;

    case 'measureconvert':case 'convert':
        client.helpcmds.get('measureconvert').execute(message, args, Discord, currentDate, currentDateISO)
        break;


    case 'recordhelp':
        client.linkdetect.get('replayrecordhelp').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
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
        client.commands.get('say').execute(owners, message, args, currentDate, currentDateISO)
        break;

    case 'sayto':
        client.commands.get('sayto').execute(owners, client, message, args, currentDate, currentDateISO)
        break;
    
    case 'paperscissorsrock':case 'rockpaperscissors':case 'psr':case 'scissorsrockpaper':
        client.commands.get('psr').execute(message, args, currentDate, currentDateISO)
        break;

    case '4k':
        client.commands.get('4k').execute(message, args, currentDate, currentDateISO)
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
    case 'getuser':
        client.commands.get('getuser').execute(message, client, Discord, args, currentDate, currentDateISO)
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

    case 'tsfm':case 'c':
        client.altosucmds.get('tsfm').execute(userdatatags, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
    
    case 'osuauth':
        client.altosucmds.get('osuauth').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;  

    case 'osusave':case 'osuset':
        client.altosucmds.get('osuset').execute(userdatatags, message, args, Discord, currentDate, currentDateISO)
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

    case 'ctbrs':case 'ctbtop':case 'maniars':case 'maniatop':case 'map':case 'osutop':case 'rs':case 'skin':case 'taikors': case 'taikotop':
        message.reply('use the / command (/rs mode:mode /osutop mode:mode)')
        break;
    //HENTAI-----------------------------------------------------------------------------------------


    case 'hentai':case 'nhentai':
        client.ecchicmds.get('hentai').execute(message, args, currentDate, currentDateISO)
        break;

    case 'horny':
        client.ecchicmds.get('horny').execute(message, args, currentDate, currentDateISO)
        break;

    case 'hornyjail':
        client.ecchicmds.get('hornyjail').execute(message, args, currentDate, currentDateISO)
        break;

    case 'danbooru':
        client.ecchicmds.get('danbooru').execute(message, args, currentDate, currentDateISO)
        break;
    case 'lolibooru':
        client.ecchicmds.get('lolibooru').execute(message, args, currentDate, currentDateISO)
        break;

    case 'yanderegen':
        client.ecchicmds.get('yanderegen').execute(message, args, currentDate, currentDateISO)
        break;

    case 'konachangen':
        client.ecchicmds.get('konachangen').execute(message, args, currentDate, currentDateISO)
        break;
        
    case 'pixiv':
        client.ecchicmds.get('pixiv').execute(message, args, currentDate, currentDateISO)
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
        client.admincmds.get('debugget').execute(message, args, Discord, currentDate, currentDateISO)
        break;

    case 'delcommand':
        client.admincmds.get('delcmd').execute(message, args, client, Discord, currentDate, currentDateISO)
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

    //gaming----
    case 'profilesplitgate':case 'splitgateprofile':
        //client.gamingcmds.get('splitgateprofile').execute(message, args, client, Discord, currentDate, currentDateISO)
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'apexprofile':
        //client.gamingcmds.get('apexprofile').execute(message, args, client, Discord, currentDate, currentDateISO)
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;
    case 'haloinfprofile':case 'haloprofile':
        client.gamingcmds.get('haloinfprofile').execute(message, args, client, Discord, currentDate, currentDateISO, trnkey)
        //client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    default:
        let undefinedargsbcsmiswrotecmd = args.splice(0,100).join(" ");
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