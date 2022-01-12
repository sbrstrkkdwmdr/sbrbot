let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'danser',
    description: '',
    execute(message, args) {
        let variablenamelol = args[0]
        if(!variablenamelol){
        message.channel.send("https://discord.gg/UTPvbe8")
        message.channel.send("https://wieku.me/danser")}
        else {
            switch (variablenamelol) {
                case 'ffmpeg':
                    message.channel.send("https://github.com/Wieku/danser-go/wiki/FFmpeg")
                    break;

                case 'rainbowcursor':
                    message.channel.send("https://github.com/Wieku/danser-go/wiki/Cursor")
                    break;

                default:
                    message.channel.send("https://discord.gg/UTPvbe8")
                    message.channel.send("https://wieku.me/danser")
                    break;
            }
        }
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - danser")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
      /*  if(args[0] == help){
         message.channel.send("ask here")
         message.channel.send
        }
        else{
          
        }*/
    }
}
//client.commands.get('').execute(message, args)