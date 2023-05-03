import Discord from 'discord.js';
import fs from 'fs';
import rosu from 'rosu-pp';
import Sequelize from 'sequelize';
import { path } from '../path.js';
import * as def from './consts/defaults.js';
import * as embedstuff from './embed.js';
import * as log from './log.js';
import * as osufunc from './osufunc.js';
import * as func from './tools.js';
import * as osuApiTypes from './types/osuApiTypes.js';

export async function editTrackUser(fr: {
    database: Sequelize.ModelStatic<any>,
    userid: string | number,
    action?: 'add' | 'remove',
    guildId: string | number,
    guildSettings: Sequelize.ModelStatic<any>,
    mode: string;
}
) {

    if (!fr.action || fr.action == 'add') {
        try {
            await fr.database.create({
                osuid: fr.userid,
                [`guilds${fr.mode}`]: fr.guildId,
                [`guilds`]: fr.guildId
            });

        } catch (error) {
            log.logFile('error', log.errLog('database track user creation err', error));
            const previous = await fr.database.findOne({ where: { osuid: fr.userid } });
            const prevchannels: string[] = previous?.dataValues?.guilds?.split(',') ?? [];

            if (!prevchannels.includes(`${fr.guildId}`)) {
                prevchannels.push(`${fr.guildId}`);
            }

            await fr.database.update({
                osuid: fr.userid,
                [`guilds${fr.mode}`]: prevchannels.join(','),
                [`guilds`]: prevchannels.join(',')
            }, {
                where: {
                    osuid: fr.userid,
                }
            })
        }
    } else {
        const curuser = await fr.database.findOne({ where: { osuid: fr.userid } });
        const curguilds: string[] = curuser.dataValues[`guilds${fr.mode}`].split(',');
        const newguilds = curguilds.filter(channel => channel != fr.guildId);
        await fr.database.update({
            osuid: fr.userid,
            [`guilds${fr.mode}`]: newguilds.join(',')
        }, {
            where: {
                osuid: fr.userid
            }
        });

    }
    return true;
}


export async function trackUser(fr: { user: string, mode: string, inital?: boolean; }, trackDb, client, guildSettings) {
    if (!fr.user) return;
    const curdata: osuApiTypes.Score[] & osuApiTypes.Error = (await osufunc.apiget({
        type: 'osutop',
        params: {
            username: fr.user,
            mode: osufunc.modeValidator(fr.mode),
            opts: ['limit=100']
        }
    })).apiData;
    // const thisUser: osuApiTypes.User = await osufunc.apiget('user', fr.user, fr.mode)
    if (!curdata?.[0]?.user_id) return;

    // osufunc.updateUserStats(thisUser, fr.mode, userdata)

    if (curdata?.[0]?.user_id && fr.inital == true) {
        fs.writeFileSync(`${path}\\trackingFiles\\${curdata[0].user_id}_${fr.mode}.json`, JSON.stringify(curdata, null, 2));
        return;
    }
    if (curdata?.[0]?.user_id) {
        if (fs.existsSync(`${path}\\trackingFiles\\${curdata[0].user_id}_${fr.mode}.json`)) {
            let previous: osuApiTypes.Score[] & osuApiTypes.Error;
            try {
                previous = JSON.parse(fs.readFileSync(`${path}\\trackingFiles\\${curdata[0].user_id}_${fr.mode}.json`, 'utf-8'));
            }
            catch {
                fs.writeFileSync(`${path}\\trackingFiles\\${curdata[0].user_id}_${fr.mode}.json`, JSON.stringify(curdata, null, 2));
                return;
            }

            for (let i = 0; i < curdata.length; i++) {


                if (!previous.find(x => x.id == curdata[i].id)) {
                    log.toOutput(`Found new score for: ${curdata[i]?.user?.username ?? 'null name'}`);
                    sendMsg(await getEmbed({
                        scoredata: curdata[i],
                        scorepos: i
                    }), fr.user,
                        trackDb, client, guildSettings
                    );
                }
            }
        }
        fs.writeFileSync(`${path}\\trackingFiles\\${curdata[0].user_id}_${fr.mode}.json`, JSON.stringify(curdata.slice().sort((a, b) =>
            parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', ''))
            -
            parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', ''))
        ), null, 2));
    }
}

export async function getEmbed(
    data: {
        scoredata: osuApiTypes.Score,
        scorepos: number,
    }
) {
    const curscore = data.scoredata;
    const scorestats = data.scoredata.statistics;
    let totalhits = 0;

    switch (curscore.mode) {
        case 'osu': default:
            totalhits = scorestats.count_300 + scorestats.count_100 + scorestats.count_50 + scorestats.count_miss;
            break;
        case 'taiko':
            totalhits = scorestats.count_300 + scorestats.count_100 + scorestats.count_miss;
            break;
        case 'fruits':
            totalhits = scorestats.count_300 + scorestats.count_100 + scorestats.count_50 + scorestats.count_miss;
            break;
        case 'mania':
            totalhits = scorestats.count_geki + scorestats.count_300 + scorestats.count_katu + scorestats.count_100 + scorestats.count_50 + scorestats.count_miss;
            break;
    }

    const ppcalc: rosu.OsuPerformanceAttributes[] | rosu.TaikoPerformanceAttributes[] | rosu.CatchPerformanceAttributes[] | rosu.ManiaPerformanceAttributes[]
        =
        await osufunc.scorecalc({
            mods: curscore.mods.join('').length > 1 ?
                curscore.mods.join('') : 'NM',
            gamemode: curscore.mode,
            mapid: curscore.beatmap.id,
            miss: curscore.statistics.count_miss,
            acc: curscore.accuracy,
            maxcombo: curscore.max_combo,
            score: curscore.score,
            calctype: 0,
            passedObj: totalhits,
            failed: false
        }, new Date(curscore.beatmap.last_updated));

    let pp: string;
    if (data.scoredata.accuracy != 1) {
        pp = `${data.scoredata.pp}pp ${data.scoredata.perfect ? '(FC)' : `(${ppcalc[1].pp.toFixed(2)} if FC)`}`;
    } else {
        pp = `${data.scoredata.pp}pp (SS)`;
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle(`${data.scoredata.beatmapset.title} [${data.scoredata.beatmap.version}]`)
        .setURL(`https://osu.ppy.sh/beatmapsets/${data.scoredata.beatmapset.id}#osu/${data.scoredata.beatmap.id}`)
        .setAuthor({
            name: `${data.scoredata?.user?.username} | New #${data.scorepos + 1} Personal Best`,
            url: `https://osu.ppy.sh/u/${data.scoredata?.user?.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${data.scoredata?.user?.country_code}.png`}`
        })
        .setThumbnail(`${data.scoredata?.user?.avatar_url ?? def.images.user.url}`)
        .setImage(`${data.scoredata.beatmapset.covers['cover@2x']}`)
        .setDescription(
            `${data.scoredata.mods.length > 0 ? '+' + data.scoredata.mods.join('') + ' | ' : ''} **Score set** <t:${new Date(data.scoredata.created_at).getTime() / 1000}:R>\n` +
            `${(data.scoredata.accuracy * 100).toFixed(2)}% | ${embedstuff.gradeToEmoji(data.scoredata.rank)} | ${(ppcalc[0].difficulty.stars ?? data.scoredata.beatmap.difficulty_rating).toFixed(2)}⭐\n` +
            `${embedstuff.hitList({
                gamemode: data.scoredata.mode,
                count_geki: data.scoredata.statistics.count_geki,
                count_300: data.scoredata.statistics.count_300,
                count_katu: data.scoredata.statistics.count_katu,
                count_100: data.scoredata.statistics.count_100,
                count_50: data.scoredata.statistics.count_50,
                count_miss: data.scoredata.statistics.count_miss,
            })} | ${data.scoredata.max_combo}x\n` +
            `${pp}`
        );
    return embed;
}

export async function trackUsers(db, client, guildSettings) {
    if (!db || !client || !guildSettings) {
        log.toOutput(`Error - Missing object`);
        log.toOutput(`Database: ${db != null}`);
        log.toOutput(`Client: ${client != null}`);
        log.toOutput(`Guild settings: ${guildSettings != null}`);
        return;
    }

    const allUsers = await db.findAll();
    const WaitTime = 1000 * 60 * 60;
    for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];

        setTimeout(() => {
            log.toOutput(`Tracking - index ${i}. Next track in ${Math.floor(WaitTime / allUsers.length)}`);
            let willFetch = false;
            if (!(typeof user.osuid == 'undefined' || user.osuid == null || user.osuid == undefined)) {
                if (`${user.guildsosu}`.length > 0 && `${user.guildsosu}`.length != 4) {
                    trackUser({
                        user: user.osuid,
                        mode: 'osu',
                        inital: false
                    }, db, client, guildSettings);
                    willFetch = true;
                }
                if (`${user.guildstaiko}`.length > 0 && `${user.guildstaiko}`.length != 4) {
                    trackUser({
                        user: user.osuid,
                        mode: 'taiko',
                        inital: false
                    }, db, client, guildSettings);
                    willFetch = true;
                }
                if (`${user.guildsfruits}`.length > 0 && `${user.guildsfruits}`.length != 4) {
                    trackUser({
                        user: user.osuid,
                        mode: 'fruits',
                        inital: false
                    }, db, client, guildSettings);
                    willFetch = true;
                }
                if (`${user.guildsmania}`.length > 0 && `${user.guildsfruits}`.length != 4) {
                    trackUser({
                        user: user.osuid,
                        mode: 'mania',
                        inital: false
                    }, db, client, guildSettings);
                    willFetch = true;
                }
            }

            if (willFetch == true) {
                log.toOutput(`Tracking - Fetching ${user.osuid}`);
            } else {
                log.toOutput(`Tracking cancelled - User ${user.osuid} has no tracked channels`);
            }
        },
            i < 1 ? 0 : (Math.floor(WaitTime / allUsers.length)));
    }
}

export async function sendMsg(embed: Discord.EmbedBuilder, curuser: string, trackDb, client, guildSettings) {
    const userobj = await trackDb.findOne({
        where: {
            osuid: curuser
        }
    });
    const guilds = userobj?.guilds?.includes(',') ? userobj?.guilds?.split(',')
        :
        [userobj?.guilds];

    let channels = [];
    if (!guilds[0]) {
        return;
    }

    guilds.forEach(() => {
        client.guilds.cache.forEach(async guild2 => {
            if (guilds.includes(guild2.id)) {
                const curset = await guildSettings.findOne({
                    where: {
                        guildid: guild2.id
                    }
                });
                if (curset?.dataValues?.trackChannel) {
                    await channels.push(`${curset.trackChannel}`);
                    log.toOutput(`Found channel in guild settings - ${curset.trackChannel}`);
                } else {
                    log.toOutput('Found channel in guild settings - No channel set');
                }
            }
        });
    });

    //filter out duplicates
    channels = await channels.filter((item, index) => channels.indexOf(item) === index);


    setTimeout(() => {
        channels.filter((item, index) => channels.indexOf(item) === index).forEach(channel => {
            const curchannel: Discord.GuildTextBasedChannel = client.channels.cache.get(channel) as Discord.GuildTextBasedChannel;
            if (curchannel) {
                log.toOutput(`Sending to channel: ${curchannel.id}`);
                curchannel.send({
                    embeds: [embed]
                }).catch(error => {
                    log.toOutput(`Error sending to channel: ${error}`);
                });
            } else {
                log.toOutput(`Error sending to channel: Channel not found`);
            }
        });
    }, 2000);

}