let currentDate = new Date();
let currentDateISO = new Date().toISOString();
module.exports = {
    name: 'guildid',
    execute(message, args) {
        message.channel.send("WIP")
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - guildid")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        }
    }