//const { danserpath } = require('../config.json')
//const { linkargs } = require('../main.js')

module.exports = { 
    name: 'replayrecordhelp',
    execute(message, args, Discord, currentDate, currentDateISO, osuapikey, osuauthtoken, osuclientid, osuclientsecret) {
    let helpembed = new Discord.MessageEmbed()
    .setTitle('osr recording help')
    .addField('info', "videos aren't auto-uploaded (yet)\ncredits:\nrecorded using [danser-go](https://wieku.me/danser)\ncreated by [Wieku](https://wieku.me/)", false)
    .addField('settings', "just put one of these names and it'll use those settings\n\nbluebudgie\nduckedboi\nhanoji\nidke\nikugoi\noniisanbaka\nother\nradiite\nsoragaton\nsaberstrikedefault\ndefault - used if message is empty", false)

    message.reply({ embeds: [helpembed] })

    console.group('--- COMMAND EXECUTION ---')
    console.log(`${currentDateISO} | ${currentDate}`)
    console.log("command executed - replayrecord help")
    let consoleloguserweeee = message.author
    console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
    console.log("")
    console.groupEnd()
    }
}