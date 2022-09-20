import osufunc = require('./osufunc');
import osuApiTypes = require('./types/osuApiTypes');
import Sequelize = require('sequelize');
import fs = require('fs');
import Discord = require('discord.js');
import func = require('./other');
import embedstuff = require('./embed');
module.exports = (userdata, client, config, oncooldown, trackDb:Sequelize.ModelStatic<any>) => {

    async function trackUser(fr: { user: string, mode: string, inital?: boolean }) {
        const curdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('osutop', fr.user, fr.mode)
        const thisUser: osuApiTypes.User = await osufunc.apiget('user', fr.user, fr.mode)
        // osufunc.debug(curdata, 'auto', 'trackUser', curdata[0].id ?? 'ERROR', )
        if (!curdata?.[0]?.id) return;
        if (curdata?.[0]?.id && fr.inital == true) {
            fs.writeFileSync(`trackingFiles/${curdata[0].user_id}.json`, JSON.stringify(curdata, null, 2))
        }
        if (curdata?.[0]?.id) {
            // let file = fs.readFileSync(`trackingFiles/${curdata[0].id}.json`, 'utf-8')
            let previous: osuApiTypes.Score[] & osuApiTypes.Error = JSON.parse(fs.readFileSync(`trackingFiles/${curdata[0].id}.json`, 'utf-8'))

            curdata.sort((a, b) => parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))

            for (let i = 0; i < curdata.length; i++) {
                if (!previous.includes(curdata[i])) {
                    console.log('new score')
                    sendMsg(await getEmbed({
                        scoredata: curdata[i],
                        user: thisUser,
                        scorepos: i
                    }), fr.user)
                }
            }
        }
    }

    async function addTrackUser(
        fr: {
            database: Sequelize.ModelStatic<any>,
            user: string,
            action?: 'add' | 'remove',
            guildId: string | number
        }
    ) {
        const guildId = `${fr.guildId}`
        if (!fr.action || fr.action == 'add') {
            try {
                await fr.database.create({

                })
                fr.database
            } catch (error) {
                await fr.database.update({

                }, {
                    where: {
                        userid: fr.user
                    }
                })
            }
        } else {

        }
        // const allUsers = await sqlDatabase.findAll()

    }

    async function getEmbed(
        data: {
            scoredata: osuApiTypes.Score,
            user: osuApiTypes.User,
            scorepos: number,
        }
    ) {
        const ppcalc = osufunc.scorecalc(
            data.scoredata.mods.join(''),
            data.scoredata.mode,
            data.scoredata.beatmap.id,
            data.scoredata.statistics.count_geki,
            data.scoredata.statistics.count_300,
            data.scoredata.statistics.count_katu,
            data.scoredata.statistics.count_100,
            data.scoredata.statistics.count_50,
            data.scoredata.statistics.count_miss,
            data.scoredata.accuracy,
            data.scoredata.max_combo,
            data.scoredata.score,
            0, null, false
        )

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
                `${(data.scoredata.accuracy * 100).toFixed(2)}% | ${embedstuff.gradeToEmoji(data.scoredata.rank)} | ${ppcalc[0].stars.toFixed(2)}⭐\n` +
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
                user: user.osuid,
                mode: user.mode,
                inital: false
            })
        })
    }

    async function sendMsg(embed: Discord.EmbedBuilder, curuser: string) {
        const userobj = await trackDb.findOne({
            where: {
                osuid: curuser
            }
        })
        const channels = userobj.channels.split(',')

        channels.forEach(channel => {
            if (channel) {
                const curchannel = client.channels.get(channel)
                if (curchannel) {
                    curchannel.send({
                        embeds: [embed]
                    })
                }
            }
        })


    }

    // export { trackUser, trackUsers, addTrackUser };


    setInterval(() => {
        trackUsers(trackDb)
    }, 60 * 1000);
}