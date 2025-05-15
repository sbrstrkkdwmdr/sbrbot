import * as Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as rosu from 'rosu-pp-js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';

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
        this.ctn.files = ['']
    }
    setInput(input: bottypes.commandInput) {
        this.input = input;
    }
    async setArgs() {
        switch (this.input.type) {
            case 'message':
                this.commanduser = this.input.message.author;
                await this.setArgsMsg();
                break;
            case 'interaction':
                this.commanduser = this.input.interaction?.member?.user ?? this.input.interaction?.user;
                await this.setArgsInteract();
                break;
            case 'button':
                this.commanduser = this.input.interaction?.member?.user ?? this.input.interaction?.user;
                await this.setArgsBtn();
                break;
            case 'link':
                this.commanduser = this.input.message.author;
                await this.setArgsLink();
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
    getOverrides() { }
    async execute() {
        await this.setArgs();
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

// gasp capitalised o
export class OsuCommand extends Command {
    async getProfile(user: string, mode: apitypes.GameMode) {
        let osudataReq: tooltypes.apiReturn<apitypes.User>;

        if (helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode)) &&
            !('error' in helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode))) &&
            this.input.buttonType != 'Refresh'
        ) {
            osudataReq = helper.tools.data.findFile(user, 'osudata', helper.tools.other.modeValidator(mode));
        } else {
            osudataReq = await helper.tools.api.getUser(user, mode, []);
        }

        const osudata: apitypes.User = osudataReq.apiData;
        if (osudataReq?.error) {
            const err = helper.vars.errors.uErr.osu.profile.user.replace('[ID]', user);
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, err, false);
            throw new Error(err);

        }
        helper.tools.data.debug(osudataReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'osuData');

        if (osudata?.hasOwnProperty('error') || !osudata.id) {
            const err = helper.vars.errors.noUser(user);
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, err, true);
            throw new Error(err);
        }

        helper.tools.data.debug(osudataReq, 'command', this.name, this.input.message?.guildId ?? this.input.interaction?.guildId, 'osuData');

        helper.tools.data.userStatsCache([osudata], helper.tools.other.modeValidator(mode), 'User');

        helper.tools.data.storeFile(osudataReq, osudata.id, 'osudata', helper.tools.other.modeValidator(mode));
        helper.tools.data.storeFile(osudataReq, osudata.username, 'osudata', helper.tools.other.modeValidator(mode));

        return osudata;
    }
    async getMap(mapid: string | number) {
        let mapdataReq: tooltypes.apiReturn<apitypes.Beatmap>;
        if (helper.tools.data.findFile(mapid, 'mapdata') &&
            !('error' in helper.tools.data.findFile(mapid, 'mapdata')) &&
            this.input.buttonType != 'Refresh') {
            mapdataReq = helper.tools.data.findFile(mapid, 'mapdata');
        } else {
            mapdataReq = await helper.tools.api.getMap(mapid);
        }

        const mapdata = mapdataReq.apiData;
        if (mapdataReq?.error) {
            const err = helper.vars.errors.uErr.osu.map.m.replace('[ID]', mapid + '');
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, err, false);
            throw new Error(err);
        }
        if (mapdata?.hasOwnProperty('error')) {
            const err = helper.vars.errors.uErr.osu.map.m.replace('[ID]', mapid + '');
            await helper.tools.commands.errorAndAbort(this.input, this.name, true, err, true);
            throw new Error(err);
        }

        helper.tools.data.storeFile(mapdataReq, mapid, 'mapdata');

        return mapdata;
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
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
    }
    async setArgsBtn() {
        if (!this.input.message.embeds[0]) return;
        const interaction = (this.input.interaction as Discord.ButtonInteraction);
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
        const messagenohttp = this.input.message.content.replace('https://', '').replace('http://', '').replace('www.', '');
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff

        this.send();
    }
}