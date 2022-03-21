module.exports = {
    name: 'horny',
    description: '',
    execute(message, args, currentDate, currentDateISO) {
        console.group('--- COMMAND EXECUTION ---')
        message.channel.send("go to horny jail")
        message.channel.send("https://cdn.discordapp.com/attachments/544104638904008704/761896640956203018/Screen_Shot_2020-04-28_at_12.png") 
        console.log(`${currentDateISO} | ${currentDate}`)
        console.log("command executed - horny")
        console.log("category - ecchi")
        let consoleloguserweeee = message.author
        console.log(`requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`)
        console.log("")
        console.groupEnd()
    }
}
//client.commands.get('').execute(message, args)