module.exports = {
    name: '8ball',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        let rdm = ["yes", "no clue.", "知らない", "nope", "yeah", "definitely maybe not", "nah", "yeah of course", "絶対!!!", "多分", 
        "i didn't quite catch that, ask again?", "ehhhhhhh", "⠀"];
        let ball = rdm[Math.floor(Math.random() * rdm.length)];
        message.reply(String(`${ball}`))   
        console.group('--- COMMAND EXECUTION ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - 8ball")
        console.log("category - general")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)