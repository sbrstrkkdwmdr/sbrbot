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
import * as mainconst from '../src/consts/main.js';
import * as embedStuff from '../src/embed.js';
import * as log from '../src/log.js';
import * as osufunc from '../src/osufunc.js';
import * as osumodcalc from '../src/osumodcalc.js';
import * as func from '../src/tools.js';
import * as extypes from '../src/types/extraTypes.js';
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
        options: []
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const responses = [
        'yes', 'no', 'What? no', '知らない', 'nope', 'yeahhh', 'a strong maybe', 'definitely maybe not', 'nah', 'yeah of course', '多分', '絶対!!!',
        'come again?', 'ehhhh', '⠀', '💀', '🥺', 'bruhhh', 'splish splash your question is trash', 3
    ];

    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: `${responses[Math.floor(Math.random() * responses.length)]}`,
        }
    }, input.canReply);


    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: '8ball',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: '8ball',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        options: []
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const arr = ['Heads', 'Tails'];

    const msg = arr[Math.floor(Math.random() * arr.length)];

    const file = new Discord.AttachmentBuilder(`${precomppath}\\files\\img\\coin\\${msg}.png`);

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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'coin',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
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
        }]
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
            commandName: 'COMMANDNAME',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'COMMANDNAME',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
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
        ]
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'gif',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send',
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
        ]
    });


    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const res = await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?q=${query}&cx=${input.config.google.engineId}&key=${input.config.google.apiKey}&searchType=image`
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'image',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        ]
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
        ]
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
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'roll',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
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
        ]
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
    });

}

/**
 * search youtube
 */
export async function ytsearch(input: extypes.commandInput) {

    let commanduser;
    let query: string;

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
            }
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

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

    const initSearch: extypes.ytSearch = await yts.search(query);
    fs.writeFileSync(`debug/command-ytsearch=ytsSearch=${input.obj.guildId}.json`, JSON.stringify(initSearch, null, 4), 'utf-8');


    if (initSearch.videos.length < 1) {
        searchEmbed.setDescription('No results found.');
    } else {
        const objs = initSearch.videos;
        for (let i = 0; i < 5 && i < objs.length; i++) {
            const curItem = objs[i];
            searchEmbed.addFields([
                {
                    name: `#${i + 1}`,
                    value: `[${curItem.title}](${curItem.url})
Published by [${curItem.author.name}](${curItem.author.url}) ${curItem.ago}
Duration: ${curItem.timestamp} (${curItem.duration.seconds}s)
Description: \`${curItem.description}\`
`,
                    inline: false
                }
            ]);
        }
    }


    //SEND/EDIT MSG==============================================================================================================================================================================================

    const finalMessage = await msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [searchEmbed]
        }
    }, input.canReply);

    if (finalMessage == true) {
        log.logCommand({
            event: 'Success',
            commandName: 'ytsearch',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
        });
    } else {
        log.logCommand({
            event: 'Error',
            commandName: 'ytsearch',
            commandType: input.commandType,
            commandId: input.absoluteID,
            object: input.obj,
            customString: 'Message failed to send'
        });
    }

}