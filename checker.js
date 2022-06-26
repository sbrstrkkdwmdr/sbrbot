const checks = require('./configs/commandchecks.js')
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {

    client.on('messageCreate', message => {
        if (checks.checkisfileblocked(message.author.id)) {


            if (message.attachments.size > 0 && (message.attachments.every(a => checks.checkisvideo(a)) || message.attachments.every(a => checks.checkisimage(a)) || message.attachments.every(a => checks.checkisaudio(a)))) {
                //console.log('ee')
                //message.reply('balls')
                message.delete()
                message.channel.send('🤢🤮🤮🤢')
                message.channel.send(`File sent from <@${message.author.id}> spoilered: ||${message.attachments.first().url}||`)
            }
        }

    })

}
