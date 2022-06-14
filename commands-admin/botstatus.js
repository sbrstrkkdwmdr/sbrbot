const fs = require('fs')
const { adminlogdir } = require('../logconfig.json')

module.exports = {
    name: 'botstatus',
    description: 
    'Sets the bots status' + 
    '\nUsage: `sbr-botstatus [0-3] [text]`',
    ownerOnly: true,

    execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync(adminlogdir, "\n" + '--- COMMAND EXECUTION ---')
        if(message.author.id == '503794887318044675')
        {       
        let w = args.splice(1,100).join(" ");
        const a = ["WATCHING", "PLAYING", "STREAMING", "LISTENING"];
        a[0] = "WATCHING";
        a[1] = "PLAYING";
        a[2] = "STREAMING";
        a[3] = "LISTENING";
        let b = a[Math.floor(Math.random() * a.length)];
        let d = args[0];
        let c = a[d];

        client.user.setPresence({ activities: [{ name: w, type: c}], status: `dnd`,});

        message.reply("status set!")
        fs.appendFileSync(adminlogdir, "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync(adminlogdir, "\n" + "command executed - status")
        fs.appendFileSync(adminlogdir, "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync(adminlogdir, "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync(adminlogdir, "\n" + "")}
        console.groupEnd()
        }
}
//client.commands.get('').execute(message, args)