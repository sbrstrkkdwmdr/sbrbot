import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as weathertypes from '../types/openmeteoapi.js';
import * as countrytypes from '../types/restcountriesapi.js';
import * as tz from '../vars/timezones.js';

import * as fs from 'fs';
import * as luxon from 'luxon';
import moment from 'moment';
import pkgjson from '../../package.json';
import { Command } from './command.js';

export class Changelog extends Command {
    declare protected args: {
        version: string;
        useNum: number;
        isList: boolean;
        page: number;
        foundBool: boolean;
    };
    constructor() {
        super();
        this.args = {
            version: null,
            useNum: null,
            isList: false,
            page: null,
            foundBool: false,
        };
    }
    async setArgsMsg() {
        this.commanduser = this.input.message.author;

        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, this.input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.args.page = pageArgFinder.output;
            this.input.args = pageArgFinder.args;
        }
        this.args.version = this.input.args[0] ?? null;

    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;

        this.args.version = interaction.options.getString('version');
    }
    async setArgsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.commanduser = interaction?.member?.user ?? this.input.interaction?.user;

        const curpage = parseInt(
            this.input.message.embeds[0].footer.text.split('/')[0]
        ) - 1;
        switch (this.input.buttonType) {
            case 'BigLeftArrow':
                this.args.useNum = 0;
                this.args.foundBool = true;
                break;
            case 'LeftArrow':
                this.args.useNum = curpage - 1;
                this.args.foundBool = true;
                break;
            case 'RightArrow':
                this.args.useNum = curpage + 1;
                this.args.foundBool = true;
                break;
            case 'BigRightArrow':
                this.args.useNum = parseInt(
                    this.input.message.embeds[0].footer.text.split('/')[1]
                ) - 1;
                this.args.foundBool = true;
                break;
            default:
                this.args.useNum = curpage;
                break;
        }
        if (this.input.message.embeds[0].title.toLowerCase().includes('all versions')) {
            this.args.version = 'versions';
            this.args.isList = true;
        }

        switch (this.input.buttonType) {
            case 'Detail0':
                this.args.isList = false;
                this.args.version = null;
                break;
            case 'Detail1':
                this.args.isList = true;
                this.args.version = 'versions';
                break;
        }
    }
    async execute() {
        this.setArgs();
        this.logInput();
        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('changelog', this.commanduser, this.input.id);
        const buttons = new Discord.ActionRowBuilder();
        //get version
        let found: string | number = null;
        if (this.args.version) {
            //search for version
            if (this.args.version?.includes('.')) {
                found = helper.vars.versions.versions.findIndex(x =>
                    this.args.version.trim() === `${x.name}`.trim() || this.args.version.includes(`${x.releaseDate}`) || this.args.version.includes(`${x.releaseDate}`)
                    || (`${x.releaseDate}`).includes(this.args.version) || `${x.releaseDate}`.includes(this.args.version)
                );
                this.args.foundBool = true;
                if (found == -1) {
                    found = null;
                }
            } else {
                switch (this.args.version.toLowerCase()) {
                    case 'wip': case 'pending': case 'next':
                        found = 0;
                        this.args.useNum = 0;
                        this.args.foundBool = true;
                        break;
                    case 'first': case 'original':
                        found = helper.vars.versions.versions.length - 1;
                        this.args.useNum = helper.vars.versions.versions.length - 1;
                        this.args.foundBool = true;
                        break;
                    case 'second':
                        found = helper.vars.versions.versions.length - 2;
                        this.args.useNum = helper.vars.versions.versions.length - 2;
                        this.args.foundBool = true;
                        break;
                    case 'third':
                        found = helper.vars.versions.versions.length - 3;
                        this.args.useNum = helper.vars.versions.versions.length - 3;
                        this.args.foundBool = true;
                        break;
                    case 'latest':
                        found = 1;
                        this.args.useNum = 1;
                        this.args.foundBool = true;
                        break;
                    case 'versions': case 'list': case 'all':
                        this.args.foundBool = true;
                    default:
                        found = 'string';
                        break;
                }
            }
        }
        if (((!this.args.foundBool && found != 'string') || (this.args.page && found == 'string')) && !this.input.buttonType) {
            this.args.useNum = this.args.page ? this.args.page - 1 : null;
        }
        if (this.args.useNum < 1 && !this.args.foundBool) {
            this.args.useNum = found && !isNaN(+found) ?
                +found :
                typeof found === 'string' ?
                    0 : 1;
        }
        if (!this.args.useNum && found) {
            this.args.useNum = +found;
        }
        const Embed = new Discord.EmbedBuilder();
        const exceeded = 'Exceeded character limit. Please click [here](https://github.com/sbrstrkkdwmdr/sbrbot/blob/main/changelog.md) to view the changelog.';
        if (isNaN(this.args.useNum) || !this.args.useNum) this.args.useNum = 0;
        if (typeof found == 'string') {
            this.args.isList = true;
            // let txt = '' helper.vars.versions.versions.map(x => `\`${(x.name).padEnd(10)} (${x.releaseDate})\``).join('\n');
            const doc = fs.readFileSync(`${helper.vars.path.main}/cache/changelog.md`, 'utf-8');
            let txt = '\`VERSION      |    DATE    | CHANGES\`\n';
            const list = doc.split('## [');
            list.shift();
            if (this.args.useNum + 1 >= Math.ceil(helper.vars.versions.versions.length / 10)) {
                this.args.useNum = Math.ceil(helper.vars.versions.versions.length / 10) - 1;
            }
            const pageOffset = this.args.useNum * 10;
            for (let i = 0; pageOffset + i < helper.vars.versions.versions.length && i < 10; i++) {
                const sumVer = helper.vars.versions.versions[pageOffset + i];
                const useVer = list[pageOffset + i];
                const changes = useVer?.split('</br>')[1]?.split('\n')
                    .map(x => x.trim()).filter(x => x.length > 2 && !x.includes('### ')) ?? [];
                txt += `\`${(sumVer.name).padEnd(12)} | ${sumVer.releaseDate} | ${changes.length}\`\n`;
            }
            if (txt.length > 2000) {
                txt = exceeded;
            }
            Embed.setTitle('All Versions')
                .setDescription(txt)
                .setFooter({
                    text: `${this.args.useNum + 1}/${Math.ceil(helper.vars.versions.versions.length / 10)}`
                });
            this.args.foundBool ? null : Embed.setAuthor({ name: `\nThere was an error trying to find version \`${this.args.version}\`` });
        } else {
            const document = /* useGit ? */
                fs.readFileSync(`${helper.vars.path.main}/cache/changelog.md`, 'utf-8');
            /*             :
                        fs.readFileSync(`${precomphelper.vars.path.main}/changelog.txt`, 'utf-8'); */
            const list = document.split('## [');
            list.shift();
            if (this.args.useNum >= list.length) {
                this.args.useNum = list.length - 1;
            }
            const cur = list[this.args.useNum] as string;
            const verdata = helper.vars.versions.versions[this.args.useNum];
            const commit = cur.split('[commit](')[1].split(')')[0];
            const commitURL = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?(\/[^\s]*)?$/g.test(commit) ?
                commit :

                pkgjson['repository']['url'] +
                commit.replaceAll(/[^a-z0-9]/g, '');
            const changesTxt = cur.includes('</br>') ? cur.split('</br>')[1] :
                cur.split('\n').slice(3).join('\n');
            const changesList =
                changesTxt ?
                    changesTxt.split('\n')
                        .map(x => x.trim())
                        .filter(x => x.length > 2) : [];
            let txt = '';
            for (const change of changesList) {
                if (change.startsWith('###')) {
                    const temp = change.replaceAll('###', '').trim();
                    switch (temp) {
                        case 'Fixed':
                            txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "yellow", "text");
                            break;
                        case 'Changed':
                            txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "blue", "text");
                            break;
                        case 'Added':
                            txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "green", "text");
                            break;
                        case 'Removed':
                            txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "red", "text");
                            break;
                        case 'Deprecated':
                            txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "pink", "text");
                            break;
                        default:
                            txt += helper.tools.colourcalc.codeBlockColourText(temp.toUpperCase(), "cyan", "text");
                            break;
                    }
                } else {
                    txt += change.replace('-', '`-`') + '\n';
                }
            }
            txt = txt.slice(0, 2000);
            if (txt.trim().length == 0) {
                txt = '\nNo changes recorded';
            }

            if (txt.length > 2000) {
                txt = exceeded;
            }

            Embed
                .setTitle(`${verdata.name.trim()} Changelog`)
                .setURL('https://github.com/sbrstrkkdwmdr/sbrbot/blob/dev/changelog.md')
                .setDescription(`commit [${commit.includes('commit/') ?
                    commitURL.split('commit/')[1].trim()?.slice(0, 7)?.trim() : 'null'}](${commitURL})
Released ${verdata.releaseDate}
Total of ${changesList.filter(x => !x.includes('### ')).length} changes.${txt}
`)
                .setFooter({
                    text: `${this.args.useNum + 1}/${helper.vars.versions.versions.length}`
                });
        }

        if (this.args.isList) {
            buttons
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-Detail0-changelog-${this.commanduser.id}-${this.input.id}`)
                        .setStyle(helper.vars.buttons.type.current)
                        .setEmoji(helper.vars.buttons.label.main.detailLess),
                );
        } else {
            buttons
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-Detail1-changelog-${this.commanduser.id}-${this.input.id}`)
                        .setStyle(helper.vars.buttons.type.current)
                        .setEmoji(helper.vars.buttons.label.main.detailMore),
                );
        }

        if (this.args.useNum == 0) {
            (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
        }
        if ((this.args.useNum + 1 >= helper.vars.versions.versions.length && !this.args.isList) || (this.args.useNum + 1 >= Math.ceil(helper.vars.versions.versions.length / 10) && this.args.isList)) {
            (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
            (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
        }

        this.ctn.embeds = [Embed];
        this.ctn.components = [pgbuttons, buttons];
        this.send();
    }

}
export class Help extends Command {
    declare protected args: {
        rdm: boolean;
        commandfound: boolean;
        commandCategory: string;
        command: string;
    };
    constructor() {
        super();
        this.args = {
            rdm: false,
            commandfound: false,
            commandCategory: 'default',
            command: undefined,
        };
    }
    async setArgsMsg() {
        this.commanduser = this.input.message.author;
        this.args.command = this.input.args[0];
        if (!this.input.args[0]) {
            this.args.command = null;
        }
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;
        this.args.command = interaction.options.getString('command');
    }
    async setArgsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.commanduser = interaction?.member?.user ?? this.input.interaction?.user;
        if (this.input.buttonType == 'Random') {
            this.args.rdm = true;
        }
        switch (this.input.buttonType) {
            case 'Random':
                this.args.rdm = true;
                break;
            case 'Detailed':
                this.args.command = null;
                break;
        }
        const curembed: Discord.Embed = this.input.message.embeds[0];
        if (this.input.buttonType == 'Detailed' && curembed.description.includes('Prefix is')) {
            this.args.command = 'list';
        }

    }
    async execute() {
        this.setArgs();
        this.logInput();
        // do stuff
        if (this.args.rdm == true) {
            this.args.command = this.rdmp('cmds');
        }
        const buttons = new Discord.ActionRowBuilder()
            .setComponents(
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Random-help-${this.commanduser.id}-${this.input.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.extras.random),
                new Discord.ButtonBuilder()
                    .setCustomId(`${helper.vars.versions.releaseDate}-Detailed-help-${this.commanduser.id}-${this.input.id}`)
                    .setStyle(helper.vars.buttons.type.current)
                    .setEmoji(helper.vars.buttons.label.main.detailed)
            );

        this.getemb();

        const inputMenu = new Discord.StringSelectMenuBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-SelectMenu1-help-${this.commanduser.id}-${this.input.id}`)
            .setPlaceholder('Select a command');

        const selectCategoryMenu = new Discord.StringSelectMenuBuilder()
            .setCustomId(`${helper.vars.versions.releaseDate}-SelectMenu2-help-${this.commanduser.id}-${this.input.id}`)
            .setPlaceholder('Select a command category')
            .setOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji('📜' as Discord.APIMessageComponentEmoji)
                    .setLabel('General')
                    .setValue('CategoryMenu-gen'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(helper.vars.emojis.gamemodes.standard as Discord.APIMessageComponentEmoji)
                    .setLabel('osu! (profiles)')
                    .setValue('CategoryMenu-osu_profile'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(helper.vars.emojis.gamemodes.standard as Discord.APIMessageComponentEmoji)
                    .setLabel('osu! (scores)')
                    .setValue('CategoryMenu-osu_scores'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(helper.vars.emojis.gamemodes.standard as Discord.APIMessageComponentEmoji)
                    .setLabel('osu! (maps)')
                    .setValue('CategoryMenu-osu_map'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(helper.vars.emojis.gamemodes.standard as Discord.APIMessageComponentEmoji)
                    .setLabel('osu! (track)')
                    .setValue('CategoryMenu-osu_track'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji(helper.vars.emojis.gamemodes.standard as Discord.APIMessageComponentEmoji)
                    .setLabel('osu! (other)')
                    .setValue('CategoryMenu-osu_other'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji('🤖' as Discord.APIMessageComponentEmoji)
                    .setLabel('Admin')
                    .setValue('CategoryMenu-admin'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setEmoji('❓' as Discord.APIMessageComponentEmoji)
                    .setLabel('Misc')
                    .setValue('CategoryMenu-misc'),
            );
        this.ctn.components.push(
            new Discord.ActionRowBuilder()
                .setComponents(selectCategoryMenu)
        );
        let curpick: bottypes.commandInfo[] = helper.tools.commands.getCommands(this.args.commandCategory);

        if (curpick.length == 0) {
            curpick = helper.tools.commands.getCommands('general');
        }
        if (this.args.commandfound == true) {
            for (let i = 0; i < curpick.length && i < 25; i++) {
                inputMenu.addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                        .setEmoji('📜')
                        .setLabel(`#${i + 1}`)
                        .setDescription(curpick[i]?.name ?? '_')
                        .setValue(curpick[i].name)
                );

            }
            this.ctn.components.push(
                new Discord.ActionRowBuilder()
                    .setComponents(inputMenu));
        }
        this.send();
    }
    commandEmb(command: bottypes.commandInfo, embed) {
        let usetxt = '';
        if (command.usage) {
            usetxt += `\`${helper.vars.config.prefix}${command.usage}\``;
        }
        if (command.linkUsage) {
            usetxt += `### Link Usage\n${command.linkUsage.map(x => `\`${x}\``).join('\n')}`;
        }

        // let exceedTxt = '';
        // let exceeds = false;

        const commandaliases = command.aliases && command.aliases.length > 0 ? command.aliases.join(', ') : 'none';
        // let commandexamples = command.examples && command.examples.length > 0 ? command.examples.join('\n').replaceAll('PREFIXMSG', helper.vars.config.prefix) : 'none'
        const commandexamples = command.examples && command.examples.length > 0 ? command.examples.slice(0, 5).map(x => x.text).join('\n').replaceAll('PREFIXMSG', helper.vars.config.prefix) : 'none';

        embed.setTitle("Command info for: " + command.name)
            .setURL(`https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands.html`)
            .setDescription("To see full details about this command, visit [here](https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands.html)\n\n" + command.description + "\n")
            .addFields([
                {
                    name: 'Usage',
                    value: usetxt,
                    inline: false,
                },
                {
                    name: 'Aliases',
                    value: commandaliases,
                    inline: false
                },
                {
                    name: 'Examples',
                    value: commandexamples,
                    inline: false
                },
            ]);
    }
    /**
     *  TDL - fix this
     *  too long and complex
     *  make into smaller separate functions
     * */
    getemb() {
        if (this.args.command == 'list') {
            const commandlist: {
                category: string;
                cmds: string[];
            }[] = [];

            for (const cmd of helper.vars.commandData.cmds) {
                if (commandlist.map(x => x.category).includes(cmd.category)) {
                    const idx = commandlist.map(x => x.category).indexOf(cmd.category);
                    commandlist[idx].cmds.push(cmd.name);
                } else {
                    commandlist.push({
                        category: cmd.category,
                        cmds: [cmd.name],
                    });
                }
            }

            const clembed = new Discord.EmbedBuilder()
                .setColor(helper.vars.colours.embedColour.info.dec)
                .setTitle('Command List')
                .setURL('https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands')
                .setDescription('use `/help <command>` to get more info on a command')
                .addFields(
                    commandlist.map(x => {
                        return {
                            name: x.category.replace('_', ' '),
                            value: x.cmds.map(x => '`' + x + '`').join(', ')
                        };
                    })
                )
                .setFooter({
                    text: 'Website: https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands | Github: https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts'
                });
            this.ctn.embeds = [clembed];
            this.args.commandCategory = 'default';
        } else if (this.args.command != null) {
            const fetchcmd = this.args.command;
            const commandInfo = new Discord.EmbedBuilder()
                .setColor(helper.vars.colours.embedColour.info.dec);
            if (this.args.command.includes('button')) {
                this.args.commandfound = false;
                this.args.commandCategory = 'default';
                let desc = 'List of all buttons available';
                let buttonstxt = '\n';
                for (let i = 0; i < helper.vars.commandData.buttons.length; i++) {
                    const curbtn = helper.vars.commandData.buttons[i];
                    buttonstxt += `${curbtn.emoji}\`${curbtn.name}\`: ${curbtn.description}\n`;
                }
                desc += buttonstxt;
                commandInfo.setTitle('Buttons')
                    .setDescription(desc);
            } else if (helper.tools.commands.getCommand(fetchcmd)) {
                const res = helper.tools.commands.getCommand(fetchcmd);
                this.args.commandfound = true;
                this.args.commandCategory = res.category;
                this.commandEmb(res, commandInfo);
            } else if (this.args.command.toLowerCase().includes('category')) {
                let sp = this.args.command.toLowerCase().split('category')[1];
                if (sp == 'all') {
                    this.args.command = 'list';
                    this.getemb();
                } else {
                    let c = this.categorise(sp);
                    if (c != '') {
                        commandInfo
                            .setTitle(helper.tools.formatter.toCapital(sp) + " Commands")
                            .setDescription(c);
                        this.args.commandCategory = sp;
                    } else {
                        this.args.command = null;
                        this.getemb();
                        return;
                    }
                }
            }
            else {
                this.args.command = null;
                this.getemb();
                return;
            }

            this.ctn.embeds = [commandInfo];
        } else {
            this.ctn.embeds = [new Discord.EmbedBuilder()
                .setColor(helper.vars.colours.embedColour.info.dec)
                .setTitle('Help')
                .setURL('https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands')
                .setDescription(`Prefix is: MSGPREFIX
- Use \`MSGPREFIXhelp <command>\` to get more info on a command or \`/help list\` to get a list of commands
- \`MSGPREFIXhelp category<category>\` will list only commands from that category
- Arguments are shown as either <arg> or [arg]. Angled brackets "<arg>" are required and square brackets "[arg]" are optional.
- Argument values can be specified with \`-key value\` (eg. \`-page 3\`)
- Argument values with spaces (such as names) can be specified with quotes eg. "saber strike"
- You can use \`MSGPREFIXosuset\` to automatically set your osu! username and gamemode for commands such as \`recent\` (rs)
- Mods are specified with +[mods] (include), -mx [mods] (match exact) or -me [mods] (exclude). -mx overrides +[mods]
- Gamemode can be specified by using -(mode) in commands that support it (eg. -taiko)
`.replaceAll('MSGPREFIX', helper.vars.config.prefix))
                .setFooter({
                    text: 'Website: https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands | Github: https://github.com/sbrstrkkdwmdr/sbrbot/tree/ts'
                })];
            this.args.commandCategory = 'default';
        }
    }
    rdmp(w: string) {
        const fullyrando = Math.floor(Math.random() * helper.vars.commandData[w].length);
        return helper.vars.commandData.cmds[fullyrando].name;
    }
    categorise(type: string) {
        console.log(type);
        let desctxt = '';
        const cmds = helper.tools.commands.getCommands(type);
        for (let i = 0; i < cmds.length; i++) {
            desctxt += `\n\`${cmds[i].name}\`: ${cmds[i].description.split('.')[0]}`;
        }
        this.args.commandfound = true;
        if (desctxt.length > 4000) {
            desctxt = desctxt.slice(0, 3900);
            desctxt += "\n\nThe text has reached maximum length. See [here](https://sbrstrkkdwmdr.github.io/projects/ssob_docs/commands) for the rest of the commands";
        }
        return desctxt;
    }
}
export class Info extends Command {
    declare protected args: {};
    constructor() {
        super();
    }
    async setArgsMsg() {
        this.commanduser = this.input.message.author;
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;
    }
    async execute() {
        this.setArgs();
        this.logInput(true);
        // do stuff
        const buttons: Discord.ActionRowBuilder = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('Info')
                    .setURL('https://sbrstrkkdwmdr.github.io/projects/ssob_docs/')
                    .setStyle(Discord.ButtonStyle.Link)
            );

        const curGuildSettings = await helper.vars.guildSettings.findOne({ where: { guildid: this.input.message?.guildId } });
        const serverpfx = curGuildSettings.dataValues.prefix;

        const data = {
            deps: `Typescript: [${pkgjson.dependencies['typescript'].replace('^', '')}](https://www.typescriptlang.org/)
Discord.js: [${pkgjson.dependencies['discord.js'].replace('^', '')}](https://discord.js.org/#/docs)
rosu-pp: [${pkgjson.dependencies['rosu-pp-js'].replace('^', '')}](https://github.com/MaxOhn/rosu-pp-js)
Axios: [${pkgjson.dependencies['axios'].replace('^', '')}](https://github.com/axios/axios)
Sequelize: [${pkgjson.dependencies['sequelize'].replace('^', '')}](https://github.com/sequelize/sequelize/)
Chart.js: [${pkgjson.dependencies['chart.js'].replace('^', '')}](https://www.chartjs.org/)
sqlite3: [${pkgjson.dependencies['sqlite3'].replace('^', '')}](https://github.com/TryGhost/node-sqlite3)`,
            uptime: `${helper.tools.calculate.secondsToTime(helper.vars.client.uptime / 1000)}`,
            version: pkgjson.version,
            preGlobal: helper.vars.config.prefix.includes('`') ? `"${helper.vars.config.prefix}"` : `\`${helper.vars.config.prefix}\``,
            preServer: serverpfx.includes('`') ? `"${serverpfx}"` : `\`${serverpfx}\``,
            server: helper.vars.versions.serverURL,
            website: helper.vars.versions.website,
            creator: 'https://sbrstrkkdwmdr.github.io/',
            source: `https://github.com/sbrstrkkdwmdr/sbrbot/`,
            get tz() {
                const starttime = new Date((fs.readFileSync(`${helper.vars.path.main}/debug/starttime.txt`)).toString());

                const txt = starttime.toString().split('(')[1].split(')')[0];
                //get utc offset
                const found: tz.timezone[] = [];

                let frTemp: string[] = [];
                for (const tz of helper.vars.timezones.timezones) {
                    frTemp = frTemp.concat(tz.aliases);
                }
                const frWords = helper.tools.other.searchMatch(txt, helper.tools.other.removeDupes(frTemp));
                //convert frWords to tzlist

                for (let i = 0; i < helper.vars.timezones.timezones.length && i < 25; i++) {
                    for (const tz of helper.vars.timezones.timezones) {
                        if (tz.aliases.includes(frWords[i])) {
                            found.push(tz);
                        }
                    }
                }

                const offset = found[0].offsetDirection == '+' ?
                    found[0].offsetHours :
                    -found[0].offsetHours;
                let isOffset = false;
                for (let i = 0; i < helper.vars.timezones.hasDaylight.length; i++) {
                    const curTimeZone = helper.vars.timezones.hasDaylight[i];
                    if (curTimeZone.includes.slice().map(x => x.trim().toUpperCase()).includes(txt.trim().toUpperCase()) && curTimeZone.check(this.input.date)) {
                        isOffset = true;
                    }
                }
                if (txt.toLowerCase().includes('daylight')) isOffset = true;

                const offsetToMinutes = isOffset ? Math.floor(offset * 60) + 60 : Math.floor(offset * 60);
                const Hrs = offset > 0 ?
                    Math.floor(isOffset ? offset + 1 : offset).toString().padStart(3, '+0') :
                    Math.floor(isOffset ? offset + 1 : offset).toString().replace('-', '').padStart(3, '-0');
                const offsetReadable = `UTC${Hrs}:${(Math.abs(offsetToMinutes % 60)).toString().padStart(2, '0')}`;
                return `${txt} (${offsetReadable})`;
            },
            shards: helper.vars.client?.shard?.count ?? 1,
            guilds: helper.vars.client.guilds.cache.size,
            users: helper.vars.client.users.cache.size,

        };
        const Embed = new Discord.EmbedBuilder()
            .setColor(helper.vars.colours.embedColour.info.dec)
            .setTitle('Bot Information');
        if (this.input.args.length > 0) {
            ['uptime', 'server', 'website', 'timezone', 'version', 'v', 'dependencies', 'deps', 'source'];
            switch (this.input.args[0]) {
                case 'uptime':
                    Embed.setTitle('Total uptime')
                        .setDescription(data.uptime);
                    break;
                case 'version': case 'v':
                    Embed.setTitle('Bot version')
                        .setDescription(data.version);
                    break;
                case 'server':
                    Embed.setTitle('Bot server')
                        .setDescription(data.server);
                    break;
                case 'website':
                    Embed.setTitle('Bot website')
                        .setDescription(data.website);
                    break;
                case 'timezone': case 'tz':
                    Embed.setTitle('Bot timezone')
                        .setDescription(data.tz);
                    break;
                case 'dependencies': case 'dep': case 'deps':
                    Embed.setTitle('Dependencies')
                        .setDescription(data.deps);
                    break;
                case 'source': case 'code':
                    Embed.setTitle('Source Code')
                        .setDescription(data.source);
                    break;
                default:
                    Embed.setDescription(`\`${this.input.args[0]}\` is an invalid argument`);
                    break;
            }
        } else {
            Embed
                .setFields([
                    {
                        name: 'Dependencies',
                        value: data.deps,
                        inline: true
                    },
                    {
                        name: 'Statistics',
                        value:
                            `
Uptime: ${data.uptime}
Shards: ${data.shards}
Guilds: ${data.guilds}
Users: ${data.users}`,
                        inline: true
                    }
                ])
                .setDescription(`
[Created by SaberStrike](${data.creator})
[Commands](${data.website})
Global prefix: ${data.preGlobal}
Server prefix: ${data.preServer}
Bot Version: ${data.version}
`);
        }

        this.ctn.embeds = [Embed];
        this.ctn.components = [buttons];

        this.send();
    }
}
export class Invite extends Command {
    declare protected args: {};
    constructor() {
        super();
    }
    async execute() {
        this.setArgs();
        this.logInput(true);
        // do stuff
        this.ctn.content = helper.vars.versions.linkInvite;
        this.send();
    }
}
export class Ping extends Command {
    declare protected args: {};
    constructor() {
        super();
    }
    async execute() {
        this.setArgs();
        this.logInput(true);
        // do stuff
        const trueping = `${helper.tools.formatter.toCapital(this.input.type)} latency: ${Math.abs((this.input.message ?? this.input.interaction).createdAt.getTime() - new Date().getTime())}ms`;

        const pingEmbed = new Discord.EmbedBuilder()
            .setTitle('Pong!')
            .setColor(helper.vars.colours.embedColour.info.dec)
            .setDescription(`
    Client latency: ${helper.vars.client.ws.ping}ms
    ${trueping}`);
        const preEdit = new Date();

        switch (this.input.type) {
            case 'message':
                {
                    this.input.message.reply({
                        embeds: [pingEmbed],
                        allowedMentions: { repliedUser: false },
                        failIfNotExists: true
                    }).then((msg: Discord.Message | Discord.ChatInputCommandInteraction) => {
                        const timeToEdit = new Date().getTime() - preEdit.getTime();
                        pingEmbed.setDescription(`
            Client latency: ${helper.vars.client.ws.ping}ms
            ${trueping}
            ${helper.tools.formatter.toCapital(this.input.type)} edit latency: ${Math.abs(timeToEdit)}ms
            `);
                        helper.tools.commands.sendMessage({
                            type: this.input.type,
                            message: msg as Discord.Message,
                            interaction: msg as Discord.ChatInputCommandInteraction,
                            args: {
                                embeds: [pingEmbed],
                                edit: true,
                                editAsMsg: true,
                            }
                        }, this.input.canReply);
                    })
                        .catch();
                }
                break;
            case 'interaction': {
                this.input.interaction.reply({
                    embeds: [pingEmbed],
                    allowedMentions: { repliedUser: false },
                }).then((intRes: Discord.InteractionResponse) => {
                    const timeToEdit = new Date().getTime() - preEdit.getTime();
                    pingEmbed.setDescription(`
        Client latency: ${helper.vars.client.ws.ping}ms
        ${trueping}
        ${helper.tools.formatter.toCapital(this.input.type)} edit latency: ${Math.abs(timeToEdit)}ms
        `);
                    intRes.edit({
                        embeds: [pingEmbed]
                    });
                })
                    .catch();
            }
                break;
        }
    }
}
export class Remind extends Command {
    declare protected args: {
        time: string;
        remindertxt: string;
        sendtochannel: boolean;
        list: boolean;
    };
    constructor() {
        super();
        this.args = {
            time: '1s',
            remindertxt: 'no reminder set',
            sendtochannel: false,
            list: false
        };
    }
    async setArgsMsg() {
        this.commanduser = this.input.message.author;
        this.args.time = this.input.args[0];
        this.args.remindertxt = this.input.args.join(' ').replaceAll(this.input.args[0], '');
        this.args.sendtochannel = false;

        if (!this.input.args[0] || this.input.args[0].includes('remind')) {
            this.args.list = true;
        }
        if (!this.input.args[1]) {
            this.args.remindertxt = 'null';
        }
        if (this.args.list == false && !this.input.args[0].endsWith('d') && !this.input.args[0].endsWith('h') && !this.input.args[0].endsWith('m') && !this.input.args[0].endsWith('s') && !this.args.time.includes(':') && !this.args.time.includes('.')) {
            return await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: 'Incorrect time format: please use `?d?h?m?s` or `hh:mm:ss`'
                }
            }, this.input.canReply);
        }

    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;
        this.args.time = interaction.options.getString('time');
        this.args.remindertxt = interaction.options.getString('reminder');
        this.args.sendtochannel = interaction.options.getBoolean('sendinchannel');

    }
    async execute() {
        this.setArgs();
        this.logInput();
        // do stuff

        const reminder = new Discord.EmbedBuilder()
            .setColor(helper.vars.colours.embedColour.info.dec)
            .setTitle(this.args.list ? 'REMINDERS' : 'REMINDER')
            .setDescription(`${this.args.remindertxt}`);

        if (this.args.list) {
            const useReminders = helper.vars.reminders.filter(x => `${x.userID}` === `${this.commanduser.id}`);
            reminder.setDescription(useReminders.length > 0 ?
                useReminders.map(x => `Reminder sending <t:${x.time}:R>: ${x.text}`).join('\n').slice(0, 2000)
                : 'You have no reminders'
            );
            this.ctn.embeds = [reminder];
        } else {
            const absTime = Math.floor(((new Date().getTime()) + helper.tools.calculate.timeToMs(this.args.time)) / 1000);
            this.ctn.content = `Sending reminder <t:${absTime}:R> (<t:${absTime}:f>)`;
            this.sendremind(reminder, this.args.time, this.args.sendtochannel, this.args.remindertxt, absTime);
        }
        this.send();
    }

    async sendremind(reminder: Discord.Embed | Discord.EmbedBuilder, time: string, sendchannel: boolean, remindertxt: string, absTime: number) {
        helper.vars.reminders.push({
            time: absTime,
            text: remindertxt,
            userID: `${this.commanduser.id}`
        });
        try {
            if (sendchannel == true) {
                setTimeout(() => {
                    ((this.input.message ?? this.input.interaction).channel as Discord.GuildTextBasedChannel).send({ content: `Reminder for <@${this.commanduser.id}> \n${remindertxt}` });
                    this.remReminder(absTime);
                }, helper.tools.calculate.timeToMs(time));
            }
            else {
                setTimeout(() => {
                    (this.commanduser as Discord.User).send({ embeds: [reminder] }).catch();
                    this.remReminder(absTime);
                }, helper.tools.calculate.timeToMs(time));
            }
        } catch (error) {
            helper.tools.log.stdout('embed error' + 'time:' + time + '\ntxt:' + remindertxt);
        }
    }

    remReminder(time: number) {
        const findOne = helper.vars.reminders.findIndex(x => x.time === time);
        return helper.vars.reminders.splice(findOne, 1);
    }
}
export class Stats extends Command {
    declare protected args: {};
    constructor() {
        super();
    }
    async execute() {
        this.setArgs();
        this.logInput(true);
        // do stuff
        const trueping = (this.input.message ?? this.input.interaction).createdAt.getTime() - new Date().getTime() + 'ms';

        const uptime = Math.round((new Date().getTime() - helper.vars.startTime.getTime()) / 1000);
        const uptimehours = Math.floor(uptime / 3600) >= 10 ? Math.floor(uptime / 3600) : '0' + Math.floor(uptime / 3600);
        const uptimeminutes = Math.floor((uptime % 3600) / 60) >= 10 ? Math.floor((uptime % 3600) / 60) : '0' + Math.floor((uptime % 3600) / 60);
        const uptimeseconds = Math.floor(uptime % 60) >= 10 ? Math.floor(uptime % 60) : '0' + Math.floor(uptime % 60);
        const upandtime = `Uptime: ${uptimehours}:${uptimeminutes}:${uptimeseconds}\nTimezone: ${moment(helper.vars.startTime).format('Z')}`;

        const totalusers: number = helper.vars.client.users.cache.size;
        // let totalusersnobots: Discord.Collection<any, Discord.User>;
        const totalguilds: number = helper.vars.client.guilds.cache.size;

        const Embed = new Discord.EmbedBuilder()
            .setTitle(`${helper.vars.client.user.username} stats`)
            .setDescription(
                `Client latency: ${Math.round(helper.vars.client.ws.ping)}ms
    Message Latency: ${trueping}
    ${upandtime}
    Guilds: ${totalguilds}
    Users: ${totalusers}
    Commands sent: ${helper.vars.id}
    Prefix: \`${helper.vars.config.prefix}\`
    Shards: ${helper.vars?.client?.shard?.count ?? 1}
    Current Shard:
    `
            );
        this.ctn.embeds = [Embed];
        this.send();
    }
}