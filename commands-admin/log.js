//new module export
module.exports = {
    name: 'log',
    description: 'returns the logs of the guild',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            message.reply({ files: [`./logs/${message.guild.id}.log`], allowedMentions: { repliedUser: false } });
        }
    }
}