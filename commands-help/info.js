module.exports = {
    name: 'info',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        message.channel.send('bot coded by SaberStrike in node js\nsource code - https://github.com/sbrstrkkdwmdr/sbrbot\nhttps://discord.js.org/#/docs/discord.js/stable/general/welcome')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - info")
        console.log("category - help")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)