import fs = require('fs')
import fetch = require('node-fetch')

module.exports = {
    name: 'convert',
    description: 'null',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button) {
        /*         let Embedhelp = new Discord.EmbedBuilder()
                    .setTitle('w')
                    .addField('**Formula**', 'c>f = convert celcius to fahrenheit', false)
                    .addField('**math stuff idk**', '* = multiply\n/ = divide\n- = subtract\n+ = add\n^ = power', false)
                    ; */
        let EmbedList = new Discord.EmbedBuilder()
            .setTitle('List of measurements')
            /*             .addField('Temperature', `c (celsius), f (fahnrenheit), k (kelvin)`, false)
                        .addField('Distance', 'in (inch), fe (feet), m (metres), mi (miles)', false)
                        .addField('Time', '(WIP) ms (milliseconds), s (seconds), min (minutes), h (hours), d (days), y (years) ', false)
                        .addField('Volume', '(WIP) l (litres)', false)
                        .addField('Mass', '(WIP) kg (kilograms)', false)
                        .addField('Non-measurements', 'help, metricprefixes', false) */
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
        let siEmbed = new Discord.EmbedBuilder()
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
        let embedres = new Discord.EmbedBuilder()
            .setDescription('⠀');
        if (message != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - convert (message)\n${currentDate} | ${currentDateISO}\n recieved convert command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            message.reply({ content: 'Just use the slash command', allowedMentions: { repliedUser: false } })
            /*             switch (args[0]) {
                default:
                    message.channel.send({ embeds: [Embedhelp, EmbedList] })
                    break;
            } */
        }
        if (interaction != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - convert (interaction)\n${currentDate} | ${currentDateISO}\n recieved convert command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let cat1 = interaction.options.getString('from')
            let cat2 = interaction.options.getString('to')
            let num = interaction.options.getNumber('number')
            embedres.setDescription('NOTE: NEGATIVES ARE SHOWN AS POSITIVE NUMBERS')

            let conv = '??? conversion'
            let convtype = `${cat1} to ${cat2}` //x => y
            let eq = `??? type => ??? type`//'num type => num type'
            let formula = 'x'

            if (cat1 == 'help' || cat2 == 'help') {
                interaction.reply({ embeds: [EmbedList], allowedMentions: { repliedUser: false } })
                return;
            }
            if (cat1 == 'metricprefixes' || cat2 == 'metricprefixes') {
                interaction.reply({ embeds: [siEmbed], allowedMentions: { repliedUser: false } })
                return;
            }


            switch (true) {
                case (cat1 == cat2):
                    let msg = `did you really just convert ${cat1.toLowerCase()} to ${cat2.toLowerCase()}? smh my head`
                    interaction.reply(msg)
                    //
                    break;
                //temperature
                case (cat1 == 'f' && cat2 == 'c'):
                    //console.log('success')
                    conv = 'Temperature conversion'
                    convtype = 'Farhenheit to Celsius'
                    eq = `${num}f => ${Math.abs((num - 32) * 5 / 9)}c`
                    formula = '`((x)-32)*5/9`'


                    break;
                case (cat1 == 'f' && cat2 == 'k'):
                    conv = 'Temperature conversion'
                    eq = `${num}f => ${Math.abs((num - 32) * 5 / 9 + 273.15)}c`
                    formula = `((x)-32)*5/9 + 273.15`


                    break;
                case (cat1 == 'c' && cat2 == 'f'):
                    conv = 'Temperature conversion'
                    eq = `${num}c => ${Math.abs(num * 9 / 5 + 32)}f`
                    formula = '`x*9/5+32`'


                    break;
                case (cat1 == 'c' && cat2 == 'k'):
                    conv = 'Temperature conversion'
                    eq = `${num}c => ${Math.abs(num + 273.15)}k`
                    formula = '`x+273.15`'


                    break;
                case (cat1 == 'k' && cat2 == 'c'):
                    conv = 'Temperature conversion'
                    eq = `${num}k => ${Math.abs(num - 273.15)}x`
                    formula = '`x-273.15`'

                    break;
                case (cat1 == 'k' && cat2 == 'f'):
                    conv = 'Temperature conversion'
                    eq = `${num}k => ${Math.abs((num - 273.15) * 9 / 5 + 32)}f`
                    formula = '`(x-273.15)*9/5+32`'

                    break;




                //distance
                case (cat1 == 'in' && cat2 == 'ft'):
                    conv = 'Distance conversion'
                    eq = `${num}in => ${num / 12}ft`
                    formula = '`x/12`'

                    break;
                case (cat1 == 'in' && cat2 == 'm'):
                    conv = 'Distance conversion'
                    eq = `${num}in => ${Math.abs(num / 39.37)}m`
                    formula = '`x/39.37`'

                    break;
                case (cat1 == 'in' && cat2 == 'mi'):
                    conv = 'Distance conversion'
                    eq = `${num}in => ${Math.abs(num / 63360)}mi`
                    formula = '`x/63360`'

                    break;

                case (cat1 == 'ft' && cat2 == 'in'):
                    conv = 'Distance conversion'
                    eq = `${num}ft => ${num * 12}in`
                    formula = '`x*12`'

                    break;
                case (cat1 == 'ft' && cat2 == 'm'):
                    conv = 'Distance conversion'
                    eq = `${num}ft => ${Math.abs(num / 3.28084)}m`
                    formula = '`x/3.28084` (approx)'

                    break;
                case (cat1 == 'ft' && cat2 == 'mi'):
                    conv = 'Distance conversion'
                    eq = `${num}ft => ${Math.abs(num / 5280)}mi`
                    formula = '`x/5280`'

                    break;

                case (cat1 == 'm' && cat2 == 'in'):
                    conv = 'Distance conversion'
                    eq = `${num}m => ${num * 39.37}in`
                    formula = '`x*39.37`'

                    break;
                case (cat1 == 'm' && cat2 == 'ft'):
                    conv = 'Distance conversion'
                    eq = `${num}m => ${num * 3.28084}ft`
                    formula = '`x*3.28084`'

                    break;
                case (cat1 == 'm' && cat2 == 'mi'):
                    conv = 'Distance conversion'
                    eq = `${num}m => ${num / 1609.344}mi`
                    formula = '`x/1609.344`'

                    break;

                case (cat1 == 'mi' && cat2 == 'in'):
                    conv = 'Distance conversion'
                    eq = `${num}mi => ${num * 63360}in`
                    formula = '`x*63360`'

                    break;
                case (cat1 == 'mi' && cat2 == 'ft'):
                    embedres.setTitle('Distance conversion')
                    eq = `${num}mi => ${num * 5280}ft`
                    formula = '`x*5280`'

                    break;
                case (cat1 == 'mi' && cat2 == 'm'):
                    conv = 'Distance conversion'
                    eq = `${num}mi => ${num * 1609.344}m`
                    formula = '`x*1609.344`'

                    break;




                //time
                case (cat1 == 's' && cat2 == 'min'):
                    conv = 'Time conversion'
                    eq = `${num}s => ${num / 60}min`
                    formula = '`x/60`'

                    break;
                case (cat1 == 's' && cat2 == 'h'):
                    conv = 'Time conversion'
                    eq = `${num}s => ${num / 60 / 60}h`
                    formula = '`x/60/60`'

                    break;
                case (cat1 == 's' && cat2 == 'day'):
                    conv = 'Time conversion'
                    eq = `${num}s => ${num / 60 / 60 / 24} days`
                    formula = '`x/60/60/24`'

                    break;
                case (cat1 == 's' && cat2 == 'year'):
                    conv = 'Time conversion'
                    eq = `${num}s => ${num / 60 / 60 / 24 / 365.24}y`
                    formula = '`x/60/60/365.24`'

                    break;


                case (cat1 == 'min' && cat2 == 's'):
                    conv = 'Time conversion'
                    eq = `${num}min => ${num * 60}s`
                    formula = '`x*60`'

                    break;
                case (cat1 == 'min' && cat2 == 'h'):
                    conv = 'Time conversion'
                    eq = `${num}min => ${num / 60}h`
                    formula = '`x/60`'

                    break;
                case (cat1 == 'min' && cat2 == 'day'):
                    conv = 'Time conversion'
                    eq = `${num}min => ${num / 60 / 24} days`
                    formula = '`x/60/24`'

                    break;
                case (cat1 == 'min' && cat2 == 'year'):
                    conv = 'Time conversion'
                    eq = `${num}min => ${num / 60 / 24 / 365.24}y`
                    formula = '`x/60/24/365.24`'

                    break;


                case (cat1 == 'h' && cat2 == 's'):
                    conv = 'Time conversion'
                    eq = `${num}h => ${num * 60 * 60}s`
                    formula = '`x*60*60`'

                    break;
                case (cat1 == 'h' && cat2 == 'min'):
                    conv = 'Time conversion'
                    eq = `${num}h => ${num * 60}min`
                    formula = '`x*60`'

                    break;
                case (cat1 == 'h' && cat2 == 'day'):
                    conv = 'Time conversion'
                    eq = `${num}h => ${num / 24} days`
                    formula = '`x/24`'

                    break;
                case (cat1 == 'h' && cat2 == 'year'):
                    conv = 'Time conversion'
                    eq = `${num}h => ${num / 24 / 365.24}y`
                    formula = '`x/24/365.24`'

                    break;


                case (cat1 == 'day' && cat2 == 's'):
                    conv = 'Time conversion'
                    eq = `${num} days => ${num * 24 * 60 * 60}s`
                    formula = '`x*24*60*60`'

                    break;
                case (cat1 == 'day' && cat2 == 'min'):
                    conv = 'Time conversion'
                    eq = `${num} days => ${num * 24 * 60}min`
                    formula = '`x*24*60`'

                    break;
                case (cat1 == 'day' && cat2 == 'h'):
                    conv = 'Time conversion'
                    eq = `${num} days => ${num * 24}h`
                    formula = '`x*24`'

                    break;
                case (cat1 == 'day' && cat2 == 'year'):
                    conv = 'Time conversion'
                    eq = `${num} days => ${num / 365.24}y`
                    formula = '`x/365.24`'

                    break;


                case (cat1 == 'year' && cat2 == 's'):
                    conv = 'Time conversion'
                    eq = `${num}y => ${num * 365.24 * 24 * 60 * 60}s`
                    formula = '`x*365.24*24*60*60`'

                    break;
                case (cat1 == 'year' && cat2 == 'min'):
                    conv = 'Time conversion'
                    eq = `${num}y => ${num * 365.24 * 24 * 60}min`
                    formula = '`x*365.24*24*60`'

                    break;
                case (cat1 == 'year' && cat2 == 'h'):
                    conv = 'Time conversion'
                    eq = `${num}y => ${num * 365.24 * 24}h`
                    formula = '`x*365.24*24`'

                    break;
                case (cat1 == 'year' && cat2 == 'day'):
                    conv = 'Time conversion'
                    eq = `${num}y => ${num * 365.24} days`
                    formula = '`x*365.24`'

                    break;




                //volume
                case (cat1 == 'floz' && cat2 == 'cup'):
                    conv = 'Volume conversion'
                    eq = `${num}fl.oz => ${num / 8.11537} cup`
                    formula = '~`x/8.11537'

                    break;
                case (cat1 == 'floz' && cat2 == 'pt'):
                    conv = 'Volume conversion'
                    eq = `${num}fl.oz => ${num / 16}pt`
                    formula = '`x/16`'

                    break;
                case (cat1 == 'floz' && cat2 == 'l'):
                    conv = 'Volume conversion'
                    eq = `${num}fl.oz => ${num / 33.814}l`
                    formula = '`x/33.814`'

                    break;
                case (cat1 == 'floz' && cat2 == 'gal'):
                    conv = 'Volume conversion'
                    eq = `${num}fl.oz => ${num / 128}gal`
                    formula = 'x/128``'

                    break;
                case (cat1 == 'floz' && cat2 == 'm3'):
                    conv = 'Volume conversion'
                    eq = `${num}fl.oz => ${num / 33814}m^3`
                    formula = '`x/33814`'

                    break;


                case (cat1 == 'cup' && cat2 == 'floz'):
                    conv = 'Volume conversion'
                    eq = `${num} cup => ${num * 8.11537}fl.oz`
                    formula = '~`x*8.11537`'

                    break;
                case (cat1 == 'cup' && cat2 == 'pt'):
                    conv = 'Volume conversion'
                    eq = `${num} cup => ${num / 1.972}pt`
                    formula = '~`x/1.972`'

                    break;
                case (cat1 == 'cup' && cat2 == 'l'):
                    conv = 'Volume conversion'
                    eq = `${num} cup => ${num / 4.167}l`
                    formula = '~`x/4.167`'

                    break;
                case (cat1 == 'cup' && cat2 == 'gal'):
                    conv = 'Volume conversion'
                    eq = `${num} cup => ${num / 15.722}gal`
                    formula = '~`x/15.722`'

                    break;
                case (cat1 == 'cup' && cat2 == 'm3'):
                    conv = 'Volume conversion'
                    eq = `${num} cup => ${num / 4167}m^3`
                    formula = '~`x/4166.67`'

                    break;


                case (cat1 == 'pt' && cat2 == 'floz'):
                    conv = 'Volume conversion'
                    eq = `${num}pt => ${num * 16}fl.oz`
                    formula = '`x*16`'

                    break;
                case (cat1 == 'pt' && cat2 == 'cup'):
                    conv = 'Volume conversion'
                    eq = `${num}pt => ${num * 1.97157} cup`
                    formula = '~`x*1.97157`'

                    break;
                case (cat1 == 'pt' && cat2 == 'l'):
                    conv = 'Volume conversion'
                    eq = `${num}pt => ${num / 2.11338}l`
                    formula = '`x/2.11338`'

                    break;
                case (cat1 == 'pt' && cat2 == 'gal'):
                    conv = 'Volume conversion'
                    eq = `${num}pt => ${num / 8}gal`
                    formula = '`x/8`'

                    break;
                case (cat1 == 'pt' && cat2 == 'm3'):
                    conv = 'Volume conversion'
                    eq = `${num}pt => ${num / 2113.37810957}`
                    formula = '`x/2113.37810957`'

                    break;


                case (cat1 == 'l' && cat2 == 'floz'):
                    conv = 'Volume conversion'
                    eq = `${num}l => ${num * 33.814}fl.oz`
                    formula = '`x*33.814`'

                    break;
                case (cat1 == 'l' && cat2 == 'cup'):
                    conv = 'Volume conversion'
                    eq = `${num}l => ${num * 4.16667} cup`
                    formula = '`x*4.16667`'

                    break;
                case (cat1 == 'l' && cat2 == 'pt'):
                    conv = 'Volume conversion'
                    eq = `${num}l => ${num * 2.11338}pt`
                    formula = '`x*2.11338`'

                    break;
                case (cat1 == 'l' && cat2 == 'gal'):
                    conv = 'Volume conversion'
                    eq = `${num} => ${num / 3.78541}gal`
                    formula = '`x/3.78541`'

                    break;
                case (cat1 == 'l' && cat2 == 'm3'):
                    conv = 'Volume conversion'
                    eq = `${num}l => ${num / 1000}m^3`
                    formula = '`x/1000`'

                    break;


                case (cat1 == 'gal' && cat2 == 'floz'):
                    conv = 'Volume conversion'
                    eq = `${num}gal => ${num * 128}fl.oz`
                    formula = '`x*128`'

                    break;
                case (cat1 == 'gal' && cat2 == 'cup'):
                    conv = 'Volume conversion'
                    eq = `${num}gal => ${num * 15.7725} cup`
                    formula = '`x*15.7725`'

                    break;
                case (cat1 == 'gal' && cat2 == 'pt'):
                    conv = 'Volume conversion'
                    eq = `${num}gal => ${num * 8}pt`
                    formula = '`x*8`'

                    break;
                case (cat1 == 'gal' && cat2 == 'l'):
                    conv = 'Volume conversion'
                    eq = `${num}gal => ${num * 3.78541}l`
                    formula = '`x*3.78541`'

                    break;
                case (cat1 == 'gal' && cat2 == 'm3'):
                    conv = 'Volume conversion'
                    eq = `${num}gal => ${num / 264.1722636962499564}m^3`
                    formula = '`x/264.1722636962499564`'

                    break;


                case (cat1 == 'm3' && cat2 == 'floz'):
                    conv = 'Volume conversion'
                    eq = `${num}m^3 => ${num * 33814}fl.oz`
                    formula = '`x*33814`'

                    break;
                case (cat1 == 'm3' && cat2 == 'cup'):
                    conv = 'Volume conversion'
                    eq = `${num}m^3 => ${num * 4166.67} cup`
                    formula = '`x*4166.67`'

                    break;
                case (cat1 == 'm3' && cat2 == 'pt'):
                    conv = 'Volume conversion'
                    eq = `${num}m^3 => ${num * 2113.37810957}pt`
                    formula = '`x*2113.37810957`'

                    break;
                case (cat1 == 'm3' && cat2 == 'l'):
                    conv = 'Volume conversion'
                    eq = `${num}m^3 => ${num * 1000}l`
                    formula = '`x*1000`'

                    break;
                case (cat1 == 'm3' && cat2 == 'gal'):
                    conv = 'Volume conversion'
                    eq = `${num}m^3 => ${num * 264.1722636962499564}gal`
                    formula = '`x*264.1722636962499564`'

                    break;




                //mass
                case (cat1 == 'g' && cat2 == 'oz'):
                    conv = 'Mass conversion'
                    eq = `${num}g => ${num / 28.3495}oz`
                    formula = '`x/28.3495`'

                    break;
                case (cat1 == 'g' && cat2 == 'lb'):
                    conv = 'Mass conversion'
                    eq = `${num}g => ${num / 453.592}lb`
                    formula = '`x/453.592`'

                    break;
                case (cat1 == 'g' && cat2 == 'ton'):
                    conv = 'Mass conversion'
                    eq = `${num}g => ${num / (10 ** 6)}ton`
                    formula = '`x/10^6 (1,000,000)'

                    break;


                case (cat1 == 'oz' && cat2 == 'g'):
                    conv = 'Mass conversion'
                    eq = `${num}oz => ${num * 28.3495}g`
                    formula = '`x*28.3495`'

                    break;
                case (cat1 == 'oz' && cat2 == 'lb'):
                    conv = 'Mass conversion'
                    eq = `${num}oz => ${num / 16}lb`
                    formula = '`x/16`'

                    break;
                case (cat1 == 'oz' && cat2 == 'ton'):
                    conv = 'Mass conversion'
                    eq = `${num}oz => ${num / 35274}ton`
                    formula = '`x/35274`'

                    break;


                case (cat1 == 'lb' && cat2 == 'g'):
                    conv = 'Mass conversion'
                    eq = `${num}lb => ${num * 453.592}g`
                    formula = '`x*453.592`'

                    break;
                case (cat1 == 'lb' && cat2 == 'oz'):
                    conv = 'Mass conversion'
                    eq = `${num}lb => ${num * 16}oz`
                    formula = '`x*16`'

                    break;
                case (cat1 == 'lb' && cat2 == 'ton'):
                    conv = 'Mass conversion'
                    eq = `${num}lb => ${num / 2204.62504693}ton`
                    formula = '`x/2204.62504693`'

                    break;


                case (cat1 == 'ton' && cat2 == 'g'):
                    conv = 'Mass conversion'
                    eq = `${num}ton => ${num * (10 ** 6)}g`
                    formula = '`x*10^6 (1,000,000)`'
                    break;
                case (cat1 == 'ton' && cat2 == 'oz'):
                    conv = 'Mass conversion'
                    eq = `${num}ton => ${num * 35274}oz`
                    formula = '`x*35274`'
                    break;
                case (cat1 == 'ton' && cat2 == 'lb'):
                    conv = 'Mass conversion'
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
                    interaction.reply({ content: 'Invalid conversion or it hasn\'t been added yet', embeds: [EmbedList], allowedMentions: { repliedUser: false } })
                    return;
                    break;
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
            interaction.reply({ embeds: [embedres], allowedMentions: { repliedUser: false } })
            fs.appendFileSync(`commands.log`, `\nCommand Information\ntype1: ${cat1}\ntyp2: ${cat2}\nvalue: ${num}`)
        }
    }
}