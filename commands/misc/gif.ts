import cmdchecks = require('../../calc/commandchecks');
import fs = require('fs');
import colours = require('../../configs/colours');
module.exports = {
    name: 'gif',
    execute(message, args, userdata, client, Discord, currentDate, currentDateISO, config, interaction, absoluteID, button, obj) {
        let type;
        let user;
        if (message != null && interaction == null && button == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - gif (message)
${currentDate} | ${currentDateISO}
recieved gif command
requested by ${message.author.id} AKA ${message.author.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            type = args.join(' ');
            user = message.author;
        }

        //==============================================================================================================================================================================================

        if (interaction != null && button == null && message == null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - gif (interaction)
${currentDate} | ${currentDateISO}
recieved gif command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
            type = interaction.options.getString('type');
            user = interaction.member.user;
        }

        //==============================================================================================================================================================================================

        if (button != null) {
            fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
                `
----------------------------------------------------
COMMAND EVENT - gif (interaction)
${currentDate} | ${currentDateISO}
recieved gif command
requested by ${interaction.member.user.id} AKA ${interaction.member.user.tag}
cmd ID: ${absoluteID}
----------------------------------------------------
`, 'utf-8')
        }
        //OPTIONS==============================================================================================================================================================================================
        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
ID: ${absoluteID}
type: ${type}
----------------------------------------------------
`, 'utf-8')
        //ACTUAL COMMAND STUFF==============================================================================================================================================================================================
        let thelink: string;
        let cryabtit = [
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
        ]
        let speechbubble = [
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
            'https://media.discordapp.net/attachments/999722639390163065/1006556693267763280/attachment-5.gif' //im allergic to girls

        ]
        let reaction = [
            'https://tenor.com/view/jerma-jerma985-burger-eating-tucker-carson-gif-22054018', // jerma eating
            'https://tenor.com/view/live-garfield-reaction-gif-25354213', //garfield
            'https://tenor.com/view/live-eating-reaction-sauceland-twili-gif-25355949', //minecraft bedrock eating baked potato
            'https://tenor.com/view/armstron-senator-armstrong-armstrong-mgrr-metal-gif-25128679', // live armstrong reaction
            'https://tenor.com/view/live-nuclear-reaction-live-tucker-reaction-live-reaction-gif-25285499' // live nuclear reaction
        ]

        let skillissue = [
            'https://media.discordapp.net/attachments/894054954661204009/940062600119611452/gg_skill_issue.gif', // gg skill issue okuu
            'https://tenor.com/view/metal-gear-rising-gif-24563434', // metal gear sword skill issue
            'https://tenor.com/view/skill-issue-gif-23142299', // sounds like skill issue
        ]

        let nobitches = [
            'https://tenor.com/view/no-bitches-no-damsels-meme-cubism-gif-24935368', // no damsels
            'https://tenor.com/view/foss-no-bitches-no-hoes-0bitches-no-gif-24529727', // no bitches
            'https://tenor.com/view/no-bitches-no-girls-funny-gif-25343933', // travel thru space no bitches
        ]

        let agree = [
            'https://tenor.com/view/jojo-anime-yes-yes-yes-yeah-its-a-yes-gif-17161748', // jojo yes yes yes
        ]

        let cope = [
            'https://tenor.com/view/cope-cope-harder-copium-digicharat-anime-dance-gif-24244737',//anime girls cope harder
            'https://tenor.com/view/cope-harder-cope-harder-baboon-mentality-gif-22115122', //copy long charlie moistcritikal
            'https://media.discordapp.net/attachments/883455161450762301/944520240270802984/caption.gif', //tetris
        ]

        let disagree = [
            'https://tenor.com/view/yakuzalad-gif-22281385', // i dont agree with your opinion press phone then boom everyone dies
        ]

        let nocare = [
            'https://tenor.com/view/ice-eating-ok-and-gif-19666657', // ok and eat ice
            'https://tenor.com/view/eating-the-chip-chips-chip-eating-chip-man-eating-three-chips-gif-18885184', //eating chips
        ]

        let misspell = [
            'https://tenor.com/view/clone-drone-in-the-danger-zone-yroue-gif-22600859', //yroue
            'https://tenor.com/view/omaru-polka-minor-spelling-mistake-death-fading-hololive-gif-23611404', // minor spelling mistake polka
            'https://tenor.com/view/omori-gif-21640508', //when you youer
        ]
        //https://media.discordapp.net/attachments/511546997979873282/717030857000353873/image0-6.gif

        let compliment = [
            'https://media.discordapp.net/attachments/511546997979873282/717030857000353873/image0-6.gif', //this dude is fucking
            'https://tenor.com/view/reddit-wholesome-redditor-heckin-chonker-big-chungus-gif-18690103', //wholesome redditor
        ]

        let insult = [
            'https://tenor.com/view/dies-dies-of-cringe-dies-from-cringe-meme-dr-strange-dr-strange2-gif-25621125', //dies from cringe
            'https://tenor.com/view/your-mom-your-mother-megamind-megamind-laughter-gif-23851574', // megamind your mother.
            'https://tenor.com/view/i-know-your-ip-address-we-know-your-ip-address-im-outside-your-house-meme-memes-gif-23579728', // maccas happy meal ip address
            'https://tenor.com/view/touhou-fumo-reisen-gif-20875565', // reisen fumo die
            'https://tenor.com/view/kys-gif-24272600', // capri sun kill urself
        ]

        let ratio = [
            'https://tenor.com/view/dont-care-didnt-ask-cope-_ratio-skill-issue-canceled-gif-24148064', //ratio guy goes into car
            'https://tenor.com/view/ratio-skill-issue-skill-issue-ur-bald-gif-23967610', //nerd emoji
            'https://tenor.com/view/ratiobozo-ratio-gif-23500921', //dog smiley wtf
            'https://tenor.com/view/ratio-didnt-ask-you-fell-off-cope-dont-know-what-youre-talking-about-gif-23606778',
        ]
        let reactiontoinf = [
            'https://tenor.com/view/kumala-la-kumala-mrtti-gif-25688572'

        ]
        switch (type) {
            case 'cry about it':
                thelink = cryabtit[Math.floor(Math.random() * cryabtit.length)]

                break;
            case 'speech bubble':
                thelink = speechbubble[Math.floor(Math.random() * speechbubble.length)]

                break;
            case 'chad speak':
                thelink = 'https://cdn.discordapp.com/attachments/724514625005158403/979287601146118184/gigachad_speak.png'

                break;
            case 'reaction':
                thelink = reaction[Math.floor(Math.random() * reaction.length)]

                break;
            case 'skill issue':
                thelink = skillissue[Math.floor(Math.random() * skillissue.length)]

                break;
            case 'no bitches':
                thelink = nobitches[Math.floor(Math.random() * nobitches.length)]

                break;
            case 'agree':
                thelink = agree[Math.floor(Math.random() * agree.length)]

                break;
            case 'cope':
                thelink = cope[Math.floor(Math.random() * cope.length)]

                break;
            case 'disagree':
                thelink = disagree[Math.floor(Math.random() * disagree.length)]

                break;
            case 'nocare':
                thelink = nocare[Math.floor(Math.random() * nocare.length)]

                break;
            case 'misspell':
                thelink = misspell[Math.floor(Math.random() * misspell.length)]

                break;
            case 'compliment':
                thelink = compliment[Math.floor(Math.random() * compliment.length)]

                break;
            case 'insult':
                thelink = insult[Math.floor(Math.random() * insult.length)]

                break;
            case 'ratio':
                thelink = ratio[Math.floor(Math.random() * ratio.length)]

                break;
            case 'reaction to info':
                thelink = reactiontoinf[Math.floor(Math.random() * reactiontoinf.length)]
                break;
            default:
                thelink = 'err'
                break;
        }

        //SEND/EDIT MSG==============================================================================================================================================================================================

        if (thelink == 'err') {
            user.send('Error - invalid/missing type')
            return;
        }

        if (message != null && interaction == null && button == null) {
            message.delete()
                .catch(error => { });

        }
        if (interaction != null && button == null && message == null) {
            interaction.reply({
                content: 'success',
                ephemeral: true,
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        if (button != null) {
            message.edit({
                content: '',
                embeds: [],
                files: [],
                allowedMentions: { repliedUser: false },
                failIfNotExists: true
            })
                .catch(error => { });

        }
        obj.channel.send(thelink)
            .catch(error => { });

        fs.appendFileSync(`logs/cmd/commands${obj.guildId}.log`,
            `
----------------------------------------------------
success
ID: ${absoluteID}
----------------------------------------------------
\n\n`, 'utf-8')
    }
}