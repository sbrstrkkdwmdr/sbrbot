import * as Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from './helper.js';
import * as bottypes from './types/bot.js';
import * as apitypes from './types/osuapi.js';
// message = interaction.message
const buttonWarnedUsers = new Set();
let command: bottypes.command;
let foundCommand = true;
let overrides: bottypes.overrides = {
    commandAs: 'button',
};
let mainId: number;
export async function onInteraction(interaction: Discord.Interaction) {
    if (!(interaction.type == Discord.InteractionType.MessageComponent || interaction.type == Discord.InteractionType.ModalSubmit)) return;
    if (interaction.applicationId != helper.vars.client.application.id) return;
    let canReply = true;
    if (!helper.tools.checks.botHasPerms(interaction, ['ReadMessageHistory'])) {
        canReply = false;
    }

    interaction = interaction as Discord.ButtonInteraction; //| Discord.SelectMenuInteraction

    const obj = interaction;

    //version-buttonType-baseCommand-userId-commandId-extraValue
    //buttonVer-button-command-specid-id-???
    const buttonsplit = interaction.customId.split('-');
    const buttonVer = buttonsplit[0];
    const buttonType = buttonsplit[1] as bottypes.buttonType;
    const cmd = buttonsplit[2];
    const specid = buttonsplit[3];
    mainId = +buttonsplit[4];

    if (buttonVer != helper.vars.versions.releaseDate) {
        const findcommand = helper.vars.versions.versions.find(x =>
            x.name == buttonVer ||
            x.releaseDate.replaceAll('-', '') == buttonVer
        ) ?? false;
        await interaction.reply({
            content: `You cannot use this command as it is outdated
Bot version: ${helper.vars.versions.releaseDate} (${helper.vars.versions.current})
Command version: ${findcommand ? `${findcommand.releaseDate} (${findcommand.name})` : 'INVALID'}
`,
            ephemeral: true,
            allowedMentions: { repliedUser: false }
        });
        return;
    }
    const commandType = 'button';
    if (specid && specid != 'any' && specid != interaction.user.id) {
        if (!buttonWarnedUsers.has(interaction.member.user.id)) {
            await interaction.reply({
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
        'changelog',
        'ytsearch',
    ];
    const ScoreSortCommands = ['firsts', 'maplb', 'nochokes', 'osutop', 'pinned', 'scores'];
    if (buttonType == 'Search' && PageOnlyCommands.includes(cmd)) {
        const menu = new Discord.ModalBuilder()
            .setTitle('Page')
            .setCustomId(`${helper.vars.versions.releaseDate}-SearchMenu-${cmd}-${interaction.user.id}-${mainId}`)
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
    if (buttonType.includes('Select')) {
        switch (cmd) {
            case 'map': case 'ppcalc':
                {
                    //interaction is converted to a base interaction first because button interaction and select menu interaction don't overlap
                    overrides.id = ((interaction as Discord.BaseInteraction) as Discord.SelectMenuInteraction).values[0];
                    if (interaction?.message?.components[2]?.components[0]) {
                        overrides.overwriteModal = interaction.message.components[2].components[0] as any;
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

    if (buttonType == 'Sort' && ScoreSortCommands.includes(cmd)) {
        interaction.deferUpdate();
        return;
    }
    if (buttonType == 'SearchMenu' && PageOnlyCommands.includes(cmd)) {
        //interaction is converted to a base interaction first because button interaction and modal submit interaction don't overlap
        const tst = parseInt(((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(0).value);
        if (tst.toString().length < 1) {
            return;
        } else {
            overrides.page = parseInt(((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(0).value);
        }
    }
    if (buttonType == 'SortMenu' && ScoreSortCommands.includes(cmd)) {
        overrides.sort = ((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(0).value;
        overrides.reverse = ((interaction as Discord.BaseInteraction) as Discord.ModalSubmitInteraction).fields.fields.at(1).value as unknown as boolean;
    }

    if (buttonType == 'Map') {
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
        // await osucmds.map({ commandType: 'other', obj, args, canReply, button, config: input.config, client: helper.vars.client, id, currentDate, overrides, userdata: input.userdata });
        mainId = helper.tools.commands.getCmdId();
        command = helper.commands.osu.maps.map;
        foundCommand = true;
        await runCommand(interaction, buttonType, 'other', false);
        return;
    }

    if (buttonType == 'User') {
        overrides.id = buttonsplit[5].split('+')[0];
        overrides.mode = buttonsplit[5].split('+')[1] as apitypes.GameMode;
        overrides.commandAs = 'interaction';
        overrides.commanduser = interaction.member.user as Discord.User;

        mainId = helper.tools.commands.getCmdId();
        command = helper.commands.osu.profiles.osu;
        foundCommand = true;
        await runCommand(interaction, buttonType, 'other', false);
        return;
    }
    if (buttonType == 'Leaderboard') {
        switch (cmd) {
            case 'map': {
                const curEmbed = obj.message.embeds[0];
                // #<mode>/id
                overrides.id = curEmbed.url.split('#')[1].split('/')[1];
                overrides.mode = curEmbed.url.split('#')[1].split('/')[0] as apitypes.GameMode;
                overrides.filterMods = curEmbed.title?.split('+')?.[1] && curEmbed.title?.split('+')?.[1] != 'NM' && !osumodcalc.unrankedMods_stable(curEmbed.title?.split('+')?.[1])
                    ? curEmbed.title?.split('+')?.[1]
                    : null;
                overrides.commandAs = 'interaction';

                overrides.commanduser = interaction.member.user as Discord.User;
                mainId = helper.tools.commands.getCmdId();
                command = helper.commands.osu.scores.maplb;
                foundCommand = true;
                await runCommand(interaction, buttonType, 'other', false);
                return;
            }
        }
    }

    if (buttonType == 'Scores') {
        overrides.id = buttonsplit[5].split('+')[0];
        overrides.user = buttonsplit[5].split('+')[1];
        overrides.commandAs = 'interaction';
        overrides.commanduser = interaction.member.user as Discord.User;
        command = helper.commands.osu.scores.scores;
        foundCommand = true;
        await runCommand(interaction, buttonType, 'other', false);
        return;
    }

    if (buttonType == 'Weather') {
        overrides.id = buttonsplit[5];
        overrides.commandAs = 'interaction';
        overrides.commanduser = interaction.member.user as Discord.User;
        command = helper.commands.gen.time;
        foundCommand = true;
        await runCommand(interaction, buttonType, 'other', false);
        return;
    }
    if (buttonType == 'Time') {
        overrides.ex = buttonsplit[5];
        overrides.commandAs = 'interaction';
        overrides.commanduser = interaction.member.user as Discord.User;
        command = helper.commands.gen.weather;
        foundCommand = true;
        await runCommand(interaction, buttonType, 'other', false);
        return;
    }

    const nopingcommands = ['scorestats'];

    switch (cmd) {
        case 'changelog':
            command = helper.commands.gen.changelog;
            foundCommand = true;
            break;
        case 'compare':
            command = helper.commands.osu.other.compare;
            foundCommand = true;
            break;
        case 'firsts':
            command = helper.commands.osu.scores.firsts;
            foundCommand = true;
            break;
        case 'lb':
            command = helper.commands.osu.profiles.lb;
            foundCommand = true;
            break;
        case 'map':
            command = helper.commands.osu.maps.map;
            foundCommand = true;
            break;
        case 'maplb':
            command = helper.commands.osu.scores.maplb;
            foundCommand = true;
            break;
        case 'nochokes':
            overrides.miss = true;
            command = helper.commands.osu.scores.osutop;
            foundCommand = true;
            break;
        case 'osu':
            command = helper.commands.osu.profiles.osu;
            foundCommand = true;
            break;
        case 'osutop':
            command = helper.commands.osu.scores.osutop;
            foundCommand = true;
            break;
        case 'pinned':
            command = helper.commands.osu.scores.pinned;
            foundCommand = true;
            break;
        case 'ranking':
            command = helper.commands.osu.profiles.ranking;
            foundCommand = true;
            break;
        case 'recent':
            command = helper.commands.osu.scores.recent;
            foundCommand = true;
            break;
        case 'recentactivity':
            command = helper.commands.osu.profiles.recent_activity;
            foundCommand = true;
            break;
        case 'scoreparse':
            command = helper.commands.osu.scores.scoreparse;
            foundCommand = true;
            break;
        case 'scores':
            command = helper.commands.osu.scores.scores;
            foundCommand = true;
            break;
        case 'scorestats':
            command = helper.commands.osu.scores.scorestats;
            foundCommand = true;
            break;
        case 'userbeatmaps':
            command = helper.commands.osu.maps.userBeatmaps;
            foundCommand = true;
            break;
        case 'help':
            command = helper.commands.gen.help;
            foundCommand = true;
            break;
        case 'time':
            command = helper.commands.gen.time;
            foundCommand = true;
            break;
        case 'weather':
            command = helper.commands.gen.weather;
            foundCommand = true;
            break;
    }
    runCommand(interaction, buttonType, null, true);
}

async function runCommand(interaction: Discord.ButtonInteraction, buttonType: bottypes.buttonType, overrideType?: "message" | "button" | "interaction" | "link" | "other", defer?: boolean) {
    if (defer) {
        await interaction.deferUpdate()
            .catch(error => { });
    }
    if (foundCommand) {
        await command({
            message: overrideType == "other" ? null : interaction.message,
            interaction,
            args: [],
            date: new Date(),
            id: mainId,
            overrides,
            canReply: true,
            type: overrideType ?? "button",
            buttonType
        });
    }
}