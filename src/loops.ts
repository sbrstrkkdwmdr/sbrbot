// recurring functions
import axios from 'axios';
import Discord from 'discord.js';
import fs from 'fs';
import * as helper from './helper.js';
import * as apitypes from './types/osuapi.js';
export function loops() {
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

    // status switcher
    const activities = [];

    function getMap() {
        const filesPathing = `${helper.vars.path.cache}/commandData`;
        const maps = fs.readdirSync(`${filesPathing}`).filter(x => x.includes('mapdata'));
        if (maps.length == 0) {
            return false;
        }
        const mapFile = maps[Math.floor(Math.random() * maps.length)];
        const map = (JSON.parse(fs.readFileSync(`${filesPathing}/${mapFile}`, 'utf-8'))).apiData as apitypes.Beatmap;
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
            string = `${map?.beatmapset?.artist ?? 'UNKNOWN ARTIST'} - ${map?.beatmapset?.title ?? 'UNKNOWN TITLE'}`;
            fr = 2;
        }

        helper.vars.client.user.setPresence({
            activities: [{
                name: `${string} | ${helper.vars.config.prefix}help`,
                type: fr,
                url: 'https://twitch.tv/sbrstrkkdwmdr'
            }],
            status: 'dnd',
            afk: false
        });
        return (map as apitypes.Beatmap).total_length;
    }
    const activityChristmas = [
        {
            name: `Merry Christmas! | ${helper.vars.config.prefix}help`,
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: `🎄 | ${helper.vars.config.prefix}help`,
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
    ];
    const activityHalloween = [{
        name: `Happy Halloween! | ${helper.vars.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    },
    {
        name: `🎃 | ${helper.vars.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    }
    ];
    const activityNewYear = [{
        name: `Happy New Year! | ${helper.vars.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    },
    {
        name: `Happy New Year!! | ${helper.vars.config.prefix}help`,
        type: 0,
        url: 'https://twitch.tv/sbrstrkkdwmdr',
    },
    {
        name: `Happy New Year!!! | ${helper.vars.config.prefix}help`,
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
            helper.vars.client.user.setPresence({
                activities: [activityarr[Math.floor(Math.random() * activityarr.length)]],
                status: 'dnd',
                afk: false
            });
            timer = 10 * 60 * 1000;
        } else {
            const temp = setActivity();
            timer = temp > 60 * 1000 * 30 ?
                60 * 1000 : temp * 1000;
        }
    }

    // clear cache
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

    function clearMapFiles() {
        const files = fs.readdirSync(`${helper.vars.path.files}/maps`);
        for (const file of files) {
            fs.stat(`${helper.vars.path.files}/maps` + file, (err, stat) => {
                if (err) {
                    return;
                } else {
                    if (file.includes('undefined')) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 12)) {
                            fs.unlinkSync(`${helper.vars.path.files}/maps/` + file);
                            helper.tools.log.stdout(`Deleted file ${helper.vars.path.files}/maps/` + file,);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                }
            });

        }
    }

    // other
    async function getOnlineChangelog() {
        await axios.get(`https://raw.githubusercontent.com/sbrstrkkdwmdr/sbrbot/dev/changelog.md`)
            .then(data => {
                fs.writeFileSync(`${helper.vars.path.cache}/changelog.md`, data.data);
            })
            .catch(error => {
                helper.tools.log.stdout('ERROR FETCHING GIT');
                helper.tools.log.out(`${helper.vars.path.logs}/err.log`, JSON.stringify(error));
            });
    }
    function clearCommandCache() {
        const files = fs.readdirSync(`${helper.vars.path.cache}/commandData`);
        for (const file of files) {
            fs.stat(`${helper.vars.path.cache}/commandData/` + file, (err, stat) => {
                if (err) {
                    helper.tools.log.stdout(err);
                    return;
                } else {
                    if (permanentCache.some(x => file.startsWith(x))) {
                        //if amount of permcache mapfiles are < 100, keep them. otherwise, delete

                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 24 * 28) && files.filter(x => permanentCache.some(x => file.startsWith(x))).length >= 100) {
                            //kill after 4 weeks
                            fs.unlinkSync(`${helper.vars.path.cache}/commandData/` + file);
                            helper.tools.log.stdout(`Deleted file ${helper.vars.path.cache}/commandData/` + file,);
                        }
                    }
                    else if (cacheById.some(x => file.startsWith(x))) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 24)) {
                            fs.unlinkSync(`${helper.vars.path.cache}/commandData/` + file);
                            helper.tools.log.stdout(`Deleted file ${helper.vars.path.cache}/commandData/` + file,);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    } else if (file.includes('weatherdata')) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 15)) {
                            fs.unlinkSync(`${helper.vars.path.cache}/commandData/` + file);
                            helper.tools.log.stdout(`Deleted file ${helper.vars.path.cache}/commandData/` + file,);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                    else {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 3)) {
                            fs.unlinkSync(`${helper.vars.path.cache}/commandData/` + file);
                            helper.tools.log.stdout(`Deleted file ${helper.vars.path.cache}/commandData/` + file,);
                            // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                }
            });

        }
    }
    function clearParseArgs() {
        const files = fs.readdirSync(`${helper.vars.path.cache}/params`);
        for (const file of files) {
            fs.stat(`${helper.vars.path.cache}/params/` + file, (err, stat) => {
                if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60 * 24)) {
                    fs.unlinkSync(`${helper.vars.path.cache}/params/` + file);
                    helper.tools.log.stdout(`Deleted file ${helper.vars.path.cache}/params/` + file,);
                    // fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                }
            });
        }
    }
    // guild stuff
    helper.vars.client.on('guildCreate', async (guild) => {
        createGuildSettings(guild);
    });
    async function createGuildSettings(guild: Discord.Guild) {
        try {
            await helper.vars.guildSettings.create({
                guildid: guild.id ?? null,
                guildname: guild.name ?? null,
                prefix: helper.vars.config.prefix,
            });
        } catch (error) {
            console.log(error);
        }
    }

    // osu track
    let enableTrack = helper.vars.config.enableTracking;
    const totalTime = 60 * 1000 * 60; //requests every 60 min
    if (enableTrack == true) {
        a();
        setInterval(() => {
            a();
        }, totalTime);
    }
    function a() {
        try {
            helper.tools.track.trackUsers(totalTime);
        } catch (err) {
            helper.tools.log.stdout(err);
            helper.tools.log.stdout('temporarily disabling tracking for an hour');
            enableTrack = false;
            setTimeout(() => {
                enableTrack = true;
            }, totalTime);
        }
    }
}