import fs = require('fs');
import commandchecks = require('../../configs/commandchecks');

module.exports = {
    name: 'ping',
    description: 'Pong!\n' +
        'Command: `sbr-ping`\n' +
        'Slash command: `/ping`'
    ,
    execute(message, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        let starttime = new Date((fs.readFileSync('debug/starttime.txt')).toString())

        if (message != null) {
            fs.appendFileSync('commands.log', `\nEvent: ping (message command)\nTime: ${currentDate} | ${currentDateISO}\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`)
            let trueping = message.createdAt.getTime() - new Date().getTime() + 'ms'

            message.channel.send({ content: `Pong!\nClient latency: ${Math.round(client.ws.ping)}ms\nMessage Latency: ${trueping}`, allowedMentions: { repliedUser: false } });
        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nEvent: ping (interaction command)\nTime: ${currentDate} | ${currentDateISO}\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`)

            let admininfo: any = '';
            let trueping = interaction.createdAt.getTime() - new Date().getTime() + 'ms'

            if (commandchecks.isOwner(interaction.member.user.id)) {
                let uptime = Math.round((new Date().getTime() - starttime.getTime()) / 1000);
                let uptimehours = Math.floor(uptime / 3600) >= 10 ? Math.floor(uptime / 3600) : '0' + Math.floor(uptime / 3600);
                let uptimeminutes = Math.floor((uptime % 3600) / 60) >= 10 ? Math.floor((uptime % 3600) / 60) : '0' + Math.floor((uptime % 3600) / 60);
                let uptimeseconds = Math.floor(uptime % 60) >= 10 ? Math.floor(uptime % 60) : '0' + Math.floor(uptime % 60);
                admininfo = `Uptime: ${uptimehours}:${uptimeminutes}:${uptimeseconds}\nTimezone: ${starttime.toString().split('(')[1].split(')')[0]}`
            }
            interaction.reply({ content: `Pong!\nClient latency: ${client.ws.ping}ms\nInteraction Latency: ${trueping}\n${admininfo}`, allowedMentions: { repliedUser: false } });
        }

    },
}