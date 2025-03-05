import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as rosu from 'rosu-pp-js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';
/**
 * parse map and return map data
 */
export const map = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;

    let mapid;
    let mapmods: string;
    let maptitleq: string = null;
    let detailed: number = 1;
    let isppCalc: boolean = false;
    const searchRestrict = 'any';
    let overrideSpeed = 1;
    let overrideBpm: number = null;

    const useComponents = [];
    const useFiles = [];
    let overwriteModal = null;

    let customCS: 'current' | number = 'current';
    let customAR: 'current' | number = 'current';
    let customOD: 'current' | number = 'current';
    let customHP: 'current' | number = 'current';

    let useContent: string = '';

    let showBg = false;

    let forceMode: apitypes.GameMode = 'osu';

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            const detailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.details, input.args, false, null, false, false);
            if (detailArgFinder.found) {
                detailed = 2;
                input.args = detailArgFinder.args;
            }
            if (input.args.includes('-bpm')) {
                const temp = helper.tools.commands.parseArg(input.args, '-bpm', 'number', overrideBpm);
                overrideBpm = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-speed')) {
                const temp = helper.tools.commands.parseArg(input.args, '-speed', 'number', overrideSpeed);
                overrideSpeed = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-cs')) {
                const temp = helper.tools.commands.parseArg(input.args, '-cs', 'number', customCS);
                customCS = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-ar')) {
                const temp = helper.tools.commands.parseArg(input.args, '-ar', 'number', customAR);
                customAR = temp.value;
                input.args = temp.newArgs;
            }
            const customODArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['od', 'accuracy',]), input.args, true, 'number', false, false);
            if (customODArgFinder.found) {
                customOD = customODArgFinder.output;
                input.args = customODArgFinder.args;
            }
            const customHPArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['hp', 'drain', 'health']), input.args, true, 'number', false, false);
            if (customHPArgFinder.found) {
                customHP = customHPArgFinder.output;
                input.args = customHPArgFinder.args;
            }

            if (input.args.includes('-?')) {
                const temp = helper.tools.commands.parseArg(input.args, '-?', 'string', maptitleq, true);
                maptitleq = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.join(' ').includes('"')) {
                maptitleq = input.args.join(' ').substring(
                    input.args.join(' ').indexOf('"') + 1,
                    input.args.join(' ').lastIndexOf('"')
                );
                input.args = input.args.join(' ').replace(maptitleq, '').split(' ');
            }
            if (input.args.join(' ').includes('+')) {
                mapmods = input.args.join(' ').split('+')[1];
                mapmods.includes(' ') ? mapmods = mapmods.split(' ')[0] : null;
                input.args = input.args.join(' ').replace('+', '').replace(mapmods, '').split(' ');
            }

            if (input.args.includes('-bg')) {
                showBg = true;
            }
            const isppCalcArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['pp', 'calc', 'performance']), input.args, false, null, false, false);
            if (isppCalcArgFinder.found) {
                isppCalc = true;
                input.args = isppCalcArgFinder.args;
            }

            const modeTemp = await helper.tools.commands.parseArgsMode(input);
            forceMode = modeTemp.mode;
            input.args = modeTemp.args;

            input.args = helper.tools.commands.cleanArgs(input.args);
            const mapTemp = await helper.tools.commands.mapIdFromLink(input.args.join(' '), true);
            mapid = mapTemp.map;
            mapTemp.mode ? forceMode = mapTemp.mode : null;
        }
            break;



        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
            mapid = interaction.options.getInteger('id');
            mapmods = interaction.options.getString('mods');
            detailed = interaction.options.getBoolean('detailed') ? 2 : 1;
            maptitleq = interaction.options.getString('query');
            interaction.options.getNumber('bpm') ? overrideBpm = interaction.options.getNumber('bpm') : null;
            interaction.options.getNumber('speed') ? overrideSpeed = interaction.options.getNumber('speed') : null;
        }



            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? input.interaction?.user;
            const temp = helper.tools.commands.getButtonArgs(input.id);
            if (temp.error) {
                interaction.followUp({
                    content: helper.vars.errors.paramFileMissing,
                    flags: Discord.MessageFlags.Ephemeral,
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            mapid = temp.mapId;
            forceMode = temp.mode;
            mapmods = temp.modsInclude;
            overrideBpm = temp.overrideBpm;
            overrideSpeed = temp.overrideSpeed;
            isppCalc = temp.ppCalc;
            detailed = helper.tools.commands.buttonDetail(temp.detailed, input.buttonType);
        }
            break;

        case 'link': {
            commanduser = input.message.author;
            const messagenohttp = input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
            mapmods =
                input.message.content.includes('+') ?
                    messagenohttp.split('+')[1] : 'NM';
            if (input.args[0] && input.args[0].startsWith('query')) {
                maptitleq = input.args[1];
            } else if (messagenohttp.includes('q=')) {
                maptitleq =
                    messagenohttp.includes('&') ?
                        messagenohttp.split('q=')[1].split('&')[0] :
                        messagenohttp.split('q=')[1];
            } else {
                const mapTemp = await helper.tools.commands.mapIdFromLink(messagenohttp, true,);
                mapid = mapTemp.map;
                forceMode = mapTemp.mode ?? forceMode;
                if (!(mapTemp.map || mapTemp.set)) {
                    await helper.tools.commands.sendMessage({
                        type: input.type,
                        message: input.message,
                        interaction: input.interaction,
                        args: {
                            content: helper.vars.errors.uErr.osu.map.url,
                            edit: true
                        }
                    }, input.canReply);
                    return;
                }
                //get map id via mapset if not in the given URL
                if (!mapTemp.map && mapTemp.set) {
                    let bmsdataReq: tooltypes.apiReturn<apitypes.Beatmapset>;
                    if (helper.tools.data.findFile(mapTemp.set, `bmsdata`) &&
                        !('error' in helper.tools.data.findFile(mapTemp.set, `bmsdata`)) &&
                        input.buttonType != 'Refresh') {
                        bmsdataReq = helper.tools.data.findFile(mapTemp.set, `bmsdata`);
                    } else {
                        bmsdataReq = await helper.tools.api.getMapset(mapTemp.set, []);
                    }
                    const bmsdata: apitypes.Beatmapset = bmsdataReq.apiData;
                    if (bmsdataReq?.error) {
                        await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.ms.replace('[ID]', `${mapTemp.set}`), false);
                        return;
                    }
                    if (bmsdata?.hasOwnProperty('error')) {
                        await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.ms.replace('[ID]', `${mapTemp.set}`), false);
                        return;
                    }
                    if (!bmsdata?.beatmaps[0]?.id) {
                        await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.ms.replace('[ID]', `${mapTemp.set}`), false);
                    }
                    mapid = bmsdata?.beatmaps[0]?.id;
                }
            }
        }
            break;
    }
    if (input.overrides) {
        if (input.overrides?.overwriteModal != null) {
            overwriteModal = input?.overrides?.overwriteModal ?? overwriteModal;
        }
        if (input.overrides?.id != null) {
            mapid = input?.overrides?.id ?? mapid;
        }
        if (input.overrides?.commanduser != null) {
            commanduser = input.overrides.commanduser;
            useContent = `Requested by <@${commanduser.id}>\n`;
        }
        if (input.overrides?.commandAs != null) {
            input.type = input.overrides.commandAs;
        }
        if (input.overrides?.filterMods != null) {
            mapmods = input.overrides.filterMods;
        }
        if (input.overrides?.ex != null) {
            useContent += input.overrides?.ex;
        }
        if (input.overrides?.type != null) {
            isppCalc = true;
        }
    }



    const buttons = new Discord.ActionRowBuilder();
    helper.tools.log.commandOptions(
        [
            {
                name: 'Map ID',
                value: mapid
            },
            {
                name: 'Map Mods',
                value: mapmods
            },
            {
                name: 'Map Title Query',
                value: maptitleq
            },
            {
                name: 'Detailed',
                value: `${detailed}`
            },
            {
                name: 'BPM',
                value: overrideBpm
            },
            {
                name: 'Speed',
                value: overrideSpeed
            },
            {
                name: 'cs',
                value: customCS
            },
            {
                name: 'ar',
                value: customAR
            },
            {
                name: 'od',
                value: customOD
            },
            {
                name: 'hp',
                value: customHP
            },
            {
                name: 'ppCalc',
                value: isppCalc
            },
            {
                name: 'forceMode',
                value: forceMode
            }
        ],
        input.id,
        'map',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    if (!mapid) {
        const temp = helper.tools.data.getPreviousId('map', input.message?.guildId ?? input.interaction?.guildId);
        mapid = temp.id;
        if (!mapmods || osumodcalc.OrderMods(mapmods).string.length == 0) {
            mapmods = temp.mods;
        }
        forceMode = temp.mode;
    }
    if (mapid == false) {
        helper.tools.commands.missingPrevID_map(input, 'map');
        return;
    }
    if (isppCalc) {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Map-map-${commanduser.id}-${input.id}-${mapid}${mapmods && mapmods != 'NM' ? '+' + mapmods : ''}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.map)
        );
    } else {
        if (detailed == 2) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-DetailDisable-map-${commanduser.id}-${input.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.main.detailLess)
            );
        } else {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-DetailEnable-map-${commanduser.id}-${input.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.main.detailMore)
            );
        }
    }
    let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
    let mapdata: apitypes.Beatmap;
    let bmsdataReq: tooltypes.apiReturn<apitypes.Beatmapset>;
    let bmsdata: apitypes.Beatmapset;

    const inputModalDiff = new Discord.StringSelectMenuBuilder()
        .setCustomId(`${helper.vars.versions.releaseDate}-Select-map-${commanduser.id}-${input.id}-diff`)
        .setPlaceholder('Select a difficulty');
    const inputModalSearch = new Discord.StringSelectMenuBuilder()
        .setCustomId(`${helper.vars.versions.releaseDate}-Select-map-${commanduser.id}-${input.id}-search`)
        .setPlaceholder('Select a map');

    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: 'Loading...'
            }
        }, input.canReply);
    }
    //fetch map data and mapset data from id
    if (maptitleq == null) {
        if (helper.tools.data.findFile(mapid, 'mapdata') &&
            !('error' in helper.tools.data.findFile(mapid, 'mapdata')) &&
            input.buttonType != 'Refresh') {
            mapdataReq = helper.tools.data.findFile(mapid, 'mapdata');
        } else {
            mapdataReq = await helper.tools.api.getMap(mapid, []);
        }

        mapdata = mapdataReq.apiData;
        helper.tools.data.debug(mapdataReq, 'command', 'map', input.message?.guildId ?? input.interaction?.guildId, 'mapData');
        if (mapdataReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', `${mapid}`), false);
            return;
        }
        if (mapdata?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', `${mapid}`), false);
            return;
        }

        helper.tools.data.storeFile(mapdataReq, mapid, 'mapdata');

        if (helper.tools.data.findFile(mapdata.beatmapset_id, `bmsdata`) &&
            !('error' in helper.tools.data.findFile(mapdata.beatmapset_id, `bmsdata`)) &&
            input.buttonType != 'Refresh') {
            bmsdataReq = helper.tools.data.findFile(mapdata.beatmapset_id, `bmsdata`);
        } else {
            bmsdataReq = await helper.tools.api.getMapset(mapdata.beatmapset_id, []);
        }
        bmsdata = bmsdataReq.apiData;
        if (bmsdataReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.ms.replace('[ID]', `${mapdata.beatmapset_id}`), false);
            return;
        }
        helper.tools.data.debug(bmsdataReq, 'command', 'map', input.message?.guildId ?? input.interaction?.guildId, 'bmsData');

        if (bmsdata?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.ms.replace('[ID]', `${mapdata.beatmapset_id}`), true);

            return;
        }

        helper.tools.data.storeFile(bmsdataReq, mapdata.beatmapset_id, `bmsdata`);
    }

    //fetch mapdata and mapset data from title query
    if (maptitleq != null) {
        const mapidtestReq = await helper.tools.api.getMapSearch(encodeURIComponent(maptitleq), ['s=any']);
        const mapidtest = mapidtestReq.apiData as apitypes.BeatmapsetSearch;
        if (mapidtestReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.search, false);
            return;
        }
        helper.tools.data.debug(mapidtestReq, 'command', 'map', input.message?.guildId ?? input.interaction?.guildId, 'mapIdTestData');
        helper.tools.data.storeFile(mapidtestReq, maptitleq.replace(/[\W_]+/g, '').replaceAll(' ', '_'), 'mapQuerydata');

        if (mapidtest?.hasOwnProperty('error') && !mapidtest.hasOwnProperty('beatmapsets')) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.search, true);
            return;
        }

        let usemapidpls;
        let mapidtest2;

        if (mapidtest.beatmapsets.length == 0) {
            await helper.tools.commands.sendMessage({
                type: input.type,
                message: input.message,
                interaction: input.interaction,
                args: {
                    content: helper.vars.errors.uErr.osu.map.search_nf.replace('[INPUT]', maptitleq),
                    edit: true
                }
            }, input.canReply);

            return;
        }
        try {
            let matchedId = null;
            // first check if any diff name matches the search
            for (let i = 0; i < mapidtest.beatmapsets[0].beatmaps.length; i++) {
                if (maptitleq.includes(mapidtest.beatmapsets[0].beatmaps[i].version)) {
                    matchedId = mapidtest.beatmapsets[0].beatmaps[i].id;
                }
            }

            mapidtest2 = mapidtest.beatmapsets[0].beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating);
            usemapidpls = matchedId ?? mapidtest2[0].id;
        } catch (error) {
            await helper.tools.commands.sendMessage({
                type: input.type,
                message: input.message,
                interaction: input.interaction,
                args: {
                    content: `Error - could not sort maps`,
                    edit: true
                }
            }, input.canReply);
            return;
        }

        if (helper.tools.data.findFile(usemapidpls, 'mapdata') &&
            input.type == 'button' &&
            !('error' in helper.tools.data.findFile(usemapidpls, 'mapdata')) &&
            input.buttonType != 'Refresh') {
            mapdataReq = helper.tools.data.findFile(usemapidpls, 'mapdata');
        } else {
            mapdataReq = await helper.tools.api.getMap(usemapidpls, []);
            // mapdataReq = await osufunc.apiget('map_get', `${mapidtest2[0].id}`)
        }

        mapdata = mapdataReq.apiData;
        if (mapdataReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', usemapidpls), false);
            return;
        }
        helper.tools.data.debug(mapdataReq, 'command', 'map', input.message?.guildId ?? input.interaction?.guildId, 'mapData');
        if (mapdata?.hasOwnProperty('error') || !mapdata.id) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.m.replace('[ID]', usemapidpls), true);
            return;
        }

        helper.tools.data.storeFile(mapdataReq, mapidtest2[0].id, 'mapdata');

        //options menu to switch to other maps
        for (let i = 0; i < mapidtest?.beatmapsets?.length && i < 25; i++) {
            const curmapset = mapidtest?.beatmapsets?.[i];
            if (!curmapset) break;
            const curmap = curmapset.beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating)[0];
            inputModalSearch.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(`${curmap.mode_int == 0 ? helper.vars.emojis.gamemodes.standard :
                        curmap.mode_int == 1 ? helper.vars.emojis.gamemodes.taiko :
                            curmap.mode_int == 2 ? helper.vars.emojis.gamemodes.fruits :
                                curmap.mode_int == 3 ? helper.vars.emojis.gamemodes.mania :
                                    helper.vars.emojis.gamemodes.standard
                        }` as Discord.APIMessageComponentEmoji)
                    .setLabel(`${curmapset.title} // ${curmapset.creator}`)
                    .setDescription(`[${curmap.version}] ${curmap.difficulty_rating}⭐`)
                    .setValue(`${curmap.id}`)
            );
        }
        if (helper.tools.data.findFile(mapdata.beatmapset_id, `bmsdata`) &&
            !('error' in helper.tools.data.findFile(mapdata.beatmapset_id, `bmsdata`)) &&
            input.buttonType != 'Refresh') {
            bmsdataReq = helper.tools.data.findFile(mapdata.beatmapset_id, `bmsdata`);
        } else {
            bmsdataReq = await helper.tools.api.getMapset(mapdata.beatmapset_id, []);
        }
        bmsdata = bmsdataReq.apiData;
        if (bmsdataReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.ms.replace('[ID]', `${mapdata.beatmapset_id}`), false);
            return;
        }
        helper.tools.data.debug(bmsdataReq, 'command', 'map', input.message?.guildId ?? input.interaction?.guildId, 'bmsData');

        if (bmsdata?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(input, 'map', true, helper.vars.errors.uErr.osu.map.ms.replace('[ID]', `${mapdata.beatmapset_id}`), true);
            return;
        }

        helper.tools.data.storeFile(bmsdataReq, mapdata.beatmapset_id, `bmsdata`);
    }

    //options thing to switch to other maps in the mapset (difficulties)
    if (typeof bmsdata?.beatmaps == 'undefined' || bmsdata?.beatmaps?.length < 2) {
        inputModalDiff.addOptions(
            new Discord.StringSelectMenuOptionBuilder()
                .setEmoji(`${mapdata.mode_int == 0 ? helper.vars.emojis.gamemodes.standard :
                    mapdata.mode_int == 1 ? helper.vars.emojis.gamemodes.taiko :
                        mapdata.mode_int == 2 ? helper.vars.emojis.gamemodes.fruits :
                            mapdata.mode_int == 3 ? helper.vars.emojis.gamemodes.mania :
                                helper.vars.emojis.gamemodes.standard
                    }` as Discord.APIMessageComponentEmoji)
                .setLabel(`${mapdata.version}`)
                .setDescription(`${mapdata.difficulty_rating}⭐`)
                .setValue(`${mapdata.id}`)
        );
    } else {
        for (let i = 0; i < bmsdata.beatmaps.length && i < 25; i++) {
            const curmap = bmsdata.beatmaps.slice().sort((a, b) => b.difficulty_rating - a.difficulty_rating)[i];
            if (!curmap) break;
            inputModalDiff.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(`${mapdata.mode_int == 0 ? helper.vars.emojis.gamemodes.standard :
                        mapdata.mode_int == 1 ? helper.vars.emojis.gamemodes.taiko :
                            mapdata.mode_int == 2 ? helper.vars.emojis.gamemodes.fruits :
                                mapdata.mode_int == 3 ? helper.vars.emojis.gamemodes.mania :
                                    helper.vars.emojis.gamemodes.standard
                        }` as Discord.APIMessageComponentEmoji)
                    .setLabel(`${curmap.version}`)
                    .setDescription(`${curmap.difficulty_rating}⭐`)
                    .setValue(`${curmap.id}`)
            );
        }
    }

    let use: {
        content?: string,
        embeds?: Discord.EmbedBuilder[] | Discord.Embed[],
        components?: Discord.ActionRowBuilder[],
        files?: string[] | Discord.AttachmentBuilder[] | Discord.Attachment[],
        edit?: boolean,
    } = {
        content: '',
        embeds: [],
        components: [],
        files: [],
        edit: true
    };

    if (showBg) {
        const url = helper.tools.api.mapImages(mapdata.beatmapset_id);
        const embed = new Discord.EmbedBuilder()
            .setTitle('Beatmap images')
            .addFields([
                {
                    name: 'Thumbnail (4:3)',
                    value: `${url.thumbnail}\n\n${url.thumbnailLarge}`,
                    inline: true
                },
                {
                    name: 'Full/Raw',
                    value: `${url.full}\n\n${url.raw}`,
                    inline: true
                },
                {
                    name: 'Cover (18:5)',
                    value: `${url.cover}\n\n${url.cover2x}`,
                    inline: true
                },
                {
                    name: 'Card (20:7)',
                    value: `${url.card}\n\n${url.card2x}`,
                    inline: true
                },
                {
                    name: 'List (1:1)',
                    value: `${url.list}\n\n${url.list2x}`,
                    inline: true
                },
                {
                    name: 'Slimcover (16:3)',
                    value: `${url.slimcover}\n\n${url.slimcover2x}`,
                    inline: true
                },
            ])
            .setImage(url.full);
        use = {
            embeds: [embed],
            edit: true
        };
    } else {
        //parsing maps
        if (mapmods == null || mapmods == '') {
            mapmods = 'NM';
        }
        else {
            mapmods = osumodcalc.modHandler(mapmods.toUpperCase(), mapdata.mode).join();
        }

        //converts
        let useMapdata: apitypes.Beatmap = mapdata;
        let successConvert: boolean = false;
        if (forceMode && forceMode != mapdata.mode && forceMode != 'osu') {
            for (const beatmap of bmsdata.converts) {
                if (beatmap.mode == forceMode && beatmap.id == mapdata.id) {
                    useMapdata = beatmap;
                    successConvert = true;
                    break;
                }
            }
        }

        let statusimg = helper.vars.emojis.rankedstatus.graveyard;
        switch (useMapdata.status) {
            case 'ranked':
                statusimg = helper.vars.emojis.rankedstatus.ranked;
                break;
            case 'approved': case 'qualified':
                statusimg = helper.vars.emojis.rankedstatus.approved;
                break;
            case 'loved':
                statusimg = helper.vars.emojis.rankedstatus.loved;
                break;
        }

        if (customCS == 'current' || isNaN(+customCS)) {
            customCS = useMapdata.cs;
        }
        if (customAR == 'current' || isNaN(+customAR)) {
            customAR = useMapdata.ar;
        }
        if (customOD == 'current' || isNaN(+customOD)) {
            customOD = useMapdata.accuracy;
        }
        if (customHP == 'current' || isNaN(+customHP)) {
            customHP = useMapdata.drain;
        }

        let hitlength = useMapdata.hit_length;
        const oldOverrideSpeed = overrideSpeed;

        if (overrideBpm && !isNaN(overrideBpm) && (!overrideSpeed || isNaN(overrideSpeed) || overrideSpeed == 1) && overrideBpm != useMapdata.bpm) {
            overrideSpeed = overrideBpm / useMapdata.bpm;
        }
        if (overrideSpeed && !isNaN(overrideSpeed) && (!overrideBpm || isNaN(overrideBpm)) && overrideSpeed != 1) {
            overrideBpm = useMapdata.bpm * overrideSpeed;
        }
        if (mapmods.includes('DT') || mapmods.includes('NC')) {
            overrideSpeed *= 1.5;
            overrideBpm *= 1.5;
        }
        if (mapmods.includes('HT')) {
            overrideSpeed *= 0.75;
            overrideBpm *= 0.75;
        }
        if (overrideSpeed) {
            hitlength /= overrideSpeed;
        }

        const inallvals = osumodcalc.calcValues(
            +customCS,
            +customAR,
            +customOD,
            +customHP,
            overrideBpm ?? useMapdata.bpm,
            hitlength,
            mapmods
        );

        const allvals = osumodcalc.calcValuesAlt(
            inallvals.cs, inallvals.ar, inallvals.od, inallvals.hp, inallvals.bpm, hitlength, oldOverrideSpeed
        );
        const mapimg = helper.vars.emojis.gamemodes[useMapdata.mode];

        let ppComputed: rosu.PerformanceAttributes[];
        let pphd: rosu.PerformanceAttributes;
        let pphr: rosu.PerformanceAttributes;
        let ppdt: rosu.PerformanceAttributes;
        let pphdhr: rosu.PerformanceAttributes;
        let pphddt: rosu.PerformanceAttributes;
        let pphddthr: rosu.PerformanceAttributes;
        let ppissue: string;
        let totaldiff: string | number = useMapdata.difficulty_rating;
        try {
            ppComputed = await helper.tools.performance.calcMap({
                mods: mapmods,
                mode: useMapdata.mode_int,
                mapid: useMapdata.id,
                clockRate: overrideSpeed,
                customCS,
                customAR,
                customOD,
                customHP,
                mapLastUpdated: new Date(useMapdata.last_updated)
            });
            pphd = await helper.tools.performance.calcFullCombo({
                mapid: useMapdata.id,
                mods: 'HD',
                mode: useMapdata.mode_int,
                clockRate: overrideSpeed,
                accuracy: 100,
                customCS,
                customAR,
                customOD,
                customHP,
                mapLastUpdated: new Date(useMapdata.last_updated)
            });
            pphr = await helper.tools.performance.calcFullCombo({
                mapid: useMapdata.id,
                mods: 'HR',
                mode: useMapdata.mode_int,
                clockRate: overrideSpeed,
                accuracy: 100,
                customCS,
                customAR,
                customOD,
                customHP,
                mapLastUpdated: new Date(useMapdata.last_updated)
            });
            ppdt = await helper.tools.performance.calcFullCombo({
                mapid: useMapdata.id,
                mods: 'DT',
                mode: useMapdata.mode_int,
                clockRate: overrideSpeed * 1.5,
                accuracy: 100,
                customCS,
                customAR,
                customOD,
                customHP,
                mapLastUpdated: new Date(useMapdata.last_updated)
            });
            pphdhr = await helper.tools.performance.calcFullCombo({
                mapid: useMapdata.id,
                mods: 'HDHR',
                mode: useMapdata.mode_int,
                clockRate: overrideSpeed,
                accuracy: 100,
                customCS,
                customAR,
                customOD,
                customHP,
                mapLastUpdated: new Date(useMapdata.last_updated)
            });
            pphddt = await helper.tools.performance.calcFullCombo({
                mapid: useMapdata.id,
                mods: 'HDDT',
                mode: useMapdata.mode_int,
                clockRate: overrideSpeed * 1.5,
                accuracy: 100,
                customCS,
                customAR,
                customOD,
                customHP,
                mapLastUpdated: new Date(useMapdata.last_updated)
            });
            pphddthr = await helper.tools.performance.calcFullCombo({
                mapid: useMapdata.id,
                mods: 'HDDTHR',
                mode: useMapdata.mode_int,
                clockRate: overrideSpeed * 1.5,
                accuracy: 100,
                customCS,
                customAR,
                customOD,
                customHP,
                mapLastUpdated: new Date(useMapdata.last_updated)
            });
            ppissue = '';
            try {
                totaldiff = useMapdata.difficulty_rating.toFixed(2) != ppComputed[0].difficulty.stars?.toFixed(2) ?
                    `${useMapdata.difficulty_rating.toFixed(2)}=>${ppComputed[0].difficulty.stars?.toFixed(2)}` :
                    `${useMapdata.difficulty_rating.toFixed(2)}`;
            } catch (error) {
                totaldiff = useMapdata.difficulty_rating;
            }
            helper.tools.data.debug(ppComputed, 'command', 'map', input.message?.guildId ?? input.interaction?.guildId, 'ppCalc');

        } catch (error) {
            helper.tools.log.stdout(error);
            ppissue = 'Error - pp could not be calculated';
            const tstmods = mapmods.toUpperCase();

            if (tstmods.includes('EZ') || tstmods.includes('HR')) {
                ppissue += '\nInvalid mod combinations: EZ + HR';
            }
            if ((tstmods.includes('DT') || tstmods.includes('NC')) && tstmods.includes('HT')) {
                ppissue += '\nInvalid mod combinations: DT/NC + HT';
            }
            const ppComputedTemp = helper.tools.performance.template(useMapdata);
            ppComputed = [
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
                ppComputedTemp,
            ];
            pphd = ppComputedTemp;
            pphr = ppComputedTemp;
            ppdt = ppComputedTemp;
            pphdhr = ppComputedTemp;
            pphddt = ppComputedTemp;
            pphddthr = ppComputedTemp;
        }
        const baseCS = allvals.cs != useMapdata.cs ? `${useMapdata.cs}=>${allvals.cs}` : allvals.cs;
        const baseAR = allvals.ar != useMapdata.ar ? `${useMapdata.ar}=>${allvals.ar}` : allvals.ar;
        const baseOD = allvals.od != useMapdata.accuracy ? `${useMapdata.accuracy}=>${allvals.od}` : allvals.od;
        const baseHP = allvals.hp != useMapdata.drain ? `${useMapdata.drain}=>${allvals.hp}` : allvals.hp;
        const baseBPM = useMapdata.bpm * (overrideSpeed ?? 1) != useMapdata.bpm ? `${useMapdata.bpm}=>${useMapdata.bpm * (overrideSpeed ?? 1)}` : useMapdata.bpm;

        let basicvals = `CS${baseCS}\n AR${baseAR}\n OD${baseOD}\n HP${baseHP}\n`;

        const mapname = helper.tools.formatter.parseUnicodeStrings({
            title: mapdata.beatmapset.title,
            artist: mapdata.beatmapset.artist,
            title_unicode: mapdata.beatmapset.title_unicode,
            artist_unicode: mapdata.beatmapset.artist_unicode,
            ignore: {
                artist: false,
                title: false
            }
        }, 1);
        mapmods = mapmods.replace(',', '');
        const maptitle: string = mapmods ? `\`${mapname} [${mapdata.version}]\` +${mapmods}` : `\`${mapname} [${mapdata.version}]\``;
        const Embed = new Discord.EmbedBuilder()
            .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${useMapdata.mode}/${mapdata.id}`)
            .setThumbnail(helper.tools.api.mapImages(mapdata.beatmapset_id).list2x)
            .setTitle(maptitle);
        const embeds: Discord.EmbedBuilder[] = [];
        Embed.setColor(helper.tools.formatter.difficultyColour(+totaldiff).dec);
        if (isppCalc) {
            let extras = '';

            switch (useMapdata.mode) {
                case 'osu': {
                    extras = `
---===SS===---  
\`Aim        ${ppComputed[0].ppAim?.toFixed(3)}\`
\`Speed      ${ppComputed[0].ppSpeed?.toFixed(3)}\`
\`Acc        ${ppComputed[0].ppAccuracy?.toFixed(3)}\`
${ppComputed[0].ppFlashlight > 0 ? `\`Flashlight ${ppComputed[0].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${ppComputed[0].pp?.toFixed(3)}\`
---===97%===---
\`Aim        ${ppComputed[3].ppAim?.toFixed(3)}\`
\`Speed      ${ppComputed[3].ppSpeed?.toFixed(3)}\`
\`Acc        ${ppComputed[3].ppAccuracy?.toFixed(3)}\`
${ppComputed[0].ppFlashlight > 0 ? `\`Flashlight ${ppComputed[3].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${ppComputed[3].pp?.toFixed(3)}\`
---===95%===---
\`Aim        ${ppComputed[5].ppAim?.toFixed(3)}\`
\`Speed      ${ppComputed[5].ppSpeed?.toFixed(3)}\`
\`Acc        ${ppComputed[5].ppAccuracy?.toFixed(3)}\`
${ppComputed[0].ppFlashlight > 0 ? `\`Flashlight ${ppComputed[5].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${ppComputed[5].pp?.toFixed(3)}\`
---===93%===---
\`Aim        ${ppComputed[7].ppAim?.toFixed(3)}\`
\`Speed      ${ppComputed[7].ppSpeed?.toFixed(3)}\`
\`Acc        ${ppComputed[7].ppAccuracy?.toFixed(3)}\`
${ppComputed[0].ppFlashlight > 0 ? `\`Flashlight ${ppComputed[7].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${ppComputed[7].pp?.toFixed(3)}\`
---===90%===---
\`Aim        ${ppComputed[10].ppAim?.toFixed(3)}\`
\`Speed      ${ppComputed[10].ppSpeed?.toFixed(3)}\`
\`Acc        ${ppComputed[10].ppAccuracy?.toFixed(3)}\`
${ppComputed[0].ppFlashlight > 0 ? `\`Flashlight ${ppComputed[10].ppFlashlight?.toFixed(3)}\`\n` : ''}\`Total      ${ppComputed[10].pp?.toFixed(3)}\`
`;
                }
                    break;
                case 'taiko': {
                    extras = `
---===SS===---  
- Strain: ${ppComputed[0].ppDifficulty}
- Acc: ${ppComputed[0].ppAccuracy}
- Total: ${ppComputed[0].pp} 
---===97%===---
- Strain: ${ppComputed[3].ppDifficulty}
- Acc: ${ppComputed[3].ppAccuracy}
- Total: ${ppComputed[3].pp} 
---===95%===---
- Strain: ${ppComputed[5].ppDifficulty}
- Acc: ${ppComputed[5].ppAccuracy}
- Total: ${ppComputed[5].pp} 
---===93%===---
- Strain: ${ppComputed[7].ppDifficulty}
- Acc: ${ppComputed[7].ppAccuracy}
- Total: ${ppComputed[7].pp} 
---===90%===---
- Strain: ${ppComputed[10].ppDifficulty}
- Acc: ${ppComputed[10].ppAccuracy}
- Total: ${ppComputed[10].pp}                 
`;
                }
                    break;
                case 'fruits': {
                    extras = `
---===SS===---  
- Strain: ${ppComputed[0].ppDifficulty}
- Total: ${ppComputed[0].pp} 
---===97%===---
- Strain: ${ppComputed[3].ppDifficulty}
- Total: ${ppComputed[3].pp} 
---===95%===---
- Strain: ${ppComputed[5].ppDifficulty}
- Total: ${ppComputed[5].pp} 
---===93%===---
- Strain: ${ppComputed[7].ppDifficulty}
- Total: ${ppComputed[7].pp} 
---===90%===---
- Strain: ${ppComputed[10].ppDifficulty}
- Total: ${ppComputed[10].pp}                 
`;
                }
                    break;
                case 'mania': {
                    extras = `
---===SS===---  
- Total: ${ppComputed[0].pp} 
---===97%===---
- Total: ${ppComputed[3].pp} 
---===95%===---
- Total: ${ppComputed[5].pp} 
---===93%===---
- Total: ${ppComputed[7].pp} 
---===90%===---
- Total: ${ppComputed[10].pp}                 
`;
                }
                    break;
            }

            Embed
                .setTitle(maptitle)
                .addFields([
                    {
                        name: 'MAP VALUES',
                        value:
                            `CS${baseCS} AR${baseAR} OD${baseOD} HP${baseHP} ${totaldiff}⭐\n` +
                            `${helper.vars.emojis.mapobjs.bpm}${baseBPM} | ` +
                            `${helper.vars.emojis.mapobjs.total_length}${allvals.length != useMapdata.hit_length ? `${allvals.details.lengthFull}(${helper.tools.calculate.secondsToTime(useMapdata.hit_length)})` : allvals.details.lengthFull} | ` +
                            `${ppComputed[0].difficulty.maxCombo ?? mapdata.max_combo}x combo\n ` +
                            `${helper.vars.emojis.mapobjs.circle}${useMapdata.count_circles} \n${helper.vars.emojis.mapobjs.slider}${useMapdata.count_sliders} \n${helper.vars.emojis.mapobjs.spinner}${useMapdata.count_spinners}\n`,
                        inline: false
                    },
                    {
                        name: 'PP',
                        value:
                            `\`SS:    \` ${ppComputed[0].pp?.toFixed(2)} \n ` +
                            `\`99%:   \` ${ppComputed[1].pp?.toFixed(2)} \n ` +
                            `\`98%:   \` ${ppComputed[2].pp?.toFixed(2)} \n ` +
                            `\`97%:   \` ${ppComputed[3].pp?.toFixed(2)} \n ` +
                            `\`96%:   \` ${ppComputed[4].pp?.toFixed(2)} \n ` +
                            `\`95%:   \` ${ppComputed[5].pp?.toFixed(2)} \n ` +
                            `\`94%:   \` ${ppComputed[6].pp?.toFixed(2)} \n ` +
                            `\`93%:   \` ${ppComputed[7].pp?.toFixed(2)} \n ` +
                            `\`92%:   \` ${ppComputed[8].pp?.toFixed(2)} \n ` +
                            `\`91%:   \` ${ppComputed[9].pp?.toFixed(2)} \n ` +
                            `\`90%:   \` ${ppComputed[10].pp?.toFixed(2)} \n ` +
                            `---===MODDED===---\n` +
                            `\`HD:    \` ${pphd.pp?.toFixed(2)} \n ` +
                            `\`HR:    \` ${pphr.pp?.toFixed(2)} \n ` +
                            `\`DT:    \` ${ppdt.pp?.toFixed(2)} \n ` +
                            `\`HDHR:  \` ${pphdhr.pp?.toFixed(2)} \n ` +
                            `\`HDDT:  \` ${pphddt.pp?.toFixed(2)} \n ` +
                            `\`HDDTHR:\` ${pphddthr.pp?.toFixed(2)} \n ` +

                            `\n${ppissue}`
                        ,
                        inline: true
                    },
                    {
                        name: 'Full',
                        value: extras,
                        inline: true
                    }
                ]);
        } else {


            if (detailed == 2) {
                basicvals =
                    `CS${baseCS} (${allvals.details.csRadius?.toFixed(2)}r)
AR${baseAR}  (${allvals.details.arMs?.toFixed(2)}ms)
OD${baseOD} (300: ${allvals.details.odMs.hitwindow_300?.toFixed(2)}ms 100: ${allvals.details.odMs.hitwindow_100?.toFixed(2)}ms 50:  ${allvals.details.odMs.hitwindow_50?.toFixed(2)}ms)
HP${baseHP}`;
            }
            const strains = await helper.tools.performance.calcStrains(
                {
                    mapid: mapdata.id,
                    mode: useMapdata.mode_int,
                    mods: mapmods,
                    mapLastUpdated: new Date(useMapdata.last_updated),
                });
            try {
                helper.tools.data.debug(strains, 'command', 'map', input.message?.guildId ?? input.interaction?.guildId, 'strains');

            } catch (error) {
                helper.tools.data.debug({ error: error }, 'command', 'map', input.message?.guildId ?? input.interaction?.guildId, 'strains');
            }
            let mapgraph;
            if (strains) {
                const mapgraphInit =
                    await helper.tools.other.graph(strains.strainTime, strains.value, 'Strains', {
                        startzero: true,
                        type: 'bar',
                        fill: true,
                        displayLegend: false,
                        title: 'Strains',
                        imgUrl: helper.tools.api.mapImages(mapdata.beatmapset_id).full,
                        blurImg: true,
                    });
                useFiles.push(mapgraphInit.path);

                mapgraph = mapgraphInit.filename;
            } else {
                mapgraph = null;
            }
            let detailedmapdata = '-';
            if (detailed == 2) {
                switch (useMapdata.mode) {
                    case 'osu': {
                        detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} | Aim: ${ppComputed[0].ppAim?.toFixed(2)} | Speed: ${ppComputed[0].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[0].ppAccuracy?.toFixed(2)} \n ` +
                            `**99**: ${ppComputed[1].pp?.toFixed(2)} | Aim: ${ppComputed[1].ppAim?.toFixed(2)} | Speed: ${ppComputed[1].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[1].ppAccuracy?.toFixed(2)} \n ` +
                            `**97**: ${ppComputed[3].pp?.toFixed(2)} | Aim: ${ppComputed[3].ppAim?.toFixed(2)} | Speed: ${ppComputed[3].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[3].ppAccuracy?.toFixed(2)} \n ` +
                            `**95**: ${ppComputed[5].pp?.toFixed(2)} | Aim: ${ppComputed[5].ppAim?.toFixed(2)} | Speed: ${ppComputed[5].ppSpeed?.toFixed(2)} | Acc: ${ppComputed[5].ppAccuracy?.toFixed(2)} \n ` +
                            `${ppissue}`;
                    }
                        break;
                    case 'taiko': {
                        detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} | Acc: ${ppComputed[0].ppAccuracy?.toFixed(2)} | Strain: ${ppComputed[0].ppDifficulty?.toFixed(2)} \n ` +
                            `**99**: ${ppComputed[1].pp?.toFixed(2)} | Acc: ${ppComputed[1].ppAccuracy?.toFixed(2)} | Strain: ${ppComputed[1]?.ppDifficulty?.toFixed(2)} \n ` +
                            `**97**: ${ppComputed[3].pp?.toFixed(2)} | Acc: ${ppComputed[3].ppAccuracy?.toFixed(2)} | Strain: ${ppComputed[3]?.ppDifficulty?.toFixed(2)} \n ` +
                            `**95**: ${ppComputed[5].pp?.toFixed(2)} | Acc: ${ppComputed[5].ppAccuracy?.toFixed(2)} | Strain: ${ppComputed[5]?.ppDifficulty?.toFixed(2)} \n ` +
                            `${ppissue}`;
                    }
                        break;
                    case 'fruits': {
                        detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} | Strain: ${ppComputed[0].ppDifficulty?.toFixed(2)} \n ` +
                            `**99**: ${ppComputed[1].pp?.toFixed(2)} | Strain: ${ppComputed[1]?.ppDifficulty?.toFixed(2)} \n ` +
                            `**97**: ${ppComputed[3].pp?.toFixed(2)} | Strain: ${ppComputed[3]?.ppDifficulty?.toFixed(2)} \n ` +
                            `**95**: ${ppComputed[5].pp?.toFixed(2)} | Strain: ${ppComputed[5]?.ppDifficulty?.toFixed(2)} \n ` +
                            `${ppissue}`;
                    }
                        break;
                    case 'mania': {
                        detailedmapdata = `**SS**: ${ppComputed[0].pp?.toFixed(2)} \n ` +
                            `**99**: ${ppComputed[1].pp?.toFixed(2)} \n ` +
                            `**98**: ${ppComputed[2].pp?.toFixed(2)} \n ` +
                            `**97**: ${ppComputed[3].pp?.toFixed(2)} \n ` +
                            `**96**: ${ppComputed[4].pp?.toFixed(2)} \n ` +
                            `**95**: ${ppComputed[5].pp?.toFixed(2)} \n ` +
                            `${ppissue}`;
                    }
                        break;

                }
            }

            const exMapDetails = `${helper.tools.calculate.separateNum(useMapdata.playcount)} plays | ${helper.tools.calculate.separateNum(mapdata.beatmapset.play_count)} mapset plays | ${helper.tools.calculate.separateNum(useMapdata.passcount)} passes | ${helper.tools.calculate.separateNum(mapdata.beatmapset.favourite_count)} favourites\n` +
                `Submitted <t:${new Date(mapdata.beatmapset.submitted_date).getTime() / 1000}:R> | Last updated <t:${new Date(mapdata.beatmapset.last_updated).getTime() / 1000}:R>
    ${mapdata.status == 'ranked' ?
                    `Ranked <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                }${useMapdata.status == 'approved' || useMapdata.status == 'qualified' ?
                    `Approved/Qualified <t: ${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                }${useMapdata.status == 'loved' ?
                    `Loved <t:${Math.floor(new Date(mapdata.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                }\n` +
                `${mapdata.beatmapset.video ? '📺' : ''} ${mapdata.beatmapset.storyboard ? '🎨' : ''}`;

            Embed
                .setAuthor({
                    name: `mapped by ${mapdata.beatmapset.creator}`,
                    url: `https://osu.ppy.sh/users/${bmsdata.user_id}`,
                    iconURL: `${bmsdata.user.avatar_url ?? helper.vars.defaults.images.any.url}`,
                })
                .addFields([
                    {
                        name: 'MAP VALUES',
                        value:
                            `${basicvals} ⭐${totaldiff}\n`,
                        inline: true
                    },
                    {
                        name: helper.vars.defaults.invisbleChar,
                        value: `${helper.vars.emojis.mapobjs.bpm}${baseBPM}\n` +
                            `${helper.vars.emojis.mapobjs.circle}${useMapdata.count_circles} \n${helper.vars.emojis.mapobjs.slider}${useMapdata.count_sliders} \n${helper.vars.emojis.mapobjs.spinner}${useMapdata.count_spinners}\n` +
                            `${helper.vars.emojis.mapobjs.total_length}${allvals.length != useMapdata.hit_length ? `${helper.tools.calculate.secondsToTime(useMapdata.hit_length)}=>${allvals.details.lengthFull}` : allvals.details.lengthFull}\n`,
                        inline: true
                    },
                    {
                        name: 'PP',
                        value:
                            detailed != 2 ?
                                `SS: ${ppComputed[0].pp?.toFixed(2)} \n ` +
                                `99: ${ppComputed[1].pp?.toFixed(2)} \n ` +
                                `98: ${ppComputed[2].pp?.toFixed(2)} \n ` +
                                `97: ${ppComputed[3].pp?.toFixed(2)} \n ` +
                                `96: ${ppComputed[4].pp?.toFixed(2)} \n ` +
                                `95: ${ppComputed[5].pp?.toFixed(2)} \n ` +
                                `${ppissue}` :
                                detailedmapdata
                        ,
                        inline: detailed != 2
                    },
                    {
                        name: 'DOWNLOAD',
                        value: `[osu!](https://osu.ppy.sh/b/${mapdata.id}) | [Chimu](https://api.chimu.moe/v1/download${mapdata.beatmapset_id}) | [Beatconnect](https://beatconnect.io/b/${mapdata.beatmapset_id}) | [Kitsu](https://kitsu.io/d/${mapdata.beatmapset_id})\n` +
                            `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${mapdata.id})`,
                        inline: false
                    }, // [osu!direct](osu://b/${mapdata.id}) - discord doesn't support schemes other than http, https and discord
                    {
                        name: 'MAP DETAILS',
                        value: `${statusimg} | ${mapimg} | ${ppComputed[0].difficulty.maxCombo ?? mapdata.max_combo}x combo \n ` +
                            `${detailed == 2 ?
                                exMapDetails
                                : ''}`

                        ,
                        inline: false
                    }
                ]);

            if (!(mapdata.owners.length == 1 && mapdata.owners[0].id == bmsdata.user_id)) {
                Embed.setDescription("Guest difficulty by " + helper.tools.other.listItems(mapdata.owners.map(x => `[${x.username}](https://osu.ppy.sh/u/${x.id})`)));
            }
            buttons
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-User-map-any-${input.id}-${mapdata.user_id}+${mapdata.mode}`)
                        .setStyle(helper.vars.buttons.type.current)
                        .setEmoji(helper.vars.buttons.label.extras.user),
                );

            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Leaderboard-map-${commanduser.id}-${input.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.leaderboard)
            );

            if (mapgraph) {
                Embed.setImage(`attachment://${mapgraph}.jpg`);
            }
            Embed.setColor(helper.tools.formatter.difficultyColour(+totaldiff).dec);

            if (detailed == 2) {
                const failval = useMapdata.failtimes.fail;
                const exitval = useMapdata.failtimes.exit;
                const numofval = [];
                for (let i = 0; i < failval.length; i++) {
                    numofval.push(`${i}s`);
                }
                const passInit = await helper.tools.other.graph(numofval, useMapdata.failtimes.fail, 'Fails', {
                    stacked: true,
                    type: 'bar',
                    showAxisX: false,
                    title: 'Fail times',
                    imgUrl: helper.tools.api.mapImages(mapdata.beatmapset_id).full,
                    blurImg: true,
                }, [{
                    data: useMapdata.failtimes.exit,
                    label: 'Exits',
                    separateAxis: false,
                }]);
                useFiles.push(passInit.path);

                const passurl = passInit.filename;
                const passEmbed = new Discord.EmbedBuilder()
                    .setURL(`https://osu.ppy.sh/beatmapsets/${mapdata.beatmapset_id}#${useMapdata.mode}/${mapdata.id}`)
                    .setImage(`attachment://${passurl}.jpg`);
                embeds.push(passEmbed);
            }
        }

        helper.tools.commands.storeButtonArgs(input.id, {
            mapId: mapid,
            mode: forceMode,
            modsInclude: mapmods,
            overrideBpm,
            overrideSpeed,
            ppCalc: isppCalc,
            detailed,
            filterTitle: maptitleq,
        });

        embeds.push(Embed);
        embeds.reverse();
        helper.tools.data.writePreviousId('map', input.message?.guildId ?? input.interaction?.guildId,
            {
                id: `${mapdata.id}`,
                apiData: null,
                mods: mapmods,
                mode: forceMode
            }
        );

        useComponents.push(buttons);

        let frmod = inputModalSearch;
        if (overwriteModal != null) {
            frmod = overwriteModal;
        }

        if (!(inputModalDiff.options.length < 1)) {
            useComponents.push(new Discord.ActionRowBuilder()
                .addComponents(inputModalDiff));
        }
        if (!(inputModalSearch.options.length < 1)) {
            useComponents.push(new Discord.ActionRowBuilder()
                .addComponents(frmod));
        }
        if (overwriteModal) {
            useComponents.push(new Discord.ActionRowBuilder()
                .addComponents(overwriteModal));
        }

        use = {
            content: useContent,
            embeds: embeds,
            components: useComponents,
            files: useFiles,
            edit: true
        };

    }
    helper.tools.data.writePreviousId('map', input.message?.guildId ?? input.interaction?.guildId,
        {
            id: `${mapdata.id}`,
            apiData: null,
            mods: null,
            mode: forceMode
        }
    );




    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: use,
        // {
        //     content: useContent,
        //     embeds: embeds,
        //     components: useComponents,
        //     files: useFiles,
        //     edit: true
        // }
    }, input.canReply);
};

/**
 * returns a random map
 */
export const randomMap = async (input: bottypes.commandInput) => {

    type thingyFr = 'Ranked' | 'Loved' | 'Approved' | 'Qualified' | 'Pending' | 'WIP' | 'Graveyard';
    let commanduser: Discord.User | Discord.APIUser;
    let mapType: thingyFr = null;
    let useRandomRanked: boolean = false;

    switch (input.type) {
        case 'message': {
            if (input.args.includes('-leaderboard')) {
                useRandomRanked = true;
                input.args.splice(input.args.indexOf('-leaderboard'), 1);
            }
            if (input.args.includes('-lb')) {
                useRandomRanked = true;
                input.args.splice(input.args.indexOf('-lb'), 1);
            }
            const mapTypeRankedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapRanked, input.args, false, null, false, false);
            if (mapTypeRankedArgFinder.found) {
                mapType = 'Ranked';
                input.args = mapTypeRankedArgFinder.args;
            }
            const mapTypeLovedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapLove, input.args, false, null, false, false);
            if (mapTypeLovedArgFinder.found) {
                mapType = 'Loved';
                input.args = mapTypeLovedArgFinder.args;
            }
            const mapTypeApprovedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapApprove, input.args, false, null, false, false);
            if (mapTypeApprovedArgFinder.found) {
                mapType = 'Approved';
                input.args = mapTypeApprovedArgFinder.args;
            }
            const mapTypeQualifiedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapQualified, input.args, false, null, false, false);
            if (mapTypeQualifiedArgFinder.found) {
                mapType = 'Qualified';
                input.args = mapTypeQualifiedArgFinder.args;
            }
            const mapTypePendArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapPending, input.args, false, null, false, false);
            if (mapTypePendArgFinder.found) {
                mapType = 'Pending';
                input.args = mapTypePendArgFinder.args;
            }
            const mapTypeWipArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapWip, input.args, false, null, false, false);
            if (mapTypeWipArgFinder.found) {
                mapType = 'WIP';
                input.args = mapTypeWipArgFinder.args;
            }
            const mapTypeGraveyardArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapGraveyard, input.args, false, null, false, false);
            if (mapTypeGraveyardArgFinder.found) {
                mapType = 'Graveyard';
                input.args = mapTypeGraveyardArgFinder.args;
            }
            input.args = helper.tools.commands.cleanArgs(input.args);
        } case 'link': {
            commanduser = input.message.author;
        }
            break;

        case 'interaction':
        case 'button': {
            commanduser = input.interaction?.member?.user ?? input.interaction?.user;
        }
    }
    helper.tools.log.commandOptions(
        [{
            name: 'Map type',
            value: mapType
        },
        {
            name: 'Random ranked type',
            value: `${useRandomRanked}`
        }],
        input.id,
        'map (random)',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );



    let txt = '';

    if (useRandomRanked) {
        const arr: ('Ranked' | 'Loved' | 'Approved')[] = ['Ranked', 'Loved', 'Approved'];
        mapType = arr[Math.floor(Math.random() * arr.length)];
    }

    const randomMap = helper.tools.data.randomMap(mapType);
    if (randomMap.err != null) {
        txt = randomMap.err;
    } else {
        txt = `https://osu.ppy.sh/b/${randomMap.returnId}`;
    }
    const embed = new Discord.EmbedBuilder()
        .setTitle('Random map')
        .setDescription(txt);

    if (randomMap.err == null) {
        input.overrides = {
            id: randomMap.returnId,
            commanduser,
            commandAs: input.type
        };

        await map(input);
        return;
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed]
        }
    }, input.canReply);
};

export const recMap = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    let searchid: string;
    let user: string;
    let maxRange: number = 1;
    let useType: 'closest' | 'random' = 'random';
    let mode: apitypes.GameMode;

    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;
            const usetypeRandomArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['r', 'random', 'f2', 'rdm', 'range', 'diff']), input.args, true, 'number', false, false);
            if (usetypeRandomArgFinder.found) {
                maxRange = usetypeRandomArgFinder.output;
                useType = 'random';
                input.args = usetypeRandomArgFinder.args;
            }
            if (input.args.includes('-closest')) {
                useType = 'closest';
                input.args = input.args.splice(input.args.indexOf('-closest'), 1);

            }
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = helper.tools.commands.cleanArgs(input.args);
            user = input.args.join(' ')?.replaceAll('"', '');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null;
            }
            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
        }
            break;

        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
            searchid = interaction?.member?.user.id ?? interaction?.user.id;
        }


            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? input.interaction?.user;
            searchid = interaction?.member?.user.id ?? interaction?.user.id;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Search ID',
                value: searchid
            },
            {
                name: 'Range',
                value: maxRange
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'type',
                value: useType
            }
        ],
        input.id,
        'map (recommend)',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    //if user is null, use searchid
    if (user == null) {
        const cuser = await helper.tools.data.searchUser(searchid, true);
        user = cuser.username;
        if (mode == null) {
            mode = cuser.gamemode;
        }
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = helper.vars.client.users.cache.get(searchid);
        user = cuser.username;
    }

    if (maxRange < 0.5 || !maxRange) {
        maxRange = 0.5;
    }

    let osudataReq: tooltypes.apiReturn<apitypes.User>;


    if (helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode)) &&
        !('error' in helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode))) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode));
    } else {
        osudataReq = await helper.tools.api.getUser(user, 'osu', []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'recmap', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    helper.tools.data.debug(osudataReq, 'command', 'osu', input.message?.guildId ?? input.interaction?.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'recmap', true, helper.vars.errors.noUser(user), true);
        return;
    }

    const randomMap = helper.tools.data.recommendMap(JSON.parse((osumodcalc.recdiff(osudata.statistics.pp)).toFixed(2)), useType, mode, maxRange ?? 1);
    const exTxt =
        useType == 'closest' ? '' :
            `Random map within ${maxRange}⭐ of ${(osumodcalc.recdiff(osudata.statistics.pp))?.toFixed(2)}
Pool of ${randomMap.poolSize}
`;

    const embed = new Discord.EmbedBuilder();
    if (!isNaN(randomMap.mapid)) {
        input.overrides = {
            id: randomMap.mapid,
            commanduser,
            commandAs: input.type,
            ex: exTxt
        };

        await map(input);
        return;
    } else {
        embed
            .setTitle('Error')
            .setDescription(`${randomMap.err}`);
    }



    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed]
        }
    }, input.canReply);
};

/**
 * parse .osu file and return data
 */
// export const maplocal = async (input: bottypes.commandInput) => {

//     let commanduser: Discord.User | Discord.APIUser;

//     const useFiles = [];
//     let mods = 'NM';

//     switch (input.type) {
//         case 'message': case 'link': {

//             commanduser = input.message.author;
//             if (input.message.content.includes('+')) {
//                 mods = input.message.content.split('+')[1];
//                 mods.includes(' ') ? mods = mods.split(' ')[0] : null;
//             }
//         }
//             break;



//         case 'interaction': {

//             commanduser = interaction?.member?.user ?? interaction?.user;
//         }



//             break;
//         case 'button': {

//             commanduser = interaction?.member?.user ?? interaction?.user;
//         }
//             break;
//     }



//     log.logCommand({
//         event: 'Command',
//         commandType: input.type,
//         commandId: input.id,
//         commanduser,
//         object: input.obj,
//         config: helper.vars.config,
//         commandName: 'map (file)',
//         options: [],
//     });


//     let mapPath: string = '';
//     if (fs.existsSync(`${filespath}/localmaps/${input.id}.osu`)) {
//         mapPath = `${filespath}/localmaps/${input.id}.osu`;
//     } else {
//         return;
//     }

//     let errtxt = '';
//     const decoder = new osuparsers.BeatmapDecoder();
//     const mapParsed: osuclasses.Beatmap = await decoder.decodeFromPath(mapPath, true);
//     helper.tools.data.debug(mapParsed, 'fileparse', 'map (file)', input.message?.guildId ?? input.interaction?.guildId, 'map');
//     let clockRate = 1;
//     if (mods.includes('DT') || mods.includes('NC')) {
//         clockRate = 1.5;
//     } else if (mods.includes('HT') || mods.includes('DC')) {
//         clockRate = 0.75;
//     }
//     /**
//      * msperbeat - +mapParsed?.controlPoints?.timingPoints[0]._beatLength
//      * s per beat - /1000
//      * 60/sperbeat
//      * bpm
//      * 
//      */
//     const valCalc = osumodcalc.calcValues(
//         +mapParsed?.difficulty?.circleSize,
//         +mapParsed?.difficulty?.approachRate,
//         +mapParsed?.difficulty?.overallDifficulty,
//         +mapParsed?.difficulty?.drainRate,
//         60 / (+mapParsed?.controlPoints?.timingPoints[0]?.beatLength / 1000),
//         (+mapParsed?.totalLength) / 1000,
//         mods
//     );

//     let circleob = 0;
//     let sliderob = 0;
//     let spinnerob = 0;
//     for (const object of mapParsed.hitObjects) {
//         if (
//             object.hasOwnProperty("repeats") ||
//             object.hasOwnProperty("velocity") ||
//             object.hasOwnProperty("path") ||
//             object.hasOwnProperty("legacyLastTickOffset") ||
//             object.hasOwnProperty("nodeSamples")
//         ) {
//             sliderob++;
//         } else if (object.hasOwnProperty("endTime")) {
//             spinnerob++;
//         } else {
//             circleob++;
//         }
//     }

//     let ppcalcing: rosu.PerformanceAttributes[];
//     try {
//         ppcalcing = await osufunc.mapcalclocal(mods, 'osu', mapPath, 0);
//     } catch (error) {
//         ppcalcing = await osufunc.mapcalclocal(mods, 'osu', `${filespath}/errmap.osu`, 0);
//         errtxt += '\nError - pp calculations failed';
//     }
//     let strains;
//     let mapgraph;
//     try {
//         strains = await osufunc.straincalclocal(mapPath, mods, 0, osumodcalc.ModeIntToName(mapParsed?.mode));
//     } catch (error) {
//         errtxt += '\nError - strains calculation failed';

//         strains = {
//             strainTime: [0, 0],
//             value: [0, 0]
//         };

//         strains = await osufunc.straincalclocal(`${filespath}/errmap.osu`, mods, 0, osumodcalc.ModeIntToName(mapParsed?.mode));
//     }
//     helper.tools.data.debug(strains, 'fileparse', 'map (file)', input.message?.guildId ?? input.interaction?.guildId, 'strains');
//     try {
//         const mapgraphInit = await
//             await func.graph(strains.strainTime, strains.value, 'Strains', {
//                 startzero: true,
//                 type: 'bar',
//                 fill: true,
//                 displayLegend: true,
//                 barOutline: true
//             });
//         useFiles.push(mapgraphInit.path);

//         mapgraph = mapgraphInit.filename;
//     } catch (error) {
//         await helper.tools.commands.sendMessage({
//             type: input.type,
//             message: input.message,
//             args: {
//                 content: helper.vars.errors.uErr.osu.map.strains_graph,
//                 edit: true
//             }
//         }, input.canReply);
//     }
//     let osuEmbed;
//     try {
//         osuEmbed = new Discord.EmbedBuilder()
//             .setFooter({
//                 text: `${embedStyle}`
//             })
//             .setTitle(`${mapParsed?.metadata.artist} - ${mapParsed?.metadata.title} [${mapParsed?.metadata?.version}]`)
//             .addFields([
//                 {
//                     name: 'MAP VALUES',
//                     value:
//                         `
// CS${valCalc.cs}
// AR${valCalc.ar} 
// OD${valCalc.od} 
// HP${valCalc.hp}
// ⭐${ppcalcing[0]?.difficulty?.stars?.toFixed(2)}
// `,
//                     inline: true
//                 },
//                 {
//                     name: def.invisbleChar,
//                     value: `
// ${helper.vars.emojis.mapobjs.circle}${circleob}
// ${helper.vars.emojis.mapobjs.slider}${sliderob}
// ${helper.vars.emojis.mapobjs.spinner}${spinnerob}
// ${helper.vars.emojis.mapobjs.total_length}${calc.secondsToTime((valCalc.length))}
// ${helper.vars.emojis.mapobjs.bpm}${valCalc.bpm}
// `,
//                     inline: true
//                 },
//                 {
//                     name: 'PP',
//                     value:
//                         `SS: ${ppcalcing[0].pp.toFixed(2)} \n ` +
//                         `99: ${ppcalcing[1].pp.toFixed(2)} \n ` +
//                         `98: ${ppcalcing[2].pp.toFixed(2)} \n ` +
//                         `97: ${ppcalcing[3].pp.toFixed(2)} \n ` +
//                         `96: ${ppcalcing[4].pp.toFixed(2)} \n ` +
//                         `95: ${ppcalcing[5].pp.toFixed(2)} \n `,
//                     inline: true
//                 }
//             ])
//             .setDescription(`
// Mapped by ${mapParsed?.metadata?.creator}
// Mode: ${helper.vars.config.usehelper.vars.emojis.gamemodes ? helper.vars.emojis.gamemodes[osumodcalc.ModeIntToName(mapParsed.mode)] : mapParsed.mode}
// File format: ${mapParsed.fileFormat}
// Map Creator: ${mapParsed.metadata.creator}
// Last Updated: <t:${Math.floor((new Date(mapParsed?.fileUpdateDate)).getTime() / 1000)}:R>
// HitObjects: ${mapParsed.hitObjects?.length}
// `)
//             .setImage(`attachment://${mapgraph}.jpg`);
//     } catch (error) {
//         await helper.tools.commands.sendMessage({
//             type: input.type,
//             message: input.message,
//             args: {
//                 content: `Error - `,
//                 edit: true
//             }
//         }, input.canReply);
//         console.log(error);
//         return;
//     }

//     await helper.tools.commands.sendMessage({
//         type: input.type,
//         message: input.message,
//         args: {
//             embeds: [osuEmbed],
//             files: useFiles
//         }
//     }, input.canReply
//     );
// };

/**
 * list of user's maps
 */
export const userBeatmaps = async (input: bottypes.commandInput) => {
    let filter: bottypes.ubmFilter = 'favourite';

    let sort: bottypes.ubmSort = 'dateadded';
    let reverse = false;
    let user;
    let searchid;
    let page = 1;
    let parseMap = false;
    let parseId;
    let filterTitle = null;

    let commanduser: Discord.User | Discord.APIUser;
    let reachedMaxCount = false;

    const mode: apitypes.GameMode = 'osu';

    let mapDetailed: number = 1;

    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;

            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
            const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, input.args, true, 'number', false, true);
            if (pageArgFinder.found) {
                page = pageArgFinder.output;
                input.args = pageArgFinder.args;
            }

            const detailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.details, input.args, false, null, false, false);
            if (detailArgFinder.found) {
                mapDetailed = 2;
                input.args = detailArgFinder.args;
            }
            const filterRankArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapRanked, input.args, false, null, false, false);
            if (filterRankArgFinder.found) {
                filter = 'ranked';
                input.args = filterRankArgFinder.args;
            }
            const filterFavouritesArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapFavourite, input.args, false, null, false, false);
            if (filterFavouritesArgFinder.found) {
                filter = 'favourite';
                input.args = filterFavouritesArgFinder.args;
            }
            const filterGraveyardArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapGraveyard, input.args, false, null, false, false);
            if (filterGraveyardArgFinder.found) {
                filter = 'graveyard';
                input.args = filterGraveyardArgFinder.args;
            }
            const filterLovedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapLove, input.args, false, null, false, false);
            if (filterLovedArgFinder.found) {
                filter = 'loved';
                input.args = filterLovedArgFinder.args;
            }
            const filterPendingArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapPending, input.args, false, null, false, false);
            if (filterPendingArgFinder.found) {
                filter = 'pending';
                input.args = filterPendingArgFinder.args;
            }
            const filterNominatedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapNominated, input.args, false, null, false, false);
            if (filterNominatedArgFinder.found) {
                filter = 'nominated';
                input.args = filterNominatedArgFinder.args;
            }
            const filterGuestArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapGuest, input.args, false, null, false, false);
            if (filterGuestArgFinder.found) {
                filter = 'guest';
                input.args = filterGuestArgFinder.args;
            }
            const filterMostPlayedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapMostPlayed, input.args, false, null, false, false);
            if (filterMostPlayedArgFinder.found) {
                filter = 'most_played';
                input.args = filterMostPlayedArgFinder.args;
            }
            if (input.args.includes('-reverse')) {
                reverse = true;
                input.args.splice(input.args.indexOf('-reverse'), 1);
            }
            if (input.args.includes('-parse')) {
                parseMap = true;
                const temp = helper.tools.commands.parseArg(input.args, '-parse', 'number', 1, null, true);
                parseId = temp.value;
                input.args = temp.newArgs;
            }

            if (input.args.includes('-?')) {
                const temp = helper.tools.commands.parseArg(input.args, '-?', 'string', filterTitle, true);
                filterTitle = temp.value;
                input.args = temp.newArgs;
            }

            input.args = helper.tools.commands.cleanArgs(input.args);

            const usertemp = helper.tools.commands.fetchUser(input.args.join(' '));
            user = usertemp.id;
            if (!user || user.includes(searchid)) {
                user = null;
            }
        }
            break;

        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
            searchid = commanduser.id;

            user = interaction.options.getString('user') ?? null;
            filter = (interaction.options.getString('type') ?? 'favourite') as bottypes.ubmFilter;
            sort = (interaction.options.getString('sort') ?? 'dateadded') as bottypes.ubmSort;
            reverse = interaction.options.getBoolean('reverse') ?? false;
            filterTitle = interaction.options.getString('filter');

            parseId = interaction.options.getInteger('parse');
            if (parseId != null) {
                parseMap = true;
            }

        }


            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;

            const temp = helper.tools.commands.getButtonArgs(input.id);
            if (temp.error) {
                interaction.followUp({
                    content: helper.vars.errors.paramFileMissing,
                    flags: Discord.MessageFlags.Ephemeral,
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            searchid = temp.searchid;
            user = temp.user;
            filter = temp.mapType;
            sort = temp.sortMap;
            reverse = temp.reverse;
            page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, input.buttonType);
            parseMap = temp.parse;
            parseId = temp.parseId;
            filterTitle = temp.filterTitle;
            // mode = temp.mode;
            mapDetailed = helper.tools.commands.buttonDetail(temp.detailed, input.buttonType);
        }
            break;
    }
    if (input.overrides) {
        if (input.overrides.page) {
            page = input.overrides.page;
        }
        if (input.overrides.ex) {
            switch (input.overrides.ex) {
                case 'ranked':
                    filter = 'ranked';
                    break;
                case 'favourite':
                    filter = 'favourite';
                    break;
                case 'graveyard':
                    filter = 'graveyard';
                    break;
                case 'loved':
                    filter = 'loved';
                    break;
                case 'pending':
                    filter = 'pending';
                    break;
                case 'nominated':
                    filter = 'nominated';
                    break;
                case 'guest':
                    filter = 'guest';
                    break;
                case 'most_played':
                    filter = 'most_played';
                    break;
            }
        }
    }


    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('userbeatmaps', commanduser, input.id);

    helper.tools.log.commandOptions(
        [
            {
                name: 'User',
                value: user
            },
            {
                name: 'Type',
                value: filter
            },
            {
                name: 'Reverse',
                value: `${reverse}`
            },
            {
                name: 'Page',
                value: `${page}`
            },
            {
                name: 'Sort',
                value: sort
            },
            {
                name: 'Parse',
                value: `${parseId}`
            },
            {
                name: 'Filter',
                value: filterTitle
            },
            {
                name: 'Detailed',
                value: mapDetailed
            }
        ],
        input.id,
        'userbeatmaps',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );



    const buttons = new Discord.ActionRowBuilder();

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;

    //if user is null, use searchid
    if (user == null) {
        const cuser = await helper.tools.data.searchUser(searchid, true);
        user = cuser.username;
    }

    //if user is not found in database, use discord username
    if (user == null) {
        const cuser = helper.vars.client.users.cache.get(searchid);
        user = cuser.username;
    }
    if (input.type == 'interaction') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: 'Loading...'
            }
        }, input.canReply);
    }
    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator('osu')) &&
        !('error' in helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator('osu'))) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator('osu'));
    } else {
        osudataReq = await helper.tools.api.getUser(user, helper.tools.other.modeValidator('osu'), []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'userbeatmaps', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    helper.tools.data.debug(osudataReq, 'command', 'userbeatmaps', input.message?.guildId ?? input.interaction?.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'userbeatmaps', true, helper.vars.errors.noUser(user), true);
        return;
    }

    helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(mode), 'User');

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator('osu'));
    helper.tools.data.storeFile(osudataReq, user, 'osudata', helper.tools.other.modeValidator('osu'));

    buttons.addComponents(
        new Discord.ButtonBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-User-userbeatmaps-any-${input.id}-${osudata.id}+${osudata.playmode}`)
            .setStyle(helper.vars.buttons.type.current)
            .setEmoji(helper.vars.buttons.label.extras.user),
    );

    let maplistdata: (apitypes.Beatmapset[] & apitypes.Error | apitypes.BeatmapPlayCountArr) = [];

    async function getScoreCount(cinitnum) {
        if (cinitnum >= 499) {
            reachedMaxCount = true;
            return;
        }
        const fdReq: tooltypes.apiReturn = await helper.tools.api.getUserMaps(osudata.id, filter, [`offset=${cinitnum}`]);
        const fd = fdReq.apiData;
        if (fdReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'userbeatmaps', true, helper.vars.errors.uErr.osu.map.group_nf.replace('[TYPE]', filter), false);
            return;
        }
        if (fd?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(input, 'userbeatmaps', true, helper.vars.errors.uErr.osu.map.group_nf.replace('[TYPE]', filter), true);
            return;
        }
        for (let i = 0; i < fd.length; i++) {
            if (!fd[i] || typeof fd[i] == 'undefined') { break; }
            maplistdata.push(fd[i]);
        }
        if (fd.length == 100 && filter != 'most_played') {
            await getScoreCount(cinitnum + 100);
        }

    }

    if (helper.tools.data.findFile(osudata.id, 'maplistdata', null, filter) &&
        !('error' in helper.tools.data.findFile(osudata.id, 'maplistdata', null, filter)) &&
        input.buttonType != 'Refresh'
    ) {
        maplistdata = helper.tools.data.findFile(osudata.id, 'maplistdata', null, filter);
    } else {
        await getScoreCount(0);
    }

    helper.tools.data.debug(maplistdata, 'command', 'userbeatmaps', input.message?.guildId ?? input.interaction?.guildId, 'mapListData');
    helper.tools.data.storeFile(maplistdata, osudata.id, 'maplistdata', null, filter);

    if (parseMap) {
        if (filterTitle) {
            switch (filter) {
                case 'most_played':
                    maplistdata = helper.tools.formatter.filterMapPlays(maplistdata as apitypes.BeatmapPlayCountArr,
                        sort as any, {
                        title: filterTitle
                    }, reverse);
                    break;
                default:
                    maplistdata = helper.tools.formatter.filterMaps(maplistdata as apitypes.Beatmapset[],
                        sort as any, {
                        title: filterTitle
                    }, reverse);
                    break;
            }

        }
        let pid = parseInt(parseId) - 1;
        if (pid < 0) {
            pid = 0;
        }
        if (pid > maplistdata.length) {
            pid = maplistdata.length - 1;
        }
        input.overrides = {
            id:
                filter == 'most_played' ?
                    (maplistdata as apitypes.BeatmapPlayCountArr)[pid]?.beatmap_id :
                    (maplistdata as apitypes.Beatmapset[])[pid]?.beatmaps[0]?.id,
            commanduser,
            commandAs: input.type
        };
        if (input.overrides.id == null) {
            await helper.tools.commands.errorAndAbort(input, 'userbeatmaps', true, helper.vars.errors.uErr.osu.map.m_uk + `at index ${pid}`, true);
            return;
        }
        input.type = 'other';
        await map(input);
        return;
    }

    if (page >= Math.ceil(maplistdata.length / 5)) {
        page = Math.ceil(maplistdata.length / 5) - 1;
    }
    let mapsarg: {
        text: string;
        curPage: number;
        maxPage: number;
    };
    switch (filter) {
        case 'most_played':
            mapsarg = helper.tools.formatter.mapPlaysList(maplistdata as apitypes.BeatmapPlayCountArr,
                sort as any, {
                title: filterTitle
            },
                reverse, page);
            break;
        default:
            mapsarg = helper.tools.formatter.mapList(maplistdata as apitypes.Beatmapset[],
                sort as any, {
                title: filterTitle
            },
                reverse, page);
            break;
    }
    helper.tools.commands.storeButtonArgs(input.id, {
        searchid,
        user,
        mapType: filter,
        sortMap: sort,
        reverse,
        page: page + 1,
        maxPage: mapsarg.maxPage,
        parse: parseMap,
        parseId,
        filterTitle,
        detailed: mapDetailed
    });
    const mapList = new Discord.EmbedBuilder()
        .setFooter({
            text: `${mapsarg.curPage}/${mapsarg.maxPage}`
        })
        .setTitle(`${osudata.username}'s ${helper.tools.formatter.toCapital(filter)} Maps`)
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
        .setAuthor({
            name: `#${helper.tools.calculate.separateNum(osudata?.statistics?.global_rank)} | #${helper.tools.calculate.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${helper.tools.calculate.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuhelper.vars.argflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osudata.playmode}#beatmaps`)
        .setColor(helper.vars.colours.embedColour.userlist.dec)
        .setDescription(reachedMaxCount ? 'Only the first 500 mapsets are shown\n\n' : '\n\n' + mapsarg.text);

    if (mapsarg.text.length == 0) {
        mapList.setDescription('No mapsets found');
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[2].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    if (mapsarg.curPage <= 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (mapsarg.curPage >= mapsarg.maxPage) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            edit: true,
            embeds: [mapList],
            components: [pgbuttons, buttons]
        }
    }, input.canReply);
};