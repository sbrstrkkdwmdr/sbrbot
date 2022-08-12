import ms = require('ms');
import fetch = require('node-fetch');
import notxt = require('../../configs/w');
import fs = require('fs');
import calc = require('../../calc/calculations');
import colours = require('../../configs/colours');

module.exports = {
    name: 'remind',
    description: 'null',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let timetype = ['s', 'm', 'h', 'd']

        async function sendremind(reminder, time, obj, sendchannel, remindertxt, usersent) {
            try {
                if (sendchannel == true) {
                    setTimeout(() => {
                        obj.channel.send({ content: `Reminder for <@${usersent.id}> \n${remindertxt}` })
                    }, calc.timeToMs(time));
                }
                else {
                    setTimeout(() => {
                        interaction.member.user.send({ embeds: [reminder] })
                    }, calc.timeToMs(time));
                }
            } catch (error) {
                console.log('embed error' + 'time:' + time + '\ntxt:' + remindertxt)
            }
        }

        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - help (message)\n${currentDate} | ${currentDateISO}\n recieved help command\nrequested by ${message.author.id} AKA ${message.author.tag}\n`, 'utf-8')

            let time = args[0]
            let remindertxt = args.join(' ').replaceAll(args[0], '')

            if (!args[0]) {
                return message.reply({ content: 'Please specify a time', allowedMentions: { repliedUser: false } })
            }
            if (!args[1]) {
                remindertxt = 'null'
            }
            if (!args[0].endsWith('d') && !args[0].endsWith('h') && !args[0].endsWith('m') && !args[0].endsWith('s') && !time.includes(':') && !time.includes('.')) {
                return message.reply({ content: 'Incorrect time format: please use `?d?h?m?s` or `hh:mm:ss`', allowedMentions: { repliedUser: false } })
            }
            let reminder = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.info.hex)
                .setTitle('REMINDER')
                .setDescription(`${remindertxt}`)


            sendremind(reminder, time, message, true, remindertxt, message.author);
            message.react("✅")
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nMessage Content: ${message.content}\n`)

        }
        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCOMMAND EVENT - reminder (interaction)\n${currentDate} | ${currentDateISO}\n recieved reminder command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}\n`, 'utf-8')

            let remindertxt = interaction.options.getString('reminder')
            let time = interaction.options.getString('time').replaceAll(' ', '')

            if (!time.endsWith('d') && !time.endsWith('h') && !time.endsWith('m') && !time.endsWith('s') && !time.includes(':') && !time.includes('.')) {
                return interaction.reply({ content: 'Incorrect time format: please use `d`, `h`, `m`, or `s`', ephemeral: true })
            }

            let reminder = new Discord.EmbedBuilder()
                .setColor(colours.embedColour.info.hex)
                .setTitle('REMINDER')
                .setDescription(`${remindertxt}`)

            interaction.reply({ content: 'success!', ephemeral: true, allowedMentions: { repliedUser: false } })

            let sendtochannel = interaction.options.getBoolean('sendinchannel')
            if (sendtochannel == true) {

                sendremind(reminder, time, interaction, true, remindertxt, interaction.member.user);

            } else {
                sendremind(reminder, time, interaction, false, remindertxt, interaction.member.user);
            }
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`, `\nCommand Information\nreminder:${remindertxt}\ntime:${time}\nSendInChannel:${sendtochannel}\n`)
        }
    }
}
