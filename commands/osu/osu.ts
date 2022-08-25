import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../calc/osufunc');
import cmdchecks = require('../../calc/commandchecks');
import chartjsimg = require('chartjs-to-image');
import colours = require('../../configs/colours');
import osuApiTypes = require('../../configs/osuApiTypes');

module.exports = {
    name: 'osu',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides) {
        let commanduser;
        let user;
        let searchid;
        let mode = 'osu';
        let detailed = false;
        let curuid;
        let mtns = 0;

        if (message != null && button == null) {
            commanduser = message.author;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - osu (message)
${currentDate} | ${currentDateISO}
recieved osu profile command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            curuid = commanduser.id

            user = args.join(' ')
            searchid = message.author.id
            if (message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            if (!args[0]) {
                user = null
            }
            mode = null;
            detailed = false;
            mtns = message.mentions.size
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - osu (interaction)
${currentDate} | ${currentDateISO}
recieved osu profile command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            curuid = commanduser.id

            user = interaction.options.getString('user');
            mode = interaction.options.getString('mode');
            detailed = interaction.options.getBoolean('detailed');
            searchid = interaction.member.user.id;

        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - osu (button)
${currentDate} | ${currentDateISO}
recieved osu profile command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
            curuid = commanduser.id
            if (message.embeds[0].fields[0]) {
                detailed = true
            }

            //user =  message.embeds[0].title.split('\'s')[0]
            user = message.embeds[0].url.split('users/')[1]
            if (button == 'DetailEnable') {
                detailed = true;
            }
            if (button == 'DetailDisable') {
                detailed = false;
            }
        }

        if(overrides != null){
            user = overrides.user;
            mode = 'osu';
            detailed = false;
        }

        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    user: ${user}
    mode: ${mode}
    detailed: ${detailed}
    searchid: ${searchid}
----------------------------------------------------
`, 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-osu-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-osu-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-osu-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-osu-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    /* .setLabel('End') */,
            );
        if (user == null || user.includes('<') || mtns > 0) {
            const findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname != null) {
                user = findname.get('osuname');
            } else {
                return interaction.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false } })
                    .catch();

            }
        }
        if (mode == null) {
            const findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname == null) {
                mode = 'osu'
            } else {
                mode = findname.get('mode')
                if (mode.length < 1) {
                    mode = 'osu'
                }
            }
        } else {
            mode = 'osu'
        }
        if (!(mode == 'osu' || mode == 'taiko' || mode == 'fruits' || mode == 'mania')) {
            mode = 'osu'
        }

        if (detailed == true) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailDisable-osu-${curuid}`)
                    .setStyle('Primary')
                    .setEmoji('ℹ')
                /* .setLabel('End') */
            )
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailEnable-osu-${curuid}`)
                    .setStyle('Primary')
                    .setEmoji('ℹ')
                /* .setLabel('End') */
            )
        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    user: ${user}
    mode: ${mode}
    detailed: ${detailed}
    searchid: ${searchid}
----------------------------------------------------
`, 'utf-8')
        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${await user}`)
        fs.writeFileSync(`debugosu/command-osu=osudata=${obj.guildId}.json`, JSON.stringify(osudata, null, 2))
        try {
            if (osudata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                return obj.reply({
                    content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.',
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })

            }
        } catch (error) {

        }


        const findname = await userdata.findOne({ where: { osuname: user } })
        if (findname != null) {
            switch (mode) {
                case 'osu':
                default:
                    await userdata.update({
                        osupp: osudata.statistics.pp,
                        osurank: osudata.statistics.global_rank,
                        osuacc: osudata.statistics.hit_accuracy
                    }, {
                        where: { osuname: user }
                    })
                    break;
                case 'taiko':
                    await userdata.update({
                        taikopp: osudata.statistics.pp,
                        taikorank: osudata.statistics.global_rank,
                        taikoacc: osudata.statistics.hit_accuracy
                    }, {
                        where: { osuname: user }
                    })
                    break;
                case 'fruits':
                    await userdata.update({
                        fruitspp: osudata.statistics.pp,
                        fruitsrank: osudata.statistics.global_rank,
                        fruitsacc: osudata.statistics.hit_accuracy
                    }, {
                        where: { osuname: user }
                    })
                    break;
                case 'mania':
                    await userdata.update({
                        maniapp: osudata.statistics.pp,
                        maniarank: osudata.statistics.global_rank,
                        maniaacc: osudata.statistics.hit_accuracy
                    }, {
                        where: { osuname: user }
                    })
                    break;
            }
        }

        const osustats = osudata.statistics;
        const grades = osustats.grade_counts;

        const playerrank =
            osudata.statistics.global_rank == null ?
                '---' :
                osudata.statistics.global_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
        const countryrank =
            osudata.statistics.country_rank == null ?
                '---' :
                osudata.statistics.country_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        const onlinestatus = osudata.is_online == true ?
            `**${emojis.onlinestatus.online} Online**` :
            `**${emojis.onlinestatus.offline} Offline** | Last online <t:${(new Date(osudata.last_visit)).getTime() / 1000}:R>`

        const prevnames = osudata.previous_usernames.length > 0 ?
            '**Previous Usernames:** ' + osudata.previous_usernames.join(', ') :
            ''
            ;

        const playcount = osustats.play_count == null ?
            '---' :
            osustats.play_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        //${osustats.level.current}.${osustats.level.progress.toFixed(2)}
        const lvl = osustats.level.current != null ?
            osustats.level.progress != null ?
                `${osustats.level.current}.${osustats.level.progress.toFixed(2)}` :
                `${osustats.level.current}` :
            '---'

        const osuEmbed = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.user.hex)
            .setTitle(`${osudata.username}'s osu! profile`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
            .setThumbnail(osudata?.avatar_url ? osudata.avatar_url : `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)

        let useEmbeds = [];
        if (detailed == true) {
            const loading = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.user.hex)
                .setTitle(`${osudata.username}'s osu! profile`)
                .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
                .setThumbnail(osudata?.avatar_url ? osudata.avatar_url : `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
                .setDescription(`Loading...`);

            if (interaction != null && message == null) {
                obj.reply({
                    embeds: [loading],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();

            }
            const dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',')
            const datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',')

            const chartplay = new chartjsimg()
                .setConfig({
                    type: 'line',
                    data: {
                        labels: dataplay,
                        datasets: [{
                            label: 'Monthly Playcount',
                            data: osudata.monthly_playcounts.map(x => x.count),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 1,
                            pointRadius: 0
                        },
                        ]
                    }
                })
            const chartrank = new chartjsimg()
                .setConfig({
                    type: 'line',
                    data: {
                        labels: datarank,
                        datasets: [{
                            label: 'Rank History',
                            data: osudata.rank_history.data,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            borderWidth: 1,
                            pointRadius: 0
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [
                                {
                                    display: false
                                }
                            ],
                            yAxes: [
                                {
                                    display: true,
                                    type: 'linear',
                                    ticks: {
                                        reverse: true,
                                        beginAtZero: false
                                    },
                                }
                            ]
                        }
                    }
                })
                ;
            chartplay.setBackgroundColor('color: rgb(0,0,0)').setWidth(750).setHeight(450)
            chartrank.setBackgroundColor('color: rgb(0,0,0)').setWidth(1500).setHeight(600)
            chartrank.getShortUrl();
            const ChartsEmbedRank = new Discord.EmbedBuilder()
                .setDescription('Click on the image to see the full chart')
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${await chartrank.getShortUrl()}`);

            const ChartsEmbedPlay = new Discord.EmbedBuilder()
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${await chartplay.getShortUrl()}`);
            chartrank.toFile('./debugosu/playerrankgraph.jpg')
            chartplay.toFile('./debugosu/playerplaygraph.jpg')


            const osutopdata: osuApiTypes.Score[] = await osufunc.apiget('best', `${osudata.id}`, `${mode}`)
            fs.writeFileSync(`debugosu/command-osu=osutopdata=${obj.guildId}.json`, JSON.stringify(osutopdata, null, 2))

            const mostplayeddata: osuApiTypes.BeatmapPlaycount[] = await osufunc.apiget('most_played', `${osudata.id}`)

            fs.writeFileSync(`debugosu/command-osu=mostplayeddata=${obj.guildId}.json`, JSON.stringify(mostplayeddata, null, 2))

            const highestcombo = (osutopdata.sort((a, b) => b.max_combo - a.max_combo))[0].max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                        `**Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)\n
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}`,
                    inline: true
                },
                {
                    name: '-',
                    value:
                        `**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>                        
${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}
**Followers:** ${osudata.follower_count}
${prevnames}
${onlinestatus}`,
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
**Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)\n
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}
${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}

**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>
**Followers:** ${osudata.follower_count}
${prevnames}
${onlinestatus}
            `)
            useEmbeds = [osuEmbed]
        }

        if (interaction != null && message == null && button == null) {
            if (detailed == true) {
                obj.editReply({
                    embeds: useEmbeds,
                    components: [buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            } else {
                obj.reply({
                    embeds: useEmbeds,
                    components: [buttons],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
        }
        if (message != null && interaction == null && button == null) {
            obj.reply({
                embeds: useEmbeds,
                components: [buttons],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();

        }
        if (button != null) {
            message.edit({
                embeds: useEmbeds,
                components: [buttons],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch();
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Command Latency - ${new Date().getTime() - currentDate.getTime()}ms
success
----------------------------------------------------
`, 'utf-8')
    }
}