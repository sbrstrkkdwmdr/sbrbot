import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import osufunc = require('../../configs/osufunc');
import cmdchecks = require('../../configs/commandchecks');
import calc = require('../../configs/calculations');
import osugame = require('../../configs/osugame');

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
        let detailed = false;
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
COMMAND EVENT - map (message)
${currentDate} | ${currentDateISO}
recieved map command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
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
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - map (interaction)
${currentDate} | ${currentDateISO}
recieved map command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
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
            detailed = interaction.options.getBoolean('detailed');
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - map (button)
${currentDate} | ${currentDateISO}
recieved map command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
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
            let urlnohttp = message.embeds[0].url.split('https://')[1];
            //osu.ppy.sh/beatmapsets/setid#gamemode/id
            let setid = urlnohttp.split('/')[2].split('#')[0];
            let curid = urlnohttp.split('/')[3];
            mapid = curid;
            let lookupurl = `https://osu.ppy.sh/api/v2/beatmapsets/${cmdchecks.toHexadecimal(setid)}`;
            let bmsdata = await fetch(lookupurl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json() as any)
            fs.writeFileSync(`debugosu/command-map=bmsdata=${obj.guildId}.json`, JSON.stringify(bmsdata, null, 2));
            let bmstosr = bmsdata.beatmaps.sort((a, b) => a.difficulty_rating - b.difficulty_rating);
            fs.writeFileSync(`debugosu/command-map=bmstosr=${obj.guildId}.json`, JSON.stringify(bmsdata, null, 2));

            //get which part of the array the current map is in
            let curmapindex = bmstosr.findIndex(x => x.id == curid);
            if (button == `RightArrow`) {
                if (curmapindex == bmstosr.length - 1) {
                    mapid = curid;
                } else {
                    mapid = bmstosr[curmapindex + 1].id;
                }
            }
            if (button == `LeftArrow`) {
                if (curmapindex == 0) {
                    mapid = curid;
                } else {
                    mapid = bmstosr[curmapindex - 1].id;
                }
            }
            if (button == `BigRightArrow`) {
                mapid = bmstosr[bmstosr.length - 1].id;
            }
            if (button == `BigLeftArrow`) {
                mapid = bmstosr[0].id;
            }

            if (message.embeds[0].fields[1].value.includes('aim') || message.embeds[0].fields[0].value.includes('ms')) {
                detailed = true
            }
            mapmods = message.embeds[0].title.split('+')[1];

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

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    mapid: ${mapid}
    mapmods: ${mapmods}
    maptitleq: ${maptitleq}
    detailed: ${detailed}
----------------------------------------------------
`, 'utf-8')

        if (maptitleq == null) {
            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}?`;

            mapdata = await fetch(mapurl, {
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
                });
            fs.writeFileSync(`debugosu/command-map=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))

            try {
                let mapper = mapdata.beatmapset.creator
            } catch (error) {
                try {
                    if (mapdata.authentication) {
                        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                            `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
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
            fs.writeFileSync(`debugosu/command-map=mapidtest=${obj.guildId}.json`, JSON.stringify(mapidtest, null, 2))
                ;
            let mapidtest2;
            try {
                if (mapidtest.authentication) {
                    fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                        `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
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
            try {
                mapidtest2 = mapidtest.beatmapsets[0].beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)
            } catch (error) {
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - map not found
params: ${maptitleq}
${error}
----------------------------------------------------`)
                obj.reply({ content: 'Error - map not found.\nNo maps found for the parameters: \"' + maptitleq + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true });
                return;
            }

            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapidtest2[0].id)}?`
            mapdata = await fetch(mapurl, {
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
                });
            fs.writeFileSync(`debugosu/command-map=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))
            try {
                let mapper = mapdata.beatmapset.creator
            } catch (error) {
                let ifid = ''
                if (!isNaN(mapid)) {
                    ifid = `Found map id = ${mapid}\n${maptitleq}`
                }
                try {
                    if (mapdata.authentication) {
                        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                            `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - authentication
----------------------------------------------------`)
                        ifid = 'oauth token is invalid. Token will be refreshed automatically in one minute.'
                    }
                } catch (error) {

                }
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
                ----------------------------------------------------
                cmd ID: ${absoluteID}
                Error - map not found
                params: ${mapid} | ${maptitleq}
                ----------------------------------------------------`)
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
            });
        fs.writeFileSync(`debugosu/command-map=mapattrdata=${obj.guildId}.json`, JSON.stringify(mapattrdata, null, 2))
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
        let fixedmods = mapmods.replace('TD', '')

        let modissue = ''
        if (mapmods.includes('TD')) {
            modissue = '\ncalculations aren\'t supported for TD'
        }
        let mapimg = emojis.gamemodes.standard;

        switch (mapdata.mode) {
            case 'taiko':
                mapimg = emojis.gamemodes.taiko;
                break;
            case 'fruits':
                mapimg = emojis.gamemodes.fruits;
                break;
            case 'mania':
                mapimg = emojis.gamemodes.mania;
                break;
        }
        let ppComputed: any;
        let ppissue: string;
        try {
            ppComputed = await osugame.mapcalc(mapmods, mapdata.mode, mapdata.id, 0)
            ppissue = '';
            fs.writeFileSync(`./debugosu/command-map=pp_calc=${obj.guildId}.json`, JSON.stringify(ppComputed, null, 2))

        } catch (error) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - pp calculation failed
${error}
----------------------------------------------------`)
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
            if (detailed == true) {
                basicvals =
                    `CS${allvals.cs} (${allvals.details.csRadius.toFixed(2)}r)
                AR${allvals.ar}  (${allvals.details.arMs.toFixed(2)}ms)
                OD${allvals.od} (300: ${allvals.details.odMs.range300.toFixed(2)}ms 100: ${allvals.details.odMs.range100.toFixed(2)}ms 50:  ${allvals.details.odMs.range50.toFixed(2)}ms)
                HP${allvals.hp}`
            }
        }

        let mapname: string;
        let artist: string

        mapname = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})`;
        artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist} (${mapdata.beatmapset.artist_unicode})`;

        let maptitle: string = mapmods ? `${artist} - ${mapname} [${mapdata.version}] +${mapmods}` : `${artist} - ${mapname} [${mapdata.version}]`
        let mapperurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(mapdata.beatmapset.creator)}`;

        let mapperdata = await fetch(mapperurl, {
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
            });
        fs.writeFileSync(`./debugosu/command-map=mapper=${obj.guildId}.json`, JSON.stringify(mapperdata, null, 2))

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
                        detailed != true ?
                            `SS: ${ppComputed[0].pp.toFixed(2)} \n ` +
                            `99: ${ppComputed[1].pp.toFixed(2)} \n ` +
                            `98: ${ppComputed[2].pp.toFixed(2)} \n ` +
                            `97: ${ppComputed[3].pp.toFixed(2)} \n ` +
                            `96: ${ppComputed[4].pp.toFixed(2)} \n ` +
                            `95: ${ppComputed[5].pp.toFixed(2)} \n ` +
                            `${modissue}\n${ppissue}` :
                            `SS: ${ppComputed[0].pp.toFixed(2)} | Aim:${ppComputed[0].ppAim.toFixed(2)} | Speed:${ppComputed[0].ppSpeed.toFixed(2)} | Acc: ${ppComputed[0].ppAcc.toFixeD(2)} \n ` +
                            `99: ${ppComputed[1].pp.toFixed(2)} | Aim:${ppComputed[1].ppAim.toFixed(2)} | Speed:${ppComputed[1].ppSpeed.toFixed(2)} | Acc: ${ppComputed[1].ppAcc.toFixeD(2)} \n ` +
                            `97: ${ppComputed[3].pp.toFixed(2)} | Aim:${ppComputed[3].ppAim.toFixed(2)} | Speed:${ppComputed[3].ppSpeed.toFixed(2)} | Acc: ${ppComputed[3].ppAcc.toFixeD(2)} \n ` +
                            `95: ${ppComputed[5].pp.toFixed(2)} | Aim:${ppComputed[5].ppAim.toFixed(2)} | Speed:${ppComputed[5].ppSpeed.toFixed(2)} | Acc: ${ppComputed[5].ppAcc.toFixeD(2)} \n ` +
                            `${modissue}\n${ppissue}`
                    ,
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
            obj.reply({
                content: "⠀",
                embeds: [Embed],
                allowedMentions: { repliedUser: false },
                components: [buttons]
            })
        }
        if (interaction != null && message == null) {
            obj.editReply({
                content: "⠀",
                embeds: [Embed],
                allowedMentions: { repliedUser: false },
                components: [buttons]
            })
        }
        if (button) {
            message.edit({
                content: "⠀",
                embeds: [Embed],
                allowedMentions: { repliedUser: false },
                components: [buttons]
            })
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