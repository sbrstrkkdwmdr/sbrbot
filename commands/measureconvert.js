module.exports = {
    name: 'measureconvert',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, ) {
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - measure convert")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        console.groupEnd()

        let num1 = Math.abs(args[1]);
        let converttype = args[0];
        switch(converttype){
            //temp
            case 'help':
                let Embedhelp = new Discord.MessageEmbed()
                .setTitle('w')
                .addField('**Formula**', 'c>f = convert celcius to fahrenheit', false);
                let EmbedList = new Discord.MessageEmbed()
                .setTitle('List of measurements')
                .addField('Temperature', `c(celsius), f(fahnrenheit), k(kelvin)`, true)
                .addField('Distance', 'in(inch), fe(feet), m(metres), mi(miles), au(astronomical units), ly(light years)', true)
                .addField('Time', 'ms(milliseconds), s(seconds), min(minutes), h(hours), d(days), y(years), d(decades), cent (centuries), mil(millenia) ', true)
                message.channel.send({ embeds: [Embedhelp]})
                break;
            //temperature
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
            //distance
            case 'inchtometre':case 'in>m':
                let answerinchmetre = Math.abs((num1)/39.97);
                let Embedinchmetre = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**inch to metre**', `${answerinchmetre}f`, false)
                .addField('**Formula**', '`x/39.37`', false)
                message.channel.send({ embeds: [Embedinchmetre]})
                break;
            case 'inchtofeet':case 'in>fe':
                let answerinchfeet = Math.abs((num1)/6);
                let Embedinchfeet = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**inch to metre**', `${answerinchfeet}f`, false)
                .addField('**Formula**', '`x/6`', false)
                message.channel.send({ embeds: [Embedinchfeet]})
                break;
            case 'metretoinch':case 'm>in':
                let answermetreinch = Math.abs((num1)*39.97);
                let Embedmetreinch = new Discord.MessageEmbed()
                .setTitle('Distance conversion')
                .addField('**metre to inch**', `${answermetreinch}f`, false)
                .addField('**Formula**', '`x*39.37`', false)
                message.channel.send({ embeds: [Embedmetreinch]})
                break;
            //time
            default:
                message.reply("method not found")
        }
    }
}
//client.commands.get('').execute(message, args)