module.exports = {
    name: 'triggers',
    description: '',
    execute(message, args, linkargs, Discord, client, currentDate, currentDateISO) {
        message.delete()
        console.group('--- TRIGGERED WORD ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log(`MESSAGE - ${message}`)
        console.log("category - admin")
        let consoleloguserweeee = message.author
        console.log(`${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}

//if (substrings.some(v => str.includes(v))) {
    // There's at least one
//}
//client.commands.get('').execute(message, args)