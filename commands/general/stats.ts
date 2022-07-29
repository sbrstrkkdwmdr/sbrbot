import fs = require('fs')
module.exports = {
    name: 'stats',
    description: 'template text\n' +
    'Command: `sbr-command-name`\n' +
    'Options: \n' +
    '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction){
        if(message != null){
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let starttime = new Date((fs.readFileSync('debug/starttime.txt')).toString())
            let trueping = message.createdAt.getTime() - new Date().getTime() + 'ms'

            let uptime = Math.round((new Date().getTime() - starttime.getTime()) / 1000);
            let uptimehours = Math.floor(uptime / 3600) >= 10 ? Math.floor(uptime / 3600) : '0' + Math.floor(uptime / 3600);
            let uptimeminutes = Math.floor((uptime % 3600) / 60) >= 10 ? Math.floor((uptime % 3600) / 60) : '0' + Math.floor((uptime % 3600) / 60);
            let uptimeseconds = Math.floor(uptime % 60) >= 10 ? Math.floor(uptime % 60) : '0' + Math.floor(uptime % 60);
            let upandtime = `Uptime: ${uptimehours}:${uptimeminutes}:${uptimeseconds}\nTimezone: ${starttime.toString().split('(')[1].split(')')[0]}`

            message.channel.send({ content: `Client latency: ${Math.round(client.ws.ping)}ms\nMessage Latency: ${trueping}\n${upandtime}`, allowedMentions: { repliedUser: false } });

        }

//==============================================================================================================================================================================================

        if(interaction != null){
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

        }

        fs.appendFileSync('commands.log', '\nsuccess\n\n', 'utf-8')
    }
}