import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../calc/osufunc');
import cmdchecks = require('../../calc/commandchecks');
import colours = require('../../configs/colours');
import osuApiTypes = require('../../configs/osuApiTypes');

module.exports = {
    name: 'leaderboard',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let commanduser;
        let prevmap;
        let i: number;
        let mapid;
        let page = 0;
        let mods1;
        let isFirstPage = false;
        let isLastPage = false;

        if (fs.existsSync(`./debugosu/prevmap${obj.guildId}.json`)) {
            try {
                prevmap = JSON.parse(fs.readFileSync(`./debugosu/prevmap${obj.guildId}.json`, 'utf8'));
            } catch {
                console.log(`no prevmap.json id found for server ${obj.guildId}\nCreating default file...`)
                fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                prevmap = { id: 32345 }
            }
        } else {
            console.log(`no prevmap.json file for server ${obj.guildId}\nCreating default file...`)
            fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
            prevmap = { id: 32345 }
        }



        if (message != null && button == null) {
            commanduser = message.author;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - leaderboard (message)
${currentDate} | ${currentDateISO}
recieved map leaderboard command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            const mapid = args[0]

        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - leaderboard (interaction)
${currentDate} | ${currentDateISO}
recieved map leaderboard command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')

            mapid = interaction.options.getInteger('id');
            page = interaction.options.getInteger('page');
            mods1 = interaction.options.getString('mods');

        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - leaderboard (button)
${currentDate} | ${currentDateISO}
recieved map leaderboard command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
            mapid = message.embeds[0].url.split('/b/')[1]
            if (message.embeds[0].footer) {
                mods1 = message.embeds[0].footer.text
            }
            page = 0
            switch (button) {
                case 'BigLeftArrow':
                    page = 1
                    break;
                case 'LeftArrow':
                    page = parseInt((message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
                    break;
                case 'RightArrow':
                    page = parseInt((message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
                    break;
                case 'BigRightArrow':
                    page = parseInt((message.embeds[0].description).split('/')[1].split('\n')[0])
                    break;
                case 'Refresh':
                    page = parseInt((message.embeds[0].description).split('/')[0].split(': ')[1])
                    break;
            }
            if (page < 2) {
                isFirstPage = true;
            }
            if (page == parseInt((message.embeds[0].description).split('/')[1].split('\n')[0])) {
                isLastPage = true;
            }
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    mapid: ${mapid}
    page: ${page}
    mods: ${mods1}
----------------------------------------------------
`, 'utf-8')

        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-leaderboard-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    .setDisabled(isFirstPage)

                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-leaderboard-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀')
                    .setDisabled(isFirstPage)
                ,
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-leaderboard-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    .setDisabled(isLastPage)
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-leaderboard-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    .setDisabled(isLastPage)
                /* .setLabel('End') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`Refresh-leaderboard-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('🔁'),
            );
        if (!mapid) {
            mapid = prevmap.id
        }
        let mods;
        if (mods1) {
            mods = osumodcalc.OrderMods(mods1) + ''
        }
        if (page < 2) {
            page = 0
        } else if (!page) {
            page = 0
        } else {
            page--
        }


        const mapdata: osuApiTypes.Beatmap = await osufunc.apiget('map', `${mapid}`)
        fs.writeFileSync(`debugosu/command-leaderboard=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))
        try {
            if (mapdata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                if (button == null) {
                    obj.reply({ content: 'error - osu auth out of date. Updating token...', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                await osufunc.updateToken();
                return;
            }
            if (typeof mapdata.error != 'undefined' && mapdata.error == null) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - ${mapdata.error}
----------------------------------------------------`)
                if (button == null) {
                    obj.reply({ content: `error - ${mapdata.error}`, allowedMentions: { repliedUser: false }, failIfNotExists: true })
                        .catch();
                }
                return;
            }
        } catch (error) {
        }

        let title = 'n';
        let fulltitle = 'n';
        let artist = 'n';
        try {
            title = mapdata.beatmapset.title != mapdata.beatmapset.title_unicode ? `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})` : mapdata.beatmapset.title
            artist = mapdata.beatmapset.artist != mapdata.beatmapset.artist_unicode ? `${mapdata.beatmapset.artist} (${mapdata.beatmapset.artist_unicode})` : mapdata.beatmapset.artist
        } catch (error) {
            obj.reply({ content: 'error - map not found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                .catch();
            return;
        }
        fulltitle = `${artist} - ${title} [${mapdata.version}]`
        if (mods == null) {
            const lbdataf: osuApiTypes.BeatmapScores = await osufunc.apiget('scores_get_map', `${mapid}`)
            fs.writeFileSync(`debugosu/command-leaderboard=lbdataf=${obj.guildId}.json`, JSON.stringify(lbdataf, null, 2))

            try {
                if (lbdataf.authentication) {
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
    ----------------------------------------------------
    cmd ID: ${absoluteID}
    Error - authentication
    ----------------------------------------------------`)
                    if (button == null) {
                        obj.reply({ content: 'error - osu auth out of date. Updating token...', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            .catch();
                    }
                    await osufunc.updateToken();
                    return;
                }
                if (typeof lbdataf.error != 'undefined' && lbdataf.error == null) {
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
    ----------------------------------------------------
    cmd ID: ${absoluteID}
    Error - ${lbdataf.error}
    ----------------------------------------------------`)
                    if (button == null) {
                        obj.reply({ content: `error - ${lbdataf.error}`, allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            .catch();
                    }
                    return;
                }
            } catch (error) {
            }
            const lbdata = lbdataf.scores
            fs.writeFileSync(`debugosu/command-leaderboard=lbdata=${obj.guildId}.json`, JSON.stringify(lbdata, null, 2))

            const lbEmbed = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.scorelist.hex)
                .setTitle(`Score leaderboard of ${fulltitle}`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                ;

            let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`

            for (i = 0; i < lbdata.length && i < 5; i++) {
                const score = lbdata[i + (page * 5)]
                if (!score) {
                    break;
                }
                const gamestats = score.statistics

                const hitgeki = gamestats.count_geki
                const hit300 = gamestats.count_300
                const hitkatu = gamestats.count_katu
                const hit100 = gamestats.count_100
                const hit50 = gamestats.count_50
                const miss = gamestats.count_miss
                const mode = score.mode_int
                let hitlist;
                switch (mode) {
                    case 0: //std
                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                        break;
                    case 1: //taiko
                        hitlist = `${hit300}/${hit100}/${miss}`
                        break;
                    case 2: //catch/fruits
                        hitlist = `${hit300}/${hit100}/${hit50}/${miss}`
                        break;
                    case 3: //mania
                        hitlist = `${hitgeki}/${hit300}/${hitkatu}/${hit100}/${hit50}/${miss}`
                        break;
                }
                let ifmods: string = ''
                if (score.mods.length > 0) {
                    ifmods = `+${score.mods.join('')} |`
                }

                scoretxt += `
**[Score #${i + (page * 5) + 1}](https://osu.ppy.sh/scores/${score.mode}/${score.id}) | [${score.user.username}](https://osu.ppy.sh/u/${score.user.id})**
Score set <t:${new Date(score.created_at).getTime() / 1000}:R>
${(score.accuracy * 100).toFixed(2)}% | ${score.rank} | ${score.pp}pp
${ifmods} ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.max_combo}x/**${mapdata.max_combo}x**
${hitlist}
`
            }

            if (lbdata.length < 1 || scoretxt.length < 10) {
                scoretxt = 'Error - no scores found '
            }
            if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
                scoretxt = 'Error - map is unranked'
            }
            lbEmbed.setDescription(`${scoretxt}`)

            if (button == null) {
                obj.reply({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                    .catch();

                fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));
            } else {
                message.edit({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                    .catch();

            }
        } else {
            const lbdata = await osufunc.apiget('scores_get_map', `${mapid}`, `${osumodcalc.ModStringToInt(mods)}`, 1);
            fs.writeFileSync(`debugosu/command-leaderboard=lbdata_apiv1=${obj.guildId}.json`, JSON.stringify(lbdata, null, 2))
            try {
                if (lbdata.authentication) {
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
    ----------------------------------------------------
    cmd ID: ${absoluteID}
    Error - authentication
    ----------------------------------------------------`)
                    if (button == null) {
                        obj.reply({ content: 'error - osu auth out of date. Updating token...', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            .catch();
                    }
                    await osufunc.updateToken();
                    return;
                }
            } catch (error) {
            }

            const lbEmbed = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.scorelist.hex)
                .setTitle(`Modded score leaderboard of ${fulltitle}`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                .setFooter({ text: `mods: ${mods}` })
                ;

            let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`

            for (i = 0; i < (lbdata).length && i < 5; i++) {
                let hitlist;
                let acc;
                const score = lbdata[i + (page * 5)]
                if (!score) break;
                const mode = mapdata.mode
                switch (mode) {
                    case 'osu':
                        hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countmiss}`
                        acc = osumodcalc.calcgrade(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy
                        break;
                    case 'taiko':
                        hitlist = `${score.count300}/${score.count100}/${score.countmiss}`
                        acc = osumodcalc.calcgradeTaiko(parseInt(score.count300), parseInt(score.count100), parseInt(score.countmiss)).accuracy
                        break;
                    case 'fruits':
                        hitlist = `${score.count300}/${score.count100}/${score.count50}/${score.countkatu}/${score.countmiss}`
                        acc = osumodcalc.calcgradeCatch(parseInt(score.count300), parseInt(score.count100), parseInt(score.count50), parseInt(score.countkatu), parseInt(score.countmiss)).accuracy
                        break;
                    case 'mania':
                        hitlist = `${score.countgeki}/${score.count300}/${score.countkatu}/${score.count100}/${score.count50}/${score.countmiss}`
                        acc = osumodcalc.calcgradeMania(parseInt(score.countgeki), parseInt(score.count300), parseInt(score.countkatu), parseInt(score.count100), parseInt(score.count50), parseInt(score.countmiss)).accuracy
                        break;
                }
                scoretxt += `
                **[Score #${i + (page * 5) + 1}](https://osu.ppy.sh/scores/${mode}/${score.score_id}) | [${score.username}](https://osu.ppy.sh/u/${score.user_id})**
                Score set on ${score.date}
                ${(acc).toFixed(2)}% | ${score.rank} | ${score.pp}
                ${score.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} | ${score.maxcombo}x/**${mapdata.max_combo}x**
                ${hitlist}
                Has replay: ${score.replay_available == 1 ? '✅' : '❌'}
                `
            }
            if ((lbdata as any).length < 1 || scoretxt.length < 10) {
                scoretxt = 'Error - no scores found '
            }
            if (mapdata.status == 'graveyard' || mapdata.status == 'pending') {
                scoretxt = 'Error - map is unranked'
            }
            lbEmbed.setDescription(`${scoretxt}`)

            if (button == null) {
                obj.reply({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                    .catch();

                fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));

            } else {
                message.edit({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                    .catch();

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