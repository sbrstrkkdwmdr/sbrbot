import Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
import fs = require('fs');
const Sequelize = require('sequelize');
import fetch from 'node-fetch';


const CommandHandler = require('./CommandHandler');
const LinkHandler = require('./LinkHandler.ts');
const SlashCommandHandler = require('./SlashCommandHandler');
const Moderator = require('./Moderator');
const MusicHandler = require('./MusicHandler');
const ButtonHandler = require('./ButtonHandler');
const CommandInit = require('./CommandInit');
const ExEvents = require('./ExEvents');

const config = require('./configs/config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.User
    ]
})

const { prefix, token, osuApiKey, osuClientID, osuClientSecret } = require('./configs/config.json');

client.commands = new Discord.Collection();
client.misccmds = new Discord.Collection();
client.links = new Discord.Collection();
client.osucmds = new Discord.Collection();
client.admincmds = new Discord.Collection();
client.musiccmds = new Discord.Collection();
client.tstcmds = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/general').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of commandFiles) {
    const command = require(`./commands/general/${file}`);
    client.commands.set(command.name, command);
}
const miscCommandFiles = fs.readdirSync('./commands/misc').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of miscCommandFiles) {
    const command = require(`./commands/misc/${file}`);
    client.misccmds.set(command.name, command);
}

const linkFiles = fs.readdirSync('./commands/links').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of linkFiles) {
    const link = require(`./commands/links/${file}`);
    client.links.set(link.name, link);
}

const osuFiles = fs.readdirSync('./commands/osu').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of osuFiles) {
    const osu = require(`./commands/osu/${file}`);
    client.osucmds.set(osu.name, osu);
}

const admincommandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of admincommandFiles) {
    const admincommand = require(`./commands/admin/${file}`);
    client.admincmds.set(admincommand.name, admincommand);
}

const musicCommandFiles = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of musicCommandFiles) {
    const musiccommand = require(`./commands/music/${file}`)
    client.musiccmds.set(musiccommand.name, musiccommand)
}
const testCommandFiles = fs.readdirSync('./test').filter(file => file.endsWith('.js') || file.endsWith('.ts'));
for (const file of testCommandFiles) {
    const testcommand = require(`./test/${file}`)
    client.tstcmds.set(testcommand.name, testcommand)
}

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const userdata = sequelize.define('userdata', {
    userid: {
        type: Sequelize.INTEGER,
        unique: true
    },
    osuname: Sequelize.TEXT,
    mode: {
        type: Sequelize.STRING,
        defaultValue: 'osu',
    },
    osuacc: Sequelize.FLOAT,
    osupp: Sequelize.INTEGER,
    osurank: Sequelize.INTEGER,
    taikoacc: Sequelize.FLOAT,
    taikopp: Sequelize.INTEGER,
    taikorank: Sequelize.INTEGER,
    fruitsacc: Sequelize.FLOAT,
    fruitspp: Sequelize.INTEGER,
    fruitsrank: Sequelize.INTEGER,
    maniaacc: Sequelize.FLOAT,
    maniapp: Sequelize.INTEGER,
    maniarank: Sequelize.INTEGER,
    skin: {
        type: Sequelize.STRING,
        defaultValue: 'https://osu.ppy.sh/community/forums/topics/129191',
    }
})

client.once('ready', () => {
    userdata.sync()
    console.log('Ready!');
    fs.appendFileSync('commands.log', `\n\n\nBOT IS NOW ONLINE\n${new Date()} | ${new Date().toISOString()}\n\n\n`, 'utf-8');
    CommandHandler(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    LinkHandler(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    SlashCommandHandler(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    Moderator(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    //MusicHandler(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    ButtonHandler(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    CommandInit(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    ExEvents(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);

    client.guilds.cache.forEach(guild => {
        if (!fs.existsSync(`./logs/${guild.id}.log`)) {
            fs.writeFileSync(`./logs/${guild.id}.log`, ''
            )
        }

    }
    )

    let songsarr = [
        "Yomi Yori kikoyu, Koukoku no hi to Honoo no Shoujo [Kurushimi]",
        "FREEDOM DiVE [FOUR DiMENSIONS]",
        "A FOOL MOON NIGHT [Piggey's Destruction]",
        "Sidetracked Day [Infinity Inside]",
        "Cirno's Perfect Math Class [TAG4]",
        "Glorious Crown [FOUR DIMENSIONS]",
        "Made of Fire [Oni]",
        "????????????????????? (Synth Rock Cover) [Together]",
        "C18H27NO3(extend) [Pure Darkness]",
        "BLUE DRAGON [Blue Dragon]",
        "-ERROR [Drowning]",
        "Remote Control [Insane] +HDDT",
        "Usatei 2011 [Ozzy's Extra]",
        "Chocomint's made of fire hddt 98.54 full combo",
        "Ascension to Heaven [Death] +HDDTHR",
        "Can't Defeat Airman [Holy Shit! It's Airman!!!]",
        "The Big Black [WHO'S AFRAID OF THE BIG BLACK]"
    ]

    let activityarr = [
        {
            name: "240BPM | sbr-help",
            type: 1,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: songsarr[Math.floor(Math.random() * songsarr.length)] + " | sbr-help",//"Yomi Yori kikoyu, Koukoku no hi to Honoo no Shoujo | sbr-help",
            type: 2,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "dt farm maps | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "nothing in particular | sbr-help",
            type: 3,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "no mod farm maps | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "hr | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: songsarr[Math.floor(Math.random() * songsarr.length)] + " | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        }
    ]

    client.user.setPresence({
        activities: [activityarr[0]],
        status: 'dnd',
        afk: false
    });
    setInterval(() => {
        client.user.setPresence({
            activities: [activityarr[Math.floor(Math.random() * activityarr.length)]],
            status: 'dnd',
            afk: false
        });
    }, 60 * 1000);

})
client.login(token)
fetch('https://osu.ppy.sh/oauth/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
    ,
    body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: osuClientID,
        client_secret: osuClientSecret,
        scope: 'public'
    })

}).then(res => res.json() as any)
    .then(res => {
        fs.writeFileSync('configs/osuauth.json', JSON.stringify(res))
    }
    )
fs.writeFileSync('debug/starttime.txt', (new Date()).toString())
export {};