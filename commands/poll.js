const fs = require('fs')
module.exports = {
    name: 'poll',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, client, Discord, interaction, currentDate, currentDateISO, config) {
        let pollEmbedDefault = new Discord.MessageEmbed()
            .setDescription('✅ for yes\n❌ for no')
            ;


        let react = [
            '🇦',
            '🇧',
            '🇨',
            '🇩',
            '🇪',
            '🇫',
            '🇬',
            '🇭',
            '🇮',
            '🇯',
            '🇰',
            '🇱',
            '🇲',
            '🇳',
            '🇴',
            '🇵',
            '🇶',
            '🇷',
            '🇸',
            '🇹',
            '🇺',
            '🇻',
            '🇼',
            '🇽',
            '🇾',
            '🇿'
        ]
        
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - poll (message)\n${currentDate} | ${currentDateISO}\n recieved poll command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')

            let name = args.join(' ')
            if (!args[0]) {
                message.reply('Please specify a title!')
                return;
            }
            pollEmbedDefault.setTitle(`${name}`)
            message.delete()

            message.channel.send({ embeds: [pollEmbedDefault] }).then(sentEmbed => {
                sentEmbed.react("✅")
                sentEmbed.react("❌")
            })
        }
        if (interaction != null) {
            let options = interaction.options.getString('options')
            let title = interaction.options.getString('title')
            let optsarr = options.split('+')
            let optstxt = ''
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - poll (interaction)\n${currentDate} | ${currentDateISO}\n recieved poll command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\ntitle: ${title}\noptions: ${options}`, 'utf-8')


            for (i = 0; i < optsarr.length && i < 20; i++) {
                optstxt += `${react[i]} = ${optsarr[i]}\n`
            }
            pollEmbedDefault.setTitle(`${title}`)
            pollEmbedDefault.setDescription(`${optstxt}`)
            interaction.reply({ content: 'success', ephemeral: true })
            interaction.channel.send({ embeds: [pollEmbedDefault] }).then(sentEmbed => {
                for (i = 0; i < optsarr.length && i < 20; i++) {
                    sentEmbed.react(react[i])
                }
            })


        }

        fs.appendFileSync('commands.log', 'success\n\n', 'utf-8')
    }
}