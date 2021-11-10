
const Discord = require('discord.js'); //uses discord.js to run
const { ALL } = require('dns');
const { create } = require('domain');
const fetch = require('node-fetch');

const client = new Discord.Client();

const prefix = 'sbr-'; //prefix

const fs = require ('fs');
const { monitorEventLoopDelay } = require('perf_hooks');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js' || '.mjs'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

//const modLogs = require('./modlogs/')

client.once('ready', () => {
    console.log('kwsmrksnsm is online!'); //message shown when bot turns on

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


//commands below
    switch (command)
    {

    case 'test':
        client.commands.get('test').execute(message, args)
        break;

    //HELPFUL ---------------------------------------

    case 'ping':
        client.commands.get('ping').execute(message, args)
        break; 
    case  'links':
        client.commands.get('links').execute(message, args)
        break;
    
    case 'help':
        client.commands.get('help').execute(message, args)
        break;  
        
        case 'info':
            client.commands.get('info').execute(message, args)
            break;
    //UNCATEGORISED -----GENERAL?-------------------------------------------------
     case 'avatar':
         client.commands.get('avatar').execute(message, args, Discord)
         break;
    case 'giveadmin':
        client.commands.get('giveadmin').execute(message, args)
        break;
    case 'token':
        client.commands.get('token').execute(message, args)
        break;
    case 'roll':
        client.commands.get('roll').execute(message, args)
        break; 

    case 'pingperson':
        client.commands.get('pingperson').execute(message, args)
        break;

    case 'unread':
        client.commands.get('unread').execute(message, args)
        break;
    case 'idk':
        client.commands.get('idk').execute(message, args)
        break;

    case '':
        message.channel.send("you gonna finish writing the command?")
        break; 

    //FUN --------------------------------------------------------------------
    case 'ghostping':
        client.commands.get('ghostping').execute(message, args)
        break;
    case 'insult':
        client.commands.get('insult').execute(message, args)
        break;
    case 'unchi':
        client.commands.get('unchi').execute(message, args)
        break;       
 
    case 'unko':
        client.commands.get('unko').execute(message, args)
        break;      
    
    case '8ball':
        client.commands.get('8ball').execute(message, args)
        break;
    
    //SBR ONLY --------------------------------------------------------
    case 'testlog':
        client.commands.get('testlog').execute(message, args)
        break;
    case 'join':
        client.commands.get('join').execute(message, args)
        break;

    //OSU -----------------------------------------------------------
    case '1-2':
        client.commands.get('1-2').execute(message, args)
        break;

    case '727':
       client.commands.get('727').execute(message, args)
        break;

    case 'rate-osu-play-else':
        client.commands.get('rate-osu-play-else').execute(message, args)
        break;
    case 'enjoygame':
        client.commands.get('enjoygame').execute(message, args)
        break;
    
    case 'rate-osu-play':
        client.commands.get('rate-osu-play').execute(message, args)
        break;
    
    case 'osuhow':
        client.commands.get('osuhow').execute(message, args)
        break;

    case 'rs':
        client.commands.get('rs').execute(message, args, Discord)
        break;

    case 'osu':
        client.commands.get('osu').execute(message, args, Discord)
        break;

    case 'osutop':
        client.commands.get('osutop').execute(message, args, Discord)
        break;

    case 'osutest':
        client.commands.get('osutest').execute(message, args, Discord, fetch)
        break;

    case 'danser':
        client.commands.get('danser').execute(message, args)
        break;

    //HENTAI-----------------------------------------------------------------------------------------


    case 'hentai':
        client.commands.get('hentai').execute(message, args)
        break;

    case 'horny':
        client.commands.get('horny').execute(message, args)
        break;

    case 'hornyjail':
        client.commands.get('hornyjail').execute(message, args)
        break;

    case 'danbooru':
        client.commands.get('danbooru').execute(message, args)
        break;
    case 'lolibooru':
        client.commands.get('lolibooru').execute(message, args)
        break;

    case 'yanderegen':
        client.commands.get('yanderegen').execute(message, args)
        break;

    case 'konachangen':
        client.commands.get('konachangen').execute(message, args)
        break;
        
    case 'pixiv':
        client.commands.get('pixiv').execute(message, args)
        break;

    //ADMIN-----------------------------------------------------------------------------------------
    case 'purge':
        client.commands.get('purge').execute(message,args);
        break;

    case 'unban':
        client.commands.get('unban').execute(message, args)
        break;

    case 'break時ｗｗｗワロト':
        client.commands.get('break').execute(message, args)
        break;

    case 'crash':
        client.commands.get('crash').execute(message, args)
        break;
    case 'ban':
        client.commands.get('ban').execute(message, args)
        break; 

    case 'kick':
        client.commands.get('kick').execute(message, args, Discord)
        break;   

    case 'serverlist':
        client.commands.get('serverlist').execute(message, args, Discord, client)
        break;

    case 'guildid':
        client.commands.get('guildid').execute(message, args)
        break;

    case 'gleave':
        client.commands.get('gleave').execute(message, args, client)
        break;

    default: 
    message.channel.send("分からないか壊れた")
    message.channel.send("わからないかこわれた")
        console.log('command error - default message.') 
    }

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

}); //^ all of these run the command files necessary.

client.login('NzU1MjIwOTg5NDk0OTUxOTk3.X2AIWw.ebo8K60jWyQ1XL-HophjRma_J9c') //turns on the bot