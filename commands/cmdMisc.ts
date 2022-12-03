import * as Discord from 'discord.js';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as replayparser from 'osureplayparser';
import yts from 'yt-search';
import * as calc from '../src/calc.js';
import * as cmdchecks from '../src/checks.js';
import * as colourfunc from '../src/colourcalc.js';
import * as buttonsthing from '../src/consts/buttons.js';
import * as colours from '../src/consts/colours.js';
import * as def from '../src/consts/defaults.js';
import * as emojis from '../src/consts/emojis.js';
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
export function _8ball(input: extypes.commandInput) {

    let commanduser;

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

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: `${responses[Math.floor(Math.random() * responses.length)]}`,
        }
    });

    log.logCommand({
        event: 'Success',
        commandName: '',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
    });

}

/**
 * send random gif
 */
export function gif(input: extypes.commandInput) {

    let commanduser;
    let type;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            type = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            type = input.obj.options.getString('type');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
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
        commandName: 'gif',
        options: [
            {
                name: 'Type',
                value: type
            }
        ]
    });

    //ACTUAL COMMAND STUFF==============================================================================================================================================================================================

    const cryabtit = [
        'https://media.discordapp.net/attachments/858364068024156171/858364114183520266/cry_about_about_it.gif', //zitron map
        'https://tenor.com/view/cry-about-it-jtoh-get-real-gif-20687952', // imperfect circle
        'https://tenor.com/view/cry-about-it-cry-about-computer-motherboard-gif-21225172', //washing motherboard
        'https://tenor.com/view/cry-about-it-gif-22026840', // among us bookshelf
        'https://tenor.com/view/cry-about-it-gif-22157955', //spongebob is not ok
        'https://tenor.com/view/cry-about-it-gif-21703291', // yum concrete
        'https://tenor.com/view/cry-about-it-concrete-mixer-cement-mixer-mixer-spin-gif-21623037', // guy spinning in a cement mixer
        'https://tenor.com/view/cry-about-it-cat-hoverboard-cat-on-hoverboard-cry-gif-21748938', // cat on hoverboard
        'https://tenor.com/view/cry-about-it-gif-21779608', //furries kissing
        'https://tenor.com/view/mgr-monsoon-metal-gear-rising-gif-22307573', //metal gear rising revengeance or whatever guy
        'https://tenor.com/view/reisen-cry-about-it-reisen-udongein-touhou-gif-24775462', //reisen udongein inaba fumo
        'https://tenor.com/view/cry-about-it-gif-19162157', //the marble hit each other thing 
        'https://media.discordapp.net/attachments/716812353034780703/855178667420024863/ezgif.com-gif-maker_1.gif', //zitron map og
    ];
    const speechbubble = [
        //'https://cdn.discordapp.com/attachments/724514625005158403/979287600852500490/amogus_speak.png', // among ASS speaking
        'https://cdn.discordapp.com/attachments/724514625005158403/979287601443926032/guardian_speak.png', //minecraft guardian inside glass inside a stone box surrounding my guardian farm
        'https://cdn.discordapp.com/attachments/724514625005158403/989314110250451004/zanei.png', //zan'ei jumps
        'https://cdn.discordapp.com/attachments/796366644653719592/963160984057425999/poland.gif', // poland
        'https://cdn.discordapp.com/attachments/968450905634656326/970003694055747644/MushiMikoNya.gif', //idk who this is either but anime girl
        'https://i.imgur.com/4kHRrcn.gif', // beast troll minecraft
        'https://media.discordapp.net/attachments/297712669342040064/969077431497527347/LettyWhiteRockJohnson.gif', // letty white rock jhohnosn (who)
        'https://media.discordapp.net/attachments/652388390095814658/949917542963617802/ezgif-7-49533ed57a.gif', //gura yapping
        //'https://media.discordapp.net/attachments/698111941238980634/926143071891116093/image0.gif', //the angry birds gif which somehow fixed my laptop screen when i put it in the bottom right corner //commented out bcs link broke
        'https://media.discordapp.net/attachments/801693686010216461/937316740059258911/SPOILER_4024ab0508989392.gif', //sotarks
        'https://media.discordapp.net/attachments/837435513212370976/948682024456167474/image0.gif', // guy sucking on a door handle
        'https://media.discordapp.net/attachments/855538143302385727/978751222293098536/delta_dannerif-5-a495e94394.gif', //idk what this is but theres a girl that looks like kasane teto and an 8 in the middle
        'https://media.discordapp.net/attachments/861689222586171393/953156001320812564/LOChMeR.gif', //hitcircle default skin 
        'https://media.discordapp.net/attachments/877077345054380052/946909426432999474/screenshot2324_-_Copy.gif', //that one section of the big black
        /* 'https://media.discordapp.net/attachments/878855036992622652/960730586903887902/sph.gif', //felix nsfw\ */

        'https://media.discordapp.net/attachments/885710706350116915/946818088857370696/yes.gif', // bunny girl + mask
        //'https://media.discordapp.net/attachments/894054954661204009/956769254269648917/lil-nas-x-pregnant.gif', //lil nas x pregnant
        'https://media.discordapp.net/attachments/960980200613625896/967546422155182130/Untitled2.gif', //touhou1?!?!?
        'https://media.discordapp.net/attachments/965669674492764160/969044374107336734/yuuka.gif', // yuuka
        'https://media.discordapp.net/attachments/98226572468690944/977994968461365298/chokeplay-1.gif', //fubuki getting choked and enjoying it
        'https://tenor.com/view/nerd-nerd-emoji-meme-speech-bubble-bubble-gif-25115885', //nerd emoji guy
        'https://media.discordapp.net/attachments/843627338839490560/977578032946626621/deranker.gif', //osu rank graph going down (bad)
        'https://cdn.discordapp.com/attachments/903512449469267991/992776650565627986/373E2B63-77FA-4916-8902-1EC50B4B6F26.gif', //dog
        'https://cdn.discordapp.com/attachments/903512449469267991/992776826940305439/8806F06C-0A48-4141-AD08-434D2578D199.gif', //upside down boot
        'https://cdn.discordapp.com/attachments/903512449469267991/993503753837740032/961460810859835463.png', // crying glasses wojak
        'https://cdn.discordapp.com/attachments/903512449469267991/993515597709189130/received_568368178206882.jpg', // malding gluttony wojak
        'https://cdn.discordapp.com/attachments/653760219708391445/992520290309505074/unknown.png', //cat
        'https://cdn.discordapp.com/attachments/848722603009900565/993759868144070716/age_tier_list.gif', // age tier list
        'https://cdn.discordapp.com/attachments/848722603009900565/993757803938332702/soy.gif', // ebina from umaru greentext
        'https://tenor.com/view/speech-bubble-discord-who-cares-handsome-squidward-squidward-gif-25418980', //squidward cosplay
        'https://tenor.com/view/felix-re-zero-felix-argyle-speech-bubble-speech-gif-25397116', // felix gaming
        'https://tenor.com/view/speech-speech-bubble-meme-joke-arbys-we-have-the-meats-gif-24803181', //arby's
        'https://tenor.com/view/among-us-amongla-speech-bubble-meme-saraiva-gif-25059294', // among us speaking 
        'https://tenor.com/view/speech-bubble-chad-handsome-discord-gif-25759083', //
        //'https://media.discordapp.net/attachments/975869969336238100/989335327351119892/unknown.gif', //peter griffin buff //broken url
        'https://media.discordapp.net/attachments/929807268994744340/987061740665700372/ThisWillBeAngryBirdsPigIn2014.gif', //bad piggies
        'https://media.discordapp.net/attachments/975869865258795078/993928228932698172/crcoer.gif', //crocodile vs man
        'https://media.discordapp.net/attachments/999722639390163065/1006556693267763280/attachment-5.gif', //im allergic to girls
        'https://tenor.com/view/tails-speech-bubble-soup-gif-26158321', //tails speech bubble soup
        'https://media.discordapp.net/attachments/792190772257488936/987347301863403630/cock.gif', //cock water
        'https://media.discordapp.net/attachments/844739553504002048/1007857842113478697/djaskldjklasdasdjklasdjklasjkld.gif', //cpod missanalyser
        'https://media.discordapp.net/attachments/751502560132726875/967567781451149373/crillerowo.gif', //miss anal (troll)
        'https://media.discordapp.net/attachments/1006667144555151390/1011201900206632960/EBD0C0A4-D4AE-45D6-9B36-3EF19BF81FA2.gif', //average dream stan
        'https://media.discordapp.net/attachments/1006667144555151390/1011218423637868594/attachment-18.gif', //when you see troll???!!
        'https://media.discordapp.net/attachments/1011582321511645264/1016887451295428679/yuyu_sin.gif', //yuyuko with the microphone
        'https://cdn.discordapp.com/attachments/1015133324114661436/1018411223450144832/20220910_235606.jpg', //fat ass peter griffin being moved with a forklift
        'https://media.discordapp.net/attachments/1001881826824044615/1006829538908569631/D4994339-F98C-4CF2-A0CA-C805F3853E2A.gif', //googling googl
    ];
    const reaction = [
        'https://tenor.com/view/jerma-jerma985-burger-eating-tucker-carson-gif-22054018', // jerma eating
        'https://tenor.com/view/live-garfield-reaction-gif-25354213', //garfield
        'https://tenor.com/view/live-eating-reaction-sauceland-twili-gif-25355949', //minecraft bedrock eating baked potato
        'https://tenor.com/view/armstron-senator-armstrong-armstrong-mgrr-metal-gif-25128679', // live armstrong reaction
        'https://tenor.com/view/live-nuclear-reaction-live-tucker-reaction-live-reaction-gif-25285499' // live nuclear reaction
    ];

    const skillissue = [
        'https://media.discordapp.net/attachments/894054954661204009/940062600119611452/gg_skill_issue.gif', // gg skill issue okuu
        'https://tenor.com/view/metal-gear-rising-gif-24563434', // metal gear sword skill issue
        'https://tenor.com/view/skill-issue-gif-23142299', // sounds like skill issue
    ];

    const nobitches = [
        'https://tenor.com/view/no-bitches-no-damsels-meme-cubism-gif-24935368', // no damsels
        'https://tenor.com/view/foss-no-bitches-no-hoes-0bitches-no-gif-24529727', // no bitches
        'https://tenor.com/view/no-bitches-no-girls-funny-gif-25343933', // travel thru space no bitches
    ];

    const agree = [
        'https://tenor.com/view/jojo-anime-yes-yes-yes-yeah-its-a-yes-gif-17161748', // jojo yes yes yes
    ];

    const cope = [
        'https://tenor.com/view/cope-cope-harder-copium-digicharat-anime-dance-gif-24244737',//anime girls cope harder
        'https://tenor.com/view/cope-harder-cope-harder-baboon-mentality-gif-22115122', //copy long charlie moistcritikal
        'https://media.discordapp.net/attachments/883455161450762301/944520240270802984/caption.gif', //tetris
    ];

    const disagree = [
        'https://tenor.com/view/yakuzalad-gif-22281385', // i dont agree with your opinion press phone then boom everyone dies
    ];

    const nocare = [
        'https://tenor.com/view/ice-eating-ok-and-gif-19666657', // ok and eat ice
        'https://tenor.com/view/eating-the-chip-chips-chip-eating-chip-man-eating-three-chips-gif-18885184', //eating chips
    ];

    const misspell = [
        'https://tenor.com/view/clone-drone-in-the-danger-zone-yroue-gif-22600859', //yroue
        'https://tenor.com/view/omaru-polka-minor-spelling-mistake-death-fading-hololive-gif-23611404', // minor spelling mistake polka
        'https://tenor.com/view/omori-gif-21640508', //when you youer
    ];

    const compliment = [
        'https://media.discordapp.net/attachments/511546997979873282/717030857000353873/image0-6.gif', //this dude is fucking
        'https://tenor.com/view/reddit-wholesome-redditor-heckin-chonker-big-chungus-gif-18690103', //wholesome redditor
    ];

    const insult = [
        'https://tenor.com/view/dies-dies-of-cringe-dies-from-cringe-meme-dr-strange-dr-strange2-gif-25621125', //dies from cringe
        'https://tenor.com/view/your-mom-your-mother-megamind-megamind-laughter-gif-23851574', // megamind your mother.
        'https://tenor.com/view/i-know-your-ip-address-we-know-your-ip-address-im-outside-your-house-meme-memes-gif-23579728', // maccas happy meal ip address
        'https://tenor.com/view/touhou-fumo-reisen-gif-20875565', // reisen fumo die
        'https://tenor.com/view/kys-gif-24272600', // capri sun kill urself
    ];

    const ratio = [
        'https://tenor.com/view/dont-care-didnt-ask-cope-_ratio-skill-issue-canceled-gif-24148064', //ratio guy goes into car
        'https://tenor.com/view/ratio-skill-issue-skill-issue-ur-bald-gif-23967610', //nerd emoji
        'https://tenor.com/view/ratiobozo-ratio-gif-23500921', //dog smiley wtf
        'https://tenor.com/view/ratio-didnt-ask-you-fell-off-cope-dont-know-what-youre-talking-about-gif-23606778',
    ];
    const reactiontoinf = [
        'https://tenor.com/view/kumala-la-kumala-mrtti-gif-25688572'

    ];
    let thelink: string;
    switch (type) {
        case 'cry about it':
            thelink = cryabtit[Math.floor(Math.random() * cryabtit.length)];

            break;
        case 'speech bubble':
            thelink = speechbubble[Math.floor(Math.random() * speechbubble.length)];

            break;
        case 'chad speak':
            thelink = 'https://cdn.discordapp.com/attachments/724514625005158403/979287601146118184/gigachad_speak.png';

            break;
        case 'reaction':
            thelink = reaction[Math.floor(Math.random() * reaction.length)];

            break;
        case 'skill issue':
            thelink = skillissue[Math.floor(Math.random() * skillissue.length)];

            break;
        case 'no bitches':
            thelink = nobitches[Math.floor(Math.random() * nobitches.length)];

            break;
        case 'agree':
            thelink = agree[Math.floor(Math.random() * agree.length)];

            break;
        case 'cope':
            thelink = cope[Math.floor(Math.random() * cope.length)];

            break;
        case 'disagree':
            thelink = disagree[Math.floor(Math.random() * disagree.length)];

            break;
        case 'nocare':
            thelink = nocare[Math.floor(Math.random() * nocare.length)];

            break;
        case 'misspell':
            thelink = misspell[Math.floor(Math.random() * misspell.length)];

            break;
        case 'compliment':
            thelink = compliment[Math.floor(Math.random() * compliment.length)];

            break;
        case 'insult':
            thelink = insult[Math.floor(Math.random() * insult.length)];

            break;
        case 'ratio':
            thelink = ratio[Math.floor(Math.random() * ratio.length)];

            break;
        case 'reaction to info':
            thelink = reactiontoinf[Math.floor(Math.random() * reactiontoinf.length)];
            break;
        default:
            thelink = 'err';
            break;
    }

    //SEND/EDIT MSG==============================================================================================================================================================================================

    if (thelink == 'err') {
        commanduser.send('Error - invalid/missing type');
        return;
    }

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
            input.obj.delete()
                .catch();
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction);
            input.obj.reply({
                content: 'success',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                ephemeral: true
            })
                .catch();
        }

            //==============================================================================================================================================================================================

            break;
    }

    input.obj.channel.send(thelink)
        .catch(error => { });

    log.logCommand({
        event: 'Success',
        commandName: '',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
    });

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
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            query = input.args.join(' ');
            if (!input.args[0]) {
                iserr = true;
            }
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            query = input.obj.options.getString('query');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
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
        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction).reply({
            content: 'Error: could not fetch the requested image.',
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        })
            .catch(error => { });
        return;
    }

    const response: extypes.imagesearches = await res.json() as any;
    fs.writeFileSync(`debug/command-image=imageSearch=${input.obj.guildId}.json`, JSON.stringify(response, null, 4), 'utf-8');

    if (!response.items) {
        (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction).reply({
            content: `Error: no results found for \`${query}\``,
            allowedMentions: { repliedUser: false },
            failIfNotExists: true
        })
            .catch(error => { });
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
    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: useEmbeds
        }
    });

    fs.appendFileSync(`logs/cmd/commands${input.obj.guildId}.log`,
        `
----------------------------------------------------
success
ID: ${input.absoluteID}
----------------------------------------------------
\n\n`, 'utf-8');

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
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            pollTitle = input.args.join(' ');
            pollOpts = ['yes', 'no'];
            overrideEmojis = ['✔', '❌'];
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
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
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
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
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
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
        commandName: '',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
    });

}

/**
 * random number
 */
export function roll(input: extypes.commandInput) {

    let commanduser;
    let maxNum: number;
    let minNum: number;

    switch (input.commandType) {
        case 'message': {
            input.obj = (input.obj as Discord.Message<any>);
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
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            maxNum = input.obj.options.getNumber('max') ? Math.floor(input.obj.options.getNumber('max')) : 100;
            minNum = input.obj.options.getNumber('min') ? Math.floor(input.obj.options.getNumber('min')) : 0;
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
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

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            content: `${eq}`,
        }
    });

    log.logCommand({
        event: 'Success',
        commandName: '',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
    });

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
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            channel = input.obj.channel;
            msg = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
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
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
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
            input.obj = (input.obj as Discord.Message<any>);
            input.obj.delete().catch();
        }
            break;
        case 'interaction': {
            (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction).reply({
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
        commandName: '',
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
            input.obj = (input.obj as Discord.Message<any>);
            commanduser = input.obj.author;
            query = input.args.join(' ');
        }
            break;

        //==============================================================================================================================================================================================

        case 'interaction': {
            input.obj = (input.obj as Discord.ChatInputCommandInteraction<any>);
            commanduser = input.obj.member.user;
            query = input.obj.options.getString('query');
        }

            //==============================================================================================================================================================================================

            break;
        case 'button': {
            input.obj = (input.obj as Discord.ButtonInteraction<any>);
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
        return (input.obj as Discord.Message<any> | Discord.ChatInputCommandInteraction).reply({
            content: 'Please provide a search query.',
            ephemeral: true
        });
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

    msgfunc.sendMessage({
        commandType: input.commandType,
        obj: input.obj,
        args: {
            embeds: [searchEmbed]
        }
    });

    log.logCommand({
        event: 'Success',
        commandName: '',
        commandType: input.commandType,
        commandId: input.absoluteID,
        object: input.obj,
    });

}