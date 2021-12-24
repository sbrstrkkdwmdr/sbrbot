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

            default:
            message.channel.send("***SKINS*** \n1 - custom\n2 - customv2\n3 - Type X\n4 - Type Y \n5 - Type Z\n6 - SaberStrike 0\n7 - SaberStrike 1\n8 - sbr\n9 - prjct sbr\n10 - SBR UnDefined")

        }}
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - skin")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")   
    }
}
//client.commands.get('').execute(message, args)