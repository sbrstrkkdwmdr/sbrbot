module.exports = {
    name: 'math',
    description: '',
    execute(message, args, Discord, currentDate, currentDateISO, ) {
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - math")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("") 
        console.groupEnd()
      //  let part1 = parseInt(args[1]);
        //let part2 = parseInt(args[2]);
        let num1 = args[1];
        let num2 = args[2];
        let part1 = Math.abs(num1);
        let part2 = Math.abs(num2);
      //  if(isNaN(part2)) return message.reply("Second number not found");
        let mathtype = args[0];
        switch(mathtype){
            case 'squareroot':case 'sqrt':
                if(isNaN(part1)) return message.reply("Error - NaN");
                let problemsqrt = Math.sqrt(part1)
                message.reply(`${problemsqrt}`)
                break;
            case 'square':
                if(isNaN(part1)) return message.reply("Error - NaN");
                if (part1 < 1) return message.reply("Error - values are too low");
                let problemsquare = Math.abs(part1 * part1)
                message.reply(`${problemsquare}`)
                break;
            case 'factorial':case '!':
                if(isNaN(part1)) return message.reply("Error - NaN");
                function factorial(part1){
                    if(part1 == 0 || part1 == 1){
                        return 1;
                    }else{
                        return part1 * factorial(part1-1);
                    }
                }
                problemfactorial = factorial(part1)
                message.reply(`${problemfactorial}`)
                break;
            case 'hcf':case 'highestcommonfactor':
                if(isNaN(part1) || isNaN(part2)) return message.reply("Error - NaN");
                if(part1 != Math.round(part1) || part2 != Math.round(part2)) return message.reply("Error - numbers must be integers");
                if (part1 < 1 || part2 < 1) return message.reply("Error - values are too low");
                function findHCF(x, y) {
                    
                    while (Math.max(x, y) % Math.min(x, y) != 0) {
                       if (x > y) {
                          x %= y;
                       }
                       else {
                          y %= x;
                       }
                    }
                    return Math.min(x, y);
                }
                let problemhcf = findHCF(part1, part2);
                message.reply(`${problemhcf}`)
                break;
            case 'lcm':case 'lowestcommonmultiple':
                if(isNaN(part1) || isNaN(part2)) return message.reply("Error - NaN");
                if(part1 != Math.round(part1) || part2 != Math.round(part2)) return message.reply("Error - numbers must be integers");
                if (part1 < 1 || part2 < 1) return message.reply("Error - values are too low");
                let findLCM = (n1, n2) => {
                    
                    let lar = Math.max(n1, n2);
                    let small = Math.min(n1, n2);
                    
                    
                    let i = lar;
                    while(i % small !== 0){
                      i += lar;
                    }
                    
                    
                    return i;
                  }
                  
                  let problemlcm = findLCM(part1, part2);
                  message.reply(`${problemlcm}`)
                  break;
            case 'ardt':case 'approachratedoubletime':case 'arifdt':
                let ARDT1 = Math.abs(part1 * 2 + 13);
                let ARDT2 = Math.abs(ARDT1 / 3);
                    message.reply(`${ARDT2}`)
                break;
            case 'circumference':
                let circumference1 = Math.abs(2* Math.PI * part1 ); 
                message.reply(`${circumference1}`)
                break;
            case 'circlearea':
                let area = Math.abs(Math.PI*(part1**2))
                message.reply(`${area}`)
                break;
            case 'help':
                let helpembed = new Discord.MessageEmbed()
                .setTitle('math command')
                .addField('Tutorial', '`sbr-math (method) (num1) (num2)`\neg. `sbr-math divide 6 2`\nresult=3', false)
                .addField('Methods', '`+, add, addition, sum\n-, subtract, substraction, difference\n*, multiply, multiplication, product\n/, divide, division\nsqrt, squareroot\nsquare\n!, factorial\nhcf, highestcommonfactor\nlcm, lowestcommonmultiple\nardt, approachratedoubletime, arifdt\n^, power`', false);
                message.reply({ embeds: [helpembed] })
                break;
            default:
                string = args.splice(/ +/).join(" ");
                try{evalstring = (eval(string.replaceAll("^", "**").replaceAll("pi", "Math.PI"))).toString()
                message.reply(evalstring)}
                catch(error){
                    message.reply("error")
                    console.log(error)
                }
                break;
        }
    }
}
//client.commands.get('').execute(message, args)