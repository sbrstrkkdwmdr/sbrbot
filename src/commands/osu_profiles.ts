import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';

/**
 * display users badges
 */
export const badges = async (input: bottypes.commandInput) => {
    {

        let commanduser: Discord.User | Discord.APIUser;
        let user;
        let searchid;

        switch (input.type) {
            case 'message': {

                commanduser = input.message.author;
                searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;

                input.args = helper.tools.commands.cleanArgs(input.args);

                const usertemp = helper.tools.commands.fetchUser(input.args.join(' '));
                user = usertemp.id;
                if (!user || user.includes(searchid)) {
                    user = null;
                }
            }
                break;

            case 'interaction': {
                input.interaction = (input.interaction as Discord.ChatInputCommandInteraction);
                commanduser = input.interaction.member.user;
                searchid = commanduser.id;
                user = input.interaction.options.getString('user');
            }


                break;
            case 'button': {

                commanduser = input.interaction.member.user;
                searchid = commanduser.id;
            }
                break;
        }
        helper.tools.log.commandOptions(
            [
                {
                    name: 'User',
                    value: user
                }
            ],
            input.id,
            'badges',
            input.type,
            commanduser,
            input.message,
            input.interaction,
        );

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
            osudataReq = await helper.tools.api.getUser(user, 'osu', []);
        }

        const osudata: apitypes.User = osudataReq.apiData;

        if (osudataReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'badges', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
            return;
        }

        helper.tools.data.debug(osudataReq, 'command', 'badges', input.message.guildId ?? input.interaction.guildId, 'osuData');

        if (osudata?.hasOwnProperty('error') || !osudata.id) {
            await helper.tools.commands.errorAndAbort(input, 'badges', true, helper.vars.errors.noUser(user), true);
            return;
        }

        const cmdbuttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-User-badges-any-${input.id}-${osudata.id}+${osudata.playmode}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.user),
            );

        helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(osudata.playmode), 'User');

        let badgecount = osudata.badges.length;

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${osudata.username} | #${helper.tools.calculate.separateNum(osudata?.statistics?.global_rank)} | #${helper.tools.calculate.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${helper.tools.calculate.separateNum(osudata?.statistics?.pp)}pp`,
                url: `https://osu.ppy.sh/users/${osudata.id}`,
                iconURL: `${`https://osuhelper.vars.argflags.omkserver.nl/${osudata.country_code}.png`}`
            })
            .setTitle(`${osudata.username}s Badges`)
            .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
            .setDescription(
                'Current number of badges: ' + badgecount
            );

        const fields: Discord.EmbedField[] = [];

        for (let i = 0; i < 10 && i < osudata.badges.length; i++) {
            const badge = osudata?.badges[i];
            if (!badge) break;
            fields.push(
                {
                    name: badge.description,
                    value:
                        `Awarded <t:${new Date(badge.awarded_at).getTime() / 1000}:R>
${badge.url.length != 0 ? `[Forum post](${badge.url})` : ''}
${badge.image_url.length != 0 ? `[Image](${badge.image_url})` : ''}`,
                    inline: true
                }
            );
        }

        if (fields.length > 0) {
            embed.addFields(fields);
        }



        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                embeds: [embed],
                components: [cmdbuttons]
            }
        }, input.canReply);
    }
};

/**
 * badge weight seed
 */
export const bws = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let user;
    let searchid;

    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;
            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;

            input.args = helper.tools.commands.cleanArgs(input.args);

            const usertemp = helper.tools.commands.fetchUser(input.args.join(' '));
            user = usertemp.id;
            if (!user || user.includes(searchid)) {
                user = null;
            }
        }
            break;

        case 'interaction': {
            input.interaction = (input.interaction as Discord.ChatInputCommandInteraction);
            commanduser = input.interaction.member.user;
            searchid = commanduser.id;
            user = input.interaction.options.getString('user');
        }


            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'User',
                value: user
            }
        ],
        input.id,
        'bws',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );



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
        osudataReq = await helper.tools.api.getUser(user, 'osu', []);
    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'bws', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }

    helper.tools.data.debug(osudataReq, 'command', 'bws', input.message.guildId ?? input.interaction.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'bws', true, helper.vars.errors.noUser(user), true);
        return;
    }

    const cmdbuttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-User-bws-any-${input.id}-${osudata.id}+${osudata.playmode}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.user),
        );

    helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(osudata.playmode), 'User');

    let badgecount = osudata?.badges?.length ?? 0;
    function bwsF(badgenum: number) {
        return badgenum > 0 ?
            osudata.statistics.global_rank ** (0.9937 ** (badgenum ** 2)) :
            osudata.statistics.global_rank;
    }

    const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: `${osudata.username} | #${helper.tools.calculate.separateNum(osudata?.statistics?.global_rank)} | #${helper.tools.calculate.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${helper.tools.calculate.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuhelper.vars.argflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setTitle(`Badge weighting for ${osudata.username}`)
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
        .setDescription(
            'Current number of badges: ' + badgecount
        )
        .addFields([
            {
                name: `${badgecount == 1 ? badgecount + ' badge' : badgecount + ' badges'}`,
                value: `${Math.floor(bwsF(badgecount))}`,
                inline: true
            },
            {
                name: `${badgecount + 1 == 1 ? badgecount + 1 + ' badge' : badgecount + 1 + ' badges'}`,
                value: `${Math.floor(bwsF(badgecount + 1))}`,
                inline: true
            },
            {
                name: `${badgecount + 2} badges`,
                value: `${Math.floor(bwsF(badgecount + 2))}`,
                inline: true
            },
        ]);
    //\nFormula: rank^(0.9937^badges^2)

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed],
            components: [cmdbuttons],
            edit: true,
        }
    }, input.canReply);
};

/**
 * server leaderboards
 */
export const lb = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let page = 0;
    let mode = 'osu';
    let id = null;

    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }
            input.args = helper.tools.commands.cleanArgs(input.args);
            id = input.args[0];
        }
            break;



        case 'interaction': {
            input.interaction = (input.interaction as Discord.ChatInputCommandInteraction);
            commanduser = input.interaction.member.user;
            id = input.interaction.options.getString('id');
            const gamemode = input.interaction.options.getString('mode');
            if (!gamemode || gamemode == 'osu' || gamemode == 'o' || gamemode == '0' || gamemode == 'standard' || gamemode == 'std') {
                mode = 'osu';
            }
            if (gamemode == 'taiko' || gamemode == 't' || gamemode == '1' || gamemode == 'drums') {
                mode = 'taiko';
            }
            if (gamemode == 'fruits' || gamemode == 'c' || gamemode == '2' || gamemode == 'catch' || gamemode == 'ctb') {
                mode = 'fruits';
            }
            if (gamemode == 'mania' || gamemode == 'm' || gamemode == '3' || gamemode == 'piano') {
                mode = 'mania';
            }
        }



            break;
        case 'button': {

            if (!input.message.embeds[0]) {
                return;
            }

            id = input.message.embeds[0].author.name;
            mode = input.message.embeds[0].footer.text.split(' | ')[0];

            page = 0;
            if (input.buttonType == 'BigLeftArrow') {
                page = 1;
            }
            const pageFinder = input.message.embeds[0].footer.text.split(' | ')[1].split('Page ')[1];
            switch (input.buttonType) {
                case 'LeftArrow':
                    page = +pageFinder.split('/')[0] - 1;
                    break;
                case 'RightArrow':
                    page = +pageFinder.split('/')[0] + 1;
                    break;
                case 'BigRightArrow':
                    page = +pageFinder.split('/')[1];
                    break;
            }

            if (page < 2) {
                page == 1;
            }
            commanduser = input.interaction.member.user;
        }
            break;
    }

    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('lb', commanduser, input.id);

    helper.tools.log.commandOptions(
        [            {
            name: 'Page',
            value: page
        },
        {
            name: 'Mode',
            value: mode
        },
        {
            name: 'ID',
            value: id
        }],
        input.id,
        'xxx',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

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

    if (page < 2 || typeof page != 'number') {
        page = 1;
    }
    page--;
    let global = false;
    let guild = input.message.guild ?? input.interaction.guild;
    if (id == 'global') {
        global = true;
    }
    if (typeof +id == 'number') {
        const tempguild = helper.vars.client.guilds.cache.get(id);
        if (tempguild) {
            const isThere = tempguild.members.cache.has(commanduser.id);
            guild = isThere ? tempguild : guild;
        }
    }

    const name = global ? "Global SSoB leaderboard" :
        `Server leaderboard for ${guild?.name ?? "null"}`;

    const serverlb = new Discord.EmbedBuilder()
        .setAuthor({ name: `${id ?? guild.id}` })
        .setColor(helper.vars.colours.embedColour.userlist.dec)
        .setTitle(name);
    const userids = await helper.vars.userdata.findAll();
    const useridsarraylen = await helper.vars.userdata.count();
    let rtxt = `\n`;
    const rarr = [];
    let cache: Discord.Collection<string, Discord.GuildMember> | Discord.Collection<string, Discord.User>;

    if (global) {
        cache = helper.vars.client.users.cache;
    } else {
        cache = guild.members.cache;
    }
    for (let i = 0; i < useridsarraylen; i++) {
        const user: tooltypes.dbUser = userids[i].dataValues as any;
        if (global) {
            (cache as Discord.Collection<string, Discord.User>).forEach(member => {
                if (`${member.id}` == `${user.userid}` && user != null && !rtxt.includes(`${member.id}`)) {
                    addUser({ id: member.id, name: member.username }, user);
                }
            });
        } else {
            (cache as Discord.Collection<string, Discord.GuildMember>).forEach(member => {
                if (`${member.id}` == `${user.userid}` && user != null && !rtxt.includes(`${member.id}`)) {
                    addUser({ id: member.user.id, name: member.displayName }, user);
                }
            });
        }
    }
    function addUser(member: { id: string, name: string; }, user: tooltypes.dbUser) {
        if (`${member.id}` == `${user.userid}`) {
            if (user != null && !rtxt.includes(`${member.id}`)) {
                let acc: string | number;
                let pp: string | number;
                acc = user[`${mode}acc`];
                if (isNaN(+acc) || acc == null) {
                    return;
                } else {
                    acc = user.osuacc.toFixed(2);
                }
                pp = user[`${mode}pp`];
                if (isNaN(+pp) || pp == null) {
                    return;
                } else {
                    pp = Math.floor(user.osupp);
                }
                const rank = user[`${mode}rank`];
                if (isNaN(+rank) || rank == null) {
                    return;
                }
                rarr.push(
                    {
                        discname:
                            ((member.name.replace(/\W/g, '')).padEnd(17 - 2, ' ').length) > 15 ? member.name.replace(/[^a-z0-9]/gi, '').substring(0, 12) + '...' : member.name.replace(/[^a-z0-9]/gi, '').padEnd(17 - 2, ' '),
                        osuname:
                            (user.osuname.padEnd(17 - 2, ' ')).length > 15 ? user.osuname.substring(0, 12) + '...' : user.osuname.padEnd(17 - 2, ' '),
                        rank:
                            `${rank}`.padEnd(10 - 2, ' ').substring(0, 8),
                        acc:
                            `${acc}`.substring(0, 5),
                        pp:
                            `${pp}pp`.padEnd(9 - 2, ' '),
                    }
                );
            }

        }
    }

    const another = rarr.slice().sort((b, a) => b.rank - a.rank); //for some reason this doesn't sort even tho it does in testing
    rtxt = `\`Rank    Discord           osu!              Rank       Acc      pp       `;
    const pageOffset = page * 10;
    for (let i = 0; i < rarr.length && i < 10; i++) {
        const cur = another[i + pageOffset];
        if (!cur) break;
        const pad = i + 1 >= 10 ?
            i + 1 >= 100 ?
                3
                : 4
            : 5;
        rtxt += `\n#${i + 1 + pageOffset + ')'.padEnd(pad, ' ')} ${cur.discname}   ${cur.osuname}   ${cur.rank.toString().padEnd(10 - 2, ' ').substring(0, 8)}   ${cur.acc}%   ${cur.pp}  `;
    }

    rtxt += `\n\``;
    serverlb.setDescription(rtxt);
    serverlb.setFooter({ text: mode + ` | Page ${page + 1}/${Math.ceil(rarr.length / 10)}` });
    // const endofcommand = new Date().getTime();
    // const timeelapsed = endofcommand - input.currentDate.getTime();

    if (page < 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (page + 1 >= Math.ceil(rarr.length / 10)) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [serverlb],
            components: [pgbuttons],
            edit: true
        }
    }, input.canReply);
};

/**
 * global leaderboards
 */
export const ranking = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let country = 'ALL';
    let mode: apitypes.GameMode = 'osu';
    let type: apitypes.RankingType = 'performance';
    let page = 0;
    let spotlight;
    let parse: boolean = false;
    let parseId: string;


    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;
            const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, input.args, true);
            if (pageArgFinder.found) {
                page = pageArgFinder.output;
                input.args = pageArgFinder.args;
            }
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }
            if (input.args.includes('-parse')) {
                parse = true;
                const temp = helper.tools.commands.parseArg(input.args, '-parse', 'number', 1, null, true);
                parseId = temp.value;
                input.args = temp.newArgs;
            }

            input.args = helper.tools.commands.cleanArgs(input.args);

            input.args[0] && input.args[0].length == 2 ? country = input.args[0].toUpperCase() : country = 'ALL';
        }
            break;

        case 'interaction': {
            input.interaction = (input.interaction as Discord.ChatInputCommandInteraction);
            commanduser = input.interaction.member.user;
            country = input.interaction.options.getString('country') ?? 'ALL';
            mode = (input.interaction.options.getString('mode') ?? 'osu') as apitypes.GameMode;
            type = (input.interaction.options.getString('type') ?? 'performance') as apitypes.RankingType;
            page = input.interaction.options.getInteger('page') ?? 0;
            spotlight = input.interaction.options.getInteger('spotlight') ?? undefined;
        }


            break;
        case 'button': {
            commanduser = input.interaction.member.user;
            const temp = helper.tools.commands.getButtonArgs(input.id);
            if (temp.error) {
                input.interaction.reply({
                    content: helper.vars.errors.paramFileMissing,
                    ephemeral: true,
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            page = helper.tools.commands.buttonPage(temp.page, temp.maxPage, input.buttonType);
            country = temp.country;
            mode = temp.mode;
            type = temp.rankingtype;
            if (type == 'charts') {
                spotlight = temp.spotlight;
            }
        }
            break;
    }
    if (input.overrides) {
        page = input.overrides.page ?? page;
    }

    mode = helper.tools.other.modeValidator(mode);



    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('ranking', commanduser, input.id);

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Refresh-ranking-${commanduser.id}-${input.id}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.main.refresh),
        );
    helper.tools.log.commandOptions(
        [
            {
                name: 'Country',
                value: country
            },
            {
                name: 'Mode',
                value: mode
            },
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'Spotlight',
                value: spotlight
            }
        ],
        input.id,
        'ranking',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    if (page < 2 || typeof page != 'number' || isNaN(page)) {
        page = 1;
    }
    page--;

    let extras = [];
    if (country != 'ALL') {
        // validate country
        if(!helper.tools.other.validCountryCodeA2(country)){
            await helper.tools.commands.sendMessage({
                type: input.type,
                message: input.message,
                interaction: input.interaction,
                args: {
                    content: `Invalid country code. Must be a valid [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes) code.`,
                    edit: true
                }
            }, input.canReply);
            return;
        }
        if (type == 'performance') {
            extras.push(`country=${country}`)
        }
    }
    if (type == 'charts' && !isNaN(+spotlight)) {
        extras.push(`spotlight=${spotlight}`)

    }

    let rankingdataReq: tooltypes.apiReturn<apitypes.Rankings>;
    if (helper.tools.data.findFile(input.id, 'rankingdata') &&
        input.type == 'button' &&
        !('error' in helper.tools.data.findFile(input.id, 'rankingdata')) &&
        input.buttonType != 'Refresh'
    ) {
        rankingdataReq = helper.tools.data.findFile(input.id, 'rankingdata');
    } else {
        rankingdataReq = await helper.tools.api.getRankings(mode, type, extras);
    }
    helper.tools.data.storeFile(rankingdataReq, input.id, 'rankingdata');

    const rankingdata: apitypes.Rankings = rankingdataReq.apiData;
    if (rankingdataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'ranking', true, helper.vars.errors.uErr.osu.rankings, false);
        return;
    }

    if (rankingdata?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'ranking', true, helper.vars.errors.uErr.osu.rankings, true);
        return;
    }


    try {
        helper.tools.data.debug(rankingdataReq, 'command', 'ranking', input.message.guildId ?? input.interaction.guildId, 'rankingData');
    } catch (e) {
        return;
    }
    if (rankingdata.ranking.length == 0) {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: `No data found`,
                edit: true
            }
        }, input.canReply);
        return;
    }

    let ifchart = '';
    if (type == 'charts') {
        ifchart = `[${rankingdata.spotlight.name}](https://osu.ppy.sh/rankings/${mode}/charts?spotlight=${rankingdata.spotlight.id})`;
    }

    if (input.buttonType == null) {
        helper.tools.data.userStatsCache(rankingdata.ranking, helper.tools.other.modeValidator(mode), 'Stat');
    }

    if (parse) {
        let pid = parseInt(parseId) - 1;
        if (pid < 0) {
            pid = 0;
        }
        if (pid > rankingdata.ranking.length) {
            pid = rankingdata.ranking.length - 1;
        }

        input.overrides = {
            mode,
            id: rankingdata?.ranking[pid]?.user.id,
            commanduser,
            commandAs: input.type
        };
        if (input.overrides.id == null || typeof input.overrides.id == 'undefined') {
            await helper.tools.commands.errorAndAbort(input, 'osu', true, `${helper.vars.errors.uErr.osu.score.nf} at index ${pid}`, true);
            return;
        }
        input.type = 'other';
        await osu(input);
        return;
    }

    const embed = new Discord.EmbedBuilder()
        .setFooter({
            text: `${page + 1}/${Math.ceil(rankingdata.ranking.length / 5)}`
        }).setTitle(country != 'ALL' ?
            `${mode == 'osu' ? 'osu!' : helper.tools.formatter.toCapital(mode)} ${helper.tools.formatter.toCapital(type)} Rankings for ${country}` :
            `Global ${mode == 'osu' ? 'osu!' : helper.tools.formatter.toCapital(mode)} ${helper.tools.formatter.toCapital(type)} Ranking`)
        .setColor(helper.vars.colours.embedColour.userlist.dec)
        .setDescription(`${ifchart}\n`);
    country != 'ALL' ?
        embed.setThumbnail(`https://osuhelper.vars.argflags.omkserver.nl${country}`)
        : '';

    if (page > Math.ceil(rankingdata.ranking.length / 5)) {
        page = Math.ceil(rankingdata.ranking.length / 5);
    }
    helper.tools.calculate.numberShorthand
    for (let i = 0; i < 5 && i + (page * 5) < rankingdata.ranking.length; i++) {
        const curuser = rankingdata.ranking[i + (page * 5)];
        if (!curuser) break;
        embed.addFields(
            [
                {
                    name: `${i + 1 + (page * 5)}`,
                    value:
                        `:flag_${curuser.user.country_code.toLowerCase()}: [${curuser.user.username}](https://osu.ppy.sh/users/${curuser.user.id}/${mode})
#${curuser.global_rank == null ?
                            '---' :
                            helper.tools.calculate.separateNum(curuser.global_rank)
                        }
Score: ${curuser.total_score == null ? '---' : helper.tools.calculate.numberShorthand(curuser.total_score)} (${curuser.ranked_score == null ? '---' : helper.tools.calculate.numberShorthand(curuser.ranked_score)} ranked)
${curuser.hit_accuracy == null ? '---' : curuser.hit_accuracy.toFixed(2)}% | ${curuser.pp == null ? '---' : helper.tools.calculate.separateNum(curuser.pp)}pp | ${curuser.play_count == null ? '---' : helper.tools.calculate.separateNum(curuser.play_count)} plays
`
                    ,
                    inline: false
                }
            ]
        );
    }
    helper.tools.commands.storeButtonArgs(input.id, {
        page: page + 1,
        maxPage: Math.ceil(rankingdata.ranking.length / 5),
        country,
        mode,
        rankingtype: type,
        spotlight: spotlight
    });

    if (page + 1 >= Math.ceil(rankingdata.ranking.length / 5)) {

        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);

        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }
    if (page == 0) {

        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);

        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed],
            components: [pgbuttons, buttons],
        }
    }, input.canReply);
};

/**
 * return osu! profile
 */
export const osu = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let user = null;
    let mode = null;
    let graphonly = false;
    let detailed: number = 1;
    let searchid;

    let useContent: string = null;

    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;
            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;
            const detailArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.details, input.args);
            if (detailArgFinder.found) {
                detailed = 2;
                input.args = detailArgFinder.args;
            }
            const graphArgFinder = helper.tools.commands.matchArgMultiple(['-g', '-graph',], input.args);
            if (graphArgFinder.found) {
                graphonly = true;
                input.args = graphArgFinder.args;
            }
            {
                const temp = await helper.tools.commands.parseArgsMode(input);
                input.args = temp.args;
                mode = temp.mode;
            }

            input.args = helper.tools.commands.cleanArgs(input.args);

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
            input.interaction = (input.interaction as Discord.ChatInputCommandInteraction);

            commanduser = input.interaction.member.user;
            searchid = input.interaction.member.user.id;

            user = input.interaction.options.getString('user');
            detailed = input.interaction.options.getBoolean('detailed') ? 2 : 1;
            mode = input.interaction.options.getString('mode');
        }



            break;
        case 'button': {

            if (!input.message.embeds[0]) {
                return;
            }
            commanduser = input.interaction.member.user;
            searchid = commanduser.id;

            user = input.message.embeds[0].url.split('users/')[1].split('/')[0];
            mode = input.message.embeds[0].url.split('users/')[1].split('/')[1];

            switch (input.buttonType) {
                case 'Detail1':
                    detailed = 1;
                    break;
                case 'Detail2':
                    detailed = 2;
                    break;
                case 'Graph':
                    graphonly = true;
                    break;
            }

            if (input.buttonType == 'Detail2') {
                detailed = 2;
            }
            if (input.buttonType == 'Detail1') {
                detailed = 1;
            }
            if (input.buttonType == 'Refresh') {
                if (input.message.embeds[0].fields[0]) {
                    detailed = 2;
                } else {
                    detailed = 1;
                }
            }

            if (!input.message.embeds[0].title) {
                graphonly = true;
            }
        }
            break;
        case 'link': {


            commanduser = input.message.author;

            const usertemp = helper.tools.commands.fetchUser(input.message.content);
            user = usertemp.id;
            if (usertemp.mode && !mode) {
                mode = usertemp.mode;
            }
        }
    }

    if (input.overrides) {
        if (input.overrides.mode) {
            mode = input.overrides.mode;
        }
        if (input.overrides.id) {
            user = input.overrides.id;
        }
        if (input.overrides.commandAs) {
            input.type = input.overrides.commandAs;
        }
        if (input.overrides.commanduser) {
            commanduser = input.overrides.commanduser;
            useContent = `Requested by <@${commanduser.id}>`;
        }
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
                name: 'Detailed',
                value: detailed
            },
            {
                name: 'Gamemode',
                value: mode
            },
            {
                name: 'Graph',
                value: `${graphonly}`
            }
        ],
        input.id,
        'xxx',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


    const buttons = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Refresh-osu-${commanduser.id}-${input.id}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.main.refresh),
        );
    if (graphonly != true) {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Graph-osu-${commanduser.id}-${input.id}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.graph),
        );
        switch (detailed) {
            case 1: {
                buttons.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-Detail2-osu-${commanduser.id}-${input.id}`)
                        .setStyle(helper.vars.buttons.type.current)
                        .setEmoji(helper.vars.buttons.label.main.detailMore),
                );
            }
                break;
            case 2: {
                buttons.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-Detail1-osu-${commanduser.id}-${input.id}`)
                        .setStyle(helper.vars.buttons.type.current)
                        .setEmoji(helper.vars.buttons.label.main.detailLess),
                );
            }
                break;
        }
    } else {
        buttons.addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Detail1-osu-${commanduser.id}-${input.id}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.user),
        );
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

    mode = mode ? helper.tools.other.modeValidator(mode) : null;
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

    if (helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode)) &&
        !('error' in helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode))) &&
        input.buttonType != 'Refresh' && input.type == 'button'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode));
    } else {
        osudataReq = await helper.tools.api.getUser(user, mode, []);
    }

    let osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'osu', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }

    helper.tools.data.debug(osudataReq, 'command', 'osu', input.message.guildId ?? input.interaction.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'osu', true, helper.vars.errors.noUser(user), true);
        return;
    }

    //check for player's default mode if mode is null
    if ((

        (input.type == 'interaction' && !(input.interaction as Discord.ChatInputCommandInteraction)?.options?.getString('mode'))
        || input.type == 'message' || input.type == 'link'
    ) &&
        osudata.playmode != 'osu' &&
        typeof mode != 'undefined') {
        mode = osudata.playmode;
        osudataReq = await helper.tools.api.getUser(user, mode, []);

        osudata = osudataReq.apiData;
        if (osudataReq?.error) {
            await helper.tools.commands.errorAndAbort(input, 'osu', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
            return;
        }
        helper.tools.data.debug(osudataReq, 'command', 'osu', input.message.guildId ?? input.interaction.guildId, 'osuData');
    } else {
        mode = mode ?? 'osu';
    }

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(mode));
    helper.tools.data.storeFile(osudataReq, user, 'osudata', helper.tools.other.modeValidator(mode));

    if (input.type != 'button' || input.buttonType == 'Refresh') {
        try {
            helper.tools.data.updateUserStats(osudata, osudata.playmode,);
            helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(mode), 'User');
        } catch (error) {
        }
    }

    const osustats = osudata.statistics;
    const grades = osustats.grade_counts;

    const playerrank =
        osudata.statistics?.global_rank ?
            helper.tools.calculate.separateNum(osudata.statistics.global_rank) :
            '---';

    const countryrank =
        osudata.statistics?.country_rank ?
            helper.tools.calculate.separateNum(osudata.statistics.country_rank) :
            '---';

    const rankglobal = ` #${playerrank} (#${countryrank} ${osudata.country_code} :flag_${osudata.country_code.toLowerCase()}:)`;

    const peakRank = osudata?.rank_highest?.rank ?
        `\n**Peak Rank**: #${helper.tools.calculate.separateNum(osudata.rank_highest.rank)} (<t:${new Date(osudata.rank_highest.updated_at).getTime() / 1000}:R>)` :
        '';

    const onlinestatus = osudata.is_online ?
        `**${helper.vars.emojis.onlinestatus.online} Online**` :
        (new Date(osudata.last_visit)).getTime() != 0 ?
            `**${helper.vars.emojis.onlinestatus.offline} Offline** | Last online <t:${(new Date(osudata.last_visit)).getTime() / 1000}:R>`
            : `**${helper.vars.emojis.onlinestatus.offline} Offline**`
        ;

    const prevnames = osudata.previous_usernames.length > 0 ?
        '**Previous Usernames:** ' + osudata.previous_usernames.join(', ') :
        ''
        ;

    const playcount = osustats.play_count == null ?
        '---' :
        helper.tools.calculate.separateNum(osustats.play_count);

    const lvl = osustats.level.current != null ?
        osustats.level.progress != null && osustats.level.progress > 0 ?
            `${osustats.level.current}.${Math.floor(osustats.level.progress)}` :
            `${osustats.level.current}` :
        '---';

    let supporter = '';
    switch (osudata.support_level) {
        case 0:
            break;
        case 1: default:
            supporter = helper.vars.emojis.supporter.first;
            break;
        case 2:
            supporter = helper.vars.emojis.supporter.second;
            break;
        case 3:
            supporter = helper.vars.emojis.supporter.third;
            break;
    }

    const gradeCounts = 
        `${helper.vars.emojis.grades.XH}${grades.ssh} ${helper.vars.emojis.grades.X}${grades.ss} ${helper.vars.emojis.grades.SH}${grades.sh} ${helper.vars.emojis.grades.S}${grades.s} ${helper.vars.emojis.grades.A}${grades.a}`;
        // `XH${grades.ssh} X}{grades.ss} SH${grades.sh} S}{grades.s} A}{grades.a}`;

    const osuEmbed = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.user.dec)
        .setTitle(`${osudata.username}'s ${mode ?? 'osu!'} profile`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`);

    let useEmbeds = [];
    const useFiles = [];

    async function getGraphs() {
        let chartplay;
        let chartrank;

        let nulltext = helper.vars.defaults.invisbleChar;

        if (
            (!osudata.monthly_playcounts ||
                osudata.monthly_playcounts.length == 0) ||
            (!osudata.rank_history ||
                osudata.rank_history.length == 0)) {
            nulltext = 'Error - Missing data';
            chartplay = helper.vars.defaults.images.any.url;
            chartrank = chartplay;
        } else {
            const dataplay = ('start,' + osudata.monthly_playcounts.map(x => x.start_date).join(',')).split(',');
            const datarank = ('start,' + osudata.rank_history.data.map(x => x).join(',')).split(',');

            const play =
                await helper.tools.other.graph(dataplay, osudata.monthly_playcounts.map(x => x.count), 'Playcount', {
                    startzero: true,
                    fill: true,
                    displayLegend: true,
                    pointSize: 0,
                });
            const rank =
                await helper.tools.other.graph(datarank, osudata.rank_history.data, 'Rank', {
                    startzero: false,
                    fill: false,
                    displayLegend: true,
                    reverse: true,
                    pointSize: 0,
                });
            const fileplay = new Discord.AttachmentBuilder(`${play.path}`);
            const filerank = new Discord.AttachmentBuilder(`${rank.path}`);

            useFiles.push(fileplay, filerank);

            chartplay = `attachment://${play.filename}.jpg`;
            chartrank = `attachment://${rank.filename}.jpg`;
        }
        const ChartsEmbedRank = new Discord.EmbedBuilder()
            .setTitle(`${osudata.username}`)
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
            .setDescription(nulltext)
            .setImage(`${chartrank}`);

        const ChartsEmbedPlay = new Discord.EmbedBuilder()
            .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
            .setImage(`${chartplay}`);

        return [ChartsEmbedRank, ChartsEmbedPlay];
    }

    if (graphonly) {
        const graphembeds = await getGraphs();
        useEmbeds = graphembeds;
    } else {
        if (detailed == 2) {
            const loading = new Discord.EmbedBuilder()
                .setColor(helper.vars.colours.embedColour.user.dec)
                .setTitle(`${osudata.username}'s ${mode ?? 'osu!'} profile`)
                .setURL(`https://osu.ppy.sh/users/${osudata.id}/${mode ?? ''}`)
                .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
                .setDescription(`Loading...`);

            if (input.type != 'button') {
                if (input.type == 'interaction') {
                    setTimeout(() => {
                        (input.interaction as Discord.ChatInputCommandInteraction).editReply({
                            embeds: [loading],
                            allowedMentions: { repliedUser: false },
                        })
                            .catch();
                    }, 1000);
                }
            }
            const graphembeds = await getGraphs();

            const mostplayeddataReq = await helper.tools.api.getUserMostPlayed(osudata.id, []);
            const mostplayeddata: apitypes.BeatmapPlaycount[] = mostplayeddataReq.apiData;
            if (mostplayeddataReq?.error) {
                await helper.tools.commands.errorAndAbort(input, 'osu', true, helper.vars.errors.uErr.osu.map.group_nf.replace('[TYPE]', 'most played'), false);
                return;
            }
            helper.tools.data.debug(mostplayeddataReq, 'command', 'osu', input.message.guildId ?? input.interaction.guildId, 'mostPlayedData');

            if (mostplayeddata?.hasOwnProperty('error')) {
                await helper.tools.commands.errorAndAbort(input, 'osu', true, helper.vars.errors.uErr.osu.profile.mostplayed, true);
                return;
            }
            const secperplay = osudata?.statistics.play_time / parseFloat(playcount.replaceAll(',', ''));

            let mostplaytxt = ``;
            for (let i2 = 0; i2 < mostplayeddata.length && i2 < 10; i2++) {
                const bmpc = mostplayeddata[i2];
                mostplaytxt += `\`${(bmpc.count.toString() + ' plays').padEnd(15, ' ')}\` | [${bmpc.beatmapset.title}[${bmpc.beatmap.version}]](https://osu.ppy.sh/b/${bmpc.beatmap_id})\n`;
            }

            const dailies = (osustats.play_count / (helper.tools.calculate.convert('month', 'day', osudata.monthly_playcounts.length).outvalue)).toFixed(2);
            const monthlies =
                (osustats.play_count / osudata.monthly_playcounts.length).toFixed(2);
            // osudata.monthly_playcounts.map(x => x.count).reduce((a, b) => b + a)
            osuEmbed.addFields([
                {
                    name: 'Stats',
                    value:
                        `**Global Rank:**${rankglobal}${peakRank}
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}
**Total Play Time:** ${helper.tools.calculate.secondsToTime(osudata?.statistics.play_time)} (${helper.tools.calculate.secondsToTime(osudata?.statistics.play_time, true,)})`,
                    inline: true
                },
                {
                    name: helper.vars.defaults.invisbleChar,
                    value:
                        `**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>                        
${gradeCounts}
**Medals**: ${osudata.user_achievements.length}
**Followers:** ${osudata.follower_count}
${prevnames}
${supporter} ${onlinestatus}
**Avg time per play:** ${helper.tools.calculate.secondsToTime(secperplay)}
**Avg daily playcount:** ${dailies}
**Avg monthly playcount:** ${monthlies}
`,
                    inline: true
                }
            ]);
            osuEmbed.addFields([{
                name: 'Most Played Beatmaps',
                value: mostplaytxt != `` ? mostplaytxt : 'No data',
                inline: false
            }]
            );

            useEmbeds = [osuEmbed].concat(graphembeds);
        } else {
            osuEmbed.setDescription(`
**Global Rank:**${rankglobal}${peakRank}
**pp:** ${osustats.pp}
**Accuracy:** ${(osustats.hit_accuracy != null ? osustats.hit_accuracy : 0).toFixed(2)}%
**Play Count:** ${playcount}
**Level:** ${lvl}
**Medals**: ${osudata.user_achievements.length}
${gradeCounts}
**Player joined** <t:${new Date(osudata.join_date).getTime() / 1000}:R>
**Followers:** ${osudata.follower_count}
${prevnames}
**Total Play Time:** ${helper.tools.calculate.secondsToTime(osudata?.statistics.play_time, true)}
${supporter} ${onlinestatus}
        `);
            useEmbeds = [osuEmbed];
        }
    }
    helper.tools.data.writePreviousId('user', input.message.guildId ?? input.interaction.guildId, { id: `${osudata.id}`, apiData: null, mods: null });



    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: useContent,
            embeds: useEmbeds,
            components: [buttons],
            files: useFiles,
            edit: true
        }
    }, input.canReply);
};

export const recent_activity = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let user = 'SaberStrike';
    let searchid;
    let page = 1;

    switch (input.type) {
        case 'message': {

            commanduser = input.message.author;
            searchid = input.message.mentions.users.size > 0 ? input.message.mentions.users.first().id : input.message.author.id;

            const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, input.args, true);
            if (pageArgFinder.found) {
                page = pageArgFinder.output;
                input.args = pageArgFinder.args;
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
            input.interaction = (input.interaction as Discord.ChatInputCommandInteraction);
            commanduser = input.interaction.member.user;
            searchid = commanduser.id;
            user = input.interaction.options.getString('user');
            page = input.interaction.options.getInteger('page');
        }


            break;
        case 'button': {

            commanduser = input.interaction.member.user;

            user = input.message.embeds[0].url.split('users/')[1].split('/')[0];
            page = parseInt((input.message.embeds[0].description).split('Page: ')[1].split('/')[0]);

            switch (input.buttonType) {
                case 'BigLeftArrow':
                    page = 1;
                    break;
                case 'LeftArrow':
                    page = parseInt((input.message.embeds[0].description).split('Page: ')[1].split('/')[0]) - 1;
                    break;
                case 'RightArrow':
                    page = parseInt((input.message.embeds[0].description).split('Page: ')[1].split('/')[0]) + 1;
                    break;
                case 'BigRightArrow':
                    page = parseInt((input.message.embeds[0].description).split('Page: ')[1].split('/')[1].split('\n')[0]);
                    break;
            }
        }
            break;
        case 'link': {

            commanduser = input.message.author;
        }
            break;
    }
    if (input.overrides) {
        if (input.overrides.page != null) {
            page = parseInt(`${input.overrides.page}`);
        }
    }


    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('recentactivity', commanduser, input.id);

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Refresh-recentactivity-${commanduser.id}-${input.id}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.main.refresh),
        );
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
                name: 'Page',
                value: page
            },
        ],
        input.id,
        'recentactivity',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


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

    if (page < 2 || typeof page != 'number') {
        page = 1;
    }
    page--;
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

    if (helper.tools.data.findFile(user, 'osudata', 'osu') &&
        !('error' in helper.tools.data.findFile(user, 'osudata', 'osu')) &&
        input.buttonType != 'Refresh'
    ) {
        osudataReq = helper.tools.data.findFile(user, 'osudata', 'osu');
    } else {
        osudataReq = await helper.tools.api.getUser(user, 'osu', []);

    }

    const osudata: apitypes.User = osudataReq.apiData;
    if (osudataReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'recent_activity', true, helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user), false);
        return;
    }

    helper.tools.data.debug(osudataReq, 'command', 'recent_activity', input.message.guildId ?? input.interaction.guildId, 'osuData');

    if (osudata?.hasOwnProperty('error') || !osudata.id) {
        await helper.tools.commands.errorAndAbort(input, 'recent_activity', true, helper.vars.errors.noUser(user), true);
        return;
    }

    helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', 'osu');
    helper.tools.data.storeFile(osudataReq, user, 'osudata', 'osu');

    if (input.type != 'button' || input.buttonType == 'Refresh') {
        try {
            helper.tools.data.updateUserStats(osudata, osudata.playmode,);
            helper.tools.data.userStatsCache([osudata], 'osu', 'User');
        } catch (error) {
        }
    }
    buttons
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-User-recentactivity-any-${input.id}-${osudata.id}+${osudata.playmode}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.user),
        );

    let recentActivityReq: tooltypes.apiReturn<apitypes.Event[]>;

    if (helper.tools.data.findFile(input.id, 'rsactdata') &&
        !('error' in helper.tools.data.findFile(input.id, 'rsactdata')) &&
        input.buttonType != 'Refresh'
    ) {
        recentActivityReq = helper.tools.data.findFile(input.id, 'rsactdata');
    } else {
        recentActivityReq = await helper.tools.api.getUserActivity(osudata.id,[]);
    }

    const rsactData: apitypes.Event[] & apitypes.Error = recentActivityReq.apiData;
    if (recentActivityReq?.error) {
        await helper.tools.commands.errorAndAbort(input, 'recent_activity', true, helper.vars.errors.uErr.osu.rsact, false);
        return;
    }
    helper.tools.data.debug(recentActivityReq, 'command', 'recent_activity', input.message.guildId ?? input.interaction.guildId, 'rsactData');

    if (rsactData?.hasOwnProperty('error')) {
        await helper.tools.commands.errorAndAbort(input, 'recent_activity', true, helper.vars.errors.uErr.osu.profile.rsact, true);
        return;
    }

    helper.tools.data.storeFile(recentActivityReq, input.id, 'rsactData', 'osu');

    const pageLength = 10;

    if (page < 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);

    }
    if (page >= Math.ceil(rsactData.length / pageLength) - 1) {
        page = Math.ceil(rsactData.length / pageLength) - 1;
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);

    }

    const curEmbed = new Discord.EmbedBuilder()
        .setTitle(`Recent Activity for ${osudata.username}`)
        .setURL(`https://osu.ppy.sh/users/${osudata.id}/${osudata.playmode}#recent`)
        .setAuthor({
            name: `#${helper.tools.calculate.separateNum(osudata?.statistics?.global_rank)} | #${helper.tools.calculate.separateNum(osudata?.statistics?.country_rank)} ${osudata.country_code} | ${helper.tools.calculate.separateNum(osudata?.statistics?.pp)}pp`,
            url: `https://osu.ppy.sh/users/${osudata.id}`,
            iconURL: `${`https://osuhelper.vars.argflags.omkserver.nl/${osudata.country_code}.png`}`
        })
        .setThumbnail(`${osudata?.avatar_url ?? helper.vars.defaults.images.any.url}`)
        .setDescription(`Page: ${page + 1}/${Math.ceil(rsactData.length / pageLength)}`)
        ;

    let actText = '';

    for (let i = 0; i < rsactData.length && i < pageLength; i++) {
        const curEv = rsactData[i + (page * pageLength)];
        if (!curEv) break;
        const obj = {
            number: `${i + (page * pageLength) + 1}`,
            desc: 'null',
        };
        switch (curEv.type) {
            case 'achievement': {
                const temp = curEv as apitypes.EventAchievement;
                obj.desc = `Unlocked the **${temp.achievement.name}** medal! <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetApprove': {
                const temp = curEv as apitypes.EventBeatmapsetApprove;
                obj.desc = `Approved **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapPlaycount': {
                const temp = curEv as apitypes.EventBeatmapPlaycount;
                obj.desc =
                    `Achieved ${temp.count} plays on [\`${temp.beatmap.title}\`](https://osu.ppy.sh${temp.beatmap.url}) <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetDelete': {
                const temp = curEv as apitypes.EventBeatmapsetDelete;
                obj.desc = `Deleted **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetRevive': {
                const temp = curEv as apitypes.EventBeatmapsetRevive;
                obj.desc = `Revived **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetUpdate': {
                const temp = curEv as apitypes.EventBeatmapsetUpdate;
                obj.desc = `Updated **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'beatmapsetUpload': {
                const temp = curEv as apitypes.EventBeatmapsetUpload;
                obj.desc = `Submitted **[\`${temp.beatmapset.title}\`](https://osu.ppy.sh${temp.beatmapset.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'rank': {
                const temp = (curEv as apitypes.EventRank);
                obj.desc =
                    `Achieved rank **#${temp.rank}** on [\`${temp.beatmap.title}\`](https://osu.ppy.sh${temp.beatmap.url}) (${helper.vars.emojis.gamemodes[temp.mode]}) <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            }
                break;
            case 'rankLost': {
                const temp = curEv as apitypes.EventRankLost;
                obj.desc = `Lost #1 on **[\`${temp.beatmap.title}\`](https://osu.ppy.sh${temp.beatmap.url})** <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'userSupportAgain': {
                const temp = curEv as apitypes.EventUserSupportAgain;
                obj.desc = `Purchased supporter <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'userSupportFirst': {
                const temp = curEv as apitypes.EventUserSupportFirst;
                obj.desc = `Purchased supporter for the first time <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'userSupportGift': {
                const temp = curEv as apitypes.EventUserSupportGift;
                obj.desc = `Was gifted supporter <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`;
            } break;
            case 'usernameChange': {
                const temp = curEv as apitypes.EventUsernameChange;
                obj.desc = `Changed their username from ${temp.user.previousUsername} to ${temp.user.username} <t:${(new Date(temp.created_at).getTime()) / 1000}:R>`
                    ;
            } break;
        }
        actText += `**${obj.number})** ${obj.desc}\n\n`;
    }
    if (actText.length == 0) {
        actText = 'No recent activity found';
    }
    curEmbed.setDescription(`Page: ${page + 1}/${Math.ceil(rsactData.length / pageLength)}

    
${actText}`);



    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [curEmbed],
            components: [pgbuttons, buttons],
            edit: true
        },
    }, input.canReply
    );
};