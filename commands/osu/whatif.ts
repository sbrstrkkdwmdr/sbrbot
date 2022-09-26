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
import def = require('../../src/consts/defaults');

module.exports = {
    name: 'whatif',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let user;
        let pp;
        let searchid;
        let mode;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;

                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;

                if (!isNaN(+args[0])) {
                    pp = +args[0];
                }

                if ((args[0] && args[1])) {
                    if (args[0].includes(searchid)) {
                        user = null
                    } else {
                        user = args[0]
                    }
                    pp = args[1] ?? null;

                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                user = obj.options.getString('user');
                searchid = obj.member.user.id;
                mode = obj.options.getString('mode');
                pp = obj.options.getNumber('pp');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }


        //==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'whatif',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [
                    {
                        name: 'user',
                        value: user
                    },
                    {
                        name: 'pp',
                        value: pp
                    },
                    {
                        name: 'mode',
                        value: mode
                    },
                    {
                        name: 'searchid',
                        value: searchid
                    }
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        if (user == null) {
            const cuser = await osufunc.searchUser(searchid, userdata, true);
            user = cuser.username;
            if (mode == null) {
                mode = cuser.gamemode;
            }
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
        if (!pp) {
            pp = 100;
        }

        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${user}`);
        osufunc.debug(osudata, 'command', 'whatif', obj.guildId, 'osuData');

        if (mode == null) {
            mode = osudata.playmode;
        }

        const osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
        osufunc.debug(osutopdata, 'command', 'whatif', obj.guildId, 'osuTopData');

        let pparr = osutopdata.slice().map(x => x.pp);
        pparr.push(pp);
        pparr.sort((a, b) => b - a);
        const frpp = pparr.slice(0, 99)
        const ppindex = frpp.indexOf(pp);

        const weight = osufunc.findWeight(ppindex);

        const newTotal: number[] = [];

        for (let i = 0; i < frpp.length; i++) {
            newTotal.push(frpp[i] * osufunc.findWeight(i));
        }

        const total = newTotal.reduce((a, b) => a + b, 0);
        //     416.6667 * (1 - 0.9994 ** osudata.statistics.play_count);

        const newBonus = [];
        for (let i = 0; i < osutopdata.length; i++) {
            newBonus.push(osutopdata[i].pp * osufunc.findWeight(i));
        }
        const bonus = osudata.statistics.pp - newBonus.reduce((a, b) => a + b, 0);

        const embed = new Discord.EmbedBuilder()
            .setTitle(`What if ${osudata.username} gained ${pp}pp?`)
            .setColor(colours.embedColour.query.dec)
            .setThumbnail(`${osudata?.avatar_url ?? def.images.any.url}`)
            .setAuthor({
                name: `#${func.separateNum(osudata?.statistics?.global_rank)} | #${func.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${func.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/u/${osudata.id}`,
                iconURL: `${`https://osuflags.omkserver.nl/${osudata.country_code}.png`}`
            })
            .setDescription(
                `A ${pp} score would be their **${calc.toOrdinal(ppindex + 1)}** top play and would be weighted at **${(weight * 100).toFixed(2)}%**.
Their pp would change by **${Math.abs((total + bonus) - osudata.statistics.pp).toFixed(2)}pp** and their new total pp would be **${(total + bonus).toFixed(2)}pp**.
Their new rank would be **null** (+null).
`
            )

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
                obj.reply({
                    content: '',
                    embeds: [embed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
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