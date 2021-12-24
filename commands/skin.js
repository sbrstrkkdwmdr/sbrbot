module.exports = {
    name: 'skin',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        let skinname = args[0];
        if(!skinname){
            message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skins")
        }
        else{        
            switch(skinname){
            case '1':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/01custom/a")
                break;

            case '2':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/02custom/a")
                break;

            case '3':
                message.reply(("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/03x/a"))
                break;

            case '4':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/04y/a")
                break;

            case '5':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/05z/a")
                break;

            case '6':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/06ss0/a")
                break;
            
            case '7':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/07ss1/a")
                break;
        
            case '8':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/08sbr/a")
                break;

            case '9':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/09prjct/a")
                break;
            
            case '10':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/10ud/a")
                break;

            case 'b1':
                message.reply("https://drive.google.com/drive/u/0/folders/1OexvvV4Zshw3P3R1N0bS3sQD_WEhlQKv")
                break;

            case 'b2':
                message.reply("https://drive.google.com/drive/u/0/folders/18t7KxG2scQgm43DW930cSmaUXbYEpCdK")
                break;

            case 'b3':
                message.reply("https://mega.nz/file/PVFgBbYB#LVnrsI1leThv8f35PDM7kt3yHgcwhD9WB2Wkq696aEQ")
                break;

            case 'b4':
                message.reply("https://www.reddit.com/r/OsuSkins/comments/m9vcti/amogus_skin/")
                break;

            case 'b5':
                message.reply("https://drive.google.com/file/d/1Jomy1k00Q6VLqOQgq_ifgDy5MV_nMZje/view")
                break;

            case 'b6':
                message.reply("https://drive.google.com/file/d/1-pRLecUTaoUNXpHj1TLSMBayvWC09CT2/view")
                break;

            case 'b7':
                message.reply("https://drive.google.com/file/d/171NdVkA-tmm43n8iqsRJeNQ0QCffj6ab/view")
                break;
            case 'mix':
                message.reply("")
                break;
                
            default:
            message.channel.send("***SKINS*** \n```json\n1 - SaberStrikeCustom\n2 - SaberStrikeCustomv2\n3 - Type X\n4 - Type Y \n5 - Type Z\n6 - SaberStrike『0』\n7 - SaberStrike『1』(most unique cursor dance one)\n8 - sbr\n9 - prjct sbr\n10 - SBR UnDefined\nb1 - Cark\nb2 - Koifish\nb3 - Kanojo Mizuhara\nb4 - Saber's AMOGUS\nb5 - SaberStrike『0』_-Levi-_ edit\nb6 - SaberStrike『Soragaton』\Nb7 - sbr 『-hANOJI』```")

        }}
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - skin")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")   
    }
}
//client.commands.get('').execute(message, args)