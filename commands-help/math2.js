const fs = require('fs')
const { helplogdir } = require('../logconfig.json')
const { findHCF, findLCM, pythag, sigfig } = require('../calculations/other')
const {doubletimear, halftimear} = require('../calculations/approachrate')

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
                    let problemhcf = findHCF(part1, part2);
                    message.reply(`${problemhcf}`)
                break;
            case 'lcm':case 'lowestcommonmultiple':
                    if(isNaN(part1) || isNaN(part2)) return message.reply("Error - NaN");
                    if(part1 != Math.round(part1) || part2 != Math.round(part2)) return message.reply("Error - numbers must be integers");
                    if (part1 < 1 || part2 < 1) return message.reply("Error - values are too low");
                    let problemlcm = findLCM(part1, part2);
                    message.reply(`${problemlcm}`)
                    break;
            case 'ardt':case 'approachratedoubletime':case 'arifdt':
                    let artodt = doubletimear(part1)
                    message.reply(`${artodt}`)
                break;
            case 'arht':case 'approachratehalftime':case 'arifht':
                let artoht = halftimear(part1)
                message.reply(`${artoht}`)
            break;
            case 'circumference':
                let circumference1 = Math.abs(2* Math.PI * part1 ); 
                message.reply(`${circumference1}`)
                break;
            case 'circlearea':
                let area = Math.abs(Math.PI*(part1**2))
                message.reply(`${area}`)
                break;
            case 'pythag':case 'hypotenuse':
                if(!part2 || isNaN(part2)) return message.reply("error") 
                let pythaganswer = pythag(part1, part2);
                message.reply(`${pythaganswer}`)
                break;
            case 'sigfig':case 'scientificnotation':
                let sigfiganswer = sigfig(part1, part2)
                message.reply(`${sigfiganswer}`)
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