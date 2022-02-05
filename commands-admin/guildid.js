module.exports = {
    name: 'guildid',
    execute(message, args, currentDate, currentDateISO) {
        message.channel.send("WIP")
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - guildid")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
        }
    }