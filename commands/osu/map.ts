import fs = require('fs');
import osucalc = require('osumodcalculator');
import fetch from 'node-fetch'
import ppcalc = require('booba')
import emojis = require('../../configs/emojis')
import cmdchecks = require('../../configs/commandchecks')

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
        //check if file debugosu/prevmap.json exists
        let prevmap;
        let i;
        let accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
        let access_token = JSON.parse(accessN).access_token;

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
                if (fs.existsSync(`./debugosu/prevmap${message.guildId}.json`)) {
                    try {
                        prevmap = JSON.parse(fs.readFileSync(`./debugosu/prevmap${message.guildId}.json`, 'utf8'));
                    } catch {
                        console.log(`no prevmap.json id found for server ${message.guildId}\nCreating default file...`)
                        fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                        prevmap = { id: 32345 }
                    }
                } else {
                    console.log(`no prevmap.json file for server ${message.guildId}\nCreating default file...`)
                    fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                    prevmap = { id: 32345 }
                }
                mapid = prevmap.id;
            }
            if (mapmods == null || mapmods == '') {
                mapmods = 'NM';
            }
            else {
                mapmods = osucalc.OrderMods(mapmods.toUpperCase());
            }
            //let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${mapid}?`
            let maptitle;
            let mapnameurl;
            if (args.join(' ').includes('"')) {
                maptitle = args.join(' ').split('"')[1]//.join('')//.replaceAll(',', '')
                mapnameurl = `https://osu.ppy.sh/api/v2/beatmapsets/search?q=${cmdchecks.toHexadecimal(maptitle)}&s=any`
                fetch(mapnameurl, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                }).then(res => res.json() as any)
                    .then(mapidtest => {
                        fs.appendFileSync('commands.log', `\nfetched title - ${maptitle}`)
                        fs.writeFileSync('debugosu/command-map=txt.json', JSON.stringify(mapidtest, null, 2))
                        let sortbyhigh;
                        try{
                            if(mapidtest.authentication){
                                let ifid = 'oauth token is invalid. Token will be refreshed automatically in one minute.'
                                message.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false }, failIfNotExists: true });
                                return;
                            }
                        } catch (error) {

                        }

                        try {
                            sortbyhigh = (mapidtest as any).beatmapsets[0].beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)
                            mapid = (mapidtest as any).beatmapsets[0].beatmaps[0].id
                            //message.channel.send("Information for \"" + maptitle + '"')
                        } catch (error) {
                            console.log(error)
                            message.reply({ content: "No maps found for the parameters: \"" + maptitle + '"', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                            return;
                        }
                        let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}`


                        fetch(mapurl, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            }
                        })
                            .then(res => res.json() as any)
                            .then((json) => {
                                fs.writeFileSync('debugosu/command-map.json', JSON.stringify(json, null, 2));

                                try {
                                    let mapper = json.beatmapset.creator
                                } catch (error) {
                                    let ifid = ''
                                    if (!isNaN(mapid)) {
                                        ifid = `Found map id = ${mapid}`
                                    }
                                try{
                                    let au = json.authentication
                                    if(au == "basic"){
                                        ifid = 'oauth token is invalid. Token will be refreshed automatically in one minute.'
                                    }
                                } catch (error) {

                                }

                                    message.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false }, failIfNotExists: true });
                                    return;
                                }
                                fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: json.id }), null, 2));
                                mapid = json.id




                                let mapperlink = (`${json.beatmapset.creator}`).replaceAll(' ', '%20');
                                let maphitonly = json.hit_length
                                let maphitmins = Math.floor(maphitonly / 60)
                                let maphitseconds: any = Math.floor(maphitonly % 60)
                                if (maphitseconds < 10) {
                                    maphitseconds = '0' + maphitseconds;
                                }
                                let maphitstr = `${maphitmins}:${maphitseconds}`
                                let mapstatus = (json.status)
                                let statusimg: string;
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
                                fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: mapid }), null, 2));

                                //CALCULATE MODS DETAILES
                                let iftherearemodsasint = JSON.stringify({
                                    "ruleset": json.mode
                                });
                                if (mapmods != 'NM') {
                                    iftherearemodsasint =
                                        JSON.stringify({
                                            "ruleset": json.mode,
                                            "mods": osucalc.ModStringToInt(mapmods)
                                        })
                                }
                                let beatattrurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}/attributes`;
                                fetch(beatattrurl, {
                                    method: 'POST',
                                    headers: {
                                        Authorization: `Bearer ${access_token}`,
                                        "Content-Type": "application/json",
                                        Accept: "application/json"
                                    },
                                    body: iftherearemodsasint,

                                }).then(res => res.json() as any)
                                    .then(mapattrdata => {
                                        let totaldiff = mapattrdata.attributes
                                        if (totaldiff == null || totaldiff == undefined || totaldiff == NaN) {
                                            totaldiff = json.difficulty_rating;
                                        } else {
                                            totaldiff = mapattrdata.attributes.star_rating.toFixed(2);
                                        }
                                        fs.writeFileSync('debugosu/command-map=attr_data.json', JSON.stringify(mapattrdata, null, 2));

                                        let cs = json.cs
                                        let ar = json.ar
                                        let od = json.accuracy
                                        let hp = json.drain
                                        let bpm = json.bpm

                                        let moddedlength = maphitstr

                                        if (((mapmods.includes('DT') || mapmods.includes('NC')) && mapmods.includes('HT') || (mapmods.includes('HR') && mapmods.includes('EZ')))) {
                                            message.reply({ content: `${mapmods} is an invalid mod combination`, allowedMentions: { repliedUser: false }, failIfNotExists: true })

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
                                            let ppComputedString: any;
                                            let pp95ComputedString: any;
                                            let ppissue: string;
                                            try {
                                                let ppComputed = await pp.compute();
                                                let pp95Computed = await pp95.compute();

                                                ppComputedString = (Math.abs(ppComputed.total)).toFixed(2)
                                                pp95ComputedString = (Math.abs(pp95Computed.total)).toFixed(2)
                                                ppissue = ''
                                                fs.writeFileSync('./debugosu/command-map=pp_calc.json', JSON.stringify(ppComputed, null, 2))
                                                fs.writeFileSync('./debugosu/command-map=pp_calc_95.json', JSON.stringify(pp95Computed, null, 2))


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

                                            let mapperurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(mapperlink)}/osu`;
                                            fetch(mapperurl, {
                                                headers: {
                                                    'Authorization': `Bearer ${access_token}`
                                                }
                                            })
                                                .then(res => res.json() as any)
                                                .then(json2 => {
                                                    let mapperid = json2.id;
                                                    let Embed = new Discord.EmbedBuilder()
                                                        .setColor(0x91ff9a)
                                                        .setTitle(maptitle)
                                                        .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                                        .setAuthor({ name: `${json.beatmapset.creator}`, url: `https://osu.ppy.sh/u/${mapperid}`, iconURL: `https://a.ppy.sh/${mapperid}` })
                                                        .setThumbnail(`https://b.ppy.sh/thumb/${mapsetlink}l.jpg`)
                                                        .addFields([
                                                            {
                                                                name: "**MAP DETAILS**",
                                                                value:
                                                                    `${statusimg} | ${mapimg} \n` +
                                                                    `CS${cs} AR${ar} OD${od} HP${hp} \n` +
                                                                    `${totaldiff}⭐ | ${bpm}BPM⏱\n` +
                                                                    `${emojis.mapobjs.circle}${json.count_circles} | ${emojis.mapobjs.slider}${json.count_sliders} | ${emojis.mapobjs.spinner}${json.count_spinners}\n` +
                                                                    `${moddedlength}🕐`,
                                                                inline: true
                                                            },
                                                            {
                                                                name: "**PP**",
                                                                value:
                                                                    `SS: ${ppComputedString}pp \n 95: ${pp95ComputedString}pp \n` +
                                                                    `${modissue}\n${ppissue}`,
                                                                inline: true
                                                            },
                                                            {
                                                                name: "**DOWNLOAD**",
                                                                value:
                                                                    `[osu!](https://osu.ppy.sh/b/${mapid}) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.io/d/${mapsetlink})\n\n` +
                                                                    `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapid})`,
                                                                inline: true
                                                            }
                                                        ])
                                                    message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false }, failIfNotExists: true });
                                                    fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                                    let endofcommand = new Date().getTime();
                                                    let timeelapsed = endofcommand - currentDate.getTime();
                                                    fs.appendFileSync('commands.log', `\nCommand Latency (message command => map) - ${timeelapsed}ms\n`)
                                                })
                                        })();
                                    })
                            })

                    })
                return;
            }

            //==============================================================================================================================================================================================

            let mapurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}`

            fetch(mapurl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            })
                .then(res => res.json() as any)
                .then(json => {
                    fs.writeFileSync('debugosu/command-map.json', JSON.stringify(json, null, 2));

                    try {
                        let mapper = json.beatmapset.creator
                    } catch (error) {
                        let ifid = ''
                        if (!isNaN(mapid)) {
                            ifid = `Found map id = ${mapid}`
                        }
                        try{
                            if(json.authentication){
                                let ifid = 'oauth token is invalid. Token will be refreshed automatically in one minute.'
                                message.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false }, failIfNotExists: true });
                                return;
                            }
                        } catch (error) {

                        }
                        message.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false }, failIfNotExists: true });
                        return;
                    }
                    fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: json.id }), null, 2));
                    mapid = json.id


                    let mapperlink = (`${json.beatmapset.creator}`).replaceAll(' ', '%20');
                    let maphitonly = json.hit_length
                    let maphitmins = Math.floor(maphitonly / 60)
                    let maphitseconds: any = Math.floor(maphitonly % 60)
                    if (maphitseconds < 10) {
                        maphitseconds = '0' + maphitseconds;
                    }
                    let maphitstr = `${maphitmins}:${maphitseconds}`
                    let mapstatus = (json.status)
                    let statusimg: string;
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
                    fs.writeFileSync(`./debugosu/prevmap${message.guildId}.json`, JSON.stringify(({ id: mapid }), null, 2));

                    //CALCULATE MODS DETAILES
                    let iftherearemodsasint = JSON.stringify({
                        "ruleset": json.mode
                    });
                    if (mapmods != 'NM') {
                        iftherearemodsasint =
                            JSON.stringify({
                                "ruleset": json.mode,
                                "mods": osucalc.ModStringToInt(mapmods)
                            })
                    }
                    let beatattrurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}/attributes`;
                    fetch(beatattrurl, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        },
                        body: iftherearemodsasint,

                    }).then(res => res.json() as any)
                        .then(mapattrdata => {
                            let totaldiff = mapattrdata.attributes
                            if (totaldiff == null || totaldiff == undefined || totaldiff == NaN) {
                                totaldiff = json.difficulty_rating;
                            } else {
                                totaldiff = mapattrdata.attributes.star_rating.toFixed(2);
                            }
                            fs.writeFileSync('debugosu/command-map=attr_data.json', JSON.stringify(mapattrdata, null, 2));

                            let cs = json.cs
                            let ar = json.ar
                            let od = json.accuracy
                            let hp = json.drain
                            let bpm = json.bpm

                            let moddedlength = maphitstr

                            if (((mapmods.includes('DT') || mapmods.includes('NC')) && mapmods.includes('HT') || (mapmods.includes('HR') && mapmods.includes('EZ')))) {
                                setTimeout(() => {
                                    message.reply({ content: `${mapmods} is an invalid combination`, allowedMentions: { repliedUser: false }, failIfNotExists: true })
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
                                let ppComputedString: any;
                                let pp95ComputedString: any;
                                let ppissue: string;
                                try {
                                    let ppComputed = await pp.compute();
                                    let pp95Computed = await pp95.compute();

                                    ppComputedString = (Math.abs(ppComputed.total)).toFixed(2)
                                    pp95ComputedString = (Math.abs(pp95Computed.total)).toFixed(2)
                                    ppissue = ''
                                    fs.writeFileSync('./debugosu/command-map=pp_calc.json', JSON.stringify(ppComputed, null, 2))
                                    fs.writeFileSync('./debugosu/command-map=pp_calc_95.json', JSON.stringify(pp95Computed, null, 2))

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

                                let mapperurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(mapperlink)}/osu`;
                                fetch(mapperurl, {
                                    headers: {
                                        'Authorization': `Bearer ${access_token}`
                                    }
                                })
                                    .then(res => res.json() as any)
                                    .then(json2 => {
                                        let mapperid = json2.id;
                                        let Embed = new Discord.EmbedBuilder()
                                            .setColor(0x91ff9a)
                                            .setTitle(maptitle)
                                            .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                            .setAuthor({ name: `${json.beatmapset.creator}`, url: `https://osu.ppy.sh/u/${mapperid}`, iconURL: `https://a.ppy.sh/${mapperid}` })
                                            .setThumbnail(`https://b.ppy.sh/thumb/${mapsetlink}l.jpg`)
                                            .addFields([
                                                {
                                                    name: "**MAP DETAILS**",
                                                    value:
                                                        `${statusimg} | ${mapimg} \n` +
                                                        `CS${cs} AR${ar} OD${od} HP${hp} \n` +
                                                        `${json.difficulty_rating}⭐ | ${bpm}BPM⏱\n` +
                                                        `${emojis.mapobjs.circle}${json.count_circles} | ${emojis.mapobjs.slider}${json.count_sliders} | ${emojis.mapobjs.spinner}${json.count_spinners}\n` +
                                                        `${moddedlength}🕐`,
                                                    inline: true
                                                },
                                                {
                                                    name: "**PP**",
                                                    value:
                                                        `SS: ${ppComputedString}pp \n 95: ${pp95ComputedString}pp \n` +
                                                        `${modissue}\n${ppissue}`,
                                                    inline: true
                                                },
                                                {
                                                    name: "**DOWNLOAD**",
                                                    value:
                                                        `[osu!](https://osu.ppy.sh/b/${mapid}) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.io/d/${mapsetlink})\n\n` +
                                                        `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapid})`,
                                                    inline: true
                                                }
                                            ])
                                        message.reply({ embeds: [Embed], allowedMentions: { repliedUser: false }, failIfNotExists: true });
                                        fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
                                        fs.appendFileSync('commands.log', `\nCommand Information\nmessage content: ${message.content}`)
                                        let endofcommand = new Date().getTime();
                                        let timeelapsed = endofcommand - currentDate.getTime();
                                        fs.appendFileSync('commands.log', `\nCommand Latency (message command => map) - ${timeelapsed}ms\n`)
                                    })
                            })();
                        })
                })

        }
        //==============================================================================================================================================================================================
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - map (interaction)\n${currentDate} | ${currentDateISO}\n recieved get map command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            fs.appendFileSync('commands.log', `\nInteraction ID: ${interaction.id}`)
            fs.appendFileSync('commands.log',
                `\noptions:
            id: ${interaction.options.getInteger('id')}
            mods: ${interaction.options.getString('mods')}
            detailed: ${interaction.options.getBoolean('detailed')}
            `
            )

            interaction.reply({ content: 'Fetching map info...', allowedMentions: { repliedUser: false } });
            let mapid = interaction.options.getInteger('id');
            let mapmods = interaction.options.getString('mods');
            if (mapid == null || mapid == '') {
                if (fs.existsSync(`./debugosu/prevmap${interaction.guildId}.json`)) {
                    try {
                        prevmap = JSON.parse(fs.readFileSync(`./debugosu/prevmap${interaction.guildId}.json`, 'utf8'));
                    } catch {
                        console.log(`no prevmap.json id found for server ${interaction.guildId}\nCreating default file...`)
                        fs.writeFileSync(`./debugosu/prevmap${interaction.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                        prevmap = { id: 32345 }
                    }
                } else {
                    console.log(`no prevmap.json file for server ${interaction.guildId}\nCreating default file...`)
                    fs.writeFileSync(`./debugosu/prevmap${interaction.guildId}.json`, JSON.stringify(({ id: 32345 }), null, 2));
                    prevmap = { id: 32345 }
                }
                mapid = prevmap.id;
            }
            if (mapmods == null || mapmods == '') {
                mapmods = 'NM';
            }
            else {
                mapmods = osucalc.OrderMods(mapmods.toUpperCase());
            }
            //interaction.reply('Fetching map info...');
            fs.appendFileSync('commands.log',
                `\noptions(2):
            id: ${mapid}
            mods: ${mapmods}
            detailed: <N/A>
            `)
            fetch(`https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}?`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            })
                .then(res => res.json() as any)
                .then(json => {
                    fs.writeFileSync('debugosu/command-map.json', JSON.stringify(json, null, 2));

                    try {
                        let mapper = json.beatmapset.creator
                    } catch (error) {
                        try{
                            if(json.authentication){
                                let ifid = 'oauth token is invalid. Token will be refreshed automatically in one minute.'
                                interaction.reply({ content: 'Error - map not found\n' + ifid, allowedMentions: { repliedUser: false }, failIfNotExists: true });
                                return;
                            }
                        } catch (error) {

                        }
                        interaction.reply({ content: 'Error - map not found', allowedMentions: { repliedUser: false } });
                        return;
                    }
                    fs.writeFileSync(`./debugosu/prevmap${interaction.guildId}.json`, JSON.stringify(({ id: json.id }), null, 2));


                    let mapperlink = (`${json.beatmapset.creator}`).replaceAll(' ', '%20');
                    let maphitonly = json.hit_length
                    let maphitmins = Math.floor(maphitonly / 60)
                    let maphitseconds: any = Math.floor(maphitonly % 60)

                    if (maphitseconds < 10) {
                        maphitseconds = '0' + maphitseconds;
                    }
                    let maphitstr = `${maphitmins}:${maphitseconds}`
                    let mapstatus = (json.status)
                    let statusimg: string;
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
                    fs.writeFileSync(`./debugosu/prevmap${interaction.guildId}.json`, JSON.stringify(({ id: mapid }), null, 2));

                    //CALCULATE MODS DETAILS
                    let iftherearemodsasint = JSON.stringify({
                        "ruleset": json.mode
                    });
                    if (mapmods != 'NM') {
                        iftherearemodsasint =
                            JSON.stringify({
                                "ruleset": json.mode,
                                "mods": osucalc.ModStringToInt(mapmods)
                            })
                    }
                    let beatattrurl = `https://osu.ppy.sh/api/v2/beatmaps/${cmdchecks.toHexadecimal(mapid)}/attributes`;
                    fetch(beatattrurl, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        },
                        body: iftherearemodsasint,

                    }).then(res => res.json() as any)
                        .then(mapattrdata => {
                            let totaldiff = mapattrdata.attributes
                            if (totaldiff == null || totaldiff == undefined || totaldiff == NaN) {
                                totaldiff = json.difficulty_rating;
                            } else {
                                totaldiff = mapattrdata.attributes.star_rating.toFixed(2);
                            }
                            /*                             switch(json.mode){
                                                            case "osu":
                                                                totaldiff = mapattrdata.star_rating
                                                                break;
                                                            case "taiko":
                            
                                                                break;
                                                            case "fruits":
                                                                break;
                                                            case "mania":
                                                                break;
                                                        } */

                            fs.writeFileSync('debugosu/command-map=attr_data.json', JSON.stringify(mapattrdata, null, 2));

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
                            if (interaction.options.getBoolean("detailed") == true) {
                                cs += ` (${osucalc.csToRadius(cs).toFixed(2)}r)\n`
                                ar += ` (${osucalc.ARtoms(ar)}ms)\n`
                                od += ` \n**300**:${osucalc.ODtoms(od).range300.toFixed(2)}ms\n**100**:${osucalc.ODtoms(od).range100.toFixed(2)}ms\n**50**:${osucalc.ODtoms(od).range50.toFixed(2)}ms\n`
                            }
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
                                let ppComputedString: any;
                                let pp95ComputedString: any;
                                let ppissue: string;
                                try {
                                    let ppComputed = await pp.compute();
                                    let pp95Computed = await pp95.compute();

                                    ppComputedString = (Math.abs(ppComputed.total)).toFixed(2) + "pp"
                                    pp95ComputedString = (Math.abs(pp95Computed.total)).toFixed(2) + "pp"
                                    ppissue = ''
                                    fs.writeFileSync('./debugosu/command-map=pp_calc.json', JSON.stringify(ppComputed, null, 2))
                                    fs.writeFileSync('./debugosu/command-map=pp_calc_95.json', JSON.stringify(pp95Computed, null, 2))
                                    if (interaction.options.getBoolean("detailed") == true) {
                                        ppComputedString += ` \naim: ${ppComputed.aim.toFixed(2)}pp, \nspeed: ${ppComputed.speed.toFixed(2)}pp, \nacc: ${ppComputed.acc.toFixed(2)}pp\n`
                                        pp95ComputedString += ` \naim: ${pp95Computed.aim.toFixed(2)}pp, \nspeed: ${pp95Computed.speed.toFixed(2)}pp, \nacc: ${pp95Computed.acc.toFixed(2)}pp\n`
                                    }
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
                                let maptitle: string;
                                if (mapmods == null || mapmods == '' || mapmods == 'NM') {
                                    maptitle = `${a} - ${mapname} [${json.version}]`
                                }
                                else {
                                    maptitle = `${a} - ${mapname} [${json.version}] + ${mapmods}`
                                }

                                let mapsetlink = json.beatmapset_id

                                let mapperurl = `https://osu.ppy.sh/api/v2/users/${cmdchecks.toHexadecimal(mapperlink)}/osu`;
                                fetch(mapperurl, {
                                    headers: {
                                        'Authorization': `Bearer ${access_token}`
                                    }
                                })
                                    .then(res => res.json() as any)
                                    .then(json2 => {
                                        let mapperid = json2.id;
                                        let Embed = new Discord.EmbedBuilder()
                                            .setColor(0x91ff9a)
                                            .setTitle(maptitle)
                                            .setURL(`https://osu.ppy.sh/b/${mapid}`)
                                            .setAuthor({ name: `${json.beatmapset.creator}`, url: `https://osu.ppy.sh/u/${mapperid}`, iconURL: `https://a.ppy.sh/${mapperid}` })
                                            .setThumbnail(`https://b.ppy.sh/thumb/${mapsetlink}l.jpg`)
                                            .addFields([
                                                {
                                                    name: "**MAP DETAILS**",
                                                    value:
                                                        `${statusimg} | ${mapimg} \n` +
                                                        `CS${cs} AR${ar} OD${od} HP${hp} \n` +
                                                        `${totaldiff}⭐ | ${bpm}BPM⏱\n` +
                                                        `${emojis.mapobjs.circle}${json.count_circles} | ${emojis.mapobjs.slider}${json.count_sliders} | ${emojis.mapobjs.spinner}${json.count_spinners}\n` +
                                                        `${moddedlength}🕐`,
                                                    inline: true
                                                },
                                                {
                                                    name: "**PP**",
                                                    value:
                                                        `SS: ${ppComputedString} \n 95: ${pp95ComputedString} \n` +
                                                        `${modissue}\n${ppissue}`,
                                                    inline: true
                                                },
                                                {
                                                    name: "**DOWNLOAD**",
                                                    value:
                                                        `[osu!](https://osu.ppy.sh/b/${mapid}) | [Chimu](https://api.chimu.moe/v1/download/${mapsetlink}) | [Beatconnect](https://beatconnect.io/b/${mapsetlink}) | [Kitsu](https://kitsu.io/d/${mapsetlink})\n\n` +
                                                        `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapid})`,
                                                    inline: true
                                                }
                                            ])
                                        interaction.editReply({ content: "⠀", embeds: [Embed], allowedMentions: { repliedUser: false } });
                                        fs.appendFileSync('commands.log', `\nsuccess - Interaction ID: ${interaction.id}\n\n`, 'utf-8')
                                        fs.appendFileSync('commands.log', `\nCommand Information\nmap id: ${mapid}\nmap mods: ${mapmods}\nmode: ${mapmode}`)
                                        let endofcommand = new Date().getTime();
                                        let timeelapsed = endofcommand - currentDate.getTime();
                                        fs.appendFileSync('commands.log', `\nCommand Latency (interaction command => map) - ${timeelapsed}ms\n`)
                                    })
                            })();
                        })
                })
        }
    }
}