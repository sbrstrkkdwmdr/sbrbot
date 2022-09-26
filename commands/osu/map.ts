import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');
import func = require('../../src/other');
import def = require('../../src/consts/defaults');

module.exports = {
    name: 'map',
    async execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;

        let mapid;
        let mapmods;
        let maptitleq = null;
        let detailed = false;

        const useComponents = [];
        let overwriteModal = null;


        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
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
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;

                mapid = obj.options.getInteger('id');
                mapmods = obj.options.getString('mods');
                detailed = obj.options.getBoolean('detailed');
                maptitleq = obj.options.getString('query');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                if (!obj.message.embeds[0]) {
                    return;
                }
                commanduser = obj.member.user;
                const urlnohttp = obj.message.embeds[0].url.split('https://')[1];
                const setid = urlnohttp.split('/')[2].split('#')[0];
                const curid = urlnohttp.split('/')[3];
                mapid = curid;
                let bmsdata: osuApiTypes.Beatmapset;
                if (func.findFile(absoluteID, `bmsdata${setid}`) &&
                    commandType == 'button' &&
                    !('error' in func.findFile(absoluteID, `bmsdata${setid}`)) &&
                    button != 'Refresh') {
                    bmsdata = func.findFile(absoluteID, `bmsdata${setid}`)
                } else {
                    bmsdata = await osufunc.apiget('mapset_get', `${setid}`)
                }
                func.storeFile(bmsdata, absoluteID, `bmsdata${setid}`)

                osufunc.debug(bmsdata, 'command', 'map', obj.guildId, 'bmsData');

                if (bmsdata?.error) {
                    return;
                }
                const bmstosr = bmsdata.beatmaps.sort((a, b) => a.difficulty_rating - b.difficulty_rating);
                osufunc.debug(bmstosr, 'command', 'map', obj.guildId, 'bmsToSr');

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

                if (obj.message.embeds[0].fields[1].value.includes('aim') || obj.message.embeds[0].fields[0].value.includes('ms')) {
                    detailed = true
                }
                mapmods = obj.message.embeds[0].title.split('+')[1];
                if (button == 'DetailEnable') {
                    detailed = true;
                }
                if (button == 'DetailDisable') {
                    detailed = false;
                }
                if (button == 'Refresh') {
                    mapid = curid;
                    detailed = obj.message.embeds[0].fields[1].value.includes('aim') || obj.message.embeds[0].fields[0].value.includes('ms')
                }
            }
                break;

            case 'link': {
                commanduser = obj.author;

                const messagenohttp = obj.content.replace('https://', '').replace('http://', '').replace('www.', '')
                mapmods =
                    obj.content.includes('+') ?
                        messagenohttp.split('+')[1] : 'NM';
                if (
                    (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmapsets/') && messagenohttp.includes('#'))) ||
                    (!messagenohttp.includes('/s/') && (messagenohttp.includes('/b/'))) ||
                    (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmaps/')))
                ) {
                    let idfirst;
                    try {
                        if (messagenohttp.includes('beatmapsets')) {

                            idfirst = messagenohttp.split('#')[1].split('/')[1]
                        } else if (messagenohttp.includes('?')) {
                            idfirst = messagenohttp.split('beatmaps/')[1].split('?')[0]
                        }
                        else {
                            idfirst = messagenohttp.split('/')[messagenohttp.split('/').length - 1]
                        }
                        if (isNaN(idfirst)) {
                            mapid = parseInt(idfirst.split(' ')[0])
                        } else {
                            mapid = parseInt(idfirst)
                        }
                    } catch (error) {
                        obj.reply({
                            content: 'Please enter a valid beatmap link.',
                            allowedMentions: { repliedUser: false }
                        })
                            .catch(error => { });
                        return;
                    }
                } else if (messagenohttp.includes('q=')) {
                    maptitleq =
                        messagenohttp.includes('&') ?
                            messagenohttp.split('q=')[1].split('&')[0] :
                            messagenohttp.split('q=')[1];
                } else {
                    let setid = 910392;
                    if (!messagenohttp.includes('/beatmapsets/')) {
                        setid = messagenohttp.split('/s/')[1]

                        if (isNaN(setid)) {
                            setid = messagenohttp.split('/s/')[1].split(' ')[0]
                        }
                    } else if (!messagenohttp.includes('/s/')) {
                        setid = messagenohttp.split('/beatmapsets/')[1]

                        if (isNaN(setid)) {
                            setid = messagenohttp.split('/s/')[1].split(' ')[0]
                        }
                    }
                    const bmsdata: osuApiTypes.Beatmapset = await osufunc.apiget('mapset_get', `${setid}`)
                    if (bmsdata?.error) {
                        return;
                    }
                    try {
                        mapid = bmsdata.beatmaps[0].id;
                    } catch (error) {
                        obj.reply({
                            content: 'Please enter a valid beatmap link.',
                            allowedMentions: {
                                repliedUser: false
                            }
                        })
                            .catch(error => { });
                        return;
                    }
                }
            }
                break;
        }
        if (overrides != null) {
            overwriteModal = overrides.overwriteModal
            mapid = overrides.id
        }

        //==============================================================================================================================================================================================

        const buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`Refresh-map-${commanduser.id}-${absoluteID}`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setEmoji('🔁'),
        )

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'map',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'Map ID',
                    value: mapid
                },
                {
                    name: 'Map mods',
                    value: mapmods
                },
                {
                    name: 'Map title query',
                    value: maptitleq
                },
                {
                    name: 'Detailed',
                    value: detailed
                }
                ]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================


        if (!mapid || isNaN(mapid)) {
            mapid = osufunc.getPreviousId('map', obj.guildId);
        }
        if (detailed == true) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailDisable-map-${commanduser.id}-${absoluteID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('📝')
            )
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`DetailEnable-map-${commanduser.id}-${absoluteID}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('📝')
            )
        }
        let mapdata: osuApiTypes.Beatmap;

        const inputModal = new Discord.SelectMenuBuilder()
            .setCustomId(`Select-map-${commanduser.id}-${absoluteID}`)
            .setPlaceholder('Select a map')

        if (maptitleq == null) {
            if (func.findFile(absoluteID, `mapdata${mapid}`) &&
                commandType == 'button' &&
                !('error' in func.findFile(absoluteID, `mapdata${mapid}`)) &&
                button != 'Refresh') {
                mapdata = func.findFile(absoluteID, `mapdata${mapid}`)
            } else {
                mapdata = await osufunc.apiget('map_get', `${mapid}`)
            }
            func.storeFile(mapdata, absoluteID, `mapdata${mapid}`)
            osufunc.debug(mapdata, 'command', 'map', obj.guildId, 'mapData');

            if (mapdata?.error) {
                if (commandType != 'button' && commandType != 'link') {

                    obj.reply({
                        content: 'Error - could not fetch mapper data.',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()

                }
                return;
            }
            let bmsdata: osuApiTypes.Beatmapset;
            if (func.findFile(absoluteID, `bmsdata${mapdata.beatmapset_id}`) &&
                commandType == 'button' &&
                !('error' in func.findFile(absoluteID, `bmsdata${mapdata.beatmapset_id}`)) &&
                button != 'Refresh') {
                bmsdata = func.findFile(absoluteID, `bmsdata${mapdata.beatmapset_id}`)
            } else {
                bmsdata = await osufunc.apiget('mapset_get', `${mapdata.beatmapset_id}`)
            }
            func.storeFile(bmsdata, absoluteID, `bmsdata${mapdata.beatmapset_id}`)

            osufunc.debug(bmsdata, 'command', 'map', obj.guildId, 'bmsData');

            if (typeof bmsdata.beatmaps == 'undefined' || bmsdata.beatmaps.length < 2) {
                inputModal.addOptions(
                    new Discord.SelectMenuOptionBuilder()
                        .setEmoji(`${mapdata.mode_int == 0 ? emojis.gamemodes.standard :
                            mapdata.mode_int == 1 ? emojis.gamemodes.taiko :
                                mapdata.mode_int == 2 ? emojis.gamemodes.fruits :
                                    mapdata.mode_int == 3 ? emojis.gamemodes.mania :
                                        emojis.gamemodes.standard
                            }`)
                        .setLabel(`#${1}`)
                        .setDescription(`${mapdata.version} ${mapdata.difficulty_rating}⭐`)
                        .setValue(`${mapdata.id}`)
                )
            } else {
                for (let i = 0; i < bmsdata.beatmaps.length && i < 25; i++) {
                    const curmap = bmsdata.beatmaps.slice().sort((a, b) => b.difficulty_rating - a.difficulty_rating)[i]
                    if (!curmap) break;
                    inputModal.addOptions(
                        new Discord.SelectMenuOptionBuilder()
                            .setEmoji(`${mapdata.mode_int == 0 ? emojis.gamemodes.standard :
                                mapdata.mode_int == 1 ? emojis.gamemodes.taiko :
                                    mapdata.mode_int == 2 ? emojis.gamemodes.fruits :
                                        mapdata.mode_int == 3 ? emojis.gamemodes.mania :
                                            emojis.gamemodes.standard
                                }`)
                            .setLabel(`#${i + 1} | ${bmsdata.title}`)
                            .setDescription(`${curmap.version} ${curmap.difficulty_rating}⭐`)
                            .setValue(`${curmap.id}`)
                    )
                }
            }
        }

        if (maptitleq != null) {
            const mapidtest = await osufunc.apiget('mapset_search', `${maptitleq}`)
            osufunc.debug(mapidtest, 'command', 'map', obj.guildId, 'mapIdTestData');

            if (mapidtest?.error) {
                if (commandType != 'button' && commandType != 'link') {

                    obj.reply({
                        content: 'Error - could not fetch beatmap search data.',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).catch()
                }
                return;
            }

            let mapidtest2;

            if (mapidtest.length == 0) {
                obj.reply({ content: 'Error - map not found.\nNo maps found for the parameters: "' + maptitleq + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                    .catch();

                return;
            }
            try {
                mapidtest2 = mapidtest.beatmapsets[0].beatmaps.sort((a, b) => a.difficulty_rating - b.difficulty_rating)
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
            const allmaps: { mode_int: number, map: osuApiTypes.BeatmapCompact, mapset: osuApiTypes.Beatmapset }[] = [];

            for (let i = 0; i < mapidtest.beatmapsets.length; i++) {
                if (!mapidtest.beatmapsets[i]) break;

                for (let j = 0; j < mapidtest.beatmapsets[i].beatmaps.length; j++) {
                    if (!mapidtest.beatmapsets[i].beatmaps[j]) break;
                    allmaps.push({
                        mode_int: mapidtest.beatmapsets[i].beatmaps[j].mode_int,
                        map: mapidtest.beatmapsets[i].beatmaps[j],
                        mapset: mapidtest.beatmapsets[i]
                    })
                }
            }

            if (func.findFile(absoluteID, `mapdata${mapidtest2[0].id}`) &&
                commandType == 'button' &&
                !('error' in func.findFile(absoluteID, `mapdata${mapidtest2[0].id}`)) &&
                button != 'Refresh') {
                mapdata = func.findFile(absoluteID, `mapdata${mapidtest2[0].id}`)
            } else {
                mapdata = await osufunc.apiget('map_get', `${mapidtest2[0].id}`)
            }
            func.storeFile(mapdata, absoluteID, `mapdata${mapidtest2[0].id}`)

            osufunc.debug(mapdata, 'command', 'map', obj.guildId, 'mapData');
            if (mapdata?.error) {
                if (commandType != 'button' && commandType != 'link') {

                    obj.reply({
                        content: 'Error - could not fetch beatmap data',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }
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

            for (let i = 0; i < allmaps.length && i < 25; i++) {
                const curmap = allmaps[i]
                if (!curmap.map) break;
                inputModal.addOptions(
                    new Discord.SelectMenuOptionBuilder()
                        .setEmoji(`${curmap.mode_int == 0 ? emojis.gamemodes.standard :
                            curmap.mode_int == 1 ? emojis.gamemodes.taiko :
                                curmap.mode_int == 2 ? emojis.gamemodes.fruits :
                                    curmap.mode_int == 3 ? emojis.gamemodes.mania :
                                        emojis.gamemodes.standard
                            }`)
                        .setLabel(`#${i + 1} | ${curmap.mapset?.title} // ${curmap.mapset?.creator}`)
                        .setDescription(`[${curmap.map.version}] ${curmap.map.difficulty_rating}⭐`)
                        .setValue(`${curmap.map.id}`)
                )
            }
        }

        if (mapmods == null || mapmods == '') {
            mapmods = 'NM';
        }
        else {
            mapmods = osumodcalc.OrderMods(mapmods.toUpperCase());
        }
        let statusimg = emojis.rankedstatus.graveyard;
        if (commandType == 'interaction') {
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
            ppComputed = await osufunc.mapcalc({
                mods: mapmods,
                gamemode: mapdata.mode,
                mapid: mapdata.id,
                calctype: 0
            })
            ppissue = '';
            try {
                totaldiff = ppComputed[0].stars?.toFixed(2)
            } catch (error) {
                totaldiff = mapdata.difficulty_rating;
            }
            osufunc.debug(ppComputed, 'command', 'map', obj.guildId, 'ppCalc');

        } catch (error) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
cmd ID: ${absoluteID}
Error - pp calculation failed
${error}
----------------------------------------------------`)
            ppissue = 'Error - pp could not be calculated';
            const tstmods = mapmods.toUpperCase();

            if (tstmods.includes('EZ') || tstmods.includes('HR')) {
                ppissue += '\nInvalid mod combinations: EZ + HR';
            }
            if ((tstmods.includes('DT') || tstmods.includes('NC')) && tstmods.includes('HT')) {
                ppissue += '\nInvalid mod combinations: DT/NC + HT';
            }
            const ppComputedTemp = {
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
            };
            ppComputed = [
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
            ]
        }
        let basicvals = `CS${allvals.cs} AR${allvals.ar} OD${allvals.od} HP${allvals.hp}`;
        if (detailed == true) {
            basicvals =
                `CS${allvals.cs} (${allvals.details.csRadius?.toFixed(2)}r)
                AR${allvals.ar}  (${allvals.details.arMs?.toFixed(2)}ms)
                OD${allvals.od} (300: ${allvals.details.odMs.hitwindow_300?.toFixed(2)}ms 100: ${allvals.details.odMs.hitwindow_100?.toFixed(2)}ms 50:  ${allvals.details.odMs.hitwindow_50?.toFixed(2)}ms)
                HP${allvals.hp}`
        }

        const mapname = mapdata.beatmapset.title == mapdata.beatmapset.title_unicode ? mapdata.beatmapset.title : `${mapdata.beatmapset.title_unicode} (${mapdata.beatmapset.title})`;
        const artist = mapdata.beatmapset.artist == mapdata.beatmapset.artist_unicode ? mapdata.beatmapset.artist : `${mapdata.beatmapset.artist_unicode} (${mapdata.beatmapset.artist})`;
        const maptitle: string = mapmods ? `${artist} - ${mapname} [${mapdata.version}] +${mapmods}` : `${artist} - ${mapname} [${mapdata.version}]`

        let mapperdata: osuApiTypes.User;
        if (func.findFile(absoluteID, `mapperdata${mapdata.beatmapset_id}`) &&
            commandType == 'button' &&
            !('error' in func.findFile(absoluteID, `mapperdata${mapdata.beatmapset_id}`)) &&
            button != 'Refresh') {
            mapperdata = func.findFile(absoluteID, `mapperdata${mapdata.beatmapset_id}`)
        } else {
            mapperdata = await osufunc.apiget('user', `${mapdata.beatmapset.creator}`)
        }
        func.storeFile(mapperdata, absoluteID, `mapperdata${mapdata.beatmapset_id}`)

        osufunc.debug(mapperdata, 'command', 'map', obj.guildId, 'mapperData');

        if (mapperdata?.error) {
            mapperdata = JSON.parse(fs.readFileSync('./files/defaults/mapper.json', 'utf8'));
            // if (commandType != 'button' && commandType != 'link') {
            //     obj.reply({
            //         content: 'Error - could not find mapper',
            //         allowedMentions: { repliedUser: false },
            //         failIfNotExists: true
            //     })
            // }
            // return;
        }

        const strains = await osufunc.straincalc(mapdata.id, mapmods, 0, mapdata.mode)
        try {
            osufunc.debug(strains, 'command', 'map', obj.guildId, 'strains');

        } catch (error) {
            osufunc.debug({ error: error }, 'command', 'map', obj.guildId, 'strains');
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
                    detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} | Aim: ${ppComputed[0].ppAim?.toFixed(2)} | Speed: ${ppComputed[0].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[0].ppAcc?.toFixed(2)} \n ` +
                        `**99**: ${ppComputed[1].pp?.toFixed(2)} | Aim: ${ppComputed[1].ppAim?.toFixed(2)} | Speed: ${ppComputed[1].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[1].ppAcc?.toFixed(2)} \n ` +
                        `**97**: ${ppComputed[3].pp?.toFixed(2)} | Aim: ${ppComputed[3].ppAim?.toFixed(2)} | Speed: ${ppComputed[3].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[3].ppAcc?.toFixed(2)} \n ` +
                        `**95**: ${ppComputed[5].pp?.toFixed(2)} | Aim: ${ppComputed[5].ppAim?.toFixed(2)} | Speed: ${ppComputed[5].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[5].ppAcc?.toFixed(2)} \n ` +
                        `${modissue}\n${ppissue}`
                }
                    break;
                case 'taiko': {
                    detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} | Acc: ${ppComputed[0].ppAcc?.toFixed(2)} | Strain: ${ppComputed[0].ppStrain?.toFixed(2)} \n ` +
                        `**99**: ${ppComputed[1].pp?.toFixed(2)} | Acc: ${ppComputed[1].ppAcc?.toFixed(2)} | Strain: ${ppComputed[1]?.ppStrain?.toFixed(2)} \n ` +
                        `**97**: ${ppComputed[3].pp?.toFixed(2)} | Acc: ${ppComputed[3].ppAcc?.toFixed(2)} | Strain: ${ppComputed[3]?.ppStrain?.toFixed(2)} \n ` +
                        `**95**: ${ppComputed[5].pp?.toFixed(2)} | Acc: ${ppComputed[5].ppAcc?.toFixed(2)} | Strain: ${ppComputed[5]?.ppStrain?.toFixed(2)} \n ` +
                        `${modissue}\n${ppissue}`
                }
                    break;
                case 'fruits': {
                    detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} \n ` +
                        `**99**: ${ppComputed[1].pp?.toFixed(2)} \n ` +
                        `**98**: ${ppComputed[2].pp?.toFixed(2)} \n ` +
                        `**97**: ${ppComputed[3].pp?.toFixed(2)} \n ` +
                        `**96**: ${ppComputed[4].pp?.toFixed(2)} \n ` +
                        `**95**: ${ppComputed[5].pp?.toFixed(2)} \n ` +
                        `${modissue}\n${ppissue}`
                }
                    break;
                case 'mania': {
                    detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} | Acc: ${ppComputed[0].ppAcc?.toFixed(2)} | Strain: ${ppComputed[0].ppStrain?.toFixed(2)} \n ` +
                        `**99**: ${ppComputed[1].pp?.toFixed(2)} | Acc: ${ppComputed[1].ppAcc?.toFixed(2)} | Strain: ${ppComputed[1].ppStrain?.toFixed(2)} \n ` +
                        `**97**: ${ppComputed[3].pp?.toFixed(2)} | Acc: ${ppComputed[3].ppAcc?.toFixed(2)} | Strain: ${ppComputed[3].ppStrain?.toFixed(2)} \n ` +
                        `**95**: ${ppComputed[5].pp?.toFixed(2)} | Acc: ${ppComputed[5].ppAcc?.toFixed(2)} | Strain: ${ppComputed[5].ppStrain?.toFixed(2)} \n ` +
                        `${modissue}\n${ppissue}`
                }
                    break;

            }
        }

        const exMapDetails = `${func.separateNum(mapdata.playcount)} plays | ${func.separateNum(mapdata.beatmapset.play_count)} mapset plays | ${func.separateNum(mapdata.passcount)} passes | ${func.separateNum(mapdata.beatmapset.favourite_count)} favourites\n` +
            `Submitted <t:${new Date(mapdata.beatmapset.submitted_date).getTime() / 1000}:R> | Last updated <t:${new Date(mapdata.beatmapset.last_updated).getTime() / 1000}:R>
        ${mapdata.status == 'ranked' ?
                `Ranked <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
            }${mapdata.status == 'approved' || mapdata.status == 'qualified' ?
                `Approved/Qualified <t: ${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
            }${mapdata.status == 'loved' ?
                `Loved <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
            }\n` +
            `${mapdata.beatmapset.video == true ? '📺' : ''} ${mapdata.beatmapset.storyboard == true ? '🎨' : ''}`

        const Embed = new Discord.EmbedBuilder()
            .setColor(0x91ff9a)
            .setTitle(maptitle)
            .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${mapdata.mode}/${mapdata.id}`)
            .setAuthor({
                name: `${mapdata.beatmapset.creator}`,
                url: `https://osu.ppy.sh/u/${mapperdata.id}`,
                iconURL: `${mapperdata?.avatar_url ?? def.images.any.url}`,
            })
            .setThumbnail(osufunc.getMapImages(mapdata.beatmapset_id).list2x)
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
                            `SS: ${ppComputed[0].pp?.toFixed(2)} \n ` +
                            `99: ${ppComputed[1].pp?.toFixed(2)} \n ` +
                            `98: ${ppComputed[2].pp?.toFixed(2)} \n ` +
                            `97: ${ppComputed[3].pp?.toFixed(2)} \n ` +
                            `96: ${ppComputed[4].pp?.toFixed(2)} \n ` +
                            `95: ${ppComputed[5].pp?.toFixed(2)} \n ` +
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
                        `${detailed == true ?
                            exMapDetails
                            : ''}`

                    ,
                    inline: false
                }
            ])
        if (mapgraph) {
            Embed.setImage(`${mapgraph}`)
        }
        switch (true) {
            case parseFloat(totaldiff.toString()) >= 8:
                Embed.setColor(colours.diffcolour[7].dec)
                break;
            case parseFloat(totaldiff.toString()) >= 7:
                Embed.setColor(colours.diffcolour[6].dec)
                break;
            case parseFloat(totaldiff.toString()) >= 6:
                Embed.setColor(colours.diffcolour[5].dec)
                break;
            case parseFloat(totaldiff.toString()) >= 4.5:
                Embed.setColor(colours.diffcolour[4].dec)
                break;
            case parseFloat(totaldiff.toString()) >= 3.25:
                Embed.setColor(colours.diffcolour[3].dec)
                break;
            case parseFloat(totaldiff.toString()) >= 2.5:
                Embed.setColor(colours.diffcolour[2].dec)
                break;
            case parseFloat(totaldiff.toString()) >= 2:
                Embed.setColor(colours.diffcolour[1].dec)
                break;
            case parseFloat(totaldiff.toString()) >= 1.5:
                Embed.setColor(colours.diffcolour[0].dec)
                break;
            default:
                Embed.setColor(colours.diffcolour[0].dec)
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

        osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`);


        useComponents.push(buttons);

        let frmod = inputModal;
        if (overwriteModal != null) {
            frmod = overwriteModal
        }

        const selectrow = new Discord.ActionRowBuilder()
            .addComponents(frmod)

        if (!(inputModal.options.length < 1)) {
            useComponents.push(selectrow);
        }

        osufunc.writePreviousId('map', obj.guildId, `${mapdata.id}`);


        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: embeds,
                    components: useComponents,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                setTimeout(() => {
                    obj.editReply({
                        content: '',
                        embeds: embeds,
                        components: useComponents,
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                        .catch();
                }, 1000)
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.message.edit({
                    content: '',
                    embeds: embeds,
                    components: useComponents,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
            case 'link': {
                obj.reply({
                    content: '',
                    embeds: embeds,
                    components: useComponents,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }



        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}