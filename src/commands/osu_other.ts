import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';

/**
 * compare stats/plays
 */
export const compare = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    type compareType = 'profile' | 'top' | 'mapscore';
    let type: compareType = 'profile';
    let first = null;
    let second = null;
    let firstsearchid = null;
    let secondsearchid = null;
    let mode = 'osu';
    let page = 0;

    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }
            if (input.message.mentions.users.size > 1) {
                firstsearchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
                secondsearchid = input.message.mentions.users.size > 1 ? input.message.mentions.users.at(1).id : null;
            } else if (input.message.mentions.users.size == 1) {
                firstsearchid = input.message.author.id;
                secondsearchid = input.message.mentions.users.at(0).id;
            } else {
                firstsearchid = input.message.author.id;
            }
            const parseUsers = helper.tools.commands.parseUsers(input.args.join(' '));
            second = parseUsers[0];
            if (parseUsers[1]) {
                first = parseUsers[0];
                second = parseUsers[1];
            }
            first != null && first.includes(firstsearchid) ? first = null : null;
            second != null && second.includes(secondsearchid) ? second = null : null;
        }
            break;

        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
            type = (interaction.options.getString('type') ?? 'profile') as compareType;
            first = interaction.options.getString('first');
            second = interaction.options.getString('second');
            firstsearchid = commanduser.id;
            mode = interaction.options.getString('mode') ?? 'osu';
            if (second == null && first != null) {
                second = first;
                first = null;
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
            type = temp.type as compareType;
            page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, input.buttonType);
            first = temp.compareFirst;
            second = temp.compareSecond;
            firstsearchid = temp.searchIdFirst;
            secondsearchid = temp.searchIdSecond;
        }
            break;
    }
    if (input.overrides) {
        if (input.overrides.type != null) type = input.overrides.type as any;
    }
    helper.tools.log.commandOptions(
        [{
            name: 'Type',
            value: type
        },
        {
            name: 'First',
            value: first
        },
        {
            name: 'Second',
            value: second
        },
        {
            name: 'Mode',
            value: mode
        },
        {
            name: 'FirstSearchId',
            value: firstsearchid
        },
        {
            name: 'SecondSearchId',
            value: secondsearchid
        },
        {
            name: 'Page',
            value: page
        }],
        input.id,
        'compare',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    let fieldFirst: Discord.EmbedField = {
        name: 'First',
        value: 'Loading...',
        inline: true
    };
    let fieldSecond: Discord.EmbedField = {
        name: 'Second',
        value: 'Loading...',
        inline: true
    };
    let fieldComparison: Discord.EmbedField = {
        name: 'Comparison',
        value: 'Loading...',
        inline: false
    };
    let embedTitle: string = 'w';
    const usefields: Discord.EmbedField[] = [];

    const useComponents: Discord.ActionRowBuilder[] = [];
    let embedescription: string = null;

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;
    let footer = '';
    try {
        if (second == null) {
            if (secondsearchid) {
                const cuser = await helper.tools.data.searchUser(secondsearchid, true);
                second = cuser.username;
                if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                    if (input.type != 'button') {
                        throw new Error('Second user not found');
                    }
                    return;
                }
            } else {
                if (helper.tools.data.getPreviousId('user', `${input.message?.guildId ?? input.interaction?.guildId}`).id == false) {
                    throw new Error(`Could not find second user - ${helper.vars.errors.uErr.osu.profile.user_msp}`);
                }
                second = helper.tools.data.getPreviousId('user', `${input.message?.guildId ?? input.interaction?.guildId}`).id;
            }
        }
        if (first == null) {
            if (firstsearchid) {
                const cuser = await helper.tools.data.searchUser(firstsearchid, true);
                first = cuser.username;
                if (mode == null) {
                    mode = cuser.gamemode;
                }
                if (cuser.error != null && (cuser.error.includes('no user') || cuser.error.includes('type'))) {
                    if (input.type != 'button') {
                        throw new Error('First user not found');
                    }
                    return;
                }
            } else {
                throw new Error('first user not found');
            }
        }
        if (!first || first.length == 0 || first == '') {
            throw new Error('Could not find the first user');
        }
        let firstuserReq: tooltypes.apiReturn<apitypes.User>;
        if (helper.tools.data.findFile(first, 'osudata') &&
            !('error' in helper.tools.data.findFile(first, 'osudata')) &&
            input.buttonType != 'Refresh'
        ) {
            firstuserReq = helper.tools.data.findFile(first, 'osudata');
        } else {
            firstuserReq = await helper.tools.api.getUser(first, mode, []);
        }

        const firstuser = firstuserReq.apiData;
        if (firstuserReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'compare', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', first), false);
            return;
        }
        if (firstuser?.hasOwnProperty('error')) {
            if (input.type != 'button' && input.type != 'link') {
                throw new Error('could not fetch first user data');

            }
            return;
        }

        if (!second || second.length == 0 || second == '') {
            throw new Error('Could not find the second user');
        }
        let seconduserReq: tooltypes.apiReturn<apitypes.User>;
        if (helper.tools.data.findFile(second, 'osudata') &&
            !('error' in helper.tools.data.findFile(second, 'osudata')) &&
            input.buttonType != 'Refresh'
        ) {
            seconduserReq = helper.tools.data.findFile(second, 'osudata');
        } else {
            seconduserReq = await helper.tools.api.getUser(second, mode, []);

        }

        const seconduser = seconduserReq.apiData;
        if (seconduserReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'compare', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', second), false);
            return;
        }
        if (seconduser?.hasOwnProperty('error')) {
            if (input.type != 'button' && input.type != 'link') {
                throw new Error('could not fetch second user data');
            }
            return;
        }
        helper.tools.data.storeFile(firstuserReq, first, 'osudata');
        helper.tools.data.storeFile(firstuserReq, firstuser.id, 'osudata');
        helper.tools.data.storeFile(seconduserReq, seconduser.id, 'osudata');
        helper.tools.data.storeFile(seconduserReq, second, 'osudata');

        switch (type) {
            case 'profile': {
                embedTitle = 'Comparing profiles';
                fieldFirst = {
                    name: `**${firstuser.username}**`,
                    value:
                        `**Rank:** ${helper.tools.calculate.separateNum(firstuser?.statistics.global_rank)}
**pp:** ${helper.tools.calculate.separateNum(firstuser?.statistics.pp)}
**Accuracy:** ${(firstuser?.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${helper.tools.calculate.separateNum(firstuser?.statistics.play_count)}
**Level:** ${helper.tools.calculate.separateNum(firstuser.statistics.level.current)}
`,
                    inline: true
                };
                fieldSecond = {
                    name: `**${seconduser.username}**`,
                    value:
                        `**Rank:** ${helper.tools.calculate.separateNum(seconduser?.statistics.global_rank)}
**pp:** ${helper.tools.calculate.separateNum(seconduser?.statistics.pp)}
**Accuracy:** ${(seconduser?.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0).toFixed(2)}%
**Playcount:** ${helper.tools.calculate.separateNum(seconduser?.statistics.play_count)}
**Level:** ${helper.tools.calculate.separateNum(seconduser.statistics.level.current)}
`,
                    inline: true
                };
                fieldComparison = {
                    name: `**Difference**`,
                    value:
                        `**Rank:** ${helper.tools.calculate.separateNum(Math.abs(firstuser.statistics.global_rank - seconduser.statistics.global_rank))}
**pp:** ${helper.tools.calculate.separateNum(Math.abs(firstuser?.statistics.pp - seconduser?.statistics.pp).toFixed(2))}
**Accuracy:** ${Math.abs((firstuser.statistics.hit_accuracy != null ? firstuser.statistics.hit_accuracy : 0) - (seconduser.statistics.hit_accuracy != null ? seconduser.statistics.hit_accuracy : 0)).toFixed(2)}%
**Playcount:** ${helper.tools.calculate.separateNum(Math.abs(firstuser.statistics.play_count - seconduser.statistics.play_count))}
**Level:** ${helper.tools.calculate.separateNum(Math.abs(firstuser.statistics.level.current - seconduser.statistics.level.current))}
`,
                    inline: false
                };
                usefields.push(fieldFirst, fieldSecond, fieldComparison);
            }
                break;
            case 'top': {
                page;
                let firsttopdataReq: tooltypes.apiReturn<apitypes.ScoreLegacy[]>;
                if (helper.tools.data.findFile(input.id, 'firsttopdata') &&
                    !('error' in helper.tools.data.findFile(input.id, 'firsttopdata')) &&
                    input.buttonType != 'Refresh'
                ) {
                    firsttopdataReq = helper.tools.data.findFile(input.id, 'firsttopdata');
                } else {
                    firsttopdataReq = await helper.tools.api.getScoresBest(firstuser.id, mode, []);
                }

                const firsttopdata: apitypes.ScoreLegacy[] & apitypes.Error = firsttopdataReq.apiData;
                if (firsttopdataReq?.error) {
                    await helper.tools.commands.errorAndAbort(input, 'compare', true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', firstuser.id + ''), false);
                    return;
                }
                if (firsttopdata?.hasOwnProperty('error')) {
                    if (input.type != 'button' && input.type != 'link') {
                        throw new Error('could not fetch first user\'s top scores');
                    }
                    return;
                }

                let secondtopdataReq: tooltypes.apiReturn<apitypes.ScoreLegacy[]>;
                if (helper.tools.data.findFile(input.id, 'secondtopdata') &&
                    !('error' in helper.tools.data.findFile(input.id, 'secondtopdata')) &&
                    input.buttonType != 'Refresh'
                ) {
                    secondtopdataReq = helper.tools.data.findFile(input.id, 'secondtopdata');
                } else {
                    secondtopdataReq = await helper.tools.api.getScoresBest(seconduser.id, mode, []);
                }

                const secondtopdata: apitypes.ScoreLegacy[] & apitypes.Error = secondtopdataReq.apiData;
                if (secondtopdataReq?.error) {
                    await helper.tools.commands.errorAndAbort(input, 'compare', true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', seconduser.id + ''), false);
                    return;
                }
                if (secondtopdata?.hasOwnProperty('error')) {
                    if (input.type != 'button' && input.type != 'link') {
                        throw new Error('could not fetch second user\'s top scores');
                    }
                    return;
                }
                helper.tools.data.storeFile(firsttopdataReq, input.id, 'firsttopdata');
                helper.tools.data.storeFile(secondtopdataReq, input.id, 'secondtopdata');

                const filterfirst = [];
                //filter so that scores that have a shared beatmap id with the second user are kept
                for (let i = 0; i < firsttopdata.length; i++) {
                    if (secondtopdata.find(score => score.beatmap.id == firsttopdata[i].beatmap.id)) {
                        filterfirst.push(firsttopdata[i]);
                    }
                }
                filterfirst.sort((a, b) => b.pp - a.pp);
                embedTitle = 'Comparing top scores';
                const arrscore = [];

                for (let i = 0; i < filterfirst.length && i < 5; i++) {
                    const firstscore: apitypes.ScoreLegacy = filterfirst[i + (page * 5)];
                    if (!firstscore) break;
                    const secondscore: apitypes.ScoreLegacy = secondtopdata.find(score => score.beatmap.id == firstscore.beatmap.id);
                    if (secondscore == null) break;
                    const firstscorestr =
                        `\`${firstscore.pp.toFixed(2)}pp | ${(firstscore.accuracy * 100).toFixed(2)}% ${firstscore.mods.length > 0 ? '| +' + firstscore.mods.join('') : ''}`;//.padEnd(30, ' ').substring(0, 30)
                    const secondscorestr =
                        `${secondscore.pp.toFixed(2)}pp | ${(secondscore.accuracy * 100).toFixed(2)}% ${secondscore.mods.length > 0 ? '| +' + secondscore.mods.join('') : ''}\`\n`;//.padEnd(30, ' ').substring(0, 30)
                    arrscore.push(
                        `**[\`${firstscore.beatmapset.title} [${firstscore.beatmap.version}]\`](https://osu.ppy.sh/b/${firstscore.beatmap.id})**
\`${firstuser.username.padEnd(30, ' ').substring(0, 30)} | ${seconduser.username.padEnd(30, ' ').substring(0, 30)}\`
${firstscorestr.substring(0, 30)} || ${secondscorestr.substring(0, 30)}`
                    );
                }

                embedescription = `**[${firstuser.username}](https://osu.ppy.sh/users/${firstuser.id})** and **[${seconduser.username}](https://osu.ppy.sh/users/${seconduser.id})** have ${filterfirst.length} shared scores`;
                footer = `${page + 1}/${Math.ceil(filterfirst.length / 5)}`;
                for (const score of arrscore) {
                    usefields.push({
                        name: helper.vars.defaults.invisbleChar,
                        value: score,
                        inline: false
                    });
                }
                helper.tools.commands.storeButtonArgs(input.id, {
                    type: 'top',
                    page: page + 1,
                    maxPage: Math.ceil(filterfirst.length / 5),
                    compareFirst: first,
                    compareSecond: second,
                    searchIdFirst: firstsearchid,
                    searchIdSecond: secondsearchid
                });
                const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('compare', commanduser, input.id);
                useComponents.push(pgbuttons);
            }
                break;



            case 'mapscore': {
                embedTitle = 'Comparing map scores';
                fieldFirst = {
                    name: `**${firstuser.username}**`,
                    value: '',
                    inline: true
                };
                fieldSecond = {
                    name: `**${seconduser.username}**`,
                    value: 's',
                    inline: true
                };
                fieldComparison = {
                    name: `**Difference**`,
                    value: 'w',
                    inline: false
                };
                usefields.push(fieldFirst, fieldSecond, fieldComparison);
            }
                break;

        }
        helper.tools.data.writePreviousId('user', input.message?.guildId ?? input.interaction?.guildId, { id: `${seconduser.id}`, apiData: null, mods: null });
    } catch (error) {
        embedTitle = 'Error';
        usefields.push({
            name: 'Error',
            value: `${error}`,
            inline: false
        });
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle(embedTitle)
        .setFields(usefields);
    if (footer.length > 0) {
        embed.setFooter({
            text: footer
        });
    }

    if (embedescription != null && embedescription.length > 0) { embed.setDescription(embedescription); }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed],
            components: useComponents,
        }
    }, input.canReply);
};

/**
 * set username/mode/skin
 */
export const osuset = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let name;
    let mode;
    let skin;
    let location;
    let tz;

    let type;
    let value;

    switch (input.type) {
        case 'message': {


            commanduser = input.message.author;
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            if (input.args.includes('-skin')) {
                const temp = helper.tools.commands.parseArg(input.args, '-skin', 'string', skin, true);
                skin = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-location')) {
                const temp = helper.tools.commands.parseArg(input.args, '-location', 'string', location, true);
                location = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-weather')) {
                const temp = helper.tools.commands.parseArg(input.args, '-weather', 'string', location, true);
                location = temp.value;
                input.args = temp.newArgs;
            }
            const timeArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.toFlag(['timezone', 'tz']), input.args, true, 'string', false, false);
            if (timeArgFinder.found) {
                tz = timeArgFinder.output;
                input.args = timeArgFinder.args;
            }

            input.args = helper.tools.commands.cleanArgs(input.args);

            name = input.args.join(' ');
        }
            break;



        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
            name = interaction.options.getString('user');
            mode = interaction.options.getString('mode');
            skin = interaction.options.getString('skin');
            type = 'interaction';
        }



            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;
        }
            break;
    }

    if (input.overrides) {
        if (input.overrides.type != null) {
            switch (input.overrides.type) {
                case 'mode':
                    mode = name;
                    break;
                case 'skin':
                    skin = name;
                    break;
                case 'tz':
                    tz = name;
                    break;
                case 'location':
                    location = name;
                    break;
            }
            name = null;
        }
    }

    helper.tools.log.commandOptions(
        [{
            name: 'Name',
            value: name
        },
        {
            name: 'Mode',
            value: mode
        },
        {
            name: 'Skin',
            value: skin
        },
        {
            name: 'TZ',
            value: tz
        },
        {
            name: 'Location',
            value: location
        },
        {
            name: 'Type',
            value: type
        },
        {
            name: 'Value',
            value: value
        },],
        input.id,
        'osuset',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    let txt = 'null';

    if (mode) {
        const thing = helper.tools.other.modeValidatorAlt(mode);
        mode = thing.mode;
        if (thing.isincluded == false) {
            await helper.tools.commands.sendMessage({
                type: input.type,
                message: input.message,
                interaction: input.interaction,
                args: {
                    content: helper.vars.errors.uErr.osu.set.mode,
                    edit: true
                }
            }, input.canReply);
            return;
        }
    }

    let updateRows: {
        userid: string | number,
        osuname?: string,
        mode?: string,
        skin?: string,
    } = {
        userid: commanduser.id
    };
    updateRows = {
        userid: commanduser.id,
    };
    if (name != null) {
        updateRows['osuname'] = name;
    }
    if (mode != null) {
        updateRows['mode'] = mode;
    }
    if (skin != null) {
        updateRows['skin'] = skin;
    }
    if (tz != null) {
        updateRows['timezone'] = tz;
    }
    if (location != null) {
        updateRows['location'] = location;
    }

    const findname: tooltypes.dbUser = await helper.vars.userdata.findOne({ where: { userid: commanduser.id } }) as any;
    if (findname == null) {
        try {
            await helper.vars.userdata.create({
                userid: commanduser.id,
                osuname: name ?? 'undefined',
                mode: mode ?? 'osu',
                skin: skin ?? 'Default - https://osu.ppy.sh/community/forums/topics/129191?n=117',
                location,
                timezone: tz,
            });
            txt = 'Added to database';
            if (name) {
                txt += `\nSet your username to \`${name}\``;
            }
            if (mode) {
                txt += `\nSet your mode to \`${mode}\``;
            }
            if (skin) {
                txt += `\nSet your skin to \`${skin}\``;
            }
            if (location) {
                txt += `\nSet your location to \`${location}\``;
            }
            if (tz) {
                txt += `\nSet your timezone to \`${tz}\``;
            }
        } catch (error) {
            txt = 'There was an error trying to update your settings';
            helper.tools.log.commandErr('Database error (create) ->' + error, input.id, 'osuset', input.message, input.interaction);
        }
    } else {
        const affectedRows = await helper.vars.userdata.update(
            updateRows,
            { where: { userid: commanduser.id } }
        );

        if (affectedRows.length > 0 || affectedRows[0] > 0) {
            txt = 'Updated your settings:';
            if (name) {
                txt += `\nSet your username to \`${name}\``;
            }
            if (mode) {
                txt += `\nSet your mode to \`${mode}\``;
            }
            if (skin) {
                txt += `\nSet your skin to \`${skin}\``;
            }
            if (location) {
                txt += `\nSet your location to \`${location}\``;
            }
            if (tz) {
                txt += `\nSet your timezone to \`${tz}\``;
            }
        } else {
            txt = 'There was an error trying to update your settings';
            helper.tools.log.commandErr('Database error (update) ->' + affectedRows, input.id, 'osuset', input.message, input.interaction);
        }
    }

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: txt,
        }
    }, input.canReply);
};

/**
 * estimate rank from pp or vice versa
 */
export const rankpp = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let type: string = 'rank';
    let value;
    let mode: apitypes.GameMode = 'osu';



    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = helper.tools.commands.cleanArgs(input.args);

            value = input.args[0] ?? 100;
        }
            break;

        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
            value = interaction.options.getInteger('value') ?? 100;
            mode = interaction.options.getString('mode') as apitypes.GameMode ?? 'osu';
        }


            break;
    }
    if (input.overrides) {
        type = input?.overrides?.type ?? 'pp';
    }
    helper.tools.log.commandOptions(
        [{
            name: 'Type',
            value: type
        },
        {
            name: 'Value',
            value: value
        },
        {
            name: 'Mode',
            value: mode
        }],
        input.id,
        'rankpp',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


    const Embed = new Discord.EmbedBuilder()
        .setTitle('null')
        .setDescription('null');

    let output: string;
    let returnval: {
        value: number;
        isEstimated: boolean;
    } = null;
    const disclaimer = 'Values are very rough estimates (especially pp to rank)';
    switch (type) {
        case 'pp': {
            returnval = await helper.tools.data.getRankPerformance('pp->rank', value, mode);
            output = 'approx. rank #' + helper.tools.calculate.separateNum(Math.ceil(returnval.value));
            Embed
                .setTitle(`Approximate rank for ${value}pp`);
        }
            break;
        case 'rank': {
            returnval = await helper.tools.data.getRankPerformance('rank->pp', value, mode);
            output = 'approx. ' + helper.tools.calculate.separateNum(returnval.value.toFixed(2)) + 'pp';

            Embed
                .setTitle(`Approximate performance for rank #${value}`);
        }
            break;
    };

    const dataSizetxt = await helper.vars.statsCache.count();

    Embed
        .setDescription(`${output}\n${helper.vars.emojis.gamemodes[mode ?? 'osu']}\n${returnval.isEstimated ? `Estimated from ${dataSizetxt} entries.` : 'Based off matching / similar entry'}`);



    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [Embed]
        }
    }, input.canReply);
};

/**
 * return saved osu! username/mode/skin
 */
export const saved = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    let searchid;
    let user;
    let show = {
        name: true,
        mode: true,
        skin: true,
        tz: true,
        weather: true,
    };
    let overrideTitle;


    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;

            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
            user = input.args.join(' ')?.replaceAll('"', '');
            if (!input.args[0] || input.args[0].includes(searchid)) {
                user = null;
            }
        }
            break;

        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;
            commanduser = interaction?.member?.user ?? interaction?.user;
        }


            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;
        }
            break;
    }

    if (input.overrides) {
        if (input?.overrides?.type != null) {
            switch (input?.overrides?.type) {
                case 'username':
                    show = {
                        name: true,
                        mode: false,
                        skin: false,
                        tz: false,
                        weather: false,
                    };
                    break;
                case 'mode':
                    show = {
                        name: false,
                        mode: true,
                        skin: false,
                        tz: false,
                        weather: false,
                    };
                    break;
                case 'skin':
                    show = {
                        name: false,
                        mode: false,
                        skin: true,
                        tz: false,
                        weather: false,
                    };
                    break;
                case 'tz':
                    show = {
                        name: false,
                        mode: false,
                        skin: false,
                        tz: true,
                        weather: false,
                    };
                    break;
                case 'weather':
                    show = {
                        name: false,
                        mode: false,
                        skin: false,
                        tz: false,
                        weather: true,
                    };
                    break;
            }
        }
        if (input?.overrides?.ex != null) {
            overrideTitle = input?.overrides?.ex;
        }
    }
    helper.tools.log.commandOptions(
        [{
            name: 'User id',
            value: searchid
        }],
        input.id,
        'saved',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


    let cuser: any = {
        osuname: 'null',
        mode: 'osu! (Default)',
        skin: 'osu! classic'
    };

    let fr;
    if (user == null) {
        fr = helper.vars.client.users.cache.get(searchid)?.username ?? 'null';
    }

    const Embed = new Discord.EmbedBuilder()
        .setTitle(`${user != null ? user : fr}'s ${overrideTitle ?? 'saved settings'}`);

    if (user == null) {
        cuser = await helper.vars.userdata.findOne({ where: { userid: searchid } });
    } else {
        const allUsers: tooltypes.dbUser[] = await helper.vars.userdata.findAll() as any;

        cuser = allUsers.filter(x => (`${x.osuname}`.trim().toLowerCase() == `${user}`.trim().toLowerCase()))[0];
    }

    if (cuser) {
        const fields = [];
        if (show.name) {
            fields.push({
                name: 'Username',
                value: `${cuser.osuname && cuser.mode.length > 1 ? cuser.osuname : 'undefined'}`,
                inline: true
            });
        }
        if (show.mode) {
            fields.push({
                name: 'Mode',
                value: `${cuser.mode && cuser.mode.length > 1 ? cuser.mode : 'osu (default)'}`,
                inline: true
            });
        }
        if (show.skin) {
            fields.push({
                name: 'Skin',
                value: `${cuser.skin && cuser.skin.length > 1 ? cuser.skin : 'None'}`,
                inline: true
            });
        }
        if (show.tz) {
            fields.push({
                name: 'Timezone',
                value: `${cuser.timezone && cuser.timezone.length > 1 ? cuser.timezone : 'None'}`,
                inline: true
            });
        }
        if (show.weather) {
            fields.push({
                name: 'Location',
                value: `${cuser.location && cuser.location.length > 1 ? cuser.location : 'None'}`,
                inline: true
            });
        }
        Embed.addFields(fields);
    } else {
        Embed.setDescription('No saved settings found');
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [Embed],
        }
    }, input.canReply);
};

/**
 * estimate stats if x pp score
 */
export const whatif = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let user;
    let pp;
    let searchid;
    let mode;


    switch (input.type) {
        case 'message': {


            commanduser = input.message.author;

            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;

            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = helper.tools.commands.cleanArgs(input.args);

            if (!isNaN(+input.args[0])) {
                pp = +input.args[0];
            }
            input.args.forEach(x => {
                if (!isNaN(+x)) {
                    pp = +x;
                }
            });
            for (const x of input.args) {
                if (!isNaN(+x)) {
                    pp = +x;
                    break;
                }
            }
            if (pp && !isNaN(pp)) {
                input.args.splice(input.args.indexOf(pp + ''), 1);
            }

            const usertemp = helper.tools.commands.fetchUser(input.args.join(' '));
            user = usertemp.id;
            if (usertemp.mode && !mode) {
                mode = usertemp.mode;
            }
            if (!user || user.includes(searchid)) {
                user = null;
            }
        }
            break;



        case 'interaction': {
            let interaction = input.interaction as Discord.ChatInputCommandInteraction;

            commanduser = interaction?.member?.user ?? interaction?.user;
            searchid = commanduser.id;

            user = interaction.options.getString('user');

            mode = interaction.options.getString('mode');

            pp = interaction.options.getNumber('pp');
        }



            break;
        case 'button': {
            if (!input.message.embeds[0]) return;
            let interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = interaction?.member?.user ?? interaction?.user;
            searchid = commanduser.id;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [{
            name: 'User',
            value: user
        },
        {
            name: 'Performance Points',
            value: pp
        },
        {
            name: 'Mode',
            value: mode
        },
        {
            name: 'Search ID',
            value: searchid
        }],
        input.id,
        'whatif',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    if (!pp || isNaN(pp) || pp > 10000) {
        input.message.reply("Please define a valid PP value to calculate");
    }

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

    let osudataReq: tooltypes.apiReturn<apitypes.User>;

    if (helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode)) &&
        !('error' in helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode))) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode));
    } else {
        osudataReq = await helper.tools.api.getUser(user, mode, []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'whatif', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }
    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'whatif', true, helper.vars.errors.noUser(user), true);
        return;
    }

    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-User-whatif-any-${input.id}-${osudata.id}+${osudata.playmode}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.user),
        );

    helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(mode), 'User');

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(mode));
    helper.tools.data.storeFile(osudataReq, user, 'osudata', helper.tools.other.modeValidator(mode));

    helper.tools.data.debug(osudataReq, 'command', 'whatif', input.message?.guildId ?? input.interaction?.guildId, 'osuData');

    if (mode == null) {
        mode = osudata.playmode;
    }

    const osutopdataReq: tooltypes.apiReturn = await helper.tools.api.getScoresBest(osudata.id, mode, []);


    const osutopdata: apitypes.ScoreLegacy[] & apitypes.Error = osutopdataReq.apiData; helper.tools.data.debug(osutopdataReq, 'command', 'whatif', input.message?.guildId ?? input.interaction?.guildId, 'osuTopData');
    if (osutopdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'whatif', true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', user), false);
        return;
    }
    if (osutopdata?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'whatif', true, helper.vars.errors.uErr.osu.scores.best.replace('[ID]', user), true);
        return;
    }

    const pparr = osutopdata.slice().map(x => x.pp);
    pparr.push(pp);
    pparr.sort((a, b) => b - a);
    const ppindex = pparr.indexOf(pp);

    const weight = helper.tools.calculate.findWeight(ppindex);

    const newTotal: number[] = [];

    for (let i = 0; i < pparr.length; i++) {
        newTotal.push(pparr[i] * helper.tools.calculate.findWeight(i));
    }

    const total = newTotal.reduce((a, b) => a + b, 0);
    //     416.6667 * (1 - 0.9994 ** osudata.statistics.play_count);

    const newBonus = [];
    for (let i = 0; i < osutopdata.length; i++) {
        newBonus.push(osutopdata[i].weight.pp/*  ?? (osutopdata[i].pp * osufunc.findWeight(i)) */);
    }

    const bonus = osudata.statistics.pp - newBonus.reduce((a, b) => a + b, 0);

    const guessrank = await helper.tools.data.getRankPerformance('pp->rank', (total + bonus), `${helper.tools.other.modeValidator(mode)}`,);

    let embed = new Discord.EmbedBuilder()
        .setTitle(`What if ${osudata.username} gained ${pp}pp?`)
        .setColor(helper.vars.colours.embedColour.query.dec)
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`);
    embed = helper.tools.formatter.userAuthor(osudata, embed);
    if (ppindex + 1 > 100) {
        embed.setDescription(
            `A ${pp}pp score would be outside of their top 100 plays and be weighted at 0%.
Their total pp and rank would not change.
`);
    } else {
        embed.setDescription(
            `A ${pp}pp score would be their **${helper.tools.calculate.toOrdinal(ppindex + 1)}** top play and would be weighted at **${(weight * 100).toFixed(2)}%**.
Their pp would change by **${Math.abs((total + bonus) - osudata.statistics.pp).toFixed(2)}pp** and their new total pp would be **${(total + bonus).toFixed(2)}pp**.
Their new rank would be **${Math.round(guessrank.value)}** (+${Math.round(osudata?.statistics?.global_rank - guessrank.value)}).
`
        );
    }

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed],
            components: [buttons]
        }
    }, input.canReply);
};