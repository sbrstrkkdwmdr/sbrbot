const fs = require('fs')
const fetch = require('node-fetch')

module.exports = {
    name: 'convert',
    description: 'null',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        let Embedhelp = new Discord.MessageEmbed()
            .setTitle('w')
            .addField('**Formula**', 'c>f = convert celcius to fahrenheit', false)
            .addField('**math stuff idk**', '* = multiply\n/ = divide\n- = subtract\n+ = add\n^ = power', false)
            ;
        let EmbedList = new Discord.MessageEmbed()
            .setTitle('List of measurements')
            .addField('Temperature', `c (celsius), f (fahnrenheit), k (kelvin)`, false)
            .addField('Distance', 'in (inch), fe (feet), m (metres), mi (miles)', false)
            .addField('Time', '(WIP) ms (milliseconds), s (seconds), min (minutes), h (hours), d (days), y (years) ', false)
            .addField('Volume', '(WIP) l (litres)', false)
            .addField('Mass', '(WIP) kg (kilograms)', false)
            .addField('Non-measurements', 'help, metricprefixes', false)
            ;
        let embedres = new Discord.MessageEmbed()
            .setDescription('⠀');
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            message.reply('Just use the slash command')
            /*             switch (args[0]) {
                default:
                    message.channel.send({ embeds: [Embedhelp, EmbedList] })
                    break;
            } */
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let cat1 = interaction.options.getString('type1')
            let cat2 = interaction.options.getString('type2')
            let num = interaction.options.getNumber('number')
            embedres.setDescription('NOTE: NEGATIVES ARE SHOWN AS POSITIVE NUMBERS')
            switch (true) {
                case (cat1 == cat2):
                    let msg = `did you really just convert ${cat1.toLowerCase()} to ${cat2.toLowerCase()}? smh my head`
                    interaction.reply(msg)
                    //interaction.reply({ embeds: [embedres] })
                    break;
                //temperature
                case (cat1 == 'f' && cat2 == 'c'):
                    //console.log('success')
                    embedres.setTitle('Temperature conversion')
                    embedres.addField('Farhenheit to Celsius', `${num}f => ${Math.abs((num - 32) * 5 / 9)}c`)
                    embedres.addField('Formula', '`((x)-32)*5/9`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'f' && cat2 == 'k'):
                    embedres.setTitle('Temperature conversion')
                    embedres.addField('Fahrenheit to Kelvin', `${num}f => ${Math.abs((num - 32) * 5 / 9 + 273.15)}c`)
                    embedres.addField('Formula', '`((x)-32)*5/9 + 273.15`', false)

                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'c' && cat2 == 'f'):
                    embedres.setTitle('Temperature conversion')
                    embedres.addField('Celsius to Fahrenheit', `${num}c => ${Math.abs(num * 9 / 5 + 32)}f`, false)
                    embedres.addField('Formula', '`x*9/5+32`', false)

                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'c' && cat2 == 'k'):
                    embedres.setTitle('Temperature conversion')
                    embedres.addField('Celsius to Kelvin', `${num}c => ${Math.abs(num + 273.15)}k`)
                    embedres.addField('Formula', '`x+273.15`', false)

                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'k' && cat2 == 'c'):
                    embedres.setTitle('Temperature conversion')
                    embedres.addField('Kelvin to Celsius', `${num}k => ${Math.abs(num - 273.15)}x`, false)
                    embedres.addField('Formula', '`x-273.15`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'k' && cat2 == 'f'):
                    embedres.setTitle('Temperature conversion')
                    embedres.addField('Kelvin to Fahrenheit', `${num}k => ${Math.abs((num - 273.15) * 9 / 5 + 32)}f`, false)
                    embedres.addField('Formula', '`(x-273.15)*9/5+32`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;




                //distance
                case (cat1 == 'in' && cat2 == 'ft'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}in => ${num / 12}ft`, false)
                    embedres.addField('Formula', '`x/12`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'in' && cat2 == 'm'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}in => ${Math.abs(num / 39.37)}m`, false)
                    embedres.addField('Formula', '`x/39.37`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'in' && cat2 == 'mi'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}in => ${Math.abs(num / 63360)}mi`, false)
                    embedres.addField('Formula', '`x/63360`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;

                case (cat1 == 'ft' && cat2 == 'in'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}ft => ${num * 12}in`, false)
                    embedres.addField('Formula', '`x*12`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'ft' && cat2 == 'm'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}ft => ${Math.abs(num / 3.28084)}m`, false)
                    embedres.addField('Formula', '`x/3.28084` (approx)', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'ft' && cat2 == 'mi'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}ft => ${Math.abs(num / 5280)}mi`, false)
                    embedres.addField('Formula', '`x/5280`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;

                case (cat1 == 'm' && cat2 == 'in'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}m => ${num * 39.37}in`, false)
                    embedres.addField('Formula', '`x*39.37`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'm' && cat2 == 'ft'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}m => ${num * 3.28084}ft`, false)
                    embedres.addField('Formula', '`x*3.28084`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'm' && cat2 == 'mi'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}m => ${num / 1609.344}mi`, false)
                    embedres.addField('Formula', '`x/1609.344`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;

                case (cat1 == 'mi' && cat2 == 'in'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}mi => ${num * 63360}in`, false)
                    embedres.addField('Formula', '`x*63360`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'mi' && cat2 == 'ft'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}mi => ${num * 5280}ft`, false)
                    embedres.addField('Formula', '`x*5280`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'mi' && cat2 == 'm'):
                    embedres.setTitle('Distance conversion')
                    embedres.addField('Conversion', `${num}mi => ${num * 1609.344}m`, false)
                    embedres.addField('Formula', '`x*1609.344`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;




                //time
                case (cat1 == 's' && cat2 == 'min'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}s => ${num / 60}min`, false)
                    embedres.addField('Formula', '`x/60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 's' && cat2 == 'h'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}s => ${num / 60 / 60}h`, false)
                    embedres.addField('Formula', '`x/60/60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 's' && cat2 == 'day'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}s => ${num / 60 / 60 / 24} days`, false)
                    embedres.addField('Formula', '`x/60/60/24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 's' && cat2 == 'year'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}s => ${num / 60 / 60 / 24 / 365.24}y`, false)
                    embedres.addField('Formula', '`x/60/60/365.24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'min' && cat2 == 's'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}min => ${num * 60}s`, false)
                    embedres.addField('Formula', '`x*60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'min' && cat2 == 'h'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}min => ${num / 60}h`, false)
                    embedres.addField('Formula', '`x/60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'min' && cat2 == 'day'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}min => ${num / 60 / 24} days`, false)
                    embedres.addField('Formula', '`x/60/24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'min' && cat2 == 'year'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}min => ${num / 60 / 24 / 365.24}y`, false)
                    embedres.addField('Formula', '`x/60/24/365.24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'h' && cat2 == 's'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}h => ${num * 60 * 60}s`, false)
                    embedres.addField('Formula', '`x*60*60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'h' && cat2 == 'min'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}h => ${num * 60}min`, false)
                    embedres.addField('Formula', '`x*60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'h' && cat2 == 'day'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}h => ${num / 24} days`, false)
                    embedres.addField('Formula', '`x/24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'h' && cat2 == 'year'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}h => ${num / 24 / 365.24}y`, false)
                    embedres.addField('Formula', '`x/24/365.24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'day' && cat2 == 's'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num} days => ${num * 24 * 60 * 60}s`, false)
                    embedres.addField('Formula', '`x*24*60*60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'day' && cat2 == 'min'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num} days => ${num * 24 * 60}min`, false)
                    embedres.addField('Formula', '`x*24*60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'day' && cat2 == 'h'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num} days => ${num * 24}h`, false)
                    embedres.addField('Formula', '`x*24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'day' && cat2 == 'year'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num} days => ${num / 365.24}y`, false)
                    embedres.addField('Formula', '`x/365.24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'year' && cat2 == 's'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}y => ${num * 365.24 * 24 * 60 * 60}s`, false)
                    embedres.addField('Formula', '`x*365.24*24*60*60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'year' && cat2 == 'min'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}y => ${num * 365.24 * 24 * 60}min`, false)
                    embedres.addField('Formula', '`x*365.24*24*60`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'year' && cat2 == 'h'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}y => ${num * 365.24 * 24}h`, false)
                    embedres.addField('Formula', '`x*365.24*24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'year' && cat2 == 'day'):
                    embedres.setTitle('Time conversion')
                    embedres.addField('Conversion', `${num}y => ${num * 365.24} days`, false)
                    embedres.addField('Formula', '`x*365.24`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;




                //volume
                case (cat1 == 'floz' && cat2 == 'cup'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}fl.oz => ${num / 8.11537} cup`, false)
                    embedres.addField('Formula', '~`x/8.11537', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'floz' && cat2 == 'pt'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}fl.oz => ${num / 16}pt`, false)
                    embedres.addField('Formula', '`x/16`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'floz' && cat2 == 'l'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}fl.oz => ${num / 33.814}l`, false)
                    embedres.addField('Formula', '`x/33.814`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'floz' && cat2 == 'gal'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}fl.oz => ${num / 128}gal`, false)
                    embedres.addField('Formula', 'x/128``', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'floz' && cat2 == 'm3'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}fl.oz => ${num / 33814}m^3`, false)
                    embedres.addField('Formula', '`x/33814`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'cup' && cat2 == 'floz'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num} cup => ${num * 8.11537}fl.oz`, false)
                    embedres.addField('Formula', '~`x*8.11537`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'cup' && cat2 == 'pt'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num} cup => ${num / 1.972}pt`, false)
                    embedres.addField('Formula', '~`x/1.972`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'cup' && cat2 == 'l'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num} cup => ${num / 4.167}l`, false)
                    embedres.addField('Formula', '~`x/4.167`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'cup' && cat2 == 'gal'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num} cup => ${num / 15.722}gal`, false)
                    embedres.addField('Formula', '~`x/15.722`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'cup' && cat2 == 'm3'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num} cup => ${num / 4167}m^3`, false)
                    embedres.addField('Formula', '~`x/4166.67`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'pt' && cat2 == 'floz'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}pt => ${num * 16}fl.oz`, false)
                    embedres.addField('Formula', '`x*16`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'pt' && cat2 == 'cup'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}pt => ${num * 1.97157} cup`, false)
                    embedres.addField('Formula', '~`x*1.97157`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'pt' && cat2 == 'l'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}pt => ${num / 2.11338}l`, false)
                    embedres.addField('Formula', '`x/2.11338`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'pt' && cat2 == 'gal'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}pt => ${num / 8}gal`, false)
                    embedres.addField('Formula', '`x/8`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'pt' && cat2 == 'm3'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}pt => ${num / 2113.37810957}`, false)
                    embedres.addField('Formula', '`x/2113.37810957`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'l' && cat2 == 'floz'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}l => ${num * 33.814}fl.oz`, false)
                    embedres.addField('Formula', '`x*33.814`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'l' && cat2 == 'cup'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}l => ${num * 4.16667} cup`, false)
                    embedres.addField('Formula', '`x*4.16667`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'l' && cat2 == 'pt'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}l => ${num * 2.11338}pt`, false)
                    embedres.addField('Formula', '`x*2.11338`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'l' && cat2 == 'gal'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num} => ${num / 3.78541}gal`, false)
                    embedres.addField('Formula', '`x/3.78541`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'l' && cat2 == 'm3'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}l => ${num / 1000}m^3`, false)
                    embedres.addField('Formula', '`x/1000`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'gal' && cat2 == 'floz'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}gal => ${num * 128}fl.oz`, false)
                    embedres.addField('Formula', '`x*128`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'gal' && cat2 == 'cup'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}gal => ${num * 15.7725} cup`, false)
                    embedres.addField('Formula', '`x*15.7725`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'gal' && cat2 == 'pt'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}gal => ${num * 8}pt`, false)
                    embedres.addField('Formula', '`x*8`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'gal' && cat2 == 'l'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}gal => ${num * 3.78541}l`, false)
                    embedres.addField('Formula', '`x*3.78541`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'gal' && cat2 == 'm3'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}gal => ${num / 264.1722636962499564}m^3`, false)
                    embedres.addField('Formula', '`x/264.1722636962499564`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'm3' && cat2 == 'floz'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}m^3 => ${num * 33814}fl.oz`, false)
                    embedres.addField('Formula', '`x*33814`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'm3' && cat2 == 'cup'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}m^3 => ${num * 4166.67} cup`, false)
                    embedres.addField('Formula', '`x*4166.67`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'm3' && cat2 == 'pt'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}m^3 => ${num * 2113.37810957}pt`, false)
                    embedres.addField('Formula', '`x*2113.37810957`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'm3' && cat2 == 'l'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}m^3 => ${num * 1000}l`, false)
                    embedres.addField('Formula', '`x*1000`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'm3' && cat2 == 'gal'):
                    embedres.setTitle('Volume conversion')
                    embedres.addField('Conversion', `${num}m^3 => ${num * 264.1722636962499564}gal`, false)
                    embedres.addField('Formula', '`x*264.1722636962499564`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;




                //mass
                case (cat1 == 'g' && cat2 == 'oz'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}g => ${num / 28.3495}oz`, false)
                    embedres.addField('Formula', '`x/28.3495`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'g' && cat2 == 'lb'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}g => ${num / 453.592}lb`, false)
                    embedres.addField('Formula', '`x/453.592`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'g' && cat2 == 'ton'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}g => ${num / (10 ** 6)}ton`, false)
                    embedres.addField('Formula', '`x/10^6 (1,000,000)', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'oz' && cat2 == 'g'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}oz => ${num * 28.3495}g`, false)
                    embedres.addField('Formula', '`x*28.3495`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'oz' && cat2 == 'lb'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}oz => ${num / 16}lb`, false)
                    embedres.addField('Formula', '`x/16`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'oz' && cat2 == 'ton'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}oz => ${num / 35274}ton`, false)
                    embedres.addField('Formula', '`x/35274`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'lb' && cat2 == 'g'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}lb => ${num * 453.592}g`, false)
                    embedres.addField('Formula', '`x*453.592`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'lb' && cat2 == 'oz'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}lb => ${num * 16}oz`, false)
                    embedres.addField('Formula', '`x*16`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'lb' && cat2 == 'ton'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}lb => ${num / 2204.62504693}ton`, false)
                    embedres.addField('Formula', '`x/2204.62504693`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;


                case (cat1 == 'ton' && cat2 == 'g'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}ton => ${num * (10 ** 6)}g`, false)
                    embedres.addField('Formula', '`x*10^6 (1,000,000)`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'ton' && cat2 == 'oz'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}ton => ${num * 35274}oz`, false)
                    embedres.addField('Formula', '`x*35274`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                case (cat1 == 'ton' && cat2 == 'lb'):
                    embedres.setTitle('Mass conversion')
                    embedres.addField('Conversion', `${num}ton => ${num * 2204.62504693}lb`, false)
                    embedres.addField('Formula', '`x*2204.62504693`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                //template
                /*
                case (cat1 && cat2):
                    embedres.setTitle()
                    embedres.addField('Conversion', `${num} => ${num}`, false)
                    embedres.addField('Formula', '`x`', false)
                    interaction.reply({ embeds: [embedres] })
                    break;
                */
                default:
                    interaction.reply({ content: 'Invalid conversion or it hasn\'t been added yet', embeds: [EmbedList] })
                    break;
            }
        }
    }
}