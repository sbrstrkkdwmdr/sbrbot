import axios from 'axios';
import * as Discord from 'discord.js';
import fs from 'fs';
import { path } from './path.js';
import * as log from './src/log.js';
import * as extypes from './src/types/extratypes.js';
import * as osuapitypes from './src/types/osuApiTypes.js';

export default (input: extypes.input) => {

    setInterval(() => {
        clearMapFiles();
        clearParseArgs();
    }, 60 * 60 * 1000); 

    setInterval(() => {
        clearCommandCache();
    }, 1000 * 60);

    setInterval(async () => {
        getOnlineChangelog();
    }, 1000 * 60 * 60 * 6);

    clearMapFiles();
    clearParseArgs();
    clearCommandCache();
    getOnlineChangelog();

    //status updates
    const activities = [];

    //get map url
    function getMap() {
        const filesPathing = `${path}/cache/commandData`;
        const maps = fs.readdirSync(`${filesPathing}`).filter(x => x.includes('mapdata'));
        if (maps.length == 0) {
            return false;
        }
        const mapFile = maps[Math.floor(Math.random() * maps.length)];
        const map = (JSON.parse(fs.readFileSync(`${filesPathing}/${mapFile}`, 'utf-8'))).apiData as osuapitypes.Beatmap;
        return map;
    }

    function setActivity() {
        let string;
        let fr = 0;
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
        return (map as osuapitypes.Beatmap).total_length;
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

    let timer = 60 * 1000;
    updateStatus();

    setInterval(() => {
        updateStatus();
    }, timer);

    function updateStatus() {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        let specialDay = false;
        if ((month == 12 && day == 31) || (month == 1 && day == 1)) {
            curEvent = Events[1];
            activityarr = activityNewYear;
            specialDay = true;
        }
        else if (month == 10 && day == 31) {
            curEvent = Events[2];
            activityarr = activityHalloween;
            specialDay = true;
        } else if (month == 12 && day == 25) {
            curEvent = Events[3];
            activityarr = activityChristmas;
            specialDay = true;
        } else {
            curEvent = Events[0];
            activityarr = activities;
        }
        if (specialDay == true) {
            input.client.user.setPresence({
                activities: [activityarr[Math.floor(Math.random() * activityarr.length)]],
                status: 'dnd',
                afk: false
            });
            timer = 60 * 1000;
        } else {
            const temp = setActivity();
            timer = temp > 60 * 1000 * 30 ?
                60 * 1000 : temp * 1000;
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
                            log.toOutput(`Deleted file ${path}/files/maps/` + file, input.config);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                }
            });

        }
    }

    async function getOnlineChangelog() {
        await axios.get(`https://raw.githubusercontent.com/sbrstrkkdwmdr/sbrbot/main/changelog/changelog.md`)
            .then(data => {
                fs.writeFileSync(`${path}/cache/changelog.md`, data.data);
            })
            .catch(error => {
                console.log('ERROR FETCHING GIT');
                log.logFile(
                    'err',
                    log.errLog('err', JSON.stringify(error))
                );
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
                        log.toOutput(`Deleted file ${path}/files/maps/` + file, input.config);
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
                    console.log(err);
                    return;
                } else {
                    if (permanentCache.some(x => file.startsWith(x))) {
                        //if amount of permcache mapfiles are < 100, keep them. otherwise, delete

                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 24 * 28) && files.filter(x => permanentCache.some(x => file.startsWith(x))).length >= 100) {
                            //kill after 4 weeks
                            fs.unlinkSync(`${path}/cache/commandData/` + file);
                            log.toOutput(`Deleted file ${path}/cache/commandData/` + file, input.config);
                        }
                    }
                    else if (cacheById.some(x => file.startsWith(x))) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 24)) {
                            fs.unlinkSync(`${path}/cache/commandData/` + file);
                            log.toOutput(`Deleted file ${path}/cache/commandData/` + file, input.config);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    } else if (file.includes('weatherdata')) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 15)) {
                            fs.unlinkSync(`${path}/cache/commandData/` + file);
                            log.toOutput(`Deleted file ${path}/cache/commandData/` + file, input.config);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                    else {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 3)) {
                            fs.unlinkSync(`${path}/cache/commandData/` + file);
                            log.toOutput(`Deleted file ${path}/cache/commandData/` + file, input.config);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                }
            });

        }
    }

    /**
     * clear files used for command params
     */
    function clearParseArgs() {
        const files = fs.readdirSync(`${path}/cache/params`);
        for (const file of files) {
            fs.stat(`${path}/cache/params/` + file, (err, stat) => {
                if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 24)) {
                    fs.unlinkSync(`${path}/cache/params/` + file);
                    log.toOutput(`Deleted file ${path}/cache/params/` + file, input.config);
                    // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
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