console.log('Loading...');
const initdate = new Date();
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import fs from 'fs';
import Sequelize from 'sequelize';

import * as buttonHandler from './buttonHandler.js';
import * as commandHandler from './commandHandler.js';
import commandInit from './commandInit.js';
import exEvents from './exEvents.js';
import * as linkHandler from './linkHandler.js';
import osutrack from './src/osutrack.js';

import * as checks from './src/checks.js';

import inconfig from './config/config.json' assert { type: 'json' };
import { path } from './path.js';

const config = checks.checkConfig(inconfig);

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
});

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
    },
    timezone: {
        type: Sequelize.STRING,
        defaultValue: 'GMT',
    },
    location: {
        type: Sequelize.STRING,
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
});

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
});

client.once('ready', () => {
    const currentDate = new Date();

    userdata.sync();
    guildSettings.sync();
    trackDb.sync();
    statsCache.sync();
    const timetostart = currentDate.getTime() - initdate.getTime();
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
`;
    console.log(initlog);

    const oncooldown = new Set();

    if (!fs.existsSync(`${path}/config/osuauth.json`)) {
        console.log(`Creating ${path}/config/osuauth.json`);
        fs.writeFileSync(`${path}/config/osuauth.json`,
            '{"token_type": "Bearer", "expires_in": 1, "access_token": "blahblahblah"}', 'utf-8');
    }
    if (!fs.existsSync(`${path}/id.txt`)) {
        console.log(`Creating ${path}/id.txt`);
        fs.writeFileSync(`${path}/id.txt`, '0', 'utf-8');
    }
    if (!fs.existsSync(`${path}/trackingFiles`)) {
        console.log(`Creating ${path}/trackingFiles`);
        fs.mkdirSync(`${path}/trackingFiles`,);
    }

    if (!fs.existsSync(`${path}/debug`)) {
        console.log(`Creating ${path}/debug folder`);
        fs.mkdirSync(`${path}/debug`);
    }
    if (!fs.existsSync(`${path}/logs`)) {
        console.log(`Creating ${path}/logs folder`);
        fs.mkdirSync(`${path}/logs`);
    }
    if (!fs.existsSync(`${path}/logs/totalcommands.txt`)) {
        console.log(`Creating ${path}/logs/totalcommands.txt`);
        fs.writeFileSync(`${path}/logs/totalcommands.txt`, '0', 'utf-8');
    }
    if (!fs.existsSync(`${path}/logs/gen`)) {
        console.log(`Creating ${path}/logs/gen folder`);
        fs.mkdirSync(`${path}/logs/gen`);
    }
    if (!fs.existsSync(`${path}/logs/cmd`)) {
        console.log(`Creating ${path}/logs/cmd folder`);
        fs.mkdirSync(`${path}/logs/cmd`);
    }
    if (!fs.existsSync(`${path}/logs/moderator`)) {
        console.log(`Creating ${path}/logs/moderator folder`);
        fs.mkdirSync(`${path}/logs/moderator`);
    }
    if (!fs.existsSync(`${path}/trackingFiles`)) {
        console.log(`Creating ${path}/trackingFiles folder`);
        fs.mkdirSync(`${path}/trackingFiles`);
    }
    if (!fs.existsSync(`${path}/cache`)) {
        console.log(`Creating ${path}/cache folder`);
        fs.mkdirSync(`${path}/cache`);
    }
    if (!fs.existsSync(`${path}/cache/commandData`)) {
        console.log(`Creating ${path}/cache/commandData folder`);
        fs.mkdirSync(`${path}/cache/commandData`);
    }
    if (!fs.existsSync(`${path}/cache/debug`)) {
        console.log(`Creating ${path}/cache/debug folder`);
        fs.mkdirSync(`${path}/cache/debug`);
    }
    if (!fs.existsSync(`${path}/cache/debug/command`)) {
        console.log(`Creating ${path}/cache/debug/command folder`);
        fs.mkdirSync(`${path}/cache/debug/command`);
    }
    if (!fs.existsSync(`${path}/cache/previous`)) {
        console.log(`Creating previous IDs folder (${path}/previous)`);
        fs.mkdirSync(`${path}/cache/previous`);
    }
    if (!fs.existsSync(`${path}/cache/graphs`)) {
        console.log(`Creating ${path}/cache/graphs/ folder`);
        fs.mkdirSync(`${path}/cache/graphs`);
    }
    if (!fs.existsSync(`${path}/cache/errors`)) {
        console.log(`Creating ${path}/cache/errors/ folder`);
        fs.mkdirSync(`${path}/cache/errors`);
    }
    if (!fs.existsSync(`${path}/files`)) {
        console.log(`Creating ${path}/files folder`);
        fs.mkdirSync(`${path}/files`);
    }
    if (!fs.existsSync(`${path}/files/maps`)) {
        console.log(`Creating ${path}/files/maps folder`);
        fs.mkdirSync(`${path}/files/maps`);
    }
    if (!fs.existsSync(`${path}/files/replays`)) {
        console.log(`Creating ${path}/files/replays folder`);
        fs.mkdirSync(`${path}/files/replays`);
    }
    if (!fs.existsSync(`${path}/files/localmaps`)) {
        console.log(`Creating ${path}/files/localmaps folder`);
        fs.mkdirSync(`${path}/files/localmaps`);
    }

    if (!fs.existsSync(`${path}/logs/debug.log`)) {
        fs.writeFileSync(`${path}/logs/debug.log`, '');
    }
    if (!fs.existsSync(`${path}/logs/updates.log`)) {
        fs.writeFileSync(`${path}/logs/updates.log`, '');
    }
    if (!fs.existsSync(`${path}/logs/err.log`)) {
        fs.writeFileSync(`${path}/logs/err.log`, '');
    }
    if (!fs.existsSync(`${path}/logs/warn.log`)) {
        fs.writeFileSync(`${path}/logs/warn.log`, '');
    }
    if (!fs.existsSync(`${path}/logs/general.log`)) {
        fs.writeFileSync(`${path}/logs/general.log`, '');
    }

    commandInit({ userdata, client, config, oncooldown });
    exEvents({ userdata, client, config, oncooldown, guildSettings, statsCache });
    osutrack({ userdata, client, config, oncooldown, trackDb, guildSettings });

    client.on('messageCreate', async (message) => {
        linkHandler.onMessage({ userdata, client, config, oncooldown, guildSettings, statsCache }, message); //{}
        commandHandler.onMessage({ userdata, client, config, oncooldown, guildSettings, trackDb, statsCache }, message);
    });
    client.on('interactionCreate', async (interaction) => {
        commandHandler.onInteraction({ userdata, client, config, oncooldown, guildSettings, trackDb, statsCache }, interaction);
        buttonHandler.onInteraction({ userdata, client, config, oncooldown, statsCache }, interaction);
    });

    fs.appendFileSync(`${path}/logs/general.log`, `\n\n\n${initlog}\n\n\n`, 'utf-8');

    fs.writeFileSync(`${path}/debug/starttime.txt`, currentDate.toString());
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
`;
    if (fs.existsSync(`${path}/logs`)) {
        if (fs.existsSync(`${path}/logs/debug.log`)) {
            fs.appendFileSync(`${path}/logs/debug.log`, text + '\n', 'utf-8');
        } else {
            fs.writeFileSync(`${path}/logs/debug.log`, text + '\n', 'utf-8');
        }
    }
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
`;
    if (fs.existsSync(`${path}/logs`)) {
        if (fs.existsSync(`${path}/logs/warn.log`)) {
            fs.appendFileSync(`${path}/logs/warn.log`, text + '\n', 'utf-8');
        } else {
            fs.writeFileSync(`${path}/logs/warn.log`, text + '\n', 'utf-8');
        }
    }
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
`;
    if (fs.existsSync(`${path}/logs`)) {
        if (fs.existsSync(`${path}/logs/err.log`)) {
            fs.appendFileSync(`${path}/logs/err.log`, text + '\n', 'utf-8');
        } else {
            fs.writeFileSync(`${path}/logs/err.log`, text + '\n', 'utf-8');
        }
    }
});


client.login(config.important.token);

process.on('warning', e => {
    console.log(e.stack);
    console.warn(e.stack);
});

export { };

