const fs = require('fs')
const { helplogdir } = require('../logconfig.json')

module.exports = {
    name: 'math2',
    description: '',
    execute(interaction, args, Discord, options, currentDate, currentDateISO, ) {
        fs.appendFileSync(helplogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(helplogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(helplogdir, "\n" + "command executed - math")
        fs.appendFileSync(helplogdir, "\n" + "category - help")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync(helplogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(helplogdir, "\n" + "") 
        console.groupEnd()
      //  let part1 = parseInt(args[1]);
        //let part2 = parseInt(args[2]);
        let part1 = options.getNumber('num1')
        let part2 = options.getNumber('num2')

      //  if(isNaN(part2)) return interaction.reply("Second number not found");
        let mathtype = options.getString('type')
        if(!part2){
            part2 = '1'
        }

        if(!part1){
            mathtype = 'help'
        }
        switch(mathtype){
            case 'add':case '+':case 'addition':case 'sum':
                if(isNaN(part1) || isNaN(part2)) return interaction.reply("Error - NaN");
                let problemadd = Math.abs(part1 + part2);
                interaction.reply(`${problemadd}`)
                break;
            case 'subtract':case '-':case 'minus':case 'subtraction':case 'difference':
                if(isNaN(part1) || isNaN(part2)) return interaction.reply("Error - NaN");
                let problemsubtract = Math.abs(part1 - part2);
                interaction.reply(`${problemsubtract}`)
                break;
            case 'multiply':case '*':case 'multiplication':case 'product':
                if(isNaN(part1) || isNaN(part2)) return interaction.reply("Error - NaN");
                let problemmultiply = Math.abs(part1 * part2);
                interaction.reply(`${problemmultiply}`)
                break;
            case 'divide':case '/':case 'division':
                if(isNaN(part1) || isNaN(part2)) return interaction.reply("Error - NaN");
                let problemdivide = Math.abs(part1 / part2);
                interaction.reply(`${problemdivide}`)
                break;
            case 'squareroot':case 'sqrt':
                if(isNaN(part1)) return interaction.reply("Error - NaN");
                let problemsqrt = Math.sqrt(part1)
                interaction.reply(`${problemsqrt}`)
                break;
            case 'square':
                if(isNaN(part1)) return interaction.reply("Error - NaN");
                if (part1 < 1) return interaction.reply("Error - values are too low");
                let problemsquare = Math.abs(part1 * part1)
                interaction.reply(`${problemsquare}`)
                break;
            case 'factorial':case '!':
                if(isNaN(part1)) return interaction.reply("Error - NaN");
                function factorial(part1){
                    if(part1 == 0 || part1 == 1){
                        return 1;
                    }else{
                        return part1 * factorial(part1-1);
                    }
                }
                problemfactorial = factorial(part1)
                interaction.reply(`${problemfactorial}`)
                break;
            case 'hcf':case 'highestcommonfactor':
                if(isNaN(part1) || isNaN(part2)) return interaction.reply("Error - NaN");
                if(part1 != Math.round(part1) || part2 != Math.round(part2)) return interaction.reply("Error - numbers must be integers");
                if (part1 < 1 || part2 < 1) return interaction.reply("Error - values are too low");
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
                interaction.reply(`${problemhcf}`)
                break;
            case 'lcm':case 'lowestcommonmultiple':
                if(isNaN(part1) || isNaN(part2)) return interaction.reply("Error - NaN");
                if(part1 != Math.round(part1) || part2 != Math.round(part2)) return interaction.reply("Error - numbers must be integers");
                if (part1 < 1 || part2 < 1) return interaction.reply("Error - values are too low");
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
                  interaction.reply(`${problemlcm}`)
                  break;
            case 'ardt':case 'approachratedoubletime':case 'arifdt':
                let ARDT1 = Math.abs(part1 * 2 + 13);
                let ARDT2 = Math.abs(ARDT1 / 3);
                    interaction.reply(`${ARDT2}`)
                break;
           /* case 'arht':
                let arht1 = Math.abs(part1 * 3)
                let arht2 = Math.abs(arht1 - 13)
                let arht3 = Math.abs(arht2 / 2)
                interaction.reply(`${arht3}`)
                break;*/
           // case 'add':
             //   break;
            case 'power':case '^':
                let powerof = Math.abs(part1 ** part2)
                interaction.reply(`${powerof}`)
                break;
            case 'circumference':
                let circumference1 = Math.abs(2* Math.PI * part1 ); 
                interaction.reply(`${circumference1}`)
                break;
            case 'circlearea':
                let area = Math.abs(Math.PI*(part1**2))
                interaction.reply(`${area}`)
                break;
            case 'help':
                let helpembed = new Discord.MessageEmbed()
                .setTitle('math command')
                //.addField('Tutorial', '`sbr-math (method) (num1) (num2)`\neg. `sbr-math divide 6 2`\nresult=3', false)
                .addField('Methods', '`+, add, addition, sum\n-, subtract, substraction, difference\n*, multiply, multiplication, product\n/, divide, division\nsqrt, squareroot\nsquare\n!, factorial\nhcf, highestcommonfactor\nlcm, lowestcommonmultiple\nardt, approachratedoubletime, arifdt\n^, power`', false);
                interaction.reply({ embeds: [helpembed] })
                break;
            default:
                interaction.reply("method not found. use /math help")
                break;
        }
    }
}
//client.commands.get('').execute(message, args)