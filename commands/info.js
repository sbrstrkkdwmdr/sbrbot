let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'info',
    description: '',
    execute(message, args) {
        message.channel.send('bot coded by SaberStrike in node js')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - info")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)