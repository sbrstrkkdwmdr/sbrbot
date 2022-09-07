console.log('Loading...')
const initdate = new Date();

import Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
import fs = require('fs');
const Sequelize = require('sequelize');
import fetch from 'node-fetch';
import extypes = require('./src/types/extratypes');

const commandHandler = require('./commandHandler');
const linkHandler = require('./linkHandler.ts');
const moderator = require('./moderator');
const musicHandler = require('./musicHandler');
const buttonHandler = require('./buttonHandler');
const commandInit = require('./commandInit');
const exEvents = require('./exEvents');
const osutrack = require('./src/osutrack');

const config: extypes.config = require('./config/config.json');


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
const commandStruct = {
    commands: new Discord.Collection(),
    misccmds: new Discord.Collection(),
    links: new Discord.Collection(),
    osucmds: new Discord.Collection(),
    admincmds: new Discord.Collection(),
    musiccmds: new Discord.Collection(),
    tstcmds: new Discord.Collection(),
    buttons: new Discord.Collection(),
}

const commandFiles = fs.readdirSync('./commands/gen').filter(file => file.endsWith('.ts'));
const miscCommandFiles = fs.readdirSync('./commands/misc').filter(file => file.endsWith('.ts'));
const linkCommandFiles = fs.readdirSync('./commands/links').filter(file => file.endsWith('.ts'));
const osuCommandFiles = fs.readdirSync('./commands/osu').filter(file => file.endsWith('.ts'));
const adminCommandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.ts'));
const musicCommandFiles = fs.readdirSync('./commands/music').filter(file => file.endsWith('.ts'));


for (const file of commandFiles) {
    const command = require(`./commands/gen/${file}`);
    commandStruct.commands.set(command.name, command);
}
for (const file of miscCommandFiles) {
    const command = require(`./commands/misc/${file}`);
    commandStruct.misccmds.set(command.name, command);
}
for (const file of linkCommandFiles) {
    const command = require(`./commands/links/${file}`);
    commandStruct.links.set(command.name, command);
}
for (const file of osuCommandFiles) {
    const command = require(`./commands/osu/${file}`);
    commandStruct.osucmds.set(command.name, command);
}
for (const file of adminCommandFiles) {
    const command = require(`./commands/admin/${file}`);
    commandStruct.admincmds.set(command.name, command);
}
for (const file of musicCommandFiles) {
    const command = require(`./commands/music/${file}`);
    commandStruct.musiccmds.set(command.name, command);
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
});

client.once('ready', () => {
    const currentDate = new Date();

    userdata.sync();
    const timetostart = currentDate.getTime() - initdate.getTime()
    const initlog = `
===================================================================
BOT IS NOW ONLINE
-------------------------------------------------------------------
Boot time: ${timetostart}ms
Current Time: ${currentDate.toLocaleString()}
Current Time (epoch, ms): ${currentDate.getTime()}
Current Time (ISO): ${currentDate.toISOString()}
Current Client: ${client.user.tag} 
Current Client ID: ${client.user.id}
====================================================================
`
    console.log(initlog)

    const oncooldown = new Set();

    commandHandler(userdata, client, commandStruct, config, oncooldown);
    linkHandler(userdata, client, commandStruct, config, oncooldown);
    moderator(userdata, client, config, oncooldown);
    musicHandler(userdata, client, commandStruct, config, oncooldown);
    buttonHandler(userdata, client, commandStruct, config, oncooldown);
    commandInit(userdata, client, config, oncooldown);
    exEvents(userdata, client, config, oncooldown);
    osutrack(userdata, client, config, oncooldown);


    if (!fs.existsSync(`./debug`)) {
        console.log(`Creating debug folder`);
        fs.mkdirSync(`./debug`);
    }
    if (!fs.existsSync(`./previous`)) {
        console.log(`Creating previous IDs folder`);
        fs.mkdirSync(`./previous`);
    }
    if (!fs.existsSync(`./logs`)) {
        console.log(`Creating logs folder`);
        fs.mkdirSync(`./logs`);
    }
    if (!fs.existsSync(`./logs/gen`)) {
        console.log(`Creating logs/gen folder`);
        fs.mkdirSync(`./logs/gen`);
    }
    if (!fs.existsSync(`./logs/cmd`)) {
        console.log(`Creating logs/cmd folder`);
        fs.mkdirSync(`./logs/cmd`);
    }
    if (!fs.existsSync(`./logs/moderator`)) {
        console.log(`Creating logs/moderator folder`);
        fs.mkdirSync(`./logs/moderator`);
    }
    (async () => {
        await client.guilds.cache.forEach(guild => {
            if (!fs.existsSync(`./logs/moderator/${guild.id}.log`)) {
                console.log(`Creating moderator log for ${guild.name}`);
                fs.writeFileSync(`./logs/moderator/${guild.id}.log`, ''
                )
            }

        }
        )
    })();

    // setTimeout(() => {
        fs.appendFileSync('logs/general.log', `\n\n\n${initlog}\n\n\n`, 'utf-8');

        fs.writeFileSync('debug/starttime.txt', currentDate.toString());
        fetch('https://osu.ppy.sh/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
            ,
            body: JSON.stringify({
                grant_type: 'client_credentials',
                client_id: config.osuClientID,
                client_secret: config.osuClientSecret,
                scope: 'public'
            })

        }).then(res => res.json())
            .then(res => {
                fs.writeFileSync('config/osuauth.json', JSON.stringify(res))
                fs.appendFileSync('logs/updates.log', '\nosu auth token updated at ' + new Date().toLocaleString() + '\n')

            }
            )
            .catch(error => {
                fs.appendFileSync(`logs/updates.log`,
                    `
        ----------------------------------------------------
        ERROR
        node-fetch error: ${error}
        ----------------------------------------------------
        `, 'utf-8')
                return;
            });
    // }, 1000);
});
client.login(config.token)

export { };

