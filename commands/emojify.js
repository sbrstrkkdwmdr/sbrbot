const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')
module.exports = {
    name : 'emojify',
    description : 'Make any sentence out of emoji\'s',

    execute : async(message, args, currentDate, currentDateISO) => {
if(message.author.id == '503794887318044675'){        let sentence = '';

        let chars = {
            char1: ':one:',
            char2: ':two:',
            char3: ':three:',
            char4: ':four:',
            char5: ':five:',
            char6: ':six:',
            char7: ':seven:',
            char8: ':eight:',
            char9: ':nine:',
            "char+": ':heavy_plus_sign:',
            "char-": ':heavy_minus_sign:',
            "char*": ':asterisk:',
            "char÷": ':heavy_division_sign:',
            "char#": ':hash:',
            "char!": `:exclamation:`
        }
        
        for(let e of args.join(' ')) {
            if(/([a-z])/gim.test(e)) sentence += `:regional_indicator_${e.toLowerCase()}:`
            else if(/\s/.test(e)) sentence += ':blue_square:'
            else if(/([1-9])/.test(e) || ['+', '-', '*', '#', '!', '÷'].includes(e)) sentence += chars[`char${e}`]
            else sentence += e
        }
        message.delete();
        message.channel.send(`${sentence}`)}
        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - emojify")
        fs.appendFileSync(otherlogdir, "\n" + "category - general")
        let consoleloguserweeee = message.author
        fs.appendFileSync(otherlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(otherlogdir, "\n" + "")
        console.groupEnd()
    }
}