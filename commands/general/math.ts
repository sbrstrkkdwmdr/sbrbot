import fs = require('fs');
import calculations = require('../../calc/calculations');
import osucalc = require('osumodcalculator');
import cmdchecks = require('../../calc/commandchecks');
import colours = require('../../configs/colours');

module.exports = {
    name: 'math',
    description: 'null',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let odcalc;
        if (message != null) {
            if (args[0] == 'help') {
                return message.reply({
                    content:
                        `-
                    + = add
                    - = subtract
                    / = divide
                    * = multiply
                    ^ = exponent/power
                    ** = exponent/power
                    % = divide and return remainder
                    ++ = +1
                    -- = -1
                    `, allowedMentions: { repliedUser: false }
                }
                )
                    .catch(error => { });

            }
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - math (message)\n${currentDate} | ${currentDateISO}\n recieved math command\nrequested by ${message.author.id} AKA ${message.author.tag}\n`, 'utf-8')
            let string = args.join(' ')
            /*             let letterstoavoid = [
                            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                            '{', '}', '[', ']', '&', '|', '~', '<<', '>>'
                        ]
                        let isvalid = letterstoavoid.find(v => (string.includes(v)))
                        if (isvalid) return message.channel.send('Invalid string - letters or unallowed characters found') */
            try {
                let evalstr = eval(cmdchecks.toMath(string).toString().replaceAll('^', '**').replaceAll('pi', 'Math.PI').toString()).toString()
                message.reply({ content: evalstr, allowedMentions: { repliedUser: false } })

            } catch (error) {
                message.reply({ content: `There was an error calculating.\nPlease use numbers and symbols only`, allowedMentions: { repliedUser: false } })
                    .catch(error => { });

                console.log(error)
            }
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nMessage Content: ${message.content}\n`)
        }
        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - math (interaction)\n${currentDate} | ${currentDateISO}\n recieved math command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')
            let type = interaction.options.getString('type')
            let num1 = interaction.options.getNumber('num1')
            let num2 = interaction.options.getNumber('num2')

            let equation = 'null'
            interaction.reply({ content: 'calculating... ', allowedMentions: { repliedUser: false } })
                .catch(error => { });

            setTimeout(() => {

                switch (type) {
                    case 'sqrt':
                        equation = (`${Math.sqrt(num1)}`)
                        break;
                    case 'square':
                        if (num2) {
                            equation = (`${num1 ** num2}`)
                        }
                        equation = (`${num1 * num1}`)
                        break;
                    case 'factorial':
                        equation = (`${calculations.factorial(num1)}`)
                        break;
                    case 'hcf':
                        if (!num2) {
                            equation = ('Missing second number.')
                        }
                        equation = (`${calculations.findHCF(num1, num2)}`)
                        break;
                    case 'lcm':
                        if (!num2) {
                            equation = ('Missing second number.')
                        }
                        equation = (`${calculations.findLCM(num1, num2)}`)
                        break;
                    case 'pythag':
                        if (!num2) {
                            equation = 'Missing second number.'
                        }
                        equation = (`${calculations.pythag(num1, num2)}`)
                        break;
                    case 'sigfig':
                        if (!num2) {
                            num2 = null
                        }
                        if (num2 < 2 && num2 != null) {
                            num2 = 2
                        }
                        equation = (`${calculations.sigfig(num1, num2).number}\nTo ${calculations.sigfig(num1, num2).sigfig} significant figures`)

                        break;
                    case 'ardt':
                        equation = (`AR${osucalc.DoubleTimeAR(num1).ar}, ${osucalc.DoubleTimeAR(num1).ms}ms`)
                        break;
                    case 'arht':
                        equation = (`AR${osucalc.HalfTimeAR(num1).ar}, ${osucalc.HalfTimeAR(num1).ms}ms`)
                        break;
                    case 'oddt':
                        odcalc = osucalc.odDT(num1)
                        equation = (`OD${odcalc.od_num}\n300:+-${odcalc.hitwindow_300}\n100:+-${odcalc.hitwindow_100}\n50:+-${odcalc.hitwindow_50}`)
                        break;
                    case 'odht':
                        odcalc = osucalc.odHT(num1)
                        equation = (`OD${odcalc.od_num}\n300:+-${odcalc.hitwindow_300}\n100:+-${odcalc.hitwindow_100}\n50:+-${odcalc.hitwindow_50}`)
                        break;
                    case 'odms':
                        odcalc = osucalc.ODtoms(num1)
                        equation = (`300:+-${odcalc.range300}\n100:+-${odcalc.range100}\n50:+-${odcalc.range50}`)
                        break;
                    case 'arms':
                        equation = (`${osucalc.ARtoms(num1)}ms`)
                        break;
                    case 'msar':
                        equation = (`AR${osucalc.msToAR(num1)}`)
                        break;
                    case 'modintstring':
                        equation = (`Mods: ${osucalc.ModIntToString(num1)}`)
                        break;
                    default:
                        equation = ('Error - invalid type')
                        break;
                }
                interaction.editReply({ content: equation, allowedMentions: { repliedUser: false } })
                    .catch(error => { });

            }, 500)

            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\ntype: ${type}\nnum1: ${num1}\nnum2: ${num2}`)
        }
    }
}