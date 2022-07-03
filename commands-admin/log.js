const checks = require('../configs/commandchecks.js')
module.exports = {
    name: 'log',
    description: 'returns the logs of the guild',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - log (message)\n${currentDate} | ${currentDateISO}\n recieved get guild logs command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            if (checks.isOwner(message.author.id) || message.author.permissions.has('ADMINISTRATOR')) {
                message.reply({ files: [`./logs/${message.guild.id}.log`], allowedMentions: { repliedUser: false } });
            } else {
                message.reply('you do not have permission to use this command')
            }
        }
        //==============================================================================================================================================================================================
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - log (interaction)\n${currentDate} | ${currentDateISO}\n recieved get guild logs command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')
            if (checks.isOwner(interaction.member.user.id) || interaction.member.permissions.has('ADMINISTRATOR')) {
                interaction.reply({ files: [`./logs/${interaction.guild.id}.log`], allowedMentions: { repliedUser: false } });
            } else {
                interaction.reply('you do not have permission to use this command')
            }
        }
    }
}