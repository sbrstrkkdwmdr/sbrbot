module.exports = {
    name: 'measureconvert',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, ) {
        fs.appendFileSync('help.log', "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync('help.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('help.log', "\n" + "command executed - measure convert")
        fs.appendFileSync('help.log', "\n" + "category - help")
        let consoleloguserweeee = message.author
        fs.appendFileSync('help.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('help.log', "\n" + "") 
        console.groupEnd()

        let num1 = Math.abs(args[1]);
        let converttype = args[0].toLowerCase();
        switch(converttype){
            
            case 'help':
                let Embedhelp = new Discord.MessageEmbed()
                .setTitle('w')
                .addField('**Formula**', 'c>f = convert celcius to fahrenheit', false)
                .addField('**math stuff idk**', '* = multiply\n/ = divide\n- = subtract\n+ = add\n^ = power', false)
                ;
                let EmbedList = new Discord.MessageEmbed()
                .setTitle('List of measurements')
                .addField('Temperature', `c (celsius), f (fahnrenheit), k (kelvin)`, false)
                .addField('Distance', 'in (inch), fe (feet), m (metres), km (kilometres), mi (miles)', false)
                .addField('Time', '(WIP) ms (milliseconds), s (seconds), min (minutes), h (hours), d (days), y (years) ', false)
                .addField('Volume', '(WIP) l (litres)', false)
                .addField('Mass', '(WIP) kg (kilograms)', false)
                .addField('Non-measurements', 'help, metricprefixes', false)
                message.channel.send({ embeds: [Embedhelp, EmbedList]})
                break;
            case 'metricprefixes':
                let metricEmbed = new Discord.MessageEmbed()
                .setTitle('prefixes')
                .addField('increasing', 'yotta(Y) - 10^24\nzetta(Z) - 10^21\nexa(E) - 10^18\npeta(P) - 10^15\ntera(T) - 10^12\ngiga(G) - 10^9\nmega(M) - 10^6\nkilo(k) - 10^3\nhecto(h) - 10^2\ndeka(da) - 10', false)
                .addField('decreasing', 'deci(d) - 10^-1\ncenti(c) - 10^-2\nmilli(m) - 10^-3\nmicro(μ) - 10^-6\nnano(n) - 10^-9\npico(p) - 10^-12\nfemto(f) - 10^-15\natto(a) - 10^-18\nzepto(z) - 10^-21\nyocto(y) - 10^-24', false)
                message.channel.send({ embeds: [metricEmbed]});
                break;
            //temperature-------------------
            case 'ctok':case 'c>k':
                let answerck = Math.abs(num1 + 273.15);
                let Embedck = new Discord.MessageEmbed()
                .setTitle('Temperature conversion')
                .addField('**Celcius to Kelvin**', `${answerck}k`, false)
                .addField('**Formula**', '`(x)+273.15`', false)
                message.channel.send({ embeds: [Embedck]})
                break;
            case 'ftok':case 'f>k':
                let answerfk = Math.abs(((((num1-32) * 5) / 9)) + 273.15)
                let Embedfk = new Discord.MessageEmbed()
                .setTitle('Temperature conversion')
                .addField('**Fahreinheit to Kelvin**', `${answerfk}c`, false)
                .addField('**Formula**', '`((x-32)*5/9)+273.15`', false)
                message.channel.send({ embeds: [Embedfk]})
                break;
            case 'ctof':case 'c>f':
                let answercf = Math.abs((((num1) * 9) / 5) + 32)
                let Embedcf = new Discord.MessageEmbed()
                .setTitle('Temperature conversion')
                .addField('**Celcius to Fahrenheit**', `${answercf}f`, false)
                .addField('**Formula**', '`(x)*9/5+32`', false)
                message.channel.send({ embeds: [Embedcf]})
                break;
            case 'ktoc':case 'k>c':
                let answerkc = Math.abs(num1 - 273.15);
                let Embedkc = new Discord.MessageEmbed()
                .setTitle('Temperature conversion')
                .addField('**Kelvin to Celcius**', `${answerkc}c`, false)
                .addField('**Formula**', '`(x)-273.15`', false)
                message.channel.send({ embeds: [Embedkc]})
                break;
            case 'ktof':case 'k>f':
                let answerkf = Math.abs(((((num1- 273.15) * 9) / 5) + 32 ));
                let Embedkf = new Discord.MessageEmbed()
                .setTitle('Temperature conversion')
                .addField('**Fahreinheit to Kelvin**', `${answerkf}c`, false)
                .addField('**Formula**', '`((x)*5/9)+32-273.15`', false)
                message.channel.send({ embeds: [Embedkf]})
                break;
            case 'ftoc':case 'f>c':
                let answerfc = Math.abs((((num1) - 32) * 5) / 9);
                let Embedfc = new Discord.MessageEmbed()
                .setTitle('Temperature conversion')
                .addField('**Celcius to Fahrenheit**', `${answerfc}f`, false)
                .addField('**Formula**', '`((x)-32)*5/9`', false)
                message.channel.send({ embeds: [Embedfc]})
                break;
            //distance----------------------

            //inch > 
            case 'inchtometre':case 'in>m':
                let answerinchmetre = Math.abs((num1)/39.37);
                let Embedinchmetre = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**inches to metres**', `${answerinchmetre} metres`, false)
                .addField('**Formula**', '`x/39.37 (approx)`', false)
                message.channel.send({ embeds: [Embedinchmetre]})
                break;
            case 'inchtofeet':case 'in>fe':
                let answerinchfeet = Math.abs((num1)/12);
                let Embedinchfeet = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**inches to feet**', `${answerinchfeet} feet`, false)
                .addField('**Formula**', '`x/12`', false)
                message.channel.send({ embeds: [Embedinchfeet]})
                break;
            case 'inchtomile':case 'in>mi':
                let answerinchmile = Math.abs((num1)/63360);
                let Embedinchmile = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**inches to miles**', `${answerinchmile} miles`, false)
                .addField('**Formula**', '`x/63360`', false)
                message.channel.send({ embeds: [Embedinchmile]})
                break;
            //metre >
            case 'metretoinch':case 'm>in':
                let answermetreinch = Math.abs((num1)*39.37);
                let Embedmetreinch = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**metres to inches**', `${answermetreinch} inches`, false)
                .addField('**Formula**', '`x*39.37 (approx)`', false)
                message.channel.send({ embeds: [Embedmetreinch]})
                break;
            case 'metretofeet':case 'm>fe':
                let answermetrefeet= Math.abs((num1)*3.28084);
                let Embedmetrefeet = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**metres to feet**', `${answermetrefeet} feet`, false)
                .addField('**Formula**', '`x*3.28084 (approx)`', false)
                message.channel.send({ embeds: [Embedmetrefeet]})
                break;
            case 'metretomile':case 'm>mi':
                let answermetremile= Math.abs((num1)/1609.344);
                let Embedmetremile = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**metres to miles**', `${answermetremile} miles`, false)
                .addField('**Formula**', '`x/1609.344 (approx)`', false)
                message.channel.send({ embeds: [Embedmetremile]})
                break;

            // feet >
            case 'feettoinch':case 'fe>in':
                let answerfeetinch = Math.abs((num1)*12);
                let Embedfeetinch = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**feet to inches**', `${answerfeetinch} feet`, false)
                .addField('**Formula**', '`x*12`', false)
                message.channel.send({ embeds: [Embedfeetinch]})
                break;
            case 'feettometre':case 'fe>m':
                let answerfeetmetre= Math.abs((num1)/3.28084);
                let Embedmfeetmetre = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**feet to metres**', `${answerfeetmetre} metres`, false)
                .addField('**Formula**', '`x/3.28084 (approx)`', false)
                message.channel.send({ embeds: [Embedmfeetmetre]})
                break;
            case 'feettomile':case 'fe>mi':
                let answerfeetmile= Math.abs((num1)/5280);
                let Embedmfeetmile = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**feet to miles**', `${answerfeetmile} miles`, false)
                .addField('**Formula**', '`x/5280`', false)
                message.channel.send({ embeds: [Embedmfeetmile]})
                break;
            // miles >
            case 'miletoinch':case 'mi>in':
                let answermileinch = Math.abs((num1)*63360);
                let Embedmileinch = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**miles to inches**', `${answermileinch} inches`, false)
                .addField('**Formula**', '`x*63360`', false)
                message.channel.send({ embeds: [Embedmileinch]})
                break;
            case 'miletofeet':case 'mi>fe':
                let answermilefeet = Math.abs((num1)*5280);
                let Embedmilefeet = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**miles to feet**', `${answermilefeet} feet`, false)
                .addField('**Formula**', '`x*5280`', false)
                message.channel.send({ embeds: [Embedmilefeet]})
                break;
            case 'miletometre':case 'mi>m':
                let answermilemetre= Math.abs((num1)*1609.344);
                let Embedmilemetre = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**miles to metres**', `${answermilemetre} metres`, false)
                .addField('**Formula**', '`x*1609.344 (approx)`', false)
                message.channel.send({ embeds: [Embedmilemetre]})
                break;


            //time--------------------------
            //volume------------------------
            //mass--------------------------
            default:
                message.reply("method not found")
        }
    }
}
//client.commands.get('').execute(message, args)