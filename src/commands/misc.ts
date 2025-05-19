import Discord from 'discord.js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
import { Command } from './command.js';

export class _8Ball extends Command {
    declare protected args: {};
    constructor() {
        super();
        this.name = 'TEMPLATE';
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff

        const value = Math.floor(Math.random() * 4);
        switch (value) {
            case 0:
                this.ctn.content = helper.vars.responses.affirm[Math.floor(Math.random() * helper.vars.responses.affirm.length)];
                break;
            case 1:
                this.ctn.content = helper.vars.responses.negate[Math.floor(Math.random() * helper.vars.responses.negate.length)];
                break;
            case 2:
                this.ctn.content = helper.vars.responses.huh[Math.floor(Math.random() * helper.vars.responses.huh.length)];
                break;
            case 3: default:
                this.ctn.content = helper.vars.responses.other[Math.floor(Math.random() * helper.vars.responses.other.length)];
                break;
        }

        this.send();
    }
}

export class CoinFlip extends Command {
    declare protected args: {};
    constructor() {
        super();
        this.name = 'TEMPLATE';
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff

        const arr = ['Heads', 'Tails'];
        const msg = arr[Math.floor(Math.random() * arr.length)];
        const file = new Discord.AttachmentBuilder(`${helper.vars.path.precomp}/files/img/coin/${msg}.png`);
        const embed = new Discord.EmbedBuilder()
            .setTitle(msg)
            .setImage(`attachment://${msg}.png`);

        this.ctn.embeds = [embed];
        this.ctn.files = [file];

        this.send();
    }
}
type giftype = 'slap' | 'punch' | 'kiss' | 'hug' | 'lick' | 'pet';
export class Gif extends Command {
    declare protected args: {
        target: Discord.User;
        type: giftype;
    };
    constructor() {
        super();
        this.name = 'TEMPLATE';
        this.args = {
            target: null,
            type: null,
        };
    }
    async setArgsMsg() {
        this.args.target = this.input.message.mentions.users.size > 0 ? this.input.message.mentions.users.first() : this.input.message.author;
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.args.target = interaction.options.getUser('target');
    }
    getOverrides(): void {
        if (!this.input.overrides) return;
        if (this.input?.overrides?.ex != null) {
            this.args.type = this.input?.overrides?.ex as giftype;
        }
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff

        let gifSelection = [helper.vars.defaults.images.any.url];
        let baseString = 'null';
        const self = this.commanduser.id == this.args.target.id;
        switch (this.args.type) {
            case 'hug': {
                gifSelection = helper.vars.gif.hug;
                baseString = self ?
                    'user wants a hug' :
                    'user gives target a big hug';
            }
                break;
            case 'kiss': {
                gifSelection = helper.vars.gif.kiss;
                baseString = self ?
                    'user wants a kiss' :
                    'user kisses target';
            }
                break;
            case 'lick': {
                gifSelection = helper.vars.gif.lick;
                baseString = self ?
                    'user licks themselves' :
                    'user licks target';
            }
                break;
            case 'pet': {
                gifSelection = helper.vars.gif.pet;
                baseString = self ?
                    'user wants to be pet' :
                    'user pets target softly';
            }
                break;
            case 'punch': {
                gifSelection = helper.vars.gif.punch;
                baseString = self ?
                    'user punches themselves' :
                    'user punches target very hard';
            }
                break;
            case 'slap': {
                gifSelection = helper.vars.gif.slap;
                baseString = self ?
                    'user slaps themselves' :
                    'user slaps target very hard';
            }
                break;
        }

        const gifSearch = await helper.tools.api.getGif(this.args.type);
        if (gifSearch?.data?.results?.length > 1) {
            gifSelection = gifSearch?.data?.results?.map(x => x.media_formats.gif.url);
        }

        if (gifSelection.length < 1) {
            gifSelection.push(helper.vars.defaults.images.any.url);
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(baseString.replace('user', this.commanduser.username).replace('target', this.args.target.username))
            .setImage(gifSelection[Math.floor(Math.random() * gifSelection.length)]);

        this.ctn.embeds = [embed];
        this.send();
    }

}
export class Janken extends Command {
    declare protected args: {
        userchoice: string;
    };
    constructor() {
        super();
        this.name = 'TEMPLATE';
        this.args = {
            userchoice: ''
        };
    }
    async setArgsMsg() {
        this.args.userchoice = this.input.args[0];
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.args.userchoice = interaction.options.getString('choice');
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff
        const real = helper.tools.game.jankenConvert(this.args.userchoice);
        if (real == 'INVALID') {
            await helper.tools.commands.sendMessage({
                type: this.input.type,
                message: this.input.message,
                interaction: this.input.interaction,
                args: {
                    content: 'Please input a valid argument'
                }
            }, this.input.canReply);
            return;
        }

        const opts = ['paper', 'scissors', 'rock'];
        const pcChoice = opts[Math.floor(Math.random() * opts.length)];

        let content = `It's a draw!`;
        const wtxt = 'You win!';
        const ltxt = 'You lose!';
        switch (pcChoice) {
            case 'paper':
                switch (real) {
                    case 'rock':
                        content = ltxt;
                        break;
                    case 'scissors':
                        content = wtxt;
                        break;
                }
                break;
            case 'rock':
                switch (real) {
                    case 'paper':
                        content = wtxt;
                        break;
                    case 'scissors':
                        content = ltxt;
                        break;
                }
                break;
            case 'scissors':
                switch (real) {
                    case 'paper':
                        content = ltxt;
                        break;
                    case 'rock':
                        content = wtxt;
                        break;
                }
                break;
        }

        const toEmoji = {
            'paper': '📃',
            'scissors': '✂',
            'rock': '🪨',
        };

        this.ctn.content = `${toEmoji[real]} vs. ${toEmoji[pcChoice]} | ` + content;
        this.send();
    }
}
export class Roll extends Command {
    declare protected args: {
        maxNum: number;
        minNum: number;
    };
    constructor() {
        super();
        this.name = 'TEMPLATE';
        this.args = {
            maxNum: 100,
            minNum: 0,
        };
    }
    async setArgsMsg() {
        this.args.maxNum = parseInt(this.input.args[0]);
        this.args.minNum = parseInt(this.input.args[1]);
        if (isNaN(this.args.maxNum) || !this.input.args[0]) {
            this.args.maxNum = 100;
        }
        if (isNaN(this.args.minNum) || !this.input.args[1]) {
            this.args.minNum = 0;
        }
    }
    async setArgsInteract() {
        const interaction = this.input.interaction as Discord.ChatInputCommandInteraction;
        this.args.maxNum = interaction.options.getNumber('max') ?? this.args.maxNum;
        this.args.minNum = interaction.options.getNumber('min') ?? this.args.minNum;
    }
    async execute() {
        await this.setArgs();
        this.logInput();
        // do stuff

        if (isNaN(this.args.maxNum)) {
            this.args.maxNum = 100;
        }
        if (isNaN(this.args.minNum)) {
            this.args.minNum = 0;
        }
        const eq = Math.floor(Math.random() * (this.args.maxNum - this.args.minNum)) + this.args.minNum;
        this.ctn.content = eq + '';
        this.send();
    }
}