import axios from 'axios';
import Discord from 'discord.js';
import fs from 'fs';
import Sequelize from 'sequelize';
import { path } from './path.js';
import * as log from './src/log.js';
import * as osufunc from './src/osufunc.js';
import * as osumodcalc from './src/osumodcalc.js';
import * as track from './src/trackfunc.js';
import * as extypes from './src/types/extratypes.js';
import * as osuApiTypes from './src/types/osuApiTypes.js';
import * as osuapitypes from './src/types/osuApiTypes.js';

export default (input: {
    userdata,
    client: Discord.Client,
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
        getOnlineChangelog();
        //rankings
    }, 1000 * 60 * 60 * 24);

    getOnlineChangelog();

    //status updates
    const activities = [];

    //get map url
    function getMap() {
        const filesPathing = `${path}\\cache\\commandData`;
        const maps = fs.readdirSync(`${filesPathing}`).filter(x => x.includes('mapdata'));
        if (maps.length == 0) {
            return false;
        }
        const mapFile = maps[Math.floor(Math.random() * maps.length)];
        const map = (JSON.parse(fs.readFileSync(`${filesPathing}\\${mapFile}`, 'utf-8'))).apiData as osuapitypes.Beatmap;
        return map;
    }

    function setActivity() {
        // const rdm = Math.floor(Math.random() * 100);
        let string;
        let fr = 0;
        // switch (true) {
        //     case rdm > 2: {
        //         const map = getMap();
        //         if (map == false) {
        //             string = `Artist - Title [version]`;
        //         } else {
        //             string = `${map.beatmapset.artist} - ${map.beatmapset.title}`;
        //         }
        //         fr = 2;
        //     }
        //         break;
        //     case rdm < 1: {
        //         const gamesList = [
        //             'osu!',
        //             'osu! Lazer',
        //             'McOsu',
        //             'danser'
        //         ];
        //         string = gamesList[Math.floor(Math.random() * gamesList.length)];
        //         fr = 0;
        //     }
        //         break;
        //     default: {
        //         string = 'you';
        //         fr = 3;
        //     }
        //         break;
        // }
        const map = getMap();
        if (map == false) {
            string = 'you';
            fr = 3;
        } else {
            string = `${map.beatmapset.artist} - ${map.beatmapset.title}`;
            fr = 2;
        }

        input.client.user.setPresence({
            activities: [{
                name: `${string} | ${input.config.prefix}help`,
                type: fr,
                url: 'https://twitch.tv/sbrstrkkdwmdr'
            }],
            status: 'dnd',
            afk: false
        });
    }

    const activityChristmas = [
        {
            name: `Merry Christmas! | ${input.config.prefix}help`,
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: `🎄 | ${input.config.prefix}help`,
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
    ];
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
    },
    {
        name: `Happy New Year!! | ${input.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    },
    {
        name: `Happy New Year!!! | ${input.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    }
    ];

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
        let specialDay = false;
        if ((month == 12 && day == 31) || (month == 1 && day == 1)) {
            if (curEvent != Events[1]) {
                curEvent = Events[1];
                activityarr = activityNewYear;
                specialDay = true;
            }
        }
        else if (month == 10 && day == 31) {
            if (curEvent != Events[2]) {
                curEvent = Events[2];
                activityarr = activityHalloween;
                specialDay = true;
            }
        } else if (month == 12 && day == 25) {
            if (curEvent != Events[3]) {
                curEvent = Events[3];
                activityarr = activityChristmas;
                specialDay = true;
            }
        } else {
            if (curEvent != Events[0]) {
                curEvent = Events[0];
                activityarr = activities;
            }
        }
        if (specialDay == true) {
            input.client.user.setPresence({
                activities: [activityarr[Math.floor(Math.random() * activityarr.length)]],
                status: 'dnd',
                afk: false
            });
        } else {
            setActivity();
        }
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
                message.reply({ content: `Global prefix is \`${prefix}\`\nServer prefix is \`${serverPrefix}\``, allowedMentions: { repliedUser: false } });
                return;
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
        return;
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
        'firstscoresdata',
        'weatherlocationdata',
    ];

    const permanentCache = [
        'mapdataRanked', 'mapdataLoved', 'mapdataApproved',
        'bmsdataRanked', 'bmsdataLoved', 'bmsdataApproved',
    ];

    /**
     * removes map files that are older than 1 hour
     */
    function clearMapFiles() {
        const files = fs.readdirSync(`${path}/files/maps`);
        for (const file of files) {
            fs.stat(`${path}/files/maps` + file, (err, stat) => {
                if (err) {
                    return;
                } else {
                    if (file.includes('undefined')) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 12)) {
                            fs.unlinkSync(`${path}/files/maps/` + file);
                            log.toOutput(`Deleted file ${path}\\files\\maps\\` + file, input.config);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                }
            });

        }
    }

    async function getOnlineChangelog() {
        await axios.get(`https://raw.githubusercontent.com/sbrstrkkdwmdr/sbrbot/main/changelog/changelog.txt`)
            .then(data => {
                fs.writeFileSync(`${path}\\cache\\changelog.txt`, data.data);
            })
            .catch(error => {
                console.log('ERROR FETCHING GIT');
                log.logFile(
                    'err',
                    log.errLog('err', JSON.stringify(error))
                )
            });
    }

    /**
     * clears files in files/replays and files/localmaps
     */
    function clearParseFiles() {
        const files = fs.readdirSync(`${path}/files/maps`);
        for (const file of files) {
            fs.stat(`${path}/files/maps/` + file, (err, stat) => {
                if (err) {
                    return;
                } else {
                    if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 12)) {
                        fs.unlinkSync(`${path}/files/maps/` + file);
                        log.toOutput(`Deleted file ${path}\\files\\maps\\` + file, input.config);
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
        const files = fs.readdirSync(`${path}/cache/commandData`);
        for (const file of files) {
            fs.stat(`${path}/cache/commandData/` + file, (err, stat) => {
                if (err) {
                    return;
                } else {
                    if (permanentCache.some(x => file.startsWith(x))) {
                        //do nothing
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 24 * 7)) {
                            //kill after 7d
                            fs.unlinkSync(`${path}/cache/commandData/` + file);
                            log.toOutput(`Deleted file ${path}\\cache\\commandData\\` + file, input.config);
                        }
                    }
                    else if (cacheById.some(x => file.startsWith(x))) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 24)) {
                            fs.unlinkSync(`${path}/cache/commandData/` + file);
                            log.toOutput(`Deleted file ${path}\\cache\\commandData\\` + file, input.config);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    } else if (file.includes('weatherdata')) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 15)) {
                            fs.unlinkSync(`${path}/cache/commandData/` + file);
                            log.toOutput(`Deleted file ${path}\\cache\\commandData\\` + file, input.config);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                    else {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 3)) {
                            fs.unlinkSync(`${path}/cache/commandData/` + file);
                            log.toOutput(`Deleted file ${path}\\cache\\commandData\\` + file, input.config);
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