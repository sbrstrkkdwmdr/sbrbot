import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import fetch from 'node-fetch';
import osuapitypes = require('./src/types/osuApiTypes');
import extypes = require('./src/types/extraTypes');
import Discord = require('discord.js');
import track = require('./src/trackfunc');

module.exports = (userdata, client, config, oncooldown, guildSettings, trackDb) => {


    setInterval(() => {
        clearMapFiles();
    }, 60 * 60 * 1000);

    setInterval(() => {
        clearCommandCache();
    }, 1000 * 60);

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
    ]

    const activityarr = [
        {
            name: "240BPM | sbr-help",
            type: 1,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: songsarr[Math.floor(Math.random() * songsarr.length)] + " | sbr-help",
            type: 2,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "dt farm maps | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "nothing in particular | sbr-help",
            type: 3,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "no mod farm maps | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "hr | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: songsarr[Math.floor(Math.random() * songsarr.length)] + " | sbr-help",
            type: 0,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        },
        {
            name: "you | sbr-help",
            type: 3,
            url: 'https://twitch.tv/sbrstrkkdwmdr',
        }
    ]

    client.user.setPresence({
        activities: [activityarr[0]],
        status: 'dnd',
        afk: false
    });
    setInterval(() => {
        client.user.setPresence({
            activities: [activityarr[Math.floor(Math.random() * activityarr.length)]],
            status: 'dnd',
            afk: false
        });
    }, 60 * 1000);


    client.on('messageCreate', async (message) => {

        const currentGuildId = message.guildId
        let settings: extypes.guildSettings;
        let prefix: string = config.prefix;

        if (
            typeof prefix === 'undefined' ||
            prefix === null ||
            prefix === ''
        ) {
            prefix = config.prefix;
        }

        //if message mentions bot and no other args given, return prefix
        if (message.mentions.users.size > 0) {
            if (message.mentions.users.first().id == client.user.id && message.content.replaceAll(' ', '').length == (`<@${client.user.id}>`).length) {
                let serverPrefix = 'null'
                try {
                    const curGuildSettings = await guildSettings.findOne({ where: { guildid: message.guildId } });
                    settings = curGuildSettings.dataValues;
                    serverPrefix = settings.prefix
                } catch (error) {
                    serverPrefix = config.prefix
                }
                return message.reply({ content: `Global prefix is \`${prefix}\`\nServer prefix is \`${serverPrefix}\``, allowedMentions: { repliedUser: false } })
            }
        }

        //if message is a cooldown message, delete it after 3 seconds
        if (message.content.startsWith('You\'re on cooldown') && message.author.id == client.user.id) {
            setTimeout(() => {
                message.delete()
                    .catch(err => {
                    })
            }, 3000)
        }
    })


    //create settings for new guilds
    client.on('guildCreate', async (guild) => {
        try {
            await guildSettings.create({
                guildId: guild.id,
                guildnanme: guild.name,
                prefix: config.prefix,
                osuParseLinks: true,
                osuParseScreenshots: true,
                enableMusic: true,
                enableAdmin: true,
            })
        } catch (error) {

        }
    })
    setInterval(() => {
        client.guilds.cache.forEach(async (guild) => {
            try {
                await guildSettings.create({
                    guildId: guild.id,
                    guildnanme: guild.name,
                    prefix: config.prefix,
                    osuParseLinks: true,
                    osuParseScreenshots: true,
                    enableMusic: true,
                    enableAdmin: true,
                })
            } catch (error) {

            }
        })
    }, 10 * 60 * 1000);

    const cacheById = [
        'bmsdata',
        'mapdata',
        'osudata',
        'scoredata',
    ]

    /**
     * removes map files that are older than 1 hour
     */
    function clearMapFiles() {
        const files = fs.readdirSync('./files/maps')
        for (const file of files) {
            fs.stat('./files/maps/' + file, (err, stat) => {
                if (err) {
                    return;
                } else {
                    if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60)) {
                        fs.unlinkSync('./files/maps/' + file)
                        fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                    }
                }
            })

        }
    }


    /**
     * command-specific files are deleted after 15 minutes of being unused.
     * maps and users are stored for an hour
     */
    function clearCommandCache() {
        const files = fs.readdirSync('./cache/commandData')
        for (const file of files) {
            fs.stat('./cache/commandData/' + file, (err, stat) => {
                if (err) {
                    return;
                } else {
                    if (cacheById.some(x => file.startsWith(x))) {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 60)) {
                            fs.unlinkSync('./cache/commandData/' + file)
                            fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    } else {
                        if ((new Date().getTime() - stat.mtimeMs) > (1000 * 60 * 15)) {
                            fs.unlinkSync('./cache/commandData/' + file)
                            fs.appendFileSync('logs/updates.log', `\ndeleted file "${file}" at ` + new Date().toLocaleString() + '\n')
                        }
                    }
                }
            })

        }
    }


}