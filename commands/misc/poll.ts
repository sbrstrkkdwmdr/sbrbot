import fs = require('fs');
import Discord = require('discord.js');
import log = require('../../src/log');

module.exports = {
    name: 'poll',
    execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata) {
        let commanduser;
        let pollTitle: string;
        let pollOpts: string[];
        let overrideEmojis: string[];
        let pollOptsInit: string;

        switch (commandType) {
            case 'message': {
                commanduser = obj.author;
                pollTitle = args.join(' ')
                pollOpts = ['yes', 'no']
                overrideEmojis = ['✔', '❌']
            }
                break;

            //==============================================================================================================================================================================================

            case 'interaction': {
                commanduser = obj.member.user;
                pollTitle = obj.options.getString('title')
                pollOptsInit = obj.options.getString('options')
                if (pollOptsInit.includes(',')) {
                    pollOpts = pollOptsInit.split(',')
                }
                if (pollOptsInit.includes('+')) {
                    pollOpts = pollOptsInit.split('+')
                }
                if (pollOptsInit.includes('|')) {
                    pollOpts = pollOptsInit.split('|')
                }
                if (pollOptsInit.includes('&')) {
                    pollOpts = pollOptsInit.split('&')
                }
            }

                //==============================================================================================================================================================================================

                break;
            case 'button': {
                commanduser = obj.member.user;
            }
                break;
        }


        //==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.commandLog(
                'poll',
                commandType,
                absoluteID,
                commanduser
            ), 'utf-8')

        //OPTIONS==============================================================================================================================================================================================

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            log.optsLog(
                absoluteID,
                [{
                    name: 'Title',
                    value: pollTitle
                },
                {
                    name: 'Options',
                    value: pollOptsInit
                }]
            ), 'utf-8')

        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

        const actualOpts: string[] = [];

        const react = [
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

        for (let i = 0; i < pollOpts.length; i++) {
            if (pollOpts[i].length >= 1) {
                actualOpts.push(pollOpts[i])
            }
        }
        let optsToTxt: string = '';
        const curReactions: string[] = [];
        for (let i = 0; i < actualOpts.length && i < 26; i++) {
            if (actualOpts[i] == 'yes') {
                optsToTxt += `✔: yes\n`;
                curReactions.push('✔');
            } else if (actualOpts[i] == 'no') {
                optsToTxt += `❌: no\n`;
                curReactions.push('❌');
            } else {
                optsToTxt += `${react[i]}: ${actualOpts[i]}\n`;
                curReactions.push(react[i]);
            }
        }

        const pollEmbed = new Discord.EmbedBuilder()
            .setTitle(`${pollTitle}`)
            .setDescription(`${optsToTxt}`)

        //SEND/EDIT MSG==============================================================================================================================================================================================
        switch (commandType) {
            case 'message': case 'interaction': {
                obj.channel.send({
                    content: '',
                    embeds: [pollEmbed],
                    files: [],
                    allowedMentions: { repliedUser: false },
                    failIfNotExists: true
                }).then(message => {
                    for (let i = 0; i < actualOpts.length && i < 26; i++) {
                        message.react(curReactions[i]);
                    }
                })
                    .catch();
                if (commandType == 'interaction') {
                    obj.reply({
                        content: '✔',
                        allowedMentions: { repliedUser: false },
                        ephemeral: true
                    }).catch();
                }
            }
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