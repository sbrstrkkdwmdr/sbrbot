const fs = require('fs')
module.exports = {
    name: 'skin',
    description: '',
    execute(interaction, options, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        let skinname = options.getString('skin')
        if(!skinname){
            interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skins")
        }
        else{        
            switch(skinname){
            case '1':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/01custom")
                break;

            case '2':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/02custom")
                break;

            case '3':
                interaction.reply(("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/03x"))
                break;

            case '4':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/04y")
                break;

            case '5':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/05z")
                break;

            case '6':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/06ss0")
                break;
            
            case '7':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/07ss1")
                break;
        
            case '8':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/08sbr")
                break;

            case '9':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/09prjct")
                break;
            
            case '10':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/main-skin/10ud")
                break;

            case 'b1':
                interaction.reply("https://drive.google.com/drive/u/0/folders/1OexvvV4Zshw3P3R1N0bS3sQD_WEhlQKv")
                break;

            case 'b2':
                interaction.reply("https://drive.google.com/drive/u/0/folders/18t7KxG2scQgm43DW930cSmaUXbYEpCdK")
                break;

            case 'b3':
                interaction.reply("https://mega.nz/file/PVFgBbYB#LVnrsI1leThv8f35PDM7kt3yHgcwhD9WB2Wkq696aEQ")
                break;

            case 'b4':
                interaction.reply("https://www.reddit.com/r/OsuSkins/comments/m9vcti/amogus_skin/")
                break;

            case 'b5':
                interaction.reply("https://drive.google.com/file/d/1Jomy1k00Q6VLqOQgq_ifgDy5MV_nMZje/view")
                break;

            case 'b6':
                interaction.reply("https://drive.google.com/file/d/1-pRLecUTaoUNXpHj1TLSMBayvWC09CT2/view")
                break;

            case 'b7':
                interaction.reply("https://drive.google.com/file/d/171NdVkA-tmm43n8iqsRJeNQ0QCffj6ab/view")
                break;
            
            case 'c1':
                interaction.reply("")
                break;
            
            case 'bluebudgie':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/bluebudgie")
                break;
            case 'soragaton':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/soragaton")
                break;
            case 'bluegamingftw':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/bluegamingftw")
                break;
            case 'byonick':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/byonick")
                break;
            case 'ikugoi':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/ikugoi")
                break;
            case 'oniisanbaka':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/oniisanbaka")
                break;
            case 'duckyboi':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/duckyboi")
                break;
            case 'radiite':
                interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/radiite")
                break;
            case 'hanoji': 
            interaction.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/sbrstrk-r/hanoji")
                break;
            case 'mix':
                interaction.reply("add link when??? add link when???")
                break;
            default:
            interaction.reply("***SKINS*** \nnote - not all skins are shown here\n```json\n1 - SaberStrikeCustom\n2 - SaberStrikeCustomv2\n3 - Type X\n4 - Type Y \n5 - Type Z\n6 - SaberStrike『0』\n7 - SaberStrike『1』(most unique cursor dance one)\n8 - sbr\n9 - prjct sbr\n10 - SBR UnDefined\nb1 - Cark\nb2 - Koifish\nb3 - Kanojo Mizuhara\nb4 - Saber's AMOGUS\nb5 - SaberStrike『0』_-Levi-_ edit\nb6 - SaberStrike『Soragaton』\nb7 - sbr 『-hANOJI』```")

        }}
        fs.appendFileSync('osu.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('osu.log', "\n" + "command executed - skin")
        fs.appendFileSync('osu.log', "\n" + "category - osu (no api usage)")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync('osu.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('osu.log', "\n" + "sent")
        fs.appendFileSync('osu.log', "\n" + "")   
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)