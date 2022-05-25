const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')
module.exports = {
    name: 'timeout',
    description: 'timeout',
    execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(adminlogdir, "\n" + "command executed - timeout")
        fs.appendFileSync(adminlogdir, "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(adminlogdir, "\n" + "")
        let user = message.mentions.members.first()
        let time = args.splice(1, 1).join(" ")
        let reason = args.splice(2, 100).join(" ")
        let reasonx = ' undefined reason'
        if (!reason) {
            reasonx = 'undefined reason'
        } else {
            reasonx = reason
        }
        if (isNaN(time)) {
            time = 1000 * 60 * 60 * 24 //ms -> s -> m -> h -> d
        }
        if (user) {
            try {
                //member = message.guild.members.fetch(user.id)
                user.timeout(time, reasonx).then( e => {
                message.reply("timed out user")
                fs.appendFileSync(adminlogdir, "\n" + `timed out ${user} AKA ${user.id} for ${reasonx} | ${time}`)
                fs.appendFileSync(adminlogdir, "\n" + "")
            })
            }
            catch (error) {
                message.reply("error")
                fs.appendFileSync(adminlogdir, "\n" + `cannot timeout ${user} AKA  ${user.id}`)
                fs.appendFileSync(adminlogdir, "\n" + error)
                fs.appendFileSync(adminlogdir, "\n" + "")
            }
        }
    }
}