const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')
module.exports = {
    name: 'timeout',
    description: 'timeout',
    execute(message, args, client, Discord, currentDate, currentDateISO) {
        let user = message.mentions.members.first()
        let time = args.splice(2, 2).join("")
        let reason = args.splice(3, 100).join(" ")
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
                member = message.guild.members.cache.get(user.id)
                member.timeout(time, reasonx)
                fs.appendFileSync(adminlogdir, "\n" + `timed out ${user} AKA ${user.id} for ${reaswon}`)
                fs.appendFileSync(adminlogdir, "\n" + "")
            }
            catch (error) {
                fs.appendFileSync(adminlogdir, "\n" + `cannot timeout ${user} AKA  ${user.id}`)
                fs.appendFileSync(adminlogdir, "\n" + error)
                fs.appendFileSync(adminlogdir, "\n" + "")
            }
        }
    }
}