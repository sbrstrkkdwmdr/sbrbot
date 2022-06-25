const ms = require('ms')
const fetch = require('node-fetch')
const notxt = require('../configs/w.js')
const fs = require('fs')
module.exports = {
    name: 'remind',
    description: 'null',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction) {
        let timetype = ['s', 'm', 'h', 'd']
        if (message != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - help (message)\n${currentDate} | ${currentDateISO}\n recieved help command\nrequested by ${message.author.id} AKA ${message.author.tag}`, 'utf-8')

            let time = args[0]
            let remindertxt = args.join(' ').replaceAll(args[0], '')

            if (!args[0]) {
                return message.channel.send('Please specify a time')
            }
            if (!args[1]) {
                remindertxt = notxt.chocomintshort
            }
            if (!args[0].endsWith('d') && !args[0].endsWith('h') && !args[0].endsWith('m') && !args[0].endsWith('s')) {
                return message.channel.send('Incorrect time format: please use `d`, `h`, `m`, or `s`')
            }
            let reminder = new Discord.MessageEmbed()
                .setColor('#7289DA')
                .setTitle('REMINDER')
                .setDescription(`${remindertxt}`)

            async function sendremind() {
                try {
                    setTimeout(() => {
                        message.channel.send({ embeds: [reminder] })
                    }, ms(`${time}`));
                } catch (error) {
                    console.log('embed error' + 'time:' + time + '\ntxt:' + remindertxt)
                }
            }
            sendremind();
            fs.appendFileSync('commands.log', `\nCommand Information\nMessage Content: ${message.content}`)

        }
        if (interaction != null) {
            fs.appendFileSync('commands.log', `\nCOMMAND EVENT - reminder (interaction)\n${currentDate} | ${currentDateISO}\n recieved reminder command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            let remindertxt = interaction.options.getString('reminder')
            let time = interaction.options.getString('time').replaceAll(' ', '')

            if (!time.endsWith('d') && !time.endsWith('h') && !time.endsWith('m') && !time.endsWith('s')) {
                return interaction.reply({ content: 'Incorrect time format: please use `d`, `h`, `m`, or `s`', ephemeral: true })
            }

            let reminder = new Discord.MessageEmbed()
                .setColor('#7289DA')
                .setTitle('REMINDER')
                .setDescription(`${remindertxt}`)

            interaction.reply({ content: 'success!', ephemeral: true })

            let sendtochannel = interaction.options.getBoolean('sendinchannel')
            if (sendtochannel == true) {
                async function sendremind() {
                    try {
                        setTimeout(() => {
                            interaction.channel.send({ embeds: [reminder] })
                        }, ms(`${time}`));
                    } catch (error) {
                        console.log('embed error' + 'time:' + time + '\ntxt:' + remindertxt)
                    }
                }
                sendremind();

            } else {
                async function sendremind() {
                    try {
                        setTimeout(() => {
                            interaction.member.user.send({ embeds: [reminder] })
                        }, ms(`${time}`));
                    } catch (error) {
                        console.log('embed error' + 'time:' + time + '\ntxt:' + remindertxt)
                    }
                }
                sendremind();
            }
            fs.appendFileSync('commands.log', `\nCommand Information\nreminder:${remindertxt}\ntime:${time}\nSendInChannel:${sendtochannel}`)
        }
    }
}
