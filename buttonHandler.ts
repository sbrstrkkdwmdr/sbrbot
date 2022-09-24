import Discord = require("discord.js");
import fs = require('fs');

module.exports = (userdata, client, commandStruct, config, oncooldown) => {

    client.on('interactionCreate', interaction => {
        if (!(interaction.type == Discord.InteractionType.MessageComponent || interaction.type == Discord.InteractionType.ModalSubmit)) return;
        if (interaction.applicationId != client.application.id) return;

        const currentDate = new Date();
        const absoluteID = currentDate.getTime();

        const args = null;
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

        const PageOnlyCommands = ['firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'ranking', 'recent', 'scores']
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
            case 'firsts':
                commandStruct.osucmds.get('firsts').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'lb':
                commandStruct.osucmds.get('lb').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'map':
                commandStruct.osucmds.get('map').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'maplb':
                commandStruct.osucmds.get('maplb').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'nochokes':
                commandStruct.osucmds.get('nochokes').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osu':
                commandStruct.osucmds.get('osu').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osumaplink':
                client.links.get('osumaplink').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osutop':
                commandStruct.osucmds.get('osutop').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'pinned':
                commandStruct.osucmds.get('pinned').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'ranking':
                commandStruct.osucmds.get('ranking').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'recent':
                commandStruct.osucmds.get('recent').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'scores':
                commandStruct.osucmds.get('scores').execute(commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata);
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