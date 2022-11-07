console.log('Loading...')
const initdate = new Date();

import Discord = require('discord.js');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
import fs = require('fs');
import Sequelize = require('sequelize');
import fetch from 'node-fetch';
import extypes = require('./src/types/extratypes');

const commandHandler = require('./commandHandler');
const linkHandler = require('./linkHandler.ts');
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

const sequelize = new Sequelize.Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});



const userdata = sequelize.define('userdata', {
    userid: {
        type: Sequelize.STRING,
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

const guildSettings = sequelize.define('guildSettings', {
    guildid: {
        type: Sequelize.TEXT,
        unique: true
    },
    guildname: Sequelize.TEXT,
    prefix: {
        type: Sequelize.STRING,
        defaultValue: 'sbr-',
    },
    osuParseLinks: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    osuParseScreenshots: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    trackChannel: {
        type: Sequelize.STRING,
        defaultValue: null,
    }
});

const trackDb = sequelize.define('trackUsers', {
    osuid: {
        type: Sequelize.STRING,
        unique: true
    },
    guilds: {
        type: Sequelize.STRING,
    },
    guildsosu: {
        type: Sequelize.STRING,
    },
    guildstaiko: {
        type: Sequelize.STRING,
    },
    guildsfruits: {
        type: Sequelize.STRING,
    },
    guildsmania: {
        type: Sequelize.STRING,
    },
})

const statsCache = sequelize.define('statsCache', {
    osuid: {
        type: Sequelize.STRING,
        unique: true
    },
    country: Sequelize.STRING,

    osupp: Sequelize.STRING,
    osurank: Sequelize.STRING,
    osuacc: Sequelize.STRING,

    taikopp: Sequelize.STRING,
    taikorank: Sequelize.STRING,
    taikoacc: Sequelize.STRING,

    fruitspp: Sequelize.STRING,
    fruitsrank: Sequelize.STRING,
    fruitsacc: Sequelize.STRING,

    maniapp: Sequelize.STRING,
    maniarank: Sequelize.STRING,
    maniaacc: Sequelize.STRING,
})

client.once('ready', () => {
    const currentDate = new Date();

    userdata.sync();
    guildSettings.sync();
    trackDb.sync();
    statsCache.sync();
    const timetostart = currentDate.getTime() - initdate.getTime()
    const initlog = `
====================================================
BOT IS NOW ONLINE
----------------------------------------------------
Boot time:                ${timetostart}ms
Current Time:             ${currentDate.toLocaleString()}
Current Time (ISO):       ${currentDate.toISOString()}
Current Time (epoch, ms): ${currentDate.getTime()}
Current Client:           ${client.user.tag} 
Current Client ID:        ${client.user.id}
====================================================
`
    console.log(initlog)

    const oncooldown = new Set();

    commandHandler(userdata, client, config, oncooldown, guildSettings, trackDb, statsCache);
    linkHandler(userdata, client, config, oncooldown, guildSettings);
    buttonHandler(userdata, client, config, oncooldown, statsCache);
    commandInit(userdata, client, config, oncooldown);
    exEvents(userdata, client, config, oncooldown, guildSettings, statsCache);
    osutrack(userdata, client, config, oncooldown, trackDb, guildSettings);

    if (!fs.existsSync(`./id.txt`)) {
        console.log(`Creating ./id.txt`);
        fs.writeFileSync(`./id.txt`, '0', 'utf-8');
    }
    if (!fs.existsSync(`./debug`)) {
        console.log(`Creating ./debug folder`);
        fs.mkdirSync(`./debug`);
    }
    if (!fs.existsSync(`./logs`)) {
        console.log(`Creating ./logs folder`);
        fs.mkdirSync(`./logs`);
    }
    if (!fs.existsSync(`./logs/gen`)) {
        console.log(`Creating ./logs/gen folder`);
        fs.mkdirSync(`./logs/gen`);
    }
    if (!fs.existsSync(`./logs/cmd`)) {
        console.log(`Creating ./logs/cmd folder`);
        fs.mkdirSync(`./logs/cmd`);
    }
    if (!fs.existsSync(`./logs/moderator`)) {
        console.log(`Creating ./logs/moderator folder`);
        fs.mkdirSync(`./logs/moderator`);
    }
    if (!fs.existsSync(`./trackingFiles`)) {
        console.log(`Creating ./trackingFiles folder`);
        fs.mkdirSync(`./trackingFiles`);
    }
    if (!fs.existsSync(`./cache`)) {
        console.log('Creating ./cache folder');
        fs.mkdirSync('./cache');
    }
    if (!fs.existsSync(`./cache/commandData`)) {
        console.log('Creating ./cache/commandData folder');
        fs.mkdirSync('./cache/commandData');
    }
    if (!fs.existsSync(`./cache/debug`)) {
        console.log(`Creating ./cache/debug folder`);
        fs.mkdirSync(`./cache/debug`);
    }
    if (!fs.existsSync(`./cache/previous`)) {
        console.log(`Creating previous IDs folder (./previous)`);
        fs.mkdirSync(`./cache/previous`);
    }
    if(!fs.existsSync(`./cache/graphs`)){
        console.log(`Creating ./cache/graphs/ folder`);
        fs.mkdirSync(`./cache/graphs`);
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
            const rn = new Date();
            fs.appendFileSync(`logs/updates.log`,
                `
====================================================
ERROR
----------------------------------------------------
Date:             ${rn}
Date (ISO):       ${rn.toISOString()}
Date (epoch, ms): ${rn.getTime()}
----------------------------------------------------
node-fetch error: ${error}
====================================================
`, 'utf-8')
            return;
        });
});
client.on('debug', (info) => {
    const rn = new Date();
    const text = `
====================================================
DEBUG
----------------------------------------------------
Date:             ${rn}
Date (ISO):       ${rn.toISOString()}
Date (epoch, ms): ${rn.getTime()}
----------------------------------------------------
${info}
====================================================
`


    fs.appendFileSync(`./logs/debug.log`, text + '\n', 'utf-8');
});
client.on('warn', (info) => {
    const rn = new Date();
    const text = `
====================================================
WARN
----------------------------------------------------
Date:             ${rn}
Date (ISO):       ${rn.toISOString()}
Date (epoch, ms): ${rn.getTime()}
----------------------------------------------------
${info}
====================================================
`
    fs.appendFileSync(`./logs/warn.log`, text + '\n', 'utf-8');
});
client.on('error', (error) => {
    const rn = new Date();
    const text = `
====================================================
ERROR
----------------------------------------------------
Date:             ${rn}
Date (ISO):       ${rn.toISOString()}
Date (epoch, ms): ${rn.getTime()}
----------------------------------------------------
${error}
====================================================
`
    fs.appendFileSync(`./logs/err.log`, text + '\n', 'utf-8');
});


client.login(config.token)

export { };

