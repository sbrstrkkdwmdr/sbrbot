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
    setArgs(input: bottypes.commandInput) {
        switch (input.type) {
            case 'message':
                this.setArgsMsg(input);
                break;
            case 'interaction':
                this.setArgsInteract(input);
                break;
            case 'button':
                this.setArgsBtn(input);
                break;
            case 'link':
                this.setArgsLink(input);
                break;
        }
    }
    setArgsMsg(input: bottypes.commandInput) {
        this.commanduser = input.message.author;
    }
    setArgsInteract(input: bottypes.commandInput) {
        let interaction = input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;
    }
    setArgsBtn(input: bottypes.commandInput) {
        if (!input.message.embeds[0]) return;
        let interaction = (input.interaction as Discord.ButtonInteraction);
        this.commanduser = interaction?.member?.user ?? input.interaction?.user;
        const temp = helper.tools.commands.getButtonArgs(input.id);
        if (temp.error) {
            interaction.followUp({
                content: helper.vars.errors.paramFileMissing,
                flags: Discord.MessageFlags.Ephemeral,
                allowedMentions: { repliedUser: false }
            });
            helper.tools.commands.disableAllButtons(input.message);
            return;
        }
    }
    setArgsLink(input: bottypes.commandInput) {
        this.commanduser = input.message.author;
        const messagenohttp = input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
    }
    logInput(input: bottypes.commandInput) {
        const keys = Object.entries(this.args);

        helper.tools.log.commandOptions(
            keys.map(x => {
                return {
                    name: helper.tools.formatter.toCapital(x[0]),
                    value: x[1]
                };
            }),
            input.id,
            this.name,
            input.type,
            this.commanduser,
            input.message,
            input.interaction,
        );
    }
    execute(input: bottypes.commandInput) {
        this.setArgs(input);
        // do stuff
        // send msg
    }
    send(input: bottypes.commandInput) {
        helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: this.ctn,
        }, input.canReply);
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
    setArgsMsg(input: bottypes.commandInput) {
        this.commanduser = input.message.author;
    }
    setArgsInteract(input: bottypes.commandInput) {
        const interaction = input.interaction as Discord.ChatInputCommandInteraction;
        this.commanduser = interaction?.member?.user ?? interaction?.user;
    }
    setArgsBtn(input: bottypes.commandInput) {
        if (!input.message.embeds[0]) return;
        const interaction = (input.interaction as Discord.ButtonInteraction);
        this.commanduser = interaction?.member?.user ?? input.interaction?.user;
        const temp = helper.tools.commands.getButtonArgs(input.id);
        if (temp.error) {
            interaction.followUp({
                content: helper.vars.errors.paramFileMissing,
                flags: Discord.MessageFlags.Ephemeral,
                allowedMentions: { repliedUser: false }
            });
            helper.tools.commands.disableAllButtons(input.message);
            return;
        }
    }
    setArgsLink(input: bottypes.commandInput) {
        this.commanduser = input.message.author;
        const messagenohttp = input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
    }
    async execute(input: bottypes.commandInput) {
        this.setArgs(input);
        this.logInput(input);
        // do stuff
        
        this.send(input);
    }
}