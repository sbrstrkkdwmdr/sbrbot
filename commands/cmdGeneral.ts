import * as Discord from 'discord.js';
import * as fs from 'fs';
import moment from 'moment';
import * as replayparser from 'osureplayparser';
// import strmath from 'string-math';
// import strmath from 'math-from-string';
import * as jimp from 'jimp';
import * as luxon from 'luxon';
import pkgjson from '../package.json' assert { type: 'json' };
import { path, precomppath } from '../path.js';
import * as calc from '../src/calc.js';
import * as cmdchecks from '../src/checks.js';
import * as colourfunc from '../src/colourcalc.js';
import * as buttonsthing from '../src/consts/buttons.js';
import * as colours from '../src/consts/colours.js';
import * as conversions from '../src/consts/conversions.js';
import * as def from '../src/consts/defaults.js';
import * as emojis from '../src/consts/emojis.js';
import * as errors from '../src/consts/errors.js';
import * as helpinfo from '../src/consts/helpinfo.js';
import * as mainconst from '../src/consts/main.js';
import * as timezoneList from '../src/consts/timezones.js';
import * as embedStuff from '../src/embed.js';
import * as func from '../src/func.js';
import * as log from '../src/log.js';
import * as osufunc from '../src/osufunc.js';
import * as osumodcalc from '../src/osumodcalc.js';
import * as extypes from '../src/types/extratypes.js';
import * as osuApiTypes from '../src/types/osuApiTypes.js';
import * as othertypes from '../src/types/othertypes.js';
import * as msgfunc from './msgfunc.js';

/**
 * 
 */
export async function changelog(input: extypes.commandInput) {
    let commanduser;
    let offset = 0;
    let version = null;
    let useNum: number = null;
    let isList = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            version = input.args[0] ?? null;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
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
                    useNum = 1;
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
                name: 'listMode',
                value: isList
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const pgbuttons: Discord.ActionRowBuilder = await msgfunc.pageButtons('changelog', commanduser, input.absoluteID);
    let buttons = new Discord.ActionRowBuilder();
    //get version
    let found: string | number = null;
    let foundBool = true;
    if (version) {
        //search for version
        if (version?.includes('.')) {
            found = mainconst.versions.findIndex(x =>
                version.trim() === `${x.name}`.trim() || version.includes(`${x.releaseDate}`) || version.includes(`${x.releaseDateFormatted}`)
                || (`${x.releaseDate}`).includes(version) || `${x.releaseDateFormatted}`.includes(version)
            );
            if (found == -1) {
                found = null;
                foundBool = false;
            }
        } else {
            switch (version) {
                case 'first': case 'original':
                    found = 0;
                    break;
                case 'second':
                    found = 1;
                    break;
                case 'third':
                    found = 2;
                    break;
                case 'latest':
                    break;
                default:
                    foundBool = false;
                case 'versions': case 'list': case 'all':
                    found = 'string';
                    break;
            }
        }
    }
    useNum = useNum != null ? useNum :
        typeof found == 'number' ?
            (found as number) :
            mainconst.versions.length - 1 - offset;
    const Embed = new Discord.EmbedBuilder();
    if (typeof found == 'string') {
        isList = true;
        Embed.setTitle('ALL VERSIONS')
            .setDescription(`${mainconst.versions.map(x => `\`${(x.name).padEnd(10)} (${x.releaseDateFormatted})\``).join('\n')}${foundBool ? '' : `\nThere was an error trying to find version ${version}`}`)
            .setFooter({
                text: `${useNum + 1}/${mainconst.versions.length}`
            });
    } else {
        const document = fs.readFileSync(`${precomppath}\\changelog\\changelog.txt`, 'utf-8');
        const list = document.split('VERSION');
        list.shift();
        const cur = list[useNum] as string;
        const verdata = mainconst.versions[useNum];
        const commit = cur.split('commit:')[1].split('\n')[0] as string;
        const changesTxt = cur.split('changes:')[1];
        let changes: { add: string[]; rem: string[]; qol: string[], fix: string[], maj: string[]; min: string[]; } = {
            add: [],
            rem: [],
            qol: [],
            fix: [],
            maj: [],
            min: [],
        };
        const changesList = changesTxt.split('\n').map(x => x.trim());
        for (const change of changesList) {
            switch (true) {
                case change.startsWith('[ADD]'):
                    changes.add.push(change.slice(5));
                    break;
                case change.startsWith('[QOL]'):
                    changes.qol.push(change.slice(5));
                    break;
                case change.startsWith('[FIX]'):
                    changes.fix.push(change.slice(5));
                    break;
                case change.startsWith('[REM]'):
                    changes.rem.push(change.slice(5));
                    break;
                case change.startsWith('[MAJ]'):
                    changes.maj.push(change.slice(5));
                    break;
                default:
                    if (change.length > 2) changes.min.push(change.replaceAll('[MIN]', ''));
                    break;
            }
        }
        let txt = '';
        if (changes.maj.length > 0) {
            txt += `${colourfunc.codeBlockColourText("MAJOR CHANGES", "blue", "text")}` + changes.maj.join('\n');

        }
        if (changes.add.length > 0) {
            txt += `${colourfunc.codeBlockColourText("ADDITIONS", "green", "text")}` + changes.add.join('\n');
        }
        if (changes.qol.length > 0) {
            txt += `${colourfunc.codeBlockColourText("QUALITY OF LIFE", "pink", "text")}` + changes.qol.join('\n');

        }
        if (changes.fix.length > 0) {
            txt += `${colourfunc.codeBlockColourText("FIXES", "yellow", "text")}` + changes.fix.join('\n');

        }
        if (changes.rem.length > 0) {
            txt += `${colourfunc.codeBlockColourText("REMOVALS", "red", "text")}` + changes.rem.join('\n');

        }
        if (changes.min.length > 0) {
            txt += `${colourfunc.codeBlockColourText("MINOR", "cyan", "text")}` + changes.min.join('\n');

        }

        txt = txt.slice(0, 2000);

        const url = commit?.toString()?.includes('null') ?
            `https://github.com/sbrstrkkdwmdr/sbrbot/`
            :
            `https://github.com/sbrstrkkdwmdr/sbrbot/commit/${commit.trim()}`;


        Embed
            .setTitle(`${verdata.name.trim()} Changelog`)
            .setURL(url)
            .setDescription(`commit [${commit.trim()?.slice(0, 7)?.trim()}](${url})
Released ${verdata.releaseDateFormatted}${txt}
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
    if (useNum == mainconst.versions.length) {
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
    let num: number = 1;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            cat1 = input.args[0] ?? '';
            cat2 = input.args[1] ?? '';
            num = parseFloat(input.args[2]) ?? 1;
            if (!input.args[0]) {
                cat1 = 'help';
            }
            if (!input.args[1]) {
                cat2 = 'help';
            }
            if (isNaN(num)) {
                num = 0;
            }
            if (!input.args[2]) {
                num = 0;
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
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
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

    const EmbedList = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('List of measurements')

        .addFields([
            {
                name: 'Temperature',
                value: [
                    'celsius (c)', 'fahrenheit (f)', 'kelvin (k)'
                ].join(' | '),
                inline: true
            },
            {
                name: 'Distance',
                value: [
                    'inch (in)', 'foot (ft)', 'metre (m)', 'mile (mi)', 'astronomical unit (au)', 'light year (ly)',
                ].join(' | '),
                inline: true
            },
            {
                name: 'Time',
                value: [
                    'second (s)', 'minute (min)', 'hour (h)', 'day (d)', 'week (wk)', 'month (mth)', 'year (y)',
                ].join(' | '),
                inline: true
            },
            {
                name: 'Volume',
                value: [
                    'teaspoon (tsp)', 'tablespoon (tbp)', 'fluid ounce (floz)', 'cup (c)', 'pint (pt)', 'litre (l)', 'gallon (gal)', 'cubic metres (m3)',
                ].join(' | '),
                inline: true
            },
            {
                name: 'Mass',
                value: [
                    'gram (g)', 'ounce (oz)', 'pound (lb)', 'stone (st)', 'us ton (t)', 'metric tonne (mt)',
                ].join(' | '),
                inline: true
            },
            {
                name: 'Pressure',
                value: [
                    'pascal (Pa)', 'millimetre of mercury/torr (mmHg)', 'pounds per square inch (psi)', 'bar', 'standard atmosphere (atm)',
                ].join(' | '),
                inline: true
            },
            {
                name: 'Energy',
                value: [
                    'electronvolt (eV)', 'joule (j)', 'calorie (cal)',
                ].join(' | '),
                inline: true
            },
            {
                name: 'Area',
                value: [
                    'square metre (m2)', 'square kilometre (km2)', 'square mile (mi2)', 'hectare (ha)', 'acre (ac)',
                ].join(' | '),
                inline: true
            },
            {
                name: 'Angle',
                value: [
                    'degree (deg)', 'gradian (grad)', 'radian (rad)',
                ].join(' | '),
                inline: true
            },
            {
                name: 'Speed',
                value: [
                    'metres per second (ms)', 'kilometres per hour (kmh)', 'miles per hour (mph)', 'knot/nautical miles per hour (kt)', 'lightspeed (c)'
                ].join(' | '),
                inline: true
            },
            {
                name: 'Non-measurements',
                value: 'help, metricprefixes',
                inline: false
            }

        ])
        ;
    const siEmbed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('List of SI prefixes')
        .addFields([
            {
                name: 'Increments',
                value:
                    `\`
Q  | quetta | 10^30 | Nonillion   | 1,000,000,000,000,000,000,000,000,000,000
R  | ronna  | 10^27 | Octillion   | 1,000,000,000,000,000,000,000,000,000
Y  | yotta  | 10^24 | Septillion  | 1,000,000,000,000,000,000,000,000
Z  | zetta  | 10^21 | Sextillion  | 1,000,000,000,000,000,000,000
E  | exa    | 10^18 | Quintillion | 1,000,000,000,000,000,000
P  | peta   | 10^15 | Quadrillion | 1,000,000,000,000,000
T  | tera   | 10^12 | Trillion    | 1,000,000,000,000
G  | giga   | 10^9  | Billion     | 1,000,000,000
M  | mega   | 10^6  | Million     | 1,000,000
k  | kilo   | 10^3  | Thousand    | 1,000
h  | hecto  | 10^2  | Hundred     | 100
da | deca   | 10^1  | Ten         | 10
\``,
                inline: false
            },
            {
                name: 'Decrements',
                value:
                    `\`
d | deci   | 10^-1  | Tenth         | 0.1
c | centi  | 10^-2  | Hundredth     | 0.01
m | milli  | 10^-3  | Thousandth    | 0.001
μ | micro  | 10^-6  | Millionth     | 0.000 001
n | nano   | 10^-9  | Billionth     | 0.000 000 001 
p | pico   | 10^-12 | Trillionth    | 0.000 000 000 001
f | femto  | 10^-15 | Quadrillionth | 0.000 000 000 000 001
a | atto   | 10^-18 | Quintillionth | 0.000 000 000 000 000 001
z | zepto  | 10^-21 | Sextillionth  | 0.000 000 000 000 000 000 001
y | yocto  | 10^-24 | Septillionth  | 0.000 000 000 000 000 000 000 001
r | ronto  | 10^-27 | Octillionth   | 0.000 000 000 000 000 000 000 000 001
q | quecto | 10^-30 | Nonillionth   | 0.000 000 000 000 000 000 000 000 000 001
\``,
                inline: false
            }
        ]);

    const EmbedSLC = new Discord.EmbedBuilder()
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
        ]);
    const embedres = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setDescription('⠀');

    let useEmbeds = [];

    let conv = 'Unknown';
    let convtype = `${cat1} to ${cat2}`;
    let eq = 'Unknown';
    let formula = 'Unknown';

    let converting = true;

    const reqHelp: string[] = ['help', 'units'];
    const reqSlc: string[] = ['slc'];
    const reqprefix: string[] = ['si', 'metricprefixes', 'prefix'];

    if ((reqHelp.includes(cat1.toLowerCase()) || cat2 == '')
        && !reqSlc.includes(cat1.toLowerCase())
        && !reqprefix.includes(cat1.toLowerCase())
    ) {
        useEmbeds = [EmbedList];
        converting = false;
    }
    if (reqSlc.includes(cat1.toLowerCase())) {
        useEmbeds = [EmbedSLC];
        converting = false;
    }
    if (reqprefix.includes(cat1.toLowerCase())) {
        useEmbeds = [siEmbed];
        converting = false;
    }

    let foundOne = false;

    const tcat1 = func.removeSIPrefix(cat1);
    const tcat2 = func.removeSIPrefix(cat2);
    let usePre1 = true;
    let usePre2 = true;

    if (converting == true) {
        //find
        for (let i = 0; i < conversions.values.length; i++) {
            const curObject = conversions.values[i];
            if (!curObject) {
                error('nf');
                break;
            }

            const names: string[] = [];
            curObject.names.forEach(x =>
                names.push(x.toUpperCase())
            );

            if (names.includes(tcat1.originalValue.toUpperCase()) || names.includes(cat1.toUpperCase())) {
                foundOne = true;
                if (names.includes(cat1.toUpperCase()) && !names.includes(tcat1.originalValue.toUpperCase())) {
                    usePre1 = false;
                }
                for (let j = 0; j < curObject.calc.length; j++) {
                    const curCalc = curObject.calc[j];
                    if (!curCalc) {
                        error('invalid', curObject.name);
                        break;
                    }

                    const calcNames: string[] = [];
                    curCalc.names.forEach(x =>
                        calcNames.push(x.toUpperCase())
                    );
                    if (calcNames.includes(tcat2.originalValue.toUpperCase()) || calcNames.includes(cat2.toUpperCase())) {
                        let secondaryMetric = false;
                        formula = curCalc.text;

                        if (calcNames.includes(cat2.toUpperCase()) && !calcNames.includes(tcat2.originalValue.toUpperCase())) {
                            usePre2 = false;
                        }

                        for (let i = 0; i < conversions.values.length; i++) {
                            const curObject2 = conversions.values[i];
                            if (!curObject2) {
                                error('nf');
                                break;
                            }
                            const names2: string[] = [];
                            curObject2.names.forEach(x =>
                                names2.push(x.toUpperCase())
                            );
                            if (names2.includes(tcat2.originalValue.toUpperCase()) && curObject2.system == 'Metric') {
                                secondaryMetric = true;
                            }
                        }

                        let fromType = curObject.name;

                        let toType = curCalc.to;

                        if (curObject.system == 'Metric' && tcat1.prefix.removed.length > 0 && usePre1) {
                            num *= tcat1.power;
                            fromType = tcat1.prefix?.long?.length > 0 ? calc.toCapital(tcat1.prefix.long) + curObject.name.toLowerCase() : curObject.name;
                            const formStart = `${tcat1.power}`;
                            formula = `${formStart}*(${formula})`;
                        }

                        let finNum = curCalc.func(num);

                        if (secondaryMetric && tcat2.prefix.removed.length > 0 && usePre2) {
                            finNum *= tcat2.power;
                            toType = tcat2.prefix?.long?.length > 0 ? calc.toCapital(tcat2.prefix.long) + curCalc.to.toLowerCase() : curCalc.to;
                            const formEnd = `${tcat2.power}`;
                            formula = `(${formula})/${formEnd}`;
                        }

                        conv = curObject.type;
                        convtype = `${fromType} => ${toType}`;
                        eq = `${finNum}`;

                        const usVol = [];

                        if (curObject.type == 'Volume' && (usVol.includes(curObject.name) || usVol.includes(curCalc.to))) {
                            embedres.setDescription('Using US measurements not Imperial');
                        }

                        break;
                    }
                }
            }
        }

        if (foundOne && eq == 'Unknown') {
            error('invalid');
        } else if (eq == 'Unknown') {
            error('nf');
        }

        embedres.setTitle(`${conv}`);
        embedres.addFields([
            {
                name: `${convtype}`,
                value: `${eq}`,
                inline: false
            },
            {
                name: 'Formula',
                value: `\`${formula}\``,
                inline: false
            }
        ]);
        useEmbeds.push(embedres);
    }


    function error(string: 'nf' | 'invalid', c1?: string, c2?: string) {
        switch (string) {
            case 'nf': default: {
                conv = 'Invalid conversion';
                convtype = 'Error';
                eq = `Could not find \`${c1 ?? cat1}\` and/or \`${c2 ?? cat2}\``;
                formula = '???';
            }
                break;
            case 'invalid': {
                conv = 'Invalid conversion';
                convtype = 'Error';
                eq = `Cannot convert \`${c1 ?? cat1}\` to \`${c2 ?? cat2}\``;
                formula = '???';
            }
                break;
        }
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
 * list all commands or info about a specific command
 */
export async function help(input: extypes.commandInput) {

    let commanduser;
    let rdm = false;
    let commandfound: boolean = false;

    let commandCategory: string = 'default';
    let command: string;

    const fullCommandList = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('Command List')
        .setDescription('use `/help <command>` to get more info on a command')
        .addFields([
            {
                name: 'Main commands',
                value: '`' + helpinfo.cmds.map(x => x.name + '`,').join(' `'),
                inline: false
            },
            {
                name: 'osu! comands',
                value: '`' + helpinfo.osucmds.map(x => x.name + '`,').join(' `'),
                inline: false
            },
            {
                name: 'Admin commands',
                value: '`' + helpinfo.admincmds.map(x => x.name + '`,').join(' `'),
                inline: false
            },
            {
                name: 'Other/misc commands',
                value: '`' + helpinfo.othercmds.map(x => x.name + '`,').join(' `'),
                inline: false
            },
        ])
        .setFooter({
            text: 'Website: https://sbrstrkkdwmdr.github.io/sbrbot/commands | Github: https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts'
        });

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

        let exceedTxt = '';
        let exceeds = false;

        const opts = command.options;
        let opttxt = '';
        for (let i = 0; i < opts.length; i++) {
            const reqtxt = opts[i].required ? 'required' : 'optional';
            const newtxt = `\`${opts[i].name} (${opts[i].type}, ${reqtxt})\`: ${opts[i].description} ${opts[i].options &&
                !opts[i].options.includes('N/A') && !opts[i].options.includes('null') && !opts[i].options.includes('true') && !opts[i].options.includes('false')
                ? `(${opts[i].options.map(x => `\`${x}\``).join('/')})` : ''}\n`;

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
        if (command != null) {
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
            else if (command.includes('CategoryMenu')) {
                switch (true) {
                    case command.includes('gen'): {
                        commandInfo.setTitle("General Commands");
                        let desctxt = '';
                        for (let i = 0; i < helpinfo.cmds.length; i++) {
                            desctxt += `\n\`${helpinfo.cmds[i].name}\`: ${helpinfo.cmds[i].description}`;
                        }
                        if (desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'gen';
                        commandfound = true;
                    }
                        break;
                    case command.includes('osu'): {
                        commandInfo.setTitle("osu! Commands");
                        let desctxt = '';
                        for (let i = 0; i < helpinfo.osucmds.length; i++) {
                            desctxt += `\n\`${helpinfo.osucmds[i].name}\`: ${helpinfo.osucmds[i].description}`;
                        }
                        if (desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'osu';
                        commandfound = true;
                    }
                        break;
                    case command.includes('admin'): {
                        commandInfo.setTitle("Admin Commands");
                        let desctxt = '';
                        for (let i = 0; i < helpinfo.admincmds.length; i++) {
                            desctxt += `\n\`${helpinfo.admincmds[i].name}\`: ${helpinfo.admincmds[i].description}`;
                        }
                        if (desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'admin';
                        commandfound = true;
                    }
                        break;
                    case command.includes('misc'): {
                        commandInfo.setTitle("General Commands");
                        let desctxt = '';
                        for (let i = 0; i < helpinfo.othercmds.length; i++) {
                            desctxt += `\n\`${helpinfo.othercmds[i].name}\`: ${helpinfo.othercmds[i].description}`;
                        }
                        if (desctxt == '') {
                            desctxt = 'No commands in this category';
                        }
                        commandInfo.setDescription(desctxt);
                        commandCategory = 'misc';
                        commandfound = true;
                    }
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
            useEmbeds.push(fullCommandList);
            commandCategory = 'default';
        }
    }
    function rdmp(w: string) {
        const fullyrando = Math.floor(Math.random() * helpinfo[w].length);
        return helpinfo[w][fullyrando].name;
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

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
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

    // const starttime = new Date((fs.readFileSync(`${path}\\debug\\starttime.txt`)).toString());

    const Embed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('Bot Information')
        .setFields([
            {
                name: 'Dependencies',
                value:
                    `
Typescript: [${pkgjson.dependencies['typescript'].replace('^', '')}](https://www.typescriptlang.org/)
Discord.js: [${pkgjson.dependencies['discord.js'].replace('^', '')}](https://discord.js.org/#/docs)
rosu-pp: [${pkgjson.dependencies['rosu-pp'].replace('^', '')}](https://github.com/MaxOhn/rosu-pp-js)
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
[Created by SaberStrike](https://sbrstrkkdwmdr.github.io/sbr-web/)
[Commands](https://sbrstrkkdwmdr.github.io/sbrbot/commands)
Global prefix: ${input.config.prefix.includes('`') ? `"${input.config.prefix}"` : `\`${input.config.prefix}\``}
Server prefix: ${serverpfx.includes('`') ? `"${serverpfx}"` : `\`${serverpfx}\``}
Bot Version: ${pkgjson.version}
`);

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
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
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

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================



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

    let odcalc;
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
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
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
                odcalc = osumodcalc.odDT(num1);
                equation = (`OD${odcalc.od_num}\n300:+-${odcalc.hitwindow_300}\n100:+-${odcalc.hitwindow_100}\n50:+-${odcalc.hitwindow_50}`);
                break;
            case 'odht':
                odcalc = osumodcalc.odHT(num1);
                equation = (`OD${odcalc.od_num}\n300:+-${odcalc.hitwindow_300}\n100:+-${odcalc.hitwindow_100}\n50:+-${odcalc.hitwindow_50}`);
                break;
            case 'odms':
                odcalc = osumodcalc.ODtoms(num1);
                equation = (`300:+-${odcalc.range300}\n100:+-${odcalc.range100}\n50:+-${odcalc.range50}`);
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
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
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
    //@ts-expect-error aaaaaaaaaa
    //This expression is not callable.
    //Each member of the union type '((options: string | MessagePayload | MessageReplyOptions) => Promise<Message>) | { (options: InteractionReplyOptions & { ...; }): Promise<...>; (options: string | ... 1 more ... | InteractionReplyOptions): Promise<...>; } | { ...; }' has signatures, but none of those signatures are compatible with each other.ts(2349)
    input.obj.reply({
        embeds: [pingEmbed],
        allowedMentions: { repliedUser: false },
        failIfNotExists: true
    }).then((msg: Discord.Message | Discord.CommandInteraction) => {
        const timeToEdit = new Date().getTime() - preEdit.getTime();
        pingEmbed.setDescription(`
Client latency: ${input.client.ws.ping}ms
${trueping}
${calc.toCapital(input.commandType)} edit latency: ${Math.abs(timeToEdit)}ms
`);
        switch (input.commandType) {
            case 'message':
                //@ts-expect-error 'edit' property does not exist on CommandInteraction
                msg.edit({
                    embeds: [pingEmbed],
                    allowedMentions: { repliedUser: false },
                });
                break;
            case 'interaction':
                //@ts-expect-error 'editReply' property does not exist on Message
                input.obj.editReply({
                    embeds: [pingEmbed],
                    allowedMentions: { repliedUser: false },
                });
                break;

        }
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
            sendtochannel =
                (cmdchecks.isOwner(commanduser.id, input.config) || cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client)) ?

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
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
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
            useReminders.map(x => `Reminder sending in <t:${x.time}:R>: ${x.text}`).join('\n').slice(0, 2000)
            : 'You have no reminders'
        );
        useEmbeds = [reminder];
    } else {
        const absTime = Math.floor(((new Date().getTime()) + calc.timeToMs(time)) / 1000);
        remindingText = `Sending reminder in <t:${absTime}:R> (<t:${absTime}:f>)`;
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

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
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

    const starttime = new Date((fs.readFileSync(`${path}\\debug\\starttime.txt`)).toString());
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
Commands: https://sbrstrkkdwmdr.github.io/sbrbot/commands
Shards:
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

    let useComponents = [];

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
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
        }
        if (input?.overrides?.id) {
            displayedTimezone = (input?.overrides?.id ?? fetchtimezone) as string;
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

    const curTime = moment();

    let showGMT = false;

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

    if (fetchtimezone != null && fetchtimezone != '') {
        try {
            let offset = 0;
            const found: timezoneList.timezone[] = [];

            for (let i = 0; i < timezoneList.timezones.length; i++) {
                const curTimeZone = timezoneList.timezones[i];
                if (curTimeZone.aliases.slice().map(x => x.trim().toUpperCase()).includes(fetchtimezone.trim().toUpperCase())) {
                    found.push(curTimeZone);
                    offset = curTimeZone.offsetDirection == '+' ?
                        curTimeZone.offsetHours :
                        -curTimeZone.offsetHours;
                }
            }

            if (found.length == 0) {
                throw new Error("Unrecognised timezone");
            }

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

                    for (let i = 0; i < found.length && i < 10; i++) {
                        inputModal.addOptions(
                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel(`#${i + 1}`)
                                .setDescription(`${found[i].aliases[i]}`)
                                .setValue(`${found[i].aliases[i]}`)
                        );
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

            const offsetToMinutes = isOffset ? Math.floor(offset * 60) + 60 : Math.floor(offset * 60);

            const reqTime = moment().utcOffset(offsetToMinutes);

            const Hrs = offset > 0 ?
                Math.floor(isOffset ? offset + 1 : offset).toString().padStart(3, '+0') :
                Math.floor(isOffset ? offset + 1 : offset).toString().replace('-', '').padStart(3, '-0');

            const offsetReadable = `UTC${Hrs}:${(Math.abs(offsetToMinutes % 60)).toString().padStart(2, '0')}`;

            fields.push({
                name: `${calc.toCapital(displayedTimezone)}/${offsetReadable} ${isOffset ? '(DST)' : ''}`,
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
            components: useComponents
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

export async function timeset(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let fetchtimezone: string;
    let displayedTimezone: string;

    let useComponents = [];
    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
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
        }
        if (input?.overrides?.id) {
            displayedTimezone = (input?.overrides?.id ?? fetchtimezone) as string;
        }
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'settime',
        options: [
            {
                name: 'Timezone',
                value: `${fetchtimezone}`
            }
        ],
        config: input.config
    });
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const txt = 'null';
    const fields: Discord.EmbedField[] = [];

    const Embed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('Set timezone');

    if (fetchtimezone != null && fetchtimezone != '') {
        try {
            let offset = 0;
            const found: timezoneList.timezone[] = [];

            for (let i = 0; i < timezoneList.timezones.length; i++) {
                const curTimeZone = timezoneList.timezones[i];
                if (curTimeZone.aliases.slice().map(x => x.trim().toUpperCase()).includes(fetchtimezone.trim().toUpperCase())) {
                    found.push(curTimeZone);
                    offset = curTimeZone.offsetDirection == '+' ?
                        curTimeZone.offsetHours :
                        -curTimeZone.offsetHours;
                }
            }

            if (found.length == 0) {
                throw new Error("Unrecognised timezone");
            }

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
                        .setCustomId(`${mainconst.version}-Select-settime-${commanduser.id}-${input.absoluteID}-${displayedTimezone}`)
                        .setPlaceholder('Select a timezone');

                    for (let i = 0; i < found.length && i < 10; i++) {
                        inputModal.addOptions(
                            new Discord.StringSelectMenuOptionBuilder()
                                .setLabel(`#${i + 1}`)
                                .setDescription(`${found[i].aliases[i]}`)
                                .setValue(`${found[i].aliases[i]}`)
                        );
                    }
                    buttons.addComponents(inputModal);
                }
                useComponents = [buttons];
            }

            // if (useComponents.length == 0) {
            //     if (input?.overrides?.overwriteModal) {

            //     }
            // }

            const updateRows: {
                userid: string | number,
                timezone: string;
            } = {
                userid: commanduser.id,
                timezone: displayedTimezone,
            };
            const findname = await input.userdata.findOne({ where: { userid: commanduser.id } });
            let fieldText = 'null';
            let fieldTitle = 'Updated settings';
            if (found.length > 1) {
                fieldTitle = 'There are multiple timezones matching this query';
                fieldText =
                    `Please try again with one of the options below:
${found.map(x => `UTC${x.offsetDirection}${x.offsetHours}\n`).join()}`;
            } else {
                if (findname == null) {
                    try {
                        await input.userdata.create({
                            userid: commanduser.id,
                            timezone: displayedTimezone
                        });
                        fieldText = `Changed timezone to: \`${displayedTimezone}\``;
                    } catch (error) {
                        fieldText = `There was an error trying to create user settings`;

                    }
                } else {
                    const affectedRows = await input.userdata.update(updateRows,
                        { where: { userid: commanduser.id } }
                    );
                    if (affectedRows.length > 0 || affectedRows[0] > 0) {
                        fieldText = `Changed timezone to: \`${displayedTimezone}\``;
                    } else {
                        fieldText = `There was an error trying to update your settings.`;
                        log.errLog('Database error', `${affectedRows}`, `${input.absoluteID}`);
                    }
                }
            }

            fields.push({
                name: fieldTitle,
                value: fieldText,
                inline: false
            });
        } catch (error) {
            console.log(error);
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
                    .setCustomId(`${mainconst.version}-Select-settime-${commanduser.id}-${input.absoluteID}-${displayedTimezone}`)
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
    }

    Embed.addFields(fields);

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
            commandName: 'settime',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'settime',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}

export async function locationset(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let fetchlocate: string;

    let useComponents = [];
    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            fetchlocate = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;

            fetchlocate = input.obj.options.getString('timezone');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }

    if (input?.overrides) {
        if (input?.overrides?.ex) {
            fetchlocate = input?.overrides?.ex as string;
        }
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'setlocation',
        options: [
            {
                name: 'Locations',
                value: `${fetchlocate}`
            }
        ],
        config: input.config
    });
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const txt = 'null';
    const fields: Discord.EmbedField[] = [];

    const Embed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('Set location');

    if (fetchlocate != null && fetchlocate != '') {
        const updateRows: {
            userid: string | number,
            location: string;
        } = {
            userid: commanduser.id,
            location: fetchlocate,
        };
        const findname = await input.userdata.findOne({ where: { userid: commanduser.id } });
        let fieldText = 'null';
        let fieldTitle = 'Updated settings';
        if (findname == null) {
            try {
                await input.userdata.create({
                    userid: commanduser.id,
                    location: fetchlocate
                });
                fieldText = `Changed location to: \`${fetchlocate}\``;
            } catch (error) {
                fieldText = `There was an error trying to create user settings`;

            }
        } else {
            const affectedRows = await input.userdata.update(updateRows,
                { where: { userid: commanduser.id } }
            );
            if (affectedRows.length > 0 || affectedRows[0] > 0) {
                fieldText = `Changed location to: \`${fetchlocate}\``;
            } else {
                fieldText = `There was an error trying to update your settings.`;
                log.errLog('Database error', `${affectedRows}`, `${input.absoluteID}`);
            }
        }
    }

    Embed.addFields(fields);

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
            commandName: 'setlocation',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'setlocation',
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
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
    }
    if (input.overrides != null) {
        if (input?.overrides?.ex != null) {
            overrideID = +input?.overrides?.ex;
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

    if (func.findFile(name, 'weatherlocationdata') &&
        !('error' in func.findFile(name, 'weatherlocationdata')) &&
        input.button != 'Refresh'
    ) {
        locatingData = func.findFile(name, 'weatherlocationdata');
    } else {
        locatingData = await func.getLocation(name, input.config);
    }

    func.storeFile(locatingData, name, 'weatherlocationdata');

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
            .setDescription(errors.uErr.weather.api);
        logWeatherError(errors.uErr.weather.api);
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
        if (typeof weatherData == 'string') {
            weatherEmbed.setDescription(errors.uErr.weather.wrongCoords);
            logWeatherError(errors.uErr.weather.wrongCoords);
            return;
        } else if (weatherData.hasOwnProperty('reason') || weatherData.hasOwnProperty('error')) {
            weatherEmbed.setDescription(errors.uErr.weather.api);
            logWeatherError(errors.uErr.weather.api);
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
            const predictedWeatherFr = func.weatherCodeToString(dailyData.weathercode[0]);
            const usePredictWeather = predictedWeatherFr.string != weatherAtmfr.string ? true : false;

            const windDir = func.windToDirection(curData.winddirection);
            const maxWindDir = func.windToDirection(dailyData.winddirection_10m_dominant[0]);

            // - => S or W
            let latSide: 'N' | 'S' = 'N';
            let lonSide: 'E' | 'W' = 'E';

            if (location.latitude < 0) {
                latSide = 'S';
            }
            if (location.longitude < 0) {
                lonSide = 'W';
            }

            const windGraph = await func.graph(weatherData.hourly.time, weatherData.hourly.windspeed_10m, `Wind speed (${weatherData.hourly_units.windspeed_10m})`,
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
            const tempGraph = await func.graph(weatherData.hourly.time, weatherData.hourly.temperature_2m, `Temperature (${weatherData.hourly_units.temperature_2m})`,
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
            const precGraph = await func.graph(weatherData.hourly.time, weatherData.hourly.precipitation_probability, `(${weatherData.hourly_units.precipitation_probability}) Chance of Precipitation`,
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


            weatherEmbed
                .setFooter({ text: `input: ${name}` })
                .setTitle(`Weather for ${location.name}`);

            const fields: Discord.EmbedField[] = [
                {
                    name: `Information`,
                    value: `
${location.admin1 + ',' ?? ''} ${location.country} :flag_${location.country_code.toLowerCase()}:
Location: (${Math.abs(location.latitude) + latSide}, ${Math.abs(location.longitude) + lonSide})
Time (local): ${localTime} 
Time (UTC): ${utctime}
${weatherData.current_weather.is_day == 0 ? '🌒Nighttime' : '☀Daytime'}
Status: ${weatherAtmfr.icon} ${weatherAtmfr.string} ${usePredictWeather ?
                            '(' + predictedWeatherFr.icon + ' ' + predictedWeatherFr.string + ' predicted)'
                            : ''}
Sunrise: ${dailyData.sunrise[0]}
Sunset: ${dailyData.sunset[0]}
`,
                    inline: false
                },
                {
                    name: `Temperature`,
                    value: `
Current: ${curData.temperature}${weatherUnits.temperature_2m_max}
Min: ${dailyData.temperature_2m_min[0]}${weatherUnits.temperature_2m_max}
Max: ${dailyData.temperature_2m_max[0]}${weatherUnits.temperature_2m_max}
`,
                    inline: true
                },
                {
                    name: `Precipitation`,
                    value: `
Probability: (${dailyData.precipitation_probability_min}% - ${dailyData.precipitation_probability_max}%)
${dailyData.rain_sum[0] > 0 ? `Rain: ${dailyData.rain_sum[0]}${weatherUnits.rain_sum}\n` : ''}${dailyData.showers_sum[0] > 0 ? `Showers: ${dailyData.showers_sum[0]}${weatherUnits.showers_sum}\n` : ''}${dailyData.snowfall_sum[0] > 0 ? `Snowfall: ${dailyData.snowfall_sum[0]}${weatherUnits.snowfall_sum}\n` : ''}${dailyData.precipitation_sum[0] > 0 ? `Total: ${dailyData.precipitation_sum[0]}${weatherUnits.precipitation_sum}\n` : ''}${dailyData.precipitation_hours[0] > 0 ? `Hours: ${dailyData.precipitation_hours[0]}${weatherUnits.precipitation_hours}\n` : ''}`,
                    inline: true
                },
                {
                    name: `Wind`,
                    value: `
Current: ${curData.windspeed}${weatherUnits.windspeed_10m_max} ${windDir.short}${windDir.emoji} (${curData.winddirection}°)
Max speed: ${dailyData.windspeed_10m_max[0]}${weatherUnits.windspeed_10m_max}
Max Gusts: ${dailyData.windgusts_10m_max[0]}${weatherUnits.windgusts_10m_max}
Dominant Direction: ${maxWindDir.short}${maxWindDir.emoji} (${dailyData.winddirection_10m_dominant[0]}°)
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
            files: useFiles
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

export async function tropicalWeather(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let system: string;
    let type: 'active' | 'storm' | 'features' = 'active';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
    }
    if (input.overrides != null) {
        system = input.overrides.id as string;
        type = 'storm';
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'TropicalWeather',
        options: [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'System',
                value: system
            },
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    let weatherData: othertypes.tropicalData;
    if (func.findFile(input.absoluteID, `storm-${system}-tropicalWeatherData`) &&
        !('error' in func.findFile(input.absoluteID, `storm-${system}-tropicalWeatherData`)) &&
        input.button != 'Refresh'
    ) {
        weatherData = func.findFile(input.absoluteID, `storm-${system}-tropicalWeatherData`);
    } else {
        weatherData = await func.getTropical(input.config, type, system);
    }
    func.storeFile(weatherData, input.absoluteID, `${type}${type == 'storm' ? '-' + (weatherData?.data as othertypes.tsData)?.id : ''}-tropicalWeatherData`);
    const embed = new Discord.EmbedBuilder();
    let useComponents = [];
    let useAttach = [];
    const worldmapPath = `${precomppath}\\files\\img\\map\\base.png`;
    let exInf = '';
    switch (type) {
        case 'active': default: {
            await picker();
            embed.setTitle(`Currently Active Tropical Storms`);
            //create image
            let frimg: Discord.AttachmentBuilder = new Discord.AttachmentBuilder(worldmapPath);
            const xLen = 1437;
            const yLen = 720;
            const xFactor = xLen / 180 / 2;
            const yFactor = yLen / 90 / 2;
            async function doShitTw() {
                return new Promise((resolve, reject) => {
                    try {
                        jimp.default.read(worldmapPath).then(async (image) => {
                            image.brightness(-0.75);
                            if ((weatherData?.data as othertypes.tsShort[]).length == 0) {
                                image.print(await jimp.default.loadFont(jimp.default.FONT_SANS_64_WHITE), (xLen / 2), (yLen / 2), {
                                    text: `NO STORMS FOUND`,
                                    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER
                                },
                                    720, 50
                                );
                                resolve(true);
                            } else {
                                exInf = `\nStorm locations shown are approximate`;
                                for (const storm of weatherData?.data as othertypes.tsShort[]) {
                                    let tempData: othertypes.tropicalData;
                                    if (func.findFile(`${storm.id}`, 'storm-tropicalweatherdata') &&
                                        !('error' in func.findFile(`${storm.id}`, 'storm-tropicalweatherdata')) &&
                                        input.button != 'Refresh'
                                    ) {
                                        tempData = func.findFile(`${storm.id}`, 'storm-tropicalweatherdata');
                                    } else {
                                        tempData = await func.getTropical(input.config, 'storm', storm.id);
                                    }
                                    const inTempData = tempData.data as othertypes.tsData;
                                    func.storeFile((tempData as othertypes.tsData), `${(inTempData as othertypes.tsData).id}`, `storm-tropicalWeatherData`);
                                    const curx = inTempData.position[0];
                                    const cury = inTempData.position[1];

                                    image.print(await jimp.default.loadFont(jimp.default.FONT_SANS_16_WHITE), (xLen / 2) + (curx * xFactor), (yLen / 2) - (cury * yFactor), {
                                        text: `X\n${storm.id.slice(4, inTempData.id.length)}`,
                                        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
                                        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
                                    },
                                        720, 50
                                    );
                                }
                            }
                            await image.writeAsync(`${path}\\cache\\commandData\\genStormMap-${input.absoluteID}.png`);
                            resolve(true);
                        });
                    } catch (err) {
                        console.log(err);
                        resolve(false);
                    }
                });
            };
            const aaaeee = await doShitTw();
            if (aaaeee === true) {
                try {
                    frimg = new Discord.AttachmentBuilder(`${path}\\cache\\commandData\\genStormMap-${input.absoluteID}.png`);
                    useAttach = [frimg];
                    embed.setImage(`attachment://genStormMap-${input.absoluteID}.png`);
                } catch (err) {
                    useAttach = [];
                }
            }
        }
            break;
        case 'storm': {
            await embeddify();
        } break;
    }

    async function picker() {
        const data = weatherData?.data as othertypes.tsShort[];
        if (data.length > 0) {
            const Tnames: string[] = [];
            for (const x of (weatherData?.data as othertypes.tsShort[])) {
                let first = x.name;
                let second;
                async function doNames(x) {
                    return new Promise(async (resolve, reject) => {
                        let first = calc.toCapital(x.name);
                        let tempData: othertypes.tropicalData;
                        if (func.findFile(`${x.id}`, 'storm-tropicalweatherdata') &&
                            !('error' in func.findFile(`${x.id}`, 'storm-tropicalweatherdata')) &&
                            input.button != 'Refresh'
                        ) {
                            tempData = func.findFile(`${x.id}`, 'storm-tropicalweatherdata');
                        } else {
                            tempData = await func.getTropical(input.config, 'storm', x.id);
                        }
                        const inTempData = tempData.data as othertypes.tsData;
                        func.storeFile((tempData as othertypes.tsData), `${(inTempData as othertypes.tsData).id}`, `storm-tropicalweatherdata`);
                        if (inTempData?.category) {
                            second = inTempData?.category.toUpperCase() + ' ' + first;
                        }
                        resolve(true);
                    });
                }
                const l = await doNames(x);
                if (calc.checkIsNumber(x.name)) {
                    first = x.id.slice(4, x.id.length);
                    second = x.id.slice(4, x.id.length);
                }
                else if (!x.id.includes(x.name)) {
                    first += ` (${x.id.slice(4, x.id.length)})`;
                    second += ` (${x.id.slice(4, x.id.length)})`;
                }
                if (l === true) {
                    Tnames.push(second);
                } else {
                    Tnames.push(first);
                }
            }
            const tempTxt = (Tnames.length > 0 ? Tnames.join(', ') : 'err') + exInf;
            embed.setDescription(tempTxt);
            const inputModal = new Discord.StringSelectMenuBuilder()
                .setCustomId(`${mainconst.version}-Select-tropicalweather-${commanduser.id}-${input.absoluteID}`)
                .setPlaceholder('Select a storm');

            for (let i = 0; i < data.length && i < 25; i++) {
                const current = data[i];

                const altName = current.id.slice(4, current.id.length);
                const fullname = calc.checkIsNumber(current.name) ? altName : current.name;

                inputModal.addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setLabel(`#${i + 1} | ${fullname}`)
                        .setDescription(altName)
                        .setValue(`${current.id}`)
                );
            }
            const buttons = new Discord.ActionRowBuilder();
            buttons.addComponents(inputModal);
            useComponents = [buttons];
        } else {
            embed.setDescription('No currently active tropical storms found.');
        }

    }

    async function embeddify() {
        const data = weatherData?.data as othertypes.tsData;
        const catData = func.tsCatToString(data.category.toLowerCase());
        const basin = func.tsBasinToString(data.basin);
        const basinType = func.tsBasinToType(data.basin);
        const hurname = basinType == 'Cyclone' ?
            catData.name_auid : basinType == 'Typhoon' ? catData.name_asia :
                catData.name;
        const windDir = func.windToDirection(data.movement.bearing, true);
        const altName = data.id.slice(4, data.id.length);
        const fullname = calc.checkIsNumber(data.name) ? altName :
            `${data.name} (${altName})`;

        const pcatData = func.tsCatToString(data.max_observed_category.toLowerCase());
        const phurname = basinType == 'Cyclone' ?
            pcatData.name_auid : basinType == 'Typhoon' ? pcatData.name_asia :
                pcatData.name;

        const localtype = '';

        let tempPos = [];
        if (data.position[0] > 1) {
            tempPos.push('E');
        } else {
            tempPos.push('W');
        }
        if (data.position[1] > 1) {
            tempPos.push('N');
        } else {
            tempPos.push('S');
        }

        const pos = `${Math.abs(data.position[0])}${tempPos[0]}, ${Math.abs(data.position[1])}${tempPos[1]}`;
        // switch (basin) {
        //     case 'North Atlantic': case 'Northeast Pacific': case 'Central Pacific':
        //         localtype = func.tsNameSSHWS(data.movement.KPH) + ' (SSHWS)';
        //         break;
        //     case 'Northwest Pacific':
        //         localtype = func.tsNameJMA(data.movement.KPH) + ' (JMA)';
        //         break;
        //     case 'Southwest Pacific':
        //         localtype = func.tsNameATCIS(data.movement.KPH) + ' (Australian scale)';
        //         break;
        //     case 'South Indian Ocean':
        //         localtype = func.tsNameMFR(data.movement.KPH) + '( Météo-France)';
        //         break;
        //     case 'North Indian Ocean': case 'Arabian Sea': case 'Bay of Bengal':
        //         localtype = func.tsNameIMD(data.movement.KPH) + ' (IMD)';
        //         break;
        // }


        embed.setTitle(`${hurname} ${fullname}`)
            .setDescription(`Location: ${basin} Basin (${pos})
Direction: ${windDir.emoji} ${data.movement.KPH}km/h ${data.movement.MPH}mi/h ${data.movement.KTS}kt/s
Peak: ${phurname}
`)
            .setImage(`https://www.force-13.com/floaters/${altName.replace('N', 'L')}/imagery/rb-animated.gif`)
            .setURL(`https://www.force-13.com/satellite?flt=${altName.replace('N', 'L')}`)
            //.png
            //-animated.gif
            /**
             * types
             * visible: vis
             * true colour: true
             * shortwave ir: 
             * rgb:
             * 
             */
            .setColor(colourfunc.hexToDec(`#${catData.colour}`))
            ;
    }


    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
            components: useComponents,
            files: useAttach,
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'TropicalWeather',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'TropicalWeather',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}