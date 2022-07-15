const { access_token } = require('../configs/osuauth.json');
const fs = require('fs');
const osucalc = require('osumodcalculator');
const fetch = require('node-fetch')
const ppcalc = require('booba')
const emojis = require('../configs/emojis.js')

module.exports = {
    name: 'map',
    description:
        'Returns the information of a map\n' +
        'Command: `sbr-map <id> <mods>`\n' +
        'Slash command: `/map [id] [mods]`\n' +
        'Options:\n' +
        '⠀⠀`id`: integer, optional. the id of the beatmap\n' +
        '⠀⠀`mods`: string, optional. the mods of the beatmap\n' +
        'If no map id is provided, the most recent map will be used'
    ,
    execute(message, args, client, Discord, interaction, currentDate, currentDateISO, config) {
        //check if file configs/prevmap.json exists
        if (fs.existsSync('./configs/prevmap.json')) {
            //console.log('hello there')
            try {
                prevmap = JSON.parse(fs.readFileSync('./configs/prevmap.json', 'utf8'));
            } catch {
                console.log('no map in prevmap.json\nCreating default file...')
                fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: 32345 }), null, 2));
            }
        } else {
            return console.log('Error - missing prevmap.json in configs folder');
        }

        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - map (message)\n${currentDate} | ${currentDateISO}\n recieved get map info command\nrequested by ${message.author.id} AKA ${message.author.tag}]\nMessage content: ${message.content}`, 'utf-8')

            //message.channel.send('Fetching map info...');
            let mapid;
            let mapmods;

            if (!isNaN(args[0])) {
                mapid = args[0];
            }

            if (args.join(' ').includes('+')) {
                mapmods = args.join(' ').split('+')[1]
            }

            if (mapid == null || mapid == '') {
                mapid = prevmap.id;
            }
            if (mapmods == null || mapmods == '') {
                mapmods = 'NM';
            }
            else {
                mapmods = osucalc.OrderMods(mapmods.toUpperCase());
            }
            //let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}?`

            if (args.join(' ').includes('"')) {
                maptitle = args.join(' ').split('"')[1]//.join('')//.replaceAll(',', '')
                mapnameurl = `https://osu.ppy.sh/api/v2/beatmapsets/search?q=${maptitle}&s=any`
                fetch(mapnameurl, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                }).then(res => res.json())
                    .then(mapidtest => {
                        fs.appendFileSync('commands.log', `\nfetched title - ${maptitle}`)
                        fs.writeFileSync('debugosu/maptxt.json', JSON.stringify(mapidtest, null, 2))
                        try {
                            sortbyhigh = mapidtest.beatmapsets[0].beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)
                            mapid = mapidtest.beatmapsets[0].beatmaps[0].id
                            //message.channel.send("Information for \"" + maptitle + '"')
                        } catch (error) {
                            console.log(error)
                            message.reply({ content: "No maps found for the parameters: \"" + maptitle + '"', allowedMentions: { repliedUser: false } })
                            return;
                        }
                        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}`


                        fetch(mapurl, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            }
                        })
                            .then(res => res.json())
                            .then(json => {
                                fs.writeFileSync('debugosu/map.json', JSON.stringify(json, null, 2));

                                try {
                                    let mapper = json.beatmapset.creator
                                } catch (error) {
                                    let ifid = ''
                                    if (!isNaN(mapid)) {
                                        ifid = `Found map id = ${mapid}`
                                    }

                                    message.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false } });
                                    return;
                                }
                                fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: json.id }), null, 2));
                                mapid = json.id




                                let mapperlink = (`${json.beatmapset.creator}`).replaceAll(' ', '%20');
                                let maphitonly = json.hit_length
                                let maphitmins = Math.floor(maphitonly / 60)
                                let maphitseconds = Math.floor(maphitonly % 60)
                                if (maphitseconds < 10) {
                                    maphitseconds = '0' + maphitseconds;
                                }
                                let maphitstr = `${maphitmins}:${maphitseconds}`
                                let mapstatus = (json.status)
                                if (mapstatus == "ranked") {
                                    statusimg = emojis.rankedstatus.ranked;
                                }
                                if (mapstatus == "approved" || mapstatus == "qualified") {
                                    statusimg = emojis.rankedstatus.approved;
                                }
                                if (mapstatus == "loved") {
                                    statusimg = emojis.rankedstatus.loved;
                                }
                                if (mapstatus == "graveyard" || mapstatus == "pending") {
                                    statusimg = emojis.rankedstatus.graveyard;
                                }
                                fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapid }), null, 2));

                                //CALCULATE MODS DETAILES

                                let cs = json.cs
                                let ar = json.ar
                                let od = json.accuracy
                                let hp = json.drain
                                let bpm = json.bpm

                                let moddedlength = maphitstr

                                if (((mapmods.includes('DT') || mapmods.includes('NC')) && mapmods.includes('HT') || (mapmods.includes('HR') && mapmods.includes('EZ')))) {
                                    message.reply({ content: `${mapmods} is an invalid mod combination`, allowedMentions: { repliedUser: false } })

                                    return
                                }
                                //dt only
                                if (mapmods.includes('DT') || mapmods.includes('NC') && (!mapmods.includes('HR')) && (!mapmods.includes('EZ')) && (!mapmods.includes('HT'))) {
                                    ar = (osucalc.DoubleTimeAR(ar)).ar
                                    od = (osucalc.odDT(od)).od_num
                                    bpm = (bpm * 1.5).toFixed(2)

                                    maphitmins = Math.floor((maphitonly / 1.5) / 60)
                                    maphitseconds = Math.floor((maphitonly / 1.5) % 60)
                                    if (maphitseconds < 10) {
                                        maphitseconds = '0' + maphitseconds;
                                    }
                                    moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`

                                }
                                //ht only
                                if (mapmods.includes('HT') && (!mapmods.includes('DT')) && (!mapmods.includes('NC')) && (!mapmods.includes('HR')) && (!mapmods.includes('EZ'))) {
                                    ar = osucalc.HalfTimeAR(ar).ar
                                    od = osucalc.odHT(od).od_num
                                    bpm = (bpm * 0.75).toFixed(2)

                                    maphitmins = Math.floor((maphitonly / 0.75) / 60)
                                    maphitseconds = Math.floor((maphitonly / 0.75) % 60)
                                    if (maphitseconds < 10) {
                                        maphitseconds = '0' + maphitseconds;
                                    }
                                    moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`
                                }
                                //hr only
                                if (mapmods.includes('HR') && (!mapmods.includes('DT')) && (!mapmods.includes('NC')) && (!mapmods.includes('HT')) && (!mapmods.includes('EZ'))) {
                                    let tohardrock = osucalc.toHR(cs, ar, od, hp)
                                    cs = tohardrock.cs
                                    ar = tohardrock.ar
                                    od = tohardrock.od
                                    hp = tohardrock.hp
                                }
                                //ez only
                                if (mapmods.includes('EZ') && (!mapmods.includes('DT')) && (!mapmods.includes('NC')) && (!mapmods.includes('HR')) && (!mapmods.includes('HT'))) {
                                    let toeasy = osucalc.toEZ(cs, ar, od, hp)
                                    cs = toeasy.cs
                                    ar = toeasy.ar
                                    od = toeasy.od
                                    hp = toeasy.hp
                                }

                                //ezdt
                                if (mapmods.includes('EZ') && (mapmods.includes('DT') || !mapmods.includes('NC')) && (!mapmods.includes('HR')) && (!mapmods.includes('HT'))) {
                                    let toeasy = osucalc.toEZ(cs, ar, od, hp)
                                    cs = toeasy.cs
                                    ar = osucalc.DoubleTimeAR(toeasy.ar).ar
                                    od = osucalc.odDT(toeasy.od).od_num
                                    hp = toeasy.hp
                                    bpm = (bpm * 1.5).toFixed(2)
                                    maphitmins = Math.floor((maphitonly / 1.5) / 60)
                                    maphitseconds = Math.floor((maphitonly / 1.5) % 60)
                                    if (maphitseconds < 10) {
                                        maphitseconds = '0' + maphitseconds;
                                    }
                                    moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`
                                }
                                //ezht

                                if (mapmods.includes('EZ') && mapmods.includes('HT') && !mapmods.includes('DT') && (!mapmods.includes('HR')) && (!mapmods.includes('NC'))) {
                                    let toeasy = osucalc.toEZ(cs, ar, od, hp)
                                    cs = toeasy.cs
                                    ar = osucalc.HalfTimeAR(toeasy.ar).ar
                                    od = osucalc.odHT(toeasy.od).od_num
                                    hp = toeasy.hp
                                    bpm = (bpm * 0.75).toFixed(2)
                                    maphitmins = Math.floor((maphitonly / 0.75) / 60)
                                    maphitseconds = Math.floor((maphitonly / 0.75) % 60)
                                    if (maphitseconds < 10) {
                                        maphitseconds = '0' + maphitseconds;
                                    }
                                    moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`


                                }
                                //hrdt
                                if (mapmods.includes('HR') && (mapmods.includes('DT') || mapmods.includes('NC')) && !mapmods.includes('EZ') && (!mapmods.includes('HT'))) {
                                    let tohardrock = osucalc.toHR(cs, ar, od, hp)
                                    cs = tohardrock.cs
                                    ar = osucalc.DoubleTimeAR(tohardrock.ar).ar
                                    od = osucalc.odDT(tohardrock.od).od_num
                                    hp = tohardrock.hp
                                    bpm = (bpm * 1.5).toFixed(2)

                                    maphitmins = Math.floor((maphitonly / 1.5) / 60)
                                    maphitseconds = Math.floor((maphitonly / 1.5) % 60)
                                    if (maphitseconds < 10) {
                                        maphitseconds = '0' + maphitseconds;
                                    }
                                    moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`
                                }

                                //hrht
                                if (mapmods.includes('HR') && mapmods.includes('HT') && !mapmods.includes('DT') && !mapmods.includes('EZ') && (!mapmods.includes('NC'))) {
                                    let tohardrock = osucalc.toHR(cs, ar, od, hp)
                                    cs = tohardrock.cs
                                    ar = osucalc.HalfTimeAR(tohardrock.ar).ar
                                    od = osucalc.odHT(tohardrock.od).od_num
                                    hp = tohardrock.hp
                                    bpm = (bpm * 0.75).toFixed(2)

                                    maphitmins = Math.floor((maphitonly / 0.75) / 60)
                                    maphitseconds = Math.floor((maphitonly / 0.75) % 60)
                                    if (maphitseconds < 10) {
                                        maphitseconds = '0' + maphitseconds;
                                    }
                                    moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`

                                }
                                ;

                                (async () => {
                                    let score = {
                                        beatmap_id: mapid,
                                        score: "6795149",
                                        maxcombo: json.max_combo,
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
                                    //const score = scorew
                                    let score95 = {
                                        beatmap_id: mapid,
                                        score: "6795149",
                                        maxcombo: json.max_combo,
                                        count50: "0",
                                        //count100: "5281700",
                                        //count300: "65140967",
                                        count100: "810811 ",
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

                                    let mapmode = json.mode
                                    if (mapmode == "taiko") {
                                        mapimg = emojis.gamemodes.taiko;
                                        pp = new ppcalc.taiko_ppv2().setPerformance(score).setMods(fixedmods);
                                        pp95 = new ppcalc.taiko_ppv2().setPerformance(score95).setMods(fixedmods);
                                    }
                                    if (mapmode == "fruits") {
                                        mapimg = emojis.gamemodes.fruits;
                                        pp = new ppcalc.catch_ppv2().setPerformance(score).setMods(fixedmods);
                                        pp95 = new ppcalc.catch_ppv2().setPerformance(score95).setMods(fixedmods);
                                    }
                                    if (mapmode == "mania") {
                                        mapimg = emojis.gamemodes.mania;
                                        pp = new ppcalc.mania_ppv2().setPerformance(score).setMods(fixedmods);
                                        pp95 = new ppcalc.mania_ppv2().setPerformance(score95).setMods(fixedmods);
                                    }

                                    try {
                                        let ppComputed = await pp.compute();
                                        let pp95Computed = await pp95.compute();

                                        ppComputedString = (Math.abs(ppComputed.total)).toFixed(2)
                                        pp95ComputedString = (Math.abs(pp95Computed.total)).toFixed(2)
                                        ppissue = ''
                                        fs.writeFileSync('./debugosu/mapppcalc.json', JSON.stringify(ppComputed, null, 2))
                                        fs.writeFileSync('./debugosu/mapppcalc95.json', JSON.stringify(pp95Computed, null, 2))

                                    } catch (error) {
                                        ppComputedString = NaN
                                        pp95ComputedString = NaN
                                        ppissue = 'Error - pp calculator could not fetch beatmap'
                                        fs.appendFileSync('commands.log', 'ERROR CALCULATING PERFORMANCE: ' + error)
                                    }

                                    let mapname = json.beatmapset.title
                                    let mapnameuni = json.beatmapset.title_unicode
                                    let a = json.beatmapset.artist
                                    let auni = json.beatmapset.artist_unicode

                                    if (mapname != mapnameuni) {
                                        mapname = `${mapname} (${mapnameuni})`
                                    }

                                    if (a != auni) {
                                        a = `${a} (${auni})`
                                    }

                                    if (mapmods == null || mapmods == '' || mapmods == 'NM') {
                                        maptitle = `${a} - ${mapname} [${json.version}]`
                                    }
                                    else {
                                        maptitle = `${a} - ${mapname} [${json.version}] + ${mapmods}`
                                    }

                                    let mapsetlink = json.beatmapset_id

                                    let mapperurl = `https://osu.ppy.sh/api/v2/users/${mapperlink}/osu`;
                                    fetch(mapperurl, {
                                        headers: {
                                            'Authorization': `Bearer ${access_token}`
                                        }
                                    })
                                        .then(res => res.json())
                                        .then(json2 => {
                                            let mapperid = json2.id;
                                            let Embed = new Discord.MessageEmbed()
                                                .setColor(0x91ff9a)
                                                .setTitle(maptitle)
                                                .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                                .setAuthor({ name: `${json.beatmapset.creator}`, url: `https://osu.ppy.sh/u/${mapperid}`, iconURL: `https://a.ppy.sh/${mapperid}` })
                                                .setThumbnail(`https://b.ppy.sh/thumb/${mapsetlink}l.jpg`)
                                                .addField(
                                                    "**MAP DETAILS**",
                                                    `${statusimg} | ${mapimg} \n` +
                                                    `CS${cs} AR${ar} OD${od} HP${hp} \n` +
                                                    `${json.difficulty_rating}⭐ | ${bpm}BPM⏱\n` +
                                                    `${emojis.mapobjs.circle}${json.count_circles} | ${emojis.mapobjs.slider}${json.count_sliders} | ${emojis.mapobjs.spinner}${json.count_spinners}\n` +
                                                    `${moddedlength}🕐`,
                                                    true
                                                )
                                                .addField(
                                                    "**PP**",
                                                    `SS: ${ppComputedString}pp \n 95: ${pp95ComputedString}pp \n` +
                                                    `${modissue}\n${ppissue}`,
                                                    true
                                                )
                                                .addField(
                                                    "**DOWNLOAD**",
                                                    `[osu!](https://osu.ppy.sh/b/${mapid}) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.io/d/${mapsetlink})\n\n` +
                                                    `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapid})`,
                                                    true
                                                )
                                            message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
                                            fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                        })
                                })();

                            })

                    })
                return;
            }

            //==============================================================================================================================================================================================

            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}`

            fetch(mapurl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            })
                .then(res => res.json())
                .then(json => {
                    fs.writeFileSync('debugosu/map.json', JSON.stringify(json, null, 2));

                    try {
                        let mapper = json.beatmapset.creator
                    } catch (error) {
                        let ifid = ''
                        if (!isNaN(mapid)) {
                            ifid = `Found map id = ${mapid}`
                        }

                        message.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false } });
                        return;
                    }
                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: json.id }), null, 2));
                    mapid = json.id


                    let mapperlink = (`${json.beatmapset.creator}`).replaceAll(' ', '%20');
                    let maphitonly = json.hit_length
                    let maphitmins = Math.floor(maphitonly / 60)
                    let maphitseconds = Math.floor(maphitonly % 60)
                    if (maphitseconds < 10) {
                        maphitseconds = '0' + maphitseconds;
                    }
                    let maphitstr = `${maphitmins}:${maphitseconds}`
                    let mapstatus = (json.status)
                    if (mapstatus == "ranked") {
                        statusimg = emojis.rankedstatus.ranked;
                    }
                    if (mapstatus == "approved" || mapstatus == "qualified") {
                        statusimg = emojis.rankedstatus.approved;
                    }
                    if (mapstatus == "loved") {
                        statusimg = emojis.rankedstatus.loved;
                    }
                    if (mapstatus == "graveyard" || mapstatus == "pending") {
                        statusimg = emojis.rankedstatus.graveyard;
                    }
                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapid }), null, 2));

                    //CALCULATE MODS DETAILES

                    let cs = json.cs
                    let ar = json.ar
                    let od = json.accuracy
                    let hp = json.drain
                    let bpm = json.bpm

                    let moddedlength = maphitstr

                    if (((mapmods.includes('DT') || mapmods.includes('NC')) && mapmods.includes('HT') || (mapmods.includes('HR') && mapmods.includes('EZ')))) {
                        setTimeout(() => {
                            message.reply({ content: `${mapmods} is an invalid combination`, allowedMentions: { repliedUser: false } })
                        }, 500)
                        return
                    }
                    //dt only
                    if (mapmods.includes('DT') || mapmods.includes('NC') && (!mapmods.includes('HR')) && (!mapmods.includes('EZ')) && (!mapmods.includes('HT'))) {
                        ar = (osucalc.DoubleTimeAR(ar)).ar
                        od = (osucalc.odDT(od)).od_num
                        bpm = (bpm * 1.5).toFixed(2)

                        maphitmins = Math.floor((maphitonly / 1.5) / 60)
                        maphitseconds = Math.floor((maphitonly / 1.5) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`

                    }
                    //ht only
                    if (mapmods.includes('HT') && (!mapmods.includes('DT')) && (!mapmods.includes('NC')) && (!mapmods.includes('HR')) && (!mapmods.includes('EZ'))) {
                        ar = osucalc.HalfTimeAR(ar).ar
                        od = osucalc.odHT(od).od_num
                        bpm = (bpm * 0.75).toFixed(2)

                        maphitmins = Math.floor((maphitonly / 0.75) / 60)
                        maphitseconds = Math.floor((maphitonly / 0.75) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`
                    }
                    //hr only
                    if (mapmods.includes('HR') && (!mapmods.includes('DT')) && (!mapmods.includes('NC')) && (!mapmods.includes('HT')) && (!mapmods.includes('EZ'))) {
                        let tohardrock = osucalc.toHR(cs, ar, od, hp)
                        cs = tohardrock.cs
                        ar = tohardrock.ar
                        od = tohardrock.od
                        hp = tohardrock.hp
                    }
                    //ez only
                    if (mapmods.includes('EZ') && (!mapmods.includes('DT')) && (!mapmods.includes('NC')) && (!mapmods.includes('HR')) && (!mapmods.includes('HT'))) {
                        let toeasy = osucalc.toEZ(cs, ar, od, hp)
                        cs = toeasy.cs
                        ar = toeasy.ar
                        od = toeasy.od
                        hp = toeasy.hp
                    }

                    //ezdt
                    if (mapmods.includes('EZ') && (mapmods.includes('DT') || !mapmods.includes('NC')) && (!mapmods.includes('HR')) && (!mapmods.includes('HT'))) {
                        let toeasy = osucalc.toEZ(cs, ar, od, hp)
                        cs = toeasy.cs
                        ar = osucalc.DoubleTimeAR(toeasy.ar).ar
                        od = osucalc.odDT(toeasy.od).od_num
                        hp = toeasy.hp
                        bpm = (bpm * 1.5).toFixed(2)
                        maphitmins = Math.floor((maphitonly / 1.5) / 60)
                        maphitseconds = Math.floor((maphitonly / 1.5) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`
                    }
                    //ezht

                    if (mapmods.includes('EZ') && mapmods.includes('HT') && !mapmods.includes('DT') && (!mapmods.includes('HR')) && (!mapmods.includes('NC'))) {
                        let toeasy = osucalc.toEZ(cs, ar, od, hp)
                        cs = toeasy.cs
                        ar = osucalc.HalfTimeAR(toeasy.ar).ar
                        od = osucalc.odHT(toeasy.od).od_num
                        hp = toeasy.hp
                        bpm = (bpm * 0.75).toFixed(2)
                        maphitmins = Math.floor((maphitonly / 0.75) / 60)
                        maphitseconds = Math.floor((maphitonly / 0.75) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`


                    }
                    //hrdt
                    if (mapmods.includes('HR') && (mapmods.includes('DT') || mapmods.includes('NC')) && !mapmods.includes('EZ') && (!mapmods.includes('HT'))) {
                        let tohardrock = osucalc.toHR(cs, ar, od, hp)
                        cs = tohardrock.cs
                        ar = osucalc.DoubleTimeAR(tohardrock.ar).ar
                        od = osucalc.odDT(tohardrock.od).od_num
                        hp = tohardrock.hp
                        bpm = (bpm * 1.5).toFixed(2)

                        maphitmins = Math.floor((maphitonly / 1.5) / 60)
                        maphitseconds = Math.floor((maphitonly / 1.5) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`
                    }

                    //hrht
                    if (mapmods.includes('HR') && mapmods.includes('HT') && !mapmods.includes('DT') && !mapmods.includes('EZ') && (!mapmods.includes('NC'))) {
                        let tohardrock = osucalc.toHR(cs, ar, od, hp)
                        cs = tohardrock.cs
                        ar = osucalc.HalfTimeAR(tohardrock.ar).ar
                        od = osucalc.odHT(tohardrock.od).od_num
                        hp = tohardrock.hp
                        bpm = (bpm * 0.75).toFixed(2)

                        maphitmins = Math.floor((maphitonly / 0.75) / 60)
                        maphitseconds = Math.floor((maphitonly / 0.75) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`

                    }
                    ;

                    (async () => {
                        let score = {
                            beatmap_id: mapid,
                            score: "6795149",
                            maxcombo: json.max_combo,
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
                        //const score = scorew
                        let score95 = {
                            beatmap_id: mapid,
                            score: "6795149",
                            maxcombo: json.max_combo,
                            count50: "0",
                            //count100: "5281700",
                            //count300: "65140967",
                            count100: "810811 ",
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

                        let mapmode = json.mode
                        if (mapmode == "taiko") {
                            mapimg = emojis.gamemodes.taiko;
                            pp = new ppcalc.taiko_ppv2().setPerformance(score).setMods(fixedmods);
                            pp95 = new ppcalc.taiko_ppv2().setPerformance(score95).setMods(fixedmods);
                        }
                        if (mapmode == "fruits") {
                            mapimg = emojis.gamemodes.fruits;
                            pp = new ppcalc.catch_ppv2().setPerformance(score).setMods(fixedmods);
                            pp95 = new ppcalc.catch_ppv2().setPerformance(score95).setMods(fixedmods);
                        }
                        if (mapmode == "mania") {
                            mapimg = emojis.gamemodes.mania;
                            pp = new ppcalc.mania_ppv2().setPerformance(score).setMods(fixedmods);
                            pp95 = new ppcalc.mania_ppv2().setPerformance(score95).setMods(fixedmods);
                        }

                        try {
                            let ppComputed = await pp.compute();
                            let pp95Computed = await pp95.compute();

                            ppComputedString = (Math.abs(ppComputed.total)).toFixed(2)
                            pp95ComputedString = (Math.abs(pp95Computed.total)).toFixed(2)
                            ppissue = ''
                            fs.writeFileSync('./debugosu/mapppcalc.json', JSON.stringify(ppComputed, null, 2))
                            fs.writeFileSync('./debugosu/mapppcalc95.json', JSON.stringify(pp95Computed, null, 2))

                        } catch (error) {
                            ppComputedString = NaN
                            pp95ComputedString = NaN
                            ppissue = 'Error - pp calculator could not fetch beatmap'
                            fs.appendFileSync('commands.log', 'ERROR CALCULATING PERFORMANCE: ' + error)
                        }

                        let mapname = json.beatmapset.title
                        let mapnameuni = json.beatmapset.title_unicode
                        let a = json.beatmapset.artist
                        let auni = json.beatmapset.artist_unicode

                        if (mapname != mapnameuni) {
                            mapname = `${mapname} (${mapnameuni})`
                        }

                        if (a != auni) {
                            a = `${a} (${auni})`
                        }

                        if (mapmods == null || mapmods == '' || mapmods == 'NM') {
                            maptitle = `${a} - ${mapname} [${json.version}]`
                        }
                        else {
                            maptitle = `${a} - ${mapname} [${json.version}] + ${mapmods}`
                        }

                        let mapsetlink = json.beatmapset_id

                        let mapperurl = `https://osu.ppy.sh/api/v2/users/${mapperlink}/osu`;
                        fetch(mapperurl, {
                            headers: {
                                'Authorization': `Bearer ${access_token}`
                            }
                        })
                            .then(res => res.json())
                            .then(json2 => {
                                let mapperid = json2.id;
                                let Embed = new Discord.MessageEmbed()
                                    .setColor(0x91ff9a)
                                    .setTitle(maptitle)
                                    .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                    .setAuthor({ name: `${json.beatmapset.creator}`, url: `https://osu.ppy.sh/u/${mapperid}`, iconURL: `https://a.ppy.sh/${mapperid}` })
                                    .setThumbnail(`https://b.ppy.sh/thumb/${mapsetlink}l.jpg`)
                                    .addField(
                                        "**MAP DETAILS**",
                                        `${statusimg} | ${mapimg} \n` +
                                        `CS${cs} AR${ar} OD${od} HP${hp} \n` +
                                        `${json.difficulty_rating}⭐ | ${bpm}BPM⏱\n` +
                                        `${emojis.mapobjs.circle}${json.count_circles} | ${emojis.mapobjs.slider}${json.count_sliders} | ${emojis.mapobjs.spinner}${json.count_spinners} \n` +
                                        `${moddedlength}🕐`,
                                        true
                                    )
                                    .addField(
                                        "**PP**",
                                        `SS: ${ppComputedString}pp \n 95: ${pp95ComputedString}pp \n` +
                                        `${modissue}\n${ppissue}`,
                                        true
                                    )
                                    .addField(
                                        "**DOWNLOAD**",
                                        `[osu!](https://osu.ppy.sh/b/${mapid}) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.io/d/${mapsetlink})\n\n` +
                                        `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapid})`,
                                        true
                                    )
                                message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
                                fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)
                            })
                    })();

                })

        }
        //==============================================================================================================================================================================================
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - map (interaction)\n${currentDate} | ${currentDateISO}\n recieved get map command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            interaction.reply({ content: 'Fetching map info...', allowedMentions: { repliedUser: false } });
            let mapid = interaction.options.getInteger('id');
            let mapmods = interaction.options.getString('mods');
            if (mapid == null || mapid == '') {
                mapid = prevmap.id;
            }
            if (mapmods == null || mapmods == '') {
                mapmods = 'NM';
            }
            else {
                mapmods = osucalc.OrderMods(mapmods.toUpperCase());
            }
            //interaction.reply('Fetching map info...');

            fetch(`https://osu.ppy.sh/api/v2/beatmaps/${mapid}?`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            })
                .then(res => res.json())
                .then(json => {
                    fs.writeFileSync('debugosu/map.json', JSON.stringify(json, null, 2));

                    try {
                        let mapper = json.beatmapset.creator
                    } catch (error) {
                        interaction.reply({ content: 'Error - map not found', allowedMentions: { repliedUser: false } });
                        return;
                    }
                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: json.id }), null, 2));


                    let mapperlink = (`${json.beatmapset.creator}`).replaceAll(' ', '%20');
                    let maphitonly = json.hit_length
                    let maphitmins = Math.floor(maphitonly / 60)
                    let maphitseconds = Math.floor(maphitonly % 60)
                    if (maphitseconds < 10) {
                        maphitseconds = '0' + maphitseconds;
                    }
                    let maphitstr = `${maphitmins}:${maphitseconds}`
                    let mapstatus = (json.status)
                    if (mapstatus == "ranked") {
                        statusimg = emojis.rankedstatus.ranked;
                    }
                    if (mapstatus == "approved" || mapstatus == "qualified") {
                        statusimg = emojis.rankedstatus.approved;
                    }
                    if (mapstatus == "loved") {
                        statusimg = emojis.rankedstatus.loved;
                    }
                    if (mapstatus == "graveyard" || mapstatus == "pending") {
                        statusimg = emojis.rankedstatus.graveyard;
                    }
                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: mapid }), null, 2));

                    //CALCULATE MODS DETAILES

                    let cs = json.cs
                    let ar = json.ar
                    let od = json.accuracy
                    let hp = json.drain
                    let bpm = json.bpm

                    let moddedlength = maphitstr

                    if (((mapmods.includes('DT') || mapmods.includes('NC')) && mapmods.includes('HT') || (mapmods.includes('HR') && mapmods.includes('EZ')))) {
                        setTimeout(() => {
                            interaction.editReply({ content: `${mapmods} is an invalid mod combination`, allowedMentions: { repliedUser: false } })
                        }, 500)
                        return
                    }
                    //dt only
                    if (mapmods.includes('DT') || mapmods.includes('NC') && (!mapmods.includes('HR')) && (!mapmods.includes('EZ')) && (!mapmods.includes('HT'))) {
                        ar = (osucalc.DoubleTimeAR(ar)).ar
                        od = (osucalc.odDT(od)).od_num
                        bpm = (bpm * 1.5).toFixed(2)

                        maphitmins = Math.floor((maphitonly / 1.5) / 60)
                        maphitseconds = Math.floor((maphitonly / 1.5) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`

                    }
                    //ht only
                    if (mapmods.includes('HT') && (!mapmods.includes('DT')) && (!mapmods.includes('NC')) && (!mapmods.includes('HR')) && (!mapmods.includes('EZ'))) {
                        ar = osucalc.HalfTimeAR(ar).ar
                        od = osucalc.odHT(od).od_num
                        bpm = (bpm * 0.75).toFixed(2)

                        maphitmins = Math.floor((maphitonly / 0.75) / 60)
                        maphitseconds = Math.floor((maphitonly / 0.75) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`
                    }
                    //hr only
                    if (mapmods.includes('HR') && (!mapmods.includes('DT')) && (!mapmods.includes('NC')) && (!mapmods.includes('HT')) && (!mapmods.includes('EZ'))) {
                        let tohardrock = osucalc.toHR(cs, ar, od, hp)
                        cs = tohardrock.cs
                        ar = tohardrock.ar
                        od = tohardrock.od
                        hp = tohardrock.hp
                    }
                    //ez only
                    if (mapmods.includes('EZ') && (!mapmods.includes('DT')) && (!mapmods.includes('NC')) && (!mapmods.includes('HR')) && (!mapmods.includes('HT'))) {
                        let toeasy = osucalc.toEZ(cs, ar, od, hp)
                        cs = toeasy.cs
                        ar = toeasy.ar
                        od = toeasy.od
                        hp = toeasy.hp
                    }

                    //ezdt
                    if (mapmods.includes('EZ') && (mapmods.includes('DT') || !mapmods.includes('NC')) && (!mapmods.includes('HR')) && (!mapmods.includes('HT'))) {
                        let toeasy = osucalc.toEZ(cs, ar, od, hp)
                        cs = toeasy.cs
                        ar = osucalc.DoubleTimeAR(toeasy.ar).ar
                        od = osucalc.odDT(toeasy.od).od_num
                        hp = toeasy.hp
                        bpm = (bpm * 1.5).toFixed(2)
                        maphitmins = Math.floor((maphitonly / 1.5) / 60)
                        maphitseconds = Math.floor((maphitonly / 1.5) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`
                    }
                    //ezht

                    if (mapmods.includes('EZ') && mapmods.includes('HT') && !mapmods.includes('DT') && (!mapmods.includes('HR')) && (!mapmods.includes('NC'))) {
                        let toeasy = osucalc.toEZ(cs, ar, od, hp)
                        cs = toeasy.cs
                        ar = osucalc.HalfTimeAR(toeasy.ar).ar
                        od = osucalc.odHT(toeasy.od).od_num
                        hp = toeasy.hp
                        bpm = (bpm * 0.75).toFixed(2)
                        maphitmins = Math.floor((maphitonly / 0.75) / 60)
                        maphitseconds = Math.floor((maphitonly / 0.75) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`


                    }
                    //hrdt
                    if (mapmods.includes('HR') && (mapmods.includes('DT') || mapmods.includes('NC')) && !mapmods.includes('EZ') && (!mapmods.includes('HT'))) {
                        let tohardrock = osucalc.toHR(cs, ar, od, hp)
                        cs = tohardrock.cs
                        ar = osucalc.DoubleTimeAR(tohardrock.ar).ar
                        od = osucalc.odDT(tohardrock.od).od_num
                        hp = tohardrock.hp
                        bpm = (bpm * 1.5).toFixed(2)

                        maphitmins = Math.floor((maphitonly / 1.5) / 60)
                        maphitseconds = Math.floor((maphitonly / 1.5) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`
                    }

                    //hrht
                    if (mapmods.includes('HR') && mapmods.includes('HT') && !mapmods.includes('DT') && !mapmods.includes('EZ') && (!mapmods.includes('NC'))) {
                        let tohardrock = osucalc.toHR(cs, ar, od, hp)
                        cs = tohardrock.cs
                        ar = osucalc.HalfTimeAR(tohardrock.ar).ar
                        od = osucalc.odHT(tohardrock.od).od_num
                        hp = tohardrock.hp
                        bpm = (bpm * 0.75).toFixed(2)

                        maphitmins = Math.floor((maphitonly / 0.75) / 60)
                        maphitseconds = Math.floor((maphitonly / 0.75) % 60)
                        if (maphitseconds < 10) {
                            maphitseconds = '0' + maphitseconds;
                        }
                        moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`

                    }
                    ;

                    (async () => {
                        let score = {
                            beatmap_id: mapid,
                            score: "6795149",
                            maxcombo: json.max_combo,
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
                        //const score = scorew
                        let score95 = {
                            beatmap_id: mapid,
                            score: "6795149",
                            maxcombo: json.max_combo,
                            count50: "0",
                            //count100: "5281700",
                            //count300: "65140967",
                            count100: "810811 ",
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

                        let mapmode = json.mode
                        if (mapmode == "taiko") {
                            mapimg = emojis.gamemodes.taiko;
                            pp = new ppcalc.taiko_ppv2().setPerformance(score).setMods(fixedmods);
                            pp95 = new ppcalc.taiko_ppv2().setPerformance(score95).setMods(fixedmods);
                        }
                        if (mapmode == "fruits") {
                            mapimg = emojis.gamemodes.fruits;
                            pp = new ppcalc.catch_ppv2().setPerformance(score).setMods(fixedmods);
                            pp95 = new ppcalc.catch_ppv2().setPerformance(score95).setMods(fixedmods);
                        }
                        if (mapmode == "mania") {
                            mapimg = emojis.gamemodes.mania;
                            pp = new ppcalc.mania_ppv2().setPerformance(score).setMods(fixedmods);
                            pp95 = new ppcalc.mania_ppv2().setPerformance(score95).setMods(fixedmods);
                        }

                        try {
                            let ppComputed = await pp.compute();
                            let pp95Computed = await pp95.compute();

                            ppComputedString = (Math.abs(ppComputed.total)).toFixed(2)
                            pp95ComputedString = (Math.abs(pp95Computed.total)).toFixed(2)
                            ppissue = ''
                            fs.writeFileSync('./debugosu/mapppcalc.json', JSON.stringify(ppComputed, null, 2))
                            fs.writeFileSync('./debugosu/mapppcalc95.json', JSON.stringify(pp95Computed, null, 2))
                        } catch (error) {
                            ppComputedString = NaN
                            pp95ComputedString = NaN
                            ppissue = 'Error - pp calculator could not fetch beatmap'
                            fs.appendFileSync('commands.log', 'ERROR CALCULATING PERFORMANCE: ' + error)
                        }

                        let mapname = json.beatmapset.title
                        let mapnameuni = json.beatmapset.title_unicode
                        let a = json.beatmapset.artist
                        let auni = json.beatmapset.artist_unicode

                        if (mapname != mapnameuni) {
                            mapname = `${mapname} (${mapnameuni})`
                        }

                        if (a != auni) {
                            a = `${a} (${auni})`
                        }

                        if (mapmods == null || mapmods == '' || mapmods == 'NM') {
                            maptitle = `${a} - ${mapname} [${json.version}]`
                        }
                        else {
                            maptitle = `${a} - ${mapname} [${json.version}] + ${mapmods}`
                        }

                        let mapsetlink = json.beatmapset_id

                        let mapperurl = `https://osu.ppy.sh/api/v2/users/${mapperlink}/osu`;
                        fetch(mapperurl, {
                            headers: {
                                'Authorization': `Bearer ${access_token}`
                            }
                        })
                            .then(res => res.json())
                            .then(json2 => {
                                let mapperid = json2.id;
                                let Embed = new Discord.MessageEmbed()
                                    .setColor(0x91ff9a)
                                    .setTitle(maptitle)
                                    .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                    .setAuthor({ name: `${json.beatmapset.creator}`, url: `https://osu.ppy.sh/u/${mapperid}`, iconURL: `https://a.ppy.sh/${mapperid}` })
                                    .setThumbnail(`https://b.ppy.sh/thumb/${mapsetlink}l.jpg`)
                                    .addField(
                                        "**MAP DETAILS**",
                                        `${statusimg} | ${mapimg} \n` +
                                        `CS${cs} AR${ar} OD${od} HP${hp} \n` +
                                        `${json.difficulty_rating}⭐ | ${bpm}BPM⏱\n` +
                                        `${emojis.mapobjs.circle}${json.count_circles} | ${emojis.mapobjs.slider}${json.count_sliders} | ${emojis.mapobjs.spinner}${json.count_spinners} \n` +
                                        `${moddedlength}🕐`,
                                        true
                                    )
                                    .addField(
                                        "**PP**",
                                        `SS: ${ppComputedString}pp \n 95: ${pp95ComputedString}pp \n` +
                                        `${modissue}\n${ppissue}`,
                                        true
                                    )
                                    .addField(
                                        "**DOWNLOAD**",
                                        `[osu!](https://osu.ppy.sh/b/${mapid}) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.io/d/${mapsetlink})\n\n` +
                                        `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapid})`,
                                        true
                                    )
                                interaction.editReply({ content: "⠀", embeds: [Embed], allowedMentions: { repliedUser: false } });
                                fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                fs.appendFileSync('commands.log', `\nCommand Information\nmap id: ${mapid}\nmap mods: ${mapmods}\nmode: ${mapmode}`)
                            })
                    })();

                })
        }
    }
}