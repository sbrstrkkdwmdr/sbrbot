import fs = require('fs');
import osumodcalc = require('osumodcalculator');
import osuapiext = require('osu-api-extended');
import fetch from 'node-fetch';
module.exports = {
    name: 'template',
    description: 'template text\n' +
        'Command: `sbr-command-name`\n' +
        'Options: \n' +
        '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button) {
        //let absoluteID = new Date().getTime()
        let accessN = fs.readFileSync('configs/osuauth.json', 'utf-8');
        let access_token
        try {
            access_token = JSON.parse(accessN).access_token;
        } catch (error) {
            access_token = ''
        }
        if (message != null) {
            fs.appendFileSync(`logs/cmd/commands${message.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-cmd-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-cmd-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-cmd')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-cmd-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-cmd-${message.author.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            let endofcommand = new Date().getTime();
            let timeelapsed = endofcommand - currentDate.getTime();
            fs.appendFileSync(`logs/cmd/commands${message.guildId}.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
        }

        //==============================================================================================================================================================================================

        if (interaction != null) {
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-cmd')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-cmd-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
            let endofcommand = new Date().getTime();
            let timeelapsed = endofcommand - currentDate.getTime();
            fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, `\nCommand Latency - ${timeelapsed}ms\n`)
        }

        fs.appendFileSync(`logs/cmd/commands${interaction.guildId}.log`, '\nsuccess\n\n', 'utf-8')
    }
}