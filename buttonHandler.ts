import Discord from "discord.js";
import fs from 'fs';

import * as admincmds from './commands/cmdAdmin.js';
import * as checkcmds from './commands/cmdChecks.js';
import * as commands from './commands/cmdGeneral.js';
import * as misccmds from './commands/cmdMisc.js';
import * as osucmds from './commands/cmdosu.js';
import * as mainconst from './src/consts/main.js';
import * as embedStuff from './src/embed.js';
import * as extypes from './src/types/extratypes.js';

export default (userdata, client: Discord.Client, config: extypes.config, oncooldown, statsCache) => {
    const graphChannel = client.channels.cache.get(config.graphChannelId) as Discord.TextChannel;

    client.on('interactionCreate', interaction => {
        if (!(interaction.type == Discord.InteractionType.MessageComponent || interaction.type == Discord.InteractionType.ModalSubmit)) return;
        if (interaction.applicationId != client.application.id) return;

        interaction = interaction as Discord.ButtonInteraction; //| Discord.SelectMenuInteraction

        const currentDate = new Date();

        const args = null;
        const obj = interaction;

        //version-buttonType-baseCommand-userId-commandId
        const buttonsplit = interaction.customId.split('-');
        const buttonVer = buttonsplit[0];
        const button = buttonsplit[1] as extypes.commandButtonTypes;
        const command = buttonsplit[2];
        const specid = buttonsplit[3];
        const absoluteID = buttonsplit[4];

        if (buttonVer != mainconst.version) {
            checkcmds.outdated('button', interaction, 'command');
            return;
        }

        const commandType: extypes.commandType = 'button';
        const overrides: extypes.overrides = {
            user: null,
            page: null,
            mode: null,
            sort: null,
            reverse: null,
            ex: null,
            id: null,
            overwriteModal: null,
            commandAs: commandType,
        };
        if (specid && specid != interaction.user.id) {
            interaction.deferUpdate()
                .catch(error => { });
            return;
        }
        const errorEmbed = new Discord.EmbedBuilder()
            .setTitle('Error - Button does not work')
            .setDescription('Feature not yet implemented/supported');

        const PageOnlyCommands = ['firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'ranking', 'recent', 'scores', 'userbeatmaps'];
        const ScoreSortCommands = ['firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'scores'];
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
                        overrides.id = ((interaction as Discord.BaseInteraction) as Discord.SelectMenuInteraction).values[0];
                        if (interaction?.message?.components[1]?.components[0]) {
                            overrides.overwriteModal = interaction.message.components[1].components[0] as any;
                        }
                    }
                    break;
                case 'help':
                    {
                        overrides.ex = ((interaction as Discord.BaseInteraction) as Discord.SelectMenuInteraction).values[0];
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
            overrides.sort = ((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(0).value as embedStuff.scoreSort;
            overrides.reverse = ((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(1).value as unknown as boolean;
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
                overrides.miss = true;
                osucmds.osutop({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
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
            case 'scoreparse':
                osucmds.scoreparse({ commandType, obj, args, button, config, client, absoluteID, currentDate, overrides, userdata, graphChannel });
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
        fs.appendFileSync('logs/totalcommands.txt', 'x');
    });
};