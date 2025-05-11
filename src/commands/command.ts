import * as Discord from 'discord.js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
export class Command {
    protected name: string;
    protected commanduser: Discord.User | Discord.APIUser;
    protected ctn: {
        content?: string,
        embeds?: Discord.EmbedBuilder[] | Discord.Embed[],
        files?: string[] | Discord.AttachmentBuilder[] | Discord.Attachment[],
        components?: Discord.ActionRowBuilder<any>[],
        ephemeral?: boolean,
        react?: boolean,
        edit?: boolean,
        editAsMsg?: boolean,
    };
    protected args: { [id: string]: any; };
    protected input: bottypes.commandInput;
    constructor() {
        this.ctn = {
            content: undefined,
            embeds: [],
            files: [],
            components: [],
            ephemeral: false,
            react: undefined,
            edit: undefined,
            editAsMsg: undefined,
        };
    }
    setInput(input: bottypes.commandInput) {
        this.input = input;
    }
    setArgs() {
        switch (this.input.type) {
            case 'message':
                this.setArgsMsg();
                break;
            case 'interaction':
                this.setArgsInteract();
                break;
            case 'button':
                this.setArgsBtn();
                break;
            case 'link':
                this.setArgsLink();
                break;
        }
    }
    async setArgsMsg() {
        this.commanduser = this.input.message.author;
    }
    async setArgsInteract() {
        let interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;
    }
    async setArgsBtn() {
        if (!this.input.message.embeds[0]) return;
        let interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.commanduser = interaction?.member?.user ?? this.input.interaction?.user;
        const temp = helper.tools.commands.getButtonArgs(this.input.id);
        if (temp.error) {
            interaction.followUp({
                content: helper.vars.errors.paramFileMissing,
                flags: Discord.MessageFlags.Ephemeral,
                allowedMentions: { repliedUser: false }
            });
            helper.tools.commands.disableAllButtons(this.input.message);
            return;
        }
    }
    async setArgsLink() {
        this.commanduser = this.input.message.author;
        const messagenohttp = this.input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
    }
    logInput(skipKeys: boolean = false) {
        let keys = [];
        if (!skipKeys) {
            keys = Object.entries(this.args).map(x => {
                return {
                    name: helper.tools.formatter.toCapital(x[0]),
                    value: x[1]
                };
            });
        }
        helper.tools.log.commandOptions(
            keys,
            this.input.id,
            this.name,
            this.input.type,
            this.commanduser,
            this.input.message,
            this.input.interaction,
        );
    }
    execute() {
        this.setArgs();
        // do stuff
        // send msg
    }
    send() {
        helper.tools.commands.sendMessage({
            type: this.input.type,
            message: this.input.message,
            interaction: this.input.interaction,
            args: this.ctn,
        }, this.input.canReply);
    }
}

class TEMPLATE extends Command {
    declare protected args: {
        xyzxyz: string;
    };
    constructor() {
        super();
        this.args = {
            xyzxyz: ''
        };
    }
    async setArgsMsg() {
        this.commanduser = this.input.message.author;
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;
    }
    async setArgsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
        this.commanduser = interaction?.member?.user ?? this.input.interaction?.user;
        const temp = helper.tools.commands.getButtonArgs(this.input.id);
        if (temp.error) {
            interaction.followUp({
                content: helper.vars.errors.paramFileMissing,
                flags: Discord.MessageFlags.Ephemeral,
                allowedMentions: { repliedUser: false }
            });
            helper.tools.commands.disableAllButtons(this.input.message);
            return;
        }
    }
    async setArgsLink() {
        this.commanduser = this.input.message.author;
        const messagenohttp = this.input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
    }
    async execute() {
        this.setArgs();
        this.logInput();
        // do stuff

        this.send();
    }
}