import fs = require('fs')
import fetch from 'node-fetch';
import { access_token } from '../../configs/osuauth.json';
import emojis = require('../../configs/emojis')


module.exports = {
    name: 'osuuserlink',
    description: 'osuuserlink',
    execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO) {
        let messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')

        let user = messagenohttp.split('/').pop()
        fs.appendFileSync('link.log', `LINK DETECT EVENT - osuuserlink\n${currentDate} ${currentDateISO}\n${message.author.username}#${message.author.discriminator} (${message.author.id}) used osu!profile link: ${message.content}\n`, 'utf-8')
        const userurl = `https://osu.ppy.sh/api/v2/users/${user}/osu`
        fetch(userurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)
            .then(osudata => {
                fs.writeFileSync('debugosu/link-osu.json', JSON.stringify(osudata, null, 2))
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

                    let online = osudata.is_online;

                    let isonline = `**${emojis.onlinestatus.offline} Offline**`

                    if (online == true) {
                        isonline = `**${emojis.onlinestatus.online} Online**`
                    }
                    else {
                        isonline = `**${emojis.onlinestatus.offline} Offline** | Last online <t:${playerlasttoint.getTime() / 1000}:R>`
                    }

                    let prevnames = osudata.previous_usernames;
                    let prevnameslist:any
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

                    message.reply({ content: '⠀', embeds: [Embed], allowedMentions: { repliedUser: false } })
                    fs.appendFileSync('link.log', '\nsuccess\n\n', 'utf-8')
                    let endofcommand = new Date().getTime();
                    let timeelapsed = endofcommand - currentDate.getTime();
                    fs.appendFileSync('link.log', `\nCommand Latency (osuuserlink) - ${timeelapsed}ms\n`)

                } catch (error) {
                    message.reply({ content: 'no osu! profile found\nNo user found with the name `' + user + '`', allowedMentions: { repliedUser: false } })
                }
            })

    }
}