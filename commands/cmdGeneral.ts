import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as jimp from 'jimp';
import * as luxon from 'luxon';
import moment from 'moment';
import pkgjson from '../package.json' assert { type: 'json' };
import { path, precomppath } from '../path.js';
import * as calc from '../src/calc.js';
import * as cmdchecks from '../src/checks.js';
import * as colourfunc from '../src/colourcalc.js';
import * as flags from '../src/consts/argflags.js';
import * as buttonsthing from '../src/consts/buttons.js';
import * as colours from '../src/consts/colours.js';
import * as conversions from '../src/consts/conversions.js';
import * as emojis from '../src/consts/emojis.js';
import * as errors from '../src/consts/errors.js';
import * as helpinfo from '../src/consts/helpinfo.js';
import * as mainconst from '../src/consts/main.js';
import * as timezoneList from '../src/consts/timezones.js';
import * as func from '../src/func.js';
import * as log from '../src/log.js';
import * as osufunc from '../src/osufunc.js';
import * as osumodcalc from '../src/osumodcalc.js';
import * as extypes from '../src/types/extratypes.js';
import * as othertypes from '../src/types/othertypes.js';
import * as msgfunc from './msgfunc.js';

/**
 * 
 */
export async function changelog(input: extypes.commandInput) {
    let commanduser;
    let version: string = null;
    let useNum: number = null;
    let isList = false;
    let page: number = null;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            const pageArgFinder = msgfunc.matchArgMultiple(flags.pages, input.args, true);
            if (pageArgFinder.found) {
                page = pageArgFinder.output;
                input.args = pageArgFinder.args;
            }
            version = input.args[0] ?? null;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            version = input.obj.options.getString('version');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
            const curpage = parseInt(
                input.obj.message.embeds[0].footer.text.split('/')[0]
            ) - 1;
            switch (input.button) {
                case 'BigLeftArrow':
                    useNum = 0;
                    break;
                case 'LeftArrow':
                    useNum = curpage - 1;
                    break;
                case 'RightArrow':
                    useNum = curpage + 1;
                    break;
                case 'BigRightArrow':
                    useNum = parseInt(
                        input.obj.message.embeds[0].footer.text.split('/')[1]
                    ) - 1;
                    break;
                default:
                    useNum = curpage;
                    break;
            }
            if (input.obj.message.embeds[0].title.toLowerCase().includes('all versions')) {
                version = 'versions';
                isList = true;
            }

            switch (input.button) {
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

    if (input.overrides != null) {
        if (input.overrides.page != null) {
            page = input.overrides.page;
            useNum = input.overrides.page - 1;
        }
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'changelog',
        options: [
            {
                name: 'Version',
                value: version
            },
            {
                name: 'useNum',
                value: useNum
            },
            {
                name: 'page',
                value: page
            },
            {
                name: 'listMode',
                value: isList
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('changelog', commanduser, input.absoluteID);
    const buttons = new Discord.ActionRowBuilder();
    //get version
    let found: string | number = null;
    let foundBool = false;
    if (version) {
        //search for version
        if (version?.includes('.')) {
            found = mainconst.versions.findIndex(x =>
                version.trim() === `${x.name}`.trim() || version.includes(`${x.releaseDate}`) || version.includes(`${x.releaseDateFormatted}`)
                || (`${x.releaseDate}`).includes(version) || `${x.releaseDateFormatted}`.includes(version)
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
                    found = mainconst.versions.length - 1;
                    useNum = mainconst.versions.length - 1;
                    foundBool = true;
                    break;
                case 'second':
                    found = mainconst.versions.length - 2;
                    useNum = mainconst.versions.length - 2;
                    foundBool = true;
                    break;
                case 'third':
                    found = mainconst.versions.length - 3;
                    useNum = mainconst.versions.length - 3;
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
    if (((!foundBool && found != 'string') || (page && found == 'string')) && !input.button) {
        useNum = page ? page - 1 : null;
    }
    if (useNum < 1 && !foundBool) {
        useNum = found && !isNaN(+found) ?
            +found :
            typeof found === 'string' ?
                0 : 1;
    }
    const Embed = new Discord.EmbedBuilder();
    const exceeded = 'Exceeded character limit. Please click [here](https://github.com/sbrstrkkdwmdr/sbrbot/blob/main/changelog/changelog.md) to view the changelog.';
    if (typeof found == 'string') {
        isList = true;
        // let txt = '' mainconst.versions.map(x => `\`${(x.name).padEnd(10)} (${x.releaseDateFormatted})\``).join('\n');
        const doc = fs.readFileSync(`${path}/cache/changelog.md`, 'utf-8');
        let txt = '\`VERSION      |    DATE    | CHANGES\`\n';
        const list = doc.split('## [');
        list.shift();
        if (useNum + 1 >= Math.ceil(mainconst.versions.length / 10)) {
            useNum = Math.ceil(mainconst.versions.length / 10) - 1;
        }
        let pageOffset = useNum * 10;
        for (let i = 0; pageOffset + i < mainconst.versions.length && i < 10; i++) {
            const sumVer = mainconst.versions[pageOffset + i];
            const useVer = list[pageOffset + i];
            const changes = useVer?.split('</br>')[1]?.split('\n')
                .map(x => x.trim()).filter(x => x.length > 2 && !x.includes('### ')) ?? [];
            txt += `\`${(sumVer.name).padEnd(12)} | ${sumVer.releaseDateFormatted} | ${changes.length}\`\n`;
        }
        if (txt.length > 2000) {
            txt = exceeded;
        }
        Embed.setTitle('All Versions')
            .setDescription(txt)
            .setFooter({
                text: `${useNum + 1}/${Math.ceil(mainconst.versions.length / 10)}`
            });
        foundBool ? null : Embed.setAuthor({ name: `\nThere was an error trying to find version \`${version}\`` });
    } else {
        const document = /* useGit ? */
            fs.readFileSync(`${path}/cache/changelog.md`, 'utf-8');
        /*             :
                    fs.readFileSync(`${precomppath}/changelog/changelog.txt`, 'utf-8'); */
        const list = document.split('## [');
        list.shift();
        if (useNum >= list.length) {
            useNum = list.length - 1;
        }
        const cur = list[useNum] as string;
        const verdata = mainconst.versions[useNum];
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
                        txt += colourfunc.codeBlockColourText(temp.toUpperCase(), "yellow", "text");
                        break;
                    case 'Changed':
                        txt += colourfunc.codeBlockColourText(temp.toUpperCase(), "blue", "text");
                        break;
                    case 'Added':
                        txt += colourfunc.codeBlockColourText(temp.toUpperCase(), "green", "text");
                        break;
                    case 'Removed':
                        txt += colourfunc.codeBlockColourText(temp.toUpperCase(), "red", "text");
                        break;
                    case 'Deprecated':
                        txt += colourfunc.codeBlockColourText(temp.toUpperCase(), "pink", "text");
                        break;
                    default:
                        txt += colourfunc.codeBlockColourText(temp.toUpperCase(), "cyan", "text");
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
Released ${verdata.releaseDateFormatted}
Total of ${changesList.filter(x => !x.includes('### ')).length} changes.${txt}
`)
            .setFooter({
                text: `${useNum + 1}/${mainconst.versions.length}`
            })
            ;
    }

    if (isList) {
        buttons
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-Detail0-changelog-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.detailLess),
            );
    } else {
        buttons
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${mainconst.version}-Detail1-changelog-${commanduser.id}-${input.absoluteID}`)
                    .setStyle(buttonsthing.type.current)
                    .setEmoji(buttonsthing.label.main.detailMore),
            );
    }

    if (useNum == 0) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if ((useNum + 1 >= mainconst.versions.length && !isList) || (useNum + 1 >= Math.ceil(mainconst.versions.length / 10) && isList)) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embed],
            components: [pgbuttons, buttons]
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'changelog',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'changelog',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}

/**
 * convert a value
 */
export async function convert(input: extypes.commandInput) {

    let commanduser;
    let cat1: string = '';
    let cat2: string = '';
    let num: string | number = 1;
    let numAsStr: string = num.toString();
    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
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
                const temp = func.parseArg(input.args, '-i', 'string', cat1, null, true);
                cat1 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-in')) {
                const temp = func.parseArg(input.args, '-in', 'string', cat1, null, true);
                cat1 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-input')) {
                const temp = func.parseArg(input.args, '-input', 'string', cat1, null, true);
                cat1 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-o')) {
                const temp = func.parseArg(input.args, '-o', 'string', cat2, null, true);
                cat2 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-out')) {
                const temp = func.parseArg(input.args, '-out', 'string', cat2, null, true);
                cat2 = temp.value;
                input.args = temp.newArgs;
            }
            if (input.args.includes('-output')) {
                const temp = func.parseArg(input.args, '-output', 'string', cat2, null, true);
                cat2 = temp.value;
                input.args = temp.newArgs;
            }
            input.args = msgfunc.cleanArgs(input.args);
            for (const arg of input.args) {
                if (!isNaN(+arg)) {
                    num = input.args[2] ?? input.args[0];
                    numAsStr = `${num}`;
                    break;
                }
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            cat1 = input.obj.options.getString('from') ?? '';
            cat2 = input.obj.options.getString('to') ?? '';
            num = input.obj.options.getNumber('number');
            numAsStr = `${num}`;
        }

            //==============================================================================================================================================================================================

            break;
    }

    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'convert',
        options: [
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
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    const embedres = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec);
    // .setDescription('⠀');

    let useEmbeds = [];

    let converting = true;

    const reqHelp: string[] = ['help', 'units'];
    const reqSlc: string[] = ['slc'];
    const reqprefix: string[] = ['si', 'metricprefixes', 'prefix'];

    function toName(x: conversions.convVal | conversions.convValCalc) {
        return x.names[1] ? `${x.names[0]} (${x.names[1]})` : x.names[0];
    }

    if ((reqHelp.includes(cat1.toLowerCase()) || cat2 == '')
        && !reqSlc.includes(cat1.toLowerCase())
        && !reqprefix.includes(cat1.toLowerCase())
    ) {
        useEmbeds = [new Discord.EmbedBuilder()
            .setColor(colours.embedColour.info.dec)
            .setTitle('List of measurements')
            .addFields(
                {
                    name: 'Temperature',
                    value: conversions.values.filter(x => x.type == 'Temperature')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Distance',
                    value: conversions.values.filter(x => x.type == 'Distance')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Time',
                    value: conversions.values.filter(x => x.type == 'Time')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Volume',
                    value: conversions.values.filter(x => x.type == 'Volume')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Mass',
                    value: conversions.values.filter(x => x.type == 'Mass')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Pressure',
                    value: conversions.values.filter(x => x.type == 'Pressure')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Energy',
                    value: conversions.values.filter(x => x.type == 'Energy')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Power',
                    value: conversions.values.filter(x => x.type == 'Power')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Area',
                    value: conversions.values.filter(x => x.type == 'Area')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Angle',
                    value: conversions.values.filter(x => x.type == 'Angle')
                        .map(x => toName(x)).join(', '),
                    inline: true
                },
                {
                    name: 'Speed',
                    value: conversions.values.filter(x => x.type == 'Speed')
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
            .setColor(colours.embedColour.info.dec)
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
            .setColor(colours.embedColour.info.dec)
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
        const data = calc.convert(cat1, cat2, +num);
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
            const c1 = calc.numBaseToInt(calc.numConvertTyping(cat1));
            const c2 = calc.numBaseToInt(calc.numConvertTyping(cat2));
            const tdata = calc.numConvert(`${num}`, c1, c2);
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

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage(
        {
            commandType: input.commandType,
            obj: input.obj,
            args: {
                embeds: useEmbeds
            }
        }, input.canReply
    );

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'convert',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'convert',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * get country data
 */
export async function country(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let search: string;
    let type: othertypes.countryDataSearchTypes = 'name';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
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
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'Country',
        options: [],
        config: input.config,
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (!search || search.length == 0) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.country.ms,
                edit: true
            }
        }, input.canReply);
        return;
    }
    let data;
    if (func.findFile(search, 'countrydata') &&
        !('error' in func.findFile(search, 'countrydata')) &&
        input.button != 'Refresh'
    ) {
        data = { data: func.findFile(search, 'countrydata') };
    } else {
        data = await func.getCountryData(search, type, input.config);
    }

    func.storeFile(data?.data, search, 'countrydata');

    const countryData = data.data as othertypes.countryData[];
    if (countryData.length == 0) {
        msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: errors.uErr.country.nf.replace('[ID]', `${search}`),
                edit: true
            }
        }, input.canReply);
        return;
    }
    const country = countryData[0];

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Time-Country-${commanduser.id}-${input.absoluteID}-${country.capital[0] ?? country.timezones[0]}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.time),
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Weather-Country-${commanduser.id}-${input.absoluteID}-${country.capital[0] ?? country.name.common}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.weather),
        );

    const name = country.name.official +
        (country.name.official !=
            (Object.values(country.name.nativeName)[0] as othertypes.langName)?.official
            ?
            ` (${(Object.values(country.name.nativeName)[0] as othertypes.langName)?.official})`
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
                value: `${func.separateNum(country.population)}`,
                inline: true
            },
            {
                name: 'Land Area',
                value: `${func.separateNum(country.area)}km²`,
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


    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
            components: [buttons]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'Country',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'Country',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config,
        });
    }

}

/**
 * list all commands or info about a specific command
 */
export async function help(input: extypes.commandInput) {

    let commanduser;
    let rdm = false;
    let commandfound: boolean = false;

    let commandCategory: string = 'default';
    let command: string;
    function cmdToTxt(input: helpinfo.commandInfo[]) {
        return '`' + input.map(x => x.name + '`').join(', `');
    }

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            command = input.args[0];
            if (!input.args[0]) {
                command = null;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            command = input.obj.options.getString('command');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
            if (input.button == 'Random') {
                rdm = true;
            }
            switch (input.button) {
                case 'Random':
                    rdm = true;
                    break;
                case 'Detailed':
                    command = null;
                    break;
            }
            const curembed: Discord.Embed = input.obj.message.embeds[0];
            if (input.button == 'Detailed' && curembed.description.includes('Prefix is')) {
                command = 'list';
            }
        }
            break;
    }

    if (input.overrides != null) {
        if (input.overrides.ex) {
            command = `${input.overrides.ex}`;
        }
    }

    //==============================================================================================================================================================================================

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

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'help',
        options: [
            {
                name: 'Command',
                value: command
            },
            {
                name: 'Random',
                value: `${rdm}`
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const buttons = new Discord.ActionRowBuilder()
        .setComponents(
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Random-help-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.extras.random),
            new Discord.ButtonBuilder()
                .setCustomId(`${mainconst.version}-Detailed-help-${commanduser.id}-${input.absoluteID}`)
                .setStyle(buttonsthing.type.current)
                .setEmoji(buttonsthing.label.main.detailed)
        );

    const useEmbeds = [];
    const useComponents: any = [buttons];

    let ctname = 'generalcmd';

    function commandEmb(command: helpinfo.commandInfo, embed) {

        let desc = '<required arg> [optional arg]\n';
        desc += command.description + "\n";
        if (command.usage) {
            desc += `\nCommand: \`${input.config.prefix}${command.usage}\``;
        }
        if (command.slashusage) {
            desc += `\nSlash Command: \`/${command.slashusage}\``;
        }
        if (command.linkusage) {
            desc += `\nLink Command: ${command.linkusage.map(x => `\`${x}\``).join('\n')}`;
        }

        let exceedTxt = '';
        let exceeds = false;

        const opts = command.options;
        let opttxt = '';
        for (let i = 0; i < opts.length; i++) {
            const reqtxt = opts[i].required ? 'required' : 'optional';
            const newtxt = `\`${opts[i].name} (${opts[i].type}, ${reqtxt})\`: ${opts[i].description} ${opts[i].options &&
                !opts[i].options.includes('N/A') && !opts[i].options.includes('null') && !opts[i].options.includes('true') && !opts[i].options.includes('false')
                ? `(${opts[i].options.map(x =>
                    x.includes('[') && x.includes(']') && x.includes('(') && x.includes(')')
                        ? x : `\`${x}\``
                ).join('/')})` : ''}\n`;

            if ((opttxt + newtxt).length > 1000) {
                exceeds = true;
                exceedTxt += 'Some options are omitted due to character limits. For a full list check [here](https://sbrstrkkdwmdr.github.io/sbrbot/commands.html#osu)';
                break;
            }

            opttxt += newtxt;
        }
        if (opttxt.length < 1) {
            opttxt = 'No options';
        }

        const commandaliases = command.aliases && command.aliases.length > 0 ? command.aliases.join(', ') : 'none';
        // let commandexamples = command.examples && command.examples.length > 0 ? command.examples.join('\n').replaceAll('PREFIXMSG', input.config.prefix) : 'none'
        const commandexamples = command.examples && command.examples.length > 0 ? command.examples.slice(0, 5).map(x => x.text).join('\n').replaceAll('PREFIXMSG', input.config.prefix) : 'none';

        const commandbuttons = command.buttons && command.buttons.length > 0 ? command.buttons.map(x => `[${x}]`).join('') : 'none';

        embed.setTitle("Command info for: " + command.name)
            .setURL(`https://sbrstrkkdwmdr.github.io/sbrbot/commands.html#${ctname}-${command.name.toLowerCase()}`)
            .setDescription(desc)
            .addFields([
                {
                    name: 'Options',
                    value: opttxt,
                    inline: false
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
                {
                    name: 'Buttons',
                    value: commandbuttons
                }
            ]);
        if (exceeds) {
            embed.addFields([
                {
                    name: 'Error',
                    value: exceedTxt,
                    inline: false
                }
            ]);
        }
    }
    function getemb() {
        if (command == 'list') {
            useEmbeds.push(new Discord.EmbedBuilder()
                .setColor(colours.embedColour.info.dec)
                .setTitle('Command List')
                .setURL('https://sbrstrkkdwmdr.github.io/sbrbot/commands')
                .setDescription('use `/help <command>` to get more info on a command')
                .addFields([
                    {
                        name: 'Main commands',
                        value: cmdToTxt(helpinfo.cmds),
                        inline: false
                    },
                    {
                        name: 'osu! comands',
                        value: cmdToTxt(helpinfo.osucmds),
                        inline: false
                    },
                    {
                        name: 'Admin commands',
                        value: cmdToTxt(helpinfo.admincmds),
                        inline: false
                    },
                    {
                        name: 'Other/misc commands',
                        value: cmdToTxt(helpinfo.othercmds),
                        inline: false
                    },
                ])
                .setFooter({
                    text: 'Website: https://sbrstrkkdwmdr.github.io/sbrbot/commands | Github: https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts'
                }));
            commandCategory = 'default';
        } else if (command != null) {
            const fetchcmd = command.toString();
            const commandInfo = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.info.dec);
            if (command.includes('button')) {
                commandfound = false;
                commandCategory = 'default';
                let desc = 'List of all buttons available';
                let buttonstxt = '\n';
                for (let i = 0; i < helpinfo.buttons.length; i++) {
                    const curbtn = helpinfo.buttons[i];
                    buttonstxt += `${curbtn.emoji}\`${curbtn.name}\`: ${curbtn.description}\n`;
                }
                desc += buttonstxt;
                commandInfo.setTitle('Buttons')
                    .setDescription(desc);
            } else if (helpinfo.cmds.find(obj => obj.name == fetchcmd)) {
                commandfound = true;
                commandCategory = 'gen';
                ctname = 'generalcmd';
                const res = helpinfo.cmds.find(obj => obj.name == fetchcmd);
                commandEmb(res, commandInfo);
            } else if (helpinfo.cmds.find(obj => obj.aliases.includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'gen';
                ctname = 'generalcmd';
                const res = helpinfo.cmds.find(obj => obj.aliases.includes(fetchcmd));
                commandEmb(res, commandInfo);
            }
            else if (helpinfo.othercmds.find(obj => obj.name == fetchcmd)) {
                commandfound = true;
                commandCategory = 'misc';
                ctname = 'misccmd';
                const res = helpinfo.othercmds.find(obj => obj.name == fetchcmd);
                commandEmb(res, commandInfo);
            } else if (helpinfo.othercmds.find(obj => obj.aliases.includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'misc';
                ctname = 'misccmd';
                const res = helpinfo.othercmds.find(obj => obj.aliases.includes(fetchcmd));
                commandEmb(res, commandInfo);
            }
            else if (helpinfo.osucmds.find(obj => obj.name == fetchcmd)) {
                commandfound = true;
                commandCategory = 'osu';
                ctname = 'osucmd';
                const res = helpinfo.osucmds.find(obj => obj.name == fetchcmd);
                commandEmb(res, commandInfo);
            } else if (helpinfo.osucmds.find(obj => obj.aliases.includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'osu';
                ctname = 'osucmd';
                const res = helpinfo.osucmds.find(obj => obj.aliases.includes(fetchcmd));
                commandEmb(res, commandInfo);
            }
            else if (helpinfo.admincmds.find(obj => obj.name == fetchcmd)) {
                commandfound = true;
                commandCategory = 'admin';
                ctname = 'admincmd';
                const res = helpinfo.admincmds.find(obj => obj.name == fetchcmd);
                commandEmb(res, commandInfo);
            } else if (helpinfo.admincmds.find(obj => obj.aliases.includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'admin';
                ctname = 'admincmd';
                const res = helpinfo.admincmds.find(obj => obj.aliases.includes(fetchcmd));
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
                .setColor(colours.embedColour.info.dec)
                .setTitle('Help')
                .setURL('https://sbrstrkkdwmdr.github.io/sbrbot/commands')
                .setDescription(`Prefix is: ${input.config.prefix}
- Arguments are shown as either <arg> or [arg]. Angled brackets "<arg>" are required and square brackets "[arg]" are optional.
- Use \`/help <command>\` to get more info on a command or \`/help list\` to get a list of commands
- \`/help category<category>\` will list only commands from that category
- Arguments with spaces (such as names) can be specified with quotes ie. "saber strike"
- You can use \`${input.config.prefix}osuset\` to automatically set your osu! username and gamemode for commands such as \`recent\` (rs)
- Mods are specified with +[mods] (include), -mx [mods] (match exact) or -me [mods] (exclude). -mx overrides +[mods]
`)
                .setFooter({
                    text: 'Website: https://sbrstrkkdwmdr.github.io/sbrbot/commands | Github: https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts'
                }));
            commandCategory = 'default';
        }
    }
    function rdmp(w: string) {
        const fullyrando = Math.floor(Math.random() * helpinfo[w].length);
        return helpinfo[w][fullyrando].name;
    }
    function categorise(type: 'cmds' | 'osucmds' | 'admincmds' | 'othercmds') {
        let desctxt = '';
        for (let i = 0; i < helpinfo[type].length; i++) {
            desctxt += `\n\`${helpinfo[type][i].name}\`: ${helpinfo[type][i].description}`;
        }
        if (desctxt == '') {
            desctxt = 'No commands in this category';
        }
        commandfound = true;
        return desctxt;
    }

    getemb();

    const inputMenu = new Discord.StringSelectMenuBuilder()
        .setCustomId(`${mainconst.version}-SelectMenu1-help-${commanduser.id}-${input.absoluteID}`)
        .setPlaceholder('Select a command');

    const selectCategoryMenu = new Discord.StringSelectMenuBuilder()
        .setCustomId(`${mainconst.version}-SelectMenu2-help-${commanduser.id}-${input.absoluteID}`)
        .setPlaceholder('Select a command category')
        .setOptions(
            new Discord.StringSelectMenuOptionBuilder()
                .setEmoji('📜' as Discord.APIMessageComponentEmoji)
                .setLabel('General')
                .setValue('CategoryMenu-gen'),
            new Discord.StringSelectMenuOptionBuilder()
                .setEmoji(emojis.gamemodes.standard as Discord.APIMessageComponentEmoji)
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
        )
        ;
    useComponents.push(
        new Discord.ActionRowBuilder()
            .setComponents(selectCategoryMenu)
    );
    let curpick: any = 'def';
    const push = [];


    switch (commandCategory) {
        case 'gen':
            curpick = helpinfo.cmds;
            break;
        case 'osu':
            curpick = helpinfo.osucmds;
            break;
        case 'admin':
            curpick = helpinfo.admincmds;
            break;
        case 'misc':
            curpick = helpinfo.othercmds;
            break;
    }

    //@ts-expect-error false and true no overlap error
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

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage(
        {
            commandType: input.commandType,
            obj: input.obj,
            args: {
                embeds: useEmbeds,
                components: useComponents
            }
        }, input.canReply
    );

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'help',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'help',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * bot info
 */
export async function info(input: extypes.commandInput) {

    let commanduser;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

    }


    //==============================================================================================================================================================================================

    const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setLabel('Info')
                .setURL('https://sbrstrkkdwmdr.github.io/sbrbot/')
                .setStyle(Discord.ButtonStyle.Link)
        );

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'info',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const curGuildSettings = await input.guildSettings.findOne({ where: { guildid: input.obj.guildId } });
    const serverpfx = curGuildSettings.dataValues.prefix;

    // const starttime = new Date((fs.readFileSync(`${path}/debug/starttime.txt`)).toString());
    //
    const Embed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('Bot Information');
    if (input.args.length > 0) {
        ['uptime', 'version', 'server', 'website', 'timezone', 'v'];
        switch (input.args[0]) {
            case 'uptime':
                Embed.setTitle('Total uptime')
                    .setDescription(`${calc.secondsToTime(input.client.uptime / 1000)}`);
                break;
            case 'version': case 'v':
                Embed.setTitle('Bot version')
                    .setDescription(`${pkgjson.version}`);
                break;
            case 'server':
                Embed.setTitle('Bot server')
                    .setDescription(`${mainconst.serverURL}`);
                break;
            case 'website':
                Embed.setTitle('Bot website')
                    .setDescription(`${mainconst.website}`);
                break;
            case 'timezone': case 'tz': {
                const starttime = new Date((fs.readFileSync(`${path}/debug/starttime.txt`)).toString());

                const txt = starttime.toString().split('(')[1].split(')')[0];
                //get utc offset
                const found: timezoneList.timezone[] = [];

                let frTemp: string[] = [];
                for (const tz of timezoneList.timezones) {
                    frTemp = frTemp.concat(tz.aliases);
                }
                const frWords = func.searchMatch(txt, func.removeDupes(frTemp));
                //convert frWords to tzlist

                for (let i = 0; i < timezoneList.timezones.length && i < 25; i++) {
                    for (const tz of timezoneList.timezones) {
                        if (tz.aliases.includes(frWords[i])) {
                            found.push(tz);
                        }
                    }
                }

                const offset = found[0].offsetDirection == '+' ?
                    found[0].offsetHours :
                    -found[0].offsetHours;
                let isOffset = false;
                for (let i = 0; i < timezoneList.hasDaylight.length; i++) {
                    const curTimeZone = timezoneList.hasDaylight[i];
                    if (curTimeZone.includes.slice().map(x => x.trim().toUpperCase()).includes(txt.trim().toUpperCase()) && curTimeZone.check(input.currentDate)) {
                        isOffset = true;
                    }
                }
                if (txt.toLowerCase().includes('daylight')) isOffset = true;

                const offsetToMinutes = isOffset ? Math.floor(offset * 60) + 60 : Math.floor(offset * 60);
                const Hrs = offset > 0 ?
                    Math.floor(isOffset ? offset + 1 : offset).toString().padStart(3, '+0') :
                    Math.floor(isOffset ? offset + 1 : offset).toString().replace('-', '').padStart(3, '-0');
                const offsetReadable = `UTC${Hrs}:${(Math.abs(offsetToMinutes % 60)).toString().padStart(2, '0')}`;

                Embed.setTitle('Bot timezone')
                    .setDescription(`${txt} (${offsetReadable})`);
            }
                break;
            case 'dependencies': case 'dep': case 'deps':
                Embed.setTitle('Dependencies')
                    .setDescription(`
Typescript: [${pkgjson.dependencies['typescript'].replace('^', '')}](https://www.typescriptlang.org/)
Discord.js: [${pkgjson.dependencies['discord.js'].replace('^', '')}](https://discord.js.org/#/docs)
rosu-pp: [${pkgjson.dependencies['rosu-pp-js'].replace('^', '')}](https://github.com/MaxOhn/rosu-pp-js)
Axios: [${pkgjson.dependencies['axios'].replace('^', '')}](https://github.com/axios/axios)
Sequelize: [${pkgjson.dependencies['sequelize'].replace('^', '')}](https://github.com/sequelize/sequelize/)
Chart.js: [${pkgjson.dependencies['chart.js'].replace('^', '')}](https://www.chartjs.org/)
sqlite3: [${pkgjson.dependencies['sqlite3'].replace('^', '')}](https://github.com/TryGhost/node-sqlite3)
`);
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
                    value:
                        `
    Typescript: [${pkgjson.dependencies['typescript'].replace('^', '')}](https://www.typescriptlang.org/)
    Discord.js: [${pkgjson.dependencies['discord.js'].replace('^', '')}](https://discord.js.org/#/docs)
    rosu-pp: [${pkgjson.dependencies['rosu-pp-js'].replace('^', '')}](https://github.com/MaxOhn/rosu-pp-js)
    Axios: [${pkgjson.dependencies['axios'].replace('^', '')}](https://github.com/axios/axios)
    Sequelize: [${pkgjson.dependencies['sequelize'].replace('^', '')}](https://github.com/sequelize/sequelize/)
    Chart.js: [${pkgjson.dependencies['chart.js'].replace('^', '')}](https://www.chartjs.org/)
    sqlite3: [${pkgjson.dependencies['sqlite3'].replace('^', '')}](https://github.com/TryGhost/node-sqlite3)
    `,
                    inline: true
                },
                {
                    name: 'Statistics',
                    value:
                        `
    Uptime: ${calc.secondsToTime(input.client.uptime / 1000)}
    Shards: ${input?.client?.shard?.count ?? 1}
    Guilds: ${input.client.guilds.cache.size}
    Users: ${input.client.users.cache.size}`,
                    inline: true
                }
            ])
            .setDescription(`
    [Created by SaberStrike](https://sbrstrkkdwmdr.github.io/)
    [Commands](https://sbrstrkkdwmdr.github.io/sbrbot/commands)
    Global prefix: ${input.config.prefix.includes('`') ? `"${input.config.prefix}"` : `\`${input.config.prefix}\``}
    Server prefix: ${serverpfx.includes('`') ? `"${serverpfx}"` : `\`${serverpfx}\``}
    Bot Version: ${pkgjson.version}
    `);
    }


    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage(
        {
            commandType: input.commandType,
            obj: input.obj,
            args: {
                embeds: [Embed],
                components: [buttons]
            }
        }, input.canReply
    );

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'info',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'info',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

export async function invite(input: extypes.commandInput) {

    let commanduser: Discord.User;


    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'invite',
        options: [],
        config: input.config
    });

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: mainconst.linkInvite
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'invite',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'invite',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * perform basic math operation
 */
export async function math(input: extypes.commandInput) {

    let commanduser;

    let odcalc: osumodcalc.OverallDifficultyObj;
    let type;
    let num1;
    let num2;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            type = 'basic';
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            type = input.obj.options.getString('type');
            num1 = input.obj.options.getNumber('num1');
            num2 = input.obj.options.getNumber('num2');
        }

            //==============================================================================================================================================================================================

            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'math',
        options: [
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
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

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
            .trim()
            ;
        let isErr = false;
        const evalstr: string = await calc.stringMath(string)
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
                equation = (`${calc.factorial(num1)}`);
                break;
            case 'hcf':
                if (!num2) {
                    equation = ('Missing second number.');
                }
                equation = (`${calc.findHCF(num1, num2)}`);
                break;
            case 'lcm':
                if (!num2) {
                    equation = ('Missing second number.');
                }
                equation = (`${calc.findLCM(num1, num2)}`);
                break;
            case 'pythag':
                if (!num2) {
                    equation = 'Missing second number.';
                }
                equation = (`${calc.pythag(num1, num2)}`);
                break;
            case 'sigfig':
                if (!num2) {
                    num2 = null;
                }
                if (num2 < 2 && num2 != null) {
                    num2 = 2;
                }
                equation = (`${calc.sigfig(num1, num2).number}\nTo ${calc.sigfig(num1, num2).sigfig} significant figures`);

                break;
            case 'ardt':
                equation = (`AR${osumodcalc.DoubleTimeAR(num1).ar}, ${osumodcalc.DoubleTimeAR(num1).ms}ms`);
                break;
            case 'arht':
                equation = (`AR${osumodcalc.HalfTimeAR(num1).ar}, ${osumodcalc.HalfTimeAR(num1).ms}ms`);
                break;
            case 'oddt':
                odcalc = osumodcalc.odDT(num1) as osumodcalc.OverallDifficultyObj;
                equation = (`OD${odcalc.od_num}\n\`300: ±${odcalc.hitwindow_300}\`\n\`100: ±${odcalc.hitwindow_100}\`\n\`50:  ±${odcalc.hitwindow_50}\``);
                break;
            case 'odht':
                odcalc = osumodcalc.odHT(num1) as osumodcalc.OverallDifficultyObj;
                equation = (`OD${odcalc.od_num}\n\`300: ±${odcalc.hitwindow_300}\`\n\`100: ±${odcalc.hitwindow_100}\`\n\`50:  ±${odcalc.hitwindow_50}\``);
                break;
            case 'odms':
                odcalc = osumodcalc.ODtoms(num1) as osumodcalc.OverallDifficultyObj;
                equation = (`\`300: ±${odcalc.hitwindow_300}\`\n\`100: ±${odcalc.hitwindow_100}\`\n\`50:  ±${odcalc.hitwindow_50}\``);
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

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage(
        {
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: equation
            }
        }, input.canReply
    );

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'math',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'math',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}

/**
 * ping bot
 */
export async function ping(input: extypes.commandInput) {
    let commanduser;
    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'ping',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const trueping = `${calc.toCapital(input.commandType)} latency: ${Math.abs(input.obj.createdAt.getTime() - new Date().getTime())}ms`;

    const pingEmbed = new Discord.EmbedBuilder()
        .setTitle('Pong!')
        .setColor(colours.embedColour.info.dec)
        .setDescription(`
Client latency: ${input.client.ws.ping}ms
${trueping}`);
    //SEND/EDIT MSG==============================================================================================================================================================================================


    const preEdit = new Date();
    //@ts-expect-error ong
    //This expression is not callable.
    //Each member of the union type '((options: string | MessagePayload | MessageReplyOptions) => Promise<Message>) | { (options: InteractionReplyOptions & { ...; }): Promise<...>; (options: string | ... 1 more ... | InteractionReplyOptions): Promise<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.ts(2349)
    input.obj.reply({
        embeds: [pingEmbed],
        allowedMentions: { repliedUser: false },
        failIfNotExists: true
    }).then((msg: Discord.Message | Discord.ChatInputCommandInteraction) => {
        const timeToEdit = new Date().getTime() - preEdit.getTime();
        pingEmbed.setDescription(`
Client latency: ${input.client.ws.ping}ms
${trueping}
${calc.toCapital(input.commandType)} edit latency: ${Math.abs(timeToEdit)}ms
`);
        msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.commandType == 'message' ? msg : input.obj,
            args: {
                embeds: [pingEmbed],
                edit: true,
                editAsMsg: true,
            }
        }, input.canReply);
    })
        .catch();




    log.logCommand({
        event: 'Success',
        commandName: 'ping',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
        config: input.config
    });
}

/**
 * set reminder
 */
export async function remind(input: extypes.commandInput & { reminders: extypes.reminder[]; }) {

    let commanduser;

    let time;
    let remindertxt;
    let sendtochannel;
    let user: Discord.User;
    let list = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            time = input.args[0];
            remindertxt = input.args.join(' ').replaceAll(input.args[0], '');
            sendtochannel = false;
            user = input.obj.author;

            if (!input.args[0] || input.args[0].includes('remind')) {
                list = true;
            }
            if (!input.args[1]) {
                remindertxt = 'null';
            }
            if (list == false && !input.args[0].endsWith('d') && !input.args[0].endsWith('h') && !input.args[0].endsWith('m') && !input.args[0].endsWith('s') && !time.includes(':') && !time.includes('.')) {
                return await msgfunc.sendMessage({
                    commandType: input.commandType,
                    obj: input.obj,
                    args: {
                        content: 'Incorrect time format: please use `?d?h?m?s` or `hh:mm:ss`'
                    }
                }, input.canReply);
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;


            remindertxt = input.obj.options.getString('reminder');

            time = input.obj.options.getString('time').replaceAll(' ', '');
            //@ts-expect-error Client<boolean> is not assignable to Client<boolean> (why)
            sendtochannel = (cmdchecks.isOwner(commanduser.id, input.config) || cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client)) ?

                input.obj.options.getBoolean('sendinchannel') : false;
            user = input.obj.member.user;

            if (!time.endsWith('d') && !time.endsWith('h') && !time.endsWith('m') && !time.endsWith('s') && !time.includes(':') && !time.includes('.')) {
                return await msgfunc.sendMessage({
                    commandType: input.commandType,
                    obj: input.obj,
                    args: {
                        content: 'Incorrect time format: please use `?d?h?m?s` or `hh:mm:ss`',
                        ephemeral: true
                    }
                }, input.canReply);
            }
        }

            //==============================================================================================================================================================================================

            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'remind',
        options: [
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
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    async function sendremind(reminder: Discord.Embed | Discord.EmbedBuilder, time: string, sendchannel: boolean, remindertxt: string, usersent: Discord.User, absTime: number) {
        input.reminders.push({
            time: absTime,
            text: remindertxt,
            userID: `${usersent.id}`
        });
        try {
            if (sendchannel == true) {
                setTimeout(() => {
                    input.obj.channel.send({ content: `Reminder for <@${usersent.id}> \n${remindertxt}` });
                    remReminder(absTime);
                }, calc.timeToMs(time));
            }
            else {
                setTimeout(() => {
                    usersent.send({ embeds: [reminder] });
                    remReminder(absTime);
                }, calc.timeToMs(time));
            }
        } catch (error) {
            console.log('embed error' + 'time:' + time + '\ntxt:' + remindertxt);
        }
    }
    function remReminder(time: number) {
        const findOne = input.reminders.findIndex(x => x.time === time);
        return input.reminders.splice(findOne, 1);
    }


    const reminder = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle(list ? 'REMINDERS' : 'REMINDER')
        .setDescription(`${remindertxt}`);
    let remindingText = '';
    let useEmbeds = [];

    if (list) {
        remindingText = null;
        const useReminders = input.reminders.filter(x => `${x.userID}` === `${commanduser.id}`);
        reminder.setDescription(useReminders.length > 0 ?
            useReminders.map(x => `Reminder sending <t:${x.time}:R>: ${x.text}`).join('\n').slice(0, 2000)
            : 'You have no reminders'
        );
        useEmbeds = [reminder];
    } else {
        const absTime = Math.floor(((new Date().getTime()) + calc.timeToMs(time)) / 1000);
        remindingText = `Sending reminder <t:${absTime}:R> (<t:${absTime}:f>)`;
        sendremind(reminder, time, sendtochannel, remindertxt, commanduser, absTime);
    }


    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage(
        {
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: remindingText,
                embeds: useEmbeds,
                ephemeral: true,
            }
        }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'remind',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'remind',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * bot stats
 */
export async function stats(input: extypes.commandInput) {

    let commanduser;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
        }
            break;

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'stats',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const starttime = new Date((fs.readFileSync(`${path}/debug/starttime.txt`)).toString());
    const trueping = input.obj.createdAt.getTime() - new Date().getTime() + 'ms';

    const uptime = Math.round((new Date().getTime() - starttime.getTime()) / 1000);
    const uptimehours = Math.floor(uptime / 3600) >= 10 ? Math.floor(uptime / 3600) : '0' + Math.floor(uptime / 3600);
    const uptimeminutes = Math.floor((uptime % 3600) / 60) >= 10 ? Math.floor((uptime % 3600) / 60) : '0' + Math.floor((uptime % 3600) / 60);
    const uptimeseconds = Math.floor(uptime % 60) >= 10 ? Math.floor(uptime % 60) : '0' + Math.floor(uptime % 60);
    const upandtime = `Uptime: ${uptimehours}:${uptimeminutes}:${uptimeseconds}\nTimezone: ${starttime.toString().split('(')[1].split(')')[0]}`;

    const totalusers: number = input.client.users.cache.size;
    // let totalusersnobots: Discord.Collection<any, Discord.User>;
    const totalguilds: number = input.client.guilds.cache.size;
    const commandssent: number = fs.existsSync(`${path}/logs/totalcommands.txt`) ? fs.readFileSync(`${path}/logs/totalcommands.txt`).length : 0;

    const Embed = new Discord.EmbedBuilder()
        .setTitle(`${input.client.user.username} stats`)
        .setDescription(
            `Client latency: ${Math.round(input.client.ws.ping)}ms
Message Latency: ${trueping}
${upandtime}
Guilds: ${totalguilds}
Users: ${totalusers}
Commands sent: ${commandssent}
Prefix: \`${input.config.prefix}\`
Shards: ${input?.client?.shard?.count ?? 1}
Current Shard:
`
        );

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embed],
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'stats',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'stats',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}

/**
 * get timezone
 */
export async function time(input: extypes.commandInput) {

    let commanduser;

    let fetchtimezone: string;
    let displayedTimezone: string;
    let showGMT = false;

    let useComponents = [];

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            const temp = msgfunc.matchArgMultiple(['-utc', '-gmt'], input.args);
            showGMT = temp.found ? temp.output : false;
            input.args = temp.args;
            input.args = msgfunc.cleanArgs(input.args);
            fetchtimezone = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;

            fetchtimezone = input.obj.options.getString('timezone');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }

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
            input.commandType = input?.overrides?.commandAs;
        }
        if (input?.overrides?.commanduser) {
            commanduser = input?.overrides?.commanduser;
        }
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'time',
        options: [
            {
                name: 'Timezone',
                value: `${fetchtimezone}`
            }
        ],
        config: input.config
    });
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (input?.overrides?.ex && input?.commandType == 'interaction') {
        (input.obj as Discord.ChatInputCommandInteraction)
            .reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false }
            });
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
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
        .setColor(colours.embedColour.info.dec)
        .setTitle('Current Time');

    if (fetchtimezone == null || fetchtimezone == '') {
        const cuser = await osufunc.searchUserFull(commanduser.id, input.userdata);
        fetchtimezone = cuser.tz;
        displayedTimezone = cuser.tz;
    }

    const daylightMatch = ['dst', 'daylight', 'daylight savings', 'daylight savings time'];
    if (daylightMatch.some(x => x.toLowerCase().trim() == fetchtimezone.trim().toLowerCase())) {
        Embed.setTitle('List of countries that observe daylight savings and when they do');
        const tempFields: Discord.EmbedField[] = [];
        for (const rule of timezoneList.dstForList) {
            const tempRegions: string[] = [];
            for (let region of rule.includes) {
                let txt = '';
                if ((region as timezoneList.dstCountry)?.name) {
                    region = region as timezoneList.dstCountry;
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
            const found: timezoneList.timezone[] = [];

            let frTemp: string[] = [];
            for (const tz of timezoneList.timezones) {
                frTemp = frTemp.concat(tz.aliases);
            }
            const frWords = func.searchMatch(fetchtimezone, func.removeDupes(frTemp));
            //convert frWords to tzlist

            for (let i = 0; i < timezoneList.timezones.length && i < 25; i++) {
                for (const tz of timezoneList.timezones) {
                    if (tz.aliases.includes(frWords[i])) {
                        found.push(tz);
                    }
                }
            }

            // for (let i = 0; i < timezoneList.timezones.length; i++) {
            //     const curTimeZone = timezoneList.timezones[i];
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
                        .setCustomId(`${mainconst.version}-Select-time-${commanduser.id}-${input.absoluteID}-${displayedTimezone}`)
                        .setPlaceholder('Select a timezone');
                    const usedVals = [];
                    let t = 25;
                    for (let i = 0; i < found.length && i < t; i++) {
                        const al = func.searchMatch(fetchtimezone, func.removeDupes(found[i].aliases));
                        const utcTemp = func.searchMatch('UTC+-:', func.removeDupes(found[i].aliases));
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
            for (let i = 0; i < timezoneList.hasDaylight.length; i++) {
                const curTimeZone = timezoneList.hasDaylight[i];
                if (curTimeZone.includes.slice().map(x => x.trim().toUpperCase()).includes(fetchtimezone.trim().toUpperCase()) && curTimeZone.check(input.currentDate)) {
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
                name: `${func.searchMatch(displayedTimezone, func.removeDupes(frTemp))[0]}/${offsetReadable} ${isOffset ? '(DST)' : ''}`,
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
            for (let i = 0; i < timezoneList.timezones.length; i++) {
                const curTimeZone = timezoneList.timezones[i];
                for (let j = 0; j < curTimeZone.aliases.length; j++) {
                    if (!allTimezones.includes(curTimeZone.aliases[j])) {
                        allTimezones.push(curTimeZone.aliases[j]);
                    }
                }
            }

            const filteredtz = func.filterSearchArray(allTimezones, fetchtimezone);
            if (filteredtz.length == 0) {
                useComponents = [];
            } else {
                const inputModal = new Discord.StringSelectMenuBuilder()
                    .setCustomId(`${mainconst.version}-Select-time-${commanduser.id}-${input.absoluteID}-${displayedTimezone}`)
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

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [Embed],
            components: useComponents,
            edit: input?.overrides?.ex ? true : false
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'time',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'time',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

export async function weather(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let name = '';
    let overrideID: number = null;
    let useComponents: Discord.ActionRowBuilder<any>[] = [];
    const useEmbeds = [];
    const useFiles = [];

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            name = input.args.join(' ');
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            name = input.obj.options.getString('location');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
            useComponents = input.obj.message.components as any[];
            const tempEmb = input.obj.message.embeds[0];
            name = tempEmb.footer.text.split('input: ')[1];
        }
            break;
    }
    if (input.overrides != null) {
        if (input?.overrides?.ex != null) {
            overrideID = +input?.overrides?.ex;
        }
        if (input?.overrides?.id != null) {
            name = input?.overrides?.id as string;
        }
        if (input?.overrides?.commandAs) {
            input.commandType = input?.overrides?.commandAs;
        }
        if (input?.overrides?.commanduser) {
            commanduser = input?.overrides?.commanduser;
        }
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'Weather',
        options: [
            {
                name: 'Location',
                value: name
            },
            {
                name: 'OverrideID',
                value: overrideID
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    let locatingData: othertypes.geoResults;
    if ((!name || name == null || name.length == 0) && input.commandType != 'button') {
        const cuser = await osufunc.searchUserFull(commanduser.id, input.userdata);
        name = cuser.location;
    }
    if ((!name || name == null || name.length == 0) && input.commandType != 'button') {
        const err = errors.uErr.weather.input_ms;
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: err,
                edit: true
            }
        }, input.canReply);
        logWeatherError(err);
        return;
    }
    if ((input.commandType == 'interaction' && input?.overrides?.commandAs == null) || (input.commandType == 'interaction' && input?.overrides?.id)) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Loading...`,
            }
        }, input.canReply);
    }
    if (func.findFile(name, 'weatherlocationdata') &&
        !('error' in func.findFile(name, 'weatherlocationdata')) &&
        input.button != 'Refresh'
    ) {
        locatingData = func.findFile(name, 'weatherlocationdata');
    } else {
        locatingData = await func.getLocation(name, input.config);
    }

    func.storeFile(locatingData, name, 'weatherlocationdata');
    osufunc.debug(locatingData as object, 'command', 'weather', input.obj.guildId, 'locatingdata');

    const weatherEmbed = new Discord.EmbedBuilder()
        .setURL(`https://open-meteo.com/en/docs`)
        .setTitle('Weather');

    if (locatingData.hasOwnProperty('results')) {
        if (locatingData?.results?.length < 0) {
            weatherEmbed
                .setDescription(errors.uErr.weather.locateNF);
            logWeatherError(errors.uErr.weather.locateNF);
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
            .setDescription(errors.uErr.weather.api + " (Location)");
        logWeatherError(errors.uErr.weather.api + " (Location)");
        useEmbeds.push(weatherEmbed);
    }

    async function toWeather(location: othertypes.geoLocale) {
        let weatherData: othertypes.weatherData | string;
        if (func.findFile(location.id, `weatherdata`) &&
            !('error' in func.findFile(location.id, `weatherdata`)) &&
            input.button != 'Refresh'
        ) {
            weatherData = func.findFile(location.id, `weatherdata`);
        } else {
            weatherData = await func.getWeather(location.latitude, location.longitude, location, input.config);
        }
        func.storeFile(weatherData, location.id, `weatherdata`);
        osufunc.debug(weatherData as object, 'command', 'weather', input.obj.guildId, 'weatherdata');
        if (typeof weatherData == 'string') {
            if (weatherData.includes("timeout")) {
                weatherEmbed.setDescription(errors.timeout);
                logWeatherError(errors.timeout);
                useEmbeds.push(weatherEmbed);
            } else {
                weatherEmbed.setDescription(errors.uErr.weather.wrongCoords);
                logWeatherError(errors.uErr.weather.wrongCoords);
                useEmbeds.push(weatherEmbed);
            }
            return;
        } else if (weatherData.hasOwnProperty('reason') || weatherData.hasOwnProperty('error')) {
            weatherEmbed.setDescription(errors.uErr.weather.api);
            logWeatherError(errors.uErr.weather.api);
            if (weatherData?.reason == "timeout") {
                weatherEmbed.setDescription(errors.timeout);
                logWeatherError(errors.timeout);
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

            const weatherAtmfr = func.weatherCodeToString(curData.weathercode);
            const predictedWeatherFr = func.weatherCodeToString(dailyData.weathercode[2]);
            const usePredictWeather = predictedWeatherFr.string != weatherAtmfr.string ? true : false;

            const windDir = func.windToDirection(curData.winddirection);
            const maxWindDir = func.windToDirection(dailyData.winddirection_10m_dominant[2]);

            // - => S or W
            let latSide: 'N' | 'S' = 'N';
            let lonSide: 'E' | 'W' = 'E';

            if (location.latitude < 0) {
                latSide = 'S';
            }
            if (location.longitude < 0) {
                lonSide = 'W';
            }

            const weatherTime = func.timeForGraph(weatherData.hourly.time);

            const windGraph = await func.graph(weatherTime, weatherData.hourly.windspeed_10m, `Wind speed (${weatherData.hourly_units.windspeed_10m})`,
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
            const tempGraph = await func.graph(weatherTime, weatherData.hourly.temperature_2m, `Temperature (${weatherData.hourly_units.temperature_2m})`,
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
            const precGraph = await func.graph(weatherTime, weatherData.hourly.precipitation_probability, `(${weatherData.hourly_units.precipitation_probability}) Chance of Precipitation`,
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
            const hrTxt = func.formatHours(hrArr);
            let precip = '';
            precip += dailyData.rain_sum[2] > 0 ? `Rain: ${dailyData.rain_sum[2]}${weatherUnits.rain_sum}`
                + `(${calc.convert(weatherUnits.rain_sum, 'inch', dailyData.rain_sum[2]).significantFigures} in)\n`
                : '';
            precip += dailyData.showers_sum[2] > 0 ? `Showers: ${dailyData.showers_sum[2]}${weatherUnits.showers_sum}`
                + `(${calc.convert(weatherUnits.showers_sum, 'inch', dailyData.showers_sum[2]).significantFigures} in)\n`
                : '';
            precip += dailyData.snowfall_sum[2] > 0 ? `Snowfall: ${dailyData.snowfall_sum[2]}${weatherUnits.snowfall_sum}`
                + `(${calc.convert(weatherUnits.snowfall_sum, 'ft', dailyData.snowfall_sum[2]).significantFigures} ft)\n`
                : '';
            precip += dailyData.precipitation_sum[2] > 0 ? `Total: ${dailyData.precipitation_sum[2]}${weatherUnits.precipitation_sum}`
                + `(${calc.convert(weatherUnits.precipitation_sum, 'inch', dailyData.precipitation_sum[2]).significantFigures} in)\n`
                : '';
            precip += dailyData.precipitation_hours[2] > 0 ? `Hours: ${hrTxt}` : '';

            const windtxt =
                `Current: ${curData.windspeed}${weatherUnits.windspeed_10m_max} (${calc.convert(weatherUnits.windspeed_10m_max, 'mph', curData.windspeed).significantFigures} mph) ${windDir.short}${windDir.emoji} ${curData.winddirection}°
Max speed: ${dailyData.windspeed_10m_max[2]}${weatherUnits.windspeed_10m_max} (${calc.convert(weatherUnits.windspeed_10m_max, 'mph', dailyData.windspeed_10m_max[2]).significantFigures} mph)
Max Gusts: ${dailyData.windgusts_10m_max[2]}${weatherUnits.windgusts_10m_max} (${calc.convert(weatherUnits.windgusts_10m_max, 'mph', dailyData.windgusts_10m_max[2]).significantFigures} mph)`;
            const temptxt = `
Current: ${curData.temperature}${weatherUnits.temperature_2m_max} (${calc.convert(weatherUnits.temperature_2m_max, `fahrenheit`, curData.temperature).significantFigures}℉)
Min: ${dailyData.temperature_2m_min[2]}${weatherUnits.temperature_2m_max} (${calc.convert(weatherUnits.temperature_2m_max, `fahrenheit`, dailyData.temperature_2m_min[2]).significantFigures}℉)
Max: ${dailyData.temperature_2m_max[2]}${weatherUnits.temperature_2m_max} (${calc.convert(weatherUnits.temperature_2m_max, `fahrenheit`, dailyData.temperature_2m_max[2]).significantFigures}℉)
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

    async function toSelector(data: othertypes.geoResults) {
        // weatherEmbed.setDescription('Multiple locations were found\nPlease select one from the list below');
        const inputModal = new Discord.StringSelectMenuBuilder()
            .setCustomId(`${mainconst.version}-Select-weather-${commanduser.id}-${input.absoluteID}`)
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

    function logWeatherError(error) {
        log.logCommand({
            event: 'Error',
            commandName: 'Weather',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: error,
            config: input.config
        });
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: useEmbeds,
            components: useComponents,
            files: useFiles,
            edit: true
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'Weather',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'Weather',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}