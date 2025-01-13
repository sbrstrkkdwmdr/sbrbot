import Discord from 'discord.js';
import * as helper from '../helper.js';
import * as bottypes from '../types/bot.js';
/**
 * yes or no
 */
export const _8ball = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
        }
            break;
        case 'button': {
if (!input.message.embeds[0]) return;
            input.interaction = (input.interaction as Discord.ButtonInteraction);
            commanduser = input.interaction?.member?.user ?? input.interaction?.user;
        }
            break;
    }

    helper.tools.log.commandOptions(
        [],
        input.id,
        '8ball',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    const value = Math.floor(Math.random() * 4);
    let content: string;
    switch (value) {
        case 0:
            content = helper.vars.responses.affirm[Math.floor(Math.random() * helper.vars.responses.affirm.length)];
            break;
        case 1:
            content = helper.vars.responses.negate[Math.floor(Math.random() * helper.vars.responses.negate.length)];
            break;
        case 2:
            content = helper.vars.responses.huh[Math.floor(Math.random() * helper.vars.responses.huh.length)];
            break;
        case 3: default:
            content = helper.vars.responses.other[Math.floor(Math.random() * helper.vars.responses.other.length)];
            break;
    }


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content,
        }
    }, input.canReply);
};

/**
 * flips a coin and returns heads or tails
 */
export const coin = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
        }
            break;
    }
    helper.tools.log.commandOptions(
        [],
        input.id,
        'coinflip',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    const arr = ['Heads', 'Tails'];
    const msg = arr[Math.floor(Math.random() * arr.length)];
    const file = new Discord.AttachmentBuilder(`${helper.vars.path.precomp}/files/img/coin/${msg}.png`);
    const embed = new Discord.EmbedBuilder()
        .setTitle(msg)
        .setImage(`attachment://${msg}.png`);


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed],
            files: [file]
        }
    }, input.canReply);
};

/**
 * send gif
 */
export const gif = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    type giftype = 'slap' | 'punch' | 'kiss' | 'hug' | 'lick' | 'pet';
    let type: giftype;
    let secondaryUser: Discord.User;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            secondaryUser = input.message.mentions.users.size > 0 ? input.message.mentions.users.first() : input.message.author;
        }
            break;
    }
    if (input.overrides) {
        if (input?.overrides?.ex != null) {
            type = input?.overrides?.ex as giftype;
        }
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'Type',
                value: type
            },
            {
                name: 'Target',
                value: `${secondaryUser.id} - ${secondaryUser.username}`
            }
        ],
        input.id,
        'gif',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    let gifSelection = [helper.vars.defaults.images.any.url];
    let baseString = 'null';
    const self = commanduser.id == secondaryUser.id;
    switch (type) {
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

    const gifSearch = await helper.tools.api.getGif(type);
    if (gifSearch?.data?.results?.length > 1) {
        gifSelection = gifSearch?.data?.results?.map(x => x.media_formats.gif.url);
    }

    if (gifSelection.length < 1) {
        gifSelection.push(helper.vars.defaults.images.any.url);
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle(baseString.replace('user', commanduser.username).replace('target', secondaryUser.username))
        .setImage(gifSelection[Math.floor(Math.random() * gifSelection.length)]);


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed]
        }
    }, input.canReply);
};

export const inspire = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
        }
            break;
    }

    helper.tools.log.commandOptions(
        [],
        input.id,
        'inspire',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    const templateString = helper.vars.inspire.templateStrings[Math.floor(Math.random() * helper.vars.inspire.templateStrings.length)];
    let sendString = templateString.string;

    for (let i = 0; i < templateString.names; i++) {
        const rdmName = helper.vars.inspire.names[Math.floor(Math.random() * helper.vars.inspire.names.length)];
        sendString = sendString.replaceAll(`name${i + 1}ba`, rdmName.base);
        sendString = sendString.replaceAll(`name${i + 1}pl`, rdmName.pluralised);
        sendString = sendString.replaceAll(`name${i + 1}ia`, rdmName.indefAr);
    }
    for (let i = 0; i < templateString.verbs; i++) {
        const rdmVerb = helper.vars.inspire.verbs[Math.floor(Math.random() * helper.vars.inspire.verbs.length)];
        sendString = sendString.replaceAll(`verb${i + 1}ba`, rdmVerb.base);
        sendString = sendString.replaceAll(`verb${i + 1}pa`, rdmVerb.past);
        sendString = sendString.replaceAll(`verb${i + 1}pr`, rdmVerb.present);
        sendString = sendString.replaceAll(`verb${i + 1}in`, rdmVerb.ing);
    }
    for (let i = 0; i < templateString.descriptors; i++) {
        const rdmDesc = helper.vars.inspire.descriptors[Math.floor(Math.random() * helper.vars.inspire.descriptors.length)];
        sendString = sendString.replaceAll(`descriptor${i + 1}`, rdmDesc);
    }

    const embed = new Discord.EmbedBuilder()
        .setTitle('Inspirational Quote')
        .setDescription(helper.tools.formatter.toCapital(sendString));


    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            embeds: [embed]
        }
    }, input.canReply);
};

/**
 * paper scissors rock? rock paper scissors? idfk what the right order is
 */
export const janken = async (input: bottypes.commandInput) => {
    let commanduser: Discord.User | Discord.APIUser;
    let userchoice: string;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            userchoice = input.args[0];
        }
            break;
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'Choice',
                value: userchoice
            }
        ],
        input.id,
        'janken',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    const real = helper.tools.game.jankenConvert(userchoice);
    if (real == 'INVALID') {
        await helper.tools.commands.sendMessage({
            type: input.type,
            message: input.message,
            interaction: input.interaction,
            args: {
                content: 'Please input a valid argument'
            }
        }, input.canReply);
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
    content = `${toEmoji[real]} vs. ${toEmoji[pcChoice]} | ` + content;

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content
        }
    }, input.canReply);
};

/**
 * generate a poll
 */
export const poll = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let pollTitle: string;
    let pollOpts: string[];
    let overrideEmojis: string[];
    let pollOptsInit: string;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            pollTitle = input.args.join(' ');
            pollOpts = ['yes', 'no'];
            overrideEmojis = ['✔', '❌'];
        }
            break;
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'Options',
                value: pollOpts.join(', ')
            }
        ],
        input.id,
        'poll',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

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


    switch (input.type) {
        case 'message': {
            (input.message.channel as Discord.GuildTextBasedChannel).send({
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
        }
            break;
    }

};

/**
 * random number
 */
export const roll = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let maxNum: number;
    let minNum: number;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
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
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'Min',
                value: minNum
            },
            {
                name: 'Max',
                value: maxNum
            }
        ],
        input.id,
        'roll',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );
    if (isNaN(maxNum)) {
        maxNum = 100;
    }
    if (isNaN(minNum)) {
        minNum = 0;
    }
    const eq = Math.floor(Math.random() * (maxNum - minNum)) + minNum;

    await helper.tools.commands.sendMessage({
        type: input.type,
        message: input.message,
        interaction: input.interaction,
        args: {
            content: `${eq}`,
        }
    }, input.canReply);
};

/**
 * send a message
 */
export const say = async (input: bottypes.commandInput) => {

    let commanduser: Discord.User | Discord.APIUser;
    let msg: string;
    let channel: Discord.GuildTextBasedChannel;

    switch (input.type) {
        case 'message': {
            commanduser = input.message.author;
            channel = input.message.channel as Discord.GuildTextBasedChannel;
            msg = input.args.join(' ');
        }
            break;
    }

    helper.tools.log.commandOptions(
        [
            {
                name: 'Channel',
                value: `${channel.id} (in ${channel.guildId})`
            },
            {
                name: 'Message',
                value: msg
            }
        ],
        input.id,
        'say',
        input.type,
        commanduser,
        input.message,
        input.interaction,
    );

    if (msg.length < 1) {
        msg = helper.vars.defaults.invisbleChar;
    }
    if (msg == helper.vars.defaults.invisbleChar) {
        channel.send({
            embeds: [new Discord.EmbedBuilder()
                .setDescription(msg)
                .setColor(helper.vars.colours.embedColour.info.dec)
            ]
        });
    } else {
        channel.send({ content: msg });
    }

    input.message.delete().catch();
};