let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'unread',
    description: '',
    execute(message, args) {
        message.delete();
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - unread")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
    }
}
//client.commands.get('').execute(message, args)