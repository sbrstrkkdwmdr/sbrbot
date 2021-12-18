const Discord = require('discord.js'); //uses discord.js to run
const { ALL } = require('dns');
const { create } = require('domain');
const fetch = require('node-fetch');
const get = require('node-fetch2');

//MUSIC
const ytdl = require("ytdl-core");
const queue = new Map();

const client = new Discord.Client();

const prefix = 'sbr-'; //prefix

const fs = require('fs');
const { monitorEventLoopDelay } = require('perf_hooks');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
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
  const currentDate = new Date();
  const currentDateISO = new Date().toISOString();

client.once('ready', () => {
    console.log(`--------------------------------------------------------------------------------------`)
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log('kwsmrksnsm is online!'); //message shown when bot turns on
    console.log("")

    //modLogs(client)

    client.user.setPresence({
    status: 'online',    
    activity: {
    name: 'this server',
    type: 'CUSTOM_STATUS', 
    url: "https://youtube.com/saberstrkkdwmdr"}
})
})

client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return; //the return is so if its just prefix nothing happens

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase(); //idk what this does i forgot

    const serverQueue = queue.get(message.guild.id);
    

    let consoleloguserweeee = message.author
//commands below
    switch (command)
    {

    case 'test':
        client.commands.get('test').execute(message, args, currentDate, currentDateISO)
        break;

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
     case 'avatar':
         client.commands.get('avatar').execute(message, args, Discord, currentDate, currentDateISO)
         break;
    case 'giveadmin':
        client.commands.get('giveadmin').execute(message, args, currentDate, currentDateISO)
        break;
    case 'token':
        client.commands.get('token').execute(message, args, currentDate, currentDateISO)
        break;
    case 'roll':
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

    case 'ytsearch':
//        client.commands.get('ytsearch').execute(message, args, Discord, client, currentDate, currentDateISO)
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
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
    
    case '8ball':
        client.commands.get('8ball').execute(message, args, currentDate, currentDateISO)
        break;

    case 'emojify':
        client.commands.get('emojify').execute(message, args, currentDate, currentDateISO)
        break;

    case 'dadjoke':
        client.commands.get('dadjoke').execute(message, args, currentDate, currentDateISO)
        break;

    case 'time':
        client.commands.get('time').execute(message, args, currentDate, currentDateISO)
        break;

    case 'amoggers':
        client.commands.get('amoggers').execute(message, args, Discord, currentDate, currentDateISO)
        break;
    
    //SBR ONLY --------------------------------------------------------
    case 'testlog':
        client.commands.get('testlog').execute(message, args, currentDate, currentDateISO)
        break;
    case 'join':
        client.commands.get('join').execute(message, args, currentDate, currentDateISO)
        break;

    //OSU -----------------------------------------------------------
    case '1-2':
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
        break;

    case 'rs':
      //  client.commands.get('rs').execute(message, args, Discord)
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'osu':
    //    client.commands.get('osu').execute(message, args, Discord)
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'osutop':
  //      client.commands.get('osutop').execute(message, args, Discord)
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'osutest':
//        client.commands.get('osutest').execute(message, args, Discord)
      client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'danser':
        client.commands.get('danser').execute(message, args, currentDate, currentDateISO)
        break;

    //HENTAI-----------------------------------------------------------------------------------------


    case 'hentai':
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
        client.commands.get('purge').execute(message,args, currentDate, currentDateISO)
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
        client.commands.get('ban').execute(message, args, currentDate, currentDateISO)
        break; 

    case 'kick':
        client.commands.get('kick').execute(message, args, Discord, currentDate, currentDateISO)
        break;   

    case 'serverlist':
        client.commands.get('serverlist').execute(message, args, Discord, client, currentDate, currentDateISO)
        break;

    case 'guildid':
        client.commands.get('guildid').execute(message, args, currentDate, currentDateISO)
        break;

    case 'gleave':
        client.commands.get('gleave').execute(message, args, client, currentDate, currentDateISO)
        break;
    
    case 'remind':
        client.commands.get('remind').execute(message, args, client, Discord, currentDate, currentDateISO)
        break;

    case 'banid':
        client.commands.get('banid').execute(message, args, Discord, currentDate, currentDateISO)
        break;
    
    //MUSIC --------------------
    case 'play':
        //client.commands.get('musicplay').execute(message, args, client, serverQueue, Discord, ytdl, currentDate)
        execute(message, serverQueue);
        console.log(`${currentDate}`)
        console.log("command executed - music play")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        //client.commands.get('WIP').execute(message, args, currentDate)
        break; 
    case 'skip':
        //client.commands.get('musicskip').execute(message, args, client, serverQueue, Discord, ytdl, currentDate)
        skip(message, serverQueue);
        console.log("command executed - music skip")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        //client.commands.get('WIP').execute(message, args, currentDate)
        break;
        
    case 'stop':
        //client.commands.get('musicstop').execute(message, args, client, serverQueue, Discord, ytdl, currentDate)
        stop(message, serverQueue);
        console.log("command executed - music stop")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        //client.commands.get('WIP').execute(message, args, currentDate)
        break;

    case `disconnect`:
        //client.commands.get('musicstop').execute(message, args, client, serverQueue, Discord, ytdl, currentDate)
        stop(message, serverQueue);
        console.log("command executed - music disconnect")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        //client.commands.get('WIP').execute(message, args, currentDate)
        break;

    default:
        console.log(`${currentDate}`)
        console.log("command executed - default (possible mispelt command)")
        console.log("")
        break;
    }
     /* let MOTHERTRIGGER2 = "you know who else"
    if(m){}*/
    //NON COMMAND STUFF--------------------------

//    client.get("")

    //insert loop
/*
    for (;;) {
        Thread.sleep(5 * 1000)
        let SendingChannelw = 875352853684822056
        let d1 = new
        let d2 = dat
        let THINGYYY = GET (`https://osutrack-api.ameo.dev/hiscores?user={SaberStrike}&mode={mode}&from={from}&to={to}`)
        message.SendingChannelw.send(`${THINGYYY}`)
        //875352853684822056
        //GET https://osutrack-api.ameo.dev/hiscores?user={user}&mode={mode}&from={YESTERDAY}&to={TODAY}
    }*/
   
   //MUSIC BOT ASYNC FUNCTION
   async function execute(message, serverQueue) {
        const args = message.content.split(" ");
      
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
          return message.channel.send(
            "ur not in vc smh my head"
          );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
          return message.channel.send(
            "no perms xd"
          );
        }
      
        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
              title: songInfo.videoDetails.title,
              url: songInfo.videoDetails.video_url,
         };
      
        if (!serverQueue) {
          const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
          };
      
          queue.set(message.guild.id, queueContruct);
      
          queueContruct.songs.push(song);
      
          try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
          } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
          }
        } else {
          serverQueue.songs.push(song);
          return message.channel.send(`${song.title} added to the queue`);
        }
      }
      
      function skip(message, serverQueue) {
        if (!message.member.voice.channel)
          return message.channel.send(
            "u need to be in vc to skip"
          );
        if (!serverQueue)
          return message.channel.send("no song to skip xd");
        serverQueue.connection.dispatcher.end();
      }
      
      function stop(message, serverQueue) {
        if (!message.member.voice.channel)
          return message.channel.send(
            "u need to be in vc to stop"
          );
          
        if (!serverQueue)
          return message.channel.send("no music to stop");
          
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        message.channel.send("disconnected from vc")
      }
      
      function play(guild, song) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
          serverQueue.voiceChannel.leave();
          queue.delete(guild.id);
          return;
        }

      
        const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
          })
          .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`added **${song.title}** to queue`);
      }

}); //^ all of these run the command files necessary.
//let MOTHERTRIGGER = ["your mother", "your mum", "your mom", "yo mumma", "yo momma", "ur mum", "ur mom", "u mum", "u mom"]
//if(!message.content.startsWith(MOTHERTRIGGER)){
//    message.channel.send("yeah, she's 300 feet away from your house with a chonkl")
//}


client.login('NzU1MjIwOTg5NDk0OTUxOTk3.X2AIWw.ebo8K60jWyQ1XL-HophjRma_J9c') //turns on the bot
