let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'botstatus',
    description: 'sets the bots status',
    ownerOnly: true,

    execute(message, args, client, Discord) {
        if(message.author.id == '503794887318044675')
{        let w = args.splice(1,100).join(" ");
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
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - status")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")}
        }
}
//client.commands.get('').execute(message, args)