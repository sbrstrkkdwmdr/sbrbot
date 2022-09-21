import Discord = require("discord.js");
import fs = require('fs');

module.exports = (userdata, client, commandStruct, config, oncooldown) => {

    client.on('interactionCreate', interaction => {
        if (!(interaction.type == Discord.InteractionType.MessageComponent || interaction.type == Discord.InteractionType.ModalSubmit)) return;
        if (interaction.applicationId != client.application.id) return;

        const currentDate = new Date();
        const absoluteID = currentDate.getTime();

        const args = null;
        // const message = interaction.message;
        const obj = interaction;
        const command = interaction.customId.split('-')[1]
        const button = interaction.customId.split('-')[0]
        const specid = interaction.customId.split('-')[2]
        const commandType = 'button';
        const overrides = {
            user: null,
            page: null,
            mode: null,
            sort: null,
            reverse: null,
            ex: null,
            id: null,
            overwriteModal: null,
        }
        if (specid && specid != interaction.user.id) {
            interaction.deferUpdate()
                .catch(error => { });
            return;
        }
        const errorEmbed = new Discord.EmbedBuilder()
            .setTitle('Error - Button does not work')
            .setDescription('Feature not yet implemented/supported')

        const PageOnlyCommands = ['firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'recent', 'scores']
        const ScoreSortCommands = ['firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'scores']
        if (button == 'Search' && PageOnlyCommands.includes(command)) {
            const menu = new Discord.ModalBuilder()
                .setTitle('Page')
                .setCustomId(`SearchMenu-${command}-${interaction.user.id}`)
                .addComponents(
                    //@ts-expect-error - TextInputBuilder not assignable to AnyInputBuilder
                    new Discord.ActionRowBuilder()
                        .addComponents(new Discord.TextInputBuilder()
                            .setCustomId('SearchInput')
                            .setLabel("What page do you want to go to?")
                            .setStyle(Discord.TextInputStyle.Short)
                        )
                );


            interaction.showModal(menu)
                .catch(error => { });

            //client.buttons.get('search').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, command);
            //                 interaction.deferUpdate()
            // .catch(error => { });
            return;
        }
        if (button.includes('Select')) {
            switch (command) {
                case 'map':
                    {
                        overrides.id = interaction.values[0]
                        if (interaction?.message?.components[1]?.components[0]) {
                            overrides.overwriteModal = interaction.message.components[1].components[0];
                        }
                    }
                    break;
                case 'help':
                    {
                        overrides.ex = interaction.values[0]
                    }
            }
        }


        if (button == 'Sort' && ScoreSortCommands.includes(command)) {
            interaction.deferUpdate();
            return;
            // const menu = new Discord.ModalBuilder()
            //     .setTitle('Sort')
            //     .setCustomId(`SortMenu-${command}-${interaction.user.id}`)
            //     .setComponents(
            //         new Discord.ActionRowBuilder()
            //             .setComponents(
            //                 new Discord.SelectMenuBuilder()
            //                     .setCustomId(`SortType`)
            //                     .setOptions(
            //                         new Discord.SelectMenuOptionBuilder()
            //                             .setDefault(true)
            //                             .setLabel('Performance')
            //                             .setDescription('Sort by performance')
            //                             .setValue('pp'),
            //                         new Discord.SelectMenuOptionBuilder()
            //                             .setDefault(false)
            //                             .setLabel('Score')
            //                             .setDescription('Sort by score')
            //                             .setValue('score'),
            //                         new Discord.SelectMenuOptionBuilder()
            //                             .setDefault(false)
            //                             .setLabel('Recent')
            //                             .setDescription('Sort by date')
            //                             .setValue('recent'),
            //                         new Discord.SelectMenuOptionBuilder()
            //                             .setDefault(false)
            //                             .setLabel('Accuracy')
            //                             .setDescription('Sort by accuracy')
            //                             .setValue('acc'),
            //                         new Discord.SelectMenuOptionBuilder()
            //                             .setDefault(false)
            //                             .setLabel('Combo')
            //                             .setDescription('Sort by combo')
            //                             .setValue('combo'),
            //                         new Discord.SelectMenuOptionBuilder()
            //                             .setDefault(false)
            //                             .setLabel('Miss')
            //                             .setDescription('Sort by miss count')
            //                             .setValue('miss'),
            //                         new Discord.SelectMenuOptionBuilder()
            //                             .setDefault(false)
            //                             .setLabel('Rank')
            //                             .setDescription('Sort by rank (SS/S/A/B/C/D)')
            //                             .setValue('rank')
            //                     ),
            //                 new Discord.SelectMenuBuilder()
            //                     .setCustomId(`isReverse`)
            //                     .setOptions(
            //                         new Discord.SelectMenuOptionBuilder()
            //                             .setDefault(true)
            //                             .setLabel('False')
            //                             .setDescription('Don\'t reverse sorting order')
            //                             .setValue('false'),
            //                         new Discord.SelectMenuOptionBuilder()
            //                             .setDefault(false)
            //                             .setLabel('True')
            //                             .setDescription('Reverse the sorting order')
            //                             .setValue('true')
            //                     )
            //             )
            //     )
            // interaction.showModal(menu)
            //     .catch(error => {
            //         console.log(menu)
            //         console.log(menu.components)
            //         console.log(menu.components.data)
            //         console.log(menu.components.components)
            //         console.log(error)
            //     });
            // return;
        }
        if (button == 'SearchMenu' && PageOnlyCommands.includes(command)) {
            const tst = parseInt(interaction.fields.fields.at(0).value);
            if (tst.toString().length < 1) {
                return;
            } else {
                overrides.page = parseInt(interaction.fields.fields.at(0).value);
            }
        }
        if (button == 'SortMenu' && ScoreSortCommands.includes(command)) {
            overrides.sort = interaction.fields.fields.at(0).value;
            overrides.reverse = interaction.fields.fields.at(1).value;
        }


        switch (command) {
            /*             case 'test':
                            if (button == 'BigLeftArrow') {
                                //message.edit({content: 'Left'})
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            if (button == 'LeftArrow') {
                                message.edit({ content: 'LeftS' })
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            if (button == 'BigRightArrow') {
                                //message.edit({content: 'Right'})
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            if (button == 'RightArrow') {
                                //message.edit({content: 'RightS'})
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            if (button == 'Middle') {
                                //message.edit({content: 'Middle'})
                                client.tstcmds.get('testcmd').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, button);
                            }
                            interaction.reply({ content: '👍' }).then(
                                setTimeout(() => interaction.deleteReply(), 100)
                            )
                            break; */
            case 'maplb':
                commandStruct.osucmds.get('maplb').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osutop':
                commandStruct.osucmds.get('osutop').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'recent':
                commandStruct.osucmds.get('recent').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'lb':
                commandStruct.osucmds.get('lb').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'firsts':
                commandStruct.osucmds.get('firsts').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'pinned':
                commandStruct.osucmds.get('pinned').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'scores':
                commandStruct.osucmds.get('scores').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'map':
                commandStruct.osucmds.get('map').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osumaplink':
                client.links.get('osumaplink').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osu':
                commandStruct.osucmds.get('osu').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'nochokes':
                commandStruct.osucmds.get('nochokes').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;


            case 'help':
                commandStruct.commands.get('help').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;

            case 'test':
                client.commands.get('test').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;

        }
        fs.appendFileSync('logs/totalcommands.txt', 'x')
    });
}