const fs = require('fs');
module.exports = {
    name: 'ping',
    description: 'Pong!\n' +
        'Command: `sbr-ping`\n' +
        'Slash command: `/ping`'
    ,
    execute(message, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `Event: ping (message command)\nTime: ${currentDate} | ${currentDateISO}`)
            message.channel.send({ content: `Pong!\nLatency: ${Math.round(message.client.ws.ping)}ms`, allowedMentions: { repliedUser: false } });
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `Event: ping (interaction command)\nTime: ${currentDate} | ${currentDateISO}`)
            interaction.reply({ content: `Pong!\nLatency: ${interaction.client.ws.ping}ms`, allowedMentions: { repliedUser: false } });
        }

    },
}