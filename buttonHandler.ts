import Discord from "discord.js";
import fs from 'fs';
import * as admincmds from './commands/cmdAdmin.js';
import * as checkcmds from './commands/cmdChecks.js';
import * as commands from './commands/cmdGeneral.js';
import * as misccmds from './commands/cmdMisc.js';
import * as osucmds from './commands/cmdosu.js';
import { path } from './path.js';
import * as checks from './src/checks.js';
import * as mainconst from './src/consts/main.js';
import * as embedStuff from './src/embed.js';
import * as osumodcalc from './src/osumodcalc.js';
import * as extypes from './src/types/extratypes.js';
import * as osuapitypes from './src/types/osuApiTypes.js';

export default (input: {
    userdata,
    client: Discord.Client,
    config: extypes.config,
    oncooldown,
    statsCache;
}) => {
    const buttonWarnedUsers = new Set();

    input.client.on('interactionCreate', async (interaction) => {
        if (!(interaction.type == Discord.InteractionType.MessageComponent || interaction.type == Discord.InteractionType.ModalSubmit)) return;
        if (interaction.applicationId != input.client.application.id) return;
        let canReply = true;
        if (!checks.botHasPerms(interaction, input.client, ['ReadMessageHistory'])) {
            canReply = false;
        }
        interaction = interaction as Discord.ButtonInteraction; //| Discord.SelectMenuInteraction

        const currentDate = new Date();

        const args = null;
        const obj = interaction;

        //version-buttonType-baseCommand-userId-commandId-extraValue
        //buttonVer-button-command-specid-absoluteID-???
        const buttonsplit = interaction.customId.split('-');
        const buttonVer = buttonsplit[0];
        const button = buttonsplit[1] as extypes.commandButtonTypes;
        const command = buttonsplit[2];
        const specid = buttonsplit[3];
        const absoluteID = buttonsplit[4];

        if (buttonVer != mainconst.version) {
            checkcmds.outdated('button', interaction, 'command', buttonVer);
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
        if (specid && specid != 'any' && specid != interaction.user.id) {
            if (!buttonWarnedUsers.has(interaction.member.user.id)) {
                interaction.reply({
                    content: 'You cannot use this button',
                    ephemeral: true,
                    allowedMentions: { repliedUser: false }
                });
                buttonWarnedUsers.add(interaction.member.user.id);
                setTimeout(() => {
                    buttonWarnedUsers.delete(interaction.member.user.id);
                }, 1000 * 60 * 60 * 24);
            } else {
                interaction.deferUpdate()
                    .catch(error => { });
            }
            return;
        }
        const errorEmbed = new Discord.EmbedBuilder()
            .setTitle('Error - Button does not work')
            .setDescription('Feature not yet implemented/supported');

        const PageOnlyCommands = [
            'firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'ranking', 'recent', 'recentactivity', 'scores', 'userbeatmaps',
            'changelog'
        ];
        const ScoreSortCommands = ['firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'scores'];
        if (button == 'Search' && PageOnlyCommands.includes(command)) {
            const menu = new Discord.ModalBuilder()
                .setTitle('Page')
                .setCustomId(`${mainconst.version}-SearchMenu-${command}-${interaction.user.id}-${absoluteID}`)
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
                case 'ppcalc':
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
                    break;
                case 'time':
                    {
                        const temp = ((interaction as Discord.BaseInteraction) as Discord.SelectMenuInteraction).values[0].split('_');
                        overrides.ex = temp[0]; //fetch tz
                        if (interaction?.message?.components[0]?.components[0]) {
                            overrides.overwriteModal = interaction.message.components[0].components[0] as any;
                        }
                        overrides.id = temp[1]; //displayed name
                    }
                    break;
                case 'weather':
                    {
                        overrides.ex = ((interaction as Discord.BaseInteraction) as Discord.SelectMenuInteraction).values[0];
                    }
                    break;
                case 'tropicalweather':
                    {
                        overrides.id = ((interaction as Discord.BaseInteraction) as Discord.SelectMenuInteraction).values[0];
                    }
                    break;
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

        if (button == 'Map') {
            overrides.id = buttonsplit[5];
            if (buttonsplit[5].includes('+')) {
                const temp = buttonsplit[5].split('+');
                overrides.id = temp[0];
                overrides.filterMods = temp[1];
            }
            overrides.commandAs = 'interaction';
            overrides.commanduser = interaction.member.user as Discord.User;
            await interaction.reply({
                content: 'Loading...',
                allowedMentions: { repliedUser: false },

            });
            await osucmds.map({ commandType: 'other', obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
            return;
        }

        if (button == 'User') {
            overrides.id = buttonsplit[5].split('+')[0];
            overrides.mode = buttonsplit[5].split('+')[1] as osuapitypes.GameMode;
            overrides.commandAs = 'interaction';
            overrides.commanduser = interaction.member.user as Discord.User;

            await osucmds.osu({ commandType: 'other', obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            return;
        }

        if (button == 'Leaderboard') {
            switch (command) {
                case 'map': {
                    const curEmbed = obj.message.embeds[0];
                    // #<mode>/id
                    overrides.id = curEmbed.url.split('#')[1].split('/')[1];
                    overrides.mode = curEmbed.url.split('#')[1].split('/')[0] as osuapitypes.GameMode;
                    overrides.filterMods = curEmbed.title?.split('+')?.[1] && curEmbed.title?.split('+')?.[1] != 'NM' && !osumodcalc.unrankedMods_stable(curEmbed.title?.split('+')?.[1])
                        ? curEmbed.title?.split('+')?.[1]
                        : null;
                    overrides.commandAs = 'interaction';

                    overrides.commanduser = interaction.member.user as Discord.User;
                    await osucmds.maplb({ commandType: 'other', obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                    return;
                }
            }
        }

        if (button == 'Scores') {
            overrides.id = buttonsplit[5].split('+')[0];
            overrides.user = buttonsplit[5].split('+')[1];
            overrides.commandAs = 'interaction';
            overrides.commanduser = interaction.member.user as Discord.User;
            await osucmds.scores({ commandType: 'other', obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
            return;
        }

        const nopingcommands = ['scorestats'];

        if (!nopingcommands.includes(command)) {
            interaction.deferUpdate()
                .catch(error => { });
        }


        switch (command) {
            case 'changelog':
                await commands.changelog({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
            case 'compare':
                await osucmds.compare({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
            case 'firsts':
                await osucmds.firsts({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'lb':
                await osucmds.lb({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
            case 'map':
                await osucmds.map({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
            case 'maplb':
                await osucmds.maplb({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'nochokes':
                overrides.miss = true;
                await osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'osu':
                await osucmds.osu({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'osutop':
                await osucmds.osutop({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'pinned':
                await osucmds.pinned({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'ppcalc':
                await osucmds.ppCalc({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
            case 'ranking':
                await osucmds.ranking({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'recent':
                await osucmds.recent({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'recentactivity':
                await osucmds.recent_activity({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'scoreparse':
                await osucmds.scoreparse({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'scores':
                await osucmds.scores({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'scorestats':
                await osucmds.scorestats({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
            case 'userbeatmaps':
                await osucmds.userBeatmaps({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata, statsCache: input.statsCache });
                break;
            case 'help':
                await commands.help({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
            case 'time':
                await commands.time({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
            case 'weather':
                await commands.weather({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
            case 'tropicalweather':
                await commands.tropicalWeather({ commandType, obj, args, canReply, button, config: input.config, client: input.client, absoluteID, currentDate, overrides, userdata: input.userdata });
                break;
        }
        fs.appendFileSync(`${path}/logs/totalcommands.txt`, 'x');
    });
};