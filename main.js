const Discord = require('discord.js'); //uses discord.js to run
const { ALL } = require('dns');
const { create } = require('domain');
const fetch = require('node-fetch');
const get = require('node-fetch2');
const wait = require('util').promisify(setTimeout);
const {Player} = require('discord-player');
//added in discordjs 13
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { osuauthtoken } = require('./config.json');
const { osuapikey } = require('./config.json');
const { osuclientid } = require('./config.json');
const { osuclientsecret } = require('./config.json');

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
  const currentDateForSomeApiThing = new Date().toISOString().slice(0,10);
  const timeStamp = new Date().getTime();
  const curdateyesterdaytimestamp = timeStamp - 24*60*60*1000;
  const curdateyesterday = new Date(curdateyesterdaytimestamp).toISOString().slice(0,10);
  const curdatetmrtimestamp = timeStamp + 24*60*60*1000;
  const curdatetmr = new Date(curdatetmrtimestamp).toISOString().slice(0,10);
  const split = new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/);
  const curtimezone = split[split.length - 1]
//  const curtimezone = new Date().getTimezoneOffset();

client.once('ready', () => {
    console.log(`--------------------------------------------------------------------------------------`)
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log('kwsmrksnsm is online!'); //message shown when bot turns on
    console.log(`API Latency is ${Math.round(client.ws.ping)}ms`);
    console.log("")

    //modLogs(client)
client.user.setPresence({ activities: [{ name: "you", type: 'WATCHING', video_url: 'https://youtube.com/saberstrkkdwmdr'}], status: `dnd`,});
})

client.on('messageCreate', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return; //the return is so if its just prefix nothing happens

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase(); //idk what this does i forgot

    const owner = require('./botowners.json');
    const player = new Player(client);

    let consoleloguserweeee = message.author
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

    case 'math':
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
    
    case '8ball':
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
    //SBR ONLY --------------------------------------------------------
    case 'testlog':
        client.commands.get('testlog').execute(message, args, currentDate, currentDateISO)
        break;
    case 'join':
        client.commands.get('join').execute(message, args, currentDate, currentDateISO)
        break;

    //OSU -----------------------------------------------------------
   /* case '1-2':
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
        client.commands.get('rs').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
       // client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'osu':
        client.commands.get('osu').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,)
     //   client.commands.get('WIP').execute(message, args, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,)
        break;

    case 'osutop':
        client.commands.get('osutop').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
  //      client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;

    case 'osutest':
        client.commands.get('osutest').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
  //    client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)
        break;
    case 'osubest':
        client.commands.get('osubest').execute(message, args, Discord, currentDate, currentDateISO)
        break;

    case 'map':case 'mapget':
        client.commands.get('map').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;

    case 'osuid':
        client.commands.get('osuid').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;

    case 'osubestrs':
      client.commands.get('osubestrs').execute(message, args, Discord, currentDate, currentDateISO, curdateyesterday, curdatetmr, curtimezone)
      break;

    case 'danser':
        client.commands.get('danser').execute(message, args, currentDate, currentDateISO)
        break;

    case 'skin':
        client.commands.get('skin').execute(message, args, currentDate, currentDateISO)
        break;

    case 'tsfm':case 'c':
        client.commands.get('tsfm').execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
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

    case 'guildid':
        client.commands.get('guildid').execute(message, args, currentDate, currentDateISO)
        break;

    case 'gleave':case 'guildleave':
        client.commands.get('gleave').execute(message, args, client, currentDate, currentDateISO)
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
    //MUSIC --------------------
    case 'play':
        client.commands.get('musicplay').execute(message, args, client, Player, player, Discord, ytdl, currentDate, currentDateISO)
        
        //execute(message, serverQueue);
        /*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music play")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)*/
        break; 
    case 'skip':
        client.commands.get('musicskip').execute(message, args, client, Player, player, Discord, ytdl, currentDate, currentDateISO)
        //skip(message, serverQueue);
        /*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music skip")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)*/
        break;
        
    case 'stop':
        client.commands.get('musicstop').execute(message, args, client, Player, player, Discord, ytdl, currentDate, currentDateISO)
        //stop(message, serverQueue);
        /*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music stop")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)*/
        break;

    case `disconnect`:
        client.commands.get('musicstop').execute(message, args, client, Player, player, Discord, ytdl, currentDate, currentDateISO)
        //stop(message, serverQueue);
        /*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music disconnect")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate, currentDateISO)*/
        break;

    case 'queue':
        client.commands.get('musicqueue').execute(message, args, client, Player, player, Discord, ytdl, currentDate, currentDateISO)
/*console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - music queue")
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        client.commands.get('WIP').execute(message, args, currentDate)*/
        break;

    case 'np':
        client.commands.get('musicnp').execute(message, args, client, Player, player, Discord, ytdl, currentDate, currentDateISO)
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

//    client.get("")

    //insert loop
   
   //MUSIC BOT ASYNC FUNCTION
 /*  async function execute(message, serverQueue) {
    
    const str = message.content.slice(prefix.length).split(" ");

    let user = await message.member.fetch();
        const voiceChannel = await user.voice.channel;;
        if (!voiceChannel)
          return message.send(
            "ur not in vc smh my head"
          );
        
        if (!message.member.permissions.has("CONNECT") || !message.member.permissions.has("SPEAK")) {
          return message.channel.send(
            "no perms xd"
          );
        }
      
        const songInfo = await ytdl.getInfo(str[1]);
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
        if (!voiceChannel)
          return message.channel.send(
            "u need to be in vc to skip"
          );
        if (!serverQueue)
          return message.channel.send("no song to skip xd");
        serverQueue.connection.dispatcher.end();
      }
      
      function stop(message, serverQueue) {
        if (!voiceChannel)
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
      }*/
      
      
      /*const player = new Player(client);

player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  queue.metadata.send(`▶ | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
});

player.on('botDisconnect', queue => {
  queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
});

player.on('channelEmpty', queue => {
  queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
});

player.on('queueEnd', queue => {
  queue.metadata.send('✅ | Queue finished!');



});*/

});

try{
client.login(token)
} //turns on the bot
catch (error) {
  console.log("login error")
  console.log(error)
}