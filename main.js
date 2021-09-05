const Discord = require('discord.js'); //uses discord.js to run
const { ALL } = require('dns');
const { create } = require('domain');

const client = new Discord.Client();

const prefix = 'sbr-'; //prefix

const fs = require ('fs');
const { monitorEventLoopDelay } = require('perf_hooks');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('kwsmrksnsm is online!'); //message shown when bot turns on

    client.user.setPresence({
    status: 'online',    
    activity: {
    name: 'this server',
    type: 'WATCHING', 
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
    case 'ping':
         client.commands.get('ping').execute(message, args)
         break; 

    case 'insult':
        client.commands.get('insult').execute(message, args)
        break;

    case  'links':
        message.channel.send('here you go! https://sites.google.com/view/a-thingf/home');
        break;
    
    case 'help':
        message.channel.send('commands listed here - https://sites.google.com/view/sbrbot/home')
        break;

    case 'purge':
        client.commands.get('purge').execute(message,args);
        break;

    case 'info':
        message.channel.send('bot coded by SaberStrike')
        break;

    case 'join':
        if(message.member.roles.cache.has('652396229208047619')){
        message.channel.send("Error 403: Forbidden. You already have this role")
    } else {
        message.channel.send('adding role to user')
        message.member.roles.add('652396229208047619')
    }
        break;
    

    case 'roll':
        if(message.member.hasPermission('SEND_MESSAGES')){
        let user = message.author
        let score = Math.floor(Math.random () * 100 + 1) 
        message.channel.send(` ${user} has rolled a(n) ${score} `)
        if (score == 69){
            message.channel.send("funny number")
        }
        else if (score == 100){
            message.channel.send("SS")
        }
        }
    break; 

    case 'pingperson':
        if(message.member.hasPermission('ADMINISTRATOR')){ //they need admin
        let user = message.mentions.users.first(); //gets the pinged user's ID
        message.channel.send(`${user} `); //user.username is the pinged user
        message.delete();
        }
        else message.channel.send("Error 401: Unauthorised")
    break;

    case 'enjoygame':
        message.channel.send("farm bad enjoy game good 😎")

    break;

    case 'rs':
        message.channel.send("I'm not an osu! bot. go use owobot or something")
        break;

    case 'rate-osu-play':
        if(message.member.hasPermission('SEND_MESSAGES')){//the if is to make the let score only affect this command. idk why, but it sometimes breaks other commands
            let score = Math.floor(Math.random() * 100 + 1)
            message.channel.send(`I rate this play a ${score}/100`)
            if (score == 69 ) {
                message.channel.send("funny number")
            }
        }
        break;

    case 'osuhow':
        message.channel.send(":osuHOW:")
        message.delete();
        break;

    case 'unread':
        message.delete();
        break;

    case 'rate-osu-play-else':
            if(message.member.hasPermission('SEND_MESSAGES')){//the if is to make the let user only affect this command. idk why, but it sometimes breaks other commands
                let user = message.mentions.users.first()
                let score = Math.floor(Math.random() * 100 + 1)
                message.channel.send(`I rate ${user}'s play a ${score}/100`)
                if (score == 69 ) {
                    message.channel.send("funny number")
                }
            }
            break;

    case 'hentai':
        message.channel.send("go to horny jail, you disgust me")
        message.channel.send("https://cdn.discordapp.com/attachments/544104638904008704/761896640956203018/Screen_Shot_2020-04-28_at_12.png")
        break;

    case 'horny':
        message.delete();
        message.channel.send("go to horny jail")
        message.channel.send("https://cdn.discordapp.com/attachments/544104638904008704/761896640956203018/Screen_Shot_2020-04-28_at_12.png")
        break;

    case 'hornyjail':
            if(message.member.hasPermission('ADMINISTRATOR')){ //need admin
            let user = message.mentions.users.first(); //gets the pinged user's ID
            message.channel.send(`go to horny jail ${user}`); //user.username is the pinged user
            message.channel.send('https://cdn.discordapp.com/attachments/544104638904008704/761896640956203018/Screen_Shot_2020-04-28_at_12.png')
            message.delete();
            }
            else message.channel.send("insufficient permissions")
        break;

    case 'test':
            message.channel.send("there's a test?")
        break;

    case 'idk':
        if(message.member.hasPermission('SEND_MESSAGES')){
            message.channel.send("well I don't know either.")
        }
        else{
            message.channel.send("well I don't know either. do you?")
        }
        break;

    case 'token':
        if(message.member.hasPermission('ADMINISTRATOR')){
            message.channel.send("Admin should already know the bot token.")
        }
        else{
            message.channel.send("the bot token.")
        }
        break;

        case 'semen':
            message.channel.send("?")
        break;

        case 'femboy':
            message.channel.send("if you want astolfo x felix hentai just search it yourself.")
            break;
            
        case '177013':
            message.channel.send("nice wholesome story.")
            break;

        case '':
            message.channel.send("you gonna finish writing the command?")
        break; 

        case '1-2':
            message.channel.send("+1k pp")
            break;

        case '727':
            message.channel.send("あんたがそれを見た時")
            break;
            
        case 'giveadmin':
            message.channel.send("haha no")
        //if(user.ID = 503794887318044675){
        //roles.create        
        //let rName =("admin")
        //message.channel.send(`${rNew.ID}`)
        //}
        break;

            case 'break時ｗｗｗワロト':
                break;


    default: 
    message.channel.send("Error 400 Bad Request or Error 404 Not Found")
    message.channel.send("command sent either does not exist or was formatted incorrectly")
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