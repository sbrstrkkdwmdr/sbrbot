import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as rosu from 'rosu-pp-js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';
import { Command, OsuCommand } from './command.js';

export class Map extends OsuCommand {
    declare protected args: {
        mapid;
        mapmods: string;
        maptitleq: string;
        detailed: number;
        isppCalc: boolean;
        searchRestrict: string;
        overrideSpeed: number;
        overrideBpm: number;
        overwriteModal: Discord.StringSelectMenuComponent | Discord.StringSelectMenuBuilder;
        customCS: 'current' | number;
        customAR: 'current' | number;
        customOD: 'current' | number;
        customHP: 'current' | number;
        showBg: boolean;
        forceMode: apitypes.GameMode;
    };
    constructor() {
        super();
        this.args = {
            mapid: undefined,
            mapmods: undefined,
            maptitleq: null,
            detailed: 1,
            isppCalc: false,
            searchRestrict: 'any',
            overrideSpeed: 1,
            overrideBpm: null,
            overwriteModal: null,
            customCS: 'current',
            customAR: 'current',
            customOD: 'current',
            customHP: 'current',
            showBg: false,
            forceMode: 'osu',
        };
    }
    async setArgsMsg() {
        const detailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.details, this.input.args, false, null, false, false);
        if (detailArgFinder.found) {
            this.args.detailed = 2;
            this.input.args = detailArgFinder.args;
        }
        if (this.input.args.includes('-bpm')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-bpm', 'number', this.args.overrideBpm);
            this.args.overrideBpm = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-speed')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-speed', 'number', this.args.overrideSpeed);
            this.args.overrideSpeed = temp.value;
            this.input.args = temp.newArgs;
        }

        if (this.input.args.includes('-cs')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-cs', 'number', this.args.customCS);
            this.args.customCS = temp.value;
            this.input.args = temp.newArgs;
        }
        if (this.input.args.includes('-ar')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-ar', 'number', this.args.customAR);
            this.args.customAR = temp.value;
            this.input.args = temp.newArgs;
        }
        const customODArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['od', 'accuracy',]), this.input.args, true, 'number', false, false);
        if (customODArgFinder.found) {
            this.args.customOD = customODArgFinder.output;
            this.input.args = customODArgFinder.args;
        }
        const customHPArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['hp', 'drain', 'health']), this.input.args, true, 'number', false, false);
        if (customHPArgFinder.found) {
            this.args.customHP = customHPArgFinder.output;
            this.input.args = customHPArgFinder.args;
        }

        if (this.input.args.includes('-?')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-?', 'string', this.args.maptitleq, true);
            this.args.maptitleq = temp.value;
            this.input.args = temp.newArgs;
        }

        if (this.input.args.join(' ').includes('"')) {
            this.args.maptitleq = this.input.args.join(' ').substring(
                this.input.args.join(' ').indexOf('"') + 1,
                this.input.args.join(' ').lastIndexOf('"')
            );
            this.input.args = this.input.args.join(' ').replace(this.args.maptitleq, '').split(' ');
        }
        if (this.input.args.join(' ').includes('+')) {
            this.args.mapmods = this.input.args.join(' ').split('+')[1];
            this.args.mapmods.includes(' ') ? this.args.mapmods = this.args.mapmods.split(' ')[0] : null;
            this.input.args = this.input.args.join(' ').replace('+', '').replace(this.args.mapmods, '').split(' ');
        }

        if (this.input.args.includes('-bg')) {
            this.args.showBg = true;
        }
        const isppCalcArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['pp', 'calc', 'performance']), this.input.args, false, null, false, false);
        if (isppCalcArgFinder.found) {
            this.args.isppCalc = true;
            this.input.args = isppCalcArgFinder.args;
        }

        const modeTemp = await helper.tools.commands.parseArgsMode(this.input);
        this.args.forceMode = modeTemp.mode;
        this.input.args = modeTemp.args;

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);
        const mapTemp = await helper.tools.commands.mapIdFromLink(this.input.args.join(' '), true);
        this.args.mapid = mapTemp.map;
        mapTemp.mode ? this.args.forceMode = mapTemp.mode : null;
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.args.mapid = interaction.options.getInteger('id');
        this.args.mapmods = interaction.options.getString('mods');
        this.args.detailed = interaction.options.getBoolean('detailed') ? 2 : 1;
        this.args.maptitleq = interaction.options.getString('query');
        interaction.options.getNumber('bpm') ? this.args.overrideBpm = interaction.options.getNumber('bpm') : null;
        interaction.options.getNumber('speed') ? this.args.overrideSpeed = interaction.options.getNumber('speed') : null;

    }
    async setArgsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        const temp = helper.tools.commands.getButtonArgs(this.input.id);
        if (temp.error) {
            interaction.followUp({
                content: helper.vars.errors.paramFileMissing,
                flags: Discord.MessageFlags.Ephemeral,
                allowedMentions: { repliedUser: false }
            });
            helper.tools.commands.disableAllButtons(this.input.message);
            return;
        }
        this.args.mapid = temp.mapId;
        this.args.forceMode = temp.mode;
        this.args.mapmods = temp.modsInclude;
        this.args.overrideBpm = temp.overrideBpm;
        this.args.overrideSpeed = temp.overrideSpeed;
        this.args.isppCalc = temp.ppCalc;
        this.args.detailed = helper.tools.commands.buttonDetail(temp.detailed, this.input.buttonType);
    }
    async setArgsLink() {
        const messagenohttp = this.input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
        this.args.mapmods =
            this.input.message.content.includes('+') ?
                messagenohttp.split('+')[1] : 'NM';
        if (this.input.args[0] && this.input.args[0].startsWith('query')) {
            this.args.maptitleq = this.input.args[1];
        } else if (messagenohttp.includes('q=')) {
            this.args.maptitleq =
                messagenohttp.includes('&') ?
                    messagenohttp.split('q=')[1].split('&')[0] :
                    messagenohttp.split('q=')[1];
        } else {
            const mapTemp = await helper.tools.commands.mapIdFromLink(messagenohttp, true,);
            this.args.mapid = mapTemp.map;
            this.args.forceMode = mapTemp.mode ?? this.args.forceMode;
            if (!(mapTemp.map || mapTemp.set)) {
                await helper.tools.commands.sendMessage({
                    type: this.input.type,
                    message: this.input.message,
                    interaction: this.input.interaction,
                    args: {
                        content: helper.vars.errors.uErr.osu.map.url,
                        edit: true
                    }
                }, this.input.canReply);
                return;
            }
            //get map id via mapset if not in the given URL
            if (!mapTemp.map && mapTemp.set) {
                this.args.mapid = this.mapset?.beatmaps[0]?.id;
                try {
                    const bm = await this.getMapSet(this.map.beatmapset_id);
                    this.mapset = bm;
                    this.args.mapid = bm.beatmaps[0].id;
                } catch (e) {
                    return;
                }
            }
        }
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides?.overwriteModal != null) {
            this.args.overwriteModal = this.input?.overrides?.overwriteModal ?? this.args.overwriteModal;
        }
        if (this.input.overrides?.id != null) {
            this.args.mapid = this.input?.overrides?.id ?? this.args.mapid;
        }
        if (this.input.overrides?.commanduser != null) {
            this.commanduser = this.input.overrides.commanduser;
            this.ctn.content = `Requested by <@${this.commanduser.id}>\n`;
        }
        if (this.input.overrides?.commandAs != null) {
            this.input.type = this.input.overrides.commandAs;
        }
        if (this.input.overrides?.filterMods != null) {
            this.args.mapmods = this.input.overrides.filterMods;
        }
        if (this.input.overrides?.ex != null) {
            this.ctn.content += this.input.overrides?.ex;
        }
        if (this.input.overrides?.type != null) {
            this.args.isppCalc = true;
        }
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff
        const buttons = new Discord.ActionRowBuilder();
        if (this.args.isppCalc) {
            buttons.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Map-map-${this.commanduser.id}-${this.input.id}-${this.args.mapid}${this.args.mapmods && this.args.mapmods != 'NM' ? '+' + this.args.mapmods : ''}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.map)
            );
        } else {
            if (this.args.detailed == 2) {
                buttons.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-DetailDisable-map-${this.commanduser.id}-${this.input.id}`)
                        .setStyle(helper.vars.buttons.type.current)
                        .setEmoji(helper.vars.buttons.label.main.detailLess)
                );
            } else {
                buttons.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-DetailEnable-map-${this.commanduser.id}-${this.input.id}`)
                        .setStyle(helper.vars.buttons.type.current)
                        .setEmoji(helper.vars.buttons.label.main.detailMore)
                );
            }
        }

        if (!this.args.mapid) {
            const temp = helper.tools.data.getPreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId);
            this.args.mapid = temp.id;
            if (!this.args.mapmods || osumodcalc.OrderMods(this.args.mapmods).string.length == 0) {
                this.args.mapmods = temp.mods;
            }
            this.args.forceMode = temp.mode;
        }
        if (this.args.mapid == false) {
            helper.tools.commands.missingPrevID_map(this.input, 'map');
            return;
        }


        const inputModalDiff = new Discord.StringSelectMenuBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-Select-map-${this.commanduser.id}-${this.input.id}-diff`)
            .setPlaceholder('Select a difficulty');
        const inputModalSearch = new Discord.StringSelectMenuBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-Select-map-${this.commanduser.id}-${this.input.id}-search`)
            .setPlaceholder('Select a map');

        if (this.input.type == 'interaction') {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: 'Loading...'
                }
            }, this.input.canReply);
        }

        let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
        let bmsdataReq: tooltypes.apiReturn<apitypes.Beatmapset>;

        if (this.args.maptitleq == null) {
            try {
                const m = await this.getMap(this.args.mapid);
                this.map = m;
            } catch (e) {
                return;
            }

            try {
                const bm = await this.getMapSet(this.map.beatmapset_id);
                this.mapset = bm;
            } catch (e) {
                return;
            }

            if (this.args.maptitleq != null) {
                const mapidtestReq = await helper.tools.api.getMapSearch(encodeURIComponent(this.args.maptitleq), ['s=any']);
                const mapidtest = mapidtestReq.apiData as apitypes.BeatmapsetSearch;
                if (mapidtestReq?.error) {
                    await helper.tools.commands.errorAndAbort(this.input, 'map', true, helper.vars.errors.uErr.osu.map.search, false);
                    return;
                }
                helper.tools.data.debug(mapidtestReq, 'command', 'map', this.input.message?.guildId ?? this.input.interaction?.guildId, 'mapIdTestData');
                helper.tools.data.storeFile(mapidtestReq, this.args.maptitleq.replace(/[\W_]+/g, '').replaceAll(' ', '_'), 'mapQuerydata');

                if (mapidtest?.hasOwnProperty('error') && !mapidtest.hasOwnProperty('beatmapsets')) {
                    await helper.tools.commands.errorAndAbort(this.input, 'map', true, helper.vars.errors.uErr.osu.map.search, true);
                    return;
                }

                let usemapidpls;
                let mapidtest2;

                if (mapidtest.beatmapsets.length == 0) {
                    await helper.tools.commands.sendMessage({
                        type: this.input.type,
                        message: this.input.message,
                        interaction: this.input.interaction,
                        args: {
                            content: helper.vars.errors.uErr.osu.map.search_nf.replace('[INPUT]', this.args.maptitleq),
                            edit: true
                        }
                    }, this.input.canReply);

                    return;
                }
                try {
                    let matchedId = null;
                    // first check if any diff name matches the search
                    for (let i = 0; i < mapidtest.beatmapsets[0].beatmaps.length; i++) {
                        if (this.args.maptitleq.includes(mapidtest.beatmapsets[0].beatmaps[i].version)) {
                            matchedId = mapidtest.beatmapsets[0].beatmaps[i].id;
                        }
                    }

                    mapidtest2 = mapidtest.beatmapsets[0].beatmaps.sort((a, b) => b.difficulty_rating - a.difficulty_rating);
                    usemapidpls = matchedId ?? mapidtest2[0].id;
                } catch (error) {
                    await helper.tools.commands.sendMessage({
                        type: this.input.type,
                        message: this.input.message,
                        interaction: this.input.interaction,
                        args: {
                            content: `Error - could not sort maps`,
                            edit: true
                        }
                    }, this.input.canReply);
                    return;
                }

                try {
                    const m = await this.getMap(usemapidpls);
                    this.map = m;
                } catch (e) {
                    return;
                }
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

                try {
                    const bm = await this.getMapSet(this.map.beatmapset_id);
                    this.mapset = bm;
                } catch (e) {
                    return;
                }
            }

            if (typeof this.mapset?.beatmaps == 'undefined' || this.mapset?.beatmaps?.length < 2) {
                inputModalDiff.addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setEmoji(`${this.map.mode_int == 0 ? helper.vars.emojis.gamemodes.standard :
                            this.map.mode_int == 1 ? helper.vars.emojis.gamemodes.taiko :
                                this.map.mode_int == 2 ? helper.vars.emojis.gamemodes.fruits :
                                    this.map.mode_int == 3 ? helper.vars.emojis.gamemodes.mania :
                                        helper.vars.emojis.gamemodes.standard
                            }` as Discord.APIMessageComponentEmoji)
                        .setLabel(`${this.map.version}`)
                        .setDescription(`${this.map.difficulty_rating}⭐`)
                        .setValue(`${this.map.id}`)
                );
            } else {
                for (let i = 0; i < this.mapset.beatmaps.length && i < 25; i++) {
                    const curmap = this.mapset.beatmaps.slice().sort((a, b) => b.difficulty_rating - a.difficulty_rating)[i];
                    if (!curmap) break;
                    inputModalDiff.addOptions(
                        new Discord.StringSelectMenuOptionBuilder()
                            .setEmoji(`${this.map.mode_int == 0 ? helper.vars.emojis.gamemodes.standard :
                                this.map.mode_int == 1 ? helper.vars.emojis.gamemodes.taiko :
                                    this.map.mode_int == 2 ? helper.vars.emojis.gamemodes.fruits :
                                        this.map.mode_int == 3 ? helper.vars.emojis.gamemodes.mania :
                                            helper.vars.emojis.gamemodes.standard
                                }` as Discord.APIMessageComponentEmoji)
                            .setLabel(`${curmap.version}`)
                            .setDescription(`${curmap.difficulty_rating}⭐`)
                            .setValue(`${curmap.id}`)
                    );
                }
            }

            if (this.args.showBg) {
                const url = helper.tools.api.mapImages(this.map.beatmapset_id);
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
                this.ctn.embeds = [embed];
                this.ctn.edit = true;
            } else {
                //parsing maps
                if (this.args.mapmods == null || this.args.mapmods == '') {
                    this.args.mapmods = 'NM';
                }
                else {
                    this.args.mapmods = osumodcalc.modHandler(this.args.mapmods.toUpperCase(), this.map.mode).join();
                }

                //converts
                let useMapdata: apitypes.Beatmap = this.map;
                let successConvert: boolean = false;
                if (this.args.forceMode && this.args.forceMode != this.map.mode && this.args.forceMode != 'osu') {
                    for (const beatmap of this.mapset.converts) {
                        if (beatmap.mode == this.args.forceMode && beatmap.id == this.map.id) {
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

                if (this.args.customCS == 'current' || isNaN(+this.args.customCS)) {
                    this.args.customCS = useMapdata.cs;
                }
                if (this.args.customAR == 'current' || isNaN(+this.args.customAR)) {
                    this.args.customAR = useMapdata.ar;
                }
                if (this.args.customOD == 'current' || isNaN(+this.args.customOD)) {
                    this.args.customOD = useMapdata.accuracy;
                }
                if (this.args.customHP == 'current' || isNaN(+this.args.customHP)) {
                    this.args.customHP = useMapdata.drain;
                }

                let hitlength = useMapdata.hit_length;
                const oldOverrideSpeed = this.args.overrideSpeed;

                if (this.args.overrideBpm && !isNaN(this.args.overrideBpm) && (!this.args.overrideSpeed || isNaN(this.args.overrideSpeed) || this.args.overrideSpeed == 1) && this.args.overrideBpm != useMapdata.bpm) {
                    this.args.overrideSpeed = this.args.overrideBpm / useMapdata.bpm;
                }
                if (this.args.overrideSpeed && !isNaN(this.args.overrideSpeed) && (!this.args.overrideBpm || isNaN(this.args.overrideBpm)) && this.args.overrideSpeed != 1) {
                    this.args.overrideBpm = useMapdata.bpm * this.args.overrideSpeed;
                }
                if (this.args.mapmods.includes('DT') || this.args.mapmods.includes('NC')) {
                    this.args.overrideSpeed *= 1.5;
                    this.args.overrideBpm *= 1.5;
                }
                if (this.args.mapmods.includes('HT')) {
                    this.args.overrideSpeed *= 0.75;
                    this.args.overrideBpm *= 0.75;
                }
                if (this.args.overrideSpeed) {
                    hitlength /= this.args.overrideSpeed;
                }

                const inallvals = osumodcalc.calcValues(
                    +this.args.customCS,
                    +this.args.customAR,
                    +this.args.customOD,
                    +this.args.customHP,
                    this.args.overrideBpm ?? useMapdata.bpm,
                    hitlength,
                    this.args.mapmods
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
                        mods: this.args.mapmods,
                        mode: useMapdata.mode_int,
                        mapid: useMapdata.id,
                        clockRate: this.args.overrideSpeed,
                        customCS: this.args.customCS,
                        customAR: this.args.customAR,
                        customOD: this.args.customOD,
                        customHP: this.args.customHP,
                        mapLastUpdated: new Date(useMapdata.last_updated)
                    });
                    pphd = await helper.tools.performance.calcFullCombo({
                        mapid: useMapdata.id,
                        mods: 'HD',
                        mode: useMapdata.mode_int,
                        accuracy: 100,
                        customCS: this.args.customCS,
                        customAR: this.args.customAR,
                        customOD: this.args.customOD,
                        customHP: this.args.customHP,
                        mapLastUpdated: new Date(useMapdata.last_updated)
                    });
                    pphr = await helper.tools.performance.calcFullCombo({
                        mapid: useMapdata.id,
                        mods: 'HR',
                        mode: useMapdata.mode_int,
                        accuracy: 100,
                        customCS: this.args.customCS,
                        customAR: this.args.customAR,
                        customOD: this.args.customOD,
                        customHP: this.args.customHP,
                        mapLastUpdated: new Date(useMapdata.last_updated)
                    });
                    ppdt = await helper.tools.performance.calcFullCombo({
                        mapid: useMapdata.id,
                        mods: 'DT',
                        mode: useMapdata.mode_int,
                        accuracy: 100,
                        customCS: this.args.customCS,
                        customAR: this.args.customAR,
                        customOD: this.args.customOD,
                        customHP: this.args.customHP,
                        mapLastUpdated: new Date(useMapdata.last_updated)
                    });
                    pphdhr = await helper.tools.performance.calcFullCombo({
                        mapid: useMapdata.id,
                        mods: 'HDHR',
                        mode: useMapdata.mode_int,
                        accuracy: 100,
                        customCS: this.args.customCS,
                        customAR: this.args.customAR,
                        customOD: this.args.customOD,
                        customHP: this.args.customHP,
                        mapLastUpdated: new Date(useMapdata.last_updated)
                    });
                    pphddt = await helper.tools.performance.calcFullCombo({
                        mapid: useMapdata.id,
                        mods: 'HDDT',
                        mode: useMapdata.mode_int,
                        accuracy: 100,
                        customCS: this.args.customCS,
                        customAR: this.args.customAR,
                        customOD: this.args.customOD,
                        customHP: this.args.customHP,
                        mapLastUpdated: new Date(useMapdata.last_updated)
                    });
                    pphddthr = await helper.tools.performance.calcFullCombo({
                        mapid: useMapdata.id,
                        mods: 'HDDTHR',
                        mode: useMapdata.mode_int,
                        accuracy: 100,
                        customCS: this.args.customCS,
                        customAR: this.args.customAR,
                        customOD: this.args.customOD,
                        customHP: this.args.customHP,
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
                    helper.tools.data.debug(ppComputed, 'command', 'map', this.input.message?.guildId ?? this.input.interaction?.guildId, 'ppCalc');

                } catch (error) {
                    helper.tools.log.stdout(error);
                    ppissue = 'Error - pp could not be calculated';
                    const tstmods = this.args.mapmods.toUpperCase();

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
                const baseBPM = useMapdata.bpm * (this.args.overrideSpeed ?? 1) != useMapdata.bpm ? `${useMapdata.bpm}=>${useMapdata.bpm * (this.args.overrideSpeed ?? 1)}` : useMapdata.bpm;

                let basicvals = `CS${baseCS}\n AR${baseAR}\n OD${baseOD}\n HP${baseHP}\n`;

                const mapname = helper.tools.formatter.parseUnicodeStrings({
                    title: this.map.beatmapset.title,
                    artist: this.map.beatmapset.artist,
                    title_unicode: this.map.beatmapset.title_unicode,
                    artist_unicode: this.map.beatmapset.artist_unicode,
                    ignore: {
                        artist: false,
                        title: false
                    }
                }, 1);
                this.args.mapmods = this.args.mapmods.replace(',', '');
                const maptitle: string = this.args.mapmods ? `\`${mapname} [${this.map.version}]\` +${this.args.mapmods}` : `\`${mapname} [${this.map.version}]\``;
                const Embed = new Discord.EmbedBuilder()
                    .setURL(`https://osu.ppy.sh/beatmapsets/${this.map.beatmapset_id}#${useMapdata.mode}/${this.map.id}`)
                    .setThumbnail(helper.tools.api.mapImages(this.map.beatmapset_id).list2x)
                    .setTitle(maptitle);
                const embeds: Discord.EmbedBuilder[] = [];
                Embed.setColor(helper.tools.formatter.difficultyColour(+totaldiff).dec);
                if (this.args.isppCalc) {
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
                                    `${ppComputed[0].difficulty.maxCombo ?? this.map.max_combo}x combo\n ` +
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


                    if (this.args.detailed == 2) {
                        basicvals =
                            `CS${baseCS} (${allvals.details.csRadius?.toFixed(2)}r)
        AR${baseAR}  (${allvals.details.arMs?.toFixed(2)}ms)
        OD${baseOD} (300: ${allvals.details.odMs.hitwindow_300?.toFixed(2)}ms 100: ${allvals.details.odMs.hitwindow_100?.toFixed(2)}ms 50:  ${allvals.details.odMs.hitwindow_50?.toFixed(2)}ms)
        HP${baseHP}`;
                    }
                    const strains = await helper.tools.performance.calcStrains(
                        {
                            mapid: this.map.id,
                            mode: useMapdata.mode_int,
                            mods: this.args.mapmods,
                            mapLastUpdated: new Date(useMapdata.last_updated),
                        });
                    try {
                        helper.tools.data.debug(strains, 'command', 'map', this.input.message?.guildId ?? this.input.interaction?.guildId, 'strains');

                    } catch (error) {
                        helper.tools.data.debug({ error: error }, 'command', 'map', this.input.message?.guildId ?? this.input.interaction?.guildId, 'strains');
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
                                imgUrl: helper.tools.api.mapImages(this.map.beatmapset_id).full,
                                blurImg: true,
                            });
                        //@ts-expect-error attachment and builder overlap causes results in never
                        this.ctn.files.push(mapgraphInit.path);
                        mapgraph = mapgraphInit.filename;
                    } else {
                        mapgraph = null;
                    }
                    let detailedmapdata = '-';
                    if (this.args.detailed == 2) {
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

                    const exMapDetails = `${helper.tools.calculate.separateNum(useMapdata.playcount)} plays | ${helper.tools.calculate.separateNum(this.map.beatmapset.play_count)} mapset plays | ${helper.tools.calculate.separateNum(useMapdata.passcount)} passes | ${helper.tools.calculate.separateNum(this.map.beatmapset.favourite_count)} favourites\n` +
                        `Submitted <t:${new Date(this.map.beatmapset.submitted_date).getTime() / 1000}:R> | Last updated <t:${new Date(this.map.beatmapset.last_updated).getTime() / 1000}:R>
            ${this.map.status == 'ranked' ?
                            `Ranked <t:${Math.floor(new Date(this.map.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                        }${useMapdata.status == 'approved' || useMapdata.status == 'qualified' ?
                            `Approved/Qualified <t: ${Math.floor(new Date(this.map.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                        }${useMapdata.status == 'loved' ?
                            `Loved <t:${Math.floor(new Date(this.map.beatmapset.ranked_date).getTime() / 1000)}:R>` : ''
                        }\n` +
                        `${this.map.beatmapset.video ? '📺' : ''} ${this.map.beatmapset.storyboard ? '🎨' : ''}`;

                    Embed
                        .setAuthor({
                            name: `Mapped by ${this.map.beatmapset.creator}`,
                            url: `https://osu.ppy.sh/users/${this.mapset.user_id}`,
                            iconURL: `${this.mapset.user.avatar_url ?? helper.vars.defaults.images.any.url}`,
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
                                    this.args.detailed != 2 ?
                                        `SS: ${ppComputed[0].pp?.toFixed(2)} \n ` +
                                        `99: ${ppComputed[1].pp?.toFixed(2)} \n ` +
                                        `98: ${ppComputed[2].pp?.toFixed(2)} \n ` +
                                        `97: ${ppComputed[3].pp?.toFixed(2)} \n ` +
                                        `96: ${ppComputed[4].pp?.toFixed(2)} \n ` +
                                        `95: ${ppComputed[5].pp?.toFixed(2)} \n ` +
                                        `${ppissue}` :
                                        detailedmapdata
                                ,
                                inline: this.args.detailed != 2
                            },
                            {
                                name: 'DOWNLOAD',
                                value: `[osu!](https://osu.ppy.sh/b/${this.map.id}) | [Chimu](https://api.chimu.moe/v1/download${this.map.beatmapset_id}) | [Beatconnect](https://beatconnect.io/b/${this.map.beatmapset_id}) | [Kitsu](https://kitsu.io/d/${this.map.beatmapset_id})\n` +
                                    `[MAP PREVIEW](https://jmir.xyz/osu/preview.html#${this.map.id})`,
                                inline: false
                            }, // [osu!direct](osu://b/${this.map.id}) - discord doesn't support schemes other than http, https and discord
                            {
                                name: 'MAP DETAILS',
                                value: `${statusimg} | ${mapimg} | ${ppComputed[0].difficulty.maxCombo ?? this.map.max_combo}x combo \n ` +
                                    `${this.args.detailed == 2 ?
                                        exMapDetails
                                        : ''}`

                                ,
                                inline: false
                            }
                        ]);

                    if (this.map?.owners && !(this.map?.owners?.length == 1 && this.map?.owners?.[0].id == this.mapset.user_id)) {
                        Embed.setDescription("Guest difficulty by " + helper.tools.other.listItems(this.map.owners.map(x => `[${x.username}](https://osu.ppy.sh/u/${x.id})`)));
                    }
                    buttons
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId(`${helper.vars.versions.releaseDate}-User-map-any-${this.input.id}-${this.map.user_id}+${this.map.mode}`)
                                .setStyle(helper.vars.buttons.type.current)
                                .setEmoji(helper.vars.buttons.label.extras.user),
                        );

                    buttons.addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId(`${helper.vars.versions.releaseDate}-Leaderboard-map-${this.commanduser.id}-${this.input.id}`)
                            .setStyle(helper.vars.buttons.type.current)
                            .setEmoji(helper.vars.buttons.label.extras.leaderboard)
                    );

                    if (mapgraph) {
                        Embed.setImage(`attachment://${mapgraph}.jpg`);
                    }
                    Embed.setColor(helper.tools.formatter.difficultyColour(+totaldiff).dec);

                    if (this.args.detailed == 2) {
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
                            imgUrl: helper.tools.api.mapImages(this.map.beatmapset_id).full,
                            blurImg: true,
                        }, [{
                            data: useMapdata.failtimes.exit,
                            label: 'Exits',
                            separateAxis: false,
                        }]);
                        //@ts-expect-error attachment and builder overlap causes results in never
                        this.ctn.files.push(passInit.path);

                        const passurl = passInit.filename;
                        const passEmbed = new Discord.EmbedBuilder()
                            .setURL(`https://osu.ppy.sh/beatmapsets/${this.map.beatmapset_id}#${useMapdata.mode}/${this.map.id}`)
                            .setImage(`attachment://${passurl}.jpg`);
                        embeds.push(passEmbed);
                    }
                }

                helper.tools.commands.storeButtonArgs(this.input.id, {
                    mapId: this.args.mapid,
                    mode: this.args.forceMode,
                    modsInclude: this.args.mapmods,
                    overrideBpm: this.args.overrideBpm,
                    overrideSpeed: this.args.overrideSpeed,
                    ppCalc: this.args.isppCalc,
                    detailed: this.args.detailed,
                    filterTitle: this.args.maptitleq,
                });

                embeds.push(Embed);
                embeds.reverse();
                helper.tools.data.writePreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId,
                    {
                        id: `${this.map.id}`,
                        apiData: null,
                        mods: this.args.mapmods,
                        mode: this.args.forceMode
                    }
                );

                this.ctn.components.push(buttons);

                let frmod = inputModalSearch;
                if (this.args.overwriteModal != null) {
                    frmod = this.args.overwriteModal as Discord.StringSelectMenuBuilder;
                }

                if (!(inputModalDiff.options.length < 1)) {
                    this.ctn.components.push(new Discord.ActionRowBuilder()
                        .addComponents(inputModalDiff));
                }
                if (!(inputModalSearch.options.length < 1)) {
                    this.ctn.components.push(new Discord.ActionRowBuilder()
                        .addComponents(frmod));
                }
                if (this.args.overwriteModal) {

                    this.ctn.components.push(new Discord.ActionRowBuilder()
                        //@ts-expect-error anycomponentbuilder has properties missing in stringselectmenu  
                        .addComponents(this.args.overwriteModal));
                }

                this.ctn.embeds = embeds;

            }

            helper.tools.data.storeFile(bmsdataReq, this.map.beatmapset_id, `bmsdata`);
        }

        helper.tools.data.writePreviousId('map', this.input.message?.guildId ?? this.input.interaction?.guildId,
            {
                id: `${this.map.id}`,
                apiData: null,
                mods: null,
                mode: this.args.forceMode
            }
        );
        this.send();
    }
    map: apitypes.Beatmap;
    mapset: apitypes.Beatmapset;

    async getMapSet(mapsetid: string | number) {
        let bmsdataReq: tooltypes.apiReturn<apitypes.Beatmapset>;
        if (helper.tools.data.findFile(mapsetid, `bmsdata`) &&
            !('error' in helper.tools.data.findFile(mapsetid, `bmsdata`)) &&
            this.input.buttonType != 'Refresh') {
            bmsdataReq = helper.tools.data.findFile(mapsetid, `bmsdata`);
        } else {
            bmsdataReq = await helper.tools.api.getMapset(mapsetid, []);
        }
        let bmsdata = bmsdataReq.apiData;
        if (bmsdataReq?.error) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.map.ms.replace('[ID]', `${mapsetid}`), false);
            return;
        }
        helper.tools.data.debug(bmsdataReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'bmsData');

        if (bmsdata?.hasOwnProperty('error')) {
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, helper.vars.errors.uErr.osu.map.ms.replace('[ID]', `${mapsetid}`), true);
            return;
        }

        helper.tools.data.storeFile(bmsdataReq, mapsetid, `bmsdata`);

        return bmsdata;
    }
}

type mapType = 'Ranked' | 'Loved' | 'Approved' | 'Qualified' | 'Pending' | 'WIP' | 'Graveyard';

export class RandomMap extends OsuCommand {
    declare protected args: {
        mapType: mapType;
        useRandomRanked: boolean;
    };
    constructor() {
        super();
        this.args = {
            mapType: null,
            useRandomRanked: false,
        };
    }
    async setArgsMsg() {
        if (this.input.args.includes('-leaderboard')) {
            this.args.useRandomRanked = true;
            this.input.args.splice(this.input.args.indexOf('-leaderboard'), 1);
        }
        if (this.input.args.includes('-lb')) {
            this.args.useRandomRanked = true;
            this.input.args.splice(this.input.args.indexOf('-lb'), 1);
        }
        const mapTypeRankedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapRanked, this.input.args, false, null, false, false);
        if (mapTypeRankedArgFinder.found) {
            this.args.mapType = 'Ranked';
            this.input.args = mapTypeRankedArgFinder.args;
        }
        const mapTypeLovedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapLove, this.input.args, false, null, false, false);
        if (mapTypeLovedArgFinder.found) {
            this.args.mapType = 'Loved';
            this.input.args = mapTypeLovedArgFinder.args;
        }
        const mapTypeApprovedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapApprove, this.input.args, false, null, false, false);
        if (mapTypeApprovedArgFinder.found) {
            this.args.mapType = 'Approved';
            this.input.args = mapTypeApprovedArgFinder.args;
        }
        const mapTypeQualifiedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapQualified, this.input.args, false, null, false, false);
        if (mapTypeQualifiedArgFinder.found) {
            this.args.mapType = 'Qualified';
            this.input.args = mapTypeQualifiedArgFinder.args;
        }
        const mapTypePendArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapPending, this.input.args, false, null, false, false);
        if (mapTypePendArgFinder.found) {
            this.args.mapType = 'Pending';
            this.input.args = mapTypePendArgFinder.args;
        }
        const mapTypeWipArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapWip, this.input.args, false, null, false, false);
        if (mapTypeWipArgFinder.found) {
            this.args.mapType = 'WIP';
            this.input.args = mapTypeWipArgFinder.args;
        }
        const mapTypeGraveyardArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapGraveyard, this.input.args, false, null, false, false);
        if (mapTypeGraveyardArgFinder.found) {
            this.args.mapType = 'Graveyard';
            this.input.args = mapTypeGraveyardArgFinder.args;
        }
    }
    async setArgsInteract() {
    }
    async setArgsBtn() {
    }
    async setArgsLink() {
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff

        let txt = '';

        if (this.args.useRandomRanked) {
            const arr: ('Ranked' | 'Loved' | 'Approved')[] = ['Ranked', 'Loved', 'Approved'];
            this.args.mapType = arr[Math.floor(Math.random() * arr.length)];
        }

        const randomMap = helper.tools.data.randomMap(this.args.mapType);
        if (randomMap.err != null) {
            txt = randomMap.err;
        } else {
            txt = `https://osu.ppy.sh/b/${randomMap.returnId}`;
        }
        const embed = new Discord.EmbedBuilder()
            .setTitle('Random map')
            .setDescription(txt);

        if (randomMap.err == null) {
            this.input.overrides = {
                id: randomMap.returnId,
                commanduser: this.commanduser,
                commandAs: this.input.type
            };

            const cmd = new Map();
            cmd.setInput(this.input);
            await cmd.execute();

            return;
        }

        this.ctn.embeds = [embed];

        this.send();
    }
}

export class RecommendMap extends OsuCommand {
    declare protected args: {
        searchid: string;
        user: string;
        maxRange: number;
        useType: 'closest' | 'random';
        mode: apitypes.GameMode;
    };
    constructor() {
        super();
        this.args = {
            searchid: null,
            user: null,
            maxRange: 1,
            useType: 'random',
            mode: null,
        };
    }
    async setArgsMsg() {
        const usetypeRandomArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['r', 'random', 'f2', 'rdm', 'range', 'diff']), this.input.args, true, 'number', false, false);
        if (usetypeRandomArgFinder.found) {
            this.args.maxRange = usetypeRandomArgFinder.output;
            this.args.useType = 'random';
            this.input.args = usetypeRandomArgFinder.args;
        }
        if (this.input.args.includes('-closest')) {
            this.args.useType = 'closest';
            this.input.args = this.input.args.splice(this.input.args.indexOf('-closest'), 1);

        }
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.args.mode = temp.mode;
        }

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);
        this.args.user = this.input.args.join(' ')?.replaceAll('"', '');
        if (!this.input.args[0] || this.input.args[0].includes(this.args.searchid)) {
            this.args.user = null;
        }
        this.args.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.args.searchid = interaction?.member?.user.id ?? interaction?.user.id;

    }
    async setArgsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.args.searchid = interaction?.member?.user.id ?? interaction?.user.id;
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff

        //if user is null, use searchid
        if (this.args.user == null) {
            const cuser = await helper.tools.data.searchUser(this.args.searchid, true);
            this.args.user = cuser.username;
            if (this.args.mode == null) {
                this.args.mode = cuser.gamemode;
            }
        }

        //if user is not found in database, use discord username
        if (this.args.user == null) {
            const cuser = helper.vars.client.users.cache.get(this.args.searchid);
            this.args.user = cuser.username;
        }

        if (this.args.maxRange < 0.5 || !this.args.maxRange) {
            this.args.maxRange = 0.5;
        }

        let osudata: apitypes.User;

        try {
            const t = await this.getProfile(this.args.user, this.args.mode);
            osudata = t;
        } catch (e) {
            return;
        }

        const randomMap = helper.tools.data.recommendMap(+(osumodcalc.recdiff(osudata.statistics.pp)).toFixed(2), this.args.useType, this.args.mode, this.args.maxRange ?? 1);
        const exTxt =
            this.args.useType == 'closest' ? '' :
                `Random map within ${this.args.maxRange}⭐ of ${(osumodcalc.recdiff(osudata.statistics.pp))?.toFixed(2)}
    Pool of ${randomMap.poolSize}
    `;

        const embed = new Discord.EmbedBuilder();
        if (!isNaN(randomMap.mapid)) {
            this.input.overrides = {
                id: randomMap.mapid,
                commanduser: this.commanduser,
                commandAs: this.input.type,
                ex: exTxt
            };

            const cmd = new Map();
            cmd.setInput(this.input);
            await cmd.execute();
            return;
        } else {
            embed
                .setTitle('Error')
                .setDescription(`${randomMap.err}`);
        }

        this.ctn.embeds = [embed];

        this.send();
    }
}

export class UserBeatmaps extends OsuCommand {
    declare protected args: {
        filter: bottypes.ubmFilter;
        sort: bottypes.ubmSort;
        reverse: boolean;
        user: string;
        searchid: string;
        page: number;
        parseMap: boolean;
        parseId: number;
        filterTitle: string;
        reachedMaxCount: boolean;
        mode: apitypes.GameMode;
        detailed: number;
    };
    constructor() {
        super();
        this.args = {
            filter: 'favourite',
            sort: 'dateadded',
            reverse: false,
            user: undefined,
            searchid: undefined,
            page: 1,
            parseMap: false,
            parseId: undefined,
            filterTitle: null,
            reachedMaxCount: false,
            mode: 'osu',
            detailed: 1,
        };
    }
    async setArgsMsg() {
        this.args.searchid = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first().id : this.input.message.author.id;
        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, this.input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.args.page = pageArgFinder.output;
            this.input.args = pageArgFinder.args;
        }

        const detailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.details, this.input.args, false, null, false, false);
        if (detailArgFinder.found) {
            this.args.detailed = 2;
            this.input.args = detailArgFinder.args;
        }
        const filterRankArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapRanked, this.input.args, false, null, false, false);
        if (filterRankArgFinder.found) {
            this.args.filter = 'ranked';
            this.input.args = filterRankArgFinder.args;
        }
        const filterFavouritesArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapFavourite, this.input.args, false, null, false, false);
        if (filterFavouritesArgFinder.found) {
            this.args.filter = 'favourite';
            this.input.args = filterFavouritesArgFinder.args;
        }
        const filterGraveyardArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapGraveyard, this.input.args, false, null, false, false);
        if (filterGraveyardArgFinder.found) {
            this.args.filter = 'graveyard';
            this.input.args = filterGraveyardArgFinder.args;
        }
        const filterLovedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapLove, this.input.args, false, null, false, false);
        if (filterLovedArgFinder.found) {
            this.args.filter = 'loved';
            this.input.args = filterLovedArgFinder.args;
        }
        const filterPendingArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapPending, this.input.args, false, null, false, false);
        if (filterPendingArgFinder.found) {
            this.args.filter = 'pending';
            this.input.args = filterPendingArgFinder.args;
        }
        const filterNominatedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapNominated, this.input.args, false, null, false, false);
        if (filterNominatedArgFinder.found) {
            this.args.filter = 'nominated';
            this.input.args = filterNominatedArgFinder.args;
        }
        const filterGuestArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapGuest, this.input.args, false, null, false, false);
        if (filterGuestArgFinder.found) {
            this.args.filter = 'guest';
            this.input.args = filterGuestArgFinder.args;
        }
        const filterMostPlayedArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.mapMostPlayed, this.input.args, false, null, false, false);
        if (filterMostPlayedArgFinder.found) {
            this.args.filter = 'most_played';
            this.input.args = filterMostPlayedArgFinder.args;
        }
        const reverseArgFinder = helper.tools.commands.matchArgMultiple(['-reverse', '-rev'], this.input.args, false, null, false, false);
        if (reverseArgFinder.found) {
            this.args.reverse = true;
            this.input.args = reverseArgFinder.args;
        }
        if (this.input.args.includes('-reverse')) {
            this.args.reverse = true;
            this.input.args.splice(this.input.args.indexOf('-reverse'), 1);
        }
        if (this.input.args.includes('-parse')) {
            this.args.parseMap = true;
            const temp = helper.tools.commands.parseArg(this.input.args, '-parse', 'number', 1, null, true);
            this.args.parseId = temp.value;
            this.input.args = temp.newArgs;
        }

        if (this.input.args.includes('-?')) {
            const temp = helper.tools.commands.parseArg(this.input.args, '-?', 'string', this.args.filterTitle, true);
            this.args.filterTitle = temp.value;
            this.input.args = temp.newArgs;
        }

        this.input.args = helper.tools.commands.cleanArgs(this.input.args);

        const usertemp = helper.tools.commands.fetchUser(this.input.args);
        this.input.args = usertemp.args;
        this.args.user = usertemp.id;
        if (!this.args.user || this.args.user.includes(this.args.searchid)) {
            this.args.user = null;
        }
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;

        this.args.searchid = this.commanduser.id;

        this.args.user = interaction.options.getString('user') ?? null;
        this.args.filter = (interaction.options.getString('type') ?? 'favourite') as bottypes.ubmFilter;
        this.args.sort = (interaction.options.getString('sort') ?? 'dateadded') as bottypes.ubmSort;
        this.args.reverse = interaction.options.getBoolean('reverse') ?? false;
        this.args.filterTitle = interaction.options.getString('filter');

        this.args.parseId = interaction.options.getInteger('parse');
        if (this.args.parseId != null) {
            this.args.parseMap = true;
        }

    }
    async setArgsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        const temp = helper.tools.commands.getButtonArgs(this.input.id);
        if (temp.error) {
            interaction.followUp({
                content: helper.vars.errors.paramFileMissing,
                flags: Discord.MessageFlags.Ephemeral,
                allowedMentions: { repliedUser: false }
            });
            helper.tools.commands.disableAllButtons(this.input.message);
            return;
        }
        this.args.searchid = temp.searchid;
        this.args.user = temp.user;
        this.args.filter = temp.mapType;
        this.args.sort = temp.sortMap;
        this.args.reverse = temp.reverse;
        this.args.page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, this.input.buttonType);
        this.args.parseMap = temp.parse;
        this.args.parseId = temp.parseId;
        this.args.filterTitle = temp.filterTitle;
        // mode = temp.mode;
        this.args.detailed = helper.tools.commands.buttonDetail(temp.detailed, this.input.buttonType);

    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input.overrides.page) {
            this.args.page = this.input.overrides.page;
        }
        if (this.input.overrides.ex) {
            switch (this.input.overrides.ex) {
                case 'ranked':
                    this.args.filter = 'ranked';
                    break;
                case 'favourite':
                    this.args.filter = 'favourite';
                    break;
                case 'graveyard':
                    this.args.filter = 'graveyard';
                    break;
                case 'loved':
                    this.args.filter = 'loved';
                    break;
                case 'pending':
                    this.args.filter = 'pending';
                    break;
                case 'nominated':
                    this.args.filter = 'nominated';
                    break;
                case 'guest':
                    this.args.filter = 'guest';
                    break;
                case 'most_played':
                    this.args.filter = 'most_played';
                    break;
            }
        }
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff
        if (this.args.page < 2 || typeof this.args.page != 'number' || isNaN(this.args.page)) {
            this.args.page = 1;
        }
        this.args.page--;

        //if user is null, use searchid
        if (this.args.user == null) {
            const cuser = await helper.tools.data.searchUser(this.args.searchid, true);
            this.args.user = cuser.username;
        }

        //if user is not found in database, use discord username
        if (this.args.user == null) {
            const cuser = helper.vars.client.users.cache.get(this.args.searchid);
            this.args.user = cuser.username;
        }
        if (this.input.type == 'interaction') {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: 'Loading...'
                }
            }, this.input.canReply);
        }

        try {
            const u = await this.getProfile(this.args.user, this.args.mode);
            this.osudata = u;
        } catch (e) {
            return;
        }

        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('userbeatmaps', this.commanduser, this.input.id);
        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-User-userbeatmaps-any-${this.input.id}-${this.osudata.id}+${this.osudata.playmode}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );

        let maplistdata: (apitypes.Beatmapset[] & apitypes.Error | apitypes.BeatmapPlayCountArr) = [];

        async function getScoreCount(cinitnum, input, args, osudata) {
            if (cinitnum >= 499) {
                args.reachedMaxCount = true;
                return;
            }
            const fdReq: tooltypes.apiReturn = await helper.tools.api.getUserMaps(osudata.id, args.filter, [`offset=${cinitnum}`]);
            const fd = fdReq.apiData;
            if (fdReq?.error) {
                await helper.tools.commands.errorAndAbort(input, 'userbeatmaps', true, helper.vars.errors.uErr.osu.map.group_nf.replace('[TYPE]', args.filter), false);
                return;
            }
            if (fd?.hasOwnProperty('error')) {
                await helper.tools.commands.errorAndAbort(input, 'userbeatmaps', true, helper.vars.errors.uErr.osu.map.group_nf.replace('[TYPE]', args.filter), true);
                return;
            }
            for (let i = 0; i < fd.length; i++) {
                if (!fd[i] || typeof fd[i] == 'undefined') { break; }
                maplistdata.push(fd[i]);
            }
            if (fd.length == 100 && args.filter != 'most_played') {
                return await getScoreCount(cinitnum + 100, input, args, osudata);
            }
            return args;
        }
        if (helper.tools.data.findFile(this.osudata.id, 'maplistdata', null, this.args.filter) &&
            !('error' in helper.tools.data.findFile(this.osudata.id, 'maplistdata', null, this.args.filter)) &&
            this.input.buttonType != 'Refresh'
        ) {
            maplistdata = helper.tools.data.findFile(this.osudata.id, 'maplistdata', null, this.args.filter);
        } else {
            this.args = await getScoreCount(0, this.input, this.args, this.osudata);
        }

        helper.tools.data.debug(maplistdata, 'command', 'userbeatmaps', this.input.message?.guildId ?? this.input.interaction?.guildId, 'mapListData');
        helper.tools.data.storeFile(maplistdata, this.osudata.id, 'maplistdata', null, this.args.filter);

        if (this.args.parseMap) {
            if (this.args.filterTitle) {
                switch (this.args.filter) {
                    case 'most_played':
                        maplistdata = helper.tools.formatter.filterMapPlays(maplistdata as apitypes.BeatmapPlayCountArr,
                            this.args.sort as any, {
                            title: this.args.filterTitle
                        }, this.args.reverse);
                        break;
                    default:
                        maplistdata = helper.tools.formatter.filterMaps(maplistdata as apitypes.Beatmapset[],
                            this.args.sort as any, {
                            title: this.args.filterTitle
                        }, this.args.reverse);
                        break;
                }

            }
            let pid = this.args.parseId - 1;
            if (pid < 0) {
                pid = 0;
            }
            if (pid > maplistdata.length) {
                pid = maplistdata.length - 1;
            }
            this.input.overrides = {
                id:
                    this.args.filter == 'most_played' ?
                        (maplistdata as apitypes.BeatmapPlayCountArr)[pid]?.beatmap_id :
                        (maplistdata as apitypes.Beatmapset[])[pid]?.beatmaps[0]?.id,
                commanduser: this.commanduser,
                commandAs: this.input.type
            };
            if (this.input.overrides.id == null) {
                await helper.tools.commands.errorAndAbort(this.input, 'userbeatmaps', true, helper.vars.errors.uErr.osu.map.m_uk + `at index ${pid}`, true);
                return;
            }
            this.input.type = 'other';
            const cmd = new Map();
            cmd.setInput(this.input);
            await cmd.execute();
            return;
        }
        if (this.args.page >= Math.ceil(maplistdata.length / 5)) {
            this.args.page = Math.ceil(maplistdata.length / 5) - 1;
        }
        let mapsarg: {
            text: string;
            curPage: number;
            maxPage: number;
        };

        switch (this.args.filter) {
            case 'most_played':
                mapsarg = helper.tools.formatter.mapPlaysList(maplistdata as apitypes.BeatmapPlayCountArr,
                    this.args.sort as any, {
                    title: this.args.filterTitle
                },
                    this.args.reverse, this.args.page);
                break;
            default:
                mapsarg = helper.tools.formatter.mapList(maplistdata as apitypes.Beatmapset[],
                    this.args.sort as any, {
                    title: this.args.filterTitle
                },
                    this.args.reverse, this.args.page);
                break;
        }

        helper.tools.commands.storeButtonArgs(this.input.id, {
            searchid: this.args.searchid,
            user: this.args.user,
            mapType: this.args.filter,
            sortMap: this.args.sort,
            reverse: this.args.reverse,
            page: this.args.page + 1,
            maxPage: mapsarg.maxPage,
            parse: this.args.parseMap,
            parseId: this.args.parseId,
            filterTitle: this.args.filterTitle,
            detailed: this.args.detailed
        });
        const mapList = new Discord.EmbedBuilder()
            .setFooter({
                text: `${mapsarg.curPage}/${mapsarg.maxPage}`
            })
            .setTitle(`${this.osudata.username}'s ${helper.tools.formatter.toCapital(this.args.filter)} Maps`)
            .setThumbnail(`${this.osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
            .setAuthor({
                name: `#${helper.tools.calculate.separateNum(this.osudata?.statistics?.global_rank)} | #${helper.tools.calculate.separateNum(this.osudata?.statistics?.country_rank)} ${this.osudata.country_code} | ${helper.tools.calculate.separateNum(this.osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/users/${this.osudata.id}`,
                iconURL: `${`https://osuhelper.vars.argflags.omkserver.nl/${this.osudata.country_code}.png`}`
            })
            .setURL(`https://osu.ppy.sh/users/${this.osudata.id}/${this.osudata.playmode}#beatmaps`)
            .setColor(helper.vars.colours.embedColour.userlist.dec)
            .setDescription(this.args.reachedMaxCount ? 'Only the first 500 mapsets are shown\n\n' : '\n\n' + mapsarg.text);

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

        this.ctn.embeds = [mapList];
        this.ctn.components = [pgbuttons, buttons];


        this.send();
    }
    osudata: apitypes.User;
}