import fs = require('fs');
module.exports = {
    name: 'purge',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {

        let totalmessagecount = 1;
        let filteruser = null;

        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - purge (message)\n${currentDate} | ${currentDateISO}\n recieved purge command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}\nID:${absoluteID}\n`, 'utf-8')

            let member = message.guild.members.cache.get(message.author.id)
            if (!(member.permissions.has('Administrator') || member.permissions.has('ManageMessages'))) {
                message.reply({
                    content: 'You do not have permission to use this command.',
                    allowedMentions: {
                        repliedUser: false
                    },
                    failIfNotExists: true
                })
                return;
            }

            if (args[0] != null) {
                if (!isNaN(args[0])) {
                    totalmessagecount = parseInt(args[0]);
                }
            } else if (args[1] != null && !isNaN(args[1])) {
                totalmessagecount = parseInt(args[1]);
            } else if (args[2] != null && !isNaN(args[2])) {
                totalmessagecount = parseInt(args[2]);
            }
            if(totalmessagecount > 100){
                message.reply({
                    content: 'You can only delete up to 100 messages at a time.',
                    allowedMentions: {
                        repliedUser: false
                    },
                    failIfNotExists: true
                })
                return;
            }

            if (message.mentions.users.size > 0) {
                filteruser = message.mentions.users.first().id;
            }
            message.delete();

            if (filteruser != null) {
                message.channel.messages.fetch({ limit: totalmessagecount })
                    .then(messages => {
                        messages.filter(message => message.author.id == filteruser)
                            .forEach(
                                message => {
                                    message.delete().catch(error => {});
                                }
                            )
                    }).catch(error => {});
            } else {
                message.channel.messages.fetch({ limit: totalmessagecount })
                    .then(messages => {
                        messages.forEach(
                            message => {
                                message.delete().catch(error => {});
                            }
                        )
                    }).catch(error => {});
            }


        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\nID:${absoluteID}\n`, 'utf-8')

        }

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}