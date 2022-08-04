import fs = require('fs')
module.exports = {
    name: 'skin',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    async execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        if (message != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - skin (message)\n${currentDate} | ${currentDateISO}\n recieved get user skin command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let searchid = message.author.id
            let user: any;
            let skin;
            if (message.mentions.users.size > 0) {
                searchid = message.mentions.users.first().id
            }
            let findname;
            findname = await userdata.findOne({ where: { userid: searchid } })
            if (findname == null) {
                return message.reply({ content: 'Error - user not found', allowedMentions: { repliedUser: false }, failIfNotExists: true })
            } else {
                skin = findname.get('skin')
                if (skin.length < 1 || skin == null) {
                    return message.reply({ content: 'Error - no skin is set for the user', allowedMentions: { repliedUser: false }, failIfNotExists: true })
                }
            }
            let Embed = new Discord.EmbedBuilder()
                .setDescription(`<@${searchid}>'s skin\nSkin: ${skin}`)
            message.reply({
                embeds: [Embed],
                allowedMentions: { repliedUser: false }
            })
            let endofcommand = new Date().getTime();
            let timeelapsed = endofcommand - currentDate.getTime();
            fs.appendFileSync(`commands.log`, `\nCommand Latency (message command => skin) - ${timeelapsed}ms\n`)

        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

        }

        fs.appendFileSync(`commands.log`, 'success\n\n', 'utf-8')
    }
}