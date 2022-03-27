const fs = require('fs')
module.exports = {
    name: 'botstatus',
    description: 'sets the bots status',
    ownerOnly: true,

    execute(message, args, client, Discord, currentDate, currentDateISO) {
        fs.appendFileSync('admincmd.log', "\n" + '--- COMMAND EXECUTION ---')
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
        fs.appendFileSync('admincmd.log', "\n" + `${currentDateISO} | ${currentDate}`)
        fs.appendFileSync('admincmd.log', "\n" + "command executed - status")
        fs.appendFileSync('admincmd.log', "\n" + "category - admin")
        let consoleloguserweeee = message.author
        fs.appendFileSync('admincmd.log', "\n" + `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        fs.appendFileSync('admincmd.log', "\n" + "")}
        console.groupEnd()
        }
}
//client.commands.get('').execute(message, args)