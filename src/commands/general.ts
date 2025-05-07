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
import pkgjson from '../../../package.json';
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
    setArgsMsg(input: bottypes.commandInput) {
        this.commanduser = input.message.author;

        const pageArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.pages, input.args, true, 'number', false, true);
        if (pageArgFinder.found) {
            this.args.page = pageArgFinder.output;
            input.args = pageArgFinder.args;
        }
        this.args.version = input.args[0] ?? null;

    }
    setArgsInteract(input: bottypes.commandInput) {
        const interaction = input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;

        this.args.version = interaction.options.getString('version');
    }
    setArgsBtn(input: bottypes.commandInput) {
        if (!input.message.embeds[0]) return;
        const interaction = (input.interaction as Discord.ButtonInteraction);
        this.commanduser = interaction?.member?.user ?? input.interaction?.user;

        const curpage = parseInt(
            input.message.embeds[0].footer.text.split('/')[0]
        ) - 1;
        switch (input.buttonType) {
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
                    input.message.embeds[0].footer.text.split('/')[1]
                ) - 1;
                this.args.foundBool = true;
                break;
            default:
                this.args.useNum = curpage;
                break;
        }
        if (input.message.embeds[0].title.toLowerCase().includes('all versions')) {
            this.args.version = 'versions';
            this.args.isList = true;
        }

        switch (input.buttonType) {
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
    async execute(input: bottypes.commandInput) {
        this.setArgs(input);
        this.logInput(input);
        const pgbuttons: Discord.ActionRowBuilder = await helper.tools.commands.pageButtons('changelog', this.commanduser, input.id);
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
        if (((!this.args.foundBool && found != 'string') || (this.args.page && found == 'string')) && !input.buttonType) {
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
                        .setCustomId(`${helper.vars.versions.releaseDate}-Detail0-changelog-${this.commanduser.id}-${input.id}`)
                        .setStyle(helper.vars.buttons.type.current)
                        .setEmoji(helper.vars.buttons.label.main.detailLess),
                );
        } else {
            buttons
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`${helper.vars.versions.releaseDate}-Detail1-changelog-${this.commanduser.id}-${input.id}`)
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
        this.send(input);
    }

}
export class Help extends Command {

}
export class Info extends Command {

}
export class Invite extends Command {

}
export class Ping extends Command {

}
export class Remind extends Command {

}
export class Stats extends Command {

}