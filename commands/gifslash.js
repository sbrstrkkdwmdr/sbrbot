const fs = require('fs')
const { otherlogdir } = require('../logconfig.json')

module.exports = {
    name: 'gifslash',
    description: 'gif',
    execute(interaction, options, currentDate, currentDateISO) {


        function cryabtit() {
            let randomnum = Math.floor(Math.random() * 13 + 1)
            let url = 'pp';
            switch (randomnum) {
                case 1:
                    url = 'https://media.discordapp.net/attachments/858364068024156171/858364114183520266/cry_about_about_it.gif' //zitron map
                    break;
                case 2:
                    url = 'https://tenor.com/view/cry-about-it-jtoh-get-real-gif-20687952' // imperfect circle
                    break;
                case 3:
                    url = 'https://tenor.com/view/cry-about-it-cry-about-computer-motherboard-gif-21225172' //washing motherboard
                    break;
                case 4:
                    url = 'https://tenor.com/view/cry-about-it-gif-22026840' // among us bookshelf
                    break;
                case 5:
                    url = 'https://tenor.com/view/cry-about-it-gif-22157955' //spongebob is not ok
                    break;
                case 6:
                    url = 'https://tenor.com/view/cry-about-it-gif-21703291' // yum concrete
                    break;
                case 7:
                    url = 'https://tenor.com/view/cry-about-it-concrete-mixer-cement-mixer-mixer-spin-gif-21623037' // guy spinning in a cement mixer
                    break;
                case 8:
                    url = 'https://tenor.com/view/cry-about-it-cat-hoverboard-cat-on-hoverboard-cry-gif-21748938' // cat on hoverboard
                    break;
                case 9:
                    url = 'https://tenor.com/view/cry-about-it-gif-21779608' //furries kissing
                    break;
                case 10:
                    url = 'https://tenor.com/view/mgr-monsoon-metal-gear-rising-gif-22307573' //metal gear rising revengeance or whatever guy
                    break;
                case 11:
                    url = 'https://tenor.com/view/reisen-cry-about-it-reisen-udongein-touhou-gif-24775462' //reisen udongein inaba fumo
                    break;
                case 12:
                    url = 'https://tenor.com/view/cry-about-it-gif-19162157' //the marble hit each other thing 
                    break;
                case 13:
                    url = 'https://media.discordapp.net/attachments/716812353034780703/855178667420024863/ezgif.com-gif-maker_1.gif' //zitron map og
                    break;
                default:
                    url = 'err'
                    break;
            }
            return url;
        }
        function speechbubble() {
            let randomnum = Math.floor(Math.random() * 16 + 1)
            let url;
            switch (randomnum) {
                case 1:
                    url = 'https://media.discordapp.net/attachments/698111941238980634/926143071891116093/image0.gif' //the angry birds gif which somehow fixed my laptop screen when i put it in the bottom right corner
                    break;
                case 2:
                    url = 'https://media.discordapp.net/attachments/885710706350116915/946818088857370696/yes.gif' // bunny girl + mask
                    break;
                case 3:
                    url = 'https://media.discordapp.net/attachments/837435513212370976/948682024456167474/image0.gif' // guy sucking on a door handle
                    break;
                case 4:
                    url = 'https://media.discordapp.net/attachments/652388390095814658/949917542963617802/ezgif-7-49533ed57a.gif' //gura yapping
                    break;
                case 5:
                    url = 'https://media.discordapp.net/attachments/877077345054380052/946909426432999474/screenshot2324_-_Copy.gif' //that one section of the big black
                    break;
                case 6:
                    url = 'https://i.imgur.com/4kHRrcn.gif' // beast troll minecraft
                    break;
                case 7:
                    url = 'https://media.discordapp.net/attachments/801693686010216461/937316740059258911/SPOILER_4024ab0508989392.gif' //sotarks
                    break;
                case 8:
                    url = 'https://media.discordapp.net/attachments/878855036992622652/960730586903887902/sph.gif' //felix nsfw
                    break;
                case 9:
                    url = 'https://cdn.discordapp.com/attachments/796366644653719592/963160984057425999/poland.gif' // poland
                    break;
                case 10:
                    url = 'https://media.discordapp.net/attachments/98226572468690944/977994968461365298/chokeplay-1.gif' //fubuki getting choked and enjoying it
                    break;
                case 11:
                    url = 'https://cdn.discordapp.com/attachments/724514625005158403/979287600852500490/amogus_speak.png' // among ASS speaking
                    break;
                case 12:
                    url = 'https://cdn.discordapp.com/attachments/724514625005158403/979287601443926032/guardian_speak.png' //minecraft guardian inside glass inside a stone box surrounding my guardian farm
                    break;
                case 13:
                    url = 'https://media.discordapp.net/attachments/861689222586171393/953156001320812564/LOChMeR.gif' //hitcircle default skin 
                    break;
                case 14:
                    url = 'https://media.discordapp.net/attachments/894054954661204009/956769254269648917/lil-nas-x-pregnant.gif' //lil nas x pregnant
                    break;
                case 15:
                    url = 'https://media.discordapp.net/attachments/855538143302385727/978751222293098536/delta_dannerif-5-a495e94394.gif' //idk what this is but theres a girl that looks like kasane teto and an 8 in the middle
                    break;
                case 16:
                    url = 'https://tenor.com/view/nerd-nerd-emoji-meme-speech-bubble-bubble-gif-25115885' //nerd emoji guy
                    break;
                default:
                    url = 'err'
                    break;
            }
            return url;

        }
        function reaction() {
            let url;
            let randomnum = Math.floor(Math.random() * 4 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://tenor.com/view/jerma-jerma985-burger-eating-tucker-carson-gif-22054018' // jerma eating
                    break;
                case 2:
                    url = 'https://tenor.com/view/live-garfield-reaction-gif-25354213' //garfield
                    break;
                case 3:
                    url = 'https://tenor.com/view/live-eating-reaction-sauceland-twili-gif-25355949' //minecraft bedrock eating baked potato
                    break;
                case 4:
                    url = 'https://tenor.com/view/armstron-senator-armstrong-armstrong-mgrr-metal-gif-25128679' // live armstrong reaction
                    break;
                case 5:
                    url = ''
                    break;
            }
            return url;

        }
        function skillissue() {
            let url;
            let randomnum = Math.floor(Math.random() * 3 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://media.discordapp.net/attachments/894054954661204009/940062600119611452/gg_skill_issue.gif' // gg skill issue okuu
                    break;
                case 2:
                    url = 'https://tenor.com/view/metal-gear-rising-gif-24563434' // metal gear sword skill issue
                    break;
                case 3:
                    url = 'https://tenor.com/view/skill-issue-gif-23142299' // sounds like skill issue
                    break;
            }
            return url;
        }
        function nobitches() {
            let url;
            let randomnum = Math.floor(Math.random() * 3 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://tenor.com/view/no-bitches-no-damsels-meme-cubism-gif-24935368' // no damsels
                    break;
                case 2:
                    url = 'https://tenor.com/view/foss-no-bitches-no-hoes-0bitches-no-gif-24529727' // no bitches
                    break;
                case 3:
                    url = 'https://tenor.com/view/no-bitches-no-girls-funny-gif-25343933' // travel thru space no bitches
                    break;
            }
            return url;
        }
        function agree() {
            let url;
            let randomnum = Math.floor(Math.random() * 1 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://tenor.com/view/jojo-anime-yes-yes-yes-yeah-its-a-yes-gif-17161748' // jojo yes yes yes
                    break;
            }
            return url;
        }
        function cope() {
            let url;
            let randomnum = Math.floor(Math.random() * 3 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://tenor.com/view/cope-cope-harder-copium-digicharat-anime-dance-gif-24244737' //anime girls cope harder
                    break;
                case 2:
                    url = 'https://tenor.com/view/cope-harder-cope-harder-baboon-mentality-gif-22115122' //copy long charlie moistcritikal
                    break;
                case 3:
                    url = 'https://media.discordapp.net/attachments/883455161450762301/944520240270802984/caption.gif' //tetris
                    break;
            }
            return url;
        }
        function disagree() {
            let url;
            let randomnum = Math.floor(Math.random() * 1 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://tenor.com/view/yakuzalad-gif-22281385' // i dont agree with your opinion press phone then boom everyone dies
                    break;
            }
            return url;
        }
        function nocare() {
            let url;
            let randomnum = Math.floor(Math.random() * 2 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://tenor.com/view/ice-eating-ok-and-gif-19666657' // ok and eat ice
                    break;
                case 2:
                    url = 'https://tenor.com/view/eating-the-chip-chips-chip-eating-chip-man-eating-three-chips-gif-18885184' //eating chips
                    break;
            }
            return url;
        }
        function misspell() {
            let url;
            let randomnum = Math.floor(Math.random() * 3 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://tenor.com/view/clone-drone-in-the-danger-zone-yroue-gif-22600859' //yroue
                    break;
                case 2:
                    url = 'https://tenor.com/view/omaru-polka-minor-spelling-mistake-death-fading-hololive-gif-23611404' // minor spelling mistake polka
                    break;
                case 3:
                    url = 'https://tenor.com/view/omori-gif-21640508'
                    break;
            }
            return url;
        }
        //https://media.discordapp.net/attachments/511546997979873282/717030857000353873/image0-6.gif
        function compliment() {
            let url;
            let randomnum = Math.floor(Math.random() * 2 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://media.discordapp.net/attachments/511546997979873282/717030857000353873/image0-6.gif' //this dude is fucking
                    break;
                case 2:
                    url = 'https://tenor.com/view/reddit-wholesome-redditor-heckin-chonker-big-chungus-gif-18690103' //wholesome redditor
                    break;
            }
            return url;
        }
        function insult() {
            let url;
            let randomnum = Math.floor(Math.random() * 4 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://tenor.com/view/dies-dies-of-cringe-dies-from-cringe-meme-dr-strange-dr-strange2-gif-25621125' //dies from cringe
                    break;
                case 2:
                    url = 'https://tenor.com/view/your-mom-your-mother-megamind-megamind-laughter-gif-23851574' // megamind your mother.
                    break;
                case 3:
                    url = 'https://tenor.com/view/i-know-your-ip-address-we-know-your-ip-address-im-outside-your-house-meme-memes-gif-23579728' // maccas happy meal ip address
                    break;
                case 4:
                    url = 'https://tenor.com/view/touhou-fumo-reisen-gif-20875565' // reisen fumo die
                    break;
            }
            return url;
        }
        function ratio() {
            let url;
            let randomnum = Math.floor(Math.random() * 3 + 1)
            switch (randomnum) {
                case 1:
                    url = 'https://tenor.com/view/dont-care-didnt-ask-cope-_ratio-skill-issue-canceled-gif-24148064' //ratio guy goes into car
                    break;
                case 2:
                    url = 'https://tenor.com/view/ratio-skill-issue-skill-issue-ur-bald-gif-23967610' //nerd emoji
                    break;
                case 3:
                    url = 'https://tenor.com/view/ratiobozo-ratio-gif-23500921' //dog smiley wtf
                    break;
                case 4:
                    url = 'https://tenor.com/view/ratio-didnt-ask-you-fell-off-cope-dont-know-what-youre-talking-about-gif-23606778'
                    break;
            }
        }
        /*
        function skillissue() {
            let url;
            let randomnum = Math.floor(Math.random() * 2 + 1)
            switch(randomnum){

            }
            return url;
        }*/

        let str = options.getString('type')
        switch (str) {
            case 'cry about it':
                thelink = cryabtit()
                interaction.channel.send(thelink)
                break;
            case 'speech bubble':
                thelink = speechbubble()
                interaction.channel.send(thelink)
                break;
            case 'chad speak':
                thelink = 'https://cdn.discordapp.com/attachments/724514625005158403/979287601146118184/gigachad_speak.png'
                interaction.channel.send(thelink)
                break;
            case 'reaction':
                thelink = reaction()
                interaction.channel.send(thelink)
                break;
            case 'skill issue':
                thelink = skillissue()
                interaction.channel.send(thelink)
                break;
            case 'no bitches':
                thelink = nobitches()
                interaction.channel.send(thelink)
                break;
            case 'agree':
                thelink = agree()
                interaction.channel.send(thelink)
                break;
            case 'cope':
                thelink = cope()
                interaction.channel.send(thelink)
                break;
            case 'disagree':
                thelink = disagree()
                interaction.channel.send(thelink)
                break;
            case 'nocare':
                thelink = nocare()
                interaction.channel.send(thelink)
                break;
            case 'misspell':
                thelink = misspell()
                interaction.channel.send(thelink)
                break;
            case 'compliment':
                thelink = compliment()
                interaction.channel.send(thelink)
                break;
            case 'insult':
                thelink = insult()
                interaction.channel.send(thelink)
                break;
            case 'ratio':
                thelink = ratio()
                interaction.channel.send(thelink)
                break;
        }
        interaction.reply({ content: 'success', ephemeral: true })



        fs.appendFileSync(otherlogdir, "\n" + '--- COMMAND EXECUTION ---')
        fs.appendFileSync(otherlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(otherlogdir, "\n" + "command executed - gif")
    }
}