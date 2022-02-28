//const { danserpath } = require('../config.json')
//const { linkargs } = require('../main.js')

module.exports = { 
    name: 'replayrecord',
    execute(exec, linkargs, message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
    /*let settings = linkargs;
    if(!settings || settings == 'undefined' || settings == null || settings == 'null') {
    message.reply('no arguments set. using default (saberstrike skin)')
    settings = 'saberstrikedefault'
    }*/
    //^this if statement thingy breaks exec for some reason
    currentDatefileformat = JSON.stringify(currentDate).replaceAll(':', ';').replaceAll('|', '').replaceAll('{', '').replaceAll('"', '').replaceAll('}', '')
    //console.log(currentDatefileformat)
    

    let output1 = `${message.author.id}s play at ${currentDatefileformat}`;
    let output = JSON.stringify(output1).replaceAll(' ', '_').replaceAll('|', '').replaceAll('{', '').replaceAll('"', '').replaceAll('}', '');
    //console.log(output)
    exec('C:/Users/saber/Desktop/danser-go-dev/danser-go-dev-OTHERS/danser.exe -skip -settings=' + linkargs + ' -r="C:/Users/saber/Desktop/kusa/bot/sbrbot/files/replay.osr" -out=' + output)
    console.group('--- COMMAND EXECUTION ---')
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log("command executed - replayrecord")
    let consoleloguserweeee = message.author
    console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    console.log("")
    console.groupEnd()
    message.channel.send('retrieving osr')

    }
}