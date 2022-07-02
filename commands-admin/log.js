//new module export
module.exports = {
    name: 'log',
    description: 'returns the logs of the guild',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - log (message)\n${currentDate} | ${currentDateISO}\n recieved get guild logs command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')

            message.reply({ files: [`./logs/${message.guild.id}.log`], allowedMentions: { repliedUser: false } });
        }
        //==============================================================================================================================================================================================
        if(interaction != null){
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - log (interaction)\n${currentDate} | ${currentDateISO}\n recieved get guild logs command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

        }
    }
}