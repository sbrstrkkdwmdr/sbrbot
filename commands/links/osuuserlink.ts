import fs = require('fs')
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis')
import cmdchecks = require('../../calc/commandchecks');
import colours = require('../../configs/colours');
import osuApiTypes = require('../../configs/osuApiTypes');
import osufunc = require('../../calc/osufunc');

module.exports = {
    name: 'osuuserlink',
    description: 'osuuserlink',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        /*         let accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
                let access_token = JSON.parse(accessN).access_token; */

        fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
            `
----------------------------------------------------
COMMAND EVENT - user (link)
${currentDate} | ${currentDateISO}
recieved user link
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')

        const messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')
        const user = messagenohttp.split('/')[2]
        const overrides = {
            user: user,
        }

        client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
        /*         const userurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(user)}/osu`
        const osudata: osuApiTypes.User = await osufunc.apiget('user', `${user}`)
        try {
            if (osudata.authentication) {
                if (button == null) {
                    obj.reply
                    return;

                } else {

                }
            }
        } catch (error) {
            fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                `
----------------------------------------------------
cmd ID: ${absoluteID}
Error: ${error}
----------------------------------------------------
`, 'utf-8')
        }
        fs.writeFileSync(`debugosu/link-osu=osu=${message.guildId}.json`, JSON.stringify(osudata, null, 2))
        try {
            const osustats = osudata.statistics
            const grades = osustats.grade_counts

            let playerrank = osudata.statistics.global_rank || ''//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            let countryrank = osudata.statistics.country_rank || ''//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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

            const playerlasttoint: any = new Date(osudata.last_visit)

            const online = osudata.is_online;

            let isonline = `**${emojis.onlinestatus.offline} Offline**`

            if (online == true) {
                isonline = `**${emojis.onlinestatus.online} Online**`
            }
            else {
                isonline = `**${emojis.onlinestatus.offline} Offline** | Last online <t:${playerlasttoint.getTime() / 1000}:R>`
            }

            const prevnames = osudata.previous_usernames;
            let prevnameslist: any
            if (prevnames.length > 0) {
                prevnameslist = '**Previous Usernames:** ' + prevnames.join(', ');
            }
            else {
                prevnameslist = ''
            }

            let playcount = osustats.play_count || ''
            if (playcount == null || typeof playcount == 'undefined') {
                playcount = '---'
            }
            else {
                playcount = playcount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }

            const Embed = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.user.hex)
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
                .catch(error => { });

            fs.appendFileSync(`logs/cmd/link${message.guildId}.log`, `\nsuccess\nID:${absoluteID}\n\n`, 'utf-8')
            const endofcommand = new Date().getTime();
            const timeelapsed = endofcommand - currentDate.getTime();
            fs.appendFileSync(`logs/cmd/link${message.guildId}.log`, `\nCommand Latency (osuuserlink) - ${timeelapsed}ms\nID:${absoluteID}\n`)

        } catch (error) {
            message.reply({ content: 'no osu! profile found\nNo user found with the name/id `' + user + '`', allowedMentions: { repliedUser: false } })
                .catch(error => { });

        } */


    }
}