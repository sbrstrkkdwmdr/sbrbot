import * as Discord from 'discord.js';
import * as fs from 'fs';
import moment from 'moment';
import * as replayparser from 'osureplayparser';
import pkgjson from '../package.json' assert { type: 'json' };
import { path } from '../path.js';
import * as calc from '../src/calc.js';
import * as cmdchecks from '../src/checks.js';
import * as colourfunc from '../src/colourcalc.js';
import * as buttonsthing from '../src/consts/buttons.js';
import * as colours from '../src/consts/colours.js';
import * as def from '../src/consts/defaults.js';
import * as emojis from '../src/consts/emojis.js';
import * as helpinfo from '../src/consts/helpinfo.js';
import * as mainconst from '../src/consts/main.js';
import * as timezoneList from '../src/consts/timezones.js';
import * as embedStuff from '../src/embed.js';
import * as log from '../src/log.js';
import * as osufunc from '../src/osufunc.js';
import * as osumodcalc from '../src/osumodcalc.js';
import * as func from '../src/tools.js';
import * as extypes from '../src/types/extraTypes.js';
import * as osuApiTypes from '../src/types/osuApiTypes.js';
import * as msgfunc from './msgfunc.js';

/**
 * convert a value
 */
export async function convert(input: extypes.commandInput) {

    let commanduser;
    let cat1;
    let cat2;
    let num;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            cat1 = input.args[0];
            cat2 = input.args[1];
            num = parseFloat(input.args[2]);
            if (!input.args[0]) {
                cat1 = 'help';
            }
            if (!input.args[1]) {
                cat2 = 'help';
            }
            if (isNaN(parseFloat(num))) {
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

            cat1 = input.obj.options.getString('from');

            cat2 = input.obj.options.getString('to');

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
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const EmbedList = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('List of measurements')

        .addFields([
            {
                name: 'Temperature',
                value: 'c (celcius) | f (fahrenheit) | k (kelvin)',
                inline: false
            },
            {
                name: 'Distance',
                value: 'in (inch) | fe (feet) | m (metres) | mi (miles)',
                inline: false
            },
            {
                name: 'Time',
                value: 'ms (milliseconds) | s (seconds) | min (minutes) | h (hours) | d (days) | y (years)',
                inline: false
            },
            {
                name: 'Volume',
                value: 'l (litres) | floz (fluid ounces) | cup | pt (pint) | gal (gallons)',
                inline: false
            },
            {
                name: 'Mass',
                value: 'g (grams) | oz (ounces) | lb (pounds) | ton (metric tonnes)',
                inline: false
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
Y  | yotta | 10^24 | Septillion  | 1,000,000,000,000,000,000,000,000
Z  | zetta | 10^21 | Sextillion  | 1,000,000,000,000,000,000,000
E  | exa   | 10^18 | Quintillion | 1,000,000,000,000,000,000
P  | peta  | 10^15 | Quadrillion | 1,000,000,000,000,000
T  | tera  | 10^12 | Trillion    | 1,000,000,000,000
G  | giga  | 10^9  | Billion     | 1,000,000,000
M  | mega  | 10^6  | Million     | 1,000,000
k  | kilo  | 10^3  | Thousand    | 1,000
h  | hecto | 10^2  | Hundred     | 100
da | deca  | 10^1  | Ten         | 10
\``,
                inline: false
            },
            {
                name: 'Decrements',
                value:
                    `\`
d | deci  | 10^-1  | Tenth         | 0.1
c | centi | 10^-2  | Hundredth     | 0.01
m | milli | 10^-3  | Thousandth    | 0.001
μ | micro | 10^-6  | Millionth     | 0.000 001
n | nano  | 10^-9  | Billionth     | 0.000 000 001 
p | pico  | 10^-12 | Trillionth    | 0.000 000 000 001
f | femto | 10^-15 | Quadrillionth | 0.000 000 000 000 001
a | atto  | 10^-18 | Quintillionth | 0.000 000 000 000 000 001
z | zepto | 10^-21 | Sextillionth  | 0.000 000 000 000 000 000 001
y | yocto | 10^-24 | Septillionth  | 0.000 000 000 000 000 000 000 001
\``,
                inline: false
            }
        ]);
    const embedres = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setDescription('⠀');

    let useEmbeds = [];

    let conv;
    let convtype = `${cat1} to ${cat2}`;
    let eq;
    let formula;

    switch (true) {
        case (cat1 == cat2):
            conv = 'No conversion';
            convtype = `${cat1} to ${cat2}`;
            eq = `did you really just convert ${cat1.toLowerCase()} to ${cat2.toLowerCase()}? smh my head`;
            formula = `None. You're stupid.`;
            break;

        //temperature
        case (cat1 == 'f' || cat1 == 'fahrenheit') && (cat2 == 'c' || cat2 == 'celsius' || cat2 == 'celcius'):
            conv = 'Temperature conversion';
            convtype = 'Farhenheit to Celsius';
            eq = `${num}f => ${(num - 32) * 5 / 9}c`;
            formula = '`((x)-32)*5/9`';
            break;
        case (cat1 == 'f' || cat1 == 'fahrenheit') && (cat2 == 'k' || cat2 == 'kelvin'):
            conv = 'Temperature conversion';
            convtype = 'Farhenheit to Kelvin';
            eq = `${num}f => ${(num - 32) * 5 / 9 + 273.15}c`;
            formula = `((x)-32)*5/9 + 273.15`;
            break;
        case (cat1 == 'c' || cat1 == 'celsius' || cat1 == 'celcius') && (cat2 == 'f' || cat2 == 'fahrenheit'):
            conv = 'Temperature conversion';
            convtype = 'Celsius to Farhenheit';
            eq = `${num}c => ${num * 9 / 5 + 32}f`;
            formula = '`x*9/5+32`';
            break;
        case (cat1 == 'c' || cat1 == 'celsius' || cat1 == 'celcius') && (cat2 == 'k' || cat2 == 'kelvin'):
            conv = 'Temperature conversion';
            convtype = 'Celsius to Kelvin';
            eq = `${num}c => ${num + 273.15}k`;
            formula = '`x+273.15`';
            break;
        case (cat1 == 'k' || cat1 == 'kelvin') && (cat2 == 'c' || cat2 == 'celsius' || cat2 == 'celcius'):
            conv = 'Temperature conversion';
            convtype = 'Kelvin to Celsius';
            eq = `${num}k => ${num - 273.15}c`;
            formula = '`x-273.15`';
            break;
        case (cat1 == 'k' || cat1 == 'kelvin') && (cat2 == 'f' || cat2 == 'fahrenheit'):
            conv = 'Temperature conversion';
            convtype = 'Kelvin to Farhenheit';
            eq = `${num}k => ${(num - 273.15) * 9 / 5 + 32}f`;
            formula = '`(x-273.15)*9/5+32`';
            break;




        //distance
        case (cat1 == 'in' || cat1 == 'inch') && (cat2 == 'ft' || cat2 == 'feet'):
            conv = 'Distance conversion';
            convtype = 'Inches to Feet';
            eq = `${num}in => ${num / 12}ft`;
            formula = '`x/12`';
            break;
        case (cat1 == 'in' || cat1 == 'inch') && (cat2 == 'm' || cat2 == 'metres'):
            conv = 'Distance conversion';
            convtype = 'Inches to Metres';
            eq = `${num}in => ${num / 39.37}m`;
            formula = '`x/39.37`';
            break;
        case (cat1 == 'in' || cat1 == 'inch') && (cat2 == 'mi' || cat2 == 'miles'):
            conv = 'Distance conversion';
            convtype = 'Inches to Miles';
            eq = `${num}in => ${num / 63360}mi`;
            formula = '`x/63360`';
            break;

        case (cat1 == 'ft' || cat1 == 'feet') && (cat2 == 'in' || cat2 == 'inch'):
            conv = 'Distance conversion';
            convtype = 'Feet to Inches';
            eq = `${num}ft => ${num * 12}in`;
            formula = '`x*12`';
            break;
        case (cat1 == 'ft' || cat1 == 'feet') && (cat2 == 'm' || cat2 == 'metres'):
            conv = 'Distance conversion';
            convtype = 'Feet to Metres';
            eq = `${num}ft => ${num / 3.28084}m`;
            formula = '`x/3.28084` (approx)';
            break;
        case (cat1 == 'ft' || cat1 == 'feet') && (cat2 == 'mi' || cat2 == 'miles'):
            conv = 'Distance conversion';
            convtype = 'Feet to Miles';
            eq = `${num}ft => ${num / 5280}mi`;
            formula = '`x/5280`';
            break;

        case (cat1 == 'm' || cat1 == 'metres') && (cat2 == 'in' || cat2 == 'inch'):
            conv = 'Distance conversion';
            convtype = 'Metres to Inches';
            eq = `${num}m => ${num * 39.37}in`;
            formula = '`x*39.37`';
            break;
        case (cat1 == 'm' || cat1 == 'metres') && (cat2 == 'ft' || cat2 == 'feet'):
            conv = 'Distance conversion';
            convtype = 'Metres to Feet';
            eq = `${num}m => ${num * 3.28084}ft`;
            formula = '`x*3.28084`';
            break;
        case (cat1 == 'm' || cat1 == 'metres') && (cat2 == 'mi' || cat2 == 'miles'):
            conv = 'Distance conversion';
            convtype = 'Metres to Miles';
            eq = `${num}m => ${num / 1609.344}mi`;
            formula = '`x/1609.344`';
            break;

        case (cat1 == 'mi' || cat1 == 'miles') && (cat2 == 'in' || cat2 == 'inch'):
            conv = 'Distance conversion';
            convtype = 'Miles to Inches';
            eq = `${num}mi => ${num * 63360}in`;
            formula = '`x*63360`';
            break;
        case (cat1 == 'mi' || cat1 == 'miles') && (cat2 == 'ft' || cat2 == 'feet'):
            conv = 'Distance conversion';
            convtype = 'Miles to Feet';
            eq = `${num}mi => ${num * 5280}ft`;
            formula = '`x*5280`';
            break;
        case (cat1 == 'mi' || cat1 == 'miles') && (cat2 == 'm' || cat2 == 'metres'):
            conv = 'Distance conversion';
            convtype = 'Miles to Metres';
            eq = `${num}mi => ${num * 1609.344}m`;
            formula = '`x*1609.344`';
            break;


        //time
        case ((cat1 == 's' || cat1 == 'seconds' || cat1 == 'secs') && cat2 == 'min' || cat2 == 'minutes'):
            conv = 'Time conversion';
            convtype = 'Seconds to Minutes';
            eq = `${num}s => ${num / 60}min`;
            formula = '`x/60`';
            break;
        case ((cat1 == 's' || cat1 == 'seconds' || cat1 == 'secs') && cat2 == 'h' || cat2 == 'hours' || cat2 == 'hr'):
            conv = 'Time conversion';
            convtype = 'Seconds to Hours';
            eq = `${num}s => ${num / 60 / 60}h`;
            formula = '`x/60/60`';
            break;
        case ((cat1 == 's' || cat1 == 'seconds' || cat1 == 'secs') && cat2 == 'd' || cat2 == 'days'):
            conv = 'Time conversion';
            convtype = 'Seconds to Days';
            eq = `${num}s => ${num / 60 / 60 / 24} days`;
            formula = '`x/60/60/24`';
            break;

        case ((cat1 == 's' || cat1 == 'seconds' || cat1 == 'secs') && cat2 == 'y' || cat2 == 'years' || cat2 == 'yr'):
            conv = 'Time conversion';
            convtype = 'Seconds to Years';
            eq = `${num}s => ${num / 60 / 60 / 24 / 365.24}y`;
            formula = '`x/60/60/365.24`';
            break;

        case (cat1 == 'min' || cat1 == 'minutes') && (cat2 == 's' || cat2 == 'seconds' || cat2 == 'secs'):
            conv = 'Time conversion';
            convtype = 'Minutes to Seconds';
            eq = `${num}min => ${num * 60}s`;
            formula = '`x*60`';
            break;

        case (cat1 == 'min' || cat1 == 'minutes') && (cat2 == 'h' || cat2 == 'hours' || cat2 == 'hr'):
            conv = 'Time conversion';
            convtype = 'Minutes to Hours';
            eq = `${num}min => ${num / 60}h`;
            formula = '`x/60`';
            break;

        case (cat1 == 'min' || cat1 == 'minutes') && (cat2 == 'd' || cat2 == 'days'):
            conv = 'Time conversion';
            convtype = 'Minutes to Days';
            eq = `${num}min => ${num / 60 / 24} days`;
            formula = '`x/60/24`';
            break;

        case (cat1 == 'min' || cat1 == 'minutes') && (cat2 == 'y' || cat2 == 'years' || cat2 == 'yr'):
            conv = 'Time conversion';
            convtype = 'Minutes to Years';
            eq = `${num}min => ${num / 60 / 24 / 365.24}y`;
            formula = '`x/60/24/365.24`';
            break;


        case (cat1 == 'h' || cat1 == 'hours' || cat1 == 'hr') && (cat2 == 's' || cat2 == 'seconds' || cat2 == 'secs'):
            conv = 'Time conversion';
            convtype = 'Hours to Seconds';
            eq = `${num}h => ${num * 60 * 60}s`;
            formula = '`x*60*60`';
            break;

        case (cat1 == 'h' || cat1 == 'hours' || cat1 == 'hr') && (cat2 == 'min' || cat2 == 'minutes'):
            conv = 'Time conversion';
            convtype = 'Hours to Minutes';
            eq = `${num}h => ${num * 60}min`;
            formula = '`x*60`';
            break;
        case (cat1 == 'h' || cat1 == 'hours' || cat1 == 'hr') && (cat2 == 'd' || cat2 == 'days'):
            conv = 'Time conversion';
            convtype = 'Hours to Days';
            eq = `${num}h => ${num / 24} days`;
            formula = '`x/24`';
            break;
        case (cat1 == 'h' || cat1 == 'hours' || cat1 == 'hr') && (cat2 == 'y' || cat2 == 'years' || cat2 == 'yr'):
            conv = 'Time conversion';
            convtype = 'Hours to Years';
            eq = `${num}h => ${num / 24 / 365.24}y`;
            formula = '`x/24/365.24`';
            break;


        case (cat1 == 'd' || cat1 == 'days') && (cat2 == 's' || cat2 == 'seconds' || cat2 == 'secs'):
            conv = 'Time conversion';
            convtype = 'Days to Seconds';
            eq = `${num} days => ${num * 24 * 60 * 60}s`;
            formula = '`x*24*60*60`';
            break;
        case (cat1 == 'd' || cat1 == 'days') && (cat2 == 'min' || cat2 == 'minutes'):
            conv = 'Time conversion';
            convtype = 'Days to Minutes';
            eq = `${num} days => ${num * 24 * 60}min`;
            formula = '`x*24*60`';

            break;
        case (cat1 == 'd' || cat1 == 'days') && (cat2 == 'h' || cat2 == 'hours' || cat2 == 'hr'):
            conv = 'Time conversion';
            convtype = 'Days to Hours';
            eq = `${num} days => ${num * 24}h`;
            formula = '`x*24`';

            break;
        case (cat1 == 'd' || cat1 == 'days') && (cat2 == 'y' || cat2 == 'years' || cat2 == 'yr'):
            conv = 'Time conversion';
            convtype = 'Days to Years';
            eq = `${num} days => ${num / 365.24}y`;
            formula = '`x/365.24`';
            break;


        case (cat1 == 'y' || cat1 == 'years' || cat1 == 'yr') && (cat2 == 's' || cat2 == 'seconds' || cat2 == 'secs'):
            conv = 'Time conversion';
            convtype = 'Years to Seconds';
            eq = `${num}y => ${num * 365.24 * 24 * 60 * 60}s`;
            formula = '`x*365.24*24*60*60`';
            break;
        case (cat1 == 'y' || cat1 == 'years' || cat1 == 'yr') && (cat2 == 'min' || cat2 == 'minutes'):
            conv = 'Time conversion';
            convtype = 'Years to Minutes';
            eq = `${num}y => ${num * 365.24 * 24 * 60}min`;
            formula = '`x*365.24*24*60`';
            break;
        case (cat1 == 'y' || cat1 == 'years' || cat1 == 'yr') && (cat2 == 'h' || cat2 == 'hours' || cat1 == 'hr'):
            conv = 'Time conversion';
            convtype = 'Years to Hours';
            eq = `${num}y => ${num * 365.24 * 24}h`;
            formula = '`x*365.24*24`';

            break;
        case (cat1 == 'y' || cat1 == 'years' || cat1 == 'yr') && (cat2 == 'd' || cat2 == 'days'):
            conv = 'Time conversion';
            convtype = 'Years to Days';
            eq = `${num}y => ${num * 365.24} days`;
            formula = '`x*365.24`';
            break;




        //volume
        case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'cup'):
            conv = 'Volume conversion';
            convtype = 'Fluid Ounces to Cups';
            eq = `${num}fl.oz => ${num / 8.11537} cup`;
            formula = '~`x/8.11537';
            break;
        case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'pt' || cat2 == 'pint'):
            conv = 'Volume conversion';
            convtype = 'Fluid Ounces to Pints';
            eq = `${num}fl.oz => ${num / 16}pt`;
            formula = '`x/16`';
            break;
        case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'l' || cat2 == 'litres'):
            conv = 'Volume conversion';
            convtype = 'Fluid Ounces to Litres';
            eq = `${num}fl.oz => ${num / 33.814}l`;
            formula = '`x/33.814`';

            break;
        case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'gal' || cat2 == 'gallons'):
            conv = 'Volume conversion';
            convtype = 'Fluid Ounces to Gallons';
            eq = `${num}fl.oz => ${num / 128}gal`;
            formula = 'x/128``';
            break;
        case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'm3'):
            conv = 'Volume conversion';
            convtype = 'Fluid Ounces to Cubic Metres';
            eq = `${num}fl.oz => ${num / 33814}m^3`;
            formula = '`x/33814`';

            break;


        case (cat1 == 'cup') && (cat2 == 'floz' || cat2 == 'fluidounces'):
            conv = 'Volume conversion';
            convtype = 'Cups to Fluid Ounces';
            eq = `${num} cup => ${num * 8.11537}fl.oz`;
            formula = '~`x*8.11537`';
            break;
        case (cat1 == 'cup') && (cat2 == 'pt' || cat2 == 'pint'):
            conv = 'Volume conversion';
            convtype = 'Cups to Pints';
            eq = `${num} cup => ${num / 1.972}pt`;
            formula = '~`x/1.972`';
            break;
        case (cat1 == 'cup') && (cat2 == 'l' || cat2 == 'litres'):
            conv = 'Volume conversion';
            convtype = 'Cups to Litres';
            eq = `${num} cup => ${num / 4.167}l`;
            formula = '~`x/4.167`';
            break;
        case (cat1 == 'cup') && (cat2 == 'gal' || cat2 == 'gallons'):
            conv = 'Volume conversion';
            convtype = 'Cups to Gallons';
            eq = `${num} cup => ${num / 15.722}gal`;
            formula = '~`x/15.722`';
            break;
        case (cat1 == 'cup') && (cat2 == 'm3'):
            conv = 'Volume conversion';
            convtype = 'Cups to Cubic Metres';
            eq = `${num} cup => ${num / 4167}m^3`;
            formula = '~`x/4166.67`';
            break;


        case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'floz' || cat2 == 'fluidounces'):
            conv = 'Volume conversion';
            convtype = 'Pints to Fluid Ounces';
            eq = `${num}pt => ${num * 16}fl.oz`;
            formula = '`x*16`';
            break;
        case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'cup'):
            conv = 'Volume conversion';
            convtype = 'Pints to Cups';
            eq = `${num}pt => ${num * 1.97157} cup`;
            formula = '~`x*1.97157`';
            break;
        case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'l' || cat2 == 'litres'):
            conv = 'Volume conversion';
            convtype = 'Pints to Litres';
            eq = `${num}pt => ${num / 2.11338}l`;
            formula = '`x/2.11338`';
            break;
        case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'gal' || cat2 == 'gallons'):
            conv = 'Volume conversion';
            convtype = 'Pints to Gallons';
            eq = `${num}pt => ${num / 8}gal`;
            formula = '`x/8`';
            break;
        case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'm3'):
            conv = 'Volume conversion';
            convtype = 'Pints to Cubic Metres';
            eq = `${num}pt => ${num / 2113.37810957}`;
            formula = '`x/2113.37810957`';
            break;


        case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'floz' || cat2 == 'fluidounces'):
            conv = 'Volume conversion';
            convtype = 'Litres to Fluid Ounces';
            eq = `${num}l => ${num * 33.814}fl.oz`;
            formula = '`x*33.814`';
            break;
        case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'cup'):
            conv = 'Volume conversion';
            convtype = 'Litres to Cups';
            eq = `${num}l => ${num * 4.16667} cup`;
            formula = '`x*4.16667`';
            break;
        case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'pt' || cat2 == 'pint'):
            conv = 'Volume conversion';
            convtype = 'Litres to Pints';
            eq = `${num}l => ${num * 2.11338}pt`;
            formula = '`x*2.11338`';
            break;
        case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'gal' || cat2 == 'gallons'):
            conv = 'Volume conversion';
            convtype = 'Litres to Gallons';
            eq = `${num} => ${num / 3.78541}gal`;
            formula = '`x/3.78541`';
            break;
        case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'm3'):
            conv = 'Volume conversion';
            convtype = 'Litres to Cubic Metres';
            eq = `${num}l => ${num / 1000}m^3`;
            formula = '`x/1000`';
            break;


        case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'floz' || cat2 == 'fluidounces'):
            conv = 'Volume conversion';
            convtype = 'Gallons to Fluid Ounces';
            eq = `${num}gal => ${num * 128}fl.oz`;
            formula = '`x*128`';
            break;
        case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'cup'):
            conv = 'Volume conversion';
            convtype = 'Gallons to Cups';
            eq = `${num}gal => ${num * 15.7725} cup`;
            formula = '`x*15.7725`';
            break;
        case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'pt' || cat2 == 'pint'):
            conv = 'Volume conversion';
            convtype = 'Gallons to Pints';
            eq = `${num}gal => ${num * 8}pt`;
            formula = '`x*8`';
            break;
        case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'l' || cat2 == 'litres'):
            conv = 'Volume conversion';
            convtype = 'Gallons to Litres';
            eq = `${num}gal => ${num * 3.78541}l`;
            formula = '`x*3.78541`';
            break;
        case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'm3'):
            conv = 'Volume conversion';
            convtype = 'Gallons to Cubic Metres';
            eq = `${num}gal => ${num / 264.1722636962499564}m^3`;
            formula = '`x/264.1722636962499564`';
            break;


        case (cat1 == 'm3') && (cat2 == 'floz' || cat2 == 'fluidounces'):
            conv = 'Volume conversion';
            convtype = 'Cubic Metres to Fluid Ounces';
            eq = `${num}m^3 => ${num * 33814}fl.oz`;
            formula = '`x*33814`';
            break;
        case (cat1 == 'm3') && (cat2 == 'cup'):
            conv = 'Volume conversion';
            convtype = 'Cubic Metres to Cups';
            eq = `${num}m^3 => ${num * 4166.67} cup`;
            formula = '`x*4166.67`';
            break;
        case (cat1 == 'm3') && (cat2 == 'pt' || cat2 == 'pint'):
            conv = 'Volume conversion';
            convtype = 'Cubic Metres to Pints';
            eq = `${num}m^3 => ${num * 2113.37810957}pt`;
            formula = '`x*2113.37810957`';
            break;
        case (cat1 == 'm3') && (cat2 == 'l' || cat2 == 'litres'):
            conv = 'Volume conversion';
            convtype = 'Cubic Metres to Litres';
            eq = `${num}m^3 => ${num * 1000}l`;
            formula = '`x*1000`';
            break;
        case (cat1 == 'm3') && (cat2 == 'gal' || cat2 == 'gallons'):
            conv = 'Volume conversion';
            convtype = 'Cubic Metres to Gallons';
            eq = `${num}m^3 => ${num * 264.1722636962499564}gal`;
            formula = '`x*264.1722636962499564`';
            break;




        //mass
        case (cat1 == 'g' || cat1 == 'grams') && (cat2 == 'oz' || cat2 == 'ounces'):
            conv = 'Mass conversion';
            convtype = 'Grams to Ounces';
            eq = `${num}g => ${num / 28.3495}oz`;
            formula = '`x/28.3495`';
            break;
        case (cat1 == 'g' || cat1 == 'grams') && (cat2 == 'lb' || cat2 == 'pounds'):
            conv = 'Mass conversion';
            convtype = 'Grams to Pounds';
            eq = `${num}g => ${num / 453.592}lb`;
            formula = '`x/453.592`';
            break;
        case (cat1 == 'g' || cat1 == 'grams') && (cat2 == 'ton' || cat2 == 'tonnes'):
            conv = 'Mass conversion';
            convtype = 'Grams to Tonnes';
            eq = `${num}g => ${num / (10 ** 6)}ton`;
            formula = '`x/10^6 (1,000,000)';
            break;


        case (cat1 == 'oz' || cat1 == 'ounces') && (cat2 == 'g' || cat2 == 'grams'):
            conv = 'Mass conversion';
            convtype = 'Ounces to Grams';
            eq = `${num}oz => ${num * 28.3495}g`;
            formula = '`x*28.3495`';
            break;
        case (cat1 == 'oz' || cat1 == 'ounces') && (cat2 == 'lb' || cat2 == 'pounds'):
            conv = 'Mass conversion';
            convtype = 'Ounces to Pounds';
            eq = `${num}oz => ${num / 16}lb`;
            formula = '`x/16`';
            break;
        case (cat1 == 'oz' || cat1 == 'ounces') && (cat2 == 'ton' || cat2 == 'tonnes'):
            conv = 'Mass conversion';
            convtype = 'Ounces to Tonnes';
            eq = `${num}oz => ${num / 35274}ton`;
            formula = '`x/35274`';
            break;


        case (cat1 == 'lb' || cat1 == 'pounds') && (cat2 == 'g' || cat2 == 'grams'):
            conv = 'Mass conversion';
            convtype = 'Pounds to Grams';
            eq = `${num}lb => ${num * 453.592}g`;
            formula = '`x*453.592`';
            break;
        case (cat1 == 'lb' || cat1 == 'pounds') && (cat2 == 'oz' || cat2 == 'ounces'):
            conv = 'Mass conversion';
            convtype = 'Pounds to Ounces';
            eq = `${num}lb => ${num * 16}oz`;
            formula = '`x*16`';
            break;
        case (cat1 == 'lb' || cat1 == 'pounds') && (cat2 == 'ton' || cat2 == 'tonnes'):
            conv = 'Mass conversion';
            convtype = 'Pounds to Tonnes';
            eq = `${num}lb => ${num / 2204.62504693}ton`;
            formula = '`x/2204.62504693`';
            break;


        case (cat1 == 'ton' || cat1 == 'tonnes') && (cat2 == 'g' || cat2 == 'grams'):
            conv = 'Mass conversion';
            convtype = 'Tonnes to Grams';
            eq = `${num}ton => ${num * (10 ** 6)}g`;
            formula = '`x*10^6 (1,000,000)`';
            break;
        case (cat1 == 'ton' || cat1 == 'tonnes') && (cat2 == 'oz' || cat2 == 'ounces'):
            conv = 'Mass conversion';
            convtype = 'Tonnes to Ounces';
            eq = `${num}ton => ${num * 35274}oz`;
            formula = '`x*35274`';
            break;
        case (cat1 == 'ton' || cat1 == 'tonnes') && (cat2 == 'lb' || cat2 == 'pounds'):
            conv = 'Mass conversion';
            convtype = 'Tonnes to Pounds';
            eq = `${num}ton => ${num * 2204.62504693}lb`;
            formula = '`x*2204.62504693`';
            break;
        //template
        /*
        case (cat1 && cat2):
            embedres.setTitle()
            eq=`${num} => ${num}`
            formula='`x`'
            
            break;
        */
        default:
            conv = 'Error';
            convtype = 'Error';
            eq = 'Invalid conversion or it hasn\'t been added yet';
            formula = 'null';
            useEmbeds.push(EmbedList);
            if (!cat2 || !num) {
                eq = `Missing arguments: 
${cat2 ? '' : '[to]'}
${num ? '' : '[number]'}`;
            }
            break;

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
            value: formula,
            inline: false
        }
    ]);
    useEmbeds.push(embedres);
    if (cat1 == 'help' || cat2 == 'help') {
        useEmbeds = [EmbedList];
    }
    if (cat1 == 'metricprefixes' || cat2 == 'metricprefixes') {
        useEmbeds = [siEmbed];
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'convert',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        ]
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

    function commandEmb(command: helpinfo.commandInfo, embed) {

        let desc = '';
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
                const res = helpinfo.cmds.find(obj => obj.name == fetchcmd);
                commandEmb(res, commandInfo);
            } else if (helpinfo.cmds.find(obj => obj.aliases.includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'gen';
                const res = helpinfo.cmds.find(obj => obj.aliases.includes(fetchcmd));
                commandEmb(res, commandInfo);
            }
            else if (helpinfo.othercmds.find(obj => obj.name == fetchcmd)) {
                commandfound = true;
                commandCategory = 'misc';
                const res = helpinfo.othercmds.find(obj => obj.name == fetchcmd);
                commandEmb(res, commandInfo);
            } else if (helpinfo.othercmds.find(obj => obj.aliases.includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'misc';
                const res = helpinfo.othercmds.find(obj => obj.aliases.includes(fetchcmd));
                commandEmb(res, commandInfo);
            }

            else if (helpinfo.osucmds.find(obj => obj.name == fetchcmd)) {
                commandfound = true;
                commandCategory = 'osu';
                const res = helpinfo.osucmds.find(obj => obj.name == fetchcmd);
                commandEmb(res, commandInfo);
            } else if (helpinfo.osucmds.find(obj => obj.aliases.includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'osu';
                const res = helpinfo.osucmds.find(obj => obj.aliases.includes(fetchcmd));
                commandEmb(res, commandInfo);
            }

            else if (helpinfo.admincmds.find(obj => obj.name == fetchcmd)) {
                commandfound = true;
                commandCategory = 'admin';
                const res = helpinfo.admincmds.find(obj => obj.name == fetchcmd);
                commandEmb(res, commandInfo);
            } else if (helpinfo.admincmds.find(obj => obj.aliases.includes(fetchcmd))) {
                commandfound = true;
                commandCategory = 'admin';
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'help',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        options: []
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'info',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        commandName: 'COMMANDNAME',
        options: []
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'invite',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let equation = 'null';

    if (type == 'basic') {
        const string = input.args.join(' ');
        const evalstr = eval(cmdchecks.toMath(string).toString().replaceAll('^', '**').replaceAll('pi', 'Math.PI').toString()).toString();
        equation = evalstr;
    } else if (type == 'help') {
        equation = `-
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'math',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        options: []
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
    });
}

/**
 * set reminder
 */
export async function remind(input: extypes.commandInput) {

    let commanduser;

    let time;
    let remindertxt;
    let sendtochannel;
    let user;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            time = input.args[0];
            remindertxt = input.args.join(' ').replaceAll(input.args[0], '');
            sendtochannel = false;
            user = input.obj.author;

            if (!input.args[0]) {
                return await msgfunc.sendMessage({
                    commandType: input.commandType,
                    obj: input.obj,
                    args: {
                        content: 'Please specify a time'
                    }
                }, input.canReply);

            }
            if (!input.args[1]) {
                remindertxt = 'null';
            }
            if (!input.args[0].endsWith('d') && !input.args[0].endsWith('h') && !input.args[0].endsWith('m') && !input.args[0].endsWith('s') && !time.includes(':') && !time.includes('.')) {
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
                (cmdchecks.isOwner(commanduser.id) || cmdchecks.isAdmin(commanduser.id, input.obj.guildId, input.client)) ?

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
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    async function sendremind(reminder, time, obj, sendchannel, remindertxt, usersent) {
        try {
            if (sendchannel == true) {
                setTimeout(() => {
                    input.obj.channel.send({ content: `Reminder for <@${usersent.id}> \n${remindertxt}` });

                }, calc.timeToMs(time));
            }
            else {
                setTimeout(() => {
                    usersent.send({ embeds: [reminder] });

                }, calc.timeToMs(time));
            }
        } catch (error) {
            console.log('embed error' + 'time:' + time + '\ntxt:' + remindertxt);
        }
    }
    const reminder = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('REMINDER')
        .setDescription(`${remindertxt}`);

    sendremind(reminder, time, input.obj, sendtochannel, remindertxt, user);

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage(
        {
            commandType: input.commandType,
            obj: input.obj,
            args: {
                react: true
            }
        }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'remind',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'remind',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        options: []
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'stats',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
        });
    }
}

/**
 * get timezone
 */
export async function time(input: extypes.commandInput) {

    let commanduser;

    let fetchtimezone;
    let displayedTimezone;

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
            fetchtimezone = input?.overrides?.ex;
        }
        if (input?.overrides?.id) {
            displayedTimezone = input?.overrides?.id ?? fetchtimezone;
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
        ]
    });
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const currentDate = new Date();

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
                `\n\`Full Date         | \`${curTime.format("ddd, DDD MMM YYYY hh:mm:ssA Z")}` +
                `\n\`Full Date(24h)    | \`${curTime.format("ddd, DDD MMM YYYY HH:mm:ss Z")}` +
                `\n\`Full Date ISO8601 | \`${curTime.toISOString(true)}` +
                `\n\`EPOCH(ms)         | \`${curTime.valueOf()}`,
            inline: false
        },
    ];


    const Embed = new Discord.EmbedBuilder()
        .setColor(colours.embedColour.info.dec)
        .setTitle('Current Time');
    if (fetchtimezone != null && fetchtimezone != '') {
        try {
            let offset = 0;
            const found: timezoneList.timezone[] = [];
            for (let i = 0; i < timezoneList.timezones.length; i++) {
                const curTimeZone = timezoneList.timezones[i];
                if (curTimeZone.aliases.includes(fetchtimezone.toUpperCase())) {
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

            if (useComponents.length == 0) {
                if (input?.overrides?.overwriteModal) {

                }
            }

            const offsetToMinutes = Math.floor(offset * 60);

            const reqTime = moment().utcOffset(offsetToMinutes);

            const Hrs = offset > 0 ?
                Math.floor(offset).toString().padStart(3, '+0') :
                Math.floor(offset).toString().replace('-', '').padStart(3, '-0');

            const offsetReadable = `UTC${Hrs}:${(Math.abs(offsetToMinutes % 60)).toString().padStart(2, '0')}`;

            fields.push({
                name: `${displayedTimezone.toUpperCase()}/${offsetReadable}`,
                value:
                    `\n\`Date              | \`${reqTime.format("DD/MM/YYYY")}` +
                    `\n\`Full Date         | \`${reqTime.format("ddd, DDD MMM YYYY hh:mm:ssA Z")}` +
                    `\n\`Full Date(24h)    | \`${reqTime.format("ddd, DDD MMM YYYY HH:mm:ss Z")}` +
                    `\n\`Full Date ISO8601 | \`${reqTime.toISOString(true)}` +
                    `\n\`EPOCH(ms)         | \`${curTime.valueOf()}`,

                inline: false
            });
        } catch (error) {
            console.log(error);
            showGMT = true;
            if (error.includes('timezone')) {
                fields.push({
                    name: `UTC/GMT +??:?? (Requested Time)`,
                    value: `\nRecived invalid timezone!` +
                        `\n\`${fetchtimezone}\` is not a valid timezone` +
                        `\n Check [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#UTC_offset) for valid timezones`
                    // `\nCheck [here](https://www.iana.org/time-zones) or [here](https://stackoverflow.com/a/54500197) for valid timezones`
                    ,
                    inline: false
                });
            } else {
                fields.push({
                    name: `UTC/GMT +??:?? (Requested Time)`,
                    value: `There was an error trying to parse the timezone`,
                    inline: false
                });
            }
            useComponents = [];
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'time',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
        });
    }

}