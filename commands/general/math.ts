import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
import calculations = require('../../calc/calculations');
import osucalc = require('osumodcalculator');

module.exports = {
    name: 'math',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let odcalc;
        let type;
        let num1;
        let num2;
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - math (message)
${currentDate} | ${currentDateISO}
recieved math command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            type = 'basic'
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - math (interaction)
${currentDate} | ${currentDateISO}
recieved math command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            type = interaction.options.getString('type')
            num1 = parseFloat(interaction.options.getNumber('num1'))
            num2 = interaction.options.getNumber('num2')
            await interaction.reply({ content: 'calculating... ', allowedMentions: { repliedUser: false } })
                .catch(error => { });
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - math (interaction)
${currentDate} | ${currentDateISO}
recieved math command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
type: ${type}
num1: ${num1}
num2: ${num2}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        let equation = 'null'

        if (type == 'basic') {
            let string = args.join(' ')
            let evalstr = eval(cmdchecks.toMath(string).toString().replaceAll('^', '**').replaceAll('pi', 'Math.PI').toString()).toString()
            equation = evalstr
        } else if (type == 'help') {
            equation = `-
+ = add
- = subtract
/ = divide
* = multiply
^ = exponent/power
** = exponent/power
% = divide and return remainder
++ = +1
-- = -1
            `
        }
        else {
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

        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        setTimeout(() => {

            if ((message != null || interaction == null) && button == null) {
                obj.reply({
                    content: equation,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).catch(error => { });

            }
            if (button != null) {
                message.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
            }
        }, 1000)

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}