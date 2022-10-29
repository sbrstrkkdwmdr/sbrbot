import osufunc = require('./osufunc');
import osuApiTypes = require('./types/osuApiTypes');
import Sequelize = require('sequelize');
import fs = require('fs');
import Discord = require('discord.js');
import func = require('./tools');
import embedstuff = require('./embed');
import log = require('./log');

export async function editTrackUser(fr: {
    database: Sequelize.ModelStatic<any>,
    userid: string | number,
    action?: 'add' | 'remove',
    guildId: string | number,
    guildSettings: Sequelize.ModelStatic<any>,
    mode: string
}
) {

    if (!fr.action || fr.action == 'add') {
        try {
            await fr.database.create({
                osuid: fr.userid,
                [`guilds${fr.mode}`]: fr.guildId
            })

        } catch (error) {
            log.logFile('error', log.errLog('database track user creation err', error))
            const previous = await fr.database.findOne({ where: { osuid: fr.userid } })
            const prevchannels: string[] = previous?.dataValues?.guilds?.split(',') ?? []

            if (!prevchannels.includes(`${fr.guildId}`)) {
                prevchannels.push(`${fr.guildId}`)
            }



            await fr.database.update({
                osuid: fr.userid,
                [`guilds${fr.mode}`]: prevchannels.join(',')
            }, {
                where: {
                    osuid: fr.userid,
                }
            })
        }
    } else {
        const curuser = await fr.database.findOne({ where: { osuid: fr.userid } })
        const curguilds: string[] = curuser.dataValues[`guilds${fr.mode}`].split(',')
        const newguilds = curguilds.filter(channel => channel != fr.guildId)
        await fr.database.update({
            osuid: fr.userid,
            [`guilds${fr.mode}`]: newguilds.join(',')
        }, {
            where: {
                osuid: fr.userid
            }
        })

    }
    return true;
}
