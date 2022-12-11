import Discord from 'discord.js';
import fs from 'fs';
import fetch from 'node-fetch';
import Sequelize from 'sequelize';
import * as osufunc from './src/osufunc.js';
import * as osumodcalc from './src/osumodcalc.js';
import * as track from './src/trackfunc.js';
import * as extypes from './src/types/extratypes.js';
import * as osuapitypes from './src/types/osuApiTypes.js';
import * as osuApiTypes from './src/types/osuApiTypes.js';
export default (input: {
    userdata,
    client,
    config: extypes.config,
    oncooldown,
    guildSettings: Sequelize.ModelStatic<any>,
    statsCache;
}) => {

    setInterval(() => {
        clearMapFiles();
    }, 60 * 60 * 1000);

    setInterval(() => {
        clearCommandCache();
    }, 1000 * 60);

    setInterval(async () => {
        //rankings
    }, 1000 * 60 * 60 * 24);

    //status updates
    const songsarr = [
        "Yomi Yori kikoyu, Koukoku no hi to Honoo no Shoujo [Kurushimi]",
        "FREEDOM DiVE [FOUR DiMENSIONS]",
        "A FOOL MOON NIGHT [Piggey's Destruction]",
        "Sidetracked Day [Infinity Inside]",
        "Cirno's Perfect Math Class [TAG4]",
        "Glorious Crown [FOUR DIMENSIONS]",
        "Made of Fire [Oni]",
        "小さな恋のうた (Synth Rock Cover) [Together]",
        "C18H27NO3(extend) [Pure Darkness]",
        "BLUE DRAGON [Blue Dragon]",
        "-ERROR [Drowning]",
        "Remote Control [Insane] +HDDT",
        "Usatei 2011 [Ozzy's Extra]",
        "Chocomint's made of fire hddt 98.54 full combo",
        "Ascension to Heaven [Death] +HDDTHR",
        "Can't Defeat Airman [Holy Shit! It's Airman!!!]",
        "The Big Black [WHO'S AFRAID OF THE BIG BLACK]"
    ];

    const activities = [
        {
            name: `240BPM | ${input.config.prefix}help`,
            type: 1,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: songsarr[Math.floor(Math.random() * songsarr.length)] + ` | ${input.config.prefix}help`,
            type: 2,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: `dt farm maps | ${input.config.prefix}help`,
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: `nothing in particular | ${input.config.prefix}help`,
            type: 3,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: `games | ${input.config.prefix}help`,
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: `hr | ${input.config.prefix}help`,
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: songsarr[Math.floor(Math.random() * songsarr.length)] + ` | ${input.config.prefix}help`,
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: `you | ${input.config.prefix}help`,
            type: 3,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        }
    ];
    const activityChristmas = [{
        name: `Merry Christmas! | ${input.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    }];
    const activityHalloween = [{
        name: `Happy Halloween! | ${input.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    },
    {
        name: `🎃 | ${input.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    }

    ];
    const activityNewYear = [{
        name: `Happy New Year! | ${input.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    }];

    input.client.user.setPresence({
        activities: [activities[0]],
        status: 'dnd',
        afk: false
    });

    //seasonal status updates
    const Events = ['None', 'New Years', 'Halloween', 'Christmas'];

    let curEvent = Events[0];
    let activityarr = activities;
    setInterval(() => {
        updateStatus();
    }, 60 * 1000);
    updateStatus();

    function updateStatus() {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        if ((month == 12 && day == 31) || (month == 1 && day == 1)) {
            if (curEvent != Events[1]) {
                curEvent = Events[1];
                activityarr = activityNewYear;
            }
        }
        else if (month == 10 && day == 31) {
            if (curEvent != Events[2]) {
                curEvent = Events[2];
                activityarr = activityHalloween;
            }
        } else if (month == 12 && day == 25) {
            if (curEvent != Events[3]) {
                curEvent = Events[3];
                activityarr = activityChristmas;
            }
        } else {
            if (curEvent != Events[0]) {
                curEvent = Events[0];
                activityarr = activities;
            }
        }
        input.client.user.setPresence({
            activities: [activityarr[Math.floor(Math.random() * activityarr.length)]],
            status: 'dnd',
            afk: false
        });
    }

    input.client.on('messageCreate', async (message) => {

        const currentGuildId = message.guildId;
        let settings: extypes.guildSettings;
        let prefix: string = input.config.prefix;

        if (
            typeof prefix === 'undefined' ||
            prefix === null ||
            prefix === ''
        ) {
            prefix = input.config.prefix;
        }

        //if message mentions bot and no other args given, return prefix
        if (message.mentions.users.size > 0) {
            if (message.mentions.users.first().id == input.client.user.id && message.content.replaceAll(' ', '').length == (`<@${input.client.user.id}>`).length) {
                let serverPrefix = 'null';
                try {
                    const curGuildSettings = await input.guildSettings.findOne({ where: { guildid: message.guildId } });
                    settings = curGuildSettings.dataValues;
                    serverPrefix = settings.prefix;
                } catch (error) {
                    serverPrefix = input.config.prefix;
                }
                return message.reply({ content: `Global prefix is \`${prefix}\`\nServer prefix is \`${serverPrefix}\``, allowedMentions: { repliedUser: false } });
            }
        }

        //if message is a cooldown message, delete it after 3 seconds
        if (message.content.startsWith('You\'re on cooldown') && message.author.id == input.client.user.id) {
            setTimeout(() => {
                message.delete()
                    .catch(err => {
                    });
            }, 3000);
        }
    });


    //create settings for new guilds
    input.client.on('guildCreate', async (guild) => {
        createGuildSettings(guild);
    });
    setInterval(() => {
        clearUnused();
    }, 10 * 60 * 1000);

    clearUnused();

    async function createGuildSettings(guild: Discord.Guild) {
        try {
            await input.guildSettings.create({
                guildid: guild.id ?? null,
                guildname: guild.name ?? null,
                prefix: input.config.prefix,
            });
        } catch (error) {
            console.log(error);
        }
    }

    function clearUnused() {
        (async () => {
            await input.guildSettings.destroy({
                where: { guildid: null, guildname: null }
            });
        })();
    }

    const cacheById = [
        'bmsdata',
        'mapdata',
        'osudata',
        'scoredata',
        'maplistdata',
        'firstscoresdata'
    ];

    const permanentCache = [
        'mapdataRanked', 'mapdataLoved', 'mapdataApproved',
        'bmsdataRanked', 'bmsdataLoved', 'bmsdataApproved',
    ];

    /**
     * removes map files that are older than 1 hour
     */
    function clearMapFiles() {
        const files = fs.readdirSync('./files/maps');
        for (const file of files) {
            fs.stat('./files/maps/' + file, (err, stat) => {
                if (err) {
                    return;
                } else {
                    if (file.includes('undefined')) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 12)) {
                            fs.unlinkSync('./files/maps/' + file);
                            osufunc.logCall(file, 'deleted file');
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                }
            });

        }
    }

    /**
     * clears files in files/replays and files/localmaps
     */
    function clearParseFiles() {
        const files = fs.readdirSync('./files/maps');
        for (const file of files) {
            fs.stat('./files/maps/' + file, (err, stat) => {
                if (err) {
                    return;
                } else {
                    if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 12)) {
                        fs.unlinkSync('./files/maps/' + file);
                        osufunc.logCall(file, 'deleted file');
                        // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                    }
                }
            });

        }
    }


    /**
     * command-specific files are deleted after 15 minutes of being unused.
     * maps and users are stored for an hour
     */
    function clearCommandCache() {
        const files = fs.readdirSync('./cache/commandData');
        for (const file of files) {
            fs.stat('./cache/commandData/' + file, (err, stat) => {
                if (err) {
                    return;
                } else {
                    if (permanentCache.some(x => file.startsWith(x))) {
                        //do nothing
                    }
                    else if (cacheById.some(x => file.startsWith(x))) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 24)) {
                            fs.unlinkSync('./cache/commandData/' + file);
                            osufunc.logCall(file, 'deleted file');
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    } else {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 3)) {
                            fs.unlinkSync('./cache/commandData/' + file);
                            osufunc.logCall(file, 'deleted file');
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                }
            });

        }
    }

    async function rankings(db) {
        // osufunc.userStatsCache(
        //     await osufunc.apiget('custom', `rankings/osu/performance`, null, 2, 0, true),
        //     db,
        //     'osu'
        // );
        // osufunc.userStatsCache(
        //     await osufunc.apiget('custom', `rankings/taiko/performance`, null, 2, 0, true),
        //     db,
        //     'taiko'
        // );
        // osufunc.userStatsCache(
        //     await osufunc.apiget('custom', `rankings/fruits/performance`, null, 2, 0, true),
        //     db,
        //     'fruits'
        // );
        // osufunc.userStatsCache(
        //     await osufunc.apiget('custom', `rankings/mania/performance`, null, 2, 0, true),
        //     db,
        //     'mania'
        // );
    }

};