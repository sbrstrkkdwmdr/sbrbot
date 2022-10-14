import osufunc = require('./osufunc');
import osuApiTypes = require('./types/osuApiTypes');
import Sequelize = require('sequelize');
import fs = require('fs');
import Discord = require('discord.js');
import func = require('./tools');
import embedstuff = require('./embed');
import log = require('./log');
import def = require('./consts/defaults');

module.exports = (userdata, client, config, oncooldown, trackDb: Sequelize.ModelStatic<any>, guildSettings: Sequelize.ModelStatic<any>) => {

    async function trackUser(fr: { user: string, mode: string, inital?: boolean }) {
        if (!fr.user) return;
        const curdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('osutop', fr.user, fr.mode)
        // const thisUser: osuApiTypes.User = await osufunc.apiget('user', fr.user, fr.mode)
        if (!curdata?.[0]?.user_id) return;

        // osufunc.updateUserStats(thisUser, fr.mode, userdata)

        if (curdata?.[0]?.user_id && fr.inital == true) {
            fs.writeFileSync(`trackingFiles/${curdata[0].user_id}.json`, JSON.stringify(curdata, null, 2))
            return;
        }
        if (curdata?.[0]?.user_id) {
            if (fs.existsSync(`trackingFiles/${curdata[0].user_id}.json`)) {
                let previous: osuApiTypes.Score[] & osuApiTypes.Error;
                try {
                    previous = JSON.parse(fs.readFileSync(`trackingFiles/${curdata[0].user_id}.json`, 'utf-8'))
                }
                catch {
                    fs.writeFileSync(`trackingFiles/${curdata[0].user_id}.json`, JSON.stringify(curdata, null, 2))
                    return;
                }

                for (let i = 0; i < curdata.length; i++) {


                    if (!previous.find(x => x.id == curdata[i].id)) {
                        osufunc.logCall(curdata[i]?.user?.username ?? 'null name', 'Found new score for')
                        sendMsg(await getEmbed({
                            scoredata: curdata[i],
                            scorepos: i
                        }), fr.user)
                    }
                }
            }
            fs.writeFileSync(`trackingFiles/${curdata[0].user_id}.json`, JSON.stringify(curdata, null, 2))
        }
    }

    async function editTrackUser(
        fr: {
            database: Sequelize.ModelStatic<any>,
            discuser: string | number,
            user: string | number,
            action?: 'add' | 'remove',
            guildId: string | number,
            guildSettings: Sequelize.ModelStatic<any>,
        }
    ) {
        if (!fr.action || fr.action == 'add') {
            try {
                await fr.database.create({
                    userid: fr.discuser,
                    osuid: fr.user,
                    guilds: fr.guildId
                })
            } catch (error) {
                log.logFile('error', log.errLog('database update', error))

                const previous = await fr.database.findOne({ where: { userid: fr.discuser } })
                const prevchannels: string[] = previous?.dataValues?.guilds?.split(',') ?? []

                if (!prevchannels.includes(`${fr.guildId}`)) {
                    prevchannels.push(`${fr.guildId}`)
                }

                await fr.database.update({
                    userid: fr.discuser,
                    osuid: fr.user,
                    guilds: prevchannels.join(',')
                }, {
                    where: {
                        userid: fr.discuser
                    }
                })
            }
        } else {
            const curuser = await fr.database.findOne({ where: { userid: fr.discuser } })
            const curguilds: string[] = curuser.dataValues.guilds.split(',')
            const newguilds = curguilds.filter(channel => channel != fr.guildId)
            await fr.database.update({
                userid: fr.discuser,
                osuid: fr.user,
                guilds: newguilds.join(',')
            }, {
                where: {
                    userid: fr.discuser
                }
            })

        }
        return true;
    }

    async function getEmbed(
        data: {
            scoredata: osuApiTypes.Score,
            scorepos: number,
        }
    ) {
        const ppcalc =
            await osufunc.scorecalc({
                mods: data.scoredata.mods.join('').length > 1 ?
                    data.scoredata.mods.join('') : 'NM',
                gamemode: data.scoredata.mode,
                mapid: data.scoredata.beatmap.id,
                miss: data.scoredata.statistics.count_miss,
                acc: data.scoredata.accuracy,
                maxcombo: data.scoredata.max_combo,
                score: data.scoredata.score,
                calctype: 0,
                passedObj: 0,
                failed: false
            })

        let pp: string;
        if (data.scoredata.accuracy != 1) {
            pp = `${data.scoredata.pp}pp ${data.scoredata.perfect ? '(FC)' : `(${ppcalc[1].pp.toFixed(2)} if FC)`}`
        } else {
            pp = `${data.scoredata.pp}pp (SS)`
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
                `${(data.scoredata.accuracy * 100).toFixed(2)}% | ${embedstuff.gradeToEmoji(data.scoredata.rank)} | ${(ppcalc?.[0]?.stars ?? data.scoredata.beatmap.difficulty_rating).toFixed(2)}⭐\n` +
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
            )
        return embed;
    }

    async function trackUsers(db) {
        const allUsers = await db.findAll()
        allUsers.forEach(user => {
            osufunc.logCall(user.dataValues.osuid, 'Tracking user: ')
            if (user.dataValues.osuid == null) {
                osufunc.logCall('null id', 'Cancelling tracking')
            }
            else if (user.dataValues.guilds.length < 1) {
                osufunc.logCall(`User is not assigned to any guild (${user.dataValues.osuid})`, 'Cancelling tracking')
            } else {
                trackUser({
                    user: user.dataValues.osuid,
                    mode: user.dataValues.mode,
                    inital: false
                })
            }
        })
    }

    async function sendMsg(embed: Discord.EmbedBuilder, curuser: string) {
        const userobj = await trackDb.findOne({
            where: {
                osuid: curuser
            }
        })
        const guilds = userobj.guilds.split(',')

        let channels = []

        guilds.forEach(guild => {
            client.guilds.cache.forEach(async guild2 => {
                if (guilds.includes(guild2.id)) {
                    const curset = await guildSettings.findOne({
                        where: {
                            guildid: guild2.id
                        }
                    })
                    if (curset?.dataValues?.trackChannel) {
                        await channels.push(`${curset.trackChannel}`)
                        osufunc.logCall(`${curset.trackChannel}`, 'Found channel in guild settings')
                    } else {
                        osufunc.logCall('No channel set', 'Found channel in guild settings')
                    }
                }
            })
        })

        //filter out duplicates
        channels = await channels.filter((item, index) => channels.indexOf(item) === index)


        setTimeout(() => {
            channels.filter((item, index) => channels.indexOf(item) === index).forEach(channel => {
                const curchannel: Discord.GuildTextBasedChannel = client.channels.cache.get(channel) as Discord.GuildTextBasedChannel
                if (curchannel) {
                    osufunc.logCall(curchannel.id, 'Sending to channel')
                    curchannel.send({
                        embeds: [embed]
                    }).catch(error => {
                        osufunc.logCall(error, 'error sending to channel')
                        log.logFile('error', log.errLog('sending track embed', error))
                    })
                } else {
                    osufunc.logCall('Channel not found', 'error sending to channel')
                }
            })
        }, 2000)

    }

    // trackUsers(trackDb)

    setInterval(() => {
        trackUsers(trackDb)
    }, 60 * 1000 * 15); //requests every 15 min
}