const fs = require('fs');
module.exports = {
    name: 'ping',
    description: 'Pong!',
    execute(message, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `Event: ping (message command)\nTime: ${currentDate} | ${currentDateISO}`)
            message.channel.send(`Pong!\nLatency: ${Math.round(message.client.ws.ping)}ms`);
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `Event: ping (interaction command)\nTime: ${currentDate} | ${currentDateISO}`)
            interaction.reply(`Pong!\nLatency: ${interaction.client.ws.ping}ms`);
        }

    },
}