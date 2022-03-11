const { Constants } = require('discord.js');

module.exports = (client, Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, monitorEventLoopDelay, setInterval, token) => {

const { prefix } = require('./config.json')

const fs = require('fs');
//ADDED FOR SLASH CMDS
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const guildid = '724514625005158400'
const guild = client.guilds.cache.get(guildid)
let commands 

if (guild) {
    commands = guild.commands
} else {
    commands = client.application?.commands
}
commands?.create({
    name: 'ping',
    description: 'replies with pong.',
})
commands?.create({
    name: 'test',
    description: 'test if / works',
})
commands?.create({
    name: 'convert',
    description: 'convert values (eg fahrenheit to kelvin)',
    options: [
        {
            name: 'type',
            description: 'what you are converting.',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'number',
            description: 'the number to convert', 
            required: false,
            type: Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ]
})
commands?.create({
    name: 'math',
    description: 'simple math calculator',
    options: [
        {
            name: 'type',
            description: 'method',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'num1',
            description: 'first number', 
            required: false,
            type: Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'num2',
            description: 'second number', 
            required: false,
            type: Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ]
})
commands?.create({
    name: 'help',
    description: 'lists all commands',
    options: [
        {
            name: 'command',
            description: 'provide info on this command',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ]
})
commands?.create({
    name: 'osutop',
    description: 'top 5 plays for a user',
    options: [
        {
            name: 'user',
            description: 'the user. can be in ID or username',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'offset',
            description: 'if you want page offset', 
            required: false,
            type: Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'mode',
            description: 'what mode?', 
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ]
})

client.on('interactionCreate', async (interaction) =>{
    if (!interaction.isCommand()) return
    //console.log(interaction)

    let consoleloguserweeee = interaction.author
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

    const { commandName, options} = interaction

    switch (commandName) //variable to check for
    {

    case 'test': //if command = 'test' blahblablah
        interaction.reply('penis')
        break;

    case 'ping':
        client.helpcmds.get('ping').execute(interaction, client, Discord, currentDate, currentDateISO)
        break; 

    case 'convert':
        client.helpcmds.get('measureconvert').execute(interaction, client, Discord, options, currentDate, currentDateISO)
        break; 

    case 'math':
        client.helpcmds.get('math').execute(interaction, client, Discord, options, currentDate, currentDateISO)

    case 'help':
        client.helpcmds.get('help').execute(interaction, options, guild, commands, currentDate, currentDateISO)
        break;  

    //------osu
    case 'rs':case 'recent':
        if(!options.getString('mode') || options.getString('mode') == 'osu' || options.getString('mode') == 'o' || options.getString('mode') == 'standard' || options.getString('mode') == 'std'){
        client.osucmds.get('rs').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        }
        if(options.getString('mode') == 'catch the beat' || options.getString('mode') == 'ctb' || options.getString('mode') == 'c' || options.getString('mode') == 'catch') {
            client.osucmds.get('ctbrs').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        }
        if(options.getString('mode') == 'mania' || options.getString('mode') == 'm') {
            client.osucmds.get('maniars').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        }
        if(options.getString('mode') == 'taiko' || options.getString('mode') == 't') {
            client.osucmds.get('taikors').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        }
        else client.osucmds.get('rs').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(interaction, args, currentDate, currentDateISO)
        break;
    case 'osutop':case 'recent':
        if(!options.getString('mode') || options.getString('mode') == 'osu' || options.getString('mode') == 'o' || options.getString('mode') == 'standard' || options.getString('mode') == 'std'){
            client.osucmds.get('osutop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
            }
        if(options.getString('mode') == 'catch the beat' || options.getString('mode') == 'ctb' || options.getString('mode') == 'c' || options.getString('mode') == 'catch') {
            client.osucmds.get('ctbtop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        }
        if(options.getString('mode') == 'mania' || options.getString('mode') == 'm') {
            client.osucmds.get('maniatop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        }
        if(options.getString('mode') == 'taiko' || options.getString('mode') == 't') {
            client.osucmds.get('taikotop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        }
        else client.osucmds.get('osutop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(interaction, args, currentDate, currentDateISO)
        break;
    /*
    case  'links':
        client.helpcmds.get('links').execute(interaction, args, currentDate, currentDateISO)
        break;

    case 'roll':case 'numgen':
        client.commands.get('roll').execute(interaction, args, currentDate, currentDateISO)
        break; 

    case 'osu':
        client.osucmds.get('osu').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(interaction, args, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,)
        break;

    case 'osugraph':
        client.osucmds.get('osugraph').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;

    case 'osutop':
        client.osucmds.get('osutop').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(interaction, args, currentDate, currentDateISO)
        break;

    case 'osutest':
        client.osucmds.get('osutest').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(interaction, args, currentDate, currentDateISO)
        break;
    case 'osubest':
        client.osucmds.get('osubest').execute(interaction, args, Discord, currentDate, currentDateISO)
        break;

    case 'map':case 'mapinfo':
        client.osucmds.get('map').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;

    case 'pastmap'://case 'mapinfo':
        client.osucmds.get('pastmap').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;

    case 'osuid':
        client.osucmds.get('osuid').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;

    case 'osubestrs':
      client.osucmds.get('osubestrs').execute(interaction, args, Discord, currentDate, currentDateISO, curdateyesterday, curdatetmr, curtimezone)
      break;

    case 'danser':
        client.osucmds.get('danser').execute(interaction, args, currentDate, currentDateISO)
        break;

    case 'skin':
        client.osucmds.get('skin').execute(interaction, args, currentDate, currentDateISO)
        break;

    case 'tsfm':case 'c':
        client.osucmds.get('tsfm').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
    
    case 'osuauth':
        client.osucmds.get('osuauth').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;  

    case 'osusave':case 'osuset':
        client.osucmds.get('osusave').call(interaction, args, Discord, currentDate, currentDateISO)
        break;

    case 'maniars':case 'maniarecent':case 'rsmania':case 'recentmania':
        client.osucmds.get('maniars').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
    case 'maniatop':case 'topmania':
        client.osucmds.get('maniatop').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
    /*case 'maniatsfm':case 'maniac':case 'tsfmmania':case 'cmania':
        client.osucmds.get('maniatsfm').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;*/
        /*

    case 'taikors':case 'taikorecent':case 'rstaiko':case 'recenttaiko':
        client.osucmds.get('taikors').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
    case 'taikotop':case 'toptaiko':
        client.osucmds.get('taikotop').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
        
    case 'ctbrs':case 'ctbrecent':case 'rsctb':case 'recentctb':
        client.osucmds.get('ctbrs').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
    case 'ctbtop':case 'topctb':
        client.osucmds.get('ctbtop').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;
    
    case 'pp':
        client.osucmds.get('pp').execute(interaction, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break;*/

    default:
        return;
        break;
    }

});

client.linkdetect = new Discord.Collection();

const linkFiles = fs.readdirSync('./links/').filter(file => file.endsWith('.js'));
for(const file of linkFiles){
    const link = require(`./links/${file}`);

    client.linkdetect.set(link.name, link);
}
client.on('messageCreate', message => {
    const args = message.content.slice(prefix.length).split(/ +/); //args are the message content but without the prefix
    const linkargs = message.content.split(/ +/); //linkargs are the message content
    const triggerwords = require('./triggerwords.json');
    const triggerstring = message.content.toString();
    const foundtriggers = triggerwords.find(v => (triggerstring.includes(v)));

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
   
    if (message.content.startsWith('https://osu.ppy.sh/b/') || message.content.startsWith('osu.ppy.sh/b/') || message.content.startsWith('https://osu.ppy.sh/beatmaps/') || message.content.startsWith('osu.ppy.sh/beatmaps/')){
        client.linkdetect.get('osumaplink').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret);
    } 
    if (message.content.startsWith('https://osu.ppy.sh/beatmapsets/') || message.content.startsWith('osu.ppy.sh/beatmapsets')){
        client.linkdetect.get('osulongmaplink').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret);
    }
    if (message.content.startsWith('https://osu.ppy.sh/u/') || message.content.startsWith('osu.ppy.sh/u/') || message.content.startsWith('https://osu.ppy.sh/users/') || message.content.startsWith('osu.ppy.sh/users/')){
        client.linkdetect.get('osuprofilelink').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret);
    } 
    
    if (foundtriggers){
        client.admincmds.get('triggers').execute(message, args, linkargs, Discord, client, currentDate, currentDateISO)
    }

    

    //REPLAY GRABBER
    if (message.attachments.size > 0 && message.attachments.every(attachIsOsr)){       
        attachosr = message.attachments.first().url 
        //console.log(attachosr)
    
    let osrdlfile = fs.createWriteStream('./files/replay.osr') 
    let requestw = https.get(`${attachosr}`, function(response) {
        response.pipe(osrdlfile); 

        //console.log('success')
      });
        console.log('')
        setTimeout(() =>{            
            client.linkdetect.get('replayparse').execute(linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        }, 1500);
        if(message.channelId == '945600391343656970'){
        //replayrecord
        function exec(cmd, handler = function(error, stdout, stderr){console.log(stdout);if(error !== null){console.log(stderr)}})
{
    const childfork = require('child_process');
    return childfork.exec(cmd, handler);
}
        setTimeout(() =>{    
        //client.linkdetect.get('replayrecord').execute(exec, linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        client.linkdetect.get('replayrecordv2').execute(exec, linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        }, 1500);
            }
            
        }

    
            
    function attachIsOsr(msgAttach) {
        var url = msgAttach.url;
        return url.indexOf("osr", url.length - "osr".length /*or 3*/) !== -1;
    } //check if attachments are osr. can be changed to other file types
})

}// end
