const fs = require('fs')
const commandchecks = require('../configs/commandchecks.js');

module.exports = {
    name: 'say',
    description: 'template text\n' +
    'Command: `sbr-command-name`\n' +
    'Options: \n' +
    '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction){
        if(message != null){
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - say (message)\n${currentDate} | ${currentDateISO}\n recieved say command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')
            if(commandchecks.isOwner(message.author.id)){
            message.delete();
            message.channel.send(args.join(' '))
            } else {
                message.channel.send('L + ratio + no + you do not have permissions + no bitches + L')
            }
            return;
        }
        if(interaction != null){
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - say (interaction)\n${currentDate} | ${currentDateISO}\n recieved say command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            let msg = interaction.options.getString('message')
            let channel = interaction.options.getChannel('channel')
            //console.log(channel)
            if(!channel){
                channel = interaction.channel
            }
            interaction.reply({content: 'success', ephemeral: true})
            if(commandchecks.isOwner(interaction.member.user.id)){
                return 
            }
            channel.send(`${msg}`)
        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}