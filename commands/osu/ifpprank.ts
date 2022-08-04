import fs = require('fs');
module.exports = {
    name: 'ifpprank',
    description: 'template text\n' +
    'Command: `sbr-command-name`\n' +
    'Options: \n' +
    '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button){
        let absoluteID = currentDate.getTime()

        if(message != null){
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-ifpprank-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-ifpprank-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀')
                    /* .setLabel('Previous') */,
                /*                 new Discord.ButtonBuilder()
                                    .setCustomId('Middle-ifpprank')
                                    .setStyle('Primary')
                                    .setLabel('🔍')
                                , */
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-ifpprank-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-ifpprank-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    /* .setLabel('End') */,
            );
            let value = args[0] ? args[0] : '100';
            let type = args[1] ? args[1] : 'pp'; //value is either rank or pp

        }

//==============================================================================================================================================================================================

        if(interaction != null){
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-ifpprank-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-ifpprank-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-ifpprank')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-ifpprank-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-ifpprank-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
        }

        fs.appendFileSync(`commands.log`, '\nsuccess\n\n', 'utf-8')
    }
}