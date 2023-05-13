console.log('Loading...');
const initdate = new Date();

import Discord, { Client, GatewayIntentBits, Partials } from 'discord.js';
import fs from 'fs';
import fetch from 'node-fetch';
import Sequelize from 'sequelize';
import * as extypes from './src/types/extratypes.js';

import buttonHandler from './buttonHandler.js';
import commandHandler from './commandHandler.js';
import commandInit from './commandInit.js';
import exEvents from './exEvents.js';
import linkHandler from './linkHandler.js';
import osutrack from './src/osutrack.js';

import * as admincmds from './commands/cmdAdmin.js';
import * as checkcmds from './commands/cmdChecks.js';
import * as commands from './commands/cmdGeneral.js';
import * as misccmds from './commands/cmdMisc.js';
import * as osucmds from './commands/cmdosu.js';

import https from 'https';
import tesseract from 'tesseract.js';
import * as checks from './src/checks.js';
import * as cmdconfig from './src/consts/commandopts.js';
import * as cd from './src/consts/cooldown.js';
import * as mainconst from './src/consts/main.js';
import * as embedStuff from './src/embed.js';
import * as osufunc from './src/osufunc.js';
import * as func from './src/tools.js';
import * as trackfunc from './src/trackfunc.js';

import config from './config/config.json' assert { type: 'json' };
import { path } from './path.js';

import SoftUI from 'dbd-soft-ui';
import DBD from 'discord-dashboard';
import * as dashboardcmds from './src/consts/dbdcmd.js';
let langsSettings = {};

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


    if (!fs.existsSync(`${path}\\id.txt`)) {
        console.log(`Creating ${path}\\id.txt`);
        fs.writeFileSync(`${path}\\id.txt`, '0', 'utf-8');
    }
    if (!fs.existsSync(`${path}\\trackingFiles`)) {
        console.log(`Creating ${path}\\trackingFiles`);
        fs.writeFileSync(`${path}\\trackingFiles`, '0', 'utf-8');
    }

    if (!fs.existsSync(`${path}\\debug`)) {
        console.log(`Creating ${path}\\debug folder`);
        fs.mkdirSync(`${path}\\debug`);
    }
    if (!fs.existsSync(`${path}\\logs`)) {
        console.log(`Creating ${path}\\logs folder`);
        fs.mkdirSync(`${path}\\logs`);
    }
    if (!fs.existsSync(`${path}\\logs\\totalcommands.txt`)) {
        console.log(`Creating ${path}\\logs\\totalcommands.txt`);
        fs.writeFileSync(`${path}\\logs\\totalcommands.txt`, '0', 'utf-8');
    }
    if (!fs.existsSync(`${path}\\logs\\gen`)) {
        console.log(`Creating ${path}\\logs\\gen folder`);
        fs.mkdirSync(`${path}\\logs\\gen`);
    }
    if (!fs.existsSync(`${path}\\logs\\cmd`)) {
        console.log(`Creating ${path}\\logs\\cmd folder`);
        fs.mkdirSync(`${path}\\logs\\cmd`);
    }
    if (!fs.existsSync(`${path}\\logs\\moderator`)) {
        console.log(`Creating ${path}\\logs\\moderator folder`);
        fs.mkdirSync(`${path}\\logs\\moderator`);
    }
    if (!fs.existsSync(`${path}\\trackingFiles`)) {
        console.log(`Creating ${path}\\trackingFiles folder`);
        fs.mkdirSync(`${path}\\trackingFiles`);
    }
    if (!fs.existsSync(`${path}\\cache`)) {
        console.log(`Creating ${path}\\cache folder`);
        fs.mkdirSync(`${path}\\cache`);
    }
    if (!fs.existsSync(`${path}\\cache\\commandData`)) {
        console.log(`Creating ${path}\\cache\\commandData folder`);
        fs.mkdirSync(`${path}\\cache\\commandData`);
    }
    if (!fs.existsSync(`${path}\\cache\\debug`)) {
        console.log(`Creating ${path}\\cache\\debug folder`);
        fs.mkdirSync(`${path}\\cache\\debug`);
    }
    if (!fs.existsSync(`${path}\\cache\\debug\\command`)) {
        console.log(`Creating ${path}\\cache\\debug\\command folder`);
        fs.mkdirSync(`${path}\\cache\\debug\\command`);
    }
    if (!fs.existsSync(`${path}\\cache\\previous`)) {
        console.log(`Creating previous IDs folder (${path}\\previous)`);
        fs.mkdirSync(`${path}\\cache\\previous`);
    }
    if (!fs.existsSync(`${path}\\cache\\graphs`)) {
        console.log(`Creating ${path}\\cache\\graphs\\ folder`);
        fs.mkdirSync(`${path}\\cache\\graphs`);
    }
    if (!fs.existsSync(`${path}\\cache\\errors`)) {
        console.log(`Creating ${path}\\cache\\errors\\ folder`);
        fs.mkdirSync(`${path}\\cache\\errors`);
    }
    if (!fs.existsSync(`${path}\\files`)) {
        console.log(`Creating ${path}\\files folder`);
        fs.mkdirSync(`${path}\\files`);
    }
    if (!fs.existsSync(`${path}\\files\\maps`)) {
        console.log(`Creating ${path}\\files\\maps folder`);
        fs.mkdirSync(`${path}\\files\\maps`);
    }
    if (!fs.existsSync(`${path}\\files\\replays`)) {
        console.log(`Creating ${path}\\files\\replays folder`);
        fs.mkdirSync(`${path}\\files\\replays`);
    }
    if (!fs.existsSync(`${path}\\files\\localmaps`)) {
        console.log(`Creating ${path}\\files\\localmaps folder`);
        fs.mkdirSync(`${path}\\files\\localmaps`);
    }

    if (!fs.existsSync(`${path}\\logs\\debug.log`)) {
        fs.writeFileSync(`${path}\\logs\\debug.log`, '');
    }
    if (!fs.existsSync(`${path}\\logs\\updates.log`)) {
        fs.writeFileSync(`${path}\\logs\\updates.log`, '');
    }
    if (!fs.existsSync(`${path}\\logs\\err.log`)) {
        fs.writeFileSync(`${path}\\logs\\err.log`, '');
    }
    if (!fs.existsSync(`${path}\\logs\\warn.log`)) {
        fs.writeFileSync(`${path}\\logs\\warn.log`, '');
    }
    if (!fs.existsSync(`${path}\\logs\\general.log`)) {
        fs.writeFileSync(`${path}\\logs\\general.log`, '');
    }

    //commandHandler(blahblahblah) //loop
    commandHandler({ userdata, client, config, oncooldown, guildSettings, trackDb, statsCache }); //instead of running once, the function should always be active
    linkHandler({ userdata, client, config, oncooldown, guildSettings, statsCache }); //{}
    buttonHandler({ userdata, client, config, oncooldown, statsCache });
    commandInit({ userdata, client, config, oncooldown });
    exEvents({ userdata, client, config, oncooldown, guildSettings, statsCache });
    osutrack({ userdata, client, config, oncooldown, trackDb, guildSettings });

    fs.appendFileSync(`${path}\\logs\\general.log`, `\n\n\n${initlog}\n\n\n`, 'utf-8');

    fs.writeFileSync(`${path}\\debug\\starttime.txt`, currentDate.toString());
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
            fs.writeFileSync(`${path}\\config\\osuauth.json`, JSON.stringify(res));
            fs.appendFileSync(`${path}\\logs\\updates.log`, '\nosu auth token updated at ' + new Date().toLocaleString() + '\n');

        }
        )
        .catch(error => {
            const rn = new Date();
            fs.appendFileSync(`${path}\\logs\\updates.log`,
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
`, 'utf-8');
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
`;
    if (fs.existsSync(`${path}\\logs`)) {
        if (fs.existsSync(`${path}\\logs\\debug.log`)) {
            fs.appendFileSync(`${path}\\logs\\debug.log`, text + '\n', 'utf-8');
        } else {
            fs.writeFileSync(`${path}\\logs\\debug.log`, text + '\n', 'utf-8');
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
    if (fs.existsSync(`${path}\\logs`)) {
        if (fs.existsSync(`${path}\\logs\\warn.log`)) {
            fs.appendFileSync(`${path}\\logs\\warn.log`, text + '\n', 'utf-8');
        } else {
            fs.writeFileSync(`${path}\\logs\\warn.log`, text + '\n', 'utf-8');
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
    if (fs.existsSync(`${path}\\logs`)) {
        if (fs.existsSync(`${path}\\logs\\err.log`)) {
            fs.appendFileSync(`${path}\\logs\\err.log`, text + '\n', 'utf-8');
        } else {
            fs.writeFileSync(`${path}\\logs\\err.log`, text + '\n', 'utf-8');
        }
    }
});

(async () => {
    await DBD.useLicense(config.important.dbd_license);
    DBD.Dashboard = DBD.UpdatedClass();

    const Dashboard = new DBD.Dashboard({
        port: 80,
        client: {
            id: config.important.client_id,
            secret: config.important.client_secret
        },
        redirectUri: config.important.redirect_uri,
        domain: 'http://localhost',
        bot: client,
        ownerIDs: config.ownerusers,
        useThemeMaintenance: true,
        useTheme404: true,
        theme: SoftUI({
            customThemeOptions: {
                //@ts-expect-error idfk
                index: async ({ req, res, config }) => {
                    return {
                        values: [],
                        graph: {}, // More info at https://dbd-docs.assistantscenter.com/soft-ui/docs/customThemeOptions/
                        cards: [],
                    };
                },
            },
            websiteName: "sbrbot",
            colorScheme: "pink",
            supporteMail: "support@support.com",
            icons: {
                favicon: "https://assistantscenter.com/wp-content/uploads/2021/11/cropped-cropped-logov6.png",
                noGuildIcon: "https://pnggrid.com/wp-content/uploads/2021/05/Discord-Logo-Circle-1024x1024.png",
                sidebar: {
                    darkUrl: "https://assistantscenter.com/api/user/avatar/63ad65e2d3f1b1b3acdff794",
                    lightUrl: "https://assistantscenter.com/api/user/avatar/63ad65e2d3f1b1b3acdff794",
                    hideName: true,
                    borderRadius: false,
                    alignCenter: true,
                },
            },
            preloader: {
                image: "/img/soft-ui.webp",
                spinner: false,
                text: "Page is loading",
            },
            index: {
                graph: {
                    enabled: true,
                    lineGraph: false,
                    tag: 'Memory (MB)',
                    max: 100
                },
            },
            sweetalert: {
                errors: {
                    requirePremium: 'require premium error'
                },
                success: {
                    login: "Successfully logged in.",
                }
            },
            admin: {
                pterodactyl: {
                    enabled: false,
                    apiKey: "apiKey",
                    panelLink: "https://panel.website.com",
                    serverUUIDs: []
                }
            },
            commands: dashboardcmds.exCmds,
            locales: {
                enUK: {
                    name: "English",
                    index: {
                        feeds: ["Current Users", "CPU", "System Platform", "Server Count"],
                        card: {
                            image: "link to image",
                            category: "Soft UI",
                            title: "Assistants - The center of everything",
                            description:
                                "Assistants Discord Bot management panel. Assistants Bot was created to give others the ability to do what they want. Just.<br>That's an example text. <br><br><b><i>Feel free to use HTML</i></b>",
                            footer: "Learn More"
                        },
                        feedsTitle: "Feeds",
                        graphTitle: "Graphs"
                    },
                    manage: {
                        settings: {
                            memberCount: "Members",
                            info: {
                                info: "Info",
                                server: "Server Information"
                            }
                        }
                    },
                    privacyPolicy: {
                        title: "Privacy Policy",
                        description: "Privacy Policy and Terms of Service",
                        pp: "Complete Privacy Policy"
                    },
                    partials: {
                        sidebar: {
                            dash: "Dashboard",
                            manage: "Manage Guilds",
                            commands: "Commands",
                            pp: "Privacy Policy",
                            admin: "Admin",
                            account: "Account Pages",
                            login: "Sign In",
                            logout: "Sign Out"
                        },
                        navbar: {
                            home: "Home",
                            pages: {
                                manage: "Manage Guilds",
                                settings: "Manage Guilds",
                                commands: "Commands",
                                pp: "Privacy Policy",
                                admin: "Admin Panel",
                                error: "Error",
                                credits: "Credits",
                                debug: "Debug",
                                leaderboard: "Leaderboard",
                                profile: "Profile",
                                maintenance: "Under Maintenance"
                            }
                        },
                        title: {
                            pages: {
                                manage: "Manage Guilds",
                                settings: "Manage Guilds",
                                commands: "Commands",
                                pp: "Privacy Policy",
                                admin: "Admin Panel",
                                error: "Error",
                                credits: "Credits",
                                debug: "Debug",
                                leaderboard: "Leaderboard",
                                profile: "Profile",
                                maintenance: "Under Maintenance"
                            }
                        },
                        preloader: {
                            text: "Page is loading..."
                        },
                        premium: {
                            title: "Want more from Assistants?",
                            description: "Check out premium features below!",
                            buttonText: "Become Premium"
                        },
                        settings: {
                            title: "Site Configuration",
                            description: "Configurable Viewing Options",
                            theme: {
                                title: "Site Theme",
                                description: "Make the site more appealing for your eyes!"
                            },
                            language: {
                                title: "Site Language",
                                description: "Select your preffered language!"
                            }
                        }
                    }
                }
            }
        }),
        settings: [
            {
                categoryId: 'setup',
                categoryName: "Setup",
                categoryDescription: "Setup your bot with default settings!",
                categoryOptionsList: [
                    {
                        optionId: 'lang',
                        optionName: "Language",
                        optionDescription: "Change bot's language easily",
                        optionType: DBD.formTypes.select({ "Polish": 'pl', "English": 'en', "French": 'fr' }),
                        getActualSet: async ({ guild }) => {
                            return langsSettings[guild.id] || null;
                        },
                        setNew: async ({ guild, newData }) => {
                            langsSettings[guild.id] = newData;
                            return;
                        }
                    },
                ]
            },
        ]
    });
    Dashboard.init();
})();

client.login(config.important.token);

export { };

