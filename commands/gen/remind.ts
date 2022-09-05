import cmdchecks = require('../../src/checks');
import fs = require('fs');
import calc = require('../../src/calc');
import emojis = require('../../src/consts/emojis');
import colours = require('../../src/consts/colours');
import osufunc = require('../../src/osufunc');
import osumodcalc = require('osumodcalculator');
import osuApiTypes = require('../../src/types/osuApiTypes');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'remind',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides) {
        let commanduser;

        let time;
        let remindertxt;
        let sendtochannel;
        let user;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                time = args[0]
                remindertxt = args.join(' ').replaceAll(args[0], '')
                sendtochannel = true;
                user = obj.author;

                if (!args[0]) {
                    return obj.reply({ content: 'Please specify a time', allowedMentions: { repliedUser: false } })
                        .catch(error => { });

                }
                if (!args[1]) {
                    remindertxt = 'null'
                }
                if (!args[0].endsWith('d') && !args[0].endsWith('h') && !args[0].endsWith('m') && !args[0].endsWith('s') && !time.includes(':') && !time.includes('.')) {
                    return obj.reply({ content: 'Incorrect time format: please use `?d?h?m?s` or `hh:mm:ss`', allowedMentions: { repliedUser: false } })
                        .catch(error => { });
                }
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;

                remindertxt = obj.options.getString('reminder');
                time = obj.options.getString('time').replaceAll(' ', '');
                sendtochannel = obj.options.getBoolean('sendinchannel');
                user = obj.member.user;

                if (!time.endsWith('d') && !time.endsWith('h') && !time.endsWith('m') && !time.endsWith('s') && !time.includes(':') && !time.includes('.')) {
                    return obj.reply({ content: 'Incorrect time format: please use `d`, `h`, `m`, or `s`', ephemeral: true })
                        .catch(error => { });
                }
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }
        if (overrides != null) {

        }

        //==============================================================================================================================================================================================

        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-remind-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⬅'),
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-remind-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('◀'),
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-remind-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('▶'),
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-remind-${commanduser.id}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➡'),
            );

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'remind',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'time',
                    value: time
                },
                {
                    name: 'reminder',
                    value: remindertxt
                },
                {
                    name: 'sendinchannel',
                    value: sendtochannel
                },
                {
                    name: 'user',
                    value: user.id
                }
                ]
            ), 'utf-8')

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
        const reminder = new Discord.EmbedBuilder()
            .setColor(colours.embedColour.info.dec)
            .setTitle('REMINDER')
            .setDescription(`${remindertxt}`)

        sendremind(reminder, time, obj, sendtochannel, remindertxt, user)

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': {
                obj.react('✅')
                    .catch();
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                obj.reply({
                    content: 'success!',
                    ephemeral: true,
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                obj.edit({
                    content: '',
                    embeds: [],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                })
                    .catch();
            }
                break;
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