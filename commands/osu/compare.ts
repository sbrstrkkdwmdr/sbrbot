import fs = require('fs');
module.exports = {
    name: 'compare',
    description: 'template text\n' +
    'Command: `sbr-command-name`\n' +
    'Options: \n' +
    '    `--option-name`: `option-description`\n',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button){
        let absoluteID = new Date().getTime()

       
        if(message != null){
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (message)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${message.author.id} AKA ${message.author.tag}\nMessage content: ${message.content}`, 'utf-8')
            let buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`BigLeftArrow-comparescore-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('⬅')
                    /* .setLabel('Start') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`LeftArrow-comparescore-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('◀')
                    /* .setLabel('Previous') */,
                /*                 new Discord.ButtonBuilder()
                                    .setCustomId('Middle-comparescore')
                                    .setStyle('Primary')
                                    .setLabel('🔍')
                                , */
                new Discord.ButtonBuilder()
                    .setCustomId(`RightArrow-comparescore-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('▶')
                    /* .setLabel('Next') */,
                new Discord.ButtonBuilder()
                    .setCustomId(`BigRightArrow-comparescore-${message.author.id}`)
                    .setStyle('Primary')
                    .setEmoji('➡')
                    /* .setLabel('End') */,
            );
        }

//==============================================================================================================================================================================================

        if(interaction != null){
            fs.appendFileSync(`commands.log`, `\nCOMMAND EVENT - COMMANDNAME (interaction)\n${currentDate} | ${currentDateISO}\n recieved COMMANDNAME command\nrequested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}`, 'utf-8')

            let buttons = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigLeftArrow-comparescore-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('⬅')
                    /* .setLabel('Start') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`LeftArrow-comparescore-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('◀')
                    /* .setLabel('Previous') */,
                    /*                 new Discord.ButtonBuilder()
                                        .setCustomId('Middle-comparescore')
                                        .setStyle('Primary')
                                        .setLabel('🔍')
                                    , */
                    new Discord.ButtonBuilder()
                        .setCustomId(`RightArrow-comparescore-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('▶')
                    /* .setLabel('Next') */,
                    new Discord.ButtonBuilder()
                        .setCustomId(`BigRightArrow-comparescore-${interaction.user.id}`)
                        .setStyle('Primary')
                        .setEmoji('➡')
                    /* .setLabel('End') */,
                );
        }

        fs.appendFileSync(`commands.log`, '\nsuccess\n\n', 'utf-8')
    }
}