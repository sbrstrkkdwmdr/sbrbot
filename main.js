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

    client.user.setActivity('twitch.tv/sbrstrkkdwmdr', { type: 'WATCHING' }).catch(console.error);
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
        message.channel.send(`${user}は本当にバカ。草`)
        message.delete();
        }
        else{
            message.channel.send('command error?')
        }
        break;

    case  'links':
        message.channel.send('here you go! https://docs.google.com/document/d/1GnvFLwu4KzS2uobArCsuocZa6KaYHnX_Y0tWajI4JnQ/edit?usp=sharing');
        break;
    
    case 'help':
        message.channel.send('commands listed here - https://docs.google.com/document/d/1r911lL9MjBP8FQRlv4Jgb31C0SbkXwKvFXt7axEEjvQ/edit?usp=sharing')
        break;

    //case 'restart':
      //  if(message.member.hasPermission('ADMINISTRATOR')){
        //message.channel.send('restarting bot...')
        //console.log('bot has restarted')
        //(client.destroy())
        //(() => client.login('NzU1MjIwOTg5NDk0OTUxOTk3.X2AIWw.ebo8K60jWyQ1XL-HophjRma_J9c'))

        //}
        //else {
        //    message.channel.send ('nah')
        //}
        
        //break;
    
        //case 'breakbot':
        //if(message.member.hasPermission('ADMINISTRATOR')){
        //message.channel.send('turning off bot...')
        //.then(msg => client.destroy())
        //}
        //else {
        //    message.channel.send('nah')
        //}
        //break;        

    case 'info':
        message.channel.send('bot coded by https://twitter.com/sbrstrkkdwmdr')
        break;

    case 'join':
        if(message.member.roles.cache.has('652396229208047619')){
        message.channel.send('you already have this role. pls stop')
    } else {
        message.channel.send('adding role')
        message.member.roles.add('652396229208047619')
    }
        break;
    
    case 'message':
        message.channel.send('cmd broken')
        //    let GetText = args.splice(1, args.length - 2).join(' ').toLowerCase(); // get txt
//    let SendChannel = args.splice(1, args.length).join(' ').toLowerCase(); //channel token
//    channel = bot.channels.cache.get(SendChannel); 
//    channel.send(GetText);
    //        
        break; 

    case 'inv':
        embed = new Discord.MessageEmbed();
        switch(args[1]){
            case "create":
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
        message.channel.send(`Hello  ${user} `); //user.username is the pinged user
        message.delete();
        }
        else message.channel.send("insufficient permissions")
    break;

    case 'accplayer':
        message.channel.send("Okay. So this is a RHYTHM game right. So WHY aren't you an acc player?? Rhythm entails accuracy because its how well you can tap to the rhythm. If you have a B or below in your top 100 push acc. You can have fun and enjoy the game while not having shit plays.")

    break;

    case 'rs':
        message.channel.send("I'm not an osu! bot go use boatbot or something")
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
        message.channel.send("osu! how")
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

    case 'kick':
        message.reply("command unavaliable")         
        break;

    case 'givehentai':
        message.channel.send("go to horny jail")
        message.channel.send("https://cdn.discordapp.com/attachments/544104638904008704/761896640956203018/Screen_Shot_2020-04-28_at_12.png")
        break;

    case 'hornydetected':
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
            if(message.member.hasPermission('SEND_MESSAGES')){
                let user = message.mentions.users.first();
                let score = Math.floor(Math.random() * 100 + 1);
                message.channel.send(`I rate ${user}'s play a ${score}/100`)
                }
        break;

    case 'purge':
        if(message.member.hasPermission('MANAGE_MESSAGES')){
            let score = endsWith();
            message.delete(score);
        }
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
            message.channel.send.apply("Admin should already know the bot token.")
        }
        else{
            message.channel.send("the bot token.")
        }
        break;

        case 'usa':
            message.channel.send("usatei usatei")
            break;

        case 'semen':
            message.channel.send("what")
        break;

        case 'femboy':
            message.channel.send("if you want astolfo x felix hentai just search it yourself.")
            break;
    
        case 'pedo':
            message.channel.send("no")
            break;

        case 'shotacon':
            message.channel.send("choco sensei?")
            break;
        
        case '177013':
            message.channel.send("METAMORPHOSIS")
            break;

        case '':
            message.channel.send("はい？")
        break; 

        case '1-2':
            message.channel.send("+1k pp")
            break;

        case 'whitecat':
            message.channel.send("ABSOLUTE GODMODE 1K PP")
            break;

        case '727':
            message.channel.send("cookiezi")

        case 'anime':
            message.channel.send("https://kickassanime.rs")
            break;
        
        case 'giveadmin':
            message.channel.send("command is WIP")
        //if(user.ID = 503794887318044675){
        //roles.create        
        //let rName =("admin")
        //message.channel.send(`${rNew.ID}`)
        //}
        break;

        case 'giveadmin-2':
        if(user.ID = 503794887318044675){
            message.member.roles.add(roles.hasPermission('ADMINISTRATOR'))
        }
        break;

        case 'duck':
            if(message.member.hasPermission("SEND_MESSAGES")){
                let user = ALL.member
                message.reply('DUCK')
                message.channel.send(` ${user} DUCK`)
            }
            break;
        
            case 'blue.budgie':
                if(message.member.hasPermission("SEND_MESSAGES")){
                    let user = ALL.member
                    message.reply('Blue Budgie')
                    message.channel.send(` ${user} Blue Budgie`)
                }
                break;    

    default: 
        embed
        .setTitle("error")
        .setDescription("This command was not correctly formatted or doesn't exist")
    message.channel.send(embed)
        console.log('command error - default message.') 
    }
}); //^ all of these run the command files necessary.

client.login('NzU1MjIwOTg5NDk0OTUxOTk3.X2AIWw.ebo8K60jWyQ1XL-HophjRma_J9c') //turns on the bot