import osufunc = require('./osufunc');
import osuApiTypes = require('./types/osuApiTypes');
import Sequelize = require('sequelize');
import fs = require('fs');
import Discord = require('discord.js');
import func = require('./other');
import embedstuff = require('./embed');
import log = require('./log');

async function trackUser(fr: { user: string, mode: string, inital?: boolean }) {
    const curdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('osutop', fr.user, fr.mode)
    const thisUser: osuApiTypes.User = await osufunc.apiget('user', fr.user, fr.mode)
    if (!curdata?.[0]?.id) return;
    if (curdata?.[0]?.id && fr.inital == true) {
        fs.writeFileSync(`trackingFiles/${curdata[0].user_id}.json`, JSON.stringify(curdata, null, 2))
    }
    if (curdata?.[0]?.id) {
        let previous: osuApiTypes.Score[] & osuApiTypes.Error = JSON.parse(fs.readFileSync(`trackingFiles/${curdata[0].id}.json`, 'utf-8'))

        curdata.sort((a, b) => parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))

        for (let i = 0; i < curdata.length; i++) {
            if (!previous.includes(curdata[i])) {
                sendMsg(await getEmbed({
                    scoredata: curdata[i],
                    user: thisUser,
                    scorepos: i
                }))
            }
        }
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
        user: osuApiTypes.User,
        scorepos: number,
    }
) {
    const ppcalc = await osufunc.scorecalc({
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
            name: `New #${data.scorepos + 1} play for ${data.user.username} | #${func.separateNum(data.user?.statistics?.global_rank)} | #${func.separateNum(data.user?.statistics?.country_rank)} ${data.user.country_code} | ${func.separateNum(data.user?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/u/${data.scoredata.user.id}`,
            iconURL: `${`https://osuflags.omkserver.nl/${data.scoredata.user.country_code}.png`}`
        })
        .setImage(`${data.scoredata.beatmapset.covers['cover@2x']}`)
        .setDescription(
            `${data.scoredata.mods ? '+' + data.scoredata.mods.join('') + ' | ' : ''} **Score set** <:t${new Date(data.scoredata.created_at).getTime() / 1000}:R>\n` +
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
        trackUser({
            user: user.userid,
            mode: user.mode,
            inital: false
        })
    })
}

function sendMsg(embed: Discord.EmbedBuilder) {

}

export { trackUser, trackUsers, editTrackUser };

