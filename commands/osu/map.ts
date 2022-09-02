import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import ppcalc = require('booba');
import fetch from 'node-fetch';
import emojis = require('../../configs/emojis');
import cmdchecks = require('../../calc/commandchecks');
import calc = require('../../calc/calculations');
import osufunc = require('../../calc/osufunc');
import colours = require('../../configs/colours');
import osuApiTypes = require('../../configs/osuApiTypes');

module.exports = {
    name: 'map',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides) {
        let commanduser;
        let prevmap;
        let mapid;
        let mapmods;
        let maptitleq = null;
        let detailed = false;
        let curuid;
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

        let baseCommandType: string;

        if (message != null && button == null && overrides == null) {
            commanduser = message.author;
            baseCommandType = 'message'
            curuid = message.author.id

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
        if (overrides != null) {
            commanduser = message.author;
            mapmods = overrides.mods;
            mapid = overrides.id;
            detailed = overrides.detailed;
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null) {
            commanduser = interaction.member.user;
            baseCommandType = 'interaction'
            curuid = interaction.member.user.id

            mapid = interaction.options.getInteger('id');
            mapmods = interaction.options.getString('mods');
            detailed = interaction.options.getBoolean('detailed');
            maptitleq = interaction.options.getString('name');
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            commanduser = interaction.member.user;
            baseCommandType = 'button'
            curuid = interaction.member.user.id

            const urlnohttp = message.embeds[0].url.split('https://')[1];
            //osu.ppy.sh/beatmapsets/setid#gamemode/id
            const setid = urlnohttp.split('/')[2].split('#')[0];
            const curid = urlnohttp.split('/')[3];
            mapid = curid;
            const bmsdata: osuApiTypes.Beatmapset = await osufunc.apiget('mapset_get', `${setid}`)
            fs.writeFileSync(`debugosu/command-map=bmsdata=${obj.guildId}.json`, JSON.stringify(bmsdata, null, 2));
            if (bmsdata?.error) {
                obj.reply({
                    content: `${bmsdata?.error ? bmsdata?.error : 'Error: null'}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                }).catch()
                return;
            }

            const bmstosr = bmsdata.beatmaps.sort((a, b) => a.difficulty_rating - b.difficulty_rating);
            fs.writeFileSync(`debugosu/command-map=bmstosr=${obj.guildId}.json`, JSON.stringify(bmsdata, null, 2));

            //get which part of the array the current map is in
            const curmapindex = bmstosr.findIndex(x => x.id == curid);
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
            if (button == 'DetailEnable') {
                detailed = true;
            }
            if (button == 'DetailDisable') {
                detailed = false;
            }
            if (button == 'Refresh') {
                mapid = curid;
                detailed = message.embeds[0].fields[1].value.includes('aim') || message.embeds[0].fields[0].value.includes('ms')
            }
        }
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
COMMAND EVENT - map (${baseCommandType})
${currentDate} | ${currentDateISO}
recieved map command
requested by ${commanduser.id} AKA ${commanduser.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        //==============================================================================================================================================================================================
        let mapdata: osuApiTypes.Beatmap

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
        const pgbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-map-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-map-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-map-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-map-${commanduser.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                /* .setLabel('End') */,
            );
        const buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-map-${commanduser.id}`)
                .setStyle('Primary')
                .setEmoji('🔁')
    /* .setLabel('Start') */,
        )
        if (detailed == true) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailDisable-map-${curuid}`)
                    .setStyle('Primary')
                    .setEmoji('ℹ')
                /* .setLabel('End') */,
            )
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailEnable-map-${curuid}`)
                    .setStyle('Primary')
                    .setEmoji('ℹ')
                /* .setLabel('End') */
            )
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
            mapdata = await osufunc.apiget('map_get', `${mapid}`)
            fs.writeFileSync(`debugosu/command-map=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))
            if (mapdata?.error) {
                obj.reply({
                    content: `${mapdata?.error ? mapdata?.error : 'Error: null'}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                }).catch()
                return;
            }
        }

        if (maptitleq != null) {
            const mapidtest = await osufunc.apiget('mapset_search', `${maptitleq}`)
            fs.writeFileSync(`debugosu/command-map=mapidtest=${obj.guildId}.json`, JSON.stringify(mapidtest, null, 2))
            if (mapidtest?.error) {
                obj.reply({
                    content: `${mapidtest?.error ? mapidtest?.error : 'Error: null'}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                }).catch()
                return;
            }

            let mapidtest2;

            if (mapidtest.length == 0) {
                obj.reply({ content: 'Error - map not found.\nNo maps found for the parameters: "' + maptitleq + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    .catch();

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
                obj.reply({ content: 'Error - map not found.\nNo maps found for the parameters: "' + maptitleq + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    .catch();

                return;
            }

            mapdata = await osufunc.apiget('map_get', `${mapidtest2[0].id}`)
            fs.writeFileSync(`debugosu/command-map=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))
            if (mapdata?.error) {
                obj.reply({
                    content: `${mapdata?.error ? mapdata?.error : 'Error: null'}`,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: false,
                }).catch()
                return;
            }

            try {
                mapdata.beatmapset.creator
            } catch (error) {
                let ifid = ''
                if (!isNaN(mapid)) {
                    ifid = `Found map id = ${mapid}\n${maptitleq}`
                }
                fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - map not found
params: ${mapid} | ${maptitleq}
----------------------------------------------------`)
                obj.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    .catch();

                return;
            }
        }

        if (mapmods == null || mapmods == '') {
            mapmods = 'NM';
        }
        else {
            mapmods = osumodcalc.OrderMods(mapmods.toUpperCase());
        }
        let statusimg = emojis.rankedstatus.graveyard;
        if (interaction != null && message == null) {
            obj.reply({ content: "Loading...", allowedMentions: { repliedUser: false } })
                .catch();

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

        const allvals = osumodcalc.calcValues(
            mapdata.cs,
            mapdata.ar,
            mapdata.accuracy,
            mapdata.drain,
            mapdata.bpm,
            mapdata.hit_length,
            mapmods
        )
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
        let ppComputed: object;
        let ppissue: string;
        let totaldiff = mapdata.difficulty_rating;
        try {
            ppComputed = await osufunc.mapcalc(mapmods, mapdata.mode, mapdata.id, 0)
            ppissue = '';
            try {
                totaldiff = ppComputed[0].stars.toFixed(2)
            } catch (error) {
                totaldiff = mapdata.difficulty_rating;
            }
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
            console.log(error)
            const tstmods = mapmods.toUpperCase();

            if (tstmods.includes('EZ') || tstmods.includes('HR')) {
                ppissue += '\nInvalid mod combinations: EZ + HR';
            }
            if ((tstmods.includes('DT') || tstmods.includes('NC')) && tstmods.includes('HT')) {
                ppissue += '\nInvalid mod combinations: DT/NC + HT';
            }
            ppComputed = [
                {
                    "mode": 0,
                    "stars": 1.00,
                    "pp": 0.0,
                    "ppAcc": 0.0,
                    "ppAim": 0.0,
                    "ppFlashlight": 0.0,
                    "ppSpeed": 0.0,
                    "ppStrain": 0.0,
                    "ar": 1,
                    "cs": 1,
                    "hp": 1,
                    "od": 1,
                    "bpm": 1,
                    "clockRate": 1,
                    "timePreempt": null,
                    "greatHitWindow": 0,
                    "nCircles": 0,
                    "nSliders": 0
                },
                {
                    "mode": 0,
                    "stars": 1.00,
                    "pp": 0.0,
                    "ppAcc": 0.0,
                    "ppAim": 0.0,
                    "ppFlashlight": 0.0,
                    "ppSpeed": 0.0,
                    "ppStrain": 0.0,
                    "ar": 1,
                    "cs": 1,
                    "hp": 1,
                    "od": 1,
                    "bpm": 1,
                    "clockRate": 1,
                    "timePreempt": null,
                    "greatHitWindow": 0,
                    "nCircles": 0,
                    "nSliders": 0
                },
                {
                    "mode": 0,
                    "stars": 1.00,
                    "pp": 0.0,
                    "ppAcc": 0.0,
                    "ppAim": 0.0,
                    "ppFlashlight": 0.0,
                    "ppSpeed": 0.0,
                    "ppStrain": 0.0,
                    "ar": 1,
                    "cs": 1,
                    "hp": 1,
                    "od": 1,
                    "bpm": 1,
                    "clockRate": 1,
                    "timePreempt": null,
                    "greatHitWindow": 0,
                    "nCircles": 0,
                    "nSliders": 0
                },
                {
                    "mode": 0,
                    "stars": 1.00,
                    "pp": 0.0,
                    "ppAcc": 0.0,
                    "ppAim": 0.0,
                    "ppFlashlight": 0.0,
                    "ppSpeed": 0.0,
                    "ppStrain": 0.0,
                    "ar": 1,
                    "cs": 1,
                    "hp": 1,
                    "od": 1,
                    "bpm": 1,
                    "clockRate": 1,
                    "timePreempt": null,
                    "greatHitWindow": 0,
                    "nCircles": 0,
                    "nSliders": 0
                },
                {
                    "mode": 0,
                    "stars": 1.00,
                    "pp": 0.0,
                    "ppAcc": 0.0,
                    "ppAim": 0.0,
                    "ppFlashlight": 0.0,
                    "ppSpeed": 0.0,
                    "ppStrain": 0.0,
                    "ar": 1,
                    "cs": 1,
                    "hp": 1,
                    "od": 1,
                    "bpm": 1,
                    "clockRate": 1,
                    "timePreempt": null,
                    "greatHitWindow": 0,
                    "nCircles": 0,
                    "nSliders": 0
                },
                {
                    "mode": 0,
                    "stars": 1.00,
                    "pp": 0.0,
                    "ppAcc": 0.0,
                    "ppAim": 0.0,
                    "ppFlashlight": 0.0,
                    "ppSpeed": 0.0,
                    "ppStrain": 0.0,
                    "ar": 1,
                    "cs": 1,
                    "hp": 1,
                    "od": 1,
                    "bpm": 1,
                    "clockRate": 1,
                    "timePreempt": null,
                    "greatHitWindow": 0,
                    "nCircles": 0,
                    "nSliders": 0
                },
            ]
        }
        let basicvals = `CS${allvals.cs} AR${allvals.ar} OD${allvals.od} HP${allvals.hp}`;
        if (interaction) {
            if (detailed == true) {
                basicvals =
                    `CS${allvals.cs} (${allvals.details.csRadius.toFixed(2)}r)
                AR${allvals.ar}  (${allvals.details.arMs.toFixed(2)}ms)
                OD${allvals.od} (300: ${allvals.details.odMs.hitwindow_300.toFixed(2)}ms 100: ${allvals.details.odMs.hitwindow_100.toFixed(2)}ms 50:  ${allvals.details.odMs.hitwindow_50.toFixed(2)}ms)
                HP${allvals.hp}`
            }
        }

        const mapname = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title} (${mapdata.beatmapset.title_unicode})`;

        const artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist} (${mapdata.beatmapset.artist_unicode})`;

        const maptitle: string = mapmods ? `${artist} - ${mapname} [${mapdata.version}] +${mapmods}` : `${artist} - ${mapname} [${mapdata.version}]`

        const mapperdata: osuApiTypes.User = await osufunc.apiget('user', `${mapdata.beatmapset.creator}`)
        fs.writeFileSync(`./debugosu/command-map=mapper=${obj.guildId}.json`, JSON.stringify(mapperdata, null, 2))
        if (mapperdata?.error) {
            obj.reply({
                content: `${mapperdata?.error ? mapperdata?.error : 'Error: null'}`,
                allowedMentions: { repliedUser: false },
                failIfNotExists: false,
            }).catch()
            return;
        }

        const strains = await osufunc.straincalc(mapdata.id, mapmods, 0, mapdata.mode)
        try {
            fs.writeFileSync(`./debugosu/command-map=strains=${obj.guildId}.json`, JSON.stringify(strains, null, 2))
        } catch (error) {
            fs.writeFileSync(`./debugosu/command-map=strains=${obj.guildId}.json`, JSON.stringify({ error: error }, null, 2))
        }
        let mapgraph;
        if (strains) {
            mapgraph = await osufunc.graph(strains.strainTime, strains.value, 'Strains', null, null, null, null, null, 'strains')
        } else {
            mapgraph = null
        }
        let detailedmapdata = '-';
        if (detailed == true) {
            switch (mapdata.mode) {
                case 'osu': {
                    detailedmapdata = `SS: ${ppComputed[0].pp.toFixed(2)} | Aim:${ppComputed[0].ppAim.toFixed(2)} | Speed:${ppComputed[0].ppSpeed.toFixed(2)} | Acc: ${ppComputed[0].ppAcc.toFixed(2)} \n ` +
                        `99: ${ppComputed[1].pp.toFixed(2)} | Aim:${ppComputed[1].ppAim.toFixed(2)} | Speed:${ppComputed[1].ppSpeed.toFixed(2)} | Acc: ${ppComputed[1].ppAcc.toFixed(2)} \n ` +
                        `97: ${ppComputed[3].pp.toFixed(2)} | Aim:${ppComputed[3].ppAim.toFixed(2)} | Speed:${ppComputed[3].ppSpeed.toFixed(2)} | Acc: ${ppComputed[3].ppAcc.toFixed(2)} \n ` +
                        `95: ${ppComputed[5].pp.toFixed(2)} | Aim:${ppComputed[5].ppAim.toFixed(2)} | Speed:${ppComputed[5].ppSpeed.toFixed(2)} | Acc: ${ppComputed[5].ppAcc.toFixed(2)} \n ` +
                        `${modissue}\n${ppissue}`
                }
                case 'taiko': {
                    detailedmapdata = `SS: ${ppComputed[0].pp.toFixed(2)} | Acc: ${ppComputed[0].ppAcc.toFixed(2)} | Strain: ${ppComputed[0].ppStrain.toFixed(2)} \n ` +
                        `99: ${ppComputed[1].pp.toFixed(2)} | Acc: ${ppComputed[1].ppAcc.toFixed(2)} | Strain: ${ppComputed[1].ppStrain.toFixed(2)} \n ` +
                        `97: ${ppComputed[3].pp.toFixed(2)} | Acc: ${ppComputed[3].ppAcc.toFixed(2)} | Strain: ${ppComputed[3].ppStrain.toFixed(2)} \n ` +
                        `95: ${ppComputed[5].pp.toFixed(2)} | Acc: ${ppComputed[5].ppAcc.toFixed(2)} | Strain: ${ppComputed[5].ppStrain.toFixed(2)} \n ` +
                        `${modissue}\n${ppissue}`
                }
                case 'fruits': {
                    detailedmapdata = `SS: ${ppComputed[0].pp.toFixed(2)} \n ` +
                        `99: ${ppComputed[1].pp.toFixed(2)} \n ` +
                        `98: ${ppComputed[2].pp.toFixed(2)} \n ` +
                        `97: ${ppComputed[3].pp.toFixed(2)} \n ` +
                        `96: ${ppComputed[4].pp.toFixed(2)} \n ` +
                        `95: ${ppComputed[5].pp.toFixed(2)} \n ` +
                        `${modissue}\n${ppissue}`
                }
                case 'mania': {
                    detailedmapdata = `SS: ${ppComputed[0].pp.toFixed(2)} | Acc: ${ppComputed[0].ppAcc.toFixed(2)} | Strain: ${ppComputed[0].ppStrain.toFixed(2)} \n ` +
                        `99: ${ppComputed[1].pp.toFixed(2)} | Acc: ${ppComputed[1].ppAcc.toFixed(2)} | Strain: ${ppComputed[1].ppStrain.toFixed(2)} \n ` +
                        `97: ${ppComputed[3].pp.toFixed(2)} | Acc: ${ppComputed[3].ppAcc.toFixed(2)} | Strain: ${ppComputed[3].ppStrain.toFixed(2)} \n ` +
                        `95: ${ppComputed[5].pp.toFixed(2)} | Acc: ${ppComputed[5].ppAcc.toFixed(2)} | Strain: ${ppComputed[5].ppStrain.toFixed(2)} \n ` +
                        `${modissue}\n${ppissue}`
                }

            }
        }
        const Embed = new Discord.EmbedBuilder()
            .setColor(0x91ff9a)
            .setTitle(maptitle)
            .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${mapdata.mode}/${mapdata.id}`)
            .setAuthor({
                name: `${mapdata.beatmapset.creator}`,
                url: `https://osu.ppy.sh/u/${mapperdata.id}`,
                iconURL: `https://a.ppy.sh/${mapperdata.id}`,
            })
            .setThumbnail(`https://b.ppy.sh/thumb/${mapdata.beatmapset_id}l.jpg` || `https://osu.ppy.sh/images/layout/avatar-guest@2x.png`)
            .addFields([
                {
                    name: 'MAP VALUES',
                    value:
                        `${basicvals}\n` +
                        `${totaldiff}⭐ ${emojis.mapobjs.bpm}${allvals.bpm}\n` +
                        `${emojis.mapobjs.circle}${mapdata.count_circles} \n${emojis.mapobjs.slider}${mapdata.count_sliders} \n${emojis.mapobjs.spinner}${mapdata.count_spinners}\n` +
                        `${emojis.mapobjs.total_length}${allvals.details.lengthFull}\n` +
                        `${mapdata.max_combo}x combo`,
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
                            detailedmapdata
                    ,
                    inline: true
                },
                {
                    name: 'DOWNLOAD',
                    value:
                        `[osu!](https://osu.ppy.sh/b/${mapdata.id}) | [Chimu](https://api.chimu.moe/v1/download${mapdata.beatmapset_id}) | [Beatconnect](https://beatconnect.io/b/${mapdata.beatmapset_id}) | [Kitsu](https://kitsu.io/d/${mapdata.beatmapset_id})\n` +
                        `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapdata.id})`,
                    inline: true
                },
                {
                    name: 'MAP DETAILS',
                    value: `${statusimg} | ${mapimg} \n ` +
                        `${mapdata.playcount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} plays | ${mapdata.beatmapset.play_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} mapset plays | ${mapdata.passcount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} passes | ${mapdata.beatmapset.favourite_count} favourites\n` +
                        `Submitted <t:${new Date(mapdata.beatmapset.submitted_date).getTime() / 1000}:R> | Last updated <t:${new Date(mapdata.beatmapset.last_updated).getTime() / 1000}:R>
                        ${mapdata.status == 'ranked' ?
                            `Ranked <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                        }${mapdata.status == 'approved' || mapdata.status == 'qualified' ?
                            `Approved/Qualified <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                        }${mapdata.status == 'loved' ?
                            `Loved <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                        }\n` +
                        `${mapdata.beatmapset.video == true ? '📺' : ''} ${mapdata.beatmapset.storyboard == true ? '🎨' : ''}`

                    ,
                    inline: false
                }
            ])
        if (mapgraph) {
            Embed.setImage(`${mapgraph}`)
        }
        switch (true) {
            case parseFloat(totaldiff.toString()) >= 8:
                Embed.setColor(colours.diffcolour[7].hex)
                break;
            case parseFloat(totaldiff.toString()) >= 7:
                Embed.setColor(colours.diffcolour[6].hex)
                break;
            case parseFloat(totaldiff.toString()) >= 6:
                Embed.setColor(colours.diffcolour[5].hex)
                break;
            case parseFloat(totaldiff.toString()) >= 4.5:
                Embed.setColor(colours.diffcolour[4].hex)
                break;
            case parseFloat(totaldiff.toString()) >= 3.25:
                Embed.setColor(colours.diffcolour[3].hex)
                break;
            case parseFloat(totaldiff.toString()) >= 2.5:
                Embed.setColor(colours.diffcolour[2].hex)
                break;
            case parseFloat(totaldiff.toString()) >= 2:
                Embed.setColor(colours.diffcolour[1].hex)
                break;
            case parseFloat(totaldiff.toString()) >= 1.5:
                Embed.setColor(colours.diffcolour[0].hex)
                break;
            default:
                Embed.setColor(colours.diffcolour[0].hex)
                break;
        }
        const embeds = [Embed];

        if (detailed == true) {
            const failval = mapdata.failtimes.fail;
            const exitval = mapdata.failtimes.exit;
            const numofval = [];
            for (let i = 0; i < failval.length; i++) {
                numofval.push(i)
            }

            const passurl = await osufunc.graph(numofval, failval, 'Fails', true, false, false, false, true, 'bar', true, exitval, 'Exits');
            const passEmbed = new Discord.EmbedBuilder()
                .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${mapdata.mode}/${mapdata.id}`)
                .setImage(`${passurl}`);
            await embeds.push(passEmbed);
        }

        if (message && interaction == null) {
            obj.reply({
                content: "⠀",
                embeds: embeds,
                allowedMentions: { repliedUser: false },
                components: [pgbuttons, buttons]
            })
                .catch();

        }
        if (interaction != null && message == null) {
            obj.editReply({
                content: "⠀",
                embeds: embeds,
                allowedMentions: { repliedUser: false },
                components: [pgbuttons, buttons]
            })
                .catch();

        }
        if (button) {
            message.edit({
                content: "⠀",
                embeds: embeds,
                allowedMentions: { repliedUser: false },
                components: [pgbuttons, buttons]
            })
                .catch();

        }
        fs.writeFileSync(`./debugosu/prevmap${obj.guildId}.json`, JSON.stringify(({ id: mapdata.id }), null, 2));
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