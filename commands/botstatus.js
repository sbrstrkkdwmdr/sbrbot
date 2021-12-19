module.exports = {
    name: 'botstatus',
    description: 'sets the bots status',
    ownerOnly: true,

    execute(message, args, client, Discord, currentDate, currentDateISO) {
        if(message.author.id == '503794887318044675')
{        let w = args.splice(0,100).join(" ");
        let a = ["WATCHING", "PLAYING", "STREAMING", "LISTENING"]
        let b = a[Math.floor(Math.random() * a.length)];

        client.user.setPresence({ activities: [{ name: w, type: b}], status: `dnd`,});

        message.reply("status set!")
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - status")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")}
        }
}
//client.commands.get('').execute(message, args)