const fs = require('fs')
const fetch = require('node-fetch')
const { access_token } = require('../configs/osuauth.json')
const ppcalc = require('booba')
const osucalc = require('osumodcalculator')
const emojis = require('../configs/emojis.js')


module.exports = {
    name: 'osumaplink',
    description: 'osumaplink',
    execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO) {

        let messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')
        //let mods = message.content.split('+')[1]

        if (
            (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmapsets/') && messagenohttp.includes('#'))) ||
            (!messagenohttp.includes('/s/') && (messagenohttp.includes('/b/'))) ||
            (!messagenohttp.includes('/s/') && (messagenohttp.includes('/beatmaps/')))
        ) {
            if (message.content.split('+')[1]) {
                mapmods = message.content.split('+')[1]
            } else {
                mapmods = 'NM'
            }
            try {
                if (messagenohttp.includes('beatmapsets')) {

                    idfirst = messagenohttp.split('#')[1].split('/')[1]
                }
                else {
                    //make a variable that takes everything after the last '/'
                    idfirst = messagenohttp.split('/')[messagenohttp.split('/').length - 1]
                }
                if (isNaN(idfirst)) {
                    id = idfirst.split(' ')[0]
                } else {
                    id = idfirst
                }

            } catch (error) {
                console.log(error)
                return message.reply({ content: 'Please enter a valid beatmap link.', allowedMentions: { repliedUser: false } })
            }
            fs.appendFileSync('link.log', `LINK DETECT EVENT - osumaplink\n${currentDate} ${currentDateISO}\n${message.author.username}#${message.author.discriminator} (${message.author.id}) used osu!map link: ${message.content}\n`, 'utf-8')

            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${id}`
            fetch(mapurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json()).then(json => {
                try {
                    let mapper = json.beatmapset.creator
                } catch (error) {
                    message.reply({ content: 'Error - map not found', allowedMentions: { repliedUser: false } });
                    return;
                }
                fs.writeFileSync('debugosu/map.json', JSON.stringify(json, null, 2));
                fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: json.id }), null, 2));

                let mapperlink = (`${json.beatmapset.creator}`).replaceAll(' ', '%20');
                let maphitonly = json.hit_length
                let maphitmins = Math.floor(maphitonly / 60)
                let maphitseconds = Math.floor(maphitonly % 60)
                if (maphitseconds < 10) {
                    let maphitseconds = '0' + maphitseconds;
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
                fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: id }), null, 2));

                //CALCULATE MODS DETAILES

                let cs = json.cs
                let ar = json.ar
                let od = json.accuracy
                let hp = json.drain
                let bpm = json.bpm

                let moddedlength = maphitstr

                if (((mapmods.includes('DT') || mapmods.includes('NC')) && mapmods.includes('HT') || (mapmods.includes('HR') && mapmods.includes('EZ')))) {
                    setTimeout(() => {
                        message.reply({ content: "invalid mods!", allowedMentions: { repliedUser: false } })
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
                        let maphitseconds = '0' + maphitseconds;
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
                        let maphitseconds = '0' + maphitseconds;
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
                        let maphitseconds = '0' + maphitseconds;
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
                        let maphitseconds = '0' + maphitseconds;
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
                        let maphitseconds = '0' + maphitseconds;
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
                        let maphitseconds = '0' + maphitseconds;
                    }
                    moddedlength = `${maphitmins}:${maphitseconds} (${maphitstr})`

                }
                ;

                (async () => {
                    let score = {
                        beatmap_id: id,
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
                        beatmap_id: id,
                        score: "6795149",
                        maxcombo: json.max_combo,
                        count50: "0",
                        count100: "266",
                        count300: "3740",
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
                    } catch (error) {
                        ppComputed = NaN
                        ppComputedString = NaN
                        ppissue = 'Error - pp calculator could not fetch beatmap'
                        fs.appendFileSync('link.log', 'ERROR CALCULATING PERFORMANCE: ' + error)
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
                                .setURL(`https://osu.ppy.sh/b/${id}`)
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
                                    `${modissue}`,
                                    true
                                )
                                .addField(
                                    "**DOWNLOAD**",
                                    `[osu!](https://osu.ppy.sh/b/${id}) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.io/d/${mapsetlink})\n\n` +
                                    `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${id})`,
                                    true
                                )
                            //console.log('true')
                            message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });
                            fs.appendFileSync('link.log', '\nsuccess\n\n', 'utf-8')
                        })
                })();

            })
        }

        //==============================================================================================================================================================================================



        else {
            let setid = 910392;
            if (!messagenohttp.includes('/beatmapsets/')) {
                setid = messagenohttp.split('/s/')[1]

                if (isNaN(setid)) {
                    setid = messagenohttp.split('/s/')[1].split(' ')[0]
                }
            }
            if (messagenohttp.includes('/beatmapsets/')) {
                setid = messagenohttp.split('/beatmapsets/')[1]
                if (isNaN(setid)) {
                    setid = messagenohttp.split('/beatmapsets/')[1].split(' ')[0]
                }
            }

            let lookupurl = `https://osu.ppy.sh/api/v2/beatmapsets/${setid}`;
            fetch(lookupurl, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(setdata => {
                    fs.writeFileSync('debugosu/setdata.json', JSON.stringify(setdata, null, 2))
                    let bid = setdata.beatmaps[0].beatmap_id;

                    let mapstatus = (setdata.status)
                    if (mapstatus == "ranked") {
                        statusimg = "<:statusranked:944512775579926609>";
                    }
                    if (mapstatus == "approved" || mapstatus == "qualified") {
                        statusimg = "<:statusapproved:944512764913811467>";
                    }
                    if (mapstatus == "loved") {
                        statusimg = "<:statusloved:944512775810588733>";
                    }
                    if (mapstatus == "graveyard" || mapstatus == "pending") {
                        statusimg = "<:statusgraveyard:944512765282897940>";
                    }
                    let mapimg = "<:modeosu:944181096868884481>";

                    let mapperid = setdata.user_id;

                    let title = setdata.title;
                    let titleuni = setdata.title_unicode;
                    let artist = setdata.artist;
                    let artistuni = setdata.artist_unicode;

                    if (title != titleuni) {
                        title = `${title} (${titleuni})`
                    }
                    if (artist != artistuni) {
                        artist = `${artist} (${artistuni})`
                    }


                    let Embed = new Discord.MessageEmbed()
                        .setColor(0x91ff9a)
                        .setTitle(title)
                        .setURL(`https://osu.ppy.sh/s/${setid}`)
                        .setThumbnail(`https://b.ppy.sh/thumb/${setid}l.jpg`)
                        .setDescription(`
                    **MAP DETAILS**
                    ${statusimg}
                    ${setdata.bpm}BPM ${setdata.favourite_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}❤ ${setdata.play_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} plays
                    `)

                        .setAuthor({ name: `${setdata.creator}`, url: `https://osu.ppy.sh/u/${mapperid}`, iconURL: `https://a.ppy.sh/${mapperid}` })

                    let beatmaps = setdata.beatmaps.sort((a, b) => a.difficulty_rating - b.difficulty_rating);

                    for (i = 0; i < setdata.beatmaps.length; i++) {
                        let curbm = beatmaps[i];
                        let mapmode = curbm.mode
                        if (mapmode == "taiko") {
                            mapimg = "<:modetaiko:944181097053442068>";
                        }
                        if (mapmode == "fruits") {
                            mapimg = "<:modefruits:944181096206176326>";
                        }
                        if (mapmode == "mania") {
                            mapimg = "<:modemania:944181095874834453>";
                        }
                        //seconds to time
                        let length = curbm.total_length;
                        let minutes = Math.floor(length / 60);
                        let seconds = length % 60;
                        if (seconds < 10) {
                            seconds = `0${seconds}`
                        }
                        let moddedlength = `${minutes}:${seconds}`
                        Embed.addField(`${curbm.version}`,
                            `${mapimg} | ${curbm.difficulty_rating}⭐ \n` +
                            `CS${curbm.cs} AR${curbm.ar} OD${curbm.accuracy} HP${curbm.drain} \n` +
                            `${moddedlength}🕐 ${curbm.bpm}BPM⏱ | ${emojis.mapobjs.circle}${curbm.count_circles} ${emojis.mapobjs.slider}${curbm.count_sliders} ${emojis.mapobjs.spinner}${curbm.count_spinners}`,
                            false)
                    }
                    message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false } });

                    fs.writeFileSync('./configs/prevmap.json', JSON.stringify(({ id: setdata.beatmaps[setdata.beatmaps.length - 1].id }), null, 2));


                }
                )
        }
    }
}