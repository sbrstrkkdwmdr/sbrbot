const Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const Sequelize = require('sequelize');
const fetch = require('node-fetch');


const commandHandler = require('./commandHandler.js');
const linkHandler = require('./linkHandler.js');
const slashcommandHandler = require('./slashcommandHandler.js');
const checker = require('./checker.js');
const musichandler = require('./musicHandler.js');

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
client.links = new Discord.Collection();
client.osucmds = new Discord.Collection();
client.admincmds = new Discord.Collection();
client.musiccmds = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const linkFiles = fs.readdirSync('./links').filter(file => file.endsWith('.js'));
for (const file of linkFiles) {
    const link = require(`./links/${file}`);
    client.links.set(link.name, link);
}

const osuFiles = fs.readdirSync('./commands-osu').filter(file => file.endsWith('.js'));
for (const file of osuFiles) {
    const osu = require(`./commands-osu/${file}`);
    client.osucmds.set(osu.name, osu);
}

const admincommandFiles = fs.readdirSync('./commands-admin').filter(file => file.endsWith('.js'));
for (const file of admincommandFiles) {
    const admincommand = require(`./commands-admin/${file}`);
    client.admincmds.set(admincommand.name, admincommand);
}

const musicCommandFiles = fs.readdirSync('./commands-music').filter(file => file.endsWith('js'));
for (const file of musicCommandFiles) {
    const musiccommand = require(`./commands-music/${file}`)
    client.musiccmds.set(musiccommand.name, musiccommand)
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
    }

})
client.once('ready', () => {
    userdata.sync()
    console.log('Ready!');
    commandHandler(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    linkHandler(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    slashcommandHandler(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    checker(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);
    musichandler(userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config);

    //make a function that for every guild log the id
    client.guilds.cache.forEach(guild => {
        //check if a .log file with the guild id as the name exists
        if (!fs.existsSync(`./logs/${guild.id}.log`)) {
            //if not create a new file with the guild id as the name
            fs.writeFileSync(`./logs/${guild.id}.log`, ''
            )
        }

    }
    )


    client.user.setPresence({
        activities: [{
            name: "you | sbr-help",
            type: 'WATCHING',
            url: 'https://youtube.com/saberstrkkdwmdr',
        }],
        status: 'dnd',
        afk: false
    });

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

}).then(res => res.json())
    .then(res => {
        fs.writeFileSync('configs/osuauth.json', JSON.stringify(res))
    }
    )
