import fs = require('fs')
module.exports = {
    name: 'poll',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        let pollEmbedDefault = new Discord.EmbedBuilder()
            .setDescription('ā for yes\nā for no')
            ;


        let react = [
            'š¦',
            'š§',
            'šØ',
            'š©',
            'šŖ',
            'š«',
            'š¬',
            'š­',
            'š®',
            'šÆ',
            'š°',
            'š±',
            'š²',
            'š³',
            'š“',
            'šµ',
            'š¶',
            'š·',
            'šø',
            'š¹',
            'šŗ',
            'š»',
            'š¼',
            'š½',
            'š¾',
            'šæ'
        ]

        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - poll (message)\n${currentDate} | ${currentDateISO}\n recieved poll command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')

            let name = args.join(' ')
            if (!args[0]) {
                message.reply({ content: 'Please specify a title!', allowedMentions: { repliedUser: false } })
                return;
            }
            pollEmbedDefault.setTitle(`${name}`)
            message.delete()

            message.channel.send({ embeds: [pollEmbedDefault] }).then(sentEmbed => {
                sentEmbed.react("ā")
                sentEmbed.react("ā")
            })
        }
        if (interaction != null) {
            let options = interaction.options.getString('options')
            let title = interaction.options.getString('title')
            let optsarr = options.split('+')
            let optstxt = ''
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - poll (interaction)\n${currentDate} | ${currentDateISO}\n recieved poll command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\ntitle: ${title}\noptions: ${options}`, 'utf-8')

            let i:number;
            let curtxt:string;
            for (i = 0; i < optsarr.length && i < 20; i++) {
                if (optsarr[i].length > 150) {
                    curtxt = optsarr[i].substring(0, 149) + '...'
                    optstxt += `${react[i]} = ${curtxt}\n`

                } else {
                    optstxt += `${react[i]} = ${optsarr[i]}\n`
                }
            }
            pollEmbedDefault.setTitle(`${title}`)
            pollEmbedDefault.setDescription(`${optstxt}`)
            interaction.reply({ content: 'success', ephemeral: true, allowedMentions: { repliedUser: false } })
            interaction.channel.send({ embeds: [pollEmbedDefault] }).then(sentEmbed => {
                for (i = 0; i < optsarr.length && i < 20; i++) {
                    sentEmbed.react(react[i])
                }
            })


        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}