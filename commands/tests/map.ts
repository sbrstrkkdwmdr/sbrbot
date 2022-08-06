import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../configs/osufunc');
import cmdchecks = require('../../configs/commandchecks');
import calc = require('../../configs/calculations');
module.exports = {
    name: 'map',
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
        let mapid;
        let mapmods;
        let maptitleq = null;
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
            fs.appendFileSync(`logs/cmd/commands${message.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-map-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-map-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-map')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-map-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-map-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            if (!isNaN(args[0])) {
                mapid = args[0];
            }

            if (args.join(' ').includes('+')) {
                mapmods = args.join(' ').split('+')[1]
            }
            if (args.join(' ').includes('"')) {
                maptitleq = args.join(' ').split('"')[1]
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-map-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-map-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-map')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-map-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-map-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            mapid = interaction.options.getInteger('id');
            mapmods = interaction.options.getString('mods');
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (button)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-map-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-map-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-map')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-map-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-map-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                /* .setLabel('End') */,
                );
        }

        //==============================================================================================================================================================================================
        let mapdata

        if (mapid == null || mapid == '') {
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
            mapid = prevmap.id;
        }

        if (maptitleq == null) {
            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}?`;

            mapdata = await fetch(mapurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any);
            fs.writeFileSync('debugosu/command-map=map.json', JSON.stringify(mapdata, null, 2));
            try {
                let mapper = mapdata.beatmapset.creator
            } catch (error) {
                try {
                    if (mapdata.authentication) {
                        let ifid = 'oauth token is invalid. Token will be refreshed automatically in one minute.'
                        obj.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false }, failIfNotExists: true });
                        return;
                    }
                } catch (error) {

                }
                obj.reply({ content: 'Error - map not found', allowedMentions: { repliedUser: false } });
                return;
            }
            fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));
        }

        if (maptitleq != null) {
            let mapnameurl = `https://osu.ppy.sh/api/v2/beatmapsets/search?q=${cmdchecks.toHexadecimal(maptitleq)}&s=any`
            let mapidtest = await fetch(mapnameurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
                ;
            let mapidtest2 = mapidtest.beatmapsets[0].beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)
            fs.writeFileSync('debugosu/command-map=txt.json', JSON.stringify(mapidtest, null, 2))
            try {
                if (mapidtest.authentication) {
                    let ifid = 'oauth token is invalid. Token will be refreshed automatically in one minute.'
                    message.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false }, failIfNotExists: true });
                    return;
                }
            } catch (error) {

            }
            if (mapidtest.length == 0) {
                obj.reply({ content: 'Error - map not found.\nNo maps found for the parameters: \"' + maptitleq + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true });
                return;
            }
            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapidtest2[0].id)}?`
            mapdata = await fetch(mapurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any);
            try {
                let mapper = mapdata.beatmapset.creator
            } catch (error) {
                let ifid = ''
                if (!isNaN(mapid)) {
                    ifid = `Found map id = ${mapid}\n${maptitleq}`
                }
                try {
                    let au = mapdata.authentication
                    if (au == "basic") {
                        ifid = 'oauth token is invalid. Token will be refreshed automatically in one minute.'
                    }
                } catch (error) {

                }

                obj.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false }, failIfNotExists: true });
                return;
            }
            fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));
        }
        if (mapmods == null || mapmods == '') {
            mapmods = 'NM';
        }
        else {
            mapmods = osumodcalc.OrderMods(mapmods.toUpperCase());
        }
        let statusimg = emojis.rankedstatus.graveyard;
        ;
        if (interaction != null && message == null) {
            obj.reply({ content: "Loading...", allowedMentions: { repliedUser: false } })
        }
        switch (mapdata.status) {
            case 'ranked':
                statusimg = emojis.rankedstatus.ranked;
                break;
            case 'approved': case 'qualified':
                statusimg = emojis.rankedstatus.approved;
                break;
            case 'loved':
                statusimg = emojis.rankedstatus.loved;
                break;
        }
        fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: mapid }), null, 2));
        let iftherearemodsasint = JSON.stringify({
            "ruleset": mapdata.mode
        });
        if (mapmods != 'NM') {
            iftherearemodsasint =
                JSON.stringify({
                    "ruleset": mapdata.mode,
                    "mods": osumodcalc.ModStringToInt(mapmods)
                })
        }
        let beatattrurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}/attributes`;
        let mapattrdata = await fetch(beatattrurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any);
        fs.writeFileSync('debugosu/command-map=mapattr.json', JSON.stringify(mapattrdata, null, 2));
        let totaldiff;
        if (mapattrdata.attributes == null || mapattrdata.attributes == undefined || mapattrdata.attributes.star_rating == NaN) {
            totaldiff = mapdata.difficulty_rating;
        } else {
            totaldiff = mapattrdata.attributes.star_rating.toFixed(2);
        }
        let allvals = osumodcalc.calcValues(
            mapdata.cs,
            mapdata.ar,
            mapdata.accuracy,
            mapdata.drain,
            mapdata.bpm,
            mapdata.hit_length,
            mapmods
        )
        let score = {
            beatmap_id: mapdata.id,
            score: "6795149",
            maxcombo: mapdata.max_combo,
            count50: "0",
            count100: "0",
            count300: "374",
            countmiss: "0",
            countkatu: "0",
            countgeki: "0",
            perfect: "1",
            enabled_mods: "0",
            user_id: "13780464",
            date: "2022-02-08 05:24:54",
            rank: "S",
            score_id: "4057765057",
        };
        let score95 = {
            beatmap_id: mapdata.id,
            score: "6795149",
            maxcombo: mapdata.max_combo,
            count50: "0",
            //count100: "5281700",
            //count300: "65140967",
            count100: "810811",
            count300: "10000000",
            countmiss: "0",
            countkatu: "0",
            countgeki: "0",
            perfect: "0",
            enabled_mods: "0",
            user_id: "13780464",
            date: "2022-02-08 05:24:54",
            rank: "S",
            score_id: "4057765057",
        };
        let fixedmods = mapmods.replace('TD', '')
        let modissue = ''
        if (mapmods.includes('TD')) {
            modissue = '\ncalculations aren\'t supported for TD'
        }
        let pp = new ppcalc.std_ppv2().setPerformance(score).setMods(fixedmods);
        let pp95 = new ppcalc.std_ppv2().setPerformance(score95).setMods(fixedmods);
        let mapimg = emojis.gamemodes.standard;

        switch (mapdata.mode) {
            case 'taiko':
                mapimg = emojis.gamemodes.taiko;
                pp = new ppcalc.taiko_ppv2().setPerformance(score).setMods(fixedmods);
                pp95 = new ppcalc.taiko_ppv2().setPerformance(score95).setMods(fixedmods);
                break;
            case 'fruits':
                mapimg = emojis.gamemodes.fruits;
                pp = new ppcalc.catch_ppv2().setPerformance(score).setMods(fixedmods);
                pp95 = new ppcalc.catch_ppv2().setPerformance(score95).setMods(fixedmods);
                break;
            case 'mania':
                mapimg = emojis.gamemodes.mania;
                pp = new ppcalc.mania_ppv2().setPerformance(score).setMods(fixedmods);
                pp95 = new ppcalc.mania_ppv2().setPerformance(score95).setMods(fixedmods);
                break;
        }
        let ppComputedString: string;
        let pp95ComputedString: string;
        let ppissue: string;
        try {
            let ppComputed = await pp.compute();
            let pp95Computed = await pp95.compute();

            ppComputedString = `${ppComputed.total.toFixed(2)}pp`;
            pp95ComputedString = `${pp95Computed.total.toFixed(2)}pp`;
            ppissue = '';
            fs.writeFileSync('./debugosu/command-map=pp_calc.json', JSON.stringify(ppComputed, null, 2))
            fs.writeFileSync('./debugosu/command-map=pp_calc_95.json', JSON.stringify(pp95Computed, null, 2))
            if (interaction) {
                if (interaction.options.getBoolean('detailed') == true) {
                    ppComputedString += ` \naim: ${ppComputed.aim.toFixed(2)}pp, \nspeed: ${ppComputed.speed.toFixed(2)}pp, \nacc: ${ppComputed.acc.toFixed(2)}pp\n`
                    pp95ComputedString += ` \naim: ${pp95Computed.aim.toFixed(2)}pp, \nspeed: ${pp95Computed.speed.toFixed(2)}pp, \nacc: ${pp95Computed.acc.toFixed(2)}pp\n`
                }
            }

        } catch (error) {
            ppComputedString = 'NaN pp';
            pp95ComputedString = 'NaN pp';
            ppissue = 'Error - pp could not be calculated';
            let tstmods = mapmods.toUpperCase();

            if (tstmods.includes('EZ') || tstmods.includes('HR')) {
                ppissue += '\nInvalid mod combinations: EZ + HR';
            }
            if ((tstmods.includes('DT') || tstmods.includes('NC')) && tstmods.includes('HT')) {
                ppissue += '\nInvalid mod combinations: DT/NC + HT';
            }

        }
        let basicvals = `CS${allvals.cs} AR${allvals.ar} OD${allvals.od} HP${allvals.hp}`;
        if (interaction) {
            if (interaction.options.getBoolean('detailed') == true) {
                basicvals = 
                `CS${allvals.cs} (${allvals.details.csRadius.toFixed(2)}r)
                AR${allvals.ar}  (${Math.floor(allvals.details.arMs)}ms)
                OD${allvals.od} (300: ${allvals.details.odMs.range300.toFixed(2)}ms 100: ${allvals.details.odMs.range100.toFixed(2)}ms 50:  ${allvals.details.odMs.range50.toFixed(2)}ms)
                HP${allvals.hp}`
            }
        }
        
        let mapname: string;
        let artist: string

        mapname = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})`;
        artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist} (${mapdata.beatmapset.artist_unicode})`;

        let maptitle: string = mapmods ? `${artist} - ${mapname} [ ${mapdata.version}] + ${mapmods}` : `${artist} - ${mapname} [${mapdata.version}]`
        let mapperurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(mapdata.beatmapset.creator)}`;

        let mapperdata = await fetch(mapperurl, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => res.json() as any);

        let Embed = new Discord.EmbedBuilder()
            .setColor(0x91ff9a)
            .setTitle(maptitle)
            .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${mapdata.mode}/${mapdata.id}`)
            .setAuthor({
                name: `${mapperdata.username}`,
                url: `https://osu.ppy.sh/u/${mapperdata.id}`,
                iconURL: `https://a.ppy.sh/${mapperdata.id}`,
            })
            .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg`)
            .addFields([
                {
                    name: 'MAP DETAILS',
                    value:
                        `${statusimg} | ${mapimg} \n ` +
                        `${basicvals}\n` +
                        `${totaldiff}⭐ | ${allvals.bpm}BPM⏲\n` +
                        `${emojis.mapobjs.circle}${mapdata.count_circles} | ${emojis.mapobjs.slider}${mapdata.count_sliders} | ${emojis.mapobjs.spinner}${mapdata.count_spinners}\n` +
                        `${allvals.details.lengthFull}🕐`,
                    inline: true
                },
                {
                    name: 'PP',
                    value:
                        `SS: ${ppComputedString} \n ` +
                        `95: ${pp95ComputedString} \n ` +
                        `${modissue}\n${ppissue}`,
                    inline: true
                },
                {
                    name: 'DOWNLOAD',
                    value:
                        `[osu!](https://osu.ppy.sh/b/${mapdata.id}) | [Chimu](https://api.chimu.moe/v1/download${mapdata.beatmapset_id}) | [Beatconnect](https://beatconnect.io/b/${mapdata.beatmapset_id}) | [Kitsu](https://kitsu.io/d/${mapdata.beatmapset_id})\n` +
                        `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapdata.id})`,
                    inline: true
                }
            ])
        if (message && interaction == null) {
            obj.reply({ content: "⠀", embeds: [Embed], allowedMentions: { repliedUser: false } })
        }
        if (interaction != null && message == null) {
            obj.editReply({ content: "⠀", embeds: [Embed], allowedMentions: { repliedUser: false } })
        }


        let endofcommand = new Date().getTime();
        let timeelapsed = endofcommand - currentDate.getTime();
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}