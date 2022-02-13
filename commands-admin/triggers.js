module.exports = {
    name: 'triggers',
    description: '',
    execute(message, args, linkargs, Discord, client, currentDate, currentDateISO) {
        message.reply("you can't say that!")
        console.group('--- TRIGGERED WORD ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log(`MESSAGE - ${linkargs}`)
        let consoleloguserweeee = message.author
        console.log(`${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)