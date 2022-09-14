import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'recent',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user;
        let searchid;
        let page;
        let mode;
        let list;

        let isFirstPage = false;
        let isLastPage = false;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                user = args.join(' ');
                if (!args[0] || args[0].includes(searchid)) {
                    user = null
                }
                page = 0;
                mode = null;
                isFirstPage = true;

            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                searchid = obj.member.user.id;
                user = obj.options.getString('user');
                page = obj.options.getNumber('page');
                mode = obj.options.getString('mode');
                list = obj.options.getBoolean('list');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
                user =
                    obj.message.embeds[0].title.includes('play for') ?
                        obj.message.embeds[0].title.split('most recent play for ')[1].split(' | ')[0] :
                        obj.message.embeds[0].title.split('plays for ')[1]
                try {
                    mode = obj.message.embeds[0].fields[0].value.split(' | ')[1].split('\n')[0]
                } catch (error) {
                    mode = obj.message.embeds[0].footer.text.split('gamemode: ')[1]
                }
                page = 0
                if (button == 'BigLeftArrow') {
                    page = 1
                    isFirstPage = true
                }
                if (obj.message.embeds[0].title.includes('plays')) {
                    switch (button) {
                        case 'LeftArrow':
                            page = parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1
                            break;
                        case 'RightArrow':
                            page = parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1
                            break;
                        case 'BigRightArrow':
                            page = parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n'[0]))
                            break;
                        case 'Refresh':
                            page = parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0])
                            break;
                    }
                    list = true
                    if (isNaN((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) || ((obj.message.embeds[0].description).split('Page: ')[1].split('/')[0]) == 'NaN') {
                        page = 1
                    }
                    if (page < 2) {
                        isFirstPage = true;
                    }
                    if (page == parseInt((obj.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n'[0]))) {
                        isLastPage = true;
                    }
                } else {
                    switch (button) {
                        case 'LeftArrow':
                            page = parseInt((obj.message.embeds[0].title).split(' ')[0].split('#')[1]) - 1
                            break;
                        case 'RightArrow':
                            page = parseInt((obj.message.embeds[0].title).split(' ')[0].split('#')[1]) + 1
                            break;
                        case 'Refresh':
                            page = parseInt((obj.message.embeds[0].title).split(' ')[0].split('#')[1])
                            break;
                    }
                    if (page < 2) {
                        page == 1
                    }
                }
            }
                break;
        }
        if (overrides != null) {
            if (overrides.page != null) {
                page = overrides.page
            }
        }

        //==============================================================================================================================================================================================

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-recent-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔁'),
            )
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'recent',
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
                },
                {
                    name: 'Search ID',
                    value: searchid
                },
                {
                    name: 'Page',
                    value: page
                },
                {
                    name: 'Mode',
                    value: mode
                },
                {
                    name: 'List',
                    value: list
                },
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (user == null) {
            let cuser = await osufunc.searchUser(searchid, userdata, true);
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
        if (mode == null) {
            mode = 'osu'
        }
        if (page < 2 || typeof page != 'number') {
            isFirstPage = true;
            page = 1;
        }
        page--
        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-recent-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-recent-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀')
                    .setDisabled(isFirstPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-recent-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶')
                    .setDisabled(isLastPage),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-recent-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡')
                    .setDisabled(isLastPage),
            );
        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${user}`)
        fs.writeFileSync(`debug/command-rs=user=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        if (osudata?.error) {
            obj.reply({
                content: `${osudata?.error ? osudata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        if (!osudata.id) {
            return obj.channel.send(
                'Error - no user found'
            )
                .catch();

        }
        try {
            osufunc.updateUserStats(osudata, mode, userdata)
        } catch (error) {
            console.log(error)
        }

        const rsdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('recent', `${osudata.id}`, `${mode}`)
        fs.writeFileSync(`debug/command-rs=rsdata=${obj.guildId}.json`, JSON.stringify(rsdata, null, 2))
        if (rsdata?.error) {
            obj.reply({
                content: `${rsdata?.error ? rsdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        const rsEmbed = new Discord.EmbedBuilder();

        if (list != true) {
            rsEmbed.setColor(colours.embedColour.score.dec)

            if (button == 'BigRightArrow') {
                page = rsdata.length - 1
            }
            if (page >= rsdata.length - 1) {
                // pgbuttons.components[3].setDisabled(true)
                // pgbuttons.components[4].setDisabled(true)
            }

            const curscore = rsdata[0 + page]
            if (!curscore || curscore == undefined || curscore == null) {
                if (button == null) {
                    obj.reply(
                        {
                            content: ' Error - no score found',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                        .catch();

                }
                return;
            }
            const curbm = curscore.beatmap
            const curbms = curscore.beatmapset
            // const hittime = curbm.hit_length
            // let totalstr;


            const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${curbm.id}`)
            fs.writeFileSync(`debug/command-rs=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))
            if (mapdata?.error) {
                obj.reply({
                    content: `${mapdata?.error ? mapdata?.error : 'Error: null'}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                }).catch()
                return;
            }

            let accgr;
            let fcaccgr;
            const gamehits = curscore.statistics;
            switch (rsdata[0].mode) {
                case 'osu': default:
                    accgr =
                        osumodcalc.calcgrade(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_50,
                            gamehits.count_miss
                        )
                    fcaccgr =
                        osumodcalc.calcgrade(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_50,
                            0
                        )
                    break;
                case 'taiko':
                    accgr =
                        osumodcalc.calcgradeTaiko(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_miss
                        )
                    fcaccgr =
                        osumodcalc.calcgradeTaiko(
                            gamehits.count_300,
                            gamehits.count_100,
                            0
                        )
                    break;
                case 'fruits':
                    accgr =
                        osumodcalc.calcgradeCatch(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_50,
                            gamehits.count_katu,
                            gamehits.count_miss
                        )
                    fcaccgr =
                        osumodcalc.calcgradeCatch(
                            gamehits.count_300,
                            gamehits.count_100,
                            gamehits.count_50,
                            gamehits.count_katu,
                            0
                        )
                    break;
                case 'mania':
                    accgr =
                        osumodcalc.calcgradeMania(
                            gamehits.count_geki,
                            gamehits.count_300,
                            gamehits.count_katu,
                            gamehits.count_100,
                            gamehits.count_50,
                            gamehits.count_miss
                        )
                    fcaccgr =
                        osumodcalc.calcgradeMania(
                            gamehits.count_geki,
                            gamehits.count_300,
                            gamehits.count_katu,
                            gamehits.count_100,
                            gamehits.count_50,
                            0
                        )
                    break;
            }
            let rspassinfo = '';
            let totalhits;

            switch (rsdata[0].mode) {
                case 'osu': default:
                    totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_50 + gamehits.count_miss;
                    break;
                case 'taiko':
                    totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_miss;
                    break;
                case 'fruits':
                    totalhits = gamehits.count_300 + gamehits.count_100 + gamehits.count_50 + gamehits.count_katu + gamehits.count_miss;
                    break;
                case 'mania':
                    totalhits = gamehits.count_geki + gamehits.count_300 + gamehits.count_katu + gamehits.count_100 + gamehits.count_50 + gamehits.count_miss;
            }
            const curbmhitobj = mapdata.count_circles + mapdata.count_sliders + mapdata.count_spinners;
            const guesspasspercentage = Math.abs((totalhits / curbmhitobj) * 100);
            const curbmpasstime = Math.floor(guesspasspercentage / 100 * curbm.total_length);

            let rsgrade;
            switch (curscore.rank.toUpperCase()) {
                case 'F':
                    rspassinfo = `\n${guesspasspercentage.toFixed(2)}% completed (${calc.secondsToTime(curbmpasstime)}/${calc.secondsToTime(curbm.total_length)})`
                    rsgrade = emojis.grades.F
                    break;
                case 'D':
                    rsgrade = emojis.grades.D
                    break;
                case 'C':
                    rsgrade = emojis.grades.C
                    break;
                case 'B':
                    rsgrade = emojis.grades.B
                    break;
                case 'A':
                    rsgrade = emojis.grades.A
                    break;
                case 'S':
                    rsgrade = emojis.grades.S
                    break;
                case 'SH':
                    rsgrade = emojis.grades.SH
                    break;
                case 'X':
                    rsgrade = emojis.grades.X
                    break;
                case 'XH':
                    rsgrade = emojis.grades.XH
                    break;
            }
            let totaldiff: string;
            let hitlist: string;
            switch (curscore.mode) {
                case 'osu': default:
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                    break;
                case 'taiko':
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **Miss:** ${gamehits.count_miss}`
                    break;
                case 'fruits':
                    hitlist = `**300:** ${gamehits.count_300} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                    break;
                case 'mania':
                    hitlist = `**300+:** ${gamehits.count_geki} \n **300:** ${gamehits.count_300} \n **200:** ${gamehits.count_katu} \n **100:** ${gamehits.count_100} \n **50:** ${gamehits.count_50} \n **Miss:** ${gamehits.count_miss}`
                    break;
            }
            let rspp: string | number = 0;
            let ppissue: string = '';
            // const ppiffc = NaN;
            let ppcalcing
            try {
                ppcalcing = await osufunc.scorecalc(
                    curscore.mods.join('').length > 1 ?
                        curscore.mods.join('') : 'NM',
                    curscore.mode,
                    curscore.beatmap.id,
                    gamehits.count_geki,
                    gamehits.count_300,
                    gamehits.count_katu,
                    gamehits.count_100,
                    gamehits.count_50,
                    gamehits.count_miss,
                    curscore.accuracy,
                    curscore.max_combo,
                    curscore.score,
                    0,
                    0, false
                )
                if (curscore.rank == 'F') {
                    ppcalcing = await osufunc.scorecalc(
                        curscore.mods.join('').length > 1 ?
                            curscore.mods.join('') : 'NM',
                        curscore.mode,
                        curscore.beatmap.id,
                        gamehits.count_geki,
                        gamehits.count_300,
                        gamehits.count_katu,
                        gamehits.count_100,
                        gamehits.count_50,
                        gamehits.count_miss,
                        curscore.accuracy,
                        curscore.max_combo,
                        curscore.score,
                        0,
                        totalhits,
                        true
                    )
                }
                totaldiff = ppcalcing[0].stars.toFixed(2)


                rspp =
                    curscore.pp ?
                        curscore.pp.toFixed(2) :
                        ppcalcing[0].pp.toFixed(2)
                fs.writeFileSync(`debug/command-rs=pp_calc=${obj.guildId}.json`, JSON.stringify(ppcalcing, null, 2))
            } catch (error) {
                rspp =
                    curscore.pp ?
                        curscore.pp.toFixed(2) :
                        NaN
                ppissue = 'Error - pp calculator could not fetch beatmap'
            }
            let fcflag = 'FC'
            if (curscore.accuracy != 100) {
                fcflag += `\n**${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
            }
            if (curscore.perfect == false) {
                fcflag =
                    `\n**${ppcalcing[1].pp.toFixed(2)}**pp IF ${fcaccgr.accuracy.toFixed(2)}% FC
                **${ppcalcing[2].pp.toFixed(2)}**pp IF SS`
            }
            const title =
                curbms.title == curbms.title_unicode ?
                    curbms.title :
                    `${curbms.title} (${curbms.title_unicode})`
            const artist =
                curbms.artist == curbms.artist_unicode ?
                    curbms.artist :
                    `${curbms.artist} (${curbms.artist_unicode})`
            const fulltitle = `${artist} - ${title} [${curbm.version}]`
            let trycount = 1
            for (let i = rsdata.length - 1; i > (page); i--) {
                if (curbm.id == rsdata[i].beatmap.id) {
                    trycount++
                }
            }
            const trycountstr = `try #${trycount}`;

            rsEmbed
                .setTitle(`#${page + 1} most recent play for ${curscore.user.username} | <t:${new Date(curscore.created_at).getTime() / 1000}:R>`)
                .setURL(`https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id}`)
                .setAuthor({
                    name: `${trycountstr}`,
                    url: `https://osu.ppy.sh/u/${osudata.id}`,
                    iconURL: `https://a.ppy.sh/${osudata.id}`
                })
                .setThumbnail(`${curbms.covers.list}`)
                .addFields([
                    {
                        name: 'MAP DETAILS',
                        value:
                            `
[${fulltitle}](https://osu.ppy.sh/b/${curbm.id}) ${curscore.mods.length > 0 ? '+' + osumodcalc.OrderMods(curscore.mods.join('').toUpperCase()) : ''} 
${totaldiff}⭐ | ${curscore.mode}
${new Date(curscore.created_at).toISOString().replace(/T/, ' ').replace(/\..+/, '')}
                        `,
                        inline: false
                    },
                    {
                        name: 'SCORE DETAILS',
                        value: `${(curscore.accuracy * 100).toFixed(2)}% | ${rsgrade}\n` +
                            `${rspassinfo}\n${hitlist}\n${curscore.max_combo}x combo`,
                        inline: true
                    },
                    {
                        name: 'PP',
                        value: `**${rspp}**pp ${fcflag}\n${ppissue}`,
                        inline: true
                    }
                ])

            if (page >= rsdata.length - 1) {
                //@ts-ignore
                pgbuttons.components[2].setDisabled(true)
                //@ts-ignore
                pgbuttons.components[3].setDisabled(true)
            }

            osufunc.writePreviousId('map', obj.guildId, `${curbm.id}`)
            if (curscore.best_id != null) {
                osufunc.writePreviousId('score', obj.guildId, `${curscore}`)
            }
            osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`)

        } else if (list == true) {
            rsEmbed
                .setColor(colours.embedColour.scorelist.dec)
                .setTitle(`Recent plays for ${osudata.username}`);
            let txt = '';
            for (let i = 0; i < rsdata.length - (page * 20) && i < 20; i++) {
                const curscore = rsdata[i + page * 20]
                txt +=
                    `**${1 + i + page * 20} | <t:${new Date(curscore.created_at).getTime() / 1000}:R>**
[${curscore.beatmapset.title}](https://osu.ppy.sh/b/${curscore.beatmap.id}) | [score link](https://osu.ppy.sh/scores/${curscore.mode}/${curscore.best_id})
${curscore.mods.length > 0 ? '+' + curscore.mods.join('') + ' | ' : ''}${(curscore.accuracy * 100).toFixed(2)}% | ${curscore.rank}
`
            }
            if (txt == '') {
                txt = 'No recent plays found'
            }
            if (txt.length > 4000) {
                txt = txt.substring(0, 4000)
            }
            rsEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(rsdata.length / 20)}\n` + txt)
            rsEmbed.setFooter({ text: `gamemode: ${rsdata[0].mode}` })

            if (page >= Math.ceil(rsdata.length / 20)) {
                //@ts-ignore
                pgbuttons.components[2].setDisabled(true)
                //@ts-ignore
                pgbuttons.components[3].setDisabled(true)
            }
        }
        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, userdata)
        } catch (error) {
            console.log(error)
        }
        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: [rsEmbed],
                    components: [pgbuttons, buttons],
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
                    embeds: [rsEmbed],
                    components: [pgbuttons, buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: [rsEmbed],
                    components: [pgbuttons, buttons],
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