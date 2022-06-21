const fs = require('fs')

module.exports = {
    name: 'replayparse',
    description: 'replayparse',
    execute(message, userdata, Discord, osuApiKey, osuClientID, osuClientSecret, config, currentDate, currentDateISO) {
        fs.appendFileSync('link.log', `LINK DETECT EVENT - replayparse\n${currentDate} ${currentDateISO}\n${message.author.username}#${message.author.discriminator} (${message.author.id}) used osu!score link: ${message.content}\n`, 'utf-8')

    }
}