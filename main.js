const Discord = require('discord.js'); //uses discord.js to run
const { ALL } = require('dns');
const { create } = require('domain');
const fetch = require('node-fetch');
const get = require('node-fetch2');
const wait = require('util').promisify(setTimeout);
//added in discordjs 13
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json'); //get the value "token" from config.json
const { osuauthtoken, osuapikey, osuclientid, osuclientsecret } = require('./config.json');
const { trnkey } = require('./config.json')
process.on('warning', e => console.warn(e.stack));
const oncooldown = new Set();
const https = require('https'); // or 'https' for https:// URLs
const sql = require('sqlite')
const request = require(`request`);
//const triggerwords = require('./triggerwords.js')

//const msglogs = require('./sbrmsg.js')
//const modlogs = require('./sbrmodlogs.js')
const commandhandler = require('./commandhandler.js')

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
client.osucmds = new Discord.Collection();
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
    console.group('--- BOT IS NOW ONLINE ---')
    //console.log(triggerwords)
    console.log(`${currentDateISO} | ${currentDate}`)
    //console.log('kwsmrksnsm is online!'); //message shown when bot turns on
    console.log(`API Latency is ${Math.round(client.ws.ping)}ms`);
    console.log("")
    console.groupEnd()

    //msglogs(client)
    //modlogs(client)
    commandhandler(client, Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, monitorEventLoopDelay, setInterval)

    //Discord, osuauthtoken, osuapikey, osuclientid, osuclientsecret, trnkey, ytdl, prefix, monitorEventLoopDelay, setInterval

client.user.setPresence({ activities: [{ name: "you", type: 'WATCHING', video_url: 'https://youtube.com/saberstrkkdwmdr'}], status: `dnd`,});
})

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
    //console.group("--- ")
    console.log("saved osuauth")
    //console.groupEnd()
//
} //turns on the bot
catch (error) {
    console.group("--- DEBUG ---")
    console.log("login error")
    console.log(error)
    console.groupEnd()
}