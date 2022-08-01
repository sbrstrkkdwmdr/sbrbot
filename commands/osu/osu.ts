import { access_token } from '../../configs/osuauth.json';
import fs = require('fs')
import fetch from 'node-fetch'
import emojis = require('../../configs/emojis');
import chartjsimg = require('chartjs-to-image');
import osufunc = require('../../configs/osufunc')

module.exports = {
    name: 'osu',
    description: 'Return information of a user\'s osu! profile\n' +
        'Command: `sbr-osu [user]`\n' +
        'Slash command: `/osu [user]`' +
        'Options:\n' +
        '⠀⠀`user`: string/integer, optional. The osu! username of the user.',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - osu (message)\n${currentDate} | ${currentDateISO}\n recieved osu! profile command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            let user = args.join(' ')
            let searchid = message.author.id
            let mode = null
            if (message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            if (user.length < 1 || message.mentions.users.size > 0) {
                let findname;
                findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return message.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                }
            }
            if (mode == null && (!args[0] || message.mentions.users.size > 0)) {
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
            const userurl = `https://osu.ppy.sh/api/v2/users/${user}/${mode}`
            fetch(userurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    fs.writeFileSync('debugosu/command-osu.json', JSON.stringify(osudata, null, 2))
                    try {
                        if (osudata.authentication) {
                            message.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            return;
                        }
                    } catch (error) {

                    }
                    try {
                        ;
                        (async () => {
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
                        })();




                        let osustats = osudata.statistics
                        let grades = osustats.grade_counts

                        let playerrank = osudata.statistics.global_rank//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        let countryrank = osudata.statistics.country_rank//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                        if (playerrank == null || typeof playerrank == 'undefined') {
                            playerrank = '---'
                        } else {
                            playerrank = playerrank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        if (countryrank == null || typeof countryrank == 'undefined') {
                            countryrank = '---'
                        } else {
                            countryrank = countryrank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }

                        let playerlasttoint: any = new Date(osudata.last_visit)

                        let online = osudata.is_online;

                        let isonline = `**${emojis.onlinestatus.offline} Offline**`

                        if (online == true) {
                            isonline = `**${emojis.onlinestatus.online} Online**`
                        }
                        else {
                            isonline = `**${emojis.onlinestatus.offline} Offline** | Last online <t:${playerlasttoint.getTime() / 1000}:R>`
                        }

                        let prevnames: any = osudata.previous_usernames;
                        let prevnameslist;
                        if (prevnames.length > 0) {
                            prevnameslist = '**Previous Usernames:** ' + prevnames.join(', ');
                        }
                        else {
                            prevnameslist = ''
                        }

                        let playcount = osustats.play_count
                        if (playcount == null || typeof playcount == 'undefined') {
                            playcount = '---'
                        }
                        else {
                            playcount = playcount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }

                        const Embed = new Discord.EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle(`${osudata.username}'s osu! profile`)
                            .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
                            .setThumbnail(`https://a.ppy.sh/${osudata.id}`)
                            .setDescription(`
                    **Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)\n
                    **pp:** ${osustats.pp}
                    **Accuracy:** ${(osustats.hit_accuracy).toFixed(2)}%
                    **Play Count:** ${playcount}
                    **Level:** ${osustats.level.current}.${osustats.level.progress}
                    ${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}
                    
                    **Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>
                    **Followers:** ${osudata.follower_count}
                    ${prevnameslist}
                    ${isonline}
                    `)

                        message.reply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                        fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)
                        let endofcommand = new Date().getTime();
                        let timeelapsed = endofcommand - currentDate.getTime();
                        fs.appendFileSync('commands.log', `\nCommand Latency (message command => osu) - ${timeelapsed}ms\n`)

                    } catch (error) {
                        message.reply({ content: 'no osu! profile found\nNo user found with the name `' + user + '`', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                    }
                })
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - osu (interaction)\n${currentDate} | ${currentDateISO}\n recieved osu! profile command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            fs.appendFileSync('commands.log', `\nInteraction ID: ${interaction.id}`)
            fs.appendFileSync('commands.log',
                `\noptions:
            user: ${interaction.options.getString('user')}
            detailed: ${interaction.options.getBoolean('detailed')}
            mode: ${interaction.options.getString('mode')}
            `
            )
            let user = interaction.options.getString('user')
            if (user == null) {
                let findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return interaction.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false } })
                }
            }
            let mode = interaction.options.getString('mode');
            if (mode == null) {
                let findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
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
            //interaction.reply('Searching for ' + user + '...')
            const userurl = `https://osu.ppy.sh/api/v2/users/${user}/${mode}`
            fs.appendFileSync('commands.log',
                `\noptions(2):
            user: ${user}
            detailed: <N/A>
            `)
            fetch(userurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    fs.writeFileSync('debugosu/command-osu.json', JSON.stringify(osudata, null, 2));
                    try {
                        if (osudata.authentication) {
                            interaction.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            return;
                        }
                    } catch (error) {

                    }
                    (async () => {
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
                    })();

                    try {
                        ;
                        (async () => {
                            let findname;
                            findname = await userdata.findOne({ where: { osuname: user } })
                            if (findname != null) {
                                await userdata.update({
                                    osupp: osudata.statistics.pp,
                                    osurank: osudata.statistics.global_rank,
                                    osuacc: osudata.statistics.hit_accuracy
                                }, {
                                    where: { osuname: user }
                                })
                            } else {
                            }
                        })();
                        let osustats = osudata.statistics
                        let grades = osustats.grade_counts

                        let playerrank = osudata.statistics.global_rank//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        let countryrank = osudata.statistics.country_rank//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                        if (playerrank == null || typeof playerrank == 'undefined') {
                            playerrank = '---'
                        } else {
                            playerrank = playerrank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        if (countryrank == null || typeof countryrank == 'undefined') {
                            countryrank = '---'
                        } else {
                            countryrank = countryrank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }

                        let playerlasttoint: any = new Date(osudata.last_visit)

                        let online = osudata.is_online;

                        let isonline = `**${emojis.onlinestatus.offline} Offline**`

                        if (online == true) {
                            isonline = `**${emojis.onlinestatus.online} Online**`
                        }
                        else {
                            isonline = `**${emojis.onlinestatus.offline} Offline** | Last online <t:${playerlasttoint.getTime() / 1000}:R> ago`
                        }

                        let prevnames = osudata.previous_usernames;
                        let prevnameslist: any;
                        if (prevnames.length > 0) {
                            prevnameslist = '**Previous Usernames:** ' + prevnames.join(', ');
                        }
                        else {
                            prevnameslist = ''
                        }

                        let playcount = osustats.play_count
                        if (playcount == null || typeof playcount == 'undefined') {
                            playcount = '---'
                        }
                        else {
                            playcount = playcount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }

                        const Embed = new Discord.EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle(`${osudata.username}'s osu! profile`)
                            .setURL(`https://osu.ppy.sh/users/${osudata.id}`)
                            .setThumbnail(`https://a.ppy.sh/${osudata.id}`)
                        if (interaction.options.getBoolean('detailed') == true) {
                            let fe = new Discord.EmbedBuilder()
                                .setColor('#0099ff')
                                .setTitle(`${osudata.username}'s osu! profile`)
                                .setDescription('loading...')
                            interaction.reply({ embeds: [fe] })
                            Embed.addFields([
                                {
                                    name: `-`,
                                    value:
                                        `**Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)
                                        **pp:** ${osustats.pp}
                                        **Accuracy:** ${(osustats.hit_accuracy).toFixed(2)}%
                                        **Play Count:** ${playcount}
                                        **Level:** ${osustats.level.current}.${osustats.level.progress}
                                        `,
                                    inline: true
                                },
                                {
                                    name: `-`,
                                    value:
                                        `**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>
                                        ${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}
                                        **Followers:** ${osudata.follower_count}
                                        ${prevnameslist}
                                        ${isonline}
                                        `,
                                    inline: true
                                }])
                            let mode = osudata.playmode
                            //chart creation
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
                            (async () => {
                                let ChartsEmbedRank = new Discord.EmbedBuilder()
                                    .setDescription('Click on the image to see the full chart')
                                    .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                                    .setImage(`${await chartrank.getShortUrl()}`);

                                let ChartsEmbedPlay = new Discord.EmbedBuilder()
                                    .setURL('https://sbrstrkkdwmdr.github.io/sbr-web/')
                                    .setImage(`${await chartplay.getShortUrl()}`);
                                chartrank.toFile('./debugosu/playerrankgraph.jpg')
                                chartplay.toFile('./debugosu/playerplaygraph.jpg').then(() => {

                                    let usertopurl = `https://osu.ppy.sh/api/v2/users/${osudata.id}/scores/best?mode=${mode}&limit=100&offset=0`;
                                    fetch(usertopurl, {
                                        headers: {
                                            Authorization: `Bearer ${access_token}`
                                        }
                                    }).then(res => res.json() as any)
                                        .then(osutopdata => {
                                            let mostplayedurl = `https://osu.ppy.sh/api/v2/users/${osudata.id}/beatmapsets/most_played`
                                            fetch(mostplayedurl, {
                                                headers: {
                                                    Authorization: `Bearer ${access_token}`
                                                }
                                            }).then(res => res.json() as any)
                                                .then(mostplayeddata => {
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
                                                        Embed.addFields([{
                                                            name: 'Most Played Beatmaps',
                                                            value: mostplaytxt,
                                                            inline: false
                                                        }]
                                                        )
                                                    }

                                                    Embed.addFields([
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
                                                    interaction.editReply({ content: '⠀', embeds: [Embed, ChartsEmbedRank, ChartsEmbedPlay], allowedMentions: { repliedUser: false }, /* files: ['./debugosu/playerplaygraph.jpg', './debugosu/playerrankgraph.jpg'] */ })

                                                })




                                        })
                                })
                            })();
                        } else { // not detailed
                            Embed.setDescription(`
                    **Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)\n
                    **pp:** ${osustats.pp}
                    **Accuracy:** ${(osustats.hit_accuracy).toFixed(2)}%
                    **Play Count:** ${playcount}
                    **Level:** ${osustats.level.current}.${osustats.level.progress}
                    ${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}
                    
                    **Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>
                    **Followers:** ${osudata.follower_count}
                    ${prevnameslist}
                    ${isonline}
                    `)
                            interaction.reply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false } })
                        }

                        fs.appendFileSync('commands.log', `\nsuccess - Interaction ID: ${interaction.id}\n\n`, 'utf-8')
                        fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}`)
                        let endofcommand = new Date().getTime();
                        let timeelapsed = endofcommand - currentDate.getTime();
                        fs.appendFileSync('commands.log', `\nCommand Latency (interaction command => osu) - ${timeelapsed}ms\n`)

                    } catch (error) {
                        //console.log(error)
                        //interaction.reply({ content: 'no osu! profile found\nNo user found with the name `' + user + '`', allowedMentions: { repliedUser: false } })
                        fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}`)
                        let endofcommand = new Date().getTime();
                        let timeelapsed = endofcommand - currentDate.getTime();
                        fs.appendFileSync('commands.log', `\nCommand Latency (interaction command => osu) - ${timeelapsed}ms\n`)

                    }





                })

        }
    }
}