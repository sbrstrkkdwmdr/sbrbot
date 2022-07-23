import { access_token } from '../configs/osuauth.json';
import fs = require('fs')
import fetch from 'node-fetch'
import emojis = require('../configs/emojis');
import chartjsimg = require('chartjs-to-image');
import osufunc = require('../configs/osufunc')

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
            if(message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            if (user.length < 1 || message.mentions.users.size > 0 ) {
                let findname;
                findname = await userdata.findOne({ where: { userid: searchid } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return message.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false } })
                }
            }
            const userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`
            fetch(userurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    fs.writeFileSync('debugosu/command-osu.json', JSON.stringify(osudata, null, 2))
                    try {
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

                        let playerlasttoint:any = new Date(osudata.last_visit)

                        let currenttime:any = new Date()

                        let minsincelastvis:any = (playerlasttoint - currenttime) / (1000 * 60);
                        let minlastvis:any = Math.abs(minsincelastvis).toFixed(0);

                        let lastvishours = (Math.trunc(minlastvis / 60)) % 24;
                        let lastvisminutes = minlastvis % 60;
                        let lastvisdays = Math.trunc((minlastvis / 60) / 24) % 30;
                        let lastvismonths = Math.trunc(minlastvis / 60 / 24 / 30.437) % 12;
                        let lastvisyears = Math.trunc(minlastvis / 525600); //(60/24/30/12)
                        let minlastvisredo = (lastvisyears + "y " + lastvismonths + "m " + lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                        if (lastvisyears < 1) {
                            minlastvisredo = (lastvismonths + "m " + lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                        } //check if under an year
                        if (lastvismonths < 1) {
                            minlastvisredo = (lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                        } //check if under an month
                        if (lastvisdays < 1) {
                            minlastvisredo = (lastvishours + "h " + lastvisminutes + "m");
                        } //check if under an day
                        if (lastvishours < 1) {
                            minlastvisredo = (lastvisminutes + "m");
                        } //check if under an hour

                        let online = osudata.is_online;

                        let isonline = `**${emojis.onlinestatus.offline} Offline**`

                        if (online == true) {
                            isonline = `**${emojis.onlinestatus.online} Online**`
                        }
                        else {
                            isonline = `**${emojis.onlinestatus.offline} Offline** | Last online ${minlastvisredo} ago`
                        }

                        let prevnames:any = osudata.previous_usernames;
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
                    
                    **Player joined on** ${osudata.join_date.toString().slice(0, 10)}
                    **Followers:** ${osudata.follower_count}
                    ${prevnameslist}
                    ${isonline}
                    `)

                        message.reply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false } })
                        fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                        fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                    } catch (error) {
                        message.reply({ content: 'no osu! profile found\nNo user found with the name `' + user + '`', allowedMentions: { repliedUser: false } })
                        fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)

                    }
                })
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - osu (interaction)\n${currentDate} | ${currentDateISO}\n recieved osu! profile command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let user = interaction.options.getString('user')
            if (user == null) {
                let findname = await userdata.findOne({ where: { userid: interaction.member.user.id } })
                if (findname != null) {
                    user = findname.get('osuname');
                } else {
                    return interaction.reply({ content: 'no osu! username found', allowedMentions: { repliedUser: false } })
                }
            }
            //interaction.reply('Searching for ' + user + '...')
            const userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`
            fetch(userurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                .then(osudata => {
                    fs.writeFileSync('debugosu/command-osu.json', JSON.stringify(osudata, null, 2))
                    try {
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

                        let playerlasttoint:any = new Date(osudata.last_visit)

                        let currenttime:any = new Date()

                        let minsincelastvis = (playerlasttoint - currenttime) / (1000 * 60);
                        let minlastvis:any = Math.abs(minsincelastvis).toFixed(0);

                        let lastvishours = (Math.trunc(minlastvis / 60)) % 24;
                        let lastvisminutes = minlastvis % 60;
                        let lastvisdays = Math.trunc((minlastvis / 60) / 24) % 30;
                        let lastvismonths = Math.trunc(minlastvis / 60 / 24 / 30.437) % 12;
                        let lastvisyears = Math.trunc(minlastvis / 525600); //(60/24/30/12)
                        let minlastvisredo = (lastvisyears + "y " + lastvismonths + "m " + lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                        if (lastvisyears < 1) {
                            minlastvisredo = (lastvismonths + "m " + lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                        } //check if under an year
                        if (lastvismonths < 1) {
                            minlastvisredo = (lastvisdays + "d | " + lastvishours + "h " + lastvisminutes + "m");
                        } //check if under an month
                        if (lastvisdays < 1) {
                            minlastvisredo = (lastvishours + "h " + lastvisminutes + "m");
                        } //check if under an day
                        if (lastvishours < 1) {
                            minlastvisredo = (lastvisminutes + "m");
                        } //check if under an hour

                        let online = osudata.is_online;

                        let isonline = `**${emojis.onlinestatus.offline} Offline**`

                        if (online == true) {
                            isonline = `**${emojis.onlinestatus.online} Online**`
                        }
                        else {
                            isonline = `**${emojis.onlinestatus.offline} Offline** | Last online ${minlastvisredo} ago`
                        }

                        let prevnames = osudata.previous_usernames;
                        let prevnameslist:any;
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
                                        `**Player joined on** ${osudata.join_date.toString().slice(0, 10)}
                                        ${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}
                                        **Followers:** ${osudata.follower_count}
                                        ${prevnameslist}
                                        ${isonline}
                                        `,
                                    inline: true
                                }])
                            let mode = osudata.playmode
                            //chart creation
                            let data = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',')

                            const chart = new chartjsimg()
                                .setConfig({
                                    type: 'line',
                                    data: {
                                        labels: data,
                                        datasets: [{
                                            label: 'Monthly Playcount',
                                            data: osudata.monthly_playcounts.map(x => x.count),
                                            fill: false,
                                            borderColor: 'rgb(75, 192, 192)',
                                            borderWidth: 1,
                                            pointRadius: 0
                                        }]
                                    }
                                })
                            chart.setBackgroundColor('color: rgb(0,0,0)')
                            chart.toFile('./debugosu/playergraph.jpg').then(() => {

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

                                                interaction.editReply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false }, files: ['./debugosu/playergraph.jpg'] })

                                            })




                                    })
                            })
                        } else {
                            Embed.setDescription(`
                    **Global Rank:** ${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)\n
                    **pp:** ${osustats.pp}
                    **Accuracy:** ${(osustats.hit_accuracy).toFixed(2)}%
                    **Play Count:** ${playcount}
                    **Level:** ${osustats.level.current}.${osustats.level.progress}
                    ${emojis.grades.XH}${grades.ssh} ${emojis.grades.X}${grades.ss} ${emojis.grades.SH}${grades.sh} ${emojis.grades.S}${grades.s} ${emojis.grades.A}${grades.a}
                    
                    **Player joined on** ${osudata.join_date.toString().slice(0, 10)}
                    **Followers:** ${osudata.follower_count}
                    ${prevnameslist}
                    ${isonline}
                    `)
                            interaction.reply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false } })
                        }

                        fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                        fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}`)

                    } catch (error) {
                        interaction.reply({ content: 'no osu! profile found\nNo user found with the name `' + user + '`', allowedMentions: { repliedUser: false } })
                        fs.appendFileSync('commands.log', `\nCommand Information\nuser: ${user}`)

                    }





                })

        }
    }
}