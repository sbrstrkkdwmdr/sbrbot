import fs = require('fs')
module.exports = {
    name: 'stats',
    description: 'template text\n' +
    'Command: `sbr-command-name`\n' +
    'Options: \n' +
    '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj){
        if(message != null){
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}\n`, 'utf-8')
            let starttime = new Date((fs.readFileSync('debug/starttime.txt')).toString())
            let trueping = message.createdAt.getTime() - new Date().getTime() + 'ms'

            let uptime = Math.round((new Date().getTime() - starttime.getTime()) / 1000);
            let uptimehours = Math.floor(uptime / 3600) >= 10 ? Math.floor(uptime / 3600) : '0' + Math.floor(uptime / 3600);
            let uptimeminutes = Math.floor((uptime % 3600) / 60) >= 10 ? Math.floor((uptime % 3600) / 60) : '0' + Math.floor((uptime % 3600) / 60);
            let uptimeseconds = Math.floor(uptime % 60) >= 10 ? Math.floor(uptime % 60) : '0' + Math.floor(uptime % 60);
            let upandtime = `Uptime: ${uptimehours}:${uptimeminutes}:${uptimeseconds}\nTimezone: ${starttime.toString().split('(')[1].split(')')[0]}`

            let totalusers:any = client.users.cache.size;
            let totalusersnobots:any;
            let totalguilds:any = client.guilds.cache.size;
            let commandssent:any = fs.existsSync('logs/totalcommands.txt') ? fs.readFileSync('logs/totalcommands.txt').length : '0';

            message.channel.send({ content: 
`Client latency: ${Math.round(client.ws.ping)}ms
Message Latency: ${trueping}
${upandtime}
Guilds: ${totalguilds}
Users: ${totalusers}
Commands sent: ${commandssent}
Prefix: ${config.prefix}
Commands: https://sbrstrkkdwmdr.github.io/sbrbot/commands
`,
                allowedMentions: { repliedUser: false } });

        }

//==============================================================================================================================================================================================

        if(interaction != null){
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')

        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}