import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'convert',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides) {
        let commanduser;
        let cat1;
        let cat2;
        let num;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                cat1 = args[0]
                cat2 = args[1]
                num = parseFloat(args[2])
                if (!args[0]) {
                    cat1 = 'help'
                }
                if (!args[1]) {
                    cat2 = 'help'
                }
                if (isNaN(parseFloat(num))) {
                    num = 0
                }
                if (!args[2]) {
                    num = 0
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                cat1 = obj.options.getString('from')
                cat2 = obj.options.getString('to')
                num = obj.options.getNumber('number')
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-convert-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-convert-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-convert-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-convert-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'convert',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [
                    {
                        name: 'from',
                        value: cat1
                    },
                    {
                        name: 'to',
                        value: cat2
                    },
                    {
                        name: 'number',
                        value: `${num}`
                    }
                ]
            ), 'utf-8')

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
                convtype = `${cat1} to ${cat2}`
                eq = `did you really just convert ${cat1.toLowerCase()} to ${cat2.toLowerCase()}? smh my head`
                formula = `None. You're stupid.`
                //
                break;
            //temperature
            case (cat1 == 'f' || cat1 == 'fahrenheit') && (cat2 == 'c' || cat2 == 'celsius' || cat2 == 'celcius'):
                //console.log('success')
                conv = 'Temperature conversion'
                convtype = 'Farhenheit to Celsius'
                eq = `${num}f => ${Math.abs((num - 32) * 5 / 9)}c`
                formula = '`((x)-32)*5/9`'


                break;
            case (cat1 == 'f' || cat1 == 'fahrenheit') && (cat2 == 'k' || cat2 == 'kelvin'):
                conv = 'Temperature conversion'
                convtype = 'Farhenheit to Kelvin'
                eq = `${num}f => ${Math.abs((num - 32) * 5 / 9 + 273.15)}c`
                formula = `((x)-32)*5/9 + 273.15`


                break;
            case (cat1 == 'c' || cat1 == 'celsius' || cat1 == 'celcius') && (cat2 == 'f' || cat2 == 'fahrenheit'):
                conv = 'Temperature conversion'
                convtype = 'Celsius to Farhenheit'
                eq = `${num}c => ${Math.abs(num * 9 / 5 + 32)}f`
                formula = '`x*9/5+32`'


                break;
            case (cat1 == 'c' || cat1 == 'celsius' || cat1 == 'celcius') && (cat2 == 'k' || cat2 == 'kelvin'):
                conv = 'Temperature conversion'
                convtype = 'Celsius to Kelvin'
                eq = `${num}c => ${Math.abs(num + 273.15)}k`
                formula = '`x+273.15`'


                break;
            case (cat1 == 'k' || cat1 == 'kelvin') && (cat2 == 'c' || cat2 == 'celsius' || cat2 == 'celcius'):
                conv = 'Temperature conversion'
                convtype = 'Kelvin to Celsius'
                eq = `${num}k => ${Math.abs(num - 273.15)}x`
                formula = '`x-273.15`'

                break;
            case (cat1 == 'k' || cat1 == 'kelvin') && (cat2 == 'f' || cat2 == 'fahrenheit'):
                conv = 'Temperature conversion'
                convtype = 'Kelvin to Farhenheit'
                eq = `${num}k => ${Math.abs((num - 273.15) * 9 / 5 + 32)}f`
                formula = '`(x-273.15)*9/5+32`'

                break;




            //distance
            case (cat1 == 'in' || cat1 == 'inch') && (cat2 == 'ft' || cat2 == 'feet'):
                conv = 'Distance conversion'
                convtype = 'Inches to Feet'
                eq = `${num}in => ${num / 12}ft`
                formula = '`x/12`'

                break;
            case (cat1 == 'in' || cat1 == 'inch') && (cat2 == 'm' || cat2 == 'metres'):
                conv = 'Distance conversion'
                convtype = 'Inches to Metres'
                eq = `${num}in => ${Math.abs(num / 39.37)}m`
                formula = '`x/39.37`'

                break;
            case (cat1 == 'in' || cat1 == 'inch') && (cat2 == 'mi' || cat2 == 'miles'):
                conv = 'Distance conversion'
                convtype = 'Inches to Miles'
                eq = `${num}in => ${Math.abs(num / 63360)}mi`
                formula = '`x/63360`'

                break;

            case (cat1 == 'ft' || cat1 == 'feet') && (cat2 == 'in' || cat2 == 'inch'):
                conv = 'Distance conversion'
                convtype = 'Feet to Inches'
                eq = `${num}ft => ${num * 12}in`
                formula = '`x*12`'

                break;
            case (cat1 == 'ft' || cat1 == 'feet') && (cat2 == 'm' || cat2 == 'metres'):
                conv = 'Distance conversion'
                convtype = 'Feet to Metres'
                eq = `${num}ft => ${Math.abs(num / 3.28084)}m`
                formula = '`x/3.28084` (approx)'

                break;
            case (cat1 == 'ft' || cat1 == 'feet') && (cat2 == 'mi' || cat2 == 'miles'):
                conv = 'Distance conversion'
                convtype = 'Feet to Miles'
                eq = `${num}ft => ${Math.abs(num / 5280)}mi`
                formula = '`x/5280`'

                break;

            case (cat1 == 'm' || cat1 == 'metres') && (cat2 == 'in' || cat2 == 'inch'):
                conv = 'Distance conversion'
                convtype = 'Metres to Inches'
                eq = `${num}m => ${num * 39.37}in`
                formula = '`x*39.37`'

                break;
            case (cat1 == 'm' || cat1 == 'metres') && (cat2 == 'ft' || cat2 == 'feet'):
                conv = 'Distance conversion'
                convtype = 'Metres to Feet'
                eq = `${num}m => ${num * 3.28084}ft`
                formula = '`x*3.28084`'

                break;
            case (cat1 == 'm' || cat1 == 'metres') && (cat2 == 'mi' || cat2 == 'miles'):
                conv = 'Distance conversion'
                convtype = 'Metres to Miles'
                eq = `${num}m => ${num / 1609.344}mi`
                formula = '`x/1609.344`'

                break;

            case (cat1 == 'mi' || cat1 == 'miles') && (cat2 == 'in' || cat2 == 'inch'):
                conv = 'Distance conversion'
                convtype = 'Miles to Inches'
                eq = `${num}mi => ${num * 63360}in`
                formula = '`x*63360`'

                break;
            case (cat1 == 'mi' || cat1 == 'miles') && (cat2 == 'ft' || cat2 == 'feet'):
                conv = 'Distance conversion'
                convtype = 'Miles to Feet'
                eq = `${num}mi => ${num * 5280}ft`
                formula = '`x*5280`'

                break;
            case (cat1 == 'mi' || cat1 == 'miles') && (cat2 == 'm' || cat2 == 'metres'):
                conv = 'Distance conversion'
                convtype = 'Miles to Metres'
                eq = `${num}mi => ${num * 1609.344}m`
                formula = '`x*1609.344`'

                break;


            //time
            case ((cat1 == 's' || cat1 == 'seconds' || cat1 == 'secs') && cat2 == 'min' || cat2 == 'minutes'):
                console.log(cat1 == 's')
                console.log(cat2 == 'min')
                conv = 'Time conversion'
                convtype = 'Seconds to Minutes'
                eq = `${num}s => ${num / 60}min`
                formula = '`x/60`'

                break;
            case ((cat1 == 's' || cat1 == 'seconds' || cat1 == 'secs') && cat2 == 'h' || cat2 == 'hours' || cat2 == 'hr'):
                conv = 'Time conversion'
                convtype = 'Seconds to Hours'
                eq = `${num}s => ${num / 60 / 60}h`
                formula = '`x/60/60`'
                break;
            case ((cat1 == 's' || cat1 == 'seconds' || cat1 == 'secs') && cat2 == 'd' || cat2 == 'days'):
                conv = 'Time conversion'
                convtype = 'Seconds to Days'
                eq = `${num}s => ${num / 60 / 60 / 24} days`
                formula = '`x/60/60/24`'
                break;

            case ((cat1 == 's' || cat1 == 'seconds' || cat1 == 'secs') && cat2 == 'y' || cat2 == 'years' || cat2 == 'yr'):
                conv = 'Time conversion'
                convtype = 'Seconds to Years'
                eq = `${num}s => ${num / 60 / 60 / 24 / 365.24}y`
                formula = '`x/60/60/365.24`'
                break;

            case (cat1 == 'min' || cat1 == 'minutes') && (cat2 == 's' || cat2 == 'seconds' || cat2 == 'secs'):
                conv = 'Time conversion'
                convtype = 'Minutes to Seconds'
                eq = `${num}min => ${num * 60}s`
                formula = '`x*60`'
                break;

            case (cat1 == 'min' || cat1 == 'minutes') && (cat2 == 'h' || cat2 == 'hours' || cat2 == 'hr'):
                conv = 'Time conversion'
                convtype = 'Minutes to Hours'
                eq = `${num}min => ${num / 60}h`
                formula = '`x/60`'
                break;

            case (cat1 == 'min' || cat1 == 'minutes') && (cat2 == 'd' || cat2 == 'days'):
                conv = 'Time conversion'
                convtype = 'Minutes to Days'
                eq = `${num}min => ${num / 60 / 24} days`
                formula = '`x/60/24`'
                break;

            case (cat1 == 'min' || cat1 == 'minutes') && (cat2 == 'y' || cat2 == 'years' || cat2 == 'yr'):
                conv = 'Time conversion'
                convtype = 'Minutes to Years'
                eq = `${num}min => ${num / 60 / 24 / 365.24}y`
                formula = '`x/60/24/365.24`'
                break;


            case (cat1 == 'h' || cat1 == 'hours' || cat1 == 'hr') && (cat2 == 's' || cat2 == 'seconds' || cat2 == 'secs'):
                conv = 'Time conversion'
                convtype = 'Hours to Seconds'
                eq = `${num}h => ${num * 60 * 60}s`
                formula = '`x*60*60`'
                break;

            case (cat1 == 'h' || cat1 == 'hours' || cat1 == 'hr') && (cat2 == 'min' || cat2 == 'minutes'):
                conv = 'Time conversion'
                convtype = 'Hours to Minutes'
                eq = `${num}h => ${num * 60}min`
                formula = '`x*60`'

                break;
            case (cat1 == 'h' || cat1 == 'hours' || cat1 == 'hr') && (cat2 == 'd' || cat2 == 'days'):
                conv = 'Time conversion'
                convtype = 'Hours to Days'
                eq = `${num}h => ${num / 24} days`
                formula = '`x/24`'

                break;
            case (cat1 == 'h' || cat1 == 'hours' || cat1 == 'hr') && (cat2 == 'y' || cat2 == 'years' || cat2 == 'yr'):
                conv = 'Time conversion'
                convtype = 'Hours to Years'
                eq = `${num}h => ${num / 24 / 365.24}y`
                formula = '`x/24/365.24`'

                break;


            case (cat1 == 'd' || cat1 == 'days') && (cat2 == 's' || cat2 == 'seconds' || cat2 == 'secs'):
                conv = 'Time conversion'
                convtype = 'Days to Seconds'
                eq = `${num} days => ${num * 24 * 60 * 60}s`
                formula = '`x*24*60*60`'

                break;
            case (cat1 == 'd' || cat1 == 'days') && (cat2 == 'min' || cat2 == 'minutes'):
                conv = 'Time conversion'
                convtype = 'Days to Minutes'
                eq = `${num} days => ${num * 24 * 60}min`
                formula = '`x*24*60`'

                break;
            case (cat1 == 'd' || cat1 == 'days') && (cat2 == 'h' || cat2 == 'hours' || cat2 == 'hr'):
                conv = 'Time conversion'
                convtype = 'Days to Hours'
                eq = `${num} days => ${num * 24}h`
                formula = '`x*24`'

                break;
            case (cat1 == 'd' || cat1 == 'days') && (cat2 == 'y' || cat2 == 'years' || cat2 == 'yr'):
                conv = 'Time conversion'
                convtype = 'Days to Years'
                eq = `${num} days => ${num / 365.24}y`
                formula = '`x/365.24`'

                break;


            case (cat1 == 'y' || cat1 == 'years' || cat1 == 'yr') && (cat2 == 's' || cat2 == 'seconds' || cat2 == 'secs'):
                conv = 'Time conversion'
                convtype = 'Years to Seconds'
                eq = `${num}y => ${num * 365.24 * 24 * 60 * 60}s`
                formula = '`x*365.24*24*60*60`'

                break;
            case (cat1 == 'y' || cat1 == 'years' || cat1 == 'yr') && (cat2 == 'min' || cat2 == 'minutes'):
                conv = 'Time conversion'
                convtype = 'Years to Minutes'
                eq = `${num}y => ${num * 365.24 * 24 * 60}min`
                formula = '`x*365.24*24*60`'

                break;
            case (cat1 == 'y' || cat1 == 'years' || cat1 == 'yr') && (cat2 == 'h' || cat2 == 'hours' || cat1 == 'hr'):
                conv = 'Time conversion'
                convtype = 'Years to Hours'
                eq = `${num}y => ${num * 365.24 * 24}h`
                formula = '`x*365.24*24`'

                break;
            case (cat1 == 'y' || cat1 == 'years' || cat1 == 'yr') && (cat2 == 'd' || cat2 == 'days'):
                conv = 'Time conversion'
                convtype = 'Years to Days'
                eq = `${num}y => ${num * 365.24} days`
                formula = '`x*365.24`'

                break;




            //volume
            case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'cup'):
                conv = 'Volume conversion'
                convtype = 'Fluid Ounces to Cups'
                eq = `${num}fl.oz => ${num / 8.11537} cup`
                formula = '~`x/8.11537'

                break;
            case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'pt' || cat2 == 'pint'):
                conv = 'Volume conversion'
                convtype = 'Fluid Ounces to Pints'
                eq = `${num}fl.oz => ${num / 16}pt`
                formula = '`x/16`'

                break;
            case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'l' || cat2 == 'litres'):
                conv = 'Volume conversion'
                convtype = 'Fluid Ounces to Litres'
                eq = `${num}fl.oz => ${num / 33.814}l`
                formula = '`x/33.814`'

                break;
            case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'gal' || cat2 == 'gallons'):
                conv = 'Volume conversion'
                convtype = 'Fluid Ounces to Gallons'
                eq = `${num}fl.oz => ${num / 128}gal`
                formula = 'x/128``'

                break;
            case (cat1 == 'floz' || cat1 == 'fluidounces') && (cat2 == 'm3'):
                conv = 'Volume conversion'
                convtype = 'Fluid Ounces to Cubic Metres'
                eq = `${num}fl.oz => ${num / 33814}m^3`
                formula = '`x/33814`'

                break;


            case (cat1 == 'cup') && (cat2 == 'floz' || cat2 == 'fluidounces'):
                conv = 'Volume conversion'
                convtype = 'Cups to Fluid Ounces'
                eq = `${num} cup => ${num * 8.11537}fl.oz`
                formula = '~`x*8.11537`'

                break;
            case (cat1 == 'cup') && (cat2 == 'pt' || cat2 == 'pint'):
                conv = 'Volume conversion'
                convtype = 'Cups to Pints'
                eq = `${num} cup => ${num / 1.972}pt`
                formula = '~`x/1.972`'

                break;
            case (cat1 == 'cup') && (cat2 == 'l' || cat2 == 'litres'):
                conv = 'Volume conversion'
                convtype = 'Cups to Litres'
                eq = `${num} cup => ${num / 4.167}l`
                formula = '~`x/4.167`'

                break;
            case (cat1 == 'cup') && (cat2 == 'gal' || cat2 == 'gallons'):
                conv = 'Volume conversion'
                convtype = 'Cups to Gallons'
                eq = `${num} cup => ${num / 15.722}gal`
                formula = '~`x/15.722`'

                break;
            case (cat1 == 'cup') && (cat2 == 'm3'):
                conv = 'Volume conversion'
                convtype = 'Cups to Cubic Metres'
                eq = `${num} cup => ${num / 4167}m^3`
                formula = '~`x/4166.67`'

                break;


            case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'floz' || cat2 == 'fluidounces'):
                conv = 'Volume conversion'
                convtype = 'Pints to Fluid Ounces'
                eq = `${num}pt => ${num * 16}fl.oz`
                formula = '`x*16`'

                break;
            case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'cup'):
                conv = 'Volume conversion'
                convtype = 'Pints to Cups'
                eq = `${num}pt => ${num * 1.97157} cup`
                formula = '~`x*1.97157`'

                break;
            case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'l' || cat2 == 'litres'):
                conv = 'Volume conversion'
                convtype = 'Pints to Litres'
                eq = `${num}pt => ${num / 2.11338}l`
                formula = '`x/2.11338`'

                break;
            case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'gal' || cat2 == 'gallons'):
                conv = 'Volume conversion'
                convtype = 'Pints to Gallons'
                eq = `${num}pt => ${num / 8}gal`
                formula = '`x/8`'

                break;
            case (cat1 == 'pt' || cat1 == 'pints') && (cat2 == 'm3'):
                conv = 'Volume conversion'
                convtype = 'Pints to Cubic Metres'
                eq = `${num}pt => ${num / 2113.37810957}`
                formula = '`x/2113.37810957`'

                break;


            case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'floz' || cat2 == 'fluidounces'):
                conv = 'Volume conversion'
                convtype = 'Litres to Fluid Ounces'
                eq = `${num}l => ${num * 33.814}fl.oz`
                formula = '`x*33.814`'

                break;
            case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'cup'):
                conv = 'Volume conversion'
                convtype = 'Litres to Cups'
                eq = `${num}l => ${num * 4.16667} cup`
                formula = '`x*4.16667`'

                break;
            case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'pt' || cat2 == 'pint'):
                conv = 'Volume conversion'
                convtype = 'Litres to Pints'
                eq = `${num}l => ${num * 2.11338}pt`
                formula = '`x*2.11338`'

                break;
            case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'gal' || cat2 == 'gallons'):
                conv = 'Volume conversion'
                convtype = 'Litres to Gallons'
                eq = `${num} => ${num / 3.78541}gal`
                formula = '`x/3.78541`'

                break;
            case (cat1 == 'l' || cat1 == 'litres') && (cat2 == 'm3'):
                conv = 'Volume conversion'
                convtype = 'Litres to Cubic Metres'
                eq = `${num}l => ${num / 1000}m^3`
                formula = '`x/1000`'

                break;


            case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'floz' || cat2 == 'fluidounces'):
                conv = 'Volume conversion'
                convtype = 'Gallons to Fluid Ounces'
                eq = `${num}gal => ${num * 128}fl.oz`
                formula = '`x*128`'

                break;
            case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'cup'):
                conv = 'Volume conversion'
                convtype = 'Gallons to Cups'
                eq = `${num}gal => ${num * 15.7725} cup`
                formula = '`x*15.7725`'

                break;
            case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'pt' || cat2 == 'pint'):
                conv = 'Volume conversion'
                convtype = 'Gallons to Pints'
                eq = `${num}gal => ${num * 8}pt`
                formula = '`x*8`'

                break;
            case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'l' || cat2 == 'litres'):
                conv = 'Volume conversion'
                convtype = 'Gallons to Litres'
                eq = `${num}gal => ${num * 3.78541}l`
                formula = '`x*3.78541`'

                break;
            case (cat1 == 'gal' || cat1 == 'gallons') && (cat2 == 'm3'):
                conv = 'Volume conversion'
                convtype = 'Gallons to Cubic Metres'
                eq = `${num}gal => ${num / 264.1722636962499564}m^3`
                formula = '`x/264.1722636962499564`'

                break;


            case (cat1 == 'm3') && (cat2 == 'floz' || cat2 == 'fluidounces'):
                conv = 'Volume conversion'
                convtype = 'Cubic Metres to Fluid Ounces'
                eq = `${num}m^3 => ${num * 33814}fl.oz`
                formula = '`x*33814`'

                break;
            case (cat1 == 'm3') && (cat2 == 'cup'):
                conv = 'Volume conversion'
                convtype = 'Cubic Metres to Cups'
                eq = `${num}m^3 => ${num * 4166.67} cup`
                formula = '`x*4166.67`'

                break;
            case (cat1 == 'm3') && (cat2 == 'pt' || cat2 == 'pint'):
                conv = 'Volume conversion'
                convtype = 'Cubic Metres to Pints'
                eq = `${num}m^3 => ${num * 2113.37810957}pt`
                formula = '`x*2113.37810957`'

                break;
            case (cat1 == 'm3') && (cat2 == 'l' || cat2 == 'litres'):
                conv = 'Volume conversion'
                convtype = 'Cubic Metres to Litres'
                eq = `${num}m^3 => ${num * 1000}l`
                formula = '`x*1000`'

                break;
            case (cat1 == 'm3') && (cat2 == 'gal' || cat2 == 'gallons'):
                conv = 'Volume conversion'
                convtype = 'Cubic Metres to Gallons'
                eq = `${num}m^3 => ${num * 264.1722636962499564}gal`
                formula = '`x*264.1722636962499564`'

                break;




            //mass
            case (cat1 == 'g' || cat1 == 'grams') && (cat2 == 'oz' || cat2 == 'ounces'):
                conv = 'Mass conversion'
                convtype = 'Grams to Ounces'
                eq = `${num}g => ${num / 28.3495}oz`
                formula = '`x/28.3495`'

                break;
            case (cat1 == 'g' || cat1 == 'grams') && (cat2 == 'lb' || cat2 == 'pounds'):
                conv = 'Mass conversion'
                convtype = 'Grams to Pounds'
                eq = `${num}g => ${num / 453.592}lb`
                formula = '`x/453.592`'

                break;
            case (cat1 == 'g' || cat1 == 'grams') && (cat2 == 'ton' || cat2 == 'tonnes'):
                conv = 'Mass conversion'
                convtype = 'Grams to Tonnes'
                eq = `${num}g => ${num / (10 ** 6)}ton`
                formula = '`x/10^6 (1,000,000)'

                break;


            case (cat1 == 'oz' || cat1 == 'ounces') && (cat2 == 'g' || cat2 == 'grams'):
                conv = 'Mass conversion'
                convtype = 'Ounces to Grams'
                eq = `${num}oz => ${num * 28.3495}g`
                formula = '`x*28.3495`'

                break;
            case (cat1 == 'oz' || cat1 == 'ounces') && (cat2 == 'lb' || cat2 == 'pounds'):
                conv = 'Mass conversion'
                convtype = 'Ounces to Pounds'
                eq = `${num}oz => ${num / 16}lb`
                formula = '`x/16`'

                break;
            case (cat1 == 'oz' || cat1 == 'ounces') && (cat2 == 'ton' || cat2 == 'tonnes'):
                conv = 'Mass conversion'
                convtype = 'Ounces to Tonnes'
                eq = `${num}oz => ${num / 35274}ton`
                formula = '`x/35274`'

                break;


            case (cat1 == 'lb' || cat1 == 'pounds') && (cat2 == 'g' || cat2 == 'grams'):
                conv = 'Mass conversion'
                convtype = 'Pounds to Grams'
                eq = `${num}lb => ${num * 453.592}g`
                formula = '`x*453.592`'

                break;
            case (cat1 == 'lb' || cat1 == 'pounds') && (cat2 == 'oz' || cat2 == 'ounces'):
                conv = 'Mass conversion'
                convtype = 'Pounds to Ounces'
                eq = `${num}lb => ${num * 16}oz`
                formula = '`x*16`'

                break;
            case (cat1 == 'lb' || cat1 == 'pounds') && (cat2 == 'ton' || cat2 == 'tonnes'):
                conv = 'Mass conversion'
                convtype = 'Pounds to Tonnes'
                eq = `${num}lb => ${num / 2204.62504693}ton`
                formula = '`x/2204.62504693`'

                break;


            case (cat1 == 'ton' || cat1 == 'tonnes') && (cat2 == 'g' || cat2 == 'grams'):
                conv = 'Mass conversion'
                convtype = 'Tonnes to Grams'
                eq = `${num}ton => ${num * (10 ** 6)}g`
                formula = '`x*10^6 (1,000,000)`'
                break;
            case (cat1 == 'ton' || cat1 == 'tonnes') && (cat2 == 'oz' || cat2 == 'ounces'):
                conv = 'Mass conversion'
                convtype = 'Tonnes to Ounces'
                eq = `${num}ton => ${num * 35274}oz`
                formula = '`x*35274`'
                break;
            case (cat1 == 'ton' || cat1 == 'tonnes') && (cat2 == 'lb' || cat2 == 'pounds'):
                conv = 'Mass conversion'
                convtype = 'Tonnes to Pounds'
                eq = `${num}ton => ${num * 2204.62504693}lb`
                formula = '`x*2204.62504693`'
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
                conv = 'Error'
                convtype = 'Error'
                eq = 'Invalid conversion or it hasn\'t been added yet'
                formula = '`x`'
                useEmbeds.push(EmbedList)

        }

        embedres.setTitle(`${conv}`)
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
        ])
        useEmbeds.push(embedres)
        if (cat1 == 'help' || cat2 == 'help') {
            useEmbeds = [EmbedList];
        }
        if (cat1 == 'metricprefixes' || cat2 == 'metricprefixes') {
            useEmbeds = [siEmbed];
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: '',
                    embeds: useEmbeds,
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: '',
                    embeds: useEmbeds,
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }



        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}