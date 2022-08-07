import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../configs/osufunc');
import cmdchecks = require('../../configs/commandchecks');
import chartjsimg = require('chartjs-to-image');

module.exports = {
    name: 'osu',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        //let absoluteID = new Date().getTime()
        let accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
        let access_token = JSON.parse(accessN).access_token;
        let buttons;

        //args 
        let user;
        let searchid;
        let mode = 'osu';
        let detailed = false;


        if (message != null && button == null) {
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
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-cmd-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-cmd-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-cmd')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-cmd-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-cmd-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
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
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
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
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-cmd')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );

            user = interaction.options.getString('user');
            mode = interaction.options.getString('mode');
            detailed = interaction.options.getBoolean('detailed');
            searchid = interaction.member.user.id;

        }

        //==============================================================================================================================================================================================

        if (button != null) {
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
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-cmd')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                /* .setLabel('End') */,
                );
        }

        if (user == null) {
            let findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname != null) {
                user = findname.get('osuname');
            } else {
                return interaction.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false } })
            }
        }
        if (mode == null) {
            let findname = await userdata.findOne({ where: { userid: searchid } })
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

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    user: ${user}
    mode: ${mode}
    detailed: ${detailed}
----------------------------------------------------
`, 'utf-8')
        const userurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(await user)}/${cmdchecks.toHexadecimal(mode)}`

        const osudata = await fetch(userurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any);
        fs.writeFileSync(`debugosu/command-osu=osudata=${obj.guildId}`, JSON.stringify(osudata, null, 2))
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


        let findname;
        findname = await userdata.findOne({ where: { osuname: user } })
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
        } else {
        }

        let osustats = osudata.statistics;
        let grades = osustats.grade_counts;

        let playerrank =
            osudata.statistics.global_rank == null ?
                '---' :
                osudata.statistics.global_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            ;
        let countryrank =
            osudata.statistics.country_rank == null ?
                '---' :
                osudata.statistics.country_rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        let onlinestatus = osudata.is_online == true ?
            `**${emojis.onlinestatus.online} Online**` :
            `**${emojis.onlinestatus.offline} Offline** | Last online <t:${(new Date(osudata.last_visit)).getTime() / 1000}:R>`

        let prevnames = osudata.previous_usernames.length > 0 ?
            '**Previous Usernames:**' + osudata.previous_usernames.join(', ') :
            ''
            ;

        let playcount = osustats.play_count == null ?
            '---' :
            osustats.play_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        //${osustats.level.current}.${osustats.level.progress.toFixed(2)}
        let lvl = osustats.level.current != null ?
            osustats.level.progress != null ?
                `${osustats.level.current}.${osustats.level.progress.toFixed(2)}` :
                `${osustats.level.current}` :
            '---'

        const osuEmbed = new Discord.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${osudata.username}'s osu! profile`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
            .setThumbnail(`https://a.ppy.sh/${osudata.id}`)


        if (detailed == true) {
            const loading = new Discord.EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${osudata.username}'s osu! profile`)
                .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
                .setThumbnail(`https://a.ppy.sh/${osudata.id}`)
                .setDescription(`Loading...`)


            if (interaction != null && message == null) {
                obj.reply({
                    embeds: [loading],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
            let dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',')
            let datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',')

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
            let ChartsEmbedRank = new Discord.EmbedBuilder()
                .setDescription('Click on the image to see the full chart')
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${await chartrank.getShortUrl()}`);

            let ChartsEmbedPlay = new Discord.EmbedBuilder()
                .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                .setImage(`${await chartplay.getShortUrl()}`);
            chartrank.toFile('./debugosu/playerrankgraph.jpg')
            chartplay.toFile('./debugosu/playerplaygraph.jpg')

            let usertopurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(osudata.id)}/scores/best?mode=${cmdchecks.toHexadecimal(mode)}&limit=100&offset=0`;

            const osutopdata = await fetch(usertopurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
            fs.writeFileSync(`debugosu/command-osu=osutopdata=${obj.guildId}.json`, JSON.stringify(osutopdata, null, 2))


            let mostplayedurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(osudata.id)}/beatmapsets/most_played`

            const mostplayeddata = await fetch(mostplayedurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
            fs.writeFileSync(`debugosu/command-osu=mostplayeddata=${obj.guildId}.json`, JSON.stringify(mostplayeddata, null, 2))

            let highestcombo = (osutopdata.sort((a, b) => b.max_combo - a.max_combo))[0].max_combo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            let maxpp = ((osutopdata.sort((a, b) => b.pp - a.pp))[0].pp).toFixed(2)
            let minpp = ((osutopdata.sort((a, b) => a.pp - b.pp))[0].pp).toFixed(2)
            let avgpp;
            let totalpp = 0;
            for (let i2 = 0; i2 < osutopdata.length; i2++) {
                totalpp += osutopdata[i2].pp
            }
            avgpp = (totalpp / osutopdata.length).toFixed(2)
            let mostplaytxt = ``
            for (let i2 = 0; i2 < mostplayeddata.length && i2 < 10; i2++) {
                let bmpc = mostplayeddata[i2]
                mostplaytxt += `[${bmpc.beatmapset.title}[${bmpc.beatmap.version}]](https://osu.ppy.sh/b/${bmpc.beatmap_id}) | ${bmpc.count} plays\n`
            }
            if (mostplaytxt != ``) {
                osuEmbed.addFields([{
                    name: 'Most Played Beatmaps',
                    value: mostplaytxt,
                    inline: false
                }]
                )
            }

            osuEmbed.addFields([
                {
                    name: 'TOP PLAY',
                    value:
                        `**Most common mapper:** ${osufunc.modemappers(osutopdata).beatmapset.creator}
            **Most common mods:** ${osufunc.modemods(osutopdata).mods.toString().replaceAll(',', '')}
            **Gamemode:** ${mode}
            **Highest combo:** ${highestcombo}`,
                    inline: true
                },
                {
                    name: 'INFO',
                    value: `**Highest pp:** ${maxpp}
            **Lowest pp:** ${minpp}
            **Average pp:** ${avgpp}
            **Highest accuracy:** ${((osutopdata.sort((a, b) => b.accuracy - a.accuracy))[0].accuracy * 100).toFixed(2)}%
            **Lowest accuracy:** ${((osutopdata.sort((a, b) => a.accuracy - b.accuracy))[0].accuracy * 100).toFixed(2)}%`,
                    inline: true
                }])
            if (interaction != null && message == null) {
                obj.editReply({
                    embeds: [osuEmbed, ChartsEmbedRank, ChartsEmbedPlay],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
            if (message != null && interaction == null) {
                obj.reply({
                    embeds: [osuEmbed, ChartsEmbedRank, ChartsEmbedPlay],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }


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
            if (interaction != null && message == null) {
                obj.reply({
                    embeds: [osuEmbed],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
            if (message != null && interaction == null) {
                obj.reply({
                    embeds: [osuEmbed],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
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