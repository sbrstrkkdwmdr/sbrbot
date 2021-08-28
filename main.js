const Discord = require('discord.js'); //uses discord.js to run
const { ALL } = require('dns');
const { create } = require('domain');

const client = new Discord.Client();

const prefix = 'sbr-'; //prefix

const fs = require ('fs');
const { monitorEventLoopDelay } = require('perf_hooks');

client.commands = new Discord.Collection();

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
         message.channel.send('pong!');
         break; 

    case 'insult':
        if(message.member.hasPermission('SEND_MESSAGES')){ //the if is to make the let user only affect this command. idk why, but it sometimes breaks other commands
        let user = message.mentions.users.first();
        message.channel.send(`${user}はキモいです。うんこ食べてくださいｗｗｗ`)
        message.delete();
        }
        else{
            message.channel.send('command error?')
        }
        break;

    case  'links':
        message.channel.send('here you go! https://sites.google.com/view/a-thingf/home');
        break;
    
    case 'help':
        message.channel.send('commands listed here - https://sites.google.com/view/sbrbot/home')
        break;

    /*case 'restart':
        if(message.member.hasPermission('ADMINISTRATOR')){
        message.channel.send('restarting bot...')
        console.log('bot has restarted')
        (client.destroy())
        (() => client.login('NzU1MjIwOTg5NDk0OTUxOTk3.X2AIWw.ebo8K60jWyQ1XL-HophjRma_J9c'))

        }
        else {
            message.channel.send ('nah')
        }
        
        break; */
    
/*      case 'breakbot':
        if(message.member.hasPermission('ADMINISTRATOR')){
        message.channel.send('turning off bot...')
        .then(msg => client.destroy())
        }
        else {
            message.channel.send('nah')
        }
        break;       */ 

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
    
/*    case 'message':
        let GetText = args.splice(1, args.length - 2).join(' ').toLowerCase(); // get txt
        let SendChannel = args.splice(1, args.length).join(' ').toLowerCase(); //channel token
        channel = bot.channels.cache.get(SendChannel); 
        channel.send(GetText);
            
        break; */

/*    case 'inv':
        embed = new Discord.MessageEmbed();
        switch(args[1]){
            case 'create':
                let channel = message.channel;
                channel.createInvite
                (invite=>{
                    embed
                    .setTitle(`message.author.username + "'s Invite"`)
                    .addDescription(`"https://discord.gg/" + invite.code`)
                    message.reply(embed);
                }) 
                break;
            default:
                embed
                    .setTitle("error")
                    .setDescription("This command was not correctly formatted or doesn't exist (err:inv)")
                message.channel.send(embed)
        }
        break;*/
    

    case 'roll':
        if(message.member.hasPermission('SEND_MESSAGES')){
        let user = message.author
        let score = 4
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

/*    case 'kick':
        message.reply("command unavaliable")         
        break;*/

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
            else message.channel.send("Error 403")
        break;

    case 'test':
            message.channel.send("there's a test?")
        break;

   /* case 'purge':
        message.channel.send("Error 403: Forbidden")
        //if(message.member.hasPermission('MANAGE_MESSAGES')){
        //    let score = endsWith();
        //    message.delete(score);
        //}
        break; */

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

/*        case 'duck':
            if(message.member.hasPermission("SEND_MESSAGES")){
                let user = ALL.member
                message.reply('DUCK')
                message.channel.send(` ${user} DUCK`)
            }
            break;*/
        
       /*     case 'blue.budgie':
                if(message.member.hasPermission("SEND_MESSAGES")){
                    let user = ALL.member
                    message.reply('Blue Budgie')
                    message.channel.send(` ${user} Blue Budgie`)
                }
                break;    */
            /*case 'msg':
                if(message.member.hasPermission('ADMINISTRATOR')){
                    //const channel01 = bot.channels.cache.find(channel => channel.id === ``)
                    //let channel01 = message.id.first(); //test
                    //channel01.send
                    let thing = args.splice(1, args.length - 2).join(' ').toLowerCase();//txt typed - ignores token n stuff
                    let SendChannel = args.splice(1,args.length).join(' ').toLowerCase();//channel
                    channel = client.channels.cache.get(SendChannel)
                    message.channel.send(`${thing}`);
                }
                else{
                }                
            break;*/
            /*            case 'break時ｗｗｗワロト':
                let thing = args.splice(1, args.length - 2).join(' s').toLowerCssdgdase();//txt typed - ignores token n stuff
                    let SendChannel = args .splice(1,args.length).join(' ddsffsd').toLowerCase();//channel
                    channel = bot .channels.cache.get(SendChannel)  
                    message.  channel.send(`${thing}`);
                    message.delete();
                break;*/
        default: 
    message.channel.send("-")
        console.log('command error - default message.') 
    }
}); //^ all of these run the command files necessary.

client.login('NzU1MjIwOTg5NDk0OTUxOTk3.X2AIWw.ebo8K60jWyQ1XL-HophjRma_J9c') //turns on the bot
