import Discord = require("discord.js");
import fs = require('fs');

import commands = require('./commands/cmdGeneral');
import osucmds = require('./commands/cmdosu');
import admincmds = require('./commands/cmdAdmin');
import misccmds = require('./commands/cmdMisc');
import checkcmds = require('./commands/cmdChecks');
import extypes = require('./src/types/extratypes');

module.exports = (userdata, client: Discord.Client, config: extypes.config, oncooldown, statsCache) => {
    const graphChannel = client.channels.cache.get(config.graphChannelId) as Discord.TextChannel;

    client.on('interactionCreate', interaction => {
        if (!(interaction.type == Discord.InteractionType.MessageComponent || interaction.type == Discord.InteractionType.ModalSubmit)) return;
        if (interaction.applicationId != client.application.id) return;

        interaction = interaction as Discord.ButtonInteraction //| Discord.SelectMenuInteraction

        const currentDate = new Date();

        const args = null;
        const obj = interaction;
        const command = interaction.customId.split('-')[1]
        const button = interaction.customId.split('-')[0] as extypes.commandButtonTypes;
        const specid = interaction.customId.split('-')[2]
        const absoluteID = interaction.customId.split('-')[3]

        //buttonType-baseCommand-userId-commandId

        const commandType: extypes.commandType = 'button';
        const overrides = {
            user: null,
            page: null,
            mode: null,
            sort: null,
            reverse: null,
            ex: null,
            id: null,
            overwriteModal: null,
            commandAs: commandType,
        }
        if (specid && specid != interaction.user.id) {
            interaction.deferUpdate()
                .catch(error => { });
            return;
        }
        const errorEmbed = new Discord.EmbedBuilder()
            .setTitle('Error - Button does not work')
            .setDescription('Feature not yet implemented/supported')

        const PageOnlyCommands = ['firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'ranking', 'recent', 'scores', 'userbeatmaps']
        const ScoreSortCommands = ['firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'scores']
        if (button == 'Search' && PageOnlyCommands.includes(command)) {
            const menu = new Discord.ModalBuilder()
                .setTitle('Page')
                .setCustomId(`SearchMenu-${command}-${interaction.user.id}-${absoluteID}`)
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
                        //interaction is converted to a base interaction first because button interaction and select menu interaction don't overlap
                        overrides.id = ((interaction as Discord.BaseInteraction) as Discord.SelectMenuInteraction)[0]
                        if (interaction?.message?.components[1]?.components[0]) {
                            overrides.overwriteModal = interaction.message.components[1].components[0];
                        }
                    }
                    break;
                case 'help':
                    {
                        overrides.ex = ((interaction as Discord.BaseInteraction) as Discord.SelectMenuInteraction).values[0]
                    }
            }
        }


        if (button == 'Sort' && ScoreSortCommands.includes(command)) {
            interaction.deferUpdate();
            return;
        }
        if (button == 'SearchMenu' && PageOnlyCommands.includes(command)) {
            //interaction is converted to a base interaction first because button interaction and modal submit interaction don't overlap
            const tst = parseInt(((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(0).value);
            if (tst.toString().length < 1) {
                return;
            } else {
                overrides.page = parseInt(((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(0).value);
            }
        }
        if (button == 'SortMenu' && ScoreSortCommands.includes(command)) {
            overrides.sort = ((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(0).value;
            overrides.reverse = ((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(1).value;
        }


        switch (command) {
            case 'compare':
                osucmds.compare({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'firsts':
                osucmds.firsts({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'lb':
                osucmds.lb({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'map':
                osucmds.map({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'maplb':
                osucmds.maplb({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'nochokes':
                osucmds.nochokes({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osu':
                osucmds.osu({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'osutop':
                osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'pinned':
                osucmds.pinned({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'ranking':
                osucmds.ranking({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, statsCache, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'recent':
                osucmds.recent({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'scores':
                osucmds.scores({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
            case 'scorestats':
                osucmds.scorestats({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                break;

            case 'userbeatmaps':
                osucmds.userBeatmaps({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;

            case 'help':
                commands.help({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
                interaction.deferUpdate()
                    .catch(error => { });
                break;
        }
        fs.appendFileSync('logs/totalcommands.txt', 'x')
    });
}