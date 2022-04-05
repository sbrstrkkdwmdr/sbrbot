//const { danserpath } = require('../config.json')
//const { linkargs } = require('../main.js')
const { danserpath } = require('../config.json')
const { linkfetchlogdir } = require('../logconfig.json')

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
    fs.appendFileSync(linkfetchlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
    fs.appendFileSync(linkfetchlogdir, "\n" + "command executed - replayrecord")
    fs.appendFileSync(linkfetchlogdir, "\n" + "category - osu")
    let consoleloguserweeee = message.author
    fs.appendFileSync(linkfetchlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    fs.appendFileSync(linkfetchlogdir, "\n" + "")

    let output1 = `${message.author.id}s play at ${currentDatefileformat}`;
    let output = JSON.stringify(output1).replaceAll(' ', '_').replaceAll('|', '').replaceAll('{', '').replaceAll('"', '').replaceAll('}', '');
    //console.log(output)
    exec(danserpath + 'danser.exe -skip -settings=' + linkargs + ' -r="files/replay.osr" -out=' + output)
    console.group('--- COMMAND EXECUTION ---')
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log("command executed - replayrecord")
    console.log("category - osu")
    //let consoleloguserweeee = message.author
    console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    console.log("")
    console.groupEnd()
    message.channel.send('retrieving osr')

    }
}