import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../configs/osufunc');
import cmdchecks = require('../../configs/commandchecks');
module.exports = {
    name: 'leaderboard',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        //let absoluteID = new Date().getTime()
        let accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
        let access_token = JSON.parse(accessN).access_token;
        let buttons;
        let prevmap;
        let i: number;
        let mapid;
        let page = 0;
        let mods1;
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
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - leaderboard (message)
${currentDate} | ${currentDateISO}
recieved map leaderboard command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-leaderboard-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-leaderboard-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-leaderboard')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-leaderboard-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-leaderboard-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            let mapid = args[0]

        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - leaderboard (interaction)
${currentDate} | ${currentDateISO}
recieved map leaderboard command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-leaderboard-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-leaderboard-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-cmd')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-leaderboard-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-leaderboard-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            mapid = interaction.options.getInteger('id');
            page = interaction.options.getInteger('page');
            mods1 = interaction.options.getString('mods');

        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - leaderboard (button)
${currentDate} | ${currentDateISO}
recieved map leaderboard command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-leaderboard-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-leaderboard-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-leaderboard')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-leaderboard-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-leaderboard-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                /* .setLabel('End') */,
                );
            mapid = message.embeds[0].url.split('/b/')[1]
            if (message.embeds[0].footer) {
                mods1 = message.embeds[0].footer.text
            }
            page = 0
            if (button == 'BigLeftArrow') {
                page = 0
            } else if (button == 'LeftArrow') {
                page = parseInt((message.embeds[0].description).split('/')[0].split(': ')[1]) - 1
            } else if (button == 'RightArrow') {
                page = parseInt((message.embeds[0].description).split('/')[0].split(': ')[1]) + 1
            } else if (button == 'BigRightArrow') {
                page = parseInt((message.embeds[0].description).split('/')[1].split('\n')[0])
            } else if (button == 'Middle') {

            }
        }

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
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
mapid: ${mapid}
page: ${page}
mods: ${mods}
----------------------------------------------------
`, 'utf-8')


        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}`//?mode=osu`//?mods=${mods}`

        let mapdata = await fetch(mapurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any)
            .catch(error => {
                if (button == null) {
                    try {
                        message.edit({
                            content: 'Error',
                            allowedMentions: { repliedUser: false },
                        })
                    } catch (err) {

                    }
                } else {
                    obj.reply({
                        content: 'Error',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
                return;
            })
        fs.writeFileSync(`debugosu/command-leaderboard=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))

        let title = 'n';
        let fulltitle = 'n';
        let artist = 'n';
        try {
            title = mapdata.beatmapset.title != mapdata.beatmapset.title_unicode ? `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})` : mapdata.beatmapset.title
            artist = mapdata.beatmapset.artist != mapdata.beatmapset.artist_unicode ? `${mapdata.beatmapset.artist} (${mapdata.beatmapset.artist_unicode})` : mapdata.beatmapset.artist

        } catch (error) {
            if (mapdata.authentication) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                obj.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                return;
            }
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - unknown
${error}
----------------------------------------------------`)
        }
        fulltitle = `${artist} - ${title} [${mapdata.version}]`
        if (mods == null) {
            let mapscoresurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}/scores`

            let lbdataf = await fetch(mapscoresurl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }).then(res => res.json() as any)
                .catch(error => {
                    if (button == null) {
                        try {
                            message.edit({
                                content: 'Error',
                                allowedMentions: { repliedUser: false },
                            })
                        } catch (err) {

                        }
                    } else {
                        obj.reply({
                            content: 'Error',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                    }
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
                    return;
                })
            fs.writeFileSync(`debugosu/command-leaderboard=lbdataf=${obj.guildId}.json`, JSON.stringify(lbdataf, null, 2))

            try {
                if (lbdataf.authentication) {
                    obj.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                    return;
                }
            } catch (error) {

            }
            let lbdata = lbdataf.scores
            fs.writeFileSync(`debugosu/command-leaderboard=lbdata=${obj.guildId}.json`, JSON.stringify(lbdata, null, 2))

            let lbEmbed = new Discord.EmbedBuilder()
                .setTitle(`Score leaderboard of ${fulltitle}`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                ;

            let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`

            for (i = 0; i < lbdata.length && i < 5; i++) {
                let score = lbdata[i + (page * 5)]
                if (!score) {
                    break;
                }
                let gamestats = score.statistics

                let hitgeki = gamestats.count_geki
                let hit300 = gamestats.count_300
                let hitkatu = gamestats.count_katu
                let hit100 = gamestats.count_100
                let hit50 = gamestats.count_50
                let miss = gamestats.count_miss
                let mode = score.mode_int
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
                fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));
            } else {
                message.edit({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
            }
        } else {
            let oldmsu = `https://osu.ppy.sh/api/get_scores?k=${config.osuApiKey}&b=${cmdchecks.toHexadecimal(mapid)}&mods=${cmdchecks.toHexadecimal(osumodcalc.ModStringToInt(osumodcalc.shortModName(mods)))}&limit=100`

            let lbdata = await fetch(oldmsu)
                .then(res => res.json() as any)
                .catch(error => {
                    if (button == null) {
                        try {
                            message.edit({
                                content: 'Error',
                                allowedMentions: { repliedUser: false },
                            })
                        } catch (err) {

                        }
                    } else {
                        obj.reply({
                            content: 'Error',
                            allowedMentions: { repliedUser: false },
                            failIfNotExists: true
                        })
                    }
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
    ----------------------------------------------------
    cmd ID: ${absoluteID}
    node-fetch error: ${error}
    ----------------------------------------------------
    `, 'utf-8')
                    return;
                })
            fs.writeFileSync(`debugosu/command-leaderboard=lbdata_apiv1=${obj.guildId}.json`, JSON.stringify(lbdata, null, 2))
            try {
                if (lbdata.authentication) {
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                    obj.reply({ content: 'Error - oauth token is invalid. Token will be refreshed automatically in one minute.', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    return;
                }
            } catch (error) {
            }

            let lbEmbed = new Discord.EmbedBuilder()
                .setTitle(`Modded score leaderboard of ${fulltitle}`)
                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
                .setFooter({ text: `mods: ${mods}` })
                ;

            let scoretxt = `Page: ${page + 1}/${Math.ceil(lbdata.length / 5)}`

            for (i = 0; i < (lbdata as any).length && i < 5; i++) {
                let hitlist;
                let acc;
                let score = lbdata[i + (page * 5)]
                let mode = mapdata.mode
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
                fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));

            } else {
                message.edit({ embeds: [lbEmbed], allowedMentions: { repliedUser: false }, components: [buttons] })
                //message.edit({ embeds: [lbEmbed], allowedMentions: { repliedUser: false } })
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