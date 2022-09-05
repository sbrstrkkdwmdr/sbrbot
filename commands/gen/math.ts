import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'math',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides) {
        let commanduser;

        let odcalc;
        let type;
        let num1;
        let num2;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                type = 'basic';
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                type = obj.options.getString('type')
                num1 = parseFloat(obj.options.getNumber('num1'))
                num2 = obj.options.getNumber('num2');
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-math-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-math-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-math-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-math-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'math',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                []
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        let equation = 'null';

        if (type == 'basic') {
            const string = args.join(' ')
            const evalstr = eval(cmdchecks.toMath(string).toString().replaceAll('^', '**').replaceAll('pi', 'Math.PI').toString()).toString()
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
                case '!':
                    equation = (`${calc.factorial(num1)}`)
                    break;
                case 'hcf':
                    if (!num2) {
                        equation = ('Missing second number.')
                    }
                    equation = (`${calc.findHCF(num1, num2)}`)
                    break;
                case 'lcm':
                    if (!num2) {
                        equation = ('Missing second number.')
                    }
                    equation = (`${calc.findLCM(num1, num2)}`)
                    break;
                case 'pythag':
                    if (!num2) {
                        equation = 'Missing second number.'
                    }
                    equation = (`${calc.pythag(num1, num2)}`)
                    break;
                case 'sigfig':
                    if (!num2) {
                        num2 = null
                    }
                    if (num2 < 2 && num2 != null) {
                        num2 = 2
                    }
                    equation = (`${calc.sigfig(num1, num2).number}\nTo ${calc.sigfig(num1, num2).sigfig} significant figures`)

                    break;
                case 'ardt':
                    equation = (`AR${osumodcalc.DoubleTimeAR(num1).ar}, ${osumodcalc.DoubleTimeAR(num1).ms}ms`)
                    break;
                case 'arht':
                    equation = (`AR${osumodcalc.HalfTimeAR(num1).ar}, ${osumodcalc.HalfTimeAR(num1).ms}ms`)
                    break;
                case 'oddt':
                    odcalc = osumodcalc.odDT(num1)
                    equation = (`OD${odcalc.od_num}\n300:+-${odcalc.hitwindow_300}\n100:+-${odcalc.hitwindow_100}\n50:+-${odcalc.hitwindow_50}`)
                    break;
                case 'odht':
                    odcalc = osumodcalc.odHT(num1)
                    equation = (`OD${odcalc.od_num}\n300:+-${odcalc.hitwindow_300}\n100:+-${odcalc.hitwindow_100}\n50:+-${odcalc.hitwindow_50}`)
                    break;
                case 'odms':
                    odcalc = osumodcalc.ODtoms(num1)
                    equation = (`300:+-${odcalc.range300}\n100:+-${odcalc.range100}\n50:+-${odcalc.range50}`)
                    break;
                case 'arms':
                    equation = (`${osumodcalc.ARtoms(num1)}ms`)
                    break;
                case 'msar':
                    equation = (`AR${osumodcalc.msToAR(num1)}`)
                    break;
                case 'modintstring':
                    equation = (`Mods: ${osumodcalc.ModIntToString(num1)}`)
                    break;
                default:
                    equation = ('Error - invalid type')
                    break;
            }

        }

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.reply({
                    content: `${equation}`,
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: `${equation}`,
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
        }



        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}