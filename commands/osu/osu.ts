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
import func = require('../../src/other');

module.exports = {
    name: 'osu',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let user = null;
        let mode = null;
        let detailed;
        let searchid;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                // let msgcontent = args.join(' ')
                // if (args.join(' ').includes('detailed')) {
                //     detailed = true;
                //     msgcontent = msgcontent.replace('detailed', '')
                // }
                user = args.join(' ');
                if (!args[0] || args[0].includes(searchid)) {
                    user = null
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                user = obj.options.getString('user');
                detailed = obj.options.getBoolean('detailed');
                mode = obj.options.getString('mode');
                searchid = obj.member.user.id;
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                if (!obj.message.embeds[0]) {
                    return;
                }
                commanduser = obj.member.user;
                if (obj.message.embeds[0].fields[0]) {
                    detailed = true
                }

                //user =  message.embeds[0].title.split('\'s')[0]
                //link = https://osu.ppy.sh/users/USERNAME/GAMEMODE
                user = obj.message.embeds[0].url.split('users/')[1].split('/')[0]
                mode = obj.message.embeds[0].url.split('users/')[1].split('/')[1]

                if (button == 'DetailEnable') {
                    detailed = true;
                }
                if (button == 'DetailDisable') {
                    detailed = false;
                }
                if (button == 'Refresh') {
                    if (obj.message.embeds[0].fields[0]) {
                        detailed = true
                    } else {
                        detailed = false
                    }
                }
            }
                break;
            case 'link': {
                commanduser = obj.author;
                searchid = obj.mentions.users.size > 0 ? obj.mentions.users.first().id : obj.author.id;
                user = obj.content.includes(' ') ? obj.content.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[2].split(' ')[0] : obj.content.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[2]
            }
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const pgbuttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-osu-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-osu-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-osu-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-osu-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-osu-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🔁'),
                // new Discord.ButtonBuilder()
                //     .setCustomId(`Detailed-osu-${commanduser.id}`)
                //     .setStyle(Discord.ButtonStyle.Primary)
                //     .setEmoji('📝'),
            )

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'osu',
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
                    name: 'Detailed',
                    value: detailed
                },
                {
                    name: 'Gamemode',
                    value: mode
                }
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        if (detailed == true) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailDisable-osu-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('📝')
            )
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailEnable-osu-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('📝')
            )
        }

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
        let osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`, `${mode}`)
        // fs.writeFileSync(`debug/command-osu=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        osufunc.debug(osudata, 'command', 'osu', obj.guildId, 'osuData');

        if (((commandType == 'interaction' && !obj?.options?.getString('mode')) || commandType == 'message') && osudata.playmode != 'osu') {
            mode = osudata.playmode
            osudata = await osufunc.apiget('user', `${user}`, `${mode}`);
            osufunc.debug(osudata, 'command', 'osu', obj.guildId, 'osuData');
        }

        if (osudata?.error) {
            if (commandType != 'button') obj.reply({
                content: `${osudata?.error ? osudata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }
        try {
            osufunc.updateUserStats(osudata, osudata.playmode, userdata)
        } catch (error) {
            console.log(error)
        }

        const osustats = osudata.statistics;
        const grades = osustats.grade_counts;

        const playerrank =
            osudata.statistics.global_rank == null ?
                '---' :
                func.separateNum(osudata.statistics.global_rank);
        ;
        const countryrank =
            osudata.statistics.country_rank == null ?
                '---' :
                func.separateNum(osudata.statistics.country_rank);

        const onlinestatus = osudata.is_online == true ?
            `**${emojis.onlinestatus.online} Online**` :
            `**${emojis.onlinestatus.offline} Offline** | Last online <t:${(new Date(osudata.last_visit)).getTime() / 1000}:R>`

        const prevnames = osudata.previous_usernames.length > 0 ?
            '**Previous Usernames:** ' + osudata.previous_usernames.join(', ') :
            ''
            ;

        const playcount = osustats.play_count == null ?
            '---' :
            func.separateNum(osustats.play_count);

        //${osustats.level.current}.${osustats.level.progress.toFixed(2)}
        const lvl = osustats.level.current != null ?
            osustats.level.progress != null && osustats.level.progress > 0 ?
                `${osustats.level.current}.${Math.floor(osustats.level.progress)}` :
                `${osustats.level.current}` :
            '---'

        const osuEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.user.dec)
            .setTitle(`${osudata.username}'s ${mode} profile`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode}`)
            .setThumbnail(osudata?.avatar_url ? osudata.avatar_url : `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)

        let useEmbeds = [];
        if (detailed == true) {
            const loading = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.user.dec)
                .setTitle(`${osudata.username}'s ${mode} profile`)
                .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode}`)
                .setThumbnail(osudata?.avatar_url ? osudata.avatar_url : `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
                .setDescription(`Loading...`);

            if (commandType == 'interaction') {
                if (commandType != 'button') obj.reply({
                    embeds: [loading],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();

            }
            const dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',')
            const datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',')

            const chartplay = await osufunc.graph(dataplay, osudata.monthly_playcounts.map(x => x.count), 'Playcount graph', false, false, true, true, true);
            const chartrank = await osufunc.graph(datarank, osudata.rank_history.data, 'Rank graph', null, null, null, null, null, 'rank');

            const ChartsEmbedRank = new Discord.EmbedBuilder()
                .setDescription('Click on the image to see the full chart')
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${chartrank}`);

            const ChartsEmbedPlay = new Discord.EmbedBuilder()
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${chartplay}`);

            const osutopdata: osuApiTypes.Score[] & osuApiTypes.Error = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
            // fs.writeFileSync(`debug/command-osu=osutopdata=${obj.guildId}.json`, JSON.stringify(osutopdata, null, 2))
            osufunc.debug(osutopdata, 'command', 'osu', obj.guildId, 'osuTopData');

            if (osutopdata?.error) {
                if (commandType != 'button') obj.reply({
                    content: `${osutopdata?.error ? osutopdata?.error : 'Error: null'}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                }).catch()
                return;
            }

            const mostplayeddata: osuApiTypes.BeatmapPlaycount[] & osuApiTypes.Error = await osufunc.apiget('most_played', `${osudata.id}`)
            // fs.writeFileSync(`debug/command-osu=mostplayeddata=${obj.guildId}.json`, JSON.stringify(mostplayeddata, null, 2))
            osufunc.debug(mostplayeddata, 'command', 'osu', obj.guildId, 'mostPlayedData');

            if (mostplayeddata?.error) {
                if (commandType != 'button') obj.reply({
                    content: `${mostplayeddata?.error ? mostplayeddata?.error : 'Error: null'}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                }).catch()
                return;
            }
            const secperplay = osudata?.statistics.play_time / parseFloat(playcount.replaceAll(',', ''))

            const highestcombo = func.separateNum((osutopdata.sort((a, b) => b.max_combo - a.max_combo))[0].max_combo);
            const maxpp = ((osutopdata.sort((a, b) => b.pp - a.pp))[0].pp).toFixed(2)
            const minpp = ((osutopdata.sort((a, b) => a.pp - b.pp))[0].pp).toFixed(2)
            let totalpp = 0;
            for (let i2 = 0; i2 < osutopdata.length; i2++) {
                totalpp += osutopdata[i2].pp
            }
            const avgpp = (totalpp / osutopdata.length).toFixed(2)
            let mostplaytxt = ``
            for (let i2 = 0; i2 < mostplayeddata.length && i2 < 10; i2++) {
                const bmpc = mostplayeddata[i2]
                mostplaytxt += `\`${bmpc.count.toString() + ' plays'.padEnd(15, ' ')}\` | [${bmpc.beatmapset.title}[${bmpc.beatmap.version}]](https://osu.ppy.sh/b/${bmpc.beatmap_id})\n`
            }
            osuEmbed.addFields([
                {
                    name: 'Stats',
                    value:
                        `**Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}
**Total Play Time:** ${calc.secondsToTime(osudata?.statistics.play_time)} (${calc.secondsToTimeReadable(osudata?.statistics.play_time, true, false)})`,
                    inline: true
                },
                {
                    name: '-',
                    value:
                        `**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>                        
${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}
**Followers:** ${osudata.follower_count}
${prevnames}
${onlinestatus}
**Avg time per play:** ${calc.secondsToTime(secperplay)}`,
                    inline: true
                }
            ])
            osuEmbed.addFields([{
                name: 'Most Played Beatmaps',
                value: mostplaytxt != `` ? mostplaytxt : 'No data',
                inline: false
            }]
            )


            osuEmbed.addFields([
                {
                    name: 'Top play info',
                    value:
                        `**Most common mapper:** ${osufunc.modemappers(osutopdata).beatmapset.creator}
            **Most common mods:** ${osufunc.modemods(osutopdata).mods.toString().replaceAll(',', '')}
            **Gamemode:** ${mode}
            **Highest combo:** ${highestcombo}`,
                    inline: true
                },
                {
                    name: '-',
                    value: `**Highest pp:** ${maxpp}
            **Lowest pp:** ${minpp}
            **Average pp:** ${avgpp}
            **Highest accuracy:** ${((osutopdata.sort((a, b) => b.accuracy - a.accuracy))[0].accuracy * 100).toFixed(2)}%
            **Lowest accuracy:** ${((osutopdata.sort((a, b) => a.accuracy - b.accuracy))[0].accuracy * 100).toFixed(2)}%`,
                    inline: true
                }])

            useEmbeds = [osuEmbed, ChartsEmbedRank, ChartsEmbedPlay]
        } else {
            osuEmbed.setDescription(`
**Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}
${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}\n
**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>
**Followers:** ${osudata.follower_count}
${prevnames}
${onlinestatus}
**Total Play Time:** ${calc.secondsToTimeReadable(osudata?.statistics.play_time, true, false)}
            `)
            useEmbeds = [osuEmbed]
        }

        osufunc.writePreviousId('user', obj.guildId, `${osudata.id}`);


        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: useEmbeds,
                    files: [],
                    components: [buttons],
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
                        embeds: useEmbeds,
                        components: [buttons],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000)
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: useEmbeds,
                    components: [buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'link': {
                obj.reply({
                    content: '',
                    embeds: useEmbeds,
                    components: [buttons],
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