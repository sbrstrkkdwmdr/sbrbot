module.exports = {
    name: 'triggers',
    description: '',
    execute(message, args, linkargs, Discord, client, currentDate, currentDateISO) {
        
        message.reply("you can't say that!")
        if(message.content.includes('n word')) return message.reply('😱')
        setTimeout(() => {
            message.delete()
            message.channel.send('-')
        },3000
        )
        console.group('--- TRIGGERED WORD ---')
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log(`MESSAGE - ${message}`)
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