const { Constants } = require('discord.js');

module.exports = (client, Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, monitorEventLoopDelay, setInterval, token) => {

const fs = require('fs');
//ADDED FOR SLASH CMDS

let commands = client.application?.commands
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

//osu----------------

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
commands?.create({
    name: 'rs',
    description: 'most recent play for user',
    fetchReply: true,
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
commands?.create({
    name: 'skin',
    description: 'skins!!!',
    options: [
        {
            name: 'skin',
            description: 'the skin',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ]
})
commands?.create({
    name: 'map',
    description: 'search for a map',
    options: [
        {
            name: 'id',
            description: 'the map id. Uses the last stored map if not used.',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'mods',
            description: 'mods/game modifiers.',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
    ]
})
commands?.create({
    name: 'osu',
    description: 'osu! profile info',
    options: [
        {
            name: 'user',
            description: 'username or ID',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ]
})
//admin??
commands?.create({
    name: 'botstatus',
    description: 'edit the bots status! (requires permissions)',
    options: [
        {
            name: 'type',
            description: 'status type (playing, watching etc.)',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'text',
            description: 'text for the status',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'status',
            description: 'availability (do not disturb, online etc.)',
            required: false,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ]
})
commands?.create({
    name: 'guildleave',
    description: 'get the bot to leave a guild',
    options: [
        {
            name: 'guildid',
            description: 'the id of the guild to leave',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ]
})
commands?.create({
    name: 'guildlist',
    description: 'list all guilds the bot is in',
})
commands?.create({
    name: 'menutest',
    description: 'some menu test',
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
        interaction.reply('yeah this works')
        break;

    case 'ping':
        client.helpcmds.get('ping2').execute(interaction, client, Discord, currentDate, currentDateISO)
        break; 

    case 'convert':
        client.helpcmds.get('measureconvert2').execute(interaction, client, Discord, options, currentDate, currentDateISO)
        break; 

    case 'math':
        client.helpcmds.get('math2').execute(interaction, client, Discord, options, currentDate, currentDateISO)
        break;

    case 'help':
        client.helpcmds.get('help2').execute(interaction, options, Discord, commands, currentDate, currentDateISO)
        break;  

    //------osu
    case 'rs':
        console.log(interaction.commandId)
        if(!options.getString('mode') || options.getString('mode') == 'osu' || options.getString('mode') == 'o' || options.getString('mode') == 'standard' || options.getString('mode') == 'std'){
        client.osucmds.get('rs').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        return;
        }
        if(options.getString('mode') == 'catch the beat' || options.getString('mode') == 'ctb' || options.getString('mode') == 'c' || options.getString('mode') == 'catch') {
            client.osucmds.get('ctbrs').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
            return;
        }
        if(options.getString('mode') == 'mania' || options.getString('mode') == 'm') {
            client.osucmds.get('maniars').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
            return;
        }
        if(options.getString('mode') == 'taiko' || options.getString('mode') == 't') {
            client.osucmds.get('taikors').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
            return;
        }
        else interaction.reply(`error: mode doesn't exist. list of modes: osu, taiko, ctb, mania`)
        //else client.osucmds.get('rs').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(interaction, args, currentDate, currentDateISO)
        break;
    case 'osutop':
        if(!options.getString('mode') || options.getString('mode') == 'osu' || options.getString('mode') == 'o' || options.getString('mode') == 'standard' || options.getString('mode') == 'std'){
            client.osucmds.get('osutop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
            return;
            }
        if(options.getString('mode') == 'catch the beat' || options.getString('mode') == 'ctb' || options.getString('mode') == 'c' || options.getString('mode') == 'catch') {
            client.osucmds.get('ctbtop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
            return;
        }
        if(options.getString('mode') == 'mania' || options.getString('mode') == 'm') {
            client.osucmds.get('maniatop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
            return;
        }
        if(options.getString('mode') == 'taiko' || options.getString('mode') == 't') {
            client.osucmds.get('taikotop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
            return;
        }
        else interaction.reply(`error: mode doesn't exist. list of modes: osu, taiko, ctb, mania`)
        //else client.osucmds.get('osutop').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(interaction, args, currentDate, currentDateISO)
        break;
    case 'skin':
        client.osucmds.get('skin').execute(interaction, options, currentDate, currentDateISO)
        break;
    case 'map':
        client.osucmds.get('map').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        break
    case 'osu':
        client.osucmds.get('osu').execute(interaction, options, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret)
        //client.commands.get('WIP').execute(interaction, args, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret,)
        break;
        //admins---------------

    case 'botstatus':
        client.admincmds.get('botstatus2').execute(interaction, options, client, Discord, currentDate, currentDateISO)
        break;

    case 'guildleave':
        client.admincmds.get('gleave').execute(interaction, options, client, Discord, currentDate, currentDateISO)
        break;
    case 'guildlist':
        client.admincmds.get('serverlist').execute(interaction, options, client, Discord, currentDate, currentDateISO)
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

}// end
