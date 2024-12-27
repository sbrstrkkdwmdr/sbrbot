import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as weathertypes from '../types/openmeteoapi.js';
import * as countrytypes from '../types/restcountriesapi.js';
import * as tz from '../vars/timezones.js';

import * as fs from 'fs';
import * as luxon from 'luxon';
import moment from 'moment';
import pkgjson from '../../package.json';

/**
 * 
 */
export const changelog: bottypes.command = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    let version: string = null;
    let useNum: number = null;
    let isList = false;
    let page: number = null;
    let foundBool = false;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, input.args, true);
            if (pageArgFinder.found) {
                page = pageArgFinder.output;
                input.args = pageArgFinder.args;
            }
            version = input.args[0] ?? null;
        }
            break;

        case 'button': {
            commanduser = input.interaction.member.user;
            const curpage = parseInt(
                input.message.embeds[0].footer.text.split('/')[0]
            ) - 1;
            switch (input.buttonType) {
                case 'BigLeftArrow':
                    useNum = 0;
                    foundBool = true;
                    break;
                case 'LeftArrow':
                    useNum = curpage - 1;
                    foundBool = true;
                    break;
                case 'RightArrow':
                    useNum = curpage + 1;
                    foundBool = true;
                    break;
                case 'BigRightArrow':
                    useNum = parseInt(
                        input.message.embeds[0].footer.text.split('/')[1]
                    ) - 1;
                    foundBool = true;
                    break;
                default:
                    useNum = curpage;
                    break;
            }
            if (input.message.embeds[0].title.toLowerCase().includes('all versions')) {
                version = 'versions';
                isList = true;
            }

            switch (input.buttonType) {
                case 'Detail0':
                    isList = false;
                    version = null;
                    break;
                case 'Detail1':
                    isList = true;
                    version = 'versions';
                    break;
            }
        }
            break;
    }

    if (input.overrides) {
        if (input.overrides.page != null) {
            page = input.overrides.page;
            useNum = input.overrides.page - 1;
        }
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'Version',
                value: version
            },
            {
                name: 'UseNum',
                value: useNum
            },
            {
                name: 'Page',
                value: page
            },
            {
                name: 'List Mode',
                value: isList
            }
        ],
        input.id,
        'changelog',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('changelog', commanduser, input.id);
    const buttons = new Discord.ActionRowBuilder();
    //get version
    let found: string | number = null;
    if (version) {
        //search for version
        if (version?.includes('.')) {
            found = helper.vars.versions.versions.findIndex(x =>
                version.trim() === `${x.name}`.trim() || version.includes(`${x.releaseDate}`) || version.includes(`${x.releaseDate}`)
                || (`${x.releaseDate}`).includes(version) || `${x.releaseDate}`.includes(version)
            );
            foundBool = true;
            if (found == -1) {
                found = null;
            }
        } else {
            switch (version.toLowerCase()) {
                case 'wip': case 'pending': case 'next':
                    found = 0;
                    useNum = 0;
                    foundBool = true;
                    break;
                case 'first': case 'original':
                    found = helper.vars.versions.versions.length - 1;
                    useNum = helper.vars.versions.versions.length - 1;
                    foundBool = true;
                    break;
                case 'second':
                    found = helper.vars.versions.versions.length - 2;
                    useNum = helper.vars.versions.versions.length - 2;
                    foundBool = true;
                    break;
                case 'third':
                    found = helper.vars.versions.versions.length - 3;
                    useNum = helper.vars.versions.versions.length - 3;
                    foundBool = true;
                    break;
                case 'latest':
                    found = 1;
                    useNum = 1;
                    foundBool = true;
                    break;
                case 'versions': case 'list': case 'all':
                    foundBool = true;
                default:
                    found = 'string';
                    break;
            }
        }
    }
    if (((!foundBool && found != 'string') || (page && found == 'string')) && !input.buttonType) {
        useNum = page ? page - 1 : null;
    }
    if (useNum < 1 && !foundBool) {
        useNum = found && !isNaN(+found) ?
            +found :
            typeof found === 'string' ?
                0 : 1;
    }
    if (!useNum && found) {
        useNum = +found;
    }
    const Embed = new Discord.EmbedBuilder();
    const exceeded = 'Exceeded character limit. Please click [here](https://github.com/sbrstrkkdwmdr/sbrbot/blob/main/changelog.md) to view the changelog.';
    if (isNaN(useNum) || !useNum) useNum = 0;
    if (typeof found == 'string') {
        isList = true;
        // let txt = '' helper.vars.versions.versions.map(x => `\`${(x.name).padEnd(10)} (${x.releaseDate})\``).join('\n');
        const doc = fs.readFileSync(`${helper.vars.path.main}/cache/changelog.md`, 'utf-8');
        let txt = '\`VERSION      |    DATE    | CHANGES\`\n';
        const list = doc.split('## [');
        list.shift();
        if (useNum + 1 >= Math.ceil(helper.vars.versions.versions.length / 10)) {
            useNum = Math.ceil(helper.vars.versions.versions.length / 10) - 1;
        }
        const pageOffset = useNum * 10;
        for (let i = 0; pageOffset + i < helper.vars.versions.versions.length && i < 10; i++) {
            const sumVer = helper.vars.versions.versions[pageOffset + i];
            const useVer = list[pageOffset + i];
            const changes = useVer?.split('</br>')[1]?.split('\n')
                .map(x => x.trim()).filter(x => x.length > 2 && !x.includes('### ')) ?? [];
            txt += `\`${(sumVer.name).padEnd(12)} | ${sumVer.releaseDate} | ${changes.length}\`\n`;
        }
        if (txt.length > 2000) {
            txt = exceeded;
        }
        Embed.setTitle('All Versions')
            .setDescription(txt)
            .setFooter({
                text: `${useNum + 1}/${Math.ceil(helper.vars.versions.versions.length / 10)}`
            });
        foundBool ? null : Embed.setAuthor({ name: `\nThere was an error trying to find version \`${version}\`` });
    } else {
        const document = /* useGit ? */
            fs.readFileSync(`${helper.vars.path.main}/cache/changelog.md`, 'utf-8');
        /*             :
                    fs.readFileSync(`${precomphelper.vars.path.main}/changelog.txt`, 'utf-8'); */
        const list = document.split('## [');
        list.shift();
        if (useNum >= list.length) {
            useNum = list.length - 1;
        }
        const cur = list[useNum] as string;
        const verdata = helper.vars.versions.versions[useNum];
        const commit = cur.split('[commit](')[1].split(')')[0];
        const commitURL = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/[^\s]*)?$/g.test(commit) ?
            commit :

            pkgjson['repository']['url'] +
            commit.replaceAll(/[^a-z0-9]/g, '');
        const changesTxt = cur.includes('</br>') ? cur.split('</br>')[1] :
            cur.split('\n').slice(3).join('\n');
        const changesList =
            changesTxt ?
                changesTxt.split('\n')
                    .map(x => x.trim())
                    .filter(x => x.length > 2) : [];
        let txt = '';
        for (const change of changesList) {
            if (change.startsWith('###')) {
                const temp = change.replaceAll('###', '').trim();
                switch (temp) {
                    case 'Fixed':
                        txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "yellow", "text");
                        break;
                    case 'Changed':
                        txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "blue", "text");
                        break;
                    case 'Added':
                        txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "green", "text");
                        break;
                    case 'Removed':
                        txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "red", "text");
                        break;
                    case 'Deprecated':
                        txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "pink", "text");
                        break;
                    default:
                        txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "cyan", "text");
                        break;
                }
            } else {
                txt += change.replace('-', '`-`') + '\n';
            }
        }
        txt = txt.slice(0, 2000);
        if (txt.trim().length == 0) {
            txt = '\nNo changes recorded';
        }

        if (txt.length > 2000) {
            txt = exceeded;
        }

        Embed
            .setTitle(`${verdata.name.trim()} Changelog`)
            .setURL(commitURL)
            .setDescription(`commit [${commit.includes('commit/') ?
                commitURL.split('commit/')[1].trim()?.slice(0, 7)?.trim() : 'null'}](${commitURL})
Released ${verdata.releaseDate}
Total of ${changesList.filter(x => !x.includes('### ')).length} changes.${txt}
`)
            .setFooter({
                text: `${useNum + 1}/${helper.vars.versions.versions.length}`
            });
    }

    if (isList) {
        buttons
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Detail0-changelog-${commanduser.id}-${input.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.main.detailLess),
            );
    } else {
        buttons
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Detail1-changelog-${commanduser.id}-${input.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.main.detailMore),
            );
    }

    if (useNum == 0) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if ((useNum + 1 >= helper.vars.versions.versions.length && !isList) || (useNum + 1 >= Math.ceil(helper.vars.versions.versions.length / 10) && isList)) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [Embed],
            components: [pgbuttons, buttons]
        }
    }, input.canReply);



};

/**
 * convert a value
 */
export const convert: bottypes.command = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let cat1: string = '';
    let cat2: string = '';
    let num: string | number = 1;
    let numAsStr: string = num.toString();
    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            input.args = input.args.filter(x => x != `${num}`);
            cat1 = input.args[0] ?? '';
            cat2 = input.args[1] ?? '';
            if (!input.args[0]) {
                cat1 = 'help';
            }
            if (!input.args[1]) {
                cat2 = 'help';
            }
            if (input.args.includes('-i')) {
                const temp = helper.tools.commands.parseArg(input.args, '-i', 'string', cat1, null, true);
                cat1 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-in')) {
                const temp = helper.tools.commands.parseArg(input.args, '-in', 'string', cat1, null, true);
                cat1 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-input')) {
                const temp = helper.tools.commands.parseArg(input.args, '-input', 'string', cat1, null, true);
                cat1 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-o')) {
                const temp = helper.tools.commands.parseArg(input.args, '-o', 'string', cat2, null, true);
                cat2 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-out')) {
                const temp = helper.tools.commands.parseArg(input.args, '-out', 'string', cat2, null, true);
                cat2 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-output')) {
                const temp = helper.tools.commands.parseArg(input.args, '-output', 'string', cat2, null, true);
                cat2 = temp.value;
                input.args = temp.newArgs;
            }
            input.args = helper.tools.commands.cleanArgs(input.args);
            for (const arg of input.args) {
                if (!isNaN(+arg)) {
                    num = input.args[2] ?? input.args[0];
                    numAsStr = `${num}`;
                    break;
                }
            }
        }
            break;
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'From',
                value: cat1
            },
            {
                name: 'To',
                value: cat2
            },
            {
                name: 'Number',
                value: `${num}`
            }
        ],
        input.id,
        'convert',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    const embedres = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.info.dec);
    // .setDescription('⠀');

    let useEmbeds = [];

    let converting = true;

    const reqHelp: string[] = ['help', 'units'];
    const reqSlc: string[] = ['slc'];
    const reqprefix: string[] = ['si', 'metricprefixes', 'prefix'];

    function toName(x: { names: string[]; }) {
        return x.names[1] ? `${x.names[0]} (${x.names[1]})` : x.names[0];
    }

    if ((reqHelp.includes(cat1.toLowerCase()) || cat2 == '')
        && !reqSlc.includes(cat1.toLowerCase())
        && !reqprefix.includes(cat1.toLowerCase())
    ) {
        useEmbeds = [new Discord.EmbedBuilder()
            .setColor(helper.vars.colours.embedColour.info.dec)
            .setTitle('List of measurements')
            .addFields(
                {
                    name: 'Temperature',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Temperature')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Distance',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Distance')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Time',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Time')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Volume',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Volume')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Mass',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Mass')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Pressure',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Pressure')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Energy',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Energy')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Power',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Power')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Area',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Area')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Angle',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Angle')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Speed',
                    value: helper.vars.conversions.values.filter(x => x.type == 'Speed')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Number bases',
                    value: 'Binary, Octal, Decimal, Hexadecimal',
                    inline: true,
                },
                {
                    name: 'Non-measurements',
                    value: 'help, metricprefixes',
                    inline: false
                })];
        converting = false;
    }
    if (reqSlc.includes(cat1.toLowerCase())) {
        useEmbeds = [new Discord.EmbedBuilder()
            .setColor(helper.vars.colours.embedColour.info.dec)
            .setTitle('Standard Laboratory Conditions')
            .addFields([
                {
                    name: '25 C (298.15 K) and 1.000 atm (101.325 kPa)',
                    value:
                        `100mL H₂O = 100g H₂O`,
                    inline: false
                },
                {
                    name: '25 C (298.15 K) and 100 kPa (0.986923 atm)',
                    value:
                        `100mL H₂O = 99.7g H₂O`,
                    inline: false
                }
            ])];
        converting = false;
    }
    if (reqprefix.includes(cat1.toLowerCase())) {
        useEmbeds = [new Discord.EmbedBuilder()
            .setColor(helper.vars.colours.embedColour.info.dec)
            .setTitle('List of SI prefixes')
            .addFields([
                {
                    name: 'Increments',
                    value:
                        `\`
Q  | quetta | 10^30 | Nonillion  
R  | ronna  | 10^27 | Octillion  
Y  | yotta  | 10^24 | Septillion 
Z  | zetta  | 10^21 | Sextillion 
E  | exa    | 10^18 | Quintillion
P  | peta   | 10^15 | Quadrillion
T  | tera   | 10^12 | Trillion   
G  | giga   | 10^9  | Billion    
M  | mega   | 10^6  | Million    
k  | kilo   | 10^3  | Thousand   
h  | hecto  | 10^2  | Hundred    
da | deca   | 10^1  | Ten        
\``,
                    inline: false
                },
                {
                    name: 'Decrements',
                    value:
                        `\`
d | deci   | 10^-1  | Tenth        
c | centi  | 10^-2  | Hundredth    
m | milli  | 10^-3  | Thousandth   
μ | micro  | 10^-6  | Millionth    
n | nano   | 10^-9  | Billionth     
p | pico   | 10^-12 | Trillionth   
f | femto  | 10^-15 | Quadrillionth
a | atto   | 10^-18 | Quintillionth
z | zepto  | 10^-21 | Sextillionth 
y | yocto  | 10^-24 | Septillionth 
r | ronto  | 10^-27 | Octillionth  
q | quecto | 10^-30 | Nonillionth  
\``,
                    inline: false
                }
            ])];
        converting = false;
    }

    if (converting == true) {
        //find
        const data = helper.tools.calculate.convert(cat1, cat2, +num);
        embedres.setTitle(`${data.type} conversion`);
        embedres.addFields([
            {
                name: `${data.change}`,
                value:
                    `
\`Full: ${data.outvalue}
SF:   ${data.significantFigures}\`   
`,
                inline: false
            },
            {
                name: 'Formula',
                value: `\`${data.formula}\``,
                inline: false
            },
            {
                name: `${data.type} units`,
                value: `${data.otherUnits}`,
                inline: false
            }
        ]);
        if (data.formula.includes('not found')) {
            const c1 = helper.tools.calculate.numBaseToInt(helper.tools.calculate.numConvertTyping(cat1));
            const c2 = helper.tools.calculate.numBaseToInt(helper.tools.calculate.numConvertTyping(cat2));
            const tdata = helper.tools.calculate.numConvert(`${num}`, c1, c2);
            if (!tdata.includes('INVALID')) {
                embedres
                    .setTitle('Base number conversion')
                    .setFields([
                        {
                            name: 'Data',
                            value: `\`${tdata}\``,
                        },
                        {
                            name: 'Other types',
                            value: 'Binary, Octal, Decimal, Hexadecimal'
                        }
                    ]);
            }
        }
        useEmbeds.push(embedres);
    }


    await helper.tools.commands.sendMessage(
        {
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                embeds: useEmbeds
            }
        }, input.canReply
    );



};

/**
 * get country data
 */
export const country: bottypes.command = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User;
    let search: string;
    let type: countrytypes.countryDataSearchTypes = 'name';

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            if (input.args.includes('-fullname')) {
                type = 'fullname';
                input.args.splice(input.args.indexOf('-fullname'), 1);
            }
            if (input.args.includes('-code')) {
                type = 'code';
                input.args.splice(input.args.indexOf('-code'), 1);
            }
            if (input.args.includes('-iso')) {
                type = 'code';
                input.args.splice(input.args.indexOf('-iso'), 1);
            }
            if (input.args.includes('-codes')) {
                type = 'codes';
                input.args.splice(input.args.indexOf('-codes'), 1);
            }
            if (input.args.includes('-demonym')) {
                type = 'demonym';
                input.args.splice(input.args.indexOf('-demonym'), 1);
            }
            if (input.args.includes('-people')) {
                type = 'demonym';
                input.args.splice(input.args.indexOf('-people'), 1);
            }
            if (input.args.includes('-capital')) {
                type = 'capital';
                input.args.splice(input.args.indexOf('-capital'), 1);
            }
            if (input.args.includes('-translation')) {
                type = 'translation';
                input.args.splice(input.args.indexOf('-translation'), 1);
            }
            search = input.args.join(' ') ?? null;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Search',
                value: search
            }
        ],
        input.id,
        'xxx',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    if (!search || search.length == 0) {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: helper.vars.errors.uErr.country.ms,
                edit: true
            }
        }, input.canReply);
        return;
    }
    let data;
    if (helper.tools.data.findFile(search, 'countrydata') &&
        !('error' in helper.tools.data.findFile(search, 'countrydata')) &&
        input.buttonType != 'Refresh'
    ) {
        data = { data: helper.tools.data.findFile(search, 'countrydata') };
    } else {
        data = await helper.tools.api.getCountryData(search, type);
    }

    if (data.hasOwnProperty('error')) {
        helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: helper.vars.errors.uErr.country.nf.replace('[ID]', `${search}`),
                edit: true
            }
        }, input.canReply);
        return;
    }

    helper.tools.data.storeFile(data?.data, search, 'countrydata');

    const countryData = data.data as countrytypes.countryData[];
    if (countryData.length == 0) {
        helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: helper.vars.errors.uErr.country.nf.replace('[ID]', `${search}`),
                edit: true
            }
        }, input.canReply);
        return;
    }
    const country = countryData[0];

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Time-Country-${commanduser.id}-${input.id}-${country.capital[0] ?? country.timezones[0]}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.time),
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Weather-Country-${commanduser.id}-${input.id}-${country.capital[0] ?? country.name.common}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.weather),
        );

    const name = country.name.official +
        (country.name.official !=
            (Object.values(country.name.nativeName)[0] as countrytypes.langName)?.official
            ?
            ` (${(Object.values(country.name.nativeName)[0] as countrytypes.langName)?.official})`
            : '');
    const capital = country.capital.length > 1 ?
        country.capital.join(', ') : country.capital[0];
    const languages: string[] = [];
    for (const lang in country.languages) {
        languages.push(country.languages[lang]);
    }

    const currencyrn: string[] = [];
    for (const cur in country.currencies) {
        currencyrn.push(`${country.currencies[cur].name} (${country.currencies[cur]?.symbol} ${cur})`);
    }


    const embed = new Discord.EmbedBuilder()
        .setTitle(name)
        .setDescription(`${country.region}\n${country.subregion}`)
        .setFields(
            {
                name: 'Capital(s)',
                value: `${capital}`,
                inline: true
            },
            {
                name: 'Population',
                value: `${helper.tools.calculate.separateNum(country.population)}`,
                inline: true
            },
            {
                name: 'Land Area',
                value: `${helper.tools.calculate.separateNum(country.area)}km²`,
                inline: true
            },
            {
                name: 'Currency',
                value: `${currencyrn.join(', ')}`,
                inline: true
            },
            {
                name: 'Coordinates',
                value: `${country.latlng.join(',')} (Capital ${country.capitalInfo.latlng.join(',')})`,
                inline: true
            },
            {
                name: 'Languages',
                value: `${languages.join(', ')}`,
                inline: true
            },
            {
                name: 'Other Information',
                value: `
Phone: ${country.idd.root}${country.idd.suffixes.length == 1 ? country.idd.suffixes[0] : ''}
Drives on the ${country.car.side} of the road
${country.unMember ? 'Is a member of the UN' : ''}
`,
                inline: false
            },
            {
                name: 'ISO CODES',
                value: `\`\`\`
cca2: ${country.cca2}
ccn3: ${country.ccn3}
cca3: ${country.cca3}
cioc: ${country.cioc}
\`\`\``
            }
        )
        .setThumbnail(country.coatOfArms.png)
        .setImage(country.flags.png);



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

/**
 * list all commands or info about a specific command
 */
export const help: bottypes.command = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let rdm = false;
    let commandfound: boolean = false as boolean;

    let commandCategory: string = 'default';
    let command: string;
    function cmdToTxt(input: bottypes.commandInfo[]) {
        return '`' + input.map(x => x.name + '`').join(', `');
    }
    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
            command = input.args[0];
            if (!input.args[0]) {
                command = null;
            }
        }
            break;
        case 'button': {
            commanduser = input.interaction.member.user;
            if (input.buttonType == 'Random') {
                rdm = true;
            }
            switch (input.buttonType) {
                case 'Random':
                    rdm = true;
                    break;
                case 'Detailed':
                    command = null;
                    break;
            }
            const curembed: Discord.Embed = input.message.embeds[0];
            if (input.buttonType == 'Detailed' && curembed.description.includes('Prefix is')) {
                command = 'list';
            }
        }
            break;
    }

    if (input.overrides) {
        if (input.overrides.ex) {
            command = `${input.overrides.ex}`;
        }
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'Command',
                value: command
            },
            {
                name: 'Random',
                value: `${rdm}`
            }
        ],
        input.id,
        'help',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    if (rdm == true) {
        const initrdm = Math.floor(Math.random() * 4);
        switch (initrdm) {
            case 1:
                command = rdmp('cmds');
                break;
            case 2:
                command = rdmp('osucmds');
                break;
            case 3:
                command = rdmp('admincmds');
                break;
            case 4:
                command = rdmp('othercmds');
                break;
        }
    }
    const buttons = new Discord.ActionRowBuilder()
        .setComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Random-help-${commanduser.id}-${input.id}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.extras.random),
            new Discord.ButtonBuilder()
                .setCustomId(`${helper.vars.versions.releaseDate}-Detailed-help-${commanduser.id}-${input.id}`)
                .setStyle(helper.vars.buttons.type.current)
                .setEmoji(helper.vars.buttons.label.main.detailed)
        );
    const useEmbeds = [];
    const useComponents: any = [buttons];
    let ctname = 'generalcmd';
    function commandEmb(command: bottypes.commandInfo, embed) {
        let usetxt = '';
        if (command.usage) {
            usetxt += `\`${helper.vars.config.prefix}${command.usage}\``;
        }
        if (command.linkUsage) {
            usetxt += `### Link Usage\n${command.linkUsage.map(x => `\`${x}\``).join('\n')}`;
        }

        // let exceedTxt = '';
        // let exceeds = false;

        const commandaliases = command.aliases && command.aliases.length > 0 ? command.aliases.join(', ') : 'none';
        // let commandexamples = command.examples && command.examples.length > 0 ? command.examples.join('\n').replaceAll('PREFIXMSG', helper.vars.config.prefix) : 'none'
        const commandexamples = command.examples && command.examples.length > 0 ? command.examples.slice(0, 5).map(x => x.text).join('\n').replaceAll('PREFIXMSG', helper.vars.config.prefix) : 'none';

        embed.setTitle("Command info for: " + command.name)
            .setURL(`https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands.html`)
            .setDescription("To see full details about this command, visit [here](https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands.html)\n\n" + command.description + "\n")
            .addFields([
                {
                    name: 'Usage',
                    value: usetxt,
                    inline: false,
                },
                {
                    name: 'Aliases',
                    value: commandaliases,
                    inline: false
                },
                {
                    name: 'Examples',
                    value: commandexamples,
                    inline: false
                },
            ]);
        // if (exceeds) {
        //     embed.addFields([
        //         {
        //             name: 'Error',
        //             value: exceedTxt,
        //             inline: false
        //         }
        //     ]);
        // }
    }
    function getemb() {
        if (command == 'list') {
            useEmbeds.push(new Discord.EmbedBuilder()
                .setColor(helper.vars.colours.embedColour.info.dec)
                .setTitle('Command List')
                .setURL('https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands')
                .setDescription('use `/help <command>` to get more info on a command')
                .addFields([
                    {
                        name: 'Main commands',
                        value: cmdToTxt(helper.vars.commandData.cmds),
                        inline: false
                    },
                    {
                        name: 'osu! comands',
                        value: cmdToTxt(helper.vars.commandData.osucmds),
                        inline: false
                    },
                    {
                        name: 'Admin commands',
                        value: cmdToTxt(helper.vars.commandData.admincmds),
                        inline: false
                    },
                    {
                        name: 'Other/misc commands',
                        value: cmdToTxt(helper.vars.commandData.othercmds),
                        inline: false
                    },
                ])
                .setFooter({
                    text: 'Website: https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands | Github: https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts'
                }));
            commandCategory = 'default';
        } else if (command != null) {
            const fetchcmd = command.toString();
            const commandInfo = new Discord.EmbedBuilder()
                .setColor(helper.vars.colours.embedColour.info.dec);
            if (command.includes('button')) {
                commandfound = false;
                commandCategory = 'default';
                let desc = 'List of all buttons available';
                let buttonstxt = '\n';
                for (let i = 0; i < helper.vars.commandData.buttons.length; i++) {
                    const curbtn = helper.vars.commandData.buttons[i];
                    buttonstxt += `${curbtn.emoji}\`${curbtn.name}\`: ${curbtn.description}\n`;
                }
                desc += buttonstxt;
                commandInfo.setTitle('Buttons')
                    .setDescription(desc);
            } else if (helper.vars.commandData.cmds.find(obj => obj.name == fetchcmd)) {
                commandfound = true;
                commandCategory = 'gen';
                ctname = 'generalcmd';
                const res = helper.vars.commandData.cmds.find(obj => obj.name == fetchcmd);
                commandEmb(res, commandInfo);
            } else if (helper.vars.commandData.cmds.find(obj => obj.aliases.concat([obj.name]).includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'gen';
                ctname = 'generalcmd';
                const res = helper.vars.commandData.cmds.find(obj => obj.aliases.concat([obj.name]).includes(fetchcmd));
                commandEmb(res, commandInfo);
            }
            else if (helper.vars.commandData.othercmds.find(obj => obj.aliases.concat([obj.name]).includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'misc';
                ctname = 'misccmd';
                const res = helper.vars.commandData.othercmds.find(obj => obj.aliases.concat([obj.name]).includes(fetchcmd));
                commandEmb(res, commandInfo);
            }
            else if (helper.vars.commandData.osucmds.find(obj => obj.aliases.concat([obj.name]).includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'osu';
                ctname = 'osucmd';
                const res = helper.vars.commandData.osucmds.find(obj => obj.aliases.concat([obj.name]).includes(fetchcmd));
                commandEmb(res, commandInfo);
            }
            else if (helper.vars.commandData.admincmds.find(obj => obj.aliases.concat([obj.name]).includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'admin';
                ctname = 'admincmd';
                const res = helper.vars.commandData.admincmds.find(obj => obj.aliases.concat([obj.name]).includes(fetchcmd));
                commandEmb(res, commandInfo);
            }
            else if (command.toLowerCase().includes('category')) {
                switch (true) {
                    case command.includes('gen'): case command.includes('main'): {
                        commandInfo.setTitle("General Commands")
                            .setDescription(categorise('cmds'));
                        commandCategory = 'gen';
                    }
                        break;
                    case command.includes('osu'): {
                        commandInfo.setTitle("osu! Commands")
                            .setDescription(categorise('osucmds'));
                        commandCategory = 'osu';
                    }
                        break;
                    case command.includes('admin'): {
                        commandInfo.setTitle("Admin Commands")
                            .setDescription(categorise('admincmds'));
                        commandCategory = 'admin';
                    }
                        break;
                    case command.includes('misc'): {
                        commandInfo.setTitle("Miscellaneous Commands")
                            .setDescription(categorise('othercmds'));
                        commandCategory = 'misc';
                    }
                        break;
                    case command.includes('all'): {
                        command = 'list';
                        getemb();
                    }
                    default:
                        command = null;
                        getemb();
                        break;
                }
            }
            else {
                command = null;
                getemb();
                return;
            }

            useEmbeds.push(commandInfo);
        } else {
            useEmbeds.push(new Discord.EmbedBuilder()
                .setColor(helper.vars.colours.embedColour.info.dec)
                .setTitle('Help')
                .setURL('https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands')
                .setDescription(`Prefix is: MSGPREFIX
- Use \`MSGPREFIXhelp <command>\` to get more info on a command or \`/help list\` to get a list of commands
- \`MSGPREFIXhelp category<category>\` will list only commands from that category
- Arguments are shown as either <arg> or [arg]. Angled brackets "<arg>" are required and square brackets "[arg]" are optional.
- Argument values can be specified with \`-key value\` (eg. \`-page 3\`)
- Argument values with spaces (such as names) can be specified with quotes eg. "saber strike"
- You can use \`MSGPREFIXosuset\` to automatically set your osu! username and gamemode for commands such as \`recent\` (rs)
- Mods are specified with +[mods] (include), -mx [mods] (match exact) or -me [mods] (exclude). -mx overrides +[mods]
- Gamemode can be specified by using -(mode) in commands that support it (eg. -taiko)
`.replaceAll('MSGPREFIX', helper.vars.config.prefix))
                .setFooter({
                    text: 'Website: https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands | Github: https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts'
                }));
            commandCategory = 'default';
        }
    }
    function rdmp(w: string) {
        const fullyrando = Math.floor(Math.random() * helper.vars.commandData[w].length);
        return helper.vars.commandData[w][fullyrando].name;
    }
    function categorise(type: 'cmds' | 'osucmds' | 'admincmds' | 'othercmds') {
        let desctxt = '';
        for (let i = 0; i < helper.vars.commandData[type].length; i++) {
            desctxt += `\n\`${helper.vars.commandData[type][i].name}\`: ${helper.vars.commandData[type][i].description.split('.')[0]}`;
        }
        if (desctxt == '') {
            desctxt = 'No commands in this category';
        }
        commandfound = true;
        if (desctxt.length > 4000) {
            desctxt = desctxt.slice(0, 3900);
            desctxt += "\n\nThe text has reached maximum length. See [here](https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands) for the rest of the commands";
        }
        return desctxt;
    }

    getemb();

    const inputMenu = new Discord.StringSelectMenuBuilder()
        .setCustomId(`${helper.vars.versions.releaseDate}-SelectMenu1-help-${commanduser.id}-${input.id}`)
        .setPlaceholder('Select a command');

    const selectCategoryMenu = new Discord.StringSelectMenuBuilder()
        .setCustomId(`${helper.vars.versions.releaseDate}-SelectMenu2-help-${commanduser.id}-${input.id}`)
        .setPlaceholder('Select a command category')
        .setOptions(
            new Discord.StringSelectMenuOptionBuilder()
                .setEmoji('📜' as Discord.APIMessageComponentEmoji)
                .setLabel('General')
                .setValue('CategoryMenu-gen'),
            new Discord.StringSelectMenuOptionBuilder()
                .setEmoji(helper.vars.emojis.gamemodes.standard as Discord.APIMessageComponentEmoji)
                .setLabel('osu!')
                .setValue('CategoryMenu-osu'),
            new Discord.StringSelectMenuOptionBuilder()
                .setEmoji('🤖' as Discord.APIMessageComponentEmoji)
                .setLabel('Admin')
                .setValue('CategoryMenu-admin'),
            new Discord.StringSelectMenuOptionBuilder()
                .setEmoji('❓' as Discord.APIMessageComponentEmoji)
                .setLabel('Misc')
                .setValue('CategoryMenu-misc'),
        );
    useComponents.push(
        new Discord.ActionRowBuilder()
            .setComponents(selectCategoryMenu)
    );
    let curpick: any = 'def';
    const push = [];




    switch (commandCategory) {
        case 'gen':
            curpick = helper.vars.commandData.cmds;
            break;
        case 'osu':
            curpick = helper.vars.commandData.osucmds;
            break;
        case 'admin':
            curpick = helper.vars.commandData.admincmds;
            break;
        case 'misc':
            curpick = helper.vars.commandData.othercmds;
            break;
    }

    if (commandfound == true) {
        for (let i = 0; i < curpick.length && i < 25; i++) {
            push.push(
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(curpick[i]?.emoji ?? '📜')
                    .setLabel(curpick[i]?.label ?? `#${i + 1}`)
                    .setDescription(curpick[i]?.name ?? '_')
                    .setValue(curpick[i]?.val ?? curpick[i].name)
            );
            inputMenu.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(curpick[i]?.emoji ?? '📜')
                    .setLabel(curpick[i]?.label ?? `#${i + 1}`)
                    .setDescription(curpick[i]?.name ?? '_')
                    .setValue(curpick[i]?.val ?? curpick[i].name));

        }
        useComponents.push(
            new Discord.ActionRowBuilder()
                .setComponents(inputMenu));
    }


    await helper.tools.commands.sendMessage(
        {
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                embeds: useEmbeds,
                components: useComponents
            }
        }, input.canReply
    );
};

/**
 * bot info
 */
export const info: bottypes.command = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
        }
            break;
    }

    helper.tools.log.commandOptions(
        [],
        input.id,
        'info',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );


    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setLabel('Info')
                .setURL('https://sbrstrkkdwmdr.github.io/projects/ssob_docs/')
                .setStyle(Discord.ButtonStyle.Link)
        );

    const curGuildSettings = await helper.vars.guildSettings.findOne({ where: { guildid: input.message?.guildId } });
    const serverpfx = curGuildSettings.dataValues.prefix;

    const data = {
        deps: `Typescript: [${pkgjson.dependencies['typescript'].replace('^', '')}](https://www.typescriptlang.org/)
Discord.js: [${pkgjson.dependencies['discord.js'].replace('^', '')}](https://discord.js.org/#/docs)
rosu-pp: [${pkgjson.dependencies['rosu-pp-js'].replace('^', '')}](https://github.com/MaxOhn/rosu-pp-js)
Axios: [${pkgjson.dependencies['axios'].replace('^', '')}](https://github.com/axios/axios)
Sequelize: [${pkgjson.dependencies['sequelize'].replace('^', '')}](https://github.com/sequelize/sequelize/)
Chart.js: [${pkgjson.dependencies['chart.js'].replace('^', '')}](https://www.chartjs.org/)
sqlite3: [${pkgjson.dependencies['sqlite3'].replace('^', '')}](https://github.com/TryGhost/node-sqlite3)`,
        uptime: `${helper.tools.calculate.secondsToTime(helper.vars.client.uptime / 1000)}`,
        version: pkgjson.version,
        preGlobal: helper.vars.config.prefix.includes('`') ? `"${helper.vars.config.prefix}"` : `\`${helper.vars.config.prefix}\``,
        preServer: serverpfx.includes('`') ? `"${serverpfx}"` : `\`${serverpfx}\``,
        server: helper.vars.versions.serverURL,
        website: helper.vars.versions.website,
        creator: 'https://sbrstrkkdwmdr.github.io/',
        source: `https://github.com/sbrstrkkdwmdr/sbrbot/`,
        get tz() {
            const starttime = new Date((fs.readFileSync(`${helper.vars.path.main}/debug/starttime.txt`)).toString());

            const txt = starttime.toString().split('(')[1].split(')')[0];
            //get utc offset
            const found: tz.timezone[] = [];

            let frTemp: string[] = [];
            for (const tz of helper.vars.timezones.timezones) {
                frTemp = frTemp.concat(tz.aliases);
            }
            const frWords = helper.tools.other.searchMatch(txt, helper.tools.other.removeDupes(frTemp));
            //convert frWords to tzlist

            for (let i = 0; i < helper.vars.timezones.timezones.length && i < 25; i++) {
                for (const tz of helper.vars.timezones.timezones) {
                    if (tz.aliases.includes(frWords[i])) {
                        found.push(tz);
                    }
                }
            }

            const offset = found[0].offsetDirection == '+' ?
                found[0].offsetHours :
                -found[0].offsetHours;
            let isOffset = false;
            for (let i = 0; i < helper.vars.timezones.hasDaylight.length; i++) {
                const curTimeZone = helper.vars.timezones.hasDaylight[i];
                if (curTimeZone.includes.slice().map(x => x.trim().toUpperCase()).includes(txt.trim().toUpperCase()) && curTimeZone.check(input.date)) {
                    isOffset = true;
                }
            }
            if (txt.toLowerCase().includes('daylight')) isOffset = true;

            const offsetToMinutes = isOffset ? Math.floor(offset * 60) + 60 : Math.floor(offset * 60);
            const Hrs = offset > 0 ?
                Math.floor(isOffset ? offset + 1 : offset).toString().padStart(3, '+0') :
                Math.floor(isOffset ? offset + 1 : offset).toString().replace('-', '').padStart(3, '-0');
            const offsetReadable = `UTC${Hrs}:${(Math.abs(offsetToMinutes % 60)).toString().padStart(2, '0')}`;
            return `${txt} (${offsetReadable})`;
        },
        shards: helper.vars.client?.shard?.count ?? 1,
        guilds: helper.vars.client.guilds.cache.size,
        users: helper.vars.client.users.cache.size,

    };
    const Embed = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.info.dec)
        .setTitle('Bot Information');
    if (input.args.length > 0) {
        ['uptime', 'server', 'website', 'timezone', 'version', 'v', 'dependencies', 'deps', 'source'];
        switch (input.args[0]) {
            case 'uptime':
                Embed.setTitle('Total uptime')
                    .setDescription(data.uptime);
                break;
            case 'version': case 'v':
                Embed.setTitle('Bot version')
                    .setDescription(data.version);
                break;
            case 'server':
                Embed.setTitle('Bot server')
                    .setDescription(data.server);
                break;
            case 'website':
                Embed.setTitle('Bot website')
                    .setDescription(data.website);
                break;
            case 'timezone': case 'tz':
                Embed.setTitle('Bot timezone')
                    .setDescription(data.tz);
                break;
            case 'dependencies': case 'dep': case 'deps':
                Embed.setTitle('Dependencies')
                    .setDescription(data.deps);
                break;
            case 'source': case 'code':
                Embed.setTitle('Source Code')
                    .setDescription(data.source);
                break;
            default:
                Embed.setDescription(`\`${input.args[0]}\` is an invalid argument`);
                break;
        }
    } else {
        Embed
            .setFields([
                {
                    name: 'Dependencies',
                    value: data.deps,
                    inline: true
                },
                {
                    name: 'Statistics',
                    value:
                        `
Uptime: ${data.uptime}
Shards: ${data.shards}
Guilds: ${data.guilds}
Users: ${data.users}`,
                    inline: true
                }
            ])
            .setDescription(`
[Created by SaberStrike](${data.creator})
[Commands](${data.website})
Global prefix: ${data.preGlobal}
Server prefix: ${data.preServer}
Bot Version: ${data.version}
`);
    }




    await helper.tools.commands.sendMessage(
        {
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                embeds: [Embed],
                components: [buttons]
            }
        }, input.canReply
    );
};

export const invite: bottypes.command = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User;


    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
        }
            break;
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: helper.vars.versions.linkInvite
        }
    }, input.canReply);
};

/**
 * perform basic math operation
 */
export const math: bottypes.command = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let odcalc: osumodcalc.OverallDifficulty;
    let type;
    let num1;
    let num2;

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
            type = 'basic';
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Num1',
                value: num1
            },
            {
                name: 'Num2',
                value: num2
            },
            {
                name: 'Query',
                value: `${input?.args?.[0] ? input.args.join(' ') : null}`
            }
        ],
        input.id,
        'math',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    const eqHelp = `-
+ = add
- = subtract
/ = divide
* = multiply
^ = exponent/power
** = exponent/power
% = divide and return remainder
++ = +1
-- = -1
        `;

    let equation = 'null';

    if (type == 'basic') {
        const string = input.args.join(' ')
            .replaceAll('^', '**')
            .trim();
        let isErr = false;
        const evalstr: string = await helper.tools.calculate.stringMath(string)
            .catch(x => {
                isErr = true;
                return x;
            });//  + '';
        equation = `${evalstr}`; //+ isErr ? eqHelp : '';
    } else if (type == 'help') {
        equation = eqHelp;
    }
    else {
        switch (type) {
            case 'sqrt':
                equation = (`${Math.sqrt(num1)}`);
                break;
            case 'square':
                if (num2) {
                    equation = (`${num1 ** num2}`);
                }
                equation = (`${num1 * num1}`);
                break;
            case '!':
                equation = (`${helper.tools.calculate.factorial(num1)}`);
                break;
            case 'hcf':
                if (!num2) {
                    equation = ('Missing second number.');
                }
                equation = (`${helper.tools.calculate.findHCF(num1, num2)}`);
                break;
            case 'lcm':
                if (!num2) {
                    equation = ('Missing second number.');
                }
                equation = (`${helper.tools.calculate.findLCM(num1, num2)}`);
                break;
            case 'pythag':
                if (!num2) {
                    equation = 'Missing second number.';
                }
                equation = (`${helper.tools.calculate.pythag(num1, num2)}`);
                break;
            case 'sigfig': {
                if (!num2) {
                    num2 = null;
                }
                if (num2 < 2 && num2 != null) {
                    num2 = 3;
                }
                const sf = helper.tools.calculate.sigfig(num1, num2);
                equation = (`${sf.number}\nTo ${sf.sigfig} significant figures`);
            }
                break;
            case 'ardt':
                equation = (`AR${osumodcalc.DoubleTimeAR(num1).ar}, ${osumodcalc.DoubleTimeAR(num1).ms}ms`);
                break;
            case 'arht':
                equation = (`AR${osumodcalc.HalfTimeAR(num1).ar}, ${osumodcalc.HalfTimeAR(num1).ms}ms`);
                break;
            case 'oddt':
                odcalc = osumodcalc.odDT(num1) as osumodcalc.OverallDifficulty;
                equation = (`OD${odcalc.od_num}\n\`300:\t\t±${odcalc.hitwindow_300}\`\n\`100:\t\t±${odcalc.hitwindow_100}\`\n\`50:\t\t±${odcalc.hitwindow_50}\``);
                break;
            case 'odht':
                odcalc = osumodcalc.odHT(num1) as osumodcalc.OverallDifficulty;
                equation = (`OD${odcalc.od_num}\n\`300:\t\t±${odcalc.hitwindow_300}\`\n\`100:\t\t±${odcalc.hitwindow_100}\`\n\`50:\t\t±${odcalc.hitwindow_50}\``);
                break;
            case 'odms':
                odcalc = osumodcalc.ODtoms(num1) as osumodcalc.OverallDifficulty;
                equation = (`\`300:\t±${odcalc.hitwindow_300}\`\n\`100:\t\t±${odcalc.hitwindow_100}\`\n\`50:\t\t±${odcalc.hitwindow_50}\``);
                break;
            case 'arms':
                equation = (`${osumodcalc.ARtoms(num1)}ms`);
                break;
            case 'msar':
                equation = (`AR${osumodcalc.msToAR(num1)}`);
                break;
            case 'modintstring':
                equation = (`Mods: ${osumodcalc.ModIntToString(num1)}`);
                break;
            default:
                equation = ('Error - invalid type');
                break;
        }

    }


    await helper.tools.commands.sendMessage(
        {
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: equation
            }
        }, input.canReply
    );
};

/**
 * ping bot
 */
export const ping: bottypes.command = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [],
        input.id,
        'ping',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    const trueping = `${helper.tools.formatter.toCapital(input.type)} latency: ${Math.abs(input.message.createdAt.getTime() - new Date().getTime())}ms`;

    const pingEmbed = new Discord.EmbedBuilder()
        .setTitle('Pong!')
        .setColor(helper.vars.colours.embedColour.info.dec)
        .setDescription(`
Client latency: ${helper.vars.client.ws.ping}ms
${trueping}`);



    const preEdit = new Date();
    input.message.reply({
        embeds: [pingEmbed],
        allowedMentions: { repliedUser: false },
        failIfNotExists: true
    }).then((msg: Discord.Message | Discord.ChatInputCommandInteraction) => {
        const timeToEdit = new Date().getTime() - preEdit.getTime();
        pingEmbed.setDescription(`
Client latency: ${helper.vars.client.ws.ping}ms
${trueping}
${helper.tools.formatter.toCapital(input.type)} edit latency: ${Math.abs(timeToEdit)}ms
`);
        helper.tools.commands.sendMessage({
            type: input.type,
            message: msg as Discord.Message,
            interaction: msg as Discord.ChatInputCommandInteraction,
            args: {
                embeds: [pingEmbed],
                edit: true,
                editAsMsg: true,
            }
        }, input.canReply);
    })
        .catch();
};

/**
 * set reminder
 */
export const remind: bottypes.command = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User;

    let time;
    let remindertxt;
    let sendtochannel;
    let user: Discord.User;
    let list = false;

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
            time = input.args[0];
            remindertxt = input.args.join(' ').replaceAll(input.args[0], '');
            sendtochannel = false;
            user = input.message.author;

            if (!input.args[0] || input.args[0].includes('remind')) {
                list = true;
            }
            if (!input.args[1]) {
                remindertxt = 'null';
            }
            if (list == false && !input.args[0].endsWith('d') && !input.args[0].endsWith('h') && !input.args[0].endsWith('m') && !input.args[0].endsWith('s') && !time.includes(':') && !time.includes('.')) {
                return await helper.tools.commands.sendMessage({
                    type: input.type,
                    message: input.message,
                    interaction: input.interaction,
                    args: {
                        content: 'Incorrect time format: please use `?d?h?m?s` or `hh:mm:ss`'
                    }
                }, input.canReply);
            }
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'Time',
                value: time
            },
            {
                name: 'Reminder',
                value: remindertxt
            },
            {
                name: 'SendInChannel',
                value: sendtochannel
            },
            {
                name: 'User',
                value: user.id
            }
        ],
        input.id,
        'remind',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    async function sendremind(reminder: Discord.Embed | Discord.EmbedBuilder, time: string, sendchannel: boolean, remindertxt: string, usersent: Discord.User, absTime: number) {
        helper.vars.reminders.push({
            time: absTime,
            text: remindertxt,
            userID: `${usersent.id}`
        });
        try {
            if (sendchannel == true) {
                setTimeout(() => {
                    (input.message.channel as Discord.GuildTextBasedChannel).send({ content: `Reminder for <@${usersent.id}> \n${remindertxt}` });
                    remReminder(absTime);
                }, helper.tools.calculate.timeToMs(time));
            }
            else {
                setTimeout(() => {
                    usersent.send({ embeds: [reminder] });
                    remReminder(absTime);
                }, helper.tools.calculate.timeToMs(time));
            }
        } catch (error) {
            helper.tools.log.stdout('embed error' + 'time:' + time + '\ntxt:' + remindertxt);
        }
    }
    function remReminder(time: number) {
        const findOne = helper.vars.reminders.findIndex(x => x.time === time);
        return helper.vars.reminders.splice(findOne, 1);
    }


    const reminder = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.info.dec)
        .setTitle(list ? 'REMINDERS' : 'REMINDER')
        .setDescription(`${remindertxt}`);
    let remindingText = '';
    let useEmbeds = [];

    if (list) {
        remindingText = null;
        const useReminders = helper.vars.reminders.filter(x => `${x.userID}` === `${commanduser.id}`);
        reminder.setDescription(useReminders.length > 0 ?
            useReminders.map(x => `Reminder sending <t:${x.time}:R>: ${x.text}`).join('\n').slice(0, 2000)
            : 'You have no reminders'
        );
        useEmbeds = [reminder];
    } else {
        const absTime = Math.floor(((new Date().getTime()) + helper.tools.calculate.timeToMs(time)) / 1000);
        remindingText = `Sending reminder <t:${absTime}:R> (<t:${absTime}:f>)`;
        sendremind(reminder, time, sendtochannel, remindertxt, commanduser, absTime);
    }



    await helper.tools.commands.sendMessage(
        {
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: remindingText,
                embeds: useEmbeds,
                ephemeral: true,
            }
        }, input.canReply);
};

/**
 * bot stats
 */
export const stats: bottypes.command = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [],
        input.id,
        'stats',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    const trueping = input.message.createdAt.getTime() - new Date().getTime() + 'ms';

    const uptime = Math.round((new Date().getTime() - helper.vars.startTime.getTime()) / 1000);
    const uptimehours = Math.floor(uptime / 3600) >= 10 ? Math.floor(uptime / 3600) : '0' + Math.floor(uptime / 3600);
    const uptimeminutes = Math.floor((uptime % 3600) / 60) >= 10 ? Math.floor((uptime % 3600) / 60) : '0' + Math.floor((uptime % 3600) / 60);
    const uptimeseconds = Math.floor(uptime % 60) >= 10 ? Math.floor(uptime % 60) : '0' + Math.floor(uptime % 60);
    const upandtime = `Uptime: ${uptimehours}:${uptimeminutes}:${uptimeseconds}\nTimezone: ${moment(helper.vars.startTime).format('Z')}`;

    const totalusers: number = helper.vars.client.users.cache.size;
    // let totalusersnobots: Discord.Collection<any, Discord.User>;
    const totalguilds: number = helper.vars.client.guilds.cache.size;

    const Embed = new Discord.EmbedBuilder()
        .setTitle(`${helper.vars.client.user.username} stats`)
        .setDescription(
            `Client latency: ${Math.round(helper.vars.client.ws.ping)}ms
Message Latency: ${trueping}
${upandtime}
Guilds: ${totalguilds}
Users: ${totalusers}
Commands sent: ${helper.vars.id}
Prefix: \`${helper.vars.config.prefix}\`
Shards: ${helper.vars?.client?.shard?.count ?? 1}
Current Shard:
`
        );


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
 * get timezone
 */
export const time: bottypes.command = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;

    let fetchtimezone: string;
    let displayedTimezone: string;
    let showGMT = false;

    let useComponents = [];

    switch (input.type) {
        case 'message': {
            input.message = (input.message as Discord.Message);
            commanduser = input.message.author;
            const temp = helper.tools.commands.matchArgMultiple(['-utc', '-gmt'], input.args);
            showGMT = temp.found ? temp.output : false;
            input.args = temp.args;
            input.args = helper.tools.commands.cleanArgs(input.args);
            fetchtimezone = input.args.join(' ');
        }
            break;
        case 'button': {
            commanduser = input.interaction.member.user;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'Timezone',
                value: `${fetchtimezone}`
            }
        ],
        input.id,
        'time',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    displayedTimezone = fetchtimezone;
    if (input?.overrides) {
        if (input?.overrides?.ex) {
            fetchtimezone = input?.overrides?.ex as string;
            displayedTimezone = input?.overrides?.ex as string;
        }
        if (input?.overrides?.id) {
            displayedTimezone = (input?.overrides?.id ?? fetchtimezone) as string;
        }
        if (input?.overrides?.commandAs) {
            input.type = input?.overrides?.commandAs;
        }
        if (input?.overrides?.commanduser) {
            commanduser = input?.overrides?.commanduser;
        }
    }

    const curTime = moment();

    const fields: Discord.EmbedField[] = [
        {
            /**
             *  value: `\n**Date**: ${reqTime.format("DD/MM/YYYY")}` +
                    `\n**Full Date**: ${reqTime.format("d, DDD MMM YYYY hh:mm:ssA Z")}` +
                    `\n**Full Date(24h)**: ${reqTime.format("d, DDD MMM YYYY HH:mm:ss Z")}` +
                    `\n**Full Date ISO8601**: ${reqTime.format("YYYY-MM-DDTHH:mm:ss.SSS")}`,

             */
            name: 'UTC/GMT+00:00',
            value:
                `\n\`Date              | \`${curTime.format("DD/MM/YYYY")}` +
                `\n\`Full Date         | \`${curTime.format("ddd, DD MMM YYYY hh:mm:ssA Z")}` +
                `\n\`Full Date(24h)    | \`${curTime.format("ddd, DD MMM YYYY HH:mm:ss Z")}` +
                `\n\`Full Date ISO8601 | \`${curTime.toISOString(true)}` +
                `\n\`EPOCH(ms)         | \`${curTime.valueOf()}` +
                `\n\`Local             | \`<t:${curTime.valueOf() / 1000}:F>`
            ,
            inline: false
        },
    ];


    const Embed = new Discord.EmbedBuilder()
        .setColor(helper.vars.colours.embedColour.info.dec)
        .setTitle('Current Time');

    if (fetchtimezone == null || fetchtimezone == '') {
        const cuser = await helper.tools.data.searchUserFull(commanduser.id, helper.vars.userdata);
        fetchtimezone = cuser.tz;
        displayedTimezone = cuser.tz;
    }

    const daylightMatch = ['dst', 'daylight', 'daylight savings', 'daylight savings time'];
    if (daylightMatch.some(x => x.toLowerCase().trim() == fetchtimezone.trim().toLowerCase())) {
        Embed.setTitle('List of countries that observe daylight savings and when they do');
        const tempFields: Discord.EmbedField[] = [];
        for (const rule of helper.vars.timezones.dstForList) {
            const tempRegions: string[] = [];
            for (let region of rule.includes) {
                let txt = '';

                if ((region as tz.dstCountry)?.name) {
                    region = region as tz.dstCountry;
                    const tempT = region.territories.join(', ');
                    txt = `${region.name} -- \`${tempT}\``;
                } else {
                    txt = region as string;
                }
                tempRegions.push(txt);
            }
            tempFields.push({
                name: `Starts on the ${rule.start} | Ends on the ${rule.end}`,
                value: `${tempRegions.join('\n')}`,
                inline: false,
            });
        }
        Embed.setFields(tempFields);
    } else if (fetchtimezone != null && fetchtimezone != '') {
        try {
            const found: tz.timezone[] = [];

            let frTemp: string[] = [];
            for (const tz of helper.vars.timezones.timezones) {
                frTemp = frTemp.concat(tz.aliases);
            }
            const frWords = helper.tools.other.searchMatch(fetchtimezone, helper.tools.other.removeDupes(frTemp));
            //convert frWords to tzlist

            for (let i = 0; i < helper.vars.timezones.timezones.length && i < 25; i++) {
                for (const tz of helper.vars.timezones.timezones) {
                    if (tz.aliases.includes(frWords[i])) {
                        found.push(tz);
                    }
                }
            }

            // for (let i = 0; i < helper.vars.timezones.timezones.length; i++) {
            //     const curTimeZone = helper.vars.timezones.timezones[i];
            //     if (curTimeZone.aliases.slice().map(x => x.trim().toUpperCase()).includes(fetchtimezone.trim().toUpperCase())) {
            //         found.push(curTimeZone);
            //     }
            // }

            if (found.length == 0) {
                throw new Error("Unrecognised timezone");
            }

            const offset = found[0].offsetDirection == '+' ?
                found[0].offsetHours :
                -found[0].offsetHours;

            if (input?.overrides?.overwriteModal) {
                useComponents = [
                    new Discord.ActionRowBuilder()
                        .addComponents(input?.overrides?.overwriteModal as Discord.StringSelectMenuBuilder)
                ];
            } else if (found.length > 1) {
                const buttons = new Discord.ActionRowBuilder();
                if (input?.overrides?.overwriteModal) {
                    buttons
                        .addComponents(input?.overrides?.overwriteModal as Discord.StringSelectMenuBuilder);
                } else {
                    const inputModal = new Discord.StringSelectMenuBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-Select-time-${commanduser.id}-${input.id}-${displayedTimezone}`)
                        .setPlaceholder('Select a timezone');
                    const usedVals = [];
                    let t = 25;
                    for (let i = 0; i < found.length && i < t; i++) {
                        const al = helper.tools.other.searchMatch(fetchtimezone, helper.tools.other.removeDupes(found[i].aliases));
                        const utcTemp = helper.tools.other.searchMatch('UTC+-:', helper.tools.other.removeDupes(found[i].aliases));
                        if (!usedVals.includes(utcTemp[0])) {
                            inputModal.addOptions(
                                new Discord.StringSelectMenuOptionBuilder()
                                    .setLabel(`#${i + 1} ${al[0]}`)
                                    .setDescription(`${utcTemp[0]}`)
                                    .setValue(`${utcTemp[0]}_${al[0]}`)
                            );
                        } else {
                            t++;
                        }
                        usedVals.push(utcTemp[0]);
                    }
                    buttons.addComponents(inputModal);
                }
                useComponents = [buttons];
            }
            let isOffset = false;
            for (let i = 0; i < helper.vars.timezones.hasDaylight.length; i++) {
                const curTimeZone = helper.vars.timezones.hasDaylight[i];
                if (curTimeZone.includes.slice().map(x => x.trim().toUpperCase()).includes(fetchtimezone.trim().toUpperCase()) && curTimeZone.check(input.date)) {
                    isOffset = true;
                }
            }
            if (fetchtimezone.toLowerCase().includes('daylight')) isOffset = true;

            const offsetToMinutes = isOffset ? Math.floor(offset * 60) + 60 : Math.floor(offset * 60);

            const reqTime = moment().utcOffset(offsetToMinutes);

            const Hrs = offset > 0 ?
                Math.floor(isOffset ? offset + 1 : offset).toString().padStart(3, '+0') :
                Math.floor(isOffset ? offset + 1 : offset).toString().replace('-', '').padStart(3, '-0');

            const offsetReadable = `UTC${Hrs}:${(Math.abs(offsetToMinutes % 60)).toString().padStart(2, '0')}`;
            fields.push({
                name: `${helper.tools.other.searchMatch(displayedTimezone, helper.tools.other.removeDupes(frTemp))[0]}/${offsetReadable} ${isOffset ? '(DST)' : ''}`,
                value:
                    `\n\`Date              | \`${reqTime.format("DD/MM/YYYY")}` +
                    `\n\`Full Date         | \`${reqTime.format("ddd, DD MMM YYYY hh:mm:ssA Z")}` +
                    `\n\`Full Date(24h)    | \`${reqTime.format("ddd, DD MMM YYYY HH:mm:ss Z")}` +
                    `\n\`Full Date ISO8601 | \`${reqTime.toISOString(true)}` +
                    `\n\`EPOCH(ms)         | \`${curTime.valueOf()}`,
                inline: false
            });
        } catch (error) {
            showGMT = true;
            fields.push({
                name: `UTC/GMT +??:?? (Requested Time)`,
                value: `\nRecived invalid timezone!` +
                    `\n\`${fetchtimezone}\` is not a valid timezone` +
                    `\n Check [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#UTC_offset) for valid timezones`,
                inline: false
            });
            const allTimezones: string[] = [];
            for (let i = 0; i < helper.vars.timezones.timezones.length; i++) {
                const curTimeZone = helper.vars.timezones.timezones[i];
                for (let j = 0; j < curTimeZone.aliases.length; j++) {
                    if (!allTimezones.includes(curTimeZone.aliases[j])) {
                        allTimezones.push(curTimeZone.aliases[j]);
                    }
                }
            }

            const filteredtz = helper.tools.other.filterSearchArray(allTimezones, fetchtimezone);
            if (filteredtz.length == 0) {
                useComponents = [];
            } else {
                const inputModal = new Discord.StringSelectMenuBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Select-time-${commanduser.id}-${input.id}-${displayedTimezone}`)
                    .setPlaceholder('Select a timezone');
                for (let i = 0; i < filteredtz.length && i < 25; i++) {
                    inputModal.addOptions(
                        new Discord.StringSelectMenuOptionBuilder()
                            .setLabel(`#${i + 1}`)
                            .setDescription(`${filteredtz[i]}`)
                            .setValue(`${filteredtz[i]}`)
                    );
                }
                const buttons = new Discord.ActionRowBuilder();
                buttons.addComponents(inputModal);
                useComponents = [buttons];
            }

        }
    } else {
        showGMT = true;
    }

    if (!showGMT) {
        fields.splice(0, 1);
    }

    Embed.addFields(fields);


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [Embed],
            components: useComponents,
            edit: input?.overrides?.ex ? true : false
        }
    }, input.canReply);
};

export const weather: bottypes.command = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let name = '';
    let overrideID: number = null;
    let useComponents: Discord.ActionRowBuilder<any>[] = [];
    const useEmbeds = [];
    const useFiles = [];

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            name = input.args.join(' ');
        }
            break;
        case 'button': {
            commanduser = input.interaction.member.user;
            useComponents = input.message.components as any[];
            const tempEmb = input.message.embeds[0];
            name = tempEmb.footer.text.split('input: ')[1];
        }
            break;
    }
    if (input.overrides) {
        if (input?.overrides?.ex != null) {
            overrideID = +input?.overrides?.ex;
        }
        if (input?.overrides?.id != null) {
            name = input?.overrides?.id as string;
        }
        if (input?.overrides?.commandAs) {
            input.type = input?.overrides?.commandAs;
        }
        if (input?.overrides?.commanduser) {
            commanduser = input?.overrides?.commanduser;
        }
    }
    helper.tools.log.commandOptions(
        [
            {
                name: 'Location',
                value: name
            },
            {
                name: 'OverrideID',
                value: overrideID
            }
        ],
        input.id,
        'weather',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    let locatingData: weathertypes.geoResults;
    if ((!name || name == null || name.length == 0) && input.type != 'button') {
        const cuser = await helper.tools.data.searchUserFull(commanduser.id, helper.vars.userdata);
        name = cuser.location;
    }
    if ((!name || name == null || name.length == 0) && input.type != 'button') {
        const err = helper.vars.errors.uErr.weather.input_ms;
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: err,
                edit: true
            }
        }, input.canReply);
        return;
    }

    if (helper.tools.data.findFile(name, 'weatherlocationdata') &&
        !('error' in helper.tools.data.findFile(name, 'weatherlocationdata')) &&
        input.buttonType != 'Refresh'
    ) {
        locatingData = helper.tools.data.findFile(name, 'weatherlocationdata');
    } else {
        locatingData = await helper.tools.api.getLocation(name);
    }

    helper.tools.data.storeFile(locatingData, name, 'weatherlocationdata');
    helper.tools.other.debug(locatingData as object, 'command', 'weather', input.message?.guildId, 'locatingdata');

    const weatherEmbed = new Discord.EmbedBuilder()
        .setURL(`https://open-meteo.com/en/docs`)
        .setTitle('Weather');

    if (locatingData.hasOwnProperty('results')) {
        if (locatingData?.results?.length < 0) {
            weatherEmbed
                .setDescription(helper.vars.errors.uErr.weather.locateNF);
        } else if (locatingData?.results?.length == 1) {
            await toWeather(locatingData.results[0]);
        } else if (overrideID) {
            const location = locatingData.results.find(x => x.id == overrideID);
            await toWeather(location);
        } else {
            await toWeather(locatingData.results[0]);
            await toSelector(locatingData);

        }
    } else {
        weatherEmbed
            .setDescription(helper.vars.errors.uErr.weather.api + " (Location)");
        useEmbeds.push(weatherEmbed);
    }

    async function toWeather(location: weathertypes.geoLocale) {
        let weatherData: weathertypes.weatherData | string;
        if (helper.tools.data.findFile(location.id, `weatherdata`) &&
            !('error' in helper.tools.data.findFile(location.id, `weatherdata`)) &&
            input.buttonType != 'Refresh'
        ) {
            weatherData = helper.tools.data.findFile(location.id, `weatherdata`);
        } else {
            weatherData = await helper.tools.api.getWeather(location.latitude, location.longitude, location);
        }
        helper.tools.data.storeFile(weatherData, location.id, `weatherdata`);
        helper.tools.other.debug(weatherData as object, 'command', 'weather', input.message?.guildId, 'weatherdata');
        if (typeof weatherData == 'string') {
            if (weatherData.includes("timeout")) {
                weatherEmbed.setDescription(helper.vars.errors.timeout);
                useEmbeds.push(weatherEmbed);
            } else {
                weatherEmbed.setDescription(helper.vars.errors.uErr.weather.wrongCoords);
                useEmbeds.push(weatherEmbed);
            }
            return;
        } else if (weatherData.hasOwnProperty('reason') || weatherData.hasOwnProperty('error')) {
            weatherEmbed.setDescription(helper.vars.errors.uErr.weather.api);
            if (weatherData?.reason == "timeout") {
                weatherEmbed.setDescription(helper.vars.errors.timeout);
                useEmbeds.push(weatherEmbed);
            }
            useEmbeds.push(weatherEmbed);
            return;
        } else {
            const utctime = moment().utc()
                .format("ddd, DD MMM YYYY HH:mm:ss");
            const timezoneOffset = luxon.DateTime.now().setZone(location.timezone).offset;
            const localTime = moment().utcOffset(timezoneOffset)
                .format("ddd, DD MMM YYYY HH:mm:ss Z");
            const weatherUnits = weatherData.daily_units;
            const dailyData = weatherData.daily;
            const curData = weatherData.current_weather;

            const weatherAtmfr = helper.tools.api.weatherCodeToString(curData.weathercode);
            const predictedWeatherFr = helper.tools.api.weatherCodeToString(dailyData.weathercode[2]);
            const usePredictWeather = predictedWeatherFr.string != weatherAtmfr.string ? true : false;

            const windDir = helper.tools.api.windToDirection(curData.winddirection);
            const maxWindDir = helper.tools.api.windToDirection(dailyData.winddirection_10m_dominant[2]);

            // - => S or W
            let latSide: 'N' | 'S' = 'N';
            let lonSide: 'E' | 'W' = 'E';

            if (location.latitude < 0) {
                latSide = 'S';
            }
            if (location.longitude < 0) {
                lonSide = 'W';
            }

            const weatherTime = helper.tools.other.timeForGraph(weatherData.hourly.time);

            const windGraph = await helper.tools.other.graph(weatherTime, weatherData.hourly.windspeed_10m, `Wind speed (${weatherData.hourly_units.windspeed_10m})`,
                {
                    startzero: true,
                    fill: false,
                    displayLegend: true,
                    pointSize: 1.5,
                },
                [{
                    data: weatherData.hourly.windgusts_10m,
                    label: `Wind gusts (${weatherData.hourly_units.windgusts_10m})`,
                    separateAxis: false,
                }]
            );
            const tempGraph = await helper.tools.other.graph(weatherTime, weatherData.hourly.temperature_2m, `Temperature (${weatherData.hourly_units.temperature_2m})`,
                {
                    startzero: true,
                    fill: true,
                    displayLegend: true,
                    pointSize: 1.5,
                    gradient: true,
                });
            const frDat = [];
            if (weatherData?.hourly?.rain.reduce((a, b) => a + b, 0) > 0) {
                frDat.push({
                    data: weatherData.hourly.rain,
                    label: `(${weatherData.hourly_units.rain}) Rainfall`,
                    separateAxis: true,
                    customStack: 1
                });
            }
            if (weatherData?.hourly?.showers.reduce((a, b) => a + b, 0) > 0) {
                frDat.push({
                    data: weatherData.hourly.showers,
                    label: `(${weatherData.hourly_units.showers}) Showers`,
                    separateAxis: true,
                    customStack: 1
                });
            }
            if (weatherData?.hourly?.snowfall.reduce((a, b) => a + b, 0) > 0) {
                frDat.push({
                    data: weatherData.hourly.snowfall,
                    label: `(${weatherData.hourly_units.snowfall}) Snowfall`,
                    separateAxis: true,
                    customStack: 2
                });
            }
            const precGraph = await helper.tools.other.graph(weatherTime, weatherData.hourly.precipitation_probability, `(${weatherData.hourly_units.precipitation_probability}) Chance of Precipitation`,
                {
                    startzero: true,
                    fill: true,
                    displayLegend: true,
                    pointSize: 1.5,
                    type: 'bar',
                    stacked: true
                },
                frDat
            );

            useFiles.push(
                new Discord.AttachmentBuilder(`${windGraph.path}`),
                new Discord.AttachmentBuilder(`${tempGraph.path}`),
                new Discord.AttachmentBuilder(`${precGraph.path}`),
            );

            const graphEmbedWind = new Discord.EmbedBuilder()
                .setURL(`https://open-meteo.com/en/docs`)
                .setImage(`attachment://${windGraph.filename}.jpg`);
            const graphEmbedTemp = new Discord.EmbedBuilder()
                .setURL(`https://open-meteo.com/en/docs`)
                .setImage(`attachment://${tempGraph.filename}.jpg`);
            const graphEmbedPrec = new Discord.EmbedBuilder()
                .setURL(`https://open-meteo.com/en/docs`)
                .setImage(`attachment://${precGraph.filename}.jpg`);
            // const graphEmbedPrCh = new Discord.EmbedBuilder()
            //     .setURL(`https://open-meteo.com/en/docs`)
            //     .setImage(`attachment://${prChGraph.filename}.jpg`);

            //get hours 
            const useHrs = weatherData.hourly.precipitation.slice(48, 71);
            const hrArr = [];
            let i = 0;
            for (const hour of useHrs) {
                if (hour > 0) {
                    hrArr.push(`${i}`.length == 1 ? `0${i}:00` : `${i}:00`);
                }
                i++;
            }
            const hrTxt = helper.tools.other.formatHours(hrArr);
            let precip = '';
            precip += dailyData.rain_sum[2] > 0 ? `Rain: ${dailyData.rain_sum[2]}${weatherUnits.rain_sum}`
                + `(${helper.tools.calculate.convert(weatherUnits.rain_sum, 'inch', dailyData.rain_sum[2]).significantFigures} in)\n`
                : '';
            precip += dailyData.showers_sum[2] > 0 ? `Showers: ${dailyData.showers_sum[2]}${weatherUnits.showers_sum}`
                + `(${helper.tools.calculate.convert(weatherUnits.showers_sum, 'inch', dailyData.showers_sum[2]).significantFigures} in)\n`
                : '';
            precip += dailyData.snowfall_sum[2] > 0 ? `Snowfall: ${dailyData.snowfall_sum[2]}${weatherUnits.snowfall_sum}`
                + `(${helper.tools.calculate.convert(weatherUnits.snowfall_sum, 'ft', dailyData.snowfall_sum[2]).significantFigures} ft)\n`
                : '';
            precip += dailyData.precipitation_sum[2] > 0 ? `Total: ${dailyData.precipitation_sum[2]}${weatherUnits.precipitation_sum}`
                + `(${helper.tools.calculate.convert(weatherUnits.precipitation_sum, 'inch', dailyData.precipitation_sum[2]).significantFigures} in)\n`
                : '';
            precip += dailyData.precipitation_hours[2] > 0 ? `Hours: ${hrTxt}` : '';

            const windtxt =
                `Current: ${curData.windspeed}${weatherUnits.windspeed_10m_max} (${helper.tools.calculate.convert(weatherUnits.windspeed_10m_max, 'mph', curData.windspeed).significantFigures} mph) ${windDir.short}${windDir.emoji} ${curData.winddirection}°
Max speed: ${dailyData.windspeed_10m_max[2]}${weatherUnits.windspeed_10m_max} (${helper.tools.calculate.convert(weatherUnits.windspeed_10m_max, 'mph', dailyData.windspeed_10m_max[2]).significantFigures} mph)
Max Gusts: ${dailyData.windgusts_10m_max[2]}${weatherUnits.windgusts_10m_max} (${helper.tools.calculate.convert(weatherUnits.windgusts_10m_max, 'mph', dailyData.windgusts_10m_max[2]).significantFigures} mph)`;
            const temptxt = `
Current: ${curData.temperature}${weatherUnits.temperature_2m_max} (${helper.tools.calculate.convert(weatherUnits.temperature_2m_max, `fahrenheit`, curData.temperature).significantFigures}℉)
Min: ${dailyData.temperature_2m_min[2]}${weatherUnits.temperature_2m_max} (${helper.tools.calculate.convert(weatherUnits.temperature_2m_max, `fahrenheit`, dailyData.temperature_2m_min[2]).significantFigures}℉)
Max: ${dailyData.temperature_2m_max[2]}${weatherUnits.temperature_2m_max} (${helper.tools.calculate.convert(weatherUnits.temperature_2m_max, `fahrenheit`, dailyData.temperature_2m_max[2]).significantFigures}℉)
`;
            weatherEmbed
                .setFooter({ text: `input: ${name}` })
                .setTitle(`Weather for ${location.name}`);
            const fields: Discord.EmbedField[] = [
                {
                    name: `Information`,
                    value: `
${location.admin1 ? location.admin1 + ',' : ''} ${location.country} :flag_${location.country_code.toLowerCase()}:
Location: (${Math.abs(location.latitude) + latSide}, ${Math.abs(location.longitude) + lonSide})
Time (local): ${localTime} 
Time (UTC): ${utctime}
${weatherData.current_weather.is_day == 0 ? '🌒Nighttime' : '☀Daytime'}
Status: ${weatherAtmfr.icon} ${weatherAtmfr.string} ${usePredictWeather ?
                            '(' + predictedWeatherFr.icon + ' ' + predictedWeatherFr.string + ' predicted)'
                            : ''}
Sunrise: ${dailyData.sunrise[2]}
Sunset: ${dailyData.sunset[2]}
`,
                    inline: false
                },
                {
                    name: `Temperature`,
                    value: temptxt,
                    inline: true
                },
                {
                    name: `Precipitation`,
                    value: `
Probability: (${dailyData.precipitation_probability_min[2]}% - ${dailyData.precipitation_probability_max[2]}%)
${precip}`,
                    inline: true
                },
                {
                    name: `Wind`,
                    value: `${windtxt}
Dominant Direction: ${maxWindDir.short}${maxWindDir.emoji} (${dailyData.winddirection_10m_dominant[2]}°)
`,
                    inline: true
                },
            ];

            weatherEmbed.setFields(fields);
            useEmbeds.push(weatherEmbed, graphEmbedWind, graphEmbedTemp, graphEmbedPrec);
        }
    }

    async function toSelector(data: weathertypes.geoResults) {
        // weatherEmbed.setDescription('Multiple locations were found\nPlease select one from the list below');
        const inputModal = new Discord.StringSelectMenuBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-Select-weather-${commanduser.id}-${input.id}`)
            .setPlaceholder('Select a location');
        for (let i = 0; i < data.results.length && i < 25; i++) {
            const current = data.results[i];
            inputModal.addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(`#${i + 1} | ${current.name}`)
                    .setDescription(`${current.country} ${current?.admin1} (${current?.latitude?.toFixed(2)} ${current?.longitude?.toFixed(2)})`)
                    .setValue(`${current.id}`)
            );
        }
        const buttons = new Discord.ActionRowBuilder();
        buttons.addComponents(inputModal);
        useComponents = [buttons];
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: useEmbeds,
            components: useComponents,
            files: useFiles,
            edit: true
        }
    }, input.canReply);
};