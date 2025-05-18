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
export class Gif extends Command {

}
export class Janken extends Command {

}
export class Roll extends Command {

}