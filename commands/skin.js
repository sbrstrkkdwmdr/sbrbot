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
            case 'custom':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/01custom/a")
                break;

            case 'customv2':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/02custom/a")
                break;

            case 'typex':
                message.reply(("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/03x/a"))
                break;

            case 'typey':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/04y/a")
                break;

            case 'typez':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/05z/a")
                break;

            case '0':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/06ss0/a")
                break;
            
            case '1':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/07ss1/a")
                break;
        
            case 'sbr':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/08sbr/a")
                break;

            case 'prjct_sbr':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/09prjct/a")
                break;
            
            case 'sbr_ud':
                message.reply("https://sbrstrkkdwmdr.github.io/sbr-web/osu-skin/image/10ud/a")
                break;

            default:
            message.channel.send("skins - \n`custom\ncustomv2\ntypex\ntypey\ntypez\n0\n1\nsbr\nprjct_sbr\nsbr_ud`")

        }}
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - ")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")   
    }
}
//client.commands.get('').execute(message, args)