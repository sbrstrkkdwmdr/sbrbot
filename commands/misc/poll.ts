import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'poll',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let name = 'poll';
        let options = '+';
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - poll (message)
${currentDate} | ${currentDateISO}
recieved poll command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            name = args.join(' ');
            if (!args[0]) {
                name = 'poll';
            }
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - poll (interaction)
${currentDate} | ${currentDateISO}
recieved poll command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            name = interaction.options.getString('title')
            options = interaction.options.getString('options');

        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - poll (interaction)
${currentDate} | ${currentDateISO}
recieved poll command
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
title: ${name}
options: ${options}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        let pollEmbedDefault = new Discord.EmbedBuilder()
            .setDescription('✅ for yes\n❌ for no');
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
        let i: number;
        let curtxt: string;
        let optsarr = options.split('+')
        let optstxt = '';
        for (i = 0; i < optsarr.length && i < 20; i++) {
            if (optsarr[i].length > 150) {
                curtxt = optsarr[i].substring(0, 149) + '...'
                optstxt += `${react[i]} = ${curtxt}\n`

            } else {
                optstxt += `${react[i]} = ${optsarr[i]}\n`
            }
        }
        pollEmbedDefault.setTitle(`${name}`)
        pollEmbedDefault.setDescription(`${optstxt}`)
            .setColor(colours.embedColour.misc.hex)
        //SEND/EDIT MSG==============================================================================================================================================================================================

        if (message != null && interaction == null && button == null) {
            pollEmbedDefault
                .setDescription('✅ for yes\n❌ for no')
            message.channel.send({
                embeds: [pollEmbedDefault],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            }).then(sent => {
                sent.react('✅')
                sent.react('❌')
            })
                .catch(error => { });
            message.delete().catch(error => { });


        }
        if (interaction != null && button == null && message == null) {
            interaction.channel.send({
                embeds: [pollEmbedDefault],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .then(sent => {
                    for (i = 0; i < optsarr.length && i < 20; i++) {
                        sent.react(react[i])
                    }
                })
                .catch(error => { });
            interaction.reply({
                content: '✅                      ⠀',
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
                ephemeral: true
            });

        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

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