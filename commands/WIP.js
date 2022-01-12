let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'WIP',
    description: '',
    execute(message, args) {
        message.channel.send("the current command is unavailable")
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - WIP")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)