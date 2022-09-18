import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import colourfunc = require('../../src/colourcalc');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');
import func = require('../../src/other');

module.exports = {
    name: 'bws',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let user;
        let searchid;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                user = args.join(' ');
                if (!args[0] || args[0].includes(searchid)) {
                    user = null
                }
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                commanduser = obj.member.user;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                user = args.join(' ');
                if (!args[0] || args[0].includes(searchid)) {
                    user = null
                }
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }
        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-bws-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-bws-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-bws-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-bws-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                /* .setLabel('End') */,
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'bws',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'User',
                    value: user
                }]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (user == null) {
            let cuser = await osufunc.searchUser(searchid, userdata, true);
            user = cuser.username;
            if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                if (commandType != 'button') {
                    obj.reply({
                        content: 'User not found',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
                return;
            }
        }

        if (commandType == 'interaction') {
            obj.reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).catch()
        }

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`, `osu`)
        osufunc.debug(osudata, 'command', 'bws', obj.guildId, 'osuData');

        let badgecount = 0;
        for (const badge of osudata.badges) {
            badgecount++
        }
        function bwsF(badgenum: number) {
            return badgenum > 0 ?
                osudata.statistics.global_rank ** (0.9937 ** (badgenum ** 2)) :
                osudata.statistics.global_rank

        }
        // const bws = badgecount > 0 ? osudata.statistics.global_rank ** (0.9937 ** (badgecount ** 2)) : osudata.statistics.global_rank

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${osudata.username} (#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp)`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
            })
            .setTitle(`Badge weighting for ${osudata.username}`)
            .setThumbnail(`${osudata?.avatar_url}`)
            .setDescription(
                'Current number of badges: ' + badgecount
            )
            .addFields([
                {
                    name: `${badgecount == 1 ? badgecount + ' badge' : badgecount + ' badges'}`,
                    value: `${Math.floor(bwsF(badgecount))}`,
                    inline: true
                },
                {
                    name: `${badgecount + 1 == 1 ? badgecount + 1 + ' badge' : badgecount + 1 + ' badges'}`,
                    value: `${Math.floor(bwsF(badgecount + 1))}`,
                    inline: true
                },
                {
                    name: `${badgecount + 2} badges`,
                    value: `${Math.floor(bwsF(badgecount + 2))}`,
                    inline: true
                },
            ])
        //\nFormula: rank^(0.9937^badges^2)
        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [embed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
            //==============================================================================================================================================================================================
            case 'interaction': {
                setTimeout(() => {
                    obj.editReply({
                        content: '',
                        embeds: [embed],
                        files: [],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000)
            }
                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}