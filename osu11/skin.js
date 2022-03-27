const fs = require('fs')
module.exports = {
    name: 'skin',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        fs.appendFileSync('osu.log', "\n" + '--- COMMAND EXECUTION ---')
        let skinname = args[0];
        if(!skinname){
            message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skins")
        }
        else{        
            switch(skinname){
            case '1':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/01custom")
                break;

            case '2':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/02custom")
                break;

            case '3':
                message.reply(("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/03x"))
                break;

            case '4':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/04y")
                break;

            case '5':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/05z")
                break;

            case '6':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/06ss0")
                break;
            
            case '7':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/07ss1")
                break;
        
            case '8':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/08sbr")
                break;

            case '9':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/09prjct")
                break;
            
            case '10':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/10ud")
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
            
            case 'c1':
                message.reply("")
                break;
            
            case 'bluebudgie':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/bluebudgie")
                break;
            case 'soragaton':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/soragaton")
                break;
            case 'bluegamingftw':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/bluegamingftw")
                break;
            case 'byonick':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/byonick")
                break;
            case 'ikugoi':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/ikugoi")
                break;
            case 'oniisanbaka':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/oniisanbaka")
                break;
            case 'duckyboi':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/duckyboi")
                break;
            case 'radiite':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/radiite")
                break;
            case 'hanoji': 
            message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/hanoji")
                break;
            case 'mix':
                message.reply("add link when??? add link when???")
                break;

            default:
            message.channel.send("***SKINS*** \n```json\n1 - SaberStrikeCustom\n2 - SaberStrikeCustomv2\n3 - Type X\n4 - Type Y \n5 - Type Z\n6 - SaberStrike『0』\n7 - SaberStrike『1』(most unique cursor dance one)\n8 - sbr\n9 - prjct sbr\n10 - SBR UnDefined\nb1 - Cark\nb2 - Koifish\nb3 - Kanojo Mizuhara\nb4 - Saber's AMOGUS\nb5 - SaberStrike『0』_-Levi-_ edit\nb6 - SaberStrike『Soragaton』\nb7 - sbr 『-hANOJI』```")

        }}
        fs.appendFileSync('osu.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('osu.log', "\n" + "command executed - skin")
        let consoleloguserweeee = message.author
        fs.appendFileSync('osu.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('osu.log', "\n" + "")   
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)