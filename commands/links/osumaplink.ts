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
    name: 'osumaplink',
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
        if (button != null) {
            fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                `
----------------------------------------------------
LINK PARSE EVENT - map link (button)
${currentDate} | ${currentDateISO}
recieved map link
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
button: ${button}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-osumaplink-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
            /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-osumaplink-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
            /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-map')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-osumaplink-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
            /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-osumaplink-${interaction.user.id}`)
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
                .catch(err => {
                    console.log(err);
                    return interaction.channel.send('An error occured while fetching the beatmap data.');
                })

            fs.writeFileSync(`debugosu/link-map=bmsdataButton=${obj.guildId}.json`, JSON.stringify(bmsdata, null, 2));
            let bmstosr = bmsdata.beatmaps.sort((a, b) => a.difficulty_rating - b.difficulty_rating);
            fs.writeFileSync(`debugosu/link-map=bmstosr=${obj.guildId}.json`, JSON.stringify(bmsdata, null, 2));

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

            mapmods = message.embeds[0].title.split('+')[1];

        }

        if (message != null && button == null) {
            fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                `
----------------------------------------------------
LINK PARSE EVENT - map (message)
${currentDate} | ${currentDateISO}
recieved map link
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-osumaplink-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-osumaplink-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-map')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-osumaplink-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-osumaplink-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            let messagenohttp = message.content.replace('https://', '').replace('http://', '').replace('www.', '')

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
                let idfirst;
                try {
                    if (messagenohttp.includes('beatmapsets')) {

                        idfirst = messagenohttp.split('#')[1].split('/')[1]
                    }
                    else {
                        //make a variable that takes everything after the last '/'
                        idfirst = messagenohttp.split('/')[messagenohttp.split('/').length - 1]
                    }
                    if (isNaN(idfirst)) {
                        mapid = idfirst.split(' ')[0]
                    } else {
                        mapid = idfirst
                    }


                } catch (error) {
                    console.log(error)
                    return message.reply({ content: 'Please enter a valid beatmap link.', allowedMentions: { repliedUser: false } })

                }
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
                let lookupurl = `https://osu.ppy.sh/api/v2/beatmapsets/${cmdchecks.toHexadecimal(setid)}`;
                const bmsdata = await fetch(lookupurl, {
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
                        fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                            `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
                        return;
                    });
                fs.writeFileSync(`debugosu/link-map=bmsdata=${obj.guildId}.json`, JSON.stringify(bmsdata, null, 2))
                try {
                    mapid = bmsdata.beatmaps[0].id;
                } catch(error) {
                    obj.reply({
                        content: 'Error - invalid mapset link',
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    })
                }
            }
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


        fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Options: 
    mapid: ${mapid}
    mapmods: ${mapmods}
    detailed: ${detailed}
----------------------------------------------------
`, 'utf-8')

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
                fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
                return;
            });
        fs.writeFileSync(`debugosu/link-map=mapdata=${obj.guildId}.json`, JSON.stringify(mapdata, null, 2))

        try {
            let mapper = mapdata.beatmapset.creator
        } catch (error) {
            try {
                if (mapdata.authentication) {
                    fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
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
                fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
                return;
            });
        fs.writeFileSync(`debugosu/link-map=mapattrdata=${obj.guildId}.json`, JSON.stringify(mapattrdata, null, 2))
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
        /*             if (interaction) {
                        if (detailed == true) {
                            basicvals =
                                `CS${allvals.cs} (${allvals.details.csRadius.toFixed(2)}r)
                        AR${allvals.ar}  (${allvals.details.arMs.toFixed(2)}ms)
                        OD${allvals.od} (300: ${allvals.details.odMs.range300.toFixed(2)}ms 100: ${allvals.details.odMs.range100.toFixed(2)}ms 50:  ${allvals.details.odMs.range50.toFixed(2)}ms)
                        HP${allvals.hp}`
                        }
                    } */

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
                fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
                    `
----------------------------------------------------
cmd ID: ${absoluteID}
node-fetch error: ${error}
----------------------------------------------------
`, 'utf-8')
                return;
            });
        fs.writeFileSync(`./debugosu/link-map=mapper=${obj.guildId}.json`, JSON.stringify(mapperdata, null, 2))

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
                            `SS: ${ppComputed[0].pp.toFixed(2)} \n ` +
                            `99: ${ppComputed[1].pp.toFixed(2)} \n ` +
                            `98: ${ppComputed[2].pp.toFixed(2)} \n ` +
                            `97: ${ppComputed[3].pp.toFixed(2)} \n ` +
                            `96: ${ppComputed[4].pp.toFixed(2)} \n ` +
                            `95: ${ppComputed[5].pp.toFixed(2)} \n ` +
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

        fs.appendFileSync(`logs/cmd/link${obj.guildId}.log`,
            `
----------------------------------------------------
cmd ID: ${absoluteID}
Command Latency - ${new Date().getTime() - currentDate.getTime()}ms
success
----------------------------------------------------
`, 'utf-8')
    }
}
