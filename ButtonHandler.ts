import fs = require('fs');
import { ApplicationCommandOptionType, InteractionType } from 'discord.js';
module.exports = (userdata, client, Discord, osuApiKey, osuClientID, osuClientSecret, config) => {
    client.on('interactionCreate', interaction => {
        if (!(interaction.type == InteractionType.MessageComponent || interaction.type == InteractionType.ModalSubmit)) return;
        if (interaction.applicationId != client.application.id) return;
        //console.log('received')
        //console.log(interaction.message.id)
        //console.log(interaction.customId)

        const currentDate = new Date();
        const currentDateISO = new Date().toISOString();
        const absoluteID = currentDate.getTime();

        const args = null;
        const message = interaction.message;
        const obj = interaction;

        const command = interaction.customId.split('-')[1]
        const button = interaction.customId.split('-')[0]
        const specid = interaction.customId.split('-')[2]
        let overrides = {
            page: null,
            mode: null,
            sort: null,
        }
        if (specid && specid != interaction.user.id) {
            interaction.deferUpdate()
                .catch(error => { });
            return;
        }

        const PageOnlyCommands = ['firsts', 'leaderboard', 'osutop', 'pinned', 'rs', 'scores']
        const ScoreSortCommands = ['firsts', 'leaderboard', 'osutop', 'pinned', 'scores']
        if (button == 'Search' && PageOnlyCommands.includes(command)) {
            const menu = new Discord.ModalBuilder()
                .setTitle('Page')
                .setCustomId(`SearchMenu-${command}-${interaction.user.id}`)
                .addComponents(new Discord.ActionRowBuilder()
                    .addComponents(new Discord.TextInputBuilder()
                        .setCustomId('SearchInput')
                        .setLabel("What page do you want to go to?")
                        .setStyle(Discord.TextInputStyle.Short)
                    ));
            interaction.showModal(menu)
                .catch(error => { });

            //client.buttons.get('search').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, command);
            //                 interaction.deferUpdate()
            // .catch(error => { });
            return;
        }
        if (button == 'Sort' && ScoreSortCommands.includes(command)) {
            const menu = new Discord.ModalBuilder()
                .setTitle('Sort')
                .setCustomId(`SortMenu-${command}-${interaction.user.id}`)
                .addComponents(new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.SelectMenuiBuilder()
                            .addComponents(
                                new Discord.SelectMenuOptionBuilder()
                                    .setDefault(true)
                                    .setLabel('Performance points')
                                    .setDescription('Sort by performance')
                                    .setValue('pp'),
                                new Discord.SelectMenuOptionBuilder()
                                    .setDefault(false)
                                    .setLabel('Score')
                                    .setDescription('Sort by score')
                                    .setValue('score'),
                                new Discord.SelectMenuOptionBuilder()
                                    .setDefault(false)
                                    .setLabel('Most recent')
                                    .setDescription('Sort by date')
                                    .setValue('recent'),
                                new Discord.SelectMenuOptionBuilder()
                                    .setDefault(false)
                                    .setLabel('Accuracy')
                                    .setDescription('Sort by accuracy')
                                    .setValue('acc'),
                                new Discord.SelectMenuOptionBuilder()
                                    .setDefault(false)
                                    .setLabel('Combo')
                                    .setDescription('Sort by combo')
                                    .setValue('combo'),
                                new Discord.SelectMenuOptionBuilder()
                                    .setDefault(false)
                                    .setLabel('Miss')
                                    .setDescription('Sort by miss count')
                                    .setValue('miss'),
                                new Discord.SelectMenuOptionBuilder()
                                    .setDefault(false)
                                    .setLabel('Rank')
                                    .setDescription('Sort by rank (SS/S/A/B/C/D)')
                                    .setValue('rank')
                            ),
                        new Discord.SelectMenuiBuilder()
                            .addComponents(
                                new Discord.SelectMenuOptionBuilder()
                                    .setDefault(true)
                                    .setLabel('False')
                                    .setDescription('Don\'t reverse sorting order')
                                    .setValue(false),
                                new Discord.SelectMenuOptionBuilder()
                                    .setDefault(false)
                                    .setLabel('True')
                                    .setDescription('Reverse the sorting order')
                                    .setValue(true)
                            )
                    )
                )
        }
        if (button == 'SearchMenu' && PageOnlyCommands.includes(command)) {
            overrides.page = interaction.fields.fields.at(0).value;
        }
        if (button == 'SortMenu' && ScoreSortCommands.includes(command)) {
            overrides.sort = interaction.fields.fields.at(0).value;
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
            case 'leaderboard':
                client.osucmds.get('leaderboard').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osutop':
                client.osucmds.get('osutop').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'rs':
                client.osucmds.get('rs').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'lb':
                client.osucmds.get('lb').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'firsts':
                client.osucmds.get('firsts').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'pinned':
                client.osucmds.get('pinned').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'scores':
                client.osucmds.get('scores').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'map':
                client.osucmds.get('map').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osumaplink':
                client.links.get('osumaplink').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osu':
                client.osucmds.get('osu').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'test':
                client.commands.get('test').execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj, overrides);
                interaction.deferUpdate()
                    .catch(error => { });
                break;

        }
        fs.appendFileSync('logs/totalcommands.txt', 'x')



    })


}