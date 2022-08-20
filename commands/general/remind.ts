import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
import calc = require('../../calc/calculations');

module.exports = {
    name: 'remind',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let time;
        let remindertxt;
        let sendtochannel;
        let user;

        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - remind (message)
${currentDate} | ${currentDateISO}
recieved remind command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            time = args[0]
            remindertxt = args.join(' ').replaceAll(args[0], '')
            sendtochannel = true;
            user = message.author;

            if (!args[0]) {
                return message.reply({ content: 'Please specify a time', allowedMentions: { repliedUser: false } })
                    .catch(error => { });

            }
            if (!args[1]) {
                remindertxt = 'null'
            }
            if (!args[0].endsWith('d') && !args[0].endsWith('h') && !args[0].endsWith('m') && !args[0].endsWith('s') && !time.includes(':') && !time.includes('.')) {
                return message.reply({ content: 'Incorrect time format: please use `?d?h?m?s` or `hh:mm:ss`', allowedMentions: { repliedUser: false } })
                    .catch(error => { });

            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - remind (interaction)
${currentDate} | ${currentDateISO}
recieved remind command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            remindertxt = interaction.options.getString('reminder');
            time = interaction.options.getString('time').replaceAll(' ', '');
            sendtochannel = interaction.options.getBoolean('sendinchannel');
            user = interaction.member.user;

            if (!time.endsWith('d') && !time.endsWith('h') && !time.endsWith('m') && !time.endsWith('s') && !time.includes(':') && !time.includes('.')) {
                return interaction.reply({ content: 'Incorrect time format: please use `d`, `h`, `m`, or `s`', ephemeral: true })
                    .catch(error => { });
            }
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - remind (interaction)
${currentDate} | ${currentDateISO}
recieved remind command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
time: ${time}
reminder: ${remindertxt}
sendtochannel: ${sendtochannel}
user: ${user.id}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        async function sendremind(reminder, time, obj, sendchannel, remindertxt, usersent) {
            try {
                if (sendchannel == true) {
                    setTimeout(() => {
                        obj.channel.send({ content: `Reminder for <@${usersent.id}> \n${remindertxt}` })

                    }, calc.timeToMs(time));
                }
                else {
                    setTimeout(() => {
                        usersent.send({ embeds: [reminder] })

                    }, calc.timeToMs(time));
                }
            } catch (error) {
                console.log('embed error' + 'time:' + time + '\ntxt:' + remindertxt)
            }
        }
        let reminder = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.info.hex)
            .setTitle('REMINDER')
            .setDescription(`${remindertxt}`)

        sendremind(reminder, time, obj, sendtochannel, remindertxt, user)

        //SEND/EDIT MSG==============================================================================================================================================================================================

        if (message != null && interaction == null && button == null) {
            message.react("✅")
        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                content: 'success!',
                ephemeral: true,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
        }


        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}