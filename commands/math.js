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
            case 'add':case '+':case 'addition':case 'sum':
                if(isNaN(part1) || isNaN(part2)) return message.reply("Error - NaN");
                let problemadd = Math.abs(part1 + part2);
                message.reply(`${problemadd}`)
                break;
            case 'subtract':case '-':case 'minus':case 'subtraction':case 'difference':
                if(isNaN(part1) || isNaN(part2)) return message.reply("Error - NaN");
                let problemsubtract = Math.abs(part1 - part2);
                message.reply(`${problemsubtract}`)
                break;
            case 'multiply':case '*':case 'multiplication':
                if(isNaN(part1) || isNaN(part2)) return message.reply("Error - NaN");
                let problemmultiply = Math.abs(part1 * part2);
                message.reply(`${problemmultiply}`)
                break;
            case 'divide':case '/':case 'division':
                if(isNaN(part1) || isNaN(part2)) return message.reply("Error - NaN");
                let problemdivide = Math.abs(part1 / part2);
                message.reply(`${problemdivide}`)
                break;
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
           /* case 'arht':
                let arht1 = Math.abs(part1 * 3)
                let arht2 = Math.abs(arht1 - 13)
                let arht3 = Math.abs(arht2 / 2)
                message.reply(`${arht3}`)
                break;*/
           // case 'add':
             //   break;
            case 'power':case '^':
                let powerof = Math.abs(part1 ** part2)
                message.reply(`${powerof}`)
                break;
            default:
                message.reply("method not found")
        }
    }
}
//client.commands.get('').execute(message, args)