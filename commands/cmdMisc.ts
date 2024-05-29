import * as Discord from 'discord.js';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as replayparser from 'osureplayparser';
import yts from 'yt-search';
import { path, precomppath } from '../path.js';
import * as calc from '../src/calc.js';
import * as cmdchecks from '../src/checks.js';
import * as colourfunc from '../src/colourcalc.js';
import * as buttonsthing from '../src/consts/buttons.js';
import * as colours from '../src/consts/colours.js';
import * as def from '../src/consts/defaults.js';
import * as emojis from '../src/consts/emojis.js';
import * as gifs from '../src/consts/gif.js';
import * as helpinfo from '../src/consts/helpinfo.js';
import * as insp from '../src/consts/inspire.js';
import * as mainconst from '../src/consts/main.js';
import * as response from '../src/consts/responses.js';
import * as embedStuff from '../src/embed.js';
import * as func from '../src/func.js';
import * as log from '../src/log.js';
import * as osufunc from '../src/osufunc.js';
import * as osumodcalc from '../src/osumodcalc.js';
import * as extypes from '../src/types/extratypes.js';
import * as osuApiTypes from '../src/types/osuApiTypes.js';
import * as msgfunc from './msgfunc.js';

/**
 * yes or no
 */
export async function _8ball(input: extypes.commandInput) {

    let commanduser;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: '8ball',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    //agree, disagree, maybe, other
    const responses = [
        'yes', 'yeahhh', 'yeah of course', 'absolutely',
        'no', 'What? no', 'definitely maybe not', 'nah', 'nope',
        '知らない', 'a strong maybe', '多分', 'come again?', 'ehhhh', '⠀', 'ask me later',
        '💀', '🥺', 'bruhhh', 'splish splash your question is trash', 3, 'why would you ask me that? what is wrong with you man...', '😭'
    ];

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const value = Math.floor(Math.random() * 4);
    let content: string;
    switch (value) {
        case 0:
            content = response.affirm[Math.floor(Math.random() * response.affirm.length)];
            break;
        case 1:
            content = response.negate[Math.floor(Math.random() * response.negate.length)];
            break;
        case 2:
            content = response.huh[Math.floor(Math.random() * response.huh.length)];
            break;
        case 3: default:
            content = response.other[Math.floor(Math.random() * response.other.length)];
            break;
    }


    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content,
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: '8ball',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: '8ball',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * flips a coin and returns heads or tails
 */
export async function coin(input: extypes.commandInput) {
    let commanduser: Discord.User;


    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
    }
    //==============================================================================================================================================================================================
    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'coin',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const arr = ['Heads', 'Tails'];

    const msg = arr[Math.floor(Math.random() * arr.length)];

    const file = new Discord.AttachmentBuilder(`${precomppath}/files/img/coin/${msg}.png`);

    const embed = new Discord.EmbedBuilder()
        .setTitle(msg)
        .setImage(`attachment://${msg}.png`)

        ;

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed],
            files: [file]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'coin',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'coin',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

export async function duckify(input: extypes.commandInput) {

    let commanduser: Discord.User;
    let string: string = '';

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            string = input.args.join(' ');
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            string = input.obj.options.getString('text');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'duckify',
        options: [{
            name: 'text',
            value: string
        }],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const frStr = string.split(' ');
    const fin: string[] = [];
    for (const string in frStr) {
        fin.push('quack');
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: fin.join(' ')
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'Duckify',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'Duckify',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}

/**
 * send gif
 */
export async function gif(input: extypes.commandInput) {
    let commanduser: Discord.User;
    type giftype = 'slap' | 'punch' | 'kiss' | 'hug' | 'lick' | 'pet';
    let type: giftype;
    let secondaryUser: Discord.User;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            secondaryUser = input.obj.mentions.users.size > 0 ? input.obj.mentions.users.first() : input.obj.author;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            secondaryUser = input.obj.options.getUser('target');
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
    }
    if (input.overrides != null) {
        if (input?.overrides?.ex != null) {
            type = input?.overrides?.ex as giftype;
        }
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'gif',
        options: [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Target user',
                value: secondaryUser.id
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    let gifSelection = [def.images.any.url];
    let baseString = 'null';
    const self = commanduser.id == secondaryUser.id;
    switch (type) {
        case 'hug': {
            gifSelection = gifs.hug;
            baseString = self ?
                'user wants a hug' :
                'user gives target a big hug';
        }
            break;
        case 'kiss': {
            gifSelection = gifs.kiss;
            baseString = self ?
                'user wants a kiss' :
                'user kisses target';
        }
            break;
        case 'lick': {
            gifSelection = gifs.lick;
            baseString = self ?
                'user licks themselves' :
                'user licks target';
        }
            break;
        case 'pet': {
            gifSelection = gifs.pet;
            baseString = self ?
                'user wants to be pet' :
                'user pets target softly';
        }
            break;
        case 'punch': {
            gifSelection = gifs.punch;
            baseString = self ?
                'user punches themselves' :
                'user punches target very hard';
        }
            break;
        case 'slap': {
            gifSelection = gifs.slap;
            baseString = self ?
                'user slaps themselves' :
                'user slaps target very hard';
        }
            break;
    }

    if (gifSelection.length < 1) {
        gifSelection.push(def.images.any.url);
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle(baseString.replace('user', commanduser.username).replace('target', secondaryUser.username))
        .setImage(gifSelection[Math.floor(Math.random() * gifSelection.length)])
        ;

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'gif',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'gif',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * search for an image
 */
export async function image(input: extypes.commandInput) {

    let commanduser;
    let query;
    let iserr = false;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            query = input.args.join(' ');
            if (!input.args[0]) {
                iserr = true;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            query = input.obj.options.getString('query');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'image',
        options: [
            {
                name: 'Query',
                value: query
            }
        ],
        config: input.config
    });


    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const res = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?q=${query}&cx=${input.config?.google?.engineId}&key=${input.config?.google?.apiKey}&searchType=image`
    );


    if (!res || res.status !== 200) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Error - could not find requested image(s)`,
            }
        }, input.canReply);
        return;
    }

    const response: extypes.imagesearches = await res.json() as any;
    fs.writeFileSync(`debug/command-image=imageSearch=${input.obj.guildId}.json`, JSON.stringify(response, null, 4), 'utf-8');

    if (!response.items) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Error - no results found`,
            }
        }, input.canReply);
        return;
    }

    let resimg = '';
    let i: number;
    for (i = 0; i < response.items.length && i < 5; i++) {
        resimg += `\n\n<${response.items[i].link}>`;
    }

    const imageEmbed = new Discord.EmbedBuilder()
        .setURL(`${'https://www.google.com/search?q=' + query.replaceAll(' ', '+')}`)
        .setTitle(`IMAGE RESULTS FOR ${query}`)
        .setDescription(`(NOTE - links may be unsafe)\n${resimg}`)
        .setColor(colours.embedColour.query.dec);
    const useEmbeds = [imageEmbed];

    for (let i = 0; i < 5; i++) {
        const curimg = new Discord.EmbedBuilder()
            .setURL(`${'https://www.google.com/search?q=' + query.replaceAll(' ', '+')}`)
            .setImage(`${response.items[i].image.thumbnailLink}`);
        useEmbeds.push(curimg);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: useEmbeds
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'image',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'image',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }
}

export async function inspire(input: extypes.commandInput) {

    let commanduser: Discord.User;
    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'Inspire',
        options: [],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const templateString = insp.templateStrings[Math.floor(Math.random() * insp.templateStrings.length)];
    let sendString = templateString.string;

    for (let i = 0; i < templateString.names; i++) {
        const rdmName = insp.names[Math.floor(Math.random() * insp.names.length)];
        sendString = sendString.replaceAll(`name${i + 1}ba`, rdmName.base);
        sendString = sendString.replaceAll(`name${i + 1}pl`, rdmName.pluralised);
        sendString = sendString.replaceAll(`name${i + 1}ia`, rdmName.indefAr);
    }
    for (let i = 0; i < templateString.verbs; i++) {
        const rdmVerb = insp.verbs[Math.floor(Math.random() * insp.verbs.length)];
        sendString = sendString.replaceAll(`verb${i + 1}ba`, rdmVerb.base);
        sendString = sendString.replaceAll(`verb${i + 1}pa`, rdmVerb.past);
        sendString = sendString.replaceAll(`verb${i + 1}pr`, rdmVerb.present);
        sendString = sendString.replaceAll(`verb${i + 1}in`, rdmVerb.ing);
    }
    for (let i = 0; i < templateString.descriptors; i++) {
        const rdmDesc = insp.descriptors[Math.floor(Math.random() * insp.descriptors.length)];
        sendString = sendString.replaceAll(`descriptor${i + 1}`, rdmDesc);
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle('Inspirational Quote')
        .setDescription(calc.toCapital(sendString));

    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [embed]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'Inspire',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'Inspire',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * paper scissors rock? rock paper scissors? idfk what the right order is
 */
export async function janken(input: extypes.commandInput) {
    let commanduser: Discord.User;
    let userchoice: string;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            userchoice = input.args[0];
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'janken',
        options: [
            {
                name: 'choice',
                value: userchoice
            }
        ],
        config: input.config,
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const real = func.jankenConvert(userchoice);
    if (real == 'INVALID') {
        const finalMessage = await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: 'Please input a valid argument'
            }
        }, input.canReply);
        log.logCommand({
            event: 'Error',
            commandName: 'janken',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Invalid user input',
            config: input.config,
        });
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
    }
    content = `${toEmoji[real]} vs. ${toEmoji[pcChoice]} | ` + content;
    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'janken',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'janken',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config,
        });
    }
}

/**
 * generate a poll
 */
export function poll(input: extypes.commandInput) {

    let commanduser;
    let pollTitle: string;
    let pollOpts: string[];
    let overrideEmojis: string[];
    let pollOptsInit: string;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            pollTitle = input.args.join(' ');
            pollOpts = ['yes', 'no'];
            overrideEmojis = ['✔', '❌'];
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            pollTitle = input.obj.options.getString('title');
            pollOptsInit = input.obj.options.getString('options');
            if (pollOptsInit.includes(',')) {
                pollOpts = pollOptsInit.split(',');
            }
            else if (pollOptsInit.includes('+')) {
                pollOpts = pollOptsInit.split('+');
            }
            else if (pollOptsInit.includes('|')) {
                pollOpts = pollOptsInit.split('|');
            }
            else if (pollOptsInit.includes('&')) {
                pollOpts = pollOptsInit.split('&');
            } else {
                pollOpts = [pollOptsInit];
            }
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'poll',
        options: [
            {
                name: 'Title',
                value: pollTitle
            },
            {
                name: 'Options',
                value: pollOptsInit
            }
        ],
        config: input.config
    });
    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const actualOpts: string[] = [];

    const react = [
        '🇦',
        '🇧',
        '🇨',
        '🇩',
        '🇪',
        '🇫',
        '🇬',
        '🇭',
        '🇮',
        '🇯',
        '🇰',
        '🇱',
        '🇲',
        '🇳',
        '🇴',
        '🇵',
        '🇶',
        '🇷',
        '🇸',
        '🇹',
        '🇺',
        '🇻',
        '🇼',
        '🇽',
        '🇾',
        '🇿'
    ];

    for (let i = 0; i < pollOpts.length; i++) {
        if (pollOpts[i].length >= 1) {
            actualOpts.push(pollOpts[i]);
        }
    }
    let optsToTxt: string = '';
    const curReactions: string[] = [];
    for (let i = 0; i < actualOpts.length && i < 26; i++) {
        if (actualOpts[i] == 'yes') {
            optsToTxt += `✔: yes\n`;
            curReactions.push('✔');
        } else if (actualOpts[i] == 'no') {
            optsToTxt += `❌: no\n`;
            curReactions.push('❌');
        } else {
            optsToTxt += `${react[i]}: ${actualOpts[i]}\n`;
            curReactions.push(react[i]);
        }
    }

    const pollEmbed = new Discord.EmbedBuilder()
        .setTitle(`${pollTitle}`)
        .setDescription(`${optsToTxt}`);

    //SEND/EDIT MSG==============================================================================================================================================================================================
    switch (input.commandType) {
        case 'message': case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            input.obj.channel.send({
                content: '',
                embeds: [pollEmbed],
                files: [],
                allowedMentions: { repliedUser: false },
            }).then(message => {
                for (let i = 0; i < actualOpts.length && i < 26; i++) {
                    message.react(curReactions[i]);
                }
            })
                .catch();
            if (input.commandType == 'interaction') {
                input.obj.reply({
                    content: '✔',
                    allowedMentions: { repliedUser: false },
                    ephemeral: true
                }).catch();
            }
        }
            break;
    }



    log.logCommand({
        event: 'Success',
        commandName: 'poll',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
        config: input.config
    });

}

/**
 * random number
 */
export async function roll(input: extypes.commandInput) {

    let commanduser;
    let maxNum: number;
    let minNum: number;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            maxNum = parseInt(input.args[0]);
            minNum = parseInt(input.args[1]);
            if (isNaN(maxNum) || !input.args[0]) {
                maxNum = 100;
            }
            if (isNaN(minNum) || !input.args[1]) {
                minNum = 0;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            maxNum = input.obj.options.getNumber('max') ? Math.floor(input.obj.options.getNumber('max')) : 100;
            minNum = input.obj.options.getNumber('min') ? Math.floor(input.obj.options.getNumber('min')) : 0;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'roll',
        options: [
            {
                name: 'Maximum number',
                value: maxNum
            },
            {
                name: 'Minimum number',
                value: minNum
            }
        ],
        config: input.config
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    if (isNaN(maxNum)) {
        maxNum = 100;
    }
    if (isNaN(minNum)) {
        minNum = 0;
    }
    const eq = Math.floor(Math.random() * (maxNum - minNum)) + minNum;

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: `${eq}`,
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'roll',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'roll',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}

/**
 * send a message
 */
export function say(input: extypes.commandInput) {

    let commanduser;
    let msg;
    let channel;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            channel = input.obj.channel;
            msg = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            channel = input.obj.options.getChannel('channel');
            if (channel == null || channel == undefined) {
                channel = input.obj.channel;
            }
            msg = input.obj.options.getString('message');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
        }
            break;
    }


    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'say',
        options: [
            {
                name: 'Message',
                value: msg
            },
            {
                name: 'Channel',
                value: channel.id
            }
        ],
        config: input.config
    });


    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    if (msg.length < 1) {
        msg = def.chocoMOF;
    }
    if (msg == def.chocoMOF) {
        channel.send({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(msg)
                .setColor(colours.embedColour.info.dec)
            ]
        });
    } else {
        channel.send({ content: msg });
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================
    switch (input.commandType) {
        //==============================================================================================================================================================================================

        case 'message': {
            input.obj = (input.obj as Discord.Message);
            input.obj.delete().catch();
        }
            break;
        case 'interaction': {
            (input.obj as Discord.Message | Discord.ChatInputCommandInteraction).reply({
                content: 'success!',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true,
                ephemeral: true
            })
                .catch();
        }

            //==============================================================================================================================================================================================

            break;
    }



    log.logCommand({
        event: 'Success',
        commandName: 'say',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
        config: input.config
    });

}

/**
 * fuck you alex
 */
export async function sex(input: extypes.commandInput) {
    let commanduser: Discord.User;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
        //==============================================================================================================================================================================================
        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
        }
            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
            commanduser = input.obj.member.user;
        }
            break;
        case 'link': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
        }
            break;
    }
    //==============================================================================================================================================================================================

    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'sex',
        options: [],
        config: input.config,
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const attachment = new Discord.AttachmentBuilder(`${precomppath}/files/img/smex.png`);
    console.log(precomppath);
    console.log(`${precomppath}/files/img/smex.png`);
    console.log(path);
    //SEND/EDIT MSG==============================================================================================================================================================================================
    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            files: [attachment]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'sex',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'sex',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config,
        });
    }

}

/**
 * search youtube
 */
export async function ytsearch(input: extypes.commandInput) {

    let commanduser;
    let query: string;
    let pg = 1;
    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message);
            commanduser = input.obj.author;
            query = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            commanduser = input.obj.member.user;
            query = input.obj.options.getString('query');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction);
            commanduser = input.obj.member.user;
            switch (input.button) {
                //pg says 
                case 'BigLeftArrow':
                    pg = 1;
                    break;
                case 'LeftArrow':
                    pg = +((input.obj.message.embeds[0].footer.text).split('Page: ')[1].split('/')[0]) - 1;
                    break;
                case 'RightArrow':
                    pg = +((input.obj.message.embeds[0].footer.text).split('Page: ')[1].split('/')[0]) + 1;
                    break;
                case 'BigRightArrow':
                    pg = +((input.obj.message.embeds[0].footer.text).split('Page: ')[1].split('/')[1].split('\n')[0]);
                    break;
                default:
                    pg = +((input.obj.message.embeds[0].footer.text).split('Page: ')[1].split('/')[0]);
                    break;
            }
            if (isNaN(+(input.obj.message.embeds[0].footer.text).split('Page: ')[1].split('/')[0]) || ((input.obj.message.embeds[0].footer.text).split('Page: ')[1].split('/')[0]) == 'NaN') {
                pg = 1;
            }
            query = input.obj.message.embeds[0].footer.text.split('Query: ')[1];
        }
            break;
    }


    //==============================================================================================================================================================================================
    log.logCommand({
        event: 'Command',
        commandType: input.commandType,
        commandId: input.absoluteID,
        commanduser,
        object: input.obj,
        commandName: 'ytsearch',
        options: [
            {
                name: 'Query',
                value: query
            },
            {
                name: 'Page',
                value: pg
            }
        ],
        config: input.config
    });

    if (input.overrides != null) {
        if (input.overrides.page != null) {
            pg = input.overrides.page;
        }
    }

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
    const pgbuttons = await msgfunc.pageButtons('ytsearch', commanduser, input.absoluteID);
    if (pg <= 1) {
        pg = 1;
    }
    if (input.commandType == 'button' && pg >= +(((input.obj as Discord.ButtonInteraction).message.embeds[0].footer.text).split('Page: ')[1].split('/')[1].split('\n')[0])) {
        pg = +(((input.obj as Discord.ButtonInteraction).message.embeds[0].footer.text).split('Page: ')[1].split('/')[1].split('\n')[0]);
    }
    pg--;


    if (!query || query.length < 1) {
        await msgfunc.sendMessage({
            commandType: input.commandType,
            obj: input.obj,
            args: {
                content: `Error - invalid search query`,
                edit: true
            }
        }, input.canReply);
        return;
    }
    const searchEmbed: Discord.EmbedBuilder = new Discord.EmbedBuilder()
        .setTitle(`YouTube search results for: ${query}`)
        .setColor(colours.embedColour.query.dec);

    let initSearch: extypes.ytSearch;
    if (func.findFile(`${query.replaceAll(/[^a-zA-Z0-9-]/g, '+')}`, 'ytsearch') &&
        !('error' in func.findFile(`${query.replaceAll(/[^a-zA-Z0-9-]/g, '+')}`, 'ytsearch')) &&
        input.button != 'Refresh'
    ) {
        initSearch = func.findFile(`${query.replaceAll(/[^a-zA-Z0-9-]/g, '+')}`, 'ytsearch');
    } else {
        initSearch = await yts.search(query);
    }

    fs.writeFileSync(`debug/command-ytsearch=ytsSearch=${input.obj.guildId}.json`, JSON.stringify(initSearch, null, 4), 'utf-8');
    func.storeFile(initSearch as any, `${query.replaceAll(/[^a-zA-Z0-9-]/g, '+')}`, 'ytsearch');

    if (initSearch.videos.length < 1) {
        searchEmbed.setDescription('No results found.');
    } else {
        const objs = initSearch.videos;
        for (let i = 0; i < 5 && i + (pg * 5) < objs.length; i++) {
            const curItem = objs[i + (pg * 5)];
            if (!curItem) break;
            const desc = curItem.description.length > 50 ?
                curItem.description.slice(0, 50) + '...' : curItem.description;
            searchEmbed.addFields([
                {
                    name: `#${i + (pg * 5) + 1}`,
                    value: `[${curItem.title}](${curItem.url})
Published by [${curItem.author.name}](${curItem.author.url}) ${curItem.ago}
Duration: ${curItem.timestamp} (${curItem.duration.seconds}s)
Description: \`${desc}\`
`,
                    inline: false
                }
            ]);
        }
        searchEmbed.setFooter({ text: `Page: ${pg + 1}/${Math.ceil(objs.length / 5)}\nQuery: ${query}` });
    }
    if (pg <= 1) {
        (pgbuttons.components as Discord.ButtonBuilder[])[0].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[1].setDisabled(true);
    }
    if (pg + 1 >= Math.ceil(initSearch.videos.length / 5)) {
        (pgbuttons.components as Discord.ButtonBuilder[])[3].setDisabled(true);
        (pgbuttons.components as Discord.ButtonBuilder[])[4].setDisabled(true);
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [searchEmbed],
            components: [pgbuttons]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'ytsearch',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            config: input.config
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'ytsearch',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
            config: input.config
        });
    }

}