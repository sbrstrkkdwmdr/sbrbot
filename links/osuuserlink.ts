import fs = require('fs')
import fetch = require('node-fetch')
import { access_token } from '../configs/osuauth.json';
import emojis = require('../configs/emojis')


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
        }).then(res => res.json())
            .then(osudata => {
                fs.writeFileSync('debugosu/osu.json', JSON.stringify(osudata, null, 2))
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

                    let playerlasttoint = new Date(osudata.last_visit)

                    let currenttime = new Date()

                    let minsincelastvis = (playerlasttoint - currenttime) / (1000 * 60);
                    let minlastvis = Math.abs(minsincelastvis).toFixed(0);

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

                    const Embed = new Discord.MessageEmbed()
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

                } catch (error) {
                    message.reply({ content: 'no osu! profile found\nNo user found with the name `' + user + '`', allowedMentions: { repliedUser: false } })
                }
            })

    }
}