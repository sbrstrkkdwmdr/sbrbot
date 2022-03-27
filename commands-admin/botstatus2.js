const fs = require('fs')
module.exports = {
    name: 'botstatus2',
    description: 'sets the bots status',

    execute(interaction, options, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
        if(interaction.member.user.id == '503794887318044675')
{       
        const a = ["WATCHING", "PLAYING", "STREAMING", "LISTENING"];
        a[0] = "WATCHING";
        a[1] = "PLAYING";
        a[2] = "STREAMING";
        a[3] = "LISTENING";
        let status = options.getString('status')
        let text = options.getString('text')
        let type = options.getString('type')
        if(!status){
            status = 'dnd'
        }
        if(!text){
            text = 'with deez nuts'
        }
        if(!type || type != "WATCHING" || type != "PLAYING" || type != "STREAMING" || type != "LISTENING"){
            type = 'PLAYING'
        }

        client.user.setPresence({ activities: [{ name: text, type: type}], status: status,});

        interaction.reply("status set!")
        fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('admincmd.log', "\n" + "command executed - status")
        fs.appendFileSync('admincmd.log', "\n" + "category - admin")
        let consoleloguserweeee = interaction.member.user
        fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('admincmd.log', "\n" + "")}
        console.groupEnd()
        }
}
//client.commands.get('').execute(message, args)