import Discord from 'discord.js';
import * as osumodcalc from 'osumodcalculator';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import * as apitypes from '../types/osuapi.js';
import * as tooltypes from '../types/tools.js';
import { Command, OsuCommand } from './command.js';

// add, remove, list, channel

export class TrackAR extends OsuCommand {
    declare protected args: {
        user: string;
        mode: apitypes.GameMode;
    };
    type: 'add' | 'remove';
    constructor() {
        super();
        this.args = {
            user: undefined,
            mode: 'osu'
        };
    }
    async setArgsMsg() {
        {
            const temp = await helper.tools.commands.parseArgsMode(this.input);
            this.input.args = temp.args;
            this.args.mode = temp.mode;
        }
        const userArgFinder = helper.tools.commands.matchArgMultiple(helper.vars.argflags.user, this.input.args, true, 'string', true, false);
        if (userArgFinder.found) {
            this.args.user = userArgFinder.output;
            this.input.args = userArgFinder.args;
        }
        this.args.user = this.args.user ?? this.input.args[0];
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.args.user = interaction.options.getString('user');
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff

        if (this.args.user == null || !this.args.user || this.args.user.length < 1) {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: helper.vars.errors.uErr.osu.tracking.nullUser,
                    edit: true
                }
            }, this.input.canReply);
            return;
        }

        const guildsetting = await helper.vars.guildSettings.findOne({ where: { guildid: this.input.message?.guildId ?? this.input.interaction?.guildId } });

        if (!guildsetting?.dataValues?.trackChannel) {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: helper.vars.errors.uErr.osu.tracking.channel_ms,
                    edit: true
                }
            }, this.input.canReply);
            return;
        } else if (guildsetting?.dataValues?.trackChannel != (this.input?.message?.channelId ?? this.input?.interaction?.channelId)) {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: helper.vars.errors.uErr.osu.tracking.channel_wrong.replace('[CHID]', guildsetting?.dataValues?.trackChannel),
                    edit: true
                }
            }, this.input.canReply);
            return;

        }

        let osudata: apitypes.User;

        try {
            const t = await this.getProfile(this.args.user, this.args.mode);
            osudata = t;
        } catch (e) {
            return;
        }

        this.ctn.content = this.getMsg(osudata.username);

        helper.tools.track.editTrackUser({
            userid: osudata.id,
            action: this.type,
            guildId: this.input.message?.guildId ?? this.input.interaction?.guildId,
            mode: this.args.mode
        });
        this.send();
    }
    getMsg(uid: string) {
        switch (this.type) {
            case 'add':
                return `Added \`${uid}\` to the tracking list`;
            case 'remove':
                return `Removed \`${uid}\` from the tracking list`;
        }
    }
}

export class TrackAdd extends TrackAR {
    constructor() {
        super();
        this.name = 'TrackAdd';
        this.args = {
            user: undefined,
            mode: 'osu'
        };
        this.type = 'add';
    }
}

export class TrackRemove extends TrackAR {
    constructor() {
        super();
        this.name = 'TrackRemove';
        this.args = {
            user: undefined,
            mode: 'osu'
        };
        this.type = 'remove';
    }
}

export class TrackChannel extends OsuCommand {
    declare protected args: {
        channelId: string;
    };
    constructor() {
        super();
        this.name = 'TrackChannel';
        this.args = {
            channelId: null
        };
    }
    async setArgsMsg() {
        this.args.channelId = this.input.args[0];
        if (this.input.message.content.includes('<#')) {
            this.args.channelId = this.input.message.content.split('<#')[1].split('>')[0];
        }
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.args.channelId = (interaction.options.getChannel('channel')).id;
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff
        const guildsetting = await helper.vars.guildSettings.findOne({ where: { guildid: this.input.message?.guildId ?? this.input.interaction?.guildId } });
        if (!this.args.channelId) {
            if (!guildsetting.dataValues.trackChannel) {
                await helper.tools.commands.sendMessage({
                    type: this.input.type,
                    message: this.input.message,
                    interaction: this.input.interaction,
                    args: {
                        content: helper.vars.errors.uErr.osu.tracking.channel_ms,
                        edit: true
                    }
                }, this.input.canReply);
                return;
            }
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: `The current tracking channel is <#${guildsetting.dataValues.trackChannel}>`,
                    edit: true
                }
            }, this.input.canReply);
            return;
        }
        if (!this.args.channelId || isNaN(+this.args.channelId) || !helper.vars.client.channels.cache.get(this.args.channelId)) {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: helper.vars.errors.uErr.admin.channel.msid,
                    edit: true
                }
            }, this.input.canReply);
            return;
        }
        await guildsetting.update({
            trackChannel: this.args.channelId
        }, {
            where: { guildid: this.input.message?.guildId ?? this.input.interaction?.guildId }
        });
        this.ctn.content = `Tracking channel set to <#${this.args.channelId}>`;
        this.send();
    }
}

export class TrackList extends OsuCommand {
    declare protected args: {};

    constructor() {
        super();
        this.name = 'TrackList';
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff
        const users = await helper.vars.trackDb.findAll();
        const useridsarraylen = await helper.vars.trackDb.count();
        const userList: {
            osuid: string,
            userid: string,
            mode: string,
        }[] = [];
        for (let i = 0; i < useridsarraylen; i++) {
            const user = users[i].dataValues;
            let guilds;
            try {
                if (user.guilds.length < 3) throw new Error('no guilds');
                guilds = user.guilds.includes(',')
                    ? user.guilds.split(',') :
                    [user.guilds];

            } catch (error) {
                guilds = [];
            }

            //check if input.message?.guildId ?? input.interaction?.guildId is in guilds
            if (guilds.includes(this.input.message?.guildId)) {
                userList.push({
                    osuid: `${user.osuid}`,
                    userid: `${user.userid}`,
                    mode: `${user.mode}`
                });
            }
        }
        const userListEmbed = new Discord.EmbedBuilder()
            .setTitle(`All tracked users in ${this.input.message.guild.name}`)
            .setColor(helper.vars.colours.embedColour.userlist.dec)
            .setDescription(`There are ${userList.length} users being tracked in this server\n\n` +
                `${userList.map((user, i) => `${i + 1}. ${helper.vars.emojis.gamemodes[user.mode == 'undefined' ? 'osu' : user.mode]} https://osu.ppy.sh/users/${user.osuid}`).join('\n')}`
            );
        this.ctn.embeds = [userListEmbed];
        this.send();
    }
}