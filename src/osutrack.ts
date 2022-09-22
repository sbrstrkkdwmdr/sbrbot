import osufunc = require('./osufunc');
import osuApiTypes = require('./types/osuApiTypes');
import Sequelize = require('sequelize');
import fs = require('fs');
import Discord = require('discord.js');
import func = require('./other');
import embedstuff = require('./embed');
module.exports = (userdata, client, config, oncooldown, trackDb: Sequelize.ModelStatic<any>, guildSettings: Sequelize.ModelStatic<any>) => {

    async function trackUser(fr: { user: string, mode: string, inital?: boolean }) {
        const curdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('osutop', fr.user, fr.mode)
        const thisUser: osuApiTypes.User = await osufunc.apiget('user', fr.user, fr.mode)
        // osufunc.debug(curdata, 'auto', 'trackUser', curdata[0].id ?? 'ERROR', )
        if (!curdata?.[0]?.user_id) return;
        if (curdata?.[0]?.user_id && fr.inital == true) {
            fs.writeFileSync(`trackingFiles/${curdata[0].user_id}.json`, JSON.stringify(curdata, null, 2))
            return;
        }
        if (curdata?.[0]?.user_id) {
            if (fs.existsSync(`trackingFiles/${curdata[0].user_id}.json`)) {
                let previous: osuApiTypes.Score[] & osuApiTypes.Error = JSON.parse(fs.readFileSync(`trackingFiles/${curdata[0].user_id}.json`, 'utf-8'))

                // curdata.sort((a, b) => parseFloat(b.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')) - parseFloat(a.created_at.slice(0, 19).replaceAll('-', '').replaceAll('T', '').replaceAll(':', '').replaceAll('+', '')))

                for (let i = 0; i < curdata.length; i++) {

                    //if current score is not in previous scores

                    if (!previous.find(x => x.id == curdata[i].id)) {
                        // console.log(curdata[i].id)
                        // console.log('new score #' + i)
                        sendMsg(await getEmbed({
                            scoredata: curdata[i],
                            user: thisUser,
                            scorepos: i
                        }), fr.user)
                    }
                    // for (let j = 0; i < curdata.length; j++) {
                    //     if (!previous[j]) break;


                    //     if (curdata[i].id == previous[j].id) {
                    //         console.log('new score #' + i)
                    //         sendMsg(await getEmbed({
                    //             scoredata: curdata[i],
                    //             user: thisUser,
                    //             scorepos: i
                    //         }), fr.user)
                    //     }
                    // }
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
        // const guildsetting = await fr.guildSettings.findOne({
        //     where: { guildId: fr.guildId }
        // })
        if (!fr.action || fr.action == 'add') {
            try {
                await fr.database.create({
                    userid: fr.discuser,
                    osuid: fr.user,
                    guilds: fr.guildId
                })
                // console.log(guildsetting)
                // fr.database
            } catch (error) {
                const previous = await fr.database.findOne({ where: { userid: fr.discuser } })
                const prevchannels: string[] = previous?.dataValues?.guilds?.split(',') ?? []
    
                if (!prevchannels.includes(`${fr.guildId}`)) {
                    prevchannels.push(`${fr.guildId}`)
                }
                // console.log(prevchannels)
    
    
    
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
        // const allUsers = await sqlDatabase.findAll()
        return true;
    }

    async function getEmbed(
        data: {
            scoredata: osuApiTypes.Score,
            user: osuApiTypes.User,
            scorepos: number,
        }
    ) {
        const ppcalc =
            // await osufunc.scorecalc(
            //     data.scoredata.mods.join(''),
            //     data.scoredata.mode,
            //     data.scoredata.beatmap.id,
            //     data.scoredata.statistics.count_geki,
            //     data.scoredata.statistics.count_300,
            //     data.scoredata.statistics.count_katu,
            //     data.scoredata.statistics.count_100,
            //     data.scoredata.statistics.count_50,
            //     data.scoredata.statistics.count_miss,
            //     data.scoredata.accuracy,
            //     data.scoredata.max_combo,
            //     data.scoredata.score,
            //     0, null, false
            // )
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
                name: `New #${data.scorepos + 1} play for ${data.user.username} | #${func.separateNum(data.user?.statistics?.global_rank)} | #${func.separateNum(data.user?.statistics?.country_rank)} ${data.user.country_code} | ${func.separateNum(data.user?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/u/${data.scoredata.user.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${data.scoredata.user.country_code}.png`}`
            })
            .setImage(`${data.scoredata.beatmapset.covers['cover@2x']}`)
            .setDescription(
                `${data.scoredata.mods ? '+' + data.scoredata.mods.join('') + ' | ' : ''} **Score set** <t:${new Date(data.scoredata.created_at).getTime() / 1000}:R>\n` +
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
            trackUser({
                user: user.dataValues.osuid,
                mode: user.dataValues.mode,
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
        const guilds = userobj.guilds.split(',')

        // console.log(guilds)

        let channels = []

        guilds.forEach(guild => {
            client.guilds.cache.forEach(async guild2 => {
                // console.log(guild2.id)
                if (guilds.includes(guild2.id)) {
                    // console.log(true)
                    const curset = await guildSettings.findOne({
                        where: {
                            guildid: guild2.id
                        }
                    })
                    if (curset?.dataValues?.trackChannel) {
                        await channels.push(`${curset.trackChannel}`)
                        // console.log('tracking enabled in guild')
                    }
                }
            })
        })


        // console.log(guilds)
        // console.log('----------')
        // console.log(channels)

        //filter out duplicates
        channels = await channels.filter((item, index) => channels.indexOf(item) === index)


        setTimeout(() => {
            let i = 0;
            channels.filter((item, index) => channels.indexOf(item) === index).forEach(channel => {
                // console.log(channel)
                // console.log(i)
                // console.log('channel found')
                const curchannel: Discord.GuildTextBasedChannel = client.channels.cache.get(channel) as Discord.GuildTextBasedChannel
                // const curchannel = client.channels.get(channel)
                if (curchannel) {
                    // console.log('sending')
                    curchannel.send({
                        embeds: [embed]
                    }).catch()
                }
                i++;

            })
        }, 2000)

    }

    // export { trackUser, trackUsers, addTrackUser };

    // trackUsers(trackDb)

    setInterval(() => {
        trackUsers(trackDb)
    }, 60 * 1000 * 5); //requests ever 5 min
}