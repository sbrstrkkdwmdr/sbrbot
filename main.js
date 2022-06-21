const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const Sequelize = require('sequelize');
const fetch = require('node-fetch');


const commandHandler = require('./commandHandler.js');
const linkHandler = require('./linkHandler.js');
const slashcommandHandler = require('./slashcommandHandler.js');
const config = require('./configs/config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS,
    ]
})

const { prefix, token, osuApiKey, osuClientID, osuClientSecret } = require('./configs/config.json');

client.commands = new Discord.Collection();
client.links = new Discord.Collection();
client.osucmds = new Discord.Collection();
client.admincmds = new Discord.Collection();

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

    client.user.setPresence({
        activities: [{
            name: "you | currently being rewritten",
            type: 'WATCHING',
            url: 'https://youtube.com/saberstrkkdwmdr',
        }],
        status: `dnd`,
        afk: 'false'
    });

})
client.login(token)
fetch('https://osu.ppy.sh/oauth/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'}
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
